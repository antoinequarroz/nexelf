import { Feedback } from "../ui/feedback";

export function AuthMessage({ message, kind }: { message: string; kind: "error" | "success" }) {
  return <Feedback message={message} tone={kind === "error" ? "danger" : "success"} />;
}
