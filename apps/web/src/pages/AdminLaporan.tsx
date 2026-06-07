import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import {
  api,
  formatDate,
  getStoredUser,
  STATUS_META,
  type Report,
} from '../lib/api';

const STATUS_FILTERS: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'Semua' },
  { key: 'pending', label: 'Pending' },
  { key: 'verified', label: 'Terverifikasi' },
  { key: 'in_progress', label: 'Diproses' },
  { key: 'resolved', label: 'Selesai' },
  { key: 'rejected', label: 'Ditolak' },
];

const AdminLaporan: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [error, setError] = useState('');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearch(q);
    }
  }, [searchParams]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [dash, all] = await Promise.all([
        api.admin.dashboard(),
        api.admin.reports(filter === 'all' ? undefined : filter),
      ]);
      setStats(dash.stats);
      setReports(all);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = getStoredUser();
    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
      navigate('/masuk');
      return;
    }
    const timer = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, navigate]);

  const handleStatus = async (id: string, status: string) => {
    let confirmMsg = '';
    if (status === 'verified') confirmMsg = 'Apakah Anda yakin ingin memverifikasi laporan ini?';
    if (status === 'in_progress') confirmMsg = 'Apakah Anda yakin ingin menindaklanjuti laporan ini?';
    if (status === 'rejected') confirmMsg = 'Apakah Anda yakin ingin menolak laporan ini?';
    if (status === 'resolved') confirmMsg = 'Apakah Anda yakin ingin menandai laporan ini sebagai selesai?';

    if (confirmMsg && !window.confirm(confirmMsg)) return;

    try {
      await api.admin.updateReportStatus(id, status);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal update status');
    }
  };

  const exportCsv = () => {
    const header = ['ID', 'Judul', 'Pengguna', 'Kategori', 'Tanggal', 'Status', 'Alamat'];
    const rows = filtered.map((r) => [
      r.id.slice(0, 8),
      `"${r.title.replace(/"/g, '""')}"`,
      r.author?.fullName ?? 'Anonim',
      r.category?.name ?? '-',
      formatDate(r.createdAt),
      r.status,
      `"${(r.address ?? '').replace(/"/g, '""')}"`,
    ]);
    const csv = [header, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return reports;
    return reports.filter(
      (r) =>
        r.title.toLowerCase().includes(term) ||
        (r.address ?? '').toLowerCase().includes(term) ||
        (r.author?.fullName ?? '').toLowerCase().includes(term) ||
        (r.category?.name ?? '').toLowerCase().includes(term)
    );
  }, [reports, search]);

  const summaryCards = useMemo(
    () => [
      {
        key: 'pending',
        label: 'Pending',
        value: stats.pendingReports ?? 0,
        icon: 'pending_actions',
        cls: 'text-secondary bg-secondary-container/30',
      },
      {
        key: 'verified',
        label: 'Disetujui',
        value: stats.verifiedReports ?? 0,
        icon: 'verified',
        cls: 'text-primary bg-primary-container/30',
      },
      {
        key: 'resolved',
        label: 'Selesai',
        value: stats.resolvedReports ?? 0,
        icon: 'task_alt',
        cls: 'text-primary bg-primary-container/30',
      },
      {
        key: 'total',
        label: 'Total Laporan',
        value: stats.totalReports ?? 0,
        icon: 'folder_open',
        cls: 'text-tertiary bg-tertiary-container/30',
      },
    ],
    [stats]
  );

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Navigation />
      <main className="md:ml-64 pt-20 min-h-screen">
        <div className="max-w-max-width mx-auto p-gutter space-y-xl">
          <header className="mb-xl">
            <h1 className="font-h1 text-h1 text-on-surface mb-sm">Kelola Laporan</h1>
            <p className="font-body-md text-on-surface-variant">
              Moderasi dan validasi laporan dari masyarakat
            </p>
          </header>

          {error && (
            <p className="p-md bg-error-container text-error rounded-lg">{error}</p>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
            {summaryCards.map((card) => (
              <div
                key={card.key}
                className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30"
              >
                <div className="flex items-center justify-between mb-sm">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    {card.icon}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${card.cls}`}>
                    {card.label}
                  </span>
                </div>
                <h3 className="font-h2 text-h2 text-on-surface">{card.value}</h3>
              </div>
            ))}
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
            <div className="p-md border-b border-outline-variant flex flex-wrap justify-between items-center gap-md">
              <h2 className="font-h2 text-h2 text-on-surface">Daftar Laporan</h2>
              <div className="flex flex-wrap gap-sm items-center">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                  <input
                    className="pl-9 pr-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm focus:ring-2 focus:ring-primary outline-none w-48"
                    placeholder="Cari judul / alamat..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                {STATUS_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={`px-md py-1.5 rounded-full text-body-sm font-button border transition-colors ${
                      filter === f.key
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={exportCsv}
                  className="flex items-center gap-xs text-primary font-button px-md py-sm rounded-lg border border-outline-variant hover:bg-primary-container/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="px-lg py-md font-label-bold text-on-surface-variant uppercase">
                      ID
                    </th>
                    <th className="px-lg py-md font-label-bold text-on-surface-variant uppercase">
                      Judul
                    </th>
                    <th className="px-lg py-md font-label-bold text-on-surface-variant uppercase">
                      Pengguna
                    </th>
                    <th className="px-lg py-md font-label-bold text-on-surface-variant uppercase">
                      Kategori
                    </th>
                    <th className="px-lg py-md font-label-bold text-on-surface-variant uppercase">
                      Tanggal
                    </th>
                    <th className="px-lg py-md font-label-bold text-on-surface-variant uppercase">
                      Status
                    </th>
                    <th className="px-lg py-md font-label-bold text-on-surface-variant uppercase text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-lg py-md text-on-surface-variant">
                        Memuat data...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-lg py-xl text-center text-on-surface-variant">
                        Tidak ada laporan untuk filter ini.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r) => {
                      const meta = STATUS_META[r.status] ?? STATUS_META.pending;
                      const initials = (r.author?.fullName ?? 'Anonim')
                        .split(' ')
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase();
                      return (
                        <tr key={r.id} className="hover:bg-surface-container transition-colors">
                          <td className="px-lg py-md font-body-sm text-on-surface-variant whitespace-nowrap">
                            #{r.id.slice(0, 8)}
                          </td>
                          <td className="px-lg py-md max-w-xs">
                            <p className="font-body-md font-semibold text-on-surface line-clamp-1">
                              {r.title}
                            </p>
                            {r.address && (
                              <p className="text-body-sm text-on-surface-variant line-clamp-1">
                                {r.address}
                              </p>
                            )}
                          </td>
                          <td className="px-lg py-md whitespace-nowrap">
                            <div className="flex items-center gap-sm">
                              <div className="w-6 h-6 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed font-bold text-xs">
                                {initials}
                              </div>
                              <span className="font-body-sm text-on-surface">
                                {r.author?.fullName ?? 'Anonim'}
                              </span>
                            </div>
                          </td>
                          <td className="px-lg py-md whitespace-nowrap">
                            <span
                              className="text-label-bold inline-block px-sm py-xs rounded-full"
                              style={{
                                color: r.category?.color ?? '#666',
                                backgroundColor: r.category?.color
                                  ? `${r.category.color}22`
                                  : '#eee',
                              }}
                            >
                              {r.category?.name ?? 'Umum'}
                            </span>
                          </td>
                          <td className="px-lg py-md font-body-sm text-on-surface-variant whitespace-nowrap">
                            {formatDate(r.createdAt)}
                          </td>
                          <td className="px-lg py-md whitespace-nowrap">
                            <span
                              className={`px-md py-xs rounded-full font-label-bold text-[10px] uppercase ${meta.bg} ${meta.color}`}
                            >
                              {meta.label}
                            </span>
                          </td>
                          <td className="px-lg py-md text-right whitespace-nowrap">
                            <div className="flex gap-sm justify-end">
                              <Link
                                to={`/detail?id=${r.id}`}
                                className="p-sm rounded-lg bg-primary text-on-primary hover:opacity-90 transition-all"
                                title="Lihat detail"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  visibility
                                </span>
                              </Link>
                              {r.status === 'pending' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleStatus(r.id, 'verified')}
                                    className="p-sm rounded-lg bg-tertiary-container text-on-tertiary-container hover:opacity-90"
                                    title="Verifikasi"
                                  >
                                    <span className="material-symbols-outlined text-sm">check</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleStatus(r.id, 'rejected')}
                                    className="p-sm rounded-lg bg-error text-on-error hover:opacity-90"
                                    title="Tolak"
                                  >
                                    <span className="material-symbols-outlined text-sm">close</span>
                                  </button>
                                </>
                              )}
                              {r.status === 'verified' && (
                                <button
                                  type="button"
                                  onClick={() => handleStatus(r.id, 'in_progress')}
                                  className="p-sm rounded-lg bg-primary-container text-on-primary-container hover:opacity-90"
                                  title="Mulai Proses"
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    play_arrow
                                  </span>
                                </button>
                              )}
                              {r.status === 'in_progress' && (
                                <button
                                  type="button"
                                  onClick={() => handleStatus(r.id, 'resolved')}
                                  className="p-sm rounded-lg bg-success text-white hover:opacity-90"
                                  title="Tandai Selesai"
                                  style={{ background: '#1a8b4a' }}
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    task_alt
                                  </span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLaporan;
