import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { BrandBug, NameCard } from "../graphics";
import { fadeIn, inRange, Range } from "../kit";
import { RigDefs } from "../rig";
import { SetDefs } from "../sets";
import { H, P, ramp, W } from "../style";
import { BEATS, CUES, SCENES, TOTAL } from "./timing";
import { AskAnswer5, Captions5, EndCard5, EndKundali5, HookPoll5, TitleCard5, Toasts5, XTag } from "./gfx5";
import { Hook5, TitleBed5 } from "./scenes5a";
import { HorseScene, RatnaScene } from "./scenes5b";
import { AiravataScene, KaustubhaScene } from "./scenes5c";
import { ChoiceScene, LotusScene, XTAGS } from "./scenes5d";
import { EndBed5, VarmalaScene, VishnuScene } from "./scenes5e";

/* Jyotiq "Manthan" Episode 5 - Lakshmi. One clock (timing.ts, generated with the audio mix by
   scripts/manthan_ep5_audio.py). Scenes overlap by x frames and cross-dissolve; HTML overlays
   (hook poll, toasts, cards, captions, brand) sit above the world. Native 1080x1920 (scale 1). */

export const EP5_TOTAL = TOTAL;

const SCENE_LIST: { r: Range; x: number; C: React.FC<{ f: number }> }[] = [
  { r: SCENES.hook, x: 0, C: Hook5 },
  { r: SCENES.title, x: 6, C: TitleBed5 },
  { r: SCENES.ratna, x: 6, C: RatnaScene },
  { r: SCENES.horse, x: 4, C: HorseScene },
  { r: SCENES.airavata, x: 4, C: AiravataScene },
  { r: SCENES.kaustubha, x: 4, C: KaustubhaScene },
  { r: SCENES.lotus, x: 6, C: LotusScene },
  { r: SCENES.choice, x: 4, C: ChoiceScene },
  { r: SCENES.vishnu, x: 6, C: VishnuScene },
  { r: SCENES.varmala, x: 4, C: VarmalaScene },
  { r: SCENES.end, x: 10, C: EndBed5 },
];

/** Caption height per scene: lower where faces fill the middle of the frame. */
const CAP_Y: Partial<Record<keyof typeof SCENES, number>> = { lotus: 175, choice: 1500, vishnu: 1500, varmala: 1500 };

export const ManthanEp5: React.FC = () => {
  const f = useCurrentFrame();
  const brand =
    1 - ramp(f, SCENES.title[0] - 6, SCENES.title[0]) + ramp(f, SCENES.title[1], SCENES.title[1] + 10) - ramp(f, SCENES.end[0] - 10, SCENES.end[0]);
  const scene = (Object.keys(SCENES) as (keyof typeof SCENES)[]).find((k) => f >= SCENES[k][0] && f < SCENES[k][1]);
  const capY = (scene && CAP_Y[scene]) ?? 1300;
  return (
    <AbsoluteFill style={{ background: P.jNight }}>
      {SCENE_LIST.map(({ r, x, C }, i) =>
        inRange(f, r, x, 14) ? (
          <AbsoluteFill key={i} style={{ opacity: fadeIn(f, r, x) }}>
            <C f={f} />
          </AbsoluteFill>
        ) : null,
      )}
      {f >= CUES.endCard ? (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
          <RigDefs />
          <SetDefs />
          <EndKundali5 f={f} at={CUES.endCard} />
        </svg>
      ) : null}
      <HookPoll5 f={f} out={BEATS.title[0]} />
      <TitleCard5 f={f} at={SCENES.title[0] - 6} out={SCENES.title[1] - 4} />
      <Toasts5 f={f} end={SCENES.lotus[0]} />
      <NameCard f={f} at={CUES.lakshmi + 4} out={CUES.lakshmi + 72} name="LAKSHMI" deva="लक्ष्मी" tag="समृद्धि की देवी" y={360} />
      <AskAnswer5 f={f} at={SCENES.choice[0] + 6} answer={CUES.answer} out={SCENES.end[0]} />
      {XTAGS.map((t, i) => (
        <XTag key={i} f={f} {...t} />
      ))}
      <Captions5 f={f} y={capY} />
      <EndCard5 f={f} at={CUES.endCard} />
      <BrandBug o={Math.max(0, Math.min(1, brand))} />
      <Audio src={staticFile("jyotiq/manthan/ep5/mix.wav")} />
    </AbsoluteFill>
  );
};
