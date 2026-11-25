import React from "react";
import { Img, staticFile } from "remotion";
import { AppStoreButton, PlayButton } from "../../katha/reelKit";
import { CINZEL, JAKARTA, KundaliGrid, PLAYFAIR, ROZHA } from "../graphics";
import { P, ramp, track } from "../style";
import { CUES, LINES } from "./timing";

/* Episode 4 graphics in the series' exact style (Episode 1-3 fonts, colours, card shapes):
   the sound-off hook question, the Episode 4 title, the on-screen answer to the hook, Hinglish
   captions with gold keywords, and the Episode 4 end card (Chandra tie-in + www.jyotiq.ai).
   NameCard and BrandBug come from ../graphics unchanged. */

/* ------------------------------------------------------------------ */
/* Hook question (from frame 0, middle third, readable with the sound off) */
/* ------------------------------------------------------------------ */

export const HookText4: React.FC<{ f: number; out: number }> = ({ f, out }) => {
  if (f > out + 8) return null;
  const o = 1 - ramp(f, out - 6, out + 8, "in");
  const settle = track(f, [[0, 1.04], [10, 1.0, "out"]]);
  const b = ramp(f, 8, 16, "out");
  const pop = track(f, [[8, 0.8], [16, 1.06, "out"], [22, 1, "io"]]);
  return (
    <div style={{ position: "absolute", left: 0, top: 690, width: 1080, textAlign: "center", opacity: o }}>
      <div style={{ fontFamily: ROZHA, fontSize: 92, lineHeight: 1.1, color: "#F6EBD6", transform: `scale(${settle})`, textShadow: "0 0 26px rgba(10,14,40,0.9), 0 5px 0 #0E0A1C" }}>
        विष पीने से पहले
      </div>
      <div style={{ fontFamily: ROZHA, fontSize: 108, lineHeight: 1.15, marginTop: 10, color: "#FFD36B", opacity: b, transform: `scale(${pop})`, textShadow: "0 0 34px rgba(255,201,77,0.6), 0 6px 0 #4A2A08" }}>
        शिव ने किससे पूछा?
      </div>
    </div>
  );
};

/** The answer to the hook, stamped in gold as Parvati says yes. */
export const HookAnswer: React.FC<{ f: number; at: number; out: number; top?: number }> = ({ f, at, out, top = 250 }) => {
  const t = f - at;
  if (t < -2 || f > out + 8) return null;
  const a = ramp(t, 0, 8, "out");
  const pop = track(t, [[0, 0.7], [7, 1.08, "out"], [13, 1, "io"]]);
  const o = a * (1 - ramp(f, out - 6, out + 8, "in"));
  return (
    <div style={{ position: "absolute", left: 0, top, width: 1080, textAlign: "center", opacity: o }}>
      <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 34, letterSpacing: 8, color: "#F3DB9D" }}>JAWAB</div>
      <div style={{ fontFamily: ROZHA, fontSize: 104, lineHeight: 1.1, color: "#FFD36B", transform: `scale(${pop})`, textShadow: "0 0 34px rgba(255,201,77,0.6), 0 6px 0 #4A2A08" }}>
        माता पार्वती से
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Title card (Episode 1's layout, Episode 4's name)                   */
/* ------------------------------------------------------------------ */

export const TitleCard4: React.FC<{ f: number; at: number; out: number }> = ({ f, at, out }) => {
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
        EPISODE 4 · <span style={{ fontFamily: ROZHA, fontWeight: 400, fontSize: 48 }}>नीलकंठ</span> · NEELKANTH
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Captions (Episode 1's box and colours; timed from timing.ts)        */
/* ------------------------------------------------------------------ */

type Who = "n" | "i" | "b" | "m" | "c";
type Cap = { from: number; to: number; text: string; who: Who; hi?: string[] };
const WHO: Record<Who, string> = { n: "#FFF6E4", i: "#BFE0FF", b: "#FFB3A0", m: "#D4EAFF", c: "#FFE08A" };

const split = (key: string, who: Who, parts: [string, string[]][], at: number[] = []): Cap[] => {
  const [a, b] = LINES[key];
  const edges = [a, ...at, b];
  return parts.map(([text, hi], i) => ({ from: edges[i], to: edges[i + 1], text, who, hi }));
};

export const CAPS4: Cap[] = [
  // 01 is carried by the hook question on screen
  ...split("02_narrator", "n", [["Vish phailne laga.", ["Vish"]], ["Devta aur asur, dono bhaage... Kailash ki or.", ["Devta", "asur,", "Kailash"]]], [CUES.cap02b]),
  ...split("03_indra", "i", [["Mahadev! Raksha kijiye!", ["Mahadev!", "Raksha"]]]),
  ...split("04_shiva", "m", [["Bhavani...", ["Bhavani..."]], ["Deenon ki raksha hi toh Prabhu ka dharm hai.", ["raksha", "dharm"]]], [CUES.cap04b]),
  ...split("05_narrator", "n", [["Parvati unki shakti jaanti thin.", ["Parvati", "shakti"]], ["Unhone haan keh di.", ["haan"]]], [CUES.cap05b]),
  ...split("06_narrator", "n", [["Mahadev ne Halahal hatheli mein uthaya...", ["Halahal", "hatheli"]], ["...aur pee gaye.", ["pee"]]], [CUES.cap06b]),
  ...split("07_narrator", "n", [["Vish kanth mein hi thahar gaya...", ["kanth", "thahar"]], ["...aur Mahadev kehlaye, Neelkanth.", ["Neelkanth."]]], [CUES.cap07b]),
  ...split("08_narrator", "n", [["Jo boondein chhalkin...", ["boondein"]], ["...woh saanpon aur bichhuon mein sama gayin.", ["saanpon", "bichhuon"]]], [CUES.cap08b]),
  ...split("09_indra", "c", [["Har Har Mahadev!", ["Har", "Mahadev!"]]]),
  // 10 and the sign-off play over the end card, which carries the same words
];

export const Captions4: React.FC<{ f: number; y?: number }> = ({ f, y = 1300 }) => {
  const c = CAPS4.find((k) => f >= k.from && f < k.to);
  if (!c) return null;
  const t = f - c.from;
  const pop = track(t, [[0, 0.9], [5, 1.03, "out"], [9, 1, "io"]]);
  const o = ramp(t, 0, 4) * (1 - ramp(f, c.to - 4, c.to, "in"));
  const words = c.text.split(" ");
  const big = c.who === "c";
  return (
    <div style={{ position: "absolute", left: 80, width: 840, top: y, display: "flex", justifyContent: "center", opacity: o }}>
      <div
        style={{
          transform: `scale(${pop * (big ? 1.25 : 1)})`,
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
/* End card (series layout + the Chandra tie-in + www.jyotiq.ai)       */
/* ------------------------------------------------------------------ */

/** SVG layer: a small kundali whose 4th house (Chandra is its karaka: mann, sukh) lights on "चंद्रमा". */
export const EndKundali4: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const t = f - at;
  if (t < 0) return null;
  const d = ramp(t, 4, 40, "io");
  const ch = ramp(f, CUES.chandra - 4, CUES.chandra + 10, "out");
  const again = Math.max(0, 1 - Math.abs(f - CUES.chandra2 - 6) / 14);
  const pulse = 0.7 + 0.3 * Math.sin(f / 7) + 0.6 * again;
  const cx = 540 - 62.5;
  return (
    <g>
      <KundaliGrid f={f} cx={540} cy={800} size={250} d={d} glyphs={0} o={0.9} />
      {/* Chandra glyph in the 4th house: the left-centre diamond */}
      <g opacity={ch}>
        <circle cx={cx} cy={800} r={30 + 6 * again} fill="#0C0A07" opacity={0.85} />
        <circle cx={cx} cy={800} r={30 + 6 * again} fill="#EAF2FF" opacity={0.22 * pulse} />
        <path d={`M${cx + 18} 768A26 26 0 1 0 ${cx + 18} 832A20 20 0 1 1 ${cx + 18} 768Z`} fill="#FFF1C8" opacity={0.25} />
        <text x={cx} y={814} textAnchor="middle" fontFamily={ROZHA} fontSize={40} fill="#F3F7FF" style={{ filter: `drop-shadow(0 0 ${10 * pulse}px #CFE7FF)` }}>
          च
        </text>
      </g>
    </g>
  );
};

export const EndCard4: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const t = f - at;
  if (t < 0) return null;
  const a = ramp(t, 0, 14, "out");
  const b = ramp(t, 14, 28, "out");
  const q = ramp(f, CUES.kundali - 6, CUES.kundali + 8, "out");
  const c = ramp(f, CUES.signoff - 10, CUES.signoff + 4, "out");
  const d = ramp(f, CUES.offer - 6, CUES.offer + 8, "out");
  const glow = 0.5 + 0.5 * Math.sin(t / 8);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ marginTop: 250, opacity: a, transform: `translateY(${(1 - a) * 30}px)`, textAlign: "center" }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 34, letterSpacing: 8, color: "#CDB8FF" }}>AGLA EPISODE</div>
        <div style={{ fontFamily: ROZHA, fontSize: 130, lineHeight: 1.05, color: "#FFD36B", textShadow: "0 0 30px rgba(255,201,77,0.5)" }}>लक्ष्मी</div>
        <div style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 64, letterSpacing: 18, color: "#F6EBD6" }}>LAKSHMI</div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 600, fontSize: 34, color: "#F3DB9D", marginTop: 14 }}>Lakshmi kise chunegi?</div>
      </div>
      <div style={{ position: "absolute", top: 980, width: 900, textAlign: "center", opacity: b }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 44, lineHeight: 1.25, color: "#FFF6E4" }}>
          Jyotish mein <span style={{ color: "#FFC94D" }}>Chandra</span> = Mann.
        </div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 600, fontSize: 34, color: "#F3DB9D", marginTop: 10 }}>Mahadev use sir par dhaaran karte hain.</div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 36, color: "#FFF6E4", marginTop: 18, opacity: q }}>
          Aapki <span style={{ color: "#FFC94D" }}>kundali</span> ka Chandra aapko kitna <span style={{ color: "#FFC94D" }}>shaant</span> rakhta hai?
        </div>
      </div>
      <div style={{ position: "absolute", top: 1250, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, opacity: c, transform: `scale(${0.92 + 0.08 * c})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Img src={staticFile("jyotiq/logo-full.png")} style={{ width: 150, height: 172, objectFit: "contain" }} />
          <div>
            <div style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 64, color: "#FFE7A8", lineHeight: 1 }}>Jyotiq se pucho</div>
            <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 32, color: "#F3DB9D", marginTop: 8 }}>Pehla sawaal free · phir ₹5 per sawaal</div>
            <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 34, color: "#FFC94D", marginTop: 8, letterSpacing: 1 }}>www.jyotiq.ai</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1490, display: "flex", gap: 22, opacity: d, transform: `translateY(${(1 - d) * 24}px) scale(0.66)`, transformOrigin: "50% 0" }}>
        <PlayButton glow={glow} />
        <AppStoreButton glow={glow} />
      </div>
      <div style={{ position: "absolute", top: 1665, fontFamily: JAKARTA, fontWeight: 600, fontSize: 22, color: "rgba(243,219,157,0.6)", opacity: d }}>
        Guidance only, for entertainment and information.
      </div>
    </div>
  );
};
