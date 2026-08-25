import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, MapPin, Sparkles, Compass, Shield, Leaf } from 'lucide-react';

export default function Sejarah() {
  return (
    <main className="flex-grow pt-[85px] sm:pt-[100px] bg-background min-h-screen">
      {/* Hero Banner with Overlay */}
      <div className="relative w-full h-72 sm:h-96 md:h-[420px] bg-surface-container-highest overflow-hidden">
        <img 
          src="images/palang.jpg" 
          alt="Sejarah Kampung Utan" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-5 sm:px-8 pb-8 sm:pb-12 text-white">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs sm:text-sm font-medium mb-3">
            <BookOpen size={16} />
            <span>Identitas & Informasi Umum Wilayah</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Sejarah Singkat Kampung Utan RW 003
          </h1>
          <p className="text-white/90 text-sm sm:text-base mt-2 max-w-2xl font-medium italic">
            "RW 003, Maju dan Berkembang!"
          </p>
        </div>
      </div>
      
      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        {/* Navigation Breadcrumb / Quick Back */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Story Content */}
        <article className="bg-surface-container-lowest rounded-3xl p-6 sm:p-10 md:p-12 shadow-ambient border border-outline-variant/20 space-y-6 sm:space-y-8 text-on-surface-variant leading-relaxed text-base sm:text-lg">
          <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/30 text-xs sm:text-sm text-outline font-medium">
            <span className="flex items-center gap-1.5"><MapPin size={15} /> Jl. Swadaya, Pd. Pucung, Kec. Pd. Aren, Kota Tangerang Selatan, Banten</span>
            <span>•</span>
            <span>Menaungi 5 Wilayah RT (RT 001 - RT 005)</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-on-surface mb-4">1. Sejarah Singkat Kampung Utan RW 003</h2>
            <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-none mb-4">
              Dahulu, kawasan Kampung Utan merupakan wilayah agraris dengan hamparan persawahan yang menyerupai pulau kecil di area bawahnya. Penamaan "Kampung Utan" berasal dari kondisi geografis wilayah pada masa lalu yang dipenuhi pepohonan lebat. Pada masa awal pemukiman, kawasan ini hanya dihuni oleh empat rumah warga pendatang.
            </p>
            
            <p>
              Seiring perkembangan zaman, area persawahan secara bertahap dikeruk dan dibangun menjadi kawasan kompleks perumahan modern (Bintaro). Pembangunan kompleks tersebut mengakibatkan pembagian wilayah geografis terpisah. Untuk menjaga integrasi dan tata kelola administrasi, pihak kelurahan menyatukan kembali wilayah pemukiman ini ke dalam satu kesatuan administrasi <strong>RW 003</strong>, yang kini menaungi <strong>5 Wilayah RT (RT 001 hingga RT 005)</strong>.
            </p>
          </div>
          
          <div className="my-8 p-6 bg-primary-container/20 rounded-2xl border-l-4 border-primary">
            <div className="flex items-center gap-2 text-primary font-bold text-base mb-1">
              <Sparkles size={18} />
              <span>Slogan Wilayah</span>
            </div>
            <p className="text-on-surface text-lg sm:text-xl font-bold italic">
              "RW 003, Maju dan Berkembang!"
            </p>
          </div>

          {/* Visi & Misi */}
          <div className="pt-4 border-t border-outline-variant/30">
            <h2 className="text-2xl font-bold text-on-surface mb-6">2. Visi & Misi Pengelolaan Wilayah</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-3">
                <div className="flex items-center gap-3 text-primary font-bold text-lg">
                  <div className="p-2 bg-primary-container/40 rounded-xl">
                    <Leaf size={20} />
                  </div>
                  <h3>Kemajuan & Perubahan Wilayah</h3>
                </div>
                <p className="text-sm sm:text-base text-on-surface-variant">
                  Mengembangkan RW 003 dari pemukiman yang terisolasi/tertinggal menjadi wilayah yang terdepan dalam tata kelola dan kemasyarakatan.
                </p>
              </div>

              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-3">
                <div className="flex items-center gap-3 text-secondary font-bold text-lg">
                  <div className="p-2 bg-secondary-container/40 rounded-xl">
                    <Shield size={20} />
                  </div>
                  <h3>Pemerataan Pembangunan</h3>
                </div>
                <p className="text-sm sm:text-base text-on-surface-variant">
                  Mewujudkan pembangunan sarana fisik dan non-fisik secara merata guna memenuhi kebutuhan masyarakat (seperti perbaikan jalan, balai warga, serta pos-pos pelayanan dan keamanan).
                </p>
              </div>
            </div>
          </div>

          {/* Batas Wilayah */}
          <div className="pt-4 border-t border-outline-variant/30">
            <div className="flex items-center gap-2 text-2xl font-bold text-on-surface mb-4">
              <Compass size={24} className="text-primary" />
              <h2>3. Batas Wilayah Administrasi</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between">
                <span className="text-on-surface-variant font-medium">Batas Barat</span>
                <strong className="text-on-surface">Area Rajawali</strong>
              </div>
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between">
                <span className="text-on-surface-variant font-medium">Batas Timur</span>
                <strong className="text-on-surface">Kompleks Maleo</strong>
              </div>
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between">
                <span className="text-on-surface-variant font-medium">Batas Selatan</span>
                <strong className="text-on-surface">Kampung Rawa Timur</strong>
              </div>
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between">
                <span className="text-on-surface-variant font-medium">Batas Utara</span>
                <strong className="text-on-surface">Pondok Pucung</strong>
              </div>
            </div>
          </div>
        </article>
        
        {/* Footer Actions */}
        <div className="text-center pt-10 pb-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-on-primary rounded-full font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all text-sm sm:text-base"
          >
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}

