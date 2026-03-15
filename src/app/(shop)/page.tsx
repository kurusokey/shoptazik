import Link from "next/link";
import { getFeaturedProject, getArtists } from "@/lib/supabase-data";
import { formatPrice, categoryLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

const COVER_HD = "/images/projects/album_flamboyant_hd.jpg";

export default async function HomePage() {
  const featured = await getFeaturedProject();
  const artists = await getArtists();

  return (
    <div style={{ background: "#0f070b" }}>
      {/* ============================================
          HERO — La pochette ENTIÈRE + CTA
          Fond aux couleurs de la pochette, pochette visible en entier
          ============================================ */}
      <section className="relative overflow-hidden">
        {/* Fond : couleurs extraites de la pochette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, #3A1528 0%, #2A0E1C 30%, #1a0e14 60%, #251020 100%)",
          }}
        />
        {/* Halo mauve comme le fond de la pochette */}
        <div
          className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full blur-[120px]"
          style={{ background: "rgba(90,32,64,0.25)" }}
        />
        <div
          className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full blur-[100px]"
          style={{ background: "rgba(58,21,40,0.2)" }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:py-20">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
            {/* Pochette — ENTIÈRE, pas coupée */}
            <div className="flex justify-center">
              <div
                className="w-full max-w-[500px] overflow-hidden rounded-2xl"
                style={{ boxShadow: "0 30px 80px rgba(60,15,30,0.6), 0 0 0 1px rgba(255,255,255,0.05)" }}
              >
                <img
                  src={COVER_HD}
                  alt="Fdy Phenomen — Flamboyant"
                  className="block h-auto w-full"
                />
              </div>
            </div>

            {/* Texte + CTA */}
            <div className="text-center md:text-left">
              <p
                className="text-xs font-medium uppercase tracking-[0.3em]"
                style={{ color: "#C07088" }}
              >
                Shoptazik pr&eacute;sente
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
                L&apos;album &eacute;v&eacute;nement
              </h2>
              <p className="mt-2 text-lg text-white/50">
                9 titres &middot; Disponible en vinyle, CD et merch
              </p>
              <p className="mx-auto mt-6 max-w-md leading-relaxed md:mx-0" style={{ color: "#9A7080" }}>
                Flamboyant, c&apos;est Fdy Phenomen dans toute sa splendeur.
                Un album ambitieux, des productions riches, une plume
                incandescente. Rouge, vif, impossible &agrave; ignorer.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
                <Link
                  href="/artists/fdy-phenomen/flamboyant"
                  className="rounded-xl px-8 py-4 font-bold text-white transition hover:brightness-110"
                  style={{
                    background: "linear-gradient(135deg, #5A2040, #3A1528)",
                    boxShadow: "0 6px 25px rgba(90,32,64,0.4)",
                    border: "1px solid rgba(192,112,136,0.2)",
                  }}
                >
                  D&eacute;couvrir l&apos;album
                </Link>
                <Link
                  href="/artists/fdy-phenomen"
                  className="rounded-xl px-8 py-4 font-semibold transition hover:text-white"
                  style={{
                    border: "1px solid rgba(192,112,136,0.2)",
                    color: "#C07088",
                  }}
                >
                  Discographie
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FORMATS / PRODUITS
          ============================================ */}
      {featured && featured.products.length > 0 && (
        <section className="relative overflow-hidden px-4 py-20">
          {/* Fond pochette floutée */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={COVER_HD}
              alt=""
              className="h-full w-full scale-125 object-cover blur-[100px]"
              style={{ opacity: 0.1 }}
            />
            <div className="absolute inset-0" style={{ background: "rgba(15,7,11,0.88)" }} />
          </div>

          <div className="relative mx-auto max-w-5xl">
            <h2 className="mb-10 text-2xl font-bold text-white">
              Formats disponibles
            </h2>

            <div className="space-y-4">
              {featured.products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-5 rounded-xl border p-5 transition hover:border-[#5A2040]/50"
                  style={{
                    borderColor: "rgba(90,32,64,0.15)",
                    background: "rgba(25,12,18,0.6)",
                  }}
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white">{product.name}</h3>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs" style={{ color: "#9A7080" }}>
                      <span>{categoryLabel(product.category)}</span>
                      {product.is_limited && (
                        <span style={{ color: "#D41920" }}>Edition limit&eacute;e</span>
                      )}
                      {product.edition_info && (
                        <span>&middot; {product.edition_info}</span>
                      )}
                    </div>
                    <p className="mt-1 hidden text-sm sm:block" style={{ color: "#9A7080" }}>
                      {product.description}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-xl font-bold text-white">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/artists/fdy-phenomen/flamboyant"
                className="inline-block rounded-xl px-8 py-4 font-bold text-white transition hover:brightness-110"
                style={{
                  background: "linear-gradient(135deg, #5A2040, #3A1528)",
                  boxShadow: "0 6px 25px rgba(90,32,64,0.4)",
                  border: "1px solid rgba(192,112,136,0.2)",
                }}
              >
                Voir tous les formats
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          TRACKLIST
          ============================================ */}
      {featured && (
        <section className="relative px-4 py-16">
          <div className="relative mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-5 md:gap-12">
              {/* Pochette miniature */}
              <div className="hidden md:col-span-2 md:block">
                <div
                  className="sticky top-24 overflow-hidden rounded-xl"
                  style={{ boxShadow: "0 20px 50px rgba(60,15,30,0.4)" }}
                >
                  <img
                    src={COVER_HD}
                    alt="Flamboyant"
                    className="block h-auto w-full"
                  />
                </div>
              </div>

              {/* Tracklist */}
              <div className="md:col-span-3">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Tracklist</h2>
                  <span className="text-sm" style={{ color: "#9A7080" }}>
                    {featured.tracklist.length} titres
                  </span>
                </div>

                <div
                  className="overflow-hidden rounded-xl border"
                  style={{ borderColor: "rgba(90,32,64,0.12)", background: "rgba(20,10,15,0.8)" }}
                >
                  {featured.tracklist.map((track, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-5 py-4 transition hover:bg-white/[0.03]"
                      style={{
                        borderBottom:
                          i !== featured.tracklist.length - 1
                            ? "1px solid rgba(90,32,64,0.08)"
                            : "none",
                      }}
                    >
                      <span
                        className="w-8 text-right text-sm font-bold"
                        style={{ color: "rgba(212,25,32,0.4)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-sm text-white/70">{track}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center md:text-left">
                  <Link
                    href="/artists/fdy-phenomen/flamboyant"
                    className="text-sm font-semibold transition hover:opacity-80"
                    style={{ color: "#C07088" }}
                  >
                    Voir le projet complet &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          BANDEAU CITATION
          ============================================ */}
      <section className="relative overflow-hidden py-16">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, #0f070b, #1a0e14, #0f070b)" }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <blockquote className="text-xl font-light leading-relaxed text-white/60 md:text-2xl">
            &laquo;&nbsp;Le flamboyant, c&apos;est l&apos;arbre qui prend feu
            sans br&ucirc;ler. Cet album, c&apos;est &ccedil;a.&nbsp;&raquo;
          </blockquote>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: "#5A2040" }}>
            Fdy Phenomen
          </p>
        </div>
      </section>

      {/* ============================================
          ARTISTE
          ============================================ */}
      <section className="relative px-4 py-20">
        <div className="relative mx-auto max-w-7xl">
          <h2 className="mb-10 text-2xl font-bold text-white">L&apos;artiste</h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artists/${artist.slug}`}
                className="group overflow-hidden rounded-xl border p-6 transition hover:border-[#5A2040]/40"
                style={{
                  borderColor: "rgba(90,32,64,0.12)",
                  background: "rgba(20,10,15,0.8)",
                }}
              >
                <div className="mb-4 h-20 w-20 overflow-hidden rounded-full ring-2 ring-white/10 transition group-hover:ring-[#5A2040]">
                  <img src={artist.image_url} alt={artist.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-white transition group-hover:text-[#C07088]">
                  {artist.name}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm" style={{ color: "#9A7080" }}>
                  {artist.bio}
                </p>
                <p className="mt-4 text-sm font-medium" style={{ color: "#C07088" }}>
                  Voir la discographie &rarr;
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
