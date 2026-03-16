import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// Client Supabase côté serveur avec le service role (accès complet)
// Ne JAMAIS utiliser côté client
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
