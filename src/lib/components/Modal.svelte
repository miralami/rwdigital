<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import X from '@lucide/svelte/icons/x';

  interface Props {
    open: boolean;
    title: string;
    children?: any;
    onClose?: () => void;
  }

  let { open, title, children, onClose }: Props = $props();

  const dispatch = createEventDispatcher<{ close: void }>();

  function handleClose() {
    dispatch('close');
    onClose?.();
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) handleClose();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') handleClose();
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    class="modal-backdrop"
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
    role="presentation"
  >
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-panel" role="dialog" aria-modal="true" aria-label={title}>
      <div class="modal-header">
        <h2>{title}</h2>
        <button class="modal-close" onclick={handleClose} aria-label="Tutup dialog">
          <X size={18} />
        </button>
      </div>
      <div class="modal-body">
        {@render children()}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: oklch(0.15 0.02 262 / 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal);
    padding: var(--space-4);
  }

  .modal-panel {
    background: var(--color-surface-raised);
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 32rem;
    max-height: 90dvh;
    overflow-y: auto;
    box-shadow: var(--shadow-modal);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-5);
    border-bottom: 1px solid var(--color-border);
  }

  h2 {
    font-size: var(--text-lg);
    font-weight: 600;
    margin: 0;
    color: var(--color-text-primary);
    letter-spacing: var(--tracking-tight);
  }

  .modal-close {
    background: transparent;
    border: 1px solid transparent;
    color: var(--color-text-secondary);
    width: 2.25rem;
    height: 2.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: var(--radius-md);
    transition: color 0.15s ease, background-color 0.15s ease;
  }

  .modal-close:hover {
    color: var(--color-text-primary);
    background: var(--color-surface-overlay);
    border-color: var(--color-border);
  }

  .modal-body {
    padding: var(--space-5);
  }
</style>
