import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { api, formatDate, type NewsArticle } from '../lib/api';

const AdminKelolaBerita: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    title: '',
    excerpt: '',
    category: '',
    isFeatured: false,
    isPublished: true,
  });

  const loadArticles = () => {
    setLoading(true);
    api
      .getAllNewsAdmin(100)
      .then(setArticles)
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Gagal memuat berita');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus berita ini?')) return;

    setDeleteId(id);
    try {
      await api.deleteNews(id);
      setArticles(articles.filter((a) => a.id !== id));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus berita');
    } finally {
      setDeleteId(null);
    }
  };

  const handleEditOpen = (article: NewsArticle) => {
    setEditId(article.id);
    setEditData({
      title: article.title,
      excerpt: article.excerpt || '',
      category: article.category || '',
      isFeatured: article.isFeatured,
      isPublished: article.isPublished ?? true,
    });
  };

  const handleEditSave = async () => {
    if (!editId) return;

    try {
      await api.updateNews(editId, editData);
      loadArticles();
      setEditId(null);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal update berita');
    }
  };

  const handleTogglePublish = async (article: NewsArticle) => {
    try {
      await api.updateNews(article.id, {
        isPublished: !article.isPublished,
      });
      loadArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal update status');
    }
  };

  const handleToggleFeatured = async (article: NewsArticle) => {
    try {
      await api.updateNews(article.id, {
        isFeatured: !article.isFeatured,
      });
      loadArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal update featured');
    }
  };

  return (
    <div className="bg-background dark:bg-surface text-on-surface min-h-screen">
      <Navigation />
      <main className="pt-20 md:pl-64 pb-xl px-gutter max-w-7xl mx-auto">
        <header className="mb-lg">
          <nav className="flex items-center gap-xs mb-md text-on-surface-variant dark:text-on-surface-variant text-body-sm">
            <button onClick={() => navigate('/admin')} className="hover:text-primary dark:hover:text-primary transition-colors">
              Admin
            </button>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-semibold text-primary dark:text-primary">Kelola Berita</span>
          </nav>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-h1 text-h1 text-on-surface dark:text-on-surface">Kelola Berita</h1>
              <p className="text-body-md text-on-surface-variant dark:text-on-surface-variant mt-xs">
                Edit, hapus, atau ubah status berita yang sudah dibuat.
              </p>
            </div>
            <Link
              to="/admin/berita"
              className="px-lg py-md bg-primary dark:bg-primary text-on-primary dark:text-on-primary font-button rounded-xl shadow-lg hover:brightness-110 flex items-center gap-sm"
            >
              <span className="material-symbols-outlined">add</span>
              Buat Berita Baru
            </Link>
          </div>
        </header>

        {error && (
          <div className="p-md bg-error-container text-error rounded-xl flex items-start gap-sm mb-lg">
            <span className="material-symbols-outlined">error</span>
            <p className="text-body-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-xl">
            <span className="material-symbols-outlined text-[48px] text-outline dark:text-outline animate-spin">progress_activity</span>
            <p className="text-on-surface-variant dark:text-on-surface-variant mt-md">Memuat berita...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl p-xl text-center border border-outline-variant dark:border-outline">
            <span className="material-symbols-outlined text-[64px] text-outline dark:text-outline">
              article
            </span>
            <h3 className="font-h3 text-h3 text-on-surface dark:text-on-surface mt-md">Belum Ada Berita</h3>
            <p className="text-on-surface-variant dark:text-on-surface-variant mt-xs">
              Mulai buat berita pertama Anda.
            </p>
            <Link
              to="/admin/berita"
              className="inline-flex items-center gap-sm mt-lg px-lg py-md bg-primary dark:bg-primary text-on-primary dark:text-on-primary font-button rounded-xl hover:brightness-110"
            >
              <span className="material-symbols-outlined">add</span>
              Buat Berita
            </Link>
          </div>
        ) : (
          <div className="space-y-md">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl border border-outline-variant dark:border-outline shadow-sm overflow-hidden"
              >
                <div className="p-lg">
                  <div className="flex items-start justify-between gap-md mb-md">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-sm mb-sm">
                        {article.isFeatured && (
                          <span className="px-sm py-xs bg-error text-on-error rounded-full text-[10px] font-bold flex items-center gap-xs">
                            <span className="material-symbols-outlined text-[14px]">whatshot</span>
                            UTAMA
                          </span>
                        )}
                        {article.category && (
                          <span className="px-sm py-xs bg-secondary-container dark:bg-secondary-container text-on-secondary-container dark:text-on-secondary-container rounded-full text-[10px] font-bold">
                            {article.category}
                          </span>
                        )}
                        <span className={`px-sm py-xs rounded-full text-[10px] font-bold ${
                          article.isPublished
                            ? 'bg-primary-container dark:bg-primary-container text-on-primary-container dark:text-on-primary-container'
                            : 'bg-surface-container dark:bg-surface-container-high text-on-surface-variant dark:text-on-surface-variant'
                        }`}>
                          {article.isPublished ? '✓ PUBLISHED' : 'DRAFT'}
                        </span>
                      </div>
                      {editId === article.id ? (
                        <input
                          type="text"
                          value={editData.title}
                          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                          className="w-full px-md py-sm bg-surface-container dark:bg-surface-container-high border border-outline-variant dark:border-outline rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary outline-none text-on-surface dark:text-on-surface font-bold"
                        />
                      ) : (
                        <h3 className="font-h3 text-h3 text-on-surface dark:text-on-surface mb-xs line-clamp-2">
                          {article.title}
                        </h3>
                      )}
                      {editId === article.id ? (
                        <textarea
                          value={editData.excerpt}
                          onChange={(e) => setEditData({ ...editData, excerpt: e.target.value })}
                          className="w-full px-md py-sm bg-surface-container dark:bg-surface-container-high border border-outline-variant dark:border-outline rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-primary outline-none text-on-surface dark:text-on-surface text-body-sm mt-sm"
                          rows={2}
                          placeholder="Ringkasan..."
                        />
                      ) : (
                        <p className="text-on-surface-variant dark:text-on-surface-variant text-body-sm line-clamp-2">
                          {article.excerpt || 'Tidak ada ringkasan'}
                        </p>
                      )}
                    </div>
                    {article.imageUrl && (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-32 h-24 object-cover rounded-lg border border-outline-variant dark:border-outline flex-shrink-0"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-md text-body-sm text-on-surface-variant dark:text-on-surface-variant mb-md">
                    <span className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[16px]">person</span>
                      {article.author}
                    </span>
                    <span className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      {formatDate(article.publishedAt || article.createdAt)}
                    </span>
                    <span className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      {article.viewCount}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-sm">
                    {editId === article.id ? (
                      <>
                        <button
                          onClick={handleEditSave}
                          className="px-md py-sm bg-primary dark:bg-primary text-on-primary dark:text-on-primary font-button rounded-lg hover:brightness-110 flex items-center gap-xs"
                        >
                          <span className="material-symbols-outlined text-[18px]">save</span>
                          Simpan
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="px-md py-sm bg-surface-container dark:bg-surface-container-high text-on-surface dark:text-on-surface font-button rounded-lg hover:bg-surface-container-high dark:hover:bg-surface-container-highest"
                        >
                          Batal
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditOpen(article)}
                          className="px-md py-sm bg-surface-container dark:bg-surface-container-high text-on-surface dark:text-on-surface font-button rounded-lg hover:bg-surface-container-high dark:hover:bg-surface-container-highest flex items-center gap-xs"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                          Edit
                        </button>
                        <button
                          onClick={() => handleTogglePublish(article)}
                          className={`px-md py-sm font-button rounded-lg flex items-center gap-xs ${
                            article.isPublished
                              ? 'bg-surface-container dark:bg-surface-container-high text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest'
                              : 'bg-primary dark:bg-primary text-on-primary dark:text-on-primary hover:brightness-110'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {article.isPublished ? 'visibility_off' : 'visibility'}
                          </span>
                          {article.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(article)}
                          className={`px-md py-sm font-button rounded-lg flex items-center gap-xs ${
                            article.isFeatured
                              ? 'bg-error dark:bg-error text-on-error dark:text-on-error'
                              : 'bg-surface-container dark:bg-surface-container-high text-on-surface dark:text-on-surface hover:bg-surface-container-high dark:hover:bg-surface-container-highest'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {article.isFeatured ? 'star' : 'star_outline'}
                          </span>
                          {article.isFeatured ? 'Featured' : 'Set Featured'}
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          disabled={deleteId === article.id}
                          className="px-md py-sm bg-error-container dark:bg-error-container/50 text-error dark:text-error font-button rounded-lg hover:brightness-90 disabled:opacity-50 flex items-center gap-xs ml-auto"
                        >
                          {deleteId === article.id ? (
                            <>
                              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                              Menghapus...
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                              Hapus
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminKelolaBerita;
