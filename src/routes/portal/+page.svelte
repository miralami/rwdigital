<script lang="ts">
  import { QrCode, Info, Megaphone, CircleCheckBig } from '@lucide/svelte';
  import Card from '$lib/components/Card.svelte';
  import ListRow from '$lib/components/ListRow.svelte';
  import Button from '$lib/components/Button.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import {
    formatRupiah,
    formatRupiahPendekTanda,
    formatRupiahTanda,
    formatTanggal
  } from '$lib/format';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  /**
   * Tombol QRIS sengaja tanpa aksi: belum ada payment gateway, tidak ada route,
   * tidak ada generate QR. Menekan tombol hanya membuka catatan bahwa.fitur
   * belum tersedia — bukan transaksi apa pun.
   */
  let catatanQris = $state(false);

  const belumBayar = $derived(data.iuran.status === 'belum_bayar');
</script>

<div class="portal-page">
  {#if data.contoh}
    <p class="contoh-banner">
      <Info size={16} />
      <span>{data.catatanContoh}</span>
    </p>
  {/if}

  <!-- 1. Iuran bulan ini — elemen dominan -->
  <section id="iuran" aria-labelledby="iuran-judul">
    <Card tone={belumBayar ? 'warning' : 'success'} padded={false}>
      <div class="iuran-body">
        <div class="iuran-top">
          <p class="label-caps" id="iuran-judul">Iuran {data.iuran.bulan}</p>
          <Badge variant={belumBayar ? 'warning' : 'success'}>
            {belumBayar ? 'Belum bayar' : 'Lunas'}
          </Badge>
        </div>

        <p class="iuran-nominal">{formatRupiah(data.iuran.nominal)}</p>

        {#if belumBayar}
          <p class="iuran-meta">Jatuh tempo {formatTanggal(data.iuran.jatuhTempo)}</p>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={QrCode}
            onclick={() => (catatanQris = true)}
          >
            Bayar dengan QRIS
          </Button>
          {#if catatanQris}
            <p class="iuran-note" role="status">
              Pembayaran QRIS belum tersedia. Fitur ini akan aktif setelah RW terhubung ke
              penyedia pembayaran.
            </p>
          {/if}
        {:else}
          <p class="iuran-meta">
            Terbayar pada {formatTanggal(data.iuran.dibayarPada ?? data.iuran.jatuhTempo)}
          </p>
        {/if}
      </div>
    </Card>
  </section>

  <!-- 2. Pengumuman -->
  <section id="info" aria-labelledby="info-judul">
    <Card title="Pengumuman terbaru" padded={false}>
      {#if data.pengumuman.length > 0}
        <div class="rows">
          <!--
            Sengaja tanpa `href`: `/pengumuman` adalah surface staf, jadi warga
            yang profane akan bounced balik ke portal (dead end). Portalnya
            hanya butuh daftar, jadi barisnya informasional saja — `ListRow`
            tanpa `href` merender <div> polos: tanpa chevron, tanpa hover, dan
            tidak focusable. Routing pengumuman untuk warga masih diputuskan
            terpisah; jangan ditambahkan di sini.
          -->
          {#each data.pengumuman as info (info.id)}
            <ListRow title={info.judul} meta={formatTanggal(info.tanggal)} icon={Megaphone} />
          {/each}
        </div>
      {:else}
        <EmptyState
          compact
          icon={Megaphone}
          message="Belum ada pengumuman"
          description="Pengumuman dari pengurus RW akan tampil di sini."
        />
      {/if}
    </Card>
  </section>

  <!-- 3. Riwayat pembayaran -->
  <section aria-labelledby="riwayat-judul">
    <Card title="Riwayat pembayaran" padded={false}>
      {#if data.riwayatPembayaran.length > 0}
        <div class="rows">
          {#each data.riwayatPembayaran as bayar (bayar.id)}
            <ListRow
              title={bayar.keterangan}
              meta={formatTanggal(bayar.tanggal)}
              value={formatRupiahTanda(bayar.nominal, 'pemasukan')}
              valueShort={formatRupiahPendekTanda(bayar.nominal, 'pemasukan')}
              tone="success"
            />
          {/each}
        </div>
      {:else}
        <EmptyState
          compact
          icon={CircleCheckBig}
          message="Belum ada pembayaran"
          description="Riwayat iuran yang sudah Anda bayar akan tercatat di sini."
        />
      {/if}
    </Card>
  </section>
</div>

<style>
  .portal-page {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  /* Penanda data contoh: sengaja mencolok, bukan catatan kecil. */
  .contoh-banner {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2);
    margin: 0;
    padding: var(--space-3);
    border: 1px dashed var(--color-warning);
    border-radius: var(--radius-md);
    background-color: var(--color-surface);
    font-size: var(--text-sm);
    line-height: var(--leading-snug);
    color: var(--color-text);
  }
  .contoh-banner :global(svg) {
    flex-shrink: 0;
    margin-top: 0.125rem;
    color: var(--color-warning);
  }

  .rows {
    display: flex;
    flex-direction: column;
    padding: var(--space-1);
  }

  /* ─── Kartu iuran ─── */
  .iuran-body {
    display: flex;
    flex-direction: column;
    padding: var(--space-5);
  }

  .iuran-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .iuran-nominal {
    margin: var(--space-2) 0 0;
    font-size: var(--text-4xl);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--color-text);
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }

  .iuran-meta {
    margin: var(--space-1) 0 var(--space-4);
    font-size: var(--text-sm);
    line-height: var(--leading-snug);
    color: var(--color-text-muted);
  }

  .iuran-note {
    margin: var(--space-3) 0 0;
    padding: var(--space-3);
    border-radius: var(--radius-md);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    font-size: var(--text-sm);
    line-height: var(--leading-normal);
    color: var(--color-text-muted);
  }

  @media (min-width: 768px) {
    .portal-page { gap: var(--space-5); }
    .iuran-body { padding: var(--space-6); }
    .iuran-nominal { font-size: var(--text-5xl); }
  }
</style>
