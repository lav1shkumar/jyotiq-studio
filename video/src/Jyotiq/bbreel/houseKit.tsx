import React from "react";
import { random } from "remotion";
import { CAST } from "../fight/cast";
import { Layer } from "../fight/FightHook";
import { FigureSpec, Joints, livePose, solve } from "../fight/rig";
import { SetBack, SetDefs, SetMid } from "../fight/set";
import { SANS } from "../theme";

/* Pieces shared by the house scenes (2, 3, 4) and the ball. */

export const ALL_CAST: FigureSpec[] = [...CAST.back, ...CAST.mid, ...CAST.front, ...CAST.fg];

/** The house set + cast at cast-frame `tf`, inside a 1080x1920 SVG. `over` draws above everything. */
export const HouseSVG: React.FC<{ tf: number; figures?: number; lamp?: number; over?: React.ReactNode }> = ({ tf, figures = 1, lamp = 1, over }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ overflow: "visible", position: "absolute", left: 0, top: 0 }}>
    <SetDefs />
    <SetBack lampFlicker={lamp} />
    <g opacity={figures}>
      <Layer list={CAST.back} f={tf} />
    </g>
    <SetMid />
    <g opacity={figures}>
      <Layer list={CAST.mid} f={tf} />
      <Layer list={CAST.front} f={tf} />
      <Layer list={CAST.fg} f={tf} />
    </g>
    {over}
  </svg>
);

/* ------------------------------------------------------------------ */
/* Constellations: each figure redrawn as stars on its joints          */
/* ------------------------------------------------------------------ */

type V = { x: number; y: number };
const bonesOf = (j: Joints): [V, V][] => [
  [j.HC, j.N],
  [j.N, j.P],
  [j.N, j.shF],
  [j.N, j.shB],
  [j.shF, j.elF],
  [j.elF, j.wrF],
  [j.shB, j.elB],
  [j.elB, j.wrB],
  [j.P, j.knF],
  [j.knF, j.anF],
  [j.P, j.knB],
  [j.knB, j.anB],
];
const starsOf = (j: Joints): V[] => [j.HC, j.N, j.shF, j.shB, j.elF, j.elB, j.wrF, j.wrB, j.P, j.knF, j.knB, j.anF, j.anB];

/** p: 0 = nothing, 1 = fully drawn. Stars pop slightly before the lines reach them. */
export const Constellation: React.FC<{ spec: FigureSpec; tf: number; p: number; f: number; color?: string }> = ({ spec, tf, p, f, color = "#F3DB9D" }) => {
  if (p <= 0) return null;
  const j = solve(spec, livePose(spec, tf));
  const s = spec.scale;
  const lp = Math.min(1, p * 1.25);
  return (
    <g>
      {bonesOf(j).map(([a, b], i) => (
        <path
          key={`b${i}`}
          d={`M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - lp}
          stroke={color}
          strokeWidth={3.2 * s}
          strokeLinecap="round"
          opacity={0.75}
        />
      ))}
      {starsOf(j).map((q, i) => {
        const at = (i / 13) * 0.6;
        const k = Math.max(0, Math.min(1, (p - at) / 0.25));
        if (k <= 0) return null;
        const head = i === 0;
        const tw = 0.75 + 0.25 * Math.sin(f / 3.2 + random(`cs-${spec.id}-${i}`) * 6);
        const r = (head ? 15 : 7.5) * s * k * tw;
        return (
          <g key={`s${i}`}>
            <circle cx={q.x} cy={q.y} r={r * 3.4} fill={color} opacity={0.16 * k} />
            <circle cx={q.x} cy={q.y} r={r * 1.7} fill="#FFE7A8" opacity={0.42 * k} />
            <circle cx={q.x} cy={q.y} r={r} fill="#FFFDF2" />
          </g>
        );
      })}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Planets                                                             */
/* ------------------------------------------------------------------ */

export const Mars: React.FC<{ x: number; y: number; r: number; glow?: number; id?: string }> = ({ x, y, r, glow = 1, id = "mars" }) => (
  <g>
    <defs>
      <radialGradient id={`${id}g`} cx="0.36" cy="0.32" r="0.75">
        <stop offset="0" stopColor="#FFD2A6" />
        <stop offset="0.35" stopColor="#F2683A" />
        <stop offset="0.8" stopColor="#A3200F" />
        <stop offset="1" stopColor="#5A0C08" />
      </radialGradient>
      <radialGradient id={`${id}h`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0.55" stopColor="#FF6A2E" stopOpacity="0.55" />
        <stop offset="1" stopColor="#FF3A1A" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r * 1.85} fill={`url(#${id}h)`} opacity={glow} />
    <circle cx={x} cy={y} r={r} fill={`url(#${id}g)`} />
    <ellipse cx={x + r * 0.28} cy={y + r * 0.18} rx={r * 0.2} ry={r * 0.13} fill="#7E1A0C" opacity={0.55} />
    <ellipse cx={x - r * 0.32} cy={y + r * 0.42} rx={r * 0.13} ry={r * 0.09} fill="#7E1A0C" opacity={0.5} />
    <ellipse cx={x + r * 0.02} cy={y - r * 0.4} rx={r * 0.1} ry={r * 0.07} fill="#8E2412" opacity={0.45} />
    <path d={`M${x - r * 0.62} ${y - r * 0.5} A${r} ${r} 0 0 1 ${x + r * 0.2} ${y - r * 0.92}`} fill="none" stroke="#FFF1DE" strokeWidth={r * 0.07} strokeLinecap="round" opacity={0.75} />
  </g>
);

export const Saturn: React.FC<{ x: number; y: number; r: number; glow?: number; id?: string }> = ({ x, y, r, glow = 1, id = "sat" }) => {
  const ring = (front: boolean) => (
    <path
      d={front ? `M${x - r * 1.75} ${y} A${r * 1.75} ${r * 0.5} 0 0 0 ${x + r * 1.75} ${y}` : `M${x - r * 1.75} ${y} A${r * 1.75} ${r * 0.5} 0 0 1 ${x + r * 1.75} ${y}`}
      fill="none"
      stroke={front ? "#BFD8FF" : "#6E8FD6"}
      strokeWidth={r * 0.2}
      opacity={front ? 0.95 : 0.7}
      transform={`rotate(-18 ${x} ${y})`}
    />
  );
  return (
    <g>
      <defs>
        <radialGradient id={`${id}g`} cx="0.36" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#E8F1FF" />
          <stop offset="0.35" stopColor="#6F9BFF" />
          <stop offset="0.8" stopColor="#23409E" />
          <stop offset="1" stopColor="#0E1A4D" />
        </radialGradient>
        <radialGradient id={`${id}h`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.55" stopColor="#4F86FF" stopOpacity="0.55" />
          <stop offset="1" stopColor="#2A5BFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r * 1.95} fill={`url(#${id}h)`} opacity={glow} />
      {ring(false)}
      <circle cx={x} cy={y} r={r} fill={`url(#${id}g)`} />
      <path d={`M${x - r * 0.9} ${y - r * 0.2} Q${x} ${y - r * 0.05} ${x + r * 0.92} ${y - r * 0.3}`} fill="none" stroke="#A9C4FF" strokeWidth={r * 0.08} opacity={0.5} />
      <path d={`M${x - r * 0.8} ${y + r * 0.35} Q${x} ${y + r * 0.5} ${x + r * 0.85} ${y + r * 0.25}`} fill="none" stroke="#1B2F7A" strokeWidth={r * 0.1} opacity={0.45} />
      {ring(true)}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* North-Indian kundali chart                                          */
/* ------------------------------------------------------------------ */

/** House centres of the North-Indian chart (unit square), house 1 at the top diamond. */
export const HOUSES: [number, number][] = [
  [0.5, 0.25], [0.25, 0.1], [0.1, 0.25], [0.25, 0.5], [0.1, 0.75], [0.25, 0.9],
  [0.5, 0.75], [0.75, 0.9], [0.9, 0.75], [0.75, 0.5], [0.9, 0.25], [0.75, 0.1],
];
const GRAHAS: { t: string; h: number; c: string }[] = [
  { t: "Su", h: 10, c: "#FFC94A" },
  { t: "Mo", h: 4, c: "#F4F1FF" },
  { t: "Ma", h: 7, c: "#FF6A3D" },
  { t: "Me", h: 9, c: "#7FE0A8" },
  { t: "Ju", h: 2, c: "#FFD86B" },
  { t: "Ve", h: 12, c: "#FF9AD5" },
  { t: "Sa", h: 3, c: "#8FB3FF" },
  { t: "Ra", h: 5, c: "#C9B6FF" },
  { t: "Ke", h: 11, c: "#C9B6FF" },
];

/** draw 0..1 traces the lines; planets 0..1 drops the grahas in, one after another. */
export const Kundali: React.FC<{ size: number; draw: number; planets: number; f: number; color?: string; glow?: number }> = ({
  size,
  draw,
  planets,
  f,
  color = "#E9C46A",
  glow = 1,
}) => {
  const S = size;
  const seg = (d: string, i: number) => {
    const k = Math.max(0, Math.min(1, draw * 1.6 - i * 0.12));
    return <path key={i} d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} fill="none" stroke={color} strokeWidth={S * 0.012} strokeLinejoin="round" strokeLinecap="round" />;
  };
  const lines = [
    `M0 0H${S}V${S}H0Z`,
    `M0 0L${S} ${S}`,
    `M${S} 0L0 ${S}`,
    `M${S / 2} 0L${S} ${S / 2}L${S / 2} ${S}L0 ${S / 2}Z`,
  ];
  const used: Record<number, number> = {};
  return (
    <svg width={S} height={S} viewBox={`${-S * 0.06} ${-S * 0.06} ${S * 1.12} ${S * 1.12}`} style={{ overflow: "visible", filter: glow > 0 ? `drop-shadow(0 0 ${S * 0.03 * glow}px ${color})` : undefined }}>
      <rect x={0} y={0} width={S} height={S} fill="rgba(20,12,4,0.55)" opacity={Math.min(1, draw * 2)} />
      {lines.map(seg)}
      {GRAHAS.map((g, i) => {
        const k = Math.max(0, Math.min(1, planets * GRAHAS.length - i));
        if (k <= 0) return null;
        const n = used[g.h] ?? 0;
        used[g.h] = n + 1;
        const [hx, hy] = HOUSES[g.h - 1];
        const y = hy * S + (n - 0.5) * S * 0.07 * (n > 0 ? 1 : 0);
        const tw = 0.85 + 0.15 * Math.sin(f / 4 + i);
        return (
          <text
            key={g.t}
            x={hx * S}
            y={y + S * 0.025}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={800}
            fontSize={S * 0.065 * (0.6 + 0.4 * k)}
            fill={g.c}
            opacity={k * tw}
            style={{ filter: `drop-shadow(0 0 ${S * 0.015}px ${g.c})` }}
          >
            {g.t}
          </text>
        );
      })}
    </svg>
  );
};
