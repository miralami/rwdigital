<script lang="ts">
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Download from '@lucide/svelte/icons/download';
  import Receipt from '@lucide/svelte/icons/receipt';
  import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
  import Clock from '@lucide/svelte/icons/clock';
  import AlertCircle from '@lucide/svelte/icons/alert-circle';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Card from '$lib/components/Card.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import { formatRupiah } from '$lib/format';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  let filterPeriode = $state<string>('semua');
  let filterStatus = $state<string>('semua');

  const filteredTagihan = $derived(
    data.semuaTagihan.filter((t: any) => {
      if (filterPeriode !== 'semua' && t.periode !== filterPeriode) return false;
      if (filterStatus !== 'semua' && t.status !== filterStatus) return false;
      return true;
    })
  );

  function eksporCsv() {
    let csv = 'Rekapitulasi Iuran Warga\n\n';
    csv += 'Periode,Jenis Iuran,No. KK,Nama Kepala Keluarga,RT,Nominal,Status\n';
    for (const t of filteredTagihan) {
      csv += `"${t.periode}","${t.namaJenis}","${t.noKk}","${t.namaWarga ?? '—'}","RT ${t.nomorRt}",${t.nominal},"${t.status}"\n`;
    }

    csv += '\nRingkasan\n';
    csv += `Total Tagihan,${filteredTagihan.length}\n`;
    csv += `Lunas,${filteredTagihan.filter((t: any) => t.status === 'lunas').length}\n`;
    csv += `Belum Bayar,${filteredTagihan.filter((t: any) => t.status === 'belum_bayar').length}\n`;
    csv += `Sebagian,${filteredTagihan.filter((t: any) => t.status === 'sebagian').length}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rekap_iuran_${filterPeriode}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
</script>

<div class="rekap-page">
  <div class="header">
    <a href="/iuran" class="back-link">
      <ArrowLeft size={16} />
      <span>Kembali ke iuran</span>
    </a>
  </div>

  <PageHeader title="Rekapitulasi Iuran Warga" subtitle="Laporan status pembayaran iuran seluruh warga per periode.">
    <button class="btn btn-secondary" onclick={eksporCsv}>
      <Download size={16} />
      <span>Ekspor CSV</span>
    </button>
  </PageHeader>

  <div class="stats-grid">
    <StatCard title="Total Tagihan" value={data.totalTagihan} icon={Receipt} />
    <StatCard title="Lunas" value={data.totalLunas} icon={CheckCircle2} variant="success" />
    <StatCard title="Belum Bayar" value={data.totalBelumBayar} icon={Clock} variant="warning" />
    <StatCard title="Sebagian" value={data.totalSebagian} icon={AlertCircle} variant="danger" />
  </div>

  <div class="filters-card">
    <div class="filter-group">
      <label for="filter-periode" class="label-caps">Filter Periode:</label>
      <select id="filter-periode" bind:value={filterPeriode} class="filter-select">
        <option value="semua">Semua Periode</option>
        {#each data.daftarPeriode as periode}
          <option value={periode}>{periode}</option>
        {/each}
      </select>
    </div>

    <div class="filter-group">
      <label for="filter-status" class="label-caps">Filter Status:</label>
      <select id="filter-status" bind:value={filterStatus} class="filter-select">
        <option value="semua">Semua Status</option>
        <option value="lunas">Lunas</option>
        <option value="belum_bayar">Belum Bayar</option>
        <option value="sebagian">Sebagian</option>
      </select>
    </div>
  </div>

  <Card>
    <div class="table-wrap">
      <table class="rekap-table">
        <thead>
          <tr>
            <th class="label-caps">Periode</th>
            <th class="label-caps">Jenis Iuran</th>
            <th class="label-caps">No. KK</th>
            <th class="label-caps">Kepala Keluarga</th>
            <th class="label-caps">RT</th>
            <th class="label-caps text-right">Nominal</th>
            <th class="label-caps">Status</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredTagihan as t}
            <tr>
              <td class="font-medium">{t.periode}</td>
              <td>{t.namaJenis}</td>
              <td class="font-mono">{t.noKk}</td>
              <td>{t.namaWarga ?? '—'}</td>
              <td>RT {t.nomorRt}</td>
              <td class="text-right">{formatRupiah(t.nominal)}</td>
              <td>
                {#if t.status === 'lunas'}
                  <span class="badge variant-success">Lunas</span>
                {:else if t.status === 'sebagian'}
                  <span class="badge variant-warning">Sebagian</span>
                {:else}
                  <span class="badge variant-danger">Belum Bayar</span>
                {/if}
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="7" class="text-muted text-center">Tidak ada data tagihan untuk filter yang dipilih.</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>

<style>
  .rekap-page {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    text-decoration: none;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
    gap: var(--space-4);
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

  .table-wrap {
    overflow-x: auto;
  }

  .rekap-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-sm);
  }

  .rekap-table th {
    padding: var(--space-2) var(--space-3);
    background: var(--color-surface-muted);
    border-bottom: 1px solid var(--color-border);
    color: var(--color-text-secondary);
    text-align: left;
  }

  .rekap-table td {
    padding: var(--space-3);
    border-bottom: 1px solid var(--color-border);
  }

  .text-right {
    text-align: right;
  }

  .text-center {
    text-align: center;
  }
</style>
