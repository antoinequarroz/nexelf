import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { exigerProfil } from './lib'

const ton = v.union(v.literal('doux'), v.literal('direct'), v.literal('equilibre'))

export const reprendre = query({
  args: {},
  handler: async ctx => {
    const profil = await exigerProfil(ctx)
    return ctx.db.query('onboarding').withIndex('by_profil', q => q.eq('profilId', profil._id)).unique()
  }
})

export const sauvegarder = mutation({
  args: {
    etape: v.number(), domaines: v.array(v.string()), futurSouhaite: v.optional(v.string()),
    objectifsPrioritaires: v.array(v.string()), contraintes: v.array(v.string()),
    niveauEnergie: v.optional(v.number()), tonCopilote: v.optional(ton)
  },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx)
    if (args.etape < 0 || args.etape > 7) throw new Error('Étape invalide')
    if (args.objectifsPrioritaires.length > 3) throw new Error('Trois objectifs prioritaires maximum')
    const existant = await ctx.db.query('onboarding').withIndex('by_profil', q => q.eq('profilId', profil._id)).unique()
    const valeur = { ...args, version: 1, misAJourLe: Date.now() }
    if (existant) { await ctx.db.patch(existant._id, valeur); return existant._id }
    return ctx.db.insert('onboarding', { profilId: profil._id, ...valeur })
  }
})

export const terminer = mutation({
  args: {},
  handler: async ctx => {
    const profil = await exigerProfil(ctx)
    const existant = await ctx.db.query('onboarding').withIndex('by_profil', q => q.eq('profilId', profil._id)).unique()
    if (!existant?.futurSouhaite || existant.objectifsPrioritaires.length === 0) throw new Error('Onboarding incomplet')
    await ctx.db.patch(existant._id, { etape: 7, termineLe: Date.now(), misAJourLe: Date.now() })
  }
})
