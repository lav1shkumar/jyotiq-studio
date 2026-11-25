import React from "react";
import { bump, World } from "../kit";
import { idle, pose, Puppet, Who } from "../rig";
import { Cam, CAM0, KshiraSagar, Motes, Vignette } from "../sets";
import { H, ramp, track, W } from "../style";
import { ChurnStage } from "../ep3/stage3";
import { LakshmiStanding, Varmala } from "./lakshmi";
import { CUES, SCENES } from "./timing";

/* Episode 5 scenes, part A: the hook and the title bed.
   Frame 0 is Episode 4's last story frame (its EndBed4 at Episode 4 frame 1761, undimmed): the
   churning resumes with a gold glow under the sea. The camera pushes into the glow, a gold flash,
   and the flash-forward: Lakshmi backlit (her face is saved for the reveal) holding the lit varmala,
   devtas on the left and asuras on the right greying out as the poll strikes them. */

const CUT = 44; // the flash-forward starts here
const EP4_LAST = 1761; // Episode 4's final frame, so the churn, glow and motes match it exactly

const Ep4Close: React.FC<{ f: number }> = ({ f }) => {
  const f4 = EP4_LAST + f;
  const cam: Cam = { x: 0, y: 0, z: 1.07 };
  const gold = 0.6 + 0.4 * Math.sin(f4 / 14);
  const surge = ramp(f, 8, CUT, "in");
  const z = track(f, [[0, 1.0], [CUT, 1.6, "in"]]);
  return (
    <g>
      <g transform={`translate(540 1560) scale(${z}) translate(-540 -1560)`}>
        <ChurnStage f={f4} cam={cam} fx={{ heave: 0.6, spin: 0.45 * Math.sin(f4 / 13), glow: 0.9 + 0.1 * surge, vasuki: { eye: 1 } }} />
        <ellipse cx={540} cy={1560} rx={520 + 220 * surge} ry={160 + 90 * surge} fill="#FFD36B" opacity={0.35 * gold + 0.4 * surge} filter="url(#mBlur8)" />
        <ellipse cx={540} cy={1560} rx={220 + 180 * surge} ry={60 + 60 * surge} fill="#FFF1C8" opacity={0.3 * gold + 0.5 * surge} filter="url(#mBlur8)" />
        <Motes f={f4} n={36} seed="eb4m" color="#FFE6A3" dir={-1} speed={0.5} size={3} o={0.7} />
      </g>
      <Vignette o={0.7} />
    </g>
  );
};

type Cand = { who: Who; x: number; s: number };
const DEV: Cand[] = [
  { who: "surya", x: 70, s: 0.5 },
  { who: "indra", x: 178, s: 0.56 },
  { who: "agni", x: 284, s: 0.5 },
];
const ASU: Cand[] = [
  { who: "asuraJade", x: 796, s: 0.5 },
  { who: "bali", x: 902, s: 0.56 },
  { who: "asuraIron", x: 1010, s: 0.5 },
];
const LX = 540;
const LY = 1930;
const LS = 1.32;

const FlashForward: React.FC<{ f: number }> = ({ f }) => {
  const t = f - CUT;
  const z = track(t, [[0, 1.08], [122, 1.0, "out"]]);
  const dv = ramp(f, CUES.strikeDevta, CUES.strikeDevta + 8, "out");
  const as = ramp(f, CUES.strikeAsur, CUES.strikeAsur + 8, "out");
  const q = ramp(f, CUES.kise - 4, CUES.kise + 8, "out");
  const sway = Math.sin(f / 18) * 6;
  return (
    <g>
      <KshiraSagar f={f} cam={CAM0} glow={1} />
      <g transform={`translate(540 1200) scale(${z}) translate(-540 -1200)`}>
        {/* god rays and the glow she stands in */}
        <g transform={`translate(540 1000) rotate(${f * 0.15})`} opacity={0.55 + 0.25 * q}>
          {new Array(18).fill(0).map((_, i) => (
            <path key={i} d="M-16 0L0 -1150L16 0Z" transform={`rotate(${i * 20})`} fill="#FFE6A3" opacity={0.17} />
          ))}
        </g>
        <circle cx={540} cy={1000} r={340} fill="#FFE2A0" opacity={0.5 + 0.2 * q} filter="url(#mBlur8)" />
        {/* the candidates: each side greys out as its chip is struck */}
        {DEV.map((m, i) => (
          <Puppet key={m.who} id={`hk-d${i}`} who={m.who} at={{ x: m.x, y: 1500, s: m.s, facing: 1 }} p={pose({ ...idle(`hkd${i}`, f), lookX: 0.8, lookY: -0.3, smile: 0.25 * (1 - dv) })} t={f} drain={0.85 * dv} />
        ))}
        {ASU.map((m, i) => (
          <Puppet key={m.who} id={`hk-a${i}`} who={m.who} at={{ x: m.x, y: 1500, s: m.s, facing: -1 }} p={pose({ ...idle(`hka${i}`, f), lookX: 0.8, lookY: -0.3, smile: 0.25 * (1 - as) })} t={f} drain={0.85 * as} />
        ))}
        {/* Lakshmi, backlit: a dark figure with a gold rim */}
        <g style={{ filter: `brightness(${0.2 + 0.08 * q}) saturate(1.35) drop-shadow(0 0 16px #FFD36B)` }}>
          <LakshmiStanding id="hk-lk" f={f} x={LX} y={LY} s={LS} garland={false} halo={0} />
        </g>
        {/* the varmala, lit */}
        <g transform={`translate(${LX} ${LY}) scale(${LS})`}>
          <Varmala a={[-54, -432]} b={[54, -432]} sag={190 + sway} t={f} glow={0.8 + 0.4 * q} />
        </g>
      </g>
      <Motes f={f} n={40} seed="hk5m" color="#FFE6A3" dir={-1} speed={0.6} size={3} o={0.8} />
      <Vignette o={0.6} />
    </g>
  );
};

/** 0-166: the hook. */
export const Hook5: React.FC<{ f: number }> = ({ f }) => (
  <World>
    {f < CUT ? <Ep4Close f={f} /> : <FlashForward f={f} />}
    <rect width={W} height={H} fill="#FFF6DC" opacity={0.95 * bump(f, CUT - 12, CUT + 10)} />
  </World>
);

/** 166-206: the title bed, a darkened golden sea under the series title. */
export const TitleBed5: React.FC<{ f: number }> = ({ f }) => (
  <World>
    <KshiraSagar f={f} cam={{ x: 0, y: 0, z: track(f, [[SCENES.title[0], 1.0], [SCENES.title[1], 1.05]]) }} glow={0.9} />
    <rect width={W} height={H} fill="#0C0A07" opacity={0.55} />
    <circle cx={540} cy={960} r={420} fill="#FFD36B" opacity={0.18} filter="url(#mBlur8)" />
    <Motes f={f} n={50} seed="tb5" color="#FFE6A3" dir={-1} speed={0.6} size={3} o={0.9} />
    <Vignette o={0.8} />
  </World>
);
