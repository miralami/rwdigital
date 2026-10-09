<script lang="ts">
  import type { PageData } from './$types';
  let { data } = $props<{ data: PageData }>();
  const w = $derived(data.data);
</script>

<div class="page-container">
  <h1>Edit warga</h1>

  <form method="POST" class="card form-card">
    <div class="field">
      <label for="nik">NIK <span class="required">*</span></label>
      <input id="nik" name="nik" class="input-base" type="text" maxlength="16" value={w.nik} required />
    </div>

    <div class="field">
      <label for="nama">Nama Lengkap <span class="required">*</span></label>
      <input id="nama" name="nama" class="input-base" type="text" value={w.nama} required />
    </div>

    <div class="field-row">
      <div class="field">
        <label for="tempatLahir">Tempat Lahir <span class="required">*</span></label>
        <input id="tempatLahir" name="tempatLahir" class="input-base" type="text" value={w.tempatLahir} required />
      </div>
      <div class="field">
        <label for="tanggalLahir">Tanggal Lahir <span class="required">*</span></label>
        <input id="tanggalLahir" name="tanggalLahir" class="input-base" type="date" value={w.tanggalLahir} required />
      </div>
    </div>

    <div class="field-row">
      <div class="field">
        <label for="jenisKelamin">Jenis Kelamin <span class="required">*</span></label>
        <select id="jenisKelamin" name="jenisKelamin" class="input-base" required>
          <option value="L" selected={w.jenisKelamin === 'L'}>Laki-laki</option>
          <option value="P" selected={w.jenisKelamin === 'P'}>Perempuan</option>
        </select>
      </div>
      <div class="field">
        <label for="agama">Agama <span class="required">*</span></label>
        <select id="agama" name="agama" class="input-base" required>
          <option value="Islam" selected={w.agama === 'Islam'}>Islam</option>
          <option value="Kristen" selected={w.agama === 'Kristen'}>Kristen</option>
          <option value="Katolik" selected={w.agama === 'Katolik'}>Katolik</option>
          <option value="Hindu" selected={w.agama === 'Hindu'}>Hindu</option>
          <option value="Buddha" selected={w.agama === 'Buddha'}>Buddha</option>
          <option value="Konghucu" selected={w.agama === 'Konghucu'}>Konghucu</option>
        </select>
      </div>
    </div>

    <div class="field-row">
      <div class="field">
        <label for="pendidikan">Pendidikan</label>
        <select id="pendidikan" name="pendidikan" class="input-base">
          <option value="">—</option>
          <option value="SD" selected={w.pendidikan === 'SD'}>SD</option>
          <option value="SMP" selected={w.pendidikan === 'SMP'}>SMP</option>
          <option value="SMA" selected={w.pendidikan === 'SMA'}>SMA</option>
          <option value="D3" selected={w.pendidikan === 'D3'}>D3</option>
          <option value="S1" selected={w.pendidikan === 'S1'}>S1</option>
          <option value="S2" selected={w.pendidikan === 'S2'}>S2</option>
          <option value="S3" selected={w.pendidikan === 'S3'}>S3</option>
        </select>
      </div>
      <div class="field">
        <label for="pekerjaan">Pekerjaan</label>
        <input id="pekerjaan" name="pekerjaan" class="input-base" type="text" value={w.pekerjaan ?? ''} />
      </div>
    </div>

    <div class="field-row">
      <div class="field">
        <label for="statusPerkawinan">Status Perkawinan</label>
        <select id="statusPerkawinan" name="statusPerkawinan" class="input-base">
          <option value="belum_kawin" selected={w.statusPerkawinan === 'belum_kawin'}>Belum Kawin</option>
          <option value="kawin" selected={w.statusPerkawinan === 'kawin'}>Kawin</option>
          <option value="cerai_hidup" selected={w.statusPerkawinan === 'cerai_hidup'}>Cerai Hidup</option>
          <option value="cerai_mati" selected={w.statusPerkawinan === 'cerai_mati'}>Cerai Mati</option>
        </select>
      </div>
      <div class="field">
        <label for="statusHubunganKk">Status Hubungan KK</label>
        <select id="statusHubunganKk" name="statusHubunganKk" class="input-base">
          <option value="kepala_keluarga" selected={w.statusHubunganKk === 'kepala_keluarga'}>Kepala Keluarga</option>
          <option value="istri" selected={w.statusHubunganKk === 'istri'}>Istri</option>
          <option value="anak" selected={w.statusHubunganKk === 'anak'}>Anak</option>
          <option value="lainnya" selected={w.statusHubunganKk === 'lainnya'}>Lainnya</option>
        </select>
      </div>
    </div>

    <div class="field">
      <label for="alasan">Alasan Perubahan Data <span class="required">*</span></label>
      <input
        id="alasan"
        name="alasan"
        class="input-base"
        type="text"
        placeholder="Contoh: Perbaikan ejaan nama / pembaruan status pekerjaan"
        required
      />
      <span class="field-hint">Wajib dicatat untuk jejak audit kependudukan (SF-KP-02).</span>
    </div>

    <div class="form-actions">
      <a href="/warga/{w.id}" class="btn btn-secondary">Batal</a>
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
