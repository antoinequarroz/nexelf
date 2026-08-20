import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { theme } from "../../lib/theme";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

type ButtonProps = {
  label: string;
  loadingLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  onPress: () => void;
};

const buttonStyles: Record<ButtonVariant, string> = {
  primary: "bg-action active:bg-action-pressed",
  secondary: "border border-line bg-surface active:bg-raised",
  ghost: "bg-transparent active:bg-raised",
  destructive: "bg-danger active:opacity-90",
};

const labelStyles: Record<ButtonVariant, string> = {
  primary: "text-action-ink",
  secondary: "text-ink",
  ghost: "text-action",
  destructive: "text-danger-ink",
};

export function Button({ label, loadingLabel, loading = false, disabled = false, variant = "primary", onPress }: ButtonProps) {
  const inactive = disabled || loading;
  const shownLabel = loading && loadingLabel ? loadingLabel : label;
  const spinnerColor = variant === "primary" || variant === "destructive" ? theme.onAction : theme.action;

  return (
    <Pressable
      accessibilityLabel={shownLabel}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: inactive }}
      className={`min-h-touch flex-row items-center justify-center rounded px-5 py-3 ${buttonStyles[variant]} ${inactive ? "opacity-50" : ""}`}
      disabled={inactive}
      onPress={onPress}
    >
      {loading ? <ActivityIndicator className="mr-3" color={spinnerColor} /> : null}
      <Text className={`text-center font-semibold text-base ${labelStyles[variant]}`}>{shownLabel}</Text>
    </Pressable>
  );
}

type IconButtonProps = {
  accessibilityLabel: string;
  children: ReactNode;
  disabled?: boolean;
  onPress: () => void;
};

export function IconButton({ accessibilityLabel, children, disabled = false, onPress }: IconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className={`min-h-touch min-w-touch items-center justify-center rounded-full border border-line bg-surface active:bg-raised ${disabled ? "opacity-50" : ""}`}
      disabled={disabled}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}
