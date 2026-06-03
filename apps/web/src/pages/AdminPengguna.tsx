import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { api, formatDate, getStoredUser, type AuthUser } from '../lib/api';

const ROLE_FILTERS: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'Semua' },
  { key: 'user', label: 'User' },
  { key: 'admin', label: 'Admin' },
  { key: 'moderator', label: 'Moderator' },
];

const AdminPengguna: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    api.admin
      .users(filter === 'all' ? undefined : filter)
      .then(setUsers)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Gagal memuat pengguna')
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const me = getStoredUser();
    if (!me || (me.role !== 'admin' && me.role !== 'moderator')) {
      navigate('/masuk');
      return;
    }
    const timer = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, navigate]);

  const handleToggleActive = async (u: AuthUser) => {
    if (!confirm(`${u.isActive ? 'Blokir' : 'Aktifkan'} pengguna ${u.fullName}?`)) return;
    try {
      await api.admin.updateUser(u.id, { isActive: !u.isActive });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memperbarui pengguna');
    }
  };

  const handlePromote = async (u: AuthUser, role: string) => {
    if (!confirm(`Ubah role ${u.fullName} menjadi ${role}?`)) return;
    try {
      await api.admin.updateUser(u.id, { role });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memperbarui pengguna');
    }
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(term) ||
        u.username.toLowerCase().includes(term) ||
        (u.email ?? '').toLowerCase().includes(term)
    );
  }, [users, search]);

  const totals = useMemo(() => {
    const total = users.length;
    const adminCount = users.filter((u) => u.role === 'admin').length;
    const userCount = users.filter((u) => u.role === 'user').length;
    const blocked = users.filter((u) => !u.isActive).length;
    return { total, adminCount, userCount, blocked };
  }, [users]);

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Navigation />
      <main className="md:ml-64 pt-20 min-h-screen">
        <div className="max-w-max-width mx-auto p-gutter space-y-xl">
          <header className="mb-xl">
            <h1 className="font-h1 text-h1 text-on-surface mb-sm">Kelola Pengguna</h1>
            <p className="font-body-md text-on-surface-variant">
              Manajemen data pengguna sistem
            </p>
          </header>

          {error && (
            <p className="p-md bg-error-container text-error rounded-lg">{error}</p>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
            <SummaryCard label="Total" value={totals.total} icon="people" badge="Total" />
            <SummaryCard label="User" value={totals.userCount} icon="person" badge="User" />
            <SummaryCard label="Admin" value={totals.adminCount} icon="admin_panel_settings" badge="Admin" />
            <SummaryCard label="Diblokir" value={totals.blocked} icon="block" badge="Blocked" tone="error" />
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
            <div className="p-md border-b border-outline-variant flex flex-wrap justify-between items-center gap-md">
              <h2 className="font-h2 text-h2 text-on-surface">Daftar Pengguna</h2>
              <div className="flex flex-wrap gap-sm items-center">
                <input
                  className="px-md py-2 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Cari nama / email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {ROLE_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={`px-md py-1.5 rounded-full text-body-sm font-button border transition-colors ${
                      filter === f.key
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="px-lg py-md font-label-bold text-on-surface-variant uppercase">
                      ID
                    </th>
                    <th className="px-lg py-md font-label-bold text-on-surface-variant uppercase">
                      Nama
                    </th>
                    <th className="px-lg py-md font-label-bold text-on-surface-variant uppercase">
                      Email
                    </th>
                    <th className="px-lg py-md font-label-bold text-on-surface-variant uppercase">
                      Role
                    </th>
                    <th className="px-lg py-md font-label-bold text-on-surface-variant uppercase">
                      Bergabung
                    </th>
                    <th className="px-lg py-md font-label-bold text-on-surface-variant uppercase">
                      Status
                    </th>
                    <th className="px-lg py-md font-label-bold text-on-surface-variant uppercase text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-lg py-md text-on-surface-variant">
                        Memuat data...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-lg py-xl text-center text-on-surface-variant">
                        Tidak ada pengguna.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((u) => {
                      const initials = u.fullName
                        .split(' ')
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase();
                      return (
                        <tr
                          key={u.id}
                          className="hover:bg-surface-container transition-colors"
                        >
                          <td className="px-lg py-md font-body-sm text-on-surface-variant whitespace-nowrap">
                            #{u.id.slice(0, 8)}
                          </td>
                          <td className="px-lg py-md whitespace-nowrap">
                            <div className="flex items-center gap-sm">
                              <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed font-bold text-xs">
                                {initials}
                              </div>
                              <div>
                                <p className="font-body-md font-semibold text-on-surface">
                                  {u.fullName}
                                </p>
                                <p className="text-body-sm text-on-surface-variant">
                                  @{u.username}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-lg py-md font-body-sm text-on-surface">
                            {u.email ?? '-'}
                          </td>
                          <td className="px-lg py-md whitespace-nowrap">
                            <span
                              className={`px-md py-xs rounded-full font-label-bold text-[10px] uppercase ${
                                u.role === 'admin'
                                  ? 'bg-secondary-container text-on-secondary-container'
                                  : u.role === 'moderator'
                                    ? 'bg-primary-container text-on-primary-container'
                                    : 'bg-tertiary-fixed text-on-tertiary-fixed'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-lg py-md font-body-sm text-on-surface-variant whitespace-nowrap">
                            {formatDate(u.createdAt)}
                          </td>
                          <td className="px-lg py-md whitespace-nowrap">
                            <span
                              className={`px-md py-xs rounded-full font-label-bold text-[10px] uppercase ${
                                u.isActive
                                  ? 'bg-primary-container/30 text-primary'
                                  : 'bg-error-container text-error'
                              }`}
                            >
                              {u.isActive ? 'Active' : 'Blocked'}
                            </span>
                          </td>
                          <td className="px-lg py-md text-right whitespace-nowrap">
                            <div className="flex gap-sm justify-end">
                              {u.role === 'user' ? (
                                <button
                                  type="button"
                                  onClick={() => handlePromote(u, 'admin')}
                                  className="p-sm rounded-lg bg-tertiary-container text-on-tertiary-container hover:opacity-90"
                                  title="Naikkan ke Admin"
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    upgrade
                                  </span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handlePromote(u, 'user')}
                                  className="p-sm rounded-lg bg-tertiary-container text-on-tertiary-container hover:opacity-90"
                                  title="Turunkan ke User"
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    move_down
                                  </span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleToggleActive(u)}
                                className={`p-sm rounded-lg ${
                                  u.isActive
                                    ? 'bg-error text-on-error'
                                    : 'bg-primary text-on-primary'
                                } hover:opacity-90`}
                                title={u.isActive ? 'Blokir' : 'Aktifkan'}
                              >
                                <span className="material-symbols-outlined text-sm">
                                  {u.isActive ? 'block' : 'restart_alt'}
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

function SummaryCard({
  label,
  value,
  icon,
  badge,
  tone = 'primary',
}: {
  label: string;
  value: number;
  icon: string;
  badge: string;
  tone?: 'primary' | 'error';
}) {
  return (
    <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
      <div className="flex items-center justify-between mb-sm">
        <span
          className={`material-symbols-outlined text-2xl ${
            tone === 'error' ? 'text-error' : 'text-primary'
          }`}
        >
          {icon}
        </span>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full ${
            tone === 'error'
              ? 'text-error bg-error-container/30'
              : 'text-primary bg-primary-container/30'
          }`}
        >
          {badge}
        </span>
      </div>
      <h3 className={`font-h2 text-h2 ${tone === 'error' ? 'text-error' : 'text-on-surface'}`}>
        {value}
      </h3>
      <p className="font-body-sm text-on-surface-variant">{label}</p>
    </div>
  );
}

export default AdminPengguna;
