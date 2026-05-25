# Sura — Suara Rakyat

Platform laporan warga (citizen reporting) terdiri dari 3 aplikasi dalam satu monorepo:

- `apps/api` — Hono + Bun + PostgreSQL + Drizzle ORM
- `apps/web` — React + Vite + Leaflet (peta)
- `apps/mobile` — Expo (React Native) + react-native-maps + expo-location

## Prasyarat

- [Bun](https://bun.sh/) ≥ 1.2
- Node.js 20+ (untuk Expo CLI)
- Docker Desktop (untuk PostgreSQL lokal cepat)
- Untuk mobile: Android Studio / Xcode atau Expo Go di perangkat fisik

## Quick Start (Windows / macOS / Linux)

```bash
# 1) Install semua dependency
bun install

# 2) Jalankan database (PostgreSQL via Docker Compose)
docker compose up -d postgres

# 3) Seed user demo + kategori
bun run db:seed

# 4) Jalankan API (terminal 1)
bun run dev:api          # http://localhost:3000

# 5) Jalankan Web (terminal 2)
bun run dev:web          # http://localhost:5173

# 6) Jalankan Mobile (terminal 3)
bun run dev:mobile       # Expo dev tools, scan QR / tekan a/i
```

Akun demo:

| Email | Password | Peran |
| --- | --- | --- |
| `admin@sura.app` | `admin123` | admin |
| `warga@sura.app` | `user123` | user |

## Konfigurasi env

Salin `.env.example` ke `.env` di root, web, dan mobile. Untuk perangkat fisik
mobile, ubah `EXPO_PUBLIC_API_URL` ke IP komputer Anda di jaringan yang sama,
mis. `http://192.168.1.10:3000/api`.

## Fitur Lokasi (peta interaktif)

Web (Leaflet) dan Mobile (react-native-maps) sama-sama mendukung:

- Tombol **Gunakan lokasi saya** (GPS perangkat).
- **Klik / geser peta** untuk memilih titik manual.
- Reverse geocoding via Nominatim (web) / `expo-location` (mobile).

Halaman yang memakainya:

- `Buat Laporan` (formal report) — peta wajib dipilih.
- `Buat Postingan` (forum komunitas) — peta opsional, bisa di-toggle.

## Struktur Penting

```
apps/
  api/src/
    routes/        # Endpoint REST (auth, reports, forum, news, admin, ...)
    db/            # Schema Drizzle + seeder
    lib/           # JWT, password hashing, serializer
  web/src/
    pages/         # Halaman React Router
    components/    # Navigation bersama
    lib/api.ts     # Klien REST + getCurrentLocation
  mobile/
    app/           # Layar Expo Router (file-based routing)
    components/sura  # Komponen UI shared (SuraText/Card/Button/Input)
    constants/theme.ts  # Tokens (Colors, Spacing, Typography) selaras web
    src/lib/api.ts # Klien REST + getCurrentLocation (expo-location)
```
