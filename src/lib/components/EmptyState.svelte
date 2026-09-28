<script lang="ts">
  import { Inbox } from '@lucide/svelte';

  interface Props {
    message?: string;
    description?: string;
    children?: any;
  }

  let {
    message = 'Belum ada data',
    description = 'Mulai dengan menambahkan data pertama Anda.',
    children
  }: Props = $props();
</script>

<div class="empty-state">
  <div class="empty-icon-box">
    <Inbox size={28} />
  </div>
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
    justify-content: center;
    padding: 3.5rem 1.5rem;
    text-align: center;
    background: var(--color-surface-raised);
    border: 1px dashed var(--color-border-strong);
    border-radius: var(--radius-lg);
    margin: 1rem 0;
  }

  .empty-icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.25rem;
    height: 3.25rem;
    border-radius: var(--radius-full);
    background: var(--color-brand-50);
    color: var(--color-brand-600);
    margin-bottom: 1rem;
  }

  .empty-message {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 0.25rem;
  }

  .empty-description {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin: 0 0 1.25rem;
    max-width: 24rem;
    line-height: 1.4;
  }

  .empty-actions {
    display: flex;
    gap: 0.5rem;
  }
</style>
