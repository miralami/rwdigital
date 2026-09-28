<script lang="ts">
  import { page } from '$app/state';
  import ProfileBlock from './ProfileBlock.svelte';
  import { SIDEBAR_NAV_ITEMS, isNavActive } from '$lib/nav';

  interface Props {
    user?: { name?: string; email?: string; role?: string } | null;
    onLogout: () => void;
  }

  let { user, onLogout }: Props = $props();
</script>

<aside class="sidebar">
  <div class="sidebar-brand">
    <span class="brand-mark" aria-hidden="true">RW</span>
    <span class="brand-text">
      <span class="brand-name">RW Digital</span>
      <span class="brand-sub">Portal administrasi</span>
    </span>
  </div>

  <nav class="sidebar-nav" aria-label="Menu utama">
    {#each SIDEBAR_NAV_ITEMS as item}
      {@const Icon = item.icon}
      <a
        href={item.href}
        class="sidebar-link"
        class:active={isNavActive(page.url.pathname, item.href)}
        aria-current={isNavActive(page.url.pathname, item.href) ? 'page' : undefined}
      >
        <Icon size={18} />
        <span>{item.label}</span>
      </a>
    {/each}
  </nav>

  <div class="sidebar-footer">
    <ProfileBlock {user} {onLogout} />
  </div>
</aside>

<style>
  .sidebar {
    display: none;
    position: sticky;
    top: 0;
    flex-direction: column;
    width: var(--sidebar-width);
    height: 100dvh;
    background-color: var(--color-surface);
    border-right: 1px solid var(--color-border);
  }

  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    height: var(--header-height);
    padding: 0 var(--space-4);
    flex-shrink: 0;
    border-bottom: 1px solid var(--color-border);
  }

  .brand-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    flex-shrink: 0;
    border-radius: var(--radius-md);
    background-color: var(--color-accent);
    color: var(--color-accent-contrast);
    font-size: var(--text-xs);
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .brand-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .brand-name {
    font-size: var(--text-sm);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: var(--tracking-tight);
    color: var(--color-text);
  }

  .brand-sub {
    font-size: var(--text-xs);
    line-height: 1.2;
    color: var(--color-text-muted);
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    padding: var(--space-4) var(--space-3);
    flex: 1;
    overflow-y: auto;
  }

  .sidebar-link {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    min-height: 2.75rem;
    padding: 0.5rem var(--space-3);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text-muted);
    text-decoration: none;
    transition: background-color 0.15s ease, color 0.15s ease;
  }
  .sidebar-link :global(svg) { color: var(--color-text-muted); }
  .sidebar-link:hover {
    background-color: var(--color-surface-muted);
    color: var(--color-text);
  }
  .sidebar-link:hover :global(svg) { color: var(--color-text); }

  .sidebar-link.active {
    background-color: var(--color-accent);
    color: var(--color-accent-contrast);
  }
  .sidebar-link.active :global(svg) { color: var(--color-accent-contrast); }

  .sidebar-footer {
    padding: var(--space-3);
    flex-shrink: 0;
    border-top: 1px solid var(--color-border);
  }

  @media (min-width: 1024px) {
    .sidebar { display: flex; }
  }
</style>
