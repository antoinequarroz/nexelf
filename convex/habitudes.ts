import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { exigerProfil } from "./lib";

export const lister = query({
  args: {},
  handler: async (ctx) => {
    const profil = await exigerProfil(ctx);
    return ctx.db
      .query("habitudes")
      .withIndex("by_profil_and_statut", (q) => q.eq("profilId", profil._id))
      .collect();
  },
});

export const creer = mutation({
  args: {
    nom: v.string(),
    jours: v.array(v.number()),
    moment: v.optional(v.string()),
    objectifId: v.optional(v.id("objectifs")),
  },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx);
    if (args.jours.some((jour) => jour < 0 || jour > 6))
      throw new Error("Jour invalide");
    if (args.objectifId) {
      const objectif = await ctx.db.get(args.objectifId);
      if (!objectif || objectif.profilId !== profil._id)
        throw new Error("Objectif interdit");
    }
    return ctx.db.insert("habitudes", {
      profilId: profil._id,
      ...args,
      nom: args.nom.trim(),
      statut: "active",
      version: 1,
      misAJourLe: Date.now(),
    });
  },
});

export const modifier = mutation({
  args: {
    habitudeId: v.id("habitudes"),
    nom: v.string(),
    jours: v.array(v.number()),
    moment: v.optional(v.string()),
    objectifId: v.optional(v.id("objectifs")),
  },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx);
    const habitude = await ctx.db.get(args.habitudeId);
    if (!habitude || habitude.profilId !== profil._id)
      throw new Error("Habitude interdite");
    if (!args.nom.trim() || args.jours.some((jour) => jour < 0 || jour > 6))
      throw new Error("Habitude invalide");
    if (args.objectifId) {
      const objectif = await ctx.db.get(args.objectifId);
      if (!objectif || objectif.profilId !== profil._id)
        throw new Error("Objectif interdit");
    }
    await ctx.db.patch(habitude._id, {
      nom: args.nom.trim(),
      jours: [...new Set(args.jours)],
      moment: args.moment?.trim() || undefined,
      objectifId: args.objectifId,
      version: habitude.version + 1,
      misAJourLe: Date.now(),
    });
  },
});

export const changerStatut = mutation({
  args: {
    habitudeId: v.id("habitudes"),
    statut: v.union(
      v.literal("active"),
      v.literal("pause"),
      v.literal("archivee"),
    ),
  },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx);
    const habitude = await ctx.db.get(args.habitudeId);
    if (!habitude || habitude.profilId !== profil._id)
      throw new Error("Habitude interdite");
    await ctx.db.patch(habitude._id, {
      statut: args.statut,
      version: habitude.version + 1,
      misAJourLe: Date.now(),
    });
  },
});

export const occurrencesDuJour = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const profil = await exigerProfil(ctx);
    return ctx.db
      .query("occurrencesHabitude")
      .withIndex("by_profil_and_date", (q) =>
        q.eq("profilId", profil._id).eq("date", date),
      )
      .collect();
  },
});

export const changerOccurrence = mutation({
  args: {
    habitudeId: v.id("habitudes"),
    date: v.string(),
    statut: v.union(
      v.literal("terminee"),
      v.literal("ignoree"),
      v.literal("reportee"),
    ),
    reporteeAu: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx);
    const habitude = await ctx.db.get(args.habitudeId);
    if (!habitude || habitude.profilId !== profil._id)
      throw new Error("Habitude interdite");
    if (args.statut === "reportee" && !args.reporteeAu)
      throw new Error("Date de report requise");
    const occurrence = await ctx.db
      .query("occurrencesHabitude")
      .withIndex("by_habitude_and_date", (q) =>
        q.eq("habitudeId", args.habitudeId).eq("date", args.date),
      )
      .unique();
    const valeurs = {
      statut: args.statut,
      reporteeAu: args.statut === "reportee" ? args.reporteeAu : undefined,
      misAJourLe: Date.now(),
    };
    if (occurrence) {
      if (occurrence.profilId !== profil._id)
        throw new Error("Occurrence interdite");
      await ctx.db.patch(occurrence._id, {
        ...valeurs,
        version: occurrence.version + 1,
      });
      return occurrence._id;
    }
    return ctx.db.insert("occurrencesHabitude", {
      profilId: profil._id,
      habitudeId: args.habitudeId,
      date: args.date,
      ...valeurs,
      version: 1,
    });
  },
});

export const listerRoutines = query({
  args: {},
  handler: async (ctx) => {
    const profil = await exigerProfil(ctx);
    const routines = await ctx.db
      .query("routines")
      .withIndex("by_profil", (q) => q.eq("profilId", profil._id))
      .collect();
    return Promise.all(
      routines.map(async (routine) => ({
        ...routine,
        habitudes: await ctx.db
          .query("routineHabitudes")
          .withIndex("by_routine", (q) => q.eq("routineId", routine._id))
          .collect(),
      })),
    );
  },
});

export const creerRoutine = mutation({
  args: {
    nom: v.string(),
    moment: v.optional(v.string()),
    habitudeIds: v.array(v.id("habitudes")),
  },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx);
    const nom = args.nom.trim();
    if (!nom) throw new Error("Nom requis");
    for (const habitudeId of args.habitudeIds) {
      const habitude = await ctx.db.get(habitudeId);
      if (!habitude || habitude.profilId !== profil._id)
        throw new Error("Habitude interdite");
    }
    const routineId = await ctx.db.insert("routines", {
      profilId: profil._id,
      nom,
      moment: args.moment?.trim() || undefined,
      statut: "active",
      misAJourLe: Date.now(),
    });
    await Promise.all(
      args.habitudeIds.map((habitudeId, ordre) =>
        ctx.db.insert("routineHabitudes", {
          profilId: profil._id,
          routineId,
          habitudeId,
          ordre,
        }),
      ),
    );
    return routineId;
  },
});
