import React, { useState } from 'react';
import { Send, ArrowLeft, Clock, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../utils/api';

const COUNTRIES = ["Afghanistan","Albanien","Algerien","Angola","Argentinien","Armenien","Aserbaidschan","Australien","Belgien","Bosnien und Herzegowina","Brasilien","Bulgarien","Chile","China","Costa Rica","Dänemark","Deutschland","Dominikanische Republik","Ecuador","El Salvador","Estland","Finnland","Frankreich","Georgien","Griechenland","Großbritannien","Guatemala","Honduras","Indien","Indonesien","Irak","Iran","Irland","Israel","Italien","Jamaika","Japan","Jordanien","Kamerun","Kanada","Kasachstan","Kenia","Kolumbien","Kosovo","Kroatien","Kuba","Lettland","Libanon","Litauen","Luxemburg","Marokko","Mexiko","Moldawien","Montenegro","Neuseeland","Nicaragua","Niederlande","Nigeria","Nordmazedonien","Norwegen","Österreich","Pakistan","Panama","Paraguay","Peru","Philippinen","Polen","Portugal","Rumänien","Russland","Schweden","Schweiz","Serbien","Slowakei","Slowenien","Spanien","Südafrika","Südkorea","Syrien","Thailand","Tschechien","Tunesien","Türkei","Uganda","Ukraine","Ungarn","Uruguay","USA","Usbekistan","Venezuela","Vietnam","Weißrussland"];
const SPRACHEN = ["Deutsch","Englisch","Rumänisch","Bulgarisch","Kroatisch","Polnisch","Portugiesisch","Russisch","Serbisch","Spanisch","Türkisch","Ukrainisch"];
const NIVEAUS = ["Muttersprache", "Fließend", "Basics"];
const CUPS = ["A","B","C","D","DD","E","F","G oder mehr"];
const RASUR = ["Glattrasiert","Teilrasiert","Unrasiert"];
const TATTOOS = ["Wenige","Viele"];
const PIERCINGS = ["Nase","Zunge","Nippelpiercing","Intimpiercing","Andere"];
const TAGE = ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"];

export default function InserierenPage() {
  const [form, setForm] = useState({
    arbeitsname: '', nationalitaet: '', alter: '', sprachen: [],
    koerbchengroesse: '', gewicht: '', koerpergroesse: '', intimrasur: '',
    tattoos: '', piercings: [], service_typen: [], adresse_besuchbar: '',
    stadt: '', handynummer: '', zusatzoptionen: false,
    arbeitszeiten_247: false, arbeitszeiten: {}, inserat_text: '', email: ''
  });
  const [showZeiten, setShowZeiten] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({...p, [k]: v}));
  const toggleArr = (k, val) => setForm(p => {
    const arr = p[k] || [];
    return {...p, [k]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]};
  });
  const addSprache = (s) => { if (form.sprachen.find(x => x.sprache === s)) return; set('sprachen', [...form.sprachen, { sprache: s, niveau: 'Fließend' }]); };
  const removeSprache = (s) => set('sprachen', form.sprachen.filter(x => x.sprache !== s));
  const setSpracheNiveau = (s, n) => set('sprachen', form.sprachen.map(x => x.sprache === s ? {...x, niveau: n} : x));
  const setZeit = (tag, val) => set('arbeitszeiten', {...form.arbeitszeiten, [tag]: val});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.arbeitsname || !form.email || !form.stadt) return;
    setLoading(true);
    try {
      await api.post('/inserieren', { ...form, alter: parseInt(form.alter) || 0, arbeitszeiten: Object.keys(form.arbeitszeiten).length > 0 ? form.arbeitszeiten : null });
      setSent(true);
    } catch { alert('Fehler.'); }
    setLoading(false);
  };

  const inp = "w-full px-4 py-3.5 bg-transparent border rounded-lg text-[15px] text-white/80 placeholder-white/25 focus:outline-none focus:border-red-500/30 transition-colors";
  const sel = "w-full px-4 py-3.5 bg-[#0c0c0c] border rounded-lg text-[15px] text-white/80 focus:outline-none focus:border-red-500/30 appearance-none cursor-pointer";
  const lbl = "block text-[13px] font-bold tracking-[0.1em] uppercase text-white/50 mb-2.5";
  const sectionTitle = "text-[18px] font-bold tracking-tight mb-5 pt-6";

  if (sent) return (
    <div style={{ background: '#060606', minHeight: '100vh' }}>
      <Header />
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-24 text-center">
        <div className="rounded-2xl p-12" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <Check size={48} className="mx-auto mb-5 text-green-400" />
          <h2 className="text-3xl font-bold text-green-300 mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>Vielen Dank!</h2>
          <p className="text-white/50 text-[16px] leading-relaxed max-w-md mx-auto">
            Dein Inserat ist eingegangen. Du erhältst innerhalb von 1–2 Stunden eine Antwort per E-Mail. Bitte beobachte dein Postfach aufmerksam.
          </p>
          <Link to="/" className="inline-block mt-8 px-6 py-3 rounded-lg text-[14px] font-bold uppercase" style={{ background: '#dc1414', color: '#fff' }}>Zur Startseite</Link>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ background: '#060606', minHeight: '100vh' }}>
      <Header />
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <Link to="/" className="inline-flex items-center gap-2 text-[14px] text-white/40 hover:text-white/70 mb-8"><ArrowLeft size={14} /> Zurück</Link>
        <h1 className="text-4xl sm:text-5xl font-black mb-3" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>Inserieren</h1>
        <p className="text-white/45 text-[16px] mb-10">Erstelle dein Profil und werde Teil von NRWTreff.</p>

        <form onSubmit={handleSubmit} className="space-y-5" data-testid="inserieren-form">

          {/* === PERSÖNLICHES === */}
          <h3 className={sectionTitle} style={{ color: '#dc1414', borderTop: '1px solid rgba(220,20,20,0.15)', fontFamily: 'Oswald, sans-serif' }}>Persönliches</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div><label className={lbl}>Arbeitsname *</label><input type="text" required value={form.arbeitsname} onChange={e => set('arbeitsname', e.target.value)} placeholder="Dein Arbeitsname" className={inp} style={{ borderColor: 'rgba(255,255,255,0.1)' }} /></div>
            <div><label className={lbl}>E-Mail *</label><input type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="deine@email.de" className={inp} style={{ borderColor: 'rgba(255,255,255,0.1)' }} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div><label className={lbl}>Nationalität</label><select value={form.nationalitaet} onChange={e => set('nationalitaet', e.target.value)} className={sel} style={{ borderColor: 'rgba(255,255,255,0.1)' }}><option value="">Bitte wählen</option>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className={lbl}>Alter</label><input type="number" min="18" max="99" value={form.alter} onChange={e => set('alter', e.target.value)} placeholder="z.B. 25" className={inp} style={{ borderColor: 'rgba(255,255,255,0.1)' }} /></div>
          </div>

          {/* === SPRACHEN === */}
          <h3 className={sectionTitle} style={{ color: '#dc1414', borderTop: '1px solid rgba(220,20,20,0.15)', fontFamily: 'Oswald, sans-serif' }}>Sprachen</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {SPRACHEN.map(s => {
              const active = form.sprachen.find(x => x.sprache === s);
              return (
                <button key={s} type="button" onClick={() => active ? removeSprache(s) : addSprache(s)}
                  className="px-4 py-2 rounded-lg text-[13px] font-semibold transition-all"
                  style={{ background: active ? 'rgba(220,20,20,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${active ? 'rgba(220,20,20,0.3)' : 'rgba(255,255,255,0.1)'}`, color: active ? '#dc1414' : 'rgba(255,255,255,0.6)' }}>
                  {s}
                </button>
              );
            })}
          </div>
          {form.sprachen.length > 0 && (
            <div className="space-y-2">
              {form.sprachen.map(s => (
                <div key={s.sprache} className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-[14px] text-white/70 flex-1 font-medium">{s.sprache}</span>
                  {NIVEAUS.map(n => (
                    <button key={n} type="button" onClick={() => setSpracheNiveau(s.sprache, n)}
                      className="px-3 py-1.5 rounded text-[12px] font-semibold transition-all"
                      style={{ background: s.niveau === n ? 'rgba(220,20,20,0.15)' : 'transparent', color: s.niveau === n ? '#dc1414' : 'rgba(255,255,255,0.35)', border: `1px solid ${s.niveau === n ? 'rgba(220,20,20,0.2)' : 'transparent'}` }}>
                      {n}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* === KÖRPERLICH === */}
          <h3 className={sectionTitle} style={{ color: '#dc1414', borderTop: '1px solid rgba(220,20,20,0.15)', fontFamily: 'Oswald, sans-serif' }}>Körpermerkmale</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <div><label className={lbl}>Körbchengröße</label><select value={form.koerbchengroesse} onChange={e => set('koerbchengroesse', e.target.value)} className={sel} style={{ borderColor: 'rgba(255,255,255,0.1)' }}><option value="">Wählen</option>{CUPS.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className={lbl}>Gewicht (kg)</label><input type="text" value={form.gewicht} onChange={e => set('gewicht', e.target.value)} placeholder="z.B. 55" className={inp} style={{ borderColor: 'rgba(255,255,255,0.1)' }} /></div>
            <div><label className={lbl}>Größe (cm)</label><input type="text" value={form.koerpergroesse} onChange={e => set('koerpergroesse', e.target.value)} placeholder="z.B. 170" className={inp} style={{ borderColor: 'rgba(255,255,255,0.1)' }} /></div>
            <div><label className={lbl}>Intimrasur</label><select value={form.intimrasur} onChange={e => set('intimrasur', e.target.value)} className={sel} style={{ borderColor: 'rgba(255,255,255,0.1)' }}><option value="">Wählen</option>{RASUR.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div><label className={lbl}>Tattoos</label><select value={form.tattoos} onChange={e => set('tattoos', e.target.value)} className={sel} style={{ borderColor: 'rgba(255,255,255,0.1)' }}><option value="">Wählen</option>{TATTOOS.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            <div>
              <label className={lbl}>Piercings</label>
              <div className="flex flex-wrap gap-2">
                {PIERCINGS.map(p => (
                  <button key={p} type="button" onClick={() => toggleArr('piercings', p)}
                    className="px-3 py-2 rounded-lg text-[13px] font-semibold transition-all"
                    style={{ background: form.piercings.includes(p) ? 'rgba(220,20,20,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${form.piercings.includes(p) ? 'rgba(220,20,20,0.3)' : 'rgba(255,255,255,0.1)'}`, color: form.piercings.includes(p) ? '#dc1414' : 'rgba(255,255,255,0.6)' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* === SERVICE === */}
          <h3 className={sectionTitle} style={{ color: '#dc1414', borderTop: '1px solid rgba(220,20,20,0.15)', fontFamily: 'Oswald, sans-serif' }}>Angebote & Standort</h3>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => toggleArr('service_typen', 'Besuchbar')}
              className="px-5 py-3 rounded-lg text-[14px] font-semibold transition-all"
              style={{ background: form.service_typen.includes('Besuchbar') ? 'rgba(220,20,20,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${form.service_typen.includes('Besuchbar') ? 'rgba(220,20,20,0.25)' : 'rgba(255,255,255,0.1)'}`, color: form.service_typen.includes('Besuchbar') ? '#dc1414' : 'rgba(255,255,255,0.6)' }}>
              Besuchbar
            </button>
            <button type="button" onClick={() => toggleArr('service_typen', 'Haus- & Hotelbesuche')}
              className="px-5 py-3 rounded-lg text-[14px] font-semibold transition-all"
              style={{ background: form.service_typen.includes('Haus- & Hotelbesuche') ? 'rgba(220,20,20,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${form.service_typen.includes('Haus- & Hotelbesuche') ? 'rgba(220,20,20,0.25)' : 'rgba(255,255,255,0.1)'}`, color: form.service_typen.includes('Haus- & Hotelbesuche') ? '#dc1414' : 'rgba(255,255,255,0.6)' }}>
              Haus- & Hotelbesuche
            </button>
            <div className="px-5 py-3 rounded-lg text-[14px] font-semibold opacity-35 cursor-not-allowed" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>
              Online (bald verfügbar)
            </div>
          </div>

          {/* Address field when Besuchbar selected */}
          {form.service_typen.includes('Besuchbar') && (
            <div className="mt-3">
              <label className={lbl}>Adresse (wo bist du besuchbar?) *</label>
              <input type="text" value={form.adresse_besuchbar} onChange={e => set('adresse_besuchbar', e.target.value)}
                placeholder="Straße, Hausnummer, PLZ, Stadt" className={inp} style={{ borderColor: 'rgba(220,20,20,0.15)' }} />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div><label className={lbl}>Stadt *</label><input type="text" required value={form.stadt} onChange={e => set('stadt', e.target.value)} placeholder="z.B. Köln" className={inp} style={{ borderColor: 'rgba(255,255,255,0.1)' }} /></div>
            <div><label className={lbl}>Handynummer</label><input type="tel" value={form.handynummer} onChange={e => set('handynummer', e.target.value)} placeholder="+49 ..." className={inp} style={{ borderColor: 'rgba(255,255,255,0.1)' }} /></div>
          </div>

          {/* === EXTRAS === */}
          <h3 className={sectionTitle} style={{ color: '#dc1414', borderTop: '1px solid rgba(220,20,20,0.15)', fontFamily: 'Oswald, sans-serif' }}>Extras</h3>

          <label className="flex items-start gap-3 p-5 rounded-lg cursor-pointer transition-colors" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <input type="checkbox" checked={form.zusatzoptionen} onChange={e => set('zusatzoptionen', e.target.checked)} className="mt-1 accent-red-600 w-5 h-5" />
            <div>
              <span className="text-[15px] text-white/70 font-medium">Ich interessiere mich für Zusatzoptionen.</span>
              <p className="text-[13px] text-white/35 mt-1">Du kannst binnen 1–2 Stunden mit einer Antwort rechnen. Bitte beobachte dein E-Mail-Postfach.</p>
            </div>
          </label>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => { setShowZeiten(!showZeiten); set('arbeitszeiten_247', false); }}
              className="flex items-center gap-2 px-5 py-3 rounded-lg text-[14px] font-semibold transition-all"
              style={{ background: showZeiten ? 'rgba(220,20,20,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${showZeiten ? 'rgba(220,20,20,0.25)' : 'rgba(255,255,255,0.1)'}`, color: showZeiten ? '#dc1414' : 'rgba(255,255,255,0.6)' }}>
              <Clock size={15} /> Arbeitszeiten hinzufügen
            </button>
            <button type="button" onClick={() => { set('arbeitszeiten_247', !form.arbeitszeiten_247); setShowZeiten(false); }}
              className="flex items-center gap-2 px-5 py-3 rounded-lg text-[14px] font-semibold transition-all"
              style={{ background: form.arbeitszeiten_247 ? 'rgba(220,20,20,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${form.arbeitszeiten_247 ? 'rgba(220,20,20,0.25)' : 'rgba(255,255,255,0.1)'}`, color: form.arbeitszeiten_247 ? '#dc1414' : 'rgba(255,255,255,0.6)' }}>
              Ich bin 24/7 verfügbar
            </button>
          </div>

          {showZeiten && (
            <div className="space-y-2 p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {TAGE.map(tag => (
                <div key={tag} className="flex items-center gap-3">
                  <span className="w-28 text-[14px] text-white/50 shrink-0 font-medium">{tag}</span>
                  <input type="text" placeholder="z.B. 10:00 – 22:00" value={form.arbeitszeiten[tag] || ''} onChange={e => setZeit(tag, e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-transparent border rounded text-[14px] text-white/70 placeholder-white/20 focus:outline-none focus:border-red-500/30" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
                </div>
              ))}
            </div>
          )}

          <div>
            <label className={lbl}>Individuelles Inserat</label>
            <textarea rows={5} value={form.inserat_text} onChange={e => set('inserat_text', e.target.value)} placeholder="Dein Inseratstext, der veröffentlicht werden soll..."
              className={inp + " resize-none"} style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          </div>

          <button type="submit" disabled={loading} data-testid="ins-submit"
            className="w-full py-4 rounded-lg text-[15px] font-bold tracking-[0.06em] uppercase flex items-center justify-center gap-2 transition-all"
            style={{ background: loading ? 'rgba(220,20,20,0.1)' : '#dc1414', color: '#fff' }}>
            <Send size={16} /> {loading ? 'Wird gesendet...' : 'Inserat absenden'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
