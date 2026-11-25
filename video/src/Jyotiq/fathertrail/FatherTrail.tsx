import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { AppStoreButton, PlayButton } from "../katha/reelKit";
import { QUAD } from "./screenQuad";
import { FPS, LINES, TOTAL } from "./timing";

/* "The Father Who Marked the Trail": ink-wash moving paintings, one serif caption sentence at a time, soft
   dissolves (the look and edit of Ayush's reference reel), Kaal narrating in English, Jyotiq close.
   Assets come from father-trail/public (render with --public-dir). */

export const FATHER_TOTAL = TOTAL;
const SERIF = loadPlayfair("normal", { weights: ["600", "700"], subsets: ["latin"] }).fontFamily;
const SERIF_I = loadPlayfair("italic", { weights: ["600"], subsets: ["latin"] }).fontFamily;
const SANS = loadJakarta("normal", { weights: ["500", "700", "800"], subsets: ["latin"] }).fontFamily;
const W = 1080;
const H = 1920;
const INK = "#2A231C";
const GOLD = "#DFB15B";
const fr = (s: number) => Math.round(s * FPS);
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (v: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(v));
const ramp = (f: number, a: number, b: number) => ease((f - a) / (b - a));

type ShotDef = { t: number; src: string; clip?: number; use?: number; z0?: number; z1?: number; y0?: number; y1?: number; origin?: string };
// t = cut time in seconds (the incoming shot dissolves in over DIS frames starting there)
const SHOTS: ShotDef[] = [
  { t: 0, src: "s01", clip: 4, z0: 1.0, z1: 1.06 },
  { t: 2.55, src: "s02", clip: 4, z0: 1.02, z1: 1.08 },
  { t: 6.1, src: "s03", clip: 4, z0: 1.0, z1: 1.05 },
  { t: 9.8, src: "s04", clip: 4, use: 3.3, z0: 1.3, z1: 1.36, origin: "50% 100%" },
  { t: 13.55, src: "s05", clip: 4, z0: 1.0, z1: 1.05 },
  { t: 17.45, src: "s06", clip: 6, z0: 1.0, z1: 1.07 },
  { t: 22.7, src: "s07", clip: 4, z0: 1.0, z1: 1.05 },
  { t: 25.9, src: "s08", clip: 4, z0: 1.0, z1: 1.05 },
  { t: 28.95, src: "s09", clip: 6, z0: 1.0, z1: 1.05 },
  { t: 34.5, src: "s10", clip: 4, z0: 1.0, z1: 1.06 },
  { t: 37.85, src: "s11", clip: 4, z0: 1.0, z1: 1.06 },
  { t: 40.7, src: "s12", clip: 6, z0: 1.0, z1: 1.08 },
  { t: 48.15, src: "s13", clip: 6, z0: 1.0, z1: 1.05 },
  { t: 53.0, src: "s14", clip: 6, z0: 1.0, z1: 1.05 },
  { t: 59.1, src: "s15", clip: 6, z0: 1.0, z1: 1.06 },
  { t: 66.05, src: "s16", clip: 4, z0: 1.0, z1: 1.05 },
  { t: 69.15, src: "s18", z0: 1.0, z1: 1.05 },
  { t: 72.4, src: "s17", z0: 1.04, z1: 1.14, y0: 0, y1: -30 },
];
const DIS = 13; // dissolve length in frames, like the reference's soft cross-fades
const PHONE_T = 69.15;
const END_T = 72.4;

const Shot: React.FC<{ f: number; def: ShotDef; start: number; end: number }> = ({ f, def, start, end }) => {
  const local = f - start;
  const len = end + DIS - start;
  const p = local / len;
  const z = (def.z0 ?? 1) + ((def.z1 ?? 1.05) - (def.z0 ?? 1)) * p;
  const y = (def.y0 ?? 0) + ((def.y1 ?? 0) - (def.y0 ?? 0)) * p;
  const op = start === 0 ? 1 : ramp(f, start, start + DIS);
  const style: React.CSSProperties = { position: "absolute", inset: 0, width: W, height: H, objectFit: "cover" };
  // Veo clips run at their own speed unless the shot is longer, then they are gently slowed (never below 0.8)
  const rate = def.clip ? Math.max(0.8, Math.min(1, (def.use ?? def.clip - 0.1) / (len / FPS))) : 1;
  return (
    <AbsoluteFill style={{ opacity: op, transform: `translateY(${y}px) scale(${z})`, transformOrigin: def.origin ?? "50% 50%" }}>
      {def.clip ? (
        <Sequence from={start} durationInFrames={len} layout="none">
          <OffthreadVideo src={staticFile(`clips/${def.src}.mp4`)} muted playbackRate={rate} style={style} />
        </Sequence>
      ) : (
        <Img src={staticFile(`img/${def.src === "s18" ? "s18_keyed" : def.src}.jpg`)} style={style} />
      )}
    </AbsoluteFill>
  );
};

/* the phone screen in s18: QUAD is measured on the still by father-trail/screen_quad.py */

const PhoneUI: React.FC<{ f: number }> = ({ f }) => {
  const t0 = fr(PHONE_T);
  const q = "Which path is right for me now?";
  const typed = Math.max(0, Math.min(q.length, Math.floor((f - t0 - 10) / 1.4)));
  const sent = f >= t0 + 10 + q.length * 1.4 + 6;
  const sendAt = t0 + 10 + Math.ceil(q.length * 1.4) + 6;
  const sw = 600;
  const sh = 1300;
  return (
    <div style={{ width: sw, height: sh, borderRadius: 54, background: "radial-gradient(120% 70% at 50% 0%, #2A1C0C 0%, #0C0A07 60%)", color: "#F3E6C8", fontFamily: SANS, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 70, width: sw, display: "flex", justifyContent: "center" }}>
        <Img src={staticFile("brand/logo-full.png")} style={{ width: 190 }} />
      </div>
      <div style={{ position: "absolute", top: 330, width: sw, textAlign: "center", fontSize: 34, color: "#B8A580", fontStyle: "italic" }}>Ask the stars</div>
      <div style={{ position: "absolute", top: 385, left: 30, right: 30, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 72, lineHeight: 1.1, color: GOLD }}>What would you like to know?</div>
      <div style={{ position: "absolute", top: 600, left: 26, right: 26, minHeight: 150, borderRadius: 40, border: `3px solid ${GOLD}`, boxShadow: `0 0 30px rgba(223,177,91,0.4)`, display: "flex", alignItems: "center", padding: "18px 18px 18px 30px", fontSize: 44, lineHeight: 1.2, background: "#120E09" }}>
        <span style={{ flex: 1 }}>
          {sent ? "" : q.slice(0, typed)}
          {!sent && Math.floor(f / 8) % 2 === 0 ? <span style={{ color: GOLD }}>|</span> : null}
        </span>
        <div style={{ width: 84, height: 84, flexShrink: 0, borderRadius: 42, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", color: "#0C0A07", fontSize: 46, fontWeight: 800, transform: `scale(${1 + 0.18 * Math.max(0, 1 - Math.abs(f - sendAt) / 6)})` }}>↑</div>
      </div>
      {sent ? (
        <div style={{ position: "absolute", top: 610, left: 30, right: 30, opacity: ramp(f, sendAt, sendAt + 8) }}>
          <div style={{ marginLeft: "auto", width: "fit-content", maxWidth: 470, background: "#2B2112", border: "2px solid #4A3A20", borderRadius: "34px 34px 8px 34px", padding: "22px 28px", fontSize: 40, lineHeight: 1.2 }}>{q}</div>
          <div style={{ marginTop: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
            <svg width={210} height={210} viewBox="-75 -75 150 150">
              <circle r={60} fill="none" stroke="rgba(223,177,91,0.25)" strokeWidth={2} />
              <circle r={40} fill="none" stroke="rgba(223,177,91,0.4)" strokeWidth={2} strokeDasharray="6 8" transform={`rotate(${(f - sendAt) * 4})`} />
              <circle cx={60 * Math.cos((f - sendAt) / 7)} cy={60 * Math.sin((f - sendAt) / 7)} r={7} fill={GOLD} />
              <circle r={12} fill={GOLD} opacity={0.6 + 0.4 * Math.sin(f / 4)} />
            </svg>
            <div style={{ fontSize: 40, color: "#D9C79F", textAlign: "center", lineHeight: 1.2 }}>Reading your<br />birth chart…</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

/* maps a 600x1300 div onto the measured screen quad with a projective transform */
function quadMatrix(w: number, h: number, pts: number[][]): string {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = pts; // tl, tr, br, bl
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2;
  const sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - dx2 * sy) / den;
  const hh = (dx1 * sy - sx * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, c = x0;
  const d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3, f2 = y0;
  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, c, f2, 0, 1];
  return `matrix3d(${m.join(",")})`;
}

type Chunk = { text: string; s: number; e: number; quote: boolean };
function chunks(): Chunk[] {
  const out: Chunk[] = [];
  let inQuote = false;
  for (const line of LINES) {
    let cur: { t: string; s: number }[] = [];
    let curQuote = inQuote;
    const flush = () => {
      if (cur.length) out.push({ text: cur.map((w) => w.t).join(" "), s: cur[0].s, e: 0, quote: curQuote });
      cur = [];
    };
    line.words.forEach((w, i) => {
      if (!cur.length) curQuote = inQuote || w.t.startsWith("“");
      cur.push({ t: w.t, s: w.s });
      if (w.t.startsWith("“")) inQuote = true;
      if (w.t.endsWith("”")) inQuote = false;
      const last = i === line.words.length - 1;
      const strong = /[.?!:”]$/.test(w.t);
      const soft = /,$/.test(w.t) && cur.length >= 4;
      if (last || strong || soft || cur.length >= 10) flush();
    });
  }
  for (let i = 0; i < out.length; i++) out[i].e = i + 1 < out.length ? out[i + 1].s - 0.06 : out[i].s + 3;
  out[0].s = -1; // the hook line is up on frame 0
  return out;
}
const CHUNKS = chunks();

const Caption: React.FC<{ f: number }> = ({ f }) => {
  const sec = f / FPS;
  if (sec >= END_T - 0.05) return null;
  const c = CHUNKS.find((k) => sec >= k.s - 0.12 && sec < k.e);
  if (!c) return null;
  const a = fr(c.s - 0.12);
  const op = c.s < 0 ? 1 : ramp(f, a, a + 5);
  const clean = c.text.replace(/[“”]/g, "");
  const top = sec >= PHONE_T ? 300 : 520;
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top, textAlign: "center", opacity: op, transform: `translateY(${(1 - op) * 10}px)` }}>
      <span style={{ fontFamily: c.quote ? SERIF_I : SERIF, fontStyle: c.quote ? "italic" : "normal", fontWeight: 600, fontSize: 60, lineHeight: 1.22, color: "#FFFFFF", textShadow: "0 2px 4px rgba(0,0,0,0.75), 0 0 22px rgba(0,0,0,0.45), 0 0 2px rgba(0,0,0,0.9)" }}>
        {c.quote ? `“${clean}”` : clean}
      </span>
    </div>
  );
};

const Bug: React.FC<{ f: number }> = ({ f }) => {
  const op = 1 - ramp(f, fr(END_T) - 6, fr(END_T) + 4);
  if (op <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 44, top: 150, display: "flex", alignItems: "center", gap: 12, opacity: 0.92 * op, padding: "8px 18px 8px 10px", borderRadius: 40, background: "rgba(20,15,10,0.38)" }}>
      <Img src={staticFile("brand/logo-icon.png")} style={{ height: 52 }} />
      <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 28, letterSpacing: 3, color: "#FFF6E4" }}>JYOTIQ</span>
    </div>
  );
};

const EndCard: React.FC<{ f: number }> = ({ f }) => {
  const t0 = fr(END_T);
  if (f < t0 - 6) return null;
  const k = (d: number) => ramp(f, t0 + d, t0 + d + 12);
  const lift = (d: number) => ({ opacity: k(d), transform: `translateY(${(1 - k(d)) * 24}px)` });
  const arrow = Math.sin((f - t0) / 6) * 10;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(250,243,229,0.82) 0%, rgba(250,243,229,0.9) 55%, rgba(250,243,229,0.55) 100%)", opacity: ramp(f, t0 - 6, t0 + 10) }} />
      <div style={{ position: "absolute", top: 200, width: W, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", color: INK }}>
        <div style={lift(0)}>
          <Img src={staticFile("brand/logo-full.png")} style={{ width: 300 }} />
        </div>
        <div style={{ ...lift(4), fontFamily: SERIF, fontWeight: 700, fontSize: 104, marginTop: 26, lineHeight: 1 }}>Ask Jyotiq</div>
        <div style={{ ...lift(36), fontFamily: SANS, fontWeight: 700, fontSize: 44, marginTop: 26 }}>
          Your first question is <span style={{ color: "#B5651D" }}>free</span>
        </div>
        <div style={{ ...lift(44), fontFamily: SANS, fontWeight: 500, fontSize: 34, marginTop: 14, color: "#5A4B3A" }}>Vedic astrology guidance, over chat</div>
        <div style={{ ...lift(56), display: "flex", gap: 18, marginTop: 40, transform: `scale(0.72) translateY(${(1 - k(56)) * 24}px)` }}>
          <PlayButton glow={0.35} />
          <AppStoreButton glow={0.35} />
        </div>
        <div style={{ ...lift(70), fontFamily: SANS, fontWeight: 800, fontSize: 40, marginTop: 6, letterSpacing: 1 }}>www.jyotiq.ai</div>
        <div style={{ ...lift(84), display: "flex", alignItems: "center", gap: 14, marginTop: 30, fontFamily: SANS, fontWeight: 700, fontSize: 34, color: "#5A4B3A" }}>
          <span style={{ display: "inline-block", transform: `translateY(${arrow}px)`, color: "#B5651D", fontSize: 44 }}>↑</span>
          App link in my profile
        </div>
        <div style={{ ...lift(100), marginTop: 44, padding: "18px 34px", borderRadius: 18, background: "rgba(42,35,28,0.9)", color: "#FFF6E4", fontFamily: SERIF_I, fontStyle: "italic", fontWeight: 600, fontSize: 42 }}>
          Comment: who marked the trail for you?
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 270, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 24, color: "#6B5B48", opacity: k(60) }}>
        Guidance only, for entertainment and information.
      </div>
    </AbsoluteFill>
  );
};

/* fine rice-paper grain and a soft warm vignette over every painting */
const Paper: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "multiply" }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={Math.floor(f / 2) % 7} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={W} height={H} filter="url(#grain)" />
    </svg>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0) 60%, rgba(60,40,20,0.22) 100%)" }} />
  </AbsoluteFill>
);

export const FatherTrail: React.FC = () => {
  const f = useCurrentFrame();
  const starts = SHOTS.map((s) => fr(s.t));
  const phoneOn = f >= fr(PHONE_T) && f < fr(END_T) + DIS;
  const zPhone = 1 + 0.05 * clamp((f - fr(PHONE_T)) / (fr(END_T) + DIS - fr(PHONE_T)));
  return (
    <AbsoluteFill style={{ background: "#F3EADA", overflow: "hidden" }}>
      {SHOTS.map((def, i) => {
        const start = starts[i];
        const end = i + 1 < SHOTS.length ? starts[i + 1] : TOTAL;
        if (f < start || f >= end + DIS) return null;
        return <Shot key={def.src} f={f} def={def} start={start} end={end} />;
      })}
      {phoneOn ? (
        <AbsoluteFill style={{ opacity: ramp(f, fr(PHONE_T), fr(PHONE_T) + DIS), transform: `scale(${zPhone})` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 600, height: 1300, transformOrigin: "0 0", transform: quadMatrix(600, 1300, QUAD.pts) }}>
            <PhoneUI f={f} />
          </div>
        </AbsoluteFill>
      ) : null}
      <Paper f={f} />
      <Caption f={f} />
      <Bug f={f} />
      <EndCard f={f} />
    </AbsoluteFill>
  );
};
