<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { signOut } from '$lib/auth-client';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import ProfileBlock from '$lib/components/ProfileBlock.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import {
    PORTAL_NAV_ITEMS,
    PORTAL_SECTION_HREF,
    PORTAL_SECTIONS,
    type PortalSection
  } from '$lib/nav';
  import { formatTanggalPanjang, inisial } from '$lib/format';

  let { data, children } = $props<{
    data: { user?: { name?: string; email?: string; role?: string } };
    children: import('svelte').Snippet;
  }>();

  let profilOpen = $state(false);
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
  </header>

  <BottomNav
    items={PORTAL_NAV_ITEMS}
    activeKey={PORTAL_SECTION_HREF[section]}
    panelOpen={profilOpen}
    panelId="portal-profil"
    onOpenPanel={() => (profilOpen = true)}
  />

  <main class="portal-main">
    {@render children()}
  </main>
</div>

<Sheet open={profilOpen} id="portal-profil" title="Profil" onClose={() => (profilOpen = false)}>
  <p class="profil-note">
    Data iuran dan pembayaran Anda akan tampil di sini setelah terhubung ke data warga.
  </p>
  {#snippet footer()}
    <ProfileBlock user={data.user} onLogout={handleLogout} />
  {/snippet}
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
