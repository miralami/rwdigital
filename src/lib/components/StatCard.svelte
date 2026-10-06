<script lang="ts">
  import type { Component } from 'svelte';
  import TrendingUp from '@lucide/svelte/icons/trending-up';
  import TrendingDown from '@lucide/svelte/icons/trending-down';
  import Minus from '@lucide/svelte/icons/minus';

  interface Props {
    title: string;
    value: string | number;
    /** Baris pendukung di bawah nilai, mis. "Rp 1,2 jt". */
    description?: string;
    icon?: Component<any>;
    trend?: {
      direction: 'up' | 'down' | 'neutral';
      text: string;
    };
    variant?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'hero';
    href?: string;
  }

  let {
    title,
    value,
    description,
    icon: Icon,
    trend,
    variant = 'default',
    href
  }: Props = $props();

  const trendIcon = $derived(
    trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus
  );
</script>

<svelte:element
  this={href ? 'a' : 'div'}
  {href}
  class="stat-card variant-{variant}"
  class:is-link={!!href}
>
  <span class="stat-title">{title}</span>

  <span class="stat-value">{value}</span>

  {#if description || trend}
    <span class="stat-foot">
      {#if trend}
        {@const TrendIcon = trendIcon}
        <span class="stat-trend trend-{trend.direction}">
          <TrendIcon size={13} />
          {trend.text}
        </span>
      {/if}
      {#if description}
        <span class="stat-description">{description}</span>
      {/if}
    </span>
  {/if}

  {#if Icon}
    <span class="stat-icon" aria-hidden="true"><Icon size={20} /></span>
  {/if}
</svelte:element>

<style>
  .stat-card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: var(--space-4) var(--space-5);
    min-width: 0;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    text-decoration: none;
    color: inherit;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .stat-card.is-link:hover {
    border-color: var(--color-brand-200);
    box-shadow: var(--shadow-sm);
  }

  .stat-title {
    font-size: var(--text-xs);
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--color-text-muted);
  }

  .stat-value {
    font-size: var(--text-4xl);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--color-text);
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }

  .stat-foot {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
    min-width: 0;
  }

  .stat-description {
    font-size: var(--text-sm);
    line-height: 1.4;
    color: var(--color-text-muted);
  }

  .stat-trend {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: var(--text-xs);
    font-weight: 600;
  }
  .trend-up   { color: var(--color-success); }
  .trend-down { color: var(--color-danger); }
  .trend-neutral { color: var(--color-text-muted); }

  /* Aksen status: tipis dan hanya di nilai, bukan di seluruh kartu. */
  .variant-success .stat-value { color: var(--color-success); }
  .variant-danger  .stat-value { color: var(--color-danger); }
  .variant-warning .stat-value { color: var(--color-warning); }
  .variant-brand   .stat-value { color: var(--color-accent); }
  .variant-warning::before,
  .variant-danger::before,
  .variant-success::before,
  .variant-brand::before {
    content: '';
    position: absolute;
    inset: -1px auto -1px -1px;
    width: 3px;
    border-radius: var(--radius-lg) 0 0 var(--radius-lg);
  }
  .variant-warning::before { background: var(--color-warning); }
  .variant-danger::before  { background: var(--color-danger); }
  .variant-success::before { background: var(--color-success); }
  .variant-brand::before   { background: var(--color-accent); }

  /* Ikon hanya untuk stat card di halaman lain yang membutuhkannya. */
  .stat-icon {
    position: absolute;
    top: var(--space-4);
    right: var(--space-5);
    color: var(--color-brand-200);
  }

    /* Varian hero: kartu menonjol hanya di layar sempit. Di desktop ia
       identik dengan kartu biasa supaya baris KPI tetap seragam. */
  @media (max-width: 1023px) {
    .stat-card { padding: var(--space-4); }
    .stat-value { font-size: var(--text-3xl); }

    .variant-hero {
      background: var(--color-accent);
      border-color: var(--color-accent);
      box-shadow: none;
    }
    .variant-hero .stat-title { color: color-mix(in oklab, var(--color-accent-contrast) 75%, transparent); }
    .variant-hero .stat-value,
    .variant-hero .stat-description { color: var(--color-accent-contrast); }
    .variant-hero::before { display: none; }
  }
</style>
