import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api, clearAuth, formatRelative, getStoredUser, type Notification } from '../lib/api';

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
  const [user, setUser] = useState<User | null>(() => {
    const stored = getStoredUser();
    if (stored) {
      return {
        id: stored.id,
        name: stored.fullName,
        role: stored.role === 'admin' || stored.role === 'moderator' ? 'admin' : 'user',
        avatar: stored.avatarUrl ?? undefined,
      };
    }
    return null;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const loadNotifications = useCallback(() => {
    if (!getStoredUser()) return;
    api.getNotifications(20)
      .then((data) => {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications, location.pathname]);

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
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setIsMobileMenuOpen(false);
    navigate('/masuk');
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const handleNotifClick = async (n: Notification) => {
    if (!n.isRead) {
      try {
        await api.markNotificationRead(n.id);
        setNotifications((prev) =>
          prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {}
    }
    setNotifOpen(false);
    if (n.relatedId) navigate(`/detail?id=${n.relatedId}`);
  };

  // Close notif dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) {
    return (
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-gutter h-16 bg-surface dark:bg-surface-container-low shadow-sm border-b border-outline-variant dark:border-outline">
        <div className="flex items-center gap-md">
          <span className="font-h2 text-h2 font-bold text-primary dark:text-primary">Sura</span>
        </div>
        <nav className="flex items-center gap-md">
          <Link 
            to="/masuk" 
            className="px-md py-sm bg-primary dark:bg-primary text-on-primary dark:text-on-primary rounded-lg font-button hover:brightness-110 transition-colors"
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
      <header className="hidden md:flex fixed top-0 w-full z-50 justify-between items-center px-gutter h-16 bg-surface dark:bg-surface-container-low shadow-sm border-b border-outline-variant dark:border-outline">
        <div className="flex items-center gap-md">
          <span className="font-h2 text-h2 font-bold text-primary dark:text-primary">Sura</span>
          <span className="px-sm py-xs bg-primary-container dark:bg-primary-container text-on-primary-container dark:text-on-primary-container rounded-full text-xs font-bold">
            {user.role === 'admin' ? 'Admin' : 'User'}
          </span>
        </div>
        
        <div className="flex-1 max-w-xl mx-xl">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-on-surface-variant">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2 bg-surface-container dark:bg-surface-container-highest rounded-full border-none focus:ring-2 focus:ring-primary dark:focus:ring-primary outline-none font-body-md text-on-surface dark:text-on-surface placeholder:text-on-surface-variant dark:placeholder:text-on-surface-variant" 
              placeholder={user.role === 'admin' ? 'Cari laporan atau pengguna...' : 'Search community topics...'} 
              type="text" 
            />
          </div>
        </div>

        <div className="flex items-center gap-md">
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen((v) => !v)}
              className="relative material-symbols-outlined p-2 text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-highest dark:hover:bg-surface-container-high transition-colors rounded-full"
            >
              notifications
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-error text-on-error rounded-full text-[10px] font-bold flex items-center justify-center px-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest dark:bg-surface-container-high rounded-xl shadow-2xl border border-outline-variant dark:border-outline overflow-hidden z-50">
                <div className="p-md border-b border-outline-variant dark:border-outline flex items-center justify-between">
                  <h4 className="font-h3 text-h3 text-on-surface dark:text-on-surface">Notifikasi</h4>
                  {unreadCount > 0 && (
                    <button type="button" onClick={handleMarkAllRead} className="text-primary dark:text-primary font-button text-body-sm hover:underline">
                      Tandai semua dibaca
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-lg text-center text-on-surface-variant dark:text-on-surface-variant text-body-sm">Tidak ada notifikasi.</p>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => handleNotifClick(n)}
                        className={`w-full text-left p-md border-b border-outline-variant/20 dark:border-outline/20 hover:bg-surface-container dark:hover:bg-surface-container-highest transition-colors flex gap-sm ${
                          n.isRead ? 'opacity-60' : ''
                        }`}
                      >
                        <span className={`material-symbols-outlined text-[20px] mt-xs flex-shrink-0 ${n.isRead ? 'text-outline dark:text-outline' : 'text-primary dark:text-primary'}`}>
                          {n.type === 'report_update' ? 'assignment' : 'notifications'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-body-sm line-clamp-1 ${n.isRead ? 'text-on-surface-variant dark:text-on-surface-variant' : 'text-on-surface dark:text-on-surface font-semibold'}`}>{n.title}</p>
                          <p className="text-body-sm text-on-surface-variant dark:text-on-surface-variant line-clamp-2">{n.message}</p>
                          <p className="text-[10px] text-outline dark:text-outline mt-xs">{formatRelative(n.createdAt)}</p>
                        </div>
                        {!n.isRead && <span className="w-2 h-2 bg-primary dark:bg-primary rounded-full flex-shrink-0 mt-1.5"></span>}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-full bg-primary dark:bg-primary text-on-primary dark:text-on-primary flex items-center justify-center overflow-hidden">
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
              <p className="font-body-sm text-on-surface dark:text-on-surface font-medium">{user.name}</p>
              <p className="font-body-xs text-on-surface-variant dark:text-on-surface-variant capitalize">{user.role}</p>
            </div>
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="material-symbols-outlined p-2 text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-highest dark:hover:bg-surface-container-high transition-colors rounded-full"
            >
              more_vert
            </button>
            
            {isMobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest dark:bg-surface-container-high rounded-lg shadow-lg border border-outline-variant dark:border-outline py-2">
                <Link 
                  to="/profil" 
                  className="flex items-center gap-sm px-md py-sm text-on-surface dark:text-on-surface hover:bg-surface-container dark:hover:bg-surface-container-highest transition-colors"
                >
                  <span className="material-symbols-outlined">person</span>
                  Profil Saya
                </Link>
                <Link 
                  to="/pengaturan" 
                  className="flex items-center gap-sm px-md py-sm text-on-surface dark:text-on-surface hover:bg-surface-container dark:hover:bg-surface-container-highest transition-colors"
                >
                  <span className="material-symbols-outlined">settings</span>
                  Pengaturan
                </Link>
                <hr className="my-2 border-outline-variant dark:border-outline" />
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-sm px-md py-sm text-error hover:bg-error-container/10 dark:hover:bg-error-container/20 transition-colors w-full"
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
      <header className="md:hidden fixed top-0 w-full z-50 flex justify-between items-center px-gutter h-16 bg-surface dark:bg-surface-container-low shadow-sm border-b border-outline-variant dark:border-outline">
        <div className="flex items-center gap-md">
          <span className="font-h2 text-h2 font-bold text-primary dark:text-primary">Sura</span>
        </div>
        <div className="flex items-center gap-md">
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen((v) => !v)}
              className="relative material-symbols-outlined p-2 text-on-surface-variant dark:text-on-surface-variant"
            >
              notifications
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-error text-on-error rounded-full text-[10px] font-bold flex items-center justify-center px-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest dark:bg-surface-container-high rounded-xl shadow-2xl border border-outline-variant dark:border-outline overflow-hidden z-50">
                <div className="p-md border-b border-outline-variant dark:border-outline flex items-center justify-between">
                  <h4 className="font-h3 text-h3 text-on-surface dark:text-on-surface">Notifikasi</h4>
                  {unreadCount > 0 && (
                    <button type="button" onClick={handleMarkAllRead} className="text-primary dark:text-primary font-button text-body-sm hover:underline">
                      Tandai semua dibaca
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-lg text-center text-on-surface-variant dark:text-on-surface-variant text-body-sm">Tidak ada notifikasi.</p>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => handleNotifClick(n)}
                        className={`w-full text-left p-md border-b border-outline-variant/20 dark:border-outline/20 hover:bg-surface-container dark:hover:bg-surface-container-highest transition-colors flex gap-sm ${
                          n.isRead ? 'opacity-60' : ''
                        }`}
                      >
                        <span className={`material-symbols-outlined text-[20px] mt-xs flex-shrink-0 ${n.isRead ? 'text-outline dark:text-outline' : 'text-primary dark:text-primary'}`}>
                          {n.type === 'report_update' ? 'assignment' : 'notifications'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-body-sm line-clamp-1 ${n.isRead ? 'text-on-surface-variant dark:text-on-surface-variant' : 'text-on-surface dark:text-on-surface font-semibold'}`}>{n.title}</p>
                          <p className="text-body-sm text-on-surface-variant dark:text-on-surface-variant line-clamp-2">{n.message}</p>
                          <p className="text-[10px] text-outline dark:text-outline mt-xs">{formatRelative(n.createdAt)}</p>
                        </div>
                        {!n.isRead && <span className="w-2 h-2 bg-primary dark:bg-primary rounded-full flex-shrink-0 mt-1.5"></span>}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="material-symbols-outlined p-2 text-on-surface-variant dark:text-on-surface-variant"
          >
            menu
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col h-screen fixed left-0 top-0 pt-20 pb-md border-r border-outline-variant dark:border-outline bg-surface-container-low dark:bg-surface-container-lowest w-64 overflow-hidden">
        {/* Sidebar Header */}
        <div className="px-md mb-lg flex-shrink-0">
          <div className="flex items-center gap-sm mb-sm">
            <h2 className="font-h3 text-h3 text-primary dark:text-primary">Suara Rakyat</h2>
            <span className={`px-xs py-0.5 rounded-full text-xs font-bold ${
              user.role === 'admin' 
                ? 'bg-secondary-container dark:bg-secondary-container text-on-secondary-container dark:text-on-secondary-container' 
                : 'bg-primary-container dark:bg-primary-container text-on-primary-container dark:text-on-primary-container'
            }`}>
              {user.role === 'admin' ? 'ADMIN' : 'USER'}
            </span>
          </div>
          <p className="font-label-bold text-label-bold text-on-surface-variant dark:text-on-surface-variant opacity-70">
            {user.role === 'admin' ? 'Admin Portal' : 'Citizen Portal'}
          </p>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden nice-scroll px-2">
          {/* User Menu Section */}
          {user.role === 'admin' && (
            <div className="mb-4 flex flex-col gap-1">
              <div className="px-sm py-xs">
                <p className="font-label-bold text-label-bold text-on-surface-variant dark:text-on-surface-variant text-xs uppercase tracking-wider">User Menu</p>
              </div>
              {userNavItems.map((item) => (
                <Link
                  key={item.href}
                  className={`flex items-center gap-md py-3 px-md rounded-lg transition-all ${
                    isActive(item.href) 
                      ? 'bg-primary dark:bg-primary text-on-primary dark:text-on-primary shadow-md' 
                      : 'text-on-surface-variant dark:text-on-surface-variant hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary'
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
            <div className="mb-4 flex flex-col gap-1">
              <div className="px-sm py-xs">
                <p className="font-label-bold text-label-bold text-on-surface-variant dark:text-on-surface-variant text-xs uppercase tracking-wider">Admin Menu</p>
              </div>
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  className={`flex items-center gap-md py-3 px-md rounded-lg transition-all ${
                    isActive(item.href) 
                      ? 'bg-primary dark:bg-primary text-on-primary dark:text-on-primary shadow-md' 
                      : 'text-on-surface-variant dark:text-on-surface-variant hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary'
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
                  className={`flex items-center gap-md py-3 px-md rounded-lg transition-all ${
                    isActive(item.href) 
                      ? 'bg-primary dark:bg-primary text-on-primary dark:text-on-primary shadow-md' 
                      : 'text-on-surface-variant dark:text-on-surface-variant hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary'
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
        <div className="px-md mt-auto space-y-2 flex-shrink-0">
          {user.role === 'admin' && (
            <div className="p-md bg-surface-container-highest dark:bg-surface-container-high rounded-lg border border-outline-variant dark:border-outline">
              <div className="flex items-center gap-sm mb-xs">
                <span className="material-symbols-outlined text-secondary dark:text-secondary">shield</span>
                <span className="font-label-bold text-label-bold text-secondary dark:text-secondary">Admin Access</span>
              </div>
              <p className="font-body-xs text-on-surface-variant dark:text-on-surface-variant">Full system control enabled</p>
            </div>
          )}
          
          <Link
            to="/lapor"
            className="w-full py-3 bg-error dark:bg-error text-on-error dark:text-on-error font-button text-button rounded-xl flex items-center justify-center gap-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">campaign</span>
            Report Emergency
          </Link>

          <div className="pt-2 border-t border-outline-variant dark:border-outline">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2 text-on-surface-variant dark:text-on-surface-variant hover:text-error dark:hover:text-error font-body-sm transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest dark:bg-surface-container-low flex justify-around items-center h-16 border-t border-outline-variant dark:border-outline z-50">
        {user.role === 'admin' ? (
          // Admin Mobile Navigation
          <>
            <Link
              to="/admin"
              className={`flex flex-col items-center gap-xs transition-colors ${
                isActive('/admin') ? 'text-primary dark:text-primary' : 'text-on-surface-variant dark:text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label-bold text-[10px]">Admin</span>
            </Link>
            <Link
              to="/admin/laporan"
              className={`flex flex-col items-center gap-xs transition-colors ${
                isActive('/admin/laporan') ? 'text-primary dark:text-primary' : 'text-on-surface-variant dark:text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined">assignment</span>
              <span className="font-label-bold text-[10px]">Laporan</span>
            </Link>
            <Link
              to="/admin/pengguna"
              className={`flex flex-col items-center gap-xs transition-colors ${
                isActive('/admin/pengguna') ? 'text-primary dark:text-primary' : 'text-on-surface-variant dark:text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined">people</span>
              <span className="font-label-bold text-[10px]">Pengguna</span>
            </Link>
            <Link
              to="/statistik"
              className={`flex flex-col items-center gap-xs transition-colors ${
                isActive('/statistik') ? 'text-primary dark:text-primary' : 'text-on-surface-variant dark:text-on-surface-variant'
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
                isActive(item.href) ? 'text-primary dark:text-primary' : 'text-on-surface-variant dark:text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-label-bold text-[10px]">{item.label}</span>
            </Link>
          ))
        )}
      </nav>

      {/* Mobile Drawer/Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-black/40 z-40" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="absolute right-gutter top-2 w-56 bg-surface-container-lowest dark:bg-surface-container-high rounded-2xl shadow-2xl border border-outline-variant dark:border-outline py-md flex flex-col z-50 animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-md pb-sm border-b border-outline-variant/30 dark:border-outline/30">
              <p className="font-bold text-on-surface dark:text-on-surface text-body-md">{user.name}</p>
              <p className="text-body-xs text-on-surface-variant dark:text-on-surface-variant capitalize">{user.role}</p>
            </div>
            
            <div className="py-sm">
              <Link 
                to="/profil" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-sm px-md py-sm text-on-surface dark:text-on-surface hover:bg-surface-container dark:hover:bg-surface-container-highest transition-colors font-body-md"
              >
                <span className="material-symbols-outlined text-[20px]">person</span>
                Profil Saya
              </Link>
              <Link 
                to="/pengaturan" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-sm px-md py-sm text-on-surface dark:text-on-surface hover:bg-surface-container dark:hover:bg-surface-container-highest transition-colors font-body-md"
              >
                <span className="material-symbols-outlined text-[20px]">settings</span>
                Pengaturan
              </Link>
            </div>

            <hr className="border-outline-variant/30 dark:border-outline/30" />

            <div className="pt-sm">
              {user.role === 'admin' && (
                <>
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-sm px-md py-sm text-on-surface dark:text-on-surface hover:bg-surface-container dark:hover:bg-surface-container-highest transition-colors font-body-md"
                  >
                    <span className="material-symbols-outlined text-[20px]">dashboard</span>
                    Dashboard Admin
                  </Link>
                  <Link 
                    to="/admin/laporan" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-sm px-md py-sm text-on-surface dark:text-on-surface hover:bg-surface-container dark:hover:bg-surface-container-highest transition-colors font-body-md"
                  >
                    <span className="material-symbols-outlined text-[20px]">assignment</span>
                    Kelola Laporan
                  </Link>
                  <Link 
                    to="/admin/pengguna" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-sm px-md py-sm text-on-surface dark:text-on-surface hover:bg-surface-container dark:hover:bg-surface-container-highest transition-colors font-body-md"
                  >
                    <span className="material-symbols-outlined text-[20px]">people</span>
                    Kelola Pengguna
                  </Link>
                  <hr className="my-sm border-outline-variant/30 dark:border-outline/30" />
                </>
              )}
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-sm px-md py-sm text-error hover:bg-error-container/10 dark:hover:bg-error-container/20 transition-colors w-full text-left font-body-md"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
