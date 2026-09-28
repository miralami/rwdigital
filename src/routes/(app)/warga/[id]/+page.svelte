<script lang="ts">
  import type { PageData } from './$types';
  import Badge from '$lib/components/Badge.svelte';
  import { ArrowLeft, Pencil, UserX } from '@lucide/svelte';
  let { data } = $props<{ data: PageData }>();
  const d = data.detail;
</script>

<div class="detail-page">
  <div class="detail-header">
    <a href="/warga" class="back-link">
      <ArrowLeft size={16} />
      <span>Kembali ke Data Warga</span>
    </a>
    <div class="header-actions">
      <a href="/warga/{d.id}/edit" class="btn btn-secondary">
        <Pencil size={15} />
        <span>Edit</span>
      </a>
      <form method="POST" action="?/nonaktifkan">
        <button type="submit" class="btn btn-danger">
          <UserX size={15} />
          <span>Nonaktifkan</span>
        </button>
      </form>
    </div>
  </div>

  <div class="info-card">
    <div class="info-header">
      <h1>{d.nama}</h1>
      {#if d.aktif}
        <Badge variant="success">Aktif</Badge>
      {:else}
        <Badge variant="default">Nonaktif</Badge>
      {/if}
    </div>
    <p class="nik">NIK: {d.nik}</p>

    <dl class="info-grid">
      <div class="info-item">
        <dt>No. KK</dt>
        <dd>{d.noKk}</dd>
      </div>
      <div class="info-item">
        <dt>RT</dt>
        <dd>RT {d.nomorRt}</dd>
      </div>
      <div class="info-item">
        <dt>Alamat KK</dt>
        <dd>{d.alamatKk}</dd>
      </div>
      <div class="info-item">
        <dt>Status Huni</dt>
        <dd>{d.statusHuni}</dd>
      </div>
      <div class="info-item">
        <dt>Tempat, Tanggal Lahir</dt>
        <dd>{d.tempatLahir}, {d.tanggalLahir}</dd>
      </div>
      <div class="info-item">
        <dt>Jenis Kelamin</dt>
        <dd>{d.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</dd>
      </div>
      <div class="info-item">
        <dt>Agama</dt>
        <dd>{d.agama}</dd>
      </div>
      <div class="info-item">
        <dt>Pendidikan</dt>
        <dd>{d.pendidikan ?? '—'}</dd>
      </div>
      <div class="info-item">
        <dt>Pekerjaan</dt>
        <dd>{d.pekerjaan ?? '—'}</dd>
      </div>
      <div class="info-item">
        <dt>Status Perkawinan</dt>
        <dd>{d.statusPerkawinan.replace('_', ' ')}</dd>
      </div>
      <div class="info-item">
        <dt>Status Hubungan KK</dt>
        <dd>{d.statusHubunganKk.replace('_', ' ')}</dd>
      </div>
    </dl>
  </div>

  <section class="anggota-section">
    <h2>Anggota Keluarga ({data.anggotaKk.length})</h2>
    <table class="anggota-table">
      <thead>
        <tr>
          <th>Nama</th>
          <th>NIK</th>
          <th>Status Hubungan</th>
        </tr>
      </thead>
      <tbody>
        {#each data.anggotaKk as anggota}
          <tr>
            <td>{anggota.nama}</td>
            <td>{anggota.nik}</td>
            <td>{anggota.statusHubunganKk.replace('_', ' ')}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
</div>

<style>

  .detail-page {
    max-width: 48rem;
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    color: var(--color-text-secondary);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    transition: color 0.15s ease;
  }

  .back-link:hover {
    color: var(--color-brand-700);
  }

  .header-actions {
    display: flex;
    gap: 0.5rem;
  }

  .info-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    box-shadow: var(--shadow-card);
    margin-bottom: 1.5rem;
  }

  .info-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }

  .nik {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    margin: 0 0 1.25rem;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
    gap: 1rem;
    margin: 0;
  }

  .info-item dt {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--color-text-secondary);
    margin-bottom: 0.25rem;
  }

  .info-item dd {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text-primary);
  }

  .anggota-section h2 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.75rem;
  }

  .anggota-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .anggota-table th {
    text-align: left;
    padding: 0.625rem 0.875rem;
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--color-text-secondary);
    background: var(--color-surface-raised);
    border-bottom: 1px solid var(--color-border);
  }

  .anggota-table td {
    padding: 0.625rem 0.875rem;
    border-bottom: 1px solid var(--color-border);
  }

  .anggota-table tbody tr:last-child td {
    border-bottom: none;
  }

  .btn-secondary, .btn-danger {
    padding: 0.5rem 1rem;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.15s;
  }

  .btn-secondary {
    background: var(--color-surface);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border-strong);
  }

  .btn-secondary:hover {
    background: var(--color-surface-raised);
  }

  .btn-danger {
    background: var(--color-danger);
    color: white;
    border: none;
  }

  .btn-danger:hover {
    opacity: 0.9;
  }
</style>
