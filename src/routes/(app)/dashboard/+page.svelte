<script lang="ts">
  import { browser } from '$app/environment';
  import Plus from '@lucide/svelte/icons/plus';
  import UserPlus from '@lucide/svelte/icons/user-plus';
  import ArrowDown from '@lucide/svelte/icons/arrow-down';
  import ArrowUp from '@lucide/svelte/icons/arrow-up';
  import CircleAlert from '@lucide/svelte/icons/circle-alert';
  import Megaphone from '@lucide/svelte/icons/megaphone';
  import CircleCheckBig from '@lucide/svelte/icons/circle-check-big';
  import Baby from '@lucide/svelte/icons/baby';
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import ListRow from '$lib/components/ListRow.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import DonutChart from '$lib/components/DonutChart.svelte';
  import {
    formatRupiah,
    formatRupiahPendekTanda,
    formatRupiahTanda,
    formatRelatif,
    formatTanggal
  } from '$lib/format';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  // Tanggal relatif butuh "sekarang". Dipanggil setelah mount supaya hasil
  // render server dan browser identik (tidak ada hydration mismatch).
  let now = $state<Date | null>(null);
  $effect(() => {
    if (browser) now = new Date();
  });

  const kategori: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand' }> = {
    umum: { label: 'Umum', variant: 'default' },
    kegiatan: { label: 'Kegiatan', variant: 'brand' },
    keuangan: { label: 'Keuangan', variant: 'success' },
    darurat: { label: 'Darurat', variant: 'danger' }
  };

  const tunggakan = $derived(data.stats.belumBayarCount > 0);
  const adaPerhatian = $derived(tunggakan || data.pengumumanTerbaru.length > 0);
  const pengumumanTerakhir = $derived(data.pengumumanTerbaru[0]?.createdAt);

  function tanggalRelatif(nilai: string | number | Date): string {
    return now ? formatRelatif(nilai, now) : formatTanggal(nilai);
  }

  // Hanya peran internal yang melihat grafik demografi (KP-03)
  // Better Auth menyimpan role sebagai string yang bisa berkoma ("admin_rw,bendahara"),
  // jadi pakai .includes() alih-alih strict equality.
  const isInternal = $derived.by(() => {
    const role = data.user?.role ?? '';
    return role.includes('admin_rw') || role.includes('pengurus_rt') || role.includes('bendahara');
  });

  // Segmen donat demografi untuk dashboard
  const demografiSegments = $derived([
    { label: 'Balita (0–4)',       value: data.demografi.balita,    color: 'var(--color-brand-400)' },
    { label: 'Sekolah (5–14)',     value: data.demografi.sekolah,   color: 'var(--color-brand-600)' },
    { label: 'Produktif (15–64)', value: data.demografi.produktif, color: 'var(--color-success)' },
    { label: 'Lansia (≥65)',       value: data.demografi.lansia,    color: 'var(--color-warning)' }
  ]);
</script>

<div class="dashboard">
  <h1 class="sr-only">Beranda RW Digital</h1>

  {#if data.scopeKind === 'rt'}
    <p class="scope-banner" role="status">
      Menampilkan data <strong>{data.scopeLabel}</strong>. Angka RW lain tidak termasuk.
    </p>
  {:else if data.scopeKind === 'none'}
    <p class="scope-banner scope-banner-warning" role="alert">
      Akun ini belum ditugaskan ke RT, jadi belum ada data yang bisa ditampilkan. Hubungi admin RW.
    </p>
  {/if}

  <!-- KPI: 4 sel. Di mobile sel saldo jadi hero dan sel pengumuman disembunyikan
       (datanya sudah tampil di panel "Perlu perhatian"). -->
  <section class="kpi-grid" aria-label="Ringkasan kas, warga, iuran, dan pengumuman">
    <div class="kpi-cell kpi-cell-hero">
      <StatCard
        title={data.kasLabel}
        value={formatRupiah(data.stats.saldoKas)}
        description="Pemasukan {formatRupiah(data.stats.totalPemasukan)}"
        variant="hero"
        href="/kas"
      />
    </div>

    <div class="kpi-cell kpi-cell-actions">
      <div class="cell-actions">
        {#if data.bisaCatatKas}
          <Button href="/kas/tambah" variant="primary" size="lg" icon={Plus} class="cell-action-primary">Catat kas</Button>
        {/if}
        <Button href="/warga" variant="secondary" size="lg" icon={UserPlus}>Warga</Button>
      </div>
    </div>

    <div class="kpi-cell">
      <StatCard
        title="Total warga"
        value={data.stats.totalWarga}
        description="{data.stats.totalKk} KK di {data.stats.totalRt} RT"
        href="/warga"
      />
    </div>

    <div class="kpi-cell">
      <StatCard
        title="Tagihan belum bayar"
        value={data.stats.belumBayarCount}
        description="Total {formatRupiah(data.stats.totalTagihanPending)}"
        variant={tunggakan ? 'warning' : 'success'}
        href="/iuran"
      />
    </div>

    <div class="kpi-cell kpi-cell-extra">
      <StatCard
        title="Pengumuman aktif"
        value={data.pengumumanTerbaru.length}
        description={pengumumanTerakhir ? `Terbit ${tanggalRelatif(pengumumanTerakhir)}` : 'Belum ada pengumuman'}
        href="/pengumuman"
      />
    </div>
  </section>

  <!-- Grafik demografi ringkas — hanya peran internal (KP-03) -->
  {#if isInternal}
    <section class="demografi-section" aria-label="Grafik demografi penduduk">
      <div class="dash-cols dash-cols-demografi">
        <Card
          title="Grafik Demografi Penduduk"
          actionHref="/warga/rekap"
          actionLabel="Lihat rekap lengkap"
        >
          <DonutChart
            segments={demografiSegments}
            centerValue={data.demografi.total}
            centerLabel="Total jiwa"
            unit="jiwa"
            emptyMessage="Belum ada data warga aktif."
          />
        </Card>

        <Card title="Kelahiran Baru & Ringkasan">
          <div class="demografi-stats">
            <div class="demografi-stat-item">
              <Baby size={20} class="demografi-icon" />
              <div class="demografi-stat-text">
                <p class="demografi-stat-val">{data.demografi.kelahiranBaru}</p>
                <p class="demografi-stat-label">Kelahiran baru (12 bln terakhir)</p>
              </div>
            </div>
            <div class="demografi-rows">
              {#each demografiSegments as seg}
                <div class="demografi-row">
                  <span class="demografi-swatch" style="background-color: {seg.color}"></span>
                  <span class="demografi-row-label">{seg.label}</span>
                  <span class="demografi-row-val">{seg.value} jiwa</span>
                  <span class="demografi-row-pct">
                    {data.demografi.total ? Math.round((seg.value / data.demografi.total) * 100) : 0}%
                  </span>
                </div>
              {/each}
            </div>
            <a href="/warga/rekap" class="btn btn-secondary btn-sm demografi-link">
              Lihat rekap lengkap
            </a>
          </div>
        </Card>
      </div>
    </section>
  {/if}

  <div class="dash-cols">
    <Card
      title={data.scopeKind === 'rt' ? 'Arus kas RT terbaru' : 'Arus kas terbaru'}
      actionHref="/kas"
      actionLabel="Lihat semua"
      padded={false}
    >
      {#if data.transaksiTerbaru.length > 0}
        <div class="row-list">
          {#each data.transaksiTerbaru as tx (tx.id)}
            <ListRow
              href="/kas"
              title={tx.keterangan}
              meta={tanggalRelatif(tx.tanggal)}
              value={formatRupiahTanda(tx.nominal, tx.jenis)}
              valueShort={formatRupiahPendekTanda(tx.nominal, tx.jenis)}
              icon={tx.jenis === 'pemasukan' ? ArrowDown : ArrowUp}
              tone={tx.jenis === 'pemasukan' ? 'success' : 'danger'}
            />
          {/each}
        </div>
      {:else}
        <EmptyState
          compact
          message={data.scopeKind === 'rt' ? 'Belum ada transaksi kas RT' : 'Catat transaksi kas pertama'}
          description="Setiap pemasukan atau pengeluaran langsung memperbarui saldo kas."
        >
          {#if data.bisaCatatKas}
            <Button href="/kas/tambah" variant="primary" icon={Plus}>Catat kas</Button>
          {/if}
        </EmptyState>
      {/if}
    </Card>

    <Card title="Perlu perhatian" padded={false}>
      {#if adaPerhatian}
        <div class="row-list">
          {#if tunggakan}
            <p class="group-label label-caps">Iuran menunggak</p>
            <ListRow
              href="/iuran"
              title="{data.stats.belumBayarCount} tagihan belum dibayar"
              meta="Total {formatRupiah(data.stats.totalTagihanPending)}"
              icon={CircleAlert}
              tone="warning"
            />
          {/if}

          {#if data.pengumumanTerbaru.length > 0}
            <p class="group-label label-caps">Pengumuman aktif</p>
            {#each data.pengumumanTerbaru as info (info.id)}
              {@const badge = kategori[info.kategori] ?? { label: info.kategori, variant: 'default' as const }}
              <ListRow
                href="/pengumuman"
                title={info.judul}
                meta={tanggalRelatif(info.createdAt)}
                icon={Megaphone}
              >
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </ListRow>
            {/each}
          {/if}
        </div>
      {:else}
        <EmptyState
          compact
          icon={CircleCheckBig}
          message="Tidak ada yang perlu ditindaklanjuti"
          description="Iuran lunas dan tidak ada pengumuman yang menunggu."
        >
          {#if data.bisaBuatPengumuman}
            <Button href="/pengumuman/tambah" variant="primary" icon={Megaphone}>Buat pengumuman</Button>
          {/if}
        </EmptyState>
      {/if}
    </Card>
  </div>
</div>

<style>
  .dashboard {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .scope-banner {
    margin: 0;
    padding: var(--space-2) var(--space-4);
    border: 1px solid var(--color-border);
    border-left: 3px solid var(--color-brand-600);
    border-radius: var(--radius-md);
    background: var(--color-surface-muted);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .scope-banner-warning {
    border-left-color: var(--color-warning);
    background: var(--color-warning-bg, var(--color-surface-muted));
    color: var(--color-text);
  }

  /* ─── KPI ─── */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-3);
  }

  .kpi-cell {
    display: flex;
    min-width: 0;
  }
  .kpi-cell > :global(.stat-card) {
    flex: 1 1 auto;
    min-width: 0;
  }

  /* Aksi utama mobile: melingkar di bawah hero, melebar 2 kolom. */
  .kpi-cell-actions {
    grid-column: 1 / -1;
    display: none;
  }

  .cell-actions {
    display: flex;
    gap: var(--space-2);
    width: 100%;
  }
  .cell-actions :global(.cell-action-primary) { flex: 1 1 auto; }
  .cell-actions :global(.btn) { flex: 0 0 auto; }

  .kpi-cell-extra { display: none; }

  /* ─── Demografi ─── */
  .demografi-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .dash-cols-demografi {
    /* Dua kolom berdampingan untuk grafik dan ringkasan. */
    grid-template-columns: 1fr;
  }

  .demografi-stats {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .demografi-stat-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4);
    background: var(--color-surface-muted);
    border-radius: var(--radius-lg);
  }

  .demografi-stat-item :global(svg) {
    color: var(--color-brand-600);
    flex-shrink: 0;
  }

  .demografi-stat-text {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .demografi-stat-val {
    margin: 0;
    font-size: var(--text-2xl);
    font-weight: 800;
    color: var(--color-text);
    font-variant-numeric: tabular-nums;
    line-height: 1.2;
  }

  .demografi-stat-label {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    font-weight: 500;
  }

  .demografi-rows {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .demografi-row {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
  }

  .demografi-swatch {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: var(--radius-xs);
    flex-shrink: 0;
  }

  .demografi-row-label {
    flex: 1;
    color: var(--color-text);
    font-weight: 500;
  }

  .demografi-row-val {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--color-text);
  }

  .demografi-row-pct {
    width: 2.5rem;
    text-align: right;
    color: var(--color-text-muted);
    font-weight: 500;
  }

  .demografi-link {
    align-self: flex-start;
  }

  /* ─── Dua kolom ─── */
  .dash-cols {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-4);
    align-items: start;
  }

  .row-list {
    display: flex;
    flex-direction: column;
    padding: var(--space-1);
  }

  .group-label {
    margin: var(--space-3) var(--space-3) var(--space-1);
  }

  @media (min-width: 1024px) {
    .kpi-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: var(--space-4);
    }
    .kpi-cell-extra { display: flex; }
    .dash-cols { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-5); }
    .dash-cols-demografi { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @media (max-width: 1023px) {
    .kpi-cell-hero { grid-column: 1 / -1; }
    .kpi-cell-actions { display: flex; }
  }
</style>
