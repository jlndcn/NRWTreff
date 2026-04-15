import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Star, Loader } from 'lucide-react';
import api from '../../utils/api';
import AdminLayout from './AdminLayout';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { getImageUrl } from '../../utils/api';

const STATUS_STYLES = {
  active: { bg: '#2bd57622', color: '#2bd576', label: 'Aktiv' },
  hidden: { bg: '#88888822', color: '#888', label: 'Versteckt' },
  pending: { bg: '#ffb02022', color: '#ffb020', label: 'Ausstehend' }
};

export default function AdminProfiles() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [deleting, setDeleting] = useState(null);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20, status };
      if (search) params.search = search;
      const res = await api.get('/profiles', { params });
      setProfiles(res.data.profiles);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      toast.error('Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfiles(); }, [page, status]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); loadProfiles(); };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Profil "${name}" wirklich löschen?`)) return;
    setDeleting(id);
    try {
      await api.delete(`/profiles/${id}`);
      toast.success('Profil gelöscht');
      loadProfiles();
    } catch (err) {
      toast.error('Fehler beim Löschen');
    } finally {
      setDeleting(null);
    }
  };

  const toggleStatus = async (profile) => {
    const newStatus = profile.status === 'active' ? 'hidden' : 'active';
    try {
      await api.put(`/profiles/${profile.id}`, { ...profile, status: newStatus, contact: profile.contact || {} });
      toast.success(`Status auf "${newStatus}" geändert`);
      loadProfiles();
    } catch (err) {
      toast.error('Fehler');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>Profile</h1>
            <p className="text-sm text-white/40">{total} Profile insgesamt</p>
          </div>
          <Link
            to="/admin/profile/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold w-fit"
            style={{ background: '#cc0000', color: '#fff' }}
          >
            <Plus size={14} /> Neues Profil
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-5">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Suche nach Name..."
                className="pl-9 border-white/15 bg-white/5 text-white placeholder:text-white/30 h-9" />
            </div>
            <Button type="submit" size="sm" className="h-9" style={{ background: '#cc0000', color: '#fff' }}>Suchen</Button>
          </form>
          <Select value={status} onValueChange={v => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-36 h-9 border-white/15 bg-white/5 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-white/10" style={{ background: '#1a1a1a' }}>
              <SelectItem value="all" className="text-white/70">Alle Status</SelectItem>
              <SelectItem value="active" className="text-white/80">Aktiv</SelectItem>
              <SelectItem value="pending" className="text-white/80">Ausstehend</SelectItem>
              <SelectItem value="hidden" className="text-white/80">Versteckt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="animate-spin text-white/40" />
          </div>
        ) : (
          <div data-testid="admin-profiles-table" className="rounded-xl border border-white/10 overflow-hidden" style={{ background: '#111' }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wide">Profil</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wide hidden sm:table-cell">Stadt</th>
                  <th className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wide">Status</th>
                  <th className="text-right px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wide">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map(profile => {
                  const s = STATUS_STYLES[profile.status] || STATUS_STYLES.pending;
                  const photo = profile.photos?.find(p => p.is_primary) || profile.photos?.[0];
                  return (
                    <tr key={profile.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {photo ? (
                            <img src={getImageUrl(photo)} alt={profile.name} className="w-10 h-12 object-cover rounded-lg flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-12 rounded-lg flex-shrink-0" style={{ background: '#1a1a1a' }} />
                          )}
                          <div>
                            <div className="font-semibold text-white/90">{profile.name}</div>
                            <div className="text-xs text-white/40">{profile.age} J. • {profile.view_count || 0} Aufrufe</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/60 hidden sm:table-cell">{profile.city_slug}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                        {profile.featured && <span className="ml-1 text-xs px-1.5 py-0.5 rounded" style={{ background: '#cc000022', color: '#ff2244' }}>F</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => toggleStatus(profile)} className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors" title={profile.status === 'active' ? 'Verstecken' : 'Aktivieren'}>
                            {profile.status === 'active' ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <Link to={`/admin/profile/${profile.id}`} className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors">
                            <Edit2 size={14} />
                          </Link>
                          <button onClick={() => handleDelete(profile.id, profile.name)} disabled={deleting === profile.id}
                            className="p-1.5 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors">
                            {deleting === profile.id ? <Loader size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {profiles.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-12 text-center text-white/30">Keine Profile gefunden</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
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
