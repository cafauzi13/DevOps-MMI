"use client";

import { useState } from "react";
import { Plus, X, Save, Loader2, Building2, Phone, CreditCard } from "lucide-react";
import { createPermohonan } from "@/app/actions/permohonan";
import toast from "react-hot-toast";

export default function FormPermohonanDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    tanggal: new Date().toISOString().split('T')[0], // Default hari ini
    nomor_surat: "",
    nama_pemohon: "", // Wajib
    alamat_pemohon: "",
    kota_pemohon: "",
    no_kontak: "",
    penanggung_jawab: "",
    no_rek: "",
    bank: "",
    atas_nama: "",
  });

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });

  const executeSubmit = async () => {
    if (!form.nama_pemohon) {
      toast.error("Nama Instansi/Pemohon wajib diisi!");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Menyimpan data permohonan...");
    
    const res = await createPermohonan(form);
    
    if (res.success) {
      toast.success(res.message, { id: toastId });
      setIsOpen(false);
      // Reset form
      setForm({
        tanggal: new Date().toISOString().split('T')[0],
        nomor_surat: "", nama_pemohon: "", alamat_pemohon: "", kota_pemohon: "",
        no_kontak: "", penanggung_jawab: "", no_rek: "", bank: "", atas_nama: "",
      });
    } else {
      toast.error(res.message, { id: toastId });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="bg-mmi hover:bg-mmi-hover text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm"
      >
        <Plus size={18} /> Tambah Permohonan
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] animate-in fade-in" onClick={() => setIsOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-mmi/5">
              <div>
                <h3 className="text-xl font-bold text-mmi">Tambah Permohonan Instansi</h3>
                <p className="text-sm text-gray-500 mt-1">Daftarkan proposal permintaan hewan qurban</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><X size={22} /></button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 space-y-6 bg-gray-50/30">
              
              {/* SECTION 1: INFO SURAT & INSTANSI */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                <h4 className="font-bold text-mmi border-b pb-2 flex items-center gap-2"><Building2 size={18}/> Informasi Surat & Instansi</h4>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal Masuk</label>
                    <input type="date" name="tanggal" value={form.tanggal} onChange={(e) => setForm({...form, tanggal: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-mmi/20 outline-none" />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nomor Surat Masuk</label>
                    <input type="text" name="nomor_surat" value={form.nomor_surat} onChange={handleChange} placeholder="Cth: 001/PR/RDK/2026" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-mmi/20" />
                  </div>
                  <div className="col-span-2 space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Instansi / Pemohon *</label>
                    <input type="text" name="nama_pemohon" value={form.nama_pemohon} onChange={handleChange} placeholder="Cth: PANTI ASUHAN AL-IKHLAS" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-mmi/20" />
                  </div>
                  <div className="col-span-2 space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Alamat Lengkap</label>
                    <textarea name="alamat_pemohon" rows={2} value={form.alamat_pemohon} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase resize-none outline-none focus:ring-2 focus:ring-mmi/20" />
                  </div>
                  <div className="col-span-2 space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kota</label>
                    <input type="text" name="kota_pemohon" value={form.kota_pemohon} onChange={handleChange} placeholder="Cth: SURABAYA" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-mmi/20" />
                  </div>
                </div>
              </div>

              {/* SECTION 2: KONTAK & REKENING */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                  <h4 className="font-bold text-orange-600 border-b pb-2 flex items-center gap-2"><Phone size={18}/> Kontak</h4>
                  <div className="space-y-4">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Penanggung Jawab</label>
                      <input type="text" name="penanggung_jawab" value={form.penanggung_jawab} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-orange-500/20" />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">No Kontak / WA</label>
                      <input type="text" name="no_kontak" value={form.no_kontak} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-orange-500/20" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                  <h4 className="font-bold text-blue-600 border-b pb-2 flex items-center gap-2"><CreditCard size={18}/> Rekening</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bank</label>
                        <input type="text" name="bank" value={form.bank} onChange={handleChange} placeholder="Cth: BSI" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-blue-500/20" />
                      </div>
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">No Rekening</label>
                        <input type="text" name="no_rek" value={form.no_rek} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-blue-500/20" />
                      </div>
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Atas Nama Rekening</label>
                      <input type="text" name="atas_nama" value={form.atas_nama} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                  </div>
                </div>
              </div>
              
            </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button onClick={() => setIsOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors">Batal</button>
              <button onClick={executeSubmit} disabled={isSubmitting} className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-white ${isSubmitting ? "bg-mmi/50 cursor-not-allowed" : "bg-mmi hover:bg-mmi-hover shadow-md shadow-mmi/20"}`}>
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Menyimpan...</> : <><Save size={18} /> Simpan Permohonan</>}
              </button>
            </div>

          </div>
        </>
      )}
    </>
  );
}