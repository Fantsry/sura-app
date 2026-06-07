import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { api, getStoredUser } from '../lib/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

type AdminStats = {
  byStatus: Array<{ status: string; count: number }>;
  byCategory: Array<{ category: string | null; color: string | null; count: number }>;
  monthly: Array<{ month: string; count: number }>;
};

const STATUS_COLOR: Record<string, string> = {
  pending: '#ba1a1a',
  verified: '#1e40af',
  in_progress: '#00288e',
  resolved: '#1a8b4a',
  rejected: '#666',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Menunggu',
  verified: 'Diverifikasi',
  in_progress: 'Diproses',
  resolved: 'Selesai',
  rejected: 'Ditolak',
};

const AdminStatistik: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = getStoredUser();
    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
      navigate('/masuk');
      return;
    }

    api.admin
      .statistics()
      .then((res) => {
        setStats(res as AdminStats);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Gagal memuat statistik admin');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const statusCounts = useMemo(() => {
    const counts = { pending: 0, verified: 0, in_progress: 0, resolved: 0, rejected: 0 };
    if (!stats?.byStatus) return counts;
    for (const item of stats.byStatus) {
      if (item.status in counts) {
        counts[item.status as keyof typeof counts] = item.count;
      }
    }
    return counts;
  }, [stats]);

  const totalReports = useMemo(() => {
    return Object.values(statusCounts).reduce((sum, val) => sum + val, 0);
  }, [statusCounts]);

  const months = useMemo(() => {
    if (!stats?.monthly) return [];
    return stats.monthly.map((row) => ({
      label: formatMonthLabel(row.month),
      count: row.count,
    }));
  }, [stats]);

  const totalCategoryCount = useMemo(
    () => (stats?.byCategory ?? []).reduce((sum, r) => sum + r.count, 0),
    [stats]
  );

  const barData = {
    labels: months.map((m) => m.label),
    datasets: [
      {
        label: 'Laporan Masuk',
        data: months.map((m) => m.count),
        backgroundColor: '#00288e',
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#e0e0e0', tickBorderDash: [3, 3] } },
    },
  };

  const pieData = {
    labels: (stats?.byCategory || []).map((c) => c.category ?? 'Tanpa Kategori'),
    datasets: [
      {
        data: (stats?.byCategory || []).map((c) => c.count),
        backgroundColor: (stats?.byCategory || []).map((c) => c.color ?? '#666'),
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Navigation />
      <main className="md:ml-64 pt-20 min-h-screen">
        <div className="max-w-max-width mx-auto p-gutter space-y-xl">
          <header className="mb-xl">
            <p className="text-primary font-label-bold tracking-widest mb-xs">
              ADMIN PORTAL
            </p>
            <h1 className="font-h1 text-h1 text-on-surface">Statistik &amp; Kinerja</h1>
            <p className="text-on-surface-variant mt-xs">
              Tinjau tren masuknya laporan aduan warga serta performa penyelesaian masalah.
            </p>
          </header>

          {error && (
            <p className="p-md bg-error-container text-error rounded-xl mb-lg">{error}</p>
          )}

          {loading ? (
            <div className="space-y-lg animate-pulse">
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-md">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-28 bg-surface-container-low rounded-xl border border-outline-variant" />
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
                <div className="lg:col-span-8 h-80 bg-surface-container-low rounded-xl border border-outline-variant" />
                <div className="lg:col-span-4 h-80 bg-surface-container-low rounded-xl border border-outline-variant" />
              </div>
            </div>
          ) : stats ? (
            <div className="space-y-lg">
              {/* Summary Cards */}
              <section className="grid grid-cols-2 lg:grid-cols-5 gap-md">
                {Object.entries(statusCounts).map(([status, val]) => (
                  <div
                    key={status}
                    className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-sm">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: STATUS_COLOR[status] ?? '#666' }}
                      />
                      <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                        {STATUS_LABEL[status]}
                      </span>
                    </div>
                    <h3 className="font-h1 text-[28px] font-extrabold leading-none text-on-surface">
                      {val.toLocaleString('id-ID')}
                    </h3>
                    <p className="text-[11px] text-outline mt-sm">
                      {totalReports > 0 ? `${Math.round((val / totalReports) * 100)}% dari total` : '0%'}
                    </p>
                  </div>
                ))}
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
                {/* Monthly trend */}
                <section className="lg:col-span-8 bg-surface-container-lowest p-lg rounded-2xl shadow-sm border border-outline-variant/30">
                  <div className="flex justify-between items-center mb-lg">
                    <div>
                      <h3 className="font-h3 text-h3 text-on-surface">Tren Bulanan</h3>
                      <p className="text-body-sm text-on-surface-variant">
                        Laporan masuk 12 bulan terakhir
                      </p>
                    </div>
                    <span className="px-md py-xs bg-primary text-on-primary rounded-full text-label-bold text-xs">
                      Total {totalReports} aduan
                    </span>
                  </div>

                  {months.length === 0 ? (
                    <div className="py-xl text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-[60px] text-outline">
                        bar_chart
                      </span>
                      <p className="mt-md">Belum ada data tren laporan.</p>
                    </div>
                  ) : (
                    <div className="h-72 w-full pt-lg">
                      <Bar data={barData} options={barOptions} />
                    </div>
                  )}
                </section>

                {/* Category pie */}
                <section className="lg:col-span-4 bg-surface-container-lowest p-lg rounded-2xl shadow-sm border border-outline-variant/30">
                  <h3 className="font-h3 text-h3 text-on-surface mb-md">Sebaran Kategori</h3>

                  {stats.byCategory.length === 0 ? (
                    <p className="text-on-surface-variant text-body-sm py-md">
                      Belum ada data kategori.
                    </p>
                  ) : (
                    <>
                      <div className="h-48 w-full mb-md relative">
                        <Doughnut data={pieData} options={pieOptions} />
                      </div>
                      <div className="space-y-md">
                        {stats.byCategory.map((c, i) => {
                          const pct =
                            totalCategoryCount > 0
                              ? Math.round((c.count / totalCategoryCount) * 1000) / 10
                              : 0;
                          return (
                            <div className="space-y-xs" key={`${c.category}-${i}`}>
                              <div className="flex justify-between items-center">
                                <span className="flex items-center gap-sm text-body-sm line-clamp-1">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: c.color ?? '#999' }}
                                  />
                                  {c.category ?? 'Tanpa Kategori'}
                                </span>
                                <span className="font-bold text-body-sm">
                                  {c.count} <span className="text-outline text-xs">({pct}%)</span>
                                </span>
                              </div>
                              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{
                                    width: `${pct}%`,
                                    backgroundColor: c.color ?? '#666',
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </section>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

function formatMonthLabel(month: string): string {
  const [, m] = month.split('-');
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return names[Number(m) - 1] ?? month;
}

export default AdminStatistik;
