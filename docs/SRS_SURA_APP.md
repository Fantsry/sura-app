# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
# SISTEM PELAPORAN KEJADIAN SURA

---

## BAB I PENDAHULUAN

### A. Latar Belakang Proyek
Dalam kehidupan bermasyarakat, penyampaian informasi terkait kejadian darurat, kerusakan infrastruktur, masalah keamanan, maupun keluhan lingkungan sangat penting untuk segera ditangani demi kenyamanan dan ketertiban bersama. Namun, seringkali masyarakat kebingungan mengenai saluran pelaporan yang tepat, atau laporan yang disampaikan secara konvensional lambat ditindaklanjuti karena kurangnya sistem pendokumentasian dan pemantauan yang baik.

Di sisi lain, masyarakat saat ini kerap memanfaatkan media sosial untuk memviralkan suatu kejadian. Meskipun penyebarannya cepat, penggunaan media sosial umum untuk pelaporan memiliki berbagai kekurangan: informasi tidak terstruktur, sulit diverifikasi oleh pihak berwenang, tidak ada pengelompokan kategori kejadian, dan penentuan lokasi kejadian yang seringkali tidak akurat. Hal ini menyulitkan proses penanganan yang sistematis dan tepat sasaran.

Berangkat dari permasalahan tersebut, dikembangkanlah "SURA", sebuah platform Sistem Pelaporan Kejadian berbasis digital dan komunitas. SURA dirancang dengan menggabungkan kemudahan pelaporan yang dilengkapi penentuan titik koordinat lokasi (GPS), lampiran foto bukti, serta sistem pelacakan status laporan secara *real-time*. Platform ini juga didesain interaktif dengan fitur peta (map), forum komunitas, dan berita resmi untuk meningkatkan partisipasi aktif masyarakat, sekaligus memberikan wadah yang terstruktur dan transparan bagi admin/pengelola dalam memverifikasi dan menindaklanjuti setiap kejadian.

### B. Tujuan Proyek
Tujuan utama dari pengembangan platform SURA adalah menyediakan solusi digital yang modern dan terintegrasi untuk memudahkan masyarakat dalam melaporkan berbagai kejadian, serta membantu pihak pengelola/admin dalam memantau dan menindaklanjuti laporan tersebut secara responsif dan akuntabel.

Secara lebih rinci, tujuan dari proyek ini adalah sebagai berikut:
1. **Mempermudah Akses Pelaporan**: Memfasilitasi masyarakat untuk melaporkan kejadian secara digital yang dapat diakses kapan saja dan di mana saja melalui multi-platform (web dan aplikasi mobile).
2. **Dokumentasi Terstruktur dan Akurat**: Menyediakan sistem pelaporan dengan kelengkapan bukti visual (multipel foto) dan akurasi geolokasi (GPS) untuk mempermudah proses pencarian dan verifikasi lapangan.
3. **Meningkatkan Interaksi dan Partisipasi**: Menampilkan laporan melalui visualisasi peta interaktif dan *feed* laporan sehingga masyarakat dapat mengetahui kejadian di sekitarnya, serta berpartisipasi melalui interaksi komentar dan *like*.
4. **Transparansi Status Laporan**: Memberikan keterbukaan proses penanganan melalui status pelaporan (Pending, Verified, In Progress, Resolved) yang dapat dipantau pengguna beserta notifikasi perubahannya.
5. **Sentralisasi Informasi dan Diskusi**: Menghadirkan portal forum dan berita untuk mewadahi diskusi masyarakat serta pengumuman resmi agar informasi terpusat.
6. **Efisiensi Manajemen bagi Pengelola**: Membantu admin dengan *dashboard* terpusat guna mengelola, memverifikasi laporan, mengontrol statistik, serta menindaklanjuti pengaduan dengan lebih cepat dan efisien.
7. **Digitalisasi Pelayanan**: Mendorong penerapan sistem *data-driven* dalam pelayanan pengaduan dan pelaporan kejadian sebagai langkah nyata menuju modernisasi infrastruktur pelayanan masyarakat.

---

## BAB II PEMBAHASAN

### A. Ruang Lingkup Sistem
Ruang lingkup dari sistem yang dikembangkan ini berfokus pada proses penyampaian dan pengelolaan pelaporan kejadian di masyarakat secara digital dan berbasis komunitas. Sistem ini bertujuan untuk memudahkan masyarakat dalam menyampaikan laporan keadaan darurat, keluhan infrastruktur, masalah keamanan, maupun kejadian penting lainnya kepada pihak terkait tanpa harus menghadapi proses birokrasi yang berbelit atau datang langsung ke instansi. Selain itu, sistem ini dirancang untuk membantu petugas atau admin dalam menerima, memantau, mengelola, dan menindaklanjuti setiap laporan kejadian secara terpusat, lebih efektif, dan terorganisir.

Sistem dikembangkan dengan arsitektur modern dalam tiga platform utama, yaitu *Backend API* (berbasis Bun dan PostgreSQL), aplikasi berbasis *Web* (React & Vite), dan aplikasi *Mobile* (React Native). Aplikasi *web* dirancang secara responsif sehingga dapat diakses dengan optimal melalui komputer desktop maupun peramban *mobile*, sedangkan aplikasi *mobile* dikembangkan secara spesifik untuk perangkat *smartphone* agar memberikan kemudahan akses geolokasi bagi masyarakat di lapangan. Pengguna dapat masuk ke sistem sesuai hak dan perannya masing-masing, yaitu masyarakat umum sebagai pelapor (User) dan admin atau moderator sebagai pengelola. Masyarakat dapat membuat laporan kejadian, melampirkan bukti pendukung yang akurat, menentukan titik lokasi melalui peta interaktif, serta berpartisipasi dalam forum. Sementara itu, admin memiliki wewenang untuk mengelola data, memberikan tanggapan, mengubah status laporan, serta mengelola portal berita.

1) **Fitur Utama:**
1. **Autentikasi Pengguna:** Proses registrasi, login, dan manajemen profil yang terenkripsi untuk membedakan antara masyarakat umum dan admin/moderator.
2. **Pelaporan Kejadian Berbasis GPS:** Masyarakat dapat membuat laporan dengan mengisi detail kejadian, memilih kategori, menentukan titik lokasi yang terintegrasi dengan peta, dan melampirkan beberapa bukti foto.
3. **Peta Interaktif (Geolokasi):** Menampilkan sebaran laporan dalam bentuk visualisasi peta (*map markers*) sehingga masyarakat dapat memantau kejadian di sekitarnya.
4. **Interaksi dan Forum Komunitas:** Masyarakat dapat saling berinteraksi melalui fitur komentar dan *like* pada laporan, serta berdiskusi aktif melalui modul forum komunitas yang tersedia.
5. **Portal Berita Resmi:** Wadah sentral bagi pihak admin untuk menyampaikan pengumuman, berita, maupun informasi penting kepada seluruh pengguna.
6. **Verifikasi dan Manajemen Status:** Admin dapat memverifikasi laporan yang masuk, memberikan tanggapan, serta menindaklanjuti kejadian dengan mengubah status pelaporan (Pending, Verified, In Progress, Resolved).
7. **Dashboard Statistik Admin:** Panel manajemen terpusat bagi admin untuk mengontrol jumlah laporan, melihat tren statistik kejadian, dan melakukan rekapitulasi data secara menyeluruh.

2) **Manfaat Sistem:**
1. Memudahkan masyarakat dalam menyampaikan laporan kejadian dengan cepat, akurat, dan tanpa batasan waktu (akses 24/7).
2. Mengurangi risiko informasi yang tidak jelas karena setiap laporan didukung dengan dokumentasi foto multipel dan koordinat GPS.
3. Meningkatkan transparansi proses penanganan melalui pemantauan alur status laporan yang dapat dilihat langsung oleh masyarakat.
4. Memfasilitasi terbangunnya komunikasi yang baik antarwarga melalui forum komunitas dan fitur komentar.
5. Mempermudah admin dalam mengelola, memverifikasi, dan menindaklanjuti laporan masyarakat dengan bantuan panel dashboard.

### B. Metodologi Pengembangan Perangkat Lunak
Metodologi Agile digunakan sebagai pendekatan utama dalam pengembangan aplikasi SURA. Metode ini dipilih karena mampu memberikan fleksibilitas yang sangat tinggi terhadap perubahan kebutuhan di tengah proses pengerjaan, mempercepat siklus peluncuran fitur, serta memastikan sistem yang dibangun tetap selaras dengan harapan dan kebutuhan pengguna. Karakteristik pelayanan publik dan pelaporan masyarakat yang sangat dinamis menjadikan Agile sebagai metodologi paling relevan untuk diterapkan pada proyek ini.

Agile bekerja dengan pendekatan iteratif yang membagi proses pengembangan ke dalam beberapa siklus kerja atau *sprint* berdurasi dua minggu. Setiap *sprint* mencakup proses perencanaan, perancangan desain, penulisan kode, pengujian, hingga evaluasi akhir. Melalui pola iteratif ini, setiap modul seperti sistem autentikasi, peta interaktif, maupun forum dapat dikembangkan secara terfokus, diuji keandalannya, dan disempurnakan berdasarkan umpan balik (*feedback*) sebelum melangkah ke tahap berikutnya.

Berikut merupakan tahapan utama dalam metodologi Agile yang diterapkan:
1. **Plan (Perencanaan)**
Tahap ini difokuskan pada identifikasi kebutuhan mendasar dari sistem, penentuan tujuan pengembangan, serta prioritisasi fitur menggunakan teknik analisis kebutuhan. Informasi diperoleh dari hasil pengamatan terhadap celah dalam proses pelaporan kejadian konvensional maupun penggunaan media sosial umum. Dari analisis ini, ditentukanlah fitur-fitur krusial seperti peta interaktif, manajemen status, dan forum komunitas yang disusun ke dalam daftar prioritas (*product backlog*).
2. **Design (Perancangan)**
Tahap desain bertujuan untuk merancang arsitektur perangkat lunak, struktur *database*, dan desain antarmuka (*UI/UX*). Desain antarmuka dirancang mengikuti prinsip *Material Design 3* dengan pendekatan *mobile-first* agar mudah dipahami oleh masyarakat luas. Struktur basis data dirancang secara matang menggunakan *Entity Relationship Diagram (ERD)* dengan tabel-tabel utama (seperti *users*, *reports*, *forum_posts*, dll), sementara alur sistem digambarkan menggunakan *Use Case* dan *Activity Diagram*.
3. **Develop (Pengembangan)**
Ini merupakan fase eksekusi atau implementasi kode pemrograman. Sistem dikembangkan menggunakan konsep *Monorepo*, memadukan teknologi *Bun* dan *Hono.js* untuk sisi *backend*, *React 19* dan *TailwindCSS* untuk sisi *web*, serta *React Native* untuk aplikasi seluler. Tim pengembang membangun fitur secara bertahap mulai dari fondasi autentikasi (*JWT*), *endpoint API*, integrasi peta (*Leaflet/React Native Maps*), hingga fitur interaksi seperti komentar dan berita.
4. **Testing (Pengujian)**
Untuk memastikan reliabilitas dan stabilitas, pengujian dilakukan pada akhir setiap *sprint*. Pengujian ini mencakup pengujian unit (pada *schema validasi Zod*), pengujian fungsional untuk memastikan alur pendaftaran dan pembuatan laporan berjalan lancar, serta pengujian antarmuka di berbagai peramban (Chrome, Firefox) dan ukuran layar gawai.
5. **Deploy (Penyebaran)**
Sistem yang telah lulus pengujian akan ditempatkan ke lingkungan server (VPS) maupun layanan *cloud* agar dapat diakses. Sisi basis data PostgreSQL dikonfigurasi secara optimal, sementara aplikasi klien (*frontend*) diarahkan menggunakan sistem *Continuous Deployment* agar setiap pembaruan langsung terdistribusi kepada pengguna.
6. **Review (Evaluasi)**
Setelah selesai di-*deploy* dalam fase iterasi, dilakukan evaluasi kolaboratif. Tujuannya adalah untuk menilai kinerja sistem, memeriksa apakah ada *bug* atau celah kemanan, serta memastikan *User Experience* sudah sesuai dengan target. Masukan dari proses ini menjadi landasan untuk *sprint* berikutnya.
7. **Launch (Peluncuran)**
Tahap final adalah peluncuran versi awal (*MVP/Beta Launch*) kepada lingkup pengguna terbatas guna memvalidasi penggunaan di dunia nyata. Setelah sistem dirasa tangguh, aplikasi diluncurkan secara penuh (*Official Launch*). Sistem selanjutnya akan terus dipelihara dan dikembangkan menyesuaikan dengan pertumbuhan pengguna.

### C. Metode Pengumpulan Data
Untuk memastikan sistem SURA dibangun dengan landasan kebutuhan yang solid dan aplikatif di lapangan, dilakukan proses pengumpulan data melalui observasi lapangan dan analisis komparatif. Metode ini sangat penting untuk memahami kendala-kendala riil yang dihadapi masyarakat dalam melaporkan kejadian.

1. **Observasi**
Observasi dilakukan dengan mengamati secara langsung kebiasaan masyarakat dalam menyampaikan keluhan atau informasi kejadian. Dari pengamatan tersebut, ditemukan sejumlah permasalahan mendasar: laporan konvensional ke kantor instansi sangat memakan waktu dan terbatas jam operasional; sementara itu, pelaporan melalui media sosial pribadi seringkali tidak terstruktur, tidak terkelompok dalam kategori yang jelas, dan yang paling krusial, informasi titik lokasi kejadian acap kali meleset atau tidak disertakan sama sekali. Permasalahan lainnya adalah minimnya transparansi—masyarakat tidak tahu apakah keluhannya sekadar dibaca, sedang ditindaklanjuti, atau sudah selesai.
2. **Analisis Sistem Sejenis**
Selain pengamatan langsung, dilakukan pula studi banding terhadap beberapa aplikasi pelaporan publik yang sudah ada. Dari analisis tersebut, disimpulkan bahwa SURA harus memberikan nilai tambah yang kuat, yaitu dengan menambahkan modul Forum Komunitas dan Portal Berita, agar platform tidak hanya terasa seperti aplikasi pelaporan yang kaku, melainkan menjadi wadah sosialisasi digital (*community hub*) yang hidup dan interaktif.

### D. Kebutuhan Sistem
Kebutuhan sistem mencakup serangkaian fungsionalitas dan karakteristik non-fungsional yang harus dipenuhi agar aplikasi SURA mampu menjawab permasalahan pelaporan masyarakat dengan stabil dan andal.

1. **Kebutuhan Fungsional**
Fitur-fitur utama yang secara langsung akan berinteraksi dengan masyarakat dan admin:
a. **Autentikasi Pengguna**
Sistem menyediakan mekanisme registrasi dan login yang aman (terenkripsi). Login wajib dilakukan untuk memastikan hanya pengguna tervalidasi yang dapat membuat laporan atau berkomentar, sehingga mengurangi risiko laporan palsu (*spam*).
b. **Dashboard dan Manajemen Profil**
Setelah masuk, pengguna disajikan halaman utama dan profil. Mereka dapat melihat poin kontribusi, status verifikasi akun, mengganti kata sandi, dan melihat akumulasi jumlah laporan yang pernah mereka kirimkan.
c. **Pengajuan Laporan Kejadian**
Masyarakat dapat membuat laporan baru dengan menginput formulir yang mencakup:
1) Judul dan deskripsi kejadian.
2) Kategori laporan (contoh: Infrastruktur, Keamanan, Lingkungan).
3) Lokasi kejadian presisi berbasis integrasi Peta/GPS.
4) Unggahan media pendukung (bisa menampung beberapa foto sekaligus).
d. **Pemantauan Status Laporan**
Sistem memiliki alur status laporan yang transparan. Pengguna dapat melacak secara langsung apakah laporannya berstatus Menunggu Verifikasi (Pending), Telah Diverifikasi (Verified), Sedang Ditindaklanjuti (In Progress), atau Telah Selesai (Resolved).
e. **Peta Interaktif**
Sistem menyediakan antarmuka peta digital yang menyebarkan titik-titik (*markers*) kejadian berdasarkan kordinat laporan. Pengguna dapat menggunakan peta ini untuk mengetahui daerah mana yang sedang mengalami insiden.
f. **Interaksi dan Forum Komunitas**
Sistem mewadahi ruang interaksi publik. Pada halaman detail laporan, masyarakat bisa menekan tombol *like* dan memberikan komentar. Di samping itu, tersedia ruang khusus berupa Forum Komunitas di mana masyarakat bebas memulai diskusi (*thread*) di luar pelaporan resmi.
g. **Portal Berita**
Menyediakan fitur di mana admin dapat mempublikasikan artikel berita atau pengumuman resmi agar pengguna selalu mendapatkan informasi terpusat yang tepercaya.
h. **Fitur Khusus Admin/Moderator**
Admin memiliki wewenang khusus untuk:
1) Mengakses halaman *dashboard* statistik secara penuh.
2) Melakukan verifikasi (menerima/menolak) setiap laporan yang masuk.
3) Memberikan balasan/tanggapan resmi pada laporan masyarakat.
4) Mengubah dan memperbarui progres status pelaporan.
5) Menulis berita, mengelola kategori forum, serta melakukan moderasi terhadap pengguna (blokir/aktivasi).

2. **Kebutuhan Non-Fungsional**
Menggambarkan standar kualitas teknis yang harus dipenuhi oleh platform.
a. **Kinerja (Performance)**
Sistem dirancang untuk memberikan respons yang sangat cepat. Komunikasi API ke basis data PostgreSQL (dioptimalkan dengan sistem ORM) ditargetkan merespons di bawah 500 milidetik agar transisi halaman di web dan aplikasi *mobile* terasa mulus.
b. **Keamanan (Security)**
Sistem melindungi data privasi pengguna melalui implementasi *hashing* kata sandi menggunakan `bcrypt`. Autentikasi lintas platform menggunakan mekanisme *JSON Web Token (JWT)* yang kokoh, disertai pembatasan *Role-Based Access Control (RBAC)* yang ketat antara hak *User* biasa dan *Admin*.
c. **Kemudahan Penggunaan (Usability)**
Antarmuka pengguna (UI) dirancang dengan mengadopsi prinsip *Material Design 3* yang bersih, modern, dan dilengkapi mode gelap (*dark mode*). Antarmuka *web* dikonfigurasi bersifat responsif (*mobile-first*) sehingga masyarakat awam sekalipun dapat menggunakan aplikasi tanpa panduan khusus.
d. **Reliabilitas (Reliability)**
Arsitektur basis data relasional dikonfigurasikan agar tahan terhadap anomali data, memastikan setiap laporan, koordinat, maupun unggahan gambar terkait tersimpan tanpa korupsi.
e. **Kompatibilitas (Compatibility)**
Versi aplikasi web harus mendukung ragam peramban modern (Chrome, Edge, Safari, Firefox), sedangkan untuk sisi pengguna gawai cerdas didukung melalui aplikasi terdedikasi bersistem operasi Android maupun iOS.
f. **Maintainability (Pemeliharaan)**
Basis kode mengimplementasikan bahasa pemrograman *TypeScript* dengan pengetikan statis (*static typing*) dan struktur *monorepo* yang terpisah antara *backend*, *web*, dan *mobile* untuk kemudahan *debugging*, skalabilitas, dan penambahan modul baru di masa mendatang.

### E. Batasan Sistem
Demi memastikan keterarahan fokus pengembangan, terdapat beberapa batasan teknis dan operasional pada iterasi aplikasi SURA saat ini:

1. **Batasan Teknologi**
a. Aplikasi mewajibkan penggunanya terhubung ke internet secara aktif; saat ini sistem belum dirancang untuk menampung pelaporan secara luring (*offline mode*).
b. Ukuran maksimal foto dan jumlah lampiran pada satu laporan dibatasi (misal: maksimum 5 foto berukuran hingga 5MB per berkas) guna menjaga beban kapasitas server.
c. Akurasi penentuan titik kordinat saat pelaporan sangat bergantung pada kualitas perangkat keras (*hardware* GPS) dan sinyal gawai pintar pengguna.
2. **Batasan Platform**
a. Fitur moderasi tingkat lanjut dan pengelolaan *dashboard* statistik secara ekstensif difokuskan pada peramban web (*desktop*), mengingat kebutuhan ruang kerja layar besar bagi admin.
b. Sistem notifikasi difokuskan pada *in-app notifications* (di dalam aplikasi) dan saat ini belum mendukung integrasi notifikasi pesan singkat eksternal (SMS/WhatsApp).
3. **Batasan Operasional dan Fungsional**
a. Aplikasi secara murni berperan sebagai alat perekam, penyampai, dan pemantau laporan. SURA tidak mencakup atau menggantikan tindakan penyelesaian fisik (*field resolution*) di lapangan.
b. Proses verifikasi dan penyaringan laporan bersifat manual yang diproses oleh kecakapan Admin (belum ada pendeteksian laporan ganda berbasis *Artificial Intelligence*).
c. Seluruh informasi yang diberikan dan kebenaran peristiwa yang dilaporkan berada di bawah pertanggungjawaban masing-masing akun pelapor.

---

## Kesimpulan

Sistem Pelaporan Kejadian Sura merupakan solusi digital modern untuk memfasilitasi pelaporan kejadian masyarakat dengan fitur GPS, foto, tracking real-time, dan community engagement. Dibangun dengan teknologi terkini (Bun, Hono.js, React 19, React Native) dan metodologi Agile, sistem ini menyediakan platform yang efisien, transparan, dan user-friendly untuk meningkatkan kualitas pelayanan publik.

**Status Proyek:** MVP Ready untuk deployment dan testing  
**Versi:** 1.0.0  
**Platform:** Web (responsive) + Mobile (Android & iOS)

