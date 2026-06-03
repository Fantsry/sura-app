import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setAuth, getStoredUser } from '../lib/api';

const Masuk: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      navigate(user.role === 'admin' || user.role === 'moderator' ? '/admin' : '/');
    }
  }, [navigate]);

  // login fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // register fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fillDemo = (type: 'admin' | 'user') => {
    setMode('login');
    setIdentifier(type === 'admin' ? 'admin@sura.app' : 'warga@sura.app');
    setPassword(type === 'admin' ? 'admin123' : 'user123');
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await api.login(identifier, password);
      setAuth(token, user);
      navigate(user.role === 'admin' || user.role === 'moderator' ? '/admin' : '/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter');
      return;
    }
    setLoading(true);
    try {
      const { token, user } = await api.register({
        username,
        email,
        password,
        fullName,
        phoneNumber: phone || undefined,
      });
      setAuth(token, user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Brand panel */}
      <aside className="hidden lg:flex bg-gradient-to-br from-primary via-primary-container to-primary-fixed-dim text-on-primary p-xl flex-col justify-between relative overflow-hidden w-full">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white blur-3xl"
            aria-hidden="true"
          ></div>
          <div
            className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl"
            aria-hidden="true"
          ></div>
        </div>

        <div className="relative w-full">
          <div className="flex items-center gap-md mb-xl">
            <div className="w-14 h-14 rounded-2xl bg-white text-primary flex items-center justify-center shadow-2xl">
              <span className="material-symbols-outlined text-4xl">campaign</span>
            </div>
            <div>
              <h2 className="font-h1 text-h1 font-bold">Sura</h2>
              <p className="text-body-sm opacity-90">Suara Rakyat Terpercaya</p>
            </div>
          </div>
        </div>

        <div className="relative space-y-lg w-full">
          <h1 className="font-h1 text-[40px] leading-tight font-extrabold max-w-md">
            Bersama mengawal lingkungan kita.
          </h1>
          <p className="text-body-lg opacity-90 max-w-md">
            Lapor masalah, lihat tindak lanjut, dan diskusikan dengan komunitas — semua di
            satu portal warga yang transparan.
          </p>

          <div className="grid grid-cols-3 gap-md max-w-md mt-xl">
            <Stat number="1.2K+" label="Laporan" />
            <Stat number="94%" label="Selesai" />
            <Stat number="42m" label="Respon" />
          </div>
        </div>

        <div className="relative text-body-sm opacity-75 w-full">
          © 2026 Sura — Verified Official Portal.
        </div>
      </aside>

      {/* Right: Form panel */}
      <main className="flex items-center justify-center p-gutter w-full">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="lg:hidden flex items-center gap-sm mb-xl text-primary"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Kembali ke Beranda
          </Link>

          <div className="lg:hidden flex items-center gap-sm mb-lg">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary">campaign</span>
            </div>
            <span className="font-h2 text-h2 font-bold text-primary">Sura</span>
          </div>

          {/* Tabs */}
          <div className="flex bg-surface-container-low p-1 rounded-full mb-lg">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-sm rounded-full font-button text-body-sm transition-all ${
                mode === 'login'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`flex-1 py-sm rounded-full font-button text-body-sm transition-all ${
                mode === 'register'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant'
              }`}
            >
              Daftar
            </button>
          </div>

          {mode === 'login' ? (
            <>
              <h1 className="font-h1 text-h1 text-on-surface mb-xs">Selamat Datang Kembali</h1>
              <p className="text-on-surface-variant mb-lg">
                Masuk untuk melanjutkan pelaporan dan diskusi.
              </p>

              {error && (
                <div className="mb-md p-md bg-error-container text-error rounded-xl flex items-start gap-sm">
                  <span className="material-symbols-outlined">error</span>
                  <p className="text-body-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-md">
                <Field label="Email atau Username" icon="alternate_email">
                  <input
                    className="w-full pl-12 pr-4 py-md bg-surface-container-low text-on-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="admin@sura.app"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </Field>

                <PasswordField
                  value={password}
                  onChange={setPassword}
                  show={showPassword}
                  onToggle={() => setShowPassword((v) => !v)}
                  placeholder="••••••••"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-md bg-primary text-on-primary font-button rounded-xl shadow-lg hover:brightness-110 active:scale-[0.99] disabled:opacity-60 transition-all"
                >
                  {loading ? 'Memproses...' : 'Masuk Sekarang'}
                </button>
              </form>

              <div className="mt-lg pt-lg border-t border-outline-variant">
                <p className="text-body-sm text-on-surface-variant mb-sm">Akun Demo:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                  <button
                    type="button"
                    onClick={() => fillDemo('admin')}
                    className="w-full flex flex-col items-start p-md bg-surface-container-low border border-outline-variant rounded-xl hover:border-primary transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-primary mb-xs">
                      admin_panel_settings
                    </span>
                    <span className="font-bold text-on-surface">Admin</span>
                    <span className="text-body-sm text-on-surface-variant">
                      admin@sura.app
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemo('user')}
                    className="w-full flex flex-col items-start p-md bg-surface-container-low border border-outline-variant rounded-xl hover:border-primary transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-primary mb-xs">
                      person
                    </span>
                    <span className="font-bold text-on-surface">Warga</span>
                    <span className="text-body-sm text-on-surface-variant">
                      warga@sura.app
                    </span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="font-h1 text-h1 text-on-surface mb-xs">Buat Akun Sura</h1>
              <p className="text-on-surface-variant mb-lg">
                Bergabunglah untuk melaporkan dan ikut berdiskusi.
              </p>

              {error && (
                <div className="mb-md p-md bg-error-container text-error rounded-xl flex items-start gap-sm">
                  <span className="material-symbols-outlined">error</span>
                  <p className="text-body-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-md">
                <Field label="Nama Lengkap" icon="badge">
                  <input
                    className="w-full pl-12 pr-4 py-md bg-surface-container-low text-on-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Budi Santoso"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    minLength={2}
                  />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <Field label="Username" icon="alternate_email">
                    <input
                      className="w-full pl-12 pr-4 py-md bg-surface-container-low text-on-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      placeholder="budi"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      minLength={3}
                    />
                  </Field>
                  <Field label="No. Telepon" icon="phone">
                    <input
                      className="w-full pl-12 pr-4 py-md bg-surface-container-low text-on-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      placeholder="0812xxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </Field>
                </div>
                <Field label="Email" icon="mail">
                  <input
                    type="email"
                    className="w-full pl-12 pr-4 py-md bg-surface-container-low text-on-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="anda@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field>
                <PasswordField
                  value={password}
                  onChange={setPassword}
                  show={showPassword}
                  onToggle={() => setShowPassword((v) => !v)}
                  placeholder="Min. 6 karakter"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-md bg-primary text-on-primary font-button rounded-xl shadow-lg hover:brightness-110 active:scale-[0.99] disabled:opacity-60 transition-all"
                >
                  {loading ? 'Memproses...' : 'Daftar Sekarang'}
                </button>
              </form>
            </>
          )}

          <p className="mt-lg text-center">
            <Link className="text-primary font-bold hover:underline" to="/">
              ← Kembali ke Beranda
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-xs">
      <label className="font-label-bold text-on-surface-variant uppercase">{label}</label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}

function PasswordField({
  value,
  onChange,
  show,
  onToggle,
  placeholder,
}: {
  value: string;
  onChange: (s: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-xs">
      <label className="font-label-bold text-on-surface-variant uppercase">Kata Sandi</label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
          lock
        </span>
        <input
          className="w-full pl-12 pr-12 py-md bg-surface-container-low text-on-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          placeholder={placeholder}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
          aria-label={show ? 'Sembunyikan' : 'Tampilkan'}
        >
          <span className="material-symbols-outlined">
            {show ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <p className="font-h1 text-[28px] font-extrabold">{number}</p>
      <p className="text-body-sm opacity-80">{label}</p>
    </div>
  );
}

export default Masuk;
