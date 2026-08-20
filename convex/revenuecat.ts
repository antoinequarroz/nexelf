import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const appliquerEvenement = internalMutation({
  args: {
    evenementId: v.string(),
    type: v.string(),
    appUserId: v.string(),
    entitlement: v.string(),
    actif: v.boolean(),
    plateforme: v.optional(v.string()),
    expireLe: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const dejaRecu = await ctx.db
      .query("evenementsRevenueCat")
      .withIndex("by_evenement", (q) => q.eq("evenementId", args.evenementId))
      .unique();
    if (dejaRecu) return { duplique: true };

    await ctx.db.insert("evenementsRevenueCat", {
      evenementId: args.evenementId,
      type: args.type,
      appUserId: args.appUserId,
      recuLe: Date.now(),
    });

    const droit = await ctx.db
      .query("droitsAbonnement")
      .withIndex("by_auth_and_entitlement", (q) =>
        q.eq("authId", args.appUserId).eq("entitlement", args.entitlement),
      )
      .unique();
    const valeur = {
      actif: args.actif,
      statut: args.type,
      plateforme: args.plateforme,
      expireLe: args.expireLe,
      misAJourLe: Date.now(),
    };
    if (droit) await ctx.db.patch(droit._id, valeur);
    else
      await ctx.db.insert("droitsAbonnement", {
        authId: args.appUserId,
        entitlement: args.entitlement,
        ...valeur,
      });
    return { duplique: false };
  },
});
