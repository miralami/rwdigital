<script lang="ts">
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Repeat from '@lucide/svelte/icons/repeat';
  import Image from '@lucide/svelte/icons/image';
  import type { ActionData } from './$types';

  let { form } = $props<{ form?: ActionData }>();

  let periodeUlang = $state<'sekali' | 'mingguan' | 'bulanan' | 'kustom'>('sekali');
</script>

<div class="page-container">
  <div class="header-nav">
    <a href="/pengumuman" class="back-link">
      <ArrowLeft size={16} />
      <span>Kembali ke daftar pengumuman</span>
    </a>
  </div>

  <h1>Buat Pengumuman Baru</h1>
  <p class="subtitle">Buat siaran informasi, agenda kegiatan, serta lampirkan foto dan atur perulangan berkala.</p>

  <form method="POST" enctype="multipart/form-data" class="card form-card">
    <div class="field">
      <label for="judul">Judul Pengumuman <span class="required">*</span></label>
      <input
        id="judul"
        name="judul"
        class="input-base"
        type="text"
        placeholder="Judul pengumuman"
        value={form?.values?.judul ?? ''}
        required
      />
      {#if form?.errors?.judul}
        <span class="field-error">{form.errors.judul[0]}</span>
      {/if}
    </div>

    <div class="field">
      <label for="kategori">Kategori</label>
      <select id="kategori" name="kategori" class="input-base">
        <option value="umum" selected={form?.values?.kategori === 'umum'}>Umum</option>
        <option value="kegiatan" selected={form?.values?.kategori === 'kegiatan'}>Kegiatan</option>
        <option value="keuangan" selected={form?.values?.kategori === 'keuangan'}>Keuangan</option>
        <option value="darurat" selected={form?.values?.kategori === 'darurat'}>Darurat (Prioritas Tinggi)</option>
      </select>
    </div>

    <div class="field">
      <label for="isi">Isi Pengumuman <span class="required">*</span></label>
      <textarea
        id="isi"
        name="isi"
        class="input-base"
        rows="6"
        placeholder="Tulis rincian informasi di sini..."
        required
      >{form?.values?.isi ?? ''}</textarea>
      {#if form?.errors?.isi}
        <span class="field-error">{form.errors.isi[0]}</span>
      {/if}
    </div>

    <!-- 1. Media & Galeri -->
    <div class="section-divider">
      <span class="section-title">
        <Image size={16} />
        Thumbnail &amp; Galeri Foto
      </span>
      <p class="section-desc">Unggah foto sampul dan foto lampiran dokumentasi kegiatan.</p>
    </div>

    <div class="field-row">
      <div class="field">
        <label for="thumbnail">Foto Sampul (Thumbnail Utama)</label>
        <input
          id="thumbnail"
          name="thumbnail"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="input-base"
        />
        <span class="hint">JPG, PNG, atau WEBP. Maks 10MB.</span>
      </div>

      <div class="field">
        <label for="lampiran">Foto Dokumentasi / Galeri (Bisa Banyak)</label>
        <input
          id="lampiran"
          name="lampiran"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          class="input-base"
        />
        <span class="hint">Pilih beberapa foto sekaligus untuk melampirkan galeri.</span>
      </div>
    </div>

    <!-- 2. Periodic Trigger (Perulangan Berkala) -->
    <div class="section-divider">
      <span class="section-title">
        <Repeat size={16} />
        Pemicu Berkala (Periodic Trigger)
      </span>
      <p class="section-desc">Atur apakah pengumuman ini diterbitkan berulang secara otomatis.</p>
    </div>

    <div class="field-row">
      <div class="field">
        <label for="periodeUlang">Interval Perulangan</label>
        <select id="periodeUlang" name="periodeUlang" bind:value={periodeUlang} class="input-base">
          <option value="sekali">Sekali Tayang (Tidak Berulang)</option>
          <option value="mingguan">Mingguan (Setiap 7 Hari)</option>
          <option value="bulanan">Bulanan (Setiap Bulan)</option>
          <option value="kustom">Kustom Interval Hari</option>
        </select>
      </div>

      {#if periodeUlang === 'kustom'}
        <div class="field">
          <label for="intervalHari">Ulangi Setiap Berapa Hari?</label>
          <input
            id="intervalHari"
            name="intervalHari"
            class="input-base"
            type="number"
            min="1"
            max="365"
            placeholder="Contoh: 14"
          />
          <span class="hint">Pengumuman akan otomatis diperbarui setiap X hari.</span>
        </div>
      {/if}
    </div>

    <!-- 3. Jadwal & Lokasi Event -->
    <div class="section-divider">
      <span class="section-title">Jadwal &amp; Lokasi Event (Opsional)</span>
      <p class="section-desc">Isi jika pengumuman ini merupakan kegiatan/agenda berbasis waktu.</p>
    </div>

    <div class="field-row">
      <div class="field">
        <label for="tanggalMulaiEvent">Tanggal Mulai Event</label>
        <input
          id="tanggalMulaiEvent"
          name="tanggalMulaiEvent"
          class="input-base"
          type="date"
          value={form?.values?.tanggalMulaiEvent ?? ''}
        />
        {#if form?.errors?.tanggalMulaiEvent}
          <span class="field-error">{form.errors.tanggalMulaiEvent[0]}</span>
        {/if}
      </div>

      <div class="field">
        <label for="tanggalSelesaiEvent">Tanggal Selesai Event</label>
        <input
          id="tanggalSelesaiEvent"
          name="tanggalSelesaiEvent"
          class="input-base"
          type="date"
          value={form?.values?.tanggalSelesaiEvent ?? ''}
        />
        {#if form?.errors?.tanggalSelesaiEvent}
          <span class="field-error">{form.errors.tanggalSelesaiEvent[0]}</span>
        {/if}
      </div>
    </div>

    <div class="field">
      <label for="lokasi">Lokasi Event</label>
      <input
        id="lokasi"
        name="lokasi"
        class="input-base"
        type="text"
        placeholder="Contoh: Balai Pertemuan RW 05 / Lapangan Serbaguna"
        value={form?.values?.lokasi ?? ''}
      />
      {#if form?.errors?.lokasi}
        <span class="field-error">{form.errors.lokasi[0]}</span>
      {/if}
    </div>

    <!-- 4. Penayangan -->
    <div class="section-divider">
      <span class="section-title">Jadwal Penayangan (Opsional)</span>
      <p class="section-desc">Atur rentang tanggal pengumuman ini aktif ditampilkan ke warga.</p>
    </div>

    <div class="field-row">
      <div class="field">
        <label for="tanggalMulai">Tanggal Mulai Tayang</label>
        <input
          id="tanggalMulai"
          name="tanggalMulai"
          class="input-base"
          type="date"
          value={form?.values?.tanggalMulai ?? ''}
        />
      </div>
      <div class="field">
        <label for="tanggalSelesai">Tanggal Berakhir Tayang</label>
        <input
          id="tanggalSelesai"
          name="tanggalSelesai"
          class="input-base"
          type="date"
          value={form?.values?.tanggalSelesai ?? ''}
        />
      </div>
    </div>

    <div class="field checkbox-field">
      <label>
        <input
          type="checkbox"
          name="ditampilkan"
          checked={form?.values?.ditampilkan ?? true}
        />
        <span>Langsung tampilkan di portal warga &amp; kirimkan notifikasi siaran</span>
      </label>
    </div>

    <div class="form-actions">
      <a href="/pengumuman" class="btn btn-secondary">Batal</a>
      <button type="submit" class="btn btn-primary">Terbitkan Pengumuman</button>
    </div>
  </form>
</div>

<style>
  .page-container {
    max-width: 48rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .header-nav {
    margin-bottom: var(--space-1);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    text-decoration: none;
  }

  .back-link:hover {
    color: var(--color-brand-600);
  }

  h1 {
    font-size: var(--text-2xl);
    font-weight: 700;
    margin: 0;
  }

  .subtitle {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .form-card {
    padding: var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .field-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: var(--space-4);
  }

  label {
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .required {
    color: var(--color-danger);
  }

  .hint {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .field-error {
    font-size: var(--text-xs);
    color: var(--color-danger);
  }

  .section-divider {
    border-top: 1px dashed var(--color-border);
    padding-top: var(--space-4);
    margin-top: var(--space-2);
  }

  .section-title {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    font-weight: 700;
    color: var(--color-text);
  }

  .section-desc {
    margin: 0.25rem 0 var(--space-2);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .checkbox-field label {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    cursor: pointer;
    font-size: var(--text-sm);
    text-transform: none;
    letter-spacing: normal;
    color: var(--color-text);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
    margin-top: var(--space-4);
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
  }
</style>
