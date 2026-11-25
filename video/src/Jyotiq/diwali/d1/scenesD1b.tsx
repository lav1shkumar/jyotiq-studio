import React from "react";
import { World } from "../../manthan/kit";
import { blinkAt } from "../../manthan/rig";
import { Kalash, KshiraSagar, Motes, Vignette } from "../../manthan/sets";
import { H, ramp, rnd, track, W } from "../../manthan/style";
import { DhanvantariStanding } from "../../manthan/ep6/dhanvantari";
import { Swirl6 } from "../../manthan/ep6/scenes6b";
import { MARKET_KALASH, MARKET_KALASH_S, MarketStall } from "./market";
import { D1Defs } from "./scenesD1a";
import { CUES, LINES, SCENES } from "./timing";
import { VO } from "./voData";

/* Diwali Day 1 scenes, part B: Dhanvantari rises from the Manthan sea (03), the match cut from the amrit kalash to
   the brass kalash at a Dhanteras stall (04), and Dhanvantari's close-up with lip-sync (05).
   The rise is Episode 6's DhanvantariScene (ep6/scenes6b.tsx) copied onto the Day 1 clock, with tulsi and giloy
   leaves swirling round him and a push into the kalash for the match cut. Manthan files are imported read-only. */

const cue = (k: string, dflt: number): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);

/** Mouth openness for a Day 1 line at reel frame f (0 outside the line); same smoothing as kit7's talk7. */
export const talkD1 = (line: string, f: number): number => {
  const r = LINES[line];
  const v = VO[line];
  if (!r || !v) return 0;
  const i = Math.round(f) - r[0];
  if (i < 0 || i >= v.env.length) return 0;
  const g = (k: number) => v.env[Math.max(0, Math.min(v.env.length - 1, k))];
  return Math.min(1, ((g(i - 1) + 2 * g(i) + g(i + 1)) / 4) * 1.1);
};

const Rays: React.FC<{ x: number; y: number; k: number; f: number }> = ({ x, y, k, f }) => (
  <g transform={`translate(${x} ${y}) rotate(${f * 0.3})`} opacity={0.5 * k}>
    {Array.from({ length: 14 }, (_, i) => (
      <path key={i} d="M-26 0L26 0L120 -900L-120 -900Z" transform={`rotate(${i * (360 / 14)})`} fill="#FFE6A3" opacity={0.18} />
    ))}
  </g>
);

const Spray: React.FC<{ f: number; at: number; x: number; y: number }> = ({ f, at, x, y }) => {
  const t = f - at;
  if (t < 0 || t > 36) return null;
  return (
    <g>
      {Array.from({ length: 18 }, (_, i) => {
        const a = Math.PI * (1.05 + (0.9 * i) / 17);
        const v = 10 + (i % 4) * 4;
        return <circle key={i} cx={x + Math.cos(a) * v * t} cy={y + Math.sin(a) * v * t + 0.35 * t * t} r={9 - t / 5} fill="#FFFFFF" opacity={1 - t / 36} />;
      })}
    </g>
  );
};

/** Tulsi (small oval) and giloy (heart-shaped) leaves orbiting the figure, drifting upward. */
const Herbs: React.FC<{ f: number; k: number; cx: number; cy: number }> = ({ f, k, cx, cy }) => {
  if (k <= 0.01) return null;
  return (
    <g opacity={k}>
      {Array.from({ length: 18 }, (_, i) => {
        const a = (i / 18) * Math.PI * 2 + f * (0.018 + (i % 3) * 0.006);
        const r = 210 + rnd(`hb${i}r`) * 150;
        const lift = ((f * (0.7 + rnd(`hb${i}v`) * 0.6) + rnd(`hb${i}y`) * 500) % 500) - 250;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r * 0.42 - lift;
        const front = Math.sin(a) > 0;
        const s = (0.8 + 0.5 * rnd(`hb${i}s`)) * (front ? 1.15 : 0.8);
        const heart = i % 3 === 0;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${f * (2 + (i % 4)) + i * 40}) scale(${s})`} opacity={front ? 1 : 0.55}>
            {heart ? (
              <path d="M0 14C-16 2 -18 -10 -10 -16C-4 -20 0 -14 0 -10C0 -14 4 -20 10 -16C18 -10 16 2 0 14Z" fill="#5AAE4A" stroke="#2E6A24" strokeWidth={1.5} />
            ) : (
              <path d="M0 0C-8 -6 -8 -18 0 -26C8 -18 8 -6 0 0Z" fill="#3E8E3A" stroke="#1F5A1E" strokeWidth={1.5} />
            )}
          </g>
        );
      })}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* The match cut: where the market's brass kalash body sits when 04 opens */
/* ------------------------------------------------------------------ */

export const MARKET_Z0 = 1.12;
export const MARKET_LIFT0 = 0.3;
const up0 = 1 - Math.pow(1 - MARKET_LIFT0, 3); // MarketStall eases lift with a cubic "out"
const ky0 = MARKET_KALASH[1] + (1 - up0) * 140;
const bodyC = ky0 - 114 * MARKET_KALASH_S; // the brass body spans y -2..-226 at scale 1
export const MATCH_Y = MARKET_KALASH[1] + (bodyC - MARKET_KALASH[1]) * MARKET_Z0;
export const MATCH_W = 208 * MARKET_KALASH_S * MARKET_Z0;

/* ------------------------------------------------------------------ */
/* 03: Dhanvantari rises with the amrit kalash                          */
/* ------------------------------------------------------------------ */

export const RiseD1: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.rise;
  const z = track(f, [[a, 1.0], [b, 1.06, "io"]]);
  const swirl = ramp(f, a - 6, a + 10, "out");
  const rise = ramp(f, a + 6, cue("dhanvantari", a + 120) + 6, "out");
  const s = 0.9;
  const footY = 2320 - 820 * rise; // feet end at y 1500
  const glow = 0.6 + 0.4 * Math.sin(f / 9);
  const herbs = ramp(f, cue("dhanvantari", a + 120) - 20, cue("vaidya", a + 200), "out");
  // push into the amrit kalash so it lands where the market's brass kalash opens (the match cut)
  const K = cue("kalash03", b - 20);
  const p = ramp(f, K - 14, b, "in");
  const kalBodyY = footY - 392 - 62 * 0.61; // the Manthan kalash body centre (local -62 at scale 0.61)
  const ys = 960 + (kalBodyY - 960) * z;
  const ws = 208 * 0.61 * z;
  const m = 1 + (MATCH_W / ws - 1) * p;
  const yt = ys + (MATCH_Y - ys) * p;
  const flare = ramp(f, K - 6, K + 8, "out");
  return (
    <World>
      <D1Defs />
      <g transform={`translate(540 ${yt}) scale(${m}) translate(-540 ${-ys})`}>
        <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
          <KshiraSagar f={f} cam={{ x: 0, y: 0, z: 1 }} glow={0.6} swell={0.4} />
          <rect width={W} height={H} fill="#0C0A1C" opacity={0.25} />
          <Rays x={540} y={1200} k={rise} f={f} />
          <Swirl6 f={f} x={540} y={1520} k={swirl} />
          <Herbs f={f} k={herbs * (1 - p)} cx={540} cy={footY - 430} />
          <clipPath id="d1-water">
            <rect x={0} y={0} width={W} height={1525} />
          </clipPath>
          <g clipPath="url(#d1-water)">
            <g transform={`translate(540 ${footY}) scale(${s})`}>
              <DhanvantariStanding t={f} smile={0.45} closed={blinkAt("dh1", f)} halo={0.9 * rise} handL={[-36, -110]} handR={[36, -110]} />
            </g>
            <g transform={`translate(540 ${footY - 392})`}>
              <circle r={110 + 40 * flare} fill="#FFE08A" opacity={(0.35 * glow + 0.35 * flare) * rise} filter="url(#mBlur8)" />
              <Kalash f={f} glow={0.7 + 0.3 * glow + 0.4 * flare} s={0.61} />
            </g>
          </g>
          <ellipse cx={540} cy={1522} rx={300 * (0.6 + 0.4 * swirl)} ry={34} fill="#FFFFFF" opacity={0.7 * swirl} />
          <Spray f={f} at={a + 6} x={540} y={1520} />
          <Motes f={f} n={34} seed="d1rm" color="#FFE6A3" dir={-1} speed={0.7} size={3} o={0.7} />
        </g>
      </g>
      <Vignette o={0.6 * (1 - p)} />
      <rect width={W} height={H} fill="#FFF1C4" opacity={0.35 * p * p} />
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* 04: the market stall (match cut on the kalash)                       */
/* ------------------------------------------------------------------ */

export const MarketD1: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.market;
  const z = track(f, [[a, MARKET_Z0], [a + 30, 1.0, "io"], [b + 14, 1.07, "io"]]);
  const lift = MARKET_LIFT0 + (1 - MARKET_LIFT0) * ramp(f, a + 4, cue("bartan", a + 45) + 8, "out");
  const K4 = cue("kalash04", a + 115);
  const shine = 0.6 + 0.4 * ramp(f, K4 - 4, K4 + 8, "out");
  const [kx, ky] = MARKET_KALASH;
  const warm = 1 - ramp(f, a, a + 10, "out");
  return (
    <World>
      <D1Defs />
      <g transform={`translate(${kx} ${ky}) scale(${z}) translate(${-kx} ${-ky})`}>
        <MarketStall f={f} lift={lift} shine={shine} />
      </g>
      <rect width={W} height={H} fill="#FFF1C4" opacity={0.3 * warm} />
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* 05: Dhanvantari close-up, lip-synced, the kalash glowing below       */
/* ------------------------------------------------------------------ */

const CU = 2.2; // close-up scale: eyes near y 600, the kalash body about y 1030-1235

export const WordsD1: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.words;
  const z = track(f, [[a, 1.0], [b, 1.05, "io"]]);
  const speak = talkD1("05_dhanvantari", f);
  const footY = 600 + 720 * CU;
  const glow = 0.7 + 0.3 * Math.sin(f / 9);
  const kaya = ramp(f, cue("kaya", a + 70) - 2, cue("kaya", a + 70) + 10, "out");
  return (
    <World>
      <D1Defs />
      <g transform={`translate(540 800) scale(${z}) translate(-540 -800)`}>
        <KshiraSagar f={f} cam={{ x: 0, y: 0, z: 1 }} glow={0.7} swell={0.2} />
        <rect width={W} height={H} fill="#0C0A1C" opacity={0.42} />
        <Rays x={540} y={620} k={0.8} f={f} />
        <Herbs f={f} k={0.7} cx={540} cy={700} />
        <g transform={`translate(540 ${footY}) scale(${CU})`}>
          <DhanvantariStanding t={f} smile={0.5} speak={speak} closed={blinkAt("dh1c", f)} halo={1} handL={[-36, -110]} handR={[36, -110]} />
        </g>
        <g transform={`translate(540 ${footY - (392 / 0.9) * CU})`}>
          <circle cx={0} cy={-90 * 0.678 * CU} r={160 + 40 * kaya} fill="#FFE08A" opacity={0.3 * glow + 0.3 * kaya} filter="url(#mBlur8)" />
          <Kalash f={f} glow={0.8 + 0.2 * glow + 0.3 * kaya} s={0.678 * CU} />
        </g>
        <Motes f={f} n={26} seed="d1wm" color="#FFE6A3" dir={-1} speed={0.5} size={3.5} o={0.6} />
      </g>
      <Vignette o={0.65} />
    </World>
  );
};
