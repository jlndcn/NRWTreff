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
    <div style={{ background: '#050505', minHeight: '100vh' }}>
      <SEOHead title="NRW Treff – Diskrete Kontakte in NRW" description="Finde diskrete Kontakte in deiner Stadt." />
      <AgeVerificationModal />
      <Header cities={cities} regions={regions} />

      {/* ══════ HERO ══════ */}
      <div className="relative overflow-hidden" style={{ minHeight: '100vh', background: '#050505' }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${B}/api/uploads/hero-v13-opt.jpg)`,
          backgroundSize: 'cover', backgroundPosition: 'center 30%',
          transform: `scale(1.03) translateY(${scrollY * 0.06}px)`,
        }} />
        {/* Smooth gradient fade into next section — long transition zone */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(5,5,5,0.1) 0%, rgba(5,5,5,0) 20%, rgba(5,5,5,0) 45%, rgba(5,5,5,0.4) 65%, rgba(5,5,5,0.85) 80%, rgba(5,5,5,1) 100%)'
        }} />

        <div className="relative max-w-3xl mx-auto px-6 sm:px-8 pt-48 sm:pt-56 lg:pt-64 pb-32 sm:pb-40 text-center z-10">
          <h1 data-testid="hero-headline" className="neon-headline mb-10">
            <span className="neon-line-1">Wo bist du,</span>
            <span className="neon-line-2">Süsser?</span>
          </h1>
          <form onSubmit={search} data-testid="hero-search-form">
            <div className="relative max-w-lg mx-auto flex items-center rounded-full overflow-hidden hero-search" style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}>
              <MapPin className="absolute left-5 pointer-events-none" size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />
              <input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Stadt eingeben" data-testid="hero-search-input"
                className="flex-1 pl-12 pr-2 py-[18px] bg-transparent text-[15px] tracking-wide focus:outline-none" style={{ color: '#e0e0e0', caretColor: '#dc1414', fontFamily: 'Inter, sans-serif' }} />
              <button type="submit" data-testid="hero-search-button" className="neon-btn flex items-center gap-2 px-6 py-3 m-1.5 rounded-full text-[13px] font-semibold tracking-[0.06em] uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Search size={14} /> Suche
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ══════ ALL SECTIONS BELOW — shared bg with smooth entry ══════ */}
      <div className="relative">
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${B}/api/uploads/manifest-bg-opt.jpg)`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed',
        }} />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.78)' }} />

        {/* ── FEATURES ── */}
        <div className="relative pt-24 sm:pt-32 pb-20 sm:pb-28 z-10" data-testid="features-section">
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div data-testid="feature-card-diskret" className="feature-card diskret-card group rounded-2xl p-10 sm:p-12 text-center cursor-default" style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)' }}>
                <div className="diskret-inner transition-all duration-500">
                  <div className="w-14 h-14 mx-auto mb-6 rounded-xl flex items-center justify-center" style={{ background: 'rgba(220,20,20,0.1)', border: '1px solid rgba(220,20,20,0.15)' }}>
                    <Shield size={28} style={{ color: '#dc1414' }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>Diskret</h3>
                  <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter, sans-serif' }}>Deine Privatsphäre steht an erster Stelle. Keine Spuren, keine Kompromisse.</p>
                </div>
              </div>

              <div data-testid="feature-card-performance" className="feature-card perf-card group rounded-2xl p-10 sm:p-12 text-center cursor-default relative overflow-hidden" style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)' }}>
                <div className="perf-bg absolute inset-0 pointer-events-none" />
                <div className="perf-lines absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="speed-line" style={{ top: '18%', animationDelay: '0s' }} />
                  <div className="speed-line" style={{ top: '33%', animationDelay: '0.12s' }} />
                  <div className="speed-line" style={{ top: '48%', animationDelay: '0.24s' }} />
                  <div className="speed-line" style={{ top: '63%', animationDelay: '0.36s' }} />
                  <div className="speed-line" style={{ top: '78%', animationDelay: '0.48s' }} />
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 mx-auto mb-6 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ background: 'rgba(220,20,20,0.1)', border: '1px solid rgba(220,20,20,0.15)' }}>
                    <Zap size={28} className="group-hover:text-yellow-400 transition-colors duration-300" style={{ color: '#dc1414' }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>Performance</h3>
                  <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter, sans-serif' }}>Blitzschnell, optimiert für jedes Gerät. Finde sofort, was du suchst.</p>
                </div>
              </div>

              <div data-testid="feature-card-verifiziert" className="feature-card verif-card group rounded-2xl p-10 sm:p-12 text-center cursor-default transition-all duration-500" style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)' }}>
                <div className="w-14 h-14 mx-auto mb-6 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:bg-white/20" style={{ background: 'rgba(220,20,20,0.1)', border: '1px solid rgba(220,20,20,0.15)' }}>
                  <ShieldCheck size={28} className="transition-colors duration-500 group-hover:text-white" style={{ color: '#dc1414' }} />
                </div>
                <h3 className="text-2xl font-bold mb-3 transition-colors duration-500 group-hover:text-white" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>Verifiziert</h3>
                <p className="text-[14px] leading-relaxed transition-colors duration-500 group-hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter, sans-serif' }}>Jedes Profil wird manuell geprüft. Echte Menschen, echte Bilder.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── MANIFEST ── */}
        <div className="relative z-10 py-20 sm:py-28">
          <div className="max-w-[1100px] mx-auto px-6 sm:px-10">
            <div className="max-w-2xl">
              <div className="mb-5 text-[11px] font-semibold tracking-[0.25em] uppercase" style={{ color: 'rgba(220,20,20,0.65)', fontFamily: 'Inter, sans-serif' }}>
                Ein offenes Wort
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.8rem] font-bold mb-8 leading-[1.15] tracking-tight" style={{ fontFamily: 'Oswald, sans-serif', color: '#fff' }}>
                Was wir tun.<br />
                <span style={{ color: '#dc1414' }}>Warum wir es tun.</span>
              </h2>
              <div className="space-y-5 text-[15px] leading-[1.85]" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter, sans-serif' }}>
                <p>
                  Wir betreiben eine Plattform, die <span className="text-white/90 font-medium">einfach funktioniert</span>.
                  Kein Chaos, keine Fake-Profile, keine endlosen Klicks. Nur eine saubere Seite,
                  die zusammenbringt, was zusammengehört.
                </p>
                <p>
                  Wir machen das, weil wir es leid waren zu sehen, wie viel Zeit und Nerven
                  auf beiden Seiten verschwendet werden.
                  <span className="text-white/90 font-medium"> NRWTreff ist gebaut, um zu entlasten.</span>
                  Weniger Stress, mehr Klarheit, direkter Kontakt.
                </p>
                <p>
                  Wir stehen für eine <span className="text-white/90 font-medium">offene Einstellung</span>.
                  Sex und Erotik sind Teil des Lebens. Kein Tabu, kein Urteil – nur Respekt.
                  Jede Person, die hier inseriert, wird von uns persönlich geprüft.
                </p>
                <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Das ist unser Versprechen. Nicht mehr, nicht weniger.
                </p>
              </div>
              <div className="mt-8 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-[12px] font-semibold tracking-[0.08em]" style={{ color: 'rgba(220,20,20,0.5)', fontFamily: 'Inter, sans-serif' }}>
                  — Team NRWTreff
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        /* ═══ GHETTO NEON SIGN ═══ */
        .neon-headline { text-align: center; line-height: 0.9; }
        .neon-line-1 {
          display: block;
          font-family: 'Bungee Shade', cursive;
          font-size: clamp(2.4rem, 7vw, 4.5rem);
          color: #fff;
          text-shadow:
            0 0 6px #fff,
            0 0 18px rgba(255,255,255,0.35),
            0 0 35px rgba(255,255,255,0.1);
          letter-spacing: 0.03em;
          margin-bottom: 0.15em;
        }
        .neon-line-2 {
          display: block;
          font-family: 'Bungee Shade', cursive;
          font-size: clamp(3.2rem, 10vw, 6.5rem);
          color: #ff1a1a;
          text-shadow:
            0 0 6px #ff1a1a,
            0 0 18px rgba(255,26,26,0.45),
            0 0 40px rgba(255,26,26,0.25),
            0 0 70px rgba(255,26,26,0.12);
          animation: neon-flicker 5s ease-in-out infinite;
        }
        @keyframes neon-flicker {
          0%, 100% { opacity: 1; }
          93% { opacity: 1; }
          94% { opacity: 0.82; }
          95% { opacity: 1; }
          97% { opacity: 0.9; }
          98% { opacity: 1; }
        }

        .hero-search:focus-within { border-color: rgba(220,20,20,0.25) !important; box-shadow: 0 0 20px rgba(220,20,20,0.06); }
        .neon-btn { background: rgba(220,20,20,0.12); color: #dc1414; border: 1px solid rgba(220,20,20,0.25); transition: all 0.25s; }
        .neon-btn:hover { background: #dc1414; color: #fff; box-shadow: 0 0 20px rgba(220,20,20,0.35); }

        .diskret-card .diskret-inner { filter: blur(4px); }
        .diskret-card:hover .diskret-inner { filter: blur(0px); }

        .perf-bg {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='rgba(220,20,20,0.2)' stroke-width='1.8'%3E%3Ccircle cx='50' cy='50' r='16'/%3E%3Ccircle cx='50' cy='50' r='7'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(0 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(45 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(90 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(135 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(180 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(225 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(270 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(315 50 50)'/%3E%3C/g%3E%3C/svg%3E");
          background-size: 60px 60px;
        }
        .perf-card:hover .perf-bg { animation: gear-move 10s linear infinite; }
        @keyframes gear-move { from { background-position: 0 0; } to { background-position: 600px 600px; } }
        .speed-line {
          position: absolute; left: -20%; height: 3px; width: 45%;
          background: linear-gradient(90deg, transparent, rgba(255,60,60,0.5), transparent);
          animation: speed-dash 0.7s ease-out infinite;
        }
        @keyframes speed-dash { 0% { left: -45%; opacity: 0; } 30% { opacity: 1; } 100% { left: 120%; opacity: 0; } }

        .verif-card { position: relative; overflow: hidden; }
        .verif-card::before { content: ''; position: absolute; inset: 0; background: #16a34a; opacity: 0; transition: opacity 0.5s; }
        .verif-card:hover::before { opacity: 1; }
        .verif-card:hover { border-color: #16a34a !important; }
        .verif-card > * { position: relative; z-index: 1; }

        .feature-card { transition: transform 0.3s, border-color 0.3s; }
        .feature-card:hover { transform: translateY(-3px); }

        @media (max-width: 768px) {
          [style*="background-attachment: fixed"] { background-attachment: scroll !important; }
        }
      `}</style>
    </div>
  );
}
