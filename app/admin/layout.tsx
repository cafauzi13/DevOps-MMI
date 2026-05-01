import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  
  // 2. Baca cookie tahun yang lagi aktif dari server
  const cookieStore = await cookies();
  const activeYear = cookieStore.get("selectedYear")?.value || "Semua";

  return (
    <div className="min-h-screen bg-admin-bg flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        {/* 3. Lempar activeYear ke Topbar */}
        <Topbar 
          userName={session?.user?.name || "Tanpa Nama"} 
          userRole="Administrator" 
          initialYear={activeYear} 
        />
        <main className="p-8 flex-1">
          {children}
        </main>
        {/* <--- 2. Taruh Toaster di sini */}
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
    </div>
  );
}