import React from "react";
import { ROZHA } from "../graphics";
import { World } from "../kit";
import { Cosmos } from "../scenesA";
import { Motes, Vignette } from "../sets";
import { ramp, track } from "../style";
import { Rewind } from "../ep6/scenes6a";
import { GrahaOrb, KetuBody7, KetuForm, Rahu8 } from "./cast8";
import { BEATS, CUES, SCENES } from "./timing";

/*
 * Scene 1 (hook) and the title bed.
 * Hook: lit from frame 0 (never black). In the Cosmos sky the headless body floats in the lower third, the
 * gold amrit glow burning at its neck cut (the one lit element); Rahu's severed head drifts high above,
 * small, its own throat glowing. The hook plate (HTML) fills the middle third between them. On 'गले' the
 * neck glow swells, on 'धड़' the camera eases toward the body, on 'कैसे बचा?' the world freezes and
 * desaturates, then the Kaal time-rewind (Episode 6's Rewind, read-only) carries us to the title bed.
 * Title bed: Episode 7's line-07 frame: the warm रा orb top-left, Ketu's silver comet orb के lower-right,
 * the dashed axis joining them.
 */

const NECK_GLOW: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => (
  <g>
    <ellipse cx={x} cy={y} rx={110} ry={34} fill="#FFD27A" opacity={0.18 + 0.14 * k} filter="url(#mBlur8)" />
    <ellipse cx={x} cy={y} rx={80} ry={26} fill="#FFE6A3" opacity={0.45 + 0.35 * k} filter="url(#mBlur8)" />
  </g>
);

export const Hook8: React.FC<{ f: number }> = ({ f }) => {
  const [, b] = SCENES.hook;
  const freeze = ramp(f, CUES.kaise, CUES.kaise + 6, "out");
  const ff = f < CUES.kaise ? f : CUES.kaise;
  const z = track(f, [[0, 1.0], [CUES.dhad01, 1.03, "io"], [CUES.kaise, 1.08, "io"]]);
  const swell = Math.max(0, 1 - Math.abs(f - CUES.gale01 - 4) / 14);
  const rw = ramp(f, b - 16, b, "in");
  const body = { x: 540, y: 1520, s: 1.3 };
  const neckY = body.y - 218 * body.s;
  return (
    <div style={{ position: "absolute", inset: 0, filter: `saturate(${1 - 0.55 * freeze}) brightness(${1 - 0.12 * freeze})` }}>
      <World>
        <g transform={`translate(540 ${neckY}) scale(${z}) translate(-540 ${-neckY})`}>
          <Cosmos f={ff} z={1.04} />
          <ellipse cx={540} cy={1100} rx={480} ry={560} fill="#3A2160" opacity={0.4} filter="url(#mBlur8)" />
          <NECK_GLOW x={body.x} y={neckY} k={0.6 + 0.4 * swell} />
          <KetuBody7 id="h8body" f={ff} x={body.x} y={body.y} s={body.s} facing={1} />
          <Rahu8 id="h8rahu" at={{ x: 560 + Math.sin(ff / 30) * 14, y: 400 - ff * 0.25 }} s={1.25} f={ff} throat={1} rage={0.5} lookX={-0.3} />
          <Motes f={ff} n={30} seed="h8m" color="#FFE6A3" dir={-1} speed={0.5} size={3} o={0.6} />
        </g>
        <Rewind f={f} k={rw} />
        <Vignette o={0.78} />
      </World>
    </div>
  );
};

const Glyph8: React.FC<{ t: string; size: number; color: string }> = ({ t, size, color }) => (
  <text x={0} y={size * 0.36} textAnchor="middle" fontSize={size} fill={color} fontFamily={ROZHA}>
    {t}
  </text>
);

/** Episode 7's line-07 frame: रा top-left, के comet lower-right, joined by a dashed axis. */
export const PairSky8: React.FC<{ f: number; z?: number; k?: number }> = ({ f, z = 1, k = 1 }) => {
  const ra = { x: 300, y: 560 };
  const ke = { x: 780, y: 1360 };
  return (
    <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
      <Cosmos f={f} z={1.04} />
      <line x1={ra.x} y1={ra.y} x2={ke.x} y2={ke.y} stroke="#F3DB9D" strokeWidth={4} strokeDasharray="18 16" opacity={0.5 * k} />
      <GrahaOrb x={ra.x} y={ra.y} r={110} f={f} rim="#FFB23D" k={k}>
        <Glyph8 t="रा" size={110} color="#FFE6A3" />
      </GrahaOrb>
      <KetuForm x={ke.x} y={ke.y} r={110} f={f} k={k} tail={1} tailDeg={-35}>
        <Glyph8 t="के" size={110} color="#EAF1FF" />
      </KetuForm>
    </g>
  );
};

export const TitleBed8: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.title;
  const z = track(f, [[a, 1.07], [b + 6, 1.1, "io"]]);
  const rw = 1 - ramp(f, BEATS.rewind[0], BEATS.rewind[0] + 12, "out");
  return (
    <World>
      <PairSky8 f={f} z={z} />
      <Motes f={f} n={34} seed="tb8m" color="#CFDBF5" dir={-1} speed={0.5} size={3} o={0.6} />
      <Rewind f={f} k={rw} />
      <Vignette o={0.7} />
    </World>
  );
};
