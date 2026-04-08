#!/usr/bin/env node
// ============================================
// MUG Marketing Agent — Setup (initialisation DB)
// Exécute le SQL via l'API SQL de Supabase
// Usage : npx tsx src/agents/marketing/setup.ts
// ============================================

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Charge .env.local
function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}
loadEnvFile();

// Exécuter du SQL via le header x-supabase-db-query (non standard)
// ou via un contournement : créer les tables une par une avec le client Supabase
async function createTablesViaRest(supabaseUrl: string, serviceKey: string) {
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)/)?.[1];
  if (!projectRef) throw new Error("Impossible d'extraire le project ref");

  // Lire le fichier SQL complet
  const sqlPath = path.join(path.dirname(new URL(import.meta.url).pathname), "setup.sql");
  const fullSql = fs.readFileSync(sqlPath, "utf-8");

  // Tenter via l'API SQL directe de Supabase (nécessite le service_role_key)
  // POST https://<project>.supabase.co/rest/v1/rpc avec un header spécial
  // OU exécuter tout le SQL en un seul bloc via pg_query

  // Méthode : POST le SQL entier via le endpoint non documenté mais fonctionnel
  const sqlApiUrl = `${supabaseUrl}/pg/query`;

  const res = await fetch(sqlApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
    },
    body: JSON.stringify({ query: fullSql }),
  });

  if (res.ok) {
    return { method: "pg_query", success: true };
  }

  // Fallback : tenter via le endpoint SQL standard
  const sqlApiUrl2 = `${supabaseUrl}/rest/v1/`;
  const res2 = await fetch(sqlApiUrl2, {
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
    },
  });

  // Si aucune méthode REST ne fonctionne, on crée les tables individuellement
  // via le client Supabase (en tentant un SELECT pour voir si elles existent)
  return { method: "manual", success: false };
}

async function setup() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("❌ NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis dans .env.local");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  console.log("🔌 Connecté à Supabase:", supabaseUrl);

  // 1. Tenter l'exécution SQL directe
  console.log("\n📦 Tentative d'exécution SQL directe...");
  const result = await createTablesViaRest(supabaseUrl, serviceKey);

  if (result.success) {
    console.log("  ✅ Toutes les tables créées via API SQL");
  } else {
    console.log("  ⚠️  API SQL non disponible — vérification table par table...\n");

    // Vérifier chaque table en faisant un SELECT
    const tables = [
      "marketing_posts",
      "newsletter_subscribers",
      "utm_links",
      "content_library",
      "stats_snapshots",
      "api_costs",
      "instagram_comments",
    ];

    const existing: string[] = [];
    const missing: string[] = [];

    for (const table of tables) {
      const { error } = await supabase.from(table).select("id").limit(1);
      if (error?.code === "42P01" || error?.message?.includes("does not exist")) {
        missing.push(table);
        console.log(`  ❌ ${table} — n'existe pas`);
      } else {
        existing.push(table);
        console.log(`  ✅ ${table} — existe`);
      }
    }

    if (missing.length > 0) {
      console.log(`\n⚠️  ${missing.length} table(s) manquante(s) : ${missing.join(", ")}`);
      console.log(`\n📋 Copie le SQL ci-dessous et exécute-le dans le SQL Editor Supabase :`);
      console.log(`   ${supabaseUrl.replace("https://", "https://supabase.com/dashboard/project/").replace(".supabase.co", "/sql/new")}`);
      console.log(`\n   Ou ouvre directement : setup.sql dans src/agents/marketing/\n`);

      // Afficher le SQL pour les tables manquantes
      const sqlPath = path.join(path.dirname(new URL(import.meta.url).pathname), "setup.sql");
      const fullSql = fs.readFileSync(sqlPath, "utf-8");
      console.log("─".repeat(60));
      console.log(fullSql);
      console.log("─".repeat(60));
    } else {
      console.log(`\n✅ Toutes les ${tables.length} tables existent !`);
    }
  }

  // 2. Bucket Storage
  console.log("\n📁 Configuration Storage...");
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketName = "marketing-images";

  if (buckets?.find((b) => b.name === bucketName)) {
    console.log(`  ⏭️  Bucket "${bucketName}" déjà existant`);
  } else {
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 10485760,
    });
    if (error) {
      console.log(`  ❌ Bucket: ${error.message}`);
    } else {
      console.log(`  ✅ Bucket "${bucketName}" créé (public, 10MB max)`);
    }
  }

  console.log("\n🎤 Setup terminé.\n");
}

setup().catch(console.error);
