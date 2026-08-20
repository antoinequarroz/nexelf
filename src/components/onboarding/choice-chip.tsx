import { Pressable, Text } from "react-native";

export function ChoiceChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      className={`mb-3 mr-3 min-h-12 justify-center rounded border px-4 ${selected ? "border-lime bg-raised" : "border-line bg-surface"}`}
      onPress={onPress}
    >
      <Text className={`font-medium text-sm ${selected ? "text-lime" : "text-ink"}`}>{label}</Text>
    </Pressable>
  );
}
