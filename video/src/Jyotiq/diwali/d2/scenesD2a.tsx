import React from "react";
import { World } from "../../manthan/kit";
import { RigDefs } from "../../manthan/rig";
import { H, ramp, track, W } from "../../manthan/style";
import { CounterDefs } from "../d1/counter";
import { DiyaDefs } from "../d1/diya";
import { MarketDefs } from "../d1/market";
import { TimeRewind } from "../shared/fx";
import { Couple, Doorstep, Palace } from "./sets2";
import { CUES, SCENES } from "./timing";

/* Diwali Day 2 scenes, part A: the hook (01: the dusk doorstep with the four-wick yam diya) and Kaal's rewind into
   the title. One clock: timing.ts (PLACEHOLDER until the takes are in; scripts/diwali_d2_audio.py regenerates it). */

const cue = (k: string, dflt: number): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);

/** All Day 2 svg defs on top of World's own (RigDefs, SetDefs). The sets reuse Day 1's diya, counter and market defs. */
export const D2Defs: React.FC = () => (
  <>
    <CounterDefs />
    <MarketDefs />
    <DiyaDefs />
    <defs>
      <radialGradient id="d2Flare">
        <stop offset="0" stopColor="#FFE2A0" stopOpacity={0.9} />
        <stop offset="0.4" stopColor="#FFB040" stopOpacity={0.35} />
        <stop offset="1" stopColor="#FF8A20" stopOpacity={0} />
      </radialGradient>
    </defs>
  </>
);

/* ------------------------------------------------------------------ */
/* 01 hook: lit from frame 0, a slow push into the diya                 */
/* ------------------------------------------------------------------ */

/** The doorstep at dusk; the yam diya's flames flare up on the spoken 'दीया' and settle to a warm glow. */
export const HookD2: React.FC<{ f: number }> = ({ f }) => {
  const [, end] = SCENES.hook;
  const push = track(f, [[0, 0], [end, 1, "io"]]);
  const D = cue("diya01", 49);
  const flare = ramp(f, D - 2, D + 6, "out") * (1 - 0.6 * ramp(f, D + 8, D + 40, "io"));
  return (
    <World>
      <D2Defs />
      <Doorstep f={f} push={push} />
      <circle cx={540} cy={1460} r={320} fill="url(#d2Flare)" opacity={0.25 + 0.55 * flare} />
    </World>
  );
};

/** Kaal's rewind from the end of 01 into the title, as an svg overlay above the scenes. It clears before the title
    has fully settled, so the title reads alone. */
export const RewindD2: React.FC<{ f: number }> = ({ f }) => {
  const R = cue("rewind", 211);
  const T = cue("titleHit", 223);
  if (f < R - 2 || f > T + 14) return null;
  const k = ramp(f, R - 2, R + 6, "out") * (1 - ramp(f, T + 4, T + 14, "in"));
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <RigDefs />
      <TimeRewind f={f} k={k} x={540} y={1180} s={0.9} />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Title + 02: the palace at night, Raja Him's son and his bride        */
/* ------------------------------------------------------------------ */

/** Wide under the title, a push on 'हिम', a cut to a closer two-shot on 'विवाह', and a cold wash on 'मृत्यु'.
    The couple worries from 'विवाह' on; the palace pushes a little faster than the couple, for depth. */
export const PalaceD2: React.FC<{ f: number }> = ({ f }) => {
  const [a] = SCENES.title;
  const [, b] = SCENES.palace;
  const HIM = cue("him02", 278);
  const V = cue("cap02b", 339);
  const M = cue("mrityu02", 414);
  const close = f >= V;
  const Z = close ? track(f, [[V, 1.45], [b, 1.56, "io"]]) : track(f, [[a, 1.0], [HIM, 1.03, "io"], [V, 1.14, "io"]]);
  const fy = close ? 900 : 1000;
  const worry = ramp(f, V, M + 10, "io");
  const cold = ramp(f, M - 4, M + 16, "out");
  return (
    <World>
      <D2Defs />
      <g transform={`translate(540 ${fy}) scale(${Z}) translate(-540 ${-fy})`}>
        <Palace f={f} push={ramp(f, a, b, "lin")} />
        <g transform="translate(540 1300) scale(0.9)">
          <Couple f={f} worry={worry} />
        </g>
      </g>
      <rect width={W} height={H} fill="#16245A" opacity={0.3 * cold} />
    </World>
  );
};
