import type { PropsWithChildren } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Progress } from "../ui/progress";
import { Screen } from "../ui/screen";

export function OnboardingShell({ step, children }: PropsWithChildren<{ step: number }>) {
  const { t } = useTranslation();
  return (
    <Screen keyboard>
        <View className="mb-8">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="font-semibold text-xs uppercase tracking-widest text-action">{t("onboarding.cap")}</Text>
            <Text accessibilityLabel={t("onboarding.progression", { current: step + 1, total: 7 })} className="font-medium text-xs text-muted">{step + 1}/7</Text>
          </View>
          <Progress label={t("onboarding.progression", { current: step + 1, total: 7 })} max={7} value={step + 1} />
        </View>
        {children}
    </Screen>
  );
}
