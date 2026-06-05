import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { api } from '../lib/api';

const CATEGORIES = [
  { value: 'Tips Keamanan', icon: 'security' },
  { value: 'Info Bencana', icon: 'emergency' },
  { value: 'Kegiatan Komunitas', icon: 'groups' },
  { value: 'Pengumuman Resmi', icon: 'campaign' },
];

const AdminBerita: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    setImageFile(file);
    setUploading(true);
    setError('');

    try {
      const result = await api.uploadImage(file);
      setImageUrl(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal upload gambar');
      setImageFile(null);
    } finally {
      setUploading(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag) return;
    if (tags.includes(tag)) {
      setError('Tag sudah ada');
      return;
    }
    if (tags.length >= 10) {
      setError('Maksimal 10 tag');
      return;
    }
    setTags([...tags, tag]);
    setTagInput('');
    setError('');
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      setError('Judul dan konten wajib diisi');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.createNews({
        title,
        excerpt: excerpt || undefined,
        content,
        category: category || undefined,
        imageUrl: imageUrl || undefined,
        isFeatured,
        tags: tags.length > 0 ? tags : undefined,
        isPublished: true,
      });

      navigate('/berita');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat berita');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background dark:bg-surface text-on-surface min-h-screen">
      <Navigation />
      <main className="pt-20 md:pl-64 pb-xl px-gutter max-w-5xl mx-auto">
        <header className="mb-lg">
          <nav className="flex items-center gap-xs mb-md text-on-surface-variant dark:text-on-surface-variant text-body-sm">
            <button onClick={() => navigate('/admin')} className="hover:text-primary dark:hover:text-primary transition-colors">
              Admin
            </button>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-semibold text-primary dark:text-primary">Buat Berita</span>
          </nav>
          <h1 className="font-h1 text-h1 text-on-surface dark:text-on-surface">Buat Berita Baru</h1>
          <p className="text-body-md text-on-surface-variant dark:text-on-surface-variant mt-xs">
            Buat dan publikasikan berita, pengumuman, atau tips untuk komunitas.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-lg">
          {error && (
            <div className="p-md bg-error-container text-error rounded-xl flex items-start gap-sm">
              <span className="material-symbols-outlined">error</span>
              <p className="text-body-sm">{error}</p>
            </div>
          )}

          <div className="bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl p-lg border border-outline-variant dark:border-outline shadow-sm space-y-lg">
            {/* Title */}
            <div>
              <label className="font-label-bold text-on-surface-variant dark:text-on-surface-variant uppercase block mb-sm">
                Judul Berita <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Peringatan Dini Cuaca Ekstrem di Jakarta"
                className="w-full px-md py-md bg-surface-container-low dark:bg-surface-container border border-outline-variant dark:border-outline rounded-xl focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:border-transparent outline-none text-on-surface dark:text-on-surface"
                maxLength={255}
                required
              />
              <p className="text-[10px] text-outline dark:text-outline mt-xs">
                {title.length}/255 karakter
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="font-label-bold text-on-surface-variant dark:text-on-surface-variant uppercase block mb-sm">
                Ringkasan (Opsional)
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Ringkasan singkat yang muncul di preview..."
                className="w-full px-md py-md bg-surface-container-low dark:bg-surface-container border border-outline-variant dark:border-outline rounded-xl focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:border-transparent outline-none text-on-surface dark:text-on-surface"
                rows={3}
                maxLength={500}
              />
              <p className="text-[10px] text-outline dark:text-outline mt-xs">
                {excerpt.length}/500 karakter
              </p>
            </div>

            {/* Content */}
            <div>
              <label className="font-label-bold text-on-surface-variant dark:text-on-surface-variant uppercase block mb-sm">
                Konten Berita <span className="text-error">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tulis konten lengkap berita di sini..."
                className="w-full px-md py-md bg-surface-container-low dark:bg-surface-container border border-outline-variant dark:border-outline rounded-xl focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:border-transparent outline-none text-on-surface dark:text-on-surface"
                rows={12}
                required
              />
              <p className="text-[10px] text-outline dark:text-outline mt-xs">
                {content.length} karakter - min. 20 karakter
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="font-label-bold text-on-surface-variant dark:text-on-surface-variant uppercase block mb-sm">
                Kategori
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(category === cat.value ? '' : cat.value)}
                    className={`p-md rounded-xl border-2 transition-all flex items-center gap-sm ${
                      category === cat.value
                        ? 'border-primary dark:border-primary bg-primary-fixed/40 dark:bg-primary/20'
                        : 'border-outline-variant dark:border-outline bg-surface-container-low dark:bg-surface-container hover:border-primary/40'
                    }`}
                  >
                    <span className={`material-symbols-outlined ${
                      category === cat.value ? 'text-primary dark:text-primary' : 'text-on-surface-variant dark:text-on-surface-variant'
                    }`}>
                      {cat.icon}
                    </span>
                    <span className={`font-body-sm ${
                      category === cat.value ? 'text-primary dark:text-primary font-bold' : 'text-on-surface dark:text-on-surface'
                    }`}>
                      {cat.value}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="font-label-bold text-on-surface-variant dark:text-on-surface-variant uppercase block mb-sm">
                Gambar Header
              </label>
              
              {/* Upload Button */}
              {!imageUrl && (
                <label className={`w-full px-md py-lg bg-surface-container dark:bg-surface-container-high border-2 border-dashed border-outline-variant dark:border-outline rounded-xl flex flex-col items-center justify-center gap-sm cursor-pointer hover:border-primary dark:hover:border-primary transition-all ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
                  <span className="material-symbols-outlined text-[48px] text-primary dark:text-primary">
                    {uploading ? 'hourglass_empty' : 'add_photo_alternate'}
                  </span>
                  <p className="font-button text-body-md text-on-surface dark:text-on-surface">
                    {uploading ? 'Mengupload...' : 'Klik untuk upload gambar'}
                  </p>
                  <p className="text-body-sm text-on-surface-variant dark:text-on-surface-variant">
                    JPG, PNG, WebP - Maks 5MB
                  </p>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              )}

              {/* Preview */}
              {imageUrl && (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-outline-variant dark:border-outline">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('');
                      setImageFile(null);
                    }}
                    className="absolute top-md right-md bg-error text-on-error w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:brightness-110"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              )}

              {/* Or URL Input */}
              {!imageFile && !imageUrl && (
                <>
                  <div className="relative my-md">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-outline-variant dark:border-outline"></div>
                    </div>
                    <div className="relative flex justify-center text-body-sm">
                      <span className="px-md bg-surface-container-lowest dark:bg-surface-container-low text-on-surface-variant dark:text-on-surface-variant">
                        atau masukkan URL gambar
                      </span>
                    </div>
                  </div>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://contoh.com/gambar.jpg"
                    className="w-full px-md py-md bg-surface-container-low dark:bg-surface-container border border-outline-variant dark:border-outline rounded-xl focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:border-transparent outline-none text-on-surface dark:text-on-surface"
                  />
                </>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="font-label-bold text-on-surface-variant dark:text-on-surface-variant uppercase block mb-sm">
                Tags (Maks 10)
              </label>
              <div className="flex gap-sm">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Ketik tag dan tekan Enter"
                  className="flex-1 px-md py-md bg-surface-container-low dark:bg-surface-container border border-outline-variant dark:border-outline rounded-xl focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:border-transparent outline-none text-on-surface dark:text-on-surface"
                  disabled={tags.length >= 10}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={tags.length >= 10}
                  className="px-md py-md bg-secondary dark:bg-secondary text-on-secondary dark:text-on-secondary rounded-xl font-button hover:brightness-110 disabled:opacity-50"
                >
                  Tambah
                </button>
              </div>
              <p className="text-body-sm text-on-surface-variant dark:text-on-surface-variant mt-xs">
                {tags.length}/10 tags
              </p>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-sm mt-md">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-md py-xs bg-surface-container dark:bg-surface-container-high border border-outline-variant dark:border-outline rounded-full text-body-sm text-on-surface dark:text-on-surface flex items-center gap-xs"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="material-symbols-outlined text-[16px] text-error hover:scale-110 transition-transform"
                      >
                        close
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Featured Toggle */}
            <label className="flex items-center gap-md p-md bg-surface-container dark:bg-surface-container-high rounded-xl border border-outline-variant dark:border-outline cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-5 h-5 rounded text-primary dark:text-primary"
              />
              <div>
                <p className="font-bold text-on-surface dark:text-on-surface flex items-center gap-xs">
                  <span className="material-symbols-outlined text-error">whatshot</span>
                  Jadikan Berita Utama
                </p>
                <p className="text-body-sm text-on-surface-variant dark:text-on-surface-variant">
                  Tampilkan berita ini di hero section halaman berita.
                </p>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-md justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              disabled={submitting}
              className="px-lg py-md bg-surface-container dark:bg-surface-container-high text-on-surface dark:text-on-surface font-button rounded-xl hover:bg-surface-container-high dark:hover:bg-surface-container-highest disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting || !title || !content}
              className="px-lg py-md bg-primary dark:bg-primary text-on-primary dark:text-on-primary font-button rounded-xl shadow-lg disabled:opacity-50 hover:brightness-110 flex items-center gap-sm"
            >
              {submitting && <span className="material-symbols-outlined animate-spin">progress_activity</span>}
              {submitting ? 'Mempublikasi...' : '📰 Publikasikan Berita'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminBerita;
