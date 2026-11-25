import React from "react";
import { Img, staticFile } from "remotion";
import { JAKARTA, PLAYFAIR, ROZHA } from "../../manthan/graphics";
import { P, ramp, track } from "../../manthan/style";
import { EndBrand, EndTease, FeatureCard, GOLD_TXT } from "../shared/endD";
import { AppChip, AppPhone } from "../shared/phone";
import { Chip, ChipText, HookChip, HookPlate, QPill, SeriesTitle } from "../shared/titleD";
import { CUES, LINES } from "./timing";

/* Diwali Day 2 (छोटी दिवाली · यम का दीया) graphics, in Day 1's style. Retention layer:
   - the hook plate states the hook from frame 0 (sound-off): 'मृत्यु के देवता के लिए / दीया?'. 'दीया?' warms on the
     spoken 'दीया'; on 'यमराज' a compass chip swings and settles on दक्षिण (the yam diya faces south, Yama's
     direction); the '?' pops on 'क्यों'.
   - the title: पाँच दीये · DIN 2 · छोटी दिवाली.
   - 02: 'चौथी रात' with four crescent nights, the fourth one lit.
   - 05: Yamraj's words in gold, building with his voice, up to '...समय से पहले नहीं आता।'
   - 06: 'यम = काल = समय' builds word by word. 07: 'होरा = ग्रह का घंटा', the meaning first, then the name on 'होरा'.
   - Hinglish captions for 02, 03, 04, 06 and 07 (01 is the hook plate, 05 the gold words, 08 the phone and card).
   The feature card and the end card follow in this file. */

const cue = (k: string, dflt = 99999): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);
const DARK_TXT = "0 0 22px rgba(14,10,32,0.95), 0 5px 0 #0E0A1C";
const plate = (a: number) => `radial-gradient(ellipse at center, rgba(14,10,32,${a}) 0%, rgba(14,10,32,${a * 0.62}) 55%, rgba(14,10,32,0) 100%)`;

/** A small compass. `spin` 0 = the gold needle points down, to दक्षिण. */
const SouthIcon: React.FC<{ size: number; spin: number }> = ({ size, spin }) => (
  <svg width={size} height={size} viewBox="-12 -12 24 24" style={{ display: "block" }}>
    <circle r={10.6} fill="rgba(12,10,7,0.5)" stroke="#DFB15B" strokeWidth={1.4} />
    {[0, 90, 180, 270].map((a) => (
      <path key={a} d="M0 -10.6V-8.2" transform={`rotate(${a})`} stroke="#DFB15B" strokeWidth={1.3} />
    ))}
    <g transform={`rotate(${spin})`}>
      <path d="M0 9L2.5 0H-2.5Z" fill="#FFC94D" />
      <path d="M0 -9L2.5 0H-2.5Z" fill="#BFD0EE" opacity={0.7} />
      <circle r={1.5} fill="#FFF6E4" />
    </g>
  </svg>
);

const DownArrow: React.FC<{ f: number }> = ({ f }) => (
  <svg width={30} height={46} viewBox="0 0 30 46" style={{ display: "block", transform: `translateY(${Math.sin(f / 5) * 4}px)` }}>
    <path d="M15 5V37M5 27L15 39L25 27" stroke="#FFC94D" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Hook plate and title                                                */
/* ------------------------------------------------------------------ */

export const HookPlateD2: React.FC<{ f: number; out: number }> = ({ f, out }) => {
  const D = cue("diya01", 49);
  const Y = cue("yamraj01", 80);
  const K = cue("kyon01", 200);
  const glow = ramp(f, D - 2, D + 10, "out");
  const spin = track(f - Y, [[0, -80], [8, 20, "out"], [14, -7, "io"], [20, 0, "io"]]);
  return (
    <HookPlate
      f={f}
      out={out}
      l2Size={120}
      glow={glow}
      l1={
        <>
          <span style={{ color: "#C9D6F0" }}>मृत्यु</span> के देवता के लिए
        </>
      }
      l2="दीया?"
    >
      <HookChip f={f} at={Y}>
        <SouthIcon size={50} spin={spin} />
        <span style={{ fontFamily: ROZHA, fontSize: 54, color: "#FFF6E4" }}>दक्षिण दिशा</span>
        <DownArrow f={f} />
      </HookChip>
      <QPill f={f} at={K - 2} />
    </HookPlate>
  );
};

export const TitleCardD2: React.FC<{ f: number; at: number; out: number }> = ({ f, at, out }) => (
  <SeriesTitle f={f} at={at} out={out} din={2} hi="छोटी दिवाली" en="CHHOTI DIWALI" />
);

/* ------------------------------------------------------------------ */
/* Chips and word equations                                            */
/* ------------------------------------------------------------------ */

/** Four nights as crescents; the fourth (the night in the story) is lit gold. */
const Nights: React.FC<{ t: number }> = ({ t }) => (
  <svg width={132} height={40} viewBox="0 0 132 40" style={{ display: "block" }}>
    {[0, 1, 2, 3].map((i) => {
      const k = ramp(t, 2 + i * 3, 7 + i * 3, "out");
      const last = i === 3;
      return (
        <g key={i} transform={`translate(${20 + i * 31} 20) scale(${0.6 + 0.4 * k})`} opacity={k * (last ? 1 : 0.6)}>
          {last ? <circle r={16} fill="#FFC94D" opacity={0.28} /> : null}
          <path d="M6.9 -9.82A12 12 0 1 0 6.9 9.82A10 10 0 1 1 6.9 -9.82Z" fill={last ? "#FFD36B" : "#F6EBD6"} />
        </g>
      );
    })}
  </svg>
);

/** 02: 'चौथी रात' on 'चौथी', gone by the end of the line (before the cut to the lamps). */
export const ChauthiD2: React.FC<{ f: number; top?: number }> = ({ f, top = 300 }) => {
  const at = cue("chauthi02", 369) - 2;
  const r = LINES["02_narrator"];
  const out = (r ? r[1] : cue("mrityu02", 414) + 44) - 8;
  return (
    <Chip f={f} at={at} out={out} top={top}>
      <Nights t={f - at} />
      <ChipText gold size={54}>
        चौथी रात
      </ChipText>
    </Chip>
  );
};

/** 06: 'यम = काल = समय', each word as Kaal says it, over the turning Kaal wheel. Fully gone by `out`. */
export const YamaKaalD2: React.FC<{ f: number; out: number; top?: number }> = ({ f, out, top = 300 }) => {
  const r = LINES["06_narrator"];
  const Y = r ? r[0] + 2 : cue("kaal06", 1173) - 60;
  if (f < Y - 2 || f > out) return null;
  const o = 1 - ramp(f, out - 8, out, "in");
  const parts: [string, number, string][] = [
    ["यम", Y, "#C9D6F0"],
    ["काल", cue("kaal06", 1173), "#F6EBD6"],
    ["समय", cue("samay06", 1203), "#FFD36B"],
  ];
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ position: "absolute", left: 90, top: -50, width: 900, height: 240, borderRadius: 120, background: plate(0.8) }} />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 20 }}>
        {parts.map(([w, at, color], i) => {
          const k = ramp(f, at - 2, at + 5, "out");
          const pop = track(f - at + 2, [[0, 0.6], [6, 1.14, "out"], [10, 1, "io"]]);
          return (
            <React.Fragment key={i}>
              {i > 0 ? <span style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 64, color: P.jGoldLight, opacity: k }}>=</span> : null}
              <span style={{ fontFamily: ROZHA, fontSize: 96, lineHeight: 1.1, color, opacity: k, display: "inline-block", transform: `scale(${k > 0 ? pop : 0.6})`, textShadow: i === 2 ? GOLD_TXT : DARK_TXT }}>
                {w}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

/** 07: 'होरा = ग्रह का घंटा'. The meaning arrives on 'ग्रह', the name lands on 'होरा'. Gone just after `out`
    (the cut to the phone), before the rising phone reaches it. */
export const HoraEqD2: React.FC<{ f: number; out: number; top?: number }> = ({ f, out, top = 300 }) => {
  const G = cue("graha07", 1354);
  const H = cue("hora07", 1414);
  if (f < G - 2 || f > out + 6) return null;
  const o = 1 - ramp(f, out - 4, out + 6, "in");
  const g = ramp(f, G - 2, G + 6, "out");
  const h = ramp(f, H - 2, H + 5, "out");
  const hPop = track(f - H + 2, [[0, 0.6], [6, 1.16, "out"], [10, 1, "io"]]);
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ position: "absolute", left: 60, top: -50, width: 960, height: 240, borderRadius: 120, background: plate(0.8) }} />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 18 }}>
        <span style={{ fontFamily: ROZHA, fontSize: 104, lineHeight: 1.1, color: "#FFD36B", opacity: h, display: "inline-block", transform: `scale(${h > 0 ? hPop : 0.6})`, textShadow: GOLD_TXT }}>होरा</span>
        <span style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 64, color: P.jGoldLight, opacity: h }}>=</span>
        <span style={{ fontFamily: ROZHA, fontSize: 76, lineHeight: 1.1, color: "#F6EBD6", opacity: g, display: "inline-block", transform: `translateY(${(1 - g) * 14}px)`, textShadow: DARK_TXT }}>
          ग्रह का घंटा
        </span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 05: Yamraj's words build in gold with his voice                      */
/* ------------------------------------------------------------------ */

export const GoldWordsD2: React.FC<{ f: number; out: number; top?: number }> = ({ f, out, top = 1270 }) => {
  const A = cue("yama05", 881);
  if (f < A - 2 || f > out) return null;
  const o = 1 - ramp(f, out - 10, out, "in");
  const N = cue("naam05", 911);
  const B = cue("cap05b", 987);
  const S = cue("samay05", 1017);
  const NH = cue("nahi05", 1062);
  const a = ramp(f, A - 2, A + 8, "out");
  const nm = ramp(f, N - 2, N + 8, "out");
  const b = ramp(f, B - 2, B + 8, "out");
  const s = ramp(f, S - 2, S + 5, "out");
  const sPop = track(f - S + 2, [[0, 0.6], [6, 1.12, "out"], [10, 1, "io"]]);
  const n = ramp(f, NH - 2, NH + 5, "out");
  const nPop = track(f - NH + 2, [[0, 0.6], [6, 1.16, "out"], [10, 1, "io"]]);
  const glow = ramp(f, NH, NH + 10, "out");
  const small: React.CSSProperties = { position: "relative", fontFamily: ROZHA, fontSize: 54, lineHeight: 1.15, color: "#F6EBD6", whiteSpace: "nowrap", textShadow: DARK_TXT };
  const big = (k: number, pop: number, g: number): React.CSSProperties => ({
    fontFamily: ROZHA, fontSize: 104, lineHeight: 1.1, color: "#FFD36B", opacity: k, display: "inline-block", transform: `scale(${k > 0 ? pop : 0.6})`,
    textShadow: `0 0 ${30 + 30 * g}px rgba(255,201,77,${0.55 + 0.35 * g}), 0 6px 0 #4A2A08`,
  });
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
      <div style={{ position: "absolute", left: 40, top: -36, width: 1000, height: 340, borderRadius: 170, background: plate(0.72) }} />
      <div style={{ ...small, opacity: a }}>
        जहाँ मेरे{" "}
        <span style={{ color: nm > 0.5 ? "#FFD36B" : "#F6EBD6", textShadow: `0 0 ${20 * nm}px rgba(255,201,77,${0.6 * nm}), ${DARK_TXT}` }}>नाम का दीया</span> जलता है,
      </div>
      <div style={{ ...small, opacity: b, marginTop: 4 }}>वहाँ मैं</div>
      <div style={{ position: "relative", display: "flex", gap: 22, alignItems: "baseline", marginTop: 2, whiteSpace: "nowrap" }}>
        <span style={big(s, sPop, 0)}>समय से पहले</span>
        <span style={big(n, nPop, glow)}>नहीं</span>
        <span style={{ ...small, opacity: n }}>आता।</span>
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

// Splits without their own cue: 04's 'पर' sits about one word before 'रोशनी', and 07's 'एक' between 'घंटा' and 'ग्रह'.
const PAR04 = cue("roshni04") - 14;
const EK07 = Math.round((cue("ghanta07") + cue("graha07")) / 2);

export const CAPS_D2: Cap[] = [
  ...split("02_narrator", [["Katha hai Raja Him ke bete ki...", ["Raja", "Him"]], ["Vivah ki chauthi raat, uski mrityu likhi thi.", ["chauthi", "raat,", "mrityu"]]], [cue("cap02b")]),
  ...split("03_narrator", [["Patni ne darwaaze par sona-chaandi bichhaaya,", ["sona-chaandi"]], ["aur har kone mein diye jalaaye.", ["kone", "diye"]]], [cue("cap03b")]),
  ...split("04_narrator", [["Yamraj sarp bankar aaye...", ["Yamraj", "sarp"]], ["par roshni mein chaundhiya gaye,", ["roshni", "chaundhiya"]], ["aur bhor hote hi laut gaye.", ["bhor", "laut"]]], [PAR04, cue("cap04b")]),
  ...split("06_narrator", [["Yamraj ka ek naam hai Kaal... yaani samay.", ["Kaal...", "samay."]]]),
  ...split("07_narrator", [["Aur jyotish mein, samay ka har ghanta", ["jyotish", "ghanta"]], ["ek graha ka hota hai... Hora.", ["graha", "Hora."]]], [EK07]),
];

export const CaptionsD2: React.FC<{ f: number; y?: number }> = ({ f, y = 1500 }) => {
  const c = CAPS_D2.find((k) => f >= k.from && f < k.to);
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
/* 08: the real app on the phone, with a drawn Hora notification card  */
/* ------------------------------------------------------------------ */

/** A drawn notification (not app UI) that drops onto the phone top on 'नोटिफिकेशन'. The mantra appears as it is said. */
export const FeatureD2: React.FC<{ f: number; out: number }> = ({ f, out }) => {
  const M = cue("mantra08", 1525);
  const m = ramp(f, M - 2, M + 8, "out");
  return (
    <FeatureCard
      f={f}
      at={cue("notif08", 1510) - 2}
      out={out}
      icon="bell"
      title="मंगल होरा"
      line2={<span style={{ opacity: m, textShadow: `0 0 ${16 * m}px rgba(255,201,77,0.6)` }}>ॐ कुं कुजाय नमः</span>}
      x={130}
      y={380}
      w={820}
    />
  );
};

export const AppPhoneD2: React.FC<{ f: number; at: number; out: number }> = ({ f, at, out }) => (
  <AppPhone
    f={f}
    at={at}
    out={out}
    chip={<AppChip label="फ़्री होरा नोटिफिकेशन" />}
    chipAt={cue("free08", at + 140)}
    greeting="छोटी दिवाली की शुभकामनाएँ"
    greetAt={cue("cap08b", at + 155)}
  />
);

/* ------------------------------------------------------------------ */
/* End tease art: Tula (Libra) holding the Sun and the new moon        */
/* ------------------------------------------------------------------ */

/** Kartik Amavasya: the Sun and the new moon together in Tula. An svg group; (x, y) is the beam's pivot.
    sunDim 0..1 dims the Sun to its weakest (Tula is its sign of debilitation; Day 3's line 02). */
export const TulaMoonD2: React.FC<{ f: number; x: number; y: number; s?: number; sunDim?: number }> = ({ f, x, y, s = 1, sunDim = 0 }) => {
  const th = (3 * Math.sin(f / 40) * Math.PI) / 180;
  const ends = [-1, 1].map((d) => [d * 170 * Math.cos(th), d * 170 * Math.sin(th)] as const);
  const pan = (px: number, py: number, child: React.ReactNode, k: number) => (
    <g key={k} transform={`translate(${px} ${py})`}>
      <path d="M0 0L-58 120M0 0L58 120M0 0L0 112" stroke="#DFB15B" strokeWidth={2} opacity={0.8} />
      <g transform="translate(0 84)">{child}</g>
      <path d="M-64 120Q0 160 64 120Z" fill="#C8952E" stroke="#FFD36B" strokeWidth={2} />
    </g>
  );
  const sun = (
    <g>
      {Array.from({ length: 10 }, (_, i) => (
        <path key={i} d="M-3 -40L3 -40L0 -54Z" transform={`rotate(${i * 36 + f * 0.6})`} fill="#FFC94D" opacity={0.8 * (1 - 0.75 * sunDim)} />
      ))}
      <circle r={44} fill="#FFC94D" opacity={0.25 * (1 - 0.8 * sunDim)} />
      <circle r={32} fill="#FFB938" stroke="#FFE6A3" strokeWidth={2} />
      {sunDim > 0 ? <circle r={32} fill="#1A1430" opacity={0.55 * sunDim} /> : null}
    </g>
  );
  const moon = (
    <g>
      <circle r={44} fill="#BFD0EE" opacity={0.08} />
      <circle r={32} fill="#151B33" stroke="#C9D6F0" strokeWidth={2} />
      <path d="M-14 -27A32 32 0 0 0 -14 27" stroke="#E4ECFA" strokeWidth={2.5} fill="none" opacity={0.7} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[[-210, -90], [190, -120], [-120, -170], [240, 40], [-250, 60], [60, -200]].map(([sx, sy], i) => (
        <circle key={i} cx={sx} cy={sy} r={2.2} fill="#FFF3C4" opacity={0.35 + 0.35 * Math.sin(f / 9 + i * 1.7)} />
      ))}
      <path d="M0 -14L0 300M-90 300H90" stroke="#DFB15B" strokeWidth={8} strokeLinecap="round" />
      <path d="M-40 312H40" stroke="#8A5A12" strokeWidth={6} strokeLinecap="round" />
      <path d="M-176 0H176" stroke="#FFD36B" strokeWidth={9} strokeLinecap="round" transform={`rotate(${(th * 180) / Math.PI})`} />
      <circle r={14} fill="#FFD36B" stroke="#8A5A12" strokeWidth={2} />
      {pan(ends[0][0], ends[0][1], sun, 0)}
      {pan(ends[1][0], ends[1][1], moon, 1)}
      <text y={366} textAnchor="middle" fontFamily={ROZHA} fontSize={46} fill="#F3DB9D">
        तुला
      </text>
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* End card: tomorrow's question (TulaMoonD2 sits left, in the svg)    */
/* ------------------------------------------------------------------ */

export const EndTeaseD2: React.FC<{ f: number; at: number }> = ({ f, at }) => (
  <EndTease f={f} at={at} kicker="KAL · TEESRA DIYA" lines={["सबसे कम रोशनी की", "रात, सबसे बड़ा", "त्योहार क्यों?"]} sub="Diwali · Lakshmi Puja · Din 3" left={490} top={230} />
);

/** The series' corner bug, stronger than manthan/graphics BrandBug so the name reads on a phone. */
export const BrandBugD2: React.FC<{ o: number }> = ({ o }) => (
  <div style={{ position: "absolute", left: 30, top: 96, padding: "6px 22px 6px 10px", borderRadius: 44, background: "rgba(12,10,7,0.5)", display: "flex", alignItems: "center", gap: 12, opacity: o * 0.95 }}>
    <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: 86, height: 70, objectFit: "contain" }} />
    <div style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 40, color: P.jGoldLight, letterSpacing: 2 }}>Jyotiq</div>
  </div>
);

/** The ask under the brand block: send it to family tonight, and follow for the next diya. Ends above y 1670. */
export const EndShareD2: React.FC<{ f: number }> = ({ f }) => {
  const at = cue("offer", 1576) + 8;
  const t = f - at;
  if (t < 0) return null;
  const a = ramp(t, 0, 10, "out");
  const pop = track(t, [[0, 0.8], [7, 1.06, "out"], [11, 1, "io"]]);
  const lift = Math.sin(f / 7) * 3;
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: 1450, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: a, transform: `scale(${pop})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 30px 14px", borderRadius: 40, background: "#FFC94D", boxShadow: "0 0 30px rgba(255,201,77,0.45)" }}>
        <svg width={38} height={38} viewBox="-12 -12 24 24" style={{ display: "block", transform: `translateY(${-lift}px)` }}>
          <path d="M-10 -1L10 -9L4 10L-1 3Z" fill="#2A1604" />
          <path d="M-1 3L10 -9" stroke="#FFC94D" strokeWidth={1.4} />
        </svg>
        <span style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 34, color: "#2A1604", whiteSpace: "nowrap" }}>Aaj raat se pehle ghar walon ko bhejo</span>
      </div>
      <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 30, color: "#F3DB9D", whiteSpace: "nowrap" }}>Follow karo · kal teesra diya</div>
    </div>
  );
};

/** The comment prompt runs on two lines so the pill stays clear of the right rail. */
export const EndBrandD2: React.FC<{ f: number; at: number }> = ({ f, at }) => (
  <EndBrand
    f={f}
    at={at}
    offerAt={cue("offer", at + 45)}
    comment={
      <>
        Comment karo:
        <br />
        <span style={{ color: "#FFC94D" }}>Aapke ghar yam ka diya jalta hai?</span>
      </>
    }
  />
);
