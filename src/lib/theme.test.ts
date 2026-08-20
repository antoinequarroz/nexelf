import { describe, expect, it } from "vitest";
import { theme } from "./theme";

function luminance(hex: string) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)!
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4,
    );
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground: string, background: string) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

describe("Élan lumineux theme", () => {
  it.each([
    ["primary text", theme.text, theme.background],
    ["muted text", theme.textMuted, theme.background],
    ["subtle text", theme.textSubtle, theme.background],
    ["primary action", theme.onAction, theme.action],
    ["progress action", theme.onProgress, theme.progress],
    ["danger action", theme.onDanger, theme.danger],
    ["success status", theme.success, theme.successSurface],
    ["warning status", theme.warning, theme.warningSurface],
    ["danger status", theme.danger, theme.dangerSurface],
    ["text on impulse", theme.text, theme.impulseSurface],
    ["text on reflection", theme.text, theme.reflectionSurface],
    ["text on growth", theme.text, theme.growthSurface],
  ])("keeps %s at WCAG AA contrast", (_name, foreground, background) => {
    expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5);
  });
});
