import React, { useState } from 'react';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  const [formData, setFormData] = useState({
    namaLingkungan: 'RW 003 Kampung Utan',
    namaKetuaRw: '',
    kelurahan: '',
    kecamatan: '',
    kota: '',
    kodePos: '',
    noDarurat: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Pengaturan berhasil disimpan!');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 animate-in fade-in zoom-in-95 duration-200">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-on-background tracking-tight">Pengaturan</h2>
          <p className="text-lg text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
            Kelola konfigurasi sistem dan informasi master.
          </p>
        </div>
      </header>

      <div className="bg-surface-container-lowest rounded-[2rem] shadow-ambient p-8 md:p-10">
        <div className="mb-8 border-b border-outline-variant/30 pb-6">
          <h3 className="text-2xl font-bold text-on-surface">Pengaturan Profil RW</h3>
          <p className="text-on-surface-variant mt-2">Kelola informasi dasar lingkungan RW 003.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">Nama Lingkungan</label>
              <input
                type="text"
                name="namaLingkungan"
                value={formData.namaLingkungan}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
                placeholder="Contoh: RW 003 Kampung Utan"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">Nama Ketua RW Saat Ini</label>
              <input
                type="text"
                name="namaKetuaRw"
                value={formData.namaKetuaRw}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
                placeholder="Nama lengkap ketua RW"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">Kelurahan</label>
              <input
                type="text"
                name="kelurahan"
                value={formData.kelurahan}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">Kecamatan</label>
              <input
                type="text"
                name="kecamatan"
                value={formData.kecamatan}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">Kota/Kabupaten</label>
              <input
                type="text"
                name="kota"
                value={formData.kota}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">Kode Pos</label>
              <input
                type="text"
                name="kodePos"
                value={formData.kodePos}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-on-surface">Nomor Telepon/WhatsApp Darurat RW</label>
              <input
                type="text"
                name="noDarurat"
                value={formData.noDarurat}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface"
                placeholder="Contoh: 081234567890"
              />
            </div>
          </div>
          
          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              className="bg-primary text-on-primary font-semibold py-3.5 px-8 rounded-full hover:shadow-[0_8px_20px_rgba(72,109,109,0.2)] hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Save size={20} />
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
