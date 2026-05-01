import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { getServerSession } from "next-auth"; // Import alat penarik session

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Tarik data session user yang lagi login
  const session = await getServerSession();

  return (
    <div className="min-h-screen bg-admin-bg flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        {/* Lempar namanya ke Topbar! */}
        <Topbar 
          userName={session?.user?.name || "Tanpa Nama"} 
          userRole="Administrator" 
        />
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}