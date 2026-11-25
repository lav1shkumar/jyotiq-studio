import React from "react";
import { Easing } from "remotion";
import { CREAM, GOLD_HI, ROZHA, ramp, s } from "./charanKit";
import { CaptionCard, HOLD } from "./charanCaptions";
import type { Card, Seg } from "./charanCaptions";

/* Ep3 captions, timed to the measured VO phrases. The words are the script the voice reads;
   `*word*` = gold. Times are VO seconds; line splits sit on measured word gaps where one exists. */
const L = (...segs: [string, number][]): Seg[] => segs.map(([t, at]) => ({ t, at: s(at) }));
const c = (from: number, to: number, ...lines: Seg[][]): Card => ({ from: s(from), to: s(to), lines });

export const CARDS3: Card[] = [
  c(0, 4.58, L(["शनि *सूर्य* के पास आए...", -0.25]), L(["तो *साढ़े साती* क्यों नहीं होती?", 2.32])),
  c(4.75, 7.9, L(["मैं *बृहत् पाराशर*", 4.85]), L(["*होरा शास्त्र* हूँ...", 6.45])),
  c(7.96, 10.7, L(["समझो,", 8.06]), L(["*ग्रहों की चाल* से।", 9.04])),
  c(10.95, 12.06, L(["*चंद्रमा*...", 11.05])),
  c(12.08, 14.62, L(["*सवा दो दिन* में", 12.16]), L(["राशि बदलता है।", 13.1])),
  c(14.66, 16.05, L(["सबसे *तेज़*।", 14.74])),
  c(16.18, 18.45, L(["*सूर्य*... ", 16.28], ["*एक महीना*।", 17.31])),
  c(18.5, 22.0, L(["*शनि*... ", 18.61], ["*ढाई वर्ष*।", 19.49]), L(["सबसे *धीमा*।", 20.69])),
  c(22.15, 24.75, L(["*चंद्रमा*...", 22.25]), L(["तुम्हारा *मन* है।", 23.28])),
  c(24.88, 27.35, L(["*शनि*...", 24.98]), L(["*कर्मों* का हिसाब।", 25.93])),
  c(27.5, 30.95, L(["और ज़्यादातर *गलतियाँ*...", 27.59]), L(["*मन* से ही शुरू होती हैं।", 29.26])),
  c(31.08, 34.0, L(["इसलिए जब सबसे *धीमा*", 31.18]), L(["*न्यायाधीश*...", 32.85])),
  c(34.05, 36.68, L(["सबसे *चंचल मन*", 34.13]), L(["के पास आता है...", 35.45])),
  c(36.78, 40.0, L(["तो वही समय...", 36.88]), L(["*साढ़े साती* कहलाता है।", 38.02])),
  c(40.18, 43.28, L(["तुम्हारी *चंद्र राशि* से", 40.27]), L(["शनि अभी कहाँ है?", 41.88])),
  { from: s(43.33), to: HOLD, lines: [L(["*Jyotiq* ऐप में देखो।", 43.42])] },
];

export const Captions3: React.FC<{ f: number }> = ({ f }) => (
  <>
    {CARDS3.map((card, i) => (
      <CaptionCard key={i} card={card} f={f} />
    ))}
  </>
);

/** Sound-off topic line on the hook (same place and style as Ep1/Ep2). */
export const TopicTitle: React.FC<{ f: number }> = ({ f }) => {
  const o = ramp(f, s(10.25), s(10.75), 1, 0, Easing.linear);
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 236,
        textAlign: "center",
        fontFamily: ROZHA,
        fontSize: 50,
        color: GOLD_HI,
        opacity: o,
        letterSpacing: 1,
        textShadow: "0 0 18px rgba(0,0,0,0.9), 0 2px 0 rgba(0,0,0,0.6)",
      }}
    >
      <span style={{ opacity: 0.7 }}>✦ </span>साढ़े साती चंद्रमा से ही क्यों?<span style={{ opacity: 0.7 }}> ✦</span>
    </div>
  );
};

/* How long each planet stays in one rashi: the line viewers screenshot. Built up as each is
   spoken through shots 3-4 (like Ep2's मन · तन · धन tracker), below the logo's band. */
const PLANETS = [
  { name: "चंद्रमा", value: "सवा 2 दिन", color: "#CFE0FF", at: 12.16, pulse: 14.74 }, // सबसे तेज़
  { name: "सूर्य", value: "1 महीना", color: "#FFC46B", at: 17.31, pulse: 0 },
  { name: "शनि", value: "2½ वर्ष", color: "#E6B45A", at: 19.49, pulse: 20.69 }, // सबसे धीमा
];
const TR_FROM = s(10.95);
const TR_TO = s(22.05);

export const SpeedTracker: React.FC<{ f: number }> = ({ f }) => {
  if (f < TR_FROM || f > TR_TO) return null;
  const vis = Math.min(ramp(f, TR_FROM, TR_FROM + 8, 0, 1, Easing.linear), ramp(f, TR_TO - 8, TR_TO, 1, 0, Easing.linear));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 336, display: "flex", justifyContent: "center", gap: 18, opacity: vis }}>
      {PLANETS.map((p) => {
        const lit = f >= s(p.at);
        const on = ramp(f, s(p.at), s(p.at) + 8, 0, 1, Easing.out(Easing.back(1.6)));
        const k = p.pulse ? Math.min(1, Math.max(0, (f - s(p.pulse)) / 16)) : 0;
        const pulse = Math.sin(Math.PI * k);
        return (
          <div
            key={p.name}
            style={{
              width: 290,
              padding: "12px 0 14px",
              borderRadius: 22,
              textAlign: "center",
              background: "rgba(8,5,22,0.55)",
              border: `1.5px solid ${lit ? `${p.color}99` : "rgba(255,246,226,0.16)"}`,
              boxShadow: lit ? `0 0 ${18 + 26 * pulse}px ${p.color}55` : "none",
              transform: `scale(${1 + 0.07 * pulse})`,
            }}
          >
            <div style={{ fontFamily: ROZHA, fontSize: 34, color: CREAM, opacity: lit ? 0.92 : 0.45, textShadow: "0 2px 0 rgba(0,0,0,0.6)" }}>{p.name}</div>
            <div
              style={{
                fontFamily: ROZHA,
                fontSize: 50,
                lineHeight: 1.15,
                minHeight: 58,
                color: p.color,
                opacity: Math.min(1, on),
                transform: `scale(${0.7 + 0.3 * on})`,
                textShadow: `0 0 20px ${p.color}88, 0 2px 0 rgba(0,0,0,0.6)`,
              }}
            >
              {p.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};
