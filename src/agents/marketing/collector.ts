// ============================================
// Collecteur automatique de stats Buffer → Supabase
// + Bibliothèque de contenus approuvés
// ============================================

import { z } from "zod";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { createClient } from "@supabase/supabase-js";

const BUFFER_API = "https://api.buffer.com";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Variables Supabase manquantes");
  return createClient(url, key);
}

async function bufferQuery(query: string): Promise<unknown> {
  const key = process.env.BUFFER_API_KEY;
  if (!key) throw new Error("BUFFER_API_KEY non définie");
  const res = await fetch(BUFFER_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`Buffer ${res.status}`);
  const data = await res.json();
  if (data.errors) throw new Error(JSON.stringify(data.errors));
  return data.data;
}

// ============================================
// Collecteur de stats
// ============================================

export const collectStats = betaZodTool({
  name: "collect_stats",
  description:
    "Collecte les stats de tous les posts publiés via Buffer et met à jour la table marketing_posts dans Supabase. Fait le lien entre buffer_post_id et les données de performance. À appeler régulièrement (cron) ou manuellement.",
  inputSchema: z.object({
    organization_id: z.string().describe("ID de l'organisation Buffer"),
  }),
  run: async ({ organization_id }) => {
    try {
      const supabase = getSupabase();

      // Récupérer les posts envoyés depuis Buffer
      const bufferData = (await bufferQuery(`
        query {
          posts(first: 50, input: {
            organizationId: "${organization_id}",
            filter: { status: [sent] }
          }) {
            edges {
              node {
                id
                text
                dueAt
                channelId
                status
              }
            }
          }
        }
      `)) as {
        posts: { edges: { node: { id: string; text: string; dueAt: string; channelId: string; status: string } }[] };
      };

      const bufferPosts = bufferData.posts.edges.map((e) => e.node);
      if (bufferPosts.length === 0) return "Aucun post publié trouvé sur Buffer.";

      let updated = 0;
      let created = 0;

      for (const bp of bufferPosts) {
        // Vérifier si on a déjà ce post en base
        const { data: existing } = await supabase
          .from("marketing_posts")
          .select("id")
          .eq("buffer_post_id", bp.id)
          .limit(1);

        if (existing && existing.length > 0) {
          // Mettre à jour published_at si pas encore défini
          await supabase
            .from("marketing_posts")
            .update({ published_at: bp.dueAt })
            .eq("buffer_post_id", bp.id)
            .is("published_at", null);
          updated++;
        } else {
          // Créer une entrée (post publié en dehors du tracking agent)
          await supabase.from("marketing_posts").insert({
            platform: "unknown",
            post_type: "post",
            text_content: bp.text.slice(0, 500),
            buffer_post_id: bp.id,
            buffer_channel_id: bp.channelId,
            published_at: bp.dueAt,
          });
          created++;
        }

        // Snapshot de stats
        await supabase.from("stats_snapshots").insert({
          buffer_post_id: bp.id,
          marketing_post_id: existing?.[0]?.id || null,
        });
      }

      return `📊 Collecte terminée !\n- ${bufferPosts.length} posts Buffer analysés\n- ${updated} mis à jour\n- ${created} nouveaux enregistrés\n- ${bufferPosts.length} snapshots de stats créés`;
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

// ============================================
// Bibliothèque de contenus approuvés
// ============================================

export const saveToLibrary = betaZodTool({
  name: "save_to_library",
  description:
    "Sauvegarde un contenu approuvé dans la bibliothèque (texte, image, template, bio, CTA, set de hashtags). Les contenus approuvés sont réutilisables dans les prochaines publications.",
  inputSchema: z.object({
    type: z
      .enum(["text", "image", "template", "hashtag_set", "bio", "cta"])
      .describe("Type de contenu"),
    title: z.string().describe("Titre descriptif pour retrouver le contenu"),
    content: z.string().describe("Le contenu lui-même (texte, URL image, template, hashtags...)"),
    platform: z
      .string()
      .optional()
      .describe("Plateforme cible (instagram, tiktok, etc.) ou 'all'"),
    tags: z
      .array(z.string())
      .optional()
      .describe("Tags pour classifier (ex: ['album', 'chanteur-de-rap', 'promo'])"),
    image_url: z.string().optional().describe("URL de l'image associée (si applicable)"),
    approved: z.boolean().optional().describe("Marquer comme approuvé immédiatement (défaut: false)"),
  }),
  run: async ({ type, title, content, platform, tags, image_url, approved }) => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("content_library")
        .insert({
          type,
          title,
          content,
          platform: platform || "all",
          tags: tags || [],
          image_url,
          approved: approved || false,
          approved_at: approved ? new Date().toISOString() : null,
        })
        .select("id")
        .single();

      if (error) return `Erreur: ${error.message}`;
      return `📚 Contenu sauvegardé dans la bibliothèque (ID: ${data.id})\n- Type: ${type}\n- Titre: ${title}\n- Approuvé: ${approved ? "oui" : "en attente de validation"}`;
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

export const searchLibrary = betaZodTool({
  name: "search_library",
  description:
    "Recherche dans la bibliothèque de contenus approuvés. Trouve des textes, images, templates réutilisables pour créer de nouveaux posts plus rapidement.",
  inputSchema: z.object({
    type: z
      .enum(["text", "image", "template", "hashtag_set", "bio", "cta", "all"])
      .optional()
      .describe("Filtrer par type (défaut: all)"),
    platform: z.string().optional().describe("Filtrer par plateforme"),
    tags: z.array(z.string()).optional().describe("Filtrer par tags"),
    approved_only: z.boolean().optional().describe("Ne montrer que les contenus approuvés (défaut: true)"),
    limit: z.number().optional().describe("Nombre max de résultats (défaut: 10)"),
  }),
  run: async ({ type, platform, tags, approved_only, limit: maxResults }) => {
    try {
      const supabase = getSupabase();

      let query = supabase
        .from("content_library")
        .select("*")
        .order("performance_score", { ascending: false })
        .limit(maxResults || 10);

      if (type && type !== "all") query = query.eq("type", type);
      if (platform) query = query.eq("platform", platform);
      if (approved_only !== false) query = query.eq("approved", true);
      if (tags && tags.length > 0) query = query.overlaps("tags", tags);

      const { data, error } = await query;
      if (error) return `Erreur: ${error.message}`;
      if (!data || data.length === 0) return "Bibliothèque vide ou aucun résultat. Sauvegarde du contenu avec save_to_library.";

      const lines = data.map((item) => {
        const tagStr = item.tags?.length ? ` [${item.tags.join(", ")}]` : "";
        const score = item.performance_score > 0 ? ` (score: ${item.performance_score})` : "";
        const used = item.usage_count > 0 ? ` (utilisé ${item.usage_count}x)` : "";
        return `- **[${item.type}]** ${item.title}${tagStr}${score}${used}\n  ${item.content.slice(0, 100)}${item.content.length > 100 ? "..." : ""}\n  ID: ${item.id}`;
      });

      return `## Bibliothèque — ${data.length} résultat(s)\n\n${lines.join("\n\n")}`;
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

export const approveContent = betaZodTool({
  name: "approve_content",
  description:
    "Approuve un contenu de la bibliothèque. Seuls les contenus approuvés sont réutilisés dans les publications.",
  inputSchema: z.object({
    content_id: z.string().describe("ID du contenu à approuver"),
  }),
  run: async ({ content_id }) => {
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from("content_library")
        .update({ approved: true, approved_at: new Date().toISOString() })
        .eq("id", content_id);
      if (error) return `Erreur: ${error.message}`;
      return `✅ Contenu ${content_id} approuvé et disponible pour publication.`;
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

export const COLLECTOR_TOOLS = [collectStats, saveToLibrary, searchLibrary, approveContent];
