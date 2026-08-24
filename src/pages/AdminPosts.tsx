import React, { useState, useEffect } from 'react';
import { Trash2, Edit, X } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  category: string;
  type: string;
  author: string;
  event_date: string;
  created_at: string;
  content: string;
  location?: string;
}

export default function AdminPosts({ type }: { type: 'news' | 'activity' }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Post>>({});
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [type]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/posts?type=${type}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    setPostToDelete(id);
  };

  const executeDelete = async () => {
    if (postToDelete === null) return;
    try {
      const res = await fetch(`/api/posts/${postToDelete}`, { method: 'DELETE' });
      if (res.ok) fetchPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
    } finally {
      setPostToDelete(null);
    }
  };

  const openEditModal = (post: Post) => {
    // format date for datetime-local
    let eventDateStr = '';
    if (post.event_date) {
      const date = new Date(post.event_date);
      // approximate offset
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      eventDateStr = date.toISOString().slice(0, 16);
    }
    setEditFormData({ ...post, event_date: eventDateStr });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', editFormData.title || '');
      formData.append('content', editFormData.content || '');
      formData.append('category', editFormData.category || '');
      
      if (type === 'activity') {
        formData.append('eventDate', editFormData.event_date || '');
        formData.append('location', editFormData.location || '');
      }

      const res = await fetch(`/api/posts/${editFormData.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        fetchPosts();
      } else {
        alert('Gagal memperbarui data.');
      }
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-on-background tracking-tight">
            {type === 'news' ? 'Manajemen Berita' : 'Manajemen Aktivitas'}
          </h2>
          <p className="text-lg text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
            {type === 'news' ? 'Kelola daftar berita yang telah dipublikasikan.' : 'Kelola daftar kegiatan dan jadwal yang telah dibuat.'}
          </p>
        </div>
      </header>

      <section className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm border border-outline-variant/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-on-surface-variant text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Judul</th>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold">Tanggal Publikasi</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">Memuat...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">Belum ada data.</td></tr>
              ) : (
                posts.map(post => (
                  <tr key={post.id} className="border-b border-outline-variant/10 hover:bg-surface-container/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-on-surface">{post.title}</td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">{post.category}</span>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant text-sm">
                      {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">Published</span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openEditModal(post)} className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => confirmDelete(post.id)} className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-error-container text-on-error-container hover:bg-error hover:text-white transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-background/20 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 shadow-ambient w-full max-w-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-6 right-6 text-on-surface-variant hover:text-error transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-on-surface mb-8">Edit {type === 'news' ? 'Berita' : 'Aktivitas'}</h2>
            
            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Judul</label>
                <input 
                  type="text" 
                  value={editFormData.title || ''}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Kategori</label>
                <input 
                  type="text" 
                  value={editFormData.category || ''}
                  onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
                  required
                />
              </div>
              
              {type === 'activity' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface">Waktu Pelaksanaan</label>
                    <input 
                      type="datetime-local" 
                      value={editFormData.event_date || ''}
                      onChange={(e) => setEditFormData({...editFormData, event_date: e.target.value})}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface">Lokasi</label>
                    <input 
                      type="text" 
                      value={editFormData.location || ''}
                      onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Konten / Deskripsi</label>
                <textarea 
                  value={editFormData.content || ''}
                  onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface min-h-[150px]"
                  required
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-primary text-on-primary font-bold py-4 rounded-2xl shadow-ambient hover:shadow-[0_12px_24px_rgba(74,101,73,0.2)] hover:-translate-y-0.5 transition-all duration-300"
              >
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      )}

      {postToDelete !== null && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-on-background/20 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-[2rem] p-8 max-w-sm w-full shadow-ambient text-center">
            <h3 className="text-xl font-bold text-on-surface mb-2">Konfirmasi Hapus</h3>
            <p className="text-on-surface-variant mb-6">Apakah Anda yakin ingin menghapus data ini?</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setPostToDelete(null)}
                className="px-6 py-2 rounded-full border border-outline-variant font-bold text-on-surface-variant hover:bg-surface-container"
              >
                Batal
              </button>
              <button 
                onClick={executeDelete}
                className="px-6 py-2 rounded-full bg-error text-on-error font-bold hover:opacity-90"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
