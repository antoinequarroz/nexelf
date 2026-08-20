import { Text, View } from "react-native";

export function AuthMessage({ message, kind }: { message: string; kind: "error" | "success" }) {
  return (
    <View
      accessibilityRole={kind === "error" ? "alert" : undefined}
      className={`mb-5 rounded border p-4 ${
        kind === "error" ? "border-danger bg-surface" : "border-lime bg-surface"
      }`}
    >
      <Text className={`font-body text-sm leading-5 ${kind === "error" ? "text-danger" : "text-ink"}`}>
        {message}
      </Text>
    </View>
  );
}
