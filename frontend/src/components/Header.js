import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, X, MapPin } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

const SUB_NAV = [
  { name: 'GIRLS', slug: 'girls' },
  { name: 'FKK CLUBS', slug: 'fkk-clubs' },
  { name: 'BORDELLE', slug: 'bordelle' },
  { name: 'ROTZLICHT CAM', slug: 'rotzlicht-cam', accent: true },
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
      <header className="sticky top-0 z-40" style={{ background: 'rgba(8,8,8,0.75)', backdropFilter: 'blur(14px) saturate(120%)', WebkitBackdropFilter: 'blur(14px) saturate(120%)' }}>
        {/* ═══ TOP BAR ═══ */}
        <div style={{ borderBottom: '1px solid rgba(255,30,30,0.06)' }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="h-16 sm:h-[72px] flex items-center justify-between relative">

              {/* LEFT: Nav links — bigger */}
              <nav className="hidden lg:flex items-center gap-7 xl:gap-9" data-testid="header-left-nav">
                <Link
                  to="/browse?filter=cities"
                  data-testid="nav-staedte"
                  className="header-nav-link text-[13px] font-semibold tracking-[0.14em] uppercase"
                >
                  Städte
                </Link>
                <Link
                  to="/kontakt"
                  data-testid="nav-kontakt"
                  className="header-nav-link text-[13px] font-semibold tracking-[0.14em] uppercase"
                >
                  Kontakt
                </Link>
              </nav>

              {/* CENTER: Brand — bigger */}
              <Link
                to="/"
                data-testid="site-header-logo-link"
                className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group"
              >
                <div
                  className="text-[26px] sm:text-[32px] font-black tracking-[0.03em] leading-none"
                  style={{ fontFamily: 'Oswald, sans-serif' }}
                >
                  <span className="transition-all duration-300" style={{ color: '#eee' }}>NRW</span>
                  <span
                    className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,20,20,0.4)]"
                    style={{ color: '#e01020' }}
                  >TREFF</span>
                </div>
                <div
                  className="text-[9px] sm:text-[10px] font-semibold tracking-[0.3em] mt-0.5"
                  style={{ color: 'rgba(255,40,40,0.35)' }}
                >
                  ROTZLICHT
                </div>
              </Link>

              {/* RIGHT: SUCHE bigger + 18+ far right */}
              <div className="hidden lg:flex items-center gap-7 xl:gap-9">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  data-testid="nav-search-toggle"
                  className="header-nav-link text-[13px] font-semibold tracking-[0.14em] uppercase flex items-center gap-2"
                >
                  <Search size={15} className="opacity-60" />
                  Suche
                </button>
                <span
                  className="text-[11px] font-bold tracking-[0.12em] px-2.5 py-1 rounded"
                  style={{ color: 'rgba(255,30,30,0.45)', border: '1px solid rgba(255,30,30,0.15)', background: 'rgba(255,20,20,0.04)' }}
                >
                  18+
                </span>
              </div>

              {/* MOBILE */}
              <div className="lg:hidden flex items-center gap-4">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="text-white/40 hover:text-red-400 transition-colors"
                >
                  <Search size={20} />
                </button>
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <button data-testid="site-header-menu-button" className="text-white/40 hover:text-red-400 transition-colors">
                      <Menu size={22} />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="border-l w-72 p-0" style={{ background: '#0c0c0c', borderColor: 'rgba(255,20,20,0.08)' }}>
                    <SheetHeader className="px-5 pt-6 pb-4">
                      <SheetTitle style={{ fontFamily: 'Oswald, sans-serif', fontSize: '22px' }}>
                        <span style={{ color: '#eee' }}>NRW</span>
                        <span style={{ color: '#e01020' }}>TREFF</span>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="px-3">
                      <Link to="/" onClick={() => setOpen(false)} className="mobile-nav-link">Startseite</Link>
                      <Link to="/browse?filter=cities" onClick={() => setOpen(false)} className="mobile-nav-link">Städte</Link>
                      <Link to="/kontakt" onClick={() => setOpen(false)} className="mobile-nav-link">Kontakt</Link>

                      <div className="mt-5 mb-2 px-2 text-[9px] tracking-[0.25em] uppercase" style={{ color: 'rgba(255,30,30,0.3)' }}>Kategorien</div>
                      {SUB_NAV.map(item => (
                        <Link
                          key={item.name}
                          to={item.href || `/kategorien/${item.slug}`}
                          onClick={() => setOpen(false)}
                          className="mobile-nav-link"
                          style={item.accent ? { color: 'rgba(255,30,30,0.6)' } : {}}
                        >
                          {item.name}
                        </Link>
                      ))}

                      {cities.length > 0 && (
                        <>
                          <div className="mt-5 mb-2 px-2 text-[9px] tracking-[0.25em] uppercase" style={{ color: 'rgba(255,30,30,0.3)' }}>Städte</div>
                          {cities.slice(0, 6).map(city => (
                            <Link key={city.slug} to={`/stadte/${city.slug}`} onClick={() => setOpen(false)} className="mobile-nav-link text-white/30">
                              {city.name}
                            </Link>
                          ))}
                        </>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SUB-NAV ═══ */}
        <div style={{ borderBottom: '1px solid rgba(255,20,20,0.04)', background: 'rgba(6,6,6,0.6)' }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex items-center justify-center gap-5 sm:gap-7 lg:gap-9 py-2.5 overflow-x-auto scrollbar-hide">
              {SUB_NAV.map(item => (
                <Link
                  key={item.name}
                  to={item.href || `/kategorien/${item.slug}`}
                  data-testid={`subnav-${item.slug}`}
                  className="subnav-link whitespace-nowrap text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase"
                  style={{ color: item.accent ? 'rgba(255,30,30,0.55)' : 'rgba(255,255,255,0.3)' }}
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
              background: 'rgba(10,10,10,0.97)',
              borderBottom: '1px solid rgba(255,20,20,0.1)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.7)'
            }}
          >
            <div className="max-w-2xl mx-auto px-6 py-5">
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <Search size={16} style={{ color: 'rgba(255,30,30,0.4)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Stadt eingeben..."
                  autoFocus
                  data-testid="header-search-input"
                  className="flex-1 bg-transparent text-sm tracking-wide text-white/70 placeholder-white/20 focus:outline-none"
                  style={{ caretColor: '#e01020' }}
                />
                <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="text-white/20 hover:text-white/50 transition-colors">
                  <X size={16} />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-30" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => { setSearchOpen(false); setSearchQuery(''); }} />
      )}

      <style>{`
        .header-nav-link {
          color: rgba(255,255,255,0.45);
          transition: color 0.2s, text-shadow 0.2s;
        }
        .header-nav-link:hover {
          color: #f0f0f0;
          text-shadow: 0 0 12px rgba(255,20,20,0.2);
        }
        .subnav-link {
          transition: color 0.2s;
        }
        .subnav-link:hover {
          color: rgba(255,30,30,0.8) !important;
        }
        .mobile-nav-link {
          display: block;
          padding: 10px 8px;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          transition: color 0.15s, background 0.15s;
          border-radius: 4px;
        }
        .mobile-nav-link:hover {
          color: #f0f0f0;
          background: rgba(255,20,20,0.06);
        }
      `}</style>
    </>
  );
};

export default Header;
