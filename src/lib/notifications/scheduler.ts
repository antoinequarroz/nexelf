import {
  CHEMINS_NOTIFICATIONS,
  type CheminNotification,
  type HeureLocale,
  type NotificationPlanifiee,
  type ReglagesNotifications,
} from "./types";

const MAX_NOTIFICATIONS_PAR_JOUR = 3;

export function estHeureLocaleValide(heure: HeureLocale): boolean {
  return (
    Number.isInteger(heure.heure) &&
    heure.heure >= 0 &&
    heure.heure <= 23 &&
    Number.isInteger(heure.minute) &&
    heure.minute >= 0 &&
    heure.minute <= 59
  );
}

export function estCheminNotificationAutorise(
  valeur: unknown,
): valeur is CheminNotification {
  return (
    typeof valeur === "string" &&
    (CHEMINS_NOTIFICATIONS as readonly string[]).includes(valeur)
  );
}

export function creerPlanningNotifications(
  reglages: ReglagesNotifications,
  textes: Readonly<{
    briefing: Readonly<{ titre: string; corps: string }>;
    review: Readonly<{ titre: string; corps: string }>;
    priorite?: Readonly<{ titre: string; corps: string; heure: HeureLocale }>;
  }>,
): NotificationPlanifiee[] {
  const planning: NotificationPlanifiee[] = [];

  if (reglages.briefing && estHeureLocaleValide(reglages.briefingHeure)) {
    planning.push({
      categorie: "briefing",
      ...textes.briefing,
      chemin: "/",
      heure: reglages.briefingHeure,
    });
  }

  if (reglages.review && estHeureLocaleValide(reglages.reviewHeure)) {
    planning.push({
      categorie: "review",
      ...textes.review,
      chemin: "/review",
      heure: reglages.reviewHeure,
    });
  }

  if (
    reglages.priorite &&
    textes.priorite &&
    estHeureLocaleValide(textes.priorite.heure)
  ) {
    planning.push({
      categorie: "priorite",
      titre: textes.priorite.titre,
      corps: textes.priorite.corps,
      chemin: "/priorites",
      heure: textes.priorite.heure,
    });
  }

  return planning.slice(0, MAX_NOTIFICATIONS_PAR_JOUR);
}
