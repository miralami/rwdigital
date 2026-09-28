<script lang="ts">
  import type { Snippet } from 'svelte';
  import { ChevronRight } from '@lucide/svelte';

  interface Props {
    title?: string;
    description?: string;
    /** Tautan "lihat semua" di kanan header. */
    actionHref?: string;
    actionLabel?: string;
    /** Warna status untuk kartu yang isinya sebuah kondisi (mis. tagihan). */
    tone?: 'default' | 'success' | 'warning';
    /** true = isi rapat dengan padding penuh; false = caller yang mengatur jarak. */
    padded?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    title,
    description,
    actionHref,
    actionLabel = 'Lihat semua',
    tone = 'default',
    padded = true,
    class: className = '',
    children
  }: Props = $props();
</script>

<section class="card card-block tone-{tone} {className}">
  {#if title}
    <header class="card-head">
      <div class="card-head-text">
        <h2 class="card-title">{title}</h2>
        {#if description}<p class="card-description">{description}</p>{/if}
      </div>
      {#if actionHref}
        <a class="card-action" href={actionHref}>
          {actionLabel}
          <ChevronRight size={15} />
        </a>
      {/if}
    </header>
  {/if}

  <div class="card-body" class:card-body-flush={!padded}>
    {@render children?.()}
  </div>
</section>

<style>
  .card-block {
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
  }

  /* Kartu berstatus: warna isi, bukan warna merah. Hijau = lunas, kuning = perlu bayar. */
  .tone-success {
    background-color: var(--color-success-bg);
    border-color: color-mix(in oklab, var(--color-success) 32%, transparent);
  }
  .tone-warning {
    background-color: var(--color-warning-bg);
    border-color: color-mix(in oklab, var(--color-warning) 38%, transparent);
  }
  .tone-success .card-head { background-color: transparent; }
  .tone-warning .card-head { background-color: transparent; }

  .card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-5);
    border-bottom: 1px solid var(--color-border);
    background-color: var(--color-surface);
  }

  .card-head-text {
    min-width: 0;
  }

  .card-title {
    margin: 0;
    font-size: var(--text-base);
    font-weight: 600;
    line-height: var(--leading-snug);
    letter-spacing: var(--tracking-tight);
    color: var(--color-text);
  }

  .card-description {
    margin: 0.125rem 0 0;
    font-size: var(--text-xs);
    line-height: var(--leading-snug);
    color: var(--color-text-muted);
  }

  .card-action {
    display: inline-flex;
    align-items: center;
    gap: 0.125rem;
    flex-shrink: 0;
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--color-accent);
    text-decoration: none;
    white-space: nowrap;
  }
  .card-action:hover { color: var(--color-accent-hover); text-decoration: underline; }

  .card-body {
    flex: 1;
    padding: var(--space-2);
    min-width: 0;
  }
  .card-body-flush { padding: 0; }
</style>
