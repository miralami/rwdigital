<script lang="ts">
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Badge from '$lib/components/Badge.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import Check from '@lucide/svelte/icons/check';
  import X from '@lucide/svelte/icons/x';
  import { formatRupiah, formatTanggal, maskNoKk } from '$lib/format';
  import type { PageData } from './$types';

  let { data, form }: { data: PageData; form?: { error?: string } } = $props();

  const LABEL_METODE: Record<string, string> = {
    tunai: 'Tunai',
    transfer: 'Transfer'
  };

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

  <h1>Konfirmasi pembayaran warga</h1>
  <p class="subtitle">
    Konfirmasi dari portal warga. Setelah diterima, pembayaran tercatat di iuran, kas RW, dan
    riwayat portal warga sekaligus.
  </p>

  {#if form?.error}
    <p class="error-banner" role="alert">{form.error}</p>
  {/if}

  <section aria-labelledby="menunggu-judul">
    <h2 id="menunggu-judul">
      Menunggu verifikasi
      <span class="count">{data.menunggu.length}</span>
    </h2>

    {#if data.menunggu.length === 0}
      <div class="card panel">
        <EmptyState
          message="Tidak ada konfirmasi baru"
          description="Pengajuan pembayaran dari portal warga akan muncul di sini."
        />
      </div>
    {:else}
      <ul class="daftar">
        {#each data.menunggu as k (k.id)}
          <li class="card konfirmasi-card">
            <div class="konfirmasi-head">
              <div>
                <p class="nama-jenis">{k.namaJenis}</p>
                <p class="muted kecil">
                  {labelPeriode(k.periode)} · KK {maskNoKk(k.noKk)} · RT {String(k.nomorRt).padStart(2, '0')}
                </p>
                <p class="muted kecil">{k.alamat}</p>
              </div>
              <Badge variant="warning">Menunggu</Badge>
            </div>

            <dl class="nominal-grid">
              <div>
                <dt>Diajukan</dt>
                <dd>{formatRupiah(k.jumlah)}</dd>
              </div>
              <div>
                <dt>Tagihan</dt>
                <dd>{formatRupiah(k.nominalTagihan)}</dd>
              </div>
              <div>
                <dt>Sisa saat ini</dt>
                <dd>{formatRupiah(k.sisa)}</dd>
              </div>
              <div>
                <dt>Metode</dt>
                <dd>{LABEL_METODE[k.metodeBayar] ?? k.metodeBayar}</dd>
              </div>
            </dl>

            {#if k.catatan}
              <p class="catatan">Catatan warga: “{k.catatan}”</p>
            {/if}

            <p class="muted kecil">Diajukan {formatTanggal(k.createdAt)}</p>

            <div class="aksi">
              <form method="POST" action="?/terima">
                <input type="hidden" name="id" value={k.id} />
                <button type="submit" class="btn btn-primary">
                  <Check size={16} />
                  <span>Terima &amp; catat</span>
                </button>
              </form>

              <details class="tolak-details">
                <summary class="btn btn-secondary btn-tolak">
                  <X size={16} />
                  <span>Tolak</span>
                </summary>
                <form method="POST" action="?/tolak" class="form-tolak">
                  <input type="hidden" name="id" value={k.id} />
                  <div class="field">
                    <label for="alasan-{k.id}">Alasan penolakan (opsional)</label>
                    <input
                      id="alasan-{k.id}"
                      name="alasanTolak"
                      class="input-base"
                      type="text"
                      placeholder="mis. dana belum diterima"
                    />
                  </div>
                  <button type="submit" class="btn btn-danger">Tolak konfirmasi</button>
                </form>
              </details>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </section>

  <section aria-labelledby="riwayat-judul">
    <h2 id="riwayat-judul">Sudah diproses</h2>

    {#if data.riwayat.length === 0}
      <div class="card panel">
        <EmptyState message="Belum ada riwayat" description="Konfirmasi yang sudah diproses tampil di sini." />
      </div>
    {:else}
      <div class="card panel">
        <ul class="riwayat-list">
          {#each data.riwayat as k (k.id)}
            <li class="riwayat-row">
              <div>
                <p class="nama-jenis">{k.namaJenis} · {labelPeriode(k.periode)}</p>
                <p class="muted kecil">
                  {formatRupiah(k.jumlah)} · KK {maskNoKk(k.noKk)}
                  {#if k.diprosesPada}· diproses {formatTanggal(k.diprosesPada)}{/if}
                  {#if k.alasanTolak}· alasan: {k.alasanTolak}{/if}
                </p>
              </div>
              {#if k.status === 'diterima'}
                <Badge variant="success">Diterima</Badge>
              {:else}
                <Badge variant="danger">Ditolak</Badge>
              {/if}
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
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin: 0 0 var(--space-3);
    font-size: var(--text-lg);
    font-weight: 600;
  }

  .count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5rem;
    padding: 0 0.4rem;
    border-radius: var(--radius-full);
    background: var(--color-warning-bg);
    color: var(--color-warning);
    font-size: var(--text-xs);
    font-weight: 700;
  }

  .subtitle {
    margin: calc(var(--space-2) * -1) 0 var(--space-2);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
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

  .konfirmasi-card {
    padding: var(--space-4);
  }

  .konfirmasi-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .nama-jenis {
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

  .catatan {
    margin: 0 0 var(--space-2);
    font-size: var(--text-sm);
    font-style: italic;
  }

  .aksi {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--space-2);
    margin-top: var(--space-3);
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border);
  }

  .tolak-details > summary {
    list-style: none;
    cursor: pointer;
  }

  .tolak-details > summary::-webkit-details-marker {
    display: none;
  }

  .btn-tolak {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
  }

  .form-tolak {
    margin-top: var(--space-3);
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
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) 0;
    border-bottom: 1px solid var(--color-border);
  }

  .riwayat-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  @media (max-width: 30rem) {
    .riwayat-row {
      flex-wrap: wrap;
    }
  }
</style>
