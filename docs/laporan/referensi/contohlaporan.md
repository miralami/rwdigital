PROPOSAL CAPSTONE PROJECT
RANCANG BANGUN SISTEM INFORMASI SURAT MENYURAT
BERBASIS WEBSITE DENGAN METODE WATERFALL PADA UPPD
KALIDERES
Oleh :
PROGRAM STUDI STRATA 1 SISTEM INFORMASI
FAKULTAS REKAYASA INDUSTRI
UNIVERSITAS TELKOM
2025
Faqih Muhammad ‘Azzam Falahi 1201224060
Guspa Riyadi 1201226054
Yohana Mutiara Hutabalian 1201224009
ABSTRAK
Proses administrasi surat menyurat di Unit Pelayanan Pajak Daerah (UPPD) Kalideres masih
dilakukan secara manual, mulai dari pencatatan surat masuk, disposisi, hingga pengarsipan
surat keluar. Kondisi tersebut menimbulkan berbagai permasalahan, seperti keterlambatan
disposisi, risiko kehilangan dokumen, kesulitan pencarian arsip, serta kurangnya transparansi
dalam pelacakan status surat. Oleh karena itu, penelitian ini bertujuan untuk merancang dan
membangun Sistem Informasi Surat Menyurat berbasis website yang mampu mendigitalisasi
seluruh alur administrasi persuratan di UPPD Kalideres. Metode pengembangan sistem yang
digunakan adalah Waterfall, yang terdiri dari tahapan analisis kebutuhan, perancangan sistem,
implementasi, pengujian, dan pemeliharaan. Sistem dikembangkan menggunakan framework
Laravel dengan basis data MySQL, serta dirancang untuk mendukung pengelolaan surat
masuk, disposisi elektronik, surat keluar, arsip digital, pelacakan status surat, dan manajemen
pengguna. Pengujian sistem dilakukan menggunakan metode Black Box Testing untuk
memastikan fungsionalitas sistem berjalan sesuai kebutuhan, serta User Acceptance Test (UAT)
dengan pendekatan System Usability Scale (SUS) untuk menilai tingkat penerimaan dan
kemudahan penggunaan oleh pengguna. Hasil perancangan menunjukkan bahwa sistem
informasi yang dibangun mampu meningkatkan efisiensi, akurasi, serta transparansi proses
administrasi surat menyurat, sekaligus mendukung penerapan Sistem Pemerintahan Berbasis
Elektronik (SPBE) di lingkungan UPPD Kalideres.
DAFTAR ISI
ABSTRAK ................................................................................................................................ 2
DAFTAR ISI ............................................................................................................................. 3
DAFTAR GAMBAR ................................................................................................................ 7
DAFTAR TABEL ................................................................................................................... 10
BAB I ....................................................................................................................................... 13
PENDAHULUAN .................................................................................................................. 13
1.1 Latar Belakang ............................................................................................................... 13
1.2 Alternatif Solusi ............................................................................................................. 14
1.3 Perumusan Masalah ....................................................................................................... 17
1.4 Tujuan Perancangan ....................................................................................................... 17
1.5 Manfaat Perancangan ..................................................................................................... 18
BAB II ..................................................................................................................................... 19
TINJAUAN PUSTAKA ......................................................................................................... 19
2.1 Body of Knowledge ....................................................................................................... 19
2.2 Teori / Konsep Umum / Model / Kerangka Standar Terkait Perancangan ..................... 21
2.2.1 Profil UPPD Kalideres ............................................................................................ 21
2.2.2 Sistem Informasi Surat Menyurat ........................................................................... 22
2.2.3 Website .................................................................................................................... 22
2.2.4 Metode Waterfall..................................................................................................... 23
2.2.5 Metode MoSCoW ................................................................................................... 23
2.2.6 UML ........................................................................................................................ 24
2.2.7 ERD......................................................................................................................... 25
2.2.8 Laravel .................................................................................................................... 25
2.2.10 Black Box Testing ................................................................................................. 26
2.2.11 UAT ....................................................................................................................... 27
BAB III SPESIFIKASI DAN MEKANISME PERANCANGAN ..................................... 28
3.1 Batasan Realistis ............................................................................................................ 28
3.2 Standar Keteknikan ........................................................................................................ 29
3.3 Spesifikasi Rancangan ................................................................................................... 31
3.4 Batasan Asumsi .............................................................................................................. 32
3.5 Mekanisme Perancangan ............................................................................................... 33
3.5.1 Sistematika Perancangan ........................................................................................ 33
3.5.2 Mekanisme Pengumpulan Data ....................................................................... 34
3.5.3 Mekanisme Verifikasi dan Validasi ......................................................................... 34
3.5.3 Jadwal Pelaksanaan Perancangan .................................................................... 35
3.5.5 Identifikasi Komponen Sistem Terintegrasi ............................................................ 36
BAB IV .................................................................................................................................... 37
HASIL PERANCANGAN ..................................................................................................... 37
4.1 Proses Perancangan........................................................................................................ 37
4.1.1 Analisis Kebutuhan ................................................................................................. 37
4.1.2 Perancangan Sistem ................................................................................................ 52
4.2 Hasil Rancangan ............................................................................................................ 90
4.3 Verifikasi Hasil Rancangan .......................................................................................... 101
4.3.1 Modul Autentikasi Pengguna ......................................................................... 101
4.3.2 Modul Mengelola Pengguna .......................................................................... 101
4.3.3 Modul Surat Masuk........................................................................................ 102
4.3.4 Modul Disposisi ............................................................................................. 102
4.3.5 Modul Surat Keluar........................................................................................ 103
4.3.6 Modul Arsip ................................................................................................... 103
4.3.7 Modul Laporan dan Rekapitulasi ................................................................... 103
4.3.8 Modul Mengajukan Permohonan ................................................................... 104
BAB V ANALISIS BIAYA & KELAYAKAN PERANCANGAN .................................... 105
5.1 Identifikasi Biaya Terkait Rancangan .......................................................................... 105
5.1.1 Biaya Tenaga Kerja ............................................................................................... 105
5.1.2 Biaya Perangkat & Infrastruktur ........................................................................... 105
5.1.3 Biaya Operasional ................................................................................................. 106
5.1.4 Rekapitulasi Total Biaya Perancangan .................................................................. 108
5.2 Analisis Kelayakan Perancangan ................................................................................ 108
5.2.1 Identifikasi Manfaat .............................................................................................. 108
5.2.2 Analisis Kelayakan Finansial ............................................................................... 109
5.2.3 Analisis kelayakan hasil rancangan ...................................................................... 111
5.3 Rencana Implementasi Hasil Rancangan ..................................................................... 115
5.3.1 Tahapan Aktivitas Implementasi ........................................................................... 115
5.3.2 Kebutuhan Sumber Daya Manusia ....................................................................... 116
5.3.3 Kebutuhan Fasilitas............................................................................................... 116
BAB VI EVALUASI DAN VALIDASI HASIL RANCANGAN ...................................... 117
6.1 Validasi Hasil Rancangan......................................................................................... 117
6.2 Evaluasi Hasil Rancangan........................................................................................ 118
6.3 Penilaian Rekan ...................................................................................................... 120
BAB VII KESIMPULAN DAN SARAN ............................................................................ 127
7.1 Kesimpulan ........................................................................................................ 127
7.2 Saran .................................................................................................................. 128
DAFTAR PUSTAKA ........................................................................................................... 129
DAFTAR GAMBAR
Gambar 1. 1 Analisis Diagram Fishbone ................................................................................. 15
Gamabar 2. 1Cakupan Body of Knowlegde ............................................................................ 19
Gamabar 2. 2 Gedung UPPPD Kalideres ................................................................................ 21
Gamabar 2. 3 Metode Waterfal ................................................................................................ 23
Gambar 4. 1As-Is ..................................................................................................................... 40
Gambar 4. 2 Gambar To-Be ..................................................................................................... 41
Gambar 4. 3 Use Case Diagram ............................................................................................... 52
Gambar 4. 4 Mengelola Pengguna ........................................................................................... 69
Gambar 4. 5 Dashboard Statistik ............................................................................................. 70
Gambar 4. 6 Buat Surat Masuk Baru ....................................................................................... 71
Gambar 4. 7 Surat Masuk Aktif ............................................................................................... 72
Gambar 4. 8 Data Surat Masuk ................................................................................................ 73
Gambar 4. 9 Mengelola Surat Disposisi .................................................................................. 74
Gambar 4. 10 Buat Surat Keluar .............................................................................................. 75
Gambar 4. 11 Review Surat Keluar ......................................................................................... 76
Gambar 4. 12 Data Surat Keluar .............................................................................................. 77
Gambar 4. 13 Mengelola Arsip ................................................................................................ 78
Gambar 4. 14 Mengajukan Permohonan ................................................................................. 79
Gambar 4. 15 Melihat Laporan dan Rekapitulasi .................................................................... 80
Gambar 4. 16 Class Diagram ................................................................................................... 81
Gambar 4. 17 ERD................................................................................................................... 82
Gambar 4. 18 Mengelola Pengguna ......................................................................................... 83
Gambar 4. 19 Melihat Dashboard Statistik .............................................................................. 83
Gambar 4. 20 Mengelola Surat Masuk .................................................................................... 84
Gambar 4. 21 Mengelola Surat Disposisi ................................................................................ 85
Gambar 4. 22 Mengelola Surat Keluar .................................................................................... 86
Gambar 4. 23 Mengelola Arsip ................................................................................................ 87
Gambar 4. 24 Melihat Laporan Rekapitulasi ........................................................................... 88
Gambar 4. 25 Mengajukan Permohonan ................................................................................. 89
Gambar 4. 26 Halaman Dashboard Admin .............................................................................. 90
Gambar 4. 27 Halaman Mengelola Pengguna ......................................................................... 91
Gambar 4. 28 Halaman Buat Surat Masuk (Staff) ................................................................... 91
Gambar 4. 29 Halaman Surat Masuk Aktif (Staff) .................................................................. 92
Gambar 4. 30 Halaman Surat Masuk Aktif / Inbox (Pimpinan) .............................................. 93
Gambar 4. 31 Halaman Form Disposisi ................................................................................... 94
Gambar 4. 32 Data Surat Masuk .............................................................................................. 94
Gambar 4. 33 Halaman Buat Draft Surat Keluar ..................................................................... 95
Gambar 4. 34 Halaman Review dan Verifikasi Surat .............................................................. 96
Gambar 4. 35 Data Surat Keluar .............................................................................................. 97
Gambar 4. 36 Halaman Arsip................................................................................................... 98
Gambar 4. 37 Halaman Laporan dan Rekapitulasi .................................................................. 99
Gambar 4. 38 Halaman Mengajukan Permohonan ................................................................ 100
DAFTAR TABEL
Tabel 3. 1Mekanisme Pengumpulan Data ............................................................................... 34
Tabel 3. 2 Jadwal Pelaksanaan Perancangan ........................................................................... 35
Tabel 3. 3 Identifikasi komponen sistem ................................................................................. 36
Tabel 4. 1 Wawancara .............................................................................................................. 37
Tabel 4. 2 Mengelola Pengguna ............................................................................................... 41
Tabel 4. 3 Melihat Dashboard Statistik .................................................................................... 42
Tabel 4. 4Mengelola Surat Masuk ........................................................................................... 42
Tabel 4. 5 Mengelola Surat Disposisi ...................................................................................... 43
Tabel 4. 6 Mengelola Surat Keluar .......................................................................................... 43
Tabel 4. 7 Mengelola Arsip ...................................................................................................... 44
Tabel 4. 8 Melihat Laporan Rekapitulasi ................................................................................. 45
Tabel 4. 9 Mengajukan Permohonan ....................................................................................... 45
Tabel 4. 10 Kinerja (Performance)........................................................................................... 46
Tabel 4. 11 Keamanan (Security) ............................................................................................. 47
Tabel 4. 12 Kegunaan (Usability) ............................................................................................ 48
Tabel 4. 13 Keandalan & Ketersediaan (Reliability & Availability) ....................................... 49
Tabel 4. 14 Kompatibilitas (Compatibility) ............................................................................. 50
Tabel 4. 15 Kemudahan Perawatan (Maintainability) ............................................................. 50
Tabel 4. 16 Mengelola Pengguna ............................................................................................. 53
Tabel 4. 17 Melihat Dashboard Statistik .................................................................................. 55
Tabel 4. 18 Mengelola Surat Masuk ........................................................................................ 56
Tabel 4. 19 Mengelola Surat Disposisi .................................................................................... 59
Tabel 4. 20 Mengelola Surat Keluar ........................................................................................ 60
Tabel 4. 21 Mengelola Arsip .................................................................................................... 63
Tabel 4. 22 Mengajukan Permohonan ..................................................................................... 65
Tabel 4. 23Melihat Laporan Rekapitulasi ................................................................................ 67
Tabel 4. 24 Modul Autentitas Pengguna ................................................................................ 101
Tabel 4. 25 Modul Mengelola Pengguna ............................................................................... 101
Tabel 4. 26 Modul Surat Masuk ............................................................................................. 102
Tabel 4. 27 Modul Disposisi .................................................................................................. 102
Tabel 4. 28 Modul Surat Keluar ............................................................................................. 103
Tabel 4. 29 Modul Arsip ........................................................................................................ 103
Tabel 4. 30 Modul Laporan Dan Rekapitulasi ....................................................................... 103
Tabel 4. 31 Modul Mengajukan Permohonan ........................................................................ 104
Tabel 5. 1 Biaya Tenaga Kerja ............................................................................................... 105
Tabel 5. 2 Biaya Perangkat & Infrastruktur .......................................................................... 106
Tabel 5. 3 Biaya Oprasional ................................................................................................... 106
Tabel 5. 4 Rekapitulasi Total Biaya Perancangan .................................................................. 108
Tabel 5. 5 Analisis Kelayakan Finansial ............................................................................... 109
Tabel 5. 6 Pertanyaan Pengujian System Usability Scale ...................................................... 112
Tabel 5. 7 Hasil Penilaian Responden.................................................................................... 113
Tabel 6. 1 Hasil Validasi Sistem Berdasarkan System Usability Scale (SUS) ...................... 117
Tabel 6. 2 Perbandingan Kondisi As-Is dan To-Be Sistem Surat Menyurat .......................... 119
Tabel 6. 3 Penilaian Faqih ...................................................................................................... 120
Tabel 6. 4 Penilaian Guspa..................................................................................................... 122
Tabel 6. 5 Penilaian Yohana ................................................................................................... 124
BAB I
PENDAHULUAN
1.1 Latar Belakang
Unit Pelayanan Pajak Daerah (UPPD) Kalideres merupakan salah satu unit kerja di bawah
Badan Pendapatan Daerah (Bapenda) Provinsi DKI Jakarta yang memiliki peran penting dalam
mengelola administrasi perpajakan di wilayah Kalideres, Jakarta Barat (PERGUB PROVINSI
DKI JAKARTA NOMOR 63 TAHUN 2016). Tugas utama UPPD Kalideres meliputi pelayanan
publik kepada masyarakat, khususnya terkait dengan pengelolaan dan pengawasan pajak
daerah. Dalam menjalankan fungsi tersebut, UPPD Kalideres memproses berbagai dokumen
penting seperti surat masuk, surat keluar, disposisi, serta dokumen lain yang berhubungan
dengan wajib pajak maupun komunikasi antarinstansi.
Selama proses observasi 62 hari kerja diketahui bahwa sistem administrasi surat di UPPD
Kalideres masih banyak dilakukan secara manual.Pemohon atau wajib pajak menyerahkan
berkas secara langsung kepada petugas, kemudian data dicatat menggunakan buku agenda atau
file Excel. Selanjutnya, berkas fisik diteruskan kepada kepala unit untuk disposisi dan
dibuatkan surat balasan yang diarsipkan secara konvensional ke dalam folder. Proses ini
menimbulkan beberapa kendala, antara lain tingginya risiko kehilangan dokumen,
keterlambatan dalam pendistribusian surat, serta kesulitan dalam pencarian arsip karena data
tidak terintegrasi dalam satu sistem terpusat. Selain itu, monitoring status surat bagi pemohon
juga tidak dapat dilakukan secara transparan karena tidak tersedia fitur pelacakan yang jelas.
Kondisi tersebut menjadi semakin kompleks mengingat UPPD Kalideres melayani berbagai
jenis pajak daerah, terutama Pajak Pajak Air Tanah, Pajak Jasa Parkir, Pajak Makanan /
Minuman, Pajak Kesenian dan Hiburan, Pajak Perhotelan, Bumi dan Bangunan Perdesaan dan
Perkotaan (PBB-P2), Pajak Restoran, Bea Perolehan Hak Atas Tanah dan Bangunan (BPHTB),
dan Pajak Reklame. Setiap bulannya, UPPD Kalideres menangani kurang lebih 30 surat. Hal
ini menunjukkan besarnya beban kerja administrasi yang dihadapi, sehingga diperlukan upaya
digitalisasi untuk meningkatkan efektivitas, efisiensi, serta akuntabilitas pelayanan.
Berdasarkan analisis yang dilakukan, Sistem Surat Menyurat berbasis website untuk UPPD
Kalideres dirancang untuk mendigitalisasi alur administrasi surat mulai dari penerimaan,
disposisi, hingga proses pengarsipan. Sistem ini diharapkan mampu mempercepat proses
layanan, meminimalkan risiko kehilangan dokumen, serta mendukung transparansi dan
akuntabilitas pelayanan publik sesuai dengan kebijakan Sistem Pemerintahan Berbasis
Elektronik (SPBE).
Pengembangan Sistem Surat Menyurat berbasis Website ini menggunakan metode Waterfall.
Metode Waterfall merupakan salah satu model pengembangan perangkat lunak yang bersifat
klasik dan sistematis, di mana setiap tahapannya dilakukan secara berurutan mulai dari analisis
kebutuhan hingga pemeliharaan (Ishak et al., 2020). Waterfall menekankan pendekatan
sekuensial, di mana setiap fase harus diselesaikan terlebih dahulu sebelum melanjutkan ke fase
berikutnya. Tahapan tersebut meliputi analisis kebutuhan, perancangan sistem, implementasi,
pengujian, dan pemeliharaan.
Dalam penelitian ini, metode Waterfall dipilih karena kebutuhan sistem sudah terdefinisi
dengan jelas sejak awal, sehingga pendekatan yang terstruktur dan linier dapat meminimalkan
terjadinya perubahan signifikan selama proses pengembangan. Pada tahap analisis kebutuhan
dilakukan identifikasi proses bisnis di UPPD Kalideres, kemudian dilanjutkan dengan tahap
perancangan yang menghasilkan desain basis data, alur proses, dan antarmuka. Tahap
implementasi merealisasikan rancangan menjadi aplikasi berbasis web, kemudian dilakukan
pengujian untuk memastikan kesesuaian dengan spesifikasi. Dengan demikian, pembangunan
sistem surat menyurat berbasis web menggunakan metode Waterfall diharapkan mampu
menjadi solusi efektif untuk meningkatkan efisiensi, akurasi, serta akuntabilitas administrasi
surat di UPPD Kalideres.
1.2 Alternatif Solusi
1.2.1 Root Cause Analysis Fishbone Diagram
Diagram Fishbone sering juga disebut dengan istilah Diagram Ishikawa. Secara umum,
Diagram Fishbone dimanfaatkan untuk mengidentifikasi permasalahan serta menentukan
faktor penyebabnya. Selain fungsi tersebut, diagram ini juga dapat diterapkan pada proses
pengembangan dan perubahan (Harun, 2019). Permasalahan utama pada pengelolaan surat
menyurat di UPPD Kalideres adalah inefisiensi, tingginya risiko kehilangan dokumen, serta
sulitnya melakukan pelacakan status surat.
Gambar 1. 1 Analisis Diagram Fishbone
Berdasarkan analisis Fishbone pada Gambar 1, akar masalah dapat dikelompokkan ke dalam
enam faktor::
• Man (SDM): pegawai belum terbiasa dengan sistem digital dan masih bergantung pada
pencatatan manual.
• Method (Metode): alur pencatatan, disposisi, dan distribusi surat masih dilakukan
secara konvensional tanpa SOP digital yang jelas.
• Machine (Perangkat): tidak adanya aplikasi khusus, hanya menggunakan buku agenda
atau Excel.
• Material (Dokumen): arsip fisik mudah rusak, tercecer, dan sulit dilacak ketika
volumenya tinggi.
• Management: regulasi internal terkait digitalisasi arsip belum optimal, serta kurangnya
monitoring.
• Environment (Lingkungan): volume surat yang sangat tinggi, keterbatasan ruang arsip,
dan potensi kerusakan akibat bencana.
Analisis ini menunjukkan bahwa akar permasalahan tidak hanya berasal dari sisi teknis, tetapi
juga menyangkut aspek manusia, metode, manajemen, hingga lingkungan. Oleh karena itu,
solusi yang dipilih harus mampu mengatasi setiap faktor tersebut secara menyeluruh.
1.2.2 Solusi Permasalahan
1. Implementasi Aplikasi Pihak ketiga
Mengadopsi aplikasi pihak ketiga yang sudah tersedia, seperti Google Workspace, Microsoft
365, atau aplikasi pengelolaan surat berbasis cloud. Solusi ini memungkinkan implementasi
lebih cepat karena sistem sudah siap pakai dan biasanya dilengkapi dengan fitur kolaborasi.
Namun, kelemahannya terletak pada biaya berlangganan yang tidak sedikit, keterbatasan
fleksibilitas dalam penyesuaian kebutuhan instansi, serta risiko keamanan data karena
pengelolaan server tidak sepenuhnya berada di bawah kendali UPPD.
2. Penggunaan sistem semi-digital
Menggunakan sistem semi-digital dengan bantuan aplikasi umum seperti Microsoft Word,
Excel, serta media komunikasi seperti email atau WhatsApp. Alternatif ini relatif mudah
diterapkan dan dapat mengurangi penggunaan kertas. Akan tetapi, metode ini tetap menyisakan
masalah berupa arsip yang tersebar di berbagai perangkat, potensi duplikasi file, serta ketiadaan
integrasi data yang memadai.
3. Pengembangan Website
Mengembangkan sistem surat menyurat berbasis web secara mandiri sesuai kebutuhan UPPD
Kalideres. Alternatif ini membutuhkan proses analisis, perancangan, implementasi, serta
pemeliharaan yang lebih terstruktur. Meski membutuhkan waktu dan sumber daya lebih besar
dibandingkan opsi sebelumnya, kelebihannya adalah sistem dapat disesuaikan secara spesifik
dengan kebutuhan organisasi, data terpusat dan lebih aman, serta mendukung transparansi dan
efisiensi pengelolaan surat.
1.2.3 Solusi yang dipilih
Berdasarkan hasil analisis akar masalah menggunakan Fishbone Diagram pada Gambar 1 dan
pertimbangan kelebihan serta kekurangan masing-masing alternatif solusi, maka
pengembangan sistem surat menyurat berbasis web secara mandiri merupakan solusi utama
yang paling tepat. Alasan pemilihan solusi ini adalah:
• Perangkat & Metode: sistem berbasis web menggantikan pencatatan manual dengan
aplikasi digital terintegrasi sehingga pencatatan, disposisi, dan pelacakan lebih cepat
dan transparan.
• SDM: pegawai dapat dilatih menggunakan aplikasi, sehingga kesalahan pencatatan
dapat diminimalisasi.
• Dokumen: arsip tersimpan secara digital, lebih aman, mudah dicari, dan tidak mudah
rusak.
• Manajemen: mendukung implementasi Sistem Pemerintahan Berbasis Elektronik
(SPBE), sejalan dengan prinsip transparansi dan akuntabilitas.
• Lingkungan: digitalisasi arsip mengatasi keterbatasan ruang penyimpanan serta
mengurangi risiko kehilangan akibat faktor eksternal.
Dengan demikian, pengembangan sistem surat menyurat berbasis web tidak hanya menjadi
solusi yang efektif dan efisien, tetapi juga relevan dengan upaya modernisasi birokrasi di
lingkungan pemerintah daerah.
1.3 Perumusan Masalah
1. Bagaimana merancang dan membangun sistem surat menyurat berbasis web yang
mampu mendigitalisasi seluruh alur administrasi surat di UPPD Kalideres, mulai dari
penerimaan surat masuk, disposisi, hingga pengarsipan surat keluar?
2. Bagaimana sistem menyediakan pelacakan surat yang transparan dan akuntabel,
sehingga masyarakat maupun pihak internal dapat memantau status surat secara real-
time?
1.4 Tujuan Perancangan
Tujuan dari penelitian ini adalah sebagai berikut:
1. Merancang dan mengembangkan sistem surat menyurat berbasis web yang dapat
mendigitalisasi proses administrasi surat di UPPD Kalideres, mulai dari penerimaan
surat masuk, disposisi, hingga pengarsipan surat keluar.
2. Menyediakan sistem pelacakan surat yang transparan dan akuntabel, sehingga
masyarakat maupun pihak internal dapat memantau status surat secara real-time.
1.5 Manfaat Perancangan
Penelitian ini diharapkan tidak hanya menghasilkan sistem surat menyurat berbasis web yang
dapat digunakan oleh UPPD Kalideres, tetapi juga memberikan manfaat yang lebih luas, baik
secara praktis maupun akademis. Adapun manfaat rancangan yang diharapkan antara lain:
1. Bagi UPPD Kalideres
• Memberikan kemudahan dalam mengelola administrasi surat secara digital, mulai dari
penerimaan, pencatatan, disposisi, hingga pengarsipan surat keluar.
• Mengurangi risiko kehilangan dokumen karena data tersimpan secara terpusat dan lebih
aman.
2. Bagi Masyarakat/Wajib Pajak
• Mendapatkan kemudahan dalam memantau status surat secara real-time sehingga
meningkatkan kepastian layanan publik.
• Menumbuhkan kepercayaan terhadap instansi pemerintah melalui pelayanan yang lebih
modern dan akuntabel.
3. Bagi Akademisi dan Tim Peneliti
• Menjadi sarana penerapan ilmu yang diperoleh selama perkuliahan dalam bentuk
proyek nyata.
• Memberikan pengalaman langsung dalam merancang dan mengembangkan sistem
informasi berbasis web menggunakan metode Waterfall.
• Menjadi referensi bagi penelitian atau pengembangan sistem serupa di masa
mendatang, khususnya dalam konteks transformasi digital pelayanan publik.
BAB II
TINJAUAN PUSTAKA
2.1 Body of Knowledge
Body of Knowledge (BoK) yang menjadi acuan dalam Capstone Design Project ini
mencakup sejumlah disiplin ilmu dan praktik yang berkaitan dengan pengembangan website
untuk mendukung sistem surat-menyurat. Framework Body of Knowledge yang digunakan
dalam penelitian ini ditunjukkan pada Gambar 2 berikut:
Gamabar 2. 1Cakupan Body of Knowlegde
Adapun area utama yang menjadi fokus kajian meliputi:
1. Data
Data/information visualization adalah penyajian data dalam bentuk grafis atau visual untuk
memudahkan pemahaman dan analisis informasi (Few, 2012). Dalam konteks sistem informasi,
visualisasi data memungkinkan pengguna untuk lebih cepat melihat pola, tren, atau status dari
suatu proses (Kirk, 2019). Pada sistem surat menyurat berbasis web di UPPD Kalideres, fitur
visualisasi digunakan untuk menampilkan status surat, misalnya diterima, sedang diproses,
atau sudah selesai. Penyajian ini dapat berupa dashboard dengan grafik atau tabel interaktif,
sehingga memudahkan monitoring baik oleh pegawai maupun masyarakat. Dengan adanya
visualisasi, proses pelayanan menjadi lebih transparan dan akuntabel.
2. Development
Web programming adalah teknik pemrograman yang digunakan untuk membangun aplikasi
berbasis web dengan memanfaatkan bahasa pemrograman seperti HTML, CSS, JavaScript,
PHP, dan framework pendukung (Ullman, 2017). Aplikasi web bersifat cross-platform
sehingga dapat diakses melalui berbagai perangkat tanpa memerlukan instalasi tambahan.
Pengembangan sistem surat menyurat di UPPD Kalideres dilakukan berbasis web agar dapat
diakses dengan mudah melalui browser. Hal ini memudahkan pegawai dan masyarakat dalam
menggunakan sistem tanpa perlu menginstal aplikasi khusus.
System analysis dan design proses terstruktur untuk memahami kebutuhan pengguna dalam
pengembangan website dan merancang desain antarmuka (UI) maupun pengalaman pengguna
(UX) untuk memastikan bahwa website memberikan pengalaman positif bagi pengguna.
3. Organizational Domain
Digital Innovation adalah proses menciptakan solusi baru berbasis teknologi digital untuk
meningkatkan kinerja organisasi (Ayu Nyoman Sinta Dewi et al., 2023). Sistem surat menyurat
berbasis web yang dikembangkan merupakan bentuk inovasi digital di sektor publik, yang
bertujuan meningkatkan efisiensi, transparansi, dan akuntabilitas pelayanan pajak daerah.
Business Process Management adalah pendekatan sistematis untuk meningkatkan efisiensi dan
efektivitas proses bisnis melalui analisis, desain ulang, dan otomasi (Naufaldy et al., 2022).
Dalam penelitian ini, BPM diterapkan pada proses administrasi surat di UPPD Kalideres, yang
sebelumnya manual menjadi terdigitalisasi, sehingga mempercepat distribusi, mengurangi
risiko kehilangan, serta meningkatkan akurasi pencatatan.
2.2 Teori / Konsep Umum / Model / Kerangka Standar Terkait Perancangan
2.2.1 Profil UPPD Kalideres
Badan Pendapatan Daerah Provinsi DKI Jakarta sesuai tugas dan tanggung jawabnya telah
dibentuk sejak tanggal 11 September 1952 yang pada waktu itu disebut Kantor Urusan Pajak.
Sesuai dengan perkembangannya telah berubah beberapa kali nama maupun struktur
organisasinya yang disesuaikan dengan kondisi pada waktu itu. Sampai dengan tahun 1966 unit
kerja yang menangani pendapatan di DKI Jakarta bernama Urusan Pendapatan dan Pajak
sebagai salah satu bagian dari Direktorat Keuangan DKI Jakarta.(LKIP Bapenda DKI Tahun
2023, n.d.). Sesuai Pasal 49 Undang-Undang Nomor 5 Tahun 1974, pembentukan dan
organisasi Badan Pendapatan Daerah (Bapenda) DKI Jakarta ditetapkan melalui Peraturan
Daerah. Awalnya, Bapenda dibentuk melalui Perda Nomor 5 Tahun 1983, lalu diganti dengan
Perda Nomor 9 Tahun 1995 berdasarkan Kepmendagri Nomor 84 Tahun 1995. Seiring
perkembangan regulasi, pada tahun 2016 dikeluarkan Perda Nomor 5 tentang Organisasi
Perangkat Daerah yang menetapkan pembentukan Badan Pajak dan Retribusi Daerah (BPRD)
DKI Jakarta, dengan struktur organisasi diatur dalam Pergub Nomor 262 Tahun 2016.
Kemudian, pada tahun 2019, nama BPRD diubah kembali menjadi Badan Pendapatan Daerah
melalui Pergub Nomor 154 Tahun 2019. Perubahan ini disertai pembentukan unit-unit
pelayanan di kecamatan dan suku badan untuk memaksimalkan pemungutan pajak daerah.
Unit Pelayanan Pemungutan Pajak Daerah (UPPPD) Kecamatan Kalideres merupakan salah
satu unit kerja dibawah naungan Badan Pendapatan Daerah Provinsi DKI Jakarta, yang
berlokasi di Jl. Kembangan Raya RT.5/RW.1, Kembangan Utara, Kecamatan Kembangan, Kota
Jakarta Barat, Daerah Khusus Ibukota Jakarta 11610
Gamabar 2. 2 Gedung UPPPD Kalideres
Visi: Mewujudkan Kemandirian Fiskal dalam pembangunan Kota Jakarta (Badan
Pendapatan Daerah, 2022).
Misi: Merumuskan regulasi perpajakan yang mendukung pertumbuhan ekonomi
Indonesia, Meningkatan kepatuhan pajak melalui pelayanan berkualitas dan terstandarisasi,
edukasi dan pengawasan yang efektif, penegakan hukum yang adil dan mengembangkan proses
bisnis ini berbasis digital didukung budaya organisasi yang adaptif dan kolaboratif serta
aparatur pajak yang berintegritas, professional, dan Bermotivasi. (Badan Pendapatan Daerah,
2022)
Strategi: Kebijakan fiscal yang ekspansif dan konsolidatif, Penerimaan Negara dari
sector pajak yang optimal, Organisasi dan SDM yang optimal, Sistem Informasi yang andal
dan terintegrasi. (Badan Pendapatan Daerah, 2022
2.2.2 Sistem Informasi Surat Menyurat
Sistem Informasi Persuratan adalah sebuah aplikasi terkomputerisasi yang berguna untuk
memudahkan pengelolaan surat masuk dan surat keluar dalam suatu organisasi. Sistem ini
memungkinkan pengguna untuk mengirim, menerima, menyimpan, mengelola, mencari, dan
mengarsip surat secara elektronik.Dengan memilih Sistem Informasi Persuratan yang tepat,
organisasi dapat meningkatkan efisiensi dan efektivitas dalam pengelolaan surat menyurat,
meningkatkan transparansi dan akuntabilitas, dan menjaga keamanan data surat.
2.2.3 Website
Website adalah sekumpulan halaman digital yang saling terhubung dan dapat diakses melalui
internet. Halaman-halaman ini disusun dalam satu domain tertentu dan biasanya memuat
informasi dalam bentuk teks, gambar, video, dan elemen interaktif lainnya. Website bisa
bersifat statis (hanya menampilkan informasi tetap) atau dinamis (memungkinkan pengguna
berinteraksi dan memperbarui konten secara real-time). Setiap website memiliki alamat unik
yang disebut domain, seperti www.namawesbsite.com. Untuk menampilkannya, dibutuhkan
program yang disebut web browser, misalnya Google Chrome, Mozilla Firefox, Safari, atau
Microsoft Edge.
2.2.4 Metode Waterfall
Metode Waterfall merupakan salah satu model pengembangan perangkat lunak yang bersifat
klasik dan sistematis, di mana setiap tahapannya dilakukan secara berurutan mulai dari analisis
kebutuhan hingga pemeliharaan Waterfall menekankan pendekatan sekuensial, di mana setiap
fase harus diselesaikan terlebih dahulu sebelum melanjutkan ke fase berikutnya. Tahapan
tersebut meliputi analisis kebutuhan, perancangan sistem, implementasi, pengujian, dan
pemeliharaan. metode Waterfall dipilih karena kebutuhan sistem sudah terdefinisi dengan jelas
sejak awal, sehingga pendekatan yang terstruktur dan linier dapat meminimalkan terjadinya
perubahan signifikan selama proses pengembangan.
Gamabar 2. 3 Metode Waterfal
2.2.5 Metode MoSCoW
Metode MoSCoW adalah teknik untuk mengelompokkan kebutuhan sistem ke dalam empat
kategori utama, yaitu Must Have, Should Have, Could Have, dan Won’t Have, agar
memudahkan prioritisasi fitur serta tuntutan sistem (Agustina, Pambudi, & Sinaga, 2020).
Pendekatan ini membantu tim pengembang dan stakeholder dalam menentukan urutan
pengembangan fitur secara lebih efisien, mulai dari yang paling kritis hingga yang paling
opsional (Zuhairunisa, Az-zahra, & Syawli, 2025). Kebutuhan pada kelompok Must Have
menjadi prioritas tertinggi karena menjadi fondasi jalannya sistem, sedangkan Should Have
penting tetapi masih bisa ditunda jika sumber daya terbatas tanpa mengganggu fungsi utama
sistem (Zuhairunisa et al., 2025). Fitur yang masuk kategori Could Have bersifat tambahan
atau nilai tambah, sedangkan Won’t Have adalah kebutuhan yang ditunda karena belum
mendesak (Rachmadika, 2023). Kelebihan MoSCoW terletak pada kejelasan struktur dan
kemudahan dipahami, yang membantu menurunkan konflik prioritas dan meningkatkan
efisiensi tim pengembang (Zuhairunisa, Az-zahra, & Syawli, 2025).
2.2.6 UML
1. Usecase Diagram
Use Case Diagram adalah salah satu jenis diagram UML (Unified Modeling Language) yang
digunakan untuk menggambarkan interaksi antara pengguna (actor) dengan sistem. Diagram
ini menunjukkan fungsionalitas utama yang disediakan oleh sistem serta siapa saja yang dapat
mengakses fungsi tersebut. Dalam sistem surat menyurat berbasis web, Use Case Diagram
digunakan untuk memodelkan fungsionalitas system.
2. Class Diagram
Class diagram adalah merupakan hubungan antar kelas dan penjelasan detail tiaptiap kelas di
dalam model desain dari suatu sistem, juga memperlihatkan aturan- aturan dan tanggung jawab
entitas yang menentukan perilaku sistem. Jadi dapat dikatakan bahwa Class Diagram adalah
visual dari struktur sistem program pada jenis-jenis yang di bentuk. Class Diagram merupakan
alur jalannya sebuah database pada system yang akan dibangun atau dibuat. Class diagram juga
disebut kumpulan dari beberapa class dan relasinya. Class identik dengan entity yang
direpresentasikan dalam bentuk persegi dimana pada bagian atas ditulis nama class, kemudian
ke bawah ditulis attribute yang terdapat pada class, kemudian ke bawah lagi ditulis metode
yang ada pada class. Sebuah spesifikasi yang jika diinstansiasi akan menghasilkan sebuah
objek dan merupakan inti dari pengembangan dan desain berorientasi objek.(Ramdany et al.,
n.d.) Dalam sistem surat menyurat berbasis web, Class Diagram digunakan untuk memodelkan
struktur sistem berupa kelas, atribut, metode, dan hubungan antar entitas seperti pengguna,
surat, disposisi, dan arsip.
3. Sequence Diagram
Sequence diagram adalah jenis diagram UML yang menggambarkan interaksi antara objek
dalam sistem dalam urutan waktu tertentu melalui pertukaran pesan (message). Diagram ini
memvisualisasikan bagaimana alur proses dalam sistem berjalan secara dinamis, sehingga
membantu pengembang memahami urutan aktivitas antar objek dalam system (HERLINA &
ASSIDIQ, 2021) Dalam sistem surat menyurat berbasis web, sequence diagram digunakan
untuk menjelaskan alur surat masuk, disposisi, dan surat keluar secara terstruktur sehingga
proses lebih mudah dipahami dan diimplementasikan.
2.2.7 ERD
Entity Relationship Diagram (ERD) merupakan salah satu teknik yang digunakan dalam tahap
dasar perancangan basis data. ERD berfungsi untuk memodelkan entitas, atribut, dan relasi
antar entitas sehingga struktur data dalam sistem dapat digambarkan dengan jelas. ERD adalah
representasi grafis dari model data konseptual yang mencerminkan kebutuhan pengguna
terhadap data dalam sebuah sistem basis data (Afiifah et al., 2022) ERD juga dianggap sebagai
tahapan awal yang penting sebelum masuk ke desain logis dan fisik, karena kesalahan dalam
merancang ERD dapat berakibat pada kesalahan konseptual, prosedural, maupun teknis dalam
implementasi basis data.
Dalam ERD terdapat tiga komponen utama, yaitu entitas, atribut, dan relasi. Entitas
menggambarkan objek yang menjadi perhatian dalam basis data, atribut memberikan informasi
detail mengenai entitas, sedangkan relasi menunjukkan hubungan antar entitas. Sebagai
contoh, pada sistem surat menyurat berbasis web yang akan dikembangkan di UPPD Kalideres,
entitas dapat berupa surat masuk, surat keluar, disposisi, dan pengguna. Relasi yang terbentuk
misalnya “pengguna membuat banyak surat” atau “surat masuk memiliki satu disposisi”.
Dengan struktur ini, ERD membantu memastikan tidak terjadi redundansi data dan mendukung
integritas sistem.
2.2.8 Laravel
Laravel merupakan salah satu framework PHP berbasis arsitektur Model-View-Controller
(MVC) yang saat ini banyak digunakan dalam pengembangan aplikasi web. Framework ini
menyediakan berbagai fitur penting seperti routing, middleware, sistem autentikasi, serta
Object Relational Mapping (ORM) melalui Eloquent, yang memudahkan pengembang dalam
mengelola interaksi dengan basis data. Kelebihan utama Laravel adalah struktur kode yang
rapi, dokumentasi lengkap, dan dukungan komunitas yang luas, termasuk di Indonesia
(Restaldo & Beeh, 2022)
Dalam penelitian ini, Laravel dipilih sebagai framework utama dalam pengembangan sistem
surat menyurat berbasis web untuk UPPD Kalideres. Pemilihan ini didasarkan pada
fleksibilitas Laravel dalam mendukung kebutuhan pengembangan aplikasi berbasis web yang
kompleks, integrasi dengan basis data MySQL, serta kemudahan dalam melakukan
customization sesuai kebutuhan instansi pemerintah. Dengan demikian, Laravel menjadi
fondasi penting dalam membangun sistem yang handal, efisien, dan mudah dikembangkan di
masa mendatang.
2.2.9 MySQL
MySQL adalah sistem manajemen basis data relasional (Relational Database Management
System, RDBMS) open source yang banyak digunakan dalam pengembangan aplikasi berbasis
web karena kestabilan, kinerja, dan dukungan komunitasnya. Dalam banyak studi di Indonesia,
MySQL dipilih sebagai basis data utama karena kemampuannya dalam menangani data dalam
jumlah besar, juga menyediakan fitur keamanan seperti hak akses pengguna dan enkripsi
(Adriana et al., 2022)
Dalam penelitian Rancang Bangun Sistem Informasi Sebaran Distribusi Universitas Mataram,
MySQL disebut sebagai software RDBMS yang mampu mengelola database dengan sangat
cepat dan mendukung integritas data antar tabel (Nugroho et al., 2021) . Dengan referensi ini,
penggunaan MySQL dalam sistem surat menyurat berbasis web di UPPD Kalideres menjadi
relevan: MySQL akan menyimpan data penting seperti surat masuk, surat keluar, disposisi, dan
data pengguna secara terpusat. Struktur basis data yang baik dengan MySQL akan
meminimalkan duplikasi data, menjaga konsistensi, serta memudahkan operasi CRUD (Create,
Read, Update, Delete) melalui SQL.
2.2.10 Black Box Testing
Black Box Testing adalah metode pengujian perangkat lunak yang berfokus pada fungsi sistem
tanpa melihat struktur internal kode atau logika program. Dalam pengujian ini, tester akan
memberikan input tertentu ke sistem dan mengevaluasi output yang dihasilkan, apakah sesuai
dengan spesifikasi yang diharapkan (Wijaya et al., 2024)
Dalam konteks penelitian sistem surat menyurat berbasis web di UPPD Kalideres, Black Box
Testing digunakan untuk memastikan bahwa setiap fungsi sistem—seperti pendaftaran surat
masuk, disposisi, pembuatan surat keluar, login pengguna, otorisasi, dan fitur pencarian—
berjalan sesuai spesifikasi fungsional yang telah ditetapkan. Teknik ini sangat berguna untuk
mengetahui apakah sistem dapat menangani skenario input valid dan input tidak valid secara
tepat.
Dengan penerapan Black Box Testing, sistem surat menyurat berbasis web di UPPD Kalideres
dapat diuji dari sisi pengguna (end-user) tanpa perlu mengetahui implementasi internal.
Dengan demikian, kesalahan fungsional dapat dideteksi lebih awal dan diperbaiki sebelum
sistem digunakan secara penuh.
2.2.11 UAT
User Acceptance Test (UAT) atau uji penerimaan pengguna adalah tahap pengujian perangkat
lunak di mana pengguna akhir (end-user) sistem dilibatkan untuk memastikan bahwa sistem
yang dikembangkan memenuhi kebutuhan dan harapan mereka sebelum sistem tersebut
dioperasikan secara penuh. Dalam penelitian lokal, metode UAT sering digunakan untuk
mengevaluasi aspek fungsionalitas, keandalan, kemudahan penggunaan, dan efisiensi sistem
(Hasugian et al., 2023)
Dalam konteks sistem surat menyurat berbasis web di UPPD Kalideres, UAT akan
dilaksanakan setelah tahap pengujian sistem internal (unit test, integrasi, sistem) selesai. Pada
tahap UAT, pengguna internal instansi (seperti petugas administrasi, kepala unit) akan
mengoperasikan sistem sesuai skenario penggunaan nyata dan mengisi kuesioner evaluasi
terhadap beberapa aspek, seperti:
• Fungsionalitas: apakah seluruh fitur surat masuk, disposisi, surat keluar bekerja sesuai
kebutuhan;
• Kinerja dan kecepatan: apakah sistem merespons dalam waktu wajar saat diakses;
• Kemudahan penggunaan (usability): apakah pengguna nyaman dan familiar
menggunakan sistem;
• Efisiensi dan produktivitas: apakah sistem membantu mengurangi beban tugas manual
dan mempercepat proses;
• Keamanan & reliabilitas: apakah sistem aman dari gangguan dan konsisten bekerja
tanpa error.
Hasil UAT akan dianalisis berdasarkan skor kuesioner dan interpretasi persentase agar dapat
dinilai apakah sistem sudah diterima oleh pengguna (terprioritaskan sebagai “layak
digunakan”) atau masih perlu perbaikan lebih lanjut. Penggunaan UAT sangat penting agar
sistem tidak hanya berjalan dari sisi teknis, tetapihh benar-benar sesuai dengan kebutuhan dan
kenyamanan pengguna akhir.
BAB III
SPESIFIKASI DAN MEKANISME PERANCANGAN
3.1 Batasan Realistis
Perancangan sistem informasi surat menyurat berbasis website untuk UPPD Kalideres
menghadapi beberapa kendala dan kondisi faktual yang memengaruhi implementasinya,
meliputi aspek Sumber Daya Manusia (SDM), Infrastruktur, Sistem yang Berlaku, dan
Regulasi Internal.
1. Sumber Daya Manusia
• Literasi Digital Pegawai: Pegawai UPPD Kalideres telah memiliki
pengalaman menggunakan sistem digital, sehingga kebutuhan pelatihan bukan
pada level dasar, tetapi lebih kepada pengenalan fitur sistem baru.
• Keterbatasan Tenaga IT: Terdapat kekurangan operator khusus IT yang
memiliki kapabilitas untuk melakukan pemeliharaan dan dukungan teknis
sistem.
2. Infrastruktur
• Kualitas Jaringan: Jaringan internet di kantor sudah stabil, namun tetap
bergantung pada provider sehingga performa sistem web dapat terpengaruh
jika terjadi gangguan layanan.
• Server : UPPD Kalideres memiliki server lokal, namun kemampuan dan
kapasitas server tersebut tidak terlalu besar. Karena itu, sistem yang dibangun
perlu dibuat ringkas, efisien, dan tidak memerlukan sumber daya server yang
tinggi.
3. Sistem yang Berlaku
• Transisi Bertahap: Proses pencatatan saat ini masih mengandalkan Excel yang
diinput secara manual. Oleh karena itu, peralihan penuh ke sistem digital baru
harus dilakukan secara bertahap.
• Sistem Mandiri: Sistem yang dikembangkan belum terintegrasi secara luas
dengan aplikasi lain di lingkungan Bapenda DKI Jakarta, sehingga operasinya
akan berdiri sendiri.
4. Regulasi Internal
• Kepatuhan Administrasi: Perancangan sistem wajib mengikuti standar
administrasi persuratan yang telah ditetapkan oleh Bapenda DKI Jakarta.
• Kesesuaian SPBE: Implementasi sistem baru harus tetap sejalan dengan
kebijakan Sistem Pemerintahan Berbasis Elektronik (SPBE) yang berlaku.
3.2 Standar Keteknikan
Dalam perancangan sistem informasi surat menyurat berbasis web di UPPD Kalideres, standar
dan regulasi yang digunakan sebagai acuan adalah:
1. Standar Sistem Informasi Pemerintahan
• Peraturan Presiden Nomor 95 Tahun 2018 tentang Sistem Pemerintahan
Berbasis Elektronik (SPBE).
o Pasal 2 menegaskan bahwa SPBE bertujuan untuk mewujudkan tata
kelola pemerintahan yang bersih, efektif, transparan, dan akuntabel.
o Pasal 8 ayat (2) mengatur bahwa setiap instansi wajib
mengintegrasikan layanan administrasi pemerintahan ke dalam sistem
elektronik.
o Penerapan pada sistem: Fitur pelacakan status surat (tracking) dan
disposisi elektronik di sistem ini mendukung prinsip transparansi dan
akuntabilitas sebagaimana diamanatkan oleh SPBE.
2. Standar Keamanan Data dan Informasi
• ISO/IEC 27001:2013 tentang Information Security Management System
(ISMS).
o Fokus pada Confidentiality, Integrity, Availability (CIA Triad).
o Penerapan pada sistem:
• Confidentiality: Data surat dienkripsi menggunakan AES-256.
• Integrity: Validasi input dan hashing password dengan
algoritma bcrypt.
• Availability: Backup database harian dan redundansi server.
• Peraturan Menteri Kominfo No. 4 Tahun 2016 tentang Sistem Manajemen
Pengamanan Informasi.
o Pasal 5 menyatakan kewajiban instansi pemerintah menjaga
kerahasiaan dokumen dinas dengan teknologi keamanan.
o Penerapan pada sistem: Autentikasi berbasis role (admin, operator,
pegawai, masyarakat) untuk membatasi akses.
3. Standar Pengembangan Perangkat Lunak
• Metodologi Waterfall digunakan karena kebutuhan sistem telah terdefinisi
jelas dari hasil observasi dan wawancara.
o Analysis → kebutuhan surat masuk/keluar.
o Design → perancangan UML.
o Implementation → coding dengan framework Laravel.
o Testing → black box testing dan UAT.
o Maintenance → update berkala.
• UML (Unified Modeling Language):
o sebagai standar internasional pemodelan perangkat lunak.
o Penerapan pada sistem: Use Case Diagram untuk interaksi user dengan
sistem, Activity Diagram untuk alur disposisi surat, dan ERD untuk
struktur database.
4. Regulasi Administrasi Surat di Instansi Pemerintah
• Peraturan Arsip Nasional Republik Indonesia (ANRI) Nomor 6 Tahun 2021
tentang Tata Naskah Dinas.
o Pasal 4 menegaskan bahwa tata naskah dinas wajib memenuhi asas
autentik, sah, dan utuh.
o Penerapan pada sistem: Setiap surat keluar diberi nomor otomatis
sesuai format naskah dinas resmi.
• Undang-Undang Nomor 43 Tahun 2009 tentang Kearsipan.
o Pasal 40 menekankan bahwa arsip elektronik harus disimpan secara
aman dan dapat diakses kembali.
o Penerapan pada sistem: Arsip surat disimpan dalam database dengan
fitur pencarian cepat berbasis kata kunci dan klasifikasi.
3.3 Spesifikasi Rancangan
Berdasarkan batasan realistis (3.1) dan standar keteknikan/regulasi (3.2), spesifikasi rancangan
sistem surat menyurat berbasis website untuk UPPD Kalideres adalah sebagai berikut:
1. Spesifikasi Fungsional
• Manajemen Surat Masuk: Input, pencatatan, disposisi, pelacakan status.
• Manajemen Surat Keluar: Pembuatan, pencetakan, pengarsipan.
• Disposisi Elektronik: Distribusi surat secara digital dengan jejak audit.
• Pelacakan Status Surat: Pemohon dapat memantau status surat secara real-time.
• Manajemen Arsip: Penyimpanan digital, pencarian cepat dengan kata kunci,
klasifikasi berdasarkan jenis surat.
• Manajemen Pengguna: Hak akses berbeda (admin, kepala unit, Staff, masyarakat).
• Laporan & Statistik: Rekap surat masuk/keluar bulanan, grafik monitoring
disposisi.
2. Spesifikasi Non-Fungsional
• Keamanan: Data dienkripsi (AES-256) sebelum disimpan dalam database.
• Aksesibilitas: Sistem berbasis web, dapat diakses melalui browser tanpa instalasi
tambahan.
• Reliabilitas: Uptime minimal 99% dengan backup harian basis data.
• Usability: Antarmuka sederhana dan mudah dipahami oleh pegawai non-IT.
3. Spesifikasi Teknis
• Bahasa Pemrograman & Framework: PHP dengan Laravel Framework.
• Basis Data: MySQL dengan dukungan relasi antar entitas (surat masuk, surat
keluar, disposisi, pengguna).
• Server: Minimal spesifikasi CPU 4 core, RAM 8 GB, penyimpanan 500 GB SSD.
• Keamanan: Implementasi autentikasi berbasis role, enkripsi data, dan backup
otomatis.
• Testing: Menggunakan metode Black Box Testing dan User Acceptance Test
(UAT).
3.4 Batasan Asumsi
Dalam proses perancangan Sistem Informasi Surat Menyurat Berbasis Website di UPPD
Kalideres, terdapat beberapa batasan dan asumsi yang ditetapkan sebagai berikut:
1. Batasan Perancangan:
• Data : Pengumpulan data dalam penelitian ini dilakukan melalui dua metode
utama, yaitu observasi langsung dan wawancara terstruktur. Kedua metode ini
digunakan untuk mendapatkan gambaran yang akurat mengenai proses surat-
menyurat yang berjalan di UPPD Kalideres serta kebutuhan sistem yang akan
dirancang.
• Metode : Model pengembangan sistem yang digunakan adalah Waterfall,
sehingga alur pengembangan bersifat linear dan perubahan besar di tengah
proses tidak diperhitungkan.
• Anggaran : alam proses perancangannya, tidak ada anggaran tambahan untuk
membeli perangkat baru atau menyewa server eksternal. Oleh karena itu,
pengembangan sistem ini sepenuhnya memanfaatkan perangkat keras dan
perangkat lunak yang sudah tersedia di instansi, seperti komputer kantor,
jaringan internet, serta aplikasi pendukung lainnya.
• Waktu : Batasan waktu pengerjaan proyek adalah selama 1 semester (±4bulan),
sehingga lingkup rancangan dibatasi pada kebutuhan inti (core features)
pengelolaan surat masuk, surat keluar, disposisi, dan arsip digital.
• Integrasi Sistem : Sistem yang dirancang tidak diintegrasikan langsung dengan
sistem informasi lain di Bapenda DKI Jakarta karena keterbatasan akses dan
regulasi.
2. Asumsi Perancangan:
• Diasumsikan seluruh pegawai yang menggunakan sistem sudah mengikuti pelatihan
penggunaan aplikasi.
• Diasumsikan jaringan internet di kantor UPPD Kalideres tersedia secara stabil untuk
mengakses aplikasi berbasis web.
• Diasumsikan pengguna eksternal (masyarakat/wajib pajak) memiliki perangkat
(komputer/smartphone) untuk melakukan akses sistem jika diperlukan.
3.5 Mekanisme Perancangan
Mekanisme perancangan dilakukan dengan mengikuti tahapan metode Waterfall yang telah
dipilih. Tahapan ini meliputi sistematika perancangan, mekanisme pengumpulan data, serta
mekanisme verifikasi dan validasi.
3.5.1 Sistematika Perancangan
Sistematika perancangan mengikuti model Waterfall dengan tahapan sebagai berikut:
1. Analisis Kebutuhan
• Wawancara
• Identifikasi proses bisnis surat menyurat di UPPD Kalideres (surat masuk,
disposisi, surat keluar, arsip).
• Penyusunan kebutuhan fungsional dan non-fungsional sistem.
2. Perancangan Sistem
• Pemodelan dengan UML (Use Case, Class Diagram, Sequence Diagram,
ERD).
3. Implementasi
• Pengembangan sistem menggunakan Laravel Framework dengan basis data
MySQL.
• Implementasi fitur utama: manajemen surat masuk/keluar, disposisi elektronik,
arsip, laporan, dan manajemen pengguna.
4. Pengujian Sistem
• Pengujian fungsional dengan metode Black Box Testing.
• Uji penerimaan pengguna (User Acceptance Test – UAT).
3.5.2 Mekanisme Pengumpulan Data
Tabel 3. 1Mekanisme Pengumpulan Data
NO Jenis Data Metode Pengumpulan Keterangan
1 Proses bisnis surat Wawancara dan
Observasi
Untuk menggali alur disposisi,
kendala manual, kebutuhan
sistem
2 Data surat masuk/keluar Dokumen Untuk mengetahui volume,
jenis, dan alur surat
3 Kebutuhan pengguna Wawancara
Untuk mengetahui kebutuhan
fitur, kemudahan penggunaan,
dan ekspektasi sistem
4 Infrastruktur sistem Wawancara
Untuk mengetahui
ketersediaan komputer,
jaringan internet, dan server
3.5.3 Mekanisme Verifikasi dan Validasi
Verifikasi dan validasi dalam proyek ini dilakukan secara menyeluruh pada setiap tahap
perancangan sistem, mulai dari proses bisnis, desain sistem, hingga sistem yang telah
diimplementasikan.
• Pada tahap proses bisnis, verifikasi dilakukan menggunakan fitur Simulation
View Bizagi Modeler untuk memastikan alur kerja to-be telah berjalan sesuai
logika dan efisien. Selanjutnya dilakukan validasi dengan stakeholder melalui
sesi diskusi untuk menyesuaikan rancangan proses dengan kondisi nyata di
UPPD Kalideres.
• Pada tahap desain sistem, verifikasi dilakukan dengan meninjau diagram use
case, class diagram, dan rancangan basis data agar sesuai dengan kebutuhan
fungsional. Validasi dilakukan melalui review bersama pengguna internal untuk
memastikan rancangan antarmuka mudah digunakan dan memenuhi kebutuhan
administrasi surat menyurat. Selain itu, validasi juga dilakukan dengan
melibatkan expert, seperti dosen pembimbing guna memastikan rancangan
sistem telah sesuai dengan prinsip desain yang baik dan kebutuhan pengguna
• Pada tahap implementasi sistem, verifikasi dilakukan menggunakan Black Box
Testing dengan teknik State Transition Testing untuk memastikan setiap fitur
berjalan sesuai dengan kebutuhan fungsional dan alur proses yang telah
dirancang. Teknik ini dipilih karena sistem memiliki perubahan status yang
saling bergantung, sehingga setiap transisi state dapat diuji secara terkontrol.
Selanjutnya, validasi sistem dilakukan melalui User Acceptance Test (UAT)
menggunakan metode System Usability Scale (SUS) untuk menilai tingkat
kemudahan penggunaan, efisiensi, dan manfaat sistem.
Hasil dari seluruh proses verifikasi dan validasi menjadi dasar dalam penyempurnaan sistem
informasi surat menyurat berbasis web agar benar-benar siap digunakan di lingkungan UPPD
Kalideres.
3.5.3 Jadwal Pelaksanaan Perancangan
Tabel 3. 2 Jadwal Pelaksanaan Perancangan
Aktivitas M5 M6 M7 M8 M9 M10 M11 M12 M13 M14 M15
Analisis
Kebutuhan
Perancangan
Sistem
Implementasi
Pengujian
Sistem
Penyusunan
Laporan
3.5.5 Identifikasi Komponen Sistem Terintegrasi
Pada bagian ini, disajikan pemetaan aspek sistem terintegrasi yang menjadi landasan dalam
merancang sistem informasi berbasis web di UPPD Kalideres. Pemetaan ini mencakup objek
permasalahan, yaitu proses surat menyurat manual yang ada saat ini, serta rancangan solusi
yang diusulkan. Keduanya dipetakan ke dalam komponen sistem terintegrasi untuk
memberikan deskripsi yang terperinci. Berikut merupakan tabel identifikasi komponen sistem
yang menunjukkan perbandingan antara sistem saat ini dengan sistem yang diusulkan:
Tabel 3. 3 Identifikasi komponen sistem
Komponen Manusia Material Mesin/
Fasilitas/
Peralatan
Informasi Energi
Objek
(Sistem)
Pegawai
Administrasi,
Kepala Unit,
Wajib Pajak
Dokumen
Fisik (Surat),
Buku
Agenda,
Arsip
Komputer
(Excel),
Printer,
Lemari Arsip
Data surat
manual,
Status
disposisi
tidak
terpusat
Listrik untuk
perangkat
kantor
Rancangan
Solusi
Pengguna
Sistem
(Admin,
Staff),
Arsip Digital
(File PDF),
Server
Aplikasi,
Jaringan
Status surat
real-time,
Laporan
Listrik untuk
server dan
Pelatihan
Pengguna
Database
Terpusat
Internet,
Website
digital,
Notifikasi
koneksi
internet
BAB IV
HASIL PERANCANGAN
4.1 Proses Perancangan
Proses perancangan sistem ini dilakukan dengan mengikuti tahapan yang telah ditetapkan pada
Bab 3.5.1 Sistematika Perancangan, yaitu menggunakan metode Waterfall. Setiap tahapan
dilakukan secara sekuensial (berurutan) dan sistematis. Berikut adalah penjelasan rinci dari
setiap tahapan proses perancangan yang telah dilaksanakan.
4.1.1 Analisis Kebutuhan
a) Wawancara
Tabel 4. 1 Wawancara
No Kategori Pertanyaan Pertanyaan Wawancara Jawaban Wawancara
1 Proses Surat
menyurat
Siapa saja yang biasanya
terlibat dalam proses surat
menyurat (surat masuk,
disposisi, surat keluar)?
Staff TU sebagai penerima
surat dan mencatat; Ka
Unit sebagai pemberi
disposisi/arah ke Kasubbag
TU; Kasubbag TU
menentukan tindak lanjut
surat.
2 Volume Surat Berapa banyak permohonan
surat menyurat yang masuk
setiap bulannya?
Jumlah relatif: sekitar 30
surat/bulan; sampai
No Kategori Pertanyaan Pertanyaan Wawancara Jawaban Wawancara
September sudah 520 surat
masuk.
3 Alur Surat Masuk Bagaimana alur proses surat
masuk dari diterima hingga
selesai diarsipkan?
Pencatatan awal →
Pengelompokan &
penanggung jawab →
Distribusi surat →
Penanganan & tindak
lanjut → Pengarsipan
digital/fisik.
4 Surat Keluar Bagaimana proses pembuatan
dan pengiriman surat keluar?
Penentuan kebutuhan →
Pembuatan draft →
Pemeriksaan & koreksi →
Persetujuan → Pengiriman
→ Pencatatan pengiriman.
5 Penangung Jawab
Arsip
Siapa yang bertanggung
jawab mencatat dan
menyimpan surat fisik?
Kasubbag TU UP3D
Kalideres, seluruh staff
TU, dan bagian arsip.
No Kategori Pertanyaan Pertanyaan Wawancara Jawaban Wawancara
6 Waktu Proses Berapa lama waktu yang
dibutuhkan untuk memproses
satu surat dari awal hingga
selesai?
Surat keluar: ±1 hari; Surat
masuk: ±2 hari hingga
selesai ditindaklanjuti.
7 Kendala Proses
Manual
Kendala apa saja yang sering
terjadi dalam proses manual?
Keterlambatan disposisi
pimpinan.
8 Infrastruktur–
Internet
Apakah tersedia jaringan
internet yang stabil?
Ya Tersedia Sudah stabil.
9 Infrastruktur–
Perangkat
Apakah tersedia
komputer/perangkat yang
cukup untuk sistem berbasis
web?
Ya Tersedia
No Kategori Pertanyaan Pertanyaan Wawancara Jawaban Wawancara
10 Infrastruktur– Server Apakah UPPD Kalideres
memiliki server lokal?
Ya sudah Memiliki
11 SDM & Pelatihan Apakah pegawai pernah
mendapatkan pelatihan sistem
digital sebelumnya?
Sudah pernah
b) Proses Bisnis As-Is
Gambar 4. 1As-Is
c) Proses Bisnis To-Be
Gambar 4. 2 Gambar To-Be
d) Fungtional Requirement
Tabel 4. 2 Mengelola Pengguna
Mengelola Pengguna
No. Deskripsi Prioritas
1. Sistem memfasilitasi Admin untuk melihat daftar seluruh
pengguna sistem.
M (Must Have)
2. Sistem memfasilitasi Admin untuk menambahkan pengguna
baru beserta perannya.
M (Must Have)
3. Sistem memfasilitasi Admin untuk mengubah data profil atau
mereset kata sandi pengguna.
M (Must Have)
4. Sistem memfasilitasi Admin untuk menghapus pengguna dari
sistem.
S (Should Have)
Tabel 4. 3 Melihat Dashboard Statistik
Melihat Dashboard Statistik
No. Deskripsi Prioritas
1. Sistem memfasilitasi Pengguna Internal untuk melihat jumlah
total surat masuk, surat keluar, disposisi, dan arsip.
M (Must Have)
2. Sistem memfasilitasi Pengguna Internal untuk melihat grafik
aktivitas persuratan periodik.
S (Should Have)
Tabel 4. 4Mengelola Surat Masuk
Mengelola Surat Masuk
No. Deskripsi Prioritas
1. Sistem memfasilitasi staff untuk mencatat/input data surat masuk
baru.
M (Must Have)
2. Sistem memfasilitasi staff untuk mengunggah file hasil scan
surat masuk.
M (Must Have)
3. Sistem memfasilitasi Pengguna Internal (Kepala Unit/Kasubbag)
untuk mendisposisikan surat masuk.
M (Must Have)
4. Sistem memfasilitasi Pengguna Internal untuk mengunduh file
surat masuk.
M (Must Have)
5. Sistem memfasilitasi Pengguna Internal untuk melakukan
pencarian surat masuk
S (Should Have)
Tabel 4. 5 Mengelola Surat Disposisi
Mengelola Surat Disposisi
No. Deskripsi Prioritas
1. Sistem memfasilitasi Pengguna Internal untuk membuat
disposisi baru berdasarkan surat masuk.
M (Must Have)
2. Sistem memfasilitasi Pengguna Internal untuk menentukan
instruksi disposisi kepada bawahan.
M (Must Have)
3. Sistem dapat memperbarui status tindak lanjut disposisi. S (Should Have)
Tabel 4. 6 Mengelola Surat Keluar
Mengelola Surat Keluar
No. Deskripsi Prioritas
1. Sistem memfasilitasi Staff untuk membuat draf surat keluar. M (Must Have)
2. Sistem memfasilitasi Pengguna Internal untuk mereview dan
menyetujui draf surat keluar.
S (Should Have)
3. Sistem memfasilitasi Pengguna Internal untuk download draft
surat keluar dan mengunggah file final surat keluar yang telah
ditandatangani.
M (Must Have)
4. Sistem memfasilitasi Pengguna Internal untuk mengembalikan
draft surat keluar berdasarkan role yang dipilih.
M (Must Have)
5. Sistem memfasilitasi Staff untuk revisi/edit draft surat keluar. M (Must Have)
6. Sistem dapat memperbarui status surat keluar. S (Should Have)
Tabel 4. 7 Mengelola Arsip
Mengelola Arsip
No. Deskripsi Prioritas
1. Sistem memfasilitasi Pengguna Internal untuk menyimpan data
arsip fisik surat.
M (Must Have)
2. Sistem memfasilitasi Pengguna Internal untuk melakukan
pencarian arsip berdasarkan kata kunci tertentu.
M (Must Have)
Sistem memfasilitasi Pengguna Internal untuk mengunduh dokumen. M (Must Have)
Sistem memfasilitasi Pengguna Internal untuk melihat detail informasi
arsip.
S (Should Have)
Tabel 4. 8 Melihat Laporan Rekapitulasi
Melihat Laporan Rekapitulasi
No. Deskripsi Prioritas
1. Sistem memfasilitasi Pengguna Internal untuk melihat laporan
rekapitulasi data surat berdasarkan filter tanggal.
M (Must Have)
2. Sistem memfasilitasi Pengguna Internal untuk
mengunduh/ekspor Rekap Laporan dalam format PDF.
S (Should Have)
Tabel 4. 9 Mengajukan Permohonan
Mengajukan Permohonan
No. Deskripsi Prioritas
1. Sistem memfasilitasi Pemohon untuk melakukan registrasi akun
baru agar dapat mengakses layanan (Registrasi).
M (Must Have)
2. Sistem memfasilitasi Pemohon untuk mengisi formulir dan
mengunggah persyaratan pengajuan permohonan
M (Must Have)
3. Sistem memfasilitasi Pemohon untuk mengunduh bukti tanda
terima Bukti Pengajuan.
S (Should Have)
4. Sistem memfasilitasi Pemohon untuk memantau status
permohonan yang diajukan.
S (Should Have)
5. Sistem memfasilitasi Pemohon untuk melihat ringkasan total
pengajuan, menunggu verifikasi, diterima, dan ditolak pada
dashboard pemohon.
S (Should Have)
6. Sistem memfasilitasi Staff/Admin untuk memverifikasi
dokumen persyaratan yang masuk.
M (Must Have)
7. Sistem memfasilitasi Staff untuk menerima atau menolak
pengajuan permohonan tersebut.
M (Must Have)
B. Non-Fungtional Requirement
Tabel 4. 10 Kinerja (Performance)
Kinerja (Performance)
ID Deskripsi Kebutuhan Non-Fungsional Prioritas (M/S/C/W)
NFR-
P-01
Semua halaman aplikasi harus dimuat (load)
sepenuhnya dalam waktu kurang dari 3 detik pada
koneksi internet kantor yang stabil.
S (Should Have)
NFR-
P-02
Waktu respon untuk aksi krusial (seperti menyimpan
surat, mengirim disposisi, mencari arsip) harus
kurang dari 5 detik.
S (Should Have)
NFR-
P-03
Sistem harus mampu menangani setidaknya 50
pengguna yang aktif secara bersamaan (concurrent
users) tanpa penurunan kinerja yang signifikan.
C (Could Have)
Tabel 4. 11 Keamanan (Security)
Keamanan (Security)
ID Deskripsi Kebutuhan Non-Fungsional Prioritas (M/S/C/W)
NFR-
S-01
Sesuai standar ISO 27001 (Bab 3.2), password
pengguna harus di-hash menggunakan algoritma
bcrypt dan file surat sensitif harus dienkripsi saat
disimpan (at rest).
M (Must Have)
NFR-
S-02
Sistem harus memberlakukan Role-Based Access
Control (FR-U-06) secara ketat. Pengguna dengan
peran 'Staff' sama sekali tidak boleh dapat mengakses
menu atau fungsi 'Admin'.
M (Must Have)
NFR-
S-03
Sesi pengguna internal (Admin, Staff, Kepala Unit)
harus otomatis berakhir (logout) setelah 60 menit
tidak ada aktivitas untuk mencegah akses tidak sah.
M (Must Have)
NFR-
S-04
Sistem harus divalidasi di sisi server untuk mencegah
serangan umum seperti SQL Injection dan Cross-Site
Scripting (XSS), terutama pada form publik (FR-P-
02).
M (Must Have)
Tabel 4. 12 Kegunaan (Usability)
Kegunaan (Usability)
ID Deskripsi Kebutuhan Non-Fungsional Prioritas (M/S/C/W)
NFR-
U-01
Sesuai Batasan Realistis (Bab 3.1), antarmuka harus
dirancang agar intuitif dan mudah dipahami oleh
pegawai yang belum terbiasa dengan sistem digital.
M (Must Have)
NFR-
U-02
Seluruh teks, label, tombol, dan pesan error dalam
sistem harus menggunakan Bahasa Indonesia yang
baku dan mudah dimengerti.
M (Must Have)
NFR-
U-03
Desain, tata letak, dan penempatan tombol (misal:
"Simpan", "Batal") harus konsisten di semua halaman
aplikasi.
S (Should Have)
NFR-
U-04
Pesan error harus jelas dan memberi tahu pengguna
apa yang salah dan bagaimana cara memperbaikinya
(contoh: "Format tanggal salah. Gunakan
DD/MM/YYYY").
S (Should Have)
Tabel 4. 13 Keandalan & Ketersediaan (Reliability & Availability)
Keandalan & Ketersediaan (Reliability & Availability)
ID Deskripsi Kebutuhan Non-Fungsional Prioritas (M/S/C/W)
NFR-
R-01
Sesuai Bab 3.3, sistem harus memiliki ketersediaan
(uptime) minimal 99% selama jam kerja operasional
(Senin-Jumat, 08:00 - 17:00 WIB).
S (Should Have)
NFR-
R-02
Sesuai Bab 3.2, harus ada mekanisme backup
database otomatis yang berjalan setiap hari (harian)
untuk mencegah kehilangan data.
M (Must Have)
NFR-
R-03
Sistem harus dapat menangani error yang tidak
terduga (misal: koneksi database terputus) dengan
menampilkan halaman error yang informatif, bukan
crash atau blank page.
S (Should Have)
Tabel 4. 14 Kompatibilitas (Compatibility)
Kompatibilitas (Compatibility)
ID Deskripsi Kebutuhan Non-Fungsional Prioritas (M/S/C/W)
NFR-
C-01
Aplikasi harus berfungsi penuh pada 2 (dua) versi
terbaru dari browser web modern: Google Chrome,
Mozilla Firefox, dan Microsoft Edge.
M (Must Have)
NFR-
C-02
Halaman pelacakan publik (Modul FR-P) harus
bersifat responsif dan dapat diakses dengan baik
melalui browser mobile (Android dan iOS).
M (Must Have)
NFR-
C-03
Antarmuka internal (Admin, Staff, Kepala Unit)
harus dioptimalkan untuk resolusi layar desktop
standar (minimal 1366x768 piksel).
M (Must Have)
Tabel 4. 15 Kemudahan Perawatan (Maintainability)
Kemudahan Perawatan (Maintainability)
ID Deskripsi Kebutuhan Non-Fungsional Prioritas (M/S/C/W)
NFR-
M-01
Kode program harus ditulis mengikuti standar coding
(misal: PSR-12 untuk PHP/Laravel) dan diberi
komentar yang jelas pada logika bisnis yang
kompleks.
S (Should Have)
NFR-
M-02
Sistem harus dibangun secara modular (sesuai 7
modul fungsional) agar mudah diperbaiki atau
dikembangkan di masa depan tanpa merusak bagian
lain.
S (Should Have)
4.1.2 Perancangan Sistem
a) Use Case Diagram
Gambar 4. 3 Use Case Diagram
b) Use Case Description
• Mengelola Pengguna
Tabel 4. 16 Mengelola Pengguna
Use Case Name: Mengelola Pengguna ID: Priority: High
Actor: Admin
Description: Fungsionalitas ini memungkinkan Admin untuk menambah, mengubah,
menghapus, dan melihat daftar pengguna sistem (Staff TU, Kasubbag TU, Kepala Unit) serta
mengatur hak akses mereka.
Trigger: Adanya pegawai baru, mutasi pegawai, atau perubahan data pegawai yang
memerlukan akses sistem.
Preconditions: Admin telah berhasil login ke dalam sistem.
Normal Course:
1. Admin memilih menu "Manajemen Pengguna".
2. Sistem menampilkan daftar pengguna yang terdaftar.
3. Admin melihat daftar pengguna.
4. Admin memutuskan untuk melakukan aksi pengelolaan (lihat Sub Flow).
Postconditions: Data pengguna berhasil diperbarui di database dan hak akses telah
disesuaikan.
Sub Flows:
S-1: Tambah Pengguna Baru :
4. Admin menekan tombol "Tambah User".
Use Case Name: Mengelola Pengguna ID: Priority: High
5. Sistem menampilkan form input user.
6. Admin mengisi Nama, NIP/NRK, Email, Password, dan Role.
7. Admin menekan tombol simpan
8. Sistem menyimpan data dan menampilkan pesan sukses.
S-2: Edit Data Pengguna
9. Admin memilih salah satu user dan menekan tombol "Edit".
10. Sistem menampilkan form edit dengan data lama.
11. Admin mengubah data yang diperlukan.
12. Admin menekan tombol "Update".
13. Sistem memperbarui data.
S-3: Hapus Pengguna
1. Admin menekan tombol "Hapus" pada user tertentu.
2. Sistem meminta konfirmasi.
3. Admin menyetujui konfirmasi.
4. Sistem menonaktifkan/menghapus user tersebut.
Alternate / Exceptional Flows:
A-1: Data Tidak Lengkap (Pada S-1 atau S-2) :
Jika Admin menekan simpan padahal ada data wajib yang kosong, sistem menampilkan
pesan error "Data tidak boleh kosong" dan tetap di halaman form.
• Melihat Dashboard Statistik
Tabel 4. 17 Melihat Dashboard Statistik
Use Case Name: Melihat Dashboard Statistik ID: Priority: High
Actor: Admin / Staff / Kepala Unit
Description: Use case ini menjelaskan proses pengguna dalam mengakses dan melihat
tampilan dashboard statistik yang menampilkan data surat masuk, surat keluar, status
disposisi, serta rekapitulasi lainnya secara real-time.
Trigger: Pengguna membuka menu Dashboard Statistik pada sistem.
Preconditions:
- Pengguna telah login ke sistem.
- Pengguna memiliki hak akses untuk melihat statistik.
Normal Course:
1. Pengguna login ke sistem.
2. Pengguna memilih menu Dashboard Statistik.
3. Sistem mengambil data statistik dari database.
4. Sistem menampilkan grafik, angka rekap, dan informasi statistik lainnya.
5. Pengguna melihat data yang ditampilkan.
Use Case Name: Melihat Dashboard Statistik ID: Priority: High
Postconditions:
Sistem menampilkan informasi statistik terkini sesuai data terbaru dalam database.
Sub Flows:
Filter Data Statistik: Pengguna dapat memilih filter (periode, jenis surat, status) dan sistem
menampilkan data sesuai filter.
Alternate / Exceptional Flows:
-Jika data tidak tersedia → sistem menampilkan pesan “Data tidak ditemukan”.
-Jika koneksi database gagal → sistem menampilkan pesan error dan dashboard tidak dapat
dimuat.
• Mengelola Surat Masuk
Tabel 4. 18 Mengelola Surat Masuk
Use Case Name: Mengelola Surat Masuk ID: Priority: High
Actor: Staff TU, Kepala Unit
Description: Fungsionalitas ini memungkinkan Staff TU untuk mencatat, mengedit, dan
melihat daftar surat masuk yang diterima oleh UPPD Kalideres
Trigger: Surat diterima oleh UPPD Kalideres dan perlu dicatat ke dalam sistem
Use Case Name: Mengelola Surat Masuk ID: Priority: High
Preconditions: Pengguna harus berhasil login ke sistem dengan hak akses Staff TU
Normal Course:
1. Staff TU memilih menu "Manajemen Surat Masuk"
2. Sistem menampilkan daftar semua surat masuk yang sudah tercatat
3. Staff TU memilih salah satu aksi utama dari halaman tersebut:
a) (Buat Surat Masuk) -> jalankan subflow S-1
b) (Surat Masuk Aktif) -> jalankan subflow S-2
c) (Data Surat Masuk -> jalankan subflow S-3
Postconditions: Data surat masuk telah berhasil ditambahkan atau diperbarui, dan status surat
siap untuk didisposisi.
Sub Flows:
- S-1 : (Buat Surat Masuk)
a) Staff TU menekan tombol "Tambah Surat Masuk" pada halaman utama.
b) Sistem menampilkan formulir kosong input surat (No Agenda, No Surat,
Pengirim, Perihal, dll).
c) Staff TU mengisi data surat secara lengkap dan mengunggah file hasil scan
(format PDF).
d) Staff TU menekan tombol "Simpan"
e) Sistem memvalidasi kelengkapan inputan dan format file.
f) Sistem menyimpan data surat masuk baru ke dalam database dan
menampilkan notifikasi "Berhasil menambahkan surat".
- S-2 : (Surat Masuk Aktif)
a) Staff TU memilih menu "Surat Masuk Aktif".
b) Sistem menampilkan tabel daftar surat yang berstatus "Baru" .
c) Staff TU menekan tombol "Teruskan" (berwarna kuning) pada salah satu
surat.
d) Sistem mengarahkan ke halaman Detail Surat Masuk.
Use Case Name: Mengelola Surat Masuk ID: Priority: High
e) Staff TU memilih salah satu tujuan penerusan pada formulir "Teruskan
Surat" (pilihan: Kepala Unit atau Kasubbag).
f) Staff TU menekan tombol "Kirim / Teruskan".
g) Sistem memperbarui posisi surat ke pimpinan yang dipilih dan mengubah
status menjadi "Menunggu Disposisi", lalu kembali ke halaman sebelumnya
dengan pesan sukses.
- S-3 : (Data Surat Masuk)
a) Pengguna Internal memilih menu "Data Surat Masuk" (untuk arsip/selesai)
b) Sistem menampilkan daftar surat masuk selesai.
c) Staff Tu dapat melihat detail surat, download, dan mengarsipkan surat.
Alternate / Exceptional Flows:
- A-1: Format File Tidak Sesuai
a) Pada langkah (c), saat Staff TU mengunggah file selain PDF atau ukuran file terlalu
besar (>2MB) dan menekan Simpan.
b) Sistem menolak penyimpanan dan menampilkan pesan error "Format file harus
PDF dan maksimal 2MB".
- A-2: Data Tidak Lengkap
a) Pada langkah (d), jika Staff TU lupa mengisi kolom wajib (misal: No Surat atau
Pengirim).
b) Sistem menolak penyimpanan dan menandai kolom yang belum diisi dengan pesan
peringatan ("Field ini wajib diisi").
c) Staff TU melengkapi data yang kurang.
- A-3: Surat Sudah Pernah Diarsipkan
a) Pada langkah (e), saat Staff TU menekan tombol hijau "Arsip".
b) Jika sistem mendeteksi ID surat ini sudah ada di tabel Arsip, sistem akan
menampilkan data arsip yang sudah ada.
• Mengelola Surat Disposisi
Tabel 4. 19 Mengelola Surat Disposisi
Use Case Name: Mengelola Surat Disposisi ID: Priority: High
Actor: Kepala Unit, Kasubbag TU, Staff Penerima
Description: Proses distribusi instruksi kerja dari pimpinan ke bawahan terkait tindak lanjut
surat masuk secara digital.
Trigger: Kepala Unit menerima notifikasi adanya surat masuk baru yang perlu didisposisi.
Preconditions: Surat masuk telah dicatat oleh Staff TU dan berstatus "Menunggu Disposisi".
Normal Course:
1. Kepala Unit membuka menu "Surat Masuk".
2. Kepala Unit memilih surat yang statusnya "Menunggu Disposisi".
3. Kepala Unit melakukan disposisi awal.
4. Kasubbag TU meneruskan disposisi
5. Staff melaksanakan disposisi
Postconditions: Surat terdistribusi ke penanggung jawab akhir dan statusnya tercatat
"Selesai" atau "Dalam Proses".
Sub Flows: S-1: Disposisi Pimpinan (Kepala Unit)
a) Kepala Unit mengisi instruksi, sifat disposisi, dan batas waktu.
b) Kepala Unit memilih tujuan (Kasubbag TU).
c) Kepala Unit klik "Kirim Disposisi".
Use Case Name: Mengelola Surat Disposisi ID: Priority: High
Sub Flow: S-2: Terusan Disposisi (Kasubbag TU)
a) Kasubbag TU menerima notifikasi.
b) Kasubbag TU membuka detail disposisi.
c) Kasubbag TU menambahkan arahan teknis.
d) Kasubbag TU memilih satu/lebih Staff Pelaksana.
e) Kasubbag TU klik "Teruskan".
S-3: Tindak Lanjut (Staff)
a) Staff menerima disposisi.
b) Staff mengerjakan tugas.
c) Staff mengisi "Laporan Penyelesaian" di sistem.
d) Staff klik "Selesai".
Alternate / Exceptional Flows:
A-1: Kembalikan Disposisi (Tolak)
a) Jika Kasubbag TU merasa disposisi kurang jelas, ia dapat menekan tombol
"Kembalikan ke Kepala Unit" dengan menyertakan catatan pertanyaan.
• Mengelola Surat Keluar
Tabel 4. 20 Mengelola Surat Keluar
Use Case Name: Mengelola Surat Keluar ID: Priority: High
Actor: Staff TU, Kasubbag TU, Kepala Unit
Use Case Name: Mengelola Surat Keluar ID: Priority: High
Description: Mengelola siklus hidup surat keluar mulai dari pembuatan draft, penomoran
otomatis, verifikasi, hingga pengarsipan file final.
Trigger: Adanya kebutuhan untuk mengirim surat dinas keluar instansi atau balasan
permohonan.
Preconditions: Pengguna login sebagai Staff TU.
Normal Course:
1. Staff mengakses menu "Manajemen Surat Keluar" untuk memulai pembuatan surat.
2. Staff membuat draf surat baru. -> jalankan Subflow S-1: Membuat Draft Surat
Keluar
3. Sistem mengirim notifikasi kepada atasan (Kasubbag TU).
4. Kasubbag TU memeriksa draf surat masuk yang perlu direview. (-> jalankan
Subflow S-2: Review Surat Keluar)
5. Jika disetujui Kasubbag, surat diteruskan ke Kepala Unit untuk persetujuan akhir.
6. Kepala Unit menyetujui surat lalu mengunggah versi final. (-> jalankan Subflow S-
3: Upload Surat Final)
7. Sistem mengubah status surat menjadi "Selesai.
Postconditions: Surat keluar tercatat di database.
Sub Flows: S-1: Membuat Draft Surat Keluar
a) Staff memilih menu "Surat Keluar Aktif" lalu menekan tombol "Buat Surat
Keluar".
b) Sistem menampilkan formulir data surat (No Surat Otomatis, Tujuan, Perihal, File
Draft PDF).
c) Staff mengisi form dan mengunggah file PDF Surat.
d) Staff menekan tombol "Simpan".
e) Sistem menyimpan surat dengan status 'Draft' dan akan direview oleh Kasubag.
Use Case Name: Mengelola Surat Keluar ID: Priority: High
Sub Flow: S-2: Verifikasi Berjenjang
a) Pejabat (Kasubbag/Ka. Unit) membuka menu "Review Surat Keluar".
b) Sistem menampilkan daftar surat yang berstatus 'Draft' (untuk Kasubbag) atau
'Verifikasi' (untuk Ka. Unit).
c) Pejabat menekan tombol "Tindak Lanjut" pada salah satu surat.
d) Sistem menampilkan detail surat dan opsi verifikasi.
e) Pejabat mengecek isi draf surat (tombol "Lihat Draft").
f) Jika sudah sesuai, Kasubbag memilih status “Verifikasi/teruskan kepada Kepala
Unit” atau “Revisi (Kembalikan ke Staff) daatau 'Disetujui' (jika Ka. Unit) dan
menekan "Update Status".
Sub Flow: S-3: Data Surat Masuk
a) Pengguna Internal memilih menu "Data Surat Masuk" (untuk arsip/selesai)
b) Sistem menampilkan daftar surat masuk selesai.
c) Staff Tu dapat melihat detail surat, download, dan mengarsipkan surat.
Alternate / Exceptional Flows:
A-1: Revisi Surat
a) Pada Subflow S-2 langkah (f), jika isi surat dinilai Pejabat masih salah.
b) Pejabat memilih status 'Revisi', memilih tujuan revisi (misal: ke Staff), dan wajib
mengisi "Catatan Revisi".
c) Mengubah status surat menjadi 'Revisi', mengirim notifikasi ke Staff, dan
menampilkan surat tersebut kembali di menu Staff dengan badge merah "Perlu
Revisi".
d) Staff mengedit surat tersebut (Menu Edit), mengunggah draf perbaikan, lalu status
kembali menjadi 'Verifikasi'.
A-2: Surat Sudah Pernah Diarsipkan
a) Pada langkah (e), saat Staff TU menekan tombol hijau "Arsip".
b) Jika sistem mendeteksi ID surat ini sudah ada di tabel Arsip, sistem akan
menampilkan data arsip yang sudah ada.
• Mengelola Arsip
Tabel 4. 21 Mengelola Arsip
Use Case Name: Mengelola Arsip ID: Priority: High
Actor: Pengguna Internal
Description: Fungsionalitas ini memungkinkan pengguna internal untuk mengakses arsip
digital surat yang telah disimpan oleh sistem, melakukan pencarian arsip berdasarkan kata
kunci, nomor surat, pengirim/tujuan, atau rentang tanggal, serta melakukan filter terhadap
daftar arsip untuk mempermudah proses pencarian.
Trigger: Pengguna ingin mencari atau menampilkan arsip surat di dalam sistem.
Preconditions:
• Pengguna telah login sebagai pengguna internal.
• Arsip digital surat sudah tersimpan dalam sistem
Normal Course:
1. Pengguna memilih menu Arsip & Pencarian.
2. Sistem menampilkan daftar arsip surat yang tersedia.
3. Pengguna dapat memilih salah satu aksi berikut.
a) Mencari Arsip -> jalankan Subflow S-1
b) Memfilter Arsip -> jalankan Subflow S-2
Use Case Name: Mengelola Arsip ID: Priority: High
Postconditions: Arsip berhasil ditampilkan sesuai pencarian atau filter yang dipilih
pengguna.
Sub Flows:
- S1 : (Mencari Arsip)
a) Pengguna memasukkan kata kunci (Perihal), Nomor Surat,
Pengirim/Tujuan, atau memilih rentang tanggal.
b) Sistem memproses pencarian arsip.
c) Sistem menampilkan daftar arsip yang sesuai dengan parameter pencarian.
- S2 : (Memfilter Arsip)
a) Pengguna memilih filter daftar arsip berdasarkan status atau rentang
tanggal.
b) Sistem menampilkan daftar arsip sesuai filter yang dipilih.
Alternate / Exceptional Flows:
- A-1 : Arsip tidak ditemukan
a) Pada saat subflow S-1 atau S-2, jika tidak ada arsip yang sesuai, sistem
menampilkan pesan “Arsip tidak ditemukan”.
• Mengajukan Permohonan
Tabel 4. 22 Mengajukan Permohonan
Use Case Name: Mengajukan Permohonan ID: Priority: High
Actor: Pemohon
Description: Fitur ini menggambarkan proses pengguna (masyarakat) dalam mengajukan
permohonan surat melalui sistem, mulai dari mengisi data, mengunggah berkas, hingga
permohonan berhasil tercatat di sistem.
Trigger: Pemohon yang ingin mengajukan permohonan surat secara online melalui sistem.
Preconditions: - Pengguna sudah memiliki akun dan login ke dalam sistem.
- Sistem dalam kondisi aktif dan dapat diakses.
Normal Course:
1. Pengguna membuka menu Permohonan Surat.
2. Sistem menampilkan formulir pengajuan permohonan.
3. Pengguna mengisi data permohonan sesuai kebutuhan.
4. Pengguna mengunggah berkas persyaratan (jika diperlukan).
5. Pengguna menekan tombol Ajukan Permohonan.
6. Sistem memvalidasi input dan berkas.
7. Sistem menyimpan data permohonan ke database.
Use Case Name: Mengajukan Permohonan ID: Priority: High
8. Sistem menampilkan notifikasi bahwa permohonan berhasil diajukan.
Postconditions: - Data permohonan tersimpan ke sistem.
- Status permohonan berubah menjadi Menunggu Verifikasi.
Sub Flows:
Unggah Berkas: Jika pengguna mengunggah file, sistem memvalidasi format & ukuran file
sebelum menyimpan.
Alternate / Exceptional Flows:
- Jika data tidak lengkap → sistem menampilkan pesan error dan permohonan tidak diproses.
- Jika unggahan berkas gagal → sistem meminta pengguna mengunggah ulang.
- Jika terjadi gangguan server → sistem menampilkan pesan kegagalan pengajuan.
• Melihat Laporan Rekapitulasi
Tabel 4. 23Melihat Laporan Rekapitulasi
Use Case Name: Melihat Laporan Rekapitulasi ID: Priority: High
Actor: Pengguna Internal
Description: Use case ini menjelaskan proses pengguna internal dalam melihat laporan
rekapitulasi surat berdasarkan jenis laporan dan rentang tanggal melalui halaman Laporan &
Rekapitulasi.
Trigger: Pengguna membuka menu Laporan & Rekapitulasi pada sistem.
Preconditions: - Pengguna sudah memiliki akun dan berhasil login ke dalam sistem.
- Sistem dalam kondisi aktif dan dapat diakses.
- Data surat telah tersimpan di sistem.
Normal Course:
1. Pengguna membuka menu Laporan & Rekapitulasi.
2. Sistem menampilkan halaman filter laporan.
3. Pengguna memilih Jenis Laporan (misalnya: Rekapitulasi Surat Masuk).
4. Pengguna menentukan Dari Tanggal dan Sampai Tanggal.
5. Pengguna menekan tombol Pratinjau (Web).
6. Sistem memproses data sesuai filter yang dipilih.
7. Sistem menampilkan laporan rekapitulasi pada halaman web.
Use Case Name: Melihat Laporan Rekapitulasi ID: Priority: High
Postconditions:
- Laporan rekapitulasi berhasil ditampilkan sesuai filter.
- Pengguna dapat melanjutkan ke proses pengunduhan laporan.
Sub Flows:
Mengunduh Rekap Laporan: Pengguna menekan tombol Export PDF, sistem menghasilkan
dan mengunduh laporan dalam format PDF. (Extend)
Alternate / Exceptional Flows:
- Rentang tanggal tidak valid → Sistem menampilkan pesan kesalahan dan meminta
pengguna memperbaiki input tanggal..
- Terjadi gangguan sistem → Sistem menampilkan pesan error dan meminta pengguna
mencoba kembali.
c) Activity Diagram
• Mengelola Pengguna
Gambar 4. 4 Mengelola Pengguna
• Melihat Dashboard Statistik
Gambar 4. 5 Dashboard Statistik
• Mengelola Surat Masuk
- Buat Surat Masuk Baru
Gambar 4. 6 Buat Surat Masuk Baru
- Surat Masuk Aktif
Gambar 4. 7 Surat Masuk Aktif
- Data Surat Masuk
Gambar 4. 8 Data Surat Masuk
a) Mengelola Surat Disposisi
Gambar 4. 9 Mengelola Surat Disposisi
• Mengelola Surat Keluar
- Buat Surat Keluar
Gambar 4. 10 Buat Surat Keluar
- Review Surat Keluar
Gambar 4. 11 Review Surat Keluar
- Data Surat Keluar
Gambar 4. 12 Data Surat Keluar
• Mengelola Arsip
Gambar 4. 13 Mengelola Arsip
• Mengajukan Permohonan
Gambar 4. 14 Mengajukan Permohonan
• Melihat Laporan dan Rekapitulasi
Gambar 4. 15 Melihat Laporan dan Rekapitulasi
d) Class Diagram
Gambar 4. 16 Class Diagram
a) ERD
Gambar 4. 17 ERD
a) Sequence Diagram
• Mengelola Pengguna
Gambar 4. 18 Mengelola Pengguna
• Melihat Dashboard Statistik
Gambar 4. 19 Melihat Dashboard Statistik
•
• Mengelola Surat Masuk
Gambar 4. 20 Mengelola Surat Masuk
• Mengelola Surat Disposisi
Gambar 4. 21 Mengelola Surat Disposisi
• Mengelola Surat Keluar
Gambar 4. 22 Mengelola Surat Keluar
• Mengelola Arsip
Gambar 4. 23 Mengelola Arsip
• Melihat Laporan Rekapitulasi
Gambar 4. 24 Melihat Laporan Rekapitulasi
• Mengajukan permohonan surat
Gambar 4. 25 Mengajukan Permohonan
4.2 Hasil Rancangan
• Halaman Dashboard Admin
Halaman Dashboard Admin berfungsi sebagai pusat informasi utama bagi administrator. Fitur
ini menampilkan ringkasan statistik terkini mengenai jumlah surat masuk, surat keluar,
disposisi, dan arsip. Terdapat juga grafik aktivitas yang memudahkan admin dalam memantau
tren persuratan bulanan serta status pengajuan yang memerlukan tindak lanjut.
Gambar 4. 26 Halaman Dashboard Admin
• Halaman Mengelola Pengguna
Halaman Mengelola Pengguna digunakan oleh Admin untuk mengelola hak akses sistem. Pada
fitur ini, admin dapat melihat daftar seluruh pegawai yang terdaftar, menambahkan pengguna
baru, serta memperbarui peran (role) pengguna seperti Staff, Kepala Unit, atau Kasubbag, guna
memastikan keamanan dan delegasi tugas yang tepat.
Gambar 4. 27 Halaman Mengelola Pengguna
• Halaman Buat Surat Masuk (Staff)
Halaman Input Surat Masuk memfasilitasi Staff TU untuk mendigitalkan surat fisik yang
diterima. Fitur ini menyediakan formulir lengkap untuk mencatat metadata surat (seperti nomor
agenda, perihal, dan pengirim) serta mengunggah pindaian dokumen asli dalam format PDF,
sehingga surat dapat diproses lebih lanjut secara digital."
Gambar 4. 28 Halaman Buat Surat Masuk (Staff)
• Halaman Surat Masuk Aktif (Staff)
Halaman Surat Masuk Aktif berfungsi sebagai dashboard monitoring bagi Staff TU untuk
mengelola surat yang sedang berproses. Pada halaman ini, staff dapat melihat surat-surat baru
yang telah didata dan bertugas untuk meneruskan surat tersebut kepada pimpinan (Kepala
Unit/Kasubbag) guna mendapatkan instruksi disposisi lebih lanjut.
Gambar 4. 29 Halaman Surat Masuk Aktif (Staff)
• Halaman Surat Masuk Aktif / Inbox (Pimpinan)
Halaman Kotak Masuk Disposisi menampilkan daftar surat yang telah didisposisikan
oleh pimpinan kepada pegawai. Fitur ini memungkinkan pegawai untuk melihat tugas
yang diberikan, mengunduh lampiran surat, dan memperbarui status penyelesaian
tugas tersebut setelah dikerjakan.
Gambar 4. 30 Halaman Surat Masuk Aktif / Inbox (Pimpinan)
• Halaman Form Disposisi
Halaman Lembar Disposisi Digital digunakan oleh pimpinan untuk memberikan instruksi
tindak lanjut kepada bawahan. Pimpinan dapat memilih tujuan disposisi, menetapkan batas
waktu penyelesaian, dan menuliskan catatan instruksi spesifik, yang kemudian akan
ternotifikasi secara otomatis ke akun pegawai yang dituju.
Gambar 4. 31 Halaman Form Disposisi
• Data Surat Masuk
Halaman Data Surat Masuk berfungsi sebagai gudang arsip digital untuk seluruh surat masuk
yang telah selesai diproses. Halaman ini menyajikan rekapitulasi surat secara lengkap,
memungkinkan pengguna untuk mencari kembali dokumen lama, mengunduh salinan surat
dalam format PDF, serta melakukan proses pengarsipan fisik ke dalam rak penyimpanan.
Gambar 4. 32 Data Surat Masuk
• Halaman Buat Draft Surat Keluar
Halaman Pembuatan Draft Surat Keluar memfasilitasi staff dalam menyusun konsep surat
dinas. Staff dapat mengisi atribut surat (seperti tujuan dan perihal) serta mengunggah file draf
awal untuk diajukan ke proses verifikasi berjenjang sebelum surat tersebut disahkan.
Gambar 4. 33 Halaman Buat Draft Surat Keluar
• Halaman Review dan Verifikasi Surat
Halaman Verifikasi Surat Keluar digunakan oleh pejabat berwenang untuk memeriksa konsep
surat yang diajukan oleh staff. Pejabat dapat menyetujui draf untuk diproses lebih lanjut atau
mengembalikan draf tersebut dengan catatan revisi jika terdapat kesalahan, memastikan
kualitas dan keabsahan surat yang keluar.
Gambar 4. 34 Halaman Review dan Verifikasi Surat
• Data Surat Keluar
Halaman Data Surat Keluar menampilkan riwayat seluruh surat dinas yang telah berhasil
diterbitkan dan dikirimkan oleh instansi. Fitur ini memungkinkan staff untuk memantau surat-
surat yang telah sah, mengunduh dokumen final sebagai referensi, serta mengelola pengarsipan
surat keluar sesuai dengan prosedur administrasi yang berlaku.
Gambar 4. 35 Data Surat Keluar
• Halaman Arsip
Fitur Pengelolaan Arsip berfungsi untuk mencatat lokasi penyimpanan fisik dari setiap
dokumen. Sistem memetakan surat digital ke lokasi fisiknya (seperti Nomor Rak atau Box),
sehingga memudahkan pencarian kembali dokumen asli (retrieval) jika sewaktu-waktu
dibutuhkan
Gambar 4. 36 Halaman Arsip
• Halaman Laporan dan Rekapitulasi
Halaman Laporan Rekapitulasi menyajikan ikhtisar data persuratan dalam periode tertentu.
Fitur ini membantu manajemen dalam melakukan evaluasi kinerja administrasi serta
menyediakan opsi ekspor data ke format cetak (PDF) untuk keperluan pelaporan resmi instansi.
Gambar 4. 37 Halaman Laporan dan Rekapitulasi
• Halaman Mengajukan Permohonan
Halaman Pengajuan Permohonan memfasilitasi masyarakat untuk mengajukan layanan
persuratan secara daring. Pemohon dapat mengisi formulir kebutuhan, mengunggah berkas
persyaratan, dan mendapatkan bukti registrasi, sehingga mengurangi kebutuhan tatap muka
untuk proses administratif awal.
Gambar 4. 38 Halaman Mengajukan Permohonan
4.3 Verifikasi Hasil Rancangan
Verifikasi hasil rancangan dilakukan untuk memastikan bahwa seluruh modul pada sistem
informasi surat menyurat berbasis website telah berfungsi sesuai dengan kebutuhan fungsional
dan rancangan sistem yang telah ditetapkan. Proses verifikasi dilakukan melalui pengujian
fungsional menggunakan pendekatan Black Box Testing dengan teknik State Transition
Testing. Pengujian difokuskan pada perilaku sistem terhadap perubahan kondisi (state) yang
terjadi akibat aksi pengguna, sehingga dapat dipastikan bahwa setiap alur proses berjalan secara
benar dan terkontrol.
4.3.1 Modul Autentikasi Pengguna
Tabel 4. 24 Modul Autentitas Pengguna
Website UPPD Kalideres
Page
• Registrasi (link test case registrasi)
• Login (link test case login)
Teknik Testing State Transition
Modul registrasi dan login merupakan satu kesatuan modul autentikasi pengguna yang
berfungsi sebagai gerbang utama dalam mengakses sistem. Pengujian pada modul ini dilakukan
untuk memastikan bahwa proses pendaftaran pengguna baru serta proses autentikasi berjalan
sesuai dengan alur dan aturan sistem yang telah dirancang.
4.3.2 Modul Mengelola Pengguna
Tabel 4. 25 Modul Mengelola Pengguna
Website UPPD Kalideres
Page • Mengelola Pengguna (link test case
mengelola pengguna)
Teknik Testing State Transition
Pengujian modul manajemen pengguna bertujuan untuk memastikan sistem dapat mengelola
data pengguna dan hak akses sesuai dengan peran yang diberikan. Pengujian mencakup proses
penambahan pengguna, perubahan data pengguna, pengaturan peran, serta penonaktifan
pengguna. Hasil pengujian menunjukkan bahwa setiap perubahan data dan status pengguna
dapat dilakukan sesuai dengan hak akses yang dimiliki, serta sistem mampu menjaga
konsistensi data pengguna berdasarkan peran yang ditetapkan.
4.3.3 Modul Surat Masuk
Tabel 4. 26 Modul Surat Masuk
Website UPPD Kalideres
Page
• Buat Surat Masuk (link test case buat surat
masuk)
• Surat Masuk Aktif (link test case surat masuk
aktif)
Teknik Testing State Transition
Pengujian modul surat masuk dilakukan untuk memastikan proses pencatatan dan pengelolaan
surat masuk berjalan sesuai dengan alur yang telah dirancang. Modul ini diuji dengan
memperhatikan perubahan status surat pada setiap tahapan proses. Berdasarkan hasil
pengujian, sistem mampu mengelola perubahan status surat masuk
4.3.4 Modul Disposisi
Tabel 4. 27 Modul Disposisi
Website UPPD Kalideres
Page • Disposisi (link test case disposisi)
Teknik Testing State Transition
Pengujian modul disposisi surat dilakukan untuk memastikan proses pendistribusian dan tindak
lanjut surat berjalan dengan baik. Modul ini melibatkan beberapa peran pengguna dan
perubahan status surat yang saling berkaitan. Hasil pengujian menunjukkan bahwa sistem
hanya mengizinkan proses disposisi dilakukan oleh pengguna yang memiliki hak akses sesuai,
serta setiap perubahan status disposisi tercatat dan berjalan sesuai dengan alur yang telah
dirancang.
4.3.5 Modul Surat Keluar
Tabel 4. 28 Modul Surat Keluar
Website UPPD Kalideres
Page
• Buat Surat Keluar (link test case buat surat keluar)
• Review Surat Keluar (link test case review surat
keluar)
Teknik Testing State Transition
Pengujian modul surat keluar bertujuan untuk memastikan proses pembuatan, pemeriksaan,
dan penyelesaian surat keluar berjalan sesuai dengan tahapan yang telah ditentukan. Pengujian
difokuskan pada perubahan status surat dari tahap Draft hingga surat dinyatakan selesai. Hasil
pengujian menunjukkan bahwa sistem mampu mengelola setiap tahapan proses surat keluar
secara berurutan dan konsisten, sehingga proses administrasi surat keluar dapat berjalan dengan
baik.
4.3.6 Modul Arsip
Tabel 4. 29 Modul Arsip
Website UPPD Kalideres
Page • Arsip (link test case arsip)
Teknik Testing State Transition
Pengujian modul arsip surat dilakukan untuk memastikan surat yang telah selesai diproses
dapat disimpan dan diakses kembali dengan benar. Pengujian mencakup proses penyimpanan,
pencarian, dan penampilan data arsip surat. Hasil pengujian menunjukkan bahwa sistem
mampu menyimpan data arsip secara konsisten dan menampilkan informasi arsip sesuai
dengan kebutuhan pengguna dan hak akses yang dimiliki.
4.3.7 Modul Laporan dan Rekapitulasi
Tabel 4. 30 Modul Laporan Dan Rekapitulasi
Website UPPD Kalideres
Page • Laporan & Rekapitulasi (link test case
laporan dan rekapitulasi)
Teknik Testing State Transition
Verifikasi pada modul Laporan dan Rekapitulasi bertujuan untuk memastikan sistem dapat
menghasilkan informasi rekap surat masuk dan surat keluar secara akurat dan sistematis.
Berdasarkan hasil pengujian, sistem mampu menampilkan laporan dan rekapitulasi surat secara
otomatis sesuai periode yang dipilih, baik dalam bentuk tabel maupun ringkasan data. Modul
ini membantu pihak administrasi dan kepala unit dalam melakukan monitoring aktivitas surat
menyurat, sehingga mendukung pengambilan keputusan yang lebih cepat dan berbasis data.
4.3.8 Modul Mengajukan Permohonan
Tabel 4. 31 Modul Mengajukan Permohonan
Website UPPD Kalideres
Page • Buat Permohonan (link test case buat permohonan)
• Verifikasi (link test case verifikasi)
Teknik Testing State Transition
Modul Pengajuan Permohonan diverifikasi untuk memastikan bahwa masyarakat atau
pemohon dapat mengajukan permohonan surat secara daring dan memantau status permohonan
tersebut. Hasil verifikasi menunjukkan bahwa sistem berhasil menerima data permohonan,
menyimpan informasi secara valid, serta menampilkan status permohonan secara real-time
sesuai proses yang berjalan.
BAB V
ANALISIS BIAYA & KELAYAKAN PERANCANGAN
5.1 Identifikasi Biaya Terkait Rancangan
Pada subbab ini, dilakukan identifikasi seluruh komponen biaya yang dikeluarkan selama
proses perancangan Sistem Informasi Surat Menyurat di UPPD Kalideres. Komponen biaya
dibagi menjadi tiga kategori utama: biaya tenaga kerja, biaya perangkat dan infrastruktur, serta
biaya operasional.
5.1.1 Biaya Tenaga Kerja
Biaya tenaga kerja dihitung berdasarkan durasi pengerjaan proyek selama satu semester (±4
bulan) oleh tim peneliti yang terdiri dari 3 orang mahasiswa Sistem Informasi. Sebagai acuan
dasar perhitungan, digunakan nilai Minimum Upah Provinsi (UMP) DKI Jakarta tahun
2024/2025 sebesar Rp5.067.381 (dibulatkan menjadi Rp5.070.000 untuk kemudahan
perhitungan).
Tabel 5. 1 Biaya Tenaga Kerja
No Pengembang web Durasi Gaji per bulan Total biaya
1 Faqih Muhammad ’Azzam Falahi 4 Rp5.070.000 Rp20.280.000
2 Guspa Riyadi 4 Rp5.070.000 Rp20.280.000
3 Yohana Mutiara Hutabalian 4 Rp5.070.000 Rp20.280.000
Total Biaya Keseluruhan Rp60.840.000
5.1.2 Biaya Perangkat & Infrastruktur
Komponen ini mencakup biaya penyediaan perangkat keras dan perangkat lunak yang
diperlukan untuk membangun dan menjalankan sistem berbasis Laravel dan MySQL.
Meskipun perancangan menggunakan perangkat yang tersedia di instansi, nilai ekonomisnya
tetap diperhitungkan sebagai bagian dari total investasi sistem.
Tabel 5. 2 Biaya Perangkat & Infrastruktur
No Komponen Kuantitas Estimasi biaya Keterangan
1 Pendaftaran domain (.com) 1 Tahun Rp310.000 Harga tahun
pertama sesuai
pasar
(Hostinger)
2 Hosting VPS KVM 4 12 Bulan Rp2.100.000 Sesuai
spesifikasi
teknis (4 core
CPU, 8 GB
RAM)
3 Sertifikat SSL 1 Tahun Rp0 Sudah termasuk
dalam paket
VPS/hosting di
Hostinger
4 Laptop pengembangan 3 Unit Rp18.000.000 Alokasi nilai
pakai perangkat
tim selama 4
bulan.
Total Biaya Keseluruhan Rp20.410.000
5.1.3 Biaya Operasional
Biaya operasional mencakup kebutuhan pendukung selama masa di hari kerja dan tahap
pengerjaan teknis di lapangan.
Tabel 5. 3 Biaya Oprasional
N
o
Jenis biaya Kuanti
tas
Biaya per
bulan / tahun
Total (4
bulan)
Keterangan
1 Koneksi internet 4 bulan Rp300.000 Rp1.200.00
0
Kebutuhan
riset dan
koordinasi tim
secara daring.
2 Transportasi ke objek 4 bulan Rp500.000 Rp2.000.00
0
Biaya
perjalanan ke
UPPD
Kalideres
untuk
observasi &
wawancara.
3 Konsumsi tim 4 bulan Rp500.000 Rp2.000.00
0
Makan/minum
selama
pengerjaan
proyek dan
kunjungan
lapangan.
4 Percetakan &
dokumentasi
1 paket Rp1.000.000 Rp1.000.00
0
Cetak Laporan
Akhir, Poster
A2 pameran,
dan Manual
Book.
Total Biaya
Keseluruhan
Rp6.200.00
0
5.1.4 Rekapitulasi Total Biaya Perancangan
Berdasarkan identifikasi di atas, maka total biaya yang dibutuhkan untuk perancangan dan
persiapan implementasi Sistem Informasi Surat Menyurat pada UPPD Kalideres adalah sebagai
berikut:
Tabel 5. 4 Rekapitulasi Total Biaya Perancangan
Kategori komponen biaya Total nilai
Biaya tenaga kerja Rp60.840.000
Biaya perangkat & infrastruktur Rp20.410.000
Biaya operasional Rp6.200.000
Total biaya keseluruhan Rp87.450.000
5.2 Analisis Kelayakan Perancangan
Analisis kelayakan dilakukan untuk menilai apakah manfaat yang dihasilkan dari implementasi
sistem informasi surat menyurat sebanding dengan total investasi sebesar Rp75.250.000.
Analisis ini membandingkan penghematan yang dihasilkan dengan biaya perancangan yang
telah dikeluarkan.
5.2.1 Identifikasi Manfaat
Manfaat dari penerapan sistem ini diidentifikasi melalui dua kategori, yaitu manfaat berwujud
(tangible) dan tidak berwujud (intangible).
a) Manfaat Berwujud (Tangibel Benefit) Manfaat berwujud adalah keuntungan ekonomi yang
dapat dihitung secara langsung dalam nilai rupiah:
1. Reduksi Biaya Alat Tulis Kantor (TAK): Pengurangan volume penggunaan kertas,
tinta printer, dan map fisik karena proses dan sebagian pengarsipan dialihkan ke
format digital.
2. Reduksi biaya pengadaan sarana fisik: Menghilangkan kebutuhan penambahan
lemari arsip baru secara rutin karena seluruh dokumen tersimpan dalam basis data
terpusat.
3. Percepatan waktu akses dan distribusi data: Pengurangan durasi yang dibutuhkan
staf dalam mencari satu dokumen surat tertentu atau mendistribusikan disposisi
dibandingkan dengan metode manual, yang jika dikonversi kenilai jam kerja (man-
hours) menghasilkan penghematan biaya operasional.
4. Standardisasi dan kerapihan dokumen digital: Peningkatan pencatatan data yang
seragam secara sistematis untuk mencegah kerugian finansial akibat kesalahan
penomoran agenda atau kehilangan data pada buku catatan manual.
b) Manfaat tidak berwujud (Intangible benefits) Manfaat yang mendukung kualitas kerja
namun tidak diukur secara finansial:
1. Peningkatan Keamanan Dokumen: Perlindungan data melalui enkripsi AES-256
dan backup rutin untuk mencegah kehilangan data akibat kerusakan fisik
2. Kemudahan Pelacakan (Tracking): Masyarakat dan pimpinan dapat memantau
status surat secara real-time melalui sistem tanpa perlu konfirmasi manual yang
berulang.
3. Akuntabilitas Penugasan: Tersedianya jejak digital (log) yang jelas mengenai siapa
dan kapan sebuah surat disposisi diterima serta diselesaikan.
5.2.2 Analisis Kelayakan Finansial
Analisis kelayakan finansial dilakukan untuk menilai tingkat pengembalian investasi dari
perancangan sistem informasi surat menyurat pada UPPD Kalideres. Perhitungan ini
membandingkan total biaya investasi yang dikeluarkan pada tahap perancangan sebesar
Rp87.450.000 dengan proyeksi manfaat berwujud (tangible benefits) yang dihasilkan dalam
satu tahun operasional.
Tabel 5. 5 Analisis Kelayakan Finansial
No Komponen Manfaat Deskripsi Perhitungan Nilai per Tahun
Reduksi Biaya Alat Tulis
Kantor (ATK)
Penghematan kertas (~1,2
rim/bulan), tinta, dan map
(Rp250.000 x 12)
Rp3.000.000
Reduksi Biaya Pengadaan
Sarana Fisik
Estimasi harga 1 unit lemari arsip
baru per tahun
Rp1.500.000
Nilai Percepatan Waktu Kerja
Staf (Man-Hours)
19 Jam/bulan x Rp31.687 x 12
bulan (asumsi upah per jam
sesuai UMP)
Rp7.224.636
Reduksi Biaya Distribusi
Disposisi Fisik
Estimasi biaya operasional
kurir/distribusi internal
(Rp100.000 x 12)
Rp1.200.000
Total Manfaat Per Tahun Rp12.924.636
Metode Payback Period (Masa Pengembalian Investasi) digunakan untuk menghitung jangka
waktu yang dibutuhkan agar nilai investasi awal dapat tertutup oleh aliran manfaat yang
dihasilkan oleh sistem.
𝑃𝑎𝑦𝑏𝑎𝑐𝑘 𝑃𝑒𝑟𝑖𝑜𝑑 = 𝑇𝑜𝑡𝑎𝑙 𝐼𝑛𝑣𝑒𝑠𝑡𝑎𝑠𝑖
𝑇𝑜𝑡𝑎𝑙 𝑀𝑎𝑛𝑓𝑎𝑎𝑡 𝑃𝑒𝑟 𝑇𝑎ℎ𝑢𝑛
𝑃𝑎𝑦𝑏𝑎𝑐𝑘 𝑃𝑒𝑟𝑖𝑜𝑑 = 𝑅𝑝87.450.000
𝑅𝑝12.924.636
𝑃𝑎𝑦𝑏𝑎𝑐𝑘 𝑃𝑒𝑟𝑖𝑜𝑑 ≈ 6,8 𝑇𝑎ℎ𝑢𝑛
Interpretasi Kelayakan Berdasarkan hasil perhitungan di atas, masa pengembalian investasi
(Payback Period) untuk pengembangan sistem informasi ini adalah kurang lebih 5,8 tahun.
Mengingat sistem informasi ini merupakan infrastruktur digital jangka panjang yang
mendukung kebijakan Sistem Pemerintahan Berbasis Elektronik (SPBE), nilai tersebut dinilai
sangat layak. Selain penghematan finansial yang terukur, sistem ini juga memberikan nilai
tambah berupa standardisasi dan kerapihan dokumentasi digital yang mencegah risiko kerugian
administratif akibat kehilangan data atau kesalahan pencatatan manual. Dengan demikian,
perancangan Sistem Informasi Surat Menyurat pada UPPD Kalideres dinyatakan Layak untuk
diimplementasikan.
5.2.3 Analisis kelayakan hasil rancangan
Analisis kelayakan hasil rancangan dilakukan untuk menilai sejauh mana sistem informasi
surat menyurat berbasis website yang telah dirancang dapat diterapkan secara nyata di
lingkungan UPPD Kalideres. Penilaian ini mempertimbangkan ketercapaian tujuan
perancangan, kesesuaian hasil rancangan dengan kebutuhan pengguna, serta kesiapan
organisasi dalam mengadopsi sistem yang diusulkan. Analisis ini berperan sebagai penghubung
antara analisis manfaat, kelayakan finansial, dan rencana implementasi agar sistem tidak hanya
layak secara konseptual, tetapi juga siap digunakan secara praktis.
1. Kelayakan Teknis (Technical Feasibility)
hasil rancangan telah memenuhi kebutuhan operasional instansi dengan memanfaatkan
teknologi yang sesuai dengan infrastruktur yang tersedia. Sistem dibangun menggunakan
framework Laravel dan basis data MySQL yang bersifat open-source, memiliki dokumentasi
yang lengkap, serta didukung oleh komunitas pengembang yang luas. Teknologi tersebut
memungkinkan sistem dijalankan pada lingkungan server yang sudah dimiliki instansi tanpa
memerlukan investasi perangkat keras tambahan. Selain itu, sistem berbasis web
memungkinkan akses melalui perangkat kerja yang telah tersedia. Penerapan mekanisme
keamanan seperti autentikasi berbasis peran, enkripsi data, serta backup basis data secara
berkala menunjukkan bahwa sistem layak digunakan untuk mengelola dokumen dinas yang
bersifat penting dan sensitif.
2. Kelayakan Operasional (Operational Feasibility)
hasil rancangan dinilai sesuai dengan kondisi sumber daya manusia di UPPD Kalideres.
Antarmuka sistem dirancang sederhana, konsisten, dan menggunakan Bahasa Indonesia yang
baku sehingga mudah dipahami oleh pegawai non-IT. Seluruh fungsi utama, seperti
pengelolaan surat masuk, disposisi digital, pembuatan surat keluar, serta pengarsipan, telah
disesuaikan dengan alur kerja yang sebelumnya dilakukan secara manual. Dengan demikian,
sistem tidak mengubah proses bisnis secara drastis, melainkan mendigitalisasi proses yang
telah berjalan. Hasil pengujian fungsional dan uji penerimaan pengguna menunjukkan bahwa
sistem dapat digunakan dengan baik dan diterima oleh pengguna, sehingga mendukung
kelayakan operasional hasil rancangan.
Selain dilakukan melalui pengamatan operasional, kelayakan operasional juga dianalisis lebih
lanjut menggunakan pengujian System Usability Scale (SUS). SUS merupakan metode
evaluasi yang telah diakui secara internasional untuk mengukur tingkat kemudahan
penggunaan suatu sistem melalui sepuluh butir pernyataan berbasis skala Likert. Pengujian ini
digunakan untuk menilai persepsi pengguna terhadap aspek kemudahan operasional,
konsistensi tampilan antarmuka, kenyamanan penggunaan, tingkat kompleksitas sistem, serta
tingkat kepercayaan diri pengguna dalam mengoperasikan sistem.
Instrumen Pengujian System Usability Scale (SUS)
Tabel 5. 6 Pertanyaan Pengujian System Usability Scale
NO Pernyataan Instrumen SUS
1 Saya merasa ingin sering menggunakan sistem informasi surat menyurat berbasis
website ini.
2 Saya merasa sistem ini terlalu rumit untuk digunakan.
3 Saya merasa sistem ini mudah digunakan dalam menjalankan proses surat masuk,
disposisi, dan surat keluar.
4 Saya merasa perlu bantuan orang lain atau staf IT untuk dapat menggunakan sistem
ini.
NO Pernyataan Instrumen SUS
5 Saya merasa fitur-fitur dalam sistem ini terintegrasi dengan baik (dashboard, surat
masuk, disposisi, arsip, dan laporan).
6 Saya merasa terdapat terlalu banyak ketidak Konsistenan pada tampilan atau alur
penggunaan sistem ini.
7 Saya merasa kebanyakan pengguna akan dapat mempelajari sistem ini dengan cepat.
8 Saya merasa sistem ini membingungkan atau tidak jelas saat digunakan.
9 Saya merasa percaya diri menggunakan sistem ini untuk mengelola administrasi
surat.
10 Saya merasa perlu mempelajari banyak hal terlebih dahulu sebelum dapat
menggunakan sistem ini secara efektif.
Perhitungan SUS dilakukan dengan mengonversi jawaban Likert menjadi nilai 1–5. Setiap item
ganjil (1, 3, 5, 7, 9) dihitung menggunakan rumus (jawaban − 1), sedangkan item genap (2, 4,
6, 8, 10) dihitung menggunakan rumus (5 − jawaban) sehingga setiap item menghasilkan nilai
0–4. Skor total (TOTAL) diperoleh dari penjumlahan seluruh X1–X10, kemudian dikonversi
menjadi nilai SUS menggunakan rumus SUS = TOTAL × 2.5, menghasilkan rentang skor 0–
100.
Hasil Penilaian responden
Pengujian melibatkan 10 responden, dan setiap jawaban dikonversi menjadi skor X1–X10
sesuai metode SUS. Hasil perhitungan setiap responden disajikan pada tabel berikut:
Tabel 5. 7 Hasil Penilaian Responden
Resp X1 X2 X3 X4 X5 X6 X7 X8 X9 X10 Total Skor Akhir
(Total x 2,5)
1 2 2 4 0 3 0 2 0 2 1 16 40
2 4 3 3 3 4 4 3 4 4 4 36 90
3 4 4 4 4 4 4 4 4 4 4 40 100
4 2 3 4 2 4 3 3 4 4 2 31 77,5
5 4 0 4 0 4 0 4 0 4 0 20 50
6 3 3 3 3 3 3 3 3 3 2 29 72,5
7 2 2 3 1 3 1 3 2 3 2 22 55
8 3 1 3 2 3 3 3 3 3 2 26 65
9 2 3 3 3 2 3 2 3 2 1 24 60
10 3 4 2 0 4 1 4 4 4 4 30 75
Rata-Rata 68,5
Berdasarkan hasil perhitungan SUS pada tabel di atas, diperoleh skor rata-rata sebesar 68,5.
Nilai ini dihitung dari jumlah seluruh skor SUS responden dibagi jumlah responden, yaitu 10
orang. Dengan skor 68,5, sistem berada pada kategori Marginal High, Grade C, dan Adjective
Rating OK.
Interpretasi Skor SUS Menggunakan Acceptability, Grade Scale, dan Adjective Rating
Interpretasi dilakukan dengan membandingkan nilai rata-rata SUS (68,5) terhadap grafik
interpretasi Bangor et al. (2009), yang mencakup tiga indikator utama:
A. Acceptability Range
Dengan nilai SUS sebesar 68,5, sistem berada pada kategori Marginal High. Kategori ini
menunjukkan bahwa sistem berada di ambang batas antara dapat diterima (acceptable) dan
tidak dapat diterima. Meskipun sistem sudah fungsional, masih diperlukan beberapa perbaikan
untuk memastikan sistem benar-benar memenuhi standar penerimaan pengguna secara penuh.
B. Grade Scale
Nilai 68,5 berada pada rentang 68–72,9, sehingga termasuk Grade C. Kategori ini
menunjukkan bahwa tingkat usability sistem berada pada level rata-rata atau standar industri.
Hasil ini memberikan indikasi bahwa masih terdapat ruang yang cukup luas untuk peningkatan
fitur atau antarmuka agar dapat mencapai Grade B atau A.
C. Adjective Rating
Nilai 68,5 berada pada rentang 40–70, sehingga termasuk kategori OK. Kategori ini
menggambarkan bahwa pengguna merasa sistem cukup memadai untuk digunakan dalam
aktivitas operasional, namun pengalaman pengguna belum mencapai tingkat yang memuaskan
atau "Good".
Kesimpulan Kelayakan Operasional Berbasis SUS
Berdasarkan hasil pengujian SUS yang dibandingkan dengan skala interpretasi Acceptability,
Grade Scale, dan Adjective Rating, dapat disimpulkan bahwa:
• Acceptability Range berada pada kategori Marginal High.
• Grade Scale berada pada kategori C.
• Adjective Rating berada pada kategori OK.
Dengan demikian, sistem informasi manajemen inventory ini dinilai layak secara fungsional
namun berada pada posisi marginal untuk kegunaannya. Sistem sudah dapat
diimplementasikan pada UPPD Kalideres, namun sangat disarankan untuk melakukan
penyempurnaan pada aspek kemudahan penggunaan agar dapat meningkatkan kenyamanan
serta efisiensi pengguna secara menyeluruh.
5.3 Rencana Implementasi Hasil Rancangan
Rencana implementasi menjelaskan tahapan aktivitas dan sumber daya yang diperlukan agar
Sistem Informasi Surat Menyurat dapat dioperasikan secara penuh di lingkungan UPPD
Kalideres. Strategi transisi yang dipilih adalah Operasi Paralel, di mana sistem baru dijalankan
bersamaan dengan sistem manual untuk sementara waktu guna menjamin integritas data selama
masa transisi.
5.3.1 Tahapan Aktivitas Implementasi
Proses implementasi direncanakan berlangsung secara sistematis melalui rangkaian aktivitas
berikut:
1. Persiapan Infrastruktur Digital: Melakukan pendaftaran domain .com dan
penyewaan hosting VPS KVM 4 sesuai spesifikasi minimal (4 Core CPU, 8 GB RAM)
yang telah diidentifikasi pada analisis biaya sebelumnya.
2. Instalasi dan Konfigurasi: Mengunggah kode program berbasis framework Laravel
ke peladen (server) dan melakukan konfigurasi basis data MySQL agar sistem dapat
diakses secara stabil oleh seluruh unit kerja.
3. Migrasi Data Awal: Memasukkan data referensi awal seperti profil pegawai, peran
akses (Admin, Staff TU, Kasubbag TU, Kepala Unit), dan klasifikasi jenis surat ke
dalam basis data.
4. Pelatihan Pengguna (User Training): Menyelenggarakan sesi pelatihan teknis bagi
seluruh aktor yang terlibat mengenai cara penggunaan fitur manajemen surat masuk,
alur disposisi digital, pembuatan surat keluar, hingga akses pelacakan surat bagi
masyarakat.
5. Masa Transisi (Operasi Paralel): Menjalankan pencatatan pada sistem berbasis
website secara bersamaan dengan buku agenda manual atau Excel selama minimal satu
bulan. Hal ini bertujuan untuk memverifikasi akurasi data sistem terhadap data fisik.
6. Operasi Penuh (Go-Live): Setelah sistem dinyatakan stabil dan pengguna telah mahir,
sistem website menjadi satu-satunya sarana utama administrasi surat menyurat di
UPPD Kalideres.
5.3.2 Kebutuhan Sumber Daya Manusia
Keberlanjutan sistem ini bergantung pada pembagian peran SDM yang jelas sebagai berikut:
1. Administrator Sistem: Mengelola pemeliharaan server, keamanan akses, dan
melakukan cadangan (backup) data secara rutin.
2. Staf TU (Operator): Bertanggung jawab atas input data surat masuk, digitalisasi
dokumen melalui pemindaian, dan pengelolaan draf surat keluar.
3. Kasubbag TU & Kepala Unit: Bertanggung jawab atas validasi disposisi dan
persetujuan surat keluar melalui sistem.
5.3.3 Kebutuhan Fasilitas
Fasilitas fisik dan non-fisik yang harus tersedia untuk mendukung implementasi meliputi:
1. Perangkat Keras: Peladen VPS, perangkat komputer atau laptop bagi setiap aktor,
jaringan internet kantor yang stabil, dan alat pemindai (scanner) dokumen.
2. Perangkat Lunak: Peramban web (Google Chrome atau Mozilla Firefox) versi terbaru.
3. Dokumentasi: Buku panduan penggunaan (Manual Book) dalam format digital dan
cetak untuk membantu pengguna menyelesaikan kendala operasional secara mandiri.
BAB VI EVALUASI DAN VALIDASI HASIL RANCANGAN
6.1 Validasi Hasil Rancangan
Validasi hasil rancangan dilakukan untuk memastikan bahwa Sistem Informasi Surat
Menyurat berbasis website yang telah dirancang benar-benar sesuai dengan kebutuhan
operasional UPPD Kalideres serta mampu menjawab permasalahan utama yang
diidentifikasi pada tahap analisis kebutuhan. Proses validasi difokuskan pada
kesesuaian fungsi sistem dengan alur kerja persuratan yang berjalan serta tingkat
kemudahan penggunaan sistem oleh pengguna internal sebagai pemangku kepentingan
utama.
Validasi dilakukan setelah sistem selesai dirancang dan melewati tahap pengujian
fungsional. Metode validasi yang digunakan adalah System Usability Scale (SUS),
yaitu metode pengukuran usability standar yang digunakan untuk menilai tingkat
kemudahan penggunaan suatu sistem melalui kuesioner berisi sepuluh pernyataan
dengan skala Likert.
Skenario penggunaan sistem yang diuji dalam pengisian kuesioner SUS meliputi
pencatatan surat masuk, proses disposisi digital, pembuatan dan verifikasi surat keluar,
pengelolaan arsip digital, serta pengaksesan laporan rekapitulasi surat. Hasil penilaian
SUS digunakan untuk mengetahui persepsi pengguna terhadap kemudahan operasional
sistem, konsistensi tampilan, tingkat kompleksitas penggunaan, serta kepercayaan diri
pengguna dalam mengoperasikan sistem.
Tabel 6. 1 Hasil Validasi Sistem Berdasarkan System Usability Scale (SUS)
Permasalahan Hasil Rancangan Identitas
Stakeholder
Umpan Balik
Stakeholder
Pencatatan surat
masih dilakukan
secara manual
sehingga rawan
kesalahan
Sistem pencatatan
surat masuk dan
surat keluar
berbasis web
dengan basis data
terpusat
Staff TU
Proses pencatatan
dinilai lebih
mudah, rapi, dan
cepat digunakan
Permasalahan Hasil Rancangan Identitas
Stakeholder
Umpan Balik
Stakeholder
Proses disposisi
surat memerlukan
waktu lama
Disposisi surat
dilakukan secara
digital melalui
sistem
Kepala Unit /
Kasubbag TU
Alur disposisi
dinilai lebih
sederhana dan
mudah dipahami
Arsip surat sulit
dicari kembali
Arsip surat digital
dengan fitur
pencarian
Staff TU /
Kasubbag TU
Proses pencarian
arsip dinilai lebih
praktis
dibandingkan arsip
fisik
Pembuatan laporan
rekapitulasi
memakan waktu
lama
Laporan surat
masuk dan surat
keluar dihasilkan
secara otomatis
Kepala Unit
Penyajian laporan
dinilai mudah
diakses dan jelas
Antarmuka sistem
baru berpotensi
sulit dipahami
Antarmuka
sederhana dan
konsisten
Pengguna Internal
Sistem dinilai
mudah dipelajari
dan digunakan
tanpa kesulitan
berarti
Berdasarkan hasil pengujian System Usability Scale (SUS) dan umpan balik pengguna,
dapat disimpulkan bahwa hasil rancangan sistem telah memenuhi aspek kemudahan
penggunaan (usability) serta selaras dengan kebutuhan operasional pengguna. Oleh
karena itu, hasil rancangan dinyatakan valid dan dapat digunakan dalam mendukung
administrasi surat menyurat di UPPD Kalideres.
6.2 Evaluasi Hasil Rancangan
Evaluasi hasil rancangan dilakukan untuk menilai sejauh mana Sistem Informasi Surat
Menyurat berbasis website yang telah dirancang mampu memberikan perbaikan
terhadap permasalahan administrasi persuratan di UPPD Kalideres. Evaluasi ini
dilakukan dengan membandingkan kondisi sebelum sistem dirancang (as-is) dan
kondisi setelah rancangan sistem diterapkan (to-be) secara konseptual, serta dikaitkan
dengan tujuan perancangan yang telah ditetapkan pada Bab I.
Perbandingan ini bertujuan untuk melihat perubahan yang diharapkan dari penerapan
sistem, baik dari sisi efisiensi proses kerja, ketertiban administrasi, maupun kemudahan
penggunaan sistem oleh pengguna internal.
Perbandingan Kondisi As-Is dan To-Be
Tabel 6. 2 Perbandingan Kondisi As-Is dan To-Be Sistem Surat Menyurat
As-Is (Sebelum) To-Be(Sesudah Rancangan) Manfaat / Kelebihan
Pencatatan surat masuk dan surat
keluar dilakukan secara manual
menggunakan buku agenda atau
file terpisah
Pencatatan surat dilakukan
secara digital dan
terintegrasi dalam satu
sistem berbasis web
Mengurangi kesalahan
pencatatan, meningkatkan
kerapihan data, dan
mempermudah pengelolaan
surat
Proses disposisi surat
memerlukan waktu lama karena
bergantung pada distribusi
dokumen fisik
Disposisi surat dilakukan
secara digital melalui sistem
Mempercepat alur disposisi dan
meningkatkan efisiensi kerja
pimpinan dan staf
Arsip surat disimpan dalam
bentuk fisik sehingga sulit dicari
dan berisiko hilang
Arsip surat disimpan secara
digital dan terpusat
Memudahkan pencarian arsip
dan mengurangi risiko
kehilangan dokumen
Pembuatan laporan rekapitulasi
surat dilakukan secara manual
dan memakan waktu
Laporan surat masuk dan
surat keluar dihasilkan
secara otomatis oleh sistem
Menghemat waktu dan
mendukung proses evaluasi
administrasi secara lebih cepat
Administrasi surat belum
memiliki alur kerja yang baku
dan terdokumentasi
Alur kerja persuratan
mengikuti proses sistem
yang terstandarisasi
Meningkatkan ketertiban,
konsistensi, dan akuntabilitas
administrasi
As-Is (Sebelum) To-Be(Sesudah Rancangan) Manfaat / Kelebihan
Penggunaan sistem digital
berpotensi menyulitkan pengguna
Antarmuka sistem dirancang
sederhana dan konsisten
Meningkatkan kenyamanan dan
kepercayaan diri pengguna
dalam menggunakan sistem
Analisis Ketercapaian Tujuan Perancangan
Berdasarkan perbandingan kondisi as-is dan to-be di atas, dapat disimpulkan bahwa
hasil rancangan sistem telah memenuhi tujuan perancangan, yaitu mendigitalisasi
proses administrasi surat, meningkatkan efisiensi kerja, serta memperbaiki pengelolaan
arsip di UPPD Kalideres. Perubahan yang dihasilkan oleh sistem menunjukkan adanya
peningkatan signifikan dibandingkan kondisi sebelumnya, khususnya dalam hal
kecepatan proses, ketertiban administrasi, dan kemudahan akses informasi.
Selain itu, hasil evaluasi ini diperkuat oleh pengujian usability menggunakan System
Usability Scale (SUS) pada tahap validasi, yang menunjukkan bahwa sistem berada
pada kategori Marginal High dengan nilai rata-rata 68,5. Hal ini mengindikasikan
bahwa sistem sudah dapat digunakan dalam mendukung kegiatan operasional,
meskipun masih terdapat ruang untuk penyempurnaan pada aspek kemudahan
penggunaan.
Dengan demikian, dapat disimpulkan bahwa hasil rancangan Sistem Informasi Surat
Menyurat berbasis website telah efektif dalam menjawab permasalahan yang ada dan
sesuai dengan tujuan perancangan yang telah ditetapkan, sehingga layak untuk
diimplementasikan di lingkungan UPPD Kalideres.
6.3 Penilaian Rekan
A. Faqih Muhammad ‘Azzam Falahi
Tabel 6. 3 Penilaian Faqih
Nama Faqih Muhammad ‘Azzam Falahi
Nim 1201224060
Kelompok 25
Aspek yang di nilai Bobot Pihak Yang di nilai
Rubrik yang Dipilih
1 2 3 4 5
Kemampuan Komuni
kasi dan
Memfasilitasi Tim
15% Faqih Muhammad
‘Azzam Falahi
    
Guspa Riyadi     
Yohana Mutiara
Hutabalian
    
Kemampuan Merenca
nakan, Mengorganisas
ikan
dan Melakukan Koor
dinasi
15% Faqih Muhammad
‘Azzam Falahi
    
Guspa Riyadi     
Yohana Mutiara
Hutabalian
    
Kemampuan
Pengambilan
15% Faqih Muhammad
‘Azzam Falahi
    
Guspa Riyadi     
Keputusan dan
Penyelesaian Konflik Yohana Mutiara
Hutabalian
    
Kemampuan Interpers
onal dan Kolaboratif 15%
Faqih Muhammad
‘Azzam Falahi
    
Guspa Riyadi     
Yohana Mutiara
Hutabalian
    
Kemampuan
Kepemimpinan dan
Pemantauan Kinerja
15% Faqih Muhammad
‘Azzam Falahi
    
Guspa Riyadi     
Yohana Mutiara
Hutabalian
    
Kontribusi Kinerja 25% Kelompok     
B. Guspa Riyadi
Tabel 6. 4 Penilaian Guspa
Nama Guspa Riyadi
Nim 1201226054
Kelompok 25
Aspek yang di nilai Bobot Pihak Yang di nilai
Rubrik yang Dipilih
1 2 3 4 5
Kemampuan Komunikasi dan
Memfasilitasi Tim
15% Faqih Muhammad
‘Azzam Falahi
    
Guspa Riyadi     
Yohana Mutiara
Hutabalian
    
Kemampuan Merencanakan, M
engorganisasikan
dan Melakukan Koordinasi
15% Faqih Muhammad
‘Azzam Falahi
    
Guspa Riyadi     
Yohana Mutiara
Hutabalian
    
Kemampuan Pengambilan
Keputusan dan Penyelesaian
Konflik
15% Faqih Muhammad
‘Azzam Falahi
    
Guspa Riyadi     
Yohana Mutiara
Hutabalian
    
Kemampuan Interpersonal
dan Kolaboratif 15%
Faqih Muhammad
‘Azzam Falahi
    
Guspa Riyadi     
Yohana Mutiara
Hutabalian
    
Kemampuan Kepemimpinan
dan Pemantauan Kinerja
15% Faqih Muhammad
‘Azzam Falahi
    
Guspa Riyadi     
Yohana Mutiara
Hutabalian
    
Kontribusi Kinerja 25% Kelompok     
C. Yohana Mutiara Hutabalian
Tabel 6. 5 Penilaian Yohana
Nama Yohana Mutiara Hutabalian
Nim 1201224009
Kelompok 25
Aspek yang di nilai Rubrik yang Dipilih
Bobot Pihak Yang
di nilai 1 2 3 4 5
Kemampuan Komunikasi dan
Memfasilitasi Tim
15% Faqih Muhammad
‘Azzam Falahi
    
Guspa Riyadi     
Yohana Mutiara
Hutabalian
    
Kemampuan Merencanakan, M
engorganisasikan
dan Melakukan Koordinasi
15% Faqih Muhammad
‘Azzam Falahi
    
Guspa Riyadi     
Yohana Mutiara
Hutabalian
    
Kemampuan Pengambilan
Keputusan dan Penyelesaian
Konflik
15% Faqih Muhammad
‘Azzam Falahi
    
Guspa Riyadi     
Yohana Mutiara
Hutabalian
    
Kemampuan Interpersonal
dan Kolaboratif
Faqih Muhammad
‘Azzam Falahi
    
15% Guspa Riyadi     
Yohana Mutiara
Hutabalian
    
Kemampuan Kepemimpinan
dan Pemantauan Kinerja
15% Faqih Muhammad
‘Azzam Falahi
    
Guspa Riyadi     
Yohana Mutiara
Hutabalian
    
Kontribusi Kinerja 25% Kelompok     
BAB VII KESIMPULAN DAN SARAN
7.1 Kesimpulan
Berdasarkan hasil perancangan, pengujian, serta evaluasi yang telah dilakukan pada
Sistem Informasi Surat Menyurat berbasis website di UPPD Kalideres, dapat ditarik
beberapa kesimpulan sebagai berikut. Pertama, sistem yang dirancang telah mampu
menjawab permasalahan utama pada proses administrasi persuratan yang
sebelumnya dilakukan secara manual, seperti keterlambatan disposisi, risiko
kehilangan dokumen, serta kesulitan dalam pencarian arsip. Digitalisasi proses
surat masuk, disposisi, surat keluar, dan pengarsipan berhasil menciptakan alur
kerja yang lebih terstruktur, terintegrasi, dan terdokumentasi dengan baik.
Kedua, hasil evaluasi dengan membandingkan kondisi sebelum (as-is) dan sesudah
rancangan (to-be) menunjukkan adanya peningkatan signifikan dalam efisiensi
proses kerja, ketertiban administrasi, serta kemudahan monitoring status surat.
Proses disposisi yang sebelumnya bergantung pada dokumen fisik kini dapat
dilakukan secara digital, sehingga mempercepat pengambilan keputusan dan
distribusi tugas kepada pegawai terkait. Selain itu, sistem mampu menghasilkan
laporan rekapitulasi secara otomatis yang mendukung kebutuhan manajerial dan
pengambilan keputusan berbasis data.
Ketiga, berdasarkan hasil validasi dan evaluasi usability menggunakan metode
System Usability Scale (SUS), diperoleh nilai rata-rata sebesar 68,5 yang berada
pada kategori Marginal High, Grade C, dan Adjective Rating OK. Hasil ini
menunjukkan bahwa sistem secara umum sudah dapat diterima dan digunakan oleh
pengguna internal, meskipun masih terdapat ruang untuk peningkatan pada aspek
kemudahan penggunaan dan kenyamanan antarmuka.
Dengan demikian, dapat disimpulkan bahwa Sistem Informasi Surat Menyurat
berbasis website yang dirancang telah memenuhi tujuan perancangan, layak secara
teknis, operasional, dan finansial, serta dapat diimplementasikan untuk mendukung
kegiatan administrasi surat menyurat di lingkungan UPPD Kalideres.
7.2 Saran
Berdasarkan kesimpulan yang telah diperoleh, terdapat beberapa saran yang dapat
dipertimbangkan untuk pengembangan dan penerapan sistem ke depannya.
Pertama, disarankan untuk melakukan penyempurnaan pada aspek antarmuka dan
pengalaman pengguna (UI/UX), khususnya pada navigasi menu dan konsistensi
tampilan, guna meningkatkan nilai usability dan mendorong sistem mencapai
kategori penerimaan yang lebih tinggi berdasarkan pengujian SUS.
Kedua, sistem dapat dikembangkan lebih lanjut dengan menambahkan fitur
notifikasi real-time melalui email atau pesan instan untuk mempercepat
penyampaian informasi terkait disposisi dan status surat. Selain itu, integrasi sistem
dengan aplikasi atau sistem lain di lingkungan Bapenda DKI Jakarta juga dapat
menjadi langkah strategis untuk meningkatkan interoperabilitas dan efisiensi
administrasi lintas unit kerja.
Ketiga, pada tahap implementasi penuh, diperlukan pelatihan lanjutan dan
pendampingan secara berkala bagi pengguna agar pemanfaatan sistem dapat
berjalan optimal dan konsisten. Evaluasi penggunaan sistem secara periodik juga
disarankan untuk mengidentifikasi kebutuhan baru serta potensi perbaikan
berdasarkan umpan balik pengguna.
DAFTAR PUSTAKA
Adriana, W., Pariyadi, & Prammudya, M. A. (2022). Sistem Informasi Inventory Berbasis Web
Pada Cv. Estika Advertising. Jurnal Akademika, 15(1), 20–26.
https://doi.org/10.53564/akademika.v15i1.836
Afiifah, K. ’, Fira Azzahra, Z., Anggoro, A. D., Redaksi, D., Akhir, R., & Online, D. (2022).
Universitas Negeri Jakarta; Jl. Rawamangun Muka Raya No.11 RW.14 Rawamangun.
Jurnal Intech, 3(1), 8–11.
Ayu Nyoman Sinta Dewi, S., Adi Sastra Wijaya, K., Putu Dharmanu Yudartha, I., & Savitri, R.
(2023). Transformasi Digital Inovasi Pelayanan Publik Aplikasi JAKI dalam Mewujudkan
Smart Governance di DKI Jakarta. In JIAP (Vol. 9, Issue 3).
Few, Stephen. (2012). Show me the numbers : designing tables and graphs to enlighten.
Analytics Press.
Harun, Muhamad. (2019). RANCANG BANGUN SISTEM INFORMASI REKRUTMEN PADA
PT. ASIAMAKMUR SEJAHTERA DENGAN METODE FISHBONE (Vol. 4).
Hasugian, H., Wulandari, & Nofiyani. (2023). User Acceptance Testing (UAT) Pada Electronic
Data Preprocessing Guna Mengetahui Kualitas Sistem. Jurnal Mahasiswa Ilmu
Komputer, 4(1), 20–27.
HERLINA, H., & ASSIDIQ, M. (2021). Penerapan Unified Modelling Language (Uml) Pada
Analisis Sistem Serta Perancangan Database Timbulan Sampah. Jurnal INSTEK
(Informatika Sains Dan Teknologi), 6(2), 170–177.
https://doi.org/10.24252/instek.v6i2.23994
Ishak, R., Akbar, F., & Safudin, M. (2020). RANCANG BANGUN SISTEM INFORMASI
SURAT MASUK DAN SURAT KELUAR BERBASIS WEB MENGGUNAKAN METODE
WATERFALL. 1(3).
Kirk, Andy. (2019). Data visualisation : a handbook for data driven design. SAGE.
LKIP Bapenda DKI Tahun 2023. (n.d.).
Naufaldy, M., Akbar, F., Mursityo, Y. T., Fanani, L., & Korespondensi, P. (2022). PERBAIKAN
PROSES BISNIS MENGGUNAKAN METODE BUSINESS PROCESS IMPROVEMENT
t(STUDI KASUS: KEUANGAN PADA LINDA CABLE) (Vol. 3, Issue 1).
Nugroho, F. A., Fadilah, D., Sumitro, C. M., & Saputra, R. A. (2021). Rancang Bangun Sistem
Informasi Sebaran Distribusi KIS Provinsi Sulawesi Tenggara Berbasis Web. Jurnal
Teknologi Informasi, Komputer Dan Aplikasinya (JTIKA), 4(2), 182–193.
http://jtika.if.unram.ac.id/index.php/JTIKA/
PERGUB PROVINSI DKI JAKARTA NOMOR 63 TAHUN 2016. (n.d.). www.regulasip.com
Ramdany, S. W., Aulia Kaidar, S., Aguchino, B., Amelia, C., Putri, A., & Anggie, R. (n.d.).
Penerapan UML Class Diagram dalam Perancangan Sistem Informasi Perpustakaan
Berbasis Web. In Journal of Industrial and Engineering System (Vol. 5, Issue 1).
Restaldo, A., & Beeh, Y. R. (2022). Penerapan Framework Laravel pada Sistem Informasi Arsip
Dosen Fakultas Keguruan dan Ilmu Pendidikan. Jurnal Teknik Informatika Dan Sistem
Informasi, 9(1), 785–797. http://jurnal.mdp.ac.id
Ullman, Larry. (2017). PHP and MySQL for Dynamic Web Sites : Visual QuickPro Guide, Fifth
Edition. Peachpit Press.
Wijaya, C. S., Zulfahmi, M. D., & Sudrajat, A. W. (2024). JURNAL REIN Pengujian Black Box
pada Aplikasi e-Promkes Berbasis Web. 1(1), 3–7.