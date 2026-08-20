import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { estCheminNotificationAutorise } from "./scheduler";
import {
  remplacerNotificationsViaPort,
  type PortNotificationsLocales,
  type StatutPermission,
} from "./orchestration";
import type { NotificationPlanifiee } from "./types";

const PREFIXE_IDENTIFIANT = "nexelf-local-";
const CANAL_ANDROID = "nexelf-rappels";

export async function remplacerNotificationsNexelf(
  planning: NotificationPlanifiee[],
  port: PortNotificationsLocales = portExpo,
): Promise<string[]> {
  return remplacerNotificationsViaPort(planning, port);
}

export function extraireCheminNotification(
  notification: Notifications.Notification,
): string | null {
  const chemin = notification.request.content.data?.chemin;
  return estCheminNotificationAutorise(chemin) ? chemin : null;
}

export const portExpo: PortNotificationsLocales = {
  async obtenirPermission() {
    return (await Notifications.getPermissionsAsync()).status as StatutPermission;
  },
  async demanderPermission() {
    return (await Notifications.requestPermissionsAsync()).status as StatutPermission;
  },
  annuler: Notifications.cancelScheduledNotificationAsync,
  lister: Notifications.getAllScheduledNotificationsAsync,
  async planifier(item) {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(CANAL_ANDROID, {
        name: "Nexelf",
        importance: Notifications.AndroidImportance.DEFAULT,
        enableVibrate: true,
        showBadge: false,
      });
    }
    return Notifications.scheduleNotificationAsync({
      identifier: `${PREFIXE_IDENTIFIANT}${item.categorie}`,
      content: {
        title: item.titre,
        body: item.corps,
        data: { chemin: item.chemin, categorie: item.categorie },
        badge: 0,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: item.heure.heure,
        minute: item.heure.minute,
        channelId: Platform.OS === "android" ? CANAL_ANDROID : undefined,
      },
    });
  },
};
