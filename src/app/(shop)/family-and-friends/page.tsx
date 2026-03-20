import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Family & Friends",
  description:
    "Découvrez les produits de notre entourage — artistes, créateurs, artisans. La Mug Boutik' soutient la famille et les amis.",
};

export default function FamilyAndFriendsPage() {
  return (
    <div style={{ background: "#1A1610" }}>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(170deg, #201A14, #1A1610, #181210)",
          }}
        />
        <div
          className="absolute -right-40 top-0 h-[400px] w-[400px] rounded-full blur-[120px]"
          style={{ background: "rgba(200,160,80,0.04)" }}
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "#C8A050" }}
          >
            La Mug Boutik&apos;
          </p>
          <h1 className="mt-4 text-3xl font-black text-white md:text-5xl">
            Family &amp; Friends
          </h1>
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-white/45">
            La M.U.G, c&apos;est avant tout une famille. Ici, on met en
            lumi&egrave;re les cr&eacute;ations de notre entourage &mdash;
            artistes, cr&eacute;ateurs, artisans &mdash; qui partagent nos
            valeurs et notre vision de la culture urbaine.
          </p>
        </div>
      </section>

      {/* Message "Bientôt" */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div
            className="rounded-2xl border p-8 text-center md:p-12"
            style={{
              borderColor: "rgba(200,160,80,0.12)",
              background: "rgba(200,160,80,0.03)",
            }}
          >
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: "rgba(200,160,80,0.1)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#C8A050"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white md:text-2xl">
              Bient&ocirc;t disponible
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/40">
              Nous pr&eacute;parons une s&eacute;lection de produits
              cr&eacute;&eacute;s par nos proches &mdash; musique,
              v&ecirc;tements, accessoires, objets d&apos;art. Chaque produit
              raconte une histoire et porte les valeurs de la culture urbaine.
            </p>
            <p className="mt-6 text-sm text-white/30">
              Tu es artiste, cr&eacute;ateur ou artisan et tu veux rejoindre
              la famille ?
            </p>
            <a
              href="mailto:contact@la-mug.com?subject=Family %26 Friends — Proposition"
              className="mt-4 inline-block rounded-lg px-6 py-3 text-sm font-bold transition hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, #C8A050, #8B6914)",
                color: "#1A1610",
              }}
            >
              Contacte-nous &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-4 sm:grid-cols-3">
            <div
              className="rounded-xl border p-6 text-center"
              style={{
                borderColor: "rgba(200,160,80,0.08)",
                background: "rgba(200,160,80,0.02)",
              }}
            >
              <div className="text-2xl">🎤</div>
              <h3 className="mt-3 text-sm font-bold text-white">Musique</h3>
              <p className="mt-2 text-xs text-white/30">
                Albums, singles, instrumentales de la famille
              </p>
            </div>
            <div
              className="rounded-xl border p-6 text-center"
              style={{
                borderColor: "rgba(200,160,80,0.08)",
                background: "rgba(200,160,80,0.02)",
              }}
            >
              <div className="text-2xl">👕</div>
              <h3 className="mt-3 text-sm font-bold text-white">
                V&ecirc;tements
              </h3>
              <p className="mt-2 text-xs text-white/30">
                Streetwear, cr&eacute;ations textiles, accessoires
              </p>
            </div>
            <div
              className="rounded-xl border p-6 text-center"
              style={{
                borderColor: "rgba(200,160,80,0.08)",
                background: "rgba(200,160,80,0.02)",
              }}
            >
              <div className="text-2xl">🎨</div>
              <h3 className="mt-3 text-sm font-bold text-white">Art</h3>
              <p className="mt-2 text-xs text-white/30">
                Illustrations, prints, objets d&apos;art urbain
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
