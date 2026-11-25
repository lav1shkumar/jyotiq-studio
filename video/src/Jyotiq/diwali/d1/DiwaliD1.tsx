import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { BrandBug } from "../../manthan/graphics";
import { fadeIn, inRange, Range } from "../../manthan/kit";
import { RigDefs } from "../../manthan/rig";
import { SetDefs } from "../../manthan/sets";
import { H, ramp, W } from "../../manthan/style";
import {
  AppPhoneD1, CaptionsD1, ChipD1, ChipText, EndBrandD1, EndKundaliD1, EndTeaseD1, GoldWordsD1, HookPlateD1, NameCardD1,
  SehatDhanD1, SunAskD1, TitleCardD1,
} from "./gfxD1";
import { HookD1, SeaDiyasD1 } from "./scenesD1a";
import { MarketD1, RiseD1, WordsD1 } from "./scenesD1b";
import { AppBedD1, EndBedD1, HealthD1, KundaliBedD1, RowLayerD1 } from "./scenesD1c";
import { BEATS, CUES, SCENES, TOTAL } from "./timing";

/* Jyotiq Diwali series "पाँच दीये", Day 1 · धनतेरस. One clock: timing.ts, generated with the audio mix by
   scripts/diwali_d1_audio.py from the real takes. Scenes overlap and cross-dissolve as in Manthan Ep6-7; the diya
   row is one persistent layer from 'सेहत' to the last frame; HTML overlays (hook plate, title, name card, chips,
   gold words, captions, phone, end card, brand bug) sit above the world. Native 1080x1920 (scale 1). */

export const D1_TOTAL = TOTAL;
/** Flip to true once scripts/diwali_d1_audio.py has written public/jyotiq/diwali/d1/mix.wav. */
const HAS_MIX = true;

const cue = (k: string, dflt: number): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);
const S = (k: string): Range => SCENES[k] as Range;
const join = (a: Range, b: Range): Range => [a[0], Math.max(a[1], b[1])];

const HOOK = S("hook");
const SEA = join(S("title"), S("diyas"));
const RISE = S("rise");
const MARKET = S("market");
const WORDS = S("words");
const HEALTH = S("health");
const KUNDALI = S("kundali");
const APP = S("app");
const END = S("end");
const IGNITE = BEATS.ignite as Range;

const SCENE_LIST: { r: Range; x: number; C: React.FC<{ f: number }> }[] = [
  { r: HOOK, x: 0, C: HookD1 },
  { r: SEA, x: 0, C: SeaDiyasD1 }, // cut on white: the hook's glint whiteout hands over to the sea's white
  { r: RISE, x: 6, C: RiseD1 },
  { r: MARKET, x: 6, C: MarketD1 }, // match dissolve on the kalash
  { r: WORDS, x: 6, C: WordsD1 },
  { r: HEALTH, x: 4, C: HealthD1 },
  { r: KUNDALI, x: 8, C: KundaliBedD1 },
  { r: APP, x: 8, C: AppBedD1 },
  { r: END, x: 8, C: EndBedD1 },
];

/** Caption top per scene: below the diya labels, the rising figure's foam line and the kundali chip. */
const CAP_Y: { r: Range; y: number }[] = [
  { r: SEA, y: 1470 },
  { r: RISE, y: 1580 },
  { r: MARKET, y: 1560 },
  { r: HEALTH, y: 1500 },
  { r: KUNDALI, y: 1350 },
];

export const DiwaliD1: React.FC = () => {
  const f = useCurrentFrame();
  const capY = CAP_Y.find(({ r }) => f >= r[0] && f < r[1])?.y ?? 1500;
  const titleAt = cue("titleHit", SEA[0] + 4) - 2;
  const titleOut = cue("paanch", SEA[0] + 42) + 6;
  const brand = Math.max(0, Math.min(1, 1 - ramp(f, titleAt - 4, titleAt + 2) + ramp(f, titleOut, titleOut + 10) - ramp(f, KUNDALI[0] - 10, KUNDALI[0])));
  const DH = cue("dhanvantari", RISE[0] + 130);
  const VA = cue("vaidya", RISE[0] + 210);
  const pushAt = cue("kalash03", RISE[1] - 20) - 14;
  const C4 = cue("cap04b", MARKET[0] + 105);
  const SE = cue("sehat06", HEALTH[0] + 171);
  const SO = cue("signoff", END[0]);
  const endPush = 1 + 0.04 * ramp(f, SO - 10, TOTAL, "lin");
  return (
    <AbsoluteFill style={{ background: "#0C0A07", transform: endPush > 1 ? `scale(${endPush})` : undefined, transformOrigin: "50% 42%" }}>
      {SCENE_LIST.map(({ r, x, C }, i) =>
        inRange(f, r, x, 14) ? (
          <AbsoluteFill key={i} style={{ opacity: fadeIn(f, r, x) }}>
            <C f={f} />
          </AbsoluteFill>
        ) : null,
      )}
      {f >= KUNDALI[0] - 12 && f < KUNDALI[1] + 14 ? (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
          <RigDefs />
          <SetDefs />
          <EndKundaliD1 f={f} at={KUNDALI[0]} out={KUNDALI[1]} />
        </svg>
      ) : null}
      <RowLayerD1 f={f} />
      <HookPlateD1 f={f} out={HOOK[1]} />
      <TitleCardD1 f={f} at={titleAt} out={titleOut} />
      <NameCardD1 f={f} at={DH + 2} out={pushAt - 2} name="धन्वंतरि" sub="DHANVANTARI" top={250} />
      <ChipD1 f={f} at={VA} out={pushAt - 2} top={440}>
        <ChipText>देवताओं के वैद्य</ChipText>
        <ChipText gold>· आयुर्वेद</ChipText>
      </ChipD1>
      <ChipD1 f={f} at={C4} out={MARKET[1] - 2} top={300}>
        <ChipText>बर्तन =</ChipText>
        <ChipText gold>कलश की याद</ChipText>
      </ChipD1>
      <GoldWordsD1 f={f} out={WORDS[1] - 8} top={1400} />
      <SehatDhanD1 f={f} at={SE} out={IGNITE[1] - 6} top={600} />
      <SunAskD1 f={f} at={KUNDALI[0]} out={KUNDALI[1]} />
      <AppPhoneD1 f={f} at={APP[0]} out={APP[1]} src="jyotiq/diwali/d1/app.mp4" />
      <EndTeaseD1 f={f} at={SO + 2} />
      <EndBrandD1 f={f} at={SO - 4} />
      <CaptionsD1 f={f} y={capY} />
      <BrandBug o={brand} />
      {HAS_MIX ? <Audio src={staticFile("jyotiq/diwali/d1/mix.wav")} /> : null}
    </AbsoluteFill>
  );
};
