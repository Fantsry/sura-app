import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navigation from '../components/Navigation';
import {
  api,
  formatDateTime,
  getStoredUser,
  STATUS_META,
  type Report,
  type ReportComment,
} from '../lib/api';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const TIMELINE: Array<{ key: string; label: string }> = [
  { key: 'pending', label: 'DILAPORKAN' },
  { key: 'verified', label: 'DIVERIFIKASI' },
  { key: 'in_progress', label: 'DITINDAKLANJUTI' },
  { key: 'resolved', label: 'SELESAI' },
];

const DetailAduan: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const id = params.get('id');

  const [report, setReport] = useState<Report | null>(null);
  const [comments, setComments] = useState<ReportComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reply, setReply] = useState('');
  const [posting, setPosting] = useState(false);
  const [liked, setLiked] = useState(false);

  const me = getStoredUser();

  const handleLike = async () => {
    if (!id) return;
    if (!me) {
      navigate('/masuk');
      return;
    }
    if (liked) return;
    try {
      const res = await api.likeReport(id);
      setReport((prev) => prev ? { ...prev, likeCount: res.likeCount } : null);
      setLiked(true);
    } catch (err) {
      console.error('Gagal menyukai aduan:', err);
    }
  };

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const [r, cs] = await Promise.all([
        api.getReport(id),
        api.getReportComments(id).catch(() => []),
      ]);
      setReport(r);
      setComments(cs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Laporan tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }
    const timer = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !id) return;
    if (!me) {
      navigate('/masuk');
      return;
    }
    setPosting(true);
    try {
      await api.postReportComment(id, reply.trim());
      setReply('');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim komentar');
    } finally {
      setPosting(false);
    }
  };

  const handleAdminAction = async (status: string) => {
    if (!id) return;
    try {
      await api.admin.updateReportStatus(id, status);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal update status');
    }
  };

  const isAdmin = me && (me.role === 'admin' || me.role === 'moderator');

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <Navigation />
        <main className={`pt-20 px-gutter py-xl ${me ? 'md:pl-64' : ''}`}>
          <p className="text-on-surface-variant">Memuat detail laporan...</p>
        </main>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="bg-background min-h-screen">
        <Navigation />
        <main className={`pt-20 px-gutter py-xl ${me ? 'md:pl-64' : ''}`}>
          <p className="p-md bg-error-container text-error rounded-lg">
            {error || 'Laporan tidak ditemukan'}
          </p>
          <Link to="/" className="mt-md inline-block text-primary font-button">
            ← Kembali ke Beranda
          </Link>
        </main>
      </div>
    );
  }

  const meta = STATUS_META[report.status] ?? STATUS_META.pending;
  const currentStep = TIMELINE.findIndex((t) => t.key === report.status);
  const reachedSteps =
    report.status === 'rejected'
      ? 1
      : report.status === 'resolved'
        ? TIMELINE.length
        : currentStep + 1;

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <Navigation />
      <main className={`pt-20 pb-xl ${me ? 'md:pl-64' : ''}`}>
        <div className="max-w-[1280px] mx-auto px-gutter py-md">
          <nav className="flex items-center gap-xs mb-lg text-on-surface-variant font-body-sm">
            <Link className="hover:text-primary transition-colors" to="/">
              Beranda
            </Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-semibold text-primary line-clamp-1 max-w-md">
              {report.title}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
            <div className="lg:col-span-8 space-y-xl">
              <section className="bg-surface-container-lowest rounded-xl p-xl shadow-sm border border-outline-variant/30">
                <div className="flex flex-wrap justify-between items-start gap-sm mb-md">
                  <span
                    className={`px-md py-xs rounded-full font-label-bold uppercase ${meta.bg} ${meta.color}`}
                  >
                    {meta.label}
                  </span>
                  <p className="text-on-surface-variant font-label-bold">
                    ID: #{report.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>

                <h2 className="font-h1 text-h1 text-on-surface mb-md">{report.title}</h2>
                <p className="text-on-surface-variant font-body-lg whitespace-pre-line mb-xl">
                  {report.description}
                </p>

                {report.imageUrls && report.imageUrls.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-xl">
                    {report.imageUrls.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Lampiran ${i + 1}`}
                        className="w-full aspect-video object-cover rounded-xl"
                      />
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <InfoRow
                    icon="calendar_today"
                    label="Dilaporkan Pada"
                    value={formatDateTime(report.createdAt)}
                  />
                  <InfoRow
                    icon="location_on"
                    label="Lokasi"
                    value={report.address ?? `${report.latitude}, ${report.longitude}`}
                  />
                  <InfoRow
                    icon="category"
                    label="Kategori"
                    value={report.category?.name ?? 'Umum'}
                  />
                  <InfoRow
                    icon="person"
                    label="Pelapor"
                    value={
                      report.isAnonymous
                        ? 'Anonim'
                        : (report.author?.fullName ?? 'Tidak diketahui')
                    }
                  />
                </div>

                <div className="flex items-center gap-md mt-lg pt-md border-t border-outline-variant/30 text-body-sm text-on-surface-variant">
                  <button
                    type="button"
                    onClick={handleLike}
                    className={`flex items-center gap-xs px-md py-sm rounded-full transition-colors font-semibold ${
                      liked 
                        ? 'bg-primary-container text-primary' 
                        : 'hover:bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {liked ? 'thumb_up_filled' : 'thumb_up'}
                    </span>
                    <span>{report.likeCount} Suka</span>
                  </button>
                  <span className="flex items-center gap-xs px-md py-sm">
                    <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                    <span>{comments.length} Komentar</span>
                  </span>
                  <span className="flex items-center gap-xs px-md py-sm">
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                    <span>{report.viewCount} Dilihat</span>
                  </span>
                </div>

                {isAdmin && report.status !== 'resolved' && report.status !== 'rejected' && (
                  <div className="mt-xl pt-lg border-t border-outline-variant flex flex-wrap gap-sm">
                    {report.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAdminAction('verified')}
                          className="px-lg py-md bg-primary text-on-primary rounded-lg font-button"
                        >
                          Verifikasi
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdminAction('rejected')}
                          className="px-lg py-md bg-error text-on-error rounded-lg font-button"
                        >
                          Tolak
                        </button>
                      </>
                    )}
                    {report.status === 'verified' && (
                      <button
                        type="button"
                        onClick={() => handleAdminAction('in_progress')}
                        className="px-lg py-md bg-primary text-on-primary rounded-lg font-button"
                      >
                        Mulai Proses
                      </button>
                    )}
                    {report.status === 'in_progress' && (
                      <button
                        type="button"
                        onClick={() => handleAdminAction('resolved')}
                        className="px-lg py-md text-white rounded-lg font-button"
                        style={{ background: '#1a8b4a' }}
                      >
                        Tandai Selesai
                      </button>
                    )}
                  </div>
                )}
              </section>

              <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
                <div className="p-lg border-b border-outline-variant/20 bg-surface-container-low">
                  <h3 className="font-h3 text-h3 text-on-surface">Diskusi & Tanggapan</h3>
                  <p className="text-body-sm text-on-surface-variant mt-xs">
                    {comments.length} komentar
                  </p>
                </div>
                <div className="p-lg space-y-lg max-h-[400px] overflow-y-auto bg-surface-container-lowest">
                  {comments.length === 0 ? (
                    <p className="text-on-surface-variant text-body-sm py-md text-center">
                      Belum ada tanggapan. Jadilah yang pertama memberikan komentar.
                    </p>
                  ) : (
                    comments.map((c) => {
                      const isAdminMsg =
                        c.isOfficial ||
                        c.author?.role === 'admin' ||
                        c.author?.role === 'moderator';
                      const isMe = me && c.author?.id === me.id;
                      return (
                        <div
                          key={c.id}
                          className={`flex gap-md max-w-[85%] ${
                            isMe ? 'ml-auto flex-row-reverse' : ''
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold ${
                              isAdminMsg
                                ? 'bg-primary text-on-primary'
                                : 'bg-secondary text-on-secondary'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {isAdminMsg ? 'shield_person' : 'person'}
                            </span>
                          </div>
                          <div
                            className={`p-md rounded-xl ${
                              isMe
                                ? 'bg-primary-container text-on-primary-container rounded-tr-none'
                                : 'bg-surface-container-high rounded-tl-none'
                            }`}
                          >
                            <p
                              className={`font-label-bold mb-xs ${
                                isAdminMsg ? 'text-primary' : 'text-on-surface'
                              }`}
                            >
                              {c.author?.fullName ?? 'Pengguna'}
                              {isAdminMsg && ' • Admin'}
                            </p>
                            <p
                              className={`font-body-md whitespace-pre-line ${
                                isMe ? '' : 'text-on-surface-variant'
                              }`}
                            >
                              {c.content}
                            </p>
                            <p
                              className={`text-right text-[10px] mt-sm ${
                                isMe ? 'opacity-70' : 'text-outline'
                              }`}
                            >
                              {formatDateTime(c.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="p-lg border-t border-outline-variant/20 flex gap-md items-center"
                >
                  <input
                    className="flex-1 bg-surface-container px-md py-sm rounded-lg border-none focus:ring-2 focus:ring-primary/20 outline-none text-body-md"
                    placeholder={me ? 'Tulis tanggapan Anda...' : 'Masuk untuk berkomentar'}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    disabled={!me || posting}
                  />
                  <button
                    type="submit"
                    disabled={!me || posting || !reply.trim()}
                    className="bg-primary text-on-primary p-md rounded-lg flex items-center justify-center hover:shadow-lg transition-all active:scale-95 disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </form>
              </section>
            </div>

            <div className="lg:col-span-4 space-y-xl">
              <section className="bg-surface-container-lowest rounded-xl p-xl shadow-sm border border-outline-variant/30">
                <h3 className="font-h3 text-h3 text-on-surface mb-xl">Riwayat Status</h3>
                {report.status === 'rejected' ? (
                  <div className="p-md bg-error-container text-error rounded-lg">
                    Laporan ditolak oleh moderator.
                  </div>
                ) : (
                  <div className="relative pl-md">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-outline-variant"></div>
                    {TIMELINE.map((t, i) => {
                      const reached = i < reachedSteps;
                      const isCurrent = i === reachedSteps - 1;
                      return (
                        <div
                          key={t.key}
                          className={`relative pb-xl pl-xl ${reached ? '' : 'opacity-40'}`}
                        >
                          <div
                            className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${
                              reached
                                ? 'bg-primary ring-4 ring-primary-container/20'
                                : 'bg-outline-variant'
                            }`}
                          ></div>
                          <p
                            className={`font-label-bold ${
                              isCurrent ? 'text-primary' : 'text-on-surface'
                            }`}
                          >
                            {t.label}
                          </p>
                          {i === 0 && (
                            <p className="text-on-surface-variant text-body-sm">
                              {formatDateTime(report.createdAt)}
                            </p>
                          )}
                          {t.key === 'resolved' && report.resolvedAt && (
                            <p className="text-on-surface-variant text-body-sm">
                              {formatDateTime(report.resolvedAt)}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {report.latitude && report.longitude && (
                <section className="bg-surface-container-lowest rounded-xl p-xl shadow-sm border border-outline-variant/30">
                  <h3 className="font-h3 text-h3 text-on-surface mb-md">Peta Lokasi</h3>
                  <div className="rounded-lg overflow-hidden h-64 bg-surface-container-high relative">
                    <MapContainer
                      center={[report.latitude, report.longitude]}
                      zoom={15}
                      className="absolute inset-0 w-full h-full"
                    >
                      <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[report.latitude, report.longitude]} icon={markerIcon} />
                    </MapContainer>
                  </div>
                  <div className="mt-md">
                    <p className="font-body-sm text-on-surface-variant italic break-all">
                      Koordinat: {report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}
                    </p>
                    <a
                      href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-sm w-full py-sm border border-primary text-primary rounded-lg font-button hover:bg-surface-container-high transition-colors flex items-center justify-center gap-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">map</span>
                      Buka di Google Maps
                    </a>
                  </div>
                </section>
              )}

              <section className="bg-primary-container text-on-primary-container rounded-xl p-xl shadow-md">
                <div className="flex items-center gap-md mb-md">
                  <span className="material-symbols-outlined">support_agent</span>
                  <h3 className="font-h3 text-h3">Butuh Bantuan?</h3>
                </div>
                <p className="font-body-sm mb-lg opacity-90">
                  Hubungi petugas operator jika ada situasi yang mengancam keselamatan.
                </p>
                <a
                  href="tel:112"
                  className="w-full bg-surface text-primary py-md rounded-lg font-button flex items-center justify-center gap-sm shadow-sm active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined">call</span>
                  Hubungi 112
                </a>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-md p-md bg-surface-container-low rounded-lg border border-outline-variant/20">
      <span className="material-symbols-outlined text-primary">{icon}</span>
      <div className="min-w-0">
        <p className="font-label-bold text-on-surface-variant">{label}</p>
        <p className="font-body-md text-on-surface line-clamp-1">{value}</p>
      </div>
    </div>
  );
}

export default DetailAduan;
