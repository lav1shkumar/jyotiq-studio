import React from "react";
import { Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { AppStoreButton, PlayButton } from "../../katha/reelKit";
import { CINZEL, JAKARTA, KundaliGrid, PLAYFAIR, ROZHA } from "../../manthan/graphics";
import { P, ramp, track } from "../../manthan/style";
import { CUES, LINES } from "./timing";

/* Diwali Day 1 graphics, in the Manthan series' exact style (Episode 5-7 fonts, colours and pill shapes; the small
   primitives are copied from ep7/gfx7.tsx so Day 1 does not depend on Manthan files).
   Retention layer:
   - the hook plate states the hook from frame 0 (sound-off) with a poll सोना / चाँदी / ?; सोना and चाँदी are struck
     on 'वो सोना नहीं था' and the '?' pulses, answered by Dhanvantari's name card in 03,
   - Dhanvantari's words build in gold, word by word, with his voice (05),
   - 'पहले सेहत → फिर धन' over the diya row as diya 1 lights (06),
   - the kundali's सू lights on 'सूर्य' and asks 'बल = ?' (07); the phone shows the real app (08),
   - the end card teases tomorrow's diya (Yamraj) and asks for a comment. */

const cue = (k: string, dflt = 99999): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);

export const GOLD_TXT = "0 0 34px rgba(255,201,77,0.6), 0 6px 0 #4A2A08";
export const PILL: React.CSSProperties = {
  background: "rgba(12,10,7,0.7)",
  border: "2px solid rgba(223,177,91,0.8)",
  boxShadow: "0 6px 24px rgba(0,0,0,0.45)",
};

const CoinIcon: React.FC<{ size: number; silver?: boolean }> = ({ size, silver }) => (
  <svg width={size} height={size} viewBox="-12 -12 24 24" style={{ display: "block" }}>
    <circle r={10} fill={silver ? "#D6DCE4" : "#F2C25A"} stroke={silver ? "#7E8794" : "#8A5A12"} strokeWidth={1.6} />
    <circle r={6.5} fill="none" stroke={silver ? "#9AA3AE" : "#B07A22"} strokeWidth={1.2} />
    <path d="M-6 -4C-3 -8 3 -8 6 -4" stroke="#FFFFFF" strokeWidth={1.4} fill="none" opacity={0.7} />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Hook plate: the question from frame 0, in the middle third          */
/* ------------------------------------------------------------------ */

const PollChip: React.FC<{ label: string; silver?: boolean; strike: number }> = ({ label, silver, strike }) => (
  <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, padding: "10px 28px 12px", borderRadius: 50, ...PILL, opacity: 1 - 0.45 * strike }}>
    <CoinIcon size={46} silver={silver} />
    <span style={{ fontFamily: ROZHA, fontSize: 56, color: "#FFF6E4" }}>{label}</span>
    <div style={{ position: "absolute", left: 14, top: "52%", width: `calc(${strike * 100}% - 28px)`, height: 7, borderRadius: 4, background: "#FF3B53", boxShadow: "0 0 12px rgba(255,59,83,0.8)", transform: "rotate(-6deg)" }} />
  </div>
);

export const HookPlateD1: React.FC<{ f: number; out: number }> = ({ f, out }) => {
  if (f > out) return null;
  const o = 1 - ramp(f, out - 8, out, "in");
  const settle = track(f, [[0, 1.04], [10, 1.0, "out"]]);
  const S = cue("strike", 176);
  const s1 = ramp(f, S, S + 7, "out");
  const s2 = ramp(f, S + 5, S + 12, "out");
  const q = ramp(f, S + 6, S + 14, "out");
  const qPop = track(f - S - 6, [[0, 1], [6, 1.22, "out"], [10, 1.1, "io"]]);
  const qPulse = (q > 0 ? qPop : 1) * (1 + q * 0.05 * Math.sin(f / 3));
  return (
    <div style={{ position: "absolute", left: 0, top: 640, width: 1080, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
      <div style={{ position: "absolute", left: 40, top: -40, width: 1000, height: 400, borderRadius: 200, background: "radial-gradient(ellipse at center, rgba(22,8,6,0.86) 0%, rgba(22,8,6,0.62) 55%, rgba(22,8,6,0) 100%)" }} />
      <div style={{ position: "relative", fontFamily: ROZHA, fontSize: 78, lineHeight: 1.12, color: "#F6EBD6", transform: `scale(${settle})`, textShadow: "0 0 26px rgba(20,8,4,0.9), 0 5px 0 #1A0A06" }}>
        धनतेरस पे सागर से
      </div>
      <div style={{ position: "relative", fontFamily: ROZHA, fontSize: 92, lineHeight: 1.14, marginTop: 4, color: "#FFD36B", transform: `scale(${settle})`, textShadow: `${GOLD_TXT}, 0 0 18px rgba(20,8,4,0.95), 0 6px 0 #1A0A06`, whiteSpace: "nowrap" }}>
        सोना नहीं निकला था...
      </div>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 22, marginTop: 34, height: 110 }}>
        <PollChip label="सोना" strike={s1} />
        <PollChip label="चाँदी" silver strike={s2} />
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", width: 112, height: 88, borderRadius: 50, ...PILL,
            border: `${3 + q}px solid rgba(255,201,77,${0.7 + 0.3 * q})`,
            boxShadow: `0 0 ${12 + 30 * q}px rgba(255,201,77,${0.25 + 0.5 * q})`,
            transform: `scale(${qPulse})`,
          }}
        >
          <span style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 62, color: "#FFD36B" }}>?</span>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Title: पाँच दीये · दिन 1 · धनतेरस, over the Manthan sea              */
/* ------------------------------------------------------------------ */

export const TitleCardD1: React.FC<{ f: number; at: number; out: number }> = ({ f, at, out }) => {
  const t = f - at;
  if (t < -2 || f > out + 10) return null;
  const a = ramp(t, 0, 6, "out");
  const b = ramp(t, 2, 10, "out");
  const c = ramp(t, 6, 14, "out");
  const o = 1 - ramp(f, out - 6, out + 10, "in");
  return (
    <div style={{ position: "absolute", left: 0, top: 300, width: 1080, opacity: o, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "absolute", left: 20, top: -70, width: 1040, height: 640, borderRadius: 320, background: "radial-gradient(ellipse at center, rgba(14,10,32,0.88) 0%, rgba(14,10,32,0.66) 55%, rgba(14,10,32,0) 100%)" }} />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, opacity: a, marginBottom: 20 }}>
        <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: 84, height: 70, objectFit: "contain" }} />
        <div style={{ fontFamily: PLAYFAIR, fontWeight: 600, fontSize: 38, color: P.jGoldLight, letterSpacing: 4 }}>Jyotiq presents</div>
      </div>
      <div style={{ position: "relative", fontFamily: ROZHA, fontSize: 176, lineHeight: 1, color: "#FFD36B", opacity: b, transform: `scale(${0.88 + 0.12 * b})`, textShadow: "0 0 40px rgba(255,201,77,0.55), 0 8px 0 #5A3208" }}>पाँच दीये</div>
      <div style={{ position: "relative", fontFamily: CINZEL, fontWeight: 900, fontSize: 60, letterSpacing: 16, color: "#F6EBD6", opacity: b, marginTop: 8 }}>PAANCH DIYE</div>
      <div style={{ position: "relative", width: 520 * c, height: 3, background: `linear-gradient(90deg, transparent, ${P.gold}, transparent)`, margin: "22px 0" }} />
      <div style={{ position: "relative", fontFamily: JAKARTA, fontWeight: 700, fontSize: 40, color: P.jGoldLight, opacity: c, letterSpacing: 3 }}>
        DIN 1 · <span style={{ fontFamily: ROZHA, fontWeight: 400, fontSize: 50 }}>धनतेरस</span> · DHANTERAS
      </div>
      <div style={{ position: "relative", fontFamily: JAKARTA, fontWeight: 600, fontSize: 34, color: "#F3DB9D", opacity: c, marginTop: 12 }}>Diwali ke 5 din, 5 raaz</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Name card and chips                                                 */
/* ------------------------------------------------------------------ */

export const NameCardD1: React.FC<{ f: number; at: number; out: number; name: string; sub: string; top: number; color?: string }> = ({
  f, at, out, name, sub, top, color = "#FFD36B",
}) => {
  const t = f - at;
  if (t < 0 || f > out + 8) return null;
  const o = ramp(t, 0, 6, "out") * (1 - ramp(f, out - 4, out + 8, "in"));
  const pop = track(t, [[0, 0.8], [6, 1.08, "out"], [10, 1, "io"]]);
  const line = ramp(t, 4, 14, "out");
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top, display: "flex", flexDirection: "column", alignItems: "center", opacity: o, transform: `scale(${pop})` }}>
      <div style={{ fontFamily: ROZHA, fontSize: 112, lineHeight: 1.05, color, textShadow: `${GOLD_TXT}, 0 0 22px rgba(14,10,32,0.95)` }}>{name}</div>
      <div style={{ width: 400 * line, height: 3, background: `linear-gradient(90deg, transparent, ${P.gold}, transparent)`, margin: "10px 0 12px" }} />
      <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 32, letterSpacing: 7, color: "#F3DB9D", textShadow: "0 3px 10px rgba(0,0,0,0.7)" }}>{sub}</div>
    </div>
  );
};

/** A centred pill chip that pops in at `at` and fades by `out`. */
export const ChipD1: React.FC<{ f: number; at: number; out: number; top: number; children: React.ReactNode; border?: string }> = ({
  f, at, out, top, children, border = "rgba(255,211,107,0.9)",
}) => {
  const t = f - at;
  if (t < 0 || f > out + 8) return null;
  const o = ramp(t, 0, 6, "out") * (1 - ramp(f, out - 4, out + 8, "in"));
  const pop = track(t, [[0, 0.7], [6, 1.1, "out"], [10, 1, "io"]]);
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 28px 11px", borderRadius: 40, ...PILL, border: `2.5px solid ${border}`, boxShadow: "0 0 24px rgba(255,211,107,0.4)", transform: `scale(${pop})` }}>
        {children}
      </div>
    </div>
  );
};

export const ChipText: React.FC<{ children: React.ReactNode; gold?: boolean; size?: number }> = ({ children, gold, size = 46 }) => (
  <span style={{ fontFamily: ROZHA, fontSize: size, lineHeight: 1.1, color: gold ? "#FFD36B" : "#FFF6E4" }}>{children}</span>
);

/* ------------------------------------------------------------------ */
/* 05: Dhanvantari's words build in gold with his voice                */
/* ------------------------------------------------------------------ */

export const GoldWordsD1: React.FC<{ f: number; out: number; top?: number }> = ({ f, out, top = 1270 }) => {
  const w = [
    ["पहला", cue("pehla", 931)],
    ["सुख,", cue("sukh", 946)],
    ["निरोगी", cue("nirogi", 965)],
    ["काया", cue("kaya", 993)],
  ] as const;
  if (f < w[0][1] - 2 || f > out + 8) return null;
  const o = 1 - ramp(f, out - 4, out + 8, "in");
  const B = cue("cap05b", 1011);
  const b = ramp(f, B - 2, B + 8, "out");
  const glow = ramp(f, w[3][1], w[3][1] + 10, "out");
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
      <div style={{ position: "absolute", left: 60, top: -30, width: 960, height: 330, borderRadius: 165, background: "radial-gradient(ellipse at center, rgba(14,10,32,0.7) 0%, rgba(14,10,32,0.4) 55%, rgba(14,10,32,0) 100%)" }} />
      <div style={{ position: "relative", display: "flex", gap: 22, alignItems: "baseline" }}>
        {w.map(([word, at], i) => {
          const k = ramp(f, at - 2, at + 5, "out");
          const pop = track(f - at + 2, [[0, 0.6], [6, 1.12, "out"], [10, 1, "io"]]);
          return (
            <span key={i} style={{ fontFamily: ROZHA, fontSize: 104, lineHeight: 1.1, color: i < 2 ? "#FFF6E4" : "#FFD36B", opacity: k, display: "inline-block", transform: `scale(${k > 0 ? pop : 0.6})`, textShadow: i < 2 ? "0 0 22px rgba(14,10,32,0.95), 0 5px 0 #0E0A1C" : `0 0 ${30 + 30 * glow}px rgba(255,201,77,${0.55 + 0.35 * glow}), 0 6px 0 #4A2A08` }}>
              {word}
            </span>
          );
        })}
      </div>
      <div style={{ position: "relative", fontFamily: ROZHA, fontSize: 58, lineHeight: 1.15, marginTop: 10, color: "#F3DB9D", opacity: b, transform: `translateY(${(1 - b) * 16}px)`, textShadow: "0 0 18px rgba(14,10,32,0.95)" }}>
        बाक़ी हर धन, उसके बाद।
      </div>
    </div>
  );
};

/** 06 close: 'पहले सेहत → फिर धन' over the diya row while diya 1 lights. */
export const SehatDhanD1: React.FC<{ f: number; at: number; out: number; top?: number }> = ({ f, at, out, top = 560 }) => {
  const t = f - at;
  if (t < -2 || f > out + 8) return null;
  const a = ramp(t, 0, 7, "out");
  const b = ramp(t, 6, 14, "out");
  const o = 1 - ramp(f, out - 4, out + 8, "in");
  const pop = track(t, [[0, 0.8], [7, 1.08, "out"], [11, 1, "io"]]);
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 26, opacity: o, transform: `scale(${pop})` }}>
      <span style={{ fontFamily: ROZHA, fontSize: 92, color: "#FFD36B", opacity: a, textShadow: GOLD_TXT }}>पहले सेहत</span>
      <svg width={90} height={50} viewBox="0 0 90 50" style={{ opacity: b, display: "block" }}>
        <path d={`M4 25L${4 + 70 * b} 25`} stroke="#FFC94D" strokeWidth={7} strokeLinecap="round" />
        <path d="M62 10L82 25L62 40" stroke="#FFC94D" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={b} />
      </svg>
      <span style={{ fontFamily: ROZHA, fontSize: 92, color: "#F6EBD6", opacity: b, textShadow: "0 0 22px rgba(14,10,32,0.95), 0 5px 0 #0E0A1C" }}>फिर धन</span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Captions (Episode 5-7 box and colours; Hinglish as in the series)   */
/* ------------------------------------------------------------------ */

type Cap = { from: number; to: number; text: string; hi?: string[] };

const split = (key: string, parts: [string, string[]][], at: number[] = []): Cap[] => {
  const r = LINES[key];
  if (!r) return [];
  const edges = [r[0], ...at, r[1]];
  return parts.map(([text, hi], i) => ({ from: edges[i], to: edges[i + 1], text, hi }));
};

export const CAPS_D1: Cap[] = [
  // 01 is carried by the hook plate, 05 by the gold words, 08 and the sign-off by the phone and the end card
  ...split("02_narrator", [["Diwali ke paanch din, ek kram mein aate hain.", ["paanch", "kram"]], ["Aur Lakshmi Puja se pehle... Dhanteras. Kyon?", ["Lakshmi", "Dhanteras.", "Kyon?"]]], [cue("cap02b")]),
  ...split("03_narrator", [["Kyonki isi din, Manthan ke saagar se", ["Manthan", "saagar"]], ["prakat hue the... Dhanvantari.", ["Dhanvantari."]], ["Devtaon ke vaidya, haath mein amrit-kalash.", ["vaidya,", "amrit-kalash."]]], [cue("cap03b"), cue("cap03c")]),
  ...split("04_narrator", [["Isiliye Dhanteras pe bartan khareedne ki parampara hai...", ["bartan", "parampara"]], ["usi kalash ki yaad mein.", ["kalash", "yaad"]]], [cue("cap04b")]),
  ...split("06_narrator", [["Toh is Dhanteras, jo chahein khareediye...", ["khareediye..."]], ["par sabse bada nivesh, apni sehat mein.", ["nivesh,", "sehat"]]], [cue("cap06b")]),
  ...split("07_narrator", [["Jyotish mein sehat ka kaarak hai Surya.", ["sehat", "Surya."]], ["Aapki kundali ka Surya, kitna balwan hai?", ["Surya,", "balwan"]]], [cue("cap07b")]),
];

export const CaptionsD1: React.FC<{ f: number; y?: number }> = ({ f, y = 1500 }) => {
  const c = CAPS_D1.find((k) => f >= k.from && f < k.to);
  if (!c) return null;
  const t = f - c.from;
  const pop = track(t, [[0, 0.9], [5, 1.03, "out"], [9, 1, "io"]]);
  const o = ramp(t, 0, 4) * (1 - ramp(f, c.to - 4, c.to, "in"));
  const words = c.text.split(" ");
  return (
    <div style={{ position: "absolute", left: 80, width: 840, top: y, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ transform: `scale(${pop})`, padding: "16px 30px 18px", borderRadius: 22, background: "rgba(12,10,7,0.62)", border: "1.5px solid rgba(223,177,91,0.55)", textAlign: "center", fontFamily: JAKARTA, fontWeight: 800, fontSize: 50, lineHeight: 1.18, color: "#FFF6E4", textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>
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
/* 07: the kundali, सू lit on 'सूर्य', 'बल = ?' on 'बलवान'              */
/* ------------------------------------------------------------------ */

// North Indian chart house centres for half-width h (house 1 = top diamond, counter-clockwise)
const HOUSE = (h: number): [number, number][] => [
  [0, -h / 2], [-h / 2, (-h * 5) / 6], [(-h * 5) / 6, -h / 2], [-h / 2, 0], [(-h * 5) / 6, h / 2], [-h / 2, (h * 5) / 6],
  [0, h / 2], [h / 2, (h * 5) / 6], [(h * 5) / 6, h / 2], [h / 2, 0], [(h * 5) / 6, -h / 2], [h / 2, (-h * 5) / 6],
];
export const KUNDALI_AT: [number, number] = [540, 860];

/** SVG layer: the chart draws in, सू (in house 1, the tanu bhava: body and vitality) glows gold on 'सूर्य'. */
export const EndKundaliD1: React.FC<{ f: number; at: number; out: number }> = ({ f, at, out }) => {
  const t = f - at;
  if (t < 0 || f > out + 12) return null;
  const o = 1 - ramp(f, out - 4, out + 12, "in");
  const d = ramp(t, 2, 30, "io");
  const [cx, cy] = KUNDALI_AT;
  const hs = HOUSE(280);
  const S = cue("surya07", at + 60);
  const sun = ramp(f, S - 2, S + 8, "out");
  const S2 = cue("surya07b", at + 120);
  const pulse = ramp(f, S2 - 2, S2 + 6, "out") * (1 - ramp(f, S2 + 10, S2 + 26, "in"));
  const [hx, hy] = hs[0];
  return (
    <g opacity={o}>
      <KundaliGrid f={f} cx={cx} cy={cy} size={560} d={d} glyphs={0} o={0.9} />
      {sun > 0 ? (
        <g transform={`translate(${cx + hx} ${cy + hy})`} opacity={sun}>
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d="M-5 -44L5 -44L2 -78L-2 -78Z" transform={`rotate(${i * 30 + f * 0.8}) scale(${1 + 0.35 * pulse})`} fill="#FFD36B" opacity={0.7} />
          ))}
          <circle r={40 + 10 * pulse} fill="#FFC94D" opacity={0.22 + 0.25 * pulse} />
          <circle r={32} fill="#1A0E04" stroke="#FFD36B" strokeWidth={3} />
          <text y={14} textAnchor="middle" fontFamily={ROZHA} fontSize={44} fill="#FFE6A3" style={{ filter: "drop-shadow(0 0 10px #FFC94D)" }}>
            सू
          </text>
        </g>
      ) : null}
    </g>
  );
};

/** HTML over the chart: the house name under सू, then 'सूर्य बल = ?' on 'बलवान'. */
export const SunAskD1: React.FC<{ f: number; at: number; out: number }> = ({ f, at, out }) => {
  if (f < at || f > out + 8) return null;
  const o = 1 - ramp(f, out - 4, out + 8, "in");
  const S = cue("surya07", at + 60);
  const tag = ramp(f, S + 6, S + 14, "out");
  const BW = cue("balwan", at + 150);
  const q = ramp(f, BW - 4, BW + 6, "out");
  const pop = track(f - BW + 4, [[0, 0.7], [7, 1.12, "out"], [11, 1, "io"]]);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 300, display: "flex", justifyContent: "center", opacity: tag }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: "#F3DB9D", textShadow: "0 3px 10px rgba(0,0,0,0.7)" }}>
          SURYA = <span style={{ fontFamily: ROZHA, fontWeight: 400, fontSize: 44, letterSpacing: 0, color: "#FFD36B" }}>सेहत · ऊर्जा · आत्मा</span>
        </div>
      </div>
      {q > 0 ? (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 1180, display: "flex", justifyContent: "center", opacity: q }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 32px 12px", borderRadius: 46, ...PILL, border: "3px solid rgba(255,201,77,0.95)", boxShadow: "0 0 34px rgba(255,201,77,0.5)", transform: `scale(${pop})` }}>
            <span style={{ fontFamily: ROZHA, fontSize: 60, color: "#FFF6E4" }}>आपका सूर्य बल =</span>
            <span style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 66, color: "#FFD36B", display: "inline-block", transform: `scale(${1 + 0.06 * Math.sin(f / 3)})` }}>?</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 08: the phone with the real Jyotiq screen recording                 */
/* ------------------------------------------------------------------ */

export const PHONE = { left: 310, top: 320, w: 460, h: 997 }; // 1080x2340 recording, scaled; clears the top diya row

export const AppPhoneD1: React.FC<{ f: number; at: number; out: number; src: string }> = ({ f, at, out, src }) => {
  const t = f - at;
  if (t < 0 || f > out + 10) return null;
  const a = ramp(t, 0, 12, "out");
  const o = 1 - ramp(f, out - 4, out + 10, "in");
  const F = cue("free08", at + 45);
  const free = ramp(f, F - 2, F + 6, "out");
  const fPop = track(f - F + 2, [[0, 0.7], [6, 1.12, "out"], [10, 1, "io"]]);
  const G = cue("cap08b", at + 75);
  const greet = ramp(f, G - 4, G + 8, "out");
  const drift = 1 + 0.05 * ramp(f, at, out, "lin");
  const float = Math.sin(f / 22) * 6;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, transform: `translateY(${float}px) scale(${drift})`, transformOrigin: "50% 45%" }}>
      <div
        style={{
          position: "absolute", left: PHONE.left - 14, top: PHONE.top - 14, width: PHONE.w + 28, height: PHONE.h + 28, borderRadius: 64,
          background: "linear-gradient(160deg, #3A2A18, #120C06)", border: "3px solid rgba(223,177,91,0.85)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(255,201,77,0.25)",
          transform: `translateY(${(1 - a) * 260}px) rotate(${(1 - a) * -6}deg)`, opacity: a,
        }}
      >
        <div style={{ position: "absolute", left: 14, top: 14, width: PHONE.w, height: PHONE.h, borderRadius: 52, overflow: "hidden", background: "#000" }}>
          <Sequence from={at} durationInFrames={Math.max(1, out - at + 10)} layout="none">
            <OffthreadVideo src={staticFile(src)} muted style={{ width: PHONE.w, height: PHONE.h, objectFit: "cover" }} />
          </Sequence>
        </div>
      </div>
      {free > 0 ? (
        <div style={{ position: "absolute", left: 0, width: 1080, top: PHONE.top + PHONE.h - 40, display: "flex", justifyContent: "center", opacity: free }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 32px 12px", borderRadius: 46, ...PILL, border: "3px solid rgba(255,201,77,0.95)", boxShadow: "0 0 30px rgba(255,201,77,0.45)", transform: `scale(${fPop})` }}>
            <span style={{ fontFamily: ROZHA, fontSize: 58, color: "#FFD36B" }}>फ़्री कुंडली</span>
            <span style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 40, color: "#FFF6E4" }}>· Jyotiq</span>
          </div>
        </div>
      ) : null}
      {greet > 0 ? (
        <div style={{ position: "absolute", left: 0, width: 1080, top: PHONE.top + PHONE.h + 70, display: "flex", justifyContent: "center", opacity: greet, transform: `translateY(${(1 - greet) * 18}px)` }}>
          <span style={{ fontFamily: ROZHA, fontSize: 60, color: "#FFE6A3", textShadow: `${GOLD_TXT}, 0 0 18px rgba(14,10,32,0.95)` }}>धनतेरस की हार्दिक शुभकामनाएँ</span>
        </div>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* End card: tomorrow's diya (the svg Yamraj and diya row sit behind),  */
/* the comment prompt and the Jyotiq block                              */
/* ------------------------------------------------------------------ */

export const EndTeaseD1: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const t = f - at;
  if (t < 0) return null;
  const a = ramp(t, 0, 12, "out");
  const b = ramp(t, 8, 20, "out");
  return (
    <div style={{ position: "absolute", left: 520, top: 230, width: 520, opacity: a, transform: `translateX(${(1 - a) * 30}px)` }}>
      <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: "#BFD0EE" }}>KAL · DOOSRA DIYA</div>
      <div style={{ fontFamily: ROZHA, fontSize: 66, lineHeight: 1.12, color: "#FFD36B", marginTop: 8, textShadow: "0 0 26px rgba(255,201,77,0.45), 0 5px 0 #0E0A1C", opacity: b }}>
        यमराज के लिए
        <br />
        दीया क्यों?
      </div>
      <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 30, color: "#F3DB9D", marginTop: 10, opacity: b }}>Chhoti Diwali · Din 2</div>
    </div>
  );
};

export const EndBrandD1: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const t = f - at;
  if (t < 0) return null;
  const c = ramp(t, 0, 12, "out");
  const O = cue("offer", at + 30);
  const d = ramp(f, O - 6, O + 8, "out");
  const cm = ramp(t, 14, 26, "out");
  const glow = 0.5 + 0.5 * Math.sin(t / 8);
  const nudge = Math.sin(f / 5) * 6;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "absolute", top: 820, display: "flex", justifyContent: "center", opacity: cm, transform: `scale(${0.9 + 0.1 * cm})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 26px 12px", borderRadius: 40, ...PILL }}>
          <svg width={40} height={40} viewBox="-12 -12 24 24" style={{ display: "block" }}>
            <path d="M-9 -8H9V5H-1L-6 10V5H-9Z" fill="#FFC94D" />
            <circle cx={-4} cy={-1.5} r={1.4} fill="#0C0A07" />
            <circle cx={0} cy={-1.5} r={1.4} fill="#0C0A07" />
            <circle cx={4} cy={-1.5} r={1.4} fill="#0C0A07" />
          </svg>
          <span style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 36, color: "#FFF6E4" }}>
            Comment karo: <span style={{ fontFamily: ROZHA, fontWeight: 400, fontSize: 44, color: "#FFC94D" }}>सोना या सेहत?</span>
          </span>
        </div>
      </div>
      <div style={{ position: "absolute", top: 960, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, opacity: c, transform: `scale(${0.92 + 0.08 * c})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Img src={staticFile("jyotiq/logo-full.png")} style={{ width: 150, height: 172, objectFit: "contain" }} />
          <div>
            <div style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 64, color: "#FFE7A8", lineHeight: 1 }}>Jyotiq se pucho</div>
            <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 32, color: "#F3DB9D", marginTop: 8 }}>Pehla sawaal free · phir ₹5 per sawaal</div>
            <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 34, color: "#FFC94D", marginTop: 8, letterSpacing: 1 }}>www.jyotiq.ai</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1220, display: "flex", gap: 22, opacity: d, transform: `translateY(${(1 - d) * 24}px) scale(0.66)`, transformOrigin: "50% 0" }}>
        <PlayButton glow={glow} />
        <AppStoreButton glow={glow} />
      </div>
      <div style={{ position: "absolute", top: 1318, display: "flex", alignItems: "center", gap: 10, opacity: d }}>
        <svg width={40} height={40} viewBox="-12 -12 24 24" style={{ display: "block", transform: `translate(${-nudge * 0.6}px, ${nudge}px)` }}>
          <path d="M8 -8L-7 7M-7 -3L-7 7L3 7" stroke="#FFC94D" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <span style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 32, color: "#FFF6E4" }}>
          App ka link <span style={{ color: "#FFC94D" }}>profile (bio)</span> mein
        </span>
      </div>
      <div style={{ position: "absolute", top: 1380, fontFamily: JAKARTA, fontWeight: 600, fontSize: 22, color: "rgba(243,219,157,0.6)", opacity: d }}>
        Guidance only, for entertainment and information.
      </div>
    </div>
  );
};
