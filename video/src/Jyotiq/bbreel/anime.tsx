import React from "react";
import { AbsoluteFill, random } from "remotion";
import { ANIME } from "./fonts";

/* Anime / manga motion-graphics primitives. Everything is a pure function of
   the frame passed in, so a still render matches the video. */

const TAU = Math.PI * 2;

/** 集中線: radial wedges converging on (cx, cy), leaving a clear elliptical centre.
    Re-rolls every `hold` frames for the hand-drawn flicker. */
export const FocusLines: React.FC<{
  f: number;
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
  count?: number;
  color?: string;
  opacity?: number;
  width?: number; // wedge half-angle in degrees (max)
  hold?: number;
  seed?: string;
}> = ({ f, cx = 540, cy = 960, rx = 330, ry = 520, count = 110, color = "#FFFFFF", opacity = 1, width = 0.9, hold = 2, seed = "fl" }) => {
  if (opacity <= 0.001) return null;
  const k = Math.floor(f / hold);
  const R = 2600;
  let d = "";
  for (let i = 0; i < count; i++) {
    const r = (s: string) => random(`${seed}-${k}-${i}-${s}`);
    const a = (i / count) * TAU + (r("a") - 0.5) * (TAU / count) * 1.6;
    const w = (0.15 + r("w") * width) * (Math.PI / 180);
    const reach = 1 + r("r") * 0.55;
    const ix = cx + Math.cos(a) * rx * reach;
    const iy = cy + Math.sin(a) * ry * reach;
    const p1x = cx + Math.cos(a - w) * R;
    const p1y = cy + Math.sin(a - w) * R;
    const p2x = cx + Math.cos(a + w) * R;
    const p2y = cy + Math.sin(a + w) * R;
    d += `M${p1x.toFixed(1)} ${p1y.toFixed(1)}L${ix.toFixed(1)} ${iy.toFixed(1)}L${p2x.toFixed(1)} ${p2y.toFixed(1)}Z`;
  }
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
      <path d={d} fill={color} />
    </svg>
  );
};

/** Parallel speed streaks drifting along `angle` (degrees, 0 = to the right). */
export const SpeedLines: React.FC<{
  f: number;
  angle?: number;
  count?: number;
  color?: string;
  opacity?: number;
  speed?: number;
  seed?: string;
  thickness?: number;
}> = ({ f, angle = 0, count = 46, color = "#FFFFFF", opacity = 1, speed = 90, seed = "sl", thickness = 1 }) => {
  if (opacity <= 0.001) return null;
  const span = 2600;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
      <g transform={`rotate(${angle} 540 960)`}>
        {new Array(count).fill(0).map((_, i) => {
          const r = (s: string) => random(`${seed}-${i}-${s}`);
          const y = -400 + r("y") * 2720;
          const len = 160 + r("l") * 520;
          const x = ((r("x") * span + f * speed * (0.6 + r("v") * 0.8)) % span) - 760;
          const w = (2 + r("t") * 7) * thickness;
          return <rect key={i} x={x} y={y} width={len} height={w} rx={w / 2} fill={color} opacity={0.35 + r("o") * 0.65} />;
        })}
      </g>
    </svg>
  );
};

/** Expanding double ring from (x, y), t in frames since `at`. */
export const Shockwave: React.FC<{ f: number; at: number; x: number; y: number; size?: number; color?: string; dur?: number }> = ({
  f,
  at,
  x,
  y,
  size = 1,
  color = "#FFF3D0",
  dur = 16,
}) => {
  const t = (f - at) / dur;
  if (t < 0 || t > 1) return null;
  const e = 1 - Math.pow(1 - t, 3);
  const k = 1 - t;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}>
      <ellipse cx={x} cy={y} rx={(60 + 620 * e) * size} ry={(60 + 620 * e) * size * 0.92} fill="none" stroke={color} strokeWidth={26 * k * size} opacity={k} />
      <ellipse cx={x} cy={y} rx={(30 + 380 * e) * size} ry={(30 + 380 * e) * size * 0.92} fill="none" stroke="#FFFFFF" strokeWidth={10 * k * size} opacity={k * 0.9} />
    </svg>
  );
};

/** Spark spray: streaks thrown out of (x, y) with gravity. */
export const Sparks: React.FC<{
  f: number;
  at: number;
  x: number;
  y: number;
  count?: number;
  colors?: string[];
  power?: number;
  dur?: number;
  seed?: string;
  spread?: number; // radians around `dir`
  dir?: number; // radians, -PI/2 = up
}> = ({ f, at, x, y, count = 34, colors = ["#FFF6D8", "#FFD45A", "#FF9A2E"], power = 1, dur = 22, seed = "sp", spread = TAU, dir = -Math.PI / 2 }) => {
  const age = f - at;
  if (age < 0 || age > dur) return null;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}>
      {new Array(count).fill(0).map((_, i) => {
        const r = (s: string) => random(`${seed}-${at}-${i}-${s}`);
        const a = dir + (r("a") - 0.5) * spread;
        const v = (14 + r("v") * 30) * power;
        const drag = (1 - Math.exp(-age / 7)) * 7;
        const px = x + Math.cos(a) * v * drag;
        const py = y + Math.sin(a) * v * drag + 0.55 * age * age * power;
        const vx = Math.cos(a) * v * Math.exp(-age / 7);
        const vy = Math.sin(a) * v * Math.exp(-age / 7) + 1.1 * age * power;
        const len = 1.6;
        const life = 1 - age / (dur * (0.55 + r("l") * 0.45));
        if (life <= 0) return null;
        return (
          <line
            key={i}
            x1={px}
            y1={py}
            x2={px - vx * len}
            y2={py - vy * len}
            stroke={colors[i % colors.length]}
            strokeWidth={(3 + r("w") * 6) * life}
            strokeLinecap="round"
            opacity={Math.min(1, life * 1.4)}
          />
        );
      })}
    </svg>
  );
};

/** Jagged lightning between two points; re-rolls every 2 frames. Returns SVG children. */
export const lightningPath = (f: number, x1: number, y1: number, x2: number, y2: number, jag = 60, seed = "lz"): string => {
  const k = Math.floor(f / 2);
  const n = 9;
  const nx = -(y2 - y1);
  const ny = x2 - x1;
  const L = Math.hypot(nx, ny) || 1;
  let d = `M${x1.toFixed(1)} ${y1.toFixed(1)}`;
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const off = (random(`${seed}-${k}-${i}`) - 0.5) * 2 * jag * Math.sin(Math.PI * t);
    d += `L${(x1 + (x2 - x1) * t + (nx / L) * off).toFixed(1)} ${(y1 + (y2 - y1) * t + (ny / L) * off).toFixed(1)}`;
  }
  return d + `L${x2.toFixed(1)} ${y2.toFixed(1)}`;
};

/** Manga screentone: a dot grid, optionally faded with a radial mask. */
export const Halftone: React.FC<{ color?: string; size?: number; dot?: number; opacity?: number; mask?: string; style?: React.CSSProperties }> = ({
  color = "rgba(255,255,255,0.5)",
  size = 18,
  dot = 3,
  opacity = 1,
  mask,
  style,
}) => (
  <AbsoluteFill
    style={{
      backgroundImage: `radial-gradient(circle, ${color} ${dot}px, transparent ${dot + 0.6}px)`,
      backgroundSize: `${size}px ${size}px`,
      opacity,
      WebkitMaskImage: mask,
      maskImage: mask,
      pointerEvents: "none",
      ...style,
    }}
  />
);

/** Anime title text: thick outline behind a solid fill (+ optional drop block). */
export const TitleText: React.FC<{
  text: string;
  size: number;
  fill: string;
  stroke?: string;
  strokeW?: number;
  shadow?: string;
  font?: string;
  style?: React.CSSProperties;
  letterSpacing?: number;
}> = ({ text, size, fill, stroke = "#120610", strokeW = 16, shadow, font = ANIME, style, letterSpacing = 1 }) => {
  const base: React.CSSProperties = {
    fontFamily: font,
    fontSize: size,
    lineHeight: 1,
    letterSpacing,
    whiteSpace: "nowrap",
  };
  return (
    <div style={{ position: "relative", display: "inline-block", ...style }}>
      {shadow ? (
        <div style={{ ...base, position: "absolute", left: size * 0.06, top: size * 0.07, color: shadow, WebkitTextStroke: `${strokeW}px ${shadow}` }}>{text}</div>
      ) : null}
      <div style={{ ...base, position: "absolute", left: 0, top: 0, color: stroke, WebkitTextStroke: `${strokeW}px ${stroke}` }}>{text}</div>
      <div style={{ ...base, position: "relative", color: fill }}>{text}</div>
    </div>
  );
};

/** Twinkling night-sky dots (used when the house goes dark). */
export const StarDust: React.FC<{ f: number; count?: number; opacity?: number; seed?: string; color?: string }> = ({
  f,
  count = 120,
  opacity = 1,
  seed = "sd",
  color = "#FFF3D2",
}) => {
  if (opacity <= 0.001) return null;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const r = (s: string) => random(`${seed}-${i}-${s}`);
        const tw = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(f / (5 + r("t") * 9) + i * 1.7));
        return <circle key={i} cx={r("x") * 1080} cy={r("y") * 1920} r={0.8 + r("s") * 2.6} fill={color} opacity={tw * (0.35 + r("o") * 0.65)} />;
      })}
    </svg>
  );
};

/** 4-point sparkle path centred on 0,0 with radius r. */
export const sparklePath = (r: number) =>
  `M0 ${-r} C${r * 0.12} ${-r * 0.24} ${r * 0.24} ${-r * 0.12} ${r} 0 C${r * 0.24} ${r * 0.12} ${r * 0.12} ${r * 0.24} 0 ${r} C${-r * 0.12} ${r * 0.24} ${-r * 0.24} ${r * 0.12} ${-r} 0 C${-r * 0.24} ${-r * 0.12} ${-r * 0.12} ${-r * 0.24} 0 ${-r}Z`;
