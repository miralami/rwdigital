<script lang="ts">
  import type { PageData } from './$types';
  import Badge from '$lib/components/Badge.svelte';
  import Button from '$lib/components/Button.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Pencil from '@lucide/svelte/icons/pencil';
  import UserX from '@lucide/svelte/icons/user-x';
  import UserCheck from '@lucide/svelte/icons/user-check';
  import KeyRound from '@lucide/svelte/icons/key-round';
  import { formatTanggal } from '$lib/format';
  let { data } = $props<{ data: PageData }>();
  const d = $derived(data.detail);

  let showModalNonaktif = $state(false);
  let showModalBuatAkun = $state(false);
</script>

<div class="detail-page">
  <div class="detail-header">
    <a href="/warga" class="back-link">
      <ArrowLeft size={16} />
      <span>Kembali ke data warga</span>
    </a>
    <div class="header-actions">
      <a href="/warga/{d.id}/edit" class="btn btn-secondary">
        <Pencil size={15} />
        <span>Edit</span>
      </a>

      {#if !data.userAccount}
        <button
          type="button"
          class="btn btn-secondary"
          onclick={() => (showModalBuatAkun = true)}
        >
          <KeyRound size={15} />
          <span>Buat Akun Portal</span>
        </button>
      {/if}

      {#if d.aktif}
        <button
          type="button"
          class="btn btn-danger"
          onclick={() => (showModalNonaktif = true)}
        >
          <UserX size={15} />
          <span>Nonaktifkan</span>
        </button>
      {:else}
        <form method="POST" action="?/aktifkan">
          <button type="submit" class="btn btn-secondary">
            <UserCheck size={15} />
            <span>Aktifkan Kembali</span>
          </button>
        </form>
      {/if}
    </div>
  </div>

  {#if !d.aktif}
    <div class="alert-nonaktif">
      <strong>Data Nonaktif:</strong> Dinonaktifkan pada {d.tanggalNonaktif ?? '—'}.
      Alasan: {d.alasanNonaktif ?? 'Tidak ada keterangan'}.
    </div>
  {/if}

  <div class="card info-card">
    <div class="info-header">
      <div>
        <h1>{d.nama}</h1>
        <p class="nik">NIK: {d.nik}</p>
      </div>
      <div class="badges">
        {#if d.aktif}
          <Badge variant="success">Aktif</Badge>
        {:else}
          <Badge variant="default">Nonaktif</Badge>
        {/if}

        {#if data.userAccount}
          <Badge variant="brand">Akun: {data.userAccount.email}</Badge>
        {:else}
          <Badge variant="warning">Belum Punya Akun</Badge>
        {/if}
      </div>
    </div>

    <dl class="info-grid">
      <div class="info-item">
        <dt class="label-caps">No. KK</dt>
        <dd>{d.noKk}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">RT</dt>
        <dd>RT {d.nomorRt}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Alamat KK</dt>
        <dd>{d.alamatKk}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Status Huni</dt>
        <dd>{d.statusHuni}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Tempat, Tanggal Lahir</dt>
        <dd>{d.tempatLahir}, {d.tanggalLahir}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Jenis Kelamin</dt>
        <dd>{d.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Agama</dt>
        <dd>{d.agama}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Pendidikan</dt>
        <dd>{d.pendidikan ?? '—'}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Pekerjaan</dt>
        <dd>{d.pekerjaan ?? '—'}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Status Perkawinan</dt>
        <dd>{d.statusPerkawinan.replace('_', ' ')}</dd>
      </div>
      <div class="info-item">
        <dt class="label-caps">Status Hubungan KK</dt>
        <dd>{d.statusHubunganKk.replace('_', ' ')}</dd>
      </div>
    </dl>
  </div>

  <section class="anggota-section">
    <h2>Anggota keluarga ({data.anggotaKk.length})</h2>
    <div class="card table-wrap">
      <table class="anggota-table">
        <thead>
          <tr>
            <th class="label-caps">Nama</th>
            <th class="label-caps">NIK</th>
            <th class="label-caps">Status Hubungan</th>
          </tr>
        </thead>
        <tbody>
          {#each data.anggotaKk as anggota}
            <tr>
              <td>{anggota.nama}</td>
              <td>{anggota.nik}</td>
              <td>{anggota.statusHubunganKk.replace('_', ' ')}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <!-- Riwayat Perubahan Data (SF-KP-02 & SF-KP-05) -->
  <section class="riwayat-section">
    <h2>Riwayat Perubahan Data ({data.riwayat.length})</h2>
    {#if data.riwayat.length > 0}
      <div class="card table-wrap">
        <table class="anggota-table">
          <thead>
            <tr>
              <th class="label-caps">Waktu</th>
              <th class="label-caps">Pengubah</th>
              <th class="label-caps">Alasan Perubahan</th>
              <th class="label-caps">Ringkasan</th>
            </tr>
          </thead>
          <tbody>
            {#each data.riwayat as r}
              <tr>
                <td>{formatTanggal(r.tanggal)}</td>
                <td>{r.diubahOleh}</td>
                <td class="font-medium">{r.alasan}</td>
                <td class="text-muted">{r.ringkasan ?? '—'}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <div class="card empty-card">
        <p class="text-muted">Belum ada riwayat perubahan data pada warga ini.</p>
      </div>
    {/if}
  </section>

  <!-- Modal Nonaktifkan Warga -->
  <Modal
    open={showModalNonaktif}
    title="Nonaktifkan Data Warga"
    onClose={() => (showModalNonaktif = false)}
  >
    <form method="POST" action="?/nonaktifkan" class="form-modal">
      <p class="modal-desc">
        Data warga akan dinonaktifkan tanpa dihapus permanen dari basis data.
      </p>

      <div class="form-group">
        <label for="tanggal" class="label-caps">Tanggal Nonaktif</label>
        <input
          id="tanggal"
          name="tanggal"
          type="date"
          required
          value={new Date().toISOString().slice(0, 10)}
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="alasan" class="label-caps">Alasan Nonaktif</label>
        <select id="alasan" name="alasan" required class="form-input">
          <option value="Pindah Domisili">Pindah Domisili</option>
          <option value="Meninggal Dunia">Meninggal Dunia</option>
          <option value="Pindah KK">Pindah KK</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </div>

      <div class="modal-actions">
        <button
          type="button"
          class="btn btn-secondary"
          onclick={() => (showModalNonaktif = false)}
        >
          Batal
        </button>
        <button type="submit" class="btn btn-danger">
          Konfirmasi Nonaktifkan
        </button>
      </div>
    </form>
  </Modal>

  <!-- Modal Buat Akun Warga -->
  <Modal
    open={showModalBuatAkun}
    title="Buat Akun Portal Warga"
    onClose={() => (showModalBuatAkun = false)}
  >
    <form method="POST" action="?/buatAkun" class="form-modal">
      <p class="modal-desc">
        Buat akun autentikasi untuk warga ini agar dapat mengakses portal warga secara mandiri.
      </p>

      <div class="form-group">
        <label for="email" class="label-caps">Email Akun (Opsional)</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder={`${d.nik}@warga.rw`}
          class="form-input"
        />
        <span class="field-hint">Kosongkan untuk menggunakan default ({d.nik}@warga.rw)</span>
      </div>

      <div class="form-group">
        <label for="password" class="label-caps">Kata Sandi Awal</label>
        <input
          id="password"
          name="password"
          type="text"
          required
          value="warga123"
          class="form-input"
        />
        <span class="field-hint">Berikan kata sandi ini kepada warga untuk masuk pertama kali.</span>
      </div>

      <div class="modal-actions">
        <button
          type="button"
          class="btn btn-secondary"
          onclick={() => (showModalBuatAkun = false)}
        >
          Batal
        </button>
        <button type="submit" class="btn btn-secondary">
          Buat Akun Sekarang
        </button>
      </div>
    </form>
  </Modal>
</div>

<style>
  .detail-page {
    max-width: 48rem;
  }

  .detail-header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-6);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    min-height: var(--tap-min);
    color: var(--color-text-muted);
    text-decoration: none;
    font-size: var(--text-sm);
    font-weight: 500;
    transition: color 0.15s ease;
  }

  .back-link:hover {
    color: var(--color-accent);
  }

  .back-link:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: var(--radius-xs);
  }

  .header-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .info-card {
    padding: var(--space-5);
    margin-bottom: var(--space-6);
  }

  .info-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-2);
  }

  h1 {
    font-size: var(--text-2xl);
    font-weight: 700;
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    margin: 0;
    overflow-wrap: anywhere;
  }

  .nik {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    margin: 0 0 var(--space-5);
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(14rem, 100%), 1fr));
    gap: var(--space-4);
    margin: 0;
  }

  .info-item dt {
    margin-bottom: var(--space-1);
  }

  .info-item dd {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text);
    overflow-wrap: anywhere;
  }

  .anggota-section h2 {
    font-size: var(--text-lg);
    font-weight: 600;
    margin: 0 0 var(--space-3);
  }

  /* Tabel melebar sendiri, halaman tidak pernah scroll horizontal. */
  .table-wrap {
    overflow-x: auto;
  }

  .anggota-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-sm);
  }

  .anggota-table th {
    text-align: left;
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface-muted);
    border-bottom: 1px solid var(--color-border);
  }

  .anggota-table td {
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--color-border);
    overflow-wrap: anywhere;
  }

  .anggota-table tbody tr:last-child td {
    border-bottom: none;
  }

  .alert-nonaktif {
    margin-bottom: var(--space-4);
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    background: oklch(0.95 0.05 25);
    color: oklch(0.4 0.15 25);
    border: 1px solid oklch(0.85 0.1 25);
    font-size: var(--text-sm);
  }

  .badges {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .form-modal {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .modal-desc {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .form-input {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text-primary);
    font-size: var(--text-sm);
  }

  .field-hint {
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
    margin-top: var(--space-2);
  }
</style>
