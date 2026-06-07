# BAB II PEMBAHASAN

## A. Ruang Lingkup Sistem

Ruang lingkup dari sistem yang dikembangkan ini berfokus pada proses penyampaian dan pengelolaan pelaporan kejadian masyarakat secara digital. **Sura** (Platform Pelaporan Kejadian Berbasis Komunitas) bertujuan untuk memudahkan masyarakat dalam menyampaikan laporan kejadian seperti bencana alam, pencurian, kerusakan infrastruktur, gangguan keamanan, dan keluhan lainnya kepada instansi terkait tanpa harus datang langsung ke kantor pelayanan. Selain itu, sistem ini membantu petugas atau admin dalam menerima, memantau, mengelola, dan menindaklanjuti setiap laporan kejadian secara lebih efektif dan terorganisir.

Sistem dikembangkan dalam tiga platform, yaitu:
1. **Aplikasi Backend API** - Layanan backend menggunakan Bun runtime dan Hono.js framework
2. **Aplikasi Web** - Aplikasi berbasis web responsif yang dapat diakses melalui komputer maupun perangkat mobile
3. **Aplikasi Mobile** - Aplikasi native untuk smartphone berbasis React Native dan Expo

Pengguna dapat masuk ke sistem sesuai perannya masing-masing:
- **Masyarakat/User** - Sebagai pelapor kejadian
- **Admin/Moderator** - Sebagai pengelola dan verifikator laporan
- **Super Admin** - Sebagai pengelola sistem dan administrator tertinggi

Masyarakat dapat membuat laporan kejadian dengan melampirkan bukti pendukung berupa foto, menambahkan lokasi GPS secara otomatis, memantau status laporan secara real-time, memberikan komentar dan like pada laporan, serta berpartisipasi dalam forum komunitas. Sementara itu, admin dapat mengelola data laporan, memverifikasi laporan yang masuk, memberikan tanggapan resmi, mengubah status laporan, mengelola berita dan pengumuman, serta melihat statistik dan analitik sistem.

### 1. Fitur Utama

#### a. Autentikasi dan Manajemen Pengguna
1. **Registrasi Pengguna**: Pendaftaran akun baru dengan validasi email dan username unik
2. **Login**: Login menggunakan email atau username dengan JWT Bearer Token
3. **Manajemen Profil**: Update informasi profil, foto avatar, dan nomor telepon
4. **Ganti Password**: Fitur keamanan untuk mengubah kata sandi
5. **Role-Based Access Control**: Pembatasan akses berdasarkan role (user, admin, moderator)


#### b. Pelaporan Kejadian (Reports)
1. **Pengajuan Laporan**: Masyarakat dapat membuat laporan kejadian dengan mengisi:
   - Judul laporan
   - Deskripsi detail kejadian
   - Kategori kejadian (infrastruktur, bencana, kriminalitas, dll)
   - Lokasi kejadian dengan GPS (latitude & longitude)
   - Alamat lengkap (alamat, kota, provinsi)
   - Bukti pendukung berupa foto/gambar (multiple files)
   - Video URL (opsional)
   - Opsi pelaporan anonim
   - Tingkat prioritas (low, medium, high)

2. **Status Laporan**: Sistem menampilkan status laporan secara real-time:
   - **Pending** - Menunggu verifikasi admin
   - **Verified** - Sudah diverifikasi dan valid
   - **In Progress** - Sedang dalam proses penanganan
   - **Resolved** - Selesai ditangani
   - **Rejected** - Ditolak (tidak valid)

3. **Manajemen Laporan**: 
   - Melihat daftar semua laporan pada peta interaktif
   - Filter laporan berdasarkan status dan kategori
   - Detail laporan lengkap dengan foto dan lokasi
   - Riwayat laporan pribadi untuk masing-masing pengguna
   - Edit dan hapus laporan (untuk pelapor)

4. **Interaksi Laporan**:
   - Komentar pada laporan
   - Like/support laporan
   - View counter untuk tracking popularitas
   - Komentar resmi dari petugas (official comment)


#### c. Kategori Laporan
1. Manajemen kategori laporan dengan hierarki parent-child
2. Icon dan color coding untuk setiap kategori
3. Sorting dan aktivasi/deaktivasi kategori
4. Kategori default: Infrastruktur, Bencana Alam, Keamanan, Kebersihan, dll.

#### d. Berita dan Pengumuman (News)
1. **Pembuatan Berita**: Admin dapat membuat artikel berita dengan:
   - Judul dan konten artikel
   - Excerpt (ringkasan)
   - Kategori berita
   - Cover image
   - Tags untuk categorization
   - Status publish/draft
   - Featured article flag

2. **Manajemen Berita**:
   - Daftar semua berita dengan filter
   - Edit dan hapus berita
   - Publish/unpublish artikel
   - View counter untuk statistik

3. **Portal Berita Publik**:
   - Tampilan berita untuk masyarakat
   - Filter berdasarkan kategori
   - Pencarian berita
   - Featured articles di homepage


#### e. Forum Komunitas
1. **Postingan Forum**:
   - Membuat thread diskusi baru
   - Kategori forum untuk topik tertentu
   - Tags untuk topik
   - Pin post untuk pengumuman penting
   - Lock post untuk mencegah komentar baru

2. **Komentar Forum**:
   - Nested comments (reply to comment)
   - Like pada komentar
   - Edit dan hapus komentar

3. **Manajemen Forum**:
   - View counter untuk tracking engagement
   - Moderasi konten oleh admin
   - Filter berdasarkan kategori

#### f. Notifikasi
1. Notifikasi untuk perubahan status laporan
2. Notifikasi untuk komentar baru pada laporan
3. Notifikasi untuk tanggapan resmi petugas
4. Status read/unread notification
5. Tipe notifikasi: report_status, comment, response, announcement

#### g. Upload File
1. Upload foto untuk laporan (multiple images)
2. Upload avatar untuk profil pengguna
3. Upload cover image untuk berita
4. Validasi format dan ukuran file
5. Storage pada folder uploads dengan serve static


#### h. Peta Interaktif
1. **Web Application**:
   - Menggunakan Leaflet dan React-Leaflet
   - Marker untuk setiap lokasi laporan
   - Popup dengan informasi singkat laporan
   - Filter marker berdasarkan kategori
   - Click marker untuk detail laporan

2. **Mobile Application**:
   - Menggunakan React Native Maps
   - GPS location tracking otomatis
   - Native map experience
   - Pin location untuk laporan baru

#### i. Dashboard Admin
1. **Statistik dan Analytics**:
   - Total laporan per status
   - Total pengguna terdaftar
   - Laporan per kategori
   - Trend laporan (harian, mingguan, bulanan)
   - Top reporters dan most active areas

2. **Manajemen Laporan**:
   - Verifikasi laporan pending
   - Update status laporan
   - Memberikan tanggapan resmi
   - Delete laporan spam/invalid
   - Filter dan search laporan

3. **Manajemen Pengguna**:
   - Daftar semua pengguna
   - Update role pengguna
   - Aktivasi/deaktivasi akun
   - View user activity
   - User statistics

4. **Manajemen Konten**:
   - CRUD berita dan pengumuman
   - Moderasi forum posts
   - Manajemen kategori
   - Content moderation


#### j. Statistik Publik
1. Visualisasi data laporan untuk masyarakat
2. Statistik per kategori dan wilayah
3. Trend penanganan laporan
4. Response time analytics
5. Transparansi kinerja layanan

### 2. Manfaat Sistem

1. **Kemudahan Akses**: Masyarakat dapat menyampaikan laporan kejadian kapan saja dan dari mana saja tanpa harus datang langsung ke instansi terkait

2. **Dokumentasi Digital**: Mengurangi risiko kehilangan data laporan karena seluruh informasi tersimpan dalam database dengan backup otomatis

3. **Transparansi Real-time**: Meningkatkan transparansi proses penanganan laporan melalui pemantauan status secara real-time dan notifikasi otomatis

4. **Efisiensi Pengelolaan**: Mempermudah petugas dalam mengelola, memantau, dan menindaklanjuti laporan masyarakat dengan dashboard terintegrasi

5. **Peningkatan Partisipasi**: Mendorong partisipasi aktif masyarakat melalui forum komunitas dan fitur interaksi sosial (like, comment)

6. **Data Analytics**: Menyediakan data dan statistik untuk pengambilan keputusan berbasis data dalam meningkatkan pelayanan publik

7. **Geolokasi Akurat**: Memudahkan identifikasi lokasi kejadian dengan presisi GPS untuk respons yang lebih cepat dan tepat

8. **Multi-platform**: Aksesibilitas melalui web dan mobile app untuk menjangkau berbagai segmen masyarakat

9. **Keamanan Data**: Sistem autentikasi dan otorisasi yang aman dengan JWT dan password hashing untuk melindungi data pengguna

10. **Skalabilitas**: Arsitektur modern yang mendukung pertumbuhan jumlah pengguna dan data tanpa menurunkan performa



## B. Metodologi Pengembangan Perangkat Lunak

Metodologi **Agile** digunakan sebagai pendekatan utama dalam pengembangan Sistem Pelaporan Kejadian Sura. Metode ini dipilih karena mampu memberikan fleksibilitas tinggi terhadap perubahan kebutuhan, mempercepat proses pengembangan dengan iterasi sprint, serta memastikan sistem yang dibangun tetap sesuai dengan kebutuhan pengguna. Karakteristik pelayanan masyarakat yang dinamis dan kebutuhan akan pengembangan fitur secara berkelanjutan menjadikan Agile sebagai metodologi yang tepat untuk diterapkan pada proyek ini.

Agile bekerja dengan pendekatan iteratif yang membagi proses pengembangan ke dalam beberapa siklus kerja atau **sprint**. Setiap sprint mencakup proses perencanaan, perancangan, pengembangan, pengujian, dan evaluasi. Melalui pendekatan ini, setiap fitur dapat dikembangkan secara bertahap, diuji, dan disempurnakan berdasarkan umpan balik pengguna sebelum melanjutkan ke tahap berikutnya. Dengan demikian, risiko kesalahan dapat diminimalkan dan kualitas sistem dapat terus ditingkatkan selama proses pengembangan berlangsung.

Proyek Sura menggunakan arsitektur **Monorepo** dengan struktur workspace yang terorganisir, memungkinkan pengembangan simultan untuk backend API, web application, dan mobile application dalam satu repository Git yang terpadu.

### Tahapan Metodologi Agile

#### 1. Plan (Perencanaan)

Tahap perencanaan dilakukan untuk mengidentifikasi kebutuhan sistem, tujuan pengembangan, serta fitur-fitur yang akan dibangun. Kebutuhan sistem diperoleh melalui observasi dan analisis terhadap proses pengelolaan pelaporan kejadian masyarakat yang berjalan saat ini.

**Aktivitas yang dilakukan:**
- Identifikasi stakeholder (masyarakat, admin, super admin)
- Analisis kebutuhan fungsional dan non-fungsional
- Prioritisasi fitur menggunakan teknik MoSCoW (Must have, Should have, Could have, Won't have)
- Pembuatan user stories dan acceptance criteria
- Estimasi effort menggunakan story points
- Sprint planning dengan durasi 2 minggu per sprint


**Fitur yang direncanakan berdasarkan prioritas:**

**Sprint 1 - Core Authentication & Database:**
- Setup monorepo structure
- Database schema design (PostgreSQL + Drizzle ORM)
- User registration dan login
- JWT authentication
- Basic API structure (Hono.js)

**Sprint 2 - Report Management:**
- Create report dengan lokasi GPS
- Upload foto pendukung
- List reports dengan filter
- Detail report page
- Status workflow (pending, verified, in_progress, resolved)

**Sprint 3 - Map Integration & Admin Dashboard:**
- Interactive map dengan Leaflet (Web)
- Map markers untuk reports
- Admin dashboard layout
- Report verification workflow
- Basic statistics

**Sprint 4 - News & Forum:**
- News management system
- Forum posts dan comments
- Categories management
- User engagement (likes, comments)

**Sprint 5 - Mobile App:**
- React Native + Expo setup
- Mobile authentication
- Create report with camera
- Native map integration (React Native Maps)
- Bottom tab navigation

**Sprint 6 - Notifications & Enhancement:**
- Notification system
- Profile management
- Statistics & analytics
- Performance optimization
- Bug fixes & refinement


#### 2. Design (Perancangan)

Tahap desain bertujuan untuk merancang tampilan dan struktur sistem yang akan dibangun. Proses ini mencakup perancangan antarmuka pengguna (User Interface/UI) dan pengalaman pengguna (User Experience/UX) agar sistem mudah digunakan oleh masyarakat maupun petugas.

**Aktivitas yang dilakukan:**

**a. Database Design:**
- Entity Relationship Diagram (ERD) untuk relasi antar tabel
- Pembuatan schema menggunakan Drizzle ORM
- Normalisasi database untuk efisiensi
- Indexing untuk optimasi query performance
- Definisi foreign keys dan constraints

**Tabel utama yang dirancang:**
- `users` - Data pengguna dengan role-based access
- `reports` - Laporan kejadian dengan geolocation
- `report_comments` - Komentar pada laporan
- `categories` - Kategori laporan dengan hierarki
- `news_articles` - Berita dan pengumuman
- `forum_posts` - Postingan forum komunitas
- `forum_comments` - Komentar forum dengan nested replies
- `forum_categories` - Kategori forum diskusi
- `notifications` - Sistem notifikasi pengguna

**b. API Design:**
- RESTful API architecture
- Endpoint design dengan HTTP methods yang sesuai (GET, POST, PUT, PATCH, DELETE)
- Request/response schema dengan Zod validation
- Error handling dan status codes
- Authentication middleware dengan JWT Bearer Token
- CORS configuration untuk multiple origins


**Struktur API Endpoints:**
```
/api/auth/*           - Authentication (register, login, profile)
/api/reports/*        - Report management (CRUD, comments, likes)
/api/categories/*     - Category management
/api/news/*           - News articles (CRUD, publish)
/api/forum/*          - Forum posts & comments
/api/admin/*          - Admin operations (verification, moderation)
/api/statistics/*     - Analytics & statistics
/api/notifications/*  - User notifications
/api/upload/*         - File upload handling
```

**c. UI/UX Design:**
- **Design System**: Material Design 3 (Material You)
- **Color Scheme**: 
  - Primary: #00288e (Blue) untuk aksen utama
  - Secondary: #505f76 (Gray-blue) untuk elemen sekunder
  - Error: #ba1a1a (Red) untuk peringatan
  - Background: #fbf8ff (Light) untuk mode terang
  - Dark mode: #121318 untuk mode gelap
- **Typography**: Font Inter dengan hierarki yang jelas
- **Responsive Design**: Mobile-first approach dengan breakpoints
- **Component Library**: Reusable components untuk konsistensi

**d. System Architecture:**
- **Monorepo Structure**: Menggunakan workspace untuk multi-app management
- **Backend**: Bun runtime + Hono.js framework + Drizzle ORM
- **Frontend Web**: React + Vite + TypeScript + TailwindCSS
- **Frontend Mobile**: React Native + Expo + TypeScript
- **Database**: PostgreSQL untuk data relational
- **File Storage**: Local uploads folder dengan serve static
- **Authentication**: JWT dengan secure HttpOnly patterns


**e. UML Diagrams:**

**Use Case Diagram** - Menggambarkan interaksi pengguna dengan sistem:
- Actor: Masyarakat/User, Admin, Super Admin
- Use cases: Login, Create Report, View Reports, Comment, Like, Verify Report, Manage Users, Create News, View Statistics

**Activity Diagram** - Menggambarkan alur proses bisnis:
- Proses pelaporan kejadian (dari input sampai submit)
- Proses verifikasi laporan oleh admin
- Proses update status laporan
- Proses registrasi dan login pengguna

**Sequence Diagram** - Menggambarkan interaksi antar komponen:
- Authentication flow (login dengan JWT)
- Create report flow (client → API → database)
- Notification flow (trigger → create → send)

**Class Diagram** - Menggambarkan struktur data dan relasi:
- User, Report, Category, Comment, News, Forum, Notification
- Relationships: one-to-many, many-to-one
- Attributes dan methods untuk setiap class

#### 3. Develop (Pengembangan)

Tahap pengembangan merupakan proses implementasi rancangan sistem ke dalam bentuk aplikasi yang dapat digunakan. Pada tahap ini dilakukan pembangunan fitur-fitur yang telah direncanakan sebelumnya, baik pada backend API, aplikasi web, maupun aplikasi mobile.

**Teknologi yang digunakan:**


**Backend API:**
- **Runtime**: Bun - JavaScript runtime yang sangat cepat dan modern
- **Framework**: Hono.js - Lightweight web framework dengan performa tinggi
- **Database**: PostgreSQL - Relational database yang robust
- **ORM**: Drizzle ORM - Type-safe ORM dengan excellent TypeScript support
- **Validation**: Zod - TypeScript-first schema validation
- **Authentication**: Jose - JWT library untuk token management
- **Password**: Bun's native bcrypt untuk password hashing
- **CORS**: Hono CORS middleware untuk cross-origin support
- **Logger**: Hono logger untuk request logging

**Frontend Web:**
- **Framework**: React 19 dengan hooks dan functional components
- **Language**: TypeScript untuk type safety
- **Build Tool**: Vite - Fast build tool dengan hot module replacement
- **Styling**: TailwindCSS v4 dengan Material 3 design tokens
- **Routing**: React Router v7 dengan file-based routing
- **Maps**: Leaflet + React-Leaflet untuk interactive maps
- **HTTP Client**: Native Fetch API dengan custom wrapper
- **State Management**: React hooks (useState, useEffect, useContext)
- **Forms**: Controlled components dengan validation

**Frontend Mobile:**
- **Framework**: React Native dengan Expo SDK
- **Navigation**: Expo Router (file-based routing)
- **Maps**: React Native Maps untuk native map experience
- **Location**: Expo Location untuk GPS tracking
- **Storage**: Expo Secure Store untuk token storage
- **Camera**: Expo Camera/Image Picker untuk photo capture
- **Fonts**: Expo Font dengan @expo-google-fonts/inter


**Development Workflow:**

1. **Setup Development Environment**:
   - Install Bun untuk backend development
   - Install Node.js dan npm untuk frontend
   - Setup PostgreSQL database local
   - Configure environment variables (.env files)
   - Setup code editor (VS Code) dengan extensions

2. **Backend Development**:
   - Setup Hono.js application structure
   - Create database schema dengan Drizzle ORM
   - Implement authentication middleware dengan JWT
   - Build REST API endpoints untuk setiap resource
   - Implement validation dengan Zod schemas
   - Setup file upload handling dengan static serve
   - Implement error handling dan logging
   - Create database seeding untuk initial data

3. **Frontend Web Development**:
   - Setup Vite + React + TypeScript project
   - Configure TailwindCSS dengan Material 3 theme
   - Implement routing dengan React Router
   - Create reusable component library
   - Build page components (Beranda, Login, Lapor, etc.)
   - Integrate Leaflet maps dengan markers
   - Implement API integration dengan fetch wrapper
   - Create authentication context dan protected routes
   - Implement responsive design untuk mobile

4. **Frontend Mobile Development**:
   - Setup Expo managed workflow
   - Configure app.json dan eas.json
   - Implement tab navigation dengan Expo Router
   - Build screen components untuk mobile UI
   - Integrate React Native Maps
   - Implement GPS location dengan Expo Location
   - Create secure token storage dengan Expo Secure Store
   - Implement photo upload dengan image picker
   - Test pada Android emulator dan iOS simulator


**Fitur yang dikembangkan per modul:**

**Modul Authentication:**
- User registration dengan validasi email dan username
- Login dengan email/username dan password
- JWT token generation dan verification
- Password hashing dengan bcrypt
- Profile update dan change password
- Role-based access control middleware

**Modul Reports:**
- Create report dengan multi-image upload
- GPS location capture (latitude, longitude)
- Address input dengan city dan province
- Category selection
- Priority level (low, medium, high)
- Anonymous reporting option
- Report status workflow management
- Filter reports by status dan category
- Comment dan like functionality
- View counter tracking
- Edit dan delete own reports

**Modul Admin:**
- Admin dashboard dengan statistics
- Report verification workflow
- Update report status (pending → verified → in_progress → resolved)
- Official comments dari petugas
- User management (list, update role, activate/deactivate)
- News management (CRUD operations)
- Category management
- Analytics dan reporting

**Modul News:**
- Create news article dengan rich content
- Upload cover image
- Category dan tags
- Publish/unpublish functionality
- Featured articles
- View counter
- Public news portal


**Modul Forum:**
- Create forum posts dengan title dan content
- Forum categories
- Tags untuk topic categorization
- Pin dan lock posts
- Nested comments (reply to comment)
- Like functionality
- View counter
- Moderation tools untuk admin

**Modul Notifications:**
- Create notification untuk berbagai events
- Mark as read functionality
- Notification types (report_status, comment, response)
- Related ID untuk linking ke sumber
- User-specific notifications

**Modul Statistics:**
- Total reports per status
- Reports per category
- User engagement metrics
- Trend analysis
- Response time tracking
- Geographic distribution

#### 4. Testing (Pengujian)

Tahap pengujian dilakukan untuk memastikan bahwa seluruh fitur berjalan sesuai dengan kebutuhan sistem dan bebas dari bug. Pengujian dilakukan pada setiap sprint setelah proses pengembangan selesai dilaksanakan.

**Jenis Pengujian yang dilakukan:**

**a. Unit Testing:**
- Test individual functions dan methods
- Test validation schemas (Zod)
- Test utility functions (password hashing, JWT)
- Test database queries dengan mock data


**b. Integration Testing:**
- Test API endpoints dengan HTTP requests
- Test database operations (CRUD)
- Test authentication flow (register → login → access protected routes)
- Test file upload functionality
- Test notification triggers

**c. Functional Testing:**
- Test user registration dan login
- Test create report dengan foto dan GPS
- Test admin verification workflow
- Test status update dan notifications
- Test forum posting dan comments
- Test news creation dan publishing
- Test map markers dan interactions
- Test mobile app navigation

**d. UI/UX Testing:**
- Test responsive design pada berbagai screen sizes
- Test dark mode consistency
- Test navigation flow dan user experience
- Test form validation dan error messages
- Test loading states dan feedback
- Test accessibility (keyboard navigation, screen reader)

**e. Performance Testing:**
- Test API response time
- Test database query optimization
- Test image loading performance
- Test map rendering dengan banyak markers
- Test mobile app performance
- Load testing dengan multiple concurrent users

**f. Security Testing:**
- Test authentication dan authorization
- Test JWT token expiration dan refresh
- Test password hashing security
- Test SQL injection prevention
- Test XSS (Cross-Site Scripting) protection
- Test CORS configuration
- Test file upload validation dan security


**g. Cross-Platform Testing:**
- Test web app pada berbagai browser (Chrome, Firefox, Edge, Safari)
- Test mobile app pada Android emulator dan physical device
- Test mobile app pada iOS simulator (jika tersedia)
- Test responsive web pada mobile browsers
- Test PWA functionality (jika diimplementasikan)

**Testing Tools:**
- Manual testing menggunakan Postman untuk API
- Browser DevTools untuk debugging web app
- React DevTools untuk component inspection
- Expo DevTools untuk mobile debugging
- Database inspection dengan Drizzle Studio

**Bug Tracking dan Resolution:**
- Dokumentasi bugs yang ditemukan
- Prioritas bug (critical, high, medium, low)
- Assignment ke developer
- Fix implementation dan re-testing
- Regression testing untuk memastikan fix tidak break existing features

#### 5. Deploy (Deployment)

Tahap deploy dilakukan dengan menempatkan sistem ke lingkungan operasional agar dapat digunakan oleh pengguna. Proses ini meliputi konfigurasi server, database, dan pengaturan sistem agar dapat berjalan dengan baik pada platform web maupun mobile.

**Deployment Strategy:**

**a. Backend API Deployment:**
- **Platform Options**: VPS (Virtual Private Server), Cloud providers (AWS, GCP, DigitalOcean)
- **Server Setup**:
  - Install Bun runtime pada server
  - Clone repository dari Git
  - Install dependencies dengan `bun install`
  - Setup environment variables (.env production)
  - Run database migrations dengan `bun run db:push`
  - Seed initial data jika diperlukan


- **Process Management**: Menggunakan PM2 untuk keep-alive dan auto-restart
  ```bash
  pm2 start bun --name sura-api -- run start
  pm2 save
  pm2 startup
  ```
- **Reverse Proxy**: Nginx untuk routing dan SSL termination
- **SSL Certificate**: Let's Encrypt untuk HTTPS
- **Monitoring**: PM2 monitoring, error logging, uptime tracking

**b. Database Deployment:**
- **PostgreSQL Setup**: Install dan configure PostgreSQL server
- **Security**: Configure firewall, strong passwords, limited access
- **Backup Strategy**: Automated daily backups dengan retention policy
- **Migration**: Run schema migrations dengan Drizzle
- **Seeding**: Initial data seeding untuk production

**c. Frontend Web Deployment:**
- **Build Process**: 
  ```bash
  npm run build  # Generate production build di folder dist/
  ```
- **Platform Options**:
  - **Vercel**: Recommended untuk React apps (auto-deploy dari Git)
  - **Netlify**: Alternative dengan CI/CD integration
  - **Static Hosting**: Nginx, Apache, atau CDN
- **Environment**: Configure VITE_API_URL untuk production API
- **CDN**: CloudFlare atau similar untuk asset optimization
- **Domain**: Setup custom domain dan DNS configuration

**d. Mobile App Deployment:**
- **EAS Build** (Expo Application Services):
  ```bash
  eas build:configure
  eas build --platform android --profile production
  eas build --platform ios --profile production
  ```
- **Android Deployment**:
  - Generate signed APK/AAB
  - Submit ke Google Play Store
  - Beta testing dengan internal testing track
  - Production release setelah approval


- **iOS Deployment** (jika diperlukan):
  - Apple Developer Account required
  - Generate certificate dan provisioning profile
  - Submit ke Apple App Store
  - TestFlight untuk beta testing
  - App Review process

**e. CI/CD Pipeline:**
- Git workflow dengan branches (development, staging, production)
- Automated testing pada pull requests
- Automated deployment untuk staging
- Manual approval untuk production deployment
- Rollback strategy jika deployment gagal

**Penerapan dilakukan secara bertahap:**
1. Deploy backend API terlebih dahulu
2. Test API endpoints pada production environment
3. Deploy web application dengan production API URL
4. Test web app functionality
5. Deploy mobile app untuk beta testing
6. Collect feedback dan fix issues
7. Full production release

#### 6. Review (Evaluasi)

Tahap review bertujuan untuk mengevaluasi hasil pengembangan pada setiap sprint. Evaluasi dilakukan terhadap kualitas fitur, kemudahan penggunaan, performa sistem, serta kesesuaian sistem dengan kebutuhan pengguna.

**Aktivitas Review:**

**a. Sprint Review Meeting:**
- Demo fitur yang telah selesai dikembangkan
- Presentasi ke stakeholder (product owner, users)
- Collect feedback dan saran perbaikan
- Evaluasi pencapaian sprint goals
- Update product backlog


**b. Sprint Retrospective:**
- What went well (successes dan achievements)
- What didn't go well (challenges dan obstacles)
- Action items untuk improvement
- Process optimization
- Team collaboration evaluation

**c. Code Review:**
- Peer review untuk code quality
- Code standards dan best practices compliance
- Security vulnerability check
- Performance optimization opportunities
- Documentation completeness

**d. User Acceptance Testing (UAT):**
- Test sistem dengan real users
- Collect user feedback dan pain points
- Usability assessment
- Feature request dari users
- Bug reports dari users

**e. Performance Review:**
- API response time analysis
- Database query performance
- Frontend loading performance
- Mobile app responsiveness
- Server resource utilization

**f. Quality Metrics:**
- Feature completion rate
- Bug count dan severity
- Code coverage (testing)
- User satisfaction score
- System uptime percentage

**Masukan yang diperoleh dari proses review digunakan sebagai:**
- Bahan perbaikan dan bug fixes
- Input untuk sprint berikutnya
- Feature enhancement dan optimization
- Process improvement
- Documentation updates


#### 7. Launch (Peluncuran)

Tahap launch merupakan tahap peluncuran sistem secara resmi kepada masyarakat dan petugas yang akan menggunakan aplikasi. Pada tahap ini sistem telah siap digunakan untuk mendukung proses penyampaian dan pengelolaan pelaporan kejadian masyarakat secara digital.

**Aktivitas Launch:**

**a. Pre-Launch Preparation:**
- Final testing pada production environment
- Database backup sebelum go-live
- Setup monitoring dan alerting systems
- Prepare user documentation dan help guides
- Train admin dan petugas untuk menggunakan sistem
- Prepare customer support channels

**b. Soft Launch:**
- Limited release untuk selected users
- Beta testing dengan early adopters
- Monitor system stability dan performance
- Collect initial feedback
- Fix critical issues before full launch

**c. Official Launch:**
- Public announcement melalui media sosial dan website
- Press release ke media lokal
- Email notification ke registered users
- Launch event atau webinar (opsional)
- Marketing campaign untuk awareness

**d. Post-Launch Activities:**
- 24/7 monitoring untuk first week
- Rapid response untuk critical bugs
- User onboarding dan support
- Collect user feedback dan analytics
- Regular communication dengan users


**e. Continuous Maintenance:**
- Regular security updates dan patches
- Performance optimization
- Bug fixes dan issue resolution
- Feature enhancement berdasarkan feedback
- Database maintenance dan optimization
- Server monitoring dan scaling
- Backup verification dan disaster recovery testing

**f. Version Management:**
- Semantic versioning (v1.0.0, v1.1.0, v2.0.0)
- Release notes untuk setiap update
- Backward compatibility considerations
- Migration guides untuk breaking changes

**Success Metrics Post-Launch:**
- User registration rate
- Daily/monthly active users (DAU/MAU)
- Report submission rate
- Admin response time
- User satisfaction score
- System uptime percentage
- Bug report rate
- Feature adoption rate

Setelah sistem diluncurkan, proses pemeliharaan dan pengembangan tetap dilakukan secara berkelanjutan untuk meningkatkan kualitas layanan serta menyesuaikan sistem dengan kebutuhan pengguna di masa mendatang. Tim development akan terus melakukan iterasi berdasarkan feedback users dan teknologi terbaru.



## C. Metode Pengumpulan Data

Untuk memastikan Sistem Pelaporan Kejadian Sura dikembangkan sesuai dengan kebutuhan pengguna dan kondisi di lapangan, dilakukan proses pengumpulan data melalui metode observasi dan analisis sistem sejenis. Metode ini digunakan untuk memperoleh gambaran secara langsung mengenai proses penyampaian dan penanganan laporan kejadian yang berlangsung pada instansi atau lingkungan yang menjadi objek penelitian. Data hasil observasi dan analisis menjadi dasar penting dalam perancangan fitur, desain antarmuka, serta alur kerja sistem.

### 1. Observasi

Observasi dilakukan dengan mengamati secara langsung proses penyampaian dan pengelolaan laporan kejadian yang berjalan saat ini, baik sistem manual maupun sistem digital yang sudah ada. Kegiatan ini mencakup pengamatan terhadap beberapa aspek:

**a. Proses Pelaporan Konvensional:**
- Cara masyarakat menyampaikan keluhan atau laporan kejadian (datang langsung, telepon, surat)
- Waktu yang dibutuhkan untuk menyampaikan laporan
- Dokumen atau bukti yang diperlukan
- Hambatan yang dihadapi masyarakat dalam menyampaikan laporan
- Aksesibilitas layanan pelaporan (jam operasional, lokasi kantor)

**b. Proses Pencatatan dan Dokumentasi:**
- Metode pencatatan laporan oleh petugas (manual book, spreadsheet, atau sistem)
- Format data yang dicatat (identitas pelapor, lokasi, deskripsi kejadian)
- Penyimpanan bukti pendukung (foto, dokumen)
- Risiko kehilangan atau kerusakan data
- Efisiensi proses pencatatan


**c. Proses Tindak Lanjut Laporan:**
- Alur kerja setelah laporan diterima (verifikasi, investigasi, penanganan)
- Koordinasi antar unit atau departemen
- Time response untuk setiap jenis laporan
- Dokumentasi progress penanganan
- Komunikasi dengan pelapor mengenai status

**d. Proses Penyampaian Informasi Status:**
- Cara petugas menginformasikan status laporan ke masyarakat
- Frekuensi update status
- Channel komunikasi yang digunakan
- Transparansi proses penanganan
- Feedback mechanism dari masyarakat

**Temuan dari Observasi:**

**Permasalahan yang Ditemukan:**
1. **Proses Manual yang Tidak Efisien**: Pelaporan yang masih dilakukan secara manual membutuhkan waktu dan effort yang besar baik dari masyarakat maupun petugas
2. **Aksesibilitas Terbatas**: Masyarakat harus datang langsung ke kantor pada jam kerja, menyulitkan mereka yang sibuk atau berdomisili jauh
3. **Kurangnya Transparansi**: Masyarakat kesulitan mengetahui perkembangan laporan yang telah disampaikan, tidak ada sistem tracking yang jelas
4. **Risiko Data Loss**: Pencatatan manual atau spreadsheet berisiko hilang atau rusak, tidak ada backup yang sistematis
5. **Dokumentasi Tidak Terstruktur**: Bukti pendukung (foto, dokumen) sering tidak tersimpan dengan baik atau sulit ditemukan kembali
6. **Koordinasi Lemah**: Tidak ada sistem terpusat untuk koordinasi antar unit dalam menangani laporan
7. **No Geolocation**: Lokasi kejadian sulit diidentifikasi dengan tepat tanpa koordinat GPS
8. **Limited Analytics**: Tidak ada data analytics untuk memahami pola kejadian dan evaluasi kinerja


**Kebutuhan yang Teridentifikasi:**
1. **Kemudahan Akses 24/7**: Sistem online yang dapat diakses kapan saja dan dari mana saja
2. **Mobile Accessibility**: Aplikasi mobile untuk kemudahan akses dari smartphone
3. **GPS Integration**: Penandaan lokasi kejadian secara otomatis dan akurat
4. **Photo Upload**: Kemampuan upload multiple photos sebagai bukti pendukung
5. **Real-time Tracking**: Sistem tracking status laporan secara real-time
6. **Automated Notifications**: Notifikasi otomatis untuk update status laporan
7. **Centralized Dashboard**: Dashboard terpusat untuk admin mengelola semua laporan
8. **Analytics & Reporting**: Sistem analytics untuk insights dan decision making
9. **Community Engagement**: Forum komunitas untuk diskusi dan partisipasi masyarakat
10. **Multi-role System**: Role-based access untuk user, admin, dan super admin

### 2. Analisis Sistem Sejenis

Dilakukan analisis terhadap sistem pelaporan masyarakat yang sudah ada untuk memahami best practices, fitur yang efektif, dan potential improvements:

**a. Sistem yang Dianalisis:**
1. **LAPOR! (Layanan Aspirasi dan Pengaduan Online Rakyat)** - Sistem pengaduan nasional
2. **Qlue** - Platform smart city untuk pelaporan masalah kota
3. **JAKI (Jakarta Kini)** - Aplikasi super app DKI Jakarta
4. **SiAP (Sistem Informasi Aplikasi Pelayanan)** - Sistem pengaduan daerah
5. **Platform serupa lainnya** - Mobile apps dan web-based reporting systems


**b. Fitur yang Diadopsi:**
- GPS location tracking untuk akurasi lokasi
- Photo upload untuk bukti visual
- Status workflow (pending, verified, in progress, resolved)
- Comment dan like untuk engagement
- Admin dashboard untuk management
- Push notifications untuk updates
- Category-based classification
- Anonymous reporting option

**c. Improvement dari Sistem Sejenis:**
- **Interactive Map**: Sura menggunakan interactive map dengan markers untuk visualisasi geografis yang lebih baik
- **Community Forum**: Menambahkan fitur forum komunitas untuk diskusi dan partisipasi aktif masyarakat
- **News Portal**: Integrated news portal untuk informasi dan pengumuman resmi
- **Modern Tech Stack**: Menggunakan teknologi terkini (Bun, Hono, React 19, Expo) untuk performa optimal
- **Material 3 Design**: Design system modern dengan dark mode support
- **Multi-platform**: Web dan mobile app dengan code reusability
- **Points & Gamification**: User points system untuk encourage participation (planned)
- **Analytics Dashboard**: Comprehensive statistics untuk data-driven decisions

### 3. Dokumentasi dan Referensi

**a. Dokumentasi Teknis:**
- REST API best practices
- Material Design 3 guidelines
- React dan React Native documentation
- Database design patterns
- Security best practices (OWASP)


**b. Studi Literatur:**
- E-government dan digital transformation
- Community engagement platforms
- Mobile-first design principles
- User experience best practices
- Accessibility standards (WCAG)

**c. User Feedback:**
- Survei kebutuhan masyarakat terhadap sistem pelaporan
- Interview dengan petugas layanan pengaduan
- Focus group discussion dengan potential users
- Usability testing dengan prototype

Hasil observasi, analisis sistem sejenis, dan studi literatur digunakan sebagai dasar dalam menentukan fitur utama sistem, teknologi yang digunakan, arsitektur sistem, user interface design, serta alur kerja yang optimal. Data yang dikumpulkan memastikan bahwa Sura dikembangkan dengan user-centric approach dan memenuhi kebutuhan nyata di lapangan.



## D. Kebutuhan Sistem

Kebutuhan sistem berisi fungsi-fungsi dan karakteristik yang harus dimiliki oleh Sistem Pelaporan Kejadian Sura agar dapat digunakan sesuai dengan tujuan yang telah ditetapkan. Seluruh kebutuhan ini disusun berdasarkan hasil observasi dan analisis terhadap proses penyampaian serta pengelolaan laporan kejadian masyarakat. Kebutuhan sistem dibagi menjadi dua kategori utama: kebutuhan fungsional dan kebutuhan non-fungsional.

### 1. Kebutuhan Fungsional

Kebutuhan fungsional merupakan fitur-fitur utama yang harus disediakan agar sistem dapat digunakan oleh masyarakat, admin, dan super admin sesuai dengan peran masing-masing.

#### a. Autentikasi dan Otorisasi Pengguna

**FR-001: Registrasi Pengguna Baru**
- Sistem menyediakan form registrasi dengan field:
  - Username (unique, 3-50 karakter)
  - Email (unique, valid email format)
  - Password (minimum 6 karakter)
  - Full Name (2-255 karakter)
  - Phone Number (opsional, max 20 karakter)
- Sistem melakukan validasi uniqueness untuk email dan username
- Sistem melakukan password hashing menggunakan bcrypt
- Sistem secara otomatis memberikan role "user" untuk registrasi baru
- Sistem men-generate JWT token setelah registrasi berhasil

**FR-002: Login Pengguna**
- Sistem menyediakan form login dengan field:
  - Identifier (email atau username)
  - Password
- Sistem memverifikasi kredensial dengan database
- Sistem men-generate JWT Bearer Token untuk authenticated session
- Sistem mencatat last login timestamp
- Sistem menolak login untuk akun yang tidak aktif (isActive = false)


**FR-003: Logout Pengguna**
- Sistem menghapus token dari client storage
- Sistem redirect ke halaman login
- Session berakhir dan akses ke protected routes ditolak

**FR-004: Manajemen Profil Pengguna**
- User dapat melihat informasi profil lengkap (username, email, full name, phone, avatar, role, points)
- User dapat mengupdate informasi: full name, phone number, avatar URL
- Sistem memvalidasi input sebelum update
- Sistem mencatat updatedAt timestamp
- Sistem mengembalikan data profil yang sudah diupdate

**FR-005: Ganti Password**
- User dapat mengubah password dengan memasukkan:
  - Current password (untuk verifikasi)
  - New password (minimum 6 karakter)
- Sistem memverifikasi current password sebelum update
- Sistem melakukan hashing untuk password baru
- Sistem mencatat perubahan password

**FR-006: Role-Based Access Control**
- Sistem mendukung 3 role: user, admin, moderator
- Role "user": Akses basic features (create report, view reports, comment, like, forum)
- Role "admin" dan "moderator": Akses admin features (verify reports, manage users, create news, view analytics)
- Sistem memvalidasi role pada setiap request ke protected endpoints
- Middleware authentication check JWT token dan role


#### b. Manajemen Laporan Kejadian (Reports)

**FR-007: Buat Laporan Baru**
- Sistem menyediakan form create report dengan field:
  - Title (required, max 255 karakter)
  - Description (required, text area)
  - Category ID (required, dropdown dari categories aktif)
  - Latitude dan Longitude (required, dari GPS atau map picker)
  - Address, City, Province (required)
  - Image URLs (opsional, multiple images)
  - Video URL (opsional)
  - Is Anonymous (opsional, boolean)
  - Priority (default: medium, options: low/medium/high)
- Sistem otomatis set status "pending" untuk laporan baru
- Sistem otomatis assign user_id dari authenticated user
- Sistem mencatat createdAt timestamp
- Sistem mengembalikan report ID dan detail laporan

**FR-008: Lihat Daftar Laporan**
- Sistem menampilkan list semua laporan yang visible (tidak dihapus)
- Sistem menyediakan filter berdasarkan:
  - Status (pending, verified, in_progress, resolved, rejected)
  - Category (berdasarkan category_id)
  - City atau Province
  - Search keyword (title atau description)
- Sistem menyediakan sorting berdasarkan:
  - Created date (newest/oldest)
  - View count
  - Like count
- Sistem menyediakan pagination untuk performa optimal
- Sistem menampilkan info: title, excerpt, status, category, location, image thumbnail, created date, stats (views, likes, comments)


**FR-009: Lihat Detail Laporan**
- Sistem menampilkan informasi lengkap laporan:
  - Semua field data laporan
  - Informasi pelapor (jika tidak anonim): nama, avatar
  - Category detail dengan icon dan color
  - Lokasi pada map (latitude, longitude)
  - Gallery foto (semua images)
  - Video jika ada
  - Statistics (views, likes, comments count)
  - Status dan priority
  - Timestamps (created, updated, resolved)
- Sistem increment view count setiap kali detail dibuka
- Sistem menampilkan daftar comments pada laporan

**FR-010: Edit Laporan**
- User dapat edit laporan miliknya sendiri
- Admin dapat edit semua laporan
- Field yang dapat diedit: title, description, category, location, address, images, video, priority
- Status tidak dapat diubah oleh user (hanya admin)
- Sistem mencatat updatedAt timestamp
- Sistem validasi permission (owner atau admin)

**FR-011: Hapus Laporan**
- User dapat delete laporan miliknya sendiri (soft delete)
- Admin dapat delete semua laporan
- Sistem validasi permission sebelum delete
- Soft delete: set flag isDeleted = true, tidak menghapus dari database
- Hard delete: hanya untuk super admin atau cascade dari user deletion


**FR-012: Komentar pada Laporan**
- User dapat menambahkan comment pada laporan
- Form comment dengan field: content (required, text)
- Sistem otomatis assign userId dan reportId
- Sistem support nested comments (parentId untuk reply to comment)
- Admin dapat memberikan official comment (isOfficial = true)
- User dapat edit/delete comment miliknya sendiri
- Sistem increment commentCount pada report
- Sistem mencatat createdAt dan updatedAt

**FR-013: Like Laporan**
- User dapat like/unlike laporan
- Sistem prevent duplicate likes (one like per user per report)
- Sistem increment/decrement likeCount pada report
- Sistem mencatat user yang like untuk tracking

**FR-014: Riwayat Laporan Pengguna**
- User dapat melihat semua laporan yang pernah dibuat
- Sistem filter report berdasarkan userId
- Sistem menampilkan dengan sorting newest first
- Menampilkan status terkini dari setiap laporan
- Menampilkan stats (views, likes, comments) untuk each report

**FR-015: Update Status Laporan (Admin)**
- Admin dapat mengubah status laporan:
  - pending → verified (setelah verifikasi valid)
  - verified → in_progress (mulai ditangani)
  - in_progress → resolved (selesai ditangani)
  - pending/verified → rejected (tidak valid/spam)
- Sistem mencatat resolvedAt timestamp untuk status resolved
- Sistem trigger notification ke pelapor saat status berubah
- Sistem mencatat perubahan status dalam log


#### c. Manajemen Kategori

**FR-016: Lihat Daftar Kategori**
- Sistem menampilkan semua kategori yang aktif
- Menampilkan info: name, description, icon, color
- Support parent-child hierarchy (parentId)
- Sorting berdasarkan sortOrder

**FR-017: Buat Kategori Baru (Admin)**
- Admin dapat membuat kategori baru dengan field:
  - Name (required, max 100 karakter)
  - Description (opsional)
  - Icon (opsional, icon name/class)
  - Color (opsional, hex color code)
  - ParentId (opsional, untuk sub-category)
  - SortOrder (opsional, untuk ordering)
- Sistem set isActive = true secara default

**FR-018: Edit dan Hapus Kategori (Admin)**
- Admin dapat edit semua field kategori
- Admin dapat activate/deactivate kategori (isActive toggle)
- Admin dapat delete kategori (soft delete)
- Sistem prevent delete jika kategori masih digunakan oleh reports

#### d. Peta Interaktif

**FR-019: Tampilan Peta dengan Markers**
- Sistem menampilkan interactive map menggunakan Leaflet (web) atau React Native Maps (mobile)
- Sistem menampilkan marker untuk setiap laporan dengan lokasi valid
- Marker menggunakan color coding berdasarkan category atau status
- Click marker menampilkan popup dengan info singkat (title, category, status)
- Click popup link membuka detail laporan


**FR-020: GPS Location Tracking**
- Mobile app dapat detect current location user dengan GPS
- Sistem request location permission dari device
- Sistem otomatis fill latitude, longitude, dan address saat membuat laporan
- User dapat manually adjust pin location pada map jika diperlukan
- Sistem validate latitude (-90 to 90) dan longitude (-180 to 180)

**FR-021: Filter Map Markers**
- User dapat filter markers berdasarkan:
  - Category (show/hide specific categories)
  - Status (show only specific status)
- Sistem update markers secara real-time saat filter berubah
- Sistem optimize rendering untuk banyak markers (clustering jika diperlukan)

#### e. Berita dan Pengumuman

**FR-022: Buat Artikel Berita (Admin)**
- Admin dapat membuat news article dengan field:
  - Title (required, max 255 karakter)
  - Content (required, rich text)
  - Excerpt (opsional, summary)
  - Category (opsional, string)
  - Image URL (opsional, cover image)
  - Tags (opsional, array of strings)
  - Is Published (boolean, default false)
  - Is Featured (boolean, default false)
- Sistem otomatis assign authorId dari admin user
- Sistem set publishedAt timestamp saat di-publish
- Sistem mencatat createdAt dan updatedAt

**FR-023: Edit dan Hapus Berita (Admin)**
- Admin dapat edit semua field article
- Admin dapat publish/unpublish article (toggle isPublished)
- Admin dapat set/unset featured (toggle isFeatured)
- Admin dapat delete article (soft delete)


**FR-024: Portal Berita Publik**
- User dapat melihat list published articles
- Sistem menampilkan featured articles di top/sidebar
- Sistem menyediakan filter berdasarkan category dan tags
- Sistem menyediakan search by keyword (title atau content)
- Sistem increment viewCount saat article dibuka
- User dapat membaca full article dengan rich content formatting

#### f. Forum Komunitas

**FR-025: Buat Postingan Forum**
- User dapat membuat forum post dengan field:
  - Title (required, max 255 karakter)
  - Content (required, text)
  - CategoryId (required, forum category)
  - Tags (opsional, array of strings)
- Sistem otomatis assign userId
- Sistem set isPinned = false dan isLocked = false default
- Sistem mencatat createdAt timestamp

**FR-026: Komentar pada Postingan Forum**
- User dapat comment pada forum post
- Field: content (required, text)
- Support nested comments (parentId untuk replies)
- User dapat like comments
- User dapat edit/delete own comments
- Sistem increment commentCount pada post

**FR-027: Moderasi Forum (Admin)**
- Admin dapat pin/unpin posts (isPinned toggle)
- Admin dapat lock/unlock posts (isLocked toggle untuk prevent new comments)
- Admin dapat delete spam posts atau inappropriate comments
- Admin dapat edit/moderate content


**FR-028: Manajemen Forum Categories (Admin)**
- Admin dapat CRUD forum categories
- Field: name, description, icon, color, sortOrder
- Aktivasi/deaktivasi categories

#### g. Notifikasi

**FR-029: Sistem Notifikasi**
- Sistem otomatis create notification untuk events:
  - Report status berubah (dari admin ke pelapor)
  - Comment baru pada report (ke pemilik report)
  - Official comment dari admin (ke pelapor)
  - Reply pada forum comment (ke pemilik parent comment)
- Field notification: userId, title, message, type, relatedId, isRead
- Type notification: report_status, comment, official_response, forum_reply, announcement

**FR-030: Lihat dan Kelola Notifikasi**
- User dapat melihat list notifikasi miliknya
- Sistem menampilkan unread count badge
- User dapat mark notification as read
- User dapat mark all as read
- Click notification redirect ke related content (report, news, forum post)
- Auto-clear old notifications (30 days atau sesuai policy)

#### h. File Upload

**FR-031: Upload Foto Laporan**
- User dapat upload multiple photos untuk report (max 5 images)
- Supported formats: JPG, PNG, WEBP
- Max file size: 5MB per image
- Sistem validate format dan size
- Sistem store files di folder uploads/reports/
- Sistem return URL array untuk imageUrls field


**FR-032: Upload Avatar Pengguna**
- User dapat upload avatar untuk profile picture
- Supported formats: JPG, PNG
- Max file size: 2MB
- Sistem validate dan resize jika perlu
- Sistem store di folder uploads/avatars/
- Sistem return URL untuk avatarUrl field

**FR-033: Upload Cover Berita**
- Admin dapat upload cover image untuk news article
- Supported formats: JPG, PNG, WEBP
- Max file size: 3MB
- Sistem store di folder uploads/news/
- Sistem optimize image untuk web (compression)

**FR-034: Serve Static Files**
- Sistem serve uploaded files melalui endpoint /uploads/*
- Public access untuk viewing images
- Proper MIME types dan caching headers
- Security: prevent directory traversal

#### i. Dashboard Admin

**FR-035: Statistik dan Analytics**
- Dashboard menampilkan metrics:
  - Total reports (all, per status)
  - Total users (all, active, new this month)
  - Total news articles (published, draft)
  - Total forum posts dan comments
  - Reports per category (pie chart atau bar chart)
  - Reports trend (daily/weekly/monthly line chart)
  - Top reporters (users dengan most reports)
  - Most active areas (cities dengan most reports)
  - Average response time (pending → resolved)
  - Resolution rate (resolved vs total)
- Real-time atau periodic refresh


**FR-036: Manajemen Laporan (Admin)**
- Admin dapat view semua reports dalam table view
- Filter dan search yang comprehensive
- Bulk actions: verify multiple reports, update status multiple
- Quick actions per row: view detail, verify, change status, delete
- Export data ke CSV atau PDF (planned)
- Assign reports ke specific admin/moderator (planned)

**FR-037: Manajemen Pengguna (Admin)**
- Admin dapat view list semua users
- Display info: username, email, full name, role, status, registration date, last login, points
- Admin dapat search users by name, email, username
- Admin dapat filter by role dan active status
- Admin dapat update user role (user ↔ admin ↔ moderator)
- Admin dapat activate/deactivate user accounts
- Admin dapat view user activity (reports created, comments, forum posts)
- Super admin dapat delete users (cascade delete dengan reports, comments)

**FR-038: Manajemen Konten (Admin)**
- Single dashboard untuk manage:
  - Reports (verify, moderate, delete)
  - News articles (publish, edit, delete)
  - Forum posts (pin, lock, delete)
  - Categories (reports dan forum)
- Content moderation tools untuk spam dan inappropriate content

#### j. Statistik Publik

**FR-039: Visualisasi Data untuk Publik**
- Public page dengan statistik transparency:
  - Total reports dan resolution rate
  - Reports by category (chart)
  - Reports by status (chart)
  - Geographic distribution (map heat atau chart by city)
  - Average response time
  - Trend analysis (monthly atau yearly)
- No authentication required untuk access
- Read-only data visualization



### 2. Kebutuhan Non-Fungsional

Kebutuhan non-fungsional menggambarkan kualitas yang harus dipenuhi agar sistem berjalan dengan baik, stabil, aman, dan mudah digunakan. Kebutuhan ini tidak berkaitan dengan fitur spesifik, tetapi dengan kualitas layanan secara keseluruhan.

#### a. Kinerja (Performance)

**NFR-001: Response Time**
- API endpoint harus merespons dalam waktu < 500ms untuk 95% requests
- Database queries harus di-optimize dengan proper indexing
- List pages dengan pagination untuk handle large datasets
- Image loading dengan lazy loading dan compression
- Map rendering dengan clustering untuk > 100 markers

**NFR-002: Throughput**
- Sistem harus mampu menangani minimal 100 concurrent users
- API dapat handle 1000 requests per minute
- Database connection pooling untuk efisiensi
- Caching untuk data yang frequently accessed (categories, public statistics)

**NFR-003: Scalability**
- Horizontal scaling untuk API server (load balancer)
- Database replication untuk read-heavy operations
- CDN untuk static assets dan uploaded images
- Modular architecture untuk easy feature addition


#### b. Keamanan (Security)

**NFR-004: Authentication & Authorization**
- JWT Bearer Token untuk session management
- Token expiration setelah 7 days (configurable)
- Secure password hashing dengan bcrypt (cost factor 10)
- Role-based access control (RBAC) untuk semua protected endpoints
- Middleware validation untuk setiap request

**NFR-005: Data Protection**
- HTTPS untuk semua communications (SSL/TLS)
- Sensitive data encryption at rest (passwords, tokens)
- Secure storage untuk uploaded files (prevent unauthorized access)
- Environment variables untuk secrets (tidak di-commit ke Git)
- Database credentials dan API keys dalam .env files

**NFR-006: Input Validation**
- Server-side validation dengan Zod schemas untuk semua inputs
- Sanitization untuk prevent XSS attacks
- SQL injection prevention dengan ORM parameterized queries
- File upload validation (type, size, content)
- Rate limiting untuk prevent abuse

**NFR-007: Security Headers**
- CORS configuration dengan whitelist origins
- Content Security Policy (CSP) headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Secure cookie flags (HttpOnly, Secure, SameSite)


#### c. Kemudahan Penggunaan (Usability)

**NFR-008: User Interface**
- Material Design 3 principles untuk modern dan consistent UI
- Intuitive navigation dengan clear labels dan icons
- Responsive design untuk berbagai screen sizes (mobile-first)
- Dark mode support untuk user preference
- Consistent color scheme dan typography
- Loading indicators untuk async operations
- Error messages yang jelas dan actionable

**NFR-009: User Experience**
- Minimal clicks untuk complete common tasks (2-3 clicks untuk create report)
- Form validation dengan real-time feedback
- Auto-save drafts untuk prevent data loss (planned)
- Undo/cancel options untuk destructive actions
- Breadcrumbs untuk easy navigation
- Search dan filter yang efektif
- Keyboard shortcuts untuk power users (planned)

**NFR-010: Accessibility**
- WCAG 2.1 Level AA compliance (target)
- Semantic HTML untuk screen readers
- Alt text untuk images
- Keyboard navigation support
- Sufficient color contrast ratios
- Focus indicators yang visible
- Responsive text sizing

#### d. Reliabilitas (Reliability)

**NFR-011: Availability**
- System uptime target: 99% (8.76 hours downtime per year)
- Scheduled maintenance windows dengan advance notice
- Graceful degradation saat partial system failure
- Health check endpoint untuk monitoring


**NFR-012: Error Handling**
- Proper HTTP status codes untuk semua responses
- Detailed error messages untuk debugging (development)
- User-friendly error messages (production)
- Logging untuk all errors (server-side)
- Automatic retry untuk transient failures
- Fallback mechanisms untuk critical features

**NFR-013: Data Integrity**
- Database transactions untuk atomic operations
- Foreign key constraints untuk referential integrity
- Data validation before database operations
- Regular database backups (daily, retention 30 days)
- Point-in-time recovery capability
- Audit trail untuk critical data changes (planned)

#### e. Kompatibilitas (Compatibility)

**NFR-014: Browser Compatibility (Web)**
- Support untuk modern browsers:
  - Google Chrome (latest 2 versions)
  - Mozilla Firefox (latest 2 versions)
  - Microsoft Edge (latest 2 versions)
  - Safari 14+ (for macOS dan iOS)
- Progressive enhancement approach
- Polyfills untuk older browsers (limited support)

**NFR-015: Device Compatibility (Mobile)**
- Android 8.0 (API level 26) and above
- iOS 13.0 and above (Expo SDK minimum requirements)
- Support untuk various screen sizes:
  - Small phones (320px width)
  - Standard phones (375-414px)
  - Tablets (768px+)
- Portrait dan landscape orientations


**NFR-016: Platform Compatibility**
- Cross-platform codebase dengan React (web) dan React Native (mobile)
- Consistent API interface untuk semua platforms
- Platform-specific optimizations (native maps, GPS, camera)
- Shared business logic dan data models

#### f. Maintainability (Pemeliharaan)

**NFR-017: Code Quality**
- TypeScript untuk type safety dan better IDE support
- Consistent coding standards dan conventions
- ESLint untuk code linting
- Modular architecture dengan separation of concerns
- DRY (Don't Repeat Yourself) principles
- SOLID principles untuk object-oriented code

**NFR-018: Documentation**
- README files untuk setiap app (API, web, mobile)
- API documentation dengan endpoint descriptions
- Database schema documentation (ERD)
- Code comments untuk complex logic
- Environment setup guides
- Deployment procedures

**NFR-019: Version Control**
- Git untuk source code management
- Semantic versioning (MAJOR.MINOR.PATCH)
- Meaningful commit messages
- Branch strategy (main, development, feature branches)
- Pull request reviews sebelum merge
- Release notes untuk setiap version


**NFR-020: Testability**
- Unit tests untuk business logic (planned)
- Integration tests untuk API endpoints (planned)
- E2E tests untuk critical user flows (planned)
- Test coverage target: 70%+ (planned)
- Automated testing dalam CI/CD pipeline (planned)

#### g. Portability

**NFR-021: Environment Portability**
- Development, staging, dan production environments
- Environment-specific configurations dengan .env files
- Docker support untuk consistent deployment (planned)
- Database migrations untuk schema portability
- No vendor lock-in untuk easy migration

**NFR-022: Data Portability**
- Export functionality untuk user data (planned)
- Standard data formats (JSON, CSV)
- API untuk third-party integrations (planned)
- Backup dan restore procedures

#### h. Observability

**NFR-023: Logging**
- Request logging untuk all API calls
- Error logging dengan stack traces
- Structured logging format (JSON)
- Log levels (debug, info, warn, error)
- Log rotation dan archival
- Centralized logging (planned dengan ELK stack)


**NFR-024: Monitoring**
- Application performance monitoring (APM)
- System health checks (/health endpoint)
- Database performance metrics
- Alert system untuk critical issues
- Real-time dashboards untuk ops team
- Uptime monitoring dengan external services

**NFR-025: Analytics**
- User behavior tracking (Google Analytics atau similar)
- Feature usage statistics
- Performance metrics (page load time, API latency)
- Conversion funnel analysis
- Retention dan engagement metrics
- Privacy-compliant tracking (GDPR considerations)



## E. Batasan Sistem

Dalam pengembangan Sistem Pelaporan Kejadian Sura, terdapat beberapa batasan yang mempengaruhi ruang lingkup, operasional, serta kemampuan sistem. Batasan ini perlu dijelaskan agar pengguna maupun pengembang memahami limitasi yang ada selama sistem digunakan maupun dikembangkan.

### 1. Batasan Teknologi

**BT-001: Runtime dan Framework Dependencies**
- Backend API memerlukan Bun runtime yang hanya support Linux, macOS, dan Windows (WSL)
- Web application memerlukan modern browser dengan JavaScript enabled
- Mobile app memerlukan smartphone dengan minimum OS version (Android 8.0+, iOS 13.0+)
- Database menggunakan PostgreSQL yang memerlukan server dedicated atau cloud service

**BT-002: Koneksi Internet**
- Sistem sepenuhnya online dan memerlukan koneksi internet aktif
- Tidak ada offline mode support (planned untuk future release)
- Performa sistem sangat bergantung pada kualitas koneksi internet
- Upload foto memerlukan bandwidth yang cukup (minimum 1 Mbps recommended)
- Tanpa koneksi internet, pengguna tidak dapat:
  - Membuat atau melihat laporan
  - Menerima notifikasi real-time
  - Mengakses map dan GPS features
  - Login atau registrasi


**BT-003: File Upload Limitations**
- Maksimum 5 foto per laporan
- Format foto yang didukung: JPG, PNG, WEBP only
- Maksimum ukuran file foto: 5MB per file (laporan), 2MB (avatar), 3MB (news cover)
- Video upload: Hanya URL eksternal (YouTube, Vimeo), bukan direct upload
- Total storage terbatas pada server capacity
- Tidak ada automatic cloud backup untuk uploaded files (perlu manual setup)

**BT-004: GPS dan Geolocation**
- Akurasi GPS bergantung pada device hardware dan signal
- Indoor location mungkin tidak akurat
- GPS permission harus di-grant oleh user di mobile app
- Web app GPS accuracy terbatas dibanding native mobile
- Map rendering terbatas pada area dengan map tile coverage (OpenStreetMap atau provider)

**BT-005: Browser dan Device Limitations**
- Older browsers (IE11 dan sebelumnya) tidak didukung
- Web app responsive tapi optimized untuk screen width 320px - 1920px
- Mobile app performa tergantung pada device specs
- Animasi complex mungkin laggy pada low-end devices
- Memory-intensive operations (banyak map markers) dapat slow pada older devices

**BT-006: Real-time Features**
- Notifikasi menggunakan polling, bukan WebSocket atau push notifications
- Real-time updates dengan refresh interval (bukan true real-time)
- Push notifications untuk mobile app dalam tahap planned (belum implemented)
- No live chat atau instant messaging features


### 2. Batasan Platform

**BP-001: Platform Support**
- **Backend API**: Dapat di-deploy pada VPS/cloud dengan Bun support
- **Web Application**: 
  - Dapat diakses melalui browser pada desktop, laptop, tablet, dan mobile
  - Responsive design tapi experience terbaik pada desktop untuk admin features
  - PWA (Progressive Web App) features dalam tahap planned
- **Mobile Application**:
  - React Native dengan Expo managed workflow
  - Build untuk Android dan iOS
  - Belum di-publish ke Google Play Store atau Apple App Store (masih development/testing)
  - Deployment menggunakan Expo Go app untuk testing atau standalone APK/IPA

**BP-002: Admin Dashboard**
- Admin features primarily designed untuk web platform
- Mobile app admin features terbatas (view-only untuk statistics)
- Complex admin operations (bulk actions, advanced filtering) lebih baik di web
- Report verification dan content moderation optimized untuk desktop experience

**BP-003: Integration Limitations**
- Belum terintegrasi dengan sistem eksternal:
  - Tidak ada SMS gateway untuk notifikasi
  - Tidak ada email service untuk notifications
  - Tidak ada WhatsApp integration
  - Tidak ada social media login (Google, Facebook)
  - Tidak ada payment gateway (jika diperlukan untuk future features)
- Standalone system tanpa API integration ke government systems atau third-party services


**BP-004: Multi-language Support**
- Sistem saat ini hanya mendukung Bahasa Indonesia
- Tidak ada internationalization (i18n) support
- UI labels, error messages, dan content dalam Bahasa Indonesia
- Multi-language support planned untuk future release

**BP-005: Export dan Reporting**
- Data export features (CSV, PDF, Excel) masih dalam tahap planned
- Tidak ada automated report generation
- Tidak ada scheduled reports atau email reports
- Data analytics terbatas pada dashboard visualization
- Advanced analytics dan BI tools integration belum tersedia

### 3. Batasan Fungsional

**BF-001: Ruang Lingkup Penanganan**
- Sistem hanya menangani proses pelaporan dan tracking status
- Tidak mencakup proses penanganan lapangan secara langsung
- Tidak ada dispatch system untuk assign field officers
- Tidak ada real-time tracking untuk field officers
- Resolusi laporan bersifat administrative (update status) bukan actual field resolution

**BF-002: Verifikasi dan Validasi**
- Sistem tidak dapat memverifikasi kebenaran laporan secara otomatis
- Verifikasi bergantung pada manual review oleh admin
- Tidak ada automatic duplicate detection untuk similar reports
- Tidak ada AI/ML untuk classify atau prioritize reports automatically
- Fake reports atau spam bergantung pada manual moderation


**BF-003: Notifikasi dan Komunikasi**
- In-app notifications only (tidak ada email atau SMS)
- Tidak ada two-way chat antara pelapor dan admin
- Komunikasi terbatas pada comments dan official responses
- Tidak ada notification untuk push notifications di mobile (planned)
- User harus login untuk melihat notifications

**BF-004: Search dan Filter**
- Basic search functionality (keyword match dalam title dan description)
- Tidak ada full-text search atau fuzzy matching
- Tidak ada advanced search operators
- Filter terbatas pada predefined criteria (status, category, location)
- Tidak ada saved searches atau custom filters

**BF-005: Data Analytics**
- Basic statistics dan charts
- Tidak ada predictive analytics atau forecasting
- Tidak ada anomaly detection
- Tidak ada geospatial analysis yang advanced (heatmaps, clustering)
- Tidak ada custom report builder

### 4. Batasan Operasional

**BO-001: User Management**
- Self-registration untuk role "user" only
- Admin dan moderator roles harus di-assign oleh super admin secara manual
- Tidak ada approval workflow untuk registrations
- Tidak ada email verification untuk new registrations (planned)
- Tidak ada phone number verification


**BO-002: Data Retention**
- Tidak ada automatic data archival atau purging
- Soft delete untuk reports dan users (data tetap di database)
- Uploaded files tidak auto-deleted saat report di-delete
- Notifications tidak auto-expire (manual cleanup required)
- Database size akan grow over time tanpa maintenance

**BO-003: Concurrent Operations**
- Tidak ada optimistic locking atau version control untuk concurrent edits
- Last write wins untuk simultaneous updates
- Potential data conflicts jika multiple admins edit same report
- No collaborative editing features

**BO-004: Rate Limiting**
- Belum ada rate limiting untuk API requests
- Potential untuk abuse atau DDoS attacks
- No throttling untuk expensive operations (mass upload, bulk operations)
- Planned untuk production deployment

**BO-005: Backup dan Recovery**
- Manual database backup procedures (tidak automatic)
- No built-in backup scheduling
- Recovery procedures bergantung pada database admin expertise
- No disaster recovery automation

### 5. Batasan Regulasi dan Kebijakan

**BR-001: Tanggung Jawab Konten**
- Pengguna bertanggung jawab penuh atas kebenaran informasi dalam laporan
- Sistem tidak melakukan fact-checking atau validation otomatis
- Laporan palsu atau menyesatkan adalah tanggung jawab pelapor
- Admin berhak menolak atau menghapus laporan yang tidak sesuai


**BR-002: Privasi dan Data Personal**
- Data pengguna dan laporan tersimpan di database
- Penggunaan data terbatas untuk operasional sistem pelaporan
- Tidak ada sharing data dengan pihak ketiga tanpa consent
- Anonymous reporting option tersedia untuk privacy
- Sistem belum fully GDPR compliant (untuk EU users)
- Tidak ada data portability atau right-to-be-forgotten automated process

**BR-003: Response Time dan SLA**
- Tidak ada Service Level Agreement (SLA) formal untuk response time
- Kecepatan penanganan laporan tergantung pada kebijakan dan kapasitas instansi
- Sistem tidak menjamin waktu penyelesaian laporan
- Admin discretion untuk prioritize dan handle reports
- No penalty atau compensation untuk delayed responses

**BR-004: Hak Akses dan Otorisasi**
- Hak akses dibatasi berdasarkan role (user, admin, moderator)
- User hanya dapat edit/delete laporan miliknya sendiri
- Admin dapat access dan modify semua data
- Super admin memiliki full control atas sistem
- Tidak ada granular permissions (custom roles atau fine-grained access control)

**BR-005: Jurisdiksi dan Lingkup Wilayah**
- Sistem tidak terbatas pada wilayah geografis tertentu (configurable)
- Categories dan workflow dapat disesuaikan dengan kebutuhan instansi
- Tidak ada automatic routing berdasarkan location ke specific authorities
- Admin manual assignment untuk laporan ke unit terkait


**BR-006: Konten dan Moderasi**
- Setiap laporan harus diklasifikasikan ke dalam kategori yang tersedia
- Konten yang melanggar (hate speech, pornografi, hoax) dapat dihapus oleh admin
- Tidak ada automated content moderation atau AI filtering
- User dapat di-ban jika repeatedly posting inappropriate content
- Community guidelines enforcement bergantung pada manual moderation

### 6. Batasan Keamanan

**BK-001: Authentication**
- Single-factor authentication only (username/email + password)
- Tidak ada two-factor authentication (2FA) support
- Password recovery via admin intervention (no forgot password email flow)
- JWT token expiration fixed pada 7 days (tidak ada refresh token mechanism)
- No session management atau force logout dari admin side

**BK-002: Data Encryption**
- Password di-hash dengan bcrypt
- HTTPS required untuk production (SSL/TLS)
- Tidak ada end-to-end encryption untuk messages atau reports
- Database tidak encrypted at rest (tergantung pada database server config)
- Uploaded files tidak encrypted

**BK-003: Audit dan Logging**
- Basic logging untuk errors dan requests
- Tidak ada comprehensive audit trail untuk all actions
- Tidak ada tamper-proof logging atau blockchain-based audit
- Log analysis manual (tidak ada automated anomaly detection)


### 7. Batasan Skalabilitas

**BS-001: Kapasitas Pengguna**
- System designed untuk support 100+ concurrent users
- Performance testing dilakukan dengan limited load
- Large-scale deployment (1000+ concurrent users) memerlukan infrastructure scaling
- Database optimization mungkin diperlukan untuk high traffic

**BS-002: Data Volume**
- Tidak ada hard limit untuk jumlah reports, tapi performance may degrade dengan millions of records
- Map rendering dapat slow dengan > 1000 markers simultaneously
- Image storage terbatas pada server disk capacity
- Database size growth perlu monitored dan maintained

**BS-003: Geographic Distribution**
- Single server deployment (no multi-region support)
- Latency untuk users jauh dari server location
- No CDN integration untuk static assets (planned)
- No geographic load balancing

---

## Kesimpulan

Batasan-batasan yang telah dijelaskan di atas merupakan limitasi sistem pada tahap current development. Beberapa batasan dapat diatasi melalui pengembangan lanjutan, infrastruktur upgrade, atau third-party integrations. Pemahaman terhadap batasan ini penting untuk:

1. **User Expectations**: Masyarakat dan admin memahami apa yang bisa dan tidak bisa dilakukan sistem
2. **Development Planning**: Tim development dapat prioritize future enhancements
3. **Operational Planning**: Instansi dapat menyesuaikan prosedur dengan capability sistem
4. **Risk Management**: Identifikasi potential issues dan mitigation strategies
5. **Resource Allocation**: Budget dan resource planning untuk improvements

Sistem Sura tetap merupakan solusi yang viable dan efektif untuk digitalisasi proses pelaporan kejadian masyarakat, dengan roadmap yang jelas untuk continuous improvement dan enhancement di masa mendatang.

