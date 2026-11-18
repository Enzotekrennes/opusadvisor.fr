import type { Metadata } from 'next';
import { ToolPage, ToolH2, ToolP, Formula, ToolLink, ToolTable } from '@/components/pages/ToolPage';
import { RetentionCalculator } from '@/components/pages/calc/RetentionCalculator';

const PAGE_URL = 'https://opusadvisor.fr/outils/calcul-retenue-de-garantie/';
const PAGE_TITLE = 'Calcul de la retenue de garantie : HT ou TTC ?';
const PAGE_DESCRIPTION =
  "Retenue de garantie sur le HT ou le TTC : c'est le marché qui fixe la base. Calculez les 5 %, le net versé et la date de libération.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION, url: PAGE_URL, type: 'website', images: [{ url: 'https://opusadvisor.fr/images/Logo_1200x630.png' }] },
};

export default function RetentionPage() {
  return (
    <ToolPage
      url={PAGE_URL}
      breadcrumbName="Calcul de la retenue de garantie"
      title="Calcul de la retenue de garantie"
      intro="Le montant retenu, ce qui vous est versé tout de suite, et la date à laquelle vous récupérez la retenue."
      calculator={<RetentionCalculator />}
      ctaTitle="Combien de retenues de garantie dorment dans vos comptes ?"
      ctaText="Une retenue oubliée, c'est jusqu'à 5 % d'un chantier que personne ne réclame. On les recense et on programme leur relance à la bonne date. On en parle pendant le pré-audit : 30 minutes en visio, gratuites."
    >
      <ToolH2>À quoi sert la retenue de garantie</ToolH2>
      <ToolP>
        Sur un marché de travaux privé, le client peut retenir jusqu'à 5 % de chaque paiement (loi n° 71-584 du 16 juillet
        1971). Cette somme sert à couvrir les réserves émises à la réception des travaux.
      </ToolP>
      <Formula>retenue = montant des travaux × taux (5 % au maximum)</Formula>

      <ToolH2>Retenue de garantie : HT ou TTC ?</ToolH2>
      <ToolP>
        La loi ne le précise pas : celle du 16 juillet 1971 parle d'une retenue de 5 % au plus du « montant » des acomptes,
        sans dire HT ou TTC. C'est votre marché qui fixe la base. En pratique, le TTC est le plus courant, parce que c'est
        le montant réellement payé. Le plus sûr est de l'écrire noir sur blanc dans le contrat.
      </ToolP>
      <ToolTable
        head={['Marché de 48 000 € HT, TVA 10 %', 'Base TTC', 'Base HT']}
        rows={[
          ['Montant de référence', '52 800 €', '48 000 €'],
          ['Retenue de 5 %', '2 640 €', '2 400 €'],
          ['Versé tout de suite', '50 160 €', '50 400 €'],
        ]}
      />

      <ToolH2>5 % de retenue sur une facture : l'exemple</ToolH2>
      <ToolP>
        Une situation de 9 600 € HT avec une TVA à 10 % fait 10 560 € TTC. Une retenue de 5 % sur le TTC représente 528 €,
        et le client vous verse 10 032 €. Sur la facture, la retenue s'écrit sur une ligne à part, après le total TTC :
      </ToolP>
      <ToolTable
        head={['Facture de situation n° 2', 'Montant']}
        rows={[
          ['Total TTC', '10 560 €'],
          ['Retenue de garantie 5 %', '− 528 €'],
          ['Net à payer', '10 032 €'],
        ]}
      />
      <ToolP>
        5 % est un plafond : le marché peut prévoir un taux plus bas, ou pas de retenue du tout. La retenue doit être
        prévue au contrat, la loi parle d'une retenue « stipulée contractuellement ».
      </ToolP>

      <ToolH2>Consignation ou caution bancaire</ToolH2>
      <ToolP>
        Le client doit consigner la somme retenue auprès d'un consignataire accepté par les deux parties. Vous pouvez aussi
        lui proposer une caution d'un établissement financier pour le même montant : dans ce cas, il ne retient rien sur vos
        paiements.
      </ToolP>

      <ToolH2>Quand la récupérer</ToolH2>
      <ToolP>
        Un an après la réception des travaux, même sans accord écrit du client, sauf s'il a notifié une opposition motivée
        par lettre recommandée. Notez la date dès la réception :{' '}
        <ToolLink href="/articles/suivi-retenue-de-garantie/">une retenue que personne ne réclame</ToolLink> finit souvent
        par être oubliée.
      </ToolP>

      <ToolH2>Et sur les marchés publics ?</ToolH2>
      <ToolP>
        Ils suivent le Code de la commande publique : la retenue ne peut dépasser 5 % du montant initial du marché,
        augmenté des modifications en cours d'exécution (article R2191-33). Le plafond descend à 3 % quand vous êtes une
        PME et que le marché est passé par l'État, par un établissement public administratif de l'État, ou par une
        collectivité ou un groupement dont les dépenses de fonctionnement dépassent 60 millions d'euros. La retenue vous
        est remboursée dans les trente jours qui suivent la fin du délai de garantie (article R2191-35). Pour calculer la
        retenue sur une situation de travaux, utilisez notre{' '}
        <ToolLink href="/outils/calcul-situation-de-travaux/">calculateur de facture de situation</ToolLink>.
      </ToolP>
    </ToolPage>
  );
}
