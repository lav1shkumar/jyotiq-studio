import React from "react";
import { C, DEVA, ramp, sparkle } from "./style";

/* Cut-out puppet rig. A character is rigid paper parts (torso, head, upper
   arm, forearm, hand) pinned at joints, posed by a few angles per frame.
   Local units ~ px at scale 1; origin at the waist; the puppet faces +x and
   is mirrored with facing = -1 (any value in between is a paper "turn").

   Angles (degrees): sF/sB swing an arm forward (+) from hanging straight
   down, eF/eB bend the elbow forward (+), wF/wB bend the wrist. `lean`
   tips the upper body forward (+), `head` nods the face down (+). */

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
  wink: number; // 0 open .. 1 happy closed arc
  brow: number; // eyebrow raise 0..1
  browTilt: number; // deg; + angry (front end down), - worried
  talk: number; // mouth open 0..1
  smile: number; // 0..1
  lookX: number; // pupil -1..1 (toward facing = +)
  lookY: number;
};

export const REST: Pose = {
  lean: 0, head: 0, sF: 6, eF: 10, wF: 0, sB: -4, eB: 8, wB: 0,
  bob: 0, sway: 0, blink: 0, wink: 0, brow: 0, browTilt: 0, talk: 0, smile: 0, lookX: 1, lookY: 0,
};

const SH_F: [number, number] = [32, -182];
const SH_B: [number, number] = [-38, -186];
const NECK: [number, number] = [8, -224];
const UA = 92; // shoulder -> elbow
const FA = 86; // elbow -> wrist
const HEAD_S = 0.8;
/** Where a held prop's origin sits in the hand's frame. */
const GRIP: [number, number] = [2, 18];

export type Kind = "jyotishi" | "raja" | "senapati" | "dut" | "meera";
type Look = {
  skin: string;
  skinBack: string;
  skinDark: string;
  hair: string;
  brow: string;
  lid: number;
  sleeveUA?: string; // upper-arm sleeve colour
  sleeveFA?: string; // forearm sleeve colour
  sleeveEdge?: string;
};
const LOOKS: Record<Kind, Look> = {
  jyotishi: { skin: "#B07148", skinBack: "#96603B", skinDark: "#7A4A2B", hair: "#F2EEE6", brow: "#EFE9DD", lid: 0.42 },
  raja: { skin: "#C8915F", skinBack: "#AC794C", skinDark: "#87593A", hair: "#1E140E", brow: "#1E140E", lid: 0.08 },
  senapati: { skin: "#9A6440", skinBack: "#80532F", skinDark: "#5A371C", hair: "#1A120C", brow: "#1A120C", lid: 0.14 },
  dut: {
    skin: "#B98052", skinBack: "#9E6A41", skinDark: "#7A4C2A", hair: "#1E140E", brow: "#1E140E", lid: 0,
    sleeveUA: "#F1EBDD", sleeveFA: "#F1EBDD", sleeveEdge: "#CFC6B4",
  },
  meera: {
    skin: "#C98F62", skinBack: "#AE784F", skinDark: "#8A5A38", hair: "#1A1210", brow: "#2A1A12", lid: 0,
    sleeveUA: "#E3A72F", sleeveEdge: "#B9831C",
  },
};

/* ------------------------------------------------------------------ */
/* Forward kinematics (for effects that must find the held prop)       */
/* ------------------------------------------------------------------ */

const rot = (p: [number, number], deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a)];
};
const add = (a: [number, number], b: [number, number]): [number, number] => [a[0] + b[0], a[1] + b[1]];

/** facing: +1 right, -1 left; values in between squash the puppet (a paper turn). */
export type Place = { x: number; y: number; s: number; facing: number };

/** Rotation that keeps a prop held in the front hand upright. */
export const propCounter = (p: Pose): number => p.wF + p.eF + p.sF - p.lean - p.sway;

/** World position of a point given in the prop frame of the front hand. */
export const propToWorld = (pt: [number, number], p: Pose, at: Place, upright = true): [number, number] => {
  let q = add(rot(pt, upright ? propCounter(p) : 0), GRIP);
  q = add(rot(q, -p.wF), [0, FA]);
  q = add(rot(q, -p.eF), [0, UA]);
  q = add(rot(q, -p.sF), SH_F);
  q = rot(q, p.lean + p.sway);
  return [at.x + at.facing * at.s * q[0], at.y + p.bob + at.s * q[1]];
};

/** World position of a point in head space (e.g. the eye at [34,-90]). */
export const headToWorld = (pt: [number, number], p: Pose, at: Place): [number, number] => {
  let q = rot([pt[0] * HEAD_S, pt[1] * HEAD_S], p.head);
  q = add(q, NECK);
  q = rot(q, p.lean + p.sway);
  return [at.x + at.facing * at.s * q[0], at.y + p.bob + at.s * q[1]];
};

/* ------------------------------------------------------------------ */
/* Arms                                                                */
/* ------------------------------------------------------------------ */

const HAND = "M-14 -6C-18 12 -14 32 0 36C13 37 19 26 18 10L15 -6Z";

/** Darken a #RRGGBB colour by factor k (0..1). */
const shade = (hex: string, k: number): string => {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.round(v * k).toString(16).padStart(2, "0");
  return `#${ch((n >> 16) & 255)}${ch((n >> 8) & 255)}${ch(n & 255)}`;
};
const THUMB = "M11 4C22 4 27 15 21 21C17 24 12 18 11 12Z";
const FIST = "M-14 -6C-18 8 -14 22 0 24C12 25 18 18 17 6L15 -6Z";
const INDEX = "M2 16C2 30 4 46 6 58C7 64 13 64 13 58C13 46 12 30 12 16Z";
const STEEL = "#97A3AF";
const STEEL_D = "#4E5761";

const Arm: React.FC<{
  L: Look;
  kind: Kind;
  front: boolean;
  s: number;
  e: number;
  w: number;
  counter?: number;
  prop?: React.ReactNode;
  point?: boolean;
}> = ({ L, kind, front, s, e, w, counter = 0, prop, point }) => {
  const sh = front ? SH_F : SH_B;
  const skin = front ? L.skin : L.skinBack;
  const edge = L.skinDark;
  const dim = (c: string | undefined) => (c && !front ? shade(c, 0.82) : c);
  const ua = dim(L.sleeveUA) ?? skin;
  const fa = dim(L.sleeveFA) ?? skin;
  return (
    <g transform={`translate(${sh[0]} ${sh[1]}) rotate(${-s})`} filter={front ? "url(#kPartShadow)" : undefined}>
      <rect x={-19} y={-20} width={38} height={UA + 34} rx={19} fill={ua} stroke={L.sleeveUA ? L.sleeveEdge : edge} strokeWidth={2.2} />
      {kind === "raja" ? <rect x={-20} y={22} width={40} height={11} rx={3} fill={C.gold} stroke={C.goldDark} strokeWidth={1.4} /> : null}
      {kind === "senapati" ? (
        <path d="M-25 -2C-25 -30 25 -30 25 -2L21 30L-21 30Z" fill={STEEL} stroke={STEEL_D} strokeWidth={2} />
      ) : null}
      {kind === "meera" ? <path d="M-19 58H19" stroke="#8E2420" strokeWidth={4} /> : null}
      <g transform={`translate(0 ${UA}) rotate(${-e})`}>
        <rect x={-16} y={-16} width={32} height={FA + 24} rx={16} fill={fa} stroke={L.sleeveFA ? L.sleeveEdge : edge} strokeWidth={2.2} />
        <circle r={4.2} fill={edge} />
        {kind === "raja" ? (
          <rect x={-17} y={FA - 18} width={34} height={9} rx={3} fill={C.gold} stroke={C.goldDark} strokeWidth={1.3} />
        ) : kind === "jyotishi" ? (
          new Array(5).fill(0).map((_, i) => <circle key={i} cx={-12 + i * 6} cy={FA - 12} r={3} fill="#6B3A1E" />)
        ) : kind === "senapati" ? (
          <g>
            <rect x={-18} y={18} width={36} height={62} rx={8} fill={STEEL} stroke={STEEL_D} strokeWidth={2} />
            <path d="M-14 26H14M-14 72H14" stroke={C.gold} strokeWidth={2.5} />
          </g>
        ) : kind === "meera" ? (
          <rect x={-17} y={FA - 16} width={34} height={6} rx={3} fill={C.gold} />
        ) : null}
        <g transform={`translate(0 ${FA}) rotate(${-w})`}>
          {prop ? <g transform={`translate(${GRIP[0]} ${GRIP[1]}) rotate(${counter})`}>{prop}</g> : null}
          {point ? (
            <g>
              <path d={INDEX} fill={skin} stroke={edge} strokeWidth={2} />
              <path d={FIST} fill={skin} stroke={edge} strokeWidth={2.2} />
              <path d={THUMB} transform="translate(0 -3)" fill={skin} stroke={edge} strokeWidth={2} />
            </g>
          ) : (
            <g>
              <path d={HAND} fill={skin} stroke={edge} strokeWidth={2.2} />
              <path d={THUMB} fill={skin} stroke={edge} strokeWidth={2} />
            </g>
          )}
        </g>
      </g>
      <circle r={4.2} fill={edge} />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Heads (profile facing +x, origin at the neck joint, drawn at HEAD_S) */
/* ------------------------------------------------------------------ */

const HEAD =
  "M-34 -4C-62 -20 -70 -96 -52 -130C-36 -160 26 -166 46 -136C54 -124 58 -112 58 -100L73 -73Q78 -65 67 -62L64 -57Q69 -52 63 -48Q68 -43 61 -39C63 -26 54 -14 37 -10L22 -2Z";
const F_HEAD =
  "M-32 -4C-60 -20 -66 -96 -50 -128C-34 -158 24 -164 44 -134C52 -122 55 -110 55 -100L65 -77Q68 -70 61 -68L60 -63Q65 -59 60 -55Q64 -50 58 -47C58 -33 50 -20 34 -12L22 -2Z";
const EYE = "M19 -90Q34 -102 49 -91Q35 -82 19 -90Z";
const J_HAIR = "M40 -180L40 -148C10 -148 -14 -130 -24 -102C-30 -82 -36 -50 -48 -4L-140 -4L-140 -180Z";
const R_HAIR = "M-10 -130C-24 -100 -34 -60 -48 -4L-140 -4L-140 -130Z";
const M_HAIR = "M46 -180L46 -136C30 -142 8 -140 -8 -128C-22 -116 -28 -94 -32 -70C-36 -48 -40 -26 -46 -4L-140 -4L-140 -180Z";
const TURBAN = "M60 -120C66 -140 62 -166 40 -182C10 -202 -44 -198 -66 -172C-82 -152 -80 -120 -66 -100C-40 -114 20 -124 60 -120Z";
const HELMET = "M60 -118C64 -150 44 -186 6 -190C-34 -192 -64 -166 -68 -126C-50 -134 20 -136 60 -118Z";
const PAGDI = "M58 -118C62 -138 52 -164 28 -174C0 -184 -40 -180 -60 -160C-72 -146 -72 -122 -62 -106C-40 -118 20 -124 58 -118Z";

const mouthPath = (mx: number, my: number, smile: number) =>
  `M${mx} ${my}Q${mx - 5} ${my + 3 - smile} ${mx - 10 - 2 * smile} ${my + 1 - 6 * smile}`;

const Head: React.FC<{ kind: Kind; id: string; p: Pose; t: number }> = ({ kind, id, p, t }) => {
  const L = LOOKS[kind];
  const lid = L.lid;
  const fem = kind === "meera";
  const hp = fem ? F_HEAD : HEAD;
  const [mx, my] = fem ? [60, -55] : [62, -50];
  const closed = p.wink > 0.5;
  const sq = closed ? 1 : 1 - 0.92 * Math.max(p.blink, p.wink * 2);
  const hairClip = kind === "jyotishi" ? J_HAIR : fem ? M_HAIR : R_HAIR;
  return (
    <g>
      <clipPath id={`${id}-head`}>
        <path d={hp} />
      </clipPath>
      <clipPath id={`${id}-eye`}>
        <path d={EYE} />
      </clipPath>
      {/* behind the head: Raja's turban tail, Meera's ponytail */}
      {kind === "raja" ? (
        <path d="M-62 -162C-90 -166 -108 -142 -106 -112C-98 -124 -86 -132 -70 -132Z" fill="#E2692A" stroke="#B9501B" strokeWidth={2} />
      ) : null}
      {fem ? (
        <g transform={`rotate(${Math.sin(t / 13) * 3} -50 -142)`}>
          <path d="M-50 -148C-92 -152 -112 -112 -106 -62C-102 -22 -92 8 -78 28C-80 -2 -78 -42 -72 -82C-68 -112 -60 -130 -46 -136Z" fill={L.hair} />
          <path d="M-62 -130C-84 -110 -90 -70 -86 -30" fill="none" stroke="#3A2A24" strokeWidth={2.2} />
        </g>
      ) : null}
      <path d={hp} fill={L.skin} stroke={L.skinDark} strokeWidth={2.4} />
      <g clipPath={`url(#${id}-head)`}>
        <path d="M-80 -170L-34 -170C-52 -120 -48 -50 -22 0L-80 0Z" fill={L.skinDark} opacity={0.2} />
        <path d={hairClip} fill={L.hair} />
        {kind === "jyotishi" ? <path d="M28 -150C0 -146 -28 -120 -42 -80" fill="none" stroke="#D6CEC0" strokeWidth={2.2} /> : null}
        {fem ? <path d="M30 -150C4 -146 -20 -124 -30 -86" fill="none" stroke="#3A2A24" strokeWidth={2} /> : null}
      </g>
      {kind === "jyotishi" ? (
        <g>
          <circle cx={-30} cy={-160} r={24} fill={L.hair} stroke="#D3CBBD" strokeWidth={2} />
          <path d="M-50 -149Q-30 -142 -10 -150" fill="none" stroke="#8A5A2B" strokeWidth={3.2} />
        </g>
      ) : fem ? null : (
        <path d="M6 -100C0 -84 2 -64 14 -50L20 -52C12 -66 12 -84 16 -100Z" fill={L.hair} />
      )}
      {/* ear */}
      <path d="M-4 -100C-28 -104 -30 -62 -6 -60C2 -60 4 -70 0 -76" fill={L.skin} stroke={L.skinDark} strokeWidth={2.2} />
      <path d="M-10 -92C-18 -88 -17 -74 -9 -71" fill="none" stroke={L.skinDark} strokeWidth={2} />
      {kind === "raja" || fem ? (
        <g>
          <circle cx={-10} cy={-56} r={fem ? 5 : 6.5} fill="none" stroke={C.gold} strokeWidth={3} />
          <circle cx={-10} cy={fem ? -49 : -47} r={3} fill={fem ? C.gold : "#FBF5E6"} />
        </g>
      ) : null}
      {/* cheek, nose, mouth */}
      <circle cx={26} cy={-60} r={11} fill="#E0705A" opacity={fem ? 0.32 : 0.22 + 0.12 * p.smile} />
      <path d={fem ? "M56 -70Q59 -67 63 -68" : "M57 -66Q61 -62 66 -64"} fill="none" stroke={L.skinDark} strokeWidth={2} />
      {p.talk > 0.06 ? (
        <ellipse cx={mx - 5} cy={my + 3} rx={5} ry={1 + p.talk * 4} fill="#4A1712" />
      ) : (
        <path d={mouthPath(mx, my, p.smile)} fill="none" stroke={fem ? "#9E3B3B" : "#5A2418"} strokeWidth={2.4} strokeLinecap="round" />
      )}
      {fem ? <path d="M61 -63Q66 -60 61 -56Z M60 -54Q64 -51 58 -48Z" fill="#C4545E" opacity={0.85} /> : null}
      {/* eye */}
      {closed ? (
        <path d="M18 -90Q34 -101 50 -90" fill="none" stroke={C.ink} strokeWidth={3.4} strokeLinecap="round" />
      ) : (
        <g transform={`translate(0 -90) scale(1 ${sq}) translate(0 90)`}>
          <path d={EYE} fill="#FFFDF7" />
          <g clipPath={`url(#${id}-eye)`}>
            <circle cx={40 + p.lookX * 3} cy={-90 + p.lookY * 3} r={5.4} fill={C.ink} />
            <circle cx={41.6 + p.lookX * 3} cy={-92 + p.lookY * 3} r={1.5} fill="#FFFFFF" />
            {lid > 0 ? (
              <path d={`M10 -110H60V${-92 + 9 * lid}Q34 ${-104 + 14 * lid} 10 ${-91 + 9 * lid}Z`} fill={L.skin} />
            ) : null}
          </g>
          <path d={EYE} fill="none" stroke={C.ink} strokeWidth={1.8} />
          <path
            d={`M17 ${-91 + 9 * lid}Q34 ${-104 + 14 * lid} 51 ${-92 + 9 * lid}`}
            fill="none"
            stroke={C.ink}
            strokeWidth={3.4}
            strokeLinecap="round"
          />
          <path d="M19 -90L11 -94" stroke={C.ink} strokeWidth={2.6} strokeLinecap="round" />
          {fem ? <path d="M22 -94L15 -101M28 -97L24 -104" stroke={C.ink} strokeWidth={2.2} strokeLinecap="round" /> : null}
        </g>
      )}
      <path
        d="M18 -106Q33 -117 54 -109"
        transform={`translate(0 ${-p.brow * 6}) rotate(${p.browTilt} 36 -110)`}
        fill="none"
        stroke={L.brow}
        strokeWidth={kind === "jyotishi" ? 7.5 : fem ? 5 : kind === "senapati" ? 8 : 6.5}
        strokeLinecap="round"
      />
      {kind === "jyotishi" ? (
        <g>
          {/* tripundra */}
          <g stroke="#FBF8F0" strokeWidth={3.2} strokeLinecap="round">
            <path d="M10 -136H42" />
            <path d="M7 -129H47" />
            <path d="M5 -122H50" />
          </g>
          <circle cx={28} cy={-129} r={3.6} fill={C.red} />
          {/* white beard + droopy moustache */}
          <path d="M-4 -64C-8 -52 -16 -40 -26 -28L-12 -30C-2 -40 6 -52 8 -64Z" fill="#F3EFE7" />
          <path
            d="M63 -48C72 -20 68 26 44 58C30 76 2 74 -10 48C-18 28 -22 0 -26 -26C-14 -40 8 -44 30 -40C42 -40 54 -44 63 -48Z"
            fill="#F3EFE7"
            stroke="#D6CEC0"
            strokeWidth={2}
          />
          <g fill="none" stroke="#D6CEC0" strokeWidth={2} strokeLinecap="round">
            <path d="M40 -30C44 0 40 30 30 50" />
            <path d="M14 -34C16 -6 12 24 4 44" />
            <path d="M54 -38C60 -10 56 20 46 46" />
          </g>
          <path d="M67 -57C60 -54 50 -52 40 -48C34 -45 34 -40 40 -40C50 -42 60 -48 67 -51Z" fill="#F3EFE7" stroke="#D6CEC0" strokeWidth={1.5} />
        </g>
      ) : null}
      {kind === "raja" ? (
        <g>
          {/* Rajput moustache */}
          <path
            d="M66 -58C58 -55 44 -52 30 -54C18 -56 8 -64 10 -76C12 -82 19 -82 19 -76C18 -68 26 -63 38 -62C50 -61 59 -62 67 -63Z"
            fill={L.hair}
          />
          {/* safa with bandhani, wraps, sarpech and kalgi */}
          <clipPath id={`${id}-turban`}>
            <path d={TURBAN} />
          </clipPath>
          <path d={TURBAN} fill="#E2692A" stroke="#B9501B" strokeWidth={2.4} />
          <g clipPath={`url(#${id}-turban)`}>
            <rect x={-90} y={-210} width={170} height={120} fill="url(#kBandhani)" opacity={0.9} />
            <g fill="none" stroke="#C2531C" strokeWidth={5.5}>
              <path d="M58 -128C26 -138 -30 -132 -68 -112" />
              <path d="M56 -146C20 -158 -40 -154 -74 -136" />
              <path d="M48 -164C14 -178 -38 -176 -68 -158" />
            </g>
          </g>
          <g transform={`rotate(${Math.sin(t / 11) * 4} 52 -160)`}>
            <path d="M48 -158C46 -190 40 -214 22 -236C44 -218 58 -192 56 -160Z" fill="#FBF7EE" stroke="#D8D0BF" strokeWidth={1.5} />
            <path d="M52 -160C50 -190 44 -212 30 -230" fill="none" stroke="#D8D0BF" strokeWidth={1.5} />
          </g>
          <ellipse cx={50} cy={-148} rx={9} ry={13} fill={C.gold} stroke={C.goldDark} strokeWidth={1.5} />
          <circle cx={50} cy={-150} r={4.2} fill={C.red} />
          {[44, 50, 56].map((x) => (
            <circle key={x} cx={x} cy={x === 50 ? -131 : -133} r={2.6} fill="#FBF5E6" />
          ))}
        </g>
      ) : null}
      {kind === "senapati" ? (
        <g>
          {/* black battle beard + up-curled moustache */}
          <path
            d="M63 -46C70 -26 66 4 46 22C30 34 4 30 -8 12C-16 0 -22 -14 -26 -28C-12 -40 10 -44 30 -40C44 -40 54 -42 63 -46Z"
            fill={L.hair}
          />
          <path d="M-4 -64C-8 -52 -16 -40 -26 -28L-12 -30C-2 -40 6 -52 8 -64Z" fill={L.hair} />
          <path
            d="M67 -58C58 -55 42 -51 26 -55C12 -59 2 -72 8 -88C11 -95 19 -94 18 -87C16 -76 26 -66 40 -64C52 -62 60 -63 68 -64Z"
            fill={L.hair}
          />
          {/* steel khud helmet with plume and mail aventail */}
          <path d="M-66 -128C-76 -96 -74 -60 -58 -34L-34 -40C-44 -64 -46 -96 -40 -126Z" fill="#7D8894" stroke={STEEL_D} strokeWidth={2} />
          {[-110, -92, -74, -56].map((y) => (
            <path key={y} d={`M-64 ${y}Q-54 ${y + 6} -42 ${y}`} fill="none" stroke="#5E6873" strokeWidth={1.6} />
          ))}
          <g transform={`rotate(${Math.sin(t / 9) * 3} 10 -212)`}>
            <path d="M10 -214C-10 -234 -42 -238 -64 -222C-42 -224 -16 -214 4 -202Z" fill="#C0392B" stroke="#8E2420" strokeWidth={1.5} />
          </g>
          <path d={HELMET} fill={STEEL} stroke={STEEL_D} strokeWidth={2.4} />
          <path d="M-40 -160C-20 -180 20 -182 40 -160" fill="none" stroke="#C9D2DB" strokeWidth={4} strokeLinecap="round" />
          <path d="M-68 -126C-40 -138 24 -138 62 -118" fill="none" stroke={C.gold} strokeWidth={6} />
          <path d="M2 -190L9 -224L16 -190Z" fill={C.gold} stroke={C.goldDark} strokeWidth={1.4} />
        </g>
      ) : null}
      {kind === "dut" ? (
        <g>
          <path d="M66 -57C58 -55 50 -54 42 -56" fill="none" stroke={L.hair} strokeWidth={3.4} strokeLinecap="round" />
          <path d={PAGDI} fill="#F4EFE4" stroke="#CFC6B4" strokeWidth={2.2} />
          <path d="M56 -130C24 -140 -30 -136 -64 -118" fill="none" stroke="#C0392B" strokeWidth={5} />
          <path d="M50 -150C16 -162 -36 -158 -62 -142" fill="none" stroke="#DDD3C0" strokeWidth={4} />
        </g>
      ) : null}
      {fem ? (
        <g>
          {/* side-swept fringe, scrunchie, bindi */}
          <path d="M50 -132C42 -124 26 -120 6 -122C-4 -124 -12 -130 -16 -138C4 -154 32 -152 50 -132Z" fill={L.hair} />
          <circle cx={-50} cy={-142} r={9} fill="#E0742A" />
          <circle cx={51} cy={-111} r={3.4} fill={C.red} />
        </g>
      ) : null}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Torsos                                                              */
/* ------------------------------------------------------------------ */

const TORSO_J = "M-64 4C-70 -50 -84 -130 -80 -172C-78 -196 -50 -206 -6 -206C40 -206 72 -198 78 -174C88 -140 94 -76 82 -34C78 -16 72 -4 66 4Z";
const TORSO_R = "M-66 4C-72 -50 -86 -130 -82 -172C-80 -196 -50 -208 -6 -208C40 -208 74 -200 80 -176C88 -138 84 -80 76 -36C74 -16 72 -4 70 4Z";
const TORSO_F = "M-58 4C-64 -50 -74 -128 -70 -168C-68 -192 -44 -202 -6 -202C34 -202 62 -194 68 -172C74 -138 68 -84 62 -40C60 -20 60 -6 62 4Z";

/** Points on a quadratic curve, n+1 of them. */
const quad = (p0: [number, number], p1: [number, number], p2: [number, number], n: number): [number, number][] =>
  new Array(n + 1).fill(0).map((_, i) => {
    const t = i / n;
    const a = (1 - t) * (1 - t);
    const b = 2 * (1 - t) * t;
    const c = t * t;
    return [a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]];
  });

const Torso: React.FC<{ id: string; kind: Kind; L: Look }> = ({ id, kind, L }) => {
  const clip = `url(#${id}-torso)`;
  if (kind === "jyotishi") {
    return (
      <g>
        <clipPath id={`${id}-torso`}>
          <path d={TORSO_J} />
        </clipPath>
        <path d={TORSO_J} fill={L.skin} stroke={L.skinDark} strokeWidth={2.4} />
        <g clipPath={clip}>
          <rect x={-100} y={-220} width={40} height={240} fill={L.skinDark} opacity={0.28} />
        </g>
        {/* angavastram over the far shoulder */}
        <path d="M-90 -150L-42 -210L90 -48L62 -2Z" fill="#F1E4C8" stroke="#C9B48E" strokeWidth={2} strokeLinejoin="round" />
        <path d="M-36 -201L82 -51M-83 -146L57 -9" stroke="#B8302A" strokeWidth={6} />
        <path d="M-60 -178L72 -28" stroke="#E3B04B" strokeWidth={2.2} strokeDasharray="2 8" strokeLinecap="round" />
        {/* rudraksha mala */}
        {quad([-30, -200], [8, -80], [46, -200], 16).map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={5.2} fill="#6B3A1E" />
            <circle cx={x - 1.5} cy={y - 1.6} r={1.6} fill="#A0623A" />
          </g>
        ))}
        <circle cx={8} cy={-130} r={8} fill="#6B3A1E" stroke="#4A2412" strokeWidth={1.5} />
      </g>
    );
  }
  if (kind === "raja") {
    return (
      <g>
        <clipPath id={`${id}-torso`}>
          <path d={TORSO_R} />
        </clipPath>
        <path d={TORSO_R} fill="#145F66" stroke="#0D464C" strokeWidth={2.4} />
        <g clipPath={clip}>
          <rect x={-100} y={-220} width={200} height={240} fill="url(#kButi)" opacity={0.85} />
          <rect x={-100} y={-220} width={40} height={240} fill="#0A3A3F" opacity={0.35} />
        </g>
        <path d="M26 -206C-6 -160 -28 -90 -50 -4" stroke={C.gold} strokeWidth={7} fill="none" />
        <path d="M26 -206C-6 -160 -28 -90 -50 -4" stroke="#FBE7B0" strokeWidth={2} fill="none" />
        <path d="M-26 -206Q8 -186 34 -206" stroke={C.gold} strokeWidth={5} fill="none" />
        {[-132, -96, -56].map((cy, k) =>
          quad([-24, -204], [8, cy], [40, -204], 12 + k * 2).map(([x, y], i) => (
            <circle key={`${k}-${i}`} cx={x} cy={y} r={3.6} fill="#FBF5E6" stroke="#D8CDB6" strokeWidth={0.8} />
          )),
        )}
        <path d="M8 -134L16 -122L8 -108L0 -122Z" fill={C.gold} stroke={C.goldDark} strokeWidth={1.4} />
        <circle cx={8} cy={-122} r={4} fill="#1E8E5A" />
      </g>
    );
  }
  if (kind === "senapati") {
    return (
      <g>
        <clipPath id={`${id}-torso`}>
          <path d={TORSO_R} />
        </clipPath>
        <path d={TORSO_R} fill="#8E2420" stroke="#5E1515" strokeWidth={2.4} />
        <g clipPath={clip}>
          <rect x={-100} y={-220} width={40} height={240} fill="#3A0E0E" opacity={0.35} />
        </g>
        {/* chahar-aina breastplate */}
        <rect x={-46} y={-190} width={108} height={124} rx={16} fill={STEEL} stroke={STEEL_D} strokeWidth={2.4} />
        <rect x={-38} y={-182} width={92} height={108} rx={11} fill="none" stroke={C.gold} strokeWidth={2.5} />
        <circle cx={8} cy={-128} r={22} fill="#C2CBD4" stroke={STEEL_D} strokeWidth={2} />
        <circle cx={8} cy={-128} r={9} fill={C.gold} stroke={C.goldDark} strokeWidth={1.4} />
        {[
          [-30, -174],
          [46, -174],
          [-30, -82],
          [46, -82],
        ].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={3.2} fill={C.gold} />
        ))}
        <rect x={-72} y={-42} width={148} height={24} rx={6} fill="#5A3A22" stroke="#3A2414" strokeWidth={1.6} />
        {new Array(8).fill(0).map((_, i) => (
          <circle key={i} cx={-60 + i * 17} cy={-30} r={3.4} fill={C.gold} />
        ))}
      </g>
    );
  }
  if (kind === "dut") {
    return (
      <g>
        <clipPath id={`${id}-torso`}>
          <path d={TORSO_R} />
        </clipPath>
        <path d={TORSO_R} fill="#F1EBDD" stroke="#CFC6B4" strokeWidth={2.4} />
        <g clipPath={clip}>
          <rect x={-100} y={-220} width={40} height={240} fill="#CFC6B4" opacity={0.45} />
        </g>
        <path d="M30 -204L24 -120" stroke="#CFC6B4" strokeWidth={2.4} />
        {[-188, -164, -140].map((y) => (
          <circle key={y} cx={28 - (y + 188) * 0.07} cy={y} r={3} fill="#B8302A" />
        ))}
        <path d="M-84 -148L-44 -206L84 -42L62 -6Z" fill="#E8913A" stroke="#C46F25" strokeWidth={2} strokeLinejoin="round" />
      </g>
    );
  }
  // meera: mustard block-print kurti
  return (
    <g>
      <clipPath id={`${id}-torso`}>
        <path d={TORSO_F} />
      </clipPath>
      <path d={TORSO_F} fill="#E3A72F" stroke="#B9831C" strokeWidth={2.4} />
      <g clipPath={clip}>
        <rect x={-100} y={-220} width={200} height={240} fill="url(#kPrint)" />
        <rect x={-100} y={-220} width={40} height={240} fill="#9C6A10" opacity={0.25} />
      </g>
      <path d="M-4 -202L20 -166L42 -202Z" fill={L.skin} />
      <path d="M-6 -202L20 -163L44 -202" fill="none" stroke="#8E2420" strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M-62 -192L64 -20" stroke="#5A3A22" strokeWidth={5} />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Lower garments + feet                                               */
/* ------------------------------------------------------------------ */

const DHOTI = "M-70 -12L72 -12L92 250L-86 250Z";
const JAMA = "M-72 -12L74 -12L122 262L-112 262Z";
const KURTI = "M-60 -10L64 -10L88 160L-84 160Z";
const FOOT = "M4 244C6 260 10 270 24 272C44 274 66 272 74 266C78 260 70 254 56 252C44 250 36 246 30 242Z";
const MOJARI = "M8 254C10 270 18 278 34 278C56 278 78 274 90 264C94 260 92 256 86 258C74 260 62 256 50 252Z";
const SNEAKER = "M0 242C0 258 6 270 22 271L72 272C82 272 84 260 74 255C62 250 48 248 38 240Z";

const Dhoti: React.FC<{ id: string; c: string; dark: string; line: string; border: string }> = ({ id, c, dark, line, border }) => (
  <g>
    <clipPath id={`${id}-low`}>
      <path d={DHOTI} />
    </clipPath>
    <path d={DHOTI} fill={c} stroke={line} strokeWidth={2.2} />
    <g clipPath={`url(#${id}-low)`}>
      <path d="M14 -6L40 250L6 250Z" fill={dark} />
      <path d="M-30 0L-44 250M50 0L66 250" stroke={dark} strokeWidth={2.2} />
      <rect x={-110} y={-30} width={40} height={290} fill={line} opacity={0.25} />
      <rect x={-110} y={214} width={220} height={24} fill={border} />
      <path d="M-110 218H110M-110 234H110" stroke="#E3B04B" strokeWidth={2} />
    </g>
    <rect x={-74} y={-18} width={150} height={20} rx={8} fill={dark} stroke={line} strokeWidth={1.6} />
    <ellipse cx={30} cy={-4} rx={18} ry={9} fill={line} opacity={0.6} />
  </g>
);

const Jama: React.FC<{ id: string; c: string; line: string; pleat: string; shade: string; buti: boolean }> = ({ id, c, line, pleat, shade, buti }) => (
  <g>
    <clipPath id={`${id}-low`}>
      <path d={JAMA} />
    </clipPath>
    <path d={JAMA} fill={c} stroke={line} strokeWidth={2.2} />
    <g clipPath={`url(#${id}-low)`}>
      {buti ? <rect x={-130} y={-20} width={260} height={290} fill="url(#kButi)" opacity={0.85} /> : null}
      {[-3, -2, -1, 0, 1, 2, 3].map((k) => (
        <path key={k} d={`M${k * 20} -8L${k * 34} 262`} stroke={pleat} strokeWidth={2.4} />
      ))}
      <rect x={-130} y={-20} width={46} height={290} fill={shade} opacity={0.3} />
      <rect x={-130} y={234} width={260} height={30} fill={C.gold} />
      <path d="M-130 240H130" stroke="#FBE7B0" strokeWidth={2} />
      <path d="M-130 256H130" stroke={C.goldDark} strokeWidth={2} />
    </g>
  </g>
);

const Lower: React.FC<{ id: string; kind: Kind }> = ({ id, kind }) => {
  if (kind === "jyotishi") return <Dhoti id={id} c="#E8923A" dark="#D07A2B" line="#B8692A" border="#9E2B25" />;
  if (kind === "dut") return <Dhoti id={id} c="#F4EFE4" dark="#DDD3C0" line="#BDB29C" border="#B8302A" />;
  if (kind === "raja") {
    return (
      <g>
        <Jama id={id} c="#145F66" line="#0D464C" pleat="#0E4A50" shade="#0A3A3F" buti />
        {/* patka sash + hanging panel */}
        <rect x={-76} y={-24} width={154} height={30} rx={8} fill="#B8262E" stroke="#7E151B" strokeWidth={1.6} />
        <path d="M-74 -14H76M-74 -4H76" stroke={C.gold} strokeWidth={2.2} />
        <path d="M36 4L66 4L74 212L42 212Z" fill="#B8262E" stroke={C.gold} strokeWidth={3} />
        {[40, 80, 120, 160].map((y) => (
          <circle key={y} cx={54 + y * 0.04} cy={y} r={4} fill={C.gold} />
        ))}
        <path d="M44 198H72" stroke={C.gold} strokeWidth={8} />
      </g>
    );
  }
  if (kind === "senapati") {
    return (
      <g>
        <Jama id={id} c="#6E1A1E" line="#4A1014" pleat="#561318" shade="#2A0809" buti={false} />
        {/* scabbard */}
        <path d="M-60 0C-70 70 -86 140 -110 200L-96 206C-72 146 -56 76 -46 4Z" fill="#3A2414" stroke={C.gold} strokeWidth={2} />
      </g>
    );
  }
  // meera: jeans under a knee-length kurti
  return (
    <g>
      <rect x={-46} y={120} width={40} height={130} rx={9} fill="#2C4672" />
      <rect x={4} y={120} width={42} height={132} rx={9} fill="#3B5A8C" stroke="#2A4268" strokeWidth={2} />
      <path d="M10 140V246" stroke="#5B7BB0" strokeWidth={2} strokeDasharray="5 6" />
      <clipPath id={`${id}-low`}>
        <path d={KURTI} />
      </clipPath>
      <path d={KURTI} fill="#E3A72F" stroke="#B9831C" strokeWidth={2.2} />
      <g clipPath={`url(#${id}-low)`}>
        <rect x={-100} y={-20} width={200} height={190} fill="url(#kPrint)" />
        <rect x={-100} y={-20} width={40} height={190} fill="#9C6A10" opacity={0.25} />
        <rect x={-100} y={140} width={200} height={22} fill="#8E2420" />
        <path d="M-100 146H100" stroke="#E3B04B" strokeWidth={2} strokeDasharray="4 5" />
      </g>
      <path d="M64 30L80 158" stroke="#B9831C" strokeWidth={2.2} />
    </g>
  );
};

const Feet: React.FC<{ kind: Kind; L: Look }> = ({ kind, L }) => {
  if (kind === "jyotishi" || kind === "dut") {
    return (
      <g>
        <path d={FOOT} transform="translate(-58 -4)" fill={L.skinBack} stroke={L.skinDark} strokeWidth={2} />
        <path d={FOOT} fill={L.skin} stroke={L.skinDark} strokeWidth={2} />
        {kind === "jyotishi" ? <path d="M8 252Q20 259 32 251" fill="none" stroke="#E8E2D4" strokeWidth={3} strokeLinecap="round" /> : null}
      </g>
    );
  }
  if (kind === "meera") {
    return (
      <g>
        <path d={SNEAKER} transform="translate(-56 -4)" fill="#D9D5CC" stroke="#9A958A" strokeWidth={2} />
        <path d={SNEAKER} fill="#F7F5F0" stroke="#9A958A" strokeWidth={2} />
        <path d="M2 264H80" stroke="#CFCAC0" strokeWidth={4} />
        <path d="M30 252Q46 258 62 254" fill="none" stroke="#E0742A" strokeWidth={3} />
      </g>
    );
  }
  const [c, back] = kind === "raja" ? ["#8E1B22", "#6E141A"] : ["#4A2A18", "#36200F"];
  return (
    <g>
      <path d={MOJARI} transform="translate(-60 -4)" fill={back} stroke={C.goldDark} strokeWidth={2} />
      <path d={MOJARI} fill={c} stroke={C.gold} strokeWidth={2} />
      <path d="M40 262Q60 270 84 262" fill="none" stroke={C.gold} strokeWidth={2.2} />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Puppet                                                              */
/* ------------------------------------------------------------------ */

export const Puppet: React.FC<{
  id: string;
  kind: Kind;
  at: Place;
  p: Pose;
  t: number;
  prop?: React.ReactNode;
  /** false: the prop turns with the hand (a sword); true: it stays upright (a scroll, a flag). */
  upright?: boolean;
  point?: boolean;
}> = ({ id, kind, at, p, t, prop, upright = true, point }) => {
  const L = LOOKS[kind];
  const up = `rotate(${p.lean})`;
  return (
    <g transform={`translate(${at.x} ${at.y + p.bob}) scale(${at.facing * at.s} ${at.s}) rotate(${p.sway})`} filter="url(#kCutShadow)">
      <g transform={up}>
        <Arm L={L} kind={kind} front={false} s={p.sB} e={p.eB} w={p.wB} />
      </g>
      <Feet kind={kind} L={L} />
      <Lower id={id} kind={kind} />
      <g transform={up}>
        <rect x={-12} y={-250} width={40} height={56} rx={10} fill={L.skin} stroke={L.skinDark} strokeWidth={2} />
        <rect x={-12} y={-250} width={14} height={56} fill={L.skinDark} opacity={0.3} />
        <Torso id={id} kind={kind} L={L} />
        <g transform={`translate(${NECK[0]} ${NECK[1]}) rotate(${p.head}) scale(${HEAD_S})`}>
          <Head kind={kind} id={id} p={p} t={t} />
        </g>
        <Arm L={L} kind={kind} front s={p.sF} e={p.eF} w={p.wF} counter={upright ? propCounter(p) : 0} prop={prop} point={point} />
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

/** Curved talwar gripped in the fist; render with upright={false}. */
export const Talwar: React.FC<{ glint: number }> = ({ glint }) => (
  <g>
    <path d="M-5 16L9 16C17 92 28 170 48 238C31 184 16 112 -5 16Z" fill="#D5DEE6" stroke="#7D8894" strokeWidth={1.6} />
    <path d="M2 18C9 92 20 168 40 228" fill="none" stroke="#FFFFFF" strokeWidth={1.6} opacity={0.75} />
    <rect x={-22} y={10} width={48} height={10} rx={4} fill={C.gold} stroke={C.goldDark} strokeWidth={1.4} />
    {glint > 0.02 ? <path d={sparkle(20 * glint)} transform={`translate(44 226) rotate(${glint * 90})`} fill="#FFFFFF" /> : null}
  </g>
);

/** White flag of truce on a pole, streaming backwards (-x). */
export const WhiteFlag: React.FC<{ t: number }> = ({ t }) => {
  const w = Math.sin(t / 2.6) * 9;
  return (
    <g>
      <rect x={-3} y={-170} width={7} height={230} rx={3} fill="#8A5A2B" stroke="#5E3A1A" strokeWidth={1.2} />
      <path
        d={`M0 -164C-30 ${-170 + w} -64 ${-150 - w} -104 ${-150 + w}C-76 ${-134 - w} -40 ${-124 + w} 0 -118Z`}
        fill="#FBF8F0"
        stroke="#D6CEC0"
        strokeWidth={2}
      />
      <circle cx={0} cy={-174} r={7} fill={C.gold} stroke={C.goldDark} strokeWidth={1.2} />
    </g>
  );
};

/** Meera's phone, screen toward us. `glow` lights it gold, `logo` shows the diya. */
export const PhoneProp: React.FC<{ glow: number; logo: number }> = ({ glow, logo }) => (
  <g>
    {glow > 0.01 ? <circle cx={0} cy={-36} r={90} fill="url(#kAura)" opacity={glow * 0.85} /> : null}
    <rect x={-22} y={-80} width={44} height={86} rx={8} fill="#1A1626" stroke="#0B0910" strokeWidth={2} />
    <rect x={-18} y={-76} width={36} height={76} rx={5} fill="#3A3358" />
    <rect x={-18} y={-76} width={36} height={76} rx={5} fill="#F6D78A" opacity={glow * 0.9} />
    {logo > 0.01 ? (
      <g opacity={logo} transform={`translate(0 -38) scale(${0.7 + 0.3 * logo})`}>
        <path d="M-12 2Q0 14 12 2Z" fill="#A9741F" />
        <path d="M0 0C-4 -3 -5 -9 0 -16C5 -9 4 -3 0 0Z" fill="#E8822A" />
      </g>
    ) : null}
  </g>
);

/* ------------------------------------------------------------------ */
/* Janam patri scroll (held in the front hand, hangs toward +x)        */
/* ------------------------------------------------------------------ */

/** Kundali square in prop space. */
export const PATRI_CHART = { x: 10, y: 52, s: 84 };
/** Index of Mangal in GRAHA (the planet the reel highlights). */
export const MANGAL = 3;
const GRAHA: [string, number, number][] = [
  ["गु", 0.5, 0.27], // H1
  ["रा", 0.25, 0.1], // H2
  ["चं", 0.27, 0.5], // H4
  ["मं", 0.1, 0.75], // H5
  ["श", 0.5, 0.73], // H7
  ["के", 0.75, 0.9], // H8
  ["शु", 0.9, 0.75], // H9
  ["सू", 0.73, 0.5], // H10
  ["बु", 0.9, 0.25], // H11
];
/** Prop-space centre of a graha's glyph. */
export const grahaAt = (i: number): [number, number] => [PATRI_CHART.x + GRAHA[i][1] * PATRI_CHART.s, PATRI_CHART.y + GRAHA[i][2] * PATRI_CHART.s];

export const Patri: React.FC<{ id: string; unroll: number; draw: number; glyphs: number; glow: number; mark?: number }> = ({
  id,
  unroll,
  draw,
  glyphs,
  glow,
  mark = 0,
}) => {
  const len = 6 + 188 * unroll;
  const { x, y, s } = PATRI_CHART;
  const seg = (a: number, b: number) => 1 - ramp(draw, a, b, "io");
  const line = { fill: "none", stroke: "#B3262B", strokeWidth: 2.4, pathLength: 1, strokeDasharray: 1, strokeLinecap: "round" as const };
  const [mgx, mgy] = grahaAt(MANGAL);
  return (
    <g>
      {glow > 0.01 ? <circle cx={x + s / 2} cy={y + s / 2} r={150} fill="url(#kAura)" opacity={glow} /> : null}
      <clipPath id={`${id}-paper`}>
        <rect x={-12} y={4} width={128} height={len} />
      </clipPath>
      <rect x={-12} y={4} width={128} height={len} fill="#F4E2B4" stroke="#CDB27A" strokeWidth={1.5} />
      <g clipPath={`url(#${id}-paper)`}>
        <rect x={-4} y={14} width={112} height={176} fill="none" stroke="#B3262B" strokeWidth={2} />
        <rect x={0} y={18} width={104} height={168} fill="none" stroke="#B3262B" strokeWidth={0.8} />
        <text x={52} y={40} textAnchor="middle" fontFamily={DEVA} fontWeight={700} fontSize={14} fill="#8E2420">
          जन्म पत्री
        </text>
        <path d={`M${x} ${y}H${x + s}V${y + s}H${x}Z`} {...line} strokeDashoffset={seg(0, 0.4)} />
        <path d={`M${x} ${y}L${x + s} ${y + s}M${x + s} ${y}L${x} ${y + s}`} {...line} strokeDashoffset={seg(0.3, 0.7)} />
        <path
          d={`M${x + s / 2} ${y}L${x + s} ${y + s / 2}L${x + s / 2} ${y + s}L${x} ${y + s / 2}Z`}
          {...line}
          strokeDashoffset={seg(0.6, 1)}
        />
        {mark > 0.01 ? (
          <circle cx={mgx} cy={mgy} r={9 + 3 * mark} fill="#FFD9C4" stroke="#D8262E" strokeWidth={2.4} opacity={mark} />
        ) : null}
        {GRAHA.map(([g, u, v], i) => {
          const k = Math.max(0, Math.min(1, glyphs * GRAHA.length - i));
          if (k <= 0) return null;
          const pop = k < 1 ? 0.6 + 0.6 * k : 1;
          const gx = x + u * s;
          const gy = y + v * s;
          const hot = i === MANGAL && mark > 0.01;
          return (
            <text
              key={g}
              x={gx}
              y={gy + 4.5}
              textAnchor="middle"
              fontFamily={DEVA}
              fontWeight={700}
              fontSize={hot ? 12.5 + 2 * mark : 12.5}
              fill={hot ? "#C0182A" : "#2B3A8C"}
              opacity={k}
              transform={`translate(${gx} ${gy}) scale(${pop}) translate(${-gx} ${-gy})`}
            >
              {g}
            </text>
          );
        })}
        <text x={52} y={176} textAnchor="middle" fontFamily={DEVA} fontWeight={400} fontSize={12} fill="#8E2420">
          ॥ शुभम् ॥
        </text>
      </g>
      <rect x={-16} y={len - 3} width={136} height={14} rx={7} fill="#E5CD95" stroke="#BFA36A" strokeWidth={1.5} />
      <path d={`M-12 ${len + 4}H116`} stroke="#CDB27A" strokeWidth={1.5} />
      <rect x={-26} y={-4} width={156} height={12} rx={6} fill="#8A5A2B" stroke="#5E3A1A" strokeWidth={1.5} />
      <circle cx={-28} cy={2} r={8} fill={C.gold} stroke={C.goldDark} strokeWidth={1.5} />
      <circle cx={132} cy={2} r={8} fill={C.gold} stroke={C.goldDark} strokeWidth={1.5} />
    </g>
  );
};
