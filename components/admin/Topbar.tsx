"use client";

import { usePathname } from "next/navigation";
import { Bell, UserCircle, Calendar, ChevronDown } from "lucide-react"; // Tambah ChevronDown
import { setYearFilter } from "@/app/actions/filter";
import { useState } from "react";

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
  const [activeYear, setActiveYear] = useState(initialYear);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State buat buka-tutup menu

  const yearOptions = ["Semua", "2026", "2025", "2024"]; // Daftar opsi tahun

  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard Utama";
    if (pathname.includes("pengqurban")) return "Data Pengqurban";
    if (pathname.includes("hewan")) return "Manajemen Hewan";
    return "Sistem Qurban RDK 47";
  };

  // Fungsi ganti tahun yang baru
  const handleYearChange = async (year: string) => {
    setActiveYear(year);
    setIsDropdownOpen(false); // Tutup dropdown habis milih
    await setYearFilter(year); 
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
              {activeYear === "Semua" ? "Semua Waktu" : `Tahun ${activeYear}`}
            </span>
            <ChevronDown 
              size={16} 
              className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} 
            />
          </button>

          {/* Menu Dropdown yang Melayang */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-xl shadow-gray-200/50 overflow-hidden z-50 py-1 animate-in fade-in slide-in-from-top-2">
              {yearOptions.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-mmi/10 hover:text-mmi flex items-center justify-between ${
                    activeYear === year ? "bg-mmi/5 text-mmi font-bold" : "text-gray-600"
                  }`}
                >
                  {year === "Semua" ? "Semua Waktu" : `Tahun ${year}`}
                  {/* Kasih titik ijo kalau lagi dipilih */}
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
            <p className="text-xs text-mmi font-medium">{userRole || "Staf"}</p>
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