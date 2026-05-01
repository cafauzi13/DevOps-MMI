"use client";

import { useState, useEffect } from "react";
import { Plus, X, Save, User, Phone, MapPin, Hash, Map, BadgeCheck, Search, Users, ChevronDown, Loader2 } from "lucide-react";
import { getPetugasJaga } from "@/app/actions/petugas";
import { createPengqurban } from "@/app/actions/pengqurban";
import toast from "react-hot-toast";

const wilayahCodes = ["ITS", "ITSA", "ITSB", "ITSC", "ITSD", "ITSE", "ITSF", "ITSG", "ITSH", "ITSI", "ITSJ", "ITSK", "ITSL", "ITSM", "ITSN", "ITSO", "ITSP", "ITSQ", "ITSR", "ITSS", "ITST", "ITSU", "ITSV", "ITSW", "ITSX", "LUAR"];
const formatWilayah = (kode: string) => (kode === "ITS" || kode === "LUAR") ? kode : `ITS - Blok ${kode.replace("ITS", "")}`;

export default function FormPengqurbanDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // State buat efek loading
  
  // State Input Text
  const [nkw, setNkw] = useState("");
  const [noUrut, setNoUrut] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [telepon, setTelepon] = useState("");
  const [alamat, setAlamat] = useState("");

  const [dbPetugas, setDbPetugas] = useState<{id_petugas: string, id_lama: string, nama: string}[]>([]);  
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  
  const [isWilayahOpen, setIsWilayahOpen] = useState(false);
  const [selectedWilayah, setSelectedWilayah] = useState("");

  const [searchPetugas, setSearchPetugas] = useState("");
  const [selectedPetugasId, setSelectedPetugasId] = useState("");

  const [selectedPetugasIdLama, setSelectedPetugasIdLama] = useState(""); 
  const [showPetugasDropdown, setShowPetugasDropdown] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getPetugasJaga().then((res) => {
        if (res.success) setDbPetugas(res.data);
      });
    }
  }, [isOpen]);

  const filteredPetugas = dbPetugas.filter(p => 
    p.nama.toLowerCase().includes(searchPetugas.toLowerCase())
  );

  // FUNGSI UTAMA BUAT NGESAVE DATA 🔥
  const handleSaveData = async () => {
    if (!nkw || !namaLengkap) {
      alert("🚨 NKW dan Nama Lengkap wajib diisi ya!");
      return;
    }

    setIsSubmitting(true);

    const toastId = toast.loading("Sedang menyimpan data...");

    const res = await createPengqurban({
      nkw,
      no_urut: noUrut,
      nama_lengkap: namaLengkap,
      jenis_kelamin: selectedGender,
      telepon,
      kd_wilayah: selectedWilayah,
      alamat,
      id_petugas: selectedPetugasId
    });

    if (res.success) {
      toast.success(res.message, { id: toastId });
      setNkw(""); setNoUrut(""); setNamaLengkap(""); setTelepon(""); setAlamat("");
      setSelectedGender(""); setSelectedWilayah(""); setSelectedPetugasId(""); 
      setSelectedPetugasIdLama(""); setSearchPetugas("");
      setIsOpen(false); 
    } else {
      toast.error(res.message, { id: toastId });
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-mmi hover:bg-mmi-hover text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm">
        <Plus size={18} /> Tambah Data
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] animate-in fade-in" onClick={() => setIsOpen(false)} />
      )}

      <div className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-xl font-bold text-admin-text">Tambah Shohibul Qurban</h3>
            <p className="text-sm text-gray-500 mt-1">Lengkapi data pengqurban sesuai form pendaftaran</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {/* Kalau ada dropdown yang kebuka, layar transparan ini bakal muncul di belakangnya buat nangkep klik di luar area */}
          {(isGenderOpen || isWilayahOpen || showPetugasDropdown) && (
            <div 
              className="fixed inset-0 z-[75]" 
              onClick={() => {
                setIsGenderOpen(false);
                setIsWilayahOpen(false);
                setTimeout(() => setShowPetugasDropdown(false), 150);
              }}
            />
          )}
                    
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Hash size={16} className="text-mmi" /> Nomor Kwitansi *</label>
              <input type="text" value={nkw} onChange={(e) => setNkw(e.target.value)} required placeholder="Contoh: 1447001" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mmi/20 focus:border-mmi text-sm font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Nomor Urut</label>
              <input type="number" value={noUrut} onChange={(e) => setNoUrut(e.target.value)} placeholder="Contoh: 1" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mmi/20 focus:border-mmi text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700">Nama Lengkap *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} required placeholder="Nama Shohibul Qurban (Beserta Gelar)" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mmi/20 focus:border-mmi text-sm" />
              </div>
            </div>
            
            <div className={`space-y-2 relative ${isGenderOpen ? 'z-[80]' : ''}`}>
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Users size={16} className="text-gray-400" /> Jenis Kelamin</label>
              <div onClick={() => setIsGenderOpen(!isGenderOpen)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-mmi/50 transition-colors">
                <span className={`text-sm ${selectedGender ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                  {selectedGender === "L" ? "Laki-laki" : selectedGender === "P" ? "Perempuan" : "Pilih Gender..."}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isGenderOpen ? "rotate-180" : ""}`} />
              </div>
              {isGenderOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2">
                  <button onClick={() => { setSelectedGender("L"); setIsGenderOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-mmi/10 hover:text-mmi font-medium transition-colors">Laki-laki</button>
                  <button onClick={() => { setSelectedGender("P"); setIsGenderOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-mmi/10 hover:text-mmi font-medium transition-colors">Perempuan</button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Nomor Telepon/WA</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" value={telepon} onChange={(e) => setTelepon(e.target.value)} placeholder="081234567890" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mmi/20 focus:border-mmi text-sm" />
              </div>
            </div>
            
            <div className={`space-y-2 relative ${isWilayahOpen ? 'z-[80]' : ''}`}>
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Map size={16} className="text-mmi" /> Asal Pengqurban</label>
              <div onClick={() => setIsWilayahOpen(!isWilayahOpen)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-mmi/50 transition-colors">
                <span className={`text-sm ${selectedWilayah ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                  {selectedWilayah ? formatWilayah(selectedWilayah) : "Pilih Asal Wilayah..."}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isWilayahOpen ? "rotate-180" : ""}`} />
              </div>
              {isWilayahOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                  {wilayahCodes.map((kode) => (
                    <button key={kode} onClick={() => { setSelectedWilayah(kode); setIsWilayahOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-mmi/10 hover:text-mmi transition-colors ${selectedWilayah === kode ? 'bg-mmi/5 text-mmi font-bold' : 'text-gray-600'}`}>
                      {formatWilayah(kode)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Alamat Lengkap</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <textarea rows={3} value={alamat} onChange={(e) => setAlamat(e.target.value)} placeholder="Alamat lengkap shohibul qurban..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mmi/20 focus:border-mmi text-sm resize-none"></textarea>
            </div>
          </div>

          <div className={`space-y-2 pt-4 border-t border-gray-100 relative ${showPetugasDropdown ? 'z-[80]' : ''}`}>
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><BadgeCheck size={16} className="text-orange-500" /> Petugas Jaga (Penerima)</label>
            <div className="flex gap-3 relative">
              {/* TAMPILIN ID LAMA DI SINI */}
              <input type="text" readOnly value={selectedPetugasIdLama} placeholder="ID Auto" className="w-1/3 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none text-sm font-bold font-mono text-gray-600 cursor-not-allowed" />
              <div className="relative w-2/3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  value={searchPetugas}
                  onChange={(e) => { setSearchPetugas(e.target.value); setShowPetugasDropdown(true); }}
                  onFocus={() => setShowPetugasDropdown(true)}
                  placeholder="Ketik nama petugas..." 
                  className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all" 
                />
                
                {showPetugasDropdown && (
                  <div className="absolute bottom-full mb-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-40 overflow-y-auto">
                    {filteredPetugas.length > 0 ? (
                      filteredPetugas.map((p) => (
                        <button 
                          key={p.id_petugas} 
                          onClick={() => { 
                            setSelectedPetugasId(p.id_petugas); // Simpen UUID diam-diam
                            setSelectedPetugasIdLama(p.id_lama); // Tampilin ID Lama
                            setSearchPetugas(p.nama); 
                            setShowPetugasDropdown(false); 
                          }} 
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-gray-50 last:border-none flex justify-between items-center"
                        >
                          <span className="font-bold">{p.nama}</span>
                          {/* GANTI JADI p.id_lama */}
                          <span className="text-[11px] text-gray-500 ml-2 font-mono truncate bg-gray-100 px-2 py-0.5 rounded-md">{p.id_lama}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">Data Petugas tidak ditemukan</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button onClick={() => setIsOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors">Batal</button>
          {/* Tombol Simpan dengan status Loading */}
          <button 
            onClick={handleSaveData} 
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md text-white ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed shadow-none" : "bg-mmi hover:bg-mmi-hover shadow-mmi/20"
            }`}
          >
            {isSubmitting ? (
              <><Loader2 size={18} className="animate-spin" /> Menyimpan...</>
            ) : (
              <><Save size={18} /> Simpan Data</>
            )}
          </button>
        </div>
      </div>
    </>
  );
}