import type { PropsWithChildren } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

export function OnboardingShell({ step, children }: PropsWithChildren<{ step: number }>) {
  const { t } = useTranslation();
  const progress = `${Math.round(((step + 1) / 7) * 100)}%` as `${number}%`;
  return (
    <KeyboardAvoidingView className="flex-1 bg-canvas" behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="flex-grow px-6 pb-12 pt-8">
        <View className="mb-8">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="font-semibold text-xs uppercase tracking-widest text-lime">{t("onboarding.cap")}</Text>
            <Text accessibilityLabel={t("onboarding.progression", { current: step + 1, total: 7 })} className="font-medium text-xs text-muted">{step + 1}/7</Text>
          </View>
          <View className="h-1 overflow-hidden rounded-full bg-line">
            <View className="h-full rounded-full bg-lime" style={{ width: progress }} />
          </View>
        </View>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
