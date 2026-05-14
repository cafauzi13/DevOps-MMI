import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full animate-in fade-in duration-300">
      <div className="p-4 bg-emerald-50 rounded-full mb-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
      <h3 className="text-xl font-bold text-emerald-900 mb-1">Memuat Data...</h3>
      <p className="text-sm text-emerald-600/70 font-medium">
        Tunggu bentar ya, lagi narik data dari brankas server 🚀
      </p>
    </div>
  );
}