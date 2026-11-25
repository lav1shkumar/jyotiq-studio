import React from "react";
import "../ep1/cast";
import "../ep2/cast2";
import "../ep3/cast3";
import { LOOKS, type Who } from "../../manthan/rig";
import { P } from "../../manthan/style";
import { LK0, type Palette } from "../ep1/ganga";
import { AMBALIKA as AMBALIKA3, AMBIKA as AMBIKA3 } from "../ep3/cast3";

/*
 * भारत Ep4 cast (adds rig LOOKS keys; earlier episodes' files are imported read-only).
 *  - bhVyasa: Krishna Dvaipayana Vyasa, the forest sage who arranged the Vedas. The text calls him dark (कृष्ण), with
 *    tawny matted hair, a long beard and blazing eyes; here: dark skin, grey-black jata, long beard, tripundra, rudraksha,
 *    the sacred thread, a valkala (bark-cloth) stole and dhoti, rudraksha earrings, no gold. Props: kamandalu and a
 *    palm-leaf Veda pothi.
 * SATYAVATI4: Rajmata Satyavati, now a widow: ivory sari with a gold border, a deep maroon choli (dusky skin as Ep2).
 * AMBIKA4 / AMBALIKA4: Ep3's sisters, a little more muted now that Vichitravirya is gone.
 * DASI: the palace maid: simple turmeric cotton sari with a red border, indigo choli, darker skin.
 */
type Look = (typeof LOOKS)[Who];
const L = LOOKS as unknown as Record<string, Look>;

L.bhVyasa = {
  ...L.durvasa,
  skin: "#6E4A34",
  skinShade: "#553624",
  skinLine: "#2E1C12",
  rim: "#FFC48A",
  sclera: "#FFF2DC",
  iris: "#1A0E08",
  glowColor: "#FF8A2A",
  lid: 0.3,
  brow: "#3A3430",
  browW: 7,
  hair: "jata",
  hairColor: "#4A3E34",
  hairShade: "#2A221C",
  beard: "sage",
  moustache: "sage",
  beardColor: "#7A7068",
  tilak: "tripundra",
  thread: true,
  necklaces: 0,
  rudraksha: true,
  stole: ["#7A5634", "#4A321E"],
  dhoti: ["#9A6A3A", "#74502A", "#4A321E"],
  armlet: false,
  bracelet: "#5A3A22",
  anklet: false,
  earring: "rudraksha",
  chest: 0.96,
};

export const VYASA = "bhVyasa" as Who;

export const SATYAVATI4: Palette = {
  ...LK0,
  skin: "#B87A52",
  skinShade: "#966040",
  skinLine: "#5E3A22",
  rim: "#FFE2C0",
  sari: "#F2E8D4",
  sariShade: "#CDBE9E",
  sariHi: "#FFFAF0",
  choli: "#6A1A24",
  lip: "#9A3A44",
  hair: "#2A221E",
  hairHi: "#6A5E56",
  border: "#D9A43A",
};
export const AMBIKA4: Palette = { ...AMBIKA3, sari: "#C8701E", sariShade: "#9A5214", sariHi: "#E89A4A" };
export const AMBALIKA4: Palette = { ...AMBALIKA3, sari: "#B84A78", sariShade: "#8E3458", sariHi: "#DA7A9E" };
/** Ambalika with the colour drained from her face (u 0..1). */
export const palePal = (u: number): Palette => {
  const mix = (a: string, b: string) => {
    const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
    const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
    return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * u).toString(16).padStart(2, "0")).join("");
  };
  return { ...AMBALIKA4, skin: mix(AMBALIKA4.skin, "#EDE6C8"), skinShade: mix(AMBALIKA4.skinShade, "#C9C2A0"), lip: mix(AMBALIKA4.lip, "#C8A8A0") };
};
export const DASI: Palette = {
  ...LK0,
  skin: "#A8704A",
  skinShade: "#86563A",
  skinLine: "#4E3020",
  rim: "#FFD9B0",
  sari: "#E0A82A",
  sariShade: "#B8841A",
  sariHi: "#F4C85A",
  choli: "#2A3A6A",
  lip: "#9A3A3A",
  hair: "#140C08",
  border: "#B3182E",
};

/** A palm-leaf Veda manuscript (pothi): stacked leaves between wooden boards, tied with a red cord. Origin = centre. */
export const Pothi: React.FC<{ s?: number; rot?: number; glow?: number }> = ({ s = 1, rot = 0, glow = 0 }) => (
  <g transform={`scale(${s}) rotate(${rot})`}>
    {glow > 0.01 ? <ellipse rx={110} ry={50} fill="#FFE2A0" opacity={0.5 * glow} filter="url(#mBlur8)" /> : null}
    <rect x={-80} y={-20} width={160} height={14} rx={6} fill="#5A3A22" />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={-76} y={-6 + i * 5} width={152} height={5} rx={2} fill={i % 2 ? "#E8D2A0" : "#D8BE88"} />
    ))}
    <rect x={-80} y={14} width={160} height={14} rx={6} fill="#5A3A22" />
    <path d="M-40 -22L-40 30M40 -22L40 30" stroke="#B3182E" strokeWidth={4} />
    <circle cx={0} cy={-13} r={5} fill={P.gold} />
  </g>
);

/** A copper kalash with mango leaves and a coconut, for the yajna corner. Origin = base. */
export const Kalash: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-50 0C-70 -30 -70 -80 -36 -100L36 -100C70 -80 70 -30 50 0Z" fill="#C0602A" stroke="#6A2A10" strokeWidth={3} />
    <path d="M-56 -50C-20 -40 20 -40 56 -50" stroke="#F6B70E" strokeWidth={6} fill="none" />
    <path d="M-34 -100L-30 -118L30 -118L34 -100Z" fill="#A04A1E" />
    {[-60, -30, 0, 30, 60].map((a) => (
      <path key={a} d="M0 -116C-14 -150 -10 -180 0 -196C10 -180 14 -150 0 -116Z" fill="#2E7A32" stroke="#1A4A1E" strokeWidth={2} transform={`rotate(${a} 0 -116)`} />
    ))}
    <ellipse cx={0} cy={-136} rx={30} ry={26} fill="#7A4A22" stroke="#4A2A10" strokeWidth={2} />
    <path d="M-20 -150Q0 -170 20 -150" stroke="#C8102E" strokeWidth={4} fill="none" />
    <circle cx={0} cy={-70} r={8} fill="#C8102E" />
  </g>
);
