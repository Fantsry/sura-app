import React from 'react';
import Navigation from '../components/Navigation';

const AdminPengguna: React.FC = () => {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Navigation />
      
      <main className="lg:ml-64 pt-20 min-h-screen">
        <div className="max-w-max-width mx-auto p-gutter space-y-xl">
          <header className="mb-xl">
            <h1 className="font-h1 text-h1 text-on-surface mb-sm">Kelola Pengguna</h1>
            <p className="font-body-md text-on-surface-variant">Manajemen data pengguna sistem</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-md mb-xl">
            <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-sm">
                <span className="material-symbols-outlined text-primary text-2xl">people</span>
                <span className="text-xs font-bold text-primary bg-primary-container/30 px-2 py-1 rounded-full">Total</span>
              </div>
              <h3 className="font-h2 text-h2 text-on-surface">2,847</h3>
              <p className="font-body-sm text-on-surface-variant">Semua pengguna</p>
            </div>
            
            <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-sm">
                <span className="material-symbols-outlined text-tertiary text-2xl">person</span>
                <span className="text-xs font-bold text-tertiary bg-tertiary-container/30 px-2 py-1 rounded-full">User</span>
              </div>
              <h3 className="font-h2 text-h2 text-tertiary">2,742</h3>
              <p className="font-body-sm text-on-surface-variant">Pengguna biasa</p>
            </div>
            
            <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-sm">
                <span className="material-symbols-outlined text-secondary text-2xl">admin_panel_settings</span>
                <span className="text-xs font-bold text-secondary bg-secondary-container/30 px-2 py-1 rounded-full">Admin</span>
              </div>
              <h3 className="font-h2 text-h2 text-secondary">105</h3>
              <p className="font-body-sm text-on-surface-variant">Administrator</p>
            </div>
            
            <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-sm">
                <span className="material-symbols-outlined text-error text-2xl">block</span>
                <span className="text-xs font-bold text-error bg-error-container/30 px-2 py-1 rounded-full">Blocked</span>
              </div>
              <h3 className="font-h2 text-h2 text-error">28</h3>
              <p className="font-body-sm text-on-surface-variant">Diblokir</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
            <div className="p-md border-b border-outline-variant flex justify-between items-center">
              <h2 className="font-h2 text-h2 text-on-surface">Daftar Pengguna</h2>
              <div className="flex gap-sm">
                <button className="flex items-center gap-xs text-primary font-button px-md py-sm rounded-lg hover:bg-primary-container/10 transition-colors">
                  <span className="material-symbols-outlined">filter_list</span>
                  Filter
                </button>
                <button className="flex items-center gap-xs text-primary font-button px-md py-sm rounded-lg hover:bg-primary-container/10 transition-colors">
                  <span className="material-symbols-outlined">add</span>
                  Tambah Admin
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="px-lg py-md font-label-bold text-label-bold text-on-surface-variant uppercase">ID</th>
                    <th className="px-lg py-md font-label-bold text-label-bold text-on-surface-variant uppercase">Nama</th>
                    <th className="px-lg py-md font-label-bold text-label-bold text-on-surface-variant uppercase">Email</th>
                    <th className="px-lg py-md font-label-bold text-label-bold text-on-surface-variant uppercase">Role</th>
                    <th className="px-lg py-md font-label-bold text-label-bold text-on-surface-variant uppercase">Bergabung</th>
                    <th className="px-lg py-md font-label-bold text-label-bold text-on-surface-variant uppercase">Status</th>
                    <th className="px-lg py-md font-label-bold text-label-bold text-on-surface-variant uppercase text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  <tr className="hover:bg-surface-container transition-colors">
                    <td className="px-lg py-md font-body-sm text-on-surface-variant">#001</td>
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed font-bold text-xs">AS</div>
                        <div>
                          <p className="font-body-md font-semibold text-on-surface">Andi Saputra</p>
                          <p className="font-body-xs text-on-surface-variant">@andisaputra</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md font-body-sm text-on-surface">andi.s@email.com</td>
                    <td className="px-lg py-md">
                      <span className="px-md py-xs rounded-full bg-tertiary-container/30 text-tertiary font-label-bold text-[10px] uppercase">User</span>
                    </td>
                    <td className="px-lg py-md font-body-sm text-on-surface-variant">15 Jan 2023</td>
                    <td className="px-lg py-md">
                      <span className="px-md py-xs rounded-full bg-primary-container/30 text-primary font-label-bold text-[10px] uppercase">Active</span>
                    </td>
                    <td className="px-lg py-md text-right">
                      <div className="flex gap-sm justify-end">
                        <button className="p-sm rounded-lg bg-primary text-on-primary hover:opacity-90 transition-all">
                          <span className="material-symbols-outlined text-sm">visibility</span>
                        </button>
                        <button className="p-sm rounded-lg bg-tertiary-container text-on-tertiary-container hover:opacity-90 transition-all">
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button className="p-sm rounded-lg bg-error text-on-error hover:opacity-90 transition-all">
                          <span className="material-symbols-outlined text-sm">block</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container transition-colors">
                    <td className="px-lg py-md font-body-sm text-on-surface-variant">#002</td>
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed font-bold text-xs">RM</div>
                        <div>
                          <p className="font-body-md font-semibold text-on-surface">Rina Melati</p>
                          <p className="font-body-xs text-on-surface-variant">@rinamelati</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md font-body-sm text-on-surface">rina.m@email.com</td>
                    <td className="px-lg py-md">
                      <span className="px-md py-xs rounded-full bg-secondary-container/30 text-secondary font-label-bold text-[10px] uppercase">Admin</span>
                    </td>
                    <td className="px-lg py-md font-body-sm text-on-surface-variant">10 Feb 2023</td>
                    <td className="px-lg py-md">
                      <span className="px-md py-xs rounded-full bg-primary-container/30 text-primary font-label-bold text-[10px] uppercase">Active</span>
                    </td>
                    <td className="px-lg py-md text-right">
                      <div className="flex gap-sm justify-end">
                        <button className="p-sm rounded-lg bg-primary text-on-primary hover:opacity-90 transition-all">
                          <span className="material-symbols-outlined text-sm">visibility</span>
                        </button>
                        <button className="p-sm rounded-lg bg-tertiary-container text-on-tertiary-container hover:opacity-90 transition-all">
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button className="p-sm rounded-lg bg-error text-on-error hover:opacity-90 transition-all">
                          <span className="material-symbols-outlined text-sm">block</span>
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

export default AdminPengguna;
