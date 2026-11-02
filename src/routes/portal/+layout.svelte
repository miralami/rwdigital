<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { signOut } from '$lib/auth-client';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import ProfileBlock from '$lib/components/ProfileBlock.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import Bell from '@lucide/svelte/icons/bell';
  import CheckCheck from '@lucide/svelte/icons/check-check';
  import {
    PORTAL_NAV_ITEMS,
    PORTAL_SECTION_HREF,
    PORTAL_SECTIONS,
    type PortalSection
  } from '$lib/nav';
  import { formatTanggalPanjang, inisial, formatTanggal } from '$lib/format';

  let { data, children } = $props<{
    data: {
      user?: { name?: string; email?: string; role?: string };
      wargaInfo?: { nama: string; nik: string; noKk: string; nomorRt: number } | null;
      notifikasi?: Array<any>;
      unreadNotifCount?: number;
    };
    children: import('svelte').Snippet;
  }>();

  let profilOpen = $state(false);
  let notifOpen = $state(false);
  let notifList = $state<any[]>([]);
  let unreadCount = $state<number>(0);

  $effect(() => {
    notifList = data.notifikasi ?? [];
    unreadCount = data.unreadNotifCount ?? 0;
  });

  let todayStr = $state('');
  /** Section beranda yang sedang terlihat — dipakai untuk status aktif nav. */
  let section = $state<PortalSection>('beranda');

  $effect(() => {
    if (browser) todayStr = formatTanggalPanjang(new Date());
  });

  // Status aktif nav mengikuti section yang sedang terlihat. Tanpa ini, tombol
  // "Iuran"/"Info" hanya jadi tautan mati setelah diklik.
  $effect(() => {
    if (!browser) return;

    const onScroll = () => {
      // Batas atas: tinggi header sticky + jarak aman, supaya judul section
      // tidak pernah tertutup header.
      const batas = 120;
      let current: PortalSection = 'beranda';
      for (const id of PORTAL_SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= batas) current = id;
      }
      section = current;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  });

  async function markAllRead() {
    await fetch('/api/notifikasi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    notifList = notifList.map((n) => ({ ...n, dibaca: true }));
    unreadCount = 0;
  }

  async function markItemRead(id: number) {
    await fetch('/api/notifikasi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    notifList = notifList.map((n) => (n.id === id ? { ...n, dibaca: true } : n));
    unreadCount = Math.max(0, unreadCount - 1);
  }

  async function handleLogout() {
    await signOut();
    goto('/login');
  }

  const greetingName = $derived(data.user?.name?.split(' ')[0] ?? 'Warga');
</script>

<div class="portal-shell">
  <header class="portal-header">
    <div class="portal-header-inner">
      <div class="portal-header-text">
        <p class="portal-greeting">Selamat datang, {greetingName}</p>
        {#if todayStr}
          <p class="portal-date">{todayStr}</p>
        {/if}
      </div>

      <div class="portal-header-actions">
        <button
          type="button"
          class="portal-icon-btn"
          aria-label="Pemberitahuan"
          onclick={() => (notifOpen = true)}
        >
          <Bell size={20} />
          {#if unreadCount > 0}
            <span class="header-notif-badge">{unreadCount}</span>
          {/if}
        </button>

        <button
          type="button"
          class="portal-avatar"
          aria-label="Buka profil"
          aria-expanded={profilOpen}
          aria-controls="portal-profil"
          onclick={() => (profilOpen = true)}
        >
          {inisial(data.user?.name)}
        </button>
      </div>
    </div>
  </header>

  <BottomNav
    items={PORTAL_NAV_ITEMS}
    activeKey={page.url.pathname.startsWith('/portal/iuran')
      ? '/portal/iuran'
      : PORTAL_SECTION_HREF[section]}
    panelOpen={profilOpen}
    panelId="portal-profil"
    onOpenPanel={() => (profilOpen = true)}
  />

  <main class="portal-main">
    {@render children()}
  </main>
</div>

<Sheet open={profilOpen} id="portal-profil" title="Profil Akun Warga" onClose={() => (profilOpen = false)}>
  <div class="profil-drawer-content">
    <div class="profil-user-box">
      <div class="profil-avatar-big">{inisial(data.user?.name)}</div>
      <div class="profil-user-meta">
        <p class="profil-user-name">{data.user?.name ?? 'Warga'}</p>
        <p class="profil-user-email">{data.user?.email ?? '—'}</p>
      </div>
    </div>

    {#if data.wargaInfo}
      <div class="profil-linked-card">
        <span class="linked-title">Terhubung ke Data Kependudukan</span>
        <div class="linked-grid">
          <div>
            <span class="label-mini">Nama KTP</span>
            <span class="val-mini">{data.wargaInfo.nama}</span>
          </div>
          <div>
            <span class="label-mini">Wilayah</span>
            <span class="val-mini">RT {String(data.wargaInfo.nomorRt).padStart(2, '0')}</span>
          </div>
          <div>
            <span class="label-mini">No. KK</span>
            <span class="val-mini mono">{data.wargaInfo.noKk}</span>
          </div>
        </div>
      </div>
    {:else}
      <p class="profil-note">
        Akun ini belum ditautkan ke NIK warga. Hubungi pengurus RT/RW untuk sinkronisasi.
      </p>
    {/if}

    <div class="profil-quick-links">
      <a href="/portal/perbaruan" class="quick-link-item" onclick={() => (profilOpen = false)}>
        <span>Pembaruan Data Kependudukan</span>
        <span class="arrow">&rarr;</span>
      </a>
      <a href="/portal/surat/ajukan" class="quick-link-item" onclick={() => (profilOpen = false)}>
        <span>Pengajuan Surat Pengantar</span>
        <span class="arrow">&rarr;</span>
      </a>
      <a href="/portal/iuran" class="quick-link-item" onclick={() => (profilOpen = false)}>
        <span>Tagihan &amp; Pembayaran Iuran</span>
        <span class="arrow">&rarr;</span>
      </a>
    </div>
  </div>

  {#snippet footer()}
    <ProfileBlock user={data.user} onLogout={handleLogout} />
  {/snippet}
</Sheet>

<Sheet open={notifOpen} id="portal-notifikasi" title="Pemberitahuan Warga" onClose={() => (notifOpen = false)}>
  <div class="notif-drawer-content">
    <div class="notif-top-bar">
      <span class="notif-summary">
        {unreadCount > 0 ? `${unreadCount} belum dibaca` : 'Semua sudah dibaca'}
      </span>
      {#if unreadCount > 0}
        <button type="button" class="btn-mark-all" onclick={markAllRead}>
          <CheckCheck size={14} />
          <span>Tandai Semua Dibaca</span>
        </button>
      {/if}
    </div>

    {#if notifList.length === 0}
      <div class="notif-empty">
        <Bell size={32} class="empty-icon" />
        <p class="empty-text">Belum ada pemberitahuan baru.</p>
      </div>
    {:else}
      <div class="notif-items-list">
        {#each notifList as n (n.id)}
          <div class="notif-card" class:notif-unread={!n.dibaca}>
            <div class="notif-header-line">
              <span class="notif-title">{n.judul}</span>
              <span class="notif-time">{formatTanggal(n.createdAt)}</span>
            </div>
            <p class="notif-pesan">{n.pesan}</p>
            {#if !n.dibaca}
              <button
                type="button"
                class="btn-mark-single"
                onclick={() => markItemRead(n.id)}
              >
                Tandai dibaca
              </button>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</Sheet>

<style>
  .portal-shell {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    background-color: var(--color-bg);
    /* Portal dibawa ke kolom baca yang lebih sempit dari admin, jadi kartu
       tidak melar di layar lebar. Header, nav, dan konten tetap sejajar. */
    --content-max: 46rem;
  }

  .portal-header {
    position: sticky;
    top: 0;
    z-index: var(--z-sidebar);
    background-color: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
  }

  .portal-header-inner {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    width: 100%;
    max-width: var(--content-max);
    min-height: var(--header-height);
    margin: 0 auto;
    padding: var(--space-2) var(--space-4);
  }

  .portal-header-text {
    flex: 1;
    min-width: 0;
  }

  .portal-greeting {
    margin: 0;
    font-size: var(--text-base);
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: var(--tracking-tight);
    color: var(--color-text);
    overflow-wrap: anywhere;
  }

  .portal-date {
    margin: 0.125rem 0 0;
    font-size: var(--text-sm);
    line-height: 1.3;
    color: var(--color-text-muted);
  }

  .portal-header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .portal-icon-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--tap-min);
    height: var(--tap-min);
    border-radius: var(--radius-full);
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .portal-icon-btn:hover {
    color: var(--color-text);
    background: var(--color-surface-muted);
  }

  .header-notif-badge {
    position: absolute;
    top: -2px;
    right: -2px;
    background: var(--color-danger);
    color: #fff;
    font-size: 0.65rem;
    font-weight: 700;
    min-width: 1.1rem;
    height: 1.1rem;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.2rem;
    border: 2px solid var(--color-surface);
  }

  .notif-drawer-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .notif-top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: var(--space-2);
    border-bottom: 1px solid var(--color-border);
  }

  .notif-summary {
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--color-text-muted);
  }

  .btn-mark-all {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: var(--text-2xs);
    font-weight: 600;
    color: var(--color-brand-600);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .btn-mark-all:hover {
    text-decoration: underline;
  }

  .notif-empty {
    padding: var(--space-6) 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-text-muted);
  }

  .notif-items-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .notif-card {
    padding: var(--space-3);
    border-radius: var(--radius-md);
    background: var(--color-surface-muted);
    border: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .notif-card.notif-unread {
    background: var(--color-surface);
    border-left: 3px solid var(--color-brand-600);
  }

  .notif-header-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
  }

  .notif-title {
    font-size: var(--text-xs);
    font-weight: 700;
    color: var(--color-text);
  }

  .notif-time {
    font-size: var(--text-2xs);
    color: var(--color-text-muted);
    flex-shrink: 0;
  }

  .notif-pesan {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    line-height: var(--leading-relaxed);
  }

  .btn-mark-single {
    align-self: flex-end;
    font-size: var(--text-2xs);
    color: var(--color-brand-600);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-top: var(--space-1);
  }

  .btn-mark-single:hover {
    text-decoration: underline;
  }

  .portal-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--tap-min);
    height: var(--tap-min);
    flex-shrink: 0;
    border: none;
    border-radius: var(--radius-full);
    background-color: var(--color-accent);
    color: var(--color-accent-contrast);
    font-family: inherit;
    font-size: var(--text-base);
    font-weight: 700;
    cursor: pointer;
  }

  .profil-note {
    margin: 0;
    font-size: var(--text-sm);
    line-height: var(--leading-normal);
    color: var(--color-text-muted);
  }

  .profil-drawer-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .profil-user-box {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    background: var(--color-surface-muted);
    border-radius: var(--radius-lg);
  }

  .profil-avatar-big {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: var(--radius-full);
    background: var(--color-brand-600);
    color: white;
    font-size: var(--text-base);
    font-weight: 700;
    flex-shrink: 0;
  }

  .profil-user-name {
    margin: 0;
    font-size: var(--text-base);
    font-weight: 700;
  }

  .profil-user-email {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .profil-linked-card {
    padding: var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
  }

  .linked-title {
    font-size: var(--text-2xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--color-brand-600);
    display: block;
    margin-bottom: var(--space-2);
  }

  .linked-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-2);
  }

  .label-mini {
    display: block;
    font-size: var(--text-2xs);
    color: var(--color-text-muted);
  }

  .val-mini {
    font-size: var(--text-xs);
    font-weight: 600;
  }

  .profil-quick-links {
    display: flex;
    flex-direction: column;
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    overflow: hidden;
  }

  .quick-link-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3);
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--color-text);
    text-decoration: none;
    border-bottom: 1px solid var(--color-border);
    transition: background-color 0.15s ease;
  }

  .quick-link-item:last-child {
    border-bottom: none;
  }

  .quick-link-item:hover {
    background-color: var(--color-surface-muted);
  }

  .arrow {
    color: var(--color-text-muted);
  }

  .portal-main {
    flex: 1;
    width: 100%;
    max-width: var(--content-max);
    margin: 0 auto;
    padding: var(--space-4) var(--space-4) calc(var(--bottomnav-height) + var(--space-6));
  }

  /* Di >= 1024px nav sudah jadi baris statis, jadi konten tidak perlu
     menyisakan ruang untuk bar bawah. */
  @media (min-width: 1024px) {
    .portal-header-inner { padding: var(--space-2) var(--space-8); }
    .portal-greeting { font-size: var(--text-lg); }
    .portal-main {
      padding: var(--space-6) var(--space-8) var(--space-12);
    }
  }
</style>
