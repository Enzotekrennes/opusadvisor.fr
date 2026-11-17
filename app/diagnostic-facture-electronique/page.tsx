import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/sections/PageHero';
import { HomeFaq } from '@/components/sections/HomeFaq';
import { EInvoiceDiagnostic } from '@/components/diagnostic/EInvoiceDiagnostic';
import { faqPageJsonLd } from '@/lib/faqData';
import { FAQ as FAQ_RAW, typo } from '@/lib/einvoice/rules';

const FAQ = FAQ_RAW.map((f) => ({ question: typo(f.question), answer: typo(f.answer) }));

const PAGE_URL = 'https://opusadvisor.fr/diagnostic-facture-electronique/';
const PAGE_TITLE = 'Facture électronique obligatoire : êtes-vous prêt ? Diagnostic gratuit';
const PAGE_DESCRIPTION =
  'Réception, émission, e-reporting : en 7 questions, sachez où en est votre entreprise face à la facture électronique et quelles dates vous concernent.';

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: 'website',
    images: [{ url: 'https://opusadvisor.fr/images/Logo_1200x630.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ['https://opusadvisor.fr/images/Logo_1200x630.png'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://opusadvisor.fr/' },
    { '@type': 'ListItem', position: 2, name: 'Diagnostic facture électronique', item: PAGE_URL },
  ],
};

export default function DiagnosticFactureElectroniquePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(FAQ)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Header />
      <main id="contenu" className="flex-grow">
        <PageHero
          titleId="diagnostic-title"
          chips={[{ label: 'Diagnostic gratuit', icon: 'booking' }]}
          title={'Facture électronique\u00a0: où en êtes-vous\u00a0?'}
        />
        <EInvoiceDiagnostic />
        <HomeFaq items={FAQ} title="Questions fréquentes" tone="white" />
      </main>
      <Footer />
    </div>
  );
}
