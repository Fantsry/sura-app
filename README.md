# 🚨 Sura - Platform Pelaporan Kejadian Berbasis Komunitas

**Sura** adalah platform pelaporan kejadian yang memungkinkan masyarakat melaporkan berbagai kejadian (bencana, pencurian, infrastruktur, dll) dengan lokasi GPS dan foto, serta berinteraksi dalam forum komunitas.

---

## 📦 Monorepo Structure

```
sura-app/
├── apps/
│   ├── api/           # Backend API (Hono + Bun + Drizzle ORM)
│   ├── web/           # Web App (React + Vite + TypeScript)
│   └── mobile/        # Mobile App (React Native + Expo)
├── .env               # Environment variables (root)
└── README.md          # Documentation (this file)
```

---

## 🚀 Quick Start

### Prerequisites

Pastikan sudah menginstall:

- **Bun** (untuk API): https://bun.sh/
- **Node.js** 18+ (untuk Web & Mobile)
- **npm/yarn/pnpm** (package manager)
- **PostgreSQL** (database)

### Setup Complete Project

```bash
# 1. Clone repository
git clone <repo-url>
cd sura-app

# 2. Install dependencies untuk semua apps
# Install API dependencies
cd apps/api
bun install

# Install Web dependencies
cd ../web
npm install

# Install Mobile dependencies
cd ../mobile
npm install

# 3. Setup environment variables
cd ../..
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/mobile/.env.example apps/mobile/.env

# 4. Configure .env files (lihat bagian Configuration)

# 5. Setup database
cd apps/api
bun run db:push    # Create tables
bun run db:seed    # Seed initial data

# 6. Start all services
# Terminal 1 - API
cd apps/api
bun run dev

# Terminal 2 - Web
cd apps/web
npm run dev

# Terminal 3 - Mobile (optional)
cd apps/mobile
npm start
```

---

## ⚙️ Configuration

### Root `.env`

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sura_db

# API
API_PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:8081
```

### API `.env` (apps/api/.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/sura_db
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=http://localhost:5173,http://localhost:8081
BASE_URL=http://localhost:3000
```

### Web `.env` (apps/web/.env)

```env
VITE_API_URL=http://localhost:3000/api
```

### Mobile `.env` (apps/mobile/.env)

```env
# Untuk emulator Android
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api

# Untuk emulator iOS
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Untuk physical device (ganti dengan IP komputer Anda)
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
```

---

## 🏗️ Project Architecture

### Backend (API)

**Tech Stack:**
- **Runtime:** Bun
- **Framework:** Hono.js
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** JWT Bearer Token
- **Validation:** Zod

**Features:**
- ✅ User authentication & authorization
- ✅ Report management (CRUD)
- ✅ News articles management
- ✅ Forum posts & comments
- ✅ File upload (images)
- ✅ Admin dashboard APIs
- ✅ Statistics & analytics
- ✅ Geolocation support

**Endpoints:**
- `/api/auth/*` - Authentication
- `/api/reports/*` - Report management
- `/api/news/*` - News articles
- `/api/forum/*` - Community forum
- `/api/admin/*` - Admin operations
- `/api/upload/*` - File uploads
- `/api/categories/*` - Categories
- `/api/statistics/*` - Statistics
- `/api/notifications/*` - Notifications

### Frontend (Web)

**Tech Stack:**
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **Styling:** TailwindCSS v4 (Material 3 Design)
- **Maps:** Leaflet + React-Leaflet
- **HTTP Client:** Fetch API

**Features:**
- ✅ User authentication & registration
- ✅ Interactive map with report markers
- ✅ Create report with photo & GPS
- ✅ Admin dashboard
- ✅ News portal
- ✅ Community forum
- ✅ Statistics & analytics
- ✅ Profile management
- ✅ Dark mode support
- ✅ Responsive design (mobile-first)

**Pages:**
- `/` - Beranda (map + feed)
- `/login` - Login page
- `/lapor` - Create report form
- `/laporanku` - My reports
- `/detail?id=` - Report detail
- `/berita` - News portal
- `/komunitas` - Community forum
- `/statistik` - Public statistics
- `/profil` - User profile
- `/admin` - Admin dashboard
- `/admin/laporan` - Admin reports management
- `/admin/pengguna` - Admin users management
- `/admin/berita` - Create news
- `/admin/kelola-berita` - Manage news

### Mobile (React Native)

**Tech Stack:**
- **Framework:** React Native + Expo
- **Navigation:** Expo Router (file-based)
- **Maps:** React Native Maps
- **Location:** Expo Location
- **Storage:** Expo Secure Store

**Features:**
- ✅ Native mobile experience
- ✅ GPS location tracking
- ✅ Camera integration
- ✅ Push notifications (planned)
- ✅ Offline mode (planned)
- ✅ Bottom tab navigation
- ✅ Native maps integration

---

## 📱 Running Individual Apps

### API Server

```bash
cd apps/api

# Development
bun run dev

# Production
bun run start

# Database
bun run db:push     # Sync schema
bun run db:seed     # Seed data
bun run db:studio   # Open Drizzle Studio
```

API akan berjalan di `http://localhost:3000`

### Web App

```bash
cd apps/web

# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview
```

Web akan berjalan di `http://localhost:5173`

### Mobile App

```bash
cd apps/mobile

# Development (scan QR)
npm start

# Run on Android emulator
npm run android

# Run on iOS simulator (Mac only)
npm run ios

# Run on web
npm run web
```

Lihat [apps/mobile/README.md](apps/mobile/README.md) untuk detail lengkap.

---

## 🗃️ Database Schema

### Main Tables

- **users** - User accounts (citizen, admin, moderator)
- **reports** - Incident reports with GPS & photos
- **report_comments** - Comments on reports
- **categories** - Report categories
- **news_articles** - News & announcements
- **forum_posts** - Community forum posts
- **forum_comments** - Forum comments
- **notifications** - User notifications

### Seeding Data

```bash
cd apps/api
bun run db:seed
```

Default accounts:
- **Admin:** admin@sura.id / admin123
- **User:** user@sura.id / user123

---

## 🎨 Design System

**Material 3 Design Language**

### Colors (Light Mode)
- **Primary:** `#00288e` (Blue)
- **Secondary:** `#505f76` (Gray-blue)
- **Error:** `#ba1a1a` (Red)
- **Background:** `#fbf8ff` (Light purple-white)
- **Surface:** `#fbf8ff`

### Colors (Dark Mode)
- **Primary:** `#b8c4ff` (Light blue)
- **Background:** `#121318` (Dark gray)
- **Surface:** `#121318`

### Typography
- **Font:** Inter (sans-serif)
- **Headings:** Bold, tight spacing
- **Body:** Regular, comfortable line-height

---

## 🔒 Authentication & Authorization

### Roles

1. **user** - Regular citizen
   - Create reports
   - View public reports
   - Comment & like
   - Join forum
   
2. **admin** / **moderator**
   - All user permissions
   - Approve/reject reports
   - Manage users
   - Create news articles
   - View analytics

### API Authentication

**Login:**
```bash
POST /api/auth/login
{
  "identifier": "user@sura.id",
  "password": "user123"
}

Response:
{
  "token": "eyJhbGc...",
  "user": { ... }
}
```

**Authenticated Requests:**
```bash
GET /api/reports
Headers:
  Authorization: Bearer eyJhbGc...
```

---

## 🧪 Testing

### API Testing

```bash
# Manual testing dengan curl
curl http://localhost:3000/health
curl http://localhost:3000/api/categories
```

### Web Testing

```bash
cd apps/web

# Build test
npm run build

# Type check
npm run type-check
```

### Mobile Testing

```bash
cd apps/mobile

# Run on different platforms
npm run android
npm run ios
npm run web

# Clear cache
npx expo start --clear
```

---

## 📦 Deployment

### Backend (API)

**Option 1: VPS/Cloud Server**
```bash
# Install Bun on server
curl -fsSL https://bun.sh/install | bash

# Clone & setup
git clone <repo>
cd sura-app/apps/api
bun install
bun run db:push

# Set production env
cp .env.example .env
# Edit .env with production values

# Run with PM2
npm install -g pm2
pm2 start bun --name sura-api -- run start
pm2 save
pm2 startup
```

**Option 2: Docker**
```dockerfile
# Dockerfile (coming soon)
FROM oven/bun:latest
WORKDIR /app
COPY . .
RUN bun install
CMD ["bun", "run", "start"]
```

### Frontend (Web)

**Vercel (Recommended):**
```bash
# Install Vercel CLI
npm i -g vercel

cd apps/web
vercel
```

**Netlify:**
```bash
npm run build
# Upload dist/ folder to Netlify
```

**Static Hosting:**
```bash
cd apps/web
npm run build
# Upload dist/ to any static host (Nginx, Apache, etc)
```

### Mobile (React Native)

**EAS Build:**
```bash
cd apps/mobile

# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build
eas build --platform android --profile production
eas build --platform ios --profile production
```

Lihat [apps/mobile/README.md](apps/mobile/README.md) untuk detail.

---

## 🛠️ Development Workflow

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "feat: add new feature"

# Push
git push origin feature/new-feature

# Create Pull Request on GitHub
```

### Code Style

- **TypeScript** untuk type safety
- **ESLint** untuk linting
- **Prettier** untuk formatting
- **Conventional Commits** untuk commit messages

---

## 📊 Features Overview

### ✅ Completed Features

**Core:**
- [x] User authentication & authorization
- [x] Create report with photo & GPS
- [x] Interactive map with markers
- [x] Report status workflow (pending → verified → in_progress → resolved)
- [x] Admin dashboard
- [x] File upload (images)

**Reports:**
- [x] Create, read, update, delete reports
- [x] Filter by status & category
- [x] Comments & likes
- [x] View counter
- [x] Anonymous reporting

**News:**
- [x] Create, edit, delete news articles
- [x] Featured articles
- [x] Categories & tags
- [x] Rich content editor
- [x] Admin management page

**Forum:**
- [x] Create posts & comments
- [x] Categories
- [x] Likes & engagement
- [x] Pinned posts

**Admin:**
- [x] Dashboard with statistics
- [x] Report moderation
- [x] User management
- [x] News management
- [x] Analytics

**UI/UX:**
- [x] Dark mode
- [x] Responsive design
- [x] Material 3 design system
- [x] Loading states
- [x] Error handling

### 🚧 Planned Features

- [ ] Push notifications
- [ ] Email notifications
- [ ] Advanced search & filters
- [ ] Export reports (PDF, Excel)
- [ ] Multi-language support
- [ ] Offline mode (mobile)
- [ ] Real-time updates (WebSocket)
- [ ] Mobile app deployment
- [ ] Analytics dashboard
- [ ] API rate limiting

---

## 🐛 Known Issues

- Mobile app belum di-deploy ke stores
- Email notifications belum diimplementasi
- Real-time updates masih polling-based
- Large file upload belum di-optimize

---

## 📝 Documentation

- [API Documentation](apps/api/README.md)
- [Web Documentation](apps/web/README.md)
- [Mobile Documentation](apps/mobile/README.md)
- [Database Schema](apps/api/src/db/schema.ts)

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Write tests (if applicable)
5. Create Pull Request

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

---

## 👥 Team

**Developers:**
- Backend: Hono.js + Bun + Drizzle
- Frontend Web: React + Vite + TailwindCSS
- Frontend Mobile: React Native + Expo

---

## 📞 Contact

- **Email:** support@sura.id
- **GitHub:** [github.com/your-repo](https://github.com/your-repo)
- **Issues:** [Report Bug](https://github.com/your-repo/issues)

---

## 🎯 Project Status

**Current Version:** 1.0.0  
**Status:** MVP Ready 🚀  
**Last Updated:** 2026-06-05

---

**Made with ❤️ by Sura Team**
