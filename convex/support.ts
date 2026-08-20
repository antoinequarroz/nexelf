import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { exigerProfil } from "./lib";

const categories = ["compte", "donnees", "abonnement", "ia", "autre"] as const;
const WINDOW_MS = 60 * 60 * 1000;
const CONTACT_LIMIT = 5;
const REPORT_LIMIT = 10;

function cleanText(value: string, min: number, max: number, field: string) {
  const clean = value.trim().replace(/\r\n/g, "\n");
  if (clean.length < min || clean.length > max) throw new Error(`SUPPORT_INVALID_${field}`);
  return clean;
}

export const envoyer = mutation({
  args: {
    type: v.union(v.literal("contact"), v.literal("signalement")),
    categorie: v.union(...categories.map((category) => v.literal(category))),
    sujet: v.string(),
    message: v.string(),
    operationId: v.string(),
    messageId: v.optional(v.id("messagesConversation")),
    diagnostic: v.optional(v.object({
      appVersion: v.string(),
      platform: v.union(v.literal("ios"), v.literal("android"), v.literal("web"), v.literal("unknown")),
      systemVersion: v.string(),
      locale: v.string(),
    })),
    consentementDiagnostic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx);
    const operationId = cleanText(args.operationId, 12, 100, "OPERATION");
    const existing = await ctx.db
      .query("demandesSupport")
      .withIndex("by_profil_and_operation", (q) => q.eq("profilId", profil._id).eq("operationId", operationId))
      .unique();
    if (existing) return { reference: existing.reference, statut: existing.statut };

    if (args.type === "signalement") {
      if (!args.messageId) throw new Error("SUPPORT_INVALID_TARGET");
      const target = await ctx.db.get(args.messageId);
      if (!target || target.profilId !== profil._id || target.role !== "assistant")
        throw new Error("SUPPORT_FORBIDDEN");
    } else if (args.messageId) {
      throw new Error("SUPPORT_INVALID_TARGET");
    }

    const since = Date.now() - WINDOW_MS;
    const recent = await ctx.db
      .query("demandesSupport")
      .withIndex("by_profil_and_created", (q) => q.eq("profilId", profil._id).gte("creeLe", since))
      .collect();
    const limit = args.type === "signalement" ? REPORT_LIMIT : CONTACT_LIMIT;
    if (recent.filter((request) => request.type === args.type).length >= limit)
      throw new Error("SUPPORT_RATE_LIMIT");

    if (args.diagnostic && !args.consentementDiagnostic)
      throw new Error("SUPPORT_DIAGNOSTIC_CONSENT_REQUIRED");

    const reference = `NX-${crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;
    await ctx.db.insert("demandesSupport", {
      profilId: profil._id,
      type: args.type,
      categorie: args.categorie,
      sujet: cleanText(args.sujet, 5, 120, "SUBJECT"),
      message: cleanText(args.message, 20, 2000, "MESSAGE"),
      operationId,
      messageId: args.messageId,
      diagnostic: args.diagnostic,
      consentementDiagnostic: Boolean(args.diagnostic && args.consentementDiagnostic),
      reference,
      statut: "recu",
      creeLe: Date.now(),
    });
    return { reference, statut: "recu" as const };
  },
});
export const confirmation = query({
  args: { reference: v.string() },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx);
    const request = await ctx.db
      .query("demandesSupport")
      .withIndex("by_reference", (q) => q.eq("reference", args.reference))
      .unique();
    if (!request || request.profilId !== profil._id) throw new Error("SUPPORT_FORBIDDEN");
    return { reference: request.reference, statut: request.statut, creeLe: request.creeLe };
  },
});
