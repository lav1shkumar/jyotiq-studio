import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";
import { loadFont as loadMukta } from "@remotion/google-fonts/Mukta";
import { C } from "./cues";
import { TOTAL } from "./timing";

/* Diwali Day 4, Govardhan. Collage-diorama language of the reference reel: English two-colour headlines built on the
   words, FIG strips, label chips, red rings and reticles, meters, parchment lists, a calendar tease.
   Every beat is placed on Kaal's word timings (cues.ts). Render with --public-dir=../diwali-story-d4/public. */

export const STORY4_TOTAL = TOTAL;
const FPS = 30;
const OSW = loadOswald("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
const MONO = loadMono("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;
const MUKTA = loadMukta("normal", { weights: ["700", "800"], subsets: ["devanagari", "latin"] }).fontFamily;
const CREAM = "#F6EBD6";
const RED = "#FF5B3A";
const GOLD = "#FFC94D";
const INK = "#16130F";
const PAPER = "#EFE3C8";
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const INOUT = Easing.bezier(0.65, 0, 0.35, 1);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const k = (t: number, a: number, b: number, from: number, to: number, ease = OUT) => interpolate(t, [a, b], [from, to], { ...clamp, easing: ease });
const pop = (f: number, at: number, damping = 11) => spring({ frame: f - Math.round(at * FPS), fps: FPS, config: { damping, mass: 0.55, stiffness: 170 } });
const on = (t: number, at: number, out = 1e9) => t >= at && t < out;

/* ---------- shots ---------- */
type Pt = { s: number; x: number; y: number };
type ShotDef = { a: number; b: number; src: string; from: Pt; to: Pt; ox?: number; oy?: number; dim?: number; blur?: number; whip?: "L" | "R" | "U" | "zoom"; keys?: { at: number; dur: number; to: Pt }[] };

const SHOTS: ShotDef[] = [
  { a: 0, b: C.crack, src: "s01_puja", from: { s: 1.08, x: 0, y: 0 }, to: { s: 1.2, x: 0, y: 0 }, ox: 590, oy: 1250 },
  { a: C.crack, b: C.braj, src: "s05_indra", from: { s: 1.18, x: 0, y: 40 }, to: { s: 1.06, x: 0, y: 0 }, ox: 560, oy: 900, whip: "zoom" },
  { a: C.braj, b: C.kanha, src: "s01_puja", from: { s: 1.02, x: 30, y: 0 }, to: { s: 1.07, x: -30, y: 0 }, ox: 540, oy: 1100, whip: "R" },
  { a: C.kanha, b: C.agree, src: "s03_hill", from: { s: 1.12, x: -20, y: 30 }, to: { s: 1.06, x: 10, y: 0 }, ox: 700, oy: 1300, whip: "L",
    keys: [{ at: C.milk - 0.1, dur: 0.5, to: { s: 1.16, x: 120, y: -40 } }] },
  { a: C.agree, b: C.angry, src: "s04_bhog", from: { s: 1.12, x: 60, y: 0 }, to: { s: 1.04, x: -40, y: 0 }, ox: 540, oy: 1000, whip: "R" },
  { a: C.angry, b: C.drown, src: "s05_indra", from: { s: 1.45, x: 0, y: 140 }, to: { s: 1.3, x: 0, y: 110 }, ox: 560, oy: 820, whip: "zoom" },
  { a: C.drown, b: C.then, src: "s06_flood", from: { s: 1.1, x: 0, y: -30 }, to: { s: 1.16, x: 0, y: 20 }, ox: 540, oy: 1300, whip: "U" },
  { a: C.then, b: C.days, src: "s07_lift", from: { s: 1.38, x: 0, y: -260 }, to: { s: 1.02, x: 0, y: 0 }, ox: 560, oy: 1200, whip: "zoom",
    keys: [{ at: C.then, dur: C.liftHit - C.then, to: { s: 1.36, x: 0, y: -230 } }, { at: C.liftHit, dur: 1.3, to: { s: 1.03, x: 0, y: 10 } }] },
  { a: C.days, b: C.finally, src: "s07_lift", from: { s: 1.1, x: 0, y: 60 }, to: { s: 1.18, x: 0, y: 80 }, ox: 560, oy: 1100, dim: 0.42 },
  { a: C.finally, b: C.yashoda, src: "s08_clear", from: { s: 1.14, x: 0, y: 30 }, to: { s: 1.03, x: 0, y: 0 }, ox: 540, oy: 700, whip: "U" },
  { a: C.yashoda, b: C.fiftysix + 0.95, src: "s09_yashoda", from: { s: 1.04, x: 0, y: 0 }, to: { s: 1.1, x: 0, y: 0 }, ox: 700, oy: 1150, whip: "L",
    keys: [{ at: C.lal - 0.05, dur: 0.45, to: { s: 1.26, x: -150, y: -60 } }, { at: C.eight - 0.2, dur: 0.6, to: { s: 1.12, x: 0, y: 0 } }] },
  { a: C.fiftysix + 0.95, b: C.your, src: "s10_annakut", from: { s: 1.2, x: 0, y: 80 }, to: { s: 1.04, x: 0, y: 0 }, ox: 540, oy: 1300, whip: "zoom" },
  { a: C.your, b: C.ctaEnd + 0.25, src: "s10_annakut", from: { s: 1.1, x: 0, y: 60 }, to: { s: 1.16, x: 0, y: 60 }, ox: 540, oy: 1200, dim: 0.45, blur: 5 },
  { a: C.ctaEnd + 0.25, b: 999, src: "s11_bhaidooj", from: { s: 1.12, x: 0, y: 0 }, to: { s: 1.04, x: 0, y: 0 }, ox: 540, oy: 1000, dim: 0.2, whip: "R" },
];

const camAt = (sh: ShotDef, t: number): Pt => {
  if (sh.keys) {
    let cur = sh.from;
    for (const kf of sh.keys) {
      if (t < kf.at) return cur;
      if (t < kf.at + kf.dur) {
        const p = INOUT(Math.min(1, (t - kf.at) / kf.dur));
        return { s: cur.s + (kf.to.s - cur.s) * p, x: cur.x + (kf.to.x - cur.x) * p, y: cur.y + (kf.to.y - cur.y) * p };
      }
      cur = kf.to;
    }
    // slow drift after the last key
    const last = sh.keys[sh.keys.length - 1];
    const p = Math.min(1, (t - last.at - last.dur) / 6);
    return { s: cur.s + 0.03 * p, x: cur.x, y: cur.y };
  }
  const p = interpolate(t, [sh.a, Math.min(sh.b, sh.a + 12)], [0, 1], { ...clamp, easing: Easing.bezier(0.33, 0, 0.4, 1) });
  return { s: sh.from.s + (sh.to.s - sh.from.s) * p, x: sh.from.x + (sh.to.x - sh.from.x) * p, y: sh.from.y + (sh.to.y - sh.from.y) * p };
};

/* camera shake events: [time, strength, length] */
const SHAKES: [number, number, number][] = [
  [C.stop, 14, 0.35], [C.crack, 26, 0.7], [C.pralay, 12, 0.5], [C.angry, 22, 0.6], [C.clouds, 12, 0.5], [C.liftHit, 18, 1.4], [C.stamp56, 8, 0.3],
];
const shakeAt = (t: number) => {
  let x = 0, y = 0;
  for (const [at, s, len] of SHAKES) {
    if (t < at || t > at + len) continue;
    const d = 1 - (t - at) / len;
    const a = s * d * d;
    x += a * Math.sin(t * 91.7 + at) + a * 0.5 * Math.sin(t * 57.3);
    y += a * Math.cos(t * 83.1 + at * 2);
  }
  return { x, y };
};

const ShotLayer: React.FC<{ sh: ShotDef; t: number }> = ({ sh, t }) => {
  const c = camAt(sh, t);
  const age = t - sh.a;
  let wx = 0, wy = 0, wblur = 0, ws = 1;
  if (sh.whip && age < 0.24) {
    const p = 1 - OUT(age / 0.24);
    if (sh.whip === "L") wx = -220 * p;
    if (sh.whip === "R") wx = 220 * p;
    if (sh.whip === "U") wy = 260 * p;
    if (sh.whip === "zoom") ws = 1 + 0.22 * p;
    wblur = 22 * p;
  }
  const blur = (sh.blur || 0) + wblur;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(`img/${sh.src}.jpg`)} style={{
        position: "absolute", left: 0, top: 0, width: 1080, height: 1920, objectFit: "cover",
        transformOrigin: `${sh.ox ?? 540}px ${sh.oy ?? 960}px`,
        transform: `translate(${c.x + wx}px, ${c.y + wy}px) scale(${c.s * ws})`,
        filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : undefined,
      }} />
      {sh.dim ? <AbsoluteFill style={{ background: `rgba(8,8,16,${sh.dim})` }} /> : null}
    </AbsoluteFill>
  );
};

/* ---------- overlays ---------- */
const SkyShade: React.FC = () => <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(12,16,38,0.82) 0%, rgba(12,16,38,0.4) 15%, rgba(0,0,0,0) 27%)" }} />;
const Vignette: React.FC = () => <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.42) 100%)" }} />;
const Grain: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ opacity: 0.09, mixBlendMode: "overlay" }}>
    <svg width={1080} height={1920}>
      <filter id="g4"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 6} /></filter>
      <rect width={1080} height={1920} filter="url(#g4)" />
    </svg>
  </AbsoluteFill>
);
const Guides: React.FC = () => (
  <AbsoluteFill>
    {[360, 720].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.06)" }} />)}
    <div style={{ position: "absolute", left: 0, right: 0, top: 108, height: 1, background: "rgba(255,255,255,0.10)" }} />
  </AbsoluteFill>
);

const SCENES: [number, string, number][] = [
  [0, "BRAJ · INDRA PUJA", 1], [C.crack, "THE SKY · INDRA", 2], [C.braj, "BRAJ · EVERY YEAR", 3], [C.kanha, "BRAJ · THE QUESTION", 4],
  [C.agree, "BRAJ · THE OFFERING", 5], [C.angry, "THE SKY · INDRA", 6], [C.drown, "BRAJ · THE FLOOD", 7], [C.then, "GOVARDHAN · LIFTED", 8],
  [C.days, "GOVARDHAN · 7 DAYS", 9], [C.finally, "BRAJ · DAY 7", 10], [C.yashoda, "YASHODA'S KITCHEN", 11], [C.fiftysix + 0.95, "TODAY · ANNAKUT", 12],
  [C.your, "TODAY · YOUR SKY", 13], [C.ctaEnd + 0.25, "NEXT · WED 11 NOV", 14],
];
const TopStrip: React.FC<{ t: number }> = ({ t }) => {
  const cur = [...SCENES].reverse().find(([a]) => t >= a) || SCENES[0];
  return (
    <>
      <div style={{ position: "absolute", left: 40, top: 70, fontFamily: MONO, fontSize: 21, letterSpacing: 2, color: "rgba(246,235,214,0.75)" }}>{cur[1]}</div>
      <div style={{ position: "absolute", right: 40, top: 112, fontFamily: MONO, fontSize: 19, letterSpacing: 2, color: "rgba(246,235,214,0.7)" }}>FIG. {cur[2]}</div>
      <div style={{
        position: "absolute", right: 34, top: 44, padding: "10px 18px 12px", background: PAPER, color: INK, fontFamily: MONO, fontWeight: 700, fontSize: 21, letterSpacing: 1.5,
        clipPath: "polygon(0 6%, 8% 0, 22% 5%, 40% 0, 61% 4%, 80% 0, 100% 5%, 98% 50%, 100% 95%, 84% 100%, 63% 95%, 41% 100%, 20% 95%, 4% 100%, 1% 52%)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <Img src={staticFile("jyotiq/logo-icon.png")} style={{ height: 26 }} />JYOTIQ · DIWALI · DAY 4/5
      </div>
    </>
  );
};

/* headline: line 1 cream, line 2 red; each line's words rise in on its cue */
type HL = { a: number; b: number; l1: string; l1at?: number; l2?: string; l2at?: number; size?: number; c2?: string };
const Words: React.FC<{ f: number; text: string; at: number; color: string; size: number; big?: boolean }> = ({ f, text, at, color, size, big }) => {
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: size * 0.24, color }}>
      {words.map((w, i) => {
        const p = pop(f, at + i * 0.06, big ? 9 : 13);
        const vis = f >= Math.round((at + i * 0.06) * FPS);
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: 4 }}>
            <span style={{ display: "inline-block", opacity: vis ? 1 : 0, transform: `translateY(${(1 - Math.min(1, p)) * size * 0.9}px) scale(${big ? 0.8 + 0.2 * p : 1})`, transformOrigin: "left bottom" }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};
const Headline: React.FC<{ f: number; t: number; h: HL }> = ({ f, t, h }) => {
  if (!on(t, h.a, h.b)) return null;
  const size = h.size ?? 104;
  return (
    <div style={{ position: "absolute", left: 40, top: 150, right: 40, fontFamily: OSW, fontWeight: 700, fontSize: size, lineHeight: 1.02, textTransform: "uppercase", textShadow: "0 4px 0 rgba(0,0,0,0.35), 0 0 30px rgba(0,0,0,0.4)" }}>
      <Words f={f} text={h.l1} at={h.l1at ?? h.a} color={CREAM} size={size} />
      {h.l2 && t >= (h.l2at ?? h.a) ? <Words f={f} text={h.l2} at={h.l2at ?? h.a} color={h.c2 ?? RED} size={size} big /> : null}
    </div>
  );
};

const HEADS: HL[] = [
  { a: 0, b: C.crack, l1: "A LITTLE CHILD", l1at: -1, l2: "STOPPED INDRA'S PUJA", l2at: -1 },
  { a: C.crack, b: C.braj, l1: "THE PRICE:", l1at: C.aur, l2: "PRALAY RAIN", l2at: C.pralay },
  { a: C.braj, b: C.kanha, l1: "EVERY YEAR,", l2: "BRAJ FED INDRA", l2at: C.braj + 0.9 },
  { a: C.kanha, b: C.agree, l1: "WHO FEEDS BRAJ?", l1at: C.kanha + 0.1, l2: "NOT INDRA", l2at: C.to },
  { a: C.agree, b: C.bhog, l1: "BRAJ AGREED." },
  { a: C.bhog, b: C.angry, l1: "INDRA'S BHOG,", l2: "SENT TO A HILL", l2at: C.govardhan },
  { a: C.angry, b: C.drown, l1: "INDRA'S ANSWER:", l2: "PRALAY", l2at: C.clouds },
  { a: C.drown, b: C.then, l1: "BRAJ IS", l2: "GOING UNDER", l2at: C.drown + 0.45 },
  { a: C.hand, b: C.days, l1: "ONE HAND.", l2: "LIKE A MUSHROOM", l2at: C.mushroom },
  { a: C.days, b: C.finally, l1: "7 DAYS.", l2: "NOT ONE BITE", l2at: C.noFood },
  { a: C.finally, b: C.yashoda, l1: "DAY 7:", l2: "INDRA PULLS BACK", l2at: C.back },
  { a: C.yashoda, b: C.fiftysix + 0.95, l1: "A MOTHER'S MATH:", l2: "7 × 8 = 56", l2at: C.fiftysix },
  { a: C.fiftysix + 0.95, b: C.storm, l1: "THAT'S WHY:", l2: "56 BHOG", c2: GOLD, l2at: C.fiftysix + 1.1 },
  { a: C.storm, b: C.your, l1: "EVERY STORM", l2: "HAS ITS TIME", l2at: C.storm + 0.8 },
  { a: C.your, b: C.ctaEnd + 0.25, l1: "WHERE ARE YOUR PLANETS", l2: "RIGHT NOW?", l2at: C.graha, size: 88 },
  { a: C.ctaEnd + 0.25, b: 999, l1: "NEXT: DAY 5", l2: "BHAI DOOJ", l2at: C.ctaEnd + 0.6 },
];

/* label chip with a leader line that draws to its target */
const Label: React.FC<{ f: number; t: number; at: number; out: number; x: number; y: number; text: string; tx?: number; ty?: number; bg?: string }> = ({ f, t, at, out, x, y, text, tx, ty, bg = INK }) => {
  if (!on(t, at, out)) return null;
  const p = pop(f, at);
  const d = k(t, at, at + 0.35, 0, 1);
  return (
    <>
      {tx !== undefined && ty !== undefined ? (
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}>
          <line x1={x} y1={y} x2={x + (tx - x) * d} y2={y + (ty - y) * d} stroke={CREAM} strokeWidth={3} />
          {d > 0.95 ? <circle cx={tx} cy={ty} r={7 + 5 * Math.max(0, 1 - (t - at - 0.35) * 3)} fill={CREAM} /> : null}
        </svg>
      ) : null}
      <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${p})`, background: bg, color: CREAM, fontFamily: MONO, fontWeight: 700, fontSize: 25, letterSpacing: 1.5, padding: "8px 14px", whiteSpace: "nowrap", boxShadow: "0 4px 10px rgba(0,0,0,0.4)" }}>{text}</div>
    </>
  );
};

const Ring: React.FC<{ t: number; at: number; out: number; x: number; y: number; rx: number; ry: number }> = ({ t, at, out, x, y, rx, ry }) => {
  if (!on(t, at, out)) return null;
  const d = k(t, at, at + 0.3, 0, 1);
  const len = 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" stroke={RED} strokeWidth={7} strokeLinecap="round" strokeDasharray={`${len * d} ${len}`} transform={`rotate(-100 ${x} ${y})`} />
    </svg>
  );
};

const Reticle: React.FC<{ f: number; t: number; at: number; out: number; x: number; y: number; r?: number }> = ({ f, t, at, out, x, y, r = 62 }) => {
  if (!on(t, at, out)) return null;
  const p = pop(f, at, 10);
  const rr = r * (2.2 - 1.2 * Math.min(1.1, p));
  const spin = k(t, at, at + 0.5, 90, 0);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, opacity: Math.min(1, p * 1.5) }} width={1080} height={1920}>
      <g transform={`rotate(${spin} ${x} ${y})`}>
        <circle cx={x} cy={y} r={rr} fill="none" stroke={RED} strokeWidth={5} />
        <circle cx={x} cy={y} r={rr * 0.45} fill="none" stroke={RED} strokeWidth={3} />
        {[[0, -1], [0, 1], [-1, 0], [1, 0]].map(([dx, dy], i) => (
          <line key={i} x1={x + dx * rr * 0.75} y1={y + dy * rr * 0.75} x2={x + dx * rr * 1.35} y2={y + dy * rr * 1.35} stroke={RED} strokeWidth={5} />
        ))}
      </g>
    </svg>
  );
};

const Note: React.FC<{ f: number; t: number; at: number; out: number; x: number; y: number; text: string; rot?: number; size?: number; bg?: string; color?: string }> = ({ f, t, at, out, x, y, text, rot = -3, size = 40, bg = PAPER, color = INK }) => {
  if (!on(t, at, out)) return null;
  const p = pop(f, at, 10);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot + (1 - p) * 8}deg) scale(${0.6 + 0.4 * p})`, opacity: Math.min(1, p * 2), background: bg, color, fontFamily: OSW, fontWeight: 700, fontSize: size, padding: "10px 26px", textTransform: "uppercase", boxShadow: "0 8px 18px rgba(0,0,0,0.45)", whiteSpace: "nowrap" }}>{text}</div>
  );
};

/* rubber stamp that slams down */
const Stamp: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; rot?: number; size?: number }> = ({ t, at, out, x, y, text, rot = -12, size = 92 }) => {
  if (!on(t, at, out)) return null;
  const s = k(t, at, at + 0.13, 2.4, 1, Easing.in(Easing.cubic));
  const o = k(t, at, at + 0.08, 0, 1);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: o, border: `8px solid ${RED}`, color: RED, fontFamily: OSW, fontWeight: 700, fontSize: size, padding: "0 26px", letterSpacing: 4, background: "rgba(255,240,225,0.12)", textShadow: "0 0 2px rgba(0,0,0,0.3)", boxShadow: "0 0 0 3px rgba(255,91,58,0.35) inset" }}>{text}</div>
  );
};

const Meter: React.FC<{ t: number; at: number; full: number; out: number; x: number; y: number; label: string }> = ({ t, at, full, out, x, y, label }) => {
  if (!on(t, at, out)) return null;
  const pct = Math.round(k(t, at, full, 0, 100, Easing.in(Easing.quad)));
  const hot = pct > 60;
  return (
    <div style={{ position: "absolute", left: x - 30, top: y - 20, padding: "16px 30px 18px", background: "rgba(8,10,24,0.7)" }}>
      <div style={{ fontFamily: MONO, fontSize: 22, color: CREAM, letterSpacing: 2, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 520, height: 26, border: `3px solid ${CREAM}`, padding: 3 }}><div style={{ width: `${pct}%`, height: "100%", background: hot ? RED : CREAM }} /></div>
        <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 64, width: 150, color: hot ? RED : CREAM }}>{pct}%</div>
      </div>
    </div>
  );
};

const Rain: React.FC<{ f: number; amt: number }> = ({ f, amt }) => {
  if (amt <= 0.01) return null;
  const n = Math.round(150 * amt);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}>
      {Array.from({ length: n }, (_, i) => {
        const speed = 70 + (i % 7) * 9;
        const x = ((i * 97.3) % 1180) - 60 - ((f * speed * 0.2) % 1920) * 0.2;
        const y = ((i * 211.7 + f * speed) % 2100) - 120;
        const len = 50 + (i % 5) * 14;
        return <line key={i} x1={x} y1={y} x2={x - len * 0.2} y2={y + len} stroke={`rgba(215,228,255,${0.28 + (i % 3) * 0.1})`} strokeWidth={2 + (i % 2)} />;
      })}
    </svg>
  );
};
const rainAmt = (t: number) => {
  if (t < C.crack) return 0;
  if (t < C.braj) return k(t, C.crack, C.rain, 0.3, 1);
  if (t < C.angry) return 0;
  if (t < C.then) return k(t, C.angry, C.drown, 0.4, 1.15);
  if (t < C.liftHit) return 0.9;
  if (t < C.finally) return 0.75;
  if (t < C.yashoda) return k(t, C.finally, C.back + 0.6, 0.55, 0);
  return 0;
};

/* lightning: a few sharp flickers */
const Lightning: React.FC<{ t: number }> = ({ t }) => {
  let a = 0;
  for (const at of [C.crack, C.pralay - 0.05, C.angry, C.clouds, C.drown + 0.2]) {
    const d = t - at;
    if (d < 0 || d > 0.5) continue;
    const flick = d < 0.05 ? 1 : d < 0.09 ? 0.15 : d < 0.15 ? 0.85 : Math.max(0, 0.6 - d * 1.4);
    a = Math.max(a, flick);
  }
  if (a <= 0) return null;
  return <AbsoluteFill style={{ background: `rgba(205,220,255,${a * 0.55})`, mixBlendMode: "screen" }} />;
};

const Flash: React.FC<{ t: number; at: number; color?: string; len?: number; power?: number }> = ({ t, at, color = "255,240,220", len = 0.35, power = 0.8 }) => {
  const d = t - at;
  if (d < 0 || d > len) return null;
  return <AbsoluteFill style={{ background: `rgba(${color},${power * (1 - d / len) ** 2})` }} />;
};

/* dust and pebbles falling from the lifted hill */
const Dust: React.FC<{ f: number; t: number; at: number; out: number }> = ({ f, t, at, out }) => {
  if (!on(t, at, out)) return null;
  const age = t - at;
  const fade = Math.max(0, 1 - age / 4);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}>
      {Array.from({ length: 70 }, (_, i) => {
        const x0 = 120 + ((i * 131.7) % 840);
        const y0 = 820 + ((i * 47.3) % 200);
        const g = 380 + (i % 9) * 60;
        const y = y0 + g * age * age * 0.5 + 60 * age;
        const r = 2 + (i % 4) * 1.6;
        return <circle key={i} cx={x0 + Math.sin(i + f * 0.05) * 6} cy={y} r={r} fill={i % 3 ? "rgba(120,92,60,0.85)" : "rgba(210,190,150,0.7)"} opacity={fade} />;
      })}
    </svg>
  );
};

/* golden sun shafts when the clouds part */
const Rays: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  if (!on(t, at, out)) return null;
  const o = k(t, at, at + 1.2, 0, 0.55);
  const sweep = (t - at) * 4;
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", opacity: o }}>
      <svg width={1080} height={1920}>
        <defs><linearGradient id="ray4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE7A8" stopOpacity="0.9" /><stop offset="1" stopColor="#FFE7A8" stopOpacity="0" /></linearGradient></defs>
        {[-30, -14, 2, 18, 34].map((deg, i) => (
          <polygon key={i} points="780,380 700,1900 900,1900" fill="url(#ray4)" opacity={0.35 + 0.25 * Math.sin(i * 2 + t * 1.5)} transform={`rotate(${deg + sweep} 780 380)`} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const Parchment: React.FC<{ f: number; at: number; out: number; t: number; x: number; y: number; w: number; rot?: number; children: React.ReactNode }> = ({ f, at, out, t, x, y, w, rot = -2, children }) => {
  if (!on(t, at, out)) return null;
  const p = pop(f, at, 12);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `translateY(${(1 - p) * 500}px) rotate(${rot + (1 - p) * 10}deg)`, background: "linear-gradient(160deg,#F3E6C6,#E3CFA2)", padding: "28px 40px", boxShadow: "0 18px 40px rgba(0,0,0,0.5)", color: INK }}>{children}</div>
  );
};

const Tick: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const d = k(t, at, at + 0.14, 0, 1);
  return (
    <svg width={46} height={46} viewBox="0 0 100 100" style={{ flex: "none" }}>
      <path d="M14 54 L40 80 L88 20" stroke={RED} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${130 * d} 200`} />
    </svg>
  );
};

/* the day-tally while he holds the hill */
const DAY_TICK = (i: number) => C.days + 0.12 + i * ((C.noFood - 0.1 - C.days - 0.12) / 6);
const DayList: React.FC<{ f: number; t: number }> = ({ f, t }) => (
  <Parchment f={f} t={t} at={C.days - 0.05} out={C.finally} x={190} y={560} w={700}>
    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 2, color: "#7a3b20", marginBottom: 12 }}>HOLDING GOVARDHAN</div>
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: OSW, fontWeight: 700, fontSize: 52, lineHeight: 1.22, opacity: t >= DAY_TICK(i) - 0.1 ? 1 : 0.28 }}>
        {t >= DAY_TICK(i) ? <Tick t={t} at={DAY_TICK(i)} /> : <div style={{ width: 46 }} />}
        DAY {i + 1}
        <span style={{ fontFamily: MONO, fontSize: 22, color: i === 6 ? RED : "#7a6f60", marginLeft: "auto", opacity: t >= C.noFood ? 1 : 0 }}>{i === 6 ? "STILL STANDING" : "NO FOOD"}</span>
      </div>
    ))}
  </Parchment>
);

const MathCard: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  const row = (at: number, text: string, size: number, color = INK) => (
    <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: size, lineHeight: 1.25, color, opacity: t >= at ? 1 : 0, transform: `translateX(${t >= at ? (1 - Math.min(1, pop(f, at))) * -40 : 0}px)` }}>{text}</div>
  );
  return (
    <Parchment f={f} t={t} at={C.eight - 0.25} out={C.fiftysix + 0.95} x={90} y={420} w={580} rot={-3}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: "#7a3b20", marginBottom: 10 }}>YASHODA · AS IT'S TOLD</div>
      {row(C.eight, "8 MEALS A DAY", 50)}
      {row(C.seven, "× 7 DAYS MISSED", 50)}
      <div style={{ height: 4, background: INK, margin: "10px 0", width: `${k(t, C.eight2, C.eight2 + 0.4, 0, 100)}%` }} />
      {row(C.fiftysix, "= 56 BHOG", 74, RED)}
    </Parchment>
  );
};

/* drawn phone rising into the scene: installs Jyotiq, then the example Gochar screen */
const Phone: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  const at = C.your;
  if (!on(t, at, C.ctaEnd + 0.25)) return null;
  const rise = spring({ frame: f - Math.round(at * FPS), fps: FPS, config: { damping: 14, mass: 0.9, stiffness: 110 } });
  const y = 440 + (1 - rise) * 1500;
  const prog = k(t, at + 0.4, C.graha - 0.15, 0, 1, Easing.inOut(Easing.quad));
  const gochar = t >= C.graha;
  const bob = Math.sin(t * 2.2) * 6;
  const glow = t >= C.jyotiq ? 0.5 + 0.5 * Math.sin((t - C.jyotiq) * 6) : 0;
  return (
    <div style={{ position: "absolute", left: 290, top: y + bob, width: 500, height: 1000, borderRadius: 64, background: "#0d0d12", padding: 16, boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 ${60 * glow}px rgba(255,201,77,${0.6 * glow}), 0 0 0 3px #3a3a44 inset`, transform: `rotate(${-4 + (1 - rise) * 10}deg)` }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 50, overflow: "hidden", background: "linear-gradient(180deg,#1b1530,#0f0b1c)", position: "relative" }}>
        <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", width: 120, height: 32, borderRadius: 20, background: "#000" }} />
        {!gochar ? (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34 }}>
            <div style={{ position: "relative", width: 220, height: 220 }}>
              <svg width={220} height={220} style={{ position: "absolute" }}>
                <circle cx={110} cy={110} r={100} stroke="rgba(255,255,255,0.15)" strokeWidth={10} fill="none" />
                <circle cx={110} cy={110} r={100} stroke={GOLD} strokeWidth={10} fill="none" strokeDasharray={`${2 * Math.PI * 100 * prog} 999`} transform="rotate(-90 110 110)" strokeLinecap="round" />
              </svg>
              <Img src={staticFile("jyotiq/logo-icon.png")} style={{ position: "absolute", left: 40, top: 50, width: 140, transform: `scale(${prog >= 1 ? 1.08 : 1})` }} />
            </div>
            <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 56, color: CREAM }}>JYOTIQ</div>
            <div style={{ fontFamily: MONO, fontSize: 24, color: GOLD, letterSpacing: 2 }}>{prog >= 1 ? "INSTALLED ✓" : `INSTALLING… ${Math.round(prog * 100)}%`}</div>
            <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 30, color: "rgba(246,235,214,0.8)" }}>फ़्री · आपकी भाषा में</div>
          </AbsoluteFill>
        ) : (
          <div style={{ padding: "80px 34px 0", color: CREAM }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Img src={staticFile("jyotiq/logo-icon.png")} style={{ height: 44 }} />
              <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 38 }}>गोचर · TODAY</div>
            </div>
            <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 28, color: "rgba(246,235,214,0.75)", margin: "16px 0 26px" }}>इस वक़्त आसमान में कौन सा ग्रह कहाँ?</div>
            {([["शनि", "मीन", "#7FA6FF"], ["राहु", "कुंभ", "#B48CFF"], ["केतु", "सिंह", "#FF9A6B"], ["आपका चंद्र", "?", GOLD]] as const).map(([g, r, c], i) => {
              const rat = C.graha + 0.12 + i * 0.16;
              const rp = Math.min(1, pop(f, rat));
              const hi = t >= C.gochar && i === 3;
              return (
                <div key={g} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 22px", marginBottom: 14, borderRadius: 18, background: hi ? "rgba(255,201,77,0.18)" : "rgba(255,255,255,0.07)", border: `2px solid ${hi ? GOLD : c + "55"}`, opacity: t >= rat ? 1 : 0, transform: `translateX(${(1 - rp) * 60}px)` }}>
                  <span style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 38, color: c }}>{g}</span>
                  <span style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 34 }}>{r}</span>
                </div>
              );
            })}
            <div style={{ marginTop: 24, textAlign: "center", fontFamily: MONO, fontSize: 20, color: "rgba(246,235,214,0.55)", letterSpacing: 2 }}>EXAMPLE SCREEN</div>
          </div>
        )}
      </div>
    </div>
  );
};

/* November 2026 calendar for the tease: 1 Nov is a Sunday; 6-10 ticked, 11 ringed */
const Calendar: React.FC<{ f: number; t: number; at: number }> = ({ f, t, at }) => {
  if (t < at) return null;
  const p = pop(f, at, 13);
  const w = 640;
  const cell = w / 7;
  const tickAt = (d: number) => at + 0.35 + (d - 6) * 0.1;
  const ringAt = at + 1.0;
  return (
    <div style={{ position: "absolute", left: 220, top: 520, width: w, background: "#F4ECDD", boxShadow: "0 18px 40px rgba(0,0,0,0.5)", transform: `translateY(${(1 - p) * -700}px) rotate(${-2 + (1 - p) * -8}deg)` }}>
      <div style={{ background: "#C7352A", color: CREAM, fontFamily: OSW, fontWeight: 700, fontSize: 62, padding: "10px 26px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span>NOVEMBER</span><span style={{ fontSize: 34 }}>2026</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "10px 0 4px", fontFamily: MONO, fontSize: 18, color: "#7a6f60", textAlign: "center" }}>
        {"SMTWTFS".split("").map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", paddingBottom: 18 }}>
        {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
          <div key={d} style={{ height: cell * 0.78, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: OSW, fontWeight: 700, fontSize: 34, color: [1, 8, 15, 22, 29].includes(d) ? "#C7352A" : INK }}>
            {d === 11 && t >= ringAt ? <div style={{ position: "absolute", inset: 4, border: `5px solid ${RED}`, borderRadius: 10, background: "rgba(255,201,77,0.4)", transform: `scale(${pop(f, ringAt, 9)})` }} /> : null}
            <span style={{ position: "relative" }}>{d}</span>
            {d >= 6 && d <= 10 && t >= tickAt(d) ? <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 100 100"><path d="M18 52 L42 76 L86 22" stroke={RED} strokeWidth={11} fill="none" strokeLinecap="round" strokeDasharray={`${110 * k(t, tickAt(d), tickAt(d) + 0.12, 0, 1)} 200`} /></svg> : null}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 16, color: "#7a6f60", padding: "0 22px 16px" }}>PANCHANG: NEW DELHI · DRIK</div>
    </div>
  );
};

const EndBlock: React.FC<{ f: number; t: number; at: number }> = ({ f, t, at }) => {
  if (t < at) return null;
  const p = pop(f, at, 12);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, bottom: 280, display: "flex", alignItems: "center", gap: 26, background: "rgba(10,8,20,0.88)", padding: "24px 30px", borderRadius: 24, border: "2px solid rgba(255,201,77,0.6)", transform: `translateY(${(1 - p) * 300}px)`, opacity: Math.min(1, p * 2) }}>
      <Img src={staticFile("jyotiq/logo-icon.png")} style={{ height: 100 }} />
      <div>
        <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 46, color: CREAM }}>JYOTIQ · <span style={{ color: GOLD }}>GOCHAR FREE</span></div>
        <div style={{ fontFamily: MONO, fontSize: 24, color: "rgba(246,235,214,0.85)" }}>www.jyotiq.ai · app link in bio ↑</div>
        <div style={{ fontFamily: MONO, fontSize: 17, color: "rgba(246,235,214,0.55)", marginTop: 6 }}>Guidance only, for entertainment and information.</div>
      </div>
    </div>
  );
};

/* the hand-drawn path of the bhog to the hill */
const BhogPath: React.FC<{ t: number }> = ({ t }) => {
  if (!on(t, C.govardhan, C.angry)) return null;
  const d = k(t, C.govardhan, C.govardhan + 0.7, 0, 1);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}>
      <path d="M260 1260 C 480 1140, 740 1260, 900 1370" stroke={RED} strokeWidth={7} strokeDasharray="20 14" fill="none" pathLength={1000} style={{ strokeDasharray: `${1000 * d} 1000` }} />
      {d > 0.97 ? <path d="M876 1338 L905 1378 L858 1388" stroke={RED} strokeWidth={7} fill="none" strokeLinecap="round" /> : null}
    </svg>
  );
};

/* rising flood water tint */
const Water: React.FC<{ t: number }> = ({ t }) => {
  if (!on(t, C.drown, C.then)) return null;
  const h = k(t, C.drown, C.then, 120, 420, Easing.inOut(Easing.quad));
  return <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: h, background: "linear-gradient(180deg, rgba(60,90,130,0) 0%, rgba(40,70,110,0.45) 40%, rgba(25,45,80,0.6) 100%)" }} />;
};

const Overlays: React.FC<{ f: number; t: number }> = ({ f, t }) => (
  <>
    {/* hook */}
    <Label f={f} t={t} at={0.25} out={C.crack} x={330} y={1600} text="KRISHNA" tx={640} ty={1400} />
    <Label f={f} t={t} at={C.gods} out={C.crack} x={800} y={600} text="INDRA · KING OF GODS" tx={700} ty={360} />
    <Ring t={t} at={C.stop - 0.12} out={C.crack} x={565} y={1272} rx={78} ry={94} />
    <Stamp t={t} at={C.stop} out={C.crack} x={300} y={1180} text="STOPPED" />
    <Label f={f} t={t} at={C.aur + 0.35} out={C.braj} x={300} y={760} text="INDRA" tx={500} ty={760} />
    <Meter t={t} at={C.aur + 0.2} full={C.rain + 0.3} out={C.braj} x={60} y={1540} label="RAIN OVER BRAJ" />
    {/* every year */}
    <Note f={f} t={t} at={C.braj + 0.25} out={C.kanha} x={540} y={1500} text="DIWALI DAY 4 OF 5 · GOVARDHAN PUJA" size={34} rot={-2} />
    {/* the question */}
    <Label f={f} t={t} at={C.grass} out={C.agree} x={770} y={620} text="GRASS ← THE HILL" tx={830} ty={880} />
    <Label f={f} t={t} at={C.milk} out={C.agree} x={260} y={1060} text="MILK ← THE COWS" tx={220} ty={1260} />
    {/* offering */}
    <Label f={f} t={t} at={C.govardhan} out={C.angry} x={860} y={560} text="GOVARDHAN" tx={900} ty={760} />
    <BhogPath t={t} />
    {/* storm */}
    <Label f={f} t={t} at={C.angry + 0.3} out={C.drown} x={250} y={700} text="VAJRA" tx={430} ty={760} />
    <Meter t={t} at={C.clouds} full={C.drown} out={C.drown} x={60} y={1540} label="CLOUDS OVER BRAJ" />
    <Label f={f} t={t} at={C.drown + 0.6} out={C.then} x={250} y={1560} text="WATER ↑" tx={330} ty={1440} />
    {/* lift */}
    <Dust f={f} t={t} at={C.liftHit} out={C.days} />
    <Reticle f={f} t={t} at={C.liftHit + 1.4} out={C.days} x={600} y={1112} />
    <Label f={f} t={t} at={C.bhagavata} out={C.days} x={830} y={1010} text="BHAGAVATA 10.25.19" />
    <Label f={f} t={t} at={C.liftHit + 0.9} out={C.days} x={240} y={1560} text="ALL OF BRAJ, DRY" bg="#2a3f2a" />
    <DayList f={f} t={t} />
    {/* clearing */}
    <Rays t={t} at={C.finally} out={C.yashoda} />
    <Label f={f} t={t} at={C.back} out={C.yashoda} x={760} y={580} text="CLOUDS WITHDRAWN" tx={600} ty={760} />
    {/* mother */}
    <MathCard f={f} t={t} />
    <Reticle f={f} t={t} at={C.counted - 0.1} out={C.lal - 0.05} x={830} y={1150} />
    <Label f={f} t={t} at={C.lal + 0.2} out={C.eight - 0.25} x={600} y={760} text="HER LAL · HUNGRY 7 DAYS" />
    <Stamp t={t} at={C.stamp56} out={C.fiftysix + 0.95} x={800} y={1020} text="56" rot={8} size={150} />
    {/* today */}
    <Label f={f} t={t} at={C.fiftysix + 1.4} out={C.your} x={300} y={1080} text="ANNAKUT · 56 DISHES" tx={480} ty={1240} />
    <Note f={f} t={t} at={C.storm + 0.2} out={C.your} x={720} y={1530} text="SEND THIS TO YOUR MAA" rot={3} size={36} />
    <Phone f={f} t={t} />
    <Note f={f} t={t} at={C.jyotiq} out={C.ctaEnd + 0.25} x={540} y={1560} text="GOCHAR · FREE ON JYOTIQ" rot={-2} size={42} bg={GOLD} />
    {/* tease and brand */}
    <Note f={f} t={t} at={C.ctaEnd + 0.9} out={999} x={540} y={430} text="A SISTER VS YAMA" rot={-3} size={44} />
    <Calendar f={f} t={t} at={C.ctaEnd + 0.4} />
    <Note f={f} t={t} at={C.ctaEnd + 2.0} out={999} x={540} y={1290} text="FOLLOW FOR DAY 5" rot={2} size={50} bg={RED} color={CREAM} />
    <EndBlock f={f} t={t} at={C.ctaEnd + 1.6} />
  </>
);

export const Story4: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const sh = SHOTS.find((s) => t >= s.a && t < s.b) || SHOTS[SHOTS.length - 1];
  const sk = shakeAt(t);
  // a short punch-in on hard beats
  const punch = Math.max(0, ...[C.stop, C.crack, C.liftHit, C.stamp56].map((at) => (t >= at && t < at + 0.25 ? 0.04 * (1 - (t - at) / 0.25) : 0)));
  return (
    <AbsoluteFill style={{ background: "#0c0c14" }}>
      <AbsoluteFill style={{ transform: `translate(${sk.x}px, ${sk.y}px) scale(${1 + punch})` }}>
        <ShotLayer sh={sh} t={t} />
        <Rain f={f} amt={rainAmt(t)} />
        <Lightning t={t} />
        <Water t={t} />
      </AbsoluteFill>
      <SkyShade />
      <Vignette />
      <AbsoluteFill style={{ transform: `translate(${sk.x * 0.4}px, ${sk.y * 0.4}px)` }}>
        <Overlays f={f} t={t} />
      </AbsoluteFill>
      <Flash t={t} at={C.liftHit} power={0.5} />
      <Flash t={t} at={C.stamp56} color="255,214,140" power={0.35} len={0.5} />
      <Grain f={f} />
      <Guides />
      {HEADS.map((h, i) => <Headline key={i} f={f} t={t} h={h} />)}
      <TopStrip t={t} />
      <Audio src={staticFile("mix.wav")} />
    </AbsoluteFill>
  );
};
