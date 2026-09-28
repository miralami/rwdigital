<script lang="ts">
  import type { PageData } from './$types';
  let { data } = $props<{ data: PageData }>();
</script>

<div class="page-container">
  <h1>Tambah Warga Baru</h1>
  <p class="subtitle">Lengkapi data Kartu Keluarga dan data warga utama (kepala keluarga).</p>

  <form method="POST" class="form-card">
    <section class="form-section">
      <h2>Data Kartu Keluarga</h2>

      <div class="field">
        <label for="noKk">No. KK <span class="required">*</span></label>
        <input id="noKk" name="noKk" type="text" maxlength="16" placeholder="16 digit nomor KK" required />
      </div>

      <div class="field">
        <label for="rtId">RT <span class="required">*</span></label>
        <select id="rtId" name="rtId" required>
          <option value="">Pilih RT</option>
          {#each data.semuaRt as rt}
            <option value={rt.id}>RT {rt.nomor}</option>
          {/each}
        </select>
      </div>

      <div class="field">
        <label for="alamat">Alamat <span class="required">*</span></label>
        <input id="alamat" name="alamat" type="text" placeholder="Alamat sesuai KK" required />
      </div>

      <div class="field">
        <label for="statusHuni">Status Huni</label>
        <select id="statusHuni" name="statusHuni">
          <option value="tetap">Tetap</option>
          <option value="kontrak">Kontrak</option>
          <option value="kos">Kos</option>
        </select>
      </div>
    </section>

    <section class="form-section">
      <h2>Data Warga (Kepala Keluarga)</h2>

      <div class="field">
        <label for="nik">NIK <span class="required">*</span></label>
        <input id="nik" name="nik" type="text" maxlength="16" placeholder="16 digit NIK" required />
      </div>

      <div class="field">
        <label for="nama">Nama Lengkap <span class="required">*</span></label>
        <input id="nama" name="nama" type="text" placeholder="Nama sesuai KTP" required />
      </div>

      <div class="field-row">
        <div class="field">
          <label for="tempatLahir">Tempat Lahir <span class="required">*</span></label>
          <input id="tempatLahir" name="tempatLahir" type="text" required />
        </div>
        <div class="field">
          <label for="tanggalLahir">Tanggal Lahir <span class="required">*</span></label>
          <input id="tanggalLahir" name="tanggalLahir" type="date" required />
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label for="jenisKelamin">Jenis Kelamin <span class="required">*</span></label>
          <select id="jenisKelamin" name="jenisKelamin" required>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
        <div class="field">
          <label for="agama">Agama <span class="required">*</span></label>
          <select id="agama" name="agama" required>
            <option value="Islam">Islam</option>
            <option value="Kristen">Kristen</option>
            <option value="Katolik">Katolik</option>
            <option value="Hindu">Hindu</option>
            <option value="Buddha">Buddha</option>
            <option value="Konghucu">Konghucu</option>
          </select>
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label for="pendidikan">Pendidikan</label>
          <select id="pendidikan" name="pendidikan">
            <option value="">—</option>
            <option value="SD">SD</option>
            <option value="SMP">SMP</option>
            <option value="SMA">SMA</option>
            <option value="D3">D3</option>
            <option value="S1">S1</option>
            <option value="S2">S2</option>
            <option value="S3">S3</option>
          </select>
        </div>
        <div class="field">
          <label for="pekerjaan">Pekerjaan</label>
          <input id="pekerjaan" name="pekerjaan" type="text" />
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label for="statusPerkawinan">Status Perkawinan</label>
          <select id="statusPerkawinan" name="statusPerkawinan">
            <option value="belum_kawin">Belum Kawin</option>
            <option value="kawin">Kawin</option>
            <option value="cerai_hidup">Cerai Hidup</option>
            <option value="cerai_mati">Cerai Mati</option>
          </select>
        </div>
        <div class="field">
          <label for="statusHubunganKk">Status Hubungan KK</label>
          <select id="statusHubunganKk" name="statusHubunganKk">
            <option value="kepala_keluarga">Kepala Keluarga</option>
            <option value="istri">Istri</option>
            <option value="anak">Anak</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>
      </div>
    </section>

    <div class="form-actions">
      <a href="/warga" class="btn-secondary">Batal</a>
      <button type="submit" class="btn-primary">Simpan</button>
    </div>
  </form>
</div>

<style>

  .page-container {
    max-width: 40rem;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.25rem;
  }

  .subtitle {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    margin: 0 0 1.5rem;
  }

  .form-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    box-shadow: var(--shadow-card);
  }

  .form-section {
    margin-bottom: 1.5rem;
  }

  .form-section h2 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-border);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    margin-bottom: 1rem;
    flex: 1;
  }

  .field-row {
    display: flex;
    gap: 1rem;
  }

  label {
    font-size: 0.875rem;
    font-weight: 500;
  }

  .required {
    color: var(--color-danger);
  }

  input, select {
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-family: var(--font-sans);
    background: var(--color-surface);
    color: var(--color-text-primary);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    width: 100%;
    box-sizing: border-box;
  }

  input:focus, select:focus {
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px oklch(from var(--color-brand-500) l c h / 0.15);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
  }

  .btn-primary, .btn-secondary {
    padding: 0.625rem 1.25rem;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.15s;
  }

  .btn-primary {
    background: var(--color-brand-600);
    color: var(--color-text-inverse);
    border: none;
  }

  .btn-primary:hover {
    background: var(--color-brand-700);
  }

  .btn-secondary {
    background: var(--color-surface);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border-strong);
  }

  .btn-secondary:hover {
    background: var(--color-surface-raised);
  }
</style>
