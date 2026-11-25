import React from "react";
import { World } from "../kit";
import { Cosmos } from "../scenesA";
import { Vignette } from "../sets";
import { ramp } from "../style";
import { Mandar } from "./beings2";
import { KurmaGlow, VishnuStanding } from "./beings3";
import { ChurnSea, UnderMilk } from "./sets2";
import { CUES, SCENES } from "./timing";

/* Episode 2 cliffhanger (3129-3263) and end bed (3263-3679).
   3129-3196 "Par Vishnu... ab bhi muskura rahe the." - push in on his calm smile in the storm; at
             lightDive a blue-gold light leaves his chest and dives down
   3196-3263 under the milk: the light falls past the sinking mountain's foot, a vast shell lights up
             below it, one calm eye opens - freeze (tint + flash) at 3251
   3263-     cosmos bed under the voiced end card (EndCard2 is the HTML overlay in Episode2.tsx) */

export const CLIFF_CUT = CUES.lightDive + 18;

const Orb: React.FC<{ x: number; y: number; r: number; o: number }> = ({ x, y, r, o }) => (
  <g opacity={o}>
    <circle cx={x} cy={y} r={r * 2.4} fill="#6FB7FF" opacity={0.35} filter="url(#mBlur8)" />
    <circle cx={x} cy={y} r={r * 1.3} fill="#9FD0FF" opacity={0.75} />
    <circle cx={x} cy={y} r={r * 0.7} fill="#FFF3C4" />
  </g>
);

/** Trail behind a falling light: pointed at the top (y0), wide at the light (y1). */
const Streak: React.FC<{ x: number; y0: number; y1: number; w: number; o: number }> = ({ x, y0, y1, w, o }) => (
  <g opacity={o}>
    <path d={`M${x - w} ${y1}L${x} ${y0}L${x + w} ${y1}Z`} fill="#9FD0FF" opacity={0.55} filter="url(#mBlur8)" />
    <path d={`M${x - w * 0.35} ${y1}L${x} ${y0}L${x + w * 0.35} ${y1}Z`} fill="#FFF3C4" />
  </g>
);

export const CliffSmile: React.FC<{ f: number }> = ({ f }) => {
  const push = ramp(f, CUES.smilePush, CLIFF_CUT, "io");
  const z = 1 + 0.55 * push;
  const cy = 960 - 60 * push;
  const born = ramp(f, CUES.lightDive, CUES.lightDive + 6, "out");
  const dive = ramp(f, CUES.lightDive + 6, CLIFF_CUT, "in");
  // his chest (world 540,1120) on screen, where the light is born
  const chestY = cy + (1120 - 900) * z;
  const orbY = chestY + (2200 - chestY) * dive;
  return (
    <World>
      <g transform="translate(540 960) rotate(4) scale(1.12) translate(-540 -960)">
        <ChurnSea f={f} cam={{ x: 0, y: -700, z: 1.3 }} storm={0.8} glow={0.4} />
      </g>
      <g transform={`translate(540 ${cy}) scale(${z}) translate(-540 -900)`}>
        <circle cx={540} cy={900} r={360} fill="#FFD27A" opacity={0.18 + 0.2 * push} filter="url(#mBlur8)" />
        <g transform="translate(540 1960) scale(1.5)">
          <VishnuStanding t={f} smile={1} halo={1} closed={0.15 * push} />
        </g>
      </g>
      {born > 0 && dive < 1 ? (
        <>
          {dive > 0 ? <Streak x={540} y0={chestY} y1={orbY} w={46} o={0.9} /> : null}
          <Orb x={540} y={orbY} r={26 * born} o={born} />
        </>
      ) : null}
      <Vignette o={0.9} />
    </World>
  );
};

export const CliffDeep: React.FC<{ f: number }> = ({ f }) => {
  const fz = Math.min(f, CUES.freeze);
  const frozen = ramp(f, CUES.freeze, CUES.freeze + 3);
  const flash = f >= CUES.freeze && f < CUES.freeze + 3 ? 0.7 - (f - CUES.freeze) * 0.22 : 0;
  const fall = ramp(fz, CLIFF_CUT, CLIFF_CUT + 22, "in");
  const glow = ramp(fz, CLIFF_CUT + 18, CLIFF_CUT + 42);
  const eye = ramp(fz, CUES.freeze - 12, CUES.freeze - 2, "out");
  const sinkY = 120 + 260 * ramp(fz, CLIFF_CUT, CUES.freeze, "io");
  const cam = { x: 0, y: 0, z: 1 + 0.06 * ramp(fz, CLIFF_CUT, CUES.freeze) };
  const orbY = -100 + 1550 * fall;
  const hit = ramp(fz, CLIFF_CUT + 22, CLIFF_CUT + 40);
  // the shell is off-centre so Kurma's head and eye (at its right rim) sit inside the frame; push toward the eye
  const kz = ramp(fz, CUES.freeze - 24, CUES.freeze, "io");
  const zz = 1 + 0.35 * kz;
  const zx = 540 + 160 * kz;
  const zy = 960 + 340 * kz;
  return (
    <World>
      <UnderMilk f={fz} cam={cam} light={1} />
      <g transform={`translate(540 960) scale(${zz}) translate(${-zx} ${-zy})`}>
        {/* the sinking mountain's foot, coming down through the milk */}
        <g transform={`translate(560 ${sinkY}) rotate(12) scale(0.9 1)`} opacity={0.85}>
          <Mandar t={fz} crack={1} glow={0.3} />
        </g>
        <rect x={-600} y={-600} width={2280} height={3120} fill="#1E3A78" opacity={0.12} />
        <g transform="translate(300 1540) scale(0.95)">
          <KurmaGlow id="cd" t={fz} glow={glow} eye={eye} />
        </g>
        {fall < 1 ? (
          <>
            <Streak x={480} y0={Math.max(-200, orbY - 700)} y1={orbY} w={40} o={0.9} />
            <Orb x={480} y={orbY} r={24} o={1} />
          </>
        ) : null}
        {hit > 0 && hit < 1 ? <circle cx={480} cy={1450} r={60 + 520 * hit} fill="none" stroke="#BFE3FF" strokeWidth={14 * (1 - hit)} opacity={1 - hit} /> : null}
      </g>
      <rect width={1080} height={1920} fill="#24163F" opacity={0.35 * frozen} />
      {flash > 0 ? <rect width={1080} height={1920} fill="#FFFFFF" opacity={flash} /> : null}
      <Vignette o={0.95} />
    </World>
  );
};

export const EndBed2: React.FC<{ f: number }> = ({ f }) => (
  <World>
    <Cosmos f={f} z={1.04 + 0.03 * ramp(f, SCENES.end[0], SCENES.end[1])} />
    <rect width={1080} height={1920} fill="#0C0A07" opacity={0.3} />
    <Vignette o={1} />
  </World>
);
