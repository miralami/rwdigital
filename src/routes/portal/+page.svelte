<script lang="ts">
  import QrCode from '@lucide/svelte/icons/qr-code';
  import Info from '@lucide/svelte/icons/info';
  import Megaphone from '@lucide/svelte/icons/megaphone';
  import CircleCheckBig from '@lucide/svelte/icons/circle-check-big';
  import FileText from '@lucide/svelte/icons/file-text';
  import Plus from '@lucide/svelte/icons/plus';
  import Home from '@lucide/svelte/icons/home';
  import Users from '@lucide/svelte/icons/users';
  import User from '@lucide/svelte/icons/user';
  import ClipboardEdit from '@lucide/svelte/icons/clipboard-edit';
  import Card from '$lib/components/Card.svelte';
  import ListRow from '$lib/components/ListRow.svelte';
  import Button from '$lib/components/Button.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import {
    formatRupiah,
    formatTanggal
  } from '$lib/format';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  const belumBayar = $derived(data.iuran?.status === 'belum_bayar');

  function maskNik(nik: string): string {
    if (!nik || nik.length < 8) return nik;
    return nik.slice(0, 4) + '••••••••' + nik.slice(-4);
  }

  function labelHubunganKk(status: string): string {
    const map: Record<string, string> = {
      kepala_keluarga: 'Kepala Keluarga',
      istri: 'Istri',
      anak: 'Anak',
      lainnya: 'Lainnya'
    };
    return map[status] ?? status;
  }

  function labelJK(jk: string): string {
    return jk === 'L' ? 'Laki-laki' : 'Perempuan';
  }

  function hitungUsia(tglStr: string): number {
    const tgl = new Date(tglStr);
    if (isNaN(tgl.getTime())) return 0;
    const sekarang = new Date();
    let usia = sekarang.getFullYear() - tgl.getFullYear();
    const belumUlangTahun =
      sekarang.getMonth() < tgl.getMonth() ||
      (sekarang.getMonth() === tgl.getMonth() && sekarang.getDate() < tgl.getDate());
    if (belumUlangTahun) usia--;
    return Math.max(0, usia);
  }
</script>

<div class="portal-page">
  {#if !data.terhubung}
    <p class="contoh-banner">
      <Info size={16} />
      <span>Akun Anda belum terhubung dengan data warga kependudukan. Hubungi Admin RW untuk penautan akun.</span>
    </p>
  {/if}

  <!-- 1. Iuran bulan ini / status tagihan -->
  {#if data.iuran}
    <section id="iuran" aria-labelledby="iuran-judul">
      <Card tone={belumBayar ? 'warning' : 'success'} padded={false}>
        <div class="iuran-body">
          <div class="iuran-top">
            <p class="label-caps" id="iuran-judul">
              {data.iuran.namaJenis} ({data.iuran.bulan})
            </p>
            <Badge variant={belumBayar ? 'warning' : 'success'}>
              {belumBayar ? 'Belum bayar' : 'Lunas'}
            </Badge>
          </div>

          <p class="iuran-nominal">{formatRupiah(data.iuran.nominal)}</p>

          {#if belumBayar}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              href="/portal/iuran"
              icon={QrCode}
            >
              Lihat tagihan &amp; bayar
            </Button>
            <p class="iuran-note">
              Rincian semua tagihan, konfirmasi pembayaran tunai/transfer, dan riwayat pembayaran
              ada di halaman Tagihan &amp; pembayaran.
            </p>
          {:else}
            <p class="iuran-meta">Iuran untuk periode ini telah berstatus lunas.</p>
            <Button variant="secondary" size="md" fullWidth href="/portal/iuran">
              Lihat semua tagihan
            </Button>
          {/if}
        </div>
      </Card>
    </section>
  {/if}

  <!-- 2. Data KK & Anggota Keluarga (KP-04) -->
  {#if data.terhubung && data.warga}
    <section id="kk" aria-labelledby="kk-judul">
      <!-- Profil Warga -->
      <Card padded={false}>
        <div class="kk-header">
          <Home size={18} class="kk-icon" />
          <div class="kk-header-text">
            <h2 class="kk-title" id="kk-judul">Data Kartu Keluarga</h2>
            <p class="kk-subtitle">No. KK: {data.warga.noKk}</p>
          </div>
          <a href="/portal/perbaruan" class="btn btn-secondary btn-sm kk-perbaruan-btn">
            <ClipboardEdit size={13} />
            <span>Ajukan Pembaruan</span>
          </a>
        </div>

        <div class="kk-detail-grid">
          <div class="kk-detail-item">
            <span class="kk-detail-label">Alamat</span>
            <span class="kk-detail-val">{data.warga.alamat}</span>
          </div>
          <div class="kk-detail-item">
            <span class="kk-detail-label">Wilayah</span>
            <span class="kk-detail-val">RT {data.warga.nomorRt}</span>
          </div>
          <div class="kk-detail-item">
            <span class="kk-detail-label">Status Huni</span>
            <span class="kk-detail-val kk-huni">{data.warga.statusHuni}</span>
          </div>
        </div>

        <div class="kk-profil-grid">
          <div class="kk-profil-item">
            <span class="kk-detail-label">NIK</span>
            <span class="kk-detail-val kk-nik">{maskNik(data.warga.nik)}</span>
          </div>
          <div class="kk-profil-item">
            <span class="kk-detail-label">Nama Lengkap</span>
            <span class="kk-detail-val">{data.warga.nama}</span>
          </div>
          <div class="kk-profil-item">
            <span class="kk-detail-label">Tempat, Tgl Lahir</span>
            <span class="kk-detail-val">
              {data.warga.tempatLahir}, {formatTanggal(data.warga.tanggalLahir)}
            </span>
          </div>
          <div class="kk-profil-item">
            <span class="kk-detail-label">Jenis Kelamin</span>
            <span class="kk-detail-val">{labelJK(data.warga.jenisKelamin)}</span>
          </div>
          <div class="kk-profil-item">
            <span class="kk-detail-label">Agama</span>
            <span class="kk-detail-val">{data.warga.agama}</span>
          </div>
          {#if data.warga.pekerjaan}
            <div class="kk-profil-item">
              <span class="kk-detail-label">Pekerjaan</span>
              <span class="kk-detail-val">{data.warga.pekerjaan}</span>
            </div>
          {/if}
          {#if data.warga.pendidikan}
            <div class="kk-profil-item">
              <span class="kk-detail-label">Pendidikan</span>
              <span class="kk-detail-val">{data.warga.pendidikan}</span>
            </div>
          {/if}
          <div class="kk-profil-item">
            <span class="kk-detail-label">Status Perkawinan</span>
            <span class="kk-detail-val">{data.warga.statusPerkawinan.replace(/_/g, ' ')}</span>
          </div>
          <div class="kk-profil-item">
            <span class="kk-detail-label">Hubungan dalam KK</span>
            <span class="kk-detail-val">{labelHubunganKk(data.warga.statusHubunganKk)}</span>
          </div>
        </div>
      </Card>

      <!-- Anggota KK -->
      {#if data.anggotaKk.length > 0}
        <Card padded={false}>
          <div class="anggota-header">
            <Users size={18} class="kk-icon" />
            <h2 class="kk-title">Anggota Keluarga</h2>
            <span class="anggota-count">{data.anggotaKk.length} orang</span>
          </div>
          <div class="anggota-list">
            {#each data.anggotaKk as anggota (anggota.id)}
              <div class="anggota-row" class:anggota-nonaktif={!anggota.aktif}>
                <div class="anggota-avatar">
                  <User size={14} />
                </div>
                <div class="anggota-info">
                  <div class="anggota-name-row">
                    <span class="anggota-name">{anggota.nama}</span>
                    {#if !anggota.aktif}
                      <Badge variant="default">Nonaktif</Badge>
                    {/if}
                    {#if anggota.id === data.warga?.id}
                      <Badge variant="brand">Anda</Badge>
                    {/if}
                  </div>
                  <p class="anggota-meta">
                    {labelHubunganKk(anggota.statusHubunganKk)} ·
                    {labelJK(anggota.jenisKelamin)} ·
                    {hitungUsia(anggota.tanggalLahir)} tahun
                  </p>
                </div>
                <span class="anggota-nik">{maskNik(anggota.nik)}</span>
              </div>
            {/each}
          </div>
        </Card>
      {/if}
    </section>
  {/if}

  <!-- 3. Modul Pengajuan Surat Warga (SF-SR-01..03) -->
  <section id="surat" aria-labelledby="surat-judul">
    <Card title="Pengajuan Surat Saya" padded={false}>
      <div class="surat-header-bar">
        <a href="/portal/surat/ajukan" class="btn btn-primary btn-sm">
          <Plus size={15} />
          <span>Ajukan Surat Baru</span>
        </a>
      </div>

      {#if data.daftarSurat && data.daftarSurat.length > 0}
        <div class="rows">
          {#each data.daftarSurat as s (s.id)}
            <div class="surat-row">
              <div class="surat-info">
                <div class="surat-title-row">
                  <span class="surat-title">Surat {s.jenis.toUpperCase()}</span>
                  {#if s.status === 'diajukan'}
                    <Badge variant="warning">Diajukan</Badge>
                  {:else if s.status === 'diverifikasi'}
                    <Badge variant="brand">Diverifikasi</Badge>
                  {:else if s.status === 'disetujui'}
                    <Badge variant="success">Disetujui</Badge>
                  {:else}
                    <Badge variant="danger">Ditolak</Badge>
                  {/if}
                </div>
                <p class="surat-meta">
                  Keperluan: {s.keperluan} • Diajukan: {formatTanggal(s.createdAt)}
                </p>
                {#if s.nomorSurat}
                  <p class="surat-no">Nomor: {s.nomorSurat}</p>
                {/if}
                {#if s.catatanPengurus}
                  <p class="surat-catatan">Catatan: {s.catatanPengurus}</p>
                {/if}
              </div>

              {#if s.status === 'disetujui'}
                <a
                  href="/portal/surat/{s.id}/cetak"
                  target="_blank"
                  rel="noreferrer"
                  class="btn btn-secondary btn-sm"
                >
                  <FileText size={14} />
                  <span>Unduh PDF</span>
                </a>
              {/if}
            </div>
          {/each}
        </div>
      {:else}
        <EmptyState
          compact
          icon={FileText}
          message="Belum ada permohonan surat"
          description="Anda dapat mengajukan surat pengantar atau keterangan melalui tombol di atas."
        />
      {/if}
    </Card>
  </section>

  <!-- 4. Pengumuman RW -->
  <section id="info" aria-labelledby="info-judul">
    <Card title="Pengumuman RW" padded={false}>
      {#if data.pengumuman.length > 0}
        <div class="rows">
          {#each data.pengumuman as info (info.id)}
            <ListRow title={info.judul} meta={formatTanggal(info.tanggal)} icon={Megaphone} />
          {/each}
        </div>
      {:else}
        <EmptyState
          compact
          icon={Megaphone}
          message="Belum ada pengumuman"
          description="Pengumuman dari pengurus RW akan tampil di sini."
        />
      {/if}
    </Card>
  </section>

  <!-- 5. Riwayat pembayaran iuran -->
  <section aria-labelledby="riwayat-judul">
    <Card title="Riwayat pembayaran iuran" padded={false}>
      {#if data.riwayatPembayaran.length > 0}
        <div class="rows">
          {#each data.riwayatPembayaran as bayar (bayar.id)}
            <ListRow
              title={bayar.keterangan}
              meta={formatTanggal(bayar.tanggal)}
              value={formatRupiah(bayar.nominal)}
              tone="success"
            />
          {/each}
        </div>
      {:else}
        <EmptyState
          compact
          icon={CircleCheckBig}
          message="Belum ada pembayaran"
          description="Riwayat iuran yang sudah Anda bayar akan tercatat di sini."
        />
      {/if}
    </Card>
  </section>
</div>

<style>
  .portal-page {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .contoh-banner {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2);
    margin: 0;
    padding: var(--space-3);
    border: 1px dashed var(--color-warning);
    border-radius: var(--radius-md);
    background-color: var(--color-surface);
    font-size: var(--text-sm);
    line-height: var(--leading-snug);
    color: var(--color-text);
  }
  .contoh-banner :global(svg) {
    flex-shrink: 0;
    margin-top: 0.125rem;
    color: var(--color-warning);
  }

  /* ─── KK section ─── */
  #kk {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .kk-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-5);
    border-bottom: 1px solid var(--color-border);
  }

  .kk-header :global(svg),
  .anggota-header :global(svg) {
    color: var(--color-brand-600);
    flex-shrink: 0;
  }

  .kk-header-text {
    flex: 1;
    min-width: 0;
  }

  .kk-title {
    margin: 0;
    font-size: var(--text-base);
    font-weight: 700;
    color: var(--color-text);
  }

  .kk-subtitle {
    margin: 0.125rem 0 0;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    font-variant-numeric: tabular-nums;
  }

  .kk-perbaruan-btn {
    flex-shrink: 0;
    margin-left: auto;
  }

  .kk-detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: var(--space-1);
    padding: var(--space-4) var(--space-5);
    background: var(--color-surface-muted);
    border-bottom: 1px solid var(--color-border);
  }

  .kk-profil-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    gap: var(--space-3);
    padding: var(--space-4) var(--space-5);
  }

  .kk-detail-item,
  .kk-profil-item {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .kk-detail-label {
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .kk-detail-val {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--color-text);
  }

  .kk-nik {
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.04em;
  }

  .kk-huni {
    text-transform: capitalize;
  }

  /* ─── Anggota KK ─── */
  .anggota-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-5);
    border-bottom: 1px solid var(--color-border);
  }

  .anggota-count {
    margin-left: auto;
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--color-text-muted);
    background: var(--color-surface-muted);
    padding: 0.125rem var(--space-2);
    border-radius: var(--radius-full);
  }

  .anggota-list {
    display: flex;
    flex-direction: column;
  }

  .anggota-row {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-5);
    border-bottom: 1px solid var(--color-border);
    transition: background 0.1s;
  }

  .anggota-row:last-child { border-bottom: none; }
  .anggota-nonaktif { opacity: 0.55; }

  .anggota-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    flex-shrink: 0;
    background: var(--color-surface-muted);
    border-radius: var(--radius-full);
    color: var(--color-text-muted);
  }

  .anggota-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .anggota-name-row {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .anggota-name {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text);
  }

  .anggota-meta {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .anggota-nik {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.04em;
    flex-shrink: 0;
  }

  /* ─── Surat ─── */
  .surat-header-bar {
    padding: var(--space-3) var(--space-4);
    display: flex;
    justify-content: flex-end;
    border-bottom: 1px solid var(--color-border);
  }

  .surat-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--color-border);
    flex-wrap: wrap;
  }

  .surat-row:last-child {
    border-bottom: none;
  }

  .surat-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .surat-title-row {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .surat-title {
    font-weight: 600;
    font-size: var(--text-sm);
    color: var(--color-text-primary);
  }

  .surat-meta {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
  }

  .surat-no {
    margin: 0;
    font-size: var(--text-xs);
    font-weight: 500;
    color: var(--color-brand-600);
  }

  .surat-catatan {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--color-warning);
  }

  .rows {
    display: flex;
    flex-direction: column;
    padding: var(--space-1);
  }

  /* ─── Kartu iuran ─── */
  .iuran-body {
    display: flex;
    flex-direction: column;
    padding: var(--space-5);
  }

  .iuran-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .iuran-nominal {
    margin: var(--space-2) 0 var(--space-4);
    font-size: var(--text-4xl);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--color-text);
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }

  .iuran-meta {
    margin: 0;
    font-size: var(--text-sm);
    line-height: var(--leading-snug);
    color: var(--color-text-muted);
  }

  .iuran-note {
    margin: var(--space-3) 0 0;
    padding: var(--space-3);
    border-radius: var(--radius-md);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    font-size: var(--text-sm);
    line-height: var(--leading-normal);
    color: var(--color-text-muted);
  }

  @media (min-width: 768px) {
    .portal-page { gap: var(--space-5); }
    .iuran-body { padding: var(--space-6); }
    .iuran-nominal { font-size: var(--text-5xl); }
  }
</style>
