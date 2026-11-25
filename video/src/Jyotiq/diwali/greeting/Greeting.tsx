import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadRozha } from "@remotion/google-fonts/RozhaOne";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadTiro } from "@remotion/google-fonts/TiroDevanagariHindi";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";

/* Jyotiq Diwali greeting (story / reel, 14 s). One diya lights, its flame draws a North Indian kundli, the 12 houses
   light one by one, the chart blooms into a rangoli under fireworks, the greeting lands, and the centre flame becomes
   the Jyotiq logo. Brand: gold #DFB15B on warm black #0C0A07, logo gradient for the fireworks.
   Render with --public-dir=../diwali-greeting/public. */

export const GREETING_TOTAL = 420;
const FPS = 30;
const ROZHA = loadRozha("normal", { weights: ["400"], subsets: ["devanagari", "latin"] }).fontFamily;
const PLAY = loadPlayfair("italic", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;
const TIRO = loadTiro("normal", { weights: ["400"], subsets: ["devanagari"] }).fontFamily;
const JAK = loadJakarta("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;

const GOLD = "#DFB15B";
const GOLD_HI = "#F3DB9D";
const FLAME = "#F8D060";
const BG = "#0C0A07";
const FIRE = ["#E05088", "#E86070", "#F07858", "#F0A048", "#F0B848", "#40D8E8", "#9888D8"];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const k = (t: number, a: number, b: number, from: number, to: number, ease = Easing.bezier(0.16, 1, 0.3, 1)) =>
  interpolate(t, [a, b], [from, to], { ...clamp, easing: ease });
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* timeline (s) */
export const T = {
  ignite: 0.12,
  draw: 0.7,
  drawEnd: 2.55,
  house0: 2.6,
  houseStep: 0.16,
  bloom: 4.85,
  fw: [4.9, 5.5, 6.15, 7.05, 8.05, 9.15, 11.7, 12.6],
  title: 5.6,
  line: 7.0,
  morph: 9.8,
  logo: 10.3,
  url: 11.0,
};
export const houseAt = (i: number) => T.house0 + i * T.houseStep;

const CX = 540;
const CY = 1010;
const R = 330; // half side of the chart square

/* house centres in chart units (-1..1), house 1 at the top, counter-clockwise as in the North Indian chart */
const HOUSES: [number, number][] = [
  [0, -0.5], [-0.5, -0.83], [-0.83, -0.5], [-0.5, 0], [-0.83, 0.5], [-0.5, 0.83],
  [0, 0.5], [0.5, 0.83], [0.83, 0.5], [0.5, 0], [0.83, -0.5], [0.5, -0.83],
];

const Flame: React.FC<{ x: number; y: number; s: number; t: number; seed: number; o?: number }> = ({ x, y, s, t, seed, o = 1 }) => {
  const fl = 1 + 0.08 * Math.sin(t * 19 + seed) + 0.05 * Math.sin(t * 31 + seed * 2);
  const sway = 3 * Math.sin(t * 7 + seed);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <circle cx={0} cy={-26} r={46 * fl} fill="url(#halo)" />
      <path d={`M0 ${-58 * fl} C ${14 + sway} -36, 14 -12, 0 -4 C -14 -12, ${-14 + sway} -36, 0 ${-58 * fl} Z`} fill="url(#flame)" />
      <path d={`M0 ${-36 * fl} C 6 -24, 6 -12, 0 -8 C -6 -12, -6 -24, 0 ${-36 * fl} Z`} fill="#FFF6D8" />
    </g>
  );
};

const Diya: React.FC<{ x: number; y: number; s: number; t: number; lit: number; seed: number; appear: number }> = ({ x, y, s, t, lit, seed, appear }) => (
  <g opacity={appear}>
    <g transform={`translate(${x} ${y}) scale(${s * (0.6 + 0.4 * appear)})`}>
      <path d="M-34 0 C -30 22, 30 22, 34 0 Z" fill="url(#bowl)" stroke={GOLD_HI} strokeWidth={1.5} />
      <ellipse cx={0} cy={0} rx={34} ry={6} fill="#5a2a0c" stroke={GOLD} strokeWidth={1.5} />
      <path d="M26 -2 Q 38 -6 40 -12" stroke={GOLD} strokeWidth={3} fill="none" strokeLinecap="round" />
    </g>
    {lit > 0 ? <Flame x={x} y={y - 2 * s} s={s * Math.min(1, lit)} t={t} seed={seed} /> : null}
  </g>
);

/* chart line paths in pixels */
const P = (u: number, v: number) => `${CX + u * R} ${CY + v * R}`;
const SQUARE = `M ${P(0, -1)} L ${P(1, -1)} L ${P(1, 1)} L ${P(-1, 1)} L ${P(-1, -1)} Z`;
const DIAG = `M ${P(-1, -1)} L ${P(1, 1)} M ${P(1, -1)} L ${P(-1, 1)}`;
const DIAMOND = `M ${P(0, -1)} L ${P(1, 0)} L ${P(0, 1)} L ${P(-1, 0)} Z`;

const Chart: React.FC<{ t: number }> = ({ t }) => {
  const d1 = k(t, T.draw, T.draw + 1.0, 0, 1, Easing.inOut(Easing.cubic));
  const d2 = k(t, T.draw + 0.55, T.draw + 1.5, 0, 1, Easing.inOut(Easing.cubic));
  const d3 = k(t, T.draw + 0.95, T.drawEnd, 0, 1, Easing.inOut(Easing.cubic));
  const glow = k(t, T.bloom - 0.1, T.bloom + 0.4, 0, 1) * (1 - k(t, T.bloom + 0.4, T.bloom + 2.2, 0, 0.6));
  const out = k(t, T.morph, T.morph + 0.8, 1, 0, Easing.in(Easing.cubic));
  const sw = 4 + 4 * glow;
  const line = (d: string, p: number) => (
    <path d={d} pathLength={1000} fill="none" stroke={GOLD} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: `${1000 * p} 1000` }} />
  );
  return (
    <g opacity={out} style={{ filter: `drop-shadow(0 0 ${8 + 22 * glow}px rgba(243,219,157,${0.55 + 0.4 * glow}))` }}>
      {line(SQUARE, d1)}
      {line(DIAG, d2)}
      {line(DIAMOND, d3)}
    </g>
  );
};

const Houses: React.FC<{ t: number }> = ({ t }) => {
  const out = k(t, T.morph, T.morph + 0.7, 1, 0, Easing.in(Easing.cubic));
  return (
    <g opacity={out}>
      {HOUSES.map(([u, v], i) => {
        const at = houseAt(i);
        const big = i % 3 === 0;
        const appear = k(t, at - 0.12, at + 0.1, 0, 1);
        const lit = k(t, at, at + 0.2, 0, 1);
        const num = k(t, at + 0.05, at + 0.3, 0, 1);
        const x = CX + u * R;
        const y = CY + v * R + (big ? 26 : 18);
        return (
          <g key={i}>
            <Diya x={x} y={y} s={big ? 1.05 : 0.72} t={t} lit={lit} seed={i * 1.7} appear={appear} />
            <text x={x} y={y + (big ? 52 : 40)} textAnchor="middle" fontFamily={JAK} fontWeight={700} fontSize={big ? 22 : 18} fill={GOLD_HI} opacity={0.75 * num}>{i + 1}</text>
          </g>
        );
      })}
    </g>
  );
};

/* rangoli rings that bloom from the chart */
const Rangoli: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  if (t < T.bloom - 0.05) return null;
  const sp = spring({ frame: f - Math.round(T.bloom * FPS), fps: FPS, config: { damping: 16, mass: 0.9, stiffness: 70 } });
  const out = k(t, T.morph, T.morph + 0.9, 1, 0, Easing.in(Easing.cubic));
  const rot = (t - T.bloom) * 6;
  const rings = [
    { n: 12, r: 780, rx: 70, ry: 150, c: "#7B3306", o: 0.55 },
    { n: 24, r: 700, rx: 34, ry: 92, c: "#E86070", o: 0.55 },
    { n: 16, r: 880, rx: 44, ry: 110, c: "#F0A048", o: 0.6 },
    { n: 32, r: 980, rx: 16, ry: 40, c: GOLD_HI, o: 0.7 },
  ];
  return (
    <g opacity={out} transform={`translate(${CX} ${CY}) scale(${0.4 + 0.6 * sp}) rotate(${rot})`}>
      {rings.map((ring, j) => (
        <g key={j} transform={`rotate(${j % 2 ? -rot * 1.6 : rot * 0.6})`} opacity={ring.o * Math.min(1, sp * 1.4)}>
          {Array.from({ length: ring.n }, (_, i) => (
            <ellipse key={i} cx={0} cy={-ring.r * 0.5} rx={ring.rx * 0.5} ry={ring.ry * 0.5} fill={ring.c} transform={`rotate(${(360 / ring.n) * i})`} />
          ))}
        </g>
      ))}
      <circle r={700 * 0.5 + 140} fill="none" stroke={GOLD} strokeWidth={2} strokeDasharray="4 14" opacity={0.6 * sp} />
      {Array.from({ length: 48 }, (_, i) => {
        const a = (i / 48) * Math.PI * 2;
        return <circle key={i} cx={Math.cos(a) * 452} cy={Math.sin(a) * 452} r={4} fill={GOLD_HI} opacity={0.8 * sp} />;
      })}
    </g>
  );
};

/* fireworks in the logo gradient's colours */
const Fireworks: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {T.fw.map((at, b) => {
      const age = t - at;
      if (age < -0.6 || age > 2.4) return null;
      const bx = [300, 790, 520, 220, 860, 560, 250, 830][b];
      const by = [330, 260, 210, 470, 420, 300, 360, 300][b];
      const col = FIRE[(b * 3) % FIRE.length];
      const col2 = FIRE[(b * 3 + 2) % FIRE.length];
      if (age < 0) {
        // rising trail
        const p = 1 + age / 0.6;
        return <circle key={b} cx={bx} cy={by + (1 - p) * 700} r={4} fill={GOLD_HI} opacity={0.9} />;
      }
      const n = 54;
      const fade = Math.max(0, 1 - age / 2.2);
      return (
        <g key={b} style={{ mixBlendMode: "screen" }}>
          {age < 0.12 ? <circle cx={bx} cy={by} r={70 * (1 - age / 0.12)} fill="#FFF3D6" opacity={0.8} /> : null}
          {Array.from({ length: n }, (_, i) => {
            const a = (i / n) * Math.PI * 2 + rnd(b * 99 + i) * 0.2;
            const sp = 330 + rnd(b * 7 + i) * 140;
            const d = sp * (1 - Math.exp(-age * 2.4)) / 2.4 * 2.2;
            const x = bx + Math.cos(a) * d;
            const y = by + Math.sin(a) * d + 60 * age * age;
            const tw = 0.6 + 0.4 * Math.sin(t * 40 + i);
            return (
              <g key={i}>
                <line x1={bx + Math.cos(a) * d * 0.82} y1={by + Math.sin(a) * d * 0.82 + 60 * age * age * 0.8} x2={x} y2={y} stroke={i % 2 ? col : col2} strokeWidth={3} strokeLinecap="round" opacity={fade * 0.8} />
                <circle cx={x} cy={y} r={3.4} fill={i % 3 ? col : "#FFF3D6"} opacity={fade * tw} />
              </g>
            );
          })}
        </g>
      );
    })}
  </g>
);

/* embers rising, stars twinkling */
const Atmos: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {Array.from({ length: 70 }, (_, i) => {
      const x = rnd(i) * 1080;
      const y = rnd(i + 500) * 900;
      const tw = 0.25 + 0.75 * Math.abs(Math.sin(t * (0.8 + rnd(i + 9) * 2) + i));
      return <circle key={`s${i}`} cx={x} cy={y} r={0.8 + rnd(i + 3) * 1.6} fill="#FFF3D6" opacity={0.5 * tw * k(t, 0, 1.5, 0.45, 1)} />;
    })}
    {Array.from({ length: 46 }, (_, i) => {
      const speed = 40 + rnd(i + 70) * 70;
      const y = 1920 - ((t * speed + rnd(i + 40) * 1920) % 1920);
      const x = rnd(i + 20) * 1080 + 26 * Math.sin(t * 0.9 + i);
      const o = k(t, 0.6, 2.2, 0, 1) * (0.35 + 0.5 * rnd(i + 11)) * Math.min(1, y / 600);
      return <circle key={`e${i}`} cx={x} cy={y} r={1.5 + rnd(i + 5) * 2.8} fill={i % 4 ? "#F0A048" : GOLD_HI} opacity={o} />;
    })}
  </g>
);

const Defs: React.FC = () => (
  <defs>
    <radialGradient id="halo"><stop offset="0" stopColor="#FFD98A" stopOpacity="0.75" /><stop offset="0.4" stopColor="#F0A048" stopOpacity="0.25" /><stop offset="1" stopColor="#F0A048" stopOpacity="0" /></radialGradient>
    <linearGradient id="flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#F07858" /><stop offset="0.45" stopColor={FLAME} /><stop offset="1" stopColor="#FFF3C0" /></linearGradient>
    <linearGradient id="bowl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C46A2B" /><stop offset="1" stopColor="#6B2A0A" /></linearGradient>
  </defs>
);

/* the first diya, centre of the chart; its flame becomes the logo */
const CentreDiya: React.FC<{ t: number }> = ({ t }) => {
  const appear = 1;
  const lit = k(t, T.ignite, T.ignite + 0.35, 0, 1);
  const out = k(t, T.morph + 0.2, T.logo + 0.2, 1, 0);
  const grow = 1 + k(t, T.morph - 0.2, T.morph + 0.5, 0, 0.8, Easing.inOut(Easing.cubic));
  return (
    <g opacity={out}>
      <circle cx={CX} cy={CY - 30} r={260 * lit} fill="url(#halo)" opacity={0.6} />
      <Diya x={CX} y={CY + 10} s={1.5 * grow} t={t} lit={lit} seed={0.3} appear={appear} />
    </g>
  );
};

const GoldText: React.FC<{ children: React.ReactNode; style: React.CSSProperties; shine: number }> = ({ children, style, shine }) => (
  <div style={{ backgroundImage: `linear-gradient(105deg, rgba(255,250,235,0) ${shine}%, rgba(255,250,235,0.95) ${shine + 5}%, rgba(255,250,235,0) ${shine + 10}%), linear-gradient(180deg, #FFF1C9 0%, ${GOLD_HI} 35%, ${GOLD} 70%, #A87232 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", ...style }}>{children}</div>
);

/* the opening line at the top while the chart builds: new-moon night, twelve houses, twelve lamps */
const Intro: React.FC<{ t: number }> = ({ t }) => {
  const a = k(t, 0.0, 0.6, 0, 1) * (1 - k(t, 2.3, 2.7, 0, 1));
  const b = k(t, 2.7, 3.2, 0, 1) * (1 - k(t, T.bloom - 0.3, T.bloom + 0.1, 0, 1));
  const st: React.CSSProperties = { position: "absolute", top: 300, width: "100%", textAlign: "center", fontFamily: TIRO, fontSize: 68, color: "#FBF1DC", textShadow: "0 2px 22px rgba(0,0,0,0.8)" };
  return (
    <>
      {a > 0 ? <div style={{ ...st, opacity: a, transform: `translateY(${(1 - a) * 16}px)` }}>अमावस्या की रात...</div> : null}
      {b > 0 ? <div style={{ ...st, opacity: b, transform: `translateY(${(1 - b) * 16}px)` }}>बारह घर, <span style={{ color: GOLD_HI }}>बारह दीये।</span></div> : null}
    </>
  );
};

const Titles: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const sp = spring({ frame: f - Math.round(T.title * FPS), fps: FPS, config: { damping: 14, mass: 0.8 } });
  const ln = k(t, T.line, T.line + 0.8, 0, 1);
  const en = k(t, T.line + 0.5, T.line + 1.3, 0, 1);
  const out = k(t, T.morph, T.morph + 0.6, 1, 0, Easing.in(Easing.cubic));
  const shine = ((t - T.title - 0.4) / 1.4) * 140 - 20;
  if (t < T.title) return null;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", top: 210, width: "100%", textAlign: "center", fontFamily: PLAY, fontStyle: "italic", fontWeight: 500, fontSize: 54, color: GOLD_HI, letterSpacing: 2, opacity: k(t, T.title, T.title + 0.6, 0, 1), transform: `translateY(${(1 - sp) * 30}px)` }}>Happy Diwali</div>
      <div style={{ position: "absolute", top: 270, width: "100%", display: "flex", justifyContent: "center", transform: `scale(${0.85 + 0.15 * sp})`, opacity: Math.min(1, sp * 1.4) }}>
        <div style={{ position: "relative" }}>
          <GoldText shine={shine} style={{ fontFamily: ROZHA, fontSize: 168, lineHeight: 1.25, filter: "drop-shadow(0 6px 24px rgba(240,160,72,0.45))" }}>शुभ दीपावली</GoldText>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1560, width: "100%", textAlign: "center", fontFamily: TIRO, fontSize: 56, color: "#FBF1DC", opacity: ln, transform: `translateY(${(1 - ln) * 24}px)`, textShadow: "0 2px 18px rgba(0,0,0,0.7)" }}>
        आपकी कुंडली के <span style={{ color: GOLD_HI }}>बारहों घर</span> रोशन रहें
      </div>
      <div style={{ position: "absolute", top: 1650, width: "100%", textAlign: "center", fontFamily: PLAY, fontStyle: "italic", fontSize: 38, color: "rgba(243,219,157,0.85)", opacity: en }}>
        May all 12 houses of your chart glow.
      </div>
    </AbsoluteFill>
  );
};

const Logo: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  if (t < T.logo - 0.1) return null;
  const sp = spring({ frame: f - Math.round(T.logo * FPS), fps: FPS, config: { damping: 15, mass: 0.9 } });
  const url = k(t, T.url, T.url + 0.7, 0, 1);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: CY - 470, width: 640, height: 740, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(240,160,72,0.28), rgba(240,160,72,0) 70%)", opacity: sp }} />
      <Img src={staticFile("jyotiq/logo-full.png")} style={{ position: "absolute", top: CY - 400, width: 520, opacity: Math.min(1, sp * 1.3), transform: `scale(${0.82 + 0.18 * sp})`, filter: "drop-shadow(0 0 30px rgba(240,184,72,0.35))" }} />
      <div style={{ position: "absolute", top: CY + 300, width: "100%", textAlign: "center", fontFamily: TIRO, fontSize: 52, color: "#FBF1DC", opacity: url }}>
        Team Jyotiq की ओर से <span style={{ color: GOLD_HI }}>शुभ दीपावली</span>
      </div>
      <div style={{ position: "absolute", top: CY + 390, width: "100%", textAlign: "center", fontFamily: JAK, fontWeight: 700, fontSize: 36, letterSpacing: 3, color: GOLD, opacity: url }}>www.jyotiq.ai</div>
    </AbsoluteFill>
  );
};

export const Greeting: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const warm = 0.22 + k(t, T.ignite, T.ignite + 1.0, 0, 1) * 0.6 + k(t, T.bloom, T.bloom + 1, 0, 0.35);
  const push = 1 + 0.04 * (t / 14);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 50% at 50% 55%, rgba(123,51,6,${0.55 * warm}) 0%, rgba(70,25,1,${0.35 * warm}) 45%, rgba(12,10,7,0) 75%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 120% 60% at 50% 0%, rgba(40,22,60,0.55), rgba(0,0,0,0) 60%)" }} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          <Defs />
          <Atmos t={t} />
          <Fireworks t={t} />
          <Rangoli t={t} f={f} />
          <Chart t={t} />
          <Houses t={t} />
          <CentreDiya t={t} />
        </svg>
      </AbsoluteFill>
      <Intro t={t} />
      <Titles t={t} f={f} />
      <Logo t={t} f={f} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 100%)" }} />
      {withAudio ? <Audio src={staticFile("mix.wav")} /> : null}
    </AbsoluteFill>
  );
};
