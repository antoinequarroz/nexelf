import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

// Les quatre états d'une interface. Aucun écran n'est fini sans eux.
// Sur mobile il y en a un cinquième : hors ligne.

export function Chargement() {
  const { t } = useTranslation();
  return (
    <View className="flex-1 items-center justify-center gap-3">
      <ActivityIndicator />
      <Text className="text-muted">{t("etats.chargement")}</Text>
    </View>
  );
}

export function Vide() {
  const { t } = useTranslation();
  return (
    <View className="flex-1 items-center justify-center gap-2 px-8">
      <Text className="text-lg text-ink">{t("etats.vide.titre")}</Text>
      <Text className="text-center text-muted">{t("etats.vide.corps")}</Text>
    </View>
  );
}

export function Erreur({ onReessayer }: { onReessayer?: () => void }) {
  const { t } = useTranslation();
  return (
    <View className="flex-1 items-center justify-center gap-3 px-8">
      <Text className="text-lg text-ink">{t("etats.erreur.titre")}</Text>
      <Text className="text-center text-muted">{t("etats.erreur.corps")}</Text>
      {onReessayer && (
        // Un état d'erreur dit ce qui a échoué ET ce qu'on peut faire ensuite.
        <Pressable
          accessibilityRole="button"
          className="rounded bg-lime px-5 py-3"
          onPress={onReessayer}
        >
          <Text className="text-lime-ink">{t("etats.erreur.reessayer")}</Text>
        </Pressable>
      )}
    </View>
  );
}

export function HorsLigne() {
  const { t } = useTranslation();
  return (
    <View className="bg-raised px-4 py-2">
      <Text className="text-sm text-muted">{t("etats.horsLigne.titre")}</Text>
    </View>
  );
}
