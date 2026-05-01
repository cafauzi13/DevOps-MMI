"use server";

import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

// ==========================================
// FUNGSI GET: Mengambil Semua Data Hewan
// ==========================================
export async function getHewanQurban() {
  try {
    const cookieStore = await cookies();
    const selectedYear = cookieStore.get("selectedYear")?.value || "Semua";

    let whereClause = {};
    
    if (selectedYear !== "Semua") {
      const yearInt = parseInt(selectedYear);
      whereClause = {
        // KUNCINYA DI SINI: Kita filter lewat tabel relasinya!
        pengqurban: {
          tanggal: {
            gte: new Date(`${yearInt}-01-01T00:00:00.000Z`),
            lt: new Date(`${yearInt + 1}-01-01T00:00:00.000Z`),
          }
        }
      };
    }

    const data = await prisma.hewanQurban.findMany({
      where: whereClause,
      orderBy: { id_hewan: 'desc' },
      include: {
        pengqurban: {
          select: {
            nama_lengkap: true
          }
        }
      }
    });

    return { success: true, data: data };
  } catch (error) {
    console.error("Gagal narik data hewan:", error);
    return { success: false, message: "Gagal mengambil data hewan." };
  }
}