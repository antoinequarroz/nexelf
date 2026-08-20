export const JOURS_SEMAINE = [0, 1, 2, 3, 4, 5, 6] as const;

export function normaliserJours(jours: number[]) {
  return [
    ...new Set(
      jours.filter((jour) => Number.isInteger(jour) && jour >= 0 && jour <= 6),
    ),
  ].sort();
}

export function dateLocale(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function lendemain(date: string) {
  const valeur = new Date(`${date}T12:00:00.000Z`);
  valeur.setUTCDate(valeur.getUTCDate() + 1);
  return valeur.toISOString().slice(0, 10);
}
