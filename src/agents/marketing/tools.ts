// ============================================
// Outils de l'agent marketing La M.U.G
// Chaque outil = une capacité de l'agent
// ============================================

import { z } from "zod";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import fs from "fs";
import path from "path";
import { BRAND_CONFIG } from "./config.js";
import { BUFFER_TOOLS } from "./buffer.js";
import { IMAGE_TOOLS } from "./image.js";
import { ANALYTICS_TOOLS } from "./analytics.js";
import { NEWSLETTER_TOOLS } from "./newsletter.js";
import { SMART_LINKS_TOOLS } from "./smart-links.js";
import { SALES_TOOLS } from "./sales.js";
import { INTELLIGENCE_TOOLS } from "./intelligence.js";

const OUTPUT_DIR = path.join(process.cwd(), "marketing-output");

// Assure que les dossiers existent
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// ---- État / progression ----

const PROGRESS_FILE = path.join(OUTPUT_DIR, "progress.json");

interface TaskProgress {
  semaine: number;
  tache: string;
  statut: "todo" | "en_cours" | "fait";
  date_completion?: string;
  fichier_output?: string;
}

function loadProgress(): TaskProgress[] {
  ensureDir(OUTPUT_DIR);
  if (!fs.existsSync(PROGRESS_FILE)) return [];
  return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"));
}

function saveProgress(tasks: TaskProgress[]) {
  ensureDir(OUTPUT_DIR);
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(tasks, null, 2), "utf-8");
}

// ============================================
// Définition des outils (betaZodTool)
// ============================================

export const getBrandInfo = betaZodTool({
  name: "get_brand_info",
  description:
    "Récupère toutes les informations de la marque La M.U.G : identité, sites, discographie, ton, hashtags. Utilise cet outil AVANT de générer tout contenu pour assurer la cohérence.",
  inputSchema: z.object({
    section: z
      .enum([
        "all",
        "identity",
        "sites",
        "discography",
        "social",
        "hashtags",
        "tone",
        "activities",
      ])
      .describe("Section de la config à récupérer"),
  }),
  run: async ({ section }) => {
    if (section === "all") return JSON.stringify(BRAND_CONFIG, null, 2);
    const sectionMap: Record<string, unknown> = {
      identity: {
        name: BRAND_CONFIG.name,
        fullName: BRAND_CONFIG.fullName,
        founder: BRAND_CONFIG.founder,
        type: BRAND_CONFIG.type,
        description: BRAND_CONFIG.description,
      },
      sites: BRAND_CONFIG.sites,
      discography: BRAND_CONFIG.discography,
      social: BRAND_CONFIG.social,
      hashtags: BRAND_CONFIG.hashtags,
      tone: BRAND_CONFIG.tone,
      activities: BRAND_CONFIG.activities,
    };
    return JSON.stringify(sectionMap[section] ?? {}, null, 2);
  },
});

export const savePost = betaZodTool({
  name: "save_post",
  description:
    "Sauvegarde un post réseaux sociaux prêt à publier dans un fichier markdown. Inclut le texte, les hashtags, le CTA, et la plateforme cible.",
  inputSchema: z.object({
    semaine: z.number().min(1).max(4).describe("Numéro de la semaine (1-4)"),
    platform: z
      .enum(["instagram", "tiktok", "youtube", "facebook", "twitter", "all"])
      .describe("Plateforme cible"),
    type: z
      .enum([
        "post",
        "reel",
        "story",
        "carousel",
        "thread",
        "short",
        "live_script",
      ])
      .describe("Type de contenu"),
    title: z.string().describe("Titre court du post (pour le nom de fichier)"),
    content: z
      .string()
      .describe(
        "Contenu complet du post : texte + hashtags + CTA + instructions visuelles"
      ),
    visual_description: z
      .string()
      .describe(
        "Description détaillée du visuel à créer sur Canva (couleurs, mise en page, éléments)"
      ),
    publish_day: z
      .string()
      .optional()
      .describe("Jour de publication suggéré (ex: Lundi S1)"),
  }),
  run: async ({ semaine, platform, type, title, content, visual_description, publish_day }) => {
    const dir = path.join(OUTPUT_DIR, `semaine-${semaine}`);
    ensureDir(dir);

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const filename = `${platform}-${type}-${slug}.md`;
    const filepath = path.join(dir, filename);

    const markdown = `# ${title}

**Plateforme** : ${platform}
**Type** : ${type}
**Semaine** : ${semaine}
${publish_day ? `**Jour** : ${publish_day}` : ""}

---

## Texte du post

${content}

---

## Brief visuel (Canva)

${visual_description}

---

## Checklist publication
- [ ] Visuel créé sur Canva
- [ ] Texte relu et validé
- [ ] Hashtags vérifiés
- [ ] Lien bio mis à jour si nécessaire
- [ ] Publié à l'heure optimale
- [ ] Story de rappel publiée
`;

    fs.writeFileSync(filepath, markdown, "utf-8");

    // Mettre à jour la progression
    const progress = loadProgress();
    progress.push({
      semaine,
      tache: `${platform}/${type}: ${title}`,
      statut: "fait",
      date_completion: new Date().toISOString().split("T")[0],
      fichier_output: filepath,
    });
    saveProgress(progress);

    return `Post sauvegardé : ${filepath}`;
  },
});

export const saveCalendar = betaZodTool({
  name: "save_calendar",
  description:
    "Sauvegarde un calendrier éditorial complet pour une semaine donnée. Inclut tous les posts planifiés avec horaires, plateformes et types.",
  inputSchema: z.object({
    semaine: z.number().min(1).max(4).describe("Numéro de la semaine"),
    calendar_content: z
      .string()
      .describe(
        "Calendrier complet en format markdown avec tableau : jour, heure, plateforme, type, sujet, lien vers fichier"
      ),
  }),
  run: async ({ semaine, calendar_content }) => {
    const dir = path.join(OUTPUT_DIR, `semaine-${semaine}`);
    ensureDir(dir);

    const filepath = path.join(dir, "calendrier-editorial.md");
    const markdown = `# Calendrier Éditorial — Semaine ${semaine}

> Généré par l'Agent Marketing La M.U.G
> Date : ${new Date().toISOString().split("T")[0]}

${calendar_content}
`;

    fs.writeFileSync(filepath, markdown, "utf-8");
    return `Calendrier semaine ${semaine} sauvegardé : ${filepath}`;
  },
});

export const saveVisualBrief = betaZodTool({
  name: "save_visual_brief",
  description:
    "Sauvegarde un brief visuel détaillé pour création sur Canva. Inclut dimensions, palette, éléments, textes à intégrer.",
  inputSchema: z.object({
    semaine: z.number().min(1).max(4).describe("Numéro de la semaine"),
    title: z.string().describe("Nom du visuel"),
    platform: z
      .enum(["instagram", "tiktok", "youtube", "facebook", "twitter", "all"])
      .describe("Plateforme cible"),
    dimensions: z.string().describe("Dimensions du visuel (ex: 1080x1080)"),
    brief: z
      .string()
      .describe(
        "Brief complet : couleurs hex, éléments visuels, disposition, textes, police suggérée, mood"
      ),
  }),
  run: async ({ semaine, title, platform, dimensions, brief }) => {
    const dir = path.join(OUTPUT_DIR, `semaine-${semaine}`, "visuels");
    ensureDir(dir);

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const filepath = path.join(dir, `brief-${platform}-${slug}.md`);

    const markdown = `# Brief Visuel : ${title}

**Plateforme** : ${platform}
**Dimensions** : ${dimensions}
**Palette** : Gold #C8A050 | Noir #0A0A0A | Crème #F5E6C8

---

${brief}

---

## Checklist Canva
- [ ] Template créé aux bonnes dimensions
- [ ] Palette de couleurs appliquée
- [ ] Logo La M.U.G intégré
- [ ] Textes ajoutés et lisibles
- [ ] Export en PNG haute qualité
- [ ] Version Story (9:16) créée si nécessaire
`;

    fs.writeFileSync(filepath, markdown, "utf-8");
    return `Brief visuel sauvegardé : ${filepath}`;
  },
});

export const saveInfluencerDraft = betaZodTool({
  name: "save_influencer_draft",
  description:
    "Sauvegarde un message de prospection pour un micro-influenceur vinyle/rap. Message personnalisable avec placeholders.",
  inputSchema: z.object({
    influencer_type: z
      .string()
      .describe(
        "Type d'influenceur ciblé (ex: collectionneur vinyle, blogueur rap FR, DJ)"
      ),
    platform: z
      .enum(["instagram", "tiktok", "youtube", "email"])
      .describe("Plateforme de contact"),
    message: z
      .string()
      .describe(
        "Message complet avec placeholders {{NOM}}, {{COMPTE}}, etc."
      ),
    notes: z
      .string()
      .optional()
      .describe("Notes de ciblage et critères de sélection"),
  }),
  run: async ({ influencer_type, platform, message, notes }) => {
    const dir = path.join(OUTPUT_DIR, "semaine-3", "influenceurs");
    ensureDir(dir);

    const slug = influencer_type
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const filepath = path.join(dir, `dm-${platform}-${slug}.md`);

    const markdown = `# Prospection Influenceur : ${influencer_type}

**Plateforme de contact** : ${platform}
**Type** : ${influencer_type}

---

## Message type

${message}

---

${notes ? `## Notes de ciblage\n\n${notes}\n\n---\n` : ""}

## Checklist prospection
- [ ] 5 comptes identifiés et listés
- [ ] Profils vérifiés (engagement réel, pas de bots)
- [ ] Messages personnalisés (pas de copier-coller brut)
- [ ] Suivi des réponses dans un tableur
- [ ] Relance J+3 si pas de réponse
`;

    fs.writeFileSync(filepath, markdown, "utf-8");
    return `Draft influenceur sauvegardé : ${filepath}`;
  },
});

export const saveBioLinks = betaZodTool({
  name: "save_bio_links",
  description:
    "Sauvegarde la configuration du lien bio centralisé (Linktree ou page /liens) avec tous les liens et leur ordre.",
  inputSchema: z.object({
    links: z
      .string()
      .describe(
        "Configuration complète du lien bio en markdown : titre, URL, emoji, ordre d'affichage"
      ),
    bio_texts: z
      .string()
      .describe(
        "Textes de bio pour chaque plateforme (Instagram, TikTok, YouTube, etc.)"
      ),
  }),
  run: async ({ links, bio_texts }) => {
    const dir = path.join(OUTPUT_DIR, "semaine-1");
    ensureDir(dir);

    const filepath = path.join(dir, "bio-et-liens.md");
    const markdown = `# Configuration Bio & Liens — La M.U.G

> À configurer sur Linktree (ou page /liens sur la-mug.com)

---

## Liens (dans l'ordre d'affichage)

${links}

---

## Textes de bio par plateforme

${bio_texts}

---

## Checklist
- [ ] Linktree créé et configuré
- [ ] Lien ajouté dans bio Instagram
- [ ] Lien ajouté dans bio TikTok
- [ ] Lien ajouté dans description YouTube
- [ ] Lien ajouté sur page Facebook
- [ ] Palette de couleurs appliquée sur Linktree
`;

    fs.writeFileSync(filepath, markdown, "utf-8");
    return `Configuration bio & liens sauvegardée : ${filepath}`;
  },
});

export const savePromoStrategy = betaZodTool({
  name: "save_promo_strategy",
  description:
    "Sauvegarde une stratégie de campagne promotionnelle (lancement boutique, code promo, etc.)",
  inputSchema: z.object({
    campaign_name: z.string().describe("Nom de la campagne"),
    strategy: z
      .string()
      .describe(
        "Stratégie complète : objectif, durée, mécaniques, messages, KPIs"
      ),
  }),
  run: async ({ campaign_name, strategy }) => {
    const dir = path.join(OUTPUT_DIR, "semaine-3");
    ensureDir(dir);

    const slug = campaign_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const filepath = path.join(dir, `campagne-${slug}.md`);

    const markdown = `# Campagne : ${campaign_name}

> Générée par l'Agent Marketing La M.U.G

---

${strategy}
`;

    fs.writeFileSync(filepath, markdown, "utf-8");
    return `Stratégie campagne sauvegardée : ${filepath}`;
  },
});

export const getProgress = betaZodTool({
  name: "get_progress",
  description:
    "Affiche la progression globale du plan marketing 4 semaines. Montre ce qui est fait, en cours, et à faire.",
  inputSchema: z.object({
    semaine: z
      .number()
      .min(0)
      .max(4)
      .optional()
      .describe("Filtrer par semaine (0 = toutes)"),
  }),
  run: async ({ semaine }) => {
    const progress = loadProgress();
    const filtered =
      semaine && semaine > 0
        ? progress.filter((t) => t.semaine === semaine)
        : progress;

    if (filtered.length === 0) {
      return "Aucune tâche enregistrée. L'agent n'a pas encore généré de contenu.";
    }

    const summary = filtered
      .map(
        (t) =>
          `[S${t.semaine}] ${t.statut === "fait" ? "✅" : t.statut === "en_cours" ? "🔄" : "⬜"} ${t.tache}`
      )
      .join("\n");

    const stats = {
      total: filtered.length,
      fait: filtered.filter((t) => t.statut === "fait").length,
      en_cours: filtered.filter((t) => t.statut === "en_cours").length,
      todo: filtered.filter((t) => t.statut === "todo").length,
    };

    return `## Progression${semaine ? ` — Semaine ${semaine}` : " globale"}\n\n${summary}\n\n**Total** : ${stats.fait}/${stats.total} fait | ${stats.en_cours} en cours | ${stats.todo} à faire`;
  },
});

export const saveLiveScript = betaZodTool({
  name: "save_live_script",
  description:
    "Sauvegarde un script de live Instagram/TikTok avec déroulé minuté, talking points, et CTA.",
  inputSchema: z.object({
    title: z.string().describe("Titre du live"),
    platform: z
      .enum(["instagram", "tiktok", "youtube"])
      .describe("Plateforme du live"),
    duration_minutes: z.number().describe("Durée prévue en minutes"),
    script: z
      .string()
      .describe(
        "Script complet avec déroulé minuté, talking points, interactions audience, CTA"
      ),
  }),
  run: async ({ title, platform, duration_minutes, script }) => {
    const dir = path.join(OUTPUT_DIR, "semaine-3");
    ensureDir(dir);

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const filepath = path.join(dir, `live-${platform}-${slug}.md`);

    const markdown = `# Live : ${title}

**Plateforme** : ${platform}
**Durée** : ${duration_minutes} min

---

${script}

---

## Checklist avant le live
- [ ] Connexion internet stable
- [ ] Éclairage vérifié
- [ ] Boutique ouverte sur un écran secondaire
- [ ] Story d'annonce publiée 1h avant
- [ ] Titre et description prêts
- [ ] Code promo prêt à partager
`;

    fs.writeFileSync(filepath, markdown, "utf-8");
    return `Script live sauvegardé : ${filepath}`;
  },
});

// Export de tous les outils
export const ALL_TOOLS = [
  getBrandInfo,
  savePost,
  saveCalendar,
  saveVisualBrief,
  saveInfluencerDraft,
  saveBioLinks,
  savePromoStrategy,
  getProgress,
  saveLiveScript,
  ...BUFFER_TOOLS,
  ...IMAGE_TOOLS,
  ...ANALYTICS_TOOLS,
  ...NEWSLETTER_TOOLS,
  ...SMART_LINKS_TOOLS,
  ...SALES_TOOLS,
  ...INTELLIGENCE_TOOLS,
];
