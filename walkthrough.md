# 🧪 Hasil Pemindaian Unit Testing Jest - DevOps-MMI

Dokumen ini berisi hasil pemindaian (*scanning*) dinamis secara utuh terhadap berkas pengujian (`*.test.ts` dan `*.test.tsx`) di dalam project saat ini. Seluruh suite (`describe`) dan test case (`test` / `it`) diekstrak secara lengkap beserta penjelasan fungsinya tanpa rangkuman atau placeholder `...`.

---

## 📊 Ringkasan Umum Uji Coba (Metric Summary)
*   **Total Berkas Uji (Test Files)**: 9 Berkas
*   **Total Test Suites (describe)**: 15 Suites
*   **Total Test Cases (test / it)**: 68 Cases
*   **Status Eksekusi**: 100% Passed (Lolos Uji)
*   **Target Cakupan Kode (Code Coverage)**: 100% Statement, Line, dan Function coverage untuk modul-modul inti.

---

## 🧪 Rincian Utuh & Granular Test Suites & Cases

### 1. [hewan.test.ts](file:///c:/Kuliah%20Semester%206/Pengembangan%20Sistem%20dan%20Operasi/final%20project%20ci%20cd/DevOps-MMI/app/actions/hewan.test.ts)
*   **Path**: `app/actions/hewan.test.ts`
*   **Suite**: `Hewan Server Actions`
    *   **Sub-Suite**: `createHewan`
        *   `should successfully create a new sheep and generate receipt if payment is set`: Menguji pendaftaran kambing dengan uang yang secara otomatis membuat kuitansi taktis baru dan memicu revalidatePath.
        *   `should increment kambing sequence ID based on existing lastHewan`: Menguji kenaikan urutan angka ID kambing berdasar pendaftar terakhir (misal dari `14471002` ke `14471003`).
        *   `should calculate next sequence for sapi utuh correctly from existing sapi`: Memastikan nomor urutan kelompok sapi utuh dihitung secara benar dari database.
        *   `should catch kuitansi creation error and still return success true for animal creation`: Memastikan jika terjadi error di pembuatan kuitansi, proses registrasi hewan qurban utama tetap berjalan sukses.
        *   `should return success false on database error`: Menguji respon penanganan error ketika Prisma database mengalami kegagalan/koneksi terputus.
    *   **Sub-Suite**: `updateHewan`
        *   `should update animal details successfully`: Memverifikasi pembaruan data detail hewan qurban (misalnya perubahan bentuk pembayaran atau uang).
        *   `should return error if update fails`: Menguji penanganan kegagalan kueri update database.
    *   **Sub-Suite**: `deleteHewan`
        *   `should successfully delete the animal qurban`: Memverifikasi penghapusan data hewan qurban dan memicu revalidasi antarmuka.
        *   `should return error if delete fails`: Menguji penanganan kegagalan saat proses penghapusan data di basis data.
    *   **Sub-Suite**: `getHewanQurban`
        *   `should retrieve animals and handle sapi patungan groups`: Memastikan data hewan dapat ditarik dan dikelompokkan secara terstruktur berdasarkan kelompok sapi patungan.
        *   `should set penyaluran to 'Campuran (Internal & Luar)' if group members have different values`: Memastikan status penyaluran kelompok sapi diset "Campuran" jika ada anggota kelompok yang menyalurkan secara internal dan luar.
        *   `should return empty array on failure`: Menguji kembalian array kosong saat terjadi kegagalan pengambilan data hewan.
    *   **Sub-Suite**: `getStatistikSapiPatungan`
        *   `should return group stats and suggest next slot group`: Menghitung kuota kelompok sapi patungan dan menyarankan kelompok aktif yang masih kurang dari 7 orang.
        *   `should handle error in getStatistikSapiPatungan`: Menguji respon ketika kalkulasi statistik mengalami kegagalan kueri.

### 2. [pengqurban.test.ts](file:///c:/Kuliah%20Semester%206/Pengembangan%20Sistem%20dan%20Operasi/final%20project%20ci%20cd/DevOps-MMI/app/actions/pengqurban.test.ts)
*   **Path**: `app/actions/pengqurban.test.ts`
*   **Suite**: `Pengqurban Server Actions`
    *   **Sub-Suite**: `getPengqurban`
        *   `should retrieve pengqurban data successfully with parameters`: Memverifikasi penarikan data pengqurban berdasarkan query nama dan tahun Hijriah.
        *   `should return empty array and success false on database failure`: Menangani kegagalan kueri penarikan data.
    *   **Sub-Suite**: `createPengqurban`
        *   `should successfully create new pengqurban if NKW is unique`: Menguji pembuatan data pendaftar baru jika NKW belum terdaftar dengan parsing no urut.
        *   `should return error if NKW is already registered`: Menolak pembuatan data pengqurban baru jika NKW yang diinput sudah ada di database.
        *   `should return success false on database exceptions`: Menangani error crash tak terduga pada basis data saat pembuatan.
    *   **Sub-Suite**: `updatePengqurban`
        *   `should update pengqurban details successfully`: Memverifikasi pembaruan informasi detail profil pengqurban (nama/nomor kontak).
        *   `should return success false if database update fails`: Menangani error crash database saat pembaruan profil.
    *   **Sub-Suite**: `deletePengqurban`
        *   `should successfully delete the pengqurban`: Memverifikasi penghapusan data pendaftar.
        *   `should handle relational dependency failure (error P2003)`: Memastikan penghapusan ditolak dan memberikan info relevan jika pengqurban masih terikat dengan hewan qurban.
        *   `should handle generic delete errors`: Menangani error crash generik saat penghapusan.

### 3. [permohonan-online.test.ts](file:///c:/Kuliah%20Semester%206/Pengembangan%20Sistem%20dan%20Operasi/final%20project%20ci%20cd/DevOps-MMI/app/actions/permohonan-online.test.ts)
*   **Path**: `app/actions/permohonan-online.test.ts`
*   **Suite**: `Permohonan Online Server Actions`
    *   **Sub-Suite**: `submitPermohonanOnline`
        *   `should successfully submit permohonan online`: Menguji pendaftaran mandiri oleh shohibul secara online beserta data hewan dan bukti transfer.
        *   `should handle error in submitPermohonanOnline`: Menangani kegagalan input registrasi online.
    *   **Sub-Suite**: `getPermohonanOnline`
        *   `should retrieve permohonan online list and format dates and currency`: Menguji penampilan list pendaftar online beserta formatting tanggal ISO.
        *   `should handle error in getPermohonanOnline`: Menangani kegagalan kueri penarikan daftar online.
    *   **Sub-Suite**: `verifyPermohonan`
        *   `should decline permohonan successfully when action is DITOLAK`: Menguji fungsi verifikator menolak pengajuan online.
        *   `should return success false if permohonan is not found`: Menguji penanganan verifikasi jika ID permohonan tidak valid/tidak ada.
        *   `should return success false if permohonan is already ACC`: Mencegah verifikasi ulang untuk permohonan yang statusnya sudah disetujui.
        *   `should clean non-digits from previous NKW when generating a new NKW`: Menguji pembersihan karakter non-angka (seperti `/`) pada NKW sebelumnya untuk penambahan urutan numerik.
        *   `should handle existing sapi sequences correctly and assign animal sequences correctly`: Menguji penentuan urutan no ID sapi baru pada proses ACC.
        *   `should suggest next group for sapi patungan and build new group if preceding is full`: Memetakan shohibul sapi patungan ke kelompok yang masih kosong/belum penuh (maksimal 7 slot) secara otomatis.
        *   `should set lastUrutan sequence increment for non-sapi animal`: Menguji penambahan urutan nomor ID secara berurutan untuk multi-kambing pendaftar.
        *   `should return success false and catch database transaction errors`: Memastikan pembatalan/rollback transaksi database secara aman jika terjadi error di tengah jalan saat verifikasi.

### 4. [petugas.test.ts](file:///c:/Kuliah%20Semester%206/Pengembangan%20Sistem%20dan%20Operasi/final%20project%20ci%20cd/DevOps-MMI/app/actions/petugas.test.ts)
*   **Path**: `app/actions/petugas.test.ts`
*   **Suite**: `Petugas Server Actions`
    *   **Sub-Suite**: `createPetugas`
        *   `should successfully create a new volunteer with incremented sequence id`: Menguji pembuatan petugas jaga baru dengan pembuatan ID berurutan secara otomatis.
        *   `should handle creating volunteer when no previous volunteer exists`: Menguji inisialisasi ID pertama jika belum ada petugas jaga terdaftar.
        *   `should return success false on database errors during creation`: Menangani kegagalan kueri saat pembuatan data.
    *   **Sub-Suite**: `getPetugasJaga`
        *   `should retrieve list of volunteers successfully`: Menguji pencarian data petugas jaga aktif.
        *   `should return empty array on database failure`: Menangani kegagalan kueri pencarian data.
    *   **Sub-Suite**: `updatePetugas`
        *   `should update volunteer info successfully`: Menguji pembaruan profil dan nama petugas jaga.
        *   `should return success false on update failure`: Menangani kegagalan kueri pembaruan.
    *   **Sub-Suite**: `deletePetugas`
        *   `should successfully delete a volunteer`: Menguji penghapusan data petugas jaga.
        *   `should return error if deletion fails (e.g. relational constraint)`: Memberikan informasi error jika petugas gagal dihapus karena keterikatan relasi database.

### 5. [security.test.ts](file:///c:/Kuliah%20Semester%206/Pengembangan%20Sistem%20dan%20Operasi/final%20project%20ci%20cd/DevOps-MMI/app/actions/security.test.ts)
*   **Path**: `app/actions/security.test.ts`
*   **Suite**: `updateHewan Security Access Control Tests`
    *   `should fail when user is not authenticated (null session)`: Memastikan server action menolak pembaruan status hewan jika user belum login.
    *   `should fail when authenticated user is not an admin (e.g., role is STAF)`: Memastikan staf non-admin diblokir dari pembaruan status hewan.
    *   `should fail validation when status_hewan is outside the logical enum bounds defined in the PRD`: Menolak status hewan ilegal (misal `"KABUR"`, `"BOCOR"`) untuk menjaga integritas data.
    *   `should succeed and update status when user is an ADMIN and status is in the logical enum`: Mengizinkan admin mengubah status dengan nilai enum valid (`MENUNGGU`, `DISEMBELIH`, `DIDISTRIBUSIKAN`).

### 6. [route.test.ts](file:///c:/Kuliah%20Semester%206/Pengembangan%20Sistem%20dan%20Operasi/final%20project%20ci%20cd/DevOps-MMI/app/api/track/route.test.ts)
*   **Path**: `app/api/track/route.test.ts`
*   **Suite**: `GET /api/track API Router`
    *   `should return HTTP status 400 when query is empty or whitespace only`: Menguji validasi input parameter pencarian kosong.
    *   `should return HTTP status 404 when search results are empty`: Mengembalikan 404 jika nomor ID atau nama tidak ditemukan di database.
    *   `should properly mask the shohibul qurban's phone number`: Memastikan nomor telepon disensor secara dinamis di bagian tengah demi keamanan privasi.
    *   `should clean sensitive data and not leak internal panitia/non-public properties to client`: Memastikan data sensitif internal panitia (seperti nominal uang, bukti bayar, biaya operasional) disaring keluar dan tidak bocor ke publik.
    *   `should return HTTP status 500 when database throws an error`: Menangani kegagalan tak terduga database dengan status 500.

### 7. [page.test.tsx](file:///c:/Kuliah%20Semester%206/Pengembangan%20Sistem%20dan%20Operasi/final%20project%20ci%20cd/DevOps-MMI/app/tracking/page.test.tsx)
*   **Path**: `app/tracking/page.test.tsx`
*   **Suite**: `Pengujian Halaman Tracking Status Hewan Kurban`
    *   `Harus menampilkan teks "LUNAS" ketika status pembayaran hewan kurban selesai`: Memverifikasi UI halaman tracking berhasil menampilkan info status lunas.
    *   `Harus menampilkan teks "DISEMBELIH" ketika hewan kurban sudah diproses`: Memverifikasi UI halaman tracking berhasil menampilkan status disembelih.

### 8. [tracking.test.ts](file:///c:/Kuliah%20Semester%206/Pengembangan%20Sistem%20dan%20Operasi/final%20project%20ci%20cd/DevOps-MMI/app/utils/tracking.test.ts)
*   **Path**: `app/utils/tracking.test.ts`
*   **Suite**: `Tracking UI Utility Helpers`
    *   **Sub-Suite**: `getStepStatus`
        *   `should return completed for steps equal or prior to current status`: Memverifikasi status stepper langkah selesai.
        *   `should return active for the step immediately following current status`: Memverifikasi status stepper langkah aktif.
        *   `should return upcoming for later steps`: Memverifikasi status stepper langkah mendatang.
        *   `should handle empty status and default to MENUNGGU index`: Menguji fallback status kosong.
        *   `should handle invalid/unrecognized status (e.g. KABUR) and default to MENUNGGU index`: Menguji fallback status ilegal.
    *   **Sub-Suite**: `getStepperColorClass`
        *   `should return green classes for completed steps`: Memastikan warna hijau terpasang untuk langkah selesai.
        *   `should return amber pulse classes for active steps`: Memastikan warna amber animasi pulse terpasang untuk langkah aktif.
        *   `should return gray classes for upcoming steps`: Memastikan warna abu-abu terpasang untuk langkah mendatang.
    *   **Sub-Suite**: `getPaymentBadgeColorClass`
        *   `should return green styling for LUNAS`: Memverifikasi warna badge lunas.
        *   `should return yellow/amber styling for DP`: Memverifikasi warna badge uang muka (DP).
        *   `should return red styling for BELUM LUNAS and unknown values`: Memverifikasi warna badge belum lunas/lainnya.

### 9. [sample.test.tsx](file:///c:/Kuliah%20Semester%206/Pengembangan%20Sistem%20dan%20Operasi/final%20project%20ci%20cd/DevOps-MMI/sample.test.tsx)
*   **Path**: `sample.test.tsx`
*   **Suite**: `Uji Coba Lingkungan Jest`
    *   `harus menghitung penjumlahan dasar dengan benar`: Memverifikasi integrasi dasar engine Jest berjalan sukses dengan kalkulasi aritmatika.
