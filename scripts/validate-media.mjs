import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const MAX_BYTES_BY_ROLE = Object.freeze({
  screen_hero: 180 * 1024,
  card_image: 70 * 1024,
  thumbnail: 35 * 1024,
  avatar: 35 * 1024,
  state_illustration: 80 * 1024,
});

const REQUIRED_ASSET_FIELDS = [
  "id", "role", "family", "sourceType", "sourceUrlOrReference", "author",
  "license", "licenseProof", "acquiredAt", "allowedUses", "attribution",
  "expiresAt", "containsIdentifiablePerson", "consentReference", "aiModel",
  "aiPromptReference", "generatedAt", "focalPoint", "ratios", "altFr",
  "decorative", "variants", "width", "height", "bytes", "reviewStatus",
  "approvedBy", "approvedAt", "reviewNotes",
];

const ALLOWED_FAMILIES = new Set(["cap", "gesture", "horizon", "illustration"]);
const ALLOWED_SOURCE_TYPES = new Set(["original", "generated", "licensed", "shooting", "user_provided"]);
const ALLOWED_STATUSES = new Set(["processing", "needs_review", "approved", "rejected", "withdrawn"]);
const ALLOWED_FORMATS = new Set(["svg", "webp", "png", "jpeg"]);
const ALLOWED_DENSITIES = new Set(["1x", "2x", "3x"]);

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isDate(value) {
  return value === null || (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function inspectSvg(buffer) {
  const source = buffer.toString("utf8");
  if (/<script\b|<foreignObject\b|\b(?:href|xlink:href)\s*=\s*["'](?:https?:|data:|\/\/)/i.test(source)) {
    throw new Error("SVG contains executable or external content");
  }
  const width = Number(source.match(/<svg\b[^>]*\bwidth=["'](\d+)(?:px)?["']/i)?.[1]);
  const height = Number(source.match(/<svg\b[^>]*\bheight=["'](\d+)(?:px)?["']/i)?.[1]);
  if (!width || !height) throw new Error("SVG must declare integer width and height");
  return { width, height };
}

function inspectPng(buffer) {
  const signature = "89504e470d0a1a0a";
  if (buffer.subarray(0, 8).toString("hex") !== signature || buffer.length < 24) {
    throw new Error("invalid PNG header");
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function inspectJpeg(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) throw new Error("invalid JPEG header");
  let offset = 2;
  while (offset + 8 < buffer.length) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
    }
    offset += 2 + length;
  }
  throw new Error("JPEG dimensions not found");
}

function readUInt24LE(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

function inspectWebp(buffer) {
  if (buffer.subarray(0, 4).toString("ascii") !== "RIFF" || buffer.subarray(8, 12).toString("ascii") !== "WEBP") {
    throw new Error("invalid WebP header");
  }
  const chunk = buffer.subarray(12, 16).toString("ascii");
  if (chunk === "VP8X" && buffer.length >= 30) {
    return { width: readUInt24LE(buffer, 24) + 1, height: readUInt24LE(buffer, 27) + 1 };
  }
  if (chunk === "VP8 " && buffer.length >= 30) {
    return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === "VP8L" && buffer.length >= 25) {
    const bits = buffer.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  throw new Error(`unsupported WebP chunk ${chunk}`);
}

export function inspectMediaBuffer(buffer, extension) {
  const normalized = extension.toLowerCase().replace(/^\./, "");
  const dimensions = normalized === "svg"
    ? inspectSvg(buffer)
    : normalized === "png"
      ? inspectPng(buffer)
      : normalized === "jpg" || normalized === "jpeg"
        ? inspectJpeg(buffer)
        : normalized === "webp"
          ? inspectWebp(buffer)
          : (() => { throw new Error(`unsupported format ${normalized}`); })();
  return {
    ...dimensions,
    bytes: buffer.byteLength,
    sha256: createHash("sha256").update(buffer).digest("hex"),
  };
}

export function validateMediaManifest(manifest, inventory = new Map()) {
  const errors = [];
  if (!manifest || manifest.version !== 1 || !Array.isArray(manifest.assets)) {
    return ["manifest: expected version 1 and an assets array"];
  }

  const ids = new Set();
  const paths = new Set();
  const hashes = new Map();

  for (const [index, asset] of manifest.assets.entries()) {
    const prefix = `assets[${index}]${asset?.id ? ` (${asset.id})` : ""}`;
    if (!asset || typeof asset !== "object") { errors.push(`${prefix}: expected an object`); continue; }
    for (const field of REQUIRED_ASSET_FIELDS) {
      if (!Object.hasOwn(asset, field)) errors.push(`${prefix}: missing explicit field ${field}`);
    }
    if (!/^[a-z][a-z0-9]+(?:-[a-z0-9]+){2,}$/.test(asset.id ?? "")) errors.push(`${prefix}: invalid semantic id`);
    if (ids.has(asset.id)) errors.push(`${prefix}: duplicate id`); else ids.add(asset.id);
    if (!Object.hasOwn(MAX_BYTES_BY_ROLE, asset.role)) errors.push(`${prefix}: unknown role ${asset.role}`);
    if (!ALLOWED_FAMILIES.has(asset.family)) errors.push(`${prefix}: unknown family ${asset.family}`);
    if (!ALLOWED_SOURCE_TYPES.has(asset.sourceType)) errors.push(`${prefix}: unknown sourceType ${asset.sourceType}`);
    if (!ALLOWED_STATUSES.has(asset.reviewStatus)) errors.push(`${prefix}: unknown reviewStatus ${asset.reviewStatus}`);
    if (!isDate(asset.acquiredAt) || !isDate(asset.expiresAt) || !isDate(asset.generatedAt) || !isDate(asset.approvedAt)) errors.push(`${prefix}: dates must be YYYY-MM-DD or null`);
    if (!Array.isArray(asset.allowedUses) || asset.allowedUses.length === 0) errors.push(`${prefix}: allowedUses cannot be empty`);
    if (!Array.isArray(asset.ratios) || asset.ratios.length === 0) errors.push(`${prefix}: ratios cannot be empty`);
    if (!Number.isInteger(asset.width) || asset.width < 1 || !Number.isInteger(asset.height) || asset.height < 1 || !Number.isInteger(asset.bytes) || asset.bytes < 1) errors.push(`${prefix}: aggregate dimensions and bytes must be positive integers`);
    if (!asset.focalPoint || !Number.isFinite(asset.focalPoint.x) || !Number.isFinite(asset.focalPoint.y) || asset.focalPoint.x < 0 || asset.focalPoint.x > 1 || asset.focalPoint.y < 0 || asset.focalPoint.y > 1) errors.push(`${prefix}: focalPoint must use normalized x/y values`);
    if (asset.decorative === true && asset.altFr !== null) errors.push(`${prefix}: decorative assets must have altFr null`);
    if (asset.decorative === false && !hasText(asset.altFr)) errors.push(`${prefix}: informative assets need altFr`);
    if (asset.containsIdentifiablePerson === true && !hasText(asset.consentReference)) errors.push(`${prefix}: identifiable people require consentReference`);
    if (asset.sourceType === "generated" && (!hasText(asset.aiModel) || !hasText(asset.aiPromptReference) || !isDate(asset.generatedAt) || asset.generatedAt === null)) errors.push(`${prefix}: generated assets require model, prompt reference and generation date`);
    if (asset.sourceType !== "generated" && (asset.aiModel !== null || asset.aiPromptReference !== null || asset.generatedAt !== null)) errors.push(`${prefix}: non-generated assets must set AI fields to null`);
    if (asset.reviewStatus === "approved" && (!hasText(asset.license) || !hasText(asset.licenseProof) || !hasText(asset.approvedBy) || asset.approvedAt === null)) errors.push(`${prefix}: approved assets require rights proof and approval`);
    if (hasText(asset.sourceUrlOrReference) && /[?&](?:token|signature|sig|key)=/i.test(asset.sourceUrlOrReference)) errors.push(`${prefix}: source reference must not contain credentials`);
    if (!Array.isArray(asset.variants) || asset.variants.length === 0) { errors.push(`${prefix}: at least one variant is required`); continue; }

    const maxBytes = MAX_BYTES_BY_ROLE[asset.role];
    for (const [variantIndex, variant] of asset.variants.entries()) {
      const variantPrefix = `${prefix}.variants[${variantIndex}]`;
      if (!ALLOWED_DENSITIES.has(variant.density)) errors.push(`${variantPrefix}: invalid density`);
      if (!ALLOWED_FORMATS.has(variant.format)) errors.push(`${variantPrefix}: invalid format`);
      if (!Number.isInteger(variant.width) || variant.width < 1 || !Number.isInteger(variant.height) || variant.height < 1 || !Number.isInteger(variant.bytes) || variant.bytes < 1) errors.push(`${variantPrefix}: dimensions and bytes must be positive integers`);
      if (maxBytes && variant.bytes > maxBytes) errors.push(`${variantPrefix}: ${variant.bytes} bytes exceeds ${maxBytes} budget for ${asset.role}`);
      if (variant.pathOrKey.includes("..") || variant.pathOrKey.startsWith("/") || variant.pathOrKey.includes("\\")) errors.push(`${variantPrefix}: pathOrKey must be a safe project-relative path or storage key`);
      if (variant.delivery === "bundled" && !variant.pathOrKey.startsWith("assets/media/derivatives/")) errors.push(`${variantPrefix}: bundled files must stay under assets/media/derivatives`);
      const expectedExtension = variant.format === "jpeg" ? /\.(?:jpe?g)$/i : new RegExp(`\\.${variant.format}$`, "i");
      if (!expectedExtension.test(variant.pathOrKey)) errors.push(`${variantPrefix}: format does not match path extension`);
      if (paths.has(variant.pathOrKey)) errors.push(`${variantPrefix}: duplicate pathOrKey`); else paths.add(variant.pathOrKey);
      if (variant.delivery !== "bundled") continue;
      const file = inventory.get(variant.pathOrKey);
      if (!file) { errors.push(`${variantPrefix}: bundled file is missing`); continue; }
      if (file.width !== variant.width || file.height !== variant.height) errors.push(`${variantPrefix}: declared ${variant.width}x${variant.height}, file is ${file.width}x${file.height}`);
      if (file.bytes !== variant.bytes) errors.push(`${variantPrefix}: declared ${variant.bytes} bytes, file has ${file.bytes}`);
      if (hashes.has(file.sha256)) errors.push(`${variantPrefix}: duplicates binary used by ${hashes.get(file.sha256)}`); else hashes.set(file.sha256, variant.pathOrKey);
    }
    const largestWidth = Math.max(...asset.variants.map((variant) => variant.width));
    const largestHeight = Math.max(...asset.variants.map((variant) => variant.height));
    const largestBytes = Math.max(...asset.variants.map((variant) => variant.bytes));
    if (asset.width !== largestWidth || asset.height !== largestHeight || asset.bytes !== largestBytes) errors.push(`${prefix}: aggregate width, height and bytes must describe the largest declared variant`);
  }

  for (const path of inventory.keys()) {
    if (!paths.has(path)) errors.push(`orphan derivative: ${path}`);
  }
  return errors;
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  }));
  return nested.flat();
}

export async function buildInventory(projectRoot, derivativesDirectory = "assets/media/derivatives") {
  const absoluteDirectory = resolve(projectRoot, derivativesDirectory);
  const inventory = new Map();
  for (const absolutePath of await listFiles(absoluteDirectory)) {
    const relativePath = relative(projectRoot, absolutePath).split(sep).join("/");
    const buffer = await readFile(absolutePath);
    inventory.set(relativePath, inspectMediaBuffer(buffer, extname(absolutePath)));
  }
  return inventory;
}

async function run() {
  const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
  const manifestPath = join(projectRoot, "assets/media/manifest.json");
  await stat(manifestPath);
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const inventory = await buildInventory(projectRoot);
  const errors = validateMediaManifest(manifest, inventory);
  if (errors.length > 0) {
    console.error(`Media validation failed (${errors.length})`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Media validation passed: ${manifest.assets.length} assets, ${inventory.size} derivatives.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await run();
}
