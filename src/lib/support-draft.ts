import * as SecureStore from "expo-secure-store";
import { parseSupportDraft, type SupportDraft } from "./support";

function key(accountId: string) {
  return `nexelf.support.draft.${accountId.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}
export async function loadSupportDraft(accountId: string) {
  const stored = await SecureStore.getItemAsync(key(accountId));
  const draft = parseSupportDraft(stored);
  if (!draft && stored) await SecureStore.deleteItemAsync(key(accountId));
  return draft;
}

export async function saveSupportDraft(accountId: string, draft: SupportDraft) {
  await SecureStore.setItemAsync(key(accountId), JSON.stringify(draft));
}

export async function clearSupportDraft(accountId: string) {
  await SecureStore.deleteItemAsync(key(accountId));
}
