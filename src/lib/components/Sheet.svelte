<script lang="ts">
  import type { Snippet } from 'svelte';
  import X from '@lucide/svelte/icons/x';

  interface Props {
    open: boolean;
    /** Id untuk pasangan `aria-controls` di pemicunya. */
    id: string;
    title: string;
    onClose: () => void;
    footer?: Snippet;
    children?: Snippet;
  }

  let { open, id, title, onClose, footer, children }: Props = $props();

  let panel: HTMLElement | undefined = $state();

  $effect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    // Fokus masuk ke panel supaya keyboard user tidak tertinggal di belakang.
    panel?.focus();

    return () => window.removeEventListener('keydown', onKey);
  });
</script>

{#if open}
  <button
    type="button"
    class="sheet-backdrop"
    aria-label="Tutup {title.toLowerCase()}"
    onclick={onClose}
  ></button>

  <div
    class="sheet"
    {id}
    role="dialog"
    aria-modal="true"
    aria-labelledby="{id}-title"
    tabindex="-1"
    bind:this={panel}
  >
    <div class="sheet-head">
      <h2 class="sheet-title" id="{id}-title">{title}</h2>
      <button type="button" class="sheet-close" aria-label="Tutup" onclick={onClose}>
        <X size={18} />
      </button>
    </div>

    <div class="sheet-body">
      {@render children?.()}
    </div>

    {#if footer}
      <div class="sheet-footer">
        {@render footer()}
      </div>
    {/if}
  </div>
{/if}

<style>
  .sheet-backdrop {
    position: fixed;
    inset: 0;
    z-index: var(--z-dropdown);
    background: oklch(0.15 0.02 262 / 0.45);
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .sheet {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: var(--z-modal);
    max-height: 85dvh;
    overflow-y: auto;
    padding: var(--space-4) var(--space-4) calc(var(--space-4) + env(safe-area-inset-bottom));
    background-color: var(--color-surface);
    border-top: 1px solid var(--color-border);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    box-shadow: var(--shadow-lg);
  }

  .sheet:focus { outline: none; }

  .sheet-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    margin-bottom: var(--space-3);
  }

  .sheet-title {
    margin: 0;
    font-size: var(--text-base);
    font-weight: 700;
    color: var(--color-text);
  }

  .sheet-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--tap-min);
    height: var(--tap-min);
    background: none;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-muted);
    cursor: pointer;
  }
  .sheet-close:hover {
    color: var(--color-text);
    background-color: var(--color-surface-muted);
  }

  .sheet-body {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .sheet-footer {
    margin-top: var(--space-3);
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border);
  }

  /* Di layar lebar portal jadi kolom sempit, jadi sheet-nya jadi dialog
    terpusat, bukan membentang mengikuti seluruh viewport. */
  @media (min-width: 1024px) {
    .sheet {
      left: 50%;
      right: auto;
      bottom: var(--space-8);
      width: min(32rem, calc(100% - var(--space-8)));
      transform: translateX(-50%);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
    }
  }
</style>
