<script lang="ts">
  import Printer from '@lucide/svelte/icons/printer';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import { formatTanggalPanjang } from '$lib/format';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();
  const s = $derived(data.detail);

  function cetak() {
    window.print();
  }
</script>

<div class="print-container">
  <div class="no-print print-toolbar">
    <button class="btn btn-secondary" onclick={() => history.back()}>
      <ArrowLeft size={16} />
      <span>Kembali</span>
    </button>
    <button class="btn btn-primary" onclick={cetak}>
      <Printer size={16} />
      <span>Cetak / Simpan PDF</span>
    </button>
  </div>

  <div class="surat-paper">
    <!-- Kop Surat Resmi -->
    <div class="kop-surat">
      <div class="kop-teks">
        <h2>PEMERINTAH {s.kota.toUpperCase()}</h2>
        <h3>KECAMATAN {s.kecamatan.toUpperCase()} • KELURAHAN {s.kelurahan.toUpperCase()}</h3>
        <h1>RUKUN WARGA {s.namaRw.toUpperCase()}</h1>
        <p>Sekretariat: {s.alamatKk}, {s.kelurahan}, {s.kecamatan}, {s.kota}</p>
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
        Yang bertanda tangan di bawah ini, Pengurus Rukun Warga {s.namaRw} Kelurahan {s.kelurahan},
        Kecamatan {s.kecamatan}, {s.kota}, dengan ini menerangkan bahwa:
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

      {#if s.keterangan}
        <p class="keterangan-tambahan">
          Catatan: {s.keterangan}
        </p>
      {/if}

      <p>
        Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
      </p>
    </div>

    <!-- Tanda Tangan -->
    <div class="ttd-section">
      <div class="ttd-tanggal">
        {s.kota}, {formatTanggalPanjang(s.tanggalTerbit ?? new Date())}
      </div>

      <div class="ttd-grid">
        <div class="ttd-kolom">
          <p>Mengetahui,</p>
          <p class="jabatan">Ketua RT {s.nomorRt}</p>
          <div class="ttd-space"></div>
          <p class="nama-pejabat">( ........................................ )</p>
        </div>

        <div class="ttd-kolom">
          <p class="jabatan">Ketua {s.namaRw}</p>
          <div class="ttd-space"></div>
          <p class="nama-pejabat">( ........................................ )</p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .print-container {
    max-width: 52rem;
    margin: 0 auto;
    padding: var(--space-4);
  }

  .print-toolbar {
    display: flex;
    justify-content: space-between;
    gap: var(--space-3);
    margin-bottom: var(--space-6);
  }

  .surat-paper {
    background: #ffffff;
    color: #000000;
    padding: 3rem 3.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    font-family: 'Times New Roman', Times, serif;
    line-height: 1.5;
  }

  .kop-surat {
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .kop-teks h2 {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: 0.05em;
  }

  .kop-teks h3 {
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0.2rem 0;
  }

  .kop-teks h1 {
    font-size: 1.35rem;
    font-weight: 800;
    margin: 0.2rem 0;
    letter-spacing: 0.06em;
  }

  .kop-teks p {
    font-size: 0.85rem;
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
    font-size: 1.15rem;
    font-weight: 700;
    text-decoration: underline;
    margin: 0;
    letter-spacing: 0.05em;
  }

  .nomor-surat {
    font-size: 0.95rem;
    margin: 0.25rem 0 0;
  }

  .isi-surat {
    font-size: 1rem;
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
    font-size: 0.95rem;
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
    font-size: 1.05rem;
  }

  .keterangan-tambahan {
    font-style: italic;
  }

  .ttd-section {
    margin-top: 2.5rem;
  }

  .ttd-tanggal {
    text-align: right;
    margin-bottom: 1.5rem;
    font-size: 1rem;
  }

  .ttd-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    text-align: center;
    font-size: 1rem;
  }

  .ttd-kolom p {
    margin: 0;
  }

  .jabatan {
    font-weight: 700;
  }

  .ttd-space {
    height: 5rem;
  }

  .nama-pejabat {
    font-weight: 600;
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
      max-width: 100% !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    .surat-paper {
      box-shadow: none !important;
      padding: 0 !important;
      border-radius: 0 !important;
    }
  }
</style>
