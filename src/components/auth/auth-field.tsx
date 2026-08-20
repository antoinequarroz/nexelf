import type { TextInputProps } from "react-native";
import { Field } from "../ui/field";

type AuthFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function AuthField({ label, error, ...props }: AuthFieldProps) {
  return <Field error={error} label={label} {...props} />;
}
