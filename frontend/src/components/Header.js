import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, MapPin, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

const Header = ({ cities = [], regions = [] }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10" style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo - NRWTREFF als ein Wort */}
        {/* Logo - NRWTREFF als ein Wort */}
        <Link to="/" data-testid="site-header-logo-link" className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2.5 group">
          <div className="text-2xl sm:text-3xl font-black tracking-tight leading-none" style={{ fontFamily: 'Oswald, sans-serif' }}>
            <span style={{ color: '#f0f0f0' }}>NRW</span><span style={{ color: '#cc0000' }}>TREFF</span>
          </div>
          <div className="text-[9px] sm:text-[10px] font-medium tracking-wider" style={{ color: '#666', letterSpacing: '0.08em' }}>
            ROTZLICHT
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm ml-auto">
          <Link to="/" className="text-white/70 hover:text-white transition-colors">Startseite</Link>
          <div className="relative group">
            <button className="flex items-center gap-1 text-white/70 hover:text-white transition-colors">
              Städte <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 mt-2 w-56 rounded-lg border border-white/10 shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50" style={{ background: '#111' }}>
              {cities.slice(0, 10).map(city => (
                <Link key={city.slug} to={`/stadte/${city.slug}`} className="block px-4 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
          <Link to="/kontakt" className="px-4 py-1.5 rounded-md text-sm font-medium border transition-colors" style={{ borderColor: '#cc0000', color: '#ff2244' }}>Kontakt</Link>
          <div className="w-px h-4 bg-white/10 mx-2"></div>
          <div className="px-2 py-0.5 rounded text-xs font-semibold border border-white/20 text-white/40">18+</div>
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
              <div className="px-3 py-2 text-xs text-white/40 uppercase tracking-widest font-medium mt-4">Städte</div>
              {cities.map(city => (
                <Link key={city.slug} to={`/stadte/${city.slug}`} onClick={() => setOpen(false)} className="block px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                  <MapPin size={12} className="inline mr-2 opacity-50" />{city.name}
                </Link>
              ))}
              <div className="px-3 py-2 text-xs text-white/40 uppercase tracking-widest font-medium mt-4">Regionen</div>
              {regions.map(r => (
                <Link key={r.slug} to={`/regionen/${r.slug}`} onClick={() => setOpen(false)} className="block px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                  {r.name}
                </Link>
              ))}
              <div className="border-t border-white/10 mt-4 pt-4">
                <Link to="/kontakt" onClick={() => setOpen(false)} className="block w-full text-center py-2.5 rounded-md font-medium transition-colors" style={{ background: '#cc0000', color: '#fff' }}>Kontakt</Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* 18+ Badge Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs text-white/30 border border-white/20 rounded px-2 py-0.5">18+</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
