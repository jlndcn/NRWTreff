import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, X, MapPin } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

const SUB_NAV = [
  { name: 'GIRLS', slug: 'girls' },
  { name: 'FKK CLUBS', slug: 'fkk-clubs' },
  { name: 'BORDELLE', slug: 'bordelle' },
  { name: 'ROTZLICHT-CAM', slug: 'rotzlicht-cam', accent: true },
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
      <header className="sticky top-0 z-40" style={{ background: 'rgba(6,6,6,0.45)', backdropFilter: 'blur(20px) saturate(140%)', WebkitBackdropFilter: 'blur(20px) saturate(140%)' }}>
        {/* TOP BAR */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="h-16 sm:h-[72px] flex items-center justify-between relative">

              {/* LEFT NAV */}
              <nav className="hidden lg:flex items-center gap-8" data-testid="header-left-nav">
                <Link to="/browse?filter=cities" data-testid="nav-staedte" className="text-[14px] font-semibold tracking-[0.08em] uppercase text-white/70 hover:text-white transition-all duration-200">
                  Städte
                </Link>
                <Link to="/kontakt" data-testid="nav-kontakt" className="text-[14px] font-semibold tracking-[0.08em] uppercase text-white/70 hover:text-white transition-all duration-200">
                  Kontakt
                </Link>
              </nav>

              {/* CENTER BRAND */}
              <Link to="/" data-testid="site-header-logo-link" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
                <div className="text-[28px] sm:text-[36px] font-black tracking-[0.02em] leading-none" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  <span style={{ color: '#f0f0f0' }}>NRW</span>
                  <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(220,20,20,0.5)]" style={{ color: '#dc1414' }}>TREFF</span>
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] mt-0.5" style={{ color: 'rgba(220,20,20,0.6)' }}>
                  ROTZLICHT
                </div>
              </Link>

              {/* RIGHT: SUCHE + 18+ */}
              <div className="hidden lg:flex items-center gap-7">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  data-testid="nav-search-toggle"
                  className="text-[14px] font-semibold tracking-[0.08em] uppercase text-white/70 hover:text-white transition-all duration-200 flex items-center gap-2"
                >
                  <Search size={16} />
                  Suche
                </button>
                <span className="text-[12px] font-bold tracking-[0.1em] px-3 py-1.5 rounded" style={{ color: 'rgba(220,20,20,0.6)', border: '1px solid rgba(220,20,20,0.2)', background: 'rgba(220,20,20,0.06)' }}>
                  18+
                </span>
              </div>

              {/* MOBILE */}
              <div className="lg:hidden flex items-center gap-4">
                <button onClick={() => setSearchOpen(!searchOpen)} className="text-white/60 hover:text-white transition-colors">
                  <Search size={20} />
                </button>
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <button data-testid="site-header-menu-button" className="text-white/60 hover:text-white transition-colors">
                      <Menu size={22} />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="border-l w-72 p-0" style={{ background: '#0a0a0a', borderColor: 'rgba(220,20,20,0.08)' }}>
                    <SheetHeader className="px-5 pt-6 pb-4">
                      <SheetTitle style={{ fontFamily: 'Oswald, sans-serif', fontSize: '24px' }}>
                        <span style={{ color: '#f0f0f0' }}>NRW</span><span style={{ color: '#dc1414' }}>TREFF</span>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="px-4 space-y-0.5">
                      <Link to="/" onClick={() => setOpen(false)} className="block px-3 py-2.5 text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/5 rounded transition-colors">Startseite</Link>
                      <Link to="/browse?filter=cities" onClick={() => setOpen(false)} className="block px-3 py-2.5 text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/5 rounded transition-colors">Städte</Link>
                      <Link to="/kontakt" onClick={() => setOpen(false)} className="block px-3 py-2.5 text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/5 rounded transition-colors">Kontakt</Link>
                      <div className="pt-4 mt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="px-3 pb-2 text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: 'rgba(220,20,20,0.35)' }}>Kategorien</div>
                        {SUB_NAV.map(item => (
                          <Link key={item.name} to={`/kategorien/${item.slug}`} onClick={() => setOpen(false)}
                            className="block px-3 py-2.5 text-[13px] font-medium rounded transition-colors"
                            style={{ color: item.accent ? 'rgba(220,20,20,0.7)' : 'rgba(255,255,255,0.5)' }}
                          >{item.name}</Link>
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        {/* SUB-NAV */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(4,4,4,0.5)' }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex items-center justify-center gap-6 sm:gap-8 lg:gap-10 py-2.5 overflow-x-auto scrollbar-hide">
              {SUB_NAV.map(item => (
                <Link
                  key={item.name}
                  to={`/kategorien/${item.slug}`}
                  data-testid={`subnav-${item.slug}`}
                  className="whitespace-nowrap text-[12px] sm:text-[13px] font-semibold tracking-[0.12em] uppercase transition-colors duration-200"
                  style={{ color: item.accent ? 'rgba(220,20,20,0.7)' : 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => e.target.style.color = item.accent ? '#dc1414' : '#fff'}
                  onMouseLeave={e => e.target.style.color = item.accent ? 'rgba(220,20,20,0.7)' : 'rgba(255,255,255,0.55)'}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* SEARCH OVERLAY */}
        {searchOpen && (
          <div className="absolute left-0 right-0 z-50" style={{ top: '100%', background: 'rgba(8,8,8,0.98)', borderBottom: '1px solid rgba(220,20,20,0.1)', boxShadow: '0 24px 48px rgba(0,0,0,0.8)' }}>
            <div className="max-w-2xl mx-auto px-6 py-5">
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <Search size={16} style={{ color: 'rgba(220,20,20,0.5)' }} />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Stadt eingeben..." autoFocus data-testid="header-search-input"
                  className="flex-1 bg-transparent text-[15px] tracking-wide text-white/80 placeholder-white/25 focus:outline-none" style={{ caretColor: '#dc1414' }} />
                <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="text-white/30 hover:text-white/60 transition-colors"><X size={16} /></button>
              </form>
            </div>
          </div>
        )}
      </header>
      {searchOpen && <div className="fixed inset-0 z-30" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => { setSearchOpen(false); setSearchQuery(''); }} />}
    </>
  );
};

export default Header;
