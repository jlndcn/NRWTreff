import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, ArrowRight } from 'lucide-react';
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
  const searchRef = useRef(null);

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
      if (city) {
        navigate(`/stadte/${city.slug}`);
      } else {
        navigate(`/browse?search=${searchCity}`);
      }
    }
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <SEOHead
        title="NRW Treff – Diskrete Kontakte in NRW | Rotzlicht"
        description="Finde diskrete Kontakte in deiner Stadt. Köln, Düsseldorf, Dortmund, Essen und ganz NRW. Direkt, diskret und unkompliziert."
        canonical="/"
      />
      <AgeVerificationModal />
      <Header cities={cities} regions={regions} />

      {/* ═══════════════ HERO ═══════════════ */}
      <div
        className="relative overflow-hidden"
        style={{
          minHeight: '85vh',
          background: 'linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(15,10,15,1) 50%, rgba(10,10,10,1) 100%)'
        }}
      >
        {/* Cityscape Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${process.env.REACT_APP_BACKEND_URL}/api/uploads/hero-cityscape.webp)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
            opacity: 0.3,
            filter: 'grayscale(0.2) brightness(0.7) contrast(1.15)',
            transform: `scale(1.05) translateY(${scrollY * 0.2}px)`,
          }}
        />
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.15) 40%, rgba(10,10,10,0.85) 100%)',
          }}
        />

        <div ref={searchRef} className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-36 sm:pt-44 pb-16 sm:pb-24 text-center z-10">
          {/* Headline */}
          <h1
            data-testid="hero-headline"
            className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-[1.05]"
            style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}
          >
            Wo bist du,
            <br />
            <span style={{ color: '#cc0000' }}>Süßer?</span>
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-10 sm:mb-12" data-testid="hero-search-form">
            <div className="relative max-w-xl mx-auto flex items-center gap-0 rounded-full overflow-hidden border border-white/20 transition-all focus-within:border-red-500/40" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <MapPin className="absolute left-4 text-white/40 pointer-events-none" size={18} />
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Stadt eingeben"
                data-testid="hero-search-input"
                className="flex-1 pl-12 pr-2 py-4 sm:py-5 bg-transparent text-base sm:text-lg focus:outline-none"
                style={{ color: '#f0f0f0' }}
              />
              <button
                type="submit"
                data-testid="hero-search-button"
                className="flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 m-1.5 rounded-full font-bold text-sm sm:text-base transition-all hover:brightness-110 active:scale-[0.97]"
                style={{ background: '#cc0000', color: '#fff' }}
              >
                <Search size={16} />
                Suche
              </button>
            </div>
          </form>

          {/* Feature Tags: Diskret · Performance · Verifiziert */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4" data-testid="hero-feature-tags">
            {[
              { label: 'Diskret', icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              )},
              { label: 'Performance', icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              )},
              { label: 'Verifiziert', icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              )},
            ].map(tag => (
              <div
                key={tag.label}
                data-testid={`feature-tag-${tag.label.toLowerCase()}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-semibold transition-all hover:border-red-500/30"
                style={{ borderColor: 'rgba(255,255,255,0.15)', color: '#d0d0d0', background: 'rgba(255,255,255,0.04)' }}
              >
                <span style={{ color: '#cc0000' }}>{tag.icon}</span>
                {tag.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <Footer />
    </div>
  );
}
