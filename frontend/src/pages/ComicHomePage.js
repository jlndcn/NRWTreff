import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Shield, Zap, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import AgeVerificationModal from '../components/AgeVerificationModal';
import api from '../utils/api';

const BACKEND = process.env.REACT_APP_BACKEND_URL;

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
    <div style={{ background: '#060606', minHeight: '100vh' }}>
      <SEOHead title="NRW Treff – Diskrete Kontakte in NRW | Rotzlicht" description="Finde diskrete Kontakte in deiner Stadt." canonical="/" />
      <AgeVerificationModal />
      <Header cities={cities} regions={regions} />

      {/* ══════ HERO ══════ */}
      <div className="relative overflow-hidden" style={{ minHeight: '90vh', background: '#060606' }}>
        {/* Nightlife Photo Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${BACKEND}/api/uploads/hero-new-opt.jpg)`,
          backgroundSize: 'cover', backgroundPosition: 'center 40%',
          opacity: 0.35, filter: 'brightness(0.55) contrast(1.25) saturate(1.2)',
          transform: `scale(1.06) translateY(${scrollY * 0.1}px)`,
        }} />
        {/* Vignette */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 45%, transparent 0%, #060606 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(6,6,6,0.3) 0%, transparent 30%, rgba(6,6,6,0.95) 100%)' }} />

        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-36 sm:pt-44 lg:pt-52 pb-20 sm:pb-28 text-center z-10">
          {/* Headline — Rajdhani (technical) */}
          <h1 data-testid="hero-headline" className="mb-8 leading-[0.95]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            <span className="block text-[3.2rem] sm:text-[4.5rem] lg:text-[5.8rem] font-bold tracking-tight" style={{ color: '#e8e8e8' }}>
              Wo bist du,
            </span>
            <span className="block text-[4rem] sm:text-[5.5rem] lg:text-[7rem] font-bold tracking-tight" style={{
              color: '#dc1414',
              textShadow: '0 0 60px rgba(220,20,20,0.25), 0 0 120px rgba(220,20,20,0.08)',
            }}>
              Süßer?
            </span>
          </h1>

          {/* Search */}
          <form onSubmit={handleSearch} className="mb-8" data-testid="hero-search-form">
            <div className="relative max-w-lg mx-auto flex items-center rounded-full overflow-hidden hero-search" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <MapPin className="absolute left-4 pointer-events-none" size={16} style={{ color: 'rgba(255,255,255,0.25)' }} />
              <input type="text" value={searchCity} onChange={e => setSearchCity(e.target.value)} placeholder="Stadt eingeben" data-testid="hero-search-input"
                className="flex-1 pl-11 pr-2 py-4 sm:py-[18px] bg-transparent text-[15px] tracking-wide focus:outline-none" style={{ color: '#d5d5d5', caretColor: '#dc1414' }} />
              <button type="submit" data-testid="hero-search-button" className="neon-btn flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 m-1.5 rounded-full text-[13px] font-bold tracking-[0.08em] uppercase">
                <Search size={14} /> Suche
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ══════ FEATURES SECTION ══════ */}
      <div className="relative py-20 sm:py-28 overflow-hidden" data-testid="features-section">
        {/* Section Background — second photo */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${BACKEND}/api/uploads/cards-bg-opt.jpg)`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.12, filter: 'brightness(0.5) contrast(1.3) saturate(0.8)',
        }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #060606 0%, rgba(6,6,6,0.7) 15%, rgba(6,6,6,0.7) 85%, #060606 100%)' }} />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">

            {/* DISKRET — blurred, clears on hover */}
            <div data-testid="feature-card-diskret" className="feature-card diskret-card group rounded-2xl p-10 sm:p-14 text-center cursor-default" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="diskret-inner transition-all duration-500">
                <div className="w-16 h-16 mx-auto mb-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(220,20,20,0.08)', border: '1px solid rgba(220,20,20,0.12)' }}>
                  <Shield size={30} style={{ color: '#dc1414' }} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>Diskret</h3>
                <p className="text-[15px] text-white/45 leading-relaxed">Deine Privatsphäre steht an erster Stelle. Verschlüsselte Kommunikation, keine Spuren, keine Kompromisse.</p>
              </div>
            </div>

            {/* PERFORMANCE — gears rotate on hover */}
            <div data-testid="feature-card-performance" className="feature-card perf-card group rounded-2xl p-10 sm:p-14 text-center cursor-default relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {/* Rotating gears background — many gears */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <svg className="gear-svg absolute" width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="rgba(220,20,20,0.1)" strokeWidth="0.5" style={{ top: '5%', right: '0%' }}>
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
                </svg>
                <svg className="gear-svg-reverse absolute" width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="rgba(220,20,20,0.08)" strokeWidth="0.5" style={{ bottom: '5%', left: '2%' }}>
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
                </svg>
                <svg className="gear-svg absolute" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(220,20,20,0.07)" strokeWidth="0.6" style={{ top: '55%', left: '15%' }}>
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
                </svg>
                <svg className="gear-svg-reverse absolute" width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="rgba(220,20,20,0.06)" strokeWidth="0.6" style={{ top: '10%', left: '30%' }}>
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
                </svg>
                <svg className="gear-svg absolute" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="rgba(220,20,20,0.05)" strokeWidth="0.7" style={{ bottom: '20%', right: '20%' }}>
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
                </svg>
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(220,20,20,0.08)', border: '1px solid rgba(220,20,20,0.12)' }}>
                  <Zap size={30} style={{ color: '#dc1414' }} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>Performance</h3>
                <p className="text-[15px] text-white/45 leading-relaxed">Blitzschnelle Ladezeiten, optimiert für jedes Gerät. Finde sofort, was du suchst – ohne Wartezeit.</p>
              </div>
            </div>

            {/* VERIFIZIERT — green shimmer on hover */}
            <div data-testid="feature-card-verifiziert" className="feature-card verif-card group rounded-2xl p-10 sm:p-14 text-center cursor-default" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-16 h-16 mx-auto mb-7 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(34,197,94,0.25)]" style={{ background: 'rgba(220,20,20,0.08)', border: '1px solid rgba(220,20,20,0.12)' }}>
                <ShieldCheck size={30} className="transition-colors duration-500 group-hover:text-green-400" style={{ color: '#dc1414' }} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight transition-colors duration-500 group-hover:text-green-300" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>Verifiziert</h3>
              <p className="text-[15px] text-white/45 leading-relaxed">Jedes Profil wird manuell geprüft. Echte Menschen, echte Bilder – garantiert.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        .hero-search:focus-within {
          border-color: rgba(220,20,20,0.25) !important;
          box-shadow: 0 0 24px rgba(220,20,20,0.06);
        }
        .neon-btn {
          background: rgba(220,20,20,0.12);
          color: #dc1414;
          border: 1px solid rgba(220,20,20,0.25);
          transition: all 0.25s;
        }
        .neon-btn:hover {
          background: #dc1414;
          color: #fff;
          box-shadow: 0 0 24px rgba(220,20,20,0.35), 0 0 48px rgba(220,20,20,0.12);
        }

        /* DISKRET — blur on load, clear on hover */
        .diskret-card .diskret-inner {
          filter: blur(4px);
        }
        .diskret-card:hover .diskret-inner {
          filter: blur(0px);
        }

        /* PERFORMANCE — rotating gears */
        @keyframes gear-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gear-spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .perf-card:hover .gear-svg {
          animation: gear-spin 6s linear infinite;
        }
        .perf-card:hover .gear-svg-reverse {
          animation: gear-spin-reverse 8s linear infinite;
        }

        /* VERIFIZIERT — green shimmer */
        .verif-card {
          transition: all 0.5s;
        }
        .verif-card:hover {
          border-color: rgba(34,197,94,0.3) !important;
          box-shadow: 0 0 40px rgba(34,197,94,0.1), 0 0 80px rgba(34,197,94,0.04), inset 0 0 40px rgba(34,197,94,0.05);
        }

        /* All feature cards base hover */
        .feature-card {
          transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-4px);
        }
      `}</style>
    </div>
  );
}
