import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import ProfileCard from '../components/ProfileCard';
import Breadcrumbs from '../components/Breadcrumbs';
import { Skeleton } from '../components/ui/skeleton';

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
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
        const [catRes, citiesRes, regionsRes, catsRes] = await Promise.all([
          api.get(`/categories/${slug}`),
          api.get('/cities'),
          api.get('/regions'),
          api.get('/categories')
        ]);
        setCategory(catRes.data);
        setCities(citiesRes.data);
        setRegions(regionsRes.data);
        setCategories(catsRes.data);
        const res = await api.get('/profiles', { params: { category: slug, status: 'active', page: 1, limit: 20 } });
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

  useEffect(() => {
    if (category) {
      api.get('/profiles', { params: { category: slug, status: 'active', page, limit: 20 } })
        .then(res => { setProfiles(res.data.profiles); setTotal(res.data.total); setPages(res.data.pages); });
    }
  }, [page]);

  const jsonLd = category ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "/" },
      { "@type": "ListItem", "position": 2, "name": category.name, "item": `/kategorien/${category.slug}` }
    ]
  } : null;

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {category && (
        <SEOHead
          title={`${category.name} in NRW | Rotzlicht`}
          description={`${category.description || ''} Finde diskrete Kontakte in NRW in der Kategorie ${category.name}.`}
          canonical={`/kategorien/${category.slug}`}
          jsonLd={jsonLd}
        />
      )}
      <Header cities={cities} regions={regions} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={[
          { label: 'Kategorien', href: '/' },
          { label: category?.name || slug }
        ]} />

        <div className="py-6 border-b border-white/10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>
            <span style={{ color: '#cc0000' }}>{category?.name}</span> in NRW
          </h1>
          {category?.description && <p className="text-white/50 text-sm mt-2">{category.description}</p>}
          <div className="mt-3 text-sm text-white/40">
            <span className="text-white font-semibold">{total}</span> Profile
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => <Skeleton key={`cat-skeleton-${i}`} className="aspect-[3/4] rounded-2xl" style={{ background: '#1a1a1a' }} />)}
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {profiles.map(p => <ProfileCard key={p.id} profile={p} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl font-bold text-white/20 mb-3" style={{ fontFamily: 'Oswald, sans-serif' }}>LEER</div>
            <div className="text-white/40">Keine Profile in dieser Kategorie</div>
          </div>
        )}

        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {[...Array(pages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button key={`cat-page-${pageNum}`} onClick={() => setPage(pageNum)}
                  className="w-9 h-9 rounded-md text-sm"
                  style={{ background: page === pageNum ? '#cc0000' : 'rgba(255,255,255,0.06)', color: page === pageNum ? '#fff' : '#b7b7b7' }}>
                  {pageNum}
                </button>
              );
            })}
          </div>
        )}

        {/* Other categories */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'Oswald, sans-serif' }}>Alle Kategorien</h2>
          <div className="flex flex-wrap gap-2">
            {categories.filter(c => c.slug !== slug).map(c => (
              <Link key={c.slug} to={`/kategorien/${c.slug}`}
                className="px-4 py-2 rounded-lg text-sm border transition-all hover:border-red-500/30 hover:text-white"
                style={{ borderColor: 'rgba(255,255,255,0.10)', color: '#b7b7b7', background: 'rgba(255,255,255,0.03)' }}>
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
