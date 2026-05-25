import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { api, getStoredUser, type Report } from '../lib/api';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Record<string, number>>({});
  const [pending, setPending] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.admin
      .dashboard()
      .then((data) => {
        setStats(data.stats);
        setPending(data.pendingReports);
      })
      .catch(() => navigate('/masuk'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const user = getStoredUser();
    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
      navigate('/masuk');
      return;
    }
    load();
  }, [navigate]);

  const handleStatus = async (id: string, status: string) => {
    await api.admin.updateReportStatus(id, status);
    load();
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Navigation />
      <main className="lg:ml-64 pt-20 min-h-screen">
        <div className="max-w-max-width mx-auto p-gutter space-y-xl">
          {loading ? (
            <p>Memuat dashboard...</p>
          ) : (
            <>
              <header className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
                <StatCard label="Total Laporan" value={stats.totalReports} />
                <StatCard label="Pending" value={stats.pendingReports} color="text-secondary" />
                <StatCard label="Terverifikasi" value={stats.verifiedReports} color="text-primary" />
                <StatCard label="Selesai" value={stats.resolvedReports} color="text-primary" />
              </header>
              <section>
                <h3 className="font-h2 mb-md">Laporan Perlu Moderasi</h3>
                <div className="bg-surface-container-lowest rounded-xl border overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-low border-b">
                      <tr>
                        <th className="px-lg py-md font-label-bold">Laporan</th>
                        <th className="px-lg py-md font-label-bold">Lokasi</th>
                        <th className="px-lg py-md font-label-bold">Status</th>
                        <th className="px-lg py-md font-label-bold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pending.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-lg py-md text-on-surface-variant">
                            Tidak ada laporan pending
                          </td>
                        </tr>
                      ) : (
                        pending.map((r) => (
                          <tr key={r.id} className="border-b border-outline-variant/20">
                            <td className="px-lg py-md">
                              <p className="font-semibold">{r.title}</p>
                              <p className="text-body-sm text-on-surface-variant line-clamp-1">{r.description}</p>
                            </td>
                            <td className="px-lg py-md text-body-sm">{r.address ?? '-'}</td>
                            <td className="px-lg py-md">
                              <span className="px-md py-xs rounded-full bg-secondary-container/30 text-secondary text-[10px] font-bold uppercase">
                                {r.status}
                              </span>
                            </td>
                            <td className="px-lg py-md text-right">
                              <div className="flex gap-sm justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleStatus(r.id, 'verified')}
                                  className="p-sm rounded-lg bg-primary text-on-primary"
                                >
                                  <span className="material-symbols-outlined">check</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStatus(r.id, 'rejected')}
                                  className="p-sm rounded-lg bg-error text-on-error"
                                >
                                  <span className="material-symbols-outlined">close</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

function StatCard({ label, value, color = '' }: { label: string; value?: number; color?: string }) {
  return (
    <div className="bg-surface-container-lowest p-lg rounded-xl border flex items-center justify-between">
      <div>
        <p className="font-label-bold text-outline uppercase">{label}</p>
        <h2 className={`font-h1 mt-xs ${color}`}>{value ?? 0}</h2>
      </div>
      <span className="material-symbols-outlined text-primary text-[32px] opacity-30">folder_open</span>
    </div>
  );
}

export default AdminDashboard;
