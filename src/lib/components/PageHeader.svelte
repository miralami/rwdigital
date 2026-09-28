<script lang="ts">
  interface Props {
    title: string;
    subtitle?: string;
    badge?: string;
    children?: any;
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
    gap: 1.25rem;
    margin-bottom: 1.75rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--color-border);
    flex-wrap: wrap;
  }

  .page-header-text {
    flex: 1;
    min-width: 240px;
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  h1 {
    font-size: 1.625rem;
    font-weight: 700;
    margin: 0;
    color: var(--color-text-primary);
    letter-spacing: -0.025em;
    line-height: 1.25;
  }

  .header-badge {
    font-size: 0.6875rem;
    font-weight: 600;
    padding: 0.2rem 0.5rem;
    background: var(--color-brand-100);
    color: var(--color-brand-800);
    border-radius: var(--radius-full);
  }

  .page-header-text p {
    margin: 0.375rem 0 0;
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    line-height: 1.4;
  }

  .page-header-actions {
    display: flex;
    gap: 0.625rem;
    align-items: center;
    flex-wrap: wrap;
  }
</style>
