"use client";

import { useState } from "react";
import { Trash2, Edit, AlertTriangle, Loader2, X, Save, UserPlus, Phone } from "lucide-react";
import { deletePetugas, updatePetugas } from "@/app/actions/petugas";
import toast from "react-hot-toast";

export default function PetugasActionButtons({ data }: { data: any }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    nama: data.nama || "",
    no_hp: data.no_hp || "",
  });

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });

  const executeUpdate = async () => {
    if (!form.nama) {
      toast.error("Nama Petugas wajib diisi!");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Memperbarui data petugas...");
    const res = await updatePetugas(data.id_petugas, form);
    
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
    const toastId = toast.loading("Menghapus petugas...");
    const res = await deletePetugas(data.id_petugas);
    
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
        <button onClick={() => setIsEditOpen(true)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Petugas">
          <Edit size={16} />
        </button>
        <button onClick={() => setIsDeleteOpen(true)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Petugas">
          <Trash2 size={16} />
        </button>
      </div>

      {/* 🔴 MODAL KONFIRMASI DELETE */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isSubmitting && setIsDeleteOpen(false)} />
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden z-10 animate-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><AlertTriangle size={32} /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Petugas?</h3>
            <p className="text-sm text-gray-500 mb-6 px-2 break-words whitespace-normal leading-relaxed">
              Yakin mau hapus <span className="font-bold text-gray-800">{data.nama}</span> dari daftar petugas jaga?
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

      {/* 🔵 DRAWER EDIT PETUGAS */}
      {isEditOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] animate-in fade-in" onClick={() => setIsEditOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
              <div>
                <h3 className="text-xl font-bold text-blue-800">Edit Petugas Jaga</h3>
                <p className="text-sm font-mono text-blue-600 mt-1">ID: {data.id_lama}</p>
              </div>
              <button onClick={() => setIsEditOpen(false)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><X size={22} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><UserPlus size={14}/> Nama Lengkap *</label>
                  <input type="text" name="nama" value={form.nama} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Phone size={14}/> No. HP / WhatsApp</label>
                  <input type="text" name="no_hp" value={form.no_hp} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button onClick={() => setIsEditOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors">Batal</button>
              <button onClick={executeUpdate} disabled={isSubmitting} className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all text-white ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"}`}>
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Proses...</> : <><Save size={18} /> Update</>}
              </button>
            </div>

          </div>
        </>
      )}
    </>
  );
}