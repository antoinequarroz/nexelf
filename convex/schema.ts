import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

// Les rôles ne sont PAS de l'authentification.
// Better Auth dit QUI est connecté ; ce schéma dit ce qu'il a le droit de faire.
export const role = v.union(v.literal('editeur'), v.literal('admin'))

export const statutAbonnement = v.union(
  v.literal('essai'),
  v.literal('actif'),
  v.literal('retard_paiement'),
  v.literal('annule_actif_jusqua_fin'),
  v.literal('expire')
)

export default defineSchema({
  // Un compte = l'unité de facturation. Décision structurante : ici un
  // compte par utilisateur. Passer au multi-organisation plus tard est
  // une migration, pas une évolution — à trancher pendant spec-product.
  comptes: defineTable({
    nom: v.string(),
    proprietaireId: v.string()
  })
    .index('by_proprietaire', ['proprietaireId']),

  abonnements: defineTable({
    compteId: v.id('comptes'),
    plan: v.union(v.literal('gratuit'), v.literal('pro'), v.literal('equipe')),
    statut: statutAbonnement,
    // Identifiants Stripe : jamais exposés au client.
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    // Un abonnement annulé reste actif jusqu'à cette date.
    finDePeriode: v.optional(v.number())
  })
    .index('by_compte', ['compteId'])
    .index('by_stripe_customer', ['stripeCustomerId'])
    .index('by_stripe_subscription', ['stripeSubscriptionId']),

  // Idempotence des webhooks : Stripe réémet. Un même événement traité
  // deux fois ne doit pas créer deux abonnements.
  evenementsStripe: defineTable({
    stripeEventId: v.string(),
    traiteLe: v.number()
  })
    .index('by_event', ['stripeEventId']),

  // Profil applicatif, distinct de la table d'identité de Better Auth.
  profils: defineTable({
    authId: v.string(),
    compteId: v.id('comptes'),
    nom: v.string(),
    role,
    actif: v.boolean()
  })
    .index('by_auth', ['authId']),

  // Objet métier du produit. À remplacer par le domaine réel.
  projets: defineTable({
    compteId: v.id('comptes'),
    nom: v.string(),
    misAJourPar: v.id('profils'),
    misAJourLe: v.number()
  })
    // Toujours indexer par compte : c'est la clé de cloisonnement.
    .index('by_compte', ['compteId']),

  // Historique minimal : qui a modifié quoi, quand.
  // Indispensable dès qu'il y a deux éditeurs.
  journal: defineTable({
    profilId: v.id('profils'),
    action: v.string(),
    cible: v.string(),
    quand: v.number()
  })
    .index('by_quand', ['quand'])
})
