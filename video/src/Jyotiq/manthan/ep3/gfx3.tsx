import React from "react";
import { Img, staticFile } from "remotion";
import { AppStoreButton, PlayButton } from "../../katha/reelKit";
import { CINZEL, JAKARTA, KundaliGrid, PLAYFAIR, ROZHA } from "../graphics";
import { P, ramp, track } from "../style";
import { CUES, LINES } from "./timing";

/* Episode 3 graphics in Episode 1's exact style (same fonts, colours, card shapes):
   the sound-off hook text, the Episode 3 title, Hinglish captions with gold keywords,
   and the Episode 3 end card (with www.jyotiq.ai). NameCard and BrandBug are imported
   from ../graphics unchanged. */

/* ------------------------------------------------------------------ */
/* Hook text (cold open, middle third, readable with the sound off)    */
/* ------------------------------------------------------------------ */

export const HookText: React.FC<{ f: number; out: number }> = ({ f, out }) => {
  if (f > out + 8) return null;
  const o = 1 - ramp(f, out - 6, out + 8, "in");
  const settle = track(f, [[0, 1.04], [10, 1.0, "out"]]); // visible on frame 0, settles in place
  const b = ramp(f, CUES.eyeOpen - 4, CUES.eyeOpen + 8, "out");
  const pop = track(f - CUES.eyeOpen, [[-4, 0.8], [4, 1.06, "out"], [10, 1, "io"]]);
  return (
    <div style={{ position: "absolute", left: 0, top: 690, width: 1080, textAlign: "center", opacity: o }}>
      <div
        style={{
          fontFamily: ROZHA,
          fontSize: 92,
          lineHeight: 1.1,
          color: "#F6EBD6",
          transform: `scale(${settle})`,
          textShadow: "0 0 26px rgba(10,14,40,0.9), 0 5px 0 #0E0A1C",
        }}
      >
        पर्वत डूब रहा था...
      </div>
      <div
        style={{
          fontFamily: ROZHA,
          fontSize: 112,
          lineHeight: 1.15,
          marginTop: 10,
          color: "#FFD36B",
          opacity: b,
          transform: `scale(${pop})`,
          textShadow: "0 0 34px rgba(255,201,77,0.6), 0 6px 0 #4A2A08",
        }}
      >
        फिर नीचे कुछ जागा
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Title card (Episode 1's layout, Episode 3's name)                   */
/* ------------------------------------------------------------------ */

export const TitleCard3: React.FC<{ f: number; at: number; out: number }> = ({ f, at, out }) => {
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
        EPISODE 3 · <span style={{ fontFamily: ROZHA, fontWeight: 400, fontSize: 48 }}>कूर्म</span> · KURMA
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Captions (Episode 1's box and colours; timed from timing.ts)        */
/* ------------------------------------------------------------------ */

type Who = "n" | "i" | "v" | "s" | "b" | "k";
type Cap = { from: number; to: number; text: string; who: Who; hi?: string[] };
const WHO: Record<Who, string> = { n: "#FFF6E4", i: "#BFE0FF", v: "#FFE08A", s: "#D9C6FF", b: "#FFB3A0", k: "#A8F0D8" };

const ln = (k: string) => LINES[k];
/** A line split into parts at cue frames: [[text, hi], ...] with the split frames between them. */
const split = (key: string, who: Who, parts: [string, string[]][], at: number[] = []): Cap[] => {
  const [a, b] = ln(key);
  const edges = [a, ...at, b];
  return parts.map(([text, hi], i) => ({ from: edges[i], to: edges[i + 1], text, who, hi }));
};

export const CAPS3: Cap[] = [
  // 01 is covered by the hook text
  ...split("02_indra", "i", [["Parvat... ruk gaya!", ["ruk", "gaya!"]]]),
  ...split(
    "03_narrator",
    "n",
    [
      ["Mandarachal ke neeche ek laakh yojan ka kavach ubhra.", ["kavach"]],
      ["Swayam Vishnu ne Kurma roop liya...", ["Vishnu", "Kurma"]],
      ["...aur poora parvat apni peeth par thaam liya.", ["thaam"]],
    ],
    [CUES.cap03b, CUES.cap03c],
  ),
  ...split("04_vishnu", "v", [["Matho. Jab tak amrit na nikle...", ["Matho.", "amrit"]], ["...yeh parvat nahi doobega.", ["doobega."]]], [CUES.cap04b]),
  ...split("05_bali", "b", [["Asuro! Poori shakti se kheencho!", ["shakti"]]]),
  ...split(
    "06_narrator",
    "n",
    [
      ["Manthan phir shuru hua.", ["Manthan"]],
      ["Par har khinchaav ke saath...", []],
      ["...Vasuki ki saansein garam hone lagin.", ["Vasuki", "garam"]],
    ],
    [CUES.cap06b, CUES.vasukiLook],
  ),
  ...split("07_vasuki", "k", [["Dheere... meri saanson mein aag hai...", ["aag"]]]),
  ...split("08_swarbhanu", "s", [["Aankhein jal rahi hain...", ["jal"]], ["Yeh dhuaan sirf hamari taraf kyun aa raha hai?", ["sirf", "hamari"]]], [CUES.cap08b]),
  ...split(
    "09_narrator",
    "n",
    [
      ["Sir ki taraf zehreeli phunkaar thi.", ["zehreeli"]],
      ["Aur poonchh ki taraf?", ["poonchh"]],
      ["Devtaon par thande baadal baras rahe the.", ["thande", "baadal"]],
    ],
    [CUES.cap09b, CUES.cap09c],
  ),
  ...split("10_swarbhanu", "s", [["Toh isliye muskuraya tha woh...", ["muskuraya"]]]),
  ...split("11_bali", "b", [["Chhodna mat.", []], ["Amrit ke liye yeh aag bhi seh lenge.", ["Amrit", "aag"]]], [CUES.cap11b]),
  ...split("12_narrator", "n", [["Aur tabhi...", []], ["...amrit se pehle, saagar se kuch aur nikla.", ["kuch", "aur", "nikla."]]], [CUES.cap12b]),
  ...split("13_indra", "i", [["Yeh... Halahal hai.", ["Halahal"]]]),
  ...split("14_swarbhanu", "s", [["Yeh toh sabko jala dega...", ["jala"]], ["Devta bhi, asur bhi!", ["Devta", "asur"]]], [CUES.cap14b]),
  ...split("15_narrator", "n", [["Jis vish ki ek boond teenon lokon ko jala de...", ["vish"]], ["...use piyega kaun?", ["kaun?"]]], [CUES.cap15b]),
  // 16 and the sign-off play over the end card, which carries the same words
];

export const Captions3: React.FC<{ f: number; y?: number }> = ({ f, y = 1300 }) => {
  const c = CAPS3.find((k) => f >= k.from && f < k.to);
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
/* End card (Episode 1's layout + the Shani tie-in + www.jyotiq.ai)    */
/* ------------------------------------------------------------------ */

/** SVG layer of the end card: a small kundali whose Shani house lights up on "शनि". */
export const EndKundali3: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const t = f - at;
  if (t < 0) return null;
  const d = ramp(t, 4, 40, "io");
  const sh = ramp(f, CUES.shani - 4, CUES.shani + 10, "out");
  const pulse = 0.7 + 0.3 * Math.sin(f / 7);
  return (
    <g>
      <KundaliGrid f={f} cx={540} cy={800} size={250} d={d} glyphs={0} o={0.9} />
      {/* Shani glyph in the 10th house (karma bhava, of which Shani is a karaka): right-centre diamond */}
      <g opacity={sh}>
        <circle cx={540 + 62.5} cy={800} r={30} fill="#0C0A07" opacity={0.85} />
        <circle cx={540 + 62.5} cy={800} r={30} fill="#9FB4FF" opacity={0.25 * pulse} />
        <text x={540 + 62.5} y={814} textAnchor="middle" fontFamily={ROZHA} fontSize={40} fill="#C9D6FF" style={{ filter: `drop-shadow(0 0 ${10 * pulse}px #9FB4FF)` }}>
          श
        </text>
      </g>
    </g>
  );
};

export const EndCard3: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const t = f - at;
  if (t < 0) return null;
  const a = ramp(t, 0, 14, "out");
  const b = ramp(t, 14, 28, "out");
  const q = ramp(f, CUES.closeKundali - 6, CUES.closeKundali + 8, "out");
  const c = ramp(f, CUES.signoff - 10, CUES.signoff + 4, "out");
  const d = ramp(f, CUES.offer - 6, CUES.offer + 8, "out");
  const glow = 0.5 + 0.5 * Math.sin(t / 8);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ marginTop: 250, opacity: a, transform: `translateY(${(1 - a) * 30}px)`, textAlign: "center" }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 34, letterSpacing: 8, color: "#CDB8FF" }}>AGLA EPISODE</div>
        <div style={{ fontFamily: ROZHA, fontSize: 130, lineHeight: 1.05, color: "#FFD36B", textShadow: "0 0 30px rgba(255,201,77,0.5)" }}>नीलकंठ</div>
        <div style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 64, letterSpacing: 18, color: "#F6EBD6" }}>NEELKANTH</div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 600, fontSize: 34, color: "#F3DB9D", marginTop: 14 }}>Vish kaun piyega?</div>
      </div>
      <div style={{ position: "absolute", top: 980, width: 900, textAlign: "center", opacity: b }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 44, lineHeight: 1.25, color: "#FFF6E4" }}>
          Kurma avatar = <span style={{ color: "#FFC94D" }}>Shani</span> ka ansh.
        </div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 600, fontSize: 34, color: "#F3DB9D", marginTop: 10 }}>Bojh uthana sikhane wala graha.</div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 36, color: "#FFF6E4", marginTop: 18, opacity: q }}>
          Aapki <span style={{ color: "#FFC94D" }}>kundali</span> mein Shani aapko kis ghar se mazboot bana raha hai?
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
      <div style={{ position: "absolute", top: 1490, display: "flex", gap: 22, opacity: d, transform: `translateY(${(1 - d) * 24}px) scale(0.62)`, transformOrigin: "50% 0" }}>
        <PlayButton glow={glow} />
        <AppStoreButton glow={glow} />
      </div>
      <div style={{ position: "absolute", top: 1660, fontFamily: JAKARTA, fontWeight: 600, fontSize: 22, color: "rgba(243,219,157,0.6)", opacity: d }}>
        Guidance only, for entertainment and information.
      </div>
    </div>
  );
};
