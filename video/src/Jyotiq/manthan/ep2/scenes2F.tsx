import React from "react";
import { shake, World } from "../kit";
import { blinkAt, handToWorld, idle, pose, Puppet } from "../rig";
import { Vignette } from "../sets";
import { ramp, rnd } from "../style";
import { headAngle, SerpentBody, spline, V2, VasukiHead } from "./beings2";
import { CH, ChurnLineup, LineupOpts } from "./churn";
import { camOn, lerpCam } from "./scenes2A";
import { ChurnSea } from "./sets2";
import { mouth } from "./talk2";
import { CUES } from "./timing";

/* Episode 2 (2711-3129): the churn begins, Mandar cracks and sinks.
   2711-2815 wide line-up heaving: "Manthan shuru hua... aur tabhi—"; Mandar cracks from 'crack'
   2815-2867 silent: white hit, the mountain tips and sinks, everyone dragged toward it, focus lines
   2867-2927 Indra, dutch angle: "Parvat doob raha hai!"
   2927-3129 Swarbhanu holding on, smirking: "Tumhare Vishnu ki yojana... doob rahi hai, Indra." */

/** Light focus lines converging on (cx, cy): the pull toward the sinking mountain. */
const PullLines: React.FC<{ cx: number; cy: number; o: number; f: number; seed: string }> = ({ cx, cy, o, f, seed }) => (
  <g opacity={o}>
    {new Array(34).fill(0).map((_, i) => {
      const a = (i / 34) * Math.PI * 2 + rnd(`${seed}${i}`) * 0.12;
      const r0 = 360 + ((rnd(`${seed}r${i}`) * 300 + f * 18) % 300);
      const w = 0.008 + rnd(`${seed}w${i}`) * 0.012;
      const q = (r: number, da: number) => `${(cx + Math.cos(a + da) * r).toFixed(0)} ${(cy + Math.sin(a + da) * r).toFixed(0)}`;
      return <path key={i} d={`M${q(r0, 0)}L${q(1800, -w)}L${q(1800, w)}Z`} fill="#FFFFFF" opacity={0.55} />;
    })}
  </g>
);

export const Churn: React.FC<{ f: number }> = ({ f }) => {
  const ck = CUES.crack;
  const push = ramp(f, CUES.heave, ck, "io");
  const crackPush = ramp(f, ck, ck + 22, "io");
  const cam = lerpCam(lerpCam(camOn(540, 960, 1), camOn(560, 1000, 1.15), push), camOn(580, 960, 1.5), crackPush);
  const [sx, sy] = shake(f, ck, 35, 6);
  const o: LineupOpts = {
    heave: 1,
    crack: ramp(f, ck, CUES.crackHit, "in"),
    vishnuSmile: 0.9,
    eye: 0.9,
    smoke: 0.6, // Vasuki's hot breath already on the asuras at the head end
    over: { swar: { smile: 0.3, browTilt: 14 } },
  };
  return (
    <World dx={sx} dy={sy}>
      <ChurnLineup f={f} cam={cam} o={o} storm={0.45} glow={0.5} swirl={1} />
      <Vignette o={0.85} />
    </World>
  );
};

/** Milk surging up round the mountain's foot as it goes under. */
const Surge: React.FC<{ k: number; f: number; cx: number; cy: number }> = ({ k, f, cx, cy }) => (
  <g opacity={Math.min(1, k * 1.5)}>
    {new Array(12).fill(0).map((_, i) => {
      const x = cx - 190 + (i / 11) * 380;
      const h = (70 + 130 * rnd(`sg${i}`)) * k * (0.8 + 0.2 * Math.sin(f / 3 + i));
      return <path key={i} d={`M${x - 24} ${cy}Q${x} ${cy - h} ${x + 24} ${cy}Z`} fill="#FFFFFF" />;
    })}
    <ellipse cx={cx} cy={cy + 8} rx={230} ry={34} fill="#F4EEF8" />
    <path d={`M${cx - 230} ${cy + 8}A230 34 0 0 0 ${cx + 230} ${cy + 8}`} stroke="#B7A6D6" strokeWidth={5} fill="none" />
  </g>
);

export const SinkWide: React.FC<{ f: number }> = ({ f }) => {
  const s0 = CUES.sink;
  const k = ramp(f, s0, s0 + 40, "in");
  const tilt = 1.7 * k; // up to ~15 degrees and ~190 px down
  const drag = 1.5 * ramp(f, s0 + 4, s0 + 36, "io");
  const [sx, sy] = shake(f, s0, 50, 16);
  const cam = camOn(560, 1000, 1.08);
  const hit = f >= s0 && f < s0 + 3 ? 1 - (f - s0) / 3 : 0;
  const o: LineupOpts = {
    heave: 0.2,
    tilt,
    drag,
    crack: 1,
    vishnuSmile: 0.9,
    eye: 1,
    smoke: 0.5,
    over: { indra: { browTilt: -14, brow: 1 }, bali: { browTilt: -6, brow: 0.8 }, swar: { smile: 0.5 } },
  };
  return (
    <World dx={sx} dy={sy}>
      <ChurnLineup f={f} cam={cam} o={o} storm={0.6} glow={0.4} swirl={1}>
        <Surge k={k} f={f} cx={CH.MX} cy={CH.MY - 6} />
      </ChurnLineup>
      <PullLines cx={560} cy={1150} o={0.45 * drag} f={f} seed="sk" />
      {hit > 0 ? <rect width={1080} height={1920} fill="#FFFFFF" opacity={0.75 * hit} /> : null}
      <Vignette o={0.9} />
    </World>
  );
};

/** A stretch of serpent passing through a hand, starting off-screen so the taper never shows. */
const rope = (cp: V2[]) => spline(cp, 80);

export const IndraPanic: React.FC<{ f: number }> = ({ f }) => {
  const at = { x: 600, y: 1300, s: 1.6, facing: -1 };
  const p = pose({
    ...idle("ip", f, 0.6),
    blink: 0,
    lean: 16,
    head: 6,
    sF: 70,
    eF: 20,
    wF: -10,
    sB: 62,
    eB: 26,
    fist: 1,
    brow: 1,
    browTilt: -14,
    lookX: 0.4,
    lookY: 0.2,
    talk: mouth("indra", f),
  });
  const h = handToWorld(p, at, true);
  const hand: V2 = { x: h[0], y: h[1] };
  // the tail: thin tip off-screen right, through his hands, dragged down-left toward the mountain
  const tail = rope([{ x: 1700, y: hand.y - 120 }, { x: 1250, y: hand.y - 60 }, { x: 900, y: hand.y - 14 }, hand, { x: hand.x - 400, y: hand.y + 120 }, { x: -400, y: hand.y + 320 }]);
  const [sx, sy] = shake(f, CUES.panic, 60, 7);
  return (
    <World dx={sx} dy={sy}>
      <g transform="translate(540 960) rotate(-6) scale(1.17) translate(-540 -960)">
        <ChurnSea f={f} cam={{ x: -100, y: -500, z: 1.4 }} storm={0.7} glow={0.35} />
      </g>
      <SerpentBody s={tail} R={30} />
      <Puppet id="ip-indra" who="indra" at={at} p={p} t={f} />
      <PullLines cx={-200} cy={1300} o={0.5} f={f} seed="ip" />
      <Vignette o={0.95} />
    </World>
  );
};

export const SwarSmirk: React.FC<{ f: number }> = ({ f }) => {
  const at = { x: 470, y: 1330, s: 1.5, facing: 1 };
  const p = pose({
    ...idle("ss", f, 0.5),
    blink: blinkAt("ss", f),
    lean: 8,
    head: -3,
    sF: 72,
    eF: 18,
    wF: -10,
    sB: 64,
    eB: 24,
    fist: 1,
    browTilt: 8,
    smile: 0.8,
    glow: 0.35,
    lookX: 0.8,
    talk: mouth("swarbhanu", f),
  });
  const h = handToWorld(p, at, true);
  const hand: V2 = { x: h[0], y: h[1] };
  // the neck: from the mountain (off-screen right) through his fists, then rearing up behind him to the head
  const head: V2 = { x: 190, y: 640 + 10 * Math.sin(f / 18) };
  const neck = rope([
    { x: 1800, y: hand.y + 260 },
    { x: 1300, y: hand.y + 150 },
    { x: 950, y: hand.y + 40 },
    hand,
    { x: hand.x - 260, y: hand.y - 10 },
    { x: 200, y: hand.y - 150 },
    { x: 160, y: 900 },
    head,
  ]);
  const zz = 1 + 0.15 * ramp(f, CUES.smirk, 3129, "io");
  return (
    <World>
      <g transform={`translate(540 960) scale(${zz}) translate(-540 -960)`}>
        <g transform="translate(540 960) rotate(5) scale(1.15) translate(-540 -960)">
          <ChurnSea f={f} cam={{ x: 120, y: -500, z: 1.4 }} storm={0.7} glow={0.4} />
        </g>
        <SerpentBody s={neck} R={42} />
        <VasukiHead at={head} ang={headAngle(neck)} s={1.3} t={f} eye={1} tongue={0.2 + 0.4 * Math.max(0, Math.sin(f / 6))} smoke={0.85} />
        <Puppet id="ss-sw" who="swarbhanu" at={at} p={p} t={f} />
      </g>
      <PullLines cx={1300} cy={1300} o={0.35} f={f} seed="ss" />
      <Vignette o={0.95} />
    </World>
  );
};
