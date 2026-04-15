import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Loader, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '../../components/ui/sonner';

export default function AdminLogin() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  if (user) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.username, form.password);
    } catch (err) {
      toast.error('Ungültige Zugangsdaten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4" style={{ background: '#0a0a0a' }}>
      <Toaster richColors theme="dark" />
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>
            NRW<span style={{ color: '#cc0000' }}>ADMIN</span>
          </div>
          <div className="text-sm text-white/40">Interner Bereich</div>
        </div>

        <div className="rounded-2xl p-6 border border-white/10" style={{ background: '#111' }}>
          <form data-testid="admin-login-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Benutzername</label>
              <Input
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                placeholder="Benutzername"
                required
                className="border-white/15 bg-white/5 text-white placeholder:text-white/30 h-11"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Passwort</label>
              <div className="relative">
                <Input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Passwort"
                  required
                  className="border-white/15 bg-white/5 text-white placeholder:text-white/30 h-11 pr-10"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 font-semibold"
              style={{ background: '#cc0000', color: '#fff' }}
            >
              {loading ? <><Loader size={16} className="mr-2 animate-spin" /> Anmelden...</> : 'Anmelden'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
