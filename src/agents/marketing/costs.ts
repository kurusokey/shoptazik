// ============================================
// Suivi des coûts API + Webhooks + Retry
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

// ---- Prix par service (USD) ----

const PRICING = {
  anthropic: { input_per_1m: 3.0, output_per_1m: 15.0 }, // Sonnet 4.6
  openai: { per_image_1024: 0.04, per_image_1792: 0.08 }, // DALL-E 3
  resend: { per_email: 0.001 }, // ~$1/1000 emails
  buffer: { monthly: 0 }, // Plan gratuit
} as const;

// ============================================
// Outils de coûts
// ============================================

export const trackApiCost = betaZodTool({
  name: "track_api_cost",
  description:
    "Enregistre le coût d'un appel API. Appelle cet outil après chaque opération coûteuse (génération image, appel Claude, envoi email).",
  inputSchema: z.object({
    service: z
      .enum(["anthropic", "openai", "buffer", "resend"])
      .describe("Service API utilisé"),
    operation: z
      .string()
      .describe("Description de l'opération (ex: generate_image, chat_completion, send_email)"),
    tokens_input: z.number().optional().describe("Tokens d'entrée (Anthropic)"),
    tokens_output: z.number().optional().describe("Tokens de sortie (Anthropic)"),
    quantity: z.number().optional().describe("Quantité (images, emails, etc.)"),
  }),
  run: async ({ service, operation, tokens_input, tokens_output, quantity }) => {
    try {
      let cost = 0;

      if (service === "anthropic") {
        const input = tokens_input || 0;
        const output = tokens_output || 0;
        cost =
          (input / 1_000_000) * PRICING.anthropic.input_per_1m +
          (output / 1_000_000) * PRICING.anthropic.output_per_1m;
      } else if (service === "openai") {
        cost = (quantity || 1) * PRICING.openai.per_image_1024;
      } else if (service === "resend") {
        cost = (quantity || 1) * PRICING.resend.per_email;
      }

      const supabase = getSupabase();
      await supabase.from("api_costs").insert({
        service,
        operation,
        tokens_input: tokens_input || 0,
        tokens_output: tokens_output || 0,
        estimated_cost_usd: Math.round(cost * 10000) / 10000,
        metadata: { quantity },
      });

      return `💰 Coût enregistré : $${cost.toFixed(4)} (${service}/${operation})`;
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

export const getCostReport = betaZodTool({
  name: "get_cost_report",
  description:
    "Génère un rapport des coûts API sur une période donnée. Montre le total par service et le coût moyen par opération.",
  inputSchema: z.object({
    period_days: z.number().optional().describe("Période en jours (défaut: 30)"),
  }),
  run: async ({ period_days }) => {
    try {
      const supabase = getSupabase();
      const days = period_days || 30;
      const since = new Date();
      since.setDate(since.getDate() - days);

      const { data, error } = await supabase
        .from("api_costs")
        .select("*")
        .gte("recorded_at", since.toISOString())
        .order("recorded_at", { ascending: false });

      if (error) return `Erreur: ${error.message}`;
      if (!data?.length) return `Aucun coût enregistré sur les ${days} derniers jours.`;

      // Par service
      const byService: Record<string, { total: number; count: number; operations: Record<string, number> }> = {};
      for (const entry of data) {
        if (!byService[entry.service]) {
          byService[entry.service] = { total: 0, count: 0, operations: {} };
        }
        byService[entry.service].total += entry.estimated_cost_usd;
        byService[entry.service].count++;
        byService[entry.service].operations[entry.operation] =
          (byService[entry.service].operations[entry.operation] || 0) + entry.estimated_cost_usd;
      }

      const totalCost = Object.values(byService).reduce((s, v) => s + v.total, 0);

      const lines = [
        `## Rapport des coûts API — ${days} derniers jours\n`,
        `**Total : $${totalCost.toFixed(4)}** (${data.length} opérations)\n`,
      ];

      for (const [service, info] of Object.entries(byService).sort((a, b) => b[1].total - a[1].total)) {
        lines.push(`### ${service} — $${info.total.toFixed(4)} (${info.count} appels)`);
        for (const [op, cost] of Object.entries(info.operations).sort((a, b) => b[1] - a[1])) {
          lines.push(`  - ${op} : $${cost.toFixed(4)}`);
        }
        lines.push("");
      }

      // Projection mensuelle
      const dailyCost = totalCost / days;
      const monthlyProjection = dailyCost * 30;
      lines.push(`### Projection mensuelle : $${monthlyProjection.toFixed(2)}/mois`);

      return lines.join("\n");
    } catch (error) {
      return `Erreur: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});

// ============================================
// Retry wrapper pour les crons
// ============================================

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 5000,
  label: string = "operation"
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`⚠️  ${label} — tentative ${attempt}/${maxRetries} échouée: ${lastError.message}`);

      if (attempt < maxRetries) {
        const wait = delayMs * attempt; // Backoff linéaire
        console.log(`   Réessai dans ${wait / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, wait));
      }
    }
  }

  throw lastError || new Error(`${label} échoué après ${maxRetries} tentatives`);
}

export const COSTS_TOOLS = [trackApiCost, getCostReport];
