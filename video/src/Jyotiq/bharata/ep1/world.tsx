import React from "react";
import { Stars } from "../../manthan/sets";
import { P } from "../../manthan/style";
import { rnd } from "../../navagraha/ep1/anim";

/*
 * भारत Ep1 sets, flat cut-out style (Manthan / Navagraha kit) in a 1080 x 1920 SVG. Pure functions of the frame f.
 *  RiverSet: the Ganga below Hastinapur. moods: "storm" (the cold open: indigo-crimson dusk, lightning), "dawn" (gold, the
 *  promise), "dusk" (the sons), "mist" (years later). Far bank: Hastinapur's palaces, shikharas and elephant banners.
 *  CourtSet: the Hastinapur sabha (pillars, drapes, the elephant throne). Plus water overlays, vortex, splash, soul lights,
 *  the arrow dam and the Kurukshetra flash-forward.
 */
const W = 1080;
const H = 1920;
export const HORIZON = 1010;

export const BhDefs: React.FC = () => (
  <defs>
    <linearGradient id="bhStorm" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#0B0A26" />
      <stop offset="0.3" stopColor="#25184A" />
      <stop offset="0.45" stopColor="#5A1E46" />
      <stop offset="0.52" stopColor="#B33A2E" />
      <stop offset="0.56" stopColor="#F08A3A" />
      <stop offset="1" stopColor="#F08A3A" />
    </linearGradient>
    <linearGradient id="bhDawn" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#3E6DA8" />
      <stop offset="0.3" stopColor="#9FB4D8" />
      <stop offset="0.46" stopColor="#FFD9A0" />
      <stop offset="0.53" stopColor="#FFB45A" />
      <stop offset="1" stopColor="#FFB45A" />
    </linearGradient>
    <linearGradient id="bhDusk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#141238" />
      <stop offset="0.32" stopColor="#3A2460" />
      <stop offset="0.48" stopColor="#8A3A5A" />
      <stop offset="0.53" stopColor="#E0784A" />
      <stop offset="1" stopColor="#E0784A" />
    </linearGradient>
    <linearGradient id="bhMist" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#8FB6C8" />
      <stop offset="0.35" stopColor="#CFE2E6" />
      <stop offset="0.52" stopColor="#FFF0D2" />
      <stop offset="1" stopColor="#FFF0D2" />
    </linearGradient>
    <linearGradient id="bhRiverStorm" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#C8603A" />
      <stop offset="0.18" stopColor="#3A2A5A" />
      <stop offset="1" stopColor="#0E1030" />
    </linearGradient>
    <linearGradient id="bhRiverDawn" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFD08A" />
      <stop offset="0.2" stopColor="#5AA8B8" />
      <stop offset="1" stopColor="#1E5A78" />
    </linearGradient>
    <linearGradient id="bhRiverDusk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#E0905A" />
      <stop offset="0.2" stopColor="#3A3E78" />
      <stop offset="1" stopColor="#14163E" />
    </linearGradient>
    <linearGradient id="bhRiverMist" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFF0D2" />
      <stop offset="0.2" stopColor="#8CC4CE" />
      <stop offset="1" stopColor="#3A7E92" />
    </linearGradient>
    <linearGradient id="bhWater" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#7FD8E6" stopOpacity="0.85" />
      <stop offset="0.15" stopColor="#2E7E9A" stopOpacity="0.9" />
      <stop offset="1" stopColor="#123A5A" stopOpacity="0.97" />
    </linearGradient>
    <radialGradient id="bhSoul" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#FFFFFF" />
      <stop offset="0.3" stopColor="#FFF0B8" />
      <stop offset="0.7" stopColor="#FFC94D" stopOpacity="0.4" />
      <stop offset="1" stopColor="#FF9A1F" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="bhGlowTeal" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
      <stop offset="0.3" stopColor="#BFF6FA" stopOpacity="0.7" />
      <stop offset="1" stopColor="#3FC1C9" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="bhStone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#B8876A" />
      <stop offset="1" stopColor="#6A4232" />
    </linearGradient>
    <linearGradient id="bhCourt" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#3A0E1A" />
      <stop offset="0.6" stopColor="#7A1E26" />
      <stop offset="1" stopColor="#2A0A10" />
    </linearGradient>
    <linearGradient id="bhWar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#2A0A10" />
      <stop offset="0.4" stopColor="#8A1E1A" />
      <stop offset="0.62" stopColor="#F07A2A" />
      <stop offset="0.72" stopColor="#FFC46A" />
      <stop offset="1" stopColor="#3A140E" />
    </linearGradient>
    <filter id="bhBlur6">
      <feGaussianBlur stdDeviation="6" />
    </filter>
    <filter id="bhBlur20">
      <feGaussianBlur stdDeviation="20" />
    </filter>
  </defs>
);

type Mood = "storm" | "dawn" | "dusk" | "mist";
const SKY: Record<Mood, string> = { storm: "bhStorm", dawn: "bhDawn", dusk: "bhDusk", mist: "bhMist" };
const RIVER: Record<Mood, string> = { storm: "bhRiverStorm", dawn: "bhRiverDawn", dusk: "bhRiverDusk", mist: "bhRiverMist" };
const SIL: Record<Mood, string> = { storm: "#1A0E26", dawn: "#7A5A6A", dusk: "#22163A", mist: "#9AB0B8" };
const GLINT: Record<Mood, string> = { storm: "#FFB06A", dawn: "#FFF2C8", dusk: "#FFC08A", mist: "#FFFFFF" };

/** A Hastinapur palace silhouette: plinth, pillared hall, domes and a central shikhara with a flag. */
const Palace: React.FC<{ x: number; y: number; s: number; c: string; f: number; flag?: boolean }> = ({ x, y, s, c, f, flag = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={c}>
    <rect x={-200} y={-60} width={400} height={60} />
    <rect x={-170} y={-150} width={340} height={90} />
    {[-140, -90, -40, 10, 60, 110].map((px) => <rect key={px} x={px} y={-140} width={16} height={80} fill={c} opacity={0.9} />)}
    <path d="M-170 -150L-150 -180L150 -180L170 -150Z" />
    {[-130, 130].map((dx) => (
      <g key={dx} transform={`translate(${dx} -180)`}>
        <rect x={-30} y={-60} width={60} height={60} />
        <path d="M-36 -60C-36 -100 36 -100 36 -60Z" />
        <path d="M0 -100L0 -120" stroke={c} strokeWidth={4} />
      </g>
    ))}
    <path d="M-70 -180L-60 -260C-40 -320 -20 -370 0 -410C20 -370 40 -320 60 -260L70 -180Z" />
    <circle cx={0} cy={-418} r={12} />
    {flag ? (
      <g>
        <path d="M0 -430L0 -500" stroke={c} strokeWidth={5} />
        <path d={`M0 -500L${70 + 6 * Math.sin(f / 6)} ${-488 + 6 * Math.sin(f / 5)}L0 -470Z`} fill="#C8202E" opacity={0.9} />
      </g>
    ) : null}
  </g>
);

const Lightning: React.FC<{ f: number; at: number[]; x: number }> = ({ f, at, x }) => {
  const k = at.reduce((m, a) => Math.max(m, f >= a && f < a + 6 ? 1 - (f - a) / 6 : 0), 0);
  if (k <= 0) return null;
  return (
    <g opacity={k}>
      <rect width={W} height={HORIZON} fill="#C8C0FF" opacity={0.25 * k} />
      <path d={`M${x} 120L${x - 40} 300L${x + 10} 310L${x - 60} 520L${x - 10} 528L${x - 90} 760`} stroke="#F4F0FF" strokeWidth={6} fill="none" strokeLinejoin="round" />
      <path d={`M${x} 120L${x - 40} 300L${x + 10} 310L${x - 60} 520L${x - 10} 528L${x - 90} 760`} stroke="#B8A8FF" strokeWidth={18} fill="none" opacity={0.4} filter="url(#bhBlur6)" />
    </g>
  );
};

/** The Ganga below Hastinapur. steps: draw the stone ghat in the foreground (bottom of frame). */
export const RiverSet: React.FC<{ f: number; mood?: Mood; steps?: boolean; sunX?: number; bolts?: number[] }> = ({ f, mood = "storm", steps = true, sunX = 760, bolts = [] }) => {
  const sil = SIL[mood];
  return (
    <g>
      <rect width={W} height={H} fill={`url(#${SKY[mood]})`} />
      {mood === "storm" || mood === "dusk" ? <Stars f={f} n={50} y1={620} seed="bhs" o={mood === "dusk" ? 0.9 : 0.5} /> : null}
      {/* sun disc low on the horizon */}
      <circle cx={sunX} cy={HORIZON - 40} r={mood === "mist" ? 120 : 90} fill={mood === "dawn" || mood === "mist" ? "#FFF6D8" : "#FFCF8A"} opacity={mood === "storm" ? 0.55 : 0.9} />
      <circle cx={sunX} cy={HORIZON - 40} r={320} fill="#FFC46A" opacity={mood === "mist" ? 0.12 : 0.18} filter="url(#bhBlur20)" />
      {/* clouds: long bands, slowly drifting */}
      {Array.from({ length: 6 }, (_, i) => {
        const y = 260 + i * 110;
        const x = ((i * 260 + f * (0.25 + i * 0.05)) % 1500) - 300;
        const c = mood === "storm" ? (i % 2 ? "#2E1E50" : "#3E2058") : mood === "dawn" ? "#FFE8C8" : mood === "dusk" ? "#4A2A62" : "#FFFFFF";
        return <path key={i} d={`M${x} ${y}c80 -60 200 -60 260 -10c50 -40 140 -30 170 20c40 0 70 20 80 40L${x - 40} ${y + 50}c-20 -30 0 -50 40 -50Z`} fill={c} opacity={mood === "mist" ? 0.55 : 0.75} />;
      })}
      <Lightning f={f} at={bolts} x={300} />
      {/* far bank: Hastinapur */}
      <g>
        <path d={`M0 ${HORIZON}L0 ${HORIZON - 30}C120 ${HORIZON - 50} 240 ${HORIZON - 20} 380 ${HORIZON - 36}C520 ${HORIZON - 50} 700 ${HORIZON - 26} 860 ${HORIZON - 40}C960 ${HORIZON - 48} 1040 ${HORIZON - 34} 1080 ${HORIZON - 30}L1080 ${HORIZON}Z`} fill={sil} />
        <Palace x={250} y={HORIZON - 30} s={0.62} c={sil} f={f} />
        <Palace x={560} y={HORIZON - 36} s={0.42} c={sil} f={f} flag={false} />
        <Palace x={900} y={HORIZON - 34} s={0.5} c={sil} f={f} />
        {[60, 420, 720, 1040].map((x, i) => (
          <g key={x} transform={`translate(${x} ${HORIZON - 30})`} fill={sil}>
            <rect x={-4} y={-80} width={8} height={80} />
            <circle cy={-100} r={34 + (i % 2) * 10} />
            <circle cx={-26} cy={-80} r={24} />
            <circle cx={26} cy={-84} r={26} />
          </g>
        ))}
      </g>
      {/* the river */}
      <rect x={0} y={HORIZON} width={W} height={H - HORIZON} fill={`url(#${RIVER[mood]})`} />
      {Array.from({ length: 14 }, (_, i) => {
        const yy = HORIZON + 14 + i * 30;
        const ww = 80 + i * 14 + 26 * Math.sin(f / 10 + i);
        return <rect key={i} x={sunX - ww / 2 + Math.sin(f / 14 + i * 1.3) * 16} y={yy} width={ww} height={5} rx={2.5} fill={GLINT[mood]} opacity={(mood === "storm" ? 0.5 : 0.7) - i * 0.035} />;
      })}
      {Array.from({ length: 10 }, (_, i) => {
        const yy = HORIZON + 60 + i * 60;
        const x = ((i * 233 + f * (1.1 + (i % 3) * 0.4)) % 1300) - 120;
        return <path key={i} d={`M${x} ${yy}q40 -10 80 0q40 10 80 0`} stroke={mood === "mist" || mood === "dawn" ? "#E8FAFF" : "#7A8AD0"} strokeWidth={3} fill="none" opacity={0.35} />;
      })}
      {steps ? <Ghat f={f} mood={mood} /> : null}
    </g>
  );
};

/** Stone ghat steps across the bottom-left, a carved pillar with a brass lamp. */
const Ghat: React.FC<{ f: number; mood: Mood }> = ({ f, mood }) => {
  const dark = mood === "storm" || mood === "dusk";
  return (
    <g>
      {Array.from({ length: 5 }, (_, i) => {
        const y0 = 1560 + i * 72;
        return (
          <g key={i}>
            <path d={`M0 ${y0}L${560 + i * 120} ${y0}L${560 + i * 120} ${y0 + 72}L0 ${y0 + 72}Z`} fill={dark ? (i % 2 ? "#4A3036" : "#583A40") : i % 2 ? "#B8876A" : "#C99878"} />
            <rect x={0} y={y0} width={560 + i * 120} height={6} fill={dark ? "#8A6A6A" : "#F2D2B0"} opacity={0.6} />
          </g>
        );
      })}
      <g transform="translate(70 1560)">
        <rect x={-26} y={-260} width={52} height={260} fill={dark ? "#3A2228" : "#A87458"} />
        <rect x={-36} y={-280} width={72} height={24} fill={dark ? "#5A3A40" : "#C99878"} />
        <path d="M-20 -300L20 -300L12 -280L-12 -280Z" fill="url(#mGold)" />
        <ellipse cx={0} cy={-312} rx={10} ry={16 + 3 * Math.sin(f / 3)} fill="#FFC23A" />
        <ellipse cx={0} cy={-308} rx={5} ry={9} fill="#FFF6D0" />
        <circle cx={0} cy={-310} r={60} fill="#FFB04A" opacity={0.2} filter="url(#bhBlur6)" />
      </g>
    </g>
  );
};

/** Foreground water a figure stands in: drawn after the figure, its top edge at y (waves), fading in alpha. */
export const WaterFront: React.FC<{ f: number; y: number; x0?: number; x1?: number; o?: number }> = ({ f, y, x0 = -40, x1 = W + 40, o = 1 }) => {
  const id = `wf${Math.round(x0)}_${Math.round(x1)}`;
  const soft = x0 > 0 || x1 < W;
  const n = 12;
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const x = x0 + ((x1 - x0) * i) / n;
    return `${i ? "L" : "M"}${x.toFixed(1)} ${(y + 8 * Math.sin(f / 9 + i * 0.9)).toFixed(1)}`;
  }).join("");
  return (
    <g opacity={o} mask={soft ? `url(#${id})` : undefined}>
      {soft ? (
        <defs>
          <linearGradient id={`${id}g`} x1={x0} y1="0" x2={x1} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity={x0 > 0 ? 0 : 1} />
            <stop offset="0.22" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="0.78" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity={x1 < W ? 0 : 1} />
          </linearGradient>
          <mask id={id} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
            <rect x={0} y={0} width={W} height={H} fill={`url(#${id}g)`} />
          </mask>
        </defs>
      ) : null}
      <path d={`${pts}L${x1} ${H + 40}L${x0} ${H + 40}Z`} fill="url(#bhWater)" />
      <path d={pts} stroke="#DFF8FF" strokeWidth={4} fill="none" opacity={0.8} />
      {Array.from({ length: 6 }, (_, i) => (
        <ellipse key={i} cx={x0 + 80 + ((i * 170 + f * 1.4) % (x1 - x0 - 160))} cy={y + 40 + i * 26} rx={60} ry={5} fill="#BFEFFF" opacity={0.25} />
      ))}
    </g>
  );
};

/** Ripple rings on the water surface around (x, y). */
export const Ripples: React.FC<{ f: number; x: number; y: number; k?: number; n?: number }> = ({ f, x, y, k = 1, n = 3 }) => (
  <g opacity={k}>
    {Array.from({ length: n }, (_, i) => {
      const u = ((f + i * (40 / n)) % 40) / 40;
      return <ellipse key={i} cx={x} cy={y} rx={40 + 180 * u} ry={8 + 30 * u} fill="none" stroke="#E8FBFF" strokeWidth={3} opacity={(1 - u) * 0.7} />;
    })}
  </g>
);

/** A rising water vortex (the goddess leaves): spiralling ribbons around (x, y); k 0..1 builds it. */
export const Vortex: React.FC<{ f: number; x: number; y: number; k: number; h?: number }> = ({ f, x, y, k, h = 900 }) => {
  if (k <= 0.001) return null;
  return (
    <g transform={`translate(${x} ${y})`} opacity={Math.min(1, k * 1.5)}>
      <ellipse rx={260 * k} ry={60 * k} fill="#BFF6FA" opacity={0.4} filter="url(#bhBlur6)" />
      {Array.from({ length: 9 }, (_, i) => {
        const ph = f / 5 + i * 0.7;
        const top = -h * k * (0.55 + 0.45 * ((i * 37) % 9) / 9);
        const r0 = 240 * k;
        const d = Array.from({ length: 18 }, (_, j) => {
          const u = j / 17;
          const a = ph + u * 5.5;
          const r = r0 * (1 - u * 0.65);
          return `${j ? "L" : "M"}${(Math.cos(a) * r).toFixed(1)} ${(top * u + Math.sin(a) * r * 0.22).toFixed(1)}`;
        }).join("");
        return <path key={i} d={d} stroke={i % 2 ? "#DFFBFF" : "#7FD8E6"} strokeWidth={8 - (i % 3) * 2} fill="none" strokeLinecap="round" opacity={0.75} />;
      })}
      <ellipse cy={-h * k * 0.5} rx={90 * k} ry={h * k * 0.5} fill="url(#bhGlowTeal)" opacity={0.55} />
    </g>
  );
};

/** A big splash crown and droplets at (x, y), 0..1 over its life u. */
export const Splash: React.FC<{ x: number; y: number; u: number; s?: number }> = ({ x, y, u, s = 1 }) => {
  if (u <= 0 || u >= 1) return null;
  const o = 1 - u;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      {Array.from({ length: 14 }, (_, i) => {
        const a = -Math.PI * (0.1 + (0.8 * i) / 13);
        const r = 60 + 360 * u;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r * 1.4 + 500 * u * u;
        return <ellipse key={i} cx={px} cy={py} rx={9} ry={16} fill="#E8FBFF" transform={`rotate(${(a * 180) / Math.PI + 90} ${px} ${py})`} />;
      })}
      <path d={`M${-160 - 80 * u} 0C${-120} ${-200 * (1 - u)} -40 ${-260 * (1 - u * 0.6)} 0 ${-120 * (1 - u)}C40 ${-260 * (1 - u * 0.6)} 120 ${-200 * (1 - u)} ${160 + 80 * u} 0Z`} fill="#CFF4FA" opacity={0.85} />
      <ellipse rx={200 + 160 * u} ry={30 + 20 * u} fill="#E8FBFF" opacity={0.7} />
    </g>
  );
};

/** A son's soul light floating on / rising from the river: a lamp-like glowing orb. */
export const SoulLight: React.FC<{ f: number; x: number; y: number; s?: number; k?: number; seed?: number }> = ({ f, x, y, s = 1, k = 1, seed = 0 }) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 10 + seed) * 4}) scale(${s})`} opacity={k}>
    <circle r={70} fill="url(#bhSoul)" opacity={0.8} />
    <circle r={16} fill="#FFFDF0" />
    <path d="M-34 14Q0 30 34 14" stroke="#FFE7A0" strokeWidth={4} fill="none" opacity={0.6} />
  </g>
);

/** The arrow dam: Devavrata's arrows lodged across the river (u 0..1 fills it left to right); water heaped behind. */
export const ArrowDam: React.FC<{ f: number; y: number; u: number }> = ({ f, y, u }) => {
  const n = 22;
  return (
    <g>
      <path d={`M-20 ${y - 30}C200 ${y - 60 - 20 * u} 600 ${y - 70 - 20 * u} 1100 ${y - 40}L1100 ${y + 10}L-20 ${y + 10}Z`} fill="#8CD6E2" opacity={0.6 * u} />
      {Array.from({ length: n }, (_, i) => {
        const x = 20 + (i * 1040) / (n - 1);
        const at = i / n;
        if (u < at) return null;
        const k = Math.min(1, (u - at) * 8);
        const rot = -8 + rnd(i, 3) * 16;
        return (
          <g key={i} transform={`translate(${x} ${y + 20}) rotate(${rot})`} opacity={k}>
            <path d={`M0 0L0 ${-150 * k}`} stroke="#6A3A1C" strokeWidth={5} />
            <path d={`M0 ${-150 * k}l-10 -22l10 6l10 -6Z`} fill={i % 2 ? "#E8E2D2" : "#C8102E"} />
            <path d="M-8 0L8 0" stroke="#3A2A1A" strokeWidth={4} />
          </g>
        );
      })}
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${((i * 160 + f * 2) % 1200) - 60} ${y + 26}q30 -8 60 0`} stroke="#E8FBFF" strokeWidth={3} fill="none" opacity={0.5 * u} />
      ))}
    </g>
  );
};

/** Hastinapur sabha: carved red sandstone pillars, crimson drapes, a gold elephant throne under a chhatra. */
export const CourtSet: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="url(#bhCourt)" />
    <path d="M140 1250L140 520C140 330 320 220 540 220C760 220 940 330 940 520L940 1250Z" fill="#4A1220" />
    <path d="M200 1250L200 540C200 380 350 290 540 290C730 290 880 380 880 540L880 1250Z" fill="#2A0810" />
    <path d="M200 540C200 380 350 290 540 290C730 290 880 380 880 540" stroke="url(#mGold)" strokeWidth={10} fill="none" />
    {/* the chhatra (royal umbrella) and the throne */}
    <g transform="translate(540 780)">
      <path d="M-170 -260C-120 -340 120 -340 170 -260Z" fill="#E8B24A" stroke={P.goldDeep} strokeWidth={3} />
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-160 + i * 40} cy={-252} r={7} fill="#FFFDF4" />)}
      <path d="M0 -340L0 -380" stroke={P.goldDeep} strokeWidth={6} />
      <rect x={-150} y={-60} width={300} height={260} rx={30} fill="#C8202E" stroke="url(#mGold)" strokeWidth={10} />
      <rect x={-190} y={180} width={380} height={70} rx={14} fill="url(#mGold)" />
      {[-1, 1].map((sd) => (
        <g key={sd} transform={`translate(${sd * 190} 160) scale(${sd} 1)`}>
          {/* a gold elephant armrest (Hastinapur, the city of elephants) */}
          <path d="M0 0C0 -70 30 -110 80 -110C120 -110 140 -80 140 -40L140 20L110 20L110 -10L70 -10L70 20L40 20L40 -10Z" fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={2} />
          <path d="M140 -40C160 -30 166 0 156 30" stroke="url(#mGold)" strokeWidth={14} fill="none" strokeLinecap="round" />
          <circle cx={110} cy={-70} r={6} fill="#2A0A10" />
          <path d="M60 -110C70 -130 100 -136 116 -120" fill="#C8202E" />
        </g>
      ))}
    </g>
    {/* pillars */}
    {[60, 1020].map((x) => (
      <g key={x} transform={`translate(${x} 0)`}>
        <rect x={-60} y={200} width={120} height={1150} fill="#B0543A" />
        <rect x={-60} y={200} width={30} height={1150} fill="#7A2E22" opacity={0.6} />
        {[260, 520, 780, 1040].map((y) => (
          <g key={y}>
            <rect x={-70} y={y} width={140} height={26} fill="url(#mGold)" />
            <path d={`M-50 ${y + 40}L0 ${y + 90}L50 ${y + 40}`} stroke="#E8B24A" strokeWidth={4} fill="none" opacity={0.7} />
          </g>
        ))}
      </g>
    ))}
    {/* drapes */}
    {[[0, 1], [W, -1]].map(([x, sd]) => (
      <path key={x} d={`M${x} 0L${x + sd * 330} 0C${x + sd * 250} ${120 + 6 * Math.sin(f / 20)} ${x + sd * 150} 260 ${x + sd * 60} 420L${x} 440Z`} fill="#8E1424" />
    ))}
    <path d="M0 0L1080 0L1080 60L0 60Z" fill="url(#mGold)" opacity={0.85} />
    {/* floor */}
    <rect x={0} y={1250} width={W} height={H - 1250} fill="#3A1218" />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${540 + (i - 3.5) * 60} 1250L${540 + (i - 3.5) * 320} ${H}`} stroke="#5A2028" strokeWidth={3} />)}
    {[1300, 1420, 1600, 1840].map((y) => <path key={y} d={`M0 ${y}L${W} ${y}`} stroke="#5A2028" strokeWidth={3} />)}
    {/* oil lamps */}
    {[300, 780].map((x, i) => (
      <g key={x} transform={`translate(${x} 1240)`}>
        <rect x={-6} y={-120} width={12} height={120} fill="url(#mGold)" />
        <ellipse cx={0} cy={-132} rx={9} ry={15 + 3 * Math.sin(f / 3 + i)} fill="#FFC23A" />
        <circle cx={0} cy={-130} r={70} fill="#FFB04A" opacity={0.18} filter="url(#bhBlur6)" />
      </g>
    ))}
  </g>
);

/** Kurukshetra flash-forward: a blood-orange sky, chariot banners and dust; dark ground. */
export const WarSet: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="url(#bhWar)" />
    <circle cx={540} cy={1180} r={200} fill="#FFE2A0" opacity={0.9} />
    <circle cx={540} cy={1180} r={520} fill="#FFB04A" opacity={0.25} filter="url(#bhBlur20)" />
    {Array.from({ length: 11 }, (_, i) => {
      const x = 40 + i * 100;
      const h = 220 + ((i * 53) % 90);
      return (
        <g key={i} fill="#2A0A0A">
          <path d={`M${x} 1330L${x} ${1330 - h}`} stroke="#2A0A0A" strokeWidth={6} />
          <path d={`M${x} ${1330 - h}L${x + 60 + 8 * Math.sin(f / 6 + i)} ${1330 - h + 14}L${x} ${1330 - h + 34}Z`} />
          <path d={`M${x - 50} 1330L${x + 50} 1330L${x + 40} 1290L${x - 40} 1290Z`} />
          <circle cx={x - 36} cy={1336} r={22} fill="none" stroke="#2A0A0A" strokeWidth={6} />
        </g>
      );
    })}
    <rect x={0} y={1330} width={W} height={H - 1330} fill="#200808" />
    {Array.from({ length: 20 }, (_, i) => (
      <circle key={i} cx={(i * 97 + f * 1.5) % W} cy={1250 + ((i * 41) % 200)} r={30 + (i % 4) * 14} fill="#B0603A" opacity={0.12} />
    ))}
  </g>
);
