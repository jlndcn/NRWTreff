import React, { useState, useEffect } from 'react';
import { Eye, Check, X, Trash2, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../utils/api';
import AdminLayout from './AdminLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { getImageUrl } from '../../utils/api';

const STATUS_STYLES = {
  new: { bg: '#ff224422', color: '#ff2244', label: 'Neu' },
  reviewed: { bg: '#ffb02022', color: '#ffb020', label: 'Geprüft' },
  approved: { bg: '#2bd57622', color: '#2bd576', label: 'Angenommen' },
  rejected: { bg: '#88888822', color: '#888', label: 'Abgelehnt' }
};

const ApplicationRow = ({ app, onUpdate, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(app.status);
  const [notes, setNotes] = useState(app.notes || '');
  const [saving, setSaving] = useState(false);
  const s = STATUS_STYLES[status] || STATUS_STYLES.new;

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await onUpdate(app.id, status, notes);
      toast.success('Status aktualisiert');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-b border-white/8 last:border-0">
      <div className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white/90">{app.name}</span>
            <span className="text-xs text-white/40">{app.age} J. • {app.city}</span>
          </div>
          <div className="text-xs text-white/40 mt-0.5">{new Date(app.created_at).toLocaleDateString('de-DE')}</div>
        </div>
        <span className="text-xs px-2 py-0.5 rounded font-medium flex-shrink-0" style={{ background: s.bg, color: s.color }}>{s.label}</span>
        {expanded ? <ChevronUp size={14} className="text-white/40" /> : <ChevronDown size={14} className="text-white/40" />}
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-white/40 mb-1">Kontakt</div>
              <div className="text-white/70">{app.contact_info}</div>
            </div>
            {app.description && (
              <div>
                <div className="text-xs text-white/40 mb-1">Beschreibung</div>
                <div className="text-white/70 text-xs leading-relaxed">{app.description}</div>
              </div>
            )}
          </div>

          {app.photos?.length > 0 && (
            <div>
              <div className="text-xs text-white/40 mb-2">Fotos ({app.photos.length})</div>
              <div className="flex gap-2 flex-wrap">
                {app.photos.map((url, i) => (
                  <a key={`${app.id}-photo-${i}`} href={`${process.env.REACT_APP_BACKEND_URL}${url}`} target="_blank" rel="noreferrer">
                    <img src={`${process.env.REACT_APP_BACKEND_URL}${url}`} alt={`Foto ${i+1}`} className="w-20 h-24 object-cover rounded-lg border border-white/10" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="text-xs text-white/40 mb-1">Interne Notizen</div>
              <Textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Notizen..." rows={2} className="text-sm border-white/15 bg-white/5 text-white" />
            </div>
            <div className="space-y-2 pt-5">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-32 border-white/15 bg-white/5 text-white h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10" style={{ background: '#1a1a1a' }}>
                  <SelectItem value="new" className="text-xs">Neu</SelectItem>
                  <SelectItem value="reviewed" className="text-xs">Geprüft</SelectItem>
                  <SelectItem value="approved" className="text-xs">Angenommen</SelectItem>
                  <SelectItem value="rejected" className="text-xs">Abgelehnt</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleUpdate} disabled={saving} size="sm" className="w-32 h-8" style={{ background: '#cc0000', color: '#fff' }}>
                {saving ? <Loader size={12} className="animate-spin" /> : 'Speichern'}
              </Button>
              <Button onClick={() => onDelete(app.id)} variant="ghost" size="sm" className="w-32 h-8 text-white/30 hover:text-red-400">
                <Trash2 size={12} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/applications', { params: { status, page, limit: 20 } });
      setApplications(res.data.applications);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      toast.error('Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [status, page]);

  const handleUpdate = async (id, newStatus, notes) => {
    await api.put(`/applications/${id}`, { status: newStatus, notes });
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus, notes } : a));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bewerbung löschen?')) return;
    await api.delete(`/applications/${id}`);
    setApplications(prev => prev.filter(a => a.id !== id));
    toast.success('Bewerbung gelöscht');
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>Bewerbungen</h1>
            <p className="text-sm text-white/40">{total} Bewerbungen insgesamt</p>
          </div>
          <Select value={status} onValueChange={v => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-36 border-white/15 bg-white/5 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-white/10" style={{ background: '#1a1a1a' }}>
              <SelectItem value="all" className="text-white/70">Alle</SelectItem>
              <SelectItem value="new" className="text-white/80">Neu</SelectItem>
              <SelectItem value="reviewed" className="text-white/80">Geprüft</SelectItem>
              <SelectItem value="approved" className="text-white/80">Angenommen</SelectItem>
              <SelectItem value="rejected" className="text-white/80">Abgelehnt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader className="animate-spin text-white/40" /></div>
        ) : (
          <div data-testid="admin-applications-table" className="rounded-xl border border-white/10 overflow-hidden" style={{ background: '#111' }}>
            {applications.length > 0 ? (
              applications.map(app => (
                <ApplicationRow key={app.id} app={app} onUpdate={handleUpdate} onDelete={handleDelete} />
              ))
            ) : (
              <div className="py-12 text-center text-white/30">Keine Bewerbungen</div>
            )}
          </div>
        )}

        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(pages)].map((_, i) => (
              <button key={`page-${i + 1}`} onClick={() => setPage(i + 1)}
                className="w-8 h-8 rounded text-xs"
                style={{ background: page === i + 1 ? '#cc0000' : 'rgba(255,255,255,0.06)', color: page === i + 1 ? '#fff' : '#b7b7b7' }}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
