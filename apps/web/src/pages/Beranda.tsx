import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navigation from '../components/Navigation';
import { api, formatRelative, STATUS_META, type Report } from '../lib/api';

const markerIcon = (color: string) =>
  L.divIcon({
    className: 'sura-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    html: `
      <div style="position:relative;width:28px;height:28px;">
        <div style="
          width:24px;height:24px;border-radius:50% 50% 50% 0;
          background:${color};border:3px solid white;
          transform:rotate(-45deg);box-shadow:0 4px 10px rgba(0,0,0,0.3);
          position:absolute;left:2px;top:0;
        "></div>
        <div style="
          width:8px;height:8px;border-radius:50%;
          background:white;position:absolute;left:10px;top:8px;
        "></div>
      </div>
    `,
  });

type MapPoint = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  category: string;
  categoryColor?: string;
  status: string;
  address?: string;
};

type FilterKey = 'all' | 'pending' | 'verified' | 'in_progress' | 'resolved';

function FlyTo({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 16, { duration: 0.6 });
  }, [center, map]);
  return null;
}

const Beranda: React.FC = () => {
  const [mapReports, setMapReports] = useState<MapPoint[]>([]);
  const [feed, setFeed] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [focusPoint, setFocusPoint] = useState<[number, number] | null>(null);

  useEffect(() => {
    Promise.all([
      api.getMapReports().catch(() => []),
      api.getReports({ limit: 30 }).catch(() => []),
    ])
      .then(([points, reports]) => {
        setMapReports(points as MapPoint[]);
        setFeed(reports);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredFeed = useMemo(() => {
    if (filter === 'all') return feed;
    return feed.filter((r) => r.status === filter);
  }, [feed, filter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: feed.length };
    for (const r of feed) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [feed]);

  const center: [number, number] =
    mapReports[0] && mapReports[0].latitude && mapReports[0].longitude
      ? [mapReports[0].latitude, mapReports[0].longitude]
      : [-6.2, 106.816666];

  const handleCardClick = (r: Report) => {
    if (r.latitude && r.longitude) {
      setFocusPoint([r.latitude, r.longitude]);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <Navigation />
      <main className="pt-20 md:pl-64 min-h-screen">
        <div className="flex flex-col md:flex-row md:h-[calc(100vh-5rem)]">
          {/* Map Side */}
          <section className="flex-1 relative bg-surface-container-low overflow-hidden border-b md:border-b-0 md:border-r border-outline-variant min-h-[420px]">
            <MapContainer
              center={center}
              zoom={12}
              zoomControl={false}
              className="absolute inset-0 w-full h-full z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FlyTo center={focusPoint} />
              {mapReports.map((r) =>
                r.latitude && r.longitude ? (
                  <Marker
                    key={r.id}
                    position={[r.latitude, r.longitude]}
                    icon={markerIcon(
                      r.categoryColor ?? STATUS_COLOR[r.status] ?? '#00288e'
                    )}
                  >
                    <Popup>
                      <div className="min-w-[180px]">
                        <p
                          className="font-bold mb-xs"
                          style={{ color: r.categoryColor ?? '#00288e' }}
                        >
                          {r.category}
                        </p>
                        <p className="text-sm font-semibold mb-xs">{r.title}</p>
                        {r.address && (
                          <p className="text-xs text-gray-600">{r.address}</p>
                        )}
                        <Link
                          to={`/detail?id=${r.id}`}
                          className="block mt-sm text-primary text-xs font-bold hover:underline"
                        >
                          Lihat detail →
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ) : null
              )}
            </MapContainer>

            {/* Top floating header */}
            <div className="absolute top-md left-md right-md flex justify-between items-start gap-md z-[400] pointer-events-none">
              <div className="bg-surface/95 backdrop-blur-md px-md py-sm rounded-2xl shadow-lg border border-outline-variant pointer-events-auto">
                <p className="text-label-bold text-on-surface-variant uppercase">Peta Aduan</p>
                <p className="font-h3 text-h3 text-primary">
                  {mapReports.length} titik tervalidasi
                </p>
              </div>
              <Link
                to="/lapor"
                className="bg-error text-on-error px-md py-sm rounded-full shadow-lg flex items-center gap-xs font-button hover:scale-105 transition-transform pointer-events-auto"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Lapor Sekarang
              </Link>
            </div>

            {/* Bottom legend */}
            <div className="absolute bottom-md left-md bg-surface/95 backdrop-blur-md p-md rounded-2xl shadow-lg border border-outline-variant z-[400]">
              <h4 className="font-label-bold mb-sm text-on-surface flex items-center gap-xs">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  legend_toggle
                </span>
                Legenda Status
              </h4>
              <div className="space-y-xs">
                <Legend dot="#ba1a1a" label="Menunggu" />
                <Legend dot="#1e40af" label="Diproses" />
                <Legend dot="#1a8b4a" label="Selesai" />
              </div>
            </div>

            {focusPoint && (
              <button
                type="button"
                onClick={() => setFocusPoint(null)}
                className="absolute bottom-md right-md bg-surface px-md py-sm rounded-full shadow-lg border border-outline-variant flex items-center gap-xs font-button text-body-sm z-[400]"
              >
                <span className="material-symbols-outlined text-[18px]">my_location</span>
                Reset View
              </button>
            )}
          </section>

          {/* Feed Side */}
          <section className="w-full md:w-[440px] flex flex-col bg-surface overflow-hidden">
            <div className="p-gutter border-b border-outline-variant bg-surface-container-lowest">
              <div className="flex items-center justify-between mb-md">
                <div>
                  <h2 className="font-h2 text-h2 text-primary">Aduan Terbaru</h2>
                  <p className="text-body-sm text-on-surface-variant">
                    {loading ? 'Memuat...' : `${filteredFeed.length} laporan`}
                  </p>
                </div>
                <Link
                  to="/laporanku"
                  className="text-primary font-button text-body-sm hover:underline flex items-center gap-xs"
                >
                  Lihat semua
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>

              {/* Filter chips */}
              <div className="flex gap-xs overflow-x-auto hide-scrollbar pb-xs">
                <FilterChip
                  active={filter === 'all'}
                  onClick={() => setFilter('all')}
                  label="Semua"
                  count={counts.all ?? 0}
                />
                <FilterChip
                  active={filter === 'pending'}
                  onClick={() => setFilter('pending')}
                  label="Menunggu"
                  count={counts.pending ?? 0}
                  tone="error"
                />
                <FilterChip
                  active={filter === 'verified'}
                  onClick={() => setFilter('verified')}
                  label="Terverifikasi"
                  count={counts.verified ?? 0}
                />
                <FilterChip
                  active={filter === 'in_progress'}
                  onClick={() => setFilter('in_progress')}
                  label="Diproses"
                  count={counts.in_progress ?? 0}
                />
                <FilterChip
                  active={filter === 'resolved'}
                  onClick={() => setFilter('resolved')}
                  label="Selesai"
                  count={counts.resolved ?? 0}
                  tone="success"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar p-gutter space-y-md">
              {loading ? (
                <FeedSkeleton />
              ) : filteredFeed.length === 0 ? (
                <div className="p-lg bg-surface-container-low border border-dashed border-outline-variant rounded-2xl text-center">
                  <span className="material-symbols-outlined text-[40px] text-outline">
                    inbox
                  </span>
                  <p className="text-on-surface-variant mt-sm text-body-sm">
                    Tidak ada laporan pada filter ini
                  </p>
                </div>
              ) : (
                filteredFeed.map((r) => {
                  const meta = STATUS_META[r.status] ?? STATUS_META.pending;
                  return (
                    <article
                      key={r.id}
                      className="group bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer"
                      onClick={() => handleCardClick(r)}
                    >
                      <div className="p-md">
                        <div className="flex justify-between items-start mb-sm gap-sm">
                          <span
                            className="px-sm py-xs rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
                            style={{
                              backgroundColor: r.category?.color
                                ? `${r.category.color}20`
                                : undefined,
                              color: r.category?.color ?? undefined,
                            }}
                          >
                            {r.category?.name ?? 'Umum'}
                          </span>
                          <span className="text-[10px] text-outline font-medium whitespace-nowrap">
                            {formatRelative(r.createdAt)}
                          </span>
                        </div>
                        <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors mb-xs line-clamp-2">
                          {r.title}
                        </h4>
                        <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-md">
                          {r.description}
                        </p>
                        <div className="flex items-center justify-between pt-sm border-t border-outline-variant/40">
                          <div className="flex items-center gap-xs min-w-0 flex-1">
                            <span className="material-symbols-outlined text-[14px] text-outline">
                              location_on
                            </span>
                            <span className="text-[10px] text-outline truncate">
                              {r.address ?? r.city ?? 'Tidak dipetakan'}
                            </span>
                          </div>
                          <div
                            className={`flex items-center gap-xs ${meta.color} font-bold flex-shrink-0`}
                          >
                            <span className={`w-2 h-2 rounded-full ${meta.dot} ${
                              r.status === 'pending' ? 'animate-pulse' : ''
                            }`}></span>
                            <span className="text-[10px] uppercase">{meta.label}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between bg-surface-container-low/50 border-t border-outline-variant/40 px-md py-xs text-[10px] text-on-surface-variant">
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[12px]">visibility</span>
                          {r.viewCount}
                        </span>
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[12px]">chat_bubble</span>
                          {r.commentCount}
                        </span>
                        <Link
                          to={`/detail?id=${r.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-primary font-bold hover:underline"
                        >
                          Detail →
                        </Link>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            <div className="p-md border-t border-outline-variant bg-surface-container-lowest">
              <Link
                to="/lapor"
                className="w-full py-md bg-primary text-on-primary font-bold rounded-xl flex items-center justify-center gap-sm hover:brightness-110 transition-all shadow-lg"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Buat Laporan Baru
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Mobile FAB */}
      <Link
        to="/lapor"
        className="lg:hidden fixed bottom-20 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-90 transition-transform"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </Link>
    </div>
  );
};

const STATUS_COLOR: Record<string, string> = {
  pending: '#ba1a1a',
  verified: '#1e40af',
  in_progress: '#00288e',
  resolved: '#1a8b4a',
  rejected: '#666',
};

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <div className="flex items-center gap-sm">
      <span
        className="w-3 h-3 rounded-full ring-2 ring-white"
        style={{ backgroundColor: dot }}
      ></span>
      <span className="text-body-sm">{label}</span>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  tone?: 'error' | 'success';
}) {
  let activeStyle = 'bg-primary text-on-primary border-primary';
  if (active && tone === 'error') activeStyle = 'bg-error text-on-error border-error';
  if (active && tone === 'success') activeStyle = 'bg-[#1a8b4a] text-white border-[#1a8b4a]';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-md py-xs rounded-full text-body-sm font-button border whitespace-nowrap transition-all ${
        active
          ? activeStyle
          : 'bg-surface-container border-outline-variant text-on-surface-variant hover:border-primary'
      }`}
    >
      {label}
      <span
        className={`ml-xs text-[10px] font-bold px-xs rounded ${
          active ? 'bg-white/20' : 'bg-surface-container-high'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function FeedSkeleton() {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-surface-container-low rounded-2xl border border-outline-variant p-md space-y-sm"
        >
          <div className="flex justify-between">
            <div className="h-4 w-20 bg-surface-container-high rounded-full animate-pulse" />
            <div className="h-3 w-16 bg-surface-container-high rounded animate-pulse" />
          </div>
          <div className="h-5 bg-surface-container-high rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-surface-container-high rounded w-full animate-pulse" />
          <div className="h-3 bg-surface-container-high rounded w-5/6 animate-pulse" />
        </div>
      ))}
    </>
  );
}

export default Beranda;
