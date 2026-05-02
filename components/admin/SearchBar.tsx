"use client";

import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";

export default function SearchBar({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [term, setTerm] = useState(searchParams.get("q") || "");

  // Fungsi buat nembak kata kunci ke URL setiap kali ngetik
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTerm(value);

    // Pake transisi biar layarnya nggak nge-freeze pas ngetik
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      // Ganti URL-nya secara diam-diam (tanpa reload)
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="relative flex-1 max-w-md">
      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isPending ? 'text-mmi animate-pulse' : 'text-gray-400'}`} size={18} />
      <input 
        type="text" 
        value={term}
        onChange={handleSearch}
        placeholder={placeholder} 
        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mmi/20 focus:border-mmi text-sm transition-all"
      />
    </div>
  );
}