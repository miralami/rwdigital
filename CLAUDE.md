# CLAUDE.md

Panduan kerja untuk AI assistant di repo ini. Baca `PROJECT.md` dulu untuk konteks produk, lalu `docs/README.md` untuk peta dokumen.

## Ringkasan Proyek

Sistem Informasi RW — aplikasi capstone (kelompok 30, 5 orang) untuk digitalisasi administrasi tingkat RW (kependudukan, surat, keuangan, iuran, informasi), dikembangkan bersama mitra RW nyata. Aplikasi sudah berjalan (bukan lagi tahap requirements); status fitur aktual ada di `docs/kanban/backlog.md`.

## Sumber Kebenaran (jangan campur)

| Pertanyaan | Buka |
|---|---|
| Isi laporan akademik | `docs/laporan/laporan.md` (otoritas) |
| Status fitur aktual | `docs/kanban/backlog.md` |
| Scope & prioritas MVP | `PROJECT.md` |
| Siapa mengerjakan apa | `docs/tim/pembagian-tugas.md` |
| Peta semua dokumen | `docs/README.md` |
| Cara jalankan app, role, rute | `README.md` |
| Akun demo | `credentials.md` |

Abaikan `docs/arsip/` (usang, termasuk `plan.md`). `laporan.md` (~92 KB) dan `docs/laporan/referensi/contohlaporan.md` (~136 KB) sangat besar — cari bagian dengan grep/heading, jangan dibaca utuh.

## Aturan Utama

1. **Scope mengacu pada `docs/laporan/laporan.md` dan `PROJECT.md`**: 5 modul Core — Kependudukan, Surat-Menyurat, Kas RW, Iuran Warga, Pengumuman/Informasi.
2. **Surat-Menyurat masuk Core MVP** (SF-SR-01 s/d SF-SR-07 di `laporan.md`: pengajuan, unggah berkas, verifikasi pengurus, persetujuan/penerbitan, unduh PDF).
3. **Akun warga dibuat terpusat oleh pengurus RW** (bukan pendaftaran mandiri), agar tidak ada yang mendaftar dengan NIK orang lain.
4. **Berkas** (bukti kas, dokumen syarat surat) disimpan di direktori lokal server (`static/uploads/`).
5. **Istilah domain tetap Bahasa Indonesia** di kode (`warga`, `kk`, `rt`, `rw`, `surat`, `iuran`, `kas`, `pengurus`). Jangan diterjemahkan ke Inggris, agar konsisten dengan mitra dan dokumen akademik.
6. **Data sensitif** — NIK, No. KK, alamat, data keuangan adalah PII. Terapkan masking di tabel (`3275••••••••0001`), validasi Zod 16 digit, dan kontrol akses berbasis role.
7. Fitur dari daftar "Fitur Dikesampingkan dari MVP" di `PROJECT.md` (CCTV, manajemen pengurus, inventaris): **konfirmasi dulu ke pengguna**.
8. Ragu soal scope? Cek tabel prioritas di `PROJECT.md`, tanyakan jika masih ambigu.
9. Jangan buat data dummy yang menyerupai data warga asli; pakai penanda jelas seperti "Contoh Warga 1".

## Tech Stack

- **SvelteKit 2 + Svelte 5** (TypeScript, runes)
- **Tailwind CSS v4** via `@tailwindcss/vite` — design tokens di `src/app.css` (@theme)
- **SQLite via Turso/libsql** (`file:local.db` lokal, `libsql://...` production)
- **Drizzle ORM** + drizzle-kit migrations
- **Better Auth** (`admin` plugin + access control)
- **zod + sveltekit-superforms** untuk validasi form
- Payment gateway: **Midtrans** (`src/lib/server/midtrans.ts`, `src/routes/api/midtrans/`)
- Test: Vitest (unit, `*.test.ts`) dan Playwright (`e2e/`)
- Hosting/deployment: `[TODO]`

## Perintah Umum

```bash
npm install
cp .env.example .env     # default file:local.db
npm run db:setup         # tabel domain + Better Auth (idempotent) — wajib sebelum dev
npx tsx scripts/seed.ts  # user admin + RW + kategori kas
npm run dev
npm run check            # type check
npm run build
npx drizzle-kit generate && npm run db:setup   # migrasi baru ke local.db
npx drizzle-kit migrate                        # migrasi Turso production
```

- **Jangan** `npx drizzle-kit push` pada `local.db`: tabel Better Auth bukan bagian schema Drizzle; drizzle-kit meminta input interaktif dan bisa crash di Windows.
- DB lokal = `file:local.db`. `compose.yaml` (libsql-server via Docker) belum tersambung ke script mana pun; `db:setup`/`db:auth` hanya menerima URL `file:`.

## Struktur Repo

```
src/
  hooks.server.ts            session hydration + auth guard
  lib/
    permissions.ts           matriks role × resource × action (sumber tunggal)
    roles.ts, akses.ts       definisi & helper akses
    nav.ts, format.ts, types.ts, pdf-surat.ts
    components/              komponen UI (Button, Card, DataTable, Modal, ...)
    server/
      auth.ts                Better Auth server
      guard.ts               klasifikasi rute & role (dipakai hooks, layout, login)
      rbac.ts, scope.ts      cek izin & pembatasan per RT
      iuran.ts, kas.ts, pembayaran.ts, setoran.ts, midtrans.ts
      surat-ttd.ts, storage.ts, usia.ts
      db/schema.ts           semua tabel domain
      db/index.ts            klien Drizzle
  routes/
    login/
    (app)/                   area pengurus (butuh login)
      dashboard/ warga/ kk/ kas/ iuran/ surat/ pengumuman/ pengaturan/
    portal/                  portal warga (mobile-first): iuran, surat, perbaruan
    api/                     auth, midtrans, notifikasi
drizzle/                     migrasi SQL (+ meta/)
scripts/                     db-setup, seed, check-guard, check-form-routes
e2e/                         tes Playwright
docs/                        dokumentasi (lihat docs/README.md)
```

## Role

Didefinisikan di `src/lib/permissions.ts`; ringkasan di `README.md`.

- `superadmin` — izin penuh (belum dipakai di seed)
- `pengurus_rw` — penuh ke semua modul, termasuk Pengaturan & Kas RW
- `pengurus_rt` — kelola data & Kas RT wilayahnya; Kas RW hanya baca; tanpa Pengaturan
- `warga` — baca pengumuman & iuran sendiri, ajukan surat, bayar iuran

Role yang masuk ke group orang lain diarahkan ke landing miliknya (bukan 403). Jangan membuat cek role baru di luar `permissions.ts` / `guard.ts`.

## Dokumen Laporan (Word)

- Draft: `docs/laporan/laporan.md`. Dokumen resmi: `C:\Users\Afif\OneDrive\Kuliah\Semester 7\Capstone\Capstone_Kelompok_30.docx`.
- Alur: tulis di file `bab*` → setelah disetujui tim masuk `laporan.md` → disalin ke docx. Peta per bab ada di `docs/laporan/README.md`.
- Jangan edit `laporan.md` sebelum disetujui tim.
- Jangan update `laporan.md` secara proaktif (termasuk dari hasil verifikasi/riset). Kalau memang diminta mengubahnya, **salin dulu isi terbaru dari sumber utama (docx resmi di atas) ke `laporan.md`**, baru terapkan perubahan, supaya tidak menimpa revisi tim yang hanya ada di Word. Temuan/koreksi sebelum itu cukup dicatat di file terpisah (mis. `docs/laporan/referensi/daftar-pustaka.md` bagian 3).
- Kalau diminta "tulis ke Word", transfer isi ke docx di atas (bukan generate `.docx` baru) memakai skill **`capstone-word`** (Word COM). Skill & path OneDrive berbeda per anggota; pakai yang ada di mesin pengguna.

## Referensi

- `PROJECT.md` · `docs/README.md` · `docs/stakeholder/checklist.md` (checklist fitur untuk presentasi ke RW)

## Research & penulisan laporan

Skill di `.claude/skills/` (dipanggil otomatis sesuai task):

| Skill | Kapan |
|---|---|
| `research-source-finder` | Cari jurnal/referensi, ambil full text, isi matriks literatur |
| `thesis-writing-coach` | Struktur bab, outline, draft, timeline, persiapan sidang |
| `thesis-chapter-review` | Review bab sebelum dikirim ke dosen/mitra |
| `academic-translation-en-id` | Terjemah EN <-> ID akademik |

- Sumber: connector claude.ai (Consensus, Wiley Scholar Gateway, PubMed) + MCP `paper-search` (`.mcp.json`, butuh `uv` terpasang). Email Unpaywall & API key opsional taruh di `~/.config/paper-search-mcp/.env`, **jangan** di repo.
- Referensi disimpan di `docs/laporan/referensi/` — daftar pustaka di `daftar-pustaka.md` / `bibliography.md`, panduan analisis di `analisis-panduan.md`. Baca dulu sebelum cari sumber baru agar tidak duplikat.
- Tidak boleh mengarang sumber, DOI, kutipan, atau nomor halaman. Tidak memakai Sci-Hub/LibGen. Tandai `abstract-only` jika full text tidak tersedia.
- Bab teknis (perancangan, implementasi, pengujian) harus sesuai kode aktual di repo ini.
- Gaya sitasi default APA 7 kecuali pedoman Telkom/laporan menyatakan lain. Transfer ke Word tetap lewat skill `capstone-word` (lihat bagian di atas).
