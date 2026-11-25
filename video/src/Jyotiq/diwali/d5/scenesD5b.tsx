import React from "react";
import { World } from "../../manthan/kit";
import { blinkAt } from "../../manthan/rig";
import { Motes, Vignette } from "../../manthan/sets";
import { H, ramp, rnd, track, W } from "../../manthan/style";
import { D2Defs } from "../d2/scenesD2a";
import { DeityStanding, YAMRAJ } from "../shared/deities";
import { DawnSky } from "../shared/fx";
import { AartiThali, LeafPlate, TilakClose } from "./sets5";
import { CUES, LINES, SCENES } from "./timing";
import { VO } from "./voData";

/* Diwali Day 5 scenes, part B: the welcome (03: tilak, aarti, the meal) and Yamraj's words (04).
   One clock: timing.ts (PLACEHOLDER until the takes are in). */

const cue = (k: string, dflt: number): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);

const BOKEH = Array.from({ length: 14 }, (_, i) => ({ x: rnd(`wb5x${i}`) * W, y: rnd(`wb5y${i}`) * H, r: 30 + 50 * rnd(`wb5r${i}`) }));

/** A warm, lamp-lit close-up bed with drifting bokeh. */
const WarmBed: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="#1E0E08" />
    <circle cx={540} cy={960} r={820} fill="url(#d2Flare)" opacity={0.6} />
    {BOKEH.map((b, i) => (
      <circle key={i} cx={b.x} cy={((b.y - f * 0.6) % H + H) % H} r={b.r} fill="#FFB65A" opacity={0.08 + 0.05 * Math.sin(f / 20 + i)} />
    ))}
  </g>
);

/* ------------------------------------------------------------------ */
/* 03: the welcome, in three close shots                                */
/* ------------------------------------------------------------------ */

/** Hard cuts between three warm close-ups: her thumb presses the tilak on 'तिलक'; the aarti circles from 'आरती';
    the meal on a leaf from 'अपने' ('अपने हाथ से खाना खिलाया'). Each shot has a slow push. */
export const WelcomeD5: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.welcome;
  const TI = cue("tilak03", 506);
  const AR = cue("aarti03", 536);
  const AP = cue("cap03b", 566);
  const c1 = AR - 4;
  const c2 = AP - 4;
  const shot = f < c1 ? 0 : f < c2 ? 1 : 2;
  const z = shot === 0 ? track(f, [[a, 1.0], [c1, 1.08, "lin"]]) : shot === 1 ? track(f, [[c1, 1.0], [c2, 1.06, "lin"]]) : track(f, [[c2, 1.0], [b, 1.08, "io"]]);
  return (
    <World>
      <D2Defs />
      <WarmBed f={f} />
      <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
        {shot === 0 ? (
          <g transform="translate(540 900)">
            <TilakClose f={f} k={ramp(f, a + 10, TI + 6, "io")} s={1.3} />
          </g>
        ) : shot === 1 ? (
          <g transform="translate(540 1000)">
            <AartiThali f={f} spin={(f - AR) * 6} s={1.5} />
          </g>
        ) : (
          <g transform="translate(540 1050)">
            <LeafPlate f={f} s={1.4} />
          </g>
        )}
      </g>
      <Vignette o={0.55} />
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* 04: Yamraj, moved, gives his boon                                    */
/* ------------------------------------------------------------------ */

/** Mouth openness from the take's loudness envelope (Day 1's talkD1 on Day 5's clock). */
export const talkD5 = (line: string, f: number): number => {
  const r = LINES[line];
  const v = VO[line];
  if (!r || !v) return 0;
  const i = Math.round(f) - r[0];
  if (i < 0 || i >= v.env.length) return 0;
  const g = (k: number) => v.env[Math.max(0, Math.min(v.env.length - 1, k))];
  return Math.min(1, ((g(i - 1) + 2 * g(i) + g(i + 1)) / 4) * 1.1);
};

const CU = 2.2;

/** A close-up framed like Day 2's YamaD2 (eyes near y 650), now warm and moved: a soft dawn-gold bed, his sister's
    red tilak on his forehead, a gentle smile, lips moving with his voice. The chest stays calm for the gold words at
    y 1360. A slow push. */
export const YamaD5: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.yama;
  const z = track(f, [[a, 1.0], [b, 1.06, "io"]]);
  const footY = 650 + 720 * CU;
  return (
    <World>
      <D2Defs />
      <g transform={`translate(540 800) scale(${z}) translate(-540 -800)`}>
        <DawnSky k={1} y={1500} />
        <rect width={W} height={H} fill="#2A1408" opacity={0.25} />
        <circle cx={540} cy={900} r={700} fill="url(#d2Flare)" opacity={0.35} style={{ mixBlendMode: "screen" }} />
        <g transform={`translate(540 ${footY}) scale(${CU})`}>
          <DeityStanding L={YAMRAJ} t={f} smile={0.6} speak={talkD5("04_yamraj", f)} closed={blinkAt("d5yc", f)} halo={1} />
        </g>
        <path d="M540 548V584" stroke="#C8102E" strokeWidth={10} strokeLinecap="round" opacity={0.9} />
        <Motes f={f} n={24} seed="d5ym" color="#FFE6A3" dir={-1} speed={0.5} size={3.5} o={0.5} />
      </g>
      <Vignette o={0.55} />
    </World>
  );
};
