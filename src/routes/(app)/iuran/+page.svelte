<script lang="ts">
  import PageHeader from '$lib/components/PageHeader.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import Card from '$lib/components/Card.svelte';
  import Settings2 from '@lucide/svelte/icons/settings-2';
  import CircleCheckBig from '@lucide/svelte/icons/circle-check-big';
  import ArrowRightLeft from '@lucide/svelte/icons/arrow-right-left';
  import Wallet from '@lucide/svelte/icons/wallet';
  import DollarSign from '@lucide/svelte/icons/dollar-sign';
  import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
  import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
  import Search from '@lucide/svelte/icons/search';
  import Eye from '@lucide/svelte/icons/eye';
  import CreditCard from '@lucide/svelte/icons/credit-card';
  import Building from '@lucide/svelte/icons/building';
  import Users from '@lucide/svelte/icons/users';
  import { maskNoKk, formatRupiah, formatTanggal } from '$lib/format';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  let viewMode = $state<'rt' | 'kk'>('rt');
  $effect(() => {
    viewMode = data.isRwView ? 'rt' : 'kk';
  });
  let filterRt = $state<string>('semua');
  let filterStatus = $state<string>('semua');
  let searchQuery = $state('');

  function labelPeriode(periode: string): string {
    const [tahun, bulan] = periode.split('-');
    const nama = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const index = Number(bulan) - 1;
    return nama[index] ? `${nama[index]} ${tahun}` : periode;
  }

  const filteredTagihan = $derived(
    data.semuaTagihan.filter((t: any) => {
      if (filterRt !== 'semua' && String(t.nomorRt) !== filterRt) return false;
      if (filterStatus === 'lunas' && t.status !== 'lunas') return false;
      if (filterStatus === 'belum_bayar' && t.status !== 'belum_bayar') return false;
      if (filterStatus === 'menunggak' && !t.menunggak) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchKk = t.noKk.toLowerCase().includes(q);
        const matchNama = t.kepalaKeluarga.toLowerCase().includes(q);
        const matchJenis = t.namaJenisIuran.toLowerCase().includes(q);
        if (!matchKk && !matchNama && !matchJenis) return false;
      }

      return true;
    })
  );
</script>

<div class="page-container">
  <!-- Header & Actions -->
  <PageHeader
    title="Iuran & Tagihan Warga"
    subtitle="Pengawasan iuran bulanan warga, rekapitulasi setoran RT, dan verifikasi pembayaran."
  >
    <div class="header-actions">
      <a href="/iuran/konfirmasi" class="btn btn-secondary btn-notif">
        <CircleCheckBig size={16} />
        <span>Konfirmasi Bayar</span>
        {#if data.konfirmasiCounts.menunggu > 0}
          <span class="badge-count count-pending">{data.konfirmasiCounts.menunggu}</span>
        {/if}
        {#if data.konfirmasiCounts.diterima > 0}
          <span class="badge-count count-done">{data.konfirmasiCounts.diterima}</span>
        {/if}
      </a>

      <a href="/iuran/setoran" class="btn btn-secondary">
        <ArrowRightLeft size={16} />
        <span>Setoran RT &rarr; RW</span>
      </a>

      <a href="/iuran/jenis" class="btn btn-secondary">
        <Settings2 size={16} />
        <span>Jenis Iuran</span>
      </a>
    </div>
  </PageHeader>

  <!-- 1. Upper Dashboard (KPI Metrics) -->
  <section class="dashboard-kpi" aria-label="Ringkasan Iuran">
    <div class="stats-grid">
      <StatCard
        title="Target Iuran Terbit"
        value={formatRupiah(data.kpi.totalNominal)}
        description="Total tagihan terbit"
        icon={Wallet}
      />
      <StatCard
        title="Iuran Terkumpul"
        value={formatRupiah(data.kpi.totalTerbayar)}
        description="{data.kpi.persenBayar}% dari total tagihan"
        variant="success"
        icon={CheckCircle2}
      />
      <StatCard
        title="Tunggakan Belum Lunas"
        value={formatRupiah(data.kpi.totalTunggakan)}
        description="Melewati tanggal jatuh tempo"
        variant="warning"
        icon={AlertTriangle}
      />
      <StatCard
        title="Porsi Kas RW (Setoran)"
        value={formatRupiah(data.kpi.totalPorsiRw)}
        description="Hak kas RW dari iuran terbayar"
        variant="brand"
        icon={DollarSign}
      />
    </div>
  </section>

  <!-- 2. Two-Tier View Switcher (Only if RW view) -->
  {#if data.isRwView}
    <div class="tier-switcher">
      <div class="tier-tabs">
        <button
          type="button"
          class="tier-tab-btn"
          class:active={viewMode === 'rt'}
          onclick={() => (viewMode = 'rt')}
        >
          <Building size={16} />
          <span>Rekap Tingkat RT (Agregat)</span>
        </button>
        <button
          type="button"
          class="tier-tab-btn"
          class:active={viewMode === 'kk'}
          onclick={() => (viewMode = 'kk')}
        >
          <Users size={16} />
          <span>Rincian Tagihan per-KK ({data.semuaTagihan.length})</span>
        </button>
      </div>
    </div>
  {/if}

  <!-- 3. VIEW 1: Rekap Tingkat RT (Tingkatan RW) -->
  {#if viewMode === 'rt'}
    <div class="card rt-rekap-card">
      <div class="card-header-row">
        <div>
          <h2>Rekapitulasi Iuran & Setoran per RT</h2>
          <p class="section-desc">Pengawasan target iuran terkumpul per wilayah RT dan status setoran ke kas RW.</p>
        </div>
        <a href="/iuran/setoran" class="btn btn-primary btn-sm">
          <span>Kelola Setoran RT</span>
        </a>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Wilayah RT</th>
              <th>Jumlah KK</th>
              <th>Target Tagihan</th>
              <th>Terkumpul di RT</th>
              <th>Porsi Kas RW</th>
              <th>Status Setoran</th>
              <th class="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {#each data.rekapRt as r (r.rtId)}
              <tr>
                <td class="font-bold">RT {String(r.nomorRt).padStart(2, '0')}</td>
                <td>{r.totalKk} KK</td>
                <td class="mono">{formatRupiah(r.totalTagihan)}</td>
                <td class="mono text-success font-semibold">{formatRupiah(r.terbayar)}</td>
                <td class="mono font-semibold">{formatRupiah(r.porsiRwTotal)}</td>
                <td>
                  {#if r.statusSetoran === 'disetor'}
                    <span class="badge variant-success">Disetor ({formatTanggal(r.disetorPada)})</span>
                  {:else if r.statusSetoran === 'dibatalkan'}
                    <span class="badge variant-danger">Dibatalkan</span>
                  {:else}
                    <span class="badge variant-warning">Belum Disetor</span>
                  {/if}
                </td>
                <td class="text-right">
                  <a href="/iuran/setoran?periode={labelPeriode(new Date().toISOString().slice(0, 7))}" class="btn btn-secondary btn-sm">
                    Detail Setor
                  </a>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}

  <!-- 4. VIEW 2: Per-KK Management Table (Tingkatan RT / Drill-Down) -->
  {#if viewMode === 'kk'}
    <div class="management-section">
      <!-- Section Toolbar -->
      <div class="section-toolbar">
        <div class="search-box">
          <Search size={16} class="search-icon" />
          <input
            type="search"
            placeholder="Cari No. KK, kepala keluarga, atau jenis iuran..."
            bind:value={searchQuery}
            class="search-input"
          />
        </div>

        <div class="filter-group">
          {#if data.isRwView}
            <select bind:value={filterRt} class="filter-select">
              <option value="semua">Semua RT ({data.daftarRt.length} RT)</option>
              {#each data.daftarRt as rtItem}
                <option value={String(rtItem.nomor)}>RT {String(rtItem.nomor).padStart(2, '0')}</option>
              {/each}
            </select>
          {/if}

          <select bind:value={filterStatus} class="filter-select">
            <option value="semua">Semua Status</option>
            <option value="lunas">Lunas</option>
            <option value="belum_bayar">Belum Bayar</option>
            <option value="menunggak">Menunggak</option>
          </select>
        </div>
      </div>

      <!-- Table Card -->
      <div class="card table-card">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>No. KK & Kepala Keluarga</th>
                <th>Wilayah</th>
                <th>Jenis Iuran</th>
                <th>Periode</th>
                <th>Nominal</th>
                <th>Status</th>
                <th class="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {#if filteredTagihan.length === 0}
                <tr>
                  <td colspan="7" class="empty-cell">Tidak ada tagihan yang sesuai filter.</td>
                </tr>
              {:else}
                {#each filteredTagihan as t (t.id)}
                  <tr>
                    <td>
                      <div class="kk-cell">
                        <span class="mono font-semibold">{maskNoKk(t.noKk)}</span>
                        <span class="kk-kepala">{t.kepalaKeluarga}</span>
                      </div>
                    </td>
                    <td>
                      <span class="badge variant-brand">RT {String(t.nomorRt).padStart(2, '0')}</span>
                    </td>
                    <td>{t.namaJenisIuran}</td>
                    <td>{labelPeriode(t.periode)}</td>
                    <td class="mono font-bold">{formatRupiah(t.nominal)}</td>
                    <td>
                      {#if t.status === 'lunas'}
                        <span class="badge variant-success">Lunas</span>
                      {:else if t.menunggak}
                        <span class="badge variant-danger">Menunggak</span>
                      {:else}
                        <span class="badge variant-warning">Belum Bayar</span>
                      {/if}
                    </td>
                    <td class="text-right aksi-cell">
                      {#if t.status !== 'lunas'}
                        <a href="/iuran/{t.id}/bayar" class="btn btn-primary btn-sm btn-pay">
                          <CreditCard size={14} />
                          <span>Bayar</span>
                        </a>
                      {:else}
                        <span class="text-muted text-xs">&check; Lunas</span>
                      {/if}
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .page-container {
    max-width: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .btn-notif {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
  }

  .badge-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-2xs);
    font-weight: 700;
    padding: 0.1rem 0.4rem;
    border-radius: var(--radius-full);
    line-height: 1;
  }

  .count-pending {
    background: var(--color-warning-bg);
    color: var(--color-warning);
    border: 1px solid var(--color-warning);
  }

  .count-done {
    background: var(--color-success-bg);
    color: var(--color-success);
    border: 1px solid var(--color-success);
  }

  /* ─── Dashboard KPI ─── */
  .dashboard-kpi {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
    gap: var(--space-3);
  }

  /* ─── Two-Tier Switcher ─── */
  .tier-switcher {
    display: flex;
    margin-top: var(--space-1);
  }

  .tier-tabs {
    display: inline-flex;
    background: var(--color-surface-muted);
    padding: var(--space-1);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    gap: var(--space-1);
  }

  .tier-tab-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    border: none;
    background: transparent;
    font-family: inherit;
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--color-text-muted);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: all 0.15s ease;
  }

  .tier-tab-btn:hover {
    color: var(--color-text);
  }

  .tier-tab-btn.active {
    background: var(--color-surface);
    color: var(--color-text);
    font-weight: 600;
    box-shadow: var(--shadow-sm);
  }

  /* ─── RT Rekap Card ─── */
  .rt-rekap-card {
    padding: var(--space-5);
  }

  .card-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    flex-wrap: wrap;
    margin-bottom: var(--space-4);
  }

  .card-header-row h2 {
    margin: 0;
    font-size: var(--text-base);
    font-weight: 700;
  }

  .section-desc {
    margin: 0.125rem 0 0;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  /* ─── Management Section (Per KK) ─── */
  .management-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .section-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  .search-box {
    position: relative;
    flex: 1 1 18rem;
    max-width: 28rem;
  }

  .search-box :global(.search-icon) {
    position: absolute;
    left: var(--space-3);
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-muted);
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: var(--space-2) var(--space-3) var(--space-2) 2.25rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text);
    font-size: var(--text-sm);
  }

  .filter-group {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .filter-select {
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text);
    font-size: var(--text-sm);
  }

  .table-card {
    padding: var(--space-2);
    overflow: hidden;
  }

  .table-wrap {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-sm);
  }

  th,
  td {
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
    text-align: left;
    vertical-align: middle;
  }

  th {
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--color-text-muted);
    font-weight: 600;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  .font-bold {
    font-weight: 700;
  }

  .font-semibold {
    font-weight: 600;
  }

  .mono {
    font-family: var(--font-mono, monospace);
  }

  .text-success {
    color: var(--color-success);
  }

  .text-right {
    text-align: right;
  }

  .text-muted {
    color: var(--color-text-muted);
  }

  .text-xs {
    font-size: var(--text-xs);
  }

  .kk-cell {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .kk-kepala {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .btn-sm {
    min-height: var(--tap-min);
    padding: 0.25rem 0.65rem;
    font-size: var(--text-xs);
  }

  .btn-pay {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
  }

  .empty-cell {
    text-align: center;
    padding: var(--space-6);
    color: var(--color-text-muted);
  }
</style>
