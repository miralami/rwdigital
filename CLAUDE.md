# CLAUDE.md

Panduan kerja untuk Claude Code di repo ini. Baca `PROJECT.md` dulu untuk konteks produk lengkap sebelum mengerjakan task apa pun.

## Ringkasan Proyek

Sistem Informasi RW — aplikasi capstone untuk digitalisasi administrasi tingkat RW (kependudukan, surat, keuangan, iuran, informasi), dikembangkan bersama mitra RW nyata. Detail lengkap ada di `PROJECT.md`.

## Aturan Utama

1. **Jangan menambah fitur baru di luar scope yang sudah confirmed** (lihat `PROJECT.md` § Status Fitur) tanpa konfirmasi eksplisit dari pengguna. Scope proyek ini sengaja dibatasi ketat berdasarkan hasil wawancara mitra, bukan daftar "fitur yang keren untuk RW pada umumnya".
2. **Fitur "Surat-Menyurat" masih berstatus pending** — jangan build out modul ini secara penuh sebelum flow-nya terkonfirmasi (siapa approve, tanda tangan digital atau manual, volume, dst.) dan tercatat di `PROJECT.md`.
3. **Istilah domain tetap pakai Bahasa Indonesia** di kode (nama entity, field DB, variabel domain) — `warga`, `kk`, `rt`, `rw`, `iuran`, `kas`, `pengurus`, dst. Jangan diterjemahkan ke Inggris (`resident`, `dues`, dll.), supaya istilah di kode konsisten dengan istilah yang dipakai mitra dan dokumen akademik capstone.
4. **Data yang disimpan bersifat sensitif** — NIK, No. KK, alamat, dan data keuangan warga adalah PII dan data finansial. Fitur apa pun yang menyentuh data ini harus mempertimbangkan validasi input dan kontrol akses berbasis role sejak awal, walau ini masih tahap MVP/capstone.
5. Kalau diminta menambah fitur dari daftar "Fitur Dikesampingkan dari MVP" di `PROJECT.md` (CCTV, dashboard statistik, manajemen pengurus, inventaris, agenda, pengaduan warga), **konfirmasi dulu ke pengguna** sebelum mengerjakan.
6. Kalau ragu apakah sesuatu termasuk scope MVP, cek tabel prioritas di `PROJECT.md` (🔴 Core / 🟠 Penting / 🟡 Opsional) sebelum mengerjakan, dan tanyakan jika masih ambigu.

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

# DB schema push (dev — tanpa migrasi)
npx drizzle-kit push

# DB generate + migrate (production)
npx drizzle-kit generate
npx drizzle-kit migrate

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

> Sesuaikan role ini kalau hasil wawancara mitra menunjukkan struktur pengurus yang berbeda.

## Cara Kerja yang Diharapkan

- Proyek ini masih tahap requirements/awal pengembangan untuk sebuah capstone akademik — utamakan kesesuaian dengan kebutuhan mitra yang terdokumentasi di atas kelengkapan fitur.
- Kalau task menyentuh scope fitur (menambah field, mengubah alur, menambah modul), cek dulu apakah itu selaras dengan `PROJECT.md`. Kalau tidak selaras atau tidak disebutkan di sana, tanyakan ke pengguna alih-alih berasumsi.
- Jangan generate data dummy yang terlihat seperti data warga sungguhan (nama, NIK, dll.) dengan format yang bisa disalahartikan sebagai data asli — gunakan penanda jelas seperti "Contoh Warga 1" untuk seed/test data.

## Referensi

- `PROJECT.md` — konteks produk, scope fitur, dan status tiap modul
- `draft.md` — current laporan
- `Checklist-Fitur-Sistem-Informasi-RW.md` - current checklist of features that is not fixed yet
