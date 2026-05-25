import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Beranda from './pages/Beranda'
import AdminDashboard from './pages/AdminDashboard'
import AdminLaporan from './pages/AdminLaporan'
import AdminPengguna from './pages/AdminPengguna'
import Masuk from './pages/Login'
import Laporanku from './pages/Laporanku'
import DetailAduan from './pages/DetailAduan'
import FormLaporan from './pages/FormLaporan'
import PortalBerita from './pages/PortalBerita'
import StatistikPublik from './pages/StatistikPublik'
import ProfilPengguna from './pages/ProfilPengguna'
import KomunitasForum from './pages/KomunitasForum'
import BuatPostingan from './pages/BuatPostingan'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/laporan" element={<AdminLaporan />} />
        <Route path="/admin/pengguna" element={<AdminPengguna />} />
        <Route path="/masuk" element={<Masuk />} />
        <Route path="/laporanku" element={<Laporanku />} />
        <Route path="/detail" element={<DetailAduan />} />
        <Route path="/lapor" element={<FormLaporan />} />
        <Route path="/berita" element={<PortalBerita />} />
        <Route path="/statistik" element={<StatistikPublik />} />
        <Route path="/profil" element={<ProfilPengguna />} />
        <Route path="/komunitas" element={<KomunitasForum />} />
        <Route path="/buat-postingan" element={<BuatPostingan />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
