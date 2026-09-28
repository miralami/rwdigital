<script lang="ts">
  import PageHeader from '$lib/components/PageHeader.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import {
    Users,
    Wallet,
    Receipt,
    Megaphone,
    ArrowUpRight,
    ArrowDownRight,
    PlusCircle,
    Calendar,
    ChevronRight,
    Building
  } from '@lucide/svelte';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  function formatDate(dateStr: string): string {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(d);
    } catch {
      return dateStr;
    }
  }

  const todayStr = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const kategoriBadgeMap: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand' }> = {
    umum: { label: 'Umum', variant: 'default' },
    kegiatan: { label: 'Kegiatan', variant: 'brand' },
    keuangan: { label: 'Keuangan', variant: 'success' },
    darurat: { label: 'Darurat', variant: 'danger' }
  };
</script>

<div class="dashboard-page">
  <!-- Top Welcome Banner -->
  <div class="welcome-banner">
    <div class="welcome-main">
      <div class="date-chip">
        <Calendar size={14} />
        <span>{todayStr}</span>
      </div>
      <h1 class="welcome-title">
        Selamat Datang, {data.user?.name ?? 'Pengurus'}
      </h1>
      <p class="welcome-desc">
        Ringkasan administrasi, kependudukan, dan arus kas lingkungan RW hari ini.
      </p>
    </div>

    <div class="quick-actions">
      <a href="/warga/tambah" class="btn btn-secondary action-btn">
        <PlusCircle size={16} />
        <span>Tambah Warga</span>
      </a>
      <a href="/kas/tambah" class="btn btn-primary action-btn">
        <PlusCircle size={16} />
        <span>Catat Kas</span>
      </a>
    </div>
  </div>

  <!-- KPI Metrics Grid -->
  <section class="metrics-grid" aria-label="Statistik Utama">
    <StatCard
      title="Saldo Kas RW"
      value={formatRupiah(data.stats.saldoKas)}
      description="Pemasukan: {formatRupiah(data.stats.totalPemasukan)}"
      icon={Wallet}
      variant="brand"
      href="/kas"
    />

    <StatCard
      title="Total Warga"
      value={data.stats.totalWarga}
      description="{data.stats.totalKk} KK terdaftar di {data.stats.totalRt} RT"
      icon={Users}
      variant="default"
      href="/warga"
    />

    <StatCard
      title="Tagihan Iuran Belum Bayar"
      value={data.stats.belumBayarCount}
      description="Tertunda: {formatRupiah(data.stats.totalTagihanPending)}"
      icon={Receipt}
      variant={data.stats.belumBayarCount > 0 ? 'warning' : 'success'}
      href="/iuran"
    />

    <StatCard
      title="Pengumuman Aktif"
      value={data.pengumumanTerbaru.length}
      description="Warta dan informasi warga terkini"
      icon={Megaphone}
      variant="default"
      href="/pengumuman"
    />
  </section>

  <!-- Two-Column Operational Panels -->
  <div class="panels-grid">
    <!-- Left: Transaksi Kas Terakhir -->
    <div class="panel-card">
      <div class="panel-header">
        <div class="panel-header-title">
          <div class="panel-icon-wrap kas-icon">
            <Wallet size={16} />
          </div>
          <div>
            <h2>Arus Kas Terbaru</h2>
            <p>Catatan pemasukan & pengeluaran kas terkini</p>
          </div>
        </div>
        <a href="/kas" class="panel-action-link">
          <span>Lihat Semua</span>
          <ChevronRight size={14} />
        </a>
      </div>

      <div class="panel-content">
        {#if data.transaksiTerbaru.length > 0}
          <div class="tx-list">
            {#each data.transaksiTerbaru as tx}
              <div class="tx-item">
                <div class="tx-icon {tx.jenis}">
                  {#if tx.jenis === 'pemasukan'}
                    <ArrowDownRight size={16} />
                  {:else}
                    <ArrowUpRight size={16} />
                  {/if}
                </div>
                <div class="tx-info">
                  <span class="tx-keterangan">{tx.keterangan}</span>
                  <span class="tx-date">{formatDate(tx.tanggal)}</span>
                </div>
                <div class="tx-amount {tx.jenis}">
                  {tx.jenis === 'pemasukan' ? '+' : '-'} {formatRupiah(tx.nominal)}
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="panel-empty">
            <p>Belum ada catatan transaksi kas.</p>
            <a href="/kas/tambah" class="btn btn-secondary btn-sm">Mulai Catat Kas</a>
          </div>
        {/if}
      </div>
    </div>

    <!-- Right: Pengumuman Terbaru -->
    <div class="panel-card">
      <div class="panel-header">
        <div class="panel-header-title">
          <div class="panel-icon-wrap info-icon">
            <Megaphone size={16} />
          </div>
          <div>
            <h2>Pengumuman Terkini</h2>
            <p>Warta informasi penting untuk warga</p>
          </div>
        </div>
        <a href="/pengumuman" class="panel-action-link">
          <span>Lihat Semua</span>
          <ChevronRight size={14} />
        </a>
      </div>

      <div class="panel-content">
        {#if data.pengumumanTerbaru.length > 0}
          <div class="news-list">
            {#each data.pengumumanTerbaru as info}
              {@const badge = kategoriBadgeMap[info.kategori] ?? { label: info.kategori, variant: 'default' }}
              <div class="news-item">
                <div class="news-header">
                  <Badge variant={badge.variant} dot>{badge.label}</Badge>
                  <span class="news-date">{formatDate(info.createdAt)}</span>
                </div>
                <h3 class="news-title">{info.judul}</h3>
              </div>
            {/each}
          </div>
        {:else}
          <div class="panel-empty">
            <p>Belum ada pengumuman publik yang aktif.</p>
            <a href="/pengumuman/tambah" class="btn btn-secondary btn-sm">Buat Pengumuman</a>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .dashboard-page {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* ─── Top Banner ─── */
  .welcome-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 1.5rem 1.75rem;
    background: linear-gradient(135deg, var(--color-surface-raised) 0%, var(--color-surface-overlay) 100%);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-sm);
    flex-wrap: wrap;
  }

  .welcome-main {
    flex: 1;
    min-width: 260px;
  }

  .date-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-brand-800);
    background: var(--color-brand-50);
    padding: 0.2rem 0.6rem;
    border-radius: var(--radius-full);
    border: 1px solid var(--color-brand-200);
    margin-bottom: 0.5rem;
  }

  .welcome-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0;
    letter-spacing: -0.02em;
    line-height: 1.3;
  }

  .welcome-desc {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .quick-actions {
    display: flex;
    gap: 0.625rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .action-btn {
    font-size: 0.8125rem;
    padding: 0.5rem 0.875rem;
  }

  /* ─── Metrics Grid ─── */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
  }

  /* ─── Two-Column Panels ─── */
  .panels-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }

  .panel-card {
    background: var(--color-surface-raised);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-card);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.125rem 1.25rem;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-surface);
  }

  .panel-header-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .panel-icon-wrap {
    width: 2rem;
    height: 2rem;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .kas-icon {
    background: var(--color-brand-50);
    color: var(--color-brand-700);
  }

  .info-icon {
    background: var(--color-info-bg);
    color: var(--color-info);
  }

  .panel-header-title h2 {
    font-size: 0.9375rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-text-primary);
    line-height: 1.2;
  }

  .panel-header-title p {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    margin: 0.125rem 0 0;
  }

  .panel-action-link {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-brand-700);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .panel-action-link:hover {
    color: var(--color-brand-900);
  }

  .panel-content {
    padding: 0.75rem 1.25rem;
    flex: 1;
  }

  /* Transactions list */
  .tx-list {
    display: flex;
    flex-direction: column;
  }

  .tx-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--color-border);
  }

  .tx-item:last-child {
    border-bottom: none;
  }

  .tx-icon {
    width: 2rem;
    height: 2rem;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .tx-icon.pemasukan {
    background: var(--color-success-bg);
    color: var(--color-success);
  }

  .tx-icon.pengeluaran {
    background: var(--color-danger-bg);
    color: var(--color-danger);
  }

  .tx-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .tx-keterangan {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tx-date {
    font-size: 0.6875rem;
    color: var(--color-text-secondary);
  }

  .tx-amount {
    font-size: 0.8125rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    text-align: right;
  }

  .tx-amount.pemasukan {
    color: var(--color-success);
  }

  .tx-amount.pengeluaran {
    color: var(--color-danger);
  }

  /* News list */
  .news-list {
    display: flex;
    flex-direction: column;
  }

  .news-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--color-border);
  }

  .news-item:last-child {
    border-bottom: none;
  }

  .news-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .news-date {
    font-size: 0.6875rem;
    color: var(--color-text-secondary);
  }

  .news-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
    line-height: 1.35;
  }

  .panel-empty {
    padding: 2.5rem 1rem;
    text-align: center;
    color: var(--color-text-secondary);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
  }

  .btn-sm {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }

  /* ─── Responsive ─── */
  @media (max-width: 900px) {
    .panels-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
