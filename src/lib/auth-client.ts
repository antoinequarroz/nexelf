import { createAuthClient } from 'better-auth/react'
import { expoClient } from '@better-auth/expo/client'
import { convexClient } from '@convex-dev/better-auth/client/plugins'
import * as SecureStore from 'expo-secure-store'

// Les jetons vont dans expo-secure-store, JAMAIS dans AsyncStorage :
// AsyncStorage n'est pas chiffré.
// Le typage des plugins Better Auth se résout mal quand plusieurs
// paquets embarquent leur propre copie de better-auth. Si tsc se plaint
// ici, vérifier qu'il n'y a qu'UNE version résolue :
//   pnpm why better-auth
export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_CONVEX_SITE_URL,
  plugins: [
    // Cast nécessaire : @better-auth/expo 1.6.26 déclare `getActions` avec
    // deux paramètres là où better-auth 1.6.26 en attend trois. Incompatibilité
    // de typage en amont, sans effet à l'exécution. À retirer dès qu'elle est
    // corrigée — vérifier à chaque montée de version.
    expoClient({
      scheme: 'nexelf',
      storagePrefix: 'nexelf',
      storage: SecureStore
    }) as never,
    convexClient()
  ]
})
