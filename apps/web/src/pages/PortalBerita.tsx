import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const PortalBerita: React.FC = () => {
  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <Navigation />
      <main className="pt-20 lg:pl-64 pb-xl max-w-max-width mx-auto px-gutter grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* Main Content Area (8 Columns) */}
        <div className="lg:col-span-8 space-y-xl">
          {/* Feature Section: Berita Utama */}
          <section aria-labelledby="headline-title">
            <div className="relative overflow-hidden rounded-xl bg-surface-container shadow-sm group cursor-pointer">
              <img alt="Headline News" className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105" data-alt="A wide cinematic shot of a modern city center with citizens interacting positively with digital information kiosks under a clear blue morning sky. The lighting is bright and crisp, reflecting a modern corporate aesthetic. High contrast and clean architectural lines create a sense of verified official security and urban reliability." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHAvQpmsQrO4lqjZuCw2xLAyeq_NjQqig8_ftRioNcihRfJv86hmNt7zd2dt6z6O4inoQBTqnHhv3egBxwkNpGeZfchz0RuMpo970N_ATSE7IchuOD7Fn3eF_HDs_jbgvWK3KRPFBciZlsKPw0ej_mSCPdlvWPYHnG6C_JZAb1LKKUPPxqGo55iqqdVrFVngNu2bEYFP_kGbqAC6KMYGMOr6QKf92McD8WFfiFCjVhi7eUnTMCaCm9lz0OC5EboAHXasFTIReo5U8" />
              <div className="absolute inset-0 bg-gradient-to-t from-on-background/90 via-on-background/40 to-transparent flex flex-col justify-end p-xl">
                <span className="bg-primary text-on-primary text-label-bold px-md py-xs rounded-full self-start mb-md">BERITA UTAMA</span>
                <h1 className="font-h1 text-h1 text-white mb-sm" id="headline-title">Penguatan Infrastruktur Digital untuk Suara Rakyat yang Lebih Transparan</h1>
                <p className="text-surface-container-highest font-body-md line-clamp-2 max-w-2xl">Pemerintah daerah meluncurkan inisiatif baru guna memastikan setiap keluhan warga dapat dipantau secara real-time melalui platform digital Sura.</p>
                <div className="mt-md flex items-center gap-sm text-surface-variant text-body-sm">
                  <span className="material-symbols-outlined text-sm" data-icon="calendar_today">calendar_today</span>
                  <span>24 Mei 2024</span>
                  <span className="mx-xs">•</span>
                  <span>Admin Sura</span>
                </div>
              </div>
            </div>
          </section>
          {/* Grid Section: Artikel Terbaru */}
          <section aria-labelledby="latest-news-title">
            <div className="flex justify-between items-center mb-lg">
              <h2 className="font-h2 text-h2 text-primary" id="latest-news-title">Artikel Terbaru</h2>
              <div className="flex gap-xs">
                <button className="p-xs bg-surface-container-high rounded-full hover:bg-primary hover:text-white transition-colors">
                  <span className="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
                </button>
                <button className="p-xs bg-surface-container-high rounded-full hover:bg-primary hover:text-white transition-colors">
                  <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              {/* News Card 1 */}
              <article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-outline-variant/30 flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img alt="Artikel Terbaru 1" className="w-full h-full object-cover" data-alt="A clean, close-up photograph of community workers planting trees in a sunny urban park, representing local community action. The scene is bright with soft shadows and high-key lighting, emphasizing a corporate and modern civic duty aesthetic. The colors are natural yet vibrant, focusing on greens and earthy tones against a clean blue sky." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC071CJ5ruBx_XfKg-6o6MA8v1HPECYXO5nGzgPQ28bVaSWDBEIdNFoYS17nAiZc7sS_U7uhcLzdV_k_rwYPrAOot1uh3oE1ytkE7d-1dqMnLRt0tcAJnTVLh6lA1SNQ-x5J_kOkIgvW4dda3xEwbxZo8ISGiw1KkjeoFpJ35jZOjoAAdRxjQB7Ez3hMWKWeCzHYnFZqUM0-Z-DjXBZtM0N6VMExTgLKEj2-A67SjBMyqkIxlZd57Z4CzQLVtpbDFUnt8x70MGOC-c" />
                  <div className="absolute top-sm left-sm">
                    <span className="bg-secondary-container text-on-secondary-fixed-variant text-label-bold px-sm py-xs rounded">Kegiatan Komunitas</span>
                  </div>
                </div>
                <div className="p-md flex-grow flex flex-col">
                  <time className="text-on-surface-variant text-body-sm mb-xs">22 Mei 2024</time>
                  <h3 className="font-h3 text-h3 text-on-surface mb-sm line-clamp-2">Gotong Royong Digital: Bagaimana Komunitas Lokal Membantu Verifikasi Laporan</h3>
                  <p className="text-on-surface-variant text-body-sm mb-lg line-clamp-3">Kolaborasi antara relawan dan admin portal menunjukkan peningkatan akurasi data laporan hingga 40% di bulan ini.</p>
                  <div className="mt-auto">
                    <Link className="text-primary font-button flex items-center gap-xs hover:gap-sm transition-all" to="#">
                      Baca Selengkapnya
                      <span className="material-symbols-outlined text-body-md" data-icon="arrow_forward">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </article>
              {/* News Card 2 */}
              <article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-outline-variant/30 flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img alt="Artikel Terbaru 2" className="w-full h-full object-cover" data-alt="A professional office setting showing a clean, modern workstation with a tablet displaying a security dashboard. The atmosphere is calm and focused, utilizing a blue-tinted neutral color palette to signify reliability and safety. Soft ambient lighting creates a clean, corporate atmosphere that feels official and trustworthy." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdRDYcst6-ZmfaGK-xuZSAB7Ipa8kVXnwZfDE0MGmju_2KNA89CupDSMG_ujzyUXI3W-IG6FDaINLiLkCeLA6CVRC2G9TTm1qY5Vfp2HQZP60QmEWdEbO3Zc7Tr2GVbqP7c5XhYRFVBakRo14DQZGbYF5vktEGVb4zZjmD_hn_wnvm9f-Mwp8eaULM4ewpkSrnsv2ERPiB4Fa2D-fnH6vajJG6J8IgedxG0H74Z1KRrobu6JpgQsO_QGPuOkx8RWysOwBOSujBeUQ" />
                  <div className="absolute top-sm left-sm">
                    <span className="bg-error-container text-on-error-container text-label-bold px-sm py-xs rounded">Tips Keamanan</span>
                  </div>
                </div>
                <div className="p-md flex-grow flex flex-col">
                  <time className="text-on-surface-variant text-body-sm mb-xs">20 Mei 2024</time>
                  <h3 className="font-h3 text-h3 text-on-surface mb-sm line-clamp-2">Melindungi Identitas Pelapor: Panduan Privasi Pengguna Platform Sura</h3>
                  <p className="text-on-surface-variant text-body-sm mb-lg line-clamp-3">Simak langkah-langkah praktis untuk memastikan data pribadi Anda tetap anonim saat melaporkan kejadian di lingkungan sekitar.</p>
                  <div className="mt-auto">
                    <Link className="text-primary font-button flex items-center gap-xs hover:gap-sm transition-all" to="#">
                      Baca Selengkapnya
                      <span className="material-symbols-outlined text-body-md" data-icon="arrow_forward">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </article>
              {/* News Card 3 */}
              <article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-outline-variant/30 flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img alt="Artikel Terbaru 3" className="w-full h-full object-cover" data-alt="A high-angle drone shot of a structured emergency response exercise in a modern town square. Bright orange safety equipment and clear signage are visible, set against the clean architectural backdrop of the city. The lighting is neutral and even, evoking a sense of actionable security and preparedness." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx00Gn_UnVrNzq884FcACEGDnmLhWYjxGrVCy_Q4YYMfH19QkaM1y7DOhcHP6HA25lBEs8cPkoEvFE0MRWYYBxz_mwI22TuhfX9cREzyMatLymNNBoXc-WB-yBRgrd-3CBBzUd-O7cBR4LfZ2GsrryjEDKQAhvB7syYTNXOWWpfIGlI_5gimiV8n1BNGg7_ZgSka9vrTBYbRVjMf73sqTs6mtDNH3b1RlM8a-1_exD26Nw8GBGnmv4nZLp95zUxtlrtOf2F2yHC2Q" />
                  <div className="absolute top-sm left-sm">
                    <span className="bg-tertiary-fixed text-on-tertiary-fixed text-label-bold px-sm py-xs rounded">Info Bencana</span>
                  </div>
                </div>
                <div className="p-md flex-grow flex flex-col">
                  <time className="text-on-surface-variant text-body-sm mb-xs">18 Mei 2024</time>
                  <h3 className="font-h3 text-h3 text-on-surface mb-sm line-clamp-2">Sistem Peringatan Dini Banjir Kini Terintegrasi dengan Dashboard Warga</h3>
                  <p className="text-on-surface-variant text-body-sm mb-lg line-clamp-3">Pembaruan sistem memungkinkan notifikasi otomatis ke ponsel warga saat debit air sungai mencapai level waspada.</p>
                  <div className="mt-auto">
                    <Link className="text-primary font-button flex items-center gap-xs hover:gap-sm transition-all" to="#">
                      Baca Selengkapnya
                      <span className="material-symbols-outlined text-body-md" data-icon="arrow_forward">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </article>
              {/* News Card 4 */}
              <article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-outline-variant/30 flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img alt="Artikel Terbaru 4" className="w-full h-full object-cover" data-alt="A diverse group of professional citizens sitting in a bright, modern meeting room collaborating on a community project. The scene is captured with a shallow depth of field, highlighting a sense of unity and collective action. The lighting is warm yet professional, with a clean and organized background in light-mode colors." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2bsmID10E2N0XYH325b1SgEmhUey_Y5d6uhypwN9SXLw-TBf5XuZqr0GfN3PZfFv1K8USC4o4bU8GYN-8hwPVxliyJ8fmTqwROai0h3AwaM4pwHtUKfAvqvOvLbqXuQ5YRlAlqrCSL-WoCiihktntVs0bTiFkL4JaWGkMErv83kcv_DX1IIclg4TtXRYg233IIJ4LbNPC638d0KvfQMftlcpgHFXgHouJmag_WOI58jtdMJ0jxg9UIWpfiZbjT7fMBh328FzZ1bU" />
                  <div className="absolute top-sm left-sm">
                    <span className="bg-secondary-container text-on-secondary-fixed-variant text-label-bold px-sm py-xs rounded">Kegiatan Komunitas</span>
                  </div>
                </div>
                <div className="p-md flex-grow flex flex-col">
                  <time className="text-on-surface-variant text-body-sm mb-xs">15 Mei 2024</time>
                  <h3 className="font-h3 text-h3 text-on-surface mb-sm line-clamp-2">Rapat Koordinasi: Menentukan Prioritas Perbaikan Jalan Lingkungan</h3>
                  <p className="text-on-surface-variant text-body-sm mb-lg line-clamp-3">Ketua RT dan RW berdiskusi menggunakan data laporan terbanyak dari aplikasi Sura untuk menentukan target pembangunan.</p>
                  <div className="mt-auto">
                    <Link className="text-primary font-button flex items-center gap-xs hover:gap-sm transition-all" to="#">
                      Baca Selengkapnya
                      <span className="material-symbols-outlined text-body-md" data-icon="arrow_forward">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </article>
            </div>
            <div className="mt-xl flex justify-center">
              <button className="border border-primary text-primary font-button px-xl py-md rounded-lg hover:bg-primary-fixed-dim transition-all">
                Lihat Semua Artikel
              </button>
            </div>
          </section>
        </div>
        {/* Sidebar (4 Columns) */}
        <aside className="lg:col-span-4 space-y-xl">
          {/* Search Widget (Mobile Visible) */}
          <div className="lg:hidden">
            <div className="relative">
              <input className="w-full bg-surface-container-low border border-outline-variant rounded-xl py-md pl-md pr-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Cari berita..." type="text" />
              <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-primary">search</span>
            </div>
          </div>
          {/* Categories Sidebar */}
          <section aria-labelledby="categories-title" className="bg-surface-container-low p-lg rounded-xl border border-outline-variant/30">
            <h3 className="font-h3 text-h3 text-primary mb-lg flex items-center gap-sm" id="categories-title">
              <span className="material-symbols-outlined" data-icon="category">category</span>
              Kategori Berita
            </h3>
            <ul className="space-y-sm">
              <li>
                <Link className="flex items-center justify-between p-md rounded-lg bg-surface hover:bg-surface-container-highest transition-all group" to="#">
                  <div className="flex items-center gap-md">
                    <span className="material-symbols-outlined text-error" data-icon="security">security</span>
                    <span className="font-body-md text-on-surface">Tips Keamanan</span>
                  </div>
                  <span className="bg-surface-container-high text-label-bold px-sm py-xs rounded-full text-on-surface-variant group-hover:bg-primary group-hover:text-white transition-colors">12</span>
                </Link>
              </li>
              <li>
                <Link className="flex items-center justify-between p-md rounded-lg bg-surface hover:bg-surface-container-highest transition-all group" to="#">
                  <div className="flex items-center gap-md">
                    <span className="material-symbols-outlined text-primary" data-icon="emergency">emergency</span>
                    <span className="font-body-md text-on-surface">Info Bencana</span>
                  </div>
                  <span className="bg-surface-container-high text-label-bold px-sm py-xs rounded-full text-on-surface-variant group-hover:bg-primary group-hover:text-white transition-colors">08</span>
                </Link>
              </li>
              <li>
                <Link className="flex items-center justify-between p-md rounded-lg bg-surface hover:bg-surface-container-highest transition-all group" to="#">
                  <div className="flex items-center gap-md">
                    <span className="material-symbols-outlined text-secondary" data-icon="groups">groups</span>
                    <span className="font-body-md text-on-surface">Kegiatan Komunitas</span>
                  </div>
                  <span className="bg-surface-container-high text-label-bold px-sm py-xs rounded-full text-on-surface-variant group-hover:bg-primary group-hover:text-white transition-colors">24</span>
                </Link>
              </li>
              <li>
                <Link className="flex items-center justify-between p-md rounded-lg bg-surface hover:bg-surface-container-highest transition-all group" to="#">
                  <div className="flex items-center gap-md">
                    <span className="material-symbols-outlined text-on-surface-variant" data-icon="campaign">campaign</span>
                    <span className="font-body-md text-on-surface">Pengumuman Resmi</span>
                  </div>
                  <span className="bg-surface-container-high text-label-bold px-sm py-xs rounded-full text-on-surface-variant group-hover:bg-primary group-hover:text-white transition-colors">15</span>
                </Link>
              </li>
            </ul>
          </section>
          {/* Newsletter Card */}
          <section className="bg-primary text-on-primary p-lg rounded-xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-h3 text-h3 mb-md">Berlangganan Buletin</h3>
              <p className="text-body-sm mb-lg opacity-90">Dapatkan ringkasan berita penting dan tips keamanan terbaru langsung ke email Anda setiap minggu.</p>
              <div className="space-y-sm">
                <input className="w-full rounded-lg border-none bg-white/10 text-white placeholder:text-white/60 py-md px-md focus:ring-2 focus:ring-white/50" placeholder="Alamat Email" type="email" />
                <button className="w-full bg-white text-primary font-button py-md rounded-lg hover:bg-on-primary-container transition-all">Daftar Sekarang</button>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 text-white/5">
              <span className="material-symbols-outlined !text-[120px]" data-icon="mail">mail</span>
            </div>
          </section>
          {/* Trending Topics */}
          <section className="p-lg">
            <h3 className="font-label-bold text-label-bold text-on-surface-variant mb-md tracking-widest">TOPIK HANGAT</h3>
            <div className="flex flex-wrap gap-sm">
              <Link className="text-body-sm px-md py-xs bg-surface-container border border-outline-variant rounded-full hover:border-primary hover:text-primary transition-all" to="#">#PembangunanJalan</Link>
              <Link className="text-body-sm px-md py-xs bg-surface-container border border-outline-variant rounded-full hover:border-primary hover:text-primary transition-all" to="#">#LaporBanjir</Link>
              <Link className="text-body-sm px-md py-xs bg-surface-container border border-outline-variant rounded-full hover:border-primary hover:text-primary transition-all" to="#">#DigitalLeterasi</Link>
              <Link className="text-body-sm px-md py-xs bg-surface-container border border-outline-variant rounded-full hover:border-primary hover:text-primary transition-all" to="#">#KeamananWarga</Link>
              <Link className="text-body-sm px-md py-xs bg-surface-container border border-outline-variant rounded-full hover:border-primary hover:text-primary transition-all" to="#">#LayananPublik</Link>
            </div>
          </section>
        </aside>
      </main>
      {/* Footer Execution */}
      <footer className="w-full py-xl px-gutter flex flex-col md:flex-row justify-between items-center gap-md bg-surface-container-highest border-t border-outline-variant dark:border-outline">
        <div className="flex flex-col items-center md:items-start gap-xs">
          <span className="font-label-bold text-label-bold text-on-surface dark:text-inverse-on-surface">Sura (Suara Rakyat)</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-outline-variant">© 2024 Sura (Suara Rakyat). Verified Official Portal.</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-lg">
          <Link className="text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-inverse-primary transition-colors font-body-sm" to="#">Privacy Policy</Link>
          <Link className="text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-inverse-primary transition-colors font-body-sm" to="#">Terms of Service</Link>
          <Link className="text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-inverse-primary transition-colors font-body-sm" to="#">Contact Support</Link>
          <Link className="text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-inverse-primary transition-colors font-body-sm" to="#">Report Abuse</Link>
        </nav>
        <div className="flex gap-md">
          <button className="p-xs text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined" data-icon="share">share</span></button>
          <button className="p-xs text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined" data-icon="language">language</span></button>
        </div>
      </footer>
      {/* FAB Suppression: This is a news portal, suppression is active based on context */}

    </div>
  );
};

export default PortalBerita;
