import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { BrandBug, NameCard } from "../graphics";
import { fadeIn, inRange, Range } from "../kit";
import { RigDefs } from "../rig";
import { SetDefs } from "../sets";
import { H, P, ramp, W } from "../style";
import { AlertRing7, AsurMeter7, Captions7, EndCard7, EndKundali7, HookPlate7, Jawab7, ThroatChip7, TitleCard7 } from "./gfx7";
import { cue7, span7 } from "./kit7";
import { Hook7, TitleBed7 } from "./scenes7a";
import { AlertScene7, PourScene7, RowScene7 } from "./scenes7b";
import { ChakraScene7, MeltScene7 } from "./scenes7c";
import { ImmortalScene7, SplitScene7, VowScene7 } from "./scenes7d";
import { ChaseScene7, EndBed7 } from "./scenes7e";
import { BEATS, LINES, SCENES, TOTAL } from "./timing";

/* Jyotiq "Manthan" Episode 7 - Rahu. One clock (timing.ts, generated with the audio mix by
   scripts/manthan_ep7_audio.py; until then the placeholder art-test timing). Scenes overlap and
   cross-dissolve exactly as Episode 6 does; HTML overlays (hook plate, meter, chips, cards, captions,
   brand) sit above the world, and the kundali chart has its own svg layer. Native 1080x1920 (scale 1).
   The mix is only attached once the real takes exist (LINES is empty on the placeholder timing). */

export const EP7_TOTAL = TOTAL;

const S = (k: string, d: Range): Range => span7(SCENES, k, d) as Range;
const B = (k: string, d: Range): Range => span7(BEATS, k, d) as Range;
const join = (a: Range, b: Range): Range => [a[0], Math.max(a[1], b[1])];

const HOOK = S("hook", [0, 120]);
const TITLE = S("title", [120, 150]);
const ROW = S("row", [150, 270]);
const POUR = join(S("pour", [270, 390]), B("sip", [378, 390]));
const ALERT = S("alert", [390, 480]);
const MELT = B("melt", [480, 494]);
const CHAKRA = join(S("chakra", [494, 590]), B("whiteout", [590, 600]));
const IMMORTAL = S("immortal", [600, 700]);
const SPLIT = S("split", [700, 800]);
const VOW = S("vow", [800, 880]);
const CHASE = join(S("chase", [880, 1010]), B("totality", [1010, 1026]));
const KUNDALI = S("kundali", [1030, 1150]);
const END = join(KUNDALI, S("end", [1150, 1320]));
const SIP = B("sip", [378, 390]);
const TOTALITY = B("totality", [1010, 1026]);
const REWIND = B("rewind", [120, 144]);

const SCENE_LIST: { r: Range; x: number; C: React.FC<{ f: number }> }[] = [
  { r: HOOK, x: 0, C: Hook7 },
  { r: TITLE, x: 6, C: TitleBed7 },
  { r: ROW, x: 4, C: RowScene7 },
  { r: POUR, x: 4, C: PourScene7 },
  { r: ALERT, x: 4, C: AlertScene7 },
  { r: MELT, x: 2, C: MeltScene7 },
  { r: CHAKRA, x: 2, C: ChakraScene7 },
  { r: IMMORTAL, x: 0, C: ImmortalScene7 }, // cut on white: the chakra's whiteout hands over to scene 6's white
  { r: SPLIT, x: 4, C: SplitScene7 },
  { r: VOW, x: 4, C: VowScene7 },
  { r: CHASE, x: 4, C: ChaseScene7 },
  { r: END, x: 4, C: EndBed7 },
];

/** Caption top per scene: low where faces fill the middle (Episode 6 used 1500); the hook plate and the end card
 *  carry lines 01 and 10, which have no captions. */
const CAP_Y: { r: Range; y: number }[] = [
  { r: [ROW[0], VOW[1]], y: 1500 },
  { r: CHASE, y: 1540 },
];

export const ManthanEp7: React.FC = () => {
  const f = useCurrentFrame();
  const capY = CAP_Y.find(({ r }) => f >= r[0] && f < r[1])?.y ?? 1500;
  const brand = 1 - ramp(f, TITLE[0] - 6, TITLE[0]) + ramp(f, TITLE[1], TITLE[1] + 10) - ramp(f, KUNDALI[0] - 10, KUNDALI[0]);
  const svarbhanu = cue7("svarbhanu", 235);
  const asurHai = cue7("asurHai", 455);
  const rahu07 = cue7("rahu07", 718);
  const ketu07 = cue7("ketu07", 770);
  const nigalta = cue7("nigalta", 960);
  const hasMix = Object.keys(LINES).length > 0;
  return (
    <AbsoluteFill style={{ background: P.jNight }}>
      {SCENE_LIST.map(({ r, x, C }, i) =>
        inRange(f, r, x, 14) ? (
          <AbsoluteFill key={i} style={{ opacity: fadeIn(f, r, x) }}>
            <C f={f} />
          </AbsoluteFill>
        ) : null,
      )}
      {f >= KUNDALI[0] - 12 ? (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
          <RigDefs />
          <SetDefs />
          <EndKundali7 f={f} at={KUNDALI[0]} />
        </svg>
      ) : null}
      <HookPlate7 f={f} out={HOOK[1]} />
      <TitleCard7 f={f} at={cue7("titleHit", REWIND[0] + 6) - 6} out={TITLE[1]} />
      <NameCard f={f} at={svarbhanu + 2} out={Math.min(svarbhanu + 60, ROW[1] - 2)} name="SVARBHANU" deva="स्वर्भानु" tag="देवताओं में छिपा असुर" y={360} />
      <AsurMeter7 f={f} at={ROW[0] + 8} flip={SIP[0]} out={MELT[1]} />
      <ThroatChip7 f={f} at={SIP[0] + 4} out={ALERT[0] + 40} x={330} y={760} />
      <AlertRing7 f={f} at={asurHai - 2} out={MELT[1]} x={540} y={1217} r={200} labelTop={900} />
      <NameCard f={f} at={rahu07 + 2} out={ketu07 - 4} name="RAHU" deva="राहु" tag="सिर · छाया ग्रह" y={360} />
      <NameCard f={f} at={ketu07 + 2} out={SPLIT[1]} name="KETU" deva="केतु" tag="धड़ · छाया ग्रह" y={360} />
      <Jawab7 f={f} at={nigalta - 10} answer={TOTALITY[0]} out={KUNDALI[0] + 10} />
      <Captions7 f={f} y={capY} />
      <EndCard7 f={f} at={KUNDALI[0] + 18} />
      <BrandBug o={Math.max(0, Math.min(1, brand))} />
      {hasMix ? <Audio src={staticFile("jyotiq/manthan/ep7/mix.wav")} /> : null}
    </AbsoluteFill>
  );
};
