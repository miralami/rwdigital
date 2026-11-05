# Dev State — mini Kanban untuk sesi AI

> Dibaca di awal setiap sesi/chat. Sebelum commit, perbarui `ON PROGRESS`, `TODO`, `BLOCKED`,
> `ACTIVE FILES`. Blok `AUTO` diisi `npm run state`. Aturan: maks 3 on-progress, maks 7 todo,
> satu baris per item. Riwayat detail = `git log`.

<!-- auto:start -->
**updated** 2026-11-05 21:23 · **branch** `docs/metodologi-rw-digital` · **device** `DESKTOP-D0MPL84`

### DONE (5 commit sebelum commit ini)
- `b55328e` docs: dev-state lintas sesi + rapikan .md (5 working docs, sisanya reference/legacy)
- `6bb2a49` docs(laporan): rencana Bab IV v3, strategi dokumentasi, dan handover kit
- `c3fb151` feat: add electronic signature functionality and related database changes
- `0f39446` feat(dashboard-docs): consolidate dashboard KPIs and sync capstone specifications in laporan.md, PROJECT.md, and plan.md
- `d5731c8` feat(notif-auth): notification models & drawer, periodic announcements with gallery, and email password reset & warga claim
<!-- auto:end -->

## ON PROGRESS

- Dev-state aktif: `STATE.md` + `npm run state` dipakai mulai sesi berikutnya
- Bab IV: mulai P0 (sinkron Word ← `laporan.md`)
- Reframing metodologi I&I + Kanban & judul "Rancang Bangun RW Digital" di `laporan.md`/`bab4-plan.md`/`PROJECT.md`

## TODO

- [ ] P0 Word ← `laporan.md` judul, §2.2.1, §2.2.3, §3.5 (flowchart + panah loop iterasi), rujukan FR, nomor tabel/gambar — Afif, 6–7 Nov
- [ ] Teori Bab II: BPMN, ArchiMate, Interaction Design, UML/ERD, Black Box (I&I + Kanban sudah di §2.2.3) — Afif + Alizha, 6–8 Nov
- [ ] BPMN as-is/to-be — Josua, 7–10 Nov
- [ ] FR + NFR + MoSCoW — Zidan + Alizha, 7–11 Nov
- [ ] Screenshot 4.2 + tabel Black Box 4.3 — PIC modul, 16–22 Nov
- [ ] UAT pengurus RW 06 — Zidan + Afif, 23–24 Nov
- [ ] Batas akhir Bab IV — 26 Nov

## BLOCKED

- Judul baru menunggu persetujuan pembimbing (fallback: judul lama + klausa I&I di abstrak) — tim

## ACTIVE FILES

- `docs/dev/STATE.md`
- `docs/laporan/laporan.md`
- `docs/laporan/bab4-plan.md`
- `PROJECT.md`
