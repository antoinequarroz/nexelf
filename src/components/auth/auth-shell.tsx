import type { PropsWithChildren } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

type AuthShellProps = PropsWithChildren<{
  title: string;
  description: string;
}>;

export function AuthShell({ title, description, children }: AuthShellProps) {
  const { t } = useTranslation();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-canvas"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="flex-grow justify-center px-6 py-12"
      >
        <View className="mb-10 flex-row items-center">
          <View className="mr-3 h-2 w-10 rounded-full bg-lime" />
          <Text className="font-semibold text-xs uppercase tracking-widest text-lime">
            {t("app.nom")}
          </Text>
        </View>
        <Text accessibilityRole="header" className="font-display text-4xl tracking-calm text-ink">
          {title}
        </Text>
        <Text className="mb-8 mt-3 font-body text-base leading-6 text-muted">
          {description}
        </Text>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
