import { LOOKS, type Who } from "../../manthan/rig";

/*
 * नवग्रह जन्म Ep1 cast on the shared Manthan rig. Surya is the rig's existing "surya". New looks are ADDED
 * to the shared LOOKS table under new keys (no Manthan file is edited, no existing look is changed):
 *  - nvVishva: Vishvakarma, the old deva-craftsman: white beard and jata (from Durvasa's look) but calm,
 *    with a gold kirita, a cream dhoti and a gold-brown stole.
 *  - nvYama: Yama as a boy (Sanjna's son): dusky blue-grey skin, small deva crown, no moustache.
 *  - nvShani: Shani as a boy (Chhaya's son): deep indigo skin, dark-blue dhoti with a gold border, calm
 *    blue-white eye glow (never scary).
 * The rig has adult proportions only, so the boys are adults drawn at ~0.62 scale: a storyboard stand-in.
 */

type Look = (typeof LOOKS)[Who];
const add = LOOKS as unknown as Record<string, Look>;

add.nvVishva = {
  ...LOOKS.durvasa,
  skin: "#D9A57A",
  skinShade: "#B7845C",
  skinLine: "#7A4E30",
  rim: "#FFE6C4",
  glowColor: "#FFD36B",
  lid: 0.2,
  crown: "kirita",
  tilak: "urdhva",
  necklaces: 2,
  rudraksha: false,
  stole: ["#C98A2E", "#7A4A1C"],
  dhoti: ["#F6EBD6", "#D8C7A6", "#C98A2E"],
  armlet: true,
  bracelet: "#C98A2E",
  earring: "kundala",
};

add.nvYama = {
  ...LOOKS.deva,
  skin: "#6F7FA6",
  skinShade: "#56648A",
  skinLine: "#33405F",
  rim: "#D7E2FF",
  moustache: undefined,
  beard: undefined,
  crown: "deva",
  necklaces: 1,
  stole: ["#3E7D5A", "#F2C14E"],
  dhoti: ["#2F5E46", "#244A37", "#F2C14E"],
  chest: 0.9,
};

add.nvShani = {
  ...LOOKS.deva,
  skin: "#3A4A80",
  skinShade: "#2B3864",
  skinLine: "#18213F",
  rim: "#BFD0FF",
  glowColor: "#BFD0FF",
  moustache: undefined,
  beard: undefined,
  crown: "deva",
  necklaces: 1,
  stole: ["#1E2A55", "#F2C14E"],
  dhoti: ["#1E2A55", "#151E40", "#F2C14E"],
  chest: 0.9,
};

export const VISHVA = "nvVishva" as Who;
export const YAMA = "nvYama" as Who;
export const SHANI = "nvShani" as Who;
