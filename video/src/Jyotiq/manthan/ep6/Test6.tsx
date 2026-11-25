import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { pose, Puppet, RigDefs } from "../rig";
import { CAM0, Kalash, KshiraSagar, SetDefs } from "../sets";
import { H, W } from "../style";
import { VishnuStanding } from "../ep2/beings3";
import { MohiniStanding } from "./mohini";
import { DhanvantariStanding } from "./dhanvantari";
import { AmritCup, AmritStream, BrawlCloud } from "./props6";
import { CHANDRA, ImpostorSmoke, SURYA, SVARDEVA } from "./cast6";

/*
 * Review sheet for Episode 6's new art.
 * Frames 0-29: Mohini (ask pose: left hand at the waist, right palm held out) beside Vishnu at the same scale.
 * Frames 30-59: close-up on Mohini's face, jasmine bun and the Kaustubha pendant.
 * Frames 60-89: Dhanvantari holding the kalash, the brawl cloud with the kalash on top, cups and the amrit stream.
 * Frames 90-119: the devas' row: Surya, Swarbhanu in deva disguise (smoke at his feet), Chandra; the real
 * Swarbhanu at the far right for comparison.
 */
const ASK: [[number, number], [number, number]] = [[-60, -440], [170, -520]];

export const ManthanEp6Test: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0C1028" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <RigDefs />
        <SetDefs />
        <KshiraSagar f={f} cam={CAM0} glow={0.4} />
        {f >= 90 ? (
          <g>
            <Puppet id="tsu" who={SURYA} at={{ x: 150, y: 1400, s: 0.75, facing: 1 }} p={pose({ smile: 0.5 })} t={f} />
            <g transform="translate(410 1400)">
              <ImpostorSmoke f={f} amount={1} />
            </g>
            <Puppet id="tsv" who={SVARDEVA} at={{ x: 410, y: 1400, s: 0.75, facing: 1 }} p={pose({ smile: 0.3, lookX: 0.6 })} t={f} />
            <Puppet id="tch" who={CHANDRA} at={{ x: 670, y: 1400, s: 0.75, facing: -1 }} p={pose({ smile: 0.4 })} t={f} />
            <Puppet id="tsw" who="swarbhanu" at={{ x: 930, y: 1400, s: 0.75, facing: -1 }} p={pose({})} t={f} />
          </g>
        ) : f >= 60 ? (
          <g>
            <g transform="translate(300 1500) scale(0.62)">
              <DhanvantariStanding t={f} smile={0.5} halo={0.8} handL={[-36, -110]} handR={[36, -110]} />
            </g>
            <g transform="translate(300 1230)">
              <Kalash f={f} glow={1} s={0.42} />
            </g>
            <BrawlCloud x={780} y={1180} s={0.8} f={f}>
              <Kalash f={f} glow={0.8} s={0.8} />
            </BrawlCloud>
            <AmritStream a={[720, 1560]} b={[600, 1712]} t={1} f={f} />
            <AmritCup x={300} y={1760} f={f} fill={0} />
            <AmritCup x={450} y={1760} f={f} fill={0.5} />
            <AmritCup x={600} y={1760} f={f} fill={1} />
          </g>
        ) : f >= 30 ? (
          <MohiniStanding id="tm2" f={f} x={540} y={2050} s={2.2} hands={ASK} openR smile={0.6} lookX={0.3} />
        ) : (
          <g>
            <MohiniStanding id="tm" f={f} x={330} y={1500} s={0.62} hands={ASK} openR smile={0.6} lookX={0.6} />
            <g transform="translate(760 1500) scale(0.62)">
              <VishnuStanding t={f} closed={0} smile={0.4} halo={0.7} />
            </g>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
