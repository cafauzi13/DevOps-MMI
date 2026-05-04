import { NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, alamat, noKuitansi, noId, jenis, daging, keterangan, bagian, noKambing, statusLuar } = body;

    const templatePath = path.join(process.cwd(), 'public', 'templates', 'template-nametag-kambing.pdf');
    const existingPdfBytes = fs.readFileSync(templatePath);

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);

    // Load 2 Font: Bold buat Header/Angka Besar, Regular buat isian
    const fontPathBold = path.join(process.cwd(), 'public', 'fonts', 'el-messiri', 'ElMessiri-Bold.ttf');
    const fontBytesBold = fs.readFileSync(fontPathBold);
    const customFontBold = await pdfDoc.embedFont(fontBytesBold);

    const fontPathRegular = path.join(process.cwd(), 'public', 'fonts', 'el-messiri', 'ElMessiri-Regular.ttf');
    const fontBytesRegular = fs.readFileSync(fontPathRegular);
    const customFontRegular = await pdfDoc.embedFont(fontBytesRegular);

    // ... (kode di atasnya biarin sama)
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // 1. SENSOR UKURAN KERTAS OTOMATIS 📏
    const { width, height } = firstPage.getSize();
    
    // 2. BIKIN UKURAN FONT DINAMIS
    const sizeNormal = width * 0.030; 
    const sizeKecil = width * 0.025;
    const sizeJudul = width * 0.045;
    const sizeRaksasa = width * 0.15; 

    // --- MULAI CETAK TEKS DI SINI ---

    // 🟩 CETAK HEADER (Kotak Hijau Atas)
    // Kita naikin Y-nya biar aman 100% di dalam area hijau!
    firstPage.drawText(nama || 'Nama Lengkap Shohibul', {
      x: width * 0.31,  
      y: height * 0.90, // Naik jadi 93% (Tadinya 88%)
      size: sizeJudul,
      font: customFontBold,
      color: rgb(1, 1, 1), 
    });

    firstPage.drawText(alamat || 'Alamat Lengkap', {
      x: width * 0.31,
      y: height * 0.875, // Naik jadi 89% biar gak jadi ninja putih!
      size: sizeKecil,
      font: customFontRegular,
      color: rgb(1, 1, 1),
    });

    // 🔲 CETAK ISIAN DATA (Di dalam Kotak Putih)
    const xIsian = width * 0.30; // Digeser dikit ke kanan biar ada padding
    
    // Semua Y dinaikin sekitar +0.06 biar masuk pas ke dalam box putihnya
    firstPage.drawText(noKuitansi || '-', { x: xIsian, y: height * 0.75, size: sizeNormal, font: customFontRegular, color: rgb(0,0,0) });
    firstPage.drawText(noId || '-', { x: xIsian, y: height * 0.656, size: sizeNormal, font: customFontRegular, color: rgb(0,0,0) });
    firstPage.drawText(jenis || '-', { x: xIsian, y: height * 0.563, size: sizeNormal, font: customFontRegular, color: rgb(0,0,0) });
    firstPage.drawText(daging || '-', { x: xIsian, y: height * 0.47, size: sizeNormal, font: customFontRegular, color: rgb(0,0,0) });
    firstPage.drawText(keterangan || '-', { x: xIsian, y: height * 0.377, size: sizeNormal, font: customFontRegular, color: rgb(0,0,0) });

    // 🏷️ CETAK BAGIAN & STATUS 
    firstPage.drawText(bagian || '1', {
      x: width * 0.435, // Agak geser kanan biar sejajar
      y: height * 0.226, // Dinaikin dikit 
      size: sizeJudul,
      font: customFontBold,
      color: rgb(0,0,0)
    });

    // Ini dipasin ke dalam kotak hijau kiri bawah
    firstPage.drawText(statusLuar || 'DALAM', {
      x: width * 0.075, 
      y: height * 0.05, 
      size: sizeNormal,
      font: customFontBold,
      color: rgb(0.08, 0.40, 0.22) 
    });

    // 🚨 CETAK NO KAMBING RAKSASA (Kanan Bawah)
    firstPage.drawText(noKambing || '00', {
      x: width * 0.60, // Dipasin ke tengah area kosong
      y: height * 0.13, 
      size: sizeRaksasa,
      font: customFontBold,
      color: rgb(0.88, 0.15, 0.15), 
    });

    // 📱 BIKIN & CETAK QR CODE DINAMIS
    // 1. Kita bikin link URL-nya (sementara pakai domain dummy dulu)
    const qrDataUrl = `https://web-qurban-jmmi.com/scan/${noId || 'TEST'}`;
    
    // 2. Generate QR Code jadi bentuk Buffer (gambar murni)
    const qrBuffer = await QRCode.toBuffer(qrDataUrl, {
      errorCorrectionLevel: 'H', // High error correction (biar tetep kebaca walau agak burem)
      margin: 1, // Margin putihnya tipis aja
      width: 200, // Resolusi gambar QR-nya
      color: {
        dark: '#146637', // Warna barcode-nya kita bikin Hijau JMMI! 😎
        light: '#FFFFFF' // Background putih
      }
    });

    // 3. Tempel gambar QR ke dalam PDF
    const qrImage = await pdfDoc.embedPng(qrBuffer);
    
    // 4. Gambar QR-nya di atas kotak putih Figma-mu
    const qrSize = width * 0.18; // Ukurannya sekitar 16% dari lebar kertas
    firstPage.drawImage(qrImage, {
      x: width * 0.036, // Geser ke area kotak kiri bawah
      y: height * 0.094, // Posisinya di atas tulisan DALAM/LUAR
      width: qrSize,
      height: qrSize,
    });

    // 6. Simpan & Kirim... (kode di bawahnya biarin sama)

    const pdfBytes = await pdfDoc.save();
    return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Kupon-Kambing-JMMI.pdf"',
    },
    });

  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json({ error: 'Gagal mencetak PDF' }, { status: 500 });
  }
}