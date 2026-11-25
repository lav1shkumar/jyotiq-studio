import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { RigDefs } from "../rig";
import { H, W } from "../style";
import { KurmaGlow, RahuHead, VishnuStanding } from "./beings3";

/* Review still: standing Vishnu, Swarbhanu's floating head, Kurma under the milk (not in the reel). */
export const ManthanEp2BeingsTest3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#141B44, #2A2F6A 60%, #0C1230)" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <RigDefs />
        <g transform="translate(300 1210) scale(0.95)">
          <VishnuStanding t={f} smile={0.8} halo={1} handL={[-150, -40]} handR={[150, -60]} />
        </g>
        {/* eclipse behind the head */}
        <circle cx={800} cy={360} r={190} fill="#FFB23D" opacity={0.35} filter="url(#mBlur8)" />
        <circle cx={800} cy={360} r={160} fill="#0A0612" stroke="#FFD27A" strokeWidth={4} />
        <RahuHead id="t3" at={{ x: 800, y: 380 }} s={1.25} t={f} p={{ smile: 0.9, browTilt: 8, lookX: -0.6 }} />
        <g transform="translate(540 1620) scale(0.78)">
          <KurmaGlow id="t3" t={f} glow={1} eye={0.8} />
        </g>
        <rect x={0} y={1400} width={W} height={520} fill="#EEE8F4" opacity={0.5} />
        <path d="M0 1400Q270 1384 540 1400T1080 1400" stroke="#FFFFFF" strokeWidth={6} fill="none" />
      </svg>
    </AbsoluteFill>
  );
};
