import React from "react";
import { Easing } from "remotion";
import { GOLD_HI, ROZHA, ramp, s } from "./charanKit";
import { CaptionCard, HOLD } from "./charanCaptions";
import type { Card, Seg } from "./charanCaptions";

/* Ep4 captions, timed to the measured VO phrases (pause map + energy contours). The words are the
   script the voice reads (Whisper confirmed it, original line 10); `*word*` = gold. Times are VO seconds. */
const L = (...segs: [string, number][]): Seg[] => segs.map(([t, at]) => ({ t, at: s(at) }));
const c = (from: number, to: number, ...lines: Seg[][]): Card => ({ from: s(from), to: s(to), lines });

export const CARDS4: Card[] = [
  c(0, 3.66, L(["लोग कहते हैं...", -0.25]), L(["शनि देव जी *दंड* देते हैं।", 1.72])),
  c(4.36, 7.6, L(["मैं *बृहत् पाराशर*", 4.46]), L(["*होरा शास्त्र* हूँ...", 6.06])),
  c(7.66, 9.3, L(["*कथा* सुनिए।", 7.76])),
  c(9.35, 11.6, L(["राजा *हरिश्चंद्र* जी का...", 9.45])),
  c(11.66, 15.2, L(["*राज्य* चला गया,", 11.76]), L(["*परिवार* बिछड़ गया।", 13.35])),
  c(15.3, 18.75, L(["मान्यता है...", 15.39]), L(["उन पर *साढ़ेसाती* चल रही थी।", 16.65])),
  c(19.28, 22.95, L(["एक दिन रानी जी...", 19.38]), L(["अपने *पुत्र* का शव लेकर आईं।", 20.88])),
  c(23.42, 25.95, L(["राजा हरिश्चंद्र जी ने", 23.53]), L(["*शुल्क* माँगा...", 24.98])),
  c(26.28, 29.05, L(["रानी जी ने अपनी", 26.4]), L(["*आधी साड़ी* दे दी।", 27.38])),
  c(29.35, 31.12, L(["अपने *पुत्र* के लिए भी...", 29.47])),
  c(31.18, 34.7, L(["राजा हरिश्चंद्र जी ने", 31.31]), L(["अपना *कर्तव्य* नहीं छोड़ा।", 32.84])),
  c(34.95, 37.28, L(["उसी क्षण *परीक्षा* पूरी हुई...", 35.07])),
  c(37.38, 39.42, L(["और *सब कुछ लौट आया*।", 37.49])),
  c(39.55, 43.3, L(["जो *कष्ट* मिला...", 39.65]), L(["वह उनके *कर्मों का हिसाब* था।", 41.08])),
  c(43.95, 46.35, L(["आपकी *साढ़ेसाती*", 44.05]), L(["कब शुरू होगी?", 45.48])),
  { from: s(46.52), to: HOLD, lines: [L(["*Jyotiq* ऐप से पूछिए।", 46.64])] },
];

export const Captions4: React.FC<{ f: number }> = ({ f }) => (
  <>
    {CARDS4.map((card, i) => (
      <CaptionCard key={i} card={card} f={f} />
    ))}
  </>
);

const titleStyle = (opacity: number): React.CSSProperties => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 236,
  textAlign: "center",
  fontFamily: ROZHA,
  fontSize: 50,
  color: GOLD_HI,
  opacity,
  letterSpacing: 1,
  textShadow: "0 0 18px rgba(0,0,0,0.9), 0 2px 0 rgba(0,0,0,0.6)",
});

/** Sound-off lines (same place and style as Ep1-3): the hook question, then the story's name over the palace. */
export const TopicTitle4: React.FC<{ f: number }> = ({ f }) => {
  const a = ramp(f, s(8.15), s(8.6), 1, 0, Easing.linear);
  const b = Math.min(ramp(f, s(8.45), s(8.95), 0, 1, Easing.linear), ramp(f, s(11.35), s(11.8), 1, 0, Easing.linear));
  return (
    <>
      {a > 0 ? (
        <div style={titleStyle(a)}>
          <span style={{ opacity: 0.7 }}>✦ </span>क्या शनि सच में दंड देते हैं?<span style={{ opacity: 0.7 }}> ✦</span>
        </div>
      ) : null}
      {b > 0 ? (
        <div style={titleStyle(b)}>
          <span style={{ opacity: 0.7 }}>✦ </span>राजा हरिश्चंद्र की कथा<span style={{ opacity: 0.7 }}> ✦</span>
        </div>
      ) : null}
    </>
  );
};
