// ============================================
// Corrélation Marketing ↔ Ventes Stripe
// + Recyclage de contenu performant
// ============================================

import { z } from "zod";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Variables Supabase manquantes");
  return createClient(url, key);
}

// ============================================
// Corrélation ventes
// ============================================

export const correlateSales = betaZodTool({
  name: "correlate_sales",
  description:
    "Corrèle les posts marketing avec les ventes Stripe (table orders). Montre l'impact de chaque campagne/post sur le chiffre d'affaires. Compare les jours avec publications vs sans.",
  inputSchema: z.object({
    period_days: z.number().optional().describe("Période d'analyse en jours (défaut: 30)"),
    campaign: z.string().optional().describe("Filtrer par campagne marketing"),
  }),
  run: async ({ period_days, campaign }) => {
    try {
      const supabase = getSupabase();
      const days = period_days || 30;
      const since = new Date();
      since.setDate(since.getDate() - days);
      const sinceStr = since.toISOString();

      // Récupérer les commandes
      const { data: orders, error: ordersErr } = await supabase
        .from("orders")
        .select("id, total, created_at, status")
        .gte("created_at", sinceStr)
        .eq("status", "paid");

      if (ordersErr) return `Erreur orders: ${ordersErr.message}`;

      // Récupérer les posts marketing
      let postsQuery = supabase
        .from("marketing_posts")
        .select("*")
        .gte("created_at", sinceStr);

      if (campaign) postsQuery = postsQuery.eq("campaign", campaign);

      const { data: posts, error: postsErr } = await postsQuery;
      if (postsErr) return `Erreur posts: ${postsErr.message}`;

      if (!orders?.length && !posts?.length) {
        return `Aucune donnée sur les ${days} derniers jours. Publie du contenu et fais des ventes d'abord !`;
      }

      // Calculs
      const totalRevenue = (orders || []).reduce((sum, o) => sum + (o.total || 0), 0);
      const totalOrders = (orders || []).length;
      const totalPosts = (posts || []).length;

      // Jours avec posts vs sans posts
      const postDays = new Set(
        (posts || []).map((p) => p.created_at?.split("T")[0]).filter(Boolean)
      );

      let revenuePostDays = 0;
      let revenueNonPostDays = 0;
      let ordersPostDays = 0;
      let ordersNonPostDays = 0;

      for (const order of orders || []) {
        const day = order.created_at?.split("T")[0];
        if (postDays.has(day)) {
          revenuePostDays += order.total || 0;
          ordersPostDays++;
        } else {
          revenueNonPostDays += order.total || 0;
          ordersNonPostDays++;
        }
      }

      // Revenu par campagne
      const byCampaign: Record<string, { posts: number; postDates: Set<string> }> = {};
      for (const p of posts || []) {
        const camp = p.campaign || "sans-campagne";
        if (!byCampaign[camp]) byCampaign[camp] = { posts: 0, postDates: new Set() };
        byCampaign[camp].posts++;
        if (p.created_at) byCampaign[camp].postDates.add(p.created_at.split("T")[0]);
      }

      const campaignRevenue: Record<string, number> = {};
      for (const [camp, info] of Object.entries(byCampaign)) {
        campaignRevenue[camp] = 0;
        for (const order of orders || []) {
          const day = order.created_at?.split("T")[0];
          // Attribuer la vente si elle arrive le jour du post ou le lendemain
          for (const postDate of info.postDates) {
            const postD = new Date(postDate);
            const orderD = new Date(day);
            const diff = (orderD.getTime() - postD.getTime()) / (1000 * 60 * 60 * 24);
            if (diff >= 0 && diff <= 1) {
              campaignRevenue[camp] += order.total || 0;
              break;
            }
          }
        }
      }

      // Format monétaire
      const fmt = (n: number) => `${(n / 100).toFixed(2)} €`;

      const avgPerPostDay = postDays.size > 0 ? revenuePostDays / postDays.size : 0;
      const totalDays = days;
      const nonPostDaysCount = totalDays - postDays.size;
      const avgPerNonPostDay = nonPostDaysCount > 0 ? revenueNonPostDays / nonPostDaysCount : 0;

      const report = [
        `## Corrélation Marketing ↔ Ventes — ${days} derniers jours\n`,
        `| Métrique | Valeur |`,
        `|---|---|`,
        `| Chiffre d'affaires total | **${fmt(totalRevenue)}** |`,
        `| Commandes | ${totalOrders} |`,
        `| Posts publiés | ${totalPosts} |`,
        `| Jours avec publications | ${postDays.size} |`,
        "",
        `### Impact des publications sur les ventes`,
        "",
        `| Période | CA | Commandes | CA/jour moyen |`,
        `|---|---|---|---|`,
        `| Jours avec posts | ${fmt(revenuePostDays)} | ${ordersPostDays} | ${fmt(avgPerPostDay)} |`,
        `| Jours sans posts | ${fmt(revenueNonPostDays)} | ${ordersNonPostDays} | ${fmt(avgPerNonPostDay)} |`,
      ];

      if (avgPerPostDay > avgPerNonPostDay && avgPerNonPostDay > 0) {
        const lift = Math.round(((avgPerPostDay - avgPerNonPostDay) / avgPerNonPostDay) * 100);
        report.push(`\n**Les jours avec publications génèrent +${lift}% de CA en moyenne.**`);
      }

      if (Object.keys(campaignRevenue).length > 0) {
        report.push("\n### CA par campagne marketing\n");
        for (const [camp, revenue] of Object.entries(campaignRevenue).sort((a, b) => b[1] - a[1])) {
          const info = byCampaign[camp];
          report.push(`- **${camp}** : ${fmt(revenue)} (${info.posts} posts)`);
        }
      }

      return report.join("\n");
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

// ============================================
// Recyclage de contenu
// ============================================

export const recycleTopPosts = betaZodTool({
  name: "recycle_top_posts",
  description:
    "Identifie les posts les plus performants publiés il y a plus de 30 jours et propose de les republier. Le contenu recyclé est légèrement modifié pour paraître frais.",
  inputSchema: z.object({
    min_age_days: z.number().optional().describe("Âge minimum en jours (défaut: 30)"),
    min_score: z.number().optional().describe("Score d'engagement minimum (défaut: 2)"),
    limit: z.number().optional().describe("Nombre de posts à recycler (défaut: 5)"),
  }),
  run: async ({ min_age_days, min_score, limit }) => {
    try {
      const supabase = getSupabase();
      const minAge = min_age_days || 30;
      const minScoreVal = min_score || 2;
      const maxResults = limit || 5;

      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - minAge);

      const { data: posts, error } = await supabase
        .from("marketing_posts")
        .select("*")
        .lte("created_at", cutoff.toISOString())
        .gte("score", minScoreVal)
        .order("score", { ascending: false })
        .limit(maxResults);

      if (error) return `Erreur: ${error.message}`;
      if (!posts || posts.length === 0) {
        return `Aucun post recyclable trouvé (plus de ${minAge} jours, score ≥ ${minScoreVal}%). Accumule plus de données.`;
      }

      const suggestions = posts.map((p, i) => {
        const age = Math.round(
          (Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        return [
          `### ${i + 1}. [${p.platform}/${p.post_type}] Score: ${p.score}% (il y a ${age} jours)`,
          `**Texte original :** ${p.text_content.slice(0, 150)}...`,
          `**Site cible :** ${p.target_site || "non spécifié"}`,
          `**Suggestion :** Reformuler légèrement, mettre à jour les hashtags, utiliser un nouveau visuel.`,
          `**ID :** ${p.id}`,
        ].join("\n");
      });

      return [
        `## Contenu recyclable — ${posts.length} post(s) performant(s)\n`,
        `Ces posts ont bien marché et méritent une seconde vie :\n`,
        ...suggestions,
        `\n---`,
        `Pour republier, demande-moi de reformuler un post spécifique puis programme-le via Buffer.`,
      ].join("\n\n");
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

export const SALES_TOOLS = [correlateSales, recycleTopPosts];
