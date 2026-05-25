import React from 'react';
import Navigation from '../components/Navigation';
import { Link } from 'react-router-dom';

const ProfilPengguna = () => {
    return (
        <React.Fragment>
            <Navigation />

            <main className="pt-20 lg:pl-64 pb-xl px-gutter max-w-screen-2xl mx-auto">

                <header className="mb-xl">
                    <h1 className="font-h1 text-h1 text-on-surface mb-xs">Profil Pengguna</h1>
                    <p className="text-on-surface-variant font-body-md">Kelola informasi pribadi dan pantau kontribusi Anda.</p>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">

                    <div className="lg:col-span-4 space-y-xl">

                        <div className="bg-surface border border-outline-variant rounded-xl p-xl shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-md">
                                    <div className="w-32 h-32 rounded-full border-4 border-primary-container overflow-hidden">
                                        <img alt="User Profile" data-alt="A high-quality portrait of a middle-aged man with a friendly and trustworthy appearance. He is wearing a clean, professional polo shirt in a soft navy color. The background is a minimalist, brightly lit contemporary studio with subtle warm lighting that highlights his facial features. The overall vibe is one of civic responsibility and active community leadership, aligned with a modern light-mode interface." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcJMz0CIc0a0ZmO-Z-oWZjz8RGM_Lu1wejyZGDXXMY72IYtdsxQmLal3OkpHPQHgyFKfgRnJESjU-t-SCFT5-9mN_d-hT4vD91i-pzPs9tBlEWR_4rcKCHKEuv5xr5rhiqKdEngC6k0vwNG_7PrxwjvRqOLB3c1IRy2JFotvHocTwhpz4fOKmE4ewkgvy_KnfC0QS89_0KTUqyyHs5Sg5aGvevfPHuG2QSoC4hgLQi-V249z7n3gZl2797aJP2YYA3ZId0fNYgXDw" />
                                    </div>
                                    <button className="absolute bottom-0 right-0 bg-primary text-on-primary p-xs rounded-full border-2 border-surface flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                    </button>
                                </div>
                                <h2 className="font-h2 text-h2 text-on-surface">Aditya Pratama</h2>
                                <span className="inline-flex items-center px-sm py-xs bg-secondary-container text-on-secondary-container text-label-bold font-label-bold rounded-full mt-xs">
                                    <span className="material-symbols-outlined text-[14px] mr-xs" style={{ "fontVariationSettings": "'FILL' 1" }}>verified</span>
                                    Warga Terverifikasi
                                </span>
                            </div>
                            <div className="mt-xl pt-xl border-t border-outline-variant space-y-md">
                                <div className="flex items-center justify-between">
                                    <span className="text-on-surface-variant text-body-sm">Poin Kontribusi</span>
                                    <span className="text-primary font-bold">1,250 Pts</span>
                                </div>
                                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full w-[75%]"></div>
                                </div>
                                <p className="text-body-sm text-on-surface-variant italic">250 poin lagi untuk menjadi 'Tokoh Masyarakat'</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-md">
                            <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant flex flex-col items-center justify-center text-center">
                                <span className="material-symbols-outlined text-primary mb-xs">description</span>
                                <span className="font-h2 text-h2 text-on-surface">42</span>
                                <span className="font-label-bold text-label-bold text-on-surface-variant">Laporan</span>
                            </div>
                            <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant flex flex-col items-center justify-center text-center">
                                <span className="material-symbols-outlined text-success text-[#2e7d32] mb-xs">check_circle</span>
                                <span className="font-h2 text-h2 text-on-surface">38</span>
                                <span className="font-label-bold text-label-bold text-on-surface-variant">Selesai</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-xl">

                        <section className="bg-surface border border-outline-variant rounded-xl overflow-hidden">
                            <div className="p-lg border-b border-outline-variant flex justify-between items-center">
                                <h3 className="font-h3 text-h3 text-on-surface">Informasi Pribadi</h3>
                                <button className="text-primary font-button text-button hover:underline">Ubah Profil</button>
                            </div>
                            <div className="p-lg grid grid-cols-1 md:grid-cols-2 gap-lg">
                                <div className="space-y-xs">
                                    <label className="font-label-bold text-label-bold text-on-surface-variant uppercase">Nama Lengkap</label>
                                    <p className="font-body-md text-on-surface">Aditya Pratama</p>
                                </div>
                                <div className="space-y-xs">
                                    <label className="font-label-bold text-label-bold text-on-surface-variant uppercase">NIK</label>
                                    <p className="font-body-md text-on-surface">3275***********001</p>
                                </div>
                                <div className="space-y-xs">
                                    <label className="font-label-bold text-label-bold text-on-surface-variant uppercase">Email</label>
                                    <p className="font-body-md text-on-surface">aditya.pratama@email.com</p>
                                </div>
                                <div className="space-y-xs">
                                    <label className="font-label-bold text-label-bold text-on-surface-variant uppercase">No. Telepon</label>
                                    <p className="font-body-md text-on-surface">+62 812-3456-7890</p>
                                </div>
                                <div className="md:col-span-2 space-y-xs">
                                    <label className="font-label-bold text-label-bold text-on-surface-variant uppercase">Alamat Domisili</label>
                                    <p className="font-body-md text-on-surface">Jl. Kebangsaan No. 45, Kel. Merdeka, Kec. Juara, Kota Bekasi</p>
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">

                            <section className="bg-surface border border-outline-variant rounded-xl overflow-hidden">
                                <div className="p-lg border-b border-outline-variant">
                                    <h3 className="font-h3 text-h3 text-on-surface flex items-center gap-sm">
                                        <span className="material-symbols-outlined">security</span> Keamanan
                                    </h3>
                                </div>
                                <div className="p-lg space-y-md">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="font-body-md text-on-surface">Kata Sandi</span>
                                            <span className="text-body-sm text-on-surface-variant">Terakhir diubah 3 bln lalu</span>
                                        </div>
                                        <button className="px-md py-xs border border-outline text-primary rounded-lg font-button text-button hover:bg-surface-container-low transition-colors">Ubah</button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="font-body-md text-on-surface">Otentikasi 2-Faktor</span>
                                            <span className="text-body-sm text-on-surface-variant">Nonaktif</span>
                                        </div>
                                        <div className="relative inline-flex items-center cursor-pointer">
                                            <div className="w-11 h-6 bg-surface-container-highest rounded-full border border-outline-variant transition-colors"></div>
                                            <div className="absolute left-1 top-1 bg-outline w-4 h-4 rounded-full transition-transform"></div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-surface border border-outline-variant rounded-xl overflow-hidden">
                                <div className="p-lg border-b border-outline-variant">
                                    <h3 className="font-h3 text-h3 text-on-surface flex items-center gap-sm">
                                        <span className="material-symbols-outlined">notifications_active</span> Notifikasi
                                    </h3>
                                </div>
                                <div className="p-lg space-y-md">
                                    <div className="flex items-center justify-between">
                                        <span className="font-body-md text-on-surface">Push Notifications</span>
                                        <div className="relative inline-flex items-center cursor-pointer">
                                            <div className="w-11 h-6 bg-primary rounded-full transition-colors"></div>
                                            <div className="absolute right-1 top-1 bg-on-primary w-4 h-4 rounded-full transition-transform"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-body-md text-on-surface">Email Updates</span>
                                        <div className="relative inline-flex items-center cursor-pointer">
                                            <div className="w-11 h-6 bg-primary rounded-full transition-colors"></div>
                                            <div className="absolute right-1 top-1 bg-on-primary w-4 h-4 rounded-full transition-transform"></div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <section className="bg-error-container/20 border border-error/20 rounded-xl p-lg flex flex-col md:flex-row items-center justify-between gap-md">
                            <div>
                                <h4 className="font-h3 text-h3 text-error">Hapus Akun</h4>
                                <p className="text-body-sm text-on-error-container">Tindakan ini permanen dan tidak dapat dibatalkan.</p>
                            </div>
                            <button className="px-lg py-md bg-error text-on-error rounded-xl font-button text-button shadow-sm hover:bg-error/90 transition-colors">
                                Ajukan Penghapusan
                            </button>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="w-full py-xl px-gutter flex flex-col md:flex-row justify-between items-center gap-md bg-surface-container-highest dark:bg-inverse-surface border-t border-outline-variant dark:border-outline">
                <div className="flex flex-col items-center md:items-start">
                    <span className="font-label-bold text-label-bold text-on-surface dark:text-inverse-on-surface">SURA (SUARA RAKYAT)</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-outline-variant mt-xs">© 2024 Sura (Suara Rakyat). Verified Official Portal.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-lg">
                    <Link className="font-body-sm text-body-sm text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-inverse-primary transition-colors" to="#">Privacy Policy</Link>
                    <Link className="font-body-sm text-body-sm text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-inverse-primary transition-colors" to="#">Terms of Service</Link>
                    <Link className="font-body-sm text-body-sm text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-inverse-primary transition-colors" to="#">Contact Support</Link>
                    <Link className="font-body-sm text-body-sm text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-inverse-primary transition-colors" to="#">Report Abuse</Link>
                </div>
            </footer>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant flex justify-around items-center h-16 z-50 px-md">
                <button className="flex flex-col items-center gap-1 text-on-surface-variant">
                    <span className="material-symbols-outlined">home</span>
                    <span className="text-[10px] font-bold">Beranda</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-on-surface-variant">
                    <span className="material-symbols-outlined">report</span>
                    <span className="text-[10px] font-bold">Laporan</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-primary">
                    <span className="material-symbols-outlined" style={{ "fontVariationSettings": "'FILL' 1" }}>person</span>
                    <span className="text-[10px] font-bold">Profil</span>
                </button>
            </nav>

        </React.Fragment>
    );
};

export default ProfilPengguna;
