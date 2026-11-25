import React from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ramp, s } from "./charanKit";
import { SHOTS, ShotLayer3 } from "./chandraEdit";
import { Captions3, SpeedTracker, TopicTitle } from "./chandraCaptions";
import { EndBackdrop, PhoneEnding, Sparks } from "./SadeSaati";

/* "शनि सूर्य के पास आए... तो साढ़े साती क्यों नहीं होती?" (Ep3), BPHS narrator, 1080x1920 @ 24 fps.
   Ten Flow shots cut on the measured VO phrases, a planet-speed tracker over shots 3-4, and Ep1's
   book -> phone -> Jyotiq ending fitted onto this episode's own phone-shaped light (s9_phone). */
export const CHA_FPS = 24;
export const CHA_TOTAL = s(46.75); // 1122 frames
const END_OFF = s(15.75); // Ep1 ending frames + 378: bezel at 43.0 s (VO gap), app reveal under "Jyotiq" (43.42 s)

/* s9_phone's light rectangle is 0.834 x Ep1's at the same centre, so the Ep1 phone starts fitted
   onto it and grows back to Ep1's final size while it shrinks into place. */
const K0 = 0.834;
const fit = (k: number, u: number): React.CSSProperties => ({
  transform: `translate(${-1 * (1 - u)}px, ${-3.5 * (1 - u)}px) scale(${k})`,
  transformOrigin: "539px 962.5px",
});

/** Rendered inside <Sequence from={END_OFF}>, so its frame numbers equal Ep1's. */
const EndingLocal3: React.FC = () => {
  const lf = useCurrentFrame();
  const u = ramp(lf, s(27.75), s(28.3), 0, 1, Easing.inOut(Easing.cubic)); // same curve as the phone's shrink
  return (
    <>
      <EndBackdrop f={lf} />
      <AbsoluteFill style={fit(K0, 0)}>
        <Sparks f={lf} />
      </AbsoluteFill>
      <AbsoluteFill style={fit(K0 + (1 - K0) * u, u)}>
        <PhoneEnding f={lf} />
      </AbsoluteFill>
    </>
  );
};

export const SadeSaatiChandraReel: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#07041A" }}>
      {SHOTS.map((shot, i) => (
        <Sequence key={i} from={shot.seq} durationInFrames={shot.end - shot.seq} layout="none">
          <ShotLayer3 shot={shot} first={i === 0} />
        </Sequence>
      ))}

      {/* grade: soft vignette over the footage (as Ep1/Ep2) */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 62% at 50% 46%, transparent 55%, rgba(4,2,14,0.42) 100%)" }} />

      <Sequence from={END_OFF} layout="none">
        <EndingLocal3 />
      </Sequence>

      {/* caption scrim, lower-middle */}
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, transparent 58%, rgba(6,4,18,0.5) 68%, rgba(6,4,18,0.58) 78%, transparent 88%)" }} />

      <TopicTitle f={f} />
      <SpeedTracker f={f} />
      <Captions3 f={f} />

      {/* Jyotiq mark, top-right (same place as Ep1/Ep2) */}
      <Img
        src={staticFile("jyotiq/logo-full.png")}
        style={{
          position: "absolute",
          right: 40,
          top: 168,
          width: 128,
          height: (128 * 511) / 444,
          opacity: 0.96,
          filter: "drop-shadow(0 0 14px rgba(230,180,90,0.35)) drop-shadow(0 4px 10px rgba(0,0,0,0.65))",
        }}
      />

      {withAudio ? <Audio src={staticFile("sadesaati3/mix.wav")} /> : null}
    </AbsoluteFill>
  );
};
