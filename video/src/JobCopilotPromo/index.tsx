import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import {
  CloseScene,
  DiscoverScene,
  HookScene,
  HumanClickScene,
  PrefillScene,
  ProblemScene,
  RankScene,
  SceneProps,
} from "./scenes";
import { C, FADE, JobCopilotProps, TOTAL_FRAMES } from "./theme";
import { SceneFrame } from "./ui";

export { jobCopilotSchema } from "./theme";
export type { JobCopilotProps } from "./theme";

type SceneDef = { name: string; start: number; len: number; Component: React.FC<SceneProps> };

// Scene boundaries at 30 fps. Each scene (except the last) runs FADE frames past
// its end so it cross-fades with the next scene, which starts exactly on time.
const SCENES: SceneDef[] = [
  { name: "1 Hook", start: 0, len: 120, Component: HookScene },
  { name: "2 Problem", start: 120, len: 180, Component: ProblemScene },
  { name: "3 Discover", start: 300, len: 300, Component: DiscoverScene },
  { name: "4 Rank", start: 600, len: 300, Component: RankScene },
  { name: "5 Prefill", start: 900, len: 420, Component: PrefillScene },
  { name: "6 Human click", start: 1320, len: 240, Component: HumanClickScene },
  { name: "7 Close", start: 1560, len: 240, Component: CloseScene },
];

const last = SCENES[SCENES.length - 1];
if (last.start + last.len !== TOTAL_FRAMES) {
  throw new Error(`Scene timeline ends at ${last.start + last.len}, expected ${TOTAL_FRAMES}`);
}

export const JobCopilotPromo: React.FC<JobCopilotProps> = (props) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        backgroundImage:
          "radial-gradient(circle at 12% 8%, rgba(99,102,241,0.20), transparent 42%)," +
          "radial-gradient(circle at 92% 92%, rgba(34,211,238,0.13), transparent 45%)",
      }}
    >
      {SCENES.map(({ name, start, len, Component }, i) => {
        const isLast = i === SCENES.length - 1;
        const dur = len + (isLast ? 0 : FADE);
        return (
          <Sequence key={name} name={name} from={start} durationInFrames={dur}>
            <SceneFrame durationInFrames={dur} fadeIn={i > 0} fadeOut={!isLast}>
              <Component dur={dur} p={props} />
            </SceneFrame>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
