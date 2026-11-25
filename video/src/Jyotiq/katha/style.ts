import { Easing, interpolate, random } from "remotion";

/* "Katha" look: flat Indian-miniature illustration with cut-out puppet
   characters (rigid paper parts turning on pins). Everything is plain SVG
   shapes, so every frame is a pure function of the frame number. */

export { CORMORANT, DEVA } from "../bbreel/fonts";

export const W = 1080;
export const H = 1920;
/** Width of the painted border band around the picture. */
export const BAND = 50;

/** Warm Rajasthani daylight palette. Jyotiq's own border/tab colours, not a copy of any channel's. */
export const C = {
  sky: "#6BA7D8",
  skyLow: "#AFD3EC",
  cloud: "#FBFAF4",
  cloudShade: "#DCE9F3",
  wall: "#B3502D",
  wallUp: "#BF5B34",
  wallSide: "#9C4425",
  wallLine: "#7E3519",
  cornice: "#CB6A3F",
  cream: "#F3E6CB",
  creamShade: "#D9C49C",
  rib: "#BFA175",
  outline: "#6B3F24",
  gold: "#DCA43E",
  goldDark: "#A9741F",
  goldLight: "#F6D78A",
  orange: "#D9773A",
  maroon: "#6A1E24",
  band: "#5C181D",
  sand: "#D88A4F",
  sandLight: "#E7A46B",
  sandDark: "#C27541",
  ink: "#2A170E",
  marigold: "#F08A1C",
  marigoldY: "#F7C532",
  leaf: "#3F8C41",
  red: "#C0392B",
  green: "#2E8B57",
  paper: "#F7EBD2",
  paperEdge: "#B8862B",
  text: "#3A1D12",
};

const E = {
  io: Easing.inOut(Easing.cubic),
  out: Easing.out(Easing.cubic),
  back: Easing.out(Easing.back(1.7)),
  in: Easing.in(Easing.cubic),
  lin: (t: number) => t,
} as const;
export type Ease = keyof typeof E;
/** [frame, value, easing used to ARRIVE at this key]. */
export type Key = [number, number, Ease?];

/** Keyframed value, clamped before the first and after the last key. */
export const track = (f: number, keys: Key[]): number => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [fb, vb, e] = keys[i];
    if (f < fb) {
      const [fa, va] = keys[i - 1];
      return va + (vb - va) * E[e ?? "io"]((f - fa) / (fb - fa));
    }
  }
  return keys[keys.length - 1][1];
};

/** 0 -> 1 between frames a and b, clamped. */
export const ramp = (f: number, a: number, b: number, e: Ease = "out"): number =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: E[e] });

export const rnd = (s: string | number): number => random(`katha-${s}`);

/** Smooth deterministic noise in -1..1. */
export const wob = (seed: string, t: number): number => {
  const i = Math.floor(t);
  const fr = t - i;
  const s = fr * fr * (3 - 2 * fr);
  const a = rnd(`${seed}:${i}`) * 2 - 1;
  const b = rnd(`${seed}:${i + 1}`) * 2 - 1;
  return a + (b - a) * s;
};

/** 4-point sparkle centred on 0,0. */
export const sparkle = (r: number): string =>
  `M0 ${-r}C${r * 0.12} ${-r * 0.24} ${r * 0.24} ${-r * 0.12} ${r} 0C${r * 0.24} ${r * 0.12} ${r * 0.12} ${r * 0.24} 0 ${r}C${-r * 0.12} ${r * 0.24} ${-r * 0.24} ${r * 0.12} ${-r} 0C${-r * 0.24} ${-r * 0.12} ${-r * 0.12} ${-r * 0.24} 0 ${-r}Z`;
