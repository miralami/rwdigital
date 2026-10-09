<script lang="ts">
  import type { PageData } from './$types';
  import Badge from '$lib/components/Badge.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Plus from '@lucide/svelte/icons/plus';
  import Eye from '@lucide/svelte/icons/eye';
  import EyeOff from '@lucide/svelte/icons/eye-off';
  import Pencil from '@lucide/svelte/icons/pencil';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  let { data } = $props<{ data: PageData }>();

  let filterKategori = $state<string>('semua');

  const filteredPengumuman = $derived(
    data.semuaPengumuman.filter((p: any) => {
      if (filterKategori !== 'semua' && p.kategori !== filterKategori) return false;
      return true;
    })
  );

  function getKategoriVariant(kategori: string): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand' {
    const map: Record<string, any> = {
      umum: 'default',
      kegiatan: 'info',
      keuangan: 'brand',
      darurat: 'danger'
    };
    return map[kategori] ?? 'default';
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
</script>

<PageHeader title="Pengumuman" subtitle="Informasi resmi RW untuk seluruh warga.">
  <a href="/pengumuman/tambah" class="btn btn-secondary">
    <Plus size={16} />
    <span>Buat pengumuman</span>
  </a>
</PageHeader>

<div class="filters-card">
  <div class="filter-group">
    <label for="filter-kategori" class="label-caps">Filter Kategori:</label>
    <select id="filter-kategori" bind:value={filterKategori} class="filter-select">
      <option value="semua">Semua Kategori</option>
      <option value="umum">Umum</option>
      <option value="kegiatan">Kegiatan</option>
      <option value="keuangan">Keuangan</option>
      <option value="darurat">Darurat</option>
    </select>
  </div>
</div>

{#if filteredPengumuman.length === 0}
  <EmptyState message="Belum ada pengumuman" description="Tidak ada pengumuman untuk kriteria yang dipilih.">
    <a href="/pengumuman/tambah" class="btn btn-secondary">
      <Plus size={16} />
      <span>Buat pengumuman</span>
    </a>
  </EmptyState>
{:else}
  <div class="pengumuman-list">
    {#each filteredPengumuman as p}
      <article class="card pengumuman-card" class:is-hidden={!p.ditampilkan}>
        <div class="card-header">
          <div class="card-meta">
            <Badge variant={getKategoriVariant(p.kategori)} dot>{p.kategori}</Badge>
            {#if !p.ditampilkan}
              <span class="draft-badge">Disembunyikan</span>
            {/if}
            <span class="card-date">{formatDate(p.createdAt)}</span>
          </div>
          <div class="card-actions">
            <form method="POST" action="?/toggle">
              <input type="hidden" name="id" value={p.id} />
              <button
                type="submit"
                class="btn-icon"
                title={p.ditampilkan ? 'Sembunyikan dari warga' : 'Tampilkan ke warga'}
                aria-label={p.ditampilkan ? `Sembunyikan pengumuman: ${p.judul}` : `Tampilkan pengumuman: ${p.judul}`}
              >
                {#if p.ditampilkan}
                  <Eye size={16} />
                {:else}
                  <EyeOff size={16} />
                {/if}
              </button>
            </form>
            <a
              href="/pengumuman/{p.id}/edit"
              class="btn-icon"
              title="Edit pengumuman"
              aria-label={`Edit pengumuman: ${p.judul}`}
            >
              <Pencil size={16} />
            </a>
            <form method="POST" action="?/hapus">
              <input type="hidden" name="id" value={p.id} />
              <button
                type="submit"
                class="btn-icon btn-icon-danger"
                title="Hapus pengumuman"
                aria-label={`Hapus pengumuman: ${p.judul}`}
              >
                <Trash2 size={16} />
              </button>
            </form>
          </div>
        </div>
        <h2 class="card-title">{p.judul}</h2>
        <p class="card-content">{p.isi}</p>
      </article>
    {/each}
  </div>
{/if}

<style>
  .filters-card {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    margin-bottom: var(--space-4);
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface-raised);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .filter-group {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .filter-select {
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text-primary);
    font-size: var(--text-sm);
  }

  .pengumuman-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .pengumuman-card {
    padding: var(--space-5);
    transition: border-color 0.15s ease;
  }

  .pengumuman-card.is-hidden {
    border-style: dashed;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-3);
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  .card-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .draft-badge {
    font-size: var(--text-2xs);
    font-weight: 600;
    color: var(--color-text-muted);
    background: var(--color-surface-muted);
    padding: 0.125rem 0.5rem;
    border-radius: var(--radius-full);
    border: 1px solid var(--color-border);
  }

  .card-date {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .card-actions {
    display: flex;
    gap: var(--space-2);
    align-items: center;
  }

  .btn-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--tap-min);
    min-height: var(--tap-min);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    color: var(--color-text-muted);
    cursor: pointer;
    border-radius: var(--radius-md);
    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    text-decoration: none;
  }

  .btn-icon:hover {
    background: var(--color-surface-muted);
    color: var(--color-text);
    border-color: var(--color-border-strong);
  }

  .btn-icon:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  .btn-icon-danger:hover {
    background: var(--color-danger-bg);
    color: var(--color-danger);
    border-color: color-mix(in oklab, var(--color-danger) 30%, transparent);
  }

  .card-title {
    font-size: var(--text-lg);
    font-weight: 700;
    line-height: var(--leading-snug);
    margin: 0 0 var(--space-2);
    color: var(--color-text);
    letter-spacing: var(--tracking-tight);
    overflow-wrap: anywhere;
  }

  .card-content {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    line-height: var(--leading-normal);
    margin: 0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
</style>
