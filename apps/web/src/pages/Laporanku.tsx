import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { api, getStoredUser, type Report } from '../lib/api';

const statusLabel: Record<string, string> = {
  pending: 'Menunggu',
  verified: 'Terverifikasi',
  in_progress: 'Diproses',
  resolved: 'Selesai',
  rejected: 'Ditolak',
};

const Laporanku: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getStoredUser()) {
      navigate('/masuk');
      return;
    }
    api
      .getMyReports()
      .then(setReports)
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat'))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <Navigation />
      <main className="pt-20 lg:pl-64 pb-xl px-gutter max-w-max-width mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-xl">
          <div>
            <h1 className="font-h1 text-h1 text-on-surface">Laporanku</h1>
            <p className="font-body-md text-on-surface-variant">Riwayat laporan yang Anda kirim</p>
          </div>
          <Link to="/lapor" className="inline-flex items-center gap-sm px-lg py-md bg-primary text-on-primary font-button rounded-full shadow-lg">
            <span className="material-symbols-outlined">add</span>
            Buat Laporan Baru
          </Link>
        </header>

        {loading && <p className="text-on-surface-variant">Memuat laporan...</p>}
        {error && <p className="p-md bg-error-container text-error rounded-lg">{error}</p>}

        {!loading && reports.length === 0 && (
          <p className="text-on-surface-variant">Belum ada laporan. Buat laporan pertama Anda.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {reports.map((r) => (
            <Link
              key={r.id}
              to={`/detail?id=${r.id}`}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-sm">
                <span className="px-2 py-1 rounded-full bg-primary-container text-primary text-[10px] font-bold uppercase">
                  {r.category?.name ?? 'Umum'}
                </span>
                <span className="text-[10px] text-outline">{statusLabel[r.status] ?? r.status}</span>
              </div>
              <h3 className="font-bold text-on-surface mb-xs line-clamp-2">{r.title}</h3>
              <p className="text-body-sm text-on-surface-variant line-clamp-3">{r.description}</p>
              {r.address && (
                <p className="text-[10px] text-outline mt-sm flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  {r.address}
                </p>
              )}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Laporanku;
