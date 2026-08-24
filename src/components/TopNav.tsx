import { useState, useEffect } from 'react';
import { Menu, X, Home as HomeIcon, Newspaper, Calendar, Wrench, PhoneCall, ShieldCheck } from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

export default function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Beranda', path: '/', icon: HomeIcon, end: true },
    { name: 'Berita', path: '/news', icon: Newspaper },
    { name: 'Kegiatan', path: '/activities', icon: Calendar },
    { name: 'Layanan', path: '/services', icon: Wrench },
    { name: 'Kontak & Aduan', path: '/contact', icon: PhoneCall },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-ambient border-b border-outline-variant/20">
        <div className="flex justify-between items-center w-full px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-3.5 sm:py-4">
          <NavLink 
            to="/" 
            className="flex items-center gap-2.5 text-xl sm:text-2xl font-bold text-primary tracking-tight"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-black text-sm sm:text-base">
              03
            </div>
            <span className="truncate">RW 003 Kampung Utan</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold tracking-wide">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  isActive
                    ? "text-primary border-b-2 border-primary pb-1 font-bold transition-all"
                    : "text-on-surface-variant hover:text-primary transition-colors py-1"
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/admin/login')}
              className="hidden sm:inline-flex items-center gap-2 bg-primary text-on-primary text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:shadow-[0_4px_14px_rgba(74,101,73,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <ShieldCheck size={16} />
              <span>Portal Pengurus</span>
            </button>

            {/* Mobile Hamburger / Menu Button */}
            <button 
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors active:scale-95"
              aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu navigasi"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={22} className="text-error" /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop & Menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="fixed top-[61px] sm:top-[69px] left-0 right-0 max-h-[calc(100vh-70px)] overflow-y-auto bg-surface-container-lowest border-b border-outline-variant/30 shadow-2xl p-5 space-y-4 animate-in slide-in-from-top-4 duration-200 rounded-b-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-2">
              Navigasi Menu
            </div>

            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.end}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary-container text-on-primary-container font-bold shadow-sm"
                          : "text-on-surface hover:bg-surface-container-high active:bg-surface-container-highest"
                      }`
                    }
                  >
                    <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                      <IconComponent size={18} />
                    </div>
                    <span>{link.name}</span>
                  </NavLink>
                );
              })}
            </div>

            <div className="pt-3 border-t border-outline-variant/30">
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/admin/login');
                }}
                className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold py-3.5 rounded-2xl shadow-md active:scale-[0.99] transition-all text-sm"
              >
                <ShieldCheck size={18} />
                <span>Masuk Portal Pengurus / Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

