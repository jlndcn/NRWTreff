import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';

const MARQUEE_TEXT = Array.from({ length: 5 }, (_, i) => i);

const Footer = memo(() => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="footer-root">
      {/* Marquee — pauses on hover */}
      <div className="marquee-wrap overflow-hidden">
        <div className="marquee-track">
          {[0, 1].map(set => (
            <div key={set} className="marquee-content" aria-hidden={set === 1}>
              {MARQUEE_TEXT.map(i => (
                <span key={`${set}-${i}`} className="marquee-text">
                  NRWTREFF<span className="marquee-accent">ROTZLICHT</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="footer-container">
        {/* Top: brand block */}
        <div className="footer-brand-block">
          <div className="footer-brand">
            <span className="fb-name">NRW<span className="fb-accent">TREFF</span></span>
            <span className="fb-sub">ROTZLICHT</span>
          </div>
          <p className="footer-tagline">
            Die diskrete Plattform für Erwachsene in Nordrhein-Westfalen. Verifizierte Profile, klare Regeln, kein Fake.
          </p>
        </div>

        <div className="footer-divider" />

        {/* Middle: 4-column info grid */}
        <div className="footer-grid">
          <div>
            <h4 className="footer-label">Entdecken</h4>
            <nav className="footer-nav">
              <Link to="/kategorien/girls" data-testid="footer-link-girls" className="footer-link">Girls</Link>
              <Link to="/kategorien/fkk-clubs" data-testid="footer-link-fkk" className="footer-link">FKK Clubs</Link>
              <Link to="/kategorien/bordelle" data-testid="footer-link-bordelle" className="footer-link">Bordelle</Link>
              <Link to="/kategorien/rotzlicht-cam" className="footer-link footer-link-accent">Rotzlicht-Cam</Link>
            </nav>
          </div>

          <div>
            <h4 className="footer-label">Service</h4>
            <nav className="footer-nav">
              <Link to="/bewerben" className="footer-link">Bewerben</Link>
              <Link to="/inserieren" className="footer-link">Inserieren</Link>
              <Link to="/support" className="footer-link">Support</Link>
              <Link to="/kontakt" className="footer-link">Kontakt</Link>
            </nav>
          </div>

          <div>
            <h4 className="footer-label">Rechtliches</h4>
            <nav className="footer-nav">
              <Link to="/agb" data-testid="footer-link-agb" className="footer-link">AGB</Link>
              <Link to="/datenschutz" data-testid="footer-link-datenschutz" className="footer-link">Datenschutz</Link>
              <Link to="/impressum" data-testid="footer-link-impressum" className="footer-link">Impressum</Link>
            </nav>
          </div>

          <div>
            <h4 className="footer-label">Newsletter</h4>
            <p className="footer-newsletter-hint">Kein Spam. Nur neue Profile &amp; News.</p>
            <form onSubmit={handleSubmit} data-testid="newsletter-form" className="footer-newsletter-form">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="deine@email.de" data-testid="newsletter-email-input" className="footer-input" />
              <button type="submit" data-testid="newsletter-submit-btn" className="footer-submit">{subscribed ? 'OK ✓' : 'Abonnieren'}</button>
            </form>
            {subscribed && <div className="footer-sub-confirm">Angemeldet!</div>}
            <div className="footer-social">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" data-testid="footer-instagram-link" className="ig-btn" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-divider" />

        {/* Bottom: copyright row */}
        <div className="footer-bottom">
          <div className="footer-copy">&copy; {new Date().getFullYear()} NRW Treff · Alle Rechte vorbehalten</div>
          <div data-testid="footer-disclaimer" className="footer-disclaimer">18+ · Keine Gewährleistung für Fakes</div>
        </div>
      </div>

      <style>{`
        .footer-root { background: #040404; font-family: Inter, sans-serif; }
        .footer-container { max-width: 1280px; margin: 0 auto; padding: 3rem 1.5rem 2rem; }
        @media (min-width: 640px) { .footer-container { padding: 4rem 2rem 2.5rem; } }

        /* Brand block */
        .footer-brand-block { display: flex; flex-direction: column; gap: 0.75rem; max-width: 480px; margin-bottom: 2rem; }
        .footer-brand { display: flex; flex-direction: column; align-items: flex-start; line-height: 1; }
        .fb-name { font-family: Oswald, sans-serif; font-size: 28px; font-weight: 900; letter-spacing: 0.02em; color: rgba(255,255,255,0.95); }
        .fb-accent { color: #dc1414; }
        .fb-sub { font-size: 10px; font-weight: 700; letter-spacing: 0.3em; color: rgba(220,20,20,0.85); margin-top: 4px; }
        .footer-tagline { font-size: 13px; line-height: 1.6; color: rgba(255,255,255,0.55); }

        /* Divider */
        .footer-divider { height: 1px; background: linear-gradient(to right, transparent, rgba(220,20,20,0.22), transparent); margin: 0 0 2rem; }

        /* Grid */
        .footer-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; margin-bottom: 2rem; }
        @media (min-width: 640px) { .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 2.25rem; } }
        @media (min-width: 1024px) { .footer-grid { grid-template-columns: repeat(4, 1fr); gap: 2.5rem; } }

        .footer-label { font-family: Oswald, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(220,20,20,0.9); margin-bottom: 1rem; }
        .footer-nav { display: flex; flex-direction: column; gap: 10px; }
        .footer-link { display: block; font-size: 14px; color: rgba(255,255,255,0.62); transition: color 0.2s, transform 0.2s; text-decoration: none; }
        .footer-link:hover { color: #fff; transform: translateX(2px); }
        .footer-link-accent { color: rgba(220,20,20,0.85); }
        .footer-link-accent:hover { color: #dc1414; }

        /* Newsletter */
        .footer-newsletter-hint { font-size: 12px; color: rgba(255,255,255,0.45); margin-bottom: 0.75rem; line-height: 1.5; }
        .footer-newsletter-form { display: flex; flex-direction: column; gap: 8px; }
        .footer-input { width: 100%; padding: 11px 14px; font-size: 13px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: rgba(255,255,255,0.85); caret-color: #dc1414; outline: none; transition: border-color 0.2s; }
        .footer-input::placeholder { color: rgba(255,255,255,0.3); }
        .footer-input:focus { border-color: rgba(220,20,20,0.5); }
        .footer-submit { padding: 11px 18px; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 8px; background: #dc1414; color: #fff; border: 1px solid #dc1414; transition: all 0.2s; cursor: pointer; }
        .footer-submit:hover { background: #b71010; border-color: #b71010; }
        .footer-sub-confirm { font-size: 12px; color: #16a34a; margin-top: 8px; font-weight: 600; }

        /* Social */
        .footer-social { margin-top: 1rem; }
        .ig-btn { display: inline-flex; align-items: center; gap: 10px; padding: 9px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 500; transition: all 0.25s; text-decoration: none; }
        .ig-btn:hover { background: linear-gradient(135deg, rgba(240,148,51,0.15), rgba(220,39,67,0.15), rgba(188,24,136,0.15)); border-color: rgba(225,48,108,0.4); color: #fff; }

        /* Bottom */
        .footer-bottom { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; padding-top: 1rem; }
        @media (min-width: 640px) { .footer-bottom { flex-direction: row; align-items: center; justify-content: space-between; } }
        .footer-copy { font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 0.03em; }
        .footer-disclaimer { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; color: rgba(220,20,20,0.7); text-transform: uppercase; }

        /* Marquee — brighter than before */
        @keyframes marquee-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee-wrap { line-height: 1; cursor: default; padding-top: 1rem; }
        .marquee-track { display: flex; width: max-content; animation: marquee-scroll 70s linear infinite; will-change: transform; }
        .marquee-wrap:hover .marquee-track { animation-play-state: paused; }
        .marquee-content { display: flex; flex-shrink: 0; }
        .marquee-text { font-family: Oswald, sans-serif; font-size: clamp(7rem, 12vw, 12rem); font-weight: 900; letter-spacing: -0.02em; white-space: nowrap; user-select: none; color: rgba(255,255,255,0.10); -webkit-text-stroke: 1.5px rgba(220,20,20,0.65); }
        .marquee-accent { -webkit-text-stroke: 1.5px rgba(220,20,20,0.85); color: rgba(220,20,20,0.18); }
      `}</style>
    </footer>
  );
});

Footer.displayName = 'Footer';
export default Footer;
