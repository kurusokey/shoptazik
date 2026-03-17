import Link from "next/link";
import Image from "next/image";
import { getArtists, getProjectsByArtist, getProductsByProject } from "@/lib/supabase-data";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q ?? "").toLowerCase().trim();

  if (!query) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center" style={{ background: "#1A1610" }}>
        <h1 className="text-2xl font-bold text-white">Recherche</h1>
        <p className="mt-4 text-white/40">Saisis un terme de recherche dans la barre du menu.</p>
      </div>
    );
  }

  const artists = await getArtists();
  const results: { type: string; title: string; subtitle: string; href: string; image?: string }[] = [];

  for (const artist of artists) {
    if (artist.name.toLowerCase().includes(query)) {
      results.push({ type: "Artiste", title: artist.name, subtitle: artist.bio.slice(0, 100) + "...", href: `/artists/${artist.slug}`, image: artist.image_url });
    }

    const projects = await getProjectsByArtist(artist.id);
    for (const project of projects) {
      if (project.title.toLowerCase().includes(query) || project.description.toLowerCase().includes(query)) {
        results.push({ type: project.type.charAt(0).toUpperCase() + project.type.slice(1), title: project.title, subtitle: `${artist.name} — ${project.release_year}`, href: `/artists/${artist.slug}/${project.slug}`, image: project.cover_url });
      }

      // Chercher dans les titres de la tracklist
      for (const track of project.tracklist) {
        if (track.toLowerCase().includes(query)) {
          results.push({ type: "Titre", title: track, subtitle: `${project.title} — ${artist.name}`, href: `/artists/${artist.slug}/${project.slug}`, image: project.cover_url });
        }
      }

      const products = await getProductsByProject(project.id);
      for (const product of products) {
        if (product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query)) {
          results.push({ type: "Produit", title: product.name, subtitle: `${(product.price / 100).toFixed(2)} €`, href: `/artists/${artist.slug}/${project.slug}`, image: product.image_url });
        }
      }
    }
  }

  // Dédupliquer par titre+href
  const seen = new Set<string>();
  const unique = results.filter((r) => {
    const key = `${r.title}|${r.href}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div style={{ background: "#1A1610", minHeight: "80vh" }}>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-bold text-white">
          Résultats pour &laquo;&nbsp;{q}&nbsp;&raquo;
        </h1>
        <p className="mt-2 text-sm text-white/40">{unique.length} résultat{unique.length !== 1 ? "s" : ""}</p>

        {unique.length === 0 ? (
          <p className="mt-8 text-center text-white/40">Aucun résultat trouvé.</p>
        ) : (
          <div className="mt-8 space-y-3">
            {unique.map((r, i) => (
              <Link
                key={i}
                href={r.href}
                className="flex items-center gap-4 rounded-xl border p-4 transition hover:border-white/15"
                style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(200,160,80,0.04)" }}
              >
                {r.image && (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                    <Image src={r.image} alt="" fill={true} className="object-cover" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 rounded-full px-2 py-0.5 text-xs" style={{ background: "rgba(200,160,80,0.1)", color: "rgba(200,160,80,0.6)" }}>
                      {r.type}
                    </span>
                    <h3 className="truncate font-semibold text-white">{r.title}</h3>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-white/40">{r.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
