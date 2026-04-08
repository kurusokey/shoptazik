// ============================================
// Analytics + Mémoire Supabase
// L'agent stocke et analyse ses performances
// ============================================

import { z } from "zod";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { createClient } from "@supabase/supabase-js";

// ---- Supabase client ----

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Variables Supabase manquantes");
  }
  return createClient(url, key);
}

// ---- Initialisation table (auto-création) ----

async function ensureTable() {
  const supabase = getSupabase();

  // Tester si la table existe en faisant un select limité
  const { error } = await supabase
    .from("marketing_posts")
    .select("id")
    .limit(1);

  if (error?.code === "42P01") {
    // Table n'existe pas — la créer via SQL
    const { error: createError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS marketing_posts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          created_at TIMESTAMPTZ DEFAULT now(),
          platform TEXT NOT NULL,
          post_type TEXT NOT NULL,
          text_content TEXT NOT NULL,
          hashtags TEXT[],
          image_url TEXT,
          buffer_post_id TEXT,
          scheduled_at TIMESTAMPTZ,
          published_at TIMESTAMPTZ,
          target_site TEXT,
          campaign TEXT,
          impressions INTEGER DEFAULT 0,
          reach INTEGER DEFAULT 0,
          engagement INTEGER DEFAULT 0,
          clicks INTEGER DEFAULT 0,
          saves INTEGER DEFAULT 0,
          shares INTEGER DEFAULT 0,
          comments INTEGER DEFAULT 0,
          score REAL DEFAULT 0,
          notes TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_marketing_posts_platform ON marketing_posts(platform);
        CREATE INDEX IF NOT EXISTS idx_marketing_posts_campaign ON marketing_posts(campaign);
      `,
    });

    if (createError) {
      // Si exec_sql n'existe pas, on continue sans la table
      // L'utilisateur devra la créer manuellement
      return false;
    }
  }
  return true;
}

// ============================================
// Outils Analytics
// ============================================

export const trackPost = betaZodTool({
  name: "track_post",
  description:
    "Enregistre un post publié dans la base Supabase pour suivi de performance. Appelle cet outil APRÈS chaque publication Buffer réussie.",
  inputSchema: z.object({
    platform: z
      .enum(["instagram", "tiktok", "youtube", "facebook", "twitter", "linkedin"])
      .describe("Plateforme de publication"),
    post_type: z
      .enum(["post", "reel", "story", "carousel", "thread", "short", "live"])
      .describe("Type de contenu"),
    text_content: z.string().describe("Texte du post publié"),
    hashtags: z.array(z.string()).optional().describe("Liste des hashtags utilisés"),
    image_url: z.string().optional().describe("URL de l'image utilisée"),
    buffer_post_id: z.string().optional().describe("ID du post Buffer"),
    scheduled_at: z.string().optional().describe("Date de publication programmée (ISO 8601)"),
    target_site: z
      .enum(["la-mug.com", "fdy.art", "boutique.la-mug.com"])
      .optional()
      .describe("Site du triptyque vers lequel pointe le post"),
    campaign: z.string().optional().describe("Nom de la campagne (ex: lancement-boutique)"),
  }),
  run: async ({
    platform, post_type, text_content, hashtags, image_url,
    buffer_post_id, scheduled_at, target_site, campaign,
  }) => {
    try {
      const supabase = getSupabase();
      await ensureTable();

      const { data, error } = await supabase
        .from("marketing_posts")
        .insert({
          platform,
          post_type,
          text_content,
          hashtags: hashtags || [],
          image_url,
          buffer_post_id,
          scheduled_at,
          target_site,
          campaign,
        })
        .select("id")
        .single();

      if (error) {
        return `Erreur tracking: ${error.message}. Le post a bien été publié mais n'est pas tracké.`;
      }

      return `📊 Post tracké en base (ID: ${data.id}). Les stats pourront être mises à jour plus tard.`;
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

export const updatePostStats = betaZodTool({
  name: "update_post_stats",
  description:
    "Met à jour les statistiques d'un post tracké (impressions, reach, engagement, etc.). Utilise les données de buffer_get_sent_posts ou de Meta Graph API.",
  inputSchema: z.object({
    post_id: z.string().describe("ID du post dans marketing_posts (UUID Supabase)"),
    impressions: z.number().optional().describe("Nombre d'impressions"),
    reach: z.number().optional().describe("Portée (personnes uniques)"),
    engagement: z.number().optional().describe("Interactions totales"),
    clicks: z.number().optional().describe("Clics sur le lien"),
    saves: z.number().optional().describe("Sauvegardes"),
    shares: z.number().optional().describe("Partages"),
    comments: z.number().optional().describe("Commentaires"),
    notes: z.string().optional().describe("Notes d'analyse"),
  }),
  run: async ({ post_id, ...stats }) => {
    try {
      const supabase = getSupabase();

      // Calculer un score d'engagement
      const engagement = stats.engagement || 0;
      const reach = stats.reach || 1;
      const score = (engagement / reach) * 100;

      const updates: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(stats)) {
        if (value !== undefined) updates[key] = value;
      }
      updates.score = Math.round(score * 100) / 100;

      const { error } = await supabase
        .from("marketing_posts")
        .update(updates)
        .eq("id", post_id);

      if (error) return `Erreur mise à jour: ${error.message}`;

      return `📊 Stats mises à jour (score engagement: ${updates.score}%)`;
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

export const analyzePerformance = betaZodTool({
  name: "analyze_performance",
  description:
    "Analyse les performances des posts publiés. Retourne les meilleurs et pires posts, les tendances par plateforme/type/campagne, et des recommandations.",
  inputSchema: z.object({
    period_days: z
      .number()
      .optional()
      .describe("Période d'analyse en jours (défaut: 30)"),
    platform: z
      .string()
      .optional()
      .describe("Filtrer par plateforme"),
    campaign: z
      .string()
      .optional()
      .describe("Filtrer par campagne"),
  }),
  run: async ({ period_days, platform, campaign }) => {
    try {
      const supabase = getSupabase();
      const days = period_days || 30;

      const since = new Date();
      since.setDate(since.getDate() - days);

      let query = supabase
        .from("marketing_posts")
        .select("*")
        .gte("created_at", since.toISOString())
        .order("score", { ascending: false });

      if (platform) query = query.eq("platform", platform);
      if (campaign) query = query.eq("campaign", campaign);

      const { data: posts, error } = await query;

      if (error) return `Erreur analyse: ${error.message}`;
      if (!posts || posts.length === 0) {
        return `Aucun post tracké sur les ${days} derniers jours. Publie du contenu d'abord !`;
      }

      // Calculs
      const totalPosts = posts.length;
      const avgScore = posts.reduce((sum, p) => sum + (p.score || 0), 0) / totalPosts;
      const totalImpressions = posts.reduce((sum, p) => sum + (p.impressions || 0), 0);
      const totalEngagement = posts.reduce((sum, p) => sum + (p.engagement || 0), 0);
      const totalClicks = posts.reduce((sum, p) => sum + (p.clicks || 0), 0);

      // Top 3 posts
      const top3 = posts.slice(0, 3);

      // Stats par plateforme
      const byPlatform: Record<string, { count: number; avgScore: number; totalReach: number }> = {};
      for (const p of posts) {
        if (!byPlatform[p.platform]) {
          byPlatform[p.platform] = { count: 0, avgScore: 0, totalReach: 0 };
        }
        byPlatform[p.platform].count++;
        byPlatform[p.platform].avgScore += p.score || 0;
        byPlatform[p.platform].totalReach += p.reach || 0;
      }
      for (const key of Object.keys(byPlatform)) {
        byPlatform[key].avgScore = Math.round(
          (byPlatform[key].avgScore / byPlatform[key].count) * 100
        ) / 100;
      }

      // Stats par type
      const byType: Record<string, number> = {};
      for (const p of posts) {
        byType[p.post_type] = (byType[p.post_type] || 0) + 1;
      }

      // Stats par site cible
      const bySite: Record<string, number> = {};
      for (const p of posts) {
        if (p.target_site) {
          bySite[p.target_site] = (bySite[p.target_site] || 0) + (p.clicks || 0);
        }
      }

      // Construire le rapport
      const report = [
        `## Rapport de performance — ${days} derniers jours`,
        "",
        `| Métrique | Valeur |`,
        `|---|---|`,
        `| Posts publiés | ${totalPosts} |`,
        `| Score engagement moyen | ${Math.round(avgScore * 100) / 100}% |`,
        `| Impressions totales | ${totalImpressions.toLocaleString("fr-FR")} |`,
        `| Engagement total | ${totalEngagement.toLocaleString("fr-FR")} |`,
        `| Clics total | ${totalClicks.toLocaleString("fr-FR")} |`,
        "",
        "### Top 3 posts",
        ...top3.map(
          (p, i) =>
            `${i + 1}. [${p.platform}/${p.post_type}] Score: ${p.score}% — ${p.text_content.slice(0, 60)}...`
        ),
        "",
        "### Par plateforme",
        ...Object.entries(byPlatform).map(
          ([plat, stats]) =>
            `- **${plat}** : ${stats.count} posts, score moyen ${stats.avgScore}%, portée ${stats.totalReach.toLocaleString("fr-FR")}`
        ),
        "",
        "### Par type de contenu",
        ...Object.entries(byType).map(([type, count]) => `- ${type} : ${count}`),
        "",
        "### Clics par site",
        ...Object.entries(bySite).map(
          ([site, clicks]) => `- ${site} : ${clicks.toLocaleString("fr-FR")} clics`
        ),
      ];

      return report.join("\n");
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

export const getBestPractices = betaZodTool({
  name: "get_best_practices",
  description:
    "Analyse les posts passés et retourne des recommandations concrètes : meilleurs horaires, meilleurs types de contenu, hashtags les plus performants, plateformes à privilégier.",
  inputSchema: z.object({}),
  run: async () => {
    try {
      const supabase = getSupabase();

      const { data: posts, error } = await supabase
        .from("marketing_posts")
        .select("*")
        .gt("score", 0)
        .order("score", { ascending: false });

      if (error) return `Erreur: ${error.message}`;
      if (!posts || posts.length < 5) {
        return "Pas assez de données (minimum 5 posts avec stats). Continue à publier et à mettre à jour les stats !";
      }

      // Meilleurs horaires
      const hourScores: Record<number, { total: number; count: number }> = {};
      for (const p of posts) {
        if (p.scheduled_at) {
          const hour = new Date(p.scheduled_at).getHours();
          if (!hourScores[hour]) hourScores[hour] = { total: 0, count: 0 };
          hourScores[hour].total += p.score || 0;
          hourScores[hour].count++;
        }
      }
      const bestHours = Object.entries(hourScores)
        .map(([h, s]) => ({ hour: Number(h), avgScore: s.total / s.count }))
        .sort((a, b) => b.avgScore - a.avgScore)
        .slice(0, 3);

      // Meilleur type de contenu
      const typeScores: Record<string, { total: number; count: number }> = {};
      for (const p of posts) {
        if (!typeScores[p.post_type]) typeScores[p.post_type] = { total: 0, count: 0 };
        typeScores[p.post_type].total += p.score || 0;
        typeScores[p.post_type].count++;
      }
      const bestTypes = Object.entries(typeScores)
        .map(([type, s]) => ({ type, avgScore: s.total / s.count }))
        .sort((a, b) => b.avgScore - a.avgScore);

      // Meilleurs hashtags
      const hashtagScores: Record<string, { total: number; count: number }> = {};
      for (const p of posts) {
        for (const tag of p.hashtags || []) {
          if (!hashtagScores[tag]) hashtagScores[tag] = { total: 0, count: 0 };
          hashtagScores[tag].total += p.score || 0;
          hashtagScores[tag].count++;
        }
      }
      const bestHashtags = Object.entries(hashtagScores)
        .filter(([, s]) => s.count >= 2)
        .map(([tag, s]) => ({ tag, avgScore: s.total / s.count, count: s.count }))
        .sort((a, b) => b.avgScore - a.avgScore)
        .slice(0, 10);

      // Meilleure plateforme
      const platScores: Record<string, { total: number; count: number }> = {};
      for (const p of posts) {
        if (!platScores[p.platform]) platScores[p.platform] = { total: 0, count: 0 };
        platScores[p.platform].total += p.score || 0;
        platScores[p.platform].count++;
      }
      const bestPlatforms = Object.entries(platScores)
        .map(([plat, s]) => ({ platform: plat, avgScore: s.total / s.count }))
        .sort((a, b) => b.avgScore - a.avgScore);

      return [
        "## Recommandations basées sur les données\n",
        "### Meilleurs horaires de publication",
        ...bestHours.map((h) => `- **${h.hour}h** : score moyen ${Math.round(h.avgScore * 100) / 100}%`),
        "",
        "### Meilleurs types de contenu",
        ...bestTypes.map((t) => `- **${t.type}** : score moyen ${Math.round(t.avgScore * 100) / 100}%`),
        "",
        "### Plateformes les plus performantes",
        ...bestPlatforms.map((p) => `- **${p.platform}** : score moyen ${Math.round(p.avgScore * 100) / 100}%`),
        "",
        "### Hashtags les plus performants",
        ...bestHashtags.map((h) => `- **${h.tag}** : score ${Math.round(h.avgScore * 100) / 100}% (utilisé ${h.count}x)`),
        "",
        `_Basé sur ${posts.length} posts analysés._`,
      ].join("\n");
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

// Export
export const ANALYTICS_TOOLS = [trackPost, updatePostStats, analyzePerformance, getBestPractices];
