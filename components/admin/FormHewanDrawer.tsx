"use client";

import { useState } from "react";
import { Plus, X, Save, Loader2, ChevronDown } from "lucide-react";
import { createHewan } from "@/app/actions/hewan";
import toast from "react-hot-toast";

export default function AddHewanModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Form Lengkap + Fitur Baru
  const [hwn, setHwn] = useState({
    nkw_pengqurban: "", // Wajib diisi ID Pengqurban-nya
    jenis_qurban: "2", // Default Sapi
    bentuk: "UANG", uang: "", penyembelihan: "", melihat: "TIDAK", menyembelih: "TIDAK",
    jml_bagian: "", pembagian: "", pesan_bagian: "", kel_sapi: "", no_uq: "",
    penyaluran: "DALAM", lokasi: "", keterangan: "", penerima: "", petugas: "", sebab: "",
    
    // Fitur Baru
    biaya_operasional: "", pindah_sapi: "TIDAK", penyaluran_luar: "TIDAK",
    metode_bayar: "TUNAI", status_bayar: "BELUM LUNAS"
  });

  const handleChange = (e: any) => setHwn({ ...hwn, [e.target.name]: e.target.value.toUpperCase() });

  const executeSubmit = async () => {
    if (!hwn.nkw_pengqurban) {
      toast.error("NKW Pengqurban wajib diisi!");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Menyimpan data hewan baru...");
    const res = await createHewan(hwn);
    
    if (res.success) {
      toast.success(res.message, { id: toastId });
      setIsOpen(false);
      // Reset form
      setHwn({ ...hwn, nkw_pengqurban: "", uang: "", biaya_operasional: "", kel_sapi: "" });
    } else {
      toast.error(res.message, { id: toastId });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      {/* TOMBOL TRIGGER (Yang dipajang di halaman utama) */}
      <button 
        onClick={() => setIsOpen(true)} 
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
      >
        <Plus size={18} /> Tambah Hewan
      </button>

      {/* LACI TAMBAH HEWAN */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-in fade-in" onClick={() => setIsOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-gray-50 shadow-2xl z-[110] flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-xl font-bold text-emerald-800 flex items-center gap-2"><Plus size={20}/> Tambah Hewan Baru</h3>
                <p className="text-sm text-gray-500 font-medium mt-1">Input data titipan qurban dari shohibul.</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors bg-gray-100"><X size={22} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              
              {/* KELOMPOK 0: IDENTITAS PENGQURBAN */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                <h4 className="font-bold text-emerald-800 border-b border-gray-100 pb-3">Identitas Kepemilikan</h4>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-red-500 uppercase tracking-wider">NKW Pengqurban (Wajib)</label>
                  <input type="text" name="nkw_pengqurban" value={hwn.nkw_pengqurban} onChange={handleChange} placeholder="Masukkan NKW bapak/ibu shohibul..." className="w-full px-4 py-3 bg-gray-50 border border-red-200 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                  <p className="text-[10px] text-gray-400">Pastikan NKW sudah terdaftar di menu Pengqurban.</p>
                </div>
              </div>

              {/* KELOMPOK 1: INFORMASI DASAR */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                <h4 className="font-bold text-emerald-800 border-b border-gray-100 pb-3">Informasi Dasar</h4>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase">Jenis Qurban</label>
                    <div className="relative">
                      <select name="jenis_qurban" value={hwn.jenis_qurban} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold uppercase appearance-none">
                        <option value="1">Kambing 🐐</option><option value="2">Sapi Utuh 🐄</option><option value="3">Sapi Patungan 🤝</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase">Bentuk Titipan</label>
                    <div className="relative">
                      <select name="bentuk" value={hwn.bentuk} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold uppercase appearance-none">
                        <option value="UANG">UANG 💵</option><option value="HEWAN">HEWAN 🥩</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase">Nominal Uang</label>
                    <input type="number" name="uang" value={hwn.uang} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-emerald-600 uppercase">Kelompok Sapi</label>
                    <input type="text" name="kel_sapi" value={hwn.kel_sapi} onChange={handleChange} placeholder="Contoh: A" className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-sm uppercase focus:ring-emerald-500/30" />
                  </div>
                </div>
              </div>

              {/* KELOMPOK BARU: STATUS & ADMINISTRASI */}
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 shadow-sm space-y-5">
                <h4 className="font-bold text-blue-800 border-b border-blue-100 pb-3 italic">Status & Administrasi</h4>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase">Metode Bayar</label>
                    <select name="metode_bayar" value={hwn.metode_bayar} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold">
                      <option value="TUNAI">TUNAI 💵</option><option value="TRANSFER">TRANSFER 💳</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase">Status Bayar</label>
                    <select name="status_bayar" value={hwn.status_bayar} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold">
                      <option value="LUNAS">LUNAS ✅</option><option value="DP">DP 💰</option><option value="BELUM LUNAS">BELUM LUNAS ❌</option>
                    </select>
                  </div>
                  {hwn.bentuk === "HEWAN" && (
                    <div className="space-y-1.5 flex flex-col col-span-2">
                      <label className="text-xs font-bold text-red-600 uppercase">Biaya Operasional (Titip Hewan Hidup)</label>
                      <input type="number" name="biaya_operasional" value={hwn.biaya_operasional} onChange={handleChange} placeholder="Contoh: 150000" className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm font-bold text-red-700 focus:ring-red-500" />
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-white flex justify-end gap-3 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] relative z-10">
              <button onClick={() => setIsOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">Batal</button>
              <button onClick={executeSubmit} disabled={isSubmitting} className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-white ${isSubmitting ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30"}`}>
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Menyimpan...</> : <><Save size={18} /> Simpan Hewan</>}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}