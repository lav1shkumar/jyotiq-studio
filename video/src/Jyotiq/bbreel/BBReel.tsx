import React from "react";
import { AbsoluteFill, Audio, Freeze, Sequence, staticFile, useCurrentFrame } from "remotion";
import { z } from "zod";
import { FIGHT_DEFAULTS, FightHook } from "../fight/FightHook";
import { ReelBackdrop } from "../reelKit";
import { PALETTES, SANS, ThemeCtx } from "../theme";
import { S2Stars } from "./s2Stars";
import { S3Clash } from "./s3Clash";
import { S4Asks } from "./s4Asks";
import { S5Ball } from "./s5Ball";
import { S6Phone } from "./s6Phone";
import { S7Pitch, S8Cta } from "./s7Pitch";
import { BB_DEFAULTS, BBReelProps, M0, seqOf } from "./timeline";

/** Bigg Boss x Jyotiq promo Reel: the fight hook + 7 brand scenes, 1080x1920, 30 fps, 36.6 s. */
export const JyotiqBBReel: React.FC<BBReelProps> = (props) => (
  <ThemeCtx.Provider value={PALETTES.midnight}>
    <AbsoluteFill style={{ background: "#0C0A07", overflow: "hidden" }}>
      {/* starts with the track so its kick-reactive glow/embers read the music clock */}
      <Sequence from={M0} name="Backdrop (music clock)">
        <ReelBackdrop />
      </Sequence>
      <Sequence {...seqOf("hook")} name="S1 Hook (untouched)">
        <FightHook {...FIGHT_DEFAULTS} withSfx={false} />
      </Sequence>
      <Sequence {...seqOf("stars")} name="S2 Stars">
        <S2Stars />
      </Sequence>
      <Sequence {...seqOf("clash")} name="S3 Mangal vs Shani">
        <S3Clash />
      </Sequence>
      <Sequence {...seqOf("asks")} name="S4 Everyone asks">
        <S4Asks />
      </Sequence>
      <Sequence {...seqOf("ball")} name="S5 Ball + brand line">
        <S5Ball brandLine={props.brandLine} />
      </Sequence>
      <Sequence {...seqOf("phone")} name="S6 Phone">
        <S6Phone question={props.question} userName={props.userName} showName={props.showName} />
      </Sequence>
      <Sequence {...seqOf("pitch")} name="S7 Pitch">
        <S7Pitch question={props.question} kundaliLine={props.kundaliLine} />
      </Sequence>
      <Sequence {...seqOf("cta")} name="S8 CTA">
        <S8Cta cta={props.cta} />
      </Sequence>
      {props.withAudio ? <Audio src={staticFile(props.hookAudio === "synth" ? "jyotiq/bbreel/soundtrack-synth.wav" : "jyotiq/bbreel/soundtrack.wav")} /> : null}
    </AbsoluteFill>
  </ThemeCtx.Provider>
);

/* ------------------------------------------------------------------ */
/* Review                                                              */
/* ------------------------------------------------------------------ */

export const BB_KEYFRAMES = [107, 112, 150, 185, 214, 235, 270, 300, 330, 360, 420, 465, 474, 500, 528, 610, 640, 690, 715, 760, 790, 830, 850, 900, 940, 970, 1040, 1090];

export const bbReviewSchema = z.object({ list: z.array(z.number()).optional() });

/** Frame i = list[i] of the Reel (render --sequence --frames=0-N). */
export const JyotiqBBReelKeyframes: React.FC<{ list?: number[] }> = ({ list }) => {
  const frame = useCurrentFrame();
  const frames = list && list.length > 0 ? list : BB_KEYFRAMES;
  return (
    <Freeze frame={frames[Math.min(frame, frames.length - 1)]}>
      <JyotiqBBReel {...BB_DEFAULTS} withAudio={false} />
    </Freeze>
  );
};

/** One still, 12 thumbnails (6 x 2) of 270 x 480 with frame labels. */
export const JyotiqBBReelSheet: React.FC<{ list?: number[] }> = ({ list }) => {
  const frames = (list && list.length > 0 ? list : BB_KEYFRAMES).slice(0, 12);
  return (
    <AbsoluteFill style={{ background: "#0B0509" }}>
      {frames.map((fr, i) => (
        <div key={i} style={{ position: "absolute", left: (i % 6) * 274 + 4, top: Math.floor(i / 6) * 520 + 4, width: 270, height: 516 }}>
          <div style={{ width: 270, height: 480, overflow: "hidden", position: "relative" }}>
            <div style={{ width: 1080, height: 1920, transform: "scale(0.25)", transformOrigin: "0 0", position: "absolute" }}>
              <Freeze frame={fr}>
                <JyotiqBBReel {...BB_DEFAULTS} withAudio={false} />
              </Freeze>
            </div>
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, color: "#F5ECDD", marginTop: 4 }}>
            f{fr} · {(fr / 30).toFixed(2)}s
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
