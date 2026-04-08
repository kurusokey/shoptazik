#!/usr/bin/env node
// ============================================
// MUG Marketing Agent — Setup (initialisation DB)
// Crée les tables Supabase + bucket Storage
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

async function setup() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("❌ NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis dans .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key);
  console.log("🔌 Connecté à Supabase:", url);

  // 1. Lire et exécuter le SQL
  const sqlPath = path.join(path.dirname(new URL(import.meta.url).pathname), "setup.sql");
  const sql = fs.readFileSync(sqlPath, "utf-8");

  // Découper en statements individuels
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  console.log(`\n📦 Exécution de ${statements.length} statements SQL...\n`);

  let success = 0;
  let skipped = 0;
  let errors = 0;

  for (const stmt of statements) {
    const preview = stmt.split("\n")[0].slice(0, 60);
    try {
      const { error } = await supabase.rpc("exec_sql", { sql: stmt + ";" });
      if (error) {
        // "already exists" = table/index déjà créée, on skip
        if (error.message.includes("already exists")) {
          console.log(`  ⏭️  ${preview}... (déjà existant)`);
          skipped++;
        } else {
          console.log(`  ❌ ${preview}...`);
          console.log(`     ${error.message}`);
          errors++;
        }
      } else {
        console.log(`  ✅ ${preview}...`);
        success++;
      }
    } catch (err) {
      // Si exec_sql n'existe pas, on tente via pg directement
      console.log(`  ⚠️  ${preview}... (exec_sql non disponible)`);
      errors++;
    }
  }

  // 2. Créer le bucket Storage
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

  // 3. Résumé
  console.log("\n" + "─".repeat(50));
  console.log(`✅ ${success} créé(s) | ⏭️  ${skipped} existant(s) | ❌ ${errors} erreur(s)`);

  if (errors > 0) {
    console.log(`
⚠️  Certains statements ont échoué. C'est probablement parce que
   la fonction exec_sql n'existe pas sur ton projet Supabase.

   Solution : copie le contenu de setup.sql et exécute-le
   directement dans le SQL Editor de Supabase Dashboard :
   ${url.replace(".supabase.co", ".supabase.co")}/project/default/sql
`);
  }

  console.log("\n🎤 Setup terminé. Lance 'npm run marketing' pour démarrer l'agent.\n");
}

setup().catch(console.error);
