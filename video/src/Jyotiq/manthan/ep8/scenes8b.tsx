import React from "react";
import { World } from "../kit";
import { Cosmos } from "../scenesA";
import { Motes, Vignette } from "../sets";
import { ramp, track } from "../style";
import { KetuBody7, Rahu8, SplitDrop8, SudarshanChakra } from "./cast8";
import { prog8 } from "./kit8";
import { CUES, SCENES } from "./timing";

/*
 * Scenes 2-5.
 *  replay: slow-motion replay of Episode 7's chakra. Svarbhanu's head (Rahu8) still on the body (KetuBody7),
 *          the Sudarshan chakra streaks in from the left at neck height; as it passes the head lifts off;
 *          on 'जहां' (CUES.freeze) everything freezes and desaturates on the gold glow at the throat.
 *  split:  close on the neck cut. The amrit drop pinches and splits (SplitDrop8): one half rises with the
 *          head out of the top of frame, the other sinks into the body.
 *  wander: the body drifts slowly through layers of dark smoke, calm, not frantic.
 *  rahu:   Rahu's head large in the sky, lip-synced to 05_rahu, glancing at the sun on 'सूर्य' and the
 *          moon on 'चंद्र'.
 * Joined pose: body s 1.3 at y 1500 puts the neck cut at y = 1500 - 218 * 1.3 = 1216.6; Rahu8's throat
 * sits 56 * s below its centre, so the head centre goes at 1216.6 - 56 * 1.3.
 */

const BODY = { x: 540, y: 1500, s: 1.3 };
const NECK_Y = BODY.y - 218 * BODY.s;
const HEAD = { x: BODY.x + 6 * BODY.s, y: NECK_Y - 56 * BODY.s };

const Smoke8: React.FC<{ f: number; n: number; seed: number; y0: number; y1: number; o: number }> = ({ f, n, seed, y0, y1, o }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const r = ((i * 7919 + seed * 104729) % 1000) / 1000;
      const x = ((r * 1400 + f * (0.6 + r)) % 1500) - 210;
      const y = y0 + (y1 - y0) * ((i * 0.618 + r) % 1);
      return <ellipse key={i} cx={x} cy={y + Math.sin(f / 30 + i) * 20} rx={220 + 160 * r} ry={90 + 60 * r} fill="#1A1230" opacity={o * (0.4 + 0.5 * r)} filter="url(#mBlur8)" />;
    })}
  </g>
);

export const ReplayScene8: React.FC<{ f: number }> = ({ f }) => {
  const [a] = SCENES.replay;
  const fr = CUES.freeze;
  const ff = Math.min(f, fr);
  const pass = prog8(ff, a + 2, fr - 4);
  const cx = -220 + 1520 * pass; // slow-mo streak, left to right
  const cut = ramp(cx, HEAD.x - 60, HEAD.x + 80, "out"); // the head lifts as the chakra passes the neck
  const freeze = ramp(f, fr, fr + 5, "out");
  const z = track(f, [[a, 1.0], [fr, 1.08, "io"], [SCENES.replay[1] + 6, 1.2, "io"]]);
  return (
    <div style={{ position: "absolute", inset: 0, filter: `saturate(${1 - 0.6 * freeze}) brightness(${1 - 0.1 * freeze})` }}>
      <World>
        <g transform={`translate(540 ${NECK_Y}) scale(${z}) translate(-540 ${-NECK_Y})`}>
          <Cosmos f={ff} z={1.04} />
          <ellipse cx={548} cy={NECK_Y} rx={170} ry={60} fill="#FFB23D" opacity={0.14 + 0.24 * freeze} filter="url(#mBlur8)" />
          <KetuBody7 id="rp8body" f={ff} x={BODY.x} y={BODY.y} s={BODY.s} facing={1} />
          <Rahu8 id="rp8head" at={{ x: HEAD.x, y: HEAD.y - 40 * cut }} s={BODY.s} f={ff} throat={0.4 + 0.6 * cut} rage={0.6} lookX={0.2} />
          {pass > 0 && pass < 1 ? (
            <g>
              <path d={`M${cx - 520} ${NECK_Y}L${cx} ${NECK_Y}`} stroke="#FFE6A3" strokeWidth={16} strokeLinecap="round" opacity={0.35} filter="url(#mBlur8)" />
              <SudarshanChakra x={cx} y={NECK_Y} s={1.1} spin={ff * 9} glow={1} />
            </g>
          ) : null}
          <Motes f={ff} n={24} seed="rp8m" color="#FFE6A3" dir={-1} speed={0.4} size={3} o={0.5} />
        </g>
        {freeze > 0 ? <rect x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={0.25 * (1 - freeze)} /> : null}
        <Vignette o={0.8} />
      </World>
    </div>
  );
};

export const SplitScene8: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.split;
  const p = prog8(f, CUES.splitHit - 6, CUES.splitHit + 22);
  const ease = 1 - (1 - prog8(f, CUES.splitHit + 2, CUES.splitHit + 30)) ** 3;
  const z = track(f, [[a, 1.45], [CUES.splitHit, 1.6, "io"], [b, 1.35, "io"]]);
  return (
    <World>
      <g transform={`translate(540 960) scale(${z}) translate(-540 ${-NECK_Y})`}>
        <Cosmos f={f} z={1.04} />
        <g transform={`translate(0 ${120 * ease})`}>
          <KetuBody7 id="sp8body" f={f} x={BODY.x} y={BODY.y} s={BODY.s} facing={1} />
        </g>
        <Rahu8 id="sp8head" at={{ x: HEAD.x, y: HEAD.y - 170 - 420 * ease }} s={BODY.s} f={f} throat={1} rage={0.6} lookX={0} />
        <SplitDrop8 x={BODY.x + 6 * BODY.s} y={NECK_Y - 30} s={1.2} f={f} p={p} rise={480} sink={140} />
        <Motes f={f} n={26} seed="sp8m" color="#FFE6A3" dir={-1} speed={0.6} size={3} o={0.6} />
      </g>
      <Vignette o={0.75} />
    </World>
  );
};

export const WanderScene8: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.wander;
  const u = prog8(f, a, b);
  const x = 420 + 240 * u;
  const z = track(f, [[a, 1.06], [b, 1.0, "io"]]);
  return (
    <World>
      <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
        <Cosmos f={f} z={1.04} />
        <rect x={0} y={0} width={1080} height={1920} fill="#0C0818" opacity={0.45} />
        <Smoke8 f={f} n={7} seed={3} y0={700} y1={1800} o={0.8} />
        <g transform={`translate(0 ${Math.sin(f / 26) * 18})`}>
          <KetuBody7 id="wd8body" f={f} x={x} y={1500} s={1.35} facing={1} />
        </g>
        <Smoke8 f={f + 400} n={5} seed={9} y0={1300} y1={1900} o={0.9} />
        <Motes f={f} n={18} seed="wd8m" color="#CFDBF5" dir={-1} speed={0.3} size={3} o={0.4} />
      </g>
      <Vignette o={0.85} />
    </World>
  );
};

const Disc8: React.FC<{ x: number; y: number; r: number; kind: "sun" | "moon"; hot: number }> = ({ x, y, r, kind, hot }) => (
  <g>
    <circle cx={x} cy={y} r={r * (1.8 + 0.4 * hot)} fill={kind === "sun" ? "#FFB23D" : "#9FB3D9"} opacity={0.25 + 0.3 * hot} filter="url(#mBlur8)" />
    <circle cx={x} cy={y} r={r} fill={kind === "sun" ? "#FFD36B" : "#E8EEF8"} />
    {kind === "moon" ? <circle cx={x + r * 0.35} cy={y - r * 0.2} r={r * 0.85} fill="#0C0A1C" opacity={0.85} /> : null}
  </g>
);

export const RahuScene8: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.rahu;
  const sun = Math.max(0, 1 - Math.abs(f - CUES.surya - 6) / 16);
  const moon = Math.max(0, 1 - Math.abs(f - CUES.chandra - 6) / 16);
  const look = f < CUES.surya ? 0 : f < CUES.chandra ? -0.7 : f < CUES.sabKuch ? 0.7 : 0;
  const rise = ramp(f, a, a + 14, "out");
  const z = track(f, [[a, 1.0], [CUES.sabKuch, 1.06, "io"], [b, 1.08, "io"]]);
  return (
    <World>
      <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
        <Cosmos f={f} z={1.04} />
        <Disc8 x={210} y={330} r={70} kind="sun" hot={sun} />
        <Disc8 x={870} y={330} r={62} kind="moon" hot={moon} />
        <ellipse cx={540} cy={1000} rx={440} ry={480} fill="#5A1A2A" opacity={0.35} filter="url(#mBlur8)" />
        <Rahu8 id="rh8" at={{ x: 540, y: 1000 + 120 * (1 - rise) }} s={2.4} f={f} line="05_rahu" throat={0.8} rage={0.9} lookX={look} />
        <Motes f={f} n={22} seed="rh8m" color="#FFB3A0" dir={-1} speed={0.6} size={3} o={0.5} />
      </g>
      <Vignette o={0.75} />
    </World>
  );
};
