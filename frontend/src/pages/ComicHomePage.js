import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import AgeVerificationModal from '../components/AgeVerificationModal';
import api from '../utils/api';

export default function ComicHomePage() {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    api.get('/cities').then(r => setCities(r.data)).catch(() => {});
    api.get('/regions').then(r => setRegions(r.data)).catch(() => {});
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity) {
      const city = cities.find(c => c.name.toLowerCase().includes(searchCity.toLowerCase()));
      if (city) navigate(`/stadte/${city.slug}`);
      else navigate(`/browse?search=${searchCity}`);
    }
  };

  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      <SEOHead
        title="NRW Treff – Diskrete Kontakte in NRW | Rotzlicht"
        description="Finde diskrete Kontakte in deiner Stadt. Köln, Düsseldorf, Dortmund, Essen und ganz NRW."
        canonical="/"
      />
      <AgeVerificationModal />
      <Header cities={cities} regions={regions} />

      {/* ═══ HERO ═══ */}
      <div className="relative overflow-hidden" style={{ minHeight: '88vh', background: '#080808' }}>
        {/* Cityscape */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${process.env.REACT_APP_BACKEND_URL}/api/uploads/hero-cityscape.webp)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            opacity: 0.14,
            filter: 'grayscale(0.4) brightness(0.5) contrast(1.3)',
            transform: `scale(1.08) translateY(${scrollY * 0.12}px)`,
          }}
        />
        {/* Dark vignette */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 40%, transparent 0%, #080808 100%)' }} />
        {/* Bottom fade */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, #080808 100%)' }} />
        {/* Subtle red glow top */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 40% 25% at 50% 0%, rgba(224,16,32,0.04) 0%, transparent 70%)' }} />

        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-36 sm:pt-44 lg:pt-48 pb-20 sm:pb-28 text-center z-10">
          {/* Headline */}
          <h1
            data-testid="hero-headline"
            className="text-[3.5rem] sm:text-[4.5rem] lg:text-[5.5rem] font-black mb-8 tracking-tight leading-[1]"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            <span style={{ color: '#e0e0e0' }}>Wo bist du,</span>
            <br />
            <span
              className="inline-block"
              style={{
                color: '#e01020',
                textShadow: '0 0 50px rgba(224,16,32,0.2), 0 0 100px rgba(224,16,32,0.08)',
              }}
            >
              Süßer?
            </span>
          </h1>

          {/* Search */}
          <form onSubmit={handleSearch} className="mb-10 sm:mb-14" data-testid="hero-search-form">
            <div
              className="relative max-w-lg mx-auto flex items-center rounded-full overflow-hidden transition-all duration-300 hero-search-bar"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <MapPin className="absolute left-4 pointer-events-none" size={16} style={{ color: 'rgba(255,255,255,0.2)' }} />
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Stadt eingeben"
                data-testid="hero-search-input"
                className="flex-1 pl-11 pr-2 py-4 sm:py-[18px] bg-transparent text-sm tracking-wide focus:outline-none"
                style={{ color: '#d0d0d0', caretColor: '#e01020' }}
              />
              <button
                type="submit"
                data-testid="hero-search-button"
                className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 m-1.5 rounded-full text-xs font-bold tracking-[0.12em] uppercase transition-all duration-200 neon-btn"
              >
                <Search size={14} />
                Suche
              </button>
            </div>
          </form>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4" data-testid="hero-feature-tags">
            {[
              { label: 'Diskret', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
              { label: 'Performance', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
              { label: 'Verifiziert', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg> },
            ].map(tag => (
              <div
                key={tag.label}
                data-testid={`feature-tag-${tag.label.toLowerCase()}`}
                className="flex items-center gap-2 px-4 py-2 text-[10px] tracking-[0.18em] uppercase font-semibold feature-tag"
              >
                <span style={{ color: 'rgba(224,16,32,0.5)' }}>{tag.icon}</span>
                {tag.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        .hero-search-bar:focus-within {
          border-color: rgba(224,16,32,0.2) !important;
          box-shadow: 0 0 20px rgba(224,16,32,0.05);
        }
        .neon-btn {
          background: rgba(224,16,32,0.12);
          color: #e01020;
          border: 1px solid rgba(224,16,32,0.25);
        }
        .neon-btn:hover {
          background: #e01020;
          color: #fff;
          box-shadow: 0 0 20px rgba(224,16,32,0.3), 0 0 40px rgba(224,16,32,0.1);
        }
        .feature-tag {
          color: rgba(255,255,255,0.3);
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          transition: all 0.2s;
        }
        .feature-tag:hover {
          border-color: rgba(224,16,32,0.15);
          color: rgba(255,255,255,0.5);
        }
      `}</style>
    </div>
  );
}
