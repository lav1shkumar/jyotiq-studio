import React from "react";
import { AbsoluteFill } from "remotion";
import { Cosmos } from "./Cosmos";
import { setCur } from "./theme";

/** Clean 3D art for the pitch deck (no text): "solar" = the opening solar system, "system" = AstroRaaga with its three orbits. */
export const DeckArt: React.FC<{ variant: "solar" | "system" }> = ({ variant }) => {
  setCur("v8usd");
  return (
    <AbsoluteFill style={{ background: variant === "solar" ? "#05040A" : "transparent" }}>
      {variant === "solar" ? <Cosmos mode="open" /> : <Cosmos mode="system" k={{ a: -3, jy: 999, km: 999.5, back: 1000, eng: -2 }} epoch={0} />}
    </AbsoluteFill>
  );
};
