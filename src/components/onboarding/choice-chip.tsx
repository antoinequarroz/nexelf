import { Choice } from "../ui/choice";

export function ChoiceChip({ label, selected, role = "checkbox", onPress }: { label: string; selected: boolean; role?: "checkbox" | "radio"; onPress: () => void }) {
  return <Choice label={label} onPress={onPress} role={role} selected={selected} />;
}
