import React from "react";
import { World } from "../../manthan/kit";
import { JAKARTA, ROZHA } from "../../manthan/graphics";
import { ramp, rnd, track } from "../../manthan/style";
import { DiyaWave } from "../shared/fx";
import { TulaMoonD2 } from "../d2/gfxD2";
import { D2Defs } from "../d2/scenesD2a";
import { CityNight } from "./sets3";
import { CUES, SCENES } from "./timing";

/* Diwali Day 3 scenes, part A: the hook (01: the city of lamps, then the tilt up into the moonless sky) and the sky
   (title + 02: Tula holding the new moon and the Sun at its weakest, a callback to Day 2's end card).
   One clock: timing.ts (PLACEHOLDER until the takes are in). The series defs are Day 2's (D2Defs). */

const cue = (k: string, dflt: number): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);

/* ------------------------------------------------------------------ */
/* 01 hook: the city of lamps, then up into the empty sky               */
/* ------------------------------------------------------------------ */

/** The hook is one contrast. Frame 0: an empty moon reading 0% over a blazing city, fireworks already in the air. On
    'बड़ा' the sky erupts and the picture flares. On 'क्यों' the fireworks stop and the camera tilts up into the empty
    sky, which is where the title and line 02 begin. */
const T0 = 0.3; // the opening tilt, so the sky holds the moon and the city still fills the frame under the plate

type Burst = { at: number; x: number; y: number; r: number; c: string };

const Firework: React.FC<{ f: number; b: Burst; id: number }> = ({ f, b, id }) => {
  const t = f - b.at;
  if (t < 0 || t > 40) return null;
  const grow = 1 - Math.pow(1 - Math.min(1, t / 24), 3);
  const fade = 1 - ramp(t, 14, 40, "in");
  return (
    <g opacity={fade}>
      {t < 5 ? <circle cx={b.x} cy={b.y} r={26} fill="#FFF6E4" opacity={1 - t / 5} /> : null}
      {Array.from({ length: 34 }, (_, i) => {
        const a = (i / 34) * Math.PI * 2 + rnd(`fw${id}a${i}`) * 0.2;
        const rr = b.r * (0.68 + 0.32 * rnd(`fw${id}r${i}`)) * grow;
        const drop = 0.05 * t * t;
        const x = b.x + Math.cos(a) * rr;
        const y = b.y + Math.sin(a) * rr + drop;
        const tail = 0.8;
        return (
          <g key={i}>
            <path d={`M${x} ${y}L${b.x + Math.cos(a) * rr * tail} ${b.y + Math.sin(a) * rr * tail + drop}`} stroke={b.c} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
            <circle cx={x} cy={y} r={4.5} fill="#FFF6E4" />
          </g>
        );
      })}
    </g>
  );
};

const PARAPET: [number, number][] = [[95, 1590], [270, 1566], [450, 1584], [630, 1566], [810, 1584], [985, 1566]];

export const HookD3: React.FC<{ f: number }> = ({ f }) => {
  const [, end] = SCENES.hook;
  const B = cue("bada01", 114);
  const K = cue("kyon01", 170);
  const up = ramp(f, K - 6, K + 22, "io");
  const tilt = T0 + (1 - T0) * up;
  const flare = ramp(f, B - 2, B + 3, "out") * (1 - ramp(f, B + 3, B + 26, "io"));
  const z = track(f, [[0, 1.0], [B, 1.03, "lin"], [B + 8, 1.07, "out"], [end, 1.09, "lin"]]);
  const shift = (tilt - T0) * 1100;
  const moonPulse = 0.72 + 0.28 * Math.sin(f / 9);
  const bursts: Burst[] = [
    { at: -16, x: 170, y: 380, r: 170, c: "#FFC94D" },
    { at: -6, x: 900, y: 300, r: 150, c: "#FF6B6B" },
    { at: 20, x: 240, y: 240, r: 130, c: "#7FE3FF" },
    { at: 52, x: 860, y: 430, r: 150, c: "#FFC94D" },
    { at: 84, x: 180, y: 430, r: 140, c: "#FF9CE0" },
    { at: B - 1, x: 170, y: 300, r: 250, c: "#FFC94D" },
    { at: B - 1, x: 910, y: 280, r: 250, c: "#FF6B6B" },
    { at: B + 5, x: 540, y: 520, r: 220, c: "#7FE3FF" },
    { at: B + 18, x: 250, y: 470, r: 190, c: "#FF9CE0" },
    { at: B + 28, x: 840, y: 440, r: 200, c: "#FFD36B" },
    { at: B + 42, x: 170, y: 250, r: 170, c: "#7FE3FF" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, filter: `brightness(${1.45 + 0.4 * flare - 0.4 * up}) saturate(1.2)` }}>
      <World>
        <D2Defs />
        <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
          <CityNight f={f} tilt={tilt} />
          <g transform={`translate(0 ${shift})`} opacity={1 - ramp(f, K - 6, K + 6, "io")}>
            {bursts.map((b, i) => (
              <Firework key={i} f={f} b={b} id={i} />
            ))}
          </g>
          <g transform={`translate(540 ${300 + shift * 0.12})`}>
            <circle r={150} fill="#C9D6F0" opacity={0.07 * moonPulse} />
            <circle r={104} fill="#05060F" stroke="#C9D6F0" strokeWidth={5} strokeDasharray="14 12" opacity={0.95} />
            <text y={4} textAnchor="middle" fontFamily={JAKARTA} fontWeight={800} fontSize={66} fill="#E4ECFA">0%</text>
            <text y={54} textAnchor="middle" fontFamily={ROZHA} fontSize={38} fill="#C9D6F0">चाँद</text>
          </g>
          <g transform={`translate(0 ${up * 500})`}>
            <path d="M-40 1600C300 1570 780 1570 1120 1600L1120 2000L-40 2000Z" fill="#170C0A" stroke="#DFB15B" strokeWidth={4} />
            <DiyaWave f={f} at={-400} points={PARAPET} step={0} scale={0.8} seed="d3hk" />
          </g>
        </g>
      </World>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Title + 02: the sky, Tula with the new moon and the weakest Sun      */
/* ------------------------------------------------------------------ */

/** A ring that marks what is being named: it settles on the object and one wave runs out from it. */
const Pulse: React.FC<{ f: number; at: number; x: number; y: number; c: string }> = ({ f, at, x, y, c }) => {
  const p = ramp(f, at - 2, at + 22, "out");
  if (p <= 0) return null;
  const hold = ramp(f, at - 2, at + 6, "out") * (1 - ramp(f, at + 40, at + 60, "io"));
  return (
    <g>
      <circle cx={x} cy={y} r={70} fill="none" stroke={c} strokeWidth={4} opacity={0.6 * hold} />
      {p < 1 ? <circle cx={x} cy={y} r={70 + 70 * p} fill="none" stroke={c} strokeWidth={3} opacity={1 - p} /> : null}
    </g>
  );
};

// TulaMoonD2 at (540, 880) s 1.45: the pans' discs sit at about x 540 -/+ 246, y 1002.
const TULA = { x: 540, y: 880, s: 1.45 };
const PAN_Y = TULA.y + 84 * TULA.s;
const SUN_X = TULA.x - 170 * TULA.s;
const MOON_X = TULA.x + 170 * TULA.s;

/** The dark sky under the title; the Tula art rises in after the title has cleared ('अमावस्या का चंद्रमा'). A ring
    marks the new moon, then the Sun on 'सूर्य', and the Sun dims on 'कमज़ोर' (Tula is its sign of debilitation). */
export const SkyD3: React.FC<{ f: number }> = ({ f }) => {
  const [a] = SCENES.title;
  const [, b] = SCENES.sky;
  const AM = cue("amavasya02", 203);
  const SU = cue("surya02", 294);
  const KZ = cue("kamzor02", 384);
  const z = track(f, [[a, 1.0], [b, 1.06, "io"]]);
  const art = ramp(f, AM + 20, AM + 38, "out");
  const sunDim = ramp(f, KZ - 4, KZ + 16, "io");
  return (
    <World>
      <D2Defs />
      <g transform={`translate(540 900) scale(${z}) translate(-540 -900)`}>
        <CityNight f={f} tilt={1} />
        <g opacity={art} transform={`translate(0 ${(1 - art) * 30})`}>
          <TulaMoonD2 f={f} x={TULA.x} y={TULA.y} s={TULA.s} sunDim={sunDim} />
        </g>
        <Pulse f={f} at={AM + 24} x={MOON_X} y={PAN_Y} c="#C9D6F0" />
        <Pulse f={f} at={SU} x={SUN_X} y={PAN_Y} c="#FFC94D" />
      </g>
    </World>
  );
};
