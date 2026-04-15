import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); setTimeout(() => setSubscribed(false), 3000); }
  };

  return (
    <footer style={{ background: '#050505', borderTop: '1px solid rgba(255,255,255,0.04)' }}>

      {/* Scrolling Marquee — full opacity, massive, slow, no edges */}
      <div className="overflow-hidden" style={{ background: '#050505' }}>
        <div className="marquee-track" style={{ fontFamily: 'Oswald, sans-serif' }}>
          <div className="marquee-content">
            {[...Array(5)].map((_, i) => (
              <span key={`m1-${i}`} className="text-[8rem] sm:text-[10rem] lg:text-[13rem] font-black tracking-tighter leading-[0.85] whitespace-nowrap select-none" style={{ color: 'rgba(255,255,255,0.06)', WebkitTextStroke: '2px rgba(220,20,20,0.4)' }}>
                NRWTREFF<span style={{ WebkitTextStroke: '2px rgba(220,20,20,0.55)', color: 'rgba(220,20,20,0.12)' }}>ROTZLICHT</span>
              </span>
            ))}
          </div>
          <div className="marquee-content" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <span key={`m2-${i}`} className="text-[8rem] sm:text-[10rem] lg:text-[13rem] font-black tracking-tighter leading-[0.85] whitespace-nowrap select-none" style={{ color: 'rgba(255,255,255,0.04)', WebkitTextStroke: '2px rgba(220,20,20,0.25)' }}>
                NRWTREFF<span style={{ WebkitTextStroke: '2px rgba(220,20,20,0.35)', color: 'rgba(220,20,20,0.08)' }}>ROTZLICHT</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Links */}
          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] uppercase mb-5" style={{ color: 'rgba(220,20,20,0.4)' }}>Kategorien</div>
            <div className="space-y-3">
              <Link to="/kategorien/girls" data-testid="footer-link-girls" className="block text-[13px] text-white/50 hover:text-white transition-colors">Girls</Link>
              <Link to="/kategorien/fkk-clubs" data-testid="footer-link-fkk" className="block text-[13px] text-white/50 hover:text-white transition-colors">FKK Clubs</Link>
              <Link to="/kategorien/bordelle" data-testid="footer-link-bordelle" className="block text-[13px] text-white/50 hover:text-white transition-colors">Bordelle</Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] uppercase mb-5" style={{ color: 'rgba(220,20,20,0.4)' }}>Newsletter</div>
            <form onSubmit={handleNewsletterSubmit} data-testid="newsletter-form" className="flex gap-2">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" data-testid="newsletter-email-input"
                className="flex-1 px-3 py-2.5 text-[13px] tracking-wide bg-transparent focus:outline-none transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', caretColor: '#dc1414', borderRadius: '4px' }}
                onFocus={e => e.target.style.borderColor = 'rgba(220,20,20,0.3)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button type="submit" data-testid="newsletter-submit-btn"
                className="px-5 py-2.5 text-[12px] font-bold tracking-[0.1em] uppercase rounded transition-all duration-200"
                style={{ background: 'rgba(220,20,20,0.12)', color: '#dc1414', border: '1px solid rgba(220,20,20,0.25)' }}
                onMouseEnter={e => { e.target.style.background = '#dc1414'; e.target.style.color = '#fff'; e.target.style.boxShadow = '0 0 20px rgba(220,20,20,0.3)'; }}
                onMouseLeave={e => { e.target.style.background = 'rgba(220,20,20,0.12)'; e.target.style.color = '#dc1414'; e.target.style.boxShadow = 'none'; }}
              >{subscribed ? 'OK' : 'Go'}</button>
            </form>
            {subscribed && <div className="text-[12px] mt-2" style={{ color: '#dc1414' }}>Angemeldet!</div>}
          </div>

          {/* Social — Interactive Instagram */}
          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] uppercase mb-5" style={{ color: 'rgba(220,20,20,0.4)' }}>Social</div>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" data-testid="footer-instagram-link"
              className="ig-btn inline-flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300"
              style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
            >
              <div className="ig-icon w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </div>
              <span className="text-[13px] font-medium text-white/50 ig-text transition-colors duration-300">Instagram</span>
            </a>
          </div>

          {/* Legal */}
          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] uppercase mb-5" style={{ color: 'rgba(220,20,20,0.4)' }}>Rechtliches</div>
            <div className="space-y-3">
              <Link to="/agb" data-testid="footer-link-agb" className="block text-[13px] text-white/50 hover:text-white transition-colors">AGB</Link>
              <Link to="/datenschutz" data-testid="footer-link-datenschutz" className="block text-[13px] text-white/50 hover:text-white transition-colors">Datenschutz</Link>
              <Link to="/impressum" data-testid="footer-link-impressum" className="block text-[13px] text-white/50 hover:text-white transition-colors">Impressum</Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="text-[11px] text-white/25">&copy; {new Date().getFullYear()} NRW Treff</div>
          <div data-testid="footer-disclaimer" className="text-[11px] font-semibold" style={{ color: 'rgba(220,20,20,0.45)' }}>Keine Gewährleistung für Fakes.</div>
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 80s linear infinite;
        }
        .marquee-content {
          display: flex;
          flex-shrink: 0;
        }

        /* Instagram button */
        .ig-icon {
          color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.04);
        }
        .ig-btn:hover .ig-icon {
          background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
          color: #fff;
          box-shadow: 0 0 16px rgba(225,48,108,0.3);
        }
        .ig-btn:hover .ig-text {
          color: #fff !important;
        }
        .ig-btn:hover {
          border-color: rgba(225,48,108,0.3) !important;
          background: rgba(225,48,108,0.06) !important;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
