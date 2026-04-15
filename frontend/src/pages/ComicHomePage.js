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
  const nav = useNavigate();
  const [cities, setCities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [q, setQ] = useState('');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    api.get('/cities').then(r => setCities(r.data)).catch(() => {});
    api.get('/regions').then(r => setRegions(r.data)).catch(() => {});
    const h = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const search = (e) => {
    e.preventDefault();
    if (q) {
      const c = cities.find(c => c.name.toLowerCase().includes(q.toLowerCase()));
      if (c) nav(`/stadte/${c.slug}`); else nav(`/browse?search=${q}`);
    }
  };

  return (
    <div style={{ background: '#060606', minHeight: '100vh' }}>
      <SEOHead title="NRW Treff – Diskrete Kontakte in NRW" description="Finde diskrete Kontakte in deiner Stadt." canonical="/" />
      <AgeVerificationModal />
      <Header cities={cities} regions={regions} />

      {/* ══════ HERO — Original photo, no darkening ══════ */}
      <div className="relative overflow-hidden" style={{ minHeight: '95vh', background: '#060606' }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${B}/api/uploads/hero-v7-opt.jpg)`,
          backgroundSize: 'cover', backgroundPosition: 'center 40%',
          transform: `scale(1.04) translateY(${scrollY * 0.08}px)`,
        }} />
        {/* Only a gentle bottom fade for readability */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(6,6,6,0.92) 100%)' }} />

        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-56 sm:pt-68 lg:pt-80 pb-20 sm:pb-28 text-center z-10">
          <h1 data-testid="hero-headline" className="mb-9 leading-[0.92]" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="block text-[3rem] sm:text-[4.2rem] lg:text-[5.5rem] font-bold italic tracking-tight" style={{ color: '#fff' }}>
              Wo bist du,
            </span>
            <span className="block text-[3.8rem] sm:text-[5.2rem] lg:text-[6.8rem] font-bold italic tracking-tight" style={{
              color: '#dc1414',
              textShadow: '0 0 40px rgba(220,20,20,0.35), 0 2px 0 rgba(0,0,0,0.5)',
            }}>
              Süßer?
            </span>
          </h1>
          <form onSubmit={search} data-testid="hero-search-form">
            <div className="relative max-w-lg mx-auto flex items-center rounded-full overflow-hidden hero-search" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
              <MapPin className="absolute left-4 pointer-events-none" size={16} style={{ color: 'rgba(255,255,255,0.35)' }} />
              <input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Stadt eingeben" data-testid="hero-search-input"
                className="flex-1 pl-11 pr-2 py-4 sm:py-[18px] bg-transparent text-[15px] tracking-wide focus:outline-none" style={{ color: '#e8e8e8', caretColor: '#dc1414' }} />
              <button type="submit" data-testid="hero-search-button" className="neon-btn flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 m-1.5 rounded-full text-[13px] font-bold tracking-[0.08em] uppercase">
                <Search size={14} /> Suche
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ══════ FEATURES ══════ */}
      <div className="relative py-20 sm:py-28 overflow-hidden" data-testid="features-section">
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${B}/api/uploads/cards-bg-v2-opt.jpg)`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.15, filter: 'brightness(0.5) contrast(1.3)',
        }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #060606 0%, rgba(6,6,6,0.6) 15%, rgba(6,6,6,0.6) 85%, #060606 100%)' }} />

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

            {/* PERFORMANCE — speedometer animation */}
            <div data-testid="feature-card-performance" className="feature-card perf-card group rounded-2xl p-10 sm:p-14 text-center cursor-default relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="perf-bg absolute inset-0 pointer-events-none" />
              {/* Animated speed lines on hover */}
              <div className="perf-lines absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="speed-line" style={{ top: '20%', animationDelay: '0s' }} />
                <div className="speed-line" style={{ top: '35%', animationDelay: '0.15s' }} />
                <div className="speed-line" style={{ top: '50%', animationDelay: '0.3s' }} />
                <div className="speed-line" style={{ top: '65%', animationDelay: '0.45s' }} />
                <div className="speed-line" style={{ top: '80%', animationDelay: '0.6s' }} />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-7 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ background: 'rgba(220,20,20,0.08)', border: '1px solid rgba(220,20,20,0.12)' }}>
                  <Zap size={30} className="group-hover:text-yellow-400 transition-colors duration-300" style={{ color: '#dc1414' }} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>Performance</h3>
                <p className="text-[15px] text-white/45 leading-relaxed">Blitzschnelle Ladezeiten, optimiert für jedes Gerät. Finde sofort, was du suchst.</p>
              </div>
            </div>

            {/* VERIFIZIERT — vivid green */}
            <div data-testid="feature-card-verifiziert" className="feature-card verif-card group rounded-2xl p-10 sm:p-14 text-center cursor-default transition-all duration-500" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-16 h-16 mx-auto mb-7 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:bg-white/20" style={{ background: 'rgba(220,20,20,0.08)', border: '1px solid rgba(220,20,20,0.12)' }}>
                <ShieldCheck size={30} className="transition-colors duration-500 group-hover:text-white" style={{ color: '#dc1414' }} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 transition-colors duration-500 group-hover:text-white" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>Verifiziert</h3>
              <p className="text-[15px] text-white/45 leading-relaxed transition-colors duration-500 group-hover:text-white/80">Jedes Profil wird manuell geprüft. Echte Menschen, echte Bilder – garantiert.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ PHILOSOPHIE — immersive ══════ */}
      <div className="relative py-24 sm:py-32 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(220,20,20,0.04) 0%, transparent 70%)' }} />

        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase" style={{ border: '1px solid rgba(220,20,20,0.2)', color: 'rgba(220,20,20,0.6)' }}>
            Wofür wir stehen
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-8 tracking-tight leading-[1.05]" style={{ fontFamily: 'Oswald, sans-serif' }}>
            <span style={{ color: '#f0f0f0' }}>Unsere </span>
            <span style={{ color: '#dc1414' }}>Philosophie</span>
          </h2>
          <p className="text-[17px] sm:text-[19px] text-white/50 leading-[1.9] max-w-2xl mx-auto mb-12">
            Eine minimalistische Plattform, die echte Kontakte ermöglicht und Zeit spart.
            Unser Ziel: <span className="text-white/70 font-medium">die Mädels entlasten</span> und Nutzern ein besseres Erlebnis bieten – ohne Fake-Anzeigen, ohne Umwege.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { val: 'Ehrlich', desc: 'Offene Einstellung gegenüber Sex und Erotik. Ohne Tabus.' },
              { val: 'Direkt', desc: 'Einfachere Kontaktmöglichkeit. Kein Umweg, kein Zeitverlust.' },
              { val: 'Sicher', desc: 'Fakeanzeigen eindämmen. Geprüfte Profile für mehr Vertrauen.' },
            ].map(item => (
              <div key={item.val} className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="text-2xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif', color: '#dc1414' }}>{item.val}</div>
                <p className="text-[14px] text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        .hero-search:focus-within { border-color: rgba(220,20,20,0.3) !important; box-shadow: 0 0 24px rgba(220,20,20,0.08); }
        .neon-btn { background: rgba(220,20,20,0.15); color: #dc1414; border: 1px solid rgba(220,20,20,0.3); transition: all 0.25s; }
        .neon-btn:hover { background: #dc1414; color: #fff; box-shadow: 0 0 24px rgba(220,20,20,0.4); }
        .diskret-card .diskret-inner { filter: blur(4px); }
        .diskret-card:hover .diskret-inner { filter: blur(0px); }

        /* PERFORMANCE — gear tile + speed lines */
        .perf-bg {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='rgba(220,20,20,0.07)' stroke-width='1.5'%3E%3Ccircle cx='50' cy='50' r='16'/%3E%3Ccircle cx='50' cy='50' r='7'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(0 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(45 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(90 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(135 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(180 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(225 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(270 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(315 50 50)'/%3E%3C/g%3E%3C/svg%3E");
          background-size: 60px 60px;
        }
        .perf-card:hover .perf-bg {
          animation: gear-move 12s linear infinite;
        }
        @keyframes gear-move {
          from { background-position: 0 0; }
          to { background-position: 600px 600px; }
        }
        .speed-line {
          position: absolute;
          left: -20%;
          height: 2px;
          width: 40%;
          background: linear-gradient(90deg, transparent, rgba(220,20,20,0.25), transparent);
          animation: speed-dash 0.8s ease-out infinite;
        }
        @keyframes speed-dash {
          0% { left: -40%; opacity: 0; }
          30% { opacity: 1; }
          100% { left: 120%; opacity: 0; }
        }

        /* VERIFIZIERT — vivid green */
        .verif-card { position: relative; overflow: hidden; }
        .verif-card::before {
          content: ''; position: absolute; inset: 0;
          background: #16a34a;
          opacity: 0; transition: opacity 0.5s;
        }
        .verif-card:hover::before { opacity: 1; }
        .verif-card:hover { border-color: #16a34a !important; }
        .verif-card > * { position: relative; z-index: 1; }

        .feature-card { transition: transform 0.3s, border-color 0.3s; }
        .feature-card:hover { transform: translateY(-4px); }
      `}</style>
    </div>
  );
}
