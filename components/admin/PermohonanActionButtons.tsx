"use client";

import { useState } from "react";
import { Trash2, Edit, AlertTriangle, Loader2, X, Save, Building2, Phone, CreditCard } from "lucide-react";
import { deletePermohonan, updatePermohonan } from "@/app/actions/permohonan";
import toast from "react-hot-toast";

export default function PermohonanActionButtons({ data }: { data: any }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format tanggal dari database (ISO) ke format YYYY-MM-DD buat input date HTML
  const formattedDate = data.tanggal ? new Date(data.tanggal).toISOString().split('T')[0] : "";

  const [form, setForm] = useState({
    tanggal: formattedDate,
    nomor_surat: data.nomor_surat || "",
    nama_pemohon: data.nama_pemohon || "",
    alamat_pemohon: data.alamat_pemohon || "",
    kota_pemohon: data.kota_pemohon || "",
    no_kontak: data.no_kontak || "",
    penanggung_jawab: data.penanggung_jawab || "",
    no_rek: data.no_rek || "",
    bank: data.bank || "",
    atas_nama: data.atas_nama || "",
  });

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });

  const executeUpdate = async () => {
    if (!form.nama_pemohon) {
      toast.error("Nama Instansi/Pemohon wajib diisi!");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Memperbarui data permohonan...");
    const res = await updatePermohonan(data.id_permohonan, form);
    
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
    const toastId = toast.loading("Menghapus permohonan...");
    const res = await deletePermohonan(data.id_permohonan);
    
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
        <button onClick={() => setIsEditOpen(true)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Permohonan">
          <Edit size={16} />
        </button>
        <button onClick={() => setIsDeleteOpen(true)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Permohonan">
          <Trash2 size={16} />
        </button>
      </div>

      {/* 🔴 MODAL KONFIRMASI DELETE */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isSubmitting && setIsDeleteOpen(false)} />
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden z-10 animate-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><AlertTriangle size={32} /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Permohonan?</h3>
            <p className="text-sm text-gray-500 mb-6 px-2 break-words whitespace-normal leading-relaxed">
              Yakin mau hapus permohonan dari instansi <span className="font-bold text-gray-800">{data.nama_pemohon}</span> dengan ID <span className="font-bold text-gray-800">{data.no_id_surat}</span>?
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

      {/* 🔵 DRAWER EDIT PERMOHONAN */}
      {isEditOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] animate-in fade-in" onClick={() => setIsEditOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
              <div>
                <h3 className="text-xl font-bold text-blue-800">Edit Permohonan Instansi</h3>
                <p className="text-sm font-mono text-blue-600 mt-1">ID Surat: {data.no_id_surat}</p>
              </div>
              <button onClick={() => setIsEditOpen(false)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><X size={22} /></button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 space-y-6 bg-gray-50/30">
              
              {/* SECTION 1: INFO SURAT & INSTANSI */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                <h4 className="font-bold text-blue-800 border-b pb-2 flex items-center gap-2"><Building2 size={18}/> Informasi Surat & Instansi</h4>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal Masuk</label>
                    <input type="date" name="tanggal" value={form.tanggal} onChange={(e) => setForm({...form, tanggal: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nomor Surat Masuk</label>
                    <input type="text" name="nomor_surat" value={form.nomor_surat} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                  <div className="col-span-2 space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Instansi / Pemohon *</label>
                    <input type="text" name="nama_pemohon" value={form.nama_pemohon} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                  <div className="col-span-2 space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Alamat Lengkap</label>
                    <textarea name="alamat_pemohon" rows={2} value={form.alamat_pemohon} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase resize-none outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                  <div className="col-span-2 space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kota</label>
                    <input type="text" name="kota_pemohon" value={form.kota_pemohon} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-blue-500/20" />
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
                  <h4 className="font-bold text-emerald-600 border-b pb-2 flex items-center gap-2"><CreditCard size={18}/> Rekening</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bank</label>
                        <input type="text" name="bank" value={form.bank} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-emerald-500/20" />
                      </div>
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">No Rekening</label>
                        <input type="text" name="no_rek" value={form.no_rek} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-emerald-500/20" />
                      </div>
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Atas Nama</label>
                      <input type="text" name="atas_nama" value={form.atas_nama} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-emerald-500/20" />
                    </div>
                  </div>
                </div>
              </div>
              
            </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button onClick={() => setIsEditOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors">Batal</button>
              <button onClick={executeUpdate} disabled={isSubmitting} className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-white ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"}`}>
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Menyimpan...</> : <><Save size={18} /> Update Permohonan</>}
              </button>
            </div>

          </div>
        </>
      )}
    </>
  );
}