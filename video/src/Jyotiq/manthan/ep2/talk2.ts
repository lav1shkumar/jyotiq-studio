import { LINES } from "./timing";
import { VO } from "./voData";

/* Episode 2 lip sync. The rig's talkAt() reads Episode 1's takes, so Episode 2 uses this. */

/** Mouth openness 0..1 for an Episode 2 line at reel frame f (0 outside the line). "01b" replays take 01. */
export const talk2 = (line: string, f: number): number => {
  const r = LINES[line];
  const v = VO[line === "01b" ? "01_swarbhanu" : line];
  if (!r || !v) return 0;
  const i = Math.round(f) - r[0];
  if (i < 0 || i >= v.env.length) return 0;
  const g = (k: number) => v.env[Math.max(0, Math.min(v.env.length - 1, k))];
  return Math.min(1, ((g(i - 1) + 2 * g(i) + g(i + 1)) / 4) * 1.1);
};

/** Mouth for a character who speaks several lines. */
export const talkAny = (lines: string[], f: number): number => lines.reduce((m, l) => Math.max(m, talk2(l, f)), 0);

/** Every line each speaker owns, so a puppet's mouth moves on all of them. */
export const SPEAKS = {
  swarbhanu: ["01_swarbhanu", "06_swarbhanu", "10_swarbhanu", "01b", "12_swarbhanu", "15_swarbhanu"],
  bali: ["04_bali", "07_bali"],
  indra: ["05_indra", "14_indra"],
  vasuki: ["09_vasuki"],
  vishnu: ["11_vishnu"],
} as const;

export const mouth = (who: keyof typeof SPEAKS, f: number): number => talkAny([...SPEAKS[who]], f);
