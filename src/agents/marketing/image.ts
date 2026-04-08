// ============================================
// Génération d'images IA + Upload Supabase Storage
// DALL-E 3 → Supabase Storage → URL publique → Buffer
// ============================================

import { z } from "zod";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// ---- Clients (initialisés à la demande) ----

function getOpenAIClient(): OpenAI {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error(
      "OPENAI_API_KEY non définie. Crée une clé sur https://platform.openai.com/api-keys"
    );
  }
  return new OpenAI({ apiKey: key });
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Variables Supabase manquantes (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  }
  return createClient(url, key);
}

// ---- Upload vers Supabase Storage ----

async function uploadToSupabase(
  imageBuffer: Buffer,
  filename: string
): Promise<string> {
  const supabase = getSupabaseClient();
  const bucket = "marketing-images";

  // Créer le bucket s'il n'existe pas (public)
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find((b) => b.name === bucket)) {
    await supabase.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: 10485760, // 10 MB
    });
  }

  const filePath = `generated/${filename}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, imageBuffer, {
      contentType: "image/png",
      upsert: true,
    });

  if (error) throw new Error(`Upload Supabase: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

// ---- Sauvegarde locale (fallback) ----

function saveLocally(imageBuffer: Buffer, filename: string): string {
  const dir = path.join(process.cwd(), "marketing-output", "images");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filepath = path.join(dir, filename);
  fs.writeFileSync(filepath, imageBuffer);
  return filepath;
}

// ============================================
// Outils de génération d'images
// ============================================

export const generateImage = betaZodTool({
  name: "generate_image",
  description:
    "Génère une image pour les réseaux sociaux via DALL-E 3. Le prompt doit être en anglais et très descriptif. L'image est uploadée sur Supabase Storage et l'URL publique est retournée (utilisable dans buffer_publish_post). Sauvegarde aussi localement dans marketing-output/images/.",
  inputSchema: z.object({
    prompt: z
      .string()
      .describe(
        "Prompt DALL-E en ANGLAIS, très descriptif. Inclure : style (hip-hop, old school, urban), couleurs (gold #C8A050, black, cream #F5E6C8), composition, mood. Ne JAMAIS inclure de texte lisible dans l'image."
      ),
    size: z
      .enum(["1024x1024", "1792x1024", "1024x1792"])
      .describe(
        "Dimensions : 1024x1024 (post carré IG/FB), 1792x1024 (bannière YouTube/FB), 1024x1792 (story/reel IG/TikTok)"
      ),
    filename: z
      .string()
      .describe("Nom du fichier (sans extension, ex: post-lancement-boutique)"),
    style: z
      .enum(["vivid", "natural"])
      .optional()
      .describe("Style DALL-E : vivid (saturé, dramatique) ou natural (réaliste). Défaut: vivid"),
  }),
  run: async ({ prompt, size, filename, style }) => {
    try {
      const openai = getOpenAIClient();

      // Enrichir le prompt avec l'identité La M.U.G
      const brandPrompt = `${prompt}.
Color palette: deep black (#0A0A0A), gold (#C8A050), cream (#F5E6C8), dark gold (#8B6914).
Style: authentic hip-hop culture, urban, old school vibes.
IMPORTANT: Do NOT include any readable text, letters, words or typography in the image.`;

      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: brandPrompt,
        n: 1,
        size: size,
        style: style || "vivid",
        response_format: "b64_json",
      });

      const b64 = response.data[0].b64_json;
      if (!b64) throw new Error("Pas de données image retournées par DALL-E");

      const imageBuffer = Buffer.from(b64, "base64");
      const pngFilename = `${filename}.png`;

      // Sauvegarder localement
      const localPath = saveLocally(imageBuffer, pngFilename);

      // Upload vers Supabase Storage pour URL publique
      let publicUrl: string;
      try {
        publicUrl = await uploadToSupabase(imageBuffer, pngFilename);
      } catch (uploadErr) {
        return `Image générée et sauvegardée localement : ${localPath}\n⚠️ Upload Supabase échoué : ${uploadErr instanceof Error ? uploadErr.message : String(uploadErr)}\nL'image n'a pas d'URL publique — upload-la manuellement pour l'utiliser dans Buffer.`;
      }

      // Sauvegarder le prompt utilisé pour référence
      const metaPath = path.join(
        process.cwd(),
        "marketing-output",
        "images",
        `${filename}.meta.txt`
      );
      fs.writeFileSync(
        metaPath,
        `Prompt: ${prompt}\nSize: ${size}\nStyle: ${style || "vivid"}\nURL: ${publicUrl}\nDate: ${new Date().toISOString()}\n`,
        "utf-8"
      );

      return `✅ Image générée avec succès !\n\n🖼️  URL publique : ${publicUrl}\n💾 Fichier local : ${localPath}\n📐 Dimensions : ${size}\n\nCette URL peut être utilisée directement dans buffer_publish_post (paramètre image_urls).`;
    } catch (error) {
      return `Erreur génération image: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

export const generateImageVariations = betaZodTool({
  name: "generate_image_variations",
  description:
    "Génère plusieurs variantes d'un même concept visuel pour A/B testing ou pour différentes plateformes. Retourne les URLs publiques de chaque variante.",
  inputSchema: z.object({
    base_prompt: z
      .string()
      .describe("Prompt de base en ANGLAIS décrivant le concept visuel"),
    variations: z
      .array(
        z.object({
          suffix: z.string().describe("Suffixe pour le nom de fichier (ex: carre, story, banniere)"),
          size: z.enum(["1024x1024", "1792x1024", "1024x1792"]).describe("Dimensions"),
          prompt_addition: z
            .string()
            .optional()
            .describe("Ajout au prompt de base pour cette variante"),
        })
      )
      .describe("Liste des variantes à générer"),
    filename_prefix: z.string().describe("Préfixe commun pour les noms de fichiers"),
  }),
  run: async ({ base_prompt, variations, filename_prefix }) => {
    const openai = getOpenAIClient();
    const results: string[] = [];

    for (const variant of variations) {
      try {
        const fullPrompt = variant.prompt_addition
          ? `${base_prompt}. ${variant.prompt_addition}`
          : base_prompt;

        const brandPrompt = `${fullPrompt}.
Color palette: deep black (#0A0A0A), gold (#C8A050), cream (#F5E6C8), dark gold (#8B6914).
Style: authentic hip-hop culture, urban, old school vibes.
IMPORTANT: Do NOT include any readable text, letters, words or typography in the image.`;

        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: brandPrompt,
          n: 1,
          size: variant.size,
          style: "vivid",
          response_format: "b64_json",
        });

        const b64 = response.data[0].b64_json;
        if (!b64) throw new Error("Pas de données image");

        const imageBuffer = Buffer.from(b64, "base64");
        const pngFilename = `${filename_prefix}-${variant.suffix}.png`;

        saveLocally(imageBuffer, pngFilename);

        let publicUrl: string;
        try {
          publicUrl = await uploadToSupabase(imageBuffer, pngFilename);
        } catch {
          results.push(`⚠️ ${variant.suffix} (${variant.size}) : sauvé localement, upload échoué`);
          continue;
        }

        results.push(`✅ ${variant.suffix} (${variant.size}) : ${publicUrl}`);
      } catch (error) {
        results.push(
          `❌ ${variant.suffix} : ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    return `## Variantes générées\n\n${results.join("\n")}`;
  },
});

export const listGeneratedImages = betaZodTool({
  name: "list_generated_images",
  description:
    "Liste toutes les images déjà générées (fichiers locaux + URLs Supabase si disponibles).",
  inputSchema: z.object({}),
  run: async () => {
    const dir = path.join(process.cwd(), "marketing-output", "images");
    if (!fs.existsSync(dir)) return "Aucune image générée.";

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".png"));
    if (files.length === 0) return "Aucune image générée.";

    const lines = files.map((f) => {
      const metaFile = path.join(dir, f.replace(".png", ".meta.txt"));
      let url = "";
      if (fs.existsSync(metaFile)) {
        const meta = fs.readFileSync(metaFile, "utf-8");
        const urlMatch = meta.match(/URL: (.+)/);
        if (urlMatch) url = ` → ${urlMatch[1]}`;
      }
      return `🖼️  ${f}${url}`;
    });

    return `## Images générées (${files.length})\n\n${lines.join("\n")}`;
  },
});

// Export
export const IMAGE_TOOLS = [generateImage, generateImageVariations, listGeneratedImages];
