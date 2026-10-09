<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { formatRupiah, formatTanggal } from '$lib/format';
  import Plus from '@lucide/svelte/icons/plus';
  import Tags from '@lucide/svelte/icons/tags';
  import Wallet from '@lucide/svelte/icons/wallet';
  import ArrowDownRight from '@lucide/svelte/icons/arrow-down-right';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import Download from '@lucide/svelte/icons/download';
  import FileText from '@lucide/svelte/icons/file-text';
  import Ban from '@lucide/svelte/icons/ban';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  let filterPeriode = $state<'semua' | 'bulan_ini' | 'tahun_ini'>('semua');
  let selectedTransaksiId = $state<number | null>(null);
  let showModalBatal = $state(false);

  const sekarang = new Date();
  const thnSekarang = sekarang.getFullYear();
  const blnSekarang = String(sekarang.getMonth() + 1).padStart(2, '0');

  const filteredTransaksi = $derived(
    data.semuaTransaksi.filter((t: any) => {
      if (filterPeriode === 'bulan_ini') {
        return t.tanggal.startsWith(`${thnSekarang}-${blnSekarang}`);
      }
      if (filterPeriode === 'tahun_ini') {
        return t.tanggal.startsWith(`${thnSekarang}`);
      }
      return true;
    })
  );

  const columns = [
    {
      key: 'tanggal',
      label: 'Tanggal',
      render: (row: any) => formatTanggal(row.tanggal)
    },
    {
      key: 'keterangan',
      label: 'Keterangan',
      render: (row: any) => {
        let html = `<span class="${row.dibatalkan ? 'line-through text-muted' : ''}">${row.keterangan}</span>`;
        if (row.dibatalkan) {
          html += `<br><span class="text-xs text-danger font-medium">Dibatalkan: ${row.alasanBatal ?? 'Koreksi'} (${row.dibatalkanOleh ?? ''})</span>`;
        }
        return html;
      }
    },
    { key: 'namaKategori', label: 'Kategori', render: (row: any) => row.namaKategori ?? '—' },
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
        return `<button type="button" class="btn btn-sm btn-secondary text-xs" data-batal="${row.id}">Batal</button>`;
      }
    }
  ];

  function handleRowClick(row: any) {
    // Aksi pembatalan ditangani terpisah
  }

  function onTableClick(e: MouseEvent) {
    const target = (e.target as HTMLElement).closest('[data-batal]') as HTMLElement | null;
    if (target) {
      const id = target.getAttribute('data-batal');
      if (id) {
        selectedTransaksiId = Number(id);
        showModalBatal = true;
      }
    }
  }

  function eksporCsv() {
    let csv = 'Laporan Arus Keuangan Kas RW\n\n';
    csv += 'Tanggal,Keterangan,Kategori,Jenis,Nominal,Status,Dicatat Oleh\n';
    for (const t of filteredTransaksi) {
      csv += `"${t.tanggal}","${t.keterangan}","${t.namaKategori ?? ''}","${t.jenis}",${t.nominal},"${t.dibatalkan ? 'Dibatalkan' : 'Aktif'}","${t.dicatatOleh}"\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan_kas_${filterPeriode}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
</script>

<PageHeader title="Kas RW" subtitle="Pencatatan pembukuan, arus pemasukan, dan pengeluaran kas lingkungan.">
  <div class="header-actions">
    <button class="btn btn-secondary" onclick={eksporCsv}>
      <Download size={16} />
      <span>Ekspor CSV</span>
    </button>
    <a href="/kas/kategori" class="btn btn-secondary">
      <Tags size={16} />
      <span>Kelola kategori</span>
    </a>
    <a href="/kas/tambah" class="btn btn-secondary">
      <Plus size={16} />
      <span>Tambah transaksi</span>
    </a>
  </div>
</PageHeader>

<div class="metrics-row">
  <StatCard
    title="Total Pemasukan"
    value={formatRupiah(data.totalPemasukan)}
    description="Akumulasi penerimaan kas aktif"
    icon={ArrowDownRight}
    variant="success"
  />

  <StatCard
    title="Total Pengeluaran"
    value={formatRupiah(data.totalPengeluaran)}
    description="Akumulasi beban operasional aktif"
    icon={ArrowUpRight}
    variant="danger"
  />

  <StatCard
    title="Saldo Akhir Kas"
    value={formatRupiah(data.saldo)}
    description={data.saldo >= 0 ? 'Surplus kas operasional' : 'Defisit kas operasional'}
    icon={Wallet}
    variant={data.saldo >= 0 ? 'brand' : 'danger'}
  />
</div>

<div class="filters-card">
  <div class="filter-group">
    <label for="filter-periode" class="label-caps">Filter Periode Waktu:</label>
    <select id="filter-periode" bind:value={filterPeriode} class="filter-select">
      <option value="semua">Semua Periode</option>
      <option value="bulan_ini">Bulan Ini ({blnSekarang}/{thnSekarang})</option>
      <option value="tahun_ini">Tahun Ini ({thnSekarang})</option>
    </select>
  </div>
</div>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div role="presentation" onclick={onTableClick}>
  <DataTable
    {columns}
    data={filteredTransaksi}
    searchKeys={['keterangan', 'namaKategori']}
    onRowClick={handleRowClick}
  />
</div>

<!-- Modal Pembatalan / Koreksi Transaksi (SF-KS-06) -->
<Modal
  open={showModalBatal}
  title="Koreksi / Batalkan Transaksi Kas"
  onClose={() => (showModalBatal = false)}
>
  <form method="POST" action="?/batalkan" class="form-modal">
    <input type="hidden" name="transaksiId" value={selectedTransaksiId} />
    <p class="modal-desc">
      Sesuai prinsip akuntansi dan regulasi pelaporan kas RW, transaksi tidak dihapus permanen. Transaksi ini akan ditandai sebagai <strong>Dibatalkan</strong> dan dikecualikan dari perhitungan saldo.
    </p>

    <div class="form-group">
      <label for="alasan" class="label-caps">Alasan Pembatalan / Koreksi</label>
      <input
        id="alasan"
        name="alasan"
        type="text"
        required
        placeholder="Contoh: Salah nominal input / nota revisi"
        class="form-input"
      />
    </div>

    <div class="modal-actions">
      <button
        type="button"
        class="btn btn-secondary"
        onclick={() => (showModalBatal = false)}
      >
        Tutup
      </button>
      <button type="submit" class="btn btn-danger">
        Konfirmasi Pembatalan
      </button>
    </div>
  </form>
</Modal>

<style>
  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .metrics-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(15rem, 100%), 1fr));
    gap: var(--space-4);
    margin-bottom: var(--space-6);
  }

  .filters-card {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    margin-bottom: var(--space-4);
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface-raised);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
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
    background: var(--color-surface);
    color: var(--color-text-primary);
    font-size: var(--text-sm);
  }

  :global(.line-through) {
    text-decoration: line-through;
  }

  .form-modal {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .modal-desc {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
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
    color: var(--color-text-primary);
    font-size: var(--text-sm);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
    margin-top: var(--space-2);
  }

  :global(.doc-link) {
    color: var(--color-brand-600);
    font-weight: 500;
    text-decoration: none;
  }

  :global(.doc-link:hover) {
    text-decoration: underline;
  }
</style>
