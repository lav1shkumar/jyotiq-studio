import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadMukta } from "@remotion/google-fonts/Mukta";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";
import { C } from "./cues";
import { LINES, TOTAL } from "./timing";

/* Diwali Day 5, Bhai Dooj: "Death is coming for dinner".
   Look: Ayush's hand-drawn comic reference (Yama and Yamuna). Motion: the kilavde 5 technique - painted plates with slow
   camera moves, cut-out characters that slide in and breathe, ghost dissolves, gold dust, vignette, word captions on top.
   Every beat sits on the voice's word timings (cues.ts). Render with --public-dir=../diwali-story-d5/public. */

export const STORY5_TOTAL = TOTAL;
const FPS = 30;
const OSW = loadOswald("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
const MUKTA = loadMukta("normal", { weights: ["700", "800"], subsets: ["devanagari", "latin"] }).fontFamily;
const MONO = loadMono("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;
const CREAM = "#FFF4DE";
const GOLD = "#FFCB45";
const RED = "#E8432E";
const INK = "#1A120C";
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const SOFT = Easing.bezier(0.45, 0, 0.55, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const k = (t: number, a: number, b: number, from: number, to: number, ease = OUT) => interpolate(t, [a, b], [from, to], { ...clamp, easing: ease });
const pop = (f: number, at: number, damping = 12) => spring({ frame: f - Math.round(at * FPS), fps: FPS, config: { damping, mass: 0.6, stiffness: 160 } });
const on = (t: number, a: number, b = 1e9) => t >= a && t < b;

/* ---------- shots ---------- */
type Pt = { s: number; x: number; y: number };
type Cut = {
  src: string; x: number; y: number; w: number; // resting position (top-left) and width, screen px
  enter?: "L" | "R" | "fade" | "rise"; at?: number; dur?: number; // entry
  from?: { x: number; y: number }; // for walking moves: start point, travels to x,y over [at, at+dur]
  idle?: "walk" | "breathe" | "still"; flip?: boolean; glow?: number; out?: number;
};
type Shot = {
  a: number; b: number; src: string; from: Pt; to: Pt; ox?: number; oy?: number;
  tr?: "ghost" | "flash" | "dark" | "cut"; grade?: string; dim?: number; cuts?: Cut[];
};

const N = (s: number, x = 0, y = 0): Pt => ({ s, x, y });
const SHOTS: Shot[] = [
  // 01 hook: a calm Yama rides through the night to a closed door
  { a: 0, b: C.twist, src: "b01_night", from: N(1.06), to: N(1.16), ox: 640, oy: 1450, grade: "saturate(1.05) brightness(0.86)",
    cuts: [{ src: "c_yama_buffalo", x: 60, y: 1200, w: 600, from: { x: -250, y: 1220 }, at: 0, dur: C.twist + 0.4, idle: "walk" }] },
  // the twist: the door opens on a feast
  { a: C.twist, b: C.twins, src: "b01_open", from: N(1.04), to: N(1.18, 0, 30), ox: 670, oy: 1250, tr: "flash", grade: "saturate(1.08)",
    cuts: [
      { src: "c_yama_buffalo", x: 0, y: 1250, w: 560, idle: "breathe" },
      { src: "c_yamuna_thali", x: 520, y: 860, w: 300, enter: "fade", at: C.aurVo - 0.3, dur: 0.9, idle: "breathe", glow: 0.8 },
    ] },
  // 02 twins of the sun; the mother leaves and the light dims
  { a: C.twins, b: C.grown, src: "b02_surya", from: N(1.16, 0, -60), to: N(1.04, 0, 0), ox: 540, oy: 700, tr: "ghost",
    cuts: [{ src: "c_twins", x: 150, y: 990, w: 780, enter: "fade", at: C.twins + 0.15, dur: 0.8, idle: "breathe", glow: 0.6 }] },
  // 03a grown: the heaviest duty
  { a: C.grown, b: C.bhaiya, src: "b03_court", from: N(1.04, 30, 0), to: N(1.14, -20, 0), ox: 540, oy: 1100, tr: "ghost",
    cuts: [{ src: "c_yama_stand", x: 250, y: 470, w: 720, enter: "R", at: C.grown + 0.1, dur: 1.2, idle: "breathe" }] },
  // 03b Yamuna calls
  { a: C.bhaiya, b: C.har, src: "b03_day", from: N(1.05), to: N(1.16, -30, 40), ox: 640, oy: 900, tr: "ghost",
    cuts: [{ src: "c_yamuna_thali", x: 300, y: 600, w: 580, enter: "fade", at: C.bhaiya - 0.1, dur: 0.5, idle: "breathe", glow: 0.5 }] },
  // 03c "next time, pakka"
  { a: C.har, b: C.sach, src: "b03_court", from: N(1.04, 0, 0), to: N(1.1, 0, 20), ox: 540, oy: 1000, tr: "ghost",
    cuts: [{ src: "c_yama_stand", x: 420, y: 470, w: 720, idle: "breathe" }] },
  // 04 the truth: alone with her letter
  { a: C.sach, b: C.dooj, src: "f04_alone", from: N(1.02), to: N(1.2, 0, 60), ox: 640, oy: 640, tr: "dark" },
  // 05 one dwitiya: the night door, then the knock
  { a: C.dooj, b: C.door, src: "b01_night", from: N(1.02), to: N(1.1), ox: 784, oy: 1290, tr: "ghost", grade: "brightness(0.82)" },
  { a: C.door, b: C.yamraj2, src: "b01_night", from: N(1.3), to: N(1.7), ox: 784, oy: 1290, tr: "cut", grade: "brightness(0.8)" },
  { a: C.yamraj2, b: C.tilak, src: "b01_open", from: N(1.22), to: N(1.08), ox: 670, oy: 1150, tr: "flash",
    cuts: [{ src: "c_yama_door", x: 490, y: 920, w: 540, enter: "fade", at: C.yamraj2 - 0.05, dur: 0.6, idle: "breathe", glow: 0.9 }] },
  // 06 tilak, the meal, love
  { a: C.tilak, b: C.feast, src: "f06_tilak", from: N(1.02), to: N(1.16, 0, 40), ox: 540, oy: 820, tr: "ghost" },
  { a: C.feast, b: C.maango, src: "f06_feast", from: N(1.04, 20, 0), to: N(1.22, -60, 40), ox: 760, oy: 760, tr: "ghost" },
  // 07 "maango"
  { a: C.maango, b: C.duniya, src: "f07_yama", from: N(1.02), to: N(1.16, 0, 40), ox: 540, oy: 760, tr: "ghost" },
  // 08a the world asks him for life; she asks...
  { a: C.duniya, b: C.bas, src: "b06_room", from: N(1.05), to: N(1.14, 0, 30), ox: 540, oy: 1000, tr: "ghost",
    cuts: [{ src: "c_yamuna_thali", x: 280, y: 480, w: 520, enter: "fade", at: C.duniya, dur: 0.6, idle: "breathe", glow: 0.5 }] },
  // 08b her wish
  { a: C.bas, b: C.kehte, src: "f08_yamuna", from: N(1.04), to: N(1.16, 0, 30), ox: 540, oy: 760, tr: "ghost" },
  // 09 the boon; he rides home at dawn
  { a: C.kehte, b: C.kab, src: "f09_leave", from: N(1.14, -40, 0), to: N(1.04, 30, 0), ox: 540, oy: 1100, tr: "ghost" },
  // 10 her question, and yours
  { a: C.kab, b: C.tumhara, src: "f08_yamuna", from: N(1.18, 0, 40), to: N(1.24, 0, 50), ox: 540, oy: 760, tr: "cut", dim: 0.35 },
  { a: C.tumhara, b: C.jyotiq, src: "f10_today", from: N(1.04), to: N(1.12, 0, 20), ox: 540, oy: 1000, tr: "ghost" },
  { a: C.jyotiq, b: 999, src: "f10_today", from: N(1.12, 0, 20), to: N(1.2, 0, 40), ox: 540, oy: 1000, tr: "cut", dim: 0.5 },
];

const XF: Record<string, number> = { ghost: 0.5, flash: 0.22, dark: 0.7, cut: 0 };

const cam = (sh: Shot, t: number): Pt => {
  const p = k(t, sh.a, sh.b, 0, 1, SOFT);
  return { s: sh.from.s + (sh.to.s - sh.from.s) * p, x: sh.from.x + (sh.to.x - sh.from.x) * p, y: sh.from.y + (sh.to.y - sh.from.y) * p };
};

const CutLayer: React.FC<{ c: Cut; t: number }> = ({ c, t }) => {
  const at = c.at ?? -1;
  const dur = c.dur ?? 1;
  const p = c.enter || c.from ? k(t, at, at + dur, 0, 1, c.from ? (x) => x : OUT) : 1;
  if (c.out !== undefined && t > c.out) return null;
  let x = c.x, y = c.y, op = 1, blur = 0;
  if (c.from) { x = c.from.x + (c.x - c.from.x) * p; y = c.from.y + (c.y - c.from.y) * p; }
  if (c.enter === "L") { x -= 260 * (1 - p); op = p; }
  if (c.enter === "R") { x += 260 * (1 - p); op = p; }
  if (c.enter === "rise") { y += 160 * (1 - p); op = p; }
  if (c.enter === "fade") { op = p; blur = 10 * (1 - p); }
  let rot = 0, sy = 1, by = 0;
  if (c.idle === "walk") { by = -Math.abs(Math.sin(t * Math.PI * 1.6)) * 9; rot = Math.sin(t * Math.PI * 1.6) * 0.8; }
  if (c.idle === "breathe") { sy = 1 + 0.006 * Math.sin(t * 2.1); rot = Math.sin(t * 0.9) * 0.35; }
  const ghost = c.enter === "fade" ? (1 - p) * 0.6 : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y + by, width: c.w, opacity: op, transformOrigin: "50% 100%", transform: `rotate(${rot}deg) scaleY(${sy}) ${c.flip ? "scaleX(-1)" : ""}` }}>
      {c.glow ? <div style={{ position: "absolute", left: "-20%", right: "-20%", top: "-6%", bottom: "10%", borderRadius: "50%", background: `radial-gradient(ellipse at 50% 40%, rgba(255,236,170,${0.55 * c.glow}) 0%, rgba(255,214,120,${0.18 * c.glow}) 45%, rgba(0,0,0,0) 70%)` }} /> : null}
      <Img src={staticFile(`cut/${c.src}.png`)} style={{ width: "100%", display: "block", position: "relative", filter: `drop-shadow(0 18px 24px rgba(0,0,0,0.35))${blur > 0.3 ? ` blur(${blur.toFixed(1)}px)` : ""}${ghost > 0 ? ` brightness(${1 + ghost})` : ""}` }} />
    </div>
  );
};

const ShotLayer: React.FC<{ sh: Shot; t: number }> = ({ sh, t }) => {
  const c = cam(sh, t);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0b0910" }}>
      <AbsoluteFill style={{ transformOrigin: `${sh.ox ?? 540}px ${sh.oy ?? 960}px`, transform: `translate(${c.x}px, ${c.y}px) scale(${c.s})` }}>
        <Img src={staticFile(`img/${sh.src}.jpg`)} style={{ position: "absolute", inset: 0, width: 1080, height: 1920, objectFit: "cover", filter: sh.grade }} />
        {(sh.cuts || []).map((cu, i) => <CutLayer key={i} c={cu} t={t} />)}
      </AbsoluteFill>
      {sh.dim ? <AbsoluteFill style={{ background: `rgba(10,6,14,${sh.dim})` }} /> : null}
    </AbsoluteFill>
  );
};

/* ---------- light and atmosphere ---------- */
const Dust: React.FC<{ t: number; amt: number }> = ({ t, amt }) => {
  if (amt <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      {Array.from({ length: 46 }, (_, i) => {
        const sp = 25 + random(`v${i}`) * 55;
        const y0 = random(`y${i}`) * 2100;
        const y = ((y0 - t * sp) % 2100 + 2100) % 2100 - 90;
        const x = random(`x${i}`) * 1080 + Math.sin(t * (0.3 + random(`w${i}`) * 0.6) + i) * 30;
        const r = 3 + random(`r${i}`) * 9;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * (0.6 + random(`t${i}`) * 1.4) + i * 1.7));
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: r * 2, height: r * 2, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,236,170,1) 0%, rgba(255,200,90,0.5) 45%, rgba(255,200,90,0) 72%)", opacity: tw * amt, filter: r > 9 ? "blur(2px)" : undefined }} />;
      })}
    </AbsoluteFill>
  );
};
const dustAmt = (t: number) => (t < C.twist ? 0.35 : on(t, C.sach, C.dooj) ? 0.25 : t >= C.ctaEnd + 0.3 ? 0.9 : 0.7);

const Vignette: React.FC<{ t: number }> = ({ t }) => {
  const dark = on(t, C.sach, C.dooj) || t < C.twist ? 0.62 : 0.45;
  return <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 48%, rgba(8,4,2,${dark}) 100%)` }} />;
};
const TopShade: React.FC = () => <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,6,4,0.62) 0%, rgba(10,6,4,0.32) 13%, rgba(0,0,0,0) 24%)" }} />;
const Grain: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "overlay" }}>
    <svg width={1080} height={1920}>
      <filter id="g5"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 5} /></filter>
      <rect width={1080} height={1920} filter="url(#g5)" />
    </svg>
  </AbsoluteFill>
);
const Flash: React.FC<{ t: number; at: number; color?: string; len?: number; power?: number }> = ({ t, at, color = "255,236,190", len = 0.45, power = 0.85 }) => {
  if (!on(t, at - 0.06, at + len)) return null;
  const p = t < at ? k(t, at - 0.06, at, 0, 1) : 1 - k(t, at, at + len, 0, 1, Easing.out(Easing.quad));
  return <AbsoluteFill style={{ background: `rgb(${color})`, opacity: p * power, mixBlendMode: "screen" }} />;
};
const Leak: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  if (!on(t, at - 0.3, at + 0.9)) return null;
  const p = t < at ? k(t, at - 0.3, at, 0, 1) : 1 - k(t, at, at + 0.9, 0, 1);
  return <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.55 * p, background: "radial-gradient(ellipse at 15% 20%, rgba(255,190,90,0.9) 0%, rgba(255,120,60,0.35) 30%, rgba(0,0,0,0) 60%)" }} />;
};
const Dark: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  if (!on(t, a, b)) return null;
  const m = (a + b) / 2;
  return <AbsoluteFill style={{ background: "#000", opacity: t < m ? k(t, a, m, 0, 1, SOFT) : 1 - k(t, m, b, 0, 1, SOFT) }} />;
};
const Glow: React.FC<{ t: number; a: number; b: number; x?: number; y?: number; power?: number }> = ({ t, a, b, x = 540, y = 820, power = 0.5 }) => {
  if (!on(t, a, b)) return null;
  const p = Math.min(k(t, a, a + 0.8, 0, 1), 1 - k(t, b - 0.6, b, 0, 1));
  return <AbsoluteFill style={{ mixBlendMode: "screen", opacity: p * power, background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,226,150,0.95) 0%, rgba(255,190,110,0.35) 22%, rgba(0,0,0,0) 45%)` }} />;
};

/* shake on the knocks */
const KNOCKS = [C.knockA, C.knockB];
const shake = (t: number) => {
  for (const at of KNOCKS) {
    if (on(t, at, at + 0.18)) {
      const d = 1 - (t - at) / 0.18;
      return { x: Math.sin(t * 120) * 9 * d, y: Math.cos(t * 97) * 6 * d };
    }
  }
  return { x: 0, y: 0 };
};

/* ---------- captions (top, word by word, current word in gold) ---------- */
type Chunk = { words: { t: string; s: number; e: number }[]; a: number; b: number };
const clean = (w: string) => w.replace(/\.\.\./g, "").replace(/,/g, "");
const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = [];
  for (const line of LINES) {
    let cur: Chunk["words"] = [];
    const flush = () => { if (cur.length) out.push({ words: cur, a: cur[0].s - 0.06, b: 0 }); cur = []; };
    line.words.forEach((w) => {
      cur.push(w);
      if (/[।?,]|\.\.\.$/.test(w.t) || cur.length >= 4) flush();
    });
    flush();
    out[out.length - 1].b = line.start + line.dur + 0.25;
  }
  for (let i = 0; i < out.length; i++) if (!out[i].b) out[i].b = out[i + 1] ? out[i + 1].a : out[i].a + 2;
  for (let i = 0; i < out.length - 1; i++) out[i].b = Math.min(out[i].b, out[i + 1].a);
  return out;
})();

const Captions: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  const ch = CHUNKS.find((c) => t >= c.a && t < c.b);
  if (!ch || t >= C.ctaEnd + 0.3) return null;
  const p = pop(f, ch.a, 14);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 236, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 18px", transform: `scale(${0.9 + 0.1 * Math.min(1, p)})`, opacity: Math.min(1, p * 1.6) }}>
      {ch.words.map((w, i) => {
        const live = t >= w.s - 0.04 && t < w.e + 0.08;
        const said = t >= w.s - 0.04;
        return (
          <span key={i} style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 70, lineHeight: 1.25, color: live ? GOLD : CREAM, opacity: said ? 1 : 0.55, textShadow: "0 3px 0 rgba(40,20,5,0.9), 0 0 18px rgba(0,0,0,0.75)", transform: `scale(${live ? 1.07 : 1})`, display: "inline-block" }}>{clean(w.t)}</span>
        );
      })}
    </div>
  );
};

/* ---------- series tag, brand bug, chips ---------- */
const DiyaIcon: React.FC<{ lit: boolean; size?: number; t: number; i: number }> = ({ lit, size = 34, t, i }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 40 46" style={{ overflow: "visible" }}>
    {lit ? <ellipse cx={20} cy={14} rx={7 + Math.sin(t * 9 + i) * 0.8} ry={12} fill="#FFD25A" style={{ filter: "drop-shadow(0 0 6px rgba(255,190,80,0.95))" }} /> : null}
    {lit ? <ellipse cx={20} cy={17} rx={3} ry={6} fill="#FFF6D8" /> : null}
    <path d="M2 30 Q20 48 38 30 Z" fill={lit ? "#E07A2E" : "#6b4a33"} stroke={INK} strokeWidth={2} />
  </svg>
);
const SeriesTag: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (t >= C.ctaEnd + 0.3) return null;
  const lit5 = t >= C.pyaar;
  const p5 = lit5 ? Math.min(1.25, pop(f, C.pyaar, 8)) : 1;
  return (
    <div style={{ position: "absolute", left: 44, top: 134, display: "flex", alignItems: "center", gap: 14, padding: "8px 18px 8px 16px", borderRadius: 40, background: "rgba(20,10,4,0.55)", border: "1.5px solid rgba(255,203,69,0.45)" }}>
      <span style={{ fontFamily: OSW, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: CREAM }}>DIWALI · DAY <span style={{ color: GOLD }}>5/5</span></span>
      <div style={{ display: "flex", gap: 4 }}>
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ transform: i === 4 ? `scale(${p5})` : undefined }}><DiyaIcon lit={i < 4 || lit5} size={22} t={t} i={i} /></div>)}
      </div>
    </div>
  );
};
const BrandBug: React.FC<{ t: number }> = ({ t }) => (t >= C.jyotiq ? null : (
  <div style={{ position: "absolute", right: 44, top: 126, display: "flex", alignItems: "center", gap: 8, opacity: 0.92 }}>
    <Img src={staticFile("jyotiq/logo-icon.png")} style={{ height: 52 }} />
    <span style={{ fontFamily: OSW, fontWeight: 700, fontSize: 26, color: CREAM, letterSpacing: 2, textShadow: "0 2px 6px rgba(0,0,0,0.8)" }}>JYOTIQ</span>
  </div>
));

const Chip: React.FC<{ f: number; t: number; at: number; out: number; x: number; y: number; text: string; sub?: string; size?: number; bg?: string; color?: string; rot?: number }> = ({ f, t, at, out, x, y, text, sub, size = 40, bg = "rgba(255,244,222,0.95)", color = INK, rot = -2 }) => {
  if (!on(t, at, out)) return null;
  const p = pop(f, at, 11);
  const o = 1 - k(t, out - 0.25, out, 0, 1);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) rotate(${rot}deg) scale(${p})`, opacity: o, background: bg, color, padding: "12px 26px", borderRadius: 14, boxShadow: "0 10px 26px rgba(0,0,0,0.45)", textAlign: "center", whiteSpace: "nowrap" }}>
      <div style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: size, lineHeight: 1.1 }}>{text}</div>
      {sub ? <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: size * 0.45, letterSpacing: 2, opacity: 0.75, marginTop: 4 }}>{sub}</div> : null}
    </div>
  );
};

const Hook: React.FC<{ t: number }> = ({ t }) => {
  if (t >= C.twist + 0.35) return null;
  const o = 1 - k(t, C.twist - 0.05, C.twist + 0.3, 0, 1);
  const s = 1 + t * 0.008;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", opacity: o, transform: `scale(${s})` }}>
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 128, lineHeight: 1.0, color: CREAM, letterSpacing: 1, textShadow: "0 6px 0 rgba(0,0,0,0.55), 0 0 40px rgba(0,0,0,0.6)" }}>DEATH IS COMING</div>
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 150, lineHeight: 1.0, color: GOLD, letterSpacing: 1, textShadow: "0 6px 0 rgba(90,30,0,0.7), 0 0 40px rgba(0,0,0,0.6)" }}>FOR DINNER.</div>
    </div>
  );
};

const Stamp: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; rot?: number; size?: number; bg?: string }> = ({ t, at, out, x, y, text, rot = -10, size = 84, bg = "rgba(255,240,225,0.18)" }) => {
  if (!on(t, at, out)) return null;
  const p = k(t, at, at + 0.14, 0, 1, Easing.in(Easing.quad));
  const o = 1 - k(t, out - 0.25, out, 0, 1);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.2 - 1.2 * p})`, opacity: Math.min(1, p * 1.5) * o, border: `8px solid ${RED}`, borderRadius: 14, padding: "6px 26px", color: RED, fontFamily: OSW, fontWeight: 700, fontSize: size, letterSpacing: 3, whiteSpace: "pre", textAlign: "center", lineHeight: 1.0, background: bg, textShadow: "0 0 2px rgba(255,255,255,0.4)" }}>{text}</div>
  );
};

/* palm-leaf letters falling and piling up while he keeps saying "next time" */
const Letters: React.FC<{ t: number }> = ({ t }) => {
  if (!on(t, C.har - 0.1, C.sach)) return null;
  return (
    <AbsoluteFill>
      {Array.from({ length: 18 }, (_, i) => {
        const at = C.har + i * ((C.pakka - C.har) / 18);
        if (t < at) return null;
        const fall = k(t, at, at + 0.9, 0, 1, Easing.in(Easing.quad));
        const x = 30 + random(`lx${i}`) * 330;
        const yEnd = 1500 + random(`ly${i}`) * 130 - Math.floor(i / 6) * 30;
        const rot = (random(`lr${i}`) - 0.5) * 70 * (1 - fall) + (random(`lq${i}`) - 0.5) * 30;
        return <div key={i} style={{ position: "absolute", left: x, top: -120 + (yEnd + 120) * fall, width: 150, height: 52, background: "linear-gradient(180deg,#E9D29A,#CDAE6A)", border: "2px solid #6b4f26", borderRadius: 6, transform: `rotate(${rot}deg)`, boxShadow: "0 6px 12px rgba(0,0,0,0.35)" }}>
          <div style={{ position: "absolute", left: 14, right: 14, top: 14, height: 3, background: "rgba(80,50,20,0.45)" }} />
          <div style={{ position: "absolute", left: 14, right: 40, top: 28, height: 3, background: "rgba(80,50,20,0.45)" }} />
          <div style={{ position: "absolute", right: 10, top: 12, width: 22, height: 22, borderRadius: "50%", background: RED, opacity: 0.85 }} />
        </div>;
      })}
    </AbsoluteFill>
  );
};
const Counter: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (!on(t, C.har, C.sach)) return null;
  const n = Math.floor(k(t, C.har, C.pakka, 1, 99, (x) => x * x));
  return <Chip f={f} t={t} at={C.har} out={C.sach} x={270} y={560} text={`बुलावे: ${n >= 99 ? "99+" : n}`} sub="INVITES SENT" size={46} rot={2} />;
};

/* wishes she does not take */
const Wishes: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (!on(t, C.duniya + 0.2, C.bas)) return null;
  const items = [["अमरता?", 220, 760], ["सोना?", 860, 860], ["राज-पाट?", 250, 1180]] as const;
  return (
    <AbsoluteFill>
      {items.map(([label, x, y], i) => {
        const at = C.duniya + 0.25 + i * 0.35;
        if (t < at) return null;
        const p = Math.min(1, pop(f, at, 10));
        const gone = k(t, C.maanga, C.maanga + 0.6, 0, 1);
        const bob = Math.sin(t * 2 + i) * 10;
        return <div key={i} style={{ position: "absolute", left: x, top: y + bob - gone * 80, transform: `translate(-50%,-50%) scale(${p * (1 - gone * 0.4)})`, opacity: 1 - gone, width: 230, height: 230, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #FFF3C4 0%, #FFD45A 45%, #D9921F 100%)", border: `5px solid ${INK}`, boxShadow: "0 0 40px rgba(255,200,80,0.85), 0 12px 24px rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 46, color: INK }}>{label}</span>
        </div>;
      })}
    </AbsoluteFill>
  );
};

/* the CTA: "kab?", the real Jyotiq screen, languages, first question free */
const BigKab: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (!on(t, C.kab - 0.05, C.tumhara + 0.2)) return null;
  const p = pop(f, C.kab - 0.05, 9);
  return <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", transform: `scale(${p})`, fontFamily: MUKTA, fontWeight: 800, fontSize: 300, color: GOLD, textShadow: "0 10px 0 rgba(90,30,0,0.75), 0 0 60px rgba(255,180,60,0.6)" }}>कब?</div>;
};
const AppCard: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  if (!on(t, C.jyotiq, C.ctaEnd + 0.3)) return null;
  const rise = spring({ frame: f - Math.round(C.jyotiq * FPS), fps: FPS, config: { damping: 15, mass: 0.9, stiffness: 120 } });
  const glow = 0.5 + 0.5 * Math.sin((t - C.jyotiq) * 5);
  const langs = ["हिंदी", "English", "मराठी", "ਪੰਜਾਬੀ", "ગુજરાતી"];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 70, width: 940, top: 640 + (1 - rise) * 1300, borderRadius: 30, overflow: "hidden", background: "#120d08", border: "3px solid rgba(255,203,69,0.75)", boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 ${50 * glow}px rgba(255,190,80,0.55)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 24px", background: "#1d150c", borderBottom: "1px solid rgba(255,203,69,0.3)" }}>
          <Img src={staticFile("jyotiq/logo-icon.png")} style={{ height: 44 }} />
          <span style={{ fontFamily: OSW, fontWeight: 700, fontSize: 34, color: CREAM, letterSpacing: 2 }}>JYOTIQ</span>
          <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 22, color: "rgba(255,244,222,0.6)" }}>jyotiq.ai</span>
        </div>
        <Img src={staticFile("app_card.jpg")} style={{ width: "100%", display: "block" }} />
      </div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 1240, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
        {langs.map((l, i) => {
          const at = C.bhasha - 0.1 + i * 0.12;
          if (t < at) return null;
          return <div key={l} style={{ transform: `scale(${Math.min(1, pop(f, at, 10))})`, padding: "10px 24px", borderRadius: 30, background: "rgba(20,12,4,0.85)", border: `2px solid ${GOLD}`, fontFamily: MUKTA, fontWeight: 800, fontSize: 40, color: CREAM }}>{l}</div>;
        })}
      </div>
      <Stamp t={t} at={C.free} out={C.ctaEnd + 0.3} x={540} y={1460} text="पहला सवाल फ़्री" rot={-5} size={64} bg="rgba(255,244,222,0.95)" />
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{ f: number; t: number }> = ({ f, t }) => {
  const at = C.ctaEnd + 0.3;
  if (t < at) return null;
  const p = pop(f, at, 13);
  const p2 = pop(f, at + 0.45, 13);
  const arrow = Math.sin((t - at) * 6) * 10;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(10,6,4,0.55)", opacity: k(t, at, at + 0.4, 0, 1) }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", transform: `scale(${p})` }}>
        <div style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 120, color: GOLD, textShadow: "0 6px 0 rgba(90,30,0,0.7)" }}>शुभ भाई दूज</div>
        <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 44, letterSpacing: 6, color: CREAM, marginTop: -6 }}>HAPPY BHAI DOOJ</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 30 }}>
          {[0, 1, 2, 3, 4].map((i) => <DiyaIcon key={i} lit t={t} i={i} size={64} />)}
        </div>
        <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 34, letterSpacing: 4, color: GOLD, marginTop: 14 }}>DIWALI 5/5 · COMPLETE</div>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 820, textAlign: "center", transform: `scale(${p2})`, fontFamily: MUKTA, fontWeight: 800, fontSize: 52, color: CREAM, background: "rgba(232,67,46,0.92)", borderRadius: 18, padding: "16px 20px", boxShadow: "0 12px 30px rgba(0,0,0,0.45)" }}>
        ये रील अपने भाई / बहन को भेजो 💛
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1010, display: "flex", alignItems: "center", gap: 26, background: "rgba(14,9,5,0.92)", padding: "26px 30px", borderRadius: 26, border: "2px solid rgba(255,203,69,0.7)", transform: `translateY(${(1 - p2) * 300}px)` }}>
        <Img src={staticFile("jyotiq/logo-icon.png")} style={{ height: 120 }} />
        <div>
          <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 50, color: CREAM }}>Jyotiq se pucho</div>
          <div style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 36, color: GOLD }}>पहला सवाल फ़्री · फिर ₹5 प्रति सवाल</div>
          <div style={{ fontFamily: MONO, fontSize: 26, color: "rgba(255,244,222,0.9)", marginTop: 4 }}>www.jyotiq.ai</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", fontFamily: MUKTA, fontWeight: 800, fontSize: 42, color: CREAM, opacity: k(t, at + 0.7, at + 1.1, 0, 1) }}>
        App ka link profile (bio) mein <span style={{ display: "inline-block", transform: `translateY(${-arrow}px)`, color: GOLD }}>↑</span>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 1380, textAlign: "center", fontFamily: MUKTA, fontWeight: 700, fontSize: 34, color: "rgba(255,244,222,0.85)", opacity: k(t, at + 1.0, at + 1.4, 0, 1) }}>
        Comment karo: tumhare bhai ne kitni baar &quot;agli baar pakka&quot; bola? 😄
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1500, textAlign: "center", fontFamily: MONO, fontSize: 20, color: "rgba(255,244,222,0.6)" }}>Guidance only, for entertainment and information.</div>
    </AbsoluteFill>
  );
};

const Overlays: React.FC<{ f: number; t: number }> = ({ f, t }) => (
  <>
    <Chip f={f} t={t} at={C.aaj - 0.05} out={C.twins + 0.1} x={540} y={420} text="आज · भाई दूज" sub="DIWALI DAY 5 OF 5" size={60} rot={-3} />
    <Chip f={f} t={t} at={C.twins + 0.35} out={C.maa} x={300} y={905} text="यम" sub="YAMA" size={44} rot={-3} />
    <Chip f={f} t={t} at={C.twins + 0.55} out={C.maa} x={720} y={905} text="यमुना" sub="YAMUNA" size={44} rot={3} />
    <Letters t={t} />
    <Counter f={f} t={t} />
    <Stamp t={t} at={C.pakka - 0.05} out={C.sach} x={300} y={1180} text={"NEXT TIME,\nPAKKA"} size={76} />
    <Chip f={f} t={t} at={C.kartik - 0.05} out={C.door} x={540} y={1400} text="कार्तिक शुक्ल द्वितीया" sub="KARTIK SHUKLA DWITIYA" size={50} />
    <Wishes f={f} t={t} />
    <Chip f={f} t={t} at={C.kehte + 0.1} out={C.kab - 0.05} x={540} y={1430} text="यम द्वितीया का वरदान" sub="AS IT'S TOLD" size={46} rot={-2} />
    <BigKab f={f} t={t} />
    <Chip f={f} t={t} at={C.shaadi} out={C.jyotiq} x={300} y={1180} text="शादी कब?" size={60} rot={-4} />
    <Chip f={f} t={t} at={C.naukri} out={C.jyotiq} x={770} y={1330} text="नौकरी कब?" size={60} rot={4} />
    <AppCard f={f} t={t} />
    <EndCard f={f} t={t} />
  </>
);

export const Story5: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const i = Math.max(0, SHOTS.findIndex((s) => t >= s.a && t < s.b));
  const sh = SHOTS[i];
  const xf = XF[sh.tr || "cut"];
  const age = t - sh.a;
  const prev = i > 0 && xf > 0 && age < xf && sh.tr !== "dark" ? SHOTS[i - 1] : null;
  const fade = prev ? k(age, 0, xf, 0, 1, SOFT) : 1;
  const sk = shake(t);
  const punch = [C.twist, C.yamraj2, C.aaj].reduce((m, at) => (on(t, at, at + 0.3) ? Math.max(m, 0.035 * (1 - (t - at) / 0.3)) : m), 0);
  return (
    <AbsoluteFill style={{ background: "#0b0910" }}>
      <AbsoluteFill style={{ transform: `translate(${sk.x}px, ${sk.y}px) scale(${1 + punch})` }}>
        {prev ? <ShotLayer sh={prev} t={t} /> : null}
        <AbsoluteFill style={{ opacity: fade, filter: prev && sh.tr === "ghost" ? `brightness(${1 + 0.35 * (1 - fade)})` : undefined }}>
          <ShotLayer sh={sh} t={t} />
        </AbsoluteFill>
      </AbsoluteFill>
      {/* the light leaves when the mother leaves */}
      <AbsoluteFill style={{ background: "rgba(14,8,24,1)", opacity: on(t, C.maa, C.grown) ? 0.42 * k(t, C.maa, C.maa + 1.4, 0, 1, SOFT) * (1 - k(t, C.bachpan, C.bachpan + 1.2, 0, 0.55)) : 0 }} />
      <AbsoluteFill style={{ background: "rgba(120,0,0,1)", mixBlendMode: "multiply", opacity: on(t, C.praan, C.bhaiya) ? 0.35 * k(t, C.praan, C.praan + 0.6, 0, 1) : 0 }} />
      <Glow t={t} a={C.bachpan} b={C.grown} x={540} y={1300} power={0.45} />
      <Glow t={t} a={C.pyaar - 0.2} b={C.maango} x={700} y={700} power={0.55} />
      <Glow t={t} a={C.bas} b={C.kehte} x={540} y={760} power={0.35} />
      <Dust t={t} amt={dustAmt(t)} />
      <Vignette t={t} />
      <TopShade />
      <Dark t={t} a={C.sach - 0.35} b={C.sach + 0.35} />
      <Flash t={t} at={C.twist} />
      <Flash t={t} at={C.yamraj2} />
      {SHOTS.filter((s) => s.tr === "ghost").map((s, j) => <Leak key={j} t={t} at={s.a} />)}
      <AbsoluteFill style={{ transform: `translate(${sk.x * 0.4}px, ${sk.y * 0.4}px)` }}>
        <Overlays f={f} t={t} />
      </AbsoluteFill>
      <Hook t={t} />
      <Captions f={f} t={t} />
      <SeriesTag f={f} t={t} />
      <BrandBug t={t} />
      <Grain f={f} />
      <Audio src={staticFile("mix.wav")} />
    </AbsoluteFill>
  );
};
