import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { exigerProfil } from './lib'

export const obtenir = query({
  args: { journeeId: v.id('journees') },
  handler: async (ctx, { journeeId }) => {
    const profil = await exigerProfil(ctx)
    const journee = await ctx.db.get(journeeId)
    if (!journee || journee.profilId !== profil._id) throw new Error('Journée interdite')
    return ctx.db.query('revuesQuotidiennes').withIndex('by_journee', q => q.eq('journeeId', journeeId)).unique()
  }
})

export const sauvegarder = mutation({
  args: { journeeId: v.id('journees'), energie: v.optional(v.number()), blocage: v.optional(v.string()), note: v.optional(v.string()), terminer: v.boolean() },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx)
    const journee = await ctx.db.get(args.journeeId)
    if (!journee || journee.profilId !== profil._id) throw new Error('Journée interdite')
    const existante = await ctx.db.query('revuesQuotidiennes').withIndex('by_journee', q => q.eq('journeeId', args.journeeId)).unique()
    const valeur = { energie: args.energie, blocage: args.blocage, note: args.note, termineeLe: args.terminer ? Date.now() : undefined, misAJourLe: Date.now() }
    if (existante) { await ctx.db.patch(existante._id, valeur); return existante._id }
    return ctx.db.insert('revuesQuotidiennes', { profilId: profil._id, journeeId: args.journeeId, ...valeur })
  }
})

export const proposerMemoire = mutation({
  args: { journeeId: v.id('journees'), categorie: v.union(v.literal('fait'), v.literal('preference'), v.literal('contrainte'), v.literal('observationTemporaire')), contenu: v.string() },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx)
    const journee = await ctx.db.get(args.journeeId)
    if (!journee || journee.profilId !== profil._id) throw new Error('Journée interdite')
    return ctx.db.insert('propositionsMemoire', { profilId: profil._id, categorie: args.categorie, contenu: args.contenu.trim(), source: `revue:${journee._id}`, statut: 'enAttente', creeLe: Date.now() })
  }
})
