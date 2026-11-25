import { LOOKS, type Who } from "../../manthan/rig";
import "../ep1/cast";

/*
 * नवग्रह जन्म Ep2 cast. Ep1's looks (Surya = rig "surya", nvShani, Chhaya = Sanjna through the violet filter)
 * are reused read-only. One new look is ADDED to the shared LOOKS table under a new key (nothing is changed):
 *  - nvShiva: "karpūra-gauram", camphor-white (ash-pale with a cool tint), jata with the rig's own crescent (no crown),
 *    tripundra, rudraksha, naga earrings, a tiger-ochre dhoti. Calm, never fierce.
 */

type Look = (typeof LOOKS)[Who];
const add = LOOKS as unknown as Record<string, Look>;

add.nvShiva = {
  ...LOOKS.durvasa,
  skin: "#C9D3E2",
  skinShade: "#A3B0C6",
  skinLine: "#5E6C86",
  rim: "#EEF3FF",
  glowColor: "#BFD8FF",
  lid: 0.42,
  brow: "#1A1A24",
  browW: 5,
  hair: "jata",
  hairColor: "#2A2230",
  hairShade: "#140F18",
  beard: undefined,
  moustache: undefined,
  tilak: "tripundra",
  thread: false,
  necklaces: 0,
  rudraksha: true,
  stole: ["#C98A3A", "#5A3A1C"],
  dhoti: ["#D9963F", "#B07228", "#3A2414"],
  armlet: true,
  bracelet: "#6B4A2E",
  anklet: false,
  earring: "naga",
  chest: 1.04,
};

export const SHIVA = "nvShiva" as Who;
