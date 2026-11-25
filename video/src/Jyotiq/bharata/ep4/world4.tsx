import React from "react";
import { rnd } from "../../navagraha/ep1/anim";
import { P } from "../../manthan/style";

/*
 * भारत Ep4 sets and effects.
 *  Storm: slanting rain, wind streaks and a forked lightning bolt that strikes on the given frames (with a sky flash).
 *  LampRow: a row of funeral diyas that go out one by one between frames a and b (Vichitravirya's death).
 *  NightArch: the palace doorway at night; the great doors are flung open (open 0..1) on a storm-lit sky.
 *  MantraRing: a slow ring of Vedic syllables (ॐ भूर्भुवः स्वः …) in gold around a point, for Vyasa's power.
 */
const W = 1080;
const H = 1920;

const boltPath = (seed: number, x0: number, y1: number) => {
  let x = x0;
  let d = `M${x} -20`;
  const n = 9;
  for (let i = 1; i <= n; i++) {
    x += (rnd(seed, i) - 0.5) * 120;
    d += `L${x.toFixed(0)} ${((y1 / n) * i).toFixed(0)}`;
  }
  return d;
};

export const Storm: React.FC<{ f: number; k?: number; bolts?: number[]; x?: number; rain?: number }> = ({ f, k = 1, bolts = [], x = 760, rain = 1 }) => {
  const hit = bolts.map((b) => f - b).filter((d) => d >= 0 && d < 10);
  const on = hit.length ? Math.max(0, 1 - hit[0] / 8) * (hit[0] % 3 === 1 ? 0.4 : 1) : 0;
  return (
    <g opacity={k}>
      {on > 0.01 ? (
        <g>
          <rect width={W} height={H} fill="#DDE6FF" opacity={0.28 * on} />
          <path d={boltPath(bolts.length + Math.floor((f - (hit[0] ?? 0)) / 100), x, 900)} stroke="#F4F8FF" strokeWidth={9} fill="none" opacity={on} strokeLinejoin="round" />
          <path d={boltPath(bolts.length + 3, x, 900)} stroke="#A8C0FF" strokeWidth={24} fill="none" opacity={0.35 * on} filter="url(#bhBlur6)" />
        </g>
      ) : null}
      {rain > 0.01
        ? Array.from({ length: 70 }, (_, i) => {
            const sp = 38 + 14 * rnd(i, 2);
            const y = ((f * sp + rnd(i, 1) * 2200) % 2200) - 120;
            const xx = ((rnd(i, 3) * 1300 - f * 6) % 1300 + 1300) % 1300 - 110;
            return <path key={i} d={`M${xx} ${y}l-26 90`} stroke="#B8C8F0" strokeWidth={2.4} opacity={0.35 * rain} />;
          })
        : null}
      {Array.from({ length: 6 }, (_, i) => {
        const xx = (((f * 30 + i * 400) % 1600) - 300);
        return <path key={`w${i}`} d={`M${xx} ${300 + i * 260}q180 -30 360 0`} stroke="#E0E6FF" strokeWidth={3} fill="none" opacity={0.12} />;
      })}
    </g>
  );
};

/** Funeral diyas in a row on the floor; lamp i goes out at a + i * (b - a) / n. */
export const LampRow: React.FC<{ f: number; a: number; b: number; y: number; n?: number }> = ({ f, a, b, y, n = 7 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const x = 120 + (i * 840) / (n - 1);
      const out = a + ((i + 0.5) * (b - a)) / n;
      const life = f < out ? 1 : Math.max(0, 1 - (f - out) / 8);
      const smoke = f >= out ? Math.min(1, (f - out) / 30) : 0;
      return (
        <g key={i} transform={`translate(${x} ${y})`}>
          <ellipse cx={0} cy={0} rx={46} ry={14} fill="#8A4A22" />
          <path d="M-46 0C-40 22 40 22 46 0Z" fill="#6A3216" />
          {life > 0.01 ? (
            <g opacity={life}>
              <circle cx={0} cy={-30} r={70} fill="#FFB04A" opacity={0.22} filter="url(#bhBlur6)" />
              <path d={`M-9 -6C-12 -30 -2 -40 0 ${-62 - 6 * Math.sin(f / 2 + i)}C2 -40 12 -30 9 -6Z`} fill="#FFC23A" />
              <path d="M-4 -6C-5 -18 -1 -24 0 -34C1 -24 5 -18 4 -6Z" fill="#FFF3C0" />
            </g>
          ) : null}
          {smoke > 0.01 && smoke < 1 ? (
            <path d={`M0 -10C-14 ${-60 * smoke} 14 ${-100 * smoke} 0 ${-160 * smoke}`} stroke="#C8C0B8" strokeWidth={5} fill="none" opacity={0.5 * (1 - smoke)} />
          ) : null}
        </g>
      );
    })}
  </g>
);

/** The palace doorway at night; the doors fly open (open 0 shut .. 1 open) on a storm sky. Lit hall floor in front. */
export const NightArch: React.FC<{ f: number; open: number; glow?: number }> = ({ f, open, glow = 0 }) => {
  const dw = 240 * (1 - open);
  return (
    <g>
      <rect width={W} height={H} fill="#140A1E" />
      {/* the storm sky through the arch */}
      <path d="M300 1500L300 860C300 700 420 620 540 620C660 620 780 700 780 860L780 1500Z" fill="#2A3A6A" />
      <path d="M300 1500L300 860C300 700 420 620 540 620C660 620 780 700 780 860L780 1500Z" fill="#8AA0E0" opacity={0.25 + 0.2 * glow} />
      {Array.from({ length: 5 }, (_, i) => (
        <ellipse key={i} cx={360 + i * 90 + 20 * Math.sin(f / 14 + i)} cy={720 + (i % 2) * 60} rx={120} ry={46} fill="#1A2448" opacity={0.8} />
      ))}
      {/* walls with carved pilasters and lamps in niches */}
      <rect x={0} y={0} width={300} height={1500} fill="#4A1A22" />
      <rect x={780} y={0} width={300} height={1500} fill="#4A1A22" />
      {[150, 930].map((x) => (
        <g key={x}>
          <rect x={x - 50} y={200} width={100} height={1300} fill="#6A2A2A" />
          {[300, 640, 980].map((yy) => <rect key={yy} x={x - 60} y={yy} width={120} height={22} fill="url(#mGold)" />)}
          <rect x={x - 30} y={480} width={60} height={100} rx={30} fill="#1A0808" />
          <ellipse cx={x} cy={540} rx={9} ry={16 + 3 * Math.sin(f / 3 + x)} fill="#FFC23A" opacity={0.6 + 0.3 * (1 - open)} />
        </g>
      ))}
      <path d="M300 860C300 700 420 620 540 620C660 620 780 700 780 860" stroke="url(#mGold)" strokeWidth={16} fill="none" />
      {/* the doors swing outward: drawn as narrowing leaves */}
      <path d={`M300 620L${300 + dw} 640L${300 + dw} 1500L300 1500Z`} fill="#3A1A0E" stroke="#1A0A04" strokeWidth={5} />
      <path d={`M780 620L${780 - dw} 640L${780 - dw} 1500L780 1500Z`} fill="#3A1A0E" stroke="#1A0A04" strokeWidth={5} />
      {dw > 20
        ? [0, 1].map((sd) =>
            Array.from({ length: 4 }, (_, j) => <circle key={`${sd}${j}`} cx={sd ? 780 - dw / 2 : 300 + dw / 2} cy={780 + j * 180} r={10} fill={P.goldDeep} />),
          )
        : null}
      {/* threshold and floor */}
      <rect x={0} y={1500} width={W} height={H - 1500} fill="#2A1014" />
      <path d="M260 1500L820 1500L900 1560L180 1560Z" fill="#5A2A1E" />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${540 + (i - 3) * 80} 1560L${540 + (i - 3) * 300} ${H}`} stroke="#3A1A1A" strokeWidth={3} />)}
    </g>
  );
};

const MANTRA = ["ॐ", "भूः", "भुवः", "स्वः", "तत्", "सवितुः", "वरेण्यं", "भर्गो", "देवस्य", "धीमहि"];
/** Vedic syllables on a slow ring (r) around (x, y). */
export const MantraRing: React.FC<{ f: number; x: number; y: number; r: number; k: number }> = ({ f, x, y, r, k }) => {
  if (k <= 0.01) return null;
  return (
    <g opacity={k} transform={`translate(${x} ${y}) rotate(${f * 0.35})`}>
      <circle r={r} fill="none" stroke="#F6C14E" strokeWidth={2} opacity={0.35} strokeDasharray="4 10" />
      {MANTRA.map((m, i) => (
        <text key={i} transform={`rotate(${(i * 360) / MANTRA.length}) translate(0 ${-r - 14})`} textAnchor="middle" fontSize={38} fontWeight={700} fill="#FFE3A1" opacity={0.75} style={{ fontFamily: "Mukta, sans-serif" }}>
          {m}
        </text>
      ))}
    </g>
  );
};

/** A dark pall that sweeps the colour out (for the rewind into the past). */
export const Sepia: React.FC<{ k: number }> = ({ k }) =>
  k > 0.01 ? (
    <g>
      <rect width={W} height={H} fill="#808080" opacity={k * 0.8} style={{ mixBlendMode: "saturation" }} />
      <rect width={W} height={H} fill="#7A4A1A" opacity={k * 0.25} style={{ mixBlendMode: "multiply" }} />
    </g>
  ) : null;
