// ============================================
// Intégration Buffer GraphQL API
// Publication multi-plateforme (IG, TikTok, X, YT, FB)
// ============================================

import { z } from "zod";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";

const BUFFER_API = "https://api.buffer.com";

// ---- Système de validation avant publication ----
// Aucun post ne part sans approbation explicite de l'utilisateur

import readline from "readline";

async function askConfirmation(preview: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    console.log("\n╔══════════════════════════════════════════════╗");
    console.log("║       VALIDATION REQUISE AVANT PUBLICATION   ║");
    console.log("╚══════════════════════════════════════════════╝\n");
    console.log(preview);
    console.log("\n──────────────────────────────────────────────");

    rl.question("Publier ? (oui/non) > ", (answer) => {
      rl.close();
      const accepted = ["oui", "o", "yes", "y"].includes(answer.trim().toLowerCase());
      if (!accepted) {
        console.log("⛔ Publication annulée.");
      }
      resolve(accepted);
    });
  });
}

function formatPostPreview(text: string, channelId: string, mode: string, scheduleAt?: string, imageUrls?: string[]): string {
  const lines = [
    `📝 Texte :\n${text}\n`,
    `📡 Chaîne : ${channelId}`,
    `🕐 Mode  : ${mode}`,
  ];
  if (scheduleAt) lines.push(`📅 Date   : ${scheduleAt}`);
  if (imageUrls?.length) lines.push(`🖼️  Images : ${imageUrls.join(", ")}`);
  return lines.join("\n");
}

function getBufferKey(): string {
  const key = process.env.BUFFER_API_KEY;
  if (!key) {
    throw new Error(
      "BUFFER_API_KEY non définie. Va sur https://publish.buffer.com/settings/api pour créer ta clé."
    );
  }
  return key;
}

async function bufferQuery(query: string, variables?: Record<string, unknown>): Promise<unknown> {
  const key = getBufferKey();
  const res = await fetch(BUFFER_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Buffer API ${res.status}: ${text}`);
  }

  const data = await res.json();
  if (data.errors) {
    throw new Error(`Buffer GraphQL: ${JSON.stringify(data.errors)}`);
  }
  return data.data;
}

// ---- Outils Buffer ----

export const bufferListChannels = betaZodTool({
  name: "buffer_list_channels",
  description:
    "Liste tous les comptes/chaînes connectés à Buffer (Instagram, TikTok, X, YouTube, Facebook, etc.). Retourne l'ID, le nom et le service de chaque chaîne. Utilise cet outil pour connaître les channel IDs avant de publier.",
  inputSchema: z.object({}),
  run: async () => {
    try {
      // D'abord récupérer l'org ID
      const orgData = (await bufferQuery(`
        query {
          account {
            organizations {
              id
              name
            }
          }
        }
      `)) as { account: { organizations: { id: string; name: string }[] } };

      const orgs = orgData.account.organizations;
      if (!orgs.length) {
        return "Aucune organisation trouvée. Connecte des réseaux sociaux sur buffer.com d'abord.";
      }

      // Récupérer les chaînes pour chaque org
      // Note: channels() retourne un tableau plat (pas de relay edges/node)
      // et organizationId est un scalar OrganizationId (pas ID!)
      const results: string[] = [];
      for (const org of orgs) {
        const channelData = (await bufferQuery(`
          query GetChannels {
            channels(input: { organizationId: "${org.id}" }) {
              id
              name
              displayName
              service
              avatar
              isQueuePaused
            }
          }
        `)) as {
          channels: { id: string; name: string; displayName: string; service: string; avatar: string; isQueuePaused: boolean }[];
        };

        const channels = channelData.channels;
        results.push(`## Organisation : ${org.name} (${org.id})\n`);
        if (channels.length === 0) {
          results.push("Aucune chaîne connectée.\n");
        } else {
          for (const ch of channels) {
            const displayName = ch.displayName || ch.name;
            const paused = ch.isQueuePaused ? " (queue en pause)" : "";
            results.push(`- **${ch.service}** : ${displayName} → ID: \`${ch.id}\`${paused}`);
          }
        }
      }

      return results.join("\n");
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

export const bufferPublishPost = betaZodTool({
  name: "buffer_publish_post",
  description:
    "Publie ou programme un post sur un réseau social via Buffer. Peut publier immédiatement ou programmer à une date/heure précise. Supporte texte, images (via URL), et multi-chaînes.",
  inputSchema: z.object({
    channel_id: z
      .string()
      .describe("ID de la chaîne Buffer (obtenu via buffer_list_channels)"),
    text: z
      .string()
      .describe("Texte du post (avec hashtags et CTA inclus)"),
    image_urls: z
      .array(z.string())
      .optional()
      .describe("URLs des images à joindre au post (publiquement accessibles)"),
    schedule_at: z
      .string()
      .optional()
      .describe(
        "Date/heure de publication programmée en ISO 8601 (ex: 2026-04-15T18:00:00.000Z). Si absent, ajouté à la queue Buffer."
      ),
    publish_now: z
      .boolean()
      .optional()
      .describe("Si true, publie immédiatement au lieu d'ajouter à la queue"),
  }),
  run: async ({ channel_id, text, image_urls, schedule_at, publish_now }) => {
    try {
      const isScheduled = !!schedule_at;
      const mode = publish_now ? "Publication immédiate" : isScheduled ? `Programmé le ${schedule_at}` : "Ajouté à la queue";

      // ---- VALIDATION OBLIGATOIRE ----
      const preview = formatPostPreview(text, channel_id, mode, schedule_at, image_urls);
      const confirmed = await askConfirmation(preview);
      if (!confirmed) {
        return "⛔ Publication annulée par l'utilisateur.";
      }

      let assetsClause = "";
      if (image_urls && image_urls.length > 0) {
        const imgs = image_urls.map((url) => `{ url: "${url}" }`).join(", ");
        assetsClause = `assets: { images: [${imgs}] },`;
      }

      // Déterminer le mode de publication
      let modeClause = "mode: addToQueue";
      let dueAtClause = "";

      if (publish_now) {
        modeClause = "mode: shareNow";
      } else if (isScheduled) {
        modeClause = "mode: customScheduled";
        dueAtClause = `, dueAt: "${schedule_at}"`;
      }

      const mutation = `
        mutation CreatePost {
          createPost(input: {
            text: ${JSON.stringify(text)},
            channelId: "${channel_id}",
            schedulingType: automatic,
            ${modeClause}
            ${dueAtClause}
            ${assetsClause}
          }) {
            ... on PostActionSuccess {
              post {
                id
                text
                dueAt
                status
              }
            }
            ... on MutationError {
              message
            }
          }
        }
      `;

      const result = (await bufferQuery(mutation)) as {
        createPost:
          | { post: { id: string; text: string; dueAt: string; status: string } }
          | { message: string };
      };

      if ("message" in result.createPost) {
        return `Erreur Buffer: ${result.createPost.message}`;
      }

      const post = result.createPost.post;
      const statusEmoji = publish_now ? "📤" : isScheduled ? "📅" : "📋";
      return `${statusEmoji} Post créé avec succès !\n- ID: ${post.id}\n- Statut: ${post.status}\n- Programmé: ${post.dueAt || "dans la queue"}`;
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

export const bufferGetQueue = betaZodTool({
  name: "buffer_get_queue",
  description:
    "Affiche la file d'attente de publication Buffer — tous les posts programmés pas encore publiés. Permet de voir ce qui va sortir et quand.",
  inputSchema: z.object({
    organization_id: z.string().describe("ID de l'organisation Buffer"),
    channel_id: z
      .string()
      .optional()
      .describe("Filtrer par chaîne spécifique (optionnel)"),
    limit: z.number().optional().describe("Nombre de posts à récupérer (défaut: 20)"),
  }),
  run: async ({ organization_id, channel_id, limit }) => {
    try {
      const channelFilter = channel_id
        ? `channelIds: ["${channel_id}"],`
        : "";

      const result = (await bufferQuery(`
        query GetQueue {
          posts(
            first: ${limit || 20},
            input: {
              organizationId: "${organization_id}",
              filter: {
                status: [scheduled],
                ${channelFilter}
              }
            }
          ) {
            edges {
              node {
                id
                text
                dueAt
                channelId
                status
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `)) as {
        posts: {
          edges: { node: { id: string; text: string; dueAt: string; channelId: string; status: string } }[];
          pageInfo: { hasNextPage: boolean; endCursor: string };
        };
      };

      const posts = result.posts.edges.map((e) => e.node);
      if (posts.length === 0) {
        return "La queue est vide -- aucun post programme.";
      }

      const lines = posts.map((p) => {
        const preview = p.text.length > 80 ? p.text.slice(0, 80) + "..." : p.text;
        return `${p.dueAt || "Auto"} | ${preview}\n   ID: ${p.id}`;
      });

      return `**${posts.length} post(s) en queue**\n\n${lines.join("\n\n")}`;
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

export const bufferGetSentPosts = betaZodTool({
  name: "buffer_get_sent_posts",
  description:
    "Recupere les posts deja publies via Buffer avec leurs statistiques (impressions, clics, engagement). Utile pour analyser les performances.",
  inputSchema: z.object({
    organization_id: z.string().describe("ID de l'organisation Buffer"),
    channel_id: z
      .string()
      .optional()
      .describe("Filtrer par chaine specifique (optionnel)"),
    limit: z.number().optional().describe("Nombre de posts (defaut: 10)"),
  }),
  run: async ({ organization_id, channel_id, limit }) => {
    try {
      const channelFilter = channel_id
        ? `channelIds: ["${channel_id}"],`
        : "";

      const result = (await bufferQuery(`
        query GetSentPosts {
          posts(
            first: ${limit || 10},
            input: {
              organizationId: "${organization_id}",
              filter: {
                status: [sent],
                ${channelFilter}
              }
            }
          ) {
            edges {
              node {
                id
                text
                dueAt
                channelId
                status
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `)) as {
        posts: {
          edges: { node: { id: string; text: string; dueAt: string; channelId: string; status: string } }[];
          pageInfo: { hasNextPage: boolean; endCursor: string };
        };
      };

      const posts = result.posts.edges.map((e) => e.node);
      if (posts.length === 0) {
        return "Aucun post envoye trouve.";
      }

      const lines = posts.map((p) => {
        const preview = p.text.length > 100 ? p.text.slice(0, 100) + "..." : p.text;
        return `${p.dueAt} | ${preview}\n   ID: ${p.id}`;
      });

      return `**${posts.length} post(s) envoye(s)**\n\n${lines.join("\n\n")}`;
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

export const bufferDeletePost = betaZodTool({
  name: "buffer_delete_post",
  description:
    "Supprime un post de la queue Buffer (avant publication uniquement).",
  inputSchema: z.object({
    post_id: z.string().describe("ID du post Buffer à supprimer"),
  }),
  run: async ({ post_id }) => {
    try {
      // ---- VALIDATION OBLIGATOIRE ----
      const confirmed = await askConfirmation(
        `🗑️  Suppression du post : ${post_id}`
      );
      if (!confirmed) {
        return "⛔ Suppression annulée par l'utilisateur.";
      }

      const result = (await bufferQuery(`
        mutation {
          deletePost(input: { postId: "${post_id}" }) {
            ... on PostActionSuccess {
              post { id }
            }
            ... on MutationError {
              message
            }
          }
        }
      `)) as {
        deletePost: { post: { id: string } } | { message: string };
      };

      if ("message" in result.deletePost) {
        return `Erreur: ${result.deletePost.message}`;
      }

      return `🗑️ Post ${post_id} supprimé de la queue.`;
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

export const bufferScheduleBatch = betaZodTool({
  name: "buffer_schedule_batch",
  description:
    "Programme plusieurs posts d'un coup sur une ou plusieurs chaînes Buffer. Idéal pour planifier une semaine entière de contenu. Chaque post contient le texte, la chaîne cible, et la date/heure.",
  inputSchema: z.object({
    posts: z.array(
      z.object({
        channel_id: z.string().describe("ID de la chaîne Buffer"),
        text: z.string().describe("Texte du post avec hashtags"),
        schedule_at: z
          .string()
          .describe("Date/heure ISO 8601 (ex: 2026-04-15T18:00:00.000Z)"),
        image_url: z
          .string()
          .optional()
          .describe("URL d'une image à joindre (optionnel)"),
      })
    ).describe("Liste des posts à programmer"),
  }),
  run: async ({ posts }) => {
    // ---- VALIDATION OBLIGATOIRE (batch) ----
    const batchPreview = posts.map((p, i) => {
      const img = p.image_url ? ` | 🖼️ ${p.image_url}` : "";
      const preview = p.text.length > 80 ? p.text.slice(0, 80) + "..." : p.text;
      return `  ${i + 1}. [${p.schedule_at}] ${preview}${img}`;
    }).join("\n");

    const confirmed = await askConfirmation(
      `📦 Programmation batch — ${posts.length} post(s) :\n\n${batchPreview}`
    );
    if (!confirmed) {
      return `⛔ Programmation batch annulée par l'utilisateur. Aucun post n'a été envoyé.`;
    }

    const results: string[] = [];
    let success = 0;
    let failed = 0;

    for (const post of posts) {
      try {
        let assetsClause = "";
        if (post.image_url) {
          assetsClause = `assets: { images: [{ url: "${post.image_url}" }] },`;
        }

        const mutation = `
          mutation CreateScheduledPost {
            createPost(input: {
              text: ${JSON.stringify(post.text)},
              channelId: "${post.channel_id}",
              schedulingType: automatic,
              mode: customScheduled,
              dueAt: "${post.schedule_at}",
              ${assetsClause}
            }) {
              ... on PostActionSuccess {
                post { id dueAt status }
              }
              ... on MutationError {
                message
              }
            }
          }
        `;

        const data = (await bufferQuery(mutation)) as {
          createPost:
            | { post: { id: string; dueAt: string; status: string } }
            | { message: string };
        };

        if ("message" in data.createPost) {
          results.push(`❌ ${post.schedule_at}: ${data.createPost.message}`);
          failed++;
        } else {
          results.push(
            `✅ ${data.createPost.post.dueAt}: programmé (ID: ${data.createPost.post.id})`
          );
          success++;
        }
      } catch (error) {
        results.push(
          `❌ ${post.schedule_at}: ${error instanceof Error ? error.message : String(error)}`
        );
        failed++;
      }
    }

    return `## Programmation batch terminée\n\n✅ ${success} réussi(s) | ❌ ${failed} échoué(s)\n\n${results.join("\n")}`;
  },
});

// Export de tous les outils Buffer
export const BUFFER_TOOLS = [
  bufferListChannels,
  bufferPublishPost,
  bufferGetQueue,
  bufferGetSentPosts,
  bufferDeletePost,
  bufferScheduleBatch,
];
