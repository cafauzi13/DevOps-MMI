export function getActiveHijriYear(): string {
  const today = new Date();
  // Menggunakan API bawaan JS untuk kalender Islam
  const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', { year: 'numeric' });
  const yearString = formatter.format(today);
  
  // Bersihin teks, ambil angkanya doang (Return: "1447")
  return yearString.replace(/\D/g, '');
}

export function generateHijriYearList(): string[] {
  const current = parseInt(getActiveHijriYear());
  
  // 👉 SETINGAN MESIN WAKTU
  const startYear = 1445; // Tahun fondasi awal sistem ini dipakai (bisa diganti misal 1446)
  const endYear = current + 2; // Batas masa depan (Current + 2)
  
  const years = [];
  
  // Looping dari tahun fondasi sampai tahun masa depan
  for (let year = startYear; year <= endYear; year++) {
    years.push(year.toString());
  }
  
  // Nah, kalau kamu lebih suka urutannya dari tahun TERBARU di atas ke LAMA di bawah,
  // hapus // di baris bawah ini dan komen baris years.push di atas:
  // for (let year = endYear; year >= startYear; year--) { years.push(year.toString()); }

  return years;
}