import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight, ArrowLeft, Bell, CheckCircle2, Clock, CheckCheck, Upload, AlertCircle } from 'lucide-react';

type Report = {
  id: number;
  judul: string;
  kategori: string;
  status: string;
  timestamp: string;
  created_at: string;
};

export default function Services() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  
  const [formData, setFormData] = useState({
    nama: '',
    no_wa: '',
    no_rt: '01',
    alamat: '',
    judul: '',
    deskripsi: '',
    urgensi: '',
    kategori: 'Infrastruktur',
    bukti: null as File | null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, bukti: e.target.files[0] });
    }
  };

  const fetchRecentReports = async () => {
    try {
      const response = await fetch('/api/reports');
      if (response.ok) {
        const data = await response.json();
        setRecentReports(data.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch recent reports:', error);
    }
  };

  useEffect(() => {
    fetchRecentReports();
  }, []);

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formPayload = new FormData();
      Object.keys(formData).forEach(key => {
        const val = formData[key as keyof typeof formData];
        if (val !== null && val !== undefined) {
          formPayload.append(key, val as any);
        }
      });
      
      const response = await fetch('/api/reports', {
        method: 'POST',
        body: formPayload
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        fetchRecentReports();
      } else {
        alert("Gagal mengirim laporan. Coba lagi.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      no_wa: '',
      no_rt: '01',
      alamat: '',
      judul: '',
      deskripsi: '',
      urgensi: '',
      kategori: 'Infrastruktur',
      bukti: null
    });
    setStep(1);
    setIsSubmitted(false);
  };

  return (
    <main className="pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Form Section */}
      <div className="lg:col-span-8 space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container/30 text-on-primary-container rounded-full text-xs font-semibold w-max mb-1">
            <span>SIPAKAR RW 003</span>
            <span>•</span>
            <span className="italic">Layanan & Aduan Warga</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary tracking-tight">Pusat Layanan Warga</h1>
          <p className="text-sm sm:text-base md:text-lg text-on-surface-variant">Sampaikan laporan, aduan, atau aspirasi Anda untuk lingkungan yang lebih baik.</p>
        </div>

        {/* Alur Pelayanan Administrasi Warga (PDF Content) */}
        <div className="bg-surface-container-low rounded-3xl p-6 sm:p-7 border border-outline-variant/30 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 rounded-xl text-primary font-bold">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-on-surface">Alur Pelayanan Administrasi Warga</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant">Pengurusan Surat Pengantar KTP/KK, Domisili, SKTM, dll.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="bg-surface p-4 rounded-2xl border border-outline-variant/30 space-y-1.5 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-primary-container text-on-primary-container">Tahap 1</span>
                <span className="text-xs font-bold text-outline">Tingkat RT</span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Warga mengajukan permohonan dan kelengkapan berkas kepada <strong>Ketua RT setempat</strong> untuk ditandatangani.
              </p>
            </div>

            <div className="bg-surface p-4 rounded-2xl border border-outline-variant/30 space-y-1.5 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container">Tahap 2</span>
                <span className="text-xs font-bold text-outline">Tingkat RW</span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Berkas yang disetujui RT dibawa ke <strong>Pengurus RW</strong> untuk verifikasi, penandatanganan, dan pengarahan.
              </p>
            </div>

            <div className="bg-surface p-4 rounded-2xl border border-outline-variant/30 space-y-1.5 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-tertiary-container/40 text-on-surface">Tahap 3</span>
                <span className="text-xs font-bold text-outline">Kelurahan</span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Warga membawa dokumen yang telah disahkan RW ke <strong>Kantor Kelurahan</strong> untuk penerbitan surat resmi.
              </p>
            </div>
          </div>
        </div>

        {/* Stepper */}
        {!isSubmitted && (
        <div className="flex items-center justify-between mb-6 sm:mb-8 px-1 sm:px-4">
          <div className="flex flex-col items-center gap-1 sm:gap-2 text-center">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-all ${step >= 1 ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-high text-on-surface-variant'}`}>1</div>
            <span className={`text-[11px] sm:text-sm font-semibold tracking-wide ${step >= 1 ? 'text-primary' : 'text-outline-variant'}`}>Identitas</span>
          </div>
          <div className={`flex-1 h-[2px] mx-2 sm:mx-4 ${step >= 2 ? 'bg-primary' : 'bg-outline-variant'}`}></div>
          <div className="flex flex-col items-center gap-1 sm:gap-2 text-center">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-all ${step >= 2 ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-high text-on-surface-variant'}`}>2</div>
            <span className={`text-[11px] sm:text-sm font-semibold tracking-wide ${step >= 2 ? 'text-primary' : 'text-outline-variant'}`}>Detail</span>
          </div>
          <div className={`flex-1 h-[2px] mx-2 sm:mx-4 ${step >= 3 ? 'bg-primary' : 'bg-outline-variant'}`}></div>
          <div className="flex flex-col items-center gap-1 sm:gap-2 text-center">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-all ${step >= 3 ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-high text-on-surface-variant'}`}>3</div>
            <span className={`text-[11px] sm:text-sm font-semibold tracking-wide ${step >= 3 ? 'text-primary' : 'text-outline-variant'}`}>Bukti</span>
          </div>
        </div>
        )}

        {isSubmitted ? (
          <div className="bg-surface-container-lowest rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-ambient space-y-6 text-center flex flex-col items-center justify-center py-12 sm:py-16 border border-outline-variant/20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-container text-primary flex items-center justify-center mb-2 sm:mb-4">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface">Laporan Berhasil Dikirim!</h2>
            <p className="text-on-surface-variant text-sm sm:text-base max-w-md mx-auto">
              Terima kasih atas laporan Anda. Pengurus RT dan RW akan segera menindaklanjutinya.
            </p>
            <button 
              onClick={resetForm}
              className="mt-4 sm:mt-6 bg-primary text-on-primary text-sm font-semibold tracking-wide px-7 py-3 sm:py-3.5 rounded-full hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"
            >
              Kirim Laporan Lain
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-[2rem] p-5 sm:p-8 md:p-10 shadow-ambient space-y-5 sm:space-y-6 border border-outline-variant/20">
            {step === 1 && (
              <>
                <h2 className="text-2xl font-semibold text-on-surface">Informasi Identitas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold tracking-wide text-on-surface-variant">Nama Lengkap</label>
                    <input 
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-2xl border border-outline-variant bg-surface focus:border-secondary focus:ring-1 focus:ring-secondary transition-all outline-none text-base"
                      placeholder="Masukkan nama lengkap" 
                      type="text" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold tracking-wide text-on-surface-variant">Nomor Telepon / WhatsApp</label>
                    <input 
                      name="no_wa"
                      value={formData.no_wa}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-2xl border border-outline-variant bg-surface focus:border-secondary focus:ring-1 focus:ring-secondary transition-all outline-none text-base"
                      placeholder="0812-xxxx-xxxx" 
                      type="tel" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold tracking-wide text-on-surface-variant">No RT</label>
                    <select
                      name="no_rt"
                      value={formData.no_rt}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-2xl border border-outline-variant bg-surface focus:border-secondary focus:ring-1 focus:ring-secondary transition-all outline-none text-base appearance-none"
                    >
                      <option value="01">RT 01</option>
                      <option value="02">RT 02</option>
                      <option value="03">RT 03</option>
                      <option value="04">RT 04</option>
                      <option value="05">RT 05</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold tracking-wide text-on-surface-variant">Alamat Lengkap (Blok/Nomor)</label>
                    <input 
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-2xl border border-outline-variant bg-surface focus:border-secondary focus:ring-1 focus:ring-secondary transition-all outline-none text-base"
                      placeholder="Cth: Jl. Mawar Blok A No. 12" 
                      type="text" 
                    />
                  </div>
                </div>
                
                <div className="bg-surface-container p-4 rounded-xl flex gap-3 items-start mt-4">
                  <Shield className="text-secondary shrink-0" size={20} />
                  <p className="text-base text-on-surface-variant leading-relaxed">
                    Identitas Anda dirahasiakan dan hanya digunakan oleh pengurus RT/RW untuk tindak lanjut.
                  </p>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-2xl font-semibold text-on-surface">Detail Laporan</h2>
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold tracking-wide text-on-surface-variant">Judul Laporan</label>
                    <input 
                      name="judul"
                      required
                      value={formData.judul}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-2xl border border-outline-variant bg-surface focus:border-secondary focus:ring-1 focus:ring-secondary transition-all outline-none text-base"
                      placeholder="Cth: Lampu Jalan Padam" 
                      type="text" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold tracking-wide text-on-surface-variant">Deskripsi Detail</label>
                    <textarea 
                      name="deskripsi"
                      required
                      value={formData.deskripsi}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3.5 rounded-2xl border border-outline-variant bg-surface focus:border-secondary focus:ring-1 focus:ring-secondary transition-all outline-none text-base resize-none"
                      placeholder="Jelaskan secara detail mengenai laporan atau keluhan Anda..." 
                    ></textarea>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold tracking-wide text-on-surface-variant">Kategori Laporan</label>
                    <select
                      name="kategori"
                      value={formData.kategori}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-2xl border border-outline-variant bg-surface focus:border-secondary focus:ring-1 focus:ring-secondary transition-all outline-none text-base appearance-none"
                    >
                      <option value="Keamanan">Keamanan</option>
                      <option value="Kebersihan">Kebersihan</option>
                      <option value="Infrastruktur">Infrastruktur</option>
                      <option value="Administrasi">Administrasi</option>
                      <option value="Sosial">Sosial</option>
                      <option value="Lain-lain">Lain-lain</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-2xl font-semibold text-on-surface">Bukti & Urgensi</h2>
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold tracking-wide text-on-surface-variant">Upload Bukti Foto/Video</label>
                    <div className="border-2 border-dashed border-outline-variant rounded-2xl p-6 flex flex-col items-center justify-center bg-surface hover:bg-surface-container transition-colors cursor-pointer relative">
                      <Upload className="text-tertiary mb-3" size={32} />
                      <p className="text-base text-on-surface font-medium mb-1">
                        {formData.bukti ? formData.bukti.name : 'Pilih file atau tarik ke sini'}
                      </p>
                      <p className="text-sm text-outline">Maks. 10MB (JPG, PNG, MP4)</p>
                      <input 
                        type="file" 
                        name="bukti" 
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold tracking-wide text-on-surface-variant">Seberapa mendesak laporan ini?</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['Rendah', 'Sedang', 'Tinggi'].map((level) => (
                        <label key={level} className={`cursor-pointer border rounded-2xl p-4 flex flex-col gap-2 transition-all ${formData.urgensi === level ? 'border-primary bg-primary-container/20 shadow-sm' : 'border-outline-variant hover:border-outline'}`}>
                          <input 
                            type="radio" 
                            name="urgensi" 
                            value={level} 
                            checked={formData.urgensi === level}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <span className="font-semibold text-on-surface text-center">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
            
            <div className="flex justify-between items-center pt-6 mt-6 border-t border-outline-variant/30">
              {step > 1 ? (
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="text-on-surface-variant text-sm font-semibold tracking-wide px-6 py-3.5 rounded-full hover:bg-surface-container transition-all flex items-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Kembali
                </button>
              ) : (
                <div></div>
              )}
              
              {step < 3 ? (
                <button 
                  type="button"
                  onClick={nextStep}
                  className="bg-primary text-on-primary text-sm font-semibold tracking-wide px-8 py-3.5 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  Lanjut
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button 
                  type="submit"
                  disabled={isSubmitting || formData.urgensi === ''}
                  className="bg-tertiary text-on-tertiary text-sm font-semibold tracking-wide px-8 py-3.5 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
                  {!isSubmitting && <CheckCheck size={18} />}
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Right Column: Sidebar (Notification Feed) */}
      <div className="lg:col-span-4 space-y-8">
        <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-ambient">
          <div className="flex items-center gap-3 mb-8">
            <Bell className="text-tertiary" size={24} />
            <h3 className="text-2xl font-semibold text-on-surface tracking-tight">Laporan Terbaru</h3>
          </div>
          
          <div className="space-y-4">
            {recentReports.length > 0 ? recentReports.map((report) => (
              <div key={report.id} className="p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs font-medium tracking-wide px-3 py-1 rounded-full ${
                    report.kategori === 'Keamanan' ? 'bg-error-container text-on-error-container' : 
                    report.kategori === 'Kebersihan' ? 'bg-tertiary-container text-on-tertiary-container' : 
                    report.kategori === 'Infrastruktur' ? 'bg-secondary-container text-on-secondary-container' : 
                    'bg-primary-container text-on-primary-container'
                  }`}>
                    {report.kategori}
                  </span>
                  <span className="text-xs font-medium tracking-wide text-outline">
                    {new Date(report.timestamp || report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <p className="text-base text-on-surface leading-relaxed">{report.judul}</p>
                <div className={`mt-3 flex items-center gap-1.5 ${
                  report.status === 'Selesai' ? 'text-primary' : 
                  report.status === 'Menunggu' || report.status === 'Belum diproses' ? 'text-outline' : 
                  'text-secondary'
                }`}>
                  {report.status === 'Selesai' ? <CheckCheck size={16} /> : 
                   report.status === 'Menunggu' || report.status === 'Belum diproses' ? <Clock size={16} /> : 
                   <CheckCircle2 size={16} />}
                  <span className="text-xs font-medium tracking-wide">{report.status}</span>
                </div>
              </div>
            )) : (
              <div className="p-5 text-center text-on-surface-variant text-sm">
                Belum ada laporan.
              </div>
            )}
          </div>
        </div>

        {/* Decorative Element */}
        <div className="hidden lg:block relative h-56 rounded-[2.5rem] overflow-hidden shadow-ambient bg-surface-container">
          <img 
            className="object-cover w-full h-full opacity-90 mix-blend-multiply" 
            alt="Decorative smooth stone" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoyUowSQ-nFpDj4r_wT5U6Yp-sGbjHv__2dm99sF-ix_dOOemn8CEisPFlnylr0CWanwX5-cCBCoAdnAnEsnVyskm6eDXonM-n2R4vCWfrn8CWFERdsGeUKTUzAbczYNQx2Wm3sC0NtmXUsd2vWVQMeh7QeeQnTL4I0QIDQwCvH5f58L-X9HNqux7CDYotpdXhNx3I0RW9zk8cwDXdEfrdRfok7zEtbNEiqZJtkKywr2wf8iLdtpx6"
          />
        </div>
      </div>
    </main>
  );
}
