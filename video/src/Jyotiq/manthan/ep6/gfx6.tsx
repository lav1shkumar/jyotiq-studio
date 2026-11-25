import React from "react";
import { Img, staticFile } from "remotion";
import { AppStoreButton, PlayButton } from "../../katha/reelKit";
import { CINZEL, JAKARTA, KundaliGrid, PLAYFAIR, ROZHA } from "../graphics";
import { P, ramp, track } from "../style";
import { CUES, LINES } from "./timing";

/* Episode 6 graphics in the series' exact style (Episode 5 fonts, colours and pill shapes).
   Retention layer for this episode:
   - the hook plate states the whole paradox from frame 0 (sound-off), with an "असुर: 0 बूँद" meter,
   - a kalash tracker that follows who holds it (धन्वंतरि → असुर → मोहिनी),
   - Mohini's open question ("मोहिनी = ?") answered on the conch ("श्री विष्णु ✓"),
   - (part 2) clue circles, the drop-meter payoff, captions, kundali (रा) and the end card. */

export const GOLD_TXT = "0 0 34px rgba(255,201,77,0.6), 0 6px 0 #4A2A08";
export const PILL: React.CSSProperties = {
  background: "rgba(12,10,7,0.7)",
  border: "2px solid rgba(223,177,91,0.8)",
  boxShadow: "0 6px 24px rgba(0,0,0,0.45)",
};
export const Tick: React.FC<{ size: number; color?: string }> = ({ size, color = "#FFFFFF" }) => (
  <svg width={size} height={size} viewBox="-10 -10 20 20" style={{ display: "block" }}>
    <path d="M-7 0L-2 5L7 -6" stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);
export const Drop: React.FC<{ size: number; fill?: string }> = ({ size, fill = "#FFE08A" }) => (
  <svg width={size} height={size} viewBox="-10 -12 20 22" style={{ display: "block" }}>
    <path d="M0 -11C4 -5 8 -1 8 3C8 7.5 4.5 10 0 10C-4.5 10 -8 7.5 -8 3C-8 -1 -4 -5 0 -11Z" fill={fill} stroke="#8E5A10" strokeWidth={1.2} />
    <ellipse cx={-3} cy={2} rx={1.6} ry={3} fill="#FFFFFF" opacity={0.7} />
  </svg>
);
const Pot: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="-12 -14 24 26" style={{ display: "block" }}>
    <path d="M-5 -12L5 -12L4 -8L-4 -8Z" fill="#FFD36B" stroke="#8E5A10" strokeWidth={1} />
    <path d="M-4 -8C-11 -6 -11 9 0 10C11 9 11 -6 4 -8Z" fill="#F2B51C" stroke="#8E5A10" strokeWidth={1.2} />
    <path d="M-8 0Q0 3 8 0" stroke="#C8102E" strokeWidth={1.4} fill="none" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Hook plate: the whole paradox from frame 0, in the middle third     */
/* ------------------------------------------------------------------ */

export const HookPlate6: React.FC<{ f: number; out: number }> = ({ f, out }) => {
  if (f > out + 8) return null;
  const o = 1 - ramp(f, out - 6, out + 8, "in");
  const settle = track(f, [[0, 1.04], [10, 1.0, "out"]]);
  const m = ramp(f, CUES.boond, CUES.boond + 6, "out");
  const mPop = track(f - CUES.boond, [[0, 0.6], [6, 1.12, "out"], [10, 1, "io"]]);
  const q = ramp(f, CUES.kyon - 2, CUES.kyon + 6, "out");
  const qPulse = 1 + q * (0.1 + 0.06 * Math.sin(f / 3));
  return (
    <div style={{ position: "absolute", left: 0, top: 650, width: 1080, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
      <div style={{ position: "absolute", left: 60, top: -30, width: 960, height: 330, borderRadius: 165, background: "radial-gradient(ellipse at center, rgba(14,10,32,0.84) 0%, rgba(14,10,32,0.62) 55%, rgba(14,10,32,0) 100%)" }} />
      <div style={{ position: "relative", fontFamily: ROZHA, fontSize: 78, lineHeight: 1.12, color: "#F6EBD6", transform: `scale(${settle})`, textShadow: "0 0 26px rgba(10,14,40,0.9), 0 5px 0 #0E0A1C" }}>
        अमृत असुरों के पास था...
      </div>
      <div style={{ position: "relative", fontFamily: ROZHA, fontSize: 86, lineHeight: 1.14, marginTop: 6, color: "#FFD36B", transform: `scale(${settle})`, textShadow: `${GOLD_TXT}, 0 0 18px rgba(14,10,32,0.95), 0 6px 0 #0E0A1C`, whiteSpace: "nowrap" }}>
        फिर भी एक बूँद नहीं मिली!
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 40, height: 104 }}>
        {m > 0 ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 30px 12px", borderRadius: 50, ...PILL, border: "3px solid rgba(232,48,74,0.85)", opacity: m, transform: `scale(${mPop})` }}>
            <span style={{ fontFamily: ROZHA, fontSize: 54, color: "#FFF6E4" }}>असुर:</span>
            <span style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 60, color: "#FF5A6E" }}>0</span>
            <Drop size={46} />
          </div>
        ) : null}
        {q > 0 ? (
          <div style={{ fontFamily: ROZHA, fontSize: 96, color: "#FFD36B", opacity: q, transform: `scale(${qPulse})`, textShadow: GOLD_TXT }}>क्यों?</div>
        ) : null}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Title card as a quick overlay on the rewind (Episode 5's layout)    */
/* ------------------------------------------------------------------ */

export const TitleCard6: React.FC<{ f: number; at: number; out: number }> = ({ f, at, out }) => {
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
        EPISODE 6 · <span style={{ fontFamily: ROZHA, fontWeight: 400, fontSize: 48 }}>मोहिनी</span> · MOHINI
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Kalash tracker: who holds the amrit right now                       */
/* ------------------------------------------------------------------ */

const HOLDERS = [
  { at: CUES.dhanvantari, who: "धन्वंतरि", color: "#FFF6E4" },
  { at: CUES.chheen, who: "असुर", color: "#FF8A7A" },
  { at: CUES.handover, who: "मोहिनी", color: "#9FC4FF" },
];

export const KalashTracker6: React.FC<{ f: number; out: number }> = ({ f, out }) => {
  if (f < HOLDERS[0].at || f > out + 10) return null;
  const o = ramp(f, HOLDERS[0].at, HOLDERS[0].at + 8, "out") * (1 - ramp(f, out - 4, out + 10, "in"));
  let i = 0;
  HOLDERS.forEach((h, k) => {
    if (f >= h.at) i = k;
  });
  const h = HOLDERS[i];
  const pop = track(f - h.at, [[0, 0.8], [5, 1.12, "out"], [9, 1, "io"]]);
  return (
    <div style={{ position: "absolute", left: 0, top: 236, width: 1080, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 30px 12px", borderRadius: 46, ...PILL, transform: `scale(${pop})` }}>
        <Pot size={48} />
        <span style={{ fontFamily: ROZHA, fontSize: 50, color: "#F3DB9D" }}>कलश:</span>
        <span style={{ fontFamily: ROZHA, fontSize: 56, color: h.color }}>{h.who}</span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* "मोहिनी = ?" through the enchantment, answered on the conch         */
/* ------------------------------------------------------------------ */

export const AskAnswer6: React.FC<{ f: number; at: number; answer: number; out: number }> = ({ f, at, answer, out }) => {
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
        <span style={{ fontFamily: ROZHA, fontSize: 56, lineHeight: 1.1, color: "#FFF6E4" }}>मोहिनी</span>
        <span style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 52, color: "#F3DB9D" }}>=</span>
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

/* ------------------------------------------------------------------ */
/* Captions (Episode 5's box and colours; timed from timing.ts)        */
/* ------------------------------------------------------------------ */

type Who = "n" | "b" | "m";
type Cap = { from: number; to: number; text: string; who: Who; hi?: string[] };
const WHO: Record<Who, string> = { n: "#FFF6E4", b: "#FFB3A0", m: "#FFC9DE" };

const split = (key: string, who: Who, parts: [string, string[]][], at: number[] = []): Cap[] => {
  const [a, b] = LINES[key];
  const edges = [a, ...at, b];
  return parts.map(([text, hi], i) => ({ from: edges[i], to: edges[i + 1], text, who, hi }));
};

export const CAPS6: Cap[] = [
  // 01 is carried by the hook plate on screen
  ...split("02_narrator", "n", [["Saagar se prakat hue Dhanvantari...", ["Saagar", "Dhanvantari..."]], ["haathon mein amrit ka kalash.", ["amrit", "kalash."]]], [CUES.cap02b]),
  ...split("03_bali", "b", [["Ruko! Yeh amrit... asuron ka hai!", ["Ruko!", "asuron"]]]),
  ...split("04_narrator", "n", [["Asuron ne kalash chheen liya...", ["kalash", "chheen"]], ["aur aapas mein hi lad pade.", ["aapas", "lad"]]], [CUES.cap04b]),
  ...split("05_narrator", "n", [["Tabhi wahan aayin ek adbhut sundari... Mohini.", ["adbhut", "Mohini."]]]),
  ...split("06_mohini", "m", [["Itna jhagda kyon?", ["jhagda"]], ["Kalash mujhe do... main sabko baant doongi.", ["Kalash", "baant"]]], [CUES.cap06b]),
  ...split("07_narrator", "n", [["Asur mohit ho gaye.", ["mohit"]], ["Kisi ne nahi poochha... yeh hai kaun?", ["poochha...", "kaun?"]]], [CUES.cap07b]),
  ...split("08_narrator", "n", [["Woh swayam Shri Vishnu the.", ["Shri", "Vishnu"]], ["Aur amrit... sirf devtaon ko mila.", ["amrit...", "devtaon"]]], [CUES.cap08b]),
  ...split("09_narrator", "n", [["Par ek asur...", ["asur..."]], ["chupke se devtaon ki pankti mein ja baitha.", ["chupke", "pankti"]]], [CUES.cap09b]),
  // 10 and the sign-off play over the end card, which carries the same words
];

export const Captions6: React.FC<{ f: number; y?: number }> = ({ f, y = 1300 }) => {
  const c = CAPS6.find((k) => f >= k.from && f < k.to);
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

/* ------------------------------------------------------------------ */
/* Clue freeze on "ये है कौन?": circles on Mohini's three clues         */
/* ------------------------------------------------------------------ */

export type Clue = { x: number; y: number; r: number; label: string; dx?: number; dy?: number };

export const ClueCircles6: React.FC<{ f: number; at: number; out: number; clues: Clue[]; askY?: number }> = ({ f, at, out, clues, askY = 1500 }) => {
  const t = f - at;
  if (t < 0 || f > out + 8) return null;
  const o = 1 - ramp(f, out - 4, out + 8, "in");
  const ask = ramp(t, 4 + clues.length * 5, 10 + clues.length * 5, "out");
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      {clues.map((c, i) => {
        const k = ramp(t, i * 5, i * 5 + 6, "out");
        const pop = track(t - i * 5, [[0, 0.6], [6, 1.1, "out"], [10, 1, "io"]]);
        return (
          <div key={i}>
            <div style={{ position: "absolute", left: c.x - c.r, top: c.y - c.r, width: 2 * c.r, height: 2 * c.r, borderRadius: c.r, border: "5px solid #FFD36B", boxShadow: "0 0 22px rgba(255,211,107,0.8)", opacity: k, transform: `scale(${pop})` }} />
            <div style={{ position: "absolute", left: c.x + (c.dx ?? c.r + 16), top: c.y + (c.dy ?? -30), whiteSpace: "nowrap", opacity: k, padding: "6px 20px 8px", borderRadius: 30, ...PILL, fontFamily: ROZHA, fontSize: 46, color: "#FFD36B" }}>
              {c.label}
            </div>
          </div>
        );
      })}
      {ask > 0 ? (
        <div style={{ position: "absolute", left: 0, width: 1080, top: askY, display: "flex", justifyContent: "center", opacity: ask }}>
          <div style={{ padding: "10px 36px 14px", borderRadius: 50, ...PILL, border: "3px solid rgba(255,211,107,0.9)", fontFamily: ROZHA, fontSize: 72, color: "#FFF6E4", transform: `scale(${1 + 0.05 * Math.sin(f / 3)})` }}>पहचाना?</div>
        </div>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Drop meters: the hook's "असुर: 0" paid off as the devas fill up      */
/* ------------------------------------------------------------------ */

const Meter: React.FC<{ label: string; value: string; border: string; color: string }> = ({ label, value, border, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 26px 10px", borderRadius: 44, ...PILL, border: `3px solid ${border}` }}>
    <span style={{ fontFamily: ROZHA, fontSize: 48, color: "#FFF6E4" }}>{label}</span>
    <span style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 54, color }}>{value}</span>
    <Drop size={40} />
  </div>
);

export const DropMeters6: React.FC<{ f: number; at: number; out: number; deva: number; asura: string; flicker?: number }> = ({ f, at, out, deva, asura, flicker = 0 }) => {
  const t = f - at;
  if (t < 0 || f > out + 8) return null;
  const o = ramp(t, 0, 8, "out") * (1 - ramp(f, out - 4, out + 8, "in"));
  const shake = flicker > 0 ? Math.sin(f * 2.3) * 6 * flicker : 0;
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: 236, display: "flex", justifyContent: "center", gap: 26, opacity: o }}>
      <Meter label="देव:" value={`${Math.round(deva)}`} border="rgba(47,163,90,0.9)" color="#7CF0A6" />
      <div style={{ transform: `translateX(${shake}px)` }}>
        <Meter label="असुर:" value={asura} border="rgba(232,48,74,0.9)" color="#FF5A6E" />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* End: kundali where रा hops house to house, then every house asks ?   */
/* ------------------------------------------------------------------ */

// North Indian chart house centres for half-width h (house 1 = top diamond, counter-clockwise)
const HOUSE = (h: number): [number, number][] => [
  [0, -h / 2], [-h / 2, (-h * 5) / 6], [(-h * 5) / 6, -h / 2], [-h / 2, 0], [(-h * 5) / 6, h / 2], [-h / 2, (h * 5) / 6],
  [0, h / 2], [h / 2, (h * 5) / 6], [(h * 5) / 6, h / 2], [h / 2, 0], [(h * 5) / 6, -h / 2], [h / 2, (-h * 5) / 6],
];

export const EndKundali6: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const t = f - at;
  if (t < 0) return null;
  const d = ramp(t, 4, 40, "io");
  const cx = 540;
  const cy = 800;
  const hs = HOUSE(125);
  const hopFrom = CUES.kundali - 10;
  const settle = CUES.kahan + 4;
  const hopping = f >= hopFrom && f < settle;
  const k = Math.floor(Math.max(0, f - hopFrom) / 4) % 12;
  const ask = ramp(f, settle, settle + 12, "out");
  return (
    <g>
      <KundaliGrid f={f} cx={cx} cy={cy} size={250} d={d} glyphs={0} o={0.9} />
      {hopping ? (
        <g transform={`translate(${cx + hs[k][0]} ${cy + hs[k][1]})`}>
          <circle r={28} fill="#0C0A07" opacity={0.85} />
          <circle r={36} fill="none" stroke="#B89CFF" strokeWidth={2} opacity={0.7} />
          <text y={13} textAnchor="middle" fontFamily={ROZHA} fontSize={38} fill="#E6DAFF" style={{ filter: "drop-shadow(0 0 8px #9A7CFF)" }}>
            रा
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

/* ------------------------------------------------------------------ */
/* End card (series layout + the Rahu tie-in + www.jyotiq.ai)          */
/* ------------------------------------------------------------------ */

export const EndCard6: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const t = f - at;
  if (t < 0) return null;
  const a = ramp(t, 0, 14, "out");
  const b = ramp(t, 6, 18, "out");
  const q = ramp(f, CUES.kundali - 6, CUES.kundali + 8, "out");
  const cm = ramp(f, CUES.kahan + 10, CUES.kahan + 22, "out");
  const cmPop = track(f - CUES.kahan - 10, [[0, 0.7], [7, 1.06, "out"], [11, 1, "io"]]);
  const c = ramp(f, CUES.signoff - 10, CUES.signoff + 4, "out");
  const d = ramp(f, CUES.offer - 6, CUES.offer + 8, "out");
  const glow = 0.5 + 0.5 * Math.sin(t / 8);
  const nudge = Math.sin(f / 5) * 6;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ marginTop: 250, opacity: a, transform: `translateY(${(1 - a) * 30}px)`, textAlign: "center" }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 34, letterSpacing: 8, color: "#CDB8FF" }}>AGLA EPISODE</div>
        <div style={{ fontFamily: ROZHA, fontSize: 130, lineHeight: 1.05, color: "#FFD36B", textShadow: "0 0 30px rgba(255,201,77,0.5)" }}>ग्रहण</div>
        <div style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 64, letterSpacing: 18, color: "#F6EBD6" }}>GRAHAN</div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 600, fontSize: 34, color: "#F3DB9D", marginTop: 14 }}>Grahan kyon lagta hai?</div>
      </div>
      <div style={{ position: "absolute", top: 960, width: 940, textAlign: "center", opacity: b }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 44, lineHeight: 1.25, color: "#FFF6E4" }}>
          Jyotish mein <span style={{ color: "#C9B4FF" }}>Rahu</span> = Maaya aur achaanak mod.
        </div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 36, color: "#FFF6E4", marginTop: 16, opacity: q }}>
          Aapki <span style={{ color: "#FFC94D" }}>kundali</span> mein Rahu <span style={{ color: "#FFC94D" }}>kahan</span> baitha hai?
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
              Comment karo: aapka <span style={{ color: "#C9B4FF" }}>Rahu</span> kis bhaav mein?
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
