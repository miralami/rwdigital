# Kredensial Akun

Informasi akun dan akses default untuk pengembangan dan pengujian lokal.

## Akun Default (Seed)

Dibuat otomatis lewat `npm run db:seed`.

| Role | Email | Kata Sandi | Deskripsi |
|---|---|---|---|
| `admin_rw` | `admin@rw.id` | `admin123` | Superadmin, akses penuh ke seluruh modul sistem |
| `ketua_rw` | `ketua@rw.id` | `ketua123` | Baca seluruh data + verifikasi/ubah surat |
| `sekretaris` | `sekretaris@rw.id` | `sekretaris123` | Kelola warga, KK, surat, dan pengumuman |
| `bendahara` | `bendahara@rw.id` | `bendahara123` | Kelola kas RW, iuran, dan konfirmasi pembayaran |
| `pengurus_rt` | `pengurus@rw.id` | `pengurus123` | Kelola warga & KK di RT tugasnya (RT 01) |
| `warga` | `warga@rw.id` | `warga123` | Portal warga (tertaut ke 1 KK) |

## Akun Warga Baru

Akun warga dibuat terpusat oleh Admin RW di halaman detail warga (`/warga/[id]`):

- **Format Email Default**: `<NIK>@warga.rw` (atau custom email jika diisi)
- **Kata Sandi Default**: `warga123`
- **Role**: `warga`

## Role yang Tersedia

1. `admin_rw`: Superadmin, akses penuh (tidak bisa diedit/dihapus)
2. `ketua_rw`: Memantau seluruh data dan memproses surat
3. `sekretaris`: Mengelola kependudukan, surat, dan pengumuman
4. `bendahara`: Pengelola keuangan, kas RW, dan iuran
5. `pengurus_rt`: Pengurus tingkat RT (data dibatasi ke RT tugasnya)
6. `warga`: Akun warga untuk pengajuan surat dan informasi RW

Role di atas adalah bawaan (seed). Superadmin dapat menambah role baru dan
mengubah izinnya lewat **Pengaturan → Peran & Izin** selama fitur tersebut
sudah aktif. Izin disimpan di tabel `peran`, bukan di kode.
