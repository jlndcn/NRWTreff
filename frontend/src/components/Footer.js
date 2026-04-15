import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="border-t border-white/10" style={{ background: '#080808' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

        {/* Large Brand Mark */}
        <div className="mb-10">
          <div className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none" style={{ fontFamily: 'Oswald, sans-serif' }}>
            <span style={{ color: '#f0f0f0' }}>NRW</span><span style={{ color: '#cc0000' }}>TREFF</span>
          </div>
          <div className="text-xs sm:text-sm font-medium tracking-widest mt-1" style={{ color: '#555' }}>
            ROTZLICHT
          </div>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Column 1: Category Links */}
          <div>
            <div className="space-y-2">
              <Link to="/kategorien/girls" data-testid="footer-link-girls" className="block text-sm text-white/50 hover:text-white transition-colors">
                Girls
              </Link>
              <Link to="/kategorien/fkk-clubs" data-testid="footer-link-fkk" className="block text-sm text-white/50 hover:text-white transition-colors">
                FKK Clubs
              </Link>
            </div>
          </div>

          {/* Column 2: Newsletter */}
          <div>
            <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Newsletter</div>
            <form onSubmit={handleNewsletterSubmit} data-testid="newsletter-form" className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                data-testid="newsletter-email-input"
                className="flex-1 px-3 py-2 rounded text-sm border border-white/15 bg-white/5 text-white/80 placeholder-white/30 focus:outline-none focus:border-red-500/40 transition-colors"
              />
              <button
                type="submit"
                data-testid="newsletter-submit-btn"
                className="px-4 py-2 rounded text-sm font-semibold transition-all hover:brightness-110"
                style={{ background: '#cc0000', color: '#fff' }}
              >
                {subscribed ? 'OK' : 'Go'}
              </button>
            </form>
            {subscribed && (
              <div className="text-xs text-green-400 mt-2">Angemeldet!</div>
            )}
          </div>

          {/* Column 3: Social */}
          <div>
            <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Social</div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-instagram-link"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              Instagram
            </a>
          </div>

          {/* Column 4: Legal */}
          <div>
            <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Rechtliches</div>
            <div className="space-y-2">
              <Link to="/agb" data-testid="footer-link-agb" className="block text-sm text-white/50 hover:text-white transition-colors">AGB</Link>
              <Link to="/datenschutz" data-testid="footer-link-datenschutz" className="block text-sm text-white/50 hover:text-white transition-colors">Datenschutz</Link>
              <Link to="/impressum" data-testid="footer-link-impressum" className="block text-sm text-white/50 hover:text-white transition-colors">Impressum</Link>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} NRW Treff. Alle Rechte vorbehalten.
          </div>
          <div data-testid="footer-disclaimer" className="text-xs font-medium" style={{ color: '#cc0000aa' }}>
            Keine Gewährleistung für Fakes.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
