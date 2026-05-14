import { Suspense } from "react";
import { getKuitansi } from "@/app/actions/kuitansi";
import { Loader2 } from "lucide-react";
import SearchBar from "@/components/admin/SearchBar";
import FormKuitansiDrawer from "@/components/admin/FormKuitansiDrawer";
import KuitansiActionButtons from "@/components/admin/KuitansiActionButtons";

// ==========================================
// KOMPONEN ANAK: TABEL DINAMIS (ASYNC)
// ==========================================
async function KuitansiTableList({ query, year }: { query: string; year: string }) {
  const response = await getKuitansi(query, year);
  const kuitansiList = response.data || []; 

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">No Kuitansi</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Penanggung Jawab</th>
              <th className="px-6 py-4">Item Uraian</th>
              <th className="px-6 py-4 text-right">Total Debit</th>
              <th className="px-6 py-4 text-right">Total Kredit</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {kuitansiList.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-medium">
                  {query ? `Pencarian "${query}" tidak ditemukan.` : "Belum ada data kuitansi."}
                </td>
              </tr>
            ) : (
              kuitansiList.map((item: any) => {
                // ✨ BUG FIX: Pake fallback array kosong biar aplikasi ngga crash kalo detailnya kosong
                const detailItems = item.detail_kuitansi || [];
                const totalDebit = detailItems.reduce((sum: number, det: any) => sum + Number(det.debit || 0), 0);
                const totalKredit = detailItems.reduce((sum: number, det: any) => sum + Number(det.kredit || 0), 0);

                return (
                  <tr key={item.id_kuitansi} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-blue-600 bg-blue-50 rounded-md my-4 inline-block px-2 border border-blue-100">
                      {item.no_kw}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-bold text-admin-text">
                      {item.penanggung_jawab}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">{detailItems.length} Item</span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                      Rp {totalDebit.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-red-600">
                      Rp {totalKredit.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <KuitansiActionButtons data={JSON.parse(JSON.stringify(item))} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <p>Total {kuitansiList.length} kuitansi tercatat.</p>
      </div>
    </>
  );
}

// ==========================================
// KOMPONEN INDUK: UI UTAMA (INSTAN)
// ==========================================
export default async function KuitansiPage(props: { searchParams: Promise<{ q?: string, year?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";
  const year = searchParams.year || "Semua";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Data Kuitansi Taktis</h1>
          <p className="text-sm text-gray-500">Pencatatan rincian pemasukan dan pengeluaran kegiatan</p>
        </div>
        <FormKuitansiDrawer />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex gap-4">
          <SearchBar placeholder="Cari No KW atau Penanggung Jawab..." />
        </div>

        {/* BUNGKUSAN SUSPENSE */}
        <Suspense fallback={
          <div className="p-16 flex flex-col items-center justify-center text-blue-500">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="font-medium text-gray-500 animate-pulse">Menghitung rekap kuitansi...</p>
          </div>
        }>
          <KuitansiTableList query={query} year={year} />
        </Suspense>
      </div>
    </div>
  );
}