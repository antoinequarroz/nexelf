import rawManifest from "../../../assets/media/manifest.json";

export type MediaRole =
  | "screen_hero"
  | "card_image"
  | "thumbnail"
  | "avatar"
  | "state_illustration";

export type MediaFamily = "cap" | "gesture" | "horizon" | "illustration";
export type MediaSourceType = "original" | "generated" | "licensed" | "shooting" | "user_provided";
export type MediaReviewStatus = "processing" | "needs_review" | "approved" | "rejected" | "withdrawn";
export type MediaDensity = "1x" | "2x" | "3x";
export type MediaFormat = "svg" | "webp" | "png" | "jpeg";

export interface MediaVariant {
  density: MediaDensity;
  delivery: "bundled" | "remote";
  pathOrKey: string;
  format: MediaFormat;
  width: number;
  height: number;
  bytes: number;
}

export interface MediaAsset {
  id: string;
  role: MediaRole;
  family: MediaFamily;
  sourceType: MediaSourceType;
  sourceUrlOrReference: string | null;
  author: string | null;
  license: string | null;
  licenseProof: string | null;
  acquiredAt: string | null;
  allowedUses: string[];
  attribution: string | null;
  expiresAt: string | null;
  containsIdentifiablePerson: boolean;
  consentReference: string | null;
  aiModel: string | null;
  aiPromptReference: string | null;
  generatedAt: string | null;
  focalPoint: { x: number; y: number } | null;
  ratios: string[];
  altFr: string | null;
  decorative: boolean;
  variants: MediaVariant[];
  width: number;
  height: number;
  bytes: number;
  reviewStatus: MediaReviewStatus;
  approvedBy: string | null;
  approvedAt: string | null;
  reviewNotes: string | null;
}

export interface MediaManifest {
  version: 1;
  assets: MediaAsset[];
}

// Runtime validity is enforced by `pnpm media:check`; this cast gives app code
// a single typed read surface without duplicating the JSON data.
export const mediaManifest = rawManifest as MediaManifest;
