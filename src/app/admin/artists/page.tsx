"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Artist, Project } from "@/types";

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [artistsRes, projectsRes] = await Promise.all([
          fetch("/api/admin/artists"),
          fetch("/api/admin/projects"),
        ]);
        const artistsData = await artistsRes.json();
        const projectsData = await projectsRes.json();
        setArtists(artistsData);
        setProjects(projectsData);
      } catch (error) {
        console.error("Erreur chargement:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function getProjectCount(artistId: string): number {
    return projects.filter((p) => p.artist_id === artistId).length;
  }

  function handleDelete(artist: Artist) {
    setDeleteMessage(
      `Suppression de "${artist.name}" — fonctionnalite disponible apres connexion a Supabase.`
    );
    setTimeout(() => setDeleteMessage(null), 3000);
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
          <h1 className="text-2xl font-bold text-white">Artistes</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {artists.length} artiste{artists.length > 1 ? "s" : ""} enregistre{artists.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/artists/new"
          className="rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-medium text-black transition hover:bg-amber-300"
        >
          + Ajouter un artiste
        </Link>
      </div>

      {/* Toast */}
      {deleteMessage && (
        <div className="mb-4 rounded-lg border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-400">
          {deleteMessage}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                Slug
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-zinc-400">
                Projets
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {artists.map((artist) => (
              <tr key={artist.id} className="transition hover:bg-zinc-800/50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-zinc-800">
                      {artist.image_url ? (
                        <Image src={artist.image_url} alt={artist.name} fill={true} className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-zinc-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-white">{artist.name}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <code className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-400">
                    {artist.slug}
                  </code>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  <span className="inline-flex items-center rounded-full bg-blue-400/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                    {getProjectCount(artist.id)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                      onClick={() =>
                        alert("Edition — disponible apres connexion a Supabase")
                      }
                    >
                      Modifier
                    </button>
                    <button
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-400/10"
                      onClick={() => handleDelete(artist)}
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {artists.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="mb-3 h-12 w-12 text-zinc-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <p className="text-sm text-zinc-500">Aucun artiste pour le moment</p>
            <Link href="/admin/artists/new" className="mt-3 text-sm text-amber-400 hover:underline">
              Ajouter votre premier artiste
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
