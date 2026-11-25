import React from "react";
import { World } from "../../manthan/kit";
import { GiantLotus, LakshmiStanding } from "../../manthan/ep5/lakshmi";
import { ramp, track, W } from "../../manthan/style";
import { D2Defs } from "../d2/scenesD2a";
import { Doorstep } from "../d2/sets2";
import { DiyaWave, scatter } from "../shared/fx";
import { Ayodhya, NightLand, Rishis, Vimana } from "./sets3";
import { CUES, LINES, SCENES } from "./timing";
import { VO } from "./voData";

/* Diwali Day 3 scenes, part B: the rishis (03), Lakshmi (04) and Ayodhya (05).
   One clock: timing.ts (PLACEHOLDER until the takes are in). */

const cue = (k: string, dflt: number): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);

/** Zoom about a fixed point, so the frame never leaves the set (for z >= 1). */
const zoomAt = (x: number, y: number, z: number) => `translate(${x} ${y}) scale(${z}) translate(${-x} ${-y})`;

/* ------------------------------------------------------------------ */
/* 03: the rishis, the first diya, the wave of lamps across the land    */
/* ------------------------------------------------------------------ */

/** Lamps scattered over the land in three depth bands, each lit from the centre (the rishis) outward. */
const band = (n: number, y0: number, h: number, s: number, seed: string) => ({
  pts: scatter(n, 20, y0, 1040, h, seed).sort((p, q) => Math.abs(p[0] - 540) - Math.abs(q[0] - 540)),
  s,
});
const FAR = band(24, 1262, 110, 0.22, "d3wa");
const NEAR = [band(22, 1440, 150, 0.34, "d3wb"), band(18, 1630, 220, 0.5, "d3wc")];

/** Wide under the vast moonless sky ('आसमान में रोशनी कम'); a cut on 'ऋषियों'+40 close on the lead rishi, whose
    diya lights on 'धरती'; a cut back wide as the lamps spread across the land on 'दीये'. */
export const RishisD3: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.rishis;
  const RI = cue("rishi03", 449);
  const DH = cue("dharti03", 585);
  const DY = cue("diye03", 615);
  const C1 = RI + 40;
  const C2 = DH + 10;
  const light = ramp(f, DH - 4, DH + 8, "out");
  const view =
    f >= C1 && f < C2 ? zoomAt(540, 1230, track(f, [[C1, 1.8], [C2, 1.9, "io"]])) : zoomAt(540, 1100, track(f, [[a, 1.0], [b, 1.06, "io"]]));
  return (
    <World>
      <D2Defs />
      <g transform={view}>
        <NightLand f={f} />
        <DiyaWave f={f} at={DY - 8} points={FAR.pts} step={1} scale={FAR.s} seed="d3wfar" />
        <Rishis f={f} light={light} />
        {NEAR.map((w, i) => (
          <DiyaWave key={i} f={f} at={DY - 6 + 3 * i} points={w.pts} step={1} scale={w.s} seed={`d3wn${i}`} />
        ))}
      </g>
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* 04: Lakshmi at the lit doorway                                       */
/* ------------------------------------------------------------------ */

/** Mouth openness from the take's loudness envelope (Day 1's talkD1 on Day 3's clock). */
export const talkD3 = (line: string, f: number): number => {
  const r = LINES[line];
  const v = VO[line];
  if (!r || !v) return 0;
  const i = Math.round(f) - r[0];
  if (i < 0 || i >= v.env.length) return 0;
  const g = (k: number) => v.env[Math.max(0, Math.min(v.env.length - 1, k))];
  return Math.min(1, ((g(i - 1) + 2 * g(i) + g(i + 1)) / 4) * 1.1);
};

/** The doorstep at night (Day 2's set under an indigo veil, so the sky reads as night, not dusk) with a row of
    diyas along the threshold. Lakshmi appears on her lotus in front of the doors in a warm bloom, in the abhaya pose,
    her lips moving with her voice. A gentle stream of gold falls from her hand on 'दीया' (her traditional blessing,
    kept soft). A slow push to a medium shot by 'आती'. */
export const LakshmiD3: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.lakshmi;
  const LA = cue("lakshmi04", 650);
  const DI = cue("diya04", 695);
  const AT = cue("aati04", 771);
  const z = track(f, [[a, 1.0], [AT, 1.22, "io"], [b, 1.26, "lin"]]);
  const appear = ramp(f, LA - 4, LA + 10, "out");
  const bloom = ramp(f, LA - 4, LA + 4, "out") * (1 - 0.65 * ramp(f, LA + 6, LA + 30, "io"));
  const coins = 0.6 * ramp(f, DI - 4, DI + 12, "out");
  return (
    <World>
      <D2Defs />
      <g transform={`translate(540 980) scale(${z}) translate(-540 -980)`}>
        <Doorstep f={f} push={ramp(f, a, b, "lin")} />
        <defs>
          <linearGradient id="d3Veil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0B0B2A" stopOpacity={0.55} />
            <stop offset="0.7" stopColor="#0B0B2A" stopOpacity={0.3} />
            <stop offset="1" stopColor="#0B0B2A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect width={W} height={980} fill="url(#d3Veil)" />
        <DiyaWave f={f} at={a - 60} points={[[300, 1360], [380, 1372], [460, 1380], [620, 1380], [700, 1372], [780, 1360]]} step={1} scale={0.4} seed="d3th" />
        <g opacity={appear}>
          <g transform="translate(540 1330)">
            <GiantLotus id="d3lotus" f={f} open={appear} glow={0.8} s={1.4} />
          </g>
          <LakshmiStanding id="d3lk" f={f} x={540} y={1264} s={0.74} pose="abhaya" coins={coins} speak={talkD3("04_lakshmi", f)} smile={0.6} glow={0.6} halo={1} />
        </g>
        <circle cx={540} cy={900} r={640} fill="url(#d2Flare)" opacity={0.8 * bloom} style={{ mixBlendMode: "screen" }} />
      </g>
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* 05: the Pushpak vimana over Ayodhya, the city lighting up             */
/* ------------------------------------------------------------------ */

/** The vimana flies in from the upper left while the return is told and settles over the palace on 'अयोध्या', then
    sinks slowly. A cut on 'और' to the wide city, which lights from the palace outward on 'दीयों से जगमगा', every lamp
    mirrored in the Saryu. */
export const AyodhyaD3: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.ayodhya;
  const AYC = cue("ayodhya05", 912);
  const C = cue("cap05b", 957);
  const JG = cue("jagmaga05", 1017);
  const fly = ramp(f, a, AYC, "io");
  const vx = -250 + 790 * fly;
  const vy = 260 + 340 * fly + 70 * ramp(f, AYC, b, "io") + Math.sin(f / 14) * 8;
  const vs = 0.45 + 0.35 * fly;
  const view =
    f < C ? zoomAt(540, 900, track(f, [[a, 1.12], [C, 1.2, "lin"]])) : zoomAt(540, 1340, track(f, [[C, 1.0], [b, 1.05, "io"]]));
  return (
    <World>
      <D2Defs />
      <g transform={view}>
        <Ayodhya f={f} at={JG - 30} step={1} />
        <g transform={`translate(${vx} ${vy}) rotate(${(1 - fly) * 6})`}>
          <Vimana f={f} s={vs} />
        </g>
      </g>
    </World>
  );
};
