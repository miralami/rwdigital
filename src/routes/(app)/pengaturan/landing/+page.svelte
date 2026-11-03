<script lang="ts">
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import ImagePlus from '@lucide/svelte/icons/image-plus';
  import Save from '@lucide/svelte/icons/save';
  import type { PageData } from './$types';

  let { data, form } = $props<{
    data: PageData;
    form?: { error?: string; sukses?: string };
  }>();

  const p = $derived(data.pengaturan);

  const latarSekarang = $derived(
    p?.heroBackground?.startsWith('#')
      ? p.heroBackground
      : p?.heroBackground
        ? 'Gambar unggahan'
        : 'Warna bawaan'
  );
</script>

<div class="page-container">
  <PageHeader
    title="Landing & Galeri"
    subtitle="Atur tampilan halaman publik: latar hero, sambutan, profil RW, dan galeri foto."
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
    <form method="POST" action="?/simpan" enctype="multipart/form-data" class="card form-card">
      <h2>Identitas & tampilan</h2>

      <div class="form-grid">
        <div class="field">
          <label for="heroJudul">Judul hero</label>
          <input
            id="heroJudul"
            name="heroJudul"
            class="input-base"
            type="text"
            maxlength="120"
            value={p?.heroJudul ?? ''}
            placeholder="RW 06 Kota Baru"
          />
        </div>

        <div class="field">
          <label for="namaKetua">Nama ketua RW</label>
          <input
            id="namaKetua"
            name="namaKetua"
            class="input-base"
            type="text"
            maxlength="100"
            value={p?.namaKetua ?? ''}
          />
        </div>

        <div class="field field-lebar">
          <label for="heroSubjudul">Subjudul hero</label>
          <input
            id="heroSubjudul"
            name="heroSubjudul"
            class="input-base"
            type="text"
            maxlength="400"
            value={p?.heroSubjudul ?? ''}
          />
        </div>

        <div class="field">
          <label for="heroBackground">Latar hero (warna hex)</label>
          <input
            id="heroBackground"
            name="heroBackground"
            class="input-base"
            type="text"
            maxlength="300"
            value={p?.heroBackground?.startsWith('#') ? p.heroBackground : ''}
            placeholder="#0b1f3a"
          />
          <span class="hint">Saat ini: {latarSekarang}. Kosongkan untuk warna bawaan.</span>
        </div>

        <div class="field">
          <label for="heroFile">Atau unggah gambar latar</label>
          <input
            id="heroFile"
            name="heroFile"
            class="input-base"
            type="file"
            accept="image/jpeg,image/png,image/webp"
          />
          <span class="hint">JPG, PNG, atau WEBP. Maksimal {data.batasFotoMb}MB.</span>
        </div>

        <div class="field">
          <label for="fotoKetua">Foto ketua RW</label>
          <input
            id="fotoKetua"
            name="fotoKetua"
            class="input-base"
            type="file"
            accept="image/jpeg,image/png,image/webp"
          />
          <span class="hint">Dipakai di blok sambutan dan bagan pengurus.</span>
        </div>

        <div class="field">
          <label for="sambutan">Teks sambutan</label>
          <input
            id="sambutan"
            name="sambutan"
            class="input-base"
            type="text"
            maxlength="1200"
            value={p?.sambutan ?? ''}
          />
        </div>

        <div class="field field-lebar">
          <label for="visi">Visi</label>
          <textarea id="visi" name="visi" class="input-base" rows="3" maxlength="1200"
            >{p?.visi ?? ''}</textarea
          >
        </div>

        <div class="field field-lebar">
          <label for="misi">Misi (satu poin per baris)</label>
          <textarea id="misi" name="misi" class="input-base" rows="5" maxlength="2000"
            >{p?.misi ?? ''}</textarea
          >
        </div>

        <div class="field field-lebar">
          <label for="sejarah">Sejarah singkat</label>
          <textarea id="sejarah" name="sejarah" class="input-base" rows="4" maxlength="3000"
            >{p?.sejarah ?? ''}</textarea
          >
        </div>

        <div class="field field-lebar">
          <label for="alamat">Alamat</label>
          <input
            id="alamat"
            name="alamat"
            class="input-base"
            type="text"
            maxlength="300"
            value={p?.alamat ?? ''}
          />
        </div>

        <div class="field">
          <label for="telepon">Telepon</label>
          <input
            id="telepon"
            name="telepon"
            class="input-base"
            type="text"
            maxlength="40"
            value={p?.telepon ?? ''}
          />
        </div>

        <div class="field">
          <label for="email">Email</label>
          <input
            id="email"
            name="email"
            class="input-base"
            type="email"
            maxlength="120"
            value={p?.email ?? ''}
          />
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">
          <Save size={16} />
          <span>Simpan pengaturan</span>
        </button>
      </div>
    </form>

    {#if p?.heroBackground && !p.heroBackground.startsWith('#')}
      <form
        method="POST"
        action="?/hapusLatar"
        class="card hapus-latar"
        onsubmit={(e) => {
          if (!confirm('Hapus gambar latar dan kembali ke warna bawaan?')) e.preventDefault();
        }}
      >
        <span>Gambar latar sedang dipakai.</span>
        <button type="submit" class="btn btn-ghost btn-sm btn-hapus">Hapus gambar latar</button>
      </form>
    {/if}
  {:else}
    <p class="banner" role="status">Hanya admin RW yang bisa mengubah pengaturan landing.</p>
  {/if}

  <h2 class="section-title">Galeri</h2>

  {#if data.bisaTambah}
    <form method="POST" action="?/tambahGaleri" enctype="multipart/form-data" class="card form-card">
      <h2>Tambah foto</h2>

      <div class="form-grid">
        <div class="field">
          <label for="judul">Judul <span class="required">*</span></label>
          <input id="judul" name="judul" class="input-base" type="text" maxlength="120" required />
        </div>

        <div class="field">
          <label for="urutan">Urutan tampil</label>
          <input id="urutan" name="urutan" class="input-base" type="number" min="0" max="999" value="0" />
        </div>

        <div class="field field-lebar">
          <label for="keterangan">Keterangan</label>
          <input id="keterangan" name="keterangan" class="input-base" type="text" maxlength="300" />
        </div>

        <div class="field field-lebar">
          <label for="foto">Foto <span class="required">*</span></label>
          <input
            id="foto"
            name="foto"
            class="input-base"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
          />
          <span class="hint">JPG, PNG, atau WEBP. Maksimal {data.batasFotoMb}MB.</span>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">
          <ImagePlus size={16} />
          <span>Tambah ke galeri</span>
        </button>
      </div>
    </form>
  {/if}

  <div class="card table-card">
    {#if data.daftarGaleri.length === 0}
      <p class="empty">Belum ada foto galeri.</p>
    {:else}
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Judul</th>
              <th class="num">Urutan</th>
              <th>Status</th>
              <th><span class="sr-only">Aksi</span></th>
            </tr>
          </thead>
          <tbody>
            {#each data.daftarGaleri as item (item.id)}
              <tr>
                <td>
                  <img class="foto" src={item.fotoUrl} alt={item.judul} loading="lazy" />
                </td>
                <td>
                  <span class="font-bold">{item.judul}</span>
                  {#if item.keterangan}
                    <span class="sub">{item.keterangan}</span>
                  {/if}
                </td>
                <td class="num">{item.urutan}</td>
                <td>
                  <Badge variant={item.aktif ? 'success' : 'default'}>
                    {item.aktif ? 'Tampil' : 'Disembunyikan'}
                  </Badge>
                </td>
                <td class="aksi">
                  {#if data.bisaUbah}
                    <details class="ubah">
                      <summary class="btn btn-secondary btn-sm">Ubah</summary>
                      <form
                        method="POST"
                        action="?/ubahGaleri"
                        enctype="multipart/form-data"
                        class="ubah-form"
                      >
                        <input type="hidden" name="id" value={item.id} />

                        <div class="field">
                          <label for={`judul-${item.id}`}>Judul</label>
                          <input
                            id={`judul-${item.id}`}
                            name="judul"
                            class="input-base"
                            type="text"
                            value={item.judul}
                            maxlength="120"
                            required
                          />
                        </div>

                        <div class="field">
                          <label for={`keterangan-${item.id}`}>Keterangan</label>
                          <input
                            id={`keterangan-${item.id}`}
                            name="keterangan"
                            class="input-base"
                            type="text"
                            value={item.keterangan ?? ''}
                            maxlength="300"
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

                    <form method="POST" action="?/toggleGaleri">
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" class="btn btn-secondary btn-sm">
                        {item.aktif ? 'Sembunyikan' : 'Tampilkan'}
                      </button>
                    </form>
                  {/if}

                  {#if data.bisaHapus}
                    <form
                      method="POST"
                      action="?/hapusGaleri"
                      onsubmit={(e) => {
                        if (!confirm(`Hapus foto "${item.judul}"?`)) e.preventDefault();
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

  .section-title {
    margin-top: var(--space-6);
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

  .hapus-latar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    margin-bottom: var(--space-4);
    font-size: var(--text-sm);
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

  .sub {
    display: block;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .foto {
    display: block;
    width: 4rem;
    height: 3rem;
    border-radius: var(--radius-sm);
    object-fit: cover;
    background: var(--color-brand-50);
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
