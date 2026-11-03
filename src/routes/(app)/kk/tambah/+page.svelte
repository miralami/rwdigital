<script lang="ts">
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Plus from '@lucide/svelte/icons/plus';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  import Users from '@lucide/svelte/icons/users';
  import type { PageData } from './$types';

  let { data, form } = $props<{
    data: PageData;
    form?: { error?: string };
  }>();

  interface Anggota {
    nik: string;
    nama: string;
    tempatLahir: string;
    tanggalLahir: string;
    jenisKelamin: 'L' | 'P';
    agama: string;
    pendidikan: string;
    pekerjaan: string;
    statusPerkawinan: 'belum_kawin' | 'kawin' | 'cerai_hidup' | 'cerai_mati';
    statusHubunganKk: 'kepala_keluarga' | 'istri' | 'anak' | 'lainnya';
  }

  let anggotaList = $state<Anggota[]>([
    {
      nik: '',
      nama: '',
      tempatLahir: '',
      tanggalLahir: '',
      jenisKelamin: 'L',
      agama: 'Islam',
      pendidikan: 'SMA',
      pekerjaan: '',
      statusPerkawinan: 'kawin',
      statusHubunganKk: 'kepala_keluarga'
    }
  ]);

  function tambahAnggota() {
    anggotaList.push({
      nik: '',
      nama: '',
      tempatLahir: '',
      tanggalLahir: '',
      jenisKelamin: 'P',
      agama: 'Islam',
      pendidikan: 'SMA',
      pekerjaan: '',
      statusPerkawinan: 'kawin',
      statusHubunganKk: anggotaList.length === 1 ? 'istri' : 'anak'
    });
  }

  function hapusAnggota(index: number) {
    if (anggotaList.length <= 1) return;
    anggotaList = anggotaList.filter((_, i) => i !== index);
  }

  const anggotaJsonStr = $derived(JSON.stringify(anggotaList));
</script>

<div class="page-container">
  <div class="header-nav">
    <a href="/kk" class="back-link">
      <ArrowLeft size={16} />
      <span>Kembali ke daftar KK</span>
    </a>
  </div>

  <div class="page-title-block">
    <h1>Tambah Kartu Keluarga Baru</h1>
    <p class="subtitle">Langkah 1: Masukkan identitas KK, kemudian masukkan seluruh daftar anggota keluarga di bawahnya.</p>
  </div>

  {#if form?.error}
    <div class="banner banner-error" role="alert">
      {form.error}
    </div>
  {/if}

  <form method="POST" class="form-container">
    <!-- Hidden input with full JSON array of members -->
    <input type="hidden" name="anggotaJson" value={anggotaJsonStr} />

    <!-- 1. DATA KARTU KELUARGA -->
    <div class="card section-card">
      <div class="section-header">
        <span class="step-badge">1</span>
        <div>
          <h2>Data Kartu Keluarga (KK)</h2>
          <p class="section-desc">Nomor KK dan alamat tempat tinggal keluarga ini.</p>
        </div>
      </div>

      <div class="form-grid">
        <div class="field">
          <label for="noKk">Nomor KK (16 digit) <span class="required">*</span></label>
          <input
            id="noKk"
            name="noKk"
            class="input-base mono"
            type="text"
            maxlength="16"
            placeholder="327501..."
            required
          />
        </div>

        <div class="field">
          <label for="rtId">Wilayah RT <span class="required">*</span></label>
          <select id="rtId" name="rtId" class="input-base" required>
            <option value="">Pilih RT</option>
            {#each data.semuaRt as rt}
              <option value={rt.id}>RT {String(rt.nomor).padStart(2, '0')}</option>
            {/each}
          </select>
        </div>

        <div class="field">
          <label for="statusHuni">Status Huni <span class="required">*</span></label>
          <select id="statusHuni" name="statusHuni" class="input-base">
            <option value="tetap">Warga Tetap</option>
            <option value="kontrak">Kontrak</option>
            <option value="kos">Kos</option>
          </select>
        </div>

        <div class="field field-full">
          <label for="alamat">Alamat Lengkap <span class="required">*</span></label>
          <input
            id="alamat"
            name="alamat"
            class="input-base"
            type="text"
            placeholder="Jl. Mawar No. 12 RT 01 RW 01"
            required
          />
        </div>
      </div>
    </div>

    <!-- 2. DAFTAR ANGGOTA KELUARGA -->
    <div class="card section-card">
      <div class="section-header-row">
        <div class="section-header">
          <span class="step-badge">2</span>
          <div>
            <h2>Daftar Anggota Keluarga ({anggotaList.length})</h2>
            <p class="section-desc">Urutan: Kepala Keluarga, Istri, Anak, atau Anggota lainnya.</p>
          </div>
        </div>

        <button type="button" class="btn btn-secondary" onclick={tambahAnggota}>
          <Plus size={16} />
          <span>Tambah Anggota</span>
        </button>
      </div>

      <div class="anggota-list">
        {#each anggotaList as a, idx}
          <div class="anggota-item">
            <div class="anggota-item-top">
              <span class="anggota-index">
                <Users size={16} />
                Anggota #{idx + 1} — {a.statusHubunganKk.replace('_', ' ').toUpperCase()}
              </span>
              {#if anggotaList.length > 1}
                <button type="button" class="btn-hapus-anggota" onclick={() => hapusAnggota(idx)} title="Hapus anggota ini">
                  <Trash2 size={16} />
                  <span>Hapus</span>
                </button>
              {/if}
            </div>

            <div class="form-grid">
              <div class="field">
                <label for="nik-{idx}">NIK (16 digit) <span class="required">*</span></label>
                <input
                  id="nik-{idx}"
                  bind:value={a.nik}
                  class="input-base mono"
                  type="text"
                  maxlength="16"
                  placeholder="3275..."
                  required
                />
              </div>

              <div class="field">
                <label for="nama-{idx}">Nama Lengkap <span class="required">*</span></label>
                <input
                  id="nama-{idx}"
                  bind:value={a.nama}
                  class="input-base"
                  type="text"
                  placeholder="Sesuai KTP"
                  required
                />
              </div>

              <div class="field">
                <label for="hubungan-{idx}">Status Hubungan KK <span class="required">*</span></label>
                <select id="hubungan-{idx}" bind:value={a.statusHubunganKk} class="input-base">
                  <option value="kepala_keluarga">Kepala Keluarga</option>
                  <option value="istri">Istri</option>
                  <option value="anak">Anak</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              <div class="field">
                <label for="jk-{idx}">Jenis Kelamin <span class="required">*</span></label>
                <select id="jk-{idx}" bind:value={a.jenisKelamin} class="input-base">
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div class="field">
                <label for="tmp-{idx}">Tempat Lahir <span class="required">*</span></label>
                <input id="tmp-{idx}" bind:value={a.tempatLahir} class="input-base" type="text" placeholder="Kota" required />
              </div>

              <div class="field">
                <label for="tgl-{idx}">Tanggal Lahir <span class="required">*</span></label>
                <input id="tgl-{idx}" bind:value={a.tanggalLahir} class="input-base" type="date" required />
              </div>

              <div class="field">
                <label for="agama-{idx}">Agama <span class="required">*</span></label>
                <select id="agama-{idx}" bind:value={a.agama} class="input-base">
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </div>

              <div class="field">
                <label for="kawin-{idx}">Status Perkawinan</label>
                <select id="kawin-{idx}" bind:value={a.statusPerkawinan} class="input-base">
                  <option value="belum_kawin">Belum Kawin</option>
                  <option value="kawin">Kawin</option>
                  <option value="cerai_hidup">Cerai Hidup</option>
                  <option value="cerai_mati">Cerai Mati</option>
                </select>
              </div>

              <div class="field">
                <label for="pendidikan-{idx}">Pendidikan</label>
                <select id="pendidikan-{idx}" bind:value={a.pendidikan} class="input-base">
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
                <label for="pekerjaan-{idx}">Pekerjaan</label>
                <input id="pekerjaan-{idx}" bind:value={a.pekerjaan} class="input-base" type="text" placeholder="Karyawan, Wiraswasta, dll." />
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Actions -->
    <div class="form-actions">
      <a href="/kk" class="btn btn-secondary">Batal</a>
      <button type="submit" class="btn btn-primary">Simpan Seluruh Data KK</button>
    </div>
  </form>
</div>

<style>
  .page-container {
    max-width: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .header-nav {
    margin-bottom: var(--space-2);
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

  .page-title-block h1 {
    font-size: var(--text-2xl);
    font-weight: 700;
    margin: 0 0 var(--space-1);
    color: var(--color-text);
  }

  .subtitle {
    margin: 0;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
  }

  .banner-error {
    padding: var(--space-3) var(--space-4);
    background: var(--color-danger-bg);
    color: var(--color-danger);
    border: 1px solid var(--color-danger);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
  }

  .form-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .section-card {
    padding: var(--space-5);
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
  }

  .section-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    flex-wrap: wrap;
    margin-bottom: var(--space-4);
  }

  .step-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: var(--radius-full);
    background: var(--color-brand-600);
    color: white;
    font-weight: 700;
    font-size: var(--text-sm);
    flex-shrink: 0;
  }

  .section-card h2 {
    font-size: var(--text-base);
    font-weight: 700;
    margin: 0;
    color: var(--color-text);
  }

  .section-desc {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: var(--space-3);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .field-full {
    grid-column: 1 / -1;
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

  .mono {
    font-family: var(--font-mono, monospace);
  }

  /* ─── Anggota List ─── */
  .anggota-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .anggota-item {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-4);
    background: var(--color-surface-muted);
  }

  .anggota-item-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-3);
    padding-bottom: var(--space-2);
    border-bottom: 1px dashed var(--color-border);
  }

  .anggota-index {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-weight: 700;
    font-size: var(--text-xs);
    color: var(--color-brand-700);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .btn-hapus-anggota {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    background: transparent;
    border: none;
    color: var(--color-danger);
    font-size: var(--text-xs);
    font-weight: 600;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
  }

  .btn-hapus-anggota:hover {
    background: var(--color-danger-bg);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
    padding: var(--space-4) 0;
  }
</style>
