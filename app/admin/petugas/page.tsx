import { Suspense } from "react";
import { getPetugasJaga } from "@/app/actions/petugas";
import { Loader2 } from "lucide-react";
import SearchBar from "@/components/admin/SearchBar";
import FormPetugasDrawer from "@/components/admin/FormPetugasDrawer";
import PetugasActionButtons from "@/components/admin/PetugasActionButtons";

// ==========================================
// KOMPONEN ANAK: TABEL DINAMIS (ASYNC)
// ==========================================
async function PetugasTableList({ query, year }: { query: string; year: string }) {
  const response = await getPetugasJaga(query, year);
  const petugas = response.data || [];

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 w-16">No</th>
              <th className="px-6 py-4 w-32">ID Petugas</th>
              <th className="px-6 py-4">Nama Lengkap</th>
              <th className="px-6 py-4">No. HP</th>
              <th className="px-6 py-4 text-center w-32">Aksi</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {petugas.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                  {query ? `Pencarian "${query}" tidak ditemukan.` : "Belum ada data petugas terdaftar."}
                </td>
              </tr>
            ) : (
              petugas.map((item, index) => (
                <tr key={item.id_petugas} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-mono text-xs text-blue-600 bg-blue-50 rounded-md my-4 inline-block px-2 border border-blue-100">
                    {item.id_lama}
                  </td>
                  <td className="px-6 py-4 font-bold text-admin-text">
                    {item.nama}
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {item.no_hp || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <PetugasActionButtons data={JSON.parse(JSON.stringify(item))} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <p>Total {petugas.length} data petugas jaga terdaftar.</p>
      </div>
    </>
  );
}

// ==========================================
// KOMPONEN INDUK: UI UTAMA (INSTAN)
// ==========================================
export default async function PetugasPage(props: { searchParams: Promise<{ q?: string, year?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";
  const year = searchParams.year || "Semua";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Data Petugas Jaga</h1>
          <p className="text-sm text-gray-500">Kelola daftar panitia yang bertugas menerima qurban</p>
        </div>
        <FormPetugasDrawer />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div className="p-5 border-b border-gray-100 flex gap-4">
          <SearchBar placeholder="Cari nama petugas atau ID..." />
        </div>

        {/* BUNGKUSAN SUSPENSE */}
        <Suspense fallback={
          <div className="p-16 flex flex-col items-center justify-center text-blue-500">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="font-medium text-gray-500 animate-pulse">Memuat daftar petugas...</p>
          </div>
        }>
          <PetugasTableList query={query} year={year} />
        </Suspense>

      </div>
    </div>
  );
}