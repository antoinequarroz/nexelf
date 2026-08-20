import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ComponentProps } from "react";
import type { ColorValue } from "react-native";
import { useTranslation } from "react-i18next";
import { theme } from "../../lib/theme";

type TabIconProps = { color: ColorValue; focused: boolean };

function TabIcon({ color, focused, name }: TabIconProps & { name: ComponentProps<typeof SymbolView>["name"] }) {
  return <SymbolView colors={color} name={name} size={24} type="monochrome" weight={focused ? "semibold" : "regular"} />;
}

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
        options={{ title: t("navigation.today"), tabBarIcon: ({ color, focused }) => <TabIcon color={color} focused={focused} name={{ ios: "sun.max.fill", android: "today", web: "today" }} /> }}
      />
      <Tabs.Screen
        name="objectifs"
        options={{ title: t("navigation.trajectory"), tabBarIcon: ({ color, focused }) => <TabIcon color={color} focused={focused} name={{ ios: "flag.fill", android: "flag", web: "flag" }} /> }}
      />
      <Tabs.Screen
        name="copilote"
        options={{ title: t("navigation.copilot"), tabBarIcon: ({ color, focused }) => <TabIcon color={color} focused={focused} name={{ ios: "bubble.left.and.bubble.right.fill", android: "assistant", web: "assistant" }} /> }}
      />
      <Tabs.Screen
        name="reglages"
        options={{ title: t("navigation.settings"), tabBarIcon: ({ color, focused }) => <TabIcon color={color} focused={focused} name={{ ios: "gearshape.fill", android: "settings", web: "settings" }} /> }}
      />
    </Tabs>
  );
}
