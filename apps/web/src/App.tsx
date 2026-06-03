import React from 'react'
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
import DetailPostingan from './pages/DetailPostingan'
import './index.css'
// Note: App.css removed — it was the default Vite template CSS, not needed

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: '40px',
          fontFamily: 'Inter, sans-serif',
          maxWidth: '700px',
          margin: '60px auto',
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0',
        }}>
          <h1 style={{ color: '#ba1a1a', marginBottom: '8px' }}>⚠️ Terjadi Error</h1>
          <p style={{ color: '#444', marginBottom: '16px' }}>
            Aplikasi mengalami error. Salin pesan di bawah dan laporkan ke developer.
          </p>
          <pre style={{
            background: '#ffdad6',
            color: '#93000a',
            padding: '16px',
            borderRadius: '8px',
            overflowX: 'auto',
            fontSize: '13px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '16px',
              padding: '10px 24px',
              background: '#00288e',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Muat Ulang
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function App() {
  return (
    <ErrorBoundary>
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
          <Route path="/komunitas/detail" element={<DetailPostingan />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
