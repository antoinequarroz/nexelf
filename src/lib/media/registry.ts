import type { ImageSource } from "expo-image";
import type { MediaAsset, MediaVariant } from "./manifest";
import { mediaManifest } from "./manifest";

const noBundledMediaSources: Readonly<Record<string, ImageSource>> = {};

export type MediaAvailability = "ready" | "missing" | "not_approved" | "expired" | "unresolved";

export interface MediaResolution {
  availability: MediaAvailability;
  asset: MediaAsset | null;
  variant: MediaVariant | null;
  source: ImageSource | null;
  cacheKey: string | null;
}

export function ratioToNumber(ratio: string | undefined, fallback = 1) {
  const match = ratio?.match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
  if (!match) return fallback;
  const width = Number(match[1]);
  const height = Number(match[2]);
  return width > 0 && height > 0 ? width / height : fallback;
}

export function selectMediaVariant(asset: MediaAsset, renderedWidth: number, pixelRatio: number) {
  const targetWidth = Math.max(1, renderedWidth) * Math.min(Math.max(1, pixelRatio), 3);
  return [...asset.variants].sort((left, right) => left.width - right.width).find((variant) => variant.width >= targetWidth)
    ?? [...asset.variants].sort((left, right) => right.width - left.width)[0]
    ?? null;
}

export function resolveMediaAsset(asset: MediaAsset | null, renderedWidth: number, pixelRatio: number, now = new Date(), bundledSources: Readonly<Record<string, ImageSource>> = noBundledMediaSources): MediaResolution {
  if (!asset) return { availability: "missing", asset: null, variant: null, source: null, cacheKey: null };
  if (asset.reviewStatus !== "approved") return { availability: "not_approved", asset, variant: null, source: null, cacheKey: null };
  if (!asset.allowedUses.includes("expo-app")) return { availability: "not_approved", asset, variant: null, source: null, cacheKey: null };
  if (asset.expiresAt && asset.expiresAt < now.toISOString().slice(0, 10)) return { availability: "expired", asset, variant: null, source: null, cacheKey: null };
  const variant = selectMediaVariant(asset, renderedWidth, pixelRatio);
  if (!variant) return { availability: "unresolved", asset, variant: null, source: null, cacheKey: null };

  const cacheKey = `${asset.id}:${variant.pathOrKey}`;
  if (variant.delivery === "bundled") {
    const source = bundledSources[variant.pathOrKey] ?? null;
    return { availability: source ? "ready" : "unresolved", asset, variant, source, cacheKey };
  }
  if (!/^https:\/\//.test(variant.pathOrKey)) return { availability: "unresolved", asset, variant, source: null, cacheKey };
  return { availability: "ready", asset, variant, source: { uri: variant.pathOrKey, cacheKey }, cacheKey };
}

export function resolveMedia(assetId: string, renderedWidth: number, pixelRatio: number, now = new Date(), bundledSources: Readonly<Record<string, ImageSource>> = noBundledMediaSources): MediaResolution {
  const asset = mediaManifest.assets.find((candidate) => candidate.id === assetId) ?? null;
  return resolveMediaAsset(asset, renderedWidth, pixelRatio, now, bundledSources);
}

export function getMediaLayout(assetId: string) {
  const asset = mediaManifest.assets.find((candidate) => candidate.id === assetId) ?? null;
  return {
    aspectRatio: ratioToNumber(asset?.ratios[0], asset ? asset.width / asset.height : 1),
    focalPoint: asset?.focalPoint ?? { x: 0.5, y: 0.5 },
  };
}
