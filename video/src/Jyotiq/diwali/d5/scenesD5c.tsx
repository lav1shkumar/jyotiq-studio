import React from "react";
import { JAKARTA, ROZHA } from "../../manthan/graphics";
import { World } from "../../manthan/kit";
import { Motes, Vignette } from "../../manthan/sets";
import { ramp, rnd, track, W } from "../../manthan/style";
import { AppBedD1, StarNight } from "../d1/scenesD1c";
import { D2Defs } from "../d2/scenesD2a";
import { DiyaWave } from "../shared/fx";
import { IndiaMap, MAP_PINS } from "./sets5";
import { CUES, SCENES } from "./timing";

/* Diwali Day 5 scenes, part C: the name (05 and the glow beat), the map (06), the languages (07), and the app and end
   beds. One clock: timing.ts (PLACEHOLDER until the takes are in). */

const cue = (k: string, dflt: number): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);

/* ------------------------------------------------------------------ */
/* 05: the day's name; diya 5 lights (RowLayer, centre 1000)            */
/* ------------------------------------------------------------------ */

/** A calm warm night under the 'यम द्वितीया → भाई दूज' words (HTML, at the composition level) while diya 5 lights in
    the centre on 'दूज'. A slow push. */
export const NameD5: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.name;
  const z = track(f, [[a, 1.0], [b, 1.06, "io"]]);
  return (
    <World>
      <D2Defs />
      <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
        <StarNight f={f} warm={0.5} />
        <circle cx={540} cy={1000} r={620} fill="url(#d2Flare)" opacity={0.3} />
        <Motes f={f} n={26} seed="d5nm" color="#FFE6A3" dir={-1} speed={0.4} size={3} o={0.45} />
      </g>
      <Vignette o={0.55} />
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* 06: one festival, its names across the map                           */
/* ------------------------------------------------------------------ */

// Each name in its own script, with the region in small Latin text. Labels sit beside their pins, inside the frame.
const NAMES: { pin: keyof typeof MAP_PINS; cue: string; text: string; region: string; dx: number; dy: number; anchor: "start" | "end" | "middle" }[] = [
  { pin: "north", cue: "bhasha06", text: "भाई दूज", region: "North India", dx: -30, dy: -30, anchor: "end" },
  { pin: "maharashtra", cue: "bhaubeej06", text: "भाऊबीज", region: "Maharashtra", dx: 30, dy: 16, anchor: "start" },
  { pin: "gujarat", cue: "bhai06a", text: "ભાઈ બીજ", region: "Gujarat", dx: -10, dy: -60, anchor: "middle" },
  { pin: "bengal", cue: "bhai06b", text: "ভাইফোঁটা", region: "Bengal", dx: 30, dy: 16, anchor: "start" },
  { pin: "nepal", cue: "bhai06c", text: "भाइटीका", region: "Nepal", dx: 30, dy: -46, anchor: "start" },
];
const SCRIPT_FONTS = `${ROZHA}, 'Gujarati Sangam MN', 'Bangla Sangam MN', 'Noto Sans Gujarati', 'Noto Sans Bengali', sans-serif`;

/** The map of India draws in; then each regional name of the day pops beside its region as Kaal says it: भाई दूज
    (north) on 'भाषा', भाऊबीज, ભાઈ બીજ, ভাইফোঁটা and भाइटीका on their own words. The diya row sits at the top. */
export const MapD5: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.map;
  const z = track(f, [[a, 1.0], [b, 1.05, "io"]]);
  const k = ramp(f, a, a + 30, "out");
  return (
    <World>
      <D2Defs />
      <rect width={W} height={1920} fill="#0B0B24" />
      <g transform={`translate(540 980) scale(${z}) translate(-540 -980)`}>
        <circle cx={560} cy={980} r={640} fill="url(#d2Flare)" opacity={0.16} />
        <IndiaMap f={f} k={k} />
        {NAMES.map((n, i) => {
          const at = cue(n.cue, a + 40 + 30 * i);
          const o = ramp(f, at - 2, at + 6, "out");
          if (o <= 0) return null;
          const pop = track(f - at + 2, [[0, 0.6], [6, 1.12, "out"], [10, 1, "io"]]);
          const [px, py] = MAP_PINS[n.pin];
          const x = px + n.dx;
          const y = py + n.dy;
          return (
            <g key={i} opacity={o} transform={`translate(${x} ${y}) scale(${pop}) translate(${-x} ${-y})`}>
              <circle cx={px} cy={py} r={30 * o} fill="none" stroke="#FFD36B" strokeWidth={3} opacity={0.7 * (1 - ramp(f, at, at + 20, "out"))} />
              <text x={x} y={y} textAnchor={n.anchor} fontFamily={SCRIPT_FONTS} fontSize={56} fill="#FFD36B" style={{ filter: "drop-shadow(0 0 10px rgba(255,201,77,0.55))" }}>
                {n.text}
              </text>
              <text x={x} y={y + 34} textAnchor={n.anchor} fontFamily={JAKARTA} fontWeight={700} fontSize={26} fill="#F3DB9D" opacity={0.85}>
                {n.region}
              </text>
            </g>
          );
        })}
        <Motes f={f} n={20} seed="d5mp" color="#FFE6A3" dir={-1} speed={0.3} size={3} o={0.35} />
      </g>
      <Vignette o={0.55} />
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* 07: one festival, many languages                                     */
/* ------------------------------------------------------------------ */

const ARC: [number, number][] = [[220, 1240], [380, 1300], [540, 1320], [700, 1300], [860, 1240]];

/** A warm night with five lamps in a gentle arc, one per language, swaying a little: a calm bed under the words
    'त्योहार एक, भाषाएँ अनेक' and the language chips (HTML). A slow push. */
export const LangsD5: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.langs;
  const z = track(f, [[a, 1.0], [b, 1.05, "io"]]);
  return (
    <World>
      <D2Defs />
      <g transform={`translate(540 1000) scale(${z}) translate(-540 -1000)`}>
        <StarNight f={f} warm={0.45} />
        <circle cx={540} cy={1200} r={600} fill="url(#d2Flare)" opacity={0.3} />
        <g transform={`translate(0 ${Math.sin(f / 20) * 6})`}>
          <DiyaWave f={f} at={a - 200} points={ARC} step={0} scale={0.5} seed="d5arc" />
        </g>
        <Motes f={f} n={22} seed="d5lg" color="#FFE6A3" dir={-1} speed={0.4} size={3} o={0.4} />
      </g>
      <Vignette o={0.55} />
    </World>
  );
};

/** Day 1's warm night with drifting bokeh: the same series look under the phone. */
export const AppBedD5 = AppBedD1;

/* ------------------------------------------------------------------ */
/* The finale's end card bed: all five diyas lit                        */
/* ------------------------------------------------------------------ */

const BURSTS: { x: number; y: number; dt: number }[] = [{ x: 180, y: 560, dt: 0 }, { x: 900, y: 520, dt: 10 }, { x: 540, y: 160, dt: 20 }];
const RAYS = Array.from({ length: 18 }, (_, i) => ({ a: (i / 18) * Math.PI * 2, r: 90 + 40 * rnd(`eb5r${i}`) }));

/** A starry night; from just after the sign-off starts, soft golden sparkles open at the sides and the top (behind
    the HTML text), gentle rather than explosive. The diya row (composition level) lifts all five diyas here. */
export const EndBedD5: React.FC<{ f: number }> = ({ f }) => {
  const SO = cue("signoff", 1606);
  return (
    <World>
      <D2Defs />
      <StarNight f={f} warm={0.4} />
      {BURSTS.map((bu, j) => {
        const e = ramp(f, SO + 10 + bu.dt, SO + 40 + bu.dt, "out");
        if (e <= 0 || e >= 1) return null;
        return (
          <g key={j} opacity={1 - e}>
            {RAYS.map((ry, i) => (
              <circle key={i} cx={bu.x + Math.cos(ry.a) * ry.r * e} cy={bu.y + Math.sin(ry.a) * ry.r * e} r={4} fill="#FFD36B" />
            ))}
            <circle cx={bu.x} cy={bu.y} r={30 * e} fill="#FFE6A3" opacity={0.3} />
          </g>
        );
      })}
    </World>
  );
};
