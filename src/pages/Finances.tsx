import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, X, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

type Transaction = {
  id: number;
  type: string;
  amount: number;
  description: string;
  receipt: string | null;
  created_at: string;
};

export default function Finances() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    type: 'Pemasukan',
    description: '',
    amount: ''
  });
  const [file, setFile] = useState<File | null>(null);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions');
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Summary Calculations
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const totalSaldo = transactions.reduce((acc, curr) => {
    return curr.type === 'Pemasukan' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const pemasukanBulanIni = transactions.reduce((acc, curr) => {
    const date = new Date(curr.created_at);
    if (curr.type === 'Pemasukan' && date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
      return acc + curr.amount;
    }
    return acc;
  }, 0);

  const pengeluaranBulanIni = transactions.reduce((acc, curr) => {
    const date = new Date(curr.created_at);
    if (curr.type === 'Pengeluaran' && date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
      return acc + curr.amount;
    }
    return acc;
  }, 0);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handlers
  const handleOpenAddModal = () => {
    setFormData({ type: 'Pemasukan', description: '', amount: '' });
    setFile(null);
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('type', formData.type);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('amount', formData.amount);
    
    if (file) {
      formDataToSend.append('receipt', file);
    }

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        body: formDataToSend, // Do not set Content-Type header, let browser set it with boundary
      });
      
      if (res.ok) {
        setIsAddModalOpen(false);
        fetchTransactions();
      }
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  };

  const openPreview = (url: string) => {
    setPreviewUrl(url);
    setIsPreviewModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setTransactionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (transactionToDelete === null) return;
    
    try {
      const res = await fetch(`/api/transactions/${transactionToDelete}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setTransactionToDelete(null);
        fetchTransactions();
      }
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 relative">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-on-background tracking-tight">Keuangan Warga</h1>
          <p className="text-lg text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
            Pengelolaan arus kas, iuran, dan laporan keuangan RW 003.
          </p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold hover:shadow-ambient hover:-translate-y-0.5 transition-all shrink-0"
        >
          <Plus size={20} />
          Catat Arus Kas
        </button>
      </header>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-ambient relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-container/20 rounded-full blur-2xl"></div>
          <div className="w-14 h-14 rounded-pebble bg-primary-container text-on-primary-container flex items-center justify-center mb-6 relative z-10">
            <Wallet size={28} />
          </div>
          <h3 className="text-base text-on-surface-variant mb-1 relative z-10">Total Saldo</h3>
          <p className="text-4xl font-bold text-on-surface tracking-tight relative z-10">{formatRupiah(totalSaldo)}</p>
        </div>

        <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-ambient relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-500/10 rounded-full blur-2xl"></div>
          <div className="w-14 h-14 rounded-pebble bg-green-100 text-green-700 flex items-center justify-center mb-6 relative z-10">
            <TrendingUp size={28} />
          </div>
          <h3 className="text-base text-on-surface-variant mb-1 relative z-10">Pemasukan Bulan Ini</h3>
          <p className="text-4xl font-bold text-on-surface tracking-tight relative z-10">{formatRupiah(pemasukanBulanIni)}</p>
        </div>

        <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-ambient relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-error-container/20 rounded-full blur-2xl"></div>
          <div className="w-14 h-14 rounded-pebble bg-error-container text-on-error-container flex items-center justify-center mb-6 relative z-10">
            <TrendingDown size={28} />
          </div>
          <h3 className="text-base text-on-surface-variant mb-1 relative z-10">Pengeluaran Bulan Ini</h3>
          <p className="text-4xl font-bold text-on-surface tracking-tight relative z-10">{formatRupiah(pengeluaranBulanIni)}</p>
        </div>
      </section>

      {/* Table Container */}
      <div className="bg-surface-container-lowest rounded-[2rem] shadow-ambient overflow-hidden border border-outline-variant/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-surface-container border-b border-outline-variant/30 text-on-surface-variant font-semibold text-sm">
              <tr>
                <th className="px-6 py-5 whitespace-nowrap">Tanggal</th>
                <th className="px-6 py-5 whitespace-nowrap">Keterangan</th>
                <th className="px-6 py-5 whitespace-nowrap">Jenis</th>
                <th className="px-6 py-5 whitespace-nowrap">Nominal</th>
                <th className="px-6 py-5 whitespace-nowrap text-center">Bukti</th>
                <th className="px-6 py-5 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-6 py-4 text-on-surface-variant">{formatDate(transaction.created_at)}</td>
                  <td className="px-6 py-4 font-bold text-on-surface">{transaction.description}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      transaction.type === 'Pemasukan' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-error-container text-on-error-container'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-on-surface">{formatRupiah(transaction.amount)}</td>
                  <td className="px-6 py-4 text-center">
                    {transaction.receipt ? (
                      <button 
                        onClick={() => openPreview(transaction.receipt!)}
                        className="inline-flex p-2 text-primary bg-primary-container/30 hover:bg-primary-container/80 rounded-full transition-colors"
                        title="Lihat Kuitansi"
                      >
                        <ImageIcon size={18} />
                      </button>
                    ) : (
                      <span className="text-on-surface-variant/50 text-sm italic">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleDeleteClick(transaction.id)}
                      className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/50 rounded-full transition-colors inline-flex" 
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {transactions.length === 0 && (
            <div className="text-center py-16 px-4">
              <p className="text-on-surface-variant text-lg">Belum ada riwayat transaksi keuangan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface rounded-3xl w-full max-w-lg p-6 md:p-8 relative shadow-ambient animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-surface-container rounded-full text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-on-surface mb-6">Catat Arus Kas</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Jenis Transaksi</label>
                <select 
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                >
                  <option value="Pemasukan">Pemasukan</option>
                  <option value="Pengeluaran">Pengeluaran</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Nominal (Rp)</label>
                <input 
                  type="number" 
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="Contoh: 150000"
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Keterangan</label>
                <input 
                  type="text" 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Contoh: Iuran Bulanan Blok A"
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Bukti Kuitansi (Opsional)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFile(e.target.files[0]);
                    }
                  }}
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-primary hover:file:bg-primary-container/80"
                />
              </div>
              
              <div className="mt-8 pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-surface-container-high text-on-surface rounded-full font-bold hover:bg-outline-variant/20 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-on-primary rounded-full font-bold hover:shadow-ambient hover:-translate-y-0.5 transition-all"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {isPreviewModalOpen && previewUrl && (
        <div className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4 backdrop-blur-md">
          <button 
            onClick={() => setIsPreviewModalOpen(false)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>
          <img 
            src={previewUrl} 
            alt="Preview Kuitansi" 
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface rounded-3xl w-full max-w-sm p-6 md:p-8 relative shadow-ambient animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-2">Hapus Transaksi?</h2>
            <p className="text-on-surface-variant mb-8">
              Apakah Anda yakin ingin menghapus catatan transaksi ini? Tindakan ini tidak dapat dibatalkan.
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
