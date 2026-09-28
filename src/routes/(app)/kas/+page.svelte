<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import { Plus, Tags, Wallet, ArrowDownRight, ArrowUpRight } from '@lucide/svelte';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  const columns = [
    { key: 'tanggal', label: 'Tanggal' },
    { key: 'keterangan', label: 'Keterangan' },
    { key: 'namaKategori', label: 'Kategori' },
    {
      key: 'jenis',
      label: 'Jenis',
      render: (row: any) => row.jenis === 'pemasukan'
        ? '<span class="badge variant-success">Pemasukan</span>'
        : '<span class="badge variant-danger">Pengeluaran</span>'
    },
    {
      key: 'nominal',
      label: 'Nominal',
      class: 'text-right',
      render: (row: any) => {
        const formatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.nominal);
        return row.jenis === 'pemasukan'
          ? `<span style="font-weight: 600; color: var(--color-success)">+${formatted}</span>`
          : `<span style="font-weight: 600; color: var(--color-danger)">-${formatted}</span>`;
      }
    }
  ];

  function formatRupiah(n: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
  }
</script>

<PageHeader title="Kas RW" subtitle="Pencatatan pembukuan, arus pemasukan, dan pengeluaran kas lingkungan.">
  <a href="/kas/kategori" class="btn btn-secondary">
    <Tags size={16} />
    <span>Kelola Kategori</span>
  </a>
  <a href="/kas/tambah" class="btn btn-primary">
    <Plus size={16} />
    <span>Tambah Transaksi</span>
  </a>
</PageHeader>

<div class="metrics-row">
  <StatCard
    title="Total Pemasukan"
    value={formatRupiah(data.totalPemasukan)}
    description="Akumulasi penerimaan kas"
    icon={ArrowDownRight}
    variant="success"
  />

  <StatCard
    title="Total Pengeluaran"
    value={formatRupiah(data.totalPengeluaran)}
    description="Akumulasi beban operasional"
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

<DataTable
  {columns}
  data={data.semuaTransaksi}
  searchKeys={['keterangan', 'namaKategori']}
/>

<style>
  .metrics-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
</style>
