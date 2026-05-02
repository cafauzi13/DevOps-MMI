"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getPengqurban(query: string = "", yearFilter: string = "") {
  try {
    const data = await prisma.pengqurban.findMany({
      where: {
        AND: [
          query ? {
            OR: [
              { nkw: { contains: query, mode: 'insensitive' } },
              { nama_lengkap: { contains: query, mode: 'insensitive' } },
            ]
          } : {},
          (yearFilter && yearFilter !== "Semua") ? {
             nkw: { startsWith: yearFilter } 
          } : {}
        ]
      },
      // ✨ INI OBATNYA BIAR ERROR HILANG ✨
      include: {
        hewan_qurban: true 
      },
      orderBy: { nkw: 'desc' }
    });
    
    return { success: true, data: data };
  } catch (error) {
    console.error("Gagal narik data pengqurban:", error);
    return { success: false, data: [] };
  }
}

export async function createPengqurban(formData: any) {
  try {
    // 1. Cek dulu, jangan sampai ada NKW ganda/kembar!
    const existing = await prisma.pengqurban.findUnique({
      where: { nkw: formData.nkw }
    });

    if (existing) {
      return { success: false, message: "Nomor Kwitansi (NKW) ini sudah terdaftar!" };
    }

    // 2. Simpan ke database
    await prisma.pengqurban.create({
      data: {
        nkw: formData.nkw,
        no_urut: formData.no_urut ? parseInt(formData.no_urut) : null,
        nama_lengkap: formData.nama_lengkap,
        jenis_kelamin: formData.jenis_kelamin || null,
        telepon: formData.telepon || null,
        kd_wilayah: formData.kd_wilayah || null,
        alamat: formData.alamat || null,
        id_petugas: formData.id_petugas || null,
      }
    });

    // 3. MAGIC TRICK: Suruh Next.js nge-refresh tabel dan dashboard otomatis! ✨
    revalidatePath("/admin/pengqurban");
    revalidatePath("/admin");

    return { success: true, message: "Data pengqurban berhasil disimpan!" };
  } catch (error) {
    console.error("Gagal nyimpen pengqurban:", error);
    return { success: false, message: "Terjadi kesalahan saat menyimpan data." };
  }
}

// ... (kode createPengqurban biarin di atasnya)

// FUNGSI UPDATE DATA
export async function updatePengqurban(nkwLama: string, formData: any) {
  try {
    await prisma.pengqurban.update({
      where: { nkw: nkwLama },
      data: {
        no_urut: formData.no_urut ? parseInt(formData.no_urut) : null,
        nama_lengkap: formData.nama_lengkap,
        jenis_kelamin: formData.jenis_kelamin || null,
        telepon: formData.telepon || null,
        kd_wilayah: formData.kd_wilayah || null,
        alamat: formData.alamat || null,
        id_petugas: formData.id_petugas || null,
      }
    });

    revalidatePath("/admin/pengqurban");
    revalidatePath("/admin");
    return { success: true, message: "Data pengqurban berhasil di-update!" };
  } catch (error) {
    console.error("Gagal update:", error);
    return { success: false, message: "Gagal mengupdate data pengqurban." };
  }
}

// FUNGSI DELETE DATA
export async function deletePengqurban(nkw: string) {
  try {
    await prisma.pengqurban.delete({
      where: { nkw }
    });

    revalidatePath("/admin/pengqurban");
    revalidatePath("/admin");
    return { success: true, message: `Data dengan NKW ${nkw} berhasil dihapus!` };
  } catch (error: any) {
    // Tangkap error kalau dia masih punya relasi ke tabel hewan
    if (error.code === 'P2003') {
      return { success: false, message: "Gagal dihapus! Hapus dulu data hewan qurban milik orang ini." };
    }
    return { success: false, message: "Terjadi kesalahan saat menghapus data." };
  }
}