import { describe, expect, it } from "vitest";
import { parseSupportDraft, SUPPORT_DRAFT_MAX_AGE_MS, validateSupportDraft } from "./support";

const valid = {
  category: "ia" as const,
  subject: "Réponse incorrecte",
  message: "Cette réponse ne correspond pas à ma demande.",
  updatedAt: 1_000,
};

describe("support", () => {
  it("valide les bornes sans inspecter le contenu libre", () => {
    expect(validateSupportDraft(valid)).toBeNull();
    expect(validateSupportDraft({ ...valid, subject: "non" })).toBe("subject");
    expect(validateSupportDraft({ ...valid, message: "trop court" })).toBe("message");
  });

  it("rejette un brouillon expiré ou mal formé", () => {
    expect(parseSupportDraft(JSON.stringify(valid), 2_000)).toEqual(valid);
    expect(parseSupportDraft(JSON.stringify(valid), 1_000 + SUPPORT_DRAFT_MAX_AGE_MS + 1)).toBeNull();
    expect(parseSupportDraft("secret non json")).toBeNull();
  });
});
