import React from 'react';
import { MessageCircle, Phone, Send } from 'lucide-react';

const StickyContactBar = ({ profile }) => {
  const contact = profile?.contact || {};

  const whatsapp = contact.show_whatsapp && contact.whatsapp
    ? `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`
    : null;
  const telegram = contact.show_telegram && contact.telegram
    ? `https://t.me/${contact.telegram.replace('@', '')}`
    : null;
  const phone = contact.show_phone && contact.phone
    ? `tel:${contact.phone}`
    : null;

  const hasContact = whatsapp || telegram || phone;
  if (!hasContact) return null;

  return (
    <div
      data-testid="profile-sticky-contact-bar"
      className="fixed bottom-0 inset-x-0 z-50 border-t border-white/10 p-3 lg:hidden"
      style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex gap-2 max-w-lg mx-auto">
        {whatsapp && (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="profile-sticky-whatsapp-button"
            aria-label={`WhatsApp ${profile?.name}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-opacity active:opacity-80"
            style={{ background: '#25D366', minHeight: '44px' }}
          >
            <MessageCircle size={18} />
            <span>WhatsApp</span>
          </a>
        )}
        {telegram && (
          <a
            href={telegram}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="profile-sticky-telegram-button"
            aria-label={`Telegram ${profile?.name}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-opacity active:opacity-80"
            style={{ background: '#229ED9', minHeight: '44px' }}
          >
            <Send size={18} />
            <span>Telegram</span>
          </a>
        )}
        {phone && (
          <a
            href={phone}
            data-testid="profile-sticky-call-button"
            aria-label={`Anrufen ${profile?.name}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-opacity active:opacity-80"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#f0f0f0', minHeight: '44px' }}
          >
            <Phone size={18} />
            <span>Anrufen</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default StickyContactBar;
