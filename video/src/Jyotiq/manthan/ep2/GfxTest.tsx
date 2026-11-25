import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { RigDefs } from "../rig";
import { CAM0, SetDefs } from "../sets";
import { H, W } from "../style";
import { RahuHead } from "./beings3";
import { Captions2, EndCard2, RahuStamp, SandhiArt, TitleCard2 } from "./graphics2";
import { ChurnSea } from "./sets2";
import { BEATS, CUES } from "./timing";

/* Review still: Episode 2 graphics at half size, each panel frozen at the frame it is used (not in the reel). */
const Half: React.FC<{ x: number; y: number; bg: string; children: React.ReactNode }> = ({ x, y, bg, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: W, height: H, transform: "scale(0.5)", transformOrigin: "0 0", overflow: "hidden", background: bg }}>
    {children}
  </div>
);

export const ManthanEp2GfxTest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Half x={0} y={0} bg="linear-gradient(#0E0A1C, #24163F)">
        <TitleCard2 f={BEATS.title[0] + 34} at={BEATS.title[0]} out={BEATS.title[1]} />
      </Half>
      <Half x={540} y={0} bg="#000">
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <RigDefs />
          <SetDefs />
          <ChurnSea f={f} cam={CAM0} storm={0.3} />
          <SandhiArt f={f} d={1} x={540} y={640} />
        </svg>
        <Captions2 f={CUES.clasp + 10} y={1300} />
      </Half>
      <Half x={0} y={960} bg="linear-gradient(#0E0A1C, #1A1240 60%, #0C0A07)">
        <EndCard2 f={CUES.offer + 24} at={CUES.endCard} />
      </Half>
      <Half x={540} y={960} bg="linear-gradient(#0E0A1C, #1A1240)">
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <RigDefs />
          <circle cx={540} cy={640} r={230} fill="#FFB23D" opacity={0.3} filter="url(#mBlur8)" />
          <circle cx={540} cy={640} r={200} fill="#0A0612" stroke="#FFD27A" strokeWidth={5} />
          <RahuHead id="g4" at={{ x: 540, y: 670 }} s={1.4} t={f} p={{ smile: 0.9, browTilt: 8, lookX: 0.2 }} />
          <RahuStamp f={CUES.rahuSlam + 14} at={CUES.rahuSlam} x={540} y={1080} />
        </svg>
        <Captions2 f={CUES.rahuStamp + 6} y={1340} />
      </Half>
    </AbsoluteFill>
  );
};
