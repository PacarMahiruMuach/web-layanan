import { Link } from 'react-router-dom';
import { Instagram, MapPin, Phone, ShieldCheck, HeartPulse } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-[#4A5A50] text-white pt-16 pb-8 mt-auto">
      <div className="w-full px-8 md:px-16 lg:px-24 xl:px-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: About & Slogan */}
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase bg-white/20 px-2.5 py-1 rounded-full text-white">
                SIPAKAR RW 003
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-white mt-2">RW 003 Kampung Utan</h3>
            </div>
            <p className="text-white/90 text-sm font-semibold italic">
              "RW 003, Maju dan Berkembang!"
            </p>
            <p className="text-white/80 text-sm leading-relaxed">
              Sistem Informasi, Profil, dan Aduan Kampung Utan (SIPAKAR). Wadah keterbukaan informasi, pelayanan administrasi, dan aspirasi warga RW 003.
            </p>
            <div className="flex items-start gap-2 text-white/80 text-sm mt-1">
              <MapPin size={18} className="shrink-0 mt-0.5 text-white/90" />
              <p>Jl. Swadaya, Pd. Pucung, Kec. Pd. Aren, Kota Tangerang Selatan, Banten (Menaungi RT 001 - RT 005)</p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4 md:px-8">
            <h3 className="text-lg font-semibold text-white">Tautan Cepat</h3>
            <div className="flex flex-col gap-3 text-white/80 text-sm">
              <Link to="/" className="hover:text-white hover:translate-x-1 transition-all w-fit">Beranda</Link>
              <Link to="/sejarah" className="hover:text-white hover:translate-x-1 transition-all w-fit">Sejarah & Profil Wilayah</Link>
              <Link to="/news" className="hover:text-white hover:translate-x-1 transition-all w-fit">Berita & Informasi</Link>
              <Link to="/activities" className="hover:text-white hover:translate-x-1 transition-all w-fit">Kegiatan Warga</Link>
              <Link to="/services" className="hover:text-white hover:translate-x-1 transition-all w-fit">Layanan & Aduan Warga</Link>
              <Link to="/contact" className="hover:text-white hover:translate-x-1 transition-all w-fit">Kontak & Nomor Darurat</Link>
              <Link to="/admin/login" className="hover:text-white hover:translate-x-1 transition-all w-fit flex items-center gap-1.5 font-medium text-white/95">
                <ShieldCheck size={16} /> Portal Pengurus
              </Link>
            </div>
          </div>

          {/* Column 3: Social Media & Contacts */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white">Media Sosial & Informasi</h3>
            <p className="text-white/80 text-sm mb-1">
              Ikuti akun resmi Karang Taruna RW 003 untuk dokumentasi dan kegiatan pemuda:
            </p>
            <div className="flex flex-col gap-2.5">
              <a 
                href="https://instagram.com/karangtaruna03_kp.utan" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all"
              >
                <Instagram size={18} />
                <span>@karangtaruna03_kp.utan</span>
              </a>
              <a 
                href="https://tiktok.com/@karangtaruna03_kp.utan" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all"
              >
                <span className="font-bold text-base">♪</span>
                <span>TikTok: @karangtaruna03_kp.utan</span>
              </a>
            </div>

            <div className="mt-2 pt-3 border-t border-white/15 text-xs text-white/80 space-y-1.5">
              <div className="flex items-center gap-2">
                <HeartPulse size={14} className="text-green-300 shrink-0" />
                <span>Ambulans & Posyandu: <strong className="text-white">0877-7454-6223</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-blue-300 shrink-0" />
                <span>Puskesmas: <strong className="text-white">0857-1076-4490</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <hr className="border-white/20 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/70">
          <p>© {new Date().getFullYear()} SIPAKAR RW 003 Kampung Utan. Hak Cipta Dilindungi.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="font-semibold text-white/90 mr-1">Kontak Darurat:</span>
            <span className="bg-white/10 px-2.5 py-1.5 rounded text-white font-medium tracking-wide">Polsek: 110</span>
            <span className="bg-white/10 px-2.5 py-1.5 rounded text-white font-medium tracking-wide">Damkar: 113</span>
            <span className="bg-white/10 px-2.5 py-1.5 rounded text-white font-medium tracking-wide">Ambulans RW: 0877-7454-6223</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
