import { describe, expect, it } from "vitest";
import { construireInsights, variation, type IndicateursSemaine } from "./progression";

const base: IndicateursSemaine = { terminees: 7, reportees: 0, abandonnees: 1, total: 8, objectifsTermines: 2, etapesObjectifs: 3, joursDocumentes: 5 };

describe("progression", () => {
  it("n'invente rien avec moins de deux jours", () => expect(construireInsights({ ...base, joursDocumentes: 1 })).toEqual([]));
  it("limite les hypothèses et expose leurs sources", () => {
    const result = construireInsights({ ...base, reportees: 5 }, { ...base, objectifsTermines: 0 });
    expect(result.length).toBeLessThanOrEqual(3);
    expect(result.every((item) => item.sources.length > 0)).toBe(true);
  });
  it("calcule une variation signée", () => expect(variation(4, 7)).toBe(-3));
});
