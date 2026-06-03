import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Navigation from '../components/Navigation';
import { api } from '../lib/api';

type Stats = {
  totalReports: number;
  verifiedReports: number;
  resolvedReports: number;
  pendingReports: number;
  resolutionRate: number;
  byCategory: Array<{ name: string | null; color: string | null; count: number }>;
  monthly: Array<{ month: string; count: number }>;
  mapPoints: Array<{ latitude: number | null; longitude: number | null; status: string }>;
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

const StatistikPublik: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getPublicStats()
      .then((s) => setStats(s as Stats))
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Gagal memuat statistik')
      )
      .finally(() => setLoading(false));
  }, []);

  const months = useMemo(() => {
    if (!stats?.monthly) return [];
    return stats.monthly.map((row) => ({
      label: formatMonthLabel(row.month),
      count: row.count,
    }));
  }, [stats]);

  const maxMonth = useMemo(
    () => months.reduce((m, r) => Math.max(m, r.count), 1),
    [months]
  );

  const totalCategoryCount = useMemo(
    () => (stats?.byCategory ?? []).reduce((sum, r) => sum + r.count, 0),
    [stats]
  );

  const validMapPoints = useMemo(
    () =>
      (stats?.mapPoints ?? []).filter(
        (p): p is { latitude: number; longitude: number; status: string } =>
          p.latitude !== null && p.longitude !== null
      ),
    [stats]
  );

  const mapCenter: [number, number] = validMapPoints[0]
    ? [validMapPoints[0].latitude, validMapPoints[0].longitude]
    : [-6.2, 106.816666];

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <Navigation />
      <main className="pt-20 md:pl-64 pb-xl px-gutter min-h-screen">
        <div className="max-w-max-width mx-auto">
          <header className="mb-xl">
            <p className="text-primary font-label-bold tracking-widest mb-xs">
              TRANSPARANSI PUBLIK
            </p>
            <h1 className="font-h1 text-h1 text-on-surface">Statistik &amp; Data Layanan</h1>
            <p className="text-on-surface-variant mt-xs">
              Pantau efektivitas pelayanan publik dan keamanan lingkungan secara real-time.
            </p>
          </header>

          {error && (
            <p className="p-md bg-error-container text-error rounded-xl mb-lg">{error}</p>
          )}

          {loading ? (
            <SkeletonStat />
          ) : stats ? (
            <div className="space-y-lg">
              {/* Hero stat cards */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-md">
                <HeroCard
                  variant="surface"
                  label="Total Laporan"
                  value={stats.totalReports.toLocaleString('id-ID')}
                  sub="Akumulasi seluruh laporan."
                  icon="folder_open"
                />
                <HeroCard
                  variant="primary"
                  label="Tingkat Penyelesaian"
                  value={`${stats.resolutionRate}%`}
                  sub={`${stats.resolvedReports.toLocaleString('id-ID')} laporan selesai`}
                  icon="task_alt"
                  progress={stats.resolutionRate}
                />
                <div className="grid grid-cols-2 gap-md">
                  <HeroSmall
                    label="Diverifikasi"
                    value={stats.verifiedReports}
                    icon="verified"
                    tone="bg-secondary-container text-on-secondary-container"
                  />
                  <HeroSmall
                    label="Menunggu"
                    value={stats.pendingReports}
                    icon="pending"
                    tone="bg-error-container text-error"
                  />
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
                {/* Monthly trend */}
                <section className="lg:col-span-8 bg-surface-container-lowest p-lg rounded-2xl shadow-sm border border-outline-variant">
                  <div className="flex justify-between items-center mb-lg">
                    <div>
                      <h3 className="font-h3 text-h3 text-on-surface">Tren Bulanan</h3>
                      <p className="text-body-sm text-on-surface-variant">
                        12 bulan terakhir
                      </p>
                    </div>
                    {months.length > 0 && (
                      <span className="px-md py-xs bg-primary text-on-primary rounded-full text-label-bold">
                        {months.reduce((s, m) => s + m.count, 0)} laporan
                      </span>
                    )}
                  </div>

                  {months.length === 0 ? (
                    <div className="py-xl text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-[60px] text-outline">
                        bar_chart
                      </span>
                      <p className="mt-md">Belum ada data tren laporan.</p>
                    </div>
                  ) : (
                    <>
                      <div className="h-72 flex items-end justify-between gap-sm relative pt-xl">
                        <div className="absolute inset-x-0 inset-y-xl flex flex-col justify-between">
                          {[100, 75, 50, 25, 0].map((p) => (
                            <div
                              key={p}
                              className="border-t border-dashed border-outline-variant w-full relative"
                            >
                              <span className="absolute -left-2 -top-2 text-[10px] text-outline">
                                {Math.round((maxMonth * p) / 100)}
                              </span>
                            </div>
                          ))}
                        </div>
                        {months.map((m, i) => (
                          <div
                            key={i}
                            className="flex-1 flex flex-col justify-end relative group"
                          >
                            <div
                              className="bg-gradient-to-t from-primary to-primary-fixed-dim rounded-t-lg transition-all hover:from-primary hover:to-error-container"
                              style={{
                                height: `${Math.max((m.count / maxMonth) * 100, 4)}%`,
                              }}
                            />
                            <span className="absolute -top-1 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                              {m.label}: {m.count}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-md text-label-bold text-outline uppercase">
                        {months.map((m, i) => (
                          <span key={i} className="flex-1 text-center">
                            {m.label}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </section>

                {/* Category pie */}
                <section className="lg:col-span-4 bg-surface-container-lowest p-lg rounded-2xl shadow-sm border border-outline-variant">
                  <h3 className="font-h3 text-h3 text-on-surface mb-md">Sebaran Kategori</h3>

                  {stats.byCategory.length === 0 ? (
                    <p className="text-on-surface-variant text-body-sm py-md">
                      Belum ada data kategori.
                    </p>
                  ) : (
                    <div className="space-y-md">
                      {/* Bars */}
                      {stats.byCategory.map((c, i) => {
                        const pct =
                          totalCategoryCount > 0
                            ? Math.round((c.count / totalCategoryCount) * 1000) / 10
                            : 0;
                        return (
                          <div className="space-y-xs" key={`${c.name}-${i}`}>
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-sm text-body-md">
                                <span
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: c.color ?? '#999' }}
                                ></span>
                                {c.name ?? 'Tanpa Kategori'}
                              </span>
                              <span className="font-bold text-body-sm">
                                {c.count} <span className="text-outline">({pct}%)</span>
                              </span>
                            </div>
                            <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: c.color ?? '#666',
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>

              {/* Map */}
              <section className="bg-surface-container-lowest p-lg rounded-2xl shadow-sm border border-outline-variant">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-md">
                  <div>
                    <h3 className="font-h3 text-h3 text-on-surface">Peta Sebaran Laporan</h3>
                    <p className="font-body-sm text-on-surface-variant">
                      {validMapPoints.length} titik laporan terverifikasi.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-md text-body-sm">
                    {Object.entries(STATUS_COLOR).filter(([k]) =>
                      ['verified', 'in_progress', 'resolved'].includes(k)
                    ).map(([key, color]) => (
                      <LegendDot
                        key={key}
                        color={color}
                        label={STATUS_LABEL[key]}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative w-full h-[480px] rounded-2xl overflow-hidden border border-outline-variant">
                  {validMapPoints.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container-low">
                      <span className="material-symbols-outlined text-[60px] text-outline">
                        map
                      </span>
                      <p className="text-on-surface-variant mt-md">
                        Belum ada titik laporan terverifikasi.
                      </p>
                    </div>
                  ) : (
                    <MapContainer
                      center={mapCenter}
                      zoom={11}
                      className="absolute inset-0 w-full h-full"
                    >
                      <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {validMapPoints.map((p, i) => (
                        <CircleMarker
                          key={i}
                          center={[p.latitude, p.longitude]}
                          radius={9}
                          pathOptions={{
                            color: STATUS_COLOR[p.status] ?? '#666',
                            fillColor: STATUS_COLOR[p.status] ?? '#666',
                            fillOpacity: 0.65,
                            weight: 2,
                          }}
                        >
                          <Tooltip>{STATUS_LABEL[p.status] ?? p.status}</Tooltip>
                        </CircleMarker>
                      ))}
                    </MapContainer>
                  )}
                </div>
              </section>

              {/* CTA */}
              <section className="bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-2xl shadow-lg p-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-md">
                <div>
                  <h3 className="font-h2 text-h2 mb-xs">Punya laporan baru?</h3>
                  <p className="text-body-md opacity-90">
                    Bantu kami menambah transparansi data publik dengan satu laporan Anda.
                  </p>
                </div>
                <Link
                  to="/lapor"
                  className="px-lg py-md bg-on-primary text-primary rounded-full font-button shadow flex items-center gap-xs hover:scale-105 transition-transform"
                >
                  Buat Laporan
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </section>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

function HeroCard({
  variant,
  label,
  value,
  sub,
  icon,
  progress,
}: {
  variant: 'primary' | 'surface';
  label: string;
  value: string;
  sub: string;
  icon: string;
  progress?: number;
}) {
  const baseCls =
    variant === 'primary'
      ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary'
      : 'bg-surface-container-lowest border border-outline-variant text-on-surface';
  return (
    <div className={`${baseCls} p-lg rounded-2xl shadow-sm`}>
      <div className="flex items-center justify-between mb-md">
        <span className="material-symbols-outlined text-3xl opacity-70">{icon}</span>
        <span className="text-label-bold uppercase opacity-80">{label}</span>
      </div>
      <p className="font-h1 text-[44px] leading-none font-extrabold">{value}</p>
      {progress !== undefined && (
        <div className="w-full bg-white/20 h-2 rounded-full mt-md overflow-hidden">
          <div
            className="bg-on-primary h-full transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
      <p className="text-body-sm mt-sm opacity-80">{sub}</p>
    </div>
  );
}

function HeroSmall({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: string;
  tone: string;
}) {
  return (
    <div className={`${tone} p-md rounded-2xl flex flex-col justify-between`}>
      <span className="material-symbols-outlined text-2xl opacity-70 mb-md">{icon}</span>
      <div>
        <p className="font-h2 text-[28px] leading-none font-extrabold">
          {value.toLocaleString('id-ID')}
        </p>
        <p className="text-label-bold uppercase opacity-80 mt-xs">{label}</p>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-xs">
      <span
        className="w-3 h-3 rounded-full inline-block ring-2 ring-white"
        style={{ backgroundColor: color }}
      ></span>
      {label}
    </span>
  );
}

function SkeletonStat() {
  return (
    <div className="space-y-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-44 bg-surface-container-low rounded-2xl border border-outline-variant animate-pulse"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
        <div className="lg:col-span-8 h-80 bg-surface-container-low rounded-2xl border border-outline-variant animate-pulse" />
        <div className="lg:col-span-4 h-80 bg-surface-container-low rounded-2xl border border-outline-variant animate-pulse" />
      </div>
      <div className="h-96 bg-surface-container-low rounded-2xl border border-outline-variant animate-pulse" />
    </div>
  );
}

function formatMonthLabel(month: string): string {
  const [, m] = month.split('-');
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return names[Number(m) - 1] ?? month;
}

export default StatistikPublik;
