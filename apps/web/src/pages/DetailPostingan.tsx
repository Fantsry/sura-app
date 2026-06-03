import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import {
  api,
  formatDateTime,
  getStoredUser,
  type ForumPost,
} from '../lib/api';

type CommentType = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
  } | null;
};

const DetailPostingan: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const id = params.get('id');

  const [post, setPost] = useState<(ForumPost & { comments: CommentType[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reply, setReply] = useState('');
  const [posting, setPosting] = useState(false);
  const [liked, setLiked] = useState(false);

  const me = getStoredUser();

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.getForumPost(id);
      setPost(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Postingan tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      navigate('/komunitas');
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !id) return;
    if (!me) {
      navigate('/masuk');
      return;
    }
    setPosting(true);
    try {
      await api.createForumComment(id, reply.trim());
      setReply('');
      // Reload comments and update commentCount
      const data = await api.getForumPost(id);
      setPost(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim komentar');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async () => {
    if (!id) return;
    if (!me) {
      navigate('/masuk');
      return;
    }
    if (liked) return; // Prevent multiple likes in current session
    try {
      const res = await api.likeForumPost(id);
      setPost((prev) => prev ? { ...prev, likeCount: res.likeCount } : null);
      setLiked(true);
    } catch (err) {
      console.error('Gagal menyukai postingan:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <Navigation />
        <main className="pt-20 md:pl-64 px-gutter py-xl">
          <div className="max-w-[1280px] mx-auto animate-pulse space-y-md">
            <div className="h-6 w-32 bg-surface-container-low rounded"></div>
            <div className="h-10 w-3/4 bg-surface-container-low rounded"></div>
            <div className="h-40 w-full bg-surface-container-low rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-background min-h-screen">
        <Navigation />
        <main className="pt-20 md:pl-64 px-gutter py-xl">
          <p className="p-md bg-error-container text-error rounded-lg">
            {error || 'Postingan tidak ditemukan'}
          </p>
          <Link to="/komunitas" className="mt-md inline-block text-primary font-button">
            ← Kembali ke Komunitas
          </Link>
        </main>
      </div>
    );
  }

  const initials = (post.author?.fullName ?? 'A')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <Navigation />
      <main className="pt-20 md:pl-64 pb-xl">
        <div className="max-w-[1280px] mx-auto px-gutter py-md">
          <nav className="flex items-center gap-xs mb-lg text-on-surface-variant font-body-sm">
            <Link className="hover:text-primary transition-colors" to="/komunitas">
              Komunitas
            </Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-semibold text-primary line-clamp-1 max-w-md">
              Detail Diskusi
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-xl">
              <article className="bg-surface-container-lowest rounded-2xl p-xl shadow-sm border border-outline-variant/30">
                <div className="flex flex-wrap items-center justify-between gap-sm mb-md">
                  <div className="flex items-center gap-sm">
                    <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold">
                      {initials}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">
                        {post.author?.fullName ?? 'Anonim'}
                      </p>
                      <p className="text-body-sm text-on-surface-variant">
                        @{post.author?.username ?? 'anonim'} • {formatDateTime(post.createdAt)}
                      </p>
                    </div>
                  </div>
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

                <h2 className="font-h1 text-h1 text-on-surface mb-md leading-snug">
                  {post.title}
                </h2>
                <p className="text-on-surface-variant font-body-lg whitespace-pre-line mb-xl">
                  {post.content}
                </p>

                {(post.tags ?? []).length > 0 && (
                  <div className="mb-xl flex flex-wrap gap-xs">
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="px-sm py-xs bg-surface-container-low border border-outline-variant rounded-full text-[10px] text-on-surface-variant"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-md pt-md border-t border-outline-variant/30 text-body-sm text-on-surface-variant">
                  <button
                    type="button"
                    onClick={handleLike}
                    className={`flex items-center gap-xs px-md py-sm rounded-full transition-colors font-semibold ${
                      liked 
                        ? 'bg-primary-container text-primary' 
                        : 'hover:bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {liked ? 'thumb_up_filled' : 'thumb_up'}
                    </span>
                    <span>{post.likeCount} Suka</span>
                  </button>
                  <span className="flex items-center gap-xs px-md py-sm">
                    <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                    <span>{post.commentCount} Komentar</span>
                  </span>
                  <span className="flex items-center gap-xs px-md py-sm">
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                    <span>{post.viewCount} Dilihat</span>
                  </span>
                </div>
              </article>

              {/* Discussion Section */}
              <section className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
                <div className="p-lg border-b border-outline-variant/20 bg-surface-container-low">
                  <h3 className="font-h3 text-h3 text-on-surface">Komentar & Tanggapan</h3>
                  <p className="text-body-sm text-on-surface-variant mt-xs">
                    {post.comments?.length ?? 0} tanggapan diskusi
                  </p>
                </div>

                <div className="p-lg space-y-lg max-h-[500px] overflow-y-auto bg-surface-container-lowest">
                  {(post.comments ?? []).length === 0 ? (
                    <p className="text-on-surface-variant text-body-sm py-md text-center">
                      Belum ada tanggapan. Mulailah percakapan dengan mengetik komentar di bawah.
                    </p>
                  ) : (
                    post.comments.map((c) => {
                      const commentInitials = (c.author?.fullName ?? 'U')
                        .split(' ')
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase();
                      return (
                        <div key={c.id} className="flex gap-md">
                          <div className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold flex-shrink-0 text-xs">
                            {commentInitials}
                          </div>
                          <div className="p-md rounded-xl bg-surface-container-high rounded-tl-none flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-xs">
                              <p className="font-label-bold text-on-surface line-clamp-1">
                                {c.author?.fullName ?? 'Pengguna'}
                              </p>
                              <span className="text-[10px] text-outline">
                                {formatDateTime(c.createdAt)}
                              </span>
                            </div>
                            <p className="font-body-md text-on-surface-variant whitespace-pre-line break-words">
                              {c.content}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="p-lg border-t border-outline-variant/20 flex gap-md items-center bg-surface-container-low"
                >
                  <input
                    className="flex-1 bg-surface-container px-md py-sm rounded-lg border-none focus:ring-2 focus:ring-primary/20 outline-none text-body-md"
                    placeholder={me ? 'Tulis tanggapan Anda...' : 'Masuk untuk ikut berdiskusi'}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    disabled={!me || posting}
                  />
                  <button
                    type="submit"
                    disabled={!me || posting || !reply.trim()}
                    className="bg-primary text-on-primary p-md rounded-lg flex items-center justify-center hover:shadow-lg transition-all active:scale-95 disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </form>
              </section>
            </div>

            {/* Sidebar Guidelines */}
            <div className="lg:col-span-4 space-y-xl">
              <section className="bg-surface-container-lowest rounded-2xl p-xl shadow-sm border border-outline-variant/30">
                <h3 className="font-h3 text-h3 text-on-surface mb-md">Tentang Diskusi</h3>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  Forum warga adalah wadah musyawarah online yang bebas dan terbuka untuk seluruh warga Sura.
                  Anda dapat menyukai postingan atau menambahkan tanggapan di kolom komentar.
                </p>
              </section>

              <section className="bg-primary-container text-on-primary-container rounded-2xl p-xl shadow-md">
                <div className="flex items-center gap-md mb-md">
                  <span className="material-symbols-outlined">gavel</span>
                  <h3 className="font-h3 text-h3">Ketentuan Forum</h3>
                </div>
                <ul className="space-y-sm text-body-sm opacity-90">
                  <li className="flex gap-sm">
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    <span>Saling menghargai pendapat sesama warga.</span>
                  </li>
                  <li className="flex gap-sm">
                    <span className="material-symbols-outlined text-[18px]">block</span>
                    <span>Dilarang menyebarkan hoax, spam, atau iklan.</span>
                  </li>
                  <li className="flex gap-sm">
                    <span className="material-symbols-outlined text-[18px]">report</span>
                    <span>Laporan formal/resmi ke aparat harus diajukan di menu "Buat Laporan".</span>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailPostingan;
