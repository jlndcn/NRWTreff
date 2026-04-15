import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';

export default function NotFoundPage() {
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <SEOHead title="404 – Seite nicht gefunden" robots="noindex" />
      <Header />
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-8xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif', color: '#cc0000', opacity: 0.4 }}>404</div>
        <h1 className="text-2xl font-bold text-white/60 mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>Seite nicht gefunden</h1>
        <p className="text-white/40 mb-8">Diese Seite existiert nicht oder wurde verschoben.</p>
        <Link to="/" className="px-6 py-3 rounded-lg font-semibold" style={{ background: '#cc0000', color: '#fff' }}>Zur Startseite</Link>
      </div>
      <Footer />
    </div>
  );
}
