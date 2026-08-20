import type { PropsWithChildren } from "react";
import { ScrollView, Text, View } from "react-native";

export function QuietScreen({
  title,
  description,
  children,
}: PropsWithChildren<{ title: string; description: string }>) {
  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerClassName="px-6 pb-16 pt-12"
    >
      <Text
        accessibilityRole="header"
        className="font-display text-3xl leading-10 text-ink"
      >
        {title}
      </Text>
      <Text className="mb-8 mt-3 font-body text-base leading-6 text-muted">
        {description}
      </Text>
      <View>{children}</View>
    </ScrollView>
  );
}
