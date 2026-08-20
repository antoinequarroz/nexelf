import { ActivityIndicator, Pressable, Text } from "react-native";

type AuthButtonProps = {
  label: string;
  loadingLabel: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function AuthButton({ label, loadingLabel, loading, disabled, onPress }: AuthButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: disabled || loading }}
      className="min-h-14 flex-row items-center justify-center rounded bg-lime px-6 active:bg-lime-pressed disabled:opacity-50"
      disabled={disabled || loading}
      onPress={onPress}
    >
      {loading ? <ActivityIndicator className="mr-3" color="#172006" /> : null}
      <Text className="font-semibold text-base text-lime-ink">{loading ? loadingLabel : label}</Text>
    </Pressable>
  );
}
