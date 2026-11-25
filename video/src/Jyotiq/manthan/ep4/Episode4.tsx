import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { BrandBug, NameCard } from "../graphics";
import { fadeIn, inRange, Range } from "../kit";
import { RigDefs } from "../rig";
import { SetDefs } from "../sets";
import { H, P, ramp, W } from "../style";
import { BEATS, CUES, SCENES, TOTAL } from "./timing";
import { Captions4, EndCard4, EndKundali4, HookAnswer, HookText4, TitleCard4 } from "./gfx4";
import { Hook, TitleBed } from "./scenes4a";
import { Flee, Plea } from "./scenes4b";
import { DrinkScene, PalmScene, ParvatiScene, ShivaScene } from "./scenes4c";
import { DropsScene, NeelkanthScene } from "./scenes4d";
import { ChantScene, EndBed4 } from "./scenes4e";

/* Jyotiq "Manthan" Episode 4 - Neelkanth. One clock (timing.ts, generated with the audio mix by
   scripts/manthan_ep4_audio.py). Scenes overlap by x frames and cross-dissolve; HTML overlays
   (hook, cards, captions, brand) sit above the world. Built up scene by scene. */

export const EP4_TOTAL = TOTAL;

const SCENE_LIST: { r: Range; x: number; C: React.FC<{ f: number }> }[] = [
  { r: SCENES.hook, x: 0, C: Hook },
  { r: SCENES.title, x: 6, C: TitleBed },
  { r: SCENES.flee, x: 6, C: Flee },
  { r: SCENES.plea, x: 6, C: Plea },
  { r: SCENES.shiva, x: 6, C: ShivaScene },
  { r: SCENES.parvati, x: 4, C: ParvatiScene },
  { r: SCENES.palm, x: 6, C: PalmScene },
  { r: SCENES.drink, x: 4, C: DrinkScene },
  { r: SCENES.neelkanth, x: 4, C: NeelkanthScene },
  { r: SCENES.drops, x: 6, C: DropsScene },
  { r: SCENES.chant, x: 4, C: ChantScene },
  { r: SCENES.end, x: 10, C: EndBed4 },
];

export const ManthanEp4: React.FC = () => {
  const f = useCurrentFrame();
  const brand =
    1 - ramp(f, SCENES.title[0] - 6, SCENES.title[0]) + ramp(f, SCENES.title[1], SCENES.title[1] + 10) - ramp(f, SCENES.end[0] - 10, SCENES.end[0]);
  const inS = (k: keyof typeof SCENES) => f >= SCENES[k][0] && f < SCENES[k][1];
  // captions sit lower where faces fill the middle of the frame
  const capY = inS("shiva") || inS("parvati") || inS("neelkanth") ? 1540 : inS("plea") ? 1520 : inS("chant") ? 330 : inS("drops") ? 1560 : 1300;
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
          <EndKundali4 f={f} at={CUES.endCard} />
        </svg>
      ) : null}
      <HookText4 f={f} out={BEATS.title[0]} />
      <TitleCard4 f={f} at={SCENES.title[0] - 6} out={SCENES.title[1] - 4} />
      <HookAnswer f={f} at={CUES.haan} out={SCENES.parvati[1]} />
      <NameCard f={f} at={CUES.neelkanth} out={CUES.neelkanth + 75} name="NEELKANTH" deva="नीलकंठ" tag="जिसने विष को कंठ में रोका" y={360} />
      <Captions4 f={f} y={capY} />
      <EndCard4 f={f} at={CUES.endCard} />
      <BrandBug o={Math.max(0, Math.min(1, brand))} />
      <Audio src={staticFile("jyotiq/manthan/ep4/mix.wav")} />
    </AbsoluteFill>
  );
};
