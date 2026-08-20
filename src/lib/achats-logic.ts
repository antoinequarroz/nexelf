export const ENTITLEMENT_PRO = "pro";

export function entitlementProActif(infos: {
  entitlements: { active: Record<string, unknown> };
}): boolean {
  return Boolean(infos.entitlements.active[ENTITLEMENT_PRO]);
}
