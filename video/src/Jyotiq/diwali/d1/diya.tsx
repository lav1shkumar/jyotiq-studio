import React from "react";
import { DEVA, P, ramp, rnd, wob } from "../../manthan/style";

/* पाँच दीये - the series device. A painted clay diya in the Manthan flat-vector look (warm key light, rim light,
   glow), and the row of five that works as the series' progress bar: one more diya lights each day.
   All shapes are local SVG: a Diya is drawn around (0,0) = the centre of its rim, about 160 px wide at scale 1.
   Put <DiyaDefs /> once inside any <svg> that draws diyas. */

export const DIYA_LABELS = ["धनतेरस", "छोटी दिवाली", "दिवाली", "गोवर्धन", "भाई दूज"];
/** x of slot i in a full-width row (1080 px canvas). */
export const slotX = (i: number, x0 = 140, step = 200): number => x0 + i * step;
/** Where the flame sits relative to the diya's rim centre, at scale 1 (spout tip). */
export const FLAME_AT: [number, number] = [88, -20];

export const DiyaDefs: React.FC = () => (
  <defs>
    <linearGradient id="d1Clay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#C8653A" />
      <stop offset="0.55" stopColor="#9C4320" />
      <stop offset="1" stopColor="#5E2410" />
    </linearGradient>
    <linearGradient id="d1ClayLit" x1="1" y1="0" x2="0" y2="0.6">
      <stop offset="0" stopColor="#FFB060" stopOpacity="0.85" />
      <stop offset="0.5" stopColor="#FF8A2A" stopOpacity="0.25" />
      <stop offset="1" stopColor="#FF8A2A" stopOpacity="0" />
    </linearGradient>
    <radialGradient id="d1Oil" cx="0.6" cy="0.4" r="0.7">
      <stop offset="0" stopColor="#8A5A12" />
      <stop offset="1" stopColor="#2A1606" />
    </radialGradient>
    <linearGradient id="d1FlameOut" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stopColor="#FF5A12" />
      <stop offset="0.45" stopColor="#FF9A2E" />
      <stop offset="1" stopColor="#FFD86A" />
    </linearGradient>
    <linearGradient id="d1FlameIn" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stopColor="#FFE07A" />
      <stop offset="0.6" stopColor="#FFF6D2" />
      <stop offset="1" stopColor="#FFFFFF" />
    </linearGradient>
    <radialGradient id="d1Glow">
      <stop offset="0" stopColor="#FFD27A" stopOpacity="0.75" />
      <stop offset="0.35" stopColor="#FFAA3C" stopOpacity="0.32" />
      <stop offset="1" stopColor="#FF8A2A" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="d1Pool">
      <stop offset="0" stopColor="#FFB45A" stopOpacity="0.55" />
      <stop offset="1" stopColor="#FF8A2A" stopOpacity="0" />
    </radialGradient>
  </defs>
);

/** One flame, base at (0,0), pointing up. `k` 0..1 grows it from a spark to full; `seed` makes each flicker its own. */
export const Flame: React.FC<{ f: number; k: number; seed: string; scale?: number }> = ({ f, k, seed, scale = 1 }) => {
  if (k <= 0.001) return null;
  const t = f / 30;
  const sway = wob(`${seed}s`, t * 2.2) * 7 + wob(`${seed}q`, t * 7) * 2.5; // degrees of skew
  const lick = 1 + wob(`${seed}h`, t * 5.5) * 0.09 + wob(`${seed}j`, t * 13) * 0.04;
  const grow = 0.25 + 0.75 * k;
  const sy = grow * lick * scale;
  const sx = (0.85 + 0.15 * k) * (1 - (lick - 1) * 0.6) * scale;
  return (
    <g transform={`skewX(${sway}) scale(${sx},${sy})`}>
      <path d="M0 3C-14 1 -15 -17 -6 -31C-2 -39 -1 -49 1 -60C4 -49 10 -40 12 -29C16 -15 12 1 0 3Z" fill="url(#d1FlameOut)" />
      <path d="M0 1C-8 0 -9 -11 -3 -21C0 -27 0 -33 1 -40C3 -33 7 -27 8 -20C10 -10 7 0 0 1Z" fill="url(#d1FlameIn)" />
      <ellipse cx={0} cy={-2} rx={3.6} ry={2.8} fill="#9FD6FF" opacity={0.32} />
    </g>
  );
};

/**
 * A painted clay diya. `lit` 0..1: 0 unlit, 0..1 igniting (spark burst, the flame grows), 1 burning.
 * `glow` scales the halo and the light pool (1 = normal). `seed` gives each diya its own flicker.
 */
export const Diya: React.FC<{ f: number; lit: number; seed?: string; scale?: number; glow?: number }> = ({
  f,
  lit,
  seed = "d",
  scale = 1,
  glow = 1,
}) => {
  const k = Math.max(0, Math.min(1, lit));
  const t = f / 30;
  const flick = 0.88 + 0.12 * (0.5 + 0.5 * wob(`${seed}g`, t * 6));
  const [fx, fy] = FLAME_AT;
  const dots = [-44, -32, -20, -8, 4, 16, 28, 40, 52];
  return (
    <g transform={`scale(${scale})`}>
      {/* light pool on the ground and the halo around the flame */}
      {k > 0 ? (
        <>
          <ellipse cx={20} cy={58} rx={150 * glow} ry={34 * glow} fill="url(#d1Pool)" opacity={k * 0.8 * flick} />
          <circle cx={fx} cy={fy - 26} r={150 * glow} fill="url(#d1Glow)" opacity={k * flick} />
        </>
      ) : null}
      {/* foot and body */}
      <ellipse cx={0} cy={46} rx={28} ry={7} fill="#4A1C0C" />
      <path
        d="M-66 -2C-66 30 -32 47 0 47C34 47 62 32 70 8L98 -16C82 -13 72 -11 62 -9C40 -19 -42 -19 -66 -2Z"
        fill="url(#d1Clay)"
        stroke="#3A1608"
        strokeWidth={3}
        strokeLinejoin="round"
      />
      {/* warm light from the flame on the spout side */}
      <path d="M-66 -2C-66 30 -32 47 0 47C34 47 62 32 70 8L98 -16C82 -13 72 -11 62 -9C40 -19 -42 -19 -66 -2Z" fill="url(#d1ClayLit)" opacity={k * flick} />
      {/* painted band: kumkum and haldi dots, a white zigzag */}
      <path d="M-56 16L-46 24L-36 16L-26 24L-16 16L-6 24L4 16L14 24L24 16L34 24L44 16L54 24" stroke="#F6EBD6" strokeWidth={2.4} fill="none" opacity={0.75} />
      {dots.map((x, i) => (
        <circle key={x} cx={x} cy={33 - Math.abs(x) * 0.04} r={2.8} fill={i % 2 ? P.flame : "#E8463A"} opacity={0.9} />
      ))}
      {/* the opening: oil inside, the front lip */}
      <path d="M-58 -4C-40 -15 42 -15 60 -7C44 4 -40 6 -58 -4Z" fill="url(#d1Oil)" />
      <path d="M-62 0C-40 11 40 11 66 2" stroke="#E08A56" strokeWidth={3} fill="none" opacity={0.8} strokeLinecap="round" />
      <path d="M-52 -6C-30 -12 30 -12 50 -8" stroke={P.goldLight} strokeWidth={1.6} fill="none" opacity={0.18 + 0.4 * k} />
      {/* wick: cotton when unlit, its tip charred once lit */}
      <path d={`M${fx - 18} -10C${fx - 10} -12 ${fx - 4} -15 ${fx} ${fy + 2}`} stroke="#F3E6CC" strokeWidth={5} strokeLinecap="round" fill="none" />
      <circle cx={fx} cy={fy + 2} r={3.4} fill={k > 0 ? "#3A2414" : "#F3E6CC"} />
      {/* spark burst while it catches */}
      {k > 0 && k < 1
        ? [0, 1, 2, 3, 4, 5].map((i) => {
            const a = -Math.PI / 2 + (rnd(`${seed}sp${i}`) - 0.5) * 2.2;
            const d = 14 + 70 * k * (0.6 + 0.4 * rnd(`${seed}sd${i}`));
            return (
              <circle
                key={i}
                cx={fx + Math.cos(a) * d}
                cy={fy - 8 + Math.sin(a) * d}
                r={2.6 * (1 - k) + 0.6}
                fill={P.goldLight}
                opacity={Math.sin(Math.PI * Math.min(1, k * 1.3))}
              />
            );
          })
        : null}
      <g transform={`translate(${fx},${fy})`}>
        <Flame f={f} k={k} seed={seed} />
      </g>
    </g>
  );
};

/**
 * The row of five diyas at baseline y. Per-slot arrays: `show` 0..1 (slides up into place), `lit` 0..1.
 * `labels` 0..1 fades the day names in under the diyas; `labelText` overrides a slot's label (null keeps it).
 * `hl` 0..1 lifts slot `highlight` and dims the others.
 */
export const DiyaRow: React.FC<{
  f: number;
  y: number;
  show?: number[];
  lit?: number[];
  labels?: number;
  labelText?: (string | null)[];
  highlight?: number;
  hl?: number;
  scale?: number;
  x0?: number;
  step?: number;
}> = ({ f, y, show = [1, 1, 1, 1, 1], lit = [0, 0, 0, 0, 0], labels = 1, labelText = [], highlight = -1, hl = 0, scale = 0.9, x0 = 140, step = 200 }) => (
  <g>
    {DIYA_LABELS.map((name, i) => {
      const s = Math.max(0, Math.min(1, show[i] ?? 1));
      if (s <= 0) return null;
      const on = i === highlight ? hl : 0;
      const dim = highlight >= 0 && i !== highlight ? 1 - 0.45 * hl : 1;
      const x = slotX(i, x0, step);
      const yy = y + (1 - s) * 90;
      const sc = scale * (0.7 + 0.3 * s) * (1 + 0.16 * on);
      const label = labelText[i] ?? name;
      const isLit = (lit[i] ?? 0) > 0.5;
      return (
        <g key={i} transform={`translate(${x},${yy})`} opacity={s * dim}>
          <Diya f={f} lit={lit[i] ?? 0} seed={`row${i}`} scale={sc} />
          <text
            x={0}
            y={98 * (scale / 0.9)}
            textAnchor="middle"
            fontFamily={DEVA}
            fontSize={30}
            fontWeight={700}
            fill={isLit || on > 0.5 ? P.goldLight : P.ivory}
            stroke={P.ink}
            strokeWidth={6}
            paintOrder="stroke"
            opacity={labels * ramp(s, 0.6, 1, "lin")}
          >
            {label}
          </text>
        </g>
      );
    })}
  </g>
);
