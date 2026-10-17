<script lang="ts">
  import { enhance } from '$app/forms';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import ClipboardEdit from '@lucide/svelte/icons/clipboard-edit';
  import Info from '@lucide/svelte/icons/info';
  import Clock from '@lucide/svelte/icons/clock';
  import CircleCheckBig from '@lucide/svelte/icons/circle-check-big';
  import XCircle from '@lucide/svelte/icons/x-circle';
  import Badge from '$lib/components/Badge.svelte';
  import Card from '$lib/components/Card.svelte';
  import FormField from '$lib/components/FormField.svelte';
  import Button from '$lib/components/Button.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import { formatTanggal } from '$lib/format';
  import type { PageData, ActionData } from './$types';

  let { data, form } = $props<{ data: PageData; form: ActionData }>();

  let submitting = $state(false);

  const w = $derived(data.warga);

  const statusBadge: Record<string, { variant: 'default' | 'warning' | 'brand' | 'success' | 'danger'; label: string }> = {
    diajukan:    { variant: 'warning', label: 'Diajukan' },
    diverifikasi:{ variant: 'brand',   label: 'Diverifikasi' },
    disetujui:  { variant: 'success', label: 'Disetujui' },
    ditolak:    { variant: 'danger',  label: 'Ditolak' }
  };
</script>

<svelte:head>
  <title>Ajukan Pembaruan Data – Portal Warga</title>
</svelte:head>

<div class="perbaruan-page">
  <div class="header">
    <a href="/portal" class="back-link">
      <ArrowLeft size={16} />
      <span>Kembali ke portal</span>
    </a>
  </div>

  <div class="page-title">
    <ClipboardEdit size={22} class="title-icon" />
    <div>
      <h1 class="title">Ajukan Pembaruan Data</h1>
      <p class="subtitle">
        Perubahan akan ditinjau oleh pengurus RW sebelum diterapkan.
      </p>
    </div>
  </div>

  {#if !data.terhubung}
    <div class="info-banner">
      <Info size={16} />
      <span>Akun Anda belum terhubung ke data warga. Hubungi Admin RW untuk penautan akun.</span>
    </div>
  {:else if w}
    <!-- Peringatan jika masih ada permintaan aktif (#5 review) -->
    {#if data.adaPermintaanAktif && !form?.success}
      <div class="warn-banner">
        <Clock size={16} />
        <span>Anda masih memiliki permintaan yang sedang diproses. Formulir dinonaktifkan sementara.</span>
      </div>
    {/if}
    <!-- Form pengajuan pembaruan -->
    <Card title="Data yang Ingin Diperbarui">
      {#if form?.success}
        <div class="success-notice" role="status">
          <CircleCheckBig size={18} />
          <span>Permintaan pembaruan berhasil diajukan. Pengurus akan segera meninjau permohonan Anda.</span>
        </div>
      {/if}

      {#if form?.error}
        <div class="error-notice" role="alert">
          <XCircle size={18} />
          <span>{form.error}</span>
        </div>
      {/if}

      <form
        method="POST"
        action="?/ajukan"
        use:enhance={() => {
          submitting = true;
          return async ({ update }) => {
            await update();
            submitting = false;
          };
        }}
      >
        <p class="form-hint">
          Isi hanya kolom yang ingin Anda ubah. Kolom yang dikosongkan tidak akan diproses.
        </p>

        <div class="form-grid">
          <FormField label="Nama Lengkap" name="nama" type="text" placeholder={w.nama} />
          <FormField label="Tempat Lahir" name="tempatLahir" type="text" placeholder={w.tempatLahir} />
          <FormField label="Tanggal Lahir" name="tanggalLahir" type="date" placeholder={w.tanggalLahir} />

          <div class="field-group">
            <label class="field-label" for="jenisKelamin">Jenis Kelamin</label>
            <select id="jenisKelamin" name="jenisKelamin" class="field-select">
              <option value="">-- Tidak diubah --</option>
              <option value="L" selected={w.jenisKelamin === 'L'}>Laki-laki</option>
              <option value="P" selected={w.jenisKelamin === 'P'}>Perempuan</option>
            </select>
          </div>

          <div class="field-group">
            <label class="field-label" for="agama">Agama</label>
            <select id="agama" name="agama" class="field-select">
              <option value="">-- Tidak diubah --</option>
              {#each ['Islam','Kristen','Katolik','Hindu','Buddha','Konghucu','Lainnya'] as agama}
                <option value={agama} selected={w.agama === agama}>{agama}</option>
              {/each}
            </select>
          </div>

          <FormField label="Pekerjaan" name="pekerjaan" type="text" placeholder={w.pekerjaan ?? 'Tidak diubah'} />
          <FormField label="Pendidikan Terakhir" name="pendidikan" type="text" placeholder={w.pendidikan ?? 'Tidak diubah'} />

          <div class="field-group">
            <label class="field-label" for="statusPerkawinan">Status Perkawinan</label>
            <select id="statusPerkawinan" name="statusPerkawinan" class="field-select">
              <option value="">-- Tidak diubah --</option>
              <option value="belum_kawin" selected={w.statusPerkawinan === 'belum_kawin'}>Belum Kawin</option>
              <option value="kawin" selected={w.statusPerkawinan === 'kawin'}>Kawin</option>
              <option value="cerai_hidup" selected={w.statusPerkawinan === 'cerai_hidup'}>Cerai Hidup</option>
              <option value="cerai_mati" selected={w.statusPerkawinan === 'cerai_mati'}>Cerai Mati</option>
            </select>
          </div>
        </div>

        <div class="field-group catatan-field">
          <label class="field-label" for="catatan">Alasan / Keterangan Perubahan</label>
          <textarea
            id="catatan"
            name="catatan"
            class="field-textarea"
            rows="3"
            placeholder="Contoh: Perubahan pekerjaan setelah pensiun dari kantor lama."
          ></textarea>
        </div>

        <div class="form-actions">
          <Button type="submit" variant="primary" disabled={submitting || data.adaPermintaanAktif}>
            {submitting ? 'Mengirim…' : 'Ajukan Perubahan'}
          </Button>
          <Button href="/portal" variant="secondary">Batal</Button>
        </div>
      </form>
    </Card>

    <!-- Riwayat permintaan -->
    <Card title="Riwayat Permintaan Saya" padded={false}>
      {#if data.riwayatPermintaan.length > 0}
        <div class="riwayat-list">
          {#each data.riwayatPermintaan as req (req.id)}
            {@const badge = statusBadge[req.status] ?? { variant: 'default', label: req.status }}
            <div class="riwayat-row">
              <div class="riwayat-icon">
                {#if req.status === 'disetujui'}
                  <CircleCheckBig size={16} class="icon-success" />
                {:else if req.status === 'ditolak'}
                  <XCircle size={16} class="icon-danger" />
                {:else}
                  <Clock size={16} class="icon-pending" />
                {/if}
              </div>
              <div class="riwayat-info">
                <div class="riwayat-meta-row">
                  <span class="riwayat-tanggal">{formatTanggal(req.createdAt)}</span>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>
                {#if req.catatan}
                  <p class="riwayat-catatan">Alasan: {req.catatan}</p>
                {/if}
                {#if req.catatanPengurus}
                  <p class="riwayat-pengurus">Catatan pengurus: {req.catatanPengurus}</p>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <EmptyState
          compact
          icon={ClipboardEdit}
          message="Belum ada permintaan pembaruan"
          description="Permintaan perubahan data yang Anda ajukan akan tercatat di sini."
        />
      {/if}
    </Card>
  {/if}
</div>

<style>
  .perbaruan-page {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding-bottom: var(--space-8);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    text-decoration: none;
  }

  .page-title {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .page-title :global(svg) {
    color: var(--color-brand-600);
    flex-shrink: 0;
    margin-top: 0.15rem;
  }

  .title {
    margin: 0;
    font-size: var(--text-xl);
    font-weight: 800;
    color: var(--color-text);
    letter-spacing: var(--tracking-tight);
  }

  .subtitle {
    margin: var(--space-1) 0 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .info-banner {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2);
    padding: var(--space-3);
    border: 1px dashed var(--color-warning);
    border-radius: var(--radius-md);
    background-color: var(--color-surface);
    font-size: var(--text-sm);
    color: var(--color-text);
  }
  .info-banner :global(svg) {
    flex-shrink: 0;
    margin-top: 0.125rem;
    color: var(--color-warning);
  }

  .warn-banner {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2);
    padding: var(--space-3);
    border: 1px solid var(--color-warning);
    border-radius: var(--radius-md);
    background: color-mix(in srgb, var(--color-warning) 10%, transparent);
    font-size: var(--text-sm);
    color: var(--color-text);
  }
  .warn-banner :global(svg) {
    flex-shrink: 0;
    margin-top: 0.125rem;
    color: var(--color-warning);
  }

  .success-notice,
  .error-notice {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    margin-bottom: var(--space-4);
    font-size: var(--text-sm);
  }

  .success-notice {
    background: color-mix(in srgb, var(--color-success) 10%, transparent);
    border: 1px solid var(--color-success);
    color: var(--color-text);
  }
  .success-notice :global(svg) { color: var(--color-success); flex-shrink: 0; }

  .error-notice {
    background: color-mix(in srgb, var(--color-danger) 10%, transparent);
    border: 1px solid var(--color-danger);
    color: var(--color-text);
  }
  .error-notice :global(svg) { color: var(--color-danger); flex-shrink: 0; }

  /* ─── Form ─── */
  .form-hint {
    margin: 0 0 var(--space-4);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    line-height: var(--leading-snug);
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: var(--space-4);
    margin-bottom: var(--space-4);
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .field-label {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text);
  }

  .field-select,
  .field-textarea {
    font-family: inherit;
    font-size: var(--text-sm);
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text);
    outline: none;
    transition: border-color 0.15s;
  }

  .field-select:focus,
  .field-textarea:focus {
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-brand-600) 20%, transparent);
  }

  .field-textarea {
    resize: vertical;
    min-height: 5rem;
  }

  .catatan-field {
    margin-bottom: var(--space-4);
  }

  .form-actions {
    display: flex;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  /* ─── Riwayat ─── */
  .riwayat-list {
    display: flex;
    flex-direction: column;
  }

  .riwayat-row {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--color-border);
  }

  .riwayat-row:last-child { border-bottom: none; }

  .riwayat-icon {
    margin-top: 0.1rem;
    flex-shrink: 0;
  }

  :global(.icon-success) { color: var(--color-success); }
  :global(.icon-danger)  { color: var(--color-danger); }
  :global(.icon-pending) { color: var(--color-warning); }

  .riwayat-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .riwayat-meta-row {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .riwayat-tanggal {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text);
  }

  .riwayat-catatan {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .riwayat-pengurus {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--color-warning);
    font-style: italic;
  }
</style>
