import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { exigerProfil } from './lib'
import { priorite, statutAction } from './schema'

export const obtenirJournee = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const profil = await exigerProfil(ctx)
    const journee = await ctx.db.query('journees').withIndex('by_profil_and_date', q => q.eq('profilId', profil._id).eq('date', date)).unique()
    if (!journee) return null
    const actions = await ctx.db.query('actionsQuotidiennes').withIndex('by_journee', q => q.eq('journeeId', journee._id)).collect()
    return { journee, actions: actions.sort((a, b) => a.ordre - b.ordre) }
  }
})

export const creerJournee = mutation({
  args: { date: v.string(), cap: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx)
    const existante = await ctx.db.query('journees').withIndex('by_profil_and_date', q => q.eq('profilId', profil._id).eq('date', args.date)).unique()
    if (existante) return existante._id
    return ctx.db.insert('journees', { profilId: profil._id, ...args, version: 1, misAJourLe: Date.now() })
  }
})

export const ajouterAction = mutation({
  args: { journeeId: v.id('journees'), objectifId: v.optional(v.id('objectifs')), titre: v.string(), raison: v.optional(v.string()), dureeMinutes: v.number(), creneau: v.optional(v.string()), priorite, ordre: v.number() },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx)
    const journee = await ctx.db.get(args.journeeId)
    if (!journee || journee.profilId !== profil._id) throw new Error('Journée interdite')
    if (args.dureeMinutes < 1 || args.dureeMinutes > 24 * 60) throw new Error('Durée invalide')
    return ctx.db.insert('actionsQuotidiennes', { profilId: profil._id, ...args, titre: args.titre.trim(), statut: 'aFaire', version: 1, misAJourLe: Date.now() })
  }
})

export const mettreAJourAction = mutation({
  args: { actionId: v.id('actionsQuotidiennes'), titre: v.optional(v.string()), dureeMinutes: v.optional(v.number()), statut: v.optional(statutAction), creneau: v.optional(v.string()), reporteeAu: v.optional(v.string()), note: v.optional(v.string()), ordre: v.optional(v.number()) },
  handler: async (ctx, { actionId, ...changements }) => {
    const profil = await exigerProfil(ctx)
    const action = await ctx.db.get(actionId)
    if (!action || action.profilId !== profil._id) throw new Error('Action interdite')
    if (changements.dureeMinutes !== undefined && (changements.dureeMinutes < 1 || changements.dureeMinutes > 24 * 60)) throw new Error('Durée invalide')
    await ctx.db.patch(actionId, { ...changements, titre: changements.titre?.trim(), version: action.version + 1, misAJourLe: Date.now() })
  }
})

export const supprimerAction = mutation({
  args: { actionId: v.id('actionsQuotidiennes') },
  handler: async (ctx, { actionId }) => {
    const profil = await exigerProfil(ctx)
    const action = await ctx.db.get(actionId)
    if (!action || action.profilId !== profil._id) throw new Error('Action interdite')
    await ctx.db.delete(actionId)
  }
})

export const appliquerOperation = mutation({
  args: { operationId: v.string(), actionId: v.id('actionsQuotidiennes'), type: v.union(v.literal('terminer'), v.literal('ignorer'), v.literal('reporter'), v.literal('noter')), reporteeAu: v.optional(v.string()), note: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx)
    const deja = await ctx.db.query('operationsAppliquees').withIndex('by_profil_and_operation', q => q.eq('profilId', profil._id).eq('operationId', args.operationId)).unique()
    if (deja) return JSON.parse(deja.resultatJson) as { version: number }
    const action = await ctx.db.get(args.actionId)
    if (!action || action.profilId !== profil._id) throw new Error('Action interdite')
    const statut = args.type === 'terminer' ? 'terminee' : args.type === 'ignorer' ? 'ignoree' : args.type === 'reporter' ? 'reportee' : action.statut
    const version = action.version + 1
    const resultat = { version }
    await ctx.db.patch(action._id, { statut, reporteeAu: args.reporteeAu, note: args.note ?? action.note, version, misAJourLe: Date.now() })
    await ctx.db.insert('operationsAppliquees', { profilId: profil._id, operationId: args.operationId, type: args.type, resultatJson: JSON.stringify(resultat), appliqueLe: Date.now() })
    await ctx.db.insert('historiqueModifications', { profilId: profil._id, entiteType: 'actionQuotidienne', entiteId: action._id, operationId: args.operationId, avantJson: JSON.stringify({ statut: action.statut, version: action.version }), apresJson: JSON.stringify({ statut, version }), motif: args.type, creeLe: Date.now() })
    return resultat
  }
})
