import { getKuitansi } from "@/app/actions/kuitansi";
import SearchBar from "@/components/admin/SearchBar";
import FormKuitansiDrawer from "@/components/admin/FormKuitansiDrawer";
import KuitansiActionButtons from "@/components/admin/KuitansiActionButtons";

export default async function KuitansiPage(props: { searchParams: Promise<{ q?: string, year?: string }> }) {
  // 1. Nangkep sinyal dari URL
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";
  const year = searchParams.year || "Semua";

  // 2. Lempar ke backend
  const response = await getKuitansi(query, year);
  const kuitansiList = response.data || []; // ✨ INI OBATNYA (Ganti jadi kuitansiList)

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Data Kuitansi Taktis</h1>
          <p className="text-sm text-gray-500">Pencatatan rincian pemasukan dan pengeluaran kegiatan</p>
        </div>
        <FormKuitansiDrawer />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex gap-4">
          <SearchBar placeholder="Cari No KW atau Penanggung Jawab..." />
        </div>

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
                  // Hitung total dari detailnya biar cakep di tabel
                  const totalDebit = item.detail_kuitansi.reduce((sum: number, det: any) => sum + Number(det.debit), 0);
                  const totalKredit = item.detail_kuitansi.reduce((sum: number, det: any) => sum + Number(det.kredit), 0);

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
                        {/* Tampilin jumlah item barangnya */}
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">{item.detail_kuitansi.length} Item</span>
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
      </div>
    </div>
  );
}