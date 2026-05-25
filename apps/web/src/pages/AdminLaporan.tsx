import React from 'react';
import Navigation from '../components/Navigation';

const AdminLaporan: React.FC = () => {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Navigation />
      
      <main className="lg:ml-64 pt-20 min-h-screen">
        <div className="max-w-max-width mx-auto p-gutter space-y-xl">
          <header className="mb-xl">
            <h1 className="font-h1 text-h1 text-on-surface mb-sm">Kelola Laporan</h1>
            <p className="font-body-md text-on-surface-variant">Moderasi dan validasi laporan dari masyarakat</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-md mb-xl">
            <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-sm">
                <span className="material-symbols-outlined text-primary text-2xl">pending_actions</span>
                <span className="text-xs font-bold text-secondary bg-secondary-container/30 px-2 py-1 rounded-full">Pending</span>
              </div>
              <h3 className="font-h2 text-h2 text-on-surface">42</h3>
              <p className="font-body-sm text-on-surface-variant">Menunggu validasi</p>
            </div>
            
            <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-sm">
                <span className="material-symbols-outlined text-primary text-2xl">verified</span>
                <span className="text-xs font-bold text-primary bg-primary-container/30 px-2 py-1 rounded-full">Disetujui</span>
              </div>
              <h3 className="font-h2 text-h2 text-on-surface">1,120</h3>
              <p className="font-body-sm text-on-surface-variant">Laporan disetujui</p>
            </div>
            
            <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-sm">
                <span className="material-symbols-outlined text-error text-2xl">block</span>
                <span className="text-xs font-bold text-error bg-error-container/30 px-2 py-1 rounded-full">Ditolak</span>
              </div>
              <h3 className="font-h2 text-h2 text-error">122</h3>
              <p className="font-body-sm text-on-surface-variant">Laporan ditolak</p>
            </div>
            
            <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-sm">
                <span className="material-symbols-outlined text-tertiary text-2xl">autorenew</span>
                <span className="text-xs font-bold text-tertiary bg-tertiary-container/30 px-2 py-1 rounded-full">Proses</span>
              </div>
              <h3 className="font-h2 text-h2 text-tertiary">89</h3>
              <p className="font-body-sm text-on-surface-variant">Sedang diproses</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
            <div className="p-md border-b border-outline-variant flex justify-between items-center">
              <h2 className="font-h2 text-h2 text-on-surface">Daftar Laporan</h2>
              <div className="flex gap-sm">
                <button className="flex items-center gap-xs text-primary font-button px-md py-sm rounded-lg hover:bg-primary-container/10 transition-colors">
                  <span className="material-symbols-outlined">filter_list</span>
                  Filter
                </button>
                <button className="flex items-center gap-xs text-primary font-button px-md py-sm rounded-lg hover:bg-primary-container/10 transition-colors">
                  <span className="material-symbols-outlined">download</span>
                  Export
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="px-lg py-md font-label-bold text-label-bold text-on-surface-variant uppercase">ID</th>
                    <th className="px-lg py-md font-label-bold text-label-bold text-on-surface-variant uppercase">Judul</th>
                    <th className="px-lg py-md font-label-bold text-label-bold text-on-surface-variant uppercase">Pengguna</th>
                    <th className="px-lg py-md font-label-bold text-label-bold text-on-surface-variant uppercase">Kategori</th>
                    <th className="px-lg py-md font-label-bold text-label-bold text-on-surface-variant uppercase">Tanggal</th>
                    <th className="px-lg py-md font-label-bold text-label-bold text-on-surface-variant uppercase">Status</th>
                    <th className="px-lg py-md font-label-bold text-label-bold text-on-surface-variant uppercase text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  <tr className="hover:bg-surface-container transition-colors">
                    <td className="px-lg py-md font-body-sm text-on-surface-variant">#001</td>
                    <td className="px-lg py-md">
                      <p className="font-body-md font-semibold text-on-surface">Pohon Tumbang Jl. Sudirman</p>
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-sm">
                        <div className="w-6 h-6 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed font-bold text-xs">AS</div>
                        <span className="font-body-sm text-on-surface">Andi Saputra</span>
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <span className="text-label-bold text-primary bg-primary-container/10 inline-block px-sm py-xs rounded-full">Infrastruktur</span>
                    </td>
                    <td className="px-lg py-md font-body-sm text-on-surface-variant">12 Okt 2023</td>
                    <td className="px-lg py-md">
                      <span className="px-md py-xs rounded-full bg-secondary-container/30 text-secondary font-label-bold text-[10px] uppercase">Pending</span>
                    </td>
                    <td className="px-lg py-md text-right">
                      <div className="flex gap-sm justify-end">
                        <button className="p-sm rounded-lg bg-primary text-on-primary hover:opacity-90 transition-all">
                          <span className="material-symbols-outlined text-sm">visibility</span>
                        </button>
                        <button className="p-sm rounded-lg bg-tertiary-container text-on-tertiary-container hover:opacity-90 transition-all">
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLaporan;
