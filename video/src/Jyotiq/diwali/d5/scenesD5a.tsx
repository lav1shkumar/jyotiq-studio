import React from "react";
import { World } from "../../manthan/kit";
import { blinkAt } from "../../manthan/rig";
import { ramp, track, W } from "../../manthan/style";
import { D2Defs } from "../d2/scenesD2a";
import { Doorstep } from "../d2/sets2";
import { Danda, DeityStanding, YAMRAJ } from "../shared/deities";
import { Tortoise } from "../shared/tortoise";
import { YamunaStanding } from "../shared/yamuna";
import { CUES, SCENES } from "./timing";

/* Diwali Day 5 scenes, part A: the hook (01: Yamraj at his sister's lit door) and Yamuna waiting (title + 02).
   One clock: timing.ts (PLACEHOLDER until the takes are in). The series defs are Day 2's (D2Defs). */

const cue = (k: string, dflt: number): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);

/* ------------------------------------------------------------------ */
/* 01 hook: Yamraj at a humble doorway, lit warm from inside            */
/* ------------------------------------------------------------------ */

/** Lit from frame 0: Day 2's doorstep at night (a gradient veil over the sky), the door glowing warm, and Yamraj in
    full colour at the threshold with his danda, calm, a little smile. He stands low (crown at about y 1230) so the
    hook plate (y 640-1060) stays clear. A slow push. */
export const HookD5: React.FC<{ f: number }> = ({ f }) => {
  const [, end] = SCENES.hook;
  const z = track(f, [[0, 1.0], [end, 1.08, "lin"]]);
  return (
    <World>
      <D2Defs />
      <g transform={`translate(540 1400) scale(${z}) translate(-540 -1400)`}>
        <defs>
          <linearGradient id="d5Veil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0B0B2A" stopOpacity={0.55} />
            <stop offset="0.7" stopColor="#0B0B2A" stopOpacity={0.3} />
            <stop offset="1" stopColor="#0B0B2A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Doorstep f={f} push={ramp(f, 0, end, "lin")} />
        <rect width={W} height={980} fill="url(#d5Veil)" />
        <circle cx={540} cy={1300} r={520} fill="url(#d2Flare)" opacity={0.42} style={{ mixBlendMode: "screen" }} />
        <g transform="translate(540 1700) scale(0.52)">
          <DeityStanding L={YAMRAJ} t={f} smile={0.5} closed={blinkAt("d5yh", f)} halo={0.8} handL={[-120, -190]} handR={[150, -120]} inHandR={<Danda />} />
        </g>
      </g>
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* Title + 02: Yamuna waits by the river through the seasons            */
/* ------------------------------------------------------------------ */

const SEASONS = ["#3E8E4E", "#E8B84A", "#8A94A8", "#E88AA8"]; // monsoon green, harvest gold, winter grey, spring rose

/** Dusk on the river: Yamuna on her tortoise looks down the road. From 'बरसों' the seasons pass over the sky (a tint
    cycling green, gold, grey and rose) until 'पर'; on 'व्यस्त' a tiny figure of Yamraj hurries along the far horizon,
    never turning toward her. A slow push. */
export const YamunaD5: React.FC<{ f: number }> = ({ f }) => {
  const [a] = SCENES.title;
  const [, b] = SCENES.yamuna;
  const BR = cue("barson02", 261);
  const PR = cue("cap02b", 367);
  const VY = cue("vyast02", 412);
  const z = track(f, [[a, 1.0], [b, 1.06, "io"]]);
  const u = 4 * ramp(f, BR, PR, "lin");
  const walk = ramp(f, VY - 12, b + 10, "lin");
  return (
    <World>
      <D2Defs />
      <g transform={`translate(540 1200) scale(${z}) translate(-540 -1200)`}>
        <defs>
          <linearGradient id="d5Dusk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1E1A44" />
            <stop offset="0.7" stopColor="#7A4A6A" />
            <stop offset="1" stopColor="#E8956A" />
          </linearGradient>
        </defs>
        <rect width={W} height={1200} fill="url(#d5Dusk)" />
        {SEASONS.map((c, i) => (
          <rect key={i} width={W} height={1200} fill={c} opacity={0.3 * Math.max(0, 1 - Math.abs(u - (i + 0.5)))} />
        ))}
        <path d="M0 1180C300 1160 700 1170 1080 1150V1240H0Z" fill="#2A2040" />
        <path d="M600 1180C700 1172 840 1166 1080 1150" stroke="#C9A25A" strokeWidth={6} opacity={0.5} fill="none" />
        <g transform={`translate(${620 + 380 * walk} 1168) scale(0.3)`} opacity={walk > 0 && walk < 1 ? 0.9 : 0}>
          <path d="M-6 -120L-20 0M6 -120L20 0" stroke="#120C1E" strokeWidth={16} strokeLinecap="round" />
          <path d="M-36 -110C-40 -170 -32 -230 -20 -250H20C32 -230 40 -170 36 -110Z" fill="#120C1E" />
          <circle cy={-272} r={22} fill="#120C1E" />
          <path d="M-16 -290L-10 -340H10L16 -290Z" fill="#120C1E" />
        </g>
        <rect x={0} y={1236} width={W} height={700} fill="#16203A" />
        {Array.from({ length: 10 }, (_, i) => (
          <path key={i} d={`M${(i * 131 + f * 0.6) % 1180 - 100} ${1300 + (i % 5) * 80}h90`} stroke="#C9D6F0" strokeWidth={3} opacity={0.25} />
        ))}
        <g transform="translate(450 1370) scale(0.77)">
          <Tortoise f={f} />
        </g>
        <YamunaStanding id="d5yam" f={f} x={430} y={1350} s={0.6} pose="garland" garland={false} halo={0.8} smile={0.4} lookX={0.7} />
      </g>
    </World>
  );
};
