import type { QueryCtx, MutationCtx } from './_generated/server'
import type { Doc } from './_generated/dataModel'

// Une seule façon de résoudre l'identité, utilisée partout.
// Toute fonction publique commence par ça, AVANT la moindre lecture.
export async function exigerProfil(
  ctx: QueryCtx | MutationCtx
): Promise<Doc<'profils'>> {
  const identite = await ctx.auth.getUserIdentity()
  if (!identite) throw new Error('Non authentifié')

  const profil = await ctx.db
    .query('profils')
    .withIndex('by_auth', q => q.eq('authId', identite.subject))
    .unique()

  if (!profil || !profil.actif) throw new Error('Compte inactif')
  return profil
}

// Ne jamais filtrer par un compteId reçu en argument : il viendrait du
// client. Le cloisonnement passe toujours par le profil résolu ici.

// Le rôle se vérifie ici, côté serveur. Jamais dans le front :
// le client dit qui il prétend être, le serveur décide.
export async function exigerAdmin(ctx: QueryCtx | MutationCtx) {
  const profil = await exigerProfil(ctx)
  if (profil.role !== 'admin') throw new Error('Réservé aux administrateurs')
  return profil
}
