import { estCheminNotificationAutorise } from "./scheduler";
import type { NotificationPlanifiee } from "./types";

export type StatutPermission = "undetermined" | "denied" | "granted";

export interface PortNotificationsLocales {
  obtenirPermission(): Promise<StatutPermission>;
  demanderPermission(): Promise<StatutPermission>;
  annuler(identifier: string): Promise<void>;
  lister(): Promise<readonly Readonly<{ identifier: string }>[]>;
  planifier(item: NotificationPlanifiee): Promise<string>;
}

const PREFIXE_IDENTIFIANT = "nexelf-local-";

export async function demanderPermissionApresPremierPlanning(
  premierPlanningCree: boolean,
  port: PortNotificationsLocales,
): Promise<StatutPermission> {
  const statut = await port.obtenirPermission();
  if (!premierPlanningCree || statut !== "undetermined") return statut;
  return port.demanderPermission();
}

export async function remplacerNotificationsViaPort(
  planning: NotificationPlanifiee[],
  port: PortNotificationsLocales,
): Promise<string[]> {
  const existantes = await port.lister();
  await Promise.all(
    existantes
      .filter((item) => item.identifier.startsWith(PREFIXE_IDENTIFIANT))
      .map((item) => port.annuler(item.identifier)),
  );
  return Promise.all(
    planning
      .filter((item) => estCheminNotificationAutorise(item.chemin))
      .slice(0, 3)
      .map((item) => port.planifier(item)),
  );
}
