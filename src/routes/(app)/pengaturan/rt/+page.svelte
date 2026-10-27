<script lang="ts">
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Plus from '@lucide/svelte/icons/plus';
  import type { PageData } from './$types';

  let { data, form } = $props<{
    data: PageData;
    form?: { error?: string; sukses?: string };
  }>();

  function labelRt(nomor: number) {
    return `RT ${String(nomor).padStart(2, '0')}`;
  }
</script>

<div class="page-container">
  <PageHeader
    title="Konfigurasi RT"
    subtitle="Daftar wilayah RT di bawah RW ini. Nomor RT dipakai di dropdown kependudukan dan seluruh laporan."
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

  {#if data.bisaUbah}
    <form method="POST" action="?/tambah" class="card tambah-card">
      <div class="field">
        <label for="nomor">Nomor RT baru <span class="required">*</span></label>
        <input
          id="nomor"
          name="nomor"
          class="input-base"
          type="number"
          min="1"
          max="99"
          placeholder="5"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">
        <Plus size={16} />
        <span>Tambah RT</span>
      </button>
    </form>
  {:else}
    <p class="banner banner-info">
      Anda hanya bisa melihat daftar RT. Perubahan hanya untuk admin RW.
    </p>
  {/if}

  <div class="card table-card">
    {#if data.daftarRt.length === 0}
      <p class="empty">Belum ada RT. Tambahkan RT pertama di atas.</p>
    {:else}
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Wilayah</th>
              <th class="num">KK</th>
              <th class="num">Pengurus</th>
              {#if data.bisaUbah}<th><span class="sr-only">Aksi</span></th>{/if}
            </tr>
          </thead>
          <tbody>
            {#each data.daftarRt as item (item.id)}
              <tr>
                <td class="font-bold">{labelRt(item.nomor)}</td>
                <td class="num">
                  <Badge variant={Number(item.jumlahKk) > 0 ? 'default' : 'warning'}>
                    {item.jumlahKk} KK
                  </Badge>
                </td>
                <td class="num">
                  <Badge variant={Number(item.jumlahPengurus) > 0 ? 'success' : 'default'}>
                    {item.jumlahPengurus} orang
                  </Badge>
                </td>
                {#if data.bisaUbah}
                  <td class="aksi">
                    <form method="POST" action="?/ubah" class="ubah-form">
                      <input type="hidden" name="id" value={item.id} />
                      <input
                        name="nomor"
                        class="input-base input-mini"
                        type="number"
                        min="1"
                        max="99"
                        value={item.nomor}
                        aria-label={`Nomor ${labelRt(item.nomor)}`}
                        required
                      />
                      <button type="submit" class="btn btn-secondary btn-sm">Simpan</button>
                    </form>

                    <form
                      method="POST"
                      action="?/hapus"
                      onsubmit={(e) => {
                        if (!confirm(`Hapus ${labelRt(item.nomor)}?`)) e.preventDefault();
                      }}
                    >
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" class="btn btn-ghost btn-sm btn-hapus">Hapus</button>
                    </form>
                  </td>
                {/if}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

<style>
  .page-container {
    max-width: 56rem;
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

  .banner-info {
    background: var(--color-surface-muted);
    color: var(--color-text-muted);
  }

  .tambah-card {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: var(--space-3);
    padding: var(--space-4);
    margin-bottom: var(--space-4);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    min-width: 10rem;
  }

  label {
    font-size: var(--text-sm);
    font-weight: 500;
  }

  .required {
    color: var(--color-danger);
  }

  .table-card {
    padding: var(--space-2);
  }

  .empty {
    padding: var(--space-8) 0;
    text-align: center;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    margin: 0;
  }

  .table-wrap {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-sm);
  }

  th,
  td {
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
    text-align: left;
  }

  th {
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--color-text-muted);
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  .num {
    text-align: right;
  }

  .font-bold {
    font-weight: 700;
  }

  .aksi {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .ubah-form {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .input-mini {
    width: 5rem;
    min-height: var(--tap-min);
  }

  .btn-sm {
    min-height: var(--tap-min);
    padding-inline: var(--space-3);
    font-size: var(--text-sm);
  }

  .btn-hapus {
    color: var(--color-danger);
  }

  .btn-hapus:hover {
    background: var(--color-danger-bg);
  }
</style>
