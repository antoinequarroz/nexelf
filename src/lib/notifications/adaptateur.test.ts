import { describe, expect, it, vi } from "vitest";
import {
  demanderPermissionApresPremierPlanning,
  remplacerNotificationsViaPort,
  type PortNotificationsLocales,
  type StatutPermission,
} from "./orchestration";
import type { NotificationPlanifiee } from "./types";

function fauxPort(statut: StatutPermission = "undetermined") {
  const port: PortNotificationsLocales = {
    obtenirPermission: vi.fn().mockResolvedValue(statut),
    demanderPermission: vi.fn().mockResolvedValue("granted"),
    annuler: vi.fn().mockResolvedValue(undefined),
    lister: vi.fn().mockResolvedValue([]),
    planifier: vi.fn().mockResolvedValue("id"),
  };
  return port;
}

describe("adaptateur de notifications locales", () => {
  it("ne demande pas la permission avant le premier planning", async () => {
    const port = fauxPort();
    expect(await demanderPermissionApresPremierPlanning(false, port)).toBe(
      "undetermined",
    );
    expect(port.demanderPermission).not.toHaveBeenCalled();
  });

  it("demande la permission une seule fois après le premier planning", async () => {
    const port = fauxPort();
    expect(await demanderPermissionApresPremierPlanning(true, port)).toBe(
      "granted",
    );
    expect(port.demanderPermission).toHaveBeenCalledOnce();
  });

  it("écarte les deep links inconnus et limite à trois rappels", async () => {
    const port = fauxPort("granted");
    const base: NotificationPlanifiee = {
      categorie: "briefing",
      titre: "Titre",
      corps: "Corps",
      chemin: "/",
      heure: { heure: 8, minute: 0 },
    };
    const invalide = { ...base, chemin: "/secret" } as unknown as NotificationPlanifiee;
    await remplacerNotificationsViaPort([base, base, base, base, invalide], port);
    expect(port.planifier).toHaveBeenCalledTimes(3);
  });
});
