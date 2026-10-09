<script lang="ts">
  import type { PageData } from './$types';
  let { data } = $props<{ data: PageData }>();
</script>

<div class="page-container">
  <h1>Tambah transaksi</h1>
  <p class="subtitle">Catat pemasukan atau pengeluaran kas RW.</p>

  <form method="POST" enctype="multipart/form-data" class="card form-card">
    <div class="field">
      <label for="jenis">Jenis transaksi <span class="required">*</span></label>
      <select id="jenis" name="jenis" class="input-base" required>
        <option value="pemasukan">Pemasukan</option>
        <option value="pengeluaran">Pengeluaran</option>
      </select>
    </div>

    <div class="field">
      <label for="nominal">Nominal (Rp) <span class="required">*</span></label>
      <input id="nominal" name="nominal" class="input-base" type="number" min="0" step="1000" placeholder="50000" required />
    </div>

    <div class="field">
      <label for="kategoriId">Kategori</label>
      <select id="kategoriId" name="kategoriId" class="input-base">
        <option value="">— Tanpa kategori —</option>
        {#each data.semuaKategori as kat}
          <option value={kat.id}>{kat.nama} ({kat.jenis})</option>
        {/each}
      </select>
    </div>

    <div class="field">
      <label for="tanggal">Tanggal <span class="required">*</span></label>
      <input id="tanggal" name="tanggal" class="input-base" type="date" required />
    </div>

    <div class="field">
      <label for="keterangan">Keterangan <span class="required">*</span></label>
      <input id="keterangan" name="keterangan" class="input-base" type="text" placeholder="Deskripsi transaksi" required />
    </div>

    <div class="field">
      <label for="buktiFile">Berkas Bukti Transaksi (Opsional)</label>
      <input id="buktiFile" name="buktiFile" class="input-base" type="file" accept="image/*,.pdf" />
      <span class="field-hint">Foto nota, kuitansi, atau bukti transfer (SF-KS-03).</span>
    </div>

    <div class="form-actions">
      <a href="/kas" class="btn btn-secondary">Batal</a>
      <button type="submit" class="btn btn-primary">Simpan</button>
    </div>
  </form>
</div>

<style>
  .page-container {
    max-width: 32rem;
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
    margin: 0 0 var(--space-6);
  }

  .form-card {
    padding: var(--space-5);
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

  .form-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: var(--space-2);
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
  }
</style>
