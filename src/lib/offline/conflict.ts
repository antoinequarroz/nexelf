import type { VersionedValue } from "./types";

/**
 * Last-write-wins déterministe : l'horodatage le plus récent gagne. En cas
 * d'égalité (horloges identiques ou arrondies), l'identifiant d'opération le
 * plus grand lexicalement gagne. Tous les clients convergent ainsi sans que
 * l'ordre de réception réseau influence le résultat.
 */
export function resolveLastWriteWins<T>(
  left: VersionedValue<T>,
  right: VersionedValue<T>,
): VersionedValue<T> {
  if (left.updatedAt !== right.updatedAt) {
    return left.updatedAt > right.updatedAt ? left : right;
  }
  return left.operationId.localeCompare(right.operationId) >= 0 ? left : right;
}
