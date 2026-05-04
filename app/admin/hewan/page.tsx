import { getHewanQurban } from "@/app/actions/hewan";
import { Plus } from "lucide-react";
import SearchBar from "@/components/admin/SearchBar";
import HewanActionButtons from "@/components/admin/HewanActionButtons";

// 🚀 Tangkap 'searchParams' dari URL biar fitur Search-nya jalan!
export default async function PengqurbanPage(props: { searchParams: Promise<{ q?: string; year?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";
  
  // Masukin query-nya ke mesin!
  const year = searchParams.year || "Semua"; 
  const response = await getHewanQurban(query, year);
  const hewans = response.data || [];

  return (
    <div className="space-y-6">
      {/* === HEADER SECTION === */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Data Hewan Qurban</h1>
          <p className="text-sm text-gray-500">Pantau detail hewan (Sapi/Kambing) dari shohibul qurban</p>
        </div>
        <button className="bg-mmi hover:bg-mmi-hover text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm">
          <Plus size={18} />
          Tambah Hewan
        </button>
      </div>

      {/* === TABLE CARD SECTION === */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex gap-4">
          {/* Panggil SearchBar Component kita di sini! */}
          <SearchBar placeholder="Cari No ID, kelompok, atau nama shohibul..." />
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">ID Hewan</th>
                <th className="px-6 py-4">Jenis</th>
                <th className="px-6 py-4">Atas Nama (Shohibul)</th>
                <th className="px-6 py-4">Bentuk</th>
                <th className="px-6 py-4">Penyaluran</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {hewans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-medium">
                    {query ? `Tidak ada hewan yang cocok dengan pencarian "${query}"` : "Belum ada data hewan qurban."}
                  </td>
                </tr>
              ) : (
                hewans.map((item, index) => (
                  <tr key={item.id_hewan} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">{index + 1}</td>
                    
                    {/* Tambahan Kolom ID Biar Gampang Nyarinya */}
                    <td className="px-6 py-4 align-middle">
                      <span className="font-mono text-xs text-emerald-600 bg-emerald-50 rounded-md px-2 py-1 border border-emerald-100 inline-block">
                        {item.no_id_lama || "-"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {(() => {
                        let label = item.jenis_qurban;
                        const colorClass = "bg-gray-50 text-gray-600"; 
                        if (item.jenis_qurban === "1" || item.jenis_qurban.toLowerCase() === "kambing") label = "🐐 Kambing";
                        else if (item.jenis_qurban === "2" || item.jenis_qurban.toLowerCase() === "sapi") label = "🐄 Sapi";
                        else if (item.jenis_qurban === "3") label = "🐄 Sapi (Patungan)";
                        
                        return <span className={`px-3 py-1.5 rounded-full font-bold text-xs ${colorClass}`}>{label}</span>;
                      })()}
                    </td>
                    {/* KOLOM ATAS NAMA (SHOHIBUL) */}
                    <td className="px-6 py-4 text-admin-text align-middle">
                      {item.isGroup ? (
                        <div className="flex flex-col gap-1.5 py-1">
                          <span 
                            className={`font-bold text-sm px-3 py-1 rounded-md w-fit border ${
                              item.members?.length >= 7 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' // Hijau kalau udah 7 orang
                                : 'bg-orange-50 text-orange-700 border-orange-100'    // Oranye kalau kurang
                            }`}
                          >
                            Sapi Patungan Kelompok {item.kel_sapi}: {item.members?.length >= 7 ? '(Lengkap ✅)' : `(Kurang ${7 - item.members?.length})`}
                          </span>
                          <ul className="text-xs text-gray-600 space-y-1 pl-1 mt-1">
                            {item.members?.map((member: any, i: number) => (
                              <li key={member.id_hewan} className="flex items-start gap-1.5">
                                <span className="font-medium text-gray-400">{i + 1}.</span> 
                                <span className="font-bold truncate max-w-[220px]">{member.pengqurban?.nama_lengkap || "Tanpa Nama"}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="font-bold truncate max-w-[250px]">
                          {item.pengqurban?.nama_lengkap || "Tanpa Nama"}
                          {item.kel_sapi && <span className="ml-2 text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full uppercase">{item.kel_sapi}</span>}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-500">{item.bentuk || "-"}</td>
                    <td className="px-6 py-4 truncate max-w-[200px]">{item.penyaluran || "INTERNAL MMI"}</td>
                    <td className="px-6 py-4">
                      
                      {/* 🚀 PANGGIL KOMPONEN TOMBOL AKSI KITA! */}
                      <HewanActionButtons data={JSON.parse(JSON.stringify(item))} />

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 gap-4">
          <p>Menampilkan {hewans.length} data</p>
        </div>

      </div>
    </div>
  );
}