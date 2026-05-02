"use client";

import { useState } from "react";
import { Trash2, Edit, AlertTriangle, Loader2, X, Save, Eye, MapPin, Hash, User, ChevronDown } from "lucide-react";
import { deleteHewan, updateHewan } from "@/app/actions/hewan";
import toast from "react-hot-toast";

export default function HewanActionButtons({ data }: { data: any }) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State Form Lengkap (Diambil dari database biar langsung keisi)
  const [hwn, setHwn] = useState({
    bentuk: data.bentuk || "UANG",
    uang: data.uang?.toString() || "",
    penyembelihan: data.penyembelihan || "",
    melihat: data.melihat ? "YA" : "TIDAK",
    menyembelih: data.menyembelih ? "YA" : "TIDAK",
    jml_bagian: data.jml_bagian?.toString() || "",
    pembagian: data.pembagian || "",
    pesan_bagian: data.pesan_bagian || "",
    kel_sapi: data.kel_sapi || "",
    no_uq: data.no_uq || "",
    penyaluran: data.penyaluran || "DALAM",
    lokasi: data.lokasi || "",
    keterangan: data.keterangan || "",
    penerima: data.penerima || "",
    petugas: data.petugas || "",
    sebab: data.sebab || "",
  });

  const handleChange = (e: any) => setHwn({ ...hwn, [e.target.name]: e.target.value.toUpperCase() });

  const executeUpdate = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading("Memperbarui data hewan...");
    const res = await updateHewan(data.id_hewan, hwn);
    if (res.success) {
      toast.success(res.message, { id: toastId });
      setIsEditOpen(false);
    } else {
      toast.error(res.message, { id: toastId });
    }
    setIsSubmitting(false);
  };

  const executeDelete = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading("Menghapus hewan...");
    const res = await deleteHewan(data.id_hewan);
    if (res.success) {
      toast.success(res.message, { id: toastId });
      setIsDeleteOpen(false);
    } else {
      toast.error(res.message, { id: toastId });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <button onClick={() => setIsDetailOpen(true)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Lihat Detail">
          <Eye size={16} />
        </button>
        <button onClick={() => setIsEditOpen(true)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Data Lengkap">
          <Edit size={16} />
        </button>
        <button onClick={() => setIsDeleteOpen(true)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Hewan">
          <Trash2 size={16} />
        </button>
      </div>

      {/* 🟢 MODAL KONFIRMASI DELETE YANG UDAH DI-FIX (GAK NEMBUS PAGAR LAGI 😂) */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isSubmitting && setIsDeleteOpen(false)} />
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden z-10 animate-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><AlertTriangle size={32} /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Hewan?</h3>
            <p className="text-sm text-gray-500 mb-6 px-2 break-words whitespace-normal leading-relaxed">
              Yakin mau hapus data hewan ID <span className="font-bold text-gray-800">{data.no_id_lama}</span> milik <span className="font-bold text-gray-800">{data.pengqurban?.nama_lengkap}</span>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteOpen(false)} disabled={isSubmitting} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Batal</button>
              <button onClick={executeDelete} disabled={isSubmitting} className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 flex justify-center items-center">
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔵 DRAWER LIHAT DETAIL (BIARIN AJA SAMA KAYAK KEMARIN) */}
      {isDetailOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] animate-in fade-in" onClick={() => setIsDetailOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-6 py-6 border-b border-gray-100 flex justify-between items-center bg-emerald-50/50">
              <div>
                <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2"><Eye size={20} className="text-emerald-500"/> Detail Hewan</h3>
                <p className="text-sm font-mono text-emerald-600 mt-1">ID: {data.no_id_lama}</p>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                <div className="flex items-center gap-3"><User size={16} className="text-gray-400"/><span className="text-sm font-bold text-gray-700">{data.pengqurban?.nama_lengkap || "-"}</span></div>
                <div className="flex items-center gap-3"><Hash size={16} className="text-gray-400"/><span className="text-sm font-medium text-gray-600">NKW: {data.nkw_pengqurban}</span></div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider">Informasi Qurban</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">Jenis</p><p className="font-bold text-sm">{data.jenis_qurban === "1" ? "Kambing 🐐" : data.jenis_qurban === "2" ? "Sapi 🐄" : "Sapi Patungan 🤝"}</p></div>
                  <div><p className="text-xs text-gray-500">Bentuk</p><p className="font-bold text-sm">{data.bentuk || "-"}</p></div>
                  <div><p className="text-xs text-gray-500">Nominal Uang</p><p className="font-bold text-sm">{data.uang ? `Rp ${data.uang.toLocaleString('id-ID')}` : "-"}</p></div>
                  {data.kel_sapi && <div><p className="text-xs text-emerald-600 font-bold">Kelompok Sapi</p><p className="font-bold text-sm">{data.kel_sapi}</p></div>}
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-4">
                <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider">Penyembelihan & Distribusi</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">Hadir Melihat?</p><p className="font-bold text-sm">{data.melihat ? "YA 👀" : "TIDAK"}</p></div>
                  <div><p className="text-xs text-gray-500">Menyembelih?</p><p className="font-bold text-sm">{data.menyembelih ? "YA 🔪" : "TIDAK"}</p></div>
                  <div><p className="text-xs text-gray-500">Penyaluran</p><p className="font-bold text-sm">{data.penyaluran || "Internal"}</p></div>
                  <div><p className="text-xs text-gray-500">Jml Bagian</p><p className="font-bold text-sm">{data.jml_bagian || "-"}</p></div>
                </div>
                {data.pesan_bagian && (
                  <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg">
                    <p className="text-xs text-orange-600 font-bold mb-1">Pesan Bagian Khusus:</p>
                    <p className="text-sm text-gray-800">{data.pesan_bagian}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 🟠 DRAWER EDIT FULL (UDAH DI-UPGRADE JADI MAX-W-2XL DAN FULL KOLOM!) */}
      {isEditOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] animate-in fade-in" onClick={() => setIsEditOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Header Laci */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-blue-50/30">
              <div>
                <h3 className="text-xl font-bold text-blue-800">Edit Data Hewan</h3>
                <p className="text-sm text-blue-600/70 mt-1">ID: {data.no_id_lama} | {data.pengqurban?.nama_lengkap}</p>
              </div>
              <button onClick={() => setIsEditOpen(false)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><X size={22} /></button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 space-y-6 bg-gray-50/30">
              
              {/* 🧩 KELOMPOK 1: INFORMASI DASAR */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                <h4 className="font-bold text-emerald-800 border-b pb-2">Informasi Dasar</h4>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bentuk Titipan</label>
                    <div className="relative">
                      <select name="bentuk" value={hwn.bentuk} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold uppercase appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option value="UANG">UANG 💵</option><option value="HEWAN">HEWAN 🥩</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nominal Uang</label>
                    <input type="number" name="uang" value={hwn.uang} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Kelompok Sapi</label>
                    <input type="text" name="kel_sapi" value={hwn.kel_sapi} onChange={handleChange} className="w-full px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                </div>
              </div>

              {/* 🧩 KELOMPOK 2: PENYEMBELIHAN & DISTRIBUSI */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                <h4 className="font-bold text-blue-800 border-b pb-2">Penyembelihan & Distribusi</h4>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hadir Melihat?</label>
                    <div className="relative">
                      <select name="melihat" value={hwn.melihat} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold uppercase appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option value="YA">YA 👀</option><option value="TIDAK">TIDAK</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Penyaluran</label>
                    <div className="relative">
                      <select name="penyaluran" value={hwn.penyaluran} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold uppercase appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option value="DALAM">DALAM (INTERNAL)</option><option value="LUAR">LUAR (EKSTERNAL)</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ikut Menyembelih?</label>
                    <div className="relative">
                      <select name="menyembelih" value={hwn.menyembelih} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold uppercase appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option value="YA">YA 🔪</option><option value="TIDAK">TIDAK</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Jml Bagian</label>
                    <input type="number" name="jml_bagian" value={hwn.jml_bagian} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                </div>
                <div className="space-y-1.5 mt-2 flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pesan Bagian Khusus</label>
                  <textarea name="pesan_bagian" rows={2} value={hwn.pesan_bagian} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
              </div>

              {/* 🧩 KELOMPOK 3: INFORMASI LAINNYA */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                <h4 className="font-bold text-orange-800 border-b pb-2">Informasi Lainnya</h4>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5 flex flex-col"><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">No UQ</label><input type="text" name="no_uq" value={hwn.no_uq} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" /></div>
                  <div className="space-y-1.5 flex flex-col"><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lokasi</label><input type="text" name="lokasi" value={hwn.lokasi} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" /></div>
                  <div className="space-y-1.5 flex flex-col"><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Penerima</label><input type="text" name="penerima" value={hwn.penerima} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" /></div>
                  <div className="space-y-1.5 flex flex-col"><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sebab</label><input type="text" name="sebab" value={hwn.sebab} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" /></div>
                </div>
                <div className="space-y-1.5 mt-2 flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Keterangan Tambahan</label>
                  <textarea name="keterangan" rows={2} value={hwn.keterangan} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
              </div>
              
            </div>

            {/* Footer Laci */}
            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button onClick={() => setIsEditOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors">Batal</button>
              <button onClick={executeUpdate} disabled={isSubmitting} className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-white ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"}`}>
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Menyimpan...</> : <><Save size={18} /> Update Data</>}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}