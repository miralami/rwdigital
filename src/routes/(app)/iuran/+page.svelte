<script lang="ts">
  import { goto } from '$app/navigation';
  import DataTable from '$lib/components/DataTable.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Settings2 from '@lucide/svelte/icons/settings-2';
  import FilePlus2 from '@lucide/svelte/icons/file-plus-2';
  import Download from '@lucide/svelte/icons/download';
  import { maskNoKk } from '$lib/format';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  let activeTab = $state<'semua' | 'belum_bayar' | 'lunas'>('semua');

  let semua = $derived(data.semuaTagihan);
  let belumBayar = $derived(semua.filter((t: any) => t.status === 'belum_bayar'));
  let lunas = $derived(semua.filter((t: any) => t.status === 'lunas'));

  let filtered = $derived.by(() => {
    if (activeTab === 'belum_bayar') return belumBayar;
    if (activeTab === 'lunas') return lunas;
    return semua;
  });

  const columns = [
    { key: 'noKk', label: 'No. KK', render: (row: any) => maskNoKk(row.noKk) },
    { key: 'alamatKk', label: 'Alamat' },
    { key: 'namaJenisIuran', label: 'Jenis Iuran' },
    { key: 'periode', label: 'Periode' },
    {
      key: 'nominal',
      label: 'Nominal',
      class: 'text-right',
      render: (row: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(row.nominal)
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

  function eksporCsv() {
    let csv = 'Rekapitulasi Tagihan Iuran Warga RW\n\n';
    csv += 'No. KK,Alamat,Jenis Iuran,Periode,Nominal,Status\n';
    for (const t of filtered) {
      csv += `"${t.noKk}","${t.alamatKk}","${t.namaJenisIuran}","${t.periode}",${t.nominal},"${t.status}"\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rekap_iuran_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
</script>

<PageHeader title="Iuran Warga" subtitle="Distribusi tagihan, pemantauan status, dan rekonsiliasi pembayaran iuran.">
  <div class="header-actions">
    <a href="/iuran/rekap" class="btn btn-secondary">
      <Download size={16} />
      <span>Rekap Iuran</span>
    </a>
    <button class="btn btn-secondary" onclick={eksporCsv}>
      <Download size={16} />
      <span>Ekspor CSV</span>
    </button>
    <a href="/iuran/jenis" class="btn btn-secondary">
      <Settings2 size={16} />
      <span>Kelola jenis</span>
    </a>
    <a href="/iuran/generate" class="btn btn-secondary">
      <FilePlus2 size={16} />
      <span>Generate tagihan</span>
    </a>
  </div>
</PageHeader>

<div class="tabs-bar">
  <div class="tabs-container" role="group" aria-label="Saring tagihan berdasarkan status">
    <button
      class="tab-btn"
      class:active={activeTab === 'semua'}
      aria-pressed={activeTab === 'semua'}
      onclick={() => activeTab = 'semua'}
    >
      <span>Semua tagihan</span>
      <span class="tab-count">{semua.length}</span>
    </button>
    <button
      class="tab-btn"
      class:active={activeTab === 'belum_bayar'}
      aria-pressed={activeTab === 'belum_bayar'}
      onclick={() => activeTab = 'belum_bayar'}
    >
      <span>Belum bayar</span>
      <span class="tab-count count-warning">{belumBayar.length}</span>
    </button>
    <button
      class="tab-btn"
      class:active={activeTab === 'lunas'}
      aria-pressed={activeTab === 'lunas'}
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
  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .tabs-bar {
    margin-bottom: var(--space-5);
  }

  .tabs-container {
    display: flex;
    flex-wrap: wrap;
    max-width: 100%;
    background: var(--color-surface-muted);
    padding: var(--space-1);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    gap: var(--space-1);
  }

  .tab-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 1 1 auto;
    gap: var(--space-2);
    min-height: var(--tap-min);
    padding: var(--space-2) var(--space-3);
    border: none;
    background: transparent;
    font-family: inherit;
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--color-text-muted);
    cursor: pointer;
    border-radius: var(--radius-md);
    transition: background-color 0.15s ease, color 0.15s ease;
  }

  .tab-btn:hover {
    background: var(--color-surface);
    color: var(--color-text);
  }

  .tab-btn.active {
    background: var(--color-surface);
    color: var(--color-text);
    font-weight: 600;
  }

  .tab-count {
    font-size: var(--text-2xs);
    font-weight: 600;
    padding: 0.1rem 0.45rem;
    border-radius: var(--radius-full);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    color: var(--color-text-muted);
  }

  .tab-btn.active .tab-count {
    background: var(--color-brand-100);
    border-color: var(--color-brand-200);
    color: var(--color-brand-800);
  }

  .tab-count.count-warning {
    background: var(--color-warning-bg);
    border-color: transparent;
    color: var(--color-warning);
  }

  .tab-count.count-success {
    background: var(--color-success-bg);
    border-color: transparent;
    color: var(--color-success);
  }
</style>
