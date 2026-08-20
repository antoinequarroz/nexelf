export type PrioritePlanning = "basse" | "normale" | "haute";

export type ActionBrouillon = {
  titre: string;
  dureeMinutes: number;
  priorite: PrioritePlanning;
  creneau?: string;
  raison?: string;
};

const poids: Record<PrioritePlanning, number> = { haute: 0, normale: 1, basse: 2 };

/** Compose un aperçu stable et explicable. Aucun modèle d'IA n'est appelé. */
export function composerPlanDeterministe(actions: ActionBrouillon[], limite = 5) {
  return actions
    .filter((action) => action.titre.trim() && action.dureeMinutes > 0)
    .sort((a, b) => poids[a.priorite] - poids[b.priorite] || a.dureeMinutes - b.dureeMinutes)
    .slice(0, Math.max(3, Math.min(5, limite)))
    .map((action, ordre) => ({ ...action, ordre }));
}
