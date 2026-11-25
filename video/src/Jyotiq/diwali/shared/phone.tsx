import React from "react";
import { OffthreadVideo, Sequence, staticFile } from "remotion";
import { JAKARTA, ROZHA } from "../../manthan/graphics";
import { ramp, track } from "../../manthan/style";
import { GOLD_TXT, PILL } from "./endD";

/* Shared app shot for Diwali Days 2-5, generalised from d1/gfxD1.tsx AppPhoneD1. No timing imports: cues are props.
   - Only the real Jyotiq screen recording is shown. public jyotiq/diwali/d1/app.mp4 is upload ..._11111111.mp4 cut to
     2.27-9.6 s (221 frames), so the paywall after 9.6 s can never appear. If the shot outlasts the clip, playback
     slows just enough to fit (never a freeze, never a loop back to the start).
   - The phone rises in, floats and pushes 5% over the shot, so no span sits near-still (freezedetect).
   - chip: the feature pill under the phone (pops at chipAt). greeting: the festival line below it (at greetAt).
   Render it at the composition's top level with absolute frames (the Sequence uses from={at}). */

export const PHONE = { left: 310, top: 320, w: 460, h: 997 }; // 1080x2340 recording, scaled; clears the top diya row
export const APP_CLIP = "jyotiq/diwali/d1/app.mp4";
export const APP_CLIP_FRAMES = 221;

export const AppPhone: React.FC<{
  f: number;
  at: number;
  out: number;
  src?: string;
  clipFrames?: number;
  chip?: React.ReactNode;
  chipAt?: number;
  greeting?: string;
  greetAt?: number;
}> = ({ f, at, out, src = APP_CLIP, clipFrames = APP_CLIP_FRAMES, chip, chipAt = at + 45, greeting, greetAt = at + 75 }) => {
  const t = f - at;
  if (t < 0 || f > out + 10) return null;
  const span = Math.max(1, out - at + 10);
  const rate = Math.min(1, clipFrames / span);
  const a = ramp(t, 0, 12, "out");
  const o = 1 - ramp(f, out - 4, out + 10, "in");
  const ch = chip ? ramp(f, chipAt - 2, chipAt + 6, "out") : 0;
  const chPop = track(f - chipAt + 2, [[0, 0.7], [6, 1.12, "out"], [10, 1, "io"]]);
  const greet = greeting ? ramp(f, greetAt - 4, greetAt + 8, "out") : 0;
  const drift = 1 + 0.05 * ramp(f, at, out, "lin");
  const float = Math.sin(f / 22) * 6;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, transform: `translateY(${float}px) scale(${drift})`, transformOrigin: "50% 45%" }}>
      <div
        style={{
          position: "absolute", left: PHONE.left - 14, top: PHONE.top - 14, width: PHONE.w + 28, height: PHONE.h + 28, borderRadius: 64,
          background: "linear-gradient(160deg, #3A2A18, #120C06)", border: "3px solid rgba(223,177,91,0.85)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(255,201,77,0.25)",
          transform: `translateY(${(1 - a) * 260}px) rotate(${(1 - a) * -6}deg)`, opacity: a,
        }}
      >
        <div style={{ position: "absolute", left: 14, top: 14, width: PHONE.w, height: PHONE.h, borderRadius: 52, overflow: "hidden", background: "#000" }}>
          <Sequence from={at} durationInFrames={span} layout="none">
            <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{ width: PHONE.w, height: PHONE.h, objectFit: "cover" }} />
          </Sequence>
        </div>
      </div>
      {ch > 0 ? (
        <div style={{ position: "absolute", left: 0, width: 1080, top: PHONE.top + PHONE.h - 40, display: "flex", justifyContent: "center", opacity: ch }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 32px 12px", borderRadius: 46, ...PILL, border: "3px solid rgba(255,201,77,0.95)", boxShadow: "0 0 30px rgba(255,201,77,0.45)", transform: `scale(${chPop})` }}>
            {chip}
          </div>
        </div>
      ) : null}
      {greet > 0 ? (
        <div style={{ position: "absolute", left: 0, width: 1080, top: PHONE.top + PHONE.h + 70, display: "flex", justifyContent: "center", opacity: greet, transform: `translateY(${(1 - greet) * 18}px)` }}>
          <span style={{ fontFamily: ROZHA, fontSize: 60, color: "#FFE6A3", textShadow: `${GOLD_TXT}, 0 0 18px rgba(14,10,32,0.95)` }}>{greeting}</span>
        </div>
      ) : null}
    </div>
  );
};

/** Chip content: a gold Devanagari label plus a Latin tail, as on Day 1 ('फ़्री कुंडली · Jyotiq'). */
export const AppChip: React.FC<{ label: string; tail?: string }> = ({ label, tail = "· Jyotiq" }) => (
  <>
    <span style={{ fontFamily: ROZHA, fontSize: 58, color: "#FFD36B" }}>{label}</span>
    <span style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 40, color: "#FFF6E4" }}>{tail}</span>
  </>
);
