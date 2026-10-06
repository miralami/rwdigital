<script lang="ts">
  import { ArrowLeft, Check, FileCheck, X, FileText, Download } from '@lucide/svelte';
  import Badge from '$lib/components/Badge.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { formatTanggal } from '$lib/format';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();
  const s = $derived(data.detail);

  let showModalTolak = $state(false);
</script>

<div class="surat-detail-page">
  <div class="header">
    <a href="/surat" class="back-link">
      <ArrowLeft size={16} />
      <span>Kembali ke daftar surat</span>
    </a>

    <div class="header-main">
      <div>
        <h1 class="page-title">Permohonan Surat {s.jenis.toUpperCase()}</h1>
        <p class="page-meta">
          Diajukan pada {formatTanggal(s.createdAt)} oleh <strong>{s.namaWarga}</strong>
        </p>
      </div>

      <div class="actions">
        {#if s.status === 'diajukan'}
          <form method="POST" action="?/verifikasi">
            <button type="submit" class="btn btn-primary">
              <Check size={16} />
              <span>Verifikasi Berkas</span>
            </button>
          </form>
          <button
            type="button"
            class="btn btn-danger"
            onclick={() => (showModalTolak = true)}
          >
            <X size={16} />
            <span>Tolak</span>
          </button>
        {:else if s.status === 'diverifikasi'}
          <form method="POST" action="?/setujui">
            <button type="submit" class="btn btn-primary">
              <FileCheck size={16} />
              <span>Setujui & Terbitkan Surat</span>
            </button>
          </form>
          <button
            type="button"
            class="btn btn-danger"
            onclick={() => (showModalTolak = true)}
          >
            <X size={16} />
            <span>Tolak</span>
          </button>
        {:else if s.status === 'disetujui'}
          <a
            href="/portal/surat/{s.id}/cetak"
            target="_blank"
            rel="noreferrer"
            class="btn btn-secondary"
          >
            <FileText size={16} />
            <span>Lihat / Cetak Surat PDF</span>
          </a>
        {/if}
      </div>
    </div>
  </div>

  <div class="card detail-card">
    <div class="status-banner">
      <span class="label-caps">Status Permohonan:</span>
      {#if s.status === 'diajukan'}
        <Badge variant="warning">Diajukan (Menunggu Verifikasi)</Badge>
      {:else if s.status === 'diverifikasi'}
        <Badge variant="brand">Diverifikasi (Siap Diterbitkan)</Badge>
      {:else if s.status === 'disetujui'}
        <Badge variant="success">Disetujui & Diterbitkan</Badge>
      {:else}
        <Badge variant="danger">Ditolak</Badge>
      {/if}

      {#if s.nomorSurat}
        <span class="no-surat">Nomor: {s.nomorSurat}</span>
      {/if}
    </div>

    {#if s.catatanPengurus}
      <div class="alert-catatan">
        <strong>Catatan Pengurus:</strong> {s.catatanPengurus}
      </div>
    {/if}

    <dl class="info-grid">
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
        <dt class="label-caps">Dokumen Persyaratan</dt>
        <dd>
          {#if s.dokumenSyarat}
            <a
              href={s.dokumenSyarat}
              target="_blank"
              rel="noreferrer"
              class="doc-link"
            >
              <Download size={14} />
              <span>Unduh Berkas Persyaratan</span>
            </a>
          {:else}
            <span class="text-muted">Tidak ada berkas diunggah</span>
          {/if}
        </dd>
      </div>

      <div class="info-item">
        <dt class="label-caps">Tanggal Terbit</dt>
        <dd>{s.tanggalTerbit ? formatTanggal(s.tanggalTerbit) : '—'}</dd>
      </div>
    </dl>
  </div>

  <div class="card pemohon-card">
    <h2 class="section-title">Data Identitas Pemohon</h2>
    <dl class="info-grid">
      <div class="info-item">
        <dt class="label-caps">Nama Lengkap</dt>
        <dd>{s.namaWarga}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">NIK</dt>
        <dd>{s.nikWarga}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Nomor KK</dt>
        <dd>{s.noKk}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Wilayah</dt>
        <dd>RT {s.nomorRt} / {s.namaRw}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Alamat Tinggal</dt>
        <dd>{s.alamatKk}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Tempat, Tanggal Lahir</dt>
        <dd>{s.tempatLahir}, {s.tanggalLahir}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Jenis Kelamin</dt>
        <dd>{s.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Agama</dt>
        <dd>{s.agama}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Pekerjaan</dt>
        <dd>{s.pekerjaan ?? '—'}</dd>
      </div>
    </dl>
  </div>

  <!-- Modal Tolak -->
  <Modal
    open={showModalTolak}
    title="Tolak Pengajuan Surat"
    onClose={() => (showModalTolak = false)}
  >
    <form method="POST" action="?/tolak" class="form-modal">
      <p class="modal-desc">
        Berikan alasan penolakan agar pemohon dapat memperbaiki dokumen atau data yang diajukan.
      </p>

      <div class="form-group">
        <label for="catatan" class="label-caps">Alasan Penolakan</label>
        <textarea
          id="catatan"
          name="catatan"
          rows="3"
          required
          placeholder="Contoh: Dokumen KTP belum terlampir jelas atau data domisili belum sesuai"
          class="form-input"
        ></textarea>
      </div>

      <div class="modal-actions">
        <button
          type="button"
          class="btn btn-secondary"
          onclick={() => (showModalTolak = false)}
        >
          Batal
        </button>
        <button type="submit" class="btn btn-danger">
          Konfirmasi Penolakan
        </button>
      </div>
    </form>
  </Modal>
</div>

<style>
  .surat-detail-page {
    max-width: 48rem;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    text-decoration: none;
  }

  .header-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  .page-title {
    margin: 0;
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--color-text-primary);
  }

  .page-meta {
    margin: var(--space-1) 0 0;
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .detail-card, .pemohon-card {
    padding: var(--space-5);
  }

  .status-banner {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
    flex-wrap: wrap;
  }

  .no-surat {
    font-weight: 600;
    font-size: var(--text-sm);
    color: var(--color-brand-600);
  }

  .alert-catatan {
    margin-bottom: var(--space-4);
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    background: oklch(0.95 0.05 40);
    color: oklch(0.35 0.1 40);
    border: 1px solid oklch(0.85 0.08 40);
    font-size: var(--text-sm);
  }

  .section-title {
    margin: 0 0 var(--space-4);
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(14rem, 100%), 1fr));
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

  .form-modal {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .modal-desc {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .form-input {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text-primary);
    font-size: var(--text-sm);
    font-family: inherit;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
    margin-top: var(--space-2);
  }
</style>
