"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setYearFilter(year: string) {
  // Tambahin "await" di sini!
  const cookieStore = await cookies(); 
  
  // Sekarang baru kita set
  cookieStore.set("selectedYear", year, { maxAge: 60 * 60 * 24 });
  
  revalidatePath("/", "layout");
}