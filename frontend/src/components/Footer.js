import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from './ui/separator';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 mt-16" style={{ background: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand + Social Media */}
          <div>
            <div className="text-xl font-black mb-3" style={{ fontFamily: 'Oswald, sans-serif' }}>
              <span style={{ color: '#f0f0f0' }}>NRW</span><span style={{ color: '#cc0000' }}>TREFF</span>
            </div>
            <div className="text-[10px] font-medium tracking-wider mb-4" style={{ color: '#666' }}>ROTZLICHT</div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 mb-5">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" data-testid="footer-social-instagram"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" data-testid="footer-social-twitter"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>

            {/* External Links */}
            <div className="space-y-1.5">
              <a href="https://boyclubs.de" target="_blank" rel="noopener noreferrer" className="block text-sm text-white/40 hover:text-white/70 transition-colors">
                Boy Clubs
              </a>
              <a href="https://poppen.de" target="_blank" rel="noopener noreferrer" className="block text-sm text-white/40 hover:text-white/70 transition-colors">
                Poppen.de
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-3">Navigation</div>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-white/50 hover:text-white transition-colors">Startseite</Link>
              <Link to="/browse" className="block text-sm text-white/50 hover:text-white transition-colors">Alle Profile</Link>
              <Link to="/kontakt" className="block text-sm text-white/50 hover:text-white transition-colors">Kontakt</Link>
              <Link to="/bewerben" className="block text-sm text-white/50 hover:text-white transition-colors">Bewerben</Link>
            </div>
          </div>

          {/* Legal - Impressum, AGB, Datenschutz */}
          <div>
            <div className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-3">Rechtliches</div>
            <div className="space-y-2">
              <Link to="/impressum" className="block text-sm text-white/50 hover:text-white transition-colors">Impressum</Link>
              <Link to="/agb" className="block text-sm text-white/50 hover:text-white transition-colors">AGB</Link>
              <Link to="/datenschutz" className="block text-sm text-white/50 hover:text-white transition-colors">Datenschutz</Link>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-6" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <span>&copy; {new Date().getFullYear()} NRW Treff. Alle Rechte vorbehalten.</span>
          <div className="text-center">
            <div className="text-white/40">Keine Gewährleistung für Inhalt der Profile.</div>
            <div className="mt-1">Diese Seite enthält Inhalte für Erwachsene (18+).</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
