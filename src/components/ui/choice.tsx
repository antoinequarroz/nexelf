import { Pressable, Text, View } from "react-native";

type ChoiceRole = "checkbox" | "radio";

type ChoiceProps = {
  label: string;
  accessibilityLabel?: string;
  selected: boolean;
  role?: ChoiceRole;
  disabled?: boolean;
  onPress: () => void;
};

export function Choice({ label, accessibilityLabel = label, selected, role = "checkbox", disabled = false, onPress }: ChoiceProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={role}
      accessibilityState={role === "checkbox" ? { checked: selected, disabled } : { checked: selected, disabled }}
      className={`min-h-touch justify-center rounded border px-4 py-2 ${selected ? "border-action bg-reflection" : "border-line bg-surface"} ${disabled ? "opacity-50" : ""}`}
      disabled={disabled}
      onPress={onPress}
    >
      <Text className={`font-medium text-sm ${selected ? "text-action" : "text-ink"}`}>{label}</Text>
    </Pressable>
  );
}

export function ChoiceGroup({ children }: { children: React.ReactNode }) {
  return <View className="flex-row flex-wrap gap-3">{children}</View>;
}
