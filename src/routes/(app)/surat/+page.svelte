<script lang="ts">
  import { goto } from '$app/navigation';
  import DataTable from '$lib/components/DataTable.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { maskNik, formatTanggal } from '$lib/format';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

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
        if (row.status === 'diverifikasi') return '<span class="badge variant-brand">Diverifikasi</span>';
        if (row.status === 'disetujui') return '<span class="badge variant-success">Disetujui</span>';
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
    diverifikasi: 'Diverifikasi',
    disetujui: 'Disetujui',
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
