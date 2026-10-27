<script lang="ts">
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import type { PageData } from './$types';

  let { data, form }: { data: PageData; form?: { errors?: Record<string, string[]> } } = $props();

  const d = $derived(data.detail);
</script>

<div class="page-container">
  <a href="/iuran/jenis" class="back-link">
    <ArrowLeft size={16} />
    <span>Kembali ke jenis iuran</span>
  </a>

  <h1>Ubah jenis iuran</h1>
  <p class="subtitle">
    Perubahan nominal &amp; porsi berlaku untuk tagihan berikutnya. Tagihan yang sudah terbit
    tidak ikut berubah.
  </p>

  <form method="POST" class="card form-card">
    <div class="field">
      <label for="nama">Nama iuran <span class="required">*</span></label>
      <input id="nama" name="nama" class="input-base" type="text" value={d.nama} required />
      {#if form?.errors?.nama}<span class="field-error">{form.errors.nama[0]}</span>{/if}
    </div>

    <div class="field">
      <label for="nominal">Nominal per KK (Rp) <span class="required">*</span></label>
      <input
        id="nominal"
        name="nominal"
        class="input-base"
        type="number"
        min="1"
        step="1000"
        value={d.nominal}
        required
      />
      {#if form?.errors?.nominal}<span class="field-error">{form.errors.nominal[0]}</span>{/if}
    </div>

    <div class="field">
      <label for="porsiRw">Porsi untuk RW (Rp)</label>
      <input
        id="porsiRw"
        name="porsiRw"
        class="input-base"
        type="number"
        min="0"
        step="1000"
        value={d.porsiRw}
      />
      <span class="field-hint">Bagian RW dari tiap tagihan. Boleh 0 bila semua untuk RT.</span>
      {#if form?.errors?.porsiRw}<span class="field-error">{form.errors.porsiRw[0]}</span>{/if}
    </div>

    <div class="field">
      <label for="scope">Ditagih oleh</label>
      <select id="scope" name="scope" class="input-base">
        <option value="rt" selected={d.scope === 'rt'}>RT (dibagi per wilayah)</option>
        <option value="rw" selected={d.scope === 'rw'}>RW langsung (tidak lewat RT)</option>
      </select>
    </div>

    <div class="field">
      <label for="rtId">Pemilik RT (opsional)</label>
      <select id="rtId" name="rtId" class="input-base">
        <option value="" selected={d.rtId === null}>Semua RT</option>
        {#each data.daftarRt as wilayah (wilayah.id)}
          <option value={wilayah.id} selected={d.rtId === wilayah.id}>
            RT {String(wilayah.nomor).padStart(2, '0')}
          </option>
        {/each}
      </select>
      <span class="field-hint">Kosongkan bila jenis ini berlaku untuk semua RT.</span>
    </div>

    <div class="field">
      <label for="periode">Periode</label>
      <select id="periode" name="periode" class="input-base">
        <option value="bulanan" selected={d.periode === 'bulanan'}>Bulanan</option>
        <option value="tahunan" selected={d.periode === 'tahunan'}>Tahunan</option>
        <option value="insidental" selected={d.periode === 'insidental'}>Insidental</option>
      </select>
    </div>

    <div class="field">
      <label for="urutan">Urutan tampil</label>
      <input id="urutan" name="urutan" class="input-base" type="number" min="0" value={d.urutan} />
    </div>

    <div class="field-checkbox">
      <label class="checkbox-label">
        <input type="checkbox" name="aktif" checked={d.aktif} />
        <span>Aktif</span>
      </label>
    </div>

    <div class="form-actions">
      <a href="/iuran/jenis" class="btn btn-secondary">Batal</a>
      <button type="submit" class="btn btn-primary">Simpan perubahan</button>
    </div>
  </form>
</div>

<style>
  .page-container {
    max-width: 34rem;
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

  .field-hint {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .field-error {
    font-size: var(--text-xs);
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

  .checkbox-label input[type='checkbox'] {
    width: 1.125rem;
    height: 1.125rem;
    accent-color: var(--color-accent);
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
