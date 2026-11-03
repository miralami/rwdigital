<script lang="ts">
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import CircleCheckBig from '@lucide/svelte/icons/circle-check-big';
  import Clock from '@lucide/svelte/icons/clock';
  import FileText from '@lucide/svelte/icons/file-text';
  import Download from '@lucide/svelte/icons/download';
  import Card from '$lib/components/Card.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import { formatTanggal } from '$lib/format';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();
  const s = $derived(data.detail);

  type Nada = 'selesai' | 'aktif' | 'menunggu' | 'bahaya';
  type VarianBadge = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand';

  const labelStatus = $derived(
    s.status === 'diajukan'
      ? 'Diajukan'
      : s.status === 'menunggu_ttd'
        ? 'Menunggu TTD'
        : s.status === 'terbit'
          ? 'Terbit'
          : 'Ditolak'
  );

  const varianStatus: VarianBadge = $derived(
    s.status === 'terbit'
      ? 'success'
      : s.status === 'ditolak'
        ? 'danger'
        : s.status === 'menunggu_ttd'
          ? 'brand'
          : 'warning'
  );

  /**
   * Proses surat dibuat dari data yang benar-benar tersimpan: pengajuan,
   * langkah TTD yang diminta, lalu penerbitan/penolakan. Langkah yang tidak
   * diminta tidak ditampilkan.
   */
  const langkah = $derived.by(() => {
    const daftar: {
      judul: string;
      waktu: string;
      keterangan: string;
      nada: Nada;
    }[] = [
      {
        judul: 'Pengajuan diterima',
        waktu: tanggalWaktu(s.createdAt),
        keterangan: 'Permohonan Anda sudah masuk dan menunggu diproses pengurus.',
        nada: 'selesai'
      }
    ];

    if (s.butuhTtdRt) {
      const selesai = Boolean(s.ttdRtPada);
      daftar.push({
        judul: `Verifikasi & TTD ${s.ttdRtJabatan ?? `Ketua RT ${s.nomorRt}`}`,
        waktu: selesai ? tanggalWaktu(s.ttdRtPada) : '—',
        keterangan: selesai
          ? `Ditandatangani oleh ${s.ttdRtNama ?? 'Ketua RT'}.`
          : s.status === 'ditolak'
            ? 'Tidak selesai karena pengajuan ditolak.'
            : 'Menunggu verifikasi dan tanda tangan pengurus RT.',
        nada: selesai ? 'selesai' : s.status === 'ditolak' ? 'menunggu' : 'aktif'
      });
    }

    if (s.butuhTtdRw) {
      const selesai = Boolean(s.ttdRwPada);
      daftar.push({
        judul: `Verifikasi & TTD ${s.ttdRwJabatan ?? 'Ketua RW'}`,
        waktu: selesai ? tanggalWaktu(s.ttdRwPada) : '—',
        keterangan: selesai
          ? `Ditandatangani oleh ${s.ttdRwNama ?? 'Ketua RW'}.`
          : s.status === 'ditolak'
            ? 'Tidak selesai karena pengajuan ditolak.'
            : 'Menunggu verifikasi dan tanda tangan pengurus RW.',
        nada: selesai ? 'selesai' : s.status === 'ditolak' ? 'menunggu' : 'aktif'
      });
    }

    if (s.status === 'terbit') {
      daftar.push({
        judul: 'Surat terbit & bernomor',
        waktu: tanggalWaktu(s.tanggalTerbit),
        keterangan: s.nomorSurat
          ? `Nomor surat: ${s.nomorSurat}. Surat sudah dapat diunduh.`
          : 'Surat sudah terbit.',
        nada: 'selesai'
      });
    } else if (s.status === 'ditolak') {
      daftar.push({
        judul: 'Pengajuan ditolak',
        waktu: tanggalWaktu(s.ditolakPada),
        keterangan: s.catatanPengurus
          ? `Alasan: ${s.catatanPengurus}`
          : 'Pengajuan ditolak oleh pengurus.',
        nada: 'bahaya'
      });
    } else {
      daftar.push({
        judul: 'Penerbitan surat',
        waktu: '—',
        keterangan: 'Surat akan terbit setelah semua tanda tangan yang diminta lengkap.',
        nada: 'menunggu'
      });
    }

    return daftar;
  });

  /** Tanggal + jam singkat, mis. "28 Okt 2026, 14.05". */
  function tanggalWaktu(nilai: string | null | undefined): string {
    if (!nilai) return '—';
    const d = new Date(nilai);
    if (Number.isNaN(d.getTime())) return '—';
    const jam = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' })
      .format(d)
      .replace(':', '.');
    return `${formatTanggal(d)}, ${jam}`;
  }
</script>

<div class="detail-page">
  <a href="/portal#surat" class="back-link">
    <ArrowLeft size={16} />
    <span>Kembali ke Portal Warga</span>
  </a>

  <header class="header">
    <div>
      <h1 class="page-title">Detail Surat {s.jenis.toUpperCase()}</h1>
      <p class="page-meta">
        Diajukan {tanggalWaktu(s.createdAt)} oleh <strong>{s.namaWarga}</strong>
      </p>
    </div>
    <Badge variant={varianStatus}>{labelStatus}</Badge>
  </header>

  <Card title="Ringkasan Permohonan">
    <dl class="info-grid">
      <div class="info-item">
        <dt class="label-caps">Jenis Surat</dt>
        <dd>Surat {s.jenis.toUpperCase()}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Keperluan</dt>
        <dd>{s.keperluan}</dd>
      </div>
      {#if s.keterangan}
        <div class="info-item">
          <dt class="label-caps">Keterangan Tambahan</dt>
          <dd>{s.keterangan}</dd>
        </div>
      {/if}
      <div class="info-item">
        <dt class="label-caps">Wilayah</dt>
        <dd>RT {s.nomorRt} / {s.namaRw}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Nomor Surat</dt>
        <dd>{s.nomorSurat ?? 'Belum diterbitkan'}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Tanggal Terbit</dt>
        <dd>{s.tanggalTerbit ? formatTanggal(s.tanggalTerbit) : '—'}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Pihak yang Diminta TTD</dt>
        <dd>
          {#if s.butuhTtdRt && s.butuhTtdRw}
            Pengurus RT dan Pengurus RW
          {:else if s.butuhTtdRt}
            Pengurus RT
          {:else if s.butuhTtdRw}
            Pengurus RW
          {:else}
            —
          {/if}
        </dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Dokumen Persyaratan</dt>
        <dd>
          {#if s.dokumenSyarat}
            <a href={s.dokumenSyarat} target="_blank" rel="noreferrer" class="doc-link">
              <Download size={14} />
              <span>Lihat berkas</span>
            </a>
          {:else}
            <span class="text-muted">Tidak ada berkas diunggah</span>
          {/if}
        </dd>
      </div>
    </dl>

    {#if s.catatanPengurus}
      <div class="alert-catatan">
        <strong>Catatan Pengurus:</strong> {s.catatanPengurus}
      </div>
    {/if}

    {#if s.status === 'terbit'}
      <div class="actions">
        <a
          href="/portal/surat/{s.id}/cetak?unduh=1"
          target="_blank"
          rel="noreferrer"
          class="btn btn-primary"
        >
          <FileText size={16} />
          <span>Unduh PDF</span>
        </a>
      </div>
    {/if}
  </Card>

  <Card title="Proses Permohonan">
    <ol class="timeline" aria-label="Proses permohonan surat">
      {#each langkah as item, i (item.judul)}
        <li class="timeline-item" class:nada-selesai={item.nada === 'selesai'} class:nada-aktif={item.nada === 'aktif'} class:nada-bahaya={item.nada === 'bahaya'}>
          <span class="timeline-dot" aria-hidden="true">
            {#if item.nada === 'selesai'}
              <CircleCheckBig size={16} />
            {:else if item.nada === 'bahaya'}
              ×
            {:else}
              {i + 1}
            {/if}
          </span>
          <div class="timeline-text">
            <div class="timeline-title-row">
              <strong>{item.judul}</strong>
              <span class="timeline-waktu">
                <Clock size={12} />
                {item.waktu}
              </span>
            </div>
            <p>{item.keterangan}</p>
          </div>
        </li>
      {/each}
    </ol>

    {#if s.ttdRtUrl || s.ttdRwUrl}
      <div class="ttd-grid">
        {#if s.ttdRtUrl}
          <div class="ttd-box">
            <span class="ttd-role">{s.ttdRtJabatan ?? `Ketua RT ${s.nomorRt}`}</span>
            <img src={s.ttdRtUrl} alt="Tanda tangan RT" class="ttd-thumb" />
            <span class="ttd-name">{s.ttdRtNama ?? ''}</span>
          </div>
        {/if}
        {#if s.ttdRwUrl}
          <div class="ttd-box">
            <span class="ttd-role">{s.ttdRwJabatan ?? 'Ketua RW'}</span>
            <img src={s.ttdRwUrl} alt="Tanda tangan RW" class="ttd-thumb" />
            <span class="ttd-name">{s.ttdRwNama ?? ''}</span>
          </div>
        {/if}
      </div>
    {/if}
  </Card>
</div>

<style>
  .detail-page {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    max-width: 46rem;
    margin: 0 auto;
    padding-bottom: var(--space-6);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    text-decoration: none;
  }

  .back-link:hover {
    color: var(--color-text-primary);
  }

  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  .page-title {
    margin: 0;
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--color-text-primary);
    line-height: var(--leading-tight);
  }

  .page-meta {
    margin: var(--space-1) 0 0;
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(13rem, 100%), 1fr));
    gap: var(--space-4);
    margin: 0;
  }

  .info-item dt {
    margin-bottom: var(--space-1);
  }

  .info-item dd {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-primary);
    overflow-wrap: anywhere;
  }

  .text-muted {
    color: var(--color-text-muted);
  }

  .doc-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    color: var(--color-brand-600);
    font-weight: 500;
    text-decoration: none;
  }

  .doc-link:hover {
    text-decoration: underline;
  }

  .alert-catatan {
    margin-top: var(--space-4);
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    background: oklch(0.95 0.05 40);
    color: oklch(0.35 0.1 40);
    border: 1px solid oklch(0.85 0.08 40);
    font-size: var(--text-sm);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--space-4);
  }

  .timeline {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .timeline-item {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .timeline-dot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 999px;
    border: 2px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    font-weight: 700;
  }

  .nada-selesai .timeline-dot {
    border-color: var(--color-success);
    background: var(--color-success);
    color: #fff;
  }

  .nada-aktif .timeline-dot {
    border-color: var(--color-brand-600);
    background: var(--color-brand-600);
    color: #fff;
  }

  .nada-bahaya .timeline-dot {
    border-color: var(--color-danger);
    background: var(--color-danger);
    color: #fff;
  }

  .timeline-text {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    min-width: 0;
  }

  .timeline-title-row {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .timeline-text strong {
    font-size: var(--text-sm);
    color: var(--color-text-primary);
  }

  .timeline-waktu {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .timeline-text p {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .nada-aktif .timeline-text strong {
    color: var(--color-brand-600);
  }

  .ttd-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(12rem, 100%), 1fr));
    gap: var(--space-3);
    margin-top: var(--space-5);
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
  }

  .ttd-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-3);
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
  }

  .ttd-role {
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--color-text-secondary);
    text-align: center;
  }

  .ttd-thumb {
    max-height: 4rem;
    max-width: 10rem;
    object-fit: contain;
  }

  .ttd-name {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    text-align: center;
  }
</style>
