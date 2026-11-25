import React from "react";
import { Img, staticFile } from "remotion";
import { AppStoreButton, PlayButton } from "../../katha/reelKit";
import { CINZEL, JAKARTA, KundaliGrid, PLAYFAIR, ROZHA } from "../graphics";
import { P, ramp, track } from "../style";
import { Drop, GOLD_TXT, PILL, Tick } from "../ep6/gfx6";
import { CUES, LINES } from "./timing";

/* Episode 8 graphics in the series' exact style (Episode 5/6 fonts, colours and pill shapes; the
   shared pieces are imported read-only from gfx6). Retention layer for this episode:
   - the hook plate states the paradox from frame 0 (sound-off): "अमृत सिर्फ़ गले तक..." / "तो धड़ कैसे बचा?",
   - a clue ring on the throat in the replay ("यहीं रुका था अमृत"),
   - chips on the split ("अमृत ÷ 2" -> "सिर ✓ धड़ ✓") and the wander ("आँखें ✗ भूख ✗"),
   - labels on the pair (इच्छा / त्याग · मोक्ष) and the JAWAB pill "सिर नहीं = सीधा ज्ञान ✓",
   - (part 2) kundali with के and the end card. */

export { Drop, GOLD_TXT, PILL, Tick };

const Cross: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="-10 -10 20 20" style={{ display: "block" }}>
    <path d="M-6 -6L6 6M6 -6L-6 6" stroke="#FFFFFF" strokeWidth={3.4} strokeLinecap="round" />
  </svg>
);

/* Hook plate: the whole paradox from frame 0, in the middle third */
export const HookPlate8: React.FC<{ f: number; out: number }> = ({ f, out }) => {
  if (f > out + 8) return null;
  const o = 1 - ramp(f, out - 6, out + 8, "in");
  const settle = track(f, [[0, 1.04], [10, 1.0, "out"]]);
  const q = ramp(f, CUES.kaise - 2, CUES.kaise + 6, "out");
  const qPulse = 1 + q * (0.1 + 0.06 * Math.sin(f / 3));
  return (
    <div style={{ position: "absolute", left: 0, top: 650, width: 1080, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
      <div style={{ position: "absolute", left: 60, top: -30, width: 960, height: 330, borderRadius: 165, background: "radial-gradient(ellipse at center, rgba(14,10,32,0.84) 0%, rgba(14,10,32,0.62) 55%, rgba(14,10,32,0) 100%)" }} />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14, fontFamily: ROZHA, fontSize: 76, lineHeight: 1.12, color: "#F6EBD6", transform: `scale(${settle})`, textShadow: "0 0 26px rgba(10,14,40,0.9), 0 5px 0 #0E0A1C" }}>
        <Drop size={56} /> अमृत सिर्फ़ गले तक...
      </div>
      <div style={{ position: "relative", fontFamily: ROZHA, fontSize: 92, lineHeight: 1.14, marginTop: 6, color: "#FFD36B", transform: `scale(${settle * (q > 0 ? qPulse : 1)})`, textShadow: `${GOLD_TXT}, 0 0 18px rgba(14,10,32,0.95), 0 6px 0 #0E0A1C`, whiteSpace: "nowrap" }}>
        तो धड़ कैसे बचा?
      </div>
    </div>
  );
};

/* Title card as a quick overlay on the rewind (Episode 5/6 layout) */
export const TitleCard8: React.FC<{ f: number; at: number; out: number }> = ({ f, at, out }) => {
  const t = f - at;
  if (t < -2 || f > out + 8) return null;
  const a = ramp(t, 0, 6, "out");
  const b = ramp(t, 2, 10, "out");
  const c = ramp(t, 6, 14, "out");
  const o = 1 - ramp(f, out - 4, out + 8, "in");
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `rgba(8,6,20,${0.35 * o})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: a, marginBottom: 26 }}>
        <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: 84, height: 70, objectFit: "contain" }} />
        <div style={{ fontFamily: PLAYFAIR, fontWeight: 600, fontSize: 38, color: P.jGoldLight, letterSpacing: 4 }}>Jyotiq presents</div>
      </div>
      <div style={{ fontFamily: ROZHA, fontSize: 190, lineHeight: 1, color: "#FFD36B", opacity: b, transform: `scale(${0.88 + 0.12 * b})`, textShadow: "0 0 40px rgba(255,201,77,0.55), 0 8px 0 #5A3208" }}>मंथन</div>
      <div style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 88, letterSpacing: 24, color: "#F6EBD6", opacity: b, marginTop: 6 }}>MANTHAN</div>
      <div style={{ width: 520 * c, height: 3, background: `linear-gradient(90deg, transparent, ${P.gold}, transparent)`, margin: "24px 0" }} />
      <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 40, color: P.jGoldLight, opacity: c, letterSpacing: 3 }}>
        EPISODE 8 · <span style={{ fontFamily: ROZHA, fontWeight: 400, fontSize: 48 }}>केतु</span> · KETU
      </div>
    </div>
  );
};

/* A generic pill that pops in at `at` and leaves at `out`; mark adds a green tick / red cross badge */
export const Chip8: React.FC<{
  f: number; at: number; out: number; x?: number; y: number; text: string; color?: string; border?: string; size?: number;
  mark?: "tick" | "cross"; drop?: boolean;
}> = ({ f, at, out, x, y, text, color = "#FFD36B", border = "rgba(223,177,91,0.85)", size = 54, mark, drop }) => {
  const t = f - at;
  if (t < 0 || f > out + 8) return null;
  const o = ramp(t, 0, 5, "out") * (1 - ramp(f, out - 4, out + 8, "in"));
  const pop = track(t, [[0, 0.7], [5, 1.12, "out"], [9, 1, "io"]]);
  const box = (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 28px 12px", borderRadius: 46, ...PILL, border: `3px solid ${border}`, transform: `scale(${pop})`, opacity: o, whiteSpace: "nowrap" }}>
      {drop ? <Drop size={44} /> : null}
      <span style={{ fontFamily: ROZHA, fontSize: size, lineHeight: 1.1, color }}>{text}</span>
      {mark ? (
        <span style={{ width: 44, height: 44, borderRadius: 22, background: mark === "tick" ? "#2FA35A" : "#C8344A", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {mark === "tick" ? <Tick size={28} /> : <Cross size={26} />}
        </span>
      ) : null}
    </div>
  );
  return x === undefined ? (
    <div style={{ position: "absolute", left: 0, width: 1080, top: y, display: "flex", justifyContent: "center" }}>{box}</div>
  ) : (
    <div style={{ position: "absolute", left: x, top: y }}>{box}</div>
  );
};

/* Clue ring on a point of the picture with a label (Episode 6 ClueCircles look) */
export const ClueRing8: React.FC<{ f: number; at: number; out: number; x: number; y: number; r: number; label: string; dx?: number; dy?: number }> = ({
  f, at, out, x, y, r, label, dx, dy,
}) => {
  const t = f - at;
  if (t < 0 || f > out + 8) return null;
  const o = 1 - ramp(f, out - 4, out + 8, "in");
  const k = ramp(t, 0, 6, "out");
  const pop = track(t, [[0, 0.6], [6, 1.1, "out"], [10, 1, "io"]]);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: r, border: "5px solid #FFD36B", boxShadow: "0 0 22px rgba(255,211,107,0.8)", opacity: k, transform: `scale(${pop})` }} />
      <div style={{ position: "absolute", left: x + (dx ?? r + 16), top: y + (dy ?? -30), whiteSpace: "nowrap", opacity: ramp(t, 4, 10, "out"), padding: "6px 20px 8px", borderRadius: 30, ...PILL, fontFamily: ROZHA, fontSize: 46, color: "#FFD36B" }}>
        {label}
      </div>
    </div>
  );
};

/* Name card (series look): big Devanagari name, Latin under it */
export const NameCard8: React.FC<{ f: number; at: number; out: number; name: string; latin: string; y?: number; color?: string }> = ({
  f, at, out, name, latin, y = 260, color = "#CFDBF5",
}) => {
  const t = f - at;
  if (t < 0 || f > out + 8) return null;
  const o = ramp(t, 0, 6, "out") * (1 - ramp(f, out - 4, out + 8, "in"));
  const sweep = ramp(t, 2, 14, "out");
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: y, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
      <div style={{ fontFamily: ROZHA, fontSize: 132, lineHeight: 1, color, transform: `scale(${0.9 + 0.1 * ramp(t, 0, 8, "out")})`, textShadow: "0 0 36px rgba(159,179,217,0.6), 0 7px 0 #141030" }}>{name}</div>
      <div style={{ width: 440 * sweep, height: 3, background: `linear-gradient(90deg, transparent, ${P.gold}, transparent)`, margin: "14px 0 10px" }} />
      <div style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 52, letterSpacing: 18, color: "#F6EBD6", opacity: sweep }}>{latin}</div>
    </div>
  );
};

/* JAWAB pill (Episode 6 AskAnswer payoff look) */
export const Jawab8: React.FC<{ f: number; at: number; out: number; y?: number }> = ({ f, at, out, y = 220 }) => {
  const t = f - at;
  if (t < 0 || f > out + 10) return null;
  const o = ramp(t, 0, 6, "out") * (1 - ramp(f, out - 4, out + 10, "in"));
  const pop = track(t, [[0, 0.7], [6, 1.14, "out"], [11, 1, "io"]]);
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: 1080, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
      <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 32, letterSpacing: 8, color: "#F3DB9D", marginBottom: 14 }}>JAWAB</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 32px 14px", borderRadius: 50, ...PILL, border: "3px solid rgba(255,201,77,1)", transform: `scale(${pop})`, boxShadow: "0 0 46px rgba(255,201,77,0.7)", whiteSpace: "nowrap" }}>
        <span style={{ fontFamily: ROZHA, fontSize: 58, color: "#FFF6E4" }}>सिर नहीं</span>
        <span style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 52, color: "#F3DB9D" }}>=</span>
        <span style={{ fontFamily: ROZHA, fontSize: 60, color: "#FFD36B", textShadow: "0 0 20px rgba(255,201,77,0.6)" }}>सीधा ज्ञान</span>
        <span style={{ width: 46, height: 46, borderRadius: 23, background: "#2FA35A", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Tick size={30} />
        </span>
      </div>
    </div>
  );
};

/* Captions (Episode 5/6 box and colours; timed from timing.ts) */
type Who = "n" | "r" | "k";
type Cap = { from: number; to: number; text: string; who: Who; hi?: string[] };
const WHO: Record<Who, string> = { n: "#FFF6E4", r: "#FFB3A0", k: "#CFDBF5" };

const split = (key: string, who: Who, parts: [string, string[]][], at: number[] = []): Cap[] => {
  const [a, b] = LINES[key];
  const edges = [a, ...at, b];
  return parts.map(([text, hi], i) => ({ from: edges[i], to: edges[i + 1], text, who, hi }));
};

export const CAPS8: Cap[] = [
  // 01 is carried by the hook plate on screen
  ...split("02_narrator", "n", [["Chakra theek gale par chala...", ["Chakra", "gale"]], ["jahan amrit ruka tha.", ["amrit", "ruka"]]], [CUES.cap02b]),
  ...split("03_narrator", "n", [["Boond do hisson mein bant gayi...", ["Boond", "hisson"]], ["sir bhi amar, dhad bhi.", ["amar,", "dhad"]]], [CUES.cap03b]),
  ...split("04_narrator", "n", [["Dhad andhere mein bhatakta raha...", ["andhere", "bhatakta"]], ["na aankhen, na bhookh.", ["aankhen,", "bhookh."]]], [CUES.cap04b]),
  ...split("05_rahu", "r", [["Mujhe sab chahiye!", ["sab"]], ["Surya, Chandra... sab kuch!", ["Surya,", "Chandra..."]]], [CUES.cap05b]),
  ...split("06_ketu", "k", [["Aur mujhe... kuch nahi chahiye.", ["kuch", "nahi"]]]),
  ...split("07_narrator", "n", [["Tab Brahma ne use navgrahon mein jagah di...", ["Brahma", "navgrahon"]], ["naam mila, Ketu.", ["Ketu."]]], [CUES.cap07b]),
  ...split("08_narrator", "n", [["Rahu bana ichchha ka graha...", ["Rahu", "ichchha"]], ["aur Ketu, tyaag aur moksh ka.", ["Ketu,", "tyaag", "moksh"]]], [CUES.cap08b]),
  ...split("09_narrator", "n", [["Isiliye Ketu ko sir ki zaroorat nahi...", ["Ketu", "sir"]], ["woh sochta nahi, seedhe jaanta hai.", ["sochta", "jaanta"]]], [CUES.cap09b]),
  // 10 and the sign-off play over the end card, which carries the same words
];

export const Captions8: React.FC<{ f: number; y?: number }> = ({ f, y = 1300 }) => {
  const c = CAPS8.find((k) => f >= k.from && f < k.to);
  if (!c) return null;
  const t = f - c.from;
  const pop = track(t, [[0, 0.9], [5, 1.03, "out"], [9, 1, "io"]]);
  const o = ramp(t, 0, 4) * (1 - ramp(f, c.to - 4, c.to, "in"));
  const words = c.text.split(" ");
  return (
    <div style={{ position: "absolute", left: 80, width: 840, top: y, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ transform: `scale(${pop})`, padding: "16px 30px 18px", borderRadius: 22, background: "rgba(12,10,7,0.62)", border: "1.5px solid rgba(223,177,91,0.55)", textAlign: "center", fontFamily: JAKARTA, fontWeight: 800, fontSize: 52, lineHeight: 1.18, color: WHO[c.who], textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>
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

/* End: kundali where के hops house to house, settles and lights one house, then every house asks ? */
const HOUSE = (h: number): [number, number][] => [
  [0, -h / 2], [-h / 2, (-h * 5) / 6], [(-h * 5) / 6, -h / 2], [-h / 2, 0], [(-h * 5) / 6, h / 2], [-h / 2, (h * 5) / 6],
  [0, h / 2], [h / 2, (h * 5) / 6], [(h * 5) / 6, h / 2], [h / 2, 0], [(h * 5) / 6, -h / 2], [h / 2, (-h * 5) / 6],
];

export const EndKundali8: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const t = f - at;
  if (t < 0) return null;
  const d = ramp(t, 4, 40, "io");
  const cx = 540;
  const cy = 800;
  const hs = HOUSE(125);
  const hopFrom = CUES.bhaav - 12;
  const land = CUES.mann - 2; // on 'मन' Ketu settles in one house (house 7 shown) and that house dims, detached
  const settle = CUES.kahan + 4;
  const k = f < land ? Math.floor(Math.max(0, f - hopFrom) / 4) % 12 : 6;
  const show = f >= hopFrom && f < settle;
  const lit = ramp(f, land, land + 10, "out") * (1 - ramp(f, settle - 6, settle, "in"));
  const ask = ramp(f, settle, settle + 12, "out");
  return (
    <g>
      <KundaliGrid f={f} cx={cx} cy={cy} size={250} d={d} glyphs={0} o={0.9} />
      {lit > 0 ? <circle cx={cx + hs[6][0]} cy={cy + hs[6][1]} r={70} fill="#9FB3D9" opacity={0.28 * lit} filter="url(#mBlur8)" /> : null}
      {show ? (
        <g transform={`translate(${cx + hs[k][0]} ${cy + hs[k][1]})`}>
          <circle r={28} fill="#0C0A07" opacity={0.85} />
          <circle r={36} fill="none" stroke="#9FB3D9" strokeWidth={2} opacity={0.7} />
          <text y={13} textAnchor="middle" fontFamily={ROZHA} fontSize={38} fill="#EAF1FF" style={{ filter: "drop-shadow(0 0 8px #9FB3D9)" }}>
            के
          </text>
        </g>
      ) : null}
      {ask > 0
        ? hs.map(([x, y], i) => (
            <text key={i} x={cx + x} y={cy + y + 12} textAnchor="middle" fontFamily={ROZHA} fontSize={34} fill="#FFD36B" opacity={ask * (0.6 + 0.4 * Math.sin(f / 5 + i))}>
              ?
            </text>
          ))
        : null}
    </g>
  );
};

/* End card (series layout + the Ketu tie-in + www.jyotiq.ai) */
export const EndCard8: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const t = f - at;
  if (t < 0) return null;
  const a = ramp(t, 0, 14, "out");
  const b = ramp(t, 6, 18, "out");
  const q = ramp(f, CUES.aapka - 6, CUES.aapka + 8, "out");
  const cm = ramp(f, CUES.kahan - 4, CUES.kahan + 8, "out");
  const cmPop = track(f - CUES.kahan + 4, [[0, 0.7], [7, 1.06, "out"], [11, 1, "io"]]);
  const c = ramp(f, CUES.signoff - 10, CUES.signoff + 4, "out");
  const d = ramp(f, CUES.offer - 6, CUES.offer + 8, "out");
  const glow = 0.5 + 0.5 * Math.sin(t / 8);
  const nudge = Math.sin(f / 5) * 6;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ marginTop: 250, opacity: a, transform: `translateY(${(1 - a) * 30}px)`, textAlign: "center" }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 34, letterSpacing: 8, color: "#CDB8FF" }}>AGLA EPISODE</div>
        <div style={{ fontFamily: ROZHA, fontSize: 124, lineHeight: 1.05, color: "#FFD36B", textShadow: "0 0 30px rgba(255,201,77,0.5)" }}>शुक्राचार्य</div>
        <div style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 56, letterSpacing: 14, color: "#F6EBD6" }}>SHUKRACHARYA</div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 600, fontSize: 34, color: "#F3DB9D", marginTop: 14 }}>Mare hue ko zinda karne wala mantra</div>
      </div>
      <div style={{ position: "absolute", top: 960, width: 940, textAlign: "center", opacity: b }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 44, lineHeight: 1.25, color: "#FFF6E4" }}>
          Jyotish mein <span style={{ color: "#CFDBF5" }}>Ketu</span> = Tyaag, moksh aur antar-gyaan.
        </div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 36, color: "#FFF6E4", marginTop: 16, opacity: q }}>
          Aapki <span style={{ color: "#FFC94D" }}>kundali</span> mein Ketu <span style={{ color: "#FFC94D" }}>kahan</span> hai?
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 18, opacity: cm, transform: `scale(${cmPop})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 26px 12px", borderRadius: 40, ...PILL }}>
            <svg width={40} height={40} viewBox="-12 -12 24 24" style={{ display: "block" }}>
              <path d="M-9 -8H9V5H-1L-6 10V5H-9Z" fill="#FFC94D" />
              <circle cx={-4} cy={-1.5} r={1.4} fill="#0C0A07" />
              <circle cx={0} cy={-1.5} r={1.4} fill="#0C0A07" />
              <circle cx={4} cy={-1.5} r={1.4} fill="#0C0A07" />
            </svg>
            <span style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 34, color: "#FFF6E4" }}>
              Comment karo: aapka <span style={{ color: "#CFDBF5" }}>Ketu</span> kis bhaav mein?
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
