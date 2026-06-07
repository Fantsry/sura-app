import React, { useEffect, useMemo, useState } from 'react';
import Navigation from '../components/Navigation';
import { api, formatDate, getStoredUser, type NewsArticle } from '../lib/api';

type CategoryStyle = {
  color: string;
  bg: string;
  icon: string;
};

const CATEGORY_META: Record<string, CategoryStyle> = {
  'Tips Keamanan': { color: 'text-error', bg: 'bg-error-container', icon: 'security' },
  'Info Bencana': { color: 'text-error', bg: 'bg-error-container', icon: 'emergency' },
  'Kegiatan Komunitas': {
    color: 'text-on-secondary-container',
    bg: 'bg-secondary-container',
    icon: 'groups',
  },
  'Pengumuman Resmi': {
    color: 'text-on-primary-container',
    bg: 'bg-primary-container',
    icon: 'campaign',
  },
};

const PortalBerita: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const me = getStoredUser();
  const isAdmin = me?.role === 'admin' || me?.role === 'moderator';

  useEffect(() => {
    api
      .getNews({ limit: 30 })
      .then(setArticles)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Gagal memuat berita')
      )
      .finally(() => setLoading(false));
  }, []);

  const featured = useMemo(
    () => articles.find((a) => a.isFeatured) ?? articles[0] ?? null,
    [articles]
  );

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of articles) {
      if (!a.category) continue;
      map.set(a.category, (map.get(a.category) ?? 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [articles]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let pool: NewsArticle[];

    if (activeCat || term) {
      // when user filters/searches, do NOT exclude featured — show all matches
      pool = articles;
    } else {
      // landing view: hide featured (it appears in hero)
      pool = featured ? articles.filter((a) => a.id !== featured.id) : articles;
    }

    return pool
      .filter((a) => (activeCat ? a.category === activeCat : true))
      .filter((a) =>
        term
          ? a.title.toLowerCase().includes(term) ||
            (a.excerpt ?? '').toLowerCase().includes(term) ||
            a.content.toLowerCase().includes(term) ||
            (a.tags ?? []).some((t) => t.toLowerCase().includes(term))
          : true
      );
  }, [articles, featured, activeCat, search]);

  const trendingTags = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of articles) {
      for (const t of a.tags ?? []) map.set(t, (map.get(t) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [articles]);

  const handleClearFilters = () => {
    setActiveCat(null);
    setSearch('');
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <Navigation />
      <main className="pt-20 md:pl-64 pb-xl max-w-max-width mx-auto px-gutter grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <div className="lg:col-span-8 space-y-xl">
          {/* Page header with search */}
          <header className="space-y-lg">
            <div>
              <p className="text-primary font-label-bold tracking-widest mb-xs">
                PORTAL BERITA
              </p>
              <h1 className="font-h1 text-h1 text-on-surface">Suara &amp; Update Sura</h1>
              <div className="flex flex-wrap items-center justify-between gap-md mt-xs">
                <p className="font-body-md text-on-surface-variant">
                  Berita terkini, pengumuman resmi, dan tips keamanan dari moderator Sura.
                </p>
                {isAdmin && (
                  <a
                    href="/admin/berita"
                    className="inline-flex items-center gap-xs px-md py-sm bg-primary text-on-primary rounded-full font-button hover:brightness-110 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Buat Berita Baru
                  </a>
                )}
              </div>
            </div>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul, kata kunci, atau tag..."
                className="w-full pl-12 pr-4 py-md bg-surface-container-low border border-outline-variant rounded-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-md top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant hover:text-on-surface"
                  aria-label="Hapus pencarian"
                >
                  close
                </button>
              )}
            </div>

            {/* Category chips */}
            {categories.length > 0 && (
              <div className="flex gap-sm overflow-x-auto pb-xs hide-scrollbar">
                <CategoryChip
                  active={activeCat === null}
                  onClick={() => setActiveCat(null)}
                  icon="grid_view"
                  label="Semua"
                  count={articles.length}
                />
                {categories.map(([name, n]) => {
                  const meta = CATEGORY_META[name];
                  return (
                    <CategoryChip
                      key={name}
                      active={activeCat === name}
                      onClick={() =>
                        setActiveCat((prev) => (prev === name ? null : name))
                      }
                      icon={meta?.icon ?? 'article'}
                      label={name}
                      count={n}
                    />
                  );
                })}
              </div>
            )}
          </header>

          {error && (
            <p className="p-md bg-error-container text-error rounded-lg">{error}</p>
          )}

          {loading && <NewsSkeleton />}

          {/* Featured hero (only when not filtering) */}
          {!loading && !activeCat && !search && featured && (
            <section aria-labelledby="headline-title">
              <button
                type="button"
                onClick={() => setOpen(featured)}
                className="block w-full text-left relative overflow-hidden rounded-2xl bg-surface-container shadow-md hover:shadow-xl transition-shadow group"
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-primary to-primary-container overflow-hidden">
                  {featured.imageUrl ? (
                    <img
                      alt={featured.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={featured.imageUrl}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-lg md:p-xl">
                  <div className="flex flex-wrap gap-xs mb-md">
                    <span className="bg-error text-on-error text-label-bold px-md py-xs rounded-full uppercase">
                      🔥 Berita Utama
                    </span>
                    {featured.category && (
                      <span className="bg-white/20 backdrop-blur text-white text-label-bold px-md py-xs rounded-full">
                        {featured.category}
                      </span>
                    )}
                  </div>
                  <h2
                    className="font-h1 text-h2 md:text-h1 text-white mb-sm leading-tight max-w-3xl"
                    id="headline-title"
                  >
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="text-white/90 font-body-md line-clamp-2 max-w-2xl">
                      {featured.excerpt}
                    </p>
                  )}
                  <div className="mt-md flex items-center gap-sm text-white/80 text-body-sm">
                    <span className="material-symbols-outlined text-sm">person</span>
                    <span>{featured.author}</span>
                    <span className="opacity-50">•</span>
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    <span>{formatDate(featured.publishedAt)}</span>
                    <span className="opacity-50">•</span>
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    <span>{featured.viewCount.toLocaleString('id-ID')} dilihat</span>
                  </div>
                </div>
              </button>
            </section>
          )}

          {/* Article grid */}
          {!loading && (
            <section aria-labelledby="latest-news-title">
              <div className="flex flex-wrap justify-between items-center gap-md mb-lg">
                <h2 className="font-h2 text-h2 text-primary" id="latest-news-title">
                  {activeCat
                    ? `Kategori: ${activeCat}`
                    : search
                      ? `Hasil "${search}"`
                      : 'Artikel Terbaru'}
                </h2>
                <span className="text-body-sm text-on-surface-variant">
                  {filtered.length} artikel
                </span>
              </div>

              {filtered.length === 0 ? (
                <div className="p-xl bg-surface-container-low border border-dashed border-outline-variant rounded-2xl text-center">
                  <span className="material-symbols-outlined text-[48px] text-outline">
                    inbox
                  </span>
                  <p className="text-on-surface-variant mt-md">
                    Tidak ada artikel pada filter ini.
                  </p>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="mt-md text-primary font-button hover:underline"
                  >
                    Bersihkan filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  {filtered.map((a) => (
                    <NewsCard key={a.id} article={a} onOpen={() => setOpen(a)} />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-lg">
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm">
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-h3 text-h3 text-primary flex items-center gap-sm">
                <span className="material-symbols-outlined">category</span>
                Kategori
              </h3>
              {(activeCat || search) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-primary font-button text-body-sm hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
            <ul className="space-y-xs">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveCat(null)}
                  className={`w-full flex items-center justify-between p-md rounded-xl transition-all ${
                    activeCat === null
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-low hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined">grid_view</span>
                    <span className="font-body-md">Semua Berita</span>
                  </div>
                  <span
                    className={`text-label-bold px-sm py-xs rounded-full ${
                      activeCat === null
                        ? 'bg-white/20 text-white'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {articles.length}
                  </span>
                </button>
              </li>
              {categories.map(([cat, n]) => {
                const meta = CATEGORY_META[cat];
                const isActive = activeCat === cat;
                return (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => setActiveCat(isActive ? null : cat)}
                      className={`w-full flex items-center justify-between p-md rounded-xl transition-all ${
                        isActive
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center gap-sm">
                        <span
                          className={`material-symbols-outlined ${
                            isActive ? '' : meta?.color ?? 'text-primary'
                          }`}
                        >
                          {meta?.icon ?? 'article'}
                        </span>
                        <span className="font-body-md text-left">{cat}</span>
                      </div>
                      <span
                        className={`text-label-bold px-sm py-xs rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {n}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {trendingTags.length > 0 && (
            <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm">
              <h3 className="font-label-bold text-on-surface-variant mb-md tracking-widest flex items-center gap-sm">
                <span className="material-symbols-outlined text-error">whatshot</span>
                TOPIK HANGAT
              </h3>
              <div className="flex flex-wrap gap-sm">
                {trendingTags.map(([tag, n]) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setSearch(tag)}
                    className="text-body-sm px-md py-xs bg-surface-container border border-outline-variant rounded-full text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
                  >
                    #{tag}
                    <span className="ml-xs text-outline">{n}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-2xl p-lg shadow-md">
            <span className="material-symbols-outlined text-3xl mb-sm block">campaign</span>
            <h3 className="font-h3 text-h3 mb-xs">Lapor Cepat</h3>
            <p className="text-body-sm opacity-90 mb-md">
              Punya kejadian penting? Sampaikan langsung ke pihak terkait.
            </p>
            <a
              href="/lapor"
              className="inline-flex items-center gap-xs px-md py-sm bg-on-primary text-primary rounded-full font-button hover:scale-105 transition-transform"
            >
              Buat Laporan
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </section>
        </aside>
      </main>

      {/* Article modal */}
      {open && (
        <div
          className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-lg"
          onClick={() => setOpen(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface w-full max-w-3xl rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200"
          >
            <div className="relative">
              {open.imageUrl && (
                <img
                  alt={open.title}
                  src={open.imageUrl}
                  className="w-full aspect-video object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="absolute top-md right-md bg-surface/95 backdrop-blur w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-surface"
                aria-label="Tutup"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-lg md:p-xl">
              <div className="flex flex-wrap gap-sm items-center mb-md">
                {open.category && (
                  <span
                    className={`px-md py-xs rounded-full font-label-bold ${
                      CATEGORY_META[open.category]?.bg ?? 'bg-secondary-container'
                    } ${CATEGORY_META[open.category]?.color ?? 'text-on-secondary-container'}`}
                  >
                    {open.category}
                  </span>
                )}
                <span className="text-on-surface-variant text-body-sm">
                  {formatDate(open.publishedAt)}
                </span>
                <span className="text-outline">•</span>
                <span className="text-on-surface-variant text-body-sm">{open.author}</span>
              </div>
              <h1 className="font-h1 text-h2 md:text-h1 text-on-surface mb-md">{open.title}</h1>
              {open.excerpt && (
                <p className="text-h3 text-on-surface-variant mb-lg leading-relaxed">
                  {open.excerpt}
                </p>
              )}
              <article className="prose prose-base max-w-none mt-md space-y-md font-body-md text-on-surface whitespace-pre-line leading-relaxed">
                {open.content}
              </article>
              {(open.tags ?? []).length > 0 && (
                <div className="mt-lg pt-lg border-t border-outline-variant flex flex-wrap gap-sm">
                  {open.tags.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setSearch(t);
                        setOpen(null);
                      }}
                      className="text-body-sm px-md py-xs bg-surface-container border border-outline-variant rounded-full hover:border-primary hover:text-primary transition-colors"
                    >
                      #{t}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-lg pt-lg border-t border-outline-variant flex items-center justify-between text-body-sm text-on-surface-variant">
                <span className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  {open.viewCount.toLocaleString('id-ID')} kali dilihat
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  className="text-primary font-button hover:underline"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function CategoryChip({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-xs px-md py-2 rounded-full font-button text-body-sm whitespace-nowrap border transition-all ${
        active
          ? 'bg-primary text-on-primary border-primary shadow-sm'
          : 'bg-surface-container-low border-outline-variant text-on-surface hover:border-primary hover:text-primary'
      }`}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      {label}
      <span
        className={`ml-xs text-[10px] font-bold px-xs rounded ${
          active ? 'bg-white/20' : 'bg-surface-container-high text-on-surface-variant'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function NewsCard({
  article,
  onOpen,
}: {
  article: NewsArticle;
  onOpen: () => void;
}) {
  const meta = article.category ? CATEGORY_META[article.category] : undefined;
  return (
    <article className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-outline-variant/30 flex flex-col group">
      <button
        type="button"
        onClick={onOpen}
        className="text-left flex-1 flex flex-col"
      >
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-container to-secondary-container">
          {article.imageUrl ? (
            <img
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src={article.imageUrl}
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[80px] text-white/40">
                {meta?.icon ?? 'article'}
              </span>
            </div>
          )}
          {article.category && (
            <div className="absolute top-sm left-sm">
              <span
                className={`text-label-bold px-md py-xs rounded-full backdrop-blur shadow-sm ${
                  meta?.bg ?? 'bg-secondary-container'
                } ${meta?.color ?? 'text-on-secondary-container'}`}
              >
                {article.category}
              </span>
            </div>
          )}
          <div className="absolute bottom-sm right-sm flex items-center gap-xs px-sm py-xs bg-black/60 backdrop-blur text-white text-[10px] font-bold rounded-full">
            <span className="material-symbols-outlined text-[14px]">visibility</span>
            {article.viewCount}
          </div>
        </div>
        <div className="p-md flex-grow flex flex-col">
          <time className="text-on-surface-variant text-body-sm mb-xs flex items-center gap-xs">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            {formatDate(article.publishedAt)}
          </time>
          <h3 className="font-h3 text-h3 text-on-surface mb-sm line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-on-surface-variant text-body-sm mb-md line-clamp-3 flex-1">
            {article.excerpt ?? article.content.slice(0, 160) + '...'}
          </p>
          <div className="mt-auto pt-sm border-t border-outline-variant/40 flex items-center justify-between">
            <span className="text-body-sm text-on-surface-variant flex items-center gap-xs">
              <span className="material-symbols-outlined text-[16px]">person</span>
              {article.author}
            </span>
            <span className="text-primary font-button flex items-center gap-xs group-hover:gap-sm transition-all">
              Baca
              <span className="material-symbols-outlined text-body-md">arrow_forward</span>
            </span>
          </div>
        </div>
      </button>
    </article>
  );
}

function NewsSkeleton() {
  return (
    <div className="space-y-xl">
      <div className="aspect-[16/9] bg-surface-container-high rounded-2xl animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/30"
          >
            <div className="h-48 bg-surface-container-high animate-pulse" />
            <div className="p-md space-y-sm">
              <div className="h-3 bg-surface-container-high rounded w-1/3 animate-pulse" />
              <div className="h-5 bg-surface-container-high rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-surface-container-high rounded w-full animate-pulse" />
              <div className="h-3 bg-surface-container-high rounded w-5/6 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PortalBerita;
