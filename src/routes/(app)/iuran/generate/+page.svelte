<script lang="ts">
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import FilePlus2 from '@lucide/svelte/icons/file-plus-2';
  import Badge from '$lib/components/Badge.svelte';
  import { formatRupiah } from '$lib/format';
  import type { PageData } from './$types';

  type Ringkasan = {
    periode: string;
    rtTarget: number | null;
    jumlahKkAktif: number;
    jumlahJenis: number;
    dibuat: number;
    dilewati: number;
    totalNominal: number;
    totalPorsiRw: number;
  };

  let { data, form }: { data: PageData; form?: { error?: string; sukses?: Ringkasan } } =
    $props();

  let paketTerpilih = $state('');

  const paketTerpilihData = $derived(data.semuaPaket.find((p) => String(p.id) === paketTerpilih));
  const jenisDalamPaket = $derived(
    paketTerpilihData
      ? data.itemPaket
          .filter((item) => item.paketId === paketTerpilihData.id)
          .map((item) => item.jenisIuranId)
      : []
  );
</script>

<div class="page-container">
  <a href="/iuran" class="back-link">
    <ArrowLeft size={16} />
    <span>Kembali ke daftar iuran</span>
  </a>

  <h1>Generate tagihan</h1>
  <p class="subtitle">
    Buat tagihan massal untuk KK aktif. Nominal &amp; porsi dikunci saat tagihan dibuat, jadi
    perubahan konfigurasi berikutnya tidak mengubah tagihan lama.
  </p>

  {#if form?.error}
    <p class="error-banner" role="alert">{form.error}</p>
  {/if}

  {#if form?.sukses}
    <div class="success-card" role="status">
      <h2>Tagihan periode {form.sukses.periode} diproses</h2>
      <dl class="ringkasan-grid">
        <div>
          <dt>Tagihan baru</dt>
          <dd>{form.sukses.dibuat}</dd>
        </div>
        <div>
          <dt>Sudah ada (dilewati)</dt>
          <dd>{form.sukses.dilewati}</dd>
        </div>
        <div>
          <dt>KK aktif</dt>
          <dd>{form.sukses.jumlahKkAktif}</dd>
        </div>
        <div>
          <dt>Jenis iuran</dt>
          <dd>{form.sukses.jumlahJenis}</dd>
        </div>
        <div>
          <dt>Total nominal baru</dt>
          <dd>{formatRupiah(form.sukses.totalNominal)}</dd>
        </div>
        <div>
          <dt>Porsi RW baru</dt>
          <dd>{formatRupiah(form.sukses.totalPorsiRw)}</dd>
        </div>
      </dl>
      <p class="success-hint">
        Generate ulang untuk periode yang sama aman: kombinasi KK + jenis + periode yang sudah
        ada akan dilewati.
      </p>
    </div>
  {/if}

  <form method="POST" class="card form-card">
    <div class="field">
      <label for="periode">Periode <span class="required">*</span></label>
      <input
        id="periode"
        name="periode"
        class="input-base"
        type="month"
        placeholder="2026-10"
        required
      />
    </div>

    {#if data.scopeKind === 'all'}
      <div class="field">
        <label for="rtId">Wilayah</label>
        <select id="rtId" name="rtId" class="input-base">
          <option value="">Semua RT</option>
          {#each data.daftarRt as wilayah (wilayah.id)}
            <option value={wilayah.id}>RT {String(wilayah.nomor).padStart(2, '0')}</option>
          {/each}
        </select>
        <span class="field-hint">Pilih satu RT kalau tagihan hanya untuk wilayah tersebut.</span>
      </div>
    {:else}
      <input type="hidden" name="rtId" value={data.daftarRt[0]?.id ?? ''} />
    {/if}

    <div class="field">
      <label for="paketId">Paket iuran</label>
      <select id="paketId" name="paketId" class="input-base" bind:value={paketTerpilih}>
        <option value="">Tanpa paket (pilih jenis manual)</option>
        {#each data.semuaPaket as paket (paket.id)}
          <option value={String(paket.id)}>{paket.nama}</option>
        {/each}
      </select>
      <span class="field-hint">
        Paket menagih semua jenis di dalamnya. Kalau paket dipilih, centang jenis di bawah
        diabaikan.
      </span>
    </div>

    <fieldset class="jenis-fieldset">
      <legend>Jenis iuran</legend>

      {#if data.semuaJenis.length === 0}
        <p class="empty">Belum ada jenis iuran. Tambahkan dulu di menu Kelola jenis.</p>
      {:else}
        <ul class="jenis-list">
          {#each data.semuaJenis as jenis (jenis.id)}
            {@const bisaDitagih = jenis.aktif && jenis.scope === 'rt'}
            {@const bagianPaket = jenisDalamPaket.includes(jenis.id)}
            <li class="jenis-item" class:nonaktif={!bisaDitagih}>
              <label class="jenis-label">
                <input
                  type="checkbox"
                  name="jenisIds"
                  value={jenis.id}
                  disabled={!bisaDitagih}
                  checked={bagianPaket || undefined}
                />
                <span class="jenis-text">
                  <span class="jenis-nama">
                    {jenis.nama}
                    <Badge variant={jenis.scope === 'rt' ? 'brand' : 'default'}>
                      {jenis.scope === 'rt' ? 'Iuran RT' : 'Iuran RW'}
                    </Badge>
                    {#if !jenis.aktif}
                      <Badge variant="warning">Nonaktif</Badge>
                    {/if}
                  </span>
                  <span class="jenis-meta">
                    {formatRupiah(jenis.nominal)} · porsi RW {formatRupiah(jenis.porsiRw)} · {jenis.periode}
                  </span>
                </span>
              </label>
            </li>
          {/each}
        </ul>
        <p class="field-hint">
          Jenis iuran milik RW tidak bisa digenerate lewat RT; kelola scope-nya di halaman Kelola
          jenis.
        </p>
      {/if}
    </fieldset>

    <div class="form-actions">
      <a href="/iuran" class="btn btn-secondary">Batal</a>
      <button type="submit" class="btn btn-primary">
        <FilePlus2 size={16} />
        <span>Generate tagihan</span>
      </button>
    </div>
  </form>
</div>

<style>
  .page-container {
    max-width: 44rem;
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

  .success-card {
    margin-bottom: var(--space-4);
    padding: var(--space-5);
    border: 1px solid var(--color-success);
    border-radius: var(--radius-md);
    background: var(--color-success-bg);
  }

  .success-card h2 {
    margin: 0 0 var(--space-3);
    font-size: var(--text-base);
    font-weight: 600;
  }

  .ringkasan-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
    gap: var(--space-3);
    margin: 0;
  }

  .ringkasan-grid dt {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .ringkasan-grid dd {
    margin: 0;
    font-size: var(--text-lg);
    font-weight: 700;
  }

  .success-hint {
    margin: var(--space-4) 0 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
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

  label,
  legend {
    font-size: var(--text-sm);
    font-weight: 500;
  }

  .required {
    color: var(--color-danger);
  }

  .field-hint {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .jenis-fieldset {
    margin: 0 0 var(--space-4);
    padding: var(--space-4);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .jenis-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    margin: var(--space-2) 0 0;
    padding: 0;
    list-style: none;
  }

  .jenis-item {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-3);
  }

  .jenis-item.nonaktif {
    opacity: 0.55;
  }

  .jenis-label {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    min-height: var(--tap-min);
    cursor: pointer;
  }

  .jenis-label input[type='checkbox'] {
    width: 1.125rem;
    height: 1.125rem;
    margin-top: 0.2rem;
    accent-color: var(--color-accent);
  }

  .jenis-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .jenis-nama {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    font-weight: 500;
  }

  .jenis-meta {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .empty {
    margin: var(--space-2) 0;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
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
