import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Phone, Send, MapPin } from 'lucide-react';
import { Badge } from './ui/badge';
import { getImageUrl } from '../utils/api';

const CATEGORY_COLORS = {
  'neu': '#ff2244',
  'heute-verfuegbar': '#2bd576',
  'verifiziert': '#4fa3e0',
  'top-profil': '#ffb020',
};

const ProfileCard = ({ profile }) => {
  const primaryPhoto = profile.photos?.find(p => p.is_primary) || profile.photos?.[0];
  const imageUrl = getImageUrl(primaryPhoto);

  const contact = profile.contact || {};
  const addons = profile.addons || {};

  // Helper to normalize WhatsApp link
  const getWhatsAppLink = () => {
    if (!contact.whatsapp || !addons.whatsapp_enabled) return null;
    if (contact.whatsapp.startsWith('http')) return contact.whatsapp;
    return `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`;
  };

  // Helper to normalize Telegram link
  const getTelegramLink = () => {
    if (!contact.telegram || !addons.telegram_enabled) return null;
    if (contact.telegram.startsWith('http')) return contact.telegram;
    return `https://t.me/${contact.telegram.replace('@', '')}`;
  };

  const whatsapp = getWhatsAppLink();
  const telegram = getTelegramLink();
  const phone = contact.phone ? `tel:${contact.phone}` : null;
  const maps = contact.maps_url && addons.maps_enabled ? contact.maps_url : null;

  const highlightCats = (profile.categories || []).filter(c => CATEGORY_COLORS[c]).slice(0, 2);

  // Count active buttons
  const activeButtons = [phone, whatsapp, telegram, maps].filter(Boolean).length;

  return (
    <div
      data-testid="profile-card"
      className="profile-card group relative overflow-hidden rounded-[14px] border border-white/10 hover:border-white/20 transition-[border-color] duration-200"
      style={{ background: '#111', boxShadow: '0 10px 30px rgba(0,0,0,0.45)' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ paddingBottom: '133%' }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={primaryPhoto?.alt || profile.name}
            className="profile-card-img absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#1a1a1a' }}>
            <div className="text-center">
              <div className="text-4xl text-white/10 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>NRW</div>
              <div className="text-xs text-white/20">Kein Foto</div>
            </div>
          </div>
        )}

        {/* Bottom overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,0.95) 100%)' }}>
          {/* Category badges */}
          {highlightCats.length > 0 && (
            <div className="flex gap-1 mb-2 flex-wrap">
              {highlightCats.map(cat => (
                <span key={cat} className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: `${CATEGORY_COLORS[cat]}22`, color: CATEGORY_COLORS[cat], border: `1px solid ${CATEGORY_COLORS[cat]}44` }}>
                  {cat === 'neu' ? 'NEU' : cat === 'heute-verfuegbar' ? 'HEUTE' : cat === 'verifiziert' ? 'VERIFIZIERT' : 'TOP'}
                </span>
              ))}
            </div>
          )}
          <Link to={`/profile/${profile.slug}`} data-testid="profile-card-open-link" className="block hover:opacity-90 transition-opacity">
            <div className="text-base font-bold leading-tight" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>{profile.name}</div>
            <div className="text-xs text-white/60 mt-0.5">{profile.age} J. &bull; {profile.city_name || profile.city_slug}</div>
          </Link>
        </div>

        {/* Premium badge */}
        {profile.premium && (
          <div className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded font-semibold" style={{ background: '#ffb020', color: '#000' }}>PREMIUM</div>
        )}
        {profile.featured && !profile.premium && (
          <div className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded font-semibold" style={{ background: '#cc0000', color: '#fff' }}>FEATURED</div>
        )}
      </div>

      {/* CTA row */}
      <div className="p-2 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${activeButtons || 1}, 1fr)` }}>
        {phone && (
          <a
            href={phone}
            data-testid="profile-card-call-button"
            aria-label={`Anrufen ${profile.name}`}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-md text-xs font-medium transition-all hover:brightness-110 active:scale-[0.98]"
            style={{ background: '#cc0000', color: '#fff' }}
          >
            <Phone size={14} strokeWidth={2.5} /> Anrufen
          </a>
        )}
        {whatsapp && (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="profile-card-whatsapp-button"
            aria-label={`WhatsApp ${profile.name}`}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-md text-xs font-medium transition-all hover:brightness-110 active:scale-[0.98]"
            style={{ background: '#25D366', color: '#fff' }}
          >
            <MessageCircle size={14} strokeWidth={2.5} /> WhatsApp
          </a>
        )}
        {telegram && (
          <a
            href={telegram}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="profile-card-telegram-button"
            aria-label={`Telegram ${profile.name}`}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-md text-xs font-medium transition-all hover:brightness-110 active:scale-[0.98]"
            style={{ background: '#229ED9', color: '#fff' }}
          >
            <Send size={14} strokeWidth={2.5} /> Telegram
          </a>
        )}
        {maps && (
          <a
            href={maps}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="profile-card-maps-button"
            aria-label={`Navigation zu ${profile.name}`}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-md text-xs font-medium transition-all hover:brightness-110 active:scale-[0.98]"
            style={{ background: 'rgba(66,133,244,0.9)', color: '#fff' }}
          >
            <MapPin size={14} strokeWidth={2.5} /> Maps
          </a>
        )}
        {activeButtons === 0 && (
          <Link
            to={`/profile/${profile.slug}`}
            className="flex items-center justify-center py-2.5 rounded-md text-xs font-medium transition-colors"
            style={{ background: '#cc0000', color: '#fff' }}
          >
            Profil ansehen
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
