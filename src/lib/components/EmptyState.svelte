<script lang="ts">
  import type { Component, Snippet } from 'svelte';
  import { Inbox } from '@lucide/svelte';

  interface Props {
    message?: string;
    description?: string;
    /** Ikon kustom; default Inbox. */
    icon?: Component<any>;
    /** Varian rapat untuk dipakai di dalam kartu. */
    compact?: boolean;
    children?: Snippet;
  }

  let {
    message = 'Belum ada data',
    description,
    icon: Icon = Inbox,
    compact = false,
    children
  }: Props = $props();
</script>

<div class="empty-state" class:compact>
  <span class="empty-icon" aria-hidden="true">
    <Icon size={compact ? 20 : 26} />
  </span>
  <p class="empty-message">{message}</p>
  {#if description}
    <p class="empty-description">{description}</p>
  {/if}
  {#if children}
    <div class="empty-actions">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: var(--space-10) var(--space-5);
  }
  .empty-state.compact {
    padding: var(--space-6) var(--space-4);
    gap: 0;
  }

  .empty-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    margin-bottom: var(--space-4);
    border-radius: var(--radius-full);
    background-color: var(--color-surface-muted);
    color: var(--color-text-muted);
  }
  .compact .empty-icon {
    width: 2.5rem;
    height: 2.5rem;
    margin-bottom: var(--space-3);
  }

  .empty-message {
    margin: 0;
    font-size: var(--text-base);
    font-weight: 600;
    line-height: var(--leading-snug);
    color: var(--color-text);
  }
  .compact .empty-message { font-size: var(--text-sm); }

  .empty-description {
    margin: var(--space-1) 0 0;
    max-width: 26rem;
    font-size: var(--text-sm);
    line-height: var(--leading-normal);
    color: var(--color-text-muted);
  }

  .empty-actions {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
    justify-content: center;
    margin-top: var(--space-5);
  }
  .compact .empty-actions { margin-top: var(--space-4); }
</style>
