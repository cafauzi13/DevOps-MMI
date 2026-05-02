"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getActiveHijriYear } from "@/app/lib/hijri";

const prisma = new PrismaClient();

// ==========================================
// 1. CREATE KUITANSI + DETAILNYA SEKALIGUS
// ==========================================
export async function createKuitansi(formData: any, details: any[]) {
  try {
    const hijriYear = getActiveHijriYear();
    const prefix = `KW-${hijriYear}-`; // ✨ Prefix sekarang dinamis ikutin jaman!

    const lastKW = await prisma.kuitansiTaktis.findFirst({
      where: { no_kw: { startsWith: prefix } },
      orderBy: { no_kw: 'desc' }
    });

    let nextSeq = 1;
    if (lastKW && lastKW.no_kw) {
      const lastSeqStr = lastKW.no_kw.replace(prefix, ""); 
      nextSeq = parseInt(lastSeqStr) + 1;
    }
    const generatedNoKW = `${prefix}${nextSeq.toString().padStart(4, '0')}`;

    await prisma.kuitansiTaktis.create({
      data: {
        no_kw: generatedNoKW,
        tanggal: formData.tanggal ? new Date(formData.tanggal) : new Date(),
        penanggung_jawab: formData.penanggung_jawab,
        detail_kuitansi: {
          create: details.map((d: any) => ({
            pos: d.pos || null,
            uraian: d.uraian || null,
            debit: d.debit ? parseFloat(d.debit) : 0,
            kredit: d.kredit ? parseFloat(d.kredit) : 0,
          }))
        }
      }
    });

    revalidatePath("/admin/kuitansi");
    return { success: true, message: `Kuitansi ${generatedNoKW} berhasil dibuat!` };
  } catch (error) {
    console.error("Gagal nyimpen kuitansi:", error);
    return { success: false, message: "Terjadi kesalahan saat menyimpan kuitansi." };
  }
}

// ==========================================
// 2. READ KUITANSI (LENGKAP DENGAN DETAIL + FILTER)
// ==========================================
export async function getKuitansi(query: string = "", yearFilter: string = "") {
  try {
    const data = await prisma.kuitansiTaktis.findMany({
      where: {
        AND: [
          query ? {
            OR: [
              { no_kw: { contains: query, mode: 'insensitive' } },
              { penanggung_jawab: { contains: query, mode: 'insensitive' } },
            ]
          } : {},
          (yearFilter && yearFilter !== "Semua") ? {
            no_kw: { contains: `KW-${yearFilter}` } // ✨ Filter nyari "KW-1447"
          } : {}
        ]
      },
      include: {
        detail_kuitansi: true
      },
      orderBy: { no_kw: 'desc' }
    });
    return { success: true, data: data };
  } catch (error) {
    console.error("Gagal narik kuitansi:", error);
    return { success: false, data: [] };
  }
}

// ==========================================
// 3. DELETE KUITANSI (BESERTA DETAILNYA)
// ==========================================
export async function deleteKuitansi(no_kw: string) {
  try {
    await prisma.kuitansiTaktisDetail.deleteMany({
      where: { no_kw: no_kw }
    });

    await prisma.kuitansiTaktis.delete({
      where: { no_kw: no_kw }
    });

    revalidatePath("/admin/kuitansi");
    return { success: true, message: "Kuitansi dan seluruh detailnya berhasil dihapus!" };
  } catch (error) {
    console.error("Gagal hapus kuitansi:", error);
    return { success: false, message: "Terjadi kesalahan saat menghapus kuitansi." };
  }
}

// ==========================================
// 4. FUNGSI UPDATE KUITANSI 🔄 (Master-Detail)
// ==========================================
export async function updateKuitansi(no_kw: string, masterData: any, detailData: any[]) {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.kuitansiTaktis.update({
        where: { no_kw },
        data: {
          tanggal: new Date(masterData.tanggal),
          penanggung_jawab: masterData.penanggung_jawab,
        }
      });

      await tx.kuitansiTaktisDetail.deleteMany({
        where: { no_kw }
      });

      const detailToInsert = detailData.map((d: any) => ({
        no_kw,
        pos: d.pos || null,
        uraian: d.uraian,
        debit: d.debit ? parseFloat(d.debit) : 0,
        kredit: d.kredit ? parseFloat(d.kredit) : 0,
      }));

      await tx.kuitansiTaktisDetail.createMany({
        data: detailToInsert
      });
    });

    revalidatePath("/admin/kuitansi");
    return { success: true, message: `Kuitansi ${no_kw} berhasil diperbarui!` };
  } catch (error) {
    console.error("Gagal update kuitansi:", error);
    return { success: false, message: "Terjadi kesalahan saat memperbarui kuitansi." };
  }
}