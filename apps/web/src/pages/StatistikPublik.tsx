import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const StatistikPublik = () => {
    return (
        <React.Fragment>
            <Navigation />

            <main className="pt-20 lg:pl-64 pb-xl px-gutter min-h-screen">
                <div className="max-w-max-width mx-auto">

                    <header className="mb-xl">
                        <h2 className="font-h1 text-h1 text-primary mb-xs">Transparansi Data Publik</h2>
                        <p className="font-body-lg text-body-lg text-secondary">Memantau efektivitas layanan publik dan keamanan lingkungan secara real-time.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">

                        <div className="md:col-span-4 bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant flex flex-col justify-center">
                            <span className="font-label-bold text-label-bold text-secondary uppercase tracking-widest mb-sm">Total Laporan Masuk</span>
                            <div className="flex items-baseline gap-xs">
                                <h3 className="font-h1 text-[3.5rem] leading-none font-extrabold text-primary">12.482</h3>
                                <span className="text-success text-body-sm font-bold text-[#1a8b4a]">+12% bln ini</span>
                            </div>
                            <p className="font-body-sm text-body-sm text-outline mt-md">Data akumulasi dari seluruh wilayah operasional Sura sejak Januari 2024.</p>
                        </div>
                        <div className="md:col-span-4 bg-primary text-on-primary p-xl rounded-xl shadow-sm flex flex-col justify-center">
                            <span className="font-label-bold text-label-bold text-primary-fixed uppercase tracking-widest mb-sm">Tingkat Penyelesaian</span>
                            <div className="flex items-baseline gap-xs">
                                <h3 className="font-h1 text-[3.5rem] leading-none font-extrabold">94.2%</h3>
                            </div>
                            <div className="w-full bg-primary-container h-2 rounded-full mt-lg overflow-hidden">
                                <div className="bg-on-primary h-full w-[94.2%]"></div>
                            </div>
                            <p className="font-body-sm text-body-sm text-primary-fixed mt-md">11.758 laporan telah diverifikasi dan ditindaklanjuti oleh otoritas terkait.</p>
                        </div>
                        <div className="md:col-span-4 bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant flex flex-col justify-center">
                            <span className="font-label-bold text-label-bold text-secondary uppercase tracking-widest mb-sm">Waktu Respon Rata-rata</span>
                            <div className="flex items-baseline gap-xs">
                                <h3 className="font-h1 text-[3.5rem] leading-none font-extrabold text-primary">42</h3>
                                <span className="font-h3 text-h3 text-secondary">Menit</span>
                            </div>
                            <p className="font-body-sm text-body-sm text-outline mt-md">Kecepatan petugas lapangan dalam menangani laporan kategori darurat.</p>
                        </div>

                        <div className="md:col-span-8 bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant">
                            <div className="flex justify-between items-center mb-xl">
                                <h3 className="font-h3 text-h3 text-on-surface">Tren Laporan Bulanan</h3>
                                <select className="bg-surface-container border-none text-body-sm rounded-lg focus:ring-primary">
                                    <option>Tahun 2024</option>
                                    <option>Tahun 2023</option>
                                </select>
                            </div>

                            <div className="h-64 flex items-end justify-between gap-sm relative pt-xl">

                                <div className="absolute inset-0 flex flex-col justify-between border-b border-outline-variant py-2">
                                    <div className="border-t border-dashed border-outline-variant w-full h-0"></div>
                                    <div className="border-t border-dashed border-outline-variant w-full h-0"></div>
                                    <div className="border-t border-dashed border-outline-variant w-full h-0"></div>
                                </div>

                                <div className="w-full bg-gradient-to-t from-primary-container to-primary h-[40%] rounded-t-lg transition-all hover:opacity-80 relative group">
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-variant text-primary text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Jan: 1.2k</span>
                                </div>
                                <div className="w-full bg-gradient-to-t from-primary-container to-primary h-[55%] rounded-t-lg transition-all hover:opacity-80 relative group"></div>
                                <div className="w-full bg-gradient-to-t from-primary-container to-primary h-[45%] rounded-t-lg transition-all hover:opacity-80 relative group"></div>
                                <div className="w-full bg-gradient-to-t from-primary-container to-primary h-[70%] rounded-t-lg transition-all hover:opacity-80 relative group"></div>
                                <div className="w-full bg-gradient-to-t from-primary-container to-primary h-[85%] rounded-t-lg transition-all hover:opacity-80 relative group"></div>
                                <div className="w-full bg-gradient-to-t from-primary-container to-primary h-[60%] rounded-t-lg transition-all hover:opacity-80 relative group"></div>
                                <div className="w-full bg-gradient-to-t from-primary-container to-primary h-[90%] rounded-t-lg transition-all hover:opacity-80 relative group"></div>
                            </div>
                            <div className="flex justify-between mt-md text-label-bold text-outline uppercase tracking-tighter">
                                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span><span>Jun</span><span>Jul</span>
                            </div>
                        </div>

                        <div className="md:col-span-4 bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant">
                            <h3 className="font-h3 text-h3 text-on-surface mb-xl">Kategori Terbanyak</h3>
                            <div className="space-y-lg">
                                <div className="space-y-xs">
                                    <div className="flex justify-between text-body-md">
                                        <span className="flex items-center gap-sm"><span className="w-3 h-3 bg-error rounded-full"></span>Bencana Alam</span>
                                        <span className="font-bold">35%</span>
                                    </div>
                                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                                        <div className="bg-error h-full w-[35%]"></div>
                                    </div>
                                </div>
                                <div className="space-y-xs">
                                    <div className="flex justify-between text-body-md">
                                        <span className="flex items-center gap-sm"><span className="w-3 h-3 bg-primary rounded-full"></span>Fasilitas Umum</span>
                                        <span className="font-bold">28%</span>
                                    </div>
                                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full w-[28%]"></div>
                                    </div>
                                </div>
                                <div className="space-y-xs">
                                    <div className="flex justify-between text-body-md">
                                        <span className="flex items-center gap-sm"><span className="w-3 h-3 bg-secondary rounded-full"></span>Pencurian</span>
                                        <span className="font-bold">15%</span>
                                    </div>
                                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                                        <div className="bg-secondary h-full w-[15%]"></div>
                                    </div>
                                </div>
                                <div className="space-y-xs">
                                    <div className="flex justify-between text-body-md">
                                        <span className="flex items-center gap-sm"><span className="w-3 h-3 bg-outline rounded-full"></span>Sampah/Polusi</span>
                                        <span className="font-bold">22%</span>
                                    </div>
                                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                                        <div className="bg-outline h-full w-[22%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-12 bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-xl">
                                <div>
                                    <h3 className="font-h3 text-h3 text-on-surface">Peta Panas (Heatmap) Lokasi Aduan</h3>
                                    <p className="font-body-sm text-body-sm text-outline">Konsentrasi laporan tertinggi berada di wilayah Pusat Kota dan Kawasan Industri.</p>
                                </div>
                                <div className="flex bg-surface-container p-1 rounded-lg">
                                    <button className="px-md py-xs bg-white text-primary font-label-bold text-label-bold rounded shadow-sm">Kepadatan Laporan</button>
                                    <button className="px-md py-xs text-on-surface-variant font-label-bold text-label-bold">Kecelakaan Lalu Lintas</button>
                                </div>
                            </div>

                            <div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-surface-container-highest">
                                <img alt="Peta Lokasi Laporan" className="w-full h-full object-cover mix-blend-multiply opacity-40" data-alt="A clean, highly detailed topographic map of a major city with abstract heatmap overlays in shades of deep blue and vibrant red. The map features minimalist white and gray street lines, while the heat zones represent dense areas of activity. The lighting is bright and modern, creating a professional dashboard aesthetic for a data visualization interface." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvol9Nm0hAKSi3jXzwX-pXbZkeNSNY3tXstEqAExQ-J3kwFb1jTE6WFNHhWe27-b6cLUorIw6oWaSe_LDzj6sJu9dSrNLteflVAkpEsg8Ha38hdxHkqQVU1DSn9DT2gbwj3X7LNBPikAVXHGh_e3AGlFpsqxTxQRtiKQ83yDEo-xpoTMg8ezZpS7NPKlE3KO4GTSFLahrZZQ6enrEb11-61_fUIy7ijA9fjjAMm3GYSZVbR55-9rxQll4VaLNQ8DhaGMcK-EIsc6Q" />

                                <div className="absolute top-[30%] left-[45%] w-32 h-32 bg-error rounded-full blur-[60px] opacity-30"></div>
                                <div className="absolute top-[50%] left-[20%] w-24 h-24 bg-primary rounded-full blur-[50px] opacity-20"></div>
                                <div className="absolute top-[65%] left-[60%] w-40 h-40 bg-error rounded-full blur-[70px] opacity-40"></div>

                                <div className="absolute top-[32%] left-[48%] flex flex-col items-center">
                                    <span className="material-symbols-outlined text-error text-3xl" style={{ "fontVariationSettings": "'FILL' 1" }}>location_on</span>
                                    <div className="bg-white/90 backdrop-blur px-sm py-xs rounded-md shadow-lg border border-outline-variant -mt-2">
                                        <p className="font-label-bold text-[10px] text-error">AREA KRITIS</p>
                                        <p className="text-[11px] font-bold">Kecamatan Gambir</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="w-full py-xl px-gutter flex flex-col md:flex-row justify-between items-center gap-md bg-surface-container-highest dark:bg-inverse-surface border-t border-outline-variant dark:border-outline lg:ml-64 lg:w-[calc(100%-16rem)]">
                <div className="text-center md:text-left">
                    <p className="font-label-bold text-label-bold text-on-surface dark:text-inverse-on-surface">Sura (Suara Rakyat)</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-outline-variant mt-1">© 2024 Sura. Verified Official Portal.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-lg">
                    <Link className="font-body-sm text-body-sm text-on-surface-variant dark:text-outline-variant hover:text-primary transition-colors" to="#">Privacy Policy</Link>
                    <Link className="font-body-sm text-body-sm text-on-surface-variant dark:text-outline-variant hover:text-primary transition-colors" to="#">Terms of Service</Link>
                    <Link className="font-body-sm text-body-sm text-on-surface-variant dark:text-outline-variant hover:text-primary transition-colors" to="#">Contact Support</Link>
                    <Link className="font-body-sm text-body-sm text-on-surface-variant dark:text-outline-variant hover:text-primary transition-colors" to="#">Report Abuse</Link>
                </div>
            </footer>

        </React.Fragment>
    );
};

export default StatistikPublik;
