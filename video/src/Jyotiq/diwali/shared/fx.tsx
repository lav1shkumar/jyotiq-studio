import React from "react";
import { H, ramp, rnd, W, wob } from "../../manthan/style";
import { Diya } from "../d1/diya";

/* Diwali series shared effects in the Manthan look.
   DiyaWave: small diyas igniting one after another across a map, a city or a palace (needs DiyaDefs).
   Storm: Indra's storm, with cloud masses, slanted rain and lightning on seeded frames.
   DawnSky: a night-to-dawn sky ramp with the sun's glow rising at the horizon.
   TimeRewind: Kaal's hourglass and clock hands spinning back, the series' "back to the legend" device. */

/** Diyas at `points` ignite one by one from frame `at`, `step` frames apart, with a little glow pop. */
export const DiyaWave: React.FC<{ f: number; at: number; points: [number, number][]; step?: number; scale?: number; seed?: string }> = ({
  f, at, points, step = 3, scale = 0.35, seed = "dw",
}) => (
  <g>
    {points.map(([x, y], i) => {
      const t0 = at + i * step;
      const lit = ramp(f, t0, t0 + 8, "out");
      const pop = f >= t0 && f < t0 + 10 ? 1 - (f - t0) / 10 : 0;
      return (
        <g key={i} transform={`translate(${x} ${y})`}>
          {pop > 0 ? <circle r={60 * scale * 3} fill="#FFE6A3" opacity={0.45 * pop} filter="url(#mBlur8)" /> : null}
          <Diya f={f} lit={lit} seed={`${seed}${i}`} scale={scale} glow={0.6} />
        </g>
      );
    })}
  </g>
);

/** Points on a gentle grid inside a box, jittered (for diya waves over towns and maps). */
export const scatter = (n: number, x0: number, y0: number, w: number, h: number, seed: string): [number, number][] =>
  Array.from({ length: n }, (_, i) => [x0 + rnd(`${seed}x${i}`) * w, y0 + rnd(`${seed}y${i}`) * h] as [number, number]).sort((a, b) => a[0] - b[0]);

const Cloud: React.FC<{ x: number; y: number; s: number; tone: string; rim: string }> = ({ x, y, s, tone, rim }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[
      [-120, 10, 90],
      [-40, -30, 110],
      [60, -10, 100],
      [140, 20, 80],
      [10, 30, 120],
    ].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill={tone} />
    ))}
    <path d="M-200 40C-100 70 100 70 220 40" stroke={rim} strokeWidth={6} fill="none" opacity={0.5} />
  </g>
);

/** Indra's storm. k 0..1 = intensity. Lightning strikes on seeded frames; `flash` lets the caller force one. */
export const Storm: React.FC<{ f: number; k?: number; seed?: string; flash?: number }> = ({ f, k = 1, seed = "st", flash = 0 }) => {
  const period = 46;
  const ph = f % period;
  const strike = Math.max(flash, ph < 6 && rnd(`${seed}${Math.floor(f / period)}`) > 0.25 ? 1 - ph / 6 : 0);
  const bx = 200 + rnd(`${seed}b${Math.floor(f / period)}`) * 680;
  const bolt = `M${bx} 180L${bx - 40} 420L${bx + 10} 430L${bx - 50} 700L${bx + 30} 460L${bx - 14} 450L${bx + 40} 180Z`;
  return (
    <g opacity={k}>
      <rect x={-40} y={-40} width={W + 80} height={H + 80} fill="#0E1426" opacity={0.6} />
      {/* rain: slanted streaks, three depths */}
      {Array.from({ length: 140 }, (_, i) => {
        const depth = i % 3;
        const sp = 38 + depth * 14;
        const x = (rnd(`${seed}rx${i}`) * (W + 300) - 150 + f * (6 + depth * 2)) % (W + 300) - 150;
        const y = ((rnd(`${seed}ry${i}`) * (H + 200) + f * sp) % (H + 200)) - 100;
        const len = 30 + depth * 18;
        return <line key={i} x1={x} y1={y} x2={x - len * 0.35} y2={y + len} stroke="#BFD6FF" strokeWidth={1.5 + depth} opacity={0.18 + depth * 0.12} />;
      })}
      {/* clouds rolling across the top */}
      {[0, 1, 2, 3].map((i) => (
        <Cloud key={i} x={((i * 320 + f * (0.6 + i * 0.2)) % (W + 600)) - 300} y={120 + (i % 2) * 90 + wob(`${seed}c${i}`, f / 40) * 12} s={1.3 - i * 0.12} tone={i % 2 ? "#2A3048" : "#353C58"} rim={strike > 0.3 ? "#DDE8FF" : "#5A6488"} />
      ))}
      {strike > 0.01 ? (
        <g>
          <path d={bolt} fill="#F4F8FF" opacity={strike} />
          <path d={bolt} fill="none" stroke="#9FC4FF" strokeWidth={10} opacity={0.5 * strike} filter="url(#mBlur8)" />
          <rect x={-40} y={-40} width={W + 80} height={H + 80} fill="#DDE8FF" opacity={0.35 * strike} />
        </g>
      ) : null}
    </g>
  );
};

/** Night to dawn as k goes 0..1; the sun's glow rises at the horizon (y). */
export const DawnSky: React.FC<{ k: number; y?: number }> = ({ k, y = 1250 }) => {
  const e = Math.max(0, Math.min(1, k));
  return (
    <g>
      <defs>
        <linearGradient id="dsNight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0A0818" />
          <stop offset="1" stopColor="#1A1236" />
        </linearGradient>
        <linearGradient id="dsDawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A4A82" />
          <stop offset="0.55" stopColor="#C8708A" />
          <stop offset="0.75" stopColor="#FFB060" />
          <stop offset="1" stopColor="#FFE2A6" />
        </linearGradient>
        <radialGradient id="dsSun">
          <stop offset="0" stopColor="#FFF6D8" stopOpacity="1" />
          <stop offset="0.4" stopColor="#FFD27A" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FF9A40" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={-40} y={-40} width={W + 80} height={H + 80} fill="url(#dsNight)" />
      <rect x={-40} y={-40} width={W + 80} height={H + 80} fill="url(#dsDawn)" opacity={e} />
      <circle cx={W / 2} cy={y + 120 - 160 * e} r={160 + 260 * e} fill="url(#dsSun)" opacity={e} />
    </g>
  );
};

/** Kaal's time-rewind: a clock whose hands spin backward round an hourglass whose sand runs up. */
export const TimeRewind: React.FC<{ f: number; k: number; x?: number; y?: number; s?: number }> = ({ f, k, x = 540, y = 900, s = 1 }) => {
  if (k <= 0.01) return null;
  const spin = -f * 14;
  const sand = (f % 30) / 30;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (0.8 + 0.2 * k)})`} opacity={Math.min(1, k * 1.5)}>
      {[0, 1, 2].map((i) => (
        <circle key={i} r={300 + i * 40} fill="none" stroke="#FFD36B" strokeWidth={3 - i} opacity={0.35 - i * 0.1} strokeDasharray={`${40 + i * 20} ${30 + i * 10}`} strokeDashoffset={f * (6 + i * 3)} />
      ))}
      <circle r={280} fill="#0C0A1C" opacity={0.55} stroke="#DFB15B" strokeWidth={4} />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={0} y1={-250} x2={0} y2={-228} stroke="#F3DB9D" strokeWidth={4} transform={`rotate(${i * 30})`} />
      ))}
      <g transform={`rotate(${spin})`}>
        <path d="M-6 0L0 -220L6 0Z" fill="#FFD36B" />
      </g>
      <g transform={`rotate(${spin / 12})`}>
        <path d="M-9 0L0 -150L9 0Z" fill="#F3DB9D" />
      </g>
      {/* hourglass */}
      <g transform="translate(0 0) scale(0.9)">
        <path d="M-80 -150L80 -150L10 0L80 150L-80 150L-10 0Z" fill="#FFF3C9" opacity={0.18} stroke="#DFB15B" strokeWidth={4} />
        <rect x={-90} y={-166} width={180} height={16} rx={6} fill="url(#mGold)" />
        <rect x={-90} y={150} width={180} height={16} rx={6} fill="url(#mGold)" />
        {/* the sand runs upward: rewinding */}
        <path d={`M${-60 + 50 * sand} -140L${60 - 50 * sand} -140L10 ${-10 + 0 * sand}L-10 ${-10}Z`} fill="#FFD36B" opacity={0.85} />
        <path d={`M-70 ${140 - 70 * (1 - sand)}L70 ${140 - 70 * (1 - sand)}L70 140L-70 140Z`} fill="#FFD36B" opacity={0.85} />
        <line x1={0} y1={0} x2={0} y2={-130} stroke="#FFE6A3" strokeWidth={3} strokeDasharray="6 8" strokeDashoffset={f * 6} />
      </g>
      <circle r={12} fill="url(#mGold)" />
    </g>
  );
};
