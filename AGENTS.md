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

`docs/laporan/laporan.md` adalah **cermin** `Capstone.docx`, bukan sumber terpisah.
Setiap kali pengguna minta "update laporan" / "diff", jalankan alur ini **tanpa ditanya**:

1. `npm run laporan:pull` — tarik docx (read-only) dan auto-commit `sync(docx)` kalau berubah.
   Ditolak kalau `laporan.md` punya perubahan belum di-commit → commit usulan dulu.
2. Edit `laporan.md` di posisi yang sesuai struktur docx (usulan).
3. Commit usulan: `docs(laporan): usulan <topik>`.
4. `npm run laporan:usulan` → `docs/laporan/usulan.md` (gitignored): lembar copas per lokasi
   (GANTI/SISIPKAN/HAPUS + teks bersih). Beri tahu pengguna jumlah usulan & tautkan file ini.
5. Setelah pengguna menempel ke Word → `npm run laporan:pull` lagi; ia melaporkan baris usulan
   yang belum masuk Word.

Sisanya dijelaskan di `docs/README.md`. Konvensi kode ada di `CLAUDE.md`.
