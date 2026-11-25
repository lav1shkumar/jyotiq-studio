import React from "react";
import { Stars } from "../../manthan/sets";
import { rnd } from "../../navagraha/ep1/anim";

/*
 * भारत Ep2 sets (uses Episode 1's BhDefs gradients: bhDusk, bhDawn, bhRiverDusk, bhRiverDawn, bhBlur6, bhBlur20).
 *  FisherSet: the fishermen's village on the Yamuna at dusk or dawn: far bank forest, the river, a sandy foreground bank
 *  with thatched huts, nets drying on poles, beached boats and lanterns.
 *  HeavenLight: the sky opening in gold over the vow (rays + glowing cloud), FlowerRain: marigold, rose and jasmine petals.
 */
const W = 1080;
const H = 1920;
const HZ = 1000;

const Hut: React.FC<{ x: number; y: number; s: number; f: number; lit?: boolean }> = ({ x, y, s, f, lit = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-110} y={-130} width={220} height={130} fill="#B98A5A" />
    <rect x={-110} y={-130} width={60} height={130} fill="#9A6E44" opacity={0.6} />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-100 + i * 25} -130L${-100 + i * 25} 0`} stroke="#8A6040" strokeWidth={2} opacity={0.5} />)}
    <path d="M-150 -120L0 -250L150 -120Z" fill="#C8A060" stroke="#7A5A2A" strokeWidth={4} />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${-140 + i * 30} -120L${-10 + i * 2} -240`} stroke="#9A7A40" strokeWidth={2.5} opacity={0.6} />)}
    <rect x={-26} y={-90} width={52} height={90} fill={lit ? "#3A1E0E" : "#2A160A"} />
    {lit ? <rect x={-20} y={-84} width={40} height={84} fill="#FFB04A" opacity={0.35 + 0.08 * Math.sin(f / 5 + x)} /> : null}
  </g>
);

const Net: React.FC<{ x: number; y: number; s: number; f: number }> = ({ x, y, s, f }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-120 0L-120 -260M120 0L120 -250" stroke="#5A3A1C" strokeWidth={8} />
    <path d={`M-120 -250Q0 ${-200 + 6 * Math.sin(f / 14)} 120 -240L120 -120Q0 ${-70 + 6 * Math.sin(f / 14)} -120 -130Z`} fill="none" stroke="#D8C8A0" strokeWidth={2} opacity={0.8} />
    {Array.from({ length: 8 }, (_, i) => (
      <path key={i} d={`M${-120 + i * 34} ${-250 + i * 1.2}L${-120 + i * 34} ${-128 + i}`} stroke="#D8C8A0" strokeWidth={1.4} opacity={0.6} />
    ))}
    {Array.from({ length: 5 }, (_, i) => (
      <path key={i} d={`M-120 ${-226 + i * 24}Q0 ${-176 + i * 24 + 6 * Math.sin(f / 14)} 120 ${-218 + i * 22}`} stroke="#D8C8A0" strokeWidth={1.4} fill="none" opacity={0.6} />
    ))}
  </g>
);

const Lantern: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 0L0 -170" stroke="#4A2A14" strokeWidth={6} />
    <path d="M0 -170L30 -170L30 -150" stroke="#4A2A14" strokeWidth={4} fill="none" />
    <rect x={18} y={-150} width={24} height={34} rx={6} fill="#FFC23A" opacity={0.9} />
    <circle cx={30} cy={-132} r={60} fill="#FFB04A" opacity={0.18 + 0.04 * Math.sin(f / 4)} filter="url(#bhBlur6)" />
  </g>
);

export const FisherSet: React.FC<{ f: number; mood?: "dusk" | "dawn" | "night"; huts?: boolean }> = ({ f, mood = "dusk", huts = true }) => {
  const sky = mood === "dawn" ? "bhDawn" : "bhDusk";
  const river = mood === "dawn" ? "bhRiverDawn" : "bhRiverDusk";
  const sil = mood === "dawn" ? "#5A6A4A" : "#1E1A34";
  const sand = mood === "dawn" ? ["#E8C48A", "#C99A62"] : mood === "night" ? ["#4A3A44", "#3A2C34"] : ["#A8785A", "#7A5440"];
  return (
    <g>
      <rect width={W} height={H} fill={`url(#${sky})`} />
      {mood !== "dawn" ? <Stars f={f} n={40} y1={600} seed="fs" o={0.8} /> : null}
      <circle cx={760} cy={HZ - 50} r={80} fill={mood === "dawn" ? "#FFF2C8" : "#FFC08A"} opacity={0.85} />
      <circle cx={760} cy={HZ - 50} r={300} fill="#FFC46A" opacity={0.16} filter="url(#bhBlur20)" />
      {Array.from({ length: 4 }, (_, i) => {
        const x = ((i * 330 + f * 0.3) % 1500) - 300;
        return <path key={i} d={`M${x} ${320 + i * 120}c80 -50 200 -50 260 -10c50 -36 140 -26 170 18L${x - 30} ${370 + i * 120}Z`} fill={mood === "dawn" ? "#FFE8C8" : "#4A2A62"} opacity={0.6} />;
      })}
      {/* far bank forest */}
      <path d={`M0 ${HZ}L0 ${HZ - 40}` + Array.from({ length: 19 }, (_, i) => `Q${i * 60 + 30} ${HZ - 110 - 40 * rnd(i, 7)} ${(i + 1) * 60} ${HZ - 40 - 20 * rnd(i, 3)}`).join("") + `L${W} ${HZ}Z`} fill={sil} />
      {/* river */}
      <rect x={0} y={HZ} width={W} height={H - HZ} fill={`url(#${river})`} />
      {Array.from({ length: 12 }, (_, i) => {
        const yy = HZ + 12 + i * 26;
        const ww = 70 + i * 12 + 22 * Math.sin(f / 10 + i);
        return <rect key={i} x={760 - ww / 2 + Math.sin(f / 14 + i * 1.3) * 14} y={yy} width={ww} height={5} rx={2.5} fill="#FFD9A0" opacity={0.65 - i * 0.04} />;
      })}
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${((i * 233 + f * 1.2) % 1300) - 120} ${HZ + 50 + i * 40}q40 -10 80 0q40 10 80 0`} stroke="#E8D8FF" strokeWidth={3} fill="none" opacity={0.3} />
      ))}
      {/* foreground bank */}
      <path d={`M0 1330C220 1300 480 1340 720 1310C860 1296 980 1312 1080 1300L1080 ${H}L0 ${H}Z`} fill={sand[0]} />
      <path d={`M0 1500C260 1470 560 1520 1080 1480L1080 ${H}L0 ${H}Z`} fill={sand[1]} opacity={0.7} />
      {huts ? (
        <g>
          <Hut x={150} y={1340} s={0.75} f={f} />
          <Hut x={930} y={1330} s={0.62} f={f} lit={mood !== "dawn"} />
          <Net x={720} y={1330} s={0.7} f={f} />
          {mood !== "dawn" ? <Lantern x={330} y={1360} f={f} /> : null}
          <g transform="translate(540 1300) scale(0.5)">
            <path d="M-260 -40C-200 30 200 30 260 -40L300 -110L270 -100L240 -50C120 -20 -120 -20 -240 -50L-270 -100L-300 -110Z" fill="#6A3E1E" stroke="#3E220E" strokeWidth={4} />
          </g>
        </g>
      ) : null}
    </g>
  );
};

/** Heaven opening over the vow: golden glow, a bright cloud and rays fanning down to (x, y). */
export const HeavenLight: React.FC<{ f: number; k: number; x?: number }> = ({ f, k, x = 540 }) => {
  if (k <= 0.001) return null;
  return (
    <g opacity={k}>
      <ellipse cx={x} cy={260} rx={620} ry={300} fill="#FFF0B8" opacity={0.6} filter="url(#bhBlur20)" />
      <ellipse cx={x} cy={230} rx={260} ry={110} fill="#FFFFFF" opacity={0.75} filter="url(#bhBlur20)" />
      {Array.from({ length: 11 }, (_, i) => {
        const bx = x - 500 + i * 100;
        const sw = 24 + 20 * Math.abs(Math.sin(i * 1.3 + f / 22));
        return <path key={i} d={`M${bx - sw / 2} 180L${bx + sw / 2} 180L${x + (bx - x) * 1.9 + sw * 2} 1600L${x + (bx - x) * 1.9 - sw * 2} 1600Z`} fill="#FFF4C8" opacity={0.16} />;
      })}
      {Array.from({ length: 6 }, (_, i) => (
        <circle key={i} cx={x - 300 + i * 120} cy={250 + 20 * Math.sin(i * 2 + f / 30)} r={110 + (i % 2) * 40} fill="#FFF3C8" opacity={0.7} filter="url(#bhBlur20)" />
      ))}
    </g>
  );
};

const PETAL_COLORS = ["#F6A21B", "#FFC23A", "#E0304A", "#FFFDF4", "#F27A1A", "#D9467A"];
/** A heavy shower of petals from the top of frame; k fades it in/out. */
export const FlowerRain: React.FC<{ f: number; a: number; k?: number; n?: number }> = ({ f, a, k = 1, n = 70 }) => {
  if (k <= 0.001 || f < a) return null;
  const t = f - a;
  return (
    <g opacity={k}>
      {Array.from({ length: n }, (_, i) => {
        const delay = rnd(i, 1) * 40;
        const tt = t - delay;
        if (tt < 0) return null;
        const sp = 5 + 5 * rnd(i, 2);
        const y = -40 + ((tt * sp) % 2000);
        const x = rnd(i, 3) * W + Math.sin(tt / 12 + i) * 40;
        const r = 7 + 7 * rnd(i, 4);
        return <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.6} fill={PETAL_COLORS[i % PETAL_COLORS.length]} transform={`rotate(${tt * 4 + i * 30} ${x} ${y})`} opacity={0.95} />;
      })}
    </g>
  );
};
