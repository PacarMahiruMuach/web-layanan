import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Wallet, 
  AlertTriangle, 
  TrendingUp, 
  Minus, 
  TrendingDown, 
  Droplets, 
  TreePine, 
  VolumeX, 
  MoreVertical, 
  ArrowRight, 
  FileText,
  RefreshCcw,
  Activity
} from 'lucide-react';

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
  timestamp: string;
};

export default function AdminOverview() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({ totalResidents: 0, monthlyIuran: 0, unresolvedReports: 0 });
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, reportsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/reports?escalated=true')
      ]);
      const statsData = await statsRes.json();
      const reportsData = await reportsRes.json();
      
      setStats(statsData);
      setReports(reportsData);
      
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (reportId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/reports/${reportId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setActiveDropdown(null);
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
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
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-on-background tracking-tight">Ringkasan</h2>
          <p className="text-lg text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
            Pantau statistik warga, metrik keuangan kas, dan aktivitas terkini di seluruh RW 003.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold tracking-wide text-outline">Terakhir diperbarui: {lastUpdated}</span>
          <button 
            onClick={fetchDashboardData}
            className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:bg-surface-container-high transition-colors shadow-sm"
          >
            <RefreshCcw size={20} />
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat Card 1 */}
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-ambient relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-container/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-14 h-14 rounded-pebble bg-primary-container text-on-primary-container flex items-center justify-center">
                  <Building2 size={28} />
                </div>
                <span className="bg-primary-container/30 text-primary text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <TrendingUp size={16} /> +12%
                </span>
              </div>
              <h3 className="text-base text-on-surface-variant mb-1 relative z-10">Total Warga Terdaftar</h3>
              <p className="text-4xl font-bold text-on-surface tracking-tight relative z-10">{stats.totalResidents.toLocaleString('id-ID')}</p>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-ambient relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary-container/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-14 h-14 rounded-pebble bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <Wallet size={28} />
                </div>
                <span className="bg-secondary-container/30 text-secondary text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Minus size={16} /> Stabil
                </span>
              </div>
              <h3 className="text-base text-on-surface-variant mb-1 relative z-10">Total Kas & Iuran Bulanan</h3>
              <p className="text-4xl font-bold text-on-surface tracking-tight relative z-10">Rp {stats.monthlyIuran.toLocaleString('id-ID')}</p>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-ambient relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-error-container/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-14 h-14 rounded-pebble bg-error-container text-on-error-container flex items-center justify-center">
                  <AlertTriangle size={28} />
                </div>
                <span className="bg-error-container/30 text-error text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <TrendingDown size={16} /> Aktif
                </span>
              </div>
              <h3 className="text-base text-on-surface-variant mb-1 relative z-10">Laporan Perlu Tindakan</h3>
              <p className="text-4xl font-bold text-on-surface tracking-tight relative z-10">{stats.unresolvedReports}</p>
            </div>
          </section>

          {/* Laporan Terbaru */}
          <section>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-on-surface tracking-tight">Laporan Diteruskan (Eskalasi)</h3>
              <a href="/admin/dashboard/complaints" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                Lihat Semua <ArrowRight size={18} />
              </a>
            </div>
            
            <div className="space-y-4">
              {reports.length === 0 ? (
                <div className="text-center text-on-surface-variant p-8 bg-surface-container-lowest rounded-[1.5rem]">
                  Tidak ada laporan eskalasi saat ini.
                </div>
              ) : (
                reports.map(report => (
                  <div key={report.id} className="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-sm hover:shadow-ambient flex flex-col md:flex-row md:items-center justify-between gap-6 hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-outline-variant/20">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                        {getIconForCategory(report.kategori)}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-on-surface">{report.judul}</h4>
                        <p className="text-sm text-on-surface-variant mt-1">
                          Dilaporkan oleh {report.nama} (RT {report.no_rt}) • {new Date(report.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 self-start md:self-auto relative">
                      <span className={`${getStatusColor(report.status)} text-xs font-bold px-4 py-2 rounded-full`}>
                        {report.status}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === report.id ? null : report.id);
                        }}
                        className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
                      >
                        <MoreVertical size={20} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {activeDropdown === report.id && (
                        <div className="absolute top-12 right-0 bg-surface-container-lowest shadow-ambient border border-outline-variant/30 rounded-2xl w-56 py-2 z-50">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(report.id, 'Sedang ditindaklanjuti'); }}
                            className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-high transition-colors"
                          >
                            Sedang ditindaklanjuti
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(report.id, 'Selesai'); }}
                            className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-high transition-colors"
                          >
                            Selesai
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
    </div>
  );
}
