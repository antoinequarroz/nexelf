import { describe, expect, it } from "vitest";
import { lendemain, normaliserJours } from "./habitudes";

describe("habitudes", () => {
  it("normalise les jours sans doublon", () => {
    expect(normaliserJours([6, 1, 1, -1, 7])).toEqual([1, 6]);
  });

  it("reporte au lendemain même en fin de mois", () => {
    expect(lendemain("2026-08-31")).toBe("2026-09-01");
  });
});
