import React from "react";
import { JAKARTA, ROZHA } from "../../manthan/graphics";
import { P, ramp, track } from "../../manthan/style";
import { EndBrand, EndTease, FeatureCard } from "../shared/endD";
import { AppChip, AppPhone } from "../shared/phone";
import { Chip, ChipText, HookChip, HookPlate, QPill, SeriesTitle } from "../shared/titleD";
import { CUES, LINES, SCENES } from "./timing";

/* Diwali Day 4 (गोवर्धन पूजा · अन्नकूट) graphics, in the series style (the shared titleD pieces). Retention layer:
   - the hook plate from frame 0 (sound-off): 'अन्नकूट में हर सब्ज़ी' / 'एक साथ क्यों?', the '?' on 'क्यों', then the
     answer chip 'जवाब: एक पहाड़ के नीचे' (with a drawn hill) on 'जवाब';
   - the title: पाँच दीये · DIN 4 · गोवर्धन पूजा;
   - 05: Krishna's words in gold, 'डरो मत।' then 'प्रकृति का सम्मान = रक्षा';
   - 06: 'अन्न + कूट = अन्नकूट' on 'वही'; 07: 'गोचर = ग्रहों की चाल' (07 has no caption: the diya row sits low).
   Captions, the gochar card, the phone and the end card follow in this file. */

const cue = (k: string, dflt = 99999): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);
const DARK_TXT = "0 0 22px rgba(14,10,32,0.95), 0 5px 0 #0E0A1C";
const plate = (a: number) => `radial-gradient(ellipse at center, rgba(14,10,32,${a}) 0%, rgba(14,10,32,${a * 0.62}) 55%, rgba(14,10,32,0) 100%)`;
const goldShadow = (g: number) => `0 0 ${30 + 30 * g}px rgba(255,201,77,${0.55 + 0.35 * g}), 0 6px 0 #4A2A08`;
const popIn = (f: number, at: number) => {
  const k = ramp(f, at - 2, at + 5, "out");
  return { k, s: k > 0 ? track(f - at + 2, [[0, 0.6], [6, 1.14, "out"], [10, 1, "io"]]) : 0.6 };
};

const HillIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="-12 -12 24 24" style={{ display: "block" }}>
    <path d="M-11 8C-8 2 -4 -6 0 -9C4 -6 8 2 11 8Z" fill="#3E6A2E" stroke="#C9E6A3" strokeWidth={1.2} />
    <circle cx={-3} cy={-2} r={2.2} fill="#5A8A3A" />
    <circle cx={3} cy={1} r={2.4} fill="#5A8A3A" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Hook plate and title                                                */
/* ------------------------------------------------------------------ */

export const HookPlateD4: React.FC<{ f: number; out: number }> = ({ f, out }) => (
  <HookPlate f={f} out={out} l1="अन्नकूट में हर सब्ज़ी" l2="एक साथ क्यों?">
    <QPill f={f} at={cue("kyon01", 95) - 2} />
    <HookChip f={f} at={cue("jawab01", 140)}>
      <HillIcon size={46} />
      <span style={{ fontFamily: ROZHA, fontSize: 50, color: "#FFF6E4" }}>जवाब:</span>
      <span style={{ fontFamily: ROZHA, fontSize: 50, color: "#FFD36B" }}>एक पहाड़ के नीचे</span>
    </HookChip>
  </HookPlate>
);

export const TitleCardD4: React.FC<{ f: number; at: number; out: number }> = ({ f, at, out }) => (
  <SeriesTitle f={f} at={at} out={out} din={4} hi="गोवर्धन पूजा" en="GOVARDHAN PUJA" />
);

/* ------------------------------------------------------------------ */
/* 05: Krishna's words in gold                                          */
/* ------------------------------------------------------------------ */

/** 'डरो मत।' as he says it, then 'प्रकृति का सम्मान' on the first 'प्रकृति' and '= रक्षा' on 'रक्षा'. Gone by `out`. */
export const GoldWordsD4: React.FC<{ f: number; out: number; top?: number }> = ({ f, out, top = 1360 }) => {
  const A = cue("daro05", 852);
  if (f < A - 2 || f > out) return null;
  const o = 1 - ramp(f, out - 10, out, "in");
  const a = ramp(f, A - 2, A + 8, "out");
  const w1 = popIn(f, cue("prakriti05", 897));
  const w2 = popIn(f, cue("raksha05", 996));
  const big: React.CSSProperties = { fontFamily: ROZHA, fontSize: 92, lineHeight: 1.1, color: "#FFD36B", display: "inline-block" };
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
      <div style={{ position: "absolute", left: 60, top: -36, width: 960, height: 250, borderRadius: 125, background: plate(0.72) }} />
      <div style={{ position: "relative", fontFamily: ROZHA, fontSize: 64, lineHeight: 1.15, color: "#F6EBD6", opacity: a, textShadow: DARK_TXT }}>डरो मत।</div>
      <div style={{ position: "relative", display: "flex", gap: 20, alignItems: "baseline", marginTop: 4, whiteSpace: "nowrap" }}>
        <span style={{ ...big, opacity: w1.k, transform: `scale(${w1.s})`, textShadow: goldShadow(0) }}>प्रकृति का सम्मान</span>
        <span style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 60, color: P.jGoldLight, opacity: w2.k }}>=</span>
        <span style={{ ...big, opacity: w2.k, transform: `scale(${w2.s})`, textShadow: goldShadow(w2.k) }}>रक्षा</span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Chips                                                               */
/* ------------------------------------------------------------------ */

/** 06: 'अन्न + कूट = अन्नकूट' from 'वही' as the pile becomes the thali, gone before the cut to the wheel. */
export const AnnakootChipD4: React.FC<{ f: number; top?: number }> = ({ f, top = 300 }) => {
  const [, end] = SCENES.annakoot;
  return (
    <Chip f={f} at={cue("cap06b", 1255)} out={end - 8} top={top}>
      <ChipText>अन्न + कूट =</ChipText>
      <ChipText gold>अन्नकूट</ChipText>
    </Chip>
  );
};

/** 07: 'गोचर = ग्रहों की चाल' from just after 'बदलाव' (07's topic, ahead of the word for sound-off viewers). */
export const GocharChipD4: React.FC<{ f: number; top?: number }> = ({ f, top = 300 }) => {
  const [, end] = SCENES.gochar;
  return (
    <Chip f={f} at={cue("badlav07", 1374) + 10} out={end - 10} top={top}>
      <ChipText gold>गोचर</ChipText>
      <ChipText>= ग्रहों की चाल</ChipText>
    </Chip>
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

// Splits without their own cue: 02's 'पूजा' sits midway between 'कृष्ण' and 'पर्वत'; 04's 'पूरा' about one word
// before 'गोवर्धन'; 06's 'सब' about one word after 'मिला'.
const POOJA02 = Math.round((cue("krishna02") + cue("parvat02")) / 2);
const POORA04 = cue("govardhan04") - 15;
const SAB06 = cue("mila06") + 15;

export const CAPS_D4: Cap[] = [
  // 01 is the hook plate, 05 the gold words, 07 the chip (the diya row sits low), 08 the phone and the card
  ...split("02_narrator", [["Gokul waale Indra ko poojte the.", ["Gokul", "Indra"]], ["Krishna bole...", ["Krishna"]], ["pooja us parvat ki karo, jo humein paalta hai.", ["parvat"]]], [cue("krishna02"), POOJA02]),
  ...split("03_narrator", [["Indra krodhit hue.", ["Indra", "krodhit"]], ["Saat din, saat raat, bhayankar toofaan.", ["Saat", "toofaan."]]], [cue("saat03")]),
  ...split("04_narrator", [["Krishna ne chhoti ungli par", ["Krishna", "ungli"]], ["poora Govardhan utha liya...", ["Govardhan"]], ["saara gaon uske neeche.", ["gaon"]]], [POORA04, cue("cap04b")]),
  ...split("06_narrator", [["Kehte hain, saat din pahaad ke neeche jo bhi mila,", ["pahaad"]], ["sab milakar pakaya gaya...", ["milakar"]], ["wahi hai Annakoot.", ["Annakoot."]]], [SAB06, cue("cap06b")]),
];

export const CaptionsD4: React.FC<{ f: number; y?: number }> = ({ f, y = 1500 }) => {
  const c = CAPS_D4.find((k) => f >= k.from && f < k.to);
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
/* 08: the real app on the phone, with a drawn gochar card              */
/* ------------------------------------------------------------------ */

/** A drawn card (not app UI) on 'शनि'. Saturn is in sidereal Pisces through Nov 2026, the same for everyone; the
    card still says उदाहरण, since it stands in for the app's view. */
export const FeatureD4: React.FC<{ f: number; out: number }> = ({ f, out }) => (
  <FeatureCard f={f} at={cue("shani08", 1495) - 2} out={out} icon="gochar" title="अभी: शनि मीन में" line2="उदाहरण · हर ग्रह की चाल, रोज़" x={130} y={380} w={820} />
);

export const AppPhoneD4: React.FC<{ f: number; at: number; out: number }> = ({ f, at, out }) => (
  <AppPhone
    f={f}
    at={at}
    out={out}
    chip={<AppChip label="गोचर · फ़्री" />}
    chipAt={cue("free08", at + 140)}
    greeting="गोवर्धन पूजा की शुभकामनाएँ"
    greetAt={cue("cap08b", at + 170)}
  />
);

/* ------------------------------------------------------------------ */
/* End card: tomorrow's question (BhaiDoojTease sits left, in the svg)  */
/* ------------------------------------------------------------------ */

export const EndTeaseD4: React.FC<{ f: number; at: number }> = ({ f, at }) => (
  <EndTease f={f} at={at} kicker="KAL · PAANCHWA DIYA" lines={["यमराज अपनी बहन", "के घर क्यों गए?"]} sub="Bhai Dooj · Din 5" left={490} top={230} />
);

/** The comment prompt runs on two lines so the pill stays clear of the right rail. */
export const EndBrandD4: React.FC<{ f: number; at: number }> = ({ f, at }) => (
  <EndBrand
    f={f}
    at={at}
    offerAt={cue("offer", at + 45)}
    comment={
      <>
        Comment karo:
        <br />
        <span style={{ color: "#FFC94D" }}>Aapke ghar annakoot banta hai?</span>
      </>
    }
  />
);
