import React, { useState, useEffect } from 'react';
import { Building2, Save, Loader } from 'lucide-react';
import api from '../../utils/api';
import AdminLayout from './AdminLayout';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const CityEditor = ({ city, onSave }) => {
  const [form, setForm] = useState({
    seo_title: city.seo_title || '',
    seo_description: city.seo_description || '',
    description: city.description || ''
  });
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/cities/${city.id}`, form);
      onSave(city.id, form);
      toast.success(`${city.name} gespeichert`);
      setOpen(false);
    } catch {
      toast.error('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-b border-white/8 last:border-0">
      <div
        className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] cursor-pointer transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <Building2 size={14} className="text-white/40" />
          <span className="font-medium text-white/80">{city.name}</span>
          <span className="text-xs text-white/30">{city.region_slug}</span>
          {city.profile_count > 0 && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#cc000022', color: '#ff2244' }}>{city.profile_count} Profile</span>}
        </div>
        <div className="text-xs text-white/30">{open ? '▲' : '▼'}</div>
      </div>
      {open && (
        <div className="px-4 pb-4 space-y-3">
          <div>
            <label className="text-xs text-white/40 mb-1 block">SEO-Titel</label>
            <Input value={form.seo_title} onChange={e => setForm(p => ({ ...p, seo_title: e.target.value }))}
              placeholder={`Escort in ${city.name} – NRWLadies`}
              className="border-white/15 bg-white/5 text-white" />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">SEO-Beschreibung</label>
            <Textarea value={form.seo_description} onChange={e => setForm(p => ({ ...p, seo_description: e.target.value }))}
              placeholder="Meta-Beschreibung..." rows={2} className="border-white/15 bg-white/5 text-white text-sm" />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Seiten-Beschreibung</label>
            <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder={`Begleitung in ${city.name}, NRW`}
              className="border-white/15 bg-white/5 text-white" />
          </div>
          <Button onClick={handleSave} disabled={saving} size="sm" style={{ background: '#cc0000', color: '#fff' }}>
            {saving ? <Loader size={12} className="animate-spin mr-1" /> : <Save size={12} className="mr-1" />}
            Speichern
          </Button>
        </div>
      )}
    </div>
  );
};

export default function AdminCities() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cities')
      .then(res => setCities(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (id, data) => {
    setCities(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>Städte SEO</h1>
          <p className="text-sm text-white/40 mt-1">{cities.length} Städte — SEO-Felder bearbeiten</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader className="animate-spin text-white/40" /></div>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: '#111' }}>
            {cities.map(city => (
              <CityEditor key={city.id} city={city} onSave={handleSave} />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
