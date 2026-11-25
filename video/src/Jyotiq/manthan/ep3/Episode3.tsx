import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { BrandBug, NameCard } from "../graphics";
import { fadeIn, inRange, Range } from "../kit";
import { P, ramp } from "../style";
import { BEATS, CUES, SCENES, TOTAL } from "./timing";
import { Captions3, EndCard3, HookText, TitleCard3 } from "./gfx3";
import { ColdOpen, KurmaTalk, Reveal, Stop, TitleBed } from "./scenes3a";
import { BaliCall, Churn, Hold, Realise, Smoke, Split, VasukiFire } from "./scenes3b";
import { Boil, Cliff, EndBed3, Halahala, Rise } from "./scenes3c";

/* Jyotiq "Manthan" Episode 3 - Kurma. One clock (timing.ts, generated with the audio mix by
   scripts/manthan_ep3_audio.py). Scenes overlap by x frames and cross-dissolve; HTML overlays
   (hook, cards, captions, brand) sit above the world. Built up scene by scene. */

export const EP3_TOTAL = TOTAL;

const SCENE_LIST: { r: Range; x: number; C: React.FC<{ f: number }> }[] = [
  { r: SCENES.cold, x: 0, C: ColdOpen },
  { r: SCENES.title, x: 8, C: TitleBed },
  { r: SCENES.stop, x: 6, C: Stop },
  { r: SCENES.reveal, x: 8, C: Reveal },
  { r: SCENES.kurma, x: 8, C: KurmaTalk },
  { r: SCENES.bali, x: 4, C: BaliCall },
  { r: SCENES.churn, x: 6, C: Churn },
  { r: SCENES.vasuki, x: 4, C: VasukiFire },
  { r: SCENES.smoke, x: 4, C: Smoke },
  { r: SCENES.split, x: 6, C: Split },
  { r: SCENES.realise, x: 4, C: Realise },
  { r: SCENES.hold, x: 4, C: Hold },
  { r: SCENES.boil, x: 6, C: Boil },
  { r: SCENES.rise, x: 6, C: Rise },
  { r: SCENES.halahala, x: 4, C: Halahala },
  { r: SCENES.cliff, x: 8, C: Cliff },
  { r: SCENES.end, x: 0, C: EndBed3 },
];

export const ManthanEp3: React.FC = () => {
  const f = useCurrentFrame();
  const brand =
    1 - ramp(f, SCENES.title[0] - 6, SCENES.title[0]) + ramp(f, SCENES.title[1], SCENES.title[1] + 10) - ramp(f, SCENES.end[0] - 10, SCENES.end[0]);
  // captions sit lower where the subject fills the middle of the frame
  const inS = (k: keyof typeof SCENES) => f >= SCENES[k][0] && f < SCENES[k][1];
  const capY = inS("reveal")
    ? 1560
    : inS("kurma")
      ? 1620
      : inS("churn") || inS("vasuki") || inS("split")
        ? 1500
        : inS("cliff")
          ? f < CUES.kailash
            ? 360 // the falling drop and the three lokas fill the middle
            : 1520 // keep the throat glow on Kailash clear
          : 1300;
  return (
    <AbsoluteFill style={{ background: P.jNight }}>
      {SCENE_LIST.map(({ r, x, C }, i) =>
        inRange(f, r, x, 14) ? (
          <AbsoluteFill key={i} style={{ opacity: fadeIn(f, r, x) }}>
            <C f={f} />
          </AbsoluteFill>
        ) : null,
      )}
      <HookText f={f} out={BEATS.title[0]} />
      <TitleCard3 f={f} at={SCENES.title[0] - 6} out={SCENES.title[1] - 4} />
      <NameCard f={f} at={CUES.kurmaName} out={CUES.kurmaName + 75} name="KURMA" deva="कूर्म" tag="विष्णु का दूसरा अवतार" y={360} />
      <Captions3 f={f} y={capY} />
      <EndCard3 f={f} at={CUES.endCard} />
      <BrandBug o={Math.max(0, Math.min(1, brand))} />
      <Audio src={staticFile("jyotiq/manthan/ep3/mix.wav")} />
    </AbsoluteFill>
  );
};
