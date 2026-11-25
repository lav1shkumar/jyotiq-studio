import { LINES } from "./timing";
import { VO } from "./voData";

/** Mouth openness for an Episode 5 line at reel frame f (0 outside the line). Same smoothing as rig.tsx's talkAt. */
export const talk5 = (line: string, f: number): number => {
  const r = LINES[line];
  const v = VO[line];
  if (!r || !v) return 0;
  const i = Math.round(f) - r[0];
  if (i < 0 || i >= v.env.length) return 0;
  const g = (k: number) => v.env[Math.max(0, Math.min(v.env.length - 1, k))];
  return Math.min(1, ((g(i - 1) + 2 * g(i) + g(i + 1)) / 4) * 1.1);
};
