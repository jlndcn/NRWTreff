import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import api from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import ProfileCard from '../components/ProfileCard';
import Breadcrumbs from '../components/Breadcrumbs';
import StickyFilterBar from '../components/StickyFilterBar';
import { Skeleton } from '../components/ui/skeleton';

export default function CityPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [city, setCity] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [cities, setCities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [cityRes, citiesRes, regionsRes, catsRes] = await Promise.all([
          api.get(`/cities/${slug}`),
          api.get('/cities'),
          api.get('/regions'),
          api.get('/categories')
        ]);
        setCity(cityRes.data);
        setCities(citiesRes.data);
        setRegions(regionsRes.data);
        setCategories(catsRes.data);
        await loadProfiles(slug, searchParams, page);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  const loadProfiles = async (citySlug, params, pg) => {
    const queryParams = { city: citySlug, status: 'active', page: pg, limit: 20 };
    if (params.get('category')) queryParams.category = params.get('category');
    const res = await api.get('/profiles', { params: queryParams });
    setProfiles(res.data.profiles);
    setTotal(res.data.total);
    setPages(res.data.pages);
  };

  useEffect(() => {
    if (city) loadProfiles(slug, searchParams, page);
  }, [searchParams, page]);

  if (loading) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="h-10 w-1/2 mb-4" style={{ background: '#1a1a1a' }} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => <Skeleton key={`city-skeleton-${i}`} className="aspect-[3/4] rounded-2xl" style={{ background: '#1a1a1a' }} />)}
        </div>
      </div>
    </div>
  );

  const jsonLd = city ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "/" },
      { "@type": "ListItem", "position": 2, "name": "Städte", "item": "/stadte" },
      { "@type": "ListItem", "position": 3, "name": city.name, "item": `/stadte/${city.slug}` }
    ]
  } : null;

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {city && (
        <SEOHead
          title={city.seo_title || `Treffen ${city.name} – Kontakte in ${city.name} | Rotzlicht`}
          description={city.seo_description || `Diskrete Kontakte in ${city.name}. Schnell, einfach, diskret. Jetzt Profile in ${city.name} durchstöbern.`}
          canonical={`/stadte/${city.slug}`}
          jsonLd={jsonLd}
        />
      )}
      <Header cities={cities} regions={regions} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={[
          { label: 'Städte', href: '/' },
          { label: city?.name || slug }
        ]} />

        {/* City Header */}
        <div className="py-6 border-b border-white/10 mb-0">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={16} style={{ color: '#cc0000' }} />
            <span className="text-xs text-white/40 uppercase tracking-widest">Nordrhein-Westfalen</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>
            Escort in <span style={{ color: '#cc0000' }}>{city?.name}</span>
          </h1>
          {city?.description && (
            <p className="text-white/50 mt-2 text-sm max-w-2xl">{city.description}</p>
          )}
          <div className="mt-3 text-sm text-white/40">
            <span className="text-white font-semibold">{total}</span> Profile verfügbar
          </div>
        </div>
      </div>

      <StickyFilterBar cities={cities} regions={regions} categories={categories} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {profiles.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {profiles.map(p => <ProfileCard key={p.id} profile={p} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl font-bold text-white/20 mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>LEER</div>
            <div className="text-white/40">Noch keine aktiven Profile in {city?.name}</div>
          </div>
        )}

        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {[...Array(pages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button key={`city-page-btn-${pageNum}`} onClick={() => setPage(pageNum)}
                  className="w-9 h-9 rounded-md text-sm"
                  style={{ background: page === pageNum ? '#cc0000' : 'rgba(255,255,255,0.06)', color: page === pageNum ? '#fff' : '#b7b7b7' }}>
                  {pageNum}
                </button>
              );
            })}
          </div>
        )}

        {/* Other cities */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>Weitere Städte in NRW</h2>
          <div data-testid="city-navigation" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {cities.filter(c => c.slug !== slug).slice(0, 15).map(c => (
              <Link key={c.slug} to={`/stadte/${c.slug}`}
                className="px-3 py-2 rounded-md text-sm border transition-all hover:border-red-500/30 hover:text-white"
                style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#b7b7b7', background: 'rgba(255,255,255,0.03)' }}>
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
