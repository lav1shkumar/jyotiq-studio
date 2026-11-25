import React from "react";
import { World } from "../../manthan/kit";
import { Motes, Vignette } from "../../manthan/sets";
import { H, ramp, track, W } from "../../manthan/style";
import { AppBedD1, StarNight } from "../d1/scenesD1c";
import { HoraDial } from "../shared/charts";
import { TulaMoonD2 } from "./gfxD2";
import { D2Defs } from "./scenesD2a";
import { KaalWheel } from "./serpent";
import { CUES, SCENES } from "./timing";

/* Diwali Day 2 scenes, part C: Kaal (06 and the glow beat), the Hora dial (07), and the app and end beds (08, end).
   One clock: timing.ts (PLACEHOLDER until the takes are in). */

const cue = (k: string, dflt: number): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);

/* ------------------------------------------------------------------ */
/* 06: Kaal, the wheel of time                                         */
/* ------------------------------------------------------------------ */

/** The wheel turns in a deep night. It spins faster on 'काल' and its hub flares on 'समय', then it dims and settles
    back so diya 2 (the RowLayer, centre y 1000, at the composition level) lights in front of it. The YamaKaalD2 words
    sit at top 300, above the wheel (its top edge is at about y 540). */
export const KaalD2: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.kaal;
  const K = cue("kaal06", 1173);
  const S = cue("samay06", 1203);
  const z = track(f, [[a, 1.0], [b, 1.08, "io"]]);
  const k = ramp(f, a, a + 10, "out");
  const spin = 90 * ramp(f, K - 4, K + 24, "io");
  const hub = ramp(f, S - 3, S + 4, "out") * (1 - 0.6 * ramp(f, S + 6, S + 26, "io"));
  const back = ramp(f, S + 4, S + 20, "io");
  return (
    <World>
      <D2Defs />
      <rect width={W} height={H} fill="#0B0B24" />
      <g transform={`translate(540 900) scale(${z}) translate(-540 -900)`}>
        <circle cx={540} cy={900} r={700} fill="url(#d2Flare)" opacity={0.18 + 0.2 * hub} />
        <g transform={`translate(540 900) scale(${1 - 0.1 * back})`} opacity={1 - 0.6 * back}>
          <KaalWheel f={f + spin} k={k} R={360} />
          <circle r={130} fill="url(#d2Flare)" opacity={0.9 * hub} style={{ mixBlendMode: "screen" }} />
        </g>
        <Motes f={f} n={30} seed="d2km" color="#FFE6A3" dir={-1} speed={0.4} size={3} o={0.5} />
      </g>
      <Vignette o={0.6} />
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* 07: the Hora dial, every hour ruled by a graha                       */
/* ------------------------------------------------------------------ */

/** The dial assembles while 'ज्योतिष' is said and the hand ticks slowly from sunrise. On 'घंटा' it sweeps through
    the horas, so each graha glows in turn (सू शु बु चं श गु मं) as 'हर घंटा एक ग्रह का' is said, and it lands in
    Mars's hora on 'होरा', which sets up 'मंगल होरा' in 08. The dial spans y 530-1390: clear of the top bar (y 230),
    HoraEqD2 (top 300) and the captions (y 1500). */
export const HoraD2: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.hora;
  const GH = cue("ghanta07", 1324);
  const HO = cue("hora07", 1414);
  const z = track(f, [[a, 1.0], [b, 1.06, "io"]]);
  const k = ramp(f, a, a + 12, "out");
  const hour = track(f, [[a, 0], [GH, 0.6, "lin"], [HO, 6.5, "io"], [b, 6.75, "lin"]]);
  const land = ramp(f, HO - 2, HO + 6, "out") * (1 - 0.6 * ramp(f, HO + 8, HO + 24, "io"));
  return (
    <World>
      <D2Defs />
      <rect width={W} height={H} fill="#0B0B24" />
      <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
        <circle cx={540} cy={960} r={640} fill="url(#d2Flare)" opacity={0.14 + 0.25 * land} />
        <g transform="translate(540 960)">
          <HoraDial f={f} hour={hour} k={k} R={400} />
        </g>
        <Motes f={f} n={30} seed="d2hm" color="#FFE6A3" dir={-1} speed={0.4} size={3} o={0.45} />
      </g>
      <Vignette o={0.6} />
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* 08 and the end card: the beds under the phone and the end text       */
/* ------------------------------------------------------------------ */

/** Day 1's warm night with drifting bokeh: the same series look under the phone. */
export const AppBedD2 = AppBedD1;

/** A starry night. Tomorrow's art (Tula holding the Sun and the new moon) fades in on the left half at the sign-off,
    beside the EndTeaseD2 text (left 490) and above the diya row, which drops to y 700 at the composition level. */
export const EndBedD2: React.FC<{ f: number }> = ({ f }) => {
  const SO = cue("signoff", 1651);
  const y = ramp(f, SO - 6, SO + 14, "out");
  return (
    <World>
      <D2Defs />
      <StarNight f={f} warm={0.3} />
      <g opacity={0.95 * y} transform={`translate(0 ${-6 * (1 - y)})`}>
        <TulaMoonD2 f={f} x={270} y={300} s={0.75} />
      </g>
    </World>
  );
};
