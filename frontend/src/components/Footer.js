import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from './ui/separator';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 mt-16" style={{ background: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-xl font-black mb-3" style={{ fontFamily: 'Oswald, sans-serif' }}>
              <span style={{ color: '#f0f0f0' }}>NRW</span><span style={{ color: '#cc0000' }}>TREFF</span>
            </div>
            <div className="text-[10px] font-medium tracking-wider mb-3" style={{ color: '#666' }}>ROTZLICHT</div>
            <p className="text-sm text-white/50 leading-relaxed">
              Diskrete Kontakte in Nordrhein-Westfalen.
              Nur für Personen ab 18 Jahren.
            </p>
            <div className="mt-3 inline-block border rounded px-2 py-0.5 text-xs text-white/40" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>18+ ONLY</div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-3">Navigation</div>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-white/50 hover:text-white transition-colors">Startseite</Link>
              <Link to="/kontakt" className="block text-sm text-white/50 hover:text-white transition-colors">Kontakt & Inserieren</Link>
              <Link to="/regionen/ruhrgebiet" className="block text-sm text-white/50 hover:text-white transition-colors">Ruhrgebiet</Link>
              <Link to="/regionen/rheinland" className="block text-sm text-white/50 hover:text-white transition-colors">Rheinland</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <div className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-3">Rechtliches</div>
            <div className="space-y-2">
              <Link to="/impressum" className="block text-sm text-white/50 hover:text-white transition-colors">Impressum</Link>
              <Link to="/datenschutz" className="block text-sm text-white/50 hover:text-white transition-colors">Datenschutz</Link>
              <Link to="/agb" className="block text-sm text-white/50 hover:text-white transition-colors">AGB</Link>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <span>© {new Date().getFullYear()} NRW Treff. Alle Rechte vorbehalten.</span>
          <div className="text-center space-y-1">
            <div>Diese Seite enthält Inhalte für Erwachsene (18+).</div>
            <div className="text-white/40">Keine Haftung für Abweichungen zwischen Profil und Person. Alle Angaben ohne Gewähr.</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
