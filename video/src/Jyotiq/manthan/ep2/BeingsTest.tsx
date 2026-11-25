import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { RigDefs } from "../rig";
import { H, W } from "../style";
import { coil, headAngle, Mandar, mandarHalfW, runs, SerpentBody, spline, V2, VasukiHead } from "./beings2";

/* Review still for Episode 2's new beings (not part of the reel). */
const MX = 540;
const MY = 1560;
const MS = 0.85;
const hw = (y: number) => MS * mandarHalfW((y - MY) / MS);

const tail = spline([{ x: 1180, y: 1380 }, { x: 1000, y: 1404 }, { x: 860, y: 1362 }, { x: MX + hw(1322) + 24, y: 1322 }], 50).slice(0, -1);
const helix = coil(MX, 829, 1322, hw, 2.5, 240);
const end = helix.pts[helix.pts.length - 1];
const lead = spline([end, { x: 330, y: 790 }, { x: 220, y: 752 }, { x: 150, y: 690 }], 50).slice(1);
const BODY: V2[] = [...tail, ...helix.pts, ...lead];
const FRONT: boolean[] = [...tail.map(() => true), ...helix.front, ...lead.map(() => true)];
const RUNS = runs(FRONT);

export const ManthanEp2BeingsTest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#141B44, #2A2F6A 55%, #0C1230)" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <RigDefs />
        {RUNS.filter((r) => !r.front).map((r) => (
          <SerpentBody key={`b${r.i0}`} s={BODY} i0={r.i0} i1={r.i1} R={30} />
        ))}
        <g transform={`translate(${MX} ${MY}) scale(${MS})`}>
          <Mandar t={f} crack={0.8} glow={0.8} />
        </g>
        <rect x={0} y={1430} width={W} height={490} fill="#ECE6F2" />
        <path d="M0 1430Q270 1410 540 1430T1080 1430" stroke="#FFFFFF" strokeWidth={6} fill="none" />
        {RUNS.filter((r) => r.front).map((r) => (
          <SerpentBody key={`f${r.i0}`} s={BODY} i0={r.i0} i1={r.i1} R={30} />
        ))}
        <VasukiHead at={BODY[BODY.length - 1]} ang={headAngle(BODY)} s={0.95} t={f} eye={1} tongue={0.5} />
        {/* close-up inset */}
        <rect x={600} y={40} width={450} height={520} rx={24} fill="#0B1230" stroke="#E8B24A" strokeWidth={3} />
        <VasukiHead at={{ x: 825, y: 520 }} ang={0} s={1.3} t={f} eye={1} tongue={0.7} smoke={0.8} />
        <g transform="translate(330 1700) scale(0.4)">
          <Mandar t={f} roots={1} glow={0.4} />
        </g>
        <text x={330} y={1900} textAnchor="middle" fill="#3A2A4A" fontSize={26} fontFamily="Georgia">uprooted state</text>
      </svg>
    </AbsoluteFill>
  );
};
