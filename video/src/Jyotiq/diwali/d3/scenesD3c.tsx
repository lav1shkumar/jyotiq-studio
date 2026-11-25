import React from "react";
import { ROZHA } from "../../manthan/graphics";
import { World } from "../../manthan/kit";
import { Motes, Vignette } from "../../manthan/sets";
import { H, ramp, track, W } from "../../manthan/style";
import { AppBedD1, StarNight } from "../d1/scenesD1c";
import { D2Defs } from "../d2/scenesD2a";
import { DashaTimeline } from "../shared/charts";
import { DawnSky, DiyaWave, scatter } from "../shared/fx";
import { GovardhanTease, NightLand } from "./sets3";
import { CUES, SCENES } from "./timing";

/* Diwali Day 3 scenes, part C: the dasha (06), the dawn (07 and the glow beat), and the app and end beds.
   One clock: timing.ts (PLACEHOLDER until the takes are in). */

const cue = (k: string, dflt: number): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);

/* ------------------------------------------------------------------ */
/* 06: 14 years of exile, then the dasha timeline                       */
/* ------------------------------------------------------------------ */

/** Guru's mahadasha on the shared 120-year timeline is years 68-84. The marker lands there, matching the phone
    card's example ('अभी: गुरु महादशा', labelled उदाहरण). */
const GURU_AT = 0.62;

/** The exile's years tick from 1 to 14 from 'चौदह', speeding up, and land with a pop on 'ख़त्म'. The counter then
    rises to become a '14 साल' label while the dasha timeline draws in below; its marker slides through the periods
    of life ('जीवन के दौर') and the current bar glows on 'दशा'. The top (y 230-400) stays free for the chip at 300. */
export const DashaD3: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.dasha;
  const CH = cue("chaudah06", 1053);
  const KH = cue("khatam06", 1129);
  const DS = cue("dasha06", 1279);
  const z = track(f, [[a, 1.0], [b, 1.06, "io"]]);
  const n = 1 + Math.floor(13 * ramp(f, CH, KH - 8, "in"));
  const pop = f >= KH - 4 ? track(f - KH + 4, [[0, 1], [6, 1.18, "out"], [12, 1, "io"]]) : 1;
  const up = ramp(f, KH + 10, KH + 30, "io");
  const cy = 900 - 340 * up;
  const cs = (1 - 0.55 * up) * pop;
  const k = ramp(f, KH + 14, KH + 44, "out");
  const marker = GURU_AT * ramp(f, KH + 30, DS, "io");
  const glow = ramp(f, DS - 2, DS + 6, "out") * (1 - 0.6 * ramp(f, DS + 8, DS + 30, "io"));
  const mx = 540 - 450 + 900 * marker;
  return (
    <World>
      <D2Defs />
      <rect width={W} height={H} fill="#0B0B24" />
      <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
        <circle cx={540} cy={960} r={640} fill="url(#d2Flare)" opacity={0.16} />
        <g transform={`translate(540 ${cy}) scale(${cs})`}>
          <text y={-190} textAnchor="middle" fontFamily={ROZHA} fontSize={72} fill="#F6EBD6" opacity={0.9}>
            वनवास
          </text>
          <text y={90} textAnchor="middle" fontFamily={ROZHA} fontSize={300} fill="#FFD36B" style={{ filter: "drop-shadow(0 0 24px rgba(255,201,77,0.6))" }}>
            {n}
          </text>
          <text y={200} textAnchor="middle" fontFamily={ROZHA} fontSize={90} fill="#F3DB9D">
            साल
          </text>
        </g>
        {k > 0 ? (
          <g transform="translate(540 1000)">
            <DashaTimeline f={f} marker={marker} k={k} width={900} />
          </g>
        ) : null}
        <circle cx={mx} cy={1000} r={160} fill="url(#d2Flare)" opacity={0.7 * glow} style={{ mixBlendMode: "screen" }} />
        <Motes f={f} n={26} seed="d3dm" color="#FFE6A3" dir={-1} speed={0.4} size={3} o={0.45} />
      </g>
      <Vignette o={0.6} />
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* 07: dawn over the dark land; diya 3 lights (RowLayer, composition)   */
/* ------------------------------------------------------------------ */

const LAND = "M0 1250C300 1206 700 1236 1080 1200L1080 1920L0 1920Z"; // the same rise as NightLand's
const DAWN_LAMPS = scatter(18, 40, 1290, 1000, 520, "d3dl");

/** The moonless land from 03, its lamps still burning. Dawn spreads over the dark sky from 'बदलती' ('हर दशा बदलती
    है') through the glow beat, and the land warms a little. The middle stays calm for the diya row (centre y 1000),
    which lights diya 3 on 'ख़त्म'. */
export const DawnD3: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.dawn;
  const BD = cue("badalti07", 1329);
  const G = cue("glow", 1435);
  const dawn = ramp(f, BD - 6, G + 10, "io");
  const z = track(f, [[a, 1.0], [b, 1.08, "io"]]);
  return (
    <World>
      <D2Defs />
      <g transform={`translate(540 1100) scale(${z}) translate(-540 -1100)`}>
        <NightLand f={f} />
        <DawnSky k={dawn} y={1250} />
        <path d={LAND} fill="#0B0814" />
        <path d={LAND} fill="#3A2430" opacity={0.5 * dawn} />
        <DiyaWave f={f} at={a - 200} points={DAWN_LAMPS} step={0} scale={0.3} seed="d3dl" />
      </g>
      <Vignette o={0.5} />
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* 08 and the end card                                                  */
/* ------------------------------------------------------------------ */

/** Day 1's warm night with drifting bokeh: the same series look under the phone. */
export const AppBedD3 = AppBedD1;

/** A starry night. Tomorrow's art (Krishna lifting Govardhan) fades in on the left half at the sign-off, beside the
    EndTease text (left 490) and above the diya row, which drops to y 700 at the composition level. */
export const EndBedD3: React.FC<{ f: number }> = ({ f }) => {
  const SO = cue("signoff", 1682);
  const y = ramp(f, SO - 6, SO + 14, "out");
  return (
    <World>
      <D2Defs />
      <StarNight f={f} warm={0.3} />
      <g opacity={0.95 * y} transform={`translate(0 ${-6 * (1 - y)})`}>
        <GovardhanTease f={f} x={250} y={610} s={0.72} />
      </g>
    </World>
  );
};
