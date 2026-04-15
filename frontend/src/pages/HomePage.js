import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronRight, MapPin } from 'lucide-react';
import api from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileCard from '../components/ProfileCard';
import StickyFilterBar from '../components/StickyFilterBar';
import SEOHead from '../components/SEOHead';
import AgeVerificationModal from '../components/AgeVerificationModal';
import { Skeleton } from '../components/ui/skeleton';

const BREADCRUMB_JSON = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Startseite", "item": "/" }]
};

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [cities, setCities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [categories, setCategories] = useState([]);

  // Load initial data once
  useEffect(() => {
    const loadData = async () => {
      try {
        const [citiesRes, regionsRes, catsRes] = await Promise.all([
          api.get('/cities'),
          api.get('/regions'),
          api.get('/categories')
        ]);
        setCities(citiesRes.data);
        setRegions(regionsRes.data);
        setCategories(catsRes.data);
      } catch (err) {
        // Silently handle error in production
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Load once on mount

  // Load profiles when filters change
  useEffect(() => {
    const loadProfiles = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 20,
          status: 'active'
        };
        const city = searchParams.get('city');
        const region = searchParams.get('region');
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const age_min = searchParams.get('age_min');
        const age_max = searchParams.get('age_max');
        if (city) params.city = city;
        if (region) params.region = region;
        if (category) params.category = category;
        if (search) params.search = search;
        if (age_min) params.age_min = age_min;
        if (age_max) params.age_max = age_max;
        const res = await api.get('/profiles', { params });
        setProfiles(res.data.profiles);
        setTotal(res.data.total);
        setPages(res.data.pages);
      } catch (err) {
        // Silently handle error
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };
    loadProfiles();
  }, [searchParams, page]);

  const REGIONS_NAV = [
    { name: 'Ruhrgebiet', slug: 'ruhrgebiet' },
    { name: 'Rheinland', slug: 'rheinland' },
    { name: 'Ostwestfalen-Lippe', slug: 'ostwestfalen-lippe' },
    { name: 'Niederrhein', slug: 'niederrhein' },
    { name: 'Sauerland', slug: 'sauerland' },
  ];

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <SEOHead
        title="Treffen NRW – Kontakte in ganz NRW | Rotzlicht"
        description="Diskrete Begleitung in Nordrhein-Westfalen. Profile aus Köln, Düsseldorf, Dortmund, Essen und vielen weiteren NRW-Städten. Jetzt filtern & direkt Kontakt aufnehmen."
        canonical="/"
        jsonLd={BREADCRUMB_JSON}
      />
      <AgeVerificationModal />
      <Header cities={cities} regions={regions} />

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: 'radial-gradient(60% 60% at 50% 0%, rgba(204,0,0,0.10) 0%, rgba(10,10,10,0) 60%)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-10">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4 px-2 py-1 rounded inline-block" style={{ background: '#cc000022', color: '#ff2244', border: '1px solid #cc000044' }}>
              NRW — Nur Nordrhein-Westfalen
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-3 tracking-tight" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0', lineHeight: 1.05 }}>
              NRW.
              <br />
              <span style={{ color: '#cc0000' }}>Direkt.</span>
              {' '}Diskret.
            </h1>
            <p className="text-lg text-white/60 mb-8 max-w-lg leading-relaxed">
              Finde Profile in deiner Stadt – schnell filtern, sofort kontaktieren.
            </p>

            {/* Region quick links */}
            <div className="flex flex-wrap gap-2">
              {REGIONS_NAV.map(r => (
                <Link
                  key={r.slug}
                  to={`/regionen/${r.slug}`}
                  className="px-3 py-1.5 rounded-md text-sm border transition-colors hover:border-red-500/50 hover:text-white"
                  style={{ borderColor: 'rgba(255,255,255,0.12)', color: '#b7b7b7', background: 'rgba(255,255,255,0.04)' }}
                >
                  {r.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <StickyFilterBar cities={cities} regions={regions} categories={categories} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-white/50">
            {loading ? 'Lade Profile...' : (
              <span><span className="text-white font-semibold">{total}</span> Profile gefunden</span>
            )}
          </div>
          <div className="text-xs text-white/30 hidden sm:block">Sortiert nach: Featured zuerst</div>
        </div>

        {/* Profile Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={`skeleton-${i}`} className="rounded-[14px] overflow-hidden" style={{ background: '#111' }}>
                <Skeleton className="aspect-[3/4] w-full" style={{ background: '#1a1a1a' }} />
                <div className="p-2"><Skeleton className="h-3 w-3/4 mb-2" style={{ background: '#1a1a1a' }} /></div>
              </div>
            ))}
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {profiles.map(profile => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-20" style={{ fontFamily: 'Oswald, sans-serif' }}>NRW</div>
            <div className="text-xl font-bold text-white/50 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>Keine Profile gefunden</div>
            <div className="text-sm text-white/30">Versuche andere Filter oder Suchbegriffe.</div>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {[...Array(pages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={`page-btn-${pageNum}`}
                  onClick={() => setPage(pageNum)}
                  className="w-9 h-9 rounded-md text-sm font-medium transition-colors"
                  style={{
                    background: page === pageNum ? '#cc0000' : 'rgba(255,255,255,0.06)',
                    color: page === pageNum ? '#fff' : '#b7b7b7',
                    border: `1px solid ${page === pageNum ? 'transparent' : 'rgba(255,255,255,0.1)'}`
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Cities Navigation */}
      <div className="border-t border-white/10 mt-12" style={{ background: '#0d0d0d' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>
            Städte in NRW
          </h2>
          <div data-testid="city-navigation" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {cities.map(city => (
              <Link
                key={city.slug}
                to={`/stadte/${city.slug}`}
                className="flex items-center justify-between px-3 py-2 rounded-md text-sm border transition-all hover:border-red-500/30 hover:text-white group"
                style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#b7b7b7', background: 'rgba(255,255,255,0.03)' }}
              >
                <span className="flex items-center gap-1.5">
                  <MapPin size={11} className="opacity-50 group-hover:text-red-400 transition-colors" />
                  {city.name}
                </span>
                {city.profile_count > 0 && (
                  <span className="text-xs text-white/30">{city.profile_count}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Apply CTA */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-2xl p-8 border border-white/10 relative overflow-hidden" style={{ background: '#111' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(60% 80% at 100% 50%, rgba(204,0,0,0.06) 0%, transparent 70%)' }} />
          <div className="relative max-w-lg">
            <div className="text-xs font-semibold uppercase tracking-widest mb-3 px-2 py-1 rounded inline-block" style={{ background: '#cc000022', color: '#ff2244', border: '1px solid #cc000044' }}>Für Damen</div>
            <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>Du möchtest dabei sein?</h2>
            <p className="text-white/60 mb-6 text-sm leading-relaxed">
              Bewirb dich jetzt und werde Teil unserer Plattform. Wir prüfen jede Bewerbung sorgfältig und melden uns diskret zurück.
            </p>
            <Link
              to="/bewerben"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all active:scale-[0.98]"
              style={{ background: '#cc0000', boxShadow: '0 0 0 1px rgba(255,34,68,0.35), 0 0 24px rgba(255,34,68,0.18)' }}
            >
              Jetzt bewerben <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
