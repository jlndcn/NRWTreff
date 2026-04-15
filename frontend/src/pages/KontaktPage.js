import React, { useState } from 'react';
import { Info, Upload, Clock, User } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Switch } from '../components/ui/switch';
import { toast } from 'sonner';

const DAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

export default function KontaktPage() {
  const [contactType, setContactType] = useState('kontakt'); // 'kontakt' or 'inserieren'
  const [form, setForm] = useState({
    name: '',
    email: '',
    nachricht: '',
    // Inserieren-spezifisch
    anzeigentext: '',
    services: { besuchbar: false, haushotel: false, online: false },
    arbeitszeiten: {},
    is24_7: false,
    aussehen: {
      haarfarbe: '',
      groesse: '',
      gewicht: '',
      oberweite: '',
      tattoos: '',
      piercings: '',
      nationalitaet: '',
      sprachen: 'Alle',
    },
    partyservice: false
  });
  const [photos, setPhotos] = useState([]);
  const [showPhotoInfo, setShowPhotoInfo] = useState(false);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 10) {
      toast.error('Maximal 10 Fotos erlaubt');
      return;
    }
    setPhotos([...photos, ...files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (contactType === 'inserieren') {
      if (photos.length < 5) {
        toast.error('Mindestens 5 Fotos sind erforderlich');
        return;
      }
      if (!form.services.besuchbar && !form.services.haushotel && !form.services.online) {
        toast.error('Mindestens eine Service-Option muss ausgewählt werden');
        return;
      }
    }
    
    toast.success('Ihre Nachricht wurde gesendet!');
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <SEOHead
        title="Kontakt & Inserieren | Rotzlicht"
        description="Nehmen Sie Kontakt auf oder inserieren Sie Ihr Profil"
        canonical="/kontakt"
      />
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>
          Kontakt
        </h1>

        {/* Typ-Auswahl */}
        <div className="mb-8 flex gap-4 justify-center">
          <button
            onClick={() => setContactType('kontakt')}
            className="px-6 py-3 rounded-lg font-semibold transition-all"
            style={{
              background: contactType === 'kontakt' ? '#cc0000' : 'rgba(255,255,255,0.05)',
              color: contactType === 'kontakt' ? '#fff' : '#888',
              border: `1px solid ${contactType === 'kontakt' ? '#cc0000' : 'rgba(255,255,255,0.1)'}`
            }}
          >
            Kontakt aufnehmen
          </button>
          <button
            onClick={() => setContactType('inserieren')}
            className="px-6 py-3 rounded-lg font-semibold transition-all"
            style={{
              background: contactType === 'inserieren' ? '#cc0000' : 'rgba(255,255,255,0.05)',
              color: contactType === 'inserieren' ? '#fff' : '#888',
              border: `1px solid ${contactType === 'inserieren' ? '#cc0000' : 'rgba(255,255,255,0.1)'}`
            }}
          >
            Inserieren
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {contactType === 'kontakt' ? (
            // Kontakt-Formular
            <>
              <div>
                <label className="block text-sm text-white/60 mb-2">Name</label>
                <Input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  className="border-white/15 bg-white/5 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">E-Mail</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  className="border-white/15 bg-white/5 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Nachricht</label>
                <Textarea
                  value={form.nachricht}
                  onChange={e => setForm({ ...form, nachricht: e.target.value })}
                  required
                  rows={6}
                  className="border-white/15 bg-white/5 text-white"
                />
              </div>
            </>
          ) : (
            // Inserieren-Formular
            <>
              {/* Bilder Upload */}
              <div className="p-6 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-base font-semibold text-white">Fotos hochladen</label>
                  <button
                    type="button"
                    onMouseEnter={() => setShowPhotoInfo(true)}
                    onMouseLeave={() => setShowPhotoInfo(false)}
                    className="text-white/40 hover:text-white/70"
                  >
                    <Info size={16} />
                  </button>
                </div>
                
                {showPhotoInfo && (
                  <div className="mb-3 p-3 rounded-lg text-xs text-white/70" style={{ background: 'rgba(204,0,0,0.1)', border: '1px solid rgba(204,0,0,0.3)' }}>
                    <strong>Optimale Bildformate:</strong> JPG, PNG, WebP<br />
                    <strong>Mindestauflösung:</strong> 1200x1600px<br />
                    <strong>Hinweis:</strong> Hochwertige, gut beleuchtete Fotos erhöhen die Sichtbarkeit
                  </div>
                )}

                <p className="text-sm text-white/50 mb-4">Mindestens 5 Fotos sind erforderlich ({photos.length}/5)</p>
                
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-white/20 hover:border-red-500/50 cursor-pointer transition-colors">
                  <Upload size={18} className="text-white/40" />
                  <span className="text-sm text-white/60">Bilder auswählen</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {photos.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {photos.map((photo, i) => (
                      <div key={`photo-preview-${photo.name}-${i}`} className="aspect-square rounded-lg bg-white/5 flex items-center justify-center text-xs text-white/40">
                        {photo.name.substring(0, 15)}...
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Anzeigentext */}
              <div>
                <label className="block text-sm text-white/60 mb-2">Anzeigentext</label>
                <Textarea
                  value={form.anzeigentext}
                  onChange={e => setForm({ ...form, anzeigentext: e.target.value })}
                  placeholder="Beschreibe dich und deine Services..."
                  rows={5}
                  className="border-white/15 bg-white/5 text-white"
                />
              </div>

              {/* Service-Optionen */}
              <div className="p-6 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <label className="block text-base font-semibold text-white mb-4">Services (mindestens 1 auswählen)</label>
                <div className="space-y-3">
                  {[
                    { key: 'besuchbar', label: 'Besuchbar' },
                    { key: 'haushotel', label: 'Haus- & Hotelbesuche' },
                    { key: 'online', label: 'Online/Cam-Sex' }
                  ].map(service => (
                    <label key={service.key} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                      <Checkbox
                        checked={form.services[service.key]}
                        onCheckedChange={checked => setForm({
                          ...form,
                          services: { ...form.services, [service.key]: checked }
                        })}
                        className="border-white/30"
                      />
                      <span className="text-white/80">{service.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Arbeitszeiten */}
              <div className="p-6 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-base font-semibold text-white flex items-center gap-2">
                    <Clock size={18} /> Arbeitszeiten
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="text-sm text-white/60">24/7</span>
                    <Switch
                      checked={form.is24_7}
                      onCheckedChange={checked => setForm({ ...form, is24_7: checked })}
                    />
                  </label>
                </div>

                {!form.is24_7 && (
                  <div className="grid grid-cols-2 gap-3">
                    {DAYS.map(day => (
                      <label key={day} className="flex items-center gap-2">
                        <Checkbox
                          checked={!!form.arbeitszeiten[day]}
                          onCheckedChange={checked => setForm({
                            ...form,
                            arbeitszeiten: { ...form.arbeitszeiten, [day]: checked }
                          })}
                          className="border-white/30"
                        />
                        <span className="text-sm text-white/70">{day}</span>
                      </label>
                    ))}
                  </div>
                )}

                {form.is24_7 && (
                  <p className="text-sm text-white/40 italic">24/7 verfügbar</p>
                )}
              </div>

              {/* Aussehen */}
              <div className="p-6 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <label className="block text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <User size={18} /> Aussehen
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Haarfarbe</label>
                    <Input
                      value={form.aussehen.haarfarbe}
                      onChange={e => setForm({ ...form, aussehen: { ...form.aussehen, haarfarbe: e.target.value }})}
                      className="border-white/15 bg-white/5 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Größe (cm)</label>
                    <Input
                      value={form.aussehen.groesse}
                      onChange={e => setForm({ ...form, aussehen: { ...form.aussehen, groesse: e.target.value }})}
                      className="border-white/15 bg-white/5 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Gewicht (kg)</label>
                    <Input
                      value={form.aussehen.gewicht}
                      onChange={e => setForm({ ...form, aussehen: { ...form.aussehen, gewicht: e.target.value }})}
                      className="border-white/15 bg-white/5 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Oberweite</label>
                    <Input
                      value={form.aussehen.oberweite}
                      onChange={e => setForm({ ...form, aussehen: { ...form.aussehen, oberweite: e.target.value }})}
                      className="border-white/15 bg-white/5 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Tattoos</label>
                    <Input
                      value={form.aussehen.tattoos}
                      onChange={e => setForm({ ...form, aussehen: { ...form.aussehen, tattoos: e.target.value }})}
                      placeholder="z.B. Ja, Nein, Viele"
                      className="border-white/15 bg-white/5 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Piercings</label>
                    <Input
                      value={form.aussehen.piercings}
                      onChange={e => setForm({ ...form, aussehen: { ...form.aussehen, piercings: e.target.value }})}
                      placeholder="z.B. Ja, Nein, Mehrere"
                      className="border-white/15 bg-white/5 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Nationalität</label>
                    <Input
                      value={form.aussehen.nationalitaet}
                      onChange={e => setForm({ ...form, aussehen: { ...form.aussehen, nationalitaet: e.target.value }})}
                      className="border-white/15 bg-white/5 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Sprachen</label>
                    <Input
                      value={form.aussehen.sprachen}
                      onChange={e => setForm({ ...form, aussehen: { ...form.aussehen, sprachen: e.target.value }})}
                      placeholder="z.B. Deutsch, Englisch"
                      className="border-white/15 bg-white/5 text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Partyservice */}
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={form.partyservice}
                  onCheckedChange={checked => setForm({ ...form, partyservice: checked })}
                  className="border-white/30"
                />
                <label className="text-sm text-white/70">Partyservice (optional)</label>
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full py-3 text-base font-bold"
            style={{ background: '#cc0000', color: '#fff' }}
          >
            {contactType === 'kontakt' ? 'Nachricht senden' : 'Anzeige aufgeben'}
          </Button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
