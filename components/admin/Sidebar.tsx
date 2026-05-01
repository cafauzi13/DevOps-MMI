"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Beef, ClipboardList, Receipt, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Pengqurban", href: "/admin/pengqurban", icon: Users },
  { name: "Data Hewan", href: "/admin/hewan", icon: Beef },
  { name: "Petugas Jaga", href: "/admin/petugas", icon: ClipboardList },
  { name: "Kuitansi", href: "/admin/kuitansi", icon: Receipt },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50">
      {/* Logo Section */}
      <div className="p-6 border-bottom border-gray-100 flex items-center gap-3">
        {/* Hapus kotak hijau M, ganti pakai Image */}
          <Image 
            src="/logo-mmi.png" 
            alt="Logo MMI" 
            width={50} 
            height={50} 
            className="w-10 h-auto"
          />
        <div>
          <h1 className="font-bold text-mmi text-sm leading-tight">DASHBOARD</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Manarul Ilmi</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-mmi text-white shadow-lg" 
                  : "text-gray-600 hover:bg-mmi-light hover:text-mmi"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-white" : "text-gray-400 group-hover:text-mmi"} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout Section */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Keluar Sistem</span>
        </button>
      </div>
    </aside>
  );
}