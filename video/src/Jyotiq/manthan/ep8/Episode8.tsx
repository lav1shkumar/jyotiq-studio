import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { BrandBug, NameCard } from "../graphics";
import { fadeIn, inRange, Range } from "../kit";
import { RigDefs } from "../rig";
import { SetDefs } from "../sets";
import { H, P, ramp, W } from "../style";
import { CUES, LINES, SCENES, TOTAL } from "./timing";
import { Captions8, Chip8, ClueRing8, EndCard8, EndKundali8, HookPlate8, Jawab8, TitleCard8 } from "./gfx8";
import { Hook8, TitleBed8 } from "./scenes8a";
import { ReplayScene8, RahuScene8, SplitScene8, WanderScene8 } from "./scenes8b";
import { AnswerScene8, BrahmaScene8, EndBed8, KetuScene8, PairScene8 } from "./scenes8c";

/* Jyotiq "Manthan" Episode 8 - Ketu. One clock (timing.ts, generated with the audio mix by
   scripts/manthan_ep8_audio.py). Scenes overlap by x frames and cross-dissolve; HTML overlays
   (hook plate, chips, cards, captions, brand) sit above the world. Native 1080x1920 (scale 1). */

export const EP8_TOTAL = TOTAL;

const SCENE_LIST: { r: Range; x: number; C: React.FC<{ f: number }> }[] = [
  { r: SCENES.hook, x: 0, C: Hook8 },
  { r: SCENES.title, x: 6, C: TitleBed8 },
  { r: SCENES.replay, x: 6, C: ReplayScene8 },
  { r: SCENES.split, x: 4, C: SplitScene8 },
  { r: SCENES.wander, x: 6, C: WanderScene8 },
  { r: SCENES.rahu, x: 4, C: RahuScene8 },
  { r: SCENES.ketu, x: 4, C: KetuScene8 },
  { r: SCENES.brahma, x: 6, C: BrahmaScene8 },
  { r: SCENES.pair, x: 6, C: PairScene8 },
  { r: SCENES.answer, x: 6, C: AnswerScene8 },
  { r: SCENES.end, x: 8, C: EndBed8 },
];

/** Caption height per scene, kept clear of faces, chips and name cards (and of the bottom ~250 px). */
const CAP_Y: Partial<Record<keyof typeof SCENES, number>> = {
  replay: 1500, wander: 1050, rahu: 1500, ketu: 300, brahma: 1560, pair: 900, answer: 760,
};

export const ManthanEp8: React.FC = () => {
  const f = useCurrentFrame();
  const brand =
    1 - ramp(f, SCENES.title[0] - 6, SCENES.title[0]) + ramp(f, SCENES.title[1], SCENES.title[1] + 10) - ramp(f, SCENES.end[0] - 10, SCENES.end[0]);
  const scene = (Object.keys(SCENES) as (keyof typeof SCENES)[]).find((k) => f >= SCENES[k][0] && f < SCENES[k][1]);
  const capY = (scene && CAP_Y[scene]) ?? 1300;
  const neckY = 1500 - 218 * 1.3;
  return (
    <AbsoluteFill style={{ background: P.jNight }}>
      {SCENE_LIST.map(({ r, x, C }, i) =>
        inRange(f, r, x, 14) ? (
          <AbsoluteFill key={i} style={{ opacity: fadeIn(f, r, x) }}>
            <C f={f} />
          </AbsoluteFill>
        ) : null,
      )}
      {f >= CUES.kundaliKetu - 12 ? (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
          <RigDefs />
          <SetDefs />
          <EndKundali8 f={f} at={CUES.kundaliKetu - 12} />
        </svg>
      ) : null}
      <HookPlate8 f={f} out={SCENES.hook[1]} />
      <TitleCard8 f={f} at={CUES.titleHit - 6} out={SCENES.title[1]} />
      {/* replay: the clue on the throat */}
      <ClueRing8 f={f} at={CUES.freeze} out={SCENES.replay[1]} x={548} y={neckY} r={92} label="यहीं रुका था अमृत" dx={110} dy={40} />
      {/* split: the drop is shared, then both halves live */}
      <Chip8 f={f} at={CUES.hisson} out={CUES.chips} y={280} text="अमृत ÷ 2" drop />
      <Chip8 f={f} at={CUES.chips} out={SCENES.split[1] - 2} y={280} text="सिर" mark="tick" x={250} />
      <Chip8 f={f} at={CUES.chips + 4} out={SCENES.split[1] - 2} y={280} text="धड़" mark="tick" x={590} />
      {/* wander: no eyes, no hunger */}
      <Chip8 f={f} at={CUES.aankhen} out={SCENES.wander[1] - 2} y={300} x={200} text="आँखें" mark="cross" color="#CFDBF5" border="rgba(159,179,217,0.85)" />
      <Chip8 f={f} at={CUES.bhookh} out={SCENES.wander[1] - 2} y={300} x={600} text="भूख" mark="cross" color="#CFDBF5" border="rgba(159,179,217,0.85)" />
      {/* Brahma names him */}
      <NameCard f={f} at={CUES.ketuName + 2} out={SCENES.brahma[1] + 6} name="KETU" deva="केतु" tag="मोक्ष का ग्रह" y={1300} />
      {/* pair: desire and renunciation */}
      <Chip8 f={f} at={CUES.ichha} out={SCENES.pair[1]} y={720} x={150} text="इच्छा" color="#FFD36B" border="rgba(255,178,61,0.9)" />
      <Chip8 f={f} at={CUES.tyag} out={SCENES.pair[1]} y={1520} x={540} text="त्याग · मोक्ष" color="#EAF1FF" border="rgba(159,179,217,0.9)" />
      <Jawab8 f={f} at={CUES.jaanta - 4} out={SCENES.answer[1] - 10} y={1470} />
      <Captions8 f={f} y={capY} />
      <EndCard8 f={f} at={CUES.endCard} />
      <BrandBug o={Math.max(0, Math.min(1, brand))} />
      <Audio src={staticFile("jyotiq/manthan/ep8/mix.wav")} />
    </AbsoluteFill>
  );
};

// referenced so the line table stays part of this module's contract (end-of-reel loop check uses it)
export const EP8_LAST_LINE_END = LINES["09_narrator"][1];
