import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Handshake, CheckCircle2, X, Package } from 'lucide-react';

type Asset = {
  id: number;
  name: string;
  quantity: number;
  condition: string;
  is_borrowed: boolean;
  borrower_name: string | null;
  created_at: string;
};

export default function Infrastructure() {
  const [assets, setAssets] = useState<Asset[]>([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<number | null>(null);

  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [assetToBorrow, setAssetToBorrow] = useState<number | null>(null);
  const [borrowerName, setBorrowerName] = useState('');

  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const [assetToUpdateCondition, setAssetToUpdateCondition] = useState<number | null>(null);
  const [newCondition, setNewCondition] = useState('Baik');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    condition: 'Baik'
  });

  const fetchAssets = async () => {
    try {
      const res = await fetch('/api/assets');
      if (res.ok) {
        const data = await res.json();
        setAssets(data);
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        fetchAssets();
      }
    } catch (error) {
      console.error('Failed to add asset:', error);
    }
  };

  const confirmDelete = async () => {
    if (assetToDelete === null) return;
    try {
      const res = await fetch(`/api/assets/${assetToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setAssetToDelete(null);
        fetchAssets();
      }
    } catch (error) {
      console.error('Failed to delete asset:', error);
    }
  };

  const handleBorrowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (assetToBorrow === null || !borrowerName.trim()) return;
    try {
      const res = await fetch(`/api/assets/${assetToBorrow}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_borrowed: true, borrower_name: borrowerName })
      });
      if (res.ok) {
        setIsBorrowModalOpen(false);
        setAssetToBorrow(null);
        setBorrowerName('');
        fetchAssets();
      }
    } catch (error) {
      console.error('Failed to borrow asset:', error);
    }
  };

  const handleReturn = async (id: number) => {
    try {
      const res = await fetch(`/api/assets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_borrowed: false, borrower_name: null })
      });
      if (res.ok) {
        fetchAssets();
      }
    } catch (error) {
      console.error('Failed to return asset:', error);
    }
  };

  const handleConditionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (assetToUpdateCondition === null) return;
    try {
      const res = await fetch(`/api/assets/${assetToUpdateCondition}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ condition: newCondition })
      });
      if (res.ok) {
        setIsConditionModalOpen(false);
        setAssetToUpdateCondition(null);
        fetchAssets();
      }
    } catch (error) {
      console.error('Failed to update condition:', error);
    }
  };

  const getConditionStyles = (condition: string) => {
    switch(condition) {
      case 'Baik':
        return 'bg-green-100 text-green-700';
      case 'Rusak':
        return 'bg-error-container text-on-error-container';
      case 'Sedang Diperbaiki':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-surface-container text-on-surface-variant';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 relative">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-on-background tracking-tight">Inventaris Warga</h1>
          <p className="text-lg text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
            Pengelolaan aset, fasilitas, dan buku peminjaman RW 003.
          </p>
        </div>
        <button 
          onClick={() => {
            setFormData({ name: '', quantity: '', condition: 'Baik' });
            setIsAddModalOpen(true);
          }}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold hover:shadow-ambient hover:-translate-y-0.5 transition-all shrink-0"
        >
          <Plus size={20} />
          Tambah Inventaris
        </button>
      </header>
      
      {assets.length === 0 ? (
        <section className="bg-surface-container-lowest rounded-[2rem] p-16 text-center border border-outline-variant/30">
          <div className="w-20 h-20 bg-surface-container text-on-surface-variant rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={40} />
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-2">Belum ada inventaris</h2>
          <p className="text-on-surface-variant max-w-md mx-auto">
            Klik tombol "Tambah Inventaris" di atas untuk mulai mencatat barang dan fasilitas warga.
          </p>
        </section>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {assets.map((asset) => (
            <div key={asset.id} className="bg-surface-container-lowest rounded-[2rem] shadow-sm hover:shadow-ambient transition-all border border-outline-variant/30 flex flex-col overflow-hidden">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getConditionStyles(asset.condition)}`}>
                      {asset.condition}
                    </span>
                    <button 
                      onClick={() => {
                        setAssetToUpdateCondition(asset.id);
                        setNewCondition(asset.condition);
                        setIsConditionModalOpen(true);
                      }}
                      className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary-container/30 rounded-full transition-colors"
                      title="Ubah Kondisi"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                      setAssetToDelete(asset.id);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-full transition-colors -mr-2 -mt-2"
                    title="Hapus"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <h3 className="text-2xl font-bold text-on-surface mb-1 tracking-tight leading-tight">{asset.name}</h3>
                <p className="text-on-surface-variant font-medium mb-6">Jumlah: {asset.quantity} unit</p>
              </div>
              
              {/* Borrowing Section */}
              {asset.is_borrowed ? (
                <div className="bg-secondary-container/50 border-t border-secondary-container p-5">
                  <p className="text-sm text-on-surface-variant mb-1">Sedang dipinjam oleh:</p>
                  <p className="font-bold text-on-surface mb-4 truncate">{asset.borrower_name}</p>
                  <button 
                    onClick={() => handleReturn(asset.id)}
                    className="w-full py-2.5 flex items-center justify-center gap-2 bg-secondary text-on-secondary rounded-xl font-bold hover:bg-secondary/90 transition-colors"
                  >
                    <CheckCircle2 size={18} />
                    Selesai Dipinjam
                  </button>
                </div>
              ) : (
                <div className="bg-surface-container/30 border-t border-outline-variant/20 p-5">
                  <p className="text-sm text-on-surface-variant mb-1 opacity-0 hidden md:block">Status</p>
                  <p className="font-bold text-green-600 mb-4 truncate">Tersedia</p>
                  <button 
                    onClick={() => {
                      setAssetToBorrow(asset.id);
                      setIsBorrowModalOpen(true);
                    }}
                    className="w-full py-2.5 flex items-center justify-center gap-2 bg-surface-container-high text-on-surface rounded-xl font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors"
                  >
                    <Handshake size={18} />
                    Pinjamkan
                  </button>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface rounded-3xl w-full max-w-lg p-6 md:p-8 relative shadow-ambient animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-surface-container rounded-full text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-on-surface mb-6">Tambah Inventaris Baru</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Nama Barang / Aset</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Jumlah</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Kondisi</label>
                <select 
                  required
                  value={formData.condition}
                  onChange={(e) => setFormData({...formData, condition: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                >
                  <option value="Baik">Baik</option>
                  <option value="Sedang Diperbaiki">Sedang Diperbaiki</option>
                  <option value="Rusak">Rusak</option>
                </select>
              </div>
              <div className="mt-8 pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-6 py-3 bg-surface-container-high text-on-surface rounded-full font-bold hover:bg-outline-variant/20 transition-colors">Batal</button>
                <button type="submit" className="flex-1 px-6 py-3 bg-primary text-on-primary rounded-full font-bold hover:shadow-ambient hover:-translate-y-0.5 transition-all">Simpan Aset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Borrow Modal */}
      {isBorrowModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface rounded-3xl w-full max-w-sm p-6 md:p-8 relative shadow-ambient animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setIsBorrowModalOpen(false)} className="absolute top-4 right-4 p-2 bg-surface-container rounded-full text-on-surface-variant hover:text-error transition-colors">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-on-surface mb-2">Pinjamkan Aset</h2>
            <p className="text-on-surface-variant mb-6 text-sm">Catat siapa warga yang meminjam fasilitas ini.</p>
            <form onSubmit={handleBorrowSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Nama Peminjam</label>
                <input 
                  type="text" 
                  required
                  autoFocus
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  placeholder="Contoh: Pak Budi RT 01"
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              <button type="submit" className="w-full px-6 py-3 bg-primary text-on-primary rounded-full font-bold hover:shadow-ambient hover:-translate-y-0.5 transition-all">Pinjamkan Sekarang</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Condition Modal */}
      {isConditionModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface rounded-3xl w-full max-w-sm p-6 md:p-8 relative shadow-ambient animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setIsConditionModalOpen(false)} className="absolute top-4 right-4 p-2 bg-surface-container rounded-full text-on-surface-variant hover:text-error transition-colors">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-on-surface mb-6">Ubah Kondisi Aset</h2>
            <form onSubmit={handleConditionSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Pilih Kondisi Baru</label>
                <select 
                  required
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                >
                  <option value="Baik">Baik</option>
                  <option value="Sedang Diperbaiki">Sedang Diperbaiki</option>
                  <option value="Rusak">Rusak</option>
                </select>
              </div>
              <button type="submit" className="w-full px-6 py-3 bg-primary text-on-primary rounded-full font-bold hover:shadow-ambient hover:-translate-y-0.5 transition-all">Simpan Perubahan</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface rounded-3xl w-full max-w-sm p-6 md:p-8 relative shadow-ambient animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-2">Hapus Inventaris?</h2>
            <p className="text-on-surface-variant mb-8">
              Apakah Anda yakin ingin menghapus barang ini dari daftar inventaris?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-6 py-3 bg-surface-container-high text-on-surface rounded-full font-bold hover:bg-outline-variant/20 transition-colors">Batal</button>
              <button onClick={confirmDelete} className="flex-1 px-6 py-3 bg-error text-on-error rounded-full font-bold hover:shadow-ambient hover:-translate-y-0.5 transition-all">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

