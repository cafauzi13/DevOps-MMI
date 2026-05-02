"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getActiveHijriYear } from "@/app/lib/hijri";

const prisma = new PrismaClient();

// ==========================================
// 1. CREATE SETORAN
// ==========================================
export async function createSetoran(formData: any) {
  try {
    const hijriYear = getActiveHijriYear();
    const prefix = `STR-${hijriYear}-`; // ✨ Tambah tahun di ID Setoran!

    const lastSetor = await prisma.setorPetugasJaga.findFirst({
      where: { id_lama: { startsWith: prefix } },
      orderBy: { id_lama: 'desc' }
    });

    let nextSeq = 1;
    if (lastSetor && lastSetor.id_lama) {
      const lastSeqStr = lastSetor.id_lama.replace(prefix, ""); 
      nextSeq = parseInt(lastSeqStr) + 1;
    }
    const generatedIdSetor = `${prefix}${nextSeq.toString().padStart(4, '0')}`;

    await prisma.setorPetugasJaga.create({
      data: {
        id_lama: generatedIdSetor,
        id_petugas: formData.id_petugas, 
        no_urut: formData.no_urut ? parseInt(formData.no_urut) : null,
        tanggal: formData.tanggal ? new Date(formData.tanggal) : new Date(),
        nama: formData.nama,
        jml_setor: parseFloat(formData.jml_setor),
        keterangan: formData.keterangan || null,
      }
    });

    revalidatePath("/admin/setoran");
    return { success: true, message: `Setoran berhasil dicatat dengan ID: ${generatedIdSetor}` };
  } catch (error) {
    console.error("Gagal nyimpen setoran:", error);
    return { success: false, message: "Terjadi kesalahan saat menyimpan setoran." };
  }
}

// ==========================================
// 2. READ SETORAN (GET + SEARCH + FILTER TAHUN)
// ==========================================
export async function getSetoran(query: string = "", yearFilter: string = "") {
  try {
    const data = await prisma.setorPetugasJaga.findMany({
      where: {
        AND: [
          query ? {
            OR: [
              { nama: { contains: query, mode: 'insensitive' } },
              { id_lama: { contains: query, mode: 'insensitive' } },
              { petugas: { nama: { contains: query, mode: 'insensitive' } } }
            ]
          } : {},
          (yearFilter && yearFilter !== "Semua") ? {
            id_lama: { contains: `STR-${yearFilter}` } // ✨ Filter nyari "STR-1447"
          } : {}
        ]
      },
      include: {
        petugas: { select: { nama: true } }
      },
      orderBy: { id_lama: 'desc' }
    });
    return { success: true, data: data };
  } catch (error) {
    console.error("Gagal narik setoran:", error);
    return { success: false, data: [] };
  }
}

// ==========================================
// 3. DELETE SETORAN
// ==========================================
export async function deleteSetoran(id_setor: string) {
  try {
    await prisma.setorPetugasJaga.delete({ where: { id_setor } });
    revalidatePath("/admin/setoran");
    return { success: true, message: "Data setoran berhasil dihapus!" };
  } catch (error) {
    console.error("Gagal hapus setoran:", error);
    return { success: false, message: "Terjadi kesalahan saat menghapus data." };
  }
}

// ==========================================
// 4. UPDATE SETORAN 🔄
// ==========================================
export async function updateSetoran(id_setor: string, formData: any) {
  try {
    await prisma.setorPetugasJaga.update({
      where: { id_setor },
      data: {
        id_petugas: formData.id_petugas,
        no_urut: formData.no_urut ? parseInt(formData.no_urut) : null,
        tanggal: formData.tanggal ? new Date(formData.tanggal) : new Date(),
        nama: formData.nama,
        jml_setor: parseFloat(formData.jml_setor),
        keterangan: formData.keterangan || null,
      }
    });
    revalidatePath("/admin/setoran");
    return { success: true, message: "Data setoran berhasil diperbarui!" };
  } catch (error) {
    console.error("Gagal update setoran:", error);
    return { success: false, message: "Terjadi kesalahan saat memperbarui setoran." };
  }
}