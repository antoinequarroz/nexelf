import type { ReactNode } from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

export function ProductShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <ScrollView className="flex-1 bg-canvas" contentContainerClassName="px-6 pb-12 pt-8" keyboardShouldPersistTaps="handled">
      <View className="mb-7 flex-row items-start">
        <Pressable accessibilityRole="button" accessibilityLabel="Back" className="mr-4 min-h-12 min-w-12 items-center justify-center rounded border border-line" onPress={() => router.back()}>
          <Text className="text-xl text-ink">‹</Text>
        </Pressable>
        <View className="flex-1">
          <Text accessibilityRole="header" className="font-display text-3xl text-ink">{title}</Text>
          <Text className="mt-2 font-body text-sm leading-6 text-muted">{subtitle}</Text>
        </View>
      </View>
      {children}
    </ScrollView>
  );
}
