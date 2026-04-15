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
    <footer style={{ background: '#040404' }}>

      {/* Marquee — no padding gaps, seamless text */}
      <div className="overflow-hidden" style={{ lineHeight: 1 }}>
        <div className="marquee-track" style={{ fontFamily: 'Oswald, sans-serif' }}>
          <div className="marquee-content">
            {[...Array(5)].map((_, i) => (
              <span key={`a${i}`} className="text-[7rem] sm:text-[9rem] lg:text-[12rem] font-black tracking-[-0.02em] whitespace-nowrap select-none" style={{ color: 'rgba(255,255,255,0.05)', WebkitTextStroke: '1.5px rgba(220,20,20,0.35)' }}>
                NRWTREFF<span style={{ WebkitTextStroke: '1.5px rgba(220,20,20,0.5)', color: 'rgba(220,20,20,0.08)' }}>ROTZLICHT</span>
              </span>
            ))}
          </div>
          <div className="marquee-content" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <span key={`b${i}`} className="text-[7rem] sm:text-[9rem] lg:text-[12rem] font-black tracking-[-0.02em] whitespace-nowrap select-none" style={{ color: 'rgba(255,255,255,0.05)', WebkitTextStroke: '1.5px rgba(220,20,20,0.35)' }}>
                NRWTREFF<span style={{ WebkitTextStroke: '1.5px rgba(220,20,20,0.5)', color: 'rgba(220,20,20,0.08)' }}>ROTZLICHT</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          <div>
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-5" style={{ color: 'rgba(220,20,20,0.45)', fontFamily: 'Inter, sans-serif' }}>Kategorien</div>
            <div className="space-y-3">
              <Link to="/kategorien/girls" data-testid="footer-link-girls" className="block text-[14px] text-white/45 hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>Girls</Link>
              <Link to="/kategorien/fkk-clubs" data-testid="footer-link-fkk" className="block text-[14px] text-white/45 hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>FKK Clubs</Link>
              <Link to="/kategorien/bordelle" data-testid="footer-link-bordelle" className="block text-[14px] text-white/45 hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>Bordelle</Link>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-5" style={{ color: 'rgba(220,20,20,0.45)', fontFamily: 'Inter, sans-serif' }}>Newsletter</div>
            <form onSubmit={handleNewsletterSubmit} data-testid="newsletter-form" className="flex gap-2">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" data-testid="newsletter-email-input"
                className="flex-1 px-4 py-2.5 text-[14px] bg-transparent focus:outline-none transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)', caretColor: '#dc1414', borderRadius: '6px', fontFamily: 'Inter, sans-serif' }}
                onFocus={e => e.target.style.borderColor = 'rgba(220,20,20,0.25)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              <button type="submit" data-testid="newsletter-submit-btn"
                className="px-5 py-2.5 text-[12px] font-semibold tracking-[0.08em] uppercase rounded-md transition-all"
                style={{ background: 'rgba(220,20,20,0.1)', color: '#dc1414', border: '1px solid rgba(220,20,20,0.2)', fontFamily: 'Inter, sans-serif' }}
                onMouseEnter={e => { e.target.style.background = '#dc1414'; e.target.style.color = '#fff'; }}
                onMouseLeave={e => { e.target.style.background = 'rgba(220,20,20,0.1)'; e.target.style.color = '#dc1414'; }}
              >{subscribed ? 'OK' : 'Go'}</button>
            </form>
            {subscribed && <div className="text-[12px] mt-2" style={{ color: '#dc1414', fontFamily: 'Inter, sans-serif' }}>Angemeldet!</div>}
          </div>

          <div>
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-5" style={{ color: 'rgba(220,20,20,0.45)', fontFamily: 'Inter, sans-serif' }}>Social</div>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" data-testid="footer-instagram-link"
              className="ig-btn inline-flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300"
              style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="ig-icon w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </div>
              <span className="text-[14px] font-medium text-white/45 ig-text transition-colors duration-300" style={{ fontFamily: 'Inter, sans-serif' }}>Instagram</span>
            </a>
          </div>

          <div>
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-5" style={{ color: 'rgba(220,20,20,0.45)', fontFamily: 'Inter, sans-serif' }}>Rechtliches</div>
            <div className="space-y-3">
              <Link to="/agb" data-testid="footer-link-agb" className="block text-[14px] text-white/45 hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>AGB</Link>
              <Link to="/datenschutz" data-testid="footer-link-datenschutz" className="block text-[14px] text-white/45 hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>Datenschutz</Link>
              <Link to="/impressum" data-testid="footer-link-impressum" className="block text-[14px] text-white/45 hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>Impressum</Link>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="text-[11px] text-white/20" style={{ fontFamily: 'Inter, sans-serif' }}>&copy; {new Date().getFullYear()} NRW Treff</div>
          <div data-testid="footer-disclaimer" className="text-[11px] font-medium" style={{ color: 'rgba(220,20,20,0.4)', fontFamily: 'Inter, sans-serif' }}>Keine Gewährleistung für Fakes.</div>
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee-track { display: flex; width: max-content; animation: marquee-scroll 70s linear infinite; }
        .marquee-content { display: flex; flex-shrink: 0; gap: 0; }
        .ig-icon { color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.04); }
        .ig-btn:hover .ig-icon { background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color: #fff; box-shadow: 0 0 14px rgba(225,48,108,0.25); }
        .ig-btn:hover .ig-text { color: #fff !important; }
        .ig-btn:hover { border-color: rgba(225,48,108,0.25) !important; background: rgba(225,48,108,0.05) !important; }
      `}</style>
    </footer>
  );
};

export default Footer;
