import { describe, expect, it, vi } from "vitest";
import { dateLocaleConvex, detailAction } from "./rituel";
describe("rituel quotidien", () => {
  it("construit une date locale sans basculer au jour UTC suivant", () => {
    expect(dateLocaleConvex(new Date(2026, 0, 2, 23, 30))).toBe("2026-01-02");
  });
  it("résume une action sans inventer de créneau", () => {
    const t = vi.fn((key: string, values?: Record<string, unknown>) =>
      key === "rituel.minutes"
        ? `${values?.count} min`
        : key === "rituel.niveaux.haute"
          ? "haute"
          : `${values?.duree} · ${values?.priorite}`,
    );
    expect(
      detailAction({ dureeMinutes: 45, priorite: "haute" }, t as never),
    ).toBe("45 min · haute");
    expect(t).not.toHaveBeenCalledWith(
      "rituel.detailAvecCreneau",
      expect.anything(),
    );
  });
});
