import { useState } from "react";
import { Switch, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  creerPlanningNotifications,
  reglagesNotificationsParDefaut,
  remplacerNotificationsNexelf,
} from "../lib/notifications";
import { theme } from "../lib/theme";
import { Button, Card, Feedback, Header, Screen, Section } from "../components/ui";

export default function ReglagesNotifications() {
  const { t } = useTranslation();
  const [reglages, setReglages] = useState(reglagesNotificationsParDefaut);
  const [etat, setEtat] = useState<"repos" | "enregistrement" | "ok" | "erreur">("repos");

  async function enregistrer() {
    setEtat("enregistrement");
    try {
      const planning = creerPlanningNotifications(reglages, {
        briefing: {
          titre: t("notifications.contenu.briefingTitre"),
          corps: t("notifications.contenu.briefingCorps"),
        },
        review: {
          titre: t("notifications.contenu.reviewTitre"),
          corps: t("notifications.contenu.reviewCorps"),
        },
      });
      await remplacerNotificationsNexelf(planning);
      setEtat("ok");
    } catch {
      setEtat("erreur");
    }
  }

  return (
    <Screen>
      <Header description={t("notifications.description")} title={t("notifications.titre")} />
      <Section>
      {(["briefing", "review", "priorite"] as const).map((categorie) => (
        <View key={categorie} className="mb-4"><Card><View className="min-h-14 flex-row items-center justify-between gap-4">
          <View className="mr-4 flex-1">
            <Text className="font-medium text-base text-ink">{t(`notifications.${categorie}.titre`)}</Text>
            <Text className="mt-1 font-body text-sm leading-5 text-muted">{t(`notifications.${categorie}.description`)}</Text>
          </View>
          <Switch
            accessibilityLabel={t(`notifications.${categorie}.titre`)}
            value={reglages[categorie]}
            onValueChange={(value) => setReglages((actuels) => ({ ...actuels, [categorie]: value }))}
            trackColor={{ false: theme.border, true: theme.progressPressed }}
            thumbColor={reglages[categorie] ? theme.progress : theme.textMuted}
          />
        </View></Card></View>
      ))}
      </Section>

      <Text className="mb-6 font-body text-xs leading-5 text-subtle">{t("notifications.limite")}</Text>
      <Button
        disabled={etat === "enregistrement"}
        label={t("notifications.enregistrer")}
        loading={etat === "enregistrement"}
        loadingLabel={t("notifications.enregistrement")}
        onPress={enregistrer}
      />
      {etat === "ok" ? <View className="mt-4"><Feedback message={t("notifications.succes")} tone="success" /></View> : null}
      {etat === "erreur" ? <View className="mt-4"><Feedback message={t("notifications.erreur")} tone="danger" /></View> : null}
    </Screen>
  );
}
