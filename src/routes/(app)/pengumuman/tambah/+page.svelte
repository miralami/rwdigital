<div class="page-container">
  <h1>Buat pengumuman</h1>

  <form method="POST" class="card form-card">
    <div class="field">
      <label for="judul">Judul <span class="required">*</span></label>
      <input id="judul" name="judul" class="input-base" type="text" placeholder="Judul pengumuman" required />
    </div>

    <div class="field">
      <label for="kategori">Kategori</label>
      <select id="kategori" name="kategori" class="input-base">
        <option value="umum">Umum</option>
        <option value="kegiatan">Kegiatan</option>
        <option value="keuangan">Keuangan</option>
        <option value="darurat">Darurat</option>
      </select>
    </div>

    <div class="field">
      <label for="isi">Isi pengumuman <span class="required">*</span></label>
      <textarea id="isi" name="isi" class="input-base" rows="6" placeholder="Tulis isi pengumuman di sini..." required></textarea>
    </div>

    <div class="field-checkbox">
      <label class="checkbox-label">
        <input type="checkbox" name="ditampilkan" checked />
        <span>Tampilkan pengumuman ini</span>
      </label>
    </div>

    <div class="form-actions">
      <a href="/pengumuman" class="btn btn-secondary">Batal</a>
      <button type="submit" class="btn btn-primary">Terbitkan</button>
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
