import { Suspense } from "react";
import { getPermohonan } from "@/app/actions/permohonan";
import { Loader2 } from "lucide-react";
import SearchBar from "@/components/admin/SearchBar";
import FormPermohonanDrawer from "@/components/admin/FormPermohonanDrawer";
import PermohonanActionButtons from "@/components/admin/PermohonanActionButtons";

// ==========================================
// KOMPONEN ANAK: TABEL DINAMIS (ASYNC)
// ==========================================
async function PermohonanTableList({ query, year }: { query: string; year: string }) {
  const response = await getPermohonan(query, year);
  const permohonans = response.data || [];

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">No</th>
              <th className="px-6 py-4">ID Surat</th>
              <th className="px-6 py-4">Tanggal Masuk</th>
              <th className="px-6 py-4">Nama Instansi / Pemohon</th>
              <th className="px-6 py-4">Penanggung Jawab</th>
              <th className="px-6 py-4">Kota</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {permohonans.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-medium">
                  {query ? `Pencarian "${query}" tidak ditemukan.` : "Belum ada data permohonan."}
                </td>
              </tr>
            ) : (
              permohonans.map((item, index) => (
                <tr key={item.id_permohonan} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-mono text-xs text-orange-600 bg-orange-50 rounded-md my-4 inline-block px-2 border border-orange-100">
                    {item.no_id_surat}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 font-bold text-admin-text truncate max-w-[250px]">
                    {item.nama_pemohon}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span>{item.penanggung_jawab || "-"}</span>
                      {item.no_kontak && <span className="text-xs text-gray-400">{item.no_kontak}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">{item.kota_pemohon || "-"}</td>
                  <td className="px-6 py-4">
                    <PermohonanActionButtons data={JSON.parse(JSON.stringify(item))} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <p>Total {permohonans.length} data permohonan instansi terdaftar.</p>
      </div>
    </>
  );
}

// ==========================================
// KOMPONEN INDUK: UI UTAMA (INSTAN)
// ==========================================
export default async function PermohonanPage(props: { searchParams: Promise<{ q?: string, year?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";
  const year = searchParams.year || "Semua";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Data Permohonan Instansi</h1>
          <p className="text-sm text-gray-500">Kelola daftar proposal permintaan hewan dari panti, yayasan, dll.</p>
        </div>
        <FormPermohonanDrawer />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div className="p-5 border-b border-gray-100 flex gap-4">
          <SearchBar placeholder="Cari nama instansi atau No ID Surat..." />
        </div>

        {/* BUNGKUSAN SUSPENSE */}
        <Suspense fallback={
          <div className="p-16 flex flex-col items-center justify-center text-orange-500">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="font-medium text-gray-500 animate-pulse">Menyiapkan daftar permohonan...</p>
          </div>
        }>
          <PermohonanTableList query={query} year={year} />
        </Suspense>

      </div>
    </div>
  );
}