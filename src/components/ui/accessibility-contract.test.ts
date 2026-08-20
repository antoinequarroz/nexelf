import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(path, "utf8");

describe("mobile accessibility contracts", () => {
  it("uses a shared touch target that satisfies Android and iOS", () => {
    const tokens = source("tailwind.config.js");
    expect(tokens).toContain("minHeight: { touch: 48 }");
    expect(tokens).toContain("minWidth: { touch: 48 }");
  });

  it("exposes button names and busy state", () => {
    const button = source("src/components/ui/button.tsx");
    expect(button).toContain("accessibilityLabel={shownLabel}");
    expect(button).toContain("accessibilityState={{ busy: loading, disabled: inactive }}");
  });

  it("announces loading and success feedback without an assertive loop", () => {
    const feedback = source("src/components/ui/feedback.tsx");
    expect(feedback).toContain('tone === "success" ? "polite"');
    expect(feedback).toContain("accessibilityState={{ busy: loading }}");
  });

  it("keeps informative and decorative image contracts mutually exclusive", () => {
    const imageFrame = source("src/components/ui/image-frame.tsx");
    expect(imageFrame).toContain("accessibilityLabel: string; decorative?: false");
    expect(imageFrame).toContain("accessibilityLabel?: never; decorative: true");
    expect(imageFrame).toContain("accessible={!decorative}");
  });
});
