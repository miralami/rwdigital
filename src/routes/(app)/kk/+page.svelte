<script lang="ts">
  import { goto } from '$app/navigation';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Card from '$lib/components/Card.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import DonutChart from '$lib/components/DonutChart.svelte';
  import Plus from '@lucide/svelte/icons/plus';
  import Upload from '@lucide/svelte/icons/upload';
  import ClipboardEdit from '@lucide/svelte/icons/clipboard-edit';
  import Users from '@lucide/svelte/icons/users';
  import Home from '@lucide/svelte/icons/home';
  import Baby from '@lucide/svelte/icons/baby';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import Eye from '@lucide/svelte/icons/eye';
  import Pencil from '@lucide/svelte/icons/pencil';
  import Search from '@lucide/svelte/icons/search';
  import { maskNik, maskNoKk } from '$lib/format';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  let filterRt = $state<string>('semua');
  let searchQuery = $state('');
  let expandedKk = $state<Record<number, boolean>>({});

  function toggleKk(id: number) {
    expandedKk[id] = !expandedKk[id];
  }

  const filteredKk = $derived(
    data.semuaKk.filter((k: any) => {
      if (filterRt !== 'semua' && String(k.nomorRt) !== filterRt) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNoKk = k.noKk.toLowerCase().includes(q);
        const matchAlamat = k.alamat.toLowerCase().includes(q);
        const matchKepala = k.kepalaKeluarga.toLowerCase().includes(q);
        const matchAnggota = k.anggota.some((a: any) => a.nama.toLowerCase().includes(q) || a.nik.includes(q));
        if (!matchNoKk && !matchAlamat && !matchKepala && !matchAnggota) return false;
      }
      return true;
    })
  );

  const usiaSegments = $derived([
    { label: 'Balita (0–4)',      value: data.demografi.usia.balita,       color: 'var(--color-brand-400)' },
    { label: 'Sekolah (5–14)',    value: data.demografi.usia.usiaSekolah,  color: 'var(--color-brand-600)' },
    { label: 'Produktif (15–64)', value: data.demografi.usia.produktif,    color: 'var(--color-success)' },
    { label: 'Lansia (≥65)',      value: data.demografi.usia.lansia,       color: 'var(--color-warning)' }
  ]);

  function labelHubungan(hub: string) {
    const map: Record<string, string> = {
      kepala_keluarga: 'Kepala Keluarga',
      istri: 'Istri',
      anak: 'Anak',
      lainnya: 'Lainnya'
    };
    return map[hub] ?? hub;
  }
</script>

<!-- 1. Header & Actions -->
<PageHeader title="Keluarga & Kependudukan" subtitle="Manajemen Kartu Keluarga (KK), data warga, dan rekapitulasi demografis.">
  <div class="header-actions">
    <a href="/kk/pembaruan" class="btn btn-secondary btn-notif">
      <ClipboardEdit size={16} />
      <span>Permintaan Pembaruan</span>
      {#if data.pembaruanCounts.pending > 0}
        <span class="badge-count count-pending">{data.pembaruanCounts.pending}</span>
      {/if}
      {#if data.pembaruanCounts.done > 0}
        <span class="badge-count count-done">{data.pembaruanCounts.done}</span>
      {/if}
    </a>
    <a href="/kk/impor" class="btn btn-secondary">
      <Upload size={16} />
      <span>Impor CSV</span>
    </a>
    <a href="/kk/tambah" class="btn btn-primary">
      <Plus size={16} />
      <span>Tambah KK</span>
    </a>
  </div>
</PageHeader>

<!-- 2. Rekap Demografis (Dashboard Terintegrasi) -->
<section class="demografi-container" aria-label="Rekapitulasi Demografis">
  <div class="stats-grid">
    <StatCard
      title="Total Warga Aktif"
      value={data.demografi.gender.total}
      description="{data.demografi.gender.lakiLaki} L / {data.demografi.gender.perempuan} P"
      icon={Users}
    />
    <StatCard
      title="Total Kartu Keluarga"
      value={data.demografi.huni.totalKk}
      description="{data.demografi.huni.tetap} Tetap, {data.demografi.huni.kontrak} Kontrak"
      icon={Home}
    />
    <StatCard
      title="Usia Produktif (15–64)"
      value={data.demografi.usia.produktif}
      description="{data.demografi.gender.total ? Math.round((data.demografi.usia.produktif / data.demografi.gender.total) * 100) : 0}% dari total warga"
      variant="success"
    />
    <StatCard
      title="Kelahiran Baru (12 bln)"
      value={data.demografi.kelahiranBaru}
      icon={Baby}
      description="Warga baru lahir"
    />
  </div>

  <div class="dash-cols">
    <Card title="Komposisi Kelompok Usia">
      <DonutChart
        segments={usiaSegments}
        centerValue={data.demografi.usia.total}
        centerLabel="Total jiwa"
        unit="jiwa"
        emptyMessage="Belum ada data warga aktif."
      />
    </Card>

    <Card title="Distribusi Status Huni & Wilayah RT">
      <div class="demografi-tables">
        <div class="mini-table-wrap">
          <p class="mini-table-title">Status Hunian KK</p>
          <div class="status-huni-bars">
            <div class="huni-bar-item">
              <span class="huni-label">Tetap</span>
              <span class="huni-val">{data.demografi.huni.tetap} KK</span>
            </div>
            <div class="huni-bar-item">
              <span class="huni-label">Kontrak</span>
              <span class="huni-val">{data.demografi.huni.kontrak} KK</span>
            </div>
            <div class="huni-bar-item">
              <span class="huni-label">Kos</span>
              <span class="huni-val">{data.demografi.huni.kos} KK</span>
            </div>
          </div>
        </div>

        <div class="mini-table-wrap">
          <p class="mini-table-title">Sebaran per Wilayah RT</p>
          <div class="rt-tags">
            {#each data.demografi.rekapRt as r}
              <div class="rt-tag-item">
                <span class="rt-badge">RT {String(r.nomorRt).padStart(2, '0')}</span>
                <span class="rt-info">{r.totalKk} KK · {r.totalWarga} Jiwa</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </Card>
  </div>
</section>

<!-- 3. Manajemen Tabel Kartu Keluarga (Directly Below Dashboard) -->
<section class="management-section" aria-label="Daftar Kartu Keluarga">
  <div class="section-toolbar">
    <div class="search-box">
      <Search size={16} class="search-icon" />
      <input
        type="search"
        placeholder="Cari No. KK, nama kepala keluarga, atau anggota..."
        bind:value={searchQuery}
        class="search-input"
      />
    </div>

    <div class="filter-group">
      <label for="filter-rt" class="filter-label">Filter RT:</label>
      <select id="filter-rt" bind:value={filterRt} class="filter-select">
        <option value="semua">Semua RT ({data.semuaRt.length} RT)</option>
        {#each data.semuaRt as rtItem}
          <option value={String(rtItem.nomor)}>RT {String(rtItem.nomor).padStart(2, '0')}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="kk-cards-list">
    {#if filteredKk.length === 0}
      <div class="empty-state">
        <p>Tidak ada Kartu Keluarga yang sesuai dengan filter.</p>
      </div>
    {:else}
      {#each filteredKk as k (k.id)}
        {@const isOpen = expandedKk[k.id] ?? false}
        <div class="kk-card" class:expanded={isOpen}>
          <!-- Card Header (Baris KK) -->
          <div class="kk-header" onclick={() => toggleKk(k.id)} role="button" tabindex="0" onkeydown={(e) => { if (e.key === 'Enter') toggleKk(k.id); }}>
            <button type="button" class="expand-btn" aria-label={isOpen ? 'Tutup daftar anggota' : 'Buka daftar anggota'}>
              {#if isOpen}
                <ChevronDown size={18} />
              {:else}
                <ChevronRight size={18} />
              {/if}
            </button>

            <div class="kk-main-info">
              <div class="kk-title-row">
                <span class="kk-no">{maskNoKk(k.noKk)}</span>
                <span class="badge variant-brand">RT {String(k.nomorRt).padStart(2, '0')}</span>
                <span class="badge variant-default capitalize">{k.statusHuni}</span>
              </div>
              <p class="kk-kepala">
                <strong>Kepala:</strong> {k.kepalaKeluarga}
                <span class="dot-sep">·</span>
                <span class="kk-alamat">{k.alamat}</span>
              </p>
            </div>

            <div class="kk-meta">
              <span class="badge variant-info">{k.jumlahAnggota} Anggota</span>
            </div>
          </div>

          <!-- Card Body: Anggota Keluarga (Expanded) -->
          {#if isOpen}
            <div class="kk-body">
              <div class="table-wrap">
                <table class="anggota-table">
                  <thead>
                    <tr>
                      <th>NIK</th>
                      <th>Nama Lengkap</th>
                      <th>Hubungan</th>
                      <th>L/P</th>
                      <th>Status</th>
                      <th class="text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each k.anggota as a (a.id)}
                      <tr>
                        <td class="mono">{maskNik(a.nik)}</td>
                        <td class="font-medium">{a.nama}</td>
                        <td>
                          <span class="badge variant-default text-xs">{labelHubungan(a.statusHubunganKk)}</span>
                        </td>
                        <td>{a.jenisKelamin}</td>
                        <td>
                          {#if a.aktif}
                            <span class="badge variant-success">Aktif</span>
                          {:else}
                            <span class="badge variant-default">Nonaktif</span>
                          {/if}
                        </td>
                        <td class="text-right aksi-cell">
                          <a href="/kk/{a.id}" class="btn-icon" title="Detail Warga">
                            <Eye size={15} />
                          </a>
                          <a href="/kk/{a.id}/edit" class="btn-icon" title="Edit Warga">
                            <Pencil size={15} />
                          </a>
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</section>

<style>
  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .btn-notif {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
  }

  .badge-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-2xs);
    font-weight: 700;
    padding: 0.1rem 0.4rem;
    border-radius: var(--radius-full);
    line-height: 1;
  }

  .count-pending {
    background: var(--color-warning-bg);
    color: var(--color-warning);
    border: 1px solid var(--color-warning);
  }

  .count-done {
    background: var(--color-success-bg);
    color: var(--color-success);
    border: 1px solid var(--color-success);
  }

  /* ─── Demografi Section ─── */
  .demografi-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    margin-bottom: var(--space-6);
    padding-bottom: var(--space-6);
    border-bottom: 2px dashed var(--color-border);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
    gap: var(--space-3);
  }

  .dash-cols {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  @media (min-width: 1024px) {
    .dash-cols {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .demografi-tables {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .mini-table-title {
    font-size: var(--text-xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--color-text-muted);
    margin: 0 0 var(--space-2);
  }

  .status-huni-bars {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .huni-bar-item {
    flex: 1 1 5rem;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    padding: var(--space-2) var(--space-3);
    background: var(--color-surface-muted);
    border-radius: var(--radius-md);
  }

  .huni-label {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .huni-val {
    font-size: var(--text-sm);
    font-weight: 700;
    color: var(--color-text);
  }

  .rt-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .rt-tag-item {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: 0.25rem 0.6rem;
    background: var(--color-surface-muted);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: var(--text-xs);
  }

  .rt-badge {
    font-weight: 700;
    color: var(--color-brand-600);
  }

  .rt-info {
    color: var(--color-text-muted);
  }

  /* ─── Management Section ─── */
  .management-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .section-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  .search-box {
    position: relative;
    flex: 1 1 18rem;
    max-width: 28rem;
  }

  .search-box :global(.search-icon) {
    position: absolute;
    left: var(--space-3);
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-muted);
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: var(--space-2) var(--space-3) var(--space-2) 2.25rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text);
    font-size: var(--text-sm);
  }

  .filter-group {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .filter-label {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--color-text-muted);
  }

  .filter-select {
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text);
    font-size: var(--text-sm);
  }

  /* ─── KK Cards List ─── */
  .kk-cards-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .kk-card {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    overflow: hidden;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .kk-card:hover {
    border-color: var(--color-brand-300);
  }

  .kk-card.expanded {
    border-color: var(--color-brand-500);
    box-shadow: var(--shadow-sm);
  }

  .kk-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    cursor: pointer;
    user-select: none;
  }

  .expand-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    padding: 0;
    border: none;
    background: var(--color-surface-muted);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    cursor: pointer;
    flex-shrink: 0;
  }

  .kk-main-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .kk-title-row {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .kk-no {
    font-family: var(--font-mono, monospace);
    font-weight: 700;
    font-size: var(--text-sm);
    color: var(--color-text);
  }

  .capitalize {
    text-transform: capitalize;
  }

  .kk-kepala {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dot-sep {
    margin: 0 var(--space-1);
  }

  .kk-meta {
    flex-shrink: 0;
  }

  /* ─── Anggota Sub-table ─── */
  .kk-body {
    border-top: 1px solid var(--color-border);
    background: var(--color-surface-muted);
    padding: var(--space-3) var(--space-4);
  }

  .table-wrap {
    overflow-x: auto;
  }

  .anggota-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-xs);
  }

  .anggota-table th,
  .anggota-table td {
    padding: var(--space-2) var(--space-3);
    text-align: left;
    border-bottom: 1px solid var(--color-border);
  }

  .anggota-table th {
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    font-size: var(--text-2xs);
  }

  .anggota-table tbody tr:last-child td {
    border-bottom: none;
  }

  .mono {
    font-family: var(--font-mono, monospace);
  }

  .font-medium {
    font-weight: 600;
  }

  .text-right {
    text-align: right;
  }

  .aksi-cell {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--space-1);
  }

  .btn-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text-muted);
    text-decoration: none;
    transition: all 0.15s ease;
  }

  .btn-icon:hover {
    color: var(--color-brand-600);
    border-color: var(--color-brand-300);
    background: var(--color-brand-50);
  }

  .empty-state {
    padding: var(--space-8);
    text-align: center;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    background: var(--color-surface);
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-lg);
  }
</style>
