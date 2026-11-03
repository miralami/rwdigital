<script lang="ts">
  import { goto } from '$app/navigation';
  import DataTable from '$lib/components/DataTable.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { maskNik, formatTanggal } from '$lib/format';
  import type { PageData } from './$types';

  let { data, form } = $props<{
    data: PageData;
    form?: { error?: string; sukses?: string };
  }>();

  const columns = [
    {
      key: 'nomorSurat',
      label: 'No. Surat',
      render: (row: any) => row.nomorSurat ?? '<span class="text-muted">—</span>'
    },
    {
      key: 'namaWarga',
      label: 'Pemohon',
      render: (row: any) => `<div><span class="font-medium">${row.namaWarga}</span><br><span class="text-xs text-muted">${maskNik(row.nikWarga)}</span></div>`
    },
    {
      key: 'jenis',
      label: 'Jenis Surat',
      render: (row: any) => `<span class="badge variant-brand">Surat ${row.jenis.toUpperCase()}</span>`
    },
    {
      key: 'nomorRt',
      label: 'RT',
      render: (row: any) => `RT ${row.nomorRt}`
    },
    {
      key: 'createdAt',
      label: 'Tgl Pengajuan',
      render: (row: any) => formatTanggal(row.createdAt)
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => {
        if (row.status === 'diajukan') return '<span class="badge variant-warning">Diajukan</span>';
        if (row.status === 'menunggu_ttd') return '<span class="badge variant-brand">Menunggu TTD</span>';
        if (row.status === 'terbit') return '<span class="badge variant-success">Terbit</span>';
        return '<span class="badge variant-danger">Ditolak</span>';
      }
    }
  ];

  function handleRowClick(row: any) {
    goto(`/surat/${row.id}`);
  }

  // ─── Filter daftar (status / jenis / periode) ─────────────────────────────
  let filterStatus = $state('semua');
  let filterJenis = $state('semua');
  let filterPeriode = $state('semua');

  const LABEL_STATUS: Record<string, string> = {
    diajukan: 'Diajukan',
    menunggu_ttd: 'Menunggu TTD',
    terbit: 'Terbit',
    ditolak: 'Ditolak'
  };

  const BULAN_SINGKAT = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];

  /** "2026-10" → "Okt 2026". */
  function labelPeriode(periode: string): string {
    const [tahun, bulan] = periode.split('-');
    const index = Number(bulan) - 1;
    return `${BULAN_SINGKAT[index] ?? bulan} ${tahun}`;
  }

  const daftarJenis = $derived(
    [...new Set<string>(data.semuaSurat.map((row: any) => String(row.jenis)))].sort()
  );

  const daftarPeriode = $derived(
    [...new Set<string>(data.semuaSurat.map((row: any) => String(row.createdAt).slice(0, 7)))]
      .filter((p) => /^\d{4}-\d{2}$/.test(p))
      .sort()
      .reverse()
  );

  const dataTersaring = $derived(
    data.semuaSurat.filter((row: any) => {
      const periode = String(row.createdAt).slice(0, 7);
      return (
        (filterStatus === 'semua' || row.status === filterStatus) &&
        (filterJenis === 'semua' || row.jenis === filterJenis) &&
        (filterPeriode === 'semua' || periode === filterPeriode)
      );
    })
  );

  const adaFilter = $derived(
    filterStatus !== 'semua' || filterJenis !== 'semua' || filterPeriode !== 'semua'
  );

  function resetFilter() {
    filterStatus = 'semua';
    filterJenis = 'semua';
    filterPeriode = 'semua';
  }
</script>

<PageHeader
  title="Pelayanan Surat-Menyurat"
  subtitle="Daftar pengajuan permohonan surat pengantar dan surat keterangan warga."
/>

{#if data.bisaUploadTtd}
  <div class="card ttd-card">
    <div class="ttd-copy">
      <h2 class="ttd-title">Tanda Tangan Elektronik</h2>
      <p class="ttd-desc">
        Unggah gambar tanda tangan Anda. TTD ini akan tersemat pada surat yang Anda
        verifikasi dan tandatangani sebagai Ketua RT.
      </p>
      {#if data.ttdUrl}
        <div class="ttd-current">
          <span class="ttd-label">TTD saat ini</span>
          <img src={data.ttdUrl} alt="Tanda tangan elektronik" class="ttd-preview" />
        </div>
      {/if}
    </div>

    <form method="POST" action="?/uploadTtd" enctype="multipart/form-data" class="ttd-form">
      <input
        type="file"
        name="ttd"
        accept="image/png,image/jpeg,image/webp"
        class="input-base"
        required
      />
      <button type="submit" class="btn btn-primary">Simpan TTD</button>
    </form>

    {#if form?.error}
      <p class="ttd-banner ttd-error" role="alert">{form.error}</p>
    {/if}
    {#if form?.sukses}
      <p class="ttd-banner ttd-sukses" role="status">{form.sukses}</p>
    {/if}
  </div>
{/if}

<div class="filter-bar" role="group" aria-label="Filter daftar surat">
  <label class="filter-item">
    <span>Status</span>
    <select class="input-base" bind:value={filterStatus}>
      <option value="semua">Semua status</option>
      {#each Object.entries(LABEL_STATUS) as [nilai, label] (nilai)}
        <option value={nilai}>{label}</option>
      {/each}
    </select>
  </label>

  <label class="filter-item">
    <span>Jenis</span>
    <select class="input-base" bind:value={filterJenis}>
      <option value="semua">Semua jenis</option>
      {#each daftarJenis as jenis (jenis)}
        <option value={jenis}>Surat {jenis.toUpperCase()}</option>
      {/each}
    </select>
  </label>

  <label class="filter-item">
    <span>Periode</span>
    <select class="input-base" bind:value={filterPeriode}>
      <option value="semua">Semua periode</option>
      {#each daftarPeriode as periode (periode)}
        <option value={periode}>{labelPeriode(periode)}</option>
      {/each}
    </select>
  </label>

  {#if adaFilter}
    <button type="button" class="btn btn-secondary btn-sm filter-reset" onclick={resetFilter}>
      Reset filter
    </button>
  {/if}
</div>

<DataTable
  {columns}
  data={dataTersaring}
  searchKeys={['nomorSurat', 'namaWarga', 'nikWarga', 'jenis', 'status']}
  onRowClick={handleRowClick}
  emptyMessage={adaFilter ? 'Tidak ada surat yang cocok dengan filter.' : 'Belum ada pengajuan surat.'}
/>

<style>
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
  }

  .ttd-card {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(16rem, 22rem);
    gap: var(--space-4);
    align-items: center;
    padding: var(--space-4) var(--space-5);
    margin-bottom: var(--space-4);
  }

  @media (max-width: 48rem) {
    .ttd-card {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .ttd-title {
    margin: 0 0 var(--space-1);
    font-size: var(--text-base);
    font-weight: 600;
  }

  .ttd-desc {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .ttd-current {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-top: var(--space-2);
  }

  .ttd-label {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .ttd-preview {
    max-height: 3.5rem;
    max-width: 10rem;
    object-fit: contain;
  }

  .ttd-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .ttd-banner {
    grid-column: 1 / -1;
    margin: 0;
    font-size: var(--text-sm);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
  }

  .ttd-error {
    background: var(--color-danger-bg);
    color: var(--color-danger);
  }

  .ttd-sukses {
    background: var(--color-success-bg);
    color: var(--color-success);
  }

  .filter-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    min-width: 10rem;
    font-size: var(--text-sm);
    font-weight: 500;
  }

  .filter-item .input-base {
    min-height: var(--tap-min);
  }

  .filter-reset {
    min-height: var(--tap-min);
  }
</style>
