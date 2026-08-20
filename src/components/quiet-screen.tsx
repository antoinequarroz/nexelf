import type { PropsWithChildren } from "react";
import { Header } from "./ui/header";
import { Screen } from "./ui/screen";

export function QuietScreen({
  title,
  description,
  children,
}: PropsWithChildren<{ title: string; description: string }>) {
  return (
    <Screen contentClassName="pb-16 pt-12">
      <Header description={description} title={title} />
      {children}
    </Screen>
  );
}
