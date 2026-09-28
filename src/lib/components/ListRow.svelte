<script lang="ts">
  import type { Component, Snippet } from 'svelte';
  import { ChevronRight } from '@lucide/svelte';

  interface Props {
    href?: string;
    title: string;
    meta?: string;
    /** Nilai utama di kanan: nominal, jumlah, atau ringkasan. */
    value?: string;
    /** Versi ringkas untuk layar sempit, mis. "1,2jt" vs "Rp 1.250.000". */
    valueShort?: string;
    tone?: 'default' | 'success' | 'danger' | 'warning' | 'muted';
    icon?: Component<any>;
    /** Tambahan di area kiri-kanan, mis. badge status. */
    trailing?: Snippet;
    onclick?: (e: MouseEvent) => void;
    children?: Snippet;
  }

  let {
    href,
    title,
    meta,
    value,
    valueShort,
    tone = 'default',
    icon: Icon,
    trailing,
    onclick,
    children
  }: Props = $props();

  const iconSize = 16;
  const hasValue = $derived(!!value || !!valueShort);
</script>

{#if href}
  <a class="list-row" {href} {onclick}>
    {#if Icon}
      <span class="list-row-icon tone-{tone}"><Icon size={iconSize} /></span>
    {/if}
    <span class="list-row-text">
      <span class="list-row-title">{title}</span>
      {#if meta}<span class="list-row-meta">{meta}</span>{/if}
      {@render children?.()}
    </span>
    {#if hasValue}
      <span class="list-row-value tone-{tone}">
        {#if value}<span class="value-full">{value}</span>{/if}
        {#if valueShort}<span class="value-short">{valueShort}</span>{/if}
      </span>
    {/if}
    {#if trailing}{@render trailing()}{/if}
    <ChevronRight class="list-row-chevron" size={16} />
  </a>
{:else}
  <div class="list-row">
    {#if Icon}
      <span class="list-row-icon tone-{tone}"><Icon size={iconSize} /></span>
    {/if}
    <span class="list-row-text">
      <span class="list-row-title">{title}</span>
      {#if meta}<span class="list-row-meta">{meta}</span>{/if}
      {@render children?.()}
    </span>
    {#if hasValue}
      <span class="list-row-value tone-{tone}">
        {#if value}<span class="value-full">{value}</span>{/if}
        {#if valueShort}<span class="value-short">{valueShort}</span>{/if}
      </span>
    {/if}
    {#if trailing}{@render trailing()}{/if}
  </div>
{/if}

<style>
  .list-row {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    min-height: 3.25rem;
    padding: var(--space-2) var(--space-3);
    min-width: 0;
    text-decoration: none;
    color: inherit;
    border-radius: var(--radius-md);
    transition: background-color 0.15s ease;
  }
  a.list-row:hover { background-color: var(--color-surface-muted); }

  .list-row-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    flex-shrink: 0;
    border-radius: var(--radius-full);
    background-color: var(--color-surface-muted);
    color: var(--color-text-muted);
  }
  .list-row-icon.tone-success { background-color: var(--color-success-bg); color: var(--color-success); }
  .list-row-icon.tone-danger  { background-color: var(--color-danger-bg);  color: var(--color-danger); }
  .list-row-icon.tone-warning { background-color: var(--color-warning-bg); color: var(--color-warning); }

  .list-row-text {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    flex: 1;
    min-width: 0;
  }

  .list-row-title {
    font-size: var(--text-sm);
    font-weight: 600;
    line-height: var(--leading-snug);
    color: var(--color-text);
    overflow-wrap: anywhere;
  }

  .list-row-meta {
    font-size: var(--text-xs);
    line-height: var(--leading-snug);
    color: var(--color-text-muted);
  }

  .list-row-value {
    flex-shrink: 0;
    font-size: var(--text-sm);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    text-align: right;
    color: var(--color-text);
  }
  .list-row-value.tone-success { color: var(--color-success); }
  .list-row-value.tone-danger  { color: var(--color-danger); }
  .list-row-value.tone-warning { color: var(--color-warning); }
  .list-row-value.tone-muted   { color: var(--color-text-muted); }

  .list-row-chevron {
    flex-shrink: 0;
    color: var(--color-text-disabled);
  }

  /* Nominal penuh di desktop, ringkas di layar sempit — tanpa ellipsis. */
  .value-short { display: none; }

  @media (max-width: 1023px) {
    .value-full { display: none; }
    .value-short { display: inline; }
  }
</style>
