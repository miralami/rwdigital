<script lang="ts">
  import type { PageData } from './$types';
  import Badge from '$lib/components/Badge.svelte';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Boxes from '@lucide/svelte/icons/boxes';
  import { formatRupiah } from '$lib/format';

  let { data, form }: { data: PageData; form?: { error?: string } } = $props();

  const LABEL_PERIODE: Record<string, string> = {
    bulanan: 'Bulanan',
    tahunan: 'Tahunan',
    insidental: 'Insidental'
  };
</script>

<div class="page-container">
  <div class="page-header">
    <h1>Jenis iuran</h1>
    <div class="header-actions">
      <a href="/iuran/paket" class="btn btn-secondary">
        <Boxes size={16} />
        <span>Kelola paket</span>
      </a>
      <a href="/iuran" class="btn btn-secondary">
        <ArrowLeft size={16} />
        <span>Kembali</span>
      </a>
    </div>
  </div>

  {#if form?.error}
    <p class="error-banner" role="alert">{form.error}</p>
  {/if}

  <div class="content-grid">
    <div class="card panel">
      <h2>Daftar jenis iuran</h2>
      {#if data.semuaJenis.length === 0}
        <p class="empty">Belum ada jenis iuran.</p>
      {:else}
        <div class="table-wrap">
          <table class="jenis-table">
            <thead>
              <tr>
                <th class="label-caps">Nama</th>
                <th class="label-caps">Scope</th>
                <th class="label-caps">Nominal</th>
                <th class="label-caps">Porsi RW</th>
                <th class="label-caps">Periode</th>
                <th class="label-caps">Urutan</th>
                <th class="label-caps">Status</th>
                <th><span class="sr-only">Aksi</span></th>
              </tr>
            </thead>
            <tbody>
              {#each data.semuaJenis as j (j.id)}
                <tr>
                  <td>{j.nama}</td>
                  <td>
                    <Badge variant={j.scope === 'rt' ? 'brand' : 'default'}>
                      {j.scope === 'rt' ? 'RT' : 'RW'}
                    </Badge>
                  </td>
                  <td>{formatRupiah(j.nominal)}</td>
                  <td>{formatRupiah(j.porsiRw)}</td>
                  <td>{LABEL_PERIODE[j.periode] ?? j.periode}</td>
                  <td>{j.urutan}</td>
                  <td>
                    {#if j.aktif}
                      <Badge variant="success">Aktif</Badge>
                    {:else}
                      <Badge variant="default">Nonaktif</Badge>
                    {/if}
                  </td>
                  <td class="cell-aksi">
                    <a href="/iuran/jenis/{j.id}" class="btn btn-ghost btn-ubah">Ubah</a>
                    <form method="POST" action="?/hapus">
                      <input type="hidden" name="id" value={j.id} />
                      <button type="submit" class="btn btn-ghost btn-hapus">Hapus</button>
                    </form>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
      <p class="panel-hint">
        Jenis ber-scope <strong>RW</strong> tidak ditagihkan lewat RT. Nominal &amp; porsi hanya
        memengaruhi tagihan baru; tagihan lama menyimpan nilai saat diterbitkan.
      </p>
    </div>

    <div class="card panel">
      <h2>Tambah jenis iuran</h2>
      <form method="POST" action="?/tambah">
        <div class="field">
          <label for="nama">Nama iuran <span class="required">*</span></label>
          <input
            id="nama"
            name="nama"
            class="input-base"
            type="text"
            placeholder="mis. Iuran Keamanan (K3)"
            required
          />
        </div>
        <div class="field">
          <label for="nominal">Nominal per KK (Rp) <span class="required">*</span></label>
          <input
            id="nominal"
            name="nominal"
            class="input-base"
            type="number"
            min="1"
            step="1000"
            placeholder="36000"
            required
          />
        </div>
        <div class="field">
          <label for="porsiRw">Porsi untuk RW (Rp)</label>
          <input
            id="porsiRw"
            name="porsiRw"
            class="input-base"
            type="number"
            min="0"
            step="1000"
            value="0"
          />
          <span class="field-hint">Bagian RW dari tiap tagihan. Boleh 0 bila semua untuk RT.</span>
        </div>
        <div class="field">
          <label for="scope">Ditagih oleh</label>
          <select id="scope" name="scope" class="input-base">
            <option value="rt" selected>RT (dibagi per wilayah)</option>
            <option value="rw">RW langsung (tidak lewat RT)</option>
          </select>
        </div>
        <div class="field">
          <label for="rtId">Pemilik RT (opsional)</label>
          <select id="rtId" name="rtId" class="input-base">
            <option value="">Semua RT</option>
            {#each data.daftarRt as wilayah (wilayah.id)}
              <option value={wilayah.id}>RT {String(wilayah.nomor).padStart(2, '0')}</option>
            {/each}
          </select>
          <span class="field-hint">Kosongkan bila jenis ini berlaku untuk semua RT.</span>
        </div>
        <div class="field">
          <label for="periode">Periode</label>
          <select id="periode" name="periode" class="input-base">
            <option value="bulanan">Bulanan</option>
            <option value="tahunan">Tahunan</option>
            <option value="insidental">Insidental</option>
          </select>
        </div>
        <div class="field">
          <label for="urutan">Urutan tampil</label>
          <input id="urutan" name="urutan" class="input-base" type="number" min="0" value="0" />
        </div>
        <div class="field-checkbox">
          <label class="checkbox-label">
            <input type="checkbox" name="aktif" checked />
            <span>Aktif</span>
          </label>
        </div>
        <button type="submit" class="btn btn-primary">Tambah</button>
      </form>
    </div>
  </div>
</div>

<style>
  .page-container {
    max-width: 64rem;
  }

  .page-header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-6);
  }

  .header-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  h1 {
    font-size: var(--text-2xl);
    font-weight: 700;
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--color-text);
    margin: 0;
  }

  .error-banner {
    margin: 0 0 var(--space-4);
    padding: var(--space-3) var(--space-4);
    border: 1px solid var(--color-danger);
    border-radius: var(--radius-md);
    background: var(--color-danger-bg);
    color: var(--color-danger);
    font-size: var(--text-sm);
  }

  .content-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    gap: var(--space-5);
  }

  @media (max-width: 56rem) {
    .content-grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .panel {
    padding: var(--space-5);
    min-width: 0;
  }

  h2 {
    font-size: var(--text-base);
    font-weight: 600;
    margin: 0 0 var(--space-4);
  }

  .empty {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    text-align: center;
    padding: var(--space-8) 0;
  }

  .panel-hint {
    margin: var(--space-4) 0 0;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  /* Tabel melebar sendiri, halaman tidak pernah scroll horizontal. */
  .table-wrap {
    overflow-x: auto;
  }

  .jenis-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-sm);
  }

  .jenis-table th {
    text-align: left;
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
  }

  .jenis-table td {
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
    overflow-wrap: anywhere;
  }

  .jenis-table tbody tr:last-child td {
    border-bottom: none;
  }

  .cell-aksi {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-1);
    white-space: nowrap;
  }

  .btn-ubah,
  .btn-hapus {
    min-height: var(--tap-min);
  }

  .btn-hapus {
    color: var(--color-danger);
  }

  .btn-hapus:hover {
    background: var(--color-danger-bg);
    color: var(--color-danger);
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

  .field-hint {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .required {
    color: var(--color-danger);
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

  .checkbox-label input[type='checkbox'] {
    width: 1.125rem;
    height: 1.125rem;
    accent-color: var(--color-accent);
  }
</style>
