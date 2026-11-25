import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AppStoreButton, PlayButton } from "../../katha/reelKit";
import { H, ramp, W } from "../../manthan/style";
import { DiyaDefs, DiyaRow } from "../d1/diya";
import { AppPhone } from "../shared/phone";
import { EndBrand, EndTease, FeatureCard } from "../shared/endD";
import { C } from "./cues";
import {
  Callout, Captions, DashaBoard, EMBER, Flash, GOLD, Grade, Head, In, LEAF, ListCard, Motes, MUKTA, NameCard, PlayPhone, Shot, ShotDef, SkyBoard, Stamp, Strip, YearCounter,
} from "./gfx";
import { TOTAL } from "./timing";

/* Diwali Day 3, the Bharat story. Kaal narrates; every beat is driven by the voice timing in cues.ts. */

export const STORY3_TOTAL = TOTAL;
const fr = (s: number) => Math.round(s * 30);

const SHOTS: ShotDef[] = [
  { t: 0, src: "city_lit", clip: 6, from: [1.0, 0, 0], to: [1.12, 0, -30] },
  { t: C.hookOut + 0.15, src: "city_dark", from: [1.1, 0, -24], to: [1.17, 0, -50], in: "slow" },
  { t: C.tally, src: "tally_hand", clip: 6, from: [1.0, 0, 0], to: [1.08, 0, 0], in: "whipL" },
  { t: C.kaal, src: "kaal_wheel", clip: 8, from: [1.0, 0, 0], to: [1.1, 0, 30], in: "whipU" },
  { t: C.bharat, src: "char_bharat", from: [1.04, 0, 20], to: [1.2, -30, 60], in: "focus" },
  { t: C.forest, src: "forest_wide", clip: 6, from: [1.02, 0, 0], to: [1.12, 0, 0], in: "whipR" },
  { t: C.plea, src: "bharat_plea", from: [1.06, 0, 0], to: [1.22, 0, 30], in: "focus" },
  { t: C.ram, src: "ram_answer", from: [1.16, 0, 20], to: [1.06, 0, 0], in: "dissolve" },
  { t: C.sandals, src: "sandals_hands", from: [1.08, 20, 0], to: [1.2, -20, 0], in: "whipL" },
  { t: C.throne, src: "throne", clip: 6, from: [1.0, 0, 0], to: [1.08, 0, 0], in: "focus" },
  { t: C.hut, src: "hut_sleep", from: [1.16, 40, 0], to: [1.04, -20, 0], in: "dissolve" },
  { t: C.years, src: "season_summer", from: [1.04, 0, 0], to: [1.08, 0, 0], in: "whipU" },
  { t: C.years + 0.42, src: "season_monsoon", from: [1.08, 0, 0], to: [1.11, 0, 0], in: "dissolve" },
  { t: C.years + 0.84, src: "season_winter", from: [1.11, 0, 0], to: [1.13, 0, 0], in: "dissolve" },
  { t: C.years + 1.26, src: "season_spring", from: [1.13, 0, 0], to: [1.15, 0, 0], in: "dissolve" },
  { t: C.mark, src: "tally_hand", clip: 6, from: [1.08, 0, 0], to: [1.2, 0, 0], in: "whipL" },
  { t: C.question, src: "bharat_door", from: [1.05, 0, 20], to: [1.18, -24, 60], in: "dissolve" },
  { t: C.lastDay, src: "last_road", clip: 6, from: [1.0, 0, 0], to: [1.09, 0, -20], in: "slow" },
  { t: C.wood, src: "wood_stack", from: [1.02, 0, 0], to: [1.12, 0, 20], in: "dissolve" },
  { t: C.kaal2, src: "kaal_close", from: [1.05, 0, 0], to: [1.28, 0, 30], in: "focus" },
  { t: C.kaal2End - 0.2, src: "wood_stack", from: [1.2, 0, 30], to: [1.24, 0, 34], in: "slow", dim: 0.72 },
  { t: C.rukiye, src: "hanuman_sky", clip: 6, from: [1.0, 0, 0], to: [1.14, 0, 0], in: "whipU" },
  { t: C.land, src: "hanuman_land", clip: 6, from: [1.08, 0, 0], to: [1.0, 0, 0], in: "cut" },
  { t: C.soch, src: "news_runner", clip: 6, from: [1.0, 0, 0], to: [1.1, 0, 0], in: "whipL" },
  { t: C.amavas, src: "moon_sky", from: [1.14, 0, 90], to: [1.04, 0, 20], in: "focus" },
  { t: C.notSky, src: "woman_diya", clip: 6, from: [1.02, 0, 0], to: [1.14, 0, 0], in: "cut" },
  { t: C.homes, src: "pushpak", clip: 8, from: [1.0, 0, 0], to: [1.08, 0, 10], in: "dissolve" },
  { t: C.relief, src: "embrace", clip: 6, from: [1.02, 0, 0], to: [1.14, 0, 0], in: "dissolve" },
  { t: C.lakshmi, src: "lakshmi_door", clip: 6, from: [1.0, 0, 0], to: [1.08, 0, 0], in: "focus" },
  { t: C.puja, src: "puja_home", from: [1.03, 10, 0], to: [1.12, -14, 10], in: "whipL" },
  { t: C.dhyan, src: "char_lakshmi", from: [1.05, 0, 0], to: [1.18, 0, 30], in: "focus", dim: 0.42 },
  { t: C.you, src: "job", from: [1.02, 0, 0], to: [1.14, 0, 16], in: "whipU" },
  { t: C.marriage, src: "marriage", from: [1.06, 0, 0], to: [1.14, 0, 0], in: "whipL" },
  { t: C.money, src: "money", from: [1.04, 0, 0], to: [1.2, 0, 24], in: "whipR" },
  { t: C.dasha, src: "grahas", from: [1.1, 0, 60], to: [1.02, 0, 30], in: "focus" },
  { t: C.knew, src: "bharat_smile", from: [1.04, 0, 10], to: [1.18, 0, 44], in: "dissolve" },
  { t: C.phone, src: "hand_phone_bg", from: [1.1, 0, 0], to: [1.26, 0, 0], in: "focus" },
  { t: C.signoff - 0.1, src: "city_lit", from: [1.04, 0, 0], to: [1.12, 0, 0], in: "slow", dim: 0.5 },
];

/** Frames the outgoing shot stays under the incoming one, per transition. */
const COVER: Record<In, number> = { cut: 0, whipL: 9, whipR: 9, whipU: 9, dissolve: 13, focus: 7, slow: 27 };

const LABELS: [number, string][] = [
  [0, "अयोध्या · दिवाली की रात"],
  [C.tally, "नंदीग्राम · अयोध्या के बाहर"],
  [C.kaal, "काल · समय"],
  [C.bharat, "भरत की कथा"],
  [C.forest, "चित्रकूट · वनवास का आरंभ"],
  [C.throne, "अयोध्या · राजमहल"],
  [C.hut, "नंदीग्राम"],
  [C.lastDay, "नंदीग्राम · आख़िरी दिन"],
  [C.kaal2, "काल · समय"],
  [C.rukiye, "नंदीग्राम · सूर्यास्त"],
  [C.soch, "अयोध्या · कार्तिक अमावस"],
  [C.lakshmi, "दीपावली"],
  [C.puja, "आज · लक्ष्मी पूजा"],
  [C.you, "आज · आपकी बात"],
  [C.dasha, "ज्योतिष · विंशोत्तरी दशा"],
  [C.knew, "नंदीग्राम"],
  [C.phone, "ऐप · आपकी दशा"],
];

const Glow: React.FC<{ f: number; at: number; out: number; x: number; y: number; r: number; color?: string }> = ({ f, at, out, x, y, r, color = "255,170,80" }) => {
  if (f < at || f > out) return null;
  const v = (0.72 + 0.28 * Math.sin(f / 3.2) * Math.sin(f / 7.3)) * ramp(f, at, at + 10, "lin");
  return <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle, rgba(${color},${0.42 * v}) 0%, rgba(${color},0) 70%)`, mixBlendMode: "screen" }} />;
};

export const Story3: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  const active = SHOTS.map((def, i) => ({ def, i, start: fr(def.t), end: i + 1 < SHOTS.length ? fr(SHOTS[i + 1].t) : TOTAL })).filter(({ i, start, end }) => f >= start && f < end + COVER[SHOTS[i + 1]?.in ?? "cut"]);
  const label = [...LABELS].reverse().find(([t]) => sec >= t)?.[1] ?? "";
  const endCard = sec >= C.signoff - 0.05;
  const shakeAmt = Math.max(0, 1 - Math.abs(f - fr(C.land) - 4) / 16);
  const shake = shakeAmt > 0 ? [Math.sin(f * 2.3) * 22 * shakeAmt, Math.cos(f * 2.9) * 22 * shakeAmt] : [0, 0];
  const moonOut = fr(C.notSky);
  return (
    <AbsoluteFill style={{ background: "#07060C", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${shake[0]}px, ${shake[1]}px)` }}>
        {active.map(({ def, i, end }) => (
          <Shot key={i} f={f} def={def} end={end} />
        ))}
        {/* living light on the stills */}
        <Glow f={f} at={fr(C.bharat)} out={fr(C.forest)} x={930} y={1090} r={300} />
        <Glow f={f} at={fr(C.hut)} out={fr(C.years)} x={420} y={1250} r={320} />
        <Glow f={f} at={fr(C.question)} out={fr(C.lastDay)} x={200} y={1100} r={380} />
        <Glow f={f} at={fr(C.puja)} out={fr(C.dhyan)} x={250} y={1100} r={360} />
        <Motes f={f} kind="dust" op={sec < C.rukiye ? 0.75 : 0} n={26} />
        <Motes f={f} kind="ember" op={sec >= C.notSky && sec < C.puja ? 0.9 : sec < C.tally ? 0.5 : 0} n={36} />
        <Motes f={f} kind="rain" op={sec >= C.years + 0.42 && sec < C.years + 0.84 ? 1 : 0} n={70} />
        <Motes f={f} kind="gold" op={sec >= C.dhyan && sec < C.you ? 0.9 : sec >= C.phone ? 0.8 : 0} n={28} />
      </div>

      <Grade f={f} capBand={!endCard} />

      {/* the transitions' light */}
      <Flash f={f} at={fr(C.kaal)} power={0.55} color="150,170,255" />
      <Flash f={f} at={fr(C.rukiye)} power={0.9} color="255,180,120" len={10} />
      <Flash f={f} at={fr(C.land)} power={1} len={16} />
      <Flash f={f} at={fr(C.notSky)} power={0.5} />
      <Flash f={f} at={fr(C.homes)} power={0.65} len={18} />
      <Flash f={f} at={fr(C.puja)} power={0.35} />
      <Flash f={f} at={fr(C.phone)} power={0.4} />

      {/* the story's words */}
      <Head f={f} at={-20} out={fr(C.darkCity) - 3} a="राम एक दिन और देर करते..." b="तो दिवाली होती ही नहीं" size={96} sizeB={108} />
      <Head f={f} at={fr(C.darkCity) + 3} out={fr(C.tally) - 2} a="क्योंकि अयोध्या के बाहर..." size={94} />
      <Head f={f} at={fr(C.tally) + 2} out={fr(C.kaal) - 2} a="एक आदमी" b="दिन गिन रहा था" c={GOLD} />
      <Head f={f} at={fr(C.kaal) + 2} out={fr(C.bharat) - 2} a="मैं काल हूँ" b="मैंने उसे गिनते देखा है" bAt={fr(C.kaalSaw)} c={GOLD} size={132} sizeB={82} />
      <NameCard f={f} at={fr(C.bharat) + 4} out={fr(C.forest) - 3} deva="भरत" latin="BHARAT" sub="राम के छोटे भाई" y={208} />
      <Head f={f} at={fr(C.forest) + 2} out={fr(C.plea) - 2} a="राम वन को गए," b="भरत जंगल तक दौड़े" c={GOLD} size={100} />
      <Head f={f} at={fr(C.pleaFourteen)} out={fr(C.ram) - 2} a="भरत का वचन" b="14 साल · एक दिन भी ज़्यादा नहीं" bAt={fr(C.pleaFire) - 8} c={EMBER} size={112} sizeB={70} />
      <Head f={f} at={fr(C.ram) + 3} out={fr(C.sandals) - 2} a="ऐसा ही हो" c={GOLD} size={132} />
      <Head f={f} at={fr(C.sandals) + 3} out={fr(C.throne) - 2} a="राम की खड़ाऊँ" size={118} />
      <Callout f={f} at={fr(C.sandals) + 14} out={fr(C.throne) - 4} x1={540} y1={980} x2={880} y2={720} text="चौदह साल की निशानी" />
      <Head f={f} at={fr(C.throne) + 4} out={fr(C.hut) - 2} a="सिंहासन पर राजा नहीं," b="सिर्फ़ खड़ाऊँ" c={GOLD} size={94} sizeB={118} />
      <Head f={f} at={fr(C.hut) + 3} out={fr(C.years) - 2} a="और राजा?" b="ज़मीन पर" bAt={fr(C.hutRaja) + 22} c={EMBER} size={128} />
      <YearCounter f={f} at={fr(C.years)} out={fr(C.question) - 2} />
      <Head f={f} at={fr(C.question) + 2} out={fr(C.kab) - 2} a="एक ही सवाल" size={120} />
      <Head f={f} at={fr(C.kab)} out={fr(C.lastDay) - 2} a="कब?" top={420} size={300} />
      <Head f={f} at={fr(C.lastDay) + 2} out={fr(C.wood) - 2} a="आख़िरी दिन" b="लंका से कोई ख़बर नहीं" bAt={fr(C.noNews)} c={EMBER} size={126} sizeB={82} />
      <Head f={f} at={fr(C.wood) + 2} out={fr(C.kaal2) - 2} a="वचन का समय आ गया" size={92} />
      <Head f={f} at={fr(C.kaal2) + 3} out={fr(C.kaal2End) + 2} a="काल" b="किसी के लिए नहीं रुकता" bAt={fr(C.kaal2Stop)} c={EMBER} size={140} sizeB={78} />
      <Head f={f} at={fr(C.rukiye) + 2} out={fr(C.ramComing) - 1} a="रुकिए!" c={GOLD} size={170} />
      <Head f={f} at={fr(C.ramComing)} out={fr(C.soch) - 2} a="राम आ रहे हैं!" c={GOLD} top={250} size={146} />
      <Head f={f} at={fr(C.soch) + 3} out={fr(C.amavas) - 2} a="ख़बर फैल गई" size={118} />
      <Head f={f} at={fr(C.amavas) + 3} out={fr(C.twoLamps) - 2} a="कार्तिक अमावस" b="चाँद ज़ीरो · सूरज सबसे कमज़ोर" bAt={fr(C.sun)} c={GOLD} size={118} sizeB={66} />
      <SkyBoard f={f} moonAt={fr(C.moon) - 8} zeroAt={fr(C.zero)} sunAt={fr(C.sun)} neechAt={fr(C.neech)} dimAt={fr(C.twoLamps)} out={moonOut - 3} />
      <Head f={f} at={fr(C.twoLamps) + 2} out={fr(C.notSky) - 2} a="आसमान के दोनों दीये" b="मद्धम" c={EMBER} size={92} sizeB={120} />
      <Head f={f} at={fr(C.notSky)} out={fr(C.homes) - 2} a="आसमान नहीं," b="तो हम!" c={GOLD} size={140} />
      <Head f={f} at={fr(C.homes) + 3} out={fr(C.relief) - 3} a="घर-घर दीये" c={GOLD} size={150} />
      <Head f={f} at={fr(C.relief) + 3} out={fr(C.lakshmi) - 3} a="पहली दिवाली" b="राहत की रात थी" bAt={fr(C.reliefWord) - 4} c={GOLD} size={112} />
      <Head f={f} at={fr(C.lakshmi) + 3} out={fr(C.puja) - 2} a="जहाँ दीया," b="वहाँ लक्ष्मी" c={GOLD} size={132} />
      <NameCard f={f} at={fr(C.lakshmi) + 16} out={fr(C.puja) - 3} deva="लक्ष्मी" latin="LAKSHMI" y={1210} />
      <Head f={f} at={fr(C.puja) + 4} out={fr(C.dhyan) - 2} a="आज की पूजा" b="सूर्यास्त के बाद" bAt={fr(C.pradosh) - 18} c={GOLD} size={92} sizeB={92} />
      <Stamp f={f} at={fr(C.pradosh)} out={fr(C.dhyan) - 3} text="प्रदोष काल" x={300} y={900} color={GOLD} size={76} />

      {/* the silent Play Store moment in the free space on the right */}
      <PlayPhone f={f} at={fr(C.puja) + 12} out={fr(C.dhyan) - 10} x={650} y={450} />

      <Head f={f} at={fr(C.dhyan) + 2} out={fr(C.you) - 2} a="लक्ष्मी तीसरे दिन क्यों?" size={92} />
      <ListCard f={f} at={fr(C.third)} out={fr(C.you) + 2} title="दिवाली का क्रम" items={[{ text: "सेहत", at: fr(C.health), color: LEAF }, { text: "निडरता", at: fr(C.fearless), color: EMBER }, { text: "धन", at: fr(C.wealth), color: "#E0A020" }]} />
      <Head f={f} at={fr(C.you) + 3} out={fr(C.job) - 2} a="हर किसी का" b="अपना वनवास" c={GOLD} size={112} />
      <Stamp f={f} at={fr(C.job)} out={fr(C.marriage) - 1} text="नौकरी" x={540} y={460} size={120} />
      <Stamp f={f} at={fr(C.marriage)} out={fr(C.money) - 1} text="शादी" x={540} y={460} size={120} rot={4} />
      <Stamp f={f} at={fr(C.money)} out={fr(C.kabEnd) - 2} text="पैसा" x={540} y={460} size={120} />
      <Head f={f} at={fr(C.kabEnd)} out={fr(C.dasha) - 2} a="कब ख़त्म होगा?" c={GOLD} top={300} size={136} />
      <Head f={f} at={fr(C.dashaWord)} out={fr(C.nine) - 2} a="दशा" b="जीवन का एक दौर" c={GOLD} size={150} sizeB={78} />
      <DashaBoard f={f} at={fr(C.nine) + 2} out={fr(C.knew) - 3} shani={fr(C.shani)} rahu={fr(C.rahu)} surya={fr(C.surya)} dateAt={fr(C.date)} />
      <Head f={f} at={fr(C.nine)} out={fr(C.date) - 2} a="9 ग्रह · 120 साल" c={GOLD} size={118} />
      <Head f={f} at={fr(C.date) + 2} out={fr(C.knew) - 3} a="हर दशा की" b="एक तारीख़ होती है" c={GOLD} size={100} sizeB={104} />
      <Head f={f} at={fr(C.knew) + 2} out={fr(C.phone) - 3} a="भरत चौदह साल टिके" b="क्योंकि तारीख़ पता थी" bAt={fr(C.knewDate) - 12} c={GOLD} size={96} sizeB={90} />

      {/* the close */}
      {sec >= C.phone && sec < C.signoff ? (
        <>
          <Head f={f} at={fr(C.phone) + 2} out={fr(C.signoff) - 2} a="आपकी दशा कब बदलेगी?" c={GOLD} top={202} size={94} />
          <AppPhone f={f} at={fr(C.phone) + 2} out={fr(C.signoff) - 2} chip={<span style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 40, color: "#FFF6E4" }}>पूरी दशा टाइमलाइन · <span style={{ color: GOLD }}>फ़्री</span></span>} chipAt={fr(C.timeline)} />
          <FeatureCard f={f} at={fr(C.phone) + 24} out={fr(C.download) - 2} icon="dasha" title="अभी: गुरु महादशा" line2="उदाहरण" x={110} y={520} w={760} />
          {f >= fr(C.download) ? (
            <div style={{ position: "absolute", left: 0, width: W, top: 1362, display: "flex", justifyContent: "center", gap: 18, opacity: ramp(f, fr(C.download), fr(C.download) + 8, "out"), transform: "scale(0.72)", transformOrigin: "50% 0" }}>
              <PlayButton glow={0.5 + 0.5 * Math.sin(f / 8)} />
              <AppStoreButton glow={0.5 + 0.5 * Math.sin(f / 8)} />
            </div>
          ) : null}
        </>
      ) : null}

      {endCard ? (
        <>
          <div style={{ position: "absolute", inset: 0, background: "rgba(7,5,12,0.46)", opacity: ramp(f, fr(C.signoff) - 3, fr(C.signoff) + 12, "lin") }} />
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            <DiyaDefs />
            <DiyaRow f={f} y={640} lit={[1, 1, 1, 0, 0]} labels={1} highlight={3} hl={0.6} scale={0.72} />
          </svg>
          <EndTease f={f} at={fr(C.signoff)} kicker="AGLA DIYA" lines={["छप्पन भोग,", "छप्पन ही क्यों?"]} sub="Follow karo, agla diya mat chhodna" left={70} top={204} />
          <EndBrand f={f} at={fr(C.signoff)} offerAt={fr(C.signoff) + 16} comment="Comment karo: aapka vanvaas kab khatam hoga?" top={830} />
        </>
      ) : null}

      <Strip f={f} label={label} lit={2} litAt={fr(C.homes)} hide={endCard} />
      <Captions f={f} hide={endCard} />
    </AbsoluteFill>
  );
};
