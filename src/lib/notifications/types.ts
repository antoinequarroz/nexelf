export type CategorieNotification = "briefing" | "review" | "priorite";

export type HeureLocale = Readonly<{ heure: number; minute: number }>;

export type ReglagesNotifications = Readonly<{
  briefing: boolean;
  briefingHeure: HeureLocale;
  review: boolean;
  reviewHeure: HeureLocale;
  priorite: boolean;
}>;

export type NotificationPlanifiee = Readonly<{
  categorie: CategorieNotification;
  titre: string;
  corps: string;
  chemin: CheminNotification;
  heure: HeureLocale;
}>;

export const CHEMINS_NOTIFICATIONS = [
  "/",
  "/review",
  "/priorites",
] as const;

export type CheminNotification = (typeof CHEMINS_NOTIFICATIONS)[number];

export const reglagesNotificationsParDefaut: ReglagesNotifications = {
  briefing: true,
  briefingHeure: { heure: 7, minute: 30 },
  review: true,
  reviewHeure: { heure: 20, minute: 30 },
  priorite: false,
};
