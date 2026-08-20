import { describe, expect, it } from "vitest";
import { composerPlanDeterministe } from "./deterministe";

describe("composerPlanDeterministe", () => {
  it("priorise sans inventer de contenu et limite le plan", () => {
    const plan = composerPlanDeterministe([
      { titre: "Plus tard", dureeMinutes: 60, priorite: "basse" },
      { titre: "Essentiel", dureeMinutes: 45, priorite: "haute" },
      { titre: "Court", dureeMinutes: 15, priorite: "haute" },
      { titre: "Normal", dureeMinutes: 30, priorite: "normale" },
    ]);
    expect(plan.map((x) => x.titre)).toEqual(["Court", "Essentiel", "Normal", "Plus tard"]);
    expect(plan.every((x, index) => x.ordre === index)).toBe(true);
  });

  it("écarte les actions invalides", () => {
    expect(composerPlanDeterministe([{ titre: " ", dureeMinutes: 20, priorite: "haute" }])).toEqual([]);
  });
});
