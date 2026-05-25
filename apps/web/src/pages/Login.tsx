import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setAuth } from '../lib/api';

const Masuk: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex items-center justify-center p-gutter">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-sm p-xl">
        <div className="flex items-center gap-xs mb-lg">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary">campaign</span>
          </div>
          <span className="font-h2 text-h2 font-bold text-primary">Sura</span>
        </div>
        <h1 className="font-h1 text-h1 text-on-surface mb-xs">Selamat Datang</h1>
        <p className="font-body-md text-on-surface-variant mb-lg">Masuk ke akun Anda</p>
        {error && (
          <p className="mb-md p-sm bg-error-container text-error rounded-lg text-body-sm">{error}</p>
        )}
        <form className="space-y-lg" onSubmit={handleSubmit}>
          <div className="space-y-xs">
            <label className="font-label-bold text-label-bold text-on-surface-variant">Email atau Username</label>
            <input
              className="w-full px-md py-md bg-surface-container-low border border-outline-variant rounded-lg"
              placeholder="admin@sura.app"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div className="space-y-xs">
            <label className="font-label-bold text-label-bold text-on-surface-variant">Kata Sandi</label>
            <input
              className="w-full px-md py-md bg-surface-container-low border border-outline-variant rounded-lg"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-md bg-primary text-on-primary font-button rounded-lg hover:brightness-110 disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Masuk Sekarang'}
          </button>
        </form>
        <p className="mt-lg text-center text-body-sm text-on-surface-variant">
          Demo: admin@sura.app / admin123 atau warga@sura.app / user123
        </p>
        <p className="mt-md text-center">
          <Link className="text-primary font-bold hover:underline" to="/">
            Kembali ke Beranda
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Masuk;
