import React from "react";
import { mix, rnd, wob } from "../style";

/*
 * Episode 3 effects in the series' flat-vector style (same flame colours as sets.tsx's Flame,
 * same cloud silhouette as sets.tsx's Cloud): Vasuki's fire breath, drifting smoke, rain
 * clouds over the devtas, the boiling ocean, the Halahala column and withering plants.
 * All coordinates are local; scenes place them.
 */

const FL = { red: "#FF5A1F", orange: "#FF7A22", yellow: "#FFC23D", core: "#FFF3C4" };
const HL = { black: "#070A1E", navy: "#14205A", blue: "#2340A8", cyan: "#40D8E8", violet: "#9888D8", spark: "#BFF6FF" };

/** Tapered, wavy flame tongue along +x from the origin. */
const tongue = (len: number, w: number, seed: string, f: number, k: number) => {
  const n = 9;
  const top: string[] = [];
  const bot: string[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const x = u * len;
    const half = w * Math.sin(Math.PI * Math.min(1, u * 1.15)) * (1 - 0.55 * u);
    const sway = wob(`${seed}s${k}`, f / 5 + u * 2) * w * 0.35 * u;
    top.push(`${x.toFixed(1)} ${(-half + sway).toFixed(1)}`);
    bot.push(`${x.toFixed(1)} ${(half + sway).toFixed(1)}`);
  }
  return `M0 0L${top.join("L")}L${bot.reverse().join("L")}Z`;
};

/** Vasuki's fire: a cone of flame from a mouth point. ang in degrees (0 = +x), power 0..1. */
export const FireBreath: React.FC<{ x: number; y: number; ang: number; len: number; power: number; f: number; seed?: string }> = ({
  x,
  y,
  ang,
  len,
  power,
  f,
  seed = "fb",
}) => {
  if (power < 0.01) return null;
  const L = len * (0.35 + 0.65 * power);
  const w = len * 0.2 * (0.6 + 0.4 * power);
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang})`}>
      <ellipse cx={L * 0.55} cy={0} rx={L * 0.7} ry={w * 1.4} fill={FL.orange} opacity={0.22 * power} filter="url(#mBlur8)" />
      <path d={tongue(L, w, seed, f, 0)} fill={FL.red} opacity={0.92} />
      <path d={tongue(L * 0.82, w * 0.7, seed, f, 1)} fill={FL.orange} />
      <path d={tongue(L * 0.6, w * 0.45, seed, f, 2)} fill={FL.yellow} />
      <path d={tongue(L * 0.32, w * 0.22, seed, f, 3)} fill={FL.core} />
      {Array.from({ length: 14 }).map((_, i) => {
        const ph = ((f * (1.2 + rnd(`${seed}e${i}`)) + i * 17) % 40) / 40;
        const ex = ph * L * 1.15;
        const ey = (rnd(`${seed}y${i}`) * 2 - 1) * w * (0.4 + ph) + wob(`${seed}w${i}`, f / 6) * 12;
        return <circle key={i} cx={ex} cy={ey} r={3 + 3 * rnd(`${seed}r${i}`)} fill={i % 3 ? FL.yellow : FL.core} opacity={(1 - ph) * power} />;
      })}
    </g>
  );
};

/** Soft smoke puffs drifting over a box (x0..x0+w, y0..y0+h). dir = horizontal drift sign. */
export const SmokeDrift: React.FC<{ x0: number; y0: number; w: number; h: number; density: number; f: number; seed?: string; dir?: number; tint?: string }> = ({
  x0,
  y0,
  w,
  h,
  density,
  f,
  seed = "sm",
  dir = 1,
  tint = "#6A4E52",
}) => {
  if (density < 0.01) return null;
  const n = Math.round(10 + 14 * density);
  return (
    <g filter="url(#mBlur8)">
      {Array.from({ length: n }).map((_, i) => {
        const sp = 0.6 + rnd(`${seed}s${i}`) * 1.2;
        const px = (((rnd(`${seed}x${i}`) * w + dir * f * sp * 2.2) % w) + w) % w;
        const py = rnd(`${seed}y${i}`) * h - ((f * sp * 0.6) % 60);
        const r = 40 + rnd(`${seed}r${i}`) * 90;
        const shade = mix(tint, "#2A2026", rnd(`${seed}c${i}`) * 0.6);
        return <circle key={i} cx={x0 + px} cy={y0 + py} r={r} fill={shade} opacity={(0.25 + 0.3 * rnd(`${seed}o${i}`)) * density} />;
      })}
    </g>
  );
};

const CLOUD = "M-220 40C-250 40 -260 0 -230 -14C-238 -60 -170 -80 -140 -50C-120 -110 -30 -120 -4 -60C20 -100 100 -96 110 -40C150 -64 220 -40 210 10C250 14 250 40 220 40Z";

/** Cool rain clouds with slanting rain over the box below them. */
export const RainClouds: React.FC<{ x0: number; y0: number; w: number; h: number; f: number; o: number; rain: number; seed?: string }> = ({
  x0,
  y0,
  w,
  h,
  f,
  o,
  rain,
  seed = "rc",
}) => {
  if (o < 0.01) return null;
  const clouds = [0.18, 0.5, 0.82];
  return (
    <g opacity={o}>
      {rain > 0.01 ? (
        <g opacity={rain}>
          {Array.from({ length: 46 }).map((_, i) => {
            const sp = 14 + rnd(`${seed}v${i}`) * 8;
            const rx = x0 + rnd(`${seed}x${i}`) * w;
            const ry = y0 + 40 + ((rnd(`${seed}y${i}`) * h + f * sp) % h);
            return <path key={i} d={`M${rx} ${ry}l-10 34`} stroke="#6F95D6" strokeWidth={3.5} strokeLinecap="round" opacity={0.8} />;
          })}
        </g>
      ) : null}
      {clouds.map((u, i) => (
        <g key={i} transform={`translate(${x0 + u * w + wob(`${seed}c${i}`, f / 60) * 20} ${y0 + (i % 2) * 26}) scale(${0.75 + (i % 2) * 0.2})`}>
          <path d={CLOUD} fill="#A9B6D6" />
          <path d="M-230 40C-120 22 80 22 220 40Z" fill="#7484AE" opacity={0.6} />
        </g>
      ))}
    </g>
  );
};

/** Bubbles on the ocean of milk; level 0..1 also darkens the milk toward poison blue. */
export const Boil: React.FC<{ cx: number; cy: number; w: number; h: number; level: number; f: number; seed?: string }> = ({ cx, cy, w, h, level, f, seed = "bo" }) => {
  if (level < 0.01) return null;
  const dark = mix("#F4F1EA", HL.navy, Math.min(1, level * 1.1));
  const n = Math.round(8 + 26 * level);
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={w * 0.55 * level} ry={h * 0.5 * level} fill={HL.navy} opacity={0.55 * level} filter="url(#mBlur8)" />
      {Array.from({ length: n }).map((_, i) => {
        const per = 22 + Math.floor(rnd(`${seed}p${i}`) * 26);
        const ph = ((f + i * 13) % per) / per;
        const bx = cx + (rnd(`${seed}x${i}`) - 0.5) * w;
        const by = cy + (rnd(`${seed}y${i}`) - 0.5) * h;
        const r = (8 + rnd(`${seed}r${i}`) * 26) * Math.sin(Math.PI * ph);
        return (
          <g key={i}>
            <circle cx={bx} cy={by} r={Math.max(0, r)} fill={dark} stroke={mix("#FFFFFF", HL.cyan, level)} strokeWidth={3} opacity={0.9} />
            <circle cx={bx - r * 0.3} cy={by - r * 0.35} r={Math.max(0, r * 0.22)} fill="#FFFFFF" opacity={0.6} />
          </g>
        );
      })}
    </g>
  );
};

/** The Halahala: a black-blue flame column with its own cyan-violet glow. Origin = base on the sea. rise 0..1. */
export const HalahalaColumn: React.FC<{ height: number; rise: number; f: number; seed?: string; w?: number }> = ({ height, rise, f, seed = "hh", w = 220 }) => {
  if (rise < 0.01) return null;
  const Hh = height * rise;
  const col = (k: number, ww: number, hh: number) => {
    const n = 14;
    const L: string[] = [];
    const R: string[] = [];
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      const y = -u * hh;
      const half = ww * Math.pow(1 - u, 0.75) * (0.85 + 0.3 * Math.sin(u * 9 + f / 6 + k));
      const sway = wob(`${seed}${k}`, f / 8 + u * 3) * ww * 0.6 * u;
      L.push(`${(-half + sway).toFixed(1)} ${y.toFixed(1)}`);
      R.push(`${(half + sway).toFixed(1)} ${y.toFixed(1)}`);
    }
    return `M${L.join("L")}L${R.reverse().join("L")}Z`;
  };
  // side tongues that lick up the column's flanks
  const tongues = [-0.55, 0.5, -0.25, 0.3];
  return (
    <g>
      {/* its own light keeps the frame lit */}
      <ellipse cx={0} cy={-Hh * 0.45} rx={w * 2.6} ry={Hh * 0.7 + 80} fill={HL.cyan} opacity={0.22 * rise} filter="url(#mBlur8)" />
      <ellipse cx={0} cy={-Hh * 0.6} rx={w * 1.8} ry={Hh * 0.55 + 60} fill={HL.violet} opacity={0.2 * rise} filter="url(#mBlur8)" />
      {/* poison smoke spreading at the top, behind the flame */}
      {Array.from({ length: 9 }).map((_, i) => {
        const a = (i / 8) * Math.PI - Math.PI;
        const sp = rise * (120 + 60 * rnd(`${seed}m${i}`));
        return (
          <circle
            key={i}
            cx={Math.cos(a) * sp * 1.6 + wob(`${seed}mw${i}`, f / 20) * 20}
            cy={-Hh * 0.92 + Math.sin(a) * sp * 0.5}
            r={60 + 50 * rnd(`${seed}mr${i}`)}
            fill={i % 2 ? "#2A2266" : "#1A1440"}
            opacity={0.7 * rise}
            filter="url(#mBlur8)"
          />
        );
      })}
      {tongues.map((u, i) => (
        <g key={i} transform={`translate(${u * w * 1.1} ${-Hh * (0.1 + 0.12 * i)})`}>
          <path d={col(10 + i, w * 0.42, Hh * (0.5 - 0.06 * i))} fill={HL.navy} />
          <path d={col(20 + i, w * 0.2, Hh * (0.36 - 0.05 * i))} fill={HL.blue} />
        </g>
      ))}
      <path d={col(0, w, Hh)} fill={HL.black} />
      <path d={col(1, w * 0.72, Hh * 0.9)} fill={HL.navy} />
      <path d={col(2, w * 0.42, Hh * 0.72)} fill={HL.blue} />
      <path d={col(3, w * 0.18, Hh * 0.5)} fill={HL.cyan} opacity={0.85} />
      {/* cyan sparks */}
      {Array.from({ length: 18 }).map((_, i) => {
        const ph = ((f * (1 + rnd(`${seed}k${i}`)) + i * 11) % 50) / 50;
        return (
          <circle
            key={i}
            cx={(rnd(`${seed}kx${i}`) - 0.5) * w * 2.2 + wob(`${seed}kw${i}`, f / 8) * 30}
            cy={-ph * Hh * 1.1}
            r={2.5 + 3 * rnd(`${seed}kr${i}`)}
            fill={HL.spark}
            opacity={(1 - ph) * rise}
          />
        );
      })}
    </g>
  );
};

/** A shore of trees and reeds that curl and grey as the poison spreads (amount 0..1). Origin = left end of the ground line. */
export const Wither: React.FC<{ w: number; amount: number; f: number; seed?: string; n?: number }> = ({ w, amount, f, seed = "wi", n = 7 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const x = (i + 0.5) * (w / n) + (rnd(`${seed}x${i}`) - 0.5) * 30;
      const hgt = 120 + rnd(`${seed}h${i}`) * 90;
      const a = Math.min(1, Math.max(0, amount * 1.3 - rnd(`${seed}d${i}`) * 0.3));
      const green = mix("#3E9A55", "#6B6258", a);
      const dark = mix("#2E7D46", "#4A433C", a);
      const droop = a * 26 * (i % 2 ? 1 : -1);
      const cs = 1 - 0.35 * a;
      return (
        <g key={i} transform={`translate(${x} 0)`}>
          <path d={`M-7 0L-5 ${-hgt}L5 ${-hgt}L7 0Z`} fill={mix("#7A4E2A", "#4A3A30", a)} transform={`rotate(${droop * 0.4})`} />
          <g transform={`translate(${droop} ${-hgt}) scale(${cs})`}>
            <circle cx={0} cy={0} r={46} fill={green} />
            <circle cx={-30} cy={14} r={30} fill={dark} />
            <circle cx={30} cy={12} r={32} fill={dark} />
          </g>
          {a > 0.2
            ? Array.from({ length: 3 }).map((_, j) => {
                const ph = ((f + j * 19 + i * 7) % 60) / 60;
                return <circle key={j} cx={droop + (j - 1) * 20 + ph * 30} cy={-hgt + ph * hgt} r={5} fill={green} opacity={(1 - ph) * a} />;
              })
            : null}
        </g>
      );
    })}
  </g>
);
