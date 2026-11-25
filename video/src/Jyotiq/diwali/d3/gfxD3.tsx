import React from "react";
import { Img, staticFile } from "remotion";
import { JAKARTA, PLAYFAIR, ROZHA } from "../../manthan/graphics";
import { P, ramp, track } from "../../manthan/style";
import { EndBrand, EndTease, FeatureCard } from "../shared/endD";
import { AppChip, AppPhone } from "../shared/phone";
import { Chip, ChipText, HookChip, HookPlate, QPill, SeriesTitle } from "../shared/titleD";
import { CUES, LINES, SCENES } from "./timing";

/* Diwali Day 3 (दिवाली · लक्ष्मी पूजा) graphics, in the series style (the shared titleD pieces). Retention layer:
   - the hook plate from frame 0 (sound-off): 'सबसे कम रोशनी की रात...' / 'सबसे बड़ा त्योहार?', with a new-moon chip
     'अमावस्या' on 'रोशनी', a Sun chip 'तुला' on 'और', and the '?' on 'क्यों'. The icons are drawn, not emoji;
   - the title: पाँच दीये · DIN 3 · दिवाली;
   - 02: 'चंद्र: अमावस्या' once the title has cleared, then 'सूर्य: तुला · नीच' on 'तुला'; 06: 'दशा = जीवन का दौर'.
   Gold words, captions, the dasha card, the phone and the end card follow in this file. */

const cue = (k: string, dflt = 99999): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);

const NewMoonIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="-12 -12 24 24" style={{ display: "block" }}>
    <circle r={10} fill="#151B33" stroke="#C9D6F0" strokeWidth={1.6} />
    <path d="M-4.5 -8.6A10 10 0 0 0 -4.5 8.6" stroke="#E4ECFA" strokeWidth={1.4} fill="none" opacity={0.7} />
  </svg>
);

const SunIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="-12 -12 24 24" style={{ display: "block" }}>
    {Array.from({ length: 8 }, (_, i) => (
      <path key={i} d="M-1.2 -11L1.2 -11L0 -8Z" transform={`rotate(${i * 45})`} fill="#FFC94D" />
    ))}
    <circle r={6.5} fill="#FFB938" stroke="#FFE6A3" strokeWidth={1} />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Hook plate and title                                                */
/* ------------------------------------------------------------------ */

export const HookPlateD3: React.FC<{ f: number; out: number }> = ({ f, out }) => (
  <HookPlate
    f={f}
    out={out}
    top={700}
    l2Size={128}
    glow={ramp(f, cue("bada01", 114) - 2, cue("bada01", 114) + 8, "out")}
    l1={
      <>
        <span style={{ color: "#C9D6F0" }}>सबसे कम रोशनी</span> की रात...
      </>
    }
    l2="सबसे बड़ा त्योहार?"
  >
    <HookChip f={f} at={cue("roshni01", 34)}>
      <NewMoonIcon size={46} />
      <span style={{ fontFamily: ROZHA, fontSize: 54, color: "#FFF6E4" }}>अमावस्या</span>
    </HookChip>
    <HookChip f={f} at={cue("cap01b", 80)}>
      <SunIcon size={46} />
      <span style={{ fontFamily: ROZHA, fontSize: 54, color: "#FFF6E4" }}>तुला</span>
    </HookChip>
    <QPill f={f} at={cue("kyon01", 170) - 2} />
  </HookPlate>
);

export const TitleCardD3: React.FC<{ f: number; at: number; out: number }> = ({ f, at, out }) => (
  <SeriesTitle f={f} at={at} out={out} din={3} hi="दिवाली" en="DIWALI" />
);

/* ------------------------------------------------------------------ */
/* Chips                                                               */
/* ------------------------------------------------------------------ */

/** 02: the Moon chip once the title has cleared (both sit at top 300), then the Sun chip on 'तुला'. */
export const SkyChipsD3: React.FC<{ f: number; top?: number }> = ({ f, top = 300 }) => {
  const AM = cue("amavasya02", 203);
  const C2 = cue("cap02b", 279);
  const TU = cue("tula02", 309);
  const [, end] = SCENES.sky;
  return (
    <>
      <Chip f={f} at={AM + 34} out={C2 + 8} top={top} border="rgba(201,214,240,0.9)">
        <NewMoonIcon size={40} />
        <ChipText>चंद्र:</ChipText>
        <ChipText gold>अमावस्या</ChipText>
      </Chip>
      <Chip f={f} at={TU - 2} out={end - 10} top={top}>
        <SunIcon size={40} />
        <ChipText>सूर्य:</ChipText>
        <ChipText gold>तुला · नीच</ChipText>
      </Chip>
    </>
  );
};

/** 06: 'दशा = जीवन का दौर' on 'दौर', gone before the cut to dawn. */
export const DashaChipD3: React.FC<{ f: number; top?: number }> = ({ f, top = 300 }) => {
  const [, end] = SCENES.dasha;
  return (
    <Chip f={f} at={cue("daur06", 1219) - 2} out={end - 10} top={top}>
      <ChipText gold>दशा</ChipText>
      <ChipText>= जीवन का दौर</ChipText>
    </Chip>
  );
};

/* ------------------------------------------------------------------ */
/* Gold words: Lakshmi (04) and the dawn (07)                           */
/* ------------------------------------------------------------------ */

const DARK_TXT = "0 0 22px rgba(14,10,32,0.95), 0 5px 0 #0E0A1C";
const plate = (a: number) => `radial-gradient(ellipse at center, rgba(14,10,32,${a}) 0%, rgba(14,10,32,${a * 0.62}) 55%, rgba(14,10,32,0) 100%)`;
const goldShadow = (g: number) => `0 0 ${30 + 30 * g}px rgba(255,201,77,${0.55 + 0.35 * g}), 0 6px 0 #4A2A08`;
const popIn = (f: number, at: number) => {
  const k = ramp(f, at - 2, at + 5, "out");
  return { k, s: k > 0 ? track(f - at + 2, [[0, 0.6], [6, 1.14, "out"], [10, 1, "io"]]) : 0.6 };
};

/** 04: 'जिस घर में दीया जलता है,' with 'दीया' turning gold on 'दीया', then 'मैं वहीं' and 'आती हूँ।' building in gold.
    Fully gone by `out` (the scene end). */
export const GoldWordsD3: React.FC<{ f: number; out: number; top?: number }> = ({ f, out, top = 1400 }) => {
  const A = cue("lakshmi04", 650);
  if (f < A - 2 || f > out) return null;
  const o = 1 - ramp(f, out - 10, out, "in");
  const a = ramp(f, A - 2, A + 8, "out");
  const d = ramp(f, cue("diya04", 695) - 2, cue("diya04", 695) + 8, "out");
  const w1 = popIn(f, cue("cap04b", 741));
  const w2 = popIn(f, cue("aati04", 771));
  const big: React.CSSProperties = { fontFamily: ROZHA, fontSize: 100, lineHeight: 1.1, color: "#FFD36B", display: "inline-block" };
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
      <div style={{ position: "absolute", left: 60, top: -36, width: 960, height: 260, borderRadius: 130, background: plate(0.72) }} />
      <div style={{ position: "relative", fontFamily: ROZHA, fontSize: 56, lineHeight: 1.15, color: "#F6EBD6", opacity: a, whiteSpace: "nowrap", textShadow: DARK_TXT }}>
        जिस घर में <span style={{ color: d > 0.5 ? "#FFD36B" : "#F6EBD6", textShadow: `0 0 ${20 * d}px rgba(255,201,77,${0.6 * d}), ${DARK_TXT}` }}>दीया</span> जलता है,
      </div>
      <div style={{ position: "relative", display: "flex", gap: 24, alignItems: "baseline", marginTop: 4, whiteSpace: "nowrap" }}>
        <span style={{ ...big, opacity: w1.k, transform: `scale(${w1.s})`, textShadow: goldShadow(0) }}>मैं वहीं</span>
        <span style={{ ...big, opacity: w2.k, transform: `scale(${w2.s})`, textShadow: goldShadow(w2.k) }}>आती हूँ।</span>
      </div>
    </div>
  );
};

/** 07: 'हर दशा बदलती है।' as it is said, then 'हर अंधेरा ख़त्म होता है' in gold on 'अंधेरा', glowing as diya 3 lights on
    'ख़त्म'. It sits below the diya row (centre y 1000) and carries 07, which has no caption. Gone by `out`. */
export const DawnWordsD3: React.FC<{ f: number; out: number; top?: number }> = ({ f, out, top = 1300 }) => {
  const r = LINES["07_narrator"];
  const A = r ? r[0] : cue("badalti07", 1329) - 30;
  if (f < A - 2 || f > out) return null;
  const o = 1 - ramp(f, out - 10, out, "in");
  const a = ramp(f, A - 2, A + 8, "out");
  const w = popIn(f, cue("andhera07", 1375));
  const g = ramp(f, cue("khatam07", 1390), cue("khatam07", 1390) + 12, "out");
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
      <div style={{ position: "absolute", left: 60, top: -36, width: 960, height: 250, borderRadius: 125, background: plate(0.6) }} />
      <div style={{ position: "relative", fontFamily: ROZHA, fontSize: 60, lineHeight: 1.15, color: "#F6EBD6", opacity: a, textShadow: DARK_TXT }}>हर दशा बदलती है।</div>
      <div style={{ position: "relative", fontFamily: ROZHA, fontSize: 96, lineHeight: 1.12, color: "#FFD36B", marginTop: 4, whiteSpace: "nowrap", opacity: w.k, transform: `scale(${w.s})`, textShadow: goldShadow(g) }}>
        हर अंधेरा ख़त्म होता है
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

// Split without its own cue: 02's 'अपनी' sits about 55% of the way from 'तुला' to 'कमज़ोर'.
const APNI02 = Math.round(cue("tula02") + 0.55 * (cue("kamzor02") - cue("tula02")));

export const CAPS_D3: Cap[] = [
  // 01 is the hook plate, 04 and 07 the gold words, 08 the phone and the card
  ...split("02_narrator", [["Amavasya ka chandrama, bina roshni.", ["Amavasya", "roshni."]], ["Aur Surya Tula raashi mein,", ["Surya", "Tula"]], ["apni sabse kamzor avastha mein.", ["kamzor"]]], [cue("cap02b"), APNI02]),
  ...split("03_narrator", [["To rishiyon ne kaha, aasmaan mein roshni kam ho...", ["rishiyon", "roshni"]], ["to dharti par diye jalao.", ["dharti", "diye"]]], [cue("cap03b")]),
  ...split("05_narrator", [["Maanyata hai, isi raat vanvaas se", ["vanvaas"]], ["Ram Ayodhya laute the...", ["Ram", "Ayodhya"]], ["aur Ayodhya diyon se jagmaga uthi.", ["diyon", "jagmaga"]]], [cue("ram05"), cue("cap05b")]),
  ...split("06_narrator", [["Chaudah saal ka vanvaas bhi khatam hua.", ["Chaudah", "saal", "khatam"]], ["Jyotish mein, jeevan ke daur ko kehte hain... Dasha.", ["Jyotish", "daur", "Dasha."]]], [cue("cap06b")]),
];

export const CaptionsD3: React.FC<{ f: number; y?: number }> = ({ f, y = 1500 }) => {
  const c = CAPS_D3.find((k) => f >= k.from && f < k.to);
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
/* 08: the real app on the phone, with a drawn dasha card               */
/* ------------------------------------------------------------------ */

/** A drawn card (not app UI) that drops onto the phone top on 'दशा'. It is labelled उदाहरण, so the example never
    reads as anyone's real chart. */
export const FeatureD3: React.FC<{ f: number; out: number }> = ({ f, out }) => (
  <FeatureCard f={f} at={cue("dasha08", 1495) - 2} out={out} icon="dasha" title="अभी: गुरु महादशा" line2="उदाहरण · आपकी दशा अलग हो सकती है" x={130} y={380} w={820} />
);

export const AppPhoneD3: React.FC<{ f: number; at: number; out: number }> = ({ f, at, out }) => (
  <AppPhone
    f={f}
    at={at}
    out={out}
    chip={<AppChip label="आपकी दशा · फ़्री" />}
    chipAt={cue("free08", at + 140)}
    greeting="दिवाली की हार्दिक शुभकामनाएँ"
    greetAt={cue("cap08b", at + 170)}
  />
);

/* ------------------------------------------------------------------ */
/* End card: tomorrow's question (GovardhanTease sits left, in the svg) */
/* ------------------------------------------------------------------ */

export const EndTeaseD3: React.FC<{ f: number; at: number }> = ({ f, at }) => (
  <EndTease f={f} at={at} kicker="AGLA · CHAUTHA DIYA" lines={["कृष्ण ने छोटी उंगली पे", "पहाड़ क्यों उठाया?"]} sub="Govardhan Puja · Din 4" left={490} top={230} />
);

/** The series' corner bug, stronger than manthan/graphics BrandBug so the name reads on a phone (as on Day 2). */
export const BrandBugD3: React.FC<{ o: number }> = ({ o }) => (
  <div style={{ position: "absolute", left: 30, top: 96, padding: "6px 22px 6px 10px", borderRadius: 44, background: "rgba(12,10,7,0.5)", display: "flex", alignItems: "center", gap: 12, opacity: o * 0.95 }}>
    <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: 86, height: 70, objectFit: "contain" }} />
    <div style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 40, color: P.jGoldLight, letterSpacing: 2 }}>Jyotiq</div>
  </div>
);

/** The ask under the brand block: send it before tonight's puja, and follow for the next diya. Ends above y 1670. */
export const EndShareD3: React.FC<{ f: number }> = ({ f }) => {
  const at = cue("offer", 1624) + 8;
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
        <span style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 34, color: "#2A1604", whiteSpace: "nowrap" }}>Puja se pehle ghar walon ko bhejo</span>
      </div>
      <div style={{ fontFamily: JAKARTA, fontWeight: 700, fontSize: 30, color: "#F3DB9D", whiteSpace: "nowrap" }}>Follow karo · chautha diya aa raha hai</div>
    </div>
  );
};

/** The comment prompt runs on two lines so the pill stays clear of the right rail. */
export const EndBrandD3: React.FC<{ f: number; at: number }> = ({ f, at }) => (
  <EndBrand
    f={f}
    at={at}
    offerAt={cue("offer", at + 45)}
    comment={
      <>
        Comment karo:
        <br />
        <span style={{ color: "#FFC94D" }}>Aapki kaunsi dasha chal rahi hai?</span>
      </>
    }
  />
);
