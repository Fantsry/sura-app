import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearAuth, getStoredUser } from '../lib/api';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles?: ('admin' | 'user')[];
  badge?: string;
}

const Navigation: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser({
        id: stored.id,
        name: stored.fullName,
        role: stored.role === 'admin' || stored.role === 'moderator' ? 'admin' : 'user',
        avatar: stored.avatarUrl ?? undefined,
      });
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const userNavItems: NavItem[] = [
    { label: 'Beranda', href: '/', icon: 'home' },
    { label: 'Laporanku', href: '/laporanku', icon: 'report_problem' },
    { label: 'Buat Laporan', href: '/lapor', icon: 'add_circle' },
    { label: 'Portal Berita', href: '/berita', icon: 'newspaper' },
    { label: 'Komunitas Forum', href: '/komunitas', icon: 'forum', badge: 'Hot' },
    { label: 'Statistik', href: '/statistik', icon: 'bar_chart' },
    { label: 'Profil', href: '/profil', icon: 'person' },
  ];

  const adminNavItems: NavItem[] = [
    { label: 'Dashboard Admin', href: '/admin', icon: 'dashboard', roles: ['admin'] },
    { label: 'Kelola Laporan', href: '/admin/laporan', icon: 'assignment', roles: ['admin'] },
    { label: 'Kelola Pengguna', href: '/admin/pengguna', icon: 'people', roles: ['admin'] },
    { label: 'Statistik Admin', href: '/admin/statistik', icon: 'analytics', roles: ['admin'] },
    { label: 'Pengaturan', href: '/admin/pengaturan', icon: 'settings', roles: ['admin'] },
  ];

  const allNavItems = [...userNavItems, ...adminNavItems];
  void allNavItems; // legacy reference, kept for future filtering

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setIsMobileMenuOpen(false);
    navigate('/masuk');
  };

  if (!user) {
    return (
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-gutter h-16 bg-surface dark:bg-inverse-surface shadow-sm">
        <div className="flex items-center gap-md">
          <span className="font-h2 text-h2 font-bold text-primary dark:text-inverse-primary">Sura</span>
        </div>
        <nav className="flex items-center gap-md">
          <Link 
            to="/masuk" 
            className="px-md py-sm bg-primary text-on-primary rounded-lg font-button hover:brightness-110 transition-colors"
          >
            Masuk
          </Link>
        </nav>
      </header>
    );
  }

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 w-full z-50 justify-between items-center px-gutter h-16 bg-surface dark:bg-inverse-surface shadow-sm">
        <div className="flex items-center gap-md">
          <span className="font-h2 text-h2 font-bold text-primary dark:text-inverse-primary">Sura</span>
          <span className="px-sm py-xs bg-primary-container text-on-primary-container rounded-full text-xs font-bold">
            {user.role === 'admin' ? 'Admin' : 'User'}
          </span>
        </div>
        
        <div className="flex-1 max-w-xl mx-xl">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-full border-none focus:ring-2 focus:ring-primary outline-none font-body-md" 
              placeholder={user.role === 'admin' ? 'Cari laporan atau pengguna...' : 'Search community topics...'} 
              type="text" 
            />
          </div>
        </div>

        <div className="flex items-center gap-md">
          <button className="relative material-symbols-outlined p-2 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-full">
            notifications
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img alt="Profile" className="w-full h-full object-cover" src={user.avatar} />
              ) : (
                <span className="font-bold text-xs">
                  {user.name
                    .split(' ')
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </span>
              )}
            </div>
            <div className="hidden lg:block">
              <p className="font-body-sm text-on-surface font-medium">{user.name}</p>
              <p className="font-body-xs text-on-surface-variant capitalize">{user.role}</p>
            </div>
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="material-symbols-outlined p-2 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-full"
            >
              more_vert
            </button>
            
            {isMobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-lg shadow-lg border border-outline-variant py-2">
                <Link 
                  to="/profil" 
                  className="flex items-center gap-sm px-md py-sm text-on-surface hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined">person</span>
                  Profil Saya
                </Link>
                <Link 
                  to="/pengaturan" 
                  className="flex items-center gap-sm px-md py-sm text-on-surface hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined">settings</span>
                  Pengaturan
                </Link>
                <hr className="my-2 border-outline-variant" />
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-sm px-md py-sm text-error hover:bg-error-container/10 transition-colors w-full"
                >
                  <span className="material-symbols-outlined">logout</span>
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 w-full z-50 flex justify-between items-center px-gutter h-16 bg-surface dark:bg-inverse-surface shadow-sm">
        <div className="flex items-center gap-md">
          <span className="font-h2 text-h2 font-bold text-primary dark:text-inverse-primary">Sura</span>
        </div>
        <div className="flex items-center gap-md">
          <button className="relative material-symbols-outlined p-2 text-on-surface-variant">
            notifications
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="material-symbols-outlined p-2 text-on-surface-variant"
          >
            menu
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col h-screen fixed left-0 top-0 pt-20 pb-md border-r border-outline-variant dark:border-outline bg-surface-container-low dark:bg-surface-container-lowest w-64">
        {/* Sidebar Header */}
        <div className="px-md mb-lg">
          <div className="flex items-center gap-sm mb-sm">
            <h2 className="font-h3 text-h3 text-primary dark:text-inverse-primary">Suara Rakyat</h2>
            <span className={`px-xs py-0.5 rounded-full text-xs font-bold ${
              user.role === 'admin' 
                ? 'bg-secondary-container text-on-secondary-container' 
                : 'bg-primary-container text-on-primary-container'
            }`}>
              {user.role === 'admin' ? 'ADMIN' : 'USER'}
            </span>
          </div>
          <p className="font-label-bold text-label-bold opacity-70">
            {user.role === 'admin' ? 'Admin Portal' : 'Citizen Portal'}
          </p>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1">
          {/* User Menu Section */}
          {user.role === 'admin' && (
            <div className="mb-4">
              <div className="px-md py-xs">
                <p className="font-label-bold text-label-bold text-on-surface-variant text-xs uppercase tracking-wider">User Menu</p>
              </div>
              {userNavItems.map((item) => (
                <Link
                  key={item.href}
                  className={`flex items-center gap-md py-3 px-md rounded-lg mx-md transition-all ${
                    isActive(item.href) 
                      ? 'bg-secondary-container dark:bg-secondary-fixed-dim text-on-secondary-container dark:text-on-secondary-fixed-variant' 
                      : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high'
                  }`}
                  to={item.href}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="font-label-bold text-label-bold flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="px-xs py-0.5 bg-error text-on-error rounded text-xs font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Admin Menu Section */}
          {user.role === 'admin' && (
            <div className="mb-4">
              <div className="px-md py-xs">
                <p className="font-label-bold text-label-bold text-on-surface-variant text-xs uppercase tracking-wider">Admin Menu</p>
              </div>
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  className={`flex items-center gap-md py-3 px-md rounded-lg mx-md transition-all ${
                    isActive(item.href) 
                      ? 'bg-secondary-container dark:bg-secondary-fixed-dim text-on-secondary-container dark:text-on-secondary-fixed-variant' 
                      : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high'
                  }`}
                  to={item.href}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="font-label-bold text-label-bold flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="px-xs py-0.5 bg-error text-on-error rounded text-xs font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Regular User Menu (Non-Admin) */}
          {user.role === 'user' && (
            userNavItems.map((item) => (
              <Link
                key={item.href}
                className={`flex items-center gap-md py-3 px-md rounded-lg mx-md transition-all ${
                  isActive(item.href) 
                    ? 'bg-secondary-container dark:bg-secondary-fixed-dim text-on-secondary-container dark:text-on-secondary-fixed-variant' 
                    : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high'
                }`}
                to={item.href}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-label-bold text-label-bold flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-xs py-0.5 bg-error text-on-error rounded text-xs font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-md mt-auto space-y-2">
          {user.role === 'admin' && (
            <div className="p-md bg-surface-container-highest rounded-lg border border-outline-variant">
              <div className="flex items-center gap-sm mb-xs">
                <span className="material-symbols-outlined text-secondary">shield</span>
                <span className="font-label-bold text-label-bold text-secondary">Admin Access</span>
              </div>
              <p className="font-body-xs text-on-surface-variant">Full system control enabled</p>
            </div>
          )}
          
          <button className="w-full py-3 bg-error text-on-error font-button text-button rounded-xl flex items-center justify-center gap-sm shadow-lg active:scale-95 transition-transform">
            <span className="material-symbols-outlined">campaign</span>
            Report Emergency
          </button>

          <div className="pt-2 border-t border-outline-variant">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2 text-on-surface-variant hover:text-error font-body-sm transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest flex justify-around items-center h-16 border-t border-outline-variant z-50">
        {user.role === 'admin' ? (
          // Admin Mobile Navigation
          <>
            <Link
              to="/admin"
              className={`flex flex-col items-center gap-xs transition-colors ${
                isActive('/admin') ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label-bold text-[10px]">Admin</span>
            </Link>
            <Link
              to="/admin/laporan"
              className={`flex flex-col items-center gap-xs transition-colors ${
                isActive('/admin/laporan') ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined">assignment</span>
              <span className="font-label-bold text-[10px]">Laporan</span>
            </Link>
            <Link
              to="/admin/pengguna"
              className={`flex flex-col items-center gap-xs transition-colors ${
                isActive('/admin/pengguna') ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined">people</span>
              <span className="font-label-bold text-[10px]">Pengguna</span>
            </Link>
            <Link
              to="/statistik"
              className={`flex flex-col items-center gap-xs transition-colors ${
                isActive('/statistik') ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined">bar_chart</span>
              <span className="font-label-bold text-[10px]">Statistik</span>
            </Link>
          </>
        ) : (
          // Regular User Mobile Navigation
          userNavItems.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center gap-xs transition-colors ${
                isActive(item.href) ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-label-bold text-[10px]">{item.label}</span>
            </Link>
          ))
        )}
      </nav>
    </>
  );
};

export default Navigation;
