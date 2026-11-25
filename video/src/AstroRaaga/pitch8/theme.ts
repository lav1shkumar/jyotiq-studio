import { loadFont as loadKarla } from "@remotion/google-fonts/Karla";
import { loadFont as loadMarcellus } from "@remotion/google-fonts/Marcellus";
import { Easing, interpolate } from "remotion";
import voV8 from "./vo_v8usd.json";

export const { fontFamily: KARLA } = loadKarla("normal", { weights: ["300", "400", "500", "600", "700"], subsets: ["latin"] });
export const { fontFamily: MARCELLUS } = loadMarcellus("normal", { weights: ["400"], subsets: ["latin"] });
export const SERIF = 'Georgia, "Times New Roman", serif';

export const FPS = 30;
export const W = 1920;
export const H = 1080;

// v4: astroraag.com / jyotiq.ai light palette; accents and hairlines are gold, not light brown (Amit sir, 17 Nov)
export const C = {
  // v7 (Amit sir, 20 Nov): a slightly warmer gold paper
  bg: "#FFF5E2",
  bg2: "#FBEBCB",
  card: "#FFFDF9",
  ink: "#2C1810",
  ink2: "#5B4535",
  ink3: "#8C7660",
  hair: "rgba(184,134,40,0.28)",
  gold: "#C8962E",
  goldDeep: "#A87719",
  goldLight: "#EBC46B",
  goldHair: "rgba(200,150,46,0.5)",
  saffron: "#EA580C",
  saffronDeep: "#C2410C",
  amber: "#F59E0B",
  rust: "#9A3412",
  green: "#059669",
  violet: "#7C3AED",
  teal: "#0E7490",
  rose: "#E11D48",
  sky: "#0284C7",
  black: "#1C150E",
  red: "#B91C1C",
  space: "#06050A",
  // v7 planet colour system (Amit sir): Mercury = money / JyotiQ, Jupiter = wisdom / KarmEQ marketplace,
  // Saturn = discipline / team, Rahu = AI, Ketu = wisdom & spirituality
  mercury: "#16A34A",
  mercuryLight: "#86EFAC",
  jupiter: "#D97706",
  jupiterLight: "#FCD34D",
  saturn: "#3730A3",
  saturnLight: "#A5B4FC",
  rahu: "#6D28D9",
  rahuLight: "#C4B5FD",
  ketu: "#B8913A",
  ketuLight: "#FFF4D6",
};
/** v7: product colours follow the planets (JyotiQ = Mercury green, KarmEQ = Jupiter gold). */
export const JY = C.mercury;
export const KM = C.jupiter;
/** v8 (Amit sir): the proprietary marketing content engine = Earth blue. */
export const CE = "#2F7FC1";

export const GRAD = `linear-gradient(100deg, ${C.saffronDeep} 0%, ${C.saffronDeep} 30%, ${C.amber} 55%, ${C.saffronDeep} 85%)`;
export const GOLD_GRAD = `linear-gradient(100deg, ${C.goldDeep} 0%, ${C.gold} 35%, ${C.goldLight} 60%, ${C.goldDeep} 100%)`;

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeSoft = Easing.bezier(0.45, 0, 0.25, 1);
export const easeIn = Easing.bezier(0.5, 0, 0.75, 0);

// ---------- voice-over data: two versions, chosen by the composition ----------
export type Cur = "v8usd";
type Line = { start: number; end: number; scene: string };
type Word = { w: string; s: string; t0: number; t1: number };
type VO = { lines: Record<string, Line>; scenes: Record<string, { start: number; end: number }>; words: Word[]; total: number };
const DATA: Record<Cur, VO> = { v8usd: voV8 as VO };
/** v5 (18 Nov): Sun instead of the ringed planet; team line without Fiserv / Intuit / Infosys. */
export const isV5 = () => true; // v6 keeps every v5.1 look and motion change
// v5 team line: "building platforms ... a digital transformation expert" replaces the Fiserv / Infosys words
const ALIAS: Record<string, string> = { fiserv: "platforms", infosys: "digital" };
let CUR: Cur = "v8usd";
/** Called by the composition before its children render. */
export const setCur = (c: Cur) => {
  CUR = c;
};
export const cur = () => CUR;
/** v7: the four-layers scene comes in two layouts for Amit sir to pick ("stack" = layers, "grid" = 2x2). */
export type SegLayout = "stack" | "grid";
let SEG: SegLayout = "stack";
export const setSeg = (l: SegLayout) => {
  SEG = l;
};
export const segLayout = () => SEG;
export const vo = () => DATA[CUR];
export const totalFrames = (c: Cur) => Math.ceil(DATA[c].total * FPS);

/** VO line start/end (film seconds), e.g. line("problem_2"). */
export const line = (id: string): Line => {
  const l = vo().lines[id];
  if (!l) throw new Error(`no line ${id}`);
  return l;
};
/** Scene window from the voice: sc("market") -> {start, end}. */
export const sc = (id: string) => {
  const s = vo().scenes[id];
  if (!s) throw new Error(`no scene ${id}`);
  return s;
};
/** Film time of the nth word in line `id` starting with `prefix` (case-insensitive). */
const find = (id: string, prefix: string) => {
  const f = (p: string) => vo().words.filter((w) => w.s === id && w.w.toLowerCase().replace(/[^a-z0-9'-]/g, "").startsWith(p.toLowerCase()));
  const m = f(prefix);
  return m.length || !ALIAS[prefix] ? m : f(ALIAS[prefix]);
};
export const word = (id: string, prefix: string, nth = 0): number => {
  const m = find(id, prefix);
  if (!m[nth]) throw new Error(`word ${prefix} not in ${id}`);
  return m[nth].t0;
};
export const wordEnd = (id: string, prefix: string, nth = 0): number => {
  const m = find(id, prefix);
  if (!m[nth]) throw new Error(`word ${prefix} not in ${id}`);
  return m[nth].t1;
};

/** Money as the version shows it. */
export const money = (_inr: string, usd: string) => usd;

export const prog = (t: number, t0: number, dur: number, e = ease) =>
  interpolate(t, [t0, t0 + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
