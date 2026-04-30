import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';

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

// Fungsi bantuan baca boolean dari MS Access (-1 = True, 0 = False)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseBool(val: any) {
  if (!val) return false;
  const str = String(val).toLowerCase().trim();
  return str === '1' || str === '-1' || str === 'true' || str === 'yes';
}

// Fungsi modular buat ngebaca CSV biar rapi
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readCSV(fileName: string): Promise<any[]> {
  const filePath = path.join(__dirname, 'csv', fileName);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const results: any[] = [];
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ File ${fileName} tidak ditemukan, lewati...`);
      resolve([]);
      return;
    }
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ',' })) // Pastikan file CSV sisa juga pake koma
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

async function main() {
  console.log('🚀 Memulai proses Mega Migrasi...');

  // =========================================
  // 1. SEEDING PERMOHONAN (Instansi)
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
    } catch (e) { }
  }
  console.log(`✅ Berhasil insert ${countPermohonan} data Permohonan.`);

  // =========================================
  // 2. SEEDING HEWAN QURBAN
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
          // Cleaning text data secara otomatis
          keterangan: row.Keterangan ? row.Keterangan.replace(/STAFF/gi, 'STAF') : null,
          penerima: row.Penerima || null,
          petugas: row.Petugas ? String(row.Petugas).replace(/STAFF/gi, 'STAF') : null,
          sebab: row.Sebab || null,
          no_id_surat: row.NoIDSurat || null,
        }
      });
      countHewan++;
    } catch (e) {
      // Lewati kalau nkw pengqurban-nya belum ada di database
    }
  }
  console.log(`✅ Berhasil insert ${countHewan} data Hewan Qurban.`);

  // =========================================
  // 3. SEEDING SAPI TERPISAH
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
    } catch (e) { }
  }
  console.log(`✅ Berhasil insert ${countSapiTerpisah} data Sapi Terpisah.`);

  // =========================================
  // 4. SEEDING PETUGAS JAGA
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
    } catch (e) { }
  }
  console.log(`✅ Berhasil insert ${countPetugas} data Petugas Jaga.`);

  console.log('🎉 SELURUH DATA CORE BERHASIL DIMIGRASI!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });