"use client";

import { useState } from "react";
import { Plus, X, Save, Loader2, UserPlus, Phone } from "lucide-react";
import { createPetugas } from "@/app/actions/petugas";
import toast from "react-hot-toast";

export default function FormPetugasDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    no_hp: "",
  });

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });

  const executeSubmit = async () => {
    if (!form.nama) {
      toast.error("Nama Petugas wajib diisi!");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Menyimpan data petugas...");
    
    const res = await createPetugas(form);
    
    if (res.success) {
      toast.success(res.message, { id: toastId });
      setIsOpen(false);
      setForm({ nama: "", no_hp: "" }); // Reset form
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
        <Plus size={18} /> Tambah Petugas
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] animate-in fade-in" onClick={() => setIsOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between bg-mmi/5">
              <div>
                <h3 className="text-xl font-bold text-mmi">Tambah Petugas Jaga</h3>
                <p className="text-sm text-gray-500 mt-1">Daftarkan panitia penerima qurban</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><X size={22} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><UserPlus size={14}/> Nama Lengkap *</label>
                  <input type="text" name="nama" value={form.nama} onChange={handleChange} placeholder="Cth: BARA ARDIWINATA" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-mmi/20" />
                </div>
                
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Phone size={14}/> No. HP / WhatsApp</label>
                  <input type="text" name="no_hp" value={form.no_hp} onChange={handleChange} placeholder="Cth: 081234567890" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-mmi/20" />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button onClick={() => setIsOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors">Batal</button>
              <button onClick={executeSubmit} disabled={isSubmitting} className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all text-white ${isSubmitting ? "bg-mmi/50 cursor-not-allowed" : "bg-mmi hover:bg-mmi-hover shadow-md shadow-mmi/20"}`}>
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Proses...</> : <><Save size={18} /> Simpan</>}
              </button>
            </div>

          </div>
        </>
      )}
    </>
  );
}