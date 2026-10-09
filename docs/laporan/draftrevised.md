PROPOSAL CAPSTONE PROJECT
SISTEM INFORMASI RW MENGGUNAKAN METODOLOGI KANBAN

 

Shaffira Indana Zulfa	102042300049
Afif Nur Sena	102042300189
Lintong Sahat Josua Sitohang	102042300128
Muhammad Zidan Alfarizi	102042300196
Alizha Tiara Syafahira	102042330201

PROGRAM STUDI STRATA 1 SISTEM INFORMASI
FAKULTAS REKAYASA INDUSTRI
UNIVERSITAS TELKOM

 DAFTAR ISI
Daftar Gambar	4
Daftar Tabel	4
BAB I  PENDAHULUAN	5
1.1.	Latar Belakang	5
1.2.	Alternatif Solusi	6
1.2.1.	Root Cause Analysis Fishbone Diagram	6
1.2.2.	Solusi Permasalahan	9
1.2.3.	Solusi yang Dipilih	10
1.3.	Perumusan Masalah	12
1.4.	Tujuan Perancangan	13
1.5.	Manfaat Perancangan	13
BAB II  TINJAUAN PUSTAKA	16
2.1.	Body of Knowledge	16
2.2.	Teori / Konsep Umum /  Model / Kerangka Standar Terkait Perancangan	18
2.2.1.	Sistem Informasi Rukun Warga (SI-RW)	18
2.2.2.	Website dan Progressive Web Application (PWA)	18
2.2.3.	Manajemen Proyek: Metode Kanban & Prioritisasi MoSCoW	19
2.2.3.1.	Metode Kanban dan GitHub Projects	19
2.2.3.2.	Prioritisasi Kebutuhan dengan Metode MoSCoW	19
2.2.4.	Teori Data dan Kependudukan	20
2.2.5.	Teori UI/UX & Interaksi	20
2.2.6.	Software Engineering & Pemodelan Sistem (UML & ERD)	21
2.2.6.1.	Software Engineering dan Arsitektur Sistem	21
2.2.6.2.	Unified Modeling Language (UML)	21
2.2.6.3.	Entity Relationship Diagram (ERD)	22
2.2.7.	Tech Stack & Pengujian Sistem (SvelteKit, SQLite, Black Box, UAT/SUS)	22
2.2.7.1.	Framework Pengembangan: SvelteKit dan Svelte 5	22
2.2.7.2.	Basis Data & ORM: SQLite, Turso/LibSQL, dan Drizzle ORM	22
2.2.7.3.	Verifikasi Fungsional: Black Box Testing	22
2.2.7.4.	Validasi Pengguna: User Acceptance Testing (UAT) & System Usability Scale  (SUS)	23
2.3.	Teori Keamanan	23
2.3.1.	Keamanan Data dan Pelindungan Data Pribadi	23
2.3.2.	Autentikasi dan Manajemen Sesi	24
2.3.3.	Role-Based Access Control	24
2.3.4.	Keamanan Aplikasi Web	24
BAB III  SPESIFIKASI DAN MEKAINSME PERANCANGAN	26
3.1.	Batasan Realistis	26
3.2.	Standar Keteknikan	27
3.2.1.	Regulasi Penyelenggaraan Lembaga Kemasyarakatan dan Kependudukan	27
3.2.2.	Regulasi dan Standar Keamanan Informasi	27
3.3.	Spesifikasi Rancangan	29
3.3.1.	Spesifikasi Kependudukan & Keuangan	29
3.3.2.	Spesifikasi UI/UX & Flow	30
3.3.3.	Spesifikasi Keamanan dan Akses	35
3.3.4.	Spesifikasi Fungsional	37
3.4.	Batasan Asumsi	40
3.5.	Mekanisme Perancangan	41
3.5.1.	Sistematika Perancangan	41
3.5.2.	Mekanisme Pengumpulan Data	42
3.5.3.	Mekanisme Verifikasi dan Validasi	43
3.5.3.1.	Mekanisme Verifikasi	43
3.5.3.2.	Mekanisme Validasi	44
3.5.4.	Jadwal Pelaksanaan Perancangan (Penyesuaian Penomoran)	44
3.5.5.	Identifikasi Komponen Sistem Terintegrasi (Format Standar 5 Unsur)	45
BAB IV  HASIL PERANCANGAN	48
5.	48
4.1.	Proses Perancangan	48
4.2.	Hasil Perancangan	48
4.3.	Verisfikasi Hasil Rancangan	48
BAB V  ANALISIS BIAYA & KELAYAKAN PERANCANGAN	48
6.	48
5.1.	Identifikasi Biaya Terkait Rancangan	48
5.2.	Analisis Kelayakan Perancangan	48
5.3.	Rencana Implementasi Hasil Rancangan	48
BAB VI  EVALUASI DAN VALIDASI HASIL PERANCANGAN	48
6.1.	Validasi Hasil Rancangan	48
BAB VII  KESIMPULAN DAN SARAN	48
7.1.	Kesimpulan	48
7.2.	Saran	48
Daftar Pustaka	49


 Daftar Gambar
Gambar 1Fishbone diagram	9
Gambar 2 Body of knowledge	18
Gambar 3 Alur Pengajuan Surat oleh Warga	34
Gambar 4 Alur Pembayaran Iuran melalui QRIS	35
Gambar 5 Alur Pengelolaan Data Warga	36
Gambar 6 Alur Pengelolaan Keuangan Kas RW	36


 Daftar Tabel
Tabel 1 Perbandingan alternatif solusi	14
Tabel 2 Realisasi sistem dengan standar regulasi	30
Tabel 3 Persyaratan Keamanan Data dan Aplikasi	37
Tabel 4 Persyaratan Akses dan Sesi	38
Tabel 5 Matriks Role-Based Access Control (RBAC)	39
Tabel 6 Spesifikasi Fungsional Admin RW	39
Tabel 7 Spesifikasi Fungsional Warga	40
Tabel 8 Spesifikasi Fungsional Bendahara	41
Tabel 9 Spesifikasi Fungsional Admin RW	42
Tabel 10 Mekanisme pengumpulan data	44
Tabel 11 Aktivitas perancangan	46
Tabel 12 Pemetaan komparatif unsur sistem terintegrasi as-is dan to-be	47

  
BAB I 
PENDAHULUAN
1.1.	Latar Belakang
Perkembangan teknologi digital di Indonesia mendorong berbagai aktivitas administrasi dan pelayanan masyarakat untuk beradaptasi dengan pemanfaatan sistem digital. Tingkat penetrasi internet Indonesia yang telah mencapai lebih dari 80% populasi menunjukkan bahwa penggunaan teknologi digital telah menjadi bagian dari aktivitas masyarakat sehari-hari (APJII, 2023). Kondisi tersebut membuka peluang bagi pemanfaatan teknologi dalam mendukung pengelolaan administrasi di tingkat masyarakat, termasuk pada lingkungan Rukun Warga (RW). Namun, kebutuhan terhadap digitalisasi tidak dapat hanya ditentukan berdasarkan perkembangan teknologi secara umum, melainkan perlu disesuaikan dengan tugas pokok dan fungsi (tupoksi) serta permasalahan nyata yang dihadapi oleh masing-masing lingkungan.
Berdasarkan UU No. 6 Tahun 2014 tentang Desa dan Permendagri No. 18 Tahun 2018 tentang Lembaga Kemasyarakatan Desa dan Lembaga Adat Desa, RW merupakan lembaga kemasyarakatan yang memiliki fungsi dalam pengelolaan data kependudukan, pengelolaan keuangan swadaya masyarakat, dan penyampaian informasi kepada warga. Dalam pelaksanaannya, administrasi RW pada umumnya masih dilakukan secara manual menggunakan dokumen fisik berupa buku register warga, pencatatan keuangan di spreadsheet yang terpisah per RT, serta penyebaran informasi melalui platform pesan instan seperti WhatsApp. Proses administrasi yang tersebar dan tidak terstruktur ini menimbulkan berbagai kendala dalam pengelolaan harian maupun pelaporan.
Kendala umum yang diidentifikasi dalam proses administrasi RW meliputi: (1) data kependudukan yang tersebar di berbagai dokumen dan sulit untuk dikonsolidasikan, sehingga menyulitkan pengurus dalam menyusun laporan maupun memberikan pelayanan yang akurat; (2) pencatatan keuangan kas RW yang tidak transparan dan rentan terhadap kesalahan hitung, mengingat tidak adanya sistem pencatatan ganda yang terstandar; (3) pembayaran iuran warga yang masih dilakukan secara tunai atau transfer manual sehingga memerlukan proses rekonsiliasi yang memakan waktu dan berisiko terhadap perbedaan catatan; serta (4) penyampaian informasi dan pengumuman yang bergantung pada grup WhatsApp, sehingga informasi mudah terlewati, sulit ditelusuri kembali, dan tidak dapat diakses secara terstruktur. Kondisi-kondisi tersebut menunjukkan adanya kebutuhan untuk menyediakan suatu media pengelolaan administrasi yang lebih terpadu dan terstruktur.
Di sisi lain, perkembangan penggunaan pembayaran digital di Indonesia membuka peluang untuk mendukung proses pembayaran iuran warga secara non-tunai. Nilai transaksi QRIS (Quick Response Code Indonesian Standard) di Indonesia terus mengalami peningkatan signifikan, menunjukkan bahwa metode pembayaran berbasis kode QR telah semakin diterima dan digunakan dalam aktivitas transaksi masyarakat sehari-hari (Bank Indonesia, 2023). Pemanfaatan QRIS dalam pembayaran iuran RW dapat menjadi salah satu alternatif yang relevan apabila sesuai dengan kebutuhan dan mekanisme pembayaran yang diterapkan oleh mitra.
Berdasarkan kondisi yang telah diuraikan, dapat disimpulkan bahwa permasalahan administrasi pada RW meliputi pengelolaan data kependudukan yang tidak terpusat, pencatatan keuangan yang tidak transparan, pembayaran iuran yang memerlukan rekonsiliasi manual, serta penyampaian informasi yang tidak terstruktur. Permasalahan-permasalahan tersebut menunjukkan kebutuhan terhadap suatu sistem informasi yang dapat mengintegrasikan proses administrasi RW secara lebih efisien dan terstruktur.
Oleh karena itu, capstone project ini mengusulkan pengembangan Sistem Informasi RW (SI-RW) yang disesuaikan dengan kebutuhan mitra. Penentuan fitur sistem didasarkan pada analisis regulasi resmi (UU Desa 6/2014, Permendagri 18/2018) dan evaluasi plausibility untuk konteks implementasi capstone. Fitur yang dikembangkan mencakup manajemen data kependudukan, pengelolaan keuangan kas RW, manajemen iuran warga, dan penyampaian pengumuman/informasi. Setiap fitur dirancang untuk menjawab permasalahan yang telah diidentifikasi, sehingga sistem yang dihasilkan diharapkan dapat membantu meningkatkan efisiensi pengelolaan administrasi serta memberikan akses informasi yang lebih terstruktur bagi pengurus dan warga RW.
1.2.	Alternatif Solusi
1.2.1.	Root Cause Analysis Fishbone Diagram
Root Cause Analysis dilakukan untuk mengidentifikasi faktor-faktor yang menjadi penyebab dari permasalahan pengelolaan administrasi di RW 06. Analisis ini menggunakan Fishbone Diagram atau Cause-and-Effect Diagram untuk mengelompokkan berbagai faktor penyebab berdasarkan kategori tertentu sehingga hubungan antara penyebab dan permasalahan utama dapat dianalisis secara sistematis. Fishbone Diagram menempatkan permasalahan sebagai akibat (effect) pada bagian kepala diagram, sedangkan faktor-faktor penyebab ditempatkan sebagai cabang yang mengarah kepada permasalahan tersebut. Pengelompokan penyebab melalui Fishbone Diagram dapat membantu proses identifikasi akar permasalahan secara lebih terstruktur (Cheng et al., 2018).
 
Gambar 1Fishbone diagram
Pada perancangan ini, permasalahan utama (effect) yang dianalisis adalah inefisiensi pengelolaan administrasi, kerentanan kehilangan dan inkonsistensi data kependudukan dan keuangan, serta diseminasi informasi lingkungan yang tidak terstruktur pada RW 06. Berdasarkan hasil analisis Fishbone Diagram, faktor penyebab dikelompokkan ke dalam aspek SDM/Manusia (Man), Metode (Method), Mesin/Perangkat (Machine), Material/Dokumen (Material), Manajemen (Management), dan Lingkungan (Environment).
1.	Man/SDM:
Faktor manusia berkaitan dengan pihak yang terlibat dalam proses pengelolaan administrasi dan kemampuan dalam menggunakan teknologi. Faktor yang ditemukan meliputi:
a.	Tingkat literasi digital pengurus RT dan RW yang beragam dan belum merata.
b.	Pengelolaan data sangat bergantung pada inisiatif segelintir individu tertentu.
c.	Tidak adanya pelatihan dan standarisasi operasional sistem digital bagi pengurus lingkungan.
d.	Hambatan transfer pengetahuan dan riwayat data saat pergantian pengurus periode baru

2.	Metode
Faktor metode berkaitan dengan prosedur dan alur kerja yang digunakan dalam pengelolaan administrasi. Faktor yang ditemukan meliputi:
a.	Alur pencatatan data warga dan administrasi masih dilakukan secara manual dan konvensional.
b.	Tidak tersedianya Standar Operasional Prosedur (SOP) baku dalam pencatatan dan pembaruan data warga secara berkala.
c.	Proses rekonsiliasi dan verifikasi pembayaran iuran warga dilakukan secara ad-hoc tanpa sistem pencatatan ganda (double-entry) yang terstandar.
d.	Mekanisme penyampaian pengumuman dan penanganan urusan warga masih melalui jalur informal yang tidak terdokumentasi.
3.	Mesin
Faktor mesin atau perangkat berkaitan dengan teknologi yang digunakan dalam mendukung proses administrasi. Faktor yang ditemukan meliputi:
a.	Ketiadaan aplikasi sistem informasi terpadu yang menghubungkan seluruh RT ke tingkat RW.
b.	Ketergantungan pada platform pesan instan seperti WhatsApp yang tidak dirancang untuk pengarsipan dan penelusuran informasi jangka panjang.
c.	Penggunaan spreadsheet seperti Excel yang terisolasi pada masing-masing perangkat tanpa sinkronisasi otomatis.
4.	Material
Faktor material berkaitan dengan bentuk data, dokumen, dan media penyimpanan yang digunakan dalam proses administrasi. Faktor yang ditemukan meliputi:
a.	Data fisik berupa buku register warga, kuitansi kertas, dan buku kas rentan rusak, tercecer, atau hilang akibat faktor fisik.
b.	Duplikasi dan inkonsistensi data NIK dan Nomor KK antar-RT karena ketiadaan single source of truth.
c.	Riwayat transaksi keuangan dan bukti pembayaran fisik sulit ditelusuri sehingga audit trail masih lemah.
5.	Manajemen
Faktor manajemen berkaitan dengan pengaturan kewenangan, pengawasan, dan tata kelola data dalam proses administrasi RW. Faktor yang ditemukan meliputi:
a.	Belum adanya pembagian hak akses (Role-Based Access) yang jelas dalam pengelolaan data warga dan kas lingkungan.
b.	Pengawasan dan monitoring status tunggakan atau kepatuhan iuran warga belum terpantau secara transparan dan berkala.
c.	Belum diterapkannya kebijakan baku perlindungan data pribadi (Personally Identifiable Information/PII) warga di tingkat lingkungan kemasyarakatan.
6.	Lingkungan
Faktor lingkungan berkaitan dengan kondisi organisasi, sosial, dan sumber daya yang memengaruhi penerapan sistem. Faktor yang ditemukan meliputi:
a.	Ketiadaan alokasi anggaran swadaya masyarakat untuk membeli perangkat server khusus atau berlangganan aplikasi SaaS berbayar.
b.	Karakteristik demografis warga perkotaan yang heterogen, seperti warga tetap, pengontrak, dan penghuni kos, dengan tingkat mobilitas kependudukan yang tinggi.
Berdasarkan hasil analisis tersebut, permasalahan administrasi RW 06 tidak hanya disebabkan oleh penggunaan media pencatatan manual, tetapi juga dipengaruhi oleh faktor manusia, metode kerja, keterbatasan teknologi, pengelolaan dokumen, tata kelola, serta kondisi lingkungan. Oleh karena itu, solusi yang dirancang perlu mengatasi permasalahan tersebut secara terpadu dengan mempertimbangkan kemampuan pengguna, kebutuhan pengelolaan data, keterbatasan sumber daya, dan keamanan informasi.
1.2.2.	Solusi Permasalahan
Berdasarkan hasil Root Cause Analysis, terdapat beberapa alternatif solusi yang dapat diterapkan untuk mengatasi permasalahan administrasi di RW 06.
1.	Digitalisasi Administrasi Menggunakan Spreadsheet Terpusat
Alternatif pertama adalah mengembangkan pengelolaan administrasi menggunakan spreadsheet terpusat. Data kependudukan, keuangan, dan iuran dapat disimpan dalam dokumen digital yang dapat diakses oleh pengurus yang memiliki kewenangan. Penggunaan spreadsheet dapat mengurangi ketergantungan terhadap pencatatan menggunakan buku dan dokumen fisik serta mempermudah proses pembaruan data.
Namun, alternatif ini masih memiliki keterbatasan dalam pengelolaan hak akses yang lebih terperinci, pencatatan audit trail, validasi data, pengelolaan alur administrasi, serta integrasi berbagai kebutuhan administrasi RW. Selain itu, penggunaan spreadsheet masih dapat menghasilkan beberapa sumber data apabila setiap RT menggunakan dokumen yang berbeda.
2.	Penggunaan Platform Digital yang Sudah Tersedia
Alternatif kedua adalah memanfaatkan platform digital yang telah tersedia untuk mendukung proses administrasi, seperti layanan penyimpanan dokumen, formulir digital, dan platform komunikasi. Pendekatan ini dapat mengurangi kebutuhan pengadaan perangkat khusus dan biaya pengembangan sistem dari awal.
Alternatif ini dapat membantu proses digitalisasi dokumen dan penyampaian informasi. Namun, penggunaan beberapa platform yang berbeda dapat menyebabkan data dan proses administrasi tetap terpisah. Platform komunikasi seperti WhatsApp juga tidak secara khusus dirancang sebagai sistem pengelolaan data kependudukan, keuangan, dan administrasi dengan kebutuhan pengarsipan serta pengendalian akses yang terstruktur.
3.	Pengembangan Sistem Informasi RW Terintegrasi
Alternatif ketiga adalah mengembangkan sistem informasi yang mengintegrasikan kebutuhan administrasi RW dalam satu platform. Sistem dapat menyediakan pengelolaan data kependudukan, keuangan RW, iuran warga, serta pengumuman dan informasi lingkungan.
Sistem dapat menggunakan basis data terpusat sebagai single source of truth untuk mengurangi duplikasi dan inkonsistensi data. Sistem juga dapat menerapkan Role-Based Access Control untuk membatasi akses berdasarkan peran pengguna, menyediakan pencatatan aktivitas untuk mendukung audit trail, serta menyediakan mekanisme pengelolaan informasi yang lebih terstruktur.
Alternatif ini juga dapat dirancang dengan mempertimbangkan keterbatasan anggaran dan infrastruktur yang ditemukan pada faktor Environment. Dengan demikian, sistem tidak harus bergantung pada server khusus atau layanan SaaS berbayar dalam tahap perancangan.
1.2.3.	Solusi yang Dipilih
Dalam menghadapi permasalahan administrasi RW yang telah diidentifikasi pada subbab sebelumnya, terdapat beberapa alternatif solusi yang dapat dipertimbangkan. Analisis terhadap masing-masing alternatif dilakukan berdasarkan kesesuaiannya dengan konteks RW tingkat kelurahan, kemampuan mengatasi permasalahan yang ada, serta keterbatasan yang dimilikinya.
1.	Alternatif 1: Mempertahankan proses manual
Pengelolaan administrasi RW secara manual menggunakan buku register, spreadsheet Excel, kuitansi fisik, dan grup WhatsApp merupakan pendekatan yang saat ini paling umum diterapkan. Pendekatan ini tidak memerlukan biaya teknologi tambahan dan tidak bergantung pada ketersediaan infrastruktur internet.
Namun, pendekatan ini memiliki keterbatasan yang signifikan: data kependudukan tersebar di berbagai dokumen dan mudah hilang, pencatatan keuangan rentan terhadap kesalahan dan sulit diaudit, rekonsiliasi iuran memerlukan waktu yang panjang, serta informasi yang disebarkan melalui WhatsApp mudah terlewati dan tidak dapat ditelusuri kembali secara terstruktur. Data sensitif seperti NIK dan nomor KK juga berisiko tersebar tanpa kontrol akses yang memadai. Pendekatan ini tidak berkelanjutan untuk kebutuhan digitalisasi administrasi yang lebih terstandar.
2.	Alternatif 2: Menggunakan platform SaaS existing yang menyasar RT/RW
Terdapat beberapa platform yang telah dikembangkan oleh pihak ketiga untuk kebutuhan administrasi RT/RW di Indonesia, salah satunya adalah Pak RT (pakrt.id). Platform ini menyediakan fitur data penduduk, kas RT, iuran, tagihan, dan pengumuman yang secara langsung menyasar konteks RT/RW berbeda dengan Sistem Informasi Desa (SID/OpenSID) yang lebih berorientasi pada birokrasi desa, atau Siskeudes/SIPKD yang dirancang khusus untuk pengelolaan APBDes.
Kelebihan utama pendekatan ini adalah kecepatan implementasi dan ketersediaan fitur yang sudah teruji. Namun, kelemahannya meliputi ketergantungan terhadap vendor eksternal, biaya langganan yang dapat membebani kas RW, minimnya kontrol terhadap data warga (PII) yang disimpan di server pihak ketiga, serta keterbatasan kustomisasi untuk menyesuaikan alur dengan kebutuhan spesifik mitra.
3.	Alternatif 3: Pengembangan sistem khusus (SI-RW)
Alternatif ketiga adalah merancang dan membangun sistem informasi secara khusus sesuai kebutuhan mitra, sebagaimana yang diusulkan dalam capstone project ini. Sistem dikembangkan menggunakan tech stack modern dengan fitur yang ditetapkan berdasarkan analisis regulasi resmi dan evaluasi plausibility.
Pendekatan ini memberikan fleksibilitas penuh dalam menentukan fitur, alur, dan kontrol akses sesuai struktur organisasi RW. Data warga dapat dikelola dengan kontrol keamanan yang dirancang sejak awal. Tidak ada biaya langganan kepada vendor eksternal, dan sistem dapat dikembangkan lebih lanjut setelah capstone selesai. Kelemahan utamanya adalah waktu dan biaya pengembangan awal, serta kebutuhan akan kapasitas teknis untuk pemeliharaan sistem pasca-handover. 
Tabel 1 Perbandingan alternatif solusi
Aspek	Manual	Platform SaaS RT/RW	Custom SI-RW
Biaya awal	Rp0	Rp0 – berbayar (langganan)	Pengembangan (satu kali)
Kecepatan implementasi	Instan	Instan	Sedang
Kesesuaian kebutuhan RW	Tinggi (familiar)	Tinggi	Sangat tinggi
Manajemen kependudukan	Terbatas	Baik	Baik
Manajemen kas & iuran	Buruk	Sangat baik	Sangat baik
Kontrol data & keamanan PII	Buruk	Perlu verifikasi vendor	Dapat dioptimalkan sejak awal
Transparansi ke warga	Rendah	Baik	Baik
Ketergantungan vendor	Tidak ada	Tinggi	Tidak ada
Kustomisasi	Tidak ada	Terbatas	Penuh
Keberlanjutan	Buruk (risiko hilang)	Tergantung vendor	Baik (self-host)

Berdasarkan analisis di atas, alternatif pengembangan sistem khusus (SI-RW) dipilih sebagai solusi dalam capstone project ini. Pendekatan ini memungkinkan perancangan yang sepenuhnya disesuaikan dengan kebutuhan mitra, menjaga kontrol terhadap data sensitif warga, dan memberikan landasan yang dapat dikembangkan lebih lanjut pasca-capstone tanpa ketergantungan pada vendor eksternal.
1.3.	Perumusan Masalah
Berdasarkan latar belakang yang telah diuraikan, rumusan masalah dalam perancangan Sistem Informasi RW ini adalah sebagai berikut:
1.	Bagaimana merancang sistem informasi yang dapat mengelola data kependudukan warga secara terpusat dan terstruktur di tingkat RW?
2.	Bagaimana merancang sistem pencatatan keuangan kas RW yang transparan dan dapat diakses oleh pengurus yang berwenang?
3.	Bagaimana merancang mekanisme pembayaran iuran warga yang mendukung pencatatan otomatis dan berpotensi mengakomodasi metode digital?
4.	Bagaimana merancang media penyampaian pengumuman dan informasi RW yang terstruktur dan mudah diakses oleh warga?
5.	Bagaimana merancang sistem dengan kontrol akses berbasis peran (role-based access) yang sesuai dengan struktur organisasi RW?
1.4.	Tujuan Perancangan
Tujuan perancangan capstone project ini adalah menghasilkan sistem informasi RW yang dapat membantu RW 06, Kelurahan Kota Baru, Kecamatan Bekasi Barat, Kota Bekasi dalam mengelola administrasi masyarakat secara lebih terstruktur dan terintegrasi.
Secara khusus, tujuan perancangan sistem ini adalah:
1.	Mengembangkan sistem yang dapat mengintegrasikan pengelolaan data kependudukan yang sebelumnya masih menggunakan buku.
2.	Memudahkan pengurus RW dan RT dalam melakukan pencatatan serta pembaruan data warga, termasuk data KK, KTP, alamat, nama, usia, dan status tinggal.
3.	Menyediakan pengelolaan data warga yang dapat digunakan sebagai sumber informasi dalam mendukung kebutuhan administrasi masyarakat, seperti pembuatan dokumen paspor, SKCK, SKTM, dan dokumen lainnya.
4.	Mengembangkan sistem administrasi surat-menyurat yang dapat memanfaatkan data kependudukan sehingga proses pengajuan dan pembuatan surat dapat dilakukan secara lebih terstruktur.
5.	Menyediakan sistem yang dapat membantu pengurus RW dalam mengelola informasi administrasi secara terpusat sehingga data tidak lagi tersebar pada media pencatatan yang berbeda.
1.5.	Manfaat Perancangan
Perancangan sistem informasi RW ini diharapkan dapat memberikan manfaat bagi pengurus RW, pengurus RT, dan warga RW 06, Kelurahan Kota Baru, Kecamatan Bekasi Barat, Kota Bekasi. Manfaat perancangan disesuaikan dengan fitur sistem yang dirancang, yaitu manajemen kependudukan, surat-menyurat, keuangan, iuran warga, serta pengumuman dan informasi RW.
1.	Bagi Pengurus RW:
a.	Membantu pengurus RW dalam menyimpan, mengelola, mencari, dan memperbarui data kependudukan secara terpusat. Data yang dikelola meliputi data KK, KTP, nama, alamat, usia, dan status tinggal warga.
b.	Membantu pengurus dalam mengelola proses pelayanan surat secara lebih terstruktur. Sistem dapat mendukung pengajuan surat, penggunaan template surat, pemberian nomor surat, proses persetujuan, serta penyimpanan riwayat surat.
c.	Membantu bendahara dalam mencatat pemasukan dan pengeluaran RW, mengelompokkan transaksi, memantau saldo kas, menyimpan bukti transaksi, serta menghasilkan laporan keuangan berdasarkan periode tertentu.
d.	Membantu pengurus dalam mengelola jenis dan nominal iuran, mencatat pembayaran warga, mengetahui status pembayaran, serta menghasilkan rekap pembayaran iuran secara terstruktur.
e.	Menyediakan media terpusat untuk menyampaikan pengumuman, informasi kegiatan, jadwal kerja bakti, rapat warga, dan informasi lainnya kepada warga.
2.	Bagi Pengurus RT:
a.	Membantu pengurus RT dalam mengakses dan memperbarui data warga sesuai dengan hak akses yang diberikan.
b.	Membantu pengurus RT dalam mendukung proses administrasi dan pengajuan surat warga.
c.	Memudahkan pengurus RT dalam memantau informasi terkait warga dan kegiatan RW melalui sistem.
3.	Bagi Warga:
a.	Memudahkan warga dalam mengajukan layanan administrasi yang tersedia melalui sistem.
b.	Memudahkan warga dalam menyampaikan atau memperbarui informasi kependudukan melalui mekanisme yang disediakan.
c.	Memudahkan warga dalam mengetahui status pembayaran iuran.
d.	Memudahkan warga dalam memperoleh pengumuman dan informasi RW melalui satu media yang terstruktur.
4.	Bagi Pengelolaan Administrasi RW:
a.	Mengurangi ketergantungan terhadap pencatatan menggunakan buku dan file Excel yang terpisah melalui penyediaan sistem administrasi yang terintegrasi.
b.	Menyediakan penyimpanan riwayat data dan transaksi sehingga informasi administrasi dapat ditelusuri kembali sesuai kebutuhan.
c.	Membantu mengintegrasikan data kependudukan dengan proses administrasi lain yang membutuhkan data warga.
d.	Menyediakan informasi administrasi yang lebih terstruktur bagi pengurus dan warga sesuai dengan hak akses masing-masing.

 BAB II 
TINJAUAN PUSTAKA
2.1.	Body of Knowledge
Body of Knowledge (BoK) yang menjadi acuan dalam Capstone Design Project perancangan purwarupa sistem informasi rukun warga pada penelitian ini mengacu pada kerangka kerja IS2020 A Competency Model for Undergraduate Programs in Information Systems. Sebagai upaya penyelesaian permasalahan administrasi pada lingkungan mitra, pengembangan sistem ini melibatkan tiga domain utama dalam Body of Knowledge (BoK) pada digambar dibawah ini.
 
Gambar 2 Body of knowledge
Berikut area utama yang menjadi fokus dalam kajian domain dalam penyelesaian permasalahan pada administrasi di lingkungan mitra :
1.	Data (Data/Information Management)
Domain Data berfokus pada penyimpanan dan pemrosesan data dalam suatu organisasi, yang mencakup pengelolaan basis data, analisis data, dan visualisasi data. Dalam perancangan ini, area yang digunakan adalah Data/Information Management, khususnya perancangan dan pengelolaan basis data. BoK ini relevan karena inti permasalahan yang diangkat adalah pengelolaan data. Pada RW 06, data kependudukan masih dicatat menggunakan buku dan spreadsheet terpisah, sedangkan data yang sama dibutuhkan untuk berbagai keperluan administrasi, penetapan iuran, serta penyampaian pengumuman. Pencatatan yang terpisah pada media yang berbeda berpotensi menimbulkan duplikasi dan ketidakkonsistenan data (Connolly & Begg, 2015), sehingga diperlukan satu sumber data yang terpusat dan terstruktur.
BoK ini diterapkan melalui beberapa kegiatan: 
a.	Pemodelan data menggunakan Entity Relationship Diagram (ERD) untuk entitas utama, seperti warga, KK, RT, transaksi kas, iuran, dan pengumuman. 
b.	 Perancangan basis data relasional yang dinormalisasi dengan penetapan kunci primer (primary key), kunci asing (foreign key), dan batasan integritas data. 
c.	Penerapan aturan validasi dan pencatatan riwayat perubahan data (audit trail) agar kualitas data terjaga. 
d.	Penyusunan rekapitulasi dan pelaporan, seperti rekap iuran dan laporan kas per periode, agar data dapat digunakan sebagai informasi pendukung keputusan pengurus.

2.	Development (Systems Analysis & Design dan Application Development)
Domain Development mencakup siklus hidup pengembangan aplikasi, mulai dari analisis dan perancangan sistem hingga pemrograman aplikasi, termasuk pemrograman web dan perancangan antarmuka pengguna (Leidig & Salmela, 2021). BoK ini relevan karena solusi yang diusulkan berupa sistem informasi yang melibatkan lebih dari satu kelompok pengguna, yaitu pengurus RW, bendahara, pengurus RT, dan warga, dengan kebutuhan dan hak akses yang berbeda. Kebutuhan tersebut perlu diidentifikasi secara sistematis sebelum sistem dibangun, agar sistem sesuai dengan proses yang berjalan di mitra (Dennis et al., 2018). Selain itu, pengguna sistem memiliki tingkat kemampuan digital yang beragam sehingga perancangan antarmuka yang sederhana dan konsisten menjadi bagian penting dari kelayakan penggunaan sistem.
BoK ini diterapkan melalui analisis kebutuhan berdasarkan observasi dan studi dokumen bersama pengurus RW, pemodelan sistem menggunakan UML, perancangan antarmuka responsif (UI/UX), serta pembangunan modul aplikasi berbasis alur kerja Kanban yang terintegrasi.
3.	Technology (Secure Computing)
Domain Technology mencakup infrastruktur teknologi informasi, keamanan komputasi (secure computing), dan teknologi pendukung (Leidig & Salmela, 2021). Dalam perancangan ini, area yang digunakan adalah Secure Computing. BoK ini sangat relevan karena sistem menyimpan data pribadi warga, seperti nama, alamat, No. KK, dan NIK, serta data keuangan RW yang meliputi transaksi kas dan pembayaran iuran. Kebocoran, pengubahan tanpa izin, atau hilangnya data tersebut dapat merugikan warga maupun pengurus.
BoK ini diterapkan melalui mekanisme autentikasi pengguna yang aman, pengaturan hak akses berbasis peran (Role-Based Access Control), penyamaran (data masking) data identitas sensitif, proteksi sesi berbasis cookie terenkripsi, serta perlindungan terhadap celah kerentanan aplikasi web berbasis standar OWASP Top 10.
2.2.	Teori / Konsep Umum /  Model / Kerangka Standar Terkait Perancangan
2.2.1.	Sistem Informasi Rukun Warga (SI-RW)
Sistem Informasi Rukun Warga (SI-RW) adalah sistem informasi terkomputerisasi yang dirancang untuk mendukung pencatatan, pengelolaan, dan pelaporan administrasi pada tingkat rukun warga. Berdasarkan Permendagri No. 18 Tahun 2018, RW merupakan lembaga kemasyarakatan yang bertugas membantu pemerintah kelurahan dalam pelayanan administrasi, pendataan kependudukan, pemeliharaan ketertiban, serta pengelolaan dana swadaya masyarakat.
SI-RW mengonsolidasikan data pada level komunitas mikro ke dalam basis data terpadu (single source of truth). Ruang lingkupnya mencakup pengelolaan data keluarga dan warga, transparansi kas lingkungan, pencatatan tagihan dan pembayaran iuran berkala, serta kanal informasi terstruktur bagi warga. Penerapan SI-RW pada mitra (RW 06 Kelurahan Kota Baru, Kecamatan Bekasi Barat) bertujuan menggantikan pencatatan manual berbasis buku fisik dan file Excel terpisah, sehingga meningkatkan efisiensi operasional, akurasi data, dan akuntabilitas keuangan lingkungan.
2.2.2.	Website dan Progressive Web Application (PWA)
Aplikasi berbasis website adalah perangkat lunak yang dijalankan pada peladen (server) dan diakses oleh pengguna melalui peramban web (browser) menggunakan jaringan internet atau intranet tanpa memerlukan instalasi aplikasi biner terpisah. Aplikasi web modern menerapkan prinsip desain responsif (responsive web design) agar tata letak dan interaksi sistem dapat beradaptasi secara optimal pada beragam resolusi layar, baik komputer desktop pengurus maupun telepon pintar (smartphone) warga.
Pendekatan Progressive Web Application (PWA) memperkaya fungsionalitas aplikasi web standar melalui pemanfaatan berkas manifes (web app manifest) dan service worker. PWA memungkinkan aplikasi web dipasang sebagai pintasan pada layar utama ponsel (add to home screen), memuat antarmuka dengan kecepatan tinggi melalui mekanisme caching, dan memberikan pengalaman penggunaan menyerupai aplikasi bawaan (native app). Pendekatan ini sangat tepat bagi sistem layanan kemasyarakatan karena mempermudah partisipasi warga tanpa membebani kapasitas penyimpanan gawai mereka.


2.2.3.	Manajemen Proyek: Metode Kanban & Prioritisasi MoSCoW
2.2.3.1.	Metode Kanban dan GitHub Projects
Metode Kanban adalah kerangka kerja manajemen pengembangan perangkat lunak berbasis Lean/Agile yang berfokus pada visualisasi aliran kerja (visualize workflow), pembatasan pekerjaan dalam proses (limit Work in Progress / WIP), dan perbaikan aliran tugas secara berkesinambungan (Anderson, 2010). Kanban memberikan fleksibilitas tinggi bagi tim pengembang untuk merespons kebutuhan secara adaptif tanpa terikat oleh siklus rilis kaku.
Penerapan metode Kanban pada proyek ini diwujudkan melalui platform GitHub Projects yang terintegrasi langsung dengan repositori kode sumber (rwdigital). Aliran kerja dibagi ke dalam kolom visual: 
1.	Backlog: Daftar seluruh kebutuhan fungsional dan teknis hasil elisitasi yang direpresentasikan sebagai GitHub Issues. 
2.	Todo / Ready: Tugas yang telah memiliki spesifikasi teknis jelas dan siap dikerjakan pada siklus pengerjaan aktif. 
3.	In Progress: Tugas yang sedang aktif dikembangkan oleh anggota tim dengan batasan ketat (WIP limit maksimal 1–2 tugas per orang). 
4.	Review / Verification: Modul yang telah selesai dikoding dan sedang dalam tahap peninjauan kode (Pull Request code review) serta pengujian fungsional. 
5.	Done: Fitur yang telah lulus verifikasi, disetujui, dan berhasil digabungkan (merged) ke cabang utama (main branch).
Integrasi GitHub Projects memungkinkan pembaruan status tugas secara otomatis ketika Pull Request dibuat atau digabungkan, memastikan transparansi dan kemudahan pelacakan progres tim secara real-time.
2.2.3.2.	Prioritisasi Kebutuhan dengan Metode MoSCoW
Metode MoSCoW adalah teknik analisis untuk mengklasifikasikan kebutuhan sistem ke dalam empat kategori urgensi (Clegg & Barker, 1994): - Must Have (M): Kebutuhan mandatori yang wajib diselesaikan agar produk MVP dapat beroperasi. Tanpa komponen ini, sistem tidak layak diluncurkan (misal: pendataan warga, autentikasi peran, pencatatan kas RW). - Should Have (S): Kebutuhan penting bernilai guna tinggi yang tidak bersifat kritis pada peluncuran perdana (misal: ekspor laporan berformat CSV/PDF, filter rentang tanggal, pembatasan upaya login). - Could Have (C): Kebutuhan tambahan atau nilai tambah yang dikerjakan apabila terdapat ketersediaan waktu dan sumber daya (misal: integrasi gerbang pembayaran QRIS otomatis). - Won’t Have / Would like (W): Fitur yang disepakati untuk dikesampingkan dari ruang lingkup proyek saat ini (misal: integrasi kamera pengawas/CCTV dan inventaris sarana prasarana fisik).
2.2.4.	Teori Data dan Kependudukan
Data dan Kependudukan memaparkan teori yang mendasari modul pengelolaan data warga sebagai sumber informasi utama sistem. Secara konseptual, data kependudukan dikelola sebagai aset organisasi yang kualitasnya meliputi keakuratan, kelengkapan, konsistensi, dan aksesibilitas dijaga melalui mekanisme validasi isian serta pemanfaatan basis data terpusat. Untuk mendukung hal tersebut, perancangan sistem menggunakan Sistem Manajemen Basis Data (DBMS) relasional dengan pendekatan Entity Relationship Model (ERD) dan normalisasi guna mencegah redundansi. Basis data ini menstrukturkan entitas kewilayahan secara hierarkis, yakni dari tingkat RW, RT, Kartu Keluarga (KK), hingga warga, dengan pengamanan integritas data melalui kunci primer dan perekaman riwayat perubahan.
2.2.5.	Teori UI/UX & Interaksi
User Interface (UI) dan User Experience (UX) merupakan dua komponen utama yang berinteraksi secara sinergis dalam menentukan efektivitas, kegunaan, serta keberhasilan penerapan suatu sistem informasi digital. User Interface berfokus pada elemen tata letak visual, konsistensi warna, hirarki tipografi, dan navigasi yang bertindak sebagai jembatan komunikasi visual antara manusia dan sistem. Di sisi lain, User Experience mencakup aspek emosional, respons kognitif, serta tingkat kepuasan subjektif pengguna ketika berinteraksi dan menyelesaikan tugas tertentu di dalam produk digital. Sebagaimana dijelaskan oleh Windrianto dan Suryani (2025), penerapan metodologi desain antarmuka berbasis kebutuhan pengguna mampu menyelaraskan kebutuhan fungsionalitas sistem dengan kenyamanan operasional pengguna. Hal ini diperkuat oleh studi Ramadhana et al. (2025) yang menegaskan bahwa integrasi UI/UX yang tepat terbukti secara signifikan dapat meningkatkan aksesibilitas, kemudahan navigasi, serta meminimalkan beban kognitif pengguna (learning curve) saat mengoperasikan platform digital.
Sementara itu, Interaction Design (IxD) atau desain interaksi bertindak sebagai fondasi operasional yang mengatur bagaimana sistem merespons setiap bentuk tindakan dan masukan dari pengguna secara intuitif. Konsep interaksi ini mendasarkan diri pada alur kerja (workflow) yang logis, pemberian umpan balik (feedback) secara waktu nyata, penyediaan kemudahan navigasi, serta penerapan keteraturan pola untuk mencegah kesalahan penggunaan (error prevention). Dalam konteks aplikasi layanan dan pengelolaan data administrasi, arsitektur interaksi yang terstruktur secara teratur memungkinkan pengguna menyelesaikan transaksi tanpa hambatan teknis. Sebagaimana dijelaskan oleh Alja et al. (2025), perancangan antarmuka dan pola interaksi yang adaptif terbukti secara signifikan meningkatkan efisiensi operasional sistem serta mempercepat waktu penyelesaian tugas (task completion rate). Hal ini sejalan dengan temuan Nurhasanah dan Kusumadiarti (2024) yang menyatakan bahwa optimalisasi desain interaksi yang terstruktur secara metodologis berhasil memperjelas penyampaian informasi dan meningkatkan kepuasan pengguna secara menyeluruh.
2.2.6.	Software Engineering & Pemodelan Sistem (UML & ERD)
2.2.6.1.	Software Engineering dan Arsitektur Sistem
Software Engineering merupakan pendekatan sistematis dalam rekayasa perangkat lunak yang mencakup tahapan analisis kebutuhan, perancangan, implementasi modular, pengujian, dan pemeliharaan (Pressman & Maxim, 2020). Arsitektur perangkat lunak membagi sistem ke dalam lapisan-lapisan yang memiliki tanggung jawab terisolasi (separation of concerns), meliputi lapisan penyajian (presentation layer), lapisan logika bisnis (application layer), lapisan keamanan/autentikasi (auth layer), dan lapisan persistensi data (data layer).
2.2.6.2.	Unified Modeling Language (UML)
UML digunakan sebagai bahasa visual standar untuk memodelkan rancangan sistem berorientasi objek (Booch et al., 2005): 1. Use Case Diagram: Memvisualisasikan fungsionalitas sistem dan interaksi antara kelompok aktor (Admin RW, Pengurus RT, Bendahara, Warga) dengan kapabilitas aplikasi. 2. Activity Diagram: Menggambarkan alur kerja prosedural sistem, percabangan logika (decision points), serta pembagian aksi antarperan (swimlanes). 3. Class Diagram: Menjelaskan struktur statis perangkat lunak yang mencakup kelas-kelas model, atribut data, metode operasi, serta hubungan relasi antarentitas. 4. Sequence Diagram: Memodelkan interaksi dinamis dan pertukaran pesan antarobjek sistem berdasarkan urutan waktu operasional.
2.2.6.3.	Entity Relationship Diagram (ERD)
ERD memodelkan struktur data konseptual dan logis sistem melalui entitas, atribut penjelas, serta derajat relasi kardinalitas (Chen, 1976). Melalui tahapan perancangan ERD yang dinormalisasi hingga bentuk normal ketiga (3NF), integritas referensial antarentitas (warga, kartu_keluarga, rt, transaksi_kas, iuran_warga, pengumuman) dapat terjamin bebas dari anomali pembaruan dan redundansi data.
2.2.7.	Tech Stack & Pengujian Sistem (SvelteKit, SQLite, Black Box, UAT/SUS)
2.2.7.1.	Framework Pengembangan: SvelteKit dan Svelte 5
SvelteKit merupakan framework web full-stack modern yang berjalan dengan basis kompilasi compile-time. Menggunakan Svelte 5 dengan paradigma runes ($state, $derived, $effect), framework ini mengeliminasi kebutuhan Virtual DOM dan menghasilkan kode JavaScript minimal berkecepatan tinggi. SvelteKit memfasilitasi Server-Side Rendering (SSR), perutean berbasis struktur berkas (filesystem routing), serta Server Actions untuk pemrosesan formulir aman di sisi server.
2.2.7.2.	Basis Data & ORM: SQLite, Turso/LibSQL, dan Drizzle ORM
•	SQLite & Turso/LibSQL: Mesin basis data relasional mandiri (serverless) berstandar ACID. SQLite menyediakan efisiensi penyimpanan berbasis berkas tunggal (file:local.db) untuk lingkungan lokal, serta kemampuan replikasi terdistribusi melalui Turso/LibSQL untuk lingkungan produksi tanpa beban pemeliharaan infrastruktur yang rumit. 
•	Drizzle ORM: Pustaka ORM TypeScript type-safe yang menghubungkan kode aplikasi dengan basis data. Drizzle menyusun kueri berparameter (parameterized queries) secara otomatis guna mencegah risiko serangan SQL Injection, serta menyediakan alat migrasi skema terkelola (Drizzle Kit).
2.2.7.3.	Verifikasi Fungsional: Black Box Testing
Black Box Testing mengevaluasi fungsionalitas perangkat lunak dari perspektif eksternal tanpa menguji struktur kode internal (Pressman & Maxim, 2020). Pengujian menerapkan: 1. Equivalence Partitioning & Boundary Value Analysis: Menguji keabsahan masukan formulir pada rentang nilai valid dan tidak valid (contoh: validasi tepat 16 digit pada NIK dan No. KK). 2. State Transition Testing: Memverifikasi ketepatan perubahan status data sesuai alur bisnis yang dirancang (contoh: perubahan status pembayaran iuran dari Belum Bayar menjadi Lunas).
2.2.7.4.	Validasi Pengguna: User Acceptance Testing (UAT) & System Usability Scale  (SUS)
UAT dilakukan dengan melibatkan pengguna pemangku kepentingan langsung (pengurus RW/RT dan perwakilan warga) untuk memastikan keselarasan fungsionalitas sistem dengan kebutuhan lapangan. Aspek kegunaan diukur menggunakan instrumen standar System Usability Scale (SUS) (Brooke, 1996), yang memuat 10 pertanyaan baku dengan skala Likert 1–5 untuk menghasilkan skor kuantitatif usability berskala 0–100.
2.3.	Teori Keamanan
2.3.1.	Keamanan Data dan Pelindungan Data Pribadi
Keamanan informasi secara konseptual bertumpu pada tiga properti utama, yaitu kerahasiaan (confidentiality), integritas (integrity), dan ketersediaan (availability) yang dikenal sebagai CIA triad (ISO/IEC, 2022). Pada Sistem Informasi RW, ketiga aspek ini berhubungan langsung dengan tata kelola data warga: - Kerahasiaan: Menjamin bahwa data sensitif seperti Nomor Induk Kependudukan (NIK), Nomor Kartu Keluarga (No. KK), serta alamat warga tidak dapat diakses oleh pihak yang tidak berwenang. - Integritas: Memastikan bahwa data kependudukan maupun transaksi kas tidak diubah tanpa otorisasi yang sah. - Ketersediaan: Menjamin data dapat diakses oleh pengurus RW/RT saat dibutuhkan untuk keperluan administrasi warga.
Berdasarkan Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP), data kependudukan serta data iuran warga tergolong sebagai Data Pribadi yang wajib dilindungi. UU PDP mengklasifikasikan data pribadi menjadi data umum (seperti nama lengkap dan jenis kelamin) serta data spesifik (seperti data keuangan pribadi) yang memerlukan tingkat perlindungan lebih ketat. Dalam konteks ini, pengurus RW bertindak sebagai Pengendali Data Pribadi yang berkewajiban menerapkan kontrol teknis seperti pembatasan akses (need-to-know), minimisasi data, dan penyamaran (masking) data untuk mencegah kegagalan pelindungan data pribadi warga.
2.3.2.	Autentikasi dan Manajemen Sesi
Dalam mendukung aspek autentikasi dan manajemen sesi, sistem mengidentifikasi serta memverifikasi pengguna sebelum memberikan hak akses. Pada arsitektur aplikasi web modern, identitas pengguna yang terautentikasi dipertahankan melalui sesi (session) berbasis cookie yang dilindungi atribut HttpOnly untuk mencegah pembacaan oleh skrip jahat, atribut Secure untuk menjamin transmisi terenkripsi, serta SameSite guna membatasi pengiriman lintas situs (Barth, 2011). Penyimpanan kata sandi dalam basis data wajib diolah menggunakan fungsi turunan kunci (key derivation function) berbantuan salt seperti scrypt atau bcrypt guna mempersulit serangan brute-force apabila terjadi kebocoran basis data (NIST, 2017). Pada rancangan sistem ini, pengurusan autentikasi memanfaatkan pustaka Better Auth yang terintegrasi dengan framework SvelteKit. Pembacaan sesi dilakukan secara terpusat pada setiap request melalui berkas hooks.server.ts dan disimpan ke dalam event.locals sebagai dasar verifikasi otorisasi pada lapisan aplikasi.
2.3.3.	Role-Based Access Control
Otorisasi dan pembatasan hak akses ditegakkan menggunakan model Role-Based Access Control (RBAC) yang mengaitkan izin akses dengan peran (role) tertentu, bukan pengguna secara individual (Sandhu et al., 1996). Sistem mendefinisikan empat peran utama yang mencerminkan struktur organisasi RW, yaitu admin_rw, pengurus_rt, bendahara, dan warga. Kewenangan tiap peran diatur dalam matriks operasi (create, read, update, delete) pada berbagai modul sistem, dengan penerapan prinsip least privilege dan defence in depth. Penegakan kontrol akses dilakukan secara berlapis, mulai dari pemeriksaan route guard terpusat pada guard.ts, pemeriksaan ulang pada lapisan layout, hingga pengecekan izin di tingkat action dengan menerapkan prinsip fail-closed agar nilai peran yang tidak valid otomatis ditolak.
2.3.4.	Keamanan Aplikasi Web
Sebagai landasan keamanan aplikasi web secara menyeluruh, perancangan sistem mengacu pada standar Open Worldwide Application Security Project (OWASP) Top 10. Kerentanan utama seperti Broken Access Control ditangani melalui otorisasi berlapis di sisi server. Risiko Injection dicegah dengan memanfaatkan Drizzle ORM yang membangun parameterized queries sehingga masukan pengguna tidak dieksekusi sebagai perintah SQL. Seluruh masukan formulir divalidasi dan disanitasi secara ketat di sisi server menggunakan skema Zod. Selain itu, potensi Cross-Site Scripting (XSS) dimitigasi oleh mekanisme escaping bawaan Svelte, kerentanan Cross-Site Request Forgery (CSRF) dicegah melalui pemeriksaan header Origin oleh SvelteKit, serta keamanan transportasi data dijamin oleh penerapan Transport Layer Security (TLS/HTTPS) (Rescorla, 2018).



 BAB III 
SPESIFIKASI DAN MEKAINSME PERANCANGAN
3.1.	Batasan Realistis
Perancangan dan implementasi Sistem Informasi RW ini dibatasi oleh beberapa batasan realistis sebagai berikut:
1)	Batasan waktu
Pengerjaan proyek ini dilakukan dalam satu semester sesuai kurikulum program studi, sehingga waktu yang tersedia untuk analisis, perancangan, implementasi, dan pengujian bersifat terbatas. Tidak seluruh fitur yang diidentifikasi dalam analisis kebutuhan dapat diselesaikan dalam periode ini.
2)	Batasan aksesibilitas mitra. 
Mitra RW tidak dapat diwawancarai secara intensif dalam rentang waktu capstone ini, sehingga validasi kebutuhan fitur mengacu pada analisis regulasi resmi (UU No. 6 Tahun 2014, Permendagri No. 18 Tahun 2018) dan evaluasi plausibility sebagai pengganti data primer dari wawancara.
3)	Batasan teknologi
Sistem menggunakan SQLite sebagai basis data dengan pendekatan single-file yang tidak dirancang untuk skala distributed atau beban konkurensi tinggi. Belum tersedia infrastruktur server produksi yang bersifat permanen untuk deployment publik.
4)	Batasan anggaran
Tidak tersedia anggaran untuk layanan hosting berbayar atau akses payment gateway production, sehingga fitur pembayaran digital (QRIS) masih berada dalam tahap perancangan dan belum diintegrasikan secara penuh ke dalam sistem.
5)	Batasan scope fitur
Hanya fitur Core MVP yang dikerjakan dalam proyek ini, yaitu manajemen data kependudukan, kas RW, iuran warga, dan pengumuman/informasi. Fitur-fitur di luar scope — termasuk surat-menyurat, manajemen CCTV, inventaris, dan manajemen pengurus — tidak termasuk dalam cakupan pengerjaan.
6)	Batasan pengujian
Pengujian sistem dilakukan secara terbatas pada lingkungan kelompok capstone dan mitra, bukan deployment publik skala penuh. Hasil pengujian tidak dapat sepenuhnya merepresentasikan kondisi penggunaan nyata di lapangan.
3.2.	Standar Keteknikan
Pada subbab acuan regulasi dan standar keteknikan sistem, ditambahkan landasan hukum kelembagaan kemasyarakatan dan tata kelola kependudukan:
3.2.1.	Regulasi Penyelenggaraan Lembaga Kemasyarakatan dan Kependudukan
1)	Undang-Undang Nomor 6 Tahun 2014 tentang Desa (dan PP No. 43 Tahun 2014):
Mengatur kedudukan hukum Rukun Warga sebagai Lembaga Kemasyarakatan yang membantu penyelenggaraan pelayanan administrasi dan pemberdayaan masyarakat. 
2)	Peraturan Menteri Dalam Negeri Nomor 18 Tahun 2018 tentang Lembaga Kemasyarakatan Desa dan Lembaga Adat Desa:
Pasal 7 ayat (1) menegaskan fungsi resmi RW dalam pendataan kependudukan, pemeliharaan ketertiban, penyaluran aspirasi, serta penggerak gotong royong dan swadaya masyarakat. 
3)	Undang-Undang Nomor 24 Tahun 2013 tentang Administrasi Kependudukan:
Menetapkan perlindungan data pribadi kependudukan warga (NIK dan KK) yang mewajibkan keandalan penyimpanan dan pembatasan akses data. 
4)	Peraturan Presiden Nomor 95 Tahun 2018 tentang Sistem Pemerintahan Berbasis Elektronik (SPBE):
Mendorong digitalisasi tata kelola layanan publik yang bersih, efektif, transparan, dan terintegrasi. 
5)	Peraturan Wali Kota Bekasi Nomor 58 Tahun 2020 tentang Rukun Tetangga dan Rukun Warga:
Memberikan landasan operasional lokal mengenai struktur organisasi, hierarki pertanggungjawaban dana lingkungan, dan hubungan kerja kemasyarakatan di wilayah Kota Bekasi.
3.2.2.	Regulasi dan Standar Keamanan Informasi
1)	Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)
Mengklasifikasikan data pribadi menjadi data umum dan spesifik (Pasal 4), di mana data keuangan tergolong data spesifik. Mengatur kewajiban Pengendali Data Pribadi untuk menjamin keamanan pemrosesan data (Pasal 35), mencegah akses yang tidak sah (Pasal 39), serta memberikan pemberitahuan tertulis jika terjadi kegagalan pelindungan data (Pasal 46). - Penerapan pada Sistem: Akses data kependudukan dibatasi menggunakan model Role-Based Access Control (RBAC), data NIK dan Nomor Kartu Keluarga (KK) disamarkan (masking) pada daftar antarmuka, setiap perubahan data sensitif mencatat jejak audit (dicatatOleh dan timestamp), serta kata sandi tidak disimpan dalam bentuk teks asli.
2)	ISO/IEC 27001:2022 (Information Security Management System)
Mengacu pada kontrol keamanan informasi Annex A, khususnya A.5.15 (Access Control) untuk aturan hak akses logis berdasarkan kebutuhan operasional, dan A.8.24 (Use of Cryptography) untuk aturan kriptografi dan pengelolaan kunci. Didukung oleh kontrol pendukung seperti A.5.17 (informasi autentikasi), A.8.5 (autentikasi aman), A.8.11 (data masking), A.8.15 (logging), serta A.8.13 (backup). - Penerapan pada Sistem: Penerapan matriks RBAC dengan empat peran utama via permissions.ts dan guard.ts (A.5.15), enkripsi TLS untuk data bergerak serta hashing kata sandi melalui Better Auth (A.8.24), batasan durasi sesi berbasis cookie (A.8.5), dan penyamaran tampilan NIK/KK (A.8.11).
3)	Open Worldwide Application Security Project (OWASP) Top 10 (2021)
Acuan sepuluh kategori risiko keamanan aplikasi web paling kritis guna memitigasi celah kerentanan utama. - Penerapan pada Sistem: * A01 Broken Access Control: Dikelola via proteksi berlapis pada hooks.server.ts, layout, serta penegakan izin per aksi dengan prinsip fail-closed. * A02 Cryptographic Failures: Penggunaan TLS/HTTPS dan enkripsi hash kata sandi. * A03 Injection & XSS: Pembuatan kueri berparameter menggunakan Drizzle ORM, validasi skema masukan di sisi server via Zod, dan escaping keluaran templat bawaan Svelte. * A07 Identification & Authentication Failures: Penggunaan pustaka Better Auth, batas waktu sesi, serta mekanisme rate limiting. * A05 Security Misconfiguration: Penyimpanan variabel rahasia dan kunci autentikasi di dalam file variabel lingkungan (.env) yang diisolasi dari repositori.
Tabel 2 Realisasi sistem dengan standar regulasi
Standar / Regulasi	Butir / Kontrol	Realisasi Pada Sistem
UU PDP No. 27/2022	Keamanan & pencegahan akses tidak sah	RBAC, route guard, penyamaran (masking) PII
ISO/IEC 27001:2022	A.5.15 Access Control	permissions.ts, guard.ts, matriks 4 peran
ISO/IEC 27001:2022	A.8.24 Cryptography	Enkripsi TLS/HTTPS, hashing kata sandi (scrypt)
OWASP Top 10 (2021)	A01 Broken Access Control	enforceAccess, requireRole pada server actions
OWASP Top 10 (2021)	A03 Injection & XSS	Parameterized queries Drizzle ORM, Zod schema validation, Svelte escaping

3.3.	Spesifikasi Rancangan
3.3.1.	Spesifikasi Kependudukan & Keuangan
Modul kependudukan menjadi sumber data warga yang terpusat bagi pengurus RW, pengurus RT, dan warga RW 06, sekaligus mendukung fitur lain seperti surat-menyurat dan iuran. Strukturnya mengikuti hierarki RW, RT, kartu keluarga (KK), dan warga menurut Peraturan Wali Kota Bekasi Nomor 58 Tahun 2020, yaitu satu RT terdiri atas 30 sampai 100 KK (Pasal 10 ayat (1)) dan satu RW terdiri atas 5 sampai 25 RT (Pasal 14), sehingga sistem harus mampu menampung sedikitnya 2.500 KK. Data warga yang wajib diisi meliputi NIK, nama, tanggal lahir, nomor KK, alamat, RT, dan status tinggal. NIK dan nomor KK harus terdiri atas 16 digit dan tidak boleh duplikat, sedangkan usia dihitung otomatis dari tanggal lahir. Data tidak dihapus permanen, melainkan dinonaktifkan, dan setiap perubahan serta peristiwa kependudukan dicatat dalam riwayat. Data awal dapat diimpor dari berkas CSV atau XLSX, warga dapat mengajukan pembaruan data yang berlaku setelah disetujui pengurus, dan akses dibatasi menurut peran.
Modul keuangan mencakup pengelolaan kas RW dan iuran warga. Peraturan yang sama menyebutkan bahwa pembiayaan RT dan RW dapat bersumber dari swadaya masyarakat dan bantuan yang sah (Pasal 30 ayat (1)), serta mewajibkan pengelolaan keuangan yang tertib, transparan, dan akuntabel (Pasal 31). Karena itu, setiap transaksi kas dicatat lengkap beserta kategori dan pencatatnya, saldo dihitung otomatis, dan koreksi dilakukan melalui pembatalan dengan alasan, bukan penghapusan. Hanya bendahara yang berhak mengubah data kas, dan laporan keuangan per periode dapat diunduh dalam format PDF dan XLSX. Tagihan iuran diterbitkan bagi KK aktif, dan pembayaran tunai otomatis tercatat sebagai pemasukan kas tanpa input ganda. Pembayaran nontunai melalui QRIS dirancang dengan syarat disetujui mitra dan tersedia penyedia jasa pembayaran. Warga dapat melihat riwayat iuran KK sendiri, dan sistem tidak menyediakan tagihan untuk pengurusan dokumen kependudukan sesuai Undang-Undang Nomor 24 Tahun 2013 Pasal 79A.
3.3.2.	Spesifikasi UI/UX & Flow
1)	Spesifikasi Antarmuka (User Interface Specification)
a.	Platform dan Responsivitas
Sistem dibuat berbasis web dan dirancang agar dapat digunakan pada berbagai ukuran layar. Sistem dapat diakses melalui komputer, laptop, maupun smartphone. Penggunaan melalui smartphone lebih ditujukan untuk warga, sedangkan komputer atau laptop dapat digunakan oleh pengurus dalam mengelola data dan proses administrasi.
Tampilan sistem dibuat responsif sehingga susunan dan ukuran komponen dapat menyesuaikan dengan perangkat yang digunakan.
b.	Design System, Palet Warna dan Tipografi
Untuk menjaga tampilan tetap konsisten, sistem menggunakan design system sederhana yang mencakup warna, jenis huruf, ukuran teks, tombol, dan komponen lainnya.
Warna utama digunakan pada bagian-bagian yang membutuhkan perhatian pengguna, seperti tombol utama dan navigasi. Warna pendukung digunakan untuk membedakan informasi atau status tertentu. Untuk tipografi, sistem menggunakan font Inter agar teks dapat terlihat jelas dan nyaman dibaca.
c.	Komponen Antarmuka
Beberapa komponen yang digunakan dalam perancangan antarmuka antara lain card, tabel, formulir, tombol, modal, dropdown, badge, dan notifikasi.
Card digunakan untuk menampilkan informasi tertentu secara terpisah. Tabel digunakan untuk menampilkan data yang memiliki banyak informasi, seperti data warga dan data iuran. Formulir digunakan untuk memasukkan data dan melakukan pengajuan surat. Modal digunakan untuk memberikan konfirmasi sebelum melakukan tindakan tertentu, seperti menghapus data. Sedangkan badge dan notifikasi digunakan untuk memberikan informasi mengenai status atau perubahan data.
2)	Spesifikasi Pengalaman Pengguna (User Experience & Interaction Specification)
a.	Navigasi dan Hirarki Informasi
Navigasi sistem dibuat sederhana agar pengguna dapat menemukan fitur yang dibutuhkan dengan mudah. Fitur utama seperti Dashboard, Data Warga, Pengajuan Surat, dan Iuran ditempatkan pada bagian navigasi yang mudah ditemukan.
Informasi yang dianggap penting ditampilkan dengan jelas. Contohnya, status pengajuan surat ditampilkan pada halaman yang mudah diakses sehingga warga dapat mengetahui perkembangan pengajuannya tanpa harus membuka banyak halaman.
b.	Umpan Balik Interaksi (Feedback/Status)
Sistem memberikan informasi kepada pengguna setelah melakukan suatu tindakan. Informasi tersebut dapat berupa notifikasi berhasil atau gagal, indikator proses, maupun perubahan status.
Sebagai contoh, setelah warga mengirim pengajuan surat, sistem memberikan informasi bahwa pengajuan telah berhasil dikirim. Warga juga dapat melihat status pengajuan, seperti "Diproses", "Disetujui", atau "Ditolak".
c.	Pencegahan Kesalahan (Error Prevention)
Untuk mengurangi kesalahan dalam penggunaan sistem, setiap formulir diberikan validasi sesuai dengan jenis data yang dimasukkan. Contohnya, NIK harus terdiri dari 16 digit, nominal iuran hanya dapat diisi menggunakan angka, dan file yang diunggah harus sesuai dengan ketentuan yang ditentukan.
Selain itu, sistem memberikan konfirmasi sebelum pengguna melakukan tindakan tertentu, seperti menghapus data atau menyetujui pengajuan. Dengan cara tersebut, kesalahan akibat tindakan pengguna dapat dikurangi.
3)	Alur Sistem dan Interaksi (User Flow & Task Flow)
Alur sistem dibuat untuk menggambarkan langkah-langkah yang dilakukan pengguna dalam menjalankan fitur utama. Alur yang dirancang meliputi:
a.	Alur Pengajuan Surat oleh Warga
 
Gambar 3 Alur Pengajuan Surat oleh Warga
Warga melakukan login, memilih jenis surat, mengisi formulir dan mengunggah persyaratan, lalu mengirim pengajuan. Sistem menyimpan pengajuan tersebut dan meneruskannya kepada pengurus.
Pengurus menerima pengajuan, membuka detailnya, memeriksa data dan persyaratan, lalu melakukan verifikasi. Jika disetujui, sistem memperbarui status menjadi disetujui dan proses dilanjutkan sesuai alur administrasi surat, sehingga warga dapat memantau status dan mengunduh surat. Jika ditolak, sistem memperbarui status dan memberi notifikasi kepada warga, yang kemudian dapat memperbaiki pengajuan dan mengajukannya kembali.
b.	Alur Pembayaran Iuran melalui QRIS
 
Gambar 4 Alur Pembayaran Iuran melalui QRIS
Warga memilih tagihan iuran, melihat nominal tagihan beserta kode QRIS, lalu melakukan pembayaran melalui aplikasi pembayaran. Sistem memperbarui status pembayaran dan memeriksa apakah pembayaran telah terverifikasi. Apabila terverifikasi, status tagihan menjadi "Lunas". Apabila belum terverifikasi, tagihan tetap berstatus belum lunas dan warga dapat membayar ulang, sehingga proses kembali ke langkah pembayaran melalui aplikasi.
c.	Alur Pengelolaan Data Warga
 
Gambar 5 Alur Pengelolaan Data Warga
Pengurus membuka menu data warga, kemudian memilih untuk menambahkan data baru atau memilih data yang akan diubah. Pengurus mengisi atau memperbarui data, lalu menyimpannya. Sistem melakukan validasi terhadap data tersebut. Apabila data valid, data tersimpan pada database. Apabila data tidak valid, pengurus kembali memperbaiki isian data sebelum menyimpan ulang.
d.	Alur Pengelolaan Keuangan Kas RW
 
Gambar 6 Alur Pengelolaan Keuangan Kas RW
Proses dimulai ketika Bendahara mengakses dan membuka menu kas RW pada sistem. Bendahara kemudian memilih jenis transaksi yang akan dicatat, baik itu pemasukan maupun pengeluaran, lalu mengisi detail informasi transaksi tersebut. 
Setelah data dimasukkan, sistem secara otomatis melakukan validasi terhadap data transaksi yang diinputkan. Jika data transaksi dinilai tidak valid (misalnya terdapat kesalahan input atau format tidak sesuai), sistem akan mengembalikan alur ke tahap pengisian transaksi agar Bendahara dapat memperbaiki isian data tersebut. 
Sebaliknya, jika data dinyatakan valid, sistem akan langsung menyimpan catatan transaksi tersebut ke dalam database, menghitung ulang akumulasi total saldo kas RW, dan merekam aktivitas pencatatan ke dalam audit trail. Setelah seluruh proses pencatatan selesai dilakukan oleh sistem, Bendahara dapat melihat pembaruan saldo beserta laporan kas RW terbaru.
3.3.3.	Spesifikasi Keamanan dan Akses
1.	Persyaratan Keamanan Data dan Aplikasi

Tabel 3 Persyaratan Keamanan Data dan Aplikasi
ID	Deskripsi Kebutuhan Non-Fungsional	Prioritas
NFRS-01	Kata sandi pengguna harus disimpan dalam bentuk hash dengan fungsi turunan kunci yang diterapkan Better Auth (scrypt), tidak boleh tersimpan sebagai teks asli.	Must
NFRS-02	Seluruh lalu lintas antara klien dan server pada lingkungan produksi harus memakai HTTPS (TLS 1.2 atau lebih baru).	Must
NFRS-03	Seluruh masukan formulir harus divalidasi di sisi server dengan skema Zod (tipe, panjang, format, dan nilai yang diizinkan). Masukan yang tidak valid ditolak dengan pesan galat dalam Bahasa Indonesia.	Must
NFRS-04	NIK dan No. KK harus divalidasi sebagai 16 digit angka.	Must
NFRS-05	Kueri basis data harus berparameter melalui Drizzle ORM. Tidak diperbolehkan menyusun kueri dengan penggabungan string dari masukan pengguna.	Must
NFRS-06	Kredensial dan rahasia (token basis data, rahasia autentikasi) harus disimpan di variabel lingkungan (.env) dan tidak boleh masuk ke repositori.	Must
NFRS-07	Sistem harus melindungi pengiriman formulir dari CSRF dan menjaga cookie sesi dengan atribut HttpOnly, Secure(produksi), dan SameSite	Must
NFRS-08	Data pribadi nyata tidak boleh dimasukkan ke data uji. Data uji memakai penanda seperti "Contoh Warga 1"	Must
NFRS-09	Sistem harus membatasi percobaan masuk yang gagal secara berulang (rate limiting)	Should
NFRS-10	Setiap transaksi kas dan pembayaran iuran harus mencatat pengguna pencatat dan waktu pencatatan sebagai jejak audit	Should
NFRS-11	Basis data dicadangkan secara berkala.	Should
NFRS-12	Enkripsi level field untuk NIK dan No. KK di basis data	Could

2.	Persyaratan Akses dan Sesi

Tabel 4 Persyaratan Akses dan Sesi
ID	Deskripsi Kebutuhan Non-Fungsional	Prioritas
NFRA-01	Sistem menerapkan RBAC dengan empat peran: admin_rw, pengurus_rt, bendahara, warga. Matriks izin didefinisikan di satu tempat (permissions.ts)	Must
NFRA-02	Pemeriksaan akses dilakukan di sisi server pada seluruh permintaan (hooks.server.ts) dan diperiksa ulang di layoutgrup rute (defence in depth)	Must
NFRA-03	Izin ditegakkan per aksi (create/read/update/delete) sesuai matriks, tidak hanya per grup rute. Contohnya, bendaharahanya membaca data warga dan pengurus_rt tidak dapat menghapus pengumuman	Must
NFRA-04	Peran yang tidak dikenal atau tidak valid tidak diberi akses (fail-closed)	Must
NFRA-05	Pengguna ber-peran warga yang membuka rute staf diarahkan ke portal warga (/portal) tanpa menampilkan galat 403. Peran staf yang tidak berhak atas suatu rute menerima 403. Otorisasi tetap ditegakkan di server	Must
NFRA-06	Pengguna tanpa sesi yang mengakses rute terlindungi diarahkan ke halaman masuk	Must
NFRA-07	engguna warga hanya dapat melihat data iuran dan pembayaran miliknya sendiri, bukan data warga lain	Must
NFRA-08	Pembuatan akun dan penetapan peran hanya dilakukan oleh admin_rw. Peran bawaan akun baru adalah warga (least privilege)	Must
NFRA-09	Sesi pengguna berakhir otomatis setelah periode tidak aktif yang ditetapkan (target awal 60 menit, disesuaikan setelah wawancara)	Should
NFRA-10	NIK dan No. KK disamarkan pada tampilan daftar. Nilai utuh hanya ditampilkan pada halaman detail untuk peran yang berwenang (admin_rw dan pengurus_rt wilayahnya). Contoh: 3275••••••••0001	Should

3.	Matriks Role-Based Access Control (RBAC)

Tabel 5 Matriks Role-Based Access Control (RBAC)
Modul / Sumber Daya	admin_rw	pengurus_rt	bendahara	warga
Warga & KK	C, R, U, D	C, R, U,R*	R	N/A
RT & RW	R, U	R,R	R	N/A
Pengumuman	C, R, U, D	R	R	R
Iuran	C, R, U, D	R	C, R, U, D	R*
Kas	C, R, U, D	R	C, R, U, D	N/A
Pengurus	C, R, U, D	R	R	N/A
Surat	C, R, U, D	C, R, U,R*	R
	C, R*

Keterangan:
C = Create, R = Read, U = Update, D = Delete, N/A = No Access.
R* / C* = Akses terbatas pada wilayah RT/RW bersangkutan atau data milik pribadi pengguna.
3.3.4.	Spesifikasi Fungsional
Spesifikasi fungsional menjabarkan fungsi-fungsi utama yang harus disediakan oleh sistem untuk setiap modul. Spesifikasi ini menjadi acuan dalam perancangan dan pengujian sistem.
Tabel 6 Spesifikasi Fungsional Modul Kependudukan
ID	Nama Fungsi	Deskripsi	Aktor
SF-KP-01	Tambah Data Warga	Pengurus dapat menambahkan data warga baru meliputi NIK, nama, tanggal lahir, nomor KK, alamat, dan status tinggal. Sistem memvalidasi format NIK 16 digit dan mencegah duplikasi.	admin_rw, pengurus_rt
SF-KP-02	Ubah Data Warga	Pengurus dapat memperbarui data warga yang sudah ada disertai alasan perubahan. Sistem mencatat jejak audit setiap perubahan secara otomatis.	admin_rw, pengurus_rt
SF-KP-03	Nonaktifkan Data Warga	Pengurus dapat menonaktifkan data warga (pindah, meninggal) tanpa penghapusan permanen. Status warga diperbarui beserta tanggal dan alasan.	admin_rw, pengurus_rt
SF-KP-04	Cari dan Saring Data Warga	Pengguna dapat mencari warga berdasarkan nama, NIK, nomor KK, atau RT. Hasil pencarian ditampilkan dalam waktu maksimal 3 detik pada volume 10.000 data.	admin_rw, pengurus_rt, bendahara
SF-KP-05	Lihat Profil Warga	Pengguna dapat melihat detail data warga termasuk riwayat perubahan data. NIK dan nomor KK disamarkan pada tampilan daftar dan hanya ditampilkan utuh pada halaman detail untuk peran yang berwenang.	admin_rw, pengurus_rt
SF-KP-06	Impor Data Warga	Admin dapat mengunggah data warga massal melalui berkas CSV atau XLSX. Sistem memvalidasi setiap baris dan melaporkan baris yang tidak valid tanpa menghentikan proses impor keseluruhan.	admin_rw
SF-KP-07	Rekap Demografis	Sistem menghasilkan laporan rekapitulasi demografis warga (jumlah per RT, status tinggal, rentang usia) yang dapat diekspor ke format CSV.	admin_rw
SF-KP-08	Pengajuan Pembaruan Data oleh Warga	Warga dapat mengajukan pembaruan data kependudukan melalui sistem. Pengajuan berstatus Diajukan, Diverifikasi, Disetujui, atau Ditolak, dan harus disetujui pengurus sebelum perubahan diterapkan.	warga

Tabel 7 Spesifikasi Fungsional Modul Surat-Menyurat
ID	Nama Fungsi	Deskripsi	Aktor
SF-SR-01	Ajukan Surat	Warga dapat mengajukan permohonan surat (SKCK, SKTM, keterangan domisili, dan jenis lainnya) melalui sistem. Formulir pengajuan disesuaikan dengan jenis surat, dan data kependudukan warga diisi otomatis dari modul kependudukan.	Warga, pengurus_rt
SF-SR-02	Unggah Persyaratan	Warga dapat mengunggah dokumen persyaratan yang dibutuhkan untuk setiap jenis surat. Sistem memvalidasi format dan ukuran berkas yang diunggah.	Warga, pengurus_rt
SF-SR-03	Pantau Status Pengajuan	Warga dapat memantau status pengajuan surat secara real-time melalui halaman riwayat pengajuan tanpa perlu menghubungi pengurus.	Warga
SF-SR-04	Verifikasi Pengajuan	Pengurus memeriksa kelengkapan data dan dokumen persyaratan pengajuan. Pengurus dapat mengubah status pengajuan menjadi Diverifikasi atau Ditolak disertai catatan alasan.	Admin_rw, pengurus_rt
SF-SR-05	Setujui dan Terbitkan Surat	Admin RW menyetujui pengajuan yang telah diverifikasi dan menerbitkan surat. Sistem mencatat nomor surat, tanggal penerbitan, dan menyimpan riwayat surat secara permanen.	Admin_rw
SF-SR-06	Unduh Surat	Warga dapat mengunduh surat yang telah diterbitkan dalam format PDF setelah pengajuan disetujui.	Warga
SF-SR-07	Lihat Riwayat Surat	Pengurus dapat melihat seluruh riwayat pengajuan dan penerbitan surat beserta statusnya. Warga hanya dapat melihat riwayat pengajuan miliknya sendiri.	Admin_rw, pengurus_rt, warga

Tabel 8 Spesifikasi Fungsional Modul Keuangan (Kas RW)
ID	Nama Fungsi	Deskripsi	Aktor
SF-KS-01	Catat Pemasukan	Bendahara dapat mencatat transaksi pemasukan kas RW meliputi sumber dana, nominal, tanggal, dan keterangan. Sistem memperbarui saldo kas secara otomatis.	admin_rw, bendahara
SF-KS-02	Catat Pengeluaran	Bendahara dapat mencatat transaksi pengeluaran kas RW meliputi kategori pengeluaran, nominal, tanggal, bukti transaksi, dan keterangan. Sistem memperbarui saldo kas secara otomatis.	admin_rw, bendahara
SF-KS-03	Unggah Bukti Transaksi	Bendahara dapat mengunggah berkas bukti transaksi (foto kuitansi, nota) untuk setiap entri transaksi.	admin_rw, bendahara
SF-KS-04	Lihat Saldo Kas	Pengguna yang berwenang dapat melihat saldo kas RW terkini beserta ringkasan transaksi terakhir pada dasbor.	admin_rw, bendahara
SF-KS-05	Laporan Keuangan Per Periode	Sistem menghasilkan laporan keuangan berisi ringkasan pemasukan, pengeluaran, dan saldo berdasarkan periode yang dipilih (bulanan, tahunan). Laporan dapat diekspor ke format CSV atau PDF.	admin_rw, bendahara
SF-KS-06	Audit Trail Transaksi	Setiap transaksi mencatat identitas pengguna yang mencatat dan waktu pencatatan. Riwayat transaksi tidak dapat dihapus, hanya dapat dilakukan koreksi dengan mencatat alasan.	admin_rw

Tabel 9 Spesifikasi Fungsional Modul Iuran Warga
ID	Nama Fungsi	Deskripsi	Aktor
SF-IU-01	Kelola Jenis Iuran	Admin dapat membuat, mengubah, dan menonaktifkan jenis iuran (iuran bulanan, keamanan, kebersihan, dll.) beserta nominal dan periode pembayaran.	admin_rw, bendahara
SF-IU-02	Buat Tagihan Iuran	Sistem dapat membuat tagihan iuran untuk seluruh warga aktif atau kelompok tertentu secara massal berdasarkan jenis iuran yang telah dikonfigurasi.	admin_rw, bendahara
SF-IU-03	Catat Pembayaran Manual	Bendahara dapat mencatat pembayaran iuran yang diterima secara tunai atau transfer manual beserta tanggal dan metode pembayaran.	admin_rw, bendahara
SF-IU-04	Pembayaran via QRIS	Warga dapat melakukan pembayaran iuran melalui kode QRIS yang ditampilkan sistem. Status tagihan diperbarui otomatis setelah konfirmasi dari payment gateway diterima.	warga
SF-IU-05	Lihat Status Iuran	Warga dapat melihat daftar tagihan iuran miliknya beserta status pembayaran (Belum Bayar, Lunas) dan riwayat pembayaran.	warga
SF-IU-06	Rekap Pembayaran Iuran	Sistem menghasilkan rekap pembayaran iuran per periode yang menampilkan status pembayaran seluruh warga. Rekap dapat diekspor ke format CSV.	admin_rw, bendahara

Tabel 10 Spesifikasi Fungsional Modul Pengumuman dan Informasi
ID	Nama Fungsi	Deskripsi	Aktor
SF-PG-01	Buat Pengumuman	Admin atau pengurus yang berwenang dapat membuat pengumuman baru meliputi judul, isi, kategori (kegiatan, jadwal, informasi umum), dan tanggal mulai serta berakhir tampil.	admin_rw
SF-PG-02	Ubah dan Arsipkan Pengumuman	Admin dapat mengubah konten pengumuman yang sudah diterbitkan atau mengarsipkan pengumuman yang sudah tidak relevan tanpa penghapusan permanen.	admin_rw
SF-PG-03	Lihat Pengumuman	Seluruh pengguna yang sudah login dapat melihat daftar pengumuman aktif. Pengumuman ditampilkan berurutan berdasarkan tanggal terbaru.	admin_rw, pengurus_rt, bendahara, warga
SF-PG-04	Cari Pengumuman	Pengguna dapat mencari pengumuman berdasarkan kata kunci atau menyaring berdasarkan kategori dan rentang tanggal.	admin_rw, pengurus_rt, bendahara, warga
3.4.	 Batasan Asumsi
Perancangan Sistem Informasi RW ini didasarkan pada beberapa asumsi yang dianggap berlaku selama proses perancangan, sebagai berikut:
1.	Asumsi tentang struktur organisasi mitra. 
Struktur organisasi RW yang menjadi acuan adalah struktur umum yang terdiri atas ketua RW, sekretaris, bendahara, dan ketua RT di masing-masing unit. Struktur ini diasumsikan berlaku pada mitra tanpa penyesuaian yang signifikan, mengacu pada praktik umum di lingkungan RW Indonesia.
2.	Asumsi tentang literasi digital pengguna. 
Pengurus RW (admin, bendahara, ketua RT) diasumsikan memiliki literasi digital dasar yang memadai untuk mengoperasikan sistem berbasis web melalui browser. Warga diasumsikan memiliki perangkat smartphone dengan akses internet yang memungkinkan penggunaan portal warga secara mandiri.
3.	Asumsi tentang dasar regulasi. 
Tupoksi RW yang digunakan sebagai acuan penetapan fitur mengacu pada Permendagri No. 18 Tahun 2018 yang berlaku secara nasional. Diasumsikan tidak terdapat peraturan desa (Perdes), peraturan bupati (Perbup), atau peraturan wali kota (Perwali) pada wilayah mitra yang mengubah tupoksi RW secara substantif.
4.	Asumsi tentang kapasitas teknologi. 
SQLite dengan pendekatan penyimpanan single-file diasumsikan cukup untuk menangani volume data pada skala RW yang mencakup ratusan hingga ribuan record warga, transaksi kas, dan catatan iuran. QRIS diasumsikan secara prinsip tersedia dan dapat diintegrasikan melalui payment gateway pihak ketiga, meskipun provider spesifik dan mekanisme teknis integrasi belum dikonfirmasi pada tahap ini.
3.5.	 Mekanisme Perancangan
3.5.1.	Sistematika Perancangan
Sistematika perancangan Sistem Informasi RW dilaksanakan menggunakan pendekatan Kanban yang terintegrasi dengan GitHub Projects pada repositori kerja. Alur tahapan kerja dirancang sebagai aliran berkesinambungan (continuous flow):
1)	Pembentukan Product Backlog (Tahap Analisis): Kebutuhan sistem diuraikan menjadi kartu-kartu tugas terperinci (GitHub Issues) dan diklasifikasikan berdasarkan metode MoSCoW ke dalam papan Backlog.
2)	Perancangan Konseptual & Arsitektur (Tahap Desain): Tugas perancangan ERD, diagram UML, UI/UX, dan RBAC dipindahkan ke status Todo/Ready setelah kriteria spesifikasi disepakati.
3)	Pengembangan Fitur Inkremental (Continuous Flow Development): Tugas dikerjakan secara aktif pada kolom In Progress dengan batasan beban kerja (WIP limit). Kode dikembangkan pada cabang modular terpisah (feature branch).
4)	Peninjauan Kode & Verifikasi (Review & Testing): Pembuatan Pull Request memicu pemindahan kartu tugas ke kolom Review / Verification untuk menjalani code review dan pengujian fungsional Black Box.
5)	Penggabungan Fitur (Merge & Done): Tiket tugas yang lolos pengujian dan disetujui digabungkan ke cabang main dan dipindahkan ke status Done.
6)	Validasi Akhir & Evaluasi (Tahap UAT): Purwarupa fungsional diuji bersama pemangku kepentingan mitra dan dievaluasi kemudahan penggunaannya menggunakan instrumen SUS.
3.5.2.	Mekanisme Pengumpulan Data
Untuk memperoleh data perancangan yang valid dan sesuai dengan konteks operasional mitra, mekanisme pengumpulan data dilaksanakan secara sistematis melalui beberapa instrumen:
Tabel 11 Mekanisme pengumpulan data
No	Kategori Data	Metode Pengumpulan	Sumber / Objek	Keterangan & Tujuan
1	Tupoksi & Batasan Regulasi RW	Studi Dokumen & Regulasi	UU 6/2014, Permendagri 18/2018, Perwali Bekasi 58/2020	Mengidentifikasi ruang lingkup tugas resmi RW agar batasan modul sistem memiliki dasar kepatuhan hukum (legal compliance).
2	Alur Proses Bisnis & Tata Kelola	Observasi Faktual & Walkthrough	Pengurus RW 06 dan Catatan Administrasi Lingkungan	Mengamati proses pencatatan warga, tata kelola iuran bulanan, pembukuan kas, serta kendala penyebaran info via WhatsApp.
3	Struktur Data & Format Fisik	Studi Dokumentasi Berkas	Format Buku Register Warga, Buku Kas, Kuitansi Iuran	Menentukan skema entitas data kependudukan (NIK, KK, RT), struktur pencatatan mutasi kas, serta format tanda bukti iuran.
4	Kebutuhan Pengguna (User Requirements)	Analisis Kebutuhan & MoSCoW	Perwakilan Pengurus RW, Ketua RT, Bendahara, dan Warga	Menggali ekspektasi fungsional pengguna, memetakan fitur ke kategori Must/Should/Could/Won’t, dan mengidentifikasi hak akses.
5	Infrastruktur & Kesiapan Perangkat	Analisis Lingkungan Pengguna	Karakteristik Gawai dan Konektivitas Pengurus/Warga	Mengetahui spesifikasi perangkat (ponsel cerdas/laptop) pengguna guna memastikan antarmuka web responsif dan ringan.

3.5.3.	Mekanisme Verifikasi dan Validasi
Verifikasi dan validasi rancangan dilakukan untuk memastikan bahwa sistem yang dihasilkan memenuhi spesifikasi yang telah ditetapkan (verifikasi) dan benar-benar menjawab kebutuhan pengguna serta mitra (validasi). Kedua mekanisme ini diterapkan pada setiap modul sistem:
3.5.3.1.	Mekanisme Verifikasi
Verifikasi dilakukan untuk memeriksa kesesuaian antara hasil implementasi dengan spesifikasi rancangan: 
1. Pengujian Fungsional (Functional Testing): Setiap fungsi yang tercantum dalam spesifikasi fungsional diuji secara individual untuk memastikan keluaran yang dihasilkan sesuai dengan yang diharapkan. Pengujian dilakukan menggunakan skenario uji yang mencakup kondisi normal (happy path) dan kondisi batas (edge case). 
2. Pengujian Validasi Masukan (Input Validation Testing): Seluruh masukan formulir diuji terhadap aturan validasi yang telah ditetapkan, termasuk format NIK 16 digit angka, kelengkapan field wajib, pencegahan duplikasi data, dan sanitasi karakter berbahaya. Masukan yang tidak valid harus menghasilkan pesan galat yang informatif dalam Bahasa Indonesia. 
3. Pengujian Kontrol Akses (Access Control Testing): Setiap rute antarmuka dan server action diuji untuk memastikan bahwa hak akses diberlakukan secara konsisten sesuai matriks RBAC. Pengujian mencakup skenario akses oleh peran yang berwenang, peran yang tidak berwenang, dan pengguna tanpa sesi aktif. 
4. Pengujian Keamanan Aplikasi (Application Security Testing): Dilakukan pemeriksaan terhadap potensi kerentanan berdasarkan standar OWASP Top 10, termasuk uji injeksi SQL pada input formulir, pemeriksaan atribut keamanan cookie sesi (HttpOnly, Secure, SameSite), dan uji pembatasan percobaan masuk (rate limiting).
3.5.3.2.	Mekanisme Validasi
Validasi dilakukan untuk memastikan sistem yang dibangun sesuai dengan kebutuhan nyata mitra dan pengguna: 
1. Validasi Bersama Mitra: Hasil perancangan purwarupa dipresentasikan kepada pengurus RW 06 untuk mendapatkan umpan balik langsung mengenai kesesuaian fitur, alur kerja, dan antarmuka dengan proses administrasi lingkungan. 
2. Pengujian Penerimaan Pengguna (User Acceptance Testing / UAT): Pengguna representatif dari setiap kelompok peran (admin_rw, pengurus_rt, bendahara, dan warga) melakukan pengujian dengan menjalankan skenario tugas operasional nyata. Hasil pengujian dievaluasi menggunakan instrumen kuisioner System Usability Scale (SUS) untuk menilai kemudahan penggunaan dan efisiensi sistem. 
3. Pemeriksaan Kepatuhan Regulasi: Spesifikasi dan implementasi sistem diperiksa kembali terhadap ketentuan perundang-undangan (UU PDP No. 27/2022, UU Adminduk No. 24/2013, dan Permendagri No. 18/2018) guna menjamin pengelolaan data warga mematuhi kewajiban hukum yang berlaku.

3.5.4.	Jadwal Pelaksanaan Perancangan (Penyesuaian Penomoran)
Perancangan Sistem Informasi RW dilaksanakan dalam kurun waktu satu semester akademik (estimasi 16 minggu) sesuai kurikulum program studi. Alur pelaksanaan diselaraskan dengan tahapan sistematika perancangan berbasis Kanban sebagaimana disajikan pada Tabel 12:
Tabel 12 Aktivitas perancangan
Tahap	Aktivitas Perancangan	Target Minggu	Output / Artefak
1	Identifikasi & analisis kebutuhan; studi regulasi kemasyarakatan; observasi proses mitra	Minggu 1–2	Dokumen Kebutuhan Sistem & Matriks MoSCoW
2	Perancangan struktur data dan ERD; perancangan skema tabel basis data	Minggu 3–4	Diagram ERD terkonseptualisasi & Drizzle Schema
3	Perancangan arsitektur perangkat lunak; konfigurasi repositori & environment	Minggu 5	Setup repositori GitHub, board Kanban, & template SvelteKit
4	Perancangan antarmuka UI/UX; wireframe; perancangan alur tugas (task flow)	Minggu 5–6	Desain antarmuka responsif & Diagram UML
5	Perancangan keamanan sistem; definisi matriks RBAC; konfigurasi Better Auth	Minggu 6	Matriks RBAC, permissions.ts, & hooks.server.ts
6	Implementasi modular: Modul Kependudukan & Manajemen Akun Pengguna	Minggu 7–9	Fitur CRUD Warga, KK, RT, & Route Guards
7	Implementasi modular: Modul Keuangan Kas RW	Minggu 9–11	Fitur pencatatan kas, upload bukti, & laporan kas
8	Implementasi modular: Modul Tagihan Iuran Warga & Informasi Pengumuman	Minggu 11–12	Fitur tagihan iuran, riwayat pembayaran, & pengumuman
9	Integrasi menyeluruh antarmodul; pengujian integrasi fungsional	Minggu 13	Sistem SI-RW terpadu & uji keterhubungan data
10	Verifikasi pengujian Black Box & Validasi UAT bersama mitra RW 06	Minggu 14–15	Berita Acara UAT & Hasil Kuesioner SUS
11	Perbaikan pasca-UAT (bug fixing) & finalisasi dokumentasi laporan capstone	Minggu 16	Purwarupa final & Dokumen Laporan Capstone

3.5.5.	Identifikasi Komponen Sistem Terintegrasi (Format Standar 5 Unsur)
Sebagai landasan perancangan sistem terpadu, dilakukan pemetaan komparatif terhadap 5 (lima) unsur sistem terintegrasi (Manusia, Material, Mesin/Peralatan, Informasi, dan Energi) antara kondisi sistem manual saat ini (As-Is) dengan rancangan Sistem Informasi RW yang diusulkan (To-Be), sebagaimana dijabarkan pada Tabel 13:
Tabel 13 Pemetaan komparatif unsur sistem terintegrasi as-is dan to-be
Unsur Komponen	Kondisi Sistem Saat Ini (As-Is)	Rancangan Sistem Informasi RW (To-Be)	Manfaat Integrasi
Manusia (Man)	- Pengurus RW/RT mencatat data secara manual di buku/Excel.
- Bendahara merekap iuran per RT secara terpisah.
- Warga menerima info secara pasif via obrolan grup WhatsApp.	- Admin RW: Mengelola akun, data induk, dan pengumuman.
- Pengurus RT: Memperbarui data warga di wilayahnya.
- Bendahara: Mencatat transaksi kas & mengelola iuran.
- Warga: Memantau tagihan, pengumuman, dan permohonan.	Pembagian wewenang terstruktur via RBAC, mengurangi beban kerja manual individu.
Material (Material)	- Kertas buku register kependudukan.
- Kuitansi fisik tanda terima iuran.
- Buku kas fisik dan fotokopi dokumen pendukung.	- Berkas digital (dokumen PDF/ekspor CSV).
- Bukti transfer elektronik (format berkas gambar terunggah).
- Formulir digital berbasis web.	Penghematan penggunaan kertas (paperless), pencegahan risiko kerusakan fisik atau kehilangan arsip.
Mesin / Peralatan (Machine)	- Komputer laptop pribadi (berkas tersimpan lokal).
- Telepon seluler untuk pesan singkat WhatsApp.
- Alat tulis kantor dan lemari arsip fisik.	- Peladen basis data SQLite / Turso cloud terpusat.
- Peramban web pada ponsel pintar warga dan laptop pengurus.
- Komputasi runtime Node.js/SvelteKit.	Akses lintas perangkat (cross-platform) tanpa keharusan instalasi aplikasi tambahan.
Informasi (Information)	- Data kependudukan terfragmentasi di tiap RT.
- Rekap saldo kas lambat dan rentan salah hitung.
- Pengumuman tertumpuk dalam ruang obrolan instan.	- Basis data kependudukan terpadu (single source of truth).
- Saldo kas dan status tagihan terbarui real-time.
- Papan informasi dan riwayat pengumuman terstruktur.	Informasi akurat, transparan, minim duplikasi data, dan memiliki rekam jejak audit (audit trail).
Energi (Energy)	- Energi fisik saat kunjungan langsung door-to-door atau pertemuan rutin.
- Daya listrik perangkat operasional kantor secara parsial.	- Daya listrik gawai/laptop saat pengoperasian sistem.
- Konsumsi energi komputasi server awan tepi (edge) berdaya rendah.	Efisiensi tenaga kerja dan waktu pengurus dalam penyelenggaraan administrasi lingkungan.

BAB IV 
HASIL PERANCANGAN
5.	
4.1.	Proses Perancangan
4.2.	Hasil Perancangan
4.3.	Verisfikasi Hasil Rancangan
BAB V 
ANALISIS BIAYA & KELAYAKAN PERANCANGAN
6.	
5.1.	Identifikasi Biaya Terkait Rancangan
5.2.	Analisis Kelayakan Perancangan
5.3.	Rencana Implementasi Hasil Rancangan
BAB VI 
EVALUASI DAN VALIDASI HASIL PERANCANGAN
6.1.	Validasi Hasil Rancangan
BAB VII 
KESIMPULAN DAN SARAN
7.1.	Kesimpulan
7.2.	Saran


 Daftar Pustaka 
Anderson, D. J. (2010). Kanban: Successful evolutionary change for your technology business. Blue Hole Press.
Asosiasi Penyelenggara Jasa Internet Indonesia. (2023). Survei APJII: Profil pengguna dan tren internet Indonesia 2023. https://survei1.apjii.or.id/download_survei/1f6debaa-4a13-4594-96f9-41b525dcd8eb
Asosiasi Penyelenggara Jasa Internet Indonesia. (2025). Survei profil internet Indonesia 2025. https://survei1.apjii.or.id/download_survei/1fec8325-df20-4464-9370-5129802a999b
Bank Indonesia. (2023). Laporan perkembangan sistem pembayaran 2023. https://www.bi.go.id/id/publikasi/laporan/Documents/LPSP-2023.pdf
Barth, A. (2011). HTTP state management mechanism (RFC 6265). Internet Engineering Task Force. https://www.rfc-editor.org/rfc/rfc6265.html
Better Auth. (n.d.). Better Auth documentation: Introduction. Retrieved October 5, 2026, from https://better-auth.com/docs/introduction
Booch, G., Rumbaugh, J., & Jacobson, I. (2005). The unified modeling language user guide (2nd ed.). Addison-Wesley Professional.
Brooke, J. (1996). SUS: A “quick and dirty” usability scale. In P. W. Jordan, B. Thomas, B. A. Weerdmeester, & A. L. McClelland (Eds.), Usability evaluation in industry (pp. 189–194). Taylor & Francis. https://doi.org/10.1201/9781498710411-35
Chen, P. P.-S. (1976). The entity-relationship model—Toward a unified view of data. ACM Transactions on Database Systems, 1(1), 9–36. https://doi.org/10.1145/320434.320440
Clegg, B., & Barker, R. (1994). Case method fast-track: A RAD approach. Addison-Wesley.
Dennis, A., Wixom, B. H., & Tegarden, D. (2020). Systems analysis and design: An object-oriented approach with UML (6th ed.). Wiley.
Drizzle Team. (n.d.). Drizzle ORM documentation: Overview. Retrieved October 5, 2026, from https://orm.drizzle.team/docs/overview
Fenton, J., Newton, E. M., Perlner, D., Regenscheid, R. L., Galluzzo, R. N., Burr, W. E., Richer, J. F., Lefkovitz, Z., Danker, B., Choong, Y.-Y., Greene, K., & Grassi, P. A. (2025). Digital identity guidelines: Authentication and authenticator management (NIST Special Publication 800-63B-4). National Institute of Standards and Technology. https://doi.org/10.6028/NIST.SP.800-63b-4
Ferraiolo, D. F., Sandhu, R., Gavrila, S., Kuhn, D. R., & Chandramouli, R. (2001). Proposed NIST standard for role-based access control. ACM Transactions on Information and System Security, 4(3), 224–274. https://doi.org/10.1145/501978.501980
GitHub. (n.d.). About projects. GitHub Docs. Retrieved October 5, 2026, from https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects
Grassi, P. A., Garcia, M. E., Fenton, J. L., Newton, E. M., Perlner, D., Regenscheid, R. L., Burr, W. E., Richer, J. F., Lefkovitz, Z., Danker, B., Choong, Y.-Y., Greene, K., Galluzzo, R. N., & Danker, J. (2010). Password management (NIST Special Publication 800-132). National Institute of Standards and Technology. https://doi.org/10.6028/NIST.SP.800-132
International Organization for Standardization & International Electrotechnical Commission. (2018). Information technology — Security techniques — Information security management systems — Overview and vocabulary (ISO/IEC 27000:2018, 5th ed.). https://www.iso.org/standard/70352.html
International Organization for Standardization & International Electrotechnical Commission. (2022). Information security, cybersecurity and privacy protection — Information security management systems — Requirements (ISO/IEC 27001:2022, 3rd ed.). https://www.iso.org/standard/27001
Leidig, P. M., & Salmela, H. (2021). The IS2020 competency model for undergraduate programs in information systems: A joint ACM/AIS task force report. Communications of the Association for Information Systems, 49, 1–38. https://doi.org/10.17705/1CAIS.04901
OWASP Foundation. (2021). OWASP Top 10: The ten most critical web application security risks (2021 ed.). https://top10.owasp.org/2021/
OWASP Foundation. (n.d.-a). Authentication cheat sheet. OWASP Cheat Sheet Series. Retrieved October 5, 2026, from https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
OWASP Foundation. (n.d.-b). Authorization cheat sheet. OWASP Cheat Sheet Series. Retrieved October 5, 2026, from https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
OWASP Foundation. (n.d.-c). Password storage cheat sheet. OWASP Cheat Sheet Series. Retrieved October 5, 2026, from https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
OWASP Foundation. (n.d.-d). Session management cheat sheet. OWASP Cheat Sheet Series. Retrieved October 5, 2026, from https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
OWASP Foundation. (n.d.-e). SQL injection prevention cheat sheet. OWASP Cheat Sheet Series. Retrieved October 5, 2026, from https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
Pemerintah Kota Bekasi. (2020). Peraturan Wali Kota Bekasi Nomor 58 Tahun 2020 tentang rukun tetangga dan rukun warga di Kota Bekasi. Berita Daerah Kota Bekasi Tahun 2020 Nomor 58 Seri E. https://kelurahan.bekasikota.go.id/admin/files/perwal%2058%20tahun%202020%20tentang%20pemilihan%20RT%20RW.pdf
Pressman, R. S., & Maxim, B. R. (2020). Software engineering: A practitioner’s approach (9th ed.). McGraw-Hill Education.
Republik Indonesia. (2013). Undang-Undang Republik Indonesia Nomor 24 Tahun 2013 tentang perubahan atas Undang-Undang Nomor 23 Tahun 2006 tentang administrasi kependudukan. Badan Pembinaan Hukum Nasional. https://peraturan.bpk.go.id/Details/38985/uu-no-24-tahun-2013
Republik Indonesia. (2014a). Undang-Undang Republik Indonesia Nomor 6 Tahun 2014 tentang desa. Badan Pembinaan Hukum Nasional. https://peraturan.bpk.go.id/Details/38582/uu-no-6-tahun-2014
Republik Indonesia. (2014b). Peraturan Pemerintah Republik Indonesia Nomor 43 Tahun 2014 tentang peraturan pelaksanaan Undang-Undang Nomor 6 Tahun 2014 tentang desa. Badan Pembinaan Hukum Nasional. https://peraturan.bpk.go.id/Details/5510/pp-no-43-tahun-2014
Republik Indonesia. (2018a). Peraturan Menteri Dalam Negeri Republik Indonesia Nomor 18 Tahun 2018 tentang lembaga kemasyarakatan desa dan lembaga adat desa. Kementerian Dalam Negeri. https://peraturan.bpk.go.id/Details/143587/permendagri-no-18-tahun-2018
Republik Indonesia. (2018b). Peraturan Presiden Republik Indonesia Nomor 95 Tahun 2018 tentang sistem pemerintahan berbasis elektronik. Badan Pembinaan Hukum Nasional. https://peraturan.bpk.go.id/Details/96913/perpres-no-95-tahun-2018
Republik Indonesia. (2022). Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang pelindungan data pribadi. Badan Pembinaan Hukum Nasional. https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022
Rescorla, E. (2026). The transport layer security (TLS) protocol version 1.3 (RFC 9846). Internet Engineering Task Force. https://www.rfc-editor.org/rfc/rfc9846.html
Sandhu, R. S., Coyne, E. J., Feinstein, H. L., & Youman, C. E. (1996). Role-based access control models. Computer, 29(2), 38–47. https://doi.org/10.1109/2.485845
Svelte Team. (n.d.-a). Svelte documentation: Basic markup. Retrieved October 5, 2026, from https://svelte.dev/docs/svelte/basic-markup
Svelte Team. (n.d.-b). Svelte documentation: What are runes?. Retrieved October 5, 2026, from https://svelte.dev/docs/svelte/what-are-runes
Svelte Team. (n.d.-c). SvelteKit documentation: Configuration — csrf. Retrieved October 5, 2026, from https://svelte.dev/docs/kit/configuration#csrf
Svelte Team. (n.d.-d). SvelteKit documentation: Introduction. Retrieved October 5, 2026, from https://svelte.dev/docs/kit/introduction
Turso. (n.d.). Turso documentation: Introduction. Retrieved October 5, 2026, from https://docs.turso.tech/introduction
World Wide Web Consortium. (2016). Content Security Policy Level 2 (W3C Recommendation). https://www.w3.org/TR/CSP2/
Zod. (n.d.). Zod documentation. Retrieved October 5, 2026, from https://zod.dev/


