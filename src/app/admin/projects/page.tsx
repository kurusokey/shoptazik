"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Artist, Project, Product } from "@/types";

export default function AdminProjectsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [artistsRes, projectsRes, productsRes] = await Promise.all([
          fetch("/api/admin/artists"),
          fetch("/api/admin/projects"),
          fetch("/api/admin/products"),
        ]);
        setArtists(await artistsRes.json());
        setProjects(await projectsRes.json());
        setProducts(await productsRes.json());
      } catch (error) {
        console.error("Erreur chargement:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function getArtistName(artistId: string): string {
    return artists.find((a) => a.id === artistId)?.name ?? "Inconnu";
  }

  function getProductCount(projectId: string): number {
    return products.filter((p) => p.project_id === projectId).length;
  }

  function typeLabel(type: string): string {
    const labels: Record<string, string> = {
      album: "Album",
      ep: "EP",
      mixtape: "Mixtape",
      single: "Single",
    };
    return labels[type] ?? type;
  }

  function typeBadgeColor(type: string): string {
    const colors: Record<string, string> = {
      album: "bg-amber-400/10 text-amber-400",
      ep: "bg-blue-400/10 text-blue-400",
      mixtape: "bg-purple-400/10 text-purple-400",
      single: "bg-emerald-400/10 text-emerald-400",
    };
    return colors[type] ?? "bg-zinc-700 text-zinc-300";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-amber-400" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projets</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {projects.length} projet{projects.length > 1 ? "s" : ""} enregistre{projects.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400"
        >
          + Ajouter un projet
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Artiste
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Type
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Annee
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Produits
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {projects.map((project) => (
                <tr key={project.id} className="transition hover:bg-zinc-800/50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-zinc-800">
                        {project.cover_url ? (
                          <Image src={project.cover_url} alt={project.title} fill={true} className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-zinc-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{project.title}</p>
                        <p className="text-xs text-zinc-500">{project.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-300">
                    {getArtistName(project.artist_id)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadgeColor(project.type)}`}
                    >
                      {typeLabel(project.type)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-zinc-300">
                    {project.release_year}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <span className="inline-flex items-center rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                      {getProductCount(project.id)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <button
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                      onClick={() =>
                        alert("Edition — disponible apres connexion a Supabase")
                      }
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="mb-3 h-12 w-12 text-zinc-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
            </svg>
            <p className="text-sm text-zinc-500">Aucun projet pour le moment</p>
            <Link href="/admin/projects/new" className="mt-3 text-sm text-blue-400 hover:underline">
              Ajouter votre premier projet
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
