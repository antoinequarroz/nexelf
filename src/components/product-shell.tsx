import type { ReactNode } from "react";
import { router } from "expo-router";
import { Text } from "react-native";
import { useTranslation } from "react-i18next";
import { IconButton } from "./ui/button";
import { Header } from "./ui/header";
import { Screen } from "./ui/screen";

export function ProductShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <Screen keyboard>
      <Header description={subtitle} leading={<IconButton accessibilityLabel={t("onboarding.retour")} onPress={() => router.back()}><Text className="text-xl text-ink">‹</Text></IconButton>} title={title} />
      {children}
    </Screen>
  );
}
