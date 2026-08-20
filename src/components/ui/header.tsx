import type { ReactNode } from "react";
import { Text, View } from "react-native";

type HeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
};

export function Header({ title, description, eyebrow, leading, trailing }: HeaderProps) {
  return (
    <View className="mb-8">
      <View className="flex-row items-start">
        {leading ? <View className="mr-3">{leading}</View> : null}
        <View className="min-w-0 flex-1">
          {eyebrow ? <Text className="mb-2 font-semibold text-xs uppercase tracking-widest text-action">{eyebrow}</Text> : null}
          <Text accessibilityRole="header" className="font-display text-3xl leading-10 tracking-calm text-ink">{title}</Text>
          {description ? <Text className="mt-3 font-body text-base leading-6 text-muted">{description}</Text> : null}
        </View>
        {trailing ? <View className="ml-3">{trailing}</View> : null}
      </View>
    </View>
  );
}
