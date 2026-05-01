"use client";

import { usePathname } from "next/navigation";
import { Bell, UserCircle } from "lucide-react";

export default function Topbar({ userName, userRole }: { userName?: string, userRole?: string }) {
  const pathname = usePathname();

  // Bikin judul dinamis berdasarkan URL yang lagi dibuka
  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard Utama";
    if (pathname.includes("pengqurban")) return "Data Pengqurban";
    if (pathname.includes("hewan")) return "Manajemen Hewan";
    if (pathname.includes("petugas")) return "Petugas Jaga";
    if (pathname.includes("kuitansi")) return "Kuitansi & Laporan";
    return "Sistem Qurban Masjid Manarul Ilmi ITS";
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <h2 className="text-xl font-bold text-admin-text">{getPageTitle()}</h2>

      <div className="flex items-center gap-6">
        <button className="text-gray-400 hover:text-mmi transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
          <div className="text-right hidden md:block">
            {/* 2. Panggil props-nya di sini */}
            <p className="text-sm font-bold text-admin-text leading-tight">{userName || "User"}</p>
            <p className="text-xs text-mmi font-medium">{userRole || "Staf"}</p>
          </div>
          <div className="w-9 h-9 bg-mmi-light rounded-full flex items-center justify-center text-mmi">
            <UserCircle size={24} />
          </div>
        </div>
      </div>
    </header>
  );
}