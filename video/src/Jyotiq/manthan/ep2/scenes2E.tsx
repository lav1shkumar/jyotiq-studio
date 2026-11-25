import React from "react";
import { World } from "../kit";
import { handToWorld, idle, pose, Puppet } from "../rig";
import { Motes, Vignette } from "../sets";
import { ramp } from "../style";
import { headAngle, SerpentBody, spline, V2, VasukiHead } from "./beings2";
import { VishnuStanding } from "./beings3";
import { ChurnSea } from "./sets2";
import { mouth } from "./talk2";
import { CUES } from "./timing";

/* Episode 2 (2526-2711).
   2526-2630 Vishnu, close: "Jaisi tumhari ichchha." - the smile grows; on letGo his hands open and the
             serpent's neck slides out of them.
   2630-2711 Swarbhanu now grips the neck under the head: "Woh... muskuraya kyun?" - his eyes narrow;
             the camera drifts up his arm to Vasuki's face, whose eye opens beside his hand and breathes
             hot smoke (the Episode 3 hint). */

export const VishnuSmile: React.FC<{ f: number }> = ({ f }) => {
  const s0 = CUES.smile;
  const z = 1 + 0.08 * ramp(f, s0, 2630, "io");
  const sm = 0.45 + 0.55 * ramp(f, s0, s0 + 50, "io");
  const rel = ramp(f, CUES.letGo - 4, CUES.letGo + 10, "io");
  const grip = 1 - rel;
  const hL: [number, number] = [-140 + 69 * grip, -96 + 44 * grip];
  const hR: [number, number] = [140 - 81 * grip, -96 + 138 * grip];
  const S = 1.7;
  const O = { x: 540, y: 2000 };
  const w = (q: [number, number]): V2 => ({ x: O.x + S * q[0], y: O.y + S * (q[1] - 360) });
  // grip points (where the hands close) and a neck that slides away down-left when he lets go
  const gR = w([59, 42]);
  const gL = w([-71, -52]);
  const dx = -60 * rel;
  const dy = 140 * rel;
  const neck = spline(
    [
      { x: 1600 + dx, y: 2500 + dy },
      { x: 1200 + dx, y: 2000 + dy },
      { x: 860 + dx, y: 1640 + dy },
      { x: gR.x + dx, y: gR.y + dy },
      { x: gL.x + dx, y: gL.y + dy },
      { x: 170 + dx, y: 1110 + dy },
      { x: -200 + dx, y: 860 + dy },
    ],
    90,
  );
  return (
    <World>
      <ChurnSea f={f} cam={{ x: 0, y: -900, z: 1.3 }} storm={0.1} glow={0.6} />
      <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
        <circle cx={540} cy={800} r={340} fill="#FFD27A" opacity={0.16 + 0.12 * sm} filter="url(#mBlur8)" />
        <SerpentBody s={neck} R={80} />
        <g transform={`translate(${O.x} ${O.y}) scale(${S})`}>
          <VishnuStanding t={f} smile={sm} halo={1} handL={hL} handR={hR} speak={mouth("vishnu", f)} />
        </g>
        {grip > 0.02 ? (
          <g opacity={grip}>
            <SerpentBody s={neck} i0={46} i1={58} R={80} />
          </g>
        ) : null}
      </g>
      <Vignette o={0.9} />
    </World>
  );
};

/* ------------------------------------------------------------------ */

/** Same staging as the cold-open grab: Swarbhanu at left, his fist on the neck, Vasuki's head above it. */
export const GripEyes: React.FC<{ f: number }> = ({ f }) => {
  const e0 = CUES.eyesNarrow;
  const o0 = CUES.eyeOpen;
  const narrow = ramp(f, e0 + 2, e0 + 14, "io");
  const open = ramp(f, o0, o0 + 12, "out");
  const smoke = ramp(f, o0 + 4, o0 + 26);
  const pan = ramp(f, o0 - 12, o0 + 6, "io");
  const at = { x: 262, y: 1330, s: 1.5, facing: 1 };
  const p = pose({
    ...idle("ge", f, 0.4),
    blink: 0.42 * narrow,
    lean: 4,
    head: -2,
    sF: 82,
    eF: 14,
    wF: -14,
    sB: 24,
    eB: 58,
    fist: 1,
    browTilt: 10 + 12 * narrow,
    glow: 0.35,
    lookX: 0.5,
    lookY: -0.15,
    smile: -0.25,
    talk: mouth("swarbhanu", f),
  });
  const h = handToWorld(p, at, true);
  const hand: V2 = { x: h[0], y: h[1] };
  const headAt: V2 = { x: hand.x + 26, y: hand.y - 165 };
  const neck = spline(
    [{ x: 1500, y: 2900 }, { x: 1330, y: 2500 }, { x: 1180, y: 2140 }, { x: 1020, y: 1780 }, { x: hand.x + 90, y: hand.y + 250 }, hand, headAt],
    90,
  );
  // camera: his face, then up his arm to the serpent's eye
  const cx = 330 + (630 - 330) * pan;
  const cy = 900 + (650 - 900) * pan;
  const z = 1.75 - 0.25 * pan + 0.06 * ramp(f, o0, 2711);
  return (
    <World>
      <g transform={`translate(540 960) scale(${z}) translate(${-cx} ${-cy})`}>
        <ChurnSea f={f} cam={{ x: 0, y: -1300, z: 1.35 }} storm={0.7} glow={0.75} />
        <SerpentBody s={neck} R={58} />
        <VasukiHead at={headAt} ang={headAngle(neck)} s={2.25} t={f} eye={0.04 + 0.96 * open} smoke={smoke} hood={0.85} />
        {smoke > 0.05 ? (
          <g opacity={smoke}>
            <Motes f={f} n={18} seed="ge-ember" color="#FF9A4A" o={0.8} />
          </g>
        ) : null}
        <Puppet id="ge-sw" who="swarbhanu" at={at} p={p} t={f} />
      </g>
      <Vignette o={0.95} />
    </World>
  );
};
