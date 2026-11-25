import { Img, staticFile } from "remotion";
import { AppStoreButton, PlayButton } from "../../katha/reelKit";
import { CINZEL, JAKARTA, KundaliGrid, PLAYFAIR, ROZHA } from "../graphics";
import { P, ramp, track } from "../style";
import { CUES, LINES } from "./timing";

/* Episode 7 graphics in the series' exact style (Episode 5/6 fonts, colours and pill shapes; the small
   primitives are copied here so Episode 7 does not depend on Episode 6 files that are still changing).
   Retention layer for this episode:
   - the hook plate asks the question from frame 0 (sound-off): "हर ग्रहण के पीछे... एक कटा हुआ सिर!",
     then "किसका?" with an open "ग्रहण = ?" pill, answered in 09 by "ग्रहण = राहु ✓",
   - Episode 6's "असुर: 1?" meter returns and pays off as "असुर: 1 घूँट" (part 2),
   - the throat chip "अमृत: गले तक" explains why the head lives (part 2). */

const cue = (k: string, dflt = 99999) => (typeof CUES[k] === "number" ? CUES[k] : dflt);

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
/** A small eclipse icon: gold sun with the dark disc biting it. */
export const EclipseIcon: React.FC<{ size: number; cover?: number }> = ({ size, cover = 0.6 }) => (
  <svg width={size} height={size} viewBox="-12 -12 24 24" style={{ display: "block" }}>
    <circle r={9} fill="#FFD27A" stroke="#FFF1C2" strokeWidth={1} />
    <circle cx={-(1 - cover) * 18} cy={(1 - cover) * 6} r={9.2} fill="#0A0612" stroke="#FFD27A" strokeWidth={0.8} />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Hook plate: the question from frame 0, in the middle third          */
/* ------------------------------------------------------------------ */

export const HookPlate7: React.FC<{ f: number; out: number }> = ({ f, out }) => {
  if (f > out + 8) return null;
  const o = 1 - ramp(f, out - 6, out + 8, "in");
  const settle = track(f, [[0, 1.04], [10, 1.0, "out"]]);
  const K = cue("kiska");
  const q = ramp(f, K - 2, K + 6, "out");
  const qPop = track(f - K, [[0, 0.6], [6, 1.12, "out"], [10, 1, "io"]]);
  const qPulse = 1 + q * (0.1 + 0.06 * Math.sin(f / 3));
  return (
    <div style={{ position: "absolute", left: 0, top: 650, width: 1080, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
      <div style={{ position: "absolute", left: 60, top: -30, width: 960, height: 330, borderRadius: 165, background: "radial-gradient(ellipse at center, rgba(14,10,32,0.84) 0%, rgba(14,10,32,0.62) 55%, rgba(14,10,32,0) 100%)" }} />
      <div style={{ position: "relative", fontFamily: ROZHA, fontSize: 78, lineHeight: 1.12, color: "#F6EBD6", transform: `scale(${settle})`, textShadow: "0 0 26px rgba(10,14,40,0.9), 0 5px 0 #0E0A1C" }}>
        हर ग्रहण के पीछे...
      </div>
      <div style={{ position: "relative", fontFamily: ROZHA, fontSize: 86, lineHeight: 1.14, marginTop: 6, color: "#FFD36B", transform: `scale(${settle})`, textShadow: `${GOLD_TXT}, 0 0 18px rgba(14,10,32,0.95), 0 6px 0 #0E0A1C`, whiteSpace: "nowrap" }}>
        एक कटा हुआ सिर!
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 40, height: 104 }}>
        {q > 0 ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 30px 12px", borderRadius: 50, ...PILL, border: "3px solid rgba(232,48,74,0.85)", opacity: q, transform: `scale(${qPop})` }}>
            <EclipseIcon size={50} />
            <span style={{ fontFamily: ROZHA, fontSize: 54, color: "#FFF6E4" }}>ग्रहण =</span>
            <span style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 60, color: "#FF5A6E" }}>?</span>
          </div>
        ) : null}
        {q > 0 ? (
          <div style={{ fontFamily: ROZHA, fontSize: 96, color: "#FFD36B", opacity: q, transform: `scale(${qPulse})`, textShadow: GOLD_TXT }}>किसका?</div>
        ) : null}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Title card as a quick overlay on the rewind (Episode 5/6 layout)    */
/* ------------------------------------------------------------------ */

export const TitleCard7: React.FC<{ f: number; at: number; out: number }> = ({ f, at, out }) => {
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
        EPISODE 7 · <span style={{ fontFamily: ROZHA, fontWeight: 400, fontSize: 48 }}>राहु</span> · RAHU
      </div>
      <div style={{ fontFamily: JAKARTA, fontWeight: 600, fontSize: 34, color: "#F3DB9D", opacity: c, marginTop: 12 }}>Grahan kyon lagta hai?</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* JAWAB in 09: "ग्रहण = ?" answered "राहु ✓" (AskAnswer6's pill)       */
/* ------------------------------------------------------------------ */

export const Jawab7: React.FC<{ f: number; at: number; answer: number; out: number }> = ({ f, at, answer, out }) => {
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
        <EclipseIcon size={52} cover={0.95} />
        <span style={{ fontFamily: ROZHA, fontSize: 56, lineHeight: 1.1, color: "#FFF6E4" }}>ग्रहण</span>
        <span style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 52, color: "#F3DB9D" }}>=</span>
        {k < 0.5 ? (
          <span style={{ fontFamily: ROZHA, fontSize: 64, lineHeight: 1.1, color: "#FFD36B", display: "inline-block", transform: `scale(${q})`, opacity: 1 - 2 * k }}>?</span>
        ) : (
          <span style={{ display: "flex", alignItems: "center", gap: 10, opacity: 2 * k - 1 }}>
            <span style={{ fontFamily: ROZHA, fontSize: 60, lineHeight: 1.1, color: "#FFD36B", textShadow: "0 0 20px rgba(255,201,77,0.6)" }}>राहु</span>
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
/* Captions (Episode 5/6 box and colours; Rahu in violet)              */
/* ------------------------------------------------------------------ */

type Who = "n" | "r";
type Cap = { from: number; to: number; text: string; who: Who; hi?: string[] };
const WHO: Record<Who, string> = { n: "#FFF6E4", r: "#D9B8FF" };

const split = (key: string, who: Who, parts: [string, string[]][], at: number[] = []): Cap[] => {
  const r = LINES[key];
  if (!r) return []; // placeholder timing: no captions until the real takes are in
  const edges = [r[0], ...at, r[1]];
  return parts.map(([text, hi], i) => ({ from: edges[i], to: edges[i + 1], text, who, hi }));
};

export const CAPS7: Cap[] = [
  // 01 is carried by the hook plate on screen
  ...split("02_narrator", "n", [["Devtaon ki pankti mein chhupa baitha tha...", ["pankti", "chhupa"]], ["asur Svarbhanu.", ["Svarbhanu."]]], [cue("cap02b")]),
  ...split("03_narrator", "n", [["Mohini ne amrit daala...", ["Mohini", "amrit"]], ["aur usne ghoont bhar liya.", ["ghoont"]]], [cue("cap03b")]),
  ...split("04_narrator", "n", [["Tabhi Surya aur Chandra ne pehchaan liya...", ["Surya", "Chandra"]], ["yeh asur hai!", ["asur"]]], [cue("cap04b")]),
  ...split("05_narrator", "n", [["Vishnu ka Sudarshan chakra chala...", ["Sudarshan", "chakra"]], ["sir dhad se alag!", ["alag!"]]], [cue("cap05b")]),
  ...split("06_rahu", "r", [["Ha ha ha...", ["Ha"]], ["amrit gale tak pahunch chuka hai. Main amar hoon!", ["gale", "amar"]]], [cue("cap06b")]),
  ...split("07_narrator", "n", [["Sir bana Rahu... aur dhad, Ketu.", ["Rahu...", "Ketu."]]]),
  ...split("08_rahu", "r", [["Surya, Chandra... main har baar lautoonga.", ["lautoonga."]]]),
  ...split("09_narrator", "n", [["Tabhi se Rahu unka peechha karta hai...", ["Rahu", "peechha"]], ["jab nigalta hai, grahan lagta hai.", ["nigalta", "grahan"]]], [cue("cap09b")]),
  // 10 and the sign-off play over the end card, which carries the same words
];

export const Captions7: React.FC<{ f: number; y?: number }> = ({ f, y = 1300 }) => {
  const c = CAPS7.find((k) => f >= k.from && f < k.to);
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
/* Asura meter: Episode 6's "असुर: 1?" returns, then "1 घूँट" on the sip */
/* ------------------------------------------------------------------ */

export const AsurMeter7: React.FC<{ f: number; at: number; flip: number; out: number }> = ({ f, at, flip, out }) => {
  const t = f - at;
  if (t < 0 || f > out + 8) return null;
  const o = ramp(t, 0, 8, "out") * (1 - ramp(f, out - 4, out + 8, "in"));
  const done = f >= flip;
  const shake = done ? 0 : Math.sin(f * 2.3) * 5;
  const pop = done ? track(f - flip, [[0, 0.8], [5, 1.16, "out"], [10, 1, "io"]]) : 1;
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: 236, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 26px 10px", borderRadius: 44, ...PILL, border: "3px solid rgba(232,48,74,0.9)", transform: `translateX(${shake}px) scale(${pop})`, boxShadow: done ? "0 0 30px rgba(232,48,74,0.55)" : PILL.boxShadow }}>
        <span style={{ fontFamily: ROZHA, fontSize: 48, color: "#FFF6E4" }}>असुर:</span>
        <span style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 54, color: "#FF5A6E" }}>1</span>
        {done ? <span style={{ fontFamily: ROZHA, fontSize: 50, color: "#FF8A7A" }}>घूँट</span> : <span style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 54, color: "#FF5A6E" }}>?</span>}
        <Drop size={40} />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Throat chip: "अमृत: गले तक" pinned beside Rahu's neck                */
/* ------------------------------------------------------------------ */

export const ThroatChip7: React.FC<{ f: number; at: number; out: number; x: number; y: number }> = ({ f, at, out, x, y }) => {
  const t = f - at;
  if (t < 0 || f > out + 8) return null;
  const o = ramp(t, 0, 6, "out") * (1 - ramp(f, out - 4, out + 8, "in"));
  const pop = track(t, [[0, 0.7], [6, 1.1, "out"], [10, 1, "io"]]);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `scale(${pop})`, transformOrigin: "0 50%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 22px 9px", borderRadius: 34, ...PILL, border: "2.5px solid rgba(255,211,107,0.9)", boxShadow: "0 0 24px rgba(255,211,107,0.45)" }}>
        <Drop size={36} />
        <span style={{ fontFamily: ROZHA, fontSize: 44, color: "#FFF6E4" }}>अमृत:</span>
        <span style={{ fontFamily: ROZHA, fontSize: 46, color: "#FFD36B" }}>गले तक</span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Name card: Rozha name in gold over a small Jakarta subtitle          */
/* ------------------------------------------------------------------ */

export const NameCard7: React.FC<{ f: number; at: number; out: number; name: string; sub: string; top: number; color?: string }> = ({
  f, at, out, name, sub, top, color = "#FFD36B",
}) => {
  const t = f - at;
  if (t < 0 || f > out + 8) return null;
  const o = ramp(t, 0, 6, "out") * (1 - ramp(f, out - 4, out + 8, "in"));
  const pop = track(t, [[0, 0.8], [6, 1.08, "out"], [10, 1, "io"]]);
  const line = ramp(t, 4, 14, "out");
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top, display: "flex", flexDirection: "column", alignItems: "center", opacity: o, transform: `scale(${pop})` }}>
      <div style={{ fontFamily: ROZHA, fontSize: 104, lineHeight: 1.05, color, textShadow: `${GOLD_TXT}, 0 0 22px rgba(14,10,32,0.95)` }}>{name}</div>
      <div style={{ width: 360 * line, height: 3, background: `linear-gradient(90deg, transparent, ${P.gold}, transparent)`, margin: "10px 0 12px" }} />
      <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 32, letterSpacing: 7, color: "#F3DB9D", textShadow: "0 3px 10px rgba(0,0,0,0.7)" }}>{sub}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Alert ring on the exposed asura, with "ये असुर है!"                  */
/* ------------------------------------------------------------------ */

export const AlertRing7: React.FC<{ f: number; at: number; out: number; x: number; y: number; r: number; labelTop: number }> = ({ f, at, out, x, y, r, labelTop }) => {
  const t = f - at;
  if (t < 0 || f > out + 8) return null;
  const o = 1 - ramp(f, out - 4, out + 8, "in");
  const k = ramp(t, 0, 6, "out");
  const pulse = 1 + 0.06 * Math.sin(f / 2.2);
  const pop = track(t, [[0, 0.6], [6, 1.12, "out"], [10, 1, "io"]]);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: r, border: "7px solid #FF3B53", boxShadow: "0 0 30px rgba(255,59,83,0.85), inset 0 0 20px rgba(255,59,83,0.4)", opacity: k, transform: `scale(${pop * pulse})` }} />
      <div style={{ position: "absolute", left: 0, width: 1080, top: labelTop, display: "flex", justifyContent: "center", opacity: k }}>
        <div style={{ padding: "10px 36px 14px", borderRadius: 50, ...PILL, border: "3px solid rgba(255,59,83,0.95)", fontFamily: ROZHA, fontSize: 76, color: "#FFF6E4", transform: `scale(${pop})`, textShadow: "0 0 18px rgba(255,59,83,0.7)" }}>ये असुर है!</div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* End: kundali where रा and के sit in opposite houses and rotate      */
/* together round the chart, always 7 houses apart, then every house ?  */
/* ------------------------------------------------------------------ */

// North Indian chart house centres for half-width h (house 1 = top diamond, counter-clockwise)
const HOUSE = (h: number): [number, number][] => [
  [0, -h / 2], [-h / 2, (-h * 5) / 6], [(-h * 5) / 6, -h / 2], [-h / 2, 0], [(-h * 5) / 6, h / 2], [-h / 2, (h * 5) / 6],
  [0, h / 2], [h / 2, (h * 5) / 6], [(h * 5) / 6, h / 2], [h / 2, 0], [(h * 5) / 6, -h / 2], [h / 2, (-h * 5) / 6],
];

const Node: React.FC<{ x: number; y: number; g: string; ring: string; fill: string; glow: string }> = ({ x, y, g, ring, fill, glow }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={28} fill="#0C0A07" opacity={0.85} />
    <circle r={36} fill="none" stroke={ring} strokeWidth={2} opacity={0.75} />
    <text y={13} textAnchor="middle" fontFamily={ROZHA} fontSize={38} fill={fill} style={{ filter: `drop-shadow(0 0 8px ${glow})` }}>
      {g}
    </text>
  </g>
);

export const EndKundali7: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const t = f - at;
  if (t < 0) return null;
  const d = ramp(t, 4, 40, "io");
  const cx = 540;
  const cy = 800;
  const hs = HOUSE(125);
  const turnFrom = cue("kundali", at + 20) - 10;
  const settle = cue("bhaav", at + 80) + 4;
  const showNodes = f >= at + 10 && f < settle + 14;
  const k = Math.floor(Math.max(0, Math.min(f, settle) - turnFrom) / 5) % 12;
  const ra = hs[k];
  const ke = hs[(k + 6) % 12];
  const axis = ramp(f, at + 10, at + 22, "out") * (1 - ramp(f, settle, settle + 14, "in"));
  const ask = ramp(f, settle, settle + 12, "out");
  return (
    <g>
      <KundaliGrid f={f} cx={cx} cy={cy} size={250} d={d} glyphs={0} o={0.9} />
      {showNodes ? (
        <g opacity={axis}>
          <line x1={cx + ra[0]} y1={cy + ra[1]} x2={cx + ke[0]} y2={cy + ke[1]} stroke="#FFD36B" strokeWidth={2} strokeDasharray="8 10" opacity={0.55} />
          <Node x={cx + ra[0]} y={cy + ra[1]} g="रा" ring="#B89CFF" fill="#E6DAFF" glow="#9A7CFF" />
          <Node x={cx + ke[0]} y={cy + ke[1]} g="के" ring="#9FB3D9" fill="#DCE3F4" glow="#7FA3D9" />
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
/* End card (EndCard6 layout: Ketu tease, Rahu-Ketu tie-in, Jyotiq)    */
/* ------------------------------------------------------------------ */

export const EndCard7: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const t = f - at;
  if (t < 0) return null;
  const a = ramp(t, 0, 14, "out");
  const b = ramp(t, 6, 18, "out");
  const K = cue("kundali", at + 20);
  const BH = cue("bhaav", at + 80);
  const q = ramp(f, K - 6, K + 8, "out");
  const cm = ramp(f, BH + 10, BH + 22, "out");
  const cmPop = track(f - BH - 10, [[0, 0.7], [7, 1.06, "out"], [11, 1, "io"]]);
  const S = cue("signoff", at + 120);
  const c = ramp(f, S - 10, S + 4, "out");
  const d = ramp(f, cue("offer", S + 30) - 6, cue("offer", S + 30) + 8, "out");
  const glow = 0.5 + 0.5 * Math.sin(t / 8);
  const nudge = Math.sin(f / 5) * 6;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ marginTop: 250, opacity: a, transform: `translateY(${(1 - a) * 30}px)`, textAlign: "center" }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 34, letterSpacing: 8, color: "#BFD0EE" }}>AGLA EPISODE</div>
        <div style={{ fontFamily: ROZHA, fontSize: 130, lineHeight: 1.05, color: "#FFD36B", textShadow: "0 0 30px rgba(255,201,77,0.5)" }}>केतु</div>
        <div style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 64, letterSpacing: 18, color: "#F6EBD6" }}>KETU</div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 600, fontSize: 34, color: "#F3DB9D", marginTop: 14 }}>Bina sir ka graha</div>
      </div>
      <div style={{ position: "absolute", top: 960, width: 940, textAlign: "center", opacity: b }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 44, lineHeight: 1.25, color: "#FFF6E4" }}>
          <span style={{ color: "#C9B4FF" }}>Rahu</span> aur <span style={{ color: "#BFD0EE" }}>Ketu</span> hamesha aamne-saamne.
        </div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 36, color: "#FFF6E4", marginTop: 16, opacity: q }}>
          Aapki <span style={{ color: "#FFC94D" }}>kundali</span> mein yeh kis <span style={{ color: "#FFC94D" }}>bhaav</span> mein hain?
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
              Comment karo: aapke <span style={{ color: "#C9B4FF" }}>Rahu-Ketu</span> kis bhaav mein?
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
