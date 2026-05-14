"use client";

import { useState } from "react";
import { Trash2, Edit, AlertTriangle, Loader2, X, Save, Eye, MapPin, Hash, User, ChevronDown, Printer, CheckCircle2 } from "lucide-react";
import { deleteHewan, updateHewan } from "@/app/actions/hewan";
import toast from "react-hot-toast";

export default function HewanActionButtons({ data }: { data: any }) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🎯 STATE BARU: Buat nyimpen data orang spesifik yang mau diedit/dihapus
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  
  // State Form Lengkap (Nilainya dikosongin dulu, nanti diisi pas tombol Edit diklik)
  const [hwn, setHwn] = useState({
    bentuk: "UANG", uang: "", penyembelihan: "", melihat: "TIDAK", menyembelih: "TIDAK",
    jml_bagian: "", pembagian: "", pesan_bagian: "", kel_sapi: "", no_uq: "",
    penyaluran: "DALAM", lokasi: "", keterangan: "", penerima: "", petugas: "", sebab: "",
    biaya_operasional: data.biaya_operasional?.toString() || "",
    pindah_sapi: data.pindah_sapi ? "YA" : "TIDAK",
    penyaluran_luar: data.penyaluran_luar ? "YA" : "TIDAK",
    metode_bayar: data.metode_bayar || "TUNAI",
    status_bayar: data.status_bayar || "BELUM LUNAS",
  });

  const handleChange = (e: any) => setHwn({ ...hwn, [e.target.name]: e.target.value.toUpperCase() });

  // 🪄 FUNGSI BUKA MODAL EDIT (Isi form sesuai orang yang diklik)
  const handleActionOpenEdit = (item: any) => {
    setSelectedMember(item);
    setHwn({
      bentuk: item.bentuk || "UANG",
      uang: item.uang?.toString() || "",
      penyembelihan: item.penyembelihan || "",
      melihat: item.melihat ? "YA" : "TIDAK",
      menyembelih: item.menyembelih ? "YA" : "TIDAK",
      jml_bagian: item.jml_bagian?.toString() || "",
      pembagian: item.pembagian || "",
      pesan_bagian: item.pesan_bagian || "",
      kel_sapi: item.kel_sapi || "",
      no_uq: item.no_uq || "",
      penyaluran: item.penyaluran || "DALAM",
      lokasi: item.lokasi || "",
      keterangan: item.keterangan || "",
      penerima: item.penerima || "",
      petugas: item.petugas || "",
      sebab: item.sebab || "",
      biaya_operasional: item.biaya_operasional?.toString() || "",
      pindah_sapi: item.pindah_sapi ? "YA" : "TIDAK",
      penyaluran_luar: item.penyaluran_luar ? "YA" : "TIDAK",
      metode_bayar: item.metode_bayar || "TUNAI",
      status_bayar: item.status_bayar || "BELUM LUNAS",
    });
    setIsEditOpen(true);
  };

  // 🪄 FUNGSI BUKA MODAL DELETE
  const handleActionOpenDelete = (item: any) => {
    setSelectedMember(item);
    setIsDeleteOpen(true);
  };

  const executeUpdate = async () => {
    if (!selectedMember) return;
    setIsSubmitting(true);
    const toastId = toast.loading("Memperbarui data hewan...");
    const res = await updateHewan(selectedMember.id_hewan, hwn); // Pakai ID spesifik!
    if (res.success) {
      toast.success(res.message, { id: toastId });
      setIsEditOpen(false);
    } else {
      toast.error(res.message, { id: toastId });
    }
    setIsSubmitting(false);
  };

  const executeDelete = async () => {
    if (!selectedMember) return;
    setIsSubmitting(true);
    const toastId = toast.loading("Menghapus hewan...");
    const res = await deleteHewan(selectedMember.id_hewan); // Pakai ID spesifik!
    if (res.success) {
      toast.success(res.message, { id: toastId });
      setIsDeleteOpen(false);
    } else {
      toast.error(res.message, { id: toastId });
    }
    setIsSubmitting(false);
  };

  const handleOpenPreview = async () => {
    setIsPreviewOpen(true);
    setIsLoadingPdf(true);
    try {
      const payload = {
        nama: data.pengqurban?.nama_lengkap || "Tanpa Nama",
        alamat: data.pengqurban?.alamat || "-", 
        noKuitansi: data.nkw_pengqurban || "-",
        noId: data.no_id_lama || "-",
        jenis: data.jenis_qurban === "1" ? "Kambing" : "Sapi",
        daging: data.bentuk || "UANG",
        keterangan: data.pesan_bagian || "-",
        bagian: data.jml_bagian?.toString() || "1",
        statusLuar: data.penyaluran || "DALAM",
        noKambing: data.no_id_lama ? data.no_id_lama.slice(-2) : "00" 
      };

      const res = await fetch('/api/generate-kambing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Gagal memproses PDF');
      const blob = await res.blob();
      setPdfUrl(URL.createObjectURL(blob));
    } catch (error) {
      toast.error("Waduh, gagal nampilin preview PDF!");
      setIsPreviewOpen(false);
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    if (pdfUrl) { URL.revokeObjectURL(pdfUrl); setPdfUrl(null); }
  };

  // 👥 Siapin list data shohibul (Kalau individu = array isi 1, kalau grup = array isi 7)
  const membersList = data.isGroup ? data.members : [data];

  return (
    <>
      {/* TOMBOL UTAMA DI TABEL */}
      <div className="flex items-center justify-center gap-2">
        <button onClick={() => setIsDetailOpen(true)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Lihat Detail Rinci">
          <Eye size={16} />
        </button>
        
        {/* Tombol Edit/Delete di tabel utama CUMA MUNCUL kalau dia BUKAN Sapi Patungan */}
        {!data.isGroup && (
          <button onClick={() => handleActionOpenEdit(data)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Data Lengkap">
            <Edit size={16} />
          </button>
        )}

        <button onClick={handleOpenPreview} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Preview Nametag (PDF)">
          <Printer size={16} />
        </button>

        {!data.isGroup && (
          <button onClick={() => handleActionOpenDelete(data)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Hewan">
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* 📄 MODAL PREVIEW PDF (Tetap sama) */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClosePreview} />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-purple-50/50">
              <h3 className="text-xl font-bold text-purple-900 flex items-center gap-2">
                <Printer size={20} className="text-purple-600"/> Preview Nametag
              </h3>
              <button onClick={handleClosePreview} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><X size={22} /></button>
            </div>
            <div className="flex-1 bg-gray-200 relative flex items-center justify-center p-4 sm:p-8">
              {isLoadingPdf ? (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Loader2 size={40} className="animate-spin mb-4 text-purple-600" />
                  <p className="font-bold text-lg animate-pulse">Meracik PDF...</p>
                </div>
              ) : pdfUrl ? (
                <iframe src={pdfUrl} className="w-full h-full rounded-xl shadow-lg border-0 bg-white" title="PDF Preview" />
              ) : (
                <div className="text-center text-red-500"><AlertTriangle size={48} className="mx-auto mb-2" /><p className="font-bold">Gagal memuat PDF.</p></div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-between items-center">
              <p className="text-sm font-medium text-gray-500">Data: <span className="text-gray-800 font-bold">{data.no_id_lama}</span></p>
              <div className="flex gap-3">
                <button onClick={handleClosePreview} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Tutup</button>
                <a href={pdfUrl || "#"} download={`Nametag_${data.no_id_lama || 'Hewan'}.pdf`} className={`px-6 py-2.5 font-bold rounded-xl flex items-center gap-2 transition-all ${!pdfUrl ? "bg-purple-300 text-white/70 cursor-not-allowed" : "bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-500/20"}`} onClick={(e) => !pdfUrl && e.preventDefault()}><Save size={18} /> Download</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 MODAL KONFIRMASI DELETE YANG DINAMIS */}
      {isDeleteOpen && selectedMember && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isSubmitting && setIsDeleteOpen(false)} />
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden z-10 animate-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><AlertTriangle size={32} /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Hewan?</h3>
            <p className="text-sm text-gray-500 mb-6 px-2 break-words whitespace-normal leading-relaxed">
              Yakin mau hapus pesanan qurban milik <span className="font-bold text-gray-800">{selectedMember.pengqurban?.nama_lengkap}</span>?
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

      {/* 🔵 DRAWER LIHAT DETAIL (SUPER UPGRADE!) */}
      {isDetailOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] animate-in fade-in" onClick={() => setIsDetailOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-gray-50 shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Header Laci Detail */}
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Eye size={20} className="text-emerald-600"/> Informasi Rinci Qurban</h3>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full bg-gray-100"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* BLOK 1: INFORMASI FISIK HEWAN */}
              <div className="bg-emerald-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-600/20 mb-6 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10"><CheckCircle2 size={120} /></div>
                <h4 className="font-bold text-emerald-100 text-sm uppercase tracking-widest mb-4">Profil Hewan Qurban</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 relative z-10">
                  <div><p className="text-emerald-200 text-xs">ID Fisik / Kelompok</p><p className="font-bold text-lg">{data.no_id_lama}</p></div>
                  <div><p className="text-emerald-200 text-xs">Jenis Hewan</p><p className="font-bold text-lg">{data.jenis_qurban === "1" ? "Kambing 🐐" : "Sapi 🐄"}</p></div>
                  <div><p className="text-emerald-200 text-xs">Penyaluran</p><p className="font-bold text-md">{data.penyaluran || "Banyak Tujuan"}</p></div>
                  <div><p className="text-emerald-200 text-xs">Total Shohibul</p><p className="font-bold text-md">{membersList.length} Orang</p></div>
                </div>
              </div>

              <h4 className="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
                <User size={18} className="text-emerald-600" /> Daftar Shohibul Qurban
              </h4>

              {/* BLOK 2: LOOPING KARTU SHOHIBUL BESERTA TOMBOLNYA */}
              <div className="space-y-4">
                {membersList.map((m: any, idx: number) => (
                  <div key={m.id_hewan} className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:border-emerald-200 transition-colors">
                    
                    {/* Header Kartu Shohibul + Tombol Aksi */}
                    <div className="flex justify-between items-start border-b border-gray-100 pb-3 mb-4">
                      <div className="pr-2">
                        <h5 className="font-bold text-gray-800 leading-tight">
                          <span className="text-emerald-600 mr-1">{idx + 1}.</span> {m.pengqurban?.nama_lengkap || "Tanpa Nama"}
                        </h5>
                        <p className="text-xs font-mono text-gray-400 mt-1">NKW: {m.nkw_pengqurban}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleActionOpenEdit(m)} className="p-1.5 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors" title="Edit Data Ini">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleActionOpenDelete(m)} className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors" title="Hapus Data Ini">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Isi Rincian Qurban Per Orang */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-3">
                      <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Nominal Titipan</p><p className="font-bold text-sm text-gray-700">{m.uang ? `Rp ${m.uang.toLocaleString('id-ID')}` : "-"}</p></div>
                      <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Bentuk Titipan</p><p className="font-bold text-sm text-gray-700">{m.bentuk || "-"}</p></div>
                      <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Hadir Melihat</p><p className="font-bold text-sm text-gray-700">{m.melihat ? "YA 👀" : "TIDAK"}</p></div>
                      <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Ikut Menyembelih</p><p className="font-bold text-sm text-gray-700">{m.menyembelih ? "YA 🔪" : "TIDAK"}</p></div>
                      <div className="col-span-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Alamat</p>
                        <p className="font-medium text-xs text-gray-600 leading-snug mt-0.5">{m.pengqurban?.alamat || "-"}</p>
                      </div>
                    </div>

                    {/* Pesan Bagian (Hanya muncul kalau ada) */}
                    {m.pesan_bagian && (
                      <div className="mt-4 bg-orange-50/50 border border-orange-100 p-3 rounded-xl">
                        <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wide mb-1 flex items-center gap-1">
                          <AlertTriangle size={12} /> Pesan Bagian Khusus
                        </p>
                        <p className="text-sm font-medium text-gray-800 leading-snug">{m.pesan_bagian}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </>
      )}

      {/* 🟠 DRAWER EDIT FULL (Tetap mantap kayak kemarin!) */}
      {isEditOpen && selectedMember && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-in fade-in" onClick={() => setIsEditOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-gray-50 shadow-2xl z-[110] flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Header Laci Edit */}
            <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2"><Edit size={20}/> Edit Data Qurban</h3>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  Milik: <span className="font-bold text-gray-800">{selectedMember.pengqurban?.nama_lengkap}</span>
                </p>
              </div>
              <button onClick={() => setIsEditOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors bg-gray-100"><X size={22} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              
              {/* KELOMPOK 1: INFORMASI DASAR */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                <h4 className="font-bold text-emerald-800 border-b border-gray-100 pb-3">Informasi Dasar</h4>
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
                  <div className="space-y-1.5 flex flex-col col-span-2">
                    <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Kelompok Sapi (Opsional)</label>
                    <input type="text" name="kel_sapi" value={hwn.kel_sapi} onChange={handleChange} placeholder="Contoh: A, 1, JURAGAN" className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
                  </div>
                </div>
              </div>

              {/* KELOMPOK 2: PENYEMBELIHAN & DISTRIBUSI */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                <h4 className="font-bold text-blue-800 border-b border-gray-100 pb-3">Penyembelihan & Distribusi</h4>
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
                  <label className="text-xs font-bold text-orange-600 uppercase tracking-wider">Pesan Bagian Khusus</label>
                  <textarea name="pesan_bagian" rows={2} value={hwn.pesan_bagian} onChange={handleChange} placeholder="Contoh: Kepala utuh, kulit minta 1/2" className="w-full px-4 py-3 bg-orange-50/30 border border-orange-200 rounded-xl text-sm uppercase resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500" />
                </div>
              </div>

              {/* KELOMPOK 3: INFORMASI LAINNYA */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-3">Informasi Lainnya</h4>
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

            {/* 🧩 KELOMPOK BARU: ADMINISTRASI & PEMBAYARAN */}
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 shadow-sm space-y-5">
              <h4 className="font-bold text-blue-800 border-b border-blue-100 pb-3 italic">Status & Administrasi (Form Hijau)</h4>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase">Metode Bayar</label>
                  <select name="metode_bayar" value={hwn.metode_bayar} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold">
                    <option value="TUNAI">TUNAI 💵</option>
                    <option value="TRANSFER">TRANSFER 💳</option>
                  </select>
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase">Status Bayar</label>
                  <select name="status_bayar" value={hwn.status_bayar} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold">
                    <option value="LUNAS">LUNAS ✅</option>
                    <option value="DP">DP 💰</option>
                    <option value="BELUM LUNAS">BELUM LUNAS ❌</option>
                  </select>
                </div>

                {/* OPSI DINAMIS: Cuma muncul kalau Jenisnya Kambing */}
                {(data.jenis_qurban === "1") && (
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-orange-600 uppercase">Pindah ke Sapi?</label>
                    <select name="pindah_sapi" value={hwn.pindah_sapi} onChange={handleChange} className="w-full px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl text-sm font-bold text-orange-700">
                      <option value="TIDAK">TIDAK</option>
                      <option value="YA">YA (BERSEDIA)</option>
                    </select>
                  </div>
                )}

                {/* OPSI DINAMIS: Biaya Operasional cuma muncul kalau Bentuknya HEWAN */}
                {hwn.bentuk === "HEWAN" && (
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-red-600 uppercase tracking-wider underline">Biaya Operasional (Hewan Hidup)</label>
                    <input type="number" name="biaya_operasional" value={hwn.biaya_operasional} onChange={handleChange} placeholder="Contoh: 100000" className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm font-bold text-red-700 focus:ring-red-500" />
                  </div>
                )}
                
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase">Keluar ITS?</label>
                  <select name="penyaluran_luar" value={hwn.penyaluran_luar} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold uppercase">
                    <option value="TIDAK">TIDAK (INTERNAL)</option>
                    <option value="YA">YA (LUAR ITS)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer Laci Edit */}
            <div className="p-6 border-t border-gray-200 bg-white flex justify-end gap-3 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] relative z-10">
              <button onClick={() => setIsEditOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">Batal</button>
              <button onClick={executeUpdate} disabled={isSubmitting} className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-white ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30"}`}>
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Menyimpan...</> : <><Save size={18} /> Update Data</>}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}