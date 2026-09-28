<script lang="ts">
  import { page } from '$app/state';
  import { BOTTOM_NAV_ITEMS, isNavActive, type NavItem } from '$lib/nav';

  interface Props {
    /** Item dengan `href` kosong dianggap pemicu panel. */
    items?: NavItem[];
    /** Status aktif manual (kunci = `href` item). Kosongkan untuk pencocokan pathname. */
    activeKey?: string;
    panelOpen?: boolean;
    /** Path yang membuat item panel ikut aktif, mis. `/pengumuman`. */
    panelActivePaths?: readonly string[];
    onOpenPanel?: () => void;
    panelId?: string;
  }

  let {
    items = BOTTOM_NAV_ITEMS,
    activeKey,
    panelOpen = false,
    panelActivePaths = [],
    onOpenPanel,
    panelId
  }: Props = $props();

  function isItemActive(item: NavItem): boolean {
    if (activeKey !== undefined) return item.href === activeKey;
    return isNavActive(page.url.pathname, item.href);
  }

  const panelActive = $derived(
    panelOpen ||
      (activeKey !== undefined
        ? activeKey === ''
        : panelActivePaths.some((href) => isNavActive(page.url.pathname, href)))
  );
</script>

<nav
  class="bottom-nav"
  aria-label="Navigasi utama"
  style="--nav-cols: {items.length}"
>
  {#each items as item}
    {@const Icon = item.icon}
    {#if item.href}
      <a
        href={item.href}
        class="bottom-link"
        class:active={isItemActive(item)}
        aria-current={isItemActive(item) ? 'page' : undefined}
      >
        <Icon size={20} />
        <span class="bottom-label">{item.shortLabel ?? item.label}</span>
      </a>
    {:else}
      <button
        type="button"
        class="bottom-link"
        class:active={panelActive}
        aria-expanded={panelOpen}
        aria-controls={panelId}
        onclick={onOpenPanel}
      >
        <Icon size={20} />
        <span class="bottom-label">{item.shortLabel ?? item.label}</span>
      </button>
    {/if}
  {/each}
</nav>

<style>
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: var(--z-sidebar);
    display: grid;
    grid-template-columns: repeat(var(--nav-cols, 5), minmax(0, 1fr));
    background-color: var(--color-surface);
    border-top: 1px solid var(--color-border);
    padding-bottom: env(safe-area-inset-bottom);
  }

  .bottom-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    /* 44px lebih tinggi dari touch target minimum, label pendek tanpa ellipsis */
    min-height: var(--tap-min);
    padding: 0.375rem 0.25rem;
    background: none;
    border: none;
    border-top: 2px solid transparent;
    margin-top: -1px;
    font-family: inherit;
    font-size: var(--text-2xs);
    font-weight: 600;
    line-height: 1.2;
    color: var(--color-text-muted);
    text-decoration: none;
    cursor: pointer;
    transition: color 0.15s ease, border-color 0.15s ease;
  }

  .bottom-link:hover { color: var(--color-text); }

  .bottom-link.active {
    color: var(--color-accent);
    border-top-color: var(--color-accent);
  }

  /* >= 1024px: bar bawah berubah jadi baris navigasi di dalam kolom konten.
     Shell admin menyembunyikannya lewat wrapper-nya (sidebar yang pegang peran). */
  @media (min-width: 1024px) {
    .bottom-nav {
      position: static;
      /* Lebar mengikuti isi, bukan membagi kolom penuh — ini baris nav, bukan tab bar. */
      grid-template-columns: repeat(var(--nav-cols, 5), auto);
      justify-content: start;
      gap: var(--space-1);
      max-width: var(--content-max);
      margin: 0 auto;
      padding: var(--space-2) var(--space-8);
      border-top: none;
      border-bottom: 1px solid var(--color-border);
    }

    .bottom-link {
      flex-direction: row;
      gap: var(--space-2);
      margin-top: 0;
      min-height: var(--tap-min);
      padding: 0.5rem var(--space-3);
      border: 1px solid transparent;
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
    }

    .bottom-link:hover { background-color: var(--color-surface-muted); }

    .bottom-link.active {
      background-color: var(--color-accent);
      border-color: var(--color-accent);
      color: var(--color-accent-contrast);
    }
  }
</style>
