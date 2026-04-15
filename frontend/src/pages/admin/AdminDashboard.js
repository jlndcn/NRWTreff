import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, Building2, Eye, TrendingUp, Plus } from 'lucide-react';
import api from '../../utils/api';
import AdminLayout from './AdminLayout';

const StatCard = ({ label, value, icon: Icon, color = '#cc0000', sub }) => (
  <div className="rounded-xl p-5 border border-white/10" style={{ background: '#111' }}>
    <div className="flex items-start justify-between">
      <div>
        <div className="text-2xl font-bold text-white mb-0.5" style={{ fontFamily: 'Oswald, sans-serif' }}>{value ?? '—'}</div>
        <div className="text-sm text-white/50">{label}</div>
        {sub && <div className="text-xs text-white/30 mt-1">{sub}</div>}
      </div>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${color}22` }}>
        <Icon size={18} style={{ color }} />
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>Dashboard</h1>
            <p className="text-sm text-white/40 mt-0.5">NRWLadies – Adminübersicht</p>
          </div>
          <Link
            to="/admin/profile/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: '#cc0000', color: '#fff' }}
          >
            <Plus size={14} /> Neues Profil
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={`skeleton-${i}`} className="rounded-xl h-24 border border-white/10 animate-pulse" style={{ background: '#111' }} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard label="Profile gesamt" value={stats?.total_profiles} icon={Users} />
              <StatCard label="Aktiv" value={stats?.active_profiles} icon={TrendingUp} color="#2bd576" />
              <StatCard label="Ausstehend" value={stats?.pending_profiles} icon={Users} color="#ffb020" />
              <StatCard label="Versteckt" value={stats?.hidden_profiles} icon={Users} color="#666" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Städte" value={stats?.total_cities} icon={Building2} color="#4fa3e0" />
              <StatCard label="Bewerbungen" value={stats?.total_applications} icon={FileText} color="#b7b7b7" />
              <StatCard label="Neue Bew." value={stats?.new_applications} icon={FileText} color="#ff2244" sub="Ungelesen" />
              <StatCard label="Aufrufe" value={stats?.total_views} icon={Eye} color="#2bd576" />
            </div>
          </>
        )}

        {/* Quick actions */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>Schnellzugriff</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Alle Profile', href: '/admin/profile', icon: Users },
              { label: 'Neues Profil', href: '/admin/profile/new', icon: Plus },
              { label: 'Bewerbungen', href: '/admin/bewerbungen', icon: FileText },
              { label: 'Städte SEO', href: '/admin/staedte', icon: Building2 },
            ].map(item => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-2 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors text-sm text-white/70 hover:text-white"
                style={{ background: '#111' }}
              >
                <item.icon size={16} />{item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
