import React from "react";
import "../ep1/cast";
import "../ep2/cast2";
import "../ep3/cast3";
import "../ep4/cast4";
import { LOOKS, type Who } from "../../manthan/rig";
import { P } from "../../manthan/style";
import { Baby } from "../../chhath/cast";
import { LK0, type Palette } from "./kunti";

/*
 * भारत Ep5 cast (adds rig LOOKS keys; earlier episodes' files are imported read-only).
 *  KUNTI: the maiden princess of King Kuntibhoja's house: warm wheat skin, a coral-rose silk sari with a broad gold zari border,
 *    an emerald choli, matha patti, two-tier jhumkas, a temple coin necklace, a nose pin (no nath: she is unmarried).
 *  KUNTI_RANI: years later, Pandu's queen: deep crimson and gold, a mukut and a nath with a chain (the married queen's ornament).
 *  DAI: the old palace nurse: plain indigo cotton with a saffron border, the pallu over her head, grey streaks.
 *  RADHA: Adhiratha's wife: a simple leaf-green sari with a red border.
 *  bhSurya5: the rig's Surya (gold crown with rays, saffron and gold), brighter rim for the descent.
 *  bhDurvasa5: the rig's Durvasa, sterner brows; bhAdhiratha: a humble charioteer (no crown, curled moustache, a
 *    plain white dhoti with an ochre border, a faded stole); bhPandu5: Pandu, pale-skinned king (Ep4's pale prince, grown).
 */
type Look = (typeof LOOKS)[Who];
const L = LOOKS as unknown as Record<string, Look>;

L.bhSurya5 = { ...L.surya, crown: "kirita", rim: "#FFF1B8", glowColor: "#FFC23D", necklaces: 3, pearls: true, chest: 1.04 };
L.bhDurvasa5 = { ...L.durvasa, browW: 8, lid: 0.32 };
L.bhAdhiratha = {
  ...L.deva,
  skin: "#9C6A46",
  skinShade: "#7C5034",
  skinLine: "#4A2E1C",
  rim: "#FFD3A0",
  iris: "#2A1A10",
  brow: "#1A120C",
  browW: 6,
  hair: "royal",
  hairColor: "#1A120C",
  hairShade: "#0C0806",
  moustache: "curl",
  beardColor: "#1A120C",
  crown: undefined,
  tilak: "dot",
  thread: true,
  necklaces: 1,
  pearls: false,
  stole: ["#B88A52", "#7A5228"],
  dhoti: ["#EFE6D2", "#CFC2A6", "#B8701E"],
  armlet: false,
  bracelet: "#8A6A3A",
  anklet: false,
  earring: "kundala",
  chest: 1.04,
};
L.bhPandu5 = {
  ...L.indra,
  skin: "#EDE2C4",
  skinShade: "#CDBE9A",
  skinLine: "#8E7E5C",
  rim: "#FFFFFF",
  iris: "#3A2A1A",
  moustache: "thin",
  crown: "kirita",
  stole: ["#F2EAD8", "#D9A43A"],
  dhoti: ["#E9D9A8", "#CDB984", "#B3182E"],
  chest: 0.98,
};
export const SURYA5 = "bhSurya5" as Who;
export const DURVASA5 = "bhDurvasa5" as Who;
export const ADHIRATHA = "bhAdhiratha" as Who;
export const PANDU5 = "bhPandu5" as Who;

export const KUNTI: Palette = {
  ...LK0,
  skin: "#E6AE80",
  skinShade: "#C88A5C",
  skinLine: "#82502E",
  rim: "#FFE6C4",
  sari: "#EE6A5E",
  sariShade: "#C24A44",
  sariHi: "#FF9A88",
  choli: "#17705E",
  lip: "#B42E48",
  hair: "#140C08",
  hairHi: "#4A3226",
  iris: "#3A1E10",
  border: "#F2C14E",
};
export const KUNTI_RANI: Palette = { ...KUNTI, sari: "#A8142E", sariShade: "#7A0C22", sariHi: "#D8404E", choli: "#0F5A4A", border: "#F6C750" };
export const DAI: Palette = {
  ...LK0,
  skin: "#A87250",
  skinShade: "#865838",
  skinLine: "#4E3020",
  rim: "#FFD8B0",
  sari: "#3E4E80",
  sariShade: "#2C3A62",
  sariHi: "#5E70A8",
  choli: "#8A3A22",
  lip: "#8A3A3A",
  hair: "#2A221E",
  hairHi: "#8A8078",
  border: "#E08A1E",
};
export const RADHA: Palette = {
  ...LK0,
  skin: "#B07A52",
  skinShade: "#8E5C3A",
  skinLine: "#52321E",
  sari: "#3E8A4A",
  sariShade: "#2C6A36",
  sariHi: "#6AB070",
  choli: "#B3182E",
  hair: "#140C08",
  border: "#C8102E",
};

/** Baby Karna: the chhath Baby with the golden kavach on his chest and the kundal in his ears, glowing like the sun. */
export const KarnaBaby: React.FC<{ f: number; s?: number; rot?: number; glow?: number; shine?: number; cry?: number }> = ({ f, s = 1, rot = 0, glow = 0.6, shine = 1, cry = 0 }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    {glow > 0.01 ? <ellipse cx={20} rx={150} ry={100} fill="#FFD36A" opacity={0.45 * glow} filter="url(#mBlur8)" /> : null}
    <Baby f={f} glow={0} cry={cry} />
    {/* the kavach: a gold breastplate with scale rows and a small sun boss, over the swaddle */}
    <g transform="translate(-6 -6)">
      <path d="M-34 -30C-16 -40 18 -40 34 -30L30 26C14 36 -14 36 -30 26Z" fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={2.4} />
      {[-18, -4, 10].map((yy, r) =>
        [-2, -1, 0, 1, 2].map((c) => {
          const xx = c * 12 + (r % 2 ? 6 : 0);
          return Math.abs(xx) < 26 ? <path key={`${r}${c}`} d={`M${xx - 6} ${yy}Q${xx} ${yy + 8} ${xx + 6} ${yy}`} stroke={P.goldDeep} strokeWidth={1.4} fill="none" opacity={0.75} /> : null;
        }),
      )}
      <g transform="translate(0 -4)">
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M0 -9L2 -14L-2 -14Z" fill="#FFF3C0" transform={`rotate(${i * 30 + f * 0.8})`} />
        ))}
        <circle r={8} fill="#FFB020" stroke={P.goldDeep} strokeWidth={1.4} />
        <circle r={3.5} fill="#FFF3C0" />
      </g>
      <path d="M-30 -24C-12 -32 12 -32 30 -24" stroke="#FFF6D0" strokeWidth={2.5} fill="none" opacity={0.7 * shine} />
    </g>
    {/* the kundal: gold hoops with a ruby at the ears (head centre is at (66, -2), r 36) */}
    {[-1, 1].map((sd) => (
      <g key={sd} transform={`translate(${66 + sd * 35} ${16}) rotate(${Math.sin(f / 14 + sd) * 8})`}>
        <circle r={8} fill="none" stroke="url(#mGold)" strokeWidth={4} />
        <circle cy={8} r={3.2} fill="#E3264A" stroke={P.goldDeep} strokeWidth={0.8} />
        <circle r={14} fill="#FFE07A" opacity={0.25 * shine} filter="url(#mBlur8)" />
      </g>
    ))}
    {/* glints that travel across the armour */}
    {shine > 0.01 ? <circle cx={-30 + ((f * 3) % 80)} cy={-20 + ((f * 3) % 80) * 0.5} r={4} fill="#FFFFFF" opacity={0.6 * shine * Math.max(0, Math.sin(((f * 3) % 80) / 25))} /> : null}
  </g>
);

/** A woven reed basket lined with cloth, the baby inside (head and kavach showing). Origin = centre of the basket mouth. */
export const Basket: React.FC<{ f: number; s?: number; rot?: number; glow?: number; baby?: boolean; bob?: number }> = ({ f, s = 1, rot = 0, glow = 0.5, baby = true, bob = 0 }) => {
  const y = bob * Math.sin(f / 11) * 6;
  return (
    <g transform={`translate(0 ${y}) rotate(${rot + bob * Math.sin(f / 15) * 3}) scale(${s})`}>
      {glow > 0.01 ? <ellipse cy={-20} rx={210} ry={110} fill="#FFD36A" opacity={0.4 * glow} filter="url(#mBlur8)" /> : null}
      {/* back rim */}
      <ellipse cy={0} rx={150} ry={42} fill="#6A4422" />
      {baby ? (
        <g transform="translate(-30 -6) scale(0.95)">
          <path d="M-90 10C-60 -30 60 -34 110 0L110 30L-90 30Z" fill="#F4E6CC" />
          <KarnaBaby f={f} s={1} glow={0} shine={glow} />
        </g>
      ) : null}
      {/* the woven body */}
      <path d="M-150 0C-146 50 -110 92 0 96C110 92 146 50 150 0C110 30 -110 30 -150 0Z" fill="#A87440" stroke="#5A3A1C" strokeWidth={3} />
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M-150 ${8 + i * 14}C-100 ${36 + i * 12} 100 ${36 + i * 12} 150 ${8 + i * 14}`} stroke="#7A5028" strokeWidth={2.5} fill="none" opacity={0.8} transform={`scale(${1 - i * 0.07} 1)`} />
      ))}
      {Array.from({ length: 13 }, (_, i) => {
        const x = -132 + i * 22;
        return <path key={`v${i}`} d={`M${x} ${18}L${x * 0.85} ${84}`} stroke="#C8925A" strokeWidth={2} opacity={0.55} />;
      })}
      {/* front rim with a red cloth edge */}
      <path d="M-150 0C-110 30 110 30 150 0" stroke="#5A3A1C" strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d="M-120 12C-60 28 60 28 120 12" stroke="#C8102E" strokeWidth={6} fill="none" />
      <path d="M-120 12C-60 28 60 28 120 12" stroke="#F2C14E" strokeWidth={2} fill="none" strokeDasharray="6 8" />
    </g>
  );
};

/** A brass thali with a diya, flowers and fruit: Kunti's service to Durvasa. Origin = plate centre. */
export const Thali: React.FC<{ f: number; s?: number }> = ({ f, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <ellipse rx={70} ry={20} fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={2} />
    <ellipse rx={56} ry={14} fill="none" stroke={P.goldDeep} strokeWidth={1.2} opacity={0.6} />
    {[-34, -18, 30].map((x, i) => <circle key={x} cx={x} cy={-6} r={8} fill={i === 2 ? "#E8892A" : "#F6B70E"} />)}
    {[12, 22].map((x) => <ellipse key={x} cx={x} cy={-4} rx={7} ry={5} fill="#C8102E" />)}
    <path d="M-10 -6C-8 4 8 4 10 -6Z" fill="#C0602A" />
    <path d={`M-3 -8C-4 -16 -1 -20 0 ${-26 - 2 * Math.sin(f / 2)}C1 -20 4 -16 3 -8Z`} fill="#FFC23A" />
    <circle cy={-14} r={14} fill="#FFB04A" opacity={0.3} filter="url(#mBlur8)" />
  </g>
);

/** A charioteer's whip (in Adhiratha's hand). */
export const Whip: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <path d="M0 0L0 -90" stroke="#5A3A1C" strokeWidth={5} strokeLinecap="round" />
    <path d={`M0 -90C20 ${-120 + 6 * Math.sin(f / 9)} 50 -110 60 ${-80 + 8 * Math.sin(f / 7)}`} stroke="#3A2A1A" strokeWidth={2} fill="none" />
  </g>
);
