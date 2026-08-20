import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { exigerProfil } from './lib'

export const lister = query({
  args: {},
  handler: async ctx => {
    const profil = await exigerProfil(ctx)
    return ctx.db.query('habitudes').withIndex('by_profil_and_statut', q => q.eq('profilId', profil._id)).collect()
  }
})

export const creer = mutation({
  args: { nom: v.string(), jours: v.array(v.number()), moment: v.optional(v.string()), objectifId: v.optional(v.id('objectifs')) },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx)
    if (args.jours.some(jour => jour < 0 || jour > 6)) throw new Error('Jour invalide')
    if (args.objectifId) {
      const objectif = await ctx.db.get(args.objectifId)
      if (!objectif || objectif.profilId !== profil._id) throw new Error('Objectif interdit')
    }
    return ctx.db.insert('habitudes', { profilId: profil._id, ...args, nom: args.nom.trim(), statut: 'active', version: 1, misAJourLe: Date.now() })
  }
})

export const changerStatut = mutation({
  args: { habitudeId: v.id('habitudes'), statut: v.union(v.literal('active'), v.literal('pause'), v.literal('archivee')) },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx)
    const habitude = await ctx.db.get(args.habitudeId)
    if (!habitude || habitude.profilId !== profil._id) throw new Error('Habitude interdite')
    await ctx.db.patch(habitude._id, { statut: args.statut, version: habitude.version + 1, misAJourLe: Date.now() })
  }
})

export const occurrencesDuJour = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const profil = await exigerProfil(ctx)
    return ctx.db.query('occurrencesHabitude').withIndex('by_profil_and_date', q => q.eq('profilId', profil._id).eq('date', date)).collect()
  }
})
