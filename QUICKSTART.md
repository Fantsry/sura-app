# ⚡ Quick Start Guide - Sura App

Setup dan jalankan Sura dalam 5 menit!

---

## 📋 Prerequisites

- ✅ **Bun** (https://bun.sh)
- ✅ **Node.js** 18+
- ✅ **PostgreSQL** running

---

## 🚀 Setup (5 Steps)

### 1️⃣ Clone & Install

```bash
# Clone
git clone <repo-url>
cd sura-app

# Install semua dependencies
cd apps/api && bun install
cd ../web && npm install
cd ../mobile && npm install
```

### 2️⃣ Setup Environment

```bash
# Root .env
cp .env.example .env

# API .env
cp apps/api/.env.example apps/api/.env

# Web .env
cp apps/web/.env.example apps/web/.env

# Mobile .env
cp apps/mobile/.env.example apps/mobile/.env
```

**Edit `.env` files:**

Root & API `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/sura_db
JWT_SECRET=change-this-secret-key
```

Web `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

Mobile `.env`:
```env
# Android Emulator
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api

# iOS Simulator
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Physical Device (ganti IP)
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
```

### 3️⃣ Setup Database

```bash
cd apps/api

# Create tables
bun run db:push

# Seed data (optional but recommended)
bun run db:seed
```

**Default Accounts:**
- Admin: `admin@sura.id` / `admin123`
- User: `user@sura.id` / `user123`

### 4️⃣ Start Backend API

```bash
cd apps/api
bun run dev
```

✅ API running di `http://localhost:3000`

Test: http://localhost:3000/health

### 5️⃣ Start Frontend

**Web:**
```bash
# Terminal baru
cd apps/web
npm run dev
```

✅ Web running di `http://localhost:5173`

**Mobile (Optional):**
```bash
# Terminal baru
cd apps/mobile
npm start
```

Scan QR code dengan **Expo Go** app di phone.

---

## 🎉 Done!

Aplikasi sudah running:
- 🌐 **Web:** http://localhost:5173
- 🔌 **API:** http://localhost:3000
- 📱 **Mobile:** Scan QR code

**Login dengan:**
- Email: `admin@sura.id`
- Password: `admin123`

---

## 🐛 Troubleshooting

### "Cannot connect to database"
```bash
# Pastikan PostgreSQL running
# Windows: Services → PostgreSQL
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### "Network request failed" (Mobile)
```bash
# Cek IP komputer
ipconfig  # Windows
ifconfig  # Mac/Linux

# Update mobile/.env dengan IP yang benar
EXPO_PUBLIC_API_URL=http://YOUR_IP:3000/api
```

### "Port 3000 already in use"
```bash
# Kill process di port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Cache issues
```bash
# Clear API cache
cd apps/api
rm -rf node_modules
bun install

# Clear Web cache
cd apps/web
rm -rf node_modules dist
npm install

# Clear Mobile cache
cd apps/mobile
npx expo start --clear
```

---

## 📚 Next Steps

1. ✅ Explore Web UI di browser
2. ✅ Login sebagai admin
3. ✅ Buat laporan test
4. ✅ Coba admin dashboard
5. ✅ Buat berita baru
6. ✅ Test mobile app

**Full Documentation:** [README.md](README.md)

---

## 🎯 Common Commands

```bash
# Start API
cd apps/api && bun run dev

# Start Web
cd apps/web && npm run dev

# Start Mobile
cd apps/mobile && npm start

# Database tools
cd apps/api && bun run db:studio  # Visual DB editor

# Build for production
cd apps/web && npm run build
cd apps/mobile && eas build --platform all
```

---

**Need Help?** Check [README.md](README.md) atau [apps/mobile/README.md](apps/mobile/README.md)

**Happy Coding! 🚀**
