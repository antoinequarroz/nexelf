import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { exigerProfil } from './lib'

export const preferences = query({
  args: {},
  handler: async ctx => {
    const profil = await exigerProfil(ctx)
    return ctx.db.query('preferencesNotifications').withIndex('by_profil', q => q.eq('profilId', profil._id)).unique()
  }
})

export const sauvegarderPreferences = mutation({
  args: { briefingMatin: v.boolean(), heureBriefing: v.string(), revueSoir: v.boolean(), heureRevue: v.string(), rappelPriorite: v.boolean(), pauseJusqua: v.optional(v.number()), fuseauHoraire: v.string() },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx)
    const existantes = await ctx.db.query('preferencesNotifications').withIndex('by_profil', q => q.eq('profilId', profil._id)).unique()
    const valeur = { ...args, misAJourLe: Date.now() }
    if (existantes) { await ctx.db.patch(existantes._id, valeur); return existantes._id }
    return ctx.db.insert('preferencesNotifications', { profilId: profil._id, ...valeur })
  }
})
