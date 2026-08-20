import { describe, expect, it } from "vitest";
import { inspectMediaBuffer, validateMediaManifest } from "./validate-media.mjs";

function validAsset(overrides = {}) {
  return {
    id: "illustration-test-state-01",
    role: "state_illustration",
    family: "illustration",
    sourceType: "original",
    sourceUrlOrReference: "internal:test",
    author: "Nexelf",
    license: "project-authored",
    licenseProof: "internal:test-proof",
    acquiredAt: "2026-08-20",
    allowedUses: ["test"],
    attribution: null,
    expiresAt: null,
    containsIdentifiablePerson: false,
    consentReference: null,
    aiModel: null,
    aiPromptReference: null,
    generatedAt: null,
    focalPoint: { x: 0.5, y: 0.5 },
    ratios: ["1:1"],
    altFr: null,
    decorative: true,
    variants: [{ density: "1x", delivery: "bundled", pathOrKey: "assets/media/derivatives/test.svg", format: "svg", width: 10, height: 10, bytes: 69 }],
    width: 10,
    height: 10,
    bytes: 69,
    reviewStatus: "needs_review",
    approvedBy: null,
    approvedAt: null,
    reviewNotes: null,
    ...overrides,
  };
}

const file = { width: 10, height: 10, bytes: 69, sha256: "one" };

describe("media manifest validation", () => {
  it("accepts an explicit traceable asset", () => {
    const errors = validateMediaManifest({ version: 1, assets: [validAsset()] }, new Map([["assets/media/derivatives/test.svg", file]]));
    expect(errors).toEqual([]);
  });

  it("blocks missing consent, generated provenance and approval evidence", () => {
    const asset = validAsset({
      sourceType: "generated",
      containsIdentifiablePerson: true,
      reviewStatus: "approved",
      licenseProof: null,
      approvedBy: null,
      approvedAt: null,
    });
    const errors = validateMediaManifest({ version: 1, assets: [asset] }, new Map([["assets/media/derivatives/test.svg", file]]));
    expect(errors.join("\n")).toContain("consentReference");
    expect(errors.join("\n")).toContain("generated assets require");
    expect(errors.join("\n")).toContain("approved assets require");
  });

  it("rejects oversized, mismatched and orphaned derivatives", () => {
    const asset = validAsset({ variants: [{ ...validAsset().variants[0], bytes: 90 * 1024 }] });
    const inventory = new Map([
      ["assets/media/derivatives/test.svg", file],
      ["assets/media/derivatives/orphan.svg", { ...file, sha256: "two" }],
    ]);
    const errors = validateMediaManifest({ version: 1, assets: [asset] }, inventory);
    expect(errors.join("\n")).toContain("exceeds");
    expect(errors.join("\n")).toContain("declared 92160 bytes");
    expect(errors.join("\n")).toContain("orphan derivative");
  });

  it("reads dimensions and rejects executable SVG content", () => {
    const safe = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="20"></svg>');
    expect(inspectMediaBuffer(safe, ".svg")).toMatchObject({ width: 10, height: 20, bytes: safe.byteLength });
    const unsafe = Buffer.from('<svg width="10" height="20"><script>alert(1)</script></svg>');
    expect(() => inspectMediaBuffer(unsafe, ".svg")).toThrow("executable or external");
  });
});
