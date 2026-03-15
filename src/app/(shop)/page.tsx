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
          HERO — Pochette plein écran
          Le texte du site est EN BAS à gauche pour ne pas
          chevaucher "FDY PHENOMEN / FLAMBOYANT" de la pochette
          ============================================ */}
      <section className="relative overflow-hidden" style={{ height: "100vh", minHeight: "600px", maxHeight: "1000px" }}>
        {/* Pochette en fond — centrée sur le visage */}
        <img
          src={COVER_HD}
          alt="Fdy Phenomen — Flamboyant"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center 20%" }}
        />

        {/* Overlay bas : dégradé fort en bas pour le texte */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(15,7,11,0.6) 65%, rgba(15,7,11,0.95) 85%, #0f070b 100%)",
          }}
        />
        {/* Overlay latéral léger sur les bords */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(to right, rgba(15,7,11,0.4) 0%, transparent 20%, transparent 80%, rgba(15,7,11,0.4) 100%)",
          }}
        />

        {/* Texte — positionné EN BAS pour ne pas masquer la pochette ni son titre */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-10 md:pb-14">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/40">
              Shoptazik pr&eacute;sente
            </p>
            <div className="mt-4 flex flex-wrap items-end gap-6 md:gap-10">
              <div className="flex-1">
                <p className="text-lg text-white/70 md:text-xl">
                  Le nouvel album de <span className="font-semibold text-white">Fdy Phenomen</span>
                </p>
                <p className="mt-1 text-sm text-white/40">
                  9 titres &middot; Disponible en vinyle, CD et merch
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/artists/fdy-phenomen/flamboyant"
                  className="rounded-xl px-6 py-3 text-sm font-bold text-white transition hover:opacity-90 md:px-8 md:py-4 md:text-base"
                  style={{
                    background: "#D41920",
                    boxShadow: "0 6px 25px rgba(212,25,32,0.35)",
                  }}
                >
                  D&eacute;couvrir l&apos;album
                </Link>
                <Link
                  href="/artists/fdy-phenomen"
                  className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white md:px-8 md:py-4 md:text-base"
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
          {/* Pochette floutée en fond */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={COVER_HD}
              alt=""
              className="h-full w-full scale-125 object-cover blur-[100px]"
              style={{ opacity: 0.12 }}
            />
            <div className="absolute inset-0" style={{ background: "rgba(15,7,11,0.85)" }} />
          </div>

          <div className="relative mx-auto max-w-7xl">
            <h2 className="mb-10 text-2xl font-bold text-white">
              Formats disponibles
            </h2>

            <div className="grid gap-8 lg:grid-cols-5">
              {/* Pochette à gauche */}
              <div className="flex items-start justify-center lg:col-span-2">
                <div
                  className="h-72 w-72 overflow-hidden rounded-2xl md:h-96 md:w-96"
                  style={{ boxShadow: "0 25px 60px rgba(90,20,40,0.5)" }}
                >
                  <img
                    src={COVER_HD}
                    alt="Flamboyant"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Produits à droite */}
              <div className="flex flex-col justify-center space-y-4 lg:col-span-3">
                {featured.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 rounded-xl border p-4 transition hover:border-[#D41920]/30"
                    style={{
                      borderColor: "rgba(90,32,64,0.15)",
                      background: "rgba(25,12,18,0.6)",
                    }}
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate font-semibold text-white">{product.name}</h3>
                      <div className="mt-0.5 flex items-center gap-2 text-xs" style={{ color: "#9A7080" }}>
                        <span>{categoryLabel(product.category)}</span>
                        {product.is_limited && (
                          <span style={{ color: "#D41920" }}>Edition limit&eacute;e</span>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 text-lg font-bold text-white">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                ))}

                <Link
                  href="/artists/fdy-phenomen/flamboyant"
                  className="mt-2 inline-block rounded-xl px-6 py-3 text-center font-bold text-white transition hover:opacity-90"
                  style={{ background: "#D41920" }}
                >
                  Voir tous les formats
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          BANDEAU — Pochette recadrée sur le tatouage
          ============================================ */}
      <section className="relative h-48 overflow-hidden md:h-72">
        <img
          src={COVER_HD}
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: "center 55%" }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background:
              "linear-gradient(to right, #0f070b, rgba(15,7,11,0.4), rgba(15,7,11,0.4), #0f070b)",
          }}
        >
          <blockquote className="max-w-3xl px-8 text-center text-lg font-light leading-relaxed text-white/80 md:text-2xl">
            &laquo;&nbsp;Le flamboyant, c&apos;est l&apos;arbre qui prend feu
            sans br&ucirc;ler. Cet album, c&apos;est &ccedil;a.&nbsp;&raquo;
          </blockquote>
        </div>
      </section>

      {/* ============================================
          TRACKLIST
          ============================================ */}
      {featured && (
        <section className="relative px-4 py-16">
          <div className="relative mx-auto max-w-4xl">
            <div className="mb-8 flex items-center justify-between">
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
                  className="flex items-center gap-4 px-6 py-3.5 transition hover:bg-white/[0.03]"
                  style={{
                    borderBottom:
                      i !== featured.tracklist.length - 1
                        ? "1px solid rgba(90,32,64,0.08)"
                        : "none",
                  }}
                >
                  <span className="w-8 text-right text-sm font-medium" style={{ color: "rgba(212,25,32,0.4)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-white/60">{track}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/artists/fdy-phenomen/flamboyant"
                className="text-sm font-semibold transition hover:opacity-80"
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
        <div className="relative mx-auto max-w-7xl">
          <h2 className="mb-10 text-2xl font-bold text-white">L&apos;artiste</h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artists/${artist.slug}`}
                className="group overflow-hidden rounded-xl border p-6 transition hover:border-[#D41920]/30"
                style={{
                  borderColor: "rgba(90,32,64,0.12)",
                  background: "rgba(20,10,15,0.8)",
                }}
              >
                <div className="mb-4 h-20 w-20 overflow-hidden rounded-full ring-2 ring-white/10 transition group-hover:ring-[#D41920]/50">
                  <img src={artist.image_url} alt={artist.name} className="h-full w-full object-cover" />
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
    </div>
  );
}
