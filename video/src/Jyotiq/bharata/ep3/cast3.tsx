import "../ep1/cast";
import "../ep2/cast2";
import "../../navagraha/ep2/cast2";
import { LOOKS, type Who } from "../../manthan/rig";
import { LK0, type Palette } from "../ep1/ganga";

/*
 * भारत Ep3 cast (adds new rig LOOKS keys; earlier episodes' files are imported read-only).
 *  - bhShalva: king of Saubha, about 35: Shantanu's build, a kirita, a cold violet-and-silver stole, a darker dhoti.
 *  - bhShikhandi: Amba reborn as Drupada's child, a young warrior: no crown, a crimson-and-black stole, red war glow.
 * AMBA (Devi figure, crown "queen"): the eldest Kashi princess, a crimson sari with a gold border.
 * AMBIKA / AMBALIKA: her sisters, in saffron and in rose, for the swayamvara shot only.
 */
type Look = (typeof LOOKS)[Who];
const L = LOOKS as unknown as Record<string, Look>;

L.bhShalva = {
  ...L.bhShantanu,
  skin: "#D9A274",
  skinShade: "#B67E52",
  skinLine: "#74462A",
  rim: "#E6E0FF",
  glowColor: "#B9A8FF",
  brow: "#120C0A",
  crown: "kirita",
  stole: ["#4A2A6A", "#C9CDD8"],
  dhoti: ["#2E2A44", "#1E1A30", "#C9CDD8"],
};

L.bhShikhandi = {
  ...L.bhDevavrata,
  skin: "#D29A6C",
  skinShade: "#AE764A",
  rim: "#FFB89A",
  glowColor: "#FF6A4A",
  crown: undefined,
  necklaces: 1,
  pearls: false,
  stole: ["#7A1420", "#1A1018"],
  dhoti: ["#2A1A20", "#1A1014", "#B8862E"],
};

export const SHALVA = "bhShalva" as Who;
export const SHIKHANDI = "bhShikhandi" as Who;

export const AMBA: Palette = {
  ...LK0,
  skin: "#E6B48C",
  skinShade: "#C8906A",
  skinLine: "#7A4A30",
  rim: "#FFE2C8",
  sari: "#B3182E",
  sariShade: "#82101F",
  sariHi: "#E04A5A",
  choli: "#E8A32E",
  lip: "#A8203A",
  hair: "#120C0A",
  border: "#F2C14E",
};
export const AMBIKA: Palette = { ...AMBA, sari: "#E07A1A", sariShade: "#B05A10", sariHi: "#F6A24A", choli: "#B3182E" };
export const AMBALIKA: Palette = { ...AMBA, sari: "#D04A7A", sariShade: "#A0305A", sariHi: "#F07AA0", choli: "#2C6E9A" };
