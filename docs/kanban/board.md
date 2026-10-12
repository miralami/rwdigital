# Papan Kanban — Snapshot & Panduan Setup

> Kartu lengkap: `docs/kanban/backlog.md`. Aturan: `docs/kanban/workflow.md`.
> Dokumen ini menyimpan **snapshot papan**, **audit WIP**, **metrik awal**, dan **kondisi papan
> GitHub Project yang sudah terpasang** beserta **peta kartu ↔ nomor issue** (`gh` CLI belum
> terpasang, jadi papan diisi lewat GraphQL — lihat §5).

Terakhir disusun: 12 Okt 2026

---

## 1. Snapshot Papan — Kondisi As-Is (apa adanya, sebelum rekonsiliasi)

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

## 2. Rekap Status

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
| Total item | **50** (6 Epic + 38 kartu + 6 grey-out) |

Distribusi aktual: **Done 21 · In Progress 8 · Todo 15 · Won't 6**.

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

---

## 6. Referensi

- `docs/kanban/workflow.md` — aturan operasional
- `docs/kanban/backlog.md` — daftar kartu & bukti
- `docs/kanban/temuan-inkonsistensi.md` — temuan penyelarasan
- `docs/laporan/laporanRevisi.md` — sisipan untuk `laporan.md`
