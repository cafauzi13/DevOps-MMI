"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeOff, Eye } from "lucide-react";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Panggil mesin NextAuth
    const res = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false, // Jangan auto-redirect, biar kita bisa handle error
    });

    setIsLoading(false);

    if (res?.error) {
      alert("Waduh, Username atau Password salah nih!");
    } else {
      router.push("/admin"); // Kalau sukses, baru masuk!
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0fdf4] p-4 md:p-8">
      
      {/* Main Card Container */}
      <div className="w-full max-w-[1000px] bg-white rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[600px] border border-gray-100">
        
        {/* === LEFT PANEL (Hero Image & Copywriting) === */}
        <div className="hidden md:flex md:w-1/2 bg-mmi relative p-12 flex-col justify-between overflow-hidden">
          
          {/* Ornamen Background (Biar ijonya nggak flat) */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-white opacity-10 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-black opacity-10 blur-3xl pointer-events-none"></div>

          {/* Konten Utama (Logo + Teks) */}
          <div className="relative z-10 flex flex-col items-start text-white mt-4">
            
            {/* Logo MMI (Pakai komponen Next Image) */}
            <Image 
              src="/logo-mmi-putih.png" 
              alt="Logo Masjid Manarul Ilmi" 
              width={200} 
              height={96} 
              priority
              className="h-24 w-auto mb-10 drop-shadow-lg" 
            />
            
            {/* Teks Copywriting */}
            <h1 className="text-4xl font-extrabold mb-5 tracking-tight leading-tight">
              Masjid Manarul Ilmi <br/> ITS
            </h1>
            <p className="text-lg font-medium leading-relaxed max-w-sm mb-8 text-white/90">
              Kelola data hewan qurban, pantau distribusi daging secara sistematis, akurat, dan transparan!
            </p>
            
            {/* Garis Aksen */}
            <div className="w-16 h-1.5 bg-white/40 rounded-full"></div>
          </div>

          {/* Footer Kiri (Biar balance) */}
          <div className="relative z-10 text-white/60 text-sm font-medium mt-10">
            © 2026 Masjid Manarul Ilmi ITS.
          </div>

        </div>

        {/* === RIGHT PANEL (Login Form) === */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white relative">
          
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang!</h2>
            <p className="text-gray-500 font-medium text-sm">
              Silakan login menggunakan kredensial admin Masjid Manarul Ilmi ITS.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Input Username */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
              <div className="relative">
                <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-4 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mmi/20 focus:border-mmi transition-all bg-white"
                placeholder="admin"
              />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mmi/20 focus:border-mmi transition-all bg-white"
                placeholder="••••••••"
              />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <div className="flex justify-end mt-2">
                <a href="#" className="text-xs font-semibold text-mmi hover:text-mmi-hover transition-colors">
                  Lupa password?
                </a>
              </div>
            </div>

            {/* Button Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-mmi hover:bg-mmi-hover text-white font-bold py-4 rounded-xl transition-all duration-200 flex justify-center items-center gap-2 mt-2 shadow-lg shadow-mmi/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memverifikasi...
                </span>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

        </div>
      </div>
      
    </div>
  );
}