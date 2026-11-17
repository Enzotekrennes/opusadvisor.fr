import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/sections/PageHero';
import inner from '@/components/sections/inner.module.css';

const PAGE_URL = 'https://opusadvisor.fr/projets';
const PAGE_TITLE = 'Cas clients — Opus Advisor';
const PAGE_DESCRIPTION =
  "Cette page a été déplacée vers /cas-clients.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: 'https://opusadvisor.fr/cas-clients' },
  robots: { index: false, follow: true },
  other: {
    refresh: '0; url=/cas-clients',
  },
};

/** Old address of the client cases: the browser moves on to /cas-clients at once, this page is the fallback. */
export default function ProjetsRedirectPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main id="contenu" className="flex-grow">
        <PageHero titleId="moved-title" title="Cette page a déménagé." lede="Les cas clients sont désormais ici :">
          <div className={inner.heroActions}>
            <Link href="/cas-clients" className={inner.lightButton}>
              Voir les cas clients
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </PageHero>
      </main>
      <Footer />
    </div>
  );
}
