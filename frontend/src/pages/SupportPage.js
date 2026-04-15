import React, { useState } from 'react';
import { Send, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../utils/api';

export default function SupportPage() {
  const [form, setForm] = useState({ email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.subject || !form.message) return;
    setLoading(true);
    try {
      await api.post('/support', form);
      setSent(true);
    } catch { alert('Fehler beim Senden.'); }
    setLoading(false);
  };

  const inp = "w-full px-4 py-3 bg-transparent border rounded-lg text-[14px] text-white/80 placeholder-white/25 focus:outline-none focus:border-red-500/30 transition-colors";

  return (
    <div style={{ background: '#060606', minHeight: '100vh' }}>
      <Header />
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <Link to="/" className="inline-flex items-center gap-2 text-[13px] text-white/40 hover:text-white/70 mb-8 transition-colors">
          <ArrowLeft size={14} /> Zurück
        </Link>

        <h1 className="text-4xl sm:text-5xl font-black mb-3 tracking-tight" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>
          Support
        </h1>
        <p className="text-white/40 text-[15px] mb-10">Wir helfen dir gerne weiter.</p>

        {sent ? (
          <div className="rounded-2xl p-10 text-center" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <h2 className="text-2xl font-bold text-green-300 mb-3" style={{ fontFamily: 'Oswald, sans-serif' }}>Nachricht gesendet</h2>
            <p className="text-white/50 text-[15px]">Vielen Dank! Wir melden uns schnellstmöglich bei dir. Bitte beobachte dein E-Mail-Postfach.</p>
          </div>
        ) : (
          <>
            {/* Disclaimer */}
            <div className="rounded-xl p-5 mb-8 flex gap-3" style={{ background: 'rgba(220,20,20,0.06)', border: '1px solid rgba(220,20,20,0.12)' }}>
              <AlertTriangle size={20} className="shrink-0 mt-0.5" style={{ color: '#dc1414' }} />
              <p className="text-[13px] text-white/50 leading-relaxed">
                Bitte schildere dein Anliegen so detailliert wie möglich, damit wir dir bestmöglich helfen können. Wir geben uns größte Mühe, doch wir haften nicht für falsche Behauptungen, irreführende Angaben oder manipulierte Fotos Dritter.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" data-testid="support-form">
              <div>
                <label className="block text-[11px] font-semibold tracking-[0.15em] uppercase text-white/35 mb-2">E-Mail-Adresse *</label>
                <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="deine@email.de"
                  className={inp} style={{ borderColor: 'rgba(255,255,255,0.08)' }} data-testid="support-email" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-[0.15em] uppercase text-white/35 mb-2">Betreff *</label>
                <input type="text" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="Worum geht es?"
                  className={inp} style={{ borderColor: 'rgba(255,255,255,0.08)' }} data-testid="support-subject" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-[0.15em] uppercase text-white/35 mb-2">Dein Anliegen *</label>
                <textarea required rows={6} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Beschreibe dein Anliegen so genau wie möglich..."
                  className={inp + " resize-none"} style={{ borderColor: 'rgba(255,255,255,0.08)' }} data-testid="support-message" />
              </div>
              <button type="submit" disabled={loading} data-testid="support-submit"
                className="w-full py-4 rounded-lg text-[14px] font-bold tracking-[0.08em] uppercase flex items-center justify-center gap-2 transition-all duration-200"
                style={{ background: loading ? 'rgba(220,20,20,0.1)' : '#dc1414', color: '#fff' }}>
                <Send size={16} /> {loading ? 'Wird gesendet...' : 'Absenden'}
              </button>
            </form>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
