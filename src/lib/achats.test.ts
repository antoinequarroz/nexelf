import { describe, expect, it } from "vitest";
import { achatAnnule, entitlementProActif } from "./achats-logic";

describe("droits RevenueCat", () => {
  it("n'active que l'entitlement pro explicite", () => {
    expect(
      entitlementProActif({ entitlements: { active: { autre: {} } } } as never),
    ).toBe(false);
    expect(
      entitlementProActif({ entitlements: { active: { pro: {} } } } as never),
    ).toBe(true);
  });

  it("distingue une annulation utilisateur d'une erreur de paiement", () => {
    expect(achatAnnule({ userCancelled: true })).toBe(true);
    expect(achatAnnule(new Error("network"))).toBe(false);
  });
});
