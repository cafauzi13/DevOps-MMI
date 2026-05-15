"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Beef, ClipboardList, Receipt, LogOut, Building2, Wallet, Globe } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useSidebar } from "./SidebarContext";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Pengqurban", href: "/admin/pengqurban", icon: Users },
  { name: "Data Hewan", href: "/admin/hewan", icon: Beef },
  { name: "Inputan Online", href: "/admin/inputan-online", icon: Globe },
  { name: "Permohonan", href: "/admin/permohonan", icon: Building2 }, // 🏢 MENU BARU!
  { name: "Petugas Jaga", href: "/admin/petugas", icon: ClipboardList },
  { name: "Setoran", href: "/admin/setoran", icon: Wallet }, // 💳 MENU BARU!
  { name: "Kuitansi", href: "/admin/kuitansi", icon: Receipt },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar Drawer */}
      <aside 
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
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
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = item.href === "/admin" 
            ? pathname === "/admin" 
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-mmi text-white shadow-lg shadow-mmi/20" 
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
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Keluar Sistem</span>
        </button>
      </div>
      </aside>
    </>
  );
}