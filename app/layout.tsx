import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AosInit from "@/components/AosInit";

// Setting font-nya
const fontUtama = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Ambil ketebalan yang sering dipake aja
});

export const metadata: Metadata = {
  title: "Dashboard Admin - Masjid Manarul Ilmi",
  description: "Sistem Manajemen Qurban RDK 47 ITS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      {/* Panggil font-nya di tag body */}
      <body className={`${fontUtama.className} bg-admin-bg text-admin-text antialiased`}>
        <AosInit />
        {children}
      </body>
    </html>
  );
}