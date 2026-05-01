export default function AdminDashboardPage() {
  return (
    <div className="bg-admin-card rounded-2xl p-10 shadow-sm border border-gray-100">
      <h1 className="text-4xl font-bold text-mmi mb-4">
        🎉 Selamat Datang di Dashboard Admin!
      </h1>
      <p className="text-lg text-admin-text mb-2">
        Sistem autentikasi RBAC sukses. Halaman ini sudah terhubung dengan Tailwind v4! 🟢✨
      </p>
      <p className="text-sm text-mmi-muted">
        (Kalau kamu bisa baca ini dan warnanya ijo khas MMI, berarti styling kita udah sukses besar!)
      </p>
    </div>
  );
}