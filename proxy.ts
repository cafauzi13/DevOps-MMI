import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", 
  },
});

// Daftarin rute mana aja yang mau dijagain sama satpam ini
export const config = {
  matcher: [
    "/admin/:path*", 
  ],
};