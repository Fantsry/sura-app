import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { api, getCurrentLocation, getStoredUser } from '../lib/api';

const FormLaporan: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState('');
  const [locLoading, setLocLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadLocation = async () => {
    setLocLoading(true);
    setError('');
    try {
      const loc = await getCurrentLocation();
      setLatitude(loc.latitude);
      setLongitude(loc.longitude);
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
    loadLocation();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!latitude || !longitude) {
      setError('Lokasi wajib diisi. Klik tombol lokasi saat ini.');
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
        latitude,
        longitude,
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

  const mapUrl =
    latitude && longitude
      ? `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=15&size=400x200&markers=${latitude},${longitude},red`
      : null;

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
              {error && <p className="mb-md p-sm bg-error-container text-error rounded-lg text-body-sm">{error}</p>}
              <form className="flex flex-col gap-lg" onSubmit={handleSubmit}>
                <div>
                  <label className="font-label-bold text-on-surface-variant">KATEGORI</label>
                  <select className="w-full h-12 px-md border border-outline-variant rounded-lg mt-xs" value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} required>
                    <option value="">Pilih Kategori</option>
                    <option value="bencana">Bencana Alam</option>
                    <option value="pencurian">Pencurian</option>
                    <option value="event">Event</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="font-label-bold text-on-surface-variant">JUDUL LAPORAN</label>
                  <input className="w-full h-12 px-md border border-outline-variant rounded-lg mt-xs" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Pohon tumbang" required />
                </div>
                <div>
                  <label className="font-label-bold text-on-surface-variant">DESKRIPSI</label>
                  <textarea className="w-full p-md border border-outline-variant rounded-lg mt-xs" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div>
                  <label className="font-label-bold text-on-surface-variant">LOKASI SAAT INI</label>
                  <div className="relative h-48 rounded-lg overflow-hidden border border-outline-variant mt-xs">
                    {mapUrl ? <img src={mapUrl} alt="Peta lokasi" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-surface-container-low text-outline">Menunggu lokasi...</div>}
                    <button type="button" onClick={loadLocation} disabled={locLoading} className="absolute top-sm right-sm bg-surface p-xs rounded-full shadow-md text-primary">
                      <span className="material-symbols-outlined">{locLoading ? 'hourglass_empty' : 'my_location'}</span>
                    </button>
                    <div className="absolute bottom-md left-md right-md bg-white p-sm rounded shadow-lg flex items-center gap-sm">
                      <span className="material-symbols-outlined text-error text-md">location_on</span>
                      <span className="font-body-sm truncate">{address || 'Klik ikon untuk ambil lokasi'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-sm">
                  <input type="checkbox" id="anonim" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
                  <label htmlFor="anonim" className="font-body-sm text-on-surface-variant">Laporkan secara anonim</label>
                </div>
                <button type="submit" disabled={submitting} className="h-14 bg-primary text-on-primary font-button rounded-full shadow-lg disabled:opacity-60">
                  {submitting ? 'Mengirim...' : 'Kirim Aduan'}
                </button>
              </form>
            </div>
        </div>
      </main>
    </div>
  );
};

export default FormLaporan;
