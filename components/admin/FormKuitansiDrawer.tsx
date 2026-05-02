"use client";

import { useState } from "react";
import { Plus, X, Save, Loader2, Receipt, PlusCircle, Trash2 } from "lucide-react";
import { createKuitansi } from "@/app/actions/kuitansi";
import toast from "react-hot-toast";

export default function FormKuitansiDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State buat Header (Master)
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    penanggung_jawab: "",
  });

  // State buat Detail Barang (Array)
  const [details, setDetails] = useState([
    { pos: "", uraian: "", debit: "", kredit: "" }
  ]);

  const handleMasterChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });

  const handleDetailChange = (index: number, e: any) => {
    const newDetails = [...details];
    newDetails[index][e.target.name as keyof typeof newDetails[0]] = e.target.value.toUpperCase();
    setDetails(newDetails);
  };

  const addDetailRow = () => setDetails([...details, { pos: "", uraian: "", debit: "", kredit: "" }]);
  
  const removeDetailRow = (index: number) => {
    if (details.length === 1) return;
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
  };

  const executeSubmit = async () => {
    if (!form.penanggung_jawab) {
      toast.error("Penanggung jawab wajib diisi!"); return;
    }
    
    // Validasi minimal ada 1 barang yg diisi uraiannya
    const validDetails = details.filter(d => d.uraian && (d.debit || d.kredit));
    if (validDetails.length === 0) {
      toast.error("Minimal isi 1 uraian barang beserta nominalnya!"); return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Menyimpan kuitansi...");
    const res = await createKuitansi(form, validDetails);
    
    if (res.success) {
      toast.success(res.message, { id: toastId });
      setIsOpen(false);
      // Reset form
      setForm({ tanggal: new Date().toISOString().split('T')[0], penanggung_jawab: "" });
      setDetails([{ pos: "", uraian: "", debit: "", kredit: "" }]);
    } else {
      toast.error(res.message, { id: toastId });
    }
    setIsSubmitting(false);
  };

  // Hitung total buat preview
  const totalDebit = details.reduce((sum, item) => sum + (Number(item.debit) || 0), 0);
  const totalKredit = details.reduce((sum, item) => sum + (Number(item.kredit) || 0), 0);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-mmi hover:bg-mmi-hover text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm">
        <Plus size={18} /> Buat Kuitansi
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] animate-in fade-in" onClick={() => setIsOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-3xl bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-mmi/5">
              <div>
                <h3 className="text-xl font-bold text-mmi">Buat Kuitansi Taktis</h3>
                <p className="text-sm text-gray-500 mt-1">Catat pengeluaran/pemasukan operasional</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><X size={22} /></button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 space-y-6 bg-gray-50/30">
              
              {/* MASTER KUITANSI */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h4 className="font-bold text-gray-700 border-b pb-2 flex items-center gap-2"><Receipt size={18}/> Info Kuitansi</h4>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</label>
                    <input type="date" name="tanggal" value={form.tanggal} onChange={handleMasterChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-mmi/20" />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Penanggung Jawab *</label>
                    <input type="text" name="penanggung_jawab" value={form.penanggung_jawab} onChange={handleMasterChange} placeholder="Cth: BARA ARDIWINATA" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-mmi/20" />
                  </div>
                </div>
              </div>

              {/* DETAILS (ITEM BARANG) */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h4 className="font-bold text-mmi flex items-center gap-2">Detail Transaksi</h4>
                  <button onClick={addDetailRow} className="text-xs font-bold bg-mmi/10 text-mmi px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-mmi/20"><PlusCircle size={14}/> Tambah Baris</button>
                </div>

                <div className="space-y-3">
                  {details.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start bg-gray-50 p-3 rounded-xl border border-gray-100 relative group">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-3">
                            <input type="text" name="pos" value={item.pos} onChange={(e) => handleDetailChange(index, e)} placeholder="POS (Opsional)" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs uppercase outline-none focus:border-mmi" />
                          </div>
                          <div className="col-span-9">
                            <input type="text" name="uraian" value={item.uraian} onChange={(e) => handleDetailChange(index, e)} placeholder="Uraian Barang / Kegiatan *" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs uppercase outline-none focus:border-mmi" />
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
              <button onClick={() => setIsOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors">Batal</button>
              <button onClick={executeSubmit} disabled={isSubmitting} className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-white ${isSubmitting ? "bg-mmi/50 cursor-not-allowed" : "bg-mmi hover:bg-mmi-hover shadow-md shadow-mmi/20"}`}>
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Menyimpan...</> : <><Save size={18} /> Simpan Kuitansi</>}
              </button>
            </div>

          </div>
        </>
      )}
    </>
  );
}