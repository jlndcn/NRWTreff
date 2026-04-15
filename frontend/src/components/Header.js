import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, X, MapPin, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

const SUB_NAV = [
  { name: 'GIRLS', slug: 'girls' },
  { name: 'FKK CLUBS', slug: 'fkk-clubs' },
  { name: 'BORDELLE', slug: 'bordelle' },
  { name: 'ROTZLICHT-CAM', slug: 'rotzlicht-cam', accent: true },
];

const NRW_CITIES = ['Köln','Düsseldorf','Dortmund','Essen','Duisburg','Bochum','Wuppertal','Bielefeld','Bonn','Münster'];

const Header = ({ cities = [], regions = [] }) => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [staedteOpen, setStaedteOpen] = useState(false);
  const [kontaktOpen, setKontaktOpen] = useState(false);
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const city = cities.find(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
      if (city) navigate(`/stadte/${city.slug}`);
      else navigate(`/browse?search=${searchQuery}`);
      setSearchOpen(false); setSearchQuery('');
    }
  };

  const handleCityClick = (name) => {
    const slug = name.toLowerCase().replace(/ü/g,'ue').replace(/ö/g,'oe').replace(/ä/g,'ae').replace(/ß/g,'ss').replace(/\s+/g,'-');
    setStaedteOpen(false); navigate(`/stadte/${slug}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40" style={{ background: 'rgba(6,6,6,0.45)', backdropFilter: 'blur(20px) saturate(140%)' }}>
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="h-16 sm:h-[72px] flex items-center justify-between relative">

              {/* LEFT */}
              <nav className="hidden lg:flex items-center gap-8">
                <div ref={staedteRef} className="relative">
                  <button onClick={() => { setStaedteOpen(!staedteOpen); setKontaktOpen(false); }} data-testid="nav-staedte"
                    className="nav-link-hover text-[15px] font-semibold tracking-[0.06em] uppercase flex items-center gap-1.5">
                    Städte <ChevronDown size={14} className={`transition-transform duration-200 ${staedteOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {staedteOpen && (
                    <div className="absolute top-full left-0 mt-3 w-56 rounded-xl overflow-hidden shadow-2xl" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {NRW_CITIES.map(city => (
                        <button key={city} onClick={() => handleCityClick(city)}
                          className="w-full text-left px-5 py-3 text-[14px] font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2.5">
                          <MapPin size={13} className="opacity-40" />{city}
                        </button>
                      ))}
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <button onClick={() => { setStaedteOpen(false); setSearchOpen(true); }}
                          className="w-full text-left px-5 py-3.5 text-[13px] font-bold tracking-wide uppercase" style={{ color: '#dc1414' }}>
                          Mehr Städte...
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* KONTAKT — side by side dropdown */}
                <div ref={kontaktRef} className="relative">
                  <button onClick={() => { setKontaktOpen(!kontaktOpen); setStaedteOpen(false); }} data-testid="nav-kontakt"
                    className="nav-link-hover text-[15px] font-semibold tracking-[0.06em] uppercase flex items-center gap-1.5">
                    Kontakt <ChevronDown size={14} className={`transition-transform duration-200 ${kontaktOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {kontaktOpen && (
                    <div className="absolute top-full left-0 mt-3 rounded-xl overflow-hidden shadow-2xl flex" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <Link to="/support" onClick={() => setKontaktOpen(false)}
                        className="px-7 py-4 text-[15px] font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap">Support</Link>
                      <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)' }} />
                      <Link to="/inserieren" onClick={() => setKontaktOpen(false)}
                        className="px-7 py-4 text-[15px] font-semibold whitespace-nowrap transition-colors hover:bg-red-500/5" style={{ color: '#dc1414' }}>Inserieren</Link>
                    </div>
                  )}
                </div>
              </nav>

              {/* CENTER */}
              <Link to="/" data-testid="site-header-logo-link" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
                <div className="text-[30px] sm:text-[40px] font-black tracking-[0.02em] leading-none" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  <span style={{ color: '#f0f0f0' }}>NRW</span>
                  <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(220,20,20,0.5)]" style={{ color: '#dc1414' }}>TREFF</span>
                </div>
                <div className="text-[11px] sm:text-[12px] font-bold tracking-[0.25em] mt-0.5" style={{ color: 'rgba(220,20,20,0.6)' }}>ROTZLICHT</div>
              </Link>

              {/* RIGHT */}
              <div className="hidden lg:flex items-center gap-7">
                <button onClick={() => setSearchOpen(!searchOpen)} data-testid="nav-search-toggle"
                  className="nav-link-hover text-[15px] font-semibold tracking-[0.06em] uppercase flex items-center gap-2">
                  <Search size={16} /> Suche
                </button>
                <span className="text-[12px] font-bold tracking-[0.1em] px-3 py-1.5 rounded" style={{ color: 'rgba(220,20,20,0.6)', border: '1px solid rgba(220,20,20,0.2)', background: 'rgba(220,20,20,0.06)' }}>18+</span>
              </div>

              {/* MOBILE */}
              <div className="lg:hidden flex items-center gap-4">
                <button onClick={() => setSearchOpen(!searchOpen)} className="text-white/60 hover:text-white"><Search size={20} /></button>
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild><button data-testid="site-header-menu-button" className="text-white/60 hover:text-white"><Menu size={22} /></button></SheetTrigger>
                  <SheetContent side="right" className="border-l w-72 p-0" style={{ background: '#0a0a0a', borderColor: 'rgba(220,20,20,0.08)' }}>
                    <SheetHeader className="px-5 pt-6 pb-4"><SheetTitle style={{ fontFamily: 'Oswald, sans-serif', fontSize: '24px' }}><span style={{ color: '#f0f0f0' }}>NRW</span><span style={{ color: '#dc1414' }}>TREFF</span></SheetTitle></SheetHeader>
                    <div className="px-4 space-y-0.5">
                      <Link to="/" onClick={() => setOpen(false)} className="mobile-nav-link">Startseite</Link>
                      <Link to="/support" onClick={() => setOpen(false)} className="mobile-nav-link">Support</Link>
                      <Link to="/inserieren" onClick={() => setOpen(false)} className="mobile-nav-link" style={{ color: '#dc1414' }}>Inserieren</Link>
                      <div className="pt-3 mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        {SUB_NAV.map(item => (
                          <Link key={item.name} to={`/kategorien/${item.slug}`} onClick={() => setOpen(false)} className="mobile-nav-link" style={item.accent ? { color: 'rgba(220,20,20,0.7)' } : {}}>{item.name}</Link>
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        {/* SUB-NAV — whiter text */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(4,4,4,0.5)' }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex items-center justify-center gap-6 sm:gap-8 lg:gap-10 py-2.5 overflow-x-auto scrollbar-hide">
              {SUB_NAV.map(item => (
                <Link key={item.name} to={`/kategorien/${item.slug}`} data-testid={`subnav-${item.slug}`}
                  className="subnav-link whitespace-nowrap text-[11px] sm:text-[12px] font-semibold tracking-[0.14em] uppercase"
                  style={{ color: item.accent ? 'rgba(220,20,20,0.8)' : 'rgba(255,255,255,0.7)' }}>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {searchOpen && (
          <div className="absolute left-0 right-0 z-50" style={{ top: '100%', background: 'rgba(8,8,8,0.98)', borderBottom: '1px solid rgba(220,20,20,0.1)', boxShadow: '0 24px 48px rgba(0,0,0,0.8)' }}>
            <div className="max-w-2xl mx-auto px-6 py-5">
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
      {searchOpen && <div className="fixed inset-0 z-30 bg-black/60" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} />}

      <style>{`
        .nav-link-hover { color: rgba(255,255,255,0.6); transition: color 0.3s; }
        .nav-link-hover:hover { color: #dc1414; }
        .subnav-link { transition: color 0.3s; }
        .subnav-link:hover { color: #dc1414 !important; }
        .mobile-nav-link { display:block; padding:10px 8px; font-size:13px; letter-spacing:0.06em; text-transform:uppercase; color:rgba(255,255,255,0.5); transition:color 0.15s,background 0.15s; border-radius:4px; }
        .mobile-nav-link:hover { color:#f0f0f0; background:rgba(255,20,20,0.06); }
      `}</style>
    </>
  );
};

export default Header;
