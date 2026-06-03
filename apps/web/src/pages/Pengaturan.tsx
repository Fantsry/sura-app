import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { getStoredUser } from '../lib/api';

const Pengaturan: React.FC = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('sura_theme') ?? 'light');
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [lang, setLang] = useState('id');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!getStoredUser()) {
      navigate('/masuk');
    }
  }, [navigate]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sura_theme', theme);
    // Apply theme globally if needed
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <Navigation />
      <main className="pt-20 md:pl-64 pb-xl px-gutter max-w-screen-2xl mx-auto">
        <header className="mb-xl">
          <h1 className="font-h1 text-h1 text-on-surface mb-xs">Pengaturan</h1>
          <p className="text-on-surface-variant font-body-md">
            Sesuaikan preferensi tampilan, bahasa, dan notifikasi akun Anda.
          </p>
        </header>

        {saved && (
          <p className="p-md bg-tertiary-fixed text-on-tertiary-fixed rounded-lg mb-lg animate-fade-up">
            Pengaturan Anda berhasil disimpan!
          </p>
        )}

        <form onSubmit={handleSave} className="max-w-2xl space-y-lg">
          {/* Tampilan */}
          <section className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant/30 shadow-sm space-y-md">
            <h3 className="font-h3 text-h3 text-on-surface flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary">palette</span>
              Tampilan &amp; Tema
            </h3>
            <p className="text-body-sm text-on-surface-variant">
              Pilih tema warna aplikasi yang paling nyaman untuk mata Anda.
            </p>
            <div className="grid grid-cols-2 gap-md pt-sm">
              <label
                className={`flex flex-col items-center p-md border rounded-xl cursor-pointer transition-all ${
                  theme === 'light'
                    ? 'border-primary bg-primary-container/10'
                    : 'border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={theme === 'light'}
                  onChange={() => setTheme('light')}
                  className="sr-only"
                />
                <span className="material-symbols-outlined text-3xl text-primary mb-xs">light_mode</span>
                <span className="font-label-bold text-body-sm">Terang (Light)</span>
              </label>

              <label
                className={`flex flex-col items-center p-md border rounded-xl cursor-pointer transition-all ${
                  theme === 'dark'
                    ? 'border-primary bg-primary-container/10'
                    : 'border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={() => setTheme('dark')}
                  className="sr-only"
                />
                <span className="material-symbols-outlined text-3xl text-primary mb-xs">dark_mode</span>
                <span className="font-label-bold text-body-sm">Gelap (Dark)</span>
              </label>
            </div>
          </section>

          {/* Notifikasi */}
          <section className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant/30 shadow-sm space-y-md">
            <h3 className="font-h3 text-h3 text-on-surface flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary">notifications</span>
              Notifikasi
            </h3>
            <p className="text-body-sm text-on-surface-variant">
              Kelola bagaimana Anda menerima pemberitahuan tentang status laporan Anda.
            </p>
            <div className="space-y-md pt-sm">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-body-md text-on-surface">Notifikasi Email</p>
                  <p className="text-body-sm text-on-surface-variant">
                    Terima ringkasan update laporan via email terdaftar.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.checked)}
                  className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                />
              </label>

              <hr className="border-outline-variant/30" />

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-body-md text-on-surface">Notifikasi Push di Browser</p>
                  <p className="text-body-sm text-on-surface-variant">
                    Terima popup pemberitahuan instan saat membuka web.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={pushNotif}
                  onChange={(e) => setPushNotif(e.target.checked)}
                  className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                />
              </label>
            </div>
          </section>

          {/* Bahasa */}
          <section className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant/30 shadow-sm space-y-md">
            <h3 className="font-h3 text-h3 text-on-surface flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary">language</span>
              Bahasa
            </h3>
            <div className="space-y-sm">
              <label className="font-label-bold text-on-surface-variant uppercase text-xs">Pilih Bahasa</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full px-md py-sm border border-outline-variant rounded-lg bg-surface-container-low text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English (US)</option>
              </select>
            </div>
          </section>

          <div className="flex justify-end gap-sm">
            <button
              type="submit"
              className="px-xl py-md bg-primary text-on-primary rounded-full font-button shadow hover:scale-105 active:scale-95 transition-transform"
            >
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Pengaturan;
