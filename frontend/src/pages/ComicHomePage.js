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
          backgroundImage: `url(${BACKEND}/api/uploads/hero-v7-opt.jpg)`,
          backgroundSize: 'cover', backgroundPosition: 'center 40%',
          opacity: 0.45, filter: 'brightness(0.6) contrast(1.2) saturate(1.15)',
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

            {/* PERFORMANCE — interlocking gears always visible */}
            <div data-testid="feature-card-performance" className="feature-card perf-card group rounded-2xl p-10 sm:p-14 text-center cursor-default relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {/* Interlocking gears — 100% opacity, always visible, rotate on hover */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Large gear top-right */}
                <svg className="gear-a absolute" width="180" height="180" viewBox="0 0 100 100" style={{ top: '-15%', right: '-10%' }}>
                  <g fill="none" stroke="rgba(220,20,20,0.15)" strokeWidth="2">
                    <circle cx="50" cy="50" r="20"/><circle cx="50" cy="50" r="10"/>
                    {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => <rect key={a} x="46" y="25" width="8" height="12" rx="2" transform={`rotate(${a} 50 50)`}/>)}
                  </g>
                </svg>
                {/* Medium gear center-left — meshes with large */}
                <svg className="gear-b absolute" width="130" height="130" viewBox="0 0 100 100" style={{ top: '25%', left: '-5%' }}>
                  <g fill="none" stroke="rgba(220,20,20,0.12)" strokeWidth="2">
                    <circle cx="50" cy="50" r="20"/><circle cx="50" cy="50" r="8"/>
                    {[0,36,72,108,144,180,216,252,288,324].map(a => <rect key={a} x="46" y="25" width="8" height="12" rx="2" transform={`rotate(${a} 50 50)`}/>)}
                  </g>
                </svg>
                {/* Small gear bottom-right */}
                <svg className="gear-a absolute" width="90" height="90" viewBox="0 0 100 100" style={{ bottom: '5%', right: '10%' }}>
                  <g fill="none" stroke="rgba(220,20,20,0.1)" strokeWidth="2.5">
                    <circle cx="50" cy="50" r="20"/><circle cx="50" cy="50" r="7"/>
                    {[0,45,90,135,180,225,270,315].map(a => <rect key={a} x="46" y="25" width="8" height="12" rx="2" transform={`rotate(${a} 50 50)`}/>)}
                  </g>
                </svg>
                {/* Tiny gear bottom-left */}
                <svg className="gear-b absolute" width="60" height="60" viewBox="0 0 100 100" style={{ bottom: '20%', left: '18%' }}>
                  <g fill="none" stroke="rgba(220,20,20,0.08)" strokeWidth="3">
                    <circle cx="50" cy="50" r="22"/><circle cx="50" cy="50" r="8"/>
                    {[0,60,120,180,240,300].map(a => <rect key={a} x="44" y="22" width="12" height="14" rx="3" transform={`rotate(${a} 50 50)`}/>)}
                  </g>
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

            {/* VERIFIZIERT — whole card turns green on hover */}
            <div data-testid="feature-card-verifiziert" className="feature-card verif-card group rounded-2xl p-10 sm:p-14 text-center cursor-default transition-all duration-400" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-16 h-16 mx-auto mb-7 rounded-xl flex items-center justify-center transition-all duration-400 group-hover:bg-green-500/20 group-hover:border-green-500/30" style={{ background: 'rgba(220,20,20,0.08)', border: '1px solid rgba(220,20,20,0.12)' }}>
                <ShieldCheck size={30} className="transition-colors duration-400 group-hover:text-green-400" style={{ color: '#dc1414' }} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight transition-colors duration-400 group-hover:text-green-300" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>Verifiziert</h3>
              <p className="text-[15px] text-white/45 leading-relaxed transition-colors duration-400 group-hover:text-green-200/60">Jedes Profil wird manuell geprüft. Echte Menschen, echte Bilder – garantiert.</p>
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

        /* PERFORMANCE — always-visible interlocking gears, spin on hover */
        @keyframes gear-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes gear-spin-rev { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        .gear-a { animation: gear-spin 20s linear infinite; }
        .gear-b { animation: gear-spin-rev 16s linear infinite; }
        .perf-card:hover .gear-a { animation-duration: 4s; }
        .perf-card:hover .gear-b { animation-duration: 3s; }

        /* VERIFIZIERT — full green on hover */
        .verif-card:hover {
          background: rgba(34,197,94,0.12) !important;
          border-color: rgba(34,197,94,0.35) !important;
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
