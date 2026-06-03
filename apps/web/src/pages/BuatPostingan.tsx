import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navigation from '../components/Navigation';
import { api, getCurrentLocation, getStoredUser } from '../lib/api';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type LatLng = { lat: number; lng: number };

function MapClickHandler({ onPick }: { onPick: (p: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function Recenter({ center }: { center: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo([center.lat, center.lng], 16, { duration: 0.5 });
  }, [center, map]);
  return null;
}

const CATEGORIES = [
  { slug: 'gosip', label: 'Gosip' },
  { slug: 'diskusi', label: 'Diskusi' },
  { slug: 'konspirasi', label: 'Konspirasi' },
  { slug: 'rekomendasi', label: 'Rekomendasi' },
];

const DEFAULT_CENTER: LatLng = { lat: -6.2, lng: 106.816666 };

const BuatPostingan: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('diskusi');
  const [includeLocation, setIncludeLocation] = useState(false);
  const [point, setPoint] = useState<LatLng | null>(null);
  const [address, setAddress] = useState('');
  const [locLoading, setLocLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  const center = useMemo(() => point ?? DEFAULT_CENTER, [point]);

  useEffect(() => {
    if (!getStoredUser()) {
      navigate('/masuk');
      return;
    }
    api
      .getForumCategories()
      .then(setCategories)
      .catch(() => {});
  }, [navigate]);

  const useCurrentLocation = async () => {
    setLocLoading(true);
    try {
      const loc = await getCurrentLocation();
      setPoint({ lat: loc.latitude, lng: loc.longitude });
      setAddress(loc.address ?? `${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}`);
      setIncludeLocation(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mendapatkan lokasi');
    } finally {
      setLocLoading(false);
    }
  };

  const handlePick = (p: LatLng) => {
    setPoint(p);
    setAddress(`${p.lat.toFixed(6)}, ${p.lng.toFixed(6)}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || title.length < 5) {
      setError('Judul minimal 5 karakter');
      return;
    }
    if (!content || content.length < 10) {
      setError('Konten minimal 10 karakter');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const tagsArr: string[] = [tag];
      if (includeLocation && point && address) {
        tagsArr.push(`loc:${point.lat.toFixed(5)},${point.lng.toFixed(5)}`);
      }
      const matched = categories.find((c) =>
        c.name.toLowerCase().includes(tag.toLowerCase())
      );
      const finalContent =
        includeLocation && address
          ? `${content}\n\n📍 Lokasi: ${address}`
          : content;
      await api.createForumPost({
        title,
        content: finalContent,
        categoryId: matched?.id ?? categories[0]?.id,
        tags: tagsArr,
      });
      navigate('/komunitas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim postingan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <Navigation />
      <main className="pt-20 md:pl-64 pb-xl px-gutter max-w-max-width mx-auto">
        <nav className="flex items-center gap-xs mb-lg text-on-surface-variant font-body-sm">
          <Link className="hover:text-primary transition-colors" to="/komunitas">
            Komunitas
          </Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="font-semibold text-primary">Postingan Baru</span>
        </nav>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-xl">
          <div className="xl:col-span-8 space-y-lg">
            <header>
              <h1 className="font-h1 text-h1 text-on-surface">Bagikan ke Komunitas</h1>
              <p className="font-body-md text-on-surface-variant mt-xs">
                Postingan langsung tayang tanpa verifikasi formal admin.
              </p>
            </header>

            <div className="bg-secondary-container text-on-secondary-container p-md rounded-xl flex gap-md items-start shadow-sm">
              <span className="material-symbols-outlined">info</span>
              <p className="font-body-sm">
                Untuk laporan resmi (infrastruktur, keamanan), gunakan formulir{' '}
                <Link to="/lapor" className="font-bold underline">
                  Buat Laporan
                </Link>
                .
              </p>
            </div>

            {error && (
              <p className="p-md bg-error-container text-error rounded-lg text-body-sm">
                {error}
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant space-y-lg"
            >
              <div>
                <label className="block font-label-bold text-on-surface-variant uppercase mb-sm">
                  Pilih Kategori
                </label>
                <div className="flex flex-wrap gap-sm">
                  {CATEGORIES.map((c) => (
                    <button
                      type="button"
                      key={c.slug}
                      onClick={() => setTag(c.slug)}
                      className={`px-lg py-sm rounded-full font-button border transition-colors ${
                        tag === c.slug
                          ? 'border-2 border-primary bg-primary-fixed text-on-primary-fixed shadow-sm'
                          : 'border border-outline text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-label-bold text-on-surface-variant uppercase mb-sm">
                  Judul Postingan
                </label>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-lg font-h3"
                  placeholder="Apa yang ingin Anda diskusikan?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-label-bold text-on-surface-variant uppercase mb-sm">
                  Konten
                </label>
                <textarea
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-md font-body-md"
                  rows={8}
                  placeholder="Ceritakan, beri info, atau mulai diskusi..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-sm">
                  <label className="block font-label-bold text-on-surface-variant uppercase">
                    Lokasi (opsional)
                  </label>
                  <button
                    type="button"
                    onClick={useCurrentLocation}
                    disabled={locLoading}
                    className="text-primary font-button text-body-sm flex items-center gap-xs hover:underline disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {locLoading ? 'hourglass_empty' : 'my_location'}
                    </span>
                    {locLoading ? 'Mengambil...' : 'Gunakan lokasi saya'}
                  </button>
                </div>
                <label className="flex items-center gap-sm mb-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLocation}
                    onChange={(e) => setIncludeLocation(e.target.checked)}
                  />
                  <span className="font-body-sm text-on-surface-variant">
                    Sertakan lokasi pada postingan ini
                  </span>
                </label>
                {includeLocation && (
                  <div className="relative h-56 rounded-lg overflow-hidden border border-outline-variant">
                    <MapContainer
                      center={[center.lat, center.lng]}
                      zoom={13}
                      className="absolute inset-0 w-full h-full"
                    >
                      <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <MapClickHandler onPick={handlePick} />
                      <Recenter center={point} />
                      {point && (
                        <Marker position={[point.lat, point.lng]} icon={markerIcon} />
                      )}
                    </MapContainer>
                    {address && (
                      <div className="absolute bottom-md left-md right-md bg-white/95 backdrop-blur p-sm rounded shadow flex items-center gap-sm z-[400]">
                        <span className="material-symbols-outlined text-error">location_on</span>
                        <span className="font-body-sm truncate flex-1">{address}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-lg flex flex-col md:flex-row justify-end gap-md border-t border-outline-variant">
                <Link
                  to="/komunitas"
                  className="px-xl py-md font-button text-on-surface-variant hover:bg-surface-container rounded-lg text-center"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-xl py-md font-button bg-primary text-on-primary rounded-lg shadow-lg hover:brightness-110 disabled:opacity-60"
                >
                  {submitting ? 'Mengirim...' : 'Publikasikan'}
                </button>
              </div>
            </form>
          </div>

          <aside className="xl:col-span-4 space-y-lg">
            <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant">
              <h3 className="font-h3 text-h3 text-on-surface mb-lg flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">gavel</span>
                Aturan Komunitas
              </h3>
              <ul className="space-y-md">
                <li className="flex gap-md">
                  <span className="font-label-bold text-primary bg-primary-fixed w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <p className="font-body-sm text-on-surface-variant">
                    Diskusi konstruktif dan saling menghargai. Hindari ujaran kebencian.
                  </p>
                </li>
                <li className="flex gap-md">
                  <span className="font-label-bold text-primary bg-primary-fixed w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                  <p className="font-body-sm text-on-surface-variant">
                    Jangan sebar data pribadi (PII) orang lain.
                  </p>
                </li>
                <li className="flex gap-md">
                  <span className="font-label-bold text-primary bg-primary-fixed w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    3
                  </span>
                  <p className="font-body-sm text-on-surface-variant">
                    Verifikasi info sebelum posting untuk mencegah hoaks.
                  </p>
                </li>
              </ul>
            </div>

            <div className="bg-primary text-on-primary p-lg rounded-xl shadow-lg relative overflow-hidden">
              <h4 className="font-h3 text-h3 mb-sm">Kenapa posting di sini?</h4>
              <p className="font-body-sm opacity-90">
                Postingan komunitas menjangkau ribuan warga lokal. Gerakkan tetangga atau buka
                dialog topik lokal Anda.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default BuatPostingan;
