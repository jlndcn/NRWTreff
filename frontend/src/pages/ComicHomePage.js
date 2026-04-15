import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Shield, Zap, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import AgeVerificationModal from '../components/AgeVerificationModal';
import api from '../utils/api';

const B = process.env.REACT_APP_BACKEND_URL;

export default function ComicHomePage() {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    api.get('/cities').then(r => setCities(r.data)).catch(() => {});
    api.get('/regions').then(r => setRegions(r.data)).catch(() => {});
    const h = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
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

      {/* ══════ HERO — 80% opacity, content 30% lower ══════ */}
      <div className="relative overflow-hidden" style={{ minHeight: '95vh', background: '#060606' }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${B}/api/uploads/hero-v7-opt.jpg)`,
          backgroundSize: 'cover', backgroundPosition: 'center 40%',
          opacity: 0.8, filter: 'brightness(0.45) contrast(1.2) saturate(1.15)',
          transform: `scale(1.06) translateY(${scrollY * 0.1}px)`,
        }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 50%, transparent 0%, #060606 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(6,6,6,0.2) 0%, transparent 30%, rgba(6,6,6,0.95) 100%)' }} />

        {/* Content pushed 30% lower: pt increased significantly */}
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-52 sm:pt-64 lg:pt-72 pb-20 sm:pb-28 text-center z-10">
          <h1 data-testid="hero-headline" className="mb-8 leading-[0.95]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            <span className="block text-[3.2rem] sm:text-[4.5rem] lg:text-[5.8rem] font-bold tracking-tight" style={{ color: '#e8e8e8' }}>Wo bist du,</span>
            <span className="block text-[4rem] sm:text-[5.5rem] lg:text-[7rem] font-bold tracking-tight" style={{ color: '#dc1414', textShadow: '0 0 60px rgba(220,20,20,0.25)' }}>Süßer?</span>
          </h1>
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

      {/* ══════ FEATURES — new background photo ══════ */}
      <div className="relative py-20 sm:py-28 overflow-hidden" data-testid="features-section">
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${B}/api/uploads/cards-bg-v2-opt.jpg)`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.15, filter: 'brightness(0.5) contrast(1.3) saturate(0.8)',
        }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #060606 0%, rgba(6,6,6,0.65) 15%, rgba(6,6,6,0.65) 85%, #060606 100%)' }} />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">

            {/* DISKRET */}
            <div data-testid="feature-card-diskret" className="feature-card diskret-card group rounded-2xl p-10 sm:p-14 text-center cursor-default" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="diskret-inner transition-all duration-500">
                <div className="w-16 h-16 mx-auto mb-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(220,20,20,0.08)', border: '1px solid rgba(220,20,20,0.12)' }}>
                  <Shield size={30} style={{ color: '#dc1414' }} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>Diskret</h3>
                <p className="text-[15px] text-white/45 leading-relaxed">Deine Privatsphäre steht an erster Stelle. Verschlüsselte Kommunikation, keine Spuren.</p>
              </div>
            </div>

            {/* PERFORMANCE — full gear pattern fill */}
            <div data-testid="feature-card-performance" className="feature-card perf-card group rounded-2xl p-10 sm:p-14 text-center cursor-default relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="gear-pattern absolute inset-0 pointer-events-none" />
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(220,20,20,0.08)', border: '1px solid rgba(220,20,20,0.12)' }}>
                  <Zap size={30} style={{ color: '#dc1414' }} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>Performance</h3>
                <p className="text-[15px] text-white/45 leading-relaxed">Blitzschnelle Ladezeiten, optimiert für jedes Gerät. Finde sofort, was du suchst.</p>
              </div>
            </div>

            {/* VERIFIZIERT — full green gradient on hover */}
            <div data-testid="feature-card-verifiziert" className="feature-card verif-card group rounded-2xl p-10 sm:p-14 text-center cursor-default transition-all duration-500" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-16 h-16 mx-auto mb-7 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:bg-green-500/20 group-hover:border-green-500/30" style={{ background: 'rgba(220,20,20,0.08)', border: '1px solid rgba(220,20,20,0.12)' }}>
                <ShieldCheck size={30} className="transition-colors duration-500 group-hover:text-green-300" style={{ color: '#dc1414' }} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 transition-colors duration-500 group-hover:text-green-200" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>Verifiziert</h3>
              <p className="text-[15px] text-white/45 leading-relaxed transition-colors duration-500 group-hover:text-green-200/60">Jedes Profil wird manuell geprüft. Echte Menschen, echte Bilder – garantiert.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ PHILOSOPHY SECTION ══════ */}
      <div className="py-16 sm:py-24" style={{ background: '#060606' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>
            Unsere <span style={{ color: '#dc1414' }}>Philosophie</span>
          </h2>
          <p className="text-[16px] sm:text-[17px] text-white/50 leading-[1.8] max-w-2xl mx-auto">
            Wir glauben an eine minimalistische, einfache Plattform, die echte Kontaktmöglichkeiten schafft und Zeit spart.
            Unser oberstes Ziel: die Mädels entlasten und Nutzern ein besseres Erlebnis bieten – ohne Fake-Anzeigen und ohne unnötigen Aufwand.
            Wir stehen für eine offene Einstellung gegenüber Sex und Erotik. Direkt, ehrlich, unkompliziert.
          </p>
        </div>
      </div>

      <Footer />

      <style>{`
        .hero-search:focus-within { border-color: rgba(220,20,20,0.25) !important; box-shadow: 0 0 24px rgba(220,20,20,0.06); }
        .neon-btn { background: rgba(220,20,20,0.12); color: #dc1414; border: 1px solid rgba(220,20,20,0.25); transition: all 0.25s; }
        .neon-btn:hover { background: #dc1414; color: #fff; box-shadow: 0 0 24px rgba(220,20,20,0.35); }
        .diskret-card .diskret-inner { filter: blur(4px); }
        .diskret-card:hover .diskret-inner { filter: blur(0px); }

        /* PERFORMANCE — SVG gear pattern fills entire card */
        .gear-pattern {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='rgba(220,20,20,0.1)' stroke-width='2'%3E%3Ccircle cx='50' cy='50' r='18'/%3E%3Ccircle cx='50' cy='50' r='8'/%3E%3Crect x='46' y='26' width='8' height='11' rx='2' transform='rotate(0 50 50)'/%3E%3Crect x='46' y='26' width='8' height='11' rx='2' transform='rotate(45 50 50)'/%3E%3Crect x='46' y='26' width='8' height='11' rx='2' transform='rotate(90 50 50)'/%3E%3Crect x='46' y='26' width='8' height='11' rx='2' transform='rotate(135 50 50)'/%3E%3Crect x='46' y='26' width='8' height='11' rx='2' transform='rotate(180 50 50)'/%3E%3Crect x='46' y='26' width='8' height='11' rx='2' transform='rotate(225 50 50)'/%3E%3Crect x='46' y='26' width='8' height='11' rx='2' transform='rotate(270 50 50)'/%3E%3Crect x='46' y='26' width='8' height='11' rx='2' transform='rotate(315 50 50)'/%3E%3C/g%3E%3C/svg%3E");
          background-size: 80px 80px;
          transition: transform 0s linear;
        }
        .perf-card:hover .gear-pattern {
          animation: gear-rotate 20s linear infinite;
        }
        @keyframes gear-rotate {
          from { background-position: 0 0; }
          to { background-position: 800px 800px; }
        }

        /* VERIFIZIERT — full green fill with gradient sweep */
        .verif-card { position: relative; overflow: hidden; }
        .verif-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(34,197,94,0.25) 0%, rgba(16,185,80,0.15) 50%, rgba(34,197,94,0.25) 100%);
          opacity: 0;
          transition: opacity 0.5s;
        }
        .verif-card:hover::before { opacity: 1; }
        .verif-card:hover { border-color: rgba(34,197,94,0.4) !important; }

        .feature-card { transition: transform 0.3s, border-color 0.3s; }
        .feature-card:hover { transform: translateY(-4px); }
      `}</style>
    </div>
  );
}
