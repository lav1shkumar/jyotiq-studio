import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { RigDefs } from "../rig";
import { CAM0, KshiraSagar, SetDefs } from "../sets";
import { H, W } from "../style";
import { CUES, SCENES } from "./timing";
import {
  AskAnswer6, Captions6, ClueCircles6, DropMeters6, EndCard6, EndKundali6, HookPlate6, KalashTracker6, TitleCard6,
} from "./gfx6";

/* Graphics check for Episode 6: test frame i shows the overlays exactly as at reel frame GFX6_AT[i]
   (over a plain dark sea, so text contrast and placement can be judged on their own). */
export const GFX6_AT = [10, 230, 300, 700, 1045, 1100, 1200, 1500, 1700];

// placeholder clue spots for Mohini centred at x 540 (the enchanted scene sets the real ones)
const CLUES = [
  { x: 650, y: 990, r: 46, label: "नीला रंग" },
  { x: 470, y: 1290, r: 60, label: "पीताम्बर", dx: -260 },
  { x: 540, y: 1030, r: 34, label: "कौस्तुभ", dx: 50, dy: 30 },
];

export const ManthanEp6GfxTest: React.FC = () => {
  const i = useCurrentFrame();
  const f = GFX6_AT[Math.min(i, GFX6_AT.length - 1)];
  const deva = Math.max(0, Math.min(5, Math.floor((f - CUES.pour) / 6)));
  return (
    <AbsoluteFill style={{ background: "#0C1028" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <RigDefs />
        <SetDefs />
        <KshiraSagar f={f} cam={CAM0} glow={0.3} />
        {f >= SCENES.end[0] ? <EndKundali6 f={f} at={CUES.rahu + 40} /> : null}
      </svg>
      <HookPlate6 f={f} out={SCENES.hook[1]} />
      <TitleCard6 f={f} at={CUES.titleHit - 6} out={SCENES.title[1]} />
      <KalashTracker6 f={f} out={CUES.mohit - 4} />
      <AskAnswer6 f={f} at={CUES.mohit} answer={CUES.vishnu} out={SCENES.reveal[1] - 4} />
      <ClueCircles6 f={f} at={CUES.kaun} out={SCENES.enchanted[1]} clues={CLUES} />
      <DropMeters6 f={f} at={SCENES.amrit[0] + 6} out={SCENES.rahu[1]} deva={deva} asura={f >= CUES.chupke ? "1?" : "0"} flicker={f >= CUES.chupke ? 1 : 0} />
      <Captions6 f={f} />
      <EndCard6 f={f} at={CUES.rahu + 12} />
    </AbsoluteFill>
  );
};
