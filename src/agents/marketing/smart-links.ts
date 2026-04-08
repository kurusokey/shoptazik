// ============================================
// Smart Links — UTM tracking + QR codes
// Tracking précis de chaque lien partagé
// ============================================

import { z } from "zod";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Variables Supabase manquantes");
  return createClient(url, key);
}

// ---- UTM Builder ----

function buildUtmUrl(
  baseUrl: string,
  source: string,
  medium: string,
  campaign: string,
  content?: string,
  term?: string
): string {
  const url = new URL(baseUrl);
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", campaign);
  if (content) url.searchParams.set("utm_content", content);
  if (term) url.searchParams.set("utm_term", term);
  return url.toString();
}

// ============================================
// Outils Smart Links
// ============================================

export const createUtmLink = betaZodTool({
  name: "create_utm_link",
  description:
    "Crée un lien avec paramètres UTM pour tracker la source du trafic. Utilise cet outil pour CHAQUE lien partagé dans un post. Le lien est aussi sauvegardé en base pour suivi.",
  inputSchema: z.object({
    url: z
      .string()
      .describe("URL de destination (ex: https://boutique.la-mug.com)"),
    source: z
      .enum(["instagram", "tiktok", "twitter", "facebook", "youtube", "newsletter", "qrcode"])
      .describe("Source du trafic (plateforme d'où vient le clic)"),
    medium: z
      .enum(["social", "email", "qr", "paid", "referral"])
      .describe("Médium marketing"),
    campaign: z
      .string()
      .describe("Nom de la campagne (ex: lancement-boutique, semaine2-edito)"),
    content: z
      .string()
      .optional()
      .describe("Variante du contenu pour A/B testing (ex: variante-a, post-lundi)"),
  }),
  run: async ({ url, source, medium, campaign, content }) => {
    const utmUrl = buildUtmUrl(url, source, medium, campaign, content);

    // Sauvegarder en base pour tracking
    try {
      const supabase = getSupabase();
      await supabase.from("utm_links").insert({
        original_url: url,
        utm_url: utmUrl,
        source,
        medium,
        campaign,
        content: content || null,
      });
    } catch {
      // Table pas encore créée, pas grave
    }

    return `🔗 Lien UTM créé :\n${utmUrl}\n\nUtilise ce lien dans ton post au lieu de ${url}`;
  },
});

export const generateQrCode = betaZodTool({
  name: "generate_qr_code",
  description:
    "Génère un QR code pointant vers un des sites La M.U.G. Idéal pour flyers, inserts vinyle, affiches ateliers. Le QR code est sauvegardé en PNG et uploadé sur Supabase Storage.",
  inputSchema: z.object({
    url: z.string().describe("URL de destination du QR code"),
    label: z.string().describe("Label pour le nom de fichier (ex: boutique, atelier-mars)"),
    size: z.number().optional().describe("Taille en pixels (défaut: 400)"),
    campaign: z.string().optional().describe("Campagne UTM à ajouter au lien"),
  }),
  run: async ({ url, label, size, campaign }) => {
    // Ajouter UTM si campagne spécifiée
    const finalUrl = campaign
      ? buildUtmUrl(url, "qrcode", "qr", campaign)
      : url;

    const pxSize = size || 400;
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    // Générer le QR code en PNG buffer
    const qrBuffer = await QRCode.toBuffer(finalUrl, {
      width: pxSize,
      margin: 2,
      color: {
        dark: "#C8A050",  // Gold La M.U.G
        light: "#0A0A0A", // Noir fond
      },
      errorCorrectionLevel: "H",
    });

    // Sauvegarder localement
    const dir = path.join(process.cwd(), "marketing-output", "qrcodes");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filename = `qr-${slug}.png`;
    const filepath = path.join(dir, filename);
    fs.writeFileSync(filepath, qrBuffer);

    // Upload Supabase Storage
    let publicUrl = "";
    try {
      const supabase = getSupabase();
      const bucket = "marketing-images";

      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find((b) => b.name === bucket)) {
        await supabase.storage.createBucket(bucket, { public: true });
      }

      await supabase.storage
        .from(bucket)
        .upload(`qrcodes/${filename}`, qrBuffer, {
          contentType: "image/png",
          upsert: true,
        });

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(`qrcodes/${filename}`);
      publicUrl = data.publicUrl;
    } catch {
      // Pas grave, on a le fichier local
    }

    const result = [`✅ QR Code généré !`, `📎 Pointe vers : ${finalUrl}`, `💾 Fichier : ${filepath}`];
    if (publicUrl) result.push(`🌐 URL publique : ${publicUrl}`);
    result.push(`\nCouleurs : Gold #C8A050 sur noir #0A0A0A (identité La M.U.G)`);

    return result.join("\n");
  },
});

export const listUtmLinks = betaZodTool({
  name: "list_utm_links",
  description:
    "Liste tous les liens UTM créés, groupés par campagne. Permet de vérifier quels liens sont en circulation.",
  inputSchema: z.object({
    campaign: z.string().optional().describe("Filtrer par campagne"),
  }),
  run: async ({ campaign }) => {
    try {
      const supabase = getSupabase();

      let query = supabase
        .from("utm_links")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (campaign) query = query.eq("campaign", campaign);

      const { data, error } = await query;
      if (error) return `Erreur: ${error.message}`;
      if (!data || data.length === 0) return "Aucun lien UTM enregistré.";

      // Grouper par campagne
      const byCampaign: Record<string, typeof data> = {};
      for (const link of data) {
        const camp = link.campaign || "sans-campagne";
        if (!byCampaign[camp]) byCampaign[camp] = [];
        byCampaign[camp].push(link);
      }

      const lines: string[] = [`## Liens UTM (${data.length} total)\n`];
      for (const [camp, links] of Object.entries(byCampaign)) {
        lines.push(`### Campagne : ${camp}`);
        for (const l of links) {
          lines.push(`- [${l.source}/${l.medium}] ${l.original_url}`);
        }
        lines.push("");
      }

      return lines.join("\n");
    } catch {
      return "Table utm_links non disponible. Les liens sont créés mais pas encore trackés en base.";
    }
  },
});

export const SMART_LINKS_TOOLS = [createUtmLink, generateQrCode, listUtmLinks];
