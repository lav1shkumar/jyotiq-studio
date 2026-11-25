import React from "react";
import { Img, staticFile } from "remotion";
import { AppStoreButton, PlayButton } from "../../katha/reelKit";
import { JAKARTA, PLAYFAIR, ROZHA } from "../../manthan/graphics";
import { H, ramp, track, W } from "../../manthan/style";
import { DiyaDefs, DiyaRow } from "../d1/diya";

/* Diwali series end-card pieces, generalised from Day 1 (d1/gfxD1.tsx EndTeaseD1/EndBrandD1, d1/scenesD1c.tsx
   RowLayerD1) so Days 2-5 share the exact look:
   - EndTease: tomorrow's question beside the next diya (Day 5 uses EndCelebrate instead),
   - EndBrand: comment prompt, the Jyotiq block, the store badges, the bio CTA and the disclaimer,
   - FeatureCard: a stylised notification/feature card that slides in beside the real-app phone (never a fake
     screenshot: it is drawn as a card, not as app UI),
   - RowLayer: the series' diya row as one persistent layer: it appears when today's diya lights, becomes the
     progress bar at the top through the feature scenes, and drops into the end card. */

export const PILL: React.CSSProperties = {
  background: "rgba(12,10,7,0.72)",
  border: "2px solid rgba(223,177,91,0.85)",
  boxShadow: "0 6px 24px rgba(0,0,0,0.45)",
};
export const GOLD_TXT = "0 0 34px rgba(255,201,77,0.6), 0 6px 0 #4A2A08";

export const EndTease: React.FC<{ f: number; at: number; kicker: string; lines: string[]; sub: string; left?: number; top?: number }> = ({
  f, at, kicker, lines, sub, left = 520, top = 230,
}) => {
  const t = f - at;
  if (t < 0) return null;
  const a = ramp(t, 0, 12, "out");
  const b = ramp(t, 8, 20, "out");
  return (
    <div style={{ position: "absolute", left, top, width: 1040 - left, opacity: a, transform: `translateX(${(1 - a) * 30}px)` }}>
      <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: "#BFD0EE" }}>{kicker}</div>
      <div style={{ fontFamily: ROZHA, fontSize: 64, lineHeight: 1.12, color: "#FFD36B", marginTop: 8, textShadow: "0 0 26px rgba(255,201,77,0.45), 0 5px 0 #0E0A1C", opacity: b }}>
        {lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 30, color: "#F3DB9D", marginTop: 10, opacity: b }}>{sub}</div>
    </div>
  );
};

/** Day 5's close: all five diyas are lit. */
export const EndCelebrate: React.FC<{ f: number; at: number; top?: number }> = ({ f, at, top = 250 }) => {
  const t = f - at;
  if (t < 0) return null;
  const a = ramp(t, 0, 12, "out");
  const pop = track(t, [[0, 0.8], [10, 1.08, "out"], [16, 1, "io"]]);
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top, display: "flex", flexDirection: "column", alignItems: "center", opacity: a, transform: `scale(${pop})` }}>
      <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 32, letterSpacing: 8, color: "#BFD0EE" }}>PAANCHON DIYE JAL GAYE</div>
      <div style={{ fontFamily: ROZHA, fontSize: 120, lineHeight: 1.05, color: "#FFD36B", textShadow: GOLD_TXT }}>शुभ दीपावली</div>
      <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 32, color: "#F3DB9D", marginTop: 8 }}>Follow karo, agli series ke liye</div>
    </div>
  );
};

export const EndBrand: React.FC<{ f: number; at: number; offerAt: number; comment: React.ReactNode; top?: number }> = ({ f, at, offerAt, comment, top = 820 }) => {
  const t = f - at;
  if (t < 0) return null;
  const c = ramp(t, 0, 12, "out");
  const d = ramp(f, offerAt - 6, offerAt + 8, "out");
  const cm = ramp(t, 14, 26, "out");
  const glow = 0.5 + 0.5 * Math.sin(t / 8);
  const nudge = Math.sin(f / 5) * 6;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "absolute", top, display: "flex", justifyContent: "center", opacity: cm, transform: `scale(${0.9 + 0.1 * cm})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 26px 12px", borderRadius: 40, ...PILL }}>
          <svg width={40} height={40} viewBox="-12 -12 24 24" style={{ display: "block" }}>
            <path d="M-9 -8H9V5H-1L-6 10V5H-9Z" fill="#FFC94D" />
            <circle cx={-4} cy={-1.5} r={1.4} fill="#0C0A07" />
            <circle cx={0} cy={-1.5} r={1.4} fill="#0C0A07" />
            <circle cx={4} cy={-1.5} r={1.4} fill="#0C0A07" />
          </svg>
          <span style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 34, color: "#FFF6E4" }}>{comment}</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: top + 140, display: "flex", alignItems: "center", gap: 18, opacity: c, transform: `scale(${0.92 + 0.08 * c})` }}>
        <Img src={staticFile("jyotiq/logo-full.png")} style={{ width: 150, height: 172, objectFit: "contain" }} />
        <div>
          <div style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 64, color: "#FFE7A8", lineHeight: 1 }}>Jyotiq se pucho</div>
          <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 32, color: "#F3DB9D", marginTop: 8 }}>Pehla sawaal free · phir ₹5 per sawaal</div>
          <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 34, color: "#FFC94D", marginTop: 8, letterSpacing: 1 }}>www.jyotiq.ai</div>
        </div>
      </div>
      <div style={{ position: "absolute", top: top + 400, display: "flex", gap: 22, opacity: d, transform: `translateY(${(1 - d) * 24}px) scale(0.66)`, transformOrigin: "50% 0" }}>
        <PlayButton glow={glow} />
        <AppStoreButton glow={glow} />
      </div>
      <div style={{ position: "absolute", top: top + 498, display: "flex", alignItems: "center", gap: 10, opacity: d }}>
        <svg width={40} height={40} viewBox="-12 -12 24 24" style={{ display: "block", transform: `translate(${-nudge * 0.6}px, ${nudge}px)` }}>
          <path d="M8 -8L-7 7M-7 -3L-7 7L3 7" stroke="#FFC94D" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <span style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 32, color: "#FFF6E4" }}>
          App ka link <span style={{ color: "#FFC94D" }}>profile (bio)</span> mein
        </span>
      </div>
      <div style={{ position: "absolute", top: top + 560, fontFamily: JAKARTA, fontWeight: 600, fontSize: 22, color: "rgba(243,219,157,0.6)", opacity: d }}>
        Guidance only, for entertainment and information.
      </div>
    </div>
  );
};

const Icon: React.FC<{ kind: "bell" | "dasha" | "gochar" | "lang"; f: number }> = ({ kind, f }) => {
  if (kind === "bell") {
    const ring = Math.sin(f / 2) * 12 * Math.max(0, Math.sin(f / 18));
    return (
      <svg width={64} height={64} viewBox="-16 -16 32 32" style={{ display: "block" }}>
        <g transform={`rotate(${ring})`}>
          <path d="M-9 6C-9 -2 -7 -9 0 -10C7 -9 9 -2 9 6L11 8L-11 8Z" fill="#FFC94D" />
          <circle cy={11} r={3} fill="#FFC94D" />
        </g>
        <circle cx={9} cy={-9} r={4.5} fill="#E8463A" />
      </svg>
    );
  }
  if (kind === "dasha") {
    return (
      <svg width={64} height={64} viewBox="-16 -16 32 32" style={{ display: "block" }}>
        {[[-12, 6], [-5, 12], [2, 4], [8, 9]].map(([x, h], i) => (
          <rect key={i} x={x} y={10 - h} width={5} height={h} rx={1.5} fill={i === 2 ? "#FFD36B" : "#9A7CFF"} />
        ))}
        <path d="M2 -12L6 -12L4 -8Z" fill="#FFF3C4" />
      </svg>
    );
  }
  if (kind === "gochar") {
    const a = f * 0.06;
    return (
      <svg width={64} height={64} viewBox="-16 -16 32 32" style={{ display: "block" }}>
        <circle r={12} fill="none" stroke="#DFB15B" strokeWidth={1.6} />
        <circle r={4} fill="#FFC94D" />
        <circle cx={12 * Math.cos(a)} cy={12 * Math.sin(a)} r={3} fill="#7A8AD8" />
        <circle cx={12 * Math.cos(a + 2.4)} cy={12 * Math.sin(a + 2.4)} r={2.4} fill="#F2C230" />
      </svg>
    );
  }
  return (
    <svg width={64} height={64} viewBox="-16 -16 32 32" style={{ display: "block" }}>
      <rect x={-14} y={-12} width={16} height={16} rx={3} fill="#FFC94D" />
      <text x={-6} y={1} textAnchor="middle" fontFamily={ROZHA} fontSize={13} fill="#0C0A07">
        अ
      </text>
      <rect x={-2} y={-2} width={16} height={16} rx={3} fill="#9A7CFF" />
      <text x={6} y={11} textAnchor="middle" fontFamily={JAKARTA} fontWeight={800} fontSize={12} fill="#FFFFFF">
        A
      </text>
    </svg>
  );
};

/** A stylised feature card (not a screenshot) that slides in beside the real-app phone. */
export const FeatureCard: React.FC<{
  f: number;
  at: number;
  out: number;
  icon: "bell" | "dasha" | "gochar" | "lang";
  title: React.ReactNode;
  line2?: React.ReactNode;
  x?: number;
  y?: number;
  w?: number;
}> = ({ f, at, out, icon, title, line2, x = 90, y = 360, w = 900 }) => {
  const t = f - at;
  if (t < 0 || f > out + 8) return null;
  const a = ramp(t, 0, 10, "out");
  const o = a * (1 - ramp(f, out - 4, out + 8, "in"));
  const pop = track(t, [[0, 0.9], [8, 1.04, "out"], [12, 1, "io"]]);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity: o, transform: `translateY(${(1 - a) * -60}px) scale(${pop})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 26px", borderRadius: 30, ...PILL, border: "3px solid rgba(255,201,77,0.95)", boxShadow: "0 0 36px rgba(255,201,77,0.4), 0 10px 30px rgba(0,0,0,0.5)" }}>
        <Icon kind={icon} f={f} />
        <div>
          <div style={{ fontFamily: ROZHA, fontSize: 50, lineHeight: 1.1, color: "#FFD36B" }}>{title}</div>
          {line2 ? <div style={{ fontFamily: ROZHA, fontSize: 38, lineHeight: 1.15, color: "#FFF6E4", marginTop: 4 }}>{line2}</div> : null}
        </div>
      </div>
    </div>
  );
};

/**
 * The series' diya row as one persistent svg layer. Diyas before `n` (1-based) are already lit; diya `n` lights at
 * `at`. From `toTopAt` it becomes the progress bar at the top; from `toEndAt` it drops into the end card with the
 * next diya highlighted (Day 5: `celebrate` lifts all five instead).
 */
export const RowLayer: React.FC<{ f: number; n: number; at: number; toTopAt: number; toEndAt: number; centerY?: number; celebrate?: boolean; centerScale?: number }> = ({
  f, n, at, toTopAt, toEndAt, centerY = 1000, celebrate = false, centerScale = 0.95,
}) => {
  // centerScale: the row's size while it sits in the centre (Day 5 uses less, so the lit diya 5 clears the right edge)
  if (f < at - 4) return null;
  const inK = ramp(f, at - 4, at + 4, "out");
  const litN = ramp(f, at + 2, at + 14, "out");
  const toTop = ramp(f, toTopAt - 8, toTopAt + 10, "io");
  const toEnd = ramp(f, toEndAt - 14, toEndAt + 6, "io");
  const y = centerY + (230 - centerY) * toTop + (700 - 230) * toEnd;
  const sc = centerScale + (0.55 - centerScale) * toTop + (0.8 - 0.55) * toEnd;
  const labels = Math.max(0, Math.min(1, 1 - toTop + toEnd));
  const lit = [0, 1, 2, 3, 4].map((i) => (i < n - 1 ? 1 : i === n - 1 ? litN : 0));
  const next = n < 5 ? n : -1;
  const lift = celebrate ? 1 + 0.06 * Math.sin(f / 6) * toEnd : 1;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, opacity: inK }}>
      <DiyaDefs />
      <g transform={`translate(540 ${y}) scale(${(sc / 0.9) * lift}) translate(-540 ${-y})`}>
        <DiyaRow
          f={f}
          y={y}
          lit={lit}
          labels={labels}
          highlight={toEnd > 0.01 && next >= 0 ? next : toTop < 0.5 ? n - 1 : -1}
          hl={toEnd > 0.01 && next >= 0 ? 0.6 * toEnd : toTop < 0.5 ? 0.5 * litN : 0}
        />
      </g>
    </svg>
  );
};
