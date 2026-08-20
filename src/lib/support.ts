export const SUPPORT_CATEGORIES = ["compte", "donnees", "abonnement", "ia", "autre"] as const;
export type SupportCategory = (typeof SUPPORT_CATEGORIES)[number];

export type SupportDraft = {
  category: SupportCategory;
  subject: string;
  message: string;
  updatedAt: number;
};

export type SupportDiagnostic = {
  appVersion: string;
  platform: "ios" | "android" | "web" | "unknown";
  systemVersion: string;
  locale: string;
};

export const SUPPORT_DRAFT_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export function validateSupportDraft(draft: SupportDraft) {
  const subject = draft.subject.trim();
  const message = draft.message.trim();
  if (!SUPPORT_CATEGORIES.includes(draft.category)) return "category" as const;
  if (subject.length < 5 || subject.length > 120) return "subject" as const;
  if (message.length < 20 || message.length > 2000) return "message" as const;
  return null;
}
export function parseSupportDraft(value: string | null, now = Date.now()): SupportDraft | null {
  if (!value) return null;
  try {
    const draft = JSON.parse(value) as Partial<SupportDraft>;
    if (
      typeof draft.category !== "string" ||
      !SUPPORT_CATEGORIES.includes(draft.category as SupportCategory) ||
      typeof draft.subject !== "string" ||
      typeof draft.message !== "string" ||
      typeof draft.updatedAt !== "number" ||
      now - draft.updatedAt > SUPPORT_DRAFT_MAX_AGE_MS
    ) return null;
    return draft as SupportDraft;
  } catch {
    return null;
  }
}

export function createOperationId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 14)}`;
}
