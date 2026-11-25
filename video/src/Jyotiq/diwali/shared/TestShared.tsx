import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { RigDefs } from "../../manthan/rig";
import { SetDefs } from "../../manthan/sets";
import { H, W } from "../../manthan/style";
import { Bansuri, Danda, DeityStanding, KRISHNA, YAMRAJ } from "./deities";
import { DashaTimeline, GocharWheel, HoraDial } from "./charts";
import { DawnSky, DiyaWave, scatter, Storm, TimeRewind } from "./fx";
import { DiyaDefs } from "../d1/diya";
import { Tortoise } from "./tortoise";
import { YamunaStanding } from "./yamuna";

/* Diwali series shared art test (stills only).
   Frames 0-29: Yamraj with his danda, Krishna with his flute, Krishna holding up a hill on his little finger.
   Frames 30-59: Yamuna on her tortoise, by the river. Later shared pieces add their own frame ranges. */

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    <RigDefs />
    <SetDefs />
    {children}
  </svg>
);

export const DiwaliSharedTest: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= 90) {
    return (
      <AbsoluteFill style={{ background: "#0A0818" }}>
        <Svg>
          <DiyaDefs />
          <clipPath id="tsTop">
            <rect x={0} y={0} width={W} height={960} />
          </clipPath>
          <clipPath id="tsBot">
            <rect x={0} y={960} width={W} height={960} />
          </clipPath>
          <g clipPath="url(#tsTop)">
            <DawnSky k={0} />
            <Storm f={f} k={1} flash={f === 100 ? 1 : 0} />
          </g>
          <g clipPath="url(#tsBot)">
            <DawnSky k={(f - 90) / 30} y={1900} />
            <DiyaWave f={f} at={90} points={scatter(24, 80, 1500, 920, 300, "tsw")} step={1} />
            <TimeRewind f={f} k={1} x={540} y={1240} s={0.7} />
          </g>
        </Svg>
      </AbsoluteFill>
    );
  }
  if (f >= 60 && f < 90) {
    const k = Math.min(1, (f - 60) / 12);
    return (
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #0A0818 0%, #1A1236 60%, #24102A 100%)" }}>
        <Svg>
          <g transform="translate(540 430) scale(0.95)">
            <HoraDial f={f} hour={13.4} k={k} />
          </g>
          <g transform="translate(540 1010)">
            <DashaTimeline f={f} marker={0.62} k={k} />
          </g>
          <g transform="translate(540 1520) scale(0.95)">
            <GocharWheel f={f} k={k} />
          </g>
        </Svg>
      </AbsoluteFill>
    );
  }
  if (f >= 30 && f < 60) {
    return (
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #1A2448 0%, #2A3A6A 55%, #10203A 100%)" }}>
        <Svg>
          <g transform="translate(540 1380) scale(0.8)">
            <Tortoise f={f} />
          </g>
          <YamunaStanding id="ytest" f={f} x={520} y={1360} s={0.62} pose="abhaya" halo={0.8} smile={0.55} />
        </Svg>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #2A2240 0%, #0C0A1C 75%)" }}>
      <Svg>
        <g transform="translate(200 1500) scale(0.52)">
          <DeityStanding L={YAMRAJ} t={f} smile={0.45} halo={0.8} handL={[-120, -190]} handR={[150, -120]} inHandR={<Danda />} />
        </g>
        <g transform="translate(540 1500) scale(0.52)">
          <DeityStanding L={KRISHNA} t={f} smile={0.6} speak={0.5} halo={0.8} handL={[-70, -250]} handR={[80, -246]} />
          <g transform="translate(6 -608) rotate(-4)">
            <Bansuri />
          </g>
        </g>
        <g transform="translate(880 1500) scale(0.52)">
          <DeityStanding L={KRISHNA} t={f} smile={0.6} halo={0.8} handL={[-150, -560]} handR={[120, -110]} pinkyL />
        </g>
      </Svg>
    </AbsoluteFill>
  );
};
