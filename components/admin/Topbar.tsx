"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Bell, UserCircle, Calendar, ChevronDown } from "lucide-react"; 
import { setYearFilter } from "@/app/actions/filter";
import { useState } from "react";
import { generateHijriYearList } from "@/app/lib/hijri";

export default function Topbar({ 
  userName, 
  userRole, 
  initialYear = "Semua" 
}: { 
  userName?: string, 
  userRole?: string,
  initialYear?: string 
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 👉 Bikin array list tahun yang bener (ditambah "Semua" di awal)
  const dynamicYears = generateHijriYearList();
  const yearList = ["Semua", ...dynamicYears]; 

  // 👉 Ambil activeYear langsung dari URL biar sinkron 100%
  const activeYear = searchParams.get("year") || initialYear;

  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard Utama";
    if (pathname.includes("pengqurban")) return "Data Pengqurban";
    if (pathname.includes("hewan")) return "Manajemen Hewan";
    return "Sistem Qurban RDK 47";
  };

  // Fungsi ganti tahun yang beneran ngubah URL!
  const handleYearChange = async (year: string) => {
    setIsDropdownOpen(false); // Tutup dropdown habis milih
    
    // 1. UPDATE URL PARAMS BIAR HALAMAN REFRESH DATANYA
    const params = new URLSearchParams(searchParams.toString());
    if (year === "Semua") {
      params.delete("year");
    } else {
      params.set("year", year);
    }
    router.push(`${pathname}?${params.toString()}`);

    // 2. FUNGSI BAWAAN KAMU TETEP JALAN
    try {
      await setYearFilter(year); 
    } catch (error) {
      console.error("Gagal set year filter action", error);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-50">
      <h2 className="text-xl font-bold text-admin-text">{getPageTitle()}</h2>

      <div className="flex items-center gap-6">
        
        {/* === CUSTOM UI DROPDOWN TAHUN === */}
        <div className="relative">
          {/* Tombol Dropdown */}
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl text-sm transition-all focus:ring-2 focus:ring-mmi/20"
          >
            <Calendar size={16} className="text-mmi" />
            <span className="font-bold text-gray-700">
              {activeYear === "Semua" ? "Semua Waktu" : `Tahun ${activeYear} H`}
            </span>
            <ChevronDown 
              size={16} 
              className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} 
            />
          </button>

          {/* Menu Dropdown yang Melayang */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-xl shadow-gray-200/50 overflow-hidden z-50 py-1 animate-in fade-in slide-in-from-top-2">
              {yearList.map((year: string) => (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-mmi/10 hover:text-mmi flex items-center justify-between ${
                    activeYear === year ? "bg-mmi/5 text-mmi font-bold" : "text-gray-600"
                  }`}
                >
                  {year === "Semua" ? "Semua Waktu" : `Tahun ${year} H`}
                  
                  {activeYear === year && (
                    <div className="w-1.5 h-1.5 rounded-full bg-mmi"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifikasi & Profil */}
        <button className="text-gray-400 hover:text-mmi transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-admin-text leading-tight">{userName || "User"}</p>
            {/* Aku panggil relasi jabatan kamu di sertifikat buat nampilin rolenya sekalian kalau kosong wkwkwk */}
            <p className="text-xs text-mmi font-medium">{userRole || "STAFF"}</p>
          </div>
          <div className="w-9 h-9 bg-mmi-light rounded-full flex items-center justify-center text-mmi">
            <UserCircle size={24} />
          </div>
        </div>
      </div>
      
      {/* Invisible overlay buat nutup dropdown kalau user klik di luar */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}
    </header>
  );
}