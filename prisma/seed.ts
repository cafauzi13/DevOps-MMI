import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

// Fungsi bantuan format tanggal
function parseDate(dateStr: string) {
  if (!dateStr) return new Date();
  const datePart = dateStr.split(' ')[0];
  if (!datePart) return new Date();
  const parts = datePart.split('/');
  if (parts.length === 3) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`); 
  }
  return new Date();
}

// Fungsi bantuan baca boolean dari MS Access
function parseBool(val: any) {
  if (!val) return false;
  const str = String(val).toLowerCase().trim();
  return str === '1' || str === '-1' || str === 'true' || str === 'yes';
}

// Fungsi modular buat ngebaca CSV
function readCSV(fileName: string): Promise<any[]> {
  const filePath = path.join(__dirname, 'csv', fileName); // Pastikan folder 'csv' ada di dalam 'prisma'
  const results: any[] = [];
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ File ${fileName} tidak ditemukan, lewati...`);
      resolve([]);
      return;
    }
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ',' }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err: any) => reject(err));
  });
}

async function main() {
  console.log('🚀 Memulai proses Mega Migrasi v2 (Schema Baru)...');

  // =========================================
  // 1. SEEDING PETUGAS JAGA (Harus duluan karena Pengqurban butuh ini)
  // =========================================
  const petugasData = await readCSV('tPetugasJaga.csv');
  let countPetugas = 0;
  for (const row of petugasData) {
    if (!row.IdPetugas) continue;
    try {
      await prisma.petugasJaga.upsert({
        where: { id_lama: row.IdPetugas },
        update: {},
        create: {
          id_lama: row.IdPetugas,
          nama: row.NmPetugas ? row.NmPetugas.replace(/STAFF/gi, 'STAF') : 'Tanpa Nama',
          no_hp: row.HpPetugas || null,
        }
      });
      countPetugas++;
    } catch {}
  }
  console.log(`✅ Berhasil insert ${countPetugas} data Petugas Jaga.`);

  // =========================================
  // 2. SEEDING PENGQURBAN (Tabel Baru!)
  // =========================================
  const pengqurbanData = await readCSV('TPengqurban.csv');
  let countPengqurban = 0;
  for (const row of pengqurbanData) {
    if (!row.NKW) continue;

    // Logika Gabung Nama & Gelar
    const namaAsli = row.NAMA ? row.NAMA.trim() : 'Tanpa Nama';
    const gelarAwal = row.glrAWAL ? `${row.glrAWAL.trim()} ` : '';
    const gelarAkhir = row.glrAKHIR ? `, ${row.glrAKHIR.trim()}` : '';
    const namaLengkap = `${gelarAwal}${namaAsli}${gelarAkhir}`;

    // Cari ID Petugas UUID (Relasi ke tabel PetugasJaga)
    let realPetugasId = null;
    if (row.IdPetugas) {
      const petugas = await prisma.petugasJaga.findUnique({ where: { id_lama: row.IdPetugas } });
      if (petugas) realPetugasId = petugas.id_petugas;
    }

    try {
      await prisma.pengqurban.upsert({
        where: { nkw: row.NKW },
        update: {},
        create: {
          nkw: row.NKW,
          tanggal: parseDate(row.TANGGAL),
          nama_lengkap: namaLengkap, // Langsung masukin nama lengkap hasil gabungan!
          kd_wilayah: row.KdWil || null,
          no_urut: row.NO ? parseInt(row.NO) : null,
          alamat: row.ALAMAT || null,
          telepon: row.TELPON || null,
          id_petugas: realPetugasId,
        }
      });
      countPengqurban++;
    } catch {}
  }
  console.log(`✅ Berhasil insert ${countPengqurban} data Pengqurban.`);

  // =========================================
  // 3. SEEDING HEWAN QURBAN
  // =========================================
  const hewanData = await readCSV('NoIDHewan.csv');
  let countHewan = 0;
  for (const row of hewanData) {
    if (!row.NoID || !row.NKW) continue;
    try {
      await prisma.hewanQurban.upsert({
        where: { no_id_lama: row.NoID },
        update: {},
        create: {
          no_id_lama: row.NoID,
          nkw_pengqurban: row.NKW,
          jenis_qurban: row.JnsQURBAN || 'Tidak Diketahui',
          bentuk: row.BENTUK || null,
          uang: row.UANG ? parseFloat(row.UANG) : 0,
          penyembelihan: row.PENYEMBELIHAN || null,
          melihat: parseBool(row.MELIHAT),
          menyembelih: parseBool(row.MENYEMBELIH),
          jml_bagian: row.JmBAGIAN ? parseInt(row.JmBAGIAN) : null,
          pembagian: row.PEMBAGIAN || null,
          pesan_bagian: row.PsnBAGIAN || null,
          kel_sapi: row.KelSAPI || null,
          no_uq: row.NoUQ || null,
          penyaluran: row.PENYALURAN || null,
          lokasi: row.LOKASI || null,
          keterangan: row.Keterangan ? row.Keterangan.replace(/STAFF/gi, 'STAF') : null,
          penerima: row.Penerima || null,
          petugas: row.Petugas ? String(row.Petugas).replace(/STAFF/gi, 'STAF') : null,
          sebab: row.Sebab || null,
          no_id_surat: row.NoIDSurat || null,
        }
      });
      countHewan++;
    } catch {}
  }
  console.log(`✅ Berhasil insert ${countHewan} data Hewan Qurban.`);

  // =========================================
  // 4. SEEDING SAPI TERPISAH
  // =========================================
  const sapiTerpisahData = await readCSV('NoIDSapiTerpisah.csv');
  let countSapiTerpisah = 0;
  for (const row of sapiTerpisahData) {
    if (!row.NoID || !row.NKW) continue;
    try {
      await prisma.sapiTerpisah.upsert({
        where: { no_id_lama: row.NoID },
        update: {},
        create: {
          no_id_lama: row.NoID,
          nkw_pengqurban: row.NKW,
          nama: row.NAMA || 'Tanpa Nama',
          kel_sapi: row.KelSAPI || '-',
          no_uq: row.NoUQ || '-',
        }
      });
      countSapiTerpisah++;
    } catch {}
  }
  console.log(`✅ Berhasil insert ${countSapiTerpisah} data Sapi Terpisah.`);

  // =========================================
  // 5. SEEDING PERMOHONAN (Instansi)
  // =========================================
  const permohonanData = await readCSV('TPermohonan.csv');
  let countPermohonan = 0;
  for (const row of permohonanData) {
    if (!row.NoIDSurat) continue;
    try {
      await prisma.permohonan.upsert({
        where: { no_id_surat: row.NoIDSurat },
        update: {},
        create: {
          no_id_surat: row.NoIDSurat,
          tanggal: parseDate(row.TANGGAL),
          nomor_surat: row.NOMOR || null,
          nama_pemohon: row.NamaPemohon || 'Tanpa Nama',
          alamat_pemohon: row.AlamatPemohon || null,
          kota_pemohon: row.KotaPemohon || null,
          no_kontak: row.NoKONTAK || null,
          penanggung_jawab: row.PENANGGUNGJAWAB || null,
          no_rek: row.NoRek || null,
          bank: row.BANK || null,
          atas_nama: row.AtasNama || null,
        }
      });
      countPermohonan++;
    } catch {}
  }
  console.log(`✅ Berhasil insert ${countPermohonan} data Permohonan.`);

  // =========================================
  // 6. SEEDING AKUN SUPER ADMIN
  // =========================================
  console.log('Membuat akun Super Admin...');
  const hashedPassword = await bcrypt.hash('adminmmi', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      nama: 'Admin - Masjid Manarul Ilmi ITS',
      role: 'ADMIN',
    }
  });
  console.log('✅ Berhasil insert akun Super Admin.');

  console.log('🎉 SELURUH DATA CORE BERHASIL DIMIGRASI V2!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });