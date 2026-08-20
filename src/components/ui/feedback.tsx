import { ActivityIndicator, Text, View } from "react-native";
import { theme } from "../../lib/theme";
import { Button } from "./button";

type FeedbackTone = "neutral" | "success" | "warning" | "danger" | "offline";

type FeedbackProps = {
  title?: string;
  message: string;
  tone?: FeedbackTone;
  loading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  fill?: boolean;
};

export function Feedback({ title, message, tone = "neutral", loading = false, actionLabel, onAction, fill = false }: FeedbackProps) {
  const toneClass = {
    neutral: "border-line bg-surface",
    success: "border-success bg-success-surface",
    warning: "border-warning bg-warning-surface",
    danger: "border-danger bg-danger-surface",
    offline: "border-line bg-raised",
  }[tone];
  const role = tone === "danger" || tone === "warning" ? "alert" : undefined;

  return (
    <View
      accessibilityLiveRegion={loading || tone === "success" ? "polite" : undefined}
      accessibilityRole={role}
      accessibilityState={{ busy: loading }}
      className={`${fill ? "flex-1 justify-center" : ""} rounded border p-5 ${toneClass}`}
    >
      {loading ? <ActivityIndicator className="mb-3 self-start" color={theme.action} /> : null}
      {title ? <Text className="font-semibold text-lg text-ink">{title}</Text> : null}
      <Text className={`${title ? "mt-2" : ""} font-body text-sm leading-5 text-muted`}>{message}</Text>
      {actionLabel && onAction ? <View className="mt-4 self-start"><Button label={actionLabel} variant="secondary" onPress={onAction} /></View> : null}
    </View>
  );
}
