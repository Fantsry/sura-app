import React from 'react';
import Navigation from '../components/Navigation';
import { Link } from 'react-router-dom';


const KomunitasForum = () => {
    return (
        <React.Fragment>
            <Navigation />

            <main className="pt-20 pb-xl lg:pl-64 min-h-screen">
                <div className="max-w-[1280px] mx-auto px-gutter grid grid-cols-1 md:grid-cols-12 gap-lg">

                    <div className="md:col-span-8 flex flex-col gap-lg">

                        <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-sm flex items-center gap-md">
                            <div className="h-10 w-10 rounded-full bg-surface-container-highest overflow-hidden">
                                <img alt="Profile" className="w-full h-full object-cover" data-alt="A clean, professional close-up portrait of a diverse male professional in a bright, modern studio. The lighting is soft and flattering, emphasizing a trustworthy and friendly facial expression. The background is a soft, minimalist neutral grey that complements the clean, Corporate Modern aesthetic of the UI design system." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe942LQQOUb83wo0H7GknJXLHbKbljp3-st3dH92Sr-j2rZydjZ7-eoTFSJWV-0Hf_pN-DCVW8sWkiaZkwJ4m8LA0dX_VjSdRTHMZeTTHYHrr9xPh5ZVoiQWCtiDnel-3_PVYSlqmBnLDQI7g8f2cgeP5vM1cqJVlq0cocGNoSz-2Cn-LkzFhUK5dLiWnJ-XkcrSxl7QD9-pBtxAJqaq460ICHuSYHRQpPaWPQUy0eIM2pm7q2gPxslBhs18Rs-xpu83eO9ZCT_As" />
                            </div>
                            <input className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg px-md py-2 focus:ring-2 focus:ring-primary outline-none font-body-md" placeholder="Apa yang ingin anda diskusikan hari ini?" type="text" />
                            <button className="material-symbols-outlined text-primary p-2 hover:bg-primary-fixed rounded-lg transition-colors">image</button>
                            <button className="material-symbols-outlined text-primary p-2 hover:bg-primary-fixed rounded-lg transition-colors">link</button>
                        </div>

                        <div className="flex gap-sm overflow-x-auto pb-xs">
                            <button className="px-md py-1.5 bg-primary text-on-primary rounded-full font-button text-button flex items-center gap-xs">
                                <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                                Hot Topics
                            </button>
                            <button className="px-md py-1.5 bg-surface-container-high text-on-surface rounded-full font-button text-button flex items-center gap-xs hover:bg-surface-container-highest transition-colors">
                                <span className="material-symbols-outlined text-[18px]">new_releases</span>
                                Terbaru
                            </button>
                            <button className="px-md py-1.5 bg-surface-container-high text-on-surface rounded-full font-button text-button flex items-center gap-xs hover:bg-surface-container-highest transition-colors">
                                <span className="material-symbols-outlined text-[18px]">trending_up</span>
                                Populer
                            </button>
                        </div>

                        <article className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col sm:flex-row">

                            <div className="hidden sm:flex flex-col items-center gap-xs p-md bg-surface-container-low w-12">
                                <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">arrow_upward</button>
                                <span className="font-label-bold text-label-bold text-on-surface">1.2k</span>
                                <button className="material-symbols-outlined text-outline hover:text-error transition-colors">arrow_downward</button>
                            </div>
                            <div className="p-lg flex-1">
                                <div className="flex items-center gap-sm mb-sm">
                                    <span className="bg-secondary-container text-on-secondary-container px-sm py-xs rounded text-[10px] font-bold uppercase tracking-wider">#InfoWarga</span>
                                    <span className="text-on-surface-variant font-body-sm">Diposting oleh <span className="font-bold text-on-surface">@Andi99</span> • 2 jam yang lalu</span>
                                </div>
                                <h3 className="font-h3 text-h3 text-on-surface mb-md leading-snug">Rencana pembangunan taman kota baru di blok B, ada yang sudah dengar detailnya?</h3>
                                <p className="font-body-md text-on-surface-variant mb-lg">Katanya akan ada fasilitas jogging track dan playground, tapi beberapa warga khawatir soal lahan parkir. Mari kita kawal bareng supaya tetap rapi.</p>
                                <div className="aspect-video rounded-lg overflow-hidden mb-lg border border-outline-variant bg-surface-container">
                                    <img alt="Park Project" className="w-full h-full object-cover" data-alt="A high-angle architectural visualization of a modern, eco-friendly urban park with lush green grass, winding light-colored jogging paths, and a contemporary playground area. The scene is bathed in bright, natural morning sunlight, casting soft, realistic shadows. The overall aesthetic is clean, professional, and optimistic, utilizing a palette of vibrant greens and neutral grays to evoke a sense of community development and reliability." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8ZhtHA1fb3ACPB6FEBMYnwX4ycMTwZDIBq5mpasz_51S7uwIAIIzWJugBBbTEqN0rUkhL9IlDsiWWnX1lsBOwUQeZ0nzbsF3UB96YUiSIQX05Z_IVJzgugTnLr5tT6erE0NOEJY768DPjSlABffan4X4ddA1YqSSX_3pphd7SLJCFicbaLZ_05vPYHp9C2MzBbf9o437opKnTX5QJPFoHf1KElWWlksK6QOz71OHrmf1E4Tmi0qegG1Kfj5Hyo8_70YmAqzauQwk" />
                                </div>
                                <div className="flex items-center gap-lg">
                                    <button className="flex items-center gap-xs text-on-surface-variant font-button text-button hover:bg-surface-container-highest px-md py-2 rounded-lg transition-colors">
                                        <span className="material-symbols-outlined">chat_bubble</span>
                                        84 Komentar
                                    </button>
                                    <button className="flex items-center gap-xs text-on-surface-variant font-button text-button hover:bg-surface-container-highest px-md py-2 rounded-lg transition-colors">
                                        <span className="material-symbols-outlined">share</span>
                                        Bagikan
                                    </button>
                                    <button className="flex items-center gap-xs text-on-surface-variant font-button text-button hover:bg-surface-container-highest px-md py-2 rounded-lg transition-colors">
                                        <span className="material-symbols-outlined">bookmark</span>
                                        Simpan
                                    </button>
                                </div>
                            </div>
                        </article>

                        <article className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col sm:flex-row">
                            <div className="hidden sm:flex flex-col items-center gap-xs p-md bg-surface-container-low w-12">
                                <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">arrow_upward</button>
                                <span className="font-label-bold text-label-bold text-on-surface">452</span>
                                <button className="material-symbols-outlined text-outline hover:text-error transition-colors">arrow_downward</button>
                            </div>
                            <div className="p-lg flex-1">
                                <div className="flex items-center gap-sm mb-sm">
                                    <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-sm py-xs rounded text-[10px] font-bold uppercase tracking-wider">#Konspirasi</span>
                                    <span className="text-on-surface-variant font-body-sm">Diposting oleh <span className="font-bold text-on-surface">@MisteriLokal</span> • 5 jam yang lalu</span>
                                </div>
                                <h3 className="font-h3 text-h3 text-on-surface mb-md leading-snug">Kenapa lampu jalan di sepanjang Jalan Merdeka mati setiap jam 12 malam tepat?</h3>
                                <p className="font-body-md text-on-surface-variant mb-lg">Sudah seminggu ini kejadiannya sama terus. Ada yang tahu ini masalah teknis atau ada jadwal pemadaman khusus? Agak ngeri kalau lewat sana tengah malam.</p>
                                <div className="flex items-center gap-lg">
                                    <button className="flex items-center gap-xs text-on-surface-variant font-button text-button hover:bg-surface-container-highest px-md py-2 rounded-lg transition-colors">
                                        <span className="material-symbols-outlined">chat_bubble</span>
                                        120 Komentar
                                    </button>
                                    <button className="flex items-center gap-xs text-on-surface-variant font-button text-button hover:bg-surface-container-highest px-md py-2 rounded-lg transition-colors">
                                        <span className="material-symbols-outlined">share</span>
                                        Bagikan
                                    </button>
                                </div>
                            </div>
                        </article>
                    </div>

                    <div className="md:col-span-4 flex flex-col gap-lg">

                        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
                            <div className="p-md border-b border-outline-variant bg-surface-container-low">
                                <h4 className="font-h3 text-h3 text-primary">Sedang Tren</h4>
                            </div>
                            <div className="p-md flex flex-col">
                                <Link className="group p-md hover:bg-surface-container transition-colors rounded-lg" to="#">
                                    <span className="block font-label-bold text-label-bold text-primary">#Konspirasi</span>
                                    <span className="block font-body-sm text-on-surface-variant">2.4k diskusi hari ini</span>
                                </Link>
                                <Link className="group p-md hover:bg-surface-container transition-colors rounded-lg" to="#">
                                    <span className="block font-label-bold text-label-bold text-primary">#InfoWarga</span>
                                    <span className="block font-body-sm text-on-surface-variant">1.8k diskusi hari ini</span>
                                </Link>
                                <Link className="group p-md hover:bg-surface-container transition-colors rounded-lg" to="#">
                                    <span className="block font-label-bold text-label-bold text-primary">#MasalahHot</span>
                                    <span className="block font-body-sm text-on-surface-variant">950 diskusi hari ini</span>
                                </Link>
                                <Link className="group p-md hover:bg-surface-container transition-colors rounded-lg" to="#">
                                    <span className="block font-label-bold text-label-bold text-primary">#KulinerMalam</span>
                                    <span className="block font-body-sm text-on-surface-variant">520 diskusi hari ini</span>
                                </Link>
                            </div>
                            <div className="p-md pt-0">
                                <button className="w-full py-2 text-primary font-button text-button hover:bg-primary-fixed rounded-lg transition-colors">Lihat Semua Tren</button>
                            </div>
                        </section>

                        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden p-lg">
                            <h4 className="font-h3 text-h3 text-on-surface mb-md">Tentang Komunitas</h4>
                            <p className="font-body-sm text-on-surface-variant mb-lg">Selamat datang di forum bebas Sura! Tempat berbagi info, gossip, dan diskusi warga. Berbeda dengan Laporan Resmi, diskusi di sini tidak memerlukan verifikasi admin segera.</p>
                            <ul className="space-y-md">
                                <li className="flex items-start gap-sm">
                                    <span className="material-symbols-outlined text-[20px] text-primary">verified</span>
                                    <span className="font-body-sm text-on-surface">Gunakan etika berkomunikasi yang baik.</span>
                                </li>
                                <li className="flex items-start gap-sm">
                                    <span className="material-symbols-outlined text-[20px] text-primary">no_accounts</span>
                                    <span className="font-body-sm text-on-surface">Dilarang menyebar HOAX atau konten SARA.</span>
                                </li>
                            </ul>
                        </section>

                        <div className="px-md text-on-surface-variant">
                            <div className="flex flex-wrap gap-md mb-md">
                                <Link className="font-body-sm hover:underline" to="#">Privacy Policy</Link>
                                <Link className="font-body-sm hover:underline" to="#">Terms of Service</Link>
                                <Link className="font-body-sm hover:underline" to="#">Contact Support</Link>
                            </div>
                            <p className="font-body-sm">© 2024 Sura (Suara Rakyat). Verified Official Portal.</p>
                        </div>
                    </div>
                </div>
            </main>

            
            <button className="fixed bottom-20 right-gutter md:bottom-lg md:right-lg h-14 w-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all z-40">
                <span className="material-symbols-outlined text-[32px]">add</span>
            </button>

        </React.Fragment>
    );
};

export default KomunitasForum;
