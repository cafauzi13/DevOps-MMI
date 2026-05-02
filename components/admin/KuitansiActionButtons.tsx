"use client";

import { useState } from "react";
import { Trash2, Edit, AlertTriangle, Loader2, X, Save, Receipt, PlusCircle } from "lucide-react";
import { deleteKuitansi, updateKuitansi } from "@/app/actions/kuitansi";
import toast from "react-hot-toast";

export default function KuitansiActionButtons({ data }: { data: any }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === SETUP DATA EDIT ===
  const formattedDate = data.tanggal ? new Date(data.tanggal).toISOString().split('T')[0] : "";
  const [form, setForm] = useState({
    tanggal: formattedDate,
    penanggung_jawab: data.penanggung_jawab || "",
  });

  // Map detail dari database ke format state form kita
  const initialDetails = data.detail_kuitansi && data.detail_kuitansi.length > 0
    ? data.detail_kuitansi.map((d: any) => ({
        pos: d.pos || "",
        uraian: d.uraian || "",
        debit: Number(d.debit) ? Number(d.debit).toString() : "",
        kredit: Number(d.kredit) ? Number(d.kredit).toString() : ""
      }))
    : [{ pos: "", uraian: "", debit: "", kredit: "" }];

  // Kasih tau TypeScript kalau ini tuh array of any
  const [details, setDetails] = useState<any[]>(initialDetails);

  const handleMasterChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });

  const handleDetailChange = (index: number, e: any) => {
    const newDetails = [...details];
    newDetails[index][e.target.name] = e.target.value.toUpperCase();
    setDetails(newDetails);
  };

  const addDetailRow = () => setDetails([...details, { pos: "", uraian: "", debit: "", kredit: "" }]);
  
  // FIX: Tambah tipe data (_: any, i: number)
  const removeDetailRow = (index: number) => {
    if (details.length === 1) return;
    setDetails(details.filter((_: any, i: number) => i !== index));
  };

  // === FUNGSI SUBMIT EDIT ===
  const executeUpdate = async () => {
    if (!form.penanggung_jawab) {
      toast.error("Penanggung jawab wajib diisi!"); return;
    }
    
    // FIX: Tambah tipe data (d: any)
    const validDetails = details.filter((d: any) => d.uraian && (d.debit || d.kredit));
    if (validDetails.length === 0) {
      toast.error("Minimal isi 1 uraian barang beserta nominalnya!"); return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Memperbarui kuitansi...");
    const res = await updateKuitansi(data.no_kw, form, validDetails);
    
    if (res.success) {
      toast.success(res.message, { id: toastId });
      setIsEditOpen(false);
    } else {
      toast.error(res.message, { id: toastId });
    }
    setIsSubmitting(false);
  };

  // === FUNGSI DELETE ===
  const executeDelete = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading("Menghapus kuitansi dan detailnya...");
    const res = await deleteKuitansi(data.no_kw);
    if (res.success) {
      toast.success(res.message, { id: toastId });
      setIsDeleteOpen(false);
    } else {
      toast.error(res.message, { id: toastId });
    }
    setIsSubmitting(false);
  };

  // FIX: Tambah tipe data (sum: number, item: any)
  const totalDebit = details.reduce((sum: number, item: any) => sum + (Number(item.debit) || 0), 0);
  const totalKredit = details.reduce((sum: number, item: any) => sum + (Number(item.kredit) || 0), 0);

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <button onClick={() => setIsEditOpen(true)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Kuitansi">
          <Edit size={16} />
        </button>
        <button onClick={() => setIsDeleteOpen(true)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Kuitansi">
          <Trash2 size={16} />
        </button>
      </div>

      {/* 🔴 MODAL DELETE */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isSubmitting && setIsDeleteOpen(false)} />
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden z-10 animate-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><AlertTriangle size={32} /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Kuitansi?</h3>
            <p className="text-sm text-gray-500 mb-6 px-2 break-words whitespace-normal leading-relaxed">
              Yakin hapus kuitansi <span className="font-bold text-gray-800">{data.no_kw}</span>? Semua uraian di dalamnya juga akan ikut terhapus!
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

      {/* 🔵 DRAWER EDIT KUITANSI */}
      {isEditOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] animate-in fade-in" onClick={() => setIsEditOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-3xl bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
              <div>
                <h3 className="text-xl font-bold text-blue-800">Edit Kuitansi</h3>
                <p className="text-sm font-mono text-blue-600 mt-1">NO KW: {data.no_kw}</p>
              </div>
              <button onClick={() => setIsEditOpen(false)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><X size={22} /></button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 space-y-6 bg-gray-50/30">
              
              {/* MASTER KUITANSI */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h4 className="font-bold text-gray-700 border-b pb-2 flex items-center gap-2"><Receipt size={18}/> Info Kuitansi</h4>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</label>
                    <input type="date" name="tanggal" value={form.tanggal} onChange={handleMasterChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Penanggung Jawab *</label>
                    <input type="text" name="penanggung_jawab" value={form.penanggung_jawab} onChange={handleMasterChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                </div>
              </div>

              {/* DETAILS (ITEM BARANG) */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h4 className="font-bold text-blue-800 flex items-center gap-2">Detail Transaksi</h4>
                  <button onClick={addDetailRow} className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-100"><PlusCircle size={14}/> Tambah Baris</button>
                </div>

                <div className="space-y-3">
                  {/* FIX: Tambah tipe data (item: any, index: number) */}
                  {details.map((item: any, index: number) => (
                    <div key={index} className="flex gap-3 items-start bg-gray-50 p-3 rounded-xl border border-gray-100 relative group">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-3">
                            <input type="text" name="pos" value={item.pos} onChange={(e) => handleDetailChange(index, e)} placeholder="POS (Opsional)" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs uppercase outline-none focus:border-blue-400" />
                          </div>
                          <div className="col-span-9">
                            <input type="text" name="uraian" value={item.uraian} onChange={(e) => handleDetailChange(index, e)} placeholder="Uraian Barang / Kegiatan *" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs uppercase outline-none focus:border-blue-400" />
                          </div>
                          <div className="col-span-6">
                            <input type="number" name="debit" value={item.debit} onChange={(e) => handleDetailChange(index, e)} placeholder="Debit (Masuk) Rp" className="w-full px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-lg text-xs outline-none focus:border-emerald-500" />
                          </div>
                          <div className="col-span-6">
                            <input type="number" name="kredit" value={item.kredit} onChange={(e) => handleDetailChange(index, e)} placeholder="Kredit (Keluar) Rp" className="w-full px-3 py-2 bg-red-50 border border-red-200 text-red-700 font-bold rounded-lg text-xs outline-none focus:border-red-500" />
                          </div>
                        </div>
                      </div>
                      {details.length > 1 && (
                        <button onClick={() => removeDetailRow(index)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"><Trash2 size={16}/></button>
                      )}
                    </div>
                  ))}
                </div>

                {/* SUMMARY PREVIEW */}
                <div className="flex justify-end gap-6 pt-4 border-t text-sm">
                  <div className="text-right">
                    <p className="text-gray-500 font-bold">Total Debit</p>
                    <p className="text-emerald-600 font-bold text-lg">Rp {totalDebit.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 font-bold">Total Kredit</p>
                    <p className="text-red-600 font-bold text-lg">Rp {totalKredit.toLocaleString('id-ID')}</p>
                  </div>
                </div>

              </div>
            </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button onClick={() => setIsEditOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors">Batal</button>
              <button onClick={executeUpdate} disabled={isSubmitting} className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-white ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"}`}>
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Proses...</> : <><Save size={18} /> Update Kuitansi</>}
              </button>
            </div>

          </div>
        </>
      )}
    </>
  );
}