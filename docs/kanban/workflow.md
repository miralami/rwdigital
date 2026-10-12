# Alur Kerja Kanban — SI-RW

> **Otoritas tertinggi: `docs/laporan/laporan.md`.**
> Dokumen ini adalah *aturan operasional* penerapan Kanban yang dirujuk oleh laporan
> (Bab II §2.2.3.1, Bab III §3.5.1, §3.5.4). Kalau ada yang berbeda, `laporan.md` yang menang,
> lalu dokumentasi ini diselaraskan.

Status: **aktif (rekonstruksi as-is + back-fill)** · Terakhir diperbarui: 12 Okt 2026

---

## 1. Prinsip

1. **Visualisasi aliran kerja** — setiap pekerjaan nyata harus punya kartu. Tidak ada kerja "hantu" di luar papan.
2. **Batasi WIP** — jangan banyak kerjaan jalan bersamaan; fokus lebih cepat selesai.
3. **Aliran berkesinambungan** — bukan sprint kaku; kartu mengalir kolom demi kolom setelah lulus kriteria.
4. **Jujur pada data** — kartu yang sudah selesai *di-back-fill* ke `Done`; yang belum benar-benar jadi tidak boleh diklaim `Done`.
5. **Grey-out tidak dihapus** — fitur yang dikecualikan tetap terlihat sebagai kartu `Won't` supaya scope di laporan dan papan sinkron.

---

## 2. Struktur Kerja: Epic vs Kartu

| Tingkat | Perwujudan | Contoh |
|---|---|---|
| **Epic** | 1 Track kerja = 1 Epic (GitHub Milestone/parent issue) | `Track 1 — Modul Publik & Landing Page` |
| **Kartu** | 1 item kerja konkret = 1 GitHub Issue | `[1][LP-01] Landing Page Publik (Statis)` |

**Penting:** *WIP limit dihitung per kartu, bukan per Epic.* Kalau Track dianggap satu kartu, 5 orang
langsung melanggar WIP limit 1–2 yang tertulis di `laporan.md` §2.2.3.1. Dengan Track sebagai Epic,
satu orang boleh memegang 1 Epic sambil hanya membuka 1–2 kartu sekaligus.

### Peta Epic ↔ PIC

| Epic | Nama Track | PIC | Akun GitHub |
|---|---|---|---|
| `EPIC-0` | Fondasi & Infrastruktur | Afif (lead) | `miralami` |
| `EPIC-1` | Modul Publik, Landing Page & Profil RW | Afif | `miralami` |
| `EPIC-2` | Modul Informasi, Event & Humas | Alizha | `alizha13` |
| `EPIC-3` | Modul Kependudukan & Dashboard Internal | Josua | `josuasahat` |
| `EPIC-4` | Modul Keuangan & Kas RT | Safira | `shaffiraindanazulfa` |
| `EPIC-5` | Modul Surat-Menyurat | Zidan | `elfarizidan` |

---

## 3. Kolom Papan & Kriteria Transisi

Kolom mengikuti `laporan.md` §2.2.3.1.

| Kolom | Arti | **Entry criteria** (syarat masuk) | **Exit criteria** (boleh keluar) |
|---|---|---|---|
| `Backlog` | Seluruh kebutuhan yang teridentifikasi | Sudah terdaftar sebagai Issue + punya label `moscow:*` | Lulus **DoR**, punya acceptance criteria |
| `Todo / Ready` | Siap dikerjakan, belum mulai | Lulus DoR, ada PIC, dependensi beres, muat WIP | PIC mulai kerja & bikin branch |
| `In Progress` | Sedang dikerjakan | Branch feature dibuat; WIP orang tersebut < limit | Kode selesai **dan** self-test lulus |
| `Review / Verification` | Menunggu tinjauan kode & uji | Pull Request dibuka, link PR ada di kartu | Code review disetujui + pengujian fungsional lulus |
| `Done` | Selesai & tergabung | PR merged ke `main` **dan** DoD terpenuhi | — (kartu ditutup) |

Kolom tambahan (bukan bagian 5 kolom laporan, dipakai sebagai penanda, bukan status):

- **`Won't (grey-out)`** — fitur yang secara sadar dikecualikan; tetap di `Backlog` tapi dilabeli
  `moscow:won't` supaya tidak dihitung sebagai pekerjaan aktif.
- **`Blocked`** — dipakai lewat label `blocked`, bukan kolom terpisah, agar aliran tetap 5 kolom.

---

## 4. WIP Limit

- Batas **1–2 kartu `In Progress` per orang** (sesuai `laporan.md` §2.2.3.1).
- Batas total papan: **10 kartu** `In Progress` (5 orang × 2).
- Satu kartu `Review / Verification` **tidak** dihitung sebagai WIP penulis kode, tetapi dihitung
  sebagai antrean peninjau → peninjau harus dipacu agar `Review` tidak menumpuk.
- Kalau seseorang sudah menyentuh batas, ia **wajib** menyelesaikan/menutup kartu dulu, atau
  memindahkan kartu berikutnya ke `Todo / Ready`.

> **Temuan as-is:** kondisi awal papan menunjukkan pelanggaran WIP (Josua memegang 3 kartu
> `In Progress`). Rekonsiliasi ada di `board.md`.

---

## 5. Prioritisasi MoSCoW

Sesuai `laporan.md` §2.2.3.2.

| Label | Arti | Aturan kerja |
|---|---|---|
| `moscow:must` | Wajib untuk MVP | Prioritas pertama; wajib selesai sebelum UAT |
| `moscow:should` | Penting, tidak kritis | Dikerjakan setelah seluruh `must` tuntas |
| `moscow:could` | Nilai tambah | Hanya jika `must` + `should` selesai dan waktu tersisa |
| `moscow:won't` | Dikecualikan | Tidak dikerjakan; tetap terlihat sebagai penanda scope |

Setiap kartu **wajib** punya tepat satu label `moscow:*`.

---

## 6. Definition of Ready (DoR)

Kartu boleh masuk `Todo / Ready` hanya jika:

- [ ] Ada **judul deskriptif** + kode kartu (mis. `KP-02`).
- [ ] Punya **Epic** dan **label `moscow:*`**.
- [ ] Ada **acceptance criteria** yang bisa diuji (bukan "selesai" tanpa ukuran).
- [ ] Ada **PIC** (assignee).
- [ ] **Dependensi** teridentifikasi (atau dinyatakan tidak ada).
- [ ] Kalau punya padanan di laporan: mencantumkan **kode SF** (`SF-XX-YY`).

---

## 7. Definition of Done (DoD)

Kartu hanya boleh masuk `Done` jika seluruhnya benar:

- [ ] Acceptance criteria terpenuhi.
- [ ] **Pengujian fungsional** (happy path + edge case) lulus — sesuai `laporan.md` §3.5.3.1.
- [ ] **Validasi masukan** (termasuk pesan galat Bahasa Indonesia) sesuai §3.5.3.1.
- [ ] **Kontrol akses** diuji sesuai matriks RBAC (§3.5.3.1).
- [ ] Kode di-**merge ke `main`** lewat Pull Request yang ditinjau minimal 1 anggota lain.
- [ ] Kartu menautkan **Issue ↔ PR** dan bukti (file/route/screenshot).
- [ ] Dokumentasi terkait diperbarui bila menyentuh scope/aturan.

> Kartu `Won't` **tidak** pernah masuk `Done`; ia ditutup sebagai *won't do* dengan alasan.

---

## 8. Konvensi Penamaan & Integrasi Git

| Artefak | Format | Contoh |
|---|---|---|
| Kartu (Issue) | `[<epic>][<kode>] <judul>` | `[3][KP-02] Impor Massal Data Warga (CSV)` |
| Branch | `feat/<kode>-<slug>` | `feat/kp-02-impor-csv` |
| Commit | Conventional Commits + kode kartu | `feat(kp-02): parser CSV + pelaporan error` |
| Pull Request | Judul memuat kode kartu; deskripsi `Closes #<issue>` | `feat(kp-02): impor CSV (Closes #12)` |

Otomasi GitHub Projects (sesuai klaim `laporan.md` §2.2.3.1):

- PR dibuka → kartu otomatis pindah ke `Review / Verification`.
- PR di-merge → kartu otomatis pindah ke `Done` dan Issue tertutup.

Aturan branch: `main` **protected**; tidak ada push langsung. Semua lewat PR (atau minimal 1 peninjau).

---

## 9. Aturan Grey-out (`Won't`)

Fitur yang dikecualikan **wajib tetap terdaftar** sebagai kartu `moscow:won't` dengan alasan, agar
Bab III (scope) dan papan tidak saling bertentangan. Daftar saat ini:

| Kode | Fitur dikecualikan | Alasan |
|---|---|---|
| `W-01` | Absensi / check-in event warga | Belum ada urgensi; dinonaktifkan (grey out) |
| `W-02` | CMS dinamis landing page | Konten cukup statis |
| `W-03` | Payment Gateway / QRIS live production | Masih konsep/mock (menunggu konfirmasi mitra & biaya) |
| `W-04` | Modul CCTV / keamanan lingkungan | Bukan tupoksi inti RW |
| `W-05` | Inventaris fisik barang | Bukan fungsi inti |
| `W-06` | Manajemen pengurus kompleks | Cukup RBAC 4 peran |

Mengaktifkan kembali salah satu fitur ini = keputusan eksplisit tim, lalu label diubah ke `moscow:could`.

---

## 10. Prosedur "As-Is Reconstruction" (back-fill)

Karena papan baru dibangun setelah sebagian pekerjaan berjalan, riwayat direkonstruksi secara
**transparan** (bukan diklaim dikerjakan lewat papan sejak awal):

1. Tentukan bukti tiap kandidat kartu: **ada route? ada tabel skema? ada commit/PR?** (lihat `backlog.md`).
2. Klasifikasi: `Done` (kode ada & jalan), `In Progress` (sebagian), `Backlog` (belum ada).
3. Kartu yang sudah `Done` **dibuat lalu langsung ditutup**, dengan catatan
   `ditutup sebagai back-fill rekonstruksi (bukti: <path/commit>)`.
4. Kartu yang `In Progress` **dibuat + ditandai**, dan statusnya jadi baseline WIP.
5. Cantumkan catatan rekonstruksi ini di `laporan.md` Bab IV §4.1 agar tidak menyesatkan pembaca.

**Batas kejujuran:** jangan mengarang tanggal pengerjaan. Tulis rentang nyata (lihat riwayat commit)
atau tandai "tanggal tidak tercatat".

---

## 11. Irama Kerja (Cadence)

| Ritme | Apa yang dilakukan | Keluaran |
|---|---|---|
| Harian/asinkron | Tiap orang menyentuh papan: pindahkan kartu sesuai kenyataan | Papan akurat |
| Mingguan | Review aliran: kartu menumpuk di mana? ada WIP violation? | Aksi perbaikan |
| Per milestone | Rekap progres per Epic + update Bab IV | Bukti progres untuk laporan |

---

## 12. Metrik Aliran (untuk Bab IV)

- **Throughput** — jumlah kartu masuk `Done` per minggu.
- **WIP** — jumlah kartu `In Progress` (dibanding limit 10).
- **Cycle time** — waktu dari `Todo` → `Done` per kartu.
- **Blocked count** — jumlah kartu berlabel `blocked`.

Snapshot metrik awal ada di `board.md`.

---

## 13. Referensi

- `docs/laporan/laporan.md` — §2.2.3.1, §2.2.3.2, §3.5.1, §3.5.4 (otoritas)
- `docs/kanban/backlog.md` — daftar kartu lengkap
- `docs/kanban/board.md` — snapshot papan as-is + panduan setup GitHub Project
- `docs/kanban/temuan-inkonsistensi.md` — temuan & keputusan penyelarasan
