<script lang="ts">
  type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand';

  interface Props {
    variant?: Variant;
    dot?: boolean;
    children?: any;
  }

  let { variant = 'default', dot = false, children }: Props = $props();
</script>

<span
  class="badge variant-{variant}"
  class:has-dot={dot}
>
  {#if dot}
    <span class="badge-dot" aria-hidden="true"></span>
  {/if}
  {@render children()}
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.15rem 0.55rem;
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.3;
    white-space: nowrap;
    border: 1px solid transparent;
  }

  .badge-dot {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: var(--radius-full);
    background-color: currentColor;
  }

  .variant-default {
    background: var(--color-surface-raised);
    color: var(--color-text-secondary);
    border-color: var(--color-border);
  }

  .variant-success {
    background: var(--color-success-bg);
    color: var(--color-success);
    border-color: oklch(0.58 0.16 148 / 0.25);
  }

  .variant-warning {
    background: var(--color-warning-bg);
    color: oklch(0.60 0.16 75);
    border-color: oklch(0.74 0.15 75 / 0.3);
  }

  .variant-danger {
    background: var(--color-danger-bg);
    color: var(--color-danger);
    border-color: oklch(0.56 0.20 25 / 0.25);
  }

  .variant-info {
    background: var(--color-info-bg);
    color: var(--color-info);
    border-color: oklch(0.58 0.15 240 / 0.25);
  }

  .variant-brand {
    background: var(--color-brand-50);
    color: var(--color-brand-800);
    border-color: var(--color-brand-200);
  }
</style>
