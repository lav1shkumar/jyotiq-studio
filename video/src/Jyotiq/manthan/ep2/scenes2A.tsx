import React from "react";
import { KundaliGrid } from "../graphics";
import { shake, World } from "../kit";
import { blinkAt, handToWorld, idle, pose, Puppet } from "../rig";
import { Cosmos } from "../scenesA";
import { Cam, Motes, Vignette } from "../sets";
import { ramp, rnd } from "../style";
import { headAngle, SerpentBody, spline, V2, VasukiHead } from "./beings2";
import { RahuHead } from "./beings3";
import { CH, ChurnLineup, lineup, LineupOpts } from "./churn";
import { RahuStamp, SandhiArt } from "./graphics2";
import { ChurnSea } from "./sets2";
import { talk2 } from "./talk2";
import { CUES, SCENES } from "./timing";

/* Episode 2 cold open (0-386) and title background (386-452).
   A  0-72    close-up: Swarbhanu grabs Vasuki's neck under the glowing eyes, "सिर हमारा होगा!"
   B  72-303  pull back to the churning line-up; push in; his body turns to smoke, the head lifts
   C  303-386 the head rises into the eclipse; the kundali draws on; राहु lands in the first house */

/** Camera that centres world point (x, y) at on-screen zoom z, for a layer at `depth`. */
export const camOn = (x: number, y: number, z: number, depth = CH.depth): Cam => ({ x: (x - 540) / depth, y: (y - 960) / depth, z: 1 + (z - 1) / depth });
export const lerpCam = (a: Cam, b: Cam, k: number): Cam => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, z: a.z + (b.z - a.z) * k });

export const RISE_CUT = CUES.headRise + 22;

/* A ---------------------------------------------------------------- */
export const ColdClose: React.FC<{ f: number }> = ({ f }) => {
  const z = 1.14 + 0.08 * ramp(f, 0, 76, "io");
  const [sx, sy] = shake(f, CUES.grab + 2, 12, 9);
  const grip = ramp(f, CUES.grab, CUES.grab + 6, "out");
  const at = { x: 262, y: 1330, s: 1.5, facing: 1 };
  const p = pose({
    ...idle("cold-sw", f, 0.6),
    blink: f > 44 ? blinkAt("cold-sw", f) : 0,
    lean: 6,
    head: -5,
    sF: 84 - 4 * grip,
    eF: 14,
    wF: -14,
    sB: 24,
    eB: 58,
    fist: grip,
    browTilt: 18,
    glow: 0.45 + 0.45 * grip,
    talk: talk2("01_swarbhanu", f),
    lookX: 0.9,
    lookY: -0.35,
    smile: -0.15,
  });
  const h = handToWorld(p, at, true);
  const hand: V2 = { x: h[0], y: h[1] };
  const headAt: V2 = { x: hand.x + 26, y: hand.y - 165 };
  // Start far off-screen so the body's thin tail taper never shows.
  const neck = spline(
    [{ x: 1500, y: 2900 }, { x: 1330, y: 2500 }, { x: 1180, y: 2140 }, { x: 1020, y: 1780 }, { x: hand.x + 90, y: hand.y + 250 }, hand, headAt],
    90,
  );
  return (
    <World dx={sx} dy={sy}>
      <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
        <ChurnSea f={f} cam={{ x: 0, y: -1300, z: 1.35 }} storm={0.8} glow={0.85} />
        <Motes f={f} n={26} seed="cc" color="#FFC98A" o={0.7} />
        <SerpentBody s={neck} R={58} />
        <VasukiHead at={headAt} ang={headAngle(neck)} s={2.25} t={f} eye={0.8 + 0.2 * Math.sin(f / 3.2)} tongue={0.45 + 0.4 * Math.max(0, Math.sin(f / 5))} smoke={0.75} />
        <Puppet id="cold-sw" who="swarbhanu" at={at} p={p} t={f} />
      </g>
      <Vignette o={0.95} />
    </World>
  );
};

/* B ---------------------------------------------------------------- */
const SmokeOut: React.FC<{ k: number; x: number; y: number; s: number }> = ({ k, x, y, s }) => (
  <g filter="url(#mBlur8)">
    {new Array(14).fill(0).map((_, i) => {
      const a = rnd(`so${i}`) * Math.PI * 2;
      const d0 = rnd(`sd${i}`);
      const t = Math.min(1, k * (0.7 + 0.6 * rnd(`st${i}`)));
      const px = x + Math.cos(a) * (40 + 120 * t) * s * (0.4 + d0);
      const py = y - 160 * s * (0.2 + d0) - t * 260 * s + Math.sin(a) * 60 * s;
      const r = (26 + 70 * t) * s * (0.6 + rnd(`sr${i}`) * 0.6);
      return <circle key={i} cx={px} cy={py} r={r} fill={i % 3 ? "#2A1B44" : "#4B2E6E"} opacity={Math.sin(Math.PI * t) * 0.75} />;
    })}
  </g>
);

const C_START = camOn(292, 1090, 1.85);
const C_FULL = camOn(540, 960, 1);
const C_PUSH = camOn(225, 1080, 2.3);
const C_UP = camOn(225, 780, 2.1);

export const ColdWide: React.FC<{ f: number }> = ({ f }) => {
  const k1 = ramp(f, CUES.pullBack, CUES.pullBack + 120, "io");
  const calm = ramp(f, CUES.dissolve - 28, CUES.dissolve, "io");
  const k2 = ramp(f, CUES.dissolve - 16, CUES.dissolve + 32, "io");
  const k3 = ramp(f, CUES.headRise, CUES.headRise + 24, "io");
  const cam = lerpCam(lerpCam(lerpCam(C_START, C_FULL, k1), C_PUSH, k2), C_UP, k3);
  const dis = ramp(f, CUES.dissolve, CUES.dissolve + 34);
  const rise = ramp(f, CUES.headRise, CUES.headRise + 30, "in");
  const o: LineupOpts = {
    heave: 1 - 0.75 * calm,
    alpha: { swar: 1 - dis },
    over: { swar: { lean: -12 * (1 - calm), glow: 0.3 + 0.6 * calm, browTilt: 14 } },
    vishnuSmile: 0.85,
    eye: 0.85,
    smoke: 0.2,
  };
  const g = lineup(f, o);
  const sw = g.asuras[g.asuras.length - 1];
  const headAt: V2 = { x: sw.at.x + 29 * sw.s, y: sw.at.y - 289 * sw.s - rise * 520 };
  return (
    <World>
      <ChurnLineup f={f} cam={cam} o={o} storm={0.35} glow={0.45}>
        {dis > 0 ? <SmokeOut k={dis} x={sw.at.x + 10} y={sw.at.y + 40} s={sw.s} /> : null}
        {dis > 0 ? (
          <g opacity={ramp(f, CUES.dissolve, CUES.dissolve + 10)}>
            <RahuHead id="cw" at={headAt} s={sw.s * (1 + 0.5 * rise)} t={f} p={{ smile: 0.6 * dis, browTilt: 10, lookX: 0.4, glow: 0.8 }} smoke={dis} />
          </g>
        ) : null}
      </ChurnLineup>
      <Vignette o={0.8} />
    </World>
  );
};

/* C ---------------------------------------------------------------- */
export const RahuRise: React.FC<{ f: number }> = ({ f }) => {
  const up = ramp(f, RISE_CUT - 4, RISE_CUT + 30, "out");
  const kd = ramp(f, RISE_CUT + 8, CUES.rahuStamp, "io");
  const gl = ramp(f, CUES.rahuStamp, CUES.rahuStamp + 12);
  const slam = f >= CUES.rahuSlam ? Math.max(0, 1 - (f - CUES.rahuSlam) / 10) : 0;
  const [sx, sy] = shake(f, CUES.rahuSlam, 10, 12);
  const z = 1 + 0.05 * ramp(f, RISE_CUT - 8, CUES.rahuSlam + 10);
  const cy = 640;
  return (
    <World dx={sx} dy={sy}>
      <Cosmos f={f} z={z} />
      <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
        <circle cx={540} cy={cy} r={250 + 30 * slam} fill="#FFB23D" opacity={0.28 + 0.3 * slam} filter="url(#mBlur8)" />
        <g transform={`translate(540 ${cy}) rotate(${f * 0.4})`} opacity={0.5}>
          {new Array(16).fill(0).map((_, i) => (
            <path key={i} d="M0 -214L7 -300L0 -330L-7 -300Z" fill="#FFD27A" transform={`rotate(${i * 22.5})`} />
          ))}
        </g>
        <circle cx={540} cy={cy} r={200} fill="#0A0612" stroke="#FFD27A" strokeWidth={5} />
        <g opacity={kd}>
          <KundaliGrid f={f} cx={540} cy={1250} size={540} d={kd} glyphs={gl} o={0.9} />
        </g>
        <RahuHead id="rr" at={{ x: 540, y: 670 + (1 - up) * 700 }} s={1.4} t={f} p={{ smile: 0.9, browTilt: 8, lookX: 0.2, glow: 0.6 + 0.4 * gl }} smoke={1} />
        <circle cx={540} cy={1115} r={94} fill="#120A08" opacity={ramp(f, CUES.rahuStamp, CUES.rahuStamp + 3)} />
        <RahuStamp f={f} at={CUES.rahuStamp} x={540} y={1115} s={0.72 * (1 + 0.12 * slam)} />
        {slam > 0 ? <circle cx={540} cy={1115} r={92 + (1 - slam) * 260} fill="none" stroke="#FFF1C2" strokeWidth={10 * slam} opacity={slam} /> : null}
      </g>
      <Vignette o={0.8} />
    </World>
  );
};

/* Title background ---------------------------------------------------- */
export const TitleBg2: React.FC<{ f: number }> = ({ f }) => (
  <World>
    <Cosmos f={f} z={1.08 + ramp(f, SCENES.title[0] - 10, SCENES.title[1]) * 0.04} />
    <g opacity={0.26}>
      <SandhiArt f={f} d={1} x={540} y={1420} s={0.9} />
    </g>
    <rect width={1080} height={1920} fill="#0C0A07" opacity={0.35} />
    <Vignette />
  </World>
);
