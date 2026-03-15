import { notFound } from "next/navigation";
import { getArtistBySlug, getProjectsByArtist } from "@/lib/supabase-data";
import ProjectCard from "@/components/ui/ProjectCard";

interface ArtistPageProps {
  params: Promise<{ artistSlug: string }>;
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { artistSlug } = await params;
  const artist = await getArtistBySlug(artistSlug);

  if (!artist) return notFound();

  const projects = await getProjectsByArtist(artist.id);

  return (
    <div>
      {/* Banner artiste */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-950 px-4 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            {/* Photo artiste */}
            <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full bg-zinc-700 md:h-40 md:w-40">
              <img
                src={artist.image_url}
                alt={artist.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="text-center md:text-left">
              <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                Artiste
              </p>
              <h1 className="mt-1 text-4xl font-bold text-white md:text-5xl">
                {artist.name}
              </h1>
              <p className="mt-4 max-w-2xl text-zinc-400">{artist.bio}</p>
              <div className="mt-4 flex justify-center gap-4 text-sm text-zinc-500 md:justify-start">
                <span>
                  {projects.length} projet{projects.length > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discographie */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-8 text-2xl font-bold text-white">Discographie</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              artistSlug={artist.slug}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
