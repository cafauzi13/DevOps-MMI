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
        biaya_operasional: formData.biaya_operasional ? parseFloat(formData.biaya_operasional) : null,
        pindah_sapi: formData.pindah_sapi === 'YA',
        penyaluran_luar: formData.penyaluran_luar === 'YA',
        metode_bayar: formData.metode_bayar || "TUNAI",
        status_bayar: formData.status_bayar || "BELUM LUNAS",
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
        biaya_operasional: formData.biaya_operasional ? parseFloat(formData.biaya_operasional) : null,
        pindah_sapi: formData.pindah_sapi === 'YA',
        penyaluran_luar: formData.penyaluran_luar === 'YA',
        metode_bayar: formData.metode_bayar || "TUNAI",
        status_bayar: formData.status_bayar || "BELUM LUNAS",
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
// 4. FUNGSI BACA DATA HEWAN (GET + SEARCHING + AUTO GROUPING 🐄🤝) 
// ==========================================
export async function getHewanQurban(query: string = "", yearFilter: string = "") {
  try {
    // 1. Tarik data mentah dari database (Logic Prisma tetep sama)
    const rawData = await prisma.hewanQurban.findMany({
      where: {
        AND: [
          query ? {
            OR: [
              { pengqurban: { nama_lengkap: { contains: query, mode: 'insensitive' } } },
              { kel_sapi: { contains: query, mode: 'insensitive' } },
              { no_id_lama: { contains: query, mode: 'insensitive' } }
            ]
          } : {},
          (yearFilter && yearFilter !== "Semua") ? {
            no_id_lama: { startsWith: yearFilter }
          } : {}
        ]
      },
      include: {
        pengqurban: {
          select: { 
            nama_lengkap: true, 
            alamat: true
          } 
        }
      },
      orderBy: { no_id_lama: 'desc' }
    });

    // 2. 🪄 PROSES AUTO-GROUPING
    const groupedData: any[] = [];
    const sapiPatunganMap = new Map<string, any>();

    for (const item of rawData) {
      // Asumsi "3" adalah value untuk Sapi Patungan. 
      // Kalau bapaknya masukin kel_sapi, kita proses grouping!
      if (item.jenis_qurban === "3" && item.kel_sapi) {
        const groupKey = item.kel_sapi.toUpperCase(); // Biar seragam (A, B, C)
        
        if (!sapiPatunganMap.has(groupKey)) {
          // Kalau kelompok ini belum ada, kita bikin "Wadah" (Virtual Row) baru
          const newGroup = {
            ...item, // Copy data dasar dari anggota pertama
            id_hewan: `GROUP_${groupKey}`, // ID unik virtual buat ngerender key React
            no_id_lama: `KELOMPOK ${groupKey}`, // Biar di tabel tampilannya KELOMPOK A
            isGroup: true, // 🚩 TANDA PENTING: Flag buat ngasih tau frontend kalau ini grup!
            members: [item], // Simpan data asli Bapak ke-1 di sini
            pengqurban: {
              ...item.pengqurban,
              nama_lengkap: `Sapi Patungan Kelompok ${groupKey}` // Nama sementara
            }
          };
          sapiPatunganMap.set(groupKey, newGroup);
          groupedData.push(newGroup); // Masukin wadah ini ke antrean utama
        } else {
          // Kalau wadahnya udah ada, masukin aja bapak ini ke daftar members
          const existingGroup = sapiPatunganMap.get(groupKey);
          existingGroup.members.push(item);
        }
      } else {
        // Kalau Kambing, Sapi Utuh, atau ga ada kelompok, biarin jalan normal (Individu)
        groupedData.push(item);
      }
    }

    // 3. 🎨 FINISHING: Update label jumlah orang di grup
    for (const group of sapiPatunganMap.values()) {
      group.pengqurban.nama_lengkap = `Sapi Patungan Kel. ${group.kel_sapi} (${group.members.length} Orang)`;
      
      // Ambil bentuk dari anggota pertama sbg default tabel
      group.bentuk = group.members[0].bentuk || "-";
      
      // 👇 LOGIC PENYALURAN DINAMIS 👇
      // Kita kumpulin semua data penyaluran dari tiap anggota, terus kita saring biar nggak ada yang dobel (pakai Set)
      const semuaPenyaluran = Array.from(new Set(group.members.map((m: any) => m.penyaluran || "INTERNAL MMI")));
      
      if (semuaPenyaluran.length === 1) {
        // Kalau isinya cuma 1 macem (berarti 7 orang sepakat semua)
        group.penyaluran = semuaPenyaluran[0]; 
      } else {
        // Kalau isinya lebih dari 1 (berarti ada yang beda-beda)
        group.penyaluran = "Campuran (Internal & Luar)";
      }
    }

    return { success: true, data: groupedData };
  } catch (error) {
    console.error("Gagal narik data hewan:", error);
    return { success: false, data: [] };
  }
}