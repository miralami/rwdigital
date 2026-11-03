<script lang="ts">
  import Building2 from '@lucide/svelte/icons/building-2';
  import MapPin from '@lucide/svelte/icons/map-pin';
  import LogIn from '@lucide/svelte/icons/log-in';
  import ArrowDown from '@lucide/svelte/icons/arrow-down';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
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
  import Check from '@lucide/svelte/icons/check';
  import Phone from '@lucide/svelte/icons/phone';
  import FileText from '@lucide/svelte/icons/file-text';
  import Wallet from '@lucide/svelte/icons/wallet';
  import Megaphone from '@lucide/svelte/icons/megaphone';
  import Menu from '@lucide/svelte/icons/menu';
  import X from '@lucide/svelte/icons/x';
  import Card from '$lib/components/Card.svelte';
  import BarChart from '$lib/components/BarChart.svelte';
  import DonutChart from '$lib/components/DonutChart.svelte';
  import type { Component } from 'svelte';
  import type {
    AgendaPublik,
    KategoriPengumuman,
    PengumumanPublik,
    PengurusPublik,
    StatistikPublik
  } from '$lib/types';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  // ─── Konten profil RW dari pengaturan ───────────────────────────────────
  // Nilai default tetap ada di server ($lib/server), jadi halaman tidak pernah
  // kosong walau pengurus belum mengisi apa pun.
  const visi = $derived(data.pengaturan.visi);
  const misi = $derived(data.pengaturan.misi);
  const sejarah = $derived(data.pengaturan.sejarah);
  const kontak = $derived(data.pengaturan.kontak);

  /**
   * Latar hero bisa berupa warna hex atau gambar unggahan. Nilai sudah
   * divalidasi di server (hanya `#rrggbb` atau path `/uploads/landing/...`).
   */
  const heroStyle = $derived.by(() => {
    const bg = data.pengaturan.heroBackground;
    if (!bg) return '';
    if (bg.startsWith('#')) return `background-color: ${bg};`;
    return `background-image: linear-gradient(180deg, rgba(9, 20, 38, 0.72), rgba(9, 20, 38, 0.82)), url(${JSON.stringify(bg)}); background-size: cover; background-position: center;`;
  });

  const galeri = $derived(data.galeri);

  // ─── Layanan cepat (hero → tindakan nyata) ───────────────────────────────
  // Semua menuju area terautentikasi; pengunjung anonim diarahkan ke /login.
  type Layanan = {
    label: string;
    keterangan: string;
    href: string;
    icon: Component<any>;
  };

  const layananCepat: Layanan[] = [
    { label: 'Ajukan Surat', keterangan: 'Domisili, SKTM, dll.', href: '/login', icon: FileText },
    { label: 'Bayar Iuran', keterangan: 'Tagihan & riwayat', href: '/login', icon: Wallet },
    { label: 'Pengumuman', keterangan: 'Info & agenda RW', href: '#pengumuman', icon: Megaphone },
    { label: 'Kontak Pengurus', keterangan: 'Balai RW & jam layanan', href: '#kontak', icon: Phone }
  ];

  // ─── SOTK / bagan pengurus ──────────────────────────────────────────────
  // Sumber data: tabel `pengurus` (dikelola di /pengaturan/pengurus).
  // Cast eksplisit karena tipe `PageData` hasil generik `PageServerLoad` di
  // SvelteKit melebar ke `any` (lihat catatan di +page.server.ts).
  const daftarPengurus = $derived(data.pengurus as PengurusPublik[]);
  const pengurusRw = $derived(daftarPengurus.filter((p) => p.nomorRt === null));
  const pengurusRt = $derived(
    daftarPengurus
      .filter((p) => p.nomorRt !== null)
      .sort((a, b) => (a.nomorRt ?? 0) - (b.nomorRt ?? 0))
  );

  const ketuaRw = $derived(pengurusRw.find((p) => /ketua/i.test(p.jabatan)) ?? pengurusRw[0] ?? null);
  const pimpinanInti = $derived(pengurusRw.filter((p) => p.id !== ketuaRw?.id));
  const seksiBidang = $derived(pimpinanInti);

  /** Ikon dekoratif per seksi; dicocokkan dari kata kunci jabatan. */
  function ikonSeksi(jabatan: string): Component<any> {
    const j = jabatan.toLowerCase();
    if (j.includes('keamanan')) return ShieldCheck;
    if (j.includes('kebersihan') || j.includes('lingkungan')) return Leaf;
    if (j.includes('sosial') || j.includes('kemasyarakatan')) return Handshake;
    if (j.includes('pemuda') || j.includes('olahraga')) return Sparkles;
    if (j.includes('keagamaan')) return HeartPulse;
    return ListChecks;
  }

  function inisial(nama: string): string {
    return nama
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((bagian) => bagian[0]?.toUpperCase() ?? '')
      .join('');
  }

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

  // ─── Data dari server (agregat + pengumuman) ────────────────────────────
  const stat: StatistikPublik = $derived(data.statistik);

  // Diberi tipe eksplisit agar indexing `kategoriMeta[info.kategori]` tetap
  // type-safe walau bentuk PageData yang di-generate belum lengkap.
  const pengumumanTerbaru: PengumumanPublik[] = $derived(data.pengumumanTerbaru ?? []);
  const agenda: AgendaPublik[] = $derived(data.agenda ?? []);

  const barData = $derived(
    stat.perRt.map((r) => ({ label: `RT ${String(r.nomor).padStart(2, '0')}`, value: r.totalWarga }))
  );

  const usiaSegments = $derived([
    { label: 'Anak & remaja (0–14)', value: stat.usia.anak, color: 'var(--color-brand-300)' },
    { label: 'Usia produktif (15–64)', value: stat.usia.produktif, color: 'var(--color-brand-600)' },
    { label: 'Lansia (65+)', value: stat.usia.lansia, color: 'var(--color-warning)' }
  ]);

  const navLinks = $derived([
    { href: '#profil', label: 'Profil' },
    { href: '#pengumuman', label: 'Pengumuman' },
    { href: '#statistik', label: 'Statistik' },
    ...(galeri.length > 0 ? [{ href: '#galeri', label: 'Galeri' }] : []),
    { href: '#prestasi', label: 'Prestasi' },
    { href: '#struktur', label: 'Struktur' }
  ]);

  // ─── Label & warna badge kategori pengumuman ────────────────────────────
  // Satu sumber pemetaan, sama dengan halaman dashboard/pengumuman.
  const kategoriMeta: Record<
    KategoriPengumuman,
    { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand' }
  > = {
    umum: { label: 'Umum', variant: 'default' },
    kegiatan: { label: 'Kegiatan', variant: 'brand' },
    keuangan: { label: 'Keuangan', variant: 'success' },
    darurat: { label: 'Darurat', variant: 'danger' }
  };

  // ─── Menu seluler ───────────────────────────────────────────────────────
  // Sebelumnya nav hilang total di bawah 56rem tanpa pengganti. Sekarang ada
  // tombol menu + panel yang benar-benar bisa dibuka.
  let menuTerbuka = $state(false);
  function tutupMenu() {
    menuTerbuka = false;
  }
</script>

<svelte:head>
  <title>RW 06 Kota Baru — Portal Informasi Warga</title>
  <meta
    name="description"
    content="Profil, struktur pengurus, prestasi lingkungan, pengumuman, dan statistik kependudukan RW 06 Kelurahan Kota Baru, Kecamatan Bekasi Barat, Kota Bekasi."
  />
</svelte:head>

<div class="landing">
  <!-- ─── Header ───────────────────────────────────────────────────────── -->
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

      <div class="header-actions">
        <a class="btn btn-primary btn-sm header-cta" href="/login">
          <LogIn size={15} />
          <span>Masuk</span>
        </a>
        <button
          class="btn btn-secondary btn-sm menu-btn"
          type="button"
          aria-label={menuTerbuka ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={menuTerbuka}
          aria-controls="menu-seluler"
          onclick={() => (menuTerbuka = !menuTerbuka)}
        >
          {#if menuTerbuka}<X size={16} />{:else}<Menu size={16} />{/if}
        </button>
      </div>
    </div>

    <nav id="menu-seluler" class="mobile-nav" class:open={menuTerbuka} aria-label="Navigasi seluler">
      <div class="container">
        {#each navLinks as link (link.href)}
          <a href={link.href} onclick={tutupMenu}>{link.label}</a>
        {/each}
        <a href="/login" onclick={tutupMenu}>
          <LogIn size={15} />
          <span>Masuk Portal</span>
        </a>
      </div>
    </nav>
  </header>

  <main id="top">
    <!-- ─── Hero (Portal Resmi) ───────────────────────────────────────── -->
    <section class="hero" aria-labelledby="hero-title" style={heroStyle}>
      <div class="container hero-grid">
        <div class="hero-copy">
          <p class="eyebrow hero-eyebrow">Portal Informasi Warga</p>
          <h1 id="hero-title">{data.pengaturan.heroJudul}</h1>
          <p class="hero-loc">
            <MapPin size={16} />
            <span>{kontak.alamat}</span>
          </p>
          <p class="hero-lead">{data.pengaturan.heroSubjudul}</p>
          <div class="hero-actions">
            <a class="btn btn-onlight btn-lg" href="#pengumuman">
              <span>Lihat pengumuman</span>
              <ArrowDown size={16} />
            </a>
            <a class="btn btn-outline-light btn-lg" href="#statistik">Statistik warga</a>
          </div>
        </div>

        <!-- Layanan cepat mengisi sisi kanan hero -->
        <aside class="quick" aria-labelledby="quick-title">
          <div class="quick-head">
            <h2 id="quick-title">Layanan Cepat</h2>
            <p>Layanan yang paling sering dibutuhkan warga</p>
          </div>
          <div class="quick-list">
            {#each layananCepat as item (item.label)}
              {@const LayananIcon = item.icon}
              <a class="quick-item" href={item.href}>
                <span class="quick-icon"><LayananIcon size={18} /></span>
                <span class="quick-text">
                  <strong>{item.label}</strong>
                  <small>{item.keterangan}</small>
                </span>
                <ChevronRight size={16} class="quick-chev" />
              </a>
            {/each}
          </div>
        </aside>
      </div>
    </section>

    <!-- ─── Pengumuman & Agenda ───────────────────────────────────────── -->
    <section class="section" id="pengumuman" aria-labelledby="pengumuman-title">
      <div class="container">
        <header class="section-head">
          <p class="eyebrow">Informasi Terkini</p>
          <h2 id="pengumuman-title">Pengumuman &amp; Agenda</h2>
          <p class="section-sub">Kabar dan jadwal kegiatan terbaru dari pengurus RW 06.</p>
        </header>

        <div class="news-grid">
          <div class="news-list">
            {#if pengumumanTerbaru.length > 0}
              {#each pengumumanTerbaru as info (info.id)}
                {@const meta = kategoriMeta[info.kategori]}
                <article class="card news-item">
                  <div class="news-date" aria-hidden="true">
                    <b>{info.hari}</b>
                    <span>{info.bulan}</span>
                  </div>
                  <div class="news-body">
                    <div class="news-meta">
                      <span class="badge variant-{meta.variant}">{meta.label}</span>
                      <time class="news-time">{info.tanggal}</time>
                    </div>
                    <h3>{info.judul}</h3>
                    <p>{info.isi}</p>
                  </div>
                </article>
              {/each}
            {:else}
              <p class="news-empty">
                Belum ada pengumuman yang dipublikasikan. Pengurus akan menampilkan kabar terbaru di
                sini.
              </p>
            {/if}
          </div>

          <aside class="card agenda" aria-labelledby="agenda-title">
            <h3 id="agenda-title">Agenda Mendatang</h3>
            {#if agenda.length > 0}
              {#each agenda as acara (acara.id)}
                <div class="agenda-item">
                  <div class="agenda-when" aria-hidden="true">
                    <b>{acara.hari}</b>
                    <span>{acara.bulan}</span>
                  </div>
                  <div>
                    <h4>{acara.judul}</h4>
                    <p>{acara.tanggal} · Balai RW 06</p>
                  </div>
                </div>
              {/each}
            {:else}
              <p class="agenda-empty">Belum ada agenda terjadwal.</p>
            {/if}
          </aside>
        </div>
      </div>
    </section>

    <!-- ─── Statistik ─────────────────────────────────────────────────── -->
    <section class="section section-alt" id="statistik" aria-labelledby="statistik-title">
      <div class="container">
        <header class="section-head">
          <p class="eyebrow">Data Kependudukan</p>
          <h2 id="statistik-title">Statistik Publik RW 06</h2>
          <p class="section-sub">
            Ringkasan agregat kependudukan lingkungan. Data disajikan tanpa identitas pribadi warga.
          </p>
        </header>

        <div class="kpi-row">
          <div class="kpi kpi-accent">
            <div class="k-label">Total warga aktif</div>
            <div class="k-value">{stat.totalWarga}</div>
            <div class="k-desc">{stat.totalKk} KK · {stat.totalRt} RT</div>
          </div>
          <div class="kpi">
            <div class="k-label">Kelahiran baru</div>
            <div class="k-value">{stat.kelahiranBaru}</div>
            <div class="k-desc">Sepanjang tahun {data.tahunIni}</div>
          </div>
          <div class="kpi">
            <div class="k-label">Rasio usia produktif</div>
            <div class="k-value">{stat.rasioProduktif}%</div>
            <div class="k-desc">Usia 15–64 tahun</div>
          </div>
          <div class="kpi">
            <div class="k-label">Kepala keluarga</div>
            <div class="k-value">{stat.totalKk}</div>
            <div class="k-desc">Terdaftar di {stat.totalRt} RT</div>
          </div>
        </div>

        <div class="chart-grid">
          <Card title="Distribusi penduduk per RT" description="Jumlah warga aktif tiap wilayah RT">
            <BarChart data={barData} unit="jiwa" emptyMessage="Data wilayah RT belum tersedia." />
          </Card>

          <Card
            title="Komposisi usia warga"
            description="Proporsi usia produktif dibanding anak dan lansia"
          >
            <DonutChart
              segments={usiaSegments}
              centerValue={stat.usia.total}
              centerLabel="Total jiwa"
              unit="jiwa"
              emptyMessage="Data usia warga belum tersedia."
            />
          </Card>
        </div>

        <p class="data-note">
          Data agregat diperbarui otomatis dari basis data RW dan tidak memuat identitas pribadi.
        </p>
      </div>
    </section>

    <!-- ─── Profil RW ─────────────────────────────────────────────────── -->
    <section class="section" id="profil" aria-labelledby="profil-title">
      <div class="container">
        <header class="section-head">
          <p class="eyebrow">Profil Wilayah</p>
          <h2 id="profil-title">Tentang RW 06</h2>
          <p class="section-sub">Sambutan pengurus, visi &amp; misi, serta sejarah singkat lingkungan.</p>
        </header>

        <!-- Sambutan besar: potret + kutipan utama (gaya "wajah lingkungan") -->
        <div class="sambutan">
          {#if data.pengaturan.fotoKetua}
            <img
              class="portrait portrait-foto"
              src={data.pengaturan.fotoKetua}
              alt={`Foto ${data.pengaturan.namaKetua}`}
              loading="lazy"
            />
          {:else}
            <div class="ph portrait" aria-hidden="true">
              <span class="ph-label">
                <ImageIcon size={14} />
                <span>Foto Ketua RW</span>
              </span>
            </div>
          {/if}
          <div class="sambutan-copy">
            <p class="eyebrow">Sambutan</p>
            <blockquote>
              <p>“{data.pengaturan.sambutan}”</p>
              <footer class="who">
                {#if data.pengaturan.fotoKetua}
                  <img
                    class="avatar avatar-sm avatar-foto"
                    src={data.pengaturan.fotoKetua}
                    alt=""
                    aria-hidden="true"
                  />
                {:else}
                  <span class="avatar avatar-sm" aria-hidden="true">
                    {inisial(data.pengaturan.namaKetua)}
                  </span>
                {/if}
                <span>
                  <b>{data.pengaturan.namaKetua}</b>
                  <small>Ketua RW 06 · Kota Baru</small>
                </span>
              </footer>
            </blockquote>
          </div>
        </div>

        <div class="profil-cards">
          <article class="card mini">
            <h3><Target size={18} /> Visi</h3>
            <p>{visi}</p>
          </article>

          <article class="card mini">
            <h3><ListChecks size={18} /> Misi</h3>
            <ul class="check-list">
              {#each misi as item}
                <li>
                  <Check size={15} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              {/each}
            </ul>
          </article>
        </div>

        <article class="card mini sejarah">
          <h3><BookOpen size={18} /> Sejarah Singkat</h3>
          <p>{sejarah}</p>
        </article>
      </div>
    </section>

    <!-- ─── Prestasi ──────────────────────────────────────────────────── -->
    <section class="section section-alt" id="prestasi" aria-labelledby="prestasi-title">
      <div class="container">
        <header class="section-head">
          <p class="eyebrow">Prestasi Lingkungan</p>
          <h2 id="prestasi-title">Pencapaian &amp; Dokumentasi</h2>
          <p class="section-sub">
            Daftar pencapaian lingkungan RW 06. Foto bukti ditambahkan oleh pengurus saat tersedia.
          </p>
        </header>

        <div class="prestasi-grid">
          {#each prestasi as item (item.judul)}
            {@const PrestasiIcon = item.icon}
            <article class="card prestasi">
              <div class="prestasi-top">
                <span class="prestasi-icon"><PrestasiIcon size={22} /></span>
                <span class="badge variant-brand">{item.tahun}</span>
              </div>
              <h3>{item.judul}</h3>
              <p>{item.deskripsi}</p>
              <span class="prestasi-tag label-caps">{item.kategori}</span>
            </article>
          {/each}
        </div>
      </div>
    </section>

    <!-- ─── Galeri ────────────────────────────────────────────────────── -->
    {#if galeri.length > 0}
      <section class="section" id="galeri" aria-labelledby="galeri-title">
        <div class="container">
          <header class="section-head">
            <p class="eyebrow">Dokumentasi Lingkungan</p>
            <h2 id="galeri-title">Galeri RW 06</h2>
            <p class="section-sub">Kegiatan, fasilitas, dan momen kebersamaan warga.</p>
          </header>

          <div class="galeri-grid">
            {#each galeri as foto (foto.id)}
              <figure class="galeri-item">
                <img src={foto.fotoUrl} alt={foto.judul} loading="lazy" />
                <figcaption>
                  <strong>{foto.judul}</strong>
                  {#if foto.keterangan}<span>{foto.keterangan}</span>{/if}
                </figcaption>
              </figure>
            {/each}
          </div>
        </div>
      </section>
    {/if}

    <!-- ─── Struktur Organisasi ───────────────────────────────────────── -->
    <section class="section" id="struktur" aria-labelledby="struktur-title">
      <div class="container">
        <header class="section-head">
          <p class="eyebrow">Struktur Organisasi &amp; Tata Kerja</p>
          <h2 id="struktur-title">Bagan Pengurus</h2>
          <p class="section-sub">
            Susunan kepengurusan RW 06 beserta seksi bidang dan kewilayahan RT.
          </p>
        </header>

        <div class="org">
          <div class="node node-lead">
            {#if ketuaRw?.fotoUrl}
              <img class="node-foto node-foto-lead" src={ketuaRw.fotoUrl} alt="" loading="lazy" />
            {/if}
            <span class="node-role">Ketua RW 06</span>
            <span class="node-name">{ketuaRw?.nama ?? data.pengaturan.namaKetua}</span>
          </div>

          {#if pimpinanInti.length > 0}
            <p class="tier-label">Pimpinan Inti</p>
            <div class="branch">
              {#each pimpinanInti as p (p.id)}
                <div class="node">
                  {#if p.fotoUrl}
                    <img class="node-foto" src={p.fotoUrl} alt="" loading="lazy" />
                  {/if}
                  <span class="node-role">{p.jabatan}</span>
                  <span class="node-name">{p.nama}</span>
                </div>
              {/each}
            </div>
          {/if}

          {#if seksiBidang.length > 0}
            <p class="tier-label">Seksi Bidang</p>
            <div class="branch">
              {#each seksiBidang as s (s.id)}
                {@const SeksiIcon = ikonSeksi(s.jabatan)}
                <div class="node node-seksi">
                  {#if s.fotoUrl}
                    <img class="node-foto" src={s.fotoUrl} alt="" loading="lazy" />
                  {:else}
                    <span class="node-icon"><SeksiIcon size={16} /></span>
                  {/if}
                  <span class="node-role">{s.jabatan}</span>
                  <span class="node-name">{s.nama}</span>
                </div>
              {/each}
            </div>
          {/if}

          <p class="tier-label">Kewilayahan</p>
          <div class="branch">
            {#if pengurusRt.length > 0}
              {#each pengurusRt as p (p.id)}
                <div class="node node-rt">
                  {#if p.fotoUrl}
                    <img class="node-foto" src={p.fotoUrl} alt="" loading="lazy" />
                  {/if}
                  <span class="node-role">{p.jabatan} {String(p.nomorRt).padStart(2, '0')}</span>
                  <span class="node-name">{p.nama}</span>
                </div>
              {/each}
            {:else if stat.perRt.length > 0}
              {#each stat.perRt as r (r.nomor)}
                <div class="node node-rt">
                  <span class="node-role">Ketua RT {String(r.nomor).padStart(2, '0')}</span>
                  <span class="node-name">Belum diisi</span>
                </div>
              {/each}
            {:else}
              <p class="org-note">Data wilayah RT belum tersedia.</p>
            {/if}
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- ─── Footer ───────────────────────────────────────────────────────── -->
  <footer class="site-footer" id="kontak">
    <div class="container footer-grid">
      <div class="footer-brand">
        <span class="brand-mark brand-mark-lg"><Building2 size={22} /></span>
        <div>
          <strong>RW 06 Kota Baru</strong>
          <p>{kontak.alamat}</p>
        </div>
      </div>

      <div class="footer-col">
        <h4>Jam Pelayanan</h4>
        <ul>
          <li><CalendarDays size={15} /> Senin–Jumat · 08.00–16.00</li>
          <li>Sabtu · 08.00–12.00</li>
          <li>Minggu &amp; libur nasional · tutup</li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Navigasi</h4>
        <ul>
          {#each navLinks as link (link.href)}
            <li><a href={link.href}>{link.label}</a></li>
          {/each}
          <li><a href="/login">Masuk Portal</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Kontak</h4>
        <ul>
          <li><Phone size={15} /> {kontak.telepon}</li>
          <li><a href="mailto:{kontak.email}">{kontak.email}</a></li>
        </ul>
      </div>
    </div>

    <div class="container footer-bottom">
      <p>© {data.tahunIni} RW Digital · Sistem Informasi Administrasi Rukun Warga</p>
      <p class="footer-loc">{kontak.alamat}</p>
    </div>
  </footer>
</div>

<style>
  /* ─── Page root ──────────────────────────────────────────────────────── */
  /* Halaman publik memakai body 16px (bukan 14px aplikasi) agar paragraf
     panjang tetap nyaman dibaca. Dibungkus lewat .landing supaya tidak
     mengubah kepadatan halaman aplikasi lain. */
  .landing {
    font-size: var(--text-base);
  }

  /* Label kecil di atas judul bagian. Diletakkan sebelum gaya hero agar
     `.hero-eyebrow` (warna terang di atas latar navy) menang lewat urutan. */
  .eyebrow {
    margin: 0 0 var(--space-2);
    font-size: var(--text-xs);
    font-weight: 700;
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--color-text-muted);
  }

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
    background: color-mix(in oklab, var(--color-surface) 90%, transparent);
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

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-shrink: 0;
  }

  .menu-btn {
    display: inline-flex;
  }

  @media (min-width: 56rem) {
    .site-nav {
      display: flex;
    }
    .menu-btn {
      display: none;
    }
  }

  /* Menu seluler: tersembunyi secara default, dibuka lewat state Svelte. */
  .mobile-nav {
    display: none;
    border-top: 1px solid var(--color-border);
    background: var(--color-surface);
  }

  .mobile-nav.open {
    display: block;
  }

  .mobile-nav .container {
    display: flex;
    flex-direction: column;
    padding-block: var(--space-2);
  }

  .mobile-nav a {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-2);
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text);
    text-decoration: none;
    border-bottom: 1px solid var(--color-border);
  }

  .mobile-nav a:last-child {
    border-bottom: 0;
  }

  @media (min-width: 56rem) {
    .mobile-nav {
      display: none !important;
    }
  }

  /* ─── Hero (Portal Resmi) ────────────────────────────────────────────── */
  .hero {
    position: relative;
    background: var(--color-brand-950);
    color: #fff;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      80% 70% at 88% 0%,
      color-mix(in oklab, var(--color-brand-500) 55%, transparent) 0%,
      transparent 60%
    );
  }

  .hero::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      color-mix(in oklab, #fff 10%, transparent) 1px,
      transparent 1px
    );
    background-size: 24px 24px;
    mask-image: linear-gradient(to bottom, #000, transparent 78%);
    opacity: 0.45;
  }

  .hero-grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-8);
    padding-block: var(--space-12);
    align-items: center;
  }

  @media (min-width: 64rem) {
    .hero-grid {
      grid-template-columns: 1.15fr 0.85fr;
      padding-block: var(--space-20);
    }
  }

  .hero-eyebrow {
    color: color-mix(in oklab, #fff 72%, transparent);
    margin: 0 0 var(--space-3);
  }

  .hero h1 {
    margin: 0;
    font-size: var(--text-display);
    line-height: var(--leading-display);
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .hero-loc {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin: var(--space-4) 0 0;
    font-size: var(--text-base);
    color: color-mix(in oklab, #fff 82%, transparent);
  }

  .hero-lead {
    margin: var(--space-5) 0 0;
    max-width: 34rem;
    font-size: var(--text-lg);
    line-height: var(--leading-normal);
    color: color-mix(in oklab, #fff 90%, transparent);
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    margin-top: var(--space-8);
  }

  /* Tombol di atas latar gelap: putih agar kontras cukup, plus varian garis. */
  .btn-onlight {
    background-color: #fff;
    border-color: #fff;
    color: var(--color-brand-900);
  }

  .btn-onlight:hover {
    background-color: color-mix(in oklab, #fff 88%, var(--color-brand-200));
    border-color: #fff;
  }

  .btn-outline-light {
    background-color: transparent;
    border-color: color-mix(in oklab, #fff 45%, transparent);
    color: #fff;
  }

  .btn-outline-light:hover {
    background-color: color-mix(in oklab, #fff 14%, transparent);
    border-color: #fff;
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
    max-width: 44rem;
    margin-bottom: var(--space-8);
  }

  .section-head h2 {
    margin: 0;
    font-size: var(--text-title);
    font-weight: 800;
    letter-spacing: var(--tracking-tight);
    line-height: var(--leading-tight);
  }

  .section-sub {
    margin: var(--space-3) 0 0;
    font-size: var(--text-lg);
    color: var(--color-text-muted);
  }

  .data-note {
    margin: var(--space-6) 0 0;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  /* ─── Layanan cepat (kartu di sisi kanan hero) ───────────────────────── */
  .quick {
    background: var(--color-surface);
    color: var(--color-text);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-modal);
    overflow: hidden;
  }

  .quick-head {
    padding: var(--space-4) var(--space-5);
    border-bottom: 1px solid var(--color-border);
  }

  .quick-head h2 {
    margin: 0;
    font-size: var(--text-base);
    font-weight: 700;
    letter-spacing: var(--tracking-tight);
  }

  .quick-head p {
    margin: 2px 0 0;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .quick-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .quick-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-5);
    text-decoration: none;
    color: inherit;
    border-bottom: 1px solid var(--color-border);
  }

  .quick-item:nth-child(odd) {
    border-right: 1px solid var(--color-border);
  }

  .quick-item:hover {
    background: var(--color-surface-muted);
  }

  .quick-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--radius-md);
    background: var(--color-brand-50);
    color: var(--color-brand-700);
    flex-shrink: 0;
  }

  .quick-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .quick-item strong {
    display: block;
    font-size: var(--text-sm);
    font-weight: 700;
  }

  .quick-item small {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  :global(.quick-chev) {
    margin-left: auto;
    color: var(--color-border-strong);
    flex-shrink: 0;
  }

  /* ─── Pengumuman & agenda ────────────────────────────────────────────── */
  .news-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }

  @media (min-width: 64rem) {
    .news-grid {
      grid-template-columns: 1.6fr 1fr;
      align-items: start;
    }
  }

  .news-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .news-item {
    display: grid;
    grid-template-columns: 4.5rem 1fr;
    gap: var(--space-4);
    padding: var(--space-4);
  }

  .news-date {
    text-align: center;
    align-self: start;
    border-right: 1px solid var(--color-border);
  }

  .news-date b {
    display: block;
    font-size: var(--text-2xl);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.02em;
    color: var(--color-text);
  }

  .news-date span {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .news-body h3 {
    margin: 0 0 var(--space-1);
    font-size: var(--text-lg);
    font-weight: 700;
    letter-spacing: var(--tracking-tight);
    line-height: var(--leading-snug);
  }

  .news-body p {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .news-meta {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-2);
  }

  .news-time {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .news-empty,
  .agenda-empty {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .agenda {
    padding: var(--space-5);
  }

  .agenda h3 {
    margin: 0 0 var(--space-3);
    font-size: var(--text-base);
    font-weight: 700;
    letter-spacing: var(--tracking-tight);
  }

  .agenda-item {
    display: flex;
    gap: var(--space-3);
    padding: var(--space-3) 0;
    border-bottom: 1px dashed var(--color-border);
  }

  .agenda-item:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  .agenda-when {
    flex-shrink: 0;
    width: 3rem;
    text-align: center;
    background: var(--color-brand-50);
    border: 1px solid var(--color-brand-200);
    border-radius: var(--radius-md);
    padding: 2px 0;
  }

  .agenda-when b {
    display: block;
    font-size: var(--text-base);
    font-weight: 800;
    color: var(--color-brand-800);
    line-height: 1.1;
  }

  .agenda-when span {
    font-size: var(--text-2xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--color-brand-700);
  }

  .agenda-item h4 {
    margin: 0;
    font-size: var(--text-sm);
    font-weight: 600;
  }

  .agenda-item p {
    margin: 2px 0 0;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  /* ─── Statistik ──────────────────────────────────────────────────────── */
  .kpi-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
    margin-bottom: var(--space-6);
  }

  @media (min-width: 40rem) {
    .kpi-row {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .kpi {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-5);
    box-shadow: var(--shadow-card);
  }

  .kpi .k-label {
    font-size: var(--text-xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--color-text-muted);
  }

  .kpi .k-value {
    margin-top: var(--space-2);
    font-size: var(--text-4xl);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
  }

  .kpi .k-desc {
    margin-top: 2px;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .kpi-accent {
    background: var(--color-accent);
    border-color: var(--color-accent);
  }

  .kpi-accent .k-label {
    color: color-mix(in oklab, #fff 75%, transparent);
  }

  .kpi-accent .k-value {
    color: #fff;
  }

  .kpi-accent .k-desc {
    color: color-mix(in oklab, #fff 85%, transparent);
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

  /* ─── Profil ─────────────────────────────────────────────────────────── */
  /* Sambutan besar: potret di kiri, kutipan utama di kanan. */
  .sambutan {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-8);
    align-items: center;
  }

  @media (min-width: 64rem) {
    .sambutan {
      grid-template-columns: 0.8fr 1.2fr;
    }
  }

  .portrait {
    aspect-ratio: 4 / 5;
    max-width: 26rem;
  }

  .portrait-foto {
    width: 100%;
    aspect-ratio: 4 / 5;
    max-width: 26rem;
    object-fit: cover;
    border-radius: var(--radius-xl);
    border: 1px solid var(--color-border);
    background: var(--color-surface-muted);
  }

  .avatar-foto {
    object-fit: cover;
  }

  .sambutan blockquote {
    margin: 0;
  }

  .sambutan blockquote p {
    margin: 0;
    font-size: var(--text-2xl);
    line-height: 1.4;
    letter-spacing: -0.01em;
    font-weight: 500;
    color: var(--color-text);
  }

  .sambutan .who {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-top: var(--space-5);
  }

  .sambutan .who b {
    display: block;
    font-weight: 700;
  }

  .sambutan .who small {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .sambutan-copy {
    min-width: 0;
  }

  /* Placeholder foto yang jujur (belum ada foto asli). */
  .ph {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
      repeating-linear-gradient(
        135deg,
        color-mix(in oklab, var(--color-brand-100) 55%, transparent) 0 14px,
        transparent 14px 28px
      ),
      var(--color-brand-50);
    color: var(--color-brand-600);
    border: 1px solid var(--color-brand-100);
    border-radius: var(--radius-xl);
    overflow: hidden;
  }

  .ph-label {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: 0.25rem 0.625rem;
    border-radius: var(--radius-full);
    background: color-mix(in oklab, #fff 82%, transparent);
    color: var(--color-brand-700);
    font-size: var(--text-xs);
    font-weight: 600;
  }

  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full);
    background: var(--color-brand-100);
    color: var(--color-brand-700);
    border: 1px solid var(--color-brand-200);
    font-weight: 700;
    flex-shrink: 0;
  }

  .avatar-sm {
    width: 2.25rem;
    height: 2.25rem;
    font-size: var(--text-sm);
  }

  .profil-cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-4);
    margin-top: var(--space-5);
  }

  @media (min-width: 40rem) {
    .profil-cards {
      grid-template-columns: 1fr 1fr;
    }
  }

  .mini {
    padding: var(--space-5);
  }

  .mini h3 {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin: 0 0 var(--space-3);
    font-size: var(--text-base);
    font-weight: 700;
    letter-spacing: var(--tracking-tight);
  }

  .mini h3 :global(svg) {
    color: var(--color-brand-600);
    flex-shrink: 0;
  }

  .mini p {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    line-height: var(--leading-normal);
  }

  .check-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .check-list li {
    display: flex;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    line-height: var(--leading-normal);
  }

  .check-list li :global(svg) {
    flex-shrink: 0;
    color: var(--color-success);
    margin-top: 3px;
  }

  .sejarah {
    margin-top: var(--space-5);
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

  .prestasi {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding: var(--space-5);
    border-top: 3px solid var(--color-brand-600);
  }

  .prestasi-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .prestasi-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--radius-md);
    background: var(--color-brand-50);
    color: var(--color-brand-700);
  }

  .prestasi h3 {
    margin: 0;
    font-size: var(--text-base);
    font-weight: 700;
    line-height: var(--leading-snug);
    letter-spacing: var(--tracking-tight);
  }

  .prestasi p {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    line-height: var(--leading-normal);
  }

  .prestasi-tag {
    margin-top: auto;
    padding-top: var(--space-2);
  }

  /* ─── Galeri ─────────────────────────────────────────────────────────── */
  .galeri-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }

  @media (min-width: 48rem) {
    .galeri-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 64rem) {
    .galeri-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .galeri-item {
    margin: 0;
    overflow: hidden;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
  }

  .galeri-item img {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    background: var(--color-surface-muted);
  }

  .galeri-item figcaption {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: var(--space-3);
  }

  .galeri-item strong {
    font-size: var(--text-sm);
    font-weight: 700;
  }

  .galeri-item span {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  /* ─── SOTK / bagan pengurus ──────────────────────────────────────────── */
  .org {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .node {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    min-width: 10rem;
    padding: var(--space-3) var(--space-4);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-xs);
    text-align: center;
  }

  .node-lead {
    min-width: 14rem;
    padding: var(--space-4) var(--space-6);
    background: linear-gradient(135deg, var(--color-brand-800), var(--color-brand-600));
    border-color: var(--color-brand-800);
  }

  .node-lead .node-role,
  .node-lead .node-name {
    color: #fff;
  }

  .node-lead .node-name {
    opacity: 0.85;
  }

  .node-role {
    font-size: var(--text-sm);
    font-weight: 700;
    color: var(--color-text);
  }

  .node-name {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .node-seksi {
    min-width: 9.5rem;
  }

  .node-foto {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--radius-full);
    object-fit: cover;
    margin-bottom: var(--space-1);
    border: 1px solid var(--color-border);
  }

  .node-foto-lead {
    width: 3.25rem;
    height: 3.25rem;
    border: 2px solid color-mix(in oklab, #fff 55%, transparent);
  }

  .node-icon {
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

  .node-rt {
    min-width: 8.5rem;
  }

  .tier-label {
    margin: var(--space-6) 0 0;
    font-size: var(--text-xs);
    font-weight: 700;
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--color-text-muted);
  }

  /* Fork connectors: stem turun dari induk, bus horizontal, lalu drop ke tiap
     anak node. Di layar sempit (.branch jadi kolom) garisnya menyusut jadi
     rantai vertikal, jadi tidak ada garis "menggantung". */
  .branch {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    column-gap: var(--space-4);
    row-gap: 2.5rem;
    margin-top: 2.5rem;
    --bus-overhang: 0.625rem;
  }

  .branch::before {
    /* Batang dari node induk menuju bus. */
    content: '';
    position: absolute;
    top: -2.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 1.75rem;
    background: var(--color-border-strong);
  }

  .branch > * {
    position: relative;
  }

  .branch > *::before {
    /* Drop vertikal dari bus ke atas tiap node. */
    content: '';
    position: absolute;
    top: -0.75rem;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 0.75rem;
    background: var(--color-border-strong);
  }

  .branch > *::after {
    /* Bus horizontal; tiap node menutupi setengah celah ke tetangganya. */
    content: '';
    position: absolute;
    top: -0.75rem;
    left: calc(-1 * var(--bus-overhang));
    right: calc(-1 * var(--bus-overhang));
    height: 2px;
    background: var(--color-border-strong);
  }

  .branch > *:first-child::after {
    left: 50%;
  }

  .branch > *:last-child::after {
    right: 50%;
  }

  .org-note {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  @media (max-width: 47.99rem) {
    .branch {
      flex-direction: column;
      align-items: center;
      column-gap: 0;
      row-gap: 1rem;
      margin-top: 1rem;
    }

    .branch::before {
      top: -1rem;
      height: 1rem;
    }

    .branch > *::before {
      top: -1rem;
      height: 1rem;
    }

    .branch > *::after {
      display: none;
    }
  }

  /* ─── Footer ─────────────────────────────────────────────────────────── */
  .site-footer {
    background-color: var(--color-brand-950);
    color: color-mix(in oklab, #fff 80%, transparent);
    padding-top: var(--space-12);
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-8);
    padding-bottom: var(--space-10);
  }

  @media (min-width: 48rem) {
    .footer-grid {
      grid-template-columns: 1.4fr 1fr 1fr 1fr;
    }
  }

  .site-footer h4 {
    margin: 0 0 var(--space-3);
    font-size: var(--text-xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: #fff;
    opacity: 0.85;
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

  .footer-col ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .footer-col li,
  .footer-col a {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: color-mix(in oklab, #fff 80%, transparent);
    text-decoration: none;
  }

  .footer-col a:hover {
    color: #fff;
    text-decoration: underline;
  }

  .footer-col li :global(svg) {
    flex-shrink: 0;
  }

  .footer-bottom {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2) var(--space-6);
    justify-content: space-between;
    border-top: 1px solid color-mix(in oklab, #fff 15%, transparent);
    padding-block: var(--space-4);
    font-size: var(--text-xs);
    color: color-mix(in oklab, #fff 62%, transparent);
  }

  .footer-bottom p {
    margin: 0;
  }

  .footer-loc {
    max-width: 30rem;
    text-align: right;
  }
</style>
