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

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <h4 className="footer-label">Kategorien</h4>
            <nav className="space-y-3">
              <Link to="/kategorien/girls" data-testid="footer-link-girls" className="footer-link">Girls</Link>
              <Link to="/kategorien/fkk-clubs" data-testid="footer-link-fkk" className="footer-link">FKK Clubs</Link>
              <Link to="/kategorien/bordelle" data-testid="footer-link-bordelle" className="footer-link">Bordelle</Link>
            </nav>
          </div>

          <div>
            <h4 className="footer-label">Newsletter</h4>
            <form onSubmit={handleSubmit} data-testid="newsletter-form" className="flex gap-2">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" data-testid="newsletter-email-input" className="footer-input flex-1" />
              <button type="submit" data-testid="newsletter-submit-btn" className="footer-submit">{subscribed ? 'OK' : 'Go'}</button>
            </form>
            {subscribed && <div className="text-[12px] mt-2 text-red-500">Angemeldet!</div>}
          </div>

          <div>
            <h4 className="footer-label">Social</h4>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" data-testid="footer-instagram-link" className="ig-btn">
              <div className="ig-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </div>
              <span className="ig-text">Instagram</span>
            </a>
          </div>

          <div>
            <h4 className="footer-label">Rechtliches</h4>
            <nav className="space-y-3">
              <Link to="/agb" data-testid="footer-link-agb" className="footer-link">AGB</Link>
              <Link to="/datenschutz" data-testid="footer-link-datenschutz" className="footer-link">Datenschutz</Link>
              <Link to="/impressum" data-testid="footer-link-impressum" className="footer-link">Impressum</Link>
            </nav>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="text-[11px] text-white/20">&copy; {new Date().getFullYear()} NRW Treff</div>
          <div data-testid="footer-disclaimer" className="text-[11px] font-medium" style={{ color: 'rgba(220,20,20,0.4)' }}>Keine Gewährleistung für Fakes.</div>
        </div>
      </div>

      <style>{`
        .footer-root { background: #040404; font-family: Inter, sans-serif; }
        .footer-label { font-size: 11px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(220,20,20,0.45); margin-bottom: 1.25rem; }
        .footer-link { display: block; font-size: 14px; color: rgba(255,255,255,0.45); transition: color 0.2s; }
        .footer-link:hover { color: #fff; }
        .footer-input { padding: 10px 16px; font-size: 14px; background: transparent; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; color: rgba(255,255,255,0.65); caret-color: #dc1414; outline: none; transition: border-color 0.2s; }
        .footer-input:focus { border-color: rgba(220,20,20,0.25); }
        .footer-submit { padding: 10px 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 6px; background: rgba(220,20,20,0.1); color: #dc1414; border: 1px solid rgba(220,20,20,0.2); transition: all 0.2s; cursor: pointer; }
        .footer-submit:hover { background: #dc1414; color: #fff; }

        /* Marquee */
        @keyframes marquee-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee-wrap { line-height: 1; cursor: default; }
        .marquee-track { display: flex; width: max-content; animation: marquee-scroll 70s linear infinite; will-change: transform; }
        .marquee-wrap:hover .marquee-track { animation-play-state: paused; }
        .marquee-content { display: flex; flex-shrink: 0; }
        .marquee-text { font-family: Oswald, sans-serif; font-size: clamp(7rem, 12vw, 12rem); font-weight: 900; letter-spacing: -0.02em; white-space: nowrap; user-select: none; color: rgba(255,255,255,0.05); -webkit-text-stroke: 1.5px rgba(220,20,20,0.35); }
        .marquee-accent { -webkit-text-stroke: 1.5px rgba(220,20,20,0.5); color: rgba(220,20,20,0.08); }

        /* Instagram */
        .ig-btn { display: inline-flex; align-items: center; gap: 12px; padding: 10px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); transition: all 0.3s; }
        .ig-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.04); transition: all 0.3s; }
        .ig-text { font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.45); transition: color 0.3s; }
        .ig-btn:hover .ig-icon { background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color: #fff; box-shadow: 0 0 14px rgba(225,48,108,0.25); }
        .ig-btn:hover .ig-text { color: #fff; }
        .ig-btn:hover { border-color: rgba(225,48,108,0.25); background: rgba(225,48,108,0.05); }
      `}</style>
    </footer>
  );
});

Footer.displayName = 'Footer';
export default Footer;
