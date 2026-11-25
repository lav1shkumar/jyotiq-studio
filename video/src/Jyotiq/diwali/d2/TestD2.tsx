import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { RigDefs } from "../../manthan/rig";
import { SetDefs } from "../../manthan/sets";
import { H, W } from "../../manthan/style";
import { CounterDefs } from "../d1/counter";
import { DiyaDefs } from "../d1/diya";
import { MarketDefs } from "../d1/market";
import { BrideThali, Couple, Doorstep, Palace } from "./sets2";
import { KaalWheel, Serpent } from "./serpent";

/* Diwali Day 2 art test (stills only, not part of the reel).
   Frames 0-29: the hook's doorstep with the chaumukha diya. 30-59: the palace with the couple (02).
   60-89: the palace with its lamps lit, the gold at the threshold and the bride with her thali (03). */

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    <RigDefs />
    <SetDefs />
    <DiyaDefs />
    <CounterDefs />
    <MarketDefs />
    {children}
  </svg>
);

export const DiwaliD2Test: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0C0A07" }}>
      <Svg>
        {f < 30 ? <Doorstep f={f} push={0} /> : null}
        {f >= 30 && f < 60 ? (
          <g>
            <Palace f={f} />
            <g transform="translate(540 1300) scale(0.9)">
              <Couple f={f} />
            </g>
          </g>
        ) : null}
        {f >= 60 && f < 90 ? (
          <g>
            <Palace f={f} lampsAt={30} gold={1} />
            <g transform="translate(250 1420) scale(0.85)">
              <BrideThali f={f} />
            </g>
          </g>
        ) : null}
        {f >= 90 ? (
          <g>
            <clipPath id="t2Top">
              <rect x={0} y={0} width={W} height={1100} />
            </clipPath>
            <g clipPath="url(#t2Top)">
              <g transform="translate(0 -300)">
                <Palace f={f} lampsAt={0} gold={1} />
                <Serpent f={f} x={560} y={1370} glide={1} coil={0.65} squint={0.8} s={0.8} />
              </g>
            </g>
            <rect x={0} y={1100} width={W} height={820} fill="#0C0A1C" />
            <g transform="translate(540 1510) scale(0.95)">
              <KaalWheel f={f} k={1} />
            </g>
          </g>
        ) : null}
      </Svg>
    </AbsoluteFill>
  );
};
