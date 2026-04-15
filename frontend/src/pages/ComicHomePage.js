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

      {/* Features Section mit Stacheldraht-Muster */}
      <div className="relative py-16 sm:py-20" style={{ background: '#0d0d0d' }}>
        {/* Stacheldraht-Zaun-Muster im Hintergrund - Kreuzweise/Diagonal */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="barbed-wire" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                {/* Diagonal wire lines - Von links-oben nach rechts-unten */}
                <line x1="0" y1="0" x2="100" y2="100" stroke="#666" strokeWidth="1.5" />
                <line x1="-50" y1="50" x2="50" y2="150" stroke="#666" strokeWidth="1.5" />
                <line x1="50" y1="-50" x2="150" y2="50" stroke="#666" strokeWidth="1.5" />
                
                {/* Diagonal wire lines - Von rechts-oben nach links-unten (Kreuzung) */}
                <line x1="100" y1="0" x2="0" y2="100" stroke="#666" strokeWidth="1.5" />
                <line x1="150" y1="50" x2="50" y2="150" stroke="#666" strokeWidth="1.5" />
                <line x1="50" y1="-50" x2="-50" y2="50" stroke="#666" strokeWidth="1.5" />
                
                {/* Barbed wire spikes entlang Diagonale 1 */}
                <path d="M22,19 L20,22 L22,25 M26,19 L22,22 L26,25" stroke="#777" strokeWidth="1" fill="none" />
                <path d="M47,44 L45,47 L47,50 M51,44 L47,47 L51,50" stroke="#777" strokeWidth="1" fill="none" />
                <path d="M72,69 L70,72 L72,75 M76,69 L72,72 L76,75" stroke="#777" strokeWidth="1" fill="none" />
                
                {/* Barbed wire spikes entlang Diagonale 2 */}
                <path d="M78,19 L75,22 L78,25 M82,19 L78,22 L82,25" stroke="#777" strokeWidth="1" fill="none" />
                <path d="M53,44 L50,47 L53,50 M57,44 L53,47 L57,50" stroke="#777" strokeWidth="1" fill="none" />
                <path d="M28,69 L25,72 L28,75 M32,69 L28,72 L32,75" stroke="#777" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#barbed-wire)" />
          </svg>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-14">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-5" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>
              Warum <span style={{ color: '#cc0000' }}>NRW Treff?</span>
            </h2>
            <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto">
              Schnell, diskret und unkompliziert – so funktioniert's
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              { icon: '🏙️', title: 'NRW-weit', desc: 'Alle wichtigen Städte in Nordrhein-Westfalen' },
              { icon: '🔒', title: 'Diskret', desc: 'Deine Privatsphäre hat höchste Priorität' },
              { icon: '⚡', title: 'Direkt', desc: 'Sofortkontakt per Telefon oder WhatsApp' },
              { icon: '✨', title: 'Geprüft', desc: 'Alle Profile sind moderiert' },
              { icon: '📱', title: 'Mobile-First', desc: 'Optimiert für unterwegs' },
              { icon: '🆓', title: 'Kostenlos', desc: 'Keine versteckten Kosten' }
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 sm:p-7 rounded-xl border border-white/10 transition-all hover:border-red-500/30 hover:scale-105"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}
              >
                <div className="text-4xl sm:text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ color: '#f0f0f0' }}>
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-white/50">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Button - Scroll to Search */}
          <div className="text-center mt-12 sm:mt-14">
            <button
              onClick={scrollToSearch}
              className="inline-flex items-center gap-3 px-7 sm:px-8 py-4 sm:py-4.5 rounded-xl font-bold text-lg sm:text-xl transition-all hover:scale-105 shadow-2xl"
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
