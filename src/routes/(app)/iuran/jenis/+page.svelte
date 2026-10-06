<script lang="ts">
  import type { PageData } from './$types';
  import Badge from '$lib/components/Badge.svelte';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import { formatRupiah } from '$lib/format';
  let { data } = $props<{ data: PageData }>();
</script>

<div class="page-container">
  <div class="page-header">
    <h1>Jenis iuran</h1>
    <a href="/iuran" class="btn btn-secondary">
      <ArrowLeft size={16} />
      <span>Kembali</span>
    </a>
  </div>

  <div class="content-grid">
    <div class="card panel">
      <h2>Daftar jenis iuran</h2>
      {#if data.semuaJenis.length === 0}
        <p class="empty">Belum ada jenis iuran.</p>
      {:else}
        <div class="table-wrap">
          <table class="jenis-table">
            <thead>
              <tr>
                <th class="label-caps">Nama</th>
                <th class="label-caps">Nominal</th>
                <th class="label-caps">Periode</th>
                <th class="label-caps">Status</th>
                <th><span class="sr-only">Aksi</span></th>
              </tr>
            </thead>
            <tbody>
              {#each data.semuaJenis as j}
                <tr>
                  <td>{j.nama}</td>
                  <td>{formatRupiah(j.nominal)}</td>
                  <td>{j.periode}</td>
                  <td>
                    {#if j.aktif}
                      <Badge variant="success">Aktif</Badge>
                    {:else}
                      <Badge variant="default">Nonaktif</Badge>
                    {/if}
                  </td>
                  <td class="cell-aksi">
                    <form method="POST" action="?/hapus">
                      <input type="hidden" name="id" value={j.id} />
                      <button type="submit" class="btn btn-ghost btn-hapus">Hapus</button>
                    </form>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>

    <div class="card panel">
      <h2>Tambah jenis iuran</h2>
      <form method="POST" action="?/tambah">
        <div class="field">
          <label for="nama">Nama iuran <span class="required">*</span></label>
          <input id="nama" name="nama" class="input-base" type="text" placeholder="mis. Iuran Keamanan" required />
        </div>
        <div class="field">
          <label for="nominal">Nominal (Rp) <span class="required">*</span></label>
          <input id="nominal" name="nominal" class="input-base" type="number" min="0" step="1000" placeholder="50000" required />
        </div>
        <div class="field">
          <label for="periode">Periode</label>
          <select id="periode" name="periode" class="input-base">
            <option value="bulanan">Bulanan</option>
            <option value="tahunan">Tahunan</option>
            <option value="insidental">Insidental</option>
          </select>
        </div>
        <div class="field-checkbox">
          <label class="checkbox-label">
            <input type="checkbox" name="aktif" checked />
            <span>Aktif</span>
          </label>
        </div>
        <button type="submit" class="btn btn-primary">Tambah</button>
      </form>
    </div>
  </div>
</div>

<style>
  .page-container {
    max-width: 48rem;
  }

  .page-header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-6);
  }

  h1 {
    font-size: var(--text-2xl);
    font-weight: 700;
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--color-text);
    margin: 0;
  }

  .content-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-5);
  }

  @media (max-width: 48rem) {
    .content-grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .panel {
    padding: var(--space-5);
    min-width: 0;
  }

  h2 {
    font-size: var(--text-base);
    font-weight: 600;
    margin: 0 0 var(--space-4);
  }

  .empty {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    text-align: center;
    padding: var(--space-8) 0;
  }

  /* Tabel melebar sendiri, halaman tidak pernah scroll horizontal. */
  .table-wrap {
    overflow-x: auto;
  }

  .jenis-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-sm);
  }

  .jenis-table th {
    text-align: left;
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
  }

  .jenis-table td {
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
    overflow-wrap: anywhere;
  }

  .jenis-table tbody tr:last-child td {
    border-bottom: none;
  }

  .cell-aksi {
    text-align: right;
  }

  .btn-hapus {
    min-height: var(--tap-min);
    color: var(--color-danger);
  }

  .btn-hapus:hover {
    background: var(--color-danger-bg);
    color: var(--color-danger);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    margin-bottom: var(--space-4);
  }

  label {
    font-size: var(--text-sm);
    font-weight: 500;
  }

  .required {
    color: var(--color-danger);
  }

  .field-checkbox {
    margin-bottom: var(--space-4);
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    min-height: var(--tap-min);
    font-size: var(--text-sm);
    cursor: pointer;
  }

  .checkbox-label input[type="checkbox"] {
    width: 1.125rem;
    height: 1.125rem;
    accent-color: var(--color-accent);
  }
</style>
