import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, ArrowUp } from 'lucide-react';
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
  
  const heroRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    api.get('/cities').then(r => setCities(r.data)).catch(console.error);
    api.get('/regions').then(r => setRegions(r.data)).catch(console.error);

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

  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

      {/* Hero Section with Animated Cityscape */}
      <div 
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ 
          minHeight: '90vh',
          background: 'linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(15,10,15,1) 50%, rgba(10,10,10,1) 100%)'
        }}
      >
        {/* Cityscape Background Image - Heller Bereich nach oben, dunkler */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${process.env.REACT_APP_BACKEND_URL}/api/uploads/hero-cityscape.webp)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
            opacity: 0.35,
            filter: 'grayscale(0.2) brightness(0.75) contrast(1.15)',
            transform: `scale(1.05) translateY(${scrollY * 0.25}px)`,
          }}
        />

        {/* Gradient Overlay - Weniger stark für mehr Foto-Sichtbarkeit */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.2) 50%, rgba(10,10,10,0.85) 100%)',
          }}
        />

        <div ref={searchRef} className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-48 sm:pt-56 pb-20 sm:pb-28 text-center z-10">
          <div className="inline-block mb-5 sm:mb-6 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest" 
               style={{ background: 'rgba(204, 0, 0, 0.15)', color: '#ff2244', border: '1px solid rgba(204, 0, 0, 0.3)' }}>
            Welche Stadt?
          </div>
          
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6 sm:mb-7 tracking-tight leading-[1.05]" 
              style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>
            Wo bist du,
            <br />
            <span style={{ color: '#cc0000' }}>Süßer?</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/60 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            Wähl deine Stadt ein und finde diskrete Begleitung in deiner Nähe – schnell, einfach, unkompliziert.
          </p>

          {/* City Search - Wird sticky beim Scrollen */}
          <form onSubmit={handleSearch} className="mb-8 sm:mb-10 sticky top-[56px] z-30"
                style={{ 
                  background: scrollY > 200 ? 'rgba(10, 10, 10, 0.98)' : 'transparent',
                  backdropFilter: scrollY > 200 ? 'blur(16px)' : 'none',
                  padding: scrollY > 200 ? '12px 16px' : '0',
                  borderBottom: scrollY > 200 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  transition: 'all 0.2s ease-out',
                  marginLeft: scrollY > 200 ? '-16px' : '0',
                  marginRight: scrollY > 200 ? '-16px' : '0',
                  width: scrollY > 200 ? 'calc(100% + 32px)' : '100%'
                }}>
            <div className="relative max-w-xl mx-auto">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Wo suchst du Treffen?"
                className="w-full pl-14 pr-4 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl border border-white/20 focus:border-red-500/50 focus:outline-none transition-all"
                style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#f0f0f0' }}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg flex items-center gap-2 transition-all hover:scale-105 shadow-lg"
                style={{ background: '#cc0000', color: '#fff' }}
              >
                Los <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* NRWTreff weil... Section */}
      <div className="relative py-16 sm:py-20" style={{ background: '#0d0d0d' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-14">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>
              NRW<span style={{ color: '#cc0000' }}>Treff</span> weil...
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: 'Verifiziert',
                desc: 'Alle Profile werden von uns geprüft und bestätigt.',
                icon: (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
                  </svg>
                )
              },
              {
                title: 'Anonym',
                desc: 'Deine Privatsphäre hat höchste Priorität. Immer diskret.',
                icon: (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )
              },
              {
                title: 'Einfach',
                desc: 'Stadt wählen, Profil finden, direkt Kontakt aufnehmen.',
                icon: (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )
              }
            ].map((feature, i) => (
              <div
                key={i}
                data-testid={`feature-card-${feature.title.toLowerCase()}`}
                className="relative p-8 sm:p-10 rounded-2xl border border-white/10 text-center transition-all hover:border-red-500/20 group"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}
              >
                <div className="mb-5 flex justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                  {feature.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-white/50 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12 sm:mt-14">
            <button
              onClick={scrollToSearch}
              className="inline-flex items-center gap-3 px-7 sm:px-8 py-4 rounded-xl font-bold text-lg sm:text-xl transition-all hover:scale-105 shadow-2xl"
              style={{ background: '#cc0000', color: '#fff' }}
            >
              Jetzt Stadt auswählen <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        @media (max-width: 640px) {
          body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }
      `}</style>
    </div>
  );
}
