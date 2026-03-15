import Link from "next/link";
import { getFeaturedProject, getArtists } from "@/lib/supabase-data";
import { formatPrice, categoryLabel } from "@/lib/utils";
import FlamboyantFlower, {
  FlamboyantTattoo,
  FlamboyantLeaf,
} from "@/components/ui/FlamboyantFlower";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await getFeaturedProject();
  const artists = await getArtists();

  return (
    <div className="relative overflow-hidden" style={{ background: "#1a0e14" }}>
      {/* ============================================
          HERO — La pochette en immersion totale
          Couleurs exactes : mauve sombre, bordeaux rosé, lie-de-vin
          ============================================ */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Fond — les tons exacts de la pochette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, #3A1528 0%, #2A0E1C 25%, #1a0e14 50%, #251020 75%, #3A1528 100%)",
          }}
        />
        {/* Halo mauve/rose en haut à gauche — comme la pochette */}
        <div
          className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, #5A2040 0%, transparent 70%)" }}
        />
        {/* Lumière blanche en haut — le flash de la pochette */}
        <div
          className="absolute right-1/4 -top-20 h-[300px] w-[200px] rotate-12 blur-3xl"
          style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 70%)" }}
        />
        {/* Lueur rosée en bas à droite */}
        <div
          className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, #4A1830 0%, transparent 70%)" }}
        />

        {/* LE TATOUAGE — visible, grand, en semi-transparence */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 md:left-0">
          <FlamboyantTattoo className="h-[600px] w-[500px] md:h-[800px] md:w-[660px]" opacity={0.12} />
        </div>
        <div className="absolute -right-32 top-20 hidden lg:block">
          <FlamboyantTattoo className="h-[500px] w-[420px] -scale-x-100" opacity={0.07} />
        </div>

        {/* Fleurs isolées décoratives */}
        <FlamboyantFlower className="absolute right-8 top-16 h-32 w-32 rotate-12" opacity={0.1} />
        <FlamboyantFlower className="absolute left-1/3 bottom-20 h-24 w-24 -rotate-20" opacity={0.08} />
        <FlamboyantLeaf className="absolute right-1/4 bottom-32 h-10 w-20 rotate-6" opacity={0.12} />

        {/* Contenu Hero */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 pb-20 pt-12 md:flex-row md:gap-16 md:pb-24 md:pt-20">
          {/* Pochette album */}
          {featured && (
            <div className="relative mb-10 shrink-0 md:mb-0">
              {/* Lueur mauve/rose derrière — fidèle à la pochette */}
              <div
                className="absolute -inset-12 rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, #5A2040 0%, #3A1528 40%, transparent 70%)" }}
              />
              <div className="relative h-80 w-80 overflow-hidden rounded-2xl shadow-2xl md:h-[460px] md:w-[460px]"
                style={{ boxShadow: "0 25px 80px rgba(90,32,64,0.5), 0 0 120px rgba(58,21,40,0.3)" }}
              >
                <img
                  src={featured.cover_url}
                  alt={featured.title}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Petite fleur en bas de la pochette */}
              <FlamboyantFlower className="absolute -bottom-4 -right-4 h-20 w-20 rotate-12" opacity={0.5} />
            </div>
          )}

          {/* Texte */}
          <div className="flex-1 text-center md:text-left">
            <p
              className="text-xs font-semibold uppercase tracking-[0.4em]"
              style={{ color: "#C07088" }}
            >
              Shoptazik pr&eacute;sente
            </p>
            <h1 className="mt-4 text-6xl font-black tracking-tight md:text-8xl"
              style={{ color: "#D41920" }}
            >
              FLAMBOYANT
            </h1>
            <p className="mt-2 text-2xl font-light" style={{ color: "#C07088" }}>
              Fdy Phenomen
            </p>
            <p
              className="mx-auto mt-6 max-w-lg text-base leading-relaxed md:mx-0"
              style={{ color: "#9A7080" }}
            >
              Comme la fleur de flamboyant tatou&eacute;e sur son visage, cet
              album est rouge, vif, impossible &agrave; ignorer. Fdy Phenomen
              d&eacute;ploie tout son talent d&apos;&eacute;criture sur des
              productions riches et vari&eacute;es. Un projet flamboyant, &agrave;
              la hauteur de son nom.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
              <Link
                href="/artists/fdy-phenomen/flamboyant"
                className="rounded-xl px-8 py-4 text-center font-bold text-white shadow-xl transition hover:shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #D41920, #8B1515)",
                  boxShadow: "0 8px 30px rgba(212,25,32,0.3)",
                }}
              >
                D&eacute;couvrir l&apos;album
              </Link>
              <Link
                href="/artists/fdy-phenomen"
                className="rounded-xl border px-8 py-4 text-center font-semibold transition hover:bg-white/5"
                style={{ borderColor: "#5A2040", color: "#C07088" }}
              >
                Toute la discographie
              </Link>
            </div>
          </div>
        </div>

        {/* Ligne séparatrice */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, #5A2040, transparent)" }}
        />
      </section>

      {/* ============================================
          SECTION PRODUITS
          ============================================ */}
      {featured && featured.products.length > 0 && (
        <section className="relative px-4 py-20">
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at top, #251020 0%, #1a0e14 60%)" }}
          />
          {/* Tatouage en fond de section */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block">
            <FlamboyantTattoo className="h-[400px] w-[340px]" opacity={0.05} />
          </div>

          <div className="relative mx-auto max-w-7xl">
            <div className="mb-10 flex items-center gap-4">
              <FlamboyantFlower className="h-10 w-10 shrink-0" opacity={0.6} />
              <h2 className="text-2xl font-bold text-white">
                Formats disponibles
              </h2>
              <div className="h-px flex-1" style={{ background: "linear-gradient(to right, #5A2040, transparent)" }} />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.products.map((product) => (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-xl border transition hover:border-[#D41920]/40"
                  style={{
                    borderColor: "rgba(90,32,64,0.2)",
                    background: "linear-gradient(135deg, #251020, #1a0e14)",
                  }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                    {product.is_limited && (
                      <span
                        className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white"
                        style={{ background: "#D41920", boxShadow: "0 4px 15px rgba(212,25,32,0.4)" }}
                      >
                        &Eacute;dition limit&eacute;e
                      </span>
                    )}
                    <span
                      className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs"
                      style={{ background: "rgba(0,0,0,0.6)", color: "#C07088" }}
                    >
                      {categoryLabel(product.category)}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-white">{product.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm" style={{ color: "#9A7080" }}>
                      {product.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-white">
                          {formatPrice(product.price)}
                        </span>
                        {product.edition_info && (
                          <p className="text-xs" style={{ color: "#D41920" }}>
                            {product.edition_info}
                          </p>
                        )}
                      </div>
                      <Link
                        href="/artists/fdy-phenomen/flamboyant"
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                        style={{ background: "#D41920" }}
                      >
                        Voir
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          SECTION TATOUAGE — Mise en valeur du motif
          ============================================ */}
      <section className="relative overflow-hidden py-24">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, #1a0e14, #2A1220, #1a0e14)" }}
        />

        {/* Le tatouage complet, grand, centré — c'est la star */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <FlamboyantTattoo className="h-[700px] w-[580px] md:h-[900px] md:w-[750px]" opacity={0.08} />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <FlamboyantFlower className="mx-auto mb-6 h-20 w-20" opacity={0.5} />

          <blockquote className="text-2xl font-light leading-relaxed md:text-4xl" style={{ color: "#C07088" }}>
            &laquo;&nbsp;Le flamboyant c&apos;est l&apos;arbre qui prend feu
            sans br&ucirc;ler. Le rouge qui explose. La beaut&eacute; qui
            s&apos;impose sans demander la permission.&nbsp;&raquo;
          </blockquote>

          <div className="mt-8 flex items-center justify-center gap-4">
            <FlamboyantLeaf className="h-6 w-14" opacity={0.3} />
            <span className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: "#D41920" }}>
              Fdy Phenomen
            </span>
            <FlamboyantLeaf className="h-6 w-14 -scale-x-100" opacity={0.3} />
          </div>
        </div>
      </section>

      {/* ============================================
          TRACKLIST
          ============================================ */}
      {featured && (
        <section className="relative px-4 py-16">
          <FlamboyantFlower className="absolute -left-8 top-1/3 h-28 w-28 -rotate-12" opacity={0.06} />

          <div className="relative mx-auto max-w-4xl">
            <div className="mb-8 flex items-center gap-4">
              <FlamboyantFlower className="h-8 w-8 shrink-0" opacity={0.5} />
              <h2 className="text-2xl font-bold text-white">Tracklist</h2>
              <div className="h-px flex-1" style={{ background: "linear-gradient(to right, #5A2040, transparent)" }} />
              <span className="text-sm" style={{ color: "#9A7080" }}>
                {featured.tracklist.length} titres
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border" style={{ borderColor: "rgba(90,32,64,0.15)", background: "#150a10" }}>
              {featured.tracklist.map((track, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-6 py-3.5 transition hover:bg-[#201018]"
                  style={{
                    borderBottom: i !== featured.tracklist.length - 1 ? "1px solid rgba(90,32,64,0.1)" : "none",
                  }}
                >
                  <span className="w-8 text-right text-sm font-medium" style={{ color: "#D41920", opacity: 0.5 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm" style={{ color: "#C07088" }}>{track}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/artists/fdy-phenomen/flamboyant"
                className="inline-flex items-center gap-2 text-sm font-semibold transition hover:opacity-80"
                style={{ color: "#D41920" }}
              >
                Voir le projet complet &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          ARTISTE
          ============================================ */}
      <section className="relative px-4 py-20">
        <FlamboyantFlower className="absolute -right-12 bottom-1/4 h-36 w-36 rotate-20" opacity={0.05} />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 flex items-center gap-4">
            <FlamboyantFlower className="h-8 w-8 shrink-0" opacity={0.5} />
            <h2 className="text-2xl font-bold text-white">L&apos;artiste</h2>
            <div className="h-px flex-1" style={{ background: "linear-gradient(to right, #5A2040, transparent)" }} />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artists/${artist.slug}`}
                className="group overflow-hidden rounded-xl border p-6 transition hover:border-[#D41920]/30"
                style={{
                  borderColor: "rgba(90,32,64,0.15)",
                  background: "linear-gradient(135deg, #201018, #1a0e14)",
                }}
              >
                <div
                  className="mb-4 h-20 w-20 overflow-hidden rounded-full ring-2 ring-[#5A2040]/30 transition group-hover:ring-[#D41920]/50"
                >
                  <img
                    src={artist.image_url}
                    alt={artist.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-white transition group-hover:text-[#D41920]">
                  {artist.name}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm" style={{ color: "#9A7080" }}>
                  {artist.bio}
                </p>
                <p className="mt-4 text-sm font-medium" style={{ color: "#D41920" }}>
                  Voir la discographie &rarr;
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          BANDE FLORALE — Tatouage en frise de fermeture
          ============================================ */}
      <div className="relative h-32 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, #1a0e14, transparent)" }}
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-[0.07]">
          <FlamboyantTattoo className="h-48 w-[800px]" opacity={1} />
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, #5A2040, transparent)" }}
        />
      </div>
    </div>
  );
}
