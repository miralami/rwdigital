<script lang="ts">
  import { goto } from '$app/navigation';
  import DataTable from '$lib/components/DataTable.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { Plus } from '@lucide/svelte';
  import type { PageData } from './$types';
  let { data } = $props<{ data: PageData }>();

  const columns = [
    { key: 'nik', label: 'NIK' },
    { key: 'nama', label: 'Nama' },
    { key: 'noKk', label: 'No. KK' },
    { key: 'nomorRt', label: 'RT' },
    {
      key: 'aktif',
      label: 'Status',
      render: (row: any) => row.aktif
        ? '<span class="badge variant-success">Aktif</span>'
        : '<span class="badge variant-default">Nonaktif</span>'
    }
  ];

  function handleRowClick(row: any) {
    goto(`/warga/${row.id}`);
  }
</script>

<PageHeader title="Manajemen Warga" subtitle="Data kependudukan warga, KK, dan wilayah RT.">
  <a href="/warga/tambah" class="btn btn-primary">
    <Plus size={16} />
    <span>Tambah Warga</span>
  </a>
</PageHeader>

<DataTable
  {columns}
  data={data.semuaWarga}
  searchKeys={['nik', 'nama', 'noKk']}
  onRowClick={handleRowClick}
/>
