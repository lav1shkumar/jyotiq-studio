import { loadFont as loadKarla } from "@remotion/google-fonts/Karla";
import { loadFont as loadMarcellus } from "@remotion/google-fonts/Marcellus";
import { Easing, interpolate } from "remotion";
import vo from "./vo.json";

export const { fontFamily: KARLA } = loadKarla("normal", { weights: ["300", "400", "500", "600", "700"], subsets: ["latin"] });
export const { fontFamily: MARCELLUS } = loadMarcellus("normal", { weights: ["400"], subsets: ["latin"] });
export const SERIF = 'Georgia, "Times New Roman", serif';

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const TOTAL = 3750; // 125 s

// astroraag.com palette
export const C = {
  bg: "#FBF7EE",
  bg2: "#F6EFE1",
  card: "#FFFDF8",
  ink: "#2C1810",
  ink2: "#6B5646",
  ink3: "#A08D7B",
  hair: "rgba(44,24,16,0.16)",
  gold: "#D4A94A",
  goldHair: "rgba(212,169,74,0.45)",
  saffron: "#EA580C",
  saffronDeep: "#C2410C",
  amber: "#F59E0B",
  rust: "#9A3412",
  green: "#059669",
  violet: "#7C3AED",
  teal: "#0E7490",
  black: "#1C150E",
  red: "#B91C1C",
  space: "#06050A",
};

export const GRAD = `linear-gradient(100deg, ${C.saffronDeep} 0%, ${C.saffronDeep} 30%, ${C.amber} 55%, ${C.saffronDeep} 85%)`;

export const ease = Easing.bezier(0.16, 1, 0.3, 1); // expo-out: ElevenLabs-like settle
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.5, 0, 0.75, 0);

export const sec = (s: number) => Math.round(s * FPS);

type Line = { start: number; end: number };
const LINES = vo.lines as Record<string, Line>;
const WORDS = vo.words as { w: string; s: string; t0: number; t1: number }[];

/** VO line start/end in seconds (film time). */
export const line = (id: string): Line => LINES[id];

/** Film time (s) of the first word in line `id` that starts with `prefix` (case-insensitive); nth match. */
export const word = (id: string, prefix: string, nth = 0): number => {
  const m = WORDS.filter((w) => w.s === id && w.w.toLowerCase().replace(/[^a-z0-9'-]/g, "").startsWith(prefix.toLowerCase()));
  if (!m[nth]) throw new Error(`word ${prefix} not in ${id}`);
  return m[nth].t0;
};

/** 0..1 progress from t0 over dur seconds at time t (seconds), eased. */
export const prog = (t: number, t0: number, dur: number, e = ease) =>
  interpolate(t, [t0, t0 + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Deterministic pseudo-random in [0,1). */
export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Scene windows (seconds). Each scene draws itself from a little before its VO line to a little after.
export const SCENES = {
  open: [0, 13.75],
  gate: [13.45, 17.95],
  problem: [17.55, 25.85],
  scale: [25.55, 35.6],
  system: [35.0, 58.2],
  market: [57.75, 66.0],
  compete: [65.7, 72.75],
  gtm: [72.45, 81.95],
  model: [81.65, 89.45],
  traction: [89.2, 95.15],
  plan: [94.9, 102.65],
  team: [102.4, 112.55],
  ask: [112.3, 117.0],
  close: [116.55, 125],
} as const;
