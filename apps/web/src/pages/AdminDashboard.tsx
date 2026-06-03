import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import {
  api,
  formatRelative,
  getStoredUser,
  STATUS_META,
  type Report,
} from '../lib/api';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Record<string, number>>({});
  const [pending, setPending] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(() => {
    api.admin
      .dashboard()
      .then((data) => {
        setStats(data.stats);
        setPending(data.pendingReports);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Gagal memuat dashboard');
        if ((err as Error).message?.includes('401')) navigate('/masuk');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    const user = getStoredUser();
    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
      navigate('/masuk');
      return;
    }
    load();
  }, [load, navigate]);

  const handleStatus = async (id: string, status: string) => {
    setActionId(id);
    try {
      await api.admin.updateReportStatus(id, status);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal update status');
    } finally {
      setActionId(null);
    }
  };

  const cards = useMemo(
    () => [
      {
        key: 'pending',
        label: 'Pending',
        sub: 'Menunggu review',
        value: stats.pendingReports ?? 0,
        icon: 'pending_actions',
        bg: 'bg-error-container',
        text: 'text-error',
      },
      {
        key: 'verified',
        label: 'Terverifikasi',
        sub: 'Siap ditindak',
        value: stats.verifiedReports ?? 0,
        icon: 'verified',
        bg: 'bg-secondary-container',
        text: 'text-on-secondary-container',
      },
      {
        key: 'resolved',
        label: 'Selesai',
        sub: 'Sudah ditangani',
        value: stats.resolvedReports ?? 0,
        icon: 'task_alt',
        bg: 'bg-primary-container',
        text: 'text-on-primary-container',
      },
      {
        key: 'users',
        label: 'Pengguna Aktif',
        sub: `Total ${stats.totalUsers ?? 0} terdaftar`,
        value: stats.activeUsers ?? 0,
        icon: 'people',
        bg: 'bg-tertiary-fixed',
        text: 'text-on-tertiary-fixed',
      },
    ],
    [stats]
  );

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Navigation />
      <main className="md:ml-64 pt-20 min-h-screen">
        <div className="max-w-max-width mx-auto p-gutter space-y-xl">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-md">
            <div>
              <p className="text-primary font-label-bold tracking-widest mb-xs">
                ADMIN PORTAL
              </p>
              <h1 className="font-h1 text-h1 text-on-surface">Dashboard Moderasi</h1>
              <p className="text-on-surface-variant">
                Pantau status laporan dan ambil tindakan dari satu tempat.
              </p>
            </div>
            <div className="flex gap-sm">
              <Link
                to="/admin/laporan"
                className="px-md py-sm bg-primary text-on-primary rounded-full font-button flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-[18px]">assignment</span>
                Semua Laporan
              </Link>
              <Link
                to="/admin/pengguna"
                className="px-md py-sm bg-surface-container-low border border-outline-variant rounded-full font-button flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-[18px]">people</span>
                Pengguna
              </Link>
            </div>
          </header>

          {error && (
            <p className="p-md bg-error-container text-error rounded-xl">{error}</p>
          )}

          {/* Stat cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
            {cards.map((c) => (
              <article
                key={c.key}
                className={`p-lg rounded-2xl shadow-sm border border-outline-variant/20 ${c.bg} ${c.text}`}
              >
                <div className="flex items-center justify-between mb-md">
                  <span className="material-symbols-outlined text-3xl opacity-70">
                    {c.icon}
                  </span>
                  <span className="text-label-bold uppercase opacity-80">{c.label}</span>
                </div>
                <p className="font-h1 text-[40px] leading-none font-extrabold">
                  {loading ? '…' : c.value.toLocaleString('id-ID')}
                </p>
                <p className="text-body-sm mt-sm opacity-80">{c.sub}</p>
              </article>
            ))}
          </section>

          {/* Pending moderation table */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
            <div className="p-lg border-b border-outline-variant flex items-center justify-between flex-wrap gap-md">
              <div>
                <h2 className="font-h2 text-h2 text-on-surface">
                  Antrean Moderasi
                </h2>
                <p className="text-body-sm text-on-surface-variant">
                  Laporan terbaru yang perlu Anda review.
                </p>
              </div>
              <Link
                to="/admin/laporan"
                className="text-primary font-button flex items-center gap-xs hover:underline"
              >
                Lihat semua
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>

            {loading ? (
              <div className="p-xl text-center text-on-surface-variant">
                Memuat antrean...
              </div>
            ) : pending.length === 0 ? (
              <div className="p-xl text-center">
                <span className="material-symbols-outlined text-[60px] text-success">
                  task_alt
                </span>
                <h3 className="font-h3 text-h3 text-on-surface mt-md">Antrean Bersih!</h3>
                <p className="text-on-surface-variant mt-xs">
                  Tidak ada laporan yang perlu dimoderasi saat ini.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-outline-variant/30">
                {pending.map((r) => {
                  const meta = STATUS_META[r.status] ?? STATUS_META.pending;
                  return (
                    <li
                      key={r.id}
                      className="p-md md:p-lg hover:bg-surface-container/40 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-md">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-sm mb-xs">
                            <span
                              className="px-sm py-xs rounded-full text-[10px] font-bold uppercase"
                              style={{
                                backgroundColor: r.category?.color
                                  ? `${r.category.color}22`
                                  : '#eee',
                                color: r.category?.color ?? '#444',
                              }}
                            >
                              {r.category?.name ?? 'Umum'}
                            </span>
                            <span
                              className={`px-sm py-xs rounded-full text-[10px] font-bold uppercase ${meta.bg} ${meta.color}`}
                            >
                              {meta.label}
                            </span>
                            <span className="text-[10px] text-outline">
                              {formatRelative(r.createdAt)}
                            </span>
                          </div>
                          <h3 className="font-bold text-on-surface line-clamp-1">
                            {r.title}
                          </h3>
                          <p className="text-body-sm text-on-surface-variant line-clamp-1">
                            {r.description}
                          </p>
                          {r.address && (
                            <p className="text-[10px] text-outline mt-xs flex items-center gap-xs">
                              <span className="material-symbols-outlined text-[14px]">
                                location_on
                              </span>
                              {r.address}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-sm flex-wrap">
                          <Link
                            to={`/detail?id=${r.id}`}
                            className="px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg font-button text-body-sm flex items-center gap-xs"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              visibility
                            </span>
                            Lihat
                          </Link>
                          <button
                            type="button"
                            disabled={actionId === r.id}
                            onClick={() => handleStatus(r.id, 'verified')}
                            className="px-md py-sm bg-primary text-on-primary rounded-lg font-button text-body-sm flex items-center gap-xs disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              check
                            </span>
                            Verifikasi
                          </button>
                          <button
                            type="button"
                            disabled={actionId === r.id}
                            onClick={() => handleStatus(r.id, 'rejected')}
                            className="px-md py-sm bg-error text-on-error rounded-lg font-button text-body-sm flex items-center gap-xs disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              close
                            </span>
                            Tolak
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
