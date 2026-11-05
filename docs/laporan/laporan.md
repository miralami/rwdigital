<!-- Sumber Markdown usulan laporan. Artefak asli = Capstone.docx; cermin teksnya ada di cermin.txt (jangan diedit). Aturan format: AGENTS.md § Laporan. -->

# PROPOSAL CAPSTONE PROJECT

# RANCANG BANGUN RW DIGITAL: SISTEM INFORMASI ADMINISTRASI RUKUN WARGA BERBASIS WEB MENGGUNAKAN METODE ITERATIVE AND INCREMENTAL DEVELOPMENT (STUDI KASUS: RW 06 KELURAHAN KOTA BARU, KOTA BEKASI)

Disusun Oleh

Shaffira Indana Zulfa | 102042300049

Afif Nur Sena | 102042300189

Lintong Sahat Josua Sitohang | 102042300128

Muhammad Zidan A lfarizi | 102042300196

Alizha Tiara Syafahira | 102042330201

PROGRAM STUDI STRATA 1 SISTEM INFORMASI FAKULTAS REKAYAS INDUSTRI UNIVERSITAS TELKOM

2026

<!-- Daftar isi, daftar gambar, dan daftar tabel dibuat otomatis di Word. Nomor halaman tidak ditulis di sini. -->

# DAFTAR ISI

# ABSTRAK

<!-- Isi abstrak belum ditulis. -->

# DAFTAR GAMBAR

# DAFTAR TABEL

# BAB I PENDAHULUAN

## 1.1 Latar Belakang

Perkembangan teknologi digital di Indonesia mendorong berbagai aktivitas administrasi dan pelayanan masyarakat untuk beradaptasi dengan pemanfaatan sistem digital. Tingkat penetrasi internet Indonesia yang telah mencapai lebih dari 80% populasi menunjukkan bahwa penggunaan teknologi digital telah menjadi bagian dari aktivitas masyarakat sehari-hari (APJII, 2023). Kondisi tersebut membuka peluang bagi pemanfaatan teknologi dalam mendukung pengelolaan administrasi di tingkat masyarakat, termasuk pada lingkungan Rukun Warga (RW). Namun, kebutuhan terhadap digitalisasi tidak dapat hanya ditentukan berdasarkan perkembangan teknologi secara umum, melainkan perlu disesuaikan dengan tugas pokok dan fungsi (tupoksi) serta permasalahan nyata yang dihadapi oleh masing-masing lingkungan

Berdasarkan UU No. 6 Tahun 2014 tentang Desa dan Permendagri No. 18 Tahun 2018 tentang Lembaga Kemasyarakatan Desa dan Lembaga Adat Desa, RW merupakan lembaga kemasyarakatan yang memiliki fungsi dalam pengelolaan data kependudukan, pengelolaan keuangan swadaya masyarakat, dan penyampaian informasi kepada warga. Dalam pelaksanaannya, administrasi RW pada umumnya masih dilakukan secara manual menggunakan dokumen fisik berupa buku register warga, pencatatan keuangan di spreadsheet yang terpisah per RT, serta penyebaran informasi melalui platform pesan instan seperti WhatsApp. Proses administrasi yang tersebar dan tidak terstruktur ini menimbulkan berbagai kendala dalam pengelolaan harian maupun pelaporan.

Kendala umum yang diidentifikasi dalam proses administrasi RW meliputi: (1) data kependudukan yang tersebar di berbagai dokumen dan sulit untuk dikonsolidasikan, sehingga menyulitkan pengurus dalam menyusun laporan maupun memberikan pelayanan yang akurat; (2) pencatatan keuangan kas RW yang tidak transparan dan rentan terhadap kesalahan hitung, mengingat tidak adanya sistem pencatatan ganda yang terstandar; (3) pembayaran iuran warga yang masih dilakukan secara tunai atau transfer manual sehingga memerlukan proses rekonsiliasi yang memakan waktu dan berisiko terhadap perbedaan catatan; serta (4) penyampaian informasi dan pengumuman yang bergantung pada grup WhatsApp, sehingga informasi mudah terlewati, sulit ditelusuri kembali, dan tidak dapat diakses secara terstruktur. Kondisi-kondisi tersebut menunjukkan adanya kebutuhan untuk menyediakan suatu media pengelolaan administrasi yang lebih terpadu dan terstruktur.

Di sisi lain, perkembangan penggunaan pembayaran digital di Indonesia membuka peluang untuk mendukung proses pembayaran iuran warga secara non-tunai. Nilai transaksi QRIS (Quick Response Code Indonesian Standard) di Indonesia terus mengalami peningkatan signifikan, menunjukkan bahwa metode pembayaran berbasis kode QR telah semakin diterima dan digunakan dalam aktivitas transaksi masyarakat sehari-hari (Bank Indonesia, 2023). Pemanfaatan QRIS dalam pembayaran iuran RW dapat menjadi salah satu alternatif yang relevan apabila sesuai dengan kebutuhan dan mekanisme pembayaran yang diterapkan oleh mitra.

Berdasarkan kondisi yang telah diuraikan, dapat disimpulkan bahwa permasalahan administrasi pada RW meliputi pengelolaan data kependudukan yang tidak terpusat, pencatatan keuangan yang tidak transparan, pembayaran iuran yang memerlukan rekonsiliasi manual, serta penyampaian informasi yang tidak terstruktur. Permasalahan-permasalahan tersebut menunjukkan kebutuhan terhadap suatu sistem informasi yang dapat mengintegrasikan proses administrasi RW secara lebih efisien dan terstruktur.

Oleh karena itu, capstone project ini mengusulkan pengembangan Sistem Informasi RW (SI-RW) yang disesuaikan dengan kebutuhan mitra. Penentuan fitur sistem didasarkan pada analisis regulasi resmi (UU Desa 6/2014, Permendagri 18/2018) dan evaluasi *plausibility* untuk konteks implementasi capstone. Fitur yang dikembangkan mencakup manajemen data kependudukan, layanan surat-menyurat, pengelolaan keuangan kas RW, manajemen iuran warga, dan penyampaian pengumuman/informasi. Setiap fitur dirancang untuk menjawab permasalahan yang telah diidentifikasi, sehingga sistem yang dihasilkan diharapkan dapat membantu meningkatkan efisiensi pengelolaan administrasi serta memberikan akses informasi yang lebih terstruktur bagi pengurus dan warga RW.

## 1.2 Alternatif Solusi

Dalam menghadapi permasalahan administrasi RW yang telah diidentifikasi pada subbab sebelumnya, terdapat beberapa alternatif solusi yang dapat dipertimbangkan. Analisis terhadap masing-masing alternatif dilakukan berdasarkan kesesuaiannya dengan konteks RW tingkat kelurahan, kemampuan mengatasi permasalahan yang ada, serta keterbatasan yang dimilikinya. Sebelum alternatif solusi dirumuskan, akar permasalahan terlebih dahulu dianalisis agar solusi yang dipilih menjawab penyebab, bukan hanya gejala.

### 1.2.1 Analisis Akar Masalah (*Fishbone Diagram*)

Analisis akar masalah dilakukan menggunakan *Fishbone Diagram* (*cause-and-effect diagram*), yaitu diagram yang menempatkan permasalahan sebagai akibat (*effect*) pada kepala diagram dan mengelompokkan faktor-faktor penyebabnya ke dalam beberapa kategori yang mengarah pada permasalahan tersebut (Ilie & Ciocoiu, 2010). Pendekatan ini telah digunakan untuk menganalisis akar masalah kesiapan sistem pemerintahan elektronik di tingkat daerah (Permatasari et al., 2025), sehingga relevan untuk konteks administrasi kemasyarakatan seperti RW.

<!-- [Gambar 1.1 Fishbone Diagram — tempel di Word] -->

**Gambar 1.1** *Fishbone Diagram* Permasalahan Administrasi RW 06

Permasalahan utama (*effect*) yang dianalisis adalah pengelolaan administrasi RW 06 yang tidak efisien, data kependudukan dan keuangan yang rawan hilang dan tidak konsisten, serta penyampaian informasi yang tidak terstruktur. Faktor penyebabnya dikelompokkan sebagai berikut:

1. **Manusia.** Literasi digital pengurus RT dan RW beragam; pengelolaan data bergantung pada segelintir orang; riwayat data sulit diwariskan saat pergantian pengurus.
2. **Metode.** Pencatatan warga, kas, dan iuran masih manual; belum ada prosedur baku untuk pembaruan data warga; rekonsiliasi iuran dilakukan secara *ad hoc*; pengumuman dan layanan surat melalui jalur informal yang tidak terdokumentasi.
3. **Mesin/Perangkat.** Belum ada aplikasi terpadu yang menghubungkan seluruh RT dengan RW; spreadsheet tersimpan terpisah di perangkat masing-masing pengurus; grup WhatsApp tidak dirancang untuk pengarsipan dan penelusuran informasi.
4. **Material/Dokumen.** Buku register, kuitansi, dan buku kas fisik rentan rusak atau hilang; NIK dan Nomor KK berpotensi tercatat ganda antar-RT karena tidak ada sumber data tunggal; bukti transaksi sulit ditelusuri.
5. **Manajemen.** Belum ada pembagian hak akses yang jelas atas data warga dan kas; status tunggakan iuran tidak terpantau secara berkala; belum ada kebijakan pelindungan data pribadi warga di tingkat RW.
6. **Lingkungan.** Tidak tersedia anggaran swadaya untuk server khusus atau langganan aplikasi berbayar; warga perkotaan heterogen (warga tetap, pengontrak, penghuni kos) dengan mobilitas kependudukan yang tinggi.

Hasil analisis tersebut menunjukkan bahwa permasalahan tidak hanya disebabkan oleh media pencatatan manual, tetapi juga oleh metode kerja, tata kelola kewenangan, dan keterbatasan sumber daya. Karena itu, alternatif solusi dinilai berdasarkan kemampuannya mengatasi penyebab-penyebab tersebut secara terpadu.

### 1.2.2 Analisis Alternatif Solusi

#### Alternatif 1: Mempertahankan proses manual (status quo)

Pengelolaan administrasi RW secara manual menggunakan buku register, spreadsheet Excel, kuitansi fisik, dan grup WhatsApp merupakan pendekatan yang saat ini paling umum diterapkan. Pendekatan ini tidak memerlukan biaya teknologi tambahan dan tidak bergantung pada ketersediaan infrastruktur internet.

Namun, pendekatan ini memiliki keterbatasan yang signifikan: data kependudukan tersebar di berbagai dokumen dan mudah hilang, pencatatan keuangan rentan terhadap kesalahan dan sulit diaudit, rekonsiliasi iuran memerlukan waktu yang panjang, serta informasi yang disebarkan melalui WhatsApp mudah terlewati dan tidak dapat ditelusuri kembali secara terstruktur. Data sensitif seperti NIK dan nomor KK juga berisiko tersebar tanpa kontrol akses yang memadai. Pendekatan ini tidak berkelanjutan untuk kebutuhan digitalisasi administrasi yang lebih terstandar.

#### Alternatif 2: Menggunakan platform SaaS existing yang menyasar RT/RW

Terdapat beberapa platform yang telah dikembangkan oleh pihak ketiga untuk kebutuhan administrasi RT/RW di Indonesia, salah satunya adalah Pak RT (pakrt.id). Platform ini menyediakan fitur data penduduk, kas RT, iuran, tagihan, dan pengumuman yang secara langsung menyasar konteks RT/RW — berbeda dengan Sistem Informasi Desa (SID/OpenSID) yang lebih berorientasi pada birokrasi desa, atau Siskeudes/SIPKD yang dirancang khusus untuk pengelolaan APBDes.

Kelebihan utama pendekatan ini adalah kecepatan implementasi dan ketersediaan fitur yang sudah teruji. Namun, kelemahannya meliputi ketergantungan terhadap vendor eksternal (risiko perubahan model bisnis atau penghentian layanan), biaya langganan yang dapat membebani kas RW, minimnya kontrol terhadap data warga (PII) yang disimpan di server pihak ketiga, serta keterbatasan kustomisasi untuk menyesuaikan alur dengan kebutuhan spesifik mitra.

#### Alternatif 3: Pengembangan sistem khusus (SI-RW)

Alternatif ketiga adalah merancang dan membangun sistem informasi secara khusus sesuai kebutuhan mitra, sebagaimana yang diusulkan dalam capstone project ini. Sistem dikembangkan menggunakan tech stack modern (SvelteKit, SQLite/Turso, Drizzle ORM, Better Auth) dengan fitur yang ditetapkan berdasarkan analisis regulasi resmi dan evaluasi *plausibility*.

Pendekatan ini memberikan fleksibilitas penuh dalam menentukan fitur, alur, dan kontrol akses sesuai struktur organisasi RW. Data warga dapat dikelola dengan kontrol keamanan yang dirancang sejak awal. Tidak ada biaya langganan kepada vendor eksternal, dan sistem dapat dikembangkan lebih lanjut setelah capstone selesai. Kelemahan utamanya adalah waktu dan biaya pengembangan awal, serta kebutuhan akan kapasitas teknis untuk pemeliharaan sistem pasca-handover.

**Perbandingan Alternatif**

| Aspek | Manual | Platform SaaS RT/RW | Custom SI-RW |
| --- | --- | --- | --- |
| Biaya awal | Rp0 | Rp0 – berbayar (langganan) | Pengembangan (satu kali) |
| Kecepatan implementasi | Instan | Instan | Sedang |
| Kesesuaian kebutuhan RW | Tinggi (familiar) | Tinggi | Sangat tinggi |
| Manajemen kependudukan | Terbatas | Baik | Baik |
| Manajemen kas & iuran | Buruk | Sangat baik | Sangat baik |
| Kontrol data & keamanan PII | Buruk | Perlu verifikasi vendor | Dapat dioptimalkan sejak awal |
| Transparansi ke warga | Rendah | Baik | Baik |
| Ketergantungan vendor | Tidak ada | Tinggi | Tidak ada |
| Kustomisasi | Tidak ada | Terbatas | Penuh |
| Keberlanjutan | Buruk (risiko hilang) | Tergantung vendor | Baik (self-host) |

Berdasarkan analisis di atas, alternatif pengembangan sistem khusus (SI-RW) dipilih sebagai solusi dalam capstone project ini. Pendekatan ini memungkinkan perancangan yang sepenuhnya disesuaikan dengan kebutuhan mitra, menjaga kontrol terhadap data sensitif warga, dan memberikan landasan yang dapat dikembangkan lebih lanjut pasca-capstone tanpa ketergantungan pada vendor eksternal.

## 1.3 Perumusan Masalah

Berdasarkan latar belakang yang telah diuraikan, rumusan masalah dalam perancangan Sistem Informasi RW ini adalah sebagai berikut:

1. Bagaimana merancang sistem informasi yang dapat mengelola data kependudukan warga secara terpusat dan terstruktur di tingkat RW?
2. Bagaimana merancang layanan surat-menyurat yang memanfaatkan data kependudukan sehingga pengajuan, verifikasi, dan penerbitan surat dapat dilakukan dan dipantau melalui sistem?
3. Bagaimana merancang sistem pencatatan keuangan kas RW yang transparan dan dapat diakses oleh pengurus yang berwenang?
4. Bagaimana merancang mekanisme pembayaran iuran warga yang mendukung pencatatan otomatis dan berpotensi mengakomodasi metode digital?
5. Bagaimana merancang media penyampaian pengumuman dan informasi RW yang terstruktur dan mudah diakses oleh warga?
6. Bagaimana merancang sistem dengan kontrol akses berbasis peran (role-based access) yang sesuai dengan struktur organisasi RW dan melindungi data pribadi warga?

## 1.4 Tujuan Perancangan

Tujuan perancangan capstone project ini adalah menghasilkan sistem informasi RW yang dapat membantu RW 06, Kelurahan Kota Baru, Kecamatan Bekasi Barat, Kota Bekasi dalam mengelola administrasi masyarakat secara lebih terstruktur dan terintegrasi.

Secara khusus, tujuan perancangan sistem ini menjawab setiap rumusan masalah pada subbab 1.3, yaitu:

1. Menghasilkan modul kependudukan yang mengelola data RT, KK, dan warga secara terpusat sebagai satu sumber data, menggantikan pencatatan pada buku dan spreadsheet yang terpisah.
2. Menghasilkan modul surat-menyurat yang mengambil data dari modul kependudukan, sehingga warga dapat mengajukan surat (misalnya pengantar SKCK atau SKTM), pengurus dapat memverifikasi dan menerbitkannya, dan warga dapat memantau statusnya.
3. Menghasilkan modul kas RW yang mencatat setiap pemasukan dan pengeluaran beserta pencatatnya, menghitung saldo secara otomatis, dan menyajikan laporan per periode.
4. Menghasilkan modul iuran yang menerbitkan tagihan per KK, mencatat pembayaran tunai sebagai pemasukan kas tanpa input ganda, dan disiapkan untuk pembayaran nontunai melalui QRIS.
5. Menghasilkan modul pengumuman yang menyampaikan informasi dan kegiatan RW kepada warga melalui satu media yang terarsip.
6. Menerapkan kontrol akses berbasis peran dan pelindungan data pribadi (penyamaran NIK/No. KK, validasi masukan, dan jejak audit) yang sesuai dengan struktur organisasi RW 06.

## 1.5 Manfaat Perancangan

Perancangan sistem informasi RW ini diharapkan dapat memberikan manfaat bagi pengurus RW, pengurus RT, dan warga RW 06, Kelurahan Kota Baru, Kecamatan Bekasi Barat, Kota Bekasi. Manfaat perancangan disesuaikan dengan fitur sistem yang dirancang, yaitu manajemen kependudukan, surat-menyurat, keuangan, iuran warga, serta pengumuman dan informasi RW.

### Bagi Pengurus RW

**a. Manajemen Kependudukan**

Membantu pengurus RW dalam menyimpan, mengelola, mencari, dan memperbarui data kependudukan secara terpusat. Data yang dikelola meliputi data KK, KTP, nama, alamat, usia, dan status tinggal warga.

**b. Surat-Menyurat**

Membantu pengurus dalam mengelola proses pelayanan surat secara lebih terstruktur. Sistem dapat mendukung pengajuan surat, penggunaan template surat, pemberian nomor surat, proses persetujuan, serta penyimpanan riwayat surat.

**c. Keuangan dan Kas RW**

Membantu bendahara dalam mencatat pemasukan dan pengeluaran RW, mengelompokkan transaksi, memantau saldo kas, menyimpan bukti transaksi, serta menghasilkan laporan keuangan berdasarkan periode tertentu.

**d. Iuran Warga**

Membantu pengurus dalam mengelola jenis dan nominal iuran, mencatat pembayaran warga, mengetahui status pembayaran, serta menghasilkan rekap pembayaran iuran secara terstruktur.

**e. Pengumuman dan Informasi RW**

Menyediakan media terpusat untuk menyampaikan pengumuman, informasi kegiatan, jadwal kerja bakti, rapat warga, dan informasi lainnya kepada warga.

### Bagi Pengurus RT

- a. Membantu pengurus RT dalam mengakses dan memperbarui data warga sesuai dengan hak akses yang diberikan.
- b. Membantu pengurus RT dalam mendukung proses administrasi dan pengajuan surat warga.
- c. Memudahkan pengurus RT dalam memantau informasi terkait warga dan kegiatan RW melalui sistem.

### Bagi Warga

- a. Memudahkan warga dalam mengajukan layanan administrasi yang tersedia melalui sistem.
- b. Memudahkan warga dalam menyampaikan atau memperbarui informasi kependudukan melalui mekanisme yang disediakan.
- c. Memudahkan warga dalam mengetahui status pembayaran iuran.
- d. Memudahkan warga dalam memperoleh pengumuman dan informasi RW melalui satu media yang terstruktur.

### Bagi Pengelolaan Administrasi RW

- a. Mengurangi ketergantungan terhadap pencatatan menggunakan buku dan file Excel yang terpisah melalui penyediaan sistem administrasi yang terintegrasi.
- b. Menyediakan penyimpanan riwayat data dan transaksi sehingga informasi administrasi dapat ditelusuri kembali sesuai kebutuhan.
- c. Membantu mengintegrasikan data kependudukan dengan proses administrasi lain yang membutuhkan data warga.
- d. Menyediakan informasi administrasi yang lebih terstruktur bagi pengurus dan warga sesuai dengan hak akses masing-masing.

# BAB II TINJAUAN PUSTAKA

## 2.1 *Body of Knowledge*

*Body of Knowledge* (BoK) yang menjadi acuan dalam Capstone Design Project perancangan purwarupa sistem informasi rukun warga pada penelitian ini mengacu pada kerangka kerja *IS2020 A Competency Model for Undergraduate Programs in Information Systems*. Sebagai upaya penyelesaian permasalahan administrasi pada lingkungan mitra, pengembangan sistem ini melibatkan tiga domain utama dalam *Body of Knowledge* (BoK) pada digambar dibawah ini.

<!-- [Gambar BoK IS2020 — tempel di Word] -->

Berikut area utama yang menjadi fokus dalam kajian domain dalam penyelesaian permasalahan pada administrasi di lingkungan mitra :

### Data

Domain Data pada berfokus pada penyimpanan dan pemrosesan data dalam suatu organisasi, yang mencakup pengelolaan basis data, analisis data, dan visualisasi data. Dalam perancangan ini, area yang digunakan adalah Data/Information Management, khususnya perancangan dan pengelolaan basis data. BoK ini relevan karena inti permasalahan yang diangkat adalah pengelolaan data. Pada RW 06, data kependudukan masih dicatat menggunakan buku, sedangkan data yang sama dibutuhkan untuk berbagai keperluan, seperti pengajuan surat untuk paspor, SKCK, dan SKTM, penetapan iuran, serta penyampaian pengumuman. Pencatatan yang terpisah pada media yang berbeda berpotensi menimbulkan duplikasi dan ketidakkonsistenan data (Connolly & Begg, 2015), sehingga diperlukan satu sumber data yang terpusat dan terstruktur.

BoK ini diterapkan melalui beberapa kegiatan. Pertama, pemodelan data menggunakan Entity Relationship Diagram (ERD) untuk entitas utama, seperti warga, KK, RT, surat, transaksi kas, iuran, dan pengumuman. Kedua, perancangan basis data relasional yang dinormalisasi dengan kunci primer, kunci asing, dan batasan integritas. Ketiga, penerapan aturan validasi dan penyimpanan riwayat perubahan data agar kualitas data terjaga. Keempat, penyusunan rekap dan laporan, seperti rekap iuran dan laporan kas per periode, agar data dapat digunakan sebagai informasi pendukung keputusan pengurus.

### Development (Systems Analysis & Design dan Application Development)

Domain Development pada mencakup siklus hidup pengembangan aplikasi, mulai dari analisis dan perancangan sistem hingga pemrograman aplikasi, termasuk pemrograman web dan perancangan antarmuka pengguna (Leidig & Salmela, 2021). BoK ini relevan karena solusi yang diusulkan berupa sistem informasi yang melibatkan lebih dari satu kelompok pengguna, yaitu pengurus RW, bendahara, pengurus RT, dan warga, dengan kebutuhan dan hak akses yang berbeda. Kebutuhan tersebut perlu diidentifikasi secara sistematis sebelum sistem dibangun, agar sistem sesuai dengan proses yang berjalan di mitra (Dennis et al., 2018). Selain itu, pengguna sistem memiliki tingkat kemampuan digital yang beragam sehingga perancangan antarmuka yang sederhana dan konsisten menjadi bagian penting dari kelayakan penggunaan sistemBoK ini diterapkan melalui analisis kebutuhan berdasarkan observasi dan wawancara dengan pengurus RW, pemodelan sistem, perancangan antarmuka, serta pembangunan dan pengujian aplikasi.

### Technology (Secure Computing)

Domain Technology pada mencakup infrastruktur teknologi informasi, keamanan komputasi (secure computing), dan teknologi baru (Leidig & Salmela, 2021). Dalam perancangan ini, area yang digunakan adalah Secure Computing. BoK ini relevan karena sistem menyimpan data pribadi warga, seperti nama, alamat, KK, dan KTP, serta data keuangan RW yang meliputi transaksi kas dan pembayaran iuran. Kebocoran, perubahan tanpa izin, atau hilangnya data tersebut dapat merugikan warga maupun pengurus. BoK ini diterapkan melalui autentikasi pengguna, pengaturan hak akses sesuai peran pengguna, serta perlindungan data pribadi dan data transaksi.

## 2.2 Teori / Konsep Umum / Model / Kerangka Standar Terkait Perancangan

### 2.2.1 Teori Data dan Kependudukan

Data dan Kependudukan memaparkan teori yang mendasari modul pengelolaan data warga sebagai sumber informasi utama sistem. Secara konseptual, data kependudukan dikelola sebagai aset organisasi yang kualitasnya meliputi keakuratan, kelengkapan, konsistensi, dan aksesibilitas dijaga melalui mekanisme validasi isian serta pemanfaatan basis data terpusat. Untuk mendukung hal tersebut, perancangan sistem menggunakan Sistem Manajemen Basis Data (DBMS) relasional dengan pendekatan Entity Relationship Model (ERD) dan normalisasi guna mencegah redundansi. Basis data ini menstrukturkan entitas kewilayahan secara hierarkis, yakni dari tingkat RW, RT, Kartu Keluarga (KK), hingga warga, dengan pengamanan integritas data melalui kunci primer dan perekaman riwayat perubahan.

### 2.2.2 Teori UI/UX & Interaksi

User Interface (UI) dan User Experience (UX) merupakan dua komponen utama yang berinteraksi secara sinergis dalam menentukan efektivitas, kegunaan, serta keberhasilan penerapan suatu sistem informasi digital. User Interface berfokus pada elemen tata letak visual, konsistensi warna, hirarki tipografi, dan navigasi yang bertindak sebagai jembatan komunikasi visual antara manusia dan sistem. Di sisi lain, User Experience mencakup aspek emosional, respons kognitif, serta tingkat kepuasan subjektif pengguna ketika berinteraksi dan menyelesaikan tugas tertentu di dalam produk digital. Sebagaimana dijelaskan oleh Windrianto dan Suryani (2025), penerapan metodologi desain antarmuka berbasis kebutuhan pengguna mampu menyelaraskan kebutuhan fungsionalitas sistem dengan kenyamanan operasional pengguna. Hal ini diperkuat oleh studi Ramadhana et al. (2025) yang menegaskan bahwa integrasi UI/UX yang tepat terbukti secara signifikan dapat meningkatkan aksesibilitas, kemudahan navigasi, serta meminimalkan beban kognitif pengguna (*learning curve*) saat mengoperasikan platform digital.

Sementara itu, Interaction Design (IxD) atau desain interaksi bertindak sebagai fondasi operasional yang mengatur bagaimana sistem merespons setiap bentuk tindakan dan masukan dari pengguna secara intuitif. Konsep interaksi ini mendasarkan diri pada alur kerja (workflow) yang logis, pemberian umpan balik (feedback) secara waktu nyata, penyediaan kemudahan navigasi, serta penerapan keteraturan pola untuk mencegah kesalahan penggunaan (*error prevention*). Dalam konteks aplikasi layanan dan pengelolaan data administrasi, arsitektur interaksi yang terstruktur secara teratur memungkinkan pengguna menyelesaikan transaksi tanpa hambatan teknis. Sebagaimana dijelaskan oleh Alja et al. (2025), perancangan antarmuka dan pola interaksi yang adaptif terbukti secara signifikan meningkatkan efisiensi operasional sistem serta mempercepat waktu penyelesaian tugas (*task completion rate*). Hal ini sejalan dengan temuan Nurhasanah dan Kusumadiarti (2024) yang menyatakan bahwa optimalisasi desain interaksi yang terstruktur secara metodologis berhasil memperjelas penyampaian informasi dan meningkatkan kepuasan pengguna secara menyeluruh.

### 2.2.3 Teori Software Engineering dan Arsitektur Perangkat Lunak

Software Engineering merupakan pendekatan sistematis dalam pengembangan perangkat lunak yang mencakup kegiatan analisis kebutuhan, perancangan, implementasi, pengujian, dan pemeliharaan sistem. Pendekatan ini digunakan untuk memastikan perangkat lunak yang dikembangkan dapat memenuhi kebutuhan pengguna, memiliki struktur yang terorganisasi, serta dapat dikembangkan dan dipelihara secara berkelanjutan. Dalam perancangan Sistem Informasi RW, konsep Software Engineering digunakan sebagai dasar dalam menerjemahkan kebutuhan administrasi RW menjadi fungsi dan komponen sistem yang terstruktur.

Arsitektur perangkat lunak merupakan struktur tingkat tinggi yang menggambarkan pembagian komponen sistem, hubungan antar komponen, serta aliran data dan proses di dalam aplikasi. Perancangan arsitektur diperlukan agar setiap bagian sistem memiliki tanggung jawab yang jelas dan tidak saling bergantung secara berlebihan. Pada sistem berbasis web, arsitektur dapat memisahkan bagian antarmuka pengguna, logika aplikasi, serta pengelolaan basis data sehingga proses pengembangan dan pemeliharaan sistem menjadi lebih terstruktur.

Dalam perancangan Sistem Informasi RW, konsep arsitektur digunakan untuk mengatur hubungan antara antarmuka pengguna, proses bisnis, autentikasi dan otorisasi, serta basis data. Pemisahan tanggung jawab tersebut diterapkan agar pengelolaan data kependudukan, kas RW, iuran warga, dan pengumuman dapat dikembangkan sebagai bagian sistem yang terstruktur. Arsitektur juga mendukung penerapan kontrol akses dan validasi pada sisi server sehingga proses pengolahan data tidak hanya bergantung pada antarmuka pengguna.

Penerapan konsep Software Engineering dan arsitektur perangkat lunak pada perancangan ini mencakup analisis kebutuhan, pemodelan sistem, perancangan basis data, perancangan antarmuka, penerapan mekanisme keamanan, implementasi modul, integrasi komponen, serta pengujian sistem. Dengan pendekatan tersebut, rancangan sistem diharapkan memiliki struktur yang jelas, mudah dikembangkan, dan sesuai dengan kebutuhan pengguna serta batasan perancangan.

### 2.2.4 Siklus Iterative & Incremental, Kanban, dan Prioritisasi MoSCoW

#### 2.2.4.1 Iterative and Incremental Development

Iterative and Incremental Development (IID) adalah model proses pengembangan perangkat lunak yang membangun sistem melalui serangkaian siklus berulang (iterasi), di mana setiap siklus menghasilkan tambahan kemampuan (inkremen) pada sistem yang tetap dapat berfungsi (Larman & Basili, 2003). Aspek inkremental berarti sistem dibangun bagian demi bagian, misalnya modul demi modul, lalu setiap bagian diintegrasikan ke sistem yang telah ada. Aspek iteratif berarti bagian yang sudah dibangun dievaluasi kembali dan disempurnakan, termasuk perubahan rancangan basis data, logika bisnis, maupun arsitektur, ketika ditemukan ketidaksesuaian dengan kebutuhan (Pressman & Maxim, 2020).

Model ini sesuai untuk perancangan RW Digital karena kebutuhan mitra belum dapat dirumuskan secara lengkap di awal. Ruang lingkup fitur awal disusun berdasarkan regulasi dan praktik umum RW, kemudian divalidasi dan direvisi bersama pengurus RW 06 seiring berjalannya pengembangan. Berbeda dengan model Waterfall yang menetapkan seluruh spesifikasi di awal, IID memungkinkan revisi dilakukan secara bertahap tanpa penulisan ulang sistem secara total.

#### 2.2.4.2 Metode Kanban

Metode Kanban adalah metode pengelolaan alur kerja berbasis Lean yang berfokus pada visualisasi aliran kerja (visualize workflow), pembatasan pekerjaan dalam proses (limit Work in Progress / WIP), dan perbaikan aliran tugas secara berkesinambungan (Anderson, 2010). Kanban memberikan fleksibilitas tinggi bagi tim pengembang untuk merespons kebutuhan secara adaptif tanpa terikat oleh siklus rilis kaku. Kanban tidak mendefinisikan siklus hidup pengembangan perangkat lunak secara utuh, sehingga pada perancangan ini Kanban dipasangkan dengan model proses IID: IID menentukan bagaimana sistem dikembangkan, sedangkan Kanban menentukan bagaimana pekerjaan tim divisualisasikan dan dikendalikan.

Papan Kanban terdiri atas kolom-kolom yang mewakili tahap kerja, dan setiap pekerjaan direpresentasikan sebagai kartu yang bergerak dari kiri ke kanan. Batas WIP pada kolom pengerjaan mencegah tim memulai terlalu banyak pekerjaan sekaligus, sehingga hambatan (*bottleneck*) lebih mudah terlihat dan pekerjaan diselesaikan sebelum pekerjaan baru diambil (Anderson, 2010). Papan Kanban dapat diwujudkan dengan alat bantu digital seperti GitHub Projects, yang menghubungkan kartu dengan *issue* dan *pull request* pada repositori kode sehingga status kartu dapat berubah otomatis mengikuti aktivitas pengembangan (GitHub, n.d.). Susunan kolom, batas WIP, dan aturan perpindahan kartu yang diterapkan pada perancangan ini dijelaskan pada subbab 3.5.1.

#### 2.2.4.3 Prioritisasi Kebutuhan dengan Metode MoSCoW

Metode MoSCoW adalah teknik analisis untuk mengklasifikasikan kebutuhan sistem ke dalam empat kategori urgensi (Clegg & Barker, 1994):

- **Must Have (M):** Kebutuhan mandatori yang wajib diselesaikan agar produk MVP dapat beroperasi. Tanpa komponen ini, sistem tidak layak diluncurkan (misal: pendataan warga, autentikasi peran, pencatatan kas RW).
- **Should Have (S):** Kebutuhan penting bernilai guna tinggi yang tidak bersifat kritis pada peluncuran perdana (misal: ekspor laporan berformat CSV, filter rentang tanggal, pembatasan upaya login).
- **Could Have (C):** Kebutuhan tambahan atau nilai tambah yang dikerjakan apabila terdapat ketersediaan waktu dan sumber daya (misal: integrasi gerbang pembayaran QRIS otomatis).
- **Won’t Have / Would like (W):** Fitur yang disepakati untuk dikesampingkan dari ruang lingkup proyek saat ini (misal: integrasi kamera pengawas/CCTV dan inventaris sarana prasarana fisik).

### 2.2.5 Pemodelan Proses Bisnis, Sistem, dan Data

Pemodelan digunakan untuk menggambarkan sistem sebelum dan selama dibangun, sehingga kebutuhan, perilaku, dan struktur sistem dapat diperiksa oleh tim maupun mitra. Proses bisnis dimodelkan dengan *Business Process Model and Notation* (BPMN), notasi standar yang menggambarkan urutan aktivitas, keputusan, dan pelaku proses dalam *pool* dan *lane* (Object Management Group, 2014). BPMN dipakai untuk membandingkan proses saat ini (*as-is*) dengan proses usulan (*to-be*).

Perilaku dan struktur perangkat lunak dimodelkan dengan *Unified Modeling Language* (UML). Diagram *use case* menggambarkan fungsi sistem dari sudut pandang aktor, diagram aktivitas menggambarkan alur kerja, diagram *sequence* menggambarkan urutan pesan antarkomponen, dan diagram kelas menggambarkan struktur objek (Booch et al., 2005; Dennis et al., 2020). Struktur data dimodelkan dengan *Entity Relationship Diagram* (ERD) yang menggambarkan entitas, atribut, dan relasi antarentitas sebagai dasar perancangan basis data relasional (Chen, 1976).

### 2.2.6 Pengujian dan Evaluasi Perangkat Lunak

Verifikasi perangkat lunak memeriksa apakah sistem dibangun sesuai spesifikasinya, sedangkan validasi memeriksa apakah sistem yang dibangun sesuai dengan kebutuhan pengguna (Pressman & Maxim, 2020). Pengujian *black box* adalah teknik verifikasi yang menguji fungsi sistem berdasarkan masukan dan keluaran tanpa melihat struktur kode. Teknik yang umum dipakai antara lain *equivalence partitioning* (membagi masukan ke dalam kelas yang diperlakukan sama), *boundary value analysis* (menguji nilai di batas kelas masukan), dan *decision table* (menguji kombinasi kondisi dan aturan bisnis) (Pressman & Maxim, 2020). Pengujian otomatis yang dijalankan setiap kali kode diubah (*continuous integration*) membantu memastikan perubahan baru tidak merusak fungsi yang sudah ada.

Validasi oleh pengguna dilakukan melalui *User Acceptance Testing* (UAT), yaitu pengujian oleh calon pengguna nyata dengan skenario tugas operasional. Tingkat kemudahan penggunaan dapat diukur dengan *System Usability Scale* (SUS), kuesioner sepuluh butir berskala Likert lima poin yang menghasilkan skor 0–100 (Brooke, 1996).

### 2.2.7 Standar Keteknikan dan Regulasi Terkait

Berdasarkan objek perancangan, standar keteknikan dan regulasi yang relevan dikelompokkan sebagai berikut:

1. **Regulasi kelembagaan dan kependudukan:** Undang-Undang Nomor 6 Tahun 2014 tentang Desa, Permendagri Nomor 18 Tahun 2018 tentang Lembaga Kemasyarakatan Desa dan Lembaga Adat Desa, Peraturan Wali Kota Bekasi Nomor 58 Tahun 2020 tentang RT dan RW, serta Undang-Undang Nomor 24 Tahun 2013 tentang Administrasi Kependudukan.
2. **Regulasi dan standar keamanan informasi:** Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi, ISO/IEC 27001:2022 tentang sistem manajemen keamanan informasi, dan OWASP Top 10 (2021) untuk risiko keamanan aplikasi web.
3. **Standar pemodelan:** BPMN 2.0, UML, dan ERD sebagaimana dijelaskan pada subbab 2.2.5.

Pemilihan dan penerapan standar tersebut pada rancangan dijelaskan pada subbab 3.2.

## 2.3 Teori Keamanan Data (PII, Auth)

### 2.3.1 Keamanan Data dan Pelindungan Data Pribadi

Keamanan informasi secara konseptual bertumpu pada tiga properti utama, yaitu kerahasiaan (confidentiality), integritas (integrity), dan ketersediaan (availability) yang dikenal sebagai CIA triad (ISO/IEC, 2022). Pada Sistem Informasi RW, ketiga aspek ini berhubungan langsung dengan tata kelola data warga. Kerahasiaan menjamin bahwa data sensitif seperti Nomor Induk Kependudukan (NIK), Nomor Kartu Keluarga (No. KK), serta alamat warga tidak dapat diakses oleh pihak yang tidak berwenang. Integritas memastikan bahwa data kependudukan maupun transaksi kas tidak diubah tanpa otorisasi yang sah, sedangkan ketersediaan menjamin data dapat diakses oleh pengurus RW/RT saat dibutuhkan untuk keperluan administrasi. Berdasarkan Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP), data kependudukan serta data iuran warga tergolong sebagai Data Pribadi yang wajib dilindungi. UU PDP mengklasifikasikan data pribadi menjadi data umum (seperti nama lengkap dan jenis kelamin) serta data spesifik (seperti data keuangan pribadi) yang memerlukan tingkat perlindungan lebih ketat. Dalam konteks ini, pengurus RW bertindak sebagai Pengendali Data Pribadi yang berkewajiban menerapkan kontrol teknis seperti pembatasan akses (*need-to-know*), minimisasi data, dan penyamaran (masking) data untuk mencegah kegagalan pelindungan data.

### 2.3.2 Autentikasi dan Manajemen Sesi

Dalam mendukung aspek autentikasi dan manajemen sesi, sistem mengidentifikasi serta memverifikasi pengguna sebelum memberikan hak akses. Pada arsitektur aplikasi web modern, identitas pengguna yang terautentikasi dipertahankan melalui sesi (session) berbasis cookie yang dilindungi atribut HttpOnly untuk mencegah pembacaan oleh skrip jahat, atribut Secure untuk menjamin transmisi terenkripsi, serta SameSite guna membatasi pengiriman lintas situs (Barth, 2011). Penyimpanan kata sandi dalam basis data wajib diolah menggunakan fungsi turunan kunci (key derivation function) berbantuan salt seperti scrypt atau bcrypt guna mempersulit serangan brute-force apabila terjadi kebocoran basis data (NIST, 2017). Pada aplikasi web, pembacaan sesi sebaiknya dilakukan secara terpusat pada setiap permintaan (*request*) di sisi server, sehingga setiap pemeriksaan otorisasi berikutnya berpijak pada identitas pengguna yang sama.

### 2.3.3 Role-Based Access Control (RBAC)

Otorisasi dan pembatasan hak akses ditegakkan menggunakan model Role-Based Access Control (RBAC) yang mengaitkan izin akses dengan peran (role) tertentu, bukan pengguna secara individual (Sandhu et al., 1996). Kewenangan tiap peran dinyatakan dalam matriks operasi (*create, read, update, delete*) terhadap setiap sumber daya. Penerapannya biasanya disertai prinsip *least privilege* (pengguna hanya diberi hak yang dibutuhkan), *defence in depth* (pemeriksaan akses berlapis), dan *fail-closed* (peran yang tidak dikenali otomatis ditolak). Pada organisasi RW, peran dapat dipetakan langsung dari struktur pengurus, misalnya pengurus RW, pengurus RT, bendahara, dan warga.

### 2.3.4 Keamanan Aplikasi Web

Sebagai landasan keamanan aplikasi web secara menyeluruh, perancangan sistem mengacu pada standar Open Worldwide Application Security Project (OWASP) Top 10. Kerentanan *Broken Access Control* ditangani dengan otorisasi berlapis di sisi server. Risiko *Injection* dicegah dengan kueri berparameter (*parameterized queries*) sehingga masukan pengguna tidak dieksekusi sebagai perintah SQL, disertai validasi masukan di sisi server. *Cross-Site Scripting* (XSS) dimitigasi dengan *escaping* keluaran, *Cross-Site Request Forgery* (CSRF) dicegah dengan pemeriksaan asal permintaan (*Origin*), dan kerahasiaan data dalam transmisi dijamin dengan *Transport Layer Security* (TLS/HTTPS) (Rescorla, 2018).

# BAB III SPESIFIKASI DAN MEKANISME PERANCANGAN

## 3.1 Batasan Realistis

Perancangan RW Digital dipengaruhi oleh kondisi nyata pada mitra RW 06 Kelurahan Kota Baru dan pada tim capstone, yang dikelompokkan sebagai berikut:

1. **Sumber daya manusia.** Literasi digital pengurus RW, pengurus RT, dan warga beragam. Mitra tidak memiliki tenaga TI khusus untuk memelihara sistem, sehingga antarmuka harus dapat dipakai tanpa pelatihan teknis yang panjang dan pengoperasian harian tidak boleh menuntut keahlian pemrograman.
2. **Infrastruktur.** Mitra tidak memiliki server sendiri. Pengurus menggunakan laptop atau ponsel pribadi, sedangkan warga umumnya mengakses melalui ponsel dengan koneksi seluler. Sistem harus berbasis web, ringan, dan dapat diakses dari peramban tanpa instalasi aplikasi. Belum tersedia infrastruktur server produksi yang bersifat permanen.
3. **Anggaran.** Tidak tersedia anggaran swadaya untuk server khusus, langganan aplikasi berbayar, maupun akses *payment gateway* produksi. Karena itu, pembayaran nontunai melalui QRIS dirancang dan diuji pada mode uji (*sandbox*) dan baru dapat diaktifkan setelah mitra menyetujui serta memiliki akun penyedia jasa pembayaran.
4. **Waktu.** Pengerjaan dibatasi satu semester akademik, sehingga hanya fitur prioritas Core MVP yang dikerjakan: kependudukan, surat-menyurat, kas RW, iuran warga, serta pengumuman dan informasi. Fitur CCTV, inventaris sarana prasarana, dan manajemen pengurus tidak termasuk dalam cakupan.
5. **Sistem yang berlaku.** Administrasi RW 06 saat ini berjalan manual dengan buku register, spreadsheet, kuitansi fisik, dan grup WhatsApp. Peralihan ke sistem digital harus dapat dilakukan bertahap, termasuk impor data awal dari berkas spreadsheet. Kebutuhan mitra juga belum dapat dirumuskan lengkap sebelum pengembangan dimulai, sehingga ruang lingkup awal disusun dari regulasi dan divalidasi serta direvisi bersama pengurus RW 06 pada setiap iterasi.
6. **Regulasi.** Sistem tidak terintegrasi dengan sistem kependudukan resmi (SIAK Dukcapil) maupun sistem kelurahan, dan surat yang diterbitkan berfungsi sebagai surat pengantar RT/RW, bukan dokumen kependudukan resmi. Pengelolaan data harus mematuhi ketentuan pelindungan data pribadi.

## 3.2 Standar Keteknikan

Standar keteknikan dan regulasi yang diidentifikasi pada subbab 2.2.7 dipilih sebagai acuan rancangan berdasarkan relevansinya terhadap permasalahan. Setiap acuan berikut diturunkan menjadi spesifikasi pada subbab 3.3.

### 3.2.1 Regulasi Kelembagaan RW dan Kependudukan

#### 1. Permendagri Nomor 18 Tahun 2018 tentang Lembaga Kemasyarakatan Desa dan Lembaga Adat Desa

Menetapkan RW sebagai lembaga kemasyarakatan yang bertugas membantu pelayanan pemerintahan, termasuk pendataan kependudukan, dan menyampaikan informasi kepada masyarakat.

- **Relevansi terhadap rancangan:** menjadi dasar ruang lingkup modul kependudukan, surat pengantar, dan pengumuman.

#### 2. Peraturan Wali Kota Bekasi Nomor 58 Tahun 2020

Mengatur bahwa satu RT terdiri atas 30 sampai 100 KK (Pasal 10 ayat (1)) dan satu RW terdiri atas 5 sampai 25 RT (Pasal 14), pembiayaan RT/RW dapat bersumber dari swadaya masyarakat dan bantuan yang sah (Pasal 30 ayat (1)), serta keuangan dikelola secara tertib, transparan, dan akuntabel (Pasal 31).

- **Relevansi terhadap rancangan:** menentukan hierarki data RW–RT–KK–warga, kapasitas minimum data (25 RT × 100 KK = 2.500 KK), serta kewajiban pencatatan kas yang dapat ditelusuri.

#### 3. Undang-Undang Nomor 24 Tahun 2013 tentang Administrasi Kependudukan

Menetapkan NIK sebagai nomor identitas tunggal penduduk dan, melalui Pasal 79A, melarang pungutan biaya dalam pengurusan dokumen kependudukan.

- **Relevansi terhadap rancangan:** NIK dan Nomor KK menjadi kunci identitas yang wajib unik, dan sistem tidak menyediakan tagihan untuk layanan surat pengantar kependudukan.

### 3.2.2 Regulasi dan Standar Keamanan Informasi

#### 1. Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)

Mengklasifikasikan data pribadi menjadi data umum dan spesifik (Pasal 4), di mana data keuangan tergolong data spesifik. Mengatur kewajiban Pengendali Data Pribadi untuk menjamin keamanan pemrosesan data (Pasal 35), mencegah akses yang tidak sah (Pasal 39), serta memberikan pemberitahuan tertulis jika terjadi kegagalan pelindungan data (Pasal 46).

- **Relevansi terhadap rancangan:** akses data kependudukan dibatasi berdasarkan peran, NIK dan Nomor KK disamarkan pada tampilan daftar, perubahan data sensitif dicatat dalam jejak audit, dan kata sandi tidak disimpan dalam bentuk teks asli.

#### 2. ISO/IEC 27001:2022 (Information Security Management System)

Mengacu pada kontrol keamanan informasi Annex A, khususnya A.5.15 (*Access Control*) untuk aturan hak akses logis berdasarkan kebutuhan operasional dan A.8.24 (*Use of Cryptography*) untuk aturan kriptografi. Didukung kontrol A.5.17 (informasi autentikasi), A.8.5 (autentikasi aman), A.8.11 (*data masking*), A.8.15 (*logging*), dan A.8.13 (*backup*).

- **Relevansi terhadap rancangan:** menjadi dasar matriks hak akses per peran, enkripsi transmisi dan *hashing* kata sandi, batas durasi sesi, penyamaran NIK/No. KK, jejak audit, dan pencadangan basis data.

#### 3. Open Worldwide Application Security Project (OWASP) Top 10 (2021)

Acuan sepuluh kategori risiko keamanan aplikasi web yang paling kritis.

- **Relevansi terhadap rancangan:** kategori yang paling relevan adalah A01 *Broken Access Control*, A02 *Cryptographic Failures*, A03 *Injection* (termasuk XSS), A05 *Security Misconfiguration*, dan A07 *Identification and Authentication Failures*. Setiap kategori diturunkan menjadi spesifikasi keamanan pada subbab 3.3 dan diuji pada subbab 4.3.

### 3.2.3 Standar Pemodelan

Pemodelan rancangan menggunakan BPMN 2.0 untuk proses bisnis *as-is* dan *to-be* (Object Management Group, 2014), UML untuk *use case*, aktivitas, *sequence*, dan kelas (Booch et al., 2005), serta ERD untuk struktur basis data (Chen, 1976). Penggunaan notasi standar memungkinkan rancangan diperiksa oleh pembimbing dan dikomunikasikan kepada mitra secara konsisten.

**Tabel 3.1 Ringkasan Standar Keteknikan dan Regulasi yang Digunakan**

| Standar / Regulasi | Butir / Kontrol | Diturunkan menjadi |
| --- | --- | --- |
| Permendagri No. 18/2018 | Tugas LKD dalam pelayanan dan pendataan | Ruang lingkup modul kependudukan, surat, pengumuman |
| Perwali Bekasi No. 58/2020 | Pasal 10, 14, 30, 31 | Hierarki RW–RT–KK, kapasitas ≥ 2.500 KK, kas yang akuntabel |
| UU No. 24/2013 | NIK sebagai identitas tunggal; Pasal 79A | NIK/No. KK 16 digit unik; tanpa tagihan layanan surat |
| UU PDP No. 27/2022 | Pasal 35, 39, 46 | Hak akses per peran, penyamaran PII, jejak audit |
| ISO/IEC 27001:2022 | A.5.15, A.8.24, A.8.5, A.8.11, A.8.13, A.8.15 | Matriks akses, TLS dan *hashing*, batas sesi, *masking*, pencadangan, *logging* |
| OWASP Top 10 (2021) | A01, A02, A03, A05, A07 | Otorisasi di server, kueri berparameter, validasi masukan, pembatasan percobaan masuk |
| BPMN 2.0, UML, ERD | Notasi pemodelan | Artefak rancangan pada subbab 4.1 |

## 3.3 Spesifikasi Rancangan

Spesifikasi rancangan disusun dengan mengelaborasikan batasan realistis (subbab 3.1) dan standar keteknikan (subbab 3.2). Spesifikasi dinyatakan dalam besaran yang dapat diukur agar dapat diverifikasi pada subbab 4.3. Rincian kebutuhan fungsional dan non-fungsional per butir beserta prioritas MoSCoW-nya dijabarkan pada subbab 4.1 sebagai hasil tahap analisis kebutuhan.

### 3.3.1 Spesifikasi Fungsional

**Tabel 3.2 Spesifikasi Fungsional per Modul**

| Modul | Spesifikasi | Dasar |
| --- | --- | --- |
| Kependudukan | Mengelola data RT, KK, dan warga dengan isian wajib NIK, nama, tanggal lahir, Nomor KK, alamat, RT, dan status tinggal; usia dihitung otomatis dari tanggal lahir; data awal dapat diimpor dari berkas CSV/XLSX; data tidak dihapus permanen, melainkan dinonaktifkan dengan riwayat peristiwa; warga dapat mengajukan pembaruan data yang berlaku setelah disetujui pengurus. | Perwali 58/2020; UU 24/2013 |
| Surat-menyurat | Warga atau pengurus RT mengajukan surat pengantar sesuai jenisnya dengan data pemohon terisi otomatis dari modul kependudukan; pemohon mengunggah berkas persyaratan; pengurus memverifikasi, lalu surat disetujui dan diterbitkan dengan nomor otomatis dan tanda tangan elektronik; pemohon memantau status dan mengunduh surat dalam format PDF. | Permendagri 18/2018; UU 24/2013 Pasal 79A |
| Kas RW | Mencatat pemasukan dan pengeluaran beserta kategori, nominal, tanggal, bukti, dan pencatat; saldo dihitung otomatis; koreksi dilakukan melalui pembatalan disertai alasan, bukan penghapusan; laporan per periode dapat diunduh dalam format PDF dan XLSX. | Perwali 58/2020 Pasal 30–31 |
| Iuran warga | Menerbitkan tagihan iuran bagi KK aktif; pembayaran tunai yang dikonfirmasi otomatis tercatat sebagai pemasukan kas tanpa input ganda; pembayaran QRIS disiapkan melalui *payment gateway*; warga melihat riwayat iuran KK sendiri. | Perwali 58/2020 Pasal 31 |
| Pengumuman dan informasi | Pengurus membuat, mengubah, dan mengarsipkan pengumuman beserta gambar kegiatan; warga melihat pengumuman aktif dan menerima notifikasi di dalam aplikasi. | Permendagri 18/2018 |
| Akun dan akses | Akun warga dibuat terpusat oleh pengurus RW (bukan pendaftaran mandiri) untuk mencegah pemakaian NIK orang lain; peran pengguna terdiri atas pengurus RW, pengurus RT, bendahara, dan warga; pengguna dapat memulihkan kata sandi melalui email. | UU PDP; ISO/IEC 27001 A.5.15 |

### 3.3.2 Spesifikasi Non-Fungsional

**Tabel 3.3 Spesifikasi Non-Fungsional dan Ukurannya**

| Kode | Aspek | Spesifikasi | Ukuran / Target | Dasar |
| --- | --- | --- | --- | --- |
| SP-01 | Kapasitas | Menampung data satu RW sesuai batas maksimum Perwali | ≥ 25 RT dan ≥ 2.500 KK | Perwali 58/2020 Pasal 10, 14 |
| SP-02 | Kinerja | Pencarian dan penyaringan data warga | ≤ 3 detik pada 10.000 data warga | Batasan infrastruktur (3.1 butir 2) |
| SP-03 | Integritas data | Validasi NIK dan Nomor KK | Tepat 16 digit angka, tanpa duplikat | UU 24/2013 |
| SP-04 | Kerahasiaan | Penyamaran NIK/No. KK pada tampilan daftar | 4 digit awal + 4 digit akhir tampil (contoh `3275••••••••0001`) | UU PDP; ISO 27001 A.8.11 |
| SP-05 | Kontrol akses | Hak akses per peran dan per aksi, diperiksa di sisi server | 4 peran; peran tidak dikenal = ditolak (*fail-closed*) | UU PDP Pasal 39; OWASP A01 |
| SP-06 | Autentikasi | Kata sandi disimpan sebagai *hash*; transmisi terenkripsi | *Hash* scrypt; HTTPS/TLS ≥ 1.2 di produksi | ISO 27001 A.8.24; OWASP A02 |
| SP-07 | Sesi | Sesi berakhir otomatis | 60 menit | ISO 27001 A.8.5; OWASP A07 |
| SP-08 | Pembatasan percobaan masuk | Pembatasan permintaan ke layanan autentikasi | ≤ 10 permintaan per 60 detik | OWASP A07 |
| SP-09 | Keamanan masukan | Seluruh masukan formulir divalidasi di server; kueri berparameter | 100% formulir tervalidasi skema | OWASP A03 |
| SP-10 | Berkas unggahan | Jenis dan ukuran berkas dibatasi | JPG/PNG/WebP/PDF; ≤ 5 MB (bukti kas), ≤ 10 MB (syarat surat) | OWASP A05 |
| SP-11 | Jejak audit | Perubahan data sensitif dan transaksi keuangan mencatat pelaku dan waktu | 100% transaksi kas dan pembayaran iuran | UU PDP; Perwali Pasal 31 |
| SP-12 | Ketersediaan | Pencadangan basis data | Berkala, minimal mingguan | ISO 27001 A.8.13 |
| SP-13 | Aksesibilitas perangkat | Antarmuka responsif tanpa instalasi | Dapat dipakai pada layar ponsel (lebar ≥ 360 px) hingga desktop | Batasan infrastruktur (3.1 butir 2) |
| SP-14 | Kegunaan | Kemudahan penggunaan menurut pengguna | Skor SUS ≥ 68 | Batasan SDM (3.1 butir 1); Brooke (1996) |
| SP-15 | Biaya | Tanpa biaya langganan bagi mitra | Rp0 biaya lisensi perangkat lunak | Batasan anggaran (3.1 butir 3) |

### 3.3.3 Spesifikasi Teknis

**Tabel 3.4 Spesifikasi Teknis**

| Komponen | Spesifikasi |
| --- | --- |
| Jenis aplikasi | Aplikasi web progresif (PWA) yang diakses melalui peramban |
| Framework | SvelteKit 2 dengan Svelte 5 (TypeScript) |
| Basis data | SQLite melalui Turso/libSQL dengan Drizzle ORM |
| Autentikasi | Better Auth dengan sesi berbasis *cookie* (HttpOnly, Secure, SameSite) |
| Validasi masukan | Skema Zod di sisi server |
| Penyimpanan berkas | Direktori lokal server |
| Pembayaran nontunai | *Payment gateway* QRIS (mode uji) |
| Pengujian | *Continuous integration* (pemeriksaan tipe, *unit test*, *build*, *end-to-end test*) dan pengujian *black box* |

## 3.4 Batasan Asumsi

### 3.4.1 Batasan Perancangan

1. **Data.** Kebutuhan dikumpulkan dari regulasi, wawancara dan observasi bersama pengurus RW 06, serta format dokumen administrasi yang dipakai mitra. Data uji tidak memakai data warga nyata, melainkan data contoh berpenanda seperti "Contoh Warga 1".
2. **Metode.** Perancangan mengikuti model *iterative and incremental* dengan Kanban sebagai pengendali alur kerja. Iterasi dibatasi tiga kali dalam periode semester.
3. **Anggaran.** Tidak ada anggaran pengadaan perangkat atau layanan berbayar; seluruh perangkat lunak yang digunakan berlisensi terbuka atau memiliki paket gratis.
4. **Waktu.** Satu semester akademik, dengan lingkup terbatas pada fitur Core MVP (subbab 3.1 butir 4).
5. **Integrasi.** Sistem berdiri sendiri dan tidak terhubung dengan SIAK Dukcapil maupun sistem kelurahan.

### 3.4.2 Asumsi Perancangan

1. **Struktur organisasi.** Struktur pengurus RW 06 diasumsikan terdiri atas ketua RW, sekretaris, bendahara, dan ketua RT di setiap wilayah, sesuai praktik umum RW di Indonesia.
2. **Literasi digital.** Pengurus diasumsikan mampu mengoperasikan aplikasi web melalui peramban, dan warga diasumsikan memiliki ponsel dengan akses internet.
3. **Dasar regulasi.** Selain Perwali Bekasi Nomor 58 Tahun 2020, diasumsikan tidak terdapat peraturan lain di wilayah mitra yang mengubah tugas RW secara substantif.
4. **Kapasitas teknologi.** SQLite diasumsikan cukup untuk volume data skala RW (ribuan data warga, transaksi kas, dan iuran). QRIS diasumsikan dapat diintegrasikan melalui *payment gateway* pihak ketiga setelah mitra memiliki akun penyedia jasa pembayaran.

## 3.5 Mekanisme Perancangan

### 3.5.1 Sistematika Perancangan

Perancangan RW Digital dilaksanakan dalam siklus *iterative and incremental* (subbab 2.2.4.1). Setiap iterasi menghasilkan penambahan atau penyempurnaan fitur yang tetap berfungsi. Arah setiap iterasi ditentukan oleh umpan balik pengurus RW 06 dan evaluasi internal tim terhadap hasil iterasi sebelumnya, sehingga revisi terjadi bertahap, bukan dalam satu spesifikasi awal yang kaku. Di dalam setiap iterasi, alur kerja dikendalikan melalui papan Kanban pada GitHub Projects (subbab 2.2.4.2). Alur tahapannya disajikan pada Gambar 3.1.

<!-- [Gambar 3.1 Flowchart Sistematika Perancangan — tempel di Word. WAJIB ada panah loop dari tahap 6 kembali ke tahap 1 berlabel "Iterasi berikutnya".] -->

**Gambar 3.1** Sistematika Perancangan RW Digital

1. **Analisis kebutuhan.** Kebutuhan diturunkan dari regulasi (subbab 3.2), hasil pengumpulan data (subbab 3.5.2), dan umpan balik mitra pada iterasi sebelumnya. Proses bisnis saat ini dimodelkan dengan BPMN *as-is*, lalu kebutuhan dirumuskan menjadi kebutuhan fungsional dan non-fungsional, diprioritaskan dengan MoSCoW, dan dicatat sebagai kartu (GitHub Issue) di kolom **Backlog**. Keluaran: daftar kebutuhan dan *product backlog*.
2. **Perancangan sistem.** Kartu yang spesifikasinya telah disepakati dipindahkan ke kolom **Todo/Ready**. Rancangan disusun dalam bentuk BPMN *to-be*, diagram UML, ERD dan kamus data, rancangan antarmuka, serta arsitektur perangkat lunak dan matriks hak akses. Keluaran: artefak rancangan.
3. **Pengembangan inkremental.** Kartu dikerjakan oleh penanggung jawab (PIC) di kolom **In Progress** dengan batas WIP 1–2 kartu per orang dan maksimal 10 kartu per papan. Setiap kartu dikerjakan pada cabang fitur (*feature branch*) terpisah. Keluaran: inkremen modul.
4. **Verifikasi.** Pembuatan *pull request* memindahkan kartu ke kolom **Review/Verification**. *Pull request* menjalani *continuous integration* (pemeriksaan tipe, *unit test*, *build*, dan *end-to-end test*) serta pengujian *black box* terhadap spesifikasi pada subbab 3.3. Keluaran: hasil uji.
5. **Penggabungan.** Kartu yang lolos verifikasi digabungkan ke cabang utama dan dipindahkan ke kolom **Done**. Keluaran: sistem terintegrasi yang tetap berfungsi.
6. **Validasi dan evaluasi.** Hasil iterasi ditinjau bersama pengurus RW 06 dan dievaluasi oleh tim. Temuan dicatat kembali sebagai kartu baru atau kartu revisi di Backlog dan menjadi masukan iterasi berikutnya. Revisi dapat menyentuh bagian yang sudah diimplementasikan, termasuk basis data, logika bisnis, dan arsitektur. Pada iterasi akhir, sistem divalidasi melalui UAT dan SUS (subbab 3.5.3).

Siklus ini dijalankan dalam tiga iterasi: Iterasi 1 (MVP seluruh modul), Iterasi 2 (penyempurnaan keuangan dan portal warga), dan Iterasi 3 (kontrol akses, notifikasi, dan konsolidasi kependudukan). Pelaksanaan setiap tahap dijabarkan pada subbab 4.1 dengan urutan yang sama.

### 3.5.2 Mekanisme Pengumpulan Data

Data perancangan dikumpulkan dari mitra dan dari dokumen acuan. Responden utama adalah pengurus RW 06 karena mereka adalah pelaku langsung administrasi kependudukan, surat, kas, dan iuran sekaligus calon pengguna utama sistem. Wawancara dilakukan secara semi-terstruktur: tim menyiapkan daftar pertanyaan per modul (alur kerja saat ini, kendala, format dokumen, dan kebutuhan fitur), kemudian pertanyaan dikembangkan sesuai jawaban responden. Setelah setiap iterasi, hasil sistem diperagakan kepada pengurus untuk memperoleh umpan balik yang menjadi kartu revisi.

<!-- TODO (Zidan): lengkapi tanggal wawancara/observasi, nama jabatan responden (ketua RW, sekretaris, bendahara, ketua RT), dan jumlah sesi. Jangan tulis nama pribadi warga. -->

**Tabel 3.5 Mekanisme Pengumpulan Data**

| No | Jenis Data | Metode | Sumber / Responden | Tujuan |
| --- | --- | --- | --- | --- |
| 1 | Tugas dan batasan kewenangan RW | Studi dokumen regulasi | UU 6/2014, Permendagri 18/2018, Perwali Bekasi 58/2020, UU 24/2013, UU PDP 27/2022 | Menetapkan ruang lingkup modul dan kepatuhan regulasi |
| 2 | Alur proses bisnis saat ini | Wawancara semi-terstruktur dan observasi | Ketua RW, sekretaris, bendahara, dan ketua RT RW 06 | Menyusun BPMN *as-is* dan mengidentifikasi kendala |
| 3 | Struktur data dan format dokumen | Studi dokumen | Buku register warga, buku kas, kuitansi iuran, format surat pengantar mitra | Menentukan entitas, atribut, dan format keluaran |
| 4 | Kebutuhan dan prioritas fitur | Wawancara dan diskusi prioritas MoSCoW | Pengurus RW 06 | Menyusun *product backlog* dan hak akses per peran |
| 5 | Perangkat dan konektivitas pengguna | Wawancara | Pengurus RW 06 | Menentukan spesifikasi antarmuka dan teknis |
| 6 | Umpan balik per iterasi | Demonstrasi sistem dan diskusi | Pengurus RW 06 | Menentukan kartu revisi untuk iterasi berikutnya |

### 3.5.3 Mekanisme Verifikasi dan Validasi

#### Mekanisme Verifikasi

Verifikasi memeriksa kesesuaian hasil rancangan dengan spesifikasi pada subbab 3.3 dan dilakukan dengan dua lapis:

1. **Verifikasi otomatis.** Setiap *pull request* menjalankan *continuous integration* yang terdiri atas pemeriksaan tipe, *unit test*, *build*, dan *end-to-end test*. *Pull request* yang gagal tidak digabungkan ke cabang utama.
2. **Pengujian *black box* per modul.** Setiap spesifikasi fungsional dan non-fungsional diuji dengan kasus uji berisi masukan, langkah, keluaran yang diharapkan, dan hasil aktual. Teknik yang dipakai adalah *equivalence partitioning* dan *boundary value analysis* untuk validasi masukan (misalnya NIK 15, 16, dan 17 digit; ukuran berkas di bawah dan di atas batas), *decision table* untuk aturan hak akses per peran, serta *state transition* untuk perubahan status surat dan tagihan iuran (Pressman & Maxim, 2020).

Spesifikasi yang terukur (Tabel 3.3) diverifikasi dengan ukurannya masing-masing, misalnya waktu pencarian pada 10.000 data contoh dan atribut *cookie* sesi. Hasil verifikasi disajikan pada subbab 4.3.

#### Mekanisme Validasi

Validasi memeriksa apakah sistem menjawab permasalahan mitra dan layak diimplementasikan:

1. **Validasi per iterasi.** Hasil setiap iterasi diperagakan kepada pengurus RW 06 untuk memperoleh umpan balik atas kesesuaian fitur, alur, dan antarmuka.
2. **User Acceptance Testing (UAT).** Dilaksanakan bersama pengurus RW 06 pada 23–24 November 2026. Responden mewakili setiap peran (pengurus RW, pengurus RT, bendahara, dan warga) dan menjalankan skenario tugas operasional. Hasilnya dicatat dalam berita acara beserta rekap temuan.
3. **System Usability Scale (SUS).** Setelah UAT, responden mengisi kuesioner SUS sepuluh butir (Brooke, 1996). Skor dibandingkan dengan target SP-14 (≥ 68).

Hasil validasi disajikan pada Bab VI.

### 3.5.4 Timeline Perancangan

<!-- TODO: cocokkan nomor minggu dengan kalender akademik. Asumsi saat ini: Minggu 1 = 31 Agustus 2026, sehingga Minggu 5 = 28 Sep, Minggu 8 = 19 Okt, Minggu 10 = 2 Nov, Minggu 13 = 23 Nov, Minggu 15 = 7 Des. -->

**Tabel 3.6 Timeline Pelaksanaan Perancangan**

| Aktivitas | M5 | M6 | M7 | M8 | M9 | M10 | M11 | M12 | M13 | M14 | M15 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pengumpulan data dan analisis kebutuhan | ■ | ■ | | ■ | ■ | ■ | | | | | |
| Perancangan sistem (BPMN, UML, ERD, UI/UX, RBAC) | ■ | ■ | ■ | | ■ | ■ | ■ | | | | |
| Iterasi 1 — MVP seluruh modul | ■ | ■ | ■ | ■ | | | | | | | |
| Iterasi 2 — Penyempurnaan keuangan dan portal | | | | | ■ | | | | | | |
| Iterasi 3 — Kontrol akses, notifikasi, kependudukan | | | | | | ■ | | | | | |
| Verifikasi (CI dan *black box*) | | ■ | ■ | ■ | ■ | ■ | ■ | ■ | | | |
| Validasi per iterasi bersama mitra | | | | ■ | ■ | ■ | | | | | |
| UAT dan SUS bersama pengurus RW 06 | | | | | | | | | ■ | | |
| Perbaikan pasca-UAT | | | | | | | | | ■ | ■ | |
| Penyusunan laporan | | | | | | ■ | ■ | ■ | ■ | ■ | ■ |

### 3.5.5 Identifikasi Komponen Sistem Terintegrasi

Objek permasalahan (administrasi manual RW 06) dan rancangan solusi (RW Digital) dipetakan ke dalam lima komponen sistem terintegrasi pada Tabel 3.7.

**Tabel 3.7 Pemetaan Objek dan Rancangan Solusi ke dalam Komponen Sistem Terintegrasi**

| Komponen | Objek (Sistem Saat Ini) | Rancangan Solusi (RW Digital) |
| --- | --- | --- |
| Manusia | Pengurus RW/RT mencatat data secara manual; bendahara merekap iuran per RT secara terpisah; warga menerima informasi secara pasif melalui grup WhatsApp | Pengurus RW mengelola akun, data induk, persetujuan surat, dan pengumuman; pengurus RT mengelola data warga dan verifikasi surat di wilayahnya; bendahara mengelola kas dan iuran; warga mengajukan surat dan memantau tagihan, dengan kewenangan dibatasi per peran |
| Material | Buku register warga, kuitansi fisik, buku kas, dan fotokopi dokumen persyaratan | Formulir digital, berkas unggahan (bukti kas dan syarat surat), surat dan laporan dalam format PDF/XLSX |
| Mesin/Peralatan | Laptop dan ponsel pribadi pengurus, spreadsheet terpisah, lemari arsip | Aplikasi web pada server dengan basis data terpusat, diakses melalui peramban ponsel dan laptop |
| Informasi | Data kependudukan tersebar per RT; saldo kas lambat direkap; status iuran dan surat tidak terpantau; pengumuman tenggelam di ruang obrolan | Satu sumber data kependudukan; saldo kas dan status tagihan diperbarui otomatis; status surat dapat dipantau; arsip pengumuman dan notifikasi; jejak audit |
| Energi | Tenaga dan waktu pengurus untuk kunjungan dan rekap manual; listrik perangkat pribadi | Listrik perangkat pengguna dan server; waktu pengurus untuk rekap berkurang karena saldo dan laporan dihasilkan otomatis |

# BAB IV HASIL PERANCANGAN

<!-- Struktur mengikuti docs/laporan/bab4-plan.md dan keputusan K-09. Blok bertanda "dipindah dari Bab III" berasal dari §3.3 versi docx sebelumnya dan perlu dirapikan ke format Bab IV. -->

## 4.1 Proses Perancangan

### 4.1.1 Analisis Kebutuhan

<!-- Butir a) aktor, b) BPMN as-is, c) hasil elisitasi, d) FR, f) MoSCoW: belum ditulis (lihat bab4-plan.md §4). -->

#### e) Kebutuhan Non-Fungsional

<!-- Dipindah dari Bab III §3.3.3 (versi docx). Rencana: digabung menjadi satu tabel NFR (ID, kategori, deskripsi, target, prioritas) dan ditautkan ke kode SP-xx pada Tabel 3.3. -->

**Tabel 4.x Kebutuhan Non-Fungsional Keamanan**

| ID | Deskripsi Kebutuhan Non-Fungsional | Prioritas |
| --- | --- | --- |
| NFRS-01 | Kata sandi pengguna harus disimpan dalam bentuk hash dengan fungsi turunan kunci yang diterapkan Better Auth (scrypt), tidak boleh tersimpan sebagai teks asli. | Must |
| NFRS-02 | Seluruh lalu lintas antara klien dan server pada lingkungan produksi harus memakai HTTPS (TLS 1.2 atau lebih baru). | Must |
| NFRS-03 | Seluruh masukan formulir harus divalidasi di sisi server dengan skema Zod (tipe, panjang, format, dan nilai yang diizinkan). Masukan yang tidak valid ditolak dengan pesan galat dalam Bahasa Indonesia. | Must |
| NFRS-04 | NIK dan No. KK harus divalidasi sebagai 16 digit angka. | Must |
| NFRS-05 | Kueri basis data harus berparameter melalui Drizzle ORM. Tidak diperbolehkan menyusun kueri dengan penggabungan string dari masukan pengguna. | Must |
| NFRS-06 | Kredensial dan rahasia (token basis data, rahasia autentikasi) harus disimpan di variabel lingkungan (.env) dan tidak boleh masuk ke repositori. | Must |
| NFRS-07 | Sistem harus melindungi pengiriman formulir dari CSRF dan menjaga cookie sesi dengan atribut HttpOnly, Secure (produksi), dan SameSite. | Must |
| NFRS-08 | Data pribadi nyata tidak boleh dimasukkan ke data uji. Data uji memakai penanda seperti "Contoh Warga 1". | Must |
| NFRS-09 | Sistem harus membatasi percobaan masuk yang gagal secara berulang (rate limiting). | Should |
| NFRS-10 | Setiap transaksi kas dan pembayaran iuran harus mencatat pengguna pencatat dan waktu pencatatan sebagai jejak audit. | Should |
| NFRS-11 | Basis data dicadangkan secara berkala. | Should |
| NFRS-12 | Enkripsi level field untuk NIK dan No. KK di basis data. | Could |

**Tabel 4.x Kebutuhan Non-Fungsional Akses dan Sesi**

| ID | Deskripsi Kebutuhan Non-Fungsional | Prioritas |
| --- | --- | --- |
| NFRA-01 | Sistem menerapkan RBAC dengan empat peran: admin_rw, pengurus_rt, bendahara, warga. Matriks izin didefinisikan di satu tempat (permissions.ts). | Must |
| NFRA-02 | Pemeriksaan akses dilakukan di sisi server pada seluruh permintaan (hooks.server.ts) dan diperiksa ulang di layout grup rute (*defence in depth*). | Must |
| NFRA-03 | Izin ditegakkan per aksi (create/read/update/delete) sesuai matriks, tidak hanya per grup rute. Contohnya, bendahara hanya membaca data warga dan pengurus_rt tidak dapat menghapus pengumuman. | Must |
| NFRA-04 | Peran yang tidak dikenal atau tidak valid tidak diberi akses (*fail-closed*). | Must |
| NFRA-05 | Pengguna ber-peran warga yang membuka rute staf diarahkan ke portal warga (/portal) tanpa menampilkan galat 403. Peran staf yang tidak berhak atas suatu rute menerima 403. Otorisasi tetap ditegakkan di server. | Must |
| NFRA-06 | Pengguna tanpa sesi yang mengakses rute terlindungi diarahkan ke halaman masuk. | Must |
| NFRA-07 | Pengguna warga hanya dapat melihat data iuran dan pembayaran miliknya sendiri, bukan data warga lain. | Must |
| NFRA-08 | Pembuatan akun dan penetapan peran hanya dilakukan oleh admin_rw. Peran bawaan akun baru adalah warga (*least privilege*). | Must |
| NFRA-09 | Sesi pengguna berakhir otomatis setelah periode tidak aktif yang ditetapkan (60 menit). | Should |
| NFRA-10 | NIK dan No. KK disamarkan pada tampilan daftar. Nilai utuh hanya ditampilkan pada halaman detail untuk peran yang berwenang (admin_rw dan pengurus_rt wilayahnya). Contoh: 3275••••••••0001. | Should |

### 4.1.2 Perancangan Sistem

<!-- Butir a) BPMN to-be, b) ArchiMate, c) use case, d) use case description, f) class, g) ERD, h) sequence: belum ditulis. -->

#### e) Activity Diagram

<!-- Dipindah dari Bab III §3.3.2 C (versi docx). Rencana: digambar ulang sebagai UML activity diagram dengan swimlane per aktor. -->

**1. Alur Pengajuan dan Persetujuan Surat**

<!-- [Gambar 4.x — tempel di Word] -->

**Gambar 4.x** Alur Pengajuan dan Persetujuan Surat

Warga melakukan login, memilih jenis surat, mengisi formulir dan mengunggah persyaratan, lalu mengirim pengajuan. Sistem menyimpan pengajuan tersebut dan meneruskannya kepada pengurus.

Pengurus menerima pengajuan, membuka detailnya, memeriksa data dan persyaratan, lalu melakukan verifikasi. Jika disetujui, sistem memperbarui status menjadi disetujui dan proses dilanjutkan sesuai alur administrasi surat, sehingga warga dapat memantau status dan mengunduh surat. Jika ditolak, sistem memperbarui status dan memberi notifikasi kepada warga, yang kemudian dapat memperbaiki pengajuan dan mengajukannya kembali.

**2. Alur Pembayaran Iuran melalui QRIS**

<!-- [Gambar 4.x — tempel di Word] -->

**Gambar 4.x** Alur Pembayaran Iuran melalui QRIS

Warga memilih tagihan iuran, melihat nominal tagihan beserta kode QRIS, lalu melakukan pembayaran melalui aplikasi pembayaran. Sistem memperbarui status pembayaran dan memeriksa apakah pembayaran telah terverifikasi. Apabila terverifikasi, status tagihan menjadi "Lunas". Apabila belum terverifikasi, tagihan tetap berstatus belum lunas dan warga dapat membayar ulang, sehingga proses kembali ke langkah pembayaran melalui aplikasi.

**3. Alur Pengelolaan Data Warga**

<!-- [Gambar 4.x — tempel di Word] -->

**Gambar 4.x** Alur Pengelolaan Data Warga

Pengurus membuka menu data warga, kemudian memilih untuk menambahkan data baru atau memilih data yang akan diubah. Pengurus mengisi atau memperbarui data, lalu menyimpannya. Sistem melakukan validasi terhadap data tersebut. Apabila data valid, data tersimpan pada database. Apabila data tidak valid, pengurus kembali memperbaiki isian data sebelum menyimpan ulang.

**4. Alur Pengelolaan Keuangan Kas RW**

<!-- [Gambar 4.x — tempel di Word] -->

**Gambar 4.x** Alur Pengelolaan Keuangan Kas RW

Proses dimulai ketika Bendahara mengakses dan membuka menu kas RW pada sistem. Bendahara kemudian memilih jenis transaksi yang akan dicatat, baik itu pemasukan maupun pengeluaran, lalu mengisi detail informasi transaksi tersebut.

Setelah data dimasukkan, sistem secara otomatis melakukan validasi terhadap data transaksi yang diinputkan. Jika data transaksi dinilai tidak valid (misalnya terdapat kesalahan input atau format tidak sesuai), sistem akan mengembalikan alur ke tahap pengisian transaksi agar Bendahara dapat memperbaiki isian data tersebut.

Sebaliknya, jika data dinyatakan valid, sistem akan langsung menyimpan catatan transaksi tersebut ke dalam database, menghitung ulang akumulasi total saldo kas RW, dan merekam aktivitas pencatatan ke dalam audit trail. Setelah seluruh proses pencatatan selesai dilakukan oleh sistem, Bendahara dapat melihat pembaruan saldo beserta laporan kas RW terbaru.

#### i) Perancangan Antarmuka (UI/UX)

<!-- Dipindah dari Bab III §3.3.2 A–B (versi docx). Rencana: dilengkapi design token, wireframe, dan mockup dari docs/design-preview/. -->

**Platform dan Responsivitas.** Sistem dibuat berbasis web dan dirancang agar dapat digunakan pada berbagai ukuran layar, baik komputer, laptop, maupun smartphone. Penggunaan melalui smartphone lebih ditujukan untuk warga, sedangkan komputer atau laptop digunakan oleh pengurus dalam mengelola data dan proses administrasi. Susunan dan ukuran komponen menyesuaikan dengan perangkat yang digunakan.

**Design System, Palet Warna, dan Tipografi.** Untuk menjaga tampilan tetap konsisten, sistem menggunakan design system sederhana yang mencakup warna, jenis huruf, ukuran teks, tombol, dan komponen lainnya. Warna utama digunakan pada bagian yang membutuhkan perhatian pengguna, seperti tombol utama dan navigasi. Warna pendukung digunakan untuk membedakan informasi atau status tertentu. Tipografi menggunakan font Inter agar teks jelas dan nyaman dibaca.

**Komponen Antarmuka.** Komponen yang digunakan antara lain card, tabel, formulir, tombol, modal, dropdown, badge, dan notifikasi. Card menampilkan informasi tertentu secara terpisah; tabel menampilkan data yang banyak, seperti data warga dan data iuran; formulir digunakan untuk memasukkan data dan mengajukan surat; modal memberikan konfirmasi sebelum tindakan tertentu; badge dan notifikasi memberikan informasi mengenai status atau perubahan data.

**Navigasi dan Hierarki Informasi.** Fitur utama seperti Dashboard, Data Warga, Pengajuan Surat, dan Iuran ditempatkan pada navigasi yang mudah ditemukan. Informasi penting ditampilkan dengan jelas, misalnya status pengajuan surat ditampilkan pada halaman yang mudah diakses sehingga warga dapat mengetahui perkembangan pengajuannya tanpa membuka banyak halaman.

**Umpan Balik Interaksi.** Sistem memberikan informasi setelah pengguna melakukan suatu tindakan, berupa notifikasi berhasil atau gagal, indikator proses, maupun perubahan status. Misalnya, setelah warga mengirim pengajuan surat, sistem menampilkan bahwa pengajuan berhasil dikirim, dan warga dapat melihat status seperti "Diproses", "Disetujui", atau "Ditolak".

**Pencegahan Kesalahan.** Setiap formulir divalidasi sesuai jenis data yang dimasukkan, misalnya NIK harus 16 digit, nominal iuran hanya berupa angka, dan berkas unggahan harus sesuai ketentuan. Sistem juga meminta konfirmasi sebelum tindakan tertentu, seperti menghapus data atau menyetujui pengajuan.

#### j) Arsitektur Perangkat Lunak dan Kontrol Akses

<!-- Dipindah dari Bab III §3.3.3 c (versi docx). Rencana: dicocokkan ulang dengan matriks final di kode sebelum ditempel; baris Surat dan RT & RW pada versi lama memuat duplikasi "R, R". -->

**Tabel 4.x Matriks Hak Akses Peran Sistem (RBAC)**

| Modul / Sumber Daya | admin_rw | pengurus_rt | bendahara | warga |
| --- | --- | --- | --- | --- |
| Warga & KK | C, R, U, D | C, R, U, R* | R | N/A |
| RT & RW | R, U | R | R | N/A |
| Pengumuman | C, R, U, D | R | R | R |
| Iuran | C, R, U, D | R | C, R, U, D | R* |
| Kas | C, R, U, D | R | C, R, U, D | N/A |
| Pengurus | C, R, U, D | R | R | N/A |
| Surat | C, R, U, D | C, R, U* | R | C, R* |

Keterangan: C = Create, R = Read, U = Update, D = Delete, N/A = No Access. R* / C* / U* = akses terbatas pada wilayah RT bersangkutan atau data milik pengguna sendiri.

### 4.1.3 Pelaksanaan Pengembangan Inkremental

<!-- Belum ditulis (lihat bab4-plan.md §4, keputusan K-04, K-06). -->

### 4.1.4 Verifikasi Kode

<!-- Belum ditulis (keputusan K-07). -->

### 4.1.5 Penggabungan Fitur dan Metrik Aliran

<!-- Belum ditulis. -->

### 4.1.6 Validasi Akhir

<!-- Belum ditulis (keputusan K-08). -->

## 4.2 Hasil Rancangan

<!-- Belum ditulis. -->

## 4.3 Verifikasi Hasil Rancangan

<!-- Belum ditulis. -->

# BAB V ANALISIS BIAYA & KELAYAKAN PERANCANGAN

## 5.1 Identifikasi Biaya Terkait Rancangan

<!-- Belum ditulis. -->

## 5.2 Analisis Kelayakan Perancangan

<!-- Belum ditulis. -->

## 5.3 Rencana Implementasi Hasil Rancangan

<!-- Belum ditulis. -->

# BAB VI EVALUASI DAN VALIDASI HASIL RANCANGAN

## 6.1 Validasi Hasil Rancangan

<!-- Belum ditulis. -->

# BAB VII KESIMPULAN DAN SARAN

## 7.1 Kesimpulan

<!-- Belum ditulis. -->

## 7.2 Saran

<!-- Belum ditulis. -->

# DAFTAR PUSTAKA

Anderson, D. J. (2010). *Kanban: Successful evolutionary change for your technology business*. Blue Hole Press.

Booch, G., Rumbaugh, J., & Jacobson, I. (2005). *The unified modeling language user guide* (2nd ed.). Addison-Wesley Professional.

Brooke, J. (1996). SUS: A "quick and dirty" usability scale. In P. W. Jordan, B. Thomas, B. A. Weerdmeester, & A. L. McClelland (Eds.), *Usability evaluation in industry* (pp. 189–194). Taylor & Francis. https://doi.org/10.1201/9781498710411-35

Chen, P. P.-S. (1976). The entity-relationship model—Toward a unified view of data. *ACM Transactions on Database Systems, 1*(1), 9–36. https://doi.org/10.1145/320434.320440

Clegg, B., & Barker, R. (1994). *Case method fast-track: A RAD approach*. Addison-Wesley.

Dennis, A., Wixom, B. H., & Tegarden, D. (2020). *Systems analysis and design: An object-oriented approach with UML* (6th ed.). Wiley.

GitHub. (n.d.). About projects. GitHub Docs. Retrieved October 5, 2026, from https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects

Ilie, G., & Ciocoiu, C. N. (2010). Application of fishbone diagram to determine the risk of an event with multiple causes. *Management Research and Practice, 2*(1), 65–80.

Larman, C., & Basili, V. R. (2003). *Iterative and incremental development: A brief history*. Computer, 36(6), 47–56. https://doi.org/10.1109/MC.2003.1204375

Object Management Group. (2014). *Business Process Model and Notation (BPMN) version 2.0.2*. https://www.omg.org/spec/BPMN/2.0.2/

Permatasari, A., Aknuranda, I., & Setiawan, B. D. (2025). Root cause analysis of government readiness in realizing the concept of e-government system: A case study of Palu City Government. *Journal of Information Technology and Computer Science, 10*(3), 112–124. https://doi.org/10.25126/jitecs.2025103789

Pressman, R. S., & Maxim, B. R. (2020). *Software engineering: A practitioner’s approach* (9th ed.). McGraw-Hill Education.

