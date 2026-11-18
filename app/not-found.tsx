import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/sections/PageHero';
import inner from '@/components/sections/inner.module.css';

export const metadata: Metadata = {
  title: 'Page introuvable',
  robots: { index: false, follow: true },
};

/** Page shown for an unknown address: the dawn town of the home page and the way back to it. */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main id="contenu" className="flex-grow">
        <PageHero
          titleId="not-found-title"
          chips={[{ label: 'Erreur 404' }]}
          title="Page introuvable"
          lede="La page que vous recherchez n'existe pas ou a été déplacée."
        >
          <div className={inner.heroActions}>
            <Link href="/" className={inner.lightButton}>
              Retour à l'accueil
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </PageHero>
      </main>
      <Footer />
    </div>
  );
}
