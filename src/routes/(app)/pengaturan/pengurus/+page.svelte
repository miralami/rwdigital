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

  function wilayah(nomorRt: number | null) {
    return nomorRt === null ? 'RW' : `RT ${String(nomorRt).padStart(2, '0')}`;
  }

  function inisial(nama: string) {
    return nama
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((bagian) => bagian[0]?.toUpperCase() ?? '')
      .join('');
  }
</script>

<div class="page-container">
  <PageHeader
    title="Kepengurusan & Foto"
    subtitle="Susun bagan pengurus RW dan tiap RT. Foto dipakai di landing page publik."
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

  {#if data.bisaTambah}
    <form
      method="POST"
      action="?/tambah"
      enctype="multipart/form-data"
      class="card form-card"
    >
      <h2>Tambah pengurus</h2>

      <div class="form-grid">
        <div class="field">
          <label for="wilayah-baru">Wilayah</label>
          <select id="wilayah-baru" name="rtId" class="input-base">
            <option value="">Pengurus RW</option>
            {#each data.daftarRt as item}
              <option value={item.id}>RT {String(item.nomor).padStart(2, '0')}</option>
            {/each}
          </select>
        </div>

        <div class="field">
          <label for="jabatan-baru">Jabatan <span class="required">*</span></label>
          <input
            id="jabatan-baru"
            name="jabatan"
            class="input-base"
            type="text"
            placeholder="Ketua"
            maxlength="60"
            required
          />
        </div>

        <div class="field">
          <label for="nama-baru">Nama <span class="required">*</span></label>
          <input
            id="nama-baru"
            name="nama"
            class="input-base"
            type="text"
            placeholder="Nama lengkap"
            maxlength="100"
            required
          />
        </div>

        <div class="field">
          <label for="urutan-baru">Urutan tampil</label>
          <input
            id="urutan-baru"
            name="urutan"
            class="input-base"
            type="number"
            min="0"
            max="999"
            value="0"
          />
        </div>

        <div class="field field-lebar">
          <label for="foto-baru">Foto (opsional)</label>
          <input
            id="foto-baru"
            name="foto"
            class="input-base"
            type="file"
            accept="image/jpeg,image/png,image/webp"
          />
          <span class="hint">JPG, PNG, atau WEBP. Maksimal {data.batasFotoMb}MB.</span>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">
          <Plus size={16} />
          <span>Tambah pengurus</span>
        </button>
      </div>
    </form>
  {/if}

  <div class="card table-card">
    {#if data.daftarPengurus.length === 0}
      <p class="empty">Belum ada data pengurus.</p>
    {:else}
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Jabatan</th>
              <th>Nama</th>
              <th>Wilayah</th>
              <th class="num">Urutan</th>
              <th><span class="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody>
            {#each data.daftarPengurus as item (item.id)}
              <tr>
                <td>
                  {#if item.fotoUrl}
                    <img class="foto" src={item.fotoUrl} alt={item.nama} loading="lazy" />
                  {:else}
                    <span class="foto foto-kosong" aria-hidden="true">{inisial(item.nama)}</span>
                  {/if}
                </td>
                <td class="font-bold">{item.jabatan}</td>
                <td>{item.nama}</td>
                <td>
                  <Badge variant={item.nomorRt === null ? 'brand' : 'default'}>
                    {wilayah(item.nomorRt)}
                  </Badge>
                </td>
                <td class="num">{item.urutan}</td>
                <td class="aksi">
                  {#if data.bisaUbah}
                    <details class="ubah">
                      <summary class="btn btn-secondary btn-sm">Ubah</summary>
                      <form
                        method="POST"
                        action="?/ubah"
                        enctype="multipart/form-data"
                        class="ubah-form"
                      >
                        <input type="hidden" name="id" value={item.id} />

                        <div class="field">
                          <label for={`rt-${item.id}`}>Wilayah</label>
                          <select id={`rt-${item.id}`} name="rtId" class="input-base">
                            <option value="" selected={item.rtId === null}>Pengurus RW</option>
                            {#each data.daftarRt as rtItem}
                              <option value={rtItem.id} selected={item.rtId === rtItem.id}>
                                RT {String(rtItem.nomor).padStart(2, '0')}
                              </option>
                            {/each}
                          </select>
                        </div>

                        <div class="field">
                          <label for={`jabatan-${item.id}`}>Jabatan</label>
                          <input
                            id={`jabatan-${item.id}`}
                            name="jabatan"
                            class="input-base"
                            type="text"
                            value={item.jabatan}
                            maxlength="60"
                            required
                          />
                        </div>

                        <div class="field">
                          <label for={`nama-${item.id}`}>Nama</label>
                          <input
                            id={`nama-${item.id}`}
                            name="nama"
                            class="input-base"
                            type="text"
                            value={item.nama}
                            maxlength="100"
                            required
                          />
                        </div>

                        <div class="field">
                          <label for={`urutan-${item.id}`}>Urutan</label>
                          <input
                            id={`urutan-${item.id}`}
                            name="urutan"
                            class="input-base"
                            type="number"
                            min="0"
                            max="999"
                            value={item.urutan}
                          />
                        </div>

                        <div class="field">
                          <label for={`foto-${item.id}`}>Ganti foto</label>
                          <input
                            id={`foto-${item.id}`}
                            name="foto"
                            class="input-base"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                          />
                        </div>

                        <button type="submit" class="btn btn-primary btn-sm">Simpan</button>
                      </form>
                    </details>
                  {/if}

                  {#if data.bisaHapus}
                    <form
                      method="POST"
                      action="?/hapus"
                      onsubmit={(e) => {
                        if (!confirm(`Hapus ${item.nama} dari bagan pengurus?`)) e.preventDefault();
                      }}
                    >
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" class="btn btn-ghost btn-sm btn-hapus">Hapus</button>
                    </form>
                  {/if}
                </td>
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
    max-width: 60rem;
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

  .form-card {
    padding: var(--space-5);
    margin-bottom: var(--space-4);
  }

  h2 {
    margin: 0 0 var(--space-4);
    font-size: var(--text-base);
    font-weight: 600;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    gap: var(--space-3);
  }

  .field-lebar {
    grid-column: 1 / -1;
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

  .form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--space-4);
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
    vertical-align: middle;
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

  .foto {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--radius-full);
    object-fit: cover;
    background: var(--color-brand-50);
    color: var(--color-accent);
    font-size: var(--text-xs);
    font-weight: 700;
  }

  .foto-kosong {
    border: 1px dashed var(--color-border);
  }

  .aksi {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .ubah {
    position: relative;
  }

  .ubah > summary {
    list-style: none;
    cursor: pointer;
  }

  .ubah > summary::-webkit-details-marker {
    display: none;
  }

  .ubah[open] > summary {
    margin-bottom: var(--space-3);
  }

  .ubah-form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: var(--space-2);
    align-items: end;
    padding: var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface-muted);
    min-width: min(34rem, 70vw);
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
