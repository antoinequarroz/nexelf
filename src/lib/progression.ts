export type IndicateursSemaine = {
  terminees: number;
  reportees: number;
  abandonnees: number;
  total: number;
  objectifsTermines: number;
  etapesObjectifs: number;
  joursDocumentes: number;
};

export type InsightProgression = {
  id: string;
  type: "regularite" | "reports" | "objectifs";
  sources: { cle: keyof IndicateursSemaine; valeur: number }[];
};

/** Produit des hypothèses explicables à partir des seuls chiffres affichés. */
export function construireInsights(
  actuel: IndicateursSemaine,
  precedent?: IndicateursSemaine,
): InsightProgression[] {
  if (actuel.joursDocumentes < 2) return [];
  const insights: InsightProgression[] = [];
  const taux = actuel.total ? actuel.terminees / actuel.total : 0;
  if (actuel.total >= 3 && taux >= 0.7) {
    insights.push({ id: "regularite-haute", type: "regularite", sources: [
      { cle: "terminees", valeur: actuel.terminees }, { cle: "total", valeur: actuel.total },
    ] });
  }
  if (actuel.reportees >= 2 && actuel.reportees > actuel.terminees / 2) {
    insights.push({ id: "reports-frequents", type: "reports", sources: [
      { cle: "reportees", valeur: actuel.reportees }, { cle: "terminees", valeur: actuel.terminees },
    ] });
  }
  if (precedent && actuel.objectifsTermines > precedent.objectifsTermines) {
    insights.push({ id: "objectifs-progressent", type: "objectifs", sources: [
      { cle: "objectifsTermines", valeur: actuel.objectifsTermines },
      { cle: "objectifsTermines", valeur: precedent.objectifsTermines },
    ] });
  }
  return insights.slice(0, 3);
}

export function variation(actuel: number, precedent: number) {
  return actuel - precedent;
}
