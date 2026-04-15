import React, { useEffect, useState, useRef } from 'react';
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
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <SEOHead
        title="NRW Treff – Diskrete Kontakte in NRW | Rotzlicht"
        description="Finde diskrete Kontakte in deiner Stadt. Köln, Düsseldorf, Dortmund, Essen und ganz NRW."
        canonical="/"
      />
      <AgeVerificationModal />
      <Header cities={cities} regions={regions} />

      {/* ═══════════════ HERO ═══════════════ */}
      <div
        className="relative overflow-hidden"
        style={{
          minHeight: '85vh',
          background: '#0a0a0a'
        }}
      >
        {/* Cityscape Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${process.env.REACT_APP_BACKEND_URL}/api/uploads/hero-cityscape.webp)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
            opacity: 0.18,
            filter: 'grayscale(0.3) brightness(0.6) contrast(1.2)',
            transform: `scale(1.05) translateY(${scrollY * 0.15}px)`,
          }}
        />

        {/* Subtle cyan gradient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 40% at 50% 45%, rgba(0,229,255,0.04) 0%, transparent 70%)',
          }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.15) 40%, rgba(10,10,10,0.9) 100%)',
          }}
        />

        <div className="relative max-w-3xl mx-auto px-6 sm:px-8 pt-32 sm:pt-40 pb-16 sm:pb-24 text-center z-10">
          {/* Headline */}
          <h1
            data-testid="hero-headline"
            className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black mb-7 tracking-tight leading-[1.02]"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            <span style={{ color: '#e8e8e8' }}>Wo bist du,</span>
            <br />
            <span
              style={{
                color: '#00e5ff',
                textShadow: '0 0 40px rgba(0,229,255,0.15)',
              }}
            >
              Süßer?
            </span>
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-10 sm:mb-12" data-testid="hero-search-form">
            <div
              className="relative max-w-xl mx-auto flex items-center rounded-full overflow-hidden transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(0,229,255,0.12)',
              }}
            >
              <MapPin className="absolute left-4 pointer-events-none" size={16} style={{ color: 'rgba(0,229,255,0.35)' }} />
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Stadt eingeben"
                data-testid="hero-search-input"
                className="flex-1 pl-11 pr-2 py-4 sm:py-5 bg-transparent text-sm sm:text-base tracking-wide focus:outline-none"
                style={{ color: '#e0e0e0', caretColor: '#00e5ff' }}
              />
              <button
                type="submit"
                data-testid="hero-search-button"
                className="flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 m-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-[0.1em] uppercase transition-all duration-200 hover:brightness-125"
                style={{
                  background: 'rgba(0,229,255,0.12)',
                  color: '#00e5ff',
                  border: '1px solid rgba(0,229,255,0.2)',
                }}
              >
                <Search size={14} />
                Suche
              </button>
            </div>
          </form>

          {/* Feature Tags */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-5" data-testid="hero-feature-tags">
            {[
              { label: 'Diskret', icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              )},
              { label: 'Performance', icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              )},
              { label: 'Verifiziert', icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              )},
            ].map(tag => (
              <div
                key={tag.label}
                data-testid={`feature-tag-${tag.label.toLowerCase()}`}
                className="flex items-center gap-2 px-4 py-2 text-[11px] sm:text-xs tracking-[0.15em] uppercase font-medium transition-all duration-200"
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  border: '1px solid rgba(0,229,255,0.08)',
                  background: 'rgba(0,229,255,0.02)',
                }}
              >
                <span style={{ color: 'rgba(0,229,255,0.5)' }}>{tag.icon}</span>
                {tag.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
