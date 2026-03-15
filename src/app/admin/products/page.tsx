"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Project, Product } from "@/types";

export default function AdminProductsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsRes, productsRes] = await Promise.all([
          fetch("/api/admin/projects"),
          fetch("/api/admin/products"),
        ]);
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

  function getProjectTitle(projectId: string): string {
    return projects.find((p) => p.id === projectId)?.title ?? "Inconnu";
  }

  function formatPrice(cents: number): string {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);
  }

  function categoryLabel(category: string): string {
    const labels: Record<string, string> = {
      vinyle: "Vinyle",
      cd: "CD",
      k7: "K7",
      tshirt: "T-shirt",
      hoodie: "Hoodie",
      poster: "Poster",
      other: "Autre",
    };
    return labels[category] ?? category;
  }

  function categoryBadgeColor(category: string): string {
    const colors: Record<string, string> = {
      vinyle: "bg-amber-400/10 text-amber-400",
      cd: "bg-blue-400/10 text-blue-400",
      k7: "bg-purple-400/10 text-purple-400",
      tshirt: "bg-emerald-400/10 text-emerald-400",
      hoodie: "bg-pink-400/10 text-pink-400",
      poster: "bg-orange-400/10 text-orange-400",
      other: "bg-zinc-700 text-zinc-300",
    };
    return colors[category] ?? "bg-zinc-700 text-zinc-300";
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
          <h1 className="text-2xl font-bold text-white">Produits</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {products.length} produit{products.length > 1 ? "s" : ""} enregistre{products.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-400"
        >
          + Ajouter un produit
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Projet
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Categorie
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Prix
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Stock
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Limite
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {products.map((product) => (
                <tr key={product.id} className="transition hover:bg-zinc-800/50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="max-w-[200px] truncate font-medium text-white">
                          {product.name}
                        </p>
                        <p className="text-xs text-zinc-500">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-300">
                    {getProjectTitle(product.project_id)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryBadgeColor(product.category)}`}
                    >
                      {categoryLabel(product.category)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-white">
                    {formatPrice(product.price)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <span
                      className={`text-sm font-medium ${
                        product.stock <= 10 ? "text-red-400" : product.stock <= 50 ? "text-amber-400" : "text-emerald-400"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    {product.is_limited ? (
                      <span className="inline-flex items-center rounded-full bg-amber-400/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                        Oui
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-500">Non</span>
                    )}
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

        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="mb-3 h-12 w-12 text-zinc-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
            <p className="text-sm text-zinc-500">Aucun produit pour le moment</p>
            <Link href="/admin/products/new" className="mt-3 text-sm text-emerald-400 hover:underline">
              Ajouter votre premier produit
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
