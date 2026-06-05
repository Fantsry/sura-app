import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Beranda from './pages/Beranda'
import AdminDashboard from './pages/AdminDashboard'
import AdminLaporan from './pages/AdminLaporan'
import AdminPengguna from './pages/AdminPengguna'
import AdminBerita from './pages/AdminBerita'
import AdminKelolaBerita from './pages/AdminKelolaBerita'
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
import NotFound from './pages/NotFound'
import AdminStatistik from './pages/AdminStatistik'
import Pengaturan from './pages/Pengaturan'
import { getStoredUser } from './lib/api'
import './index.css'
// Note: App.css removed — it was the default Vite template CSS, not needed

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = getStoredUser()
  if (!user) {
    return <Navigate to="/masuk" replace />
  }
  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = getStoredUser()
  if (!user) {
    return <Navigate to="/masuk" replace />
  }
  if (user.role !== 'admin' && user.role !== 'moderator') {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const user = getStoredUser()
  if (user) {
    return (
      <Navigate
        to={user.role === 'admin' || user.role === 'moderator' ? '/admin' : '/'}
        replace
      />
    )
  }
  return <>{children}</>
}

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
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Beranda />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/laporan"
            element={
              <AdminRoute>
                <AdminLaporan />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/pengguna"
            element={
              <AdminRoute>
                <AdminPengguna />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/statistik"
            element={
              <AdminRoute>
                <AdminStatistik />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/pengaturan"
            element={
              <AdminRoute>
                <Pengaturan />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/berita"
            element={
              <AdminRoute>
                <AdminBerita />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/kelola-berita"
            element={
              <AdminRoute>
                <AdminKelolaBerita />
              </AdminRoute>
            }
          />
          <Route
            path="/masuk"
            element={
              <PublicRoute>
                <Masuk />
              </PublicRoute>
            }
          />
          <Route
            path="/laporanku"
            element={
              <ProtectedRoute>
                <Laporanku />
              </ProtectedRoute>
            }
          />
          <Route
            path="/detail"
            element={
              <ProtectedRoute>
                <DetailAduan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lapor"
            element={
              <ProtectedRoute>
                <FormLaporan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/berita"
            element={
              <ProtectedRoute>
                <PortalBerita />
              </ProtectedRoute>
            }
          />
          <Route
            path="/statistik"
            element={
              <ProtectedRoute>
                <StatistikPublik />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profil"
            element={
              <ProtectedRoute>
                <ProfilPengguna />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pengaturan"
            element={
              <ProtectedRoute>
                <Pengaturan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/komunitas"
            element={
              <ProtectedRoute>
                <KomunitasForum />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buat-postingan"
            element={
              <ProtectedRoute>
                <BuatPostingan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/komunitas/detail"
            element={
              <ProtectedRoute>
                <DetailPostingan />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
