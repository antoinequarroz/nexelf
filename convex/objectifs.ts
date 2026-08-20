import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { exigerProfil } from './lib'
import { horizonObjectif, priorite, statutObjectif } from './schema'

export const lister = query({
  args: {},
  handler: async ctx => {
    const profil = await exigerProfil(ctx)
    const items = await ctx.db.query('objectifs').withIndex('by_profil', q => q.eq('profilId', profil._id)).collect()
    return items.filter(item => item.supprimeLe === undefined)
  }
})

export const creer = mutation({
  args: { titre: v.string(), motivation: v.string(), horizon: horizonObjectif, priorite, echeance: v.optional(v.string()), domaineId: v.optional(v.id('domainesVie')) },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx)
    if (!args.titre.trim()) throw new Error('Titre requis')
    if (args.domaineId) {
      const domaine = await ctx.db.get(args.domaineId)
      if (!domaine || domaine.profilId !== profil._id) throw new Error('Domaine interdit')
    }
    return ctx.db.insert('objectifs', { profilId: profil._id, ...args, titre: args.titre.trim(), motivation: args.motivation.trim(), statut: 'actif', version: 1, misAJourLe: Date.now() })
  }
})

export const changerStatut = mutation({
  args: { objectifId: v.id('objectifs'), statut: statutObjectif },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx)
    const objectif = await ctx.db.get(args.objectifId)
    if (!objectif || objectif.profilId !== profil._id) throw new Error('Objectif interdit')
    await ctx.db.patch(objectif._id, { statut: args.statut, version: objectif.version + 1, misAJourLe: Date.now() })
  }
})

export const modifier = mutation({
  args: { objectifId: v.id('objectifs'), titre: v.string(), motivation: v.string(), horizon: horizonObjectif, priorite, echeance: v.optional(v.string()) },
  handler: async (ctx, { objectifId, ...changements }) => {
    const profil = await exigerProfil(ctx)
    const objectif = await ctx.db.get(objectifId)
    if (!objectif || objectif.profilId !== profil._id) throw new Error('Objectif interdit')
    if (!changements.titre.trim()) throw new Error('Titre requis')
    await ctx.db.patch(objectifId, { ...changements, titre: changements.titre.trim(), motivation: changements.motivation.trim(), version: objectif.version + 1, misAJourLe: Date.now() })
  }
})

export const supprimer = mutation({
  args: { objectifId: v.id('objectifs') },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx)
    const objectif = await ctx.db.get(args.objectifId)
    if (!objectif || objectif.profilId !== profil._id) throw new Error('Objectif interdit')
    await ctx.db.patch(objectif._id, { supprimeLe: Date.now(), version: objectif.version + 1, misAJourLe: Date.now() })
  }
})

export const restaurer = mutation({
  args: { objectifId: v.id('objectifs') },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx)
    const objectif = await ctx.db.get(args.objectifId)
    if (!objectif || objectif.profilId !== profil._id) throw new Error('Objectif interdit')
    await ctx.db.patch(objectif._id, { supprimeLe: undefined, version: objectif.version + 1, misAJourLe: Date.now() })
  }
})
