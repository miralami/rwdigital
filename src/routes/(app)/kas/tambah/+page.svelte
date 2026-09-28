<script lang="ts">
  import type { PageData } from './$types';
  let { data } = $props<{ data: PageData }>();
</script>

<div class="page-container">
  <h1>Tambah Transaksi</h1>
  <p class="subtitle">Catat pemasukan atau pengeluaran kas RW.</p>

  <form method="POST" class="form-card">
    <div class="field">
      <label for="jenis">Jenis Transaksi <span class="required">*</span></label>
      <select id="jenis" name="jenis" required>
        <option value="pemasukan">Pemasukan</option>
        <option value="pengeluaran">Pengeluaran</option>
      </select>
    </div>

    <div class="field">
      <label for="nominal">Nominal (Rp) <span class="required">*</span></label>
      <input id="nominal" name="nominal" type="number" min="0" step="1000" placeholder="50000" required />
    </div>

    <div class="field">
      <label for="kategoriId">Kategori</label>
      <select id="kategoriId" name="kategoriId">
        <option value="">— Tanpa kategori —</option>
        {#each data.semuaKategori as kat}
          <option value={kat.id}>{kat.nama} ({kat.jenis})</option>
        {/each}
      </select>
    </div>

    <div class="field">
      <label for="tanggal">Tanggal <span class="required">*</span></label>
      <input id="tanggal" name="tanggal" type="date" required />
    </div>

    <div class="field">
      <label for="keterangan">Keterangan <span class="required">*</span></label>
      <input id="keterangan" name="keterangan" type="text" placeholder="Deskripsi transaksi" required />
    </div>

    <div class="form-actions">
      <a href="/kas" class="btn-secondary">Batal</a>
      <button type="submit" class="btn-primary">Simpan</button>
    </div>
  </form>
</div>

<style>

  .page-container {
    max-width: 32rem;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.25rem;
  }

  .subtitle {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    margin: 0 0 1.5rem;
  }

  .form-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    box-shadow: var(--shadow-card);
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

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
  }

  .btn-primary, .btn-secondary {
    padding: 0.625rem 1.25rem;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.15s;
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
</style>
