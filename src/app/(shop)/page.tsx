import Link from "next/link";
import { getFeaturedProject, getArtists } from "@/lib/supabase-data";
import { formatPrice, categoryLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await getFeaturedProject();
  const artists = await getArtists();

  return (
    <div>
      {/* Hero — Thématique Flamboyant : feu, flammes, or */}
      <section className="relative overflow-hidden bg-black px-4 py-24">
        {/* Fond flammes */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-orange-600/30 via-red-900/20 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />

        <div className="relative mx-auto max-w-7xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white md:text-7xl">
            SHOP<span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">TAZIK</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-orange-100/60">
            La boutique du rap francophone. Vinyles, CD, K7 et merchandising
            officiel de tes artistes préférés.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/artists/fdy-phenomen/flamboyant"
              className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-semibold text-black shadow-lg shadow-orange-500/25 transition hover:from-amber-400 hover:to-orange-400"
            >
              Découvrir Flamboyant
            </Link>
            <Link
              href="/artists/fdy-phenomen"
              className="rounded-lg border border-orange-500/30 px-6 py-3 font-semibold text-orange-200 transition hover:border-orange-400/60 hover:text-white"
            >
              Tous les projets
            </Link>
          </div>
        </div>
      </section>

      {/* Album du moment — Flamboyant */}
      {featured && (
        <section className="relative mx-auto max-w-7xl px-4 py-16">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
            <h2 className="text-sm font-semibold uppercase tracking-widest bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Album du moment
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-orange-950/30">
            <div className="grid md:grid-cols-2">
              {/* Pochette Flamboyant */}
              <div className="relative flex items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-orange-950/40 p-12">
                {/* Lueur derrière la pochette */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-72 w-72 rounded-full bg-orange-500/10 blur-3xl md:h-96 md:w-96" />
                </div>
                <div className="relative">
                  <div className="h-64 w-64 overflow-hidden rounded-xl shadow-2xl shadow-orange-500/20 ring-1 ring-orange-500/20 md:h-80 md:w-80">
                    <img
                      src={featured.cover_url}
                      alt={featured.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-3 -right-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1.5 text-xs font-bold text-black shadow-lg shadow-orange-500/30">
                    FLAMBOYANT
                  </div>
                </div>
              </div>

              {/* Infos */}
              <div className="flex flex-col justify-center p-8 md:p-12">
                <p className="text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  {featured.artist.name}
                </p>
                <h3 className="mt-2 text-3xl font-bold text-white md:text-4xl">
                  {featured.title}
                </h3>
                <p className="mt-4 leading-relaxed text-zinc-400">
                  {featured.description}
                </p>

                {/* Produits disponibles */}
                <div className="mt-6 space-y-3">
                  {featured.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-lg border border-orange-500/15 bg-orange-950/20 px-4 py-3 transition hover:border-orange-500/30"
                    >
                      <div>
                        <span className="text-sm font-medium text-white">
                          {categoryLabel(product.category)}
                        </span>
                        {product.is_limited && (
                          <span className="ml-2 text-xs text-orange-400">
                            Edition limitée
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-orange-300">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/artists/${featured.artist.slug}/${featured.slug}`}
                  className="mt-6 inline-block rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-center font-semibold text-black shadow-lg shadow-orange-500/25 transition hover:from-amber-400 hover:to-orange-400"
                >
                  Voir le projet Flamboyant
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Citation / Accroche Flamboyant */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-600/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <blockquote className="text-2xl font-light italic text-zinc-400 md:text-3xl">
            &laquo; Un album ambitieux où Fdy Phenomen déploie tout son talent
            d&apos;écriture sur des productions riches et variées.
            Un projet <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text font-semibold not-italic text-transparent">flamboyant</span>,
            à la hauteur de son nom. &raquo;
          </blockquote>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-500/50" />
            <span className="text-sm font-semibold uppercase tracking-wider text-orange-400">
              10 titres
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-500/50" />
          </div>
        </div>
      </section>

      {/* Nos artistes */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold text-white">Nos artistes</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {artists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artists/${artist.slug}`}
              className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-orange-500/40"
            >
              <div className="mb-4 h-20 w-20 overflow-hidden rounded-full bg-zinc-800 ring-2 ring-zinc-700 transition group-hover:ring-orange-500/50">
                <img
                  src={artist.image_url}
                  alt={artist.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white transition group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-orange-400 group-hover:bg-clip-text group-hover:text-transparent">
                {artist.name}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-zinc-400">
                {artist.bio}
              </p>
              <p className="mt-4 text-sm font-medium text-orange-400">
                Voir la discographie &rarr;
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
