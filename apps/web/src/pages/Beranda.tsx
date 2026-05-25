import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Navigation from '../components/Navigation';
import { api } from '../lib/api';

type MapPoint = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  category: string;
  status: string;
};

const Beranda: React.FC = () => {
  const [mapReports, setMapReports] = useState<MapPoint[]>([]);

  useEffect(() => {
    api.getMapReports().then(setMapReports).catch(() => {});
  }, []);

  return (
    <div className="bg-background text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-fixed min-h-screen">
      <Navigation />
        {/* Main Content Area */}
      <main className="pt-20 lg:pl-64 min-h-screen">
        <div className="flex h-screen">
          {/* Left: Interactive Map Container */}
          <section className="flex-1 relative bg-surface-container-low map-gradient overflow-hidden border-r border-outline-variant">
          <MapContainer center={[-6.200000, 106.816666]} zoom={13} zoomControl={false} className="absolute inset-0 w-full h-full z-0">
            <TileLayer
              attribution='&copy; <Link to="https://www.openstreetmap.org/copyright">OpenStreetMap</Link>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mapReports.map((r) => (
              <Marker key={r.id} position={[r.latitude, r.longitude]}>
                <Popup>
                  <div className="text-center">
                    <p className="font-bold">{r.category}</p>
                    <p className="text-sm">{r.title}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          {/* Map Overlay Legend */}
          <div className="absolute bottom-md left-md bg-surface/90 backdrop-blur-md p-md rounded-xl shadow-lg border border-outline-variant z-[1000]">
            <h4 className="font-label-bold mb-sm text-on-surface">Legenda Laporan</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-sm">
                <span className="w-3 h-3 rounded-full bg-error"></span>
                <span className="text-body-sm">Bencana (Urgent)</span>
              </div>
              <div className="flex items-center gap-sm">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span className="text-body-sm">Pencurian / Keamanan</span>
              </div>
              <div className="flex items-center gap-sm">
                <span className="w-3 h-3 rounded-full bg-secondary"></span>
                <span className="text-body-sm">Event / Kegiatan</span>
              </div>
            </div>
          </div>
        </section>
        {/* Right: Recent Reports Feed */}
        <section className="w-full md:w-[400px] flex flex-col bg-surface overflow-hidden">
          <div className="p-gutter border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
            <div>
              <h2 className="font-h3 text-h3 text-primary">Aduan Terbaru</h2>
              <p className="text-body-sm text-on-surface-variant">Laporan masuk real-time</p>
            </div>
            <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">filter_list</button>
          </div>
          <div className="flex-1 overflow-y-auto hide-scrollbar p-gutter space-y-md">
            {/* Report Card 1 */}
            <article className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md shadow-sm hover:shadow-md transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-sm">
                <span className="px-2 py-1 rounded-full bg-error-container text-error text-[10px] font-bold uppercase tracking-wider">Bencana</span>
                <span className="text-[10px] text-outline font-medium">2 Menit Lalu</span>
              </div>
              <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors mb-xs">Pohon Tumbang Menutup Jalan</h4>
              <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-md">Pohon besar tumbang akibat angin kencang di kawasan pemukiman. Akses jalan utama terhambat total.</p>
              <div className="flex items-center justify-between pt-sm border-t border-outline-variant">
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[14px] text-outline">location_on</span>
                  <span className="text-[10px] text-outline">Jl. Merdeka Barat</span>
                </div>
                <div className="flex items-center gap-xs text-error font-bold">
                  <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                  <span className="text-[10px] uppercase">Menunggu</span>
                </div>
              </div>
            </article>
            {/* Report Card 2 */}
            <article className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md shadow-sm hover:shadow-md transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-sm">
                <span className="px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-wider">Pencurian</span>
                <span className="text-[10px] text-outline font-medium">15 Menit Lalu</span>
              </div>
              <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors mb-xs">CCTV: Pencurian Sepeda Motor</h4>
              <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-md">Terjadi pencurian kendaraan bermotor terekam CCTV pada pukul 14:30. Pelaku berjumlah 2 orang.</p>
              <div className="flex items-center justify-between pt-sm border-t border-outline-variant">
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[14px] text-outline">location_on</span>
                  <span className="text-[10px] text-outline">Parkiran Pasar Jaya</span>
                </div>
                <div className="flex items-center gap-xs text-primary font-bold">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="text-[10px] uppercase">Diproses</span>
                </div>
              </div>
            </article>
            {/* Report Card 3 */}
            <article className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md shadow-sm hover:shadow-md transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-sm">
                <span className="px-2 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold uppercase tracking-wider">Event</span>
                <span className="text-[10px] text-outline font-medium">1 Jam Lalu</span>
              </div>
              <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors mb-xs">Gotong Royong Kebersihan</h4>
              <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-md">Persiapan acara 17-an, warga berkumpul untuk membersihkan balai desa dan lingkungan sekitar.</p>
              <div className="flex items-center justify-between pt-sm border-t border-outline-variant">
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[14px] text-outline">location_on</span>
                  <span className="text-[10px] text-outline">Balai RW 08</span>
                </div>
                <div className="flex items-center gap-xs text-outline font-bold">
                  <span className="w-2 h-2 rounded-full bg-outline"></span>
                  <span className="text-[10px] uppercase">Selesai</span>
                </div>
              </div>
            </article>
            {/* Report Card 4 */}
            <article className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md shadow-sm hover:shadow-md transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-sm">
                <span className="px-2 py-1 rounded-full bg-error-container text-error text-[10px] font-bold uppercase tracking-wider">Bencana</span>
                <span className="text-[10px] text-outline font-medium">2 Jam Lalu</span>
              </div>
              <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors mb-xs">Kebakaran Lahan Kosong</h4>
              <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-md">Asap tebal terlihat dari lahan kosong di belakang komplek. Petugas damkar sedang dihubungi.</p>
              <div className="flex items-center justify-between pt-sm border-t border-outline-variant">
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[14px] text-outline">location_on</span>
                  <span className="text-[10px] text-outline">Kawasan Industri</span>
                </div>
                <div className="flex items-center gap-xs text-primary font-bold">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="text-[10px] uppercase">Diproses</span>
                </div>
              </div>
            </article>
          </div>
          {/* View More CTA */}
          <div className="p-md border-t border-outline-variant bg-surface-container-lowest">
            <button className="w-full py-2 text-primary font-bold hover:bg-primary-container/10 transition-colors rounded-lg flex items-center justify-center gap-sm">
              Lihat Semua Aduan
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </section>
        </div>
      </main>
      {/* Floating Action Button (Mobile) */}
      <button className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-error text-white rounded-full shadow-2xl flex items-center justify-center z-50 active:scale-90 transition-transform">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
};

export default Beranda;
