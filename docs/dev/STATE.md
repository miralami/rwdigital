# Dev State — mini Kanban untuk sesi AI

> Dibaca di awal setiap sesi/chat. Sebelum commit, perbarui `ON PROGRESS`, `TODO`, `BLOCKED`,
> `ACTIVE FILES`. Blok `AUTO` diisi `npm run state`. Aturan: maks 3 on-progress, maks 7 todo,
> satu baris per item. Riwayat detail = `git log`.

<!-- auto:start -->
**updated** 2026-11-06 15:57 · **branch** `docs/metodologi-rw-digital` · **device** `DESKTOP-D0MPL84`

### DONE (5 commit sebelum commit ini)
- `3116d5d` docs(laporan): kerangka bersama Bab IV di bab4-plan §7.1 + K-14 aktor
- `4a177e8` docs(laporan): PIC Bab IV per artefak tanpa blocker, hapus state machine
- `14f8673` docs(laporan): rework Bab I–III sesuai Panduan Rev 1.3, desain pindah ke Bab IV
- `a28be94` fix(laporan): usulan buang "*" tanpa spasi saat membandingkan dengan cermin
- `fdc7ef6` docs(laporan): usulan.md jadi Markdown supaya bold/italic ikut tersalin
<!-- auto:end -->

## ON PROGRESS

- Dev-state aktif: `STATE.md` + `npm run state` dipakai mulai sesi berikutnya
- Metodologi kembali ke Kanban (K-03/K-04, 6 Nov); Gambar 3.1 `gambar/351-kanban-sistematika.png` siap
- `laporan.md` = cermin Capstone.docx (`npm run laporan:pull`); draf repo yang belum di Word → `keputusan.md` sisa tindakan #5 — branch `docs/metodologi-rw-digital`

## TODO

- [ ] P0 Word ← `laporan.md` judul, §2.2.1, §2.2.3, §3.5 (Gambar 3.1 Kanban `351-kanban-sistematika.png`), rujukan FR, nomor tabel/gambar — Afif, 6–7 Nov
- [ ] Teori Bab II: BPMN, ArchiMate, Interaction Design, UML/ERD, Black Box (Kanban + MoSCoW sudah di §2.2.4) — Afif + Alizha, 6–8 Nov
- [ ] Screenshot GitHub Projects G1–G9 (`bab4-plan.md` §4 3a) → `gambar/413-gh-*.png`, `415-gh-*.png` — Afif, 6–8 Nov
- [ ] BPMN as-is/to-be — Josua, 7–10 Nov
- [ ] FR + NFR + MoSCoW — Zidan + Alizha, 7–11 Nov
- [ ] Screenshot 4.2 + tabel Black Box 4.3 — PIC modul, 16–22 Nov
- [ ] UAT pengurus RW 06 — Zidan + Afif, 23–24 Nov
- [ ] Batas akhir Bab IV — 26 Nov

## BLOCKED

- Judul baru menunggu persetujuan pembimbing (fallback: judul proposal "... Menggunakan Metodologi Kanban") — tim

## ACTIVE FILES

- `docs/dev/STATE.md`
- `docs/keputusan.md`
- `docs/laporan/laporan.md`
- `docs/laporan/bab4-plan.md`
- `PROJECT.md`
- `scripts/laporan-pull.ps1`
