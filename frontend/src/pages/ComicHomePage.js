import React, { useEffect, useState, useCallback, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Shield, Zap, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import AgeVerificationModal from '../components/AgeVerificationModal';
import api from '../utils/api';

const B = process.env.REACT_APP_BACKEND_URL;

// IntersectionObserver hook for auto-triggering animations
function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.4 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

// Scroll progress (0..1) of element as it passes through the viewport.
// Starts LATER (when element top reaches 75% vh) and completes at 35% vh.
// Reverses automatically when user scrolls back up since rect.top increases.
function useScrollProgress(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = null;
    const compute = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const start = vh * 0.78;   // begin animation later
      const end = vh * 0.30;     // fully animated at 30% from top
      const raw = (start - rect.top) / (start - end);
      // Ease-in-out for more immersive feel
      let eased = Math.max(0, Math.min(1, raw));
      eased = eased < 0.5
        ? 2 * eased * eased
        : 1 - Math.pow(-2 * eased + 2, 2) / 2;
      setP(eased);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { compute(); raf = null; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    compute();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
  return p;
}

// Swipe indicator dots for mobile carousel
const SwipeDots = memo(({ target, count }) => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = document.querySelector(`[data-testid="${target}"]`);
    if (!el) return;
    const onScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const ratio = scrollLeft / (scrollWidth - clientWidth || 1);
      setActive(Math.round(ratio * (count - 1)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [target, count]);
  return (
    <div className="swipe-dots">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`swipe-dot ${i === active ? 'swipe-dot-active' : ''}`} />
      ))}
    </div>
  );
});
SwipeDots.displayName = 'SwipeDots';

// Pull-to-refresh
function usePullToRefresh() {
  const [pulling, setPulling] = useState(false);
  const [pullY, setPullY] = useState(0);
  const startY = useRef(0);
  const active = useRef(false);

  useEffect(() => {
    const onTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
        active.current = true;
      }
    };
    const onTouchMove = (e) => {
      if (!active.current) return;
      const diff = e.touches[0].clientY - startY.current;
      if (diff > 0 && diff < 120) {
        setPullY(diff);
        setPulling(true);
      }
    };
    const onTouchEnd = () => {
      if (pullY > 70) window.location.reload();
      setPullY(0);
      setPulling(false);
      active.current = false;
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  });
  return { pulling, pullY };
}

const DiskretCard = memo(() => {
  const ref = useRef(null);
  const p = useScrollProgress(ref);
  return (
    <div ref={ref} data-testid="feature-card-diskret" className="feature-card diskret-card group" style={{ '--p': p }}>
      <div className="diskret-inner">
        <div className="card-icon"><Shield size={26} /></div>
        <h3 className="card-title">Diskret</h3>
        <p className="card-desc">Deine Privatsphäre steht an erster Stelle. Keine Spuren, keine Kompromisse.</p>
      </div>
    </div>
  );
});
DiskretCard.displayName = 'DiskretCard';

const PerfCard = memo(() => {
  return (
    <div data-testid="feature-card-performance" className="feature-card perf-card group">
      <div className="perf-bg" />
      <div className="perf-lines">
        {[18, 33, 48, 63, 78].map((t, i) => <div key={i} className="speed-line" style={{ top: `${t}%`, animationDelay: `${i * 0.12}s` }} />)}
      </div>
      <div className="relative z-10">
        <div className="card-icon perf-icon"><Zap size={26} /></div>
        <h3 className="card-title">Performance</h3>
        <p className="card-desc">Blitzschnell, optimiert für jedes Gerät. Finde sofort, was du suchst.</p>
      </div>
    </div>
  );
});
PerfCard.displayName = 'PerfCard';

const VerifCard = memo(() => {
  const ref = useRef(null);
  const p = useScrollProgress(ref);
  return (
    <div ref={ref} data-testid="feature-card-verifiziert" className="feature-card verif-card group" style={{ '--p': p }}>
      <div className="card-icon verif-icon"><ShieldCheck size={26} /></div>
      <h3 className="card-title verif-title">Verifiziert</h3>
      <p className="card-desc verif-desc">Jedes Profil wird manuell geprüft. Echte Menschen, echte Bilder.</p>
    </div>
  );
});
VerifCard.displayName = 'VerifCard';

export default function ComicHomePage() {
  const nav = useNavigate();
  const [cities, setCities] = useState([]);
  const [q, setQ] = useState('');
  const heroRef = useRef(null);
  const rafRef = useRef(null);
  const { pulling, pullY } = usePullToRefresh();

  useEffect(() => {
    api.get('/cities').then(r => setCities(r.data)).catch(() => {});
    api.get('/regions').catch(() => {});
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        if (heroRef.current) heroRef.current.style.transform = `scale(1.03) translateY(${window.scrollY * 0.06}px)`;
        rafRef.current = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const search = useCallback((e) => {
    e.preventDefault();
    if (!q) return;
    const c = cities.find(c => c.name.toLowerCase().includes(q.toLowerCase()));
    nav(c ? `/stadte/${c.slug}` : `/browse?search=${q}`);
  }, [q, cities, nav]);

  return (
    <div className="page-root">
      {/* Pull-to-refresh indicator */}
      <div className="ptr-indicator" style={{ transform: `translateY(${pulling ? Math.min(pullY * 0.6, 60) : -60}px)`, opacity: pulling ? Math.min(pullY / 70, 1) : 0 }}>
        <div className="ptr-spinner" style={{ transform: `rotate(${pullY * 3}deg)` }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc1414" strokeWidth="2.5"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
        </div>
      </div>
      <SEOHead title="NRW Treff – Diskrete Kontakte in NRW" description="Finde diskrete Kontakte in deiner Stadt." />
      <AgeVerificationModal />
      <Header cities={cities} />

      {/* HERO */}
      <section className="hero-section">
        <div ref={heroRef} className="hero-bg" style={{ backgroundImage: `url(${B}/api/uploads/hero-v13-opt.jpg)` }} />
        <div className="hero-fade" />
        <div className="hero-content">
          <h1 data-testid="hero-headline" className="neon-headline">
            <img src={`${B}/api/uploads/lips-kiss.png`} alt="" className="hero-lips" aria-hidden="true" />
            <span className="neon-line-1">WO BIST DU,</span>
            <span className="neon-line-2">SÜSSER?</span>
          </h1>
          <form onSubmit={search} data-testid="hero-search-form" className="hero-search-wrap">
            <div className="hero-search">
              <MapPin className="search-icon" size={16} />
              <input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Stadt eingeben" data-testid="hero-search-input" className="search-input" />
              <button type="submit" data-testid="hero-search-button" className="search-btn"><Search size={14} /> <span className="search-btn-text">Suche</span></button>
            </div>
          </form>
        </div>
      </section>

      {/* BELOW HERO */}
      <div className="below-hero">
        <div className="below-hero-bg" style={{ backgroundImage: `url(${B}/api/uploads/manifest-bg-opt.jpg)` }} />
        <div className="below-hero-overlay" />

        <section className="features-section" data-testid="features-section">
          {/* Mobile: horizontal swipe carousel / Desktop: grid */}
          <div className="features-swipe" data-testid="features-swipe">
            <DiskretCard />
            <PerfCard />
            <VerifCard />
          </div>
          {/* Swipe indicator dots (mobile only) */}
          <SwipeDots target="features-swipe" count={3} />
        </section>

        <section className="manifest-section">
          <div className="manifest-inner">
            <div className="manifest-tag">Ein offenes Wort</div>
            <h2 className="manifest-heading">Was wir tun.<br /><span>Warum wir es tun.</span></h2>
            <div className="manifest-body">
              <p>Wir betreiben eine Plattform, die <strong>einfach funktioniert</strong>. Kein Chaos, keine Fake-Profile. Nur eine saubere Seite, die zusammenbringt, was zusammengehört.</p>
              <p>Wir machen das, weil wir es leid waren zu sehen, wie viel Zeit verschwendet wird. <strong>NRWTreff ist gebaut, um zu entlasten.</strong> Weniger Stress, direkter Kontakt.</p>
              <p>Wir stehen für eine <strong>offene Einstellung</strong>. Sex und Erotik sind Teil des Lebens. Kein Tabu, kein Urteil – nur Respekt.</p>
              <p className="manifest-closing">Das ist unser Versprechen. Nicht mehr, nicht weniger.</p>
            </div>
            <div className="manifest-sig">— Team NRWTreff</div>
          </div>
        </section>
      </div>

      <Footer />

      <style>{`
        .page-root { background: #050505; min-height: 100vh; }

        /* HERO */
        .hero-section { position: relative; overflow: hidden; min-height: 100vh; min-height: 100svh; background: #050505; }
        .hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center 30%; will-change: transform; transform: scale(1.03); }
        .hero-fade { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(5,5,5,0.1) 0%, transparent 20%, transparent 45%, rgba(5,5,5,0.4) 65%, rgba(5,5,5,0.85) 80%, #050505 100%); }
        .hero-content { position: relative; z-index: 10; max-width: 48rem; margin: 0 auto; padding: 10.8rem 1.25rem 6rem; text-align: center; }
        @media (min-width: 640px) { .hero-content { padding: 16rem 2rem 10rem; } }

        .neon-headline { position: relative; margin-bottom: 1.5rem; line-height: 0.88; }
        @media (min-width: 640px) { .neon-headline { margin-bottom: 2.5rem; line-height: 0.92; } }

        /* Lips kiss layer — positioned at the "DU SÜSSER" corner, behind the text */
        .hero-lips {
          position: absolute;
          z-index: 0;
          pointer-events: none;
          top: 2%;
          right: 2%;
          width: 54%;
          max-width: 272px;
          opacity: 0.75;
          transform: rotate(-12deg);
          filter: drop-shadow(0 0 24px rgba(220,20,20,0.55)) drop-shadow(0 0 48px rgba(220,20,20,0.25));
        }
        @media (min-width: 640px) { .hero-lips { width: 37%; max-width: 395px; top: 0%; right: 8%; opacity: 0.6; } }
        @media (min-width: 1024px) { .hero-lips { width: 29%; max-width: 420px; top: -2%; right: 5%; opacity: 0.55; } }

        .neon-line-1 { display: block; position: relative; z-index: 2; font-family: Oswald, sans-serif; font-weight: 700; font-size: clamp(2.2rem, 10vw, 5.5rem); color: #fff; text-shadow: 0 0 8px rgba(255,255,255,0.3), 0 0 25px rgba(255,255,255,0.1); letter-spacing: 0.04em; margin-bottom: 0.08em; }
        .neon-line-2 { display: block; position: relative; z-index: 2; font-family: Oswald, sans-serif; font-weight: 700; font-size: clamp(2.8rem, 13vw, 7.5rem); color: #dc1414; letter-spacing: 0.02em; text-shadow: 0 0 8px rgba(220,20,20,0.4), 0 0 25px rgba(220,20,20,0.25), 0 0 50px rgba(220,20,20,0.12); }

        .hero-search-wrap { max-width: 32rem; margin: 0 auto; }
        .hero-search { position: relative; display: flex; align-items: center; border-radius: 9999px; overflow: hidden; background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(12px); transition: border-color 0.2s, box-shadow 0.25s; }
        .hero-search:focus-within { border-color: rgba(220,20,20,0.25); }
        @media (max-width: 1023px) {
          .hero-search { background: rgba(0,0,0,0.55); border-color: rgba(220,20,20,0.18); box-shadow: 0 0 24px rgba(220,20,20,0.12), 0 0 48px rgba(220,20,20,0.06), 0 8px 24px rgba(0,0,0,0.4); }
          .hero-search:focus-within { border-color: rgba(220,20,20,0.55); box-shadow: 0 0 32px rgba(220,20,20,0.28), 0 0 64px rgba(220,20,20,0.12), 0 8px 24px rgba(0,0,0,0.5); }
        }
        .search-icon { position: absolute; left: 1rem; color: rgba(255,255,255,0.3); pointer-events: none; }
        @media (max-width: 1023px) { .search-icon { color: rgba(220,20,20,0.55); } }
        @media (min-width: 640px) { .search-icon { left: 1.25rem; } }
        .search-input { flex: 1; padding: 14px 0.5rem 14px 2.5rem; background: transparent; font-size: 14px; letter-spacing: 0.03em; color: #e0e0e0; caret-color: #dc1414; outline: none; font-family: Inter, sans-serif; border: none; }
        @media (max-width: 1023px) { .search-input { text-align: center; } .search-input::placeholder { color: rgba(255,255,255,0.35); } }
        @media (min-width: 640px) { .search-input { padding: 18px 0.5rem 18px 3rem; font-size: 15px; } }
        .search-btn { display: flex; align-items: center; gap: 6px; padding: 10px 16px; margin: 5px; border-radius: 9999px; font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; font-family: Inter, sans-serif; background: rgba(220,20,20,0.12); color: #dc1414; border: 1px solid rgba(220,20,20,0.25); cursor: pointer; transition: all 0.25s; white-space: nowrap; }
        @media (min-width: 640px) { .search-btn { padding: 12px 24px; font-size: 13px; margin: 6px; } }
        .search-btn:hover { background: #dc1414; color: #fff; }
        @media (max-width: 1023px) {
          .search-btn { width: 40px; height: 40px; padding: 0; margin: 5px; justify-content: center; background: #dc1414; color: #fff; border-color: #dc1414; box-shadow: 0 4px 14px rgba(220,20,20,0.4); flex-shrink: 0; }
          .search-btn:hover, .search-btn:active { background: #b71010; border-color: #b71010; }
          .search-btn .search-btn-text { display: none; }
          .search-btn svg { width: 18px; height: 18px; }
        }

        /* BELOW HERO */
        .below-hero { position: relative; }
        .below-hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; background-repeat: no-repeat; background-attachment: fixed; }
        .below-hero-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.88); }
        @media (max-width: 768px) { .below-hero-bg { background-attachment: scroll; } }

        /* FEATURES */
        .features-section { position: relative; z-index: 10; padding: 3.5rem 1.25rem; }
        @media (min-width: 640px) { .features-section { padding: 6rem 2rem 5rem; } }
        /* Cards: uniform spacing, stacked on mobile, 3-col grid on tablet+ */
        .features-swipe { max-width: 72rem; margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
        @media (min-width: 768px) { .features-swipe { grid-template-columns: repeat(3, 1fr); gap: 1.5rem; } }
        /* Hide swipe dots — we now use grid */
        .swipe-dots { display: none; }

        .feature-card { border-radius: 1rem; padding: 2rem; text-align: center; cursor: default; background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(10px); transition: transform 0.3s, border-color 0.3s; position: relative; overflow: hidden; }
        @media (min-width: 640px) { .feature-card { padding: 2.5rem 3rem; border-radius: 1.25rem; } }
        .feature-card:hover { transform: translateY(-3px); }

        .card-icon { width: 48px; height: 48px; margin: 0 auto 1.25rem; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: rgba(220,20,20,0.1); border: 1px solid rgba(220,20,20,0.15); color: #dc1414; }
        @media (min-width: 640px) { .card-icon { width: 56px; height: 56px; margin-bottom: 1.5rem; } }
        .card-title { font-family: Oswald, sans-serif; font-size: 1.25rem; font-weight: 700; color: #f0f0f0; margin-bottom: 0.5rem; }
        @media (min-width: 640px) { .card-title { font-size: 1.5rem; margin-bottom: 0.75rem; } }
        .card-desc { font-size: 13px; line-height: 1.65; color: rgba(255,255,255,0.55); font-family: Inter, sans-serif; }
        @media (min-width: 640px) { .card-desc { font-size: 14px; line-height: 1.7; } }

        /* DISKRET — scroll-linked: immersive reveal (blur + opacity + scale + slide) */
        .diskret-card .diskret-inner {
          filter: blur(calc((1 - var(--p, 0)) * 10px));
          opacity: calc(0.25 + var(--p, 0) * 0.75);
          transform: scale(calc(0.92 + var(--p, 0) * 0.08)) translateY(calc((1 - var(--p, 0)) * 16px));
          transition: filter 0.25s ease-out, opacity 0.25s ease-out, transform 0.25s ease-out;
        }
        .diskret-card {
          border-color: rgba(255,255,255, calc(0.04 + var(--p, 0) * 0.08));
          transition: border-color 0.25s ease-out;
        }
        .diskret-card:hover .diskret-inner { filter: blur(0); opacity: 1; transform: none; }

        /* PERFORMANCE — always animating (no scroll condition) */
        .perf-bg { position: absolute; inset: 0; pointer-events: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='rgba(220,20,20,0.2)' stroke-width='1.8'%3E%3Ccircle cx='50' cy='50' r='16'/%3E%3Ccircle cx='50' cy='50' r='7'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(0 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(45 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(90 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(135 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(180 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(225 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(270 50 50)'/%3E%3Crect x='47' y='28' width='6' height='10' rx='2' transform='rotate(315 50 50)'/%3E%3C/g%3E%3C/svg%3E"); background-size: 60px 60px; animation: gear-move 10s linear infinite; }
        @keyframes gear-move { from { background-position: 0 0; } to { background-position: 600px 600px; } }
        .perf-lines { position: absolute; inset: 0; pointer-events: none; opacity: 1; }
        .speed-line { position: absolute; left: -20%; height: 3px; width: 45%; background: linear-gradient(90deg, transparent, rgba(255,60,60,0.5), transparent); animation: speed-dash 0.9s ease-out infinite; }
        @keyframes speed-dash { 0% { left: -45%; opacity: 0; } 30% { opacity: 1; } 100% { left: 120%; opacity: 0; } }
        .perf-icon { animation: perf-pulse 2.4s ease-in-out infinite; }
        @keyframes perf-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }

        /* VERIFIZIERT — scroll-linked: immersive green takeover with glow + scale + icon/text fade */
        .verif-card {
          border-color: rgba(22,163,74, calc(0.2 + var(--p, 0) * 0.8)) !important;
          transform: scale(calc(1 + var(--p, 0) * 0.02));
          box-shadow: 0 0 calc(var(--p, 0) * 40px) rgba(22,163,74, calc(var(--p, 0) * 0.5)), 0 calc(var(--p, 0) * 10px) calc(var(--p, 0) * 30px) rgba(0,0,0, calc(var(--p, 0) * 0.35));
          transition: border-color 0.25s ease-out, transform 0.25s ease-out, box-shadow 0.25s ease-out;
        }
        .verif-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, #16a34a 0%, #15803d 50%, #16a34a 100%);
          opacity: var(--p, 0);
          transition: opacity 0.25s ease-out;
        }
        .verif-card::after {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at 50% 40%, rgba(255,255,255,0.18) 0%, transparent 65%);
          opacity: var(--p, 0);
          pointer-events: none;
          transition: opacity 0.25s ease-out;
        }
        .verif-card > * { position: relative; z-index: 1; }
        .verif-icon {
          background: rgba(255,255,255, calc(0.05 + var(--p, 0) * 0.22)) !important;
          border-color: rgba(255,255,255, calc(0.15 + var(--p, 0) * 0.35)) !important;
          color: rgb(calc(220 + var(--p, 0) * 35), calc(20 + var(--p, 0) * 235), calc(20 + var(--p, 0) * 235)) !important;
          transform: scale(calc(1 + var(--p, 0) * 0.12)) rotate(calc(var(--p, 0) * 6deg));
          transition: all 0.25s ease-out;
        }
        .verif-title { color: #f0f0f0 !important; text-shadow: 0 0 calc(var(--p, 0) * 14px) rgba(255,255,255, calc(var(--p, 0) * 0.45)); transition: text-shadow 0.25s; }
        .verif-desc { color: rgba(255,255,255, calc(0.55 + var(--p, 0) * 0.38)) !important; transition: color 0.25s; }
        .verif-card:hover { transform: scale(1.02) translateY(-3px); box-shadow: 0 0 40px rgba(22,163,74,0.5), 0 10px 30px rgba(0,0,0,0.35); }
        .verif-card:hover::before { opacity: 1; }
        .verif-card:hover::after { opacity: 1; }

        /* MANIFEST */
        .manifest-section { position: relative; z-index: 10; padding: 3rem 1.25rem 4rem; }
        @media (min-width: 640px) { .manifest-section { padding: 5rem 2.5rem 7rem; } }
        .manifest-inner { max-width: 1100px; margin: 0 auto; max-width: 640px; }
        @media (min-width: 1024px) { .manifest-inner { max-width: 1100px; } }
        .manifest-tag { font-size: 11px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(220,20,20,0.95); margin-bottom: 1rem; font-family: Inter, sans-serif; }
        @media (min-width: 640px) { .manifest-tag { font-size: 12px; margin-bottom: 1.25rem; } }
        .manifest-heading { font-family: Oswald, sans-serif; font-size: clamp(1.8rem, 5vw, 2.8rem); font-weight: 700; color: #fff; line-height: 1.15; margin-bottom: 1.5rem; }
        @media (min-width: 640px) { .manifest-heading { margin-bottom: 2rem; } }
        .manifest-heading span { color: #dc1414; }
        .manifest-body { font-family: Inter, sans-serif; font-size: 15px; line-height: 1.8; color: rgba(255,255,255,0.88); }
        @media (min-width: 640px) { .manifest-body { font-size: 16px; line-height: 1.85; } }
        .manifest-body p { margin-bottom: 1rem; }
        @media (min-width: 640px) { .manifest-body p { margin-bottom: 1.25rem; } }
        .manifest-body strong { color: #fff; font-weight: 600; }
        .manifest-closing { font-size: 13px; color: rgba(255,255,255,0.6); font-style: italic; }
        @media (min-width: 640px) { .manifest-closing { font-size: 14px; } }
        .manifest-sig { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.12); font-size: 12px; font-weight: 700; letter-spacing: 0.1em; color: rgba(220,20,20,0.85); font-family: Inter, sans-serif; }
        @media (min-width: 640px) { .manifest-sig { margin-top: 2rem; padding-top: 1.25rem; } }
      `}</style>
    </div>
  );
}
