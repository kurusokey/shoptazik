#!/usr/bin/env node
// ============================================
// MUG Marketing Agent — Mode Cron automatique
// Se lance via GitHub Actions ou cron local
// Génère et programme le contenu de la semaine
// ============================================

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { ALL_TOOLS } from "./tools.js";
import { SYSTEM_PROMPT } from "./prompts.js";

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
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}
loadEnvFile();

// ---- Tâches cron disponibles ----

interface CronTask {
  name: string;
  description: string;
  prompt: string;
}

const CRON_TASKS: Record<string, CronTask> = {
  "weekly-content": {
    name: "Contenu hebdomadaire",
    description: "Génère et programme le contenu de la semaine à venir",
    prompt: `Tu es en mode automatique (cron hebdomadaire). Aujourd'hui c'est ${new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.

Exécute ces étapes dans l'ordre :

1. Appelle get_brand_info pour charger le contexte marque
2. Appelle buffer_list_channels pour vérifier les chaînes connectées
3. Si des chaînes sont connectées :
   a. Génère 4 posts pour la semaine (lun, mer, ven, dim) avec generate_image pour chaque visuel
   b. Programme-les via buffer_schedule_batch aux horaires optimaux (12h et 18h Europe/Paris)
   c. Sauvegarde le calendrier éditorial avec save_calendar
4. Si aucune chaîne connectée :
   a. Génère les 4 posts et sauvegarde-les en fichiers markdown
   b. Génère les visuels et sauvegarde-les localement
5. Affiche la progression avec get_progress

Assure-toi que chaque post :
- A un texte unique et engageant
- Inclut les hashtags permanents + contextuels
- Pointe vers un des 3 sites du triptyque
- A un visuel généré par DALL-E
- Est adapté à la plateforme cible`,
  },

  "daily-story": {
    name: "Story quotidienne",
    description: "Génère une story Instagram/TikTok pour aujourd'hui",
    prompt: `Tu es en mode automatique (cron quotidien). Aujourd'hui c'est ${new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.

1. Appelle get_brand_info
2. Génère un visuel story (1024x1792) avec generate_image sur un thème pertinent (citation hip-hop, teaser album, rappel événement, produit boutique)
3. Rédige le texte de la story
4. Si Buffer est connecté (buffer_list_channels), programme la story pour 18h aujourd'hui
5. Sinon, sauvegarde en fichier markdown`,
  },

  "monthly-report": {
    name: "Rapport mensuel",
    description: "Analyse les performances du mois et ajuste la stratégie",
    prompt: `Tu es en mode automatique (cron mensuel). Aujourd'hui c'est ${new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.

1. Appelle get_brand_info
2. Appelle buffer_get_sent_posts pour récupérer les posts publiés ce mois
3. Analyse les performances (quels contenus ont le mieux marché)
4. Génère un rapport de performance avec des recommandations
5. Sauvegarde le rapport dans marketing-output/
6. Propose un calendrier éditorial ajusté pour le mois suivant
7. Affiche la progression globale`,
  },

  "influencer-outreach": {
    name: "Prospection influenceurs",
    description: "Génère les messages de prospection micro-influenceurs",
    prompt: `Tu es en mode automatique (cron prospection).

1. Appelle get_brand_info
2. Génère 3 messages de prospection personnalisables pour :
   - 1 collectionneur vinyle (Instagram)
   - 1 blogueur/vidéaste rap français (YouTube)
   - 1 compte culture hip-hop (TikTok)
3. Sauvegarde chaque message avec save_influencer_draft
4. Affiche la progression`,
  },
};

// ---- Exécution ----

async function runCronTask(taskKey: string) {
  const task = CRON_TASKS[taskKey];
  if (!task) {
    console.error(`❌ Tâche inconnue : ${taskKey}`);
    console.error(`Tâches disponibles : ${Object.keys(CRON_TASKS).join(", ")}`);
    process.exit(1);
  }

  console.log(`\n🤖 MUG Agent Cron — ${task.name}`);
  console.log(`📅 ${new Date().toISOString()}`);
  console.log("─".repeat(50));

  const client = new Anthropic();

  try {
    const finalMessage = await client.beta.messages.toolRunner({
      model: "claude-sonnet-4-6",
      max_tokens: 16384,
      system: SYSTEM_PROMPT,
      tools: ALL_TOOLS,
      messages: [{ role: "user", content: task.prompt }],
    });

    // Extraire le texte
    const textBlocks = finalMessage.content.filter(
      (b): b is Anthropic.Beta.BetaTextBlock => b.type === "text"
    );
    const output = textBlocks.map((b) => b.text).join("\n");

    console.log(output);

    // Sauvegarder le log
    const logDir = path.join(process.cwd(), "marketing-output", "logs");
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

    const logFile = path.join(
      logDir,
      `${taskKey}-${new Date().toISOString().split("T")[0]}.log`
    );
    fs.writeFileSync(
      logFile,
      `# ${task.name}\n# ${new Date().toISOString()}\n\n${output}\n`,
      "utf-8"
    );

    console.log(`\n📝 Log sauvegardé : ${logFile}`);
    console.log("─".repeat(50));
    console.log("✅ Tâche terminée.\n");
  } catch (error) {
    console.error(`\n❌ Erreur: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// ---- CLI ----

const taskKey = process.argv[2];

if (!taskKey || taskKey === "--help") {
  console.log(`
🤖 MUG Marketing Agent — Mode Cron

Usage : npx tsx src/agents/marketing/cron.ts <tâche>

Tâches disponibles :
${Object.entries(CRON_TASKS)
  .map(([key, task]) => `  ${key.padEnd(22)} ${task.description}`)
  .join("\n")}

Exemples :
  npx tsx src/agents/marketing/cron.ts weekly-content
  npx tsx src/agents/marketing/cron.ts daily-story
  npx tsx src/agents/marketing/cron.ts monthly-report

GitHub Actions : voir .github/workflows/marketing-cron.yml
  `);
  process.exit(0);
}

runCronTask(taskKey);
