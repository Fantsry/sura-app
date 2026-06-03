import React from 'react';
import { Link } from 'react-router-dom';
import { getStoredUser } from '../lib/api';

const NotFound: React.FC = () => {
  const me = getStoredUser();
  return (
    <div className="bg-background text-on-surface min-h-screen flex items-center justify-center px-gutter">
      <div className="text-center max-w-lg">
        <div className="relative inline-block mb-xl">
          <span className="text-[120px] md:text-[160px] font-extrabold text-primary/10 leading-none select-none">
            404
          </span>
          <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[60px] text-primary animate-pulse">
            explore_off
          </span>
        </div>
        <h1 className="font-h1 text-h1 text-on-surface mb-md">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-on-surface-variant font-body-md mb-xl max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan. Periksa kembali URL
          atau kembali ke halaman utama.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-md">
          <Link
            to={me ? '/' : '/masuk'}
            className="inline-flex items-center gap-sm px-xl py-md bg-primary text-on-primary font-button rounded-full shadow-lg hover:brightness-110 hover:scale-[1.02] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            Kembali ke Beranda
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-sm px-xl py-md border border-outline-variant text-on-surface-variant font-button rounded-full hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Halaman Sebelumnya
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
