import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { BrandBug, NameCard } from "../graphics";
import { fadeIn, inRange, Range } from "../kit";
import { P, ramp } from "../style";
import { Captions2, EndCard2, TitleCard2 } from "./graphics2";
import { ColdClose, ColdWide, RahuRise, RISE_CUT, TitleBg2 } from "./scenes2A";
import { BaliAccept, BaliHalt, CourtWide, IndraBow, IndraUnarmed, Whisper } from "./scenes2B";
import { SandhiClasp, Uproot } from "./scenes2C";
import { Demand, HeadTake, VasukiCoil, VasukiRise } from "./scenes2D";
import { GripEyes, VishnuSmile } from "./scenes2E";
import { Churn, IndraPanic, SinkWide, SwarSmirk } from "./scenes2F";
import { CLIFF_CUT, CliffDeep, CliffSmile, EndBed2 } from "./scenes2G";
import { CUES, LINES, SCENES, TOTAL } from "./timing";

/* Jyotiq "Manthan" Episode 2 - Sandhi. One clock: ep2/timing.ts, generated together with the
   mix by scripts/manthan_ep2_audio.py. Scenes overlap by x frames and cross-dissolve (x = 0 is
   a hard cut); HTML overlays (cards, captions, brand) sit above the world. */

export const EP2_TOTAL = TOTAL;

const SCENE_LIST: { r: Range; x: number; C: React.FC<{ f: number }> }[] = [
  { r: [0, CUES.pullBack], x: 0, C: ColdClose },
  { r: [CUES.pullBack, RISE_CUT], x: 0, C: ColdWide },
  { r: [RISE_CUT, SCENES.cold[1]], x: 8, C: RahuRise },
  { r: SCENES.title, x: 6, C: TitleBg2 },
  { r: [SCENES.court[0], CUES.unarmed - 3], x: 10, C: CourtWide },
  { r: [CUES.unarmed - 3, CUES.baliHalt], x: 0, C: IndraUnarmed },
  { r: [CUES.baliHalt, 745], x: 0, C: BaliHalt },
  { r: [745, LINES["05_indra"][0]], x: 0, C: CourtWide },
  { r: [LINES["05_indra"][0], LINES["06_swarbhanu"][0]], x: 0, C: IndraBow },
  { r: [LINES["06_swarbhanu"][0], CUES.baliRise], x: 0, C: Whisper },
  { r: [CUES.baliRise, SCENES.court[1]], x: 0, C: BaliAccept },
  { r: SCENES.sandhi, x: 0, C: SandhiClasp },
  { r: SCENES.uproot, x: 0, C: Uproot },
  { r: [SCENES.vasuki[0], 1960], x: 0, C: VasukiRise },
  { r: [1960, SCENES.vasuki[1]], x: 8, C: VasukiCoil },
  { r: SCENES.headTake, x: 0, C: HeadTake },
  { r: [SCENES.demand[0], 2345], x: 0, C: Demand },
  { r: [2345, 2400], x: 0, C: HeadTake }, // reaction: Vishnu calmly holding the head
  { r: [2400, SCENES.demand[1]], x: 0, C: Demand },
  { r: SCENES.smile, x: 0, C: VishnuSmile },
  { r: SCENES.eyes, x: 0, C: GripEyes },
  { r: SCENES.churn, x: 0, C: Churn },
  { r: [SCENES.sink[0], CUES.panic], x: 0, C: SinkWide },
  { r: [CUES.panic, CUES.smirk], x: 0, C: IndraPanic },
  { r: [CUES.smirk, 3040], x: 0, C: SwarSmirk },
  { r: [3040, 3085], x: 0, C: IndraPanic }, // reaction: Indra struggling as he is taunted
  { r: [3085, SCENES.sink[1]], x: 0, C: SwarSmirk },
  { r: [SCENES.cliff[0], CLIFF_CUT], x: 0, C: CliffSmile },
  { r: [CLIFF_CUT, SCENES.cliff[1]], x: 0, C: CliffDeep },
  { r: SCENES.end, x: 12, C: EndBed2 },
];

/** Caption box TOP from each shot's first frame: off faces, and a two-line box (~160 px) ends above y 1670. */
const CAP_Y: [number, number][] = [
  [0, 1300],
  [CUES.pullBack, 1470],
  [RISE_CUT, 1560],
  [SCENES.court[0], 1505],
  [CUES.unarmed - 3, 1420],
  [CUES.baliHalt, 1490],
  [745, 1505],
  [LINES["05_indra"][0], 1480],
  [LINES["06_swarbhanu"][0], 1490],
  [SCENES.sandhi[0], 1500],
  [SCENES.smile[0], 1540],
  [SCENES.eyes[0], 1500],
  [CLIFF_CUT, 1100],
];
const capY = (f: number) => CAP_Y.reduce((y, [at, v]) => (f >= at ? v : y), 1300);

export const ManthanEp2: React.FC = () => {
  const f = useCurrentFrame();
  const t = SCENES.title;
  const brand = 1 - ramp(f, t[0] - 6, t[0]) + ramp(f, t[1], t[1] + 10) - ramp(f, SCENES.end[0] - 10, SCENES.end[0]);
  return (
    <AbsoluteFill style={{ background: P.jNight }}>
      {SCENE_LIST.map(({ r, x, C }, i) =>
        inRange(f, r, x, 14) ? (
          <AbsoluteFill key={i} style={{ opacity: fadeIn(f, r, x) }}>
            <C f={f} />
          </AbsoluteFill>
        ) : null,
      )}
      <TitleCard2 f={f} at={t[0] - 6} out={t[1] - 4} />
      <NameCard f={f} at={CUES.baliHalt} out={737} name="BALI" deva="बलि" tag="असुरराज" y={1180} tagBg="rgba(20,12,36,0.88)" />
      <NameCard f={f} at={CUES.vasukiName} out={1948} name="VASUKI" deva="वासुकि" tag="नागराज" y={1150} tagBg="rgba(20,12,36,0.88)" />
      <Captions2 f={f} y={capY(f)} />
      <EndCard2 f={f} at={CUES.endCard} />
      <BrandBug o={Math.max(0, Math.min(1, brand))} />
      <Audio src={staticFile("jyotiq/manthan/ep2/mix.wav")} />
    </AbsoluteFill>
  );
};
