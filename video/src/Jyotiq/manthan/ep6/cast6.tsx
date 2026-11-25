import React from "react";
import { LOOKS, Who } from "../rig";
import { P } from "../style";

/*
 * Episode 6 cast additions on the SAME cut-out rig as every Manthan character (registered at runtime,
 * as Episodes 4-5 did; no Episode 1-5 file is edited):
 *  - SURYA and CHANDRA: the two devas who sit on either side of the impostor (they expose him in Episode 7)
 *  - SVARDEVA: Swarbhanu (the series' own asura, later Rahu) disguised as a deva: warm skin, a deva crown
 *    and a fake tilak, but he keeps his slit gold eyes and goatee, the tell a sharp viewer can catch.
 * ImpostorSmoke: dark violet smoke curling at his feet while he sits in the devas' row.
 */
type Look = (typeof LOOKS)[keyof typeof LOOKS];

const SURYA_LOOK: Look = {
  skin: "#F0B46A", skinShade: "#CC8C47", skinLine: "#8A5426", rim: "#FFE7B8",
  sclera: "#FFF8EC", iris: "#5A2E10", glowColor: "#FFB43D", lid: 0.12,
  brow: "#2A160C", browW: 5,
  hair: "royal", hairColor: "#3A1E10", hairShade: "#1E0E06",
  moustache: "curl", beardColor: "#3A1E10",
  crown: "surya", tilak: "dot",
  thread: true, necklaces: 3,
  stole: ["#E8892A", "#F2C14E"],
  dhoti: ["#C8341E", "#9A2412", "#F2C14E"],
  armlet: true, bracelet: P.gold, anklet: true, earring: "kundala", chest: 1.02,
};
const CHANDRA_LOOK: Look = {
  skin: "#DCE3F4", skinShade: "#B4BEDA", skinLine: "#6A7398", rim: "#FFFFFF",
  sclera: "#FFFFFF", iris: "#2A3150", glowColor: "#CFE6FF", lid: 0.18,
  brow: "#1A1E30", browW: 4,
  hair: "royal", hairColor: "#141828", hairShade: "#0A0C16",
  moustache: "thin", beardColor: "#141828",
  crown: "chandra", tilak: "dot",
  thread: true, necklaces: 2, pearls: true,
  stole: ["#E8EEF8", "#B8C6E0"],
  dhoti: ["#F4F6FB", "#CBD3E6", "#9FB3D9"],
  armlet: true, bracelet: "#C9D3E6", anklet: true, earring: "kundala", chest: 0.98,
};
const SVARDEVA_LOOK: Look = {
  skin: "#C9A07C", skinShade: "#A57C5A", skinLine: "#5E4030", rim: "#E8D2C0",
  sclera: "#FFF4E6", iris: "#FFC23D", slit: true, glowColor: "#FFC23D", lid: 0.3,
  brow: "#0E0A14", browW: 6,
  hair: "royal", hairColor: "#120D18", hairShade: "#070509",
  beard: "goatee", moustache: "thin", beardColor: "#120D18",
  crown: "deva", tilak: "urdhva",
  thread: true, necklaces: 2,
  stole: ["#B3262E", "#F2C14E"],
  dhoti: ["#2E4A9A", "#1E3270", "#F2C14E"],
  armlet: true, bracelet: P.gold, anklet: true, earring: "kundala", chest: 1,
};
(LOOKS as unknown as Record<string, Look>).surya6 = SURYA_LOOK;
(LOOKS as unknown as Record<string, Look>).chandra6 = CHANDRA_LOOK;
(LOOKS as unknown as Record<string, Look>).svardeva6 = SVARDEVA_LOOK;
export const SURYA = "surya6" as unknown as Who;
export const CHANDRA = "chandra6" as unknown as Who;
export const SVARDEVA = "svardeva6" as unknown as Who;

/** Dark violet smoke curling up from the impostor's feet. Origin = his feet; amount 0..1. */
export const ImpostorSmoke: React.FC<{ f: number; amount?: number; w?: number }> = ({ f, amount = 1, w = 120 }) => {
  if (amount <= 0.01) return null;
  return (
    <g opacity={amount}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const u = ((f / 45 + i / 6) % 1 + 1) % 1;
        const x = (i % 2 ? 1 : -1) * (w * 0.25 + i * 8) + Math.sin(f / 11 + i) * 14;
        return (
          <ellipse key={i} cx={x * (1 - u * 0.4)} cy={-u * 160} rx={34 * (1 - u * 0.5)} ry={22 * (1 - u * 0.5)} fill="#2A1B44" opacity={0.55 * (1 - u)} filter="url(#mBlur8)" />
        );
      })}
      {[0, 1, 2].map((i) => {
        const u = ((f / 60 + i / 3) % 1 + 1) % 1;
        const x0 = (i - 1) * w * 0.35;
        return (
          <path key={i} d={`M${x0} 0C${x0 + 30} ${-40 - u * 30} ${x0 - 30} ${-80 - u * 40} ${x0 + 10} ${-120 - u * 60}`} stroke="#4A3470" strokeWidth={5} fill="none" opacity={0.6 * (1 - u)} strokeLinecap="round" />
        );
      })}
    </g>
  );
};
