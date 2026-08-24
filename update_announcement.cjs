const fs = require('fs');
let code = fs.readFileSync('src/pages/DashboardRT.tsx', 'utf8');

// Update state declarations
const oldState = `  // Announcement Modal State
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementFormData, setAnnouncementFormData] = useState({
    title: '',
    content: '',
    category: 'news',
  });
  const [announcementImage, setAnnouncementImage] = useState<File | null>(null);`;

const newState = `  // Announcement Modal State
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [broadcastType, setBroadcastType] = useState<'news' | 'activity'>('news');
  const [announcementFormData, setAnnouncementFormData] = useState({
    title: '',
    content: '',
    category: '',
    eventDate: '',
    location: ''
  });
  const [announcementImage, setAnnouncementImage] = useState<File | null>(null);`;
code = code.replace(oldState, newState);

// Update submit handler
const oldSubmit = `  const handleSubmitAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', announcementFormData.title);
      formData.append('content', announcementFormData.content);
      formData.append('category', announcementFormData.category);
      formData.append('author', \`RT \${rtNumber}\`);
      
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
        setAnnouncementFormData({ title: '', content: '', category: 'news' });
        setAnnouncementImage(null);
      } else {
        alert('Gagal membuat pengumuman');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat membuat pengumuman');
    }
  };`;

const newSubmit = `  const handleSubmitAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', announcementFormData.title);
      formData.append('content', announcementFormData.content);
      formData.append('category', announcementFormData.category || broadcastType);
      formData.append('type', broadcastType);
      formData.append('author', \`RT \${rtNumber}\`);
      
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
  };`;
code = code.replace(oldSubmit, newSubmit);

// Update Modal Form
const oldModal = `            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary-container/30 rounded-pebble flex items-center justify-center text-primary">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-on-surface">Buat Pengumuman</h2>
                <p className="text-sm text-on-surface-variant mt-1">Bagikan informasi atau kegiatan ke seluruh warga</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmitAnnouncement} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Judul</label>
                <input 
                  type="text" 
                  value={announcementFormData.title}
                  onChange={(e) => setAnnouncementFormData({...announcementFormData, title: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
                  placeholder="Masukkan judul pengumuman"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Kategori</label>
                <select 
                  value={announcementFormData.category}
                  onChange={(e) => setAnnouncementFormData({...announcementFormData, category: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface appearance-none"
                  required
                >
                  <option value="news">Berita / Pengumuman</option>
                  <option value="activity">Kegiatan Warga</option>
                </select>
              </div>
              
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
                <label className="text-sm font-semibold text-on-surface">Konten</label>
                <textarea 
                  value={announcementFormData.content}
                  onChange={(e) => setAnnouncementFormData({...announcementFormData, content: e.target.value})}
                  className="w-full h-40 bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface resize-none"
                  placeholder="Tuliskan detail pengumuman di sini..."
                  required
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">`;

const newModal = `            <div className="flex items-center gap-4 mb-6">
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
                className={\`flex-1 py-3 text-sm font-semibold rounded-xl transition-all \${
                  broadcastType === 'news' 
                    ? 'bg-white shadow-sm text-primary' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }\`}
              >
                Berita Umum
              </button>
              <button
                type="button"
                onClick={() => setBroadcastType('activity')}
                className={\`flex-1 py-3 text-sm font-semibold rounded-xl transition-all \${
                  broadcastType === 'activity' 
                    ? 'bg-white shadow-sm text-primary' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }\`}
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
                  placeholder={\`Masukkan judul \${broadcastType === 'news' ? 'pengumuman' : 'kegiatan'}\`}
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

              <div className="flex gap-3 pt-4">`;

code = code.replace(oldModal, newModal);
fs.writeFileSync('src/pages/DashboardRT.tsx', code);
console.log('Announcement modal updated');
