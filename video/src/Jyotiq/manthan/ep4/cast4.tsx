import React from "react";
import { blinkAt, LOOKS, pose, Pose, Puppet, Who } from "../rig";

/*
 * Episode 4 cast: Mahadev, drawn with the SAME cut-out rig as every Manthan character (Episodes 1-3),
 * so line weight, cel shading, eyes and proportions match the series. The rig's look table is extended
 * at runtime with a "shiva" entry (no Episode 1-3 file is edited). Everything the rig has no part for
 * (seated lotus legs, tiger skin, crescent, Ganga, third eye, the throat, the serpent, the trishul) is
 * drawn here in the rig's own coordinates and style.
 *
 * Rig coordinates (facing +x, s = 1): origin at the waist, shoulders ~y -196, chin at NECK (6, -224),
 * the head group is translate(6 -224) rotate(head) scale(0.86) with the jata top near y -270 (head units).
 */
type Look = (typeof LOOKS)[keyof typeof LOOKS];

const SHIVA_LOOK: Look = {
  skin: "#93B4DA", skinShade: "#6B8DBA", skinLine: "#283E62", rim: "#E6F2FF",
  sclera: "#F6EFE2", iris: "#1E1A2E", glowColor: "#7FE7FF", lid: 0.42,
  brow: "#15182C", browW: 6,
  hair: "jata", hairColor: "#2B2438", hairShade: "#161220",
  tilak: "tripundra",
  thread: true, necklaces: 0, rudraksha: true,
  stole: ["#D8892E", "#3A2210"],
  dhoti: ["#D8892E", "#A85E1C", "#3A2210"],
  armlet: false, bracelet: "#5A2E1A", anklet: false, earring: "naga", chest: 1.04,
};
(LOOKS as unknown as Record<string, Look>).shiva = SHIVA_LOOK;
export const SHIVA = "shiva" as unknown as Who;

const NECK: [number, number] = [6, -224];
const HEAD_S = 0.86;
const TIGER = { fur: "#D8892E", furShade: "#A85E1C", stripe: "#21140C", belly: "#F1DDB4" };
const VK = { body: "#1F5A5A", shade: "#143C3E", belly: "#E9D9A6", hi: "#6FC4B6", line: "#0A1F21" };

/** Seated lotus legs on a tiger skin, drawn behind the torso (the rig draws its torso over the waist). */
const Lap: React.FC<{ id: string }> = ({ id }) => {
  const legs = "M-30 -14C-90 -12 -150 6 -170 44C-180 70 -160 96 -120 100C-50 108 60 110 140 102C186 96 204 70 196 44C184 8 120 -12 64 -14Z";
  return (
    <g>
      {/* the pelt spread on the rock */}
      <path d="M-236 92C-200 66 -70 76 20 74C120 72 230 64 262 92C276 106 260 126 230 130C120 140 -70 142 -206 130C-244 126 -254 108 -236 92Z" fill={TIGER.fur} />
      <path d="M-236 92C-200 66 -70 76 20 74C120 72 230 64 262 92C244 84 140 86 20 90C-90 92 -200 86 -236 92Z" fill={TIGER.belly} opacity={0.5} />
      {[-200, -140, -80, -16, 50, 116, 182, 236].map((x, i) => (
        <path key={x} d={`M${x} ${80 + (i % 2) * 4}C${x + 8} ${96} ${x - 4} ${112} ${x + 6} ${130}`} stroke={TIGER.stripe} strokeWidth={8} strokeLinecap="round" fill="none" />
      ))}
      {/* folded legs in the tiger-skin wrap */}
      <clipPath id={`${id}-lap`}>
        <path d={legs} />
      </clipPath>
      <path d={legs} fill={TIGER.fur} />
      <g clipPath={`url(#${id}-lap)`}>
        <path d="M-180 40C-110 26 -50 52 -26 112L-190 112Z" fill={TIGER.furShade} opacity={0.75} />
        <path d="M70 -14C130 -2 180 30 200 86L210 -14Z" fill="#FFE2B0" opacity={0.18} />
        {[-140, -92, -44, 4, 52, 100, 148].map((x) => (
          <path key={x} d={`M${x} -10C${x + 12} 20 ${x - 6} 52 ${x + 10} 86`} stroke={TIGER.stripe} strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.92} />
        ))}
        <path d="M-170 74C-80 92 70 94 196 74" stroke="#3A2210" strokeWidth={7} fill="none" opacity={0.7} />
      </g>
      {/* the upturned front foot (padmasana), resting on the back thigh */}
      <path d="M-4 22C24 8 74 10 98 28C108 38 100 52 80 52C54 52 22 46 4 38C-6 32 -10 26 -4 22Z" fill={SHIVA_LOOK.skin} />
      <path d="M4 38C26 46 54 51 80 52C98 50 106 42 100 34" stroke={SHIVA_LOOK.skinLine} strokeWidth={2.4} fill="none" opacity={0.5} />
      <path d="M12 26C30 20 58 20 80 28" stroke="#E07A6A" strokeWidth={3.4} fill="none" opacity={0.25} strokeLinecap="round" />
      {/* the gold-and-rudraksha waist cord */}
      <path d="M-56 -8C-20 2 32 2 66 -8" stroke="url(#mGold)" strokeWidth={6} fill="none" />
      <path d="M-54 0C-20 10 32 10 64 0" stroke="#5A2E1A" strokeWidth={7} strokeDasharray="0.1 10" strokeLinecap="round" fill="none" />
    </g>
  );
};

/** Overlays on the head (head units): the big crescent, the Ganga strand, the shut third eye, a halo. */
const HeadMarks: React.FC<{ f: number; moon: number; ganga: number; third: number }> = ({ f, moon, ganga, third }) => (
  <g>
    {/* Ganga: a fine, bright stream that springs from the jata and falls behind the back shoulder */}
    {ganga > 0 ? (
      <g opacity={ganga} fill="none" strokeLinecap="round">
        <path d="M-8 -258C-38 -262 -58 -236 -60 -200C-62 -160 -52 -130 -62 -96C-70 -66 -84 -36 -96 0" stroke="#9FDDF5" strokeWidth={4} opacity={0.55} />
        <path d="M-8 -258C-38 -262 -58 -236 -60 -200C-62 -160 -52 -130 -62 -96C-70 -66 -84 -36 -96 0" stroke="#F2FBFF" strokeWidth={1.4} strokeDasharray="6 30" strokeDashoffset={-f * 2.4} opacity={0.9} />
        {[0, 1, 2, 3].map((i) => {
          const k = ((f * 0.04 + i * 0.25) % 1 + 1) % 1;
          return <circle key={i} cx={-10 - 14 * k - 4 * i} cy={-262 - 10 * Math.sin(k * Math.PI)} r={2 * (1 - k)} fill="#E6F8FF" opacity={0.8 * (1 - k)} />;
        })}
      </g>
    ) : null}
    {/* the crescent moon, worn on the jata (set over the rig's small devotee crescent) */}
    <g opacity={moon} transform="translate(40 -220) rotate(-18)">
      <circle cx={0} cy={0} r={28} fill="#FFF1C8" opacity={0.2} filter="url(#mBlur8)" />
      <path d="M7 -20A21 21 0 1 0 7 20A16 16 0 1 1 7 -20Z" fill="#FFF6D8" />
      <path d="M7 -20A21 21 0 1 0 7 20" stroke="#E8C77A" strokeWidth={1.5} fill="none" opacity={0.8} />
    </g>
    {/* the third eye, shut, set vertically through the tripundra */}
    <g transform="translate(22 -116)" opacity={third}>
      <path d="M0 -12C5 -6 5 6 0 12C-5 6 -5 -6 0 -12Z" fill="#C2304A" opacity={0.85} />
      <path d="M0 -10V10" stroke="#5E0F22" strokeWidth={1.6} />
    </g>
  </g>
);

/** Vasuki as Shiva's neck ornament (same colours as Episodes 2-3): one slim coil hugging the base of
 * the neck, the tail tucked behind, and his hood raised beside the head at the front shoulder. */
const NeckSerpent: React.FC<{ f: number }> = ({ f }) => {
  const sway = Math.sin(f / 22) * 2.5;
  const coil = "M-34 -214C-30 -190 -6 -182 20 -184C40 -186 54 -194 60 -206";
  const neck = `M60 -206C76 -214 88 -222 ${92 + sway} -236`;
  const flick = Math.max(0, Math.sin(f / 7)) > 0.85 ? 1 : 0;
  return (
    <g strokeLinecap="round" fill="none">
      <path d={coil} stroke={VK.line} strokeWidth={13} />
      <path d={coil} stroke={VK.body} strokeWidth={9.5} />
      <path d="M-30 -208C-24 -192 -4 -187 20 -189C38 -190 50 -197 56 -206" stroke={VK.hi} strokeWidth={2.4} opacity={0.65} />
      <path d={coil} stroke={VK.shade} strokeWidth={9.5} strokeDasharray="0.1 9" opacity={0.7} />
      <path d={neck} stroke={VK.line} strokeWidth={11} />
      <path d={neck} stroke={VK.body} strokeWidth={7.5} />
      {/* the hood rises off the front shoulder, clear of the face: dark scales, a pale throat line, gold eyes */}
      <g transform={`translate(${94 + sway} -246) rotate(${10 + sway}) scale(0.78)`}>
        <path d="M0 22C-14 18 -26 4 -26 -12C-26 -28 -14 -40 0 -42C14 -40 26 -28 26 -12C26 4 14 18 0 22Z" fill={VK.body} stroke={VK.line} strokeWidth={2.8} />
        <path d="M-18 -10C-18 -24 -10 -34 0 -35C10 -34 18 -24 18 -10" stroke={VK.hi} strokeWidth={2.2} opacity={0.45} />
        <path d="M0 18L0 -26" stroke={VK.belly} strokeWidth={5} opacity={0.55} />
        <path d="M-9 -38C-9 -48 -4 -54 0 -54C4 -54 9 -48 9 -38Z" fill={VK.body} stroke={VK.line} strokeWidth={2.4} />
        <circle cx={-4} cy={-45} r={1.8} fill="#FFC23D" />
        <circle cx={4} cy={-45} r={1.8} fill="#FFC23D" />
        {flick ? <path d="M0 -54L0 -62M0 -62L-3 -66M0 -62L3 -66" stroke="#C2304A" strokeWidth={1.8} /> : null}
      </g>
    </g>
  );
};

/** The trishul with a damru tied below the prongs. Origin at the butt of the shaft, standing up (-y). */
export const Trishul: React.FC<{ glow?: number; f?: number }> = ({ glow = 0, f = 0 }) => (
  <g filter="url(#mCut)">
    {glow > 0 ? <ellipse cx={0} cy={-370} rx={70} ry={80} fill="#BFF6FF" opacity={0.25 * glow} filter="url(#mBlur8)" /> : null}
    <path d="M-4 0L4 0L4 -340L-4 -340Z" fill="#9AA6BC" />
    <path d="M1 0L4 0L4 -340L1 -340Z" fill="#E6ECF8" opacity={0.6} />
    {[-60, -200, -320].map((y) => (
      <path key={y} d={`M-6 ${y}L6 ${y}L6 ${y - 12}L-6 ${y - 12}Z`} fill="url(#mGold)" />
    ))}
    {/* prongs */}
    <path d="M-40 -362C-44 -392 -40 -420 -30 -446C-26 -420 -24 -396 -22 -372C-12 -360 12 -360 22 -372C24 -396 26 -420 30 -446C40 -420 44 -392 40 -362C30 -342 -30 -342 -40 -362Z" fill="#C8D2E6" />
    <path d="M-5 -350L-5 -440L0 -470L5 -440L5 -350Z" fill="#E6ECF8" />
    <path d="M-40 -362C-30 -342 30 -342 40 -362" stroke="url(#mGold)" strokeWidth={5} fill="none" />
    {/* damru on a red cord */}
    <g transform={`translate(10 -318) rotate(${Math.sin(f / 18) * 4})`}>
      <path d="M0 0C6 10 8 22 6 30" stroke="#B3262E" strokeWidth={3} fill="none" />
      <path d="M-14 30L26 30L14 52L26 74L-14 74L-2 52Z" fill="#8E4A16" />
      <path d="M-14 30L26 30M-14 74L26 74" stroke="url(#mGold)" strokeWidth={4} />
      <path d="M-8 34L20 70M20 34L-8 70" stroke="#F6EBD6" strokeWidth={1.4} opacity={0.6} />
    </g>
  </g>
);

export type ShivaProps = {
  id: string;
  f: number;
  x: number;
  y: number;
  s?: number;
  facing?: number;
  /** Partial rig pose (arms, head tilt, look, smile). */
  p?: Partial<Pose>;
  eyes?: number; // 0 shut .. 1 open
  talk?: number;
  throat?: number; // 0 .. 1 blue
  moon?: number;
  ganga?: number;
  third?: number;
  halo?: number;
  serpent?: boolean;
  /** Drawn in the front hand (the rig keeps it upright). */
  prop?: React.ReactNode;
  drain?: number;
};

/** Mahadev seated in padmasana on the tiger skin. (x, y) is the waist; the lap's base sits ~100*s below it. */
export const ShivaSeated: React.FC<ShivaProps> = ({
  id, f, x, y, s = 1, facing = 1, p = {}, eyes = 1, talk = 0, throat = 0, moon = 1, ganga = 1, third = 1,
  halo = 0.6, serpent = true, prop, drain = 0,
}) => {
  const blink = Math.max(1 - eyes, eyes > 0.95 ? blinkAt(`${id}-b`, f) : 0);
  const breath = Math.sin(f / 26) * 1.2;
  const q = pose({ sF: 18, eF: -10, wF: -6, sB: -16, eB: 44, wB: 10, lookX: 0.2, smile: 0.25, ...p, blink, talk, bob: breath });
  const head = `translate(${NECK[0]} ${NECK[1]}) rotate(${q.head}) scale(${HEAD_S})`;
  const pulse = 0.85 + 0.15 * Math.sin(f / 9);
  const grey = drain > 0 ? { filter: `saturate(${1 - 0.75 * drain}) brightness(${1 - 0.25 * drain})` } : undefined;
  const frame = `translate(${x} ${y + q.bob}) scale(${facing * s} ${s}) rotate(${q.sway})`;
  return (
    <g style={grey}>
      <defs>
        <radialGradient id={`${id}-thr`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#1F4FB8" stopOpacity={0.95} />
          <stop offset="0.55" stopColor="#2F6FD0" stopOpacity={0.75} />
          <stop offset="1" stopColor="#40D8E8" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* halo of cool moonlight behind the head */}
      {halo > 0 ? (
        <g transform={frame}>
          <g transform={`rotate(${q.lean}) ${head}`}>
            <circle cx={14} cy={-120} r={150} fill="#CFE7FF" opacity={0.16 * halo} filter="url(#mBlur8)" />
          </g>
        </g>
      ) : null}
      <g transform={frame} filter="url(#mCut)">
        <Lap id={id} />
      </g>
      <Puppet id={id} who={SHIVA} at={{ x, y, s, facing }} p={q} t={f} prop={prop} noLegs />
      <g transform={frame}>
        <g transform={`rotate(${q.lean})`}>
          {/* the throat: a soft blue that deepens as the poison is held there */}
          {throat > 0 ? (
            <g>
              <ellipse cx={10} cy={-214} rx={34} ry={22} fill="#7FE7FF" opacity={0.3 * throat * pulse} filter="url(#mBlur8)" />
              <ellipse cx={10} cy={-212} rx={22} ry={13} fill={`url(#${id}-thr)`} opacity={throat} />
            </g>
          ) : null}
          {serpent ? (
            <g filter="url(#mCut)">
              <NeckSerpent f={f} />
            </g>
          ) : null}
          <g transform={head}>
            <HeadMarks f={f} moon={moon} ganga={ganga} third={third} />
          </g>
        </g>
      </g>
    </g>
  );
};

/** The poison as he lifts it: a small dark-cyan flame orb, cupped in the palm (front-hand prop). */
export const PoisonOrb: React.FC<{ f: number; k?: number; r?: number }> = ({ f, k = 1, r = 26 }) => (
  <g transform={`translate(0 ${-r * 0.6}) scale(${k})`}>
    <circle cx={0} cy={0} r={r * 2.2} fill="#40D8E8" opacity={0.18} filter="url(#mBlur8)" />
    <path
      d={`M0 ${-r * 1.6}C${r * 0.5} ${-r * 0.9} ${r} ${-r * 0.4} ${r} ${r * 0.2}C${r} ${r * 0.8} ${r * 0.5} ${r} 0 ${r}C${-r * 0.5} ${r} ${-r} ${r * 0.8} ${-r} ${r * 0.2}C${-r} ${-r * 0.4} ${-r * 0.5} ${-r * 0.9} 0 ${-r * 1.6}Z`}
      fill="#0E1E3A"
      transform={`rotate(${Math.sin(f / 5) * 6})`}
    />
    <path
      d={`M0 ${-r * 1.0}C${r * 0.3} ${-r * 0.5} ${r * 0.55} ${-r * 0.1} ${r * 0.5} ${r * 0.3}C${r * 0.4} ${r * 0.7} ${-r * 0.4} ${r * 0.7} ${-r * 0.5} ${r * 0.3}C${-r * 0.55} ${-r * 0.1} ${-r * 0.3} ${-r * 0.5} 0 ${-r * 1.0}Z`}
      fill="#40D8E8"
      opacity={0.75 + 0.2 * Math.sin(f / 4)}
    />
    <circle cx={0} cy={r * 0.2} r={r * 0.22} fill="#E6FDFF" opacity={0.9} />
    <path d={`M${-r * 0.7} ${r * 0.9}Q0 ${r * 1.25} ${r * 0.7} ${r * 0.9}`} stroke="#9888D8" strokeWidth={3} fill="none" opacity={0.7} />
  </g>
);
