# Papan Kanban — Snapshot & Panduan Setup

> Kartu lengkap: `docs/kanban/backlog.md`. Aturan: `docs/kanban/workflow.md`.
> Dokumen ini menyimpan **snapshot papan**, **audit WIP**, **metrik awal**, dan **kondisi papan
> GitHub Project yang sudah terpasang** beserta **peta kartu ↔ nomor issue** (`gh` CLI belum
> terpasang, jadi papan diisi lewat GraphQL — lihat §5).

Terakhir disusun: 12 Okt 2026 · Diperbarui: 28 Okt 2026 (lihat §5.1)

---

## 1. Snapshot Papan — Kondisi As-Is per 12 Okt 2026 (baseline, sebelum rekonsiliasi)

> ⚠️ **Snapshot historis, bukan kondisi terkini.** Angka/kolom di bawah menggambarkan papan
> saat baseline 12 Okt 2026 (dipakai laporan Bab IV). Kondisi terkini ada di §5 (**distribusi
> aktual**); pergerakan kartu sejak baseline ada di §5.1.

```
┌──────────────────┬────────────────────┬────────────────────┬───────────────────────┬──────────────────────┐
│ Backlog          │ Todo / Ready       │ In Progress        │ Review / Verification │ Done                 │
├──────────────────┼────────────────────┼────────────────────┼───────────────────────┼──────────────────────┤
│ LP-01            │ (kosong)           │ FND-06 (board)     │ (kosong)              │ FND-01 FND-02        │
│ LP-02            │                    │ EV-01              │                       │ FND-03 FND-04 FND-05 │
│ EV-02            │                    │ KP-01              │                       │ EV-A                 │
│ EV-03            │                    │ KP-03              │                       │ KP-A KP-B KP-C KP-D  │
│ EV-BUG-01        │                    │ KP-04              │                       │ KP-02                │
│ KP-05            │                    │ KU-02              │                       │ KU-A KU-B KU-C KU-04 │
│ KU-01            │                    │ KU-03              │                       │ KU-D                 │
│ SR-01(→IP)       │                    │ SR-01              │                       │ SR-A SR-B SR-C       │
│ SR-03b           │                    │                    │                       │ SR-D SR-E            │
│ SR-BUG-01        │                    │                    │                       │                      │
│ W-01..W-06 (won't)│                   │                    │                       │                      │
└──────────────────┴────────────────────┴────────────────────┴───────────────────────┴──────────────────────┘
```

> Kolom `Review / Verification` **kosong** — ini temuan penting: selama ini tidak ada alur PR-review
> yang terekam, padahal `laporan.md` §2.2.3.1 mengklaim ada. Lihat §3 dan `temuan-inkonsistensi.md` (F5).

---

## 2. Rekap Status (per 12 Okt 2026)

| Kolom | Jumlah | Kartu |
|---|---|---|
| Backlog | 9 | LP-01, LP-02, EV-02, EV-03, EV-BUG-01, KP-05, KU-01, SR-03b, SR-BUG-01 |
| Todo / Ready | 0 | — |
| In Progress | 8 | FND-06, EV-01, KP-01, KP-03, KP-04, KU-02, KU-03, SR-01 |
| Review / Verification | 0 | — |
| Done | 21 | FND-01..05, EV-A, KP-A..D, KP-02, KU-A..C, KU-04, KU-D, SR-A..E |
| Won't | 6 | W-01..W-06 |

---

## 3. Audit WIP

Limit: **1–2 kartu `In Progress` per orang** · total papan **≤ 10**.

### As-is (sebelum perbaikan)

| PIC | Kartu In Progress | Jumlah | Status |
|---|---|---|---|
| Afif | FND-06 | 1 | OK |
| Alizha | EV-01 | 1 | OK |
| **Josua** | KP-01, KP-03, KP-04 | **3** | ❌ **pelanggaran WIP** |
| Safira | KU-02, KU-03 | 2 | OK (batas atas) |
| Zidan | SR-01 | 1 | OK |
| **Total** | | **8** | ≤ 10 OK |

### Rekonsiliasi (usulan, berbasis dependensi)

MP-03 dan KP-04 dianggap belum benar-benar berjalan (baru sebagian/butuh data KP-01), jadi
dikembalikan ke `Todo / Ready` agar Josua patuh WIP dan fokus menyelesaikan KP-01 dulu:

| PIC | In Progress setelah rekonsiliasi |
|---|---|
| Josua | **KP-01** (KP-03 & KP-04 → Todo/Ready) |
| Safira | KU-02, KU-03 |
| Total papan | **6** |

> Aksi ini sengaja **dicatat di laporan Bab IV §4.1** sebagai bukti bahwa Kanban benar-benar
> menjalankan fungsi *limit WIP* (bukan hanya ditempel).

---

## 4. Metrik Awal (baseline)

Untuk kebutuhan Bab IV. Isi angka setelah papan berdiri.

| Metrik | Definisi | Nilai awal |
|---|---|---|
| Throughput | Kartu masuk `Done` per minggu | *diisi setelah papan berjalan* |
| WIP | Kartu `In Progress` saat ini | 6 (setelah rekonsiliasi) |
| Cycle time | Rata-rata `Todo` → `Done` | *diisi* (back-fill: tanggal tidak tercatat) |
| Blocked | Kartu berlabel `blocked` | 0 |
| WIP violation | Kejadian melewati limit | 1 (Josua, tercatat & diperbaiki) |

**Catatan back-fill:** tanggal pengerjaan kartu `Done` tidak bisa direkonstruksi dengan jujur; yang
tersedia hanya riwayat commit. Untuk kartu back-fill, isi `cycle time` sebagai `n/a` dan jelaskan
metodenya di Bab IV.

---

## 5. Papan GitHub Project (v2) — Kondisi Terpasang

Papan **sudah dibuat dan terisi** (bukan lagi panduan manual).

| Item | Nilai |
|---|---|
| Nama project | **Capstone - Gr30** (project #2) |
| Pemilik | `miralami` + ter-link ke repo `miralami/rwdigital` |
| Project ID | `PVT_kwHOBS9-Ls4Bk7EG` |
| Field Status | `PVTSSF_lAHOBS9-Ls4Bk7EGzhjp0hg` |
| Opsi Status | `Todo`=`b3059e5f` · `In Progress`=`df686dea` · `Done`=`cd8eab33` · `Won't`=`31d91e7d` |
| Total item | **59** (6 Epic + 38 kartu + 6 grey-out + 9 kartu iterasi 2) |

Distribusi aktual: **Done 39 · In Progress 5 · Todo 9 · Won't 6** (per 28 Okt 2026).

> Verifikasi 28 Okt 2026 menemukan papan sudah bergerak sejak catatan 19 Okt: **SR-03b #48** dan
> **SR-BUG-01 #50** pindah `Todo` → `In Progress` (Track Surat). Karena itu angka awal sebelum
> penambahan iterasi 2 adalah **Done 32 · In Progress 5 · Todo 7 · Won't 6** (50 item), bukan
> 32/3/9/6 seperti tertulis sebelumnya. Selisih 9 item sesudahnya berasal dari kartu iterasi 2
> (§5.1, 28 Okt 2026).

> Snapshot 12 Okt 2026: Done 21 · In Progress 8 · Todo 15 · Won't 6. Selisih sepenuhnya berasal
> dari pergerakan kartu Track Afif (`miralami`) — LP-01, LP-02, EPIC-1 & FND-06 (lihat §5.1).

Update dilakukan lewat GraphQL (MCP GitHub belum punya tool Projects v2, `gh` belum terpasang); helper:
skill `github-projects` → `C:\Users\Sena\.agents\skills\github-projects\ghproject.ps1`.

Catatan teknis:
- `updateProjectV2Field` **meregenerasi ID semua opsi** Status → seluruh status item harus dipasang
  ulang setelah mengubah daftar opsi.
- Kartu disimpan sebagai **Issue** (bukan draft) agar bisa di-assign & dikaitkan ke PR; kartu `Done`
  (back-fill) langsung ditutup dengan catatan bukti.
- Issue *type* (Task/Bug/Feature) belum aktif; metadata `[T<n>][moscow]` ditulis di judul kartu.
- Issue duplikat `#47` (efek 502 saat pembuatan SR-D) sudah **dihapus** agar repo bersih.
- **Assignee:** seluruh kartu `Done` (as-is) = **`miralami`** (Afif, penulis kode eksisting, murni
  back-fill histori); kartu upcoming mengikuti PIC Epic → `T0`/`T1` = `miralami`, `T2` = `alizha13`,
  `T3` = `josuasahat`, `T4` = `shaffiraindanazulfa`, `T5` = `elfarizidan`; grey-out tanpa assignee.

### Peta Kartu ↔ Nomor Issue (back-fill)

| Epic | Kartu → Issue |
|---|---|
| EPIC-0 (Fondasi) | FND-01 #17 · FND-02 #16 · FND-03 #14 · FND-04 #15 · FND-05 #18 · FND-06 #21 |
| EPIC-1 (Publik) | LP-01 #20 · LP-02 #19 |
| EPIC-2 (Informasi) | EV-A #25 · EV-01 #22 · EV-02 #23 · EV-03 #24 · EV-BUG-01 #28 |
| EPIC-3 (Kependudukan) | KP-A #26 · KP-B #27 · KP-C #29 · KP-D #30 · KP-02 #31 · KP-01 #33 · KP-03 #32 · KP-04 #34 · KP-05 #35 |
| EPIC-4 (Keuangan) | KU-A #39 · KU-B #36 · KU-C #38 · KU-04 #37 · KU-D #41 · KU-02 #42 · KU-01 #43 · KU-03 #40 |
| EPIC-5 (Surat) | SR-A #46 · SR-B #44 · SR-C #45 · SR-D #52 · SR-E #51 · SR-01 #49 · SR-03b #48 · SR-BUG-01 #50 |
| Grey-out | W-01 #54 · W-02 #55 · W-03 #53 · W-04 #58 · W-05 #57 · W-06 #56 |

Epic issue: EPIC-0 **#8** · EPIC-1 **#13** · EPIC-2 **#9** · EPIC-3 **#11** · EPIC-4 **#12** · EPIC-5 **#10**

> Setelah ini status papan tinggal dijaga: setiap kartu bergerak hanya lewat PR (lihat
> `workflow.md` §3 & §8).

### 5.1 Riwayat Pergerakan Papan (mutasi nyata)

**15 Okt 2026** — menyelesaikan Track **EPIC-1** (Publik, Landing Page & Profil RW), PIC Afif
(`miralami`):

| Kartu | Issue | Dari | Ke | Bukti |
|---|---|---|---|---|
| LP-01 Landing Page Publik | #20 | Todo | **Done** (closed) | commit `1234ab0` — `src/routes/+page.svelte`, `+page.server.ts` |
| LP-02 Visualisasi Statistik Publik | #19 | Todo | **Done** (closed) | commit `1234ab0` — `src/lib/components/BarChart.svelte`, `DonutChart.svelte` |
| EPIC-1 Modul Publik, Landing Page & Profil RW | #13 | Todo | **Done** (closed) | seluruh kartu EPIC-1 selesai |

Catatan deviasi:
- LP-01 tidak lagi murni "statis": **pengumuman & agenda dibaca dari tabel `pengumuman`**
  (`ditampilkan=true`), dan angka statistik ikut dinamis. Profil/visi/misi/sejarah/SOTK/prestasi
  tetap statis (tanpa CMS baru).
- **Galeri foto belum ada** (belum ada foto asli) → area foto memakai *placeholder* jujur, siap
  ditukar saat foto tersedia.

**Sinkronisasi lain (Track Afif):** kartu **FND-06** (#21, Membangun papan Kanban) sudah berstatus
**Done** di papan — dicatat di sini agar dokumen konsisten dengan board.

Rincian bukti per kartu ada di komentar masing-masing issue (#13, #19, #20, #21).

**18 Okt 2026** — menyelesaikan Track **EPIC-3** (Kependudukan & Dashboard Internal), PIC Josua
(`josuasahat`). Kartu yang tertinggal di `In Progress`/`Todo` meski issue-nya sudah `CLOSED`
disinkronkan ke `Done`:

| Kartu | Issue | Dari | Ke | Bukti |
|---|---|---|---|---|
| KP-01 Perhitungan demografis otomatis | #33 | In Progress | **Done** (closed) | PR #61 (merge `8009f72`) — `src/lib/server/usia.ts` |
| KP-03 Dashboard pengurus internal | #32 | In Progress | **Done** (closed) | PR #61 — `src/routes/(app)/dashboard/+page.server.ts` |
| KP-04 Portal warga: data KK & anggota | #34 | In Progress | **Done** (closed) | PR #61 — `src/routes/(app)/warga/rekap/+page.server.ts` |
| KP-05 Pengajuan pembaruan data warga | #35 | Todo | **Done** (closed) | PR #61 — `src/routes/portal/perbaruan/*`, state machine + validasi Zod |
| EPIC-3 Modul Kependudukan & Dashboard Internal | #11 | Todo | **Done** (closed) | seluruh kartu EPIC-3 selesai |

Catatan deviasi / penyelarasan:
- Seluruh 9 kartu EPIC-3 (KP-A/B/C/D, KP-02/01/03/04/05) sudah `CLOSED`; status papan hanya
  tertinggal, kini diselaraskan. Epic **#11 ditutup** (mengikuti pola EPIC-1 #13).
- Migrasi EPIC-3 di-merge dengan `main` dan di-*regenerate* menjadi **`0004_free_selene.sql`**
  (index `permintaan_pembaruan_warga_id_idx` + FK `on_delete cascade`); entri `_journal.json`
  sempat tertinggal dan diperbaiki di commit `67c88ba`.
- Distribusi papan setelah sinkronisasi: **Done 31 · In Progress 3 · Todo 10 · Won't 6**
  (sisa In Progress: KU-02 #42, KU-03 #40, SR-01 #49).

**19 Okt 2026** — penutupan **EPIC-0** (Fondasi & Infrastruktur), PIC Afif (`miralami`) +
penyelarasan kartu EPIC-2 (`EV-01`):

| Kartu | Issue | Dari | Ke | Bukti |
|---|---|---|---|---|
| EPIC-0 Fondasi & Infrastruktur | #8 | Todo | **Done** (closed) | seluruh 6 kartu FND-01..06 selesai |
| EV-01 Pengumuman time-based | #22 | In Progress | **Done** (closed) | PR #60 (merge `c1487b5`) — tanggal, lokasi, status otomatis |

Catatan:
- EPIC-0 #8 ditutup mengikuti pola EPIC-1 #13 & EPIC-3 #11 (Epic ditutup bila seluruh kartunya `Done`).
- `backlog.md` disinkronkan: EPIC-2 (Done 2) & EPIC-3 (Done 9, seluruh kartu tuntas) — ringkasan
  "as-is" di §1/§2 dokumen ini tetap **historis** (baseline 12 Okt).
- Distribusi papan setelah pembaruan: **Done 32 · In Progress 3 · Todo 9 · Won't 6**
  (sisa In Progress: KU-02 #42, KU-03 #40, SR-01 #49).

**28 Okt 2026** — penambahan **9 kartu iterasi 2** (issue `iterasi-2` yang belum ada di papan).
7 kartu langsung `Done` karena issue-nya sudah tertutup `completed` dengan bukti PR, 2 kartu
`Todo` karena masih menunggu keputusan bisnis klien.

| Kartu | Issue | Status | Bukti |
|---|---|---|---|
| KU-01b Setoran RT → RW & rekonsiliasi | #65 | **Done** (closed) | PR #85 (merge `40d3f9c`) — `src/lib/server/setoran.ts`, `/iuran/setoran` |
| KU-02b Skema iuran & generate tagihan per RT | #66 | **Done** (closed) | PR #81 (merge `4ee3b69`) — `jenis_iuran` config-driven + snapshot tagihan |
| FND-07 CI + test harness (Vitest & Playwright) | #67 | **Done** (closed) | PR #74 (`27f2377`) + PR #80 (`3be1365`) — e2e lintas role |
| LP-03 Landing & galeri | #68 | **Done** (closed) | PR #77 (merge `678ccca`) — pengaturan landing & galeri dari dashboard |
| KP-06 Portal warga: rincian tagihan & pembayaran | #69 | **Done** (closed) | PR #83 (merge `6867606`) — `/portal/iuran`, `/iuran/konfirmasi` |
| SR-02b Alur surat RW (verifikasi, nomor, cetak) | #70 | **Done** (closed) | PR #79 (merge `0da0215`) — nomor unik, timeline, filter daftar |
| KP-07 Row-level scoping pengurus_rt | #73 | **Done** (closed) | PR #75 (merge `cc4cf92`) — `src/lib/server/scope.ts` |
| T0-01 Keputusan bisnis iterasi 2 (D1–D5) | #71 | Todo | menunggu jawaban mitra; implementasi sudah config-driven |
| T0-02 Import data keuangan lama | #72 | Todo | menunggu D5 (format CSV & saldo awal) |

Catatan:
- **#64 bukan issue, melainkan PR** (`6aaabcd`, RBAC per aksi + pengaturan RT/pengurus/pengguna)
  sehingga tidak pernah masuk papan sebagai kartu. Perubahan RBAC-nya tercatat sebagai bukti di #73.
- Verifikasi 28 Okt juga menemukan **SR-03b #48** dan **SR-BUG-01 #50** sudah `In Progress`
  (sebelumnya tercatat `Todo`), jadi angka awal sebelum penambahan adalah 32/5/7/6.
- Distribusi papan setelah penambahan: **Done 39 · In Progress 5 · Todo 9 · Won't 6** dengan
  **total 59 item** (50 item lama + 9 kartu iterasi 2).
- Belum diselaraskan (menunggu Track Keuangan): **EPIC-4 #12** masih `Todo` dan **KU-01 #43**,
  **KU-02 #42**, **KU-03 #40** masih `In Progress`, padahal implementasinya sudah ada di `/kas`
  (kas RT mandiri, rekap iuran, ekspor CSV/Excel). Ini dicatat sebagai temuan, bukan diubah
  sepihak karena status kartu track lain dipegang PIC-nya.

---

## 6. Referensi

- `docs/kanban/workflow.md` — aturan operasional
- `docs/kanban/backlog.md` — daftar kartu & bukti
- `docs/kanban/temuan-inkonsistensi.md` — temuan penyelarasan
- `docs/arsip/laporanRevisi.md` — sisipan untuk `laporan.md`
