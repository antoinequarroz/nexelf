import type { TextInputProps } from "react-native";
import { Text, TextInput, View } from "react-native";

type AuthFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function AuthField({ label, error, ...props }: AuthFieldProps) {
  return (
    <View className="mb-5">
      <Text className="mb-2 font-medium text-sm text-ink">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        className={`min-h-14 rounded border bg-surface px-4 font-body text-base text-ink ${
          error ? "border-danger" : "border-line"
        }`}
        placeholderTextColor="#707783"
        selectionColor="#C7F36B"
        {...props}
      />
      {error ? (
        <Text accessibilityRole="alert" className="mt-2 font-body text-sm text-danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
