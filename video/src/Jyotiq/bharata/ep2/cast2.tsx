import React from "react";
import "../ep1/cast";
import { LOOKS, type Who } from "../../manthan/rig";
import { P } from "../../manthan/style";
import { LK0, type Palette } from "../ep1/ganga";

/*
 * भारत Ep2 cast (adds new rig LOOKS keys; Episode 1's files are imported read-only).
 *  - bhDasharaj: chief of the fishermen, Satyavati's father, about 58: dark sun-browned skin, grey wild hair and a grey
 *    beard, rudraksha and a shell-and-copper look (no crown), earth-brown dhoti with a river-blue border, copper kada.
 *  - bhDevavrataBare: Devavrata after he gives up the throne: the same prince with no crown.
 * SATYAVATI (Ep1 Devi figure, crown "none" = the bun with a jasmine gajra): dusky skin (the text calls her dark), a
 * river-blue sari with a gold border, a rust choli.
 */
type Look = (typeof LOOKS)[Who];
const add = LOOKS as unknown as Record<string, Look>;

add.bhDasharaj = {
  ...LOOKS.durvasa,
  skin: "#8E5A3A",
  skinShade: "#6E4228",
  skinLine: "#3E2414",
  rim: "#FFC89A",
  glowColor: "#FFB04A",
  lid: 0.32,
  brow: "#C8C2B8",
  browW: 7,
  hair: "wild",
  hairColor: "#9A948A",
  hairShade: "#6A645C",
  beard: "sage",
  moustache: "sage",
  beardColor: "#D6D0C6",
  crown: undefined,
  tilak: "dot",
  thread: false,
  necklaces: 1,
  rudraksha: true,
  stole: ["#6A4A2A", "#3A7A8A"],
  dhoti: ["#8A6A44", "#6A4E30", "#3A7A8A"],
  armlet: false,
  bracelet: "#B87333",
  anklet: true,
  earring: "rudraksha",
  chest: 1.1,
};

add.bhDevavrataBare = { ...(LOOKS as unknown as Record<string, Look>).bhDevavrata, crown: undefined };

export const DASHARAJ = "bhDasharaj" as Who;
export const DEVAVRATA_BARE = "bhDevavrataBare" as Who;

export const SATYAVATI: Palette = {
  ...LK0,
  skin: "#B87A52",
  skinShade: "#966040",
  skinLine: "#5E3A22",
  rim: "#FFD9B0",
  sari: "#2C6E9A",
  sariShade: "#1C4E72",
  sariHi: "#5E9EC8",
  choli: "#B4462A",
  lip: "#A8304A",
  hair: "#120C0A",
  border: "#E8B24A",
};

/** A wooden river boat with a raised prow. Origin = waterline centre; s scales. */
export const Boat: React.FC<{ f: number; s?: number; oar?: number }> = ({ f, s = 1, oar = 0 }) => {
  const rock = Math.sin(f / 16) * 2;
  return (
    <g transform={`scale(${s}) rotate(${rock})`}>
      <path d="M-260 -40C-200 30 200 30 260 -40L300 -110L270 -100L240 -50C120 -20 -120 -20 -240 -50L-270 -100L-300 -110Z" fill="#7A4A26" stroke="#3E220E" strokeWidth={4} />
      <path d="M-240 -50C-120 -20 120 -20 240 -50" stroke="#B07A44" strokeWidth={6} fill="none" />
      {[-160, -60, 40, 140].map((x) => <path key={x} d={`M${x} -30L${x + 4} 10`} stroke="#4E2C12" strokeWidth={4} />)}
      <circle cx={-280} cy={-104} r={8} fill="url(#mGold)" />
      <g transform={`translate(120 -40) rotate(${-30 + 18 * Math.sin(oar)})`}>
        <path d="M0 0L0 160" stroke="#5A3418" strokeWidth={7} />
        <path d="M-12 150L12 150L8 210L-8 210Z" fill="#6A4020" />
      </g>
    </g>
  );
};

/** The crown laid on the ground (Devavrata gives up the throne). Origin = its base. */
export const CrownProp: React.FC<{ s?: number; glow?: number }> = ({ s = 1, glow = 0 }) => (
  <g transform={`scale(${s})`}>
    {glow > 0.01 ? <ellipse cy={-40} rx={120} ry={70} fill="#FFE7A0" opacity={0.5 * glow} filter="url(#mBlur8)" /> : null}
    <ellipse cy={0} rx={70} ry={12} fill="#000000" opacity={0.25} />
    <path d="M-50 0L-56 -60L-30 -40L-18 -100L0 -60L18 -100L30 -40L56 -60L50 0Z" fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={2.5} />
    <path d="M-52 -8Q0 -22 52 -8" stroke={P.goldDeep} strokeWidth={4} fill="none" />
    <circle cx={0} cy={-36} r={9} fill="#2F64C4" stroke={P.goldDeep} strokeWidth={1.5} />
    {[-30, 30].map((x) => <circle key={x} cx={x} cy={-22} r={5} fill="#C8202E" />)}
  </g>
);
