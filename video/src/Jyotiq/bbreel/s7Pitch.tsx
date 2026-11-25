import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Caret, clamp, easeIn, easeInOut, easeOut, Glint, lerp, pop, prog } from "../motion";
import { SANS, SERIF, useTheme } from "../theme";
import { FocusLines, Shockwave, Sparks } from "./anime";
import { Kundali } from "./houseKit";
import { kick, SC } from "./timeline";

/* ================================================================== */
/* S7  reel 868-998                                                     */
/*   0-58   the question card + a kundali drawing in 3D +               */
/*          "What does his / kundali say?"                              */
/*   58-78  the track's break: a head in profile, "Ask Jyotiq ..."      */
/*   78     the track comes back: thoughts burst out of the head and    */
/*          stream into the diya. "... everything / you have in your head." */
/* ================================================================== */

const BREAK = 58;
const BURST = 78;
const HEAD = { x: 330, y: 960 };
const DIYA = { x: 800, y: 960, h: 210 };
const THOUGHTS = ["❤️", "💍", "💼", "🏠", "💰", "✈️", "🎓", "🎯", "❓", "⭐", "🙏", "📈"];

const HeadProfile: React.FC<{ glow: number }> = ({ glow }) => (
  <svg width={420} height={500} viewBox="0 0 420 500" style={{ position: "absolute", left: HEAD.x - 210, top: HEAD.y - 250, overflow: "visible" }}>
    <defs>
      <linearGradient id="hp" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2A1D10" />
        <stop offset="1" stopColor="#0E0904" />
      </linearGradient>
    </defs>
    <path
      d="M150 490 C150 432 140 390 118 360 C58 306 48 204 90 132 C140 44 262 24 322 84 C352 114 362 156 356 196 C353 210 362 220 374 238 L396 274 C400 282 392 288 378 290 C383 302 385 310 375 316 C383 324 381 334 369 340 C363 356 365 371 352 386 C332 400 302 401 287 406 C282 436 287 462 292 490 Z"
      fill="url(#hp)"
      stroke="#E9C46A"
      strokeWidth={5}
      style={{ filter: `drop-shadow(0 0 ${18 * glow}px rgba(233,196,106,${0.6 * glow}))` }}
    />
    {/* inner swirl: the mind */}
    <path d="M150 210 C170 150 260 140 280 200 C296 250 230 280 205 245 C188 222 214 200 232 214" fill="none" stroke="#E9C46A" strokeWidth={6} strokeLinecap="round" opacity={0.75 * glow} />
  </svg>
);

export const S7Pitch: React.FC<{ question: string; kundaliLine: string[] }> = ({ question, kundaliLine }) => {
  const u = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const G = SC.pitch[0] + u;

  // part 1
  const card = pop(u, fps, 0, 12);
  const draw = prog(u, 6, 34, easeOut);
  const planets = prog(u, 16, 44);
  const tilt = interpolate(u, [0, 40], [62, 22], { ...clamp, easing: easeOut });
  const l1 = pop(u, fps, 18, 12);
  const l2 = pop(u, fps, 26, 10);
  const out1 = prog(u, BREAK - 4, BREAK + 4, easeIn);

  // part 2
  const headIn = prog(u, BREAK, BREAK + 10);
  const ask = pop(u, fps, BREAK + 2, 12);
  const rest = pop(u, fps, BURST + 2, 12);
  const diyaIn = pop(u, fps, BREAK + 6, 12);
  let absorbed = 0;

  const thoughts = THOUGHTS.map((e, i) => {
    const r = (s: string) => random(`th-${i}-${s}`);
    const at = BURST + (i % 4);
    if (u < at) return null;
    const ang = (-170 + (i / (THOUGHTS.length - 1)) * 160 + (r("a") - 0.5) * 10) * (Math.PI / 180);
    const bx = 540 + Math.cos(ang) * 400;
    const by = 790 + Math.sin(ang) * 210;
    const burst = easeOut(Math.min(1, (u - at) / 9));
    const leave = 92 + i * 2.2;
    const go = easeIn(prog(u, leave, leave + 14, (x) => x));
    if (go >= 1) {
      absorbed++;
      return null;
    }
    const sx = lerp(HEAD.x + 20, bx, burst);
    const sy = lerp(HEAD.y - 170, by, burst);
    // arc into the diya flame
    const mx = (sx + DIYA.x) / 2;
    const my = Math.min(sy, DIYA.y) - 220;
    const x = (1 - go) * (1 - go) * sx + 2 * (1 - go) * go * mx + go * go * DIYA.x;
    const y = (1 - go) * (1 - go) * sy + 2 * (1 - go) * go * my + go * go * (DIYA.y - 20);
    const size = (84 + r("s") * 28) * (0.35 + 0.65 * burst) * (1 - 0.7 * go);
    return (
      <div key={i} style={{ position: "absolute", left: x - size / 2, top: y - size / 2, fontSize: size, lineHeight: 1, transform: `rotate(${(r("r") - 0.5) * 50 + (u - at) * (r("v") - 0.5) * 6}deg)`, filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.5))" }}>
        {e}
      </div>
    );
  });
  const diyaGlow = 0.5 + 0.12 * absorbed + 0.5 * kick(G, 6);

  return (
    <AbsoluteFill>
      {/* ---------- part 1 ---------- */}
      {out1 < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - out1, transform: `scale(${1 + 0.06 * out1})` }}>
          {u < 8 ? <FocusLines f={u} color="#FFE7A8" opacity={0.5 * (1 - u / 8)} rx={420} ry={300} cy={380} /> : null}
          <div style={{ position: "absolute", left: 0, right: 0, top: 286, display: "flex", justifyContent: "center", opacity: Math.min(1, card * 1.5), transform: `scale(${0.6 + 0.4 * card})` }}>
            <div
              style={{
                maxWidth: 860,
                padding: "26px 36px",
                borderRadius: "36px 36px 10px 36px",
                background: "linear-gradient(160deg, #EBD186, #C9A44E)",
                color: "#1A1206",
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 46,
                lineHeight: 1.3,
                textAlign: "center",
                boxShadow: "0 18px 50px rgba(0,0,0,0.55), 0 0 60px rgba(223,177,91,0.35)",
              }}
            >
              {question}
            </div>
          </div>
          <div style={{ position: "absolute", left: 540 - 300, top: 800 - 300, width: 600, height: 600, perspective: 1300 }}>
            <div style={{ width: 600, height: 600, transform: `rotateX(${tilt}deg) rotateZ(${u * 0.25}deg)`, transformStyle: "preserve-3d" }}>
              <Kundali size={600} draw={draw} planets={planets} f={u} />
            </div>
            <div style={{ position: "absolute", left: 300 - 85, top: 300 - 80, width: 170, height: 140, opacity: prog(u, 10, 20), filter: `drop-shadow(0 0 ${26 + 18 * kick(G)}px rgba(255,200,90,0.75))` }}>
              <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: 170, height: 140 }} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1112, textAlign: "center", fontFamily: SERIF, fontWeight: 700, letterSpacing: -1, textShadow: "0 6px 26px rgba(0,0,0,0.85)" }}>
            {u >= 18 ? (
              <div style={{ fontSize: 84, color: t.text, opacity: Math.min(1, l1 * 1.5), transform: `translateY(${(1 - Math.min(1, l1)) * 28}px)` }}>{kundaliLine[0]}</div>
            ) : null}
            {u >= 26 ? (
              <div style={{ fontSize: 112, lineHeight: 1.05, fontStyle: "italic", color: t.gold, opacity: Math.min(1, l2 * 1.5), transform: `scale(${0.7 + 0.3 * l2})` }}>{kundaliLine[1]}</div>
            ) : null}
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ---------- part 2 ---------- */}
      {headIn > 0 ? (
        <AbsoluteFill style={{ opacity: headIn }}>
          <AbsoluteFill style={{ background: `radial-gradient(ellipse 560px 520px at ${HEAD.x}px ${HEAD.y - 120}px, rgba(223,177,91,${0.1 + (u >= BURST ? 0.18 * Math.exp(-(u - BURST) / 12) : 0)}), transparent 70%)` }} />
          <HeadProfile glow={0.4 + 0.6 * prog(u, BURST - 2, BURST + 4)} />
          <div style={{ position: "absolute", left: DIYA.x - (DIYA.h * 444) / 366 / 2, top: DIYA.y - DIYA.h / 2, width: (DIYA.h * 444) / 366, height: DIYA.h, transform: `scale(${Math.min(1.1, diyaIn) * (1 + 0.012 * absorbed)})`, filter: `drop-shadow(0 0 ${30 * diyaGlow}px rgba(255,200,90,${Math.min(0.95, 0.4 + 0.3 * diyaGlow)}))` }}>
            <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: "100%", height: "100%" }} />
          </div>
          {thoughts}
          {u >= BURST && u < BURST + 9 ? <FocusLines f={u} cx={HEAD.x + 20} cy={HEAD.y - 170} rx={220} ry={220} color="#FFE7A8" opacity={0.55 * (1 - (u - BURST) / 9)} /> : null}
          <Shockwave f={u} at={BURST} x={HEAD.x + 20} y={HEAD.y - 170} size={0.8} />
          <Sparks f={u} at={BURST} x={HEAD.x + 20} y={HEAD.y - 170} count={30} seed="head" dur={20} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 74, lineHeight: 1.12, letterSpacing: -1, color: t.text, textShadow: "0 6px 26px rgba(0,0,0,0.85)" }}>
            <div style={{ opacity: Math.min(1, ask * 1.5), transform: `translateY(${(1 - Math.min(1, ask)) * 26}px)` }}>
              Ask <span style={{ color: t.gold, fontStyle: "italic" }}>Jyotiq</span> everything
            </div>
            {u >= BURST + 2 ? (
              <div style={{ opacity: Math.min(1, rest * 1.5), transform: `translateY(${(1 - Math.min(1, rest)) * 26}px)` }}>
                you have in your <span style={{ color: t.gold, fontStyle: "italic" }}>head.</span>
              </div>
            ) : null}
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* S8  reel 998-1099: end card. The diya rises into the logo lockup,   */
/* the wordmark types in, CTA lines, a Play Store button.              */
/* ================================================================== */

const ICON_H = 330;
const ICON_C = { x: 540, y: 540 };
const WM_H = 108;
const WM_W = (WM_H * 444) / 136;
const WM_TOP = 740;
const STEPS = [0, 0.214, 0.383, 0.574, 0.716, 0.79, 1];

export const S8Cta: React.FC<{ cta: string[] }> = ({ cta }) => {
  const c = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const G = SC.cta[0] + c;

  const fly = easeInOut(prog(c, 0, 14, (x) => x));
  const ih = lerp(DIYA.h * 1.144, ICON_H, fly);
  const iw = (ih * 444) / 366;
  const ix = lerp(DIYA.x, ICON_C.x, fly);
  const iy = lerp(DIYA.y, ICON_C.y, fly);
  const idx = c < 12 ? 0 : Math.min(6, Math.floor((c - 12) / 3) + 1);
  const frac = STEPS[idx];
  const glint = interpolate(c, [32, 38, 48], [0, 1.2, 0], clamp);
  const lines = cta.map((_, i) => pop(c, fps, 20 + i * 5, 12));
  const btn = pop(c, fps, 38, 12);
  const note = prog(c, 46, 58);
  const glow = 0.55 + 0.45 * kick(G, 7);
  const EMPH = /(1st free question)/i;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 560px 640px at 50% 34%, ${t.gold}30, transparent 70%)`, opacity: glow }} />
      <div style={{ position: "absolute", left: ix - iw / 2, top: iy - ih / 2, width: iw, height: ih, filter: `drop-shadow(0 0 ${36 * glow}px rgba(255,200,90,0.55))` }}>
        <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ position: "absolute", left: 540 - WM_W / 2, top: WM_TOP, clipPath: `inset(-20% ${(1 - frac) * 100}% -20% 0)` }}>
        <Img src={staticFile("jyotiq/logo-wordmark.png")} style={{ width: WM_W, height: WM_H }} />
      </div>
      {c >= 10 && c < 36 ? (
        <div style={{ position: "absolute", left: 540 - WM_W / 2 + frac * WM_W + 8, top: WM_TOP + 14 }}>
          <Caret height={WM_H * 0.7} color={t.gold} />
        </div>
      ) : null}
      {glint > 0 ? (
        <div style={{ position: "absolute", left: 540 - WM_W / 2 + (400 / 444) * WM_W - 46, top: WM_TOP + (22 / 136) * WM_H - 46, transform: `scale(${glint}) rotate(${c * 4}deg)` }}>
          <Glint size={92} color="#FFF4C9" />
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 60, right: 60, top: 900, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 80, lineHeight: 1.08, letterSpacing: -1.2, color: t.text }}>
        {cta.map((ln, i) => {
          const parts = ln.split(EMPH);
          return (
            <div key={i} style={{ opacity: Math.min(1, lines[i] * 1.5), transform: `translateY(${(1 - Math.min(1, lines[i])) * 26}px) scale(${0.85 + 0.15 * Math.min(1, lines[i])})` }}>
              {parts.map((s, j) => (EMPH.test(s) ? <span key={j} style={{ color: t.gold, fontStyle: "italic" }}>{s}</span> : <span key={j}>{s}</span>))}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1196, display: "flex", justifyContent: "center", opacity: Math.min(1, btn * 1.5), transform: `scale(${0.8 + 0.2 * btn})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 40px 16px 30px", borderRadius: 24, background: "#0A0907", border: "2.5px solid #F5ECDD55", boxShadow: `0 14px 40px rgba(0,0,0,0.5), 0 0 ${30 * glow}px ${t.gold}44` }}>
          <svg viewBox="0 0 24 26" width={58} height={62}>
            <defs>
              <linearGradient id="gp" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#DFB15B" />
                <stop offset="1" stopColor="#FE9A00" />
              </linearGradient>
            </defs>
            <path d="M2 1.5v23l20-11.5z" fill="url(#gp)" />
          </svg>
          <div style={{ fontFamily: SANS, color: "#F5ECDD", lineHeight: 1.05 }}>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: 2, opacity: 0.8 }}>GET IT ON</div>
            <div style={{ fontSize: 46, fontWeight: 800 }}>Google Play</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1338, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 34, color: t.muted, opacity: note }}>
        Search <span style={{ color: t.gold, fontWeight: 800 }}>JYOTIQ</span> · 1 free Flame on signup
      </div>
      {c < 10 ? <Sparks f={c} at={0} x={ICON_C.x} y={ICON_C.y} count={24} seed="cta" dur={18} power={0.8} /> : null}
    </AbsoluteFill>
  );
};
