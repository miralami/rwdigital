<script lang="ts">
  import { QrCode, Info, Megaphone, CircleCheckBig, FileText, Plus } from '@lucide/svelte';
  import Card from '$lib/components/Card.svelte';
  import ListRow from '$lib/components/ListRow.svelte';
  import Button from '$lib/components/Button.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import {
    formatRupiah,
    formatTanggal
  } from '$lib/format';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  let catatanQris = $state(false);

  const belumBayar = $derived(data.iuran?.status === 'belum_bayar');
</script>

<div class="portal-page">
  {#if !data.terhubung}
    <p class="contoh-banner">
      <Info size={16} />
      <span>Akun Anda belum terhubung dengan data warga kependudukan. Hubungi Admin RW untuk penautan akun.</span>
    </p>
  {/if}

  <!-- 1. Iuran bulan ini / status tagihan -->
  {#if data.iuran}
    <section id="iuran" aria-labelledby="iuran-judul">
      <Card tone={belumBayar ? 'warning' : 'success'} padded={false}>
        <div class="iuran-body">
          <div class="iuran-top">
            <p class="label-caps" id="iuran-judul">
              {data.iuran.namaJenis} ({data.iuran.bulan})
            </p>
            <Badge variant={belumBayar ? 'warning' : 'success'}>
              {belumBayar ? 'Belum bayar' : 'Lunas'}
            </Badge>
          </div>

          <p class="iuran-nominal">{formatRupiah(data.iuran.nominal)}</p>

          {#if belumBayar}
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
                Pembayaran QRIS sedang disiapkan bersama mitra RW dan penyedia pembayaran.
                Untuk saat ini pembayaran dapat diserahkan tunai ke Bendahara atau transfer bank.
              </p>
            {/if}
          {:else}
            <p class="iuran-meta">Iuran untuk periode ini telah berstatus lunas.</p>
          {/if}
        </div>
      </Card>
    </section>
  {/if}

  <!-- 2. Modul Pengajuan Surat Warga (SF-SR-01..03) -->
  <section id="surat" aria-labelledby="surat-judul">
    <Card title="Pengajuan Surat Saya" padded={false}>
      <div class="surat-header-bar">
        <a href="/portal/surat/ajukan" class="btn btn-primary btn-sm">
          <Plus size={15} />
          <span>Ajukan Surat Baru</span>
        </a>
      </div>

      {#if data.daftarSurat && data.daftarSurat.length > 0}
        <div class="rows">
          {#each data.daftarSurat as s (s.id)}
            <div class="surat-row">
              <div class="surat-info">
                <div class="surat-title-row">
                  <span class="surat-title">Surat {s.jenis.toUpperCase()}</span>
                  {#if s.status === 'diajukan'}
                    <Badge variant="warning">Diajukan</Badge>
                  {:else if s.status === 'diverifikasi'}
                    <Badge variant="brand">Diverifikasi</Badge>
                  {:else if s.status === 'disetujui'}
                    <Badge variant="success">Disetujui</Badge>
                  {:else}
                    <Badge variant="danger">Ditolak</Badge>
                  {/if}
                </div>
                <p class="surat-meta">
                  Keperluan: {s.keperluan} • Diajukan: {formatTanggal(s.createdAt)}
                </p>
                {#if s.nomorSurat}
                  <p class="surat-no">Nomor: {s.nomorSurat}</p>
                {/if}
                {#if s.catatanPengurus}
                  <p class="surat-catatan">Catatan: {s.catatanPengurus}</p>
                {/if}
              </div>

              {#if s.status === 'disetujui'}
                <a
                  href="/portal/surat/{s.id}/cetak"
                  target="_blank"
                  rel="noreferrer"
                  class="btn btn-secondary btn-sm"
                >
                  <FileText size={14} />
                  <span>Unduh PDF</span>
                </a>
              {/if}
            </div>
          {/each}
        </div>
      {:else}
        <EmptyState
          compact
          icon={FileText}
          message="Belum ada permohonan surat"
          description="Anda dapat mengajukan surat pengantar atau keterangan melalui tombol di atas."
        />
      {/if}
    </Card>
  </section>

  <!-- 3. Pengumuman RW -->
  <section id="info" aria-labelledby="info-judul">
    <Card title="Pengumuman RW" padded={false}>
      {#if data.pengumuman.length > 0}
        <div class="rows">
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

  <!-- 4. Riwayat pembayaran iuran -->
  <section aria-labelledby="riwayat-judul">
    <Card title="Riwayat pembayaran iuran" padded={false}>
      {#if data.riwayatPembayaran.length > 0}
        <div class="rows">
          {#each data.riwayatPembayaran as bayar (bayar.id)}
            <ListRow
              title={bayar.keterangan}
              meta={formatTanggal(bayar.tanggal)}
              value={formatRupiah(bayar.nominal)}
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

  .surat-header-bar {
    padding: var(--space-3) var(--space-4);
    display: flex;
    justify-content: flex-end;
    border-bottom: 1px solid var(--color-border);
  }

  .surat-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--color-border);
    flex-wrap: wrap;
  }

  .surat-row:last-child {
    border-bottom: none;
  }

  .surat-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .surat-title-row {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .surat-title {
    font-weight: 600;
    font-size: var(--text-sm);
    color: var(--color-text-primary);
  }

  .surat-meta {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
  }

  .surat-no {
    margin: 0;
    font-size: var(--text-xs);
    font-weight: 500;
    color: var(--color-brand-600);
  }

  .surat-catatan {
    margin: 0;
    font-size: var(--text-xs);
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
    margin: var(--space-2) 0 var(--space-4);
    font-size: var(--text-4xl);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--color-text);
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }

  .iuran-meta {
    margin: 0;
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
