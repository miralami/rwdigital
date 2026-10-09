<script lang="ts">
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Upload from '@lucide/svelte/icons/upload';
  import FileSpreadsheet from '@lucide/svelte/icons/file-spreadsheet';
  import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
  import AlertCircle from '@lucide/svelte/icons/alert-circle';
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';
  import type { ActionData } from './$types';

  let { form } = $props<{ form: ActionData }>();

  const csvTemplate = `nik,nama,no_kk,rt,tempat_lahir,tanggal_lahir,jenis_kelamin,agama,status_kawin,hubungan_kk,alamat,status_huni
3275010101900001,Contoh Warga Satu,3275010101900000,1,Bekasi,1990-01-01,L,Islam,kawin,kepala_keluarga,Jl. Melati No. 1,tetap
3275010101900002,Contoh Warga Dua,3275010101900000,1,Bekasi,1992-05-15,P,Islam,kawin,istri,Jl. Melati No. 1,tetap`;

  function unduhTemplate() {
    const blob = new Blob([csvTemplate], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_impor_warga.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
</script>

<div class="impor-page">
  <div class="header">
    <a href="/warga" class="back-link">
      <ArrowLeft size={16} />
      <span>Kembali ke data warga</span>
    </a>
    <h1 class="page-title">Impor Data Warga Massal (CSV)</h1>
    <p class="page-subtitle">
      Unggah berkas CSV untuk menambahkan data warga dan Kartu Keluarga (KK) secara massal ke dalam sistem.
    </p>
  </div>

  <Card>
    <div class="template-box">
      <div class="template-info">
        <FileSpreadsheet size={20} class="text-brand" />
        <div>
          <p class="template-title">Gunakan Format Template Standar</p>
          <p class="template-desc">Pastikan kolom NIK dan No. KK berisi tepat 16 digit angka.</p>
        </div>
      </div>
      <button type="button" class="btn btn-secondary btn-sm" onclick={unduhTemplate}>
        Unduh Template CSV
      </button>
    </div>

    <form method="POST" enctype="multipart/form-data" class="upload-form">
      <div class="file-dropzone">
        <Upload size={32} class="drop-icon" />
        <p class="drop-title">Pilih berkas CSV dari komputer</p>
        <p class="drop-desc">Hanya format .csv dengan pemisah koma (,)</p>
        <input type="file" name="file" accept=".csv" required class="file-input" />
      </div>

      {#if form?.error}
        <p class="error-msg">{form.error}</p>
      {/if}

      <div class="form-actions">
        <a href="/warga" class="btn btn-secondary">Batal</a>
        <Button variant="primary" type="submit" icon={Upload}>
          Mulai Proses Impor
        </Button>
      </div>
    </form>
  </Card>

  {#if form?.sukses}
    <Card>
      <div class="result-header">
        <CheckCircle2 size={24} class="text-success" />
        <div>
          <h2 class="result-title">Hasil Impor Data</h2>
          <p class="result-summary">
            Total diproses: {form.totalBaris} baris |
            <strong class="text-success">{form.berhasilCount} Berhasil</strong> |
            <strong class="text-danger">{form.gagalCount} Gagal</strong>
          </p>
        </div>
      </div>

      {#if form.errors && form.errors.length > 0}
        <div class="error-table-wrap">
          <p class="error-table-title">Daftar Baris yang Dilewati / Tidak Valid:</p>
          <table class="error-table">
            <thead>
              <tr>
                <th class="label-caps">Baris</th>
                <th class="label-caps">Penyebab Kegagalan</th>
              </tr>
            </thead>
            <tbody>
              {#each form.errors as err}
                <tr>
                  <td class="font-mono">Baris {err.baris}</td>
                  <td class="text-danger">{err.pesan}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </Card>
  {/if}
</div>

<style>
  .impor-page {
    max-width: 44rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
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

  .page-title {
    margin: 0;
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--color-text-primary);
  }

  .page-subtitle {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .template-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface-muted);
    border-radius: var(--radius-md);
    margin-bottom: var(--space-5);
    flex-wrap: wrap;
  }

  .template-info {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .template-title {
    margin: 0;
    font-weight: 600;
    font-size: var(--text-sm);
    color: var(--color-text-primary);
  }

  .template-desc {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
  }

  .upload-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .file-dropzone {
    border: 2px dashed var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-8) var(--space-4);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--color-surface);
  }

  .drop-title {
    margin: var(--space-2) 0 0;
    font-weight: 600;
    font-size: var(--text-sm);
    color: var(--color-text-primary);
  }

  .drop-desc {
    margin: var(--space-1) 0 var(--space-3);
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
  }

  .file-input {
    font-size: var(--text-sm);
    max-width: 18rem;
  }

  .error-msg {
    margin: 0;
    padding: var(--space-3);
    background: oklch(0.95 0.05 25);
    color: oklch(0.4 0.15 25);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
  }

  .result-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
  }

  .result-title {
    margin: 0;
    font-size: var(--text-lg);
    font-weight: 600;
  }

  .result-summary {
    margin: var(--space-1) 0 0;
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .text-success {
    color: var(--color-success);
  }

  .text-danger {
    color: var(--color-danger);
  }

  .error-table-wrap {
    margin-top: var(--space-4);
  }

  .error-table-title {
    font-weight: 600;
    font-size: var(--text-sm);
    margin: 0 0 var(--space-2);
  }

  .error-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-sm);
  }

  .error-table th {
    text-align: left;
    padding: var(--space-2) var(--space-3);
    background: var(--color-surface-muted);
    border-bottom: 1px solid var(--color-border);
  }

  .error-table td {
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
  }
</style>
