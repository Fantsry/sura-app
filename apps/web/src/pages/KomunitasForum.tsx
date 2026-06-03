import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import {
  api,
  formatRelative,
  getStoredUser,
  type ForumPost,
} from '../lib/api';

type SortKey = 'hot' | 'latest' | 'top';

const KomunitasForum: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; color: string }>
  >([]);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>('hot');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.getForumCategories().catch(() => []),
      api.getForumPosts({ limit: 50 }).catch(() => []),
    ])
      .then(([cats, all]) => {
        setCategories(cats);
        setPosts(all);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Gagal memuat forum')
      )
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = posts;

    if (activeCat) list = list.filter((p) => p.category?.id === activeCat);
    if (term) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.content.toLowerCase().includes(term) ||
          (p.tags ?? []).some((t) => t.toLowerCase().includes(term))
      );
    }

    list = [...list];
    if (sort === 'latest') {
      list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sort === 'top') {
      list.sort((a, b) => b.likeCount - a.likeCount);
    } else {
      list.sort((a, b) => {
        const ap = (a.isPinned ? 999 : 0) + a.commentCount + a.likeCount;
        const bp = (b.isPinned ? 999 : 0) + b.commentCount + b.likeCount;
        return bp - ap;
      });
    }
    return list;
  }, [posts, activeCat, sort, search]);

  const trending = useMemo(() => {
    const tagCount = new Map<string, number>();
    for (const p of posts) {
      for (const t of p.tags ?? []) tagCount.set(t, (tagCount.get(t) ?? 0) + 1);
    }
    return Array.from(tagCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [posts]);

  const topAuthors = useMemo(() => {
    const map = new Map<string, { fullName: string; username: string; count: number }>();
    for (const p of posts) {
      if (!p.author) continue;
      const cur = map.get(p.author.id);
      if (cur) cur.count += 1;
      else
        map.set(p.author.id, {
          fullName: p.author.fullName,
          username: p.author.username,
          count: 1,
        });
    }
    return Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [posts]);

  const handleNew = () => {
    if (!getStoredUser()) {
      navigate('/masuk');
      return;
    }
    navigate('/buat-postingan');
  };

  const me = getStoredUser();

  const handleLikePost = async (postId: string) => {
    if (!me) {
      navigate('/masuk');
      return;
    }
    try {
      const res = await api.likeForumPost(postId);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likeCount: res.likeCount } : p))
      );
    } catch (err) {
      console.error('Gagal menyukai postingan:', err);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <Navigation />
      <main className="pt-20 pb-xl md:pl-64 min-h-screen">
        <div className="max-w-[1280px] mx-auto px-gutter grid grid-cols-1 md:grid-cols-12 gap-lg">
          <div className="md:col-span-8 flex flex-col gap-md">
            {/* Header */}
            <div>
              <p className="text-primary font-label-bold tracking-widest mb-xs">KOMUNITAS</p>
              <h1 className="font-h1 text-h1 text-on-surface">Diskusi Warga</h1>
              <p className="text-on-surface-variant mt-xs">
                Berbagi info, gosip, atau diskusi bebas. Tidak butuh verifikasi formal.
              </p>
            </div>

            {/* New post bar */}
            <div className="bg-surface-container-lowest rounded-2xl p-md border border-outline-variant shadow-sm flex items-center gap-md">
              <div className="h-10 w-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold flex-shrink-0">
                {(me?.fullName ?? 'U')
                  .split(' ')
                  .map((s) => s[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
              <button
                type="button"
                onClick={handleNew}
                className="flex-1 text-left bg-surface-container-low border border-outline-variant rounded-full px-md py-sm text-on-surface-variant hover:border-primary transition-colors"
              >
                Apa yang ingin Anda diskusikan hari ini?
              </button>
              <button
                type="button"
                onClick={handleNew}
                className="hidden sm:flex px-lg py-sm bg-primary text-on-primary rounded-full font-button items-center gap-xs hover:brightness-110"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Posting
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari postingan, tag, atau topik..."
                className="w-full pl-12 pr-4 py-md bg-surface-container-low border border-outline-variant rounded-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-md top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant"
                  aria-label="Hapus pencarian"
                >
                  close
                </button>
              )}
            </div>

            {/* Sort tabs + categories */}
            <div className="flex flex-col gap-sm">
              <div className="flex gap-xs overflow-x-auto hide-scrollbar">
                <SortTab
                  active={sort === 'hot'}
                  onClick={() => setSort('hot')}
                  icon="local_fire_department"
                  label="Hot"
                />
                <SortTab
                  active={sort === 'latest'}
                  onClick={() => setSort('latest')}
                  icon="schedule"
                  label="Terbaru"
                />
                <SortTab
                  active={sort === 'top'}
                  onClick={() => setSort('top')}
                  icon="trending_up"
                  label="Populer"
                />
              </div>
              {categories.length > 0 && (
                <div className="flex gap-xs overflow-x-auto hide-scrollbar pb-xs">
                  <CatChip
                    active={activeCat === null}
                    onClick={() => setActiveCat(null)}
                    label="Semua"
                  />
                  {categories.map((c) => (
                    <CatChip
                      key={c.id}
                      active={activeCat === c.id}
                      onClick={() =>
                        setActiveCat((prev) => (prev === c.id ? null : c.id))
                      }
                      label={c.name}
                      color={c.color}
                    />
                  ))}
                </div>
              )}
            </div>

            {error && (
              <p className="p-md bg-error-container text-error rounded-xl">{error}</p>
            )}

            {loading && (
              <div className="space-y-md">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-surface-container-low rounded-2xl border border-outline-variant p-lg h-32 animate-pulse"
                  />
                ))}
              </div>
            )}

            {!loading && visible.length === 0 && (
              <div className="p-xl bg-surface-container-low border border-dashed border-outline-variant rounded-2xl text-center">
                <span className="material-symbols-outlined text-[60px] text-outline">
                  forum
                </span>
                <p className="text-on-surface-variant mt-sm">
                  {search || activeCat
                    ? 'Tidak ada hasil. Coba bersihkan filter.'
                    : 'Belum ada postingan. Jadilah yang pertama!'}
                </p>
                <button
                  type="button"
                  onClick={handleNew}
                  className="mt-md px-lg py-md bg-primary text-on-primary rounded-full font-button"
                >
                  Buat Postingan
                </button>
              </div>
            )}

            {visible.map((p) => (
              <ForumPostCard 
                key={p.id} 
                post={p} 
                onLike={() => handleLikePost(p.id)}
                onDetail={() => navigate(`/komunitas/detail?id=${p.id}`)}
              />
            ))}
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-4 flex flex-col gap-lg">
            {trending.length > 0 && (
              <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
                <div className="p-md border-b border-outline-variant bg-gradient-to-br from-error to-error-container text-on-error">
                  <h4 className="font-h3 text-h3 flex items-center gap-sm">
                    <span className="material-symbols-outlined">whatshot</span>
                    Sedang Tren
                  </h4>
                  <p className="text-body-sm opacity-90 mt-xs">
                    {trending.length} tag populer
                  </p>
                </div>
                <ul className="p-sm">
                  {trending.map(([tag, n], i) => (
                    <li key={tag}>
                      <button
                        type="button"
                        onClick={() => setSearch(tag)}
                        className="w-full flex items-center justify-between p-sm rounded-xl hover:bg-surface-container transition-colors text-left"
                      >
                        <div className="flex items-center gap-sm">
                          <span className="text-outline font-bold text-h3 w-6">
                            {i + 1}
                          </span>
                          <div>
                            <p className="font-bold text-primary">#{tag}</p>
                            <p className="text-body-sm text-on-surface-variant">
                              {n} diskusi
                            </p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-outline">
                          arrow_outward
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {topAuthors.length > 0 && (
              <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-lg">
                <h4 className="font-h3 text-h3 text-on-surface mb-md flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">leaderboard</span>
                  Top Kontributor
                </h4>
                <ul className="space-y-sm">
                  {topAuthors.map((a) => (
                    <li
                      key={a.username}
                      className="flex items-center gap-sm"
                    >
                      <div className="w-9 h-9 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold flex-shrink-0">
                        {a.fullName
                          .split(' ')
                          .map((s) => s[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-on-surface line-clamp-1">
                          {a.fullName}
                        </p>
                        <p className="text-body-sm text-on-surface-variant">
                          @{a.username}
                        </p>
                      </div>
                      <span className="text-body-sm font-bold text-primary">
                        {a.count} post
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-2xl shadow-md p-lg">
              <span className="material-symbols-outlined text-3xl mb-sm block">groups</span>
              <h4 className="font-h3 text-h3 mb-xs">Aturan Singkat</h4>
              <ul className="space-y-sm text-body-sm opacity-95">
                <li className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Etika dulu — tidak ada SARA atau ujaran kebencian.</span>
                </li>
                <li className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Verifikasi info sebelum posting.</span>
                </li>
                <li className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Untuk laporan resmi gunakan menu Buat Laporan.</span>
                </li>
              </ul>
              <Link
                to="/lapor"
                className="mt-md inline-flex items-center gap-xs px-md py-sm bg-on-primary text-primary rounded-full font-button"
              >
                Lapor sekarang
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </section>
          </aside>
        </div>
      </main>

      <button
        type="button"
        onClick={handleNew}
        className="fixed bottom-20 right-gutter md:bottom-lg md:right-lg h-14 w-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all z-40"
        aria-label="Buat postingan"
      >
        <span className="material-symbols-outlined text-[32px]">add</span>
      </button>
    </div>
  );
};

function ForumPostCard({ 
  post, 
  onLike, 
  onDetail 
}: { 
  post: ForumPost; 
  onLike: () => void; 
  onDetail: () => void; 
}) {
  const initials = (post.author?.fullName ?? 'A')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <article 
      onClick={onDetail}
      className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm hover:shadow-md hover:border-primary/40 transition-all overflow-hidden cursor-pointer"
    >
      <div className="p-md md:p-lg">
        <div className="flex items-center gap-sm mb-md flex-wrap">
          <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-on-surface line-clamp-1">
              {post.author?.fullName ?? 'Anonim'}
            </p>
            <p className="text-body-sm text-on-surface-variant">
              @{post.author?.username ?? 'anonim'} • {formatRelative(post.createdAt)}
            </p>
          </div>
          {post.isPinned && (
            <span className="bg-error text-on-error px-sm py-xs rounded-full text-[10px] font-bold uppercase flex items-center gap-xs">
              <span className="material-symbols-outlined text-[14px]">push_pin</span>
              Pinned
            </span>
          )}
          {post.category && (
            <span
              className="px-sm py-xs rounded-full text-[10px] font-bold uppercase"
              style={{
                backgroundColor: `${post.category.color}22`,
                color: post.category.color,
              }}
            >
              {post.category.name}
            </span>
          )}
        </div>

        <h3 className="font-h3 text-h3 text-on-surface mb-sm leading-snug">
          {post.title}
        </h3>
        <p className="font-body-md text-on-surface-variant whitespace-pre-line line-clamp-4">
          {post.content}
        </p>

        {(post.tags ?? []).length > 0 && (
          <div className="mt-md flex flex-wrap gap-xs">
            {post.tags.slice(0, 5).map((t) => (
              <span
                key={t}
                className="px-sm py-xs bg-surface-container-low border border-outline-variant rounded-full text-[10px] text-on-surface-variant"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="border-t border-outline-variant/40 px-md md:px-lg py-sm flex items-center gap-md text-body-sm text-on-surface-variant bg-surface-container-low/40">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
          className="flex items-center gap-xs hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">thumb_up</span>
          {post.likeCount}
        </button>
        <span className="flex items-center gap-xs">
          <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
          {post.commentCount}
        </span>
        <span className="flex items-center gap-xs">
          <span className="material-symbols-outlined text-[18px]">visibility</span>
          {post.viewCount}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDetail();
          }}
          className="ml-auto text-primary font-button hover:underline cursor-pointer"
        >
          Lihat diskusi
        </button>
      </div>
    </article>
  );
}

function SortTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-md py-sm rounded-full font-button text-body-sm flex items-center gap-xs whitespace-nowrap border transition-all ${
        active
          ? 'bg-primary text-on-primary border-primary shadow-sm'
          : 'bg-surface-container-low border-outline-variant text-on-surface-variant hover:border-primary/50'
      }`}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      {label}
    </button>
  );
}

function CatChip({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-md py-xs rounded-full text-body-sm border whitespace-nowrap transition-all ${
        active
          ? 'border-primary text-primary font-bold'
          : 'border-outline-variant text-on-surface-variant hover:border-primary/50'
      }`}
      style={
        active && color
          ? { backgroundColor: `${color}22`, color, borderColor: color }
          : undefined
      }
    >
      {label}
    </button>
  );
}

export default KomunitasForum;
