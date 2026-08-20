import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "../ui/header";
import { Screen } from "../ui/screen";

type AuthShellProps = PropsWithChildren<{
  title: string;
  description: string;
}>;

export function AuthShell({ title, description, children }: AuthShellProps) {
  const { t } = useTranslation();

  return (
    <Screen centered keyboard contentClassName="py-12">
        <Header description={description} metadata={t("app.nom")} title={title} />
        {children}
    </Screen>
  );
}
