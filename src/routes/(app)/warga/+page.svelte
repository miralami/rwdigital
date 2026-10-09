<script lang="ts">
  import { goto } from '$app/navigation';
  import DataTable from '$lib/components/DataTable.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Plus from '@lucide/svelte/icons/plus';
  import Upload from '@lucide/svelte/icons/upload';
  import BarChart3 from '@lucide/svelte/icons/bar-chart-3';
  import { maskNik, maskNoKk } from '$lib/format';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  let filterRt = $state<string>('semua');
  let filterStatus = $state<string>('semua');

  const filteredWarga = $derived(
    data.semuaWarga.filter((w: any) => {
      if (filterRt !== 'semua' && String(w.nomorRt) !== filterRt) return false;
      if (filterStatus === 'aktif' && !w.aktif) return false;
      if (filterStatus === 'nonaktif' && w.aktif) return false;
      return true;
    })
  );

  const columns = [
    { key: 'nik', label: 'NIK', render: (row: any) => maskNik(row.nik) },
    { key: 'nama', label: 'Nama' },
    { key: 'noKk', label: 'No. KK', render: (row: any) => maskNoKk(row.noKk) },
    { key: 'nomorRt', label: 'RT', render: (row: any) => `RT ${row.nomorRt}` },
    {
      key: 'aktif',
      label: 'Status',
      render: (row: any) =>
        row.aktif
          ? '<span class="badge variant-success">Aktif</span>'
          : '<span class="badge variant-default">Nonaktif</span>'
    }
  ];

  function handleRowClick(row: any) {
    goto(`/warga/${row.id}`);
  }
</script>

<PageHeader title="Manajemen Warga" subtitle="Data kependudukan warga, KK, dan wilayah RT.">
  <div class="header-actions">
    <a href="/warga/rekap" class="btn btn-secondary">
      <BarChart3 size={16} />
      <span>Rekap Demografis</span>
    </a>
    <a href="/warga/impor" class="btn btn-secondary">
      <Upload size={16} />
      <span>Impor CSV</span>
    </a>
    <a href="/warga/tambah" class="btn btn-secondary">
      <Plus size={16} />
      <span>Tambah Warga</span>
    </a>
  </div>
</PageHeader>

<div class="filters-card">
  <div class="filter-group">
    <label for="filter-rt" class="label-caps">Filter Wilayah RT:</label>
    <select id="filter-rt" bind:value={filterRt} class="filter-select">
      <option value="semua">Semua RT ({data.semuaRt.length} RT)</option>
      {#each data.semuaRt as rtItem}
        <option value={String(rtItem.nomor)}>RT {rtItem.nomor}</option>
      {/each}
    </select>
  </div>

  <div class="filter-group">
    <label for="filter-status" class="label-caps">Filter Status:</label>
    <select id="filter-status" bind:value={filterStatus} class="filter-select">
      <option value="semua">Semua Status</option>
      <option value="aktif">Hanya Aktif</option>
      <option value="nonaktif">Hanya Nonaktif</option>
    </select>
  </div>
</div>

<DataTable
  {columns}
  data={filteredWarga}
  searchKeys={['nik', 'nama', 'noKk']}
  onRowClick={handleRowClick}
/>

<style>
  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .filters-card {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    margin-bottom: var(--space-4);
    flex-wrap: wrap;
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface-raised);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .filter-group {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .filter-select {
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text-primary);
    font-size: var(--text-sm);
  }
</style>
