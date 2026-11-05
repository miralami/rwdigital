# AGENTS.md — Aturan Sesi AI

## Dev state (wajib)

File: `docs/dev/STATE.md` — mini Kanban lintas chat/device.

1. **Baca dulu** `docs/dev/STATE.md` sebelum mulai bekerja.
2. **Sebelum commit**, perbarui `ON PROGRESS` / `TODO` / `BLOCKED` / `ACTIVE FILES`.
   Maks 3 item *on progress*, maks 7 item *todo*, satu baris per item.
3. Jalankan **`npm run state`** agar stamp (waktu, branch, device) dan `DONE` (5 commit terakhir)
   sinkron otomatis. `npm run state:check` memastikan STATE.md tidak ketinggalan saat commit.
4. Jangan menulis riwayat panjang di sana — riwayat ada di `git log`.

Kalau bekerja dari device lain: `git pull --rebase` dulu sebelum mengedit `STATE.md`.

## Dokumen yang boleh diubah

Hanya 6 file ini yang berstatus *working* — selain itu **reference/legacy**, jangan diperbarui
kecuali memang diminta:

`docs/keputusan.md` · `AGENTS.md` · `docs/dev/STATE.md` · `PROJECT.md` · `docs/laporan/laporan.md` ·
`docs/laporan/bab4-plan.md`

## Keputusan = satu tempat

Keputusan lintas dokumen (judul, istilah, metodologi, iterasi, mitra, WIP, pengujian, UAT, tenggat)
hanya ditulis di `docs/keputusan.md` dengan ID `K-xx`. Urutan kalau berubah:
`keputusan.md` → usulan prosa di `laporan.md` → tempel ke Word → `npm run laporan:pull`.
Dokumen lain merujuk ID, **jangan menyalin isinya**.

## Laporan = Capstone.docx

Dua file, dua peran (jangan dicampur):

- `docs/laporan/cermin.txt` — **cermin teks** `Capstone.docx`, ditulis `npm run laporan:pull`
  (commit `sync(docx)`). **Jangan diedit.** Patokan perbandingan.
- `docs/laporan/laporan.md` — **sumber Markdown usulan**. Pull tidak pernah menimpanya.
  Edit di sini; `laporan:usulan` membandingkannya dengan `cermin.txt` (teks, bukan `git diff`).

Setiap kali pengguna minta "update laporan" / "diff", jalankan alur ini **tanpa ditanya**:

1. `npm run laporan:pull` — tarik docx (read-only) ke `cermin.txt`, auto-commit `sync(docx)` kalau berubah.
   Ditolak kalau `cermin.txt` punya perubahan belum di-commit.
2. Edit `laporan.md` sesuai struktur docx, ikuti **Format `laporan.md`** di bawah.
3. Commit usulan: `docs(laporan): usulan <topik>`.
4. `npm run laporan:usulan` → `docs/laporan/usulan.md` (gitignored): lembar copas per lokasi
   (lokasi "Setelah paragraf" + teks Word bersih; daftar hapus/ganti). Beri tahu pengguna jumlah
   lokasi & tautkan file ini.
5. Setelah pengguna menempel ke Word → `npm run laporan:pull` lagi; ia melaporkan baris usulan
   yang belum masuk Word.

### Format `laporan.md`

- Judul bab `# BAB I PENDAHULUAN`; subbab `## 1.1 …`; anak subbab `### 2.2.4 …`, `#### 2.2.4.1 …`.
  Nomor ditulis persis seperti di daftar isi Word.
- Satu paragraf = satu baris (jangan dipotong per baris). Antarparagraf dipisah baris kosong.
- Daftar: `1.` untuk nomor, `-` untuk butir. Huruf `a.`/`b.` ditulis di teks.
- Tabel: Markdown `| … |` dengan baris header (isi sel persis seperti di Word).
- Gambar: komentar `<!-- [Gambar x.y — tempel di Word] -->` lalu caption `**Gambar x.y** …`.
- Komentar `<!-- … -->` dan baris pemisah tabel diabaikan perbandingan.
- Daftar isi, nomor halaman, daftar gambar/tabel: **tidak ditulis** (dibuat Word).
- Teks harus sama dengan Word kecuali memang usulan. Typo dibetulkan sebagai usulan, bukan diam-diam.

Sisanya dijelaskan di `docs/README.md`. Konvensi kode ada di `CLAUDE.md`.
