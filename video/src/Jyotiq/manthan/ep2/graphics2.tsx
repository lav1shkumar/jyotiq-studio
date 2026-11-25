import React from "react";
import { Img, staticFile } from "remotion";
import { AppStoreButton, PlayButton } from "../../katha/reelKit";
import { CINZEL, JAKARTA, KundaliGrid, PLAYFAIR, ROZHA } from "../graphics";
import { P, ramp, track } from "../style";
import { CAPS, CUES } from "./timing";

/* Episode 2 graphics + branding. Same look as Episode 1's graphics.tsx (fonts, gold, captions box). */

const draw = (d: number) => ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - Math.max(0, Math.min(1, d)) });

export const TitleCard2: React.FC<{ f: number; at: number; out: number }> = ({ f, at, out }) => {
  const t = f - at;
  if (t < -2 || f > out + 10) return null;
  const a = ramp(t, 0, 12, "out");
  const b = ramp(t, 6, 22, "out");
  const c = ramp(t, 16, 30, "out");
  const o = 1 - ramp(f, out - 4, out + 8, "in");
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: a, transform: `translateY(${(1 - a) * 20}px)`, marginBottom: 30 }}>
        <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: 92, height: 76, objectFit: "contain" }} />
        <div style={{ fontFamily: PLAYFAIR, fontWeight: 600, fontSize: 40, color: P.jGoldLight, letterSpacing: 4 }}>Jyotiq presents</div>
      </div>
      <div style={{ fontFamily: ROZHA, fontSize: 210, lineHeight: 1, color: "#FFD36B", opacity: b, transform: `scale(${0.85 + 0.15 * b})`, textShadow: "0 0 40px rgba(255,201,77,0.55), 0 8px 0 #5A3208" }}>
        मंथन
      </div>
      <div style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 96, letterSpacing: 26, color: "#F6EBD6", opacity: b, marginTop: 6, textShadow: "0 0 18px rgba(255,201,77,0.4)" }}>MANTHAN</div>
      <div style={{ width: 520 * c, height: 3, background: `linear-gradient(90deg, transparent, ${P.gold}, transparent)`, margin: "26px 0" }} />
      <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 40, color: P.jGoldLight, opacity: c, letterSpacing: 3 }}>
        EPISODE 2 · <span style={{ fontFamily: ROZHA, fontWeight: 400, fontSize: 48 }}>संधि</span> · SANDHI
      </div>
    </div>
  );
};

const WHO = { n: "#FFF6E4", s: "#D9C6FF", b: "#FFB48A", i: "#BFE0FF", k: "#A8F0DE", v: "#FFE08A" };

/** Burned-in captions from ep2/timing.ts (generated with the mix, so they follow the voices). */
export const Captions2: React.FC<{ f: number; y?: number }> = ({ f, y = 1300 }) => {
  const c = CAPS.find((k) => f >= k.from && f < k.to);
  if (!c) return null;
  const t = f - c.from;
  const pop = track(t, [[0, 0.9], [5, 1.03, "out"], [9, 1, "io"]]);
  const o = ramp(t, 0, 4) * (1 - ramp(f, c.to - 4, c.to, "in"));
  const words = c.text.split(" ");
  return (
    <div style={{ position: "absolute", left: 80, width: 840, top: y, display: "flex", justifyContent: "center", opacity: o }}>
      <div
        style={{
          transform: `scale(${pop})`,
          padding: "16px 30px 18px",
          borderRadius: 22,
          background: "rgba(12,10,7,0.62)",
          border: "1.5px solid rgba(223,177,91,0.55)",
          textAlign: "center",
          fontFamily: JAKARTA,
          fontWeight: 800,
          fontSize: 52,
          lineHeight: 1.18,
          color: WHO[c.who],
          textShadow: "0 3px 10px rgba(0,0,0,0.6)",
        }}
      >
        {words.map((w, i) => (
          <span key={i} style={{ color: c.hi.includes(w) ? "#FFC94D" : undefined }}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    </div>
  );
};

/** Gold line-art of two forearms clasping, then the word संधि. d = draw progress 0..1. SVG units. */
export const SandhiArt: React.FC<{ f: number; d: number; x: number; y: number; s?: number }> = ({ f, d, x, y, s = 1 }) => {
  const pulse = 0.7 + 0.3 * Math.sin(f / 6);
  const stroke = { stroke: "#FFD36B", strokeWidth: 6, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#mGlow)">
      <path d="M-420 160C-330 110 -220 70 -110 40" {...stroke} {...draw(d * 1.4)} />
      <path d="M-420 220C-320 170 -210 130 -100 100" {...stroke} {...draw(d * 1.4)} />
      <path d="M420 160C330 110 220 70 110 40" {...stroke} {...draw(d * 1.4)} />
      <path d="M420 220C320 170 210 130 100 100" {...stroke} {...draw(d * 1.4)} />
      <path d="M-110 40C-60 20 -10 30 20 50C50 70 60 100 30 118C0 132 -60 120 -100 100" {...stroke} {...draw(d * 1.4 - 0.25)} />
      <path d="M110 40C60 20 10 30 -20 50C-50 70 -60 100 -30 118C0 132 60 120 100 100" {...stroke} {...draw(d * 1.4 - 0.3)} />
      {/* wrist bands (kada) and the fingers wrapped over the grip, so it reads as two hands */}
      <g opacity={ramp(d, 0.45, 0.75)}>
        <path d="M-150 30C-136 54 -134 84 -146 112M150 30C136 54 134 84 146 112" stroke="#FFD36B" strokeWidth={9} fill="none" strokeLinecap="round" />
        {[-34, -14, 6, 26].map((x) => (
          <path key={x} d={`M${x} 46C${x + 10} 62 ${x + 12} 82 ${x + 4} 100`} stroke="#FFE6A3" strokeWidth={4} fill="none" strokeLinecap="round" />
        ))}
        <path d="M-60 104C-40 92 -20 92 -6 104" stroke="#FFE6A3" strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
      {new Array(12).fill(0).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r0 = 170;
        const r1 = 230 + (i % 2) * 40;
        return (
          <path
            key={i}
            d={`M${Math.cos(a) * r0} ${80 + Math.sin(a) * r0 * 0.6}L${Math.cos(a) * r1} ${80 + Math.sin(a) * r1 * 0.6}`}
            stroke="#FFE6A3"
            strokeWidth={3}
            opacity={ramp(d, 0.7, 1) * pulse}
          />
        );
      })}
      <text x={0} y={360} textAnchor="middle" fontFamily={ROZHA} fontSize={170} fill="#FFD36B" opacity={ramp(d, 0.65, 1)}>
        संधि
      </text>
    </g>
  );
};

/** Gold राहु seal that slams in at `at` (frames). SVG units. */
export const RahuStamp: React.FC<{ f: number; at: number; x: number; y: number; s?: number }> = ({ f, at, x, y, s = 1 }) => {
  const t = f - at;
  if (t < 0) return null;
  const k = track(t, [[0, 1.7], [5, 0.94, "out"], [9, 1, "io"]]);
  const o = ramp(t, 0, 3);
  const glow = 0.6 + 0.4 * Math.sin(t / 7);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`} opacity={o}>
      <circle r={150} fill="#FFB43D" opacity={0.25 * glow} filter="url(#mBlur8)" />
      <circle r={128} fill="rgba(20,10,6,0.55)" stroke="#FFD36B" strokeWidth={6} />
      <circle r={112} fill="none" stroke="#FFD36B" strokeWidth={2} opacity={0.7} strokeDasharray="10 8" />
      <text x={0} y={34} textAnchor="middle" fontFamily={ROZHA} fontSize={118} fill="#FFD36B">
        राहु
      </text>
      <text x={0} y={92} textAnchor="middle" fontFamily={CINZEL} fontWeight={900} fontSize={30} letterSpacing={12} fill="#F6EBD6">
        RAHU
      </text>
    </g>
  );
};

/**
 * Episode 2 end card. Each block appears as the narrator says it (CUES from the timing script):
 * tie-in on 17_narrator, the opposite houses glow on "कुंडली", "Kis ghar mein?" on "घर",
 * the sign-off block on "ज्योतिक़ से पूछिए", the offer on "पहला".
 */
export const EndCard2: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const t = f - at;
  if (t < 0) return null;
  const a = ramp(t, 0, 14, "out");
  const b = ramp(f, CUES.endCard + 12, CUES.endCard + 24, "out");
  const k = ramp(f, CUES.closeKundali, CUES.closeKundali + 18, "out");
  const q = ramp(f, CUES.closeHouse, CUES.closeHouse + 10, "out");
  const c = ramp(f, CUES.signoff, CUES.signoff + 12, "out");
  const d = ramp(f, CUES.offer, CUES.offer + 12, "out");
  const glow = 0.5 + 0.5 * Math.sin(t / 8);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ marginTop: 150, opacity: a, transform: `translateY(${(1 - a) * 30}px)`, textAlign: "center" }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 34, letterSpacing: 8, color: "#CDB8FF" }}>AGLA EPISODE</div>
        <div style={{ fontFamily: ROZHA, fontSize: 130, lineHeight: 1.05, color: "#FFD36B", textShadow: "0 0 30px rgba(255,201,77,0.5)" }}>कूर्म</div>
        <div style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 64, letterSpacing: 18, color: "#F6EBD6" }}>KURMA</div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 600, fontSize: 34, color: "#F3DB9D", marginTop: 14 }}>Parvat ko kaun thaamega?</div>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g opacity={b}>
          <KundaliGrid f={f} cx={540} cy={790} size={280} d={b} glyphs={k} o={0.9} />
        </g>
      </svg>
      <div style={{ position: "absolute", top: 965, width: 880, textAlign: "center", opacity: b }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 46, lineHeight: 1.25, color: "#FFF6E4" }}>
          <span style={{ color: "#FFC94D" }}>Rahu</span> sir hai, <span style={{ color: "#FFC94D" }}>Ketu</span> dhad.
        </div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 38, lineHeight: 1.3, color: "#F3DB9D", marginTop: 10, opacity: k }}>
          Aapki <span style={{ color: "#FFC94D" }}>kundali</span> mein dono
          <br />
          hamesha aamne&#8209;saamne.
        </div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 44, color: "#FFFFFF", marginTop: 12, opacity: q, transform: `scale(${0.9 + 0.1 * q})` }}>
          Kis ghar mein?
        </div>
      </div>
      <div style={{ position: "absolute", top: 1255, display: "flex", alignItems: "center", gap: 18, opacity: c, transform: `scale(${0.92 + 0.08 * c})` }}>
        <Img src={staticFile("jyotiq/logo-full.png")} style={{ width: 150, height: 172, objectFit: "contain" }} />
        <div>
          <div style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 64, color: "#FFE7A8", lineHeight: 1 }}>Jyotiq se pucho</div>
          <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 32, color: "#F3DB9D", marginTop: 8, opacity: d }}>Pehla sawaal free · phir ₹5 per sawaal</div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1458, display: "flex", gap: 22, opacity: c, transform: `translateY(${(1 - c) * 24}px) scale(0.62)`, transformOrigin: "50% 0" }}>
        <PlayButton glow={glow} />
        <AppStoreButton glow={glow} />
      </div>
      <div style={{ position: "absolute", top: 1560, fontFamily: JAKARTA, fontWeight: 800, fontSize: 40, letterSpacing: 2, color: "#FFE7A8", opacity: c }}>
        www.jyotiq.ai
      </div>
      <div style={{ position: "absolute", top: 1622, fontFamily: JAKARTA, fontWeight: 600, fontSize: 22, color: "rgba(243,219,157,0.6)", opacity: c }}>
        Guidance only, for entertainment and information.
      </div>
    </div>
  );
};
