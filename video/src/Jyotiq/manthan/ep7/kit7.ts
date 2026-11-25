import { CUES, LINES } from "./timing";
import { VO } from "./voData";

/** Mouth openness for an Episode 7 line at reel frame f (0 outside the line). Same smoothing as rig.tsx's talkAt. */
export const talk7 = (line: string, f: number): number => {
  const r = LINES[line];
  const v = VO[line];
  if (!r || !v) return 0;
  const i = Math.round(f) - r[0];
  if (i < 0 || i >= v.env.length) return 0;
  const g = (k: number) => v.env[Math.max(0, Math.min(v.env.length - 1, k))];
  return Math.min(1, ((g(i - 1) + 2 * g(i) + g(i + 1)) / 4) * 1.1);
};

/** A cue frame from timing.ts, or `dflt` while timing.ts is still the placeholder. */
export const cue7 = (k: string, dflt: number): number => {
  const v = (CUES as Record<string, number | undefined>)[k];
  return typeof v === "number" ? v : dflt;
};

/** A scene or beat range from timing.ts, or `dflt` while timing.ts is still the placeholder. */
export const span7 = (
  rec: Record<string, readonly number[] | undefined>,
  k: string,
  dflt: readonly [number, number],
): readonly [number, number] => {
  const v = rec[k];
  return v && v.length >= 2 ? [v[0], v[1]] : dflt;
};
