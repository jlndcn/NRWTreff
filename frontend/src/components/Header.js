import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, X, MapPin } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

const SUB_NAV = [
  { name: 'GIRLS', slug: 'girls' },
  { name: 'FKK CLUBS', slug: 'fkk-clubs' },
  { name: 'ROTZLICHT.COM', href: '/', accent: true },
];

const Header = ({ cities = [], regions = [] }) => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const city = cities.find(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
      if (city) navigate(`/stadte/${city.slug}`);
      else navigate(`/browse?search=${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40" style={{ background: '#0a0a0a' }}>
        {/* ═══ TOP BAR ═══ Everlane-style: Left nav | Center brand | Right utils */}
        <div className="border-b" style={{ borderColor: 'rgba(0, 229, 255, 0.08)' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="h-14 sm:h-16 flex items-center justify-between relative">

              {/* LEFT: Navigation */}
              <nav className="hidden lg:flex items-center gap-6 xl:gap-8" data-testid="header-left-nav">
                <Link
                  to="/browse?filter=cities"
                  data-testid="nav-staedte"
                  className="text-[11px] font-medium tracking-[0.18em] uppercase transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => e.target.style.color = '#00e5ff'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
                >
                  Städte
                </Link>
                <Link
                  to="/kontakt"
                  data-testid="nav-kontakt"
                  className="text-[11px] font-medium tracking-[0.18em] uppercase transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => e.target.style.color = '#00e5ff'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
                >
                  Kontakt
                </Link>
                <span
                  className="text-[11px] font-medium tracking-[0.18em] uppercase"
                  style={{ color: 'rgba(255, 45, 123, 0.5)' }}
                >
                  18+
                </span>
              </nav>

              {/* CENTER: Brand */}
              <Link
                to="/"
                data-testid="site-header-logo-link"
                className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group"
              >
                <div
                  className="text-xl sm:text-2xl font-black tracking-[0.04em] leading-none transition-all duration-300"
                  style={{ fontFamily: 'Oswald, sans-serif' }}
                >
                  <span style={{ color: '#e8e8e8' }}>NRW</span>
                  <span
                    className="transition-all duration-300"
                    style={{ color: '#00e5ff' }}
                  >TREFF</span>
                </div>
                <div
                  className="text-[8px] sm:text-[9px] font-medium tracking-[0.25em] mt-0.5 transition-colors duration-300"
                  style={{ color: 'rgba(255, 45, 123, 0.45)' }}
                >
                  ROTZLICHT
                </div>
              </Link>

              {/* RIGHT: Utilities */}
              <div className="hidden lg:flex items-center gap-6 xl:gap-8">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  data-testid="nav-search-toggle"
                  className="text-[11px] font-medium tracking-[0.18em] uppercase transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => e.target.style.color = '#00e5ff'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
                >
                  Suche
                </button>
              </div>

              {/* MOBILE: Hamburger */}
              <div className="lg:hidden flex items-center gap-4">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="text-white/50 hover:text-cyan-300 transition-colors"
                >
                  <Search size={18} />
                </button>
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <button data-testid="site-header-menu-button" className="text-white/50 hover:text-cyan-300 transition-colors">
                      <Menu size={20} />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="border-l w-72" style={{ background: '#0a0a0a', borderColor: 'rgba(0,229,255,0.1)' }}>
                    <SheetHeader>
                      <SheetTitle style={{ fontFamily: 'Oswald, sans-serif' }}>
                        <span style={{ color: '#e8e8e8' }}>NRW</span>
                        <span style={{ color: '#00e5ff' }}>TREFF</span>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-8 space-y-1">
                      <Link to="/" onClick={() => setOpen(false)} className="block px-3 py-2.5 text-xs tracking-[0.15em] uppercase text-white/60 hover:text-cyan-300 transition-colors">
                        Startseite
                      </Link>
                      <Link to="/browse?filter=cities" onClick={() => setOpen(false)} className="block px-3 py-2.5 text-xs tracking-[0.15em] uppercase text-white/60 hover:text-cyan-300 transition-colors">
                        Städte
                      </Link>
                      <Link to="/kontakt" onClick={() => setOpen(false)} className="block px-3 py-2.5 text-xs tracking-[0.15em] uppercase text-white/60 hover:text-cyan-300 transition-colors">
                        Kontakt
                      </Link>

                      <div className="pt-4 mt-4" style={{ borderTop: '1px solid rgba(0,229,255,0.08)' }}>
                        <div className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(0,229,255,0.35)' }}>
                          Kategorien
                        </div>
                        {SUB_NAV.map(item => (
                          <Link
                            key={item.name}
                            to={item.href || `/kategorien/${item.slug}`}
                            onClick={() => setOpen(false)}
                            className="block px-3 py-2.5 text-xs tracking-[0.15em] uppercase transition-colors"
                            style={{ color: item.accent ? 'rgba(255,45,123,0.6)' : 'rgba(255,255,255,0.5)' }}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>

                      {cities.length > 0 && (
                        <div className="pt-4 mt-2" style={{ borderTop: '1px solid rgba(0,229,255,0.08)' }}>
                          <div className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(0,229,255,0.35)' }}>
                            Städte
                          </div>
                          {cities.slice(0, 8).map(city => (
                            <Link
                              key={city.slug}
                              to={`/stadte/${city.slug}`}
                              onClick={() => setOpen(false)}
                              className="block px-3 py-2 text-xs tracking-[0.1em] text-white/40 hover:text-cyan-300 transition-colors"
                            >
                              {city.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SUB-NAVIGATION BAR ═══ Centered category links */}
        <div style={{ borderBottom: '1px solid rgba(0, 229, 255, 0.06)', background: '#090909' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="flex items-center justify-center gap-6 sm:gap-8 lg:gap-10 py-2.5 overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
              {SUB_NAV.map(item => (
                <Link
                  key={item.name}
                  to={item.href || `/kategorien/${item.slug}`}
                  data-testid={`subnav-${item.slug || 'home'}`}
                  className="whitespace-nowrap text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-200"
                  style={{ color: item.accent ? 'rgba(255, 45, 123, 0.55)' : 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={e => e.target.style.color = item.accent ? '#ff2d7b' : '#00e5ff'}
                  onMouseLeave={e => e.target.style.color = item.accent ? 'rgba(255, 45, 123, 0.55)' : 'rgba(255,255,255,0.4)'}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ SEARCH OVERLAY ═══ */}
        {searchOpen && (
          <div
            className="absolute left-0 right-0 z-50"
            style={{
              top: '100%',
              background: '#0a0a0a',
              borderBottom: '1px solid rgba(0,229,255,0.12)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
            }}
          >
            <div className="max-w-2xl mx-auto px-6 py-5">
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <Search size={16} style={{ color: '#00e5ff', opacity: 0.5 }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Stadt eingeben..."
                  autoFocus
                  data-testid="header-search-input"
                  className="flex-1 bg-transparent text-sm tracking-wide text-white/80 placeholder-white/25 focus:outline-none"
                  style={{ caretColor: '#00e5ff' }}
                />
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="text-white/30 hover:text-white/60 transition-colors"
                >
                  <X size={16} />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Click-away overlay for search */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-30"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
        />
      )}
    </>
  );
};

export default Header;
