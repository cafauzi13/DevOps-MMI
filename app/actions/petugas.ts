"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getActiveHijriYear } from "@/app/lib/hijri";

const prisma = new PrismaClient();

// ==========================================
// 1. FUNGSI CREATE PETUGAS 👷‍♂️
// ==========================================
export async function createPetugas(formData: any) {
  try {
    const hijriYear = getActiveHijriYear();

    const lastPetugas = await prisma.petugasJaga.findFirst({
      where: { id_lama: { startsWith: hijriYear } },
      orderBy: { id_lama: 'desc' }
    });

    let nextSeq = 1;
    if (lastPetugas && lastPetugas.id_lama) {
      const lastSeqStr = lastPetugas.id_lama.replace(hijriYear, ""); 
      nextSeq = parseInt(lastSeqStr) + 1;
    }
    const generatedIdLama = `${hijriYear}${nextSeq.toString().padStart(2, '0')}`;

    await prisma.petugasJaga.create({
      data: {
        id_lama: generatedIdLama,
        nama: formData.nama,
        no_hp: formData.no_hp || null,
      }
    });

    revalidatePath("/admin/petugas");
    return { success: true, message: `Petugas berhasil ditambah dengan ID: ${generatedIdLama}` };
  } catch (error) {
    console.error("Gagal nyimpen petugas:", error);
    return { success: false, message: "Terjadi kesalahan saat menyimpan data petugas." };
  }
}

// ==========================================
// 2. FUNGSI BACA DATA PETUGAS (GET + SEARCH + FILTER TAHUN) 📖
// ==========================================
export async function getPetugasJaga(query: string = "", yearFilter: string = "") {
  try {
    const data = await prisma.petugasJaga.findMany({
      where: {
        AND: [
          query ? {
            OR: [
              { nama: { contains: query, mode: 'insensitive' } },
              { id_lama: { contains: query, mode: 'insensitive' } }
            ]
          } : {},
          (yearFilter && yearFilter !== "Semua") ? {
            id_lama: { startsWith: yearFilter }
          } : {}
        ]
      },
      orderBy: { id_lama: 'desc' }
    });
    return { success: true, data: data };
  } catch (error) {
    console.error("Gagal narik data petugas:", error);
    return { success: false, data: [] };
  }
}

// ==========================================
// 3. FUNGSI UPDATE PETUGAS 🔄
// ==========================================
export async function updatePetugas(id_petugas: string, formData: any) {
  try {
    await prisma.petugasJaga.update({
      where: { id_petugas },
      data: {
        nama: formData.nama,
        no_hp: formData.no_hp || null,
      }
    });

    revalidatePath("/admin/petugas");
    return { success: true, message: "Data petugas berhasil diperbarui!" };
  } catch (error) {
    console.error("Gagal update petugas:", error);
    return { success: false, message: "Terjadi kesalahan saat memperbarui data." };
  }
}

// ==========================================
// 4. FUNGSI DELETE PETUGAS 🗑️
// ==========================================
export async function deletePetugas(id_petugas: string) {
  try {
    await prisma.petugasJaga.delete({ where: { id_petugas } });
    revalidatePath("/admin/petugas");
    return { success: true, message: "Data petugas berhasil dihapus!" };
  } catch (error) {
    console.error("Gagal hapus petugas:", error);
    return { success: false, message: "Pastikan petugas ini tidak terikat dengan data shohibul qurban." };
  }
}