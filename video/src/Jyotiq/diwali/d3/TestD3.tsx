import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { World } from "../../manthan/kit";
import { CityNight } from "./sets3";

/* Diwali Day 3 art test (stills only): frames 0-29 the city of lamps (tilt 0), 30-59 tilted up into the moonless sky. */
export const DiwaliD3Test: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0C0A07" }}>
      <World>
        <CityNight f={f} tilt={f < 30 ? 0 : 1} />
      </World>
    </AbsoluteFill>
  );
};
