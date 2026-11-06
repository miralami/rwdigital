# Pembagian Tugas — SI-RW Capstone Gr30

> **Tujuan:** menjawab "siapa mengerjakan apa". Status per **3 Nov 2026**.
> Rincian artefak Bab IV per orang ada di `bab4-proses-perancangan.md` (§4.2/§4.3) — jangan diduplikasi di sini.
> Status kartu aktual: `../kanban/backlog.md`.

---

## 0. Anggota & Peran

| Nama | NIM | GitHub | Peran | Epic |
|---|---|---|---|---|
| Afif Nur Sena | 102042300189 | `miralami` | PIC Metodologi (Kanban) · Lead Teknis · Gate PR | EPIC-0, EPIC-1 |
| Muhammad Zidan Alfarizi | 102042300196 | `elfarizidan` | PIC Narasumber + Koordinator · co-lead | EPIC-5 |
| Shaffira Indana Zulfa | 102042300049 | `shaffiraindanazulfa` | PIC Laporan · UI/UX | EPIC-4 |
| Alizha Tiara Syafahira | 102042330201 | `alizha13` | PIC Keamanan · Pengujian | EPIC-2 |
| Lintong Sahat Josua Sitohang | 102042300128 | `josuasahat` | PIC Data · Proses Bisnis | EPIC-3 |

> "Safira" = **Shaffira Indana Zulfa**.

---

## 1. Lapis 1 — Kartu Kanban

Papan per 3 Nov 2026: **Done 61 · In Progress 0 · Todo 4 · Won't 3** (68 item).

| Orang | Epic | Kartu tersisa |
|---|---|---|
| **Alizha** | EPIC-2 Informasi/Event | `EV-02` #23, `EV-03` #24, `EV-BUG-01` #28 |
| **Afif** | EPIC-0, EPIC-1 | — (tuntas) |
| **Josua** | EPIC-3 | — (tuntas) |
| **Safira** | EPIC-4 | — (tuntas) |
| **Zidan** | EPIC-5 | — (tuntas) |

> Afif & Josua tanpa kartu kode → bebannya ada di metodologi, tulisan, dan artefak laporan.

---

## 2. Lapis 2 — Sub-bab Laporan

| Sub-bab | PIC | Catatan |
|---|---|---|
| 1.1–1.3 | Afif | ✅ terisi |
| 1.4–1.5 | Zidan | ✅ terisi |
| 2.1 & 2.2 (data) | Josua | perlu tambah teori BPMN/ERD |
| 2.2 (UI/UX) | Safira | perlu tambah Interaction Design |
| 2.2 (keamanan) | Alizha | perlu tambah Black Box |
| 2.2 (software eng/arsitektur) | Zidan | perlu tambah ArchiMate |
| 3.1 Batasan Realistis | Afif + Zidan | |
| 3.2 Standar Keteknikan | Alizha | |
| 3.3 (kependudukan & keuangan) | Josua | |
| 3.3 (UI/UX & flow) | Safira | |
| 3.3 (keamanan & akses) | Alizha | |
| 3.4 Batasan Asumsi | Afif + Zidan | |
| **3.5 Mekanisme Perancangan** | **Afif** | isi di `laporan.md`; sisa: gambar flowchart |
| **4.1 Proses Perancangan** | **Afif** | rencana di `bab4-proses-perancangan.md` |
| **4.2 Hasil Rancangan** | PIC modul → dirapikan Afif | screenshot per halaman |
| **4.3 Verifikasi Hasil Rancangan** | Alizha (koordinasi) + PIC modul | tabel Black Box per modul |
| 5.1–5.3 Biaya & Kelayakan | Safira | |
| 6.1–6.2 Evaluasi & Validasi | Zidan | UAT 23–24 Nov 2026 |
| 7.1–7.2 Kesimpulan & Saran | Zidan | |

---

## 3. Lapis 3 — Artefak Bab IV

Daftar lengkap artefak → PIC (ERD, class, ArchiMate, BPMN, use case, sequence, state, UI/UX, FR/NFR,
Black Box) **ada di `bab4-proses-perancangan.md` (§4.2/§4.3)**. Jangan disalin ke sini supaya tidak ada dua versi yang
berbeda. Prompt diagram: `diagram-prompts.md`.

---

## 4. Ringkasan Beban

| Orang | Kartu kode | Tulisan/artefak |
|---|---|---|
| Afif | 0 | §3.5, §4.1, ERD, class, ArchiMate, template, gate PR, koordinasi Bab IV |
| Zidan | 0 | 1.4–1.5, 2.2 SW eng, use case, §6, §7, koordinasi mitra |
| Safira | 0 | 2.2 & 3.3 UI/UX, sequence, state, UI/UX Bab IV, Bab V |
| Alizha | 3 (EV) | 2.2 & 3.3 keamanan, 3.2, NFR, Black Box |
| Josua | 0 | 2.1, 2.2 data, BPMN, activity, 3.3 kependudukan & keuangan |
