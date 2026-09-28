<script lang="ts">
  import type { PageData } from './$types';
  import Badge from '$lib/components/Badge.svelte';
  import { ArrowLeft, Pencil, UserX } from '@lucide/svelte';
  let { data } = $props<{ data: PageData }>();
  const d = $derived(data.detail);
</script>

<div class="detail-page">
  <div class="detail-header">
    <a href="/warga" class="back-link">
      <ArrowLeft size={16} />
      <span>Kembali ke data warga</span>
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

  <div class="card info-card">
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
        <dt class="label-caps">No. KK</dt>
        <dd>{d.noKk}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">RT</dt>
        <dd>RT {d.nomorRt}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Alamat KK</dt>
        <dd>{d.alamatKk}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Status Huni</dt>
        <dd>{d.statusHuni}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Tempat, Tanggal Lahir</dt>
        <dd>{d.tempatLahir}, {d.tanggalLahir}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Jenis Kelamin</dt>
        <dd>{d.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Agama</dt>
        <dd>{d.agama}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Pendidikan</dt>
        <dd>{d.pendidikan ?? '—'}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Pekerjaan</dt>
        <dd>{d.pekerjaan ?? '—'}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Status Perkawinan</dt>
        <dd>{d.statusPerkawinan.replace('_', ' ')}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Status Hubungan KK</dt>
        <dd>{d.statusHubunganKk.replace('_', ' ')}</dd>
      </div>
    </dl>
  </div>

  <section class="anggota-section">
    <h2>Anggota keluarga ({data.anggotaKk.length})</h2>
    <div class="card table-wrap">
      <table class="anggota-table">
        <thead>
          <tr>
            <th class="label-caps">Nama</th>
            <th class="label-caps">NIK</th>
            <th class="label-caps">Status Hubungan</th>
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
    </div>
  </section>
</div>

<style>
  .detail-page {
    max-width: 48rem;
  }

  .detail-header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-6);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    min-height: var(--tap-min);
    color: var(--color-text-muted);
    text-decoration: none;
    font-size: var(--text-sm);
    font-weight: 500;
    transition: color 0.15s ease;
  }

  .back-link:hover {
    color: var(--color-accent);
  }

  .back-link:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: var(--radius-xs);
  }

  .header-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .info-card {
    padding: var(--space-5);
    margin-bottom: var(--space-6);
  }

  .info-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-2);
  }

  h1 {
    font-size: var(--text-2xl);
    font-weight: 700;
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    margin: 0;
    overflow-wrap: anywhere;
  }

  .nik {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    margin: 0 0 var(--space-5);
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
    color: var(--color-text);
    overflow-wrap: anywhere;
  }

  .anggota-section h2 {
    font-size: var(--text-lg);
    font-weight: 600;
    margin: 0 0 var(--space-3);
  }

  /* Tabel melebar sendiri, halaman tidak pernah scroll horizontal. */
  .table-wrap {
    overflow-x: auto;
  }

  .anggota-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-sm);
  }

  .anggota-table th {
    text-align: left;
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface-muted);
    border-bottom: 1px solid var(--color-border);
  }

  .anggota-table td {
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--color-border);
    overflow-wrap: anywhere;
  }

  .anggota-table tbody tr:last-child td {
    border-bottom: none;
  }
</style>
