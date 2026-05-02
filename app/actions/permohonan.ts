"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getActiveHijriYear } from "@/app/lib/hijri";

const prisma = new PrismaClient();

// ==========================================
// 1. FUNGSI CREATE PERMOHONAN 📝
// ==========================================
export async function createPermohonan(formData: any) {
  try {
    const hijriYear = getActiveHijriYear();

    const lastSurat = await prisma.permohonan.findFirst({
      where: { no_id_surat: { startsWith: hijriYear } },
      orderBy: { no_id_surat: 'desc' }
    });

    let nextSeq = 1;
    if (lastSurat && lastSurat.no_id_surat) {
      const lastSeqStr = lastSurat.no_id_surat.slice(-2); 
      nextSeq = parseInt(lastSeqStr) + 1;
    }
    const generatedNoIdSurat = `${hijriYear}${nextSeq.toString().padStart(2, '0')}`;

    await prisma.permohonan.create({
      data: {
        no_id_surat: generatedNoIdSurat,
        tanggal: formData.tanggal ? new Date(formData.tanggal) : new Date(),
        nomor_surat: formData.nomor_surat || null,
        nama_pemohon: formData.nama_pemohon,
        alamat_pemohon: formData.alamat_pemohon || null,
        kota_pemohon: formData.kota_pemohon || null,
        no_kontak: formData.no_kontak || null,
        penanggung_jawab: formData.penanggung_jawab || null,
        no_rek: formData.no_rek || null,
        bank: formData.bank || null,
        atas_nama: formData.atas_nama || null,
      }
    });

    revalidatePath("/admin/permohonan");
    return { success: true, message: `Permohonan berhasil ditambah dengan ID: ${generatedNoIdSurat}` };
  } catch (error) {
    console.error("Gagal nyimpen permohonan:", error);
    return { success: false, message: "Terjadi kesalahan saat menyimpan data permohonan." };
  }
}

// ==========================================
// 2. FUNGSI BACA DATA PERMOHONAN (GET + SEARCH + FILTER TAHUN) 📖
// ==========================================
export async function getPermohonan(query: string = "", yearFilter: string = "") {
  try {
    const data = await prisma.permohonan.findMany({
      where: {
        AND: [
          query ? {
            OR: [
              { nama_pemohon: { contains: query, mode: 'insensitive' } },
              { no_id_surat: { contains: query, mode: 'insensitive' } },
              { penanggung_jawab: { contains: query, mode: 'insensitive' } } 
            ]
          } : {},
          (yearFilter && yearFilter !== "Semua") ? {
            no_id_surat: { startsWith: yearFilter }
          } : {}
        ]
      },
      orderBy: { no_id_surat: 'desc' }
    });
    return { success: true, data: data };
  } catch (error) {
    console.error("Gagal narik data permohonan:", error);
    return { success: false, data: [] };
  }
}

// ==========================================
// 3. FUNGSI UPDATE PERMOHONAN 🔄
// ==========================================
export async function updatePermohonan(id_permohonan: string, formData: any) {
  try {
    await prisma.permohonan.update({
      where: { id_permohonan },
      data: {
        tanggal: formData.tanggal ? new Date(formData.tanggal) : undefined,
        nomor_surat: formData.nomor_surat || null,
        nama_pemohon: formData.nama_pemohon,
        alamat_pemohon: formData.alamat_pemohon || null,
        kota_pemohon: formData.kota_pemohon || null,
        no_kontak: formData.no_kontak || null,
        penanggung_jawab: formData.penanggung_jawab || null,
        no_rek: formData.no_rek || null,
        bank: formData.bank || null,
        atas_nama: formData.atas_nama || null,
      }
    });

    revalidatePath("/admin/permohonan");
    return { success: true, message: "Data permohonan berhasil diperbarui!" };
  } catch (error) {
    console.error("Gagal update permohonan:", error);
    return { success: false, message: "Terjadi kesalahan saat memperbarui data." };
  }
}

// ==========================================
// 4. FUNGSI DELETE PERMOHONAN 🗑️
// ==========================================
export async function deletePermohonan(id_permohonan: string) {
  try {
    await prisma.permohonan.delete({ where: { id_permohonan } });
    revalidatePath("/admin/permohonan");
    return { success: true, message: "Data permohonan berhasil dihapus!" };
  } catch (error) {
    console.error("Gagal hapus permohonan:", error);
    return { success: false, message: "Terjadi kesalahan saat menghapus data." };
  }
}