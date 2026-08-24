import React, { useState } from 'react';
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
  Activity,
  FileText,
  UserPlus,
  UserCircle,
  X
, Newspaper, Calendar } from 'lucide-react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';

export default function AdminDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  
  const storedUserStr = localStorage.getItem('user');
  const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
  const user = location.state?.user || storedUser;
  
  const isSuperAdmin = user?.role === 'superadmin' || user?.role === 'rw';

  // Modal State for New Broadcast
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastType, setBroadcastType] = useState<'news' | 'activity'>('news');
  const [broadcastFormData, setBroadcastFormData] = useState({
    title: '',
    content: '',
    category: '',
    eventDate: '',
    location: '',
  });
  const [broadcastImage, setBroadcastImage] = useState<File | null>(null);

  const handleBroadcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', broadcastFormData.title);
      formData.append('content', broadcastFormData.content);
      formData.append('category', broadcastFormData.category || broadcastType);
      formData.append('type', broadcastType);
      formData.append('author', user?.name || "Admin RW 003");
      
      if (broadcastType === 'activity') {
        formData.append('eventDate', broadcastFormData.eventDate);
        formData.append('location', broadcastFormData.location);
      }
      
      if (broadcastImage) {
        formData.append('image', broadcastImage);
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('Pengumuman berhasil dipublikasikan!');
        setIsBroadcastModalOpen(false);
        setBroadcastFormData({ title: '', content: '', category: '', eventDate: '', location: '' });
        setBroadcastImage(null);
        setBroadcastType('news');
      } else {
        alert('Gagal membuat pengumuman');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat membuat pengumuman');
    }
  };

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  const [profileFormData, setProfileFormData] = useState({ 
    name: user?.name || 'Admin RW', 
    username: user?.username || 'admin', 
    oldPassword: '', 
    newPassword: '' 
  });

  const openProfileModal = () => {
    setProfileFormData({
      name: currentUser?.name || 'Admin RW',
      username: currentUser?.username || 'admin',
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

      const res = await fetch(`/api/users/profile/${currentUser?.id || 1}`, {
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/admin/login');
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
              <h1 className="text-lg font-bold text-on-surface leading-tight">Admin Portal</h1>
              {isSuperAdmin && (
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Super</span>
              )}
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
          <div className="px-6 mb-10 hidden md:block">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-pebble overflow-hidden shadow-ambient relative">
                <img 
                  className="object-cover w-full h-full absolute inset-0" 
                  alt="Admin Avatar" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0njocto-v1X6qv3SdmRJFgAlQrjVasl9sChkfuzYJjO1ZqUthdGR8O54tUsgFAXfnkB8SgqCAp8jkifYz-fV6nF49fW4RYm_O8TbmN5fa_cdAY5v4aCGuvOk13Krb-AOzDCLFfj298hxtQ9a4eUJ9LnDcaTCacrm1q16S1yZS40B3PMwUfWgb0o0rs9phBRM9kLC2PclGo0sBFztDwTZAKwvs23C7dfDwWF6mHHMr9P5uaw265QDy"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-on-surface tracking-tight leading-tight">Portal Admin</h1>
                  {isSuperAdmin && (
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Super</span>
                  )}
                </div>
                <p className="text-xs font-medium text-on-surface-variant">Kampung Utan 003</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsBroadcastModalOpen(true)}
              className="w-full bg-primary text-on-primary text-sm font-semibold py-3.5 rounded-full shadow-ambient hover:shadow-[0_12px_24px_rgba(74,101,73,0.2)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Siaran Baru
            </button>
          </div>

          <div className="px-4 mb-3 md:hidden">
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsBroadcastModalOpen(true);
              }}
              className="w-full bg-primary text-on-primary text-sm font-semibold py-3 rounded-full shadow-sm flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Siaran Baru
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-4 space-y-1.5">
            <Link 
              to="/admin/dashboard" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${location.pathname === '/admin/dashboard' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary font-medium hover:bg-surface-container-high hover:translate-x-1'} text-sm rounded-full mx-2 flex items-center gap-3 px-4 py-3 transition-all duration-200`}
            >
              <LayoutDashboard size={18} />
              Ringkasan
            </Link>
            <Link 
              to="/admin/dashboard/directory" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${location.pathname === '/admin/dashboard/directory' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary font-medium hover:bg-surface-container-high hover:translate-x-1'} text-sm rounded-full mx-2 flex items-center gap-3 px-4 py-3 transition-all duration-200`}
            >
              <Users size={18} />
              Data Warga
            </Link>
            <Link 
              to="/admin/dashboard/news" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${location.pathname === '/admin/dashboard/news' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary font-medium hover:bg-surface-container-high hover:translate-x-1'} text-sm rounded-full mx-2 flex items-center gap-3 px-4 py-3 transition-all duration-200`}
            >
              <Newspaper size={18} />
              Berita
            </Link>
            <Link 
              to="/admin/dashboard/activities" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${location.pathname === '/admin/dashboard/activities' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary font-medium hover:bg-surface-container-high hover:translate-x-1'} text-sm rounded-full mx-2 flex items-center gap-3 px-4 py-3 transition-all duration-200`}
            >
              <Calendar size={18} />
              Aktivitas
            </Link>
            <Link 
              to="/admin/dashboard/finances" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${location.pathname === '/admin/dashboard/finances' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary font-medium hover:bg-surface-container-high hover:translate-x-1'} text-sm rounded-full mx-2 flex items-center gap-3 px-4 py-3 transition-all duration-200`}
            >
              <Wallet size={18} />
              Keuangan
            </Link>
            <Link 
              to="/admin/dashboard/infrastructure" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${location.pathname === '/admin/dashboard/infrastructure' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary font-medium hover:bg-surface-container-high hover:translate-x-1'} text-sm rounded-full mx-2 flex items-center gap-3 px-4 py-3 transition-all duration-200`}
            >
              <Building2 size={18} />
              Infrastruktur
            </Link>
            <Link 
              to="/admin/dashboard/complaints" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${location.pathname === '/admin/dashboard/complaints' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary font-medium hover:bg-surface-container-high hover:translate-x-1'} text-sm rounded-full mx-2 flex items-center gap-3 px-4 py-3 transition-all duration-200`}
            >
              <AlertTriangle size={18} />
              Aduan & Keluhan
            </Link>
            
            {isSuperAdmin && (
              <>
                <div className="pt-3 pb-1 px-6 text-xs font-bold tracking-wider text-outline uppercase">Super Admin</div>
                <Link 
                  to="/admin/dashboard/accounts" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${location.pathname === '/admin/dashboard/accounts' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary font-medium hover:bg-surface-container-high hover:translate-x-1'} text-left text-sm rounded-full mx-2 flex items-center gap-3 px-4 py-3 transition-all duration-200`}
                >
                  <UserPlus size={18} />
                  Manajemen Akun RT
                </Link>
                <Link 
                  to="/admin/dashboard/logs" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${location.pathname === '/admin/dashboard/logs' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary font-medium hover:bg-surface-container-high hover:translate-x-1'} text-sm rounded-full mx-2 flex items-center gap-3 px-4 py-3 transition-all duration-200`}
                >
                  <Activity size={18} />
                  Log Sistem
                </Link>
              </>
            )}
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
            <Link 
              to="/admin/dashboard/settings" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${location.pathname === '/admin/dashboard/settings' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary font-medium hover:bg-surface-container-high hover:translate-x-1'} text-sm rounded-full mx-2 flex items-center gap-3 px-4 py-3 transition-all duration-200`}
            >
              <Settings size={18} />
              Pengaturan
            </Link>
            <button 
              onClick={handleLogout} 
              className="w-full text-on-surface-variant hover:text-error font-medium text-sm hover:bg-error-container/50 rounded-full mx-2 flex items-center gap-3 px-4 py-3 transition-all duration-200"
            >
              <LogOut size={18} />
              Keluar
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-y-auto bg-background p-5 md:p-10 w-full">
          <Outlet />
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
                <p className="text-xs text-on-surface-variant">Perbarui data diri dan kata sandi akun RW</p>
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
                  value={currentUser?.role === 'superadmin' ? 'Super Admin' : (currentUser?.role === 'rt' ? `Ketua RT ${currentUser?.no_rt || ''}` : 'Ketua RW 003')}
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

      {/* Modal Buat Pengumuman */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 shadow-ambient w-full max-w-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsBroadcastModalOpen(false)}
              className="absolute top-6 right-6 text-on-surface-variant hover:text-error transition-colors"
            >
              <X size={24} />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary-container/30 rounded-pebble flex items-center justify-center text-primary">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-on-surface">New Broadcast</h2>
                <p className="text-sm text-on-surface-variant mt-1">Sampaikan informasi terbaru kepada seluruh warga</p>
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
            
            <form onSubmit={handleBroadcastSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Judul {broadcastType === 'news' ? 'Berita' : 'Kegiatan'}</label>
                <input 
                  type="text" 
                  value={broadcastFormData.title}
                  onChange={(e) => setBroadcastFormData({...broadcastFormData, title: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
                  placeholder={`Masukkan judul ${broadcastType === 'news' ? 'pengumuman' : 'kegiatan'}`}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Kategori</label>
                <input 
                  type="text"
                  value={broadcastFormData.category}
                  onChange={(e) => setBroadcastFormData({...broadcastFormData, category: e.target.value})}
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
                      value={broadcastFormData.eventDate}
                      onChange={(e) => setBroadcastFormData({...broadcastFormData, eventDate: e.target.value})}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface">Lokasi Kegiatan</label>
                    <input 
                      type="text" 
                      value={broadcastFormData.location}
                      onChange={(e) => setBroadcastFormData({...broadcastFormData, location: e.target.value})}
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
                      setBroadcastImage(e.target.files[0]);
                    }
                  }}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Konten / Detail</label>
                <textarea 
                  value={broadcastFormData.content}
                  onChange={(e) => setBroadcastFormData({...broadcastFormData, content: e.target.value})}
                  className="w-full h-40 bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface resize-none"
                  placeholder="Tuliskan detail informasi di sini..."
                  required
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="flex-1 bg-surface-container-high text-on-surface font-semibold py-4 rounded-full hover:bg-outline-variant/20 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white font-semibold py-4 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Kirim/Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
