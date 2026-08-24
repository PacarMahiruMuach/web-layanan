import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

type Resident = {
  id: number;
  nama_lengkap: string;
  no_rumah: string;
  no_rt: string;
  status_tinggal: string;
  no_telepon: string;
};

export default function ResidentDirectory() {
  const location = useLocation();
  const storedUserStr = localStorage.getItem('user');
  const user = location.state?.user || (storedUserStr ? JSON.parse(storedUserStr) : null);
  const isRtUser = user?.role === 'rt';
  const rtNumber = user?.rt_number || user?.no_rt;
  const [residents, setResidents] = useState<Resident[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedResidentId, setSelectedResidentId] = useState<number | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [residentToDelete, setResidentToDelete] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    no_rumah: '',
    no_rt: isRtUser && rtNumber ? rtNumber.replace(/[^0-9]/g, '').padStart(2, '0') : '01',
    status_tinggal: 'Pemilik',
    no_telepon: ''
  });

  const fetchResidents = async () => {
    try {
      const fetchUrl = isRtUser && rtNumber ? `/api/residents?rt=${rtNumber.replace(/[^0-9]/g, '')}` : '/api/residents';
      const res = await fetch(fetchUrl);
      if (res.ok) {
        const data = await res.json();
        setResidents(data);
      }
    } catch (error) {
      console.error("Failed to fetch residents:", error);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const filteredResidents = residents.filter(resident => 
    resident.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedResidentId(null);
    setFormData({
      nama_lengkap: '',
      no_rumah: '',
      no_rt: '01',
      status_tinggal: 'Pemilik',
      no_telepon: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (resident: Resident) => {
    setIsEditing(true);
    setSelectedResidentId(resident.id);
    setFormData({
      nama_lengkap: resident.nama_lengkap,
      no_rumah: resident.no_rumah,
      no_rt: resident.no_rt,
      status_tinggal: resident.status_tinggal,
      no_telepon: resident.no_telepon || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setResidentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (residentToDelete === null) return;
    
    try {
      const res = await fetch(`/api/residents/${residentToDelete}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setResidentToDelete(null);
        fetchResidents();
      }
    } catch (error) {
      console.error("Failed to delete resident:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing ? `/api/residents/${selectedResidentId}` : '/api/residents';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchResidents();
      }
    } catch (error) {
      console.error("Failed to save resident:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 relative">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-on-background tracking-tight">Buku Induk Warga</h1>
          <p className="text-lg text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
            Daftar lengkap warga dan pengelolaan data penduduk lingkungan RW 003.
          </p>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
          <input
            type="text"
            placeholder="Cari berdasarkan nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface placeholder:text-on-surface-variant/60 shadow-sm"
          />
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold hover:shadow-ambient hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} />
          Tambah Warga Baru
        </button>
      </div>
      
      {/* Table Container */}
      <div className="bg-surface-container-lowest rounded-[2rem] shadow-ambient overflow-hidden border border-outline-variant/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-surface-container border-b border-outline-variant/30 text-on-surface-variant font-semibold text-sm">
              <tr>
                <th className="px-6 py-5 whitespace-nowrap">Nama Lengkap</th>
                <th className="px-6 py-5 whitespace-nowrap">No. Rumah</th>
                <th className="px-6 py-5 whitespace-nowrap">RT</th>
                <th className="px-6 py-5 whitespace-nowrap">Status Tinggal</th>
                <th className="px-6 py-5 whitespace-nowrap">No. Telepon</th>
                <th className="px-6 py-5 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredResidents.map((resident) => (
                <tr key={resident.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-on-surface">{resident.nama_lengkap}</td>
                  <td className="px-6 py-4 text-on-surface-variant font-medium">{resident.no_rumah}</td>
                  <td className="px-6 py-4 text-on-surface-variant font-medium">{resident.no_rt}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      resident.status_tinggal.toLowerCase() === 'pemilik' 
                        ? 'bg-primary-container text-on-primary-container' 
                        : 'bg-secondary-container text-on-secondary-container'
                    }`}>
                      {resident.status_tinggal}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">{resident.no_telepon}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleOpenEditModal(resident)}
                        className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary-container/50 rounded-full transition-colors" 
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(resident.id)}
                        className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/50 rounded-full transition-colors" 
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredResidents.length === 0 && (
            <div className="text-center py-16 px-4">
              <p className="text-on-surface-variant text-lg">Tidak ada data warga yang sesuai dengan pencarian Anda.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface rounded-3xl w-full max-w-lg p-6 md:p-8 relative shadow-ambient animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-surface-container rounded-full text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-on-surface mb-6">
              {isEditing ? 'Edit Data Warga' : 'Tambah Warga Baru'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="nama_lengkap"
                  required
                  value={formData.nama_lengkap}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">No. Rumah</label>
                  <input 
                    type="text" 
                    name="no_rumah"
                    required
                    value={formData.no_rumah}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">RT</label>
                  <input 
                    type="text" 
                    name="no_rt"
                    required
                    value={formData.no_rt}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Status Tinggal</label>
                <select 
                  name="status_tinggal"
                  value={formData.status_tinggal}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                >
                  <option value="Pemilik">Pemilik</option>
                  <option value="Penyewa">Penyewa</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">No. Telepon</label>
                <input 
                  type="tel" 
                  name="no_telepon"
                  required
                  value={formData.no_telepon}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              
              <div className="mt-8 pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-surface-container-high text-on-surface rounded-full font-bold hover:bg-outline-variant/20 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-on-primary rounded-full font-bold hover:shadow-ambient hover:-translate-y-0.5 transition-all"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface rounded-3xl w-full max-w-sm p-6 md:p-8 relative shadow-ambient animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-2">Hapus Data Warga?</h2>
            <p className="text-on-surface-variant mb-8">
              Apakah Anda yakin ingin menghapus data warga ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-6 py-3 bg-surface-container-high text-on-surface rounded-full font-bold hover:bg-outline-variant/20 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-6 py-3 bg-error text-on-error rounded-full font-bold hover:shadow-ambient hover:-translate-y-0.5 transition-all"
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
