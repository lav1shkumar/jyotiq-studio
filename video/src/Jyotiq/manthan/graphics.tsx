import React from "react";
import { Img, staticFile } from "remotion";
import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadRozha } from "@remotion/google-fonts/RozhaOne";
import { AppStoreButton, PlayButton } from "../katha/reelKit";
import { ANIME, H, P, ramp, rnd, track, W } from "./style";

/* Graphics + branding layer for Episode 1: kundali line-art, eclipse,
   Vishnu's plan drawn in gold, the anime name card, title, captions,
   the Jyotiq bug and the end card. Brand rules (Brand Bible s6/s8): warm
   black + diya gold for the world; the neon logo gradient only on the logo
   and end card; captions in the app's Plus Jakarta Sans, titles in serif. */

export const CINZEL = loadCinzel("normal", { weights: ["600", "700", "900"], subsets: ["latin"] }).fontFamily;
export const JAKARTA = loadJakarta("normal", { weights: ["600", "700", "800"], subsets: ["latin"] }).fontFamily;
export const PLAYFAIR = loadPlayfair("normal", { weights: ["600", "700"], subsets: ["latin"] }).fontFamily;
export const ROZHA = loadRozha("normal", { weights: ["400"], subsets: ["devanagari", "latin"] }).fontFamily;

const draw = (d: number) => ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - Math.max(0, Math.min(1, d)) });

/* ------------------------------------------------------------------ */
/* Kundali (North-Indian chart) with the Rahu-Ketu axis                */
/* ------------------------------------------------------------------ */

export const KundaliGrid: React.FC<{ f: number; cx: number; cy: number; size: number; d: number; glyphs: number; o?: number }> = ({
  f,
  cx,
  cy,
  size,
  d,
  glyphs,
  o = 1,
}) => {
  const h = size / 2;
  const q = size / 4;
  const pulse = 0.7 + 0.3 * Math.sin(f / 7);
  // rashi numbers per house for a sample chart (lagna = 5, Simha), counter-clockwise
  const houses: [number, number][] = [
    [0, -q], [-q, -h * 0.84], [-h * 0.84, -q], [-q, 0], [-h * 0.84, q], [-q, h * 0.84],
    [0, q], [q, h * 0.84], [h * 0.84, q], [q, 0], [h * 0.84, -q], [q, -h * 0.84],
  ];
  return (
    <g transform={`translate(${cx} ${cy})`} opacity={o}>
      <rect x={-h - 30} y={-h - 30} width={size + 60} height={size + 60} fill="#0C0A07" opacity={0.35 * d} rx={18} />
      <g fill="none" stroke={P.jGold} strokeWidth={4} strokeLinecap="round" filter="url(#mGlow)">
        <path d={`M${-h} ${-h}H${h}V${h}H${-h}Z`} {...draw(d * 1.4)} />
        <path d={`M${-h} ${-h}L${h} ${h}M${h} ${-h}L${-h} ${h}`} {...draw(d * 1.4 - 0.25)} />
        <path d={`M0 ${-h}L${h} 0L0 ${h}L${-h} 0Z`} {...draw(d * 1.4 - 0.4)} />
      </g>
      {houses.map(([x, y], i) => (i === 0 || i === 6) && glyphs > 0.01 ? null : (
        <text key={i} x={x} y={y + 8} textAnchor="middle" fontFamily={JAKARTA} fontWeight={700} fontSize={size * 0.05} fill={P.jGoldLight} opacity={0.5 * ramp(d, 0.7, 1)}>
          {((i + 4) % 12) + 1}
        </text>
      ))}
      {/* Rahu in the 1st house, Ketu in the 7th: always opposite */}
      {glyphs > 0.01 ? (
        <g opacity={glyphs}>
          <path d={`M0 ${-q + 30}L0 ${q - 30}`} stroke="#B9A6FF" strokeWidth={2.5} strokeDasharray="8 10" opacity={0.6} />
          {[
            { y: -q - 22, t: "रा", c: "#CDB8FF" },
            { y: q + 4, t: "के", c: "#FFB98A" },
          ].map((g, i) => (
            <g key={i}>
              <circle cx={0} cy={g.y - 18} r={size * 0.075} fill={g.c} opacity={0.2 * pulse} />
              <text x={0} y={g.y} textAnchor="middle" fontFamily={ROZHA} fontSize={size * 0.11} fill={g.c} style={{ filter: `drop-shadow(0 0 ${10 * pulse}px ${g.c})` }}>
                {g.t}
              </text>
            </g>
          ))}
        </g>
      ) : null}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Eclipse: Swarbhanu's shadow swallows the sun                         */
/* ------------------------------------------------------------------ */

export const Eclipse: React.FC<{ f: number; e: number; cx: number; cy: number; r: number }> = ({ f, e, cx, cy, r }) => {
  const off = (1 - e) * r * 2.3;
  const ring = ramp(e, 0.86, 1);
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r={r * 2.2} fill="#FFC94D" opacity={0.18 * (1 - ring * 0.5)} filter="url(#mBlur8)" />
      {new Array(18).fill(0).map((_, i) => (
        <path key={i} d={`M-4 ${-r - 14}L4 ${-r - 14}L0 ${-r - 40 - 20 * Math.sin(f / 9 + i)}Z`} transform={`rotate(${i * 20 + f * 0.3})`} fill="#FFD36B" opacity={0.7} />
      ))}
      <circle r={r} fill="url(#mSun)" />
      <defs>
        <radialGradient id="mSun">
          <stop offset="0" stopColor="#FFF6D2" />
          <stop offset="0.6" stopColor="#FFC94D" />
          <stop offset="1" stopColor="#F08A1C" />
        </radialGradient>
      </defs>
      {/* corona when covered */}
      <circle r={r + 6} fill="none" stroke="#FFF3C4" strokeWidth={8 * ring} opacity={ring} filter="url(#mGlow)" />
      {/* the shadow disc, with his eyes */}
      <g transform={`translate(${-off} ${-off * 0.18})`}>
        <circle r={r * 1.02} fill="#120A1C" />
        <circle r={r * 1.02} fill="none" stroke="#4B2E78" strokeWidth={6} opacity={0.7} />
        {[-1, 1].map((sd) => (
          <g key={sd} transform={`translate(${sd * r * 0.32} ${-r * 0.08})`} opacity={ramp(e, 0.4, 0.9)}>
            <path d={`M${-r * 0.16} 0C${-r * 0.08} ${-r * 0.08} ${r * 0.08} ${-r * 0.08} ${r * 0.16} 0C${r * 0.08} ${r * 0.06} ${-r * 0.08} ${r * 0.06} ${-r * 0.16} 0Z`} fill="#FFC23D" />
            <ellipse rx={r * 0.02} ry={r * 0.06} fill="#120A06" />
          </g>
        ))}
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Vishnu's plan in gold line-art: Mandar, Vasuki, the kalash          */
/* ------------------------------------------------------------------ */

export const PlanArt: React.FC<{ f: number; d: number; x: number; y: number; s?: number }> = ({ f, d, x, y, s = 1 }) => {
  const m = ramp(d, 0, 0.4, "io");
  const v = ramp(d, 0.3, 0.75, "io");
  const k = ramp(d, 0.62, 1, "io");
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={P.goldLight} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" filter="url(#mGlow)">
      {/* waves */}
      <path d="M-300 230C-250 210 -200 250 -150 230C-100 210 -50 250 0 230C50 210 100 250 150 230C200 210 250 250 300 230" {...draw(m)} />
      {/* Mandar parvat */}
      <path d="M-150 230L-60 -120L-20 -60L30 -200L90 -80L150 230" {...draw(m)} />
      <path d="M-30 -10L30 -200M10 60L50 -20" strokeWidth={3} opacity={0.7} {...draw(m)} />
      {/* Vasuki coiled round it */}
      <path d="M-200 120C-80 160 120 100 200 60C120 40 -80 70 -170 20C-80 0 100 -40 160 -70C100 -90 -40 -60 -110 -100" strokeWidth={6} {...draw(v)} />
      <path d="M-110 -100C-130 -112 -136 -132 -120 -140C-104 -148 -92 -130 -100 -118" strokeWidth={6} {...draw(v * 1.2 - 0.2)} />
      <path d="M200 60C232 70 260 100 250 130" strokeWidth={4} {...draw(v)} />
      {/* the amrit kalash at the summit */}
      <g transform="translate(200 -260)">
        <path d="M-40 0C-48 30 -30 44 0 44C30 44 48 30 40 0C34 -26 18 -34 0 -34C-18 -34 -34 -26 -40 0Z" {...draw(k)} />
        <path d="M-18 -34L-14 -50L14 -50L18 -34" {...draw(k)} />
        {k > 0.9
          ? new Array(8).fill(0).map((_, i) => (
              <path key={i} d="M0 -70L0 -96" transform={`rotate(${i * 45 + f})`} opacity={(k - 0.9) * 10} />
            ))
          : null}
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Anime name card (freeze-frame)                                      */
/* ------------------------------------------------------------------ */

export const NameCard: React.FC<{ f: number; at: number; out: number; name: string; deva: string; tag: string; y?: number; tagBg?: string }> = ({
  f,
  at,
  out,
  name,
  deva,
  tag,
  y = 1180,
  tagBg,
}) => {
  const t = f - at;
  if (t < 0 || f > out + 8) return null;
  const wipe = ramp(t, 0, 8, "out");
  const slam = track(t, [[0, 1.5], [6, 0.94, "out"], [10, 1.0, "back"]]);
  const shake = t < 10 ? (rnd(`nc${t}`) - 0.5) * 18 : 0;
  const o = 1 - ramp(f, out, out + 8, "in");
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: W, height: 300, opacity: o, transform: `translateX(${shake}px)` }}>
      <div
        style={{
          position: "absolute",
          left: -60,
          top: 40,
          width: W + 120,
          height: 210,
          background: "linear-gradient(100deg, rgba(36,22,63,0.0) 0%, rgba(36,22,63,0.92) 12%, rgba(20,12,36,0.95) 70%, rgba(36,22,63,0.0) 100%)",
          clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`,
          transform: "skewY(-4deg)",
          borderTop: `4px solid ${P.gold}`,
          borderBottom: `4px solid ${P.gold}`,
        }}
      />
      <div style={{ position: "absolute", left: 90, top: 30, transform: `scale(${slam}) rotate(-4deg)`, transformOrigin: "20% 50%" }}>
        <div style={{ fontFamily: ROZHA, fontSize: 120, lineHeight: 1.05, color: "#FFD36B", textShadow: "0 0 24px rgba(255,194,61,0.65), 0 6px 0 #4A2A08" }}>{deva}</div>
        <div style={{ fontFamily: ANIME, fontSize: 64, letterSpacing: 10, color: "#F6EBD6", marginTop: -6, textShadow: "0 4px 0 #24163F" }}>{name}</div>
        <div
          style={{
            fontFamily: JAKARTA,
            fontWeight: 700,
            fontSize: 32,
            color: "#CDB8FF",
            marginTop: 6,
            letterSpacing: 1,
            ...(tagBg ? { background: tagBg, display: "inline-block", padding: "2px 14px", borderRadius: 10 } : {}),
          }}
        >
          {tag}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Title card                                                          */
/* ------------------------------------------------------------------ */

export const TitleCard: React.FC<{ f: number; at: number; out: number }> = ({ f, at, out }) => {
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
        EPISODE 1 · <span style={{ fontFamily: ROZHA, fontWeight: 400, fontSize: 48 }}>श्राप</span> · SHRAAP
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Captions (burned in; middle-lower safe zone, clear of the rails)    */
/* ------------------------------------------------------------------ */

type Cap = { from: number; to: number; text: string; who: "n" | "d" | "i" | "v" | "s"; hi?: string[] };
const WHO = { n: "#FFF6E4", d: "#FFB066", i: "#BFE0FF", v: "#FFE08A", s: "#D9C6FF" };

export const CAPS: Cap[] = [
  { from: 8, to: 80, text: "Ek asur itna chatur tha...", who: "n", hi: ["chatur"] },
  { from: 80, to: 194, text: "...ki usne swayam Bhagwan Vishnu ko chhal diya.", who: "n", hi: ["Bhagwan", "Vishnu"] },
  { from: 206, to: 235, text: "Aur aaj bhi...", who: "n" },
  { from: 235, to: 334, text: "...woh aapki kundali mein baitha hai.", who: "n", hi: ["kundali"] },
  { from: 427, to: 495, text: "Yeh divya prasad hai, Devraj.", who: "d", hi: ["prasad"] },
  { from: 495, to: 545, text: "Ise sweekar karo.", who: "d" },
  { from: 563, to: 622, text: "Airavat...", who: "i" },
  { from: 622, to: 682, text: "...ise tum sambhalo.", who: "i" },
  { from: 754, to: 795, text: "Ahankari Indra!", who: "d", hi: ["Ahankari"] },
  { from: 795, to: 877, text: "Tumhara aishwarya, tumhari shakti...", who: "d" },
  { from: 877, to: 955, text: "...sab samudra mein vileen ho jaaye!", who: "d", hi: ["samudra"] },
  { from: 1006, to: 1033, text: "Shakti gayi...", who: "n" },
  { from: 1033, to: 1136, text: "...aur swarg asuron ka ho gaya.", who: "n", hi: ["asuron"] },
  { from: 1151, to: 1256, text: "Asuron ki sena mein ek aisa yoddha tha...", who: "n", hi: ["yoddha"] },
  { from: 1256, to: 1383, text: "...jiski bhookh kisi bhi ratna se badi thi.", who: "n", hi: ["bhookh"] },
  { from: 1416, to: 1483, text: "Prabhu... hamein bachaiye!", who: "i", hi: ["bachaiye!"] },
  { from: 1504, to: 1585, text: "Amrit ke bina tum unhe nahi hara sakte.", who: "v", hi: ["Amrit"] },
  { from: 1585, to: 1725, text: "Aur amrit ke liye... tumhein asuron ka saath chahiye.", who: "v", hi: ["asuron", "saath"] },
  { from: 1744, to: 1808, text: "Devta...", who: "s" },
  { from: 1808, to: 1893, text: "...humse madad maangne aaye hain?", who: "s", hi: ["madad"] },
];

export const Captions: React.FC<{ f: number; y?: number }> = ({ f, y = 1300 }) => {
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
          <span key={i} style={{ color: c.hi?.includes(w) ? "#FFC94D" : undefined }}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    </div>
  );
};

/** Small Jyotiq diya bug, top-left (clear of IG's top-right controls). */
export const BrandBug: React.FC<{ o: number }> = ({ o }) => (
  <div style={{ position: "absolute", left: 44, top: 110, display: "flex", alignItems: "center", gap: 10, opacity: o * 0.62 }}>
    <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: 66, height: 54, objectFit: "contain" }} />
    <div style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 30, color: P.jGoldLight, letterSpacing: 2 }}>Jyotiq</div>
  </div>
);

/* ------------------------------------------------------------------ */
/* End card                                                            */
/* ------------------------------------------------------------------ */

export const EndCard: React.FC<{ f: number; at: number; v2?: boolean; cta?: number }> = ({ f, at, v2 = false, cta }) => {
  const t = f - at;
  if (t < 0) return null;
  const a = ramp(t, 0, 14, "out");
  const b = ramp(t, 14, 28, "out");
  // v2 (Episode 1 with the voiced close): the CTA block arrives with the spoken sign-off at frame `cta`
  const late = v2 && cta !== undefined;
  const c = late ? ramp(f, cta, cta + 14, "out") : ramp(t, 30, 44, "out");
  const d = late ? ramp(f, cta + 10, cta + 24, "out") : ramp(t, 44, 58, "out");
  // v2 lifts the lower blocks so the disclaimer ends above Instagram's bottom 250 px, and adds the site
  const Y = v2 ? { cta: 1215, badges: 1410, url: 1515, disc: 1590 } : { cta: 1240, badges: 1480, url: 0, disc: 1660 };
  const glow = 0.5 + 0.5 * Math.sin(t / 8);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ marginTop: 250, opacity: a, transform: `translateY(${(1 - a) * 30}px)`, textAlign: "center" }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 34, letterSpacing: 8, color: "#CDB8FF" }}>AGLA EPISODE</div>
        <div style={{ fontFamily: ROZHA, fontSize: 130, lineHeight: 1.05, color: "#FFD36B", textShadow: "0 0 30px rgba(255,201,77,0.5)" }}>संधि</div>
        <div style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 64, letterSpacing: 18, color: "#F6EBD6" }}>SANDHI</div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 600, fontSize: 34, color: "#F3DB9D", marginTop: 14 }}>Devta aur asur... ek saath?</div>
      </div>
      <div style={{ position: "absolute", top: 1000, width: 860, textAlign: "center", opacity: b }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 46, lineHeight: 1.25, color: "#FFF6E4" }}>
          Rahu aur Ketu aaj bhi <span style={{ color: "#FFC94D" }}>aapki kundali</span> mein hain.
        </div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 600, fontSize: 36, color: "#F3DB9D", marginTop: 12 }}>Dekhiye kahan baithe hain.</div>
      </div>
      <div style={{ position: "absolute", top: Y.cta, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, opacity: c, transform: `scale(${0.92 + 0.08 * c})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Img src={staticFile("jyotiq/logo-full.png")} style={{ width: 150, height: 172, objectFit: "contain" }} />
          <div>
            <div style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 64, color: "#FFE7A8", lineHeight: 1 }}>Jyotiq se pucho</div>
            <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 32, color: "#F3DB9D", marginTop: 8 }}>Pehla sawaal free · phir ₹5 per sawaal</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: Y.badges, display: "flex", gap: 22, opacity: d, transform: `translateY(${(1 - d) * 24}px) scale(0.62)`, transformOrigin: "50% 0" }}>
        <PlayButton glow={glow} />
        <AppStoreButton glow={glow} />
      </div>
      {v2 ? (
        <div style={{ position: "absolute", top: Y.url, fontFamily: JAKARTA, fontWeight: 800, fontSize: 40, letterSpacing: 2, color: "#FFE7A8", opacity: d }}>
          www.jyotiq.ai
        </div>
      ) : null}
      <div style={{ position: "absolute", top: Y.disc, fontFamily: JAKARTA, fontWeight: 600, fontSize: 22, color: "rgba(243,219,157,0.6)", opacity: d }}>
        Guidance only, for entertainment and information.
      </div>
    </div>
  );
};

export const FrameH = H;
