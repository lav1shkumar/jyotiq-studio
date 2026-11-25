import React from "react";
import { JAKARTA, ROZHA } from "../../manthan/graphics";
import { ramp, track } from "../../manthan/style";
import { EndBrand, EndCelebrate, FeatureCard } from "../shared/endD";
import { AppChip, AppPhone } from "../shared/phone";
import { HookChip, HookPlate, QPill, SeriesTitle } from "../shared/titleD";
import { CUES, LINES } from "./timing";

/* Diwali Day 5 (भाई दूज · यम द्वितीया) graphics, in the series style (the shared titleD pieces). Retention layer:
   - the hook plate from frame 0 (sound-off): 'मृत्यु के देवता...' / 'बहन के घर खाने पे?', then the chip
     'यम द्वितीया' (with a drawn diya) on 'बहन' and the '?' on 'खाना';
   - the title: पाँच दीये · DIN 5 · भाई दूज;
   - 04: Yamraj's promise building as he speaks: 'आज जो भाई बहन के हाथ से', then 'तिलक लगवाएगा,' on 'तिलक'
     (तिलक in gold), 'उसे मेरा' on 'उसे' and 'भय नहीं रहेगा।' (glowing gold) on 'भय';
   - 05: the day's name: 'इसीलिए ये दिन कहलाया...', 'यम द्वितीया' with 'यम', then '→ भाई दूज' (big gold) with
     'भाई', just ahead of diya 5 lighting on 'दूज'.
   Captions, the language words, the phone and the finale end card follow in this file. */

const cue = (k: string, dflt = 99999): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);
const lineAt = (k: string, dflt: number): number => {
  const r = LINES[k];
  return r ? r[0] : dflt;
};
const DARK_TXT = "0 0 22px rgba(14,10,32,0.95), 0 5px 0 #0E0A1C";
const plate = (a: number) => `radial-gradient(ellipse at center, rgba(14,10,32,${a}) 0%, rgba(14,10,32,${a * 0.62}) 55%, rgba(14,10,32,0) 100%)`;
const goldShadow = (g: number) => `0 0 ${30 + 30 * g}px rgba(255,201,77,${0.55 + 0.35 * g}), 0 6px 0 #4A2A08`;
const popIn = (f: number, at: number) => {
  const k = ramp(f, at - 2, at + 5, "out");
  return { k, s: k > 0 ? track(f - at + 2, [[0, 0.6], [6, 1.14, "out"], [10, 1, "io"]]) : 0.6 };
};
// The 05 cues sit on 'द्वितीया' and 'दूज'. 'यम' and 'भाई' are spoken about one short word earlier, so their
// text leads the cue by that much (re-timed automatically once the real take sets the cues).
const YAM_LEAD = 8;
const BHAI_LEAD = 12;

/** A small drawn diya for the hook chip (drawn, so it needs no emoji font). */
const DiyaIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="-12 -12 24 24" style={{ display: "block" }}>
    <circle cx={0} cy={-4} r={7.5} fill="#FFC94D" opacity={0.22} />
    <path d="M0 -11.5C3.2 -7.5 3.4 -3.4 0 -0.8C-3.4 -3.4 -3.2 -7.5 0 -11.5Z" fill="#FFB43A" />
    <path d="M0 -7.4C1.5 -5.4 1.5 -3 0 -1.8C-1.5 -3 -1.5 -5.4 0 -7.4Z" fill="#FFF3C4" />
    <path d="M0 -0.8V1.8" stroke="#4A2A08" strokeWidth={1} />
    <path d="M-11 1.6H11C10 6.6 5.6 9.6 0 9.6C-5.6 9.6 -10 6.6 -11 1.6Z" fill="#B5652B" stroke="#FFD08A" strokeWidth={1} />
    <path d="M-8 3.8H8" stroke="#7A3A16" strokeWidth={1} opacity={0.6} />
  </svg>
);

/** A drawn arrow (the display fonts may not carry '→'). */
const Arrow: React.FC<{ w?: number }> = ({ w = 64 }) => (
  <svg width={w} height={w * 0.625} viewBox="0 0 64 40" style={{ display: "block" }}>
    <path d="M4 20H52M38 7L54 20L38 33" stroke="#FFE7A6" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Hook plate and title                                                */
/* ------------------------------------------------------------------ */

export const HookPlateD5: React.FC<{ f: number; out: number }> = ({ f, out }) => (
  <HookPlate f={f} out={out} l1="मृत्यु के देवता..." l2="बहन के घर खाने पे?">
    <QPill f={f} at={cue("khana01", 170) - 2} />
    <HookChip f={f} at={cue("behan01", 125)}>
      <DiyaIcon size={46} />
      <span style={{ fontFamily: ROZHA, fontSize: 50, color: "#FFD36B" }}>यम द्वितीया</span>
    </HookChip>
  </HookPlate>
);

export const TitleCardD5: React.FC<{ f: number; at: number; out: number }> = ({ f, at, out }) => (
  <SeriesTitle f={f} at={at} out={out} din={5} hi="भाई दूज" en="BHAI DOOJ" />
);

/* ------------------------------------------------------------------ */
/* 04: Yamraj's promise in gold                                         */
/* ------------------------------------------------------------------ */

/** Builds as he speaks: 'आज जो भाई बहन के हाथ से' from the line start, 'तिलक लगवाएगा,' on 'तिलक' (तिलक gold,
    with a small pulse), 'उसे मेरा' on 'उसे', then 'भय नहीं रहेगा।' glowing on 'भय'. Rows hold their places (opacity
    only), so nothing shifts. Gone by `out` with a short fade, so the last word stays readable to the cut. */
export const GoldWordsD5: React.FC<{ f: number; out: number; top?: number }> = ({ f, out, top = 1360 }) => {
  const A = cue("yama04", 645);
  if (f < A - 2 || f > out) return null;
  const T = cue("tilak04", 751);
  const B = cue("bhay04", 811);
  const o = 1 - ramp(f, out - 6, out, "in");
  const r1 = ramp(f, A - 2, A + 8, "out");
  const r2 = ramp(f, T - 2, T + 6, "out");
  const tPulse = Math.sin(Math.PI * ramp(f, T, T + 14, "io"));
  const w1 = popIn(f, cue("cap04b", 781));
  const w2 = popIn(f, B);
  const g = ramp(f, B + 4, B + 20, "io");
  const row: React.CSSProperties = { position: "relative", fontFamily: ROZHA, fontSize: 58, lineHeight: 1.15, color: "#F6EBD6", textShadow: DARK_TXT, whiteSpace: "nowrap" };
  const big: React.CSSProperties = { fontFamily: ROZHA, fontSize: 90, lineHeight: 1.1, color: "#FFD36B", display: "inline-block" };
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
      <div style={{ position: "absolute", left: 50, top: -40, width: 980, height: 320, borderRadius: 160, background: plate(0.72) }} />
      <div style={{ ...row, opacity: r1 }}>आज जो भाई बहन के हाथ से</div>
      <div style={{ ...row, opacity: r2, transform: `translateY(${(1 - r2) * 14}px)` }}>
        <span style={{ display: "inline-block", color: "#FFD36B", transform: `scale(${1 + 0.08 * tPulse})`, textShadow: goldShadow(tPulse) }}>तिलक</span> लगवाएगा,
      </div>
      <div style={{ position: "relative", display: "flex", gap: 22, alignItems: "baseline", marginTop: 6, whiteSpace: "nowrap" }}>
        <span style={{ ...big, fontSize: 74, color: "#F3DB9D", opacity: w1.k, transform: `scale(${w1.s})`, textShadow: goldShadow(0) }}>उसे मेरा</span>
        <span style={{ ...big, opacity: w2.k, transform: `scale(${w2.s})`, textShadow: goldShadow(g) }}>भय नहीं रहेगा।</span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 05: the day's name                                                   */
/* ------------------------------------------------------------------ */

/** 'इसीलिए ये दिन कहलाया...' from the line start (so the scene's first seconds are not empty), 'यम द्वितीया' with
    'यम', then the arrow and 'भाई दूज' (big, glowing gold) with 'भाई'; the earlier rows dim as it lands. A spacer
    the arrow's width keeps 'भाई दूज' centred. Gone by `out`. Check against the diya row in the stills. */
export const NameWordsD5: React.FC<{ f: number; out: number; top?: number }> = ({ f, out, top = 600 }) => {
  const A = lineAt("05_narrator", 859);
  if (f < A - 2 || f > out) return null;
  const J = cue("dooj05", 965);
  const o = 1 - ramp(f, out - 8, out, "in");
  const a = ramp(f, A - 2, A + 8, "out");
  const w1 = popIn(f, cue("dwitiya05", 935) - YAM_LEAD);
  const w2 = popIn(f, J - BHAI_LEAD);
  const g = ramp(f, J - 4, J + 14, "io");
  const dim = 1 - 0.35 * ramp(f, J - BHAI_LEAD, J - BHAI_LEAD + 8, "io");
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
      <div style={{ position: "absolute", left: 90, top: -50, width: 900, height: 340, borderRadius: 170, background: plate(0.6) }} />
      <div style={{ position: "relative", fontFamily: ROZHA, fontSize: 50, lineHeight: 1.15, color: "#F6EBD6", opacity: a * dim, textShadow: DARK_TXT }}>इसीलिए ये दिन कहलाया...</div>
      <div style={{ position: "relative", marginTop: 6, fontFamily: ROZHA, fontSize: 76, lineHeight: 1.12, color: "#F3DB9D", opacity: w1.k * dim, transform: `scale(${w1.s})`, textShadow: goldShadow(0) }}>यम द्वितीया</div>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 18, opacity: w2.k, transform: `scale(${w2.s})` }}>
        <Arrow />
        <span style={{ fontFamily: ROZHA, fontSize: 116, lineHeight: 1.05, color: "#FFD36B", textShadow: goldShadow(g) }}>भाई दूज</span>
        <div style={{ width: 64 }} />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Captions (Day 1's box and colours; Hinglish as in the series)       */
/* ------------------------------------------------------------------ */

type Cap = { from: number; to: number; text: string; hi?: string[] };

const split = (key: string, parts: [string, string[]][], at: number[] = []): Cap[] => {
  const r = LINES[key];
  if (!r) return [];
  const edges = [r[0], ...at, r[1]];
  return parts.map(([text, hi], i) => ({ from: edges[i], to: edges[i + 1], text, hi }));
};

// A split without its own cue: 02's 'भाई' comes about two short words after 'बरसों' ('बरसों से').
const BHAI02 = cue("barson02", 261) + 28;
const L06 = LINES["06_narrator"];

export const CAPS_D5: Cap[] = [
  // 01 is the hook plate, 04 the gold words, 05 the name words, 06's names the map labels, 07 the language words,
  // 08 the phone and the card
  ...split("02_narrator", [["Yamuna, barson se", ["Yamuna,"]], ["bhai Yam ko bulaati rahin...", ["Yam"]], ["par Yam hamesha vyast.", ["Yam", "vyast."]]], [BHAI02, cue("cap02b", 367)]),
  ...split("03_narrator", [["Yam aaye, to Yamuna ne", ["Yam", "Yamuna"]], ["tilak lagaaya, aarti utaari,", ["tilak", "aarti"]], ["apne haath se khaana khilaaya.", ["khaana"]]], [cue("tilak03", 506), cue("cap03b", 566)]),
  // 06: only the lead-in, so sound-off viewers know why names pop on the map; it clears as 'भाऊबीज' lands
  ...(L06 ? [{ from: L06[0], to: cue("bhaubeej06", 1099) - 2, text: "Aur har bhasha mein iska apna naam:", hi: ["bhasha"] }] : []),
];

export const CaptionsD5: React.FC<{ f: number; y?: number }> = ({ f, y = 1500 }) => {
  const c = CAPS_D5.find((k) => f >= k.from && f < k.to);
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
/* 07: one festival, many languages                                     */
/* ------------------------------------------------------------------ */

// 'आपकी' is spoken one word before the 'अपनी' cue.
const APKI_LEAD = 14;

/** 'त्योहार एक,' (एक gold on 'एक') and 'भाषाएँ अनेक।' (अनेक glowing on 'अनेक') build big above the lamp arc. From
    'ज्योतिक़' they settle back while 'ज्योतिक़ भी बात करता है' and then 'आपकी अपनी भाषा में।' (gold, with 'आपकी')
    carry the feature into the phone shot. Rows hold their places (opacity only). Gone by `out`. */
export const LangWordsD5: React.FC<{ f: number; out: number; top?: number }> = ({ f, out, top = 690 }) => {
  const A = lineAt("07_narrator", 1207);
  if (f < A - 2 || f > out) return null;
  const E = cue("ek07", 1222);
  const N = cue("anek07", 1252);
  const J = cue("cap07b", 1267);
  const M = Math.round((E + N) / 2); // 'भाषाएँ'
  const o = 1 - ramp(f, out - 8, out, "in");
  const a1 = ramp(f, A - 2, A + 8, "out");
  const a2 = ramp(f, M - 2, M + 6, "out");
  const w1 = popIn(f, E);
  const w2 = popIn(f, N);
  const g = ramp(f, N + 2, N + 16, "io");
  const settle = 1 - 0.3 * ramp(f, J + 16, J + 30, "io");
  const a3 = ramp(f, J - 2, J + 8, "out");
  const w3 = popIn(f, cue("apni07", 1358) - APKI_LEAD);
  const cream: React.CSSProperties = { fontFamily: ROZHA, fontSize: 80, lineHeight: 1.1, color: "#F6EBD6", textShadow: DARK_TXT };
  const gold: React.CSSProperties = { fontFamily: ROZHA, fontSize: 100, lineHeight: 1.1, color: "#FFD36B", display: "inline-block" };
  const rowS: React.CSSProperties = { position: "relative", display: "flex", gap: 22, alignItems: "baseline", opacity: settle, whiteSpace: "nowrap" };
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
      <div style={{ position: "absolute", left: 60, top: -44, width: 960, height: 470, borderRadius: 200, background: plate(0.62) }} />
      <div style={rowS}>
        <span style={{ ...cream, opacity: a1 }}>त्योहार</span>
        <span style={{ ...gold, opacity: w1.k, transform: `scale(${w1.s})`, textShadow: goldShadow(0) }}>एक,</span>
      </div>
      <div style={rowS}>
        <span style={{ ...cream, opacity: a2 }}>भाषाएँ</span>
        <span style={{ ...gold, opacity: w2.k, transform: `scale(${w2.s})`, textShadow: goldShadow(g) }}>अनेक।</span>
      </div>
      <div style={{ position: "relative", marginTop: 18, fontFamily: ROZHA, fontSize: 54, lineHeight: 1.15, color: "#F6EBD6", opacity: a3, textShadow: DARK_TXT, whiteSpace: "nowrap" }}>
        <span style={{ color: "#FFD36B" }}>ज्योतिक़</span> भी बात करता है
      </div>
      <div style={{ position: "relative", fontFamily: ROZHA, fontSize: 78, lineHeight: 1.1, color: "#FFD36B", opacity: w3.k, transform: `scale(${w3.s})`, textShadow: goldShadow(w3.k), whiteSpace: "nowrap" }}>आपकी अपनी भाषा में।</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 08: the real app on the phone, with a drawn language card            */
/* ------------------------------------------------------------------ */

// Each language in its own script. Rozha carries Devanagari only, so Gurmukhi and Gujarati fall back to system fonts.
const SCRIPT_FONT = `${ROZHA}, "Gurmukhi Sangam MN", "Gurmukhi MN", "Gujarati Sangam MN", "Gujarati MN", "Noto Sans Gurmukhi", "Noto Sans Gujarati", sans-serif`;
const LANGS: { cue: string; dflt: number; label: string; latin?: boolean }[] = [
  { cue: "hindi08", dflt: 1406, label: "हिंदी" },
  { cue: "punjabi08", dflt: 1421, label: "ਪੰਜਾਬੀ" },
  { cue: "gujarati08", dflt: 1436, label: "ગુજરાતી" },
  { cue: "marathi08", dflt: 1451, label: "मराठी" },
  { cue: "english08", dflt: 1466, label: "English", latin: true },
];

/** The card's second line: each language pops as it is spoken, in its own script. Scaled chips keep their layout
    space, so nothing reflows as they pop. */
const LangChips: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 10px", marginTop: 6 }}>
    {LANGS.map((l) => {
      const p = popIn(f, cue(l.cue, l.dflt));
      return (
        <span
          key={l.cue}
          style={{ display: "inline-block", opacity: p.k, transform: `scale(${p.s})`, padding: "2px 14px 4px", borderRadius: 999, background: "rgba(255,201,77,0.16)", border: "1.5px solid rgba(255,201,77,0.75)", fontFamily: l.latin ? JAKARTA : SCRIPT_FONT, fontWeight: l.latin ? 800 : undefined, fontSize: l.latin ? 30 : 34, lineHeight: 1.25, color: "#FFF6E4" }}
        >
          {l.label}
        </span>
      );
    })}
  </div>
);

/** A drawn card (not app UI) that drops in just before 'हिंदी'. The title is on-screen only: 'अपनी भाषा में पूछिए'
    echoes the sign-off 'ज्योतिक़ से पूछिए'. No count of languages is shown (the app's list is still to be confirmed). */
export const FeatureD5: React.FC<{ f: number; out: number }> = ({ f, out }) => (
  <FeatureCard f={f} at={cue("hindi08", 1406) - 6} out={out} icon="lang" title="अपनी भाषा में पूछिए" line2={<LangChips f={f} />} x={130} y={380} w={820} />
);

/** Day 5 has no 'फ़्री' in 08, so the chip claims only the language and lands on 'बात कीजिए', after the last name. */
export const AppPhoneD5: React.FC<{ f: number; at: number; out: number }> = ({ f, at, out }) => (
  <AppPhone
    f={f}
    at={at}
    out={out}
    chip={<AppChip label="आपकी भाषा में" />}
    chipAt={cue("english08", at + 63) + 20}
    greeting="भाई दूज की हार्दिक शुभकामनाएँ"
    greetAt={cue("cap08b", at + 124)}
  />
);

/* ------------------------------------------------------------------ */
/* Finale end card: all five diyas lit (the RowLayer celebrates in svg) */
/* ------------------------------------------------------------------ */

export const EndCelebrateD5: React.FC<{ f: number; at: number }> = ({ f, at }) => <EndCelebrate f={f} at={at} />;

/** The comment prompt runs on two lines so the pill stays clear of the right rail. It asks for the viewer's own name
    for the day, which invites comments in every language. */
export const EndBrandD5: React.FC<{ f: number; at: number }> = ({ f, at }) => (
  <EndBrand
    f={f}
    at={at}
    offerAt={cue("offer", at + 45)}
    comment={
      <>
        Comment karo:
        <br />
        <span style={{ color: "#FFC94D" }}>Aapke yahan ise kya kehte hain?</span>
      </>
    }
  />
);
