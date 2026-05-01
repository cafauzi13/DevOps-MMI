"use client";

import { useState } from "react";
import { Trash2, Edit, AlertTriangle, Loader2 } from "lucide-react";
import { deletePengqurban } from "@/app/actions/pengqurban";
import toast from "react-hot-toast";

export default function PengqurbanActionButtons({ nkw }: { nkw: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fungsi Eksekusi Hapus Beneran
  const executeDelete = async () => {
    setIsDeleting(true);
    const toastId = toast.loading("Menghapus data...");
    
    const res = await deletePengqurban(nkw);
    
    if (res.success) {
      toast.success(res.message, { id: toastId });
      setIsModalOpen(false); // Tutup modal kalau sukses
    } else {
      toast.error(res.message, { id: toastId });
    }
    setIsDeleting(false);
  };

  // Fungsi Tombol Edit (Dikunci dlu wkwk)
  const handleEdit = () => {
    toast("Fitur Edit ditahan dulu. Mas PO-nya disuruh tidur! 😴", {
      icon: '🔒',
      style: { borderRadius: '10px', background: '#333', color: '#fff' }
    });
  };

  return (
    <>
      {/* Tombol Aksi Tabel */}
      <div className="flex items-center gap-2">
        <button 
          onClick={handleEdit} 
          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit Data"
        >
          <Edit size={18} />
        </button>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Hapus Data"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* MODAL KONFIRMASI ESTETIK ✨ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay Gelap */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in"
            onClick={() => !isDeleting && setIsModalOpen(false)}
          />
          
          {/* Box Modal */}
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              {/* Ikon Warning */}
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <AlertTriangle size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-admin-text mb-2">Hapus Data?</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed px-2">
                {`Yakin mau hapus data shohibul qurban dengan NKW`}
                <br />
                <span className="font-bold text-gray-800 text-base">#{nkw}</span>?
                <br />
                {`Tindakan ini tidak bisa dibatalkan.`}
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button 
                  onClick={executeDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-md shadow-red-500/20 disabled:opacity-50 disabled:shadow-none"
                >
                  {isDeleting ? <Loader2 size={18} className="animate-spin" /> : "Ya, Hapus"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}