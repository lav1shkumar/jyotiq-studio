import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, P, W } from "../../manthan/style";
import { CounterDefs, JewellerCounter } from "./counter";
import { DiyaDefs, DiyaRow } from "./diya";
import { HealthBeat, HealthDefs } from "./health";
import { MarketDefs, MarketStall } from "./market";
import { YamrajDefs, YamrajSilhouette } from "./yamraj";

/* Diwali Day 1 art test (stills only, not part of the reel).
   Frames 0-29: the hook's jeweller's counter (hand in place; the glint grows from frame 10 to 29).
   Frames 30-44: the market stall (the kalash lifts over frames 30-40).
   Frames 45-59: one big lit diya and the five-diya row (diya 1 lit, diya 2 catching, slot 1 highlighted). */

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);

export const DiwaliD1Test: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 30) {
    const glint = f < 10 ? 0.04 : (f - 10) / 19;
    return (
      <AbsoluteFill style={{ background: P.jNight }}>
        <Svg>
          <CounterDefs />
          <JewellerCounter f={f} push={0} reach={1} glint={glint} />
        </Svg>
      </AbsoluteFill>
    );
  }
  if (f < 45) {
    return (
      <AbsoluteFill style={{ background: P.jNight }}>
        <Svg>
          <CounterDefs />
          <MarketDefs />
          <MarketStall f={f} lift={(f - 30) / 10} shine={1} />
        </Svg>
      </AbsoluteFill>
    );
  }
  if (f >= 60) {
    const beat = (f < 70 ? 0 : f < 80 ? 1 : 2) as 0 | 1 | 2;
    return (
      <AbsoluteFill style={{ background: P.jNight }}>
        <Svg>
          <CounterDefs />
          <MarketDefs />
          <HealthDefs />
          <HealthBeat f={f} beat={beat} k={((f - 60) % 10) / 9} />
        </Svg>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 42%, #3A1E10 0%, ${P.night} 72%)` }}>
      <Svg>
        <DiyaDefs />
        <YamrajDefs />
        <g transform="translate(520,1240) scale(1.2)">
          <YamrajSilhouette f={f} k={1} />
        </g>
        <DiyaRow f={f} y={1560} lit={[1, 0, 0, 0, 0]} labels={1} highlight={1} hl={0.6} />
      </Svg>
    </AbsoluteFill>
  );
};
