<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import Card from '$lib/components/Card.svelte';
  import { formatRupiah, formatTanggal, escapeHtml, safeUrl } from '$lib/format';
  import Plus from '@lucide/svelte/icons/plus';
  import Tags from '@lucide/svelte/icons/tags';
  import Wallet from '@lucide/svelte/icons/wallet';
  import ArrowDownRight from '@lucide/svelte/icons/arrow-down-right';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import Download from '@lucide/svelte/icons/download';
  import FileSpreadsheet from '@lucide/svelte/icons/file-spreadsheet';
  import Building2 from '@lucide/svelte/icons/building-2';
  import Home from '@lucide/svelte/icons/home';
  import Receipt from '@lucide/svelte/icons/receipt';
  import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
  import Clock from '@lucide/svelte/icons/clock';
  import AlertCircle from '@lucide/svelte/icons/alert-circle';
  import HeartHandshake from '@lucide/svelte/icons/heart-handshake';
  import Filter from '@lucide/svelte/icons/filter';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  import CreditCard from '@lucide/svelte/icons/credit-card';
  import QrCode from '@lucide/svelte/icons/qr-code';
  import Loader2 from '@lucide/svelte/icons/loader-2';
  import Sparkles from '@lucide/svelte/icons/sparkles';
  import { invalidateAll } from '$app/navigation';
  import type { PageData } from './$types';

  let { data, form } = $props<{ data: PageData; form?: any }>();

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

  // ─── Modal Detail Transaksi ──────────────────────────────────────────────────
  let showModalDetail = $state(false);
  let selectedDetail = $state<any | null>(null);
  let detailType = $state<'rw' | 'rt'>('rt');

  // ─── Midtrans Gateway States ────────────────────────────────────────────────
  let metodeRt = $state<'tunai' | 'midtrans'>('midtrans');
  let midtransLoading = $state(false);
  let midtransError = $state('');
  let midtransSuccess = $state('');

  let formRtId = $state<number>(1);
  $effect(() => {
    if (data.daftarRt?.[0]?.id) {
      formRtId = data.daftarRt[0].id;
    }
  });
  let formNamaKas = $state<string>('Kas Sosial Kematian');
  let formJenis = $state<'pemasukan' | 'pengeluaran'>('pemasukan');
  let formNominal = $state<number | ''>('');
  let formKategoriId = $state<string>('');
  let formKeterangan = $state<string>('');
  let formTanggal = $state<string>(new Date().toISOString().slice(0, 10));
  let donaturNama = $state<string>('');
  let donaturEmail = $state<string>('');
  let donaturPhone = $state<string>('');

  let showModalSimulasiMidtrans = $state(false);
  let simulasiOrderId = $state('');
  let simulasiNominal = $state(0);
  let simulasiKeterangan = $state('');

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

  async function prosesBayarMidtrans() {
    if (!formRtId || !formNominal || Number(formNominal) <= 0 || !formKeterangan.trim()) {
      midtransError = 'Mohon lengkapi RT, nominal, dan keterangan transaksi.';
      return;
    }

    midtransLoading = true;
    midtransError = '';
    midtransSuccess = '';

    try {
      const res = await fetch('/api/midtrans/charge-kas-rt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rtId: formRtId,
          namaKas: formNamaKas,
          nominal: Number(formNominal),
          keterangan: formKeterangan,
          kategoriId: formKategoriId ? Number(formKategoriId) : null,
          tanggal: formTanggal,
          donaturNama: donaturNama || 'Warga RT',
          donaturEmail: donaturEmail || 'warga@rw.id',
          donaturPhone: donaturPhone || '08123456789'
        })
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Gagal memproses transaksi Midtrans');
      }

      const { snapToken, orderId, isSimulated, redirectUrl } = resData;

      if (!isSimulated) {
        // Pastikan Snap.js sudah ter-load di browser
        await loadSnapScript(data.midtransSnapUrl, data.midtransClientKey);

        if (typeof window !== 'undefined' && (window as any).snap) {
          (window as any).snap.pay(snapToken, {
            onSuccess: async (result: any) => {
              await selesaikanPembayaranMidtrans(orderId, result.payment_type || 'qris', 'settlement');
            },
            onPending: async (result: any) => {
              await selesaikanPembayaranMidtrans(orderId, result.payment_type || 'pending', 'pending');
            },
            onError: () => {
              midtransError = 'Pembayaran Midtrans gagal atau dibatalkan.';
              midtransLoading = false;
            },
            onClose: async () => {
              midtransLoading = false;
              showModalTambahRt = false;
              await invalidateAll();
              midtransSuccess = `Pembayaran ditunda (Pending). Transaksi kas RT (${orderId}) telah disimpan dan dapat dilanjutkan pembayarannya dalam waktu 24 jam via tombol "Bayar" di tabel.`;
              formNominal = '';
              formKeterangan = '';
              donaturNama = '';
              donaturEmail = '';
              donaturPhone = '';
              setTimeout(() => {
                midtransSuccess = '';
              }, 7000);
            }
          });
          return;
        } else if (redirectUrl && redirectUrl !== '#') {
          // Fallback jika browser memblokir script popup Snap: buka halaman pembayaran langsung
          window.open(redirectUrl, '_blank');
          midtransLoading = false;
          showModalTambahRt = false;
          await invalidateAll();
          return;
        }
      }

      // Mode Simulasi Sandbox jika key demo/tidak aktif
      simulasiOrderId = orderId;
      simulasiNominal = Number(formNominal);
      simulasiKeterangan = formKeterangan;
      showModalSimulasiMidtrans = true;
    } catch (err: any) {
      midtransError = err.message || 'Terjadi kesalahan saat memproses pembayaran.';
    } finally {
      midtransLoading = false;
    }
  }

  // ─── Helper: Hitung Batas Waktu 24 Jam & Status Midtrans ───────────────────
  function getStatusMidtransPending(row: any) {
    if (!row || row.metodePembayaran !== 'midtrans') return null;
    const status = (row.midtransStatus || 'pending').toLowerCase();
    const isLunas = status === 'settlement' || status === 'capture';
    if (isLunas) return { isPending: false, isExpired: false, isLunas: true, message: 'Lunas' };

    if (status === 'cancel' || status === 'expire' || status === 'deny') {
      return { isPending: false, isExpired: true, isLunas: false, message: 'Gagal / Dibatalkan' };
    }

    // Hitung batas waktu 24 jam berdasarkan waktu pembuatan (createdAt / tanggal)
    const createdTime = row.createdAt ? new Date(row.createdAt).getTime() : new Date(row.tanggal).getTime();
    const now = Date.now();
    const batasWaktu = createdTime + 24 * 60 * 60 * 1000;
    const sisaMs = batasWaktu - now;

    if (sisaMs <= 0) {
      return { isPending: false, isExpired: true, isLunas: false, sisaMs: 0, sisaWaktuStr: '0m', message: 'Kadaluarsa (>24 Jam)' };
    }

    const sisaJam = Math.floor(sisaMs / (1000 * 60 * 60));
    const sisaMenit = Math.floor((sisaMs % (1000 * 60 * 60)) / (1000 * 60));
    const sisaWaktuStr = sisaJam > 0 ? `${sisaJam}j ${sisaMenit}m` : `${sisaMenit}m`;

    return {
      isPending: true,
      isExpired: false,
      isLunas: false,
      sisaMs,
      sisaWaktuStr,
      message: `Pending (${sisaWaktuStr})`
    };
  }

  // ─── Buka Snap / Simulasi Ulang untuk Transaksi Pending ────────────────────
  async function bukaSnapUlang(transaksi: any) {
    if (!transaksi) return;

    const info = getStatusMidtransPending(transaksi);
    if (info?.isExpired) {
      midtransError = 'Waktu pembayaran transaksi ini telah melebihi batas 24 jam dan telah kadaluarsa.';
      return;
    }

    midtransLoading = true;
    midtransError = '';
    midtransSuccess = '';

    try {
      if (transaksi.snapToken && data.midtransSnapUrl && data.midtransClientKey) {
        await loadSnapScript(data.midtransSnapUrl, data.midtransClientKey);

        if (typeof window !== 'undefined' && (window as any).snap) {
          (window as any).snap.pay(transaksi.snapToken, {
            onSuccess: async (result: any) => {
              await selesaikanPembayaranMidtrans(transaksi.midtransOrderId, result.payment_type || 'qris', 'settlement');
            },
            onPending: async (result: any) => {
              await selesaikanPembayaranMidtrans(transaksi.midtransOrderId, result.payment_type || 'pending', 'pending');
            },
            onError: () => {
              midtransError = 'Pembayaran Midtrans gagal atau dibatalkan.';
              midtransLoading = false;
            },
            onClose: async () => {
              midtransLoading = false;
              await invalidateAll();
              midtransSuccess = `Pembayaran ditunda (Pending). Transaksi #${transaksi.id} masih dapat dibayar dalam batas waktu 24 jam.`;
              setTimeout(() => { midtransSuccess = ''; }, 6000);
            }
          });
          return;
        }
      }

      // Fallback Mode Simulasi Sandbox jika script Snap tidak tersedia
      simulasiOrderId = transaksi.midtransOrderId || `KAS-RT-${transaksi.id}`;
      simulasiNominal = Number(transaksi.nominal);
      simulasiKeterangan = transaksi.keterangan;
      showModalSimulasiMidtrans = true;
    } catch (err: any) {
      midtransError = err.message || 'Gagal membuka kembali pembayaran Midtrans.';
    } finally {
      midtransLoading = false;
    }
  }

  async function selesaikanPembayaranMidtrans(orderId: string, paymentType: string, transactionStatus: string) {
    midtransLoading = true;
    try {
      const res = await fetch('/api/midtrans/finish-kas-rt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paymentType,
          transactionStatus
        })
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Gagal memperbarui status pembayaran.');
      }

      await invalidateAll();
      showModalTambahRt = false;
      showModalSimulasiMidtrans = false;
      if (resData.isLunas) {
        midtransSuccess = `Pembayaran Kas RT via Midtrans (${orderId}) terverifikasi LUNAS & dicatat!`;
      } else {
        midtransSuccess = `Status transaksi Midtrans (${orderId}): ${resData.status || 'Pending'}. Menunggu pelunasan.`;
      }

      formNominal = '';
      formKeterangan = '';
      donaturNama = '';
      donaturEmail = '';
      donaturPhone = '';

      setTimeout(() => {
        midtransSuccess = '';
      }, 6000);
    } catch (err: any) {
      midtransError = err.message || 'Gagal menyelesaikan pencatatan pembayaran.';
    } finally {
      midtransLoading = false;
    }
  }

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
        let html = `<span class="${row.dibatalkan ? 'line-through text-muted' : 'font-medium'}">${escapeHtml(row.keterangan)}</span>`;
        if (row.dibatalkan) {
          html += `<br><span class="text-xs text-danger font-medium">Dibatalkan: ${escapeHtml(row.alasanBatal ?? 'Koreksi')} (${escapeHtml(row.dibatalkanOleh ?? '')})</span>`;
        }
        return html;
      }
    },
    { key: 'namaKategori', label: 'Pos Anggaran', render: (row: any) => escapeHtml(row.namaKategori ?? '—') },
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
        return `<a href="${safeUrl(row.bukti)}" target="_blank" rel="noreferrer" class="doc-link text-xs">Lihat Bukti</a>`;
      }
    },
    {
      key: 'aksi',
      label: 'Aksi',
      sortable: false,
      render: (row: any) => {
        let html = `<div style="display: inline-flex; align-items: center; gap: 6px;">`;
        html += `<button type="button" class="btn btn-sm btn-secondary text-xs" data-detail-rw="${escapeHtml(row.id)}" title="Lihat detail rincian transaksi">Detail</button>`;
        if (!row.dibatalkan) {
          html += `<button type="button" class="btn btn-sm btn-secondary text-xs" style="color: var(--color-danger); border-color: color-mix(in oklab, var(--color-danger) 40%, transparent);" data-batal-rw="${escapeHtml(row.id)}" title="Batalkan transaksi">Batal</button>`;
        }
        html += `</div>`;
        return html;
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
      render: (row: any) => `<span class="badge variant-brand font-mono font-bold">RT ${escapeHtml(String(row.nomorRt).padStart(2, '0'))}</span>`
    },
    {
      key: 'namaKas',
      label: 'Buku Kas Mandiri',
      render: (row: any) => `<span class="badge-subkas">${escapeHtml(row.namaKas || 'Kas Mandiri RT')}</span>`
    },
    {
      key: 'keterangan',
      label: 'Keterangan',
      render: (row: any) => {
        let html = `<span class="${row.dibatalkan ? 'line-through text-muted' : 'font-medium'}">${escapeHtml(row.keterangan)}</span>`;
        if (row.dibatalkan) {
          html += `<br><span class="text-xs text-danger font-medium">Dibatalkan: ${escapeHtml(row.alasanBatal ?? 'Koreksi')} (${escapeHtml(row.dibatalkanOleh ?? '')})</span>`;
        }
        return html;
      }
    },
    { key: 'namaKategori', label: 'Pos Kategori', render: (row: any) => escapeHtml(row.namaKategori ?? '—') },
    {
      key: 'metodePembayaran',
      label: 'Metode',
      render: (row: any) => {
        if (row.metodePembayaran === 'midtrans') {
          const type = escapeHtml(row.midtransPaymentType ? row.midtransPaymentType.toUpperCase() : 'SNAP');
          const info = getStatusMidtransPending(row);
          const isLunas = info?.isLunas;
          const isExpired = info?.isExpired;

          let badgeStatus = '';
          if (isLunas) {
            badgeStatus = '<span class="status-pill status-pill-success">Lunas</span>';
          } else if (isExpired) {
            badgeStatus = '<span class="status-pill status-pill-danger" title="Batas waktu 24 jam telah habis">Kadaluarsa</span>';
          } else {
            badgeStatus = `<span class="status-pill status-pill-warning" title="Batas bayar 24 jam">${escapeHtml(info?.message ?? 'Pending')}</span>`;
          }

          return `<div class="metode-col-cell">
            <span class="badge-midtrans-pill" title="Order ID: ${escapeHtml(row.midtransOrderId ?? '')}">
              <span class="midtrans-dot"></span>${type}
            </span>
            ${badgeStatus}
          </div>`;
        }
        return '<span class="badge variant-default text-xs">Tunai</span>';
      }
    },
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
        if (row.metodePembayaran === 'midtrans' && row.midtransStatus !== 'settlement' && row.midtransStatus !== 'capture') {
          const info = getStatusMidtransPending(row);
          const statusText = info?.isExpired ? 'Kadaluarsa' : 'Pending';
          return `<span class="text-muted font-medium" title="Menunggu pembayaran">${formatRupiah(row.nominal)} <span class="text-xs ${info?.isExpired ? 'text-danger' : 'text-warning'} font-semibold">(${statusText})</span></span>`;
        }
        return row.jenis === 'pemasukan'
          ? `<span style="font-weight: 600; color: var(--color-success)">+${formatRupiah(row.nominal)}</span>`
          : `<span style="font-weight: 600; color: var(--color-danger)">-${formatRupiah(row.nominal)}</span>`;
      }
    },
    {
      key: 'bukti',
      label: 'Bukti / Ref',
      render: (row: any) => {
        if (row.metodePembayaran === 'midtrans') {
          const title = escapeHtml(row.bukti || '');
          const label = escapeHtml(row.midtransOrderId ? row.midtransOrderId.slice(0, 16) + '...' : (row.bukti || 'Midtrans'));
          return `<span class="text-xs font-mono text-muted" title="${title}">${label}</span>`;
        }
        if (!row.bukti) return '<span class="text-muted text-xs">—</span>';
        return `<a href="${safeUrl(row.bukti)}" target="_blank" rel="noreferrer" class="doc-link text-xs">Lihat Bukti</a>`;
      }
    },
    {
      key: 'aksi',
      label: 'Aksi',
      sortable: false,
      render: (row: any) => {
        let html = `<div style="display: inline-flex; align-items: center; gap: 6px;">`;
        html += `<button type="button" class="btn btn-sm btn-secondary text-xs" data-detail-rt="${escapeHtml(row.id)}" title="Lihat detail rincian transaksi">Detail</button>`;

        const info = getStatusMidtransPending(row);

        // Tombol Bayar jika transaksi Midtrans pending dan belum kadaluarsa (<24 jam)
        if (row.metodePembayaran === 'midtrans' && info?.isPending && !row.dibatalkan) {
          html += `<button type="button" class="btn-pay-rt" data-pay-rt="${escapeHtml(row.id)}" title="Buka pembayaran Midtrans (Sisa: ${escapeHtml(info.sisaWaktuStr)})">Bayar</button>`;
        }

        // Kebutuhan user: jika transaksi Midtrans sudah dibayar (lunas), jangan ada tombol batal!
        const isMidtransLunas = row.metodePembayaran === 'midtrans' && (row.midtransStatus === 'settlement' || row.midtransStatus === 'capture');
        if (!row.dibatalkan && !isMidtransLunas) {
          html += `<button type="button" class="btn btn-sm btn-secondary text-xs" style="color: var(--color-danger); border-color: color-mix(in oklab, var(--color-danger) 40%, transparent);" data-batal-rt="${escapeHtml(row.id)}" title="Batalkan transaksi">Batal</button>`;
        }

        html += `</div>`;
        return html;
      }
    }
  ];

  function onTableClickRw(e: MouseEvent) {
    const targetBatal = (e.target as HTMLElement).closest('[data-batal-rw]') as HTMLElement | null;
    if (targetBatal) {
      const id = targetBatal.getAttribute('data-batal-rw');
      if (id) {
        selectedTransaksiId = Number(id);
        showModalBatalRw = true;
      }
      return;
    }

    const targetDetail = (e.target as HTMLElement).closest('[data-detail-rw]') as HTMLElement | null;
    if (targetDetail) {
      const id = targetDetail.getAttribute('data-detail-rw');
      if (id) {
        const item = data.semuaTransaksiRw.find((t: any) => t.id === Number(id));
        if (item) {
          selectedDetail = item;
          detailType = 'rw';
          showModalDetail = true;
        }
      }
      return;
    }
  }

  function onTableClickRt(e: MouseEvent) {
    const targetPay = (e.target as HTMLElement).closest('[data-pay-rt]') as HTMLElement | null;
    if (targetPay) {
      const id = targetPay.getAttribute('data-pay-rt');
      if (id) {
        const item = data.semuaTransaksiRt.find((t: any) => t.id === Number(id));
        if (item) {
          bukaSnapUlang(item);
        }
      }
      return;
    }

    const targetBatal = (e.target as HTMLElement).closest('[data-batal-rt]') as HTMLElement | null;
    if (targetBatal) {
      const id = targetBatal.getAttribute('data-batal-rt');
      if (id) {
        selectedTransaksiId = Number(id);
        showModalBatalRt = true;
      }
      return;
    }

    const targetDetail = (e.target as HTMLElement).closest('[data-detail-rt]') as HTMLElement | null;
    if (targetDetail) {
      const id = targetDetail.getAttribute('data-detail-rt');
      if (id) {
        const item = data.semuaTransaksiRt.find((t: any) => t.id === Number(id));
        if (item) {
          selectedDetail = item;
          detailType = 'rt';
          showModalDetail = true;
        }
      }
      return;
    }
  }

  // ─── Ekspor Excel & CSV Berkualitas Tinggi (KU-03) ─────────────────────────

  function unduhFileBlob(content: BlobPart, type: string, filename: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function unduhFileCsv(content: string, filename: string) {
    // UTF-8 BOM (\uFEFF) penting agar Microsoft Excel di Windows membaca teks Indonesia & simbol dengan benar
    const BOM = '\uFEFF';
    unduhFileBlob(BOM + content, 'text/csv;charset=utf-8;', filename);
  }

  function unduhFileExcel(tableHtml: string, judulLaporan: string, filename: string) {
    const template = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<!--[if gte mso 9]>
<xml>
 <x:ExcelWorkbook>
  <x:ExcelWorksheets>
   <x:ExcelWorksheet>
    <x:Name>${judulLaporan.slice(0, 31)}</x:Name>
    <x:WorksheetOptions>
      <x:DisplayGridlines/>
    </x:WorksheetOptions>
   </x:ExcelWorksheet>
  </x:ExcelWorksheets>
 </x:ExcelWorkbook>
</xml>
<![endif]-->
<style>
  body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 11pt; }
  .kop-instansi { font-size: 16pt; font-weight: bold; color: #0f172a; text-align: center; }
  .kop-sub { font-size: 10pt; color: #475569; text-align: center; }
  .kop-title { font-size: 13pt; font-weight: bold; color: #1e3a8a; text-align: center; margin-top: 6px; }
  .kop-meta { font-size: 10pt; color: #64748b; text-align: center; margin-bottom: 12px; }

  table.summary-box { border-collapse: collapse; margin-top: 10px; margin-bottom: 14px; }
  table.summary-box td { border: 1px solid #cbd5e1; padding: 5px 12px; font-size: 10pt; }
  table.summary-box .lbl { background-color: #f8fafc; font-weight: bold; color: #334155; }

  table.data-table { border-collapse: collapse; width: 100%; margin-top: 10px; }
  table.data-table th { background-color: #1e3a8a; color: #ffffff; font-weight: bold; font-size: 10pt; border: 1px solid #0f172a; padding: 8px 6px; text-align: center; vertical-align: middle; }
  table.data-table td { border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 10pt; vertical-align: middle; }

  .num-cell { mso-number-format:"\#\,\#\#0"; text-align: right; }
  .center-cell { text-align: center; }
  .text-cell { text-align: left; }

  .total-row td { background-color: #f1f5f9; font-weight: bold; border-top: 2px solid #0f172a; border-bottom: 2px solid #0f172a; font-size: 10.5pt; }
  .text-masuk { color: #15803d; font-weight: bold; }
  .text-keluar { color: #b91c1c; font-weight: bold; }
  .text-batal { color: #94a3b8; text-decoration: line-through; }

  .ttd-table { border-collapse: collapse; width: 100%; margin-top: 35px; }
  .ttd-table td { border: none; text-align: center; font-size: 10pt; padding: 4px; }
</style>
</head>
<body>
  ${tableHtml}
</body>
</html>`;

    unduhFileBlob(template, 'application/vnd.ms-excel;charset=utf-8;', filename);
  }

  // 1. Ekspor Kas RW
  function getKasRwCalculated() {
    let running = 0;
    let totalMasuk = 0;
    let totalKeluar = 0;
    const rows = filteredTransaksiRw.map((t: any, index: number) => {
      const isBatal = !!t.dibatalkan;
      const masuk = !isBatal && t.jenis === 'pemasukan' ? t.nominal : 0;
      const keluar = !isBatal && t.jenis === 'pengeluaran' ? t.nominal : 0;
      if (!isBatal) {
        running += masuk - keluar;
        totalMasuk += masuk;
        totalKeluar += keluar;
      }
      return {
        no: index + 1,
        tanggal: t.tanggal,
        keterangan: t.keterangan + (isBatal ? ` (BATAL: ${t.alasanBatal || 'Koreksi'})` : ''),
        pos: t.namaKategori || '—',
        masuk,
        keluar,
        saldo: running,
        status: isBatal ? 'Dibatalkan' : 'Aktif',
        operator: t.dicatatOleh,
        isBatal
      };
    });
    return { rows, totalMasuk, totalKeluar, saldoAkhir: running };
  }

  function eksporExcelKasRw() {
    const { rows, totalMasuk, totalKeluar, saldoAkhir } = getKasRwCalculated();
    const namaRw = data.rwData?.nama ?? 'RW 01';
    const alamatRw = `${data.rwData?.alamat ?? ''}, ${data.rwData?.kelurahan ?? ''}, ${data.rwData?.kecamatan ?? ''}, ${data.rwData?.kota ?? ''}`;
    const tglCetak = new Date().toLocaleDateString('id-ID', { dateStyle: 'long' });

    const html = `
      <div class="kop-instansi">SISTEM INFORMASI ADMINISTRASI RUKUN WARGA</div>
      <div class="kop-sub">${namaRw} — ${alamatRw}</div>
      <div class="kop-title">BUKU KAS UMUM (KAS INTERNAL TINGKAT RW)</div>
      <div class="kop-meta">Periode: ${filterPeriodeRw.toUpperCase()} | Tanggal Cetak: ${tglCetak}</div>

      <table class="summary-box">
        <tr>
          <td class="lbl">Total Penerimaan (Debit)</td>
          <td class="num-cell text-masuk">${totalMasuk}</td>
          <td class="lbl">Total Pengeluaran (Kredit)</td>
          <td class="num-cell text-keluar">${totalKeluar}</td>
          <td class="lbl">Saldo Akhir Kas RW</td>
          <td class="num-cell" style="font-weight: bold;">${saldoAkhir}</td>
        </tr>
      </table>

      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 40px;">No</th>
            <th style="width: 90px;">Tanggal</th>
            <th>Keterangan Transaksi</th>
            <th style="width: 140px;">Pos Anggaran</th>
            <th style="width: 125px;">Penerimaan (Debit) Rp</th>
            <th style="width: 125px;">Pengeluaran (Kredit) Rp</th>
            <th style="width: 130px;">Saldo Berjalan (Rp)</th>
            <th style="width: 90px;">Status</th>
            <th style="width: 110px;">Dicatat Oleh</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((r: any) => `
            <tr>
              <td class="center-cell">${r.no}</td>
              <td class="center-cell">${r.tanggal}</td>
              <td class="text-cell ${r.isBatal ? 'text-batal' : ''}">${r.keterangan}</td>
              <td class="text-cell">${r.pos}</td>
              <td class="num-cell ${r.masuk > 0 ? 'text-masuk' : ''}">${r.masuk > 0 ? r.masuk : '-'}</td>
              <td class="num-cell ${r.keluar > 0 ? 'text-keluar' : ''}">${r.keluar > 0 ? r.keluar : '-'}</td>
              <td class="num-cell" style="font-weight: bold;">${r.isBatal ? '-' : r.saldo}</td>
              <td class="center-cell">${r.status}</td>
              <td class="center-cell">${r.operator}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="4" class="text-cell font-bold">TOTAL PEMBUKUAN KAS RW</td>
            <td class="num-cell text-masuk">${totalMasuk}</td>
            <td class="num-cell text-keluar">${totalKeluar}</td>
            <td class="num-cell font-bold">${saldoAkhir}</td>
            <td colspan="2" class="center-cell">${rows.length} Transaksi</td>
          </tr>
        </tfoot>
      </table>

      <table class="ttd-table">
        <tr>
          <td style="width: 50%;">Mengetahui,<br><strong>Ketua RW</strong><br><br><br><br>( .................................................... )</td>
          <td style="width: 50%;">Disusun Oleh,<br><strong>Bendahara RW</strong><br><br><br><br>( .................................................... )</td>
        </tr>
      </table>
    `;

    unduhFileExcel(html, 'Kas_RW', `Laporan_Kas_RW_${new Date().toISOString().slice(0, 10)}.xls`);
  }

  function eksporCsvKasRw() {
    const { rows, totalMasuk, totalKeluar, saldoAkhir } = getKasRwCalculated();
    const namaRw = data.rwData?.nama ?? 'RW 01';
    let csv = `sep=,\n`;
    csv += `"LAPORAN PEMBUKUAN KAS INTERNAL RW"\n`;
    csv += `"Wilayah:","${namaRw}"\n`;
    csv += `"Periode:","${filterPeriodeRw}"\n`;
    csv += `"Tanggal Cetak:","${new Date().toLocaleString('id-ID')}"\n`;
    csv += `"Total Penerimaan (Rp)",${totalMasuk}\n`;
    csv += `"Total Pengeluaran (Rp)",${totalKeluar}\n`;
    csv += `"Saldo Akhir Kas (Rp)",${saldoAkhir}\n\n`;

    csv += `No,Tanggal,Keterangan,Pos_Anggaran,Pemasukan_Debit_Rp,Pengeluaran_Kredit_Rp,Saldo_Berjalan_Rp,Status,Dicatat_Oleh\n`;
    for (const r of rows) {
      const ket = r.keterangan.replace(/"/g, '""');
      const pos = r.pos.replace(/"/g, '""');
      csv += `${r.no},"${r.tanggal}","${ket}","${pos}",${r.masuk},${r.keluar},${r.saldo},"${r.status}","${r.operator}"\n`;
    }
    csv += `TOTAL,,,,"${totalMasuk}","${totalKeluar}","${saldoAkhir}",,\n`;

    unduhFileCsv(csv, `Laporan_Kas_RW_${new Date().toISOString().slice(0, 10)}.csv`);
  }

  // 2. Ekspor Kas RT
  function getKasRtCalculated() {
    let running = 0;
    let totalMasuk = 0;
    let totalKeluar = 0;
    const rows = filteredTransaksiRt.map((t: any, index: number) => {
      const isBatal = !!t.dibatalkan;
      const isPendingMidtrans = t.metodePembayaran === 'midtrans' && t.midtransStatus !== 'settlement' && t.midtransStatus !== 'capture';
      const masuk = !isBatal && !isPendingMidtrans && t.jenis === 'pemasukan' ? t.nominal : 0;
      const keluar = !isBatal && t.jenis === 'pengeluaran' ? t.nominal : 0;
      if (!isBatal && !isPendingMidtrans) {
        running += masuk - keluar;
        totalMasuk += masuk;
        totalKeluar += keluar;
      }
      return {
        no: index + 1,
        tanggal: t.tanggal,
        rt: `RT ${String(t.nomorRt).padStart(2, '0')}`,
        namaKas: t.namaKas || 'Kas Mandiri RT',
        keterangan: t.keterangan + (isBatal ? ` (BATAL: ${t.alasanBatal || 'Koreksi'})` : isPendingMidtrans ? ' (MENUNGGU PEMBAYARAN)' : ''),
        pos: t.namaKategori || '—',
        masuk,
        keluar,
        saldo: running,
        status: isBatal ? 'Dibatalkan' : isPendingMidtrans ? 'Pending (Belum Masuk)' : 'Aktif',
        operator: t.dicatatOleh,
        isBatal
      };
    });
    return { rows, totalMasuk, totalKeluar, saldoAkhir: running };
  }

  function eksporExcelKasRt() {
    const { rows, totalMasuk, totalKeluar, saldoAkhir } = getKasRtCalculated();
    const namaRw = data.rwData?.nama ?? 'RW 01';
    const filterRtLabel = filterRtPilihan === 'semua' ? 'Semua Wilayah RT' : 'RT ' + filterRtPilihan;
    const tglCetak = new Date().toLocaleDateString('id-ID', { dateStyle: 'long' });

    const html = `
      <div class="kop-instansi">SISTEM INFORMASI ADMINISTRASI RUKUN WARGA</div>
      <div class="kop-sub">${namaRw} — Pembukuan Kas Lingkungan Rukun Tetangga</div>
      <div class="kop-title">BUKU KAS MANDIRI PER-RT (KAS SOSIAL & OPERASIONAL)</div>
      <div class="kop-meta">Wilayah: ${filterRtLabel} | Buku Kas: ${filterNamaKas} | Tanggal: ${tglCetak}</div>

      <table class="summary-box">
        <tr>
          <td class="lbl">Total Kas Terhimpun (Debit)</td>
          <td class="num-cell text-masuk">${totalMasuk}</td>
          <td class="lbl">Total Pengeluaran / Santunan (Kredit)</td>
          <td class="num-cell text-keluar">${totalKeluar}</td>
          <td class="lbl">Saldo Kas RT</td>
          <td class="num-cell" style="font-weight: bold;">${saldoAkhir}</td>
        </tr>
      </table>

      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 40px;">No</th>
            <th style="width: 85px;">Tanggal</th>
            <th style="width: 65px;">Wilayah</th>
            <th style="width: 140px;">Buku Kas Mandiri</th>
            <th>Keterangan Transaksi</th>
            <th style="width: 130px;">Pos Kategori</th>
            <th style="width: 120px;">Penerimaan (Rp)</th>
            <th style="width: 120px;">Pengeluaran (Rp)</th>
            <th style="width: 130px;">Saldo Berjalan (Rp)</th>
            <th style="width: 85px;">Status</th>
            <th style="width: 110px;">Dicatat Oleh</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((r: any) => `
            <tr>
              <td class="center-cell">${r.no}</td>
              <td class="center-cell">${r.tanggal}</td>
              <td class="center-cell font-bold">${r.rt}</td>
              <td class="text-cell">${r.namaKas}</td>
              <td class="text-cell ${r.isBatal ? 'text-batal' : ''}">${r.keterangan}</td>
              <td class="text-cell">${r.pos}</td>
              <td class="num-cell ${r.masuk > 0 ? 'text-masuk' : ''}">${r.masuk > 0 ? r.masuk : '-'}</td>
              <td class="num-cell ${r.keluar > 0 ? 'text-keluar' : ''}">${r.keluar > 0 ? r.keluar : '-'}</td>
              <td class="num-cell" style="font-weight: bold;">${r.isBatal ? '-' : r.saldo}</td>
              <td class="center-cell">${r.status}</td>
              <td class="center-cell">${r.operator}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="6" class="text-cell font-bold">TOTAL REKAPITULASI KAS RT</td>
            <td class="num-cell text-masuk">${totalMasuk}</td>
            <td class="num-cell text-keluar">${totalKeluar}</td>
            <td class="num-cell font-bold">${saldoAkhir}</td>
            <td colspan="2" class="center-cell">${rows.length} Transaksi</td>
          </tr>
        </tfoot>
      </table>

      <table class="ttd-table">
        <tr>
          <td style="width: 50%;">Mengetahui,<br><strong>Ketua RT / RW</strong><br><br><br><br>( .................................................... )</td>
          <td style="width: 50%;">Disusun Oleh,<br><strong>Bendahara RT</strong><br><br><br><br>( .................................................... )</td>
        </tr>
      </table>
    `;

    unduhFileExcel(html, 'Kas_RT', `Laporan_Kas_RT_${new Date().toISOString().slice(0, 10)}.xls`);
  }

  function eksporCsvKasRt() {
    const { rows, totalMasuk, totalKeluar, saldoAkhir } = getKasRtCalculated();
    const namaRw = data.rwData?.nama ?? 'RW 01';
    let csv = `sep=,\n`;
    csv += `"LAPORAN PEMBUKUAN KAS MANDIRI PER-RT (KU-01)"\n`;
    csv += `"Wilayah:","${namaRw}"\n`;
    csv += `"Filter RT:","${filterRtPilihan === 'semua' ? 'Semua RT' : 'RT ' + filterRtPilihan}"\n`;
    csv += `"Buku Kas:","${filterNamaKas}"\n`;
    csv += `"Tanggal Cetak:","${new Date().toLocaleString('id-ID')}"\n`;
    csv += `"Total Penerimaan (Rp)",${totalMasuk}\n`;
    csv += `"Total Pengeluaran (Rp)",${totalKeluar}\n`;
    csv += `"Saldo Kas RT (Rp)",${saldoAkhir}\n\n`;

    csv += `No,Tanggal,Wilayah_RT,Buku_Kas_Mandiri,Pos_Kategori,Keterangan,Penerimaan_Rp,Pengeluaran_Rp,Saldo_Berjalan_Rp,Status,Dicatat_Oleh\n`;
    for (const r of rows) {
      const ket = r.keterangan.replace(/"/g, '""');
      const pos = r.pos.replace(/"/g, '""');
      const kas = r.namaKas.replace(/"/g, '""');
      csv += `${r.no},"${r.tanggal}","${r.rt}","${kas}","${pos}","${ket}",${r.masuk},${r.keluar},${r.saldo},"${r.status}","${r.operator}"\n`;
    }
    csv += `TOTAL,,,,,,${totalMasuk},${totalKeluar},${saldoAkhir},,\n`;

    unduhFileCsv(csv, `Laporan_Kas_RT_${new Date().toISOString().slice(0, 10)}.csv`);
  }

  // 3. Ekspor Rekapitulasi Iuran RT (KU-02)
  function eksporExcelRekapIuran() {
    const namaRw = data.rwData?.nama ?? 'RW 01';
    const tglCetak = new Date().toLocaleDateString('id-ID', { dateStyle: 'long' });
    const totKk = data.rekapIuranRt.reduce((s: number, r: any) => s + r.totalKk, 0);
    const totLunas = data.rekapIuranRt.reduce((s: number, r: any) => s + r.lunas, 0);
    const totBelum = data.rekapIuranRt.reduce((s: number, r: any) => s + r.belumBayar, 0);

    const html = `
      <div class="kop-instansi">SISTEM INFORMASI ADMINISTRASI RUKUN WARGA</div>
      <div class="kop-sub">${namaRw} — Pelaporan Rekapitulasi Iuran Warga Lingkungan</div>
      <div class="kop-title">REKAPITULASI PENERIMAAN IURAN WAJIB PER-RT (KU-02)</div>
      <div class="kop-meta">Periode: ${filterPeriodeIuran} | Tanggal Cetak: ${tglCetak}</div>

      <table class="summary-box">
        <tr>
          <td class="lbl">Total Realisasi Himpunan se-RW</td>
          <td class="num-cell text-masuk">${data.totalIuranTerkumpul}</td>
          <td class="lbl">Target Potensi Iuran</td>
          <td class="num-cell">${data.totalIuranTarget}</td>
          <td class="lbl">Rata-rata Kepatuhan se-RW</td>
          <td class="center-cell" style="font-weight: bold;">${data.persentaseIuranRw}%</td>
        </tr>
      </table>

      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 40px;">No</th>
            <th style="width: 80px;">Wilayah RT</th>
            <th style="width: 100px;">KK Terdaftar</th>
            <th style="width: 90px;">KK Lunas</th>
            <th style="width: 100px;">KK Belum Bayar</th>
            <th style="width: 110px;">Kepatuhan (%)</th>
            <th style="width: 140px;">Realisasi Terhimpun (Rp)</th>
            <th style="width: 140px;">Target Potensi (Rp)</th>
            <th style="width: 110px;">Status Kepatuhan</th>
          </tr>
        </thead>
        <tbody>
          ${data.rekapIuranRt.map((r: any, idx: number) => `
            <tr>
              <td class="center-cell">${idx + 1}</td>
              <td class="center-cell font-bold">RT ${String(r.nomorRt).padStart(2, '0')}</td>
              <td class="center-cell">${r.totalKk} KK</td>
              <td class="center-cell text-masuk font-bold">${r.lunas} KK</td>
              <td class="center-cell ${r.belumBayar > 0 ? 'text-keluar font-bold' : ''}">${r.belumBayar} KK</td>
              <td class="center-cell font-bold">${r.persentase}%</td>
              <td class="num-cell text-masuk">${r.nominalTerkumpul}</td>
              <td class="num-cell">${r.targetNominal}</td>
              <td class="center-cell">${r.persentase >= 80 ? 'Tinggi' : r.persentase >= 50 ? 'Sedang' : 'Kurang'}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="2" class="center-cell font-bold">TOTAL SE-RW</td>
            <td class="center-cell font-bold">${totKk} KK</td>
            <td class="center-cell text-masuk font-bold">${totLunas} KK</td>
            <td class="center-cell text-keluar font-bold">${totBelum} KK</td>
            <td class="center-cell font-bold">${data.persentaseIuranRw}%</td>
            <td class="num-cell text-masuk">${data.totalIuranTerkumpul}</td>
            <td class="num-cell font-bold">${data.totalIuranTarget}</td>
            <td class="center-cell font-bold">${data.persentaseIuranRw >= 75 ? 'Optimal' : 'Perlu Evaluasi'}</td>
          </tr>
        </tfoot>
      </table>

      <table class="ttd-table">
        <tr>
          <td style="width: 50%;">Mengetahui,<br><strong>Ketua RW</strong><br><br><br><br>( .................................................... )</td>
          <td style="width: 50%;">Disusun Oleh,<br><strong>Bendahara RW</strong><br><br><br><br>( .................................................... )</td>
        </tr>
      </table>
    `;

    unduhFileExcel(html, 'Rekap_Iuran_RT', `Rekap_Iuran_RT_${filterPeriodeIuran}_${new Date().toISOString().slice(0, 10)}.xls`);
  }

  function eksporCsvRekapIuran() {
    let csv = `sep=,\n`;
    csv += `"REKAPITULASI PENERIMAAN IURAN WAJIB RT (KU-02)"\n`;
    csv += `"Wilayah:","${data.rwData?.nama ?? 'RW 01'}"\n`;
    csv += `"Periode:","${filterPeriodeIuran}"\n`;
    csv += `"Tanggal Unduh:","${new Date().toLocaleString('id-ID')}"\n`;
    csv += `"Total Terhimpun (Rp)",${data.totalIuranTerkumpul}\n`;
    csv += `"Target Potensi (Rp)",${data.totalIuranTarget}\n`;
    csv += `"Rata-rata Kepatuhan",${data.persentaseIuranRw}%\n\n`;

    csv += `No,Wilayah_RT,Total_KK,KK_Lunas,KK_Belum_Bayar,Kepatuhan_Persen,Realisasi_Penerimaan_Rp,Target_Potensi_Rp,Status\n`;
    data.rekapIuranRt.forEach((r: any, idx: number) => {
      const status = r.persentase >= 80 ? 'Tinggi' : r.persentase >= 50 ? 'Sedang' : 'Kurang';
      csv += `${idx + 1},"RT ${String(r.nomorRt).padStart(2, '0')}",${r.totalKk},${r.lunas},${r.belumBayar},"${r.persentase}%",${r.nominalTerkumpul},${r.targetNominal},"${status}"\n`;
    });
    const totKk = data.rekapIuranRt.reduce((s: number, r: any) => s + r.totalKk, 0);
    const totLunas = data.rekapIuranRt.reduce((s: number, r: any) => s + r.lunas, 0);
    const totBelum = data.rekapIuranRt.reduce((s: number, r: any) => s + r.belumBayar, 0);
    csv += `TOTAL,,"${totKk}","${totLunas}","${totBelum}","${data.persentaseIuranRw}%",${data.totalIuranTerkumpul},${data.totalIuranTarget},\n`;

    unduhFileCsv(csv, `Rekap_Iuran_RT_${filterPeriodeIuran}_${new Date().toISOString().slice(0, 10)}.csv`);
  }
</script>

<svelte:head>
  <script src={data.midtransSnapUrl} data-client-key={data.midtransClientKey}></script>
</svelte:head>

<div class="kas-container">
  <PageHeader
    title="Modul Keuangan & Kas RT"
    subtitle="Pemisahan pembukuan kas RW dan kas per-RT berbasis rekapitulasi (Spesifik Bendahara)."
  >
    <div class="header-actions">
      <!-- Ekspor Excel & CSV Berkualitas Tinggi (KU-03) -->
      {#if activeTab === 'rw'}
        <div class="export-btn-group">
          <button type="button" class="btn btn-secondary" onclick={eksporExcelKasRw} title="Unduh format spreadsheet Microsoft Excel resmi dengan kop & border">
            <FileSpreadsheet size={16} class="text-success" />
            <span>Excel (.xls)</span>
          </button>
          <button type="button" class="btn btn-secondary" onclick={eksporCsvKasRw} title="Unduh format CSV standar UTF-8 BOM">
            <Download size={16} />
            <span>CSV</span>
          </button>
        </div>
        <button type="button" class="btn btn-action" onclick={() => (showModalTambahRw = true)}>
          <Plus size={16} />
          <span>Catat Kas RW</span>
        </button>
      {:else if activeTab === 'rt'}
        <div class="export-btn-group">
          <button type="button" class="btn btn-secondary" onclick={eksporExcelKasRt} title="Unduh format spreadsheet Microsoft Excel kas RT dengan kop & border">
            <FileSpreadsheet size={16} class="text-success" />
            <span>Excel (.xls)</span>
          </button>
          <button type="button" class="btn btn-secondary" onclick={eksporCsvKasRt} title="Unduh format CSV standar kas RT UTF-8 BOM">
            <Download size={16} />
            <span>CSV</span>
          </button>
        </div>
        <button
          type="button"
          class="btn btn-action"
          onclick={() => {
            formJenis = 'pemasukan';
            metodeRt = 'midtrans';
            showModalTambahRt = true;
          }}
        >
          <Plus size={16} />
          <span>Catat Kas RT</span>
        </button>
      {:else if activeTab === 'rekap'}
        <div class="export-btn-group">
          <button type="button" class="btn btn-secondary" onclick={eksporExcelRekapIuran} title="Unduh format spreadsheet Microsoft Excel rekap iuran RT">
            <FileSpreadsheet size={16} class="text-success" />
            <span>Excel (.xls)</span>
          </button>
          <button type="button" class="btn btn-secondary" onclick={eksporCsvRekapIuran} title="Unduh format CSV rekap iuran RT UTF-8 BOM">
            <Download size={16} />
            <span>CSV</span>
          </button>
        </div>
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

  {#if form?.errorHapusKategori}
    <div class="alert alert-danger" role="alert" style="display: flex; align-items: center; gap: 8px; margin-bottom: var(--space-4); padding: 12px 16px; background: #fee2e2; border: 1px solid #fca5a5; border-radius: 8px; color: #991b1b;">
      <AlertCircle size={18} />
      <span style="font-weight: 500; font-size: 14px;">{form.errorHapusKategori}</span>
    </div>
  {/if}
  {#if form?.errorSetoran}
    <div class="alert alert-danger" role="alert" style="display: flex; align-items: center; gap: 8px; margin-bottom: var(--space-4); padding: 12px 16px; background: #fee2e2; border: 1px solid #fca5a5; border-radius: 8px; color: #991b1b;">
      <AlertCircle size={18} />
      <span style="font-weight: 500; font-size: 14px;">{form.errorSetoran}</span>
    </div>
  {/if}
  {#if form?.successSetoran}
    <div class="alert alert-success" role="alert" style="display: flex; align-items: center; gap: 8px; margin-bottom: var(--space-4); padding: 12px 16px; background: #dcfce7; border: 1px solid #86efac; border-radius: 8px; color: #166534;">
      <CheckCircle2 size={18} />
      <span style="font-weight: 500; font-size: 14px;">Setoran kolektif iuran RT berhasil dicatat! {form.jumlahTersetor} tagihan telah dilunasi.</span>
    </div>
  {/if}
  {#if form?.successHapusKategori}
    <div class="alert alert-success" role="alert" style="display: flex; align-items: center; gap: 8px; margin-bottom: var(--space-4); padding: 12px 16px; background: #dcfce7; border: 1px solid #86efac; border-radius: 8px; color: #166534;">
      <CheckCircle2 size={18} />
      <span style="font-weight: 500; font-size: 14px;">Kategori kas berhasil dihapus.</span>
    </div>
  {/if}

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
    {#if midtransSuccess}
      <div class="alert alert-success" role="alert" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: var(--space-4); padding: 12px 16px; background: #dcfce7; border: 1px solid #86efac; border-radius: 8px; color: #166534;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <CheckCircle2 size={18} />
          <span style="font-weight: 500; font-size: 14px;">{midtransSuccess}</span>
        </div>
        <button type="button" style="border: none; background: transparent; font-size: 18px; cursor: pointer; color: #166534; font-weight: bold;" onclick={() => (midtransSuccess = '')}>×</button>
      </div>
    {/if}
    {#if midtransError}
      <div class="alert alert-danger" role="alert" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: var(--space-4); padding: 12px 16px; background: #fee2e2; border: 1px solid #fca5a5; border-radius: 8px; color: #991b1b;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <AlertCircle size={18} />
          <span style="font-weight: 500; font-size: 14px;">{midtransError}</span>
        </div>
        <button type="button" style="border: none; background: transparent; font-size: 18px; cursor: pointer; color: #991b1b; font-weight: bold;" onclick={() => (midtransError = '')}>×</button>
      </div>
    {/if}

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
  onClose={() => {
    showModalTambahRt = false;
    midtransError = '';
  }}
>
  {#if formJenis === 'pemasukan'}
    <div style="margin-bottom: var(--space-3);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span class="label-caps font-bold" style="margin: 0;">Pilih Metode Transaksi:</span>
        <span style="font-size: 11px; color: var(--color-text-muted);">Mendukung QRIS, VA Bank & Tunai</span>
      </div>
      <div class="metode-switcher">
        <button
          type="button"
          class="metode-tab-btn"
          class:active={metodeRt === 'midtrans'}
          onclick={() => (metodeRt = 'midtrans')}
        >
          <CreditCard size={16} />
          <span>Payment Gateway Midtrans</span>
          <span class="badge-mini-qris">QRIS & VA</span>
        </button>
        <button
          type="button"
          class="metode-tab-btn"
          class:active={metodeRt === 'tunai'}
          onclick={() => (metodeRt = 'tunai')}
        >
          <Wallet size={16} />
          <span>Tunai / Fisik</span>
        </button>
      </div>
    </div>
  {/if}

  {#if midtransError}
    <div class="alert alert-danger mb-4 flex items-center gap-2" role="alert" style="padding: 10px 14px; background: #fee2e2; border: 1px solid #fca5a5; border-radius: 8px; color: #b91c1c; font-size: 13px;">
      <AlertCircle size={16} />
      <span>{midtransError}</span>
    </div>
  {/if}

  {#if metodeRt === 'midtrans' && formJenis === 'pemasukan'}
    <!-- ─── FORM MIDTRANS PAYMENT GATEWAY ─── -->
    <div class="midtrans-info-box">
      <div class="flex items-center gap-2 mb-1">
        <Sparkles size={16} class="text-primary" />
        <strong class="text-xs text-primary font-bold">Midtrans Payment Gateway (Online)</strong>
      </div>
      <p class="text-xs text-muted leading-relaxed" style="margin: 4px 0 8px 0;">
        Pencatatan kas RT langsung terkoneksi ke payment gateway Midtrans. Pembayar dapat bertransaksi instan melalui QRIS (GoPay, OVO, ShopeePay, DANA), Virtual Account Bank (BCA, Mandiri, BNI, BRI), atau Kartu Kredit.
      </p>
      <div class="midtrans-badges-row">
        <span class="pill-qris">QRIS Instan</span>
        <span class="pill-va">BCA VA</span>
        <span class="pill-va">Mandiri Bill</span>
        <span class="pill-va">BNI & BRI VA</span>
        <span class="pill-cc">GoPay & e-Wallet</span>
      </div>
    </div>

    <div class="form-modal">
      <div class="form-row">
        <div class="form-group flex-1">
          <label for="rt-id-midtrans" class="label-caps">Wilayah RT</label>
          <select id="rt-id-midtrans" bind:value={formRtId} class="form-input" required>
            {#each data.daftarRt as r}
              <option value={r.id}>RT {String(r.nomor).padStart(2, '0')}</option>
            {/each}
          </select>
        </div>

        <div class="form-group flex-1">
          <label for="nama-kas-midtrans" class="label-caps">Buku Kas Mandiri</label>
          <input
            id="nama-kas-midtrans"
            bind:value={formNamaKas}
            type="text"
            list="list-buku-kas"
            required
            placeholder="Misal: Kas Sosial Kematian"
            class="form-input"
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group flex-1">
          <label for="nominal-midtrans" class="label-caps">Nominal Pembayaran (Rp)</label>
          <input
            id="nominal-midtrans"
            bind:value={formNominal}
            type="number"
            min="1000"
            step="500"
            required
            placeholder="Contoh: 150000"
            class="form-input"
          />
        </div>

        <div class="form-group flex-1">
          <label for="kategori-midtrans" class="label-caps">Pos Anggaran / Pos Sosial</label>
          <select id="kategori-midtrans" bind:value={formKategoriId} class="form-input">
            <option value="">— Tanpa Pos Kategori —</option>
            {#each data.semuaKategori.filter((k: any) => k.scope !== 'rw' && k.jenis === 'pemasukan') as kat}
              <option value={kat.id}>{kat.nama}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="ket-midtrans" class="label-caps">Keterangan / Tujuan Kas</label>
        <textarea
          id="ket-midtrans"
          bind:value={formKeterangan}
          rows="2"
          required
          placeholder="Contoh: Pembayaran kas sosial donasi kematian warga RT 01"
          class="form-input"
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group flex-1">
          <label for="donatur-nama" class="label-caps">Nama Pembayar / Warga (Opsional)</label>
          <input
            id="donatur-nama"
            bind:value={donaturNama}
            type="text"
            placeholder="Misal: Bpk. Bambang Supriyanto"
            class="form-input"
          />
        </div>

        <div class="form-group flex-1">
          <label for="donatur-kontak" class="label-caps">Email / WhatsApp (Opsional)</label>
          <input
            id="donatur-kontak"
            bind:value={donaturEmail}
            type="text"
            placeholder="Untuk bukti invoice pembayaran"
            class="form-input"
          />
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" onclick={() => (showModalTambahRt = false)}>
          Batal
        </button>
        <button
          type="button"
          class="btn btn-midtrans"
          disabled={midtransLoading}
          onclick={prosesBayarMidtrans}
        >
          {#if midtransLoading}
            <Loader2 size={16} class="animate-spin" />
            <span>Menghubungi Midtrans...</span>
          {:else}
            <CreditCard size={16} />
            <span>Bayar via Midtrans Snap</span>
          {/if}
        </button>
      </div>
    </div>
  {:else}
    <!-- ─── FORM MANUAL / FISIK ─── -->
    <form method="POST" action="?/tambahKasRt" enctype="multipart/form-data" class="form-modal">
      <input type="hidden" name="metodePembayaran" value="tunai" />
      <div class="form-row">
        <div class="form-group flex-1">
          <label for="rt-id" class="label-caps">Wilayah RT</label>
          <select id="rt-id" name="rtId" bind:value={formRtId} class="form-input" required>
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
            bind:value={formNamaKas}
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
          <select
            id="jenis-rt"
            name="jenis"
            class="form-input"
            required
            bind:value={formJenis}
            onchange={() => {
              if (formJenis === 'pengeluaran') metodeRt = 'tunai';
            }}
          >
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
            bind:value={formNominal}
            placeholder="Contoh: 150000"
            class="form-input"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="kategori-rt" class="label-caps">Pos Anggaran / Pos Sosial</label>
        <select id="kategori-rt" name="kategoriId" bind:value={formKategoriId} class="form-input">
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
          bind:value={formKeterangan}
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
            bind:value={formTanggal}
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
  {/if}
</Modal>

<!-- ═════════════════════════════════════════════════════════════════════════ -->
<!-- MODAL: SIMULASI MIDTRANS SANDBOX                                          -->
<!-- ═════════════════════════════════════════════════════════════════════════ -->
<Modal
  open={showModalSimulasiMidtrans}
  title="Midtrans Sandbox — Simulasi Pembayaran"
  onClose={async () => {
    showModalSimulasiMidtrans = false;
    showModalTambahRt = false;
    await invalidateAll();
    midtransSuccess = 'Jendela pembayaran ditutup. Transaksi kas RT tersimpan (Pending) dengan batas bayar 24 jam. Anda dapat melanjutkan pembayaran via tombol "Bayar" di tabel.';
    setTimeout(() => { midtransSuccess = ''; }, 7000);
  }}
>
  <div class="simulasi-wrapper">
    <div class="simulasi-header">
      <div class="simulasi-icon-box">
        <CreditCard size={26} />
      </div>
      <div>
        <h4 style="margin: 0; font-size: 15px; font-weight: 700;">Simulasi Pembayaran Midtrans</h4>
        <p style="margin: 2px 0 0 0; font-size: 12px; color: var(--color-text-muted);">
          Lingkungan Sandbox — Pengujian Pembayaran Kas RT Online
        </p>
      </div>
    </div>

    <div class="simulasi-details">
      <div class="detail-row">
        <span class="detail-label">Order ID:</span>
        <span class="detail-val font-mono font-semibold">{simulasiOrderId}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Buku Kas:</span>
        <span class="detail-val font-medium">{formNamaKas}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Keterangan:</span>
        <span class="detail-val">{simulasiKeterangan}</span>
      </div>
      <div class="detail-row border-t pt-2 mt-2">
        <span class="detail-label" style="font-weight: 600;">Total Bayar:</span>
        <span class="detail-val text-lg font-bold" style="color: var(--color-success, #16a34a);">
          {formatRupiah(simulasiNominal)}
        </span>
      </div>
    </div>

    <div class="simulasi-actions-list">
      <p style="font-size: 12px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 8px;">
        Pilih metode simulasi untuk menyelesaikan pembayaran:
      </p>

      <button
        type="button"
        class="simulasi-btn btn-sim-qris"
        disabled={midtransLoading}
        onclick={() => selesaikanPembayaranMidtrans(simulasiOrderId, 'qris', 'settlement')}
      >
        <div style="display: flex; align-items: center; gap: 8px;">
          <QrCode size={18} />
          <span style="font-weight: 600;">Simulasi Bayar QRIS (GoPay/ShopeePay)</span>
        </div>
        <span class="badge-sim-status">Status: Settlement (Sukses)</span>
      </button>

      <button
        type="button"
        class="simulasi-btn btn-sim-va"
        disabled={midtransLoading}
        onclick={() => selesaikanPembayaranMidtrans(simulasiOrderId, 'bank_transfer', 'settlement')}
      >
        <div style="display: flex; align-items: center; gap: 8px;">
          <CreditCard size={18} />
          <span style="font-weight: 600;">Simulasi Transfer Virtual Account Bank</span>
        </div>
        <span class="badge-sim-status">Status: Settlement (Sukses)</span>
      </button>

      <div style="display: flex; justify-content: flex-end; margin-top: 12px;">
        <button
          type="button"
          class="btn btn-secondary text-xs"
          onclick={() => (showModalSimulasiMidtrans = false)}
        >
          Tutup Simulasi
        </button>
      </div>
    </div>
  </div>
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

<!-- ═════════════════════════════════════════════════════════════════════════ -->
<!-- MODAL: DETAIL LENGKAP TRANSAKSI KAS (RT & RW)                             -->
<!-- ═════════════════════════════════════════════════════════════════════════ -->
<Modal
  open={showModalDetail}
  title={detailType === 'rt' ? 'Rincian Transaksi Kas RT' : 'Rincian Transaksi Kas RW'}
  onClose={() => { showModalDetail = false; selectedDetail = null; }}
>
  {#if selectedDetail}
    <div class="detail-transaksi-wrap">
      <!-- Status & Nominal Banner -->
      <div
        class="detail-hero"
        class:is-pemasukan={selectedDetail.jenis === 'pemasukan' && !selectedDetail.dibatalkan}
        class:is-pengeluaran={selectedDetail.jenis === 'pengeluaran' && !selectedDetail.dibatalkan}
        class:is-dibatalkan={selectedDetail.dibatalkan}
      >
        <div class="detail-hero-meta">
          <span
            class="badge"
            class:variant-success={selectedDetail.jenis === 'pemasukan' && !selectedDetail.dibatalkan}
            class:variant-danger={selectedDetail.jenis === 'pengeluaran' && !selectedDetail.dibatalkan}
            class:variant-default={selectedDetail.dibatalkan}
          >
            {selectedDetail.dibatalkan ? 'Dibatalkan' : selectedDetail.jenis === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
          </span>

          {#if selectedDetail.metodePembayaran === 'midtrans'}
            <span class="badge-midtrans-pill">
              <span class="midtrans-dot"></span>{selectedDetail.midtransPaymentType ? selectedDetail.midtransPaymentType.toUpperCase() : 'MIDTRANS'}
            </span>
          {:else}
            <span class="badge variant-default">Tunai</span>
          {/if}
        </div>

        <div class="detail-nominal">
          {selectedDetail.jenis === 'pemasukan' ? '+' : '-'}{formatRupiah(selectedDetail.nominal)}
        </div>

        <div class="detail-subtext">
          Tanggal Transaksi: <strong>{formatTanggal(selectedDetail.tanggal)}</strong>
        </div>
      </div>

      {#if selectedDetail.dibatalkan}
        <div class="detail-alert-batal">
          <AlertCircle size={18} />
          <div>
            <strong>Transaksi Dibatalkan:</strong> {selectedDetail.alasanBatal || 'Koreksi pembukuan'}
            {#if selectedDetail.dibatalkanOleh}
              <div class="text-xs" style="margin-top: 2px;">Dibatalkan oleh: {selectedDetail.dibatalkanOleh}</div>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Grid Detail Informasi -->
      <div class="detail-info-grid">
        <div class="detail-info-field">
          <span class="detail-info-label">ID Transaksi</span>
          <span class="detail-info-value font-mono font-bold">#{selectedDetail.id}</span>
        </div>

        {#if detailType === 'rt'}
          <div class="detail-info-field">
            <span class="detail-info-label">Wilayah RT</span>
            <span class="detail-info-value font-bold text-accent">RT {String(selectedDetail.nomorRt || '').padStart(2, '0')}</span>
          </div>

          <div class="detail-info-field">
            <span class="detail-info-label">Buku Kas Mandiri</span>
            <span class="detail-info-value font-medium">{selectedDetail.namaKas || 'Kas Mandiri RT'}</span>
          </div>
        {/if}

        <div class="detail-info-field">
          <span class="detail-info-label">Pos Kategori</span>
          <span class="detail-info-value">{selectedDetail.namaKategori || '— (Pos Umum)'}</span>
        </div>

        <div class="detail-info-field">
          <span class="detail-info-label">Metode Pembayaran</span>
          <span class="detail-info-value">
            {#if selectedDetail.metodePembayaran === 'midtrans'}
              Online via Midtrans ({selectedDetail.midtransPaymentType ? selectedDetail.midtransPaymentType.toUpperCase() : 'QRIS/Snap'})
            {:else}
              Tunai / Fisik
            {/if}
          </span>
        </div>

        <div class="detail-info-field">
          <span class="detail-info-label">Dicatat Oleh</span>
          <span class="detail-info-value">{selectedDetail.dicatatOleh || 'Bendahara'}</span>
        </div>

        {#if selectedDetail.createdAt}
          <div class="detail-info-field">
            <span class="detail-info-label">Waktu Pencatatan</span>
            <span class="detail-info-value font-mono text-xs">{selectedDetail.createdAt}</span>
          </div>
        {/if}

        {#if selectedDetail.metodePembayaran === 'midtrans'}
          {@const info = getStatusMidtransPending(selectedDetail)}
          <div class="detail-info-field full-width">
            <span class="detail-info-label">Midtrans Order ID</span>
            <span class="detail-info-value font-mono text-xs text-muted">{selectedDetail.midtransOrderId || '—'}</span>
          </div>
          <div class="detail-info-field">
            <span class="detail-info-label">Status Pembayaran Midtrans</span>
            <span class="detail-info-value">
              {#if selectedDetail.midtransStatus === 'settlement' || selectedDetail.midtransStatus === 'capture'}
                <span class="status-pill status-pill-success">Lunas (Settlement)</span>
              {:else if info?.isExpired}
                <span class="status-pill status-pill-danger">Kadaluarsa (>24 Jam)</span>
              {:else}
                <span class="status-pill status-pill-warning">{info?.message || selectedDetail.midtransStatus || 'Pending'}</span>
              {/if}
            </span>
          </div>
          {#if info?.isPending && !selectedDetail.dibatalkan}
            <div class="detail-info-field full-width" style="background: #fefce8; border: 1px solid #fef08a; border-radius: 6px; padding: 10px 12px;">
              <span class="detail-info-label" style="color: #854d0e;">Batas Waktu Pembayaran (24 Jam)</span>
              <span class="detail-info-value text-xs" style="color: #713f12; margin-top: 2px;">
                Transaksi ini berstatus <strong>Pending</strong>. Sisa waktu pembayaran: <strong>{info.sisaWaktuStr}</strong>. Anda dapat mengklik tombol <em>Bayar Sekarang</em> untuk menyelesaikan transaksi.
              </span>
            </div>
          {/if}
        {/if}

        <div class="detail-info-field full-width">
          <span class="detail-info-label">Deskripsi / Keterangan Transaksi</span>
          <div class="detail-desc-box">
            {selectedDetail.keterangan || 'Tidak ada keterangan tambahan.'}
          </div>
        </div>

        {#if selectedDetail.bukti}
          <div class="detail-info-field full-width">
            <span class="detail-info-label">Berkas Bukti / Kuitansi</span>
            <div class="detail-bukti-box">
              {#if selectedDetail.bukti.startsWith('/') || selectedDetail.bukti.startsWith('http')}
                <a href={safeUrl(selectedDetail.bukti)} target="_blank" rel="noreferrer" class="btn btn-sm btn-secondary" style="display: inline-flex; align-items: center; gap: 6px;">
                  <Download size={14} />
                  <span>Buka / Unduh Berkas Bukti Transaksi</span>
                </a>
              {:else}
                <span class="text-xs text-muted font-mono">{selectedDetail.bukti}</span>
              {/if}
            </div>
          </div>
        {/if}
      </div>

      <div class="modal-actions" style="margin-top: var(--space-4); display: flex; align-items: center; justify-content: flex-end; gap: var(--space-2); flex-wrap: wrap;">
        <!-- Tombol Batal: disembunyikan jika transaksi Midtrans sudah lunas -->
        {#if !selectedDetail.dibatalkan}
          {#if selectedDetail.metodePembayaran === 'midtrans' && (selectedDetail.midtransStatus === 'settlement' || selectedDetail.midtransStatus === 'capture')}
            <span class="text-xs text-muted" style="margin-right: auto; display: inline-flex; align-items: center; gap: 4px;">
              <CheckCircle2 size={14} style="color: var(--color-success);" />
              <span>Pembayaran online lunas (Dana terverifikasi Midtrans, tidak dapat dibatalkan)</span>
            </span>
          {:else}
            <button
              type="button"
              class="btn btn-secondary text-xs"
              style="color: var(--color-danger); border-color: color-mix(in oklab, var(--color-danger) 40%, transparent); margin-right: auto;"
              onclick={() => {
                const id = selectedDetail.id;
                showModalDetail = false;
                selectedTransaksiId = id;
                if (detailType === 'rt') {
                  showModalBatalRt = true;
                } else {
                  showModalBatalRw = true;
                }
              }}
            >
              Batalkan Transaksi Ini
            </button>
          {/if}
        {/if}

        <!-- Tombol Bayar Sekarang jika transaksi Midtrans masih pending -->
        {#if selectedDetail.metodePembayaran === 'midtrans' && !selectedDetail.dibatalkan}
          {@const info = getStatusMidtransPending(selectedDetail)}
          {#if info?.isPending}
            <button
              type="button"
              class="btn btn-primary"
              style="display: inline-flex; align-items: center; gap: 6px;"
              onclick={() => {
                const item = selectedDetail;
                showModalDetail = false;
                bukaSnapUlang(item);
              }}
            >
              <CreditCard size={16} />
              <span>Bayar Sekarang (Midtrans)</span>
            </button>
          {/if}
        {/if}

        <button type="button" class="btn btn-action" onclick={() => { showModalDetail = false; selectedDetail = null; }}>
          Tutup Rincian
        </button>
      </div>
    </div>
  {/if}
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

  /* ─── Midtrans Gateway & Simulation Styles ─── */
  .metode-switcher {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
    background-color: var(--color-bg-subtle, #f1f5f9);
    padding: 4px;
    border-radius: var(--radius-md, 8px);
    border: 1px solid var(--color-border);
  }

  .metode-tab-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: var(--radius-sm, 6px);
    border: none;
    background: transparent;
    font-size: 0.825rem;
    font-weight: 500;
    color: var(--color-text-muted, #64748b);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .metode-tab-btn:hover {
    color: var(--color-text, #0f172a);
  }

  .metode-tab-btn.active {
    background-color: #ffffff;
    color: #0284c7;
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }

  .badge-mini-qris {
    font-size: 9px;
    background: #0284c7;
    color: #ffffff;
    padding: 2px 6px;
    border-radius: 9999px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .midtrans-info-box {
    background: linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%);
    border: 1px solid #bae6fd;
    border-radius: var(--radius-md, 8px);
    padding: 12px 14px;
    margin-bottom: var(--space-3);
  }

  .midtrans-badges-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
  }

  .pill-qris {
    background: #047857;
    color: #ffffff;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 4px;
  }

  .pill-va {
    background: #0369a1;
    color: #ffffff;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 4px;
  }

  .pill-cc {
    background: #4338ca;
    color: #ffffff;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 4px;
  }

  .btn-midtrans {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 18px;
    background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
    color: #ffffff;
    font-weight: 600;
    font-size: 0.875rem;
    border-radius: var(--radius-md, 8px);
    border: none;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(2, 132, 199, 0.35);
    transition: all 0.15s ease;
  }

  .btn-midtrans:hover:not(:disabled) {
    background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(2, 132, 199, 0.45);
  }

  .btn-midtrans:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  :global(.metode-col-cell) {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
  }

  :global(.badge-midtrans-pill) {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #f0f9ff;
    color: #0369a1;
    border: 1px solid #bae6fd;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 9999px;
  }

  :global(.midtrans-dot) {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #0284c7;
    display: inline-block;
  }

  :global(.status-pill) {
    font-size: 10px;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 4px;
  }

  :global(.status-pill-success) {
    background-color: #dcfce7;
    color: #15803d;
  }

  :global(.status-pill-warning) {
    background-color: #fef3c7;
    color: #b45309;
  }

  :global(.status-pill-danger) {
    background-color: #fee2e2;
    color: #991b1b;
  }

  :global(.btn-pay-rt) {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #0284c7;
    color: #ffffff;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(2, 132, 199, 0.25);
    transition: background 0.15s ease, transform 0.1s ease;
  }

  :global(.btn-pay-rt:hover) {
    background: #0369a1;
  }

  /* ─── Simulation Modal Elements ─── */
  .simulasi-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .simulasi-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--color-border);
  }

  .simulasi-icon-box {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: #e0f2fe;
    color: #0284c7;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .simulasi-details {
    background: var(--color-surface, #ffffff);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
  }

  .detail-label {
    color: var(--color-text-muted);
  }

  .detail-val {
    color: var(--color-text);
  }

  .simulasi-actions-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .simulasi-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid var(--color-border);
    background: var(--color-surface, #ffffff);
    cursor: pointer;
    transition: all 0.15s ease;
    text-align: left;
  }

  .simulasi-btn:hover:not(:disabled) {
    border-color: #0284c7;
    background: #f0f9ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  .btn-sim-qris {
    border-left: 4px solid #059669;
  }

  .btn-sim-va {
    border-left: 4px solid #0284c7;
  }

  .badge-sim-status {
    font-size: 11px;
    font-weight: 600;
    color: #15803d;
    background: #dcfce7;
    padding: 2px 8px;
    border-radius: 4px;
  }

  /* ─── Detail Transaksi Modal Styles ─── */
  .detail-transaksi-wrap {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .detail-hero {
    padding: var(--space-4);
    border-radius: var(--radius-lg);
    background: var(--color-surface-muted, #f8fafc);
    border: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    text-align: center;
  }
  .detail-hero.is-pemasukan {
    background: color-mix(in oklab, var(--color-success) 8%, var(--color-surface));
    border-color: color-mix(in oklab, var(--color-success) 30%, transparent);
  }
  .detail-hero.is-pengeluaran {
    background: color-mix(in oklab, var(--color-danger) 8%, var(--color-surface));
    border-color: color-mix(in oklab, var(--color-danger) 30%, transparent);
  }
  .detail-hero.is-dibatalkan {
    background: var(--color-surface-muted, #f8fafc);
    border-color: var(--color-border);
    opacity: 0.85;
  }

  .detail-hero-meta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    margin-bottom: var(--space-1);
  }

  .detail-nominal {
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    font-family: var(--font-mono, monospace);
  }
  .is-pemasukan .detail-nominal {
    color: var(--color-success);
  }
  .is-pengeluaran .detail-nominal {
    color: var(--color-danger);
  }
  .is-dibatalkan .detail-nominal {
    text-decoration: line-through;
    color: var(--color-text-muted);
  }

  .detail-subtext {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .detail-alert-batal {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    background: color-mix(in oklab, var(--color-danger) 10%, transparent);
    border: 1px solid color-mix(in oklab, var(--color-danger) 30%, transparent);
    border-radius: var(--radius-md);
    color: var(--color-danger);
    font-size: var(--text-sm);
  }

  .detail-info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
  }

  .detail-info-field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .detail-info-field.full-width {
    grid-column: 1 / -1;
  }

  .detail-info-label {
    font-size: var(--text-xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
  }

  .detail-info-value {
    font-size: var(--text-sm);
    color: var(--color-text);
    font-weight: 500;
  }

  .detail-desc-box {
    padding: var(--space-3);
    background: var(--color-surface-muted, #f8fafc);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    color: var(--color-text);
    line-height: 1.5;
    white-space: pre-wrap;
  }

  .detail-bukti-box {
    margin-top: 0.25rem;
  }
</style>
