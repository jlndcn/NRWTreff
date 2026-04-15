import React, { useState } from 'react';
import { Send, ArrowLeft, Clock, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../utils/api';

const COUNTRIES = ["Afghanistan","Albanien","Algerien","Angola","Argentinien","Armenien","Aserbaidschan","Australien","Belgien","Bosnien und Herzegowina","Brasilien","Bulgarien","Chile","China","Costa Rica","Dänemark","Deutschland","Dominikanische Republik","Ecuador","El Salvador","Estland","Finnland","Frankreich","Georgien","Griechenland","Großbritannien","Guatemala","Honduras","Indien","Indonesien","Irak","Iran","Irland","Israel","Italien","Jamaika","Japan","Jordanien","Kamerun","Kanada","Kasachstan","Kenia","Kolumbien","Kosovo","Kroatien","Kuba","Lettland","Libanon","Litauen","Luxemburg","Marokko","Mexiko","Moldawien","Montenegro","Neuseeland","Nicaragua","Niederlande","Nigeria","Nordmazedonien","Norwegen","Österreich","Pakistan","Panama","Paraguay","Peru","Philippinen","Polen","Portugal","Rumänien","Russland","Schweden","Schweiz","Serbien","Slowakei","Slowenien","Spanien","Südafrika","Südkorea","Syrien","Thailand","Tschechien","Tunesien","Türkei","Uganda","Ukraine","Ungarn","Uruguay","USA","Usbekistan","Venezuela","Vietnam","Weißrussland"];
const SPRACHEN = ["Bulgarisch","Deutsch","Englisch","Kroatisch","Polnisch","Portugiesisch","Rumänisch","Russisch","Serbisch","Spanisch","Türkisch","Ukrainisch"];
const NIVEAUS = ["Muttersprache", "Fließend", "Basics"];
const CUPS = ["A","B","C","D","DD","E","F","G oder mehr"];
const RASUR = ["Glattrasiert","Teilrasiert","Unrasiert"];
const TATTOOS = ["Wenige","Viele"];
const PIERCINGS = ["Nase","Zunge","Nippelpiercing","Intimpiercing","Andere"];
const SERVICES = ["Besuchbar","Haus- & Hotelbesuche"];
const TAGE = ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"];

export default function InserierenPage() {
  const [form, setForm] = useState({
    arbeitsname: '', nationalitaet: '', alter: '', sprachen: [],
    koerbchengroesse: '', gewicht: '', koerpergroesse: '', intimrasur: '',
    tattoos: '', piercings: [], service_typen: [], stadt: '', handynummer: '',
    zusatzoptionen: false, arbeitszeiten_247: false, arbeitszeiten: {},
    inserat_text: '', email: ''
  });
  const [showZeiten, setShowZeiten] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({...p, [k]: v}));

  const toggleArr = (k, val) => {
    setForm(p => {
      const arr = p[k] || [];
      return {...p, [k]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]};
    });
  };

  const addSprache = (sprache) => {
    if (form.sprachen.find(s => s.sprache === sprache)) return;
    set('sprachen', [...form.sprachen, { sprache, niveau: 'Fließend' }]);
  };
  const removeSprache = (sprache) => set('sprachen', form.sprachen.filter(s => s.sprache !== sprache));
  const setSpracheNiveau = (sprache, niveau) => set('sprachen', form.sprachen.map(s => s.sprache === sprache ? {...s, niveau} : s));

  const setZeit = (tag, val) => set('arbeitszeiten', {...form.arbeitszeiten, [tag]: val});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.arbeitsname || !form.email || !form.stadt) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        alter: parseInt(form.alter) || 0,
        arbeitszeiten: Object.keys(form.arbeitszeiten).length > 0 ? form.arbeitszeiten : null,
      };
      await api.post('/inserieren', payload);
      setSent(true);
    } catch { alert('Fehler beim Senden.'); }
    setLoading(false);
  };

  const inp = "w-full px-4 py-3 bg-transparent border rounded-lg text-[14px] text-white/80 placeholder-white/25 focus:outline-none focus:border-red-500/30 transition-colors";
  const sel = "w-full px-4 py-3 bg-[#0c0c0c] border rounded-lg text-[14px] text-white/80 focus:outline-none focus:border-red-500/30 transition-colors appearance-none cursor-pointer";
  const lbl = "block text-[11px] font-semibold tracking-[0.15em] uppercase text-white/40 mb-2";

  if (sent) return (
    <div style={{ background: '#060606', minHeight: '100vh' }}>
      <Header />
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-24 text-center">
        <div className="rounded-2xl p-12" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <Check size={48} className="mx-auto mb-5 text-green-400" />
          <h2 className="text-3xl font-bold text-green-300 mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>Vielen Dank!</h2>
          <p className="text-white/50 text-[15px] leading-relaxed max-w-md mx-auto">
            Dein Inserat ist bei uns eingegangen. Wir bitten um etwas Geduld – du erhältst innerhalb von 1–2 Stunden eine Antwort per E-Mail. Bitte beobachte dein Postfach aufmerksam.
          </p>
          <Link to="/" className="inline-block mt-8 px-6 py-3 rounded-lg text-[13px] font-bold uppercase tracking-wide" style={{ background: '#dc1414', color: '#fff' }}>Zurück zur Startseite</Link>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ background: '#060606', minHeight: '100vh' }}>
      <Header />
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <Link to="/" className="inline-flex items-center gap-2 text-[13px] text-white/40 hover:text-white/70 mb-8 transition-colors"><ArrowLeft size={14} /> Zurück</Link>

        <h1 className="text-4xl sm:text-5xl font-black mb-3 tracking-tight" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>Inserieren</h1>
        <p className="text-white/40 text-[15px] mb-10">Erstelle dein Profil und werde Teil von NRWTreff.</p>

        <form onSubmit={handleSubmit} className="space-y-6" data-testid="inserieren-form">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={lbl}>Arbeitsname *</label>
              <input type="text" required value={form.arbeitsname} onChange={e => set('arbeitsname', e.target.value)} placeholder="Dein Arbeitsname" className={inp} style={{ borderColor: 'rgba(255,255,255,0.08)' }} data-testid="ins-name" />
            </div>
            <div>
              <label className={lbl}>E-Mail *</label>
              <input type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="deine@email.de" className={inp} style={{ borderColor: 'rgba(255,255,255,0.08)' }} data-testid="ins-email" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={lbl}>Nationalität</label>
              <select value={form.nationalitaet} onChange={e => set('nationalitaet', e.target.value)} className={sel} style={{ borderColor: 'rgba(255,255,255,0.08)' }} data-testid="ins-nation">
                <option value="">Bitte wählen</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Alter</label>
              <input type="number" min="18" max="99" value={form.alter} onChange={e => set('alter', e.target.value)} placeholder="z.B. 25" className={inp} style={{ borderColor: 'rgba(255,255,255,0.08)' }} data-testid="ins-age" />
            </div>
          </div>

          {/* Sprachen */}
          <div>
            <label className={lbl}>Sprachen</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {SPRACHEN.map(s => {
                const active = form.sprachen.find(x => x.sprache === s);
                return (
                  <button key={s} type="button" onClick={() => active ? removeSprache(s) : addSprache(s)}
                    className="px-3 py-1.5 rounded text-[12px] font-medium transition-all"
                    style={{ background: active ? 'rgba(220,20,20,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${active ? 'rgba(220,20,20,0.3)' : 'rgba(255,255,255,0.08)'}`, color: active ? '#dc1414' : 'rgba(255,255,255,0.5)' }}>
                    {s}
                  </button>
                );
              })}
            </div>
            {form.sprachen.length > 0 && (
              <div className="space-y-2">
                {form.sprachen.map(s => (
                  <div key={s.sprache} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-[13px] text-white/60 flex-1">{s.sprache}</span>
                    {NIVEAUS.map(n => (
                      <button key={n} type="button" onClick={() => setSpracheNiveau(s.sprache, n)}
                        className="px-2.5 py-1 rounded text-[11px] font-medium transition-all"
                        style={{ background: s.niveau === n ? 'rgba(220,20,20,0.15)' : 'transparent', color: s.niveau === n ? '#dc1414' : 'rgba(255,255,255,0.35)', border: `1px solid ${s.niveau === n ? 'rgba(220,20,20,0.2)' : 'transparent'}` }}>
                        {n}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Body */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <div>
              <label className={lbl}>Körbchengröße</label>
              <select value={form.koerbchengroesse} onChange={e => set('koerbchengroesse', e.target.value)} className={sel} style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <option value="">Wählen</option>
                {CUPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Gewicht (kg)</label>
              <input type="text" value={form.gewicht} onChange={e => set('gewicht', e.target.value)} placeholder="z.B. 55" className={inp} style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            </div>
            <div>
              <label className={lbl}>Größe (cm)</label>
              <input type="text" value={form.koerpergroesse} onChange={e => set('koerpergroesse', e.target.value)} placeholder="z.B. 170" className={inp} style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            </div>
            <div>
              <label className={lbl}>Intimrasur</label>
              <select value={form.intimrasur} onChange={e => set('intimrasur', e.target.value)} className={sel} style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <option value="">Wählen</option>
                {RASUR.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={lbl}>Tattoos</label>
              <select value={form.tattoos} onChange={e => set('tattoos', e.target.value)} className={sel} style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <option value="">Wählen</option>
                {TATTOOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Piercings</label>
              <div className="flex flex-wrap gap-2">
                {PIERCINGS.map(p => (
                  <button key={p} type="button" onClick={() => toggleArr('piercings', p)}
                    className="px-3 py-1.5 rounded text-[12px] font-medium transition-all"
                    style={{ background: form.piercings.includes(p) ? 'rgba(220,20,20,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${form.piercings.includes(p) ? 'rgba(220,20,20,0.3)' : 'rgba(255,255,255,0.08)'}`, color: form.piercings.includes(p) ? '#dc1414' : 'rgba(255,255,255,0.5)' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Service */}
          <div>
            <label className={lbl}>Angebote</label>
            <div className="flex flex-wrap gap-3">
              {SERVICES.map(s => (
                <button key={s} type="button" onClick={() => toggleArr('service_typen', s)}
                  className="px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all"
                  style={{ background: form.service_typen.includes(s) ? 'rgba(220,20,20,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${form.service_typen.includes(s) ? 'rgba(220,20,20,0.25)' : 'rgba(255,255,255,0.08)'}`, color: form.service_typen.includes(s) ? '#dc1414' : 'rgba(255,255,255,0.5)' }}>
                  {s}
                </button>
              ))}
              <div className="px-4 py-2.5 rounded-lg text-[13px] font-medium opacity-40 cursor-not-allowed" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>
                Online (bald verfügbar)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={lbl}>Stadt *</label>
              <input type="text" required value={form.stadt} onChange={e => set('stadt', e.target.value)} placeholder="z.B. Köln" className={inp} style={{ borderColor: 'rgba(255,255,255,0.08)' }} data-testid="ins-city" />
            </div>
            <div>
              <label className={lbl}>Handynummer</label>
              <input type="tel" value={form.handynummer} onChange={e => set('handynummer', e.target.value)} placeholder="+49 ..." className={inp} style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            </div>
          </div>

          {/* Zusatzoptionen */}
          <label className="flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-colors" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <input type="checkbox" checked={form.zusatzoptionen} onChange={e => set('zusatzoptionen', e.target.checked)} className="mt-1 accent-red-600" />
            <div>
              <span className="text-[14px] text-white/70 font-medium">Ich interessiere mich für Zusatzoptionen.</span>
              <p className="text-[12px] text-white/35 mt-1">Du kannst binnen 1–2 Stunden mit einer Antwort rechnen. Bitte beobachte dein E-Mail-Postfach aufmerksam.</p>
            </div>
          </label>

          {/* Arbeitszeiten */}
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => { setShowZeiten(!showZeiten); set('arbeitszeiten_247', false); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all"
              style={{ background: showZeiten ? 'rgba(220,20,20,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${showZeiten ? 'rgba(220,20,20,0.25)' : 'rgba(255,255,255,0.08)'}`, color: showZeiten ? '#dc1414' : 'rgba(255,255,255,0.5)' }}>
              <Clock size={14} /> Arbeitszeiten hinzufügen
            </button>
            <button type="button" onClick={() => { set('arbeitszeiten_247', !form.arbeitszeiten_247); setShowZeiten(false); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all"
              style={{ background: form.arbeitszeiten_247 ? 'rgba(220,20,20,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${form.arbeitszeiten_247 ? 'rgba(220,20,20,0.25)' : 'rgba(255,255,255,0.08)'}`, color: form.arbeitszeiten_247 ? '#dc1414' : 'rgba(255,255,255,0.5)' }}>
              Ich bin 24/7 verfügbar
            </button>
          </div>

          {showZeiten && (
            <div className="space-y-2 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {TAGE.map(tag => (
                <div key={tag} className="flex items-center gap-3">
                  <span className="w-24 text-[13px] text-white/50 shrink-0">{tag}</span>
                  <input type="text" placeholder="z.B. 10:00 – 22:00" value={form.arbeitszeiten[tag] || ''} onChange={e => setZeit(tag, e.target.value)}
                    className="flex-1 px-3 py-2 bg-transparent border rounded text-[13px] text-white/70 placeholder-white/20 focus:outline-none focus:border-red-500/30 transition-colors" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
                </div>
              ))}
            </div>
          )}

          {/* Inserat */}
          <div>
            <label className={lbl}>Individuelles Inserat</label>
            <textarea rows={5} value={form.inserat_text} onChange={e => set('inserat_text', e.target.value)} placeholder="Schreibe hier deinen individuellen Inseratstext, der veröffentlicht werden soll..."
              className={inp + " resize-none"} style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
          </div>

          <button type="submit" disabled={loading} data-testid="ins-submit"
            className="w-full py-4 rounded-lg text-[14px] font-bold tracking-[0.08em] uppercase flex items-center justify-center gap-2 transition-all duration-200"
            style={{ background: loading ? 'rgba(220,20,20,0.1)' : '#dc1414', color: '#fff' }}>
            <Send size={16} /> {loading ? 'Wird gesendet...' : 'Inserat absenden'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
