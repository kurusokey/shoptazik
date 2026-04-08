#!/usr/bin/env node
// ============================================
// MUG Marketing Agent — CLI interactif
// Agent IA expert marketing digital La M.U.G
//
// Usage : npx tsx src/agents/marketing/index.ts
// ============================================

import Anthropic from "@anthropic-ai/sdk";
import readline from "readline";
import fs from "fs";
import path from "path";
import { ALL_TOOLS } from "./tools.js";
import { SYSTEM_PROMPT, WELCOME_MESSAGE } from "./prompts.js";

// Charge .env.local (tsx ne le fait pas automatiquement)
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

const client = new Anthropic();

// Historique de conversation
const messages: Anthropic.Beta.BetaMessageParam[] = [];

async function chat(userMessage: string): Promise<string> {
  messages.push({ role: "user", content: userMessage });

  // Utilise le tool runner qui gère la boucle agentique automatiquement
  const finalMessage = await client.beta.messages.toolRunner({
    model: "claude-sonnet-4-6",
    max_tokens: 16384,
    system: SYSTEM_PROMPT,
    tools: ALL_TOOLS,
    messages,
  });

  // Ajouter la réponse complète à l'historique
  messages.push({ role: "assistant", content: finalMessage.content });

  // Extraire le texte de la réponse
  const textBlocks = finalMessage.content.filter(
    (b): b is Anthropic.Beta.BetaTextBlock => b.type === "text"
  );

  return textBlocks.map((b) => b.text).join("\n");
}

async function chatStream(userMessage: string): Promise<string> {
  messages.push({ role: "user", content: userMessage });

  // Le tool runner en mode stream retourne un async iterable de message streams
  const runner = client.beta.messages.toolRunner({
    model: "claude-sonnet-4-6",
    max_tokens: 16384,
    system: SYSTEM_PROMPT,
    tools: ALL_TOOLS,
    messages,
    stream: true,
  });

  let fullText = "";
  let lastMessage: Anthropic.Beta.BetaMessage | undefined;

  // Boucle sur les itérations du tool runner (chaque itération = un appel API)
  for await (const messageStream of runner) {
    for await (const event of messageStream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        process.stdout.write(event.delta.text);
        fullText += event.delta.text;
      }
    }
    // Capturer le dernier message final de chaque itération
    lastMessage = await messageStream.finalMessage();
  }

  // Ajouter la dernière réponse complète à l'historique
  if (lastMessage) {
    messages.push({ role: "assistant", content: lastMessage.content });
  }

  return fullText;
}

async function main() {
  // Vérifier la clé API
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(
      "\n❌ ANTHROPIC_API_KEY non définie.\n" +
        "   export ANTHROPIC_API_KEY=sk-ant-...\n"
    );
    process.exit(1);
  }

  console.log(WELCOME_MESSAGE);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let closed = false;
  rl.on("close", () => {
    closed = true;
    console.log("\n✌️  À bientôt ! #LaMUG\n");
    process.exit(0);
  });

  const prompt = () => {
    if (closed) return;
    rl.question("\n🎤 MUG > ", async (input) => {
      const trimmed = input.trim();

      if (!trimmed) {
        prompt();
        return;
      }

      if (trimmed === "quit" || trimmed === "exit" || trimmed === "q") {
        console.log("\n✌️  À bientôt ! #LaMUG\n");
        rl.close();
        process.exit(0);
      }

      // Commandes raccourcies
      let message = trimmed;
      if (/^semaine\s*[1-4]$/i.test(trimmed)) {
        const week = trimmed.match(/[1-4]/)![0];
        message = `Génère tout le contenu de la semaine ${week} du plan marketing. Utilise d'abord get_brand_info pour charger le contexte, puis génère chaque élément et sauvegarde-le avec les outils appropriés. À la fin, affiche la progression.`;
      } else if (/^tout$/i.test(trimmed)) {
        message = `Génère le contenu complet des 4 semaines du plan marketing. Commence par la semaine 1, puis 2, 3, et 4. Pour chaque semaine, utilise get_brand_info, génère tous les contenus, sauvegarde-les, et affiche la progression à la fin.`;
      } else if (/^progression$/i.test(trimmed)) {
        message = `Affiche la progression globale du plan marketing avec get_progress.`;
      } else if (/^cha[iî]nes$/i.test(trimmed)) {
        message = `Liste toutes les chaînes connectées à Buffer avec buffer_list_channels.`;
      } else if (/^queue$/i.test(trimmed)) {
        message = `Affiche la queue de publication Buffer. Utilise d'abord buffer_list_channels pour obtenir l'org ID, puis buffer_get_queue.`;
      } else if (/^stats$/i.test(trimmed)) {
        message = `Affiche les posts publiés et leurs performances. Utilise d'abord buffer_list_channels pour l'org ID, puis buffer_get_sent_posts.`;
      } else if (/^publie\s+(.+)$/i.test(trimmed)) {
        const sujet = trimmed.match(/^publie\s+(.+)$/i)![1];
        message = `Génère un post sur le sujet "${sujet}" et publie-le immédiatement sur toutes les chaînes Buffer connectées. Utilise d'abord get_brand_info et buffer_list_channels, puis buffer_publish_post avec publish_now: true.`;
      } else if (/^image\s+(.+)$/i.test(trimmed)) {
        const sujet = trimmed.match(/^image\s+(.+)$/i)![1];
        message = `Génère une image pour les réseaux sociaux sur le thème "${sujet}". Utilise get_brand_info pour la palette, puis generate_image avec un prompt DALL-E détaillé en anglais. Génère au format 1024x1024 (post carré).`;
      } else if (/^images$/i.test(trimmed)) {
        message = `Liste toutes les images déjà générées avec list_generated_images.`;
      } else if (/^analyse$/i.test(trimmed)) {
        message = `Analyse les performances des posts publiés avec analyze_performance. Affiche le rapport complet.`;
      } else if (/^conseils$/i.test(trimmed)) {
        message = `Donne des recommandations basées sur les données de performance avec get_best_practices.`;
      }

      try {
        console.log("\n" + "─".repeat(60));
        await chatStream(message);
        console.log("\n" + "─".repeat(60));
      } catch (error) {
        if (error instanceof Anthropic.RateLimitError) {
          console.error("\n⚠️  Rate limit atteint. Attends quelques secondes et réessaie.");
        } else if (error instanceof Anthropic.AuthenticationError) {
          console.error("\n❌ Clé API invalide. Vérifie ANTHROPIC_API_KEY.");
          process.exit(1);
        } else if (error instanceof Anthropic.APIError) {
          console.error(`\n❌ Erreur API (${error.status}): ${error.message}`);
        } else {
          console.error("\n❌ Erreur:", error);
        }
      }

      prompt();
    });
  };

  prompt();
}

main().catch(console.error);
