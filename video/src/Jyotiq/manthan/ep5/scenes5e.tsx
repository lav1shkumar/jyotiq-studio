import React from "react";
import { World } from "../kit";
import { CAM0, Kalash, KshiraSagar, Motes, Vignette } from "../sets";
import { H, ramp, rnd, track, W } from "../style";
import { VishnuStanding } from "../ep2/beings3";
import { LakshmiStanding, Varmala } from "./lakshmi";
import { CUES, SCENES } from "./timing";

/* Episode 5 scenes, part E: the one who did not want her (line 07), the varmala (line 08 and the
   conch beat), and the end bed under the end card (Dhanvantari's kalash glowing under the milk:
   the next episode). Vishnu is Episode 2's VishnuStanding, unchanged. */

const VX = 740;
const VY = 1750;
const VSC = 0.88;
const LX = 330;
const LY = 1750;
const LSC = 0.8;
const MID: [number, number] = [535, 1150]; // between their faces

/** Petals and gold flakes falling across the frame from frame `at`. */
const PetalRain: React.FC<{ f: number; at: number; n?: number }> = ({ f, at, n = 46 }) => {
  const t = f - at;
  if (t < 0) return null;
  const cols = ["#E8304A", "#F7A9C6", "#FFC23A", "#FFFFFF", "#F28DB2"];
  return (
    <g opacity={Math.min(1, t / 8)}>
      {new Array(n).fill(0).map((_, i) => {
        const sp = 7 + rnd(`pr${i}`) * 7;
        const y = -80 + ((t * sp + rnd(`py${i}`) * 900) % 2100) - (t < 40 ? (40 - t) * 18 * rnd(`pd${i}`) : 0);
        const x = rnd(`px${i}`) * W + Math.sin(t / 14 + i) * 30;
        const r = t * (3 + rnd(`prr${i}`) * 4) + i * 37;
        const gold = i % 6 === 0;
        return gold ? (
          <ellipse key={i} cx={x} cy={y} rx={5} ry={3} transform={`rotate(${r} ${x} ${y})`} fill="url(#mGold)" />
        ) : (
          <path key={i} d={`M${x} ${y - 9}C${x + 7} ${y - 4} ${x + 7} ${y + 5} ${x} ${y + 9}C${x - 7} ${y + 5} ${x - 7} ${y - 4} ${x} ${y - 9}Z`} transform={`rotate(${r} ${x} ${y})`} fill={cols[i % cols.length]} opacity={0.9} />
        );
      })}
    </g>
  );
};

const Rays: React.FC<{ f: number; x: number; y: number; o: number }> = ({ f, x, y, o }) =>
  o > 0.01 ? (
    <g transform={`translate(${x} ${y}) rotate(${f * 0.2})`} opacity={o}>
      {new Array(20).fill(0).map((_, i) => (
        <path key={i} d="M-16 0L0 -1200L16 0Z" transform={`rotate(${i * 18})`} fill="#FFE6A3" opacity={0.15} />
      ))}
    </g>
  ) : null;

/** 1024-1180: Vishnu, serene, eyes closed; she comes and stops before him. */
export const VishnuScene: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.vishnu;
  const enter = ramp(f, a + 20, CUES.chah, "io");
  const stop = ramp(f, CUES.chah - 6, CUES.chah + 8, "out");
  const shri = ramp(f, CUES.shriVishnu - 4, CUES.shriVishnu + 14, "out");
  const lift = 0.5 * ramp(f, CUES.walk, b, "io");
  const vFace: [number, number] = [VX, VY - 690 * VSC];
  const z = track(f, [[a, 1.22], [a + 22, 1.18], [CUES.chah, 1.0, "io"], [b, 1.05]]);
  const fx = vFace[0] + (MID[0] - vFace[0]) * ramp(f, a + 22, CUES.chah, "io");
  const fy = vFace[1] + (MID[1] - vFace[1]) * ramp(f, a + 22, CUES.chah, "io");
  return (
    <World>
      <g transform={`translate(${fx} ${fy}) scale(${z}) translate(${-fx} ${-fy})`}>
        <KshiraSagar f={f} cam={CAM0} glow={0.7 + 0.25 * shri} />
        <Rays f={f} x={VX} y={VY - 700 * VSC} o={0.55 * shri} />
        <ellipse cx={VX} cy={VY - 520 * VSC} rx={300} ry={420} fill="#FFE6A3" opacity={0.18 + 0.25 * shri} filter="url(#mBlur8)" />
        <g transform={`translate(${VX} ${VY}) scale(${VSC})`} filter="url(#mCut)">
          <VishnuStanding t={f} closed={1} smile={0.3} halo={0.6 + 0.4 * shri} />
        </g>
        <LakshmiStanding id="lkv" f={f} x={-160 + (LX + 160) * enter} y={LY} s={LSC} lookX={0.75} smile={0.45 + 0.25 * stop} lift={lift} glow={0.25 + 0.2 * shri} />
      </g>
      <Motes f={f} n={30} seed="vs5" color="#FFE6EE" dir={-1} speed={0.45} size={3} o={0.6 + 0.3 * shri} />
      <Vignette o={0.55} />
    </World>
  );
};

/** 1180-1336: she raises the varmala, it floats over his head onto his neck; he opens his eyes; the conch. */
export const VarmalaScene: React.FC<{ f: number }> = ({ f }) => {
  const [a] = SCENES.varmala;
  const raise = 0.5 + 0.5 * ramp(f, a, CUES.varmala, "io");
  const fly0 = CUES.gale - 26;
  const land = CUES.daal;
  const u = ramp(f, fly0, land, "io");
  const flying = f >= fly0;
  const after = ramp(f, land, land + 20, "io");
  const eyes = ramp(f, land, land + 10, "out");
  const joy = ramp(f, CUES.conch - 2, CUES.conch + 10, "out");
  const lift = flying ? raise * (1 - 0.7 * after) : raise;
  // garland ends: from her raised hands (lift 1) to the sides of his neck, arcing over his head
  const k = 1;
  const hl: [number, number] = [LX + LSC * (-58 - 28 * k + 4), LY + LSC * (-440 - 250 * k + 8)];
  const hr: [number, number] = [LX + LSC * (58 + 28 * k - 4), LY + LSC * (-440 - 250 * k + 8)];
  const nl: [number, number] = [VX - 62 * VSC, VY - 636 * VSC];
  const nr: [number, number] = [VX + 62 * VSC, VY - 636 * VSC];
  const arc = 230 * Math.sin(Math.PI * u);
  const ga: [number, number] = [hl[0] + (nl[0] - hl[0]) * u, hl[1] + (nl[1] - hl[1]) * u - arc];
  const gb: [number, number] = [hr[0] + (nr[0] - hr[0]) * u, hr[1] + (nr[1] - hr[1]) * u - arc];
  const sag = (190 - 70 * Math.sin(Math.PI * u)) * (LSC + (VSC - LSC) * u) * (1 - 0.1 * u);
  const z = track(f, [[a, 1.05], [land, 1.08], [SCENES.varmala[1], 1.14, "io"]]);
  return (
    <World>
      <g transform={`translate(${MID[0]} ${MID[1]}) scale(${z}) translate(${-MID[0]} ${-MID[1]})`}>
        <KshiraSagar f={f} cam={CAM0} glow={0.85 + 0.15 * joy} />
        <Rays f={f} x={MID[0]} y={MID[1] - 80} o={0.35 + 0.45 * joy} />
        <ellipse cx={MID[0]} cy={MID[1] + 120} rx={520} ry={460} fill="#FFE6A3" opacity={0.2 + 0.25 * joy} filter="url(#mBlur8)" />
        <g transform={`translate(${VX} ${VY}) scale(${VSC})`} filter="url(#mCut)">
          <VishnuStanding t={f} closed={1 - eyes} smile={0.3 + 0.5 * eyes} halo={1} />
        </g>
        <LakshmiStanding id="lkv" f={f} x={LX} y={LY} s={LSC} lookX={0.75} smile={0.7 + 0.15 * joy} lift={lift} garland={!flying} glow={0.45 + 0.3 * joy} />
        {flying ? (
          <g filter="url(#mCut)">
            <Varmala a={ga} b={gb} sag={sag} t={f} glow={0.6 + 0.4 * (1 - after) + 0.3 * joy} size={LSC + (VSC - LSC) * u} />
          </g>
        ) : null}
      </g>
      <PetalRain f={f} at={CUES.conch} />
      <Motes f={f} n={34} seed="vm5" color="#FFE6A3" dir={-1} speed={0.6} size={3} o={0.7} />
      <Vignette o={0.5} />
    </World>
  );
};

/** 1336-1694: the end bed. A deep night sea with the amrit kalash glowing up under the milk (next
    episode), dimmed under the end card. */
export const EndBed5: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.end;
  const zz = track(f, [[a, 1.0], [b, 1.07, "io"]]);
  const gold = 0.6 + 0.4 * Math.sin(f / 14);
  const rise = ramp(f, a, a + 60, "out");
  return (
    <World>
      <KshiraSagar f={f} cam={{ x: 0, y: 0, z: zz }} glow={0.5} swell={0.3} />
      <ellipse cx={540} cy={1580} rx={520} ry={170} fill="#FFD36B" opacity={0.35 * gold} filter="url(#mBlur8)" />
      <clipPath id="eb5-water">
        <rect x={0} y={0} width={W} height={1620} />
      </clipPath>
      <g clipPath="url(#eb5-water)" opacity={0.85 * (1 - ramp(f, CUES.signoff - 14, CUES.signoff + 4))}>
        <g transform={`translate(540 ${1700 - 120 * rise}) scale(1.1)`}>
          <Kalash f={f} glow={0.6 + 0.4 * gold} />
        </g>
      </g>
      <Motes f={f} n={36} seed="eb5m" color="#FFE6A3" dir={-1} speed={0.5} size={3} o={0.7} />
      <rect width={W} height={H} fill="#0C0A07" opacity={ramp(f, CUES.endCard, CUES.endCard + 14) * 0.58} />
      <Vignette o={0.7} />
    </World>
  );
};
