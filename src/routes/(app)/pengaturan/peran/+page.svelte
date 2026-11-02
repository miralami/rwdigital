<script lang="ts">
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Plus from '@lucide/svelte/icons/plus';
  import ShieldCheck from '@lucide/svelte/icons/shield-check';
  import Lock from '@lucide/svelte/icons/lock';
  import type { Izin } from '$lib/akses';
  import type { PageData } from './$types';

  let { data, form } = $props<{
    data: PageData;
    form?: { error?: string; sukses?: string };
  }>();

  type Peran = PageData['daftarPeran'][number];
  type Tipe = Peran['tipe'];
  type Scope = Peran['scope'];

  const LABEL_TIPE: Record<Tipe, string> = {
    staff: 'Staf (dashboard)',
    warga: 'Warga (portal)'
  };

  const LABEL_SCOPE: Record<Scope, string> = {
    all: 'Seluruh RW',
    rt: 'RT tugas',
    none: 'Tanpa data staf'
  };

  function labelTipe(tipe: string): string {
    return LABEL_TIPE[tipe as Tipe] ?? tipe;
  }

  function labelScope(scope: string): string {
    return LABEL_SCOPE[scope as Scope] ?? scope;
  }
</script>

{#snippet matriks(nilai: Izin, bisaUbah: boolean)}
  <div class="matriks">
    {#each data.modul as modul (modul.key)}
      <div class="matriks-baris">
        <div class="matriks-info">
          <span class="matriks-label">{modul.label}</span>
          <span class="matriks-desc">{modul.deskripsi}</span>
        </div>
        <div class="matriks-aksi">
          {#each modul.aksi as aksi (aksi)}
            <label class="chip" class:nonaktif={!bisaUbah}>
              <input
                type="checkbox"
                name={`izin_${modul.key}`}
                value={aksi}
                checked={Boolean(nilai[modul.key]?.includes(aksi))}
                disabled={!bisaUbah}
              />
              <span>{data.labelAksi[aksi] ?? aksi}</span>
            </label>
          {/each}
        </div>
      </div>
    {/each}
  </div>
{/snippet}

<div class="page-container">
  <PageHeader
    title="Peran & Izin"
    subtitle="Buat peran baru dan atur modul/aksi yang boleh dipakainya. Perubahan berlaku pada permintaan berikutnya."
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

  <p class="banner banner-info">
    <ShieldCheck size={16} />
    <span>
      Izin menentukan menu yang muncul dan aksi yang boleh dijalankan. Halaman yang modulnya tidak
      dicentang akan ditolak dengan kode 403, bukan hanya disembunyikan.
    </span>
  </p>

  {#if data.akses.create}
    <form method="POST" action="?/tambah" class="card form-card">
      <h2>Buat peran baru</h2>

      <div class="form-grid">
        <div class="field">
          <label for="nama">Slug <span class="required">*</span></label>
          <input
            id="nama"
            name="nama"
            class="input-base"
            type="text"
            maxlength="40"
            pattern="[a-z0-9][a-z0-9_-]*"
            placeholder="ketua_lingkungan"
            autocomplete="off"
            required
          />
          <span class="hint">Huruf kecil, angka, garis bawah, atau strip. Tidak bisa diubah lagi.</span>
        </div>

        <div class="field">
          <label for="label">Nama tampilan <span class="required">*</span></label>
          <input
            id="label"
            name="label"
            class="input-base"
            type="text"
            maxlength="60"
            placeholder="Ketua Lingkungan"
            required
          />
        </div>

        <div class="field">
          <label for="tipe">Tipe <span class="required">*</span></label>
          <select id="tipe" name="tipe" class="input-base" required>
            <option value="staff">Staf (dashboard)</option>
            <option value="warga">Warga (portal)</option>
          </select>
          <span class="hint">Staf masuk dashboard, warga masuk portal.</span>
        </div>

        <div class="field">
          <label for="scope">Batas data <span class="required">*</span></label>
          <select id="scope" name="scope" class="input-base" required>
            <option value="all">Seluruh RW</option>
            <option value="rt">RT tugas saja</option>
            <option value="none">Tanpa data staf</option>
          </select>
        </div>

        <div class="field field-lebar">
          <label for="deskripsi">Deskripsi</label>
          <input
            id="deskripsi"
            name="deskripsi"
            class="input-base"
            type="text"
            maxlength="300"
            placeholder="Dipakai untuk apa peran ini?"
          />
        </div>
      </div>

      <h3 class="matriks-judul">Izin modul</h3>
      {@render matriks({}, true)}

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">
          <Plus size={16} />
          <span>Buat peran</span>
        </button>
      </div>
    </form>
  {/if}

  {#if data.daftarPeran.length === 0}
    <div class="card empty-card">
      <p class="empty">Belum ada peran. Jalankan seed atau buat peran pertama di atas.</p>
    </div>
  {:else}
    <div class="peran-list">
      {#each data.daftarPeran as peran (peran.id)}
        <article class="card peran-card">
          <header class="peran-head">
            <div class="peran-identitas">
              <div class="peran-judul">
                <h3>{peran.label}</h3>
                <code>{peran.nama}</code>
                {#if peran.superadmin}
                  <Badge variant="brand">Superadmin</Badge>
                {/if}
                {#if peran.sistem && !peran.superadmin}
                  <Badge variant="info">Bawaan sistem</Badge>
                {/if}
              </div>
              {#if peran.deskripsi}
                <p class="peran-deskripsi">{peran.deskripsi}</p>
              {/if}
              <div class="peran-meta">
                <Badge variant={peran.tipe === 'staff' ? 'brand' : 'default'}>{labelTipe(peran.tipe)}</Badge>
                <Badge variant="default">{labelScope(peran.scope)}</Badge>
                <span class="muted">{peran.jumlahPengguna} akun memakai peran ini</span>
              </div>
            </div>

            {#if data.akses.delete && !peran.sistem && !peran.superadmin}
              <form
                method="POST"
                action="?/hapus"
                onsubmit={(e) => {
                  if (!confirm(`Hapus peran ${peran.label}?`)) e.preventDefault();
                }}
              >
                <input type="hidden" name="id" value={peran.id} />
                <button
                  type="submit"
                  class="btn btn-ghost btn-sm btn-hapus"
                  disabled={peran.jumlahPengguna > 0}
                  title={peran.jumlahPengguna > 0
                    ? 'Pindahkan akun pemakai peran ini lebih dulu'
                    : 'Hapus peran'}
                >
                  Hapus
                </button>
              </form>
            {/if}
          </header>

          {#if peran.superadmin}
            <p class="terkunci">
              <Lock size={16} />
              <span>
                Peran superadmin selalu punya akses penuh ke semua modul dan tidak bisa diubah atau
                dihapus.
              </span>
            </p>
          {:else if data.akses.update}
            <form method="POST" action="?/ubah" class="peran-form">
              <input type="hidden" name="id" value={peran.id} />

              <div class="form-grid">
                <div class="field">
                  <label for={`label-${peran.id}`}>Nama tampilan</label>
                  <input
                    id={`label-${peran.id}`}
                    name="label"
                    class="input-base"
                    type="text"
                    maxlength="60"
                    value={peran.label}
                    required
                  />
                </div>

                <div class="field">
                  <label for={`tipe-${peran.id}`}>Tipe</label>
                  <select id={`tipe-${peran.id}`} name="tipe" class="input-base">
                    {#each Object.entries(LABEL_TIPE) as [nilai, teks]}
                      <option value={nilai} selected={peran.tipe === nilai}>{teks}</option>
                    {/each}
                  </select>
                </div>

                <div class="field">
                  <label for={`scope-${peran.id}`}>Batas data</label>
                  <select id={`scope-${peran.id}`} name="scope" class="input-base">
                    {#each Object.entries(LABEL_SCOPE) as [nilai, teks]}
                      <option value={nilai} selected={peran.scope === nilai}>{teks}</option>
                    {/each}
                  </select>
                </div>

                <div class="field field-lebar">
                  <label for={`deskripsi-${peran.id}`}>Deskripsi</label>
                  <input
                    id={`deskripsi-${peran.id}`}
                    name="deskripsi"
                    class="input-base"
                    type="text"
                    maxlength="300"
                    value={peran.deskripsi ?? ''}
                  />
                </div>
              </div>

              <h3 class="matriks-judul">Izin modul</h3>
              {@render matriks(peran.permissions, true)}

              <div class="form-actions">
                <button type="submit" class="btn btn-primary btn-sm">Simpan perubahan</button>
              </div>
            </form>
          {:else}
            <p class="terkunci">
              <Lock size={16} />
              <span>Anda hanya bisa melihat izin peran ini.</span>
            </p>
            {@render matriks(peran.permissions, false)}
          {/if}
        </article>
      {/each}
    </div>
  {/if}
</div>

<style>
  .page-container {
    max-width: 64rem;
  }

  .banner {
    display: flex;
    gap: var(--space-2);
    align-items: flex-start;
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
    grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
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

  .matriks-judul {
    margin: var(--space-5) 0 var(--space-2);
    font-size: var(--text-sm);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--color-text-muted);
  }

  .matriks {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .matriks-baris {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2) var(--space-4);
    justify-content: space-between;
    align-items: center;
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
  }

  .matriks-baris:last-child {
    border-bottom: none;
  }

  .matriks-info {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 12rem;
    flex: 1;
  }

  .matriks-label {
    font-size: var(--text-sm);
    font-weight: 600;
  }

  .matriks-desc {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    line-height: var(--leading-snug);
  }

  .matriks-aksi {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    padding: 0.25rem 0.6rem;
    font-size: var(--text-xs);
    font-weight: 500;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    background: var(--color-surface);
    cursor: pointer;
  }

  .chip:has(input:checked) {
    border-color: var(--color-brand-300);
    background: var(--color-brand-50);
    color: var(--color-accent);
  }

  .chip.nonaktif {
    cursor: default;
    opacity: 0.7;
  }

  .peran-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .peran-card {
    padding: var(--space-5);
  }

  .peran-head {
    display: flex;
    gap: var(--space-3);
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: var(--space-4);
  }

  .peran-identitas {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    min-width: 0;
  }

  .peran-judul {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2);
  }

  .peran-judul h3 {
    margin: 0;
    font-size: var(--text-base);
    font-weight: 600;
  }

  .peran-judul code {
    font-family: var(--font-mono, ui-monospace, SFMono-Regular, monospace);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    background: var(--color-surface-muted);
    padding: 0.125rem 0.4rem;
    border-radius: var(--radius-sm);
  }

  .peran-deskripsi {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    line-height: var(--leading-snug);
  }

  .peran-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2);
  }

  .muted {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .terkunci {
    display: flex;
    gap: var(--space-2);
    align-items: center;
    margin: 0;
    padding: var(--space-3);
    border-radius: var(--radius-md);
    background: var(--color-surface-muted);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
  }

  .form-actions .btn-sm {
    min-height: var(--tap-min);
    padding-inline: var(--space-3);
  }

  .btn-sm {
    min-height: var(--tap-min);
    padding-inline: var(--space-3);
    font-size: var(--text-sm);
  }

  .btn-hapus {
    color: var(--color-danger);
  }

  .btn-hapus:hover:not(:disabled) {
    background: var(--color-danger-bg);
  }

  .empty-card {
    padding: var(--space-5);
  }

  .empty {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    margin: 0;
  }

  @media (max-width: 40rem) {
    .matriks-baris {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>
