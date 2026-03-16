import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité — Shoptazik",
  description:
    "Politique de confidentialité et protection des données personnelles de Shoptazik.",
};

export default function ConfidentialitePage() {
  return (
    <div style={{ background: "#1A1610" }} className="min-h-screen px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-black text-white md:text-4xl">
          Politique de Confidentialit&eacute;
        </h1>
        <p className="mt-3 text-sm text-white/40">
          Derni&egrave;re mise &agrave; jour : 16 mars 2026
        </p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-white/60">
          {/* 1 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              1. Responsable du traitement
            </h2>
            <p>
              Le responsable du traitement des donn&eacute;es personnelles collect&eacute;es
              sur le site shoptazik.com est :
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <span className="text-white/80">Raison sociale :</span> La M.U.G
                (La Maison Urbaine G&eacute;n&eacute;rale)
              </li>
              <li>
                <span className="text-white/80">Forme juridique :</span> Association loi 1901
              </li>
              <li>
                <span className="text-white/80">Contact DPO :</span>{" "}
                <a href="mailto:contact@shoptazik.com" className="underline transition hover:text-white/80">
                  contact@shoptazik.com
                </a>
              </li>
            </ul>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              2. Donn&eacute;es collect&eacute;es
            </h2>
            <p>
              Dans le cadre de votre utilisation du site et de vos commandes, nous
              collectons les donn&eacute;es suivantes :
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <span className="text-white/80">Donn&eacute;es d&apos;identification :</span>{" "}
                nom, pr&eacute;nom, adresse email
              </li>
              <li>
                <span className="text-white/80">Donn&eacute;es de livraison :</span>{" "}
                adresse postale compl&egrave;te
              </li>
              <li>
                <span className="text-white/80">Donn&eacute;es de paiement :</span>{" "}
                trait&eacute;es exclusivement par Stripe (certifi&eacute; PCI-DSS). Aucune
                donn&eacute;e bancaire n&apos;est stock&eacute;e sur nos serveurs.
              </li>
              <li>
                <span className="text-white/80">Donn&eacute;es de navigation :</span>{" "}
                adresse IP, type de navigateur, pages visit&eacute;es (via cookies
                analytiques)
              </li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              3. Finalit&eacute;s du traitement
            </h2>
            <p>Vos donn&eacute;es sont collect&eacute;es pour les finalit&eacute;s suivantes :</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Traitement et suivi de vos commandes</li>
              <li>Livraison des produits physiques et digitaux</li>
              <li>Gestion de la relation client et du service apr&egrave;s-vente</li>
              <li>Am&eacute;lioration de l&apos;exp&eacute;rience utilisateur sur le site</li>
              <li>
                Envoi de communications commerciales (uniquement avec votre consentement)
              </li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              4. Base l&eacute;gale du traitement
            </h2>
            <p>
              Conform&eacute;ment au R&egrave;glement G&eacute;n&eacute;ral sur la Protection
              des Donn&eacute;es (RGPD), le traitement de vos donn&eacute;es repose sur :
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <span className="text-white/80">L&apos;ex&eacute;cution du contrat :</span>{" "}
                traitement de vos commandes et livraison
              </li>
              <li>
                <span className="text-white/80">Le consentement :</span> cookies analytiques
                et communications commerciales
              </li>
              <li>
                <span className="text-white/80">L&apos;int&eacute;r&ecirc;t l&eacute;gitime :</span>{" "}
                am&eacute;lioration du site et s&eacute;curit&eacute;
              </li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              5. Cookies
            </h2>
            <p>
              Le site shoptazik.com utilise des cookies strictement n&eacute;cessaires au
              fonctionnement du site (panier, session) et des cookies analytiques pour
              mesurer la fr&eacute;quentation du site.
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <span className="text-white/80">Cookies essentiels :</span> panier
                d&apos;achat, session utilisateur &mdash; n&eacute;cessaires, non
                d&eacute;sactivables
              </li>
              <li>
                <span className="text-white/80">Cookies analytiques :</span> mesure
                d&apos;audience anonymis&eacute;e &mdash; d&eacute;sactivables via le
                bandeau cookies
              </li>
            </ul>
            <p className="mt-3">
              Aucun cookie publicitaire ou de suivi tiers n&apos;est utilis&eacute;.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              6. Dur&eacute;e de conservation
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <span className="text-white/80">Donn&eacute;es de commande :</span>{" "}
                5 ans (obligation l&eacute;gale comptable)
              </li>
              <li>
                <span className="text-white/80">Donn&eacute;es de compte :</span>{" "}
                3 ans apr&egrave;s la derni&egrave;re activit&eacute;
              </li>
              <li>
                <span className="text-white/80">Cookies analytiques :</span> 13 mois maximum
              </li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              7. Partage des donn&eacute;es
            </h2>
            <p>
              Vos donn&eacute;es peuvent &ecirc;tre partag&eacute;es avec les prestataires
              suivants, dans le cadre strict de l&apos;ex&eacute;cution de nos services :
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <span className="text-white/80">Stripe</span> (San Francisco, USA) &mdash;
                traitement des paiements, certifi&eacute; PCI-DSS
              </li>
              <li>
                <span className="text-white/80">Vercel Inc.</span> (San Francisco, USA) &mdash;
                h&eacute;bergement du site web
              </li>
              <li>
                <span className="text-white/80">Supabase</span> (Singapour) &mdash;
                base de donn&eacute;es s&eacute;curis&eacute;e
              </li>
              <li>
                <span className="text-white/80">La Poste / Colissimo</span> &mdash;
                livraison des colis
              </li>
            </ul>
            <p className="mt-3">
              Aucune donn&eacute;e personnelle n&apos;est vendue &agrave; des tiers.
              Les transferts hors UE sont encadr&eacute;s par des clauses contractuelles
              types ou le Data Privacy Framework.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              8. Vos droits (RGPD)
            </h2>
            <p>
              Conform&eacute;ment au RGPD et &agrave; la loi Informatique et Libert&eacute;s,
              vous disposez des droits suivants sur vos donn&eacute;es personnelles :
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <span className="text-white/80">Droit d&apos;acc&egrave;s :</span> obtenir une
                copie de vos donn&eacute;es personnelles
              </li>
              <li>
                <span className="text-white/80">Droit de rectification :</span> corriger des
                donn&eacute;es inexactes ou incompl&egrave;tes
              </li>
              <li>
                <span className="text-white/80">Droit de suppression :</span> demander
                l&apos;effacement de vos donn&eacute;es
              </li>
              <li>
                <span className="text-white/80">Droit &agrave; la portabilit&eacute; :</span>{" "}
                recevoir vos donn&eacute;es dans un format structur&eacute; et lisible
              </li>
              <li>
                <span className="text-white/80">Droit d&apos;opposition :</span> vous opposer
                au traitement de vos donn&eacute;es
              </li>
              <li>
                <span className="text-white/80">Droit &agrave; la limitation :</span> demander
                la limitation du traitement
              </li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, contactez notre D&eacute;l&eacute;gu&eacute; &agrave;
              la Protection des Donn&eacute;es :{" "}
              <a href="mailto:contact@shoptazik.com" className="underline transition hover:text-white/80">
                contact@shoptazik.com
              </a>
            </p>
            <p className="mt-2">
              Nous nous engageons &agrave; r&eacute;pondre &agrave; votre demande dans un
              d&eacute;lai de 30 jours.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              9. S&eacute;curit&eacute; des donn&eacute;es
            </h2>
            <p>
              Nous mettons en place des mesures techniques et organisationnelles
              appropri&eacute;es pour prot&eacute;ger vos donn&eacute;es personnelles contre
              tout acc&egrave;s non autoris&eacute;, perte, destruction ou alt&eacute;ration.
              Les communications entre votre navigateur et notre site sont chiffr&eacute;es
              via HTTPS/TLS.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              10. R&eacute;clamation
            </h2>
            <p>
              Si vous estimez que le traitement de vos donn&eacute;es n&apos;est pas conforme
              &agrave; la r&eacute;glementation, vous pouvez introduire une r&eacute;clamation
              aupr&egrave;s de la{" "}
              <span className="text-white/80">
                Commission Nationale de l&apos;Informatique et des Libert&eacute;s (CNIL)
              </span>{" "}
              : <span className="text-white/80">www.cnil.fr</span>
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-white">
              11. Contact
            </h2>
            <p>
              Pour toute question relative &agrave; cette politique de
              confidentialit&eacute;, contactez-nous &agrave; :{" "}
              <a href="mailto:contact@shoptazik.com" className="underline transition hover:text-white/80">
                contact@shoptazik.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
