# Kredensial Akun

Informasi akun dan akses default untuk pengembangan dan pengujian lokal.

## Akun Default (Seed)

Dibuat otomatis lewat `npm run db:seed`.

| Role | Email | Kata Sandi | Deskripsi |
|---|---|---|---|
| `admin_rw` | `admin@rw.id` | `admin123` | Akses penuh ke seluruh modul sistem |

## Akun Warga Baru

Akun warga dibuat terpusat oleh Admin RW di halaman detail warga (`/warga/[id]`):

- **Format Email Default**: `<NIK>@warga.rw` (atau custom email jika diisi)
- **Kata Sandi Default**: `warga123`
- **Role**: `warga`

## Role yang Tersedia

1. `admin_rw`: Administrator sistem tingkat RW
2. `pengurus_rt`: Pengurus tingkat RT
3. `bendahara`: Pengelola keuangan dan kas
4. `warga`: Akun warga untuk pengajuan surat dan informasi RW
