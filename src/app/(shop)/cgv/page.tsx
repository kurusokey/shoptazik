import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente — La Mug - Boutik'",
  description:
    "Conditions Générales de Vente de La Mug - Boutik', la boutique en ligne de La M.U.G.",
};

export default function CGVPage() {
  return (
    <div style={{ background: "#1A1610" }} className="min-h-screen px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-black text-white md:text-4xl">
          Conditions G&eacute;n&eacute;rales de Vente
        </h1>
        <p className="mt-3 text-sm text-white/40">
          Derni&egrave;re mise &agrave; jour : 16 mars 2026
        </p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-white/60">
          {/* 1 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              1. Objet
            </h2>
            <p>
              Les pr&eacute;sentes Conditions G&eacute;n&eacute;rales de Vente (CGV) r&eacute;gissent
              l&apos;ensemble des ventes effectu&eacute;es sur le site{" "}
              <span className="text-white/80">boutique.la-mug.com</span>, op&eacute;r&eacute; par
              La&nbsp;M.U.G (La Maison Urbaine G&eacute;n&eacute;rale). Toute commande implique
              l&apos;acceptation pleine et enti&egrave;re des pr&eacute;sentes CGV.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              2. Vendeur
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <span className="text-white/80">Raison sociale :</span> La M.U.G
                (La Maison Urbaine G&eacute;n&eacute;rale)
              </li>
              <li>
                <span className="text-white/80">Forme juridique :</span> Association loi 1901
              </li>
              <li>
                <span className="text-white/80">Email :</span>{" "}
                <a href="mailto:contact@la-mug.com" className="underline transition hover:text-white/80">
                  contact@la-mug.com
                </a>
              </li>
              <li>
                <span className="text-white/80">Site web :</span> boutique.la-mug.com
              </li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              3. Produits
            </h2>
            <p>
              La Mug - Boutik&apos; propose &agrave; la vente des produits li&eacute;s &agrave; la musique
              et &agrave; la culture hip-hop, notamment :
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Vinyles et &eacute;ditions limit&eacute;es</li>
              <li>CD audio</li>
              <li>T&eacute;l&eacute;chargements digitaux (albums et titres individuels)</li>
              <li>Merchandising (t-shirts, accessoires)</li>
            </ul>
            <p className="mt-3">
              Les produits sont d&eacute;crits et pr&eacute;sent&eacute;s avec la plus grande
              exactitude possible. Toutefois, des variations mineures (couleurs, dimensions)
              ne sauraient engager la responsabilit&eacute; du vendeur.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              4. Prix
            </h2>
            <p>
              Les prix sont indiqu&eacute;s en euros (EUR), toutes taxes comprises (TTC).
              Les frais de livraison sont affich&eacute;s avant la validation de la commande.
              La Mug - Boutik&apos; se r&eacute;serve le droit de modifier ses prix &agrave; tout moment,
              mais les produits sont factur&eacute;s sur la base du tarif en vigueur au moment
              de la validation de la commande.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              5. Commande
            </h2>
            <p>
              Le processus de commande comprend les &eacute;tapes suivantes :
            </p>
            <ol className="mt-2 list-inside list-decimal space-y-1">
              <li>S&eacute;lection des produits et ajout au panier</li>
              <li>V&eacute;rification du contenu du panier</li>
              <li>Saisie des informations de livraison</li>
              <li>Choix du mode de paiement et validation</li>
              <li>Confirmation de la commande par email</li>
            </ol>
            <p className="mt-3">
              La commande est consid&eacute;r&eacute;e comme d&eacute;finitive apr&egrave;s
              r&eacute;ception du paiement int&eacute;gral.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              6. Paiement
            </h2>
            <p>
              Le paiement est s&eacute;curis&eacute; par{" "}
              <span className="text-white/80">Stripe</span>, prestataire certifi&eacute;
              PCI-DSS. Les moyens de paiement accept&eacute;s sont :
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Carte bancaire (Visa, Mastercard, American Express)</li>
              <li>Apple Pay / Google Pay</li>
            </ul>
            <p className="mt-3">
              Aucune donn&eacute;e bancaire n&apos;est stock&eacute;e sur nos serveurs.
              L&apos;ensemble des transactions est trait&eacute; directement par Stripe.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              7. Livraison
            </h2>
            <p>
              Les livraisons sont effectu&eacute;es en{" "}
              <span className="text-white/80">France m&eacute;tropolitaine et DOM-TOM</span>.
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <span className="text-white/80">D&eacute;lai de livraison :</span> 3 &agrave;
                7 jours ouvr&eacute;s apr&egrave;s exp&eacute;dition
              </li>
              <li>
                <span className="text-white/80">D&eacute;lai d&apos;exp&eacute;dition :</span>{" "}
                1 &agrave; 3 jours ouvr&eacute;s apr&egrave;s confirmation du paiement
              </li>
              <li>
                <span className="text-white/80">Transporteurs :</span> La Poste / Colissimo
              </li>
            </ul>
            <p className="mt-3">
              Les produits digitaux (t&eacute;l&eacute;chargements) sont livr&eacute;s
              imm&eacute;diatement apr&egrave;s confirmation du paiement, par lien de
              t&eacute;l&eacute;chargement envoy&eacute; par email.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              8. Droit de r&eacute;tractation
            </h2>
            <p>
              Conform&eacute;ment &agrave; l&apos;article L221-18 du Code de la consommation,
              l&apos;acheteur dispose d&apos;un d&eacute;lai de{" "}
              <span className="text-white/80">14 jours</span> &agrave; compter de la
              r&eacute;ception du produit pour exercer son droit de r&eacute;tractation, sans
              avoir &agrave; justifier de motifs ni &agrave; payer de p&eacute;nalit&eacute;s.
            </p>
            <p className="mt-3">
              <span className="text-white/80">Exceptions :</span> Conform&eacute;ment &agrave;
              l&apos;article L221-28 du Code de la consommation, le droit de r&eacute;tractation
              ne s&apos;applique pas aux :
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                Contenus num&eacute;riques t&eacute;l&eacute;charg&eacute;s (albums, titres
                individuels) d&egrave;s lors que le t&eacute;l&eacute;chargement a
                commenc&eacute;
              </li>
              <li>
                CD ou vinyles descell&eacute;s apr&egrave;s la livraison
              </li>
            </ul>
            <p className="mt-3">
              Pour exercer ce droit, contactez-nous &agrave;{" "}
              <a href="mailto:contact@la-mug.com" className="underline transition hover:text-white/80">
                contact@la-mug.com
              </a>{" "}
              en indiquant votre num&eacute;ro de commande. Les frais de retour sont &agrave;
              la charge de l&apos;acheteur.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              9. Remboursement
            </h2>
            <p>
              En cas de r&eacute;tractation accept&eacute;e, le remboursement sera
              effectu&eacute; dans un d&eacute;lai de{" "}
              <span className="text-white/80">14 jours</span> suivant la r&eacute;ception du
              produit retourn&eacute;, via le m&ecirc;me moyen de paiement que celui
              utilis&eacute; pour la commande.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              10. Garantie et r&eacute;clamations
            </h2>
            <p>
              Les produits b&eacute;n&eacute;ficient de la garantie l&eacute;gale de
              conformit&eacute; (articles L217-4 et suivants du Code de la consommation) et de
              la garantie contre les vices cach&eacute;s (articles 1641 et suivants du Code
              civil). En cas de produit d&eacute;fectueux ou non conforme, contactez-nous dans
              les plus brefs d&eacute;lais.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              11. Propri&eacute;t&eacute; intellectuelle
            </h2>
            <p>
              L&apos;ensemble des contenus pr&eacute;sents sur le site (textes, images, logos,
              musiques, illustrations) sont prot&eacute;g&eacute;s par le droit d&apos;auteur
              et le droit de la propri&eacute;t&eacute; intellectuelle. Toute reproduction,
              m&ecirc;me partielle, est interdite sans autorisation pr&eacute;alable.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              12. Responsabilit&eacute;
            </h2>
            <p>
              La Mug - Boutik&apos; ne saurait &ecirc;tre tenu responsable des dommages r&eacute;sultant
              d&apos;une mauvaise utilisation des produits achet&eacute;s. La responsabilit&eacute;
              du vendeur est limit&eacute;e au montant de la commande en cas de litige.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              13. Droit applicable et litiges
            </h2>
            <p>
              Les pr&eacute;sentes CGV sont soumises au droit fran&ccedil;ais. En cas de
              litige, une solution amiable sera recherch&eacute;e avant toute action judiciaire.
              &Agrave; d&eacute;faut, les tribunaux comp&eacute;tents seront ceux du ressort du
              si&egrave;ge social du vendeur.
            </p>
            <p className="mt-3">
              Conform&eacute;ment &agrave; l&apos;article L612-1 du Code de la consommation,
              le consommateur peut recourir gratuitement &agrave; un m&eacute;diateur de la
              consommation en vue de la r&eacute;solution amiable du litige.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              14. Contact
            </h2>
            <p>
              Pour toute question relative aux pr&eacute;sentes CGV ou &agrave; votre
              commande, vous pouvez nous contacter &agrave; :{" "}
              <a href="mailto:contact@la-mug.com" className="underline transition hover:text-white/80">
                contact@la-mug.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
