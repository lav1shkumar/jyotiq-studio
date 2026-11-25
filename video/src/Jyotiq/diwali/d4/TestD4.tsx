import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { World } from "../../manthan/kit";
import { H, W } from "../../manthan/style";
import { D2Defs } from "../d2/scenesD2a";
import { Storm } from "../shared/fx";
import { AnnakootThali, GovardhanHill } from "./sets4";

/* Diwali Day 4 art test (stills only): frames 0-29 the Annakoot thali, 30-59 the Govardhan hill (same outline, same
   place) under Indra's storm, to check the shape match. */
export const DiwaliD4Test: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0C0A07" }}>
      <World>
        <D2Defs />
        {f < 30 ? (
          <g>
            <rect width={W} height={H} fill="#1A0F0A" />
            <circle cx={540} cy={1100} r={700} fill="url(#d2Flare)" opacity={0.35} />
            <g transform="translate(540 1250)">
              <AnnakootThali f={f} s={1.2} />
            </g>
          </g>
        ) : (
          <g>
            <rect width={W} height={H} fill="#0B0E1C" />
            <Storm f={f} k={0.8} />
            <g transform="translate(540 1250)">
              <GovardhanHill f={f} s={1.2} wet={1} />
            </g>
          </g>
        )}
      </World>
    </AbsoluteFill>
  );
};
