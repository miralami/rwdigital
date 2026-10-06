<script lang="ts">
  import { untrack } from 'svelte';
  import { page } from '$app/state';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { signOut } from '$lib/auth-client';
  import { UserPlus, Plus } from '@lucide/svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import ProfileBlock from '$lib/components/ProfileBlock.svelte';
  import Sheet from '$lib/components/Sheet.svelte';
  import Button from '$lib/components/Button.svelte';
  import { BOTTOM_NAV_ITEMS, MORE_NAV_ITEMS, isNavActive } from '$lib/nav';
  import { formatTanggalPanjang, inisial } from '$lib/format';

  let { data, children } = $props<{
    data: { user?: { name?: string; email?: string; role?: string } };
    children: import('svelte').Snippet;
  }>();

  let moreOpen = $state(false);
  let todayStr = $state('');

  /**
   * Rute form di dalam route group `(app)`.
   *
   * Di seluruh rute ini halaman sudah menampilkan primary submit-nya sendiri
   * (mis. "Simpan", "Terbitkan", "Generate tagihan"). Kalau header tetap
   * memuat "Catat kas", satu layar jadi punya dua primary — aksen navy itu
   * cadangan untuk aksi terminal yang tunggal.
   *
   * Daftar ini satu-satunya sumber kebenaran; setiap rute form baru cukup
   * ditambah di sini, tanpa menyentuh markup. `[id]` berarti satu segmen
   * dinamis apa pun. Rute list (dashboard, warga, kas, iuran, pengumuman)
   * sengaja tidak ada: primary di header itu milik mereka.
   */
  const FORM_ROUTES: readonly string[] = [
    '/kas/tambah',
    '/kas/kategori',
    '/warga/tambah',
    '/warga/impor',
    '/warga/[id]/edit',
    '/surat/[id]',
    '/iuran/generate',
    '/iuran/jenis',
    '/iuran/[id]/bayar',
    '/pengumuman/tambah',
    '/pengumuman/[id]/edit'
  ];

  /** Cocokkan pathname ke `FORM_ROUTES` per segmen, bukan `startsWith` polos. */
  function isFormRoute(pathname: string): boolean {
    const segments = pathname.split('/');
    return FORM_ROUTES.some((route) => {
      const pattern = route.split('/');
      return pattern.length === segments.length && pattern.every((seg, i) => seg.startsWith('[') || seg === segments[i]);
    });
  }

  // Di route form, aksi header disembunyikan sepenuhnya supaya submit halaman
  // jadi satu-satunya primary. Navigasi tetap tersedia lewat sidebar & nav.
  const tampilkanAksiHeader = $derived(!isFormRoute(page.url.pathname));

  // Dihitung setelah mount supaya format tanggal server dan browser tidak
  // pernah beda (mencegah hydration mismatch).
  $effect(() => {
    if (browser) todayStr = formatTanggalPanjang(new Date());
  });

  // Tutup sheet begitu navigasi berpindah halaman. `untrack` wajib: kalau
  // `moreOpen` ikut terlacak, efek ini akan langsung menutup sheet lagi.
  $effect(() => {
    page.url.pathname;
    untrack(() => {
      if (moreOpen) moreOpen = false;
    });
  });

  async function handleLogout() {
    await signOut();
    goto('/login');
  }

  const greetingName = $derived(data.user?.name?.split(' ')[0] ?? 'Pengurus');
</script>

<div class="app-shell">
  <Sidebar user={data.user} onLogout={handleLogout} />

  <div class="app-main">
    <header class="app-header">
      <div class="app-header-inner">
        <div class="header-text">
          <p class="header-greeting">Selamat datang, {greetingName}</p>
          {#if todayStr}
            <p class="header-date">{todayStr}</p>
          {/if}
        </div>

        {#if tampilkanAksiHeader}
          <div class="header-actions">
            <Button href="/warga/tambah" variant="secondary" icon={UserPlus}>Tambah warga</Button>
            <Button href="/kas/tambah" variant="primary" icon={Plus}>Catat kas</Button>
          </div>
        {/if}

        <!-- Di mobile, avatar adalah pembuka profil + menu Lainnya. -->
        <button
          type="button"
          class="header-avatar"
          aria-label="Buka profil dan menu lainnya"
          aria-expanded={moreOpen}
          aria-controls="lainnya-sheet"
          onclick={() => (moreOpen = true)}
        >
          {inisial(data.user?.name)}
        </button>
      </div>
    </header>

    <main class="app-content">
      {@render children()}
    </main>
  </div>

  <div class="app-dock">
    <BottomNav
      items={BOTTOM_NAV_ITEMS}
      panelOpen={moreOpen}
      panelActivePaths={MORE_NAV_ITEMS.map((item) => item.href)}
      panelId="lainnya-sheet"
      onOpenPanel={() => (moreOpen = true)}
    />
  </div>
</div>

<Sheet
  open={moreOpen}
  id="lainnya-sheet"
  title="Lainnya"
  onClose={() => (moreOpen = false)}
>
  <nav class="sheet-links" aria-label="Menu lainnya">
    {#each MORE_NAV_ITEMS as item}
      {@const Icon = item.icon}
      <a
        href={item.href}
        class="sheet-link"
        class:active={isNavActive(page.url.pathname, item.href)}
      >
        <Icon size={18} />
        <span>{item.label}</span>
      </a>
    {/each}
  </nav>
  {#snippet footer()}
    <ProfileBlock user={data.user} onLogout={handleLogout} />
  {/snippet}
</Sheet>

<style>
  .app-shell {
    display: flex;
    min-height: 100dvh;
    background-color: var(--color-bg);
  }

  .app-main {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  /* ─── Header (satu saja, dipakai desktop & mobile) ─── */
  .app-header {
    position: sticky;
    top: 0;
    z-index: var(--z-sidebar);
    background-color: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
  }

  .app-header-inner {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    width: 100%;
    max-width: var(--content-max);
    min-height: var(--header-height);
    margin: 0 auto;
    padding: var(--space-2) var(--space-4);
  }

  .header-text {
    flex: 1;
    min-width: 0;
  }

  .header-greeting {
    margin: 0;
    font-size: var(--text-lg);
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: var(--tracking-tight);
    color: var(--color-text);
    overflow-wrap: anywhere;
  }

  .header-date {
    margin: 0.125rem 0 0;
    font-size: var(--text-sm);
    line-height: 1.3;
    color: var(--color-text-muted);
  }

  .header-actions {
    display: none;
    gap: var(--space-2);
    flex-shrink: 0;
  }

  .header-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    flex-shrink: 0;
    border-radius: var(--radius-full);
    background-color: var(--color-accent);
    color: var(--color-accent-contrast);
    font-family: inherit;
    font-size: var(--text-sm);
    font-weight: 700;
    border: none;
    cursor: pointer;
  }

  /* ─── Konten ─── */
  .app-content {
    flex: 1;
    min-width: 0;
    width: 100%;
    max-width: var(--content-max);
    margin: 0 auto;
    padding: var(--space-5) var(--space-4);
  }

  /* Dock bottom nav — hanya untuk < 1024px, di desktop sidebar yang pegang peran. */
  .app-dock { display: none; }

  .sheet-links {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .sheet-link {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    min-height: var(--tap-min);
    padding: 0.5rem var(--space-3);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text);
    text-decoration: none;
  }
  .sheet-link :global(svg) { color: var(--color-text-muted); }
  .sheet-link:hover { background: var(--color-surface-muted); }
  .sheet-link.active { background: var(--color-accent); color: var(--color-accent-contrast); }
  .sheet-link.active :global(svg) { color: var(--color-accent-contrast); }

  /* ─── Desktop: >= 1024px ─── */
  @media (min-width: 1024px) {
    .app-content { padding: var(--space-6) var(--space-8) var(--space-12); }
    .app-header-inner { padding: var(--space-2) var(--space-8); }
    .header-actions { display: flex; }
    .header-avatar { display: none; }
  }

  /* ─── Mobile: < 1024px ─── */
  @media (max-width: 1023px) {
    .app-dock { display: block; }
    .app-content { padding-bottom: calc(var(--bottomnav-height) + var(--space-6)); }
  }
</style>
