import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Upload, X, Star, Loader, ChevronLeft, Trash2 } from 'lucide-react';
import api, { getImageUrl } from '../../utils/api';
import AdminLayout from './AdminLayout';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';

const ALL_CATEGORIES = [
  { slug: 'neu', label: 'Neu' }, { slug: 'heute-verfuegbar', label: 'Heute verfügbar' },
  { slug: 'verifiziert', label: 'Verifiziert' }, { slug: 'top-profil', label: 'Top Profil' },
  { slug: 'eigene-location', label: 'Eigene Location' }, { slug: 'hausbesuche', label: 'Hausbesuche' },
  { slug: 'hotelbesuche', label: 'Hotelbesuche' }, { slug: 'escort', label: 'Escort' },
  { slug: 'freizeitbegleitung', label: 'Freizeitbegleitung' }, { slug: 'massage', label: 'Massage' },
  { slug: 'wellness', label: 'Wellness' }, { slug: 'studentisch', label: 'Studentisch' },
  { slug: 'reif', label: 'Reif' }, { slug: 'international', label: 'International' }
];

const EMPTY_FORM = {
  name: '', age: 18, city_slug: '', categories: [],
  short_desc: '', description: '', nationality: '', height: '', weight: '',
  languages: '', availability: '',
  contact: { phone: '', whatsapp: '', telegram: '', maps_url: '', show_whatsapp: true, show_telegram: true, show_phone: true },
  addons: { whatsapp_enabled: false, telegram_enabled: false, maps_enabled: false },
  status: 'pending', featured: false, premium: false, order: 0,
  is_new: true, verified: false,
  seo_title: '', seo_description: '',
  push_package: { active: false, daily_time: '14:00', start_at: null, end_at: null, last_run_at: null }
};

export default function AdminProfileEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [form, setForm] = useState(EMPTY_FORM);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [profileId, setProfileId] = useState(isNew ? null : id);

  useEffect(() => {
    api.get('/cities').then(r => setCities(r.data)).catch(console.error);
    if (!isNew) {
      api.get(`/profiles/${id}`)
        .then(res => {
          const p = res.data;
          setForm({
            name: p.name || '',
            age: p.age || 18,
            city_slug: p.city_slug || '',
            categories: p.categories || [],
            short_desc: p.short_desc || '',
            description: p.description || '',
            nationality: p.nationality || '',
            height: p.height || '',
            weight: p.weight || '',
            languages: (p.languages || []).join(', '),
            availability: p.availability || '',
            contact: p.contact || { phone: '', whatsapp: '', telegram: '', maps_url: '', show_whatsapp: true, show_telegram: true, show_phone: true },
            addons: p.addons || { whatsapp_enabled: false, telegram_enabled: false, maps_enabled: false },
            status: p.status || 'pending',
            featured: p.featured || false,
            premium: p.premium || false,
            order: p.order || 0,
            is_new: p.is_new || false,
            verified: p.verified || false,
            seo_title: p.seo_title || '',
            seo_description: p.seo_description || '',
            push_package: p.push_package || { active: false, daily_time: '14:00', start_at: null, end_at: null, last_run_at: null }
          });
          setPhotos(p.photos || []);
          setProfileId(p.id);
        })
        .catch(() => toast.error('Profil nicht gefunden'))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const updateContact = (field, value) => setForm(prev => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
  const updateAddons = (field, value) => setForm(prev => ({ ...prev, addons: { ...prev.addons, [field]: value } }));

  const toggleCategory = (slug) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(slug)
        ? prev.categories.filter(c => c !== slug)
        : [...prev.categories, slug]
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.city_slug || !form.age) {
      toast.error('Name, Alter und Stadt sind Pflichtfelder');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        age: parseInt(form.age),
        height: form.height ? parseInt(form.height) : null,
        weight: form.weight ? parseInt(form.weight) : null,
        languages: form.languages ? form.languages.split(',').map(l => l.trim()).filter(Boolean) : [],
        order: parseInt(form.order) || 0
      };
      if (isNew) {
        const res = await api.post('/profiles', payload);
        setProfileId(res.data.id);
        toast.success('Profil erstellt');
        navigate(`/admin/profile/${res.data.id}`, { replace: true });
      } else {
        await api.put(`/profiles/${profileId}`, payload);
        toast.success('Profil gespeichert');
      }
    } catch (err) {
      toast.error('Fehler beim Speichern: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (files) => {
    if (!profileId) {
      toast.error('Bitte zuerst Profil speichern');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(f => formData.append('files', f));
      const res = await api.post(`/profiles/${profileId}/photos`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const profileRes = await api.get(`/profiles/${form.name ? profileId : id}`);
      setPhotos(profileRes.data.photos || []);
      toast.success(`${res.data.photos.length} Foto(s) hochgeladen`);
    } catch (err) {
      toast.error('Foto-Upload fehlgeschlagen');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Foto löschen?')) return;
    try {
      await api.delete(`/profiles/${profileId}/photos/${photoId}`);
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      toast.success('Foto gelöscht');
    } catch {
      toast.error('Fehler beim Löschen');
    }
  };

  const handleSetPrimary = async (photoId) => {
    try {
      await api.put(`/profiles/${profileId}/photos/${photoId}/primary`);
      setPhotos(prev => prev.map(p => ({ ...p, is_primary: p.id === photoId })));
      toast.success('Hauptbild gesetzt');
    } catch {
      toast.error('Fehler');
    }
  };

  const handlePushPackageUpdate = async (active, daily_time) => {
    if (!profileId) {
      toast.error('Profil muss zuerst gespeichert werden');
      return;
    }
    
    try {
      const res = await api.put(`/profiles/${profileId}/push-package`, {
        active,
        daily_time,
        duration_days: 30
      });
      setForm(prev => ({ ...prev, push_package: res.data.push_package }));
      toast.success(active ? 'Push-Paket aktiviert' : 'Push-Paket deaktiviert');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Fehler beim Aktualisieren');
    }
  };

  const handleManualPush = async () => {
    if (!profileId) return;
    
    try {
      await api.post(`/profiles/${profileId}/push/manual`);
      toast.success('Profil wurde manuell gepusht');
      // Reload profile to get updated last_push_at
      const res = await api.get(`/profiles/${profileId}`);
      setForm(prev => ({ ...prev, push_package: res.data.push_package }));
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Fehler beim Push');
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex justify-center py-12"><Loader className="animate-spin text-white/40" /></div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link to="/admin/profile" className="text-white/40 hover:text-white/70 transition-colors"><ChevronLeft size={20} /></Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
              {isNew ? 'Neues Profil' : `Profil: ${form.name}`}
            </h1>
          </div>
          <div className="flex gap-2">
            {!isNew && (
              <a href={`/profile/${id}`} target="_blank" rel="noreferrer"
                className="px-3 py-1.5 rounded text-xs border border-white/15 text-white/60 hover:text-white transition-colors">Vorschau</a>
            )}
            <Button onClick={handleSave} disabled={saving} className="px-5" style={{ background: '#cc0000', color: '#fff' }}>
              {saving ? <Loader size={14} className="animate-spin" /> : 'Speichern'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="border border-white/10" style={{ background: '#111' }}>
            <TabsTrigger value="basic" className="text-white/60 data-[state=active]:text-white">Grunddaten</TabsTrigger>
            <TabsTrigger value="contact" className="text-white/60 data-[state=active]:text-white">Kontakt</TabsTrigger>
            <TabsTrigger value="photos" className="text-white/60 data-[state=active]:text-white">Fotos {photos.length > 0 && `(${photos.length})`}</TabsTrigger>
            <TabsTrigger value="push" className="text-white/60 data-[state=active]:text-white">Push-Paket</TabsTrigger>
            <TabsTrigger value="seo" className="text-white/60 data-[state=active]:text-white">SEO</TabsTrigger>
          </TabsList>

          {/* Basic Tab */}
          <TabsContent value="basic" className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Name *</label>
                <Input value={form.name} onChange={e => update('name', e.target.value)}
                  placeholder="Künstlername" className="border-white/15 bg-white/5 text-white" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Alter *</label>
                <Input value={form.age} onChange={e => update('age', e.target.value)}
                  type="number" min="18" className="border-white/15 bg-white/5 text-white" />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Stadt *</label>
              <Select value={form.city_slug} onValueChange={v => update('city_slug', v)}>
                <SelectTrigger className="border-white/15 bg-white/5 text-white">
                  <SelectValue placeholder="Stadt wählen" />
                </SelectTrigger>
                <SelectContent className="border-white/10" style={{ background: '#1a1a1a' }}>
                  {cities.map(c => <SelectItem key={c.slug} value={c.slug} className="text-white/80">{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Kategorien</label>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.map(cat => (
                  <button key={cat.slug} type="button" onClick={() => toggleCategory(cat.slug)}
                    className="px-3 py-1 rounded-md text-xs border transition-all"
                    style={{
                      borderColor: form.categories.includes(cat.slug) ? '#cc0000' : 'rgba(255,255,255,0.12)',
                      background: form.categories.includes(cat.slug) ? '#cc000022' : 'transparent',
                      color: form.categories.includes(cat.slug) ? '#ff2244' : '#b7b7b7'
                    }}>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Kurzbeschreibung</label>
              <Input value={form.short_desc} onChange={e => update('short_desc', e.target.value)}
                placeholder="Kurze, prägnante Beschreibung (1-2 Sätze)" className="border-white/15 bg-white/5 text-white" />
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Beschreibung</label>
              <Textarea value={form.description} onChange={e => update('description', e.target.value)}
                placeholder="Ausführliche Beschreibung..." rows={5} className="border-white/15 bg-white/5 text-white" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Nationalität</label>
                <Input value={form.nationality} onChange={e => update('nationality', e.target.value)}
                  placeholder="z.B. Deutsch" className="border-white/15 bg-white/5 text-white" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Größe (cm)</label>
                <Input value={form.height} onChange={e => update('height', e.target.value)}
                  type="number" placeholder="165" className="border-white/15 bg-white/5 text-white" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Gewicht (kg)</label>
                <Input value={form.weight} onChange={e => update('weight', e.target.value)}
                  type="number" placeholder="55" className="border-white/15 bg-white/5 text-white" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Verfügbarkeit</label>
                <Input value={form.availability} onChange={e => update('availability', e.target.value)}
                  placeholder="z.B. Heute" className="border-white/15 bg-white/5 text-white" />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Sprachen (kommagetrennt)</label>
              <Input value={form.languages} onChange={e => update('languages', e.target.value)}
                placeholder="Deutsch, Englisch" className="border-white/15 bg-white/5 text-white" />
            </div>

            {/* Status & Toggles */}
            <div className="rounded-xl p-4 border border-white/10 space-y-4" style={{ background: '#0d0d0d' }}>
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide">Status & Sichtbarkeit</h3>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Status</label>
                <Select value={form.status} onValueChange={v => update('status', v)}>
                  <SelectTrigger className="border-white/15 bg-white/5 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-white/10" style={{ background: '#1a1a1a' }}>
                    <SelectItem value="active" className="text-white/80">Aktiv</SelectItem>
                    <SelectItem value="pending" className="text-white/80">Ausstehend</SelectItem>
                    <SelectItem value="hidden" className="text-white/80">Versteckt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[['featured', 'Featured'], ['premium', 'Premium'], ['is_new', 'Neu-Badge'], ['verified', 'Verifiziert']].map(([field, label]) => (
                  <div key={field} className="flex items-center justify-between">
                    <span className="text-sm text-white/60">{label}</span>
                    <Switch checked={form[field]} onCheckedChange={v => update(field, v)} />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Reihenfolge (0 = oben)</label>
                <Input value={form.order} onChange={e => update('order', e.target.value)}
                  type="number" className="w-24 border-white/15 bg-white/5 text-white" />
              </div>
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-5">
            <div className="rounded-xl p-5 border border-white/10 space-y-5" style={{ background: '#111' }}>
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide">Kontaktinformationen</h3>
              
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Telefon (erforderlich für aktive Profile) *</label>
                <Input value={form.contact.phone || ''} onChange={e => updateContact('phone', e.target.value)}
                  placeholder="+49 xxx xxx xxxx" className="border-white/15 bg-white/5 text-white" />
                <p className="text-xs text-white/40 mt-1">Wird für den Standard-Anrufen-Button verwendet</p>
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1.5 block">WhatsApp</label>
                <Input value={form.contact.whatsapp || ''} onChange={e => updateContact('whatsapp', e.target.value)}
                  placeholder="+49 xxx xxx xxxx oder https://wa.me/..." className="border-white/15 bg-white/5 text-white" />
                <p className="text-xs text-white/40 mt-1">Telefonnummer im E.164-Format oder vollständiger wa.me Link</p>
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Telegram</label>
                <Input value={form.contact.telegram || ''} onChange={e => updateContact('telegram', e.target.value)}
                  placeholder="https://t.me/username" className="border-white/15 bg-white/5 text-white" />
                <p className="text-xs text-white/40 mt-1">Vollständiger Telegram-Link</p>
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Google Maps URL</label>
                <Input value={form.contact.maps_url || ''} onChange={e => updateContact('maps_url', e.target.value)}
                  placeholder="https://maps.google.com/..." className="border-white/15 bg-white/5 text-white" />
                <p className="text-xs text-white/40 mt-1">Google Maps Link für Navigation zum Standort</p>
              </div>
            </div>

            {/* Add-ons Section */}
            <div className="rounded-xl p-5 border border-white/10 space-y-4" style={{ background: '#111' }}>
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide">Kostenpflichtige Buttons (Add-ons)</h3>
              <p className="text-xs text-white/40">Aktiviere zusätzliche Kontakt-Buttons auf dem Profil</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10">
                  <div>
                    <p className="text-white font-medium text-sm">WhatsApp-Button</p>
                    <p className="text-xs text-white/50">Erfordert WhatsApp-Kontakt oben</p>
                  </div>
                  <Switch
                    checked={form.addons?.whatsapp_enabled || false}
                    onCheckedChange={v => updateAddons('whatsapp_enabled', v)}
                    disabled={!form.contact.whatsapp}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10">
                  <div>
                    <p className="text-white font-medium text-sm">Telegram-Button</p>
                    <p className="text-xs text-white/50">Erfordert Telegram-Link oben</p>
                  </div>
                  <Switch
                    checked={form.addons?.telegram_enabled || false}
                    onCheckedChange={v => updateAddons('telegram_enabled', v)}
                    disabled={!form.contact.telegram}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10">
                  <div>
                    <p className="text-white font-medium text-sm">Google Maps-Button</p>
                    <p className="text-xs text-white/50">Erfordert Maps-URL oben</p>
                  </div>
                  <Switch
                    checked={form.addons?.maps_enabled || false}
                    onCheckedChange={v => updateAddons('maps_enabled', v)}
                    disabled={!form.contact.maps_url}
                  />
                </div>
              </div>

              <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20 mt-4">
                <p className="text-xs text-blue-300">💡 Der Anrufen-Button wird immer angezeigt, wenn eine Telefonnummer hinterlegt ist</p>
              </div>
            </div>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-4">
            {!profileId && (
              <div className="rounded-xl p-4 text-sm text-white/50" style={{ background: '#111', border: '1px dashed rgba(255,255,255,0.1)' }}>
                Bitte erst das Profil speichern, dann können Fotos hochgeladen werden.
              </div>
            )}

            {profileId && (
              <>
                {/* Upload area */}
                <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed cursor-pointer transition-colors hover:border-red-500/50" style={{ borderColor: 'rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.03)' }}>
                  {uploading ? (
                    <><Loader size={20} className="text-white/40 animate-spin mb-2" /><span className="text-sm text-white/40">Upload läuft...</span></>
                  ) : (
                    <><Upload size={20} className="text-white/30 mb-2" /><span className="text-sm text-white/40">Fotos hochladen (WebP optimiert)</span><span className="text-xs text-white/25 mt-1">JPG, PNG, HEIC etc. — wird automatisch optimiert</span></>
                  )}
                  <input type="file" multiple accept="image/*" onChange={e => handlePhotoUpload(e.target.files)} className="hidden" disabled={uploading} />
                </label>

                {/* Photos grid */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {photos.map(photo => (
                      <div key={photo.id} className="relative group rounded-lg overflow-hidden border" style={{ aspectRatio: '3/4', borderColor: photo.is_primary ? '#cc0000' : 'rgba(255,255,255,0.1)' }}>
                        <img src={getImageUrl(photo)} alt={photo.alt} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2" style={{ background: 'rgba(0,0,0,0.6)' }}>
                          <button onClick={() => handleSetPrimary(photo.id)}
                            className="flex items-center gap-1 text-xs px-2 py-1 rounded font-medium"
                            style={{ background: photo.is_primary ? '#ffb020' : 'rgba(255,255,255,0.15)', color: photo.is_primary ? '#000' : '#fff' }}>
                            <Star size={11} /> {photo.is_primary ? 'Hauptbild' : 'Als Hauptbild'}
                          </button>
                          <button onClick={() => handleDeletePhoto(photo.id)}
                            className="flex items-center gap-1 text-xs px-2 py-1 rounded"
                            style={{ background: 'rgba(220,38,38,0.8)', color: '#fff' }}>
                            <Trash2 size={11} /> Löschen
                          </button>
                        </div>
                        {photo.is_primary && (
                          <div className="absolute top-1 left-1 text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: '#ffb020', color: '#000' }}>HAUPT</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Push Package Tab */}
          <TabsContent value="push" className="space-y-5">
            <div className="p-6 rounded-lg border border-white/10" style={{ background: '#0a0a0a' }}>
              <h3 className="text-lg font-semibold text-white mb-4">Push-Paket Management</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded bg-white/5 border border-white/10">
                  <div>
                    <p className="text-white font-medium">Push-Paket aktivieren</p>
                    <p className="text-xs text-white/50 mt-1">Automatischer täglicher Push zur festgelegten Uhrzeit</p>
                  </div>
                  <Switch
                    checked={form.push_package?.active || false}
                    onCheckedChange={checked => {
                      if (!profileId) {
                        toast.error('Profil muss zuerst gespeichert werden');
                        return;
                      }
                      const time = checked && !form.push_package?.daily_time ? '14:00' : form.push_package?.daily_time;
                      handlePushPackageUpdate(checked, time);
                    }}
                  />
                </div>

                {form.push_package?.active && (
                  <>
                    <div>
                      <label className="text-xs text-white/50 mb-1.5 block">Tägliche Push-Uhrzeit</label>
                      <Input
                        type="time"
                        value={form.push_package?.daily_time || '14:00'}
                        onChange={e => handlePushPackageUpdate(true, e.target.value)}
                        className="border-white/15 bg-white/5 text-white max-w-xs"
                      />
                      <p className="text-xs text-white/40 mt-1">Das Profil wird täglich zu dieser Zeit automatisch nach oben verschoben</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded bg-white/5 border border-white/10">
                        <p className="text-xs text-white/50 mb-1">Startdatum</p>
                        <p className="text-white">{form.push_package?.start_at ? new Date(form.push_package.start_at).toLocaleDateString('de-DE') : '-'}</p>
                      </div>
                      <div className="p-4 rounded bg-white/5 border border-white/10">
                        <p className="text-xs text-white/50 mb-1">Enddatum (30 Tage)</p>
                        <p className="text-white">{form.push_package?.end_at ? new Date(form.push_package.end_at).toLocaleDateString('de-DE') : '-'}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded bg-white/5 border border-white/10">
                      <p className="text-xs text-white/50 mb-1">Letzter Push</p>
                      <p className="text-white">{form.push_package?.last_run_at ? new Date(form.push_package.last_run_at).toLocaleString('de-DE') : 'Noch nicht gepusht'}</p>
                    </div>

                    <Button 
                      onClick={handleManualPush}
                      variant="outline"
                      className="border-white/15 text-white hover:bg-white/5"
                    >
                      Jetzt manuell pushen
                    </Button>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-4">
            <div className="rounded-xl p-5 border border-white/10 space-y-4" style={{ background: '#111' }}>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">SEO-Titel (max. 60 Zeichen)</label>
                <Input value={form.seo_title} onChange={e => update('seo_title', e.target.value)}
                  placeholder={`${form.name}, ${form.age} J. in ${form.city_slug} – Diskrete Begleitung`}
                  className="border-white/15 bg-white/5 text-white" />
                <div className="text-xs text-white/30 mt-1">{form.seo_title.length}/60</div>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">SEO-Beschreibung (max. 160 Zeichen)</label>
                <Textarea value={form.seo_description} onChange={e => update('seo_description', e.target.value)}
                  placeholder="Meta-Beschreibung für Suchmaschinen..." rows={3}
                  className="border-white/15 bg-white/5 text-white" />
                <div className="text-xs text-white/30 mt-1">{form.seo_description.length}/160</div>
              </div>
              {!isNew && (
                <div className="text-xs text-white/30 pt-2 border-t border-white/10">
                  Profil-URL: <span className="text-white/50">/profile/{id}</span>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom save button */}
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="px-8" style={{ background: '#cc0000', color: '#fff' }}>
            {saving ? <><Loader size={14} className="animate-spin mr-2" /> Speichern...</> : 'Profil speichern'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
