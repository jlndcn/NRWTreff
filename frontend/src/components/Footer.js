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
    <footer style={{ background: '#060606', borderTop: '1px solid rgba(0,229,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14 sm:py-20">

        {/* Large Brand */}
        <div className="mb-12">
          <div className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none" style={{ fontFamily: 'Oswald, sans-serif' }}>
            <span style={{ color: '#e8e8e8' }}>NRW</span><span style={{ color: '#00e5ff' }}>TREFF</span>
          </div>
          <div className="text-[10px] sm:text-xs font-medium tracking-[0.25em] mt-1.5" style={{ color: 'rgba(255,45,123,0.4)' }}>
            ROTZLICHT
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Links */}
          <div>
            <div className="space-y-3">
              <Link to="/kategorien/girls" data-testid="footer-link-girls" className="block text-xs tracking-[0.15em] uppercase transition-colors duration-200" style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={e => e.target.style.color = '#00e5ff'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}>
                Girls
              </Link>
              <Link to="/kategorien/fkk-clubs" data-testid="footer-link-fkk" className="block text-xs tracking-[0.15em] uppercase transition-colors duration-200" style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={e => e.target.style.color = '#00e5ff'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}>
                FKK Clubs
              </Link>
            </div>
          </div>

          {/* Col 2: Newsletter */}
          <div>
            <div className="text-[10px] font-medium tracking-[0.2em] uppercase mb-4" style={{ color: 'rgba(0,229,255,0.3)' }}>Newsletter</div>
            <form onSubmit={handleNewsletterSubmit} data-testid="newsletter-form" className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                data-testid="newsletter-email-input"
                className="flex-1 px-3 py-2 text-xs tracking-wide bg-transparent border focus:outline-none transition-colors duration-200"
                style={{
                  borderColor: 'rgba(0,229,255,0.12)',
                  color: 'rgba(255,255,255,0.7)',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(0,229,255,0.35)'}
                onBlur={e => e.target.style.borderColor = 'rgba(0,229,255,0.12)'}
              />
              <button
                type="submit"
                data-testid="newsletter-submit-btn"
                className="px-4 py-2 text-[10px] font-semibold tracking-[0.15em] uppercase transition-all duration-200"
                style={{ background: 'rgba(0,229,255,0.1)', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.2)' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(0,229,255,0.2)'; }}
                onMouseLeave={e => { e.target.style.background = 'rgba(0,229,255,0.1)'; }}
              >
                {subscribed ? 'OK' : 'Go'}
              </button>
            </form>
            {subscribed && (
              <div className="text-[10px] tracking-wide mt-2" style={{ color: '#00e5ff' }}>Angemeldet!</div>
            )}
          </div>

          {/* Col 3: Social */}
          <div>
            <div className="text-[10px] font-medium tracking-[0.2em] uppercase mb-4" style={{ color: 'rgba(0,229,255,0.3)' }}>Social</div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-instagram-link"
              className="inline-flex items-center gap-2.5 text-xs tracking-[0.1em] transition-colors duration-200"
              style={{ color: 'rgba(255,255,255,0.35)' }}
              onMouseEnter={e => e.target.style.color = '#ff2d7b'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              Instagram
            </a>
          </div>

          {/* Col 4: Legal */}
          <div>
            <div className="text-[10px] font-medium tracking-[0.2em] uppercase mb-4" style={{ color: 'rgba(0,229,255,0.3)' }}>Rechtliches</div>
            <div className="space-y-3">
              <Link to="/agb" data-testid="footer-link-agb" className="block text-xs tracking-[0.1em] transition-colors duration-200" style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={e => e.target.style.color = '#00e5ff'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}>AGB</Link>
              <Link to="/datenschutz" data-testid="footer-link-datenschutz" className="block text-xs tracking-[0.1em] transition-colors duration-200" style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={e => e.target.style.color = '#00e5ff'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}>Datenschutz</Link>
              <Link to="/impressum" data-testid="footer-link-impressum" className="block text-xs tracking-[0.1em] transition-colors duration-200" style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={e => e.target.style.color = '#00e5ff'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}>Impressum</Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(0,229,255,0.05)' }}>
          <div className="text-[10px] tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.2)' }}>
            &copy; {new Date().getFullYear()} NRW Treff
          </div>
          <div data-testid="footer-disclaimer" className="text-[10px] tracking-[0.12em] font-medium" style={{ color: 'rgba(255,45,123,0.4)' }}>
            Keine Gewährleistung für Fakes.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
