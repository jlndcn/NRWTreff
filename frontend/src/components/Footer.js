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
    <footer style={{ background: '#060606', borderTop: '1px solid rgba(255,20,20,0.05)' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20">

        {/* Brand */}
        <div className="mb-12">
          <div className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none" style={{ fontFamily: 'Oswald, sans-serif' }}>
            <span style={{ color: '#d0d0d0' }}>NRW</span><span style={{ color: '#e01020' }}>TREFF</span>
          </div>
          <div className="text-[10px] font-semibold tracking-[0.3em] mt-1.5" style={{ color: 'rgba(224,16,32,0.3)' }}>
            ROTZLICHT
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Links */}
          <div>
            <div className="space-y-3">
              <Link to="/kategorien/girls" data-testid="footer-link-girls" className="footer-link">Girls</Link>
              <Link to="/kategorien/fkk-clubs" data-testid="footer-link-fkk" className="footer-link">FKK Clubs</Link>
              <Link to="/kategorien/bordelle" data-testid="footer-link-bordelle" className="footer-link">Bordelle</Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <div className="text-[9px] font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(224,16,32,0.25)' }}>Newsletter</div>
            <form onSubmit={handleNewsletterSubmit} data-testid="newsletter-form" className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                data-testid="newsletter-email-input"
                className="flex-1 px-3 py-2 text-xs tracking-wide bg-transparent focus:outline-none transition-colors duration-200"
                style={{ border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', caretColor: '#e01020' }}
                onFocus={e => e.target.style.borderColor = 'rgba(224,16,32,0.2)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
              />
              <button
                type="submit"
                data-testid="newsletter-submit-btn"
                className="px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-200"
                style={{ background: 'rgba(224,16,32,0.1)', color: '#e01020', border: '1px solid rgba(224,16,32,0.2)' }}
                onMouseEnter={e => { e.target.style.background = '#e01020'; e.target.style.color = '#fff'; e.target.style.boxShadow = '0 0 16px rgba(224,16,32,0.25)'; }}
                onMouseLeave={e => { e.target.style.background = 'rgba(224,16,32,0.1)'; e.target.style.color = '#e01020'; e.target.style.boxShadow = 'none'; }}
              >
                {subscribed ? 'OK' : 'Go'}
              </button>
            </form>
            {subscribed && <div className="text-[10px] tracking-wide mt-2" style={{ color: '#e01020' }}>Angemeldet!</div>}
          </div>

          {/* Social */}
          <div>
            <div className="text-[9px] font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(224,16,32,0.25)' }}>Social</div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-instagram-link"
              className="footer-link inline-flex items-center gap-2.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              Instagram
            </a>
          </div>

          {/* Legal */}
          <div>
            <div className="text-[9px] font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(224,16,32,0.25)' }}>Rechtliches</div>
            <div className="space-y-3">
              <Link to="/agb" data-testid="footer-link-agb" className="footer-link">AGB</Link>
              <Link to="/datenschutz" data-testid="footer-link-datenschutz" className="footer-link">Datenschutz</Link>
              <Link to="/impressum" data-testid="footer-link-impressum" className="footer-link">Impressum</Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="text-[10px] tracking-[0.08em]" style={{ color: 'rgba(255,255,255,0.15)' }}>
            &copy; {new Date().getFullYear()} NRW Treff
          </div>
          <div data-testid="footer-disclaimer" className="text-[10px] tracking-[0.1em] font-semibold" style={{ color: 'rgba(224,16,32,0.35)' }}>
            Keine Gewährleistung für Fakes.
          </div>
        </div>
      </div>

      <style>{`
        .footer-link {
          display: block;
          font-size: 12px;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.25);
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: #e01020;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
