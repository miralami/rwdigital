<script lang="ts">
  import PageHeader from '$lib/components/PageHeader.svelte';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Signature from '@lucide/svelte/icons/signature';
  import type { PageData } from './$types';

  let { data, form } = $props<{
    data: PageData;
    form?: { error?: string; sukses?: string };
  }>();
</script>

<div class="page-container">
  <PageHeader
    title="Tanda Tangan Elektronik"
    subtitle="Gambar TTD ini dipakai saat Anda memverifikasi dan menandatangani surat warga sebagai Pengurus RW."
  >
    <a href="/pengaturan" class="btn btn-secondary">
      <ArrowLeft size={16} />
      <span>Kembali</span>
    </a>
  </PageHeader>

  {#if form?.error}
    <p class="banner banner-error" role="alert">{form.error}</p>
  {/if}
  {#if form?.sukses}
    <p class="banner banner-sukses" role="status">{form.sukses}</p>
  {/if}

  <div class="card ttd-card">
    <div class="ttd-preview-box">
      {#if data.ttdUrl}
        <img src={data.ttdUrl} alt="Tanda tangan elektronik saat ini" class="ttd-preview" />
      {:else}
        <div class="ttd-empty">
          <Signature size={28} />
          <span>Belum ada tanda tangan</span>
        </div>
      {/if}
    </div>

    <form method="POST" enctype="multipart/form-data" class="ttd-form">
      <div class="field">
        <label for="ttd">Unggah gambar TTD <span class="required">*</span></label>
        <input
          id="ttd"
          name="ttd"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          class="input-base"
          required
        />
        <span class="hint">PNG transparan disarankan. Maksimal 2MB.</span>
      </div>

      <button type="submit" class="btn btn-primary">Simpan Tanda Tangan</button>
    </form>
  </div>
</div>

<style>
  .page-container {
    max-width: 48rem;
  }

  .banner {
    margin: 0 0 var(--space-4);
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    border: 1px solid var(--color-border);
  }

  .banner-error {
    border-color: color-mix(in oklab, var(--color-danger) 35%, transparent);
    background: var(--color-danger-bg);
    color: var(--color-danger);
  }

  .banner-sukses {
    border-color: color-mix(in oklab, var(--color-success) 35%, transparent);
    background: var(--color-success-bg);
    color: var(--color-success);
  }

  .ttd-card {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--space-5);
    align-items: center;
    padding: var(--space-5);
  }

  @media (max-width: 40rem) {
    .ttd-card {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .ttd-preview-box {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 9rem;
    padding: var(--space-4);
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface-muted);
  }

  .ttd-preview {
    max-height: 7rem;
    max-width: 100%;
    object-fit: contain;
  }

  .ttd-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
  }

  .ttd-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  label {
    font-size: var(--text-sm);
    font-weight: 500;
  }

  .required {
    color: var(--color-danger);
  }

  .hint {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }
</style>
