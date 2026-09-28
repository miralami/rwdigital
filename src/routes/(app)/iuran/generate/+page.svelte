<script lang="ts">
  import type { PageData } from './$types';
  import { formatRupiah } from '$lib/format';
  let { data } = $props<{ data: PageData }>();
</script>

<div class="page-container">
  <h1>Generate tagihan</h1>
  <p class="subtitle">Buat tagihan massal untuk semua KK aktif.</p>

  <form method="POST" class="card form-card">
    <div class="field">
      <label for="jenisIuranId">Jenis iuran <span class="required">*</span></label>
      <select id="jenisIuranId" name="jenisIuranId" class="input-base" required>
        <option value="">Pilih jenis iuran</option>
        {#each data.semuaJenis as j}
          <option value={j.id}>{j.nama} — {formatRupiah(j.nominal)}</option>
        {/each}
      </select>
    </div>

    <div class="field">
      <label for="periode">Periode <span class="required">*</span></label>
      <input id="periode" name="periode" class="input-base" type="month" placeholder="2025-01" required />
    </div>

    <div class="form-actions">
      <a href="/iuran" class="btn btn-secondary">Batal</a>
      <button type="submit" class="btn btn-primary">Generate tagihan</button>
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
