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
  icons: {
    icon: [
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: '/favicon/site.webmanifest',
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