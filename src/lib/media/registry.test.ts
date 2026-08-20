import { describe, expect, it } from "vitest";
import type { MediaAsset } from "./manifest";
import { ratioToNumber, resolveMedia, resolveMediaAsset, selectMediaVariant } from "./registry";

function asset(overrides: Partial<MediaAsset> = {}): MediaAsset {
  return {
    id: "illustration-test-approved-01",
    role: "screen_hero",
    family: "illustration",
    sourceType: "original",
    sourceUrlOrReference: "internal:test",
    author: "Nexelf",
    license: "project-authored",
    licenseProof: "internal:test",
    acquiredAt: "2026-08-20",
    allowedUses: ["expo-app"],
    attribution: null,
    expiresAt: null,
    containsIdentifiablePerson: false,
    consentReference: null,
    aiModel: null,
    aiPromptReference: null,
    generatedAt: null,
    focalPoint: { x: 0.5, y: 0.4 },
    ratios: ["4:5"],
    altFr: null,
    decorative: true,
    variants: [
      { density: "1x", delivery: "remote", pathOrKey: "https://media.nexelf.test/asset-v1-400.webp", format: "webp", width: 400, height: 500, bytes: 40_000 },
      { density: "2x", delivery: "remote", pathOrKey: "https://media.nexelf.test/asset-v1-800.webp", format: "webp", width: 800, height: 1000, bytes: 80_000 },
    ],
    width: 800,
    height: 1000,
    bytes: 80_000,
    reviewStatus: "approved",
    approvedBy: "brand-owner",
    approvedAt: "2026-08-20",
    reviewNotes: null,
    ...overrides,
  };
}

describe("media registry", () => {
  it("never exposes the current placeholders before brand approval", () => {
    expect(resolveMedia("illustration-placeholder-portrait-01", 360, 3).availability).toBe("not_approved");
    expect(resolveMedia("illustration-placeholder-portrait-01", 360, 3).source).toBeNull();
  });

  it.each([
    "horizon-accueil-matin-01",
    "cap-onboarding-ouverture-01",
    "gesture-objectifs-trajectoire-01",
  ])("keeps generated pack candidate %s blocked pending review", (assetId) => {
    const result = resolveMedia(assetId, 342, 3);
    expect(result.availability).toBe("not_approved");
    expect(result.source).toBeNull();
  });

  it("reserves the documented layout for generated pack candidates", () => {
    expect(ratioToNumber("3:2")).toBe(1.5);
    expect(ratioToNumber("4:5")).toBe(0.8);
  });

  it("selects the smallest variant that covers rendered pixels", () => {
    expect(selectMediaVariant(asset(), 300, 2)?.width).toBe(800);
    expect(selectMediaVariant(asset(), 180, 2)?.width).toBe(400);
  });

  it("builds a versioned cache key for approved remote media", () => {
    const result = resolveMediaAsset(asset(), 300, 2, new Date("2026-08-21"));
    expect(result.availability).toBe("ready");
    expect(result.cacheKey).toContain("asset-v1-800.webp");
    expect(result.source).toMatchObject({ uri: "https://media.nexelf.test/asset-v1-800.webp", cacheKey: result.cacheKey });
  });

  it("blocks expired, withdrawn and unresolved bundled assets", () => {
    expect(resolveMediaAsset(asset({ expiresAt: "2026-08-19" }), 300, 2, new Date("2026-08-20")).availability).toBe("expired");
    expect(resolveMediaAsset(asset({ reviewStatus: "withdrawn" }), 300, 2).availability).toBe("not_approved");
    expect(resolveMediaAsset(asset({ allowedUses: ["marketing"] }), 300, 2).availability).toBe("not_approved");
    const bundled = asset({ variants: [{ ...asset().variants[0], delivery: "bundled", pathOrKey: "assets/media/derivatives/missing.webp" }] });
    expect(resolveMediaAsset(bundled, 300, 2, new Date(), {}).availability).toBe("unresolved");
  });

  it("parses documented ratios with a safe fallback", () => {
    expect(ratioToNumber("4:5")).toBe(0.8);
    expect(ratioToNumber("invalid", 1.5)).toBe(1.5);
  });
});
