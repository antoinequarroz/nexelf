import { Button } from "../ui/button";

type AuthButtonProps = {
  label: string;
  loadingLabel: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function AuthButton({ label, loadingLabel, loading, disabled, onPress }: AuthButtonProps) {
  return <Button disabled={disabled} label={label} loading={loading} loadingLabel={loadingLabel} onPress={onPress} />;
}
