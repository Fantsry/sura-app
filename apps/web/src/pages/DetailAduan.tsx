import React from 'react';
import { Link } from 'react-router-dom';

const DetailAduan: React.FC = () => {
  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">

      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-gutter h-16 bg-surface shadow-sm">
        <div className="flex items-center gap-md">
          <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-highest p-sm rounded-full transition-colors">arrow_back</button>
          <h1 className="font-h2 text-h2 font-bold text-primary">Sura</h1>
        </div>
        <div className="flex items-center gap-md">
          <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-highest p-sm rounded-full transition-colors">notifications</button>
          <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-highest p-sm rounded-full transition-colors">person</button>
        </div>
      </header>
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col h-screen fixed left-0 top-0 pt-20 pb-md border-r border-outline-variant w-64 bg-surface-container-low">
        <div className="px-md mb-xl">
          <h2 className="font-h3 text-h3 text-primary">Suara Rakyat</h2>
          <p className="font-label-bold text-label-bold text-on-surface-variant">Citizen Portal</p>
        </div>
        <nav className="flex-1 space-y-sm">
          <Link className="flex items-center gap-md py-md px-md text-on-surface-variant hover:bg-surface-container-high rounded-lg mx-md transition-all" to="/">
            <span className="material-symbols-outlined">home</span>
            <span className="font-label-bold">Home Feed</span>
          </Link>
          <Link className="flex items-center gap-md py-md px-md bg-secondary-container text-on-secondary-container rounded-lg mx-md" to="/laporanku">
            <span className="material-symbols-outlined">report_problem</span>
            <span className="font-label-bold">My Reports</span>
          </Link>
          <Link className="flex items-center gap-md py-md px-md text-on-surface-variant hover:bg-surface-container-high rounded-lg mx-md transition-all" to="/berita">
            <span className="material-symbols-outlined">newspaper</span>
            <span className="font-label-bold">News Portal</span>
          </Link>
          <Link className="flex items-center gap-md py-md px-md text-on-surface-variant hover:bg-surface-container-high rounded-lg mx-md transition-all" to="/admin">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-bold">Admin Dashboard</span>
          </Link>
        </nav>
        <div className="px-md mt-auto">
          <button className="w-full py-md bg-error text-on-error rounded-lg font-button flex items-center justify-center gap-sm">
            <span className="material-symbols-outlined">emergency</span>
            Report Emergency
          </button>
        </div>
      </aside>
      {/* Main Content Canvas */}
      <main className="lg:pl-64 pt-20 pb-16 min-h-screen">
        <div className="max-w-[1280px] mx-auto px-gutter py-md">
          {/* Report Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
            {/* Left Column: Details & Media */}
            <div className="lg:col-span-8 space-y-xl">
              <section className="bg-surface-container-lowest rounded-xl p-xl shadow-sm border border-outline-variant/30">
                <div className="flex justify-between items-start mb-md">
                  <span className="bg-secondary-container text-on-secondary-container px-md py-xs rounded-full font-label-bold text-label-bold">DITINDAKLANJUTI</span>
                  <p className="text-on-surface-variant font-label-bold text-label-bold">ID: #SR-2024-8812</p>
                </div>
                <h2 className="font-h1 text-h1 text-on-surface mb-md">Kerusakan Pipa Air Utama di Jl. Merdeka</h2>
                <p className="text-on-surface-variant font-body-lg mb-xl">Pipa bocor sejak dini hari tadi, menyebabkan genangan air setinggi 10cm di jalan raya dan mengganggu aliran air ke pemukiman warga sekitar blok C dan D. Mohon segera diperbaiki.</p>
                {/* Media Display */}
                <div className="rounded-xl overflow-hidden mb-xl aspect-video bg-surface-container">
                  <img className="w-full h-full object-cover" data-alt="A detailed photograph showing a significant water leak on a modern urban street with cracked asphalt and a visible pool of clear water reflecting the blue sky. The surrounding environment includes clean city sidewalks and professional municipal infrastructure. The lighting is bright morning sun, emphasizing the urgency of the repair with a high-contrast and sharp focus architectural photography style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtc0DTsF45bx6ARSuR9ifrrcupfXQNTz884EUWcOPzhkY8PXvE_LrTLrwKb3Fr5g8n_mPYQ8Uau6XYzMazz2csADFwTJe5ArFo69lbCNLZmfZN2xmxy2d7cUQ3kBJLfy1C9oyAFgdJgkYTIvLH7O5518ItGuvGk_gzCYEGiroRaDJotZvx066iP-q3IwtjwJ1DnEqvY0BhsXR-BYLD4fyOzD8Vqx0d756PdNwd3yFYaQSIizy2d1NN80Nxbzm0tbKcmGayOk8Rziw" />
                </div>
                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="flex items-center gap-md p-md bg-surface-container-low rounded-lg border border-outline-variant/20">
                    <span className="material-symbols-outlined text-primary">calendar_today</span>
                    <div>
                      <p className="font-label-bold text-label-bold text-on-surface-variant">Dilaporkan Pada</p>
                      <p className="font-body-md text-on-surface">24 Okt 2024, 07:15 WIB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-md p-md bg-surface-container-low rounded-lg border border-outline-variant/20">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    <div>
                      <p className="font-label-bold text-label-bold text-on-surface-variant">Lokasi</p>
                      <p className="font-body-md text-on-surface">Jl. Merdeka No. 42, Jakarta Pusat</p>
                    </div>
                  </div>
                </div>
              </section>
              {/* Discussion Section */}
              <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
                <div className="p-xl border-b border-outline-variant/20 bg-surface-container-low">
                  <h3 className="font-h3 text-h3 text-on-surface">Diskusi &amp; Transparansi</h3>
                </div>
                <div className="p-xl space-y-lg h-[400px] overflow-y-auto bg-surface-container-lowest">
                  {/* Admin Message */}
                  <div className="flex gap-md max-w-[85%]">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary flex-shrink-0">
                      <span className="material-symbols-outlined">shield_person</span>
                    </div>
                    <div className="bg-surface-container-high p-md rounded-xl rounded-tl-none">
                      <p className="font-label-bold text-label-bold text-primary mb-xs">Admin Dinas Air Bersih</p>
                      <p className="text-on-surface-variant font-body-md">Terima kasih atas laporannya. Tim teknis kami sedang menuju lokasi untuk melakukan inspeksi awal. Mohon tunggu pembaruan selanjutnya.</p>
                      <p className="text-right text-[10px] mt-sm text-outline">08:30 WIB</p>
                    </div>
                  </div>
                  {/* Citizen Message */}
                  <div className="flex gap-md max-w-[85%] ml-auto flex-row-reverse">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-on-secondary flex-shrink-0">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <div className="bg-primary-container text-on-primary-container p-md rounded-xl rounded-tr-none">
                      <p className="font-label-bold text-label-bold text-on-primary-container mb-xs">Anda (Pelapor)</p>
                      <p className="font-body-md">Baik Pak, mohon segera ditangani karena airnya mulai masuk ke teras rumah warga. Terima kasih.</p>
                      <p className="text-right text-[10px] mt-sm opacity-70">08:45 WIB</p>
                    </div>
                  </div>
                  {/* Admin Message */}
                  <div className="flex gap-md max-w-[85%]">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary flex-shrink-0">
                      <span className="material-symbols-outlined">shield_person</span>
                    </div>
                    <div className="bg-surface-container-high p-md rounded-xl rounded-tl-none">
                      <p className="font-label-bold text-label-bold text-primary mb-xs">Admin Dinas Air Bersih</p>
                      <p className="text-on-surface-variant font-body-md">Tim sudah sampai di lokasi. Kami sedang melakukan penutupan katup sementara untuk menghentikan kebocoran sebelum proses pengelasan pipa.</p>
                      <p className="text-right text-[10px] mt-sm text-outline">09:15 WIB</p>
                    </div>
                  </div>
                </div>
                {/* Chat Input */}
                <div className="p-lg border-t border-outline-variant/20 flex gap-md items-center">
                  <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">attach_file</button>
                  <input className="flex-1 bg-surface-container px-md py-sm rounded-lg border-none focus:ring-2 focus:ring-primary/20 outline-none text-body-md" placeholder="Tulis tanggapan Anda..." type="text" />
                  <button className="bg-primary text-on-primary p-md rounded-lg flex items-center justify-center hover:shadow-lg transition-all active:scale-95">
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
              </section>
            </div>
            {/* Right Column: Status & Map */}
            <div className="lg:col-span-4 space-y-xl">
              {/* Timeline Status */}
              <section className="bg-surface-container-lowest rounded-xl p-xl shadow-sm border border-outline-variant/30">
                <h3 className="font-h3 text-h3 text-on-surface mb-xl">Riwayat Status</h3>
                <div className="relative pl-md">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-outline-variant"></div>
                  {/* Status Item: Completed */}
                  <div className="relative pb-xl pl-xl">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-primary rounded-full ring-4 ring-primary-container/20"></div>
                    <p className="font-label-bold text-label-bold text-primary">DITINDAKLANJUTI</p>
                    <p className="text-on-surface font-body-sm">Tim teknis sedang di lapangan</p>
                    <p className="text-on-surface-variant font-body-sm opacity-70">24 Okt 2024, 09:15</p>
                  </div>
                  {/* Status Item: Completed */}
                  <div className="relative pb-xl pl-xl">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-primary rounded-full ring-4 ring-primary-container/20"></div>
                    <p className="font-label-bold text-label-bold text-on-surface">DIVERIFIKASI</p>
                    <p className="text-on-surface font-body-sm">Laporan telah divalidasi sistem</p>
                    <p className="text-on-surface-variant font-body-sm opacity-70">24 Okt 2024, 08:00</p>
                  </div>
                  {/* Status Item: Completed */}
                  <div className="relative pb-xl pl-xl">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-primary rounded-full ring-4 ring-primary-container/20"></div>
                    <p className="font-label-bold text-label-bold text-on-surface">DILAPORKAN</p>
                    <p className="text-on-surface font-body-sm">Laporan diterima oleh Sura</p>
                    <p className="text-on-surface-variant font-body-sm opacity-70">24 Okt 2024, 07:15</p>
                  </div>
                  {/* Status Item: Future */}
                  <div className="relative pl-xl opacity-40">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-outline-variant rounded-full"></div>
                    <p className="font-label-bold text-label-bold text-on-surface">SELESAI</p>
                    <p className="text-on-surface font-body-sm">Laporan selesai ditangani</p>
                  </div>
                </div>
              </section>
              {/* Small Map Widget */}
              <section className="bg-surface-container-lowest rounded-xl p-xl shadow-sm border border-outline-variant/30">
                <h3 className="font-h3 text-h3 text-on-surface mb-md">Peta Lokasi</h3>
                <div className="rounded-lg overflow-hidden h-48 bg-surface-container-high relative">
                  <img className="w-full h-full object-cover" data-alt="A clean and stylized professional map widget interface showing an urban city layout with a prominent blue marker pinpointing a specific street intersection. The map uses a soft, light-themed color palette with subtle greys for buildings and primary colors for major transit routes, maintaining a modern and trustworthy municipal aesthetic. The mood is clear and informative." data-location="Jakarta Pusat" src="https://lh3.googleusercontent.com/aida-public/AB6AXuALr9-3vuulkykrB2NfxTDgOQOyWoPzZmOlqtXPJZcfMLGyEd0SI_UDplcOOyoO2KheoVSirzDXG-chEV7YtKVpYzp5_dhVIEd4g_WGOpw0QDNeBgTmrJXPqg3qv8xnHqjy4vXmIM7MeeHZB_99t-kHi7I2cS24PVEBKwCBHVJtuVeuoahTOuNjLvC44gGMpDdS2c1w0QWB42R2JFw4MM3SjU7B7K6xgc4ip8QVui9AARI5tI8agYEaMfh0hKFPCLisSpbL56sl-hs" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="material-symbols-outlined text-error text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  </div>
                </div>
                <div className="mt-md">
                  <p className="font-body-sm text-on-surface-variant italic">Koordinat: -6.1754, 106.8272</p>
                  <button className="mt-sm w-full py-sm border border-primary text-primary rounded-lg font-button hover:bg-surface-container-high transition-colors">Buka di Maps</button>
                </div>
              </section>
              {/* Contact/Urgent Help */}
              <section className="bg-primary-container text-on-primary-container rounded-xl p-xl shadow-md">
                <div className="flex items-center gap-md mb-md">
                  <span className="material-symbols-outlined">support_agent</span>
                  <h3 className="font-h3 text-h3">Butuh Bantuan?</h3>
                </div>
                <p className="font-body-sm mb-lg opacity-90">Hubungi petugas operator kami jika terjadi situasi yang mengancam keselamatan jiwa.</p>
                <button className="w-full bg-surface text-primary py-md rounded-lg font-button flex items-center justify-center gap-sm shadow-sm active:scale-95 transition-all">
                  <span className="material-symbols-outlined">call</span>
                  Hubungi Call Center 112
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="lg:pl-64 w-full py-xl px-gutter flex flex-col md:flex-row justify-between items-center gap-md bg-surface-container-highest border-t border-outline-variant">
        <div className="text-center md:text-left">
          <p className="font-label-bold text-label-bold text-on-surface mb-xs">Sura (Suara Rakyat)</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">© 2024 Verified Official Portal.</p>
        </div>
        <div className="flex gap-md flex-wrap justify-center">
          <Link className="text-on-surface-variant font-body-sm hover:text-primary transition-colors" to="#">Privacy Policy</Link>
          <Link className="text-on-surface-variant font-body-sm hover:text-primary transition-colors" to="#">Terms of Service</Link>
          <Link className="text-on-surface-variant font-body-sm hover:text-primary transition-colors" to="#">Contact Support</Link>
          <Link className="text-on-surface-variant font-body-sm hover:text-primary transition-colors" to="#">Report Abuse</Link>
        </div>
      </footer>

    </div>
  );
};

export default DetailAduan;
