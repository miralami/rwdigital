<script lang="ts">
  import type { Component } from 'svelte';

  interface Props {
    title: string;
    value: string | number;
    description?: string;
    icon?: Component<any>;
    trend?: {
      direction: 'up' | 'down' | 'neutral';
      text: string;
    };
    variant?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
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
</script>

<svelte:element
  this={href ? 'a' : 'div'}
  {href}
  class="stat-card variant-{variant}"
  class:is-link={!!href}
>
  <div class="stat-top">
    <span class="stat-title">{title}</span>
    {#if Icon}
      <div class="stat-icon-wrap">
        <Icon size={20} />
      </div>
    {/if}
  </div>

  <div class="stat-middle">
    <span class="stat-value">{value}</span>
  </div>

  {#if description || trend}
    <div class="stat-bottom">
      {#if trend}
        <span class="stat-trend trend-{trend.direction}">
          {trend.text}
        </span>
      {/if}
      {#if description}
        <span class="stat-description">{description}</span>
      {/if}
    </div>
  {/if}
</svelte:element>

<style>
  .stat-card {
    display: flex;
    flex-direction: column;
    padding: 1.25rem;
    background: var(--color-surface-raised);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    text-decoration: none;
    color: inherit;
    position: relative;
    overflow: hidden;
  }

  .stat-card.is-link:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-brand-300);
  }

  .stat-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .stat-title {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .stat-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--radius-md);
    background: var(--color-brand-50);
    color: var(--color-brand-700);
    flex-shrink: 0;
  }

  .variant-brand .stat-icon-wrap {
    background: var(--color-brand-100);
    color: var(--color-brand-800);
  }

  .variant-success .stat-icon-wrap {
    background: var(--color-success-bg);
    color: var(--color-success);
  }

  .variant-warning .stat-icon-wrap {
    background: var(--color-warning-bg);
    color: var(--color-warning);
  }

  .variant-danger .stat-icon-wrap {
    background: var(--color-danger-bg);
    color: var(--color-danger);
  }

  .stat-middle {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-text-primary);
    line-height: 1.2;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }

  .stat-bottom {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.625rem;
    font-size: 0.75rem;
    flex-wrap: wrap;
  }

  .stat-description {
    color: var(--color-text-secondary);
  }

  .stat-trend {
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.375rem;
    border-radius: var(--radius-xs);
  }

  .trend-up {
    background: var(--color-success-bg);
    color: var(--color-success);
  }

  .trend-down {
    background: var(--color-danger-bg);
    color: var(--color-danger);
  }

  .trend-neutral {
    background: var(--color-surface-overlay);
    color: var(--color-text-secondary);
  }
</style>
