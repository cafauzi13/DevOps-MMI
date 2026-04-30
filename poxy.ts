import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Lempar ke halaman ini kalau ketahuan belum login
  },
});

// Daftarin rute mana aja yang mau dijagain sama satpam ini
export const config = {
  matcher: [
    "/admin/:path*", // Kunci SEMUA halaman yang depannya /admin
  ],
};