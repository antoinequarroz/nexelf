import { describe, expect, it } from "vitest";
import {
  creerPlanningNotifications,
  estCheminNotificationAutorise,
  estHeureLocaleValide,
} from "./scheduler";
import { reglagesNotificationsParDefaut } from "./types";

const textes = {
  briefing: { titre: "Briefing", corps: "Prêt" },
  review: { titre: "Review", corps: "Bilan" },
  priorite: {
    titre: "Priorité",
    corps: "Bientôt",
    heure: { heure: 12, minute: 0 },
  },
} as const;

describe("scheduler de notifications", () => {
  it("ne produit que les catégories activées", () => {
    const planning = creerPlanningNotifications(
      { ...reglagesNotificationsParDefaut, review: false, priorite: true },
      textes,
    );
    expect(planning.map((item) => item.categorie)).toEqual([
      "briefing",
      "priorite",
    ]);
  });

  it("ignore une heure invalide", () => {
    const planning = creerPlanningNotifications(
      {
        ...reglagesNotificationsParDefaut,
        briefingHeure: { heure: 24, minute: 0 },
      },
      textes,
    );
    expect(planning.map((item) => item.categorie)).toEqual(["review"]);
    expect(estHeureLocaleValide({ heure: 23, minute: 59 })).toBe(true);
  });

  it("n'autorise que les deep links connus", () => {
    expect(estCheminNotificationAutorise("/review")).toBe(true);
    expect(estCheminNotificationAutorise("https://example.com")).toBe(false);
    expect(estCheminNotificationAutorise("/admin")).toBe(false);
  });
});
