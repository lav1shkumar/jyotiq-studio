/* "Manthan" series look: Indian-mythology flat vector, cut-out puppets
   (rigid parts on pins), warm gold key light + rim light, embers and glow.
   Shares the katha keyframe helpers so timing code reads the same. */

export { track, ramp, wob, rnd } from "../katha/style";
export type { Key, Ease } from "../katha/style";
export { ANIME, CORMORANT, DEVA } from "../bbreel/fonts";

export const W = 1080;
export const H = 1920;

export const P = {
  // metals
  gold: "#E8B24A",
  goldLight: "#FFE6A3",
  goldDark: "#A8701E",
  goldDeep: "#6B410F",
  // fire / light
  ember: "#FF8A2A",
  flame: "#FFC94D",
  amrit: "#FFE9A6",
  // cloth
  ivory: "#F6EBD6",
  ivoryShade: "#D8C7A6",
  crimson: "#B3262E",
  maroon: "#5E1219",
  saffron: "#E07A1F",
  ochre: "#B8641F",
  royalBlue: "#23439B",
  royalBlueShade: "#172E6C",
  violet: "#4B2E78",
  violetDeep: "#24163F",
  // world
  ink: "#170D12",
  night: "#0E0A1C",
  milk: "#F4F1EA",
  // Jyotiq brand (Brand Bible section 6)
  jGold: "#DFB15B",
  jGoldLight: "#F3DB9D",
  jAmber: "#F99C00",
  jNight: "#0C0A07",
  jMagenta: "#E05088",
  jCyan: "#40D8E8",
  jViolet: "#9888D8",
};

/** Mix two #RRGGBB colours (t = 0 -> a, 1 -> b). */
export const mix = (a: string, b: string, t: number): string => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => {
    const x = (pa >> s) & 255;
    const y = (pb >> s) & 255;
    return Math.round(x + (y - x) * Math.max(0, Math.min(1, t)))
      .toString(16)
      .padStart(2, "0");
  };
  return `#${ch(16)}${ch(8)}${ch(0)}`;
};
