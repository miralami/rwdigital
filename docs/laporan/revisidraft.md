# DOKUMEN REVISI DRAFT PROPOSAL CAPSTONE PROJECT
## Sistem Informasi Rukun Warga (SI-RW) RW 06 Kelurahan Kota Baru

> Dokumen ini hanya memuat bagian-bagian yang **ditambahkan, diperbaiki, atau direvisi** berdasarkan hasil perbandingan terhadap template/contoh laporan acuan (`contohlaporan.md`). Bagian yang tidak mengalami perubahan tetap merujuk pada `draft.md`.

---

# DAFTAR REVISI DAN PENAMBAHAN

1. **Bab II (Tinjauan Pustaka)**:
   - Penambahan Subbab **2.2.1 Profil Mitra (RW 06 Kelurahan Kota Baru)**.
   - Penambahan Subbab **2.2.2 Sistem Informasi Rukun Warga (SI-RW)**.
   - Penambahan Subbab **2.2.3 Website dan Progressive Web Application (PWA)**.
   - Penambahan Subbab **2.2.4 Metode Kanban dan GitHub Projects** (Metodologi Manajemen Kerja & SDLC).
   - Penambahan Subbab **2.2.5 Metode MoSCoW** (Prioritisasi Kebutuhan).
   - Penambahan Subbab **2.2.6 Unified Modeling Language (UML)**.
   - Penambahan Subbab **2.2.7 Entity Relationship Diagram (ERD)**.
   - Penambahan Subbab **2.2.8 Framework SvelteKit dan Svelte 5**.
   - Penambahan Subbab **2.2.9 Basis Data SQLite dan Turso/LibSQL**.
   - Penambahan Subbab **2.2.10 Drizzle Object-Relational Mapping (ORM)**.
   - Penambahan Subbab **2.2.11 Black Box Testing**.
   - Penambahan Subbab **2.2.12 User Acceptance Testing (UAT) dan System Usability Scale (SUS)**.
   *(Subbab teori yang sudah ada di draft lama seperti Teori UI/UX, Software Engineering, dan Teori Keamanan Data disesuaikan penomorannya)*.

2. **Bab III (Spesifikasi dan Mekanisme Perancangan)**:
   - Penambahan butir regulasi dan standar pada **3.2 Standar Keteknikan** (UU Adminduk, Permendagri 18/2018, Perpres SPBE, Perwali Bekasi 58/2020).
   - Revisi **3.5.1 Sistematika Perancangan** (Mengintegrasikan alur kerja metode Kanban dan GitHub Projects).
   - Penambahan **3.5.2 Mekanisme Pengumpulan Data** (Tabel dan narasi instrumen pengumpulan data).
   - Penyesuaian nomor subbab verifikasi & validasi menjadi **3.5.3 Mekanisme Verifikasi dan Validasi**.
   - Penyesuaian nomor subbab jadwal menjadi **3.5.4 Jadwal Pelaksanaan Perancangan**.
   - Penyesuaian nomor subbab komponen menjadi **3.5.5 Identifikasi Komponen Sistem Terintegrasi** disertai tabel 5 unsur (Manusia, Material, Mesin/Peralatan, Informasi, Energi) kondisi As-Is vs To-Be.

---

# KONTEN REVISI BAB II: TINJAUAN PUSTAKA

## 2.2 Teori / Konsep Umum / Model / Kerangka Standar Terkait Perancangan

### 2.2.1 Profil Mitra (RW 06 Kelurahan Kota Baru)
Rukun Warga 06 (RW 06) merupakan salah satu Lembaga Kemasyarakatan Kelurahan yang berada di wilayah Kelurahan Kota Baru, Kecamatan Bekasi Barat, Kota Bekasi, Provinsi Jawa Barat. Berdasarkan Peraturan Daerah dan Peraturan Wali Kota Bekasi Nomor 58 Tahun 2020 tentang Rukun Tetangga dan Rukun Warga, RW bertugas membantu Lurah dalam pelayanan pemerintahan, pembangunan, dan kemasyarakatan, serta membina kerukunan hidup antarwarga.

Secara geografis dan demografis, RW 06 membawahi beberapa Rukun Tetangga (RT) dengan karakteristik masyarakat perkotaan yang heterogen, terdiri dari warga tetap, warga kontrak, serta pelaku usaha mandiri. Kegiatan operasional RW 06 mencakup pendataan kependudukan berkala, pengelolaan kas iuran swadaya masyarakat (seperti iuran kebersihan dan keamanan), penyampaian pengumuman kegiatan lingkungan (kerja bakti, peringatan hari besar, posyandu), serta verifikasi administratif pengantar surat bagi warga yang membutuhkan layanan kelurahan.

**Visi Lingkungan**: Terwujudnya lingkungan RW 06 yang tertib, aman, transparan, dan berdaya melalui penguatan gotong royong dan pelayanan masyarakat yang adaptif.  
**Misi Lingkungan**:
1. Menyelenggarakan tata kelola administrasi lingkungan yang rapi, transparan, dan akuntabel.
2. Memfasilitasi komunikasi dan penyaluran informasi yang efektif antara pengurus dan warga.
3. Mengoptimalkan pengelolaan dana swadaya masyarakat untuk pemeliharaan fasilitas umum dan keamanan bersama.

Struktur organisasi RW 06 dipimpin oleh Ketua RW yang dibantu oleh Sekretaris, Bendahara, seksi-seksi bidang kegiatan, serta para Ketua RT di wilayah lingkungan RW 06.

---

### 2.2.2 Sistem Informasi Rukun Warga (SI-RW)
Sistem Informasi Rukun Warga (SI-RW) adalah sistem informasi berbasis komputer yang dirancang khusus untuk memfasilitasi pencatatan, pemrosesan, dan pelaporan operasional administrasi pada tingkat rukun warga. Dalam hierarki administrasi publik di Indonesia, RW bukan unit birokrasi struktural pemerintahan, melainkan lembaga kemasyarakatan mitra pemerintah kelurahan yang menjalankan tugas fasilitatif kemasyarakatan (Permendagri No. 18 Tahun 2018).

Sistem Informasi RW mengintegrasikan data pada level mikro komunitas ke dalam basis data terpadu (*single source of truth*), yang mencakup data kepala keluarga (KK), data individu warga, catatan mutasi kependudukan lokal (domisili/pindah), transparansi kas swadaya, pencatatan tagihan iuran berkala, serta rekapitulasi pelaporan. Penerapan SI-RW mengatasi kelemahan model pencatatan manual (*spreadsheet* parsial atau buku kas fisik), mengurangi redundansi data antartingkat RT dan RW, serta meningkatkan akuntabilitas pertanggungjawaban dana lingkungan.

---

### 2.2.3 Website dan Progressive Web Application (PWA)
Aplikasi berbasis website adalah perangkat lunak yang diakses melalui peramban web (*web browser*) melalui jaringan internet atau intranet tanpa mengharuskan instalasi berkas biner pada perangkat pengguna. Aplikasi web modern dibangun dengan arsitektur responsif (*responsive web design*) yang menyesuaikan tata letak komponen antarmuka terhadap resolusi layar desktop, tablet, maupun telepon genggam (smartphone).

Pendekatan *Progressive Web Application* (PWA) melengkapi aplikasi web standar dengan kapabilitas serupa aplikasi seluler bawaan (*native*), seperti *manifest* aplikasi, pemasangan pintasan ke layar utama (*add to home screen*), serta efisiensi pemuatan aset melalui *service worker*. Karakteristik ini sangat relevan untuk sistem tingkat lingkungan warga, karena memudahkan partisipasi warga tanpa membebani kapasitas memori ponsel dengan unduhan aplikasi melalui toko aplikasi (*app store*).

---

### 2.2.4 Metode Kanban dan GitHub Projects
Metode Kanban merupakan kerangka kerja manajemen pengembangan perangkat lunak berbasis Agile dan Lean yang menekankan visualisasi aliran kerja (*visualize workflow*), pembatasan pekerjaan dalam proses (*limit work in progress* / WIP), dan optimalisasi efisiensi penyelesaian tugas secara berkesinambungan (Anderson, 2010). Berbeda dengan model linier kaku, Kanban memberikan fleksibilitas tinggi bagi tim pengembang untuk mengelola backlog fitur, merespons kendala secara dinamis, serta mempertahankan ritme kerja yang stabil (*sustainable pace*).

Prinsip inti penerapan metode Kanban meliputi:
1. **Visualisasi Aliran Kerja (*Visualize the Workflow*)**: Seluruh aktivitas perancangan dan pengembangan dipecah ke dalam unit-unit tugas diskret (*task cards/issues*) dan dipetakan ke dalam papan visual (*Kanban Board*) yang merepresentasikan setiap tahapan siklus hidup fitur.
2. **Pembatasan Pekerjaan dalam Proses (*Limit Work in Progress / WIP*)**: Menetapkan batas kuantitas tugas yang boleh berada pada kolom aktif (*In Progress*) dalam satu waktu. Hal ini mencegah *multitasking* berlebihan, meminimalkan waktu tunggu (*lead time*), serta mempercepat identifikasi titik kemacetan (*bottleneck*).
3. **Pengelolaan Aliran Tugas (*Manage Flow*)**: Memastikan pergerakan tugas dari tahap perancangan menuju implementasi dan pengujian berlangsung secara lancar dan terukur.
4. **Pemberlakuan Kebijakan Eksplisit (*Make Process Policies Explicit*)**: Mendefinisikan kriteria yang jelas sebelum suatu tugas dapat dipindahkan antar-kolom (*Definition of Ready* dan *Definition of Done*).
5. **Umpan Balik dan Evaluasi Berkelanjutan (*Feedback Loops & Continuous Improvement*)**: Melakukan peninjauan berkala terhadap efektivitas proses pengerjaan tim.

Dalam proyek Capstone SI-RW, metode Kanban diimplementasikan secara digital menggunakan platform **GitHub Projects** yang terintegrasi langsung dengan repositori kode sumber (`rwdigital`). Struktur papan Kanban yang dirancang mencakup kolom-kolom status utama:
- **`Backlog`**: Menampung seluruh daftar kebutuhan sistem dan fungsionalitas hasil analisis prioritisasi MoSCoW dalam bentuk *GitHub Issues*.
- **`Todo / Ready`**: Tugas atau modul yang telah memiliki spesifikasi teknis jelas dan siap untuk dikerjakan pada iterasi berjalan.
- **`In Progress`**: Tugas yang sedang aktif dikembangkan oleh anggota tim dengan batasan WIP limit yang ketat (maksimal 1–2 tugas aktif per pengembang).
- **`Review / Verification`**: Modul yang telah selesai dikoding dan sedang menjalani proses peninjauan kode (*Code Review* via *Pull Request*) serta verifikasi pengujian fungsional *Black Box*.
- **`Done`**: Fitur yang telah diverifikasi, lulus pengujian, disetujui, dan berhasil digabungkan (*merged*) ke cabang utama (*main branch*).

Pemanfaatan GitHub Projects memungkinkan automasi alur kerja (seperti perpindahan otomatis kartu status ketika *Pull Request* diajukan atau digabungkan), pelacakan riwayat kontribusi secara transparan, serta visibilitas progres perancangan secara *real-time* bagi seluruh anggota tim dan dosen pembimbing.

---

### 2.2.5 Metode MoSCoW
Metode MoSCoW merupakan teknik analisis dan prioritisasi kebutuhan perangkat lunak yang mengelompokkan setiap fitur atau persyaratan fungsional ke dalam empat tingkat urgensi (Clegg & Barker, 1994; Agustina et al., 2020):
1. **Must Have (M)**: Kebutuhan mandatori yang menjadi prasyarat mutlak beroperasinya sistem. Tanpa komponen ini, produk dinilai gagal memenuhi tujuan inti perancangan. Pada SI-RW, contohnya adalah pendataan kependudukan, autentikasi berbasis peran, dan pencatatan transaksi kas.
2. **Should Have (S)**: Kebutuhan penting bernilai guna tinggi yang tidak bersifat kritis pada fase peluncuran awal. Jika ditunda, sistem tetap dapat beroperasi dengan mekanisme alternatif sementara. Contohnya adalah fitur ekspor laporan ke format PDF dan penyaringan data multi-kriteria.
3. **Could Have (C)**: Kebutuhan tambahan atau nilai tambah (*enhancement*) yang diinginkan pengguna jika terdapat sisa waktu dan sumber daya pengembangan yang memadai. Contohnya adalah integrasi gateway pembayaran QRIS otomatis.
4. **Won’t Have / Would like (W)**: Kebutuhan yang disepakati secara sadar untuk dikesampingkan dari ruang lingkup proyek saat ini, namun dapat dipertimbangkan pada rencana rilis jangka panjang berikutnya. Contohnya adalah integrasi pengawasan CCTV dan modul inventaris aset sarana prasarana.

Penerapan metode MoSCoW menjamin alokasi waktu dan kapabilitas tim capstone terfokus penuh pada penyelesaian fungsi-fungsi vital mitra RW.

---

### 2.2.6 Unified Modeling Language (UML)
*Unified Modeling Language* (UML) adalah bahasa pemodelan visual berstandar industri internasional yang digunakan untuk menspesifikasikan, memvisualisasikan, membangun, dan mendokumentasikan artefak perangkat lunak berorientasi objek (Booch, Rumbaugh, & Jacobson, 2005). Pada proyek perancangan SI-RW, digunakan empat diagram utama UML:

1. **Use Case Diagram**: Memodelkan fungsionalitas sistem dari sudut pandang aktor luar. Diagram ini memetakan hubungan ketergantungan antara fungsionalitas (*use cases*) dengan kelompok aktor (Admin RW, Pengurus RT, Bendahara, dan Warga).
2. **Activity Diagram**: Menggambarkan aliran proses bisnis dan logika prosedural antarsistem dan pengguna secara sekuensial maupun paralel, dilengkapi percabangan keputusan (*decision node*) dan *swimlane* pembagian peran.
3. **Class Diagram**: Memodelkan struktur statis sistem yang memperlihatkan kelas-kelas entitas, atribut tipe data, metode operasional, serta hubungan keterkaitan antarkelas seperti relasi asosiasi, agregasi, atau komposisi.
4. **Sequence Diagram**: Memodelkan perilaku dinamis sistem dengan memperlihatkan interaksi pengiriman pesan (*message exchange*) antarobjek atau komponen logika berdasarkan urutan garis waktu (*timeline* dan *lifeline*).

---

### 2.2.7 Entity Relationship Diagram (ERD)
*Entity Relationship Diagram* (ERD) adalah teknik pemodelan data konseptual dan logis yang menggambarkan entitas dunia nyata, atribut penjelas, dan hubungan relasional antar-entitas dalam suatu domain informasi (Chen, 1976). ERD menjadi landasan sebelum skema fisik basis data dibentuk ke dalam tabel-tabel relasional.

Komponen utama ERD mencakup:
- **Entitas (*Entity*)**: Objek yang data atributnya dicatat dalam sistem (misalnya: `warga`, `kartu_keluarga`, `rt`, `transaksi_kas`, `iuran_warga`, `pengumuman`).
- **Atribut (*Attribute*)**: Karakteristik atau sifat yang melekat pada suatu entitas (misalnya: NIK, nama lengkap, tanggal lahir, saldo kas). Atribut pengidentifikasi unik ditetapkan sebagai *Primary Key* (PK).
- **Relasi (*Relationship*) & Kardinalitas**: Hubungan yang menghubungkan dua entitas atau lebih dengan batasan kardinalitas, seperti *One-to-One* (1:1), *One-to-Many* (1:N), atau *Many-to-Many* (M:N) yang ditransformasikan melalui kunci asing (*Foreign Key* / FK).

Melalui ERD dan proses normalisasi (minimal 3NF), redundansi data dalam penyimpanan kependudukan dan pencatatan kas dapat dihilangkan, serta integritas referensial antar-tabel terjamin.

---

### 2.2.8 Framework SvelteKit dan Svelte 5
SvelteKit merupakan framework pengembangan aplikasi web full-stack modern yang dibangun di atas mesin kompilator Svelte. Berbeda dengan framework berbasis *Virtual DOM* tradisional (seperti React atau Vue), Svelte bekerja pada tahap *compile-time* dengan mengubah kode deklaratif menjadi kode JavaScript imperatif berbobot ringan yang memanipulasi DOM secara langsung (Harris et al., 2023).

Pada generasi Svelte 5, diperkenalkan paradigma reaktivitas berbasis *runes* (seperti `$state`, `$derived`, dan `$effect`) yang menyederhanakan pengelolaan status (*state management*) serta meningkatkan performa komputasi di sisi peramban. SvelteKit menyediakan kapabilitas *Server-Side Rendering* (SSR) yang mengoptimalkan kecepatan muat halaman pertama, *Server Actions* untuk penanganan manipulasi data formulir yang aman langsung di server, serta sistem perutean berbasis struktur folder (*filesystem-based routing*) yang memudahkan pembagian hak akses per zona peran.

---

### 2.2.9 Basis Data SQLite dan Turso / LibSQL
SQLite adalah sistem manajemen basis data relasional (*Relational Database Management System* / RDBMS) berarsitektur nir-server (*serverless*), mandiri (*self-contained*), dan nir-konfigurasi (*zero-configuration*) yang menyimpan seluruh basis data ke dalam satu berkas biner tunggal pada disk (Hipp, 2020). SQLite menerapkan kepatuhan transaksi ACID (*Atomicity, Consistency, Isolation, Durability*) penuh.

Turso (berbasis LibSQL, sebuah *open-source fork* dari SQLite) memperluas kapabilitas SQLite dengan dukungan koneksi terdistribusi melalui protokol HTTP/WebSocket. Untuk kebutuhan perancangan SI-RW tingkat komunitas, SQLite dan Turso memberikan kombinasi keunggulan performa latensi baca yang sangat rendah, konsumsi memori server minimal, pencadangan basis data yang mudah (cukup menyalin berkas), serta kemudahan transisi dari lingkungan pengembangan lokal (`file:local.db`) ke lingkungan komputasi tepi (*edge database*).

---

### 2.2.10 Drizzle Object-Relational Mapping (ORM)
Drizzle ORM adalah pustaka pemetaan objek-relasional (*Object-Relational Mapping*) untuk ekosistem TypeScript yang mengedepankan prinsip *type-safety*, minim beban abstraksi (*zero-overhead*), serta pendekatan berbasis SQL murni (*SQL-like syntax*).

Drizzle memungkinkan penulisan skema basis data secara deklaratif dalam TypeScript, yang kemudian menghasilkan inferensi tipe data secara otomatis bagi seluruh operasi kueri. Keuntungan penerapan Drizzle ORM pada sistem ini meliputi:
1. **Pencegahan SQL Injection**: Seluruh pembentukan kueri dilakukan menggunakan parameter terikat (*parameterized queries*).
2. **Validasi Tipe Data Waktu Kompilasi**: Kesalahan penulisan nama kolom atau ketidaksesuaian tipe data dicegah sebelum kode dijalankan.
3. **Migrasi Terkelola (*Drizzle Kit*)**: Perubahan struktur tabel dikelola secara bertahap dan dapat dilacak melalui riwayat berkas migrasi SQL.

---

### 2.2.11 Black Box Testing
*Black Box Testing* (pengujian kotak hitam) adalah metode pengujian perangkat lunak yang berfokus semata-mata pada verifikasi fungsionalitas sistem berdasarkan masukan (*input*) dan keluaran (*output*) tanpa memeriksa struktur logika internal atau kode sumber aplikasi (Pressman & Maxim, 2020). Penguji mengevaluasi apakah sistem memberikan respons yang tepat sesuai dokumen spesifikasi kebutuhan.

Dalam perancangan SI-RW, diterapkan dua teknik utama pengujian kotak hitam:
1. **Equivalence Partitioning & Boundary Value Analysis**: Menguji rentang validitas data masukan formulir, seperti verifikasi bahwa NIK dan Nomor KK tepat bernilai 16 digit numerik, serta nominal iuran tidak boleh bernilai negatif.
2. **State Transition Testing**: Menguji transisi perubahan status entitas data berdasarkan aksi yang dilakukan aktor, misalnya perubahan status pengajuan administrasi dari `Diajukan` $\rightarrow$ `Diverifikasi` $\rightarrow$ `Disetujui`/`Ditolak`, atau status tagihan iuran dari `Belum Lunas` $\rightarrow$ `Lunas`.

---

### 2.2.12 User Acceptance Testing (UAT) dan System Usability Scale (SUS)
*User Acceptance Testing* (UAT) adalah fase pengujian akhir di mana pengguna perwakilan dari pemangku kepentingan nyata (Ketua RW, Pengurus RT, Bendahara, dan perwakilan warga) mengoperasikan sistem untuk memvalidasi apakah aplikasi telah memenuhi kebutuhan operasional dan ekspektasi kerja mereka (Hasugian et al., 2023).

Tingkat kemudahan dan kenyamanan penggunaan antarmuka dievaluasi secara kuantitatif menggunakan metode *System Usability Scale* (SUS) (Brooke, 1996). SUS terdiri dari 10 instrumen pertanyaan standar dengan skala Likert 1 (Sangat Tidak Setuju) hingga 5 (Sangat Setuju):
1. Saya merasa akan sering menggunakan sistem ini.
2. Saya merasa sistem ini terlalu rumit untuk digunakan.
3. Saya merasa sistem ini mudah digunakan.
4. Saya rasa saya memerlukan bantuan teknis untuk dapat menggunakan sistem ini.
5. Saya merasa fungsi-fungsi dalam sistem ini terintegrasi dengan baik.
6. Saya merasa ada terlalu banyak inkonsistensi dalam sistem ini.
7. Saya rasa kebanyakan orang akan dapat mempelajari sistem ini dengan cepat.
8. Saya merasa sistem ini sangat membingungkan saat digunakan.
9. Saya merasa sangat percaya diri saat menggunakan sistem ini.
10. Saya perlu mempelajari banyak hal terlebih dahulu sebelum dapat menggunakan sistem ini.

Skor akhir SUS dihitung dengan rumus baku berskala 0–100. Skor di atas 68 menunjukkan bahwa purwarupa sistem berada di atas rata-rata kelayakan industri (*above average/acceptable*).

---

# KONTEN REVISI BAB III: SPESIFIKASI DAN MEKANISME PERANCANGAN

## 3.2 Standar Keteknikan (Revisi & Penambahan Regulasi)

Pada bagian standar keteknikan dan acuan perancangan, ditambahkan regulasi resmi terkait tata kelola kelembagaan kemasyarakatan dan tertib administrasi kependudukan:

### 3.2.2 Regulasi Penyelenggaraan Lembaga Kemasyarakatan dan Kependudukan
1. **Undang-Undang Nomor 6 Tahun 2014 tentang Desa** (serta PP No. 43 Tahun 2014)  
   Menegaskan posisi Rukun Warga sebagai Lembaga Kemasyarakatan Desa/Kelurahan yang bertugas membantu pelaksanaan fungsi pelayanan administrasi pemerintahan dan pemberdayaan masyarakat.
2. **Peraturan Menteri Dalam Negeri Nomor 18 Tahun 2018 tentang Lembaga Kemasyarakatan Desa dan Lembaga Adat Desa**  
   Pasal 7 ayat (1) menetapkan tugas rukun warga meliputi pendataan kependudukan, pemeliharaan ketertiban, penyaluran aspirasi masyarakat, serta penumbuhan prakarsa dan gotong royong swadaya masyarakat.
3. **Undang-Undang Nomor 24 Tahun 2013 tentang Administrasi Kependudukan**  
   Menegaskan bahwa identitas penduduk berupa Nomor Induk Kependudukan (NIK) dan Kartu Keluarga (KK) merupakan data kependudukan pribadi yang pengelolaannya wajib menjamin kerahasiaan dan integritas data dari akses pihak yang tidak sah.
4. **Peraturan Presiden Nomor 95 Tahun 2018 tentang Sistem Pemerintahan Berbasis Elektronik (SPBE)**  
   Mendorong integrasi dan keterpaduan sistem layanan publik berbasis elektronik demi mewujudkan tata kelola yang bersih, transparan, efisien, dan akuntabel.
5. **Peraturan Wali Kota Bekasi Nomor 58 Tahun 2020 tentang Rukun Tetangga dan Rukun Warga**  
   Mengatur pedoman organisasi, mekanisme pertanggungjawaban dana iuran lingkungan, serta hubungan kerja koordinatif antara RT, RW, dan Kelurahan di wilayah Kota Bekasi.

---

## 3.5.1 Sistematika Perancangan (Revisi Berbasis Metode Kanban)

Sistematika perancangan Sistem Informasi RW dilaksanakan menggunakan kerangka kerja **Kanban** yang terintegrasi dengan **GitHub Projects** pada repositori proyek. Pendekatan ini memungkinkan pengelolaan aktivitas perancangan dan pengembangan berlangsung secara bertahap, terukur, dan transparan melalui papan visual (*Kanban board*).

Tahapan alur kerja sistematika perancangan berbasis Kanban diuraikan sebagai berikut:

1. **Pembentukan *Product Backlog* dan Pemetaan Kebutuhan (Tahap Analisis)**:
   - Mengidentifikasi seluruh proses bisnis, regulasi, dan kebutuhan pengguna tingkat RW.
   - Mengelompokkan kebutuhan fungsional dan non-fungsional menggunakan metode MoSCoW (*Must Have, Should Have, Could Have, Won't Have*).
   - Memetakan kebutuhan ke dalam bentuk tiket tugas terperinci (*GitHub Issues*) dan memasukkannya ke dalam kolom **`Backlog`** pada GitHub Projects.

2. **Perancangan Konseptual dan Arsitektur Awal (Tahap Desain)**:
   - Merancang struktur data relasional menggunakan Entity Relationship Diagram (ERD).
   - Memodelkan alur interaksi aktor dan sistem melalui UML (Use Case, Activity, Class, dan Sequence Diagram).
   - Menyusun perancangan antarmuka pengguna (UI/UX) responsif dan arsitektur kontrol akses berlapis (RBAC).
   - Tiket tugas perancangan dipindahkan dari `Backlog` ke kolom **`Todo / Ready`** setelah kriteria kesiapan (*Definition of Ready*) terpenuhi.

3. **Pengembangan Fitur Secara Inkremental (*Continuous Flow Development*)**:
   - Pengembang memindahkan kartu tugas dari `Todo` ke kolom **`In Progress`** dengan memberlakukan batas pekerjaan dalam proses (*Work In Progress / WIP limit*, maksimal 1–2 tugas per anggota tim).
   - Pengembangan modul dilakukan secara modular (Kependudukan, Kas, Iuran, Pengumuman) menggunakan SvelteKit, SQLite/Turso, Drizzle ORM, dan Better Auth.
   - Pengerjaan kode dilakukan pada *branch* kerja terpisah (*feature branch*) guna menjaga stabilitas cabang utama (*main*).

4. **Peninjauan Kode dan Pengujian Modular (*Review & Verification*)**:
   - Setelah implementasi selesai, pengembang membuat *Pull Request* (PR) yang secara otomatis memindahkan status kartu ke kolom **`Review / Verification`**.
   - Dilakukan peninjauan kode (*peer review*) antaranggotan tim dan verifikasi pengujian fungsional *Black Box* (Equivalence Partitioning & State Transition Testing).
   - Koreksi dilakukan langsung apabila ditemukan cacat kode sebelum izin penggabungan diberikan.

5. **Penggabungan Fitur dan Penyelesaian (*Deployment & Done*)**:
   - Tiket yang telah lulus verifikasi dan disetujui digabungkan (*merge*) ke cabang utama, yang secara otomatis memindahkan kartu tugas ke kolom **`Done`**.
   - Modul yang telah terintegrasi siap diuji lebih lanjut melalui simulasi lingkungan integrasi.

6. **Validasi Akhir dan Evaluasi Penerimaan (*Validation & UAT*)**:
   - Purwarupa sistem yang terbentuk divalidasi bersama pemangku kepentingan mitra (Pengurus RW, RT, Bendahara, dan Warga).
   - Evaluasi tingkat kemudahan penggunaan diukur menggunakan instrumen System Usability Scale (SUS).

---

## 3.5.2 Mekanisme Pengumpulan Data (Bagian Baru yang Ditambahkan)

Untuk memperoleh data perancangan yang valid dan sesuai dengan konteks operasional mitra, mekanisme pengumpulan data dilaksanakan secara sistematis melalui beberapa instrumen sebagaimana disajikan pada Tabel 3.2 berikut:

**Tabel 3.2 Instrumen dan Mekanisme Pengumpulan Data Perancangan**

| No | Kategori Data | Metode Pengumpulan | Sumber / Objek | Keterangan & Tujuan |
|---|---|---|---|---|
| 1 | Tugas Pokok, Fungsi, & Wewenang RW | Studi Dokumen & Analisis Regulasi | UU 6/2014, Permendagri 18/2018, Perwali Bekasi 58/2020 | Mengidentifikasi ruang lingkup tugas resmi RW agar batasan modul sistem memiliki kepatuhan hukum (*legal compliance*). |
| 2 | Alur Proses Bisnis & Tata Kelola Eksisting | Observasi Faktual & *Walkthrough* Alur | Pengurus RW 06 dan Buku Administrasi RW | Mengamati proses pencatatan warga, mekanisme iuran bulanan, pencatatan kas di buku, serta kendala diseminasi info via WhatsApp. |
| 3 | Struktur Data & Format Dokumen | Studi Dokumentasi Fisik | Format Buku Register Warga, Buku Kas, Kuitansi, Form Surat | Menentukan skema entitas data kependudukan (NIK, KK, RT), struktur pencatatan mutasi kas, serta format bukti iuran. |
| 4 | Kebutuhan Pengguna (*User Requirements*) | Analisis Kebutuhan & Pemetaan MoSCoW | Perwakilan Pengurus RW, Ketua RT, Bendahara, dan Warga | Menggali ekspektasi fungsional pengguna, memetakan fitur ke kategori *Must/Should/Could/Won't*, dan mengidentifikasi hak akses. |
| 5 | Kondisi Infrastruktur & Literasi Digital | Analisis Lingkungan Pengguna | Karakteristik Perangkat dan Konektivitas Pengurus/Warga | Mengetahui spesifikasi gawai (smartphone/laptop) pengguna guna memastikan antarmuka web responsif dan ringan diakses. |

---

## 3.5.3 Mekanisme Verifikasi dan Validasi (Penyesuaian Penomoran)
*(Isi mengacu pada subbab 3.5.2 di draft.md lama: verifikasi fungsional, validasi input, kontrol akses RBAC, uji kerentanan OWASP, serta validasi bersama mitra dan UAT berskala SUS)*.

---

## 3.5.4 Jadwal Pelaksanaan Perancangan (Penyesuaian Penomoran)
*(Isi mengacu pada subbab 3.5.3 di draft.md lama: tabel rencana 16 minggu/1 semester)*.

---

## 3.5.5 Identifikasi Komponen Sistem Terintegrasi (Format Standar 5 Unsur)

Sebagai landasan perancangan sistem terpadu, dilakukan pemetaan komparatif terhadap 5 (lima) unsur sistem terintegrasi (Manusia, Material, Mesin/Peralatan, Informasi, dan Energi) antara kondisi sistem manual saat ini (*As-Is*) dengan rancangan Sistem Informasi RW yang diusulkan (*To-Be*), sebagaimana dijabarkan pada Tabel 3.13:

**Tabel 3.13 Identifikasi Komponen Sistem Terintegrasi (Kondisi As-Is vs To-Be)**

| Unsur Komponen | Kondisi Sistem Saat Ini (*As-Is*) | Rancangan Sistem Informasi RW (*To-Be*) | Manfaat Integrasi |
|---|---|---|---|
| **Manusia (*Man*)** | - Pengurus RW/RT mencatat data secara manual di buku/Excel.<br>- Bendahara merekap iuran per RT secara ad-hoc.<br>- Warga menerima info secara pasif via chat grup. | - **Admin RW**: Mengelola akun, data induk, dan pengumuman.<br>- **Pengurus RT**: Memperbarui data warga wilayahnya.<br>- **Bendahara**: Mencatat transaksi kas & memantau iuran.<br>- **Warga**: Memantau tagihan, informasi, dan permohonan mandiri. | Pembagian peran terstruktur via RBAC (*Role-Based Access Control*), mengurangi beban kerja individu. |
| **Material (*Material*)** | - Kertas buku register kependudukan.<br>- Kuitansi kertas tanda terima iuran.<br>- Buku kas fisik dan fotokopi berkas pendukung. | - Berkas digital (dokumen PDF/ekspor CSV).<br>- Arsip bukti pembayaran elektronik (format gambar/dokumen terunggah).<br>- Formulir digital berbasis web. | Penghematan penggunaan kertas (*paperless*), pencegahan risiko kerusakan fisik atau kehilangan arsip. |
| **Mesin / Peralatan (*Machine*)** | - Komputer laptop pribadi (berkas tersimpan terpisah).<br>- Telepon seluler untuk percakapan WhatsApp.<br>- Alat tulis kantor dan lemari arsip fisik. | - Server basis data SQLite / Turso cloud terpusat.<br>- Peramban web pada smartphone warga dan PC pengurus.<br>- Komputasi *runtime* Node.js/SvelteKit. | Akses data multi-perangkat (*cross-platform*) tanpa instalasi perangkat lunak khusus. |
| **Informasi (*Information*)** | - Data kependudukan terfragmentasi di masing-masing RT.<br>- Rekap saldo kas terlambat dan rentan salah hitung.<br>- Pengumuman tertumpuk dalam obrolan grup instan. | - Basis data kependudukan terpadu (*single source of truth*).<br>- Saldo kas dan status tagihan iuran terbarui secara *real-time*.<br>- Papan informasi dan riwayat pengumuman terstruktur. | Informasi akurat, transparan, minim redundansi data, serta mudah ditelusuri (*audit trail*). |
| **Energi (*Energy*)** | - Energi fisik pengurus saat door-to-door atau rapat fisik.<br>- Daya listrik perangkat kantor secara parsial. | - Daya listrik komputer/smartphone saat operasional.<br>- Konsumsi energi server berbasis cloud tepi (*edge computing*) berdaya rendah. | Efisiensi waktu dan tenaga kerja pengurus dalam penyelenggaraan administrasi lingkungan. |
