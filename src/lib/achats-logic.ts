export const ENTITLEMENT_PRO = "pro";

export function entitlementProActif(infos: {
  entitlements: { active: Record<string, unknown> };
}): boolean {
  return Boolean(infos.entitlements.active[ENTITLEMENT_PRO]);
}

export function achatAnnule(erreur: unknown): boolean {
  return Boolean(
    erreur &&
    typeof erreur === "object" &&
    "userCancelled" in erreur &&
    erreur.userCancelled === true,
  );
}
