import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, MapPin } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

const SUB_NAV = [
  { name: 'Girls', slug: 'girls' },
  { name: 'FKK Clubs', slug: 'fkk-clubs' },
  { name: 'Rotzlicht.com', href: '/' },
];

const Header = ({ cities = [], regions = [] }) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40" style={{ background: 'rgba(10,10,10,0.96)', backdropFilter: 'blur(12px)' }}>
      {/* Main Header */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" data-testid="site-header-logo-link" className="flex items-baseline gap-2 group">
            <div className="text-2xl sm:text-3xl font-black tracking-tight leading-none" style={{ fontFamily: 'Oswald, sans-serif' }}>
              <span style={{ color: '#f0f0f0' }}>NRW</span><span style={{ color: '#cc0000' }}>TREFF</span>
            </div>
            <div className="text-[9px] sm:text-[10px] font-medium tracking-wider" style={{ color: '#666', letterSpacing: '0.08em' }}>
              ROTZLICHT
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-3">
            <Link
              to="/browse?filter=cities"
              data-testid="nav-staedte-btn"
              className="px-4 py-1.5 rounded text-sm font-semibold border transition-all hover:bg-white/5"
              style={{ borderColor: 'rgba(255,255,255,0.25)', color: '#e0e0e0' }}
            >
              Städte
            </Link>
            <Link
              to="/kontakt"
              data-testid="nav-kontakt-btn"
              className="px-4 py-1.5 rounded text-sm font-semibold border transition-all hover:bg-white/5"
              style={{ borderColor: 'rgba(255,255,255,0.25)', color: '#e0e0e0' }}
            >
              Kontakt
            </Link>
            <div className="px-2.5 py-1 rounded text-xs font-bold border" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#999' }}>
              18+
            </div>
          </nav>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button data-testid="site-header-menu-button" className="md:hidden text-white/70 hover:text-white p-1">
                <Menu size={22} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="border-white/10 w-72" style={{ background: '#111' }}>
              <SheetHeader>
                <SheetTitle style={{ fontFamily: 'Oswald, sans-serif' }}>
                  <span style={{ color: '#f0f0f0' }}>NRW</span><span style={{ color: '#cc0000' }}>TREFF</span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-1">
                <Link to="/" onClick={() => setOpen(false)} className="block px-3 py-2 rounded text-white/80 hover:text-white hover:bg-white/5 transition-colors">Startseite</Link>

                <div className="px-3 py-2 text-xs text-white/40 uppercase tracking-widest font-medium mt-4">Kategorien</div>
                {SUB_NAV.map(item => (
                  <Link
                    key={item.name}
                    to={item.href || `/kategorien/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="px-3 py-2 text-xs text-white/40 uppercase tracking-widest font-medium mt-4">Städte</div>
                {cities.map(city => (
                  <Link key={city.slug} to={`/stadte/${city.slug}`} onClick={() => setOpen(false)} className="block px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                    <MapPin size={12} className="inline mr-2 opacity-50" />{city.name}
                  </Link>
                ))}

                <div className="border-t border-white/10 mt-4 pt-4 space-y-2">
                  <Link to="/kontakt" onClick={() => setOpen(false)} className="block w-full text-center py-2.5 rounded-md font-medium transition-colors" style={{ background: '#cc0000', color: '#fff' }}>Kontakt</Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Sub-Navigation: Girls · FKK Clubs · Rotzlicht.com */}
      <div className="border-b border-white/8" style={{ background: 'rgba(15,15,15,0.95)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2" style={{ WebkitOverflowScrolling: 'touch' }}>
            {SUB_NAV.map((item, i) => (
              <React.Fragment key={item.name}>
                <Link
                  to={item.href || `/kategorien/${item.slug}`}
                  data-testid={`nav-sub-${item.name.toLowerCase().replace(/[\s.]/g, '-')}`}
                  className="whitespace-nowrap px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors hover:text-white hover:bg-white/5"
                  style={{ color: '#999' }}
                >
                  {item.name}
                </Link>
                {i < SUB_NAV.length - 1 && (
                  <span className="text-white/20 text-xs select-none">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
