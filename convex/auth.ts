import {
  createClient,
  type AuthFunctions,
  type GenericCtx
} from '@convex-dev/better-auth'
import { convex } from '@convex-dev/better-auth/plugins'
import { betterAuth } from 'better-auth'
import { expo } from '@better-auth/expo'
import authConfig from './auth.config'
import { components, internal } from './_generated/api'
import type { DataModel } from './_generated/dataModel'

// L'annotation explicite casse la boucle de types générée par `internal.auth`.
// C'est le pattern officiel de @convex-dev/better-auth 0.12 avec triggers.
const authFunctions: AuthFunctions = internal.auth

// Versions ÉPINGLÉES. @convex-dev/better-auth impose une plage stricte sur
// better-auth, et @better-auth/expo doit correspondre EXACTEMENT à better-auth.
// Jamais de `pnpm update` large sur ces trois paquets.
//
// ATTENTION — API 0.12 : dès qu'on utilise `triggers`, `authFunctions` devient
// OBLIGATOIRE. Et le plugin serveur est `convex()` importé depuis
// `@convex-dev/better-auth/plugins`, pas une méthode du client.
export const authComponent = createClient<DataModel>(components.betterAuth, {
  authFunctions,
  triggers: {
    user: {
      // Compte et profil créés dans la MÊME transaction que l'inscription :
      // pas d'utilisateur orphelin, jamais.
      onCreate: async (ctx, user) => {
        const compteId = await ctx.db.insert('comptes', {
          nom: user.name ?? user.email,
          proprietaireId: user._id
        })
        await ctx.db.insert('profils', {
          authId: user._id,
          compteId,
          nom: user.name ?? user.email,
          role: 'editeur', // jamais admin par défaut
          actif: true
        })
      }
    }
  }
})

// Fonctions internes invoquées par le composant Better Auth pour exécuter
// les triggers transactionnels dans le contexte de l'application.
export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi()

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth({
    baseURL: process.env.SITE_URL,
    database: authComponent.adapter(ctx),
    emailAndPassword: { enabled: true, requireEmailVerification: true },
    // Le schéma déclaré dans app.json : sert aux redirections OAuth
    // et au retour dans l'app après authentification.
    trustedOrigins: ['nexelf://'],
    plugins: [expo(), convex({ authConfig })]
  })
