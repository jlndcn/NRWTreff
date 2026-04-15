import React, { useState, useRef } from 'react';
import { Send, ArrowLeft, Clock, Check, ChevronDown, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../utils/api';

const COUNTRIES = ["Afghanistan","Albanien","Algerien","Angola","Argentinien","Armenien","Australien","Belgien","Bosnien und Herzegowina","Brasilien","Bulgarien","Chile","China","Dänemark","Deutschland","Dominikanische Republik","Ecuador","Estland","Finnland","Frankreich","Georgien","Griechenland","Großbritannien","Indien","Indonesien","Irak","Iran","Irland","Israel","Italien","Japan","Kanada","Kasachstan","Kolumbien","Kosovo","Kroatien","Kuba","Lettland","Libanon","Litauen","Luxemburg","Marokko","Mexiko","Moldawien","Montenegro","Neuseeland","Niederlande","Nigeria","Nordmazedonien","Norwegen","Österreich","Pakistan","Peru","Philippinen","Polen","Portugal","Rumänien","Russland","Schweden","Schweiz","Serbien","Slowakei","Slowenien","Spanien","Südafrika","Syrien","Thailand","Tschechien","Tunesien","Türkei","Uganda","Ukraine","Ungarn","Uruguay","USA","Usbekistan","Venezuela","Vietnam","Weißrussland"];
const SPRACHEN = ["Deutsch","Englisch","Rumänisch","Bulgarisch","Kroatisch","Polnisch","Portugiesisch","Russisch","Serbisch","Spanisch","Türkisch","Ukrainisch"];
const NIVEAUS = ["Muttersprache","Fließend","Basics"];
const CUPS = ["A","B","C","D","DD","E","F","G oder mehr"];
const RASUR = ["Glattrasiert","Teilrasiert","Unrasiert"];
const TATTOOS = ["Wenige","Viele"];
const PIERCINGS = ["Nase","Zunge","Nippelpiercing","Intimpiercing","Andere"];
const TAGE = ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"];
const SERVICE_WICHTIG = ["Geschlechtsverkehr","Oralverkehr (aktiv)","Oralverkehr (passiv)","Küssen","Zungenküsse","Partyservice","Girlfriendsex","Massage","Dominant","Devot","Füße","Natursekt","Anal","StrapOn"];
const SERVICE_OPTIONAL = ["Deepthroat","Tittenfick","3er","MMF","Gang-Bang","Facefuck","BDSM","Fetisch (bizarr)","Handjob","Squirting"];

const Dropdown = ({ label, open, setOpen, children }) => (
  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
    <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/[0.02]">
      <span className="text-[14px] font-semibold text-white/60">{label}</span>
      <ChevronDown size={16} className={`text-white/30 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
    </button>
    {open && <div className="px-5 pb-5 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>{children}</div>}
  </div>
);

export default function InserierenPage() {
  const [form, setForm] = useState({
    arbeitsname: '', nationalitaet: '', alter: '', sprachen: [],
    koerbchengroesse: '', gewicht: '', koerpergroesse: '', intimrasur: '',
    tattoos: '', piercings: [], service_typen: [], adresse_besuchbar: '',
    stadt: '', handynummer: '', zusatzoptionen: false,
    arbeitszeiten_247: false, arbeitszeiten: {}, inserat_text: '', email: '',
    service_wichtig: [], service_optional: []
  });
  const [files, setFiles] = useState([]);
  const [showZeiten, setShowZeiten] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sprachenOpen, setSprachenOpen] = useState(false);
  const [piercingsOpen, setPiercingsOpen] = useState(false);
  const [svcWichtigOpen, setSvcWichtigOpen] = useState(false);
  const [svcOptionalOpen, setSvcOptionalOpen] = useState(false);
  const fileRef = useRef(null);

  const set = (k, v) => setForm(p => ({...p, [k]: v}));
  const toggleArr = (k, val) => setForm(p => {
    const arr = p[k] || [];
    return {...p, [k]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]};
  });
  const addSprache = (s) => { if (form.sprachen.find(x => x.sprache === s)) return; set('sprachen', [...form.sprachen, {sprache:s,niveau:'Fließend'}]); };
  const removeSprache = (s) => set('sprachen', form.sprachen.filter(x => x.sprache !== s));
  const setSpracheNiveau = (s, n) => set('sprachen', form.sprachen.map(x => x.sprache === s ? {...x,niveau:n} : x));
  const setZeit = (tag, val) => set('arbeitszeiten', {...form.arbeitszeiten, [tag]: val});

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles].slice(0, 10));
  };
  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.arbeitsname || !form.email || !form.stadt) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify({...form, alter: parseInt(form.alter) || 0, arbeitszeiten: Object.keys(form.arbeitszeiten).length > 0 ? form.arbeitszeiten : null}));
      files.forEach(f => formData.append('files', f));
      await api.post('/inserieren', {...form, alter: parseInt(form.alter) || 0, arbeitszeiten: Object.keys(form.arbeitszeiten).length > 0 ? form.arbeitszeiten : null});
      setSent(true);
    } catch { alert('Fehler.'); }
    setLoading(false);
  };

  const inp = "w-full px-4 py-3.5 bg-transparent border rounded-lg text-[15px] text-white/80 placeholder-white/25 focus:outline-none focus:border-amber-600/40 transition-colors";
  const sel = "w-full px-4 py-3.5 bg-[#0c0c0c] border rounded-lg text-[15px] text-white/80 focus:outline-none focus:border-amber-600/40 appearance-none cursor-pointer";
  const lbl = "block text-[13px] font-bold tracking-[0.1em] uppercase text-white/50 mb-2.5";
  const secHead = "text-[17px] font-bold tracking-tight mb-5 pt-6";

  if (sent) return (
    <div style={{ background: '#060606', minHeight: '100vh' }}>
      <Header /><div className="max-w-2xl mx-auto px-5 sm:px-8 py-24 text-center">
        <div className="rounded-2xl p-12" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <Check size={48} className="mx-auto mb-5 text-green-400" />
          <h2 className="text-3xl font-bold text-green-300 mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>Vielen Dank!</h2>
          <p className="text-white/50 text-[16px] leading-relaxed max-w-md mx-auto">Dein Inserat ist eingegangen. Du erhältst innerhalb von 1–2 Stunden eine Antwort per E-Mail.</p>
          <Link to="/" className="inline-block mt-8 px-6 py-3 rounded-lg text-[14px] font-bold uppercase" style={{ background: '#dc1414', color: '#fff' }}>Zur Startseite</Link>
        </div>
      </div><Footer />
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
          {/* PERSÖNLICHES */}
          <h3 className={secHead} style={{ color: '#c47030', borderTop: '1px solid rgba(196,112,48,0.2)', fontFamily: 'Oswald, sans-serif' }}>Persönliches</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div><label className={lbl}>Arbeitsname *</label><input type="text" required value={form.arbeitsname} onChange={e => set('arbeitsname', e.target.value)} placeholder="Dein Arbeitsname" className={inp} style={{ borderColor: 'rgba(255,255,255,0.1)' }} /></div>
            <div><label className={lbl}>E-Mail *</label><input type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="deine@email.de" className={inp} style={{ borderColor: 'rgba(255,255,255,0.1)' }} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div><label className={lbl}>Nationalität</label><select value={form.nationalitaet} onChange={e => set('nationalitaet', e.target.value)} className={sel} style={{ borderColor: 'rgba(255,255,255,0.1)' }}><option value="">Bitte wählen</option>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className={lbl}>Alter</label><input type="number" min="18" max="99" value={form.alter} onChange={e => set('alter', e.target.value)} placeholder="z.B. 25" className={inp} style={{ borderColor: 'rgba(255,255,255,0.1)' }} /></div>
          </div>

          {/* SPRACHEN — Dropdown */}
          <h3 className={secHead} style={{ color: '#c47030', borderTop: '1px solid rgba(196,112,48,0.2)', fontFamily: 'Oswald, sans-serif' }}>Sprachen</h3>
          <Dropdown label={`Sprachen auswählen${form.sprachen.length > 0 ? ` (${form.sprachen.length})` : ''}`} open={sprachenOpen} setOpen={setSprachenOpen}>
            <div className="flex flex-wrap gap-2 mb-3">
              {SPRACHEN.map(s => {
                const a = form.sprachen.find(x => x.sprache === s);
                return <button key={s} type="button" onClick={() => a ? removeSprache(s) : addSprache(s)} className="px-4 py-2 rounded-lg text-[13px] font-semibold transition-all"
                  style={{ background: a ? 'rgba(196,112,48,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${a ? 'rgba(196,112,48,0.3)' : 'rgba(255,255,255,0.1)'}`, color: a ? '#c47030' : 'rgba(255,255,255,0.6)' }}>{s}</button>;
              })}
            </div>
            {form.sprachen.map(s => (
              <div key={s.sprache} className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-2" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-[14px] text-white/70 flex-1 font-medium">{s.sprache}</span>
                {NIVEAUS.map(n => <button key={n} type="button" onClick={() => setSpracheNiveau(s.sprache, n)} className="px-2.5 py-1 rounded text-[12px] font-semibold transition-all"
                  style={{ background: s.niveau === n ? 'rgba(196,112,48,0.15)' : 'transparent', color: s.niveau === n ? '#c47030' : 'rgba(255,255,255,0.35)', border: `1px solid ${s.niveau === n ? 'rgba(196,112,48,0.2)' : 'transparent'}` }}>{n}</button>)}
              </div>
            ))}
          </Dropdown>

          {/* KÖRPERLICH */}
          <h3 className={secHead} style={{ color: '#c47030', borderTop: '1px solid rgba(196,112,48,0.2)', fontFamily: 'Oswald, sans-serif' }}>Körpermerkmale</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <div><label className={lbl}>Körbchengröße</label><select value={form.koerbchengroesse} onChange={e => set('koerbchengroesse', e.target.value)} className={sel} style={{ borderColor: 'rgba(255,255,255,0.1)' }}><option value="">Wählen</option>{CUPS.map(c => <option key={c}>{c}</option>)}</select></div>
            <div><label className={lbl}>Gewicht (kg)</label><input type="text" value={form.gewicht} onChange={e => set('gewicht', e.target.value)} placeholder="55" className={inp} style={{ borderColor: 'rgba(255,255,255,0.1)' }} /></div>
            <div><label className={lbl}>Größe (cm)</label><input type="text" value={form.koerpergroesse} onChange={e => set('koerpergroesse', e.target.value)} placeholder="170" className={inp} style={{ borderColor: 'rgba(255,255,255,0.1)' }} /></div>
            <div><label className={lbl}>Intimrasur</label><select value={form.intimrasur} onChange={e => set('intimrasur', e.target.value)} className={sel} style={{ borderColor: 'rgba(255,255,255,0.1)' }}><option value="">Wählen</option>{RASUR.map(r => <option key={r}>{r}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div><label className={lbl}>Tattoos</label><select value={form.tattoos} onChange={e => set('tattoos', e.target.value)} className={sel} style={{ borderColor: 'rgba(255,255,255,0.1)' }}><option value="">Wählen</option>{TATTOOS.map(t => <option key={t}>{t}</option>)}</select></div>
            <div>
              <label className={lbl}>Piercings</label>
              <Dropdown label={`Piercings${form.piercings.length > 0 ? ` (${form.piercings.length})` : ''}`} open={piercingsOpen} setOpen={setPiercingsOpen}>
                <div className="flex flex-wrap gap-2">
                  {PIERCINGS.map(p => <button key={p} type="button" onClick={() => toggleArr('piercings', p)} className="px-3 py-2 rounded-lg text-[13px] font-semibold transition-all"
                    style={{ background: form.piercings.includes(p) ? 'rgba(196,112,48,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${form.piercings.includes(p) ? 'rgba(196,112,48,0.3)' : 'rgba(255,255,255,0.1)'}`, color: form.piercings.includes(p) ? '#c47030' : 'rgba(255,255,255,0.6)' }}>{p}</button>)}
                </div>
              </Dropdown>
            </div>
          </div>

          {/* ANGEBOTE */}
          <h3 className={secHead} style={{ color: '#c47030', borderTop: '1px solid rgba(196,112,48,0.2)', fontFamily: 'Oswald, sans-serif' }}>Angebote & Standort</h3>
          <div className="flex flex-wrap gap-3">
            {['Besuchbar','Haus- & Hotelbesuche'].map(s => <button key={s} type="button" onClick={() => toggleArr('service_typen', s)} className="px-5 py-3 rounded-lg text-[14px] font-semibold transition-all"
              style={{ background: form.service_typen.includes(s) ? 'rgba(196,112,48,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${form.service_typen.includes(s) ? 'rgba(196,112,48,0.25)' : 'rgba(255,255,255,0.1)'}`, color: form.service_typen.includes(s) ? '#c47030' : 'rgba(255,255,255,0.6)' }}>{s}</button>)}
            <div className="px-5 py-3 rounded-lg text-[14px] font-semibold opacity-35 cursor-not-allowed" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>Online (bald)</div>
          </div>
          {form.service_typen.includes('Besuchbar') && (
            <div className="mt-2"><label className={lbl}>Adresse (wo bist du besuchbar?) *</label><input type="text" value={form.adresse_besuchbar} onChange={e => set('adresse_besuchbar', e.target.value)} placeholder="Straße, Hausnr., PLZ, Stadt" className={inp} style={{ borderColor: 'rgba(196,112,48,0.2)' }} /></div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div><label className={lbl}>Stadt *</label><input type="text" required value={form.stadt} onChange={e => set('stadt', e.target.value)} placeholder="z.B. Köln" className={inp} style={{ borderColor: 'rgba(255,255,255,0.1)' }} /></div>
            <div><label className={lbl}>Handynummer</label><input type="tel" value={form.handynummer} onChange={e => set('handynummer', e.target.value)} placeholder="+49 ..." className={inp} style={{ borderColor: 'rgba(255,255,255,0.1)' }} /></div>
          </div>

          {/* FOTOS & VIDEOS */}
          <h3 className={secHead} style={{ color: '#c47030', borderTop: '1px solid rgba(196,112,48,0.2)', fontFamily: 'Oswald, sans-serif' }}>Fotos & Videos</h3>
          <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors hover:border-amber-600/30" style={{ borderColor: 'rgba(255,255,255,0.1)' }} onClick={() => fileRef.current?.click()}>
            <input ref={fileRef} type="file" multiple accept="image/*,video/*" onChange={handleFiles} className="hidden" />
            <Upload size={32} className="mx-auto mb-3 text-white/25" />
            <p className="text-[14px] text-white/40">Klicke hier um Fotos & Videos hochzuladen</p>
            <p className="text-[12px] text-white/25 mt-1">Max. 10 Dateien (JPG, PNG, MP4)</p>
          </div>
          {files.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {files.map((f, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden" style={{ width: 80, height: 80, background: '#111' }}>
                  {f.type.startsWith('image/') ? <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-white/30"><ImageIcon size={24} /></div>}
                  <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* EXTRAS */}
          <h3 className={secHead} style={{ color: '#c47030', borderTop: '1px solid rgba(196,112,48,0.2)', fontFamily: 'Oswald, sans-serif' }}>Extras & Zeiten</h3>
          <label className="flex items-start gap-3 p-5 rounded-lg cursor-pointer" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <input type="checkbox" checked={form.zusatzoptionen} onChange={e => set('zusatzoptionen', e.target.checked)} className="mt-1 accent-amber-600 w-5 h-5" />
            <div>
              <span className="text-[15px] text-white/70 font-medium">Ich interessiere mich für Zusatzoptionen.</span>
              <p className="text-[13px] text-white/35 mt-1">Antwort binnen 1–2 Stunden per E-Mail.</p>
            </div>
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => { setShowZeiten(!showZeiten); set('arbeitszeiten_247', false); }} className="flex items-center gap-2 px-5 py-3 rounded-lg text-[14px] font-semibold transition-all"
              style={{ background: showZeiten ? 'rgba(196,112,48,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${showZeiten ? 'rgba(196,112,48,0.25)' : 'rgba(255,255,255,0.1)'}`, color: showZeiten ? '#c47030' : 'rgba(255,255,255,0.6)' }}><Clock size={15} /> Arbeitszeiten</button>
            <button type="button" onClick={() => { set('arbeitszeiten_247', !form.arbeitszeiten_247); setShowZeiten(false); }} className="flex items-center gap-2 px-5 py-3 rounded-lg text-[14px] font-semibold transition-all"
              style={{ background: form.arbeitszeiten_247 ? 'rgba(196,112,48,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${form.arbeitszeiten_247 ? 'rgba(196,112,48,0.25)' : 'rgba(255,255,255,0.1)'}`, color: form.arbeitszeiten_247 ? '#c47030' : 'rgba(255,255,255,0.6)' }}>24/7 verfügbar</button>
          </div>
          {showZeiten && (
            <div className="space-y-2 p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {TAGE.map(tag => (
                <div key={tag} className="flex items-center gap-3"><span className="w-28 text-[14px] text-white/50 shrink-0 font-medium">{tag}</span>
                  <input type="text" placeholder="z.B. 10:00 – 22:00" value={form.arbeitszeiten[tag] || ''} onChange={e => setZeit(tag, e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-transparent border rounded text-[14px] text-white/70 placeholder-white/20 focus:outline-none focus:border-amber-600/30" style={{ borderColor: 'rgba(255,255,255,0.06)' }} /></div>
              ))}
            </div>
          )}

          {/* INSERAT TEXT */}
          <div><label className={lbl}>Individuelles Inserat</label><textarea rows={5} value={form.inserat_text} onChange={e => set('inserat_text', e.target.value)} placeholder="Dein Inseratstext..." className={inp + " resize-none"} style={{ borderColor: 'rgba(255,255,255,0.1)' }} /></div>

          {/* SERVICE DROPDOWNS */}
          <h3 className={secHead} style={{ color: '#c47030', borderTop: '1px solid rgba(196,112,48,0.2)', fontFamily: 'Oswald, sans-serif' }}>Services</h3>
          <Dropdown label={`Service (Wichtig)${form.service_wichtig.length > 0 ? ` – ${form.service_wichtig.length} gewählt` : ''}`} open={svcWichtigOpen} setOpen={setSvcWichtigOpen}>
            <div className="flex flex-wrap gap-2">
              {SERVICE_WICHTIG.map(s => <button key={s} type="button" onClick={() => toggleArr('service_wichtig', s)} className="px-3 py-2 rounded-lg text-[13px] font-semibold transition-all"
                style={{ background: form.service_wichtig.includes(s) ? 'rgba(196,112,48,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${form.service_wichtig.includes(s) ? 'rgba(196,112,48,0.3)' : 'rgba(255,255,255,0.1)'}`, color: form.service_wichtig.includes(s) ? '#c47030' : 'rgba(255,255,255,0.6)' }}>{s}</button>)}
            </div>
          </Dropdown>
          <Dropdown label={`Service (Optional)${form.service_optional.length > 0 ? ` – ${form.service_optional.length} gewählt` : ''}`} open={svcOptionalOpen} setOpen={setSvcOptionalOpen}>
            <div className="flex flex-wrap gap-2">
              {SERVICE_OPTIONAL.map(s => <button key={s} type="button" onClick={() => toggleArr('service_optional', s)} className="px-3 py-2 rounded-lg text-[13px] font-semibold transition-all"
                style={{ background: form.service_optional.includes(s) ? 'rgba(196,112,48,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${form.service_optional.includes(s) ? 'rgba(196,112,48,0.3)' : 'rgba(255,255,255,0.1)'}`, color: form.service_optional.includes(s) ? '#c47030' : 'rgba(255,255,255,0.6)' }}>{s}</button>)}
            </div>
          </Dropdown>

          <button type="submit" disabled={loading} data-testid="ins-submit"
            className="w-full py-4 rounded-lg text-[15px] font-bold tracking-[0.06em] uppercase flex items-center justify-center gap-2 transition-all mt-6"
            style={{ background: loading ? 'rgba(220,20,20,0.1)' : '#dc1414', color: '#fff' }}>
            <Send size={16} /> {loading ? 'Wird gesendet...' : 'Inserat absenden'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
