-- CreateTable
CREATE TABLE "Pengqurban" (
    "id_pengqurban" TEXT NOT NULL,
    "nkw" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nama" TEXT NOT NULL,
    "gelar_awal" TEXT,
    "gelar_akhir" TEXT,
    "kd_wilayah" TEXT,
    "no_urut" INTEGER,
    "alamat" TEXT,
    "telepon" TEXT,
    "id_petugas" TEXT,

    CONSTRAINT "Pengqurban_pkey" PRIMARY KEY ("id_pengqurban")
);

-- CreateTable
CREATE TABLE "HewanQurban" (
    "id_hewan" TEXT NOT NULL,
    "no_id_lama" TEXT,
    "nkw_pengqurban" TEXT NOT NULL,
    "jenis_qurban" TEXT NOT NULL,
    "bentuk" TEXT,
    "uang" DECIMAL(10,2),
    "penyembelihan" TEXT,
    "melihat" BOOLEAN NOT NULL DEFAULT false,
    "menyembelih" BOOLEAN NOT NULL DEFAULT false,
    "jml_bagian" INTEGER,
    "pembagian" TEXT,
    "pesan_bagian" TEXT,
    "kel_sapi" TEXT,
    "no_uq" TEXT,
    "penyaluran" TEXT,
    "lokasi" TEXT,
    "keterangan" TEXT,
    "penerima" TEXT,
    "petugas" TEXT,
    "sebab" TEXT,
    "no_id_surat" TEXT,

    CONSTRAINT "HewanQurban_pkey" PRIMARY KEY ("id_hewan")
);

-- CreateTable
CREATE TABLE "Permohonan" (
    "id_permohonan" TEXT NOT NULL,
    "no_id_surat" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nomor_surat" TEXT,
    "nama_pemohon" TEXT NOT NULL,
    "alamat_pemohon" TEXT,
    "kota_pemohon" TEXT,
    "no_kontak" TEXT,
    "penanggung_jawab" TEXT,
    "no_rek" TEXT,
    "bank" TEXT,
    "atas_nama" TEXT,

    CONSTRAINT "Permohonan_pkey" PRIMARY KEY ("id_permohonan")
);

-- CreateTable
CREATE TABLE "SapiTerpisah" (
    "id_sapi_terpisah" TEXT NOT NULL,
    "no_id_lama" TEXT NOT NULL,
    "nkw_pengqurban" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kel_sapi" TEXT NOT NULL,
    "no_uq" TEXT NOT NULL,

    CONSTRAINT "SapiTerpisah_pkey" PRIMARY KEY ("id_sapi_terpisah")
);

-- CreateTable
CREATE TABLE "PetugasJaga" (
    "id_petugas" TEXT NOT NULL,
    "id_lama" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "no_hp" TEXT,

    CONSTRAINT "PetugasJaga_pkey" PRIMARY KEY ("id_petugas")
);

-- CreateTable
CREATE TABLE "SetorPetugasJaga" (
    "id_setor" TEXT NOT NULL,
    "id_lama" TEXT NOT NULL,
    "id_petugas" TEXT NOT NULL,
    "no_urut" INTEGER,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nama" TEXT NOT NULL,
    "jml_setor" DECIMAL(10,2) NOT NULL,
    "keterangan" TEXT,

    CONSTRAINT "SetorPetugasJaga_pkey" PRIMARY KEY ("id_setor")
);

-- CreateTable
CREATE TABLE "KuitansiTaktis" (
    "id_kuitansi" TEXT NOT NULL,
    "no_kw" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "penanggung_jawab" TEXT NOT NULL,

    CONSTRAINT "KuitansiTaktis_pkey" PRIMARY KEY ("id_kuitansi")
);

-- CreateTable
CREATE TABLE "KuitansiTaktisDetail" (
    "id_detail" TEXT NOT NULL,
    "no_kw" TEXT NOT NULL,
    "pos" TEXT,
    "uraian" TEXT,
    "debit" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "kredit" DECIMAL(12,2) NOT NULL DEFAULT 0,

    CONSTRAINT "KuitansiTaktisDetail_pkey" PRIMARY KEY ("id_detail")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pengqurban_nkw_key" ON "Pengqurban"("nkw");

-- CreateIndex
CREATE UNIQUE INDEX "HewanQurban_no_id_lama_key" ON "HewanQurban"("no_id_lama");

-- CreateIndex
CREATE UNIQUE INDEX "Permohonan_no_id_surat_key" ON "Permohonan"("no_id_surat");

-- CreateIndex
CREATE UNIQUE INDEX "SapiTerpisah_no_id_lama_key" ON "SapiTerpisah"("no_id_lama");

-- CreateIndex
CREATE UNIQUE INDEX "PetugasJaga_id_lama_key" ON "PetugasJaga"("id_lama");

-- CreateIndex
CREATE UNIQUE INDEX "SetorPetugasJaga_id_lama_key" ON "SetorPetugasJaga"("id_lama");

-- CreateIndex
CREATE UNIQUE INDEX "KuitansiTaktis_no_kw_key" ON "KuitansiTaktis"("no_kw");

-- AddForeignKey
ALTER TABLE "HewanQurban" ADD CONSTRAINT "HewanQurban_nkw_pengqurban_fkey" FOREIGN KEY ("nkw_pengqurban") REFERENCES "Pengqurban"("nkw") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HewanQurban" ADD CONSTRAINT "HewanQurban_no_id_surat_fkey" FOREIGN KEY ("no_id_surat") REFERENCES "Permohonan"("no_id_surat") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SapiTerpisah" ADD CONSTRAINT "SapiTerpisah_nkw_pengqurban_fkey" FOREIGN KEY ("nkw_pengqurban") REFERENCES "Pengqurban"("nkw") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetorPetugasJaga" ADD CONSTRAINT "SetorPetugasJaga_id_petugas_fkey" FOREIGN KEY ("id_petugas") REFERENCES "PetugasJaga"("id_lama") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KuitansiTaktisDetail" ADD CONSTRAINT "KuitansiTaktisDetail_no_kw_fkey" FOREIGN KEY ("no_kw") REFERENCES "KuitansiTaktis"("no_kw") ON DELETE RESTRICT ON UPDATE CASCADE;
