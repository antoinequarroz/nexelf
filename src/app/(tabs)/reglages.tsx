import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

const destinations = [
  { href: "/habitudes", title: "navigation.settingsLinks.habits" },
  { href: "/memoire", title: "navigation.settingsLinks.memory" },
  {
    href: "/reglages-notifications",
    title: "navigation.settingsLinks.notifications",
  },
] as const;

export default function Reglages() {
  const { t } = useTranslation();

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerClassName="px-6 pb-16 pt-12"
    >
      <Text accessibilityRole="header" className="font-display text-3xl text-ink">
        {t("navigation.settings")}
      </Text>
      <Text className="mb-8 mt-3 font-body text-base leading-6 text-muted">
        {t("navigation.settingsDescription")}
      </Text>
      <View className="overflow-hidden rounded-lg border border-line bg-surface">
        {destinations.map((destination, index) => (
          <Link key={destination.href} href={destination.href} asChild>
            <Pressable
              accessibilityRole="button"
              className={`min-h-14 justify-center px-5 ${index ? "border-t border-line" : ""}`}
            >
              <Text className="font-medium text-base text-ink">
                {t(destination.title)}
              </Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}
