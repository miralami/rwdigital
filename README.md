# Sistem Informasi RW

Aplikasi administrasi tingkat Rukun Warga (RW): data kependudukan, kas, iuran, dan pengumuman dalam satu tempat. Dibangun sebagai capstone project bersama mitra RW nyata, menggantikan proses yang sebelumnya tersebar di WhatsApp, dokumen fisik, dan spreadsheet per RT.

Fitur dalam proyek ini berasal dari hasil wawancara/observasi ke mitra, bukan daftar fitur "bagus untuk RW pada umumnya". Lihat [`PROJECT.md`](PROJECT.md) untuk status tiap modul.

## Fitur

| Modul | Rute | Status |
|---|---|---|
| Manajemen kependudukan (warga, KK) | `/warga` | Confirmed |
| Kas RW (pemasukan/pengeluaran, kategori) | `/kas` | Confirmed |
| Iuran (jenis, tagihan per periode, pembayaran) | `/iuran` | Confirmed |
| Pengumuman | `/pengumuman` | Confirmed |
| Portal warga (mobile-first) | `/portal` | Confirmed |
| Surat-menyurat | — | Pending konfirmasi mitra |

Sengaja di luar scope MVP: CCTV, dashboard statistik, manajemen pengurus, inventaris, agenda, pengaduan warga.

## Role

Akses berbasis role, didefinisikan sekali di [`src/lib/permissions.ts`](src/lib/permissions.ts) sebagai matriks resource × action.

| Role | Akses |
|---|---|
| `admin_rw` | Penuh ke semua modul |
| `pengurus_rt` | Kelola warga & KK, baca modul lain, ajukan surat |
| `bendahara` | Penuh ke kas & iuran, baca data warga |
| `warga` | Baca pengumuman & iuran sendiri, ajukan surat |

Klasifikasi rute dan role yang boleh mengaksesnya berada di [`src/lib/server/guard.ts`](src/lib/server/guard.ts) — dipakai `hooks.server.ts`, layout, dan login, supaya ketiganya tidak bisa berbeda pendapat. Role yang mendarat di group orang lain diarahkan ke landing miliknya, bukan diberi 403 (warga yang mengetik `/dashboard` diarahkan ke `/portal`).

## Tech Stack

- **SvelteKit 2 + Svelte 5** (TypeScript, runes)
- **Tailwind CSS v4** via `@tailwindcss/vite` — design tokens di `src/app.css`
- **SQLite via Turso/libsql** — `file:local.db` lokal, `libsql://` production
- **Drizzle ORM** + drizzle-kit migrations
- **Better Auth** dengan `admin` plugin + access control matrix
- **zod + sveltekit-superforms** untuk validasi form

## Menjalankan

Prasyarat: **Node.js >= 22.6** (dibutuhkan oleh `node:sqlite` di `scripts/db-setup.mts`).

Jalankan berurutan dari atas ke bawah — `npm run dev` harus setelah `db:setup`, kalau tidak
halaman akan gagal dengan `no such table: user`.

```sh
npm install
cp .env.example .env          # default: file:local.db, tidak butuh akun Turso
npm run db:setup               # tabel domain (drizzle/*.sql) + tabel Better Auth, satu pass
npx tsx scripts/seed.ts        # user admin + RW + kategori kas
npm run dev
```

Lalu buka http://localhost:5173 dan masuk dengan `admin@rw.id` / `admin123`.
Kredensial ini hanya untuk lokal — jangan dipakai di environment lain.

`npm run db:setup` idempotent dan aman diulang, jadi tidak perlu tahu apakah `local.db`
sudah ada atau belum.

### Mengubah schema

```sh
npx drizzle-kit generate   # generates SQL baru di drizzle/
npm run db:setup           # terapkan ke local.db (aman, idempotent)
```

> **Jangan menjalankan `npx drizzle-kit push` pada `local.db` hasil bootstrap di atas.**
> Tabel Better Auth (`user`, `session`, `account`, `verification`) bukan bagian dari
> `src/lib/server/db/schema.ts`, jadi drizzle-kit akan menganggapnya tabel asing dan
> meminta jawaban interaktif — di terminal Windows jalur ini bisa crash, dan jawaban
> yang biasanya dipilih akan menghapus tabel auth (akibatnya `no such table: user`).
> `npx drizzle-kit migrate` hanya untuk database Turso remote/production.

`db:setup` melewati tabel yang sudah ada, jadi `local.db` hasil bootstrap lama tidak
diperbarui otomatis. Kalau perubahan schema terasa tidak berefek, hapus `local.db`
lalu jalankan `npm run db:setup` dan `npx tsx scripts/seed.ts` ulang — `local.db`
cuma artefak dev, tidak ada data produksi di dalamnya.

### Perintah

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Build production |
| `npm run check` | svelte-check (type + a11y) |
| `npm run db:setup` | Bootstrap `local.db`: tabel domain + Better Auth |
| `npm run db:auth` | Terapkan `scripts/auth-schema.sql` saja |
| `npx drizzle-kit generate` | Generate migration SQL |
| `npx drizzle-kit migrate` | Jalankan migration (Turso production) |
| `npx tsx scripts/seed.ts` | Seed data awal |

### Self-check

Dua skrip tanpa dependency framework, dijalankan dengan Node type-stripping:

```sh
node --experimental-strip-types scripts/check-guard.ts        # logika klasifikasi rute & bounce
node --experimental-strip-types scripts/check-form-routes.ts   # konsistensi FORM_ROUTES vs file rute
```

`check-form-routes.ts` menjaga konstanta `FORM_ROUTES` di `src/routes/(app)/+layout.svelte` tetap sinkron dengan file rute yang ada — mencegah tombol submit ganda di halaman form baru, yang tidak akan ditangkap `svelte-check` maupun `build`.

## Struktur

```
src/
  app.css                  ← design tokens (@theme)
  hooks.server.ts          ← session hydration + guard
  lib/
    permissions.ts         ← matriks akses role
    nav.ts, format.ts      ← konstanta navigasi & formatting
    components/            ← Button, Card, Sidebar, BottomNav, Sheet, DataTable, ...
    server/
      guard.ts             ← klasifikasi rute + authz
      auth.ts, db/
routes/
  login/                   ← publik
  (app)/                   ← staff: dashboard, warga, kas, iuran, pengumuman
  portal/                  ← warga
drizzle/                   ← generated SQL migrations
scripts/                   ← bootstrap DB, seed, self-check
```

## Catatan

- **Data sensitif.** Aplikasi menyimpan NIK, No. KK, alamat, dan data keuangan. Semua sudah diberikan kontrol akses berbasis role, tapi Perlakukan sebagai PII — jangan commit data nyata ke repo.
- **Domain language.** Istilah (`warga`, `kk`, `rt`, `iuran`, `kas`) sengaja tidak diterjemahkan ke Inggris agar konsisten dengan istilah mitra dan dokumen capstone.
- **Mulai dari `PROJECT.md`.** Sebelum menambah fitur, cek status scope di sana. Lihat juga [`CLAUDE.md`](CLAUDE.md) untuk konvensi kerja.
