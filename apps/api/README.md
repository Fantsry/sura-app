# Sura API

Backend REST API untuk platform Sura (Suara Rakyat).

## Menjalankan

```bash
# Dari root monorepo
cp .env.example .env
# Setup PostgreSQL & jalankan database/schema.sql

bun run db:seed --filter api
bun run dev:api
```

API berjalan di `http://localhost:3000`.

## Akun demo (setelah seed)

| Role  | Email            | Password  |
|-------|------------------|-----------|
| Admin | admin@sura.app   | admin123  |
| User  | warga@sura.app   | user123   |

## Pembagian akses

### Publik (tanpa login)
- `GET /api/categories`
- `GET /api/reports` — hanya laporan verified/in_progress/resolved
- `GET /api/reports/map`
- `GET /api/statistics/public`
- `GET /api/news`
- `GET /api/forum/*`

### User (Bearer token)
- `POST /api/reports` — wajib `latitude` & `longitude` (lokasi saat ini)
- `GET /api/reports/my`
- `PUT/DELETE /api/reports/:id` — milik sendiri, status pending
- Forum: buat posting & komentar

### Admin / Moderator
- `GET /api/admin/dashboard`
- `GET /api/admin/reports` — semua status termasuk pending
- `PATCH /api/admin/reports/:id/status` — verifikasi / tolak
- `GET/PATCH /api/admin/users`
- `GET /api/admin/statistics`
- `POST /api/news`

## Contoh buat laporan dengan lokasi

```bash
curl -X POST http://localhost:3000/api/reports \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pohon tumbang",
    "description": "Menutup jalan utama",
    "categorySlug": "bencana",
    "latitude": -6.2,
    "longitude": 106.82,
    "address": "Jl. Sudirman, Jakarta"
  }'
```
