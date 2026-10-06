# CLAUDE.md

Panduan kerja untuk Claude Code di repo ini. Baca `PROJECT.md` dulu untuk konteks produk lengkap sebelum mengerjakan task apa pun.

## Ringkasan Proyek

Sistem Informasi RW — aplikasi capstone untuk digitalisasi administrasi tingkat RW (kependudukan, surat, keuangan, iuran, informasi), dikembangkan bersama mitra RW nyata. Detail lengkap ada di `PROJECT.md`.

## Aturan Utama

1. **Scope proyek mengacu pada `draftrevised.md` dan `PROJECT.md`**. Scope mencakup 5 modul Core: Kependudukan, Surat-Menyurat, Kas RW, Iuran Warga, dan Pengumuman/Informasi.
2. **Fitur "Surat-Menyurat" masuk dalam Core MVP** sesuai spesifikasi SF-SR-01 s/d SF-SR-07 pada `draftrevised.md` (pengajuan surat, unggah berkas, verifikasi pengurus, persetujuan/penerbitan admin RW, unduh slip/PDF).
3. **Pendaftaran akun warga dilakukan terpusat oleh Admin RW** (bukan pendaftaran mandiri/publik), untuk mencegah warga mendaftar menggunakan NIK milik orang lain.
4. **Penyimpanan berkas** (bukti kas, dokumen syarat surat) disimpan di direktori lokal server.
5. **Istilah domain tetap pakai Bahasa Indonesia** di kode (nama entity, field DB, variabel domain) — `warga`, `kk`, `rt`, `rw`, `surat`, `iuran`, `kas`, `pengurus`, dst. Jangan diterjemahkan ke Inggris (`resident`, `dues`, dll.), supaya istilah di kode konsisten dengan istilah yang dipakai mitra dan dokumen akademik capstone.
6. **Data yang disimpan bersifat sensitif** — NIK, No. KK, alamat, dan data keuangan warga adalah PII dan data finansial. Terapkan data masking pada tampilan tabel (`3275••••••••0001`), validasi input Zod 16 digit, dan kontrol akses berbasis role.
5. Kalau diminta menambah fitur dari daftar "Fitur Dikesampingkan dari MVP" di `PROJECT.md` (CCTV, manajemen pengurus, inventaris), **konfirmasi dulu ke pengguna** sebelum mengerjakan.
6. Kalau ragu apakah sesuatu termasuk scope MVP, cek tabel prioritas di `PROJECT.md` (Core MVP / High Priority / Medium) sebelum mengerjakan, dan tanyakan jika masih ambigu.

## Tech Stack

- Bahasa & framework: **SvelteKit 2 + Svelte 5** (TypeScript, runes mode aktif)
- CSS: **Tailwind CSS v4** via `@tailwindcss/vite` — design tokens di `src/app.css` (@theme)
- Database: **SQLite via Turso/libsql** (`file:local.db` lokal, `libsql://...` production)
- ORM / query layer: **Drizzle ORM** (`drizzle-orm/libsql`) + drizzle-kit migrations
- Autentikasi: **Better Auth** dengan `admin` plugin — roles: `admin_rw`, `pengurus_rt`, `bendahara`, `warga`
- Payment gateway / QRIS provider: `[TODO — konfirmasi mitra dulu]`
- Hosting/deployment: `[TODO]`

## Perintah Umum

```bash
# Install dependencies
npm install

# Jalankan dev server
npm run dev

# Type check
npm run check

# Bootstrap DB lokal (domain + Better Auth, idempotent)
npm run db:setup

# Generate SQL migrasi baru, lalu terapkan ke local.db
npx drizzle-kit generate
npm run db:setup

# Jalankan migrasi (Turso remote/production)
npx drizzle-kit migrate

# PENTING: jangan `npx drizzle-kit push` pada local.db — tabel Better Auth
# (user/session/account/verification) bukan bagian dari schema Drizzle, jadi
# drizzle-kit meminta jawaban interaktif dan bisa crash di Windows.
#
# PENTING: DB lokal = `file:local.db`. `compose.yaml` (libsql-server via Docker)
# belum tersambung ke script mana pun — `db:setup`/`db:auth` hanya menerima URL
# `file:`, jadi jangan arahkan TURSO_DATABASE_URL ke 127.0.0.1:8080.

# Build production
npm run build
```

## Struktur Repo

```
src/
  app.css                  ← Tailwind v4 + design tokens (@theme)
  app.html                 ← HTML shell + PWA meta
  app.d.ts                 ← App.Locals types (user, session)
  hooks.server.ts          ← Session hydration + auth guard
  lib/
    auth-client.ts         ← Better Auth client (browser)
    server/
      auth.ts              ← Better Auth server instance
      db/
        index.ts           ← Drizzle client (Turso/libsql)
        schema.ts          ← Semua tabel domain
  routes/
    +layout.svelte         ← Root layout (app.css import)
    +layout.server.ts      ← Expose user ke semua pages
    +page.svelte           ← Redirect → /dashboard
    login/
      +page.svelte         ← Login form
    (app)/                 ← Route group: authenticated shell
      +layout.svelte       ← Sidebar + bottom nav
      +layout.server.ts    ← Auth guard
      dashboard/
      warga/
      kas/
      iuran/
      pengumuman/
static/
  manifest.webmanifest     ← PWA manifest
drizzle/                   ← Generated SQL migrations
drizzle.config.ts          ← Drizzle kit config
```

## Role & Aktor Sistem

- **Admin RW** — akses penuh ke semua modul
- **Pengurus RT** — input/kelola data warga di wilayahnya, ajukan surat atas nama warga
- **Bendahara** — akses modul keuangan & iuran
- **Warga** — akses terbatas: lihat info RW, ajukan surat, bayar iuran (jika QRIS aktif)

> Role ini berdasarkan asumsi struktur RW umum — sesuaikan jika nanti ada klarifikasi dari mitra.

## Cara Kerja yang Diharapkan

- Proyek ini masih tahap requirements/awal pengembangan untuk sebuah capstone akademik — utamakan kesesuaian dengan kebutuhan mitra yang terdokumentasi di atas kelengkapan fitur.
- Kalau task menyentuh scope fitur (menambah field, mengubah alur, menambah modul), cek dulu apakah itu selaras dengan `PROJECT.md`. Kalau tidak selaras atau tidak disebutkan di sana, tanyakan ke pengguna alih-alih berasumsi.
- Jangan generate data dummy yang terlihat seperti data warga sungguhan (nama, NIK, dll.) dengan format yang bisa disalahartikan sebagai data asli — gunakan penanda jelas seperti "Contoh Warga 1" untuk seed/test data.

## Dokumen Word / SharePoint

- Draft laporan: `docs/laporan/draft.md` — kalau diminta "tulis ke Word/SharePoint", isinya ditransfer ke proposal di SharePoint, **bukan** generate `.docx` lokal.
- Lokasi folder kerja capstone: `C:\Users\Sena\OneDrive\Kuliah\Semester 7\Capstone`
- Dokumen proposal: `Capstone.docx` di SharePoint Telkom, diakses lewat shortcut `Capstone.docx.url` di folder tersebut (URL dibaca dari shortcut, jangan hardcode).
- Selalu pakai skill **`capstone-word`** (`C:\Users\Sena\.agents\skills\capstone-word\SKILL.md` + `word-helper.ps1`, Word COM) untuk membaca/mengedit dokumennya — aturan keras & struktur heading ada di skill itu.

## Referensi

- `PROJECT.md` — konteks produk, scope fitur, dan status tiap modul
- `docs/laporan/draft.md` — laporan capstone
- `docs/checklist.md` — checklist fitur untuk presentasi ke RW
