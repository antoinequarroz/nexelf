import { useTranslation } from "react-i18next";
import { Feedback } from "./ui/feedback";

// Les quatre états d'une interface. Aucun écran n'est fini sans eux.
// Sur mobile il y en a un cinquième : hors ligne.

export function Chargement() {
  const { t } = useTranslation();
  return <Feedback fill loading message={t("etats.chargement")} />;
}

export function Vide() {
  const { t } = useTranslation();
  return <Feedback fill message={t("etats.vide.corps")} title={t("etats.vide.titre")} />;
}

export function Erreur({ onReessayer }: { onReessayer?: () => void }) {
  const { t } = useTranslation();
  return <Feedback actionLabel={onReessayer ? t("etats.erreur.reessayer") : undefined} fill message={t("etats.erreur.corps")} onAction={onReessayer} title={t("etats.erreur.titre")} tone="danger" />;
}

export function HorsLigne() {
  const { t } = useTranslation();
  return <Feedback message={t("etats.horsLigne.titre")} tone="offline" />;
}
