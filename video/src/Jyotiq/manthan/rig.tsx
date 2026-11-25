import React from "react";
import { LINES } from "./timing";
import { VO } from "./voData";
import { mix, P, rnd, wob } from "./style";

/* Manthan cut-out rig. A character is rigid parts (torso, head, upper arm,
   forearm, hand, lower costume) pinned at joints and posed by a few angles.
   Local units ~ px at scale 1; origin at the waist; the puppet faces +x and
   is mirrored with facing = -1.

   Angles (deg): sF/sB swing an arm forward (+) from hanging down, eF/eB bend
   the elbow forward (+), wF/wB bend the wrist. `lean` tips the upper body
   forward (+), `head` nods the face down (+). */

export type Pose = {
  lean: number;
  head: number;
  sF: number;
  eF: number;
  wF: number;
  sB: number;
  eB: number;
  wB: number;
  bob: number;
  sway: number;
  blink: number; // 0 open .. 1 shut
  brow: number; // raise 0..1
  browTilt: number; // deg; + angry, - worried
  talk: number; // mouth open 0..1
  smile: number; // -1 frown .. 1 smile
  lookX: number; // -1..1 (toward facing = +)
  lookY: number;
  glow: number; // eye glow 0..1 (rage / power)
  fist: number; // front hand: 0 open, 1 fist
};

export const REST: Pose = {
  lean: 0, head: 0, sF: 8, eF: 12, wF: 0, sB: -6, eB: 10, wB: 0,
  bob: 0, sway: 0, blink: 0, brow: 0, browTilt: 0, talk: 0, smile: 0, lookX: 0.6, lookY: 0, glow: 0, fist: 0,
};
export const pose = (o: Partial<Pose>): Pose => ({ ...REST, ...o });

/** Mouth openness for a dialogue line at reel frame f (0 outside the line). */
export const talkAt = (line: string, f: number): number => {
  const r = LINES[line];
  const v = VO[line];
  if (!r || !v) return 0;
  const i = Math.round(f) - r[0];
  if (i < 0 || i >= v.env.length) return 0;
  const g = (k: number) => v.env[Math.max(0, Math.min(v.env.length - 1, k))];
  return Math.min(1, ((g(i - 1) + 2 * g(i) + g(i + 1)) / 4) * 1.1);
};

/** Natural blinks: one every ~3-5 s, 5 frames long. */
export const blinkAt = (seed: string, f: number): number => {
  const period = 100 + Math.floor(rnd(`${seed}-bp`) * 60);
  const ph = (Math.floor(f) + Math.floor(rnd(seed) * period)) % period;
  return ph < 5 ? [0.45, 1, 1, 0.55, 0.15][ph] : 0;
};

/** Idle life: breathing bob + a slow sway, different per character. */
export const idle = (seed: string, f: number, k = 1): Partial<Pose> => ({
  bob: Math.sin(f / 26 + rnd(seed) * 6) * 2.2 * k,
  sway: wob(`${seed}-sw`, f / 70) * 1.2 * k,
  head: wob(`${seed}-hd`, f / 55) * 2.2 * k,
  sB: -6 + wob(`${seed}-ab`, f / 60) * 3 * k,
});

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

const SH_F: [number, number] = [42, -196];
const SH_B: [number, number] = [-46, -198];
const NECK: [number, number] = [6, -224];
const UA = 104;
const FA = 96;
const HEAD_S = 0.86;

export type Who = "indra" | "durvasa" | "swarbhanu" | "bali" | "deva" | "asura"
  // Episode 2 cast: named devtas and three distinct asura generals
  | "surya" | "chandra" | "agni" | "vayu" | "asuraSlate" | "asuraJade" | "asuraIron";

type Look = {
  skin: string;
  skinShade: string;
  skinLine: string;
  rim: string;
  sclera: string;
  iris: string;
  slit?: boolean;
  glowColor: string;
  lid: number; // heavy lid 0..1
  brow: string;
  browW: number;
  hair: "royal" | "jata" | "wild" | "covered";
  hairColor: string;
  hairShade: string;
  beard?: "sage" | "goatee" | "full";
  moustache?: "curl" | "sage" | "thin";
  beardColor?: string;
  crown?: "kirita" | "naga" | "asura" | "deva" | "surya" | "chandra" | "agni" | "vayu" | "horned" | "tusk" | "iron" | "dastar" | "pagri" | "safa";
  tilak?: "tripundra" | "urdhva" | "dot";
  thread: boolean;
  necklaces: number;
  pearls?: boolean;
  rudraksha?: boolean;
  stole?: [string, string]; // [cloth, border]
  dhoti: [string, string, string]; // [cloth, shade, border]
  armlet: boolean;
  bracelet: string;
  anklet: boolean;
  earring: "kundala" | "rudraksha" | "naga" | "none";
  chest: number; // width scale
  /** Long robe (chola / jama / pheran) over torso, arms and legs, with leather jutti. Absent = the bare-chested dhoti look. */
  robe?: { cloth: string; shade: string; trim: string; sash?: string; shoe?: string; open?: boolean };
  /** Turban cloth colours for dastar / pagri / safa: [cloth, fold shade]. */
  turban?: [string, string];
  /** Jewelled kalgi plume on the turban (Guru Hargobind); "sarpech" = Mughal turban jewel with a small aigrette. */
  plume?: "kalgi" | "sarpech";
  /** Iron kara instead of gold bracelets is just bracelet colour; this hides the gold waist band and gems. */
};

const LOOKS: Record<Who, Look> = {
  indra: {
    skin: "#E9B27A", skinShade: "#C98B57", skinLine: "#8E5631", rim: "#FFE2B0",
    sclera: "#FFF8EC", iris: "#4A2A16", glowColor: "#9FD8FF", lid: 0.12,
    brow: "#1C120C", browW: 5,
    hair: "royal", hairColor: "#1A1110", hairShade: "#0B0706",
    moustache: "curl", beardColor: "#1A1110",
    crown: "kirita", tilak: "urdhva",
    thread: true, necklaces: 3, pearls: true,
    stole: ["#B3262E", "#F2C14E"],
    dhoti: [P.royalBlue, P.royalBlueShade, "#F2C14E"],
    armlet: true, bracelet: P.gold, anklet: true, earring: "kundala", chest: 1.04,
  },
  durvasa: {
    skin: "#A88470", skinShade: "#86624F", skinLine: "#5A3C2C", rim: "#E9D9C9",
    sclera: "#F6EFE2", iris: "#2A1A12", glowColor: "#FF5A2A", lid: 0.38,
    brow: "#F1ECE2", browW: 7,
    hair: "jata", hairColor: "#D6CFC1", hairShade: "#9F9585",
    beard: "sage", moustache: "sage", beardColor: "#EEE9DF",
    tilak: "tripundra",
    thread: true, necklaces: 0, rudraksha: true,
    stole: ["#C4702A", "#8E4A16"],
    dhoti: [P.saffron, P.ochre, "#7A3A12"],
    armlet: false, bracelet: "#6B3A22", anklet: false, earring: "rudraksha", chest: 0.92,
  },
  swarbhanu: {
    skin: "#5E5A86", skinShade: "#433F69", skinLine: "#24203F", rim: "#C9B8FF",
    sclera: "#1B1426", iris: "#FFC23D", slit: true, glowColor: "#FFC23D", lid: 0.2,
    brow: "#0E0A14", browW: 6,
    hair: "wild", hairColor: "#120D18", hairShade: "#070509",
    beard: "goatee", moustache: "thin", beardColor: "#120D18",
    crown: "naga",
    thread: false, necklaces: 2,
    stole: [P.violetDeep, P.gold],
    dhoti: ["#2A1B44", "#1A1030", P.gold],
    armlet: true, bracelet: P.gold, anklet: true, earring: "naga", chest: 1,
  },
  bali: {
    skin: "#9A5A3C", skinShade: "#7A432A", skinLine: "#4E2716", rim: "#FFC59A",
    sclera: "#FFF4E6", iris: "#2A1408", glowColor: "#FF7A3A", lid: 0.15,
    brow: "#140C08", browW: 7,
    hair: "royal", hairColor: "#140C08", hairShade: "#080503",
    beard: "goatee", moustache: "curl", beardColor: "#140C08",
    crown: "asura", tilak: "dot",
    thread: true, necklaces: 3, pearls: true,
    stole: [P.maroon, P.gold],
    dhoti: [P.crimson, "#7E1A20", P.gold],
    armlet: true, bracelet: P.gold, anklet: true, earring: "kundala", chest: 1.12,
  },
  deva: {
    skin: "#E5AE78", skinShade: "#C48955", skinLine: "#8A5532", rim: "#FFE6B8",
    sclera: "#FFF8EC", iris: "#3A2214", glowColor: "#9FD8FF", lid: 0.1,
    brow: "#1E140E", browW: 4.5,
    hair: "royal", hairColor: "#1E140E", hairShade: "#0E0906",
    crown: "deva", tilak: "urdhva",
    thread: true, necklaces: 2,
    stole: ["#F2EAD8", "#E2B04A"],
    dhoti: ["#E9D9A8", "#CDB984", "#C8902E"],
    armlet: true, bracelet: P.gold, anklet: false, earring: "kundala", chest: 0.98,
  },
  asura: {
    skin: "#6E4A52", skinShade: "#53343B", skinLine: "#2E1A1F", rim: "#FF9B7A",
    sclera: "#FFE9D6", iris: "#2A0C0C", glowColor: "#FF5A2A", lid: 0.25,
    brow: "#0E0808", browW: 7,
    hair: "wild", hairColor: "#0E0808", hairShade: "#050303",
    moustache: "curl", beardColor: "#0E0808",
    crown: "asura",
    thread: false, necklaces: 1,
    dhoti: ["#4A1418", "#300B0E", "#B88A2E"],
    armlet: true, bracelet: "#8A6A2A", anklet: false, earring: "kundala", chest: 1.08,
  },
  /* ---- Episode 2 cast: each devta and general reads apart by skin, crown and cloth ---- */
  surya: {
    skin: "#EFB567", skinShade: "#CB8C3F", skinLine: "#8A5422", rim: "#FFE7A8",
    sclera: "#FFF8EC", iris: "#5A2E0E", glowColor: "#FFB23D", lid: 0.1,
    brow: "#1E120A", browW: 4.5,
    hair: "royal", hairColor: "#1E120A", hairShade: "#0E0805",
    crown: "surya", tilak: "urdhva",
    thread: true, necklaces: 3,
    stole: ["#E8731E", "#F9D34A"],
    dhoti: ["#F2A93B", "#D4862A", "#FFF0BF"],
    armlet: true, bracelet: P.gold, anklet: true, earring: "kundala", chest: 1.0,
  },
  chandra: {
    skin: "#EBDDCB", skinShade: "#CDBBA6", skinLine: "#8C7A66", rim: "#FFFFFF",
    sclera: "#FFFFFF", iris: "#2E3550", glowColor: "#CFE4FF", lid: 0.16,
    brow: "#1B1A26", browW: 4,
    hair: "royal", hairColor: "#1B1A26", hairShade: "#0C0B12",
    crown: "chandra", tilak: "dot",
    thread: true, necklaces: 2, pearls: true,
    stole: ["#DDE6F5", "#B9C6DE"],
    dhoti: ["#F4F6FB", "#D8DEEA", "#A9B8D6"],
    armlet: true, bracelet: "#D8DEEA", anklet: false, earring: "kundala", chest: 0.94,
  },
  agni: {
    skin: "#D9864F", skinShade: "#B4642F", skinLine: "#6E3315", rim: "#FFC79A",
    sclera: "#FFF4E6", iris: "#3A1206", glowColor: "#FF7A2A", lid: 0.18,
    brow: "#3A1206", browW: 6,
    hair: "royal", hairColor: "#4A1A0C", hairShade: "#260C05",
    beard: "goatee", moustache: "curl", beardColor: "#4A1A0C",
    crown: "agni", tilak: "dot",
    thread: true, necklaces: 2,
    stole: ["#C8102E", "#FFB23D"],
    dhoti: ["#E2552A", "#B43E1C", "#FFD27A"],
    armlet: true, bracelet: P.gold, anklet: false, earring: "kundala", chest: 1.06,
  },
  vayu: {
    skin: "#DDB089", skinShade: "#BC8D63", skinLine: "#7E5536", rim: "#FFF0D6",
    sclera: "#FFF8EC", iris: "#2A2A3E", glowColor: "#BFE8FF", lid: 0.12,
    brow: "#1F1A16", browW: 4.5,
    hair: "wild", hairColor: "#1F1A16", hairShade: "#0E0B09",
    moustache: "thin", beardColor: "#1F1A16",
    crown: "vayu", tilak: "urdhva",
    thread: true, necklaces: 1,
    stole: ["#7FB8E6", "#E8F4FF"],
    dhoti: ["#5C93C9", "#3F72A6", "#E8F4FF"],
    armlet: true, bracelet: P.gold, anklet: false, earring: "kundala", chest: 0.96,
  },
  asuraSlate: {
    skin: "#4F5D6E", skinShade: "#3A4554", skinLine: "#1C232D", rim: "#9FC0E0",
    sclera: "#F3E7D8", iris: "#B0261C", glowColor: "#FF5A2A", lid: 0.3,
    brow: "#0B0F14", browW: 8,
    hair: "wild", hairColor: "#0B0F14", hairShade: "#040608",
    beard: "goatee", moustache: "curl", beardColor: "#0B0F14",
    crown: "horned",
    thread: false, necklaces: 1,
    dhoti: ["#2C3A4A", "#1D2733", "#B88A2E"],
    armlet: true, bracelet: "#8A6A2A", anklet: false, earring: "kundala", chest: 1.14,
  },
  asuraJade: {
    skin: "#3F5E4A", skinShade: "#2D4636", skinLine: "#15241B", rim: "#A8E0B8",
    sclera: "#F0E6D2", iris: "#C8301C", glowColor: "#FF5A2A", lid: 0.28,
    brow: "#0A120D", browW: 7,
    hair: "wild", hairColor: "#0A120D", hairShade: "#040805",
    moustache: "curl", beardColor: "#0A120D",
    crown: "tusk",
    thread: false, necklaces: 2,
    stole: ["#1E3A2A", "#C8902E"],
    dhoti: ["#5A2A18", "#3C1A0E", "#C8902E"],
    armlet: true, bracelet: "#8A6A2A", anklet: true, earring: "kundala", chest: 1.1,
  },
  asuraIron: {
    skin: "#4A4143", skinShade: "#352E30", skinLine: "#120E0F", rim: "#E0A07A",
    sclera: "#EFE2D0", iris: "#E0A020", glowColor: "#FF7A2A", lid: 0.35,
    brow: "#070505", browW: 8,
    hair: "wild", hairColor: "#070505", hairShade: "#020101",
    beard: "goatee", moustache: "curl", beardColor: "#070505",
    crown: "iron",
    thread: false, necklaces: 1,
    dhoti: ["#6E1E2E", "#4A1220", "#9A7A3A"],
    armlet: true, bracelet: "#5A4A3A", anklet: false, earring: "kundala", chest: 1.18,
  },
};

/* ------------------------------------------------------------------ */
/* Shared defs (gradients, soft cut-out shadow) - mount once per SVG   */
/* ------------------------------------------------------------------ */

export const RigDefs: React.FC = () => (
  <defs>
    <linearGradient id="mGold" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stopColor="#FFF0BF" />
      <stop offset="0.35" stopColor={P.gold} />
      <stop offset="1" stopColor={P.goldDark} />
    </linearGradient>
    <linearGradient id="mGoldDark" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#D9A23E" />
      <stop offset="1" stopColor="#7A4C12" />
    </linearGradient>
    <radialGradient id="mGem" cx="0.35" cy="0.3" r="0.8">
      <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.9} />
      <stop offset="0.25" stopColor="#FFFFFF" stopOpacity={0} />
    </radialGradient>
    <linearGradient id="mFlame" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stopColor="#E2462A" />
      <stop offset="0.55" stopColor="#FFB23D" />
      <stop offset="1" stopColor="#FFF3B0" />
    </linearGradient>
    <linearGradient id="mIron" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stopColor="#6A6F7A" />
      <stop offset="1" stopColor="#262A31" />
    </linearGradient>
    <filter id="mCut" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#12060A" floodOpacity="0.45" />
    </filter>
    <filter id="mGlow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="6" result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="mBlur8">
      <feGaussianBlur stdDeviation="8" />
    </filter>
  </defs>
);

const Gem: React.FC<{ x: number; y: number; r: number; c: string }> = ({ x, y, r, c }) => (
  <g>
    <circle cx={x} cy={y} r={r + 1.6} fill={P.goldDeep} />
    <circle cx={x} cy={y} r={r} fill={c} />
    <circle cx={x} cy={y} r={r} fill="url(#mGem)" />
  </g>
);

/* ------------------------------------------------------------------ */
/* Arms                                                                */
/* ------------------------------------------------------------------ */

const UPPER = `M-18 -6C-21 30 -18 72 -13 ${UA}L13 ${UA}C17 72 19 30 17 -6C11 -16 -12 -16 -18 -6Z`;
const FORE = `M-13 -2C-14 30 -12 62 -10 ${FA}L10 ${FA}C12 62 14 30 13 -2Z`;
const HAND_OPEN = "M-12 -4C-16 12 -14 30 -4 40C4 46 14 40 16 28C18 16 16 4 13 -4Z";
const THUMB = "M10 6C22 6 28 16 22 24C18 28 12 22 11 16Z";
const FIST = "M-13 -4C-17 8 -14 24 -2 27C10 29 17 21 16 8L13 -4Z";
const FINGERS = "M-6 30C-4 38 2 42 8 38M-10 22C-6 28 0 30 6 28";

const Arm: React.FC<{
  L: Look;
  front: boolean;
  s: number;
  e: number;
  w: number;
  fist: number;
  counter?: number;
  prop?: React.ReactNode;
}> = ({ L, front, s, e, w, fist, counter = 0, prop }) => {
  const sh = front ? SH_F : SH_B;
  const skin = front ? L.skin : L.skinShade;
  const line = L.skinLine;
  const R = L.robe;
  const sl = R ? (front ? R.cloth : R.shade) : skin;
  return (
    <g transform={`translate(${sh[0]} ${sh[1]}) rotate(${-s})`}>
      <path d={UPPER} fill={sl} transform={R ? "scale(1.12 1)" : undefined} />
      {front ? <path d={`M8 -8C14 30 14 70 11 ${UA}L13 ${UA}C17 72 19 30 17 -6Z`} fill={L.rim} opacity={0.35} /> : null}
      {L.armlet ? (
        <g>
          <path d="M-19 22Q0 30 18 22L18 32Q0 40 -19 32Z" fill="url(#mGold)" />
          <Gem x={0} y={30} r={3.6} c={L.dhoti[0] === P.royalBlue ? "#2E7BFF" : "#D9283A"} />
        </g>
      ) : null}
      <g transform={`translate(0 ${UA}) rotate(${-e})`}>
        <circle r={13.5} fill={sl} />
        <path d={FORE} fill={sl} transform={R ? "scale(1.15 1)" : undefined} />
        <path d={`M-13 -2C-14 30 -12 62 -10 ${FA}L-4 ${FA}C-6 62 -8 30 -6 -2Z`} fill={R ? "#000000" : L.skinShade} opacity={R ? 0.12 : front ? 0.35 : 0.2} />
        {R ? <path d={`M-13 ${FA - 14}L13 ${FA - 14}L12 ${FA - 4}L-12 ${FA - 4}Z`} fill={R.trim} /> : null}
        <path d={`M-11 ${FA - 16}Q0 ${FA - 10} 11 ${FA - 16}L11 ${FA - 6}Q0 ${FA} -11 ${FA - 6}Z`} fill={L.bracelet === P.gold ? "url(#mGold)" : L.bracelet} />
        <g transform={`translate(0 ${FA}) rotate(${-w})`}>
          {fist > 0.5 ? (
            <path d={FIST} fill={skin} stroke={line} strokeWidth={1.6} />
          ) : (
            <g>
              <path d={HAND_OPEN} fill={skin} stroke={line} strokeWidth={1.6} />
              <path d={FINGERS} stroke={line} strokeWidth={1.4} fill="none" opacity={0.6} />
            </g>
          )}
          <path d={THUMB} fill={skin} stroke={line} strokeWidth={1.6} />
          {prop ? <g transform={`translate(2 16) rotate(${counter})`}>{prop}</g> : null}
        </g>
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Torso + lower costume                                               */
/* ------------------------------------------------------------------ */

const torsoPath = (k: number) =>
  `M${-40 * k} 0C${-44 * k} -50 ${-60 * k} -112 ${-64 * k} -160C${-66 * k} -190 ${-48 * k} -207 ${-18 * k} -211L${26 * k} -211C${56 * k} -209 ${72 * k} -191 ${70 * k} -162C${66 * k} -112 ${52 * k} -52 ${46 * k} 0Z`;

const Torso: React.FC<{ L: Look; id: string; t: number }> = ({ L, id, t }) => {
  const k = L.chest;
  const d = torsoPath(k);
  return (
    <g>
      <clipPath id={`${id}-tc`}>
        <path d={d} />
      </clipPath>
      <path d={d} fill={L.robe ? L.robe.cloth : L.skin} />
      {L.robe ? (
        <g clipPath={`url(#${id}-tc)`}>
          <path d={`M-80 -220C-40 -170 -30 -80 -36 10L-90 10Z`} fill={L.robe.shade} opacity={0.85} />
          <path d={`M${60 * k} -210C${74 * k} -160 ${62 * k} -80 ${48 * k} 6L${90 * k} 6L${90 * k} -220Z`} fill="#FFFFFF" opacity={0.12} />
          {[-150, -100, -50].map((y) => (
            <path key={y} d={`M${-40 * k} ${y - 20}C${-24 * k} ${y} ${-12 * k} ${y + 16} ${4 * k} ${y + 30}`} stroke={L.robe!.shade} strokeWidth={3} fill="none" opacity={0.3} />
          ))}
          {/* neckline and the angarkha's diagonal front opening, edged with trim */}
          <path d={`M${-26 * k} -212C${-6 * k} -186 ${10 * k} -180 ${22 * k} -184C${32 * k} -190 ${40 * k} -200 ${46 * k} -212`} stroke={L.robe.trim} strokeWidth={7} fill={L.skinShade} />
          <path d={`M${22 * k} -184C${14 * k} -130 ${2 * k} -70 ${-14 * k} 4`} stroke={L.robe.trim} strokeWidth={6} fill="none" />
          <path d={`M${26 * k} -180C${18 * k} -128 ${8 * k} -70 ${-6 * k} 4`} stroke={L.robe.shade} strokeWidth={2} fill="none" opacity={0.6} />
          {[-160, -130, -100].map((y, i) => <circle key={y} cx={(18 - i * 4) * k} cy={y} r={3} fill={L.robe!.trim} />)}
        </g>
      ) : null}
      <g clipPath={`url(#${id}-tc)`} opacity={L.robe ? 0 : 1}>
        {/* shadow side + rim */}
        <path d={`M-80 -220C-40 -170 -30 -80 -36 10L-90 10Z`} fill={L.skinShade} opacity={0.75} />
        <path d={`M${60 * k} -210C${74 * k} -160 ${62 * k} -80 ${48 * k} 6L${90 * k} 6L${90 * k} -220Z`} fill={L.rim} opacity={0.4} />
        {/* pecs + abs */}
        <path d={`M${-34 * k} -152C-14 -136 6 -136 ${20 * k} -150M${28 * k} -150C${40 * k} -138 ${56 * k} -140 ${64 * k} -154`} stroke={L.skinLine} strokeWidth={2.6} fill="none" opacity={0.45} strokeLinecap="round" />
        {[-104, -76, -48].map((y) => (
          <path key={y} d={`M${2 * k} ${y}Q${12 * k} ${y + 5} ${22 * k} ${y}`} stroke={L.skinLine} strokeWidth={2} fill="none" opacity={0.3} strokeLinecap="round" />
        ))}
        <path d={`M${12 * k} -128V-30`} stroke={L.skinLine} strokeWidth={1.6} opacity={0.22} />
        <circle cx={12 * k} cy={-24} r={2.4} fill={L.skinLine} opacity={0.45} />
      </g>
      {/* sacred thread */}
      {L.thread ? <path d={`M${-52 * k} -198C${-22 * k} -128 ${10 * k} -62 ${44 * k} -4`} stroke="#F6EEDB" strokeWidth={3.2} fill="none" /> : null}
      {/* rudraksha malas */}
      {L.rudraksha ? (
        <g fill="none" strokeLinecap="round">
          <path d={`M${-36 * k} -206C${-24 * k} -150 ${30 * k} -146 ${54 * k} -204`} stroke="#5A2E1A" strokeWidth={9} strokeDasharray="0.1 11" />
          <path d={`M${-44 * k} -204C${-30 * k} -110 ${40 * k} -104 ${62 * k} -200`} stroke="#6B3A22" strokeWidth={10} strokeDasharray="0.1 12.5" />
        </g>
      ) : null}
      {/* gold necklaces */}
      {new Array(L.necklaces).fill(0).map((_, i) => (
        <path
          key={i}
          d={`M${(-34 - i * 5) * k} -206C${(-22 - i * 4) * k} ${-164 + i * 18} ${(32 + i * 4) * k} ${-160 + i * 18} ${(54 + i * 5) * k} -204`}
          stroke="url(#mGold)"
          strokeWidth={i === 0 ? 7 : 4.5}
          fill="none"
        />
      ))}
      {L.necklaces > 1 ? <Gem x={12 * k} y={-152 + (L.necklaces - 1) * 14} r={6.5} c={L.dhoti[0] === P.royalBlue ? "#2E7BFF" : "#C8102E"} /> : null}
      {L.pearls ? (
        <path d={`M${-30 * k} -207C${-18 * k} -176 ${28 * k} -172 ${48 * k} -205`} stroke="#FFF9EE" strokeWidth={6} strokeDasharray="0.1 7.5" strokeLinecap="round" fill="none" />
      ) : null}
      {/* stole over the back shoulder */}
      {L.stole ? (
        <g>
          <path
            d={`M${-62 * k} -204C${-82 * k} -140 ${-88 * k} -56 ${-74 + wob(`${id}-st`, t / 40) * 4} 30L${-54 * k} 34C${-64 * k} -40 ${-56 * k} -140 ${-36 * k} -204Z`}
            fill={L.stole[0]}
          />
          <path d={`M${-74 + wob(`${id}-st`, t / 40) * 4} 30L${-54 * k} 34`} stroke={L.stole[1]} strokeWidth={5} />
          <path d={`M${-62 * k} -204C${-82 * k} -140 ${-88 * k} -56 ${-74 + wob(`${id}-st`, t / 40) * 4} 30`} stroke={L.stole[1]} strokeWidth={3} fill="none" opacity={0.9} />
        </g>
      ) : null}
    </g>
  );
};

const FOOT = "M-8 214L14 214C16 228 22 236 46 240C58 242 60 252 50 254L-6 254C-12 244 -12 226 -8 214Z";

const RobeLower: React.FC<{ L: Look; id: string }> = ({ L, id }) => {
  const R = L.robe!;
  const d = "M-50 2L54 2C70 70 84 150 92 212C40 224 -40 224 -88 212C-80 150 -66 70 -50 2Z";
  const shoe = R.shoe ?? "#5A2A14";
  const JUTTI = "M-10 216L16 216C20 228 30 236 52 238C64 236 70 228 66 240C64 252 56 254 48 254L-8 254C-14 244 -14 228 -10 216Z";
  return (
    <g>
      {/* churidar legs and jutti */}
      <path d="M-58 150L-26 150L-28 222L-52 222Z" fill={R.shade} />
      <path d="M-6 150L22 150L20 222L-4 222Z" fill={R.cloth} />
      <path d={JUTTI} transform="translate(-46 -2)" fill={shoe} opacity={0.85} />
      <path d={JUTTI} fill={shoe} />
      <path d="M-6 234L50 238" stroke="#E8B24A" strokeWidth={2} opacity={0.6} />
      <clipPath id={`${id}-rc`}>
        <path d={d} />
      </clipPath>
      <path d={d} fill={R.cloth} />
      <g clipPath={`url(#${id}-rc)`}>
        <path d="M-92 0C-50 60 -44 140 -50 230L-100 230Z" fill={R.shade} opacity={0.85} />
        {[-30, -6, 18, 42, 66].map((x, i) => (
          <path key={x} d={`M${x * 0.5} 8C${x * 0.8} 80 ${x * 1.1} 150 ${x * 1.25 + (i % 2 ? 4 : -4)} 222`} stroke={R.shade} strokeWidth={i % 2 ? 6 : 3} fill="none" opacity={0.6} />
        ))}
        {R.open ? <path d="M36 4C44 80 56 150 64 222" stroke={R.trim} strokeWidth={5} fill="none" /> : null}
        <path d="M-92 204C-40 218 40 218 96 204" stroke={R.trim} strokeWidth={8} fill="none" />
      </g>
      {/* sash (kamarkasa / patka), knotted with a hanging end */}
      {R.sash ? (
        <g>
          <path d="M-52 -12L56 -12L57 14L-53 14Z" fill={R.sash} />
          <path d="M-52 -4L56 -4M-52 6L56 6" stroke="#000000" strokeWidth={1.5} opacity={0.18} />
          <path d="M24 10C22 50 26 90 20 128L38 130C42 92 40 50 40 10Z" fill={R.sash} />
          <path d="M20 122L38 124" stroke={R.trim} strokeWidth={4} />
        </g>
      ) : null}
    </g>
  );
};

const Lower: React.FC<{ L: Look; id: string }> = ({ L, id }) => {
  if (L.robe) return <RobeLower L={L} id={id} />;
  const [cloth, shade, border] = L.dhoti;
  const d = "M-48 2L52 2C58 70 64 140 66 214C30 224 -30 224 -62 214C-60 140 -56 70 -48 2Z";
  return (
    <g>
      {/* feet */}
      <path d={FOOT} transform="translate(-46 -2)" fill={L.skinShade} />
      <path d={FOOT} fill={L.skin} />
      {L.anklet ? (
        <g>
          <path d="M-10 222Q4 230 18 222" stroke="url(#mGold)" strokeWidth={5} fill="none" />
          <path d="M-56 220Q-42 228 -28 220" stroke="url(#mGold)" strokeWidth={4} fill="none" opacity={0.8} />
        </g>
      ) : null}
      <clipPath id={`${id}-lc`}>
        <path d={d} />
      </clipPath>
      <path d={d} fill={cloth} />
      <g clipPath={`url(#${id}-lc)`}>
        <path d="M-70 0C-40 60 -30 140 -36 230L-80 230Z" fill={shade} opacity={0.8} />
        {/* front pleats (kachha) */}
        <path d="M6 8C10 70 4 140 14 222L34 222C26 150 30 70 22 8Z" fill={shade} opacity={0.55} />
        <path d="M12 10C16 80 10 150 20 222M22 10C26 80 22 150 30 222" stroke={border} strokeWidth={2} opacity={0.55} fill="none" />
        <path d="M-70 204C-30 216 30 216 70 204" stroke={border} strokeWidth={9} fill="none" />
        <path d="M-70 192C-30 204 30 204 70 192" stroke={border} strokeWidth={2} fill="none" opacity={0.7} />
      </g>
      {/* waist band */}
      <path d="M-50 -10L54 -10L55 12L-51 12Z" fill="url(#mGold)" />
      <path d="M-50 -3L54 -3" stroke={P.goldDeep} strokeWidth={1.5} opacity={0.6} />
      {[-30, -6, 18, 40].map((x) => (
        <Gem key={x} x={x} y={1} r={3.4} c={cloth === P.royalBlue ? "#2E7BFF" : "#C8102E"} />
      ))}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Head                                                                */
/* ------------------------------------------------------------------ */

const FACE =
  "M-40 -96C-42 -130 -16 -152 14 -152C44 -152 62 -130 62 -98C62 -84 61 -74 60 -64C58 -40 50 -18 30 -8C18 -2 2 -2 -10 -8C-26 -16 -38 -34 -40 -56Z";

const Eye: React.FC<{ cx: number; cy: number; s: number; L: Look; p: Pose; far?: boolean }> = ({ cx, cy, s, L, p, far }) => {
  const open = 1 - p.blink;
  const ix = p.lookX * 3.6;
  const iy = p.lookY * 2.4;
  const lid = L.lid + (p.browTilt > 0 ? Math.min(0.25, p.browTilt / 60) : 0);
  const almond = "M-14 0C-9 -8 8 -9 14 -2C8 5 -8 6 -14 0Z";
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s * (far ? 0.88 : 1)} ${s})`}>
      {p.glow > 0.01 ? <ellipse rx={20} ry={12} fill={L.glowColor} opacity={0.55 * p.glow} filter="url(#mBlur8)" /> : null}
      <g transform={`scale(1 ${Math.max(0.06, open)})`}>
        <path d={almond} fill={L.sclera} />
        <clipPath id={`eye-${cx}-${L.iris}`}>
          <path d={almond} />
        </clipPath>
        <g clipPath={`url(#eye-${cx}-${L.iris})`}>
          <circle cx={ix} cy={iy} r={6.6} fill={p.glow > 0.3 ? mix(L.iris, L.glowColor, p.glow) : L.iris} />
          {L.slit ? <ellipse cx={ix} cy={iy} rx={1.5} ry={5.6} fill="#120A06" /> : <circle cx={ix} cy={iy} r={3.1} fill="#0B0705" />}
          <circle cx={ix + 2.2} cy={iy - 2.4} r={1.6} fill="#FFFFFF" opacity={0.9} />
          {/* heavy upper lid */}
          <rect x={-16} y={-12} width={32} height={6 + lid * 9} fill={L.skinShade} />
        </g>
      </g>
      {/* lash line (kajal) */}
      <path d={open > 0.3 ? "M-15 0C-9 -9 9 -10 15 -2" : "M-14 0C-6 4 6 4 14 0"} stroke="#140A08" strokeWidth={3.2} fill="none" strokeLinecap="round" />
    </g>
  );
};

const Brow: React.FC<{ x: number; y: number; L: Look; p: Pose; far?: boolean }> = ({ x, y, L, p, far }) => {
  const tilt = (far ? -1 : 1) * p.browTilt;
  const lift = -p.brow * 6;
  const w = far ? 12 : 15;
  const d = L.hair === "jata" ? `M${-w} 2C${-w / 2} -6 ${w / 2} -6 ${w} -1` : `M${-w} 2C${-w / 2} -5 ${w / 2} -5 ${w} 0`;
  return (
    <path
      d={d}
      transform={`translate(${x} ${y + lift}) rotate(${tilt})`}
      stroke={L.brow}
      strokeWidth={L.browW}
      strokeLinecap="round"
      fill="none"
    />
  );
};

const Mouth: React.FC<{ L: Look; p: Pose }> = ({ L, p }) => {
  const o = Math.max(0, p.talk);
  const sm = p.smile * 4;
  if (o < 0.06) {
    const fr = sm * (L.slit ? 1.7 : 1);
    const bk = sm * (L.slit ? 0.15 : 1);
    return <path d={`M10 ${-36 - bk}Q24 ${-33 + sm * 0.6} 37 ${-37 - fr}`} stroke={L.skinLine} strokeWidth={2.8} fill="none" strokeLinecap="round" />;
  }
  const dy = 3 + 15 * o;
  return (
    <g>
      <path d={`M10 ${-37 - sm}Q24 ${-41} 37 ${-37 - sm}Q24 ${-37 + dy * 1.4} 10 ${-37 - sm}Z`} fill="#3A0E12" />
      <path d={`M13 ${-37.5 - sm * 0.7}Q24 ${-40} 34 ${-37.5 - sm * 0.7}L33 ${-35}Q24 ${-37} 14 ${-35}Z`} fill="#F6F1E6" opacity={o > 0.25 ? 1 : 0} />
      <ellipse cx={24} cy={-37 + dy} rx={6} ry={Math.min(4, dy * 0.3)} fill="#C2434A" opacity={0.8} />
    </g>
  );
};

const Hair: React.FC<{ L: Look; back: boolean; t: number; id: string }> = ({ L, back, t, id }) => {
  const sway = wob(`${id}-hair`, t / 50) * 3;
  if (L.hair === "covered") {
    // hair kept under the turban: only a sideburn shows in front of the ear
    return back ? null : <path d="M-40 -104C-44 -90 -43 -78 -38 -66L-32 -68C-34 -80 -33 -92 -30 -104Z" fill={L.hairColor} />;
  }
  if (L.hair === "royal") {
    return back ? (
      <path d={`M-44 -120C-74 -70 ${-82 + sway} 20 ${-64 + sway} 92C-46 100 -26 84 -18 54C-30 0 -28 -60 -8 -118Z`} fill={L.hairColor} />
    ) : (
      <g>
        <path d="M-40 -100C-40 -136 -10 -154 18 -152C44 -150 60 -134 62 -112C46 -126 22 -130 -2 -126C-18 -122 -30 -112 -40 -100Z" fill={L.hairColor} />
        <path d="M-40 -100C-44 -88 -43 -78 -38 -70L-33 -72C-35 -82 -33 -92 -28 -100Z" fill={L.hairColor} />
      </g>
    );
  }
  if (L.hair === "wild") {
    return back ? (
      <g>
        <path d={`M-40 -126C-92 -100 ${-104 + sway} -10 ${-82 + sway} 80C-60 92 -40 70 -30 40C-54 20 -50 -60 -10 -124Z`} fill={L.hairColor} />
        <path d={`M-50 -100C-80 -60 ${-86 + sway} 0 ${-74 + sway} 60`} stroke="#B7A8E6" strokeWidth={3} fill="none" opacity={0.55} />
      </g>
    ) : (
      <path d="M-42 -96C-50 -140 -10 -162 22 -156C48 -152 64 -132 64 -110C50 -124 30 -132 6 -128C-14 -124 -30 -114 -42 -96Z" fill={L.hairColor} />
    );
  }
  // jata: matted locks piled high, wrapped with rudraksha
  return back ? (
    <g>
      <path d={`M-38 -110C-70 -60 ${-74 + sway} 10 ${-58 + sway} 70C-44 74 -30 60 -24 40C-34 -10 -30 -70 -14 -116Z`} fill={L.hairShade} />
      <path d={`M-48 -80C-62 -40 ${-64 + sway} 10 ${-54 + sway} 50`} stroke={L.hairColor} strokeWidth={5} fill="none" opacity={0.7} />
    </g>
  ) : (
    <g>
      {/* matted locks (jata) coiled high: lumpy rope silhouette, not a smooth dome */}
      <path d="M-30 -138C-40 -170 -32 -198 -22 -212C-32 -230 -18 -252 0 -254C6 -270 28 -270 31 -252C48 -248 56 -228 45 -212C57 -194 56 -164 50 -140Z" fill={L.hairColor} />
      {["M-24 -146C-30 -180 -22 -210 -10 -240", "M-6 -142C-10 -182 -4 -222 6 -258", "M14 -142C14 -182 18 -222 24 -260", "M34 -144C42 -176 42 -208 36 -240"].map((d) => (
        <path key={d} d={d} stroke={L.hairShade} strokeWidth={5.5} fill="none" strokeLinecap="round" opacity={0.85} />
      ))}
      <path d="M-30 -164C-4 -154 28 -154 52 -166" stroke="#7A6A55" strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M-28 -200C-6 -190 26 -190 48 -202" stroke="#5A2E1A" strokeWidth={8} strokeDasharray="0.1 10" strokeLinecap="round" fill="none" />
      <circle cx={12} cy={-266} r={11} fill={L.hairColor} />
      <path d="M4 -272C10 -280 20 -280 22 -270" stroke={L.hairShade} strokeWidth={3} fill="none" />
      {/* crescent of Shiva-bhakti on the jata */}
      <path d="M30 -226C42 -230 48 -220 44 -208C42 -218 36 -224 30 -226Z" fill="#FFF6D8" />
      <path d="M-40 -100C-40 -136 -14 -150 14 -150C42 -150 60 -134 62 -112C46 -122 22 -126 -2 -122C-18 -120 -30 -112 -40 -100Z" fill={L.hairColor} />
    </g>
  );
};

const Crown: React.FC<{ L: Look; t: number }> = ({ L, t }) => {
  const gl = 0.6 + 0.4 * Math.sin(t / 9);
  if (L.crown === "kirita") {
    // Indra's tall kirita-mukuta: banded cylinder, tiers, finial, makara side-fans
    return (
      <g>
        {/* ornate lotus-petal side plates (not horns) */}
        {[-1, 1].map((sd) => (
          <g key={sd} transform={`translate(${sd < 0 ? -38 : 66} -160) scale(${sd} 1)`}>
            <path d="M0 14C-10 4 -14 -14 -8 -30C-2 -22 4 -18 10 -16C8 -6 6 6 0 14Z" fill="url(#mGoldDark)" />
            <path d="M-2 10C-8 2 -10 -10 -6 -22" stroke="#FFF0BF" strokeWidth={1.8} fill="none" opacity={0.7} />
            <circle cx={2} cy={-2} r={3.4} fill="#D9283A" />
          </g>
        ))}
        <path d="M-34 -146L62 -146L52 -262L-22 -262Z" fill="url(#mGold)" />
        <path d="M-30 -186L58 -186M-26 -222L55 -222" stroke={P.goldDeep} strokeWidth={3} />
        <path d="M-28 -196Q14 -214 56 -196M-24 -232Q14 -248 54 -232" stroke="#FFF0BF" strokeWidth={2.2} fill="none" opacity={0.8} />
        <path d="M-22 -262C-10 -300 4 -318 15 -334C26 -318 40 -300 52 -262Z" fill="url(#mGold)" />
        <path d="M15 -334L15 -350" stroke={P.gold} strokeWidth={4} strokeLinecap="round" />
        <circle cx={15} cy={-354} r={6} fill="#FFF0BF" opacity={gl} />
        <path d="M-40 -136Q12 -128 66 -136L66 -150Q12 -142 -40 -150Z" fill="url(#mGold)" />
        {[-24, -2, 20, 42].map((x, i) => (
          <Gem key={x} x={x} y={-142} r={i % 2 ? 4 : 5} c={i % 2 ? "#D9283A" : "#2E7BFF"} />
        ))}
        <Gem x={15} y={-206} r={9} c="#2E7BFF" />
        <Gem x={15} y={-286} r={6} c="#D9283A" />
        {/* pearl drops on the band */}
        {[-30, -10, 10, 30, 50].map((x) => (
          <circle key={x} cx={x} cy={-128} r={3.4} fill="#FFF9EE" />
        ))}
      </g>
    );
  }
  if (L.crown === "naga") {
    // Swarbhanu: dark-gold crown crowned by a three-hooded serpent (foreshadows Rahu)
    return (
      <g>
        <path d="M-36 -146L64 -146L56 -206L-26 -206Z" fill="url(#mGoldDark)" />
        <path d="M-30 -176L60 -176" stroke="#3A2408" strokeWidth={3} />
        {[
          { x: -22, y: -222, s: 0.92, r: -16 },
          { x: 52, y: -222, s: 0.92, r: 16 },
          { x: 15, y: -246, s: 1.2, r: 0 },
        ].map((h, i) => (
          <g key={i} transform={`translate(${h.x} ${h.y}) rotate(${h.r}) scale(${h.s})`}>
            {/* cobra hood */}
            <path d="M-7 42C-9 22 -27 8 -29 -12C-31 -30 -16 -42 0 -42C16 -42 31 -30 29 -12C27 8 9 22 7 42Z" fill="url(#mGoldDark)" />
            <path d="M-3 38C-4 20 -14 8 -15 -10C-15 -22 -8 -31 0 -31C8 -31 15 -22 15 -10C14 8 4 20 3 38Z" fill="#2A1B44" opacity={0.9} />
            {[-20, -10, 0, 10, 20, 30].map((y) => (
              <path key={y} d={`M-${12 - Math.abs(y) * 0.12} ${y}Q0 ${y + 3} ${12 - Math.abs(y) * 0.12} ${y}`} stroke={P.gold} strokeWidth={1.4} fill="none" opacity={0.55} />
            ))}
            {/* head */}
            <path d="M-9 -38C-10 -50 -5 -57 0 -57C5 -57 10 -50 9 -38C5 -34 -5 -34 -9 -38Z" fill="url(#mGold)" />
            <circle cx={-4} cy={-47} r={2.2} fill="#FFC23D" opacity={gl} />
            <circle cx={4} cy={-47} r={2.2} fill="#FFC23D" opacity={gl} />
          </g>
        ))}
        <path d="M-40 -134Q12 -126 68 -134L68 -148Q12 -140 -40 -148Z" fill="url(#mGold)" />
        <Gem x={14} y={-160} r={8} c="#7B2BD6" />
      </g>
    );
  }
  if (L.crown === "asura") {
    // asura war-crown: broad, spiked, crimson gems
    return (
      <g>
        <path d="M-40 -146L68 -146L76 -196L50 -176L40 -226L14 -186L-12 -226L-22 -176L-48 -196Z" fill="url(#mGoldDark)" />
        <path d="M-40 -134Q14 -126 70 -134L70 -150Q14 -142 -40 -150Z" fill="url(#mGold)" />
        <Gem x={14} y={-166} r={8} c="#C8102E" />
        {[-24, 52].map((x) => (
          <Gem key={x} x={x} y={-160} r={4.5} c="#C8102E" />
        ))}
      </g>
    );
  }
  if (L.crown === "surya") {
    // Surya: sun-disc crown, rays pulse gently
    return (
      <g>
        <g opacity={0.8 + 0.2 * gl}>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const pt = (r: number, d: number) => `${14 + Math.cos(a + d) * r} ${-232 + Math.sin(a + d) * r}`;
            return <path key={i} d={`M${pt(34, -0.14)}L${pt(58, 0)}L${pt(34, 0.14)}Z`} fill="#FFB23D" />;
          })}
        </g>
        <circle cx={14} cy={-232} r={36} fill="url(#mGold)" />
        <circle cx={14} cy={-232} r={26} fill="#F58A1F" />
        <circle cx={14} cy={-232} r={26} fill="url(#mGem)" />
        <path d="M-32 -146L60 -146L52 -198L-24 -198Z" fill="url(#mGold)" />
        <path d="M-28 -172L56 -172" stroke={P.goldDeep} strokeWidth={2.5} />
        <path d="M-40 -134Q12 -126 66 -134L66 -150Q12 -142 -40 -150Z" fill="url(#mGold)" />
        <Gem x={14} y={-186} r={7} c="#D9283A" />
      </g>
    );
  }
  if (L.crown === "chandra") {
    // Chandra: slim mukut carrying a glowing crescent moon, horns up
    return (
      <g>
        <path d="M-30 -146L58 -146L48 -210L-20 -210Z" fill="url(#mGold)" />
        <path d="M-26 -178L54 -178" stroke={P.goldDeep} strokeWidth={2.5} />
        <path d="M-14 -240A28 28 0 0 0 42 -240A40 40 0 0 1 -14 -240Z" fill="#EEF3FF" stroke="#B9C6DE" strokeWidth={2} filter="url(#mGlow)" opacity={0.85 + 0.15 * gl} />
        <path d="M-38 -134Q12 -126 64 -134L64 -148Q12 -140 -38 -148Z" fill="url(#mGold)" />
        <Gem x={14} y={-192} r={6} c="#9FC8FF" />
        {[-24, -6, 12, 30, 48].map((x) => (
          <circle key={x} cx={x} cy={-128} r={3} fill="#FFFFFF" />
        ))}
      </g>
    );
  }
  if (L.crown === "agni") {
    // Agni: a crown of living flame that flickers
    const fl = 1 + 0.05 * Math.sin(t / 2.6) + 0.03 * Math.sin(t / 1.3);
    return (
      <g>
        <g transform={`translate(14 -146) scale(1 ${fl}) translate(-14 146)`}>
          <path d="M-36 -146C-42 -176 -26 -192 -22 -216C-14 -198 -8 -192 -4 -208C0 -234 12 -250 14 -280C18 -250 30 -234 32 -208C36 -192 42 -198 50 -216C54 -192 70 -176 64 -146Z" fill="url(#mFlame)" />
          <path d="M-18 -146C-20 -170 -8 -184 -4 -196C2 -186 6 -184 8 -196C10 -214 14 -224 14 -240C16 -224 20 -214 22 -196C24 -184 28 -186 32 -196C36 -184 48 -170 46 -146Z" fill="#FFF3B0" opacity={0.75} />
        </g>
        <path d="M-40 -134Q12 -126 66 -134L66 -150Q12 -142 -40 -150Z" fill="url(#mGold)" />
        <Gem x={14} y={-142} r={6} c="#D9283A" />
      </g>
    );
  }
  if (L.crown === "vayu") {
    // Vayu: low mukut with wind-swept plumes that sway
    const sw = Math.sin(t / 11) * 4;
    return (
      <g>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`rotate(${sw - i * 9} 14 -196)`}>
            <path
              d={`M14 -196C${4 - i * 6} ${-232 - i * 6} ${-24 - i * 10} ${-254 - i * 4} ${-52 - i * 8} ${-258 - i * 2}C${-30 - i * 8} ${-242 - i * 2} ${-12 - i * 4} ${-224 - i * 2} -2 -198Z`}
              fill={i === 1 ? "#E8F4FF" : "#7FB8E6"}
            />
            <path d={`M14 -196C${2 - i * 6} ${-228 - i * 6} ${-24 - i * 10} ${-250 - i * 4} ${-50 - i * 8} ${-257 - i * 2}`} stroke={P.gold} strokeWidth={1.6} fill="none" opacity={0.8} />
          </g>
        ))}
        <path d="M-30 -146L58 -146L50 -196L-22 -196Z" fill="url(#mGold)" />
        <path d="M-38 -134Q12 -126 64 -134L64 -148Q12 -140 -38 -148Z" fill="url(#mGold)" />
        <Gem x={14} y={-172} r={6} c="#2E7BFF" />
      </g>
    );
  }
  if (L.crown === "horned") {
    // asura general: iron helm with curved ivory horns
    return (
      <g>
        {[-1, 1].map((sd) => (
          <g key={sd} transform={sd < 0 ? undefined : "translate(28 0) scale(-1 1)"}>
            <path d="M-26 -184C-60 -192 -78 -230 -66 -270C-58 -240 -44 -216 -18 -202Z" fill="#EADFC8" stroke="#8E7F64" strokeWidth={2} />
            <path d="M-40 -196C-56 -206 -64 -226 -62 -246" stroke="#B8A888" strokeWidth={2} fill="none" />
          </g>
        ))}
        <path d="M-38 -146C-40 -196 -12 -224 14 -226C40 -224 68 -196 66 -146Z" fill="url(#mIron)" />
        <path d="M14 -226L14 -150" stroke="#8A919C" strokeWidth={3} opacity={0.6} />
        <path d="M-40 -134Q14 -126 68 -134L68 -150Q14 -142 -40 -150Z" fill="url(#mGoldDark)" />
        <Gem x={14} y={-168} r={7} c="#E07A10" />
      </g>
    );
  }
  if (L.crown === "tusk") {
    // asura general: tall dark-gold crown of three blades with emeralds (its silhouette is a single
    // central peak, unlike Bali's twin peaks or the horned helm)
    return (
      <g>
        <path d="M-36 -146L64 -146L60 -186L50 -232L36 -190L14 -268L-8 -190L-22 -232L-32 -186Z" fill="url(#mGoldDark)" />
        <path d="M14 -262L14 -196M-20 -226L-24 -190M48 -226L52 -190" stroke="#FFF0BF" strokeWidth={2} opacity={0.6} />
        <path d="M-40 -134Q14 -126 68 -134L68 -150Q14 -142 -40 -150Z" fill="url(#mGold)" />
        <Gem x={14} y={-168} r={8} c="#1E9E5A" />
        {[-20, 48].map((x) => (
          <Gem key={x} x={x} y={-160} r={4} c="#1E9E5A" />
        ))}
      </g>
    );
  }
  if (L.crown === "dastar" || L.crown === "pagri" || L.crown === "safa") {
    const [c, sh] = L.turban ?? ["#F4EEDF", "#CFC4AA"];
    const dastar = L.crown === "dastar";
    const pagri = L.crown === "pagri";
    // side profile facing +x; the face top is ~y -150, forehead ~y -112
    const shape = dastar
      ? "M-50 -90C-68 -128 -60 -180 -20 -206C14 -226 52 -222 72 -196C80 -170 76 -136 66 -108C44 -118 22 -120 4 -114C-14 -108 -34 -98 -50 -90Z"
      : pagri
        ? "M-54 -96C-74 -126 -66 -176 -24 -196C14 -212 62 -204 80 -172C90 -152 84 -124 72 -108C46 -118 20 -120 0 -114C-20 -108 -38 -100 -54 -96Z"
        : "M-50 -96C-62 -124 -56 -164 -18 -178C16 -190 58 -184 72 -158C80 -142 76 -122 68 -108C44 -118 20 -120 0 -114C-18 -108 -34 -102 -50 -96Z";
    const folds = dastar
      ? ["M-52 -98C-20 -110 30 -130 74 -150", "M-60 -122C-24 -134 26 -156 78 -178", "M-60 -148C-26 -162 16 -182 66 -206", "M-48 -174C-20 -188 10 -204 40 -220", "M66 -108C58 -132 62 -160 76 -186"]
      : ["M-58 -110C-20 -122 30 -126 74 -118", "M-64 -134C-20 -144 34 -146 82 -138", "M-62 -158C-20 -168 34 -170 82 -160", "M-50 -180C-14 -190 30 -192 70 -184"];
    const cid = `tb-${L.crown}-${c.slice(1)}-${sh.slice(1)}`;
    return (
      <g>
        <clipPath id={cid}>
          <path d={shape} />
        </clipPath>
        {pagri ? <path d={`M-58 -112C-76 -104 -84 -86 ${-82 + Math.sin(t / 13) * 2} -62L-70 -64C-70 -80 -64 -96 -52 -104Z`} fill={sh} /> : null}
        <path d={shape} fill={c} />
        <path d={shape} fill="url(#mGem)" opacity={0.25} />
        <g clipPath={`url(#${cid})`}>
          <path d="M-50 -92C-60 -130 -52 -170 -24 -194C-40 -160 -44 -126 -36 -98Z" fill={sh} opacity={0.75} />
          {folds.map((fd, i) => <path key={i} d={fd} stroke={sh} strokeWidth={i === folds.length - 1 && dastar ? 6 : 5} fill="none" opacity={0.9} strokeLinecap="round" />)}
          {folds.map((fd, i) => <path key={`h${i}`} d={fd} stroke="#FFFFFF" strokeWidth={2} fill="none" opacity={0.3} transform="translate(1 -6)" />)}
          <path d="M-70 -80C-60 -150 -30 -200 0 -230L-80 -230Z" fill={sh} opacity={0.35} />
        </g>
        {L.plume === "kalgi" ? (
          <g transform="translate(46 -176)">
            <path d={`M0 0C-6 -40 -24 -80 ${-52 + Math.sin(t / 11) * 4} -112C-34 -78 -16 -40 6 -4Z`} fill="#FFFFFF" stroke="#D8D2C6" strokeWidth={1.5} />
            <path d={`M0 -8C-10 -40 -24 -72 ${-46 + Math.sin(t / 11) * 4} -104`} stroke="#C8BFB0" strokeWidth={1.4} fill="none" />
            <ellipse cx={2} cy={4} rx={9} ry={16} fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={1.4} />
            <Gem x={2} y={2} r={5} c="#C8102E" />
            {[-8, 0, 8].map((y) => <circle key={y} cx={2 + (y === 0 ? 0 : 0)} cy={y + 22} r={2.6} fill="#FFF9EE" />)}
          </g>
        ) : null}
        {L.plume === "sarpech" ? (
          <g transform="translate(58 -156)">
            <path d={`M0 0C4 -30 -4 -56 ${-14 + Math.sin(t / 10) * 3} -76`} stroke="#F4EEDF" strokeWidth={5} fill="none" strokeLinecap="round" />
            <path d="M-6 -10L6 -10L8 22L-8 22Z" fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={1.2} />
            <Gem x={0} y={4} r={5.5} c="#1E8A4A" />
            {[-4, 4].map((x) => <circle key={x} cx={x} cy={28} r={2.6} fill="#FFF9EE" />)}
          </g>
        ) : null}
        {L.crown === "safa" ? null : <path d="M-50 -92C-34 -100 -14 -110 4 -116C22 -122 44 -120 66 -110" stroke={sh} strokeWidth={3} fill="none" opacity={0.7} />}
      </g>
    );
  }
  if (L.crown === "iron") {
    // asura general: flat battlemented iron crown, gold rivets, one amber gem
    return (
      <g>
        <path d="M-44 -146L72 -146L66 -196L52 -196L52 -210L36 -210L36 -196L22 -196L22 -214L6 -214L6 -196L-8 -196L-8 -210L-24 -210L-24 -196L-38 -196Z" fill="url(#mIron)" />
        {[-30, -14, 2, 18, 34, 50].map((x) => (
          <circle key={x} cx={x + 4} cy={-182} r={2.6} fill="#C9A24A" />
        ))}
        <path d="M-46 -134Q14 -126 74 -134L74 -150Q14 -142 -46 -150Z" fill="url(#mGoldDark)" />
        <Gem x={14} y={-164} r={9} c="#E0A020" />
      </g>
    );
  }
  // deva: simple tall mukut
  return (
    <g>
      <path d="M-30 -146L58 -146L46 -226L14 -260L-18 -226Z" fill="url(#mGold)" />
      <path d="M-26 -186L54 -186" stroke={P.goldDeep} strokeWidth={2.5} />
      <path d="M-38 -134Q12 -126 64 -134L64 -148Q12 -140 -38 -148Z" fill="url(#mGold)" />
      <Gem x={14} y={-206} r={6} c="#2E7BFF" />
    </g>
  );
};

const Tilak: React.FC<{ L: Look }> = ({ L }) => {
  if (L.tilak === "tripundra") {
    return (
      <g stroke="#F4F1EA" strokeWidth={3.2} strokeLinecap="round" opacity={0.95}>
        <path d="M-8 -118Q22 -122 52 -116" />
        <path d="M-8 -110Q22 -114 52 -108" />
        <path d="M-6 -102Q22 -106 50 -100" />
        <circle cx={22} cy={-108} r={3.2} fill="#C8102E" stroke="none" />
      </g>
    );
  }
  if (L.tilak === "urdhva") {
    return (
      <g>
        <path d="M17 -98L14 -126M27 -98L30 -126" stroke="#FFF6E0" strokeWidth={3} strokeLinecap="round" />
        <path d="M22 -100L22 -122" stroke="#D9283A" strokeWidth={3} strokeLinecap="round" />
      </g>
    );
  }
  if (L.tilak === "dot") return <circle cx={22} cy={-108} r={4} fill="#C8102E" />;
  return null;
};

const Beard: React.FC<{ L: Look; t: number; id: string }> = ({ L, t, id }) => {
  const c = L.beardColor ?? L.hairColor;
  const sw = wob(`${id}-beard`, t / 45) * 3;
  return (
    <g>
      {L.beard === "sage" ? (
        <g>
          <path
            d={`M-30 -50C-32 -12 -18 30 2 78C10 100 ${18 + sw} 128 ${26 + sw} 148C30 122 40 94 52 60C64 26 64 -12 58 -44C50 -26 40 -20 30 -20C14 -20 2 -26 -6 -36C-14 -44 -22 -48 -30 -50Z`}
            fill={c}
          />
          <path d={`M4 -10C8 30 ${14 + sw} 80 ${22 + sw} 132M28 -14C30 30 32 70 ${30 + sw * 0.5} 110M46 -24C48 10 46 40 40 72`} stroke="#BFB7A8" strokeWidth={2.4} fill="none" opacity={0.7} />
        </g>
      ) : null}
      {L.beard === "full" ? (
        <g>
          <path
            d={`M-36 -74C-42 -30 -30 20 -6 56C8 76 ${20 + sw} 98 ${30 + sw} 112C38 92 52 70 60 40C68 8 66 -30 60 -62C52 -36 40 -24 26 -22C10 -22 -4 -30 -14 -44C-22 -56 -30 -66 -36 -74Z`}
            fill={c}
          />
          <path d={`M-10 -10C-4 30 ${10 + sw} 70 ${22 + sw} 100M12 -14C16 30 ${22 + sw * 0.6} 70 ${28 + sw * 0.6} 96M38 -20C42 16 42 50 36 80M-26 -40C-26 0 -16 30 -4 50`} stroke={L.beardColor && L.beardColor > "#888888" ? "#9E968A" : "#3A2C22"} strokeWidth={2.2} fill="none" opacity={0.55} />
        </g>
      ) : null}
      {L.beard === "goatee" ? <path d="M16 -22C18 -10 22 -2 27 4C32 -2 36 -10 36 -22C29 -17 23 -17 16 -22Z" fill={c} /> : null}
      {L.moustache === "curl" ? (
        <path d="M24 -47C17 -50 8 -48 2 -43C-3 -39 -4 -33 0 -32C1 -37 7 -41 14 -41C18 -41 21 -43 24 -43C27 -43 31 -41 35 -41C41 -41 46 -37 46 -32C51 -34 51 -39 47 -44C42 -49 32 -50 24 -47Z" fill={c} />
      ) : null}
      {L.moustache === "thin" ? <path d="M24 -46C17 -48 8 -45 3 -38C9 -42 16 -43 24 -42C32 -43 39 -42 45 -38C40 -45 31 -48 24 -46Z" fill={c} /> : null}
      {L.moustache === "sage" ? (
        <path d="M24 -48C12 -50 0 -44 -6 -30C2 -36 12 -38 18 -36C21 -38 27 -38 30 -36C36 -38 46 -36 52 -28C48 -42 36 -50 24 -48Z" fill={c} />
      ) : null}
    </g>
  );
};

const Earring: React.FC<{ L: Look; t: number }> = ({ L, t }) => {
  const sw = Math.sin(t / 14) * 6;
  if (L.earring === "none") return null;
  if (L.earring === "rudraksha") return <circle cx={-40} cy={-52} r={6} fill="#6B3A22" />;
  if (L.earring === "naga") {
    return <path d="M-40 -60C-50 -48 -46 -34 -38 -30C-42 -38 -42 -48 -36 -56Z" fill="url(#mGold)" transform={`rotate(${sw} -40 -60)`} />;
  }
  return (
    <g transform={`rotate(${sw} -40 -62)`}>
      <circle cx={-40} cy={-46} r={11} fill="none" stroke="url(#mGold)" strokeWidth={4.5} />
      <circle cx={-40} cy={-34} r={4} fill="#D9283A" />
    </g>
  );
};

const Head: React.FC<{ L: Look; id: string; p: Pose; t: number }> = ({ L, id, p, t }) => (
  <g>
    {/* ear */}
    <ellipse cx={-38} cy={-76} rx={10} ry={17} fill={L.skinShade} />
    <path d="M-40 -86C-34 -82 -34 -70 -40 -66" stroke={L.skinLine} strokeWidth={2} fill="none" />
    <Earring L={L} t={t} />
    {/* face */}
    <clipPath id={`${id}-fc`}>
      <path d={FACE} />
    </clipPath>
    <linearGradient id={`${id}-fg`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={L.skinShade} stopOpacity={0.85} />
      <stop offset="0.42" stopColor={L.skinShade} stopOpacity={0} />
      <stop offset="0.86" stopColor={L.rim} stopOpacity={0} />
      <stop offset="1" stopColor={L.rim} stopOpacity={0.5} />
    </linearGradient>
    <path d={FACE} fill={L.skin} />
    <g clipPath={`url(#${id}-fc)`}>
      <rect x={-50} y={-160} width={116} height={160} fill={`url(#${id}-fg)`} />
      {/* cel shade crescent along the back cheek and under the jaw */}
      <path d="M-42 -100C-44 -130 -26 -150 -4 -152C-22 -136 -28 -110 -26 -80C-24 -50 -14 -26 6 -8C-16 -10 -36 -28 -40 -56Z" fill={L.skinShade} opacity={0.55} />
      <path d="M-14 -10C4 -2 22 -2 34 -8C26 -16 6 -18 -14 -10Z" fill={L.skinShade} opacity={0.4} />
      <ellipse cx={46} cy={-56} rx={10} ry={6} fill="#E0685A" opacity={0.12} />
    </g>
    <Tilak L={L} />
    <Eye cx={6} cy={-82} s={1} L={L} p={p} />
    <Eye cx={40} cy={-82} s={0.92} L={L} p={p} far />
    <Brow x={6} y={-98} L={L} p={p} />
    <Brow x={42} y={-98} L={L} p={p} far />
    {/* nose */}
    <path d="M26 -84C29 -72 35 -63 36 -57C32 -52 26 -53 22 -56" stroke={L.skinLine} strokeWidth={2.8} fill="none" strokeLinecap="round" />
    <Mouth L={L} p={p} />
    <Beard L={L} t={t} id={id} />
    <Hair L={L} back={false} t={t} id={id} />
    {L.crown ? <Crown L={L} t={t} /> : null}
  </g>
);

/* ------------------------------------------------------------------ */
/* Puppet                                                              */
/* ------------------------------------------------------------------ */

export type Place = { x: number; y: number; s: number; facing: number };


type V2 = [number, number];
const rotP = (q: V2, deg: number): V2 => {
  const a = (deg * Math.PI) / 180;
  return [q[0] * Math.cos(a) - q[1] * Math.sin(a), q[0] * Math.sin(a) + q[1] * Math.cos(a)];
};
const addP = (a: V2, b: V2): V2 => [a[0] + b[0], a[1] + b[1]];
/** World position of the prop origin held in a hand (front or back), for hand-offs between characters. */
export const handToWorld = (p: Pose, at: Place, front = true): V2 => {
  const sh = front ? SH_F : SH_B;
  let q: V2 = [2, 16];
  q = addP(rotP(q, -(front ? p.wF : p.wB)), [0, FA]);
  q = addP(rotP(q, -(front ? p.eF : p.eB)), [0, UA]);
  q = addP(rotP(q, -(front ? p.sF : p.sB)), sh);
  q = rotP(q, p.lean + p.sway);
  return [at.x + at.facing * at.s * q[0], at.y + p.bob + at.s * q[1]];
};

/** Rotation that keeps a prop in the front hand upright. */
export const propCounter = (p: Pose): number => p.wF + p.eF + p.sF - p.lean - p.sway;

export const Puppet: React.FC<{
  id: string;
  who: Who;
  at: Place;
  p: Pose;
  t: number;
  prop?: React.ReactNode;
  backProp?: React.ReactNode;
  upright?: boolean;
  /** Recolour (e.g. Swarbhanu disguised as a deva): 0..1 toward a warm deva skin. */
  disguise?: number;
  /** Colour drained by the curse: 0..1. */
  drain?: number;
  noLegs?: boolean;
}> = ({ id, who, at, p, t, prop, backProp, upright = true, disguise = 0, drain = 0, noLegs }) => {
  let L = LOOKS[who];
  if (disguise > 0) {
    const D = LOOKS.deva;
    L = {
      ...L,
      skin: mix(L.skin, D.skin, disguise),
      skinShade: mix(L.skinShade, D.skinShade, disguise),
      rim: mix(L.rim, D.rim, disguise),
      sclera: mix(L.sclera, "#F6EFE2", disguise * 0.85),
      crown: disguise > 0.5 ? "deva" : L.crown,
      stole: disguise > 0.5 ? D.stole : L.stole,
      dhoti: disguise > 0.5 ? D.dhoti : L.dhoti,
    };
  }
  const up = `rotate(${p.lean})`;
  const grey = drain > 0 ? { filter: `saturate(${1 - 0.75 * drain}) brightness(${1 - 0.25 * drain})` } : undefined;
  return (
    <g transform={`translate(${at.x} ${at.y + p.bob}) scale(${at.facing * at.s} ${at.s}) rotate(${p.sway})`} filter="url(#mCut)" style={grey}>
      <g transform={up}>
        <g transform={`translate(${NECK[0]} ${NECK[1]}) rotate(${p.head}) scale(${HEAD_S})`}>
          <Hair L={L} back t={t} id={id} />
        </g>
        <Arm L={L} front={false} s={p.sB} e={p.eB} w={p.wB} fist={0} prop={backProp} counter={p.wB + p.eB + p.sB - p.lean - p.sway} />
      </g>
      {noLegs ? null : <Lower L={L} id={id} />}
      <g transform={up}>
        <path d="M-20 -250L30 -250L34 -196L-24 -196Z" fill={L.skin} />
        <path d="M-20 -250L-2 -250C-4 -230 -2 -210 6 -196L-24 -196Z" fill={L.skinShade} opacity={0.6} />
        <path d="M-6 -232C4 -226 18 -226 28 -232" stroke={L.skinLine} strokeWidth={2} opacity={0.35} fill="none" />
        <Torso L={L} id={id} t={t} />
        <g transform={`translate(${NECK[0]} ${NECK[1]}) rotate(${p.head}) scale(${HEAD_S})`}>
          <Head L={L} id={id} p={p} t={t} />
        </g>
        <Arm L={L} front s={p.sF} e={p.eF} w={p.wF} fist={p.fist} counter={upright ? propCounter(p) : 0} prop={prop} />
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

/** Indra's vajra (thunderbolt): central grip, two five-pronged ends. */
export const Vajra: React.FC<{ glow?: number }> = ({ glow = 0 }) => (
  <g transform="rotate(90)">
    {glow > 0.01 ? <ellipse rx={70} ry={26} fill="#BFE6FF" opacity={0.5 * glow} filter="url(#mBlur8)" /> : null}
    <rect x={-10} y={-7} width={20} height={14} rx={4} fill="url(#mGold)" />
    {[-1, 1].map((sd) => (
      <g key={sd} transform={`scale(${sd} 1)`}>
        <path d="M10 -5L20 -9L20 9L10 5Z" fill="url(#mGoldDark)" />
        <path d="M20 0C30 -14 46 -18 58 -6C50 -10 40 -8 32 0C40 8 50 10 58 6C46 18 30 14 20 0Z" fill="url(#mGold)" />
        <path d="M22 0L64 0" stroke={P.goldLight} strokeWidth={3.5} strokeLinecap="round" />
        <circle cx={66} cy={0} r={4} fill={P.goldLight} />
      </g>
    ))}
  </g>
);

/** Ascetic's staff (danda), held upright. */
export const Danda: React.FC = () => (
  <g>
    <rect x={-5} y={-260} width={10} height={520} rx={5} fill="#7A4A26" />
    <rect x={-5} y={-260} width={4} height={520} fill="#9C6A3E" />
    {[-180, -60, 60].map((y) => (
      <rect key={y} x={-6} y={y} width={12} height={6} fill="#4A2A14" />
    ))}
  </g>
);

/** Kamandalu (water pot) hanging from the back hand. */
export const Kamandalu: React.FC = () => (
  <g transform="translate(0 30)">
    <path d="M-8 -26C-14 -40 14 -40 8 -26" stroke="#5A3A22" strokeWidth={4} fill="none" />
    <path d="M-26 0C-28 -22 -10 -28 0 -28C10 -28 28 -22 26 0C24 22 12 30 0 30C-12 30 -24 22 -26 0Z" fill="#6B4022" />
    <path d="M20 -10C34 -14 40 -22 44 -30" stroke="#6B4022" strokeWidth={6} strokeLinecap="round" />
    <path d="M-16 -10C-8 -16 8 -16 16 -10" stroke="#B8864E" strokeWidth={2.4} fill="none" />
  </g>
);

/** The divine garland (Vishnu Purana: santanaka / celestial flowers). */
export const Garland: React.FC<{ t: number; glow?: number; open?: number; r?: number }> = ({ t, glow = 1, open = 1, r = 64 }) => {
  const n = 22;
  return (
    <g>
      {glow > 0.01 ? <ellipse cx={0} cy={r * 0.9} rx={r * 1.15} ry={r * 1.2} fill="#FFF2C2" opacity={0.35 * glow} filter="url(#mBlur8)" /> : null}
      {new Array(n).fill(0).map((_, i) => {
        const a = (i / n) * Math.PI * 2;
        const x = Math.sin(a) * r * (0.55 + 0.45 * open);
        const y = r - Math.cos(a) * r * (0.9 + 0.3 * (1 - open));
        const tone = i % 3 === 0 ? "#FFFFFF" : i % 3 === 1 ? "#FFC6D9" : "#FFE07A";
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${i * 37 + t})`}>
            <ellipse rx={7} ry={4} fill="#3F8C41" transform="translate(6 0) rotate(30)" />
            {new Array(5).fill(0).map((__, k) => (
              <ellipse key={k} cx={0} cy={-5} rx={3.6} ry={5.5} fill={tone} transform={`rotate(${k * 72})`} />
            ))}
            <circle r={2.6} fill="#F2B21C" />
          </g>
        );
      })}
    </g>
  );
};

export { LOOKS };
