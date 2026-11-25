import React from "react";
import { Img, staticFile } from "remotion";
import { AppStoreButton, PlayButton } from "../../katha/reelKit";
import { CINZEL, JAKARTA, KundaliGrid, PLAYFAIR, ROZHA } from "../graphics";
import { P, ramp, track } from "../style";
import { CUES, LINES } from "./timing";

/* Episode 5 graphics in the series' exact style (Episode 1-4 fonts, colours, card shapes), plus the
   interactive layer this episode adds for retention:
   - the hook as a poll ("लक्ष्मी ने किसे चुना?" with देवता / असुर / ? chips struck in time with the voice),
   - "who got what" toasts for each treasure, docking into a row at the top,
   - Lakshmi's open question ("लक्ष्मी → ?") that stays up through her choice and turns into the answer,
   - elimination tags (✗ क्रोध, ✗ मोह) on the candidates she passes,
   - a comment prompt and the profile-link line on the end card.
   NameCard and BrandBug come from ../graphics unchanged. */

const GOLD_TXT = "0 0 34px rgba(255,201,77,0.6), 0 6px 0 #4A2A08";
const PILL: React.CSSProperties = {
  background: "rgba(12,10,7,0.7)",
  border: "2px solid rgba(223,177,91,0.8)",
  boxShadow: "0 6px 24px rgba(0,0,0,0.45)",
};

const Cross: React.FC<{ size: number; color?: string; w?: number }> = ({ size, color = "#FFFFFF", w = 3.4 }) => (
  <svg width={size} height={size} viewBox="-10 -10 20 20" style={{ display: "block" }}>
    <path d="M-6 -6L6 6M6 -6L-6 6" stroke={color} strokeWidth={w} strokeLinecap="round" />
  </svg>
);
const Tick: React.FC<{ size: number; color?: string }> = ({ size, color = "#FFFFFF" }) => (
  <svg width={size} height={size} viewBox="-10 -10 20 20" style={{ display: "block" }}>
    <path d="M-7 0L-2 5L7 -6" stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);
const Arrow: React.FC<{ size: number; color?: string }> = ({ size, color = "#F3DB9D" }) => (
  <svg width={size} height={size} viewBox="-10 -10 20 20" style={{ display: "block" }}>
    <path d="M-8 0L6 0M0 -6L7 0L0 6" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Hook poll (from frame 0, middle third, readable with the sound off) */
/* ------------------------------------------------------------------ */

const Chip: React.FC<{ f: number; text: string; appear: number; strike?: number; ask?: boolean }> = ({ f, text, appear, strike, ask }) => {
  const a = ramp(f, appear, appear + 6, "out");
  const pop = track(f - appear, [[0, 0.7], [6, 1.06, "out"], [10, 1, "io"]]);
  const st = strike !== undefined ? ramp(f, strike, strike + 6, "out") : 0;
  const bad = strike !== undefined ? track(f - strike, [[0, 0], [5, 1.15, "out"], [9, 1, "io"]]) : 0;
  const q = ask ? ramp(f, CUES.kise - 4, CUES.kise + 6, "out") : 0;
  const pulse = ask ? 1 + q * (0.12 + 0.05 * Math.sin(f / 3)) : 1;
  return (
    <div
      style={{
        position: "relative",
        width: 250,
        height: 106,
        borderRadius: 53,
        ...PILL,
        border: ask ? `3px solid rgba(255,201,77,${0.7 + 0.3 * q})` : PILL.border,
        boxShadow: ask ? `0 0 ${20 + 30 * q}px rgba(255,201,77,${0.35 + 0.4 * q})` : PILL.boxShadow,
        opacity: a,
        transform: `scale(${pop * pulse})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ fontFamily: ROZHA, fontSize: ask ? 76 : 62, lineHeight: 1, color: ask ? "#FFD36B" : "#FFF6E4", opacity: 1 - 0.45 * st, marginTop: 4 }}>{text}</div>
      {st > 0 ? (
        <div style={{ position: "absolute", left: 18, right: 18, top: 49, height: 8, borderRadius: 4, background: "#E8304A", boxShadow: "0 0 14px rgba(232,48,74,0.8)", transform: `rotate(-10deg) scaleX(${st})`, transformOrigin: "0 50%" }} />
      ) : null}
      {bad > 0 ? (
        <div style={{ position: "absolute", right: -10, top: -14, width: 48, height: 48, borderRadius: 24, background: "#E8304A", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${bad})`, boxShadow: "0 3px 10px rgba(0,0,0,0.5)" }}>
          <Cross size={30} />
        </div>
      ) : null}
    </div>
  );
};

export const HookPoll5: React.FC<{ f: number; out: number }> = ({ f, out }) => {
  if (f > out + 8) return null;
  const o = 1 - ramp(f, out - 6, out + 8, "in");
  const settle = track(f, [[0, 1.04], [10, 1.0, "out"]]);
  // Full question is on screen from frame 0 (sound-off hook); a dark plate separates the gold
  // text from the gold Mandara peak behind it.
  const pop = track(f, [[0, 1.04], [10, 1.0, "out"]]);
  return (
    <div style={{ position: "absolute", left: 0, top: 600, width: 1080, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
      <div style={{ position: "absolute", left: 170, top: -24, width: 740, height: 300, borderRadius: 150, background: "radial-gradient(ellipse at center, rgba(14,10,32,0.82) 0%, rgba(14,10,32,0.6) 55%, rgba(14,10,32,0) 100%)" }} />
      <div style={{ position: "relative", fontFamily: ROZHA, fontSize: 92, lineHeight: 1.1, color: "#F6EBD6", transform: `scale(${settle})`, textShadow: "0 0 26px rgba(10,14,40,0.9), 0 5px 0 #0E0A1C" }}>
        लक्ष्मी ने
      </div>
      <div style={{ position: "relative", fontFamily: ROZHA, fontSize: 116, lineHeight: 1.12, marginTop: 4, color: "#FFD36B", transform: `scale(${pop})`, textShadow: `${GOLD_TXT}, 0 0 18px rgba(14,10,32,0.95), 0 6px 0 #0E0A1C` }}>
        किसे चुना?
      </div>
      <div style={{ display: "flex", gap: 28, marginTop: 44 }}>
        <Chip f={f} text="देवता" appear={10} strike={CUES.strikeDevta} />
        <Chip f={f} text="असुर" appear={14} strike={CUES.strikeAsur} />
        <Chip f={f} text="?" appear={18} ask />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Title card (Episode 1's layout, Episode 5's name)                   */
/* ------------------------------------------------------------------ */

export const TitleCard5: React.FC<{ f: number; at: number; out: number }> = ({ f, at, out }) => {
  const t = f - at;
  if (t < -2 || f > out + 10) return null;
  const a = ramp(t, 0, 10, "out");
  const b = ramp(t, 4, 16, "out");
  const c = ramp(t, 10, 22, "out");
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
        EPISODE 5 · <span style={{ fontFamily: ROZHA, fontWeight: 400, fontSize: 48 }}>लक्ष्मी</span> · LAKSHMI
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* "Who got what": a toast per treasure, docking into a row at the top */
/* ------------------------------------------------------------------ */

const TOASTS = [
  { at: CUES.rishi, item: "कामधेनु", to: "ऋषि" },
  { at: CUES.mera, item: "उच्चैःश्रवा", to: "बलि" },
  { at: CUES.indra, item: "ऐरावत", to: "इंद्र" },
  { at: CUES.vishnuGem, item: "कौस्तुभ", to: "विष्णु" },
];

export const Toasts5: React.FC<{ f: number; end: number }> = ({ f, end }) => {
  if (f > end + 12 || f < TOASTS[0].at) return null;
  const all = 1 - ramp(f, end - 4, end + 12, "in");
  return (
    <div style={{ position: "absolute", inset: 0, opacity: all }}>
      {TOASTS.map((t, i) => {
        const dt = f - t.at;
        if (dt < 0) return null;
        const pop = track(dt, [[0, 0.6], [6, 1.08, "out"], [10, 1, "io"]]);
        const dock = ramp(dt, 32, 44, "io");
        const x = 540 + (135 + i * 270 - 540) * dock;
        const y = 330 + (256 - 330) * dock;
        const s = pop * (1 - 0.44 * dock);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, whiteSpace: "nowrap", opacity: ramp(dt, 0, 4) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 28px 12px", borderRadius: 44, ...PILL }}>
              <span style={{ fontFamily: ROZHA, fontSize: 56, lineHeight: 1.1, color: "#FFD36B" }}>{t.item}</span>
              <Arrow size={44} />
              <span style={{ fontFamily: ROZHA, fontSize: 56, lineHeight: 1.1, color: "#FFF6E4" }}>{t.to}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Lakshmi's open question, kept up through the choice, then answered  */
/* ------------------------------------------------------------------ */

export const AskAnswer5: React.FC<{ f: number; at: number; answer: number; out: number }> = ({ f, at, answer, out }) => {
  const t = f - at;
  if (t < 0 || f > out + 10) return null;
  const a = ramp(t, 0, 8, "out");
  const o = a * (1 - ramp(f, out - 4, out + 10, "in"));
  const k = ramp(f, answer, answer + 8, "out");
  const pop = track(f - answer, [[0, 1], [6, 1.14, "out"], [11, 1, "io"]]);
  const q = 1 + (1 - k) * 0.06 * Math.sin(f / 4);
  return (
    <div style={{ position: "absolute", left: 0, top: 210, width: 1080, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
      {k > 0 ? <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 32, letterSpacing: 8, color: "#F3DB9D", opacity: k, marginBottom: 14 }}>JAWAB</div> : null}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 30px 12px", borderRadius: 46, ...PILL, border: `${2 + k}px solid rgba(255,201,77,${0.75 + 0.25 * k})`, transform: `scale(${(k > 0 ? pop : 1) * (1 + 0.25 * k)})`, transformOrigin: "50% 0", boxShadow: `0 0 ${18 + 28 * k}px rgba(255,201,77,${0.25 + 0.45 * k})` }}>
        <span style={{ fontFamily: ROZHA, fontSize: 56, lineHeight: 1.1, color: "#FFF6E4" }}>लक्ष्मी</span>
        <Arrow size={44} />
        {k < 0.5 ? (
          <span style={{ fontFamily: ROZHA, fontSize: 64, lineHeight: 1.1, color: "#FFD36B", display: "inline-block", transform: `scale(${q})`, opacity: 1 - 2 * k }}>?</span>
        ) : (
          <span style={{ display: "flex", alignItems: "center", gap: 10, opacity: 2 * k - 1 }}>
            <span style={{ fontFamily: ROZHA, fontSize: 60, lineHeight: 1.1, color: "#FFD36B", textShadow: "0 0 20px rgba(255,201,77,0.6)" }}>श्री विष्णु</span>
            <span style={{ width: 46, height: 46, borderRadius: 23, background: "#2FA35A", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Tick size={30} />
            </span>
          </span>
        )}
      </div>
    </div>
  );
};

/** A soft elimination tag next to a candidate Lakshmi passes ("✗ क्रोध", "✗ मोह"). */
export const XTag: React.FC<{ f: number; at: number; out: number; x: number; y: number; text: string }> = ({ f, at, out, x, y, text }) => {
  const t = f - at;
  if (t < 0 || f > out + 8) return null;
  const pop = track(t, [[0, 0.5], [6, 1.1, "out"], [10, 1, "io"]]);
  const o = ramp(t, 0, 4) * (1 - ramp(f, out - 4, out + 8, "in"));
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${pop})`, opacity: o, whiteSpace: "nowrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 24px 10px 12px", borderRadius: 40, background: "rgba(12,10,7,0.72)", border: "2px solid rgba(232,48,74,0.9)", boxShadow: "0 0 18px rgba(232,48,74,0.45)" }}>
        <span style={{ width: 44, height: 44, borderRadius: 22, background: "#E8304A", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Cross size={28} />
        </span>
        <span style={{ fontFamily: ROZHA, fontSize: 54, lineHeight: 1.1, color: "#FFE4E8" }}>{text}</span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Captions (Episode 1's box and colours; timed from timing.ts)        */
/* ------------------------------------------------------------------ */

type Who = "n" | "b";
type Cap = { from: number; to: number; text: string; who: Who; hi?: string[] };
const WHO: Record<Who, string> = { n: "#FFF6E4", b: "#FFB3A0" };

const split = (key: string, who: Who, parts: [string, string[]][], at: number[] = []): Cap[] => {
  const [a, b] = LINES[key];
  const edges = [a, ...at, b];
  return parts.map(([text, hi], i) => ({ from: edges[i], to: edges[i + 1], text, who, hi }));
};

export const CAPS5: Cap[] = [
  // 01 is carried by the hook poll on screen
  ...split("02_narrator", "n", [["Vish ke baad saagar ne ratna dene shuru kiye.", ["saagar", "ratna"]], ["Kamdhenu, rishiyon ko mili.", ["Kamdhenu,", "rishiyon"]]], [CUES.cap02b]),
  ...split("03_bali", "b", [["Uchchaihshravaa... yeh ashva mera hai!", ["Uchchaihshravaa...", "mera"]]]),
  ...split("04_narrator", "n", [["Airavat Indra ke paas gaya,", ["Airavat", "Indra"]], ["aur Kaustubh mani... Vishnu ke paas.", ["Kaustubh", "Vishnu"]]], [CUES.cap04b]),
  ...split("05_narrator", "n", [["Phir kamal par prakat huin... Lakshmi.", ["kamal", "Lakshmi."]]]),
  ...split("06_narrator", "n", [["Unhone sabko dekha.", ["dekha."]], ["Kisi mein tap tha, par krodh bhi.", ["tap", "krodh"]], ["Kisi mein gyaan tha, par moh bhi.", ["gyaan", "moh"]]], [CUES.cap06b, CUES.cap06c]),
  ...split("07_narrator", "n", [["Aur ek the, jinhe unki chaah hi nahi thi...", ["chaah", "nahi"]], ["Shri Vishnu.", ["Shri", "Vishnu."]]], [CUES.cap07b]),
  ...split("08_narrator", "n", [["Aur Lakshmi ne varmala, Vishnu ke gale mein daal di.", ["varmala,", "Vishnu"]]]),
  // 09 and the sign-off play over the end card, which carries the same words
];

export const Captions5: React.FC<{ f: number; y?: number }> = ({ f, y = 1300 }) => {
  const c = CAPS5.find((k) => f >= k.from && f < k.to);
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

/* ------------------------------------------------------------------ */
/* End card (series layout + the Shukra tie-in + www.jyotiq.ai)        */
/* ------------------------------------------------------------------ */

/** SVG layer: a small kundali whose 7th house (Shukra is its karaka: the spouse; the varmala) lights on "शुक्र". */
export const EndKundali5: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const t = f - at;
  if (t < 0) return null;
  const d = ramp(t, 4, 40, "io");
  const sh = ramp(f, CUES.shukra - 4, CUES.shukra + 10, "out");
  const again = Math.max(0, 1 - Math.abs(f - CUES.shukra2 - 6) / 14);
  const pulse = 0.7 + 0.3 * Math.sin(f / 7) + 0.6 * again;
  const cy = 800 + 62.5;
  return (
    <g>
      <KundaliGrid f={f} cx={540} cy={800} size={250} d={d} glyphs={0} o={0.9} />
      {/* Shukra glyph in the 7th house: the bottom-centre diamond */}
      <g opacity={sh}>
        <circle cx={540} cy={cy} r={30 + 6 * again} fill="#0C0A07" opacity={0.85} />
        <circle cx={540} cy={cy} r={30 + 6 * again} fill="#FFE3F0" opacity={0.25 * pulse} />
        <circle cx={540} cy={cy} r={44 + 8 * again} fill="none" stroke="#FFD6E8" strokeWidth={2} opacity={0.5 * pulse} />
        <text x={540} y={cy + 14} textAnchor="middle" fontFamily={ROZHA} fontSize={40} fill="#FFF4FA" style={{ filter: `drop-shadow(0 0 ${10 * pulse}px #FFC6DE)` }}>
          शु
        </text>
      </g>
    </g>
  );
};

export const EndCard5: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const t = f - at;
  if (t < 0) return null;
  const a = ramp(t, 0, 14, "out");
  const b = ramp(f, CUES.jyotish - 4, CUES.jyotish + 10, "out");
  const q = ramp(f, CUES.kundali - 6, CUES.kundali + 8, "out");
  const cm = ramp(f, CUES.deta + 8, CUES.deta + 20, "out");
  const cmPop = track(f - CUES.deta - 8, [[0, 0.7], [7, 1.06, "out"], [11, 1, "io"]]);
  const c = ramp(f, CUES.signoff - 10, CUES.signoff + 4, "out");
  const d = ramp(f, CUES.offer - 6, CUES.offer + 8, "out");
  const glow = 0.5 + 0.5 * Math.sin(t / 8);
  const nudge = Math.sin(f / 5) * 6;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ marginTop: 250, opacity: a, transform: `translateY(${(1 - a) * 30}px)`, textAlign: "center" }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 34, letterSpacing: 8, color: "#CDB8FF" }}>AGLA EPISODE</div>
        <div style={{ fontFamily: ROZHA, fontSize: 130, lineHeight: 1.05, color: "#FFD36B", textShadow: "0 0 30px rgba(255,201,77,0.5)" }}>अमृत</div>
        <div style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 64, letterSpacing: 18, color: "#F6EBD6" }}>AMRIT</div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 600, fontSize: 34, color: "#F3DB9D", marginTop: 14 }}>Amrit kiske haath lagega?</div>
      </div>
      <div style={{ position: "absolute", top: 960, width: 940, textAlign: "center", opacity: b }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 44, lineHeight: 1.25, color: "#FFF6E4" }}>
          Jyotish mein <span style={{ color: "#FFC94D" }}>Shukra</span> = Sukh aur Samriddhi.
        </div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 36, color: "#FFF6E4", marginTop: 16, opacity: q }}>
          Aapki <span style={{ color: "#FFC94D" }}>kundali</span> ka Shukra aapko kitna <span style={{ color: "#FFC94D" }}>deta</span> hai?
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 18, opacity: cm * (1 - c), transform: `scale(${cmPop})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 26px 12px", borderRadius: 40, ...PILL }}>
            <svg width={40} height={40} viewBox="-12 -12 24 24" style={{ display: "block" }}>
              <path d="M-9 -8H9V5H-1L-6 10V5H-9Z" fill="#FFC94D" />
              <circle cx={-4} cy={-1.5} r={1.4} fill="#0C0A07" />
              <circle cx={0} cy={-1.5} r={1.4} fill="#0C0A07" />
              <circle cx={4} cy={-1.5} r={1.4} fill="#0C0A07" />
            </svg>
            <span style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 34, color: "#FFF6E4" }}>
              Comment karo: aapka <span style={{ color: "#FFC94D" }}>Shukra</span> kis bhaav mein?
            </span>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1240, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, opacity: c, transform: `scale(${0.92 + 0.08 * c})` }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 30, color: "#F3DB9D", marginBottom: -6 }}>Pata nahi? Jyotiq batayega.</div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Img src={staticFile("jyotiq/logo-full.png")} style={{ width: 150, height: 172, objectFit: "contain" }} />
          <div>
            <div style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 64, color: "#FFE7A8", lineHeight: 1 }}>Jyotiq se pucho</div>
            <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 32, color: "#F3DB9D", marginTop: 8 }}>Pehla sawaal free · phir ₹5 per sawaal</div>
            <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 34, color: "#FFC94D", marginTop: 8, letterSpacing: 1 }}>www.jyotiq.ai</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1500, display: "flex", gap: 22, opacity: d, transform: `translateY(${(1 - d) * 24}px) scale(0.66)`, transformOrigin: "50% 0" }}>
        <PlayButton glow={glow} />
        <AppStoreButton glow={glow} />
      </div>
      <div style={{ position: "absolute", top: 1596, display: "flex", alignItems: "center", gap: 10, opacity: d }}>
        <svg width={40} height={40} viewBox="-12 -12 24 24" style={{ display: "block", transform: `translate(${-nudge * 0.6}px, ${nudge}px)` }}>
          <path d="M8 -8L-7 7M-7 -3L-7 7L3 7" stroke="#FFC94D" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <span style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 32, color: "#FFF6E4" }}>
          App ka link <span style={{ color: "#FFC94D" }}>profile (bio)</span> mein
        </span>
      </div>
      <div style={{ position: "absolute", top: 1652, fontFamily: JAKARTA, fontWeight: 600, fontSize: 22, color: "rgba(243,219,157,0.6)", opacity: d }}>
        Guidance only, for entertainment and information.
      </div>
    </div>
  );
};
