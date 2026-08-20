import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(path, "utf8");

describe("secondary mutation robustness", () => {
  it.each([
    "src/app/(tabs)/objectifs.tsx",
    "src/app/habitudes.tsx",
    "src/app/memoire.tsx",
  ])("keeps a retryable operation in %s", (path) => {
    const screen = source(path);
    expect(screen).toContain("actionBusy");
    expect(screen).toContain("actionError");
    expect(screen).toContain("retryAction");
    expect(screen).toContain("performAction");
    expect(screen).toContain('t("etats.erreur.reessayer")');
  });

  it("only clears goal deletion state after successful deletion or restore", () => {
    const goals = source("src/app/(tabs)/objectifs.tsx");
    expect(goals.indexOf("await remove")).toBeLessThan(goals.indexOf("setDeleted(goal._id)"));
    expect(goals.indexOf("await restore")).toBeLessThan(goals.lastIndexOf("setDeleted(null)"));
  });

  it("keeps the goal editor and secondary actions collapsed by default", () => {
    const goals = source("src/app/(tabs)/objectifs.tsx");
    expect(goals).toContain("useState(false)");
    expect(goals).toContain("expandedActions");
    expect(goals).toContain('"goals.actions.show"');
    expect(goals).toContain("!formOpen && (goals === undefined");
  });

  it("only clears habit drafts inside the protected mutation", () => {
    const habits = source("src/app/habitudes.tsx");
    expect(habits.indexOf("await create(values)")).toBeLessThan(habits.indexOf('setName("")'));
    expect(habits.indexOf("await createRoutine")).toBeLessThan(habits.indexOf('setRoutineName("")'));
  });

  it("only closes memory correction after the mutation succeeds", () => {
    const memory = source("src/app/memoire.tsx");
    expect(memory.indexOf("await correct")).toBeLessThan(memory.indexOf("setEditing(undefined)"));
  });
});
