<script lang="ts">
  import type { PageData } from './$types';
  import Badge from '$lib/components/Badge.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { Plus, Eye, EyeOff, Pencil, Trash2 } from '@lucide/svelte';
  let { data } = $props<{ data: PageData }>();

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

<PageHeader title="Pengumuman" subtitle="Informasi dan pengumuman resmi RW untuk seluruh warga.">
  <a href="/pengumuman/tambah" class="btn btn-primary">
    <Plus size={16} />
    <span>Buat Pengumuman</span>
  </a>
</PageHeader>

{#if data.semuaPengumuman.length === 0}
  <EmptyState message="Belum ada pengumuman" description="Buat pengumuman pertama untuk disiarkan kepada warga.">
    <a href="/pengumuman/tambah" class="btn btn-primary">
      <Plus size={16} />
      <span>Buat Pengumuman</span>
    </a>
  </EmptyState>
{:else}
  <div class="pengumuman-list">
    {#each data.semuaPengumuman as p}
      <article class="pengumuman-card" class:is-hidden={!p.ditampilkan}>
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
                aria-label={p.ditampilkan ? 'Sembunyikan' : 'Tampilkan'}
              >
                {#if p.ditampilkan}
                  <Eye size={16} />
                {:else}
                  <EyeOff size={16} />
                {/if}
              </button>
            </form>
            <a href="/pengumuman/{p.id}/edit" class="btn-icon" title="Edit Pengumuman" aria-label="Edit">
              <Pencil size={16} />
            </a>
            <form method="POST" action="?/hapus">
              <input type="hidden" name="id" value={p.id} />
              <button type="submit" class="btn-icon btn-icon-danger" title="Hapus Pengumuman" aria-label="Hapus">
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
  .pengumuman-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .pengumuman-card {
    background: var(--color-surface-raised);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    box-shadow: var(--shadow-card);
    transition: all 0.15s ease;
  }

  .pengumuman-card.is-hidden {
    opacity: 0.65;
    background: var(--color-surface);
    border-style: dashed;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.875rem;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  .draft-badge {
    font-size: 0.6875rem;
    color: var(--color-text-secondary);
    background: var(--color-surface-overlay);
    padding: 0.125rem 0.5rem;
    border-radius: var(--radius-full);
    border: 1px solid var(--color-border);
  }

  .card-date {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
  }

  .card-actions {
    display: flex;
    gap: 0.375rem;
    align-items: center;
  }

  .btn-icon {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    color: var(--color-text-secondary);
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
    transition: all 0.15s ease;
    text-decoration: none;
  }

  .btn-icon:hover {
    background: var(--color-surface-overlay);
    color: var(--color-text-primary);
    border-color: var(--color-border-strong);
  }

  .btn-icon-danger:hover {
    background: var(--color-danger-bg);
    color: var(--color-danger);
    border-color: oklch(0.56 0.20 25 / 0.25);
  }

  .card-title {
    font-size: 1.125rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    color: var(--color-text-primary);
    letter-spacing: -0.015em;
  }

  .card-content {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin: 0;
    white-space: pre-wrap;
  }
</style>
