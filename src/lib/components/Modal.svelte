<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { X } from '@lucide/svelte';

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
    background: oklch(0.1 0.02 250 / 0.5);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal);
    padding: 1rem;
  }

  .modal-panel {
    background: var(--color-surface-raised);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
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
    padding: 1.125rem 1.5rem;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-surface);
  }

  h2 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-text-primary);
    letter-spacing: -0.01em;
  }

  .modal-close {
    background: transparent;
    border: 1px solid transparent;
    color: var(--color-text-secondary);
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: var(--radius-md);
    transition: all 0.15s ease;
  }

  .modal-close:hover {
    color: var(--color-text-primary);
    background: var(--color-surface-overlay);
    border-color: var(--color-border);
  }

  .modal-body {
    padding: 1.5rem;
  }
</style>
