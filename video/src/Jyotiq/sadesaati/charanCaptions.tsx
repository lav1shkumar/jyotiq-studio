import React from "react";
import { Easing } from "remotion";
import { CREAM, GOLD, GOLD_HI, ROZHA, ramp, s } from "./charanKit";

/* Captions for Ep2, timed to the real VO pauses (public/sadesaati-charan/phrases.json).
   Text follows what the voice actually says. `*word*` = gold. Times are VO seconds. */
export type Seg = { t: string; at: number };
export type Card = { from: number; to: number; lines: Seg[][] };

const L = (...segs: [string, number][]): Seg[] => segs.map(([t, at]) => ({ t, at: s(at) }));
const c = (from: number, to: number, ...lines: Seg[][]): Card => ({ from: s(from), to: s(to), lines });

export const HOLD = 1e6; // a card with this `to` stays up until the end

export const CARDS: Card[] = [
  c(0, 5.5, L(["शनि देव...", 0.1]), L(["लगभग *तीस वर्षों* के चक्र के बाद...", 1.96])),
  c(5.55, 9.85, L(["फिर *लौटते* हैं... तुम्हारे", 5.6]), L(["जीवन का *लेखा* देखने।", 7.4])),
  c(10.2, 13.9, L(["मैं हूँ...", 10.25]), L(["*बृहत् पाराशर होरा शास्त्र*।", 11.5])),
  c(14.4, 15.6, L(["और सुनो...", 14.44])),
  c(15.7, 21.6, L(["*साढ़े साती* के ये साढ़े सात वर्ष...", 15.78]), L(["कभी भी... ", 18.94], ["*एक जैसे नहीं* होते।", 20.05])),
  c(22.0, 24.5, L(["पहला चरण... ", 22.08], ["*मन* का।", 23.31])),
  c(24.6, 28.5, L(["ज़िम्मेदारियों की *चिंता*...", 24.67]), L(["मन पर बढ़ता *बोझ*...", 26.73])),
  c(28.6, 31.6, L(["जैसे *बेटी के विवाह* की चिंता।", 28.69])),
  c(31.8, 34.3, L(["दूसरा चरण... ", 31.86], ["*तन* का।", 33.32])),
  c(34.35, 38.5, L(["*भाग-दौड़*...", 34.43]), L(["*थकान* और *सेहत* की परीक्षा...", 35.74])),
  c(38.6, 44.4, L(["जैसे *वर्क फ्रॉम होम* का समाप्त होना...", 38.66]), L(["और हर दिन ", 41.4], ["*लंबा सफ़र* शुरू होना।", 42.48])),
  c(44.6, 47.8, L(["तीसरा चरण... ", 44.7], ["*धन* और *परिवार* का।", 45.89])),
  c(47.95, 52.4, L(["*नए घर* की ज़िम्मेदारी...", 48.01]), L(["*माता-पिता* की सेवा का दायित्व।", 49.98])),
  c(52.55, 56.3, L(["हर चरण में...", 52.63]), L(["*ज़िम्मेदारियाँ* बढ़ती हैं।", 54.22])),
  c(56.4, 60.0, L(["लेकिन उनका *भार*...", 56.47]), L(["कितना भारी होगा...", 58.39])),
  c(60.1, 64.85, L(["ये तुम्हारी *जन्म कुंडली*...", 60.17]), L(["और तुम्हारी चल रही *दशा* तय करती हैं।", 62.15])),
  // Not spoken in this take: shown on screen over the Jyotiq ending.
  { from: s(65.2), to: HOLD, lines: [L(["तुम किस *चरण* में हो?", 65.2]), L(["*Jyotiq* ऐप से पूछो।", 67.6])] },
];

const Rich: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split("*").map((p, i) =>
      i % 2 ? (
        <span key={i} style={{ color: GOLD_HI }}>
          {p}
        </span>
      ) : (
        <React.Fragment key={i}>{p}</React.Fragment>
      ),
    )}
  </>
);

/** Ep1 caption style: heavy cream Devanagari, gold underline drawn in, segments fade up. */
export const CaptionCard: React.FC<{ card: Card; f: number }> = ({ card, f }) => {
  if (f < card.from - 1 || f > card.to) return null;
  const out = card.to === HOLD ? 1 : ramp(f, card.to - 5, card.to, 1, 0, Easing.linear);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, bottom: 420, textAlign: "center", opacity: out, textWrap: "balance" }}>
      {card.lines.map((line, li) => {
        const draw = ramp(f, line[0].at + 2, line[0].at + 14, 0, 1, Easing.out(Easing.cubic));
        return (
          <div key={li} style={{ marginTop: li ? 6 : 0 }}>
            <span
              style={{
                fontFamily: ROZHA,
                fontSize: 70,
                lineHeight: 1.28,
                color: CREAM,
                textShadow: "0 3px 0 rgba(0,0,0,0.55), 0 0 26px rgba(0,0,0,0.85)",
                paddingBottom: 12,
                backgroundImage: `linear-gradient(to top, ${GOLD} 0px, ${GOLD} 7px, rgba(20,10,0,0.7) 7px, rgba(20,10,0,0.7) 10px, transparent 10px)`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left bottom",
                backgroundSize: `${draw * 100}% 100%`,
                WebkitBoxDecorationBreak: "clone",
                boxDecorationBreak: "clone",
              }}
            >
              {line.map((seg, si) => {
                const a = ramp(f, seg.at, seg.at + 5, 0, 1, Easing.out(Easing.cubic));
                return (
                  <span
                    key={si}
                    style={{ opacity: a, display: "inline-block", transform: `translateY(${(1 - a) * 16}px)`, filter: `blur(${(1 - a) * 6}px)`, whiteSpace: "pre-wrap" }}
                  >
                    <Rich text={seg.t} />
                  </span>
                );
              })}
            </span>
          </div>
        );
      })}
    </div>
  );
};
