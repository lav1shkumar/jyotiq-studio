import React from "react";
import { bump, World, shake } from "../kit";
import { Cam, KshiraSagar, Layer, Motes, Vignette } from "../sets";
import { H, ramp, track, W } from "../style";
import { Mandar } from "../ep2/beings2";
import { KurmaGlow } from "../ep2/beings3";
import { TitleScene } from "../scenesA";
import { KurmaEye, KurmaFull } from "./kurma";
import { ChurnStage } from "./stage3";
import { talk3 } from "./kit3";
import { CUES } from "./timing";
import { blinkAt } from "../rig";

/* Episode 3 scenes, part A: the cold open (continues Episode 2's last shot) and the title bed. */

const EYE_CUT = 150; // cut from the wide underwater shot to the eye close-up

/** 0-221: Mandar plunging through the milk, Kurma's shell glowing below (Ep2's last shot), then the eye opens. */
export const ColdOpen: React.FC<{ f: number }> = ({ f }) => {
  if (f < EYE_CUT) {
    // the hook must move from frame 0: faster push and sink, bubbles streaming up, the shaft flickering,
    // and the shut eye twitching twice with a glint before it opens
    const z = track(f, [[0, 1.0], [EYE_CUT, 1.35, "io"]]);
    const sink = track(f, [[0, 0], [EYE_CUT, 160, "io"]]);
    const twitch = bump(f, 24, 40) * 0.25 + bump(f, 92, 108) * 0.3;
    const shaft = 0.42 + 0.14 * Math.sin(f / 5) + 0.06 * Math.sin(f / 2.3);
    // the push is anchored on Kurma's eye (957,1445 at frame 0, so frame 0 still matches Ep2's last shot)
    // and slides it left toward the close-up's position: the twitches and glint stay clear of the right rail
    const ex = track(f, [[0, 957], [EYE_CUT, 640, "out"]]);
    const ey = track(f, [[0, 1445], [EYE_CUT, 1420, "out"]]);
    return (
      <World>
        <defs>
          <linearGradient id="e3deep" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#D8D2EE" />
            <stop offset="0.45" stopColor="#9C94CC" />
            <stop offset="1" stopColor="#3D3A78" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#e3deep)" />
        {/* push in on the shell's head (see ex/ey above) */}
        <g transform={`translate(${ex} ${ey}) scale(${z}) translate(-957 -1445)`}>
          <path d="M380 -40L560 -40L700 1500L240 1500Z" fill="url(#mShaft)" opacity={shaft} />
          {/* the mountain's base still sinking from above */}
          <g transform={`translate(540 ${520 + sink}) scale(0.9)`} opacity={0.85}>
            <Mandar t={f} glow={0.3} />
          </g>
          <rect x={-700} y={-700} width={W + 1400} height={H + 1400} fill="#E9E4F6" opacity={0.35} />
          {/* Kurma's shell glowing in the deep, the shut eye stirring */}
          <g transform="translate(400 1420) scale(0.95)">
            <KurmaGlow id="co" t={f} glow={1} eye={twitch} />
          </g>
          <g transform="translate(957 1445)" opacity={Math.min(1, twitch * 3)}>
            <path d="M0 -40L8 -8L40 0L8 8L0 40L-8 8L-40 0L-8 -8Z" fill="#FFF4C8" filter="url(#mGlow)" />
          </g>
        </g>
        {/* bubbles stream up across the whole frame, outside the push so the slide never leaves a gap */}
        <Motes f={f} n={60} seed="cob" color="#FFFFFF" dir={-1} speed={0.9} size={3} o={0.75} />
        <Motes f={f} n={24} seed="cob2" color="#F4F1EA" dir={-1} speed={1.3} size={6} o={0.5} />
        <Vignette o={0.5} />
      </World>
    );
  }
  const open = ramp(f, 158, 192, "io");
  const flash = ramp(f, 200, 210) * (1 - ramp(f, 214, 226));
  const z = track(f, [[EYE_CUT, 1.0], [221, 1.12, "io"]]);
  return (
    <World>
      <rect width={W} height={H} fill="#173A5A" />
      {/* eye sits below the hook text (text 690-950), so the gold line never lands on the gold iris */}
      <g transform={`translate(540 1230) scale(${z})`}>
        <KurmaEye id="co" t={f} open={open} flash={flash} s={1.25} />
      </g>
      <Motes f={f} n={24} seed="coe" color="#FFE6A3" dir={-1} speed={0.4} size={2.6} o={0.6 * open} />
      <Vignette o={0.6} />
    </World>
  );
};

/** 221-281: the series title bed, exactly Episode 1's (the title card itself is an overlay). */
export const TitleBed = TitleScene;

/** 281-383: the sinking mountain jolts to a stop; close on Indra ("पर्वत... रुक गया!"); the rumble begins. */
export const Stop: React.FC<{ f: number }> = ({ f }) => {
  const [sx, sy] = shake(f, CUES.stopHit, 14, 16);
  const close = f >= 296 && f < 353;
  const cam: Cam = close ? { x: 380, y: 420, z: 2.0 } : { x: 0, y: 0, z: track(f, [[281, 1.04], [383, 1.0, "io"]]) };
  const sinkY = track(f, [[281, 250], [CUES.stopHit, 262, "out"], [CUES.stopHit + 6, 244, "out"], [CUES.stopHit + 14, 254, "io"], [353, 254], [383, 206, "io"]]);
  const tilt = track(f, [[281, -7], [CUES.stopHit + 10, -6, "out"], [383, -4.5, "io"]]);
  const relief = ramp(f, 296, 312);
  return (
    <World dx={sx} dy={sy}>
      <ChurnStage
        f={f}
        cam={cam}
        fx={{
          shell: 0,
          sinkY,
          tilt,
          heave: 0.25,
          glow: 0.25,
          expr: { in: { talk: talk3("02_indra", f), brow: relief, browTilt: -6, smile: 0.4 * relief, lookY: -0.5, lookX: 0.4 } },
        }}
      />
      <Vignette o={0.6} />
    </World>
  );
};

/** 383-734: the hero reveal. Kurma rises under Mandar, milk streaming off the shell; name card at "कूर्म" (overlay). */
export const Reveal: React.FC<{ f: number }> = ({ f }) => {
  // rise centred on the shell, pan right to the head on "कूर्म", pull back wide on "थाम"
  const cam: Cam = {
    x: track(f, [[383, 0], [CUES.kurmaName - 10, 0], [CUES.kurmaName + 40, 480, "io"], [CUES.hold - 20, 480], [734, 140, "io"]]),
    y: track(f, [[383, 120], [560, 60, "io"], [734, 0, "io"]]),
    z: track(f, [[383, 1.15], [560, 1.05, "io"], [CUES.kurmaName + 40, 1.2, "io"], [CUES.hold - 20, 1.2], [734, 1.0, "io"]]),
  };
  const rise = ramp(f, 400, 560, "io");
  const y = 1200 + (1 - rise) * 480; // dome top on screen
  const flash = ramp(f, CUES.shell, CUES.shell + 6) * (1 - ramp(f, CUES.shell + 10, CUES.shell + 40));
  const wet = 1 - ramp(f, CUES.hold, CUES.hold + 40);
  const lift = ramp(f, CUES.kurmaName, CUES.kurmaName + 30, "io");
  const [sx, sy] = shake(f, CUES.hold, 10, 6);
  const wave = Math.sin(f / 13);
  const wl = y + 250; // waterline across the lower dome
  return (
    <World dx={sx} dy={sy}>
      {/* low ocean glow: KshiraSagar's reflection column is screen-fixed, so keep it faint while the camera pans */}
      <KshiraSagar f={f} cam={cam} glow={0.12 + 0.12 * rise} swell={0.6 * (1 - rise)} />
      <Layer cam={cam} depth={0.85}>
        <g transform={`translate(540 ${y}) scale(0.6)`}>
          <KurmaFull id="rv" t={f} eye={1} glow={Math.min(1, 0.6 + 0.4 * rise + flash)} wet={wet} headLift={lift} mountainScale={0.6} />
        </g>
        {/* the gold of the hexes flares on "कवच" */}
        <ellipse cx={540} cy={y + 100} rx={560} ry={150} fill="#FFE29A" opacity={0.45 * flash} filter="url(#mBlur8)" />
        {/* milk in front of the waterline */}
        <path d={`M-100 ${wl}C240 ${wl - 14 + wave * 6} 760 ${wl + 16 - wave * 6} 1180 ${wl}L1180 2100L-100 2100Z`} fill="#EEE8F4" opacity={0.82} />
        <path d={`M-100 ${wl}C240 ${wl - 14 + wave * 6} 760 ${wl + 16 - wave * 6} 1180 ${wl}`} stroke="#FFFFFF" strokeWidth={5} fill="none" />
        <Motes f={f} n={30} seed="rvm" color="#FFF2C2" dir={-1} speed={0.5} size={3} o={0.4 + 0.5 * rise} />
      </Layer>
      <Vignette o={0.55} />
    </World>
  );
};

/** 734-914: close on Kurma's head: "मथो। जब तक अमृत न निकले, ये पर्वत नहीं डूबेगा।" */
export const KurmaTalk: React.FC<{ f: number }> = ({ f }) => {
  const s = 1.5 * track(f, [[734, 1.0], [914, 1.08, "io"]]);
  const hx = 1240; // head centre in KurmaFull units with headLift 1
  const hy = 280;
  const tx = 560 - hx * s;
  const ty = 1040 - hy * s;
  const wave = Math.sin(f / 13);
  return (
    <World>
      <KshiraSagar f={f} cam={{ x: 0, y: -200, z: 1.1 }} glow={0.15} />
      <ellipse cx={560} cy={1040} rx={540} ry={440} fill="#FFE29A" opacity={0.2 + 0.06 * Math.sin(f / 14)} filter="url(#mBlur8)" />
      <g transform={`translate(${tx} ${ty}) scale(${s})`}>
        <KurmaFull id="kt" t={f} eye={1 - blinkAt("kurma", f)} glow={1} headLift={1} mountain={false} talk={talk3("04_vishnu", f)} />
      </g>
      <path d={`M-100 1560C240 ${1546 + wave * 8} 760 ${1574 - wave * 8} 1180 1560L1180 2100L-100 2100Z`} fill="#EEE8F4" opacity={0.85} />
      <path d={`M-100 1560C240 ${1546 + wave * 8} 760 ${1574 - wave * 8} 1180 1560`} stroke="#FFFFFF" strokeWidth={5} fill="none" />
      <Motes f={f} n={26} seed="ktm" color="#FFE6A3" dir={-1} speed={0.4} size={2.8} o={0.7} />
      <Vignette o={0.6} />
    </World>
  );
};
