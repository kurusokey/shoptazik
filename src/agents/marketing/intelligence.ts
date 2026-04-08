// ============================================
// Intelligence Marketing
// Veille tendances, scoring prédictif,
// adaptation multi-plateforme, analyse sentiment
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
// Veille tendances
// ============================================

export const searchTrends = betaZodTool({
  name: "search_trends",
  description:
    "Recherche les tendances actuelles dans le rap français, la culture hip-hop, et le marché du vinyle. Utilise des requêtes web pour trouver les sujets chauds du moment. Appelle cet outil AVANT de créer du contenu pour surfer sur l'actualité.",
  inputSchema: z.object({
    topic: z
      .enum([
        "rap-francais",
        "hip-hop-culture",
        "vinyle-marche",
        "musique-independante",
        "evenements-culturels",
        "custom",
      ])
      .describe("Thème de recherche"),
    custom_query: z
      .string()
      .optional()
      .describe("Requête personnalisée (si topic = custom)"),
  }),
  run: async ({ topic, custom_query }) => {
    // Sources RSS et pages web publiques par thème
    const sources: Record<string, { url: string; label: string }[]> = {
      "rap-francais": [
        { url: "https://www.booska-p.com/feed/", label: "Booska-P" },
        { url: "https://www.rapelite.com/feed/", label: "Rap Elite" },
        { url: "https://www.abcdrduson.com/feed/", label: "L'Abcdr du Son" },
      ],
      "hip-hop-culture": [
        { url: "https://www.abcdrduson.com/feed/", label: "L'Abcdr du Son" },
        { url: "https://www.booska-p.com/feed/", label: "Booska-P" },
      ],
      "vinyle-marche": [
        { url: "https://www.music-industry-blog.com/feed/", label: "Music Industry Blog" },
      ],
      "musique-independante": [
        { url: "https://www.irma.asso.fr/spip.php?page=rss", label: "IRMA" },
      ],
      "evenements-culturels": [
        { url: "https://www.booska-p.com/feed/", label: "Booska-P" },
      ],
      custom: [],
    };

    const topicSources = sources[topic] || [];
    const results: string[] = [`## Veille tendances : ${topic}\n`];
    let articlesFound = 0;

    // Fetcher les flux RSS réels
    for (const source of topicSources) {
      try {
        const res = await fetch(source.url, {
          headers: { "User-Agent": "MUG-Marketing-Agent/1.0" },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) continue;

        const xml = await res.text();

        // Parser RSS basique (extraire titres et liens)
        const items: { title: string; link: string; date: string }[] = [];
        const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g;
        let match;
        while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
          const block = match[1];
          const title = block.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1] || "";
          const link = block.match(/<link[^>]*>(.*?)<\/link>/)?.[1] || "";
          const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
          if (title) items.push({ title: title.trim(), link: link.trim(), date: pubDate });
        }

        if (items.length > 0) {
          results.push(`### ${source.label}\n`);
          for (const item of items) {
            const dateStr = item.date ? ` (${new Date(item.date).toLocaleDateString("fr-FR")})` : "";
            results.push(`- ${item.title}${dateStr}`);
            if (item.link) results.push(`  ${item.link}`);
            articlesFound++;
          }
          results.push("");
        }
      } catch {
        // Source indisponible, on continue
      }
    }

    // Recherche custom via DuckDuckGo (pas de blocage)
    const queryMap: Record<string, string> = {
      "rap-francais": "rap français nouveautés",
      "hip-hop-culture": "culture hip-hop france",
      "vinyle-marche": "marché vinyle france",
      "musique-independante": "musique indépendante france",
      "evenements-culturels": "événements hip-hop france",
    };
    const query = custom_query || queryMap[topic] || topic;

    try {
      const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + " 2026")}`;
      const ddgRes = await fetch(ddgUrl, {
        headers: { "User-Agent": "MUG-Marketing-Agent/1.0" },
        signal: AbortSignal.timeout(8000),
      });
      if (ddgRes.ok) {
        const html = await ddgRes.text();
        const titleRegex = /<a[^>]*class="result__a"[^>]*>(.*?)<\/a>/g;
        const snippetRegex = /<a[^>]*class="result__snippet"[^>]*>(.*?)<\/a>/g;
        const titles: string[] = [];
        let m;
        while ((m = titleRegex.exec(html)) !== null && titles.length < 5) {
          const clean = m[1].replace(/<[^>]+>/g, "").trim();
          if (clean) titles.push(clean);
        }
        const snippets: string[] = [];
        while ((m = snippetRegex.exec(html)) !== null && snippets.length < 5) {
          const clean = m[1].replace(/<[^>]+>/g, "").trim();
          if (clean) snippets.push(clean);
        }

        if (titles.length > 0) {
          results.push(`### Résultats web (DuckDuckGo)\n`);
          for (let i = 0; i < titles.length; i++) {
            results.push(`- **${titles[i]}**`);
            if (snippets[i]) results.push(`  ${snippets[i]}`);
            articlesFound++;
          }
          results.push("");
        }
      }
    } catch {
      // DuckDuckGo indisponible
    }

    if (articlesFound === 0) {
      results.push("Aucune source accessible pour le moment. Réessaie plus tard ou consulte manuellement :");
      results.push("- X : #RapFR #HipHopFR");
      results.push("- TikTok : FYP musique");
      results.push("- Spotify : Charts France, Playlists Rap FR");
      results.push("- booska-p.com, abcdrduson.com, rapelite.com");
    }

    results.push("\n### Actions pour La M.U.G");
    results.push("- Créer du contenu qui surfe sur les sujets chauds identifiés");
    results.push("- Adapter les hashtags aux tendances actuelles");
    results.push("- Programmer un post réactif dans les 24h si un sujet est pertinent");

    return results.join("\n");
  },
});

// ============================================
// Scoring prédictif
// ============================================

export const predictScore = betaZodTool({
  name: "predict_score",
  description:
    "Prédit le score d'engagement d'un post AVANT publication, basé sur les données historiques (plateforme, type, horaire, longueur, hashtags). Suggère des améliorations pour maximiser la performance.",
  inputSchema: z.object({
    platform: z
      .enum(["instagram", "tiktok", "youtube", "facebook", "twitter"])
      .describe("Plateforme cible"),
    post_type: z
      .enum(["post", "reel", "story", "carousel", "thread", "short"])
      .describe("Type de contenu"),
    text: z.string().describe("Texte du post à analyser"),
    scheduled_hour: z.number().optional().describe("Heure de publication prévue (0-23)"),
    has_image: z.boolean().optional().describe("Le post contient-il une image ?"),
    hashtag_count: z.number().optional().describe("Nombre de hashtags"),
  }),
  run: async ({ platform, post_type, text, scheduled_hour, has_image, hashtag_count }) => {
    try {
      const supabase = getSupabase();

      // Récupérer les données historiques
      const { data: historical } = await supabase
        .from("marketing_posts")
        .select("*")
        .gt("score", 0);

      const posts = historical || [];

      // Facteurs de scoring (basés sur les bonnes pratiques + données)
      let predictedScore = 3.0; // Score de base (3%)
      const factors: string[] = [];
      const suggestions: string[] = [];

      // 1. Plateforme
      if (posts.length >= 5) {
        const platPosts = posts.filter((p) => p.platform === platform);
        if (platPosts.length > 0) {
          const avgPlatScore =
            platPosts.reduce((sum, p) => sum + p.score, 0) / platPosts.length;
          predictedScore = avgPlatScore;
          factors.push(`Score moyen historique ${platform}: ${avgPlatScore.toFixed(1)}%`);
        }
      }

      // 2. Type de contenu
      const typeMultipliers: Record<string, number> = {
        reel: 1.5,
        carousel: 1.3,
        story: 0.8,
        post: 1.0,
        thread: 1.1,
        short: 1.4,
      };
      const typeMult = typeMultipliers[post_type] || 1.0;
      predictedScore *= typeMult;
      if (typeMult > 1.0) factors.push(`${post_type} a un bonus de ${Math.round((typeMult - 1) * 100)}%`);

      // 3. Horaire
      if (scheduled_hour !== undefined) {
        const goodHours = [12, 13, 18, 19, 20];
        if (goodHours.includes(scheduled_hour)) {
          predictedScore *= 1.2;
          factors.push(`Horaire optimal (${scheduled_hour}h)`);
        } else if (scheduled_hour >= 22 || scheduled_hour <= 6) {
          predictedScore *= 0.6;
          factors.push(`Horaire défavorable (${scheduled_hour}h)`);
          suggestions.push(`Programmer entre 12h-13h ou 18h-20h pour +40% d'engagement`);
        }
      }

      // 4. Image
      if (has_image) {
        predictedScore *= 1.3;
        factors.push("Image détectée (+30%)");
      } else {
        suggestions.push("Ajouter une image pour +30% d'engagement estimé");
      }

      // 5. Longueur du texte
      const textLength = text.length;
      if (platform === "twitter" && textLength > 200) {
        predictedScore *= 0.8;
        suggestions.push("Raccourcir le texte pour X (max 200 caractères optimal)");
      } else if (platform === "instagram" && textLength < 100) {
        predictedScore *= 0.9;
        suggestions.push("Les posts IG avec 100-300 caractères performent mieux");
      } else if (textLength >= 100 && textLength <= 500) {
        predictedScore *= 1.1;
        factors.push("Longueur de texte optimale");
      }

      // 6. Hashtags
      const hCount = hashtag_count || (text.match(/#/g) || []).length;
      if (hCount >= 4 && hCount <= 10) {
        predictedScore *= 1.15;
        factors.push(`${hCount} hashtags (zone optimale)`);
      } else if (hCount > 15) {
        predictedScore *= 0.85;
        suggestions.push("Réduire à 8-10 hashtags max pour éviter le shadow ban");
      } else if (hCount < 3) {
        suggestions.push("Ajouter 4-8 hashtags pour améliorer la découvrabilité");
      }

      // 7. CTA
      const hasCTA =
        /découvr|lien|clique|visite|boutique|shop|écoute/i.test(text);
      if (hasCTA) {
        predictedScore *= 1.1;
        factors.push("CTA détecté (+10%)");
      } else {
        suggestions.push("Ajouter un CTA clair (lien en bio, découvre, écoute)");
      }

      // 8. Émojis
      const emojiCount = (text.match(/[\p{Emoji}]/gu) || []).length;
      if (emojiCount >= 1 && emojiCount <= 5) {
        factors.push("Bonne utilisation des emojis");
      } else if (emojiCount === 0) {
        suggestions.push("Ajouter 2-3 emojis pour capter l'attention");
      }

      const finalScore = Math.round(predictedScore * 100) / 100;
      const level =
        finalScore >= 5 ? "Excellent" :
        finalScore >= 3 ? "Bon" :
        finalScore >= 1.5 ? "Moyen" : "Faible";

      return [
        `## Prédiction d'engagement\n`,
        `**Score prédit : ${finalScore}% (${level})**\n`,
        `### Facteurs positifs`,
        ...factors.map((f) => `- ✅ ${f}`),
        "",
        suggestions.length > 0 ? `### Améliorations suggérées` : "",
        ...suggestions.map((s) => `- 💡 ${s}`),
        "",
        `_Score basé sur ${posts.length} posts historiques + bonnes pratiques marketing._`,
      ]
        .filter(Boolean)
        .join("\n");
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

// ============================================
// Adaptation multi-plateforme
// ============================================

export const adaptContent = betaZodTool({
  name: "adapt_content",
  description:
    "Prend un contenu source et retourne les règles d'adaptation pour chaque plateforme. L'agent utilise ces règles pour reformuler le texte. Ne reformule PAS le texte lui-même — donne les contraintes.",
  inputSchema: z.object({
    source_platform: z
      .enum(["instagram", "tiktok", "youtube", "facebook", "twitter"])
      .describe("Plateforme d'origine du contenu"),
    target_platforms: z
      .array(z.enum(["instagram", "tiktok", "youtube", "facebook", "twitter"]))
      .describe("Plateformes cibles"),
    content_type: z
      .enum(["post", "reel", "story", "carousel", "thread"])
      .describe("Type de contenu source"),
  }),
  run: async ({ source_platform, target_platforms, content_type }) => {
    const rules: Record<string, string> = {
      instagram: [
        "- Max 2200 caractères, mais 125 visibles avant 'plus'",
        "- 8-10 hashtags en fin de post (pas dans le texte)",
        "- Format carré 1:1 ou portrait 4:5 pour le feed",
        "- Stories 9:16, Reels 9:16 (15-90s)",
        "- CTA : 'Lien en bio' (pas de lien cliquable dans le post)",
        "- Emojis encouragés, tone visuel",
      ].join("\n"),
      tiktok: [
        "- Max 300 caractères pour la description",
        "- 3-5 hashtags max (dont #FYP #PourToi)",
        "- Vidéo verticale 9:16 obligatoire",
        "- Hook dans les 3 premières secondes",
        "- Sons tendance = boost algorithme",
        "- Tone décontracté, authentique, jeune",
      ].join("\n"),
      youtube: [
        "- Titre : max 60 caractères, accrocheur",
        "- Description : 200+ mots avec liens et timestamps",
        "- Tags : 10-15 mots-clés pertinents",
        "- Thumbnail custom obligatoire (1280x720)",
        "- CTA : s'abonner, liker, commenter",
        "- Shorts : max 60s, vertical 9:16",
      ].join("\n"),
      facebook: [
        "- Pas de limite de caractères (mais 40-80 mots optimal)",
        "- Les liens sont cliquables directement",
        "- Partage d'événements natif",
        "- Tone plus formel que IG/TikTok",
        "- Les vidéos natives performent mieux que les liens YouTube",
        "- 1-3 hashtags max",
      ].join("\n"),
      twitter: [
        "- Max 280 caractères par tweet",
        "- Threads pour contenu long (max 25 tweets)",
        "- 1-2 hashtags max (dans le texte, naturels)",
        "- Les images augmentent l'engagement de 150%",
        "- Tone conversationnel, réactif",
        "- Lien en dernier tweet du thread",
      ].join("\n"),
    };

    const adaptations = target_platforms.map((target) => {
      return `### ${source_platform} → ${target}\n\n${rules[target] || "Pas de règles spécifiques."}`;
    });

    return [
      `## Guide d'adaptation multi-plateforme`,
      `**Source :** ${source_platform} (${content_type})`,
      `**Cibles :** ${target_platforms.join(", ")}\n`,
      ...adaptations,
      "",
      "### Règle d'or",
      "Chaque plateforme a sa propre culture. Ne copie-colle JAMAIS un post d'une plateforme à l'autre — adapte le ton, la longueur et le format.",
    ].join("\n\n");
  },
});

// ============================================
// Analyse de sentiment
// ============================================

export const analyzeSentiment = betaZodTool({
  name: "analyze_sentiment",
  description:
    "Analyse le sentiment d'une liste de commentaires ou mentions. Retourne le ratio positif/négatif/neutre et les sujets récurrents. Utile pour ajuster la communication.",
  inputSchema: z.object({
    comments: z
      .array(z.string())
      .describe("Liste de commentaires/mentions à analyser"),
    context: z
      .string()
      .optional()
      .describe("Contexte (ex: commentaires sous le post boutique, mentions sur X)"),
  }),
  run: async ({ comments, context }) => {
    if (comments.length === 0) return "Aucun commentaire à analyser.";

    // Mots-clés pour analyse basique de sentiment
    const positiveWords = [
      "bien", "super", "top", "bravo", "excellent", "genial", "génial", "love",
      "adore", "magnifique", "incroyable", "respect", "fire", "lourd",
      "dingue", "tuerie", "chef", "oeuvre", "merci", "fort", "classe",
      "propre", "sale", "masterclass", "classique", "leger", "léger",
    ];
    const negativeWords = [
      "nul", "mauvais", "pourri", "merde", "horrible", "decevant", "décevant",
      "cher", "arnaque", "bof", "moyen", "pas ouf", "spam", "fake",
      "honte", "mediocre", "médiocre", "ennuyeux",
    ];
    const questionWords = ["?", "comment", "quand", "combien", "pourquoi", "où"];

    let positive = 0;
    let negative = 0;
    let neutral = 0;
    let questions = 0;
    const themes: Record<string, number> = {};

    for (const comment of comments) {
      const lower = comment.toLowerCase();

      const posCount = positiveWords.filter((w) => lower.includes(w)).length;
      const negCount = negativeWords.filter((w) => lower.includes(w)).length;
      const hasQuestion = questionWords.some((w) => lower.includes(w));

      if (hasQuestion) questions++;

      if (posCount > negCount) positive++;
      else if (negCount > posCount) negative++;
      else neutral++;

      // Thèmes
      if (/prix|cher|cout|coût|€/.test(lower)) themes["Prix"] = (themes["Prix"] || 0) + 1;
      if (/vinyl|vinyle|cd|album/.test(lower)) themes["Produit"] = (themes["Produit"] || 0) + 1;
      if (/livraison|envoi|colis/.test(lower)) themes["Livraison"] = (themes["Livraison"] || 0) + 1;
      if (/musique|son|track|morceau|rap/.test(lower)) themes["Musique"] = (themes["Musique"] || 0) + 1;
      if (/atelier|event|concert/.test(lower)) themes["Événements"] = (themes["Événements"] || 0) + 1;
      if (/quand|date|sortie/.test(lower)) themes["Dates/Sorties"] = (themes["Dates/Sorties"] || 0) + 1;
    }

    const total = comments.length;
    const posPercent = Math.round((positive / total) * 100);
    const negPercent = Math.round((negative / total) * 100);
    const neuPercent = 100 - posPercent - negPercent;

    const sentimentEmoji =
      posPercent >= 60 ? "😊" : negPercent >= 30 ? "😟" : "😐";

    const sortedThemes = Object.entries(themes)
      .sort(([, a], [, b]) => b - a);

    return [
      `## Analyse de sentiment ${sentimentEmoji}`,
      context ? `**Contexte :** ${context}\n` : "",
      `**${total} commentaires analysés**\n`,
      `| Sentiment | % | Count |`,
      `|---|---|---|`,
      `| ✅ Positif | ${posPercent}% | ${positive} |`,
      `| ❌ Négatif | ${negPercent}% | ${negative} |`,
      `| ⚪ Neutre | ${neuPercent}% | ${neutral} |`,
      `| ❓ Questions | ${Math.round((questions / total) * 100)}% | ${questions} |`,
      "",
      sortedThemes.length > 0 ? "### Thèmes récurrents" : "",
      ...sortedThemes.map(([theme, count]) => `- **${theme}** : ${count} mention(s)`),
      "",
      "### Recommandations",
      posPercent >= 60 ? "- La communauté est réceptive — continuer sur cette lancée" : "",
      negPercent >= 30 ? "- Sentiment négatif élevé — investiguer et répondre aux préoccupations" : "",
      questions > total * 0.3 ? "- Beaucoup de questions — créer un post FAQ ou story Q&A" : "",
      sortedThemes.find(([t]) => t === "Prix") ? "- Le prix est un sujet — communiquer sur la valeur (qualité vinyle, indépendant)" : "",
      sortedThemes.find(([t]) => t === "Dates/Sorties") ? "- La communauté attend des annonces — teaser les prochaines sorties" : "",
    ]
      .filter(Boolean)
      .join("\n");
  },
});

export const INTELLIGENCE_TOOLS = [searchTrends, predictScore, adaptContent, analyzeSentiment];
