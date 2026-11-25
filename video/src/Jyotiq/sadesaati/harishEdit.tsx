import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FPS, clamp, ramp, s } from "./charanKit";

/* Ep4 "लोग कहते हैं... शनि देव जी दंड देते हैं।" (Raja Harishchandra, anime): the Flow shots.
   cut = where the shot takes over (VO seconds), srcAtCut = source time at that cut, rate = playback rate,
   xf = crossfade frames into the shot (0 = hard cut, or a seamless joint inside a speed ramp).
   Zoom stays <= 1.12 about the centre so Flow's corner mark (~900,1740) stays in frame. */
export const XF = 6;
const P = "sadesaati4/";

/** Set true once Ayush's shots 3a (crown on the throne) and 3b (queen and son walk away) are staged. */
export const HAVE_3AB = false;

export type Look = "none" | "ash" | "memory";
export type Shot4 = {
  src: string;
  seq: number;
  end: number;
  trim: number;
  rate: number;
  zoom: [number, number];
  origin?: string;
  xf: number;
  look: Look;
};

const shot = (
  file: string,
  cut: number,
  end: number,
  srcAtCut: number,
  zoom: [number, number],
  rate = 1,
  o: { xf?: number; origin?: string; look?: Look } = {},
): Shot4 => {
  const xf = cut === 0 ? 0 : o.xf ?? XF;
  const seq = s(cut) - xf;
  const lead = (s(cut) - seq) / FPS; // seconds of layer before its cut
  return {
    src: P + file,
    seq,
    end: s(end),
    trim: Math.max(0, srcAtCut - lead * rate),
    rate,
    zoom,
    origin: o.origin,
    xf,
    look: o.look ?? "none",
  };
};

/** Cut times on the measured VO (each just before its phrase starts). */
export const CUT = {
  s1b: 1.66, // "शनि देव जी..."
  s2: 3.72, // book (narrator speaks at 4.44)
  s3a: HAVE_3AB ? 11.62 : 11.72, // "राज्य चला गया"
  s3b: HAVE_3AB ? 13.1 : 13.02, // "परिवार बिछड़ गया"
  s4: 15.1, // "मान्यता है..."
  s4b: 16.0, // speed-ramp joint: the tilt runs at 2x
  s4c: 17.3, // Saturn beside the Moon on "साढ़ेसाती" (17.14-17.74)
  s5: 19.1, // "एक दिन रानी जी..."
  s6: 23.3, // "राजा हरिश्चंद्र जी ने शुल्क माँगा"
  s7: 26.1, // "रानी जी ने अपनी आधी साड़ी"
  s8: 27.9, // handoff ~28.5 on "दे दी"
  s9a: 34.8, // "उसी क्षण परीक्षा पूरी हुई"
  s9b: 37.4, // "और सब कुछ लौट आया"
  s10: 39.4, // "जो कष्ट मिला..."
  s11: 43.8, // "आपकी साढ़ेसाती कब शुरू होगी?"
};

const LINE3: Shot4[] = HAVE_3AB
  ? [
      shot("s03a_throne.mp4", CUT.s3a, CUT.s3b, 1.0, [1.0, 1.04]),
      shot("s03b_road.mp4", CUT.s3b, CUT.s4, 1.0, [1.0, 1.04]),
    ]
  : [
      // the palace keeps rising out of the book, then burns down to ash
      shot("s02_manuscript_open.mp4", CUT.s3a, CUT.s3b, 8.25, [1.06, 1.1], 1, { xf: 0, look: "ash" }),
      // the royal family as a fading memory (the same clip returns in full colour on "सब कुछ लौट आया")
      shot("s09b_royal_reunion.mp4", CUT.s3b, CUT.s4, 0.2, [1.04, 1.08], 0.85, { xf: 8, look: "memory" }),
    ];

export const SHOTS: Shot4[] = [
  shot("s01_hook_saturn.mp4", 0, CUT.s1b, 0, [1.0, 1.03]), // frame 0 = bright Saturn over the Kashi ghats
  shot("s01_hook_saturn.mp4", CUT.s1b, CUT.s2, 5.3, [1.0, 1.04], 0.9, { xf: 0 }), // worried pilgrims; skips the carved text (src ~1.9-5.2)
  shot("s02_manuscript_open.mp4", CUT.s2, CUT.s3a, 0.25, [1.0, 1.06]), // book opens on "हूँ", palace rises on "कथा सुनिए"
  ...LINE3,
  shot("s04_wanderer.mp4", CUT.s4, CUT.s4b, 3.9, [1.0, 1.0], 1, { xf: 8 }), // the king, now a wanderer
  shot("s04_wanderer.mp4", CUT.s4b, CUT.s4c, 4.8, [1.0, 1.0], 2, { xf: 0 }), // tilt up at 2x
  shot("s04_wanderer.mp4", CUT.s4c, CUT.s5, 7.4, [1.0, 1.04], 1, { xf: 0 }), // Saturn beside the Moon
  shot("s05_queen_arrives.mp4", CUT.s5, CUT.s6, 1.0, [1.0, 1.05]), // queen comes out of the smoke ~"रानी जी"
  shot("s06_keeper_fee.mp4", CUT.s6, CUT.s7, 4.0, [1.0, 1.04]), // tears, then the palm on "शुल्क माँगा"
  shot("s07_sari_offer.mp4", CUT.s7, CUT.s8, 2.6, [1.0, 1.03]), // tears the sari on "आधी साड़ी"
  shot("s08_cloth_duty.mp4", CUT.s8, CUT.s9a, 2.4, [1.0, 1.03]), // handoff on "दे दी", stands firm on "कर्तव्य नहीं छोड़ा"
  shot("s09a_family_light.mp4", CUT.s9a, CUT.s9b, 0.9, [1.0, 1.04], 1.3), // the boy appears in the light, mother's hug
  shot("s09b_royal_reunion.mp4", CUT.s9b, CUT.s10, 5.4, [1.0, 1.0]), // doves rise, pull back to the palace
  shot("s10_dawn_ghats.mp4", CUT.s10, CUT.s11, 3.2, [1.0, 1.03]), // the same Saturn, calm at dawn, the crow at rest
  shot("s11_manuscript_phone.mp4", CUT.s11, 47.5, 4.6, [1.0, 1.0], 1.3), // book glow -> phone-shaped light (static from src ~7.7)
];

const lookFilter = (look: Look, p: number): string => {
  if (look === "ash") {
    return `contrast(${1.05 + 0.12 * p}) saturate(${Math.max(0.12, 1.08 - 0.96 * p)}) brightness(${1 - 0.42 * p}) sepia(${0.35 * p})`;
  }
  if (look === "memory") {
    const dim = interpolate(p, [0.55, 1], [0, 0.32], clamp);
    return `sepia(0.62) saturate(0.5) contrast(1.02) brightness(${0.9 - dim})`;
  }
  return "contrast(1.05) saturate(1.08)";
};

export const ShotLayer4: React.FC<{ shot: Shot4 }> = ({ shot }) => {
  const f = useCurrentFrame();
  const dur = shot.end - shot.seq;
  const opacity = shot.xf > 0 ? ramp(f, 0, shot.xf, 0, 1, Easing.linear) : 1;
  const z = interpolate(f, [0, dur], shot.zoom, clamp);
  const p = interpolate(f, [0, dur], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${z})`, transformOrigin: shot.origin ?? "50% 50%" }}>
      <OffthreadVideo
        src={staticFile(shot.src)}
        trimBefore={Math.round(shot.trim * FPS)}
        playbackRate={shot.rate}
        muted
        style={{ width: 1080, height: 1920, objectFit: "cover", filter: lookFilter(shot.look, p) }}
      />
    </AbsoluteFill>
  );
};

/* Rising embers over the kingdom-lost beat (fallback line 3 only). Deterministic per index,
   and kept out of the box around Flow's corner mark so nothing passes over it. */
const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const Embers: React.FC<{ f: number; from: number; to: number }> = ({ f, from, to }) => {
  if (f < from || f > to) return null;
  const vis = Math.min(ramp(f, from, from + 12, 0, 1, Easing.linear), ramp(f, to - 12, to, 1, 0, Easing.linear));
  const t = (f - from) / FPS;
  return (
    <AbsoluteFill style={{ opacity: vis, pointerEvents: "none" }}>
      {Array.from({ length: 70 }, (_, i) => {
        const sp = 90 + rnd(i, 2) * 220; // px per second, upward
        const sz = 3 + rnd(i, 3) * 7;
        const y = 2050 - ((t * sp + rnd(i, 4) * 2100) % 2100);
        const x = rnd(i, 1) * 1080 + Math.sin(t * (0.8 + rnd(i, 5)) + i) * 26;
        if (x > 810 && x < 990 && y > 1650 && y < 1830) return null; // Flow mark stays clear
        const flick = 0.55 + 0.45 * Math.sin(t * (6 + rnd(i, 6) * 6) + i * 1.7);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: sz,
              height: sz,
              borderRadius: "50%",
              background: "#FFB45C",
              opacity: flick,
              boxShadow: `0 0 ${sz * 2.5}px ${sz}px rgba(255,140,40,0.55)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Gold-white bloom that carries the golden light into the palace on "और सब कुछ लौट आया". */
export const LightBloom: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const up = ramp(f, at - 7, at, 0, 0.82, Easing.in(Easing.quad));
  const down = ramp(f, at, at + 9, 0.82, 0, Easing.out(Easing.quad));
  const o = f < at ? up : down;
  if (o <= 0.001) return null;
  // Radiates from the light column (upper middle) and is fully transparent from 90% of its radius.
  // Flow's corner-mark box (x810-990, y1650-1830) lies beyond 100% (nearest corner at r = 1.01), so the
  // bloom never touches the mark and needs no mask (the old mask hole read as a dark disc mid-flash).
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 780px 1000px at 540px 700px, rgba(255,248,230,1) 0%, rgba(255,226,168,0.9) 40%, rgba(245,196,110,0.45) 68%, rgba(245,196,110,0) 90%)",
        opacity: o,
      }}
    />
  );
};
