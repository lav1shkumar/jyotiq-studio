import React from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ramp, s } from "./charanKit";
import { CUT, Embers, HAVE_3AB, LightBloom, SHOTS, ShotLayer4 } from "./harishEdit";
import { Captions4, TopicTitle4 } from "./harishCaptions";
import { EndBackdrop, PhoneEnding, Sparks } from "./SadeSaati";

/* "लोग कहते हैं... शनि देव जी दंड देते हैं।" (Ep4, Raja Harishchandra, anime), BPHS narrator, 1080x1920 @ 24 fps.
   Flow shots cut on the measured VO phrases, and Ep1's book -> phone -> Jyotiq ending laid onto this
   episode's own phone-shaped light (s11, static from src ~7.7 s). */
export const HAR_FPS = 24;
export const HAR_TOTAL = s(49.75); // 1194 frames: VO ends 48.15, then the end card holds
const END_OFF = s(18.9); // Ep1 ending frames + 454: bezel at 46.17 s (VO gap), app reveal under "ज्योतिक़" (46.62 s)

/* s11's light rectangle (x230-852, y366-1554) is Ep1's RECT shifted (+3, -2) px, so the Ep1 phone
   starts on it and eases back to Ep1's exact position while it shrinks into place. */
const fit = (u: number): React.CSSProperties => ({ transform: `translate(${3 * (1 - u)}px, ${-2 * (1 - u)}px)` });

/** Rendered inside <Sequence from={END_OFF}>, so its frame numbers equal Ep1's. */
const EndingLocal4: React.FC = () => {
  const lf = useCurrentFrame();
  const u = ramp(lf, s(27.75), s(28.3), 0, 1, Easing.inOut(Easing.cubic)); // same curve as the phone's shrink
  return (
    <>
      <EndBackdrop f={lf} />
      <AbsoluteFill style={fit(0)}>
        <Sparks f={lf} />
      </AbsoluteFill>
      <AbsoluteFill style={fit(u)}>
        <PhoneEnding f={lf} />
      </AbsoluteFill>
    </>
  );
};

export const SadeSaatiHarishReel: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#07041A" }}>
      {SHOTS.map((shot, i) => (
        <Sequence key={i} from={shot.seq} durationInFrames={shot.end - shot.seq} layout="none">
          <ShotLayer4 shot={shot} />
        </Sequence>
      ))}

      {/* kingdom lost: embers rise while the palace burns down and the family fades (fallback line 3 only) */}
      {HAVE_3AB ? null : <Embers f={f} from={s(CUT.s3a)} to={s(CUT.s4) + 6} />}

      {/* grade: soft vignette over the footage (as Ep1-3) */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 62% at 50% 46%, transparent 55%, rgba(4,2,14,0.42) 100%)" }} />

      {/* the golden light carries the family home: "और सब कुछ लौट आया" */}
      <LightBloom f={f} at={s(CUT.s9b)} />

      <Sequence from={END_OFF} layout="none">
        <EndingLocal4 />
      </Sequence>

      {/* caption scrim, lower-middle */}
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, transparent 58%, rgba(6,4,18,0.5) 68%, rgba(6,4,18,0.58) 78%, transparent 88%)" }} />

      <TopicTitle4 f={f} />
      <Captions4 f={f} />

      {/* Jyotiq mark, top-right (same place as Ep1-3) */}
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

      {withAudio ? <Audio src={staticFile("sadesaati4/mix.wav")} /> : null}
    </AbsoluteFill>
  );
};
