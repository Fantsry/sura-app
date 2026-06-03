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
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type LatLng = { lat: number; lng: number };

const CATEGORY_OPTIONS: Array<{
  slug: string;
  label: string;
  icon: string;
  desc: string;
}> = [
  { slug: 'bencana', label: 'Bencana / Lingkungan', icon: 'storm', desc: 'Banjir, longsor, kebakaran' },
  { slug: 'pencurian', label: 'Keamanan', icon: 'security', desc: 'Kriminalitas, pencurian' },
  { slug: 'event', label: 'Sosial / Event', icon: 'groups', desc: 'Kegiatan, gotong royong' },
  { slug: 'lainnya', label: 'Lainnya', icon: 'help_outline', desc: 'Kategori umum' },
];

const PRIORITY_OPTIONS: Array<{ key: string; label: string; tone: string }> = [
  { key: 'low', label: 'Rendah', tone: 'bg-surface-container text-on-surface-variant' },
  { key: 'medium', label: 'Sedang', tone: 'bg-secondary-container text-on-secondary-container' },
  { key: 'high', label: 'Tinggi', tone: 'bg-error-container text-error' },
  { key: 'urgent', label: 'Mendesak', tone: 'bg-error text-on-error' },
];

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
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [point, setPoint] = useState<LatLng | null>(null);
  const [address, setAddress] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');
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

  const handleGetCurrentLocation = async () => {
    setLocLoading(true);
    setError('');
    try {
      const loc = await getCurrentLocation();
      setPoint({ lat: loc.latitude, lng: loc.longitude });
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
    const timer = setTimeout(() => {
      handleGetCurrentLocation();
    }, 0);
    return () => clearTimeout(timer);
  }, [navigate]);

  const addImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    if (!/^https?:\/\//.test(url)) {
      setError('URL gambar harus diawali dengan http(s)://');
      return;
    }
    setImageUrls((prev) => [...prev, url].slice(0, 5));
    setImageInput('');
    setError('');
  };

  const removeImage = (i: number) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== i));
  };

  const canProceedToStep2 = !!categorySlug && title.length >= 5 && description.length >= 10;
  const canProceedToStep3 = !!point;

  const handleSubmit = async () => {
    if (!point) {
      setError('Lokasi wajib diisi.');
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
        imageUrls,
        isAnonymous,
        priority,
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
      <main className="pt-20 md:pl-64 pb-xl px-gutter max-w-max-width mx-auto">
        <nav className="flex items-center gap-xs mb-lg text-on-surface-variant text-body-sm">
          <Link className="hover:text-primary transition-colors" to="/">
            Beranda
          </Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="font-semibold text-primary">Buat Laporan</span>
        </nav>

        {/* Stepper */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md mb-lg shadow-sm">
          <div className="flex items-center justify-between gap-sm">
            <Step n={1} label="Detail Laporan" active={step === 1} done={step > 1} />
            <div className="flex-1 h-1 bg-outline-variant rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: step >= 2 ? '100%' : '0%' }}
              />
            </div>
            <Step n={2} label="Lokasi" active={step === 2} done={step > 2} />
            <div className="flex-1 h-1 bg-outline-variant rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: step >= 3 ? '100%' : '0%' }}
              />
            </div>
            <Step n={3} label="Lampiran" active={step === 3} done={false} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
          <div className="lg:col-span-8">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
              <div className="p-lg border-b border-outline-variant">
                <h1 className="font-h2 text-h2 text-on-surface">
                  {step === 1
                    ? 'Detail Laporan'
                    : step === 2
                      ? 'Tentukan Lokasi'
                      : 'Lampiran & Konfirmasi'}
                </h1>
                <p className="text-body-sm text-on-surface-variant mt-xs">
                  {step === 1
                    ? 'Pilih kategori dan jelaskan detail kejadian.'
                    : step === 2
                      ? 'Tap di peta atau gunakan GPS untuk titik kejadian.'
                      : 'Tambah foto pendukung lalu kirim laporan.'}
                </p>
              </div>

              {error && (
                <div className="mx-lg mt-lg p-md bg-error-container text-error rounded-xl flex items-start gap-sm">
                  <span className="material-symbols-outlined">error</span>
                  <p className="text-body-sm">{error}</p>
                </div>
              )}

              {/* Step 1: Detail */}
              {step === 1 && (
                <div className="p-lg space-y-lg animate-fade-up">
                  <div>
                    <label className="font-label-bold text-on-surface-variant uppercase block mb-sm">
                      Kategori
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                      {CATEGORY_OPTIONS.map((c) => {
                        const active = categorySlug === c.slug;
                        return (
                          <button
                            key={c.slug}
                            type="button"
                            onClick={() => setCategorySlug(c.slug)}
                            className={`text-left p-md rounded-xl border-2 transition-all ${
                              active
                                ? 'border-primary bg-primary-fixed/40'
                                : 'border-outline-variant bg-surface-container-low hover:border-primary/40'
                            }`}
                          >
                            <div className="flex items-start gap-sm">
                              <span
                                className={`material-symbols-outlined ${
                                  active ? 'text-primary' : 'text-on-surface-variant'
                                }`}
                              >
                                {c.icon}
                              </span>
                              <div className="flex-1">
                                <p className="font-bold text-on-surface">{c.label}</p>
                                <p className="text-body-sm text-on-surface-variant">
                                  {c.desc}
                                </p>
                              </div>
                              {active && (
                                <span className="material-symbols-outlined text-primary">
                                  check_circle
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Field label="Judul Laporan">
                    <input
                      className="w-full px-md py-md bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="Contoh: Pohon tumbang menutup jalan utama"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={120}
                    />
                    <p className="text-[10px] text-outline mt-xs">
                      {title.length}/120 — minimal 5 karakter
                    </p>
                  </Field>

                  <Field label="Deskripsi Kejadian">
                    <textarea
                      className="w-full p-md bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      rows={5}
                      placeholder="Jelaskan kapan, di mana, dan bagaimana kejadiannya..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <p className="text-[10px] text-outline mt-xs">
                      {description.length} karakter — minimal 10 karakter
                    </p>
                  </Field>

                  <div>
                    <label className="font-label-bold text-on-surface-variant uppercase block mb-sm">
                      Tingkat Prioritas
                    </label>
                    <div className="flex flex-wrap gap-sm">
                      {PRIORITY_OPTIONS.map((p) => (
                        <button
                          key={p.key}
                          type="button"
                          onClick={() => setPriority(p.key)}
                          className={`px-md py-sm rounded-full font-button text-body-sm border-2 transition-all ${
                            priority === p.key
                              ? `${p.tone} border-current`
                              : 'bg-surface-container-low border-outline-variant text-on-surface-variant'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center gap-sm cursor-pointer p-md bg-surface-container-low rounded-xl border border-outline-variant">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-5 h-5 rounded text-primary"
                    />
                    <div>
                      <p className="font-bold text-on-surface">Laporkan secara anonim</p>
                      <p className="text-body-sm text-on-surface-variant">
                        Nama Anda tidak akan ditampilkan kepada publik.
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Step 2: Location */}
              {step === 2 && (
                <div className="p-lg space-y-md animate-fade-up">
                  <div className="flex justify-between items-center flex-wrap gap-sm">
                    <p className="text-body-sm text-on-surface-variant">
                      Lokasi otomatis terambil dari GPS. Tap di peta untuk titik manual.
                    </p>
                    <button
                      type="button"
                      onClick={handleGetCurrentLocation}
                      disabled={locLoading}
                      className="text-primary font-button text-body-sm flex items-center gap-xs hover:underline disabled:opacity-60"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {locLoading ? 'hourglass_empty' : 'my_location'}
                      </span>
                      {locLoading ? 'Mengambil GPS...' : 'Gunakan lokasi saya'}
                    </button>
                  </div>

                  <div className="relative h-[420px] rounded-2xl overflow-hidden border border-outline-variant">
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
                    <div className="absolute bottom-md left-md right-md bg-white/95 backdrop-blur-md p-md rounded-xl shadow-lg flex items-start gap-sm z-[400]">
                      <span className="material-symbols-outlined text-error mt-xs">
                        location_on
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-label-bold text-on-surface-variant">Alamat</p>
                        <p className="font-body-sm text-on-surface line-clamp-2">
                          {address || 'Klik peta atau gunakan GPS'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-body-sm text-outline">
                    💡 Tip: Tap area di peta untuk menggeser titik laporan.
                  </p>
                </div>
              )}

              {/* Step 3: Attachments + summary */}
              {step === 3 && (
                <div className="p-lg space-y-lg animate-fade-up">
                  <div>
                    <label className="font-label-bold text-on-surface-variant uppercase block mb-sm">
                      Foto Pendukung (URL, max 5)
                    </label>
                    <div className="flex gap-sm">
                      <input
                        className="flex-1 px-md py-md bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        placeholder="https://contoh.com/foto.jpg"
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addImage();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={addImage}
                        disabled={imageUrls.length >= 5}
                        className="px-md py-md bg-primary text-on-primary rounded-xl font-button hover:brightness-110 disabled:opacity-50"
                      >
                        Tambah
                      </button>
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-xs">
                      {imageUrls.length}/5 foto
                    </p>

                    {imageUrls.length > 0 && (
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-sm mt-md">
                        {imageUrls.map((url, i) => (
                          <div
                            key={i}
                            className="relative aspect-square rounded-xl overflow-hidden border border-outline-variant"
                          >
                            <img
                              src={url}
                              alt={`Lampiran ${i + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display =
                                  'none';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute top-1 right-1 bg-error text-on-error w-7 h-7 rounded-full flex items-center justify-center"
                              aria-label="Hapus"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                close
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md">
                    <h3 className="font-h3 text-h3 text-on-surface mb-md">Ringkasan</h3>
                    <SummaryRow icon="category" label="Kategori" value={categorySlug || '-'} />
                    <SummaryRow icon="title" label="Judul" value={title || '-'} />
                    <SummaryRow icon="priority_high" label="Prioritas" value={priority} />
                    <SummaryRow icon="location_on" label="Lokasi" value={address || '-'} />
                    <SummaryRow
                      icon="image"
                      label="Foto"
                      value={`${imageUrls.length} lampiran`}
                    />
                    <SummaryRow
                      icon="visibility_off"
                      label="Anonim"
                      value={isAnonymous ? 'Ya' : 'Tidak'}
                    />
                  </div>
                </div>
              )}

              {/* Footer nav */}
              <div className="border-t border-outline-variant p-lg flex justify-between items-center">
                <button
                  type="button"
                  disabled={step === 1}
                  onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))}
                  className="px-md py-sm text-on-surface-variant font-button hover:bg-surface-container rounded-lg disabled:opacity-30"
                >
                  ← Kembali
                </button>

                {step < 3 ? (
                  <button
                    type="button"
                    disabled={(step === 1 && !canProceedToStep2) || (step === 2 && !canProceedToStep3)}
                    onClick={() =>
                      setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s))
                    }
                    className="px-lg py-md bg-primary text-on-primary font-button rounded-xl shadow disabled:opacity-50 hover:brightness-110"
                  >
                    Lanjut →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-lg py-md bg-primary text-on-primary font-button rounded-xl shadow-lg disabled:opacity-60 hover:brightness-110"
                  >
                    {submitting ? 'Mengirim...' : '🚀 Kirim Laporan'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Helper sidebar */}
          <aside className="lg:col-span-4 space-y-lg">
            <div className="bg-primary-container text-on-primary-container rounded-2xl p-lg shadow-sm">
              <div className="flex items-center gap-sm mb-sm">
                <span className="material-symbols-outlined">tips_and_updates</span>
                <h3 className="font-h3 text-h3">Tips Laporan Efektif</h3>
              </div>
              <ul className="space-y-sm text-body-sm">
                <li className="flex gap-sm">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Sertakan foto bukti yang jelas.</span>
                </li>
                <li className="flex gap-sm">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Tandai lokasi setepat mungkin.</span>
                </li>
                <li className="flex gap-sm">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Deskripsi: kapan & dampaknya.</span>
                </li>
              </ul>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm">
              <h3 className="font-h3 text-h3 text-on-surface mb-sm flex items-center gap-sm">
                <span className="material-symbols-outlined text-error">priority_high</span>
                Darurat?
              </h3>
              <p className="text-body-sm text-on-surface-variant mb-md">
                Untuk situasi mengancam jiwa, hubungi 112 atau pihak berwenang langsung.
              </p>
              <a
                href="tel:112"
                className="block w-full py-md bg-error text-on-error font-button rounded-xl text-center hover:brightness-110"
              >
                📞 Hubungi 112
              </a>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

function Step({
  n,
  label,
  active,
  done,
}: {
  n: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-sm">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold transition-all ${
          done
            ? 'bg-primary text-on-primary'
            : active
              ? 'bg-primary text-on-primary ring-4 ring-primary-fixed'
              : 'bg-surface-container-high text-on-surface-variant'
        }`}
      >
        {done ? <span className="material-symbols-outlined text-[18px]">check</span> : n}
      </div>
      <span
        className={`hidden md:block font-button text-body-sm ${
          active || done ? 'text-on-surface' : 'text-on-surface-variant'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="font-label-bold text-on-surface-variant uppercase block mb-sm">
        {label}
      </label>
      {children}
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-md py-sm border-b border-outline-variant last:border-0">
      <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
      <span className="text-on-surface-variant text-body-sm w-24">{label}</span>
      <span className="font-body-md text-on-surface flex-1 line-clamp-2">{value}</span>
    </div>
  );
}

export default FormLaporan;
