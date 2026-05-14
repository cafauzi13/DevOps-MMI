import { Suspense } from "react";
import { getPengqurban } from "@/app/actions/pengqurban";
import { Loader2 } from "lucide-react";
import SearchBar from "@/components/admin/SearchBar";
import FormPengqurbanDrawer from "@/components/admin/FormPengqurbanDrawer";
import PengqurbanActionButtons from "@/components/admin/PengqurbanActionButtons";

// ==========================================
// KOMPONEN ANAK: TABEL DINAMIS (ASYNC)
// ==========================================
async function PengqurbanTableList({ query, year }: { query: string; year: string }) {
  const response = await getPengqurban(query, year);
  const pengqurbans = response.data || [];

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">No</th>
              <th className="px-6 py-4">NKW</th>
              <th className="px-6 py-4">Nama Lengkap</th>
              <th className="px-6 py-4">Alamat</th>
              <th className="px-6 py-4 text-center">Hewan Qurban</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {pengqurbans.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                  {query ? `Pencarian "${query}" tidak ditemukan.` : "Belum ada data pengqurban."}
                </td>
              </tr>
            ) : (
              pengqurbans.map((item, index) => (
                <tr key={item.id_pengqurban} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500 bg-gray-100/50 rounded-md my-4 inline-block ml-6 px-2">{item.nkw}</td>
                  <td className="px-6 py-4 font-bold text-admin-text">
                    {item.nama_lengkap}
                  </td>
                  <td className="px-6 py-4 truncate max-w-[200px]">{item.alamat || "-"}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-bold text-xs border border-emerald-100">
                      {item.hewan_qurban?.length || 0} Ekor
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <PengqurbanActionButtons data={JSON.parse(JSON.stringify(item))} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 gap-4">
        <p>Total {pengqurbans.length} data pengqurban terdaftar.</p>
      </div>
    </>
  );
}

// ==========================================
// KOMPONEN INDUK: UI UTAMA (INSTAN)
// ==========================================
export default async function PengqurbanPage(props: { searchParams: Promise<{ q?: string, year?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";
  const year = searchParams.year || "Semua";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Data Pengqurban</h1>
          <p className="text-sm text-gray-500">Kelola daftar shohibul qurban Masjid Manarul Ilmi</p>
        </div>
        <FormPengqurbanDrawer />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Pake SearchBar rakitan kita biar seragam sama menu lain */}
        <div className="p-5 border-b border-gray-100 flex gap-4">
           <SearchBar placeholder="Cari nama shohibul atau NKW..." />
        </div>

        {/* BUNGKUSAN SUSPENSE */}
        <Suspense fallback={
          <div className="p-16 flex flex-col items-center justify-center text-emerald-500">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="font-medium text-gray-500 animate-pulse">Menarik data shohibul qurban...</p>
          </div>
        }>
          <PengqurbanTableList query={query} year={year} />
        </Suspense>

      </div>
    </div>
  );
}