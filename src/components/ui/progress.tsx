import { View } from "react-native";

export function Progress({ value, max, label }: { value: number; max: number; label: string }) {
  const safeMax = Math.max(1, max);
  const safeValue = Math.min(Math.max(0, value), safeMax);
  const width = `${Math.round((safeValue / safeMax) * 100)}%` as `${number}%`;

  return (
    <View accessible accessibilityLabel={label} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: safeMax, now: safeValue }}>
      <View className="h-1.5 overflow-hidden rounded-full bg-line">
        <View className="h-full rounded-full bg-progress" style={{ width }} />
      </View>
    </View>
  );
}
