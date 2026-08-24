import React, { useState, useEffect } from 'react';
import { RefreshCcw, Send, MoreVertical, Droplets, TreePine, VolumeX, Flame } from 'lucide-react';

interface Report {
  id: number;
  nama: string;
  no_rt: string;
  judul: string;
  deskripsi: string;
  status: string;
  kategori: string;
  timestamp: string;
  bukti?: string;
}

import { useOutletContext } from 'react-router-dom';

export default function DashboardRTOverview() {
  const { rtNumber, reports = [], fetchReports, changeStatus, escalateReport, getIconForCategory } = useOutletContext<any>() || {};
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
    <main className="flex-1 h-full overflow-y-auto bg-background w-full">
          <div className="max-w-7xl mx-auto space-y-12 pb-24">
            {/* Page Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-on-background tracking-tight">Overview RT {rtNumber}</h2>
                <p className="text-lg text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
                  Pantau laporan warga, aktivitas, dan informasi terkini di wilayah RT {rtNumber}.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold tracking-wide text-outline">Pembaruan terakhir: Baru saja</span>
                <button onClick={fetchReports} className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:bg-surface-container-high transition-colors shadow-sm">
                  <RefreshCcw size={20} />
                </button>
              </div>
            </header>

            {/* Laporan Warga Masuk */}
            <section>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-on-surface tracking-tight">Laporan Warga Masuk</h3>
              </div>
              
              <div className="space-y-4">
                {reports.length === 0 ? (
                  <div className="text-center text-on-surface-variant p-8 bg-surface-container-lowest rounded-[1.5rem]">
                    Belum ada laporan warga masuk.
                  </div>
                ) : (
                  reports.map(report => (
                    <div key={report.id} className="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-sm hover:shadow-ambient flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 border border-transparent hover:border-outline-variant/20">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                          {getIconForCategory(report.kategori)}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-on-surface">{report.judul}</h4>
                          <p className="text-sm text-on-surface-variant mt-1">
                            Oleh: {report.nama} • {new Date(report.timestamp).toLocaleString()}
                          </p>
                          <p className="text-sm text-on-surface-variant mt-1 italic">
                            "{report.deskripsi}"
                          </p>
                          {report.bukti && (
                            <img 
                              src={report.bukti} 
                              alt="Bukti Laporan" 
                              className="w-20 h-20 object-cover rounded-xl mt-3 border border-outline-variant cursor-pointer hover:opacity-80 transition-opacity" 
                              onClick={() => setSelectedImage(report.bukti)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row items-center gap-4 self-start md:self-auto w-full md:w-auto">
                        <select 
                          value={report.status}
                          onChange={(e) => changeStatus(report.id, e.target.value, e)}
                          className={`appearance-none text-xs font-medium px-3 py-1.5 rounded-full outline-none cursor-pointer transition-colors border-0 ring-1 ring-inset ${report.status === 'Selesai' ? 'bg-green-100 text-green-800 ring-green-600/20' : report.status === 'Sedang ditindaklanjuti' ? 'bg-blue-100 text-blue-800 ring-blue-600/20' : 'bg-red-100 text-red-800 ring-red-600/20'}`}
                        >
                          <option value="Belum diproses">Belum diproses</option>
                          <option value="Sedang ditindaklanjuti">Sedang ditindaklanjuti</option>
                          <option value="Selesai">Selesai</option>
                        </select>
                        <button 
                          onClick={(e) => escalateReport(report.id, e)}
                          className="w-full md:w-auto px-4 py-2 flex items-center justify-center gap-2 text-xs font-bold bg-surface-container hover:bg-surface-container-high text-on-surface rounded-full transition-colors"
                        >
                          <Send size={14} /> Teruskan ke RW
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
            
          </div>
        </main>
    
      {/* Modal Image Viewer */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-background/80 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <img src={selectedImage} alt="Bukti Laporan (Zoom)" className="max-w-full max-h-[90vh] object-contain rounded-2xl" />
            <button className="absolute -top-4 -right-4 w-10 h-10 bg-surface text-on-surface rounded-full flex items-center justify-center shadow-ambient hover:bg-error-container hover:text-error transition-colors" onClick={() => setSelectedImage(null)}>
              X
            </button>
          </div>
        </div>
      )}
  </>
  );
}
