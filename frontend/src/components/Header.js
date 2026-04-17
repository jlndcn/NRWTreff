import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, X, MapPin, ChevronDown, ChevronRight } from 'lucide-react';

const SUB_NAV = [
  { name: 'GIRLS', slug: 'girls' },
  { name: 'FKK CLUBS', slug: 'fkk-clubs' },
  { name: 'BORDELLE', slug: 'bordelle' },
  { name: 'ROTZLICHT-CAM', slug: 'rotzlicht-cam', accent: true },
];

const NRW_CITIES = ['Köln','Düsseldorf','Dortmund','Essen','Duisburg','Bochum','Wuppertal','Bielefeld','Bonn','Münster'];

const Header = memo(({ cities = [] }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [staedteOpen, setStaedteOpen] = useState(false);
  const [kontaktOpen, setKontaktOpen] = useState(false);
  const [mobileStaedte, setMobileStaedte] = useState(false);
  const [mobileKontakt, setMobileKontakt] = useState(false);
  const navigate = useNavigate();
  const staedteRef = useRef(null);
  const kontaktRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (staedteRef.current && !staedteRef.current.contains(e.target)) setStaedteOpen(false);
      if (kontaktRef.current && !kontaktRef.current.contains(e.target)) setKontaktOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const city = cities.find(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    navigate(city ? `/stadte/${city.slug}` : `/browse?search=${searchQuery}`);
    setSearchOpen(false); setSearchQuery(''); setMobileOpen(false);
  }, [searchQuery, cities, navigate]);

  const goCity = useCallback((name) => {
    const slug = name.toLowerCase().replace(/ü/g,'ue').replace(/ö/g,'oe').replace(/ä/g,'ae').replace(/ß/g,'ss').replace(/\s+/g,'-');
    setStaedteOpen(false); setMobileOpen(false); navigate(`/stadte/${slug}`);
  }, [navigate]);

  const close = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <header className="hdr">
        {/* Main bar */}
        <div className="hdr-main">
          <div className="hdr-inner">
            {/* Mobile left — hamburger (burger) */}
            <div className="hdr-mob-left">
              <button onClick={() => setMobileOpen(!mobileOpen)} data-testid="site-header-menu-button" className="hdr-mob-btn" aria-label="Menü"><Menu size={26} /></button>
            </div>

            {/* Desktop left nav */}
            <nav className="hdr-desk-nav">
              <div ref={staedteRef} className="relative">
                <button onClick={() => { setStaedteOpen(!staedteOpen); setKontaktOpen(false); }} data-testid="nav-staedte" className="hdr-link">
                  Städte <ChevronDown size={14} className={`transition-transform duration-200 ${staedteOpen ? 'rotate-180' : ''}`} />
                </button>
                {staedteOpen && (
                  <div className="hdr-dropdown w-56">
                    {NRW_CITIES.map(city => (
                      <button key={city} onClick={() => goCity(city)} className="hdr-dd-item"><MapPin size={13} className="opacity-40" />{city}</button>
                    ))}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      <button onClick={() => { setStaedteOpen(false); setSearchOpen(true); }} className="hdr-dd-more">Mehr Städte...</button>
                    </div>
                  </div>
                )}
              </div>
              <div ref={kontaktRef} className="relative">
                <button onClick={() => { setKontaktOpen(!kontaktOpen); setStaedteOpen(false); }} data-testid="nav-kontakt" className="hdr-link">
                  Kontakt <ChevronDown size={14} className={`transition-transform duration-200 ${kontaktOpen ? 'rotate-180' : ''}`} />
                </button>
                {kontaktOpen && (
                  <div className="hdr-dropdown flex">
                    <Link to="/support" onClick={() => setKontaktOpen(false)} className="hdr-dd-side">Support</Link>
                    <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
                    <Link to="/inserieren" onClick={() => setKontaktOpen(false)} className="hdr-dd-side hdr-dd-accent">Inserieren</Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Center brand */}
            <Link to="/" data-testid="site-header-logo-link" className="hdr-brand group">
              <div className="hdr-brand-name"><span className="text-white/95">NRW</span><span className="hdr-brand-red group-hover:drop-shadow-[0_0_12px_rgba(220,20,20,0.5)]">TREFF</span></div>
              <div className="hdr-brand-sub">ROTZLICHT</div>
            </Link>

            {/* Desktop right */}
            <div className="hdr-desk-right">
              <button onClick={() => setSearchOpen(!searchOpen)} data-testid="nav-search-toggle" className="hdr-link"><Search size={16} /> Suche</button>
              <span className="hdr-age">18+</span>
            </div>

            {/* Mobile right — search only (burger moved to left) */}
            <div className="hdr-mob-right">
              <button onClick={() => setSearchOpen(!searchOpen)} className="hdr-mob-btn" aria-label="Suche"><Search size={26} /></button>
            </div>
          </div>
        </div>

        {/* Desktop sub-nav — hidden on mobile */}
        <div className="hdr-subnav">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex items-center justify-center gap-6 sm:gap-8 lg:gap-10 py-2.5">
              {SUB_NAV.map(item => (
                <Link key={item.name} to={`/kategorien/${item.slug}`} data-testid={`subnav-${item.slug}`}
                  className={`subnav-link ${item.accent ? 'subnav-accent' : ''}`}>{item.name}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Search overlay */}
        {searchOpen && (
          <div className="hdr-search-overlay">
            <div className="max-w-2xl mx-auto px-5 py-4">
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <Search size={16} style={{ color: 'rgba(220,20,20,0.5)' }} />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Stadt eingeben..." autoFocus data-testid="header-search-input"
                  className="flex-1 bg-transparent text-[15px] tracking-wide text-white/80 placeholder-white/25 focus:outline-none" style={{ caretColor: '#dc1414' }} />
                <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="text-white/30 hover:text-white/60"><X size={16} /></button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Search backdrop */}
      {searchOpen && <div className="fixed inset-0 z-30 bg-black/60" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} />}

      {/* ═══ MOBILE FULLSCREEN MENU ═══ */}
      {mobileOpen && (
        <div className="mob-menu" onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="mob-menu-panel">
            {/* Menu header */}
            <div className="mob-menu-header">
              <div className="mob-menu-brand">
                <span style={{ color: '#dc1414' }}>ROTZLICHT</span>
              </div>
              <button onClick={close} className="text-white/50 hover:text-white p-1"><X size={22} /></button>
            </div>

            <div className="mob-menu-body">
              {/* Kategorien */}
              <div className="mob-section-label">Kategorien</div>
              {SUB_NAV.map(item => (
                <Link key={item.name} to={`/kategorien/${item.slug}`} onClick={close} className={`mob-link ${item.accent ? 'mob-link-accent' : ''}`}>
                  {item.name}
                </Link>
              ))}

              {/* Städte */}
              <div className="mob-section-label mt-5">
                <button onClick={() => setMobileStaedte(!mobileStaedte)} className="mob-section-toggle">
                  Städte <ChevronDown size={14} className={`transition-transform ${mobileStaedte ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {mobileStaedte && NRW_CITIES.map(city => (
                <button key={city} onClick={() => goCity(city)} className="mob-sublink">{city}</button>
              ))}

              {/* Kontakt */}
              <div className="mob-section-label mt-5">
                <button onClick={() => setMobileKontakt(!mobileKontakt)} className="mob-section-toggle">
                  Kontakt <ChevronDown size={14} className={`transition-transform ${mobileKontakt ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {mobileKontakt && (<>
                <Link to="/support" onClick={close} className="mob-sublink">Support</Link>
                <Link to="/inserieren" onClick={close} className="mob-sublink mob-sublink-accent">Inserieren</Link>
              </>)}
            </div>

            <div className="mob-menu-footer">
              <span className="hdr-age">18+</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hdr { position: sticky; top: 0; z-index: 40; background: rgba(6,6,6,0.45); backdrop-filter: blur(20px) saturate(140%); }
        .hdr-main { border-bottom: 1px solid rgba(255,255,255,0.06); }
        .hdr-inner { max-width: 80rem; margin: 0 auto; padding: 0 1rem; height: 52px; display: flex; align-items: center; justify-content: space-between; position: relative; }
        @media (min-width: 640px) { .hdr-inner { padding: 0 1.25rem; height: 56px; } }
        @media (min-width: 1024px) { .hdr-inner { padding: 0 2rem; height: 72px; } }

        .hdr-desk-nav { display: none; align-items: center; gap: 2rem; }
        .hdr-desk-right { display: none; align-items: center; gap: 1.75rem; }
        .hdr-mob-left { display: flex; align-items: center; }
        @media (min-width: 1024px) { .hdr-desk-nav, .hdr-desk-right { display: flex; } .hdr-mob-right, .hdr-mob-left { display: none !important; } }

        .hdr-mob-right { display: flex; align-items: center; gap: 0.75rem; }
        .hdr-mob-btn { color: rgba(255,255,255,0.7); padding: 8px; transition: color 0.2s; display: flex; align-items: center; justify-content: center; }
        .hdr-mob-btn:hover { color: #fff; }

        .hdr-link { font-size: 15px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(255,255,255,0.6); display: flex; align-items: center; gap: 6px; transition: color 0.3s; cursor: pointer; background: none; border: none; font-family: Inter, sans-serif; }
        .hdr-link:hover { color: #dc1414; }

        .hdr-brand { position: absolute; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; text-decoration: none; }
        @media (max-width: 1023px) { .hdr-brand { top: 3px; } }
        .hdr-brand-name { font-family: Oswald, sans-serif; font-size: 26px; font-weight: 900; letter-spacing: 0.02em; line-height: 1; }
        @media (min-width: 640px) { .hdr-brand-name { font-size: 36px; } }
        .hdr-brand-red { color: #dc1414; transition: all 0.3s; }
        .hdr-brand-sub { font-size: 10px; font-weight: 700; letter-spacing: 0.25em; margin-top: 1px; color: rgba(220,20,20,0.6); }
        @media (min-width: 640px) { .hdr-brand-sub { font-size: 11px; margin-top: 2px; } }

        .hdr-age { font-size: 12px; font-weight: 700; letter-spacing: 0.1em; padding: 4px 12px; border-radius: 4px; color: rgba(220,20,20,0.6); border: 1px solid rgba(220,20,20,0.2); background: rgba(220,20,20,0.06); }

        .hdr-subnav { border-bottom: 1px solid rgba(255,255,255,0.04); background: rgba(4,4,4,0.5); display: none; }
        @media (min-width: 1024px) { .hdr-subnav { display: block; } }
        .subnav-link { white-space: nowrap; font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.7); transition: color 0.3s; text-decoration: none; }
        .subnav-link:hover { color: #dc1414; }
        .subnav-accent { color: rgba(220,20,20,0.8); }

        .hdr-dropdown { position: absolute; top: 100%; left: 0; margin-top: 12px; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5); background: #111; border: 1px solid rgba(255,255,255,0.1); z-index: 50; }
        .hdr-dd-item { width: 100%; text-align: left; padding: 12px 20px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.6); display: flex; align-items: center; gap: 10px; transition: all 0.15s; background: none; border: none; cursor: pointer; font-family: Inter, sans-serif; }
        .hdr-dd-item:hover { color: #fff; background: rgba(255,255,255,0.05); }
        .hdr-dd-more { width: 100%; text-align: left; padding: 14px 20px; font-size: 13px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #dc1414; background: none; border: none; cursor: pointer; }
        .hdr-dd-side { padding: 16px 28px; font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.7); transition: all 0.15s; white-space: nowrap; text-decoration: none; }
        .hdr-dd-side:hover { color: #fff; background: rgba(255,255,255,0.05); }
        .hdr-dd-accent { color: #dc1414; }

        .hdr-search-overlay { position: absolute; left: 0; right: 0; top: 100%; z-index: 50; background: rgba(8,8,8,0.98); border-bottom: 1px solid rgba(220,20,20,0.1); box-shadow: 0 24px 48px rgba(0,0,0,0.8); }

        /* Mobile fullscreen menu */
        .mob-menu { position: fixed; inset: 0; z-index: 50; background: rgba(0,0,0,0.7); }
        .mob-menu-panel { position: absolute; top: 0; right: 0; bottom: 0; width: min(300px, 85vw); background: #0a0a0a; border-left: 1px solid rgba(220,20,20,0.08); display: flex; flex-direction: column; animation: slideIn 0.2s ease-out; }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .mob-menu-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.25rem 1.1rem; border-bottom: 1px solid rgba(220,20,20,0.18); }
        .mob-menu-brand { font-family: Oswald, sans-serif; font-size: 20px; font-weight: 900; letter-spacing: 0.08em; }
        .mob-menu-body { flex: 1; overflow-y: auto; padding: 0.75rem 1rem 1rem; -webkit-overflow-scrolling: touch; }
        .mob-menu-footer { padding: 1rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: center; }
        .mob-section-label { padding: 14px 12px 8px; font-size: 11px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(220,20,20,0.85); }
        .mob-section-toggle { display: flex; align-items: center; justify-content: space-between; width: 100%; background: none; border: none; color: inherit; font: inherit; letter-spacing: inherit; text-transform: inherit; cursor: pointer; padding: 0; }
        /* Main category items — much larger, Oswald, very readable */
        .mob-link { display: flex; align-items: center; justify-content: space-between; padding: 14px 14px; font-family: Oswald, sans-serif; font-size: 22px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: rgba(255,255,255,0.95); border-radius: 6px; transition: all 0.15s; text-decoration: none; width: 100%; background: none; border: none; cursor: pointer; line-height: 1.15; }
        .mob-link:hover, .mob-link:active { color: #fff; background: rgba(220,20,20,0.08); }
        .mob-link-accent { color: #ff1f1f; }
        /* Sub-items (cities, support/inserieren) — noticeably smaller, Inter, clean */
        .mob-sublink { display: flex; align-items: center; padding: 9px 12px 9px 22px; font-family: Inter, sans-serif; font-size: 14px; font-weight: 500; text-transform: none; letter-spacing: 0.01em; color: rgba(255,255,255,0.78); border-radius: 6px; transition: all 0.15s; text-decoration: none; width: 100%; background: none; border: none; cursor: pointer; text-align: left; }
        .mob-sublink:hover, .mob-sublink:active { color: #fff; background: rgba(255,255,255,0.05); }
        .mob-sublink-accent { color: rgba(220,20,20,0.95); font-weight: 600; }
      `}</style>
    </>
  );
});

Header.displayName = 'Header';
export default Header;
