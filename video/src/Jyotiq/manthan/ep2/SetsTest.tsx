import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { RigDefs } from "../rig";
import { AsuraCourt, CAM0, SetDefs } from "../sets";
import { H, W } from "../style";
import { Mandar } from "./beings2";
import { KurmaGlow } from "./beings3";
import { ChurnSea, MandarRange, UnderMilk } from "./sets2";

/* Review still: Episode 2 sets at half size (not part of the reel). */
const Panel: React.FC<{ x: number; y: number; id: string; label: string; children: React.ReactNode }> = ({ x, y, id, label, children }) => (
  <g>
    <clipPath id={`sp-${id}`}>
      <rect x={x} y={y} width={540} height={960} />
    </clipPath>
    <g clipPath={`url(#sp-${id})`}>
      <g transform={`translate(${x} ${y}) scale(0.5)`}>{children}</g>
    </g>
    <rect x={x} y={y} width={540} height={960} fill="none" stroke="#000" strokeWidth={4} />
    <text x={x + 16} y={y + 940} fill="#FFE6A3" fontSize={24} fontFamily="Georgia">
      {label}
    </text>
  </g>
);

export const ManthanEp2SetsTest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <RigDefs />
        <SetDefs />
        <Panel x={0} y={0} id="a" label="Mandar range (uprooting)">
          <MandarRange f={f} cam={CAM0} dust={0.5} />
          <g transform="translate(540 1560) scale(0.8)">
            <Mandar t={f} crack={1} glow={0.6} />
          </g>
        </Panel>
        <Panel x={540} y={0} id="b" label="Churning sea (storm + swirl)">
          <ChurnSea f={f} cam={CAM0} storm={0.6} swirl={1} />
          <g transform="translate(540 1270) scale(0.6)">
            <Mandar t={f} glow={0.6} />
          </g>
        </Panel>
        <Panel x={0} y={960} id="c" label="Under the milk (Kurma)">
          <UnderMilk f={f} cam={CAM0} />
          <g transform="translate(540 1250) scale(0.8)">
            <KurmaGlow id="st" t={f} glow={1} eye={0.8} />
          </g>
        </Panel>
        <Panel x={540} y={960} id="d" label="Bali's court (Episode 1)">
          <AsuraCourt f={f} cam={CAM0} />
        </Panel>
      </svg>
    </AbsoluteFill>
  );
};
