import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Client Supabase côté navigateur
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Pour le MVP, les données viennent de src/lib/data.ts (local).
// Quand Supabase sera configuré, remplacer les appels dans data.ts
// par des requêtes supabase.from("table").select("*") etc.
