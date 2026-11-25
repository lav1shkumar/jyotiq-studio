import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Shockwave } from "../bbreel/anime";
import { AppStoreButton, PlayButton, SparkBurst } from "../katha/reelKit";
import { SANS } from "../theme";
import { GOLD } from "./prims";
import { hit, pop, ramp, track } from "./timing";
import { E2, VO_AT } from "./timing2";

/* S5 — brand lockup in the Cantina reference style: hard cut to black, the
   wordmark slams in ~2.8x oversized and tilted with heavy motion blur, snaps
   to rest in ~0.3 s as a die-cut sticker (white backing, dark extrusion, thin
   ink line) at a -6 degree tilt, then holds. Jyotiq adds its diya-brain
   symbol popping in above (flame flare), a shockwave + sparks on the settle,
   a light sweep, and the store CTA. The brand VO (Ayush's ElevenLabs line)
   is meant to start at VO_AT, 0.2 s after the slam, like Cantina's. */

const WM = { w: 640, h: 196 }; // wordmark at rest (source 444 x 136)
const WM_C = { x: 540, y: 958 };
const SYM = { w: 400, h: 330, cx: 540, cy: 636 }; // diya-brain symbol (source 444 x 366)

const slam = (t: number) => {
  const idle = Math.max(0, t - 11);
  return {
    s: track(t, [
      [0, 2.8],
      [5, 0.92, "out"],
      [8, 1.03, "io"],
      [11, 1, "io"],
    ]),
    r: track(t, [
      [0, -16],
      [5, -4, "out"],
      [9, -6, "io"],
    ]) + Math.sin(idle / 14) * 0.6,
    x: track(t, [
      [0, 150],
      [5, -10, "out"],
      [9, 0, "io"],
    ]),
    y: track(t, [
      [0, -70],
      [5, 8, "out"],
      [9, 0, "io"],
    ]) + Math.sin(idle / 9) * 4,
  };
};

const StickerDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <filter id="lk-sticker" x="-20%" y="-45%" width="140%" height="190%" colorInterpolationFilters="sRGB">
        {/* dark plate: the word's silhouette with counters and letter gaps closed (Cantina look) */}
        <feComponentTransfer in="SourceAlpha" result="hard">
          <feFuncA type="linear" slope="4" intercept="-1.5" />
        </feComponentTransfer>
        <feMorphology in="hard" operator="dilate" radius="26" result="d26" />
        <feMorphology in="d26" operator="erode" radius="22" result="closed" />
        <feFlood floodColor="#160C1E" result="plateC" />
        <feComposite in="plateC" in2="closed" operator="in" result="plate" />
        {/* white die-cut backing around the plate + its pale edge (sticker thickness) */}
        <feMorphology in="closed" operator="dilate" radius="14" result="fat" />
        <feFlood floodColor="#FFFFFF" result="w" />
        <feComposite in="w" in2="fat" operator="in" result="backing" />
        <feOffset in="fat" dx="7" dy="11" result="fatOff" />
        <feFlood floodColor="#B9B0C6" result="edgeC" />
        <feComposite in="edgeC" in2="fatOff" operator="in" result="edge" />
        {/* plum 3D extrusion under the gradient letters */}
        <feOffset in="hard" dx="5" dy="8" result="ex" />
        <feFlood floodColor="#5A2346" result="exC" />
        <feComposite in="exC" in2="ex" operator="in" result="extrude" />
        <feMerge>
          <feMergeNode in="edge" />
          <feMergeNode in="backing" />
          <feMergeNode in="plate" />
          <feMergeNode in="extrude" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  </svg>
);

/** One-frame bake of the sticker wordmark at 2x (transparent PNG). Render with:
 *  npx remotion still JyotiqStickerBake public/jyotiq/shooter/sticker-wordmark@2x.png --image-format=png */
export const STICKER_PAD = 40;
export const StickerBake: React.FC = () => (
  <AbsoluteFill>
    <StickerDefs />
    <svg width={(WM.w + 2 * STICKER_PAD) * 2} height={(WM.h + 2 * STICKER_PAD + 8) * 2} viewBox={`${-STICKER_PAD} ${-STICKER_PAD} ${WM.w + 2 * STICKER_PAD} ${WM.h + 2 * STICKER_PAD + 8}`} style={{ position: "absolute", left: 0, top: 0 }}>
      <image href={staticFile("jyotiq/logo-wordmark.png")} x={0} y={0} width={WM.w} height={WM.h} filter="url(#lk-sticker)" />
    </svg>
  </AbsoluteFill>
);
export const STICKER_BAKE_W = (WM.w + 2 * STICKER_PAD) * 2;
export const STICKER_BAKE_H = (WM.h + 2 * STICKER_PAD + 8) * 2;

const Wordmark: React.FC<{ t: number; sweep: number }> = ({ t, sweep }) => {
  const st = slam(t);
  return (
    <div
      style={{
        position: "absolute",
        left: WM_C.x - WM.w / 2,
        top: WM_C.y - WM.h / 2,
        width: WM.w,
        height: WM.h,
        transform: `translate(${st.x}px, ${st.y}px) rotate(${st.r}deg) scale(${st.s})`,
        transformOrigin: "50% 50%",
      }}
    >
      <Img src={staticFile("jyotiq/shooter/sticker-wordmark@2x.png")} style={{ position: "absolute", left: -STICKER_PAD, top: -STICKER_PAD, width: WM.w + 2 * STICKER_PAD, height: WM.h + 2 * STICKER_PAD + 8 }} />
      {sweep > 0 && sweep < 1 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            WebkitMaskImage: `url(${staticFile("jyotiq/logo-wordmark.png")})`,
            WebkitMaskSize: "100% 100%",
            background: `linear-gradient(105deg, transparent ${sweep * 140 - 30}%, rgba(255,255,255,0.85) ${sweep * 140 - 18}%, transparent ${sweep * 140 - 6}%)`,
          }}
        />
      ) : null}
    </div>
  );
};

export const S5Lockup: React.FC<{ f: number }> = ({ f }) => {
  const t = f - E2.lock;
  // motion blur on the slam: average sub-frame samples (running-average opacities)
  const N = t < 7 ? 10 : 1;
  const samples = new Array(N).fill(0).map((_, k) => t - (N - 1 - k) * (1.0 / N));
  const sweep = ramp(t, 24, 40, "io");
  const symS = track(t, [
    [5, 0],
    [11, 1.12, "out"],
    [15, 1, "io"],
  ]);
  const symY = track(t, [
    [5, 50],
    [11, -8, "out"],
    [15, 0, "io"],
  ]) + Math.sin(Math.max(0, t - 15) / 10) * 5;
  const flare = hit(t, 9, 16);
  const flick = 0.85 + 0.15 * Math.sin(f * 0.9) * Math.sin(f * 0.37);
  const bloom = 0.55 + 0.45 * hit(t, 4, 18);
  const ctaV = pop(t, 28, 9);
  const b1 = pop(t, 34, 9);
  const b2 = pop(t, 39, 9);
  return (
    <AbsoluteFill style={{ background: "#050404", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 44%, rgba(240,184,72,${0.2 * bloom}) 0%, rgba(224,80,136,${0.08 * bloom}) 32%, transparent 58%)` }} />
      {t >= 5 ? <Shockwave f={t} at={5} x={WM_C.x} y={WM_C.y - 120} size={1.5} color="#FFE7A8" /> : null}
      <SparkBurst x={WM_C.x} y={WM_C.y - 140} t={(t - 5) / 16} n={14} r={340} />
      {/* diya-brain symbol */}
      {t >= 5 ? (
        <div
          style={{
            position: "absolute",
            left: SYM.cx - SYM.w / 2,
            top: SYM.cy - SYM.h / 2 + symY,
            width: SYM.w,
            height: SYM.h,
            transform: `scale(${symS})`,
            transformOrigin: "50% 70%",
            opacity: Math.min(1, ramp(t, 5, 8) * 1.2),
            filter: `drop-shadow(0 0 ${18 + 40 * flare}px rgba(248,208,128,${0.55 + 0.35 * flare})) drop-shadow(0 0 ${8 + 10 * flick}px rgba(152,136,216,0.55))`,
          }}
        >
          <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: SYM.w, height: SYM.h }} />
          {/* flame flare */}
          <div style={{ position: "absolute", left: 192 - 70, top: 213 - 110, width: 140, height: 160, borderRadius: "50%", background: `radial-gradient(ellipse at 50% 60%, rgba(255,236,170,${0.55 * flare + 0.18 * flick}) 0%, transparent 70%)` }} />
        </div>
      ) : null}
      {/* the slam */}
      {samples.map((ts, k) => (
        <div key={k} style={{ position: "absolute", inset: 0, opacity: 1 / (k + 1) }}>
          <Wordmark t={ts} sweep={sweep} />
        </div>
      ))}
      {/* CTA */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1168,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 44,
          color: "#F5ECDD",
          opacity: Math.min(1, ctaV * 1.4),
          transform: `translateY(${(1 - ctaV) * 30}px)`,
          textShadow: "0 4px 14px rgba(0,0,0,0.6)",
        }}
      >
        Download on <span style={{ color: GOLD }}>Play Store</span> and <span style={{ color: GOLD }}>App Store</span>
      </div>
      <div style={{ position: "absolute", left: 540, top: 1310, transform: "translate(-50%, -50%) scale(0.76)", display: "flex", gap: 34, whiteSpace: "nowrap" }}>
        <div style={{ transform: `translateY(${(1 - b1) * 70}px) scale(${0.6 + 0.4 * b1})`, opacity: Math.min(1, b1 * 1.5) }}>
          <PlayButton glow={0.35 + 0.65 * hit(t, 34, 14)} />
        </div>
        <div style={{ transform: `translateY(${(1 - b2) * 70}px) scale(${0.6 + 0.4 * b2})`, opacity: Math.min(1, b2 * 1.5) }}>
          <AppStoreButton glow={0.35 + 0.65 * hit(t, 39, 14)} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Frames after the slam when the brand VO may play (for the audio script / docs). */
export const LOCKUP_VO_FROM = VO_AT - E2.lock;
