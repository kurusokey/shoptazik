import Link from "next/link";
import { getFeaturedProject, getArtists } from "@/lib/supabase-data";
import { formatPrice, categoryLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await getFeaturedProject();
  const artists = await getArtists();
  const coverUrl = featured?.cover_url ?? "/images/projects/album_flamboyant.jpg";

  return (
    <div className="relative" style={{ background: "#0f070b" }}>
      {/* ============================================
          HERO — L'album cover EN PLEIN ÉCRAN
          ============================================ */}
      <section className="relative min-h-screen overflow-hidden">
        {/* La pochette en fond plein écran */}
        <div className="absolute inset-0">
          <img
            src={coverUrl}
            alt="Flamboyant"
            className="h-full w-full object-cover object-top"
          />
          {/* Overlay dégradé pour lisibilité */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(15,7,11,0.85) 0%, rgba(15,7,11,0.4) 40%, rgba(15,7,11,0.2) 60%, rgba(15,7,11,0.7) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(15,7,11,0.3) 0%, transparent 30%, transparent 60%, rgba(15,7,11,0.95) 100%)",
            }}
          />
        </div>

        {/* Contenu texte */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-6 pb-16 md:justify-center md:pb-0">
          <div className="max-w-xl">
            <p
              className="text-xs font-semibold uppercase tracking-[0.4em]"
              style={{ color: "#C07088" }}
            >
              Shoptazik pr&eacute;sente
            </p>
            <h1
              className="mt-3 text-6xl font-black tracking-tight md:text-8xl"
              style={{ color: "#D41920" }}
            >
              FLAMBOYANT
            </h1>
            <p className="mt-1 text-2xl font-light text-white/80">
              Fdy Phenomen
            </p>
            <p className="mt-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              Comme la fleur de flamboyant tatou&eacute;e sur son visage, cet
              album est rouge, vif et impossible &agrave; ignorer.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/artists/fdy-phenomen/flamboyant"
                className="rounded-xl px-8 py-4 font-bold text-white transition hover:opacity-90"
                style={{
                  background: "#D41920",
                  boxShadow: "0 8px 30px rgba(212,25,32,0.35)",
                }}
              >
                D&eacute;couvrir l&apos;album
              </Link>
              <Link
                href="/artists/fdy-phenomen"
                className="rounded-xl border border-white/20 px-8 py-4 font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
              >
                Discographie
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION POCHETTE + PRODUITS
          ============================================ */}
      {featured && featured.products.length > 0 && (
        <section className="relative overflow-hidden px-4 py-20">
          {/* Pochette en fond floutée */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={coverUrl}
              alt=""
              className="h-full w-full scale-110 object-cover blur-3xl"
              style={{ opacity: 0.15 }}
            />
            <div className="absolute inset-0" style={{ background: "rgba(15,7,11,0.8)" }} />
          </div>

          <div className="relative mx-auto max-w-7xl">
            <h2 className="mb-10 text-2xl font-bold text-white">
              Disponible en vinyle, CD &amp; merch
            </h2>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Pochette */}
              <div className="flex items-center justify-center">
                <div
                  className="h-80 w-80 overflow-hidden rounded-2xl md:h-[440px] md:w-[440px]"
                  style={{ boxShadow: "0 30px 80px rgba(90,20,40,0.5)" }}
                >
                  <img
                    src={coverUrl}
                    alt={featured.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Produits */}
              <div className="flex flex-col justify-center space-y-4">
                {featured.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 rounded-xl border p-4 transition hover:border-[#D41920]/40"
                    style={{
                      borderColor: "rgba(90,32,64,0.2)",
                      background: "rgba(15,7,11,0.6)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-white">{product.name}</h3>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className="text-xs" style={{ color: "#9A7080" }}>
                              {categoryLabel(product.category)}
                            </span>
                            {product.is_limited && (
                              <span className="text-xs font-semibold" style={{ color: "#D41920" }}>
                                &Eacute;dition limit&eacute;e
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-lg font-bold text-white">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-1 text-sm" style={{ color: "#9A7080" }}>
                        {product.description}
                      </p>
                    </div>
                  </div>
                ))}

                <Link
                  href="/artists/fdy-phenomen/flamboyant"
                  className="mt-4 inline-block rounded-xl px-6 py-3 text-center font-bold text-white transition hover:opacity-90"
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
          BANDEAU VISUEL — La pochette en frise
          ============================================ */}
      <section className="relative h-64 overflow-hidden md:h-80">
        <img
          src={coverUrl}
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: "center 30%" }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background:
              "linear-gradient(to right, rgba(15,7,11,0.9), rgba(15,7,11,0.5), rgba(15,7,11,0.9))",
          }}
        >
          <blockquote className="max-w-3xl px-6 text-center text-xl font-light leading-relaxed text-white/80 md:text-3xl">
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
          {/* Fond pochette floutée subtile */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={coverUrl}
              alt=""
              className="h-full w-full scale-150 object-cover blur-[80px]"
              style={{ opacity: 0.08 }}
            />
          </div>

          <div className="relative mx-auto max-w-4xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Tracklist</h2>
              <span className="text-sm" style={{ color: "#9A7080" }}>
                {featured.tracklist.length} titres
              </span>
            </div>

            <div
              className="overflow-hidden rounded-xl border"
              style={{ borderColor: "rgba(90,32,64,0.15)", background: "rgba(15,7,11,0.7)" }}
            >
              {featured.tracklist.map((track, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-6 py-3.5 transition hover:bg-white/5"
                  style={{
                    borderBottom:
                      i !== featured.tracklist.length - 1
                        ? "1px solid rgba(90,32,64,0.1)"
                        : "none",
                  }}
                >
                  <span
                    className="w-8 text-right text-sm font-medium"
                    style={{ color: "rgba(212,25,32,0.5)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-white/70">{track}</span>
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
                  borderColor: "rgba(90,32,64,0.15)",
                  background: "rgba(25,12,18,0.8)",
                }}
              >
                <div className="mb-4 h-20 w-20 overflow-hidden rounded-full ring-2 ring-white/10 transition group-hover:ring-[#D41920]/50">
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
    </div>
  );
}
