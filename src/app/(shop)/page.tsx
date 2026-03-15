import Link from "next/link";
import { getFeaturedProject, getArtists } from "@/lib/supabase-data";
import { formatPrice, categoryLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

const COVER_HD = "/images/projects/album_flamboyant_hd.jpg";

// Overlay grain CSS — reproduit la texture vieillie/grainée de la pochette
const grainStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
  backgroundRepeat: "repeat",
  backgroundSize: "128px 128px",
};

export default async function HomePage() {
  const featured = await getFeaturedProject();
  const artists = await getArtists();

  return (
    <div className="relative" style={{ background: "#3A1E2C" }}>
      {/* Grain texture sur toute la page */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-40" style={grainStyle} />

      {/* ============================================
          HERO — La pochette intégrée dans son propre univers
          Fond rose/mauve poussiéreux = comme le fond de la pochette
          ============================================ */}
      <section className="relative overflow-hidden">
        {/* Fond texturé — tons exacts de la pochette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(170deg, #4A2535 0%, #3A1E2C 30%, #5A3045 50%, #3A1E2C 70%, #2A1520 100%)",
          }}
        />
        {/* Taches de lumière comme sur la pochette */}
        <div
          className="absolute left-1/3 -top-20 h-[400px] w-[300px] rotate-12 blur-[80px]"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        <div
          className="absolute -left-20 top-1/3 h-[300px] w-[300px] rounded-full blur-[100px]"
          style={{ background: "rgba(120,50,70,0.3)" }}
        />
        <div
          className="absolute -right-20 bottom-1/4 h-[300px] w-[300px] rounded-full blur-[100px]"
          style={{ background: "rgba(90,40,60,0.25)" }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 md:py-16">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
            {/* Pochette ENTIÈRE */}
            <div className="flex justify-center">
              <div
                className="w-full max-w-[520px] overflow-hidden rounded-lg"
                style={{
                  boxShadow:
                    "0 30px 80px rgba(20,5,15,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
                }}
              >
                <img
                  src={COVER_HD}
                  alt="Fdy Phenomen — Flamboyant"
                  className="block h-auto w-full"
                />
              </div>
            </div>

            {/* Texte */}
            <div className="text-center md:text-left">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/30">
                Shoptazik pr&eacute;sente
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
                L&apos;album &eacute;v&eacute;nement
              </h2>
              <p className="mt-2 text-lg text-white/40">
                9 titres &middot; Disponible en vinyle, CD et merch
              </p>
              <p className="mx-auto mt-6 max-w-md leading-relaxed text-white/50 md:mx-0">
                Flamboyant, c&apos;est Fdy Phenomen dans toute sa splendeur.
                Un album ambitieux, des productions riches, une plume
                incandescente. Rouge, vif, impossible &agrave; ignorer.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
                <Link
                  href="/artists/fdy-phenomen/flamboyant"
                  className="rounded-xl px-8 py-4 font-bold text-white transition hover:brightness-110"
                  style={{
                    background: "linear-gradient(135deg, #8B3050, #5A2040)",
                    boxShadow: "0 6px 30px rgba(90,32,64,0.5)",
                  }}
                >
                  D&eacute;couvrir l&apos;album
                </Link>
                <Link
                  href="/artists/fdy-phenomen"
                  className="rounded-xl border border-white/15 px-8 py-4 font-semibold text-white/60 transition hover:border-white/30 hover:text-white"
                >
                  Discographie
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Séparation */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5" />
      </section>

      {/* ============================================
          BANDEAU POCHETTE — Fondu plein écran
          ============================================ */}
      <section className="relative h-56 overflow-hidden md:h-72">
        <img
          src={COVER_HD}
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: "center 45%" }}
        />
        {/* Overlay texturé */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(58,30,44,0.85), rgba(58,30,44,0.3), rgba(58,30,44,0.3), rgba(58,30,44,0.85))",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(58,30,44,0.5), transparent, rgba(42,21,32,0.5))",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <blockquote className="max-w-3xl px-8 text-center text-lg font-light italic leading-relaxed text-white/70 md:text-2xl">
            &laquo;&nbsp;Le flamboyant, c&apos;est l&apos;arbre qui prend feu
            sans br&ucirc;ler. Cet album, c&apos;est &ccedil;a.&nbsp;&raquo;
          </blockquote>
        </div>
      </section>

      {/* ============================================
          FORMATS / PRODUITS
          ============================================ */}
      {featured && featured.products.length > 0 && (
        <section className="relative overflow-hidden px-4 py-20">
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, #2A1520, #3A1E2C, #2A1520)" }}
          />

          <div className="relative mx-auto max-w-5xl">
            <h2 className="mb-10 text-2xl font-bold text-white">
              Formats disponibles
            </h2>

            <div className="space-y-4">
              {featured.products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-5 rounded-xl border p-5 transition hover:border-white/15"
                  style={{
                    borderColor: "rgba(255,255,255,0.06)",
                    background: "rgba(90,48,69,0.2)",
                  }}
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white">{product.name}</h3>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-white/40">
                      <span>{categoryLabel(product.category)}</span>
                      {product.is_limited && (
                        <span className="text-[#D41920]">
                          Edition limit&eacute;e
                        </span>
                      )}
                      {product.edition_info && (
                        <span>&middot; {product.edition_info}</span>
                      )}
                    </div>
                    <p className="mt-1 hidden text-sm text-white/30 sm:block">
                      {product.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-xl font-bold text-white">
                    {formatPrice(product.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/artists/fdy-phenomen/flamboyant"
                className="inline-block rounded-xl px-8 py-4 font-bold text-white transition hover:brightness-110"
                style={{
                  background: "linear-gradient(135deg, #8B3050, #5A2040)",
                  boxShadow: "0 6px 30px rgba(90,32,64,0.5)",
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
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, #2A1520, #3A1E2C)" }}
          />

          <div className="relative mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-5 md:gap-12">
              {/* Pochette sticky */}
              <div className="hidden md:col-span-2 md:block">
                <div
                  className="sticky top-24 overflow-hidden rounded-xl"
                  style={{
                    boxShadow:
                      "0 20px 50px rgba(20,5,15,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
                  }}
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
                  <span className="text-sm text-white/30">
                    {featured.tracklist.length} titres
                  </span>
                </div>

                <div
                  className="overflow-hidden rounded-xl border"
                  style={{
                    borderColor: "rgba(255,255,255,0.06)",
                    background: "rgba(90,48,69,0.15)",
                  }}
                >
                  {featured.tracklist.map((track, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-5 py-4 transition hover:bg-white/[0.04]"
                      style={{
                        borderBottom:
                          i !== featured.tracklist.length - 1
                            ? "1px solid rgba(255,255,255,0.04)"
                            : "none",
                      }}
                    >
                      <span className="w-8 text-right text-sm font-bold text-white/20">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-sm text-white/60">
                        {track}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center md:text-left">
                  <Link
                    href="/artists/fdy-phenomen/flamboyant"
                    className="text-sm font-semibold text-white/40 transition hover:text-white/70"
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
          ARTISTE
          ============================================ */}
      <section className="relative px-4 py-20">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, #3A1E2C, #2A1520)" }}
        />

        <div className="relative mx-auto max-w-7xl">
          <h2 className="mb-10 text-2xl font-bold text-white">
            L&apos;artiste
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artists/${artist.slug}`}
                className="group overflow-hidden rounded-xl border p-6 transition hover:border-white/15"
                style={{
                  borderColor: "rgba(255,255,255,0.06)",
                  background: "rgba(90,48,69,0.15)",
                }}
              >
                <div className="mb-4 h-20 w-20 overflow-hidden rounded-full ring-2 ring-white/10 transition group-hover:ring-white/25">
                  <img
                    src={artist.image_url}
                    alt={artist.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-white transition group-hover:text-white/80">
                  {artist.name}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-white/40">
                  {artist.bio}
                </p>
                <p className="mt-4 text-sm font-medium text-white/30 transition group-hover:text-white/50">
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
