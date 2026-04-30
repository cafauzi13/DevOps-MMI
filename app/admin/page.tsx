import { getServerSession } from "next-auth";

export default async function AdminDashboardPage() {
  // Kita bisa narik data session buat nampilin nama atau role-nya
  const session = await getServerSession();

  return (
    <div className="min-h-screen bg-white text-black p-10">
      <div className="max-w-4xl mx-auto border-2 border-dashed border-gray-300 rounded-xl p-10 text-center">
        <h1 className="text-4xl font-bold mb-4">
          🎉 Selamat Datang di Dashboard Admin!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sistem autentikasi RBAC sukses. Halo, <span className="font-bold text-blue-600">{session?.user?.name || 'Panitia'}</span>!
        </p>
        <p className="text-md text-gray-500">
          (Halaman ini nanti bakal kita rombak dan kita kasih Sidebar + Topbar yang kece di Task selanjutnya)
        </p>
      </div>
    </div>
  );
}