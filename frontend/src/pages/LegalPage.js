import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';

const LEGAL_CONTENT = {
  impressum: {
    title: 'Impressum',
    seoTitle: 'Impressum – NRWLadies',
    content: (
      <div className="space-y-6 text-sm text-white/70 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-white/90 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>Angaben gemäß § 5 TMG</h2>
          <p>Diese Website wird von einer Privatperson betrieben. Angaben zum Betreiber werden auf Anfrage mitgeteilt.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-white/90 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>Kontakt</h2>
          <p>Bei rechtlichen Anfragen wenden Sie sich bitte per E-Mail an die auf der Website angegebenen Kontaktmöglichkeiten.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-white/90 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>Haftungsausschluss</h2>
          <p>Die Inhalte dieser Seite wurden sorgfältig erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann keine Gewähr übernommen werden.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-white/90 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>Hinweis zum Jugendschutz</h2>
          <p>Diese Website richtet sich ausschließlich an Personen, die das 18. Lebensjahr vollendet haben. Durch den Zugriff auf die Website bestätigst du, dass du mindesens 18 Jahre alt bist.</p>
        </section>
      </div>
    )
  },
  datenschutz: {
    title: 'Datenschutzerklärung',
    seoTitle: 'Datenschutz – NRWLadies',
    content: (
      <div className="space-y-6 text-sm text-white/70 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-white/90 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>Datenschutz auf einen Blick</h2>
          <p>Diese Website erhebt nur die Daten, die zur Bereitstellung der Dienste notwendig sind. Es findet keine Weitergabe an Dritte statt.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-white/90 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>Erhobene Daten</h2>
          <p>Bei der Nutzung dieser Website werden folgende Daten gespeichert: Server-Logs (IP-Adresse, Zeitstempel, aufgerufene Seiten). Bewerbungsformulare werden nur intern verarbeitet.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-white/90 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>Cookies</h2>
          <p>Diese Website verwendet nur technisch notwendige Cookies (z.B. Altersverifikation via localStorage). Es werden keine Tracking-Cookies eingesetzt.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-white/90 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>Ihre Rechte</h2>
          <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer Daten gemaß DSGVO.</p>
        </section>
      </div>
    )
  },
  agb: {
    title: 'Allgemeine Geschäftsbedingungen',
    seoTitle: 'AGB – NRWLadies',
    content: (
      <div className="space-y-6 text-sm text-white/70 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-white/90 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>1. Geltungsbereich</h2>
          <p>Diese AGB gelten für die Nutzung der Website NRWLadies. Mit dem Zugriff auf die Website erklärst du dich mit diesen Bedingungen einverstanden.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-white/90 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>2. Altersverifikation</h2>
          <p>Die Nutzung dieser Website ist ausschließlich Personen ab 18 Jahren gestattet. Durch den Zugriff bestätigst du dein Mindestalter von 18 Jahren.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-white/90 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>3. Nutzungsrecht</h2>
          <p>Die auf dieser Website veröffentlichten Inhalte dienen ausschließlich zur Information. Eine Vervielfältigung oder Weitergabe ohne ausdrückliche Genehmigung ist nicht gestattet.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-white/90 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>4. Haftung</h2>
          <p>Für die Richtigkeit der Profilinformationen kann keine Garantie übernommen werden. Alle Inhalte wurden sorgfältig geprüft.</p>
        </section>
      </div>
    )
  }
};

export default function LegalPage() {
  const location = useLocation();
  const type = location.pathname.replace('/', ''); // impressum, datenschutz, agb
  const content = LEGAL_CONTENT[type] || LEGAL_CONTENT.impressum;

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <SEOHead
        title={content.seoTitle}
        description={`${content.title} von NRWLadies`}
        canonical={`/${type || 'impressum'}`}
        robots="noindex,nofollow"
      />
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={[{ label: content.title }]} />
        <div className="py-6 mb-6 border-b border-white/10">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0' }}>{content.title}</h1>
        </div>
        <div className="pb-16">
          {content.content}
        </div>
      </div>
      <Footer />
    </div>
  );
}
