import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BrandBug } from "../manthan/graphics";

// Jyotiq reel opening ("Jyotiq light"): founder's idea, 10 Nov 2026.
// Motes of living light gather over Ayodhya into the diya flame, the logo is lit from that flame,
// then the logo shrinks into the corner badge while the first story shot begins.
// 1080x1920, 30 fps, 150 frames (5 s). Footage: Ayush's reference images animated with Veo.

export const OPEN_TOTAL = 150;
const W = 1080;
const H = 1920;

// Logo geometry (logo-icon.png is 444x366, flame centre at 214,235; brain ends about 59% down)
const ICON_W = 560;
const K = ICON_W / 444;
const F = { x: 540, y: 800 }; // flame point on screen
const ICON_L = F.x - 214 * K;
const ICON_T = F.y - 235 * K;
const ICON_H = 366 * K;
const WORD_W = 560;
// BrandBug icon box (manthan/graphics BrandBug: left 44, top 110, 66x54 contain)
const BUG = { l: 44, t: 110, w: 54 * (444 / 366) };

// Timeline
const T = { ignite: 30, brainA: 38, brainB: 60, wordA: 52, wordB: 66, moveA: 84, moveB: 104, bloomA: 80, swap: 92, bloomB: 106 };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ramp = (f: number, a: number, b: number, ease = Easing.out(Easing.cubic)) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });

// seeded noise (no Math.random)
const rnd = (i: number, k: number) => {
  const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const COLORS = ["#FFD98A", "#FFE7B0", "#FFC46B", "#FFD98A", "#FFE7B0", "#8FE6FF", "#B99BFF", "#FF9FCF"];
const N = 96;

const Motes: React.FC<{ f: number }> = ({ f }) => {
  const els = [];
  for (let i = 0; i < N; i++) {
    const x0 = rnd(i, 1) * W;
    const y0 = H * (0.25 + 0.75 * Math.pow(rnd(i, 2), 0.7)); // more of them low, rising from the diyas
    const size = 3 + rnd(i, 3) * 7;
    const col = COLORS[Math.floor(rnd(i, 4) * COLORS.length)];
    const rise = 0.6 + rnd(i, 5) * 1.6;
    const wob = rnd(i, 6) * Math.PI * 2;
    const t0 = 2 + rnd(i, 7) * 14;
    const dur = 18 + rnd(i, 8) * 9;
    // free drift
    const dx = x0 + Math.sin(f / 22 + wob) * 18;
    const dy = y0 - f * rise;
    // gather into the flame with a gentle spiral
    const p = interpolate(f, [t0, t0 + dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
    const dir = rnd(i, 9) > 0.5 ? 1 : -1;
    const th = p * 1.5 * dir;
    const vx = (dx - F.x) * (1 - p);
    const vy = (dy - F.y) * (1 - p);
    const x = F.x + vx * Math.cos(th) - vy * Math.sin(th);
    const y = F.y + vx * Math.sin(th) + vy * Math.cos(th);
    const tw = 0.6 + 0.4 * Math.sin(f / 5 + wob * 3);
    const o = (p < 0.85 ? 1 : interpolate(p, [0.85, 1], [1, 0])) * tw * interpolate(f, [0, 4], [0.7, 1], clamp);
    if (o <= 0.01) continue;
    const s = size * (1 - 0.4 * p);
    els.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: x - s / 2,
          top: y - s / 2,
          width: s,
          height: s,
          borderRadius: "50%",
          background: col,
          opacity: o,
          boxShadow: `0 0 ${s * 2.2}px ${s * 0.8}px ${col}`,
        }}
      />,
    );
  }
  return <>{els}</>;
};

// After ignition a few motes keep orbiting the logo so it feels alive
const Orbit: React.FC<{ f: number; o: number }> = ({ f, o }) => {
  const els = [];
  for (let i = 0; i < 18; i++) {
    const r = 250 + rnd(i, 11) * 170;
    const a = rnd(i, 12) * Math.PI * 2 + (f / 60) * (rnd(i, 13) > 0.5 ? 1 : -1);
    const x = F.x + Math.cos(a) * r;
    const y = F.y + 40 + Math.sin(a) * r * 0.75;
    const s = 3 + rnd(i, 14) * 4;
    const col = COLORS[i % COLORS.length];
    els.push(
      <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: col, opacity: o * (0.5 + 0.5 * Math.sin(f / 6 + i)), boxShadow: `0 0 ${s * 2}px ${col}` }} />,
    );
  }
  return <>{els}</>;
};

export const JyotiqReelOpen: React.FC = () => {
  const f = useCurrentFrame();

  // background: Ayodhya ghat at night, then the first story shot (aerial dawn)
  const dim = interpolate(f, [0, 24, T.moveA, T.swap], [0.18, 0.5, 0.5, 0.2], clamp);
  const scrim = interpolate(f, [16, 36, T.moveA, T.swap], [0, 1, 1, 0], clamp);

  // ignition
  const burst = interpolate(f, [T.ignite - 2, T.ignite + 4, T.ignite + 22], [0, 1, 0.35], clamp);
  const breathe = f > T.ignite + 22 ? 0.35 + 0.08 * Math.sin((f - T.ignite) / 7) : 0;
  const glow = Math.max(burst, breathe) * interpolate(f, [T.moveA, T.moveA + 10], [1, 0], clamp);

  // logo reveal: diya first, then the brain is lit from the flame upward
  const diyaO = ramp(f, T.ignite, T.ignite + 8);
  const brain = ramp(f, T.brainA, T.brainB, Easing.inOut(Easing.cubic));
  const clipTop = 59 * (1 - brain);
  const wordO = ramp(f, T.wordA, T.wordB);

  // move into the corner badge
  const m = ramp(f, T.moveA, T.moveB, Easing.inOut(Easing.cubic));
  const iw = interpolate(m, [0, 1], [ICON_W, BUG.w]);
  const il = interpolate(m, [0, 1], [ICON_L, BUG.l]);
  const it = interpolate(m, [0, 1], [ICON_T, BUG.t]);
  const iconO = interpolate(f, [T.moveB, T.moveB + 8], [1, 0], clamp);
  const wordFade = 1 - ramp(f, T.moveA, T.moveA + 10);
  const bugO = ramp(f, T.moveB - 2, T.moveB + 8);

  // light bloom that carries us into the story
  const bloomS = interpolate(f, [T.bloomA, T.swap], [0.2, 3.2], { ...clamp, easing: Easing.in(Easing.quad) });
  const bloomO = interpolate(f, [T.bloomA, T.swap - 4, T.swap + 2, T.bloomB], [0, 0.9, 0.9, 0], clamp);

  return (
    <AbsoluteFill style={{ background: "#0b0716", overflow: "hidden" }}>
      {/* Ayodhya ghat at night */}
      {f < T.swap + 2 && (
        <AbsoluteFill style={{ transform: `scale(${1.04 + f * 0.0006})` }}>
          <OffthreadVideo src={staticFile("jyotiq/brandopen/g01.mp4")} muted style={{ width: W, height: H, objectFit: "cover" }} />
        </AbsoluteFill>
      )}
      {/* first story shot: Ayodhya at dawn */}
      <Sequence from={T.swap}>
        <AbsoluteFill style={{ transform: `scale(${1.08 - (f - T.swap) * 0.0005})` }}>
          <OffthreadVideo src={staticFile("jyotiq/brandopen/g02.mp4")} muted style={{ width: W, height: H, objectFit: "cover" }} />
        </AbsoluteFill>
      </Sequence>

      {/* dim + soft dark halo behind the logo for legibility */}
      <AbsoluteFill style={{ background: "#0b0716", opacity: dim }} />
      <AbsoluteFill style={{ opacity: scrim * 0.75, background: `radial-gradient(42% 30% at 50% ${((F.y + 80) / H) * 100}%, rgba(8,4,20,0.85) 0%, rgba(8,4,20,0) 100%)` }} />

      {/* the flame's light */}
      <div
        style={{
          position: "absolute",
          left: F.x - 450,
          top: F.y - 450,
          width: 900,
          height: 900,
          borderRadius: "50%",
          opacity: glow,
          background: "radial-gradient(circle, rgba(255,236,190,0.95) 0%, rgba(255,196,107,0.45) 18%, rgba(255,160,90,0.12) 42%, rgba(255,160,90,0) 70%)",
          transform: `scale(${0.6 + burst * 0.6})`,
        }}
      />

      <Motes f={f} />
      <Orbit f={f} o={ramp(f, T.ignite + 10, T.ignite + 30) * (1 - ramp(f, T.moveA, T.moveA + 8))} />

      {/* the logo */}
      {f >= T.ignite && iconO > 0 && (
        <Img
          src={staticFile("jyotiq/logo-icon.png")}
          style={{
            position: "absolute",
            left: il,
            top: it,
            width: iw,
            height: (iw * 366) / 444,
            opacity: diyaO * iconO,
            clipPath: `inset(${clipTop}% 0 0 0)`,
            filter: `drop-shadow(0 0 ${18 * (1 - m)}px rgba(255,214,140,0.65))`,
          }}
        />
      )}
      {wordO * wordFade > 0 && (
        <Img
          src={staticFile("jyotiq/logo-wordmark.png")}
          style={{
            position: "absolute",
            left: F.x - WORD_W / 2,
            top: ICON_T + ICON_H + 18 + (1 - wordO) * 24,
            width: WORD_W,
            opacity: wordO * wordFade,
            filter: "drop-shadow(0 0 16px rgba(255,170,120,0.55))",
          }}
        />
      )}

      {/* bloom into the story */}
      <div
        style={{
          position: "absolute",
          left: F.x - 600,
          top: F.y - 600,
          width: 1200,
          height: 1200,
          borderRadius: "50%",
          opacity: bloomO,
          transform: `scale(${bloomS})`,
          background: "radial-gradient(circle, rgba(255,246,222,1) 0%, rgba(255,226,170,0.9) 35%, rgba(255,210,150,0) 70%)",
        }}
      />

      {/* the badge that stays through the reel */}
      {bugO > 0 && <BrandBug o={bugO} />}

      <Audio src={staticFile("jyotiq/brandopen/sonic.wav")} />
    </AbsoluteFill>
  );
};
