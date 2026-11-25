import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { BrandBug, NameCard } from "../graphics";
import { fadeIn, inRange, Range } from "../kit";
import { RigDefs } from "../rig";
import { SetDefs } from "../sets";
import { H, P, ramp, W } from "../style";
import { CUES, SCENES, TOTAL } from "./timing";
import {
  AskAnswer6, Captions6, ClueCircles6, DropMeters6, EndCard6, EndKundali6, HookPlate6, KalashTracker6, TitleCard6,
} from "./gfx6";
import {
  AmritScene, AskScene, BaliScene, BrawlScene, DhanvantariScene, EnchantedScene, EndBed6, Hook6, MohiniScene, RahuScene,
  RevealScene, TitleBed6,
} from "./scenes6";
import { CLUE_ASK_Y, CLUES } from "./layout6";

/* Jyotiq "Manthan" Episode 6 - Mohini. One clock (timing.ts, generated with the audio mix by
   scripts/manthan_ep6_audio.py). Scenes overlap by x frames and cross-dissolve; HTML overlays
   (hook plate, tracker, cards, captions, brand) sit above the world. Native 1080x1920 (scale 1). */

export const EP6_TOTAL = TOTAL;

const SCENE_LIST: { r: Range; x: number; C: React.FC<{ f: number }> }[] = [
  { r: SCENES.hook, x: 0, C: Hook6 },
  { r: SCENES.title, x: 6, C: TitleBed6 },
  { r: SCENES.dhanvantari, x: 6, C: DhanvantariScene },
  { r: SCENES.bali, x: 4, C: BaliScene },
  { r: SCENES.brawl, x: 4, C: BrawlScene },
  { r: SCENES.mohini, x: 2, C: MohiniScene },
  { r: SCENES.ask, x: 4, C: AskScene },
  { r: SCENES.enchanted, x: 4, C: EnchantedScene },
  { r: SCENES.reveal, x: 4, C: RevealScene },
  { r: SCENES.amrit, x: 6, C: AmritScene },
  { r: SCENES.rahu, x: 6, C: RahuScene },
  { r: SCENES.end, x: 8, C: EndBed6 },
];

/** Caption height per scene: low where faces and the tracker/name cards fill the top and middle. */
const CAP_Y: Partial<Record<keyof typeof SCENES, number>> = {
  mohini: 1500, ask: 1500, enchanted: 1500, reveal: 1500, amrit: 1500, rahu: 1500,
};

export const ManthanEp6: React.FC = () => {
  const f = useCurrentFrame();
  const brand =
    1 - ramp(f, SCENES.title[0] - 6, SCENES.title[0]) + ramp(f, SCENES.title[1], SCENES.title[1] + 10) - ramp(f, SCENES.end[0] - 10, SCENES.end[0]);
  const scene = (Object.keys(SCENES) as (keyof typeof SCENES)[]).find((k) => f >= SCENES[k][0] && f < SCENES[k][1]);
  const capY = (scene && CAP_Y[scene]) ?? 1300;
  const deva = Math.max(0, Math.min(5, Math.floor((f - CUES.amrit08) / 7)));
  const endAt = CUES.rahu + 36;
  return (
    <AbsoluteFill style={{ background: P.jNight }}>
      {SCENE_LIST.map(({ r, x, C }, i) =>
        inRange(f, r, x, 14) ? (
          <AbsoluteFill key={i} style={{ opacity: fadeIn(f, r, x) }}>
            <C f={f} />
          </AbsoluteFill>
        ) : null,
      )}
      {f >= CUES.kundali - 12 ? (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
          <RigDefs />
          <SetDefs />
          <EndKundali6 f={f} at={CUES.kundali - 12} />
        </svg>
      ) : null}
      <HookPlate6 f={f} out={SCENES.hook[1]} />
      <TitleCard6 f={f} at={CUES.titleHit - 6} out={SCENES.title[1]} />
      <KalashTracker6 f={f} out={CUES.mohit - 4} />
      <NameCard f={f} at={CUES.dhanvantari + 4} out={CUES.dhanvantari + 66} name="DHANVANTARI" deva="धन्वंतरि" tag="आयुर्वेद के देवता" y={360} />
      <NameCard f={f} at={CUES.mohini + 4} out={CUES.mohini + 64} name="MOHINI" deva="मोहिनी" tag="मोह लेने वाली" y={360} />
      <AskAnswer6 f={f} at={CUES.mohit} answer={CUES.vishnu} out={SCENES.reveal[1] - 4} />
      <ClueCircles6 f={f} at={CUES.kaun} out={SCENES.enchanted[1]} clues={CLUES} askY={CLUE_ASK_Y} />
      <DropMeters6 f={f} at={CUES.amrit08} out={SCENES.rahu[1]} deva={deva} asura={f >= CUES.chupke ? "1?" : "0"} flicker={f >= CUES.chupke ? 1 : 0} />
      <NameCard f={f} at={CUES.rahu + 2} out={CUES.rahu + 40} name="RAHU" deva="राहु" tag="छाया ग्रह" y={360} />
      <Captions6 f={f} y={capY} />
      <EndCard6 f={f} at={endAt} />
      <BrandBug o={Math.max(0, Math.min(1, brand))} />
      <Audio src={staticFile("jyotiq/manthan/ep6/mix.wav")} />
    </AbsoluteFill>
  );
};
