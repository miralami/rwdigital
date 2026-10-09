<script lang="ts">
  import { goto } from '$app/navigation';
  import DataTable from '$lib/components/DataTable.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { maskNik, formatTanggal } from '$lib/format';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  const columns = [
    {
      key: 'nomorSurat',
      label: 'No. Surat',
      render: (row: any) => row.nomorSurat ?? '<span class="text-muted">—</span>'
    },
    {
      key: 'namaWarga',
      label: 'Pemohon',
      render: (row: any) => `<div><span class="font-medium">${row.namaWarga}</span><br><span class="text-xs text-muted">${maskNik(row.nikWarga)}</span></div>`
    },
    {
      key: 'jenis',
      label: 'Jenis Surat',
      render: (row: any) => `<span class="badge variant-brand">Surat ${row.jenis.toUpperCase()}</span>`
    },
    {
      key: 'nomorRt',
      label: 'RT',
      render: (row: any) => `RT ${row.nomorRt}`
    },
    {
      key: 'createdAt',
      label: 'Tgl Pengajuan',
      render: (row: any) => formatTanggal(row.createdAt)
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => {
        if (row.status === 'diajukan') return '<span class="badge variant-warning">Diajukan</span>';
        if (row.status === 'diverifikasi') return '<span class="badge variant-brand">Diverifikasi</span>';
        if (row.status === 'disetujui') return '<span class="badge variant-success">Disetujui</span>';
        return '<span class="badge variant-danger">Ditolak</span>';
      }
    }
  ];

  function handleRowClick(row: any) {
    goto(`/surat/${row.id}`);
  }
</script>

<PageHeader
  title="Pelayanan Surat-Menyurat"
  subtitle="Daftar pengajuan permohonan surat pengantar dan surat keterangan warga."
/>

<DataTable
  {columns}
  data={data.semuaSurat}
  searchKeys={['nomorSurat', 'namaWarga', 'nikWarga', 'jenis', 'status']}
  onRowClick={handleRowClick}
/>
