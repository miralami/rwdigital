<script lang="ts">
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Badge from '$lib/components/Badge.svelte';
  import { formatRupiah } from '$lib/format';
  import type { PageData } from './$types';

  let { data, form }: { data: PageData; form?: { error?: string } } = $props();

  function totalPaket(item: Array<{ jenisIuranId: number }>): number {
    return item.reduce((jumlah, i) => {
      const jenis = data.semuaJenis.find((j) => j.id === i.jenisIuranId);
      return jumlah + (jenis?.nominal ?? 0);
    }, 0);
  }
</script>

<div class="page-container">
  <a href="/iuran/jenis" class="back-link">
    <ArrowLeft size={16} />
    <span>Kembali ke jenis iuran</span>
  </a>

  <h1>Paket iuran</h1>
  <p class="subtitle">
    Paket menggabungkan beberapa jenis iuran yang biasa ditagih bersamaan, mis. K3 + Soskem +
    Santunan. Nominal tiap jenis tetap diatur di halaman jenis iuran.
  </p>

  {#if form?.error}
    <p class="error-banner" role="alert">{form.error}</p>
  {/if}

  <div class="content-grid">
    <div class="daftar-paket">
      {#if data.paket.length === 0}
        <div class="card panel empty">Belum ada paket iuran.</div>
      {:else}
        {#each data.paket as paket (paket.id)}
          <div class="card panel paket-card">
            <div class="paket-head">
              <div>
                <h2>{paket.nama}</h2>
                {#if paket.keterangan}
                  <p class="paket-keterangan">{paket.keterangan}</p>
                {/if}
              </div>
              {#if paket.aktif}
                <Badge variant="success">Aktif</Badge>
              {:else}
                <Badge variant="default">Nonaktif</Badge>
              {/if}
            </div>

            <ul class="item-list">
              {#each paket.item as isi (isi.jenisIuranId)}
                {@const jenis = data.semuaJenis.find((j) => j.id === isi.jenisIuranId)}
                <li class="item-row">
                  <span>{jenis?.nama ?? 'Jenis tidak ditemukan'}</span>
                  <span class="item-nominal">{formatRupiah(jenis?.nominal ?? 0)}</span>
                </li>
              {/each}
            </ul>
            <p class="paket-total">
              Total per KK: <strong>{formatRupiah(totalPaket(paket.item))}</strong>
            </p>

            <details class="ubah-details">
              <summary class="btn btn-secondary btn-ubah">Ubah paket</summary>
              <form method="POST" action="?/ubah" class="form-ubah">
                <input type="hidden" name="id" value={paket.id} />
                <div class="field">
                  <label for="nama-{paket.id}">Nama paket</label>
                  <input
                    id="nama-{paket.id}"
                    name="nama"
                    class="input-base"
                    type="text"
                    value={paket.nama}
                    required
                  />
                </div>
                <div class="field">
                  <label for="keterangan-{paket.id}">Keterangan</label>
                  <input
                    id="keterangan-{paket.id}"
                    name="keterangan"
                    class="input-base"
                    type="text"
                    value={paket.keterangan ?? ''}
                  />
                </div>
                <div class="field">
                  <span class="field-label">Jenis dalam paket</span>
                  {#each data.semuaJenis as jenis (jenis.id)}
                    <label class="checkbox-label">
                      <input
                        type="checkbox"
                        name="jenisIds"
                        value={jenis.id}
                        checked={paket.item.some((i) => i.jenisIuranId === jenis.id) || undefined}
                      />
                      <span>{jenis.nama} — {formatRupiah(jenis.nominal)}</span>
                    </label>
                  {/each}
                </div>
                <div class="field">
                  <label class="checkbox-label">
                    <input type="checkbox" name="aktif" checked={paket.aktif} />
                    <span>Aktif</span>
                  </label>
                </div>
                <div class="form-actions">
                  <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
              </form>
              <form method="POST" action="?/hapus" class="form-hapus">
                <input type="hidden" name="id" value={paket.id} />
                <button type="submit" class="btn btn-ghost btn-hapus">Hapus paket</button>
              </form>
            </details>
          </div>
        {/each}
      {/if}
    </div>

    <div class="card panel">
      <h2>Buat paket baru</h2>
      <form method="POST" action="?/tambah">
        <div class="field">
          <label for="nama">Nama paket <span class="required">*</span></label>
          <input
            id="nama"
            name="nama"
            class="input-base"
            type="text"
            placeholder="mis. Iuran Wajib RT"
            required
          />
        </div>
        <div class="field">
          <label for="keterangan">Keterangan</label>
          <input
            id="keterangan"
            name="keterangan"
            class="input-base"
            type="text"
            placeholder="mis. Ditagih setiap bulan"
          />
        </div>
        <div class="field">
          <span class="field-label">Jenis dalam paket <span class="required">*</span></span>
          {#if data.semuaJenis.length === 0}
            <p class="empty-kecil">Belum ada jenis iuran.</p>
          {:else}
            {#each data.semuaJenis as jenis (jenis.id)}
              <label class="checkbox-label">
                <input type="checkbox" name="jenisIds" value={jenis.id} />
                <span>{jenis.nama} — {formatRupiah(jenis.nominal)}</span>
              </label>
            {/each}
          {/if}
        </div>
        <div class="field">
          <label class="checkbox-label">
            <input type="checkbox" name="aktif" checked />
            <span>Aktif</span>
          </label>
        </div>
        <button type="submit" class="btn btn-primary">Buat paket</button>
      </form>
    </div>
  </div>
</div>

<style>
  .page-container {
    max-width: 64rem;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    margin-bottom: var(--space-3);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    text-decoration: none;
  }

  .back-link:hover {
    color: var(--color-text);
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
    max-width: 44rem;
  }

  .error-banner {
    margin: 0 0 var(--space-4);
    padding: var(--space-3) var(--space-4);
    border: 1px solid var(--color-danger);
    border-radius: var(--radius-md);
    background: var(--color-danger-bg);
    color: var(--color-danger);
    font-size: var(--text-sm);
  }

  .content-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
    gap: var(--space-5);
    align-items: start;
  }

  @media (max-width: 56rem) {
    .content-grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .daftar-paket {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .panel {
    padding: var(--space-5);
    min-width: 0;
  }

  .panel.empty {
    text-align: center;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
  }

  h2 {
    font-size: var(--text-base);
    font-weight: 600;
    margin: 0 0 var(--space-1);
  }

  .paket-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-3);
    margin-bottom: var(--space-3);
  }

  .paket-keterangan {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .item-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    margin: 0 0 var(--space-3);
    padding: 0;
    list-style: none;
  }

  .item-row {
    display: flex;
    justify-content: space-between;
    gap: var(--space-3);
    padding: var(--space-1) 0;
    border-bottom: 1px dashed var(--color-border);
    font-size: var(--text-sm);
  }

  .item-row:last-child {
    border-bottom: none;
  }

  .item-nominal {
    color: var(--color-text-muted);
    white-space: nowrap;
  }

  .paket-total {
    margin: 0 0 var(--space-3);
    font-size: var(--text-sm);
  }

  .ubah-details > summary {
    list-style: none;
    cursor: pointer;
    width: fit-content;
  }

  .ubah-details > summary::-webkit-details-marker {
    display: none;
  }

  .btn-ubah {
    display: inline-flex;
    align-items: center;
  }

  .form-ubah {
    margin-top: var(--space-4);
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
  }

  .form-hapus {
    margin-top: var(--space-2);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    margin-bottom: var(--space-4);
  }

  label,
  .field-label {
    font-size: var(--text-sm);
    font-weight: 500;
  }

  .required {
    color: var(--color-danger);
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    min-height: var(--tap-min);
    font-size: var(--text-sm);
    cursor: pointer;
  }

  .checkbox-label input[type='checkbox'] {
    width: 1.125rem;
    height: 1.125rem;
    accent-color: var(--color-accent);
  }

  .btn-hapus {
    min-height: var(--tap-min);
    color: var(--color-danger);
  }

  .btn-hapus:hover {
    background: var(--color-danger-bg);
    color: var(--color-danger);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    padding-top: var(--space-2);
  }

  .empty-kecil {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }
</style>
