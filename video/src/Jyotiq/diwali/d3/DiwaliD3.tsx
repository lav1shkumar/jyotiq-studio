import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { fadeIn, inRange, Range } from "../../manthan/kit";
import { ramp } from "../../manthan/style";
import { RowLayer } from "../shared/endD";
import {
  AppPhoneD3, BrandBugD3, CaptionsD3, DashaChipD3, DawnWordsD3, EndBrandD3, EndShareD3, EndTeaseD3, FeatureD3, GoldWordsD3, HookPlateD3, SkyChipsD3,
  TitleCardD3,
} from "./gfxD3";
import { HookD3, SkyD3 } from "./scenesD3a";
import { AyodhyaD3, LakshmiD3, RishisD3 } from "./scenesD3b";
import { AppBedD3, DashaD3, DawnD3, EndBedD3 } from "./scenesD3c";
import { CUES, SCENES, TOTAL } from "./timing";

/* Jyotiq Diwali series "पाँच दीये", Day 3 · दिवाली · लक्ष्मी पूजा. One clock: timing.ts, written by
   scripts/diwali_d3_audio.py (PLACEHOLDER until the takes are in; then it is regenerated with the mix). Day 2's
   structure: scenes overlap and cross-dissolve; the diya row is one persistent layer from 'ख़त्म' in 07 (diya 3
   lights) to the last frame; HTML overlays sit above the world. */

export const D3_TOTAL = TOTAL;
/** Flip to true once scripts/diwali_d3_audio.py has written public/jyotiq/diwali/d3/mix.wav from the real takes. */
const HAS_MIX = true;

const cue = (k: string, dflt: number): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);
const S = (k: string): Range => SCENES[k] as Range;
const join = (a: Range, b: Range): Range => [a[0], Math.max(a[1], b[1])];

const HOOK = S("hook");
const SKY = join(S("title"), S("sky"));
const RISHIS = S("rishis");
const LAKSHMI = S("lakshmi");
const AYODHYA = S("ayodhya");
const DASHA = S("dasha");
const DAWN = S("dawn");
const APP = S("app");
const END = S("end");

const SCENE_LIST: { r: Range; x: number; C: React.FC<{ f: number }> }[] = [
  { r: HOOK, x: 0, C: HookD3 },
  { r: SKY, x: 4, C: SkyD3 }, // the hook ends on the same dark sky, so the dissolve is nearly invisible
  { r: RISHIS, x: 6, C: RishisD3 },
  { r: LAKSHMI, x: 8, C: LakshmiD3 },
  { r: AYODHYA, x: 6, C: AyodhyaD3 },
  { r: DASHA, x: 6, C: DashaD3 },
  { r: DAWN, x: 6, C: DawnD3 },
  { r: APP, x: 8, C: AppBedD3 },
  { r: END, x: 8, C: EndBedD3 },
];

/** Caption top per scene: two-line captions end above y 1670 (the bottom 250 px stays clear). */
const CAP_Y: { r: Range; y: number }[] = [
  { r: SKY, y: 1500 },
  { r: RISHIS, y: 1500 },
  { r: AYODHYA, y: 1520 },
  { r: DASHA, y: 1500 },
];

export const DiwaliD3: React.FC = () => {
  const f = useCurrentFrame();
  const capY = CAP_Y.find(({ r }) => f >= r[0] && f < r[1])?.y ?? 1500;
  const titleAt = cue("titleHit", SKY[0] + 4) - 2;
  const titleOut = cue("amavasya02", SKY[0] + 14) + 24;
  const SO = cue("signoff", END[0]);
  // the bug stays on through the app scene; only the title and the end block (which carry the logo) replace it
  const brand = Math.max(0, Math.min(1, 1 - ramp(f, titleAt - 4, titleAt + 2) + ramp(f, titleOut, titleOut + 10) - ramp(f, SO - 10, SO)));
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
      <RowLayer f={f} n={3} at={cue("khatam07", DAWN[0] + 93)} toTopAt={APP[0]} toEndAt={SO} />
      <HookPlateD3 f={f} out={HOOK[1]} />
      <TitleCardD3 f={f} at={titleAt} out={titleOut} />
      <SkyChipsD3 f={f} />
      <GoldWordsD3 f={f} out={LAKSHMI[1]} />
      <DashaChipD3 f={f} />
      <DawnWordsD3 f={f} out={DAWN[1]} />
      <AppPhoneD3 f={f} at={APP[0]} out={SO - 6} />
      <FeatureD3 f={f} out={SO - 6} />
      <EndTeaseD3 f={f} at={SO + 2} />
      <EndBrandD3 f={f} at={SO + 2} />
      <EndShareD3 f={f} />
      <CaptionsD3 f={f} y={capY} />
      <BrandBugD3 o={brand} />
      {HAS_MIX ? <Audio src={staticFile("jyotiq/diwali/d3/mix.wav")} /> : null}
    </AbsoluteFill>
  );
};
