<script lang="ts">
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Send from '@lucide/svelte/icons/send';
  import Card from '$lib/components/Card.svelte';
  import FormField from '$lib/components/FormField.svelte';
  import Button from '$lib/components/Button.svelte';
  import type { PageData, ActionData } from './$types';

  let { data, form } = $props<{ data: PageData; form: ActionData }>();

  let jenis = $state('skck');
  let keperluan = $state('');
  let keterangan = $state('');
</script>

<div class="ajukan-page">
  <div class="header">
    <a href="/portal#surat" class="back-link">
      <ArrowLeft size={16} />
      <span>Kembali ke Portal Warga</span>
    </a>
    <h1 class="page-title">Permohonan Pengantar / Keterangan Surat</h1>
    <p class="page-subtitle">
      Pemohon: <strong>{data.warga.nama}</strong> (NIK: {data.warga.nik})
    </p>
  </div>

  <Card>
    <form method="POST" enctype="multipart/form-data" class="form-body">
      <FormField
        label="Jenis Surat"
        name="jenis"
        required
        error={form?.errors?.jenis?.[0]}
        hint="Pilih jenis surat pengantar atau surat keterangan yang dibutuhkan."
      >
        <select name="jenis" id="jenis" bind:value={jenis} required>
          <option value="skck">Surat Pengantar SKCK</option>
          <option value="domisili">Surat Keterangan Domisili</option>
          <option value="sktm">Surat Keterangan Tidak Mampu (SKTM)</option>
          <option value="usaha">Surat Keterangan Usaha</option>
          <option value="umum">Surat Pengantar Umum</option>
        </select>
      </FormField>

      <FormField
        label="Keperluan Permohonan"
        name="keperluan"
        required
        error={form?.errors?.keperluan?.[0]}
        hint="Jelaskan untuk keperluan apa surat ini diajukan (misal: melamar pekerjaan, beasiswa, pendaftaran sekolah)."
      >
        <input
          type="text"
          name="keperluan"
          id="keperluan"
          placeholder="Contoh: Persyaratan melamar pekerjaan"
          required
          bind:value={keperluan}
        />
      </FormField>

      <FormField
        label="Keterangan Tambahan (Opsional)"
        name="keterangan"
        hint="Informasi atau rincian tambahan untuk pengurus RT/RW."
      >
        <textarea
          name="keterangan"
          id="keterangan"
          rows="3"
          placeholder="Rincian tambahan jika ada..."
          bind:value={keterangan}
        ></textarea>
      </FormField>

      <FormField
        label="Unggah Berkas / Dokumen Persyaratan (Opsional)"
        name="berkasSyarat"
        hint="Unggah foto KTP, Kartu Keluarga, atau pengantar pengurus RT (format JPG/PNG/PDF, maks 5MB)."
      >
        <input
          type="file"
          name="berkasSyarat"
          id="berkasSyarat"
          accept=".jpg,.jpeg,.png,.pdf"
        />
      </FormField>

      {#if form?.error}
        <p class="error-banner">{form.error}</p>
      {/if}

      <div class="actions">
        <a href="/portal#surat" class="btn btn-secondary">
          Batal
        </a>
        <Button variant="primary" type="submit" icon={Send}>
          Kirim Pengajuan Surat
        </Button>
      </div>
    </form>
  </Card>
</div>

<style>
  .ajukan-page {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    max-width: 40rem;
    margin: 0 auto;
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    text-decoration: none;
    margin-bottom: var(--space-2);
  }

  .back-link:hover {
    color: var(--color-text-primary);
  }

  .page-title {
    margin: 0;
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--color-text-primary);
    line-height: var(--leading-tight);
  }

  .page-subtitle {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .form-body {
    display: flex;
    flex-direction: column;
  }

  .error-banner {
    padding: var(--space-3);
    border-radius: var(--radius-md);
    background: oklch(0.95 0.05 25);
    color: oklch(0.4 0.15 25);
    border: 1px solid oklch(0.85 0.1 25);
    font-size: var(--text-sm);
    margin: 0 0 var(--space-4);
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--space-3);
    margin-top: var(--space-2);
  }
</style>
