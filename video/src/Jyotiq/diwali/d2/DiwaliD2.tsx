import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { fadeIn, inRange, Range } from "../../manthan/kit";
import { ramp } from "../../manthan/style";
import { RowLayer } from "../shared/endD";
import {
  AppPhoneD2, BrandBugD2, CaptionsD2, ChauthiD2, EndBrandD2, EndShareD2, EndTeaseD2, FeatureD2, GoldWordsD2, HookPlateD2,
  HoraEqD2, TitleCardD2, YamaKaalD2,
} from "./gfxD2";
import { HookD2, PalaceD2, RewindD2 } from "./scenesD2a";
import { LampsD2, SerpentD2, YamaD2 } from "./scenesD2b";
import { AppBedD2, EndBedD2, HoraD2, KaalD2 } from "./scenesD2c";
import { CUES, SCENES, TOTAL } from "./timing";

/* Jyotiq Diwali series "पाँच दीये", Day 2 · छोटी दिवाली · यम का दीया. One clock: timing.ts, written by
   scripts/diwali_d2_audio.py (PLACEHOLDER until the takes are in; then it is regenerated with the mix). Built on
   Day 1's structure: scenes overlap and cross-dissolve; Kaal's rewind carries the hook into the title; the diya row is
   one persistent layer from 'समय' (diya 2 lights) to the last frame; HTML overlays sit above the world. */

export const D2_TOTAL = TOTAL;
/** Flip to true once scripts/diwali_d2_audio.py has written public/jyotiq/diwali/d2/mix.wav from the real takes. */
const HAS_MIX = true;

const cue = (k: string, dflt: number): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);
const S = (k: string): Range => SCENES[k] as Range;
const join = (a: Range, b: Range): Range => [a[0], Math.max(a[1], b[1])];

const HOOK = S("hook");
const PAL = join(S("title"), S("palace"));
const LAMPS = S("lamps");
const SERPENT = S("serpent");
const YAMA = S("yama");
const KAAL = S("kaal");
const HORA = S("hora");
const APP = S("app");
const END = S("end");

const SCENE_LIST: { r: Range; x: number; C: React.FC<{ f: number }> }[] = [
  { r: HOOK, x: 0, C: HookD2 },
  { r: PAL, x: 4, C: PalaceD2 }, // a short dissolve under Kaal's rewind
  { r: LAMPS, x: 6, C: LampsD2 },
  { r: SERPENT, x: 6, C: SerpentD2 },
  { r: YAMA, x: 8, C: YamaD2 },
  { r: KAAL, x: 6, C: KaalD2 },
  { r: HORA, x: 6, C: HoraD2 },
  { r: APP, x: 8, C: AppBedD2 },
  { r: END, x: 8, C: EndBedD2 },
];

/** Caption top per scene: two-line captions end above y 1670 (the bottom 250 px stays clear). */
const CAP_Y: { r: Range; y: number }[] = [
  { r: PAL, y: 1500 },
  { r: LAMPS, y: 1500 },
  { r: SERPENT, y: 1520 },
  { r: KAAL, y: 1500 },
  { r: HORA, y: 1470 },
];

export const DiwaliD2: React.FC = () => {
  const f = useCurrentFrame();
  const capY = CAP_Y.find(({ r }) => f >= r[0] && f < r[1])?.y ?? 1500;
  const titleAt = cue("titleHit", PAL[0] + 4) - 2;
  const titleOut = cue("him02", PAL[0] + 59) - 2; // clear of the couple's faces before they are named
  const SO = cue("signoff", END[0]);
  // the bug stays on through the hora and app scenes; only the title and the end block (which carry the logo) replace it
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
      <RewindD2 f={f} />
      <RowLayer f={f} n={2} at={cue("samay06", KAAL[0] + 108)} toTopAt={HORA[0]} toEndAt={SO} />
      <HookPlateD2 f={f} out={HOOK[1]} />
      <TitleCardD2 f={f} at={titleAt} out={titleOut} />
      <ChauthiD2 f={f} />
      <GoldWordsD2 f={f} out={YAMA[1]} top={1360} />
      <YamaKaalD2 f={f} out={KAAL[1]} />
      <HoraEqD2 f={f} out={HORA[1]} />
      <AppPhoneD2 f={f} at={APP[0]} out={SO - 6} />
      <FeatureD2 f={f} out={SO - 6} />
      <EndTeaseD2 f={f} at={SO + 2} />
      <EndBrandD2 f={f} at={SO + 2} />
      <EndShareD2 f={f} />
      <CaptionsD2 f={f} y={capY} />
      <BrandBugD2 o={brand} />
      {HAS_MIX ? <Audio src={staticFile("jyotiq/diwali/d2/mix.wav")} /> : null}
    </AbsoluteFill>
  );
};
