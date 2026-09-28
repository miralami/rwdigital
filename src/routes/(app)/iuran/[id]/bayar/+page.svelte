<script lang="ts">
  import type { PageData } from './$types';
  import Badge from '$lib/components/Badge.svelte';
  import { ArrowLeft, CircleCheckBig } from '@lucide/svelte';
  import { formatRupiah } from '$lib/format';
  let { data } = $props<{ data: PageData }>();
  const d = $derived(data.detail);
</script>

<div class="page-container">
  <a href="/iuran" class="back-link">
    <ArrowLeft size={16} />
    <span>Kembali</span>
  </a>

  <div class="card info-card">
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
        <dt class="label-caps">No. KK</dt>
        <dd>{d.noKk}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Alamat</dt>
        <dd>{d.alamatKk}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Periode</dt>
        <dd>{d.periode}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Tagihan</dt>
        <dd>{formatRupiah(d.nominal)}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Sudah dibayar</dt>
        <dd>{formatRupiah(data.totalDibayar)}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Sisa</dt>
        <dd class="sisa">{formatRupiah(data.sisaTagihan)}</dd>
      </div>
    </dl>
  </div>

  {#if data.sisaTagihan > 0}
    <div class="card form-card">
      <h2>Catat pembayaran</h2>
      <form method="POST">
        <div class="field">
          <label for="jumlah">Jumlah bayar (Rp) <span class="required">*</span></label>
          <input id="jumlah" name="jumlah" class="input-base" type="number" min="0" step="1000" placeholder={String(data.sisaTagihan)} required />
        </div>
        <div class="field">
          <label for="metodeBayar">Metode pembayaran <span class="required">*</span></label>
          <select id="metodeBayar" name="metodeBayar" class="input-base" required>
            <option value="tunai">Tunai</option>
            <option value="transfer">Transfer</option>
            <option value="qris">QRIS</option>
          </select>
        </div>
        <div class="field">
          <label for="dibayarPada">Tanggal bayar <span class="required">*</span></label>
          <input id="dibayarPada" name="dibayarPada" class="input-base" type="date" required />
        </div>
        <div class="field">
          <label for="referensi">Referensi</label>
          <input id="referensi" name="referensi" class="input-base" type="text" placeholder="Nomor referensi (opsional)" />
        </div>
        <div class="field">
          <label for="catatan">Catatan</label>
          <input id="catatan" name="catatan" class="input-base" type="text" placeholder="Catatan (opsional)" />
        </div>
        <div class="form-actions">
          <a href="/iuran" class="btn btn-secondary">Batal</a>
          <button type="submit" class="btn btn-primary">Simpan pembayaran</button>
        </div>
      </form>
    </div>
  {:else}
    <p class="success-card">
      <CircleCheckBig size={18} aria-hidden="true" />
      <span>Tagihan ini sudah lunas</span>
    </p>
  {/if}

  {#if data.riwayatPembayaran.length > 0}
    <section class="riwayat-section">
      <h2>Riwayat pembayaran</h2>
      <div class="card table-wrap">
        <table class="riwayat-table">
          <thead>
            <tr>
              <th class="label-caps">Tanggal</th>
              <th class="label-caps">Jumlah</th>
              <th class="label-caps">Metode</th>
              <th class="label-caps">Catatan</th>
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
    </section>
  {/if}
</div>

<style>
  .page-container {
    max-width: 40rem;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    min-height: var(--tap-min);
    margin-bottom: var(--space-4);
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

  .info-card {
    padding: var(--space-5);
    margin-bottom: var(--space-6);
  }

  .info-header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
  }

  h1 {
    font-size: var(--text-xl);
    font-weight: 700;
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    margin: 0;
    overflow-wrap: anywhere;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(10rem, 100%), 1fr));
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

  .sisa {
    color: var(--color-danger);
    font-weight: 600;
  }

  .form-card {
    padding: var(--space-5);
    margin-bottom: var(--space-6);
  }

  h2 {
    font-size: var(--text-base);
    font-weight: 600;
    margin: 0 0 var(--space-4);
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

  .success-card {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    margin: 0 0 var(--space-6);
    padding: var(--space-4);
    border-radius: var(--radius-md);
    background-color: var(--color-success-bg);
    border: 1px solid color-mix(in oklab, var(--color-success) 30%, transparent);
    color: var(--color-success);
    font-size: var(--text-sm);
    font-weight: 600;
  }

  .success-card :global(svg) {
    flex-shrink: 0;
  }

  .riwayat-section h2 {
    margin: 0 0 var(--space-3);
  }

  /* Tabel melebar sendiri, halaman tidak pernah scroll horizontal. */
  .table-wrap {
    overflow-x: auto;
  }

  .riwayat-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-sm);
  }

  .riwayat-table th {
    text-align: left;
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface-muted);
    border-bottom: 1px solid var(--color-border);
  }

  .riwayat-table td {
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--color-border);
    overflow-wrap: anywhere;
  }

  .riwayat-table tbody tr:last-child td {
    border-bottom: none;
  }
</style>
