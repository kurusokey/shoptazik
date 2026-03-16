import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos — Shoptazik",
  description:
    "Shoptazik, la boutique du rap francophone. Créée par La M.U.G et Fdy Phenomen.",
};

export default function AProposPage() {
  return (
    <div style={{ background: "#1A1610" }} className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20 md:py-32">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(200,160,80,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "#C8A050" }}
          >
            &Agrave; propos
          </p>
          <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">
            Bienvenue chez{" "}
            <span style={{ color: "#C8A050" }}>Shoptazik</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/50">
            Plus qu&apos;une boutique, un univers musical et artistique.
            Le rap francophone a sa maison.
          </p>
        </div>
      </section>

      {/* La boutique */}
      <section className="relative px-4 py-16">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, #1A1610, #201A14)" }}
        />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white">
            La boutique du rap francophone
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/60">
            <p>
              Shoptazik est n&eacute;e d&apos;une vision simple : offrir aux amateurs de rap
              fran&ccedil;ais un espace d&eacute;di&eacute; o&ugrave; la musique se touche, se
              collectionne et se vit. Vinyles, CD, t&eacute;l&eacute;chargements digitaux,
              merchandising &mdash; chaque produit raconte une histoire, celle d&apos;artistes
              qui portent la culture hip-hop depuis des d&eacute;cennies.
            </p>
            <p>
              Ici, pas d&apos;algorithmes froids ni de playlists jetables. Chaque album est
              pr&eacute;sent&eacute; comme une &oelig;uvre, chaque vinyle comme un objet
              pr&eacute;cieux. Shoptazik, c&apos;est le disquaire en ligne pour ceux qui
              savent que le rap, &ccedil;a s&apos;&eacute;coute mais &ccedil;a se poss&egrave;de
              aussi.
            </p>
          </div>
        </div>
      </section>

      {/* La M.U.G */}
      <section className="relative px-4 py-16">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, #201A14, #1A1610)" }}
        />
        <div className="relative mx-auto max-w-3xl">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "#C8A050" }}
          >
            L&apos;association
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white">
            La M.U.G &mdash; La Maison Urbaine G&eacute;n&eacute;rale
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/60">
            <p>
              Fond&eacute;e en 2021 par{" "}
              <span className="text-white/80">Fdy Phenomen</span>, La M.U.G (La Maison
              Urbaine G&eacute;n&eacute;rale) est une association loi 1901 bas&eacute;e en
              &Icirc;le-de-France. Sa mission : promouvoir la culture urbaine &agrave; travers
              des programmes p&eacute;dagogiques, culturels et sportifs.
            </p>
            <p>
              &Eacute;criture, musique, arts visuels, sports urbains &mdash; La M.U.G
              intervient aupr&egrave;s des jeunes et des adultes pour transmettre les valeurs
              du hip-hop : cr&eacute;ativit&eacute;, pers&eacute;v&eacute;rance,
              expression de soi. L&apos;association organise des ateliers, des
              &eacute;v&eacute;nements et des rencontres en &Icirc;le-de-France.
            </p>
            <p>
              Shoptazik est le prolongement naturel de cette d&eacute;marche : une boutique
              qui finance et soutient les projets artistiques et associatifs de La M.U.G.
              Chaque achat contribue directement &agrave; la mission de l&apos;association.
            </p>
          </div>
        </div>
      </section>

      {/* Fdy Phenomen */}
      <section className="relative px-4 py-16">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, #1A1610, #201A14)" }}
        />
        {/* Lueur ambre */}
        <div
          className="absolute -left-40 top-20 h-[400px] w-[400px] rounded-full blur-[120px]"
          style={{ background: "rgba(200,160,80,0.05)" }}
        />
        <div className="relative mx-auto max-w-3xl">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "#C8A050" }}
          >
            L&apos;artiste
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white">Fdy Phenomen</h2>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/60">
            <p>
              N&eacute; &agrave; Rouen en 1977 et grandi en Martinique, Fdy Phenomen porte le
              rap fran&ccedil;ais depuis plus de 30 ans. MC, auteur, interpr&egrave;te, il est
              de ceux qui ont travers&eacute; toutes les &eacute;poques du hip-hop sans jamais
              quitter le micro.
            </p>

            <blockquote
              className="border-l-2 py-2 pl-5 italic text-white/50"
              style={{ borderColor: "#C8A050" }}
            >
              &laquo;&nbsp;Le rap, c&apos;est la plume, le flow, la sc&egrave;ne. C&apos;est
              un mode de vie.&nbsp;&raquo;
            </blockquote>

            <p>
              Des premi&egrave;res cassettes avec{" "}
              <span className="text-white/80">Rimeurs &agrave; Gages</span> dans les
              ann&eacute;es 90 aux sc&egrave;nes l&eacute;gendaires avec le crew{" "}
              <span className="text-white/80">Ghet&apos; 7</span>, Fdy a b&acirc;ti une
              carri&egrave;re &agrave; l&apos;ancienne &mdash; pav&eacute;e de freestyles,
              de concerts et de collaborations marqu&eacute;es dans le marbre du rap
              fran&ccedil;ais.
            </p>
            <p>
              Son dernier album,{" "}
              <span className="text-white/80">Chanteur de Rap</span>, est la synth&egrave;se
              de tout un parcours. 10 titres entre storytelling et introspection, avec des
              featurings d&apos;exception : Sir Samuel, Arsenik, IAM. L&apos;album est produit
              par <span className="text-white/80">Frero Prod</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Frero Prod */}
      <section className="relative px-4 py-16">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, #201A14, #1A1610)" }}
        />
        <div className="relative mx-auto max-w-3xl">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "#C8A050" }}
          >
            La production
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white">Frero Prod</h2>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/60">
            <p>
              Derri&egrave;re les instrus de{" "}
              <span className="text-white/80">Chanteur de Rap</span>, il y a{" "}
              <span className="text-white/80">Salim et Karim</span> &mdash; le duo Frero
              Prod. Producteurs, compositeurs, ils sont les architectes sonores de l&apos;album.
            </p>
            <p>
              Leur patte : des productions qui respectent les codes du boom-bap classique tout
              en les modernisant, des samples chin&eacute;s avec pr&eacute;cision, des basses
              profondes et des arrangements riches. Le parfait &eacute;crin pour la plume de
              Fdy.
            </p>
          </div>
        </div>
      </section>

      {/* Discographie */}
      <section className="relative px-4 py-16">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, #1A1610, #201A14)" }}
        />
        <div className="relative mx-auto max-w-3xl">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "#C8A050" }}
          >
            Le parcours
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white">
            De Rimeurs &agrave; Gages &agrave; Chanteur de Rap
          </h2>

          <div className="mt-8 space-y-5">
            {[
              {
                period: "Ann\u00e9es 90",
                title: "Rimeurs \u00e0 Gages",
                desc: "Les d\u00e9buts. Cassettes, freestyles, premi\u00e8res sc\u00e8nes. Le rap est brut, la plume d\u00e9j\u00e0 affirm\u00e9e.",
              },
              {
                period: "Ann\u00e9es 2000",
                title: "Ghet\u2019 7 & la sc\u00e8ne",
                desc: "Le crew, les concerts, les collaborations. Fdy s\u2019impose comme un MC de r\u00e9f\u00e9rence sur la sc\u00e8ne ind\u00e9pendante.",
              },
              {
                period: "Ann\u00e9es 2010",
                title: "Projets solos & maturation",
                desc: "L\u2019\u00e9criture se peaufine, les th\u00e8mes se diversifient. Le rap d\u2019auteur prend forme.",
              },
              {
                period: "2021",
                title: "La M.U.G",
                desc: "Cr\u00e9ation de l\u2019association. La musique devient un outil de transmission et de p\u00e9dagogie.",
              },
              {
                period: "2025",
                title: "Chanteur de Rap",
                desc: "L\u2019album manifeste. 10 titres produits par Frero Prod, avec Sir Samuel, Arsenik, IAM. Le blouson Avirex sur le dos.",
              },
            ].map((era, i) => (
              <div
                key={i}
                className="flex gap-5 rounded-xl border p-5"
                style={{
                  borderColor: "rgba(255,255,255,0.06)",
                  background: "rgba(200,160,80,0.04)",
                }}
              >
                <div className="shrink-0">
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#C8A050" }}
                  >
                    {era.period}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{era.title}</h3>
                  <p className="mt-1 text-sm text-white/50">{era.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-20">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, #201A14, #1A1610)" }}
        />
        <div
          className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full blur-[100px]"
          style={{ background: "rgba(200,160,80,0.06)" }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-white">
            D&eacute;couvrez l&apos;univers de Fdy Phenomen
          </h2>
          <p className="mt-4 text-sm text-white/50">
            Explorez la discographie compl&egrave;te, les vinyles, les &eacute;ditions
            limit&eacute;es et l&apos;histoire d&apos;un artiste qui porte le rap depuis plus
            de 30 ans.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/artists/fdy-phenomen"
              className="rounded-xl px-7 py-3.5 font-bold text-black transition hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, #C8A050, #A08030)",
                boxShadow: "0 6px 25px rgba(200,160,80,0.3)",
              }}
            >
              Page artiste
            </Link>
            <Link
              href="/artists/fdy-phenomen/chanteur-de-rap"
              className="rounded-xl border px-7 py-3.5 font-bold text-white/70 transition hover:border-[#C8A050]/40 hover:text-white"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            >
              Chanteur de Rap
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
