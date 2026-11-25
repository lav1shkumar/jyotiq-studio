import type { Clue } from "./gfx6";

/* Shared screen positions for Episode 6, so overlays and scenes agree.
   The enchanted scene's clue freeze holds Mohini at MOHINI_CLUE_POS (feet), scale MOHINI_CLUE_S.
   Mohini's figure units: face centre (0,-696), Kaustubha (0,-520), pallu across the chest (-40,-460).
   Screen = feet + s * units (s 1.25, feet 540,1820) before the scene's slight zoom (<= 1.08). */

export const MOHINI_CLUE_POS: [number, number] = [540, 1820];
export const MOHINI_CLUE_S = 1.25;

export const CLUES: Clue[] = [
  { x: 560, y: 945, r: 66, label: "नीला रंग", dx: 84, dy: -40 },
  { x: 632, y: 1080, r: 40, label: "पीताम्बर", dx: 56, dy: -30 },
  { x: 540, y: 1170, r: 40, label: "कौस्तुभ", dx: -270, dy: -20 },
];
export const CLUE_ASK_Y = 1380;
