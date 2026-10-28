<script lang="ts">
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Badge from '$lib/components/Badge.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import { formatRupiah, formatTanggal } from '$lib/format';
  import type { PageData } from './$types';

  let { data, form }: { data: PageData; form?: { error?: string } } = $props();

  const hariIni = new Date().toISOString().slice(0, 10);

  function labelPeriode(periode: string): string {
    const [tahun, bulan] = periode.split('-');
    const nama = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const index = Number(bulan) - 1;
    return nama[index] ? `${nama[index]} ${tahun}` : periode;
  }
</script>

<div class="page-container">
  <a href="/iuran" class="back-link">
    <ArrowLeft size={16} />
    <span>Kembali ke iuran</span>
  </a>

  <h1>Setoran RT &rarr; RW</h1>
  <p class="subtitle">
    Porsi RW dari iuran RT yang sudah terkumpul. Setelah disetor, kas RT berkurang dan kas RW
    bertambah dalam satu langkah, jadi kedua laporan selalu cocok.
  </p>

  <form method="GET" class="filter-periode">
    <label for="periode">Periode</label>
    <input id="periode" name="periode" type="month" class="input-base" value={data.periode} />
    <button type="submit" class="btn btn-secondary">Tampilkan</button>
  </form>

  {#if form?.error}
    <p class="error-banner" role="alert">{form.error}</p>
  {/if}

  <section aria-labelledby="ringkasan-judul">
    <h2 id="ringkasan-judul">Ringkasan {labelPeriode(data.periode)}</h2>

    {#if data.ringkasan.length === 0}
      <div class="card panel">
        <EmptyState message="Belum ada RT" description="Tambahkan RT di menu Pengaturan terlebih dahulu." />
      </div>
    {:else}
      <ul class="daftar">
        {#each data.ringkasan as item (item.id)}
          <li class="card rt-card">
            <div class="rt-head">
              <div>
                <p class="rt-nama">RT {String(item.nomor).padStart(2, '0')}</p>
                <p class="muted kecil">
                  {item.jumlahTagihan} tagihan · {item.jumlahLunas} lunas
                </p>
              </div>
              {#if item.setoranAktifId}
                <Badge variant="success">Sudah disetor</Badge>
              {:else if item.sisa > 0}
                <Badge variant="warning">Belum disetor</Badge>
              {:else}
                <Badge variant="default">Tidak ada porsi</Badge>
              {/if}
            </div>

            <dl class="nominal-grid">
              <div>
                <dt>Terkumpul</dt>
                <dd>{formatRupiah(item.totalTerkumpul)}</dd>
              </div>
              <div>
                <dt>Porsi RW</dt>
                <dd>{formatRupiah(item.porsiRw)}</dd>
              </div>
              <div>
                <dt>Sudah disetor</dt>
                <dd>{formatRupiah(item.sudahDisetor)}</dd>
              </div>
              <div>
                <dt>Sisa</dt>
                <dd class:habis={item.sisa === 0}>{formatRupiah(item.sisa)}</dd>
              </div>
            </dl>

            {#if data.bolehUbah && item.sisa > 0 && !item.setoranAktifId}
              <details class="form-details">
                <summary class="btn btn-primary btn-setor">Setor {formatRupiah(item.sisa)} ke RW</summary>
                <form
                  method="POST"
                  action="?/setor"
                  enctype="multipart/form-data"
                  class="form-setor"
                >
                  <input type="hidden" name="rtId" value={item.id} />
                  <input type="hidden" name="periode" value={data.periode} />
                  <div class="field">
                    <label for="tanggal-{item.id}">Tanggal setor</label>
                    <input
                      id="tanggal-{item.id}"
                      name="tanggal"
                      class="input-base"
                      type="date"
                      value={hariIni}
                      required
                    />
                  </div>
                  <div class="field">
                    <label for="catatan-{item.id}">Catatan (opsional)</label>
                    <input
                      id="catatan-{item.id}"
                      name="catatan"
                      class="input-base"
                      type="text"
                      placeholder="mis. diserahkan ke bendahara RW"
                    />
                  </div>
                  <div class="field">
                    <label for="bukti-{item.id}">Bukti setor (opsional)</label>
                    <input
                      id="bukti-{item.id}"
                      name="buktiFile"
                      class="input-base"
                      type="file"
                      accept="image/*,application/pdf"
                    />
                  </div>
                  <p class="hint">
                    Nominal mengikuti porsi RW yang terkumpul saat ini dan disimpan sebagai
                    snapshot.
                  </p>
                  <button type="submit" class="btn btn-primary">Catat setoran</button>
                </form>
              </details>
            {:else if item.setoranAktifId}
              <p class="muted kecil catatan-setor">
                Setoran periode ini sudah tercatat. Batalkan dulu bila ingin mengoreksi nominal.
              </p>
            {:else if item.porsiRw === 0}
              <p class="muted kecil catatan-setor">
                Belum ada porsi RW. Atur kolom <strong>Porsi RW</strong> di
                <a href="/iuran/jenis">kelola jenis iuran</a> agar setoran bisa dihitung.
              </p>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </section>

  <section aria-labelledby="riwayat-setoran-judul">
    <h2 id="riwayat-setoran-judul">Riwayat setoran</h2>

    {#if data.riwayat.length === 0}
      <div class="card panel">
        <EmptyState
          message="Belum ada setoran"
          description="Setoran yang dicatat untuk periode ini akan muncul di sini."
        />
      </div>
    {:else}
      <div class="card panel">
        <ul class="riwayat-list">
          {#each data.riwayat as s (s.id)}
            <li class="riwayat-row" class:dibatalkan={s.dibatalkan}>
              <div>
                <p class="riwayat-nama">
                  RT {String(s.nomorRt).padStart(2, '0')} · {formatRupiah(s.porsiRw)}
                  {#if s.dibatalkan}
                    <span class="muted kecil">(dibatalkan)</span>
                  {/if}
                </p>
                <p class="muted kecil">
                  Disetor {formatTanggal(s.disetorPada)} · terkumpul
                  {formatRupiah(s.totalTerkumpul)}
                  {#if s.catatan}· {s.catatan}{/if}
                  {#if s.alasanBatal}· alasan batal: {s.alasanBatal}{/if}
                </p>
              </div>

              <div class="riwayat-aksi">
                {#if s.bukti}
                  <a class="btn btn-secondary btn-sm" href={s.bukti} target="_blank" rel="noopener">
                    Bukti
                  </a>
                {/if}
                {#if !s.dibatalkan && data.bolehUbah}
                  <details class="batal-details">
                    <summary class="btn btn-secondary btn-sm">Batalkan</summary>
                    <form method="POST" action="?/batalkan" class="form-batal">
                      <input type="hidden" name="id" value={s.id} />
                      <div class="field">
                        <label for="alasan-{s.id}">Alasan pembatalan (opsional)</label>
                        <input
                          id="alasan-{s.id}"
                          name="alasan"
                          class="input-base"
                          type="text"
                          placeholder="mis. nominal salah"
                        />
                      </div>
                      <button type="submit" class="btn btn-danger">Batalkan setoran</button>
                    </form>
                  </details>
                {/if}
              </div>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </section>
</div>

<style>
  .page-container {
    max-width: 56rem;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding-bottom: var(--space-10);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    min-height: var(--tap-min);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    text-decoration: none;
  }

  .back-link:hover {
    color: var(--color-text);
  }

  h1 {
    margin: 0;
    font-size: var(--text-2xl);
    font-weight: 700;
    letter-spacing: var(--tracking-tight);
  }

  h2 {
    margin: 0 0 var(--space-3);
    font-size: var(--text-lg);
    font-weight: 600;
  }

  .subtitle {
    margin: calc(var(--space-2) * -1) 0 0;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
  }

  .filter-periode {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: var(--space-2);
  }

  .filter-periode label {
    width: 100%;
    font-size: var(--text-sm);
    font-weight: 500;
  }

  .filter-periode input {
    max-width: 14rem;
  }

  .error-banner {
    margin: 0;
    padding: var(--space-3) var(--space-4);
    border: 1px solid var(--color-danger);
    border-radius: var(--radius-md);
    background: var(--color-danger-bg);
    color: var(--color-danger);
    font-size: var(--text-sm);
  }

  .daftar {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .rt-card {
    padding: var(--space-4);
  }

  .rt-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .rt-nama {
    margin: 0;
    font-weight: 600;
  }

  .muted {
    color: var(--color-text-muted);
    margin: 0;
  }

  .kecil {
    font-size: var(--text-xs);
  }

  .nominal-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
    gap: var(--space-3);
    margin: var(--space-3) 0;
  }

  .nominal-grid dt {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .nominal-grid dd {
    margin: 2px 0 0;
    font-weight: 600;
  }

  .nominal-grid dd.habis {
    color: var(--color-success);
  }

  .form-details {
    margin-top: var(--space-3);
  }

  .form-details > summary {
    list-style: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .form-details > summary::-webkit-details-marker {
    display: none;
  }

  .form-setor {
    margin-top: var(--space-3);
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    margin-bottom: var(--space-3);
  }

  label {
    font-size: var(--text-sm);
    font-weight: 500;
  }

  .hint {
    margin: 0 0 var(--space-3);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .catatan-setor {
    margin-top: var(--space-2);
  }

  .panel {
    padding: var(--space-4);
  }

  .riwayat-list {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .riwayat-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-3);
    padding: var(--space-3) 0;
    border-bottom: 1px solid var(--color-border);
  }

  .riwayat-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .riwayat-row.dibatalkan {
    opacity: 0.65;
  }

  .riwayat-nama {
    margin: 0;
    font-weight: 600;
  }

  .riwayat-aksi {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    align-items: flex-start;
  }

  .batal-details > summary {
    list-style: none;
    cursor: pointer;
  }

  .batal-details > summary::-webkit-details-marker {
    display: none;
  }

  .form-batal {
    margin-top: var(--space-3);
    min-width: 16rem;
  }

  @media (max-width: 30rem) {
    .riwayat-row {
      flex-wrap: wrap;
    }
  }
</style>
