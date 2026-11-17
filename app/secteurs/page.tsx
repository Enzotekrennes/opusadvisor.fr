import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/sections/PageHero';
import { HomeSectors } from '@/components/sections/HomeSectors';
import { HomeCases } from '@/components/sections/HomeCases';
import { HomeClose } from '@/components/sections/HomeClose';

const PAGE_URL = 'https://opusadvisor.fr/secteurs/';
const PAGE_TITLE = 'Nos secteurs : formation, immobilier et BTP';
const PAGE_DESCRIPTION =
  "Organismes de formation, conciergeries et agences immobilières, entreprises du BTP second œuvre : ce qu'on automatise dans chaque secteur, avec des exemples réels.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION, url: PAGE_URL, type: 'website', images: [{ url: 'https://opusadvisor.fr/images/Logo_1200x630.png' }] },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://opusadvisor.fr/' },
    { '@type': 'ListItem', position: 2, name: 'Secteurs', item: PAGE_URL },
  ],
};

export default function SecteursPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Header />
      <main id="contenu" className="flex-grow">
        <PageHero
          titleId="sectors-title"
          title="Les entreprises avec qui on travaille"
          lede="Des petites entreprises et des PME, avec du travail sur le terrain et beaucoup d’administratif derrière. Les problèmes se ressemblent d’un secteur à l’autre ; les outils et le vocabulaire changent."
        />
        <HomeSectors withHead={false} tone="ground" />
        <HomeCases title="Des missions réelles" tone="white" />
        <HomeClose />
      </main>
      <Footer />
    </div>
  );
}
