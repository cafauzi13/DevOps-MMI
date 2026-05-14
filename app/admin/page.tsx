import { Suspense } from "react";
import { getPengqurban } from "@/app/actions/pengqurban";
import { getHewanQurban } from "@/app/actions/hewan";
import { Users, Activity, TrendingUp, HeartHandshake, Loader2 } from "lucide-react";

// ==========================================
// KOMPONEN ANAK: STATISTIK & ACTIVITY (ASYNC)
// ==========================================
async function DashboardDataList({ year }: { year: string }) {
  // 1. Narik Data
  const resPengqurban = await getPengqurban("", year);
  const resHewan = await getHewanQurban("", year);

  const pengqurbans = resPengqurban.data || [];
  const hewans = resHewan.data || [];

  // 2. Olah datanya buat dapetin statistik
  const totalPengqurban = pengqurbans.length;
  
  const sapiUtuh = hewans.filter(h => 
    h.jenis_qurban === "2" || h.jenis_qurban.toLowerCase() === "sapi"
  ).length;
  
  const orangPatungan = hewans.filter(h => h.jenis_qurban === "3").length;
  const sapiDariPatungan = Math.floor(orangPatungan / 7);
  const sisaOrangPatungan = orangPatungan % 7; 
  const totalSapi = sapiUtuh + sapiDariPatungan;
  
  const totalKambing = hewans.filter(h => 
    h.jenis_qurban === "1" || h.jenis_qurban.toLowerCase() === "kambing"
  ).length;

  const recentPengqurban = pengqurbans.slice(0, 5);

  return (
    <>
      {/* === STATISTIC CARDS === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Shohibul Qurban */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 mb-1">Total Shohibul Qurban</p>
            <h3 className="text-3xl font-extrabold text-admin-text">{totalPengqurban} <span className="text-sm font-medium text-gray-400">Orang</span></h3>
          </div>
        </div>

        {/* Card 2: Total Sapi */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-mmi-light text-mmi flex items-center justify-center shrink-0 text-2xl">
            🐄
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 mb-1">Total Sapi Terkumpul</p>
            <h3 className="text-3xl font-extrabold text-admin-text">
              {totalSapi} <span className="text-sm font-medium text-gray-400">Ekor</span>
            </h3>
            {sisaOrangPatungan > 0 && (
              <p className="text-[11px] text-orange-500 font-bold mt-1 bg-orange-50 inline-block px-2 py-0.5 rounded">
                + {sisaOrangPatungan} orang (belum genap)
              </p>
            )}
          </div>
        </div>

        {/* Card 3: Total Kambing */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 text-2xl">
            🐐
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 mb-1">Total Kambing Terkumpul</p>
            <h3 className="text-3xl font-extrabold text-admin-text">{totalKambing} <span className="text-sm font-medium text-gray-400">Ekor</span></h3>
          </div>
        </div>
      </div>

      {/* === RECENT ACTIVITY SECTION === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kiri: List Pendaftar Terbaru */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-admin-text flex items-center gap-2">
              <Activity className="text-mmi" size={20} />
              Pendaftar Terbaru
            </h2>
            <a href="/admin/pengqurban" className="text-sm font-bold text-mmi hover:underline">Lihat Semua &rarr;</a>
          </div>
          
          <div className="space-y-4">
            {recentPengqurban.map((pq, idx) => (
              <div key={pq.id_pengqurban} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-mmi/10 text-mmi flex items-center justify-center font-bold text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-admin-text">
                      {pq.nama_lengkap || "Tanpa Nama"}
                    </h4>
                    <p className="text-xs font-medium text-gray-500 mt-0.5 font-mono">NKW: {pq.nkw}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-3 py-1 rounded-lg text-xs font-bold text-gray-600 shadow-sm">
                    <HeartHandshake size={14} className="text-mmi" />
                    {pq.hewan_qurban?.length || 0} Hewan
                  </span>
                </div>
              </div>
            ))}
            {recentPengqurban.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm font-medium">
                Belum ada pendaftar di tahun ini.
              </div>
            )}
          </div>
        </div>

        {/* Kanan: Quick Tips / Info */}
        <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-admin-text flex items-center gap-2 mb-6">
            <TrendingUp className="text-orange-500" size={20} />
            Info Cepat
          </h2>
          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-4xl mb-2">
              🚀
            </div>
            <h3 className="font-bold text-admin-text">Sistem Siap Digunakan!</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Data pendaftar dan hewan sudah terhubung langsung ke database Supabase. Semua perubahan akan otomatis ter-update di sini.
            </p>
          </div>
        </div>

      </div>
    </>
  );
}


// ==========================================
// KOMPONEN INDUK: UI UTAMA (INSTAN)
// ==========================================
export default async function AdminDashboardPage(props: { searchParams: Promise<{ year?: string }> }) {
  const searchParams = await props.searchParams;
  const year = searchParams.year || "Semua";

  return (
    <div className="space-y-8">
      {/* === HEADER GREETINGS (MUNCUL INSTAN) === */}
      <div className="bg-gradient-to-r from-mmi to-mmi-hover rounded-3xl p-8 sm:p-10 text-white shadow-lg shadow-mmi/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
            Ahlan wa Sahlan! ✨
          </h1>
          <p className="text-white/90 text-lg max-w-xl font-medium leading-relaxed">
            Pantau progres penerimaan hewan qurban Masjid Manarul Ilmi secara real-time. Semoga lelah panitia Qurban menjadi lillah!
          </p>
        </div>
      </div>

      {/* BUNGKUSAN SUSPENSE BUAT STATISTIK */}
      <Suspense fallback={
        <div className="p-20 flex flex-col items-center justify-center text-mmi">
          <Loader2 size={48} className="animate-spin mb-4" />
          <p className="font-bold text-lg text-gray-500 animate-pulse">Menghitung statistik qurban...</p>
        </div>
      }>
        <DashboardDataList year={year} />
      </Suspense>

    </div>
  );
}