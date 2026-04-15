import React, { useEffect, useState, useCallback, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Shield, Zap, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import AgeVerificationModal from '../components/AgeVerificationModal';
import api from '../utils/api';

const B = process.env.REACT_APP_BACKEND_URL;

const FeatureCard = memo(({ testId, className, style, children }) => (
  <div data-testid={testId} className={`feature-card ${className}`} style={style}>{children}</div>
));
FeatureCard.displayName = 'FeatureCard';

export default function ComicHomePage() {
  const nav = useNavigate();
  const [cities, setCities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [q, setQ] = useState('');
  const heroRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    api.get('/cities').then(r => setCities(r.data)).catch(() => {});
    api.get('/regions').then(r => setRegions(r.data)).catch(() => {});

    // Throttled parallax via RAF
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        if (heroRef.current) {
          heroRef.current.style.transform = `scale(1.03) translateY(${window.scrollY * 0.06}px)`;
        }
        rafRef.current = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const search = useCallback((e) => {
    e.preventDefault();
    if (!q) return;
    const c = cities.find(c => c.name.toLowerCase().includes(q.toLowerCase()));
    nav(c ? `/stadte/${c.slug}` : `/browse?search=${q}`);
  }, [q, cities, nav]);

  return (
    <div className="page-root">
      <SEOHead title="NRW Treff – Diskrete Kontakte in NRW" description="Finde diskrete Kontakte in deiner Stadt." />
      <AgeVerificationModal />
      <Header cities={cities} regions={regions} />

      {/* ══════ HERO ══════ */}
      <section className="hero-section" aria-label="Hero">
        <div ref={heroRef} className="hero-bg" style={{ backgroundImage: `url(${B}/api/uploads/hero-v13-opt.jpg)` }} />
        <div className="hero-fade" />
        <div className="hero-content">
          <h1 data-testid="hero-headline" className="neon-headline">
            <span className="neon-line-1">WO BIST DU,</span>
            <span className="neon-line-2">SÜSSER?</span>
          </h1>
          <form onSubmit={search} data-testid="hero-search-form" className="hero-search-wrap">
            <div className="hero-search">
              <MapPin className="search-icon" size={16} />
              <input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Stadt eingeben" data-testid="hero-search-input" className="search-input" />
              <button type="submit" data-testid="hero-search-button" className="search-btn">
                <Search size={14} /> Suche
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ══════ BELOW HERO — shared bg ══════ */}
      <div className="below-hero">
        <div className="below-hero-bg" style={{ backgroundImage: `url(${B}/api/uploads/manifest-bg-opt.jpg)` }} />
        <div className="below-hero-overlay" />

        {/* Features */}
        <section className="features-section" data-testid="features-section" aria-label="Features">
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <FeatureCard testId="feature-card-diskret" className="diskret-card group rounded-2xl p-10 sm:p-12 text-center cursor-default" style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)' }}>
                <div className="diskret-inner">
                  <div className="card-icon"><Shield size={28} /></div>
                  <h3 className="card-title">Diskret</h3>
                  <p className="card-desc">Deine Privatsphäre steht an erster Stelle. Keine Spuren, keine Kompromisse.</p>
                </div>
              </FeatureCard>

              <FeatureCard testId="feature-card-performance" className="perf-card group rounded-2xl p-10 sm:p-12 text-center cursor-default relative overflow-hidden" style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)' }}>
                <div className="perf-bg" />
                <div className="perf-lines">
                  {[18, 33, 48, 63, 78].map((top, i) => (
                    <div key={i} className="speed-line" style={{ top: `${top}%`, animationDelay: `${i * 0.12}s` }} />
                  ))}
                </div>
                <div className="relative z-10">
                  <div className="card-icon perf-icon"><Zap size={28} /></div>
                  <h3 className="card-title">Performance</h3>
                  <p className="card-desc">Blitzschnell, optimiert für jedes Gerät. Finde sofort, was du suchst.</p>
                </div>
              </FeatureCard>

              <FeatureCard testId="feature-card-verifiziert" className="verif-card group rounded-2xl p-10 sm:p-12 text-center cursor-default" style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)' }}>
                <div className="card-icon verif-icon"><ShieldCheck size={28} /></div>
                <h3 className="card-title verif-title">Verifiziert</h3>
                <p className="card-desc verif-desc">Jedes Profil wird manuell geprüft. Echte Menschen, echte Bilder.</p>
              </FeatureCard>
            </div>
          </div>
        </section>

        {/* Manifest */}
        <section className="manifest-section" aria-label="Manifest">
          <div className="max-w-[1100px] mx-auto px-6 sm:px-10">
            <div className="max-w-2xl">
              <div className="manifest-tag">Ein offenes Wort</div>
              <h2 className="manifest-heading">Was wir tun.<br /><span>Warum wir es tun.</span></h2>
              <div className="manifest-body">
                <p>Wir betreiben eine Plattform, die <strong>einfach funktioniert</strong>. Kein Chaos, keine Fake-Profile, keine endlosen Klicks. Nur eine saubere Seite, die zusammenbringt, was zusammengehört.</p>
                <p>Wir machen das, weil wir es leid waren zu sehen, wie viel Zeit auf beiden Seiten verschwendet wird. <strong>NRWTreff ist gebaut, um zu entlasten.</strong> Weniger Stress, mehr Klarheit, direkter Kontakt.</p>
                <p>Wir stehen für eine <strong>offene Einstellung</strong>. Sex und Erotik sind Teil des Lebens. Kein Tabu, kein Urteil – nur Respekt. Jede Person, die hier inseriert, wird von uns persönlich geprüft.</p>
                <p className="manifest-closing">Das ist unser Versprechen. Nicht mehr, nicht weniger.</p>
              </div>
              <div className="manifest-sig">— Team NRWTreff</div>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      <style>{`
        .page-root { background: #050505; min-height: 100vh; }

        /* HERO */
        .hero-section { position: relative; overflow: hidden; min-height: 100vh; background: #050505; }
        .hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center 30%; will-change: transform; transform: scale(1.03); }
        .hero-fade { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(5,5,5,0.1) 0%, rgba(5,5,5,0) 20%, rgba(5,5,5,0) 45%, rgba(5,5,5,0.4) 65%, rgba(5,5,5,0.85) 80%, rgba(5,5,5,1) 100%); }
        .hero-content { position: relative; z-index: 10; max-width: 48rem; margin: 0 auto; padding: 14rem 1.5rem 10rem; text-align: center; }
        @media (min-width: 640px) { .hero-content { padding-top: 16rem; } }
        @media (min-width: 1024px) { .hero-content { padding-top: 18rem; } }

        /* Headline */
        .neon-headline { margin-bottom: 2.5rem; line-height: 0.92; }
        .neon-line-1 { display: block; font-family: Oswald, sans-serif; font-weight: 700; font-size: clamp(3rem, 8vw, 5.5rem); color: #fff; text-shadow: 0 0 8px rgba(255,255,255,0.3), 0 0 25px rgba(255,255,255,0.1); letter-spacing: 0.04em; margin-bottom: 0.1em; }
        .neon-line-2 { display: block; font-family: Oswald, sans-serif; font-weight: 700; font-size: clamp(4rem, 11vw, 7.5rem); color: #dc1414; letter-spacing: 0.02em; text-shadow: 0 0 8px rgba(220,20,20,0.4), 0 0 25px rgba(220,20,20,0.25), 0 0 50px rgba(220,20,20,0.12); animation: neon-flicker 5s ease-in-out infinite; }
        @keyframes neon-flicker { 0%,100% { opacity:1; } 93% { opacity:1; } 94% { opacity:0.82; } 95% { opacity:1; } 97% { opacity:0.9; } 98% { opacity:1; } }

        /* Search */
        .hero-search-wrap { max-width: 32rem; margin: 0 auto; }
        .hero-search { position: relative; display: flex; align-items: center; border-radius: 9999px; overflow: hidden; background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(12px); transition: border-color 0.2s, box-shadow 0.2s; }
        .hero-search:focus-within { border-color: rgba(220,20,20,0.25); box-shadow: 0 0 20px rgba(220,20,20,0.06); }
        .search-icon { position: absolute; left: 1.25rem; color: rgba(255,255,255,0.3); pointer-events: none; }
        .search-input { flex: 1; padding: 18px 0.5rem 18px 3rem; background: transparent; font-size: 15px; letter-spacing: 0.03em; color: #e0e0e0; caret-color: #dc1414; outline: none; font-family: Inter, sans-serif; border: none; }
        .search-btn { display: flex; align-items: center; gap: 8px; padding: 12px 24px; margin: 6px; border-radius: 9999px; font-size: 13px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; font-family: Inter, sans-serif; background: rgba(220,20,20,0.12); color: #dc1414; border: 1px solid rgba(220,20,20,0.25); cursor: pointer; transition: all 0.25s; }
        .search-btn:hover { background: #dc1414; color: #fff; box-shadow: 0 0 20px rgba(220,20,20,0.35); }

        /* Below hero */
        .below-hero { position: relative; }
        .below-hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; background-repeat: no-repeat; background-attachment: fixed; }
        .below-hero-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.88); }
        @media (max-width: 768px) { .below-hero-bg { background-attachment: scroll; } }

        /* Features */
        .features-section { position: relative; z-index: 10; padding: 6rem 0 5rem; }
        @media (min-width: 640px) { .features-section { padding: 8rem 0 7rem; } }

        .card-icon { width: 56px; height: 56px; margin: 0 auto 1.5rem; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: rgba(220,20,20,0.1); border: 1px solid rgba(220,20,20,0.15); color: #dc1414; }
        .card-title { font-family: Oswald, sans-serif; font-size: 1.5rem; font-weight: 700; color: #f0f0f0; margin-bottom: 0.75rem; }
        .card-desc { font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.45); font-family: Inter, sans-serif; }

        .feature-card { transition: transform 0.3s, border-color 0.3s; }
        .feature-card:hover { transform: translateY(-3px); }

        /* Diskret */
        .diskret-card .diskret-inner { filter: blur(4px); transition: filter 0.5s; }
        .diskret-card:hover .diskret-inner { filter: blur(0); }

        /* Performance */
        .perf-bg { position: absolute; inset: 0; pointer-events: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='rgba(220,20,20,0.2)' stroke-width='1.8'%3E%3Ccircle cx='50' cy='50' r='16'/%3E%3Ccircle cx='50' cy='50' r='7'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(0 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(45 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(90 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(135 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(180 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(225 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(270 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(315 50 50)'/%3E%3C/g%3E%3C/svg%3E"); background-size: 60px 60px; }
        .perf-card:hover .perf-bg { animation: gear-move 10s linear infinite; }
        @keyframes gear-move { from { background-position: 0 0; } to { background-position: 600px 600px; } }
        .perf-lines { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity 0.3s; }
        .perf-card:hover .perf-lines { opacity: 1; }
        .speed-line { position: absolute; left: -20%; height: 3px; width: 45%; background: linear-gradient(90deg, transparent, rgba(255,60,60,0.5), transparent); animation: speed-dash 0.7s ease-out infinite; }
        @keyframes speed-dash { 0% { left: -45%; opacity: 0; } 30% { opacity: 1; } 100% { left: 120%; opacity: 0; } }
        .perf-icon { transition: transform 0.3s; }
        .perf-card:hover .perf-icon { transform: scale(1.1); }
        .perf-card:hover .perf-icon svg { color: #facc15; }

        /* Verifiziert */
        .verif-card { position: relative; overflow: hidden; transition: all 0.5s; }
        .verif-card::before { content: ''; position: absolute; inset: 0; background: #16a34a; opacity: 0; transition: opacity 0.5s; }
        .verif-card:hover::before { opacity: 1; }
        .verif-card:hover { border-color: #16a34a !important; }
        .verif-card > * { position: relative; z-index: 1; }
        .verif-card:hover .verif-icon { background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.3); }
        .verif-card:hover .verif-icon svg { color: #fff; }
        .verif-card:hover .verif-title { color: #fff; }
        .verif-card:hover .verif-desc { color: rgba(255,255,255,0.8); }
        .verif-icon { transition: all 0.5s; }
        .verif-title { transition: color 0.5s; }
        .verif-desc { transition: color 0.5s; }

        /* Manifest */
        .manifest-section { position: relative; z-index: 10; padding: 5rem 0 7rem; }
        @media (min-width: 640px) { .manifest-section { padding: 7rem 0 9rem; } }
        .manifest-tag { font-size: 11px; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(220,20,20,0.65); margin-bottom: 1.25rem; font-family: Inter, sans-serif; }
        .manifest-heading { font-family: Oswald, sans-serif; font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 700; color: #fff; line-height: 1.15; letter-spacing: -0.01em; margin-bottom: 2rem; }
        .manifest-heading span { color: #dc1414; }
        .manifest-body { font-family: Inter, sans-serif; font-size: 15px; line-height: 1.85; color: rgba(255,255,255,0.65); }
        .manifest-body p { margin-bottom: 1.25rem; }
        .manifest-body strong { color: rgba(255,255,255,0.9); font-weight: 500; }
        .manifest-closing { font-size: 13px; color: rgba(255,255,255,0.35); }
        .manifest-sig { margin-top: 2rem; padding-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.07); font-size: 12px; font-weight: 600; letter-spacing: 0.08em; color: rgba(220,20,20,0.5); font-family: Inter, sans-serif; }
      `}</style>
    </div>
  );
}
