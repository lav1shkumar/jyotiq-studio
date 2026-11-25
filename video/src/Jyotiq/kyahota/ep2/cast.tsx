import { LOOKS, type Who } from "../../manthan/rig";
import "../../navagraha/ep1/cast";

/*
 * क्या होता अगर… Ep2 cast on the shared Manthan rig. New looks are ADDED to the shared LOOKS table under new keys
 * (no earlier file or look is changed):
 *  - kqShani: Shani as the adult graha. "Nīlāñjana" blue-black skin, dark-blue garments with gold borders, the tall
 *    kirita, a calm heavy lid and a cool blue-white eye glow. Holds a bow (scene prop). Grave, never scary.
 *  - kqVishnu: cloud-dark blue skin (lighter and warmer than Shani), yellow pitambara, tall kirita, kaustubha-red gem
 *    stole, the Sudarshana chakra as a prop.
 *  - kqVikram: King Vikramaditya of Ujjain. Warm skin, curled moustache, a simple tall mukut, a crimson-and-gold stole.
 */

type Look = (typeof LOOKS)[Who];
const add = LOOKS as unknown as Record<string, Look>;

add.kqShani = {
  ...LOOKS.deva,
  skin: "#33427A",
  skinShade: "#243058",
  skinLine: "#121A38",
  rim: "#AFC4FF",
  sclera: "#F2F5FF",
  iris: "#1A2244",
  glowColor: "#BFD0FF",
  lid: 0.34,
  brow: "#0A0D1C",
  browW: 6,
  hair: "royal",
  hairColor: "#0A0D1C",
  hairShade: "#04060E",
  moustache: undefined,
  beard: undefined,
  crown: "kirita",
  tilak: "urdhva",
  thread: true,
  necklaces: 2,
  stole: ["#16204A", "#E8B04A"],
  dhoti: ["#1B2756", "#121B40", "#E8B04A"],
  armlet: true,
  bracelet: "#8C96B4",
  anklet: false,
  earring: "kundala",
  chest: 1.04,
};

add.kqVishnu = {
  ...LOOKS.indra,
  skin: "#5674B8",
  skinShade: "#40599A",
  skinLine: "#22346A",
  rim: "#DDE8FF",
  glowColor: "#FFE08A",
  lid: 0.18,
  moustache: undefined,
  beard: undefined,
  crown: "kirita",
  tilak: "urdhva",
  thread: true,
  necklaces: 3,
  pearls: true,
  stole: ["#F2C14E", "#C8102E"],
  dhoti: ["#F6C431", "#D9A11E", "#C8102E"],
  armlet: true,
  bracelet: "#E8B04A",
  anklet: true,
  earring: "kundala",
  chest: 1.04,
};

add.kqVikram = {
  ...LOOKS.indra,
  skin: "#D9A070",
  skinShade: "#B67E50",
  skinLine: "#744628",
  rim: "#FFE2B8",
  lid: 0.14,
  moustache: "curl",
  beardColor: "#1A1110",
  crown: "deva",
  tilak: "urdhva",
  thread: true,
  necklaces: 3,
  pearls: true,
  stole: ["#A8122A", "#F2C14E"],
  dhoti: ["#F3E2B8", "#D8C08E", "#A8122A"],
  armlet: true,
  bracelet: "#E8B04A",
  anklet: true,
  earring: "kundala",
  chest: 1.06,
};

add.kqVikramBare = { ...add.kqVikram, crown: undefined };

export const KSHANI = "kqShani" as Who;
export const KVISHNU = "kqVishnu" as Who;
export const KVIKRAM = "kqVikram" as Who;
export const KVIKRAM_BARE = "kqVikramBare" as Who;
