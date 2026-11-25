import React from "react";
import "../../chhath/cast";
import { LOOKS, type Who } from "../../manthan/rig";
import { P } from "../../manthan/style";
import { LK0, type Palette } from "./ganga";

/*
 * भारत (Mahabharata) Ep1 cast. New looks are ADDED to the shared rig LOOKS table under new keys (nothing existing changes).
 * Ornament brief (the Kuru court, as an Indian epic is drawn): tall gold kirita mukut, kundala earrings, layered pearl and
 * gold haar, bajuband armlets, kada bracelets, a jewelled kamarbandh, anklets; a tilak; an angavastram over one shoulder.
 *  - bhShantanu: the Kuru emperor of Hastinapur, about 45: wheat skin, curled moustache and a short dark beard, saffron-gold
 *    dhoti with a deep blue angavastram (the Kuru blue), three haars with pearls.
 *  - bhDevavrata: Ganga's son, a young warrior prince (about 18): no beard, lighter crown, white and gold dhoti with a
 *    crimson stole, bow in hand and a quiver on the back.
 *  - bhBhishma: the same man old (flash-forward silhouette): white beard and hair, white dhoti, the Kuru blue stole.
 * GANGA (ganga.tsx figure): fair luminous skin, white-silver sari with a gold border, teal choli, the "ganga" crown with a
 * crescent and pearls, pearl malas and an aquamarine pendant; she stands on her makara.
 */
type Look = (typeof LOOKS)[Who];
const add = LOOKS as unknown as Record<string, Look>;

add.bhShantanu = {
  ...LOOKS.indra,
  skin: "#DCA374",
  skinShade: "#B98052",
  skinLine: "#7A4A2A",
  rim: "#FFE2B4",
  glowColor: "#FFD36B",
  lid: 0.2,
  brow: "#1A110C",
  browW: 6,
  moustache: "curl",
  beard: "goatee",
  beardColor: "#1E140E",
  crown: "kirita",
  tilak: "urdhva",
  necklaces: 3,
  pearls: true,
  stole: ["#1F3E8A", "#F2C14E"],
  dhoti: ["#E8A32E", "#C07F1E", "#7A1E2E"],
  armlet: true,
  bracelet: "#E8B24A",
  anklet: true,
  earring: "kundala",
  chest: 1.06,
};

add.bhDevavrata = {
  ...LOOKS.indra,
  skin: "#E2AC7C",
  skinShade: "#C08656",
  skinLine: "#82502E",
  rim: "#FFE6BC",
  glowColor: "#9FE8FF",
  lid: 0.08,
  brow: "#1A110C",
  browW: 5,
  moustache: undefined,
  beard: undefined,
  crown: "deva",
  tilak: "urdhva",
  necklaces: 2,
  pearls: true,
  stole: ["#B3262E", "#F2C14E"],
  dhoti: ["#F4EEDF", "#D8CDB2", "#D9A23A"],
  armlet: true,
  bracelet: "#E8B24A",
  anklet: true,
  earring: "kundala",
  chest: 1.02,
};

add.bhBhishma = {
  ...LOOKS.indra,
  skin: "#C99470",
  skinShade: "#A57452",
  skinLine: "#6A4128",
  rim: "#FFE2C0",
  lid: 0.3,
  brow: "#F2EEE6",
  browW: 7,
  hairColor: "#EEEAE2",
  hairShade: "#BDB6A8",
  beard: "sage",
  moustache: "sage",
  beardColor: "#F4F0E8",
  crown: "kirita",
  stole: ["#1F3E8A", "#F2C14E"],
  dhoti: ["#F4EEDF", "#D8CDB2", "#D9A23A"],
  chest: 1.04,
};

export const SHANTANU = "bhShantanu" as Who;
export const DEVAVRATA = "bhDevavrata" as Who;
export const BHISHMA = "bhBhishma" as Who;

export const GANGA: Palette = {
  ...LK0,
  skin: "#F4D5B4",
  skinShade: "#D9AF88",
  skinLine: "#9A6A44",
  rim: "#E8FBFF",
  sari: "#F2F8FC",
  sariShade: "#B9D6E4",
  sariHi: "#FFFFFF",
  choli: "#17808F",
  lip: "#BE3E58",
  hair: "#120E14",
  hairHi: "#3A3248",
  border: "#E3B341",
};

/** A recurve warrior's bow, held at its grip. Origin = the grip; the string is on the left at draw 0. */
export const Bow: React.FC<{ s?: number; rot?: number; draw?: number }> = ({ s = 1, rot = 0, draw = 0 }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    <path d={`M0 -200C-6 -190 -2 -170 10 -150C34 -100 38 -40 14 -6L14 6C38 40 34 100 10 150C-2 170 -6 190 0 200`} stroke="#5A2E14" strokeWidth={11} fill="none" strokeLinecap="round" />
    <path d={`M0 -200C-6 -190 -2 -170 10 -150C34 -100 38 -40 14 -6`} stroke="#E8B24A" strokeWidth={3} fill="none" opacity={0.8} transform="translate(3 0)" />
    {[-120, -60, 60, 120].map((y) => <rect key={y} x={14 + (Math.abs(y) > 90 ? 6 : 18) - 6} y={y - 3} width={12} height={6} rx={2} fill="url(#mGold)" />)}
    <rect x={6} y={-16} width={18} height={32} rx={4} fill="#8E1E2A" stroke={P.goldDeep} strokeWidth={1.5} />
    <path d={`M0 -200L${-20 - 60 * draw} 0L0 200`} stroke="#F4EEDA" strokeWidth={2.4} fill="none" />
  </g>
);

/** A quiver of arrows (drawn on the back). Origin = the strap point. */
export const Quiver: React.FC<{ s?: number; rot?: number }> = ({ s = 1, rot = -20 }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    {[-12, -4, 4, 12].map((x, i) => (
      <g key={x}>
        <path d={`M${x} -40L${x} -110`} stroke="#6A3A1C" strokeWidth={3} />
        <path d={`M${x} -110L${x - 7} -126L${x} -122L${x + 7} -126Z`} fill={i % 2 ? "#E8E2D2" : "#C8102E"} />
      </g>
    ))}
    <path d="M-22 -44L22 -44L18 120L-18 120Z" fill="#7A3A1C" stroke="#4A220E" strokeWidth={2} />
    <path d="M-22 -44L22 -44L21 -28L-21 -28Z" fill="url(#mGold)" />
    <path d="M-18 60L18 60" stroke="url(#mGold)" strokeWidth={5} />
  </g>
);

/**
 * Ganga's makara: a sea-creature vahana with a curled elephant-like snout, a crocodile jaw, teal-green scales, a gold
 * crest and a fish tail. Origin = the waterline under its body; faces right at facing 1.
 */
export const Makara: React.FC<{ f: number; s?: number; facing?: number; glow?: number }> = ({ f, s = 1, facing = 1, glow = 0 }) => {
  const b = Math.sin(f / 18) * 6;
  const tail = Math.sin(f / 11) * 10;
  return (
    <g transform={`scale(${s * facing} ${s}) translate(0 ${b})`}>
      {glow > 0.01 ? <ellipse cx={20} cy={-60} rx={300} ry={120} fill="#9FF2F6" opacity={0.3 * glow} filter="url(#mBlur8)" /> : null}
      {/* tail fin rising behind */}
      <path d={`M-230 -20C-280 -60 ${-300 + tail} -130 ${-270 + tail} -170C${-250 + tail} -120 -230 -90 -190 -60Z`} fill="#1E8C86" stroke="#0E5A58" strokeWidth={3} />
      <path d={`M${-270 + tail} -170C${-300 + tail} -160 ${-320 + tail} -120 ${-300 + tail} -96`} stroke="#E8B24A" strokeWidth={4} fill="none" />
      {/* body */}
      <path d="M-240 0C-220 -70 -120 -110 0 -112C90 -112 150 -90 180 -50L190 0Z" fill="#2AA39A" stroke="#0E5A58" strokeWidth={3} />
      <path d="M-200 -16C-150 -60 -60 -84 40 -84C110 -84 150 -60 170 -30" stroke="#7FE0D2" strokeWidth={5} fill="none" opacity={0.6} />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${-190 + i * 40} -40q14 -16 28 0`} stroke="#0E5A58" strokeWidth={2.5} fill="none" opacity={0.55} />
      ))}
      {/* gold crest along the back */}
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M${-150 + i * 38} ${-92 - (i > 2 && i < 5 ? 8 : 0)}l14 -26l14 26Z`} fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={1.2} />
      ))}
      {/* head with jaw, eye and the curled snout */}
      <g transform="translate(170 -70)">
        <path d="M-20 -40C20 -60 70 -50 90 -20L96 10C70 20 20 22 -10 14Z" fill="#2AA39A" stroke="#0E5A58" strokeWidth={3} />
        <path d="M-6 14C30 22 70 22 96 10L92 30C60 40 20 40 -10 30Z" fill="#E8D7A0" stroke="#0E5A58" strokeWidth={2.5} />
        {[10, 30, 50, 70].map((x) => <path key={x} d={`M${x} 14l5 8l5 -8`} fill="#FFFFFF" />)}
        <path d="M90 -20C130 -30 150 -70 128 -96C112 -112 92 -100 100 -84C108 -70 124 -76 118 -88" stroke="#2AA39A" strokeWidth={16} fill="none" strokeLinecap="round" />
        <path d="M90 -20C130 -30 150 -70 128 -96" stroke="#E8B24A" strokeWidth={3} fill="none" opacity={0.8} />
        <ellipse cx={30} cy={-24} rx={12} ry={9} fill="#FFF6D8" />
        <circle cx={33} cy={-24} r={5} fill="#1A1A10" />
        <circle cx={35} cy={-26} r={1.6} fill="#FFFFFF" />
        <path d="M10 -44L0 -74L28 -50Z" fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={1.2} />
        <circle cx={14} cy={-56} r={4} fill="#2FB5C4" />
      </g>
    </g>
  );
};

/** One of the eight Vasus as a small radiant star-god (a seated glowing figure in a star). Origin = centre. */
export const Vasu: React.FC<{ f: number; s?: number; k?: number; seed?: number }> = ({ f, s = 1, k = 1, seed = 0 }) => {
  const tw = 0.85 + 0.15 * Math.sin(f / 7 + seed * 1.7);
  return (
    <g transform={`scale(${s})`} opacity={k}>
      <circle r={70} fill="#FFF4C8" opacity={0.25 * tw} filter="url(#mBlur8)" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d="M0 -14L4 -52L0 -60L-4 -52Z" fill="#FFE9A0" transform={`rotate(${i * 45 + f * 0.6})`} opacity={0.8 * tw} />
      ))}
      <circle r={22} fill="#FFF8E0" />
      <circle cy={-6} r={7} fill="#F6C66A" />
      <path d="M-11 12C-10 2 -6 -1 0 -1C6 -1 10 2 11 12Z" fill="#F6C66A" />
      <path d="M-6 -12L-4 -18L0 -14L4 -18L6 -12Z" fill="url(#mGold)" />
    </g>
  );
};
