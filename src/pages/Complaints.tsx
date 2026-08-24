import React, { useState, useEffect } from 'react';
import { Eye, X, MessageSquareWarning, MapPin, Phone, Calendar, Tag } from 'lucide-react';

type Report = {
  id: number;
  nama: string;
  no_rt: string;
  no_wa: string;
  judul: string;
  deskripsi: string;
  alamat: string;
  urgensi: string;
  kategori: string;
  status: string;
  is_escalated_to_rw: boolean;
  bukti: string | null;
  created_at: string;
};

export default function Complaints() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    // Optimistic update
    setReports(prev => prev.map(report => 
      report.id === id ? { ...report, status: newStatus } : report
    ));

    try {
      const res = await fetch(`/api/reports/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!res.ok) {
        // Revert on failure
        fetchReports();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      fetchReports();
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Menunggu': return 'bg-error-container text-on-error-container border-error/20'; // Merah
      case 'Diproses': return 'bg-amber-100 text-amber-700 border-amber-300/50'; // Kuning
      case 'Selesai': return 'bg-green-100 text-green-700 border-green-300/50'; // Hijau
      default: return 'bg-surface-container text-on-surface-variant border-outline-variant/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 relative">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-on-background tracking-tight">Pusat Laporan Warga</h1>
          <p className="text-lg text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
            Kelola dan pantau seluruh pengaduan dan aspirasi warga di lingkungan RW 003.
          </p>
        </div>
      </header>
      
      {/* Table Container */}
      <div className="bg-surface-container-lowest rounded-[2rem] shadow-ambient overflow-hidden border border-outline-variant/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-surface-container border-b border-outline-variant/30 text-on-surface-variant font-semibold text-sm">
              <tr>
                <th className="px-6 py-5 whitespace-nowrap">Tanggal</th>
                <th className="px-6 py-5 whitespace-nowrap">Pelapor</th>
                <th className="px-6 py-5">Judul Laporan</th>
                <th className="px-6 py-5 whitespace-nowrap">Status</th>
                <th className="px-6 py-5 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-6 py-4 text-on-surface-variant whitespace-nowrap text-sm">
                    {formatDate(report.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-bold text-on-surface">{report.nama}</p>
                    <p className="text-xs text-on-surface-variant">RT {report.no_rt}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-on-surface">{report.judul}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-on-surface-variant font-medium bg-surface-container px-2 py-0.5 rounded">
                        {report.kategori}
                      </span>
                      {report.urgensi === 'Tinggi' && (
                        <span className="text-xs text-error font-medium bg-error-container/50 px-2 py-0.5 rounded">
                          Urgensi Tinggi
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={report.status}
                      onChange={(e) => handleStatusChange(report.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border focus:outline-none cursor-pointer transition-colors ${getStatusColor(report.status)}`}
                    >
                      <option value="Menunggu">Menunggu</option>
                      <option value="Diproses">Diproses</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <button 
                      onClick={() => setSelectedReport(report)}
                      className="p-2 text-primary hover:text-primary hover:bg-primary-container/50 rounded-full transition-colors inline-flex" 
                      title="Lihat Detail"
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {reports.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-surface-container text-on-surface-variant rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquareWarning size={32} />
              </div>
              <p className="text-on-surface-variant text-lg">Belum ada laporan pengaduan masuk.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col relative shadow-ambient animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/30 shrink-0">
              <h2 className="text-2xl font-bold text-on-surface">Detail Laporan</h2>
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-2 bg-surface-container rounded-full text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6">
              {selectedReport.bukti && (
                <div className="w-full bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 flex justify-center items-center">
                  <img 
                    src={selectedReport.bukti} 
                    alt="Bukti Laporan" 
                    className="max-h-64 object-contain"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-on-surface mb-2">{selectedReport.judul}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedReport.status)}`}>
                      Status: {selectedReport.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface-container text-on-surface-variant flex items-center gap-1.5">
                      <Tag size={12} /> {selectedReport.kategori}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface-container text-on-surface-variant flex items-center gap-1.5">
                      <Calendar size={12} /> {formatDate(selectedReport.created_at)}
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 text-on-surface leading-relaxed whitespace-pre-wrap">
                  {selectedReport.deskripsi}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
                    <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <MapPin size={14} /> Lokasi Detail
                    </p>
                    <p className="text-on-surface font-medium">{selectedReport.alamat}</p>
                  </div>
                  
                  <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
                    <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Phone size={14} /> Informasi Pelapor
                    </p>
                    <p className="text-on-surface font-medium">{selectedReport.nama} (RT {selectedReport.no_rt})</p>
                    <p className="text-on-surface-variant text-sm mt-1">{selectedReport.no_wa}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-outline-variant/30 shrink-0">
              <button 
                onClick={() => setSelectedReport(null)}
                className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-bold hover:shadow-ambient hover:-translate-y-0.5 transition-all"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

