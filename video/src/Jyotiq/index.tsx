import React from "react";
import { AbsoluteFill, Audio, Freeze, Sequence, staticFile, useCurrentFrame } from "remotion";
import { z } from "zod";
import { Backdrop } from "./motion";
import { R1Hook, R2Entry, R3Ask, R4Progress } from "./reelA";
import { R5Tour, R6Aha, R7Star, R8End } from "./reelB";
import { Punch, ReelBackdrop } from "./reelKit";
import { B1Hook, B2Entry, B3Ask, B4Progress } from "./scenesA";
import { B5Tour, B6Aha, B7Star, B8End } from "./scenesB";
import { BEATS, JyotiqProps, PALETTES, PaletteId, paletteIds, SANS, ThemeCtx } from "./theme";

export { jyotiqSchema } from "./theme";

const seq = (k: keyof typeof BEATS) => ({ from: BEATS[k][0], durationInFrames: BEATS[k][1] - BEATS[k][0] });

/** The launch film: 1920x1080, 30 fps, 991 frames, reference audio track. */
export const JyotiqLaunch: React.FC<JyotiqProps> = ({ palette, withAudio }) => {
  const t = PALETTES[palette];
  return (
    <ThemeCtx.Provider value={t}>
      <AbsoluteFill style={{ background: t.bg, overflow: "hidden" }}>
        <Backdrop />
        <Sequence {...seq("hook")} name="B1 Hook">
          <B1Hook />
        </Sequence>
        <Sequence {...seq("entry")} name="B2 Entry">
          <B2Entry />
        </Sequence>
        <Sequence {...seq("ask")} name="B3 Just ask">
          <B3Ask />
        </Sequence>
        <Sequence {...seq("progress")} name="B4 Progress">
          <B4Progress />
        </Sequence>
        <Sequence {...seq("tour")} name="B5 Tour">
          <B5Tour />
        </Sequence>
        <Sequence {...seq("aha")} name="B6 Aha">
          <B6Aha />
        </Sequence>
        <Sequence {...seq("star")} name="B7 Star">
          <B7Star />
        </Sequence>
        <Sequence {...seq("end")} name="B8 End">
          <B8End />
        </Sequence>
        {withAudio ? <Audio src={staticFile("audio.m4a")} /> : null}
      </AbsoluteFill>
    </ThemeCtx.Provider>
  );
};

/* ------------------------------------------------------------------ */
/* 9:16 Reel: 1080x1920, same beats, cut points and audio              */
/* ------------------------------------------------------------------ */

/** The Reel cut: same 8 beats and track, rebuilt for a phone screen, with a
    music-reactive layer (glow + embers on the kick, camera punches on hits). */
export const JyotiqReel: React.FC<JyotiqProps> = ({ palette, withAudio }) => {
  const t = PALETTES[palette];
  return (
    <ThemeCtx.Provider value={t}>
      <AbsoluteFill style={{ background: t.bg, overflow: "hidden" }}>
        <ReelBackdrop />
        <Punch>
          <Sequence {...seq("hook")} name="R1 Hook">
            <R1Hook />
          </Sequence>
          <Sequence {...seq("entry")} name="R2 Entry">
            <R2Entry />
          </Sequence>
          <Sequence {...seq("ask")} name="R3 Just ask">
            <R3Ask />
          </Sequence>
          <Sequence {...seq("progress")} name="R4 Progress">
            <R4Progress />
          </Sequence>
          <Sequence {...seq("tour")} name="R5 Tour">
            <R5Tour />
          </Sequence>
          <Sequence {...seq("aha")} name="R6 Ask flow">
            <R6Aha />
          </Sequence>
          <Sequence {...seq("star")} name="R7 Star">
            <R7Star />
          </Sequence>
          <Sequence {...seq("end")} name="R8 End">
            <R8End />
          </Sequence>
        </Punch>
        {withAudio ? <Audio src={staticFile("audio.m4a")} /> : null}
      </AbsoluteFill>
    </ThemeCtx.Provider>
  );
};

/** Review stills for the Reel (frame i = list[i], default REEL_KEYFRAMES). */
export const REEL_KEYFRAMES = [
  0, 30, 75, 125, 150, 175, 196, 214, 250, 292, 360, 425, 470, 500, 540, 600, 640, 652, 672, 700, 724, 745, 778, 805, 840, 960,
];

export const JyotiqReelKeyframes: React.FC<{ palette: PaletteId; list?: number[] }> = ({ palette, list }) => {
  const frame = useCurrentFrame();
  const frames = list && list.length > 0 ? list : REEL_KEYFRAMES;
  return (
    <Freeze frame={frames[Math.min(frame, frames.length - 1)]}>
      <JyotiqReel palette={palette} withAudio={false} />
    </Freeze>
  );
};

/* ------------------------------------------------------------------ */
/* Review helpers                                                      */
/* ------------------------------------------------------------------ */

/** Frames shown to the client for sign-off, two per beat. */
export const KEYFRAMES = [30, 75, 140, 188, 214, 262, 380, 434, 488, 522, 600, 700, 752, 778, 845, 960];

export const keyframesSchema = z.object({
  palette: z.enum(paletteIds),
  // Optional custom frame list (e.g. click / morph moments to check alignment).
  list: z.array(z.number()).optional(),
});

/** Frame i of this composition = list[i] (default KEYFRAMES) of the film, so one render gives every review still. */
export const JyotiqKeyframes: React.FC<{ palette: PaletteId; list?: number[] }> = ({ palette, list }) => {
  const frame = useCurrentFrame();
  const frames = list && list.length > 0 ? list : KEYFRAMES;
  return (
    <Freeze frame={frames[Math.min(frame, frames.length - 1)]}>
      <JyotiqLaunch palette={palette} withAudio={false} />
    </Freeze>
  );
};

/** 2x2 sheet: the same frame in each palette option, with hex swatches. */
export const JyotiqPalettes: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ background: "#050403" }}>
    {paletteIds.map((id, i) => {
      const p = PALETTES[id];
      const sw: [string, string][] = [
        ["BG", p.bg],
        ["Card", p.surface],
        ["Accent", p.gold],
        ["CTA", p.ctaTo],
        ["Text", p.text],
      ];
      return (
        <div
          key={id}
          style={{
            position: "absolute",
            left: (i % 2) * 960,
            top: Math.floor(i / 2) * 540,
            width: 960,
            height: 540,
            overflow: "hidden",
            outline: "2px solid #050403",
          }}
        >
          <div style={{ width: 1920, height: 1080, transform: "scale(0.5)", transformOrigin: "0 0" }}>
            <Freeze frame={frame}>
              <JyotiqLaunch palette={id} withAudio={false} />
            </Freeze>
          </div>
          <div
            style={{
              position: "absolute",
              left: 18,
              top: 18,
              padding: "12px 16px",
              borderRadius: 14,
              background: "rgba(0,0,0,0.72)",
              border: "1px solid rgba(255,255,255,0.18)",
              fontFamily: SANS,
              color: "#FFFFFF",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 22 }}>
              {i + 1}. {p.name}
              {i === 0 ? <span style={{ color: "#F3DB9D", fontSize: 15, marginLeft: 10 }}>RECOMMENDED</span> : null}
            </div>
            <div style={{ fontSize: 14, opacity: 0.75, marginTop: 2 }}>{p.note}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              {sw.map(([label, hex]) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 54, height: 26, borderRadius: 6, background: hex, border: "1px solid rgba(255,255,255,0.35)" }} />
                  <div style={{ fontSize: 11, opacity: 0.85 }}>{label}</div>
                  <div style={{ fontSize: 11, fontWeight: 700 }}>{hex.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    })}
  </AbsoluteFill>
);
