import { Suspense } from "react";
import { getSetoran } from "@/app/actions/setoran";
import { getPetugasJaga } from "@/app/actions/petugas"; 
import { Loader2 } from "lucide-react";
import SearchBar from "@/components/admin/SearchBar";
import FormSetoranDrawer from "@/components/admin/FormSetoranDrawer";
import SetoranActionButtons from "@/components/admin/SetoranActionButtons";

// ==========================================
// KOMPONEN ANAK: TABEL DINAMIS (ASYNC)
// ==========================================
async function SetoranTableList({ query, year, petugasList }: { query: string; year: string; petugasList: any[] }) {
  const response = await getSetoran(query, year);
  const setoranList = response.data || [];

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">ID Setoran</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Petugas Penerima</th>
              <th className="px-6 py-4">Nama Penyetor</th>
              <th className="px-6 py-4 text-right">Nominal (Rp)</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {setoranList.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                  {query ? `Pencarian "${query}" tidak ditemukan.` : "Belum ada data setoran."}
                </td>
              </tr>
            ) : (
              setoranList.map((item) => (
                <tr key={item.id_setor} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-orange-600 bg-orange-50 rounded-md my-4 inline-block px-2 border border-orange-100">
                    {item.id_lama}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 font-medium text-blue-600">
                    {item.petugas?.nama || item.id_petugas}
                  </td>
                  <td className="px-6 py-4 font-bold text-admin-text">
                    {item.nama}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-600">
                    {Number(item.jml_setor).toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <SetoranActionButtons data={JSON.parse(JSON.stringify(item))} petugasList={petugasList} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <p>Total {setoranList.length} riwayat setoran uang.</p>
      </div>
    </>
  );
}

// ==========================================
// KOMPONEN INDUK: UI UTAMA (INSTAN)
// ==========================================
export default async function SetoranPage(props: { searchParams: Promise<{ q?: string, year?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";
  const year = searchParams.year || "Semua";

  // Kita tarik data petugas di komponen induk biar bisa dipassing ke Laci Form dan Tabel
  const resPetugas = await getPetugasJaga(); 
  const petugasList = resPetugas.data || []; 

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Data Setoran Qurban</h1>
          <p className="text-sm text-gray-500">Pencatatan uang masuk dari shohibul qurban lewat petugas</p>
        </div>
        <FormSetoranDrawer petugasList={petugasList} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex gap-4">
          <SearchBar placeholder="Cari ID Setor, nama penyetor, atau nama petugas..." />
        </div>

        {/* BUNGKUSAN SUSPENSE */}
        <Suspense fallback={
          <div className="p-16 flex flex-col items-center justify-center text-orange-500">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="font-medium text-gray-500 animate-pulse">Menghitung rekap setoran...</p>
          </div>
        }>
          <SetoranTableList query={query} year={year} petugasList={petugasList} />
        </Suspense>

      </div>
    </div>
  );
}