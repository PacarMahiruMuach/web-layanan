import { MapPin, Clock, Phone, AlertTriangle, User, MessageCircle, HeartPulse, ShieldCheck, Instagram } from 'lucide-react';

const pengurusRW = [
  { role: "Ketua RW 003", name: "Muhammad Dedi, S.E.", phone: "+62 877-7454-6223" },
  { role: "Sekretaris RW 003", name: "Ridwan Yusuf", phone: "+62 877-7454-6223" },
  { role: "Bendahara RW 003", name: "Adendra", phone: "+62 877-7454-6223" },
];

const ketuaRTData = [
  { role: "Ketua RT 001", name: "Rahmat", phone: "+62 878-7916-3475" },
  { role: "Ketua RT 002", name: "Marjuki", phone: "+62 812-8116-5614" },
  { role: "Ketua RT 003", name: "Sulaiman", phone: "+62 877-8152-0516" },
  { role: "Ketua RT 004", name: "Samsuri", phone: "+62 819-0522-9136" },
  { role: "Ketua RT 005", name: "Saiful", phone: "+62 857-1629-3558" },
];

export default function Contact() {
  return (
    <main className="w-full pt-28 pb-16 px-8 md:px-16 lg:px-24 xl:px-32 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-container/30 text-on-primary-container text-xs sm:text-sm font-semibold mb-3">
            <span>SIPAKAR RW 003</span>
            <span>•</span>
            <span className="italic">"RW 003, Maju dan Berkembang!"</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">Kontak & Layanan Warga</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Susunan kepengurusan, daftar Ketua RT 001 s.d RT 005, serta nomor layanan penting & darurat lingkungan RW 003 Kampung Utan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Kolom Kiri: Informasi & Darurat */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Alamat Sekretariat */}
            <div className="bg-surface-container-low p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant/30">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-2xl text-primary shrink-0 mt-1">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface mb-2">Sekretariat RW 003</h3>
                  <p className="text-on-surface-variant leading-relaxed text-sm sm:text-base">
                    Balai Warga RW 003 Kampung Utan<br />
                    Kecamatan Ciputat Timur, Kota Tangerang Selatan<br />
                    Banten (Menaungi RT 001 s.d RT 005)
                  </p>
                </div>
              </div>
            </div>

            {/* Media Sosial Karang Taruna */}
            <div className="bg-surface-container-low p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant/30">
              <div className="flex items-start gap-4">
                <div className="bg-pink-100 p-3 rounded-2xl text-pink-700 shrink-0 mt-1">
                  <Instagram size={24} />
                </div>
                <div className="w-full">
                  <h3 className="text-xl font-bold text-on-surface mb-2">Media Sosial Resmi</h3>
                  <p className="text-sm text-on-surface-variant mb-4">
                    Dokumentasi kegiatan, pengumuman pemuda, dan silaturahmi warga:
                  </p>
                  <div className="space-y-2">
                    <a 
                      href="https://instagram.com/karangtaruna03_kp.utan" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm font-semibold hover:border-primary transition-all text-on-surface"
                    >
                      <span>Instagram: @karangtaruna03_kp.utan</span>
                      <span className="text-primary text-xs">Buka ↗</span>
                    </a>
                    <a 
                      href="https://tiktok.com/@karangtaruna03_kp.utan" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-surface border border-outline-variant/30 text-sm font-semibold hover:border-primary transition-all text-on-surface"
                    >
                      <span>TikTok: @karangtaruna03_kp.utan</span>
                      <span className="text-primary text-xs">Buka ↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Nomor Darurat & Layanan Penting */}
            <div className="bg-error-container/20 p-6 md:p-8 rounded-3xl shadow-sm border border-error/20">
              <div className="flex items-start gap-4">
                <div className="bg-error/10 p-3 rounded-2xl text-error shrink-0 mt-1">
                  <AlertTriangle size={24} />
                </div>
                <div className="w-full">
                  <h3 className="text-xl font-bold text-error mb-2">Nomor Kontak Penting & Darurat</h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant mb-4">
                    Layanan kesehatan darurat dan koordinasi keamanan terpadu:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1 p-3.5 bg-surface rounded-2xl border border-outline-variant/30">
                      <span className="text-xs font-semibold text-on-surface-variant">Layanan Ambulans & Posyandu</span>
                      <div className="flex items-center gap-1.5 text-on-surface font-bold text-sm">
                        <HeartPulse size={16} className="text-green-600 shrink-0" />
                        <span>0877-7454-6223</span>
                      </div>
                      <span className="text-[11px] text-outline">Bpk. Dedi</span>
                    </div>

                    <div className="flex flex-col gap-1 p-3.5 bg-surface rounded-2xl border border-outline-variant/30">
                      <span className="text-xs font-semibold text-on-surface-variant">Puskesmas</span>
                      <div className="flex items-center gap-1.5 text-on-surface font-bold text-sm">
                        <Phone size={16} className="text-blue-600 shrink-0" />
                        <span>0857-1076-4490</span>
                      </div>
                      <span className="text-[11px] text-outline">Layanan Medis</span>
                    </div>

                    <div className="flex flex-col gap-1 p-3.5 bg-surface rounded-2xl border border-outline-variant/30">
                      <span className="text-xs font-semibold text-on-surface-variant">Polsek Ciputat</span>
                      <div className="flex items-center gap-1.5 text-on-surface font-bold text-sm">
                        <ShieldCheck size={16} className="text-primary shrink-0" />
                        <span>110</span>
                      </div>
                      <span className="text-[11px] text-outline">Kepolisian</span>
                    </div>

                    <div className="flex flex-col gap-1 p-3.5 bg-surface rounded-2xl border border-outline-variant/30">
                      <span className="text-xs font-semibold text-on-surface-variant">Pemadam Kebakaran</span>
                      <div className="flex items-center gap-1.5 text-on-surface font-bold text-sm">
                        <AlertTriangle size={16} className="text-error shrink-0" />
                        <span>113</span>
                      </div>
                      <span className="text-[11px] text-outline">Damkar Tangsel</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-surface rounded-2xl border border-outline-variant/30 text-xs text-on-surface-variant">
                    <p className="font-semibold text-on-surface mb-0.5">Pos Keamanan / Satpam:</p>
                    <p>Warga dapat langsung menghubungi nomor Ketua RT masing-masing untuk koordinasi keamanan & ronda setempat.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Daftar Pengurus RW & RT */}
          <div className="lg:col-span-7 space-y-8">
            {/* Kepengurusan RW */}
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-ambient border border-outline-variant/40">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-primary bg-primary-container/30 px-3 py-1 rounded-full uppercase tracking-wider">
                  Tingkat RW
                </span>
              </div>
              <h2 className="text-2xl font-bold text-on-surface mb-2">Susunan Kepengurusan RW 003</h2>
              <p className="text-sm text-on-surface-variant mb-6">
                Pengurus inti yang mengkoordinasikan pelayanan warga dan tata kelola lingkungan.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {pengurusRW.map((pengurus, idx) => (
                  <div key={idx} className="bg-surface p-4 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary-container/40 p-2.5 rounded-full text-primary shrink-0">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-outline uppercase tracking-wider">{pengurus.role}</p>
                        <h4 className="text-sm font-bold text-on-surface leading-tight mt-0.5">{pengurus.name}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daftar Ketua RT */}
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-ambient border border-outline-variant/40">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-secondary bg-secondary-container/30 px-3 py-1 rounded-full uppercase tracking-wider">
                  Tingkat RT
                </span>
              </div>
              <h2 className="text-2xl font-bold text-on-surface mb-2">Daftar Ketua RT 001 - RT 005 & Kontak</h2>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                Hubungi Ketua RT setempat untuk pengantar surat administrasi, iuran, izin kegiatan, dan keamanan lingkungan.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ketuaRTData.map((rt, idx) => (
                  <div key={idx} className="bg-surface p-4 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="bg-secondary-container/30 p-2.5 rounded-full text-secondary shrink-0">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-outline uppercase tracking-wider">{rt.role}</p>
                        <h4 className="text-base font-bold text-on-surface">{rt.name}</h4>
                      </div>
                    </div>
                    <a 
                      href={`https://wa.me/62${rt.phone.replace(/[^0-9]/g, '').substring(1)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded-xl font-semibold text-xs transition-colors w-full"
                    >
                      <MessageCircle size={15} />
                      <span>{rt.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
