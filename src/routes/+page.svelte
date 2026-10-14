<script lang="ts">
  import Building2 from '@lucide/svelte/icons/building-2';
  import MapPin from '@lucide/svelte/icons/map-pin';
  import LogIn from '@lucide/svelte/icons/log-in';
  import ArrowDown from '@lucide/svelte/icons/arrow-down';
  import Target from '@lucide/svelte/icons/target';
  import ListChecks from '@lucide/svelte/icons/list-checks';
  import BookOpen from '@lucide/svelte/icons/book-open';
  import Trophy from '@lucide/svelte/icons/trophy';
  import Leaf from '@lucide/svelte/icons/leaf';
  import ShieldCheck from '@lucide/svelte/icons/shield-check';
  import Sparkles from '@lucide/svelte/icons/sparkles';
  import Handshake from '@lucide/svelte/icons/handshake';
  import HeartPulse from '@lucide/svelte/icons/heart-pulse';
  import CalendarDays from '@lucide/svelte/icons/calendar-days';
  import ImageIcon from '@lucide/svelte/icons/image';
  import Users from '@lucide/svelte/icons/users';
  import Baby from '@lucide/svelte/icons/baby';
  import TrendingUp from '@lucide/svelte/icons/trending-up';
  import Phone from '@lucide/svelte/icons/phone';
  import Mail from '@lucide/svelte/icons/mail';
  import StatCard from '$lib/components/StatCard.svelte';
  import Card from '$lib/components/Card.svelte';
  import BarChart from '$lib/components/BarChart.svelte';
  import DonutChart from '$lib/components/DonutChart.svelte';
  import type { Component } from 'svelte';
  import type { StatistikPublik } from '$lib/types';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  // ─── Konten statis (profil RW) ──────────────────────────────────────────
  // Sesuai batasan MVP: konten ini statis, bukan CMS dinamis.
  const visi =
    'Mewujudkan RW 06 sebagai lingkungan yang aman, bersih, rukun, dan mandiri melalui pelayanan administrasi yang transparan serta partisipasi aktif seluruh warga.';

  const misi: string[] = [
    'Menyelenggarakan administrasi kependudukan yang tertib, akurat, dan mudah diakses warga.',
    'Mendorong transparansi dan akuntabilitas pengelolaan kas serta iuran lingkungan.',
    'Meningkatkan keamanan, kebersihan, dan ketertiban lingkungan secara bergotong royong.',
    'Memberdayakan pemuda, posyandu, dan kegiatan sosial-keagamaan warga.',
    'Membangun komunikasi dan penyampaian informasi RW yang cepat dan merata.'
  ];

  const sejarah =
    'RW 06 terbentuk seiring pertumbuhan permukiman di Kelurahan Kota Baru, Kecamatan Bekasi Barat. Dari lingkungan perumahan yang dikelola secara swadaya, warga secara bertahap membangun struktur pengurus RT dan RW, mengembangkan kegiatan sosial, keamanan lingkungan (siskamling), posyandu, serta pengelolaan iuran lingkungan. Kini RW 06 menaungi sejumlah RT dengan tata kelola yang terus dibenahi menuju pelayanan yang lebih modern dan transparan.';

  const kontak = {
    alamat: 'Balai RW 06, Kelurahan Kota Baru, Kecamatan Bekasi Barat, Kota Bekasi',
    telepon: '0812-0000-0000',
    email: 'rw06@kotabaru.id'
  };

  // ─── SOTK / bagan pengurus ──────────────────────────────────────────────
  type Pengurus = { jabatan: string; nama: string };

  const pimpinanInti: Pengurus[] = [
    { jabatan: 'Sekretaris', nama: '—' },
    { jabatan: 'Bendahara', nama: '—' }
  ];

  const seksiBidang: (Pengurus & { icon: Component<any> })[] = [
    { jabatan: 'Seksi Keamanan', nama: '—', icon: ShieldCheck },
    { jabatan: 'Seksi Kebersihan & Lingkungan', nama: '—', icon: Leaf },
    { jabatan: 'Seksi Sosial & Kemasyarakatan', nama: '—', icon: Handshake },
    { jabatan: 'Seksi Pemuda & Olahraga', nama: '—', icon: Sparkles },
    { jabatan: 'Seksi Keagamaan', nama: '—', icon: HeartPulse }
  ];

  // ─── Prestasi lingkungan ────────────────────────────────────────────────
  type Prestasi = {
    judul: string;
    deskripsi: string;
    tahun: string;
    kategori: string;
    icon: Component<any>;
  };

  const prestasi: Prestasi[] = [
    {
      judul: 'Juara 1 Lomba Kebersihan Lingkungan',
      deskripsi: 'Penilaian kebersihan dan pengelolaan sampah antar-RW tingkat Kecamatan Bekasi Barat.',
      tahun: '2024',
      kategori: 'Lingkungan',
      icon: Trophy
    },
    {
      judul: 'Posyandu Aktif & Mandiri',
      deskripsi: 'Penghargaan atas konsistensi pelayanan posyandu balita dan lansia setiap bulan.',
      tahun: '2024',
      kategori: 'Kesehatan',
      icon: HeartPulse
    },
    {
      judul: 'Bank Sampah RW 06 Berdiri',
      deskripsi: 'Inisiatif pengelolaan sampah terpilah yang dikelola bersama karang taruna dan ibu-ibu PKK.',
      tahun: '2023',
      kategori: 'Lingkungan',
      icon: Leaf
    },
    {
      judul: 'Juara 2 Lomba HUT Kemerdekaan RI',
      deskripsi: 'Partisipasi dan prestasi warga dalam rangkaian lomba peringatan HUT RI tingkat kelurahan.',
      tahun: '2023',
      kategori: 'Sosial',
      icon: Sparkles
    }
  ];

  // ─── Data dari server (agregat) ─────────────────────────────────────────
  const stat: StatistikPublik = $derived(data.statistik);

  const barData = $derived(
    stat.perRt.map((r) => ({ label: `RT ${String(r.nomor).padStart(2, '0')}`, value: r.totalWarga }))
  );

  const usiaSegments = $derived([
    { label: 'Anak & remaja (0–14)', value: stat.usia.anak, color: 'var(--color-brand-300)' },
    { label: 'Usia produktif (15–64)', value: stat.usia.produktif, color: 'var(--color-brand-600)' },
    { label: 'Lansia (65+)', value: stat.usia.lansia, color: 'var(--color-warning)' }
  ]);

  const navLinks = [
    { href: '#profil', label: 'Profil' },
    { href: '#sotk', label: 'Struktur' },
    { href: '#prestasi', label: 'Prestasi' },
    { href: '#statistik', label: 'Statistik' }
  ];
</script>

<svelte:head>
  <title>RW 06 Kota Baru — Portal Informasi Warga</title>
  <meta
    name="description"
    content="Profil, struktur pengurus, prestasi lingkungan, dan statistik kependudukan RW 06 Kelurahan Kota Baru, Kecamatan Bekasi Barat, Kota Bekasi."
  />
</svelte:head>

<!-- ─── Header ─────────────────────────────────────────────────────────── -->
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="#top" aria-label="RW 06 Kota Baru — beranda">
      <span class="brand-mark"><Building2 size={20} /></span>
      <span class="brand-text">
        <strong>RW 06</strong>
        <small>Kota Baru</small>
      </span>
    </a>

    <nav class="site-nav" aria-label="Navigasi halaman">
      {#each navLinks as link (link.href)}
        <a href={link.href}>{link.label}</a>
      {/each}
    </nav>

    <a class="btn btn-primary btn-sm header-cta" href="/login">
      <LogIn size={15} />
      <span>Masuk</span>
    </a>
  </div>
</header>

<main id="top">
  <!-- ─── Hero ─────────────────────────────────────────────────────────── -->
  <section class="hero">
    <div class="container hero-inner">
      <p class="hero-eyebrow label-caps">Portal Informasi Warga</p>
      <h1 class="hero-title">RW 06 Kota Baru</h1>
      <p class="hero-location">
        <MapPin size={16} />
        <span>Kelurahan Kota Baru · Kecamatan Bekasi Barat · Kota Bekasi</span>
      </p>
      <p class="hero-tagline">Warga terhubung, lingkungan tertata.</p>

      <div class="hero-actions">
        <a class="btn btn-primary btn-lg" href="#profil">
          <span>Jelajahi Profil</span>
          <ArrowDown size={16} />
        </a>
        <a class="btn btn-ghost btn-lg hero-ghost" href="/login">
          <LogIn size={16} />
          <span>Masuk Portal</span>
        </a>
      </div>
    </div>
  </section>

  <!-- ─── Profil RW ────────────────────────────────────────────────────── -->
  <section id="profil" class="section">
    <div class="container">
      <header class="section-head">
        <p class="label-caps">Profil Wilayah</p>
        <h2>Tentang RW 06</h2>
        <p class="section-sub">Visi, misi, dan sejarah singkat lingkungan RW 06.</p>
      </header>

      <div class="profil-grid">
        <article class="profil-card">
          <span class="profil-icon"><Target size={20} /></span>
          <h3>Visi</h3>
          <p>{visi}</p>
        </article>

        <article class="profil-card">
          <span class="profil-icon"><ListChecks size={20} /></span>
          <h3>Misi</h3>
          <ul class="misi-list">
            {#each misi as item}
              <li>{item}</li>
            {/each}
          </ul>
        </article>

        <article class="profil-card">
          <span class="profil-icon"><BookOpen size={20} /></span>
          <h3>Sejarah Singkat</h3>
          <p>{sejarah}</p>
        </article>
      </div>
    </div>
  </section>

  <!-- ─── SOTK ─────────────────────────────────────────────────────────── -->
  <section id="sotk" class="section section-alt">
    <div class="container">
      <header class="section-head">
        <p class="label-caps">Struktur Organisasi & Tata Kerja</p>
        <h2>Bagan Pengurus</h2>
        <p class="section-sub">Susunan kepengurusan RW 06 beserta seksi bidang dan kewilayahan RT.</p>
      </header>

      <div class="org">
        <div class="org-node org-node-lead">
          <span class="org-role">Ketua RW</span>
          <span class="org-name">RW 06</span>
        </div>

        <div class="org-line" aria-hidden="true"></div>
        <p class="org-tier label-caps">Pimpinan Inti</p>
        <div class="org-row">
          {#each pimpinanInti as p (p.jabatan)}
            <div class="org-node">
              <span class="org-role">{p.jabatan}</span>
              <span class="org-name">{p.nama}</span>
            </div>
          {/each}
        </div>

        <div class="org-line" aria-hidden="true"></div>
        <p class="org-tier label-caps">Seksi Bidang</p>
        <div class="org-row">
          {#each seksiBidang as s (s.jabatan)}
            {@const SeksiIcon = s.icon}
            <div class="org-node org-node-seksi">
              <span class="org-icon"><SeksiIcon size={16} /></span>
              <span class="org-role">{s.jabatan}</span>
            </div>
          {/each}
        </div>

        <div class="org-line" aria-hidden="true"></div>
        <p class="org-tier label-caps">Kewilayahan</p>
        <div class="org-row">
          {#if stat.perRt.length > 0}
            {#each stat.perRt as r (r.nomor)}
              <div class="org-node org-node-rt">
                <span class="org-role">Ketua RT {String(r.nomor).padStart(2, '0')}</span>
                <span class="org-name">—</span>
              </div>
            {/each}
          {:else}
            <p class="org-note">Data wilayah RT belum tersedia.</p>
          {/if}
        </div>
      </div>
    </div>
  </section>

  <!-- ─── Prestasi ─────────────────────────────────────────────────────── -->
  <section id="prestasi" class="section">
    <div class="container">
      <header class="section-head">
        <p class="label-caps">Prestasi Lingkungan</p>
        <h2>Pencapaian & Dokumentasi</h2>
        <p class="section-sub">
          Daftar pencapaian lingkungan RW 06 beserta galeri foto bukti kegiatan.
        </p>
      </header>

      <div class="prestasi-grid">
        {#each prestasi as item (item.judul)}
          {@const PrestasiIcon = item.icon}
          <article class="prestasi-card">
            <div class="prestasi-media">
              <span class="prestasi-media-icon"><PrestasiIcon size={26} /></span>
              <span class="prestasi-media-hint">
                <ImageIcon size={13} />
                <span>Foto bukti</span>
              </span>
              <span class="prestasi-tahun badge variant-brand">{item.tahun}</span>
            </div>
            <div class="prestasi-body">
              <h3>{item.judul}</h3>
              <p>{item.deskripsi}</p>
              <span class="prestasi-tag label-caps">{item.kategori}</span>
            </div>
          </article>
        {/each}
      </div>

      <p class="section-note">
        Konten prestasi di atas bersifat ilustratif — pengurus dapat memperbarui data dan foto aktual.
      </p>
    </div>
  </section>

  <!-- ─── Statistik ────────────────────────────────────────────────────── -->
  <section id="statistik" class="section section-alt">
    <div class="container">
      <header class="section-head">
        <p class="label-caps">Data Kependudukan</p>
        <h2>Statistik Publik RW 06</h2>
        <p class="section-sub">
          Ringkasan agregat kependudukan lingkungan. Data disajikan tanpa identitas pribadi warga.
        </p>
      </header>

      <div class="stat-grid">
        <StatCard
          title="Total warga aktif"
          value={stat.totalWarga}
          description="{stat.totalKk} KK · {stat.totalRt} RT"
          icon={Users}
          variant="hero"
        />
        <StatCard
          title="Kelahiran baru"
          value={stat.kelahiranBaru}
          description="Sepanjang tahun {data.tahunIni}"
          icon={Baby}
        />
        <StatCard
          title="Rasio usia produktif"
          value="{stat.rasioProduktif}%"
          description="Penduduk usia 15–64 tahun"
          icon={TrendingUp}
        />
      </div>

      <div class="chart-grid">
        <Card title="Distribusi penduduk per RT" description="Jumlah warga aktif tiap wilayah RT">
          <BarChart data={barData} unit="jiwa" emptyMessage="Data wilayah RT belum tersedia." />
        </Card>

        <Card title="Komposisi usia warga" description="Proporsi usia produktif dibanding anak dan lansia">
          <DonutChart
            segments={usiaSegments}
            centerValue={stat.usia.total}
            centerLabel="Total jiwa"
            unit="jiwa"
            emptyMessage="Data usia warga belum tersedia."
          />
        </Card>
      </div>
    </div>
  </section>
</main>

<!-- ─── Footer ─────────────────────────────────────────────────────────── -->
<footer class="site-footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <span class="brand-mark brand-mark-lg"><Building2 size={22} /></span>
      <div>
        <strong>RW 06 Kota Baru</strong>
        <p>{kontak.alamat}</p>
      </div>
    </div>

    <div class="footer-contact">
      <p><CalendarDays size={15} /> Pelayanan: Senin–Sabtu</p>
      <p><Phone size={15} /> {kontak.telepon}</p>
      <p><Mail size={15} /> {kontak.email}</p>
    </div>

    <div class="footer-nav">
      {#each navLinks as link (link.href)}
        <a href={link.href}>{link.label}</a>
      {/each}
      <a href="/login">Masuk Portal</a>
    </div>
  </div>

  <div class="container footer-bottom">
    <p>© {data.tahunIni} RW Digital · Sistem Informasi Administrasi Rukun Warga</p>
  </div>
</footer>

<style>
  /* ─── Primitives ─────────────────────────────────────────────────────── */
  .container {
    width: 100%;
    max-width: var(--content-max);
    margin-inline: auto;
    padding-inline: var(--space-4);
  }

  @media (min-width: 48rem) {
    .container {
      padding-inline: var(--space-6);
    }
  }

  /* ─── Header ─────────────────────────────────────────────────────────── */
  .site-header {
    position: sticky;
    top: 0;
    z-index: var(--z-raised);
    background: color-mix(in oklab, var(--color-surface) 88%, transparent);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--color-border);
  }

  .header-inner {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    min-height: 4rem;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    text-decoration: none;
    color: var(--color-text);
    margin-right: auto;
  }

  .brand-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--radius-md);
    background: linear-gradient(135deg, var(--color-brand-600) 0%, var(--color-brand-900) 100%);
    color: #fff;
    flex-shrink: 0;
  }

  .brand-mark-lg {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: var(--radius-lg);
  }

  .brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
  }

  .brand-text strong {
    font-size: var(--text-base);
    font-weight: 800;
    letter-spacing: var(--tracking-tight);
  }

  .brand-text small {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .site-nav {
    display: none;
    gap: var(--space-5);
  }

  .site-nav a {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text-muted);
    text-decoration: none;
    padding: var(--space-1) 0;
    border-bottom: 2px solid transparent;
    transition: color 0.15s ease, border-color 0.15s ease;
  }

  .site-nav a:hover {
    color: var(--color-accent);
    border-bottom-color: var(--color-accent);
  }

  @media (min-width: 56rem) {
    .site-nav {
      display: flex;
    }
  }

  .header-cta {
    flex-shrink: 0;
  }

  /* ─── Hero ───────────────────────────────────────────────────────────── */
  .hero {
    position: relative;
    background:
      radial-gradient(circle at 85% 15%, color-mix(in oklab, var(--color-brand-400) 40%, transparent) 0%, transparent 45%),
      linear-gradient(140deg, var(--color-brand-950) 0%, var(--color-brand-800) 55%, var(--color-brand-700) 100%);
    color: #fff;
    overflow: hidden;
  }

  .hero::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(color-mix(in oklab, #fff 12%, transparent) 1px, transparent 1px);
    background-size: 22px 22px;
    mask-image: linear-gradient(to bottom, #000 0%, transparent 70%);
    opacity: 0.5;
    pointer-events: none;
  }

  .hero-inner {
    position: relative;
    z-index: 1;
    padding-block: var(--space-16);
    max-width: 46rem;
  }

  @media (min-width: 64rem) {
    .hero-inner {
      padding-block: 6rem;
    }
  }

  .hero-eyebrow {
    color: color-mix(in oklab, #fff 72%, transparent);
    margin: 0 0 var(--space-3);
  }

  .hero-title {
    margin: 0;
    font-size: clamp(2.25rem, 6vw, 3.5rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: var(--leading-tight);
  }

  .hero-location {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin: var(--space-4) 0 0;
    font-size: var(--text-sm);
    color: color-mix(in oklab, #fff 82%, transparent);
  }

  .hero-tagline {
    margin: var(--space-5) 0 0;
    font-size: var(--text-lg);
    line-height: var(--leading-normal);
    color: color-mix(in oklab, #fff 88%, transparent);
    max-width: 34rem;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    margin-top: var(--space-8);
  }

  /* Tombol primary di atas latar gelap: pakai putih agar kontras cukup. */
  .hero-actions :global(.btn-primary) {
    background-color: #fff;
    border-color: #fff;
    color: var(--color-brand-900);
  }

  .hero-actions :global(.btn-primary:hover) {
    background-color: color-mix(in oklab, #fff 88%, var(--color-brand-200));
    border-color: #fff;
  }

  .hero-ghost {
    color: #fff;
  }

  .hero-ghost:hover {
    background-color: color-mix(in oklab, #fff 14%, transparent);
    color: #fff;
  }

  /* ─── Section shell ──────────────────────────────────────────────────── */
  .section {
    padding-block: var(--space-12);
    scroll-margin-top: 4.5rem;
  }

  .section-alt {
    background-color: var(--color-surface-muted);
    border-block: 1px solid var(--color-border);
  }

  @media (min-width: 64rem) {
    .section {
      padding-block: var(--space-16);
    }
  }

  .section-head {
    max-width: 42rem;
    margin-bottom: var(--space-8);
  }

  .section-head h2 {
    margin: var(--space-2) 0 0;
    font-size: var(--text-3xl);
    font-weight: 800;
    letter-spacing: var(--tracking-tight);
    line-height: var(--leading-tight);
  }

  .section-sub {
    margin: var(--space-3) 0 0;
    font-size: var(--text-base);
    color: var(--color-text-muted);
  }

  .section-note {
    margin: var(--space-6) 0 0;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    font-style: italic;
  }

  /* ─── Profil ─────────────────────────────────────────────────────────── */
  .profil-grid {
    display: grid;
    gap: var(--space-4);
    grid-template-columns: 1fr;
  }

  @media (min-width: 56rem) {
    .profil-grid {
      grid-template-columns: repeat(3, 1fr);
      align-items: start;
    }
  }

  .profil-card {
    position: relative;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    padding: var(--space-6);
    overflow: hidden;
  }

  .profil-card::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: linear-gradient(90deg, var(--color-brand-600), var(--color-brand-400));
  }

  .profil-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--radius-md);
    background-color: var(--color-brand-50);
    color: var(--color-brand-700);
    margin-bottom: var(--space-4);
  }

  .profil-card h3 {
    margin: 0 0 var(--space-3);
    font-size: var(--text-lg);
    font-weight: 700;
    letter-spacing: var(--tracking-tight);
  }

  .profil-card p {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    line-height: var(--leading-normal);
  }

  .misi-list {
    margin: 0;
    padding-left: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    line-height: var(--leading-normal);
  }

  /* ─── SOTK / org chart ───────────────────────────────────────────────── */
  .org {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
  }

  .org-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    min-width: 9rem;
    padding: var(--space-3) var(--space-4);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-xs);
    text-align: center;
  }

  .org-node-lead {
    min-width: 12rem;
    padding: var(--space-4) var(--space-6);
    background: linear-gradient(135deg, var(--color-brand-800), var(--color-brand-600));
    border-color: var(--color-brand-800);
  }

  .org-node-lead .org-role,
  .org-node-lead .org-name {
    color: #fff;
  }

  .org-node-lead .org-name {
    opacity: 0.85;
  }

  .org-role {
    font-size: var(--text-sm);
    font-weight: 700;
    color: var(--color-text);
  }

  .org-name {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .org-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: var(--radius-sm);
    background-color: var(--color-brand-50);
    color: var(--color-brand-700);
    margin-bottom: var(--space-1);
  }

  .org-line {
    width: 2px;
    height: 1.5rem;
    background-color: var(--color-border-strong);
    border-radius: var(--radius-full);
  }

  .org-tier {
    margin: 0;
    color: var(--color-text-muted);
  }

  .org-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-3);
    width: 100%;
  }

  .org-node-rt {
    min-width: 7.5rem;
  }

  .org-note {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  /* ─── Prestasi ───────────────────────────────────────────────────────── */
  .prestasi-grid {
    display: grid;
    gap: var(--space-4);
    grid-template-columns: 1fr;
  }

  @media (min-width: 40rem) {
    .prestasi-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 64rem) {
    .prestasi-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .prestasi-card {
    display: flex;
    flex-direction: column;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    overflow: hidden;
  }

  .prestasi-media {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 16 / 10;
    background:
      radial-gradient(circle at 30% 20%, color-mix(in oklab, var(--color-brand-300) 45%, transparent) 0%, transparent 60%),
      linear-gradient(150deg, var(--color-brand-100), var(--color-brand-50));
    color: var(--color-brand-600);
  }

  .prestasi-media-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3.25rem;
    height: 3.25rem;
    border-radius: var(--radius-full);
    background-color: color-mix(in oklab, #fff 70%, transparent);
    box-shadow: var(--shadow-sm);
  }

  .prestasi-media-hint {
    position: absolute;
    left: var(--space-3);
    bottom: var(--space-3);
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: var(--text-2xs);
    font-weight: 600;
    color: var(--color-brand-800);
    background-color: color-mix(in oklab, #fff 78%, transparent);
    border-radius: var(--radius-full);
    padding: 2px var(--space-2);
  }

  .prestasi-tahun {
    position: absolute;
    top: var(--space-3);
    right: var(--space-3);
  }

  .prestasi-body {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-4);
    flex: 1;
  }

  .prestasi-body h3 {
    margin: 0;
    font-size: var(--text-base);
    font-weight: 700;
    line-height: var(--leading-snug);
    letter-spacing: var(--tracking-tight);
  }

  .prestasi-body p {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    line-height: var(--leading-normal);
  }

  .prestasi-tag {
    margin-top: auto;
    padding-top: var(--space-2);
  }

  /* ─── Statistik ──────────────────────────────────────────────────────── */
  .stat-grid {
    display: grid;
    gap: var(--space-3);
    grid-template-columns: 1fr;
    margin-bottom: var(--space-5);
  }

  @media (min-width: 40rem) {
    .stat-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .chart-grid {
    display: grid;
    gap: var(--space-4);
    grid-template-columns: 1fr;
  }

  @media (min-width: 64rem) {
    .chart-grid {
      grid-template-columns: 1.3fr 1fr;
      align-items: start;
    }
  }

  /* ─── Footer ─────────────────────────────────────────────────────────── */
  .site-footer {
    background-color: var(--color-brand-950);
    color: color-mix(in oklab, #fff 82%, transparent);
    padding-top: var(--space-10);
  }

  .footer-inner {
    display: grid;
    gap: var(--space-6);
    grid-template-columns: 1fr;
    padding-bottom: var(--space-8);
  }

  @media (min-width: 48rem) {
    .footer-inner {
      grid-template-columns: 1.5fr 1fr 1fr;
      align-items: start;
    }
  }

  .footer-brand {
    display: flex;
    gap: var(--space-3);
    align-items: flex-start;
  }

  .footer-brand strong {
    display: block;
    color: #fff;
    font-size: var(--text-base);
    letter-spacing: var(--tracking-tight);
  }

  .footer-brand p {
    margin: var(--space-1) 0 0;
    font-size: var(--text-sm);
    max-width: 22rem;
  }

  .footer-contact p,
  .footer-nav a {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: color-mix(in oklab, #fff 82%, transparent);
    text-decoration: none;
  }

  .footer-contact p {
    margin: 0 0 var(--space-2);
  }

  .footer-nav {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .footer-nav a:hover {
    color: #fff;
    text-decoration: underline;
  }

  .footer-bottom {
    border-top: 1px solid color-mix(in oklab, #fff 15%, transparent);
    padding-block: var(--space-4);
  }

  .footer-bottom p {
    margin: 0;
    font-size: var(--text-xs);
    color: color-mix(in oklab, #fff 62%, transparent);
  }
</style>
