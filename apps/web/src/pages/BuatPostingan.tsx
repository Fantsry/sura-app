import React from 'react';
import { Link } from 'react-router-dom';

const BuatPostingan = () => {
    return (
        <React.Fragment>


<nav className="fixed top-0 w-full z-50 flex justify-between items-center px-gutter h-16 bg-surface dark:bg-inverse-surface shadow-sm transition-colors">
<div className="flex items-center gap-md">
<span className="font-h2 text-h2 font-bold text-primary dark:text-inverse-primary">Sura</span>
</div>
<div className="flex items-center gap-md">
<div className="hidden md:flex items-center gap-lg mr-lg">
<Link className="text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-highest dark:hover:bg-surface-container-high transition-colors px-sm py-xs rounded" to="/">Home Feed</Link>
<Link className="text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-highest dark:hover:bg-surface-container-high transition-colors px-sm py-xs rounded" to="/berita">News Portal</Link>
</div>
<div className="flex items-center gap-sm">
<button className="p-sm rounded-full hover:bg-surface-container-highest transition-colors">
<span className="material-symbols-outlined text-primary">notifications</span>
</button>
<button className="p-sm rounded-full hover:bg-surface-container-highest transition-colors">
<span className="material-symbols-outlined text-primary">person</span>
</button>
</div>
</div>
</nav>
<div className="flex min-h-screen pt-16">

<aside className="hidden lg:flex flex-col h-screen fixed left-0 top-0 pt-20 pb-md border-r border-outline-variant dark:border-outline bg-surface-container-low dark:bg-surface-container-lowest w-64 z-40">
<div className="px-md mb-xl">
<h2 className="font-h3 text-h3 text-primary dark:text-inverse-primary">Suara Rakyat</h2>
<p className="font-label-bold text-label-bold text-on-surface-variant">Citizen Portal</p>
</div>
<nav className="flex-1 space-y-xs">
<Link className="flex items-center gap-md py-sm px-md mx-md text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high rounded-lg transition-all" to="/">
<span className="material-symbols-outlined">home</span>
<span className="font-label-bold text-label-bold">Home Feed</span>
</Link>
<Link className="flex items-center gap-md py-sm px-md mx-md text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high rounded-lg transition-all" to="/laporanku">
<span className="material-symbols-outlined">report_problem</span>
<span className="font-label-bold text-label-bold">My Reports</span>
</Link>
<Link className="flex items-center gap-md py-sm px-md mx-md text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high rounded-lg transition-all" to="/berita">
<span className="material-symbols-outlined">newspaper</span>
<span className="font-label-bold text-label-bold">News Portal</span>
</Link>
<Link className="flex items-center gap-md py-sm px-md mx-md text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high rounded-lg transition-all" to="/admin">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-label-bold text-label-bold">Admin Dashboard</span>
</Link>
</nav>
<div className="px-md mt-auto">
<button className="w-full py-md bg-error text-on-error rounded-xl font-button text-button shadow-sm hover:opacity-90 active:scale-95 transition-all">
                    Report Emergency
                </button>
</div>
</aside>

<main className="flex-1 lg:ml-64 px-gutter py-xl flex justify-center">
<div className="max-w-screen-xl w-full grid grid-cols-1 xl:grid-cols-12 gap-xl">

<div className="xl:col-span-8 space-y-lg">

<div className="mb-xl">
<h1 className="font-h1 text-h1 text-on-surface">Share with Community</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant mt-xs">Contribute to the local conversation instantly.</p>
</div>

<div className="bg-secondary-container text-on-secondary-container p-md rounded-xl flex gap-md items-start shadow-sm">
<span className="material-symbols-outlined">info</span>
<div>
<p className="font-label-bold text-label-bold uppercase mb-xs tracking-wider">Community Post</p>
<p className="font-body-sm text-body-sm">This post will be published immediately to the community feed. Unlike official reports, community posts do not undergo formal admin verification or legal processing. Please ensure your content is accurate and respectful.</p>
</div>
</div>

<div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant">
<form className="space-y-xl">

<div>
<label className="block font-label-bold text-label-bold text-on-surface-variant mb-sm uppercase">Select Category</label>
<div className="flex flex-wrap gap-sm">
<button className="px-lg py-sm rounded-full border border-outline text-on-surface font-button text-button hover:bg-surface-container transition-colors" type="button">Gosip</button>
<button className="px-lg py-sm rounded-full border-2 border-primary bg-primary-fixed text-on-primary-fixed font-button text-button shadow-sm" type="button">Diskusi</button>
<button className="px-lg py-sm rounded-full border border-outline text-on-surface font-button text-button hover:bg-surface-container transition-colors" type="button">Konspirasi</button>
<button className="px-lg py-sm rounded-full border border-outline text-on-surface font-button text-button hover:bg-surface-container transition-colors" type="button">Rekomendasi</button>
</div>
</div>

<div>
<label className="block font-label-bold text-label-bold text-on-surface-variant mb-sm uppercase" htmlFor="post-title">Post Title</label>
<input className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-lg font-h3 text-h3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline-variant" id="post-title" placeholder="What's on your mind?" type="text"/>
</div>

<div>
<label className="block font-label-bold text-label-bold text-on-surface-variant mb-sm uppercase" htmlFor="post-content">Content</label>
<div className="border border-outline-variant rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary transition-all">
<div className="bg-surface-container border-b border-outline-variant p-sm flex gap-sm">
<button className="p-xs hover:bg-surface-container-high rounded" type="button"><span className="material-symbols-outlined">format_bold</span></button>
<button className="p-xs hover:bg-surface-container-high rounded" type="button"><span className="material-symbols-outlined">format_italic</span></button>
<button className="p-xs hover:bg-surface-container-high rounded" type="button"><span className="material-symbols-outlined">format_list_bulleted</span></button>
<button className="p-xs hover:bg-surface-container-high rounded" type="button"><span className="material-symbols-outlined">link</span></button>
</div>
<textarea className="w-full bg-surface-container-low p-md font-body-md text-body-md border-none focus:ring-0 placeholder:text-outline-variant resize-none" id="post-content" placeholder="Describe your thought, story, or finding here..." rows={10}></textarea>
</div>
</div>

<div>
<label className="block font-label-bold text-label-bold text-on-surface-variant mb-sm uppercase">Attachments (Optional)</label>
<div className="border-2 border-dashed border-outline-variant rounded-xl p-xl flex flex-col items-center justify-center bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
<span className="material-symbols-outlined text-outline text-[48px] mb-md">add_a_photo</span>
<p className="font-button text-button text-on-surface">Click to upload or drag and drop</p>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">PNG, JPG or MP4 (Max 10MB)</p>
</div>
</div>

<div className="pt-lg flex flex-col md:flex-row justify-end gap-md border-t border-outline-variant">
<button className="px-xl py-md font-button text-button text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors" type="button">Save as Draft</button>
<button className="px-xl py-md font-button text-button bg-primary text-on-primary rounded-lg shadow-lg hover:brightness-110 active:scale-95 transition-all" type="submit">Publish Post Immediately</button>
</div>
</form>
</div>
</div>

<div className="xl:col-span-4 space-y-lg">

<div className="bg-surface-container-low p-lg rounded-xl border border-outline-variant">
<div className="flex items-center gap-md">
<img alt="User avatar" className="w-12 h-12 rounded-full border-2 border-primary-fixed" data-alt="A professional headshot of a friendly-looking person for a user profile, captured with soft-box lighting in a bright, modern studio. The image has a clean, high-key aesthetic with a subtle bokeh background. The colors are natural and warm, fitting a light-mode corporate UI. High-resolution photography focusing on reliability and civic trust." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-fR85oaYwqftSWHwdmZfzR4PVlvS_mmZtBwlemV1a02jsaH2HL0FMIA6EY2K-XYKE2Kx0ImH9i--6__vVdpMYkiukw9pTUjoS8nmYbTec1oG9aW7kfXrF9YR7GDU0lYq8iCAHVuinVq_b4hAzZzFiBRfgWVfX1N4lAjVzjJr5r8wYBAvEcSgXIBktx7GmHoLI7-9EblflNOYe7piLVzLlP3XiPTsLtHlF931Z-QR-7iPTJVctZbe92ZWE-zTc4IIPNRL6x2_1Spk"/>
<div>
<p className="font-label-bold text-label-bold text-on-surface">Posting as @warga_aktif</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Reputation: Trusted Citizen</p>
</div>
</div>
</div>

<div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant">
<h3 className="font-h3 text-h3 text-on-surface mb-lg flex items-center gap-sm">
<span className="material-symbols-outlined text-primary">gavel</span>
                            Community Guidelines
                        </h3>
<ul className="space-y-md">
<li className="flex gap-md">
<span className="font-label-bold text-label-bold text-primary bg-primary-fixed w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">1</span>
<p className="font-body-sm text-body-sm text-on-surface-variant">Keep discussions constructive and respectful. Avoid personal attacks or hate speech.</p>
</li>
<li className="flex gap-md">
<span className="font-label-bold text-label-bold text-primary bg-primary-fixed w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">2</span>
<p className="font-body-sm text-body-sm text-on-surface-variant">Do not share sensitive personal information (PII) of other citizens or public officials.</p>
</li>
<li className="flex gap-md">
<span className="font-label-bold text-label-bold text-primary bg-primary-fixed w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">3</span>
<p className="font-body-sm text-body-sm text-on-surface-variant">Fact-check your information before posting "Konspirasi" or "Gosip" to prevent misinformation.</p>
</li>
<li className="flex gap-md">
<span className="font-label-bold text-label-bold text-primary bg-primary-fixed w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">4</span>
<p className="font-body-sm text-body-sm text-on-surface-variant">Official complaints regarding infrastructure or safety should use the 'Formal Report' form instead.</p>
</li>
</ul>
</div>

<div className="bg-primary text-on-primary p-lg rounded-xl shadow-lg relative overflow-hidden">
<div className="relative z-10">
<h4 className="font-h3 text-h3 mb-sm">Why post here?</h4>
<p className="font-body-sm text-body-sm opacity-90">Community posts reach 5,000+ local residents instantly. Use this space to mobilize your neighborhood or start a dialogue on local topics.</p>
</div>
<div className="absolute -right-4 -bottom-4 opacity-20">
<span className="material-symbols-outlined text-[120px]">forum</span>
</div>
</div>
</div>
</div>
</main>
</div>

<footer className="w-full py-xl px-gutter flex flex-col md:flex-row justify-between items-center gap-md bg-surface-container-highest dark:bg-inverse-surface border-t border-outline-variant dark:border-outline mt-xl">
<div className="flex flex-col gap-xs items-center md:items-start">
<span className="font-label-bold text-label-bold text-on-surface dark:text-inverse-on-surface">Sura (Suara Rakyat)</span>
<p className="font-body-sm text-body-sm text-on-surface-variant dark:text-outline-variant">© 2024 Verified Official Portal.</p>
</div>
<div className="flex flex-wrap justify-center gap-md">
<Link className="font-body-sm text-body-sm text-on-surface-variant dark:text-outline-variant hover:text-primary transition-colors" to="#">Privacy Policy</Link>
<Link className="font-body-sm text-body-sm text-on-surface-variant dark:text-outline-variant hover:text-primary transition-colors" to="#">Terms of Service</Link>
<Link className="font-body-sm text-body-sm text-on-surface-variant dark:text-outline-variant hover:text-primary transition-colors" to="#">Contact Support</Link>
<Link className="font-body-sm text-body-sm text-on-surface-variant dark:text-outline-variant hover:text-primary transition-colors" to="#">Report Abuse</Link>
</div>
</footer>

        </React.Fragment>
    );
};

export default BuatPostingan;
