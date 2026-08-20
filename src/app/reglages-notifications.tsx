import { useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  creerPlanningNotifications,
  reglagesNotificationsParDefaut,
  remplacerNotificationsNexelf,
} from "../lib/notifications";
import { theme } from "../lib/theme";

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
    <ScrollView className="flex-1 bg-canvas" contentContainerClassName="px-6 pb-12 pt-8">
      <Text className="font-display text-3xl text-ink">{t("notifications.titre")}</Text>
      <Text className="mt-3 font-body text-sm leading-6 text-muted">{t("notifications.description")}</Text>

      {(["briefing", "review", "priorite"] as const).map((categorie) => (
        <View key={categorie} className="mt-6 min-h-20 flex-row items-center justify-between rounded-lg border border-line bg-surface p-5">
          <View className="mr-4 flex-1">
            <Text className="font-medium text-base text-ink">{t(`notifications.${categorie}.titre`)}</Text>
            <Text className="mt-1 font-body text-sm leading-5 text-muted">{t(`notifications.${categorie}.description`)}</Text>
          </View>
          <Switch
            accessibilityLabel={t(`notifications.${categorie}.titre`)}
            value={reglages[categorie]}
            onValueChange={(value) => setReglages((actuels) => ({ ...actuels, [categorie]: value }))}
            trackColor={{ false: theme.border, true: theme.limePressed }}
            thumbColor={reglages[categorie] ? theme.lime : theme.textMuted}
          />
        </View>
      ))}

      <Text className="mt-6 font-body text-xs leading-5 text-subtle">{t("notifications.limite")}</Text>
      <Pressable
        accessibilityRole="button"
        disabled={etat === "enregistrement"}
        onPress={enregistrer}
        className="mt-6 min-h-14 items-center justify-center rounded bg-lime px-6 disabled:opacity-50"
      >
        <Text className="font-semibold text-base text-lime-ink">
          {t(etat === "enregistrement" ? "notifications.enregistrement" : "notifications.enregistrer")}
        </Text>
      </Pressable>
      {etat === "ok" && <Text className="mt-4 text-center font-body text-sm text-lime">{t("notifications.succes")}</Text>}
      {etat === "erreur" && <Text className="mt-4 text-center font-body text-sm text-danger">{t("notifications.erreur")}</Text>}
    </ScrollView>
  );
}
