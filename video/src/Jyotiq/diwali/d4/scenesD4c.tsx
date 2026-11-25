import React from "react";
import { World } from "../../manthan/kit";
import { Motes, Vignette } from "../../manthan/sets";
import { ramp, rnd, track, W } from "../../manthan/style";
import { AppBedD1, StarNight } from "../d1/scenesD1c";
import { D2Defs } from "../d2/scenesD2a";
import { GocharWheel } from "../shared/charts";
import { AnnakootThali, BhaiDoojTease, MOUND_PATH, Villager } from "./sets4";
import { CUES, SCENES } from "./timing";

/* Diwali Day 4 scenes, part C: Annakoot (06), the gochar wheel (07 and the glow beat), and the app and end beds.
   One clock: timing.ts (PLACEHOLDER until the takes are in). */

const cue = (k: string, dflt: number): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);

/* ------------------------------------------------------------------ */
/* 06: everything cooked together under the hill: Annakoot              */
/* ------------------------------------------------------------------ */

const ITEM_COLS = ["#4C9A2A", "#E8792B", "#F2C230", "#C8302E", "#F2A23A", "#6BB33A"];
const ITEMS = Array.from({ length: 26 }, (_, i) => {
  const left = i % 2 === 0;
  return {
    x0: left ? -80 : 1160,
    y0: 900 + rnd(`ak6y${i}`) * 500,
    x1: 540 + (rnd(`ak6x${i}`) * 2 - 1) * 80,
    y1: 1220 - rnd(`ak6h${i}`) * 110,
    r: 9 + 7 * rnd(`ak6r${i}`),
    c: ITEM_COLS[i % ITEM_COLS.length],
    leaf: i % 5 === 0,
  };
});

/** Under the hill in warm lamplight, the village gathers round a brass pot over a fire. On 'मिला' food flies in from
    both sides (whatever each home had) and piles into a mound in the pot. On 'वही' ('वही है अन्नकूट') the pile grows
    into the hook's Annakoot thali at the hook's place and size: a match back to the opening. */
export const AnnakootD4: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.annakoot;
  const MI = cue("mila06", 1189);
  const C = cue("cap06b", 1255);
  const z = track(f, [[a, 1.0], [b, 1.06, "io"]]);
  const pile = ramp(f, MI + 8, C - 4, "out");
  const match = ramp(f, C - 2, C + 22, "io");
  const ms = 0.55 + (1.15 - 0.55) * match;
  const my = 1262 + (1450 - 1262) * match;
  return (
    <World>
      <D2Defs />
      <g transform={`translate(540 1200) scale(${z}) translate(-540 -1200)`}>
        <defs>
          <linearGradient id="d4Under" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1A120C" />
            <stop offset="1" stopColor="#6A3A1A" />
          </linearGradient>
          <linearGradient id="d4Pot" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7A4A10" />
            <stop offset="0.5" stopColor="#D9A040" />
            <stop offset="1" stopColor="#7A4A10" />
          </linearGradient>
        </defs>
        <rect width={W} height={1920} fill="url(#d4Under)" />
        <circle cx={540} cy={1250} r={760} fill="url(#d2Flare)" opacity={0.75} style={{ mixBlendMode: "screen" }} />
        <path d="M-100 0H1180V330C900 300 700 322 540 312C380 322 180 300 -100 330Z" fill="#141C10" />
        <path d="M0 1440C300 1424 700 1436 1080 1416V1920H0Z" fill="#2A1A0E" />
        <g opacity={1 - match} transform="translate(0 -200)">
          <Villager x={200} y={1660} s={1.15} dress={1} />
          <Villager x={320} y={1690} s={1.1} flip dress={0} />
          <Villager x={760} y={1690} s={1.1} dress={1} />
          <Villager x={880} y={1660} s={1.15} flip dress={0} />
          {[-60, -20, 20, 60].map((dx, i) => (
            <path key={i} d={`M${540 + dx - 14} 1640Q${540 + dx} ${1588 - 10 * Math.sin(f / 3 + i)} ${540 + dx + 14} 1640Z`} fill="#FF8A2E" opacity={0.85} />
          ))}
          <path d="M390 1460C390 1560 450 1620 540 1620C630 1620 690 1560 690 1460Z" fill="url(#d4Pot)" />
          <ellipse cx={540} cy={1460} rx={160} ry={26} fill="#C8952E" stroke="#FFE6A3" strokeWidth={3} />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${500 + i * 40} 1440C${490 + i * 40} 1400 ${520 + i * 40} 1370 ${505 + i * 40} 1320`} stroke="#FFF6E4" strokeWidth={6} fill="none" opacity={0.18 * (1 - pile)} />
          ))}
        </g>
        <g transform={`translate(540 ${my}) scale(${ms})`} opacity={pile * (1 - match)}>
          <path d={MOUND_PATH} fill="url(#d4Rice)" />
        </g>
        {ITEMS.map((it, i) => {
          const t0 = MI + i * 2;
          const e = ramp(f, t0, t0 + 16, "io");
          if (e <= 0 || e >= 1) return null;
          const x = it.x0 + (it.x1 - it.x0) * e;
          const y = it.y0 + (it.y1 - it.y0) * e - 140 * Math.sin(Math.PI * e);
          return it.leaf ? <path key={i} d={`M${x} ${y}c-6 -10 -2 -20 6 -24c4 8 2 18 -6 24z`} fill={it.c} /> : <circle key={i} cx={x} cy={y} r={it.r} fill={it.c} />;
        })}
        <g opacity={match} transform="translate(540 1450)">
          <AnnakootThali f={f} s={1.15} />
        </g>
      </g>
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* 07: the gochar wheel; diya 4 lights below it (RowLayer, centre 1560) */
/* ------------------------------------------------------------------ */

/** The wheel of the 12 rashis turns in a deep night with शनि, गुरु, राहु and केतु on it. On 'बदलाव' it pulses as diya
    4 lights below it; on 'गोचर' the planets visibly speed along their paths (time-warped, as the chart's own motion is
    illustrative). The wheel stays bright: Day 4's diya row sits low (centre y 1560), so 07 carries no caption and the
    chip at top 300 names it. */
export const GocharD4: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.gochar;
  const BD = cue("badlav07", 1374);
  const GC = cue("gochar07", 1450);
  const z = track(f, [[a, 1.0], [b, 1.06, "io"]]);
  const k = ramp(f, a, a + 12, "out");
  const warp = 300 * ramp(f, GC - 6, GC + 30, "io");
  const pulse = ramp(f, BD - 2, BD + 6, "out") * (1 - 0.6 * ramp(f, BD + 8, BD + 30, "io"));
  return (
    <World>
      <D2Defs />
      <rect width={W} height={1920} fill="#0B0B24" />
      <g transform={`translate(540 940) scale(${z}) translate(-540 -940)`}>
        <circle cx={540} cy={940} r={620} fill="url(#d2Flare)" opacity={0.14 + 0.25 * pulse} />
        <g transform="translate(540 940)">
          <GocharWheel f={f + warp} k={k} R={380} />
        </g>
        <Motes f={f} n={28} seed="d4gm" color="#FFE6A3" dir={-1} speed={0.4} size={3} o={0.45} />
      </g>
      <Vignette o={0.6} />
    </World>
  );
};

/** Day 1's warm night with drifting bokeh: the same series look under the phone. */
export const AppBedD4 = AppBedD1;

/** A starry night. Tomorrow's art (Yamraj walking to his sister's lit door) fades in on the left half at the sign-off,
    beside the EndTease text (left 490) and above the diya row, which drops to y 700 at the composition level. */
export const EndBedD4: React.FC<{ f: number }> = ({ f }) => {
  const SO = cue("signoff", 1713);
  const y = ramp(f, SO - 6, SO + 14, "out");
  return (
    <World>
      <D2Defs />
      <StarNight f={f} warm={0.3} />
      <g opacity={0.95 * y} transform={`translate(0 ${-6 * (1 - y)})`}>
        <BhaiDoojTease f={f} x={250} y={600} s={0.65} />
      </g>
    </World>
  );
};
