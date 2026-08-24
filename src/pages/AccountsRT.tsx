import React, { useState, useEffect } from 'react';
import { Plus, Trash2, UserPlus, X, ShieldAlert } from 'lucide-react';

type RtUser = {
  id: number;
  name: string;
  rt_number: string;
  username: string;
};

export default function AccountsRT() {
  const [users, setUsers] = useState<RtUser[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    rt_number: 'RT 01'
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users/rt', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch RT users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users/rt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsAddModalOpen(false);
        setFormData({ name: '', username: '', password: '', rt_number: 'RT 01' });
        fetchUsers();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Gagal membuat akun RT');
      }
    } catch (error) {
      console.error('Failed to add RT user:', error);
    }
  };

  const confirmDelete = (id: number) => {
    setUserToDelete(id);
  };

  const executeDelete = async () => {
    if (userToDelete === null) return;
    try {
      const res = await fetch(`/api/users/${userToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchUsers();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Gagal menghapus dari server');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUserToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 relative">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-on-background tracking-tight">Manajemen Akun RT</h1>
          <p className="text-lg text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
            Kelola akses dan kredensial ketua RT di lingkungan RW 003.
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold hover:shadow-ambient hover:-translate-y-0.5 transition-all shrink-0"
        >
          <Plus size={20} />
          Tambah Akun RT
        </button>
      </header>
      
      <div className="bg-surface-container-lowest rounded-[2rem] shadow-ambient overflow-hidden border border-outline-variant/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-surface-container border-b border-outline-variant/30 text-on-surface-variant font-semibold text-sm">
              <tr>
                <th className="px-6 py-5 whitespace-nowrap">Nama Lengkap</th>
                <th className="px-6 py-5 whitespace-nowrap">Nomor RT</th>
                <th className="px-6 py-5 whitespace-nowrap">Username</th>
                <th className="px-6 py-5 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-on-surface">{user.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-secondary-container text-on-secondary-container border border-secondary/20">
                      {user.rt_number}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant font-medium">{user.username}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      type="button"
                      onClick={() => confirmDelete(user.id)}
                      className="p-2 text-gray-500 hover:text-red-600 cursor-pointer rounded-full transition-colors inline-flex" 
                      title="Hapus Akun"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-surface-container text-on-surface-variant rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldAlert size={32} />
              </div>
              <p className="text-on-surface-variant text-lg">Belum ada akun RT yang didaftarkan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 shadow-ambient w-full max-w-md relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-surface-container rounded-full text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary-container/30 rounded-pebble flex items-center justify-center text-primary">
                <UserPlus size={24} />
              </div>
              <h2 className="text-2xl font-bold text-on-surface">Tambah Akun RT</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-surface border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface placeholder:text-outline-variant"
                  placeholder="Misal: Bpk. Ahmad"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Nomor RT</label>
                <select 
                  required
                  value={formData.rt_number}
                  onChange={(e) => setFormData({...formData, rt_number: e.target.value})}
                  className="w-full bg-surface border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface appearance-none cursor-pointer"
                >
                  <option value="RT 01">RT 01</option>
                  <option value="RT 02">RT 02</option>
                  <option value="RT 03">RT 03</option>
                  <option value="RT 04">RT 04</option>
                  <option value="RT 05">RT 05</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Username</label>
                <input 
                  type="text" 
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-surface border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface placeholder:text-outline-variant"
                  placeholder="rt01_ahmad"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Password</label>
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-surface border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface placeholder:text-outline-variant"
                  placeholder="********"
                />
              </div>
              <button 
                type="submit"
                className="w-full mt-4 bg-primary text-on-primary font-bold py-4 rounded-full hover:shadow-[0_8px_20px_rgba(74,101,73,0.2)] hover:-translate-y-0.5 transition-all"
              >
                Simpan Akun
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete !== null && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-on-background/20 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-[2rem] p-8 max-w-sm w-full shadow-ambient text-center">
            <h3 className="text-xl font-bold text-on-surface mb-2">Konfirmasi Hapus</h3>
            <p className="text-on-surface-variant mb-6">Apakah Anda yakin ingin menghapus akun RT ini?</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setUserToDelete(null)}
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
