<script lang="ts">
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Badge from '$lib/components/Badge.svelte';
  import Card from '$lib/components/Card.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import Receipt from '@lucide/svelte/icons/receipt';
  import { formatRupiah, formatTanggal, maskNoKk } from '$lib/format';
  import type { PageData } from './$types';

  let { data, form }: { data: PageData; form?: { sukses?: string; error?: string } } = $props();

  const LABEL_METODE: Record<string, string> = {
    tunai: 'Tunai',
    transfer: 'Transfer',
    qris: 'QRIS'
  };

  const LABEL_STATUS: Record<string, string> = {
    belum_bayar: 'Belum bayar',
    sebagian: 'Bayar sebagian',
    lunas: 'Lunas'
  };

  function toneStatus(status: string): 'success' | 'warning' | 'danger' {
    if (status === 'lunas') return 'success';
    if (status === 'sebagian') return 'warning';
    return 'danger';
  }

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

<div class="portal-page">
  <a href="/portal" class="back-link">
    <ArrowLeft size={16} />
    <span>Kembali ke beranda</span>
  </a>

  <h1>Tagihan &amp; pembayaran</h1>
  <p class="subtitle">
    Rincian tagihan keluarga Anda, konfirmasi pembayaran tunai/transfer, dan riwayat pembayaran.
  </p>

  {#if form?.sukses}
    <p class="banner banner-sukses" role="status">{form.sukses}</p>
  {/if}
  {#if form?.error}
    <p class="banner banner-error" role="alert">{form.error}</p>
  {/if}

  {#if !data.terhubung}
    <Card>
      <p class="muted">
        Akun ini belum terhubung ke data warga. Hubungi Admin RW agar tagihan bisa ditampilkan.
      </p>
    </Card>
  {:else}
    <Card tone={data.ringkasan && data.ringkasan.sisa > 0 ? 'warning' : 'success'}>
      <p class="label-caps">Total sisa tagihan</p>
      <p class="total-sisa">{formatRupiah(data.ringkasan?.sisa ?? 0)}</p>
      <p class="muted kecil">
        {data.ringkasan?.jumlahBelumLunas ?? 0} tagihan belum lunas dari
        {data.tagihan.length} tagihan · KK {maskNoKk(data.pemilik?.noKk)} · RT
        {String(data.pemilik?.nomorRt ?? '').padStart(2, '0')}
      </p>
    </Card>

    <section aria-labelledby="daftar-tagihan">
      <h2 id="daftar-tagihan">Rincian tagihan</h2>

      {#if data.tagihan.length === 0}
        <Card>
          <EmptyState message="Belum ada tagihan" description="Tagihan dari pengurus akan muncul di sini." />
        </Card>
      {:else}
        <ul class="tagihan-list">
          {#each data.tagihan as t (t.id)}
            <li class="tagihan-item">
              <div class="tagihan-head">
                <div>
                  <p class="tagihan-nama">{t.namaJenis}</p>
                  <p class="muted kecil">{labelPeriode(t.periode)} · {t.scopeJenis === 'rw' ? 'Iuran RW' : 'Iuran RT'}</p>
                  {#if t.jatuhTempo}
                    <p class="kecil" class:lewat={t.menunggak}>
                      Jatuh tempo {formatTanggal(t.jatuhTempo)}
                      {#if t.menunggak}<span class="badge variant-danger">Menunggak</span>{/if}
                    </p>
                  {/if}
                </div>
                <Badge variant={toneStatus(t.status)}>{LABEL_STATUS[t.status] ?? t.status}</Badge>
              </div>

              <dl class="nominal-grid">
                <div>
                  <dt>Tagihan</dt>
                  <dd>{formatRupiah(t.nominal)}</dd>
                </div>
                <div>
                  <dt>Dibayar</dt>
                  <dd>{formatRupiah(t.totalDibayar)}</dd>
                </div>
                <div>
                  <dt>Sisa</dt>
                  <dd class:habis={t.sisa === 0}>{formatRupiah(t.sisa)}</dd>
                </div>
              </dl>

              {#if t.konfirmasiMenunggu}
                <div class="konfirmasi-menunggu">
                  <span>
                    Konfirmasi {formatRupiah(t.konfirmasiMenunggu.jumlah)} ({LABEL_METODE[
                      t.konfirmasiMenunggu.metodeBayar
                    ] ?? t.konfirmasiMenunggu.metodeBayar}) menunggu verifikasi bendahara.
                  </span>
                  <form method="POST" action="?/batalkan">
                    <input type="hidden" name="id" value={t.konfirmasiMenunggu.id} />
                    <button type="submit" class="btn-link">Batalkan</button>
                  </form>
                </div>
              {:else if t.sisa > 0}
                <details class="form-details">
                  <summary class="btn btn-secondary btn-konfirmasi">Konfirmasi pembayaran</summary>
                  <form method="POST" action="?/ajukan" class="form-ajukan">
                    <input type="hidden" name="tagihanId" value={t.id} />
                    <div class="field">
                      <label for="jumlah-{t.id}">Jumlah dibayar (Rp)</label>
                      <input
                        id="jumlah-{t.id}"
                        name="jumlah"
                        class="input-base"
                        type="number"
                        min="1"
                        step="1000"
                        value={t.sisa}
                        required
                      />
                      <span class="hint">Sisa tagihan {formatRupiah(t.sisa)}.</span>
                    </div>
                    <div class="field">
                      <label for="metode-{t.id}">Metode</label>
                      <select id="metode-{t.id}" name="metodeBayar" class="input-base">
                        <option value="tunai">Tunai ke bendahara</option>
                        <option value="transfer">Transfer bank</option>
                      </select>
                    </div>
                    <div class="field">
                      <label for="catatan-{t.id}">Catatan (opsional)</label>
                      <input
                        id="catatan-{t.id}"
                        name="catatan"
                        class="input-base"
                        type="text"
                        placeholder="mis. diserahkan tanggal 5"
                      />
                    </div>
                    <button type="submit" class="btn btn-primary">Kirim konfirmasi</button>
                  </form>
                </details>
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
    </section>

    <section aria-labelledby="riwayat-bayar">
      <h2 id="riwayat-bayar">Riwayat pembayaran</h2>
      {#if data.riwayat.length === 0}
        <Card>
          <EmptyState
            message="Belum ada pembayaran"
            description="Pembayaran yang sudah diverifikasi bendahara akan tercatat di sini."
            icon={Receipt}
          />
        </Card>
      {:else}
        <Card padded={false}>
          <ul class="riwayat-list">
            {#each data.riwayat as bayar (bayar.id)}
              <li class="riwayat-row">
                <div>
                  <p class="riwayat-nama">{bayar.namaJenis}</p>
                  <p class="muted kecil">
                    {labelPeriode(bayar.periode)} · {LABEL_METODE[bayar.metodeBayar] ?? bayar.metodeBayar} ·
                    {formatTanggal(bayar.dibayarPada)}
                  </p>
                </div>
                <span class="riwayat-nominal">{formatRupiah(bayar.jumlah)}</span>
              </li>
            {/each}
          </ul>
        </Card>
      {/if}
    </section>

    {#if data.konfirmasi.length > 0}
      <section aria-labelledby="riwayat-konfirmasi">
        <h2 id="riwayat-konfirmasi">Pengajuan konfirmasi</h2>
        <Card padded={false}>
          <ul class="riwayat-list">
            {#each data.konfirmasi as k (k.id)}
              <li class="riwayat-row">
                <div>
                  <p class="riwayat-nama">{formatRupiah(k.jumlah)} · {LABEL_METODE[k.metodeBayar] ?? k.metodeBayar}</p>
                  <p class="muted kecil">
                    Diajukan {formatTanggal(k.createdAt)}
                    {#if k.alasanTolak}· Alasan: {k.alasanTolak}{/if}
                  </p>
                </div>
                {#if k.status === 'menunggu'}
                  <Badge variant="warning">Menunggu</Badge>
                {:else if k.status === 'diterima'}
                  <Badge variant="success">Diterima</Badge>
                {:else}
                  <Badge variant="danger">Ditolak</Badge>
                {/if}
              </li>
            {/each}
          </ul>
        </Card>
      </section>
    {/if}
  {/if}
</div>

<style>
  .portal-page {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
    padding: var(--space-4) 0 var(--space-12);
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

  .banner {
    margin: 0;
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
  }

  .banner-sukses {
    background: var(--color-success-bg);
    border: 1px solid var(--color-success);
    color: var(--color-success);
  }

  .banner-error {
    background: var(--color-danger-bg);
    border: 1px solid var(--color-danger);
    color: var(--color-danger);
  }

  .total-sisa {
    margin: var(--space-1) 0 var(--space-2);
    font-size: var(--text-3xl);
    font-weight: 700;
    letter-spacing: var(--tracking-tight);
  }

  .muted {
    color: var(--color-text-muted);
    margin: 0;
  }

  .kecil {
    font-size: var(--text-xs);
  }

  p.kecil {
    margin: var(--space-1) 0 0;
    color: var(--color-text-muted);
  }

  p.kecil.lewat {
    color: var(--color-danger);
  }

  .tagihan-list,
  .riwayat-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .tagihan-item {
    padding: var(--space-4);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
  }

  .tagihan-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .tagihan-nama,
  .riwayat-nama {
    margin: 0;
    font-weight: 600;
  }

  .nominal-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-3);
    margin: var(--space-3) 0 0;
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

  .konfirmasi-menunggu {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    margin-top: var(--space-3);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    background: var(--color-warning-bg);
    color: var(--color-text);
    font-size: var(--text-sm);
  }

  .btn-link {
    padding: 0;
    border: none;
    background: none;
    color: var(--color-danger);
    font: inherit;
    font-weight: 600;
    text-decoration: underline;
    cursor: pointer;
  }

  .form-details {
    margin-top: var(--space-3);
  }

  .form-details > summary {
    list-style: none;
    cursor: pointer;
  }

  .form-details > summary::-webkit-details-marker {
    display: none;
  }

  .btn-konfirmasi {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .form-ajukan {
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
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .riwayat-list {
    gap: 0;
  }

  .riwayat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--color-border);
  }

  .riwayat-row:last-child {
    border-bottom: none;
  }

  .riwayat-nominal {
    font-weight: 600;
    white-space: nowrap;
  }

  @media (max-width: 30rem) {
    .nominal-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .riwayat-row {
      flex-wrap: wrap;
    }
  }
</style>
