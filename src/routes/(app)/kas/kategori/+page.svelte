<script lang="ts">
  import type { PageData } from './$types';
  import Badge from '$lib/components/Badge.svelte';
  import { ArrowLeft } from '@lucide/svelte';
  let { data } = $props<{ data: PageData }>();
</script>

<div class="page-container">
  <div class="page-header">
    <div>
      <h1>Kategori kas</h1>
      <p class="subtitle">Kelola kategori pemasukan dan pengeluaran.</p>
    </div>
    <a href="/kas" class="btn btn-secondary">
      <ArrowLeft size={16} />
      <span>Kembali</span>
    </a>
  </div>

  <div class="content-grid">
    <div class="card panel">
      <h2>Daftar kategori</h2>
      {#if data.semuaKategori.length === 0}
        <p class="empty">Belum ada kategori.</p>
      {:else}
        <div class="table-wrap">
          <table class="kategori-table">
            <thead>
              <tr>
                <th class="label-caps">Nama</th>
                <th class="label-caps">Jenis</th>
                <th><span class="sr-only">Aksi</span></th>
              </tr>
            </thead>
            <tbody>
              {#each data.semuaKategori as kat}
                <tr>
                  <td>{kat.nama}</td>
                  <td>
                    {#if kat.jenis === 'pemasukan'}
                      <Badge variant="success">Pemasukan</Badge>
                    {:else}
                      <Badge variant="danger">Pengeluaran</Badge>
                    {/if}
                  </td>
                  <td class="cell-aksi">
                    <form method="POST" action="?/hapus">
                      <input type="hidden" name="id" value={kat.id} />
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
      <h2>Tambah kategori</h2>
      <form method="POST" action="?/tambah">
        <div class="field">
          <label for="nama">Nama kategori <span class="required">*</span></label>
          <input id="nama" name="nama" class="input-base" type="text" placeholder="mis. Iuran Keamanan" required />
        </div>
        <div class="field">
          <label for="jenis">Jenis <span class="required">*</span></label>
          <select id="jenis" name="jenis" class="input-base" required>
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </select>
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
    align-items: flex-start;
    gap: var(--space-3);
    margin-bottom: var(--space-6);
  }

  h1 {
    font-size: var(--text-2xl);
    font-weight: 700;
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--color-text);
    margin: 0 0 var(--space-1);
  }

  .subtitle {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
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

  .kategori-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-sm);
  }

  .kategori-table th {
    text-align: left;
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
  }

  .kategori-table td {
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
    overflow-wrap: anywhere;
  }

  .kategori-table tbody tr:last-child td {
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
</style>
