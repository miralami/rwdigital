<script lang="ts">
  import { browser } from '$app/environment';
  import Plus from '@lucide/svelte/icons/plus';
  import UserPlus from '@lucide/svelte/icons/user-plus';
  import ArrowDown from '@lucide/svelte/icons/arrow-down';
  import ArrowUp from '@lucide/svelte/icons/arrow-up';
  import CircleAlert from '@lucide/svelte/icons/circle-alert';
  import Megaphone from '@lucide/svelte/icons/megaphone';
  import CircleCheckBig from '@lucide/svelte/icons/circle-check-big';
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import ListRow from '$lib/components/ListRow.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import Badge from '$lib/components/Badge.svelte';
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
</script>

<div class="dashboard">
  <h1 class="sr-only">Beranda RW Digital</h1>

  <!-- KPI: 4 sel. Di mobile sel saldo jadi hero dan sel pengumuman disembunyikan
       (datanya sudah tampil di panel "Perlu perhatian"). -->
  <section class="kpi-grid" aria-label="Ringkasan kas, warga, iuran, dan pengumuman">
    <div class="kpi-cell kpi-cell-hero">
      <StatCard
        title="Saldo kas"
        value={formatRupiah(data.stats.saldoKas)}
        description="Pemasukan {formatRupiah(data.stats.totalPemasukan)}"
        variant="hero"
        href="/kas"
      />
    </div>

    <div class="kpi-cell kpi-cell-actions">
      <div class="cell-actions">
        <Button href="/kas/tambah" variant="primary" size="lg" icon={Plus} class="cell-action-primary">Catat kas</Button>
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

  <div class="dash-cols">
    <Card title="Arus kas terbaru" actionHref="/kas" actionLabel="Lihat semua" padded={false}>
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
          message="Catat transaksi kas pertama"
          description="Setiap pemasukan atau pengeluaran langsung memperbarui saldo kas."
        >
          <Button href="/kas/tambah" variant="primary" icon={Plus}>Catat kas</Button>
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
          <Button href="/pengumuman/tambah" variant="primary" icon={Megaphone}>Buat pengumuman</Button>
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
  }

  @media (max-width: 1023px) {
    .kpi-cell-hero { grid-column: 1 / -1; }
    .kpi-cell-actions { display: flex; }
  }
</style>
