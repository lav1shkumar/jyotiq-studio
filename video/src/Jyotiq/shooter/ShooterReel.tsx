import React from "react";
import { AbsoluteFill, Audio, Freeze, staticFile, useCurrentFrame } from "remotion";
import { SANS } from "../theme";
import { S1Kid, KID_V2 } from "./kid";
import { Caption, Defs, Flash, Grade, LogoBug } from "./prims";
import { S2Shani } from "./shani";
import { S3Convoy } from "./grahas";
import { S4Ending } from "./ending";
import { S5Lockup } from "./lockup";
import { SC, hit, kickPulse } from "./timing";
import { E2, K2, SHIFT, TOTAL2 } from "./timing2";

/** Jyotiq "Shooter Gaadi" Reel: kid + Jyotiq -> Shani Dev on his Bullet -> graha convoy. 1080x1920, 30 fps. */
export const ShooterFrame: React.FC<{ f: number }> = ({ f }) => {
  const scene = f < SC.shani ? <S1Kid f={f} /> : f < SC.kundli ? <S2Shani f={f} /> : <S3Convoy f={f} />;
  const beat = kickPulse(f, 0, 1e9, 8);
  const cutFlash = Math.max(hit(f, SC.face, 4) * 0.4, hit(f, SC.read, 5) * 0.5, hit(f, SC.wheelie, 4) * 0.45, hit(f, SC.kundli, 5) * 0.6, hit(f, SC.carC, 4) * 0.3, hit(f, SC.carB, 4) * 0.3, hit(f, SC.carD, 4) * 0.3, hit(f, SC.squad, 4) * 0.4);
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: SANS }}>
      <Defs />
      {scene}
      <Grade f={f} vig={f < SC.shani ? 0.5 : 0.62} grain={0.07} />
      <Flash o={cutFlash} />
      {/* captions (IG safe zone, top) */}
      <Caption f={f} at={2} out={SC.shani} lines={["POV: you asking *Jyotiq*", "about your kundali and your", "*Shani* is bhari on you 😭"]} />
      <Caption f={f} at={SC.shani + 3} out={SC.wheelie} lines={["Meanwhile *Shani Dev*", "in your kundali:"]} accent="#8DB8FF" />
      <Caption f={f} at={SC.carA + 2} out={SC.squad} lines={["Aur baaki grah? *Full vibe* mein 😎"]} size={46} />
      <Caption f={f} at={SC.squad + 4} lines={["Kundli ka *poora scene* → Jyotiq 👀"]} size={46} />
      <LogoBug beat={Math.min(1, beat)} />
    </AbsoluteFill>
  );
};

export const JyotiqShooterReel: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => {
  const f = useCurrentFrame();
  return (
    <>
      <ShooterFrame f={f} />
      {withAudio ? <Audio src={staticFile("jyotiq/shooter/mix.wav")} volume={0.89} /> : null}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* v2: extended song, slower opening, crying meme, new ending, lockup   */
/* ------------------------------------------------------------------ */

/** v2 frame: kid (re-paced) -> Shani + convoy (v1 art at f - SHIFT) -> dance -> phone reveal -> lockup. 803 frames. */
export const ShooterFrame2: React.FC<{ f: number }> = ({ f }) => {
  const fo = f - SHIFT; // v1 clock for the approved middle scenes
  const scene =
    f < K2.shani ? <S1Kid f={f} T={KID_V2} /> : fo < SC.kundli ? <S2Shani f={fo} /> : f < E2.dance ? <S3Convoy f={fo} /> : f < E2.lock ? <S4Ending f={f} /> : <S5Lockup f={f} />;
  const lock = f >= E2.lock;
  const beat = Math.min(1, kickPulse(fo, 0, 1e9, 8) + E2.beats.reduce((a, b) => a + hit(f, b, 8), 0));
  const cutFlash = Math.max(
    hit(f, K2.face, 4) * 0.4,
    hit(f, K2.read, 5) * 0.5,
    hit(fo, SC.wheelie, 4) * 0.45,
    hit(fo, SC.kundli, 5) * 0.6,
    hit(fo, SC.carC, 4) * 0.3,
    hit(fo, SC.carB, 4) * 0.3,
    hit(fo, SC.carD, 4) * 0.3,
    hit(fo, SC.squad, 4) * 0.4,
    hit(f, E2.dance, 5) * 0.55,
    hit(f, E2.converge, 4) * 0.35,
  );
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: SANS }}>
      <Defs />
      {scene}
      <Grade f={f} vig={lock ? 0.42 : f < K2.shani ? 0.5 : 0.62} grain={lock ? 0.045 : 0.07} />
      <Flash o={cutFlash} />
      <Caption f={f} at={2} out={K2.shani} lines={["POV: you asking *Jyotiq*", "about your kundali and your", "*Shani* is bhari on you 😭"]} />
      <Caption f={f} at={K2.shani + 3} out={SC.wheelie + SHIFT} lines={["Meanwhile *Shani Dev*", "in your kundali:"]} accent="#8DB8FF" />
      <Caption f={f} at={SC.carA + SHIFT + 2} out={SC.squad + SHIFT} lines={["Aur baaki grah? *Full vibe* mein 😎"]} size={46} />
      <Caption f={f} at={SC.squad + SHIFT + 4} out={E2.dance} lines={["Kundli ka *poora scene* → Jyotiq 👀"]} size={46} />
      {!lock ? <LogoBug beat={beat} /> : null}
    </AbsoluteFill>
  );
};

export const JyotiqShooterReel2: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => {
  const f = useCurrentFrame();
  return (
    <>
      <ShooterFrame2 f={f} />
      {withAudio ? <Audio src={staticFile("jyotiq/shooter/mix-v2.wav")} volume={0.89} /> : null}
    </>
  );
};
export const SHOOTER2_TOTAL = TOTAL2;

export const SHOOTER_KEYFRAMES = [8, 30, 56, 80, 94, 112, 130, 150, 165, 200, 250, 280, 305, 335, 375, 418, 450, 505];

/** Review sheet: up to 18 frames (6 x 3) at quarter size. */
export const JyotiqShooterSheet: React.FC<{ list?: number[]; v2?: boolean }> = ({ list, v2 }) => {
  const frames = (list && list.length > 0 ? list : SHOOTER_KEYFRAMES).slice(0, 18);
  return (
    <AbsoluteFill style={{ background: "#0B0509" }}>
      {frames.map((fr, i) => (
        <div key={i} style={{ position: "absolute", left: (i % 6) * 274 + 4, top: Math.floor(i / 6) * 520 + 4, width: 270, height: 516 }}>
          <div style={{ width: 270, height: 480, overflow: "hidden", position: "relative" }}>
            <div style={{ width: 1080, height: 1920, transform: "scale(0.25)", transformOrigin: "0 0", position: "absolute" }}>
              <Freeze frame={fr}>
                {v2 ? <ShooterFrame2 f={fr} /> : <ShooterFrame f={fr} />}
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
