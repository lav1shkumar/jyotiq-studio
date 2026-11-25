import React from "react";
import { shake, World } from "../kit";
import { idle, pose, Puppet, Vajra } from "../rig";
import { CAM0, KshiraSagar, Motes, Vignette } from "../sets";
import { ramp, track, W } from "../style";
import { Airavata } from "../beings";
import { VishnuStanding } from "../ep2/beings3";
import { EmptySetting, Kaustubha } from "./cast5";
import { Foam, Splash } from "./scenes5b";
import { CUES, SCENES } from "./timing";

/* Episode 5 scenes, part C (line 04): Airavata, Episode 1's white elephant, surges out of the milk
   and goes to Indra; then the Kaustubha gem rises in rays, arcs across and lands on Vishnu's chest
   (VishnuStanding draws that gem itself, so an empty gold setting covers it until the landing). */

/** 508-566: Airavata surges up and strides to Indra, who lifts his vajra. */
export const AiravataScene: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.airavata;
  const t = f - a;
  const groundY = 1500;
  const rise = ramp(t, 0, 14, "out");
  const walk = ramp(t, 12, 20);
  const ex = 110 + 120 * ramp(t, 12, b - a, "io");
  const joy = ramp(f, CUES.indra - 4, CUES.indra + 8, "out");
  const [sx, sy] = shake(f, a, 12, 14);
  const z = track(t, [[0, 1.0], [b - a, 1.1, "in"]]);
  return (
    <World dx={sx} dy={sy}>
      <g transform={`translate(540 1250) scale(${z}) translate(-540 -1250)`}>
        <KshiraSagar f={f} cam={CAM0} glow={0.7} swell={0.4} />
        <ellipse cx={ex + 180} cy={groundY - 260} rx={420} ry={300} fill="#FFF3D2" opacity={0.3} filter="url(#mBlur8)" />
        <Puppet
          id="ind5"
          who="indra"
          at={{ x: 870, y: 1330, s: 0.8, facing: -1 }}
          p={pose({ ...idle("ind5", f), sF: 30 + 110 * joy, eF: 30, smile: 0.2 + 0.6 * joy, lookX: 0.8, brow: 0.3 * joy })}
          t={f}
          prop={<Vajra glow={0.4 + 0.6 * joy} />}
        />
        <clipPath id="ai5-clip">
          <rect x={-200} y={0} width={W + 400} height={groundY + 6} />
        </clipPath>
        <g clipPath="url(#ai5-clip)">
          <g transform={`translate(${ex} ${groundY + (1 - rise) * 460}) scale(0.85)`} filter="url(#mCut)">
            <Airavata t={f} step={f / 6} walk={walk} flap={1} trunkSway={1.2} trunkCurl={0.9 - 0.4 * walk} />
          </g>
        </g>
        <Foam f={f} x={ex + 150} y={groundY} w={300} o={1 - ramp(t, 14, 34)} />
        <Splash f={f} at={a} x={ex + 150} y={groundY} s={1.5} />
      </g>
      <Motes f={f} n={24} seed="ai5" color="#FFF2C2" dir={-1} speed={0.6} size={3} o={0.6} />
      <Vignette o={0.55} />
    </World>
  );
};

const VX = 720;
const VY = 1750;
const VS = 0.9;
const CHEST: [number, number] = [VX, VY - 566 * VS]; // Vishnu's chest gem in world space

/** 566-660: the gem rises in rays, arcs across and lands on Vishnu's chest. */
export const KaustubhaScene: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.kaustubha;
  const land = CUES.vishnuGem + 4;
  const fly0 = land - 11;
  const riseK = ramp(f, a, fly0, "out");
  const u = ramp(f, fly0, land, "io");
  const start: [number, number] = [300, 1560 - 560 * riseK];
  const gx = start[0] + (CHEST[0] - start[0]) * u;
  const gy = start[1] + (CHEST[1] - start[1]) * u - 260 * Math.sin(Math.PI * u);
  const gs = 1.2 - 0.75 * u;
  const landed = f >= land;
  const burst = ramp(f, land, land + 14, "out");
  const smile = ramp(f, land, land + 10, "out");
  const z = track(f, [[a, 1.0], [land, 1.04], [b, 1.14, "io"]]);
  return (
    <World>
      <g transform={`translate(${CHEST[0]} ${CHEST[1]}) scale(${z}) translate(${-CHEST[0]} ${-CHEST[1]})`}>
        <KshiraSagar f={f} cam={CAM0} glow={0.8} />
        <g transform={`translate(${VX} ${VY}) scale(${VS})`} filter="url(#mCut)">
          <VishnuStanding t={f} smile={0.3 + 0.45 * smile} halo={0.6 + 0.3 * smile} />
          {!landed ? (
            <g transform="translate(0 -566)">
              <EmptySetting />
            </g>
          ) : null}
        </g>
        {/* the sparkle trail while it flies */}
        {u > 0 && !landed
          ? [1, 2, 3, 4, 5].map((k) => {
              const uu = Math.max(0, u - 0.07 * k);
              const tx = start[0] + (CHEST[0] - start[0]) * uu;
              const ty = start[1] + (CHEST[1] - start[1]) * uu - 260 * Math.sin(Math.PI * uu);
              return (
                <g key={k} transform={`translate(${tx} ${ty}) scale(${1.2 - 0.18 * k})`} opacity={0.8 - 0.14 * k}>
                  <path d="M0 -12L3 -3L12 0L3 3L0 12L-3 3L-12 0L-3 -3Z" fill="#FFE2EA" />
                </g>
              );
            })
          : null}
        {!landed ? (
          <g transform={`translate(${gx} ${gy})`}>
            <Kaustubha f={f} s={gs} glow={1} />
          </g>
        ) : null}
        {landed && burst < 1 ? (
          <g transform={`translate(${CHEST[0]} ${CHEST[1]})`} opacity={1 - burst}>
            <circle r={20 + 150 * burst} fill="none" stroke="#FFFFFF" strokeWidth={8 * (1 - burst) + 1} />
            <circle r={60 * (1 - burst) + 10} fill="#FFE2EA" opacity={0.8} filter="url(#mBlur8)" />
          </g>
        ) : null}
        {landed ? (
          <g transform={`translate(${CHEST[0]} ${CHEST[1]})`} opacity={0.5 + 0.3 * Math.sin(f / 5)}>
            <circle r={26} fill="#FF6A88" opacity={0.35} filter="url(#mBlur8)" />
          </g>
        ) : null}
      </g>
      <Motes f={f} n={28} seed="ks5m" color="#FFE6EE" dir={-1} speed={0.5} size={2.6} o={0.7} />
      <Vignette o={0.55} />
    </World>
  );
};
