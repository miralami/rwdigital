<script lang="ts">
  import Printer from '@lucide/svelte/icons/printer';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Download from '@lucide/svelte/icons/download';
  import { onMount } from 'svelte';
  import { formatTanggalPanjang } from '$lib/format';
  import { buatPdfSurat } from '$lib/pdf-surat';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();
  const s = $derived(data.detail);

  let menyiapkanPdf = $state(false);
  let pdfError = $state('');

  function cetak() {
    window.print();
  }

  /** Hindari label ganda seperti "Kecamatan Kecamatan Bekasi Barat". */
  function berawalan(nilai: string, awalan: string): string {
    const teks = (nilai ?? '').trim();
    if (!teks) return awalan;
    return teks.toLowerCase().startsWith(awalan.toLowerCase()) ? teks : `${awalan} ${teks}`;
  }

  /**
   * PDF dibuat di browser dari elemen .surat-paper, lalu blob-nya dibuka di
   * tab baru supaya masuk ke PDF viewer bawaan browser (bukan diunduh).
   * Mode `?unduh=1` dipakai tautan "Unduh PDF" dari portal.
   */
  async function bukaPdf(tabBaru = true) {
    if (menyiapkanPdf) return;

    const kertas = document.querySelector<HTMLElement>('.surat-paper');
    if (!kertas) return;

    menyiapkanPdf = true;
    pdfError = '';
    const tab = tabBaru ? window.open('', '_blank') : null;

    try {
      const url = await buatPdfSurat(kertas);
      if (tab) {
        tab.location.href = url;
      } else {
        window.location.replace(url);
      }
    } catch {
      tab?.close();
      pdfError = 'Gagal membuat PDF. Coba gunakan tombol Cetak / Simpan PDF.';
    } finally {
      menyiapkanPdf = false;
    }
  }

  onMount(() => {
    const parameter = new URLSearchParams(window.location.search);
    if (parameter.get('unduh') === '1') {
      void bukaPdf(false);
    }
  });
</script>

<div class="print-container">
  <div class="no-print print-toolbar">
    <button class="btn btn-secondary" onclick={() => history.back()}>
      <ArrowLeft size={16} />
      <span>Kembali</span>
    </button>
    <div class="toolbar-actions">
      <button class="btn btn-secondary" onclick={() => bukaPdf(true)} disabled={menyiapkanPdf}>
        <Download size={16} />
        <span>{menyiapkanPdf ? 'Menyiapkan PDF...' : 'Buka PDF'}</span>
      </button>
      <button class="btn btn-primary" onclick={cetak}>
        <Printer size={16} />
        <span>Cetak / Simpan PDF</span>
      </button>
    </div>
  </div>

  {#if pdfError}
    <p class="no-print pdf-error">{pdfError}</p>
  {/if}

  <div class="surat-paper">
    <!-- Kop Surat Resmi -->
    <div class="kop-surat">
      <div class="kop-teks">
        <h2>PEMERINTAH {berawalan(s.kota, 'Kota').toUpperCase()}</h2>
        <h3>
          {berawalan(s.kecamatan, 'Kecamatan').toUpperCase()} • {berawalan(s.kelurahan, 'Kelurahan').toUpperCase()}
        </h3>
        <h1>RUKUN WARGA {s.namaRw.toUpperCase()}</h1>
        <p>
          Sekretariat: {s.alamatKk}, {berawalan(s.kelurahan, 'Kelurahan')},
          {berawalan(s.kecamatan, 'Kecamatan')}, {berawalan(s.kota, 'Kota')}
        </p>
      </div>
    </div>
    <div class="kop-garis"></div>

    <!-- Judul & Nomor Surat -->
    <div class="judul-surat">
      <h4>SURAT KETERANGAN / PENGANTAR</h4>
      <p class="nomor-surat">Nomor: {s.nomorSurat ?? '470/___/RW.01/____'}</p>
    </div>

    <!-- Isi Surat -->
    <div class="isi-surat">
      <p>
        Yang bertanda tangan di bawah ini, Pengurus Rukun Warga {s.namaRw}
        {berawalan(s.kelurahan, 'Kelurahan')}, {berawalan(s.kecamatan, 'Kecamatan')}, {berawalan(s.kota, 'Kota')},
        dengan ini menerangkan bahwa:
      </p>

      <table class="tabel-biodata">
        <tbody>
          <tr>
            <td class="col-label">Nama Lengkap</td>
            <td class="col-sep">:</td>
            <td class="col-val font-bold">{s.namaWarga}</td>
          </tr>
          <tr>
            <td class="col-label">Nomor Induk Kependudukan (NIK)</td>
            <td class="col-sep">:</td>
            <td class="col-val">{s.nikWarga}</td>
          </tr>
          <tr>
            <td class="col-label">Nomor Kartu Keluarga (KK)</td>
            <td class="col-sep">:</td>
            <td class="col-val">{s.noKk}</td>
          </tr>
          <tr>
            <td class="col-label">Tempat, Tanggal Lahir</td>
            <td class="col-sep">:</td>
            <td class="col-val">{s.tempatLahir}, {s.tanggalLahir}</td>
          </tr>
          <tr>
            <td class="col-label">Jenis Kelamin</td>
            <td class="col-sep">:</td>
            <td class="col-val">{s.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
          </tr>
          <tr>
            <td class="col-label">Agama</td>
            <td class="col-sep">:</td>
            <td class="col-val">{s.agama}</td>
          </tr>
          <tr>
            <td class="col-label">Pekerjaan</td>
            <td class="col-sep">:</td>
            <td class="col-val">{s.pekerjaan ?? '—'}</td>
          </tr>
          <tr>
            <td class="col-label">Alamat / Tempat Tinggal</td>
            <td class="col-sep">:</td>
            <td class="col-val">{s.alamatKk}, RT {s.nomorRt} / {s.namaRw}</td>
          </tr>
        </tbody>
      </table>

      <p>
        Adalah benar warga yang bertempat tinggal di lingkungan kami dan tercatat dalam administrasi kependudukan {s.namaRw}.
      </p>

      <p>
        Surat keterangan ini diberikan atas permintaan yang bersangkutan untuk keperluan:
        <br />
        <strong class="keperluan-box">"{s.keperluan}"</strong>
      </p>

      <p>
        Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
      </p>
    </div>

    <!-- Tanda Tangan -->
    <div class="ttd-section">
      <div class="ttd-tanggal">
        {s.kota}, {formatTanggalPanjang(s.tanggalTerbit ?? new Date())}
      </div>

      <div class="ttd-grid" class:single={!(s.butuhTtdRt && s.butuhTtdRw)}>
        {#if s.butuhTtdRt}
          <div class="ttd-kolom">
            <p>Mengetahui,</p>
            <p class="jabatan">{s.ttdRtJabatan ?? `Ketua RT ${s.nomorRt}`}</p>
            <div class="ttd-space">
              {#if s.ttdRtUrl}
                <img src={s.ttdRtUrl} alt="TTD Elektronik Ketua RT" class="ttd-img" />
              {/if}
            </div>
            <p class="nama-pejabat">
              {s.ttdRtNama ? `( ${s.ttdRtNama} )` : '( ........................................ )'}
            </p>
          </div>
        {/if}

        {#if s.butuhTtdRw}
          <div class="ttd-kolom">
            <p class="jabatan">{s.ttdRwJabatan ?? 'Ketua RW'}</p>
            <div class="ttd-space">
              {#if s.ttdRwUrl}
                <img src={s.ttdRwUrl} alt="TTD Elektronik Ketua RW" class="ttd-img" />
              {/if}
            </div>
            <p class="nama-pejabat">
              {s.ttdRwNama ? `( ${s.ttdRwNama} )` : '( ........................................ )'}
            </p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .print-container {
    width: fit-content;
    max-width: 100%;
    margin: 0 auto;
    padding: var(--space-4);
    overflow-x: auto;
  }

  .print-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    margin-bottom: var(--space-6);
    flex-wrap: wrap;
  }

  .toolbar-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .pdf-error {
    margin: 0 0 var(--space-4);
    padding: var(--space-3) var(--space-4);
    border: 1px solid var(--color-danger);
    border-radius: var(--radius-md);
    background: var(--color-danger-bg, oklch(0.96 0.04 25));
    color: var(--color-danger);
    font-size: var(--text-sm);
  }

  .surat-paper {
    width: 210mm;
    min-height: 297mm;
    box-sizing: border-box;
    background: #ffffff;
    color: #000000;
    padding: 20mm;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    font-family: 'Times New Roman', Times, serif;
    font-size: 12px;
    line-height: 1.5;
  }

  .kop-surat {
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .kop-teks h2 {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
    letter-spacing: 0.05em;
  }

  .kop-teks h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0.2rem 0;
  }

  .kop-teks h1 {
    font-size: 16px;
    font-weight: 800;
    margin: 0.2rem 0;
    letter-spacing: 0.06em;
  }

  .kop-teks p {
    font-size: 14px;
    margin: 0;
    font-family: inherit;
  }

  .kop-garis {
    border-top: 3px solid #000000;
    border-bottom: 1px solid #000000;
    height: 3px;
    margin: 0.5rem 0 1.5rem;
  }

  .judul-surat {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .judul-surat h4 {
    font-size: 16px;
    font-weight: 700;
    text-decoration: underline;
    margin: 0;
    letter-spacing: 0.05em;
  }

  .nomor-surat {
    font-size: 12px;
    margin: 0.25rem 0 0;
  }

  .isi-surat {
    font-size: 12px;
    text-align: justify;
  }

  .isi-surat p {
    margin: 0.85rem 0;
    text-indent: 2rem;
  }

  .tabel-biodata {
    width: 90%;
    margin: 1rem auto;
    border-collapse: collapse;
    font-size: 12px;
  }

  .tabel-biodata td {
    padding: 0.2rem 0.4rem;
    vertical-align: top;
  }

  .col-label {
    width: 38%;
  }

  .col-sep {
    width: 4%;
    text-align: center;
  }

  .col-val {
    width: 58%;
  }

  .font-bold {
    font-weight: 700;
  }

  .keperluan-box {
    display: inline-block;
    margin-top: 0.25rem;
    font-size: 12px;
  }

  .ttd-section {
    margin-top: 2.5rem;
  }

  .ttd-tanggal {
    text-align: right;
    margin-bottom: 1.5rem;
    font-size: 12px;
  }

  .ttd-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    text-align: center;
    font-size: 12px;
  }

  .ttd-grid.single {
    grid-template-columns: 1fr;
    width: 48%;
    max-width: 48%;
    margin-left: auto;
    margin-right: 0;
  }

  .ttd-kolom p {
    margin: 0;
  }

  .jabatan {
    font-weight: 700;
  }

  .ttd-space {
    height: 5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ttd-img {
    max-height: 4.5rem;
    max-width: 10rem;
    object-fit: contain;
  }

  .nama-pejabat {
    font-weight: 600;
  }

  @page {
    size: A4 portrait;
    margin: 0;
  }

  @media print {
    .no-print {
      display: none !important;
    }

    :global(body) {
      background: #ffffff !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .print-container {
      width: auto !important;
      max-width: 100% !important;
      padding: 0 !important;
      margin: 0 !important;
      overflow: visible !important;
    }

    .surat-paper {
      width: 210mm !important;
      min-height: 297mm !important;
      padding: 20mm !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
</style>
