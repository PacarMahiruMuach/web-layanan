import React, { useState } from 'react';
import { ArrowRight, Leaf, Users, Shield, ShieldCheck, TreePine, X, Tent, Activity, HeartPulse, CheckCircle2, BookOpen } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

// Define Facility interface
interface Facility {
  id: number;
  name: string;
  short_desc: string;
  full_desc: string;
  images: string[];
  icon_name: React.ReactNode;
  amenities: string[];
}

const facilitiesData: Facility[] = [
  {
    id: 1,
    name: "Sarana Keagamaan & Pendidikan",
    short_desc: "Masjid, Musholla Nurul Ikhlas, Lembaga Sekolah, dan TPA/TPQ.",
    full_desc: "Sarana ibadah dan pembinaan generasi muda yang mencakup Masjid utama, Musholla Nurul Ikhlas di lingkungan warga, lembaga pendidikan sekolah dasar/menengah sekitar, serta pusat pendidikan Al-Qur'an (TPA/TPQ) aktif bagi anak-anak.",
    images: [
      "/images/masjid.JPG",
      "/images/musholla.jpg",
      "/images/tpq.jpg",
    ],
    icon_name: <Tent size={24} />,
    amenities: ['Musholla Nurul Ikhlas', 'Masjid Utama', 'Kelas TPA / TPQ', 'Lembaga Sekolah', 'Pengajian Rutin']
  },
  {
    id: 2,
    name: "Balai Warga & Fasilitas Umum",
    short_desc: "Pusat musyawarah, pertemuan, dan layanan warga.",
    full_desc: "Balai serbaguna yang digunakan untuk pertemuan pengurus RT/RW, sosialisasi program kelurahan, pos pelayanan terpadu, musyawarah warga, serta kegiatan kebersamaan masyarakat RW 003.",
    images: [
      "/images/balai.JPG",
      "/images/balai2.JPG",
      "/images/IMG_7505.jpg",
    ],
    icon_name: <Users size={24} />,
    amenities: ['Ruang Rapat & Pertemuan', 'Sound System', 'Meja Kursi Komplit', 'Toilet Bersih']
  },
  {
    id: 3,
    name: "Keamanan & Jaringan CCTV",
    short_desc: "Pos Keamanan, pantauan CCTV, dan koordinasi satpam RT.",
    full_desc: "Sistem keamanan terintegrasi yang mencakup pos-pos keamanan aktif, jaringan kamera CCTV di titik-titik strategis lingkungan, serta koordinasi terpadu pengurus RT 001 - RT 005.",
    images: [
      "/images/wifi.jpg",
      "/images/pos1.jpg",
      "/images/pos2.jpg",
      "/images/pos3.jpg",
    ],
    icon_name: <ShieldCheck size={24} />,
    amenities: ['Jaringan CCTV', 'Pos Keamanan', 'Komunikasi Ronda', 'Akses Cepat Pengurus RT']
  },
  {
    id: 4,
    name: "Layanan Kesehatan & Mobil Ambulans",
    short_desc: "Mobil Ambulans Siaga RW dan Posyandu Mandiri.",
    full_desc: "Fasilitas kesehatan warga yang meliputi armada Mobil Ambulans RW untuk kebutuhan darurat 24 jam serta pelaksanaan program Posyandu rutin setiap awal bulan bagi balita, ibu hamil, dan lansia.",
    images: [
      "/images/posyandu.jpeg",
      "/images/ambulan (1).jpg",
      "/images/posyandu.jpg",
      "/images/posyandu2.jpg",
    ],
    icon_name: <HeartPulse size={24} />,
    amenities: ['Mobil Ambulans RW Siaga', 'Pemeriksaan Rutin Posyandu', 'Kontak Darurat Bpk. Dedi', 'Rujukan Puskesmas']
  },
  {
    id: 5,
    name: "Wi-Fi Publik & TPBU",
    short_desc: "Akses internet publik dan Tempat Pemakaman Bukan Umum.",
    full_desc: "Penyediaan akses Wi-Fi publik di area fasilitas umum untuk mendukung aktivitas digital masyarakat, serta pengelolaan Tempat Pemakaman Bukan Umum (TPBU) yang tertata rapi bagi warga setempat.",
    images: [
      "/images/wifi.jpg",
      "/images/tpbu.jpg",
      "/images/tpbu2.jpg",
    ],
    icon_name: <TreePine size={24} />,
    amenities: ['Wi-Fi Publik', 'Area Terbuka Hijau', 'TPBU Tertata', 'Penerangan Jalan']
  },
  {
    id: 6,
    name: "Ekonomi & Usaha Lokal",
    short_desc: "Kafe dan pelaku usaha mikro di lingkungan RW 003.",
    full_desc: "Dukungan bagi ekosistem ekonomi warga melalui kehadiran kafe, warung kebutuhan pokok, dan usaha mandiri lokal yang menghidupkan roda perekonomian masyarakat sekitar.",
    images: [
      "/images/umkm.jpg",
      "/images/umkm2.jpg",
      "/images/umkm3.jpg",
    ],
    icon_name: <Activity size={24} />,
    amenities: ['Kafe / Kedai Lokal', 'UMKM Warga', 'Akses Mudah', 'Dukungan Komunitas']
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSelectFacility = (facility: Facility) => {
    setSelectedFacility(facility);
    setCurrentImageIndex(0);
  };

  return (
    <main className="flex-grow pt-[100px]">
      {/* Hero Section */}
      <section className="relative w-full px-8 md:px-16 lg:px-24 xl:px-32 py-16 md:py-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/20 rounded-pebble blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-secondary-container/20 rounded-pebble-2 blur-3xl -z-10"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 z-10">
            <div className="inline-flex items-center gap-2 bg-primary-container/30 text-on-primary-container text-xs sm:text-sm font-bold px-4 py-2 rounded-full">
              <span>📑 SIPAKAR RW 003</span>
              <span>•</span>
              <span className="italic font-medium">"RW 003, Maju dan Berkembang!"</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface leading-tight tracking-tight">
              Sistem Informasi, Profil, & <span className="text-primary">Aduan Kampung Utan</span>
            </h1>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-lg leading-relaxed">
              Selamat datang di portal resmi RW 003 Kampung Utan. Wadah terintegrasi untuk layanan persuratan, transparansi informasi, keterbukaan aspirasi, dan kebersamaan 5 Wilayah RT (RT 001 hingga RT 005).
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => navigate('/services')}
                className="bg-primary text-on-primary text-sm font-semibold px-8 py-4 rounded-full shadow-ambient hover:shadow-[0_30px_60px_rgba(53,102,104,0.12)] hover:-translate-y-1 transition-all duration-300"
              >
                Layanan & Aduan Warga
              </button>
              <button 
                onClick={() => navigate('/sejarah')}
                className="bg-secondary-container text-on-secondary-container text-sm font-semibold px-8 py-4 rounded-full shadow-ambient hover:shadow-[0_30px_60px_rgba(53,102,104,0.12)] hover:-translate-y-1 transition-all duration-300"
              >
                Profil & Sejarah
              </button>
            </div>
          </div>
          
          <div className="relative h-[400px] md:h-[600px] z-10">
            <div className="absolute inset-0 bg-surface-container-lowest rounded-pebble shadow-ambient overflow-hidden p-4">
              <img 
                alt="Gerbang Jalan Swadaya" 
                className="w-full h-full object-cover rounded-pebble" 
                src="/images/DSC_0953.JPG"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="absolute -bottom-8 -left-8 bg-surface-container-lowest p-6 rounded-3xl shadow-ambient flex items-center gap-4 border border-outline-variant/30">
              <div className="w-16 h-16 bg-primary-container/40 rounded-full flex items-center justify-center">
                <Users className="text-primary" size={32} />
              </div>
              <div>
                <p className="text-2xl font-bold text-on-surface">5 Wilayah RT</p>
                <p className="text-xs sm:text-sm font-semibold text-on-surface-variant">RT 001 s.d RT 005 Terintegrasi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Map */}
      <section className="w-full px-8 md:px-16 lg:px-24 xl:px-32 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          <div className="md:col-span-5 bg-surface-container-lowest rounded-pebble-2 p-8 sm:p-10 md:p-12 shadow-ambient flex flex-col justify-center border border-outline-variant/20">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container/30 text-on-primary-container rounded-full text-xs font-semibold w-max mb-4">
              <BookOpen size={14} />
              <span>Profil & Asal Usul</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">Tentang RW 003</h2>
            <p className="text-base text-on-surface-variant mb-4 leading-relaxed">
              Dahulu wilayah agraris dengan hamparan persawahan rindang pepohonan. Kini RW 003 Kampung Utan telah berkembang menjadi kawasan pemukiman tertata yang menaungi 5 Wilayah RT (RT 001 hingga RT 005).
            </p>
            <div className="mb-6 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-xs sm:text-sm space-y-1 text-on-surface-variant">
              <p className="font-semibold text-on-surface mb-1">Batas Wilayah Administrasi:</p>
              <p>• <strong>Barat:</strong> Area Rajawali</p>
              <p>• <strong>Timur:</strong> Kompleks Maleo</p>
              <p>• <strong>Selatan:</strong> Kampung Rawa Timur</p>
              <p>• <strong>Utara:</strong> Pondok Pucung</p>
            </div>
            <div>
              <Link 
                to="/sejarah" 
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-secondary/15 hover:bg-secondary/25 text-secondary hover:text-primary font-bold text-sm rounded-full transition-all duration-200 group"
              >
                <span>Baca Sejarah & Visi Lengkap</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="md:col-span-7 shadow-ambient relative overflow-hidden rounded-3xl">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1667.4236192508902!2d106.711336397182!3d-6.286842953615199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69fabd4a9ae2e5%3A0xa7b5996ce08b9951!2sJl.%20Swadaya%2C%20Pd.%20Pucung%2C%20Kec.%20Pd.%20Aren%2C%20Kota%20Tangerang%20Selatan%2C%20Banten%2015229!5e0!3m2!1sid!2sid!4v1787547257672!5m2!1sid!2sid"
              className="w-full h-full min-h-[420px] rounded-3xl shadow-lg border-0"
              allowFullScreen={true}
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Vision/Mission */}
      <section className="w-full px-8 md:px-16 lg:px-24 xl:px-32 py-16">
        <div className="bg-surface-container-lowest rounded-[3rem] p-10 md:p-16 shadow-ambient relative overflow-hidden border border-outline-variant/20">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary-container/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl"></div>
          
          <div className="text-center mb-12 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary-container/30 px-3 py-1 rounded-full">
              Arah Kebijakan & Komitmen
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface mt-2">Visi & Misi Pengelolaan Wilayah</h2>
            <p className="text-sm sm:text-base text-on-surface-variant max-w-xl mx-auto mt-2 italic font-semibold">
              "RW 003, Maju dan Berkembang!"
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary-container/30 rounded-2xl flex items-center justify-center text-primary">
                <Leaf size={32} />
              </div>
              <h3 className="text-2xl font-bold text-on-surface">Kemajuan & Perubahan Wilayah</h3>
              <p className="text-base text-on-surface-variant leading-relaxed">
                Mengembangkan RW 003 dari pemukiman yang terisolasi/tertinggal menjadi wilayah yang terdepan dalam tata kelola dan kemasyarakatan.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-secondary-container/30 rounded-2xl flex items-center justify-center text-secondary">
                <Shield size={32} />
              </div>
              <h3 className="text-2xl font-bold text-on-surface">Pemerataan Pembangunan</h3>
              <p className="text-base text-on-surface-variant leading-relaxed">
                Mewujudkan pembangunan sarana fisik dan non-fisik secara merata guna memenuhi kebutuhan masyarakat (seperti perbaikan jalan, balai warga, serta pos-pos pelayanan dan keamanan).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="w-full px-8 md:px-16 lg:px-24 xl:px-32 py-16 mb-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container/30 text-on-primary-container rounded-full text-xs font-semibold w-max mb-2">
            <span>Sarana & Fasilitas Publik</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-2">Fasilitas Publik RW 003</h2>
          <p className="text-lg text-on-surface-variant">Sarana keagamaan, pendidikan, keamanan, dan layanan publik bagi seluruh warga.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
          {facilitiesData.map((facility, index) => {
            if (index === 0) {
              return (
                <div 
                  key={facility.id} 
                  onClick={() => handleSelectFacility(facility)}
                  className="md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden relative shadow-ambient group cursor-pointer hover:scale-[1.02] transition-transform duration-300 min-h-[400px]"
                >
                  <img 
                    src={facility.images[0]} 
                    alt={facility.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-2/3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 text-white z-10">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="bg-white/20 p-2.5 rounded-xl text-white backdrop-blur-sm">
                        {facility.icon_name}
                      </div>
                      <h3 className="text-2xl font-bold">{facility.name}</h3>
                    </div>
                    <p className="text-white/90 line-clamp-2">{facility.short_desc}</p>
                  </div>
                </div>
              );
            }
            
            return (
              <div 
                key={facility.id} 
                onClick={() => handleSelectFacility(facility)}
                className="bg-surface-container-lowest rounded-3xl p-6 shadow-ambient border border-outline-variant/30 flex flex-col justify-between group cursor-pointer hover:scale-[1.02] transition-transform duration-300 min-h-[180px]"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform shrink-0">
                  {facility.icon_name}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-on-surface mb-2">{facility.name}</h3>
                  <p className="text-sm text-on-surface-variant line-clamp-2">{facility.short_desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Facility Modal */}
      {selectedFacility && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedFacility(null)}
        >
          <div 
            className="max-w-5xl w-full h-[88vh] sm:h-[82vh] max-h-[750px] flex overflow-hidden rounded-3xl bg-white relative animate-in fade-in zoom-in-95 duration-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedFacility(null)}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 bg-white/80 hover:bg-white text-slate-800 rounded-full p-2.5 transition-all z-50 shadow-md active:scale-95"
              aria-label="Tutup"
            >
              <X size={20} />
            </button>

            {/* Left Side: Master Detail View */}
            <div className="w-full md:w-2/3 flex flex-col h-full bg-white relative">
              {/* Top: Cover Image */}
              <div className="h-[45%] sm:h-[50%] md:h-[58%] relative w-full shrink-0">
                <img 
                  src={selectedFacility.images[currentImageIndex]} 
                  alt={selectedFacility.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 flex items-center gap-3 sm:gap-4 pr-12">
                  <div className="bg-white/20 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl text-white shrink-0">
                    {selectedFacility.icon_name}
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">{selectedFacility.name}</h3>
                </div>
              </div>
              
              {/* Bottom: Description & Thumbnails */}
              <div className="flex-1 p-5 sm:p-6 md:p-8 overflow-y-auto">
                {/* Thumbnails Gallery */}
                <div className="flex gap-2 overflow-x-auto mb-4 sm:mb-6 pb-1.5 scrollbar-thin">
                  {selectedFacility.images.map((img, idx) => (
                    <img 
                      key={idx}
                      src={img}
                      alt={`${selectedFacility.name} thumbnail ${idx + 1}`}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover cursor-pointer border-2 transition-all shrink-0 ${
                        currentImageIndex === idx 
                          ? 'border-primary ring-2 ring-primary/30 opacity-100 scale-105' 
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>

                <h4 className="text-base sm:text-lg font-bold text-primary mb-2 sm:mb-3">Tentang Fasilitas</h4>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed text-justify mb-5 sm:mb-6">
                  {selectedFacility.full_desc}
                </p>
                
                <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-3">Kelengkapan Fasilitas:</h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {selectedFacility.amenities?.map((amenity, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-green-50 text-green-700 text-xs sm:text-sm font-medium rounded-full border border-green-100 inline-flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={13} />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side: List of Facilities (Desktop) */}
            <div className="hidden md:flex w-1/3 flex-col bg-slate-50 border-l border-slate-200 h-full">
              <div className="p-6 pb-4 border-b border-slate-200 shrink-0">
                <h4 className="text-lg font-bold text-slate-800">Fasilitas Lainnya</h4>
              </div>
              <div className="overflow-y-auto p-4 flex flex-col gap-3 h-full">
                {facilitiesData.map((facility) => {
                  const isActive = selectedFacility.id === facility.id;
                  return (
                    <div 
                      key={facility.id}
                      onClick={() => handleSelectFacility(facility)}
                      className={`flex gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 border ${
                        isActive 
                          ? 'bg-primary/5 border-primary/30 shadow-sm' 
                          : 'bg-white border-transparent hover:border-slate-200 hover:shadow-sm'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                        <img 
                          src={facility.images[0]} 
                          alt={facility.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h5 className={`font-semibold text-sm line-clamp-1 ${isActive ? 'text-primary' : 'text-slate-700'}`}>
                          {facility.name}
                        </h5>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {facility.short_desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
