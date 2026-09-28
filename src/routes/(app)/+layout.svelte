<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { signOut } from '$lib/auth-client';
  import {
    LayoutDashboard,
    Users,
    Wallet,
    Receipt,
    Megaphone,
    LogOut,
    Building2,
    ShieldCheck
  } from '@lucide/svelte';

  let { data, children } = $props<{ data: { user?: { name?: string; email?: string; role?: string } }, children: any }>();

  const navItems = [
    { href: '/dashboard',   label: 'Beranda',    icon: LayoutDashboard },
    { href: '/warga',       label: 'Warga',      icon: Users },
    { href: '/kas',         label: 'Kas RW',     icon: Wallet },
    { href: '/iuran',       label: 'Iuran',      icon: Receipt },
    { href: '/pengumuman',  label: 'Pengumuman', icon: Megaphone },
  ];

  function isActive(href: string) {
    if (href === '/dashboard') {
      return page.url.pathname === '/dashboard';
    }
    return page.url.pathname.startsWith(href);
  }

  function formatRole(role?: string) {
    if (!role) return 'Warga';
    const map: Record<string, string> = {
      admin_rw: 'Admin RW',
      pengurus_rt: 'Pengurus RT',
      bendahara: 'Bendahara',
      warga: 'Warga'
    };
    return map[role] ?? role;
  }

  async function handleLogout() {
    await signOut();
    goto('/login');
  }
</script>

<div class="app-shell">
  <!-- Sidebar — desktop only -->
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="brand-badge">
        <Building2 size={20} class="brand-icon" />
      </div>
      <div class="brand-text">
        <span class="brand-title">RW Digital</span>
        <span class="brand-tag">Portal Administrasi</span>
      </div>
    </div>

    <nav class="sidebar-nav" aria-label="Menu Utama">
      <div class="nav-section-label">Navigasi Utama</div>
      {#each navItems as item}
        {@const Icon = item.icon}
        <a
          href={item.href}
          class="nav-link"
          class:active={isActive(item.href)}
          aria-current={isActive(item.href) ? 'page' : undefined}
        >
          <span class="nav-icon-box">
            <Icon size={18} />
          </span>
          <span class="nav-label">{item.label}</span>
          {#if isActive(item.href)}
            <span class="nav-indicator"></span>
          {/if}
        </a>
      {/each}
    </nav>

    <!-- User Profile & Session Footer -->
    <div class="sidebar-footer">
      <div class="user-card">
        <div class="user-avatar">
          {data.user?.name ? data.user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div class="user-info">
          <span class="user-name" title={data.user?.name}>{data.user?.name ?? 'Pengurus'}</span>
          <span class="user-role">
            <ShieldCheck size={12} />
            {formatRole(data.user?.role)}
          </span>
        </div>
        <button
          type="button"
          onclick={handleLogout}
          class="btn-logout"
          title="Keluar dari akun"
          aria-label="Keluar"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  </aside>

  <!-- Mobile Topbar -->
  <header class="mobile-header">
    <div class="mobile-brand">
      <div class="brand-badge mobile-badge">
        <Building2 size={18} />
      </div>
      <span class="brand-title">RW Digital</span>
    </div>
    <div class="mobile-user-status">
      <span class="mobile-role-pill">{formatRole(data.user?.role)}</span>
      <button
        type="button"
        onclick={handleLogout}
        class="mobile-logout-btn"
        title="Keluar"
        aria-label="Keluar"
      >
        <LogOut size={16} />
      </button>
    </div>
  </header>

  <!-- Main content -->
  <main class="main-content">
    <div class="content-container">
      {@render children()}
    </div>
  </main>

  <!-- Bottom nav — mobile only -->
  <nav class="bottom-nav" aria-label="Navigasi mobile">
    {#each navItems as item}
      {@const Icon = item.icon}
      <a
        href={item.href}
        class="bottom-nav-item"
        class:active={isActive(item.href)}
        aria-current={isActive(item.href) ? 'page' : undefined}
      >
        <span class="bottom-nav-icon">
          <Icon size={20} />
        </span>
        <span class="bottom-nav-label">{item.label}</span>
      </a>
    {/each}
  </nav>
</div>

<style>
  .app-shell {
    display: grid;
    grid-template-columns: var(--sidebar-width) 1fr;
    grid-template-rows: 1fr;
    min-height: 100dvh;
    background-color: var(--color-surface);
  }

  /* ─── Desktop Sidebar ─── */
  .sidebar {
    position: sticky;
    top: 0;
    height: 100dvh;
    background: linear-gradient(180deg, var(--color-brand-950) 0%, var(--color-brand-900) 100%);
    border-right: 1px solid oklch(0.25 0.05 255 / 0.4);
    color: var(--color-text-inverse);
    display: flex;
    flex-direction: column;
    z-index: var(--z-sidebar);
    overflow-y: auto;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.25rem 1rem;
    border-bottom: 1px solid oklch(1 0 0 / 0.08);
  }

  .brand-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--radius-md);
    background: linear-gradient(135deg, var(--color-brand-500) 0%, var(--color-brand-700) 100%);
    color: #fff;
    box-shadow: 0 2px 6px oklch(0 0 0 / 0.25);
    flex-shrink: 0;
  }

  .brand-text {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .brand-title {
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: -0.02em;
    color: #fff;
    line-height: 1.2;
  }

  .brand-tag {
    font-size: 0.6875rem;
    color: oklch(0.75 0.04 255);
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    padding: 1rem 0.75rem;
    flex: 1;
  }

  .nav-section-label {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: oklch(0.65 0.04 255);
    padding: 0.25rem 0.5rem;
    margin-bottom: 0.25rem;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.75rem;
    border-radius: var(--radius-md);
    color: oklch(0.85 0.03 255);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    position: relative;
    transition: all 0.15s ease-in-out;
  }

  .nav-link:hover {
    background: oklch(1 0 0 / 0.07);
    color: #fff;
    transform: translateX(2px);
  }

  .nav-link.active {
    background: linear-gradient(90deg, oklch(1 0 0 / 0.14) 0%, oklch(1 0 0 / 0.06) 100%);
    color: #fff;
    font-weight: 600;
  }

  .nav-icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: oklch(0.75 0.05 255);
    transition: color 0.15s ease;
  }

  .nav-link:hover .nav-icon-box,
  .nav-link.active .nav-icon-box {
    color: #fff;
  }

  .nav-label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nav-indicator {
    width: 4px;
    height: 18px;
    border-radius: 999px;
    background-color: var(--color-brand-400);
    position: absolute;
    right: 8px;
  }

  /* ─── Sidebar Footer ─── */
  .sidebar-footer {
    padding: 0.75rem;
    border-top: 1px solid oklch(1 0 0 / 0.08);
    background: oklch(0 0 0 / 0.15);
  }

  .user-card {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.5rem;
    border-radius: var(--radius-md);
    background: oklch(1 0 0 / 0.05);
    border: 1px solid oklch(1 0 0 / 0.06);
  }

  .user-avatar {
    width: 2rem;
    height: 2rem;
    border-radius: var(--radius-full);
    background: var(--color-brand-600);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.8125rem;
    flex-shrink: 0;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .user-name {
    font-size: 0.8125rem;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
  }

  .user-role {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.6875rem;
    color: oklch(0.75 0.05 255);
  }

  .btn-logout {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: oklch(0.75 0.04 255);
    padding: 0.375rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .btn-logout:hover {
    background: oklch(1 0 0 / 0.1);
    color: #fff;
  }

  /* ─── Main Content Shell ─── */
  .main-content {
    grid-column: 2;
    overflow-y: auto;
    background-color: var(--color-surface);
    display: flex;
    flex-direction: column;
  }

  .content-container {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 1.75rem 2rem;
    flex: 1;
  }

  /* ─── Mobile Header ─── */
  .mobile-header {
    display: none;
  }

  /* ─── Bottom nav ─── */
  .bottom-nav {
    display: none;
  }

  /* ─── Responsive ─── */
  @media (max-width: 768px) {
    .app-shell {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      padding-bottom: var(--bottomnav-height);
    }

    .sidebar {
      display: none;
    }

    .mobile-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      background: linear-gradient(90deg, var(--color-brand-950) 0%, var(--color-brand-900) 100%);
      color: #fff;
      border-bottom: 1px solid oklch(0.25 0.05 255 / 0.4);
      position: sticky;
      top: 0;
      z-index: var(--z-sidebar);
    }

    .mobile-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .mobile-badge {
      width: 1.875rem;
      height: 1.875rem;
    }

    .mobile-user-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .mobile-role-pill {
      font-size: 0.6875rem;
      font-weight: 600;
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-full);
      background: oklch(1 0 0 / 0.12);
      color: #fff;
    }

    .mobile-logout-btn {
      background: transparent;
      border: none;
      color: oklch(0.85 0.03 255);
      padding: 0.375rem;
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .main-content {
      grid-column: 1;
    }

    .content-container {
      padding: 1rem;
    }

    .bottom-nav {
      display: flex;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: var(--bottomnav-height);
      background: var(--color-surface-raised);
      border-top: 1px solid var(--color-border);
      z-index: var(--z-sidebar);
      padding-bottom: env(safe-area-inset-bottom);
      box-shadow: 0 -2px 10px oklch(0 0 0 / 0.05);
    }

    .bottom-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      flex: 1;
      padding: 0.375rem 0;
      text-decoration: none;
      color: var(--color-text-secondary);
      transition: color 0.15s ease;
    }

    .bottom-nav-item.active {
      color: var(--color-brand-700);
      font-weight: 600;
    }

    .bottom-nav-label {
      font-size: 0.6875rem;
      letter-spacing: -0.01em;
    }
  }
</style>
