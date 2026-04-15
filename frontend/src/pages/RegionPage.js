import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import api from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import ProfileCard from '../components/ProfileCard';
import Breadcrumbs from '../components/Breadcrumbs';
import { Skeleton } from '../components/ui/skeleton';

export default function RegionPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [region, setRegion] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [cities, setCities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [regionCities, setRegionCities] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [regionRes, citiesRes, regionsRes] = await Promise.all([
          api.get(`/regions/${slug}`),
          api.get('/cities'),
          api.get('/regions')
        ]);
        setRegion(regionRes.data);
        setCities(citiesRes.data);
        setRegions(regionsRes.data);
        const rc = citiesRes.data.filter(c => regionRes.data.cities?.includes(c.slug));
        setRegionCities(rc);
        const res = await api.get('/profiles', { params: { region: slug, status: 'active', page: 1, limit: 20 } });
        setProfiles(res.data.profiles);
        setTotal(res.data.total);
        setPages(res.data.pages);
      } catch (err) {
        // Silently handle error
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  const jsonLd = region ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "/" },
      { "@type": "ListItem", "position": 2, "name": region.name, "item": `/regionen/${region.slug}` }
    ]
  } : null;

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {region && (
        <SEOHead
          title={region.seo_title || `Treffen ${region.name} – Kontakte im ${region.name} | Rotzlicht`}
          description={region.seo_description || `Diskrete Kontakte im ${region.name}. Profile aus ${regionCities.slice(0, 3).map(c => c.name).join(', ')} und mehr.`}
          canonical={`/regionen/${region.slug}`}
          jsonLd={jsonLd}
        />
      )}
      <Header cities={cities} regions={regions} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={[
          { label: 'Regionen', href: '/' },
          { label: region?.name || slug }
        ]} />

        <div className="py-6 border-b border-white/10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>
            Escort im <span style={{ color: '#cc0000' }}>{region?.name}</span>
          </h1>
          {region?.description && <p className="text-white/50 mt-2 text-sm max-w-2xl">{region.description}</p>}
          <div className="mt-3 text-sm text-white/40">
            <span className="text-white font-semibold">{total}</span> Profile • <span className="text-white font-semibold">{regionCities.length}</span> Städte
          </div>
        </div>

        {/* Cities in region */}
        {regionCities.length > 0 && (
          <div className="py-5 border-b border-white/10">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">Städte im {region?.name}</h2>
            <div data-testid="region-navigation" className="flex flex-wrap gap-2">
              {regionCities.map(c => (
                <Link key={c.slug} to={`/stadte/${c.slug}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border transition-all hover:border-red-500/30 hover:text-white"
                  style={{ borderColor: 'rgba(255,255,255,0.10)', color: '#b7b7b7', background: 'rgba(255,255,255,0.03)' }}>
                  <MapPin size={11} className="opacity-50" />{c.name}
                  {c.profile_count > 0 && <span className="text-xs text-white/30 ml-1">{c.profile_count}</span>}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => <Skeleton key={`region-skeleton-${i}`} className="aspect-[3/4] rounded-2xl" style={{ background: '#1a1a1a' }} />)}
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {profiles.map(p => <ProfileCard key={p.id} profile={p} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl font-bold text-white/20 mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>LEER</div>
            <div className="text-white/40">Noch keine aktiven Profile im {region?.name}</div>
          </div>
        )}

        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {[...Array(pages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button key={`region-page-${pageNum}`} onClick={() => setPage(pageNum)}
                  className="w-9 h-9 rounded-md text-sm"
                  style={{ background: page === pageNum ? '#cc0000' : 'rgba(255,255,255,0.06)', color: page === pageNum ? '#fff' : '#b7b7b7' }}>
                  {pageNum}
                </button>
              );
            })}
          </div>
        )}

        {/* Other regions */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'Oswald, sans-serif' }}>Andere Regionen</h2>
          <div data-testid="region-navigation" className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {regions.filter(r => r.slug !== slug).map(r => (
              <Link key={r.slug} to={`/regionen/${r.slug}`}
                className="px-4 py-3 rounded-md border transition-all hover:border-red-500/30"
                style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#b7b7b7', background: 'rgba(255,255,255,0.03)' }}>
                <div className="font-medium" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>{r.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
