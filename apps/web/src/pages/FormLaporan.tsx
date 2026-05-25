import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navigation from '../components/Navigation';
import { api, getCurrentLocation, getStoredUser } from '../lib/api';

// Fix Leaflet default icon pathing in bundlers
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
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

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { 'Accept-Language': 'id' } }
    );
    if (res.ok) {
      const data = await res.json();
      return (data.display_name as string) ?? `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  } catch {
    // ignore
  }
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

const DEFAULT_CENTER: LatLng = { lat: -6.2, lng: 106.816666 };

const FormLaporan: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [point, setPoint] = useState<LatLng | null>(null);
  const [address, setAddress] = useState('');
  const [locLoading, setLocLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const center = useMemo(() => point ?? DEFAULT_CENTER, [point]);

  const handlePick = async (p: LatLng) => {
    setPoint(p);
    setAddress('Memuat alamat...');
    const addr = await reverseGeocode(p.lat, p.lng);
    setAddress(addr);
  };

  const useCurrentLocation = async () => {
    setLocLoading(true);
    setError('');
    try {
      const loc = await getCurrentLocation();
      const next = { lat: loc.latitude, lng: loc.longitude };
      setPoint(next);
      setAddress(loc.address ?? `${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mendapatkan lokasi');
    } finally {
      setLocLoading(false);
    }
  };

  useEffect(() => {
    if (!getStoredUser()) {
      navigate('/masuk');
      return;
    }
    useCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!point) {
      setError('Lokasi wajib diisi. Klik tombol GPS atau pilih titik di peta.');
      return;
    }
    if (!categorySlug) {
      setError('Pilih kategori laporan');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.createReport({
        title,
        description,
        categorySlug,
        latitude: point.lat,
        longitude: point.lng,
        address,
        isAnonymous,
      });
      navigate('/laporanku');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim laporan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <Navigation />
      <main className="pt-20 lg:pl-64 pb-xl px-gutter max-w-max-width mx-auto">
        <nav className="flex items-center gap-xs mb-lg text-on-surface-variant font-body-sm">
          <Link className="hover:text-primary transition-colors" to="/">Beranda</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="font-semibold text-primary">Buat Laporan</span>
        </nav>

        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <div className="p-lg">
              <h1 className="font-h2 text-h2 text-on-surface mb-xs">Buat Laporan Resmi</h1>
              <p className="font-body-sm text-on-surface-variant mb-md">
                Lokasi diambil otomatis. Anda juga bisa menggeser/menentukan titik di peta.
              </p>

              {error && (
                <p className="mb-md p-sm bg-error-container text-error rounded-lg text-body-sm">
                  {error}
                </p>
              )}

              <form className="flex flex-col gap-lg" onSubmit={handleSubmit}>
                <div>
                  <label className="font-label-bold text-on-surface-variant uppercase">
                    Kategori
                  </label>
                  <select
                    className="w-full h-12 px-md border border-outline-variant rounded-lg mt-xs bg-surface-container-low"
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="bencana">Bencana Alam</option>
                    <option value="pencurian">Pencurian / Keamanan</option>
                    <option value="event">Event / Kegiatan</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="font-label-bold text-on-surface-variant uppercase">
                    Judul Laporan
                  </label>
                  <input
                    className="w-full h-12 px-md border border-outline-variant rounded-lg mt-xs bg-surface-container-low"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Pohon tumbang menutup jalan"
                    required
                  />
                </div>

                <div>
                  <label className="font-label-bold text-on-surface-variant uppercase">
                    Deskripsi
                  </label>
                  <textarea
                    className="w-full p-md border border-outline-variant rounded-lg mt-xs bg-surface-container-low"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Jelaskan detail kejadian..."
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <label className="font-label-bold text-on-surface-variant uppercase">
                      Lokasi Saat Ini
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
                      {locLoading ? 'Mengambil GPS...' : 'Gunakan lokasi saya'}
                    </button>
                  </div>

                  <div className="relative h-64 rounded-lg overflow-hidden border border-outline-variant mt-xs">
                    <MapContainer
                      center={[center.lat, center.lng]}
                      zoom={14}
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
                    <div className="absolute bottom-md left-md right-md bg-white/95 backdrop-blur p-sm rounded shadow-lg flex items-center gap-sm z-[400]">
                      <span className="material-symbols-outlined text-error">location_on</span>
                      <span className="font-body-sm truncate flex-1">
                        {address || 'Klik peta atau gunakan tombol GPS'}
                      </span>
                    </div>
                  </div>
                  <p className="text-body-sm text-outline mt-xs">
                    Tips: klik di peta untuk menggeser titik laporan.
                  </p>
                </div>

                <label className="flex items-center gap-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  <span className="font-body-sm text-on-surface-variant">
                    Laporkan secara anonim
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="h-14 bg-primary text-on-primary font-button rounded-full shadow-lg disabled:opacity-60"
                >
                  {submitting ? 'Mengirim...' : 'Kirim Aduan'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FormLaporan;
