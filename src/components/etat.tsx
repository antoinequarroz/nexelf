import { useTranslation } from "react-i18next";
import { Feedback } from "./ui/feedback";
import { Screen } from "./ui/screen";

// Les quatre états d'une interface. Aucun écran n'est fini sans eux.
// Sur mobile il y en a un cinquième : hors ligne.

export function Chargement() {
  const { t } = useTranslation();
  return <Screen centered scroll={false}><Feedback fill loading message={t("etats.chargement")} /></Screen>;
}

export function Vide() {
  const { t } = useTranslation();
  return <Screen centered scroll={false}><Feedback fill message={t("etats.vide.corps")} title={t("etats.vide.titre")} /></Screen>;
}

export function Erreur({ onReessayer }: { onReessayer?: () => void }) {
  const { t } = useTranslation();
  return <Screen centered scroll={false}><Feedback actionLabel={onReessayer ? t("etats.erreur.reessayer") : undefined} fill message={t("etats.erreur.corps")} onAction={onReessayer} title={t("etats.erreur.titre")} tone="danger" /></Screen>;
}

export function HorsLigne() {
  const { t } = useTranslation();
  return <Feedback message={t("etats.horsLigne.titre")} tone="offline" />;
}
