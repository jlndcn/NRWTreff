import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, X, CheckCircle, Loader } from 'lucide-react';
import api from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';

const NRW_CITIES = [
  'Köln', 'Düsseldorf', 'Dortmund', 'Essen', 'Duisburg', 'Bochum', 'Wuppertal', 'Bonn',
  'Münster', 'Bielefeld', 'Aachen', 'Mönchengladbach', 'Gelsenkirchen', 'Krefeld',
  'Oberhausen', 'Hagen', 'Hamm', 'Leverkusen', 'Solingen', 'Herne', 'Paderborn',
  'Recklinghausen', 'Remscheid', 'Bergisch Gladbach', 'Siegen'
];

export default function ApplicationPage() {
  const [form, setForm] = useState({ name: '', age: '', city: '', contact_info: '', description: '' });
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = [...photos, ...files].slice(0, 5);
    setPhotos(newPhotos);
    const newPreviews = newPhotos.map(f => URL.createObjectURL(f));
    setPreviews(newPreviews);
  };

  const removePhoto = (idx) => {
    const newPhotos = photos.filter((_, i) => i !== idx);
    setPhotos(newPhotos);
    const newPreviews = newPhotos.map(f => URL.createObjectURL(f));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.city || !form.contact_info) {
      toast.error('Bitte alle Pflichtfelder ausfüllen');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
      photos.forEach(p => formData.append('photos', p));
      await api.post('/applications', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess(true);
    } catch (err) {
      toast.error('Fehler beim Senden. Bitte versuche es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <Header />
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#2bd57622' }}>
          <CheckCircle size={32} style={{ color: '#2bd576' }} />
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>Bewerbung erhalten!</h1>
        <p className="text-white/60 mb-6">Vielen Dank für deine Bewerbung. Wir prüfen alles sorgfältig und melden uns diskret zurück.</p>
        <Link to="/" className="inline-block px-6 py-3 rounded-lg font-semibold" style={{ background: '#cc0000', color: '#fff' }}>Zur Startseite</Link>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <SEOHead
        title="Als Dame bewerben – NRWLadies"
        description="Bewirb dich jetzt als Begleiterin auf NRWLadies. Diskret, sicher, professionell. Alle Bewerbungen werden manuell geprüft."
        canonical="/bewerben"
        robots="noindex,nofollow"
      />
      <Header />

      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={[{ label: 'Bewerben' }]} />

        <div className="py-6 mb-6">
          <div className="text-xs font-semibold uppercase tracking-widest mb-3 px-2 py-1 rounded inline-block" style={{ background: '#cc000022', color: '#ff2244', border: '1px solid #cc000044' }}>Exklusiv</div>
          <h1 className="text-4xl font-bold" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>Du möchtest dabei sein?</h1>
          <p className="text-white/60 mt-3 text-sm leading-relaxed">
            Fülle das Formular aus und wir prüfen deine Bewerbung diskret. Bei Interesse melden wir uns zurück.
            Keine Öffentlichkeit ohne deine ausdrückliche Zustimmung.
          </p>
        </div>

        <form data-testid="application-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Künstlername *</label>
              <Input name="name" value={form.name} onChange={handleChange} placeholder="z.B. Sophie" required
                className="border-white/15 bg-white/5 text-white placeholder:text-white/30" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Alter *</label>
              <Input name="age" value={form.age} onChange={handleChange} type="number" min="18" max="99" placeholder="z.B. 24" required
                className="border-white/15 bg-white/5 text-white placeholder:text-white/30" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1.5">Stadt (NRW) *</label>
            <Select value={form.city} onValueChange={v => setForm(p => ({ ...p, city: v }))}>
              <SelectTrigger className="border-white/15 bg-white/5 text-white">
                <SelectValue placeholder="Stadt wählen" />
              </SelectTrigger>
              <SelectContent className="border-white/10" style={{ background: '#1a1a1a' }}>
                {NRW_CITIES.map(c => <SelectItem key={c} value={c} className="text-white/80">{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1.5">Kontakt (WhatsApp / Telegram / Telefon) *</label>
            <Input name="contact_info" value={form.contact_info} onChange={handleChange} placeholder="z.B. +49 123 456 7890 oder @telegram" required
              className="border-white/15 bg-white/5 text-white placeholder:text-white/30" />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1.5">Kurze Beschreibung (optional)</label>
            <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Etwas über dich, deine Angebote..."
              rows={4} className="border-white/15 bg-white/5 text-white placeholder:text-white/30" />
          </div>

          {/* Photo upload */}
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Fotos (max. 5, optional)</label>
            {previews.length < 5 && (
              <label
                data-testid="application-form-photo-upload"
                className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed cursor-pointer transition-colors hover:border-red-500/50"
                style={{ borderColor: 'rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.03)' }}
              >
                <Upload size={24} className="text-white/30 mb-2" />
                <span className="text-sm text-white/40">Fotos auswählen</span>
                <span className="text-xs text-white/25 mt-1">{previews.length}/5 Fotos</span>
                <input type="file" multiple accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            )}
            {previews.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {previews.map((url, i) => (
                  <div key={i} className="relative w-20 h-24 rounded-lg overflow-hidden border border-white/10">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(0,0,0,0.7)' }}>
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="rounded-xl p-4 text-sm text-white/50 leading-relaxed" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <strong className="text-white/70">Datenschutzhinweis:</strong> Deine Daten werden vertraulich behandelt und nicht ohne deine Zustimmung veröffentlicht. Du musst mindesens 18 Jahre alt sein.
          </div>

          <Button
            type="submit"
            data-testid="application-form-submit-button"
            disabled={loading}
            className="w-full py-6 font-bold text-base"
            style={{ background: '#cc0000', color: '#fff', boxShadow: loading ? 'none' : '0 0 0 1px rgba(255,34,68,0.35), 0 0 24px rgba(255,34,68,0.15)' }}
          >
            {loading ? <><Loader size={18} className="mr-2 animate-spin" /> Wird gesendet...</> : 'Bewerbung senden'}
          </Button>
        </form>

        <div className="py-12 text-center">
          <p className="text-xs text-white/25">Durch das Absenden akzeptierst du unsere <Link to="/agb" className="underline hover:text-white/40">AGB</Link> und <Link to="/datenschutz" className="underline hover:text-white/40">Datenschutzerklärung</Link>.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
