import { getHewanQurban } from "@/app/actions/hewan";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

export default async function HewanPage() {
  const response = await getHewanQurban();
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
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari jenis hewan atau nama shohibul..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mmi/20 focus:border-mmi text-sm transition-all"
            />
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">No</th>
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
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                    Belum ada data hewan qurban.
                  </td>
                </tr>
              ) : (
                hewans.map((item, index) => (
                  <tr key={item.id_hewan} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">
                      {(() => {
                        // Kacamata Penerjemah Kode Access
                        let label = item.jenis_qurban;
                        const colorClass = "bg-gray-50 text-gray-600"; // kalau nanti mau kasih warna beda per jenis, tinggal ganti ini aja pake "let"

                        if (item.jenis_qurban === "1" || item.jenis_qurban.toLowerCase() === "kambing") {
                          label = "🐐 Kambing";
                        //   colorClass = "bg-orange-50 text-orange-600";
                        } else if (item.jenis_qurban === "2" || item.jenis_qurban.toLowerCase() === "sapi") {
                          label = "🐄 Sapi";
                        //   colorClass = "bg-blue-50 text-blue-600";
                        } else if (item.jenis_qurban === "3") {
                          label = "🐄 Sapi (Patungan)";
                        //   colorClass = "bg-purple-50 text-purple-600"; // Kita kasih warna ungu buat patungan!
                        }

                        return (
                          <span className={`px-3 py-1.5 rounded-full font-bold text-xs ${colorClass}`}>
                            {label}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 font-bold text-admin-text truncate max-w-[250px]">
                      {item.pengqurban?.nama_lengkap || "Tanpa Nama"}
                    </td>
                    <td className="px-6 py-4">{item.bentuk || "-"}</td>
                    <td className="px-6 py-4 truncate max-w-[200px]">{item.penyaluran || "Internal MMI"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 gap-4">
          <p>Menampilkan 1 hingga {hewans.length > 10 ? 10 : hewans.length} dari {hewans.length} data</p>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors" disabled>Prev</button>
            <button className="px-3 py-1.5 bg-mmi text-white rounded-lg font-medium shadow-sm shadow-mmi/20">1</button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors" disabled>Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}