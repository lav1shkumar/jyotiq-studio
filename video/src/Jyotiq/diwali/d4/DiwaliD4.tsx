import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { BrandBug } from "../../manthan/graphics";
import { fadeIn, inRange, Range } from "../../manthan/kit";
import { ramp } from "../../manthan/style";
import { RowLayer } from "../shared/endD";
import {
  AnnakootChipD4, AppPhoneD4, CaptionsD4, EndBrandD4, EndTeaseD4, FeatureD4, GocharChipD4, GoldWordsD4, HookPlateD4, TitleCardD4,
} from "./gfxD4";
import { GokulD4, HookD4 } from "./scenesD4a";
import { KrishnaD4, LiftD4, StormD4 } from "./scenesD4b";
import { AnnakootD4, AppBedD4, EndBedD4, GocharD4 } from "./scenesD4c";
import { CUES, SCENES, TOTAL } from "./timing";

/* Jyotiq Diwali series "पाँच दीये", Day 4 · गोवर्धन पूजा · अन्नकूट. One clock: timing.ts, written by
   scripts/diwali_d4_audio.py (PLACEHOLDER until the takes are in; then it is regenerated with the mix). Day 3's
   structure: scenes overlap and cross-dissolve; the diya row is one persistent layer from 'बदलाव' in 07 (diya 4
   lights, LOW at y 1560 so the gochar wheel stays bright) to the last frame; HTML overlays sit above the world. */

export const D4_TOTAL = TOTAL;
/** Flip to true once scripts/diwali_d4_audio.py has written public/jyotiq/diwali/d4/mix.wav from the real takes. */
const HAS_MIX = false;

const cue = (k: string, dflt: number): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);
const S = (k: string): Range => SCENES[k] as Range;
const join = (a: Range, b: Range): Range => [a[0], Math.max(a[1], b[1])];

const HOOK = S("hook");
const GOKUL = join(S("title"), S("gokul"));
const STORM = S("storm");
const LIFT = S("lift");
const KRISHNA = S("krishna");
const ANNAKOOT = S("annakoot");
const GOCHAR = S("gochar");
const APP = S("app");
const END = S("end");

const SCENE_LIST: { r: Range; x: number; C: React.FC<{ f: number }> }[] = [
  { r: HOOK, x: 0, C: HookD4 },
  { r: GOKUL, x: 4, C: GokulD4 }, // out of the food hill turned Govardhan, under the title
  { r: STORM, x: 6, C: StormD4 },
  { r: LIFT, x: 6, C: LiftD4 },
  { r: KRISHNA, x: 8, C: KrishnaD4 },
  { r: ANNAKOOT, x: 6, C: AnnakootD4 },
  { r: GOCHAR, x: 6, C: GocharD4 },
  { r: APP, x: 8, C: AppBedD4 },
  { r: END, x: 8, C: EndBedD4 },
];

/** Caption top per scene: two-line captions end above y 1670 (the bottom 250 px stays clear). */
const CAP_Y: { r: Range; y: number }[] = [
  { r: GOKUL, y: 1500 },
  { r: STORM, y: 1500 },
  { r: LIFT, y: 1500 },
  { r: ANNAKOOT, y: 1500 },
];

export const DiwaliD4: React.FC = () => {
  const f = useCurrentFrame();
  const capY = CAP_Y.find(({ r }) => f >= r[0] && f < r[1])?.y ?? 1500;
  const titleAt = cue("titleHit", GOKUL[0] + 4) - 2;
  const titleOut = cue("gokul02", GOKUL[0] + 12) + 40;
  const brand = Math.max(0, Math.min(1, 1 - ramp(f, titleAt - 4, titleAt + 2) + ramp(f, titleOut, titleOut + 10) - ramp(f, APP[0] - 10, APP[0])));
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
      <RowLayer f={f} n={4} at={cue("badlav07", GOCHAR[0] + 62)} toTopAt={APP[0]} toEndAt={SO} centerY={1560} />
      <HookPlateD4 f={f} out={HOOK[1]} />
      <TitleCardD4 f={f} at={titleAt} out={titleOut} />
      <GoldWordsD4 f={f} out={KRISHNA[1]} />
      <AnnakootChipD4 f={f} />
      <GocharChipD4 f={f} />
      <AppPhoneD4 f={f} at={APP[0]} out={APP[1]} />
      <FeatureD4 f={f} out={APP[1]} />
      <EndTeaseD4 f={f} at={SO + 2} />
      <EndBrandD4 f={f} at={SO - 4} />
      <CaptionsD4 f={f} y={capY} />
      <BrandBug o={brand} />
      {HAS_MIX ? <Audio src={staticFile("jyotiq/diwali/d4/mix.wav")} /> : null}
    </AbsoluteFill>
  );
};
