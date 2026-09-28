<script lang="ts">
  import { goto } from '$app/navigation';
  import DataTable from '$lib/components/DataTable.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { Settings2, FilePlus2 } from '@lucide/svelte';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  let activeTab = $state<'semua' | 'belum_bayar' | 'lunas'>('semua');

  const semua = data.semuaTagihan;
  const belumBayar = semua.filter((t: any) => t.status === 'belum_bayar');
  const lunas = semua.filter((t: any) => t.status === 'lunas');

  let filtered = $derived.by(() => {
    if (activeTab === 'belum_bayar') return belumBayar;
    if (activeTab === 'lunas') return lunas;
    return semua;
  });

  const columns = [
    { key: 'noKk', label: 'No. KK' },
    { key: 'alamatKk', label: 'Alamat' },
    { key: 'namaJenisIuran', label: 'Jenis Iuran' },
    { key: 'periode', label: 'Periode' },
    {
      key: 'nominal',
      label: 'Nominal',
      class: 'text-right',
      render: (row: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.nominal)
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => {
        if (row.status === 'lunas') return '<span class="badge variant-success">Lunas</span>';
        if (row.status === 'sebagian') return '<span class="badge variant-warning">Sebagian</span>';
        return '<span class="badge variant-danger">Belum Bayar</span>';
      }
    }
  ];

  function handleRowClick(row: any) {
    goto(`/iuran/${row.id}/bayar`);
  }
</script>

<PageHeader title="Iuran Warga" subtitle="Distribusi tagihan, pemantauan status, dan rekonsiliasi pembayaran iuran.">
  <a href="/iuran/jenis" class="btn btn-secondary">
    <Settings2 size={16} />
    <span>Kelola Jenis</span>
  </a>
  <a href="/iuran/generate" class="btn btn-primary">
    <FilePlus2 size={16} />
    <span>Generate Tagihan</span>
  </a>
</PageHeader>

<div class="tabs-bar">
  <div class="tabs-container">
    <button
      class="tab-btn"
      class:active={activeTab === 'semua'}
      onclick={() => activeTab = 'semua'}
    >
      <span>Semua Tagihan</span>
      <span class="tab-count">{semua.length}</span>
    </button>
    <button
      class="tab-btn"
      class:active={activeTab === 'belum_bayar'}
      onclick={() => activeTab = 'belum_bayar'}
    >
      <span>Belum Bayar</span>
      <span class="tab-count count-warning">{belumBayar.length}</span>
    </button>
    <button
      class="tab-btn"
      class:active={activeTab === 'lunas'}
      onclick={() => activeTab = 'lunas'}
    >
      <span>Lunas</span>
      <span class="tab-count count-success">{lunas.length}</span>
    </button>
  </div>
</div>

<DataTable
  {columns}
  data={filtered}
  searchKeys={['noKk', 'alamatKk', 'namaJenisIuran']}
  onRowClick={handleRowClick}
/>

<style>
  .tabs-bar {
    margin-bottom: 1.25rem;
  }

  .tabs-container {
    display: inline-flex;
    background: var(--color-surface-overlay);
    padding: 0.25rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    gap: 0.25rem;
  }

  .tab-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4375rem 0.875rem;
    border: none;
    background: transparent;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    cursor: pointer;
    border-radius: var(--radius-md);
    transition: all 0.15s ease;
  }

  .tab-btn:hover {
    color: var(--color-text-primary);
  }

  .tab-btn.active {
    background: var(--color-surface-raised);
    color: var(--color-text-primary);
    font-weight: 600;
    box-shadow: var(--shadow-xs);
  }

  .tab-count {
    font-size: 0.6875rem;
    font-weight: 600;
    padding: 0.1rem 0.45rem;
    border-radius: var(--radius-full);
    background: var(--color-border);
    color: var(--color-text-secondary);
  }

  .tab-btn.active .tab-count {
    background: var(--color-brand-100);
    color: var(--color-brand-800);
  }

  .tab-count.count-warning {
    background: var(--color-warning-bg);
    color: var(--color-warning);
  }

  .tab-count.count-success {
    background: var(--color-success-bg);
    color: var(--color-success);
  }
</style>
