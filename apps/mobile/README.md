# Sura Mobile

Aplikasi React Native (Expo) dengan desain selaras platform web Sura.

## Menjalankan

```bash
# Dari root monorepo — pastikan API sudah jalan
bun run dev:api

# Mobile
cd apps/mobile
cp .env.example .env   # sesuaikan IP untuk perangkat fisik
bun install
bun run start
```

## URL API

| Lingkungan | `EXPO_PUBLIC_API_URL` |
|------------|------------------------|
| iOS Simulator | `http://localhost:3000/api` (default) |
| Android Emulator | `http://10.0.2.2:3000/api` (default) |
| Perangkat fisik | `http://<IP-komputer>:3000/api` |

## Fitur

- Login JWT (SecureStore)
- **Beranda**: peta + daftar aduan terverifikasi
- **Laporanku**: laporan milik user
- **Lapor**: formulir + **GPS lokasi saat ini**
- **Komunitas**: forum
- **Profil**: berita, statistik, admin (jika role admin)
- **Admin**: moderasi approve/reject

## Akun demo

Sama dengan web: `admin@sura.app` / `admin123`, `warga@sura.app` / `user123`
