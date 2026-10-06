<script lang="ts">
  import { ArrowLeft, Download, Users, Home, UserCheck, Calendar } from '@lucide/svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import Card from '$lib/components/Card.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  function unduhCsv() {
    let csv = 'Rekapitulasi Demografis Warga RW\n\n';

    csv += 'Wilayah RT,Jumlah KK,Jumlah Warga\n';
    for (const r of data.rekapRt) {
      csv += `RT ${r.nomorRt},${r.totalKk},${r.totalWarga}\n`;
    }

    csv += '\nDistribusi Jenis Kelamin,Jumlah,Persentase\n';
    const totalG = data.gender.total || 1;
    csv += `Laki-laki,${data.gender.lakiLaki},${Math.round((data.gender.lakiLaki / totalG) * 100)}%\n`;
    csv += `Perempuan,${data.gender.perempuan},${Math.round((data.gender.perempuan / totalG) * 100)}%\n`;

    csv += '\nStatus Huni KK,Jumlah KK,Persentase\n';
    const totalH = data.huni.totalKk || 1;
    csv += `Tetap,${data.huni.tetap},${Math.round((data.huni.tetap / totalH) * 100)}%\n`;
    csv += `Kontrak,${data.huni.kontrak},${Math.round((data.huni.kontrak / totalH) * 100)}%\n`;
    csv += `Kos,${data.huni.kos},${Math.round((data.huni.kos / totalH) * 100)}%\n`;

    csv += '\nKelompok Rentang Usia,Jumlah Warga,Persentase\n';
    const totalU = data.usia.total || 1;
    csv += `Balita (0-5 thn),${data.usia.balita},${Math.round((data.usia.balita / totalU) * 100)}%\n`;
    csv += `Anak-anak (6-12 thn),${data.usia.anak},${Math.round((data.usia.anak / totalU) * 100)}%\n`;
    csv += `Remaja (13-17 thn),${data.usia.remaja},${Math.round((data.usia.remaja / totalU) * 100)}%\n`;
    csv += `Dewasa (18-59 thn),${data.usia.dewasa},${Math.round((data.usia.dewasa / totalU) * 100)}%\n`;
    csv += `Lansia (60+ thn),${data.usia.lansia},${Math.round((data.usia.lansia / totalU) * 100)}%\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rekap_demografis_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
</script>

<div class="rekap-page">
  <div class="header">
    <a href="/warga" class="back-link">
      <ArrowLeft size={16} />
      <span>Kembali ke data warga</span>
    </a>
  </div>

  <PageHeader
    title="Rekapitulasi Demografis Warga"
    subtitle="Laporan ringkasan kependudukan menurut wilayah RT, jenis kelamin, status tinggal, dan rentang usia."
  >
    <button class="btn btn-secondary" onclick={unduhCsv}>
      <Download size={16} />
      <span>Ekspor Laporan CSV</span>
    </button>
  </PageHeader>

  <div class="stats-grid">
    <StatCard
      title="Total Warga Aktif"
      value={data.gender.total}
      icon={Users}
    />
    <StatCard
      title="Total Kartu Keluarga"
      value={data.huni.totalKk}
      icon={Home}
    />
    <StatCard
      title="Laki-laki"
      value={data.gender.lakiLaki}
      icon={UserCheck}
    />
    <StatCard
      title="Perempuan"
      value={data.gender.perempuan}
      icon={UserCheck}
    />
  </div>

  <div class="sections-grid">
    <!-- Sebaran RT -->
    <Card title="Sebaran Warga & KK per Wilayah RT">
      <div class="table-wrap">
        <table class="rekap-table">
          <thead>
            <tr>
              <th class="label-caps">Wilayah</th>
              <th class="label-caps text-right">Jumlah KK</th>
              <th class="label-caps text-right">Jumlah Warga</th>
            </tr>
          </thead>
          <tbody>
            {#each data.rekapRt as r}
              <tr>
                <td class="font-medium">RT {r.nomorRt}</td>
                <td class="text-right">{r.totalKk} KK</td>
                <td class="text-right font-medium">{r.totalWarga} Jiwa</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </Card>

    <!-- Rentang Usia -->
    <Card title="Distribusi Kelompok Usia Warga">
      <div class="table-wrap">
        <table class="rekap-table">
          <thead>
            <tr>
              <th class="label-caps">Kelompok Usia</th>
              <th class="label-caps text-right">Jumlah</th>
              <th class="label-caps text-right">Persentase</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Balita (0 – 5 tahun)</td>
              <td class="text-right">{data.usia.balita}</td>
              <td class="text-right">{data.usia.total ? Math.round((data.usia.balita / data.usia.total) * 100) : 0}%</td>
            </tr>
            <tr>
              <td>Anak-anak (6 – 12 tahun)</td>
              <td class="text-right">{data.usia.anak}</td>
              <td class="text-right">{data.usia.total ? Math.round((data.usia.anak / data.usia.total) * 100) : 0}%</td>
            </tr>
            <tr>
              <td>Remaja (13 – 17 tahun)</td>
              <td class="text-right">{data.usia.remaja}</td>
              <td class="text-right">{data.usia.total ? Math.round((data.usia.remaja / data.usia.total) * 100) : 0}%</td>
            </tr>
            <tr>
              <td>Dewasa (18 – 59 tahun)</td>
              <td class="text-right font-medium">{data.usia.dewasa}</td>
              <td class="text-right font-medium">{data.usia.total ? Math.round((data.usia.dewasa / data.usia.total) * 100) : 0}%</td>
            </tr>
            <tr>
              <td>Lansia (60+ tahun)</td>
              <td class="text-right">{data.usia.lansia}</td>
              <td class="text-right">{data.usia.total ? Math.round((data.usia.lansia / data.usia.total) * 100) : 0}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <!-- Status Huni -->
    <Card title="Status Hunian Kartu Keluarga">
      <div class="table-wrap">
        <table class="rekap-table">
          <thead>
            <tr>
              <th class="label-caps">Status Tempat Tinggal</th>
              <th class="label-caps text-right">Jumlah KK</th>
              <th class="label-caps text-right">Persentase</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Warga Tetap</td>
              <td class="text-right font-medium">{data.huni.tetap}</td>
              <td class="text-right">{data.huni.totalKk ? Math.round((data.huni.tetap / data.huni.totalKk) * 100) : 0}%</td>
            </tr>
            <tr>
              <td>Warga Kontrak</td>
              <td class="text-right">{data.huni.kontrak}</td>
              <td class="text-right">{data.huni.totalKk ? Math.round((data.huni.kontrak / data.huni.totalKk) * 100) : 0}%</td>
            </tr>
            <tr>
              <td>Warga Kos</td>
              <td class="text-right">{data.huni.kos}</td>
              <td class="text-right">{data.huni.totalKk ? Math.round((data.huni.kos / data.huni.totalKk) * 100) : 0}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </div>
</div>

<style>
  .rekap-page {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    text-decoration: none;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
    gap: var(--space-4);
  }

  .sections-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr));
    gap: var(--space-4);
  }

  .table-wrap {
    overflow-x: auto;
  }

  .rekap-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-sm);
  }

  .rekap-table th {
    padding: var(--space-2) var(--space-3);
    background: var(--color-surface-muted);
    border-bottom: 1px solid var(--color-border);
    color: var(--color-text-secondary);
  }

  .rekap-table td {
    padding: var(--space-3);
    border-bottom: 1px solid var(--color-border);
  }

  .text-right {
    text-align: right;
  }
</style>
