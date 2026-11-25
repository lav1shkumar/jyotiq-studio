import { Easing, interpolate, random } from "remotion";

/* Jyotiq "Shooter Gaadi" Reel: one clock for every scene.
   Song = public/jyotiq/shooter/song-clip.wav (the 14.72 s of real audio cut
   from Ayush's MP3, which opens with 44.37 s of digital silence).
   Lyric + kick times were measured locally (whisper large-v3-turbo + an
   onset scan) and are expressed here in REEL frames at 30 fps. */

export const FPS = 30;
export const W = 1080;
export const H = 1920;

/** Song starts after a 2.40 s SFX-only cold open. */
export const SONG_AT = 72;
const s = (sec: number) => SONG_AT + Math.round(sec * FPS);

/** Lyric line starts (reel frames). */
export const LYR = {
  jod: s(0.0), // "Jod saange panarya karda"
  minute: s(2.84), // "Minute mein kacche dhaage karda"  -> Shani
  jigra: s(5.33), // "Jigra body mein"
  shooter: s(7.5), // "Shooter gaadi mein"              -> convoy
  noton: s(9.54), // "Noton mein rabad na dekhya"
  khaate: s(11.87), // "Maare khule khaate hain"
  end: s(14.72),
};

/** 808 / kick hits (reel frames). */
export const KICKS = [0, 0.53, 0.98, 1.7, 2.15, 2.86, 3.31, 4.03, 4.47, 5.64, 6.06, 6.8, 7.23, 7.97, 8.39, 9.56, 10.3, 10.72, 11.46, 11.89, 14.07, 14.5].map(s);

/** Scene boundaries (reel frames). */
export const SC = {
  phone: 0, // POV: thumb opens Jyotiq
  face: 40, // kid types in a panic
  read: SONG_AT, // Jyotiq reads the kundli
  react: 88, // reaction montage + answer card
  shani: LYR.minute, // 157
  wheelie: LYR.jigra, // 232
  kundli: LYR.shooter, // 297
  carA: 318, // Surya + Chandra
  carC: LYR.noton, // 358  Guru + Shukra (cash)
  carB: 393, // Mangal + Budh (stunt)
  carD: LYR.khaate, // 428  Rahu + Ketu
  squad: 470,
  end: LYR.end + 2, // 516
};
export const TOTAL = SC.end;

/* ------------------------------------------------------------------ */
/* Motion helpers                                                      */
/* ------------------------------------------------------------------ */

const EASE = {
  io: Easing.inOut(Easing.cubic),
  out: Easing.out(Easing.cubic),
  in: Easing.in(Easing.cubic),
  back: Easing.out(Easing.back(1.8)),
  lin: (t: number) => t,
} as const;
export type Ease = keyof typeof EASE;

/** 0 -> 1 between frames a and b (clamped). */
export const ramp = (f: number, a: number, b: number, e: Ease = "out"): number =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE[e] });

/** Keyframes [frame, value, ease-in-to-this-key]. */
export type Key = [number, number, Ease?];
export const track = (f: number, keys: Key[]): number => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [fb, vb, e] = keys[i];
    if (f < fb) {
      const [fa, va] = keys[i - 1];
      return va + (vb - va) * EASE[e ?? "io"]((f - fa) / (fb - fa));
    }
  }
  return keys[keys.length - 1][1];
};

export const rnd = (k: string | number): number => random(`shooter-${k}`);

/** Smooth deterministic noise, -1..1. */
export const wob = (seed: string, t: number): number => {
  const i = Math.floor(t);
  const fr = t - i;
  const sm = fr * fr * (3 - 2 * fr);
  const a = rnd(`${seed}:${i}`) * 2 - 1;
  const b = rnd(`${seed}:${i + 1}`) * 2 - 1;
  return a + (b - a) * sm;
};

/** Decaying punch (1 at the hit, 0 after `dur` frames). */
export const hit = (f: number, at: number, dur = 8): number => {
  const t = (f - at) / dur;
  return t < 0 || t > 1 ? 0 : Math.pow(1 - t, 2);
};

/** Sum of punches from every kick inside [from, to). */
export const kickPulse = (f: number, from = 0, to = 1e9, dur = 8): number =>
  KICKS.filter((k) => k >= from && k < to).reduce((a, k) => a + hit(f, k, dur), 0);

/** Camera shake offset in px for a punch envelope. */
export const shake = (f: number, amt: number, seed = "sh"): { x: number; y: number; r: number } => ({
  x: wob(`${seed}x`, f * 0.9) * 22 * amt,
  y: wob(`${seed}y`, f * 0.9 + 9) * 22 * amt,
  r: wob(`${seed}r`, f * 0.7 + 3) * 1.6 * amt,
});

/** Back-out pop 0 -> 1 over `dur` frames from `at`. */
export const pop = (f: number, at: number, dur = 9): number => ramp(f, at, at + dur, "back");
