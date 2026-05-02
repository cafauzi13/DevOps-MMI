"use client";

import { useState } from "react";
import { Plus, X, Save, Loader2, Wallet, User, FileText } from "lucide-react";
import { createSetoran } from "@/app/actions/setoran";
import toast from "react-hot-toast";

export default function FormSetoranDrawer({ petugasList }: { petugasList: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    id_petugas: "",
    no_urut: "",
    tanggal: new Date().toISOString().split('T')[0],
    nama: "",
    jml_setor: "",
    keterangan: "",
  });

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });

  const executeSubmit = async () => {
    if (!form.id_petugas || !form.nama || !form.jml_setor) {
      toast.error("Petugas, Nama Penyetor, dan Jumlah wajib diisi!");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Mencatat setoran...");
    const res = await createSetoran(form);
    
    if (res.success) {
      toast.success(res.message, { id: toastId });
      setIsOpen(false);
      setForm({ ...form, nama: "", jml_setor: "", keterangan: "", no_urut: "" }); // Reset sebagian form
    } else {
      toast.error(res.message, { id: toastId });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-mmi hover:bg-mmi-hover text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm">
        <Plus size={18} /> Catat Setoran
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] animate-in fade-in" onClick={() => setIsOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between bg-mmi/5">
              <div>
                <h3 className="text-xl font-bold text-mmi">Catat Setoran Baru</h3>
                <p className="text-sm text-gray-500 mt-1">Uang masuk dari shohibul qurban</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><X size={22} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><User size={14}/> Petugas Penerima *</label>
                  <select name="id_petugas" value={form.id_petugas} onChange={(e) => setForm({...form, id_petugas: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold uppercase focus:ring-2 focus:ring-mmi/20 outline-none">
                    <option value="">-- PILIH PETUGAS --</option>
                    {petugasList.map((p) => (
                      <option key={p.id_petugas} value={p.id_lama}>{p.id_lama} - {p.nama}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</label>
                    <input type="date" name="tanggal" value={form.tanggal} onChange={(e) => setForm({...form, tanggal: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-mmi/20 outline-none" />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">No. Urut (Opsional)</label>
                    <input type="number" name="no_urut" value={form.no_urut} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-mmi/20" />
                  </div>
                </div>

                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Penyetor *</label>
                  <input type="text" name="nama" value={form.nama} onChange={handleChange} placeholder="Cth: HAMBA ALLAH" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-mmi/20" />
                </div>

                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2"><Wallet size={14}/> Nominal Setor (Rp) *</label>
                  <input type="number" name="jml_setor" value={form.jml_setor} onChange={handleChange} placeholder="Cth: 3500000" className="w-full px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-800 outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>

                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><FileText size={14}/> Keterangan Tambahan</label>
                  <textarea name="keterangan" rows={2} value={form.keterangan} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase resize-none outline-none focus:ring-2 focus:ring-mmi/20" />
                </div>

              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button onClick={() => setIsOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors">Batal</button>
              <button onClick={executeSubmit} disabled={isSubmitting} className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all text-white ${isSubmitting ? "bg-mmi/50 cursor-not-allowed" : "bg-mmi hover:bg-mmi-hover shadow-md shadow-mmi/20"}`}>
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Proses...</> : <><Save size={18} /> Simpan Setoran</>}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}