import React, { useState, useEffect } from 'react';
import { Leaf, ArrowDown, ArrowRight, Users, Flower2, BookOpen, Trophy, Clock, MapPin, X, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  type: string;
  event_date?: string;
  location?: string;
  image: string | null;
  author: string;
  created_at: string;
}

export default function Kalender() {
  const [activities, setActivities] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Post | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/posts?type=activity');
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format date for the calendar badge
  const getMonthStr = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { month: 'short', timeZone: 'Asia/Jakarta' });
  };
  const getDayStr = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', timeZone: 'Asia/Jakarta' });
  };
  const getFullTimeStr = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });
  };

  return (
    <main className="flex-grow pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative">
        
        {/* Header Section */}
        <section className="mb-12">
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Semua Kalender Kegiatan
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                        Daftar lengkap seluruh agenda dan kegiatan komunitas warga RW 003.
                    </p>
                </div>
            </div>
        </section>
        {/* Upcoming Events */}
        <section id="upcoming-events" className="bg-surface-container-low py-16 md:py-24 px-6 md:px-12 rounded-[3rem] mb-24 ambient-shadow w-full">
            <div>
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Daftar Kegiatan</h2>
                        
                    </div>
                    
                </div>
                
                <div className="space-y-4">
                    {loading ? (
                       <div className="flex justify-center py-10">
                         <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                       </div>
                    ) : activities.length === 0 ? (
                       <div className="text-center py-10 text-on-surface-variant font-body-md">
                         Belum ada jadwal kegiatan terbaru.
                       </div>
                    ) : (
                        activities.map((activity, index) => {
                            // Cycle through background colors for the date badge based on index
                            const badgeColors = [
                                "bg-primary-container text-on-primary-container",
                                "bg-secondary-container text-on-secondary-container",
                                "bg-tertiary-container text-on-tertiary-container"
                            ];
                            const badgeColorClass = badgeColors[index % badgeColors.length];

                            return (
                                <div key={activity.id} className="bg-surface rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 ambient-shadow hover:bg-surface-bright transition-colors border border-surface-variant">
                                    <div className={`${badgeColorClass} rounded-lg p-4 text-center min-w-[80px]`}>
                                        <div className="font-label-sm text-label-sm uppercase">{getMonthStr(activity.event_date || activity.created_at)}</div>
                                        <div className="font-headline-md text-headline-md">{getDayStr(activity.event_date || activity.created_at)}</div>
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{activity.title}</h3>
                                        <div className="flex items-center gap-4 text-on-surface-variant font-label-sm text-label-sm">
                                            <span className="flex items-center gap-1"><Clock className="w-4 h-4 mr-1" /> {activity.event_date ? getFullTimeStr(activity.event_date) : getFullTimeStr(activity.created_at)} - Selesai</span>
                                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4 mr-1" /> {activity.location || "Area Lingkungan RW 003"}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <button onClick={() => setSelectedEvent(activity)} className="px-6 py-2 border-2 border-outline-variant text-on-surface font-label-md text-label-md rounded-full hover:border-primary hover:text-primary transition-colors">Detail</button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>

        {/* Activity Categories Grid */}
        <section className="mb-24">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Community Groups</h2>
                <p className="text-lg text-gray-600 leading-relaxed text-center max-w-2xl mx-auto">Temukan wadah untuk berpartisipasi dan berkontribusi sesuai minat dan usia. Kami memiliki berbagai kelompok aktif yang rutin berkegiatan.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Card 1 */}
                <div className="bg-surface rounded-2xl p-8 ambient-shadow ambient-shadow-hover flex flex-col items-center text-center border border-surface-variant pebble-shape">
                    <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-6">
                        <Users className="w-8 h-8 text-green-700" />
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Karang Taruna</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant flex-grow">Wadah kreasi dan inovasi pemuda-pemudi lingkungan.</p>
                </div>
                {/* Card 2 */}
                <div className="bg-surface rounded-2xl p-8 ambient-shadow ambient-shadow-hover flex flex-col items-center text-center border border-surface-variant pebble-shape-alt">
                    <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-6">
                        <Flower2 className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-3">PKK</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant flex-grow">Pemberdayaan kesejahteraan keluarga dan keterampilan.</p>
                </div>
                {/* Card 3 */}
                <div className="bg-surface rounded-2xl p-8 ambient-shadow ambient-shadow-hover flex flex-col items-center text-center border border-surface-variant pebble-shape">
                    <div className="w-16 h-16 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-6">
                        <BookOpen className="w-8 h-8 text-teal-600" />
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Majelis Taklim</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant flex-grow">Kegiatan kerohanian dan pengajian rutin warga.</p>
                </div>
                {/* Card 4 */}
                <div className="bg-surface rounded-2xl p-8 ambient-shadow ambient-shadow-hover flex flex-col items-center text-center border border-surface-variant pebble-shape-alt">
                    <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center mb-6">
                        <Trophy className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Klub Olahraga</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant flex-grow">Fasilitasi minat bakat olahraga untuk kesehatan jasmani.</p>
                </div>
            </div>
        </section>

        {/* Gallery Section */}
        <section className="mb-12">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8">Momen Berharga</h2>
            {/* Bento Grid Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
                {/* Large Feature */}
                <div className="col-span-2 row-span-2 rounded-[2rem] overflow-hidden relative group ambient-shadow">
                    <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Community Garden Work" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAksG62XDe7oiVuxa7dCQ8SC6fcgVwfSNv4llONj1LxkovkClJ7DUDA46oARKaAyqORfwrADCjah1UYjgV99vAuqDqCJQxlOtNo33H8pnGfhOEHOAyZdkEdcuY72mvK7rQGfJ0fivoD2i-uFf9gIvLDpcb8I7wOe9NLsiYtaVHnAvJgAhG3uuMT8rOoGJN1tbhgOuOmmODoHV24MqU3p15jpR1fVZ8Rc-hDR_PSh1o2dnW7ci6jXKBn"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 to-transparent flex items-end p-6">
                        <span className="text-on-primary font-label-md text-label-md">Kerja Bakti Taman Warga</span>
                    </div>
                </div>
                {/* Small 1 */}
                <div className="rounded-[1.5rem] overflow-hidden relative group ambient-shadow">
                    <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Fresh Vegetables" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCThVYlctO1lMu-HQMIVDSK1XntPYDPBPfTFIm13bI5evD_gJtLf884YTNxFFE4z9FkwNTH_301Kg7CHxUJlygrU-JUJ90LQJr-wFWCcf8nrrS4MDK4m5tLDUgwpNpBNTQSEcNyNHOul1pmHMc7a2Hg0aOUjJKk-5xqt2bNWV-YDqca9dBW7au2sX80pAPID0Zhr873RthBNIIl0HFWt-yfzSkDKffc7z5yUsskeLBDcdILhZVpJ6sl"/>
                </div>
                {/* Small 2 */}
                <div className="rounded-[1.5rem] overflow-hidden relative group ambient-shadow">
                    <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Morning Exercise" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCZYTrbWbkftrs5QiupHIH4Iv8XHCzuQArMYuLKgHjqRcBAbmSOYo_RubCPa6a6qnYpBeto6gdQV9xIzUcuv8j3Dwiv-gdklNdjS4ZUwPmYc-igv4_r3mxr7uLRQ-V9SQOno5vdEAu3c1f8vDdc2Aw4A11fDqqATh9w6VJ90ak_Mu-TQbM6hS0cfq74HxB0t90IffrGQkXqJhGIxDl7SqFqe18d_63GJdk2_FtuOqrrjDiyr6kBKzk"/>
                </div>
                {/* Wide */}
                <div className="col-span-2 rounded-[1.5rem] overflow-hidden relative group ambient-shadow">
                    <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Community Meeting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0Qdc2FbNivK6Y6HAVJ0VNHxwEbpJ5Y8Qs8W5o50YAFNUzlwjdVFz4YSni2k8ttMAbeTDguw6cOXiauxm0_CBqN8VhZRuzRt-__FGm5SOSoSNwnX6iPxcPgLm8bTMF8IgpARETDU7p4LoottUIkAzugd3C8zskqsSAJhXtMLFpTdQ5kWdHbhB_yOMnhk55D5FlWEhftvc3xAi2z9oc3beLA-3zjFS-Xx1Jcz-SAmfqQ24EvuIc2Gq3"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 to-transparent flex items-end p-6">
                        <span className="text-on-primary font-label-md text-label-md">Musyawarah Tahunan</span>
                    </div>
                </div>
            </div>
        </section>

        {/* Detail Modal */}
        {selectedEvent && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
                <div className="bg-surface rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative shadow-ambient animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                    <button 
                        onClick={() => setSelectedEvent(null)}
                        className="absolute top-6 right-6 p-2 bg-surface-container rounded-full text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-colors"
                    >
                        <X size={20} />
                    </button>
                    {selectedEvent.image && (
                        <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-6">
                            <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-container text-on-primary-container text-xs font-bold rounded-full mb-4">
                        <Calendar size={14} />
                        {new Date(selectedEvent.event_date || selectedEvent.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">{selectedEvent.title}</h2>
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-on-surface-variant">
                            <Clock className="text-primary w-5 h-5" />
                            <span>{selectedEvent.event_date ? getFullTimeStr(selectedEvent.event_date) : getFullTimeStr(selectedEvent.created_at)} - Selesai</span>
                        </div>
                        <div className="flex items-center gap-3 text-on-surface-variant">
                            <MapPin className="text-primary w-5 h-5" />
                            <span>{selectedEvent.location || "Area Lingkungan RW 003 Kampung Utan"}</span>
                        </div>
                    </div>
                    <div className="border-t border-outline-variant/30 pt-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Deskripsi Kegiatan</h4>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedEvent.content}</p>
                    </div>
                    <div className="mt-8 text-right">
                        <button 
                            onClick={() => setSelectedEvent(null)}
                            className="px-6 py-3 bg-secondary text-on-secondary rounded-full font-bold hover:shadow-ambient transition-all"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        )}
    </main>
  );
}
