# 🛠️ PANDUAN INSTALASI & STANDARISASI LOKAL (LOCAL SETUP GUIDE)
### *Masjid Manarul Ilmi ITS - Qurban MMI*

Panduan ini disusun untuk memastikan standardisasi lingkungan pengembangan lokal bagi seluruh anggota tim pengembang DevOps Qurban MMI.

---

## 💻 1. Standardisasi Perangkat Lunak (Tools Requirement)

Pastikan perangkat Anda menggunakan versi perkakas berikut demi menjaga kompatibilitas Docker dan runtime di Azure:

*   **Node.js**: **Versi v24.x** (Versi LTS terbaru direkomendasikan).
*   **Git**: Versi 2.40+ (untuk mendukung hook Husky & pre-commit).
*   **Docker**: Docker Desktop (untuk pengemasan container lokal).
*   **Azure CLI**: Versi 2.45+ (untuk konfigurasi slot deployment & auto-swap).

---

## ⚙️ 2. Langkah Instalasi Mandiri

Ikuti urutan instalasi berikut dari direktori utama proyek:

### Langkah A: Instal Dependensi Node
Pasang seluruh pustaka dependensi proyek menggunakan npm:
```bash
npm install
```

### Langkah B: Bangun Prisma Client
Generate kembali artefak Prisma Client agar kueri basis data sinkron dengan skema ORM:
```bash
npx prisma generate
```

### Langkah C: Konfigurasi Variabel Lingkungan (`.env`)
Buat berkas bernama `.env` di direktori utama dan isikan konfigurasi minimum berikut:
```env
# Koneksi Prisma ke Supabase (Transaction Mode port 6543)
DATABASE_URL="postgresql://postgres.azfzd...:password@aws-1-ap...pooler.supabase.com:6543/postgres?pgbouncer=true"

# Koneksi langsung (Session Mode port 5432) untuk keperluan Migrasi
DIRECT_URL="postgresql://postgres.azfzd...:password@aws-1-ap...pooler.supabase.com:5432/postgres"

# Konfigurasi NextAuth & Port
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="pso-ci-cd-azure-website-mmi-local"
WEBSITES_PORT=3000
```

---

## 🧪 3. Mengatasi Isu Uji Coba (`npm test` Blank / Gagal)

Jika Anda atau anggota tim mengalami kegagalan ketika menjalankan pengetesan (misalnya layar pengujian terhenti, blank, atau tidak ada test suite yang berjalan), jalankan urutan pemulihan taktis berikut secara berurutan:

1. **Bersihkan & Instal Ulang Dependensi**:
   ```bash
   npm install
   ```
2. **Paksa Inisialisasi Database ORM**:
   ```bash
   npx prisma generate
   ```
3. **Konfigurasikan Berkas `.env` Lokal**:
   Pastikan variabel `DATABASE_URL` dan `NEXTAUTH_SECRET` sudah terisi dengan benar (seperti pada bagian 2 di atas).
4. **Jalankan Uji Coba dengan Coverage**:
   Picu mesin uji otomatis menggunakan perintah pengujian di bawah ini untuk memverifikasi cakupan kode (*code coverage*):
   ```bash
   npm test -- --coverage
   ```
   *(Vitest/Jest akan langsung menjalankan seluruh suite pengujian dan merender tabel cakupan kode secara rinci di terminal).*
