# 📱 Sura Mobile App

Aplikasi mobile Sura untuk pelaporan kejadian berbasis lokasi dengan React Native + Expo.

## 📋 Prerequisites

Sebelum memulai, pastikan sudah menginstall:

- **Node.js** 18.x atau lebih tinggi
- **npm** atau **yarn** atau **pnpm**
- **Expo CLI** (akan diinstall otomatis)

Untuk testing di device:
- **Expo Go App** ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

Untuk build production:
- **Android Studio** (untuk Android)
- **Xcode** (untuk iOS, hanya di Mac)
- **EAS CLI** untuk build cloud (opsional)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Di root project
cd apps/mobile

# Install packages
npm install
# atau
yarn install
# atau
pnpm install
```

### 2. Setup Environment Variables

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Edit file `.env`:

```env
# Untuk testing di emulator Android
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api

# Untuk testing di emulator iOS
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Untuk testing di device fisik (ganti dengan IP komputer Anda)
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
```

**Cara mendapatkan IP komputer:**

**Windows:**
```bash
ipconfig
# Cari "IPv4 Address" di bagian WiFi/Ethernet
```

**Mac/Linux:**
```bash
ifconfig
# atau
ip addr show
```

### 3. Start Backend API

Sebelum menjalankan mobile app, pastikan backend API sudah running:

```bash
# Di terminal terpisah, dari root project
cd apps/api
bun run dev
# atau
npm run dev
```

Backend akan berjalan di `http://localhost:3000`

### 4. Start Mobile App

```bash
# Di folder apps/mobile
npm start
# atau
yarn start
# atau
pnpm start
```

Akan muncul QR code dan opsi untuk:
- Press `a` untuk Android emulator
- Press `i` untuk iOS simulator
- Scan QR code dengan Expo Go di device fisik

---

## 📱 Testing di Device

### Android Device (Physical Phone)

1. **Install Expo Go** dari Google Play Store
2. **Pastikan phone dan laptop di WiFi yang sama**
3. **Jalankan** `npm start`
4. **Scan QR code** dengan Expo Go app
5. **Tunggu** app loading

### iOS Device (Physical iPhone)

1. **Install Expo Go** dari App Store
2. **Pastikan iPhone dan Mac di WiFi yang sama**
3. **Jalankan** `npm start`
4. **Scan QR code** dengan Camera app (akan auto open Expo Go)
5. **Tunggu** app loading

### Android Emulator

1. **Install Android Studio**
2. **Setup Android Virtual Device (AVD)**
3. **Start emulator** dari Android Studio
4. **Jalankan** `npm run android`

### iOS Simulator (Mac only)

1. **Install Xcode** dari App Store
2. **Install Command Line Tools**: `xcode-select --install`
3. **Jalankan** `npm run ios`

---

## 🏗️ Project Structure

```
apps/mobile/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Bottom tab navigation
│   │   ├── index.tsx      # Home/Beranda
│   │   ├── komunitas.tsx  # Forum komunitas
│   │   ├── lapor.tsx      # Buat laporan
│   │   ├── laporanku.tsx  # Laporan saya
│   │   └── profil.tsx     # Profile user
│   ├── admin/             # Admin pages
│   ├── index.tsx          # Landing page
│   ├── login.tsx          # Login page
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   └── sura/             # Custom Sura components
├── src/
│   └── lib/              # Utilities & API client
├── assets/               # Images, fonts, etc.
├── constants/            # Constants & theme
└── app.json              # Expo configuration
```

---

## 🎨 Features

### User Features
- ✅ Login & Authentication
- ✅ View laporan di map
- ✅ Buat laporan baru dengan foto & lokasi
- ✅ Lihat laporan sendiri
- ✅ Forum komunitas
- ✅ Portal berita
- ✅ Profile management
- ✅ Dark mode support

### Admin Features
- ✅ Dashboard admin
- ✅ Review & approve laporan
- ✅ User management
- ✅ Statistics

### Tech Stack
- **React Native** 0.81.5
- **Expo** ~54
- **Expo Router** ~6 (File-based routing)
- **TypeScript** ~5.9
- **React Native Maps** (Google Maps)
- **Expo Location** (GPS)
- **Expo Secure Store** (Token storage)

---

## 🔧 Development

### Run Development Server

```bash
npm start
```

Options:
- `a` - Open on Android
- `i` - Open on iOS
- `w` - Open on Web
- `r` - Reload app
- `m` - Toggle menu
- `j` - Open debugger

### Run on Specific Platform

```bash
# Android
npm run android

# iOS (Mac only)
npm run ios

# Web
npm run web
```

### Clear Cache

```bash
# Clear Expo cache
npx expo start --clear

# Reset all
rm -rf node_modules .expo dist
npm install
```

---

## 📦 Building for Production

### Option 1: EAS Build (Cloud Build - Recommended)

**Install EAS CLI:**
```bash
npm install -g eas-cli
```

**Login to Expo:**
```bash
eas login
```

**Configure EAS:**
```bash
eas build:configure
```

**Build Android APK:**
```bash
eas build --platform android --profile preview
```

**Build iOS:**
```bash
eas build --platform ios --profile preview
```

**Build for App Stores:**
```bash
# Android (AAB untuk Google Play)
eas build --platform android --profile production

# iOS (untuk TestFlight/App Store)
eas build --platform ios --profile production
```

### Option 2: Local Build

**Android APK (Local):**
```bash
# Build locally
npx expo prebuild
cd android
./gradlew assembleRelease

# APK akan ada di:
# android/app/build/outputs/apk/release/app-release.apk
```

**iOS (Mac only):**
```bash
npx expo prebuild
cd ios
pod install
# Open .xcworkspace di Xcode
# Archive & Export
```

---

## 🌐 API Configuration

### Development
```env
# Emulator Android
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api

# Emulator iOS / Simulator
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Physical Device (same WiFi)
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
```

### Production
```env
EXPO_PUBLIC_API_URL=https://api.sura.id/api
```

**Note:** Ganti URL sesuai dengan backend API Anda.

---

## 🐛 Troubleshooting

### "Unable to resolve module"
```bash
# Clear cache dan reinstall
rm -rf node_modules
npm install
npx expo start --clear
```

### "Network request failed"
- Pastikan backend API running
- Cek IP address di `.env` sudah benar
- Pastikan device dan laptop di WiFi yang sama
- Cek firewall tidak block port 3000

### "Unable to connect to Metro"
```bash
# Restart metro bundler
npx expo start --clear --reset-cache
```

### Android Emulator lambat
- Pastikan **Hardware Acceleration** enabled di BIOS
- Gunakan **AVD dengan Google APIs** bukan Google Play
- Allocate lebih banyak RAM ke emulator

### iOS Simulator not found
```bash
# Install iOS Simulator
xcode-select --install
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

### Build failed
```bash
# Clean all caches
npx expo prebuild --clean
rm -rf node_modules ios android .expo
npm install
```

---

## 📝 Common Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web

# Clear cache
npx expo start --clear

# Update Expo SDK
npx expo install --fix

# Check for outdated packages
npm outdated

# Upgrade Expo SDK
npx expo upgrade

# Type check
npx tsc --noEmit
```

---

## 🔐 Environment Variables

```env
# API URL
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api

# Optional: Analytics
EXPO_PUBLIC_ANALYTICS_ID=your-analytics-id

# Optional: Map API Key
EXPO_PUBLIC_GOOGLE_MAPS_KEY=your-google-maps-key
```

**Note:** Environment variables dengan prefix `EXPO_PUBLIC_` bisa diakses di client-side.

---

## 📚 Resources

- **Expo Docs:** https://docs.expo.dev/
- **React Native Docs:** https://reactnative.dev/
- **Expo Router:** https://expo.github.io/router/docs/
- **React Native Maps:** https://github.com/react-native-maps/react-native-maps
- **Expo Location:** https://docs.expo.dev/versions/latest/sdk/location/

---

## 🎯 Deployment Checklist

### Before Building

- [ ] Update `version` di `app.json`
- [ ] Update `versionCode`/`buildNumber` (Android/iOS)
- [ ] Set correct `EXPO_PUBLIC_API_URL` production
- [ ] Test semua fitur di development
- [ ] Test di physical device (Android & iOS)
- [ ] Remove console.log statements
- [ ] Update app icons & splash screen
- [ ] Configure app signing (Android keystore, iOS certificates)
- [ ] Setup Google Maps API key (production)
- [ ] Test offline scenarios
- [ ] Check app permissions

### Building

- [ ] Build dengan `eas build --platform all --profile production`
- [ ] Download & test APK/IPA
- [ ] Test di different screen sizes
- [ ] Test di different Android versions
- [ ] Test di different iOS versions

### Publishing

- [ ] Submit ke Google Play Console
- [ ] Submit ke App Store Connect
- [ ] Update app description & screenshots
- [ ] Setup App Store Optimization (ASO)
- [ ] Monitor crash reports

---

## 🤝 Contributing

1. Create branch dari `main`
2. Make changes
3. Test di Android & iOS
4. Create Pull Request

---

## 📄 License

[MIT License](../../LICENSE)

---

## 👥 Team

Developed by Sura Team

---

## 📞 Support

Jika ada masalah, hubungi:
- Email: support@sura.id
- GitHub Issues: [Create Issue](https://github.com/your-repo/issues)

---

**Happy Coding! 🚀**
