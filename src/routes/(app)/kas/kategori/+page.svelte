<script lang="ts">
  import type { PageData } from './$types';
  import Badge from '$lib/components/Badge.svelte';
  let { data } = $props<{ data: PageData }>();
</script>

<div class="page-container">
  <div class="page-header">
    <div>
      <h1>Kategori Kas</h1>
      <p class="subtitle">Kelola kategori pemasukan dan pengeluaran.</p>
    </div>
    <a href="/kas" class="btn-secondary">← Kembali</a>
  </div>

  <div class="content-grid">
    <div class="list-card">
      <h2>Daftar Kategori</h2>
      {#if data.semuaKategori.length === 0}
        <p class="empty">Belum ada kategori.</p>
      {:else}
        <table class="kategori-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Jenis</th>
              <th></th>
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
                <td>
                  <form method="POST" action="?/hapus">
                    <input type="hidden" name="id" value={kat.id} />
                    <button type="submit" class="btn-hapus">Hapus</button>
                  </form>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    </div>

    <div class="form-card">
      <h2>Tambah Kategori</h2>
      <form method="POST" action="?/tambah">
        <div class="field">
          <label for="nama">Nama Kategori <span class="required">*</span></label>
          <input id="nama" name="nama" type="text" placeholder="mis. Iuran Keamanan" required />
        </div>
        <div class="field">
          <label for="jenis">Jenis <span class="required">*</span></label>
          <select id="jenis" name="jenis" required>
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </select>
        </div>
        <button type="submit" class="btn-primary">Tambah</button>
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
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.25rem;
  }

  .subtitle {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    margin: 0;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    .content-grid {
      grid-template-columns: 1fr;
    }
  }

  .list-card, .form-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    box-shadow: var(--shadow-card);
  }

  h2 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 1rem;
  }

  .empty {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    text-align: center;
    padding: 2rem 0;
  }

  .kategori-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  .kategori-table th {
    text-align: left;
    padding: 0.5rem 0.75rem;
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--color-text-secondary);
    border-bottom: 1px solid var(--color-border);
  }

  .kategori-table td {
    padding: 0.625rem 0.75rem;
    border-bottom: 1px solid var(--color-border);
  }

  .kategori-table tbody tr:last-child td {
    border-bottom: none;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    margin-bottom: 1rem;
  }

  label {
    font-size: 0.875rem;
    font-weight: 500;
  }

  .required {
    color: var(--color-danger);
  }

  input, select {
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-family: var(--font-sans);
    background: var(--color-surface);
    color: var(--color-text-primary);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    width: 100%;
    box-sizing: border-box;
  }

  input:focus, select:focus {
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px oklch(from var(--color-brand-500) l c h / 0.15);
  }

  .btn-primary, .btn-secondary {
    padding: 0.625rem 1.25rem;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.15s;
    display: inline-block;
  }

  .btn-primary {
    background: var(--color-brand-600);
    color: var(--color-text-inverse);
    border: none;
  }

  .btn-primary:hover {
    background: var(--color-brand-700);
  }

  .btn-secondary {
    background: var(--color-surface);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border-strong);
  }

  .btn-secondary:hover {
    background: var(--color-surface-raised);
  }

  .btn-hapus {
    background: none;
    border: none;
    color: var(--color-danger);
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
    transition: background 0.15s;
  }

  .btn-hapus:hover {
    background: oklch(from var(--color-danger) l c h / 0.1);
  }
</style>
