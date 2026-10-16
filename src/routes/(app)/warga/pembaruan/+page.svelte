<script lang="ts">
  import { enhance } from '$app/forms';
  import ClipboardEdit from '@lucide/svelte/icons/clipboard-edit';
  import CircleCheckBig from '@lucide/svelte/icons/circle-check-big';
  import XCircle from '@lucide/svelte/icons/x-circle';
  import ShieldCheck from '@lucide/svelte/icons/shield-check';
  import Clock from '@lucide/svelte/icons/clock';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Badge from '$lib/components/Badge.svelte';
  import Card from '$lib/components/Card.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import { formatTanggal } from '$lib/format';
  import type { PageData, ActionData } from './$types';

  let { data, form } = $props<{ data: PageData; form: ActionData }>();

  // $derived tracks data.statusFilter reactively (avoids 'only captures initial value' warning)
  const activeFilter = $derived(data.statusFilter ?? 'diajukan');
  // Local UI state — expandedId & submitting
  let activeFilterOverride = $state<string | null>(null);
  let expandedId = $state<number | null>(null);
  let submitting = $state<number | null>(null);

  // Allow tab clicks to override the server-provided filter without a reload
  const currentFilter = $derived(activeFilterOverride ?? activeFilter);

  const statusOpts = [
    { val: 'diajukan',     label: 'Menunggu Tinjau' },
    { val: 'diverifikasi', label: 'Sudah Diverifikasi' },
    { val: 'disetujui',    label: 'Disetujui' },
    { val: 'ditolak',      label: 'Ditolak' }
  ];

  const filtered = $derived(
    data.permintaan.filter((p: typeof data.permintaan[number]) => p.status === currentFilter)
  );

  const statusBadge: Record<string, { variant: 'default' | 'warning' | 'brand' | 'success' | 'danger'; label: string }> = {
    diajukan:    { variant: 'warning', label: 'Diajukan' },
    diverifikasi:{ variant: 'brand',   label: 'Diverifikasi' },
    disetujui:   { variant: 'success', label: 'Disetujui' },
    ditolak:     { variant: 'danger',  label: 'Ditolak' }
  };

  function parseDiff(dataLamaStr: string, dataBaruStr: string): { field: string; lama: string; baru: string }[] {
    try {
      const lama = JSON.parse(dataLamaStr) as Record<string, string>;
      const baru = JSON.parse(dataBaruStr) as Record<string, string>;
      const labelMap: Record<string, string> = {
        nama: 'Nama Lengkap', tempatLahir: 'Tempat Lahir', tanggalLahir: 'Tanggal Lahir',
        jenisKelamin: 'Jenis Kelamin', agama: 'Agama', pendidikan: 'Pendidikan',
        pekerjaan: 'Pekerjaan', statusPerkawinan: 'Status Perkawinan'
      };
      return Object.keys(baru).map(k => ({
        field: labelMap[k] ?? k,
        lama: lama[k] ?? '—',
        baru: baru[k]
      }));
    } catch {
      return [];
    }
  }

  function maskNik(nik: string): string {
    if (!nik || nik.length < 8) return nik;
    return nik.slice(0, 4) + '••••••••' + nik.slice(-4);
  }
</script>

<svelte:head>
  <title>Permintaan Pembaruan Data – Pengurus</title>
</svelte:head>

<div class="pembaruan-page">
  <div class="header-bar">
    <a href="/warga" class="back-link">
      <ArrowLeft size={16} />
      <span>Data Warga</span>
    </a>
  </div>

  <div class="page-title">
    <ClipboardEdit size={22} class="title-icon" />
    <div>
      <h1 class="title">Permintaan Pembaruan Data Warga</h1>
      <p class="subtitle">Tinjau dan setujui atau tolak permintaan perubahan data yang diajukan warga.</p>
    </div>
  </div>

  {#if form?.success}
    <div class="success-banner" role="status">
      <CircleCheckBig size={16} />
      <span>Tindakan berhasil diterapkan.</span>
    </div>
  {/if}

  <!-- Filter tab -->
  <div class="filter-tabs" role="tablist" aria-label="Filter status permintaan">
    {#each statusOpts as opt}
      {@const count = data.permintaan.filter((p: typeof data.permintaan[number]) => p.status === opt.val).length}
      <button
        type="button"
        role="tab"
        class="filter-tab"
        class:active={currentFilter === opt.val}
        aria-selected={currentFilter === opt.val}
        onclick={() => (activeFilterOverride = opt.val)}
      >
        {opt.label}
        {#if count > 0}
          <span class="tab-count">{count}</span>
        {/if}
      </button>
    {/each}
  </div>

  <!-- Daftar permintaan -->
  {#if filtered.length === 0}
    <Card padded>
      <EmptyState
        compact
        icon={ClipboardEdit}
        message="Tidak ada permintaan"
        description="Tidak ada permintaan dengan status ini saat ini."
      />
    </Card>
  {:else}
    <div class="request-list">
      {#each filtered as req (req.id)}
        {@const badge = statusBadge[req.status] ?? { variant: 'default', label: req.status }}
        {@const diff = parseDiff(req.dataLama, req.dataBaru)}
        <div class="request-card">
          <button
            type="button"
            class="request-header"
            onclick={() => (expandedId = expandedId === req.id ? null : req.id)}
            aria-expanded={expandedId === req.id}
          >
            <div class="request-avatar">
              {req.namaWarga?.charAt(0) ?? '?'}
            </div>
            <div class="request-meta">
              <span class="request-name">{req.namaWarga}</span>
              <span class="request-nik">{maskNik(req.nikWarga)}</span>
            </div>
            <div class="request-right">
              <Badge variant={badge.variant}>{badge.label}</Badge>
              <span class="request-date">{formatTanggal(req.createdAt)}</span>
            </div>
          </button>

          {#if expandedId === req.id}
            <div class="request-body">
              <!-- Tabel diff perubahan -->
              {#if diff.length > 0}
                <div class="diff-section">
                  <p class="diff-title label-caps">Perubahan yang Diusulkan</p>
                  <table class="diff-table">
                    <thead>
                      <tr>
                        <th>Kolom</th>
                        <th>Data Sekarang</th>
                        <th>Data Baru</th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each diff as d}
                        <tr>
                          <td class="diff-field">{d.field}</td>
                          <td class="diff-lama">{d.lama}</td>
                          <td class="diff-baru">{d.baru}</td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              {/if}

              {#if req.catatan}
                <p class="request-catatan">
                  <strong>Alasan warga:</strong> {req.catatan}
                </p>
              {/if}

              {#if req.catatanPengurus}
                <p class="request-catatan-pgr">
                  <strong>Catatan pengurus:</strong> {req.catatanPengurus}
                </p>
              {/if}

              <!-- Aksi hanya untuk status diajukan/diverifikasi -->
              {#if req.status === 'diajukan' || req.status === 'diverifikasi'}
                <form
                  method="POST"
                  action="?/tinjau"
                  use:enhance={() => {
                    submitting = req.id;
                    return async ({ update }) => {
                      await update();
                      submitting = null;
                      expandedId = null;
                    };
                  }}
                  class="aksi-form"
                >
                  <input type="hidden" name="id" value={req.id} />

                  <div class="catatan-field">
                    <label class="field-label" for="catatan-{req.id}">Catatan Pengurus (opsional)</label>
                    <textarea
                      id="catatan-{req.id}"
                      name="catatanPengurus"
                      class="field-textarea"
                      rows="2"
                      placeholder="Tulis catatan atau alasan penolakan…"
                    ></textarea>
                  </div>

                  <div class="aksi-btns">
                    {#if req.status === 'diajukan'}
                      <button
                        type="submit"
                        name="aksi"
                        value="verifikasi"
                        class="btn btn-secondary btn-sm"
                        disabled={submitting === req.id}
                      >
                        <ShieldCheck size={14} />
                        Verifikasi
                      </button>
                    {/if}
                    <button
                      type="submit"
                      name="aksi"
                      value="setujui"
                      class="btn btn-primary btn-sm"
                      disabled={submitting === req.id}
                    >
                      <CircleCheckBig size={14} />
                      Setujui & Terapkan
                    </button>
                    <button
                      type="submit"
                      name="aksi"
                      value="tolak"
                      class="btn btn-danger btn-sm"
                      disabled={submitting === req.id}
                    >
                      <XCircle size={14} />
                      Tolak
                    </button>
                  </div>
                </form>
              {/if}

              {#if req.status === 'disetujui'}
                <div class="status-info status-info-success">
                  <CircleCheckBig size={14} />
                  <span>Perubahan sudah diterapkan ke data warga.</span>
                  {#if req.tanggalTinjau}
                    <span class="status-date">· {formatTanggal(req.tanggalTinjau)}</span>
                  {/if}
                </div>
              {:else if req.status === 'ditolak'}
                <div class="status-info status-info-danger">
                  <XCircle size={14} />
                  <span>Permintaan ditolak.</span>
                  {#if req.tanggalTinjau}
                    <span class="status-date">· {formatTanggal(req.tanggalTinjau)}</span>
                  {/if}
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .pembaruan-page {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .header-bar {
    display: flex;
    align-items: center;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    text-decoration: none;
  }

  .page-title {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .page-title :global(svg) {
    color: var(--color-brand-600);
    flex-shrink: 0;
    margin-top: 0.15rem;
  }

  .title {
    margin: 0;
    font-size: var(--text-xl);
    font-weight: 800;
    color: var(--color-text);
    letter-spacing: var(--tracking-tight);
  }

  .subtitle {
    margin: var(--space-1) 0 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .success-banner {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    background: color-mix(in srgb, var(--color-success) 10%, transparent);
    border: 1px solid var(--color-success);
    font-size: var(--text-sm);
    color: var(--color-text);
  }
  .success-banner :global(svg) { color: var(--color-success); }

  /* ─── Filter tabs ─── */
  .filter-tabs {
    display: flex;
    gap: var(--space-1);
    border-bottom: 1px solid var(--color-border);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .filter-tab {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--color-text-muted);
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    white-space: nowrap;
    transition: color 0.15s, border-color 0.15s;
  }

  .filter-tab.active {
    color: var(--color-brand-600);
    border-bottom-color: var(--color-brand-600);
  }

  .tab-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.2rem;
    height: 1.2rem;
    padding: 0 0.3rem;
    font-size: var(--text-xs);
    font-weight: 700;
    background: var(--color-brand-600);
    color: #fff;
    border-radius: var(--radius-full);
  }

  /* ─── Request cards ─── */
  .request-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .request-card {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    overflow: hidden;
  }

  .request-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    width: 100%;
    padding: var(--space-4);
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background 0.1s;
  }

  .request-header:hover {
    background: var(--color-surface-muted);
  }

  .request-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    flex-shrink: 0;
    border-radius: var(--radius-full);
    background: var(--color-brand-600);
    color: #fff;
    font-size: var(--text-base);
    font-weight: 700;
    text-transform: uppercase;
  }

  .request-meta {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .request-name {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text);
  }

  .request-nik {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    font-variant-numeric: tabular-nums;
  }

  .request-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--space-1);
    flex-shrink: 0;
  }

  .request-date {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  /* ─── Request body (expanded) ─── */
  .request-body {
    border-top: 1px solid var(--color-border);
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .diff-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .diff-title {
    margin: 0;
  }

  .diff-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-sm);
  }

  .diff-table th {
    padding: var(--space-2) var(--space-3);
    background: var(--color-surface-muted);
    border-bottom: 1px solid var(--color-border);
    text-align: left;
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .diff-table td {
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
  }

  .diff-field { font-weight: 600; color: var(--color-text); }
  .diff-lama { color: var(--color-text-muted); }
  .diff-baru { font-weight: 600; color: var(--color-brand-600); }

  .request-catatan,
  .request-catatan-pgr {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    padding: var(--space-2) var(--space-3);
    background: var(--color-surface-muted);
    border-radius: var(--radius-md);
    border-left: 3px solid var(--color-border);
  }

  .request-catatan-pgr { border-left-color: var(--color-warning); }

  /* ─── Aksi form ─── */
  .aksi-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .catatan-field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .field-label {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text);
  }

  .field-textarea {
    font-family: inherit;
    font-size: var(--text-sm);
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text);
    resize: vertical;
    outline: none;
  }

  .field-textarea:focus {
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-brand-600) 20%, transparent);
  }

  .aksi-btns {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .btn-danger {
    background: var(--color-danger);
    color: #fff;
    border-color: var(--color-danger);
  }

  /* ─── Status info ─── */
  .status-info {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
  }

  .status-info-success {
    background: color-mix(in srgb, var(--color-success) 10%, transparent);
    color: var(--color-success);
  }

  .status-info-danger {
    background: color-mix(in srgb, var(--color-danger) 10%, transparent);
    color: var(--color-danger);
  }

  .status-date {
    margin-left: auto;
    font-size: var(--text-xs);
    opacity: 0.75;
  }
</style>
