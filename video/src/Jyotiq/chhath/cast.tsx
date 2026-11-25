import React from "react";
import { LOOKS, type Who } from "../manthan/rig";
import { LK0, type Palette } from "./devi";

/*
 * छठी मैया की कथा cast. New looks are ADDED to the shared rig LOOKS table under new keys (nothing existing changes).
 *  - chPriyavrat: Swayambhuva Manu's son, emperor of the earth: wheat skin, gold kirita, pearls, royal maroon and gold,
 *    a curled moustache (young king, ~35).
 *  - chKashyap: the Prajapati sage: white jata and beard, calm (no rage glow), saffron cloth, rudraksha, urdhva tilak.
 * Devi palettes (devi.tsx figure):
 *  - MALINI: the queen: deep red sari with a gold border, maroon choli, small queen's crown.
 *  - SHASHTHI: golden-yellow complexion (her dhyana: fair, radiant, in divine garments), Chhath-yellow sari with a
 *    red border, red choli, tall devi crown, lotus halo; a cat (her vahana) sits at her feet.
 */
type Look = (typeof LOOKS)[Who];
const add = LOOKS as unknown as Record<string, Look>;

add.chPriyavrat = {
  ...LOOKS.indra,
  skin: "#DDA574",
  skinShade: "#BA8253",
  skinLine: "#7E4E2C",
  rim: "#FFE0B0",
  glowColor: "#FFD36B",
  lid: 0.16,
  crown: "kirita",
  tilak: "urdhva",
  necklaces: 3,
  pearls: true,
  stole: ["#7A1630", "#F2C14E"],
  dhoti: ["#9E1E3A", "#741428", "#F2C14E"],
  armlet: true,
  bracelet: "#E8B24A",
  anklet: true,
  earring: "kundala",
  chest: 1.04,
};

add.chKashyap = {
  ...LOOKS.durvasa,
  skin: "#C98F66",
  skinShade: "#A8714B",
  skinLine: "#6A4128",
  rim: "#FFE2C0",
  glowColor: "#FFD36B",
  lid: 0.3,
  brow: "#F4F0E8",
  hairColor: "#ECE7DD",
  hairShade: "#BDB4A4",
  beardColor: "#F6F2EA",
  tilak: "urdhva",
  rudraksha: true,
  stole: ["#E59A3A", "#9A4E14"],
  dhoti: ["#F2B04A", "#CF8A2E", "#8E4A16"],
  earring: "rudraksha",
  chest: 0.94,
};

export const PRIYAVRAT = "chPriyavrat" as Who;
export const KASHYAP = "chKashyap" as Who;

export const MALINI: Palette = {
  ...LK0,
  skin: "#E7B488", skinShade: "#C68C5C", skinLine: "#87522E", rim: "#FFE6C4",
  sari: "#B5162E", sariShade: "#7E0E20", sariHi: "#E04A5E", choli: "#6E0F22",
  lip: "#A8243E", border: "#F2C14E",
};

export const SHASHTHI: Palette = {
  ...LK0,
  skin: "#F2C766", skinShade: "#D6A443", skinLine: "#94661E", rim: "#FFF3C4",
  sari: "#F6B70E", sariShade: "#D08A06", sariHi: "#FFE07A", choli: "#C8102E",
  lip: "#C0283E", hair: "#1A0E08", border: "#C8102E",
};

/**
 * The newborn, swaddled. Origin = centre of the bundle; ~ 150 x 90 at s = 1, head to the right.
 * life 0 = still (grey, eyes shut, no breath) .. 1 = alive (warm, rosy); cry 0..1 opens the mouth and scrunches the face.
 */
export const Baby: React.FC<{ s?: number; life?: number; cry?: number; f: number; rot?: number; glow?: number }> = ({ s = 1, life = 1, cry = 0, f, rot = 0, glow = 0 }) => {
  const mixc = (a: string, b: string, u: number) => {
    const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
    const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
    return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * u)).join(",")})`;
  };
  const skin = mixc("#B8ADA6", "#F2C0A0", life);
  const shade = mixc("#968A84", "#D99878", life);
  const breath = life > 0.5 ? Math.sin(f / 9) * 1.5 * life : 0;
  const kick = cry > 0.1 ? Math.sin(f / 2.3) * 3 * cry : 0;
  return (
    <g transform={`rotate(${rot}) scale(${s})`}>
      {glow > 0.01 ? <ellipse rx={120} ry={80} fill="#FFE9A6" opacity={0.55 * glow} filter="url(#mBlur8)" /> : null}
      {/* swaddle: cream cloth with a gold-red border, folds */}
      <g transform={`scale(1 ${1 + breath / 60})`}>
        <path d="M-78 4C-80 -30 -50 -46 -6 -44C30 -42 52 -30 56 -8C58 18 34 40 -10 42C-54 44 -76 30 -78 4Z" fill="#F8EEDB" stroke="#C9B48E" strokeWidth={2.5} />
        <path d="M-70 18C-40 4 0 2 44 14" stroke="#D9C49E" strokeWidth={3} fill="none" />
        <path d="M-64 -24C-30 -12 10 -16 46 -30" stroke="#D9C49E" strokeWidth={3} fill="none" />
        <path d="M30 -40C40 -14 42 14 30 38" stroke="#C8102E" strokeWidth={5} fill="none" />
        <path d="M24 -40C34 -14 36 14 24 38" stroke="#E8B24A" strokeWidth={3} fill="none" />
      </g>
      {/* head with a soft cap */}
      <g transform={`translate(${66 + kick * 0.3} -2)`}>
        <circle r={36} fill={skin} stroke={mixc("#7E726C", "#B0704E", life)} strokeWidth={2} />
        <path d="M-34 -6C-36 -30 -16 -42 6 -40C24 -38 36 -26 36 -10C20 -22 -10 -22 -34 -6Z" fill="#F8EEDB" stroke="#C9B48E" strokeWidth={2} />
        <ellipse cx={-14} cy={10} rx={6} ry={4} fill="#E58A7A" opacity={0.45 * life} />
        <ellipse cx={18} cy={10} rx={6} ry={4} fill="#E58A7A" opacity={0.45 * life} />
        {/* eyes: shut curves; squeezed when crying */}
        <path d={`M-16 ${2 - 2 * cry}Q-9 ${7 - 4 * cry} -2 ${2 - 2 * cry}`} stroke="#3A2418" strokeWidth={2.4} fill="none" strokeLinecap="round" />
        <path d={`M8 ${2 - 2 * cry}Q15 ${7 - 4 * cry} 22 ${2 - 2 * cry}`} stroke="#3A2418" strokeWidth={2.4} fill="none" strokeLinecap="round" />
        {cry > 0.1 ? (
          <path d="M-14 -6L-4 -2M20 -6L10 -2" stroke="#3A2418" strokeWidth={1.8} strokeLinecap="round" opacity={cry} />
        ) : null}
        <path d="M2 8Q4 12 6 9" stroke={shade} strokeWidth={2} fill="none" />
        {/* mouth: a small line, or an open crying mouth */}
        {cry > 0.1 ? (
          <ellipse cx={3} cy={22} rx={6 + 3 * cry} ry={4 + 7 * cry * (0.75 + 0.25 * Math.abs(Math.sin(f / 3)))} fill="#7A2A2A" />
        ) : (
          <path d="M-2 21Q3 23 8 21" stroke={mixc("#6E625C", "#B85A4A", life)} strokeWidth={2} fill="none" strokeLinecap="round" />
        )}
        {/* a tiny fist by the cheek when alive */}
        {life > 0.5 ? <circle cx={-30 + kick} cy={24} r={9} fill={skin} stroke="#B0704E" strokeWidth={1.5} opacity={life} /> : null}
      </g>
    </g>
  );
};

/** Shashthi's vahana: a seated cat (warm white with ginger patches, gold collar). Origin = between its front paws. */
export const Cat: React.FC<{ s?: number; f: number; facing?: number }> = ({ s = 1, f, facing = 1 }) => {
  const tail = Math.sin(f / 14) * 10;
  const blink = f % 140 < 5 ? 0.15 : 1;
  return (
    <g transform={`scale(${s * facing} ${s})`}>
      <path d={`M40 -20C80 -20 ${96 + tail} -60 ${82 + tail} -96`} stroke="#F3E6D6" strokeWidth={18} fill="none" strokeLinecap="round" />
      <path d={`M${88 + tail} -76C${92 + tail} -86 ${86 + tail} -96 ${82 + tail} -96`} stroke="#E08A3A" strokeWidth={18} fill="none" strokeLinecap="round" />
      <path d="M-46 0C-56 -60 -40 -118 0 -124C40 -118 56 -60 46 0Z" fill="#F7EEE2" stroke="#BFAE9A" strokeWidth={2.5} />
      <path d="M10 -110C30 -100 44 -70 44 -30C34 -50 22 -80 10 -110Z" fill="#E59A4E" opacity={0.85} />
      <ellipse cx={-20} cy={-4} rx={16} ry={9} fill="#FFF7EE" stroke="#BFAE9A" strokeWidth={2} />
      <ellipse cx={20} cy={-4} rx={16} ry={9} fill="#FFF7EE" stroke="#BFAE9A" strokeWidth={2} />
      <g transform="translate(0 -150)">
        <path d="M-40 -16L-46 -62L-14 -36Z" fill="#F7EEE2" stroke="#BFAE9A" strokeWidth={2} />
        <path d="M40 -16L46 -62L14 -36Z" fill="#E59A4E" stroke="#BFAE9A" strokeWidth={2} />
        <path d="M-38 -24L-42 -50L-22 -34Z" fill="#F4B6B0" />
        <ellipse rx={46} ry={40} fill="#F7EEE2" stroke="#BFAE9A" strokeWidth={2.5} />
        <path d="M14 -38C30 -34 42 -20 44 -4C30 -14 20 -24 14 -38Z" fill="#E59A4E" opacity={0.85} />
        {[-16, 16].map((x) => (
          <g key={x} transform={`translate(${x} -4) scale(1 ${blink})`}>
            <ellipse rx={8} ry={9} fill="#7FBF4A" />
            <ellipse rx={2.6} ry={7} fill="#1A1A10" />
            <circle cx={2} cy={-3} r={1.6} fill="#FFFFFF" />
          </g>
        ))}
        <path d="M-5 10L5 10L0 16Z" fill="#E88A8A" />
        <path d="M0 16Q-6 24 -12 20M0 16Q6 24 12 20" stroke="#8A6A5A" strokeWidth={1.8} fill="none" />
        <path d="M-14 14L-44 8M-14 18L-42 20M14 14L44 8M14 18L42 20" stroke="#BFAE9A" strokeWidth={1.4} />
      </g>
      <path d="M-30 -112Q0 -98 30 -112" stroke="#E8B24A" strokeWidth={6} fill="none" />
      <circle cx={0} cy={-102} r={6} fill="#E8B24A" stroke="#A8701E" strokeWidth={1.2} />
    </g>
  );
};
