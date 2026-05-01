"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getPetugasJaga() {
  try {
    const data = await prisma.petugasJaga.findMany({
      orderBy: { nama: 'asc' } // Urutin sesuai abjad biar rapi
    });
    return { success: true, data: data };
  } catch (error) {
    console.error("Gagal narik data petugas:", error);
    return { success: false, data: [] };
  }
}