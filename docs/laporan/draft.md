PROPOSAL CAPSTONE PROJECT
 (Judul)

Disusun Oleh
                           Shaffira Indana Zulfa	102042300049
            Afif Nur Sena	102042300189
                                        Lintong Sahat Josua Sitohang	102042300128

                                    Muhammad Zidan Alfarizi	102042300196
                            Alizha Tiara Syafahira	102042330201

















PROGRAM STUDI STRATA 1 SISTEM INFORMASI FAKULTAS REKAYASA INDUSTRI
UNIVERSITAS TELKOM 2026
 
ABSTRAK

 
DAFTAR ISI
ABSTRAK	1
DAFTAR ISI	2
DAFTAR GAMBAR	3
DAFTAR TABEL	4
BAB I	5
PENDAHULUAN	6
1.1 Latar Belakang	6
1.1.1 Root Cause Analysis	7
1.2 Alternatif Solusi	7
1.3 Perumusan Masalah	8
1.4 Tujuan Perancangan	8
1.5 Manfaat Perancangan	9
BAB II TINJAUAN PUSTAKA	11
2.1 Body of Knowledge	12
2.2 Teori / Konsep Umum / Model / Kerangka Standar Terkait Perancangan	13
2.2.1 Teori Data dan Kependudukan	14
2.2.2 Teori UI/UX & Interaksi	14
2.2.3 Teori Software Engineering dan Arsitektur Perangkat Lunak	14
2.3 Teori Keamanan Data (PII, Auth)	15
BAB III SPESIFIKASI DAN MEKANISME PERANCANGAN	16
3.1 Batasan Realistis	17
3.2 Standar Keteknikan	17
3.3 Spesifikasi Rancangan	18
3.3.1 Spesifikasi Kependudukan & Keuangan	19
3.3.2	Spesifikasi UI/UX & Flow	19
3.3.3 Spesifikasi Keamanan dan Akses	21
3.3.4 Spesifikasi Fungsional	23
3.4 Batasan Asumsi	26
3.5 Mekanisme Perancangan	27
3.5.1 Sistematika Perancangan	27
3.5.2 Deskripsi Mekanisme Verifikasi dan Validasi	29
3.5.3 Timeline Perancangan	30
3.5.4 Identifikasi Komponen Sistem Terintegrasi	31
BAB IV HASIL PERANCANGAN	27
4.1 Proses Perancangan	27
4.2 Hasil Rancangan	27
4.3 Verifikasi Hasil Rancangan	28
BAB V ANALISIS BIAYA & KELAYAKAN PERANCANGAN	29
5.1 Identifikasi Biaya Terkait Rancangan	30
5.2 Analisis Kelayakan Perancangan	30
5.3 Rencana Implementasi Hasil Rancangan	30
BAB VI  EVALUASI DAN VALIDASI HASIL RANCANGAN	30
6.1 Validasi Hasil Rancangan	31
BAB VII KESIMPULAN DAN SARAN	31
7.1 Kesimpulan	32
7.2 Saran	32
DAFTAR PUSTAKA	33

 
 
DAFTAR GAMBAR
 
DAFTAR TABEL

 
BAB I 

PENDAHULUAN

1.1 Latar Belakang
Perkembangan teknologi digital di Indonesia mendorong berbagai aktivitas administrasi dan pelayanan masyarakat untuk beradaptasi dengan pemanfaatan sistem digital. Tingkat penetrasi internet Indonesia yang telah mencapai lebih dari 80% populasi menunjukkan bahwa penggunaan teknologi digital telah menjadi bagian dari aktivitas masyarakat sehari-hari (APJII, 2023). Kondisi tersebut membuka peluang bagi pemanfaatan teknologi dalam mendukung pengelolaan administrasi di tingkat masyarakat, termasuk pada lingkungan Rukun Warga (RW). Namun, kebutuhan terhadap digitalisasi tidak dapat hanya ditentukan berdasarkan perkembangan teknologi secara umum, melainkan perlu disesuaikan dengan tugas pokok dan fungsi (tupoksi) serta permasalahan nyata yang dihadapi oleh masing-masing lingkungan.
Berdasarkan UU No. 6 Tahun 2014 tentang Desa dan Permendagri No. 18 Tahun 2018 tentang Lembaga Kemasyarakatan Desa dan Lembaga Adat Desa, RW merupakan lembaga kemasyarakatan yang memiliki fungsi dalam pengelolaan data kependudukan, pengelolaan keuangan swadaya masyarakat, dan penyampaian informasi kepada warga. Dalam pelaksanaannya, administrasi RW pada umumnya masih dilakukan secara manual menggunakan dokumen fisik berupa buku register warga, pencatatan keuangan di spreadsheet yang terpisah per RT, serta penyebaran informasi melalui platform pesan instan seperti WhatsApp. Proses administrasi yang tersebar dan tidak terstruktur ini menimbulkan berbagai kendala dalam pengelolaan harian maupun pelaporan.
Kendala umum yang diidentifikasi dalam proses administrasi RW meliputi: (1) data kependudukan yang tersebar di berbagai dokumen dan sulit untuk dikonsolidasikan, sehingga menyulitkan pengurus dalam menyusun laporan maupun memberikan pelayanan yang akurat; (2) pencatatan keuangan kas RW yang tidak transparan dan rentan terhadap kesalahan hitung, mengingat tidak adanya sistem pencatatan ganda yang terstandar; (3) pembayaran iuran warga yang masih dilakukan secara tunai atau transfer manual sehingga memerlukan proses rekonsiliasi yang memakan waktu dan berisiko terhadap perbedaan catatan; serta (4) penyampaian informasi dan pengumuman yang bergantung pada grup WhatsApp, sehingga informasi mudah terlewati, sulit ditelusuri kembali, dan tidak dapat diakses secara terstruktur. Kondisi-kondisi tersebut menunjukkan adanya kebutuhan untuk menyediakan suatu media pengelolaan administrasi yang lebih terpadu dan terstruktur.
Di sisi lain, perkembangan penggunaan pembayaran digital di Indonesia membuka peluang untuk mendukung proses pembayaran iuran warga secara non-tunai. Nilai transaksi QRIS (Quick Response Code Indonesian Standard) di Indonesia terus mengalami peningkatan signifikan, menunjukkan bahwa metode pembayaran berbasis kode QR telah semakin diterima dan digunakan dalam aktivitas transaksi masyarakat sehari-hari (Bank Indonesia, 2023). Pemanfaatan QRIS dalam pembayaran iuran RW dapat menjadi salah satu alternatif yang relevan apabila sesuai dengan kebutuhan dan mekanisme pembayaran yang diterapkan oleh mitra.
Berdasarkan kondisi yang telah diuraikan, dapat disimpulkan bahwa permasalahan administrasi pada RW meliputi pengelolaan data kependudukan yang tidak terpusat, pencatatan keuangan yang tidak transparan, pembayaran iuran yang memerlukan rekonsiliasi manual, serta penyampaian informasi yang tidak terstruktur. Permasalahan-permasalahan tersebut menunjukkan kebutuhan terhadap suatu sistem informasi yang dapat mengintegrasikan proses administrasi RW secara lebih efisien dan terstruktur.
Oleh karena itu, capstone project ini mengusulkan pengembangan Sistem Informasi RW (SI-RW) yang disesuaikan dengan kebutuhan mitra. Penentuan fitur sistem didasarkan pada analisis regulasi resmi (UU Desa 6/2014, Permendagri 18/2018) dan evaluasi plausibility untuk konteks implementasi capstone. Fitur yang dikembangkan mencakup manajemen data kependudukan, administrasi surat-menyurat, pengelolaan keuangan kas RW, manajemen iuran warga, dan penyampaian pengumuman/informasi. Setiap fitur dirancang untuk menjawab permasalahan yang telah diidentifikasi, sehingga sistem yang dihasilkan diharapkan dapat membantu meningkatkan efisiensi pengelolaan administrasi serta memberikan akses informasi yang lebih terstruktur bagi pengurus dan warga RW.

1.1.1 Root Cause Analysis
Berdasarkan uraian permasalahan pada latar belakang, dilakukan analisis akar masalah untuk mengidentifikasi penyebab mendasar dari kendala administrasi yang dihadapi RW 06. Analisis ini bertujuan agar solusi yang dirancang tidak hanya mengatasi gejala yang tampak, melainkan menjawab akar permasalahan yang sesungguhnya.

Akar masalah yang diidentifikasi adalah tidak adanya sistem informasi terpusat yang mengintegrasikan seluruh proses administrasi RW. Kondisi ini mengakibatkan:

1. Data kependudukan tersebar di berbagai media (buku register, spreadsheet per RT, grup WhatsApp) tanpa sumber tunggal yang dapat diandalkan (single source of truth), sehingga sulit dikonsolidasikan untuk keperluan administrasi seperti pengajuan surat, penetapan iuran, maupun pelaporan.
2. Pencatatan keuangan tidak memiliki sistem ganda (double-entry) yang terstandar, sehingga rekonsiliasi antara catatan bendahara RW dan bendahara RT rentan terhadap ketidaksesuaian yang sulit ditelusuri.
3. Tidak adanya mekanisme pembayaran yang terintegrasi membuat rekonsiliasi iuran harus dilakukan secara manual, memerlukan waktu signifikan, dan berisiko menghasilkan perbedaan catatan antara penerima dan pembayar.
4. Informasi disampaikan melalui platform pesan instan (WhatsApp) yang tidak dirancang untuk pengelolaan pengumuman terstruktur, sehingga informasi mudah terlewati dan tidak dapat ditelusuri kembali secara sistematis.
5. Proses pengajuan dan pengelolaan surat administrasi dilakukan secara manual tanpa sistem pencatatan riwayat yang memadai, mengakibatkan duplikasi kerja dan potensi kehilangan dokumen.

Dengan demikian, akar permasalahan dapat dirumuskan sebagai: ketiadaan sistem informasi terintegrasi yang menjadi pusat pengelolaan data kependudukan, administrasi surat, keuangan, iuran, dan informasi RW sesuai dengan struktur organisasi dan regulasi yang berlaku. Solusi yang dirancang dalam capstone project ini diarahkan untuk menjawab akar permasalahan tersebut.

Untuk memperjelas hubungan sebab-akibat antara akar masalah dan dampaknya, analisis dilengkapi dengan Fishbone Diagram (Cause-and-Effect Diagram) sebagaimana ditampilkan pada gambar berikut.

[GAMBAR 1.1 — Fishbone Diagram Akar Masalah Administrasi RW 06]

Outline Fishbone Diagram:
- Akibat (Effect): Pengelolaan administrasi RW tidak efisien dan tidak terstruktur
- Cabang penyebab:
  1. Manusia (Man): Pengurus dengan literasi digital yang beragam; tidak ada pelatihan sistem; pengelolaan data bergantung pada individu tertentu
  2. Metode (Method): Proses administrasi manual; tidak ada SOP pencatatan standar; rekonsiliasi dilakukan secara ad-hoc; pengajuan surat melalui jalur informal
  3. Material / Data: Data tersebar di buku fisik dan spreadsheet terpisah per RT; tidak ada single source of truth; duplikasi dan inkonsistensi data
  4. Media / Alat: Ketergantungan pada WhatsApp untuk pengumuman; tidak ada platform terpusat; spreadsheet tidak terhubung antar RT
  5. Lingkungan (Environment): Tidak ada anggaran untuk sistem digital; keterbatasan akses internet di sebagian warga; regulasi RW tidak mengharuskan sistem digital

1.2 Alternatif Solusi
Dalam menghadapi permasalahan administrasi RW yang telah diidentifikasi pada subbab sebelumnya, terdapat beberapa alternatif solusi yang dapat dipertimbangkan. Analisis terhadap masing-masing alternatif dilakukan berdasarkan kesesuaiannya dengan konteks RW tingkat kelurahan, kemampuan mengatasi permasalahan yang ada, serta keterbatasan yang dimilikinya.
Alternatif 1: Mempertahankan proses manual (status quo)
Pengelolaan administrasi RW secara manual menggunakan buku register, spreadsheet Excel, kuitansi fisik, dan grup WhatsApp merupakan pendekatan yang saat ini paling umum diterapkan. Pendekatan ini tidak memerlukan biaya teknologi tambahan dan tidak bergantung pada ketersediaan infrastruktur internet.
Namun, pendekatan ini memiliki keterbatasan yang signifikan: data kependudukan tersebar di berbagai dokumen dan mudah hilang, pencatatan keuangan rentan terhadap kesalahan dan sulit diaudit, rekonsiliasi iuran memerlukan waktu yang panjang, serta informasi yang disebarkan melalui WhatsApp mudah terlewati dan tidak dapat ditelusuri kembali secara terstruktur. Data sensitif seperti NIK dan nomor KK juga berisiko tersebar tanpa kontrol akses yang memadai. Pendekatan ini tidak berkelanjutan untuk kebutuhan digitalisasi administrasi yang lebih terstandar.
Alternatif 2: Menggunakan platform SaaS existing yang menyasar RT/RW
Terdapat beberapa platform yang telah dikembangkan oleh pihak ketiga untuk kebutuhan administrasi RT/RW di Indonesia, salah satunya adalah Pak RT (pakrt.id). Platform ini menyediakan fitur data penduduk, kas RT, iuran, tagihan, dan pengumuman yang secara langsung menyasar konteks RT/RW — berbeda dengan Sistem Informasi Desa (SID/OpenSID) yang lebih berorientasi pada birokrasi desa, atau Siskeudes/SIPKD yang dirancang khusus untuk pengelolaan APBDes.
Kelebihan utama pendekatan ini adalah kecepatan implementasi dan ketersediaan fitur yang sudah teruji. Namun, kelemahannya meliputi ketergantungan terhadap vendor eksternal (risiko perubahan model bisnis atau penghentian layanan), biaya langganan yang dapat membebani kas RW, minimnya kontrol terhadap data warga (PII) yang disimpan di server pihak ketiga, serta keterbatasan kustomisasi untuk menyesuaikan alur dengan kebutuhan spesifik mitra.
Alternatif 3: Pengembangan sistem khusus (SI-RW)
Alternatif ketiga adalah merancang dan membangun sistem informasi secara khusus sesuai kebutuhan mitra, sebagaimana yang diusulkan dalam capstone project ini. Sistem dikembangkan menggunakan tech stack modern (SvelteKit, SQLite/Turso, Drizzle ORM, Better Auth) dengan fitur yang ditetapkan berdasarkan analisis regulasi resmi dan evaluasi plausibility.
Pendekatan ini memberikan fleksibilitas penuh dalam menentukan fitur, alur, dan kontrol akses sesuai struktur organisasi RW. Data warga dapat dikelola dengan kontrol keamanan yang dirancang sejak awal. Tidak ada biaya langganan kepada vendor eksternal, dan sistem dapat dikembangkan lebih lanjut setelah capstone selesai. Kelemahan utamanya adalah waktu dan biaya pengembangan awal, serta kebutuhan akan kapasitas teknis untuk pemeliharaan sistem pasca-handover.
Perbandingan Alternatif
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
1.3 Perumusan Masalah
Berdasarkan latar belakang yang telah diuraikan, rumusan masalah dalam perancangan Sistem Informasi RW ini adalah sebagai berikut:
1. Bagaimana merancang sistem informasi yang dapat mengelola data kependudukan warga secara terpusat dan terstruktur di tingkat RW?
2. Bagaimana merancang sistem administrasi surat-menyurat yang terintegrasi dengan data kependudukan sehingga proses pengajuan dan penerbitan surat dapat dilakukan secara terstruktur dan terdokumentasi?
3. Bagaimana merancang sistem pencatatan keuangan kas RW yang transparan dan dapat diakses oleh pengurus yang berwenang?
4. Bagaimana merancang mekanisme pembayaran iuran warga yang mendukung pencatatan otomatis dan berpotensi mengakomodasi metode digital?
5. Bagaimana merancang media penyampaian pengumuman dan informasi RW yang terstruktur dan mudah diakses oleh warga?
6. Bagaimana merancang sistem dengan kontrol akses berbasis peran (role-based access) yang sesuai dengan struktur organisasi RW?
1.4 Tujuan Perancangan

Tujuan perancangan capstone project ini adalah menghasilkan sistem informasi RW yang dapat membantu RW 06, Kelurahan Kota Baru, Kecamatan Bekasi Barat, Kota Bekasi dalam mengelola administrasi masyarakat secara lebih terstruktur dan terintegrasi.
Secara khusus, tujuan perancangan sistem ini adalah:
1.	Mengembangkan sistem yang dapat mengintegrasikan pengelolaan data kependudukan yang sebelumnya masih menggunakan buku.
2.	Memudahkan pengurus RW dan RT dalam melakukan pencatatan serta pembaruan data warga, termasuk data KK, KTP, alamat, nama, usia, dan status tinggal.
3.	Menyediakan pengelolaan data warga yang dapat digunakan sebagai sumber informasi dalam mendukung kebutuhan administrasi masyarakat, seperti pembuatan dokumen paspor, SKCK, SKTM, dan dokumen lainnya.
4.	Mengembangkan sistem administrasi surat-menyurat yang dapat memanfaatkan data kependudukan sehingga proses pengajuan dan pembuatan surat dapat dilakukan secara lebih terstruktur.
5.	Menyediakan sistem yang dapat membantu pengurus RW dalam mengelola informasi administrasi secara terpusat sehingga data tidak lagi tersebar pada media pencatatan yang berbeda.

 
1.5 Manfaat Perancangan
Perancangan sistem informasi RW ini diharapkan dapat memberikan manfaat bagi pengurus RW, pengurus RT, dan warga RW 06, Kelurahan Kota Baru, Kecamatan Bekasi Barat, Kota Bekasi. Manfaat perancangan disesuaikan dengan fitur sistem yang dirancang, yaitu manajemen kependudukan, surat-menyurat, keuangan, iuran warga, serta pengumuman dan informasi RW.
1.	Bagi Pengurus RW
a. Manajemen Kependudukan
Membantu pengurus RW dalam menyimpan, mengelola, mencari, dan memperbarui data kependudukan secara terpusat. Data yang dikelola meliputi data KK, KTP, nama, alamat, usia, dan status tinggal warga.
b. Surat-Menyurat
Membantu pengurus dalam mengelola proses pelayanan surat secara lebih terstruktur. Sistem dapat mendukung pengajuan surat, penggunaan template surat, pemberian nomor surat, proses persetujuan, serta penyimpanan riwayat surat.
c. Keuangan dan Kas RW
Membantu bendahara dalam mencatat pemasukan dan pengeluaran RW, mengelompokkan transaksi, memantau saldo kas, menyimpan bukti transaksi, serta menghasilkan laporan keuangan berdasarkan periode tertentu.
d. Iuran Warga
Membantu pengurus dalam mengelola jenis dan nominal iuran, mencatat pembayaran warga, mengetahui status pembayaran, serta menghasilkan rekap pembayaran iuran secara terstruktur.
e. Pengumuman dan Informasi RW
Menyediakan media terpusat untuk menyampaikan pengumuman, informasi kegiatan, jadwal kerja bakti, rapat warga, dan informasi lainnya kepada warga.
2.	Bagi Pengurus RT
a. Membantu pengurus RT dalam mengakses dan memperbarui data warga sesuai dengan hak akses yang diberikan.
b. Membantu pengurus RT dalam mendukung proses administrasi dan pengajuan surat warga.
c. Memudahkan pengurus RT dalam memantau informasi terkait warga dan kegiatan RW melalui sistem.
3.	Bagi Warga
a. Memudahkan warga dalam mengajukan layanan administrasi yang tersedia melalui sistem.
b. Memudahkan warga dalam menyampaikan atau memperbarui informasi kependudukan melalui mekanisme yang disediakan.
c. Memudahkan warga dalam mengetahui status pembayaran iuran.
d. Memudahkan warga dalam memperoleh pengumuman dan informasi RW melalui satu media yang terstruktur.
4.	Bagi Pengelolaan Administrasi RW
a. Mengurangi ketergantungan terhadap pencatatan menggunakan buku dan file Excel yang terpisah melalui penyediaan sistem administrasi yang terintegrasi.
b. Menyediakan penyimpanan riwayat data dan transaksi sehingga informasi administrasi dapat ditelusuri kembali sesuai kebutuhan.
c. Membantu mengintegrasikan data kependudukan dengan proses administrasi lain yang membutuhkan data warga.
d. Menyediakan informasi administrasi yang lebih terstruktur bagi pengurus dan warga sesuai dengan hak akses masing-masing.


 
BAB II TINJAUAN PUSTAKA
2.1 Body of Knowledge

Body of Knowledge (BoK) yang menjadi acuan dalam Capstone Design Project perancangan purwarupa sistem informasi rukun warga pada penelitian ini mengacu pada kerangka kerja IS2020 A Competency Model for Undergraduate Programs in Information Systems. Sebagai upaya penyelesaian permasalahan administrasi pada lingkungan mitra, pengembangan sistem ini melibatkan tiga domain utama dalam Body of Knowledge (BoK) pada gambar di bawah ini.

 


Berikut area utama yang menjadi fokus dalam kajian ini beserta relevansinya terhadap perancangan Sistem Informasi RW:

1.	Data

Domain Data pada  berfokus pada penyimpanan dan pemrosesan data dalam suatu organisasi, yang mencakup pengelolaan basis data, analisis data, dan visualisasi data. Dalam perancangan ini, area yang digunakan adalah Data/Information Management, khususnya perancangan dan pengelolaan basis data.

BoK ini relevan karena inti permasalahan yang diangkat adalah pengelolaan data. Pada RW 06, data kependudukan masih dicatat menggunakan buku, sedangkan data yang sama dibutuhkan untuk berbagai keperluan, seperti pengajuan surat untuk paspor, SKCK, dan SKTM, penetapan iuran, serta penyampaian pengumuman. Pencatatan yang terpisah pada media yang berbeda berpotensi menimbulkan duplikasi dan ketidakkonsistenan data (Connolly & Begg, 2015), sehingga diperlukan satu sumber data yang terpusat dan terstruktur.

BoK ini diterapkan melalui beberapa kegiatan. Pertama, pemodelan data menggunakan Entity Relationship Diagram (ERD) untuk entitas utama, seperti warga, KK, RT, surat, transaksi kas, iuran, dan pengumuman. Kedua, perancangan basis data relasional yang dinormalisasi dengan kunci primer, kunci asing, dan batasan integritas. Ketiga, penerapan aturan validasi dan penyimpanan riwayat perubahan data agar kualitas data terjaga. Keempat, penyusunan rekap dan laporan, seperti rekap iuran dan laporan kas per periode, agar data dapat digunakan sebagai informasi pendukung keputusan pengurus.



2.	Development (Systems Analysis & Design dan Application Development)
Domain Development pada mencakup siklus hidup pengembangan aplikasi, mulai dari analisis dan perancangan sistem hingga pemrograman aplikasi, termasuk pemrograman web dan perancangan antarmuka pengguna (Leidig & Salmela, 2021).
BoK ini relevan karena solusi yang diusulkan berupa sistem informasi yang melibatkan lebih dari satu kelompok pengguna, yaitu pengurus RW, bendahara, pengurus RT, dan warga, dengan kebutuhan dan hak akses yang berbeda. Kebutuhan tersebut perlu diidentifikasi secara sistematis sebelum sistem dibangun, agar sistem sesuai dengan proses yang berjalan di mitra (Dennis et al., 2018). Selain itu, pengguna sistem memiliki tingkat kemampuan digital yang beragam sehingga perancangan antarmuka yang sederhana dan konsisten menjadi bagian penting dari kelayakan penggunaan sistem. BoK ini diterapkan melalui analisis kebutuhan berdasarkan observasi dan wawancara dengan pengurus RW, pemodelan sistem, perancangan antarmuka, serta pembangunan dan pengujian aplikasi.
3.	Technology (Secure Computing)
Domain Technology pada mencakup infrastruktur teknologi informasi, keamanan komputasi (secure computing), dan teknologi baru (Leidig & Salmela, 2021). Dalam perancangan ini, area yang digunakan adalah Secure Computing. BoK ini relevan karena sistem menyimpan data pribadi warga, seperti nama, alamat, KK, dan KTP, serta data keuangan RW yang meliputi transaksi kas dan pembayaran iuran. Kebocoran, perubahan tanpa izin, atau hilangnya data tersebut dapat merugikan warga maupun pengurus.
BoK ini diterapkan melalui autentikasi pengguna, pengaturan hak akses sesuai peran pengguna, serta perlindungan data pribadi dan data transaksi. 



 
2.2 Teori / Konsep Umum / Model / Kerangka Standar Terkait Perancangan

2.2.1 Teori Data dan Kependudukan
Data dan Kependudukan memaparkan teori yang mendasari modul pengelolaan data warga sebagai sumber informasi utama sistem. Secara konseptual, data kependudukan dikelola sebagai aset organisasi yang kualitasnya meliputi keakuratan, kelengkapan, konsistensi, dan aksesibilitas dijaga melalui mekanisme validasi isian serta pemanfaatan basis data terpusat. Untuk mendukung hal tersebut, perancangan sistem menggunakan Sistem Manajemen Basis Data (DBMS) relasional dengan pendekatan Entity Relationship Model (ERD) dan normalisasi guna mencegah redundansi. Basis data ini menstrukturkan entitas kewilayahan secara hierarkis, yakni dari tingkat RW, RT, Kartu Keluarga (KK), hingga warga, dengan pengamanan integritas data melalui kunci primer dan perekaman riwayat perubahan.

2.2.2	 Teori UI/UX & Interaksi
User Interface (UI) dan User Experience (UX) merupakan dua komponen utama yang berinteraksi secara sinergis dalam menentukan efektivitas, kegunaan, serta keberhasilan penerapan suatu sistem informasi digital. User Interface berfokus pada elemen tata letak visual, konsistensi warna, hirarki tipografi, dan navigasi yang bertindak sebagai jembatan komunikasi visual antara manusia dan sistem. Di sisi lain, User Experience mencakup aspek emosional, respons kognitif, serta tingkat kepuasan subjektif pengguna ketika berinteraksi dan menyelesaikan tugas tertentu di dalam produk digital. Sebagaimana dijelaskan oleh Windrianto dan Suryani (2025), penerapan metodologi desain antarmuka berbasis kebutuhan pengguna mampu menyelaraskan kebutuhan fungsionalitas sistem dengan kenyamanan operasional pengguna. Hal ini diperkuat oleh studi Ramadhana et al. (2025) yang menegaskan bahwa integrasi UI/UX yang tepat terbukti secara signifikan dapat meningkatkan aksesibilitas, kemudahan navigasi, serta meminimalkan beban kognitif pengguna (learning curve) saat mengoperasikan platform digital.

Sementara itu, Interaction Design (IxD) atau desain interaksi bertindak sebagai fondasi operasional yang mengatur bagaimana sistem merespons setiap bentuk tindakan dan masukan dari pengguna secara intuitif. Konsep interaksi ini mendasarkan diri pada alur kerja (workflow) yang logis, pemberian umpan balik (feedback) secara waktu nyata, penyediaan kemudahan navigasi, serta penerapan keteraturan pola untuk mencegah kesalahan penggunaan (error prevention). Dalam konteks aplikasi layanan dan pengelolaan data administrasi, arsitektur interaksi yang terstruktur secara teratur memungkinkan pengguna menyelesaikan transaksi tanpa hambatan teknis. Sebagaimana dijelaskan oleh Alja et al. (2025), perancangan antarmuka dan pola interaksi yang adaptif terbukti secara signifikan meningkatkan efisiensi operasional sistem serta mempercepat waktu penyelesaian tugas (task completion rate). Hal ini sejalan dengan temuan Nurhasanah dan Kusumadiarti (2024) yang menyatakan bahwa optimalisasi desain interaksi yang terstruktur secara metodologis berhasil memperjelas penyampaian informasi dan meningkatkan kepuasan pengguna secara menyeluruh.

2.2.3 Teori Software Engineering dan Arsitektur Perangkat Lunak

Software Engineering merupakan pendekatan sistematis dalam pengembangan perangkat lunak yang mencakup kegiatan analisis kebutuhan, perancangan, implementasi, pengujian, dan pemeliharaan sistem. Pendekatan ini digunakan untuk memastikan perangkat lunak yang dikembangkan dapat memenuhi kebutuhan pengguna, memiliki struktur yang terorganisasi, serta dapat dikembangkan dan dipelihara secara berkelanjutan. Dalam perancangan Sistem Informasi RW, konsep Software Engineering digunakan sebagai dasar dalam menerjemahkan kebutuhan administrasi RW menjadi fungsi dan komponen sistem yang terstruktur.
Arsitektur perangkat lunak merupakan struktur tingkat tinggi yang menggambarkan pembagian komponen sistem, hubungan antar komponen, serta aliran data dan proses di dalam aplikasi. Perancangan arsitektur diperlukan agar setiap bagian sistem memiliki tanggung jawab yang jelas dan tidak saling bergantung secara berlebihan. Pada sistem berbasis web, arsitektur dapat memisahkan bagian antarmuka pengguna, logika aplikasi, serta pengelolaan basis data sehingga proses pengembangan dan pemeliharaan sistem menjadi lebih terstruktur.
Dalam perancangan Sistem Informasi RW, konsep arsitektur digunakan untuk mengatur hubungan antara antarmuka pengguna, proses bisnis, autentikasi dan otorisasi, serta basis data. Pemisahan tanggung jawab tersebut diterapkan agar pengelolaan data kependudukan, kas RW, iuran warga, dan pengumuman dapat dikembangkan sebagai bagian sistem yang terstruktur. Arsitektur juga mendukung penerapan kontrol akses dan validasi pada sisi server sehingga proses pengolahan data tidak hanya bergantung pada antarmuka pengguna.
Penerapan konsep Software Engineering dan arsitektur perangkat lunak pada perancangan ini mencakup analisis kebutuhan, pemodelan sistem, perancangan basis data, perancangan antarmuka, penerapan mekanisme keamanan, implementasi modul, integrasi komponen, serta pengujian sistem. Dengan pendekatan tersebut, rancangan sistem diharapkan memiliki struktur yang jelas, mudah dikembangkan, dan sesuai dengan kebutuhan pengguna serta batasan perancangan.

2.3 Teori Keamanan Data (PII, Auth)
2.3.1 Keamanan Data dan Pelindungan Data Pribadi
Keamanan informasi secara konseptual bertumpu pada tiga properti utama, yaitu kerahasiaan (confidentiality), integritas (integrity), dan ketersediaan (availability) yang dikenal sebagai CIA triad (ISO/IEC, 2022). Pada Sistem Informasi RW, ketiga aspek ini berhubungan langsung dengan tata kelola data warga. Kerahasiaan menjamin bahwa data sensitif seperti Nomor Induk Kependudukan (NIK), Nomor Kartu Keluarga (No. KK), serta alamat warga tidak dapat diakses oleh pihak yang tidak berwenang. Integritas memastikan bahwa data kependudukan maupun transaksi kas tidak diubah tanpa otorisasi yang sah, sedangkan ketersediaan menjamin data dapat diakses oleh pengurus RW/RT saat dibutuhkan untuk keperluan administrasi. Berdasarkan Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP), data kependudukan serta data iuran warga tergolong sebagai Data Pribadi yang wajib dilindungi. UU PDP mengklasifikasikan data pribadi menjadi data umum (seperti nama lengkap dan jenis kelamin) serta data spesifik (seperti data keuangan pribadi) yang memerlukan tingkat perlindungan lebih ketat. Dalam konteks ini, pengurus RW bertindak sebagai Pengendali Data Pribadi yang berkewajiban menerapkan kontrol teknis seperti pembatasan akses (need-to-know), minimisasi data, dan penyamaran (masking) data untuk mencegah kegagalan pelindungan data.
2.3.2 Autentikasi dan Manajemen Sesi 
Dalam mendukung aspek autentikasi dan manajemen sesi, sistem mengidentifikasi serta memverifikasi pengguna sebelum memberikan hak akses. Pada arsitektur aplikasi web modern, identitas pengguna yang terautentikasi dipertahankan melalui sesi (session) berbasis cookie yang dilindungi atribut HttpOnly untuk mencegah pembacaan oleh skrip jahat, atribut Secure untuk menjamin transmisi terenkripsi, serta SameSite guna membatasi pengiriman lintas situs (Barth, 2011). Penyimpanan kata sandi dalam basis data wajib diolah menggunakan fungsi turunan kunci (key derivation function) berbantuan salt seperti scrypt atau bcrypt guna mempersulit serangan brute-force apabila terjadi kebocoran basis data (NIST, 2017). Pada rancangan sistem ini, pengurusan autentikasi memanfaatkan pustaka Better Auth yang terintegrasi dengan framework SvelteKit. Pembacaan sesi dilakukan secara terpusat pada setiap request melalui berkas hooks.server.ts dan disimpan ke dalam event.locals sebagai dasar verifikasi otorisasi pada lapisan aplikasi.
2.3.3 Role-Based Access Control (RBAC) 
Otorisasi dan pembatasan hak akses ditegakkan menggunakan model Role-Based Access Control (RBAC) yang mengaitkan izin akses dengan peran (role) tertentu, bukan pengguna secara individual (Sandhu et al., 1996). Sistem mendefinisikan empat peran utama yang mencerminkan struktur organisasi RW, yaitu admin_rw, pengurus_rt, bendahara, dan warga. Kewenangan tiap peran diatur dalam matriks operasi (create, read, update, delete) pada berbagai modul sistem, dengan penerapan prinsip least privilege dan defence in depth. Penegakan kontrol akses dilakukan secara berlapis, mulai dari pemeriksaan route guard terpusat pada guard.ts, pemeriksaan ulang pada lapisan layout, hingga pengecekan izin di tingkat action dengan menerapkan prinsip fail-closed agar nilai peran yang tidak valid otomatis ditolak.
2.3.4 Keamanan Aplikasi Web
Sebagai landasan keamanan aplikasi web secara menyeluruh, perancangan sistem mengacu pada standar Open Worldwide Application Security Project (OWASP) Top 10. Kerentanan utama seperti Broken Access Control ditangani melalui otorisasi berlapis di sisi server. Risiko Injection dicegah dengan memanfaatkan Drizzle ORM yang membangun parameterized queries sehingga masukan pengguna tidak dieksekusi sebagai perintah SQL. Seluruh masukan formulir divalidasi dan disanitasi secara ketat di sisi server menggunakan skema Zod. Selain itu, potensi Cross-Site Scripting (XSS) dimitigasi oleh mekanisme escaping bawaan Svelte, kerentanan Cross-Site Request Forgery (CSRF) dicegah melalui pemeriksaan header Origin oleh SvelteKit, serta keamanan transportasi data dijamin oleh penerapan Transport Layer Security (TLS/HTTPS) (Rescorla, 2018).



 
BAB III 

SPESIFIKASI DAN MEKANISME PERANCANGAN


3.1 Batasan Realistis
Perancangan dan implementasi Sistem Informasi RW ini dibatasi oleh beberapa batasan realistis sebagai berikut:
1. Batasan waktu. Pengerjaan proyek ini dilakukan dalam satu semester sesuai kurikulum program studi, sehingga waktu yang tersedia untuk analisis, perancangan, implementasi, dan pengujian bersifat terbatas. Tidak seluruh fitur yang diidentifikasi dalam analisis kebutuhan dapat diselesaikan dalam periode ini.
2. Batasan aksesibilitas mitra. Mitra RW tidak dapat diwawancarai secara intensif dalam rentang waktu capstone ini, sehingga validasi kebutuhan fitur mengacu pada analisis regulasi resmi (UU No. 6 Tahun 2014, Permendagri No. 18 Tahun 2018) dan evaluasi plausibility sebagai pengganti data primer dari wawancara.
3. Batasan teknologi. Sistem menggunakan SQLite sebagai basis data dengan pendekatan single-file yang tidak dirancang untuk skala distributed atau beban konkurensi tinggi. Belum tersedia infrastruktur server produksi yang bersifat permanen untuk deployment publik.
4. Batasan anggaran. Tidak tersedia anggaran untuk layanan hosting berbayar atau akses payment gateway production, sehingga fitur pembayaran digital (QRIS) masih berada dalam tahap perancangan dan belum diintegrasikan secara penuh ke dalam sistem.
5. Batasan scope fitur. Hanya fitur Core MVP yang dikerjakan dalam proyek ini, yaitu manajemen data kependudukan, administrasi surat-menyurat, kas RW, iuran warga, dan pengumuman/informasi. Fitur-fitur di luar scope — termasuk manajemen CCTV, inventaris, dan manajemen pengurus — tidak termasuk dalam cakupan pengerjaan.
6. Batasan pengujian. Pengujian sistem dilakukan secara terbatas pada lingkungan kelompok capstone dan mitra, bukan deployment publik skala penuh. Hasil pengujian tidak dapat sepenuhnya merepresentasikan kondisi penggunaan nyata di lapangan.
3.2 Standar Keteknikan
3.2.1 Regulasi dan Standar Keamanan Informasi 
1. Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)
Mengklasifikasikan data pribadi menjadi data umum dan spesifik (Pasal 4), di mana data keuangan tergolong data spesifik. Mengatur kewajiban Pengendali Data Pribadi untuk menjamin keamanan pemrosesan data (Pasal 35), mencegah akses yang tidak sah (Pasal 39), serta memberikan pemberitahuan tertulis jika terjadi kegagalan pelindungan data (Pasal 46). - Penerapan pada Sistem: Akses data kependudukan dibatasi menggunakan model Role-Based Access Control (RBAC), data NIK dan Nomor Kartu Keluarga (KK) disamarkan (masking) pada daftar antarmuka, setiap perubahan data sensitif mencatat jejak audit (dicatatOleh dan timestamp), serta kata sandi tidak disimpan dalam bentuk teks asli.
2. ISO/IEC 27001:2022 (Information Security Management System)
Mengacu pada kontrol keamanan informasi Annex A, khususnya A.5.15 (Access Control) untuk aturan hak akses logis berdasarkan kebutuhan operasional, dan A.8.24 (Use of Cryptography) untuk aturan kriptografi dan pengelolaan kunci. Didukung oleh kontrol pendukung seperti A.5.17 (informasi autentikasi), A.8.5 (autentikasi aman), A.8.11 (data masking), A.8.15 (logging), serta A.8.13 (backup). - Penerapan pada Sistem: Penerapan matriks RBAC dengan empat peran utama via permissions.ts dan guard.ts (A.5.15), enkripsi TLS untuk data bergerak serta hashing kata sandi melalui Better Auth (A.8.24), batasan durasi sesi berbasis cookie (A.8.5), dan penyamaran tampilan NIK/KK (A.8.11).
3. Open Worldwide Application Security Project (OWASP) Top 10 (2021)
Acuan sepuluh kategori risiko keamanan aplikasi web paling kritis guna memitigasi celah kerentanan utama. - Penerapan pada Sistem: * A01 Broken Access Control: Dikelola via proteksi berlapis pada hooks.server.ts, layout, serta penegakan izin per aksi dengan prinsip fail-closed. * A02 Cryptographic Failures: Penggunaan TLS/HTTPS dan enkripsi hash kata sandi. * A03 Injection & XSS: Pembuatan kueri berparameter menggunakan Drizzle ORM, validasi skema masukan di sisi server via Zod, dan escaping keluaran templat bawaan Svelte. * A07 Identification & Authentication Failures: Penggunaan pustaka Better Auth, batas waktu sesi, serta mekanisme rate limiting. * A05 Security Misconfiguration: Penyimpanan variabel rahasia dan kunci autentikasi di dalam file variabel lingkungan (.env) yang diisolasi dari repositori.
Tabel 3.1 Ringkasan Pemetaan Standar Keteknikan Keamanan ke Fitur Sistem
Standar / Regulasi	Butir / Kontrol	Realisasi Pada Sistem
UU PDP No. 27/2022	Keamanan & pencegahan akses tidak sah	RBAC, route guard, penyamaran (masking) PII
ISO/IEC 27001:2022	A.5.15 Access Control	permissions.ts, guard.ts, matriks 4 peran
ISO/IEC 27001:2022	A.8.24 Cryptography	Enkripsi TLS/HTTPS, hashing kata sandi (scrypt)
OWASP Top 10 (2021)	A01 Broken Access Control	enforceAccess, requireRole pada server actions
OWASP Top 10 (2021)	A03 Injection & XSS	Parameterized queries Drizzle ORM, Zod schema validation, Svelte escaping
 
3.3 Spesifikasi Rancangan
3.3.1 Spesifikasi Kependudukan & Keuangan
Modul kependudukan dirancang sebagai pusat pengelolaan data warga RW 06 yang dapat diakses oleh pengurus RW, pengurus RT, dan warga. Modul ini juga berperan sebagai sumber data dasar bagi fitur lain dalam sistem, antara lain administrasi surat-menyurat dan pengelolaan iuran. Struktur data disusun berdasarkan hierarki wilayah sebagaimana diatur dalam Peraturan Wali Kota Bekasi Nomor 58 Tahun 2020, yakni satu RW membawahi 5 hingga 25 RT dan setiap RT menaungi 30 hingga 100 Kepala Keluarga (KK). Entitas utama yang dikelola meliputi data RW, data RT, data KK dengan nomor 16 digit beserta status keaktifannya, serta data individu warga. Data warga terdiri atas Nomor Induk Kependudukan (NIK) 16 digit, nama lengkap, tanggal lahir, nomor KK, status tinggal, dan riwayat pembaruan yang dicatat secara otomatis oleh sistem. Atribut pekerjaan, pendidikan, dan agama dicatat sebagai data tambahan sebatas kebutuhan pelayanan administrasi.
Secara fungsional, sistem menyediakan fitur penambahan, pengubahan, peninjauan, dan penonaktifan data warga maupun KK tanpa mekanisme penghapusan permanen. Validasi diterapkan pada NIK dan nomor KK untuk memastikan format berupa 16 digit numerik serta mencegah terjadinya duplikasi. Seluruh atribut utama wajib diisi sebelum data dapat disimpan, sedangkan usia warga dihitung secara otomatis berdasarkan tanggal lahir. Status tinggal diklasifikasikan menjadi tiga kategori, yaitu tetap, kontrak, dan sementara. Sistem juga mampu mencatat peristiwa kependudukan berupa kelahiran, kematian, kepindahan, dan perubahan alamat yang secara otomatis memperbarui status data warga terkait.
Dalam aspek pengelolaan dan keamanan, sistem dilengkapi fitur audit trail yang merekam setiap perubahan data, meliputi waktu, identitas pengguna, nilai sebelum dan sesudah perubahan, serta alasan perubahan, dengan masa retensi minimal lima tahun. Fitur pencarian dan penyaringan ditargetkan memiliki waktu respons maksimal tiga detik pada volume 10.000 data warga. Untuk mendukung migrasi data awal, sistem menyediakan fitur impor melalui berkas CSV atau XLSX disertai pelaporan galat pada baris yang tidak valid. Bagi pengguna warga, tersedia fitur pengajuan pembaruan data yang harus melalui alur verifikasi (diajukan, diverifikasi, disetujui atau ditolak) oleh pengurus sebelum perubahan diterapkan pada basis data. Sistem turut menghasilkan laporan rekapitulasi demografis yang dapat diekspor. Seluruh akses dibatasi menggunakan Role-Based Access Control (RBAC), dengan ketentuan pengurus RW memiliki akses menyeluruh, pengurus RT terbatas pada wilayahnya, dan warga hanya dapat mengakses data keluarganya sendiri.


3.3.2	Spesifikasi UI/UX & Flow
a.	Spesifikasi Antarmuka (User Interface Specification)
1.	Platform dan Responsivitas
Sistem dibuat berbasis web dan dirancang agar dapat digunakan pada berbagai ukuran layar. Sistem dapat diakses melalui komputer, laptop, maupun smartphone. Penggunaan melalui smartphone lebih ditujukan untuk warga, sedangkan komputer atau laptop dapat digunakan oleh pengurus dalam mengelola data dan proses administrasi.
Tampilan sistem dibuat responsif sehingga susunan dan ukuran komponen dapat menyesuaikan dengan perangkat yang digunakan.
2.	Design System, Palet Warna dan Tipografi
Untuk menjaga tampilan tetap konsisten, sistem menggunakan design system sederhana yang mencakup warna, jenis huruf, ukuran teks, tombol, dan komponen lainnya.
Warna utama digunakan pada bagian-bagian yang membutuhkan perhatian pengguna, seperti tombol utama dan navigasi. Warna pendukung digunakan untuk membedakan informasi atau status tertentu. Untuk tipografi, sistem menggunakan font Inter agar teks dapat terlihat jelas dan nyaman dibaca.
3.	Komponen Antarmuka
Beberapa komponen yang digunakan dalam perancangan antarmuka antara lain card, tabel, formulir, tombol, modal, dropdown, badge, dan notifikasi.
Card digunakan untuk menampilkan informasi tertentu secara terpisah. Tabel digunakan untuk menampilkan data yang memiliki banyak informasi, seperti data warga dan data iuran. Formulir digunakan untuk memasukkan data dan melakukan pengajuan surat. Modal digunakan untuk memberikan konfirmasi sebelum melakukan tindakan tertentu, seperti menghapus data. Sedangkan badge dan notifikasi digunakan untuk memberikan informasi mengenai status atau perubahan data.
B. Spesifikasi Pengalaman Pengguna (User Experience & Interaction Specification)
1. Navigasi dan Hirarki Informasi
Navigasi sistem dibuat sederhana agar pengguna dapat menemukan fitur yang dibutuhkan dengan mudah. Fitur utama seperti Dashboard, Data Warga, Pengajuan Surat, dan Iuran ditempatkan pada bagian navigasi yang mudah ditemukan.
Informasi yang dianggap penting ditampilkan dengan jelas. Contohnya, status pengajuan surat ditampilkan pada halaman yang mudah diakses sehingga warga dapat mengetahui perkembangan pengajuannya tanpa harus membuka banyak halaman.
2. Umpan Balik Interaksi (Feedback/Status)
Sistem memberikan informasi kepada pengguna setelah melakukan suatu tindakan. Informasi tersebut dapat berupa notifikasi berhasil atau gagal, indikator proses, maupun perubahan status.
Sebagai contoh, setelah warga mengirim pengajuan surat, sistem memberikan informasi bahwa pengajuan telah berhasil dikirim. Warga juga dapat melihat status pengajuan, seperti "Diproses", "Disetujui", atau "Ditolak".
3. Pencegahan Kesalahan (Error Prevention)
Untuk mengurangi kesalahan dalam penggunaan sistem, setiap formulir diberikan validasi sesuai dengan jenis data yang dimasukkan. Contohnya, NIK harus terdiri dari 16 digit, nominal iuran hanya dapat diisi menggunakan angka, dan file yang diunggah harus sesuai dengan ketentuan yang ditentukan.
Selain itu, sistem memberikan konfirmasi sebelum pengguna melakukan tindakan tertentu, seperti menghapus data atau menyetujui pengajuan. Dengan cara tersebut, kesalahan akibat tindakan pengguna dapat dikurangi.
C. Alur Sistem dan Interaksi (User Flow & Task Flow)
Alur sistem dibuat untuk menggambarkan langkah-langkah yang dilakukan pengguna dalam menjalankan fitur utama. Setiap alur dilengkapi dengan diagram alur dan deskripsi tiap tahapan. Alur yang dirancang meliputi:

1. Alur Pengajuan Surat oleh Warga

[GAMBAR 3.1 — Diagram Alur Pengajuan Surat oleh Warga]

Outline diagram:
- Mulai → Login ke sistem
- Memilih jenis surat yang akan diajukan (SKCK, SKTM, paspor, dll.)
- Mengisi formulir pengajuan sesuai jenis surat yang dipilih
- Mengunggah dokumen persyaratan yang dibutuhkan
- Mengirim pengajuan → sistem merekam pengajuan dengan status "Diajukan"
- Warga memantau status pengajuan melalui halaman riwayat pengajuan
- Setelah disetujui pengurus, warga mengunduh surat yang telah diterbitkan
- Selesai

Deskripsi tahapan:
Warga mengakses sistem melalui portal warga dan melakukan login. Setelah berhasil masuk, warga memilih jenis surat yang ingin diajukan dari daftar layanan yang tersedia. Sistem menampilkan formulir yang sesuai dengan jenis surat beserta daftar persyaratan yang harus dipenuhi. Warga mengisi formulir dan mengunggah dokumen persyaratan, kemudian mengirimkan pengajuan. Sistem secara otomatis mencatat pengajuan dengan status awal "Diajukan" dan menampilkannya pada halaman pemantauan pengajuan. Warga dapat memantau perkembangan status (Diajukan, Diverifikasi, Disetujui, atau Ditolak) tanpa perlu menghubungi pengurus secara langsung. Apabila pengajuan disetujui, warga dapat mengunduh surat yang telah diterbitkan secara digital.

2. Alur Persetujuan Surat oleh Pengurus

[GAMBAR 3.2 — Diagram Alur Persetujuan Surat oleh Pengurus]

Outline diagram:
- Mulai → Login sebagai admin_rw atau pengurus_rt
- Membuka daftar pengajuan surat yang masuk dengan status "Diajukan"
- Memilih pengajuan dan membuka detail pengajuan
- Memeriksa kelengkapan data warga dan dokumen persyaratan
- Jika lengkap → melakukan verifikasi dan mengubah status ke "Diverifikasi"
- Jika tidak lengkap → menolak dengan catatan alasan penolakan (status "Ditolak")
- Pengurus menyetujui pengajuan yang telah diverifikasi → sistem menerbitkan surat
- Selesai

Deskripsi tahapan:
Pengurus RW atau pengurus RT yang berwenang membuka daftar pengajuan surat yang masuk. Sistem menampilkan pengajuan yang masih berstatus "Diajukan" beserta informasi warga pengaju, jenis surat, dan waktu pengajuan. Pengurus membuka detail pengajuan untuk memeriksa kelengkapan data kependudukan warga yang telah tersambung dari modul kependudukan, serta memeriksa dokumen persyaratan yang diunggah. Apabila pengajuan dinilai lengkap dan memenuhi syarat, pengurus melakukan verifikasi dan mengubah status pengajuan. Apabila terdapat kekurangan, pengurus dapat menolak pengajuan disertai catatan alasan yang akan ditampilkan kepada warga. Pengajuan yang telah disetujui akan diterbitkan secara sistem dan dapat diunduh oleh warga.

3. Alur Pembayaran Iuran melalui QRIS

[GAMBAR 3.3 — Diagram Alur Pembayaran Iuran melalui QRIS]

Outline diagram:
- Mulai → Login sebagai warga
- Membuka menu Iuran dan melihat daftar tagihan yang belum dibayar
- Memilih tagihan iuran yang akan dibayar
- Sistem menampilkan nominal tagihan dan kode QRIS yang sesuai
- Warga melakukan pembayaran melalui aplikasi pembayaran digital
- Sistem menerima konfirmasi pembayaran dari payment gateway
- Status tagihan diperbarui menjadi "Lunas" secara otomatis
- Selesai

Deskripsi tahapan:
Warga membuka menu Iuran pada portal warga dan melihat daftar tagihan iuran yang belum dibayar beserta nominal dan periode tagihan. Setelah memilih tagihan yang akan dilunasi, sistem menampilkan kode QRIS yang dapat dipindai menggunakan aplikasi pembayaran digital (mobile banking, dompet digital). Warga melakukan pembayaran melalui aplikasi pembayaran masing-masing. Setelah pembayaran berhasil, sistem menerima notifikasi konfirmasi dari payment gateway dan secara otomatis memperbarui status tagihan warga tersebut menjadi "Lunas". Riwayat pembayaran tersimpan dan dapat dilihat kembali oleh warga maupun pengurus yang berwenang.

4. Alur Pengelolaan Data Warga

[GAMBAR 3.4 — Diagram Alur Pengelolaan Data Warga oleh Pengurus]

Outline diagram:
- Mulai → Login sebagai admin_rw atau pengurus_rt
- Membuka menu Data Warga
- Memilih tindakan: tambah data baru atau perbarui data yang sudah ada
- Mengisi atau memperbarui formulir data warga (NIK, nama, KK, alamat, status tinggal, dll.)
- Sistem melakukan validasi input (format NIK 16 digit, kelengkapan field wajib, duplikasi)
- Jika valid → data disimpan ke basis data dan audit trail dicatat secara otomatis
- Jika tidak valid → sistem menampilkan pesan galat dan meminta koreksi
- Selesai

Deskripsi tahapan:
Pengurus membuka menu Data Warga dan dapat memilih untuk menambahkan data warga baru atau memperbarui data warga yang sudah ada. Untuk penambahan data baru, pengurus mengisi formulir yang mencakup NIK, nama lengkap, nomor KK, tanggal lahir, alamat, dan status tinggal. Untuk pembaruan data, pengurus membuka profil warga yang bersangkutan dan mengubah field yang diperlukan beserta alasan perubahan. Setelah pengurus menyimpan data, sistem melakukan validasi secara otomatis, termasuk pemeriksaan format NIK 16 digit numerik, kelengkapan field wajib, dan pengecekan duplikasi NIK. Apabila validasi berhasil, data disimpan dan sistem secara otomatis mencatat jejak audit yang memuat waktu perubahan, identitas pengurus yang melakukan perubahan, serta nilai sebelum dan sesudah perubahan.




3.3.3 Spesifikasi Keamanan dan Akses
  a. Persyaratan Keamanan Data dan Aplikasi
Tabel 3.3 Spesifikasi Kebutuhan Non-Fungsional Keamanan
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

  b. Persyaratan Akses dan Sesi
 Tabel 3.4 Spesifikasi Kebutuhan Non-Fungsional Akses dan Sesi
ID	Deskripsi Kebutuhan Non-Fungsional	Prioritas
NFRA-01	Sistem menerapkan RBAC dengan empat peran: admin_rw, pengurus_rt, bendahara, warga. Matriks izin didefinisikan di satu tempat (permissions.ts)	Must
NFRA-02	Pemeriksaan akses dilakukan di sisi server pada seluruh permintaan (hooks.server.ts) dan diperiksa ulang di layout grup rute (defence in depth)	Must
NFRA-03	Izin ditegakkan per aksi (create/read/update/delete) sesuai matriks, tidak hanya per grup rute. Contohnya, bendahara hanya membaca data warga dan pengurus_rt tidak dapat menghapus pengumuman	Must
NFRA-04	Peran yang tidak dikenal atau tidak valid tidak diberi akses (fail-closed)	Must
NFRA-05	Pengguna ber-peran warga yang membuka rute staf diarahkan ke portal warga (/portal) tanpa menampilkan galat 403. Peran staf yang tidak berhak atas suatu rute menerima 403. Otorisasi tetap ditegakkan di server	Must
NFRA-06	Pengguna tanpa sesi yang mengakses rute terlindungi diarahkan ke halaman masuk	Must
NFRA-07	Pengguna warga hanya dapat melihat data iuran dan pembayaran miliknya sendiri, bukan data warga lain	Must
NFRA-08	Pembuatan akun dan penetapan peran hanya dilakukan oleh admin_rw. Peran bawaan akun baru adalah warga (least privilege)	Must
NFRA-09	Sesi pengguna berakhir otomatis setelah periode tidak aktif yang ditetapkan (target awal 60 menit, disesuaikan setelah wawancara)	Should
NFRA-10	NIK dan No. KK disamarkan pada tampilan daftar. Nilai utuh hanya ditampilkan pada halaman detail untuk peran yang berwenang (admin_rw dan pengurus_rt wilayahnya). Contoh: 3275••••••••0001	Should

c. Matriks Role-Based Access Control (RBAC)
Tabel 3.5 Matriks Hak Akses Peran Sistem (RBAC)
Modul / Sumber Daya	admin_rw	pengurus_rt	bendahara	warga
Warga & KK	C, R, U, D	C, R, U,R*	R	N/A
RT & RW	R, U	R,R	R	N/A
Pengumuman	C, R, U, D	R	R	R
Iuran	C, R, U, D	R	C, R, U, D	R*
Kas	C, R, U, D	R	C, R, U, D	N/A
Pengurus	C, R, U, D	R	R	N/A
Surat	C, R, U, D	C, R, U, R*	R	C, R*

Keterangan:
•	C = Create, R = Read, U = Update, D = Delete, N/A = No Access.
•	R* / C* = Akses terbatas pada wilayah RT/RW bersangkutan atau data milik pribadi pengguna.
3.3.4 Spesifikasi Fungsional
Spesifikasi fungsional menjabarkan fungsi-fungsi utama yang harus disediakan oleh sistem untuk setiap modul. Spesifikasi ini menjadi acuan dalam perancangan dan pengujian sistem.

Tabel 3.6 Spesifikasi Fungsional Modul Kependudukan
ID	Nama Fungsi	Deskripsi	Aktor
SF-KP-01	Tambah Data Warga	Pengurus dapat menambahkan data warga baru meliputi NIK, nama, tanggal lahir, nomor KK, alamat, dan status tinggal. Sistem memvalidasi format NIK 16 digit dan mencegah duplikasi.	admin_rw, pengurus_rt
SF-KP-02	Ubah Data Warga	Pengurus dapat memperbarui data warga yang sudah ada disertai alasan perubahan. Sistem mencatat jejak audit setiap perubahan secara otomatis.	admin_rw, pengurus_rt
SF-KP-03	Nonaktifkan Data Warga	Pengurus dapat menonaktifkan data warga (pindah, meninggal) tanpa penghapusan permanen. Status warga diperbarui beserta tanggal dan alasan.	admin_rw, pengurus_rt
SF-KP-04	Cari dan Saring Data Warga	Pengguna dapat mencari warga berdasarkan nama, NIK, nomor KK, atau RT. Hasil pencarian ditampilkan dalam waktu maksimal 3 detik pada volume 10.000 data.	admin_rw, pengurus_rt, bendahara
SF-KP-05	Lihat Profil Warga	Pengguna dapat melihat detail data warga termasuk riwayat perubahan data. NIK dan nomor KK disamarkan pada tampilan daftar dan hanya ditampilkan utuh pada halaman detail untuk peran yang berwenang.	admin_rw, pengurus_rt
SF-KP-06	Impor Data Warga	Admin dapat mengunggah data warga massal melalui berkas CSV atau XLSX. Sistem memvalidasi setiap baris dan melaporkan baris yang tidak valid tanpa menghentikan proses impor keseluruhan.	admin_rw
SF-KP-07	Rekap Demografis	Sistem menghasilkan laporan rekapitulasi demografis warga (jumlah per RT, status tinggal, rentang usia) yang dapat diekspor ke format CSV.	admin_rw
SF-KP-08	Pengajuan Pembaruan Data oleh Warga	Warga dapat mengajukan pembaruan data kependudukan melalui sistem. Pengajuan berstatus Diajukan, Diverifikasi, Disetujui, atau Ditolak, dan harus disetujui pengurus sebelum perubahan diterapkan.	warga

Tabel 3.7 Spesifikasi Fungsional Modul Surat-Menyurat
ID	Nama Fungsi	Deskripsi	Aktor
SF-SR-01	Ajukan Surat	Warga dapat mengajukan permohonan surat (SKCK, SKTM, keterangan domisili, dan jenis lainnya) melalui sistem. Formulir pengajuan disesuaikan dengan jenis surat, dan data kependudukan warga diisi otomatis dari modul kependudukan.	warga, pengurus_rt
SF-SR-02	Unggah Persyaratan	Warga dapat mengunggah dokumen persyaratan yang dibutuhkan untuk setiap jenis surat. Sistem memvalidasi format dan ukuran berkas yang diunggah.	warga, pengurus_rt
SF-SR-03	Pantau Status Pengajuan	Warga dapat memantau status pengajuan surat secara real-time melalui halaman riwayat pengajuan tanpa perlu menghubungi pengurus.	warga
SF-SR-04	Verifikasi Pengajuan	Pengurus memeriksa kelengkapan data dan dokumen persyaratan pengajuan. Pengurus dapat mengubah status pengajuan menjadi Diverifikasi atau Ditolak disertai catatan alasan.	admin_rw, pengurus_rt
SF-SR-05	Setujui dan Terbitkan Surat	Admin RW menyetujui pengajuan yang telah diverifikasi dan menerbitkan surat. Sistem mencatat nomor surat, tanggal penerbitan, dan menyimpan riwayat surat secara permanen.	admin_rw
SF-SR-06	Unduh Surat	Warga dapat mengunduh surat yang telah diterbitkan dalam format PDF setelah pengajuan disetujui.	warga
SF-SR-07	Lihat Riwayat Surat	Pengurus dapat melihat seluruh riwayat pengajuan dan penerbitan surat beserta statusnya. Warga hanya dapat melihat riwayat pengajuan miliknya sendiri.	admin_rw, pengurus_rt, warga

Tabel 3.8 Spesifikasi Fungsional Modul Keuangan (Kas RW)
ID	Nama Fungsi	Deskripsi	Aktor
SF-KS-01	Catat Pemasukan	Bendahara dapat mencatat transaksi pemasukan kas RW meliputi sumber dana, nominal, tanggal, dan keterangan. Sistem memperbarui saldo kas secara otomatis.	admin_rw, bendahara
SF-KS-02	Catat Pengeluaran	Bendahara dapat mencatat transaksi pengeluaran kas RW meliputi kategori pengeluaran, nominal, tanggal, bukti transaksi, dan keterangan. Sistem memperbarui saldo kas secara otomatis.	admin_rw, bendahara
SF-KS-03	Unggah Bukti Transaksi	Bendahara dapat mengunggah berkas bukti transaksi (foto kuitansi, nota) untuk setiap entri transaksi.	admin_rw, bendahara
SF-KS-04	Lihat Saldo Kas	Pengguna yang berwenang dapat melihat saldo kas RW terkini beserta ringkasan transaksi terakhir pada dasbor.	admin_rw, bendahara
SF-KS-05	Laporan Keuangan Per Periode	Sistem menghasilkan laporan keuangan berisi ringkasan pemasukan, pengeluaran, dan saldo berdasarkan periode yang dipilih (bulanan, tahunan). Laporan dapat diekspor ke format CSV atau PDF.	admin_rw, bendahara
SF-KS-06	Audit Trail Transaksi	Setiap transaksi mencatat identitas pengguna yang mencatat dan waktu pencatatan. Riwayat transaksi tidak dapat dihapus, hanya dapat dilakukan koreksi dengan mencatat alasan.	admin_rw

Tabel 3.9 Spesifikasi Fungsional Modul Iuran Warga
ID	Nama Fungsi	Deskripsi	Aktor
SF-IU-01	Kelola Jenis Iuran	Admin dapat membuat, mengubah, dan menonaktifkan jenis iuran (iuran bulanan, keamanan, kebersihan, dll.) beserta nominal dan periode pembayaran.	admin_rw, bendahara
SF-IU-02	Buat Tagihan Iuran	Sistem dapat membuat tagihan iuran untuk seluruh warga aktif atau kelompok tertentu secara massal berdasarkan jenis iuran yang telah dikonfigurasi.	admin_rw, bendahara
SF-IU-03	Catat Pembayaran Manual	Bendahara dapat mencatat pembayaran iuran yang diterima secara tunai atau transfer manual beserta tanggal dan metode pembayaran.	admin_rw, bendahara
SF-IU-04	Pembayaran via QRIS	Warga dapat melakukan pembayaran iuran melalui kode QRIS yang ditampilkan sistem. Status tagihan diperbarui otomatis setelah konfirmasi dari payment gateway diterima.	warga
SF-IU-05	Lihat Status Iuran	Warga dapat melihat daftar tagihan iuran miliknya beserta status pembayaran (Belum Bayar, Lunas) dan riwayat pembayaran.	warga
SF-IU-06	Rekap Pembayaran Iuran	Sistem menghasilkan rekap pembayaran iuran per periode yang menampilkan status pembayaran seluruh warga. Rekap dapat diekspor ke format CSV.	admin_rw, bendahara

Tabel 3.10 Spesifikasi Fungsional Modul Pengumuman dan Informasi
ID	Nama Fungsi	Deskripsi	Aktor
SF-PG-01	Buat Pengumuman	Admin atau pengurus yang berwenang dapat membuat pengumuman baru meliputi judul, isi, kategori (kegiatan, jadwal, informasi umum), dan tanggal mulai serta berakhir tampil.	admin_rw
SF-PG-02	Ubah dan Arsipkan Pengumuman	Admin dapat mengubah konten pengumuman yang sudah diterbitkan atau mengarsipkan pengumuman yang sudah tidak relevan tanpa penghapusan permanen.	admin_rw
SF-PG-03	Lihat Pengumuman	Seluruh pengguna yang sudah login dapat melihat daftar pengumuman aktif. Pengumuman ditampilkan berurutan berdasarkan tanggal terbaru.	admin_rw, pengurus_rt, bendahara, warga
SF-PG-04	Cari Pengumuman	Pengguna dapat mencari pengumuman berdasarkan kata kunci atau menyaring berdasarkan kategori dan rentang tanggal.	admin_rw, pengurus_rt, bendahara, warga

3.4 Batasan Asumsi
Perancangan Sistem Informasi RW ini didasarkan pada beberapa asumsi yang dianggap berlaku selama proses perancangan, sebagai berikut:
1. Asumsi tentang struktur organisasi mitra. Struktur organisasi RW yang menjadi acuan adalah struktur umum yang terdiri atas ketua RW, sekretaris, bendahara, dan ketua RT di masing-masing unit. Struktur ini diasumsikan berlaku pada mitra tanpa penyesuaian yang signifikan, mengacu pada praktik umum di lingkungan RW Indonesia.
2. Asumsi tentang literasi digital pengguna. Pengurus RW (admin, bendahara, ketua RT) diasumsikan memiliki literasi digital dasar yang memadai untuk mengoperasikan sistem berbasis web melalui browser. Warga diasumsikan memiliki perangkat smartphone dengan akses internet yang memungkinkan penggunaan portal warga secara mandiri.
3. Asumsi tentang dasar regulasi. Tupoksi RW yang digunakan sebagai acuan penetapan fitur mengacu pada Permendagri No. 18 Tahun 2018 yang berlaku secara nasional. Diasumsikan tidak terdapat peraturan desa (Perdes), peraturan bupati (Perbup), atau peraturan wali kota (Perwali) pada wilayah mitra yang mengubah tupoksi RW secara substantif.
4. Asumsi tentang kapasitas teknologi. SQLite dengan pendekatan penyimpanan single-file diasumsikan cukup untuk menangani volume data pada skala RW yang mencakup ratusan hingga ribuan record warga, transaksi kas, dan catatan iuran. QRIS diasumsikan secara prinsip tersedia dan dapat diintegrasikan melalui payment gateway pihak ketiga, meskipun provider spesifik dan mekanisme teknis integrasi belum dikonfirmasi pada tahap ini.
3.5 Mekanisme Perancangan
Mekanisme perancangan Sistem Informasi RW dilakukan secara bertahap dengan mengacu pada kebutuhan administrasi RW, batasan realistis, standar keteknikan, serta spesifikasi rancangan yang telah ditentukan. Proses perancangan dilakukan untuk menghasilkan sistem yang dapat mengintegrasikan pengelolaan data kependudukan, administrasi surat-menyurat, keuangan kas RW, iuran warga, serta pengumuman dan informasi RW.

3.5.1 Sistematika Perancangan
Sistematika perancangan menggambarkan urutan tahapan yang dilakukan secara terstruktur dalam merancang Sistem Informasi RW. Setiap tahapan menghasilkan artefak yang menjadi masukan bagi tahapan berikutnya, sehingga proses perancangan bersifat iteratif dan dapat ditelusuri.

Tahapan mekanisme perancangan yang dilakukan adalah sebagai berikut:

1.	Identifikasi dan Analisis Kebutuhan
Tahap pertama dilakukan dengan mengidentifikasi permasalahan administrasi yang terjadi pada lingkungan RW melalui analisis regulasi, observasi, dan evaluasi plausibility. Identifikasi mencakup proses pengelolaan data kependudukan, administrasi surat, pencatatan kas, pengelolaan iuran, dan penyampaian informasi. Kebutuhan sistem kemudian ditentukan berdasarkan permasalahan yang ditemukan, struktur organisasi RW, regulasi yang menjadi acuan, serta batasan proyek.
Hasil dari tahap ini digunakan untuk menentukan kebutuhan fungsional dan non-fungsional sistem sebagaimana tercantum dalam spesifikasi fungsional (Subbab 3.3.4) dan spesifikasi keamanan (Subbab 3.3.3). Kebutuhan keamanan juga ditentukan dengan mempertimbangkan perlindungan data pribadi, autentikasi, kontrol akses, serta pencatatan aktivitas pengguna.

2.	Perancangan Data dan Basis Data
Tahap berikutnya adalah merancang struktur data yang akan digunakan oleh sistem. Perancangan dilakukan dengan menentukan entitas, atribut, hubungan antarentitas, serta aturan integritas data.
Entitas utama yang dirancang meliputi RW, RT, KK, warga, surat, iuran, pembayaran, transaksi kas, dan pengumuman. Struktur basis data menggunakan model relasional dengan kunci primer dan kunci asing untuk menjaga hubungan antar data. Pemodelan dituangkan dalam Entity Relationship Diagram (ERD) sebagai artefak utama tahap ini.
Perancangan basis data juga mempertimbangkan validasi data, pencegahan duplikasi, serta kebutuhan pencatatan riwayat perubahan data. Data kependudukan menjadi sumber data utama yang dapat digunakan oleh modul administrasi lainnya.

3.	Perancangan Arsitektur Sistem
Arsitektur sistem dirancang menggunakan aplikasi berbasis web dengan SvelteKit sebagai framework aplikasi. Sistem menggunakan SQLite sebagai basis data, Drizzle ORM sebagai pengelola interaksi dengan basis data, dan Better Auth untuk mendukung proses autentikasi dan manajemen sesi.
Arsitektur dirancang dengan pemisahan antara antarmuka pengguna, logika aplikasi, autentikasi, otorisasi, dan pengelolaan basis data. Pendekatan ini digunakan untuk menjaga struktur sistem tetap terorganisasi dan memudahkan pengembangan serta pemeliharaan. Detail komponen arsitektur diuraikan lebih lanjut pada Subbab 3.5.4.

4.	Perancangan UI/UX dan Alur Interaksi
Perancangan antarmuka dilakukan dengan mempertimbangkan karakteristik pengguna sistem yang terdiri atas pengurus RW, pengurus RT, bendahara, dan warga. Antarmuka dirancang responsif agar dapat digunakan melalui komputer, laptop, maupun smartphone.
Tahap ini mencakup perancangan struktur navigasi, layout halaman, komponen antarmuka, formulir, tabel, card, modal, badge, dan notifikasi. Alur interaksi dirancang berdasarkan tugas utama pengguna sebagaimana dijabarkan dalam diagram alur pada Subbab 3.3.2.
Setiap tindakan pengguna diberikan umpan balik berupa status proses, pesan berhasil atau gagal, serta konfirmasi untuk tindakan tertentu. Validasi input diterapkan untuk membantu mencegah kesalahan pengguna.

5.	Perancangan Keamanan dan Hak Akses
Keamanan dirancang sejak tahap awal dengan menerapkan Role-Based Access Control (RBAC). Sistem memiliki empat peran utama, yaitu admin_rw, pengurus_rt, bendahara, dan warga. Setiap peran memperoleh hak akses sesuai dengan tanggung jawabnya sebagaimana tercantum pada matriks RBAC Tabel 3.5.
Kontrol akses diterapkan pada sisi server dan diperiksa kembali pada bagian yang membutuhkan otorisasi dengan prinsip defence in depth. Sistem menggunakan prinsip least privilege sehingga pengguna hanya dapat mengakses data dan fungsi yang sesuai dengan kewenangannya.
Perlindungan data juga diterapkan melalui hashing kata sandi, validasi input menggunakan Zod, parameterized query melalui Drizzle ORM, perlindungan sesi, masking NIK dan Nomor KK, serta pencatatan aktivitas tertentu melalui audit trail.

6.	Perancangan dan Implementasi Modul Sistem
Setelah rancangan data, arsitektur, UI/UX, dan keamanan ditentukan, dilakukan perancangan modul berdasarkan ruang lingkup Core MVP. Modul yang menjadi fokus meliputi:
a. Modul Kependudukan untuk mengelola data RW, RT, KK, dan warga.
b. Modul Surat-Menyurat untuk mengelola pengajuan surat, verifikasi, persetujuan, penerbitan, dan riwayat surat warga.
c. Modul Keuangan untuk mencatat pemasukan, pengeluaran, transaksi, saldo, dan bukti transaksi kas RW.
d. Modul Iuran untuk mengelola jenis iuran, tagihan, pembayaran, dan status pembayaran warga.
e. Modul Pengumuman dan Informasi untuk menyampaikan informasi kegiatan dan pengumuman kepada warga.
Implementasi modul dilakukan dengan mempertahankan hubungan antar data sehingga informasi yang digunakan oleh setiap modul tetap konsisten.

7.	Integrasi Antar Modul
Setiap modul diintegrasikan melalui basis data terpusat. Data kependudukan digunakan sebagai sumber informasi untuk modul lain yang membutuhkan identitas warga, termasuk modul surat-menyurat dan modul iuran. Data iuran terhubung dengan data warga dan pencatatan pembayaran, sedangkan transaksi keuangan digunakan untuk menghasilkan informasi mengenai kondisi kas RW.
Integrasi dilakukan untuk mengurangi pencatatan data yang berulang dan menjaga konsistensi informasi antar modul. Detail hubungan antar komponen diuraikan lebih lanjut pada Subbab 3.5.4.

8.	Pengujian dan Verifikasi Rancangan
Tahap terakhir dilakukan dengan menguji fungsi sistem berdasarkan kebutuhan yang telah ditentukan. Pengujian mencakup fungsi utama, validasi data, alur pengguna, hak akses, autentikasi, serta mekanisme keamanan.
Hasil pengujian dibandingkan dengan spesifikasi rancangan dan kebutuhan sistem. Mekanisme verifikasi dan validasi yang digunakan diuraikan lebih lanjut pada Subbab 3.5.2. Apabila ditemukan ketidaksesuaian, dilakukan perbaikan pada rancangan atau implementasi sebelum sistem dinyatakan memenuhi kebutuhan perancangan.

3.5.2 Deskripsi Mekanisme Verifikasi dan Validasi
Verifikasi dan validasi rancangan dilakukan untuk memastikan bahwa sistem yang dihasilkan memenuhi spesifikasi yang telah ditetapkan (verifikasi) dan benar-benar menjawab kebutuhan pengguna serta mitra (validasi). Kedua mekanisme ini diterapkan pada setiap modul sistem.

a. Mekanisme Verifikasi
Verifikasi dilakukan untuk memeriksa kesesuaian antara hasil implementasi dengan spesifikasi rancangan. Mekanisme verifikasi yang diterapkan meliputi:

1. Pengujian Fungsional (Functional Testing): Setiap fungsi yang tercantum dalam spesifikasi fungsional (Tabel 3.6 hingga 3.10) diuji secara individual untuk memastikan keluaran yang dihasilkan sesuai dengan yang diharapkan. Pengujian dilakukan menggunakan skenario uji yang mencakup kondisi normal (happy path) dan kondisi batas (edge case).

2. Pengujian Validasi Input: Seluruh masukan formulir diuji terhadap aturan validasi yang telah ditetapkan, termasuk format NIK 16 digit, kelengkapan field wajib, dan pencegahan duplikasi data. Masukan yang tidak valid harus menghasilkan pesan galat yang informatif dalam Bahasa Indonesia.

3. Pengujian Kontrol Akses: Setiap endpoint dan halaman diuji untuk memastikan bahwa hak akses diberlakukan sesuai matriks RBAC pada Tabel 3.5. Pengujian mencakup skenario akses oleh peran yang berwenang, peran yang tidak berwenang, dan pengguna tanpa sesi aktif.

4. Pengujian Keamanan Aplikasi: Dilakukan pemeriksaan terhadap potensi kerentanan berdasarkan OWASP Top 10, termasuk uji terhadap injection melalui input formulir, pemeriksaan header keamanan respons HTTP, dan uji mekanisme rate limiting pada halaman masuk.

b. Mekanisme Validasi
Validasi dilakukan untuk memastikan sistem yang dibangun sesuai dengan kebutuhan nyata mitra dan pengguna. Mekanisme validasi yang diterapkan meliputi:

1. Validasi dengan Mitra: Hasil perancangan (prototype atau sistem yang sudah berjalan) dipresentasikan kepada pengurus RW 06 untuk mendapatkan umpan balik mengenai kesesuaian fitur, alur, dan antarmuka dengan proses administrasi yang berjalan di lapangan.

2. Pengujian Penerimaan Pengguna (User Acceptance Testing / UAT): Pengguna representatif dari setiap peran (admin_rw, pengurus_rt, bendahara, warga) melakukan pengujian dengan skenario tugas nyata. Hasil UAT digunakan untuk menilai kemudahan penggunaan dan kelengkapan fungsi dari perspektif pengguna.

3. Pemeriksaan Kesesuaian Regulasi: Spesifikasi dan implementasi sistem diperiksa kembali terhadap ketentuan UU PDP No. 27/2022 dan regulasi terkait untuk memastikan pengelolaan data pribadi warga sesuai dengan kewajiban hukum yang berlaku.

3.5.3 Timeline Perancangan
Perancangan Sistem Informasi RW dilaksanakan dalam satu semester sesuai kurikulum program studi. Berikut adalah rencana timeline perancangan yang disusun berdasarkan tahapan sistematika perancangan pada Subbab 3.5.1.

[GAMBAR 3.5 — Diagram Gantt Timeline Perancangan SI-RW]

Outline timeline (estimasi 16 minggu / 1 semester):

Tabel 3.11 Rencana Timeline Perancangan
Tahap	Kegiatan	Minggu
1	Identifikasi dan analisis kebutuhan; studi regulasi; wawancara/observasi mitra	1–2
2	Perancangan data dan ERD; perancangan skema basis data	3–4
3	Perancangan arsitektur sistem; setup environment pengembangan	5
4	Perancangan UI/UX; wireframe; perancangan alur interaksi	5–6
5	Perancangan keamanan; definisi matriks RBAC; konfigurasi autentikasi	6
6	Implementasi modul: Kependudukan & Autentikasi	7–9
7	Implementasi modul: Surat-Menyurat & Keuangan	9–11
8	Implementasi modul: Iuran & Pengumuman	11–12
9	Integrasi antar modul; pengujian integrasi	13
10	Verifikasi dan validasi; UAT bersama mitra	14–15
11	Perbaikan pasca-UAT; finalisasi dokumentasi	16

Catatan: Timeline bersifat estimasi dan dapat disesuaikan berdasarkan hasil observasi mitra serta perkembangan implementasi di lapangan.

3.5.4 Identifikasi Komponen Sistem Terintegrasi
Sistem Informasi RW terdiri atas sejumlah komponen yang saling terintegrasi untuk mendukung seluruh fungsi yang telah dispesifikasikan. Setiap komponen memiliki tanggung jawab yang terdefinisi dengan jelas dan berinteraksi melalui antarmuka yang terstandar.

a. Komponen Lapisan Antarmuka (Presentation Layer)
Antarmuka pengguna dikembangkan menggunakan SvelteKit dengan Svelte 5 dalam mode runes. Komponen antarmuka mencakup:
- Portal Pengurus: Dasbor, manajemen kependudukan, pengelolaan surat, pencatatan kas, manajemen iuran, dan pengelolaan pengumuman.
- Portal Warga: Pengajuan surat, pemantauan status pengajuan, pembayaran iuran via QRIS, dan akses pengumuman.
- Komponen bersama: Navigasi, formulir dengan validasi real-time, tabel data, modal konfirmasi, dan notifikasi status.

b. Komponen Lapisan Logika Aplikasi (Application Layer)
Logika bisnis dikelola oleh SvelteKit melalui server-side rendering dan server actions. Komponen utama meliputi:
- Route handlers dan server actions per modul yang menangani operasi CRUD dan alur bisnis.
- Middleware autentikasi pada hooks.server.ts yang memverifikasi sesi pada setiap permintaan.
- Guard akses (guard.ts) yang menegakkan RBAC sesuai matriks izin (permissions.ts).
- Skema validasi input menggunakan Zod yang dijalankan di sisi server sebelum data diproses.

c. Komponen Lapisan Autentikasi dan Otorisasi (Auth Layer)
- Better Auth mengelola proses autentikasi, manajemen sesi berbasis cookie, dan penyimpanan data akun pengguna.
- Sesi disimpan dalam cookie dengan atribut HttpOnly, Secure, dan SameSite untuk keamanan transmisi.
- Peran pengguna (admin_rw, pengurus_rt, bendahara, warga) disimpan dalam tabel pengguna dan dibaca pada setiap permintaan untuk keperluan otorisasi.

d. Komponen Lapisan Data (Data Layer)
- Drizzle ORM mengelola seluruh interaksi dengan basis data menggunakan parameterized queries untuk mencegah SQL injection.
- SQLite (via Turso/libsql) digunakan sebagai basis data relasional dengan pendekatan single-file untuk lingkungan lokal dan URL libsql untuk lingkungan produksi.
- Skema basis data mendefinisikan seluruh entitas sistem (warga, KK, RT, surat, iuran, kas, pengumuman) beserta relasinya.

e. Komponen Integrasi Antar Modul
Integrasi antar modul dilakukan melalui basis data terpusat dengan pola referensi foreign key. Hubungan integrasi utama adalah:

Tabel 3.12 Hubungan Integrasi Antar Modul
Modul Sumber	Modul Tujuan	Data yang Diintegrasikan
Kependudukan	Surat-Menyurat	Data warga diisi otomatis pada formulir pengajuan surat berdasarkan NIK pengguna
Kependudukan	Iuran	Tagihan iuran dibuat berdasarkan daftar warga aktif; nama warga ditampilkan pada rekap iuran
Kependudukan	Pengumuman	Pengumuman dapat difilter berdasarkan cakupan wilayah RT/RW
Iuran	Keuangan	Pembayaran iuran yang terverifikasi secara otomatis dicatat sebagai pemasukan pada kas RW
Autentikasi	Semua Modul	Identitas pengguna yang terautentikasi digunakan untuk audit trail, pembatasan akses data, dan pencatatan aktivitas

f. Komponen Eksternal
- Payment Gateway (QRIS): Diintegrasikan untuk memproses pembayaran iuran non-tunai. Provider spesifik dan mekanisme teknis integrasi dikonfirmasi bersama mitra sebelum implementasi.
- Browser/Klien: Pengguna mengakses sistem melalui browser web pada komputer atau smartphone tanpa memerlukan instalasi aplikasi tambahan.



 



BAB IV 

HASIL PERANCANGAN

4.1 Proses Perancangan

 
4.2 Hasil Rancangan

 
4.3 Verifikasi Hasil Rancangan


 
BAB V 

ANALISIS BIAYA & KELAYAKAN PERANCANGAN


5.1 Identifikasi Biaya Terkait Rancangan




5.2 Analisis Kelayakan Perancangan


5.3 Rencana Implementasi Hasil Rancangan


 
BAB VI  

EVALUASI DAN VALIDASI HASIL RANCANGAN


6.1 Validasi Hasil Rancangan

 
BAB VII KESIMPULAN DAN SARAN

7.1 Kesimpulan


 
7.2 Saran

 
DAFTAR PUSTAKA



