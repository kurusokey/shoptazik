import { supabase } from "./supabase";
import type { Artist, Project, Product, ProductVariant } from "@/types";

// ============================================
// Fonctions d'accès aux données via Supabase
// Activées quand NEXT_PUBLIC_SUPABASE_URL est défini
// ============================================

export async function getArtists(): Promise<Artist[]> {
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getArtistBySlug(
  slug: string
): Promise<Artist | null> {
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

export async function getProjectsByArtist(
  artistId: string
): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("artist_id", artistId)
    .order("release_year", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getProjectBySlug(
  artistSlug: string,
  projectSlug: string
): Promise<(Project & { artist: Artist }) | null> {
  const artist = await getArtistBySlug(artistSlug);
  if (!artist) return null;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("artist_id", artist.id)
    .eq("slug", projectSlug)
    .single();
  if (error) return null;
  return { ...data, artist };
}

export async function getProductsByProject(
  projectId: string
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("project_id", projectId)
    .order("price");
  if (error) throw error;
  return data ?? [];
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

export async function getVariantsByProduct(
  productId: string
): Promise<ProductVariant[]> {
  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId);
  if (error) throw error;
  return data ?? [];
}

export async function getChildProjects(
  parentProjectId: string
): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("parent_project_id", parentProjectId)
    .order("title");
  if (error) throw error;
  return data ?? [];
}

export async function getFeaturedProject(): Promise<
  (Project & { artist: Artist; products: Product[] }) | null
> {
  // Projet mis en avant : Flamboyant
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", "flamboyant")
    .single();
  if (error || !project) return null;

  const { data: artist } = await supabase
    .from("artists")
    .select("*")
    .eq("id", project.artist_id)
    .single();
  if (!artist) return null;

  const products = await getProductsByProject(project.id);
  return { ...project, artist, products };
}

// ============================================
// Admin CRUD
// ============================================

export async function createArtist(
  artist: Omit<Artist, "id" | "created_at">
): Promise<Artist> {
  const { data, error } = await supabase
    .from("artists")
    .insert(artist)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateArtist(
  id: string,
  updates: Partial<Artist>
): Promise<Artist> {
  const { data, error } = await supabase
    .from("artists")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteArtist(id: string): Promise<void> {
  const { error } = await supabase.from("artists").delete().eq("id", id);
  if (error) throw error;
}

export async function createProject(
  project: Omit<Project, "id" | "created_at">
): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .insert(project)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProject(
  id: string,
  updates: Partial<Project>
): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function createProduct(
  product: Omit<Product, "id" | "created_at">
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}
