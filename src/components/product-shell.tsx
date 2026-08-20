import type { ReactNode } from "react";
import { router, useSegments } from "expo-router";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Header } from "./ui/header";
import { Screen } from "./ui/screen";

export function ProductShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const { t } = useTranslation();
  const showBack = useSegments()[0] !== "(tabs)";
  return (
    <Screen keyboard>
      <Header description={subtitle} leading={showBack ? <Button label={t("onboarding.retour")} variant="ghost" onPress={() => router.back()} /> : undefined} title={title} />
      {children}
    </Screen>
  );
}
