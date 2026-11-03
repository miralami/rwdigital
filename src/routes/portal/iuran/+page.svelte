<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Badge from '$lib/components/Badge.svelte';
  import Card from '$lib/components/Card.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import Receipt from '@lucide/svelte/icons/receipt';
  import CreditCard from '@lucide/svelte/icons/credit-card';
  import Modal from '$lib/components/Modal.svelte';
  import { formatRupiah, formatTanggal, maskNoKk } from '$lib/format';
  import type { PageData } from './$types';

  let { data, form }: { data: PageData; form?: { sukses?: string; error?: string } } = $props();

  let midtransLoadingId = $state<number | null>(null);
  let pesanSuksesOnline = $state<string>('');
  let pesanErrorOnline = $state<string>('');

  // Simulasi Modal
  let showModalSimulasi = $state(false);
  let simulasiOrderId = $state('');
  let simulasiTagihanNama = $state('');
  let simulasiNominal = $state(0);

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

  function loadSnapScript(url: string, clientKey: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).snap) return resolve(true);

      const existing = document.getElementById('midtrans-snap-js');
      if (existing) {
        if ((window as any).snap) return resolve(true);
        existing.addEventListener('load', () => resolve(true));
        existing.addEventListener('error', () => resolve(false));
        return;
      }

      const script = document.createElement('script');
      script.id = 'midtrans-snap-js';
      script.src = url;
      script.setAttribute('data-client-key', clientKey);
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }

  $effect(() => {
    if (typeof window !== 'undefined' && data.midtransSnapUrl && data.midtransClientKey) {
      loadSnapScript(data.midtransSnapUrl, data.midtransClientKey);
    }
  });

  // Sinkronisasi status setelah redirect Midtrans via query param order_id
  let syncedOrderId = '';
  $effect(() => {
    const orderId = data.orderIdToSync;
    if (!orderId || syncedOrderId === orderId) return;
    syncedOrderId = orderId;

    void (async () => {
      try {
        const res = await fetch('/api/midtrans/finish-iuran', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId })
        });
        const result = await res.json();
        if (res.ok && result?.isLunas) {
          pesanSuksesOnline = `Pembayaran online Midtrans (${orderId}) terverifikasi LUNAS!`;
          await invalidateAll();
          setTimeout(() => { pesanSuksesOnline = ''; }, 7000);
        }
      } catch (err) {
        console.error('Gagal sync status order:', err);
      }
    })();
  });

  async function bayarOnline(tagihanItem: any) {
    pesanErrorOnline = '';
    pesanSuksesOnline = '';
    midtransLoadingId = tagihanItem.id;

    try {
      const res = await fetch('/api/midtrans/charge-iuran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagihanId: tagihanItem.id, jumlah: tagihanItem.sisa })
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Gagal memproses pembayaran online');
      }

      const { token, orderId, isSimulated, redirectUrl, snapUrl, clientKey } = resData;

      if (!isSimulated) {
        await loadSnapScript(snapUrl || data.midtransSnapUrl, clientKey || data.midtransClientKey);

        if (typeof window !== 'undefined' && (window as any).snap) {
          (window as any).snap.pay(token, {
            onSuccess: async (result: any) => {
              await fetch('/api/midtrans/finish-iuran', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId })
              });
              pesanSuksesOnline = `Pembayaran online (${orderId}) berhasil dan lunas!`;
              await invalidateAll();
              setTimeout(() => { pesanSuksesOnline = ''; }, 7000);
            },
            onPending: async () => {
              pesanSuksesOnline = `Pembayaran diproses (pending). Silakan selesaikan pembayaran sesuai instruksi.`;
              await invalidateAll();
            },
            onError: () => {
              pesanErrorOnline = 'Pembayaran dibatalkan atau terjadi kesalahan.';
            },
            onClose: async () => {
              await invalidateAll();
            }
          });
          return;
        } else if (redirectUrl && redirectUrl !== '#') {
          window.open(redirectUrl, '_blank');
          return;
        }
      }

      // Mode simulasi sandbox
      simulasiOrderId = orderId;
      simulasiNominal = tagihanItem.sisa;
      simulasiTagihanNama = `${tagihanItem.namaJenis} (${tagihanItem.periode})`;
      showModalSimulasi = true;
    } catch (err: any) {
      pesanErrorOnline = err.message || 'Terjadi kesalahan sistem pembayaran online.';
    } finally {
      midtransLoadingId = null;
    }
  }

  async function selesaikanSimulasi() {
    try {
      const res = await fetch('/api/midtrans/finish-iuran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: simulasiOrderId })
      });
      const hasil = await res.json();
      if (res.ok && hasil.success) {
        showModalSimulasi = false;
        pesanSuksesOnline = `Simulasi pembayaran (${simulasiOrderId}) berhasil dan telah tercatat lunas!`;
        await invalidateAll();
        setTimeout(() => { pesanSuksesOnline = ''; }, 7000);
      } else {
        alert(hasil.error || 'Gagal menyelesaikan simulasi.');
      }
    } catch (err: any) {
      alert(err.message || 'Gagal menyelesaikan simulasi.');
    }
  }
</script>

<div class="portal-page">
  <a href="/portal" class="back-link">
    <ArrowLeft size={16} />
    <span>Kembali ke beranda</span>
  </a>

  <h1>Tagihan &amp; pembayaran</h1>
  <p class="subtitle">
    Rincian tagihan keluarga Anda, pembayaran online (Midtrans/QRIS/VA), konfirmasi tunai/transfer, dan riwayat pembayaran.
  </p>

  {#if form?.sukses}
    <p class="banner banner-sukses" role="status">{form.sukses}</p>
  {/if}
  {#if form?.error}
    <p class="banner banner-error" role="alert">{form.error}</p>
  {/if}
  {#if pesanSuksesOnline}
    <p class="banner banner-sukses" role="status">{pesanSuksesOnline}</p>
  {/if}
  {#if pesanErrorOnline}
    <p class="banner banner-error" role="alert">{pesanErrorOnline}</p>
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
                    ] ?? t.konfirmasiMenunggu.metodeBayar}) menunggu verifikasi pengurus.
                  </span>
                  <form method="POST" action="?/batalkan">
                    <input type="hidden" name="id" value={t.konfirmasiMenunggu.id} />
                    <button type="submit" class="btn-link">Batalkan</button>
                  </form>
                </div>
              {:else if t.sisa > 0}
                <div class="opsi-bayar">
                  <button
                    type="button"
                    class="btn btn-primary btn-online"
                    disabled={midtransLoadingId === t.id}
                    onclick={() => bayarOnline(t)}
                  >
                    <CreditCard size={16} />
                    <span>{midtransLoadingId === t.id ? 'Memproses...' : 'Bayar Online (QRIS / VA)'}</span>
                  </button>

                  <details class="form-details">
                    <summary class="btn btn-secondary btn-konfirmasi">Konfirmasi Manual (Tunai/Transfer)</summary>
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
                          <option value="tunai">Tunai ke pengurus</option>
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
                      <button type="submit" class="btn btn-secondary">Kirim konfirmasi manual</button>
                    </form>
                  </details>
                </div>
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
            description="Pembayaran yang sudah diverifikasi pengurus atau lunas online akan tercatat di sini."
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
                    {labelPeriode(bayar.periode)} · {formatTanggal(bayar.dibayarPada)} ·
                    {LABEL_METODE[bayar.metodeBayar] ?? bayar.metodeBayar}
                  </p>
                  {#if bayar.catatan}
                    <p class="riwayat-catatan">{bayar.catatan}</p>
                  {/if}
                </div>
                <span class="riwayat-jumlah">{formatRupiah(bayar.jumlah)}</span>
              </li>
            {/each}
          </ul>
        </Card>
      {/if}
    </section>
  {/if}
</div>

<!-- Modal Simulasi Sandbox Midtrans -->
<Modal
  open={showModalSimulasi}
  title="Simulasi Pembayaran Midtrans (Sandbox Demo)"
  onClose={() => (showModalSimulasi = false)}
>
  <div style="padding: 10px 0;">
    <p style="font-size: 14px; margin-bottom: 12px; line-height: 1.5;">
      Sistem berjalan dalam mode Sandbox (tanpa popup Midtrans aktif). Anda dapat menyimulasikan pembayaran lunas untuk tagihan:
    </p>
    <div style="background: var(--color-surface-muted); padding: 12px; border-radius: 8px; margin-bottom: 16px;">
      <p style="font-weight: 600; margin: 0 0 4px;">{simulasiTagihanNama}</p>
      <p style="color: var(--color-text-muted); font-size: 13px; margin: 0;">Order ID: <code>{simulasiOrderId}</code></p>
      <p style="font-size: 16px; font-weight: 700; color: var(--color-accent); margin: 6px 0 0;">{formatRupiah(simulasiNominal)}</p>
    </div>
    <div style="display: flex; justify-content: flex-end; gap: 8px;">
      <button type="button" class="btn btn-secondary" onclick={() => (showModalSimulasi = false)}>
        Batal
      </button>
      <button type="button" class="btn btn-primary" onclick={selesaikanSimulasi}>
        Simulasikan Pembayaran LUNAS
      </button>
    </div>
  </div>
</Modal>

<style>
  .portal-page {
    max-width: 48rem;
    margin-inline: auto;
    padding: var(--space-4);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    text-decoration: none;
    margin-bottom: var(--space-4);
  }

  .back-link:hover {
    color: var(--color-text);
  }

  h1 {
    font-size: var(--text-2xl);
    font-weight: 700;
    margin: 0 0 var(--space-1);
  }

  .subtitle {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    margin: 0 0 var(--space-6);
  }

  h2 {
    font-size: var(--text-lg);
    font-weight: 600;
    margin: var(--space-6) 0 var(--space-3);
  }

  .banner {
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    margin-bottom: var(--space-4);
    border: 1px solid transparent;
  }

  .banner-sukses {
    background: var(--color-success-bg);
    color: var(--color-success);
    border-color: color-mix(in oklab, var(--color-success) 40%, transparent);
  }

  .banner-error {
    background: var(--color-danger-bg);
    color: var(--color-danger);
    border-color: color-mix(in oklab, var(--color-danger) 40%, transparent);
  }

  .total-sisa {
    font-size: var(--text-2xl);
    font-weight: 700;
    margin: var(--space-1) 0;
  }

  .muted {
    color: var(--color-text-muted);
  }

  .kecil {
    font-size: var(--text-xs);
  }

  .lewat {
    color: var(--color-danger);
    font-weight: 600;
  }

  .tagihan-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .tagihan-item {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .tagihan-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-2);
  }

  .tagihan-nama {
    font-weight: 600;
    font-size: var(--text-base);
    margin: 0;
  }

  .nominal-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-2);
    padding: var(--space-3);
    background: var(--color-surface-muted);
    border-radius: var(--radius-md);
    margin: 0;
  }

  .nominal-grid dt {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .nominal-grid dd {
    margin: var(--space-1) 0 0;
    font-weight: 600;
    font-size: var(--text-sm);
  }

  .nominal-grid dd.habis {
    color: var(--color-success);
  }

  .opsi-bayar {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .btn-online {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    width: 100%;
    padding: var(--space-2) var(--space-4);
    font-weight: 600;
  }

  .konfirmasi-menunggu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    background: var(--color-warning-bg);
    border: 1px solid color-mix(in oklab, var(--color-warning) 40%, transparent);
    border-radius: var(--radius-md);
    font-size: var(--text-xs);
    color: var(--color-text);
  }

  .btn-link {
    background: transparent;
    border: none;
    color: var(--color-danger);
    font-size: var(--text-xs);
    font-weight: 600;
    cursor: pointer;
    padding: 0;
  }

  .btn-link:hover {
    text-decoration: underline;
  }

  .form-details {
    margin-top: var(--space-1);
  }

  .btn-konfirmasi {
    width: 100%;
    text-align: center;
    justify-content: center;
    cursor: pointer;
    font-size: var(--text-xs);
  }

  .form-ajukan {
    margin-top: var(--space-3);
    padding: var(--space-3);
    background: var(--color-surface-muted);
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .field label {
    font-size: var(--text-xs);
    font-weight: 600;
  }

  .hint {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .riwayat-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .riwayat-row {
    padding: var(--space-3) var(--space-4);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-3);
    border-bottom: 1px solid var(--color-border);
  }

  .riwayat-row:last-child {
    border-bottom: none;
  }

  .riwayat-nama {
    font-weight: 600;
    font-size: var(--text-sm);
    margin: 0;
  }

  .riwayat-catatan {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    font-style: italic;
    margin: var(--space-1) 0 0;
  }

  .riwayat-jumlah {
    font-weight: 600;
    font-size: var(--text-sm);
    color: var(--color-success);
  }
</style>
