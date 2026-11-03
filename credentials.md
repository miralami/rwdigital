# Kredensial Akun

Informasi akun dan akses default untuk pengembangan dan pengujian lokal.

## Akun Default (Seed)

Dibuat otomatis lewat `npm run db:seed`.

| Role | Email | Kata Sandi | Deskripsi |
|---|---|---|---|
| `pengurus_rw` | `admin@rw.id` | `admin123` | Pengurus RW: akses penuh ke seluruh modul, termasuk Pengaturan dan Kas RW |
| `pengurus_rt` | `pengurus@rw.id` | `pengurus123` | Pengurus RT 01: kelola data & Kas RT wilayahnya, Kas RW hanya baca |
| `warga` | `warga@rw.id` | `warga123` | Portal warga (tertaut ke 1 KK) |

> Akun `superadmin` belum dibuat oleh seed. Peran `superadmin` sudah tersedia di
> kode dan akan dibahas terpisah.

## Akun Warga Baru

Akun warga dibuat dari halaman detail KK (`/kk/[id]`) oleh Pengurus RW atau
Pengurus RT pemilik wilayah:

- **Format Email Default**: `<NIK>@warga.rw` (atau custom email jika diisi)
- **Kata Sandi Default**: `warga123`
- **Role**: `warga`

## Role yang Tersedia

1. `superadmin`: peran sistem dengan izin penuh (belum dipakai di seed)
2. `pengurus_rw`: akses penuh ke seluruh modul, termasuk Pengaturan
3. `pengurus_rt`: mengelola seluruh modul untuk RT-nya, kecuali Pengaturan; Kas RW hanya baca dan tidak boleh mencatat setoran RT ke RW
4. `warga`: akun warga untuk pengajuan surat, tagihan, dan informasi RW/RT

Role di atas adalah bawaan (seed). Superadmin dapat menambah role baru dan
mengubah izinnya lewat **Pengaturan → Peran & Izin** selama fitur tersebut
sudah aktif. Izin disimpan di tabel `peran`, bukan di kode.
