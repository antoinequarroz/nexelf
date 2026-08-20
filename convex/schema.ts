import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export const langue = v.union(v.literal('fr'), v.literal('en'))
export const role = v.union(v.literal('utilisateur'), v.literal('admin'))
export const horizonObjectif = v.union(v.literal('court'), v.literal('moyen'), v.literal('long'))
export const priorite = v.union(v.literal('basse'), v.literal('normale'), v.literal('haute'))
export const statutObjectif = v.union(v.literal('actif'), v.literal('pause'), v.literal('archive'))
export const statutAction = v.union(
  v.literal('aFaire'), v.literal('terminee'), v.literal('ignoree'), v.literal('reportee')
)

export default defineSchema({
  comptes: defineTable({
    proprietaireId: v.string(),
    nom: v.string(),
    creeLe: v.number(),
    suppressionDemandeeLe: v.optional(v.number()),
    suppressionPrevueLe: v.optional(v.number())
  }).index('by_proprietaire', ['proprietaireId']),

  profils: defineTable({
    authId: v.string(),
    compteId: v.id('comptes'),
    nom: v.string(),
    role,
    actif: v.boolean(),
    langue,
    fuseauHoraire: v.string(),
    memoireActive: v.boolean(),
    creeLe: v.number()
  }).index('by_auth', ['authId']).index('by_compte', ['compteId']),

  onboarding: defineTable({
    profilId: v.id('profils'),
    version: v.number(),
    etape: v.number(),
    domaines: v.array(v.string()),
    futurSouhaite: v.optional(v.string()),
    objectifsPrioritaires: v.array(v.string()),
    contraintes: v.array(v.string()),
    niveauEnergie: v.optional(v.number()),
    tonCopilote: v.optional(v.union(v.literal('doux'), v.literal('direct'), v.literal('equilibre'))),
    termineLe: v.optional(v.number()),
    misAJourLe: v.number()
  }).index('by_profil', ['profilId']),

  domainesVie: defineTable({
    profilId: v.id('profils'), nom: v.string(), ordre: v.number(), creeLe: v.number()
  }).index('by_profil', ['profilId']),

  objectifs: defineTable({
    profilId: v.id('profils'),
    domaineId: v.optional(v.id('domainesVie')),
    titre: v.string(),
    motivation: v.string(),
    horizon: horizonObjectif,
    priorite,
    echeance: v.optional(v.string()),
    statut: statutObjectif,
    version: v.number(),
    supprimeLe: v.optional(v.number()),
    misAJourLe: v.number()
  })
    .index('by_profil', ['profilId'])
    .index('by_profil_and_statut', ['profilId', 'statut']),

  etapesObjectif: defineTable({
    profilId: v.id('profils'), objectifId: v.id('objectifs'), titre: v.string(), ordre: v.number(), termineeLe: v.optional(v.number())
  }).index('by_objectif', ['objectifId']).index('by_profil', ['profilId']),

  journees: defineTable({
    profilId: v.id('profils'), date: v.string(), cap: v.optional(v.string()), version: v.number(), misAJourLe: v.number()
  }).index('by_profil_and_date', ['profilId', 'date']),

  actionsQuotidiennes: defineTable({
    profilId: v.id('profils'),
    journeeId: v.id('journees'),
    objectifId: v.optional(v.id('objectifs')),
    titre: v.string(),
    raison: v.optional(v.string()),
    dureeMinutes: v.number(),
    creneau: v.optional(v.string()),
    priorite,
    statut: statutAction,
    reporteeAu: v.optional(v.string()),
    note: v.optional(v.string()),
    ordre: v.number(),
    version: v.number(),
    misAJourLe: v.number()
  }).index('by_journee', ['journeeId']).index('by_profil', ['profilId']),

  revisionsPlanning: defineTable({
    profilId: v.id('profils'), journeeId: v.id('journees'), operationId: v.string(), avantJson: v.string(), apresJson: v.string(), creeLe: v.number(), annuleLe: v.optional(v.number())
  }).index('by_profil_and_operation', ['profilId', 'operationId']).index('by_journee', ['journeeId']),

  revuesQuotidiennes: defineTable({
    profilId: v.id('profils'), journeeId: v.id('journees'), energie: v.optional(v.number()), blocage: v.optional(v.string()), note: v.optional(v.string()), termineeLe: v.optional(v.number()), misAJourLe: v.number()
  }).index('by_journee', ['journeeId']).index('by_profil', ['profilId']),

  conversations: defineTable({
    profilId: v.id('profils'), titre: v.optional(v.string()), exclueMemoire: v.boolean(), creeLe: v.number(), misAJourLe: v.number()
  }).index('by_profil_and_updated', ['profilId', 'misAJourLe']),

  messagesConversation: defineTable({
    profilId: v.id('profils'), conversationId: v.id('conversations'), role: v.union(v.literal('utilisateur'), v.literal('assistant')), contenu: v.string(), statut: v.union(v.literal('envoye'), v.literal('generation'), v.literal('erreur'), v.literal('annule')), operationId: v.string(), creeLe: v.number()
  }).index('by_conversation', ['conversationId']).index('by_profil_and_operation', ['profilId', 'operationId']),

  actionsProposees: defineTable({
    profilId: v.id('profils'), conversationId: v.id('conversations'), type: v.string(), apercuJson: v.string(), chargeUtileJson: v.string(), statut: v.union(v.literal('enAttente'), v.literal('confirmee'), v.literal('refusee'), v.literal('expiree'), v.literal('annulee')), operationId: v.string(), creeLe: v.number(), expireLe: v.number()
  }).index('by_profil_and_operation', ['profilId', 'operationId']).index('by_conversation', ['conversationId']),

  propositionsMemoire: defineTable({
    profilId: v.id('profils'), conversationId: v.optional(v.id('conversations')), categorie: v.union(v.literal('fait'), v.literal('preference'), v.literal('contrainte'), v.literal('observationTemporaire')), contenu: v.string(), source: v.string(), statut: v.union(v.literal('enAttente'), v.literal('confirmee'), v.literal('refusee')), creeLe: v.number()
  }).index('by_profil_and_statut', ['profilId', 'statut']),

  souvenirs: defineTable({
    profilId: v.id('profils'), categorie: v.union(v.literal('fait'), v.literal('preference'), v.literal('contrainte'), v.literal('observationTemporaire')), contenu: v.string(), source: v.string(), actif: v.boolean(), version: v.number(), creeLe: v.number(), supprimeLe: v.optional(v.number())
  }).index('by_profil_and_active', ['profilId', 'actif']),

  habitudes: defineTable({
    profilId: v.id('profils'), objectifId: v.optional(v.id('objectifs')), nom: v.string(), jours: v.array(v.number()), moment: v.optional(v.string()), statut: v.union(v.literal('active'), v.literal('pause'), v.literal('archivee')), version: v.number(), misAJourLe: v.number()
  }).index('by_profil_and_statut', ['profilId', 'statut']),

  routines: defineTable({
    profilId: v.id('profils'), nom: v.string(), moment: v.optional(v.string()), statut: v.union(v.literal('active'), v.literal('pause'), v.literal('archivee')), misAJourLe: v.number()
  }).index('by_profil', ['profilId']),

  routineHabitudes: defineTable({
    profilId: v.id('profils'), routineId: v.id('routines'), habitudeId: v.id('habitudes'), ordre: v.number()
  }).index('by_routine', ['routineId']).index('by_habitude', ['habitudeId']),

  occurrencesHabitude: defineTable({
    profilId: v.id('profils'), habitudeId: v.id('habitudes'), date: v.string(), statut: statutAction, reporteeAu: v.optional(v.string()), version: v.number(), misAJourLe: v.number()
  }).index('by_profil_and_date', ['profilId', 'date']).index('by_habitude_and_date', ['habitudeId', 'date']),

  operationsAppliquees: defineTable({
    profilId: v.id('profils'), operationId: v.string(), type: v.string(), resultatJson: v.string(), appliqueLe: v.number()
  }).index('by_profil_and_operation', ['profilId', 'operationId']),

  historiqueModifications: defineTable({
    profilId: v.id('profils'), entiteType: v.string(), entiteId: v.string(), operationId: v.string(), avantJson: v.optional(v.string()), apresJson: v.optional(v.string()), motif: v.string(), creeLe: v.number()
  }).index('by_profil_and_date', ['profilId', 'creeLe']),

  preferencesNotifications: defineTable({
    profilId: v.id('profils'), briefingMatin: v.boolean(), heureBriefing: v.string(), revueSoir: v.boolean(), heureRevue: v.string(), rappelPriorite: v.boolean(), pauseJusqua: v.optional(v.number()), fuseauHoraire: v.string(), misAJourLe: v.number()
  }).index('by_profil', ['profilId']),

  journal: defineTable({
    profilId: v.id('profils'), action: v.string(), cible: v.string(), quand: v.number()
  }).index('by_profil_and_date', ['profilId', 'quand'])
})
