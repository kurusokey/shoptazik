import Link from "next/link";
import { getFeaturedProject, getArtists } from "@/lib/supabase-data";
import { formatPrice, categoryLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

const COVER_FRONT = "/images/projects/album_chanteur_de_rap.jpg";
const COVER_BACK = "/images/projects/album_chanteur_de_rap_back.jpg";
const COVER_INSIDE = "/images/projects/album_chanteur_de_rap_inside.jpg";
const COVER_MOCKUP = "/images/projects/album_chanteur_de_rap_front_mockup.jpg";

const grainStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
  backgroundRepeat: "repeat",
  backgroundSize: "128px 128px",
};

export default async function HomePage() {
  const featured = await getFeaturedProject();
  const artists = await getArtists();

  return (
    <div className="relative" style={{ background: "#E8DDD0" }}>
      <div className="pointer-events-none fixed inset-0 z-50 opacity-50" style={grainStyle} />

      {/* ============================================
          HERO — Front cover + texte
          Fond beige/crème comme le recto
          ============================================ */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(170deg, #D8CCBE 0%, #E8DDD0 30%, #D0C4B5 60%, #E0D5C8 100%)",
          }}
        />
        <div
          className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{ background: "rgba(58,90,138,0.1)" }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 md:py-16">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
            <div className="flex justify-center">
              <div
                className="w-full max-w-[520px] overflow-hidden rounded-lg"
                style={{ boxShadow: "0 30px 80px rgba(26,26,26,0.2), 0 0 0 1px rgba(26,26,26,0.08)" }}
              >
                <img src={COVER_FRONT} alt="Fdy Phenomen — Chanteur de Rap" className="block h-auto w-full" />
              </div>
            </div>

            <div className="text-center md:text-left">
              <p className="text-xs font-medium uppercase tracking-[0.3em]" style={{ color: "#3A5A8A" }}>
                Shoptazik pr&eacute;sente
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl lg:text-6xl" style={{ color: "#1A1A1A" }}>
                Le nouvel album
              </h2>
              <p className="mt-2 text-lg" style={{ color: "#3A5A8A" }}>
                Fdy Phenomen &mdash; Chanteur de Rap
              </p>
              <p className="mx-auto mt-6 max-w-md leading-relaxed md:mx-0" style={{ color: "#6A5A4A" }}>
                L&apos;&eacute;criture comme arme, le storytelling comme art.
                10 titres de rap d&apos;auteur dans sa forme la plus aboutie.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
                <Link
                  href="/artists/fdy-phenomen/chanteur-de-rap"
                  className="rounded-xl px-8 py-4 font-bold text-white transition hover:brightness-110"
                  style={{ background: "linear-gradient(135deg, #3A5A8A, #2A4A7A)", boxShadow: "0 6px 30px rgba(58,90,138,0.35)" }}
                >
                  D&eacute;couvrir l&apos;album
                </Link>
                <Link
                  href="/artists/fdy-phenomen"
                  className="rounded-xl px-8 py-4 font-semibold transition hover:bg-black/5"
                  style={{ border: "1px solid rgba(26,26,26,0.15)", color: "#4A4A4A" }}
                >
                  Discographie
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION VERSO — Fond ambre/ocre doré
          L'univers du verso de l'album
          ============================================ */}
      <section className="relative overflow-hidden">
        {/* Fond ambre/ocre du verso */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(170deg, #C8880A, #D49830, #B87820)" }} />
        {/* Image verso floutée en fond */}
        <div className="absolute inset-0 overflow-hidden">
          <img src={COVER_BACK} alt="" className="h-full w-full scale-110 object-cover blur-[60px]" style={{ opacity: 0.3 }} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            {/* Mockups CD */}
            <div className="flex flex-col items-center gap-6">
              <div className="w-full max-w-[500px] overflow-hidden rounded-lg" style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}>
                <img src={COVER_BACK} alt="Verso — Chanteur de Rap" className="block h-auto w-full" />
              </div>
            </div>

            {/* Texte sur fond ambre */}
            <div className="text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                Le verso
              </p>
              <h2 className="mt-4 text-3xl font-black text-white md:text-4xl">
                Dans les coulisses de l&apos;album
              </h2>
              <p className="mt-4 leading-relaxed text-white/70">
                Chanteur de Rap, c&apos;est aussi un objet. La veste, la boutique,
                l&apos;univers visuel. Chaque d&eacute;tail du packaging raconte
                une histoire. Du rap d&apos;auteur jusqu&apos;au bout des doigts.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="overflow-hidden rounded-lg" style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
                  <img src={COVER_MOCKUP} alt="CD Front mockup" className="block h-auto w-full" />
                </div>
                <div className="overflow-hidden rounded-lg" style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
                  <img src={COVER_INSIDE} alt="CD Inside" className="block h-auto w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FORMATS / PRODUITS — Transition ambre → beige
          ============================================ */}
      {featured && featured.products.length > 0 && (
        <section className="relative overflow-hidden px-4 py-20">
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #C8880A, #D8CCBE, #E0D5C8)" }} />

          <div className="relative mx-auto max-w-5xl">
            <h2 className="mb-10 text-2xl font-bold text-white">
              Formats disponibles
            </h2>

            <div className="space-y-4">
              {featured.products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-5 rounded-xl border p-5 backdrop-blur-sm transition hover:border-white/30"
                  style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.15)" }}
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                    <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold" style={{ color: "#1A1A1A" }}>{product.name}</h3>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs" style={{ color: "#5A4A3A" }}>
                      <span>{categoryLabel(product.category)}</span>
                      {product.is_limited && <span className="font-semibold" style={{ color: "#3A5A8A" }}>Edition limit&eacute;e</span>}
                      {product.edition_info && <span>&middot; {product.edition_info}</span>}
                    </div>
                    <p className="mt-1 hidden text-sm sm:block" style={{ color: "#6A5A4A" }}>{product.description}</p>
                  </div>
                  <span className="shrink-0 text-xl font-bold" style={{ color: "#1A1A1A" }}>{formatPrice(product.price)}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/artists/fdy-phenomen/chanteur-de-rap"
                className="inline-block rounded-xl px-8 py-4 font-bold text-white transition hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #3A5A8A, #2A4A7A)", boxShadow: "0 6px 30px rgba(58,90,138,0.35)" }}
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
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #E0D5C8, #E8DDD0)" }} />

          <div className="relative mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-5 md:gap-12">
              <div className="hidden md:col-span-2 md:block">
                <div className="sticky top-24 overflow-hidden rounded-xl" style={{ boxShadow: "0 20px 50px rgba(26,26,26,0.15)" }}>
                  <img src={COVER_FRONT} alt="Chanteur de Rap" className="block h-auto w-full" />
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>Tracklist</h2>
                  <span className="text-sm" style={{ color: "#8A7A6A" }}>{featured.tracklist.length} titres</span>
                </div>

                <div className="overflow-hidden rounded-xl border" style={{ borderColor: "rgba(26,26,26,0.08)", background: "rgba(255,255,255,0.4)" }}>
                  {featured.tracklist.map((track, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-5 py-4 transition hover:bg-white/40"
                      style={{ borderBottom: i !== featured.tracklist.length - 1 ? "1px solid rgba(26,26,26,0.06)" : "none" }}
                    >
                      <span className="w-8 text-right text-sm font-bold" style={{ color: "rgba(58,90,138,0.4)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-sm" style={{ color: "#3A3A3A" }}>{track}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center md:text-left">
                  <Link href="/artists/fdy-phenomen/chanteur-de-rap" className="text-sm font-semibold transition hover:opacity-70" style={{ color: "#3A5A8A" }}>
                    Voir le projet complet &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          CITATION
          ============================================ */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #E8DDD0, #D8CCBE)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <blockquote className="text-xl font-light italic leading-relaxed md:text-2xl" style={{ color: "#2A3A4A" }}>
            &laquo;&nbsp;Le rap, c&apos;est de la litt&eacute;rature qui se chante.
            Cet album, c&apos;est la preuve.&nbsp;&raquo;
          </blockquote>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: "#3A5A8A" }}>
            Fdy Phenomen
          </p>
        </div>
      </section>

      {/* ============================================
          ARTISTE
          ============================================ */}
      <section className="relative px-4 py-20">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #D8CCBE, #D0C4B5)" }} />
        <div className="relative mx-auto max-w-7xl">
          <h2 className="mb-10 text-2xl font-bold" style={{ color: "#1A1A1A" }}>L&apos;artiste</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artists/${artist.slug}`}
                className="group overflow-hidden rounded-xl border p-6 transition hover:border-[#3A5A8A]/30"
                style={{ borderColor: "rgba(26,26,26,0.08)", background: "rgba(255,255,255,0.4)" }}
              >
                <div className="mb-4 h-20 w-20 overflow-hidden rounded-full ring-2 ring-black/5 transition group-hover:ring-[#3A5A8A]/30">
                  <img src={artist.image_url} alt={artist.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="text-xl font-bold transition group-hover:text-[#3A5A8A]" style={{ color: "#1A1A1A" }}>{artist.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm" style={{ color: "#6A5A4A" }}>{artist.bio}</p>
                <p className="mt-4 text-sm font-medium" style={{ color: "#3A5A8A" }}>Voir la discographie &rarr;</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
