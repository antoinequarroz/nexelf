import type { RandomSource } from "./types";

export interface BackoffOptions {
  baseMs?: number;
  maxMs?: number;
  jitterRatio?: number;
}

export function retryDelayMs(
  attempts: number,
  random: RandomSource,
  options: BackoffOptions = {},
): number {
  const baseMs = options.baseMs ?? 1_000;
  const maxMs = options.maxMs ?? 5 * 60_000;
  const jitterRatio = options.jitterRatio ?? 0.2;
  const exponent = Math.max(0, Math.min(30, attempts - 1));
  const capped = Math.min(maxMs, baseMs * 2 ** exponent);
  const jitter = (random.next() * 2 - 1) * jitterRatio;
  return Math.max(0, Math.round(capped * (1 + jitter)));
}
