<script lang="ts">
  import type { PageData, ActionData } from './$types';
  let { data, form } = $props<{ data: PageData; form?: ActionData }>();
  const p = $derived(data.data);
  const selectedKategori = $derived(form?.values?.kategori ?? p.kategori);
</script>

<div class="page-container">
  <h1>Edit pengumuman</h1>

  <form method="POST" class="card form-card">
    <div class="field">
      <label for="judul">Judul <span class="required">*</span></label>
      <input
        id="judul"
        name="judul"
        class="input-base"
        type="text"
        value={form?.values?.judul ?? p.judul}
        required
      />
      {#if form?.errors?.judul}
        <span class="field-error">{form.errors.judul[0]}</span>
      {/if}
    </div>

    <div class="field">
      <label for="kategori">Kategori</label>
      <select id="kategori" name="kategori" class="input-base">
        <option value="umum" selected={selectedKategori === 'umum'}>Umum</option>
        <option value="kegiatan" selected={selectedKategori === 'kegiatan'}>Kegiatan</option>
        <option value="keuangan" selected={selectedKategori === 'keuangan'}>Keuangan</option>
        <option value="darurat" selected={selectedKategori === 'darurat'}>Darurat</option>
      </select>
    </div>

    <div class="field">
      <label for="isi">Isi pengumuman <span class="required">*</span></label>
      <textarea
        id="isi"
        name="isi"
        class="input-base"
        rows="6"
        required
      >{form?.values?.isi ?? p.isi}</textarea>
      {#if form?.errors?.isi}
        <span class="field-error">{form.errors.isi[0]}</span>
      {/if}
    </div>

    <div class="section-divider">
      <span class="section-title">Jadwal & Lokasi Event (Opsional)</span>
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
          value={form?.values?.tanggalMulaiEvent ?? p.tanggalMulaiEvent ?? ''}
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
          value={form?.values?.tanggalSelesaiEvent ?? p.tanggalSelesaiEvent ?? ''}
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
        value={form?.values?.lokasi ?? p.lokasi ?? ''}
      />
      {#if form?.errors?.lokasi}
        <span class="field-error">{form.errors.lokasi[0]}</span>
      {/if}
    </div>

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
          value={form?.values?.tanggalMulai ?? p.tanggalMulai ?? ''}
        />
      </div>
      <div class="field">
        <label for="tanggalSelesai">Tanggal Berakhir Tayang</label>
        <input
          id="tanggalSelesai"
          name="tanggalSelesai"
          class="input-base"
          type="date"
          value={form?.values?.tanggalSelesai ?? p.tanggalSelesai ?? ''}
        />
      </div>
    </div>

    <div class="field-checkbox">
      <label class="checkbox-label">
        <input
          type="checkbox"
          name="ditampilkan"
          checked={form ? form.values?.ditampilkan : p.ditampilkan}
        />
        <span>Tampilkan pengumuman ini</span>
      </label>
    </div>

    <div class="form-actions">
      <a href="/pengumuman" class="btn btn-secondary">Batal</a>
      <button type="submit" class="btn btn-primary">Simpan perubahan</button>
    </div>
  </form>
</div>

<style>
  .page-container {
    max-width: 40rem;
  }

  h1 {
    font-size: var(--text-2xl);
    font-weight: 700;
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--color-text);
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

  textarea {
    resize: vertical;
    min-height: 8rem;
  }

  .field-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);
  }

  .field-row .field {
    flex: 1 1 12rem;
    min-width: 0;
  }

  .section-divider {
    margin: var(--space-4) 0 var(--space-3);
    padding-top: var(--space-4);
    border-top: 1px dashed var(--color-border);
  }

  .section-title {
    display: block;
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text);
  }

  .section-desc {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    margin: var(--space-1) 0 0;
  }

  .field-error {
    font-size: var(--text-xs);
    color: var(--color-danger);
    margin-top: 0.125rem;
  }

  .field-checkbox {
    margin-bottom: var(--space-4);
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    min-height: var(--tap-min);
    font-size: var(--text-sm);
    cursor: pointer;
  }

  .checkbox-label input[type="checkbox"] {
    width: 1.125rem;
    height: 1.125rem;
    accent-color: var(--color-accent);
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
