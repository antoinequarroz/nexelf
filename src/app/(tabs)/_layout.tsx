import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { theme } from "../../lib/theme";

export default function MainTabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.action,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: { fontFamily: "Manrope_600SemiBold", fontSize: 12 },
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: t("navigation.today") }}
      />
      <Tabs.Screen
        name="objectifs"
        options={{ title: t("navigation.trajectory") }}
      />
      <Tabs.Screen
        name="copilote"
        options={{ title: t("navigation.copilot") }}
      />
      <Tabs.Screen
        name="reglages"
        options={{ title: t("navigation.settings") }}
      />
    </Tabs>
  );
}
