import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AutomationDemo } from '@/components/motion/AutomationDemo';
import { PageHero, HeroActions } from '@/components/sections/PageHero';
import { Section, SectionHead } from '@/components/sections/Section';
import { Figures } from '@/components/sections/Figures';
import { Checklist } from '@/components/sections/Checklist';
import { LinkCards } from '@/components/sections/LinkCards';
import { SetupWindow } from '@/components/sections/SetupWindow';
import { HomeFaq } from '@/components/sections/HomeFaq';
import { WindowCards } from '@/components/sections/WindowCards';
import { HomeMethod } from '@/components/sections/HomeMethod';
import { HomeClose } from '@/components/sections/HomeClose';
import sections from '@/components/sections/sections.module.css';
import inner from '@/components/sections/inner.module.css';
import { faqsBtp, faqPageJsonLd } from '@/lib/faqData';
import { tools } from '@/lib/tools';
import { getAllArticles } from '@/lib/articles';

const PAGE_URL = 'https://opusadvisor.fr/secteurs/btp/';

// Articles mis en avant sur la page BTP, dans l'ordre d'affichage.
const BTP_ARTICLES = [
  'relances-automatiques-impayes-btp',
  'suivi-retenue-de-garantie',
  'marge-chantier-suivi-reel',
  'temps-administratif-artisans-btp',
  'sous-traitance-btp-paiement-direct',
  'maprimerenov-2026',
  'facturation-electronique-2026',
];
const PAGE_TITLE = 'Logiciel second œuvre : devis, chantiers et relances reliés';
const PAGE_DESCRIPTION =
  'Quel logiciel pour une entreprise du second œuvre ? Batappli, Obat, Tolteck ou EBP : on vérifie si le vôtre suffit, puis on le relie à vos chantiers.';

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
    { '@type': 'ListItem', position: 2, name: 'Secteurs', item: 'https://opusadvisor.fr/secteurs/' },
    { '@type': 'ListItem', position: 3, name: 'BTP second œuvre', item: PAGE_URL },
  ],
};

/** Four figures on the sector, each with its source. */
const STATS = [
  {
    figure: '440 000',
    text: "entreprises dans le bâtiment en France, dont 94 % d'artisans. Chacune gère ses outils dans son coin.",
    source: 'Fédération Française du Bâtiment, 2024',
  },
  {
    figure: '1 sur 3',
    text: 'entreprise du BTP est sous-équipée en numérique, selon une étude menée auprès de 300 entreprises.',
    source: 'Vertuoza, 2024',
  },
  {
    figure: '88 %',
    text: "des entreprises du BTP n'envisagent pas d'utiliser l'IA, contre 77 % tous secteurs confondus.",
    source: 'Baromètre France Num, 2024',
  },
  {
    figure: '1 % par an',
    text: "de gain de productivité dans la construction, contre 3,6 % dans l'industrie manufacturière.",
    source: 'Journal du Net',
  },
];

/** What the visitor may recognise in their week; ticking them changes the message below. */
const PAINS = [
  {
    title: '10-15 h/semaine sur la paperasse',
    desc: "Vous faites vos devis le soir. Les relances le weekend. La compta quand vous pouvez. Votre vrai métier, c'est pas ça.",
  },
  {
    title: 'Impayés qui plombent la trésorerie',
    desc: "1 patron sur 3 subit des retards de paiement. Moyenne d'un impayé BTP : 3 000 €. Quand on oublie de relancer, le cash dort.",
  },
  {
    title: 'Marge chantier jamais claire',
    desc: 'Votre dernier job, rentable ou pas ? Vous sauriez pas dire. Les heures réelles, les achats hors devis, les reprises : tout se perd entre Batappli, Excel et les tickets de caisse dans le camion.',
  },
  {
    title: 'Suivi chantier dans WhatsApp',
    desc: "Les photos, les imprévus, les demandes de devis complémentaires… tout remonte dans des boucles WhatsApp perdues. Un employé part, l'info part avec.",
  },
  {
    title: 'Planning équipes en Excel',
    desc: "Qui est où demain ? Vous, votre conjoint(e) et la cheffe d'équipe avez chacun votre version du planning. Quelqu'un se trompe. C'est le chantier qui en pâtit.",
  },
  {
    title: 'Leads entrants qui fuient',
    desc: 'Un appel raté, un formulaire du site pas traité, un devis demandé jamais envoyé. Chaque lead perdu = 2 à 10 k€ qui partent ailleurs.',
  },
];

// Message selon le nombre de cases cochées (l'index = le nombre de cases).
// Le message à 0 est aussi celui que lisent les visiteurs et les robots sans JavaScript.
const MESSAGES = [
  'Cochez ce que vous vivez : à partir de 3 cases, le pré-audit est fait pour vous.',
  'Ça arrive à toutes les boîtes. On peut en parler au pré-audit.',
  'Ça arrive à toutes les boîtes. On peut en parler au pré-audit.',
  "3 cases ou plus : c'est exactement ce qu'on règle. Le pré-audit est fait pour vous.",
  "3 cases ou plus : c'est exactement ce qu'on règle. Le pré-audit est fait pour vous.",
  'Votre boîte perd des heures chaque semaine. 30 minutes suffisent pour les chiffrer.',
  'Votre boîte perd des heures chaque semaine. 30 minutes suffisent pour les chiffrer.',
];

/** What the visitor already has, and what we make of it. */
const PILLARS = [
  {
    what: 'Votre logiciel de devis et factures',
    tools: 'Batappli, Tolteck, Obat, EBP',
    desc: "On corrige le paramétrage et on s'en sert jusqu'au bout : devis, acomptes, situations. Si vous n'en avez pas encore, on le choisit avec vous.",
  },
  {
    what: "L'application centrale des chantiers",
    tools: 'Airtable, Notion ou un outil développé pour vous, relié à WhatsApp',
    desc: 'Photos, imprévus et SAV arrivent au même endroit. Le bureau voit ce que voit le chef de chantier.',
  },
  {
    what: 'Les liaisons entre vos outils',
    tools: 'Make ou n8n',
    desc: 'Votre logiciel échange avec la banque et la compta. Les relances partent seules, et vous recevez un point chaque semaine.',
  },
];

// Pas encore de client à montrer : on présente des objectifs, jamais des résultats.
const BUILDS = [
  {
    profile: 'Plombier-chauffagiste, 8 à 20 personnes',
    title: "Dossiers MaPrimeRénov' automatisés",
    desc: "Objectif : passer de 6 heures à 90 minutes par dossier. Les pièces sont vérifiées avant l'envoi, ce qui évite les refus.",
  },
  {
    profile: 'Électricien, 8 à 15 personnes',
    title: 'Devis le jour même, relances automatiques',
    desc: 'Objectif : un devis envoyé le jour de la visite, au lieu de 2 à 3 semaines. Les situations oubliées sont relancées toutes seules.',
  },
  {
    profile: 'Multi-technique, 30 à 60+ personnes, plusieurs agences',
    title: 'Marge et trésorerie de toutes les agences',
    desc: 'Objectif : un tableau de bord commun, à jour en continu, et plusieurs jours de travail rendus chaque mois à la personne qui tient les comptes.',
  },
];

/** BTP page: the sector's own hero and sections, in the site's daylight sections, then the close at dusk. */
export default function BtpPage() {
  const articles = BTP_ARTICLES.map((slug) => getAllArticles().find((a) => a.slug === slug)).filter((a) => a !== undefined);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(faqsBtp)) }} />
      <Header />
      <main id="contenu" className="flex-grow">
        <PageHero
          titleId="btp-title"
          back={{ href: '/secteurs/', label: 'Tous les secteurs' }}
          chips={[
            { label: 'Électricité' },
            { label: 'Plomberie' },
            { label: 'Chauffage-clim' },
            { label: 'De 8 à 60+ collaborateurs' },
          ]}
          title="Objectif : rendre 10 heures par semaine aux patrons du second œuvre."
          lede="Le devis part le jour de la visite, et la relance s'envoie toute seule quand le client tarde à payer. On construit le système qu'il vous faut, à partir de vos outils ou de zéro."
          aside={<AutomationDemo keys={['btp']} />}
        >
          <HeroActions secondary={{ href: '/outils', label: 'Les outils gratuits' }} />
          <p className={inner.heroNote}>
            30 minutes en visio, gratuites et sans engagement · Opus Advisor, basé à Vannes, intervient partout en France.
          </p>
        </PageHero>

        <Section id="contexte" tone="ground" labelledBy="context-title">
          <SectionHead id="context-title" title="Le bâtiment a pris du retard sur ses outils." lede="Quatre chiffres, avec leurs sources." />
          <Figures items={STATS} />
        </Section>

        <Section tone="white" labelledBy="pain-title">
          <SectionHead
            id="pain-title"
            title="Votre boîte tourne sur 6 outils qui ne se parlent pas."
            lede={
              <>
                Devis dans Batappli, chantiers dans WhatsApp, factures dans Excel, relances que vous portez seul, photos
                dispersées, SAV oubliés six mois plus tard. <strong className="font-semibold text-[#13213D]">C'est le quotidien de la plupart des boîtes du second œuvre.</strong>
              </>
            }
          />
          <Checklist prompt="Cochez ce que vous vivez en ce moment." items={PAINS} messages={MESSAGES} threshold={3} />
        </Section>

        <SetupWindow
          id="system-title"
          title="Vous gardez votre logiciel, Batappli ou un autre. On le branche sur le reste."
          lede="Chaque boîte a déjà un logiciel de devis, un drive et un groupe WhatsApp. Ce qui manque, c'est un endroit où tout se retrouve, et les liens entre ces outils."
          windowTitle="Votre système"
          items={PILLARS}
          tone="ground"
        />

        <Section tone="white" labelledBy="builds-title">
          <SectionHead
            id="builds-title"
            title="Trois systèmes qu'on sait monter"
            lede="Pas encore de client du bâtiment à vous présenter. Voici trois systèmes typiques, qu'on documentera avec nos premiers clients pilotes."
          />
          <WindowCards items={BUILDS.map((b) => ({ key: b.title, label: b.profile, title: b.title, text: b.desc }))} />
          <p className={inner.headLink}>
            <Link href="/cas-clients#programme-pilote" className={sections.more}>
              Le programme Opus Pilotes
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </Link>
          </p>
        </Section>

        <HomeMethod tone="ground" />

        <HomeFaq items={faqsBtp} tone="white" />

        <Section tone="ground" labelledBy="btp-resources-title">
          <SectionHead
            id="btp-resources-title"
            title="Les outils gratuits pour le bâtiment"
            lede="Les calculs qu'on refait sans arrêt au bureau, avec l'explication de chaque formule. Pas d'inscription."
          />
          <LinkCards three items={tools.map((t) => ({ href: `/outils/${t.slug}/`, title: t.title, text: t.description }))} />

          <h3 className={`${sections.subtitle} ${inner.subhead}`}>À lire pour le second œuvre</h3>
          <LinkCards items={articles.map((a) => ({ href: `/articles/${a.slug}/`, title: a.title, text: a.description }))} />
          <p className={inner.headLink}>
            <Link href="/articles" className={sections.more}>
              Tous les articles
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </Link>
            <Link href="/consultant-rennes" className={sections.more}>
              Nos interventions autour de Rennes
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </Link>
          </p>
        </Section>

        <HomeClose auditStack={false} />
      </main>
      <Footer />
    </div>
  );
}
