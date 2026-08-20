import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { exigerProfil } from './lib'

export const courant = query({
  args: {},
  handler: async ctx => exigerProfil(ctx)
})

export const mettreAJourPreferences = mutation({
  args: {
    nom: v.optional(v.string()),
    langue: v.optional(v.union(v.literal('fr'), v.literal('en'))),
    fuseauHoraire: v.optional(v.string()),
    memoireActive: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx)
    await ctx.db.patch(profil._id, args)
    return profil._id
  }
})

export const demanderSuppression = mutation({
  args: {},
  handler: async ctx => {
    const profil = await exigerProfil(ctx)
    const maintenant = Date.now()
    await ctx.db.patch(profil.compteId, {
      suppressionDemandeeLe: maintenant,
      suppressionPrevueLe: maintenant + 7 * 24 * 60 * 60 * 1000
    })
    await ctx.db.insert('journal', { profilId: profil._id, action: 'suppression_demandee', cible: profil.compteId, quand: maintenant })
  }
})

export const annulerSuppression = mutation({
  args: {},
  handler: async ctx => {
    const profil = await exigerProfil(ctx)
    await ctx.db.patch(profil.compteId, { suppressionDemandeeLe: undefined, suppressionPrevueLe: undefined })
    await ctx.db.insert('journal', { profilId: profil._id, action: 'suppression_annulee', cible: profil.compteId, quand: Date.now() })
  }
})

export const exporterMesDonnees = query({
  args: {},
  handler: async ctx => {
    const profil = await exigerProfil(ctx)
    const [compte, onboarding, objectifs, journees, actions, revues, habitudes, routines, souvenirs] = await Promise.all([
      ctx.db.get(profil.compteId),
      ctx.db.query('onboarding').withIndex('by_profil', q => q.eq('profilId', profil._id)).unique(),
      ctx.db.query('objectifs').withIndex('by_profil', q => q.eq('profilId', profil._id)).collect(),
      ctx.db.query('journees').withIndex('by_profil_and_date', q => q.eq('profilId', profil._id)).collect(),
      ctx.db.query('actionsQuotidiennes').withIndex('by_profil', q => q.eq('profilId', profil._id)).collect(),
      ctx.db.query('revuesQuotidiennes').withIndex('by_profil', q => q.eq('profilId', profil._id)).collect(),
      ctx.db.query('habitudes').withIndex('by_profil_and_statut', q => q.eq('profilId', profil._id)).collect(),
      ctx.db.query('routines').withIndex('by_profil', q => q.eq('profilId', profil._id)).collect(),
      ctx.db.query('souvenirs').withIndex('by_profil_and_active', q => q.eq('profilId', profil._id)).collect()
    ])
    return { version: 1, exporteLe: Date.now(), compte, profil, onboarding, objectifs, journees, actions, revues, habitudes, routines, souvenirs }
  }
})
