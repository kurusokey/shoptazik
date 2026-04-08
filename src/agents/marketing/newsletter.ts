// ============================================
// Newsletter — Intégration Resend
// Envoi de campagnes email aux abonnés
// ============================================

import { z } from "zod";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY non définie.");
  return new Resend(key);
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Variables Supabase manquantes");
  return createClient(url, key);
}

// ---- HTML template newsletter ----

function buildNewsletterHtml(
  title: string,
  content: string,
  cta_text?: string,
  cta_url?: string
): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <!-- Header -->
    <div style="text-align:center;padding:30px 0;border-bottom:2px solid #C8A050;">
      <h1 style="color:#C8A050;font-size:28px;margin:0;">La M.U.G</h1>
      <p style="color:#F5E6C8;font-size:14px;margin:5px 0 0;">La Maison Urbaine Générale</p>
    </div>

    <!-- Content -->
    <div style="padding:30px 0;color:#F5E6C8;font-size:16px;line-height:1.6;">
      <h2 style="color:#C8A050;font-size:22px;">${title}</h2>
      ${content}
    </div>

    ${cta_text && cta_url ? `
    <!-- CTA -->
    <div style="text-align:center;padding:20px 0;">
      <a href="${cta_url}" style="display:inline-block;background:#C8A050;color:#0A0A0A;padding:14px 32px;text-decoration:none;font-weight:bold;font-size:16px;border-radius:4px;">${cta_text}</a>
    </div>` : ""}

    <!-- Footer -->
    <div style="padding:20px 0;border-top:1px solid #333;text-align:center;color:#888;font-size:12px;">
      <p>
        <a href="https://la-mug.com" style="color:#C8A050;text-decoration:none;">la-mug.com</a> ·
        <a href="https://fdy.art" style="color:#C8A050;text-decoration:none;">fdy.art</a> ·
        <a href="https://boutique.la-mug.com" style="color:#C8A050;text-decoration:none;">boutique.la-mug.com</a>
      </p>
      <p>© ${new Date().getFullYear()} La M.U.G — Un projet de Fdy Phenomen</p>
      <p style="color:#666;font-size:11px;">Tu reçois cet email car tu t'es inscrit(e) à la newsletter La M.U.G.</p>
    </div>
  </div>
</body>
</html>`;
}

// ============================================
// Outils Newsletter
// ============================================

export const previewNewsletter = betaZodTool({
  name: "preview_newsletter",
  description:
    "Génère un aperçu HTML de la newsletter sans l'envoyer. Sauvegarde le fichier localement pour vérification.",
  inputSchema: z.object({
    subject: z.string().describe("Objet de l'email"),
    title: z.string().describe("Titre principal dans le corps de l'email"),
    content: z
      .string()
      .describe("Contenu HTML de la newsletter (paragraphes avec balises <p>, listes avec <ul>/<li>)"),
    cta_text: z.string().optional().describe("Texte du bouton CTA (ex: Découvrir la boutique)"),
    cta_url: z.string().optional().describe("URL du bouton CTA"),
  }),
  run: async ({ subject, title, content, cta_text, cta_url }) => {
    const html = buildNewsletterHtml(title, content, cta_text, cta_url);

    const fs = await import("fs");
    const path = await import("path");
    const dir = path.join(process.cwd(), "marketing-output", "newsletters");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const slug = subject.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const filepath = path.join(dir, `preview-${slug}.html`);
    fs.writeFileSync(filepath, html, "utf-8");

    return `📧 Aperçu newsletter sauvegardé : ${filepath}\nOuvre ce fichier dans un navigateur pour vérifier le rendu.\nObjet : ${subject}`;
  },
});

export const sendNewsletter = betaZodTool({
  name: "send_newsletter",
  description:
    "Envoie une newsletter à tous les abonnés (table newsletter_subscribers dans Supabase) ou à une liste d'emails spécifique. VALIDATION REQUISE avant envoi.",
  inputSchema: z.object({
    subject: z.string().describe("Objet de l'email"),
    title: z.string().describe("Titre principal"),
    content: z.string().describe("Contenu HTML de la newsletter"),
    cta_text: z.string().optional().describe("Texte du bouton CTA"),
    cta_url: z.string().optional().describe("URL du bouton CTA"),
    test_email: z
      .string()
      .optional()
      .describe("Si défini, envoie uniquement à cette adresse (test). Si absent, envoie à tous les abonnés."),
  }),
  run: async ({ subject, title, content, cta_text, cta_url, test_email }) => {
    const readline = await import("readline");

    // Déterminer les destinataires
    let recipients: string[] = [];

    if (test_email) {
      recipients = [test_email];
    } else {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from("newsletter_subscribers")
          .select("email")
          .eq("active", true);
        if (error) return `Erreur récupération abonnés: ${error.message}`;
        recipients = (data || []).map((d: { email: string }) => d.email);
      } catch {
        return "Table newsletter_subscribers introuvable. Crée-la dans Supabase ou utilise test_email.";
      }
    }

    if (recipients.length === 0) {
      return "Aucun destinataire trouvé. Utilise test_email pour un envoi test.";
    }

    // VALIDATION OBLIGATOIRE
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const confirmed = await new Promise<boolean>((resolve) => {
      console.log("\n╔══════════════════════════════════════════════╗");
      console.log("║       VALIDATION REQUISE AVANT ENVOI EMAIL   ║");
      console.log("╚══════════════════════════════════════════════╝\n");
      console.log(`📧 Objet : ${subject}`);
      console.log(`👥 Destinataires : ${recipients.length} (${test_email ? "TEST" : "PRODUCTION"})`);
      if (test_email) console.log(`   → ${test_email}`);
      console.log("──────────────────────────────────────────────");
      rl.question("Envoyer ? (oui/non) > ", (answer) => {
        rl.close();
        resolve(["oui", "o", "yes", "y"].includes(answer.trim().toLowerCase()));
      });
    });

    if (!confirmed) return "⛔ Envoi annulé par l'utilisateur.";

    // Envoyer
    const resend = getResend();
    const html = buildNewsletterHtml(title, content, cta_text, cta_url);
    let sent = 0;
    let failed = 0;

    // Resend batch (max 100 par appel)
    for (let i = 0; i < recipients.length; i += 50) {
      const batch = recipients.slice(i, i + 50);
      for (const email of batch) {
        try {
          await resend.emails.send({
            from: "La M.U.G <newsletter@la-mug.com>",
            to: email,
            subject,
            html,
          });
          sent++;
        } catch {
          failed++;
        }
      }
    }

    return `📧 Newsletter envoyée !\n✅ ${sent} envoyé(s) | ❌ ${failed} échoué(s)`;
  },
});

export const manageSubscribers = betaZodTool({
  name: "manage_subscribers",
  description:
    "Gère la liste des abonnés newsletter : voir le nombre, ajouter, ou désactiver un abonné.",
  inputSchema: z.object({
    action: z
      .enum(["count", "add", "remove"])
      .describe("Action : count (nombre d'abonnés), add (ajouter), remove (désactiver)"),
    email: z.string().optional().describe("Email (requis pour add/remove)"),
  }),
  run: async ({ action, email }) => {
    try {
      const supabase = getSupabase();

      if (action === "count") {
        const { count, error } = await supabase
          .from("newsletter_subscribers")
          .select("*", { count: "exact", head: true })
          .eq("active", true);
        if (error) return `Erreur: ${error.message}`;
        return `📧 ${count ?? 0} abonné(s) actif(s) à la newsletter.`;
      }

      if (!email) return "Email requis pour cette action.";

      if (action === "add") {
        const { error } = await supabase
          .from("newsletter_subscribers")
          .upsert({ email, active: true }, { onConflict: "email" });
        if (error) return `Erreur: ${error.message}`;
        return `✅ ${email} ajouté(e) à la newsletter.`;
      }

      if (action === "remove") {
        const { error } = await supabase
          .from("newsletter_subscribers")
          .update({ active: false })
          .eq("email", email);
        if (error) return `Erreur: ${error.message}`;
        return `✅ ${email} désabonné(e).`;
      }

      return "Action inconnue.";
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

export const NEWSLETTER_TOOLS = [previewNewsletter, sendNewsletter, manageSubscribers];
