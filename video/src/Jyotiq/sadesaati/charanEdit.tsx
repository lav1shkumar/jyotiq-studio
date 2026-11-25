import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FPS, clamp, ramp, s } from "./charanKit";

/* Ep2 "साढ़े साती के 3 चरण": the Flow shots. seq = layer start (XF before its cut),
   clip = source time at seq, end = the next cut. Graphic shots S6/S7/S9 and the
   Jyotiq ending are placed in the main file. Zoom stays <= 1.12 so Flow's corner
   mark is never pushed out of frame. */
export const XF = 6; // crossfade frames
type Shot = { src: string; seq: number; end: number; clip: number; zoom: [number, number]; origin?: string };
const P = "sadesaati-charan/";
const at = (cut: number) => s(cut) - XF;

export const SHOTS: Shot[] = [
  { src: P + "s1_circle.mp4", seq: 0, end: s(9.94), clip: 0, zoom: [1.0, 1.05] }, // hook: 30-year circle closes
  { src: "sadesaati/s1_manuscript.mp4", seq: at(9.94), end: s(15.45), clip: 3.5, zoom: [1.0, 1.04] }, // मैं हूँ बृहत् पाराशर...
  { src: P + "s3_leaves.mp4", seq: at(15.45), end: s(21.75), clip: 1.5, zoom: [1.0, 1.04] }, // एक जैसे नहीं होते
  { src: P + "s4_phases.mp4", seq: at(21.75), end: s(24.35), clip: 0.6, zoom: [1.0, 1.03] }, // पहला चरण: Saturn before the Moon
  { src: P + "s5_mandap.mp4", seq: at(24.35), end: s(31.58), clip: 0, zoom: [1.0, 1.02] }, // बेटी के विवाह की चिंता
  { src: P + "s4_phases.mp4", seq: at(31.58), end: s(34.15), clip: 3.3, zoom: [1.0, 1.03] }, // दूसरा चरण: Saturn on the Moon
  { src: P + "s4_phases.mp4", seq: at(44.41), end: s(47.74), clip: 6.2, zoom: [1.0, 1.03] }, // तीसरा चरण: Saturn after the Moon
  { src: P + "s3_leaves.mp4", seq: at(52.35), end: s(56.19), clip: 5.8, zoom: [1.04, 1.07] }, // हर चरण में... (leaves callback)
];

export const ShotLayer: React.FC<{ shot: Shot; first: boolean }> = ({ shot, first }) => {
  const f = useCurrentFrame();
  const dur = shot.end - shot.seq;
  const opacity = first ? 1 : ramp(f, 0, XF, 0, 1, Easing.linear);
  const z = interpolate(f, [0, dur], shot.zoom, clamp);
  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${z})`, transformOrigin: shot.origin ?? "50% 50%" }}>
      <OffthreadVideo
        src={staticFile(shot.src)}
        trimBefore={Math.round(shot.clip * FPS)}
        muted
        style={{ width: 1080, height: 1920, objectFit: "cover", filter: "contrast(1.05) saturate(1.08)" }}
      />
    </AbsoluteFill>
  );
};
