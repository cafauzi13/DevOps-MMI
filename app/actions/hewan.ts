"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getActiveHijriYear } from "@/app/lib/hijri";

const prisma = new PrismaClient();

// ==========================================
// 1. FUNGSI CREATE HEWAN QURBAN 🐄🐐
// ==========================================
export async function createHewan(formData: any) {
  try {
    const hijriYear = getActiveHijriYear();
    const kodeHewan = formData.jenis_qurban; 

    const lastHewan = await prisma.hewanQurban.findFirst({
      where: {
        no_id_lama: { startsWith: `${hijriYear}${kodeHewan}` }
      },
      orderBy: { no_id_lama: 'desc' }
    });

    let nextSeq = 1;
    if (lastHewan && lastHewan.no_id_lama) {
      const lastSeqStr = lastHewan.no_id_lama.slice(-4); 
      nextSeq = parseInt(lastSeqStr) + 1;
    }
    const seqString = nextSeq.toString().padStart(4, '0'); 
    const generatedNoIdLama = `${hijriYear}${kodeHewan}${seqString}`;

    await prisma.hewanQurban.create({
      data: {
        no_id_lama: generatedNoIdLama,
        nkw_pengqurban: formData.nkw_pengqurban,
        jenis_qurban: formData.jenis_qurban, 
        bentuk: formData.bentuk || null, 
        uang: formData.uang ? parseFloat(formData.uang) : null,
        penyembelihan: formData.penyembelihan || null,
        melihat: formData.melihat === 'YA',
        menyembelih: formData.menyembelih === 'YA',
        jml_bagian: formData.jml_bagian ? parseInt(formData.jml_bagian) : null,
        pembagian: formData.pembagian || null,
        pesan_bagian: formData.pesan_bagian || null,
        kel_sapi: formData.kel_sapi || null,
        no_uq: formData.no_uq || null,
        penyaluran: formData.penyaluran || null, 
        lokasi: formData.lokasi || null,
        keterangan: formData.keterangan || null,
        penerima: formData.penerima || null,
        petugas: formData.petugas || null,
        sebab: formData.sebab || null,
        no_id_surat: formData.no_id_surat || null,
      }
    });

    revalidatePath("/admin/pengqurban");
    revalidatePath("/admin/hewan");

    return { success: true, message: `Hewan berhasil ditambah dengan ID: ${generatedNoIdLama}` };
  } catch (error) {
    console.error("Gagal nyimpen hewan:", error);
    return { success: false, message: "Terjadi kesalahan saat menyimpan data hewan." };
  }
}

// ==========================================
// 2. FUNGSI UPDATE HEWAN QURBAN 📝 (BARU!)
// ==========================================
export async function updateHewan(id_hewan: string, formData: any) {
  try {
    await prisma.hewanQurban.update({
      where: { id_hewan },
      data: {
        // NKW dan Jenis Qurban nggak kita ubah di sini demi keamanan relasi data
        bentuk: formData.bentuk || null, 
        uang: formData.uang ? parseFloat(formData.uang) : null,
        penyembelihan: formData.penyembelihan || null,
        melihat: formData.melihat === 'YA',
        menyembelih: formData.menyembelih === 'YA',
        jml_bagian: formData.jml_bagian ? parseInt(formData.jml_bagian) : null,
        pembagian: formData.pembagian || null,
        pesan_bagian: formData.pesan_bagian || null,
        kel_sapi: formData.kel_sapi || null,
        no_uq: formData.no_uq || null,
        penyaluran: formData.penyaluran || null, 
        lokasi: formData.lokasi || null,
        keterangan: formData.keterangan || null,
        penerima: formData.penerima || null,
        petugas: formData.petugas || null,
        sebab: formData.sebab || null,
        no_id_surat: formData.no_id_surat || null,
      }
    });

    revalidatePath("/admin/hewan");
    revalidatePath("/admin/pengqurban");
    return { success: true, message: "Data hewan qurban berhasil diperbarui!" };
  } catch (error) {
    console.error("Gagal update hewan:", error);
    return { success: false, message: "Terjadi kesalahan saat memperbarui data hewan." };
  }
}

// ==========================================
// 3. FUNGSI DELETE HEWAN QURBAN 🗑️
// ==========================================
export async function deleteHewan(id_hewan: string) {
  try {
    await prisma.hewanQurban.delete({
      where: { id_hewan }
    });

    revalidatePath("/admin/pengqurban");
    revalidatePath("/admin/hewan");
    
    return { success: true, message: "Data hewan qurban berhasil dihapus!" };
  } catch (error) {
    console.error("Gagal hapus hewan:", error);
    return { success: false, message: "Terjadi kesalahan saat menghapus data hewan." };
  }
}

// ==========================================
// 4. FUNGSI BACA DATA HEWAN (GET + SEARCHING) 📖
// ==========================================
// Sekarang dia bisa nerima 'query' buat filter data!
export async function getHewanQurban(query: string = "", yearFilter: string = "") {
  try {
    const data = await prisma.hewanQurban.findMany({
      where: {
        AND: [
          query ? {
            OR: [
              { pengqurban: { nama_lengkap: { contains: query, mode: 'insensitive' } } },
              { kel_sapi: { contains: query, mode: 'insensitive' } },
              { no_id_lama: { contains: query, mode: 'insensitive' } }
            ]
          } : {},
          
          // 2. Filter Tahun Hijriyah 🔑
          // Kalau difilter tahunnya, dan BUKAN "Semua", cari ID yang depannya tahun itu!
          (yearFilter && yearFilter !== "Semua") ? {
            no_id_lama: { startsWith: yearFilter }
          } : {}
        ]
      },
      include: {
        pengqurban: {
          select: { nama_lengkap: true } 
        }
      },
      orderBy: { no_id_lama: 'desc' }
    });
    
    return { success: true, data: data };
  } catch (error) {
    console.error("Gagal narik data hewan:", error);
    return { success: false, data: [] };
  }
}