import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getProductsByProject,
  getChildProjects,
} from "@/lib/supabase-data";
import ProductCard from "@/components/ui/ProductCard";
import { projectTypeLabel } from "@/lib/utils";
import Link from "next/link";

interface ProjectPageProps {
  params: Promise<{ artistSlug: string; projectSlug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { artistSlug, projectSlug } = await params;
  const project = await getProjectBySlug(artistSlug, projectSlug);

  if (!project) return notFound();

  const products = await getProductsByProject(project.id);
  const singles = await getChildProjects(project.id);

  return (
    <div>
      {/* En-tête du projet */}
      <section className="bg-gradient-to-b from-zinc-800 to-zinc-950 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="transition hover:text-zinc-300">
              Accueil
            </Link>
            <span>/</span>
            <Link
              href={`/artists/${artistSlug}`}
              className="transition hover:text-zinc-300"
            >
              {project.artist.name}
            </Link>
            <span>/</span>
            <span className="text-zinc-300">{project.title}</span>
          </nav>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Pochette */}
            <div className="flex items-center justify-center">
              <div className="h-72 w-72 overflow-hidden rounded-xl shadow-2xl md:h-96 md:w-96">
                <img
                  src={project.cover_url}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Infos projet */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-zinc-700 px-3 py-1 text-xs font-semibold text-zinc-300">
                  {projectTypeLabel(project.type)}
                </span>
                <span className="text-sm text-zinc-500">
                  {project.release_year}
                </span>
              </div>

              <Link
                href={`/artists/${artistSlug}`}
                className="mt-3 text-sm font-semibold text-amber-400 transition hover:text-amber-300"
              >
                {project.artist.name}
              </Link>

              <h1 className="mt-1 text-3xl font-bold text-white md:text-4xl">
                {project.title}
              </h1>

              <p className="mt-4 leading-relaxed text-zinc-400">
                {project.description}
              </p>

              <div className="mt-6 text-sm text-zinc-500">
                {project.tracklist.length} titres
                {singles.length > 0 && (
                  <span>
                    {" "}
                    &middot; {singles.length} single
                    {singles.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Singles extraits de l'album */}
      {singles.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="mb-6 text-xl font-bold text-white">
            Singles extraits de l&apos;album
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {singles.map((single) => (
              <Link
                key={single.id}
                href={`/artists/${artistSlug}/${single.slug}`}
                className="group flex gap-5 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-orange-500/40"
              >
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={single.cover_url}
                    alt={single.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="mb-1 inline-block w-fit rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-semibold text-orange-400">
                    Single
                  </span>
                  <h3 className="text-lg font-bold text-white transition group-hover:text-orange-400">
                    {single.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                    {single.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Tracklist */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-6 text-xl font-bold text-white">Tracklist</h2>
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          {project.tracklist.map((track, i) => {
            const isSingle = singles.some(
              (s) =>
                s.title.toLowerCase() === track.toLowerCase() ||
                track.toLowerCase().includes(s.title.toLowerCase())
            );
            return (
              <div
                key={i}
                className={`flex items-center gap-4 px-6 py-3 ${
                  i !== project.tracklist.length - 1
                    ? "border-b border-zinc-800"
                    : ""
                }`}
              >
                <span className="w-8 text-right text-sm text-zinc-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`text-sm ${
                    isSingle ? "font-medium text-orange-400" : "text-zinc-300"
                  }`}
                >
                  {track}
                </span>
                {isSingle && (
                  <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-xs text-orange-400">
                    Single
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Produits disponibles */}
      {products.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="mb-6 text-xl font-bold text-white">
            Acheter ce projet
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
