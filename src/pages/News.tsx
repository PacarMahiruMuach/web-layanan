import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, ArrowRight, X, Phone, Send, Wallet } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  image: string | null;
  author: string;
  created_at: string;
}

export default function News() {
  const [newsList, setNewsList] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Post | null>(null);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/posts?type=news');
      if (res.ok) {
        const data = await res.json();
        setNewsList(data);
      }
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  };

  const featuredNews = newsList[0];
  const baseRecentNews = newsList.slice(1);
  
  const filteredNews = activeCategory === 'Semua' 
    ? baseRecentNews 
    : baseRecentNews.filter(post => post.category.toLowerCase() === activeCategory.toLowerCase());
    
  const displayedNews = filteredNews.slice(0, visibleCount);

  return (
    <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Hero Section */}
      <header className="mb-16 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-4">Warta Kampung 003</h1>
        <p className="text-lg text-on-surface-variant max-w-2xl">
          Latest updates, announcements, and stories cultivating our community spirit in Kampung Utan.
        </p>
      </header>

      {/* Featured News Card (Bento-style large card) */}
      {loading ? (
        <div className="flex justify-center py-20 bg-surface rounded-3xl shadow-sm border border-outline-variant/30 mb-24">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : featuredNews ? (
        <section className="mb-24">
          <div className="group relative rounded-xl bg-surface-container-lowest overflow-hidden shadow-ambient flex flex-col md:flex-row min-h-[400px]">
            <div className="md:w-3/5 h-64 md:h-auto relative">
              {featuredNews.image ? (
                <img 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt={featuredNews.title} 
                  src={featuredNews.image} 
                />
              ) : (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-primary-container/20 text-primary transition-transform duration-700 group-hover:scale-105">
                  <Calendar size={64} className="opacity-50" />
                </div>
              )}
            </div>
            <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-surface-container-lowest z-10 relative">
              <div className="mb-4">
                <span className="inline-block bg-primary-container/20 text-primary font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Pengumuman Utama
                </span>
              </div>
              <h2 className="text-3xl font-bold text-on-surface mb-4 line-clamp-2">{featuredNews.title}</h2>
              <p className="text-on-surface-variant mb-8 line-clamp-3 leading-relaxed">
                {featuredNews.content}
              </p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-sm font-medium text-outline flex items-center gap-1.5">
                  <Calendar size={16} />
                  {new Date(featuredNews.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <button 
                  onClick={() => setSelectedArticle(featuredNews)}
                  className="text-secondary font-bold text-sm flex items-center gap-2 hover:text-tertiary transition-colors cursor-pointer"
                >
                  Read More <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="text-center py-20 bg-surface rounded-3xl shadow-sm border border-outline-variant/30 mb-24">
          <p className="text-on-surface-variant text-lg">Belum ada berita terbaru saat ini.</p>
        </div>
      )}

      {/* News Feed Grid */}
      {baseRecentNews.length > 0 && (
        <section className="mb-24">
          <div className="flex justify-between items-end mb-8">
            <h3 className="text-2xl font-bold text-on-surface">Recent Updates</h3>
            <div className="hidden md:flex gap-2">
              {['Semua', 'Lingkungan', 'Keuangan'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setVisibleCount(6); }}
                  className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                    activeCategory === cat 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          {filteredNews.length === 0 ? (
            <div className="text-center py-12 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <p className="text-on-surface-variant">Tidak ada berita untuk kategori ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedNews.map((post) => (
                <article key={post.id} className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-ambient flex flex-col hover:-translate-y-1 transition-transform duration-300 cursor-pointer" onClick={() => setSelectedArticle(post)}>
                  <div className="h-48 rounded-xl overflow-hidden mb-6 relative bg-surface-container-low flex items-center justify-center">
                    {post.image ? (
                      <img 
                        className="absolute inset-0 w-full h-full object-cover" 
                        alt={post.title} 
                        src={post.image} 
                      />
                    ) : (
                      <Calendar size={64} className="text-tertiary opacity-50" />
                    )}
                    <div className="absolute top-4 left-4 bg-secondary-container/90 backdrop-blur-sm text-on-secondary-container text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {post.category === 'news' ? 'Berita' : post.category}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-on-surface mb-3 line-clamp-2">{post.title}</h4>
                  <p className="text-on-surface-variant mb-6 line-clamp-2 flex-grow leading-relaxed">{post.content}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/20">
                    <span className="text-sm font-medium text-outline flex items-center gap-1.5">
                      <Calendar size={16} /> 
                      {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-primary font-bold text-sm hover:underline">Detail</span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {visibleCount < filteredNews.length && (
            <div className="mt-12 text-center">
              <button 
                onClick={() => setVisibleCount(prev => prev + 6)}
                className="bg-surface-container-low text-on-surface border border-outline-variant/50 text-sm font-bold px-8 py-3 rounded-full hover:bg-surface-container-high transition-colors"
              >
                Muat Lebih Banyak
              </button>
            </div>
          )}
        </section>
      )}

      {/* Newsletter Signup (Soft-colored organic section) */}
      <section className="bg-surface-container-low rounded-xl p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-ambient">
        {/* Decorative organic shape */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-secondary-container/20 rounded-full blur-2xl -z-10"></div>
        
        <div className="md:w-1/2 mb-8 md:mb-0 z-10">
          <h3 className="text-3xl font-bold text-on-surface mb-4">Dapatkan Info Terkini</h3>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            Daftarkan nomor WhatsApp Anda untuk menerima ringkasan pengumuman penting langsung ke genggaman Anda.
          </p>
        </div>
        <div className="md:w-5/12 w-full z-10">
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
              <input 
                className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 rounded-2xl py-4 pl-12 pr-4 text-on-surface focus:border-secondary focus:ring-0 focus:outline-none transition-colors" 
                placeholder="Nomor WhatsApp" 
                type="tel"
              />
            </div>
            <button 
              className="bg-secondary text-on-secondary font-bold text-sm px-6 py-4 rounded-full hover:shadow-ambient hover:-translate-y-0.5 transition-all w-full flex justify-center items-center gap-2" 
              type="submit"
            >
              Berlangganan <Send size={16} />
            </button>
          </form>
        </div>
      </section>

      {/* Modal / Popup Berita */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedArticle(null)}
        >
          <div 
            className="bg-surface rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative animate-in fade-in zoom-in-95 duration-200 shadow-ambient"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-error transition-colors z-10 shadow-sm"
            >
              <X size={20} />
            </button>
            
            {selectedArticle.image && (
              <img 
                src={selectedArticle.image} 
                alt={selectedArticle.title}
                className="w-full h-auto max-h-[400px] object-contain rounded-xl bg-slate-50 mb-6 shadow-sm"
              />
            )}
            
            <h2 className="text-3xl font-bold text-on-surface mb-4 leading-tight pr-12">
              {selectedArticle.title}
            </h2>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-on-surface-variant mb-8 pb-6 border-b border-outline-variant/30">
              <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-full">
                <User size={16} />
                <span>{selectedArticle.author}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-full">
                <Clock size={16} />
                <span>{new Date(selectedArticle.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            
            <p className="text-on-surface-variant leading-relaxed text-lg whitespace-pre-wrap">
              {selectedArticle.content}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
