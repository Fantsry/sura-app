import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import {
  api,
  clearAuth,
  formatDate,
  getStoredUser,
  setAuth,
  type AuthUser,
  type Report,
} from '../lib/api';

const ProfilPengguna: React.FC = () => {
  const navigate = useNavigate();
  const [me, setMe] = useState<AuthUser | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [editing, setEditing] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // edit form state
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (!getStoredUser()) {
      navigate('/masuk');
      return;
    }
    Promise.all([api.me(), api.getMyReports().catch(() => [])])
      .then(([user, list]) => {
        setMe(user);
        setReports(list);
        setFullName(user.fullName);
        setPhoneNumber(user.phoneNumber ?? '');
        setAvatarUrl(user.avatarUrl ?? '');
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Gagal memuat profil')
      )
      .finally(() => setLoading(false));
  }, [navigate]);

  const stats = useMemo(() => {
    const total = reports.length;
    const resolved = reports.filter((r) => r.status === 'resolved').length;
    const inProcess = reports.filter((r) =>
      ['verified', 'in_progress'].includes(r.status)
    ).length;
    return { total, resolved, inProcess };
  }, [reports]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setInfo('');
    try {
      const updated = await api.updateProfile({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        avatarUrl: avatarUrl.trim() || null,
      });
      setMe(updated);
      const token = localStorage.getItem('auth_token');
      if (token) setAuth(token, updated);
      setEditing(false);
      setInfo('Profil berhasil diperbarui.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan profil');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setInfo('');
    try {
      await api.changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setPwOpen(false);
      setInfo('Kata sandi berhasil diubah.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengubah kata sandi');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/masuk');
  };

  if (loading) {
    return (
      <div className="bg-surface min-h-screen">
        <Navigation />
        <main className="pt-20 md:pl-64 px-gutter py-xl">
          <p className="text-on-surface-variant">Memuat profil...</p>
        </main>
      </div>
    );
  }

  if (!me) return null;

  const initials = me.fullName
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const points = me.points ?? 0;
  const nextThreshold = 1500;
  const pct = Math.min(Math.round((points / nextThreshold) * 100), 100);

  return (
    <React.Fragment>
      <Navigation />
      <main className="pt-20 md:pl-64 pb-xl px-gutter max-w-screen-2xl mx-auto">
        <header className="mb-xl">
          <h1 className="font-h1 text-h1 text-on-surface mb-xs">Profil Pengguna</h1>
          <p className="text-on-surface-variant font-body-md">
            Kelola informasi pribadi dan pantau kontribusi Anda.
          </p>
        </header>

        {error && (
          <p className="p-md bg-error-container text-error rounded-lg mb-lg">{error}</p>
        )}
        {info && (
          <p className="p-md bg-tertiary-fixed text-on-tertiary-fixed rounded-lg mb-lg">
            {info}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
          <div className="lg:col-span-4 space-y-xl">
            <div className="bg-surface border border-outline-variant rounded-xl p-xl shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-md">
                  <div className="w-32 h-32 rounded-full border-4 border-primary-container overflow-hidden bg-primary text-on-primary flex items-center justify-center">
                    {me.avatarUrl ? (
                      <img
                        alt={me.fullName}
                        className="w-full h-full object-cover"
                        src={me.avatarUrl}
                      />
                    ) : (
                      <span className="font-h1 text-[40px] font-bold">{initials}</span>
                    )}
                  </div>
                </div>
                <h2 className="font-h2 text-h2 text-on-surface">{me.fullName}</h2>
                <span className="inline-flex items-center px-sm py-xs bg-secondary-container text-on-secondary-container font-label-bold rounded-full mt-xs">
                  <span className="material-symbols-outlined text-[14px] mr-xs">
                    {me.isVerified ? 'verified' : 'badge'}
                  </span>
                  {me.role === 'admin'
                    ? 'Administrator'
                    : me.role === 'moderator'
                      ? 'Moderator'
                      : me.isVerified
                        ? 'Warga Terverifikasi'
                        : 'Warga'}
                </span>
              </div>
              <div className="mt-xl pt-xl border-t border-outline-variant space-y-md">
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant text-body-sm">
                    Poin Kontribusi
                  </span>
                  <span className="text-primary font-bold">
                    {points.toLocaleString('id-ID')} Pts
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: `${pct}%` }}></div>
                </div>
                <p className="text-body-sm text-on-surface-variant italic">
                  {points < nextThreshold
                    ? `${(nextThreshold - points).toLocaleString('id-ID')} poin lagi untuk level berikutnya`
                    : 'Anda sudah mencapai level tertinggi.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-md">
              <StatBox icon="description" value={stats.total} label="Laporan" />
              <StatBox icon="autorenew" value={stats.inProcess} label="Proses" />
              <StatBox icon="check_circle" value={stats.resolved} label="Selesai" />
            </div>
          </div>

          <div className="lg:col-span-8 space-y-xl">
            <section className="bg-surface border border-outline-variant rounded-xl overflow-hidden">
              <div className="p-lg border-b border-outline-variant flex justify-between items-center">
                <h3 className="font-h3 text-h3 text-on-surface">Informasi Pribadi</h3>
                <button
                  type="button"
                  onClick={() => setEditing((v) => !v)}
                  className="text-primary font-button hover:underline"
                >
                  {editing ? 'Batal' : 'Ubah Profil'}
                </button>
              </div>

              {editing ? (
                <form onSubmit={handleSaveProfile} className="p-lg grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <Field label="Nama Lengkap">
                    <input
                      className="w-full px-md py-sm border border-outline-variant rounded-lg bg-surface-container-low"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="No. Telepon">
                    <input
                      className="w-full px-md py-sm border border-outline-variant rounded-lg bg-surface-container-low"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+62 ..."
                    />
                  </Field>
                  <Field label="URL Avatar (opsional)">
                    <input
                      className="w-full px-md py-sm border border-outline-variant rounded-lg bg-surface-container-low"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </Field>
                  <div className="md:col-span-2 flex justify-end gap-sm">
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="px-lg py-md text-on-surface-variant rounded-lg"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-lg py-md bg-primary text-on-primary rounded-lg font-button disabled:opacity-60"
                    >
                      {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-lg grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <ReadField label="Nama Lengkap" value={me.fullName} />
                  <ReadField label="Username" value={`@${me.username}`} />
                  <ReadField label="Email" value={me.email ?? '-'} />
                  <ReadField label="No. Telepon" value={me.phoneNumber ?? '-'} />
                  <ReadField label="Role" value={me.role} />
                  <ReadField
                    label="Bergabung"
                    value={me.createdAt ? formatDate(me.createdAt) : '-'}
                  />
                </div>
              )}
            </section>

            <section className="bg-surface border border-outline-variant rounded-xl overflow-hidden">
              <div className="p-lg border-b border-outline-variant">
                <h3 className="font-h3 text-h3 text-on-surface flex items-center gap-sm">
                  <span className="material-symbols-outlined">security</span> Keamanan
                </h3>
              </div>
              <div className="p-lg space-y-md">
                <div className="flex items-center justify-between flex-wrap gap-md">
                  <div>
                    <p className="font-body-md text-on-surface">Kata Sandi</p>
                    <p className="text-body-sm text-on-surface-variant">
                      Gunakan kombinasi minimal 6 karakter.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPwOpen((v) => !v)}
                    className="px-md py-xs border border-outline text-primary rounded-lg font-button hover:bg-surface-container-low transition-colors"
                  >
                    {pwOpen ? 'Batal' : 'Ubah Kata Sandi'}
                  </button>
                </div>

                {pwOpen && (
                  <form
                    onSubmit={handleChangePassword}
                    className="grid grid-cols-1 md:grid-cols-2 gap-md pt-md border-t border-outline-variant"
                  >
                    <Field label="Kata sandi saat ini">
                      <input
                        type="password"
                        className="w-full px-md py-sm border border-outline-variant rounded-lg bg-surface-container-low"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </Field>
                    <Field label="Kata sandi baru">
                      <input
                        type="password"
                        className="w-full px-md py-sm border border-outline-variant rounded-lg bg-surface-container-low"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </Field>
                    <div className="md:col-span-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-lg py-md bg-primary text-on-primary rounded-lg font-button disabled:opacity-60"
                      >
                        {saving ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="flex items-center justify-between pt-md border-t border-outline-variant">
                  <div>
                    <p className="font-body-md text-on-surface">Sesi</p>
                    <p className="text-body-sm text-on-surface-variant">
                      Keluar dari akun di perangkat ini.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-lg py-md bg-error text-on-error rounded-lg font-button"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
};

function StatBox({
  icon,
  value,
  label,
}: {
  icon: string;
  value: number;
  label: string;
}) {
  return (
    <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant flex flex-col items-center justify-center text-center">
      <span className="material-symbols-outlined text-primary mb-xs">{icon}</span>
      <span className="font-h2 text-h2 text-on-surface">{value}</span>
      <span className="font-label-bold text-on-surface-variant">{label}</span>
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
    <div className="space-y-xs">
      <label className="font-label-bold text-on-surface-variant uppercase">{label}</label>
      {children}
    </div>
  );
}

function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-xs">
      <label className="font-label-bold text-on-surface-variant uppercase">{label}</label>
      <p className="font-body-md text-on-surface">{value}</p>
    </div>
  );
}

export default ProfilPengguna;
