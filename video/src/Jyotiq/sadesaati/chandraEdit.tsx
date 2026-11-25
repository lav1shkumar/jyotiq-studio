import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FPS, clamp, ramp, s } from "./charanKit";

/* Ep3 "शनि सूर्य के पास आए... तो साढ़े साती क्यों नहीं होती?": the Flow shots.
   cut = where the shot takes over (VO seconds), srcAtCut = source time at that cut,
   rate = playback rate. Each layer starts XF frames before its cut and crossfades in.
   Zoom stays <= 1.12 about the centre so Flow's corner mark (~900,1740) stays in frame. */
export const XF = 6; // crossfade frames
const P = "sadesaati3/";

export type Shot3 = { src: string; seq: number; end: number; trim: number; rate: number; zoom: [number, number]; origin?: string };

const shot = (file: string, cut: number, end: number, srcAtCut: number, zoom: [number, number], rate = 1, origin?: string): Shot3 => {
  const seq = cut === 0 ? 0 : s(cut) - XF;
  const lead = (s(cut) - seq) / FPS; // seconds of layer before its cut
  return { src: P + file, seq, end: s(end), trim: Math.max(0, srcAtCut - lead * rate), rate, zoom, origin };
};

/** Cut times on the measured VO (each just before its phrase starts). */
export const CUT = { s2: 4.7, s3: 10.85, s4: 16.1, s5a: 22.05, s5b: 24.8, s6: 27.4, s7: 31.0, s8: 36.7, s9: 40.1 };

export const SHOTS: Shot3[] = [
  shot("s1_sun.mp4", 0, CUT.s2, 0, [1.0, 1.05]), // hook: Saturn arrives beside the Sun (frame 0 = the lit Sun)
  shot("s2_book.mp4", CUT.s2, CUT.s3, 0.9, [1.0, 1.04]), // मैं बृहत् पाराशर...: the book opens, planet rings rise on "समझो"
  shot("s3_moonring.mp4", CUT.s3, CUT.s4, 0.8, [1.0, 1.04]), // चंद्रमा... सबसे तेज़: the Moon races the ring
  shot("s1_sun.mp4", CUT.s4, CUT.s5a, 3.95, [1.08, 1.12], 1, "50% 48%"), // सूर्य... शनि...: shot 4 not uploaded, hook clip returns closer
  shot("s6_lake.mp4", CUT.s5a, CUT.s5b, 0.11, [1.0, 1.05], 0.45), // चंद्रमा... तुम्हारा मन है: shot 5a not uploaded, the still lake (ends before the drop)
  shot("s5b_wheel.mp4", CUT.s5b, CUT.s6, 2.6, [1.0, 1.04]), // शनि... कर्मों का हिसाब: sparks settle into the rings
  shot("s6_lake.mp4", CUT.s6, CUT.s7, 1.5, [1.05, 1.08]), // गलतियाँ... मन से ही: impact (src 3.33) lands 29.25, on "मन"
  shot("s7_approach.mp4", CUT.s7, CUT.s8, 1.3, [1.0, 1.05]), // सबसे धीमा न्यायाधीश... चंचल मन के पास: Saturn reaches the Moon
  shot("s8_ring.mp4", CUT.s8, CUT.s9, 2.2, [1.0, 1.04]), // तो वही समय... साढ़े साती: Saturn lights the first signs
  shot("s9_phone.mp4", CUT.s9, 45.15, 1.85, [1.0, 1.0], 1.5), // book -> light -> phone shape; the Jyotiq phone takes over at 43.0
];

export const ShotLayer3: React.FC<{ shot: Shot3; first: boolean }> = ({ shot, first }) => {
  const f = useCurrentFrame();
  const dur = shot.end - shot.seq;
  const opacity = first ? 1 : ramp(f, 0, XF, 0, 1, Easing.linear);
  const z = interpolate(f, [0, dur], shot.zoom, clamp);
  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${z})`, transformOrigin: shot.origin ?? "50% 50%" }}>
      <OffthreadVideo
        src={staticFile(shot.src)}
        trimBefore={Math.round(shot.trim * FPS)}
        playbackRate={shot.rate}
        muted
        style={{ width: 1080, height: 1920, objectFit: "cover", filter: "contrast(1.05) saturate(1.08)" }}
      />
    </AbsoluteFill>
  );
};
