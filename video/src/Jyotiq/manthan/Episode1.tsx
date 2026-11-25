import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { BrandBug, Captions, EndCard, NameCard, TitleCard } from "./graphics";
import { fadeIn, inRange, Range } from "./kit";
import { Hook, KundaliScene, TitleScene } from "./scenesA";
import { SwarbhanuPlant, Swargaloka } from "./scenesB";
import { CourtCliff, EndBed, KsheerPlan } from "./scenesC";
import { P, ramp } from "./style";
import { CUES, SCENES, TOTAL } from "./timing";

/* Jyotiq "Manthan" Episode 1 - Shraap. One clock (timing.ts, generated with
   the audio mix). Scenes overlap by x frames and cross-dissolve; HTML
   overlays (cards, captions, brand) sit above the world. */

export const EP1_TOTAL = TOTAL;

const SCENE_LIST: { r: Range; x: number; C: React.FC<{ f: number }> }[] = [
  { r: SCENES.hook, x: 0, C: Hook },
  { r: SCENES.kundali, x: 8, C: KundaliScene },
  { r: SCENES.title, x: 10, C: TitleScene },
  { r: [SCENES.swarga[0], SCENES.invasion[1]], x: 14, C: Swargaloka },
  { r: SCENES.swarbhanu, x: 12, C: SwarbhanuPlant },
  { r: [SCENES.ksheer[0], SCENES.plan[1]], x: 16, C: KsheerPlan },
  { r: [SCENES.court[0], SCENES.end[0] + 12], x: 10, C: CourtCliff },
  { r: [SCENES.end[0] + 12, SCENES.end[1]], x: 10, C: EndBed },
];

export type Episode1Props = { audio?: boolean; endCard?: { v2?: boolean; cta?: number } };

export const ManthanEp1: React.FC<Episode1Props> = ({ audio = true, endCard = {} }) => {
  const f = useCurrentFrame();
  const capY = f >= 140 && f < 206 ? 1470 : f >= SCENES.ksheer[0] && f < SCENES.plan[1] ? 1520 : 1300;
  const brand =
    1 - ramp(f, SCENES.title[0] - 6, SCENES.title[0]) + ramp(f, SCENES.title[1], SCENES.title[1] + 10) - ramp(f, SCENES.end[0] - 10, SCENES.end[0]);
  return (
    <AbsoluteFill style={{ background: P.jNight }}>
      {SCENE_LIST.map(({ r, x, C }, i) =>
        inRange(f, r, x, 14) ? (
          <AbsoluteFill key={i} style={{ opacity: fadeIn(f, r, x) }}>
            <C f={f} />
          </AbsoluteFill>
        ) : null,
      )}
      <NameCard f={f} at={CUES.nameCard} out={200} name="SWARBHANU" deva="स्वर्भानु" tag="Woh asur jisne Vishnu ko chhala" y={1030} />
      <TitleCard f={f} at={SCENES.title[0] - 6} out={SCENES.title[1] - 4} />
      <Captions f={f} y={capY} />
      <EndCard f={f} at={CUES.endCard} {...endCard} />
      <BrandBug o={Math.max(0, Math.min(1, brand))} />
      {audio ? <Audio src={staticFile("jyotiq/manthan/mix.wav")} /> : null}
    </AbsoluteFill>
  );
};
