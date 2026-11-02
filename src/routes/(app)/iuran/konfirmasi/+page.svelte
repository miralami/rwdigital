<script lang="ts">
  import { enhance } from '$app/forms';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import CircleCheckBig from '@lucide/svelte/icons/circle-check-big';
  import XCircle from '@lucide/svelte/icons/x-circle';
  import Clock from '@lucide/svelte/icons/clock';
  import Receipt from '@lucide/svelte/icons/receipt';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import Badge from '$lib/components/Badge.svelte';
  import Card from '$lib/components/Card.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { formatRupiah, formatTanggal, maskNoKk } from '$lib/format';
  import type { PageData, ActionData } from './$types';

  let { data, form } = $props<{ data: PageData; form?: { error?: string; sukses?: string } }>();

  let activeTab = $state<'menunggu' | 'diterima' | 'ditolak'>('menunggu');
  let expandedId = $state<number | null>(null);
  let tolakTarget = $state<any>(null);
  let alasanTolakText = $state('');

  function toggleExpand(id: number) {
    expandedId = expandedId === id ? null : id;
  }

  const filtered = $derived(
    data.daftar.filter((item: any) => item.status === activeTab)
  );

  const statusBadge: Record<string, { variant: 'default' | 'warning' | 'brand' | 'success' | 'danger'; label: string }> = {
    menunggu: { variant: 'warning', label: 'Menunggu Konfirmasi' },
    diterima: { variant: 'success', label: 'Diterima' },
    ditolak:  { variant: 'danger',  label: 'Ditolak' }
  };

  function labelPeriode(periode: string): string {
    const [tahun, bulan] = periode.split('-');
    const nama = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const index = Number(bulan) - 1;
    return nama[index] ? `${nama[index]} ${tahun}` : periode;
  }
</script>

<svelte:head>
  <title>Konfirmasi Pembayaran Iuran – Pengurus</title>
</svelte:head>

<div class="konfirmasi-page">
  <div class="header-bar">
    <a href="/iuran" class="back-link">
      <ArrowLeft size={16} />
      <span>Kembali ke Iuran</span>
    </a>
    <div class="title-row">
      <div class="title-icon">
        <Receipt size={24} />
      </div>
      <div>
        <h1>Konfirmasi Pembayaran Iuran</h1>
        <p class="subtitle">Verifikasi dan setujui bukti setor pembayaran iuran dari warga.</p>
      </div>
    </div>
  </div>

  {#if form?.error}
    <div class="banner banner-error" role="alert">{form.error}</div>
  {/if}
  {#if form?.sukses}
    <div class="banner banner-sukses" role="status">{form.sukses}</div>
  {/if}

  <!-- Status Tabs -->
  <div class="tabs">
    <button
      class="tab-btn"
      class:active={activeTab === 'menunggu'}
      onclick={() => (activeTab = 'menunggu')}
    >
      <Clock size={15} />
      <span>Menunggu</span>
      {#if data.counts.menunggu > 0}
        <span class="tab-badge badge-pending">{data.counts.menunggu}</span>
      {/if}
    </button>

    <button
      class="tab-btn"
      class:active={activeTab === 'diterima'}
      onclick={() => (activeTab = 'diterima')}
    >
      <CircleCheckBig size={15} />
      <span>Diterima</span>
      {#if data.counts.diterima > 0}
        <span class="tab-badge">{data.counts.diterima}</span>
      {/if}
    </button>

    <button
      class="tab-btn"
      class:active={activeTab === 'ditolak'}
      onclick={() => (activeTab = 'ditolak')}
    >
      <XCircle size={15} />
      <span>Ditolak</span>
      {#if data.counts.ditolak > 0}
        <span class="tab-badge">{data.counts.ditolak}</span>
      {/if}
    </button>
  </div>

  <!-- Cards List -->
  {#if filtered.length === 0}
    <div class="card empty-card">
      <EmptyState
        message="Tidak ada pembayaran"
        description="Belum ada riwayat konfirmasi pembayaran dengan status ini."
      />
    </div>
  {:else}
    <div class="requests-list">
      {#each filtered as item (item.id)}
        {@const isExpanded = expandedId === item.id}
        <div class="request-card card" class:expanded={isExpanded}>
          <!-- Header Bar -->
          <div
            class="card-header"
            onclick={() => toggleExpand(item.id)}
            role="button"
            tabindex="0"
            onkeydown={(e) => { if (e.key === 'Enter') toggleExpand(item.id); }}
          >
            <div class="user-info">
              <span class="warga-nama">{item.namaJenis}</span>
              <div class="meta-row">
                <span class="meta-item">No. KK: {maskNoKk(item.noKk)}</span>
                <span class="dot">·</span>
                <span class="meta-item">RT {String(item.nomorRt).padStart(2, '0')}</span>
                <span class="dot">·</span>
                <span class="meta-item">{labelPeriode(item.periode)}</span>
              </div>
            </div>

            <div class="header-right">
              <span class="nominal-badge">{formatRupiah(item.jumlah)}</span>
              <Badge variant={statusBadge[item.status]?.variant ?? 'default'}>
                {statusBadge[item.status]?.label ?? item.status}
              </Badge>
              <button
                type="button"
                class="expand-btn"
                aria-label={isExpanded ? 'Tutup rincian' : 'Buka rincian'}
              >
                {#if isExpanded}
                  <ChevronDown size={18} />
                {:else}
                  <ChevronRight size={18} />
                {/if}
              </button>
            </div>
          </div>

          <!-- Body / Details -->
          {#if isExpanded}
            <div class="card-body">
              <div class="detail-grid">
                <div class="detail-col">
                  <span class="detail-label">Metode Pembayaran</span>
                  <span class="detail-val uppercase">{item.metodeBayar}</span>
                </div>
                <div class="detail-col">
                  <span class="detail-label">Tanggal Pengajuan</span>
                  <span class="detail-val">{formatTanggal(item.createdAt)}</span>
                </div>
                <div class="detail-col">
                  <span class="detail-label">Total Tagihan</span>
                  <span class="detail-val">{formatRupiah(item.nominalTagihan)}</span>
                </div>
                <div class="detail-col">
                  <span class="detail-label">Sisa Tagihan</span>
                  <span class="detail-val">{formatRupiah(item.sisa)}</span>
                </div>
              </div>

              {#if item.catatan}
                <div class="catatan-box">
                  <span class="detail-label">Catatan Warga:</span>
                  <p class="catatan-text">{item.catatan}</p>
                </div>
              {/if}

              {#if item.status === 'ditolak' && item.alasanTolak}
                <div class="alasan-tolak-box">
                  <span class="detail-label">Alasan Penolakan:</span>
                  <p class="alasan-text">{item.alasanTolak}</p>
                </div>
              {/if}

              <!-- Actions (if Menunggu) -->
              {#if item.status === 'menunggu'}
                <div class="actions-row">
                  <button
                    type="button"
                    class="btn btn-secondary text-danger"
                    onclick={() => { tolakTarget = item; alasanTolakText = ''; }}
                  >
                    <XCircle size={15} />
                    <span>Tolak</span>
                  </button>

                  <form method="POST" action="?/terima" use:enhance>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" class="btn btn-primary">
                      <CircleCheckBig size={15} />
                      <span>Terima Pembayaran</span>
                    </button>
                  </form>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Modal Tolak -->
{#if tolakTarget}
  <Modal open={true} title="Tolak Konfirmasi Pembayaran" onClose={() => (tolakTarget = null)}>
    <form method="POST" action="?/tolak" use:enhance={() => { tolakTarget = null; }}>
      <input type="hidden" name="id" value={tolakTarget.id} />

      <p class="modal-desc">
        Tolak konfirmasi pembayaran sebesar <strong>{formatRupiah(tolakTarget.jumlah)}</strong> untuk tagihan <strong>{tolakTarget.namaJenis} ({labelPeriode(tolakTarget.periode)})</strong>.
      </p>

      <div class="field">
        <label for="alasanTolak">Alasan Penolakan</label>
        <textarea
          id="alasanTolak"
          name="alasanTolak"
          bind:value={alasanTolakText}
          class="input-base textarea"
          placeholder="Contoh: Bukti transfer tidak terbaca / nominal tidak sesuai."
          rows={3}
        ></textarea>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" onclick={() => (tolakTarget = null)}>Batal</button>
        <button type="submit" class="btn btn-primary bg-danger">Tolak Pembayaran</button>
      </div>
    </form>
  </Modal>
{/if}

<style>
  .konfirmasi-page {
    max-width: 60rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .header-bar {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    text-decoration: none;
  }

  .back-link:hover {
    color: var(--color-brand-600);
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .title-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: var(--radius-lg);
    background: var(--color-brand-50);
    color: var(--color-brand-600);
    flex-shrink: 0;
  }

  h1 {
    font-size: var(--text-xl);
    font-weight: 700;
    margin: 0;
  }

  .subtitle {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    margin: 0;
  }

  .banner {
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
  }

  .banner-error {
    background: var(--color-danger-bg);
    color: var(--color-danger);
    border: 1px solid var(--color-danger);
  }

  .banner-sukses {
    background: var(--color-success-bg);
    color: var(--color-success);
    border: 1px solid var(--color-success);
  }

  .tabs {
    display: flex;
    gap: var(--space-2);
    border-bottom: 1px solid var(--color-border);
    padding-bottom: var(--space-1);
  }

  .tab-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border: none;
    background: transparent;
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text-muted);
    cursor: pointer;
    border-radius: var(--radius-md);
    transition: all 0.15s ease;
  }

  .tab-btn:hover {
    color: var(--color-text);
    background: var(--color-surface-muted);
  }

  .tab-btn.active {
    color: var(--color-brand-700);
    background: var(--color-brand-50);
  }

  .tab-badge {
    font-size: var(--text-2xs);
    font-weight: 700;
    padding: 0.1rem 0.4rem;
    border-radius: var(--radius-full);
    background: var(--color-surface-muted);
  }

  .badge-pending {
    background: var(--color-warning-bg);
    color: var(--color-warning);
    border: 1px solid var(--color-warning);
  }

  .requests-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .request-card {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    overflow: hidden;
    padding: 0;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-4);
    cursor: pointer;
    gap: var(--space-3);
    user-select: none;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .warga-nama {
    font-weight: 700;
    font-size: var(--text-sm);
  }

  .meta-row {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .nominal-badge {
    font-family: var(--font-mono, monospace);
    font-weight: 700;
    font-size: var(--text-sm);
    color: var(--color-brand-700);
  }

  .expand-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border: none;
    background: var(--color-surface-muted);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    cursor: pointer;
  }

  .card-body {
    border-top: 1px solid var(--color-border);
    background: var(--color-surface-muted);
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: var(--space-3);
  }

  .detail-col {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .detail-label {
    font-size: var(--text-2xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--color-text-muted);
  }

  .detail-val {
    font-size: var(--text-sm);
    font-weight: 600;
  }

  .uppercase {
    text-transform: uppercase;
  }

  .catatan-box,
  .alasan-tolak-box {
    padding: var(--space-3);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
  }

  .alasan-tolak-box {
    border-color: var(--color-danger);
    background: var(--color-danger-bg);
  }

  .catatan-text,
  .alasan-text {
    margin: var(--space-1) 0 0;
    font-size: var(--text-sm);
  }

  .alasan-text {
    color: var(--color-danger);
  }

  .actions-row {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);
    margin-top: var(--space-2);
  }

  .text-danger {
    color: var(--color-danger);
  }

  .modal-desc {
    font-size: var(--text-sm);
    margin-bottom: var(--space-3);
  }

  .textarea {
    resize: vertical;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);
    margin-top: var(--space-4);
  }

  .bg-danger {
    background: var(--color-danger);
    border-color: var(--color-danger);
  }
</style>
