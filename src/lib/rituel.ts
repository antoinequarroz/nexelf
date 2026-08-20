import type { TFunction } from "i18next";
type ActionAffichable = {
  dureeMinutes: number;
  creneau?: string;
  priorite: "haute" | "normale" | "basse";
};

export function dateLocaleConvex(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
export function dateLocale(langue: string, date = new Date()) {
  return new Intl.DateTimeFormat(langue, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}
export function detailAction(action: ActionAffichable, t: TFunction) {
  const duree = t("rituel.minutes", { count: action.dureeMinutes });
  const priorite = t(`rituel.niveaux.${action.priorite}`);
  return action.creneau
    ? t("rituel.detailAvecCreneau", {
        duree,
        creneau: action.creneau,
        priorite,
      })
    : t("rituel.detail", { duree, priorite });
}
