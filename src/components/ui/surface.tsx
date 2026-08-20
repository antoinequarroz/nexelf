import type { PropsWithChildren } from "react";
import { Text, View } from "react-native";

export function Card({ children, tone = "default" }: PropsWithChildren<{ tone?: "default" | "impulse" | "reflection" | "growth" }>) {
  const toneClass = { default: "bg-surface", impulse: "bg-impulse", reflection: "bg-reflection", growth: "bg-growth" }[tone];
  return <View className={`rounded-lg border border-line p-5 ${toneClass}`}>{children}</View>;
}

export function Section({ title, description, children }: PropsWithChildren<{ title?: string; description?: string }>) {
  return (
    <View className="mb-8">
      {title ? <Text accessibilityRole="header" className="mb-2 font-semibold text-lg text-ink">{title}</Text> : null}
      {description ? <Text className="mb-4 font-body text-sm leading-5 text-muted">{description}</Text> : null}
      {children}
    </View>
  );
}

export function Badge({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "action" | "success" | "warning" | "danger" }) {
  const styles = {
    neutral: "bg-raised text-muted",
    action: "bg-reflection text-action",
    success: "bg-success-surface text-success",
    warning: "bg-warning-surface text-warning",
    danger: "bg-danger-surface text-danger",
  }[tone];
  return <Text className={`self-start rounded-full px-3 py-1 font-medium text-xs ${styles}`}>{label}</Text>;
}
