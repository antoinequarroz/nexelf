import { describe, expect, it } from "vitest";
import { entitlementProActif } from "./achats-logic";

describe("droits RevenueCat", () => {
  it("n'active que l'entitlement pro explicite", () => {
    expect(
      entitlementProActif({ entitlements: { active: { autre: {} } } } as never),
    ).toBe(false);
    expect(
      entitlementProActif({ entitlements: { active: { pro: {} } } } as never),
    ).toBe(true);
  });
});
