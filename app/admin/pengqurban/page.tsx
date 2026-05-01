import { getPengqurban } from "@/app/actions/pengqurban";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import FormPengqurbanDrawer from "@/components/admin/FormPengqurbanDrawer";
import PengqurbanActionButtons from "@/components/admin/PengqurbanActionButtons";

// Perhatikan ada kata "async" di sini karena kita mau narik data dari database!
export default async function PengqurbanPage() {
  // Panggil fungsi sakti backend kita
  const response = await getPengqurban();
  const pengqurbans = response.data || [];

  return (
    <div className="space-y-6">
      {/* === HEADER SECTION === */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-admin-text">Data Pengqurban</h1>
          <p className="text-sm text-gray-500">Kelola daftar shohibul qurban RDK 47</p>
        </div>
        
        {/* Panggil komponen Drawer kita di sini! */}
        <FormPengqurbanDrawer />
      </div>

      {/* === TABLE CARD SECTION === */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Toolbar (Search & Filter) */}
        <div className="p-5 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama atau NKW..." 
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
                    Belum ada data pengqurban.
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
                      <span className="bg-mmi-light text-mmi px-3 py-1.5 rounded-full font-bold text-xs">
                        {item.hewan_qurban?.length || 0} Ekor
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <PengqurbanActionButtons nkw={item.nkw} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy (Kita hidupin di Task selanjutnya) */}
        <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 gap-4">
          <p>Menampilkan 1 hingga {pengqurbans.length > 10 ? 10 : pengqurbans.length} dari {pengqurbans.length} data</p>
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