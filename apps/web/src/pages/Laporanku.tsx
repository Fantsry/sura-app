import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import {
  api,
  formatDate,
  formatRelative,
  getStoredUser,
  STATUS_META,
  type Report,
} from '../lib/api';

const FILTERS: Array<{ key: string; label: string; icon: string }> = [
  { key: 'all', label: 'Semua', icon: 'all_inclusive' },
  { key: 'pending', label: 'Menunggu', icon: 'pending' },
  { key: 'verified', label: 'Terverifikasi', icon: 'verified' },
  { key: 'in_progress', label: 'Diproses', icon: 'autorenew' },
  { key: 'resolved', label: 'Selesai', icon: 'task_alt' },
  { key: 'rejected', label: 'Ditolak', icon: 'cancel' },
];

const Laporanku: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!getStoredUser()) {
      navigate('/masuk');
      return;
    }
    api
      .getMyReports()
      .then(setReports)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Gagal memuat')
      )
      .finally(() => setLoading(false));
  }, [navigate]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return reports
      .filter((r) => (filter === 'all' ? true : r.status === filter))
      .filter((r) =>
        term
          ? r.title.toLowerCase().includes(term) ||
            r.description.toLowerCase().includes(term) ||
            (r.address ?? '').toLowerCase().includes(term)
          : true
      );
  }, [reports, filter, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: reports.length };
    for (const r of reports) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [reports]);

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <Navigation />
      <main className="pt-20 md:pl-64 pb-xl px-gutter max-w-max-width mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-xl">
          <div>
            <p className="text-primary font-label-bold tracking-widest mb-xs">
              RIWAYAT KONTRIBUSI
            </p>
            <h1 className="font-h1 text-h1 text-on-surface">Laporan Saya</h1>
            <p className="text-on-surface-variant">
              {counts.all} laporan total — {counts.resolved ?? 0} selesai ditangani
            </p>
          </div>
          <Link
            to="/lapor"
            className="inline-flex items-center gap-sm px-lg py-md bg-primary text-on-primary font-button rounded-full shadow-lg hover:brightness-110 hover:scale-[1.02] transition-all"
          >
            <span className="material-symbols-outlined">add</span>
            Buat Laporan Baru
          </Link>
        </header>

        {error && (
          <div className="p-md bg-error-container text-error rounded-xl mb-md flex items-start gap-sm">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}

        {/* Stat tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-lg">
          <StatTile
            icon="description"
            label="Total"
            value={counts.all}
            tone="bg-primary text-on-primary"
          />
          <StatTile
            icon="autorenew"
            label="Sedang Aktif"
            value={(counts.verified ?? 0) + (counts.in_progress ?? 0)}
            tone="bg-secondary-container text-on-secondary-container"
          />
          <StatTile
            icon="task_alt"
            label="Selesai"
            value={counts.resolved ?? 0}
            tone="bg-success text-on-success"
          />
          <StatTile
            icon="visibility_off"
            label="Anonim"
            value={reports.filter((r) => r.isAnonymous).length}
            tone="bg-tertiary-fixed text-on-tertiary-fixed"
          />
        </div>

        {/* Search & Filters */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md mb-lg shadow-sm">
          <div className="relative mb-md">
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari laporan berdasarkan judul, deskripsi, atau alamat..."
              className="w-full pl-12 pr-4 py-md bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          <div className="flex gap-xs overflow-x-auto hide-scrollbar">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`px-md py-sm rounded-full text-body-sm font-button border whitespace-nowrap flex items-center gap-xs transition-all ${
                  filter === f.key
                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                    : 'bg-surface-container-low border-outline-variant text-on-surface-variant hover:border-primary/50'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{f.icon}</span>
                {f.label}
                <span
                  className={`text-[10px] font-bold px-xs rounded ${
                    filter === f.key ? 'bg-white/20' : 'bg-surface-container-high'
                  }`}
                >
                  {counts[f.key] ?? 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-surface-container-low border border-outline-variant rounded-2xl p-md space-y-sm h-44 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="p-xl bg-surface-container-low border border-dashed border-outline-variant rounded-2xl text-center">
            <span className="material-symbols-outlined text-[60px] text-outline">
              folder_open
            </span>
            <h3 className="font-h3 text-h3 text-on-surface mt-md">
              {search || filter !== 'all' ? 'Tidak ada hasil' : 'Belum ada laporan'}
            </h3>
            <p className="text-on-surface-variant mt-xs mb-md">
              {search || filter !== 'all'
                ? 'Coba bersihkan filter atau pencarian.'
                : 'Mulai berkontribusi dengan membuat laporan pertama Anda.'}
            </p>
            {(search || filter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setFilter('all');
                }}
                className="text-primary font-button hover:underline"
              >
                Bersihkan filter
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {filtered.map((r) => {
            const meta = STATUS_META[r.status] ?? STATUS_META.pending;
            return (
              <Link
                key={r.id}
                to={`/detail?id=${r.id}`}
                className="group bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all flex flex-col"
              >
                {r.imageUrls && r.imageUrls.length > 0 ? (
                  <div className="aspect-video bg-surface-container-high overflow-hidden">
                    <img
                      src={r.imageUrls[0]}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="aspect-video flex items-center justify-center"
                    style={{
                      background: r.category?.color
                        ? `linear-gradient(135deg, ${r.category.color}40, ${r.category.color}10)`
                        : 'linear-gradient(135deg, rgba(0,40,142,0.1), rgba(0,40,142,0.05))',
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-[60px]"
                      style={{ color: r.category?.color ?? '#00288e', opacity: 0.5 }}
                    >
                      {r.category?.icon ?? 'description'}
                    </span>
                  </div>
                )}

                <div className="p-md flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-sm gap-sm">
                    <span
                      className="px-sm py-xs rounded-full text-[10px] font-bold uppercase whitespace-nowrap"
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
                      className={`px-sm py-xs rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${meta.bg} ${meta.color}`}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <h3 className="font-bold text-on-surface mb-xs line-clamp-2 group-hover:text-primary transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-body-sm text-on-surface-variant line-clamp-3 flex-1">
                    {r.description}
                  </p>
                  {r.address && (
                    <p className="text-[10px] text-outline mt-md flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[14px]">
                        location_on
                      </span>
                      <span className="line-clamp-1">{r.address}</span>
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-sm pt-sm border-t border-outline-variant/40 text-[10px] text-outline">
                    <span title={formatDate(r.createdAt)}>
                      {formatRelative(r.createdAt)}
                    </span>
                    <span className="flex items-center gap-md">
                      <span className="flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[14px]">
                          visibility
                        </span>
                        {r.viewCount}
                      </span>
                      <span className="flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[14px]">
                          chat_bubble
                        </span>
                        {r.commentCount}
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

function StatTile({
  icon,
  label,
  value,
  tone,
}: {
  icon: string;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className={`p-md rounded-2xl shadow-sm ${tone}`}>
      <div className="flex items-center justify-between mb-sm">
        <span className="material-symbols-outlined text-2xl opacity-70">{icon}</span>
        <span className="text-label-bold uppercase opacity-80">{label}</span>
      </div>
      <p className="font-h2 text-[32px] leading-none font-extrabold">{value}</p>
    </div>
  );
}

export default Laporanku;
