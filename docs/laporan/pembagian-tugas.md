# Pembagian Tugas Lengkap — SI-RW Capstone Gr30

> **Tujuan:** memperjelas "siapa mengerjakan apa". Ada 3 lapis yang harus cocok:
> **(1)** kartu Kanban (kode) · **(2)** sub-bab laporan · **(3)** artefak per modul (diagram + Bab IV).
>
> Sumber: `pembagian.md`, `docs/kanban/board.md`, GitHub `miralami/rwdigital`.
> Status per 19 Okt 2026. Kolom **"Usul"** = rancangan penulis (silakan dikoreksi tim).

---

## 0. Anggota & Identitas

| Nama | NIM | GitHub | Peran khusus | Epic yang dipegang |
|---|---|---|---|---|
| Afif Nur Sena | 102042300189 | `miralami` | **PIC Metodologi (Kanban) · Lead Teknis · Gate PR** | EPIC-0, EPIC-1 |
| Muhammad Zidan Alfarizi | 102042300196 | `elfarizidan` | **PIC Narasumber + Koordinator · co-lead** | EPIC-5 |
| Shaffira Indana Zulfa | 102042300049 | `shaffiraindanazulfa` | **PIC Laporan · UI/UX** | EPIC-4 |
| Alizha Tiara Syafahira | 102042330201 | `alizha13` | **PIC Keamanan** | EPIC-2 |
| Lintong Sahat Josua Sitohang | 102042300128 | `josuasahat` | **PIC Data** | EPIC-3 |

> Catatan: "Safira" (disebut di percakapan) = **Shaffira Indana Zulfa** (username `shaffiraindanazulfa`).

---

## 1. Lapis 1 — Kartu Kanban yang Masih Terbuka (per 19 Okt 2026)

Papan: **Done 32 · In Progress 3 · Todo 9 · Won't 6**. Sisa kartu fungsional **9** (3 epic issue + 6 kartu).

| Orang | Epic | Kartu sisa | Jumlah |
|---|---|---|---|
| **Alizha** | EPIC-2 Informasi/Event | `EV-02` #23, `EV-03` #24, `EV-BUG-01` #28 | 3 |
| **Safira** | EPIC-4 Keuangan/Kas RT | `KU-01` #43, `KU-02` #42, `KU-03` #40 | 3 |
| **Zidan** | EPIC-5 Surat-Menyurat | `SR-01` #49, `SR-03b` #48, `SR-BUG-01` #50 | 3 |
| **Josua** | EPIC-3 | — (tuntas semua) | 0 |
| **Afif** | EPIC-0, EPIC-1 | — (tuntas semua) | 0 |

> **Implikasi:** Afif & Josua **tidak punya kartu kode**. Beban mereka ada di **metodologi, review, dan
> tulisan/artefak laporan** — inilah yang bikin pembagian terasa kabur kalau tidak ditulis eksplisit.

---

## 2. Lapis 2 — Sub-bab Laporan (dari `pembagian.md` + tambahan)

| Sub-bab | PIC resmi | Catatan |
|---|---|---|
| 1.1–1.3 | **Afif** | ✅ terisi |
| 1.4–1.5 | **Zidan** | ✅ terisi |
| 2.1 & 2.2 (data) | **Josua** | |
| 2.2 (UI/UX) | **Safira** | |
| 2.2 (keamanan) | **Alizha** | |
| 2.2 (software eng/arsitektur) | **Zidan** | |
| 3.1 Batasan Realistis | **Afif + Zidan** | |
| 3.2 Standar Keteknikan | **Alizha** | |
| 3.3 (kependudukan & keuangan) | **Josua** | |
| 3.3 (UI/UX & flow) | **Safira** | |
| 3.3 (keamanan & akses) | **Alizha** | |
| 3.4 Batasan Asumsi | **Afif + Zidan** | |
| **3.5 Mekanisme Perancangan** | ~~Zidan~~ → **Afif** (diambil alih 19 Okt) | isi sudah ada di `laporan.md` §3.5 |
| **4.1 Proses Perancangan** | **Afif** | usul, sesuai keputusan 19 Okt |
| **4.2 Hasil Rancangan** | **PIC modul** → dirapikan **Afif** | screenshot per halaman |
| **4.3 Verifikasi Hasil Rancangan** | **PIC modul** → dirapikan **Afif** | tabel test case per modul |
| **5.1 Biaya · 5.2 Kelayakan · 5.3 Rencana Implementasi** | **Safira** | diputuskan 19 Okt |
| **6.1 Validasi · 6.2 Evaluasi** | **Zidan** | diputuskan 19 Okt (instrumen SUS bisa dibantu Afif) |
| **7.1 Kesimpulan · 7.2 Saran** | **Zidan** | diputuskan 19 Okt |

---

## 3. Lapis 3 — Artefak per Modul (diagram + Bab IV)

Aturan (keputusan 19 Okt): **PIC modul membuat diagram & bab modulnya; Afif menyediakan template/standar,
ERD global, dan menyeragamkan.**

| Modul | PIC | Diagram yang dibuat PIC | Bab IV |
|---|---|---|---|
| Kependudukan (EPIC-3) | **Josua** | use case + activity (CRUD warga, mutasi, pengajuan perbaruan) | §4.2/§4.3 |
| Keuangan & Kas RT (EPIC-4) | **Safira** | use case + activity (kas masuk/keluar, void, rekap RT) | §4.2/§4.3 |
| Informasi & Event (EPIC-2) | **Alizha** | use case + activity (pengumuman, event, saring/cari) | §4.2/§4.3 |
| Surat-Menyurat (EPIC-5) | **Zidan** | use case + activity (pengajuan, verifikasi, TTD) | §4.2/§4.3 |
| Publik/Landing (EPIC-1) | **Afif** | use case + activity (landing, statistik publik) | §4.2/§4.3 |
| **ERD global (semua entitas)** | **Afif** | — | — |
| **Template & standar diagram** (penomoran `Gambar 3.x`, gaya) | **Afif** | — | — |

---

## 4. Yang Masih Kabur / Perlu Keputusan

1. **Safira merangkap 3 hal:** PIC Epic-4 (keuangan) + teori/spesifikasi UI/UX + **PIC laporan + Bab V**.
   Perlu dipastikan mana yang benar-benar ia pegang (bisa jadi UI/UX dialihkan).
2. **Josua & Afif tanpa kartu kode** → cocok diberi porsi tulisan/artefak lebih banyak (Bab IV diagram,
   penyelarasan). Josua bisa mulai dari diagram + Bab IV modul Kependudukan.
3. **~~Bab V, VI, VII belum ada PIC~~** → ✅ diputuskan 19 Okt: Bab V = Safira, Bab VI–VII = Zidan.
4. **§3.5 awalnya di-assign ke Zidan**, sekarang Afif — `pembagian.md` sudah diperbarui.
5. **Kolom `Review / Verification` belum pernah dipakai** (F5). Dengan keputusan "semua PR lewat Afif",
   kolom ini harus mulai diisi supaya alur Kanban konsisten.

---

## 5. Ringkasan Beban (usul penyeimbangan)

| Orang | Kartu kode | Tulisan/artefak |
|---|---|---|
| Afif | 0 | §3.5, §4.1, ERD global, template diagram, gate PR, Bab I 1.1–1.3, 3.1/3.4 |
| Zidan | 3 (SR) | 1.4–1.5, 2.2 SW eng, closing Bab I, §6.1, §7, koordinasi mitra |
| Safira | 3 (KU) | 2.2 & 3.3 UI/UX, PIC laporan, **Bab V** |
| Alizha | 3 (EV) | 2.2 & 3.3 keamanan, 3.2 standar keteknikan |
| Josua | 0 | 2.1, 2.2 data, 3.3 kependudukan & keuangan, usul diagram EPIC-3 |

> Saran: karena Josua tidak punya kartu kode, ia bisa **memutakhirkan diagram Kependudukan + Bab IV
> modulnya lebih dulu**, dan Afif fokus menutup §3.5 + Bab IV §4.1.
