<script lang="ts">
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Building2 from '@lucide/svelte/icons/building-2';
  import Users from '@lucide/svelte/icons/users';
  import UserCog from '@lucide/svelte/icons/user-cog';
  import Images from '@lucide/svelte/icons/images';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  const menu = $derived([
    {
      href: '/pengaturan/rt',
      judul: 'Konfigurasi RT',
      keterangan: 'Tambah, ubah, dan hapus wilayah RT beserta jumlah KK-nya.',
      icon: Building2,
      boleh: data.akses.rt
    },
    {
      href: '/pengaturan/pengurus',
      judul: 'Kepengurusan & Foto',
      keterangan: 'Susun bagan pengurus RW dan tiap RT, lengkap dengan foto.',
      icon: Users,
      boleh: data.akses.pengurus
    },
    {
      href: '/pengaturan/landing',
      judul: 'Landing & Galeri',
      keterangan: 'Atur latar hero, sambutan, profil RW, dan foto galeri halaman publik.',
      icon: Images,
      boleh: data.akses.landing
    },
    {
      href: '/pengaturan/pengguna',
      judul: 'Pengguna & Role',
      keterangan: 'Buat akun, atur role, dan hubungkan akun warga ke data kependudukan.',
      icon: UserCog,
      boleh: data.akses.pengguna
    }
  ]);
</script>

<div class="page-container">
  <PageHeader
    title="Pengaturan"
    subtitle="Kelola master data yang dipakai seluruh modul: wilayah RT, kepengurusan, dan akun pengguna."
  />

  <div class="menu-grid">
    {#each menu as item}
      {@const Icon = item.icon}
      <a class="menu-card" href={item.href} class:terbatas={!item.boleh}>
        <span class="menu-icon"><Icon size={20} /></span>
        <span class="menu-text">
          <span class="menu-title">{item.judul}</span>
          <span class="menu-desc">{item.keterangan}</span>
          {#if !item.boleh}
            <span class="menu-lock">Hanya admin RW yang bisa mengubah</span>
          {/if}
        </span>
        <span class="menu-chevron"><ChevronRight size={18} /></span>
      </a>
    {/each}
  </div>
</div>

<style>
  .page-container {
    max-width: 56rem;
  }

  .menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    gap: var(--space-4);
  }

  .menu-card {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    padding: var(--space-5);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    text-decoration: none;
    color: inherit;
    transition: border-color 120ms ease, box-shadow 120ms ease;
  }

  .menu-card:hover {
    border-color: var(--color-brand-300);
    box-shadow: var(--shadow-sm);
  }

  .menu-card.terbatas {
    opacity: 0.72;
  }

  .menu-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    flex-shrink: 0;
    border-radius: var(--radius-md);
    background: var(--color-brand-50);
    color: var(--color-accent);
  }

  .menu-text {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
    flex: 1;
  }

  .menu-title {
    font-size: var(--text-base);
    font-weight: 600;
    color: var(--color-text);
  }

  .menu-desc {
    font-size: var(--text-sm);
    line-height: var(--leading-snug);
    color: var(--color-text-muted);
  }

  .menu-lock {
    margin-top: var(--space-1);
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--color-warning);
  }

  .menu-chevron {
    flex-shrink: 0;
    color: var(--color-text-muted);
  }
</style>
