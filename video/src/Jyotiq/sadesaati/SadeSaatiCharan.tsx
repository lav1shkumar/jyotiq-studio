import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { GOLD_HI, PhaseTracker, ROZHA, ramp, s } from "./charanKit";
import { SHOTS, ShotLayer, XF } from "./charanEdit";
import { CommuteShot, HomeShot, KundliShot } from "./charanShots";
import { CARDS, CaptionCard } from "./charanCaptions";
import { EndBackdrop, PhoneEnding, Sparks } from "./SadeSaati";

/* "साढ़े साती के 3 चरण: मन, तन, धन" (Ep2), BPHS narrator, 1080x1920 @ 24 fps.
   Flow shots + three line-art graphic shots, captions on the real VO pauses, and
   Ep1's book -> phone -> Jyotiq ending re-timed to follow the last spoken line. */
export const CH_FPS = 24;
const END_OFF = 942; // Ep1's ending starts at its frame 607 -> lands at VO 64.8 s minus XF
export const CH_TOTAL = END_OFF + s(31.5); // 1698 frames = 70.75 s

/* Graphic shots: beat times inside each graphic are measured from its cut, so f = local - XF. */
const GRAPHICS = [
  { C: CommuteShot, seq: s(34.15) - XF, end: s(44.41) },
  { C: HomeShot, seq: s(47.74) - XF, end: s(52.35) },
  { C: KundliShot, seq: s(56.19) - XF, end: s(64.8) },
];

const GraphicLayer: React.FC<{ C: React.FC<{ f: number }> }> = ({ C }) => {
  const lf = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: ramp(lf, 0, XF, 0, 1, Easing.linear) }}>
      <C f={lf - XF} />
    </AbsoluteFill>
  );
};

const PhoneClip: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: ramp(f, 0, XF, 0, 1, Easing.linear) }}>
      <OffthreadVideo
        src={staticFile("sadesaati/s7_phone.mp4")}
        trimBefore={s(3.7)}
        playbackRate={1.5}
        muted
        style={{ width: 1080, height: 1920, objectFit: "cover", filter: "contrast(1.05) saturate(1.08)" }}
      />
    </AbsoluteFill>
  );
};

/** Rendered inside <Sequence from={END_OFF}>, so its frame numbers equal Ep1's. */
const EndingLocal: React.FC = () => {
  const lf = useCurrentFrame();
  return (
    <>
      <Sequence from={607} durationInFrames={s(29.4) - 607} layout="none">
        <PhoneClip />
      </Sequence>
      <EndBackdrop f={lf} />
      <Sparks f={lf} />
      <PhoneEnding f={lf} />
    </>
  );
};

export const SadeSaatiCharanReel: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => {
  const f = useCurrentFrame();
  const titleO = ramp(f, s(9.4), s(9.9), 1, 0, Easing.linear);
  return (
    <AbsoluteFill style={{ background: "#07041A" }}>
      {SHOTS.map((shot, i) => (
        <Sequence key={`v${i}`} from={shot.seq} durationInFrames={shot.end - shot.seq} layout="none">
          <ShotLayer shot={shot} first={i === 0} />
        </Sequence>
      ))}
      {GRAPHICS.map((g, i) => (
        <Sequence key={`g${i}`} from={g.seq} durationInFrames={g.end - g.seq} layout="none">
          <GraphicLayer C={g.C} />
        </Sequence>
      ))}

      {/* grade: soft vignette over the footage (as Ep1) */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 62% at 50% 46%, transparent 55%, rgba(4,2,14,0.42) 100%)" }} />

      <Sequence from={END_OFF} layout="none">
        <EndingLocal />
      </Sequence>

      {/* caption scrim, lower-middle */}
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, transparent 58%, rgba(6,4,18,0.5) 68%, rgba(6,4,18,0.58) 78%, transparent 88%)" }} />

      {/* sound-off topic line on the hook */}
      {titleO > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 236,
            textAlign: "center",
            fontFamily: ROZHA,
            fontSize: 50,
            color: GOLD_HI,
            opacity: titleO,
            letterSpacing: 1,
            textShadow: "0 0 18px rgba(0,0,0,0.9), 0 2px 0 rgba(0,0,0,0.6)",
          }}
        >
          <span style={{ opacity: 0.7 }}>✦ </span>साढ़े साती के 3 चरण<span style={{ opacity: 0.7 }}> ✦</span>
        </div>
      ) : null}

      <PhaseTracker f={f} />

      {CARDS.map((c, i) => (
        <CaptionCard key={i} card={c} f={f} />
      ))}

      {/* Jyotiq mark, top-right (same place as Ep1) */}
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

      {withAudio ? <Audio src={staticFile("sadesaati-charan/mix.wav")} /> : null}
    </AbsoluteFill>
  );
};
