import type { Metadata } from 'next';
import { ToolPage, ToolH2, ToolP, Formula, ToolLink, ToolTable } from '@/components/pages/ToolPage';
import { SituationCalculator } from '@/components/pages/calc/SituationCalculator';

const PAGE_URL = 'https://opusadvisor.fr/outils/calcul-situation-de-travaux/';
const PAGE_TITLE = 'Facture de situation de travaux : calcul, exemple et mentions';
const PAGE_DESCRIPTION =
  "Calculez une facture de situation de travaux à partir de l'avancement cumulé : HT, TVA, retenue de garantie, net à payer. Exemple poste par poste et mentions obligatoires.";
const MENTIONS_URL = 'https://entreprendre.service-public.fr/vosdroits/F31808';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION, url: PAGE_URL, type: 'website', images: [{ url: 'https://opusadvisor.fr/images/Logo_1200x630.png' }] },
};

export default function SituationPage() {
  return (
    <ToolPage
      url={PAGE_URL}
      breadcrumbName="Calcul d'une facture de situation"
      title="Calcul d'une facture de situation de travaux"
      intro="Indiquez l'avancement du chantier et ce que vous avez déjà facturé : vous obtenez le montant de la situation, la TVA, la retenue de garantie et le net à payer."
      calculator={<SituationCalculator />}
      ctaTitle="Vos situations partent-elles à temps ?"
      ctaText="Une situation envoyée avec dix jours de retard, c'est dix jours de trésorerie en moins. On relie le suivi de vos chantiers à votre facturation pour qu'elles partent à date. On en parle pendant le pré-audit : 30 minutes, gratuites."
    >
      <ToolH2>Situation de travaux, situation de chantier, facture d'avancement</ToolH2>
      <ToolP>
        Les trois expressions désignent la même facture. Sur un chantier qui dure, elle fait payer au client la part des
        travaux déjà réalisée, en général chaque mois. Elle se distingue de l'acompte, versé avant que les travaux avancent,
        et de la facture de solde, qui arrête les comptes en fin de chantier.
      </ToolP>

      <ToolH2>Le principe</ToolH2>
      <ToolP>
        Une situation facture l'avancement réel du chantier, en cumulé : on calcule ce qui a été réalisé depuis le début,
        puis on retire ce qui a déjà été facturé.
      </ToolP>
      <Formula>situation HT = montant du marché HT × avancement cumulé − situations déjà facturées HT</Formula>

      <ToolH2>Exemple chiffré</ToolH2>
      <ToolP>
        Un marché de 48 000 € HT, TVA à 10 %, avec une retenue de garantie de 5 % calculée sur le TTC :
      </ToolP>
      <ToolTable
        head={['', 'Avancement', 'Situation HT', 'TTC', 'Retenue', 'Net à payer']}
        rows={[
          ['Situation 1', '40 %', '19 200 €', '21 120 €', '1 056 €', '20 064 €'],
          ['Situation 2', '60 %', '9 600 €', '10 560 €', '528 €', '10 032 €'],
          ['Situation 3', '100 %', '19 200 €', '21 120 €', '1 056 €', '20 064 €'],
        ]}
      />
      <ToolP>
        Au total, 2 640 € sont retenus, soit 5 % des 52 800 € TTC du marché. Vous les récupérez un an après la réception :
        notre <ToolLink href="/outils/calcul-retenue-de-garantie/">calculateur de retenue de garantie</ToolLink> donne la
        date.
      </ToolP>

      <ToolH2>Le détail poste par poste</ToolH2>
      <ToolP>
        Sur la facture, l'avancement se justifie poste par poste, avec les mêmes lignes que le devis ou la DPGF. Voici la
        situation 2 de l'exemple, sur un lot électricité :
      </ToolP>
      <ToolTable
        head={['Poste', 'Marché HT', 'Avancement', 'Cumul HT']}
        rows={[
          ['Tableau et protections', '6 000 €', '100 %', '6 000 €'],
          ['Câblage et appareillage', '30 000 €', '60 %', '18 000 €'],
          ['Éclairage', '12 000 €', '40 %', '4 800 €'],
          ['Total', '48 000 €', '60 %', '28 800 €'],
        ]}
      />
      <ToolP>
        On retire les 19 200 € HT de la situation 1 : la situation 2 vaut 9 600 € HT, comme dans le tableau plus haut. Un
        client qui voit l'avancement de chaque poste conteste moins qu'un pourcentage global.
      </ToolP>

      <ToolH2>Ce que doit contenir une facture de situation</ToolH2>
      <ToolP>
        C'est une facture à part entière, avec toutes les mentions obligatoires : numéro et date, identité et Siren de votre
        entreprise, identité du client, désignation des travaux, montants HT, taux et montant de TVA, date de paiement, taux
        des pénalités de retard et, pour un client professionnel, l'indemnité forfaitaire de 40 € pour frais de
        recouvrement. La liste complète est sur la{' '}
        <ToolLink href={MENTIONS_URL}>fiche officielle de Service Public</ToolLink>.
      </ToolP>
      <ToolP>
        Pour qu'elle soit payée sans discussion, ajoutez le numéro de la situation et la période couverte, la référence du
        marché ou du devis, l'avancement cumulé de chaque poste, le total déjà facturé, la retenue de garantie et, si le prix
        est révisable, la révision avec l'index utilisé. Notre page sur l'
        <ToolLink href="/outils/indice-bt01/">indice BT01</ToolLink> calcule cette révision.
      </ToolP>

      <ToolH2>Quel taux de TVA ?</ToolH2>
      <ToolP>
        Il dépend des travaux et du bâtiment : 20 % dans le cas général, 10 % pour l'amélioration ou l'entretien d'un
        logement achevé depuis plus de deux ans, 5,5 % pour la rénovation énergétique de ces logements.
      </ToolP>

      <ToolH2>En sous-traitance</ToolH2>
      <ToolP>
        La situation se facture hors taxes avec la mention « Autoliquidation » : c'est l'entreprise principale qui déclare la
        TVA. Les règles et le paiement direct sont détaillés dans notre article sur la{' '}
        <ToolLink href="/articles/sous-traitance-btp-paiement-direct/">sous-traitance dans le BTP</ToolLink>.
      </ToolP>

      <ToolH2>Avec la facturation électronique</ToolH2>
      <ToolP>
        Une situation est une facture à part entière. À partir du 1er septembre 2027, les PME devront donc l'émettre au
        format électronique, comme leurs autres factures entre entreprises, avec quatre nouvelles mentions : le Siren du
        client, l'adresse de livraison des biens si elle diffère de la sienne, la nature des opérations (biens, services ou les deux)
        et, le cas échéant, l'option pour le paiement de la TVA d'après les débits. Les grandes entreprises et les ETI les
        portent depuis le 1er septembre 2026. Notre point sur la{' '}
        <ToolLink href="/articles/facturation-electronique-2026/">facturation électronique</ToolLink> explique comment s'y
        préparer, et le <ToolLink href="/diagnostic-facture-electronique/">diagnostic gratuit</ToolLink> vous dit en 2 minutes où en est votre
        entreprise.
      </ToolP>

      <ToolH2>Validation et paiement</ToolH2>
      <ToolP>
        Quand le marché prévoit un maître d'œuvre, la situation lui est en général adressée d'abord : il vérifie
        l'avancement avant que le client paie. Le contrat fixe ce circuit et ses délais. Faites constater l'avancement sur
        place, photos à l'appui, avant d'émettre la facture. En cas de retard de paiement, notre{' '}
        <ToolLink href="/outils/calcul-penalites-de-retard/">calculateur de pénalités de retard</ToolLink> donne le
        montant dû.
      </ToolP>

      <ToolH2>Les erreurs qui retardent le paiement</ToolH2>
      <ToolP>
        Oublier de déduire les situations précédentes, appliquer deux fois la retenue de garantie, ou envoyer une situation
        sans référence au marché ni au devis : chacune de ces erreurs donne au client une bonne raison d'attendre.
      </ToolP>
    </ToolPage>
  );
}
