<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import Card from '$lib/components/Card.svelte';
  import { formatRupiah, formatTanggal } from '$lib/format';
  import Plus from '@lucide/svelte/icons/plus';
  import Tags from '@lucide/svelte/icons/tags';
  import Wallet from '@lucide/svelte/icons/wallet';
  import ArrowDownRight from '@lucide/svelte/icons/arrow-down-right';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import Download from '@lucide/svelte/icons/download';
  import Building2 from '@lucide/svelte/icons/building-2';
  import Home from '@lucide/svelte/icons/home';
  import Receipt from '@lucide/svelte/icons/receipt';
  import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
  import Clock from '@lucide/svelte/icons/clock';
  import AlertCircle from '@lucide/svelte/icons/alert-circle';
  import HeartHandshake from '@lucide/svelte/icons/heart-handshake';
  import Filter from '@lucide/svelte/icons/filter';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  // ─── Tab Active State ────────────────────────────────────────────────────────
  let activeTab = $state<'rw' | 'rt' | 'rekap' | 'kategori'>('rw');

  // ─── Filter States ──────────────────────────────────────────────────────────
  // Filter Kas RW
  let filterPeriodeRw = $state<'semua' | 'bulan_ini' | 'tahun_ini'>('semua');
  let filterKategoriRw = $state<string>('semua');

  // Filter Kas RT (KU-01)
  let filterRtPilihan = $state<string>('semua');
  let filterNamaKas = $state<string>('semua');
  let filterPeriodeRt = $state<'semua' | 'bulan_ini' | 'tahun_ini'>('semua');

  // Filter Rekap Iuran RT (KU-02)
  let filterPeriodeIuran = $state<string>('');
  let targetSetoranRtId = $state<number>(0);

  $effect(() => {
    if (!filterPeriodeIuran && data.periodeAktif) {
      filterPeriodeIuran = data.periodeAktif;
    }
    if (targetSetoranRtId === 0 && data.daftarRt[0]?.id) {
      targetSetoranRtId = data.daftarRt[0].id;
    }
  });

  // ─── Modal States ───────────────────────────────────────────────────────────
  let showModalTambahRw = $state(false);
  let showModalTambahRt = $state(false);
  let showModalSetoranRt = $state(false);
  let showModalTambahKategori = $state(false);
  let showModalBatalRw = $state(false);
  let showModalBatalRt = $state(false);
  let selectedTransaksiId = $state<number | null>(null);

  const sekarang = new Date();
  const thnSekarang = sekarang.getFullYear();
  const blnSekarang = String(sekarang.getMonth() + 1).padStart(2, '0');

  // ─── Derived: Kas RW ────────────────────────────────────────────────────────
  const filteredTransaksiRw = $derived(
    data.semuaTransaksiRw.filter((t: any) => {
      if (filterPeriodeRw === 'bulan_ini' && !t.tanggal.startsWith(`${thnSekarang}-${blnSekarang}`)) return false;
      if (filterPeriodeRw === 'tahun_ini' && !t.tanggal.startsWith(`${thnSekarang}`)) return false;
      if (filterKategoriRw !== 'semua' && String(t.kategoriId) !== filterKategoriRw) return false;
      return true;
    })
  );

  // ─── Derived: Kas RT (KU-01) ────────────────────────────────────────────────
  const filteredTransaksiRt = $derived(
    data.semuaTransaksiRt.filter((t: any) => {
      if (filterRtPilihan !== 'semua' && String(t.rtId) !== filterRtPilihan) return false;
      if (filterNamaKas !== 'semua' && t.namaKas !== filterNamaKas) return false;
      if (filterPeriodeRt === 'bulan_ini' && !t.tanggal.startsWith(`${thnSekarang}-${blnSekarang}`)) return false;
      if (filterPeriodeRt === 'tahun_ini' && !t.tanggal.startsWith(`${thnSekarang}`)) return false;
      return true;
    })
  );

  // ─── Derived: Kategori Kas (KU-04) ──────────────────────────────────────────
  const kategoriPemasukan = $derived(data.semuaKategori.filter((k: any) => k.jenis === 'pemasukan'));
  const kategoriPengeluaran = $derived(data.semuaKategori.filter((k: any) => k.jenis === 'pengeluaran'));

  // ─── Columns Tabel Kas RW ───────────────────────────────────────────────────
  const columnsRw = [
    {
      key: 'tanggal',
      label: 'Tanggal',
      render: (row: any) => formatTanggal(row.tanggal)
    },
    {
      key: 'keterangan',
      label: 'Keterangan',
      render: (row: any) => {
        let html = `<span class="${row.dibatalkan ? 'line-through text-muted' : 'font-medium'}">${row.keterangan}</span>`;
        if (row.dibatalkan) {
          html += `<br><span class="text-xs text-danger font-medium">Dibatalkan: ${row.alasanBatal ?? 'Koreksi'} (${row.dibatalkanOleh ?? ''})</span>`;
        }
        return html;
      }
    },
    { key: 'namaKategori', label: 'Pos Anggaran', render: (row: any) => row.namaKategori ?? '—' },
    {
      key: 'jenis',
      label: 'Jenis',
      render: (row: any) => {
        if (row.dibatalkan) return '<span class="badge variant-default">Dibatalkan</span>';
        return row.jenis === 'pemasukan'
          ? '<span class="badge variant-success">Pemasukan</span>'
          : '<span class="badge variant-danger">Pengeluaran</span>';
      }
    },
    {
      key: 'nominal',
      label: 'Nominal',
      class: 'text-right',
      render: (row: any) => {
        if (row.dibatalkan) {
          return `<span class="line-through text-muted font-medium">${formatRupiah(row.nominal)}</span>`;
        }
        return row.jenis === 'pemasukan'
          ? `<span style="font-weight: 600; color: var(--color-success)">+${formatRupiah(row.nominal)}</span>`
          : `<span style="font-weight: 600; color: var(--color-danger)">-${formatRupiah(row.nominal)}</span>`;
      }
    },
    {
      key: 'bukti',
      label: 'Bukti',
      render: (row: any) => {
        if (!row.bukti) return '<span class="text-muted text-xs">—</span>';
        return `<a href="${row.bukti}" target="_blank" rel="noreferrer" class="doc-link text-xs">Lihat Bukti</a>`;
      }
    },
    {
      key: 'aksi',
      label: '',
      sortable: false,
      render: (row: any) => {
        if (row.dibatalkan) return '';
        return `<button type="button" class="btn btn-sm btn-secondary text-xs" data-batal-rw="${row.id}">Batal</button>`;
      }
    }
  ];

  // ─── Columns Tabel Kas RT (KU-01) ───────────────────────────────────────────
  const columnsRt = [
    {
      key: 'tanggal',
      label: 'Tanggal',
      render: (row: any) => formatTanggal(row.tanggal)
    },
    {
      key: 'nomorRt',
      label: 'RT',
      render: (row: any) => `<span class="badge variant-brand font-mono font-bold">RT ${String(row.nomorRt).padStart(2, '0')}</span>`
    },
    {
      key: 'namaKas',
      label: 'Buku Kas Mandiri',
      render: (row: any) => `<span class="badge-subkas">${row.namaKas}</span>`
    },
    {
      key: 'keterangan',
      label: 'Keterangan',
      render: (row: any) => {
        let html = `<span class="${row.dibatalkan ? 'line-through text-muted' : 'font-medium'}">${row.keterangan}</span>`;
        if (row.dibatalkan) {
          html += `<br><span class="text-xs text-danger font-medium">Dibatalkan: ${row.alasanBatal ?? 'Koreksi'} (${row.dibatalkanOleh ?? ''})</span>`;
        }
        return html;
      }
    },
    { key: 'namaKategori', label: 'Pos Kategori', render: (row: any) => row.namaKategori ?? '—' },
    {
      key: 'jenis',
      label: 'Jenis',
      render: (row: any) => {
        if (row.dibatalkan) return '<span class="badge variant-default">Dibatalkan</span>';
        return row.jenis === 'pemasukan'
          ? '<span class="badge variant-success">Pemasukan</span>'
          : '<span class="badge variant-danger">Pengeluaran</span>';
      }
    },
    {
      key: 'nominal',
      label: 'Nominal',
      class: 'text-right',
      render: (row: any) => {
        if (row.dibatalkan) {
          return `<span class="line-through text-muted font-medium">${formatRupiah(row.nominal)}</span>`;
        }
        return row.jenis === 'pemasukan'
          ? `<span style="font-weight: 600; color: var(--color-success)">+${formatRupiah(row.nominal)}</span>`
          : `<span style="font-weight: 600; color: var(--color-danger)">-${formatRupiah(row.nominal)}</span>`;
      }
    },
    {
      key: 'bukti',
      label: 'Bukti',
      render: (row: any) => {
        if (!row.bukti) return '<span class="text-muted text-xs">—</span>';
        return `<a href="${row.bukti}" target="_blank" rel="noreferrer" class="doc-link text-xs">Lihat Bukti</a>`;
      }
    },
    {
      key: 'aksi',
      label  // ─── Ekspor CSV (KU-03) ─────────────────────────────────────────────────────
  function eksporCsvKasRw() {
    let csv = 'Laporan Pembukuan Kas Internal RW\n';
    csv += `Wilayah: ${data.rwData?.nama ?? 'RW 01'}\n`;
    csv += `Tanggal Unduh: ${new Date().toLocaleString('id-ID')}\n`;
    csv += `Total Pemasukan Aktif: ${data.totalPemasukanRw}\n`;
    csv += `Total Pengeluaran Aktif: ${data.totalPengeluaranRw}\n`;
    csv += `Saldo Akhir Kas RW: ${data.saldoRw}\n\n`;
    csv += 'Tanggal,Keterangan,Pos Anggaran,Jenis,Nominal,Status,Dicatat Oleh\n';

    for (const t of filteredTransaksiRw) {
      const ket = (t.keterangan || '').replace(/"/g, '""');
      const kat = (t.namaKategori || '').replace(/"/g, '""');
      csv += `"${t.tanggal}","${ket}","${kat}","${t.jenis}",${t.nominal},"${t.dibatalkan ? 'Dibatalkan' : 'Aktif'}","${t.dicatatOleh}"\n`;
    }

    unduhFileCsv(csv, `laporan_kas_rw_${new Date().toISOString().slice(0, 10)}.csv`);
  }

  function eksporCsvKasRt() {
    let csv = 'Laporan Pembukuan Kas Mandiri per-RT (KU-01)\n';
    csv += `Wilayah: ${data.rwData?.nama ?? 'RW 01'} - Lingkungan RT\n`;
    csv += `Filter RT: ${filterRtPilihan === 'semua' ? 'Semua RT' : 'RT ' + filterRtPilihan}\n`;
    csv += `Tanggal Unduh: ${new Date().toLocaleString('id-ID')}\n\n`;
    csv += 'Tanggal,RT,Nama Buku Kas Mandiri,Keterangan,Pos Kategori,Jenis,Nominal,Status,Dicatat Oleh\n';

    for (const t of filteredTransaksiRt) {
      const ket = (t.keterangan || '').replace(/"/g, '""');
      const kat = (t.namaKategori || '').replace(/"/g, '""');
      const namaKas = (t.namaKas || '').replace(/"/g, '""');
      csv += `"${t.tanggal}","RT ${String(t.nomorRt).padStart(2, '0')}","${namaKas}","${ket}","${kat}","${t.jenis}",${t.nominal},"${t.dibatalkan ? 'Dibatalkan' : 'Aktif'}","${t.dicatatOleh}"\n`;
    }

    unduhFileCsv(csv, `laporan_kas_rt_${new Date().toISOString().slice(0, 10)}.csv`);
  }

  function eksporCsvRekapIuran() {
    let csv = 'Rekapitulasi Penerimaan Iuran Wajib RT (KU-02)\n';
    csv += `Periode: ${filterPeriodeIuran}\n`;
    csv += `Tanggal Unduh: ${new Date().toLocaleString('id-ID')}\n\n`;
    csv += 'RT,Total KK Terdaftar,KK Lunas,KK Belum Bayar,Persentase Kepatuhan (%),Realisasi Penerimaan,Target Nominal\n';

    for (const r of data.rekapIuranRt) {
      csv += `"RT ${String(r.nomorRt).padStart(2, '0')}",${r.totalKk},${r.lunas},${r.belumBayar},"${r.persentase}%",${r.nominalTerkumpul},${r.targetNominal}\n`;
    }

    csv += `\nTotal Terhimpun,,,,,${data.totalIuranTerkumpul},${data.totalIuranTarget}\n`;
    unduhFileCsv(csv, `rekap_iuran_wajib_rt_${filterPeriodeIuran}_${new Date().toISOString().slice(0, 10)}.csv`);
  }

  function unduhFileCsv(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
</script>

<div class="kas-container">
  <PageHeader
    title="Modul Keuangan & Kas RT"
    subtitle="Pemisahan pembukuan kas RW dan kas per-RT berbasis rekapitulasi (Spesifik Bendahara)."
  >
    <div class="header-actions">
      <!-- Ekspor CSV Contextual (KU-03) -->
      {#if activeTab === 'rw'}
        <button type="button" class="btn btn-secondary" onclick={eksporCsvKasRw}>
          <Download size={16} />
          <span>Ekspor CSV Kas RW</span>
        </button>
        <button type="button" class="btn btn-action" onclick={() => (showModalTambahRw = true)}>
          <Plus size={16} />
          <span>Catat Kas RW</span>
        </button>
      {:else if activeTab === 'rt'}
        <button type="button" class="btn btn-secondary" onclick={eksporCsvKasRt}>
          <Download size={16} />
          <span>Ekspor CSV Kas RT</span>
        </button>
        <button type="button" class="btn btn-action" onclick={() => (showModalTambahRt = true)}>
          <Plus size={16} />
          <span>Catat Kas RT</span>
        </button>
      {:else if activeTab === 'rekap'}
        <button type="button" class="btn btn-secondary" onclick={eksporCsvRekapIuran}>
          <Download size={16} />
          <span>Ekspor Rekap CSV</span>
        </button>
        <button type="button" class="btn btn-action" onclick={() => (showModalSetoranRt = true)}>
          <Receipt size={16} />
          <span>Catat Setoran RT</span>
        </button>
      {:else if activeTab === 'kategori'}
        <button type="button" class="btn btn-action" onclick={() => (showModalTambahKategori = true)}>
          <Plus size={16} />
          <span>Tambah Pos Kategori</span>
        </button>
      {/if}
    </div>
  </PageHeader>

  <!-- ─── Tab Bar Navigation ──────────────────────────────────────────────── -->
  <div class="tab-bar">
    <button
      type="button"
      class="tab-btn"
      class:active={activeTab === 'rw'}
      onclick={() => (activeTab = 'rw')}
    >
      <Building2 size={18} />
      <span>Kas RW (Internal RW)</span>
    </button>

    <button
      type="button"
      class="tab-btn"
      class:active={activeTab === 'rt'}
      onclick={() => (activeTab = 'rt')}
    >
      <Home size={18} />
      <span>Kas RT (Mandiri per-RT — KU-01)</span>
      <span class="tab-pill">Baru</span>
    </button>

    <button
      type="button"
      class="tab-btn"
      class:active={activeTab === 'rekap'}
      onclick={() => (activeTab = 'rekap')}
    >
      <Receipt size={18} />
      <span>Rekapitulasi Iuran RT (KU-02)</span>
    </button>

    <button
      type="button"
      class="tab-btn"
      class:active={activeTab === 'kategori'}
      onclick={() => (activeTab = 'kategori')}
    >
      <Tags size={18} />
      <span>Pos & Kategori (KU-04)</span>
    </button>
  </div>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- TAB 1: KAS RW (INTERNAL TINGKAT RW)                                     -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  {#if activeTab === 'rw'}
    <div class="metrics-row">
      <StatCard
        title="Total Pemasukan RW"
        value={formatRupiah(data.totalPemasukanRw)}
        description="Akumulasi penerimaan kas internal RW aktif"
        icon={ArrowDownRight}
        variant="success"
      />

      <StatCard
        title="Total Pengeluaran RW"
        value={formatRupiah(data.totalPengeluaranRw)}
        description="Akumulasi beban operasional RW aktif"
        icon={ArrowUpRight}
        variant="danger"
      />

      <StatCard
        title="Saldo Akhir Kas RW"
        value={formatRupiah(data.saldoRw)}
        description={data.saldoRw >= 0 ? 'Surplus kas operasional internal RW' : 'Defisit kas operasional internal RW'}
        icon={Wallet}
        variant={data.saldoRw >= 0 ? 'brand' : 'danger'}
      />
    </div>

    <div class="filters-card">
      <div class="filter-group">
        <label for="filter-periode-rw" class="label-caps">Periode Waktu:</label>
        <select id="filter-periode-rw" bind:value={filterPeriodeRw} class="filter-select">
          <option value="semua">Semua Periode</option>
          <option value="bulan_ini">Bulan Ini ({blnSekarang}/{thnSekarang})</option>
          <option value="tahun_ini">Tahun Ini ({thnSekarang})</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="filter-kategori-rw" class="label-caps">Pos Anggaran:</label>
        <select id="filter-kategori-rw" bind:value={filterKategoriRw} class="filter-select">
          <option value="semua">Semua Pos Anggaran</option>
          {#each data.semuaKategori as kat}
            <option value={String(kat.id)}>{kat.nama} ({kat.jenis})</option>
          {/each}
        </select>
      </div>

      <div class="filter-count">
        Menampilkan <strong>{filteredTransaksiRw.length}</strong> transaksi Kas RW
      </div>
    </div>

    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div role="presentation" onclick={onTableClickRw}>
      <DataTable
        columns={columnsRw}
        data={filteredTransaksiRw}
        searchKeys={['keterangan', 'namaKategori']}
      />
    </div>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- TAB 2: KAS RT (MANDIRI PER-RT — KU-01)                                 -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  {:else if activeTab === 'rt'}
    <div class="info-banner">
      <div class="banner-icon">
        <HeartHandshake size={20} />
      </div>
      <div class="banner-content">
        <h4 class="banner-title">Pemisahan Pembukuan Kas Mandiri per-RT (KU-01)</h4>
        <p class="banner-text">
          Kas sosial kematian, kas rukun kematian, dan kas operasional lingkungan dicatat secara mandiri untuk tiap RT. Dana tidak bercampur dengan kas internal RW, dengan saldo yang terisolasi per wilayah RT masing-masing.
        </p>
      </div>
    </div>

    <div class="metrics-row">
      <StatCard
        title="Total Kas RT Terhimpun"
        value={formatRupiah(data.totalPemasukanRtAgregat)}
        description="Akumulasi penerimaan kas sosial & kas RT aktif"
        icon={ArrowDownRight}
        variant="success"
      />

      <StatCard
        title="Pengeluaran Sosial RT"
        value={formatRupiah(data.totalPengeluaranRtAgregat)}
        description="Santunan kematian & beban kas RT mandiri"
        icon={ArrowUpRight}
        variant="danger"
      />

      <StatCard
        title="Saldo Kumulatif Kas RT"
        value={formatRupiah(data.totalSaldoRtAgregat)}
        description="Total saldo seluruh kas mandiri lingkungan RT"
        icon={Wallet}
        variant={data.totalSaldoRtAgregat >= 0 ? 'brand' : 'danger'}
      />
    </div>

    <!-- Grid Ringkasan Saldo Mandiri Tiap RT -->
    <div class="section-heading">
      <h3 class="section-title">Ringkasan Saldo Mandiri per-RT</h3>
      <span class="text-xs text-muted">Klik kartu untuk menyaring transaksi ke RT tersebut</span>
    </div>

    <div class="rt-grid">
      {#each data.rekapSaldoRt as rtItem}
        <button
          type="button"
          class="rt-summary-card"
          class:selected={filterRtPilihan === String(rtItem.rtId)}
          onclick={() => {
            filterRtPilihan = filterRtPilihan === String(rtItem.rtId) ? 'semua' : String(rtItem.rtId);
          }}
        >
          <div class="rt-card-header">
            <span class="badge variant-brand font-mono font-bold">RT {String(rtItem.nomorRt).padStart(2, '0')}</span>
            <span class="text-xs text-muted">{rtItem.jumlahTransaksi} transaksi</span>
          </div>
          <div class="rt-card-saldo">
            <span class="text-xs text-muted">Saldo Kas RT:</span>
            <span class="saldo-value font-mono">{formatRupiah(rtItem.saldo)}</span>
          </div>
          <div class="rt-card-meta">
            <span class="text-xs text-success">Masuk: {formatRupiah(rtItem.totalPemasukan)}</span>
            <span class="text-xs text-danger">Keluar: {formatRupiah(rtItem.totalPengeluaran)}</span>
          </div>
          {#if rtItem.daftarBukuKas.length > 0}
            <div class="rt-card-tags">
              {#each rtItem.daftarBukuKas as bk}
                <span class="tag-chip">{bk}</span>
              {/each}
            </div>
          {/if}
        </button>
      {/each}
    </div>

    <!-- Filter Bar Kas RT -->
    <div class="filters-card">
      <div class="filter-group">
        <label for="filter-rt" class="label-caps">Pilih Wilayah RT:</label>
        <select id="filter-rt" bind:value={filterRtPilihan} class="filter-select">
          <option value="semua">Semua RT ({data.daftarRt.length} RT)</option>
          {#each data.daftarRt as r}
            <option value={String(r.id)}>RT {String(r.nomor).padStart(2, '0')}</option>
          {/each}
        </select>
      </div>

      <div class="filter-group">
        <label for="filter-nama-kas" class="label-caps">Buku Kas Mandiri:</label>
        <select id="filter-nama-kas" bind:value={filterNamaKas} class="filter-select">
          <option value="semua">Semua Buku Kas</option>
          {#each data.daftarNamaKas as nk}
            <option value={nk}>{nk}</option>
          {/each}
        </select>
      </div>

      <div class="filter-group">
        <label for="filter-periode-rt" class="label-caps">Periode:</label>
        <select id="filter-periode-rt" bind:value={filterPeriodeRt} class="filter-select">
          <option value="semua">Semua Waktu</option>
          <option value="bulan_ini">Bulan Ini</option>
          <option value="tahun_ini">Tahun Ini</option>
        </select>
      </div>

      <div class="filter-count">
        Menampilkan <strong>{filteredTransaksiRt.length}</strong> transaksi Kas RT
      </div>
    </div>

    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div role="presentation" onclick={onTableClickRt}>
      <DataTable
        columns={columnsRt}
        data={filteredTransaksiRt}
        searchKeys={['keterangan', 'namaKas', 'namaKategori']}
      />
    </div>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- TAB 3: REKAPITULASI IURAN WAJIB RT (KU-02)                             -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  {:else if activeTab === 'rekap'}
    <div class="info-banner">
      <div class="banner-icon">
        <Receipt size={20} />
      </div>
      <div class="banner-content">
        <h4 class="banner-title">Model Rekapitulasi Penerimaan Iuran RT (KU-02)</h4>
        <p class="banner-text">
          Pergeseran fokus dari sistem tagihan murni perorangan menjadi <strong>rekapitulasi penerimaan kolektif iuran wajib per-RT</strong>. Memudahkan bendahara RT menyetorkan himpunan iuran warga ke tingkat RW dengan akuntabilitas fisik yang jelas.
        </p>
      </div>
    </div>

    <div class="metrics-row">
      <StatCard
        title="Total Iuran Terhimpun"
        value={formatRupiah(data.totalIuranTerkumpul)}
        description={`Realisasi himpunan iuran periode ${data.periodeAktif}`}
        icon={Receipt}
        variant="success"
      />

      <StatCard
        title="Target Potensi Iuran"
        value={formatRupiah(data.totalIuranTarget)}
        description="Target penerimaan 100% warga se-RW"
        icon={Wallet}
        variant="brand"
      />

      <StatCard
        title="Tingkat Kepatuhan RW"
        value={`${data.persentaseIuranRw}%`}
        description={data.persentaseIuranRw >= 75 ? 'Tingkat partisipasi tinggi' : 'Perlu tindak lanjut bendahara RT'}
        icon={CheckCircle2}
        variant={data.persentaseIuranRw >= 75 ? 'success' : 'warning'}
      />
    </div>

    <div class="filters-card">
      <div class="filter-group">
        <label for="filter-periode-iuran" class="label-caps">Pilih Periode Rekap:</label>
        <select
          id="filter-periode-iuran"
          bind:value={filterPeriodeIuran}
          onchange={(e) => {
            const val = (e.target as HTMLSelectElement).value;
            window.location.search = `?periodeIuran=${val}`;
          }}
          class="filter-select"
        >
          {#each data.daftarPeriodeIuran as p}
            <option value={p}>Periode {p}</option>
          {/each}
        </select>
      </div>
      <div class="filter-count">
        Rekapitulasi iuran untuk {data.rekapIuranRt.length} RT di lingkungan {data.rwData?.nama ?? 'RW 01'}
      </div>
    </div>

    <Card>
      <div class="table-wrap">
        <table class="rekap-table">
          <thead>
            <tr>
              <th class="label-caps">Wilayah RT</th>
              <th class="label-caps text-center">KK Terdaftar</th>
              <th class="label-caps text-center">KK Lunas</th>
              <th class="label-caps text-center">KK Belum Bayar</th>
              <th class="label-caps">Progress Kepatuhan</th>
              <th class="label-caps text-right">Realisasi Penerimaan</th>
              <th class="label-caps text-right">Target Nominal</th>
              <th class="label-caps text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {#each data.rekapIuranRt as r}
              <tr>
                <td>
                  <div class="rt-cell">
                    <span class="badge variant-brand font-mono font-bold">RT {String(r.nomorRt).padStart(2, '0')}</span>
                    <span class="text-xs text-muted">Wilayah RT {r.nomorRt}</span>
                  </div>
                </td>
                <td class="text-center font-mono font-medium">{r.totalKk} KK</td>
                <td class="text-center">
                  <span class="badge variant-success">{r.lunas} KK</span>
                </td>
                <td class="text-center">
                  {#if r.belumBayar > 0}
                    <span class="badge variant-danger">{r.belumBayar} KK</span>
                  {:else}
                    <span class="badge variant-default">0 KK</span>
                  {/if}
                </td>
                <td style="min-width: 140px;">
                  <div class="progress-wrap">
                    <div class="progress-bar-bg">
                      <div class="progress-bar-fill" style={`width: ${r.persentase}%;`}></div>
                    </div>
                    <span class="progress-text">{r.persentase}%</span>
                  </div>
                </td>
                <td class="text-right font-mono font-bold text-success">
                  {formatRupiah(r.nominalTerkumpul)}
                </td>
                <td class="text-right font-mono text-muted">
                  {formatRupiah(r.targetNominal)}
                </td>
                <td class="text-center">
                  <button
                    type="button"
                    class="btn btn-sm btn-secondary text-xs"
                    onclick={() => {
                      targetSetoranRtId = r.rtId;
                      showModalSetoranRt = true;
                    }}
                  >
                    Setor Iuran
                  </button>
                </td>
              </tr>
            {:else}
              <tr>
                <td colspan="8" class="text-muted text-center py-4">
                  Belum ada data rekapitulasi iuran untuk periode ini.
                </td>
              </tr>
            {/each}
          </tbody>
          <tfoot>
            <tr class="tfoot-row">
              <td class="font-bold">Total Rekapitulasi RW</td>
              <td class="text-center font-bold font-mono">
                {data.rekapIuranRt.reduce((s: number, r: any) => s + r.totalKk, 0)} KK
              </td>
              <td class="text-center font-bold text-success">
                {data.rekapIuranRt.reduce((s: number, r: any) => s + r.lunas, 0)} KK
              </td>
              <td class="text-center font-bold text-danger">
                {data.rekapIuranRt.reduce((s: number, r: any) => s + r.belumBayar, 0)} KK
              </td>
              <td>
                <span class="font-bold">{data.persentaseIuranRw}% Realisasi</span>
              </td>
              <td class="text-right font-bold font-mono text-success">
                {formatRupiah(data.totalIuranTerkumpul)}
              </td>
              <td class="text-right font-bold font-mono text-muted">
                {formatRupiah(data.totalIuranTarget)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!-- TAB 4: POS & KATEGORI ANGGARAN (KU-04)                                  -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  {:else if activeTab === 'kategori'}
    <div class="info-banner">
      <div class="banner-icon">
        <Tags size={20} />
      </div>
      <div class="banner-content">
        <h4 class="banner-title">Manajemen Kategori Transaksi & Pos Anggaran (KU-04)</h4>
        <p class="banner-text">
          Kelola pos anggaran pengeluaran (operasional RW, santunan kematian RT, sarana) dan pos penerimaan sosial (iuran wajib, kas kematian, donasi) dengan peruntukan Kas RW maupun Kas RT.
        </p>
      </div>
    </div>

    <div class="kategori-grid">
      <!-- Kolom Pos Penerimaan Sosial -->
      <Card>
        <div class="kategori-col-header">
          <div class="flex items-center gap-2">
            <ArrowDownRight size={20} class="text-success" />
            <h3 class="col-title">Pos Penerimaan Sosial & Kas</h3>
          </div>
          <span class="badge variant-success">{kategoriPemasukan.length} Pos</span>
        </div>

        <div class="kategori-list">
          {#each kategoriPemasukan as kat}
            <div class="kategori-item">
              <div class="kategori-info">
                <span class="kategori-name">{kat.nama}</span>
                <span class="kategori-scope">
                  {#if kat.scope === 'rt'}
                    Khusus Kas RT
                  {:else if kat.scope === 'rw'}
                    Khusus Kas RW
                  {:else}
                    Kas RW & RT
                  {/if}
                </span>
              </div>
              <form method="POST" action="?/hapusKategori">
                <input type="hidden" name="id" value={kat.id} />
                <button type="submit" class="btn-icon-danger" title="Hapus kategori">
                  <Trash2 size={15} />
                </button>
              </form>
            </div>
          {:else}
            <p class="text-xs text-muted py-3">Belum ada pos penerimaan.</p>
          {/each}
        </div>
      </Card>

      <!-- Kolom Pos Anggaran Pengeluaran -->
      <Card>
        <div class="kategori-col-header">
          <div class="flex items-center gap-2">
            <ArrowUpRight size={20} class="text-danger" />
            <h3 class="col-title">Pos Anggaran Pengeluaran</h3>
          </div>
          <span class="badge variant-danger">{kategoriPengeluaran.length} Pos</span>
        </div>

        <div class="kategori-list">
          {#each kategoriPengeluaran as kat}
            <div class="kategori-item">
              <div class="kategori-info">
                <span class="kategori-name">{kat.nama}</span>
                <span class="kategori-scope">
                  {#if kat.scope === 'rt'}
                    Khusus Kas RT
                  {:else if kat.scope === 'rw'}
                    Khusus Kas RW
                  {:else}
                    Kas RW & RT
                  {/if}
                </span>
              </div>
              <form method="POST" action="?/hapusKategori">
                <input type="hidden" name="id" value={kat.id} />
                <button type="submit" class="btn-icon-danger" title="Hapus kategori">
                  <Trash2 size={15} />
                </button>
              </form>
            </div>
          {:else}
            <p class="text-xs text-muted py-3">Belum ada pos pengeluaran.</p>
          {/each}
        </div>
      </Card>
    </div>
  {/if}
</div>

<!-- ═════════════════════════════════════════════════════════════════════════ -->
<!-- MODAL: CATAT KAS RW                                                      -->
<!-- ═════════════════════════════════════════════════════════════════════════ -->
<Modal
  open={showModalTambahRw}
  title="Catat Transaksi Kas Internal RW"
  onClose={() => (showModalTambahRw = false)}
>
  <form method="POST" action="?/tambahKasRw" enctype="multipart/form-data" class="form-modal">
    <div class="form-row">
      <div class="form-group flex-1">
        <label for="jenis-rw" class="label-caps">Jenis Arus Kas</label>
        <select id="jenis-rw" name="jenis" class="form-input" required>
          <option value="pemasukan">Pemasukan (+)</option>
          <option value="pengeluaran">Pengeluaran (-)</option>
        </select>
      </div>

      <div class="form-group flex-1">
        <label for="nominal-rw" class="label-caps">Nominal (Rp)</label>
        <input
          id="nominal-rw"
          name="nominal"
          type="number"
          min="1000"
          step="500"
          required
          placeholder="Contoh: 500000"
          class="form-input"
        />
      </div>
    </div>

    <div class="form-group">
      <label for="kategori-rw" class="label-caps">Pos Anggaran</label>
      <select id="kategori-rw" name="kategoriId" class="form-input">
        <option value="">— Tanpa Pos Kategori —</option>
        {#each data.semuaKategori.filter((k: any) => k.scope !== 'rt') as kat}
          <option value={kat.id}>{kat.nama} ({kat.jenis})</option>
        {/each}
      </select>
    </div>

    <div class="form-group">
      <label for="ket-rw" class="label-caps">Keterangan Transaksi</label>
      <textarea
        id="ket-rw"
        name="keterangan"
        rows="2"
        required
        placeholder="Contoh: Bantuan operasional sekretariat RW"
        class="form-input"
      ></textarea>
    </div>

    <div class="form-row">
      <div class="form-group flex-1">
        <label for="tgl-rw" class="label-caps">Tanggal Transaksi</label>
        <input
          id="tgl-rw"
          name="tanggal"
          type="date"
          required
          value={new Date().toISOString().slice(0, 10)}
          class="form-input"
        />
      </div>

      <div class="form-group flex-1">
        <label for="bukti-rw" class="label-caps">Unggah Nota / Kwitansi</label>
        <input id="bukti-rw" name="buktiFile" type="file" accept="image/*,.pdf" class="form-input file-input" />
      </div>
    </div>

    <div class="modal-actions">
      <button type="button" class="btn btn-secondary" onclick={() => (showModalTambahRw = false)}>
        Batal
      </button>
      <button type="submit" class="btn btn-action">
        Simpan Transaksi Kas RW
      </button>
    </div>
  </form>
</Modal>

<!-- ═════════════════════════════════════════════════════════════════════════ -->
<!-- MODAL: CATAT KAS RT MANDIRI (KU-01)                                      -->
<!-- ═════════════════════════════════════════════════════════════════════════ -->
<Modal
  open={showModalTambahRt}
  title="Catat Transaksi Kas Mandiri per-RT (KU-01)"
  onClose={() => (showModalTambahRt = false)}
>
  <form method="POST" action="?/tambahKasRt" enctype="multipart/form-data" class="form-modal">
    <div class="form-row">
      <div class="form-group flex-1">
        <label for="rt-id" class="label-caps">Wilayah RT</label>
        <select id="rt-id" name="rtId" class="form-input" required>
          {#each data.daftarRt as r}
            <option value={r.id}>RT {String(r.nomor).padStart(2, '0')}</option>
          {/each}
        </select>
      </div>

      <div class="form-group flex-1">
        <label for="nama-kas-rt" class="label-caps">Buku Kas Mandiri</label>
        <input
          id="nama-kas-rt"
          name="namaKas"
          type="text"
          list="list-buku-kas"
          required
          placeholder="Misal: Kas Sosial Kematian"
          class="form-input"
        />
        <datalist id="list-buku-kas">
          <option value="Kas Sosial Kematian"></option>
          <option value="Kas Rukun Kematian"></option>
          <option value="Kas Operasional RT"></option>
          <option value="Kas Sampah & Kebersihan"></option>
        </datalist>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group flex-1">
        <label for="jenis-rt" class="label-caps">Jenis Transaksi</label>
        <select id="jenis-rt" name="jenis" class="form-input" required>
          <option value="pemasukan">Pemasukan (+)</option>
          <option value="pengeluaran">Pengeluaran (-)</option>
        </select>
      </div>

      <div class="form-group flex-1">
        <label for="nominal-rt" class="label-caps">Nominal (Rp)</label>
        <input
          id="nominal-rt"
          name="nominal"
          type="number"
          min="1000"
          step="500"
          required
          placeholder="Contoh: 150000"
          class="form-input"
        />
      </div>
    </div>

    <div class="form-group">
      <label for="kategori-rt" class="label-caps">Pos Anggaran / Pos Sosial</label>
      <select id="kategori-rt" name="kategoriId" class="form-input">
        <option value="">— Tanpa Pos Kategori —</option>
        {#each data.semuaKategori.filter((k: any) => k.scope !== 'rw') as kat}
          <option value={kat.id}>{kat.nama} ({kat.jenis})</option>
        {/each}
      </select>
    </div>

    <div class="form-group">
      <label for="ket-rt" class="label-caps">Keterangan Transaksi</label>
      <textarea
        id="ket-rt"
        name="keterangan"
        rows="2"
        required
        placeholder="Contoh: Santunan duka cita Alm. warga RT 01"
        class="form-input"
      ></textarea>
    </div>

    <div class="form-row">
      <div class="form-group flex-1">
        <label for="tgl-rt" class="label-caps">Tanggal Transaksi</label>
        <input
          id="tgl-rt"
          name="tanggal"
          type="date"
          required
          value={new Date().toISOString().slice(0, 10)}
          class="form-input"
        />
      </div>

      <div class="form-group flex-1">
        <label for="bukti-rt" class="label-caps">Bukti Nota / Kwitansi</label>
        <input id="bukti-rt" name="buktiFile" type="file" accept="image/*,.pdf" class="form-input file-input" />
      </div>
    </div>

    <div class="modal-actions">
      <button type="button" class="btn btn-secondary" onclick={() => (showModalTambahRt = false)}>
        Batal
      </button>
      <button type="submit" class="btn btn-action">
        Simpan Kas RT
      </button>
    </div>
  </form>
</Modal>

<!-- ═════════════════════════════════════════════════════════════════════════ -->
<!-- MODAL: CATAT SETORAN IURAN RT KOLEKTIF (KU-02)                          -->
<!-- ═════════════════════════════════════════════════════════════════════════ -->
<Modal
  open={showModalSetoranRt}
  title="Catat Rekapitulasi Setoran Iuran RT (KU-02)"
  onClose={() => (showModalSetoranRt = false)}
>
  <form method="POST" action="?/catatSetoranRt" class="form-modal">
    <p class="modal-desc">
      Bendahara RT dapat mencatatkan setoran himpunan iuran warga RT secara kolektif untuk periode berjalan. Sistem akan otomatis melunasi tagihan KK warga pada RT terpilih.
    </p>

    <div class="form-group">
      <label for="setor-rt" class="label-caps">Wilayah RT yang Menyetor</label>
      <select id="setor-rt" name="rtId" bind:value={targetSetoranRtId} class="form-input" required>
        {#each data.daftarRt as r}
          <option value={r.id}>RT {String(r.nomor).padStart(2, '0')}</option>
        {/each}
      </select>
    </div>

    <div class="form-row">
      <div class="form-group flex-1">
        <label for="setor-periode" class="label-caps">Periode Iuran</label>
        <input
          id="setor-periode"
          name="periode"
          type="text"
          value={filterPeriodeIuran}
          required
          class="form-input font-mono"
        />
      </div>

      <div class="form-group flex-1">
        <label for="setor-jumlah-kk" class="label-caps">Jumlah KK Disetorkan</label>
        <input
          id="setor-jumlah-kk"
          name="jumlahKkDisetor"
          type="number"
          min="1"
          placeholder="Kosongkan utk lunasi semua"
          class="form-input font-mono"
        />
      </div>
    </div>

    <div class="modal-actions">
      <button type="button" class="btn btn-secondary" onclick={() => (showModalSetoranRt = false)}>
        Batal
      </button>
      <button type="submit" class="btn btn-action">
        Konfirmasi Setoran Kolektif
      </button>
    </div>
  </form>
</Modal>

<!-- ═════════════════════════════════════════════════════════════════════════ -->
<!-- MODAL: TAMBAH POS KATEGORI (KU-04)                                       -->
<!-- ═════════════════════════════════════════════════════════════════════════ -->
<Modal
  open={showModalTambahKategori}
  title="Tambah Pos Anggaran / Pos Sosial (KU-04)"
  onClose={() => (showModalTambahKategori = false)}
>
  <form method="POST" action="?/tambahKategori" class="form-modal">
    <div class="form-group">
      <label for="kat-nama" class="label-caps">Nama Pos Kategori</label>
      <input
        id="kat-nama"
        name="nama"
        type="text"
        required
        placeholder="Contoh: Santunan Kematian RT / Donasi Warga"
        class="form-input"
      />
    </div>

    <div class="form-row">
      <div class="form-group flex-1">
        <label for="kat-jenis" class="label-caps">Tipe Arus</label>
        <select id="kat-jenis" name="jenis" class="form-input" required>
          <option value="pemasukan">Pos Penerimaan (+)</option>
          <option value="pengeluaran">Pos Pengeluaran (-)</option>
        </select>
      </div>

      <div class="form-group flex-1">
        <label for="kat-scope" class="label-caps">Peruntukan</label>
        <select id="kat-scope" name="scope" class="form-input" required>
          <option value="semua">Semua (Kas RW & RT)</option>
          <option value="rt">Khusus Kas RT</option>
          <option value="rw">Khusus Kas RW</option>
        </select>
      </div>
    </div>

    <div class="modal-actions">
      <button type="button" class="btn btn-secondary" onclick={() => (showModalTambahKategori = false)}>
        Batal
      </button>
      <button type="submit" class="btn btn-action">
        Simpan Pos Kategori
      </button>
    </div>
  </form>
</Modal>

<!-- ═════════════════════════════════════════════════════════════════════════ -->
<!-- MODAL: PEMBATALAN TRANSAKSI KAS RW                                       -->
<!-- ═════════════════════════════════════════════════════════════════════════ -->
<Modal
  open={showModalBatalRw}
  title="Koreksi / Batalkan Transaksi Kas RW"
  onClose={() => (showModalBatalRw = false)}
>
  <form method="POST" action="?/batalkanKasRw" class="form-modal">
    <input type="hidden" name="transaksiId" value={selectedTransaksiId} />
    <p class="modal-desc">
      Sesuai prinsip akuntansi, transaksi tidak dihapus permanen. Transaksi ini akan ditandai sebagai <strong>Dibatalkan</strong> dan dikecualikan dari saldo kas RW.
    </p>

    <div class="form-group">
      <label for="alasan-rw" class="label-caps">Alasan Pembatalan / Koreksi</label>
      <input
        id="alasan-rw"
        name="alasan"
        type="text"
        required
        placeholder="Contoh: Salah nominal input / nota revisi"
        class="form-input"
      />
    </div>

    <div class="modal-actions">
      <button type="button" class="btn btn-secondary" onclick={() => (showModalBatalRw = false)}>
        Tutup
      </button>
      <button type="submit" class="btn btn-danger">
        Konfirmasi Pembatalan RW
      </button>
    </div>
  </form>
</Modal>

<!-- ═════════════════════════════════════════════════════════════════════════ -->
<!-- MODAL: PEMBATALAN TRANSAKSI KAS RT                                       -->
<!-- ═════════════════════════════════════════════════════════════════════════ -->
<Modal
  open={showModalBatalRt}
  title="Koreksi / Batalkan Transaksi Kas RT"
  onClose={() => (showModalBatalRt = false)}
>
  <form method="POST" action="?/batalkanKasRt" class="form-modal">
    <input type="hidden" name="transaksiId" value={selectedTransaksiId} />
    <p class="modal-desc">
      Transaksi kas RT ini akan ditandai sebagai <strong>Dibatalkan</strong> dan dikecualikan dari perhitungan saldo RT terkait.
    </p>

    <div class="form-group">
      <label for="alasan-rt" class="label-caps">Alasan Pembatalan / Koreksi</label>
      <input
        id="alasan-rt"
        name="alasan"
        type="text"
        required
        placeholder="Contoh: Salah input nomor RT / revisi kuitansi duka cita"
        class="form-input"
      />
    </div>

    <div class="modal-actions">
      <button type="button" class="btn btn-secondary" onclick={() => (showModalBatalRt = false)}>
        Tutup
      </button>
      <button type="submit" class="btn btn-danger">
        Konfirmasi Pembatalan RT
      </button>
    </div>
  </form>
</Modal>

<style>
  .kas-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .export-btn-group {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
  }

  /* ─── Button Action (Brand Navy) ─── */
  .btn-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    background-color: var(--color-accent);
    color: var(--color-accent-contrast);
    font-size: var(--text-sm);
    font-weight: 600;
    border-radius: var(--radius-md);
    border: none;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
  }
  .btn-action:hover {
    background-color: var(--color-accent-hover);
    transform: translateY(-1px);
  }

  /* ─── Tab Bar Navigation ─── */
  .tab-bar {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    border-bottom: 2px solid var(--color-border);
    padding-bottom: var(--space-2);
    overflow-x: auto;
  }

  .tab-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-md);
    border: none;
    background: transparent;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s ease;
  }

  .tab-btn:hover {
    color: var(--color-text);
    background: var(--color-surface-muted);
  }

  .tab-btn.active {
    color: var(--color-accent);
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
    border-bottom: 3px solid var(--color-accent);
  }

  .tab-pill {
    padding: 2px 6px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    background: var(--color-success-bg);
    color: var(--color-success);
    border-radius: var(--radius-full);
  }

  /* ─── Info Banner ─── */
  .info-banner {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface-muted);
    border: 1px solid var(--color-border);
    border-left: 4px solid var(--color-accent);
    border-radius: var(--radius-md);
  }

  .banner-icon {
    color: var(--color-accent);
    padding-top: 2px;
  }

  .banner-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .banner-title {
    margin: 0;
    font-size: var(--text-sm);
    font-weight: 700;
    color: var(--color-text);
  }

  .banner-text {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    line-height: 1.4;
  }

  /* ─── Metrics ─── */
  .metrics-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(15rem, 100%), 1fr));
    gap: var(--space-4);
  }

  /* ─── Section Heading ─── */
  .section-heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-top: var(--space-2);
  }

  .section-title {
    margin: 0;
    font-size: var(--text-base);
    font-weight: 700;
    color: var(--color-text);
  }

  /* ─── RT Grid Cards ─── */
  .rt-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(14rem, 100%), 1fr));
    gap: var(--space-3);
  }

  .rt-summary-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-3);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    cursor: pointer;
    text-align: left;
    transition: all 0.15s ease;
    box-shadow: var(--shadow-xs);
  }

  .rt-summary-card:hover {
    border-color: var(--color-border-strong);
    box-shadow: var(--shadow-sm);
    transform: translateY(-2px);
  }

  .rt-summary-card.selected {
    border-color: var(--color-accent);
    background: var(--color-surface-muted);
    box-shadow: 0 0 0 2px var(--color-accent);
  }

  .rt-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .rt-card-saldo {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .saldo-value {
    font-size: var(--text-base);
    font-weight: 700;
    color: var(--color-text);
  }

  .rt-card-meta {
    display: flex;
    justify-content: space-between;
    padding-top: var(--space-1);
    border-top: 1px dashed var(--color-border);
  }

  .rt-card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 4px;
  }

  .tag-chip {
    padding: 2px 6px;
    font-size: 10px;
    background: var(--color-surface-muted);
    color: var(--color-text-muted);
    border-radius: var(--radius-xs);
    border: 1px solid var(--color-border);
  }

  :global(.badge-subkas) {
    display: inline-block;
    padding: 2px 8px;
    font-size: var(--text-xs);
    font-weight: 600;
    border-radius: var(--radius-full);
    background: var(--color-surface-muted);
    color: var(--color-text);
    border: 1px solid var(--color-border);
  }

  /* ─── Filters Bar ─── */
  .filters-card {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    flex-wrap: wrap;
  }

  .filter-group {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .filter-select {
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    background: var(--color-surface-muted);
    color: var(--color-text);
    font-size: var(--text-sm);
  }

  .filter-count {
    margin-left: auto;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  /* ─── Rekap Table ─── */
  .table-wrap {
    overflow-x: auto;
  }

  .rekap-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-sm);
  }

  .rekap-table th {
    padding: var(--space-3);
    background: var(--color-surface-muted);
    border-bottom: 2px solid var(--color-border);
    color: var(--color-text-muted);
    text-align: left;
  }

  .rekap-table td {
    padding: var(--space-3);
    border-bottom: 1px solid var(--color-border);
  }

  .rt-cell {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .progress-wrap {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .progress-bar-bg {
    flex: 1;
    height: 8px;
    background: var(--color-surface-muted);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: var(--color-success);
    border-radius: var(--radius-full);
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: var(--text-xs);
    font-weight: 700;
    color: var(--color-text);
    min-width: 32px;
  }

  .tfoot-row td {
    background: var(--color-surface-muted);
    border-top: 2px solid var(--color-border-strong);
    padding: var(--space-3);
  }

  /* ─── Kategori Grid ─── */
  .kategori-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(20rem, 100%), 1fr));
    gap: var(--space-4);
  }

  .kategori-col-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-3);
    padding-bottom: var(--space-2);
    border-bottom: 1px solid var(--color-border);
  }

  .col-title {
    margin: 0;
    font-size: var(--text-base);
    font-weight: 700;
    color: var(--color-text);
  }

  .kategori-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .kategori-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-2) var(--space-3);
    background: var(--color-surface-muted);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .kategori-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .kategori-name {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text);
  }

  .kategori-scope {
    font-size: var(--text-2xs);
    color: var(--color-text-muted);
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.05em;
  }

  .btn-icon-danger {
    background: transparent;
    border: none;
    color: var(--color-danger);
    cursor: pointer;
    padding: var(--space-1);
    border-radius: var(--radius-sm);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s ease;
  }

  .btn-icon-danger:hover {
    background: var(--color-danger-bg);
  }

  /* ─── Modal Styles ─── */
  .form-modal {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .form-row {
    display: flex;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .form-input {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text);
    font-size: var(--text-sm);
  }

  .file-input {
    padding: var(--space-1);
  }

  .modal-desc {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    line-height: 1.4;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);
    margin-top: var(--space-3);
  }

  :global(.line-through) {
    text-decoration: line-through;
  }

  :global(.doc-link) {
    color: var(--color-accent);
    font-weight: 600;
    text-decoration: none;
  }

  :global(.doc-link:hover) {
    text-decoration: underline;
  }

  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .flex-1 { flex: 1; min-width: 150px; }
</style>
