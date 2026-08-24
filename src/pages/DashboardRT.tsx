import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Menu, 
  Plus, 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Building2, 
  AlertTriangle, 
  Settings, 
  LogOut, 
  RefreshCcw,
  TrendingUp,
  Minus,
  TrendingDown,
  Droplets,
  TreePine,
  VolumeX,
  MoreVertical,
  ArrowRight,
  FileText,
  Send,
  UserCircle,
  X
, Newspaper, Calendar } from 'lucide-react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';

type Report = {
  id: string;
  nama: string;
  no_rt: string;
  no_wa: string;
  kategori: string;
  judul: string;
  deskripsi: string;
  alamat: string;
  urgensi: string;
  status: string;
  is_escalated_to_rw: boolean;
  bukti: string | null;
  timestamp: string;
};

export default function DashboardRT() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const storedUserStr = localStorage.getItem('user');
  const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
  const user = location.state?.user || storedUser;
  
  const rawRt = user?.rt_number || user?.no_rt || "01";
  const rtNumber = rawRt.replace(/[^0-9]/g, '').padStart(2, '0');

  // Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  // Announcement Modal State
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [broadcastType, setBroadcastType] = useState<'news' | 'activity'>('news');
  const [announcementFormData, setAnnouncementFormData] = useState({
    title: '',
    content: '',
    category: '',
    eventDate: '',
    location: ''
  });
  const [announcementImage, setAnnouncementImage] = useState<File | null>(null);

  const handleSubmitAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', announcementFormData.title);
      formData.append('content', announcementFormData.content);
      formData.append('category', announcementFormData.category || broadcastType);
      formData.append('type', broadcastType);
      formData.append('author', currentUser?.name || `Ketua RT ${rtNumber}`);
      
      if (broadcastType === 'activity') {
        formData.append('eventDate', announcementFormData.eventDate);
        formData.append('location', announcementFormData.location);
      }
      
      if (announcementImage) {
        formData.append('image', announcementImage);
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('Pengumuman berhasil dibuat!');
        setIsAnnouncementModalOpen(false);
        setAnnouncementFormData({ title: '', content: '', category: '', eventDate: '', location: '' });
        setAnnouncementImage(null);
        setBroadcastType('news');
      } else {
        alert('Gagal membuat pengumuman');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat membuat pengumuman');
    }
  };

  const [profileFormData, setProfileFormData] = useState({ 
    name: user?.name || `Ketua RT ${rtNumber}`, 
    username: user?.username || `rt${rtNumber}`, 
    oldPassword: '',
    newPassword: ''
  });

  const openProfileModal = () => {
    setProfileFormData({
      name: currentUser?.name || `Ketua RT ${rtNumber}`,
      username: currentUser?.username || `rt${rtNumber}`,
      oldPassword: '',
      newPassword: ''
    });
    setIsProfileModalOpen(true);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        name: profileFormData.name,
        username: profileFormData.username,
      };

      if (profileFormData.newPassword) {
        if (!profileFormData.oldPassword) {
          alert('Harap masukkan Password Lama untuk mengubah password.');
          return;
        }
        payload.oldPassword = profileFormData.oldPassword;
        payload.newPassword = profileFormData.newPassword;
      }

      const userId = currentUser?.id || 2;
      const res = await fetch(`/api/users/profile/${userId}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Profil berhasil diperbarui!');
        const updated = { ...currentUser, name: profileFormData.name, username: profileFormData.username };
        setCurrentUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
        setIsProfileModalOpen(false);
      } else {
        alert(data.error || 'Gagal memperbarui profil');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat memperbarui profil');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      console.log('Fetching data for RT:', rtNumber);
      const response = await fetch(`/api/reports?rt=${rtNumber}`);
      const data = await response.json();
      console.log('Data diterima:', data);
      setReports(data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  };

  const escalateReport = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/reports/${id}/escalate`, { method: 'PUT' });
      fetchReports();
    } catch (error) {
      console.error('Failed to escalate report:', error);
    }
  };
  
  const changeStatus = async (id: string, status: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    try {
      await fetch(`/api/reports/${id}/status`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchReports();
    } catch (error) {
      console.error('Failed to change status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes('selesai')) {
      return 'bg-primary-container/50 text-on-primary-container';
    } else if (status.toLowerCase().includes('tindak') || status.toLowerCase().includes('diteruskan')) {
      return 'bg-secondary-container/50 text-on-secondary-container';
    }
    return 'bg-error-container/50 text-on-error-container';
  };

  const getIconForCategory = (kategori: string) => {
    switch(kategori.toLowerCase()) {
      case 'infrastruktur': return <Droplets className="text-outline" size={24} />;
      case 'lingkungan': return <TreePine className="text-outline" size={24} />;
      case 'keamanan': return <VolumeX className="text-outline" size={24} />;
      default: return <FileText className="text-outline" size={24} />;
    }
  };

  return (
    <div className="bg-background text-on-background font-sans antialiased min-h-screen overflow-x-hidden">
      {/* Mobile Nav Header */}
      <header className="md:hidden flex justify-between items-center px-5 py-4 bg-surface-container-low shadow-ambient fixed top-0 w-full z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-pebble overflow-hidden bg-primary-container flex items-center justify-center">
            <Leaf className="text-on-primary-container" size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-on-surface leading-tight">Dashboard RT</h1>
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">RT {rtNumber}</span>
            </div>
            <p className="text-xs font-medium text-on-surface-variant">Kampung Utan 003</p>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface"
          aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
        >
          {isMobileMenuOpen ? <X size={22} className="text-error" /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-xs top-[68px]" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      <div className="flex h-screen overflow-hidden pt-[68px] md:pt-0">
        {/* SideNavBar (Desktop & Mobile when open) */}
        <aside className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col h-[calc(100vh-68px)] md:h-full py-6 md:py-8 bg-surface-container-low text-primary fixed md:relative left-0 top-[68px] md:top-0 w-64 max-w-[85vw] rounded-r-[2rem] shadow-[10px_0_30px_rgba(53,102,104,0.05)] z-40 transition-all`}>
          {/* Brand/Avatar Area (Desktop) */}
          <div className="px-6 mb-8 hidden md:block">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-pebble overflow-hidden shadow-ambient relative bg-primary-container flex items-center justify-center">
                 <Leaf className="text-on-primary-container" size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-on-surface tracking-tight leading-tight">Dashboard RT</h1>
                </div>
                <p className="text-xs font-medium text-on-surface-variant">RT {rtNumber} / RW 003</p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAnnouncementModalOpen(true);
              }}
              className="w-full bg-primary text-on-primary text-sm font-semibold py-3.5 rounded-full shadow-ambient hover:shadow-[0_12px_24px_rgba(74,101,73,0.2)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Buat Pengumuman
            </button>
          </div>

          <div className="px-4 mb-3 md:hidden">
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAnnouncementModalOpen(true);
              }}
              className="w-full bg-primary text-on-primary text-sm font-semibold py-3 rounded-full shadow-sm flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Buat Pengumuman
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-4 space-y-1.5">
            <Link 
              to="/admin/dashboard-rt" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${location.pathname === '/admin/dashboard-rt' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary font-medium hover:bg-surface-container-high hover:translate-x-1'} text-sm rounded-full mx-2 flex items-center gap-3 px-4 py-3 transition-all duration-200`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link 
              to="/admin/dashboard-rt/news" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${location.pathname === '/admin/dashboard-rt/news' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary font-medium hover:bg-surface-container-high hover:translate-x-1'} text-sm rounded-full mx-2 flex items-center gap-3 px-4 py-3 transition-all duration-200`}
            >
              <Newspaper size={18} />
              Berita
            </Link>
            <Link 
              to="/admin/dashboard-rt/activities" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${location.pathname === '/admin/dashboard-rt/activities' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary font-medium hover:bg-surface-container-high hover:translate-x-1'} text-sm rounded-full mx-2 flex items-center gap-3 px-4 py-3 transition-all duration-200`}
            >
              <Calendar size={18} />
              Aktivitas
            </Link>
            <Link 
              to="/admin/dashboard-rt/directory" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${location.pathname === '/admin/dashboard-rt/directory' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary font-medium hover:bg-surface-container-high hover:translate-x-1'} text-sm rounded-full mx-2 flex items-center gap-3 px-4 py-3 transition-all duration-200`}
            >
              <Users size={18} />
              Data Warga
            </Link>
          </nav>

          {/* Footer Links */}
          <div className="px-4 mt-auto space-y-1.5 pt-4 border-t border-outline-variant/30">
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                openProfileModal();
              }} 
              className="w-full text-left text-on-surface-variant hover:text-primary font-medium text-sm hover:bg-surface-container-high rounded-full mx-2 flex items-center gap-3 px-4 py-3 transition-all duration-200"
            >
              <UserCircle size={18} />
              Edit Profil
            </button>
            
            <button 
              onClick={handleLogout} 
              className="w-full text-left text-on-surface-variant hover:text-error font-medium text-sm hover:bg-error-container/50 rounded-full mx-2 flex items-center gap-3 px-4 py-3 transition-all duration-200"
            >
              <LogOut size={18} />
              Keluar
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-y-auto bg-background p-5 md:p-10 w-full">
          <Outlet context={{ rtNumber, reports, fetchReports, changeStatus, escalateReport, getIconForCategory }} />
        </main>
      </div>

      {/* Modal Edit Profil */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-[2rem] p-6 sm:p-8 shadow-ambient w-full max-w-md my-auto relative animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            <button 
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-all z-10"
              title="Tutup"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3.5 mb-5 pr-8">
              <div className="w-12 h-12 bg-tertiary-container/40 rounded-2xl flex items-center justify-center text-tertiary shrink-0">
                <UserCircle size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface leading-tight">Edit Profil</h2>
                <p className="text-xs text-on-surface-variant">Perbarui data diri dan kata sandi akun RT</p>
              </div>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="overflow-y-auto pr-1 -mr-1 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={profileFormData.name}
                  onChange={(e) => setProfileFormData({...profileFormData, name: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
                  required
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface">Username</label>
                <input 
                  type="text" 
                  value={profileFormData.username}
                  onChange={(e) => setProfileFormData({...profileFormData, username: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
                  required
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface">Role</label>
                <input 
                  type="text" 
                  value={`Ketua RT ${rtNumber}`}
                  disabled
                  readOnly
                  className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface-variant cursor-not-allowed"
                />
              </div>
              
              <div className="pt-2 border-t border-outline-variant/30">
                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Ubah Password (Opsional)</h3>
                
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface">Password Lama</label>
                    <input 
                      type="password" 
                      value={profileFormData.oldPassword}
                      onChange={(e) => setProfileFormData({...profileFormData, oldPassword: e.target.value})}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface placeholder:text-outline-variant"
                      placeholder="Masukkan password saat ini"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface">Password Baru</label>
                    <input 
                      type="password" 
                      value={profileFormData.newPassword}
                      onChange={(e) => setProfileFormData({...profileFormData, newPassword: e.target.value})}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface placeholder:text-outline-variant"
                      placeholder="Kosongkan jika tidak ingin diubah"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button 
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 bg-surface-container-high text-on-surface font-semibold py-3 rounded-full text-sm hover:bg-outline-variant/20 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-tertiary text-on-tertiary font-semibold py-3 rounded-full text-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Lightbox Gambar */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 md:-right-12 text-white hover:text-gray-300 transition-colors p-2"
            >
              <X size={32} />
            </button>
            <img 
              src={selectedImage} 
              alt="Pratinjau Bukti Laporan" 
              className="max-w-4xl max-h-[90vh] w-full object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Modal Buat Pengumuman */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-background/20 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 shadow-ambient w-full max-w-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsAnnouncementModalOpen(false)}
              className="absolute top-6 right-6 text-on-surface-variant hover:text-error transition-colors"
            >
              <X size={24} />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary-container/30 rounded-pebble flex items-center justify-center text-primary">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-on-surface">Buat Pengumuman</h2>
                <p className="text-sm text-on-surface-variant mt-1">Bagikan informasi atau kegiatan ke seluruh warga</p>
              </div>
            </div>
            
            {/* Tab System for Broadcast Type */}
            <div className="flex bg-surface-container-low p-1 rounded-2xl mb-8">
              <button
                type="button"
                onClick={() => setBroadcastType('news')}
                className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${
                  broadcastType === 'news' 
                    ? 'bg-white shadow-sm text-primary' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Berita Umum
              </button>
              <button
                type="button"
                onClick={() => setBroadcastType('activity')}
                className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${
                  broadcastType === 'activity' 
                    ? 'bg-white shadow-sm text-primary' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Kegiatan Warga
              </button>
            </div>
            
            <form onSubmit={handleSubmitAnnouncement} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Judul {broadcastType === 'news' ? 'Berita' : 'Kegiatan'}</label>
                <input 
                  type="text" 
                  value={announcementFormData.title}
                  onChange={(e) => setAnnouncementFormData({...announcementFormData, title: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
                  placeholder={`Masukkan judul ${broadcastType === 'news' ? 'pengumuman' : 'kegiatan'}`}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Kategori</label>
                <input 
                  type="text"
                  value={announcementFormData.category}
                  onChange={(e) => setAnnouncementFormData({...announcementFormData, category: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
                  placeholder="Contoh: Keamanan, Sosial, dll"
                  required
                />
              </div>
              
              {broadcastType === 'activity' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface">Waktu Pelaksanaan</label>
                    <input 
                      type="datetime-local" 
                      value={announcementFormData.eventDate}
                      onChange={(e) => setAnnouncementFormData({...announcementFormData, eventDate: e.target.value})}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface">Lokasi Kegiatan</label>
                    <input 
                      type="text" 
                      value={announcementFormData.location}
                      onChange={(e) => setAnnouncementFormData({...announcementFormData, location: e.target.value})}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
                      placeholder="Contoh: Balai Warga RW 003"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Gambar Cover (Opsional)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setAnnouncementImage(e.target.files[0]);
                    }
                  }}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Konten / Detail</label>
                <textarea 
                  value={announcementFormData.content}
                  onChange={(e) => setAnnouncementFormData({...announcementFormData, content: e.target.value})}
                  className="w-full h-40 bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface resize-none"
                  placeholder="Tuliskan detail informasi di sini..."
                  required
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAnnouncementModalOpen(false)}
                  className="flex-1 bg-surface-container-high text-on-surface font-semibold py-4 rounded-full hover:bg-outline-variant/20 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-primary text-on-primary font-semibold py-4 rounded-full hover:shadow-[0_8px_20px_rgba(55,102,103,0.2)] hover:-translate-y-0.5 transition-all"
                >
                  Publikasikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
