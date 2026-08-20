import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { exigerProfil } from "./lib";

export const lister = query({
  args: {},
  handler: async (ctx) => {
    const profil = await exigerProfil(ctx);
    return ctx.db
      .query("souvenirs")
      .withIndex("by_profil_and_active", (q) =>
        q.eq("profilId", profil._id).eq("actif", true),
      )
      .collect();
  },
});

export const propositions = query({
  args: {},
  handler: async (ctx) => {
    const profil = await exigerProfil(ctx);
    return ctx.db
      .query("propositionsMemoire")
      .withIndex("by_profil_and_statut", (q) =>
        q.eq("profilId", profil._id).eq("statut", "enAttente"),
      )
      .collect();
  },
});

export const decider = mutation({
  args: {
    propositionId: v.id("propositionsMemoire"),
    accepter: v.boolean(),
    contenuCorrige: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx);
    const proposition = await ctx.db.get(args.propositionId);
    if (!proposition || proposition.profilId !== profil._id)
      throw new Error("Proposition interdite");
    if (!args.accepter) {
      await ctx.db.patch(proposition._id, { statut: "refusee" });
      return null;
    }
    const souvenirId = await ctx.db.insert("souvenirs", {
      profilId: profil._id,
      categorie: proposition.categorie,
      contenu: (args.contenuCorrige ?? proposition.contenu).trim(),
      source: proposition.source,
      actif: true,
      version: 1,
      creeLe: Date.now(),
    });
    await ctx.db.patch(proposition._id, { statut: "confirmee" });
    return souvenirId;
  },
});

export const supprimer = mutation({
  args: { souvenirId: v.id("souvenirs") },
  handler: async (ctx, { souvenirId }) => {
    const profil = await exigerProfil(ctx);
    const souvenir = await ctx.db.get(souvenirId);
    if (!souvenir || souvenir.profilId !== profil._id)
      throw new Error("Souvenir interdit");
    await ctx.db.patch(souvenir._id, {
      actif: false,
      supprimeLe: Date.now(),
      version: souvenir.version + 1,
    });
  },
});

export const corriger = mutation({
  args: { souvenirId: v.id("souvenirs"), contenu: v.string() },
  handler: async (ctx, { souvenirId, contenu }) => {
    const profil = await exigerProfil(ctx);
    const souvenir = await ctx.db.get(souvenirId);
    const valeur = contenu.trim();
    if (!souvenir || souvenir.profilId !== profil._id)
      throw new Error("Souvenir interdit");
    if (!valeur) throw new Error("Contenu requis");
    await ctx.db.patch(souvenir._id, {
      contenu: valeur,
      version: souvenir.version + 1,
    });
  },
});
