import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, Phone, Send, MapPin, Calendar, CheckCircle, Star, Info } from 'lucide-react';
import api, { getImageUrl } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import StickyContactBar from '../components/StickyContactBar';
import Breadcrumbs from '../components/Breadcrumbs';
import ProfileCard from '../components/ProfileCard';
import { Separator } from '../components/ui/separator';
import { Skeleton } from '../components/ui/skeleton';
import { Dialog, DialogContent } from '../components/ui/dialog';

const CATEGORY_LABELS = {
  'neu': 'Neu', 'heute-verfuegbar': 'Heute verfügbar', 'verifiziert': 'Verifiziert',
  'top-profil': 'Top Profil', 'eigene-location': 'Eigene Location', 'hausbesuche': 'Hausbesuche',
  'hotelbesuche': 'Hotelbesuche', 'escort': 'Escort', 'freizeitbegleitung': 'Freizeitbegleitung',
  'massage': 'Massage', 'wellness': 'Wellness', 'studentisch': 'Studentisch',
  'reif': 'Reif', 'international': 'International'
};

export default function ProfilePage() {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [related, setRelated] = useState([]);
  const [activePhoto, setActivePhoto] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [cities, setCities] = useState([]);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [profileRes, citiesRes, regionsRes] = await Promise.all([
          api.get(`/profiles/${slug}`),
          api.get('/cities'),
          api.get('/regions')
        ]);
        setProfile(profileRes.data);
        setCities(citiesRes.data);
        setRegions(regionsRes.data);
        // Load related profiles
        if (profileRes.data.city_slug) {
          const relRes = await api.get('/profiles', { params: { city: profileRes.data.city_slug, status: 'active', limit: 4 } });
          setRelated(relRes.data.profiles.filter(p => p.slug !== slug).slice(0, 4));
        }
      } catch (err) {
        setError('Profil nicht gefunden');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
          <Skeleton className="aspect-[3/4] w-full rounded-2xl" style={{ background: '#1a1a1a' }} />
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" style={{ background: '#1a1a1a' }} />
            <Skeleton className="h-4 w-full" style={{ background: '#1a1a1a' }} />
          </div>
        </div>
      </div>
    </div>
  );

  if (error || !profile) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="text-4xl font-bold text-white/20 mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>404</div>
        <div className="text-white/50">Profil nicht gefunden</div>
        <Link to="/" className="mt-4 inline-block text-red-400 hover:text-red-300">Zurück zur Startseite</Link>
      </div>
    </div>
  );

  const contact = profile.contact || {};
  const whatsapp = contact.show_whatsapp && contact.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}` : null;
  const telegram = contact.show_telegram && contact.telegram ? `https://t.me/${contact.telegram.replace('@', '')}` : null;
  const phone = contact.show_phone && contact.phone ? `tel:${contact.phone}` : null;
  const photos = profile.photos || [];
  const primaryPhotoUrl = getImageUrl(photos[activePhoto]) || getImageUrl(photos[0]);

  const breadcrumbs = [
    ...(profile.city_name ? [{ label: 'Städte', href: '/' }, { label: profile.city_name, href: `/stadte/${profile.city_slug}` }] : []),
    { label: profile.name }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": profile.name,
    "description": profile.short_desc || profile.description,
    "address": { "@type": "PostalAddress", "addressLocality": profile.city_name || profile.city_slug, "addressRegion": "Nordrhein-Westfalen", "addressCountry": "DE" }
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingBottom: '80px' }}>
      <SEOHead
        title={profile.seo_title || `${profile.name}, ${profile.age} J. in ${profile.city_name || profile.city_slug} | Rotzlicht`}
        description={profile.seo_description || profile.short_desc || `Kontakt zu ${profile.name}, ${profile.age} Jahre alt in ${profile.city_name || profile.city_slug}, NRW. Diskret und unkompliziert.`}
        canonical={`/profile/${profile.slug}`}
        ogImage={primaryPhotoUrl}
        ogType="profile"
        jsonLd={jsonLd}
      />
      <Header cities={cities} regions={regions} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={breadcrumbs} />

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 gap-6">
          {/* Left: Gallery */}
          <div>
            {/* Main photo */}
            {photos.length > 0 ? (
              <div
                className="relative rounded-2xl overflow-hidden cursor-pointer border border-white/10"
                style={{ aspectRatio: '3/4', maxHeight: '600px' }}
                onClick={() => { setLightboxIndex(activePhoto); setLightboxOpen(true); }}
                data-testid="profile-gallery-open-fullscreen"
              >
                <img
                  src={getImageUrl(photos[activePhoto])}
                  alt={photos[activePhoto]?.alt || profile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 right-3 bg-black/60 rounded-md px-2 py-1 text-xs text-white/70 backdrop-blur">
                  {activePhoto + 1} / {photos.length}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl flex items-center justify-center border border-white/10" style={{ aspectRatio: '3/4', maxHeight: '600px', background: '#1a1a1a' }}>
                <div className="text-center">
                  <div className="text-5xl text-white/10 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>NRW</div>
                  <div className="text-sm text-white/20">Kein Foto verfügbar</div>
                </div>
              </div>
            )}

            {/* Thumbnail strip */}
            {photos.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto filter-scroll pb-1" data-testid="profile-gallery-carousel">
                {photos.map((photo, i) => (
                  <div
                    key={photo.id || i}
                    onClick={() => setActivePhoto(i)}
                    className="flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-[border-color]"
                    style={{ borderColor: activePhoto === i ? '#cc0000' : 'transparent' }}
                  >
                    <img src={getImageUrl(photo)} alt={photo.alt || `Foto ${i+1}`} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details + Contact */}
          <div>
            {/* Name & Basic Info */}
            <div className="mb-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-4xl font-bold mb-1" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>{profile.name}</h1>
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    {profile.age && <span>{profile.age} Jahre</span>}
                    {profile.city_name && (
                      <Link to={`/stadte/${profile.city_slug}`} className="flex items-center gap-1 hover:text-white/80 transition-colors">
                        <MapPin size={12} />{profile.city_name}
                      </Link>
                    )}
                  </div>
                </div>
                {profile.verified && (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium" style={{ background: '#4fa3e022', color: '#4fa3e0', border: '1px solid #4fa3e044' }}>
                    <CheckCircle size={12} /> Verifiziert
                  </div>
                )}
              </div>
            </div>

            {/* Categories */}
            {profile.categories?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {profile.categories.map(cat => (
                  <Link
                    key={cat}
                    to={`/kategorien/${cat}`}
                    className="text-xs px-2.5 py-1 rounded-md border transition-colors hover:border-red-400/50"
                    style={{ borderColor: 'rgba(255,255,255,0.15)', color: '#e8e8e8', background: 'rgba(255,255,255,0.05)' }}
                  >
                    {CATEGORY_LABELS[cat] || cat}
                  </Link>
                ))}
              </div>
            )}

            {/* Short description */}
            {profile.short_desc && (
              <p className="text-white/70 text-sm leading-relaxed mb-5 border-l-2 pl-3 italic" style={{ borderColor: '#cc0000' }}>{profile.short_desc}</p>
            )}

            {/* Key facts */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              {profile.height && (
                <div className="rounded-lg px-3 py-2.5 text-center" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="text-xs text-white/40 uppercase tracking-wide">Größe</div>
                  <div className="text-sm font-semibold text-white/80 mt-0.5">{profile.height} cm</div>
                </div>
              )}
              {profile.weight && (
                <div className="rounded-lg px-3 py-2.5 text-center" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="text-xs text-white/40 uppercase tracking-wide">Gewicht</div>
                  <div className="text-sm font-semibold text-white/80 mt-0.5">{profile.weight} kg</div>
                </div>
              )}
              {profile.nationality && (
                <div className="rounded-lg px-3 py-2.5 text-center" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="text-xs text-white/40 uppercase tracking-wide">Nationalität</div>
                  <div className="text-sm font-semibold text-white/80 mt-0.5">{profile.nationality}</div>
                </div>
              )}
              {profile.availability && (
                <div className="rounded-lg px-3 py-2.5 text-center" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="text-xs text-white/40 uppercase tracking-wide">Verfügbar</div>
                  <div className="text-sm font-semibold text-white/80 mt-0.5">{profile.availability}</div>
                </div>
              )}
            </div>

            {/* Desktop Contact Card */}
            <div className="hidden lg:block rounded-xl p-5 border border-white/10" style={{ background: '#111' }}>
              <div className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-4">Kontakt aufnehmen</div>
              <div className="space-y-2">
                {whatsapp && (
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full py-3 px-4 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
                    style={{ background: '#25D366' }}>
                    <MessageCircle size={18} /> WhatsApp schreiben
                  </a>
                )}
                {telegram && (
                  <a href={telegram} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full py-3 px-4 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
                    style={{ background: '#229ED9' }}>
                    <Send size={18} /> Telegram schreiben
                  </a>
                )}
                {phone && (
                  <a href={phone}
                    className="flex items-center gap-3 w-full py-3 px-4 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#f0f0f0' }}>
                    <Phone size={18} /> Anrufen
                  </a>
                )}
                {!whatsapp && !telegram && !phone && (
                  <div className="text-sm text-white/40 text-center py-2">Keine Kontaktdaten verfügbar</div>
                )}
              </div>
              <div className="mt-4 text-xs text-white/30 text-center flex items-center justify-center gap-1">
                <Info size={11} /> Nur für Personen ab 18 Jahren
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {profile.description && (
          <div className="mt-8 rounded-xl p-6 border border-white/10" style={{ background: '#111' }}>
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>Beschreibung</h2>
            <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{profile.description}</div>
          </div>
        )}

        {/* Languages */}
        {profile.languages?.length > 0 && (
          <div className="mt-4">
            <span className="text-xs text-white/40 uppercase tracking-wide mr-3">Sprachen:</span>
            {profile.languages.map(lang => (
              <span key={lang} className="text-xs px-2 py-0.5 rounded mr-1" style={{ background: 'rgba(255,255,255,0.06)', color: '#b7b7b7' }}>{lang}</span>
            ))}
          </div>
        )}

        {/* Related profiles */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>Weitere Profile in {profile.city_name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map(p => <ProfileCard key={p.id} profile={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-3xl border-white/10 p-0" style={{ background: '#000' }}>
          <div className="relative">
            <img
              src={getImageUrl(photos[lightboxIndex])}
              alt={photos[lightboxIndex]?.alt || profile.name}
              className="w-full max-h-[85vh] object-contain"
            />
            {photos.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {photos.map((_, i) => (
                  <button
                    key={`lightbox-dot-${i}`}
                    onClick={() => setLightboxIndex(i)}
                    className="w-2 h-2 rounded-full transition-colors"
                    style={{ background: lightboxIndex === i ? '#cc0000' : 'rgba(255,255,255,0.4)' }}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
      <StickyContactBar profile={profile} />
    </div>
  );
}
