/**
 * Mengubah elemen surat (yang sudah ditata A4) menjadi PDF di sisi browser.
 * Hasilnya berupa blob URL supaya bisa langsung dibuka di PDF viewer bawaan
 * browser, bukan diunduh sebagai berkas.
 */
export async function buatPdfSurat(element: HTMLElement): Promise<string> {
  await tungguAset(element);

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas-pro'),
    import('jspdf')
  ]);

  const bayangan = element.style.boxShadow;
  const radius = element.style.borderRadius;
  element.style.boxShadow = 'none';
  element.style.borderRadius = '0';

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const lebarHalaman = pdf.internal.pageSize.getWidth();
    const tinggiHalaman = pdf.internal.pageSize.getHeight();
    const pikselPerMm = canvas.width / lebarHalaman;
    const tinggiIsiMm = canvas.height / pikselPerMm;

    if (tinggiIsiMm <= tinggiHalaman + 0.5) {
      // Surat normal muat satu halaman A4.
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.95),
        'JPEG',
        0,
        0,
        lebarHalaman,
        Math.min(tinggiIsiMm, tinggiHalaman),
        undefined,
        'FAST'
      );
    } else {
      // Surat panjang: potong canvas per tinggi halaman A4.
      const tinggiPotongan = Math.floor(tinggiHalaman * pikselPerMm);
      let posisiY = 0;
      let halaman = 0;

      while (posisiY < canvas.height) {
        const tinggi = Math.min(tinggiPotongan, canvas.height - posisiY);
        const potongan = document.createElement('canvas');
        potongan.width = canvas.width;
        potongan.height = tinggi;

        const konteks = potongan.getContext('2d');
        if (!konteks) break;
        konteks.fillStyle = '#ffffff';
        konteks.fillRect(0, 0, potongan.width, potongan.height);
        konteks.drawImage(
          canvas,
          0,
          posisiY,
          canvas.width,
          tinggi,
          0,
          0,
          canvas.width,
          tinggi
        );

        if (halaman > 0) pdf.addPage();
        pdf.addImage(
          potongan.toDataURL('image/jpeg', 0.95),
          'JPEG',
          0,
          0,
          lebarHalaman,
          tinggi / pikselPerMm,
          undefined,
          'FAST'
        );

        posisiY += tinggi;
        halaman += 1;
      }
    }

    return pdf.output('bloburl').toString();
  } finally {
    element.style.boxShadow = bayangan;
    element.style.borderRadius = radius;
  }
}

/** Pastikan font dan gambar TTD selesai dimuat sebelum dirender. */
async function tungguAset(element: HTMLElement): Promise<void> {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const gambar = Array.from(element.querySelectorAll('img'));
  await Promise.all(
    gambar.map(
      (img) =>
        new Promise<void>((selesai) => {
          if (img.complete && img.naturalWidth > 0) {
            selesai();
            return;
          }
          img.addEventListener('load', () => selesai(), { once: true });
          img.addEventListener('error', () => selesai(), { once: true });
        })
    )
  );

  await new Promise<void>((selesai) =>
    requestAnimationFrame(() => requestAnimationFrame(() => selesai()))
  );
}
