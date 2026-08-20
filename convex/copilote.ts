import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { exigerProfil } from './lib'

export const listerConversations = query({
  args: {},
  handler: async ctx => {
    const profil = await exigerProfil(ctx)
    return ctx.db.query('conversations').withIndex('by_profil_and_updated', q => q.eq('profilId', profil._id)).order('desc').take(50)
  }
})

export const creerConversation = mutation({
  args: { titre: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx)
    const maintenant = Date.now()
    return ctx.db.insert('conversations', { profilId: profil._id, titre: args.titre?.trim(), exclueMemoire: false, creeLe: maintenant, misAJourLe: maintenant })
  }
})

export const messages = query({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, { conversationId }) => {
    const profil = await exigerProfil(ctx)
    const conversation = await ctx.db.get(conversationId)
    if (!conversation || conversation.profilId !== profil._id) throw new Error('Conversation interdite')
    return ctx.db.query('messagesConversation').withIndex('by_conversation', q => q.eq('conversationId', conversationId)).collect()
  }
})

export const enregistrerMessageUtilisateur = mutation({
  args: { conversationId: v.id('conversations'), contenu: v.string(), operationId: v.string() },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx)
    const conversation = await ctx.db.get(args.conversationId)
    if (!conversation || conversation.profilId !== profil._id) throw new Error('Conversation interdite')
    const deja = await ctx.db.query('messagesConversation').withIndex('by_profil_and_operation', q => q.eq('profilId', profil._id).eq('operationId', args.operationId)).unique()
    if (deja) return deja._id
    const messageId = await ctx.db.insert('messagesConversation', { profilId: profil._id, conversationId: args.conversationId, role: 'utilisateur', contenu: args.contenu.trim(), statut: 'envoye', operationId: args.operationId, creeLe: Date.now() })
    await ctx.db.patch(conversation._id, { misAJourLe: Date.now() })
    return messageId
  }
})

export const exclureDeLaMemoire = mutation({
  args: { conversationId: v.id('conversations'), exclue: v.boolean() },
  handler: async (ctx, args) => {
    const profil = await exigerProfil(ctx)
    const conversation = await ctx.db.get(args.conversationId)
    if (!conversation || conversation.profilId !== profil._id) throw new Error('Conversation interdite')
    await ctx.db.patch(conversation._id, { exclueMemoire: args.exclue, misAJourLe: Date.now() })
  }
})
