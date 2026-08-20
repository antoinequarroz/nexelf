import type { TextInputProps } from "react-native";
import { Text, TextInput, View } from "react-native";
import { theme } from "../../lib/theme";

type FieldProps = TextInputProps & {
  label: string;
  error?: string;
  help?: string;
};

export function Field({ label, error, help, editable = true, accessibilityHint: providedHint, ...props }: FieldProps) {
  const accessibilityHint = error ?? help ?? providedHint;
  return (
    <View className="mb-5">
      <Text className="mb-2 font-medium text-sm text-ink">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: !editable }}
        className={`min-h-14 rounded border bg-surface px-4 py-3 font-body text-base text-ink ${error ? "border-danger" : "border-line"} ${editable ? "" : "opacity-50"}`}
        editable={editable}
        placeholderTextColor={theme.textSubtle}
        selectionColor={theme.action}
        {...props}
      />
      {error ? <Text accessibilityRole="alert" className="mt-2 font-body text-sm text-danger">{error}</Text> : null}
      {!error && help ? <Text className="mt-2 font-body text-sm leading-5 text-muted">{help}</Text> : null}
    </View>
  );
}
