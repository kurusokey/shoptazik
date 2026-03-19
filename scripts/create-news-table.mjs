/**
 * Script to seed the "news" table in Supabase.
 * The table must be created first via the Supabase Dashboard SQL editor.
 *
 * Usage:
 *   node scripts/create-news-table.mjs
 *
 * Requires pg module (already in node_modules) and direct DB access.
 *
 * SQL used to create the table:
 *
 *   CREATE TABLE IF NOT EXISTS news (
 *     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *     title TEXT NOT NULL,
 *     description TEXT NOT NULL DEFAULT '',
 *     type TEXT NOT NULL CHECK (type IN ('concert', 'sortie', 'atelier', 'evenement', 'autre')),
 *     date DATE,
 *     location TEXT,
 *     link TEXT,
 *     image_url TEXT,
 *     published BOOLEAN NOT NULL DEFAULT true,
 *     created_at TIMESTAMPTZ DEFAULT now()
 *   );
 *
 *   ALTER TABLE news ENABLE ROW LEVEL SECURITY;
 *   CREATE POLICY "public_read_news" ON news FOR SELECT USING (published = true);
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

async function run() {
  console.log("Seeding news table...");

  const { error } = await supabase.from("news").insert([
    {
      title: "Session de vente — Gardenz",
      description: "Retrouvez les vinyles Chanteur de Rap en vente à la boutique Gardenz.",
      type: "evenement",
      date: "2026-04-05",
      location: "Gardenz, Paris",
      link: "https://boutique.la-mug.com",
    },
    {
      title: "Session de vente — Le Lullaby",
      description: "Session de dédicace et vente de vinyles au Lullaby.",
      type: "evenement",
      date: "2026-04-12",
      location: "Le Lullaby, Paris",
      link: "https://boutique.la-mug.com",
    },
    {
      title: "Atelier Rap & Enregistrement",
      description: "Atelier d'écriture et enregistrement rap — ouvert aux collectivités.",
      type: "atelier",
      date: "2026-04-20",
      location: "Villepinte",
      link: "https://la-mug.com#contact",
    },
  ]);

  if (error) {
    console.error("Insert error:", error.message);
    process.exit(1);
  }

  console.log("Done! Seed data inserted.");

  const { data: all } = await supabase
    .from("news")
    .select("*")
    .order("date", { ascending: true });

  console.table(all);
}

run().catch(console.error);
