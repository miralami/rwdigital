<script lang="ts">
  import type { PageData } from './$types';
  import Badge from '$lib/components/Badge.svelte';
  let { data } = $props<{ data: PageData }>();
  const d = data.detail;

  function formatRupiah(n: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(n);
  }
</script>

<div class="page-container">
  <div class="detail-header">
    <a href="/iuran" class="back-link">← Kembali</a>
  </div>

  <div class="info-card">
    <div class="info-header">
      <h1>{d.namaJenisIuran}</h1>
      {#if d.status === 'lunas'}
        <Badge variant="success">Lunas</Badge>
      {:else if d.status === 'sebagian'}
        <Badge variant="warning">Sebagian</Badge>
      {:else}
        <Badge variant="danger">Belum Bayar</Badge>
      {/if}
    </div>

    <dl class="info-grid">
      <div class="info-item">
        <dt>No. KK</dt>
        <dd>{d.noKk}</dd>
      </div>
      <div class="info-item">
        <dt>Alamat</dt>
        <dd>{d.alamatKk}</dd>
      </div>
      <div class="info-item">
        <dt>Periode</dt>
        <dd>{d.periode}</dd>
      </div>
      <div class="info-item">
        <dt>Tagihan</dt>
        <dd>{formatRupiah(d.nominal)}</dd>
      </div>
      <div class="info-item">
        <dt>Sudah Dibayar</dt>
        <dd>{formatRupiah(data.totalDibayar)}</dd>
      </div>
      <div class="info-item">
        <dt>Sisa</dt>
        <dd class="sisa">{formatRupiah(data.sisaTagihan)}</dd>
      </div>
    </dl>
  </div>

  {#if data.sisaTagihan > 0}
    <div class="form-card">
      <h2>Catat Pembayaran</h2>
      <form method="POST">
        <div class="field">
          <label for="jumlah">Jumlah Bayar (Rp) <span class="required">*</span></label>
          <input id="jumlah" name="jumlah" type="number" min="0" step="1000" placeholder={String(data.sisaTagihan)} required />
        </div>
        <div class="field">
          <label for="metodeBayar">Metode Pembayaran <span class="required">*</span></label>
          <select id="metodeBayar" name="metodeBayar" required>
            <option value="tunai">Tunai</option>
            <option value="transfer">Transfer</option>
            <option value="qris">QRIS</option>
          </select>
        </div>
        <div class="field">
          <label for="dibayarPada">Tanggal Bayar <span class="required">*</span></label>
          <input id="dibayarPada" name="dibayarPada" type="date" required />
        </div>
        <div class="field">
          <label for="referensi">Referensi</label>
          <input id="referensi" name="referensi" type="text" placeholder="Nomor referensi (opsional)" />
        </div>
        <div class="field">
          <label for="catatan">Catatan</label>
          <input id="catatan" name="catatan" type="text" placeholder="Catatan (opsional)" />
        </div>
        <div class="form-actions">
          <a href="/iuran" class="btn-secondary">Batal</a>
          <button type="submit" class="btn-primary">Simpan Pembayaran</button>
        </div>
      </form>
    </div>
  {:else}
    <div class="success-card">
      <p>✓ Tagihan ini sudah lunas.</p>
    </div>
  {/if}

  {#if data.riwayatPembayaran.length > 0}
    <div class="riwayat-card">
      <h2>Riwayat Pembayaran</h2>
      <table class="riwayat-table">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Jumlah</th>
            <th>Metode</th>
            <th>Catatan</th>
          </tr>
        </thead>
        <tbody>
          {#each data.riwayatPembayaran as p}
            <tr>
              <td>{p.dibayarPada}</td>
              <td>{formatRupiah(p.jumlah)}</td>
              <td>{p.metodeBayar}</td>
              <td>{p.catatan ?? '—'}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>

  .page-container {
    max-width: 40rem;
  }

  .detail-header {
    margin-bottom: 1rem;
  }

  .back-link {
    color: var(--color-text-secondary);
    text-decoration: none;
    font-size: 0.875rem;
  }

  .back-link:hover {
    color: var(--color-text-primary);
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
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
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

  .sisa {
    color: var(--color-danger);
    font-weight: 600;
  }

  .form-card, .riwayat-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    box-shadow: var(--shadow-card);
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 1rem;
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

  .success-card {
    background: oklch(from var(--color-success) l c h / 0.08);
    border: 1px solid oklch(from var(--color-success) l c h / 0.2);
    border-radius: var(--radius-lg);
    padding: 1rem;
    text-align: center;
    color: var(--color-success);
    font-weight: 600;
  }

  .riwayat-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  .riwayat-table th {
    text-align: left;
    padding: 0.5rem 0.75rem;
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--color-text-secondary);
    border-bottom: 1px solid var(--color-border);
  }

  .riwayat-table td {
    padding: 0.625rem 0.75rem;
    border-bottom: 1px solid var(--color-border);
  }

  .riwayat-table tbody tr:last-child td {
    border-bottom: none;
  }
</style>
