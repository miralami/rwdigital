<script lang="ts">
  import type { PageData } from './$types';
  let { data } = $props<{ data: PageData }>();
</script>

<div class="page-container">
  <h1>Tambah warga baru</h1>
  <p class="subtitle">Lengkapi data Kartu Keluarga dan data warga utama (kepala keluarga).</p>

  <form method="POST" class="card form-card">
    <section class="form-section">
      <h2>Data Kartu Keluarga</h2>

      <div class="field">
        <label for="noKk">No. KK <span class="required">*</span></label>
        <input id="noKk" name="noKk" class="input-base" type="text" maxlength="16" placeholder="16 digit nomor KK" required />
      </div>

      <div class="field">
        <label for="rtId">RT <span class="required">*</span></label>
        <select id="rtId" name="rtId" class="input-base" required>
          <option value="">Pilih RT</option>
          {#each data.semuaRt as rt}
            <option value={rt.id}>RT {rt.nomor}</option>
          {/each}
        </select>
      </div>

      <div class="field">
        <label for="alamat">Alamat <span class="required">*</span></label>
        <input id="alamat" name="alamat" class="input-base" type="text" placeholder="Alamat sesuai KK" required />
      </div>

      <div class="field">
        <label for="statusHuni">Status Huni</label>
        <select id="statusHuni" name="statusHuni" class="input-base">
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
        <input id="nik" name="nik" class="input-base" type="text" maxlength="16" placeholder="16 digit NIK" required />
      </div>

      <div class="field">
        <label for="nama">Nama Lengkap <span class="required">*</span></label>
        <input id="nama" name="nama" class="input-base" type="text" placeholder="Nama sesuai KTP" required />
      </div>

      <div class="field-row">
        <div class="field">
          <label for="tempatLahir">Tempat Lahir <span class="required">*</span></label>
          <input id="tempatLahir" name="tempatLahir" class="input-base" type="text" required />
        </div>
        <div class="field">
          <label for="tanggalLahir">Tanggal Lahir <span class="required">*</span></label>
          <input id="tanggalLahir" name="tanggalLahir" class="input-base" type="date" required />
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label for="jenisKelamin">Jenis Kelamin <span class="required">*</span></label>
          <select id="jenisKelamin" name="jenisKelamin" class="input-base" required>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
        <div class="field">
          <label for="agama">Agama <span class="required">*</span></label>
          <select id="agama" name="agama" class="input-base" required>
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
          <select id="pendidikan" name="pendidikan" class="input-base">
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
          <input id="pekerjaan" name="pekerjaan" class="input-base" type="text" />
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label for="statusPerkawinan">Status Perkawinan</label>
          <select id="statusPerkawinan" name="statusPerkawinan" class="input-base">
            <option value="belum_kawin">Belum Kawin</option>
            <option value="kawin">Kawin</option>
            <option value="cerai_hidup">Cerai Hidup</option>
            <option value="cerai_mati">Cerai Mati</option>
          </select>
        </div>
        <div class="field">
          <label for="statusHubunganKk">Status Hubungan KK</label>
          <select id="statusHubunganKk" name="statusHubunganKk" class="input-base">
            <option value="kepala_keluarga">Kepala Keluarga</option>
            <option value="istri">Istri</option>
            <option value="anak">Anak</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>
      </div>
    </section>

    <div class="form-actions">
      <a href="/warga" class="btn btn-secondary">Batal</a>
      <button type="submit" class="btn btn-primary">Simpan</button>
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
    margin: 0 0 var(--space-1);
  }

  .subtitle {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    margin: 0 0 var(--space-6);
  }

  .form-card {
    padding: var(--space-5);
  }

  .form-section {
    margin-bottom: var(--space-6);
  }

  .form-section h2 {
    font-size: var(--text-base);
    font-weight: 600;
    margin: 0 0 var(--space-4);
    padding-bottom: var(--space-2);
    border-bottom: 1px solid var(--color-border);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    margin-bottom: var(--space-4);
    flex: 1 1 12rem;
    min-width: 0;
  }

  .field-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);
  }

  label {
    font-size: var(--text-sm);
    font-weight: 500;
  }

  .required {
    color: var(--color-danger);
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
