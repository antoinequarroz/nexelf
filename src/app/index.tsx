import { Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

const PRIORITIES = ["work", "project", "training", "learning"] as const;

export default function Accueil() {
  const { t } = useTranslation();
  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerClassName="px-6 pb-12 pt-8"
    >
      <View className="mb-10 flex-row items-center justify-between">
        <View>
          <Text className="font-medium text-xs uppercase tracking-widest text-subtle">
            {t("briefing.date")}
          </Text>
          <Text className="mt-2 font-display text-4xl tracking-calm text-ink">
            {t("briefing.salutation")}
          </Text>
        </View>
        <View className="h-10 w-10 items-center justify-center rounded-full border border-line bg-surface">
          <Text className="font-semibold text-sm text-lime">NX</Text>
        </View>
      </View>

      <View className="mb-8 rounded-lg border border-line bg-surface p-5">
        <View className="mb-5 flex-row items-center justify-between">
          <Text className="font-semibold text-xs uppercase tracking-widest text-muted">
            {t("briefing.focusLabel")}
          </Text>
          <Text className="font-medium text-xs text-lime">
            {t("briefing.progress")}
          </Text>
        </View>
        <Text className="font-display text-2xl leading-8 text-ink">
          {t("briefing.focus")}
        </Text>
        <Text className="mt-3 font-body text-sm leading-6 text-muted">
          {t("briefing.focusDetail")}
        </Text>
      </View>

      <Text className="mb-5 font-semibold text-xs uppercase tracking-widest text-subtle">
        {t("briefing.priorities")}
      </Text>
      <View className="relative mb-8">
        <View className="absolute bottom-5 left-3 top-5 w-px bg-line" />
        {PRIORITIES.map((priority, index) => (
          <View key={priority} className="mb-5 flex-row items-center">
            <View
              className={`z-10 h-6 w-6 items-center justify-center rounded-full border ${index === 0 ? "border-lime bg-lime" : "border-line bg-canvas"}`}
            >
              <Text
                className={`font-semibold text-xs ${index === 0 ? "text-lime-ink" : "text-subtle"}`}
              >
                {index + 1}
              </Text>
            </View>
            <View className="ml-4 flex-1 border-b border-line pb-5">
              <Text className="font-medium text-base text-ink">
                {t(`briefing.items.${priority}.title`)}
              </Text>
              <Text className="mt-1 font-body text-sm text-muted">
                {t(`briefing.items.${priority}.detail`)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        className="min-h-14 items-center justify-center rounded bg-lime px-6 active:bg-lime-pressed"
      >
        <Text className="font-semibold text-base text-lime-ink">
          {t("briefing.adapt")}
        </Text>
      </Pressable>
      <Text className="mt-4 text-center font-body text-xs leading-5 text-subtle">
        {t("briefing.control")}
      </Text>
    </ScrollView>
  );
}
