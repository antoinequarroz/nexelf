import { Link } from "expo-router";
import { Pressable, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { Card, Header, Screen, Section } from "../../components/ui";

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
    <Screen contentClassName="pb-16 pt-12">
      <Header description={t("navigation.settingsDescription")} title={t("navigation.settings")} />
      <Section><Card>
        {destinations.map((destination, index) => (
          <Link key={destination.href} href={destination.href} asChild>
            <Pressable
              accessibilityRole="button"
              className={`min-h-touch justify-center py-4 ${index ? "border-t border-line" : ""}`}
            >
              <Text className="font-medium text-base text-ink">
                {t(destination.title)}
              </Text>
            </Pressable>
          </Link>
        ))}
      </Card></Section>
    </Screen>
  );
}
