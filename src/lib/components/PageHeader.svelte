<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    subtitle?: string;
    badge?: string;
    children?: Snippet;
  }

  let { title, subtitle, badge, children }: Props = $props();
</script>

<div class="page-header">
  <div class="page-header-text">
    <div class="title-row">
      <h1>{title}</h1>
      {#if badge}
        <span class="header-badge">{badge}</span>
      {/if}
    </div>
    {#if subtitle}
      <p>{subtitle}</p>
    {/if}
  </div>
  {#if children}
    <div class="page-header-actions">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-4);
    flex-wrap: wrap;
    margin-bottom: var(--space-6);
  }

  .page-header-text {
    flex: 1;
    min-width: 0;
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  h1 {
    margin: 0;
    font-size: var(--text-2xl);
    font-weight: 700;
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--color-text);
  }

  .header-badge {
    padding: 0.125rem 0.5rem;
    font-size: var(--text-xs);
    font-weight: 600;
    line-height: 1.4;
    color: var(--color-accent);
    background-color: var(--color-brand-50);
    border: 1px solid var(--color-brand-200);
    border-radius: var(--radius-sm);
  }

  p {
    margin: var(--space-1) 0 0;
    max-width: 62ch;
    font-size: var(--text-sm);
    line-height: var(--leading-normal);
    color: var(--color-text-muted);
  }

  .page-header-actions {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
    align-items: center;
  }

  @media (max-width: 640px) {
    h1 { font-size: var(--text-xl); }
    .page-header-actions { width: 100%; }
  }
</style>
