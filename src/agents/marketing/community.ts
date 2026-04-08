// ============================================
// Community Management
// Lecture commentaires Instagram (Meta Graph API)
// + Suggestions de réponses avec validation
// ============================================

import { z } from "zod";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { createClient } from "@supabase/supabase-js";
import readline from "readline";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Variables Supabase manquantes");
  return createClient(url, key);
}

// ---- Meta Graph API ----

async function metaGraphGet(endpoint: string): Promise<unknown> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) throw new Error("INSTAGRAM_ACCESS_TOKEN non défini. Configure un token Meta Graph API (long-lived page access token).");
  const url = `https://graph.facebook.com/v21.0${endpoint}${endpoint.includes("?") ? "&" : "?"}access_token=${token}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Meta API ${res.status}: ${JSON.stringify(err)}`);
  }
  return res.json();
}

// ============================================
// Outils Community Management
// ============================================

export const fetchInstagramComments = betaZodTool({
  name: "fetch_instagram_comments",
  description:
    "Récupère les commentaires récents sur les posts Instagram de La M.U.G via Meta Graph API. Les sauvegarde dans Supabase pour analyse. Nécessite INSTAGRAM_ACCESS_TOKEN.",
  inputSchema: z.object({
    ig_user_id: z
      .string()
      .describe("ID du compte Instagram Business (obtenu via Meta Graph API)"),
    limit: z.number().optional().describe("Nombre de posts récents à scanner (défaut: 5)"),
  }),
  run: async ({ ig_user_id, limit }) => {
    try {
      const supabase = getSupabase();
      const maxPosts = limit || 5;

      // 1. Récupérer les posts récents
      const mediaData = (await metaGraphGet(
        `/${ig_user_id}/media?fields=id,caption,timestamp,comments_count&limit=${maxPosts}`
      )) as { data: { id: string; caption: string; timestamp: string; comments_count: number }[] };

      if (!mediaData.data?.length) return "Aucun post trouvé sur ce compte Instagram.";

      let totalComments = 0;
      let newComments = 0;
      const results: string[] = [];

      // 2. Pour chaque post, récupérer les commentaires
      for (const media of mediaData.data) {
        if (!media.comments_count || media.comments_count === 0) continue;

        const commentsData = (await metaGraphGet(
          `/${media.id}/comments?fields=id,text,timestamp,username,like_count&limit=50`
        )) as {
          data: { id: string; text: string; timestamp: string; username: string; like_count: number }[];
        };

        for (const comment of commentsData.data || []) {
          totalComments++;

          // Vérifier si déjà en base
          const { data: existing } = await supabase
            .from("instagram_comments")
            .select("id")
            .eq("ig_comment_id", comment.id)
            .limit(1);

          if (existing && existing.length > 0) continue;

          // Analyse de sentiment basique
          const lower = comment.text.toLowerCase();
          let sentiment: "positive" | "negative" | "neutral" | "question" = "neutral";
          const posWords = ["bravo", "top", "super", "love", "bien", "genial", "fort", "respect", "fire"];
          const negWords = ["nul", "mauvais", "bof", "cher", "arnaque", "pourri"];
          if (comment.text.includes("?")) sentiment = "question";
          else if (posWords.some((w) => lower.includes(w))) sentiment = "positive";
          else if (negWords.some((w) => lower.includes(w))) sentiment = "negative";

          // Sauvegarder en base
          await supabase.from("instagram_comments").insert({
            ig_comment_id: comment.id,
            ig_media_id: media.id,
            username: comment.username,
            text_content: comment.text,
            timestamp: comment.timestamp,
            like_count: comment.like_count,
            sentiment,
          });
          newComments++;
        }

        const caption = media.caption?.slice(0, 50) || "(sans texte)";
        results.push(`- Post "${caption}..." : ${media.comments_count} commentaires`);
      }

      return [
        `## Commentaires Instagram récupérés\n`,
        `- ${mediaData.data.length} posts scannés`,
        `- ${totalComments} commentaires au total`,
        `- ${newComments} nouveaux enregistrés en base\n`,
        ...results,
      ].join("\n");
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

export const getUnrepliedComments = betaZodTool({
  name: "get_unreplied_comments",
  description:
    "Affiche les commentaires Instagram auxquels on n'a pas encore répondu, classés par priorité (questions d'abord, puis négatifs, puis positifs).",
  inputSchema: z.object({
    limit: z.number().optional().describe("Nombre max (défaut: 20)"),
  }),
  run: async ({ limit }) => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("instagram_comments")
        .select("*")
        .eq("replied", false)
        .order("timestamp", { ascending: false })
        .limit(limit || 20);

      if (error) return `Erreur: ${error.message}`;
      if (!data?.length) return "Tous les commentaires ont été traités.";

      // Trier par priorité : questions > négatifs > positifs > neutres
      const priority: Record<string, number> = { question: 0, negative: 1, positive: 2, neutral: 3 };
      data.sort((a, b) => (priority[a.sentiment] ?? 3) - (priority[b.sentiment] ?? 3));

      const emoji: Record<string, string> = { question: "❓", negative: "⚠️", positive: "💬", neutral: "💬" };

      const lines = data.map((c) => {
        const em = emoji[c.sentiment] || "💬";
        const date = new Date(c.timestamp).toLocaleDateString("fr-FR");
        return `${em} **@${c.username}** (${date}) [${c.sentiment}]\n   "${c.text_content}"\n   ID: ${c.id}`;
      });

      return `## ${data.length} commentaire(s) sans réponse\n\n${lines.join("\n\n")}`;
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

export const replyToComment = betaZodTool({
  name: "reply_to_comment",
  description:
    "Répond à un commentaire Instagram via Meta Graph API. VALIDATION OBLIGATOIRE avant envoi. Enregistre la réponse en base.",
  inputSchema: z.object({
    comment_db_id: z.string().describe("ID du commentaire dans Supabase (instagram_comments.id)"),
    reply_text: z.string().describe("Texte de la réponse proposée"),
  }),
  run: async ({ comment_db_id, reply_text }) => {
    try {
      const supabase = getSupabase();

      // Récupérer le commentaire
      const { data: comment, error } = await supabase
        .from("instagram_comments")
        .select("*")
        .eq("id", comment_db_id)
        .single();
      if (error || !comment) return "Commentaire introuvable.";

      // VALIDATION OBLIGATOIRE
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      const confirmed = await new Promise<boolean>((resolve) => {
        console.log("\n╔══════════════════════════════════════════════╗");
        console.log("║      VALIDATION RÉPONSE COMMENTAIRE          ║");
        console.log("╚══════════════════════════════════════════════╝\n");
        console.log(`💬 Commentaire de @${comment.username} :`);
        console.log(`   "${comment.text_content}"\n`);
        console.log(`📝 Réponse proposée :`);
        console.log(`   "${reply_text}"\n`);
        console.log("──────────────────────────────────────────────");
        rl.question("Répondre ? (oui/non) > ", (answer) => {
          rl.close();
          resolve(["oui", "o", "yes", "y"].includes(answer.trim().toLowerCase()));
        });
      });

      if (!confirmed) return "⛔ Réponse annulée.";

      // Envoyer via Meta Graph API
      try {
        await metaGraphGet(
          `/${comment.ig_comment_id}/replies?message=${encodeURIComponent(reply_text)}`
        );
      } catch (metaErr) {
        // Sauvegarder quand même la réponse en base même si l'API échoue
        await supabase
          .from("instagram_comments")
          .update({ replied: true, reply_text, replied_at: new Date().toISOString() })
          .eq("id", comment_db_id);

        return `⚠️ API Meta non accessible (${metaErr instanceof Error ? metaErr.message : "erreur"}). Réponse sauvegardée en base — poste-la manuellement sur Instagram.`;
      }

      // Marquer comme répondu
      await supabase
        .from("instagram_comments")
        .update({ replied: true, reply_text, replied_at: new Date().toISOString() })
        .eq("id", comment_db_id);

      return `✅ Réponse publiée à @${comment.username} et enregistrée en base.`;
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

export const COMMUNITY_TOOLS = [fetchInstagramComments, getUnrepliedComments, replyToComment];
