import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { BrandBug } from "../../manthan/graphics";
import { fadeIn, inRange, Range } from "../../manthan/kit";
import { ramp } from "../../manthan/style";
import { RowLayer } from "../shared/endD";
import {
  AppPhoneD5, CaptionsD5, EndBrandD5, EndCelebrateD5, FeatureD5, GoldWordsD5, HookPlateD5, LangWordsD5, NameWordsD5, TitleCardD5,
} from "./gfxD5";
import { HookD5, YamunaD5 } from "./scenesD5a";
import { WelcomeD5, YamaD5 } from "./scenesD5b";
import { AppBedD5, EndBedD5, LangsD5, MapD5, NameD5 } from "./scenesD5c";
import { CUES, SCENES, TOTAL } from "./timing";

/* Jyotiq Diwali series "पाँच दीये", Day 5 · भाई दूज · यम द्वितीया (the finale). One clock: timing.ts, written by
   scripts/diwali_d5_audio.py (PLACEHOLDER until the takes are in; then it is regenerated with the mix). Day 4's
   structure: scenes overlap and cross-dissolve; the diya row is one persistent layer from 'दूज' in 05 (diya 5 lights
   in the centre under the day's name), rises to the top bar as the map begins, and drops into the end card, where
   all five diyas celebrate; HTML overlays sit above the world. */

export const D5_TOTAL = TOTAL;
/** Flip to true once scripts/diwali_d5_audio.py has written public/jyotiq/diwali/d5/mix.wav from the real takes. */
const HAS_MIX = false;

const cue = (k: string, dflt: number): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);
const S = (k: string): Range => SCENES[k] as Range;
const join = (a: Range, b: Range): Range => [a[0], Math.max(a[1], b[1])];

const HOOK = S("hook");
const YAMUNA = join(S("title"), S("yamuna"));
const WELCOME = S("welcome");
const YAMA = S("yama");
const NAME = S("name");
const MAP = S("map");
const LANGS = S("langs");
const APP = S("app");
const END = S("end");

const SCENE_LIST: { r: Range; x: number; C: React.FC<{ f: number }> }[] = [
  { r: HOOK, x: 0, C: HookD5 },
  { r: YAMUNA, x: 4, C: YamunaD5 }, // the dusk river, under the title
  { r: WELCOME, x: 6, C: WelcomeD5 },
  { r: YAMA, x: 8, C: YamaD5 },
  { r: NAME, x: 6, C: NameD5 },
  { r: MAP, x: 6, C: MapD5 },
  { r: LANGS, x: 6, C: LangsD5 },
  { r: APP, x: 8, C: AppBedD5 },
  { r: END, x: 8, C: EndBedD5 },
];

/** Caption top per scene: two-line captions end above y 1670 (the bottom 250 px stays clear). Yamuna's tortoise
    sits near y 1520, so check it against the caption in the stills. */
const CAP_Y: { r: Range; y: number }[] = [
  { r: YAMUNA, y: 1500 },
  { r: WELCOME, y: 1500 },
  { r: MAP, y: 1500 },
];

export const DiwaliD5: React.FC = () => {
  const f = useCurrentFrame();
  const capY = CAP_Y.find(({ r }) => f >= r[0] && f < r[1])?.y ?? 1500;
  const titleAt = cue("titleHit", YAMUNA[0] + 4) - 2;
  const titleOut = cue("yamuna02", YAMUNA[0] + 12) + 40;
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
      {/* toTopAt sits 8 frames into the map: the rise starts as the map begins, so diya 5 holds lit until then */}
      <RowLayer f={f} n={5} at={cue("dooj05", NAME[0] + 109)} toTopAt={MAP[0] + 8} toEndAt={SO} celebrate centerScale={0.84} />
      <HookPlateD5 f={f} out={HOOK[1]} />
      <TitleCardD5 f={f} at={titleAt} out={titleOut} />
      <GoldWordsD5 f={f} out={YAMA[1]} />
      <NameWordsD5 f={f} out={NAME[1] + 6} />
      <LangWordsD5 f={f} out={LANGS[1]} />
      <AppPhoneD5 f={f} at={APP[0]} out={APP[1]} />
      <FeatureD5 f={f} out={APP[1]} />
      <EndCelebrateD5 f={f} at={SO + 2} />
      <EndBrandD5 f={f} at={SO - 4} />
      <CaptionsD5 f={f} y={capY} />
      <BrandBug o={brand} />
      {HAS_MIX ? <Audio src={staticFile("jyotiq/diwali/d5/mix.wav")} /> : null}
    </AbsoluteFill>
  );
};
